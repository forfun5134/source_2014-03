// tests/test_select_not45_readback.cpp — SELECT_UNIT_4_NOT 推薦欄／SELECT_UNIT_5_NOT 精神Flag 讀回（§0a15）
// 對照原 DBE_SELECT_UNIT_REQ → Query_SelectUnit：
//   kAck.m_iRecommendUnitUID ← gup_get_unit_info_by_unituid：`SELECT @iOldUID = OldUID FROM GRecommend WHERE NewUID = @iUnitUID_`（缺列 → 0）
//     → SendSelectUnitACK：kNot_4.m_iRecommendUnitUID；Not4.m_bIsRecommend ← 帳號級 KUserRecommendManager::IsRecommend()（帳號 DB 源）
//   kAck.m_bIsSpiritUpdated ← 同一 proc：`@iAllSpirit = Flag`（GSpirit）→ kNot_5.m_bIsSpiritUpdated
//   Not5 其餘（mapCharGameCount←gup_get_Character_Count、kPShopAgencyInfo←P_GPShopInfo_SEL_ShopCheck、
//     packetHenirRewardCount←gup_get_henir_reward_cnt、bCashShopOpen/bFirstSelect/bLocalRankingUser）：
//     proc/表不在倉庫或屬帳號級 → 全 false/0/空（誠實佔位）
// ⚠ 偏差聲明見 docs §0a15。
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

static int g_pass_n45 = 0, g_fail_n45 = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_n45++; } \
    else { g_fail_n45++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
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
        std::snprintf(buf, sizeof buf, "n45_%lld", (long long)userUID);
        GUserRecord gu;
        if (!store.GetOrCreateGUser(userUID, buf, gu, err)) return -1;
        CreateUnitReq req; req.iClass = 1; req.wstrNickName = nick;
        CreateUnitAck ack;
        if (!HandleCreateUnitReq(store, userUID, 5, req, ack, err)) return -1;
        return ack.iOK == NET_OK ? ack.kUnitInfo.unitUID : -1;
    }
};

static void TestSchemaV9()
{
    Fixture fx;
    int v = fx.db.UserVersion(fx.err);
    CHECK(v == kGameSchemaVersion && kGameSchemaVersion == 11, "schema v11 (user_version == 11)");
    CHECK(fx.db.Exec("SELECT 1 FROM grecommend LIMIT 0;", fx.err), "grecommend exists");
}

static void TestRecommend()
{
    Fixture fx;
    const int64_t me = fx.MakeUnit(777, L"n45.me");
    const int64_t referrer = fx.MakeUnit(888, L"n45.referrer");
    CHECK(me > 0 && referrer > 0, "units created");
    {
        int64_t oldUID = -1;
        bool found = true;
        CHECK(fx.store.GetRecommendOldUID(me, oldUID, found, fx.err), "recommend readable (empty)");
        CHECK(!found && oldUID == 0, "no recommend row -> found=false, out=0");
    }
    CHECK(fx.db.Exec("INSERT INTO grecommend (OldUID, NewUID, RegDate) VALUES (" + std::to_string(referrer) + ", " + std::to_string(me) + ", '2000-01-01 00:00:00');", fx.err), "seed recommend");
    {
        int64_t oldUID = -1;
        bool found = false;
        CHECK(fx.store.GetRecommendOldUID(me, oldUID, found, fx.err), "recommend readable");
        CHECK(found && oldUID == referrer, "OldUID resolved");
    }
    // 多列 → 最早一列（ORDER BY RegDate ASC）——與原標量賦值（未定義順序）偏差聲明見 docs §0a15
    CHECK(fx.db.Exec("INSERT INTO grecommend (OldUID, NewUID, RegDate) VALUES (99999, " + std::to_string(me) + ", '1999-01-01 00:00:00');", fx.err), "seed second recommend row");
    {
        int64_t oldUID = -1;
        bool found = false;
        CHECK(fx.store.GetRecommendOldUID(me, oldUID, found, fx.err), "recommend readable (multi)");
        CHECK(found && oldUID == 99999, "earliest RegDate wins (deterministic)");
    }
    // 不存在 UID → found=false、非錯誤
    {
        int64_t oldUID = -1;
        bool found = true;
        CHECK(fx.store.GetRecommendOldUID(0x7FFFFFFF00000045LL, oldUID, found, fx.err), "nonexistent uid -> true");
        CHECK(!found && oldUID == 0, "nonexistent uid -> found=false");
    }
}

