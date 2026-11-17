// tests/test_entry_point_flow.cpp — SERV_ENTRY_POINT 家族迴路整合測試（真實 mkstemp account/game 雙庫 + TCP loopback）。
// 流程（authLevel 一律 0＝非 GM）：
//   CONNECT → VERIFY → CHARACTER_LIST_REQ(1155)（0 角色）
//   → EGS_CREATE_NEW_UNIT_REQ(1159)（L"入口測試"）→ CHARACTER_LIST_REQ（1 角色）
//   → EGS_ENTRY_POINT_GET_CHANNEL_LIST_REQ(1166)（四張表應為空）
//   → EGS_GET_CREATE_UNIT_TODAY_COUNT_REQ(1163)（count==1）
//   → EGS_ENTRY_POINT_DELETE_UNIT_REQ(1160) → CHARACTER_LIST_REQ（0 角色）→ TODAY_COUNT（count==0）
// 驗證 ENTRY_POINT 家族 wire 事件的端到端閉環（codec → 決策層 → 真實雙庫）。
// ⚠ 線路佈局自洽，未對原 SDK 實機驗證；CHECK/TODAY_COUNT 的 1ST_ACK(1164) 折疊見 docs §0n/§0s。
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
#include "../src/server/CharacterListProtocol.h"
#include "../src/server/EntryPointChannelListProtocol.h"
#include "../src/server/CreateTodayCountProtocol.h"
#include "../src/server/UnitSelectArbiter.h"

using namespace x2;
using namespace x2::db;
using namespace x2::login;
using namespace x2::select_unit;

