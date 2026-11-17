// tests/test_select_unit_daily_reset.cpp — SELECT_UNIT 登入副作用（§0a8：gup_select_unit 的 DB 部分）
// 對照原 DBE_SELECT_UNIT_REQ → gup_select_unit：
//   1) GSpirit 每日重置（RegDate 換算 06:00 KST 邊界已過 → Spirit=StartSpirit、Flag=0、RegDate=now）
//   2) 復活石每日補充（LastDate 同法 06:00 KST 已過 → 無列 INSERT StartCnt；有列 Quantity<SupplyCnt → 補至 SupplyCnt）
//   3) PlayDayCnt+1（日期不同時）、LoginCount+1、LastDate=now
//   4) SELECT_UNIT_1_NOT 的 UnitInfo.spirit ← GSpirit 讀回；CREATE_UNIT_ACK 的 spirit=StartSpirit（§0a5 寫入值）
//   4.1) SELECT_UNIT_4_NOT 的 kDenyOptions ← gdenyoption 讀回（§0a9；缺列→1=DOS_OFF；QN=5/6 建角未建列 → 恆預設 1）
//   5) CHARACTER_LIST/MY_UNIT_LIST 路徑不帶 spirit（原 P_GUnit_Userinfo_GET_20131212 不回傳 Spirit）→ 0
// ⚠ Statistics DB 的 StatsStoneCnt 統計、SERV_ACCUMULATION_SPIRIT_SYSTEM 變體、GAME01 跨庫寫法未建模（§12）。
// ⚠ StartCnt/SupplyCnt/StartSpirit 倉庫無 seed 資料；V2 以 gresurrectionstonecnt 注入值為準（缺值→0，誠實偏差）。
#include <cstdio>
#include <string>

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

