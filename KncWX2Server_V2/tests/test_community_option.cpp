// tests/test_community_option.cpp — EGS_UPDATE_COMMUNITY_OPTION_REQ/ACK 切片測試（§0a10）
// 對照原 GSUserGameCommon::IMPL_ON_FUNC(EGS_UPDATE_COMMUNITY_OPTION_REQ)＋KUserGameOption::SetDenyOptions 驗證段：
//   1) wire codec：REQ=6×char（cDenyFriendShip..cDenyInvitePracticePVP）；ACK=int32 iOK → 6×char
//   2) 驗證不對稱上限（原碼保留）：FriendShip ∈ [0, DOS_OFF=1]；其餘五欄 ∈ [0, DOS_ONLY_FRIEND=2]
//   3) HandleUpdateCommunityOptionReq：驗證失敗 → ERR_COMMUNITY_OPT_01（240）、不動 DB、ack.kDenyOptions 歸零；
//      unit 不存在/已刪除 → ERR_COMMUNITY_OPT_02（241）；成功 → NET_OK＋write-through upsert gdenyoption（QN1..6）
//   4) 與 SELECT_UNIT_4_NOT（§0a9）連動：更新後 Not4 的 kDenyOptions 反映新值
// ⚠ 偏差聲明見 src/server/UpdateCommunityOptionProtocol.h 檔頭（write-through vs 原版副本結束延遲寫；
//   ELG_UPDATE_DENY_FRIEND_SHIP_NOT 未移植——V2 無 LoginServer；VERIFY_STATE 不適用；失敗路徑歸零 vs 原版未初始化）。
#include <cstdio>
#include <cstring>
#include <string>
#include <functional>

#include "../src/core/EventIDs.h"

#include "../src/core/NetError.h"
#include "../src/core/Serializer.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/UnitData.h"
#include "../src/server/SelectUnitProtocol.h"
#include "../src/server/UnitSelectArbiter.h"
#include "../src/server/CreateUnitProtocol.h"
#include "../src/server/UpdateCommunityOptionProtocol.h"

using namespace x2;
using namespace x2::db;
using namespace x2::select_unit;
using namespace x2::create_unit;
using namespace x2::community_option;
using x2::unit::DenyOptions;

