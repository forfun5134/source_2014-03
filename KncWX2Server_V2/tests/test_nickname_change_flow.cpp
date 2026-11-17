// tests/test_nickname_change_flow.cpp — EGS_CHANGE_NICK_NAME_REQ（431/432）＋EGS_ENTRY_POINT_CHECK_NICK_NAME_REQ（1161/1162）迴路整合測試。
// 真實 mkstemp account/game 雙庫 + TCP loopback。流程（authLevel 一律 0＝非 GM，filter 生效）：
//   CONNECT → VERIFY → CREATE_UNIT(原創者) → CHANGE(checkOnly 新名稱→NET_OK) → CHANGE(checkOnly 自己現名→NET_OK)
//          → CHANGE(checkOnly NEXON→ERR_RESTORE_NICK_NAME_05) → ENTRY_POINT_CHECK(新名稱→NET_OK)
//          → CHANGE(rename→NET_OK) → ENTRY_POINT_CHECK(原創者→ERR_RESTORE_NICK_NAME_03 冷卻) → MY_UNIT_LIST（新名稱）。
// ⚠ 線路佈局自洽，未對原 SDK 實機驗證；CHANGE_NICK_NAME 的 ACK 欄位見 ChangeNicknameProtocol.h。
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
#include "../src/server/ChangeNicknameProtocol.h"
#include "../src/server/CheckNicknameProtocol.h"
#include "../src/server/UnitListProtocol.h"
#include "../src/server/UnitSelectArbiter.h"

using namespace x2;
using namespace x2::db;
using namespace x2::login;
using namespace x2::select_unit;

