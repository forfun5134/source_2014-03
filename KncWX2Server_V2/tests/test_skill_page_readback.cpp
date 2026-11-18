// tests/test_skill_page_readback.cpp — SELECT_UNIT_1_NOT 技能頁系統讀回（§0a23，schema v14）
// 對照原 DBE_SELECT_UNIT_REQ → Query_SelectUnit（GSGameDBThread，SERV_SKILL_PAGE_SYSTEM）：
//   P_GSkill_Expand_SEL → gskillexpand（缺列 → 1/1）
//   P_GSkill_New_SEL    → gskill（SkillID>0 && SkillLevel>0）
//   P_GSkillSlot_New_SEL → gskillslotnew（整表缺列 → 自癒 INSERT 0×N，原 InsertSkillWithSkillSlot 副作用）
//   P_GSkillSlot2_New_SEL → gskillslot2new（缺列 → 哨兵 EndDate 2000-01-01 00:00:00，不寫回）
//   gup_get_unsealed_skill_info → gskillunsealed
//   gup_get_cash_skill_point_info → gskillcash（缺列 → 0/0/哨兵）
// ⚠ 2013 表結構/語意皆為反推（proc 不在倉庫）；偏差登錄見 docs/architecture.md §0a23。
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>

#include "../src/core/NetError.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/UnitSelectArbiter.h"
#include "../src/server/SelectUnitProtocol.h"
#include "../src/server/CreateUnitProtocol.h"

using namespace x2;
using namespace x2::db;
using namespace x2::select_unit;
using namespace x2::create_unit;