void RunCommunityOptionTestsByRef(int& pass, int& fail);
static int g_pass_co = 0, g_fail_co = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_co++; } \
    else { g_fail_co++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static SerBuffer PutPayload(const std::function<bool(Serializer&)>& fn)
{
    Serializer ks;
    SerBuffer buf;
    if (!ks.BeginWriting(&buf)) return SerBuffer{};
    if (!fn(ks)) return SerBuffer{};
    ks.EndWriting();
    return buf;
}

// ---------- codec golden ----------

static void TestReqGoldenBytes()
{
    UpdateCommunityOptionReq req;
    req.kDenyOptions.cDenyFriendShip = 0;     // DOS_ON
    req.kDenyOptions.cDenyInviteGuild = 1;    // DOS_OFF
    req.kDenyOptions.cDenyParty = 2;          // DOS_ONLY_FRIEND
    req.kDenyOptions.cDenyPersonalTrade = 0;
    req.kDenyOptions.cDenyRequestCouple = 2;
    req.kDenyOptions.cDenyInvitePracticePVP = 1;
    SerBuffer buf = PutPayload([&req](Serializer& s) { return PutUpdateCommunityOptionReq(s, req); });
    const unsigned char expect[6] = { 0x00, 0x01, 0x02, 0x00, 0x02, 0x01 };
    CHECK(buf.GetLength() == sizeof(expect) && std::memcmp(buf.GetData(), expect, sizeof(expect)) == 0,
          "req golden bytes (6×char, big-endian order, no tags)");
    UpdateCommunityOptionReq back;
    Serializer ks;
    CHECK(ks.BeginReading(&buf) && GetUpdateCommunityOptionReq(ks, back), "req parse");
    ks.EndReading();
    CHECK(back.kDenyOptions.cDenyFriendShip == 0 && back.kDenyOptions.cDenyInviteGuild == 1 &&
          back.kDenyOptions.cDenyParty == 2 && back.kDenyOptions.cDenyPersonalTrade == 0 &&
          back.kDenyOptions.cDenyRequestCouple == 2 && back.kDenyOptions.cDenyInvitePracticePVP == 1,
          "req roundtrip");
}

static void TestAckGoldenBytes()
{
    UpdateCommunityOptionAck ack;
    ack.iOK = NET_OK;
    ack.kDenyOptions.cDenyFriendShip = 0;
    ack.kDenyOptions.cDenyInviteGuild = 1;
    ack.kDenyOptions.cDenyParty = 2;
    ack.kDenyOptions.cDenyPersonalTrade = 0;
    ack.kDenyOptions.cDenyRequestCouple = 2;
    ack.kDenyOptions.cDenyInvitePracticePVP = 1;
    SerBuffer buf = PutPayload([&ack](Serializer& s) { return PutUpdateCommunityOptionAck(s, ack); });
    const unsigned char expect[10] = { 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x00, 0x02, 0x01 };
    CHECK(buf.GetLength() == sizeof(expect) && std::memcmp(buf.GetData(), expect, sizeof(expect)) == 0,
          "ack golden bytes (int32 BE + 6×char)");
    UpdateCommunityOptionAck back;
    Serializer ks;
    CHECK(ks.BeginReading(&buf) && GetUpdateCommunityOptionAck(ks, back), "ack parse");
    ks.EndReading();
    CHECK(back.iOK == NET_OK && back.kDenyOptions.cDenyParty == 2 && back.kDenyOptions.cDenyRequestCouple == 2,
          "ack roundtrip");
    // 錯誤碼也為 int32 BE：ERR_COMMUNITY_OPT_01 = 240 = 0xF0
    UpdateCommunityOptionAck errAck;
    errAck.iOK = ERR_COMMUNITY_OPT_01;
    errAck.kDenyOptions = DenyOptions{};
    SerBuffer ebuf = PutPayload([&errAck](Serializer& s) { return PutUpdateCommunityOptionAck(s, errAck); });
    const unsigned char expectErr[10] = { 0x00, 0x00, 0x00, 0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
    CHECK(ebuf.GetLength() == sizeof(expectErr) && std::memcmp(ebuf.GetData(), expectErr, sizeof(expectErr)) == 0,
          "ack error golden bytes (240 = 0x000000F0, deny options zeroed)");
}

static void TestEventIds()
{
    CHECK(static_cast<uint16_t>(EventID::EGS_UPDATE_COMMUNITY_OPTION_REQ) == 365 &&
          static_cast<uint16_t>(EventID::EGS_UPDATE_COMMUNITY_OPTION_ACK) == 366,
          "event ids 365/366");
}

// ---------- ValidateDenyOptions（KUserGameOption::SetDenyOptions 驗證段）----------

static void TestValidateDenyOptions()
{
    DenyOptions ok{};
    ok.cDenyFriendShip = 0; ok.cDenyInviteGuild = 2; ok.cDenyParty = 1; ok.cDenyPersonalTrade = 0;
    ok.cDenyRequestCouple = 2; ok.cDenyInvitePracticePVP = 2;
    CHECK(ValidateDenyOptions(ok), "all-valid passes");

    // FriendShip 上限 DOS_OFF=1（原碼不對稱：DOS_ONLY_FRIEND=2 對 FriendShip 非法）
    DenyOptions f2 = ok; f2.cDenyFriendShip = 2;
    DenyOptions f3 = ok; f3.cDenyFriendShip = 3;
    DenyOptions fn = ok; fn.cDenyFriendShip = static_cast<int8_t>(-1);
    CHECK(!ValidateDenyOptions(f2), "friendship=2 rejected (DOS_ONLY_FRIEND not allowed)");
    CHECK(!ValidateDenyOptions(f3), "friendship=3 rejected");
    CHECK(!ValidateDenyOptions(fn), "friendship=-1 rejected");
    DenyOptions f1 = ok; f1.cDenyFriendShip = 1;
    CHECK(ValidateDenyOptions(f1), "friendship=1 (DOS_OFF) accepted");

    // 其餘五欄上限 DOS_ONLY_FRIEND=2
    auto rejectOn = [&ok](int which) {
        DenyOptions v = ok;
        switch (which) {
            case 1: v.cDenyInviteGuild = 3; break;
            case 2: v.cDenyParty = 3; break;
            case 3: v.cDenyPersonalTrade = 3; break;
            case 4: v.cDenyRequestCouple = 3; break;
            case 5: v.cDenyInvitePracticePVP = 3; break;
        }
        return !ValidateDenyOptions(v);
    };
    CHECK(rejectOn(1) && rejectOn(2) && rejectOn(3) && rejectOn(4) && rejectOn(5),
          "inviteGuild/party/personalTrade/requestCouple/invitePracticePVP = 3 all rejected");

    DenyOptions neg = ok; neg.cDenyParty = static_cast<int8_t>(-1);
    CHECK(!ValidateDenyOptions(neg), "party=-1 rejected");

    // 2（DOS_ONLY_FRIEND）對 InviteGuild/Party 等五欄合法——原碼不對稱忠實保留
    DenyOptions five2 = ok;
    five2.cDenyParty = 2; five2.cDenyPersonalTrade = 2; five2.cDenyRequestCouple = 2; five2.cDenyInvitePracticePVP = 2; five2.cDenyInviteGuild = 2;
    CHECK(ValidateDenyOptions(five2), "party/trade/couple/pvp/guild = 2 (DOS_ONLY_FRIEND) accepted");
}

// ---------- GameStore::UpdateDenyOptions（upsert） ----------

struct Fixture
{
    Database db;
    std::string err;
    Fixture()
    {
        if (!db.Open(":memory:", err)) return;
        ApplyGameMigrations(db, err);
    }
};

static int64_t CreateUnitOk(GameStore& store, int64_t userUID, const wchar_t* nick, int unitClass)
{
    CreateUnitReq req; req.iClass = unitClass; req.wstrNickName = nick;
    CreateUnitAck ack;
    std::string err;
    if (!HandleCreateUnitReq(store, userUID, /*authLevel=*/5, req, ack, err)) return -1;
    if (ack.iOK != NET_OK) return -2;
    return ack.kUnitInfo.unitUID;
}

static void TestUpdateDenyOptionsUpsert()
{
    Fixture fx;
    GameStore store(fx.db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "co_upsert", gu, err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"co.upsert", 1);
    CHECK(uid > 0, "unit created");

    // 建角後預設 QN1..4=1、QN5/6 缺列（§0a5）→ GetDenyOptions 全 1
    {
        DenyOptionValues dv;
        CHECK(store.GetDenyOptions(uid, dv, err), "read defaults");
        CHECK(dv.friendShip == 1 && dv.inviteGuild == 1 && dv.party == 1 && dv.personalTrade == 1 &&
              dv.requestCouple == 1 && dv.invitePracticePVP == 1, "defaults all 1");
    }

    // write-through：更新為混合值
    DenyOptionValues nv;
    nv = { 0, 2, 0, 1, 2, 0 };
    CHECK(store.UpdateDenyOptions(uid, nv, err), "update ok");
    {
        DenyOptionValues dv;
        CHECK(store.GetDenyOptions(uid, dv, err), "read back");
        CHECK(dv.friendShip == 0 && dv.inviteGuild == 2 && dv.party == 0 && dv.personalTrade == 1 &&
              dv.requestCouple == 2 && dv.invitePracticePVP == 0, "read back reflects update (6 values)");
    }

    // 缺列分支：刪掉 QN4/5 後更新 → 兩列 INSERT 回、其餘 UPDATE
    CHECK(fx.db.Exec("DELETE FROM gdenyoption WHERE UnitUID = " + std::to_string(uid) + " AND QuestionNo IN (4, 5);", err), "delete QN4/5");
    DenyOptionValues nv2;
    nv2 = { 1, 1, 1, 2, 1, 2 };
    CHECK(store.UpdateDenyOptions(uid, nv2, err), "update with missing rows ok");
    {
        DenyOptionValues dv;
        CHECK(store.GetDenyOptions(uid, dv, err), "read back 2");
        CHECK(dv.personalTrade == 2 && dv.invitePracticePVP == 2 &&
              dv.friendShip == 1 && dv.inviteGuild == 1 && dv.party == 1 && dv.requestCouple == 1,
              "missing rows reinserted, others updated");
    }

    // 全刪後更新 → 6 列全部 INSERT
    CHECK(fx.db.Exec("DELETE FROM gdenyoption WHERE UnitUID = " + std::to_string(uid) + ";", err), "delete all rows");
    DenyOptionValues nv3;
    nv3 = { 2, 1, 0, 1, 2, 0 };
    // friendShip=2 本身在 handler 層會被拒；GameStore 層不重複驗證上限（僅擋負數/>255），直接用 1
    nv3.friendShip = 1;
    CHECK(store.UpdateDenyOptions(uid, nv3, err), "update recreates all rows");
    {
        DenyOptionValues dv;
        CHECK(store.GetDenyOptions(uid, dv, err), "read back 3");
        CHECK(dv.friendShip == 1 && dv.inviteGuild == 1 && dv.party == 0 && dv.personalTrade == 1 &&
              dv.requestCouple == 2 && dv.invitePracticePVP == 0, "all rows recreated via upsert insert branch");
    }

    // 負數 CodeNo → 拒絕
    DenyOptionValues bad;
    bad = { -1, 1, 1, 1, 1, 1 };
    CHECK(!store.UpdateDenyOptions(uid, bad, err), "negative CodeNo rejected");
    // >255 → 拒絕
    DenyOptionValues bad2;
    bad2 = { 1, 1, 1, 1, 1, 256 };
    CHECK(!store.UpdateDenyOptions(uid, bad2, err), "CodeNo > 255 rejected");

    // unit 不存在 → false + err
    CHECK(!store.UpdateDenyOptions(0x7FFFFFFF00000003LL, nv2, err), "nonexistent unit -> false");
    CHECK(!err.empty(), "nonexistent unit -> err message");

    // 已刪除 unit → false + err
    CHECK(fx.db.Exec("UPDATE gunit SET DelDate = datetime('now', '+1 second') WHERE UnitUID = " + std::to_string(uid) + ";", err), "soft-delete unit");
    CHECK(!store.UpdateDenyOptions(uid, nv2, err), "soft-deleted unit -> false");
}

// ---------- HandleUpdateCommunityOptionReq（決策層） ----------

static void TestHandleUpdateCommunityOptionReq()
{
    Fixture fx;
    GameStore store(fx.db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "co_handle", gu, err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"co.handle", 1);
    CHECK(uid > 0, "unit created");

    // 1) 非法值 → ERR_COMMUNITY_OPT_01、不動 DB、ack.kDenyOptions 歸零
    {
        UpdateCommunityOptionReq req;
        req.kDenyOptions.cDenyFriendShip = 2;   // DOS_ONLY_FRIEND 對 FriendShip 非法（不對稱上限）
        req.kDenyOptions.cDenyParty = 2;        // 合法
        UpdateCommunityOptionAck ack;
        const int32_t rc = HandleUpdateCommunityOptionReq(store, uid, req, ack, err);
        CHECK(rc == ERR_COMMUNITY_OPT_01, "invalid -> ERR_COMMUNITY_OPT_01 (240)");
        CHECK(ack.iOK == ERR_COMMUNITY_OPT_01, "ack iOK = 240");
        CHECK(ack.kDenyOptions.cDenyFriendShip == 0 && ack.kDenyOptions.cDenyParty == 0 &&
              ack.kDenyOptions.cDenyInvitePracticePVP == 0, "ack deny options zeroed on failure");
        DenyOptionValues dv;
        CHECK(store.GetDenyOptions(uid, dv, err), "readback after invalid");
        CHECK(dv.friendShip == 1 && dv.party == 1, "DB unchanged after invalid input");
    }

    // 2) 合法 → NET_OK、回顯、write-through
    {
        UpdateCommunityOptionReq req;
        req.kDenyOptions.cDenyFriendShip = 0;     // DOS_ON
        req.kDenyOptions.cDenyInviteGuild = 1;
        req.kDenyOptions.cDenyParty = 2;          // DOS_ONLY_FRIEND
        req.kDenyOptions.cDenyPersonalTrade = 0;
        req.kDenyOptions.cDenyRequestCouple = 2;
        req.kDenyOptions.cDenyInvitePracticePVP = 1;
        UpdateCommunityOptionAck ack;
        const int32_t rc = HandleUpdateCommunityOptionReq(store, uid, req, ack, err);
        CHECK(rc == NET_OK && ack.iOK == NET_OK, "valid -> NET_OK");
        CHECK(ack.kDenyOptions.cDenyFriendShip == 0 && ack.kDenyOptions.cDenyParty == 2 &&
              ack.kDenyOptions.cDenyRequestCouple == 2 && ack.kDenyOptions.cDenyInvitePracticePVP == 1,
              "ack echoes validated input");
        DenyOptionValues dv;
        CHECK(store.GetDenyOptions(uid, dv, err), "readback after valid");
        CHECK(dv.friendShip == 0 && dv.inviteGuild == 1 && dv.party == 2 && dv.personalTrade == 0 &&
              dv.requestCouple == 2 && dv.invitePracticePVP == 1, "DB reflects write-through");
    }

    // 3) 與 SELECT_UNIT_4_NOT 連動：更新後 Not4 kDenyOptions 反映新值
    {
        SelectUnitReq sreq; sreq.unitUID = uid;
        SelectUnitAck sack;
        SelectUnitNot4 not4{};
        int rc = HandleSelectUnitReq(store, 777, sreq, sack, err, /*secondSecurityOk=*/true,
                                     /*outUnit=*/nullptr, /*outNot1=*/nullptr, /*authLevel=*/5,
                                     /*outNot2=*/nullptr, /*outNot3=*/nullptr, &not4, /*outNot5=*/nullptr);
        CHECK(rc == NET_OK, "select ok");
        CHECK(not4.kDenyOptions.cDenyFriendShip == 0 && not4.kDenyOptions.cDenyParty == 2 &&
              not4.kDenyOptions.cDenyRequestCouple == 2, "not4 kDenyOptions reflects update");
    }

    // 4) unit 不存在 → ERR_COMMUNITY_OPT_02、ack 歸零、err 非空
    {
        UpdateCommunityOptionReq req;
        req.kDenyOptions.cDenyFriendShip = 1;
        UpdateCommunityOptionAck ack;
        const int32_t rc = HandleUpdateCommunityOptionReq(store, 0x7FFFFFFF00000004LL, req, ack, err);
        CHECK(rc == ERR_COMMUNITY_OPT_02 && ack.iOK == ERR_COMMUNITY_OPT_02,
              "nonexistent unit -> ERR_COMMUNITY_OPT_02 (241)");
        CHECK(!err.empty(), "err message recorded");
        CHECK(ack.kDenyOptions.cDenyFriendShip == 0 && ack.kDenyOptions.cDenyInviteGuild == 0,
              "ack deny options zeroed on DB failure");
    }
}

// ---------- wire 迴路（REQ → parse → handle → ACK → parse） ----------

static void TestWireLoopback()
{
    Fixture fx;
    GameStore store(fx.db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "co_wire", gu, err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"co.wire", 1);
    CHECK(uid > 0, "unit created");

    UpdateCommunityOptionReq req;
    req.kDenyOptions.cDenyFriendShip = 1;
    req.kDenyOptions.cDenyInviteGuild = 0;
    req.kDenyOptions.cDenyParty = 1;
    req.kDenyOptions.cDenyPersonalTrade = 2;
    req.kDenyOptions.cDenyRequestCouple = 0;
    req.kDenyOptions.cDenyInvitePracticePVP = 2;

    SerBuffer payload = PutPayload([&req](Serializer& s) { return PutUpdateCommunityOptionReq(s, req); });
    Serializer r;
    UpdateCommunityOptionReq parsed;
    CHECK(r.BeginReading(&payload) && GetUpdateCommunityOptionReq(r, parsed), "server parses req");
    r.EndReading();

    UpdateCommunityOptionAck ack;
    const int32_t rc = HandleUpdateCommunityOptionReq(store, uid, parsed, ack, err);
    CHECK(rc == NET_OK, "handler net_ok over the wire");

    SerBuffer ackPayload = PutPayload([&ack](Serializer& s) { return PutUpdateCommunityOptionAck(s, ack); });
    Serializer r2;
    UpdateCommunityOptionAck parsedAck;
    CHECK(r2.BeginReading(&ackPayload) && GetUpdateCommunityOptionAck(r2, parsedAck), "client parses ack");
    r2.EndReading();
    CHECK(parsedAck.iOK == NET_OK &&
          parsedAck.kDenyOptions.cDenyInviteGuild == 0 &&
          parsedAck.kDenyOptions.cDenyPersonalTrade == 2 &&
          parsedAck.kDenyOptions.cDenyInvitePracticePVP == 2,
          "ack survives roundtrip");
}

void RunCommunityOptionTestsByRef(int& pass, int& fail)
{
    TestReqGoldenBytes();
    TestAckGoldenBytes();
    TestEventIds();
    TestValidateDenyOptions();
    TestUpdateDenyOptionsUpsert();
    TestHandleUpdateCommunityOptionReq();
    TestWireLoopback();
    pass += g_pass_co;
    fail += g_fail_co;
}
