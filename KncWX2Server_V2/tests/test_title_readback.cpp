// tests/test_title_readback.cpp — SELECT_UNIT_3_NOT 稱號/稱號任務讀回（§0a12；gup_get_title_list／gup_get_title_mission_list）
// 對照原 DBE_SELECT_UNIT_REQ → Query_SelectUnit 的稱號段（GSGameDBThread.cpp:1829–1997）：
//   vecTitle  ← gup_get_title_list（SERV_ALL_RENEWAL_SP 未定義 → 本建置實際路徑）：SELECT TitleID, EndDate, IsHang FROM GTitle_Complete
//               → KTitleInfo{ m_iTitleID, m_wstrEndDate（EndDate 原樣）, m_kCTime=0／m_bInfinity=false（legacy fetch 不填） }
//               第一個 IsHang=1 列 → kUnitInfo.m_iTitleID（Not1 UnitInfo.titleID）
//   vecMission ← gup_get_title_mission_list：SELECT TitleID, SubMission1..5 FROM GTitle_Mission
//               → KMissionInstance{ m_iID=TitleID, 5×KSubMissionInstance{ m_iID=0, m_sClearData=SubMissionN, m_bIsSuccess=false } }
//               跳過 TitleID 已在 vecTitle 者（SERV_TITLE_DUPLICATE_PROCESS_REVISION 已定義）
// ⚠ 偏差聲明見 docs §0a12：bResetTitle 多筆 IsHang=1 修復寫路徑未移植（SELECT 唯讀）；EndDate CTime 不解析；
//   GTitle_Mission SubMission NULL→0；清單路徑（MY_UNIT_LIST/CHARACTER_LIST）titleID 仍為 0 佔位；pet 表未移植。
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

