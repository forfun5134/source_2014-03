// tests/test_inventory_readback.cpp — SELECT_UNIT_1_NOT 背包/裝備/復活石讀回（§0a14）
// 對照原 DBE_SELECT_UNIT_REQ → Query_SelectUnit／Query_GetInventory／SendSelectUnitACK（GSUserFunction.cpp:17970–17977）：
//   kNot_1.m_mapInventorySlotSize ← gup_get_inventory_size（GItemInventorySize）：原 proc 為 GROUP BY NumSlot, InventoryCategory（疑似 bug，
//        V2 以 category GROUP BY SUM(NumSlot) 實作，見 docs §0a14 偏差聲明）→ map<int,int>
//   kNot_1.m_mapItem ← （SERV_BATTLE_FIELD_BOSS 路徑 P_GItem_ItemList_SEL 不在倉庫；可移植部分＝）SELECT ItemUID, ItemID, InventoryCategory, SlotID
//        FROM GItem WHERE UnitUID AND Deleted=0 ORDER BY InventoryCategory, SlotID → map<UidType,KInventoryItemInfo>
//        無 GItemQuantity/GItemEndurance/GItemEnchant/GItemPeriod/GItemSocket 表 → quantity=0/endurance=-1/enchant=0/period=0/sockets=0／usageType=0
//   UnitInfo.m_mapEquippedItem ← SlotCategory == ST_E_EQUIP(9) 的物品，keyed by SlotID（SERV_EXPAND_SLOT_ID_DATA_SIZE）
//   kNot_1.m_iNumResurrectionStone ← gup_get_resurrection_stone → gresurrectionstone.Quantity（§0a8）
// ⚠ 偏差聲明見 docs §0a14。
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

static int g_pass_inv = 0, g_fail_inv = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_inv++; } \
    else { g_fail_inv++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

struct Fixture
{
    Database db;
    GameStore store;
    std::string err;
    Fixture() : store(db) { if (!db.Open(":memory:", err)) return; ApplyGameMigrations(db, err); }
    int64_t MakeUnit(int64_t userUID, const wchar_t* nick)
    {
        char buf[32];
        std::snprintf(buf, sizeof buf, "inv_%lld", (long long)userUID);
        GUserRecord gu;
        if (!store.GetOrCreateGUser(userUID, buf, gu, err)) return -1;
        CreateUnitReq req; req.iClass = 1; req.wstrNickName = nick;
        CreateUnitAck ack;
        if (!HandleCreateUnitReq(store, userUID, 5, req, ack, err)) return -1;
        return ack.iOK == NET_OK ? ack.kUnitInfo.unitUID : -1;
    }
};

static bool SelectNot1(GameStore& store, int64_t userUID, int64_t unitUID, SelectUnitNot1* out1)
{
    SelectUnitReq req; req.unitUID = unitUID;
    SelectUnitAck ack;
    std::string err;
    int rc = HandleSelectUnitReq(store, userUID, req, ack, err, /*secondSecurityOk=*/true,
                                 /*outUnit=*/nullptr, out1, /*authLevel=*/5,
                                 /*outNot2=*/nullptr, /*outNot3=*/nullptr,
                                 /*outNot4=*/nullptr, /*outNot5=*/nullptr);
    return rc == NET_OK && ack.iOK == NET_OK;
}

static void TestSchemaV8()
{
    Fixture fx;
    int v = fx.db.UserVersion(fx.err);
    CHECK(v == kGameSchemaVersion && kGameSchemaVersion == 9, "schema v9 (user_version == 9)");
    CHECK(fx.db.Exec("SELECT 1 FROM gitem LIMIT 0;", fx.err), "gitem exists");
    CHECK(fx.db.Exec("SELECT 1 FROM giteminventorysize LIMIT 0;", fx.err), "giteminventorysize exists");
    const int64_t uid = fx.MakeUnit(777, L"inv.schema");
    CHECK(uid > 0, "unit created");
    CHECK(fx.db.Exec("INSERT INTO gitem (UnitUID, ItemID, InventoryCategory, SlotID) VALUES (" + std::to_string(uid) + ", 1001, 1, 0);", fx.err), "seed item");
    CHECK(fx.db.Exec("INSERT INTO giteminventorysize (UnitUID, InventoryCategory, NumSlot) VALUES (" + std::to_string(uid) + ", 1, 30);", fx.err), "seed slot size");
}

static void TestSlotSize()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(777, L"inv.slots");
    CHECK(uid > 0, "unit created");
    {
        std::map<int32_t, int32_t> sz;
        CHECK(fx.store.GetInventorySlotSize(uid, sz, fx.err), "slot size readable (empty)");
        CHECK(sz.empty(), "no slots initially");
    }
    // 同 category 多列 → SUM；不同 category → 各自
    CHECK(fx.db.Exec(
        "INSERT INTO giteminventorysize (UnitUID, InventoryCategory, NumSlot) VALUES "
        "(" + std::to_string(uid) + ", 1, 24),"
        "(" + std::to_string(uid) + ", 1, 6),"
        "(" + std::to_string(uid) + ", 2, 15),"
        "(" + std::to_string(uid) + ", 13, 9);", fx.err), "seed slot sizes");
    {
        std::map<int32_t, int32_t> sz;
        CHECK(fx.store.GetInventorySlotSize(uid, sz, fx.err), "slot size readable");
        CHECK(sz.size() == 3 && sz[1] == 30 && sz[2] == 15 && sz[13] == 9, "per-category SUM(NumSlot)");
    }
    // 不存在 unitUID → 空 map、非錯誤
    {
        std::map<int32_t, int32_t> sz;
        CHECK(fx.store.GetInventorySlotSize(0x7FFFFFFF00000007LL, sz, fx.err), "nonexistent unit -> true");
        CHECK(sz.empty(), "nonexistent unit -> empty map");
    }
}