static void TestSpiritUpdated()
{
    Fixture fx;
    const int64_t me = fx.MakeUnit(777, L"n45.spirit");
    CHECK(me > 0, "unit created");
    // 建角後 GSpirit 存在、Flag=0 → bIsSpiritUpdated=false
    {
        SelectUnitReq req; req.unitUID = me;
        SelectUnitAck ack;
        SelectUnitNot5 not5{};
        std::string err2;
        int rc = HandleSelectUnitReq(fx.store, 777, req, ack, err2, true,
                                     nullptr, nullptr, 5, nullptr, nullptr, nullptr, &not5);
        CHECK(rc == NET_OK && ack.iOK == NET_OK, "select ok");
        CHECK(not5.bIsSpiritUpdated == false, "flag=0 -> bIsSpiritUpdated=false");
        CHECK(not5.mapCharGameCount.empty(), "mapCharGameCount empty (proc absent)");
        CHECK(not5.kPShopAgencyInfo.bIsPShopOpen == false && not5.kPShopAgencyInfo.wstrPersonalShopName.empty(), "pshop agency placeholder");
        CHECK(not5.packetHenirRewardCount.iNormal == 0 && not5.packetHenirRewardCount.iPremium == 0 &&
              not5.packetHenirRewardCount.iEvent == 0, "henir reward placeholder");
        CHECK(not5.bCashShopOpen == false && not5.bFirstSelect == false && not5.bLocalRankingUser == false,
              "runtime/account-level bools stay false");
    }
    // Flag=1（模擬「當日精神已更新」）→ true
    CHECK(fx.db.Exec("UPDATE gspirit SET Flag = 1 WHERE UnitUID = " + std::to_string(me) + ";", fx.err), "set spirit flag=1");
    {
        SelectUnitReq req; req.unitUID = me;
        SelectUnitAck ack;
        SelectUnitNot5 not5{};
        std::string err2;
        int rc = HandleSelectUnitReq(fx.store, 777, req, ack, err2, true,
                                     nullptr, nullptr, 5, nullptr, nullptr, nullptr, &not5);
        CHECK(rc == NET_OK && ack.iOK == NET_OK, "select ok (flag=1)");
        CHECK(not5.bIsSpiritUpdated == true, "flag=1 -> bIsSpiritUpdated=true");
    }
    // BuildSelectUnitNot5(nullptr) → false（未讀回路徑）
    {
        SelectUnitNot5 not5{};
        BuildSelectUnitNot5(not5, nullptr);
        CHECK(not5.bIsSpiritUpdated == false, "null spiritValues -> false");
    }
}

static void TestSelectIntegration()
{
    Fixture fx;
    const int64_t me = fx.MakeUnit(777, L"n45.select");
    const int64_t referrer = fx.MakeUnit(888, L"n45.ref2");
    CHECK(me > 0 && referrer > 0, "units created");
    CHECK(fx.db.Exec("INSERT INTO grecommend (OldUID, NewUID, RegDate) VALUES (" + std::to_string(referrer) + ", " + std::to_string(me) + ", '2000-01-01 00:00:00');", fx.err), "seed recommend");
    {
        SelectUnitReq req; req.unitUID = me;
        SelectUnitAck ack;
        SelectUnitNot4 not4{};
        SelectUnitNot5 not5{};
        std::string err2;
        int rc = HandleSelectUnitReq(fx.store, 777, req, ack, err2, true,
                                     nullptr, nullptr, 5, nullptr, nullptr, &not4, &not5);
        CHECK(rc == NET_OK && ack.iOK == NET_OK, "select ok");
        CHECK(not4.iRecommendUnitUID == referrer, "Not4 iRecommendUnitUID wired from GRecommend");
        CHECK(not4.bIsRecommend == false, "Not4 bIsRecommend stays false (account-level source)");
        CHECK(not5.bIsSpiritUpdated == false && not5.mapCharGameCount.empty(), "Not5 spirit flag / game count");
    }
    // 缺表 → ERR_SELECT_UNIT_05（grecommend 改名）
    {
        std::string err2;
        CHECK(fx.db.Exec("ALTER TABLE grecommend RENAME TO grecommend_bak;", err2), "rename grecommend");
        SelectUnitReq req; req.unitUID = me;
        SelectUnitAck ack2;
        SelectUnitNot4 not4{};
        std::string err3;
        int rc = HandleSelectUnitReq(fx.store, 777, req, ack2, err3, true,
                                     nullptr, nullptr, 5, nullptr, nullptr, &not4, nullptr);
        CHECK(rc == ERR_SELECT_UNIT_05, "missing grecommend table -> ERR_SELECT_UNIT_05");
        CHECK(fx.db.Exec("ALTER TABLE grecommend_bak RENAME TO grecommend;", err2), "restore grecommend");
    }
    // Not5 歸屬錯誤 → 不建
    {
        SelectUnitReq req; req.unitUID = me;
        SelectUnitAck ack2;
        SelectUnitNot5 not5{};
        std::string err2;
        int rc = HandleSelectUnitReq(fx.store, /*userUID=*/999, req, ack2, err2, true,
                                     nullptr, nullptr, 5, nullptr, nullptr, nullptr, &not5);
        CHECK(rc == ERR_SELECT_UNIT_07, "foreign select rejected");
    }
}

void RunSelectNot45ReadbackTestsByRef(int& pass, int& fail)
{
    TestSchemaV9();
    TestRecommend();
    TestSpiritUpdated();
    TestSelectIntegration();
    pass += g_pass_n45;
    fail += g_fail_n45;
}
