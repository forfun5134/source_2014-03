// tests/test_equip_title.cpp — EGS_EQUIP_TITLE_REQ/ACK（§0a20）
// 對照原 GSUserGameCommon::IMPL_ON_FUNC(EGS_EQUIP_TITLE_REQ)（GSUserGameCommon.cpp:6540–…）＋ KUserTitleManager::EquipTitle（UserTitleManager.cpp:1437–1506）：
//   REQ{ m_iTitleID:int }；ACK{ m_iOK, m_iTitleID }；事件 543/544；SERV_TITLE_DATA_SIZE
// 原版 DB 寫入延遲到 DBE_UPDATE_UNIT_INFO（gup_update_title_hang(UnitUID, initID, equippedID)）；V2 為 write-through（見 EquipTitleProtocol.h 偏差聲明 2）。
#include <cstdio>
#include <cstring>
#include <functional>
#include <string>
#include <vector>

#include "../src/core/NetError.h"
#include "../src/core/SerBuffer.h"
#include "../src/core/Serializer.h"
#include "../src/core/EventIDs.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/EquipTitleProtocol.h"
#include "../src/server/CreateUnitProtocol.h"
#include "../src/server/UnitSelectArbiter.h"

using namespace x2;
using namespace x2::db;
using namespace x2::equip_title;
using namespace x2::create_unit;
using namespace x2::select_unit;

