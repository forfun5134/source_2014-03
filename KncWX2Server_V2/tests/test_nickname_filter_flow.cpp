// tests/test_nickname_filter_flow.cpp — EGS_CREATE_UNIT_REQ（36）→ EGS_MY_UNIT_AND_INVENTORY_INFO_LIST_REQ（34）→
//                                     EGS_DELETE_UNIT_REQ（38）迴路整合測試（真實 mkstemp account/game 庫 + TCP loopback）。
// 流程：CONNECT → VERIFY → CREATE_UNIT ×4（NEXON→_08／FUCK之王→_08／a'b→_08／湯姆熊→NET_OK）→ MY_UNIT_LIST（1 角色）。
// 驗證：非 GM（authLevel=0）下，FT_NICKNAME 過濾器對「禁用精確／禁用子字串／非法字元」三類暱稱的線路級拒絕，
//       及合法暱稱建立後可見——create→visible 的閉環（codec + 決策層 + DB 連動）。
// ⚠ wire 佈局自洽，未對原 SDK 實機驗證；CREATE/DELETE 的 ACK 欄位佔位見各 Protocol.h。
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>
#include <map>
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
#include "../src/server/CreateUnitProtocol.h"
#include "../src/server/DeleteUnitProtocol.h"
#include "../src/server/UnitListProtocol.h"
#include "../src/server/UnitSelectArbiter.h"

using namespace x2;
using namespace x2::db;
using namespace x2::login;
using namespace x2::select_unit;