static int g_pass_sk = 0, g_fail_sk = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_sk++; } \
    else { g_fail_sk++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

struct Fixture
{
    Database db;
    GameStore store;
    std::string err;
    Fixture() : store(db) { if (!db.Open(":memory:", err)) return; ApplyGameMigrations(db, err); }
    int64_t MakeUnit(int64_t userUID, const wchar_t* nick, int unitClass = 1)
    {
        char buf[32];
        std::snprintf(buf, sizeof buf, "sk_%lld", (long long)userUID);
        GUserRecord gu;
        if (!store.GetOrCreateGUser(userUID, buf, gu, err)) return -1;
        CreateUnitReq req; req.iClass = unitClass; req.wstrNickName = nick;
        CreateUnitAck ack;
        if (!HandleCreateUnitReq(store, userUID, 5, req, ack, err)) return -1;
        return ack.iOK == NET_OK ? ack.kUnitInfo.unitUID : -1;
    }
    bool SelectNot1(int64_t userUID, int64_t unitUID, SelectUnitNot1& out1)
    {
        SelectUnitReq req; req.unitUID = unitUID;
        SelectUnitAck ack;
        std::string e;
        int rc = HandleSelectUnitReq(store, userUID, req, ack, e, /*secondSecurityOk=*/true,
                                     /*outUnit=*/nullptr, &out1, /*authLevel=*/5,
                                     /*outNot2=*/nullptr, /*outNot3=*/nullptr,
                                     /*outNot4=*/nullptr, /*outNot5=*/nullptr);
        err = e;
        return rc == NET_OK && ack.iOK == NET_OK;
    }
};

static int64_t Scalar(Database& db, const char* sql, int64_t arg, bool& ok)
{
    Statement st;
    std::string e;
    ok = false;
    if (!st.Prepare(db, sql, e)) return -1;
    if (!st.BindInt(1, arg, e)) return -1;
    std::string se;
    if (!st.StepRow(se)) return -1;
    ok = true;
    return st.ColumnInt64(0);
}

static void TestSchemaV14()
{
    Fixture fx;
    int v = fx.db.UserVersion(fx.err);
    CHECK(v == kGameSchemaVersion && kGameSchemaVersion == 14, "schema v14 (user_version == 14)");
    CHECK(fx.db.Exec("SELECT 1 FROM gskillexpand LIMIT 0;", fx.err), "gskillexpand exists");
    CHECK(fx.db.Exec("SELECT 1 FROM gskillslotnew LIMIT 0;", fx.err), "gskillslotnew exists");
    CHECK(fx.db.Exec("SELECT 1 FROM gskillslot2new LIMIT 0;", fx.err), "gskillslot2new exists");
    CHECK(fx.db.Exec("SELECT 1 FROM gskillunsealed LIMIT 0;", fx.err), "gskillunsealed exists");
    CHECK(fx.db.Exec("SELECT 1 FROM gskillcash LIMIT 0;", fx.err), "gskillcash exists");
    CHECK(fx.db.Exec("SELECT SkillLevel, SkillCSPoint, SkillPageNumber FROM gskill LIMIT 0;", fx.err), "gskill extended columns exist");
}

static void TestMigrationBackfillFromV13()
{
    // 手工造一個最小 v13 庫（僅 backfill 涉及的表），跑 ApplyGameMigrations → v14
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open minimal v13 db");
    CHECK(db.Exec("CREATE TABLE gunit (UnitUID INTEGER PRIMARY KEY);", err), "minimal gunit");
    CHECK(db.Exec("CREATE TABLE gskill (UnitUID INTEGER NOT NULL, SkillID INTEGER NOT NULL,"
                  " RegDate TEXT NOT NULL DEFAULT '2000-01-01 00:00:00', PRIMARY KEY (UnitUID, SkillID));", err), "legacy gskill");
    CHECK(db.Exec("CREATE TABLE gskillslot (UnitUID INTEGER NOT NULL PRIMARY KEY,"
                  " Slot01 INTEGER NOT NULL, Slot02 INTEGER NOT NULL, Slot03 INTEGER NOT NULL);", err), "legacy gskillslot");
    CHECK(db.Exec("INSERT INTO gunit VALUES (9001);", err), "gunit row for legacy unit");
    // 孤兒列：有技能/槽位但無 gunit（FK 曾關閉時代入）→ 升級時應被 JOIN 濾除，不得 brick 整個遷移
    CHECK(db.Exec("INSERT INTO gskill (UnitUID, SkillID) VALUES (9001, 10000),(9002, 10000);", err), "legacy skill rows (9002 orphan)");
    CHECK(db.Exec("INSERT INTO gskillslot VALUES (9001, 10000, 0, 0),(9002, 10000, 0, 0);", err), "legacy slot rows (9002 orphan)");
    CHECK(db.SetUserVersion(13, err), "set user_version=13");
    CHECK(ApplyGameMigrations(db, err), "migrate v13 -> v14");
    CHECK(db.UserVersion(err) == 14, "user_version == 14 after migration");
    {
        bool ok = false;
        int64_t v = Scalar(db, "SELECT Slot01 FROM gskillslotnew WHERE UnitUID = ? AND SkillPageNumber = 1;", 9001, ok);
        CHECK(ok && v == 10000, "backfill: legacy Slot01 -> gskillslotnew page1 slot01");
        v = Scalar(db, "SELECT Slot04 FROM gskillslotnew WHERE UnitUID = ? AND SkillPageNumber = 1;", 9001, ok);
        CHECK(ok && v == 0, "backfill: Slot04 defaults 0");
        v = Scalar(db, "SELECT PageCount FROM gskillexpand WHERE UnitUID = ?;", 9001, ok);
        CHECK(ok && v == 1, "backfill: expand PageCount 1/1");
        v = Scalar(db, "SELECT ActivePage FROM gskillexpand WHERE UnitUID = ?;", 9001, ok);
        CHECK(ok && v == 1, "backfill: expand ActivePage 1/1");
        v = Scalar(db, "SELECT SkillLevel FROM gskill WHERE UnitUID = ? AND SkillID = 10000;", 9001, ok);
        CHECK(ok && v == 1, "backfill: gskill SkillLevel default 1");
        v = Scalar(db, "SELECT SkillPageNumber FROM gskill WHERE UnitUID = ? AND SkillID = 10000;", 9001, ok);
        CHECK(ok && v == 1, "backfill: gskill SkillPageNumber default 1");
        v = Scalar(db, "SELECT COUNT(*) FROM gskillslotnew WHERE UnitUID = ?;", 9002, ok);
        CHECK(ok && v == 0, "backfill: orphan legacy rows skipped (no FK brick)");
        v = Scalar(db, "SELECT COUNT(*) FROM gskillexpand WHERE UnitUID = ?;", 9002, ok);
        CHECK(ok && v == 0, "backfill: orphan expand rows skipped");
    }
}

static void TestCreateSelectRoundtrip()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(111, L"skill_t1", 1);
    CHECK(uid > 0, "class1 unit created");
    if (uid <= 0) return;

    SkillPageState stState;
    CHECK(fx.store.LoadSkillPageState(uid, stState, fx.err), "LoadSkillPageState ok");
    CHECK(stState.pagesAvailable == 1 && stState.activePage == 1, "pages 1/1 (create-unit expand row)");
    CHECK(stState.skills.size() == 1 && stState.skills[0].skillID == 10000 && stState.skills[0].skillLevel == 1 &&
          stState.skills[0].skillPageNumber == 1, "learned skill 10000 level 1 page 1");
    CHECK(stState.slotA.size() == 1 && stState.slotA[0].pageNumber == 1 &&
          stState.slotA[0].slot[0] == 10000 && stState.slotA[0].slot[1] == 0 &&
          stState.slotA[0].slot[2] == 0 && stState.slotA[0].slot[3] == 0, "slotA page1 = [10000,0,0,0]");
    CHECK(stState.slotB.empty(), "slotB empty (no Slot2 rows written)");
    CHECK(stState.skillSlotBEndDate == "2000-01-01 00:00:00", "slotB endDate sentinel (no rows)");
    CHECK(stState.unsealed.empty(), "unsealed empty");

    CashSkillPointValues cs;
    CHECK(fx.store.GetCashSkillPoint(uid, cs, fx.err), "GetCashSkillPoint ok (missing row)");
    CHECK(cs.csPoint == 0 && cs.maxCSPoint == 0 && cs.endDate == "2000-01-01 00:00:00", "cash defaults 0/0/哨兵");

    SelectUnitNot1 not1{};
    CHECK(fx.SelectNot1(111, uid, not1), "select ok");
    CHECK(not1.unitInfo.unitSkillData.theNumberOfSkillPagesAvailable == 1 && not1.unitInfo.unitSkillData.activeSkillPagesNumber == 1, "not1 pages 1/1");
    CHECK(not1.unitInfo.unitSkillData.equippedSkill[0].skillID == 10000 && not1.unitInfo.unitSkillData.equippedSkill[0].skillLevel == 1,
          "not1 equippedSkill[0] = {10000, 1}");
    CHECK(not1.unitInfo.unitSkillData.equippedSkillSlotB[0].skillID == 0 && not1.unitInfo.unitSkillData.equippedSkillSlotB[3].skillID == 0, "not1 slotB empty");
    CHECK(not1.unitInfo.unitSkillData.skillSlotBEndDate == L"2000-01-01 00:00:00", "not1 slotB endDate sentinel");
    CHECK(not1.vecUserSkillPageData.size() == 1, "not1 one page");
    CHECK(not1.vecUserSkillPageData[0].userSkillData.size() == 1 &&
          not1.vecUserSkillPageData[0].userSkillData[0].skillID == 10000 &&
          not1.vecUserSkillPageData[0].userSkillData[0].skillLevel == 1, "not1 page1 userSkillData = [10000/1]");
    CHECK(not1.vecUserSkillPageData[0].usSkillPoint == 0 && not1.vecUserSkillPageData[0].usCashSkillPoint == 0,
          "not1 page point fields 0 (no source)");
    CHECK(not1.vecSkillUnsealed.empty() && not1.mapSkillNote.empty() && not1.skillNoteMaxPageNum == 0,
          "not1 unsealed/note placeholders (no source)");
    CHECK(not1.unitInfo.csPoint == 0 && not1.unitInfo.maxCSPoint == 0 &&
          not1.unitInfo.csPointEndDate == L"2000-01-01 00:00:00", "not1 cash defaults");
}

