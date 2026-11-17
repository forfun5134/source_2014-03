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
    CHECK(v == kGameSchemaVersion && kGameSchemaVersion == 11, "schema v11 (user_version == 11)");
    CHECK(fx.db.Exec("SELECT 1 FROM gitem LIMIT 0;", fx.err), "gitem exists");
    CHECK(fx.db.Exec("SELECT 1 FROM giteminventorysize LIMIT 0;", fx.err), "giteminventorysize exists");
    CHECK(fx.db.Exec("SELECT 1 FROM gitemquantity LIMIT 0;", fx.err), "gitemquantity exists");
    CHECK(fx.db.Exec("SELECT 1 FROM gitemendurance LIMIT 0;", fx.err), "gitemendurance exists");
    CHECK(fx.db.Exec("SELECT 1 FROM gitemenchant LIMIT 0;", fx.err), "gitemenchant exists");
    CHECK(fx.db.Exec("SELECT 1 FROM gitemperiod LIMIT 0;", fx.err), "gitemperiod exists");
    CHECK(fx.db.Exec("SELECT 1 FROM gitemsocket LIMIT 0;", fx.err), "gitemsocket exists");
    CHECK(fx.db.Exec("SELECT 1 FROM gitemattribute LIMIT 0;", fx.err), "gitemattribute exists");
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
              items[1].enchantLevel == 0 && items[1].socket[0] == 0, "satellite defaults (no rows)");
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

static void TestSatellites();
static void TestAttributes();

void RunInventoryReadbackTestsByRef(int& pass, int& fail)
{
    TestSchemaV8();
    TestSlotSize();
    TestItems();
    TestSelectIntegration();
    TestSatellites();
    TestAttributes();
    pass += g_pass_inv;
    fail += g_fail_inv;
}

