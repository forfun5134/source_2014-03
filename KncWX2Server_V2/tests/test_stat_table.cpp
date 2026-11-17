// tests/test_stat_table.cpp — StatTable（等級→基礎屬性，源自本倉庫 ServerResource/JP/StatTable.lua）測試
// 涵蓋：已知值（含 Lua→UINT 截斷）、未知 class/level → false、容量外 level 81..99 丟棄語意、
//       PopulateUnitInfoFromGUnit 以 gunit.Exp 換算 level 後疊加 stat（:memory: 雙庫→遊戲庫）。
#include <cstdio>
#include <string>

#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/StatTable.h"
#include "../src/server/ExpTable.h"
#include "../src/server/UnitSelectArbiter.h"
#include "../src/server/UnitData.h"

using namespace x2;
using namespace x2::db;
using namespace x2::stat_table;
using namespace x2::exp_table;
using namespace x2::select_unit;

void RunStatTableTestsByRef(int& pass, int& fail);
static int g_pass_st = 0, g_fail_st = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_st++; } \
    else { g_fail_st++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static void TestStatTableValues()
{
    UnitStatInfo s{};
    CHECK(GetUnitStat(1, 1, s), "class 1 level 1 found");
    CHECK(s.atkPhysic == 360 && s.atkMagic == 296 && s.defPhysic == 80 && s.defMagic == 66 && s.hp == 11250,
          "class 1 level 1 values");
    CHECK(GetUnitStat(1, 80, s), "class 1 level 80 found");
    CHECK(s.atkPhysic == 1159 && s.defMagic == 214 && s.hp == 144562,   // 144562.5 → 截斷
          "class 1 level 80 values (+HP x.5 truncation)");
    CHECK(GetUnitStat(118, 1, s), "class 118 level 1 found");
    CHECK(s.defMagic == 77, "DefMagic 77.6 truncated to 77");
    CHECK(GetUnitStat(121, 62, s), "class 121 level 62 found");
    CHECK(s.atkPhysic == 977 && s.hp == 114187, "class 121 level 62 values (+HP x.5 truncation)");
    CHECK(GetUnitStat(110, 80, s), "class 110 level 80 found");
    CHECK(s.atkPhysic == 1134 && s.defMagic == 226 && s.hp == 128500, "class 110 level 80 (no-space lua rows)");
}

static void TestStatTableMiss()
{
    UnitStatInfo s{};
    CHECK(!GetUnitStat(110, 81, s), "level 81 beyond capacity -> false（原碼 JIF 丟棄語意）");
    CHECK(!GetUnitStat(111, 99, s), "level 99 beyond capacity -> false");
    CHECK(!GetUnitStat(1, 0, s), "level 0 -> false");
    CHECK(!GetUnitStat(1, 81, s), "level 81 (any class) -> false");
    CHECK(!GetUnitStat(999, 1, s), "unknown class -> false");
    CHECK(!GetUnitStat(0, 1, s), "class 0 -> false");
    CHECK(!GetUnitStat(-1, 1, s), "negative class -> false");
    CHECK(s.atkPhysic == 0 && s.atkMagic == 0 && s.defPhysic == 0 && s.defMagic == 0 && s.hp == 0,
          "miss leaves out zeroed");
    // 全保留 class（52 個）1..80 皆可查到
    const int kReservedClasses[] = {1,2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,
                                    100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121};
    bool allFound = true;
    for (int cls : kReservedClasses)
        for (int lv = 1; lv <= 80; ++lv)
            if (!GetUnitStat(cls, lv, s)) { allFound = false; break; }
    CHECK(allFound, "all 52 classes x levels 1..80 resolvable");
}

static void TestPopulateAddsStatTable()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open in-memory game db");
    CHECK(ApplyGameMigrations(db, err), "apply game migrations");
    GameStore store(db);
    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(888, "stattester", gu, err), "seed guser");
    int64_t uid = 0;
    CHECK(store.CreateUnit(888, "屬性角色", 1, uid, err) == CreateUnitResult::Ok, "create class-1 unit");
    {   // Exp = 1900 → CheckLevelUp(1, 1900) = 3
        Statement st;
        CHECK(st.Prepare(db, "UPDATE gunit SET Exp = 1900 WHERE UnitUID = ?;", err), "prepare exp update");
        CHECK(st.BindInt(1, uid, err), "bind uid");
        std::string stepErr;
        CHECK(!st.StepRow(stepErr) && stepErr.empty(), "UPDATE exp ok");
    }
    GUnitRecord rec;
    bool found = false;
    CHECK(store.GetUnitByUID(uid, rec, found, err) && found, "re-read unit");
    CHECK(rec.baseHP == 0 && rec.atkPhysic == 0, "gunit stat columns seed as 0");
    unit::UnitInfo info;
    PopulateUnitInfoFromGUnit(888, 1, rec, info);
    UnitStatInfo expected{};
    CHECK(GetUnitStat(1, 3, expected), "table lookup class 1 level 3");
    CHECK(info.level == 3, "level recomputed from exp");
    CHECK(info.stat.baseHP == static_cast<int32_t>(expected.hp), "baseHP == gunit(0) + table HP");
    CHECK(info.stat.atkPhysic == expected.atkPhysic && info.stat.atkMagic == expected.atkMagic,
          "atk == table (gunit zero)");
    CHECK(info.stat.defPhysic == expected.defPhysic && info.stat.defMagic == expected.defMagic,
          "def == table (gunit zero)");
    CHECK(info.gameStat.baseHP == info.stat.baseHP && info.gameStat.atkPhysic == info.stat.atkPhysic,
          "gameStat mirrors stat");
}

void RunStatTableTestsByRef(int& pass, int& fail)
{
    TestStatTableValues();
    TestStatTableMiss();
    TestPopulateAddsStatTable();
    pass += g_pass_st;
    fail += g_fail_st;
}