static int g_pass_et = 0, g_fail_et = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_et++; } \
    else { g_fail_et++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

struct Fixture
{
    Database db;
    GameStore store;
    std::string err;
    Fixture() : store(db)
    {
        if (!db.Open(":memory:", err)) return;
        ApplyGameMigrations(db, err);
    }
    int64_t MakeUnit(int64_t userUID, const wchar_t* nick)
    {
        char buf[32];
        std::snprintf(buf, sizeof buf, "et_%lld", (long long)userUID);
        GUserRecord gu;
        if (!store.GetOrCreateGUser(userUID, buf, gu, err)) return -1;
        CreateUnitReq req; req.iClass = 1; req.wstrNickName = nick;
        CreateUnitAck ack;
        if (!HandleCreateUnitReq(store, userUID, 5, req, ack, err)) return -1;
        return ack.iOK == NET_OK ? ack.kUnitInfo.unitUID : -1;
    }
};

static SerBuffer PutPayload(const std::function<bool(Serializer&)>& fn)
{
    SerBuffer buf;
    Serializer ks;
    if (!ks.BeginWriting(&buf)) return SerBuffer{};
    if (!fn(ks)) return SerBuffer{};
    ks.EndWriting();
    return buf;
}

// ---------- codec golden ----------

static void TestReqGoldenBytes()
{
    EquipTitleReq req;
    req.iTitleID = 0x01020304;
    SerBuffer buf = PutPayload([&req](Serializer& s) { return PutEquipTitleReq(s, req); });
    const unsigned char expect[4] = { 0x01, 0x02, 0x03, 0x04 };
    CHECK(buf.GetLength() == sizeof(expect) && std::memcmp(buf.GetData(), expect, sizeof(expect)) == 0,
          "req golden bytes (int32 BE)");
    EquipTitleReq back;
    Serializer ks;
    CHECK(ks.BeginReading(&buf) && GetEquipTitleReq(ks, back), "req parse");
    ks.EndReading();
    CHECK(back.iTitleID == 0x01020304, "req roundtrip");
}

static void TestAckGoldenBytes()
{
    EquipTitleAck ack;
    ack.iOK = NET_OK;
    ack.iTitleID = 0x01020304;
    SerBuffer buf = PutPayload([&ack](Serializer& s) { return PutEquipTitleAck(s, ack); });
    const unsigned char expect[8] = { 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04 };
    CHECK(buf.GetLength() == sizeof(expect) && std::memcmp(buf.GetData(), expect, sizeof(expect)) == 0,
          "ack golden bytes (2×int32 BE)");
    EquipTitleAck back;
    Serializer ks;
    CHECK(ks.BeginReading(&buf) && GetEquipTitleAck(ks, back), "ack parse");
    ks.EndReading();
    CHECK(back.iOK == NET_OK && back.iTitleID == 0x01020304, "ack roundtrip");
    // 錯誤碼 int32 BE：ERR_TITLE_00 = 494 = 0x1EE
    EquipTitleAck errAck;
    errAck.iOK = ERR_TITLE_00;
    errAck.iTitleID = 42;
    SerBuffer ebuf = PutPayload([&errAck](Serializer& s) { return PutEquipTitleAck(s, errAck); });
    const unsigned char expectErr[8] = { 0x00, 0x00, 0x01, 0xEE, 0x00, 0x00, 0x00, 0x2A };
    CHECK(ebuf.GetLength() == sizeof(expectErr) && std::memcmp(ebuf.GetData(), expectErr, sizeof(expectErr)) == 0,
          "ack error golden bytes (494 = 0x000001EE)");
}

static void TestEventIdsAndErrorCodes()
{
    CHECK(static_cast<uint16_t>(EventID::EGS_EQUIP_TITLE_REQ) == 543 &&
          static_cast<uint16_t>(EventID::EGS_EQUIP_TITLE_ACK) == 544,
          "event ids 543/544");
    CHECK(ERR_TITLE_00 == 494 && ERR_TITLE_01 == 495 && ERR_TITLE_02 == 496 &&
          ERR_TITLE_03 == 497 && ERR_TITLE_04 == 498 && ERR_TITLE_05 == 499,
          "ERR_TITLE_00..05 == 494..499 (compiled against original NetError_def.h)");
}

// ---------- handler ----------

static void SeedTitle(Fixture& fx, int64_t uid, int32_t titleID, const char* endDate, bool isHang)
{
    std::string sql = "INSERT INTO gtitle_complete (UnitUID, TitleID, EndDate, IsHang) VALUES (" +
                      std::to_string(uid) + ", " + std::to_string(titleID) + ", " +
                      (endDate ? std::string("'") + endDate + "'" : std::string("NULL")) +
                      ", " + (isHang ? "1" : "0") + ");";
    fx.db.Exec(sql, fx.err);
}

static EquipTitleAck DoReq(Fixture& fx, int64_t uid, int32_t titleID, const std::string& nowUtc = "2026-11-17 12:00:00")
{
    EquipTitleReq req; req.iTitleID = titleID;
    EquipTitleAck ack;
    std::string err;
    HandleEquipTitleReq(fx.store, uid, req, ack, err, nowUtc);
    return ack;
}

static int HangCount(Fixture& fx, int64_t uid)
{
    std::vector<TitleCompleteRecord> titles;
    fx.store.GetTitleCompleteList(uid, titles, fx.err);
    int n = 0;
    for (const auto& t : titles) if (t.isHang) ++n;
    return n;
}

static void TestHandler()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(777, L"eq.title");
    CHECK(uid > 0, "unit created");
    SeedTitle(fx, uid, 100, nullptr, true);                  // 永久稱號 100（已配裝）
    SeedTitle(fx, uid, 200, "2030-01-01 00:00:00", false);   // 未過期稱號 200
    SeedTitle(fx, uid, 300, "2000-01-01 00:00:00", false);   // 已過期稱號 300

    // 已配裝中 → ERR_TITLE_01
    CHECK(DoReq(fx, uid, 100).iOK == ERR_TITLE_01, "equip already-equipped -> ERR_TITLE_01");
    CHECK(HangCount(fx, uid) == 1, "no db mutation on ERR_TITLE_01");
    // 未持有 → ERR_TITLE_00
    CHECK(DoReq(fx, uid, 999).iOK == ERR_TITLE_00, "equip not owned -> ERR_TITLE_00");
    CHECK(HangCount(fx, uid) == 1, "no db mutation on ERR_TITLE_00");
    // 過期 → ERR_TITLE_02
    CHECK(DoReq(fx, uid, 300).iOK == ERR_TITLE_02, "equip expired -> ERR_TITLE_02");
    CHECK(HangCount(fx, uid) == 1, "no db mutation on ERR_TITLE_02");
    // 合法切換 100 → 200
    {
        EquipTitleAck ack = DoReq(fx, uid, 200);
        CHECK(ack.iOK == NET_OK && ack.iTitleID == 200, "equip owned title -> NET_OK, echo iTitleID");
        std::vector<TitleCompleteRecord> titles;
        fx.store.GetTitleCompleteList(uid, titles, fx.err);
        for (const auto& t : titles) {
            if (t.titleID == 100) CHECK(!t.isHang, "old title unhung");
            if (t.titleID == 200) CHECK(t.isHang, "new title hung");
        }
        CHECK(HangCount(fx, uid) == 1, "exactly one hung title after switch");
    }
    // 卸下（0）→ 全部 IsHang=0
    {
        EquipTitleAck ack = DoReq(fx, uid, 0);
        CHECK(ack.iOK == NET_OK, "unequip -> NET_OK");
        CHECK(HangCount(fx, uid) == 0, "all titles unhung");
    }
    // 從全卸狀態掛上 300？（過期仍擋）→ ERR_TITLE_02
    CHECK(DoReq(fx, uid, 300).iOK == ERR_TITLE_02, "equip expired from unhung state -> ERR_TITLE_02");
    // 掛上 200 → NET_OK（無舊配裝可脫）
    CHECK(DoReq(fx, uid, 200).iOK == NET_OK, "equip from unhung state -> NET_OK");
    // 負值 titleID → ERR_TITLE_03
    CHECK(DoReq(fx, uid, -1).iOK == ERR_TITLE_03, "negative title id -> ERR_TITLE_03");
    // 無法解析的 EndDate → fail closed（視為過期）
    SeedTitle(fx, uid, 400, "garbage-date!!", false);
    CHECK(DoReq(fx, uid, 400).iOK == ERR_TITLE_02, "unparseable EndDate -> ERR_TITLE_02 (fail closed)");
    // ACK 回顯 iTitleID（失敗時不歸零）
    {
        EquipTitleAck ack = DoReq(fx, uid, 999);
        CHECK(ack.iTitleID == 999, "ack echoes input title id on failure");
    }
    // 歸屬錯誤：別的使用者的 unitUID → 持有列表為空 → ERR_TITLE_00
    CHECK(DoReq(fx, uid + 1000000, 200).iOK == ERR_TITLE_00, "foreign unit -> ERR_TITLE_00");
}

void RunEquipTitleTestsByRef(int& pass, int& fail)
{
    TestReqGoldenBytes();
    TestAckGoldenBytes();
    TestEventIdsAndErrorCodes();
    TestHandler();
    pass += g_pass_et;
    fail += g_fail_et;
}