// ── §0a16：衛星表接線（schema v10）─────────────────────────────────────────
static void TestSatellites()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(777, L"inv.sat");
    CHECK(uid > 0, "unit created");
    CHECK(fx.db.Exec(
        "INSERT INTO gitem (UnitUID, ItemID, InventoryCategory, SlotID) VALUES "
        "(" + std::to_string(uid) + ", 30001, 1, 0),"
        "(" + std::to_string(uid) + ", 30002, 1, 1),"
        "(" + std::to_string(uid) + ", 30003, 1, 2);", fx.err), "seed items");
    int i1 = 0, i2 = 0, i3 = 0;
    {
        std::vector<InventoryItemRecord> items;
        CHECK(fx.store.GetInventoryItems(uid, items, fx.err), "items readable");
        CHECK(items.size() == 3, "three items");
        for (const auto& it : items) {
            if (it.itemID == 30001) i1 = static_cast<int>(it.itemUID);
            else if (it.itemID == 30002) i2 = static_cast<int>(it.itemUID);
            else i3 = static_cast<int>(it.itemUID);
        }
    }
    const std::string id1 = std::to_string(i1), id2 = std::to_string(i2), id3 = std::to_string(i3);
    // 30001：數量型（UsageType=2）＋ 期間型 ＋ Enchant ＋ Socket
    CHECK(fx.db.Exec("INSERT INTO gitemquantity (ItemUID, Quantity) VALUES (" + id1 + ", 99);", fx.err), "seed qty");
    CHECK(fx.db.Exec("INSERT INTO gitemperiod (ItemUID, Period, ExpirationDate) VALUES (" + id1 + ", 30, '2030-12-31 23:59:59');", fx.err), "seed period");
    CHECK(fx.db.Exec("INSERT INTO gitemenchant (ItemUID, ELevel) VALUES (" + id1 + ", 7);", fx.err), "seed enchant");
    CHECK(fx.db.Exec("INSERT INTO gitemsocket (ItemUID, Socket1, Socket2, Socket3, Socket4) VALUES (" + id1 + ", 11, 22, 33, 44);", fx.err), "seed socket");
    // 30002：耐久型（UsageType=1，覆寫量型）：兩表同列 → UsageType=1（原 proc 同序）
    CHECK(fx.db.Exec("INSERT INTO gitemquantity (ItemUID, Quantity) VALUES (" + id2 + ", 50);", fx.err), "seed qty2");
    CHECK(fx.db.Exec("INSERT INTO gitemendurance (ItemUID, Endurance) VALUES (" + id2 + ", 87);", fx.err), "seed endurance2");
    // 30003：Enchant ELevel NULL → 0
    CHECK(fx.db.Exec("INSERT INTO gitemenchant (ItemUID, ELevel) VALUES (" + id3 + ", NULL);", fx.err), "seed enchant null");
    {
        std::vector<InventoryItemRecord> items;
        CHECK(fx.store.GetInventoryItems(uid, items, fx.err), "items readable (satellites)");
        CHECK(items.size() == 3, "three items");
        InventoryItemRecord r1{}, r2{}, r3{};
        for (const auto& it : items) {
            if (it.itemUID == i1) r1 = it;
            else if (it.itemUID == i2) r2 = it;
            else r3 = it;
        }
        CHECK(r1.usageType == 2 && r1.quantity == 99, "qty row -> UsageType=2, Quantity=99");
        CHECK(r1.period == 30 && r1.expirationDate == "2030-12-31 23:59:59", "period row mapped");
        CHECK(r1.enchantLevel == 7, "enchant mapped");
        CHECK(r1.socket[0] == 11 && r1.socket[3] == 44, "sockets mapped");
        CHECK(r1.endurance == -1, "no endurance row -> -1");
        CHECK(r2.usageType == 1 && r2.endurance == 87 && r2.quantity == 50, "endurance row overrides UsageType to 1");
        CHECK(r3.enchantLevel == 0, "NULL ELevel -> 0");
        CHECK(r3.usageType == 0 && r3.quantity == 0 && r3.period == 0 && r3.expirationDate.empty(), "no rows -> proc defaults");
    }
    // Not1 端到端：quantity/sockets/period 透過 BuildSelectUnitNot1 進 UnitInfo.items
    {
        SelectUnitNot1 not1{};
        CHECK(SelectNot1(fx.store, 777, uid, &not1), "select ok");
        const unit::InventoryItemInfo* eq = nullptr;
        for (const auto& kv : not1.items) {
            if (kv.second.itemInfo.itemID == 30001) eq = &kv.second;
        }
        CHECK(eq != nullptr, "item 30001 present in Not1.mapItem");
        if (eq) {
            CHECK(eq->itemInfo.quantity == 99 && eq->itemInfo.usageType == 2, "Not1 quantity/usageType wired");
            CHECK(eq->itemInfo.period == 30 && eq->itemInfo.expirationDate == std::wstring(L"2030-12-31 23:59:59"),
                  "Not1 period + expirationDate wired");
            CHECK(eq->itemInfo.enchantLevel == 7 && eq->itemInfo.itemSocket.size() == 4 &&
                  eq->itemInfo.itemSocket[0] == 11 && eq->itemInfo.itemSocket[3] == 44, "Not1 enchant/socket wired");
        }
    }
}

