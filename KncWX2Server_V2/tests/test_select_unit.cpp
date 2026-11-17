// tests/test_select_unit.cpp — SELECT_UNIT 最短路徑垂直切片測試
// 涵蓋：REQ/ACK 線路 codec（含 golden bytes）、UnitSelectArbiter 決策（in-memory game DB）、
//      loopback TCP 完整流程（Session 握手 → CONNECT → VERIFY → SELECT_UNIT，含歸屬錯誤/不存在兩路徑，
//      account DB 與 game DB 雙庫聯動）。
// ⚠ SELECT_UNIT_1_NOT…5_NOT 分片（KUnitInfo/背包/任務/寵物等，約 20 個巢狀型別）尚未移植；
//   本測試只驗證 REQ 解碼 → 決策 → 收尾 EGS_SELECT_UNIT_ACK。
//   golden bytes 為自洽佈局，未對原 SDK 實機驗證。
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>
#include <functional>
#include <thread>
#include <atomic>
#include <chrono>
#include <unistd.h>

#include "../src/core/Event.h"
#include "../src/core/EventIDs.h"
#include "../src/core/NetError.h"
#include "../src/core/Serializer.h"
#include "../src/db/GameStore.h"
#include "../src/db/Sqlite.h"
#include "../src/db/UserStore.h"
#include "../src/net/Session.h"
#include "../src/server/LoginArbiter.h"
#include "../src/server/LoginProtocol.h"
#include "../src/server/SelectUnitProtocol.h"
#include "../src/server/UnitSelectArbiter.h"

using namespace x2;
using namespace x2::db;
using namespace x2::login;
using namespace x2::select_unit;