static void TestItems()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(777, L"inv.items");
    CHECK(uid > 0, "unit created");
    // 兩個物品：category 9（裝備）slot 2 / category 3（素材）slot 0
    CHECK(fx.db.Exec(
        "INSERT INTO gitem (UnitUID, ItemID, InventoryCategory, SlotID) VALUES "
        "(" + std::to_string(uid) + ", 24001, 3, 0),"
        "(" + std::to_string(uid) + ", 11001, 9, 2);", fx.err), "seed items");
    {
        std::vector<InventoryItemRecord> items;
        CHECK(fx.store.GetInventoryItems(uid, items, fx.err), "items readable");
        CHECK(items.size() == 2, "two items");
        CHECK(items[0].slotCategory == 3 && items[1].slotCategory == 9, "ordered by category");
        CHECK(items[1].itemID == 11001 && items[1].slotID == 2, "equip item mapped");
        CHECK(items[1].quantity == 0 && items[1].endurance == -1 && items[1].period == 0 &&
              items[1].enchantLevel == 0 && items[1].socket[0] == 0, "satellite defaults (no tables)");
    }
    // 軟刪除 → 讀不到
    CHECK(fx.db.Exec("UPDATE gitem SET DelDate = '2999-01-01 00:00:00' WHERE UnitUID = " + std::to_string(uid) + " AND ItemID = 11001;", fx.err), "soft-delete equip item");
    {
        std::vector<InventoryItemRecord> items;
        CHECK(fx.store.GetInventoryItems(uid, items, fx.err), "items readable after delete");
        CHECK(items.size() == 1 && items[0].itemID == 24001, "Deleted=1 excluded");
    }
    // 缺表 → false + err
    {
        std::string err2;
        CHECK(fx.db.Exec("ALTER TABLE gitem RENAME TO gitem_bak;", err2), "rename gitem");
        std::vector<InventoryItemRecord> items;
        CHECK(!fx.store.GetInventoryItems(uid, items, err2), "missing table -> false");
        CHECK(fx.db.Exec("ALTER TABLE gitem_bak RENAME TO gitem;", err2), "restore gitem");
    }
}