void RunNicknameFilterFlowTestsByRef(int& pass, int& fail);
static int g_pass_nff = 0, g_fail_nff = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_nff++; } \
    else { g_fail_nff++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static const uint16_t kConnectReqID = static_cast<uint16_t>(EventID::EGS_CONNECT_REQ);
static const uint16_t kConnectAckID = static_cast<uint16_t>(EventID::EGS_CONNECT_ACK);
static const uint16_t kVerifyReqID  = static_cast<uint16_t>(EventID::EGS_VERIFY_ACCOUNT_REQ);
static const uint16_t kVerifyAckID  = static_cast<uint16_t>(EventID::EGS_VERIFY_ACCOUNT_ACK);
static const uint16_t kMyUnitListReqID = static_cast<uint16_t>(EventID::EGS_MY_UNIT_AND_INVENTORY_INFO_LIST_REQ);
static const uint16_t kMyUnitListAckID = static_cast<uint16_t>(EventID::EGS_MY_UNIT_AND_INVENTORY_INFO_LIST_ACK);
static const uint16_t kCreateUnitReqID = static_cast<uint16_t>(EventID::EGS_CREATE_UNIT_REQ);
static const uint16_t kCreateUnitAckID = static_cast<uint16_t>(EventID::EGS_CREATE_UNIT_ACK);
static const uint16_t kDeleteUnitReqID = static_cast<uint16_t>(EventID::EGS_DELETE_UNIT_REQ);
static const uint16_t kDeleteUnitAckID = static_cast<uint16_t>(EventID::EGS_DELETE_UNIT_ACK);

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

static void TestNicknameFilterFlowLoopback()
{
    const std::wstring kVersion = L"9.9.9-test";

    char acctTmpl[] = "/tmp/x2_cdf_acct_XXXXXX";
    int fd1 = mkstemp(acctTmpl);
    CHECK(fd1 >= 0, "mkstemp account db");
    if (fd1 < 0) return;
    ::close(fd1);
    ::unlink(acctTmpl);
    const std::string acctPath = acctTmpl;

    char gameTmpl[] = "/tmp/x2_cdf_game_XXXXXX";
    int fd2 = mkstemp(gameTmpl);
    CHECK(fd2 >= 0, "mkstemp game db");
    if (fd2 < 0) { ::unlink(acctPath.c_str()); return; }
    ::close(fd2);
    ::unlink(gameTmpl);
    const std::string gamePath = gameTmpl;

    int64_t loginUID = 0;
    {
        Database acct;
        std::string err;
        CHECK(acct.Open(acctPath, err), "open account db for seeding");
        CHECK(ApplyMigrations(acct, err), "migrate account db");
        UserStore users(acct);
        CHECK(users.CreateUser("filterflowtester", "pw123!", "M", err), "seed account user");
        UserRecord rec;
        bool found = false;
        CHECK(users.FindUser("filterflowtester", rec, found, err) && found, "read loginUID");
        loginUID = rec.loginUID;
    }
    {
        Database game;
        std::string err;
        CHECK(game.Open(gamePath, err), "open game db for seeding");
        CHECK(ApplyGameMigrations(game, err), "migrate game db");
        GameStore store(game);
        GUserRecord gu;
        CHECK(store.GetOrCreateGUser(loginUID, "filterflowtester", gu, err), "seed guser");
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

        auto sendUnitList = [&]() -> bool {
            unit_list::MyUnitAndInventoryInfoListAck ulAck;
            std::string ulErr;
            if (!HandleMyUnitAndInventoryInfoListReq(gameStore, seenUserUID.load(), "filterflowtester", 5, ulAck, ulErr)) {
                ulAck = unit_list::MyUnitAndInventoryInfoListAck{};
                ulAck.iOK = ERR_SELECT_UNIT_05;
            }
            SerBuffer p = PutPayload([&ulAck](Serializer& s2) { return unit_list::PutMyUnitAndInventoryInfoListAck(s2, ulAck); });
            return srv.SendEvent(MakeEvent(kMyUnitListAckID, p));
        };

        for (int i = 0; i < 7; ++i) {   // CONNECT, VERIFY, CREATE_UNIT x4, MY_UNIT_LIST
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
            } else if (ev.eventID == kMyUnitListReqID) {
                if (!sendUnitList()) return;
            } else if (ev.eventID == kCreateUnitReqID) {
                if (!ks.BeginReading(&ev.payload)) return;
                create_unit::CreateUnitReq req;
                if (!create_unit::GetCreateUnitReq(ks, req)) return;
                ks.EndReading();
                create_unit::CreateUnitAck ack;
                std::string cerr;
                HandleCreateUnitReq(gameStore, seenUserUID.load(), 0, req, ack, cerr);   // authLevel=0（非 GM，filter 生效）
                SerBuffer payload = PutPayload([&ack](Serializer& s) { return create_unit::PutCreateUnitAck(s, ack); });
                if (!srv.SendEvent(MakeEvent(kCreateUnitAckID, payload))) return;
            } else if (ev.eventID == kDeleteUnitReqID) {
                if (!ks.BeginReading(&ev.payload)) return;
                delete_unit::DeleteUnitReq req;
                if (!delete_unit::GetDeleteUnitReq(ks, req)) return;
                ks.EndReading();
                delete_unit::DeleteUnitAck ack;
                std::string cerr;
                HandleDeleteUnitReq(gameStore, seenUserUID.load(), 5, req, ack, cerr);
                SerBuffer payload = PutPayload([&ack](Serializer& s) { return delete_unit::PutDeleteUnitAck(s, ack); });
                if (!srv.SendEvent(MakeEvent(kDeleteUnitAckID, payload))) return;
            }
        }
        serverOk = true;
    });

    std::this_thread::sleep_for(std::chrono::milliseconds(200));
    Session client(PerformerID::PI_GS_USER);
    CHECK(client.Connect("127.0.0.1", port), "client connect");
    Event hs;
    CHECK(client.RecvEvent(hs, 5000) == Session::RecvResult::Handshake, "handshake completes");

    // CONNECT
    {
        ConnectReq req;
        req.version = kVersion;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return PutConnectReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kConnectReqID, payload)), "connect req sent");
        Event ackEv;
        CHECK(client.RecvEvent(ackEv, 5000) == Session::RecvResult::Event, "connect ack received");
        ConnectAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload) && GetConnectAck(ks, ack), "decode connect ack");
        ks.EndReading();
        CHECK(ack.iOK == NET_OK, "connect accepted");
    }
    // VERIFY
    {
        VerifyAccountReq req;
        req.userID = L"filterflowtester";
        req.passwd = L"pw123!";
        req.channelRandomKey = 0x0BADCAFE;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return PutVerifyAccountReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kVerifyReqID, payload)), "verify req sent");
        Event ackEv;
        CHECK(client.RecvEvent(ackEv, 5000) == Session::RecvResult::Event, "verify ack received");
        VerifyAccountAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload) && GetVerifyAccountAck(ks, ack), "decode verify ack");
        ks.EndReading();
        CHECK(ack.iOK == NET_OK, "verify accepted");
        CHECK(ack.accountInfo.userUID == loginUID, "userUID matches seeded account");
    }
    auto recvUnitList = [&](unit_list::MyUnitAndInventoryInfoListAck& out) -> bool {
        if (!client.SendEvent(MakeEvent(kMyUnitListReqID, SerBuffer{}))) return false;
        Event ackEv;
        if (client.RecvEvent(ackEv, 5000) != Session::RecvResult::Event) return false;
        if (ackEv.eventID != kMyUnitListAckID) return false;
        Serializer ks;
        if (!ks.BeginReading(&ackEv.payload)) return false;
        const bool ok = unit_list::GetMyUnitAndInventoryInfoListAck(ks, out);
        ks.EndReading();
        return ok;
    };
    // CREATE_UNIT：禁用暱稱（精確 NEXON）→ ERR_CREATE_UNIT_08（filter，非 GM）
    auto sendCreate = [&](const wchar_t* nick, uint16_t cls, create_unit::CreateUnitAck& outAck) -> bool {
        create_unit::CreateUnitReq req;
        req.wstrNickName = nick;
        req.iClass = cls;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return create_unit::PutCreateUnitReq(s, req); });
        if (!client.SendEvent(MakeEvent(kCreateUnitReqID, payload))) return false;
        Event ackEv;
        if (client.RecvEvent(ackEv, 5000) != Session::RecvResult::Event) return false;
        if (ackEv.eventID != kCreateUnitAckID) return false;
        Serializer ks;
        if (!ks.BeginReading(&ackEv.payload)) return false;
        const bool ok = create_unit::GetCreateUnitAck(ks, outAck);
        ks.EndReading();
        return ok;
    };
    {
        create_unit::CreateUnitAck ack;
        CHECK(sendCreate(L"NEXON", 5, ack), "create NEXON ack received");
        CHECK(ack.iOK == ERR_CREATE_UNIT_08, "banned exact nickname -> ERR_CREATE_UNIT_08");
    }
    // CREATE_UNIT：禁用子字串（FUCK）→ ERR_CREATE_UNIT_08
    {
        create_unit::CreateUnitAck ack;
        CHECK(sendCreate(L"FUCK之王", 5, ack), "create FUCK 之王 ack received");
        CHECK(ack.iOK == ERR_CREATE_UNIT_08, "banned substring nickname -> ERR_CREATE_UNIT_08");
    }
    // CREATE_UNIT：非法字元（半形單引號，JP charset）→ ERR_CREATE_UNIT_08
    {
        create_unit::CreateUnitAck ack;
        CHECK(sendCreate(L"a'b", 5, ack), "create a'b ack received");
        CHECK(ack.iOK == ERR_CREATE_UNIT_08, "charset-invalid nickname -> ERR_CREATE_UNIT_08");
    }
    // CREATE_UNIT：合法 CJK 暱稱 → NET_OK
    int64_t createdUID = 0;
    {
        create_unit::CreateUnitAck ack;
        CHECK(sendCreate(L"湯姆熊", 5, ack), "create 湯姆熊 ack received");
        CHECK(ack.iOK == NET_OK, "valid nickname -> NET_OK");
        createdUID = ack.kUnitInfo.unitUID;
        CHECK(createdUID != 0 && ack.kUnitInfo.nickName == L"湯姆熊", "create ack carries unit");
    }
    // MY_UNIT_LIST：只有合法建立的一隻
    {
        unit_list::MyUnitAndInventoryInfoListAck ul;
        CHECK(recvUnitList(ul), "unit list received");
        CHECK(ul.iOK == NET_OK, "unit list NET_OK");
        CHECK(ul.vecUnitInfo.size() == 1 && ul.vecUnitInfo[0].unitUID == createdUID && ul.vecUnitInfo[0].nickName == L"湯姆熊",
              "only the legal unit exists");
    }

    client.Close();
    srvThread.join();
    CHECK(serverOk, "server event loop completed without fatal");
    ::unlink(acctPath.c_str());
    ::unlink(gamePath.c_str());
}

void RunNicknameFilterFlowTestsByRef(int& pass, int& fail)
{
    TestNicknameFilterFlowLoopback();
    pass += g_pass_nff;
    fail += g_fail_nff;
}
