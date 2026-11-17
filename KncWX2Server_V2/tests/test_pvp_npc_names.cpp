// tests/test_pvp_npc_names.cpp — PvP NPC 保留暱稱閘門切片測試（§0a4）
// 涵蓋：x2::pvp_npc_names::IsExistPvpNpcName 謂詞（依建置期地區 fixture）、
//   決策層：HandleCreateUnitReq / HandleChangeNicknameReq（含 bCheckOnly 與 GM authLevel——本閘門無 GM 繞過）命中 → ERR_CREATE_UNIT_01(26)。
// ⚠ fixture 名取自各地區 ServerResource/<REGION>/PvpNpcData.lua；wire 無關（決策層測試）。
#include <cstdio>
#include <string>

#include "../src/core/Region.h"   // 未定義 X2_REGION_* 時由此設定預設 JP 巨集（與 StringFilter 測試同作法）
#include "../src/core/NetError.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/PvpNpcNames.h"
#include "../src/server/UnitSelectArbiter.h"
#include "../src/server/CreateUnitProtocol.h"
#include "../src/server/ChangeNicknameProtocol.h"

using namespace x2;
using namespace x2::db;
using namespace x2::pvp_npc_names;
using namespace x2::select_unit;
using namespace x2::create_unit;
using namespace x2::change_nickname;

void RunPvpNpcNamesTestsByRef(int& pass, int& fail);
static int g_pass_pvp = 0, g_fail_pvp = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_pvp++; } \
    else { g_fail_pvp++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

// ---- 地區 fixture ----
#if defined(X2_REGION_JP)
static const wchar_t* kRegionNpcName = L"エルザ";      // ServerResource/JP/PvpNpcData.lua（含 2 條重複）
static const wchar_t* kRegionMixedAscii = L"BenDaBoss"; // 用於大小寫敏感斷言
#define HAVE_REGION_FIXTURE 1
#elif defined(X2_REGION_TW) || defined(X2_REGION_HK)
static const wchar_t* kRegionNpcName = L"Ancel";        // ServerResource/TW/PvpNpcData.lua（TWHK 共用；確認不命中 StringFilter）
static const wchar_t* kRegionMixedAscii = L"Ancel";
#define HAVE_REGION_FIXTURE 1
#elif defined(X2_REGION_EU)
static const wchar_t* kRegionNpcName = L"권오당";        // ServerResource/EU/PvpNpcData.lua
static const wchar_t* kRegionMixedAscii = nullptr;
#define HAVE_REGION_FIXTURE 1
#elif defined(X2_REGION_CN)
static const wchar_t* kRegionNpcName = L"沙稀";          // ServerResource/CN/PvpNpcData.lua
static const wchar_t* kRegionMixedAscii = nullptr;
#define HAVE_REGION_FIXTURE 1
#elif defined(X2_REGION_US)
static const wchar_t* kRegionNpcName = L"XGokuX";        // ServerResource/US/PvpNpcData.lua
static const wchar_t* kRegionMixedAscii = L"XGokuX";
#define HAVE_REGION_FIXTURE 1
#else
// TH/ID/BR/PH：空表
#define HAVE_REGION_FIXTURE 0
#endif

static void TestPredicate()
{
#if HAVE_REGION_FIXTURE
    CHECK(IsExistPvpNpcName(kRegionNpcName), "region fixture name is reserved");
#else
    // 無資料地區：永不命中
    CHECK(!IsExistPvpNpcName(L"anything"), "empty region list never matches");
#endif
    CHECK(!IsExistPvpNpcName(L""), "empty nickname does not match");
    CHECK(!IsExistPvpNpcName(L"NoSuchNpcNameQZ123"), "absent name does not match");
#if HAVE_REGION_FIXTURE && defined(X2_REGION_JP)
    CHECK(!IsExistPvpNpcName(L"bendaboss"), "exact match is case-sensitive (lower)");
    CHECK(IsExistPvpNpcName(kRegionMixedAscii), "exact match keeps case (original)");
#elif HAVE_REGION_FIXTURE && defined(X2_REGION_US)
    CHECK(!IsExistPvpNpcName(L"xgokux"), "exact match is case-sensitive (lower)");
#endif
}

static void TestCreateUnitGate()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open in-memory game db");
    CHECK(ApplyGameMigrations(db, err), "apply game migrations");
    GameStore store(db);
    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(4242, "pvpuser", gu, err), "seed guser 4242");