static void TestSelectIntegration()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(777, L"inv.select");
    CHECK(uid > 0, "unit created");
    CHECK(fx.db.Exec("INSERT INTO giteminventorysize (UnitUID, InventoryCategory, NumSlot) VALUES (" + std::to_string(uid) + ", 9, 12);", fx.err), "seed slots");
    CHECK(fx.db.Exec("INSERT INTO gitem (UnitUID, ItemID, InventoryCategory, SlotID) VALUES (" + std::to_string(uid) + ", 11001, 9, 4),(" + std::to_string(uid) + ", 24001, 3, 1);", fx.err), "seed items");
    // 復活石：確保有列 → numResurrectionStone == 3
    CHECK(fx.db.Exec("INSERT INTO gresurrectionstone (UnitUID, Quantity) VALUES (" + std::to_string(uid) + ", 3) ON CONFLICT(UnitUID) DO UPDATE SET Quantity = 3;", fx.err), "seed resurrection stone");
    {
        SelectUnitNot1 not1{};
        CHECK(SelectNot1(fx.store, 777, uid, &not1), "select ok");
        CHECK(not1.inventorySlotSize.size() == 1 && not1.inventorySlotSize[9] == 12, "slot size wired");
        CHECK(not1.items.size() == 2, "items wired");
        auto eq = not1.unitInfo.equippedItem.find(4);
        CHECK(eq != not1.unitInfo.equippedItem.end() && eq->second.itemInfo.itemID == 11001,
              "equip item mirrored into UnitInfo.equippedItem (key=slotID)");
        CHECK(eq->second.itemInfo.quantity == 0 && eq->second.itemInfo.endurance == -1,
              "equipped item satellite defaults");
        CHECK(not1.numResurrectionStone == 3, "resurrection stone wired");
        // mapSkillNote/vecSkillUnsealed：空佔位（技能 proc 缺）
        CHECK(not1.vecSkillUnsealed.empty() && not1.mapSkillNote.empty(), "skill placeholders remain");
    }
    // 缺表（giteminventorysize）→ ERR_SELECT_UNIT_05
    {
        std::string err2;
        CHECK(fx.db.Exec("ALTER TABLE giteminventorysize RENAME TO giteminventorysize_bak;", err2), "rename slotsize");
        SelectUnitReq req; req.unitUID = uid;
        SelectUnitAck ack2;
        SelectUnitNot1 not1{};
        std::string err3;
        int rc = HandleSelectUnitReq(fx.store, 777, req, ack2, err3, true,
                                     nullptr, &not1, 5, nullptr, nullptr, nullptr, nullptr);
        CHECK(rc == ERR_SELECT_UNIT_05, "missing slot-size table -> ERR_SELECT_UNIT_05");
        CHECK(fx.db.Exec("ALTER TABLE giteminventorysize_bak RENAME TO giteminventorysize;", err2), "restore slotsize");
    }
    // 歸屬錯誤 → 不建 Not1
    {
        SelectUnitReq req; req.unitUID = uid;
        SelectUnitAck ack2;
        SelectUnitNot1 not1{};
        std::string err2;
        int rc = HandleSelectUnitReq(fx.store, /*userUID=*/888, req, ack2, err2, true,
                                     nullptr, &not1, 5, nullptr, nullptr, nullptr, nullptr);
        CHECK(rc == ERR_SELECT_UNIT_07, "foreign select rejected");
    }
}

void RunInventoryReadbackTestsByRef(int& pass, int& fail)
{
    TestSchemaV8();
    TestSlotSize();
    TestItems();
    TestSelectIntegration();
    pass += g_pass_inv;
    fail += g_fail_inv;
}