void RunNicknameChangeFlowTestsByRef(int& pass, int& fail);
static int g_pass_ncf = 0, g_fail_ncf = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_ncf++; } \
    else { g_fail_ncf++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static const uint16_t kConnectReqID = static_cast<uint16_t>(EventID::EGS_CONNECT_REQ);
static const uint16_t kConnectAckID = static_cast<uint16_t>(EventID::EGS_CONNECT_ACK);
static const uint16_t kVerifyReqID  = static_cast<uint16_t>(EventID::EGS_VERIFY_ACCOUNT_REQ);
static const uint16_t kVerifyAckID  = static_cast<uint16_t>(EventID::EGS_VERIFY_ACCOUNT_ACK);
static const uint16_t kMyUnitListReqID = static_cast<uint16_t>(EventID::EGS_MY_UNIT_AND_INVENTORY_INFO_LIST_REQ);
static const uint16_t kMyUnitListAckID = static_cast<uint16_t>(EventID::EGS_MY_UNIT_AND_INVENTORY_INFO_LIST_ACK);
static const uint16_t kCreateUnitReqID = static_cast<uint16_t>(EventID::EGS_CREATE_UNIT_REQ);
static const uint16_t kCreateUnitAckID = static_cast<uint16_t>(EventID::EGS_CREATE_UNIT_ACK);
static const uint16_t kChangeNickNameReqID = static_cast<uint16_t>(EventID::EGS_CHANGE_NICK_NAME_REQ);
static const uint16_t kChangeNickNameAckID = static_cast<uint16_t>(EventID::EGS_CHANGE_NICK_NAME_ACK);
static const uint16_t kCheckNickNameReqID = static_cast<uint16_t>(EventID::EGS_ENTRY_POINT_CHECK_NICK_NAME_REQ);
static const uint16_t kCheckNickNameAckID = static_cast<uint16_t>(EventID::EGS_ENTRY_POINT_CHECK_NICK_NAME_ACK);

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

static void TestChangeNicknameFlowLoopback()
{
    const std::wstring kVersion = L"9.9.9-test";

    char acctTmpl[] = "/tmp/x2_ncf_acct_XXXXXX";
    int fd1 = mkstemp(acctTmpl);
    CHECK(fd1 >= 0, "mkstemp account db");
    if (fd1 < 0) return;
    ::close(fd1);
    ::unlink(acctTmpl);
    const std::string acctPath = acctTmpl;

    char gameTmpl[] = "/tmp/x2_ncf_game_XXXXXX";
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
        CHECK(users.CreateUser("changenickflow", "pw123!", "M", err), "seed account user");
        UserRecord rec;
        bool found = false;
        CHECK(users.FindUser("changenickflow", rec, found, err) && found, "read loginUID");
        loginUID = rec.loginUID;
    }
    {
        Database game;
        std::string err;
        CHECK(game.Open(gamePath, err), "open game db for seeding");
        CHECK(ApplyGameMigrations(game, err), "migrate game db");
        GameStore store(game);
        GUserRecord gu;
        CHECK(store.GetOrCreateGUser(loginUID, "changenickflow", gu, err), "seed guser");
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
        cfg.udpPort = 6001;
        cfg.channelId = 4343;

        auto sendUnitList = [&]() -> bool {
            unit_list::MyUnitAndInventoryInfoListAck ulAck;
            std::string ulErr;
            if (!HandleMyUnitAndInventoryInfoListReq(gameStore, seenUserUID.load(), "changenickflow", 0, ulAck, ulErr)) {
                ulAck = unit_list::MyUnitAndInventoryInfoListAck{};
                ulAck.iOK = ERR_SELECT_UNIT_05;
            }
            SerBuffer p = PutPayload([&ulAck](Serializer& s2) { return unit_list::PutMyUnitAndInventoryInfoListAck(s2, ulAck); });
            return srv.SendEvent(MakeEvent(kMyUnitListAckID, p));
        };

        for (int i = 0; i < 10; ++i) {   // CONNECT, VERIFY, CREATE_UNIT, CHANGE x3, CHECK, CHANGE, CHECK, MY_UNIT_LIST
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
            } else if (ev.eventID == kCreateUnitReqID) {
                if (!ks.BeginReading(&ev.payload)) return;
                create_unit::CreateUnitReq req;
                if (!create_unit::GetCreateUnitReq(ks, req)) return;
                ks.EndReading();
                create_unit::CreateUnitAck ack;
                std::string cerr;
                HandleCreateUnitReq(gameStore, seenUserUID.load(), 0, req, ack, cerr);   // authLevel=0（非 GM）
                SerBuffer payload = PutPayload([&ack](Serializer& s) { return create_unit::PutCreateUnitAck(s, ack); });
                if (!srv.SendEvent(MakeEvent(kCreateUnitAckID, payload))) return;
            } else if (ev.eventID == kChangeNickNameReqID) {
                if (!ks.BeginReading(&ev.payload)) return;
                change_nickname::ChangeNickNameReq req;
                if (!change_nickname::GetChangeNickNameReq(ks, req)) return;
                ks.EndReading();
                change_nickname::ChangeNickNameAck ack;
                std::string cerr;
                HandleChangeNicknameReq(gameStore, seenUserUID.load(), req, ack, cerr);   // authLevel 預設 0
                SerBuffer payload = PutPayload([&ack](Serializer& s) { return change_nickname::PutChangeNickNameAck(s, ack); });
                if (!srv.SendEvent(MakeEvent(kChangeNickNameAckID, payload))) return;
            } else if (ev.eventID == kCheckNickNameReqID) {
                if (!ks.BeginReading(&ev.payload)) return;
                check_nickname::EntryPointCheckNickNameReq req;
                if (!check_nickname::GetEntryPointCheckNickNameReq(ks, req)) return;
                ks.EndReading();
                check_nickname::EntryPointCheckNickNameAck ack;
                std::string cerr;
                HandleCheckNicknameReq(gameStore, req, ack, cerr);   // authLevel 預設 0
                SerBuffer payload = PutPayload([&ack](Serializer& s) { return check_nickname::PutEntryPointCheckNickNameAck(s, ack); });
                if (!srv.SendEvent(MakeEvent(kCheckNickNameAckID, payload))) return;
            } else if (ev.eventID == kMyUnitListReqID) {
                if (!sendUnitList()) return;
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
        req.userID = L"changenickflow";
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
    // CREATE_UNIT（原創者）
    int64_t createdUID = 0;
    {
        create_unit::CreateUnitReq req;
        req.wstrNickName = L"原創者";
        req.iClass = 5;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return create_unit::PutCreateUnitReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kCreateUnitReqID, payload)), "create req sent");
        Event ackEv;
        CHECK(client.RecvEvent(ackEv, 5000) == Session::RecvResult::Event, "create ack received");
        CHECK(ackEv.eventID == kCreateUnitAckID, "create ack id == 37");
        create_unit::CreateUnitAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload) && create_unit::GetCreateUnitAck(ks, ack), "decode create ack");
        ks.EndReading();
        CHECK(ack.iOK == NET_OK, "create NET_OK");
        createdUID = ack.kUnitInfo.unitUID;
        CHECK(createdUID != 0, "create ack carries uid");
    }
    auto sendChange = [&](int64_t uid, const wchar_t* nick, bool checkOnly, change_nickname::ChangeNickNameAck& outAck) -> bool {
        change_nickname::ChangeNickNameReq req;
        req.iUnitUID = uid;
        req.wstrNickName = nick;
        req.bCheckOnly = checkOnly;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return change_nickname::PutChangeNickNameReq(s, req); });
        if (!client.SendEvent(MakeEvent(kChangeNickNameReqID, payload))) return false;
        Event ackEv;
        if (client.RecvEvent(ackEv, 5000) != Session::RecvResult::Event) return false;
        if (ackEv.eventID != kChangeNickNameAckID) return false;
        Serializer ks;
        if (!ks.BeginReading(&ackEv.payload)) return false;
        const bool ok = change_nickname::GetChangeNickNameAck(ks, outAck);
        ks.EndReading();
        return ok;
    };
    auto sendCheck = [&](const wchar_t* nick, check_nickname::EntryPointCheckNickNameAck& outAck) -> bool {
        check_nickname::EntryPointCheckNickNameReq req;
        req.iServerGroup = 0;
        req.wstrNickName = nick;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return check_nickname::PutEntryPointCheckNickNameReq(s, req); });
        if (!client.SendEvent(MakeEvent(kCheckNickNameReqID, payload))) return false;
        Event ackEv;
        if (client.RecvEvent(ackEv, 5000) != Session::RecvResult::Event) return false;
        if (ackEv.eventID != kCheckNickNameAckID) return false;
        Serializer ks;
        if (!ks.BeginReading(&ackEv.payload)) return false;
        const bool ok = check_nickname::GetEntryPointCheckNickNameAck(ks, outAck);
        ks.EndReading();
        return ok;
    };
    // CHANGE checkOnly：新名稱（未占用）→ NET_OK
    {
        change_nickname::ChangeNickNameAck ack;
        CHECK(sendChange(createdUID, L"新名稱", /*bCheckOnly=*/true, ack), "checkOnly req sent");
        CHECK(ack.iOK == NET_OK && ack.bCheckOnly && ack.wstrNickName == L"新名稱", "checkOnly fresh nickname -> NET_OK");
    }
    // CHANGE checkOnly：自己的現名（排除自身）→ NET_OK
    {
        change_nickname::ChangeNickNameAck ack;
        CHECK(sendChange(createdUID, L"原創者", /*bCheckOnly=*/true, ack), "checkOnly self req sent");
        CHECK(ack.iOK == NET_OK, "checkOnly own current name -> NET_OK");
    }
    // CHANGE checkOnly：NEXON（禁用精確，filter，非 GM）→ ERR_RESTORE_NICK_NAME_05
    {
        change_nickname::ChangeNickNameAck ack;
        CHECK(sendChange(createdUID, L"NEXON", /*bCheckOnly=*/true, ack), "checkOnly NEXON req sent");
        CHECK(ack.iOK == ERR_RESTORE_NICK_NAME_05, "filtered nickname -> ERR_RESTORE_NICK_NAME_05");
    }
    // ENTRY_POINT_CHECK：新名稱 → NET_OK
    {
        check_nickname::EntryPointCheckNickNameAck ack;
        CHECK(sendCheck(L"新名稱", ack), "check req sent");
        CHECK(ack.iOK == NET_OK && ack.wstrNickName == L"新名稱", "check fresh nickname -> NET_OK");
    }
    // CHANGE：實際改名 → NET_OK
    {
        change_nickname::ChangeNickNameAck ack;
        CHECK(sendChange(createdUID, L"新名稱", /*bCheckOnly=*/false, ack), "rename req sent");
        CHECK(ack.iOK == NET_OK && ack.iUnitUID == createdUID, "rename -> NET_OK");
    }
    // ENTRY_POINT_CHECK：舊暱稱（14 天冷卻）→ ERR_RESTORE_NICK_NAME_03
    {
        check_nickname::EntryPointCheckNickNameAck ack;
        CHECK(sendCheck(L"原創者", ack), "check cooldown req sent");
        CHECK(ack.iOK == ERR_RESTORE_NICK_NAME_03, "old nickname cooldown -> ERR_RESTORE_NICK_NAME_03");
    }
    // MY_UNIT_LIST：暱稱已為新名稱
    {
        if (!client.SendEvent(MakeEvent(kMyUnitListReqID, SerBuffer{}))) { CHECK(false, "send list req"); }
        else {
            Event ackEv;
            CHECK(client.RecvEvent(ackEv, 5000) == Session::RecvResult::Event, "unit list received");
            if (ackEv.eventID == kMyUnitListAckID) {
                unit_list::MyUnitAndInventoryInfoListAck ul;
                Serializer ks;
                CHECK(ks.BeginReading(&ackEv.payload) && unit_list::GetMyUnitAndInventoryInfoListAck(ks, ul), "decode unit list");
                ks.EndReading();
                CHECK(ul.iOK == NET_OK, "unit list NET_OK");
                CHECK(ul.vecUnitInfo.size() == 1 && ul.vecUnitInfo[0].unitUID == createdUID &&
                      ul.vecUnitInfo[0].nickName == L"新名稱", "list shows renamed unit");
            } else {
                CHECK(false, "unit list ack id == 35");
            }
        }
    }

    client.Close();
    srvThread.join();
    CHECK(serverOk, "server event loop completed without fatal");
    ::unlink(acctPath.c_str());
    ::unlink(gamePath.c_str());
}

void RunNicknameChangeFlowTestsByRef(int& pass, int& fail)
{
    TestChangeNicknameFlowLoopback();
    pass += g_pass_ncf;
    fail += g_fail_ncf;
}
