// tests/test_game_store.cpp — game DB（guser/gunit/暱稱歷史）測試（in-memory SQLite）
// RunGameStoreTestsByRef 由 tests/test_all.cpp 的 main() 呼叫
#include <cstdio>
#include <string>
#include <vector>

#include "../src/db/GameStore.h"
#include "../src/db/Sqlite.h"

using namespace x2;
using namespace x2::db;

void RunGameStoreTestsByRef(int& pass, int& fail);
static int g_pass_game = 0, g_fail_game = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_game++; } \
    else { g_fail_game++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static bool OpenMemGameDb(Database& db, std::string& err)
{
    if (!db.Open(":memory:", err)) return false;
    return ApplyGameMigrations(db, err);
}

static void TestGameMigrationsIdempotent()
{
    Database db;
    std::string err;
    CHECK(OpenMemGameDb(db, err), "game migrate ok");
    CHECK(db.UserVersion(err) == kGameSchemaVersion, "game user_version set");
    CHECK(ApplyGameMigrations(db, err), "game migrate idempotent");
    CHECK(db.UserVersion(err) == kGameSchemaVersion, "game user_version stable");
}

static void TestGetOrCreateGUser()
{
    Database db;
    std::string err;
    CHECK(OpenMemGameDb(db, err), "open");
    GameStore store(db);

    GUserRecord rec;
    CHECK(store.GetOrCreateGUser(1001, "warrior77", rec, err), "get-or-create creates");
    CHECK(rec.userUID == 1001, "userUID echoed");
    CHECK(rec.userID == "warrior77", "userID stored");
    CHECK(rec.usSize == 50, "default USSize 50 (gup_get_user_info)");
    CHECK(!rec.deleted, "new guser not deleted");
    CHECK(!rec.regDate.empty() && rec.regDate == rec.delDate, "RegDate == DelDate on create");

    // 第二次呼叫：不是建立，而是讀回既有列
    GUserRecord rec2;
    CHECK(store.GetOrCreateGUser(1001, "warrior77", rec2, err), "get-or-create existing ok");
    CHECK(rec2.regDate == rec.regDate, "existing row not overwritten");

    // userID 過長拒絕
    GUserRecord rec3;
    CHECK(!store.GetOrCreateGUser(1002, std::string(51, 'x'), rec3, err), "userID > 50 rejected");

    bool found = false;
    GUserRecord rec4;
    CHECK(store.GetGUser(9999, rec4, found, err), "get missing ok");
    CHECK(!found, "missing guser -> found=false");
}

static void TestCreateUnitHappyPath()
{
    Database db;
    std::string err;
    CHECK(OpenMemGameDb(db, err), "open");
    GameStore store(db);

    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(2001, "mage01", gu, err), "seed guser");

    int64_t unitUID = 0;
    CHECK(store.CreateUnit(2001, "冰霜之箭", 3, unitUID, err) == CreateUnitResult::Ok, "create unit ok");
    CHECK(unitUID >= 1, "unitUID assigned");

    bool found = false;
    GUnitRecord u;
    CHECK(store.GetUnitByUID(unitUID, u, found, err), "get unit ok");
    CHECK(found, "unit found");
    CHECK(u.userUID == 2001, "unit bound to guser");
    CHECK(u.unitClass == 3, "unitClass stored");
    CHECK(u.level == 1 && u.exp == 0, "level 1 / exp 0 (gup_create_unit)");
    CHECK(u.sPoint == 1, "SPoint=1 (gup_create_unit)");
    CHECK(u.lastPosition == 20000, "LastPosition=20000 (gup_create_unit)");
    CHECK(u.gamePoint == 0 && u.vsPoint == 0 && u.vsPointMax == 0, "points zeroed");
    CHECK(u.loginCount == 0 && u.playDayCnt == 0, "counters zeroed");
    CHECK(!u.deleted, "unit not deleted");
    CHECK(u.nickname == "冰霜之箭", "nickname joined from gunit_nickname");

    // 列表
    std::vector<GUnitRecord> list;
    CHECK(store.ListUnitsByUserUID(2001, list, err), "list ok");
    CHECK(list.size() == 1, "one unit listed");
    CHECK(list[0].nickname == "冰霜之箭", "listed unit has nickname");
}