static void TestMultiPageWiring()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(222, L"skill_t2", 1);
    CHECK(uid > 0, "unit created");
    if (uid <= 0) return;
    const std::string u = std::to_string(uid);
    // Expand 為 3 頁、目前使用第 2 頁
    CHECK(fx.db.Exec("UPDATE gskillexpand SET PageCount = 3, ActivePage = 2 WHERE UnitUID = " + u + ";", fx.err), "expand -> 3/2");
    // 第 2 頁學了 12001（Lv17，CSPoint 7）、第 3 頁學了 13001（Lv5）
    CHECK(fx.db.Exec("INSERT INTO gskill (UnitUID, SkillID, SkillLevel, SkillCSPoint, SkillPageNumber) VALUES (" + u + ", 12001, 17, 7, 2),(" + u + ", 13001, 5, 0, 3);", fx.err), "seed page skills");
    // 頁 2/3 的 SlotA；頁 3 的 SlotB（含 EndDate），頁 2 的 SlotB EndDate 較早（驗證取最高頁）
    CHECK(fx.db.Exec("INSERT INTO gskillslotnew (UnitUID, SkillPageNumber, Slot01, Slot02, Slot03, Slot04) VALUES (" + u + ", 2, 20001, 0, 0, 10000);", fx.err), "seed slotA page2");
    CHECK(fx.db.Exec("INSERT INTO gskillslotnew (UnitUID, SkillPageNumber, Slot01, Slot02, Slot03, Slot04) VALUES (" + u + ", 3, 30001, 0, 0, 0);", fx.err), "seed slotA page3");
    CHECK(fx.db.Exec("INSERT INTO gskillslot2new (UnitUID, SkillPageNumber, Slot01, Slot02, Slot03, Slot04, EndDate) VALUES (" + u + ", 2, 15001, 0, 0, 0, '2025-01-01 00:00:00');", fx.err), "seed slotB page2");
    CHECK(fx.db.Exec("INSERT INTO gskillslot2new (UnitUID, SkillPageNumber, Slot01, Slot02, Slot03, Slot04, EndDate) VALUES (" + u + ", 3, 21001, 0, 0, 0, '2026-05-01 10:00:00');", fx.err), "seed slotB page3");
    // 現金技能點
    CHECK(fx.db.Exec("INSERT INTO gskillcash (UnitUID, CSPoint, MaxCSPoint, EndDate) VALUES (" + u + ", 42, 99, '2027-03-01 00:00:00');", fx.err), "seed gskillcash");
    // 解封技能
    CHECK(fx.db.Exec("INSERT INTO gskillunsealed (UnitUID, SkillID) VALUES (" + u + ", 15002),(" + u + ", 10001);", fx.err), "seed unsealed");

    SkillPageState stState;
    CHECK(fx.store.LoadSkillPageState(uid, stState, fx.err), "load multi-page state");
    CHECK(stState.pagesAvailable == 3 && stState.activePage == 2, "pages 3, active 2");
    CHECK(stState.slotA.size() == 3, "slotA rows for 1..3 (page1 healed at create+read)");
    CHECK(stState.slotB.size() == 2 && stState.skillSlotBEndDate == "2026-05-01 10:00:00", "slotB endDate = 最高頁 EndDate");

    SelectUnitNot1 not1{};
    CHECK(fx.SelectNot1(222, uid, not1), "select ok");
    CHECK(not1.unitInfo.unitSkillData.activeSkillPagesNumber == 2 && not1.unitInfo.unitSkillData.theNumberOfSkillPagesAvailable == 3, "not1 active/available = 2/3");
    // equippedSkill ← active page 2：20001（未學 → Lv0）、0、0、10000（Lv1）
    CHECK(not1.unitInfo.unitSkillData.equippedSkill[0].skillID == 20001 && not1.unitInfo.unitSkillData.equippedSkill[0].skillLevel == 0, "equip[0] = unlearned 20001 Lv0");
    CHECK(not1.unitInfo.unitSkillData.equippedSkill[3].skillID == 10000 && not1.unitInfo.unitSkillData.equippedSkill[3].skillLevel == 1, "equip[3] = learned 10000 Lv1");
    // equippedSkillSlotB ← active page 2：15001
    CHECK(not1.unitInfo.unitSkillData.equippedSkillSlotB[0].skillID == 15001 && not1.unitInfo.unitSkillData.equippedSkillSlotB[0].skillLevel == 0, "slotB[0] = 15001");
    // 頁資料
    CHECK(not1.vecUserSkillPageData.size() == 3, "3 pages wired");
    CHECK(not1.vecUserSkillPageData[0].userSkillData.size() == 1, "page1 has class1 creation skill");
    CHECK(not1.vecUserSkillPageData[1].equippedSkill[0].skillID == 20001 && not1.vecUserSkillPageData[1].equippedSkill[3].skillID == 10000, "page2 slots wired");
    CHECK(not1.vecUserSkillPageData[1].userSkillData.size() == 1 &&
          not1.vecUserSkillPageData[1].userSkillData[0].skillID == 12001 &&
          not1.vecUserSkillPageData[1].userSkillData[0].skillLevel == 17 &&
          not1.vecUserSkillPageData[1].userSkillData[0].skillCSPoint == 7, "page2 learned 12001/17/CS7");
    CHECK(not1.vecUserSkillPageData[2].userSkillData.size() == 1 && not1.vecUserSkillPageData[2].userSkillData[0].skillID == 13001, "page3 learned 13001");
    CHECK(not1.vecUserSkillPageData[2].equippedSkillSlotB[0].skillID == 21001, "page3 slotB wired");
    // 現金技能點
    CHECK(not1.unitInfo.csPoint == 42 && not1.unitInfo.maxCSPoint == 99 &&
          not1.unitInfo.csPointEndDate == L"2027-03-01 00:00:00", "not1 cash csPoint wired");
    // 解封（ORDER BY SkillID）
    CHECK(not1.vecSkillUnsealed.size() == 2 && not1.vecSkillUnsealed[0] == 10001 && not1.vecSkillUnsealed[1] == 15002,
          "not1 unsealed [10001,15002]");
    CHECK(not1.mapSkillNote.empty() && not1.skillNoteMaxPageNum == 0, "notes empty (no source)");
}