void RunSelectUnitTestsByRef(int& pass, int& fail);
static int g_pass_sel = 0, g_fail_sel = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_sel++; } \
    else { g_fail_sel++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static const uint16_t kSelectUnitReqID = static_cast<uint16_t>(EventID::EGS_SELECT_UNIT_REQ);
static const uint16_t kSelectUnitAckID = static_cast<uint16_t>(EventID::EGS_SELECT_UNIT_ACK);
static const uint16_t kConnectReqID = static_cast<uint16_t>(EventID::EGS_CONNECT_REQ);
static const uint16_t kConnectAckID = static_cast<uint16_t>(EventID::EGS_CONNECT_ACK);
static const uint16_t kVerifyReqID  = static_cast<uint16_t>(EventID::EGS_VERIFY_ACCOUNT_REQ);
static const uint16_t kVerifyAckID  = static_cast<uint16_t>(EventID::EGS_VERIFY_ACCOUNT_ACK);

static SerBuffer PutPayload(const std::function<bool(Serializer&)>& fn)
{
    Serializer ks;
    SerBuffer buf;
    if (!ks.BeginWriting(&buf)) return SerBuffer{};
    if (!fn(ks)) return SerBuffer{};
    ks.EndWriting();
    return buf;
}

static Event MakeEvent(uint16_t eventID, const SerBuffer& payload)
{
    Event ev;
    ev.eventID = eventID;
    ev.payload = payload;
    ev.dest.performerID = PerformerID::PI_GS_USER;
    return ev;
}

// ---- codec golden bytes ----
static void TestSelectUnitCodec()
{
    SelectUnitReq req;
    req.unitUID = 0x0102030405060708LL;
    Serializer ks;
    SerBuffer buf;
    CHECK(ks.BeginWriting(&buf), "begin");
    CHECK(PutSelectUnitReq(ks, req), "put req");
    ks.EndWriting();
    static const uint8_t expectReq[] = { 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08 };
    CHECK(buf.GetLength() == 8, "req is exactly 8 bytes");
    CHECK(std::memcmp(buf.GetData(), expectReq, 8) == 0, "req golden bytes (int64 BE)");

    Serializer ks2;
    SerBuffer tmp = buf;
    SelectUnitReq back;
    CHECK(ks2.BeginReading(&tmp), "begin read");
    CHECK(GetSelectUnitReq(ks2, back), "get req");
    ks2.EndReading();
    CHECK(back.unitUID == req.unitUID, "req roundtrip");

    SelectUnitAck ack;
    ack.iOK = ERR_SELECT_UNIT_07;
    SerBuffer buf2;
    Serializer ks3;
    CHECK(ks3.BeginWriting(&buf2), "begin ack");
    CHECK(PutSelectUnitAck(ks3, ack), "put ack");
    ks3.EndWriting();
    static const uint8_t expectAck[] = { 0x00, 0x00, 0x04, 0x39 };  // 1081 = 0x439
    CHECK(buf2.GetLength() == 4, "ack is 4 bytes");
    CHECK(std::memcmp(buf2.GetData(), expectAck, 4) == 0, "ack golden bytes 1081");

    Serializer ks4;
    SerBuffer tmp2 = buf2;
    SelectUnitAck ackBack;
    CHECK(ks4.BeginReading(&tmp2), "begin read ack");
    CHECK(GetSelectUnitAck(ks4, ackBack), "get ack");
    ks4.EndReading();
    CHECK(ackBack.iOK == ERR_SELECT_UNIT_07, "ack roundtrip");
}

// ---- arbiter 決策（in-memory game DB）----
static bool SeedGameDb(Database& db, std::string& err, int64_t& unitUIDOut, int64_t userUID = 777)
{
    if (!db.Open(":memory:", err)) return false;
    if (!ApplyGameMigrations(db, err)) return false;
    GameStore store(db);
    GUserRecord gu;
    if (!store.GetOrCreateGUser(userUID, "selecttester", gu, err)) return false;
    return store.CreateUnit(userUID, "選擇測試", 1, unitUIDOut, err) == CreateUnitResult::Ok;
}

static void TestUnitSelectArbiterDecisions()
{
    Database db;
    std::string err;
    int64_t unitUID = 0;
    CHECK(SeedGameDb(db, err, unitUID), "seed game db");
    GameStore store(db);

    SelectUnitReq req;
    SelectUnitAck ack;

    // 成功：歸屬正確
    req.unitUID = unitUID;
    int rc = HandleSelectUnitReq(store, 777, req, ack, err);
    CHECK(rc == NET_OK && ack.iOK == NET_OK, "own unit accepted");
    {
        bool found = false;
        GUnitRecord u;
        CHECK(store.GetUnitByUID(unitUID, u, found, err) && found, "unit re-read ok");
        CHECK(u.loginCount == 1, "loginCount incremented on successful select");
    }

    // 不存在
    req.unitUID = 0x7FFFFFFF00000001LL;
    rc = HandleSelectUnitReq(store, 777, req, ack, err);
    CHECK(rc == ERR_SELECT_UNIT_00 && ack.iOK == ERR_SELECT_UNIT_00, "unknown unit -> ERR_SELECT_UNIT_00");

    // 歸屬錯誤（unit 屬於 777，以 888 身分選）
    req.unitUID = unitUID;
    rc = HandleSelectUnitReq(store, 888, req, ack, err);
    CHECK(rc == ERR_SELECT_UNIT_07 && ack.iOK == ERR_SELECT_UNIT_07, "foreign unit -> ERR_SELECT_UNIT_07");
    {
        bool found = false;
        GUnitRecord u;
        CHECK(store.GetUnitByUID(unitUID, u, found, err) && found, "unit re-read after foreign select");
        CHECK(u.loginCount == 1, "foreign select does NOT increment loginCount");
    }

    // 已刪除
    CHECK(store.SoftDeleteUnit(unitUID, err), "soft delete ok");
    req.unitUID = unitUID;
    rc = HandleSelectUnitReq(store, 777, req, ack, err);
    CHECK(rc == ERR_SELECT_UNIT_00, "deleted unit -> ERR_SELECT_UNIT_00");

    // 二級密碼未通過
    req.unitUID = unitUID;
    rc = HandleSelectUnitReq(store, 777, req, ack, err, /*secondSecurityOk=*/false);
    CHECK(rc == ERR_VERIFY_21 && ack.iOK == ERR_VERIFY_21, "second security not ok -> ERR_VERIFY_21");

    // 非法 UID
    req.unitUID = 0;
    rc = HandleSelectUnitReq(store, 777, req, ack, err);
    CHECK(rc == ERR_SELECT_UNIT_07, "zero unitUID -> ERR_SELECT_UNIT_07");
}

// ---- loopback：CONNECT → VERIFY → SELECT_UNIT（雙庫聯動）----
static void TestSelectUnitLoopback()
{
#if !X2_PLATFORM_POSIX
    return;
#else
    const std::wstring kVersion = L"9.9.9-test";

    char acctTmpl[] = "/tmp/x2_select_acct_XXXXXX";
    int fd1 = mkstemp(acctTmpl);
    CHECK(fd1 >= 0, "mkstemp account db");
    if (fd1 < 0) return;
    ::close(fd1);
    ::unlink(acctTmpl);
    const std::string acctPath = acctTmpl;

    char gameTmpl[] = "/tmp/x2_select_game_XXXXXX";
    int fd2 = mkstemp(gameTmpl);
    CHECK(fd2 >= 0, "mkstemp game db");
    if (fd2 < 0) { ::unlink(acctPath.c_str()); return; }
    ::close(fd2);
    ::unlink(gameTmpl);
    const std::string gamePath = gameTmpl;

    int64_t loginUID = 0;
    int64_t unitUID = 0;
    int64_t otherUnitUID = 0;
    {
        Database acct;
        std::string err;
        CHECK(acct.Open(acctPath, err), "open account db for seeding");
        CHECK(ApplyMigrations(acct, err), "migrate account db");
        UserStore users(acct);
        CHECK(users.CreateUser("selectslice", "pw123!", "M", err), "seed account user");
        UserRecord rec;
        bool found = false;
        CHECK(users.FindUser("selectslice", rec, found, err) && found, "read loginUID");
        loginUID = rec.loginUID;
    }
    {
        Database game;
        std::string err;
        CHECK(game.Open(gamePath, err), "open game db for seeding");
        CHECK(ApplyGameMigrations(game, err), "migrate game db");
        GameStore store(game);
        GUserRecord gu;
        CHECK(store.GetOrCreateGUser(loginUID, "selectslice", gu, err), "seed guser");
        CHECK(store.CreateUnit(loginUID, "選擇切片", 2, unitUID, err) == CreateUnitResult::Ok, "seed unit");
        // 別人的角色（歸屬檢查用）
        GUserRecord gu2;
        CHECK(store.GetOrCreateGUser(999001, "otheraccount", gu2, err), "seed other guser");
        CHECK(store.CreateUnit(999001, "別人的角色", 1, otherUnitUID, err) == CreateUnitResult::Ok, "seed other unit");
    }

    uint16_t port = 0;
    {
        Socket probe;
        if (!Socket::CreateTcp(probe)) { ::unlink(acctPath.c_str()); ::unlink(gamePath.c_str()); CHECK(false, "probe socket"); return; }
        if (!probe.Bind(0) || !probe.LocalPort(port) || port == 0) { probe.Close(); ::unlink(acctPath.c_str()); ::unlink(gamePath.c_str()); CHECK(false, "probe port"); return; }
        probe.Close();
    }

    std::atomic<bool> serverOk{false};
    std::atomic<int64_t> seenUserUID{0};
    std::thread srvThread([&]() {
        Database acct;
        std::string err;
        if (!acct.Open(acctPath, err)) return;
        UserStore users(acct);
        Database game;
        if (!game.Open(gamePath, err)) return;
        GameStore gameStore(game);

        Session srv(PerformerID::PI_GS_SERVER);
        if (!srv.ListenAndAccept(port)) return;
        if (!srv.SendSecurityHandshake()) return;

        LoginConfig cfg;
        cfg.mainVersion = kVersion;
        cfg.udpPort = 6000;
        cfg.channelId = 4242;

        for (int i = 0; i < 6; ++i) {
            Event ev;
            if (srv.RecvEvent(ev, 5000) != Session::RecvResult::Event) break;
            Serializer ks;
            if (ev.eventID == kConnectReqID) {
                if (!ks.BeginReading(&ev.payload)) return;
                ConnectReq req;
                if (!GetConnectReq(ks, req)) return;
                ks.EndReading();
                ConnectAck ack;
                LoginArbiter::HandleConnectReq(req, ack, cfg);
                SerBuffer payload = PutPayload([&ack](Serializer& s) { return PutConnectAck(s, ack); });
                if (!srv.SendEvent(MakeEvent(kConnectAckID, payload))) return;
            } else if (ev.eventID == kVerifyReqID) {
                if (!ks.BeginReading(&ev.payload)) return;
                VerifyAccountReq req;
                if (!GetVerifyAccountReq(ks, req)) return;
                ks.EndReading();
                VerifyAccountAck ack;
                LoginArbiter::HandleVerifyAccountReq(users, req, "127.0.0.1", ack);
                seenUserUID = ack.accountInfo.userUID;
                SerBuffer payload = PutPayload([&ack](Serializer& s) { return PutVerifyAccountAck(s, ack); });
                if (!srv.SendEvent(MakeEvent(kVerifyAckID, payload))) return;
            } else if (ev.eventID == kSelectUnitReqID) {
                if (!ks.BeginReading(&ev.payload)) return;
                SelectUnitReq req;
                if (!GetSelectUnitReq(ks, req)) return;
                ks.EndReading();
                SelectUnitAck ack;
                HandleSelectUnitReq(gameStore, seenUserUID.load(), req, ack, err);
                SerBuffer payload = PutPayload([&ack](Serializer& s) { return PutSelectUnitAck(s, ack); });
                if (!srv.SendEvent(MakeEvent(kSelectUnitAckID, payload))) return;
            }
        }
        serverOk = true;
    });

    std::this_thread::sleep_for(std::chrono::milliseconds(200));
    Session client(PerformerID::PI_GS_USER);
    CHECK(client.Connect("127.0.0.1", port), "client connect");
    Event hs;
    CHECK(client.RecvEvent(hs, 5000) == Session::RecvResult::Handshake, "handshake completes");

    // CONNECT_REQ
    {
        ConnectReq req;
        req.version = kVersion;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return PutConnectReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kConnectReqID, payload)), "connect req sent");
        Event ackEv;
        CHECK(client.RecvEvent(ackEv, 5000) == Session::RecvResult::Event, "connect ack received");
        ConnectAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload), "read connect ack");
        CHECK(GetConnectAck(ks, ack), "decode connect ack");
        ks.EndReading();
        CHECK(ack.iOK == NET_OK, "connect accepted");
    }

    // VERIFY_ACCOUNT_REQ（正確密碼）
    {
        VerifyAccountReq req;
        req.userID = L"selectslice";
        req.passwd = L"pw123!";
        req.channelRandomKey = 0x0BADCAFE;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return PutVerifyAccountReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kVerifyReqID, payload)), "verify req sent");
        Event ackEv;
        CHECK(client.RecvEvent(ackEv, 5000) == Session::RecvResult::Event, "verify ack received");
        VerifyAccountAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload), "read verify ack");
        CHECK(GetVerifyAccountAck(ks, ack), "decode verify ack");
        ks.EndReading();
        CHECK(ack.iOK == NET_OK, "verify accepted");
        CHECK(ack.accountInfo.userUID == loginUID, "account userUID == seeded LoginUID");
    }

    // SELECT_UNIT_REQ #1：自己的角色 → NET_OK
    {
        SelectUnitReq req;
        req.unitUID = unitUID;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return PutSelectUnitReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kSelectUnitReqID, payload)), "select unit req (own) sent");
        Event ackEv;
        CHECK(client.RecvEvent(ackEv, 5000) == Session::RecvResult::Event, "select ack (own) received");
        CHECK(ackEv.eventID == kSelectUnitAckID, "select ack (own) id");
        SelectUnitAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload), "read select ack");
        CHECK(GetSelectUnitAck(ks, ack), "decode select ack");
        ks.EndReading();
        CHECK(ack.iOK == NET_OK, "own unit select -> NET_OK");
    }

    // SELECT_UNIT_REQ #2：別人的角色 → ERR_SELECT_UNIT_07
    {
        SelectUnitReq req;
        req.unitUID = otherUnitUID;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return PutSelectUnitReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kSelectUnitReqID, payload)), "select unit req (foreign) sent");
        Event ackEv;
        CHECK(client.RecvEvent(ackEv, 5000) == Session::RecvResult::Event, "select ack (foreign) received");
        SelectUnitAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload), "read foreign ack");
        CHECK(GetSelectUnitAck(ks, ack), "decode foreign ack");
        ks.EndReading();
        CHECK(ack.iOK == ERR_SELECT_UNIT_07, "foreign unit -> ERR_SELECT_UNIT_07");
    }

    // SELECT_UNIT_REQ #3：不存在 → ERR_SELECT_UNIT_00
    {
        SelectUnitReq req;
        req.unitUID = 0x7FFFFFFF00000001LL;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return PutSelectUnitReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kSelectUnitReqID, payload)), "select unit req (ghost) sent");
        Event ackEv;
        CHECK(client.RecvEvent(ackEv, 5000) == Session::RecvResult::Event, "select ack (ghost) received");
        SelectUnitAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload), "read ghost ack");
        CHECK(GetSelectUnitAck(ks, ack), "decode ghost ack");
        ks.EndReading();
        CHECK(ack.iOK == ERR_SELECT_UNIT_00, "unknown unit -> ERR_SELECT_UNIT_00");
    }

    client.Close();
    srvThread.join();
    CHECK(serverOk.load(), "server completed the flow");

    // game DB 副作用：只有成功選擇應 +1 次 LoginCount
    {
        Database game;
        std::string err;
        CHECK(game.Open(gamePath, err), "reopen game db");
        GameStore store(game);
        bool found = false;
        GUnitRecord u;
        CHECK(store.GetUnitByUID(unitUID, u, found, err) && found, "unit found after flow");
        CHECK(u.loginCount == 1, "successful select incremented loginCount exactly once");
    }
    ::unlink(acctPath.c_str());
    ::unlink(gamePath.c_str());
#endif
}

void RunSelectUnitTestsByRef(int& pass, int& fail)
{
    TestSelectUnitCodec();
    TestUnitSelectArbiterDecisions();
    TestSelectUnitLoopback();
    pass += g_pass_sel;
    fail += g_fail_sel;
}