void RunSelectUnitDailyResetTestsByRef(int& pass, int& fail);
static int g_pass_rst = 0, g_fail_rst = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_rst++; } \
    else { g_fail_rst++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static bool ExecF(Database& db, const std::string& sql)
{
    std::string err;
    return db.Exec(sql, err);
}

static bool ScalarI(Database& db, const char* sql, int64_t arg, int64_t& out)
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

struct Fixture
{
    Database db;
    std::string err;
    GameStore* store = nullptr;
    int64_t unitUID = 0;
    Fixture(bool seedResurrectionStoneCnt)
    {
        if (!db.Open(":memory:", err)) { store = nullptr; return; }
        if (!ApplyGameMigrations(db, err)) { store = nullptr; return; }
        if (seedResurrectionStoneCnt) {
            if (!ExecF(db, "INSERT INTO gresurrectionstonecnt (StartCnt, SupplyCnt, StartSpirit) VALUES (10, 20, 100);")) { store = nullptr; return; }
        }
    }
    ~Fixture() { delete store; }
    bool Ok() const { return store != nullptr || true; }
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

static bool SelectOk(GameStore& store, int64_t userUID, int64_t unitUID, SelectUnitNot1* not1)
{
    SelectUnitReq req; req.unitUID = unitUID;
    SelectUnitAck ack;
    std::string err;
    int rc = HandleSelectUnitReq(store, userUID, req, ack, err, /*secondSecurityOk=*/true,
                                 /*outUnit=*/nullptr, not1, /*authLevel=*/5);
    return rc == NET_OK && ack.iOK == NET_OK;
}

static bool SelectOk4(GameStore& store, int64_t userUID, int64_t unitUID, SelectUnitNot4* not4)
{
    SelectUnitReq req; req.unitUID = unitUID;
    SelectUnitAck ack;
    std::string err;
    int rc = HandleSelectUnitReq(store, userUID, req, ack, err, /*secondSecurityOk=*/true,
                                 /*outUnit=*/nullptr, /*outNot1=*/nullptr, /*authLevel=*/5,
                                 /*outNot2=*/nullptr, /*outNot3=*/nullptr, not4, /*outNot5=*/nullptr);
    return rc == NET_OK && ack.iOK == NET_OK;
}

static void TestDenyOptionReadback()
{
    Fixture fx(true);
    Database& db = fx.db;
    GameStore store(db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "rst_deny", gu, err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"denyread", 1);
    CHECK(uid > 0, "unit created");

    // 1) 建角 → QN 1..4 = 1（DOS_OFF），QN 5/6 缺列 → 預設 1
    {
        DenyOptionValues dv;
        CHECK(store.GetDenyOptions(uid, dv, err), "deny options readable after create");
        CHECK(dv.friendShip == 1 && dv.inviteGuild == 1 && dv.party == 1 && dv.personalTrade == 1 &&
              dv.requestCouple == 1 && dv.invitePracticePVP == 1,
              "deny options all DOS_OFF after create (QN1-4 from gdenyoption, 5/6 default)");
    }
    // 2) SELECT_UNIT_4_NOT 同步讀回
    {
        SelectUnitNot4 not4{};
        CHECK(SelectOk4(store, 777, uid, &not4), "select ok");
        CHECK(not4.kDenyOptions.cDenyFriendShip == 1 && not4.kDenyOptions.cDenyInviteGuild == 1 &&
              not4.kDenyOptions.cDenyParty == 1 && not4.kDenyOptions.cDenyPersonalTrade == 1 &&
              not4.kDenyOptions.cDenyRequestCouple == 1 && not4.kDenyOptions.cDenyInvitePracticePVP == 1,
              "not4 kDenyOptions = 1/1/1/1/1/1 after create");
    }
    // 3) 直接改庫（模擬客戶端已用 EGS_UPDATE_COMMUNITY_OPT 更新；V2 尚無該封包處理器）
    CHECK(ExecF(db, "UPDATE gdenyoption SET CodeNo = 0 WHERE UnitUID = " + std::to_string(uid) + " AND QuestionNo = 1;"), "set QN1 DOS_ON");
    CHECK(ExecF(db, "UPDATE gdenyoption SET CodeNo = 2 WHERE UnitUID = " + std::to_string(uid) + " AND QuestionNo = 3;"), "set QN3 DOS_ONLY_FRIEND");
    {
        SelectUnitNot4 not4{};
        CHECK(SelectOk4(store, 777, uid, &not4), "select ok 2");
        CHECK(not4.kDenyOptions.cDenyFriendShip == 0 && not4.kDenyOptions.cDenyParty == 2 &&
              not4.kDenyOptions.cDenyInviteGuild == 1 && not4.kDenyOptions.cDenyPersonalTrade == 1,
              "not4 kDenyOptions reflects DB (0/1/1/1 + 2)");
    }
    // 4) QN 5/6 補列（模擬 relationship 6 欄資料）
    CHECK(ExecF(db, "INSERT INTO gdenyoption (UnitUID, QuestionNo, CodeNo) VALUES (" + std::to_string(uid) + ", 5, 2);"), "insert QN5");
    CHECK(ExecF(db, "INSERT INTO gdenyoption (UnitUID, QuestionNo, CodeNo) VALUES (" + std::to_string(uid) + ", 6, 0);"), "insert QN6");
    {
        DenyOptionValues dv;
        CHECK(store.GetDenyOptions(uid, dv, err), "deny options re-readable");
        CHECK(dv.requestCouple == 2 && dv.invitePracticePVP == 0, "QN5/6 read from DB when present");
        SelectUnitNot4 not4{};
        CHECK(SelectOk4(store, 777, uid, &not4), "select ok 3");
        CHECK(not4.kDenyOptions.cDenyRequestCouple == 2 && not4.kDenyOptions.cDenyInvitePracticePVP == 0,
              "not4 kDenyOptions QN5/6 from DB");
    }
    // 5) 未知 QuestionNo → 忽略，不影響已知欄位
    CHECK(ExecF(db, "INSERT INTO gdenyoption (UnitUID, QuestionNo, CodeNo) VALUES (" + std::to_string(uid) + ", 99, 0);"), "insert unknown QN");
    {
        DenyOptionValues dv;
        CHECK(store.GetDenyOptions(uid, dv, err), "deny options readable with unknown QN");
        CHECK(dv.friendShip == 0 && dv.party == 2 && dv.requestCouple == 2 && dv.invitePracticePVP == 0,
              "unknown QuestionNo ignored");
    }
    // 6) 缺列（新角色將所有 gdenyoption 列刪掉）→ 全 1，非錯誤
    CHECK(ExecF(db, "DELETE FROM gdenyoption WHERE UnitUID = " + std::to_string(uid) + ";"), "delete all deny rows");
    {
        DenyOptionValues dv;
        CHECK(store.GetDenyOptions(uid, dv, err), "deny options missing rows returns true");
        CHECK(dv.friendShip == 1 && dv.inviteGuild == 1 && dv.party == 1 && dv.personalTrade == 1 &&
              dv.requestCouple == 1 && dv.invitePracticePVP == 1,
              "missing rows -> all DOS_OFF(1)");
        SelectUnitNot4 not4{};
        CHECK(SelectOk4(store, 777, uid, &not4), "select ok with no deny rows");
        CHECK(not4.kDenyOptions.cDenyFriendShip == 1 && not4.kDenyOptions.cDenyInvitePracticePVP == 1,
              "not4 kDenyOptions all 1 when rows missing");
    }
    // 7) GetDenyOptions 對不存在 unitUID → true（原 proc 不檢查 unit 存在與否）
    {
        DenyOptionValues dv;
        CHECK(store.GetDenyOptions(0x7FFFFFFF00000002LL, dv, err), "GetDenyOptions nonexistent unit returns true");
        CHECK(dv.friendShip == 1 && dv.invitePracticePVP == 1, "nonexistent unit -> all defaults");
    }
}

static void TestCreateAckSpirit(bool seed)
{
    Fixture fx(seed);
    Database& db = fx.db;
    GameStore store(db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "rst_seed", gu, err), "guser ok");
    CreateUnitReq req; req.wstrNickName = L"spirit55"; req.iClass = 1;
    CreateUnitAck ack;
    CHECK(HandleCreateUnitReq(store, 777, 5, req, ack, err), "create handled");
    CHECK(ack.iOK == NET_OK, "create ok");
    CHECK(ack.kUnitInfo.spirit == (seed ? 100 : 0), seed ? "create ack spirit = StartSpirit(100)" : "create ack spirit = 0 (no seed)");
    // GSpirit 列應已寫入 spirit=StartSpirit / Flag=0
    int64_t sp = -1, flag = -1;
    const std::string sql = "SELECT Spirit FROM gspirit WHERE UnitUID = ?;";
    CHECK(ScalarI(db, sql.c_str(), ack.kUnitInfo.unitUID, sp), "gspirit readable");
    CHECK(sp == (seed ? 100 : 0), "gspirit spirit stored");
    CHECK(ScalarI(db, "SELECT Flag FROM gspirit WHERE UnitUID = ?;", ack.kUnitInfo.unitUID, flag) && flag == 0, "gspirit flag=0");
}

static void TestFreshSelectKeepsSpirit()
{
    Fixture fx(true);
    Database& db = fx.db;
    GameStore store(db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "rst_fresh", gu, err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"freshspirit", 1);
    CHECK(uid > 0, "unit created");
    // 建角當日選角：spirit 不應被重置
    SelectUnitNot1 not1{};
    CHECK(SelectOk(store, 777, uid, &not1), "select ok");
    CHECK(not1.unitInfo.spirit == 100, "fresh select spirit unchanged");
    // 復活石：LastDate 為今天 → refill_at 尚未到 → 不應建立新列
    ResurrectionStoneValues rs;
    CHECK(!store.GetResurrectionStone(uid, rs, err), "no resurrection stone row yet");
    // 登入計數：1 次
    int64_t lc = -1;
    CHECK(ScalarI(db, "SELECT LoginCount FROM gunit WHERE UnitUID = ?;", uid, lc) && lc == 1, "loginCount = 1");
    int64_t pd = -1;
    CHECK(ScalarI(db, "SELECT PlayDayCnt FROM gunit WHERE UnitUID = ?;", uid, pd) && pd == 0, "playDayCnt = 0 (same day)");
}

static void TestSpiritDailyReset()
{
    Fixture fx(true);
    Database& db = fx.db;
    GameStore store(db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "rst_spirit", gu, err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"spiritreset", 1);
    CHECK(uid > 0, "unit created");
    // 模擬 spirit 被用掉＋兩天前
    CHECK(ExecF(db, "UPDATE gspirit SET Spirit = 3, Flag = 1, RegDate = datetime('now', '-2 days') WHERE UnitUID = " + std::to_string(uid) + ";"), "backdate gspirit");
    SelectUnitNot1 not1{};
    CHECK(SelectOk(store, 777, uid, &not1), "select ok after backdate");
    CHECK(not1.unitInfo.spirit == 100, "spirit reset to StartSpirit");
    int64_t flag = -1;
    CHECK(ScalarI(db, "SELECT Flag FROM gspirit WHERE UnitUID = ?;", uid, flag) && flag == 0, "flag reset to 0");
    // 同一天再選：不應再重置（RegDate 已是 now）
    CHECK(ExecF(db, "UPDATE gspirit SET Spirit = 42 WHERE UnitUID = " + std::to_string(uid) + ";"), "lower spirit again");
    CHECK(SelectOk(store, 777, uid, &not1), "second select ok");
    CHECK(not1.unitInfo.spirit == 42, "no second reset same day");
}

static void TestSpiritDailyResetNoSeed()
{
    Fixture fx(false);
    Database& db = fx.db;
    GameStore store(db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "rst_noseed", gu, err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"noseedspirit", 1);
    CHECK(uid > 0, "unit created (no seed: spirit=0)");
    CHECK(ExecF(db, "UPDATE gspirit SET Spirit = 5, Flag = 1, RegDate = datetime('now', '-2 days') WHERE UnitUID = " + std::to_string(uid) + ";"), "backdate gspirit");
    SelectUnitNot1 not1{};
    CHECK(SelectOk(store, 777, uid, &not1), "select ok");
    CHECK(not1.unitInfo.spirit == 0, "reset to IFNULL(NULL→0) without seed");
}

static void TestStoneDailyRefill()
{
    Fixture fx(true);
    Database& db = fx.db;
    GameStore store(db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "rst_stone", gu, err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"stonerefill", 1);
    CHECK(uid > 0, "unit created");
    // 兩天沒上線 → 補充 StartCnt=10
    CHECK(ExecF(db, "UPDATE gunit SET LastDate = datetime('now', '-2 days') WHERE UnitUID = " + std::to_string(uid) + ";"), "backdate lastDate");
    CHECK(SelectOk(store, 777, uid, nullptr), "select ok");
    ResurrectionStoneValues rs;
    CHECK(store.GetResurrectionStone(uid, rs, err), "stone row created");
    CHECK(rs.quantity == 10, "stone = StartCnt(10)");
    // 低於 SupplyCnt → 補滿
    CHECK(ExecF(db, "UPDATE gresurrectionstone SET Quantity = 5 WHERE UnitUID = " + std::to_string(uid) + ";"), "lower stone");
    CHECK(ExecF(db, "UPDATE gunit SET LastDate = datetime('now', '-2 days') WHERE UnitUID = " + std::to_string(uid) + ";"), "backdate lastDate again");
    CHECK(SelectOk(store, 777, uid, nullptr), "second select ok");
    CHECK(store.GetResurrectionStone(uid, rs, err) && rs.quantity == 20, "stone refilled to SupplyCnt(20)");
    // 高於 SupplyCnt → 不動
    CHECK(ExecF(db, "UPDATE gresurrectionstone SET Quantity = 25 WHERE UnitUID = " + std::to_string(uid) + ";"), "raise stone");
    CHECK(ExecF(db, "UPDATE gunit SET LastDate = datetime('now', '-2 days') WHERE UnitUID = " + std::to_string(uid) + ";"), "backdate lastDate third");
    CHECK(SelectOk(store, 777, uid, nullptr), "third select ok");
    CHECK(store.GetResurrectionStone(uid, rs, err) && rs.quantity == 25, "stone above SupplyCnt untouched");
}

static void TestStoneDailyRefillNoSeed()
{
    Fixture fx(false);
    Database& db = fx.db;
    GameStore store(db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "rst_nostonc", gu, err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"nostonot", 1);
    CHECK(uid > 0, "unit created");
    CHECK(ExecF(db, "UPDATE gunit SET LastDate = datetime('now', '-2 days') WHERE UnitUID = " + std::to_string(uid) + ";"), "backdate lastDate");
    CHECK(SelectOk(store, 777, uid, nullptr), "select ok");
    ResurrectionStoneValues rs;
    CHECK(store.GetResurrectionStone(uid, rs, err), "stone row created (quantity=0 without seed)");
    CHECK(rs.quantity == 0, "stone = 0 (no seed)");
}

static void TestPlayDayCntAndLoginCount()
{
    Fixture fx(true);
    Database& db = fx.db;
    GameStore store(db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "rst_playday", gu, err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"playdaycnt", 1);
    CHECK(uid > 0, "unit created");
    // 跨日上線 → PlayDayCnt+1
    CHECK(ExecF(db, "UPDATE gunit SET LastDate = datetime('now', '-1 days') WHERE UnitUID = " + std::to_string(uid) + ";"), "backdate lastDate 1 day");
    CHECK(SelectOk(store, 777, uid, nullptr), "select ok");
    int64_t pd = -1, lc = -1;
    CHECK(ScalarI(db, "SELECT PlayDayCnt FROM gunit WHERE UnitUID = ?;", uid, pd) && pd == 1, "playDayCnt = 1 after cross-day select");
    CHECK(ScalarI(db, "SELECT LoginCount FROM gunit WHERE UnitUID = ?;", uid, lc) && lc == 1, "loginCount = 1");
    // 同日再選 → PlayDayCnt 不變、LoginCount+1
    CHECK(SelectOk(store, 777, uid, nullptr), "same-day select ok");
    CHECK(ScalarI(db, "SELECT PlayDayCnt FROM gunit WHERE UnitUID = ?;", uid, pd) && pd == 1, "playDayCnt stays 1 same day");
    CHECK(ScalarI(db, "SELECT LoginCount FROM gunit WHERE UnitUID = ?;", uid, lc) && lc == 2, "loginCount = 2");
}

static void TestSelectResetEdgeCases()
{
    Fixture fx(true);
    Database& db = fx.db;
    GameStore store(db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "rst_edge", gu, err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"edgecases", 1);
    CHECK(uid > 0, "unit created");

    // 不存在 unitUID → false + err
    CHECK(!store.ApplyUnitLoginReset(0x7FFFFFFF00000001LL, err), "missing unit -> false");
    CHECK(!err.empty(), "missing unit -> err message");

    // GSpirit 缺列也不應炸（spirit 部分略過、stone 補充仍執行）
    CHECK(ExecF(db, "DELETE FROM gspirit WHERE UnitUID = " + std::to_string(uid) + ";"), "delete gspirit row");
    CHECK(ExecF(db, "UPDATE gunit SET LastDate = datetime('now', '-2 days') WHERE UnitUID = " + std::to_string(uid) + ";"), "backdate lastDate");
    CHECK(store.ApplyUnitLoginReset(uid, err), "reset ok without gspirit row");
    ResurrectionStoneValues rs;
    CHECK(store.GetResurrectionStone(uid, rs, err) && rs.quantity == 10, "stone refilled even without gspirit row");

    // GetSpiritValues 缺列 → {0,0}、非錯誤
    SpiritValues sv;
    CHECK(store.GetSpiritValues(uid, sv, err), "GetSpiritValues missing row returns true");
    CHECK(sv.spirit == 0 && sv.flag == 0, "GetSpiritValues missing row -> {0,0}");

    // 歸屬錯誤：別人選 → 不計數
    CHECK(ExecF(db, "INSERT INTO gspirit (UnitUID, Spirit, Flag) VALUES (" + std::to_string(uid) + ", 7, 1);"), "reinsert gspirit");
    SelectUnitReq req; req.unitUID = uid;
    SelectUnitAck ack;
    int rc = HandleSelectUnitReq(store, /*userUID=*/888, req, ack, err);
    CHECK(rc == ERR_SELECT_UNIT_07, "foreign select rejected");
    // 歸屬錯誤不應觸動 GSpirit
    int64_t sp64 = -1, flag64 = -1, lc64 = -1;
    CHECK(ScalarI(db, "SELECT Spirit FROM gspirit WHERE UnitUID = ?;", uid, sp64) && sp64 == 7, "spirit not reset by foreign select");
    CHECK(ScalarI(db, "SELECT Flag FROM gspirit WHERE UnitUID = ?;", uid, flag64) && flag64 == 1, "flag not reset by foreign select");
    CHECK(ScalarI(db, "SELECT LoginCount FROM gunit WHERE UnitUID = ?;", uid, lc64) && lc64 == 1, "loginCount not bumped by foreign select");
}

void RunSelectUnitDailyResetTestsByRef(int& pass, int& fail)
{
    TestCreateAckSpirit(true);
    TestCreateAckSpirit(false);
    TestFreshSelectKeepsSpirit();
    TestSpiritDailyReset();
    TestSpiritDailyResetNoSeed();
    TestStoneDailyRefill();
    TestStoneDailyRefillNoSeed();
    TestPlayDayCntAndLoginCount();
    TestSelectResetEdgeCases();
    TestDenyOptionReadback();
    pass += g_pass_rst;
    fail += g_fail_rst;
}