static void TestActivePageClamp()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(333, L"skill_t3", 1);
    CHECK(uid > 0, "unit created");
    if (uid <= 0) return;
    const std::string u = std::to_string(uid);
    CHECK(fx.db.Exec("UPDATE gskillexpand SET PageCount = 2, ActivePage = 99 WHERE UnitUID = " + u + ";", fx.err), "expand active out-of-range");
    SkillPageState stState;
    CHECK(fx.store.LoadSkillPageState(uid, stState, fx.err), "load ok");
    CHECK(stState.pagesAvailable == 2 && stState.activePage == 1, "activePage 99 -> clamped 1 (原 clamps 語意)");
    {   // v14 起 DB CHECK (ActivePage >= 1) / (PageCount >= 1) 直接拒絕 0（比 clamp 更強的完整性保證）
        std::string e2;
        CHECK(!fx.db.Exec("UPDATE gskillexpand SET ActivePage = 0 WHERE UnitUID = " + u + ";", e2), "ActivePage=0 rejected by CHECK");
        CHECK(!fx.db.Exec("UPDATE gskillexpand SET PageCount = 0 WHERE UnitUID = " + u + ";", e2), "PageCount=0 rejected by CHECK");
    }
}

static void TestSlotASelfHeal()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(444, L"skill_t4", 1);
    CHECK(uid > 0, "unit created");
    if (uid <= 0) return;
    const std::string u = std::to_string(uid);
    // 展開到 2 頁，然後清掉 SlotA（模擬原 2013 空表情境）
    CHECK(fx.db.Exec("UPDATE gskillexpand SET PageCount = 2, ActivePage = 1 WHERE UnitUID = " + u + ";", fx.err), "expand 2/1");
    CHECK(fx.db.Exec("DELETE FROM gskillslotnew WHERE UnitUID = " + u + ";", fx.err), "wipe slotA");
    bool ok = false;
    int64_t cnt = Scalar(fx.db, "SELECT COUNT(*) FROM gskillslotnew WHERE UnitUID = ?;", uid, ok);
    CHECK(ok && cnt == 0, "slotA wiped");
    SkillPageState stState;
    CHECK(fx.store.LoadSkillPageState(uid, stState, fx.err), "load with self-heal");
    CHECK(stState.slotA.size() == 2, "self-heal: 2 default pages synthesized");
    cnt = Scalar(fx.db, "SELECT COUNT(*) FROM gskillslotnew WHERE UnitUID = ?;", uid, ok);
    CHECK(ok && cnt == 2, "self-heal: DB rows re-inserted (原 InsertSkillWithSkillSlot 副作用)");
    cnt = Scalar(fx.db, "SELECT Slot01 FROM gskillslotnew WHERE UnitUID = ? AND SkillPageNumber = 2;", uid, ok);
    CHECK(ok && cnt == 0, "self-heal: page2 slot01 = 0");
}