// ── §0a17：GItemAttribute 合併（gup_get_attribute 語義）＋ socket 尾端 0 裁剪 ─────
static void TestAttributes()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(777, L"inv.attr");
    CHECK(uid > 0, "unit created");
    CHECK(fx.db.Exec(
        "INSERT INTO gitem (UnitUID, ItemID, InventoryCategory, SlotID) VALUES "
        "(" + std::to_string(uid) + ", 40001, 9, 0),"   // 裝備 → attribute 生效
        "(" + std::to_string(uid) + ", 40002, 3, 1),"   // 素材 → attribute 不生效（proc 過濾 IN (1,9)）
        "(" + std::to_string(uid) + ", 40003, 1, 2);", fx.err), "seed items");  // 一般裝備 → 生效
    int e1 = 0, m2 = 0, w3 = 0;
    {
        std::vector<InventoryItemRecord> items;
        CHECK(fx.store.GetInventoryItems(uid, items, fx.err), "items readable");
        for (const auto& it : items) {
            if (it.itemID == 40001) e1 = static_cast<int>(it.itemUID);
            else if (it.itemID == 40002) m2 = static_cast<int>(it.itemUID);
            else w3 = static_cast<int>(it.itemUID);
        }
    }
    CHECK(e1 > 0 && m2 > 0 && w3 > 0, "items seeded");
    const std::string a = std::to_string(e1), b = std::to_string(m2), c = std::to_string(w3);
    // 裝備 40001：三個槽都有值；SlotNo=9（ESI_MAX 外）→ 忽略（原 log+drop）
    CHECK(fx.db.Exec("INSERT INTO gitemattribute (ItemUID, SlotNo, Attribute) VALUES (" + a + ", 0, 11),(" + a + ", 1, 22),(" + a + ", 2, 33),(" + a + ", 9, 99);", fx.err), "seed attrib equip");
    // 素材 40002：有值但不該出現在 attribute 合併（proc 只查 1,9）
    CHECK(fx.db.Exec("INSERT INTO gitemattribute (ItemUID, SlotNo, Attribute) VALUES (" + b + ", 0, 44);", fx.err), "seed attrib material");
    // weapon 40003：一槽
    CHECK(fx.db.Exec("INSERT INTO gitemattribute (ItemUID, SlotNo, Attribute) VALUES (" + c + ", 2, 55);", fx.err), "seed attrib weapon");
    {
        std::vector<InventoryItemRecord> items;
        CHECK(fx.store.GetInventoryItems(uid, items, fx.err), "items readable (attrib)");
        InventoryItemRecord r1{}, r2{}, r3{};
        for (const auto& it : items) {
            if (it.itemUID == e1) r1 = it;
            else if (it.itemUID == m2) r2 = it;
            else r3 = it;
        }
        CHECK(r1.attrib[0] == 11 && r1.attrib[1] == 22 && r1.attrib[2] == 33, "equip attrib merged (ESI_SLOT_1..3)");
        CHECK(r2.attrib[0] == 0 && r2.attrib[1] == 0 && r2.attrib[2] == 0, "material attrib excluded (category filter)");
        CHECK(r3.attrib[2] == 55 && r3.attrib[0] == 0, "weapon attrib merged");
    }
    // socket 尾端 0 裁剪：(7,0,5,0) → [7,0,5]；全 0 → []；(1,2,3,4) → 4 個
    CHECK(fx.db.Exec("INSERT INTO gitemsocket (ItemUID, Socket1, Socket2, Socket3, Socket4) VALUES (" + a + ", 7, 0, 5, 0);", fx.err), "seed socket trim case");
    CHECK(fx.db.Exec("INSERT INTO gitemsocket (ItemUID, Socket1, Socket2, Socket3, Socket4) VALUES (" + c + ", 1, 2, 3, 4);", fx.err), "seed socket full");
    {
        SelectUnitNot1 not1{};
        CHECK(SelectNot1(fx.store, 777, uid, &not1), "select ok");
        unit::InventoryItemInfo* i1 = nullptr, *i3 = nullptr;
        for (auto& kv : not1.items) {
            if (kv.second.itemInfo.itemID == 40001) i1 = &kv.second;
            else if (kv.second.itemInfo.itemID == 40003) i3 = &kv.second;
        }
        CHECK(i1 && i3, "items present");
        if (i1) {
            CHECK(i1->itemInfo.itemSocket.size() == 3 && i1->itemInfo.itemSocket[0] == 7 &&
                  i1->itemInfo.itemSocket[1] == 0 && i1->itemInfo.itemSocket[2] == 5,
                  "trailing zero trimmed, embedded zero kept");
            CHECK(i1->itemInfo.attrib.cAttribEnchant0 == 11 && i1->itemInfo.attrib.cAttribEnchant1 == 22 &&
                  i1->itemInfo.attrib.cAttribEnchant2 == 33,
                  "Not1 attrib wired");
        }
        if (i3) {
            CHECK(i3->itemInfo.itemSocket.size() == 4 && i3->itemInfo.itemSocket[3] == 4, "full sockets kept");
        }
    }
    // GetItemAttributes 直接檢視：裝備兩件共 4 列（ESI_SLOT 外也在——原 proc 不過濾 SlotNo）
    {
        std::vector<std::tuple<int64_t, int32_t, int32_t>> attrs;
        CHECK(fx.store.GetItemAttributes(uid, attrs, fx.err), "attribute raw readable");
        CHECK(attrs.size() == 5, "raw rows include out-of-range SlotNo (proc semantics)");
    }
}
