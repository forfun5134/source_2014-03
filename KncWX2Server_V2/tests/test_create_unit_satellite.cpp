// tests/test_create_unit_satellite.cpp — CREATE_UNIT 衛星表副作用（§0a5）
// 對照原 gup_create_unit：GQuests(QuestID=13,SubQuest0=1)／GSkill・GSkillSlot（僅 class 1..4：
//   10000/20030/30000/40010，Slot01=SkillID）／GSpirit（StartSpirit←gresurrectionstonecnt，缺值→0；Flag=0）／
//   GDenyOption（QuestionNo 1..4, CodeNo=1）；副作用與 gunit+gunit_nickname 同一 transaction，失敗整體 ROLLBACK。
// ⚠ StartSpirit 起始值倉庫無 seed 資料（原 production DB 有列）；V2 缺列/NULL → 0（誠實偏差，見 architecture §0a5）。
#include <cstdio>
#include <string>

#include "../src/core/NetError.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/UnitSelectArbiter.h"
#include "../src/server/CreateUnitProtocol.h"

using namespace x2;
using namespace x2::db;
using namespace x2::select_unit;
using namespace x2::create_unit;

void RunCreateUnitSatelliteTestsByRef(int& pass, int& fail);
static int g_pass_sat = 0, g_fail_sat = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_sat++; } \
    else { g_fail_sat++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static bool ScalarInt(Database& db, const char* sql, int64_t arg, int64_t& out)
{
    Statement st;
    std::string err;
    if (!st.Prepare(db, sql, err)) return false;
    if (!st.BindInt(1, arg, err)) return false;
    std::string se;
    if (!st.StepRow(se)) return false;
    out = st.ColumnInt64(0);
    return true;
}

static bool ScalarInt2(Database& db, const char* sql, int64_t a, int64_t b, int64_t& out)
{
    Statement st;
    std::string err;
    if (!st.Prepare(db, sql, err)) return false;
    if (!st.BindInt(1, a, err)) return false;
    if (!st.BindInt(2, b, err)) return false;
    std::string se;
    if (!st.StepRow(se)) return false;
    out = st.ColumnInt64(0);
    return true;
}

static void SeedGUser(GameStore& store, int64_t userUID, const char* userID, bool& ok)
{
    GUserRecord gu;
    std::string err;
    ok = store.GetOrCreateGUser(userUID, userID, gu, err);
}

static int64_t CreateUnitOk(GameStore& store, int64_t userUID, const wchar_t* nick, int unitClass)
{
    CreateUnitReq req; req.iClass = unitClass; req.wstrNickName = nick;
    CreateUnitAck ack;
    std::string err;
    if (!HandleCreateUnitReq(store, userUID, /*authLevel=*/5, req, ack, err)) return -1;
    if (ack.iOK != NET_OK) return -2;
    return ack.kUnitInfo.unitUID;
}

static void TestSatelliteRows()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open in-memory game db");
    CHECK(ApplyGameMigrations(db, err), "apply game migrations");
    GameStore store(db);
    bool ok = false;
    SeedGUser(store, 4242, "satest", ok);
    CHECK(ok, "seed guser 4242");

    const int64_t uid1 = CreateUnitOk(store, 4242, L"satcls01", 1);
    CHECK(uid1 > 0, "class 1 unit created");
    const int64_t uid2 = CreateUnitOk(store, 4242, L"satcls02", 2);
    const int64_t uid3 = CreateUnitOk(store, 4242, L"satcls03", 3);
    const int64_t uid4 = CreateUnitOk(store, 4242, L"satcls04", 4);
    const int64_t uid5 = CreateUnitOk(store, 4242, L"satcls05", 5);
    CHECK(uid2 > 0 && uid3 > 0 && uid4 > 0 && uid5 > 0, "classes 2..5 created");

    // --- GSkill：class 1..4 各 1 列（10000/20030/30000/40010），class 5 無列
    {
        int64_t v = -1;
        CHECK(ScalarInt2(db, "SELECT COUNT(*) FROM gskill WHERE UnitUID = ? AND SkillID = ?;", uid1, 10000, v) && v == 1, "class1 -> skill 10000");
        CHECK(ScalarInt2(db, "SELECT COUNT(*) FROM gskill WHERE UnitUID = ? AND SkillID = ?;", uid2, 20030, v) && v == 1, "class2 -> skill 20030");
        CHECK(ScalarInt2(db, "SELECT COUNT(*) FROM gskill WHERE UnitUID = ? AND SkillID = ?;", uid3, 30000, v) && v == 1, "class3 -> skill 30000");
        CHECK(ScalarInt2(db, "SELECT COUNT(*) FROM gskill WHERE UnitUID = ? AND SkillID = ?;", uid4, 40010, v) && v == 1, "class4 -> skill 40010");
        CHECK(ScalarInt(db, "SELECT COUNT(*) FROM gskill WHERE UnitUID = ?;", uid5, v) && v == 0, "class5 -> no skill rows (faithful)");
    }
    // --- GSkillSlotNew（§0a23 v14）：class 1..4 有 page=1 Slot01=SkillID、02/03/04=0；class 5 無列；gskillexpand=1/1；gskill 擴充欄位
    {
        int64_t v = -1;
        CHECK(ScalarInt(db, "SELECT Slot01 FROM gskillslotnew WHERE UnitUID = ? AND SkillPageNumber = 1;", uid1, v) && v == 10000, "class1 slotA page1 slot01 = 10000");
        CHECK(ScalarInt(db, "SELECT Slot02 FROM gskillslotnew WHERE UnitUID = ? AND SkillPageNumber = 1;", uid1, v) && v == 0, "class1 slotA page1 slot02 = 0");
        CHECK(ScalarInt(db, "SELECT Slot03 FROM gskillslotnew WHERE UnitUID = ? AND SkillPageNumber = 1;", uid1, v) && v == 0, "class1 slotA page1 slot03 = 0");
        CHECK(ScalarInt(db, "SELECT Slot04 FROM gskillslotnew WHERE UnitUID = ? AND SkillPageNumber = 1;", uid1, v) && v == 0, "class1 slotA page1 slot04 = 0");
        CHECK(ScalarInt(db, "SELECT COUNT(*) FROM gskillslotnew WHERE UnitUID = ?;", uid5, v) && v == 0, "class5 -> no slotA row (faithful)");
        CHECK(ScalarInt(db, "SELECT COUNT(*) FROM gskillexpand WHERE UnitUID = ? AND PageCount = 1 AND ActivePage = 1;", uid1, v) && v == 1, "class1 expand row 1/1");
        CHECK(ScalarInt(db, "SELECT COUNT(*) FROM gskillexpand WHERE UnitUID = ?;", uid5, v) && v == 0, "class5 -> no expand row (no skill rows)");
        CHECK(ScalarInt(db, "SELECT SkillLevel FROM gskill WHERE UnitUID = ? AND SkillID = 10000;", uid1, v) && v == 1, "class1 gskill SkillLevel = 1");
        CHECK(ScalarInt(db, "SELECT SkillPageNumber FROM gskill WHERE UnitUID = ? AND SkillID = 10000;", uid1, v) && v == 1, "class1 gskill SkillPageNumber = 1");
        CHECK(ScalarInt(db, "SELECT SkillCSPoint FROM gskill WHERE UnitUID = ? AND SkillID = 10000;", uid1, v) && v == 0, "class1 gskill SkillCSPoint = 0");
    }
    // --- GQuests：所有職業 QuestID=13、SubQuest0=1、其餘 0（class 1 與 class 5）
    {
        auto countQ = [&db](int64_t uid) {
            Statement st; std::string e;
            if (!st.Prepare(db, "SELECT COUNT(*) FROM gquests WHERE UnitUID = ? AND QuestID = 13 AND SubQuest0 = 1"
                                " AND SubQuest1 = 0 AND SubQuest2 = 0 AND SubQuest3 = 0 AND SubQuest4 = 0;", e)) return -1;
            if (!st.BindInt(1, uid, e)) return -1;
            std::string se; if (!st.StepRow(se)) return -1;
            return static_cast<int>(st.ColumnInt64(0));
        };
        CHECK(countQ(uid1) == 1, "class1 quest row (QuestID=13, SubQuest0=1)");
        CHECK(countQ(uid5) == 1, "class5 quest row (all classes, faithful)");
    }
    // --- GDenyOption：每個角色 4 列（QuestionNo 1..4、CodeNo=1）
    {
        int64_t v = -1;
        CHECK(ScalarInt(db, "SELECT COUNT(*) FROM gdenyoption WHERE UnitUID = ?;", uid1, v) && v == 4, "class1 -> 4 deny rows");
        CHECK(ScalarInt(db, "SELECT COUNT(*) FROM gdenyoption WHERE UnitUID = ? AND CodeNo = 1;", uid1, v) && v == 4, "class1 deny rows CodeNo=1");
        CHECK(ScalarInt(db, "SELECT COUNT(DISTINCT QuestionNo) FROM gdenyoption WHERE UnitUID = ?;", uid5, v) && v == 4, "class5 deny QuestionNo 1..4");
    }
    // --- GSpirit：空 gresurrectionstonecnt → Spirit=0、Flag=0
    {
        int64_t v = -1;
        CHECK(ScalarInt(db, "SELECT COUNT(*) FROM gspirit WHERE UnitUID = ?;", uid1, v) && v == 1, "class1 spirit row exists");
        CHECK(ScalarInt(db, "SELECT Spirit FROM gspirit WHERE UnitUID = ?;", uid1, v) && v == 0, "empty stone table -> Spirit=0 (documented deviation)");
        CHECK(ScalarInt(db, "SELECT Flag FROM gspirit WHERE UnitUID = ?;", uid1, v) && v == 0, "spirit Flag=0 (DF_GSpirit_Flag)");
    }
}