static int g_pass_tr = 0, g_fail_tr = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_tr++; } \
    else { g_fail_tr++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

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

static bool SelectNots(GameStore& store, int64_t userUID, int64_t unitUID,
                       SelectUnitNot1* out1, SelectUnitNot3* out3)
{
    SelectUnitReq req; req.unitUID = unitUID;
    SelectUnitAck ack;
    std::string err;
    int rc = HandleSelectUnitReq(store, userUID, req, ack, err, /*secondSecurityOk=*/true,
                                 /*outUnit=*/nullptr, out1, /*authLevel=*/5,
                                 /*outNot2=*/nullptr, out3,
                                 /*outNot4=*/nullptr, /*outNot5=*/nullptr);
    return rc == NET_OK && ack.iOK == NET_OK;
}

static void TestSchemaV6()
{
    Fixture fx;
    int v = fx.db.UserVersion(fx.err);
    CHECK(v == kGameSchemaVersion && kGameSchemaVersion == 7, "schema v7 (user_version == 7; gtitle_* created at v6)");
    CHECK(fx.db.Exec("SELECT 1 FROM gtitle_complete LIMIT 0;", fx.err), "gtitle_complete table exists");
    CHECK(fx.db.Exec("SELECT 1 FROM gtitle_mission LIMIT 0;", fx.err), "gtitle_mission table exists");
    GameStore store(fx.db);
    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(777, "tr_schema", gu, fx.err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"tr.schema", 1);
    CHECK(uid > 0, "unit created");
    CHECK(fx.db.Exec("INSERT INTO gtitle_complete (UnitUID, TitleID) VALUES (" + std::to_string(uid) + ", 9001);", fx.err), "seed title complete");
    std::string err2;
    CHECK(!fx.db.Exec("INSERT INTO gtitle_complete (UnitUID, TitleID) VALUES (" + std::to_string(uid) + ", 9001);", err2), "title complete PK rejects duplicate");
    CHECK(fx.db.Exec("INSERT INTO gtitle_mission (UnitUID, TitleID, SubMission1) VALUES (" + std::to_string(uid) + ", 9001, 11);", fx.err), "seed title mission");
    CHECK(!fx.db.Exec("INSERT INTO gtitle_mission (UnitUID, TitleID) VALUES (" + std::to_string(uid) + ", 9001);", err2), "title mission PK rejects duplicate");
}

static void TestGetTitleCompleteList()
{
    Fixture fx;
    GameStore store(fx.db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "tr_list", gu, err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"tr.list", 1);
    CHECK(uid > 0, "unit created");
    {
        std::vector<TitleCompleteRecord> titles;
        CHECK(store.GetTitleCompleteList(uid, titles, err), "empty title list ok");
        CHECK(titles.empty(), "empty title list");
        std::vector<TitleMissionRecord> missions;
        CHECK(store.GetTitleMissionList(uid, missions, err), "empty mission list ok");
        CHECK(missions.empty(), "empty mission list");
    }
    // 永久稱號（EndDate NULL）＋有期限稱號（UTC 字串）＋掛載稱號，依 TitleID 排序輸出
    CHECK(fx.db.Exec(
        "INSERT INTO gtitle_complete (UnitUID, TitleID, EndDate, IsHang) VALUES "
        "(" + std::to_string(uid) + ", 200, NULL, 0),"
        "(" + std::to_string(uid) + ", 100, '2000-06-02 00:00:00', 1),"
        "(" + std::to_string(uid) + ", 300, '2001-02-03 04:05:06', 0);", err), "seed titles");
    {
        std::vector<TitleCompleteRecord> titles;
        CHECK(store.GetTitleCompleteList(uid, titles, err), "title list readable");
        CHECK(titles.size() == 3 && titles[0].titleID == 100 && titles[1].titleID == 200 && titles[2].titleID == 300,
              "ordered by TitleID ASC");
        CHECK(titles[0].isHang && !titles[0].endDateNull && titles[0].endDate == "2000-06-02 00:00:00", "equipped title w/ EndDate");
        CHECK(!titles[1].isHang && titles[1].endDateNull && titles[1].endDate.empty(), "permanent title (EndDate NULL)");
    }
    // 不存在 unitUID → 空列表、非錯誤（原 proc 不檢查）
    {
        std::vector<TitleCompleteRecord> titles;
        CHECK(store.GetTitleCompleteList(0x7FFFFFFF00000006LL, titles, err), "nonexistent unit -> true");
        CHECK(titles.empty(), "nonexistent unit -> empty list");
    }
    // 缺表 → false + err
    {
        std::string err2;
        CHECK(fx.db.Exec("DROP TABLE gtitle_complete;", err2), "drop gtitle_complete");
        std::vector<TitleCompleteRecord> titles;
        CHECK(!store.GetTitleCompleteList(uid, titles, err2), "missing table -> false");
        CHECK(!err2.empty(), "err recorded");
    }
}

static void TestGetTitleMissionList()
{
    Fixture fx;
    GameStore store(fx.db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "tr_mission", gu, err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"tr.mission", 1);
    CHECK(uid > 0, "unit created");
    CHECK(fx.db.Exec(
        "INSERT INTO gtitle_mission (UnitUID, TitleID, SubMission1, SubMission2, SubMission3, SubMission4, SubMission5) VALUES "
        "(" + std::to_string(uid) + ", 100, 3, 7, 0, 0, 13),"
        "(" + std::to_string(uid) + ", 50, 9, 0, 0, 0, 0);", err), "seed missions");
    {
        std::vector<TitleMissionRecord> missions;
        CHECK(store.GetTitleMissionList(uid, missions, err), "mission list readable");
        CHECK(missions.size() == 2 && missions[0].titleID == 50 && missions[1].titleID == 100,
              "ordered by TitleID ASC");
        CHECK(missions[1].sub[0] == 3 && missions[1].sub[1] == 7 && missions[1].sub[2] == 0 &&
              missions[1].sub[3] == 0 && missions[1].sub[4] == 13, "SubMission1..5 mapped");
    }
}

static void TestSelectIntegration()
{
    Fixture fx;
    GameStore store(fx.db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "tr_select", gu, err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"tr.select", 1);
    CHECK(uid > 0, "unit created");

    // 無稱號：Not1.titleID=0、Not3 空容器
    {
        SelectUnitNot1 not1{};
        SelectUnitNot3 not3{};
        CHECK(SelectNots(store, 777, uid, &not1, &not3), "select ok (no titles)");
        CHECK(not1.unitInfo.titleID == 0, "Not1 titleID=0 without equipped title");
        CHECK(not3.vecTitle.empty() && not3.vecMission.empty(), "Not3 empty without title rows");
    }
    // 兩張已獲得稱號（100 掛載、200 未掛載）＋一張 mission 100（dup→過濾）＋一張 mission 300
    CHECK(fx.db.Exec(
        "INSERT INTO gtitle_complete (UnitUID, TitleID, EndDate, IsHang) VALUES "
        "(" + std::to_string(uid) + ", 100, '2000-06-02 00:00:00', 1),"
        "(" + std::to_string(uid) + ", 200, NULL, 0);", err), "seed titles");
    CHECK(fx.db.Exec(
        "INSERT INTO gtitle_mission (UnitUID, TitleID, SubMission1, SubMission5) VALUES "
        "(" + std::to_string(uid) + ", 100, 6, 6),"
        "(" + std::to_string(uid) + ", 300, 1, 9);", err), "seed missions");
    {
        SelectUnitNot1 not1{};
        SelectUnitNot3 not3{};
        CHECK(SelectNots(store, 777, uid, &not1, &not3), "select ok (with titles)");
        CHECK(not1.unitInfo.titleID == 100, "Not1 titleID ← first IsHang=1 row");
        CHECK(not3.vecTitle.size() == 2, "Not3 vecTitle size");
        CHECK(not3.vecTitle[0].iTitleID == 100 && not3.vecTitle[0].wstrEndDate == std::wstring(L"2000-06-02 00:00:00") &&
              not3.vecTitle[0].kCTime == 0 && not3.vecTitle[0].bInfinity == false, "Not3 title 100 mapped");
        CHECK(not3.vecTitle[1].iTitleID == 200 && not3.vecTitle[1].wstrEndDate.empty(), "Not3 title 200 permanent");
        CHECK(not3.vecMission.size() == 1 && not3.vecMission[0].iID == 300 &&
              not3.vecMission[0].subMissionInstances.size() == 5 &&
              not3.vecMission[0].subMissionInstances[0].sClearData == 1 &&
              not3.vecMission[0].subMissionInstances[4].sClearData == 9,
              "Not3 vecMission: dup-of-title 100 filtered by SERV_TITLE_DUPLICATE_PROCESS_REVISION");
        CHECK(not3.iSummonedPetUID == 0 && not3.vecPetList.empty(), "pet still placeholder (§0a12)");
    }
    // 多筆 IsHang=1（損壞資料）→ 第一筆生效（DB 不改寫：V2 SELECT 唯讀）
    CHECK(fx.db.Exec(
        "INSERT INTO gtitle_complete (UnitUID, TitleID, EndDate, IsHang) VALUES "
        "(" + std::to_string(uid) + ", 400, NULL, 1);", err), "seed second equipped title");
    {
        SelectUnitNot1 not1{};
        CHECK(SelectNots(store, 777, uid, &not1, nullptr), "select ok (corrupt double-hang)");
        CHECK(not1.unitInfo.titleID == 100, "first IsHang=1 wins; no DB rewrite");
    }
    // 缺表 → ERR_SELECT_UNIT_05
    {
        std::string err2;
        CHECK(fx.db.Exec("ALTER TABLE gtitle_complete RENAME TO gtitle_complete_bak;", err2), "rename table");
        SelectUnitNot3 not3{};
        SelectUnitReq req; req.unitUID = uid;
        SelectUnitAck ack2;
        std::string err3;
        int rc = HandleSelectUnitReq(store, 777, req, ack2, err3, true,
                                     nullptr, nullptr, 5, nullptr, &not3, nullptr, nullptr);
        CHECK(rc == ERR_SELECT_UNIT_05, "missing title table -> ERR_SELECT_UNIT_05");
        CHECK(fx.db.Exec("ALTER TABLE gtitle_complete_bak RENAME TO gtitle_complete;", err2), "restore table");
    }
    // 歸屬錯誤 → 不建 Not3
    {
        SelectUnitReq req; req.unitUID = uid;
        SelectUnitAck ack2;
        SelectUnitNot3 not3{};
        std::string err2;
        int rc = HandleSelectUnitReq(store, /*userUID=*/888, req, ack2, err2, true,
                                     nullptr, nullptr, 5, nullptr, &not3, nullptr, nullptr);
        CHECK(rc == ERR_SELECT_UNIT_07, "foreign select rejected");
    }
}

void RunTitleReadbackTestsByRef(int& pass, int& fail)
{
    TestSchemaV6();
    TestGetTitleCompleteList();
    TestGetTitleMissionList();
    TestSelectIntegration();
    pass += g_pass_tr;
    fail += g_fail_tr;
}