static void TestMissingTableFailsClosed()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(555, L"skill_t5", 1);
    CHECK(uid > 0, "unit created");
    if (uid <= 0) return;
    {
        std::string e2;
        CHECK(fx.db.Exec("ALTER TABLE gskill RENAME TO gskill_bak;", e2), "rename gskill");
        SelectUnitNot1 not1{};
        SelectUnitReq req; req.unitUID = uid;
        SelectUnitAck ack;
        std::string e3;
        int rc = HandleSelectUnitReq(fx.store, 555, req, ack, e3, true,
                                     nullptr, &not1, 5, nullptr, nullptr, nullptr, nullptr);
        CHECK(rc == ERR_SELECT_UNIT_05, "missing gskill -> ERR_SELECT_UNIT_05");
        CHECK(fx.db.Exec("ALTER TABLE gskill_bak RENAME TO gskill;", e2), "restore gskill");
    }
    {
        std::string e2;
        CHECK(fx.db.Exec("ALTER TABLE gskillcash RENAME TO gskillcash_bak;", e2), "rename gskillcash");
        SelectUnitNot1 not1{};
        SelectUnitReq req; req.unitUID = uid;
        SelectUnitAck ack;
        std::string e3;
        int rc = HandleSelectUnitReq(fx.store, 555, req, ack, e3, true,
                                     nullptr, &not1, 5, nullptr, nullptr, nullptr, nullptr);
        CHECK(rc == ERR_SELECT_UNIT_05, "missing gskillcash -> ERR_SELECT_UNIT_05");
        CHECK(fx.db.Exec("ALTER TABLE gskillcash_bak RENAME TO gskillcash;", e2), "restore gskillcash");
    }
}