static void TestStartSpiritFromStoneTable()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open in-memory game db (stone)");
    CHECK(ApplyGameMigrations(db, err), "apply game migrations (stone)");
    {
        Statement st; std::string e;
        CHECK(st.Prepare(db, "INSERT INTO gresurrectionstonecnt (StartCnt, SupplyCnt, StartSpirit) VALUES (1, 1, 100);", e), "seed stone row");
        std::string se;
        CHECK(!st.StepRow(se) && se.empty(), "stone row inserted");
    }
    GameStore store(db);
    bool ok = false;
    SeedGUser(store, 7777, "stoner", ok);
    CHECK(ok, "seed guser 7777");
    const int64_t uid = CreateUnitOk(store, 7777, L"stoneone", 1);
    CHECK(uid > 0, "unit created with stone seed");
    int64_t v = -1;
    CHECK(ScalarInt(db, "SELECT Spirit FROM gspirit WHERE UnitUID = ?;", uid, v) && v == 100, "Spirit == StartSpirit(100)");
}

static void TestSideEffectFailureRollsBack()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open in-memory game db (rollback)");
    CHECK(ApplyGameMigrations(db, err), "apply game migrations (rollback)");
    GameStore store(db);
    bool ok = false;
    SeedGUser(store, 8888, "stateroller", ok);
    CHECK(ok, "seed guser 8888");
    // 讓衛星插入失敗：刪除 gskillslotnew（class 1 → 需插入 gskillslotnew → 失敗；§0a23）
    {
        Statement st; std::string e;
        CHECK(st.Prepare(db, "DROP TABLE gskillslotnew;", e), "drop gskillslotnew");
        std::string se;
        CHECK(!st.StepRow(se) && se.empty(), "gskillslotnew dropped");
    }
    CreateUnitReq req; req.iClass = 1; req.wstrNickName = L"rollbackme01";
    CreateUnitAck ack;
    CHECK(HandleCreateUnitReq(store, 8888, /*authLevel=*/5, req, ack, err), "create-with-broken-satellite handled");
    CHECK(ack.iOK == ERR_CREATE_UNIT_02, "satellite failure -> ERR_CREATE_UNIT_02");
    int64_t v = -1;
    CHECK(ScalarInt(db, "SELECT COUNT(*) FROM gunit WHERE UserUID = ?;", 8888, v) && v == 0, "rollback: no gunit row");
    {
        Statement st; std::string e;
        CHECK(st.Prepare(db, "SELECT COUNT(*) FROM gunit_nickname WHERE NickName = 'rollbackme01';", e), "prep nickname count");
        std::string se;
        CHECK(st.StepRow(se) && st.ColumnInt64(0) == 0, "rollback: no nickname row");
    }
    {
        Statement st; std::string e;
        CHECK(st.Prepare(db, "SELECT COUNT(*) FROM gquests;", e), "prep gquests count");
        std::string se;
        CHECK(st.StepRow(se) && st.ColumnInt64(0) == 0, "rollback: no gquests row");
    }
}

void RunCreateUnitSatelliteTestsByRef(int& pass, int& fail)
{
    const int pass0 = g_pass_sat, fail0 = g_fail_sat;
    TestSatelliteRows();
    TestStartSpiritFromStoneTable();
    TestSideEffectFailureRollsBack();
    pass += g_pass_sat - pass0;
    fail += g_fail_sat - fail0;
}