#if HAVE_REGION_FIXTURE
    // 命中 NPC 名 → ERR_CREATE_UNIT_01(26)
    {
        CreateUnitReq req; req.iClass = 1; req.wstrNickName = kRegionNpcName;
        CreateUnitAck ack;
        CHECK(HandleCreateUnitReq(store, 4242, 0, req, ack, err), "npc-name create handled");
        CHECK(ack.iOK == ERR_CREATE_UNIT_01, "npc-name create -> 26");
    }
    // GM（authLevel=9）亦擋——本閘門無 GM 繞過
    {
        CreateUnitReq req; req.iClass = 1; req.wstrNickName = kRegionNpcName;
        CreateUnitAck ack;
        CHECK(HandleCreateUnitReq(store, 4242, 9, req, ack, err), "npc-name create (GM) handled");
        CHECK(ack.iOK == ERR_CREATE_UNIT_01, "npc-name create (GM) -> 26");
    }
    // 正常名 → NET_OK（閘門不誤擋）
    {
        CreateUnitReq req; req.iClass = 1; req.wstrNickName = L"zzzuniq42ab";
        CreateUnitAck ack;
        CHECK(HandleCreateUnitReq(store, 4242, 0, req, ack, err), "normal-name create handled");
        CHECK(ack.iOK == NET_OK, "normal-name create -> NET_OK");
    }
#endif
}

static void TestChangeNicknameGate()
{
#if !HAVE_REGION_FIXTURE
    return;
#else
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open in-memory game db (change)");
    CHECK(ApplyGameMigrations(db, err), "apply game migrations (change)");
    GameStore store(db);
    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(555, "pvpchanger", gu, err), "seed guser 555");
    int64_t unitUID = 0;
    { std::string e; auto r = store.CreateUnit(555, "現有名PvpA1", 1, unitUID, e); CHECK(r == CreateUnitResult::Ok, "seed unit"); }

    // 改名為 NPC 名 → ERR_CREATE_UNIT_01(26)
    {
        ChangeNickNameReq req; req.iUnitUID = unitUID; req.wstrNickName = kRegionNpcName; req.bCheckOnly = false;
        ChangeNickNameAck ack;
        CHECK(HandleChangeNicknameReq(store, 555, req, ack, err, 0), "npc-name change handled");
        CHECK(ack.iOK == ERR_CREATE_UNIT_01, "npc-name change -> 26");
    }
    // bCheckOnly=true 亦擋
    {
        ChangeNickNameReq req; req.iUnitUID = unitUID; req.wstrNickName = kRegionNpcName; req.bCheckOnly = true;
        ChangeNickNameAck ack;
        CHECK(HandleChangeNicknameReq(store, 555, req, ack, err, 0), "npc-name check-only handled");
        CHECK(ack.iOK == ERR_CREATE_UNIT_01, "npc-name check-only -> 26");
    }
    // GM（authLevel=9）亦擋
    {
        ChangeNickNameReq req; req.iUnitUID = unitUID; req.wstrNickName = kRegionNpcName; req.bCheckOnly = false;
        ChangeNickNameAck ack;
        CHECK(HandleChangeNicknameReq(store, 555, req, ack, err, 9), "npc-name change (GM) handled");
        CHECK(ack.iOK == ERR_CREATE_UNIT_01, "npc-name change (GM) -> 26");
    }
#endif
}

void RunPvpNpcNamesTestsByRef(int& pass, int& fail)
{
    const int pass0 = g_pass_pvp, fail0 = g_fail_pvp;
    TestPredicate();
    TestCreateUnitGate();
    TestChangeNicknameGate();
    pass += g_pass_pvp - pass0;
    fail += g_fail_pvp - fail0;
}