static void TestCreateUnitRejections()
{
    Database db;
    std::string err;
    CHECK(OpenMemGameDb(db, err), "open");
    GameStore store(db);

    // 1) guser 不存在 → UserNotFoundOrDeleted（原 -1）
    int64_t unitUID = 0;
    CHECK(store.CreateUnit(3001, "ghostinst", 1, unitUID, err) == CreateUnitResult::UserNotFoundOrDeleted,
          "missing guser -> UserNotFoundOrDeleted");

    // 2) 暱稱超長（參數驗證，非業務碼）
    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(3002, "lancer", gu, err), "seed guser 3002");
    CHECK(store.CreateUnit(3002, std::string(17, 'n'), 1, unitUID, err) == CreateUnitResult::DbError,
          "oversized nickname rejected (param validation)");
    CHECK(!err.empty(), "param error sets err");

    // 3) 暱稱重複 → NicknameTaken（原 -2）
    CHECK(store.CreateUnit(3002, "重複俠", 1, unitUID, err) == CreateUnitResult::Ok, "first unit ok");
    GUserRecord gu3;
    CHECK(store.GetOrCreateGUser(3003, "lancer2", gu3, err), "seed guser 3003");
    CHECK(store.CreateUnit(3003, "重複俠", 2, unitUID, err) == CreateUnitResult::NicknameTaken,
          "duplicate nickname -> NicknameTaken");

    // 4) 容量上限：把 USSize 壓成 1，建立 1 個後再建應被拒（原 -3）
    {
        Statement st;
        std::string e;
        CHECK(st.Prepare(db, "UPDATE guser SET USSize = 1 WHERE UserUID = 3002;", e), "prep usSize");
        std::string se;
        CHECK(!st.StepRow(se) && se.empty(), "usSize set to 1");
    }
    CHECK(store.CreateUnit(3002, "二號角色", 4, unitUID, err) == CreateUnitResult::CapacityReached,
          "capacity reached -> CapacityReached");
}

static void TestCreateUnitNicknameCooldown()
{
    Database db;
    std::string err;
    CHECK(OpenMemGameDb(db, err), "open");
    GameStore store(db);

    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(4001, "cooldownuser", gu, err), "seed guser");

    int64_t unitUID = 0;
    CHECK(store.CreateUnit(4001, "冷卻測試", 1, unitUID, err) == CreateUnitResult::Ok, "create ok");
    CHECK(store.SoftDeleteUnit(unitUID, err), "soft delete ok");

    // 刪除後暱稱進入 14 天冷卻 → 重建必須被拒（原 -222）
    GUserRecord gu2;
    CHECK(store.GetOrCreateGUser(4002, "cooldownuser2", gu2, err), "seed other user");
    CHECK(store.CreateUnit(4002, "冷卻測試", 1, unitUID, err) == CreateUnitResult::NicknameInCooldown,
          "recent deleted nickname -> NicknameInCooldown");
}

static void TestSoftDeleteFlow()
{
    Database db;
    std::string err;
    CHECK(OpenMemGameDb(db, err), "open");
    GameStore store(db);

    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(5001, "deleter", gu, err), "seed guser");
    int64_t unitUID = 0;
    CHECK(store.CreateUnit(5001, "刪我", 1, unitUID, err) == CreateUnitResult::Ok, "create ok");

    // 軟刪除
    CHECK(store.SoftDeleteUnit(unitUID, err), "soft delete ok");

    // 已刪除角色不出現在列表
    std::vector<GUnitRecord> list;
    CHECK(store.ListUnitsByUserUID(5001, list, err), "list ok");
    CHECK(list.empty(), "deleted unit hidden from list");

    bool found = false;
    GUnitRecord u;
    CHECK(store.GetUnitByUID(unitUID, u, found, err), "get ok");
    CHECK(found, "deleted unit still retrievable by UID");
    CHECK(u.deleted, "deleted flag set");

    // 冪等：再刪一次也成功
    CHECK(store.SoftDeleteUnit(unitUID, err), "soft delete idempotent");

    // 暱稱進入冷卻歷史
    {
        Statement st;
        std::string e;
        CHECK(st.Prepare(db, "SELECT COUNT(*) FROM gdeleted_nickname_history WHERE NickName = '刪我';", e), "prep hist");
        std::string se;
        CHECK(st.StepRow(se) && st.ColumnInt64(0) == 1, "nickname history recorded");
    }
}

static void TestRecordUnitLogin()
{
    Database db;
    std::string err;
    CHECK(OpenMemGameDb(db, err), "open");
    GameStore store(db);

    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(6001, "loginner", gu, err), "seed guser");
    int64_t unitUID = 0;
    CHECK(store.CreateUnit(6001, "登入測試", 2, unitUID, err) == CreateUnitResult::Ok, "create ok");

    CHECK(store.RecordUnitLogin(unitUID, err), "record login ok");
    CHECK(store.RecordUnitLogin(unitUID, err), "record login twice ok");

    bool found = false;
    GUnitRecord u;
    CHECK(store.GetUnitByUID(unitUID, u, found, err), "get ok");
    CHECK(found, "unit found");
    CHECK(u.loginCount == 2, "loginCount incremented twice");

    // 軟刪除後 RecordUnitLogin 不應再計數（UPDATE ... AND Deleted = 0）
    CHECK(store.SoftDeleteUnit(unitUID, err), "soft delete ok");
    CHECK(store.RecordUnitLogin(unitUID, err), "record login on deleted unit returns ok");
    CHECK(store.GetUnitByUID(unitUID, u, found, err), "get after delete ok");
    CHECK(found && u.loginCount == 2, "deleted unit loginCount unchanged");
}

void RunGameStoreTestsByRef(int& pass, int& fail)
{
    TestGameMigrationsIdempotent();
    TestGetOrCreateGUser();
    TestCreateUnitHappyPath();
    TestCreateUnitRejections();
    TestCreateUnitNicknameCooldown();
    TestSoftDeleteFlow();
    TestRecordUnitLogin();
    pass += g_pass_game;
    fail += g_fail_game;
}