static void TestCashSkillPointRoundtrip()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(666, L"skill_t6", 1);
    CHECK(uid > 0, "unit created");
    if (uid <= 0) return;
    const std::string u = std::to_string(uid);
    CHECK(fx.db.Exec("INSERT INTO gskillcash (UnitUID, CSPoint, MaxCSPoint, EndDate) VALUES (" + u + ", 7, 30, '2028-12-31 23:59:59');", fx.err), "seed cash");
    CashSkillPointValues cs;
    CHECK(fx.store.GetCashSkillPoint(uid, cs, fx.err), "read cash");
    CHECK(cs.csPoint == 7 && cs.maxCSPoint == 30 && cs.endDate == "2028-12-31 23:59:59", "cash values roundtrip");
}

void RunSkillPageReadbackTestsByRef(int& pass, int& fail)
{
    const int pass0 = g_pass_sk, fail0 = g_fail_sk;
    TestSchemaV14();
    TestMigrationBackfillFromV13();
    TestCreateSelectRoundtrip();
    TestMultiPageWiring();
    TestActivePageClamp();
    TestSlotASelfHeal();
    TestMissingTableFailsClosed();
    TestCashSkillPointRoundtrip();
    pass += g_pass_sk - pass0;
    fail += g_fail_sk - fail0;
}
