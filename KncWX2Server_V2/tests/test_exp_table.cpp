// tests/test_exp_table.cpp — ExpTable（EXP 表，源自本倉庫 ScriptData/ExpTable.xls）測試
// 涵蓋：表完整性（80 級、level1=(0,0)、累計一致、單調遞增）、GetRequire* 分支（含表頂溢出）、CheckLevelUp 邊界、
//       PopulateUnitInfoFromGUnit 以 EXP 重算 level（UPDATE gunit.Exp 後再讀）。
#include <cstdio>
#include <string>

#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/ExpTable.h"
#include "../src/server/UnitSelectArbiter.h"
#include "../src/server/UnitData.h"

using namespace x2;
using namespace x2::db;
using namespace x2::exp_table;
using namespace x2::select_unit;

void RunExpTableTestsByRef(int& pass, int& fail);
static int g_pass_et = 0, g_fail_et = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_et++; } \
    else { g_fail_et++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static void TestExpTableValues()
{
    // level 1
    CHECK(GetRequireNeedExpbyLevel(1) == 0, "need exp level 1 == 0");
    CHECK(GetRequireTotalExpbyLevel(1) == 0, "total exp level 1 == 0");
    // level 2..80 已知抽樣
    CHECK(GetRequireNeedExpbyLevel(2) == 600, "need level 2");
    CHECK(GetRequireTotalExpbyLevel(2) == 600, "total level 2");
    CHECK(GetRequireNeedExpbyLevel(3) == 1300, "need level 3");
    CHECK(GetRequireTotalExpbyLevel(3) == 1900, "total level 3");
    CHECK(GetRequireTotalExpbyLevel(5) == 6700, "total level 5");
    CHECK(GetRequireTotalExpbyLevel(80) == 866438000, "total level 80 (table max)");
    // 表頂溢出（原碼 rbegin 規則）
    CHECK(GetRequireNeedExpbyLevel(81) == GetRequireNeedExpbyLevel(80), "need over-max -> max need");
    CHECK(GetRequireNeedExpbyLevel(0) == 0, "need level 0 -> 0");
    CHECK(GetRequireTotalExpbyLevel(81) == 866438000, "total over-max -> max total");
    CHECK(GetRequireTotalExpbyLevel(-5) == 0, "total negative -> 0");
    // 累計一致性（掃全表：need[i] + total[i-1] == total[i]）
    {
        int32_t prev = 0;
        bool ok = true;
        for (int lvl = 2; lvl <= 80; ++lvl) {
            const int32_t need = GetRequireNeedExpbyLevel(lvl);
            const int32_t total = GetRequireTotalExpbyLevel(lvl);
            if (static_cast<int64_t>(prev) + need != total) { ok = false; break; }
            prev = total;
        }
        CHECK(ok, "cumulative need sum == total for levels 2..80");
    }
    // 單調遞增
    {
        bool ok = true;
        for (int lvl = 2; lvl <= 80; ++lvl)
            if (!(GetRequireTotalExpbyLevel(lvl) > GetRequireTotalExpbyLevel(lvl - 1))) { ok = false; break; }
        CHECK(ok, "total exp strictly increasing");
    }
}

static void TestCheckLevelUp()
{
    CHECK(CheckLevelUp(1, 0) == 1, "exp 0 -> level 1");
    CHECK(CheckLevelUp(1, 599) == 1, "exp 599 -> level 1");
    CHECK(CheckLevelUp(1, 600) == 2, "exp 600 -> level 2");
    CHECK(CheckLevelUp(1, 1899) == 2, "exp 1899 -> level 2");
    CHECK(CheckLevelUp(1, 1900) == 3, "exp 1900 -> level 3");
    CHECK(CheckLevelUp(1, 6700) == 5, "exp 6700 -> level 5");
    CHECK(CheckLevelUp(1, 866438000) == 80, "exp max total -> level 80");
    CHECK(CheckLevelUp(1, 999999999) == 80, "exp over max -> level 80");
    CHECK(CheckLevelUp(1, -10) == 1, "negative exp clamps to level 1");
    CHECK(CheckLevelUp(0, 600) == 2, "level < 1 clamps to 1 start");
    CHECK(CheckLevelUp(80, 0) == 80, "start at max level with 0 exp -> 80");
}

static void TestPopulateUsesExpTable()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open in-memory game db");
    CHECK(ApplyGameMigrations(db, err), "apply game migrations");
    GameStore store(db);
    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(777, "exptester", gu, err), "seed guser");
    int64_t uid = 0;
    CHECK(store.CreateUnit(777, "經驗角色", 1, uid, err) == CreateUnitResult::Ok, "create unit");
    {   // 直接把 Exp 改成 6700（level 5）再讀
        Statement st;
        CHECK(st.Prepare(db, "UPDATE gunit SET Exp = 6700 WHERE UnitUID = ?;", err), "prepare exp update");
        CHECK(st.BindInt(1, uid, err), "bind uid");
        std::string stepErr;
        CHECK(!st.StepRow(stepErr) && stepErr.empty(), "UPDATE exp ok");
    }
    GUnitRecord rec;
    bool found = false;
    CHECK(store.GetUnitByUID(uid, rec, found, err) && found, "re-read unit");
    CHECK(rec.exp == 6700, "exp persisted");
    unit::UnitInfo info;
    PopulateUnitInfoFromGUnit(777, 5, rec, info);
    CHECK(info.level == 5, "level recomputed from exp (CheckLevelUp)");
    CHECK(info.exp == 6700, "exp echoed");
    CHECK(info.nowBaseLevelEXP == 6700, "nowBaseLevelEXP == total(5)");
    CHECK(info.nextBaseLevelEXP == 10500, "nextBaseLevelEXP == total(6)");
}

void RunExpTableTestsByRef(int& pass, int& fail)
{
    TestExpTableValues();
    TestCheckLevelUp();
    TestPopulateUsesExpTable();
    pass += g_pass_et;
    fail += g_fail_et;
}