void RunEntryPointFlowTestsByRef(int& pass, int& fail);
static int g_pass_epf = 0, g_fail_epf = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_epf++; } \
    else { g_fail_epf++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static const uint16_t kConnectReqID = static_cast<uint16_t>(EventID::EGS_CONNECT_REQ);
static const uint16_t kConnectAckID = static_cast<uint16_t>(EventID::EGS_CONNECT_ACK);
static const uint16_t kVerifyReqID  = static_cast<uint16_t>(EventID::EGS_VERIFY_ACCOUNT_REQ);
static const uint16_t kVerifyAckID  = static_cast<uint16_t>(EventID::EGS_VERIFY_ACCOUNT_ACK);
static const uint16_t kCharacterListReqID = static_cast<uint16_t>(EventID::EGS_CHARACTER_LIST_REQ);
static const uint16_t kCharacterListAckID = static_cast<uint16_t>(EventID::EGS_CHARACTER_LIST_ACK);
static const uint16_t kCreateNewUnitReqID = static_cast<uint16_t>(EventID::EGS_CREATE_NEW_UNIT_REQ);
static const uint16_t kCreateUnitAckID = static_cast<uint16_t>(EventID::EGS_CREATE_UNIT_ACK);
static const uint16_t kEntryPointDeleteUnitReqID = static_cast<uint16_t>(EventID::EGS_ENTRY_POINT_DELETE_UNIT_REQ);
static const uint16_t kDeleteUnitAckID = static_cast<uint16_t>(EventID::EGS_DELETE_UNIT_ACK);
static const uint16_t kChannelListReqID = static_cast<uint16_t>(EventID::EGS_ENTRY_POINT_GET_CHANNEL_LIST_REQ);
static const uint16_t kChannelListAckID = static_cast<uint16_t>(EventID::EGS_ENTRY_POINT_GET_CHANNEL_LIST_ACK);
static const uint16_t kTodayCountReqID = static_cast<uint16_t>(EventID::EGS_GET_CREATE_UNIT_TODAY_COUNT_REQ);
static const uint16_t kTodayCountAckID = static_cast<uint16_t>(EventID::EGS_GET_CREATE_UNIT_TODAY_COUNT_ACK);

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

static void TestEntryPointFlowLoopback()
{
    const std::wstring kVersion = L"9.9.9-test";

    char acctTmpl[] = "/tmp/x2_epf_acct_XXXXXX";
    int fd1 = mkstemp(acctTmpl);
    CHECK(fd1 >= 0, "mkstemp account db");
    if (fd1 < 0) return;
    ::close(fd1);
    ::unlink(acctTmpl);
    const std::string acctPath = acctTmpl;

    char gameTmpl[] = "/tmp/x2_epf_game_XXXXXX";
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
        CHECK(users.CreateUser("entrypointflow", "pw123!", "M", err), "seed account user");
        UserRecord rec;
        bool found = false;
        CHECK(users.FindUser("entrypointflow", rec, found, err) && found, "read loginUID");
        loginUID = rec.loginUID;
    }
    {
        Database game;
        std::string err;
        CHECK(game.Open(gamePath, err), "open game db for seeding");
        CHECK(ApplyGameMigrations(game, err), "migrate game db");
        GameStore store(game);
        GUserRecord gu;
        CHECK(store.GetOrCreateGUser(loginUID, "entrypointflow", gu, err), "seed guser");
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
        cfg.udpPort = 6002;
        cfg.channelId = 4444;

        auto sendCharacterList = [&]() -> bool {
            character_list::CharacterListAck clAck;
            std::string clErr;
            if (!HandleCharacterListReq(gameStore, seenUserUID.load(), "entrypointflow", 0, clAck, clErr)) {
                clAck = character_list::CharacterListAck{};
                clAck.iOK = ERR_SELECT_UNIT_05;
            }
            SerBuffer p = PutPayload([&clAck](Serializer& s2) { return character_list::PutCharacterListAck(s2, clAck); });
            return srv.SendEvent(MakeEvent(kCharacterListAckID, p));
        };

        for (int i = 0; i < 10; ++i) {   // CONNECT, VERIFY, CHARLIST, EP_CREATE, CHARLIST, CHLIST, TODAY, EP_DELETE, CHARLIST, TODAY
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
            } else if (ev.eventID == kCharacterListReqID) {
                if (!sendCharacterList()) return;
            } else if (ev.eventID == kCreateNewUnitReqID) {
                if (!ks.BeginReading(&ev.payload)) return;
                create_unit::CreateNewUnitReq req;
                if (!create_unit::GetCreateNewUnitReq(ks, req)) return;
                ks.EndReading();
                create_unit::CreateUnitAck ack;
                std::string cerr;
                HandleCreateNewUnitReq(gameStore, seenUserUID.load(), 0, req, ack, cerr);
                SerBuffer payload = PutPayload([&ack](Serializer& s) { return create_unit::PutCreateUnitAck(s, ack); });
                if (!srv.SendEvent(MakeEvent(kCreateUnitAckID, payload))) return;   // ENTRY_POINT CREATE 回 EGS_CREATE_UNIT_ACK(37)
            } else if (ev.eventID == kEntryPointDeleteUnitReqID) {
                if (!ks.BeginReading(&ev.payload)) return;
                delete_unit::EntryPointDeleteUnitReq req;
                if (!delete_unit::GetEntryPointDeleteUnitReq(ks, req)) return;
                ks.EndReading();
                delete_unit::DeleteUnitAck ack;
                std::string cerr;
                HandleEntryPointDeleteUnitReq(gameStore, seenUserUID.load(), 0, req, ack, cerr);
                SerBuffer payload = PutPayload([&ack](Serializer& s) { return delete_unit::PutDeleteUnitAck(s, ack); });
                if (!srv.SendEvent(MakeEvent(kDeleteUnitAckID, payload))) return;   // ENTRY_POINT DELETE 回 EGS_DELETE_UNIT_ACK(39)
            } else if (ev.eventID == kChannelListReqID) {
                channel_list::GetChannelListAck ack;   // GetChannelListReq 為 NOPARAM
                HandleGetChannelListReq(ack);
                SerBuffer payload = PutPayload([&ack](Serializer& s) { return channel_list::PutGetChannelListAck(s, ack); });
                if (!srv.SendEvent(MakeEvent(kChannelListAckID, payload))) return;
            } else if (ev.eventID == kTodayCountReqID) {
                today_count::GetCreateUnitTodayCountAck ack;   // GetCreateUnitTodayCountReq 為 NOPARAM
                std::string cerr;
                HandleGetCreateUnitTodayCountReq(gameStore, seenUserUID.load(), ack, cerr);
                SerBuffer payload = PutPayload([&ack](Serializer& s) { return today_count::PutGetCreateUnitTodayCountAck(s, ack); });
                if (!srv.SendEvent(MakeEvent(kTodayCountAckID, payload))) return;
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
        req.userID = L"entrypointflow";
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
    auto sendNoParam = [&](uint16_t reqID) -> bool { return client.SendEvent(MakeEvent(reqID, SerBuffer{})); };
    auto recvEvent = [&](Event& out) -> bool {
        return client.RecvEvent(out, 5000) == Session::RecvResult::Event;
    };
    auto recvCharacterList = [&](character_list::CharacterListAck& out) -> bool {
        if (!sendNoParam(kCharacterListReqID)) return false;
        Event ackEv;
        if (!recvEvent(ackEv)) return false;
        if (ackEv.eventID != kCharacterListAckID) return false;
        Serializer ks;
        if (!ks.BeginReading(&ackEv.payload)) return false;
        const bool ok = character_list::GetCharacterListAck(ks, out);
        ks.EndReading();
        return ok;
    };
    auto recvTodayCount = [&](today_count::GetCreateUnitTodayCountAck& out) -> bool {
        if (!sendNoParam(kTodayCountReqID)) return false;
        Event ackEv;
        if (!recvEvent(ackEv)) return false;
        if (ackEv.eventID != kTodayCountAckID) return false;
        Serializer ks;
        if (!ks.BeginReading(&ackEv.payload)) return false;
        const bool ok = today_count::GetGetCreateUnitTodayCountAck(ks, out);
        ks.EndReading();
        return ok;
    };
    // 1) CHARACTER_LIST（初始：0 角色）
    {
        character_list::CharacterListAck ack;
        CHECK(recvCharacterList(ack), "character list #1 received");
        CHECK(ack.iOK == NET_OK, "character list #1 NET_OK");
        CHECK(ack.mapServerGroupUnitSlot.size() == 1 && ack.mapServerGroupUnitSlot.at(0) == 50, "slot[0] == 50 (USSize)");
        CHECK(ack.mapServerGroupUnitInfo.size() == 1 && ack.mapServerGroupUnitInfo.at(0).empty(), "no units initially");
        CHECK(ack.strUserID == L"entrypointflow", "strUserID echoed (utf8->wide)");
    }
    // 2) ENTRY_POINT_CREATE_NEW_UNIT（L"入口測試"，iClass=5）
    int64_t createdUID = 0;
    {
        create_unit::CreateNewUnitReq req;
        req.wstrNickName = L"入口測試";
        req.iClass = 5;
        req.iServerGroup = 1;   // V2 忽略
        SerBuffer payload = PutPayload([&req](Serializer& s) { return create_unit::PutCreateNewUnitReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kCreateNewUnitReqID, payload)), "createNewUnit req sent");
        Event ackEv;
        CHECK(recvEvent(ackEv), "createNewUnit ack received");
        CHECK(ackEv.eventID == kCreateUnitAckID, "createNewUnit replied with EGS_CREATE_UNIT_ACK(37)");
        create_unit::CreateUnitAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload) && create_unit::GetCreateUnitAck(ks, ack), "decode create ack");
        ks.EndReading();
        CHECK(ack.iOK == NET_OK, "createNewUnit NET_OK");
        createdUID = ack.kUnitInfo.unitUID;
        CHECK(createdUID != 0 && ack.kUnitInfo.nickName == L"入口測試" && ack.kUnitInfo.unitClass == 5,
              "createNewUnit ack carries new unit");
    }
    // 3) CHARACTER_LIST（建立後：1 角色）
    {
        character_list::CharacterListAck ack;
        CHECK(recvCharacterList(ack), "character list #2 received");
        CHECK(ack.mapServerGroupUnitInfo.size() == 1, "map present");
        const auto& units = ack.mapServerGroupUnitInfo.at(0);
        CHECK(units.size() == 1 && units[0].unitUID == createdUID && units[0].nickName == L"入口測試",
              "created unit visible in character list");
        CHECK(units[0].level == 1 && units[0].exp == 0, "level/exp from gunit");
    }
    // 4) ENTRY_POINT_GET_CHANNEL_LIST：四張表皆空
    {
        CHECK(sendNoParam(kChannelListReqID), "channel list req sent");
        Event ackEv;
        CHECK(recvEvent(ackEv), "channel list ack received");
        CHECK(ackEv.eventID == kChannelListAckID, "channel list ack id == 1167");
        channel_list::GetChannelListAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload) && channel_list::GetGetChannelListAck(ks, ack), "decode channel list ack");
        ks.EndReading();
        CHECK(ack.mapSolesChannelList.empty() && ack.mapGaiaChannelList.empty() &&
              ack.mapSolesChannelBonusList.empty() && ack.mapGaiaChannelBonusList.empty(),
              "channel list maps all empty (無頻道資料來源)");
    }
    // 5) TODAY_COUNT：1（今日建立）
    {
        today_count::GetCreateUnitTodayCountAck ack;
        CHECK(recvTodayCount(ack), "today count #1 received");
        CHECK(ack.iUserUID == loginUID, "today count echoes userUID");
        CHECK(ack.mapCreateCharCountToday.size() == 1 && ack.mapCreateCharCountToday.at(0) == 1,
              "today count == 1 after create");
    }
    // 6) ENTRY_POINT_DELETE_UNIT
    {
        delete_unit::EntryPointDeleteUnitReq req;
        req.iUnitUID = createdUID;
        req.iUserUID = loginUID;
        req.iServerGroup = 1;   // V2 忽略
        SerBuffer payload = PutPayload([&req](Serializer& s) { return delete_unit::PutEntryPointDeleteUnitReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kEntryPointDeleteUnitReqID, payload)), "entryPointDelete req sent");
        Event ackEv;
        CHECK(recvEvent(ackEv), "entryPointDelete ack received");
        CHECK(ackEv.eventID == kDeleteUnitAckID, "entryPointDelete replied with EGS_DELETE_UNIT_ACK(39)");
        delete_unit::DeleteUnitAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload) && delete_unit::GetDeleteUnitAck(ks, ack), "decode delete ack");
        ks.EndReading();
        CHECK(ack.iOK == NET_OK && ack.iUnitUID == createdUID && ack.wstrNickName == L"入口測試",
              "delete NET_OK with charlog fields");
    }
    // 7) CHARACTER_LIST（刪除後：0 角色）
    {
        character_list::CharacterListAck ack;
        CHECK(recvCharacterList(ack), "character list #3 received");
        CHECK(ack.iOK == NET_OK && ack.mapServerGroupUnitInfo.size() == 1 && ack.mapServerGroupUnitInfo.at(0).empty(),
              "character list empty after delete");
    }
    // 8) TODAY_COUNT：0（已刪除）
    {
        today_count::GetCreateUnitTodayCountAck ack;
        CHECK(recvTodayCount(ack), "today count #2 received");
        CHECK(ack.mapCreateCharCountToday.size() == 1 && ack.mapCreateCharCountToday.at(0) == 0,
              "today count == 0 after delete (Deleted=0 filter)");
    }

    client.Close();
    srvThread.join();
    CHECK(serverOk, "server event loop completed without fatal");
    ::unlink(acctPath.c_str());
    ::unlink(gamePath.c_str());
}

void RunEntryPointFlowTestsByRef(int& pass, int& fail)
{
    TestEntryPointFlowLoopback();
    pass += g_pass_epf;
    fail += g_fail_epf;
}
