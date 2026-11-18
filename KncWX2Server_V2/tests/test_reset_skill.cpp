// tests/test_reset_skill.cpp — EGS_RESET_SKILL_REQ/ACK（§0a25）
// 對照原 GSUserGameCommon::IMPL_ON_FUNC(EGS_RESET_SKILL_REQ)（GSUserGameCommon.cpp:4642–4887）
//   ＋ IMPL_ON_FUNC(DBE_RESET_SKILL_ACK)（:4900–5040；原 DBE_RESET_SKILL_REQ 的 GSGameDBThread 路徑）：
//   REQ{ m_iSkillID:int, m_iActiveSkillPageNumber:int }；
//   ACK{ m_iOK, m_iActiveSkillPageNumber, m_iDelSkillID, m_iSPoint, m_iCSPoint,
//        std::vector<KInventoryItemInfo> m_vecInventorySlotInfo }；事件 305/306。
// V2 為單一函數 write-through 單一 transaction（見 ResetSkillProtocol.h 檔頭與 docs §0a25）。
#include <cstdio>
#include <cstring>
#include <functional>
#include <string>
#include <vector>

#include "../src/core/NetError.h"
#include "../src/core/SerBuffer.h"
#include "../src/core/Serializer.h"
#include "../src/core/EventIDs.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/ResetSkillProtocol.h"
#include "../src/server/CreateUnitProtocol.h"
#include "../src/server/UnitSelectArbiter.h"

using namespace x2;
using namespace x2::db;
using namespace x2::reset_skill;
using namespace x2::create_unit;
using namespace x2::select_unit;

static int g_pass_rs = 0, g_fail_rs = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_rs++; } \
    else { g_fail_rs++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
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
    int64_t MakeUnit(int64_t userUID, const wchar_t* nick, int unitClass = 1)
    {
        char buf[32];
        std::snprintf(buf, sizeof buf, "rs_%lld", (long long)userUID);
        GUserRecord gu;
        if (!store.GetOrCreateGUser(userUID, buf, gu, err)) return -1;
        CreateUnitReq req; req.iClass = unitClass; req.wstrNickName = nick;
        CreateUnitAck ack;
        if (!HandleCreateUnitReq(store, userUID, 5, req, ack, err)) return -1;
        return ack.iOK == NET_OK ? ack.kUnitInfo.unitUID : -1;
    }
    bool SeedLearnedSkill(int64_t unitUID, int32_t skillID, int32_t level, int32_t page, int32_t csp)
    {
        const std::string sql = "INSERT INTO gskill (UnitUID, SkillID, SkillLevel, SkillCSPoint, SkillPageNumber) VALUES ("
            + std::to_string(unitUID) + ", " + std::to_string(skillID) + ", " + std::to_string(level) + ", "
            + std::to_string(csp) + ", " + std::to_string(page) + ");";
        return db.Exec(sql, err);
    }
    bool SetLearnedSkill(int64_t unitUID, int32_t skillID, int32_t level, int32_t csp)
    {
        const std::string sql = "UPDATE gskill SET SkillLevel = " + std::to_string(level) +
            ", SkillCSPoint = " + std::to_string(csp) + " WHERE UnitUID = " + std::to_string(unitUID) +
            " AND SkillID = " + std::to_string(skillID) + ";";
        return db.Exec(sql, err);
    }
    // 建立數量型道具，回傳 ItemUID；quantity 寫入 gitemquantity
    int64_t SeedItem(int64_t unitUID, int32_t itemID, int32_t qty, int slotCategory = 4, int slotID = 0)
    {
        const std::string sql = "INSERT INTO gitem (UnitUID, ItemID, InventoryCategory, SlotID) VALUES (" +
            std::to_string(unitUID) + ", " + std::to_string(itemID) + ", " + std::to_string(slotCategory) + ", " +
            std::to_string(slotID) + ");";
        if (!db.Exec(sql, err)) return -1;
        std::string idErr;
        Statement st;
        if (!st.Prepare(db, "SELECT MAX(ItemUID) FROM gitem WHERE UnitUID = ?;", idErr)) return -1;
        if (!st.BindInt(1, unitUID, idErr)) return -1;
        if (!st.StepRow(idErr)) return -1;
        const int64_t itemUID = st.ColumnInt64(0);
        const std::string q = "INSERT INTO gitemquantity (ItemUID, Quantity) VALUES (" + std::to_string(itemUID) + ", " +
            std::to_string(qty) + ");";
        if (!db.Exec(q, err)) return -1;
        return itemUID;
    }
    bool SeedCash(int64_t unitUID, int32_t csPoint, int32_t maxCSPoint)
    {
        const std::string sql = "INSERT INTO gskillcash (UnitUID, CSPoint, MaxCSPoint) VALUES (" +
            std::to_string(unitUID) + ", " + std::to_string(csPoint) + ", " + std::to_string(maxCSPoint) + ");";
        return db.Exec(sql, err);
    }
    bool SetSlotA(int64_t unitUID, int32_t page, int slotIdx, int32_t skillID)  // slotIdx: 0..3
    {
        const char* col = (slotIdx == 0) ? "Slot01" : (slotIdx == 1) ? "Slot02" : (slotIdx == 2) ? "Slot03" : "Slot04";
        const std::string sql = std::string("UPDATE gskillslotnew SET ") + col + " = " + std::to_string(skillID) +
            " WHERE UnitUID = " + std::to_string(unitUID) + " AND SkillPageNumber = " + std::to_string(page) + ";";
        return db.Exec(sql, err);
    }
    bool InjectWriteFailure(const std::string& table)   // 故障注入：BEFORE INSERT/UPDATE/DELETE 皆 ABORT（SELECT 不受影響）
    {
        const std::string sql = "CREATE TRIGGER injected_write_failure_" + table + " BEFORE INSERT ON " + table +
            " BEGIN SELECT RAISE(ABORT, 'injected write failure'); END;";
        return db.Exec(sql, err) &&
               db.Exec("CREATE TRIGGER injected_write_failure_upd_" + table + " BEFORE UPDATE ON " + table +
                       " BEGIN SELECT RAISE(ABORT, 'injected write failure'); END;", err) &&
               db.Exec("CREATE TRIGGER injected_write_failure_del_" + table + " BEFORE DELETE ON " + table +
                       " BEGIN SELECT RAISE(ABORT, 'injected write failure'); END;", err);
    }
    int32_t LearnedLevel(int64_t unitUID, int32_t skillID, int32_t page)
    {
        SkillPageState st; std::string e2;
        if (!store.LoadSkillPageState(unitUID, st, e2)) return -999999;
        for (const auto& sk : st.skills)
            if (sk.skillPageNumber == page && sk.skillID == skillID) return sk.skillLevel;
        return 0;   // 已刪除＝視為 0 級
    }
    int32_t LearnedCSP(int64_t unitUID, int32_t skillID, int32_t page)
    {
        SkillPageState st; std::string e2;
        if (!store.LoadSkillPageState(unitUID, st, e2)) return -999999;
        for (const auto& sk : st.skills)
            if (sk.skillPageNumber == page && sk.skillID == skillID) return sk.skillCSPoint;
        return 0;
    }
    int32_t SPointOf(int64_t unitUID)
    {
        GUnitRecord u{}; bool found = false; std::string e2;
        if (!store.GetUnitByUID(unitUID, u, found, e2) || !found) return -999999;
        return u.sPoint;
    }
    std::string SlotAOf(int64_t unitUID, int32_t page)
    {
        SkillPageState st; std::string e2;
        if (!store.LoadSkillPageState(unitUID, st, e2)) return std::string();
        for (const auto& r : st.slotA) if (r.pageNumber == page) {
            char b[128]; std::snprintf(b, sizeof b, "%d,%d,%d,%d", r.slot[0], r.slot[1], r.slot[2], r.slot[3]);
            return std::string(b);
        }
        return std::string();
    }
    int32_t ItemQuantity(int64_t itemUID)   // 列不存在 → -1
    {
        std::string e2;
        Statement st;
        if (!st.Prepare(db, "SELECT Quantity FROM gitemquantity WHERE ItemUID = ?;", e2)) return -1;
        if (!st.BindInt(1, itemUID, e2)) return -1;
        if (!st.StepRow(e2)) return -1;
        return static_cast<int32_t>(st.ColumnInt64(0));
    }
    bool ItemLive(int64_t itemUID)   // gitem.Deleted == 0
    {
        std::string e2;
        Statement st;
        if (!st.Prepare(db, "SELECT Deleted FROM gitem WHERE ItemUID = ?;", e2)) return false;
        if (!st.BindInt(1, itemUID, e2)) return false;
        if (!st.StepRow(e2)) return false;
        return st.ColumnInt64(0) == 0;
    }
};

static SerBuffer PutPayload(const std::function<bool(Serializer&)>& fn)
{
    SerBuffer buf;
    Serializer ks;
    if (!ks.BeginWriting(&buf)) return SerBuffer{};
    if (!fn(ks)) return SerBuffer{};
    ks.EndWriting();
    return buf;
}

static ResetSkillAck DoReq(Fixture& fx, int64_t unitUID, int32_t skillID, int32_t page,
                           const char* nowUtc = "2026-11-18 00:00:00")
{
    ResetSkillReq req; req.iSkillID = skillID; req.iActiveSkillPageNumber = page;
    ResetSkillAck ack;
    std::string err;
    HandleResetSkillReq(fx.store, unitUID, req, ack, err, nowUtc ? std::string(nowUtc) : std::string());
    return ack;
}

// ---------- codec golden ----------

static void TestReqGoldenBytes()
{
    ResetSkillReq req;
    req.iSkillID = 0x05060708; req.iActiveSkillPageNumber = 0x01020304;
    SerBuffer buf = PutPayload([&req](Serializer& s) { return PutResetSkillReq(s, req); });
    const unsigned char expect[8] = { 0x05, 0x06, 0x07, 0x08, 0x01, 0x02, 0x03, 0x04 };
    CHECK(buf.GetLength() == sizeof(expect) && std::memcmp(buf.GetData(), expect, sizeof(expect)) == 0,
          "req golden bytes (2x int32 BE; skillID first, then page)");
    ResetSkillReq back;
    Serializer ks;
    CHECK(ks.BeginReading(&buf) && GetResetSkillReq(ks, back), "req parse");
    ks.EndReading();
    CHECK(back.iSkillID == 0x05060708 && back.iActiveSkillPageNumber == 0x01020304, "req roundtrip");
    ResetSkillReq def;
    CHECK(def.iSkillID == 0 && def.iActiveSkillPageNumber == 0, "req ctor defaults (0/0)");
}

static void TestAckGoldenBytes()
{
    ResetSkillAck ack;
    ack.iOK = 1; ack.iActiveSkillPageNumber = 2; ack.iDelSkillID = 0x10203040;
    ack.iSPoint = 7; ack.iCSPoint = -2;
    unit::InventoryItemInfo it;
    it.itemUID = 0x0102030405060708LL; it.slotCategory = 4; it.slotID = 0x00AB;
    it.itemInfo.itemID = 0x11121314; it.itemInfo.usageType = 2; it.itemInfo.quantity = 0x01020304;
    it.itemInfo.endurance = 0x1122; it.itemInfo.sealData = 0x7f; it.itemInfo.enchantLevel = -2;
    it.itemInfo.attrib = { 1, 2, -3 };
    it.itemInfo.itemSocket = { 0x21222324, -4 };
    it.itemInfo.randomSocket = {};
    it.itemInfo.itemState = 5; it.itemInfo.period = 0x3344; it.itemInfo.expirationDate = L"AB";
    it.itemInfo.expandedSocketNum = 6;
    ack.vecInventorySlotInfo.push_back(it);

    SerBuffer buf = PutPayload([&ack](Serializer& s) { return PutResetSkillAck(s, ack); });
    const unsigned char expect[79] = {
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02, 0x10, 0x20, 0x30, 0x40, 0x00, 0x00, 0x00, 0x07,
        0xff, 0xff, 0xff, 0xfe, 0x00, 0x00, 0x00, 0x01, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
        0x04, 0x00, 0xab, 0x11, 0x12, 0x13, 0x14, 0x02, 0x01, 0x02, 0x03, 0x04, 0x11, 0x22, 0x7f, 0xfe,
        0x01, 0x02, 0xfd, 0x00, 0x00, 0x00, 0x02, 0x21, 0x22, 0x23, 0x24, 0xff, 0xff, 0xff, 0xfc, 0x00,
        0x00, 0x00, 0x00, 0x05, 0x33, 0x44, 0x00, 0x00, 0x00, 0x04, 0x41, 0x00, 0x42, 0x00, 0x06
    };
    CHECK(buf.GetLength() == sizeof(expect) && std::memcmp(buf.GetData(), expect, sizeof(expect)) == 0,
          "ack golden bytes (5x int32 + vec count + InventoryItemInfo)");
    ResetSkillAck back;
    Serializer ks;
    CHECK(ks.BeginReading(&buf) && GetResetSkillAck(ks, back), "ack parse");
    ks.EndReading();
    CHECK(back.iOK == 1 && back.iActiveSkillPageNumber == 2 && back.iDelSkillID == 0x10203040 &&
          back.iSPoint == 7 && back.iCSPoint == -2 && back.vecInventorySlotInfo.size() == 1,
          "ack roundtrip fields");
    CHECK(back.vecInventorySlotInfo[0].itemUID == 0x0102030405060708LL &&
          back.vecInventorySlotInfo[0].slotCategory == 4 && back.vecInventorySlotInfo[0].slotID == 0x00AB &&
          back.vecInventorySlotInfo[0].itemInfo.itemID == 0x11121314 &&
          back.vecInventorySlotInfo[0].itemInfo.quantity == 0x01020304 &&
          back.vecInventorySlotInfo[0].itemInfo.attrib.cAttribEnchant2 == -3 &&
          back.vecInventorySlotInfo[0].itemInfo.itemSocket.size() == 2 &&
          back.vecInventorySlotInfo[0].itemInfo.itemSocket[1] == -4 &&
          back.vecInventorySlotInfo[0].itemInfo.expirationDate == L"AB" &&
          back.vecInventorySlotInfo[0].itemInfo.expandedSocketNum == 6,
          "ack roundtrip item info");
    ResetSkillAck def;
    CHECK(def.iOK == 0 && def.iActiveSkillPageNumber == 0 && def.iDelSkillID == 0 && def.iSPoint == 0 &&
          def.iCSPoint == 0 && def.vecInventorySlotInfo.empty(), "ack ctor defaults (all zero / empty vec)");
}

static void TestEventIdsAndErrorCodes()
{
    CHECK(static_cast<uint16_t>(EventID::EGS_RESET_SKILL_REQ) == 305 &&
          static_cast<uint16_t>(EventID::EGS_RESET_SKILL_ACK) == 306, "event ids 305/306");
    CHECK(ERR_RESET_SKILL_00 == 444 && ERR_RESET_SKILL_01 == 445 && ERR_RESET_SKILL_02 == 446 &&
          ERR_RESET_SKILL_03 == 447 && ERR_RESET_SKILL_04 == 448 && ERR_RESET_SKILL_05 == 449 &&
          ERR_SKILL_20 == 200 && ERR_SKILL_24 == 204 && ERR_SKILL_PAGE_01 == 1387,
          "error codes (compiled against original Neterror/NetError_def.h, all regions)");
}

// ---------- handler ----------

static void TestNonDefaultSkillReset()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(3101, L"reset_a", 1);   // class 1 → gskill(10000) Lv1; SPoint=1
    CHECK(uid > 0, "unit created");
    if (uid <= 0) return;
    CHECK(fx.SPointOf(uid) == 1, "starter SP == 1");

    CHECK(fx.SeedLearnedSkill(uid, 12001, 3, 1, 0), "seed learned 12001 Lv3");
    const int64_t itemUID = fx.SeedItem(uid, 200730, 3);   // CI_SKILL_RESET_ITEM qty 3
    CHECK(itemUID > 0, "seed reset item");

    ResetSkillAck ack = DoReq(fx, uid, 12001, 1);
    CHECK(ack.iOK == NET_OK, "reset non-default skill -> NET_OK");
    CHECK(ack.iDelSkillID == 12001 && ack.iActiveSkillPageNumber == 1, "ack echoes del skill / page");
    CHECK(ack.iSPoint == 1 + 3, "SP refund == learn 1 + upgrade 2 = 3 (ack iSPoint)");
    CHECK(ack.iCSPoint == 0, "no cash SP in play (ack iCSPoint)");
    CHECK(ack.vecInventorySlotInfo.size() == 1, "one updated slot info");
    CHECK(ack.vecInventorySlotInfo[0].itemUID == itemUID && ack.vecInventorySlotInfo[0].itemInfo.quantity == 2,
          "consumed 1 from stack (3 -> 2)");
    CHECK(fx.LearnedLevel(uid, 12001, 1) == 0, "gskill row deleted (level back to 0)");
    CHECK(fx.LearnedLevel(uid, 10000, 1) == 1, "starter skill untouched");
    CHECK(fx.SPointOf(uid) == 4, "SP persisted (1 -> 4)");
    CHECK(fx.ItemQuantity(itemUID) == 2, "gitemquantity 3 -> 2");
    CHECK(fx.ItemLive(itemUID), "item still live");
}

static void TestDefaultSkillReset()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(3102, L"reset_b", 1);
    CHECK(fx.SetLearnedSkill(uid, 10000, 3, 0), "upgrade starter to Lv3");
    CHECK(fx.SeedItem(uid, 200730, 1) > 0, "seed reset item");

    ResetSkillAck ack = DoReq(fx, uid, 10000, 1);
    CHECK(ack.iOK == NET_OK, "reset default skill -> NET_OK");
    CHECK(ack.iSPoint == 1 + 2, "default: refund upgrades only (Lv3 -> keep Lv1), +2 SP");
    CHECK(fx.LearnedLevel(uid, 10000, 1) == 1, "default skill row kept at Lv1");
    CHECK(fx.LearnedCSP(uid, 10000, 1) == 0, "default skill SkillCSPoint zeroed");
    CHECK(fx.SPointOf(uid) == 3, "SP persisted (1 -> 3)");
}

static void TestCashSkillPointRefundAndOverflow()
{
    // CSP 退還且不溢出
    {
        Fixture fx;
        const int64_t uid = fx.MakeUnit(3103, L"reset_c1", 1);
        CHECK(fx.SeedCash(uid, 2, 10), "seed cash 2/10");
        CHECK(fx.SeedLearnedSkill(uid, 12001, 3, 1, 2), "seed 12001 Lv3 invested 2 CSP");
        CHECK(fx.SeedItem(uid, 200730, 1) > 0, "seed item");
        ResetSkillAck ack = DoReq(fx, uid, 12001, 1);
        CHECK(ack.iOK == NET_OK, "NET_OK");
        CHECK(ack.iSPoint == 1 + 1, "SP refund = 3 - 2 invested = 1");
        CHECK(ack.iCSPoint == 4, "CSP = 2 + 2 invested = 4");
        CashSkillPointValues cash; std::string e2;
        CHECK(fx.store.GetCashSkillPoint(uid, cash, e2) && cash.csPoint == 4 && cash.maxCSPoint == 10,
              "gskillcash persisted 4/10");
    }
    // CSP 溢出 → 加回 SP 並截斷到 max
    {
        Fixture fx;
        const int64_t uid = fx.MakeUnit(3104, L"reset_c2", 1);
        CHECK(fx.SeedCash(uid, 9, 10), "seed cash 9/10");
        CHECK(fx.SeedLearnedSkill(uid, 12002, 3, 1, 5), "seed 12002 Lv3 invested 5 CSP");
        CHECK(fx.SeedItem(uid, 200730, 1) > 0, "seed item");
        ResetSkillAck ack = DoReq(fx, uid, 12002, 1);
        CHECK(ack.iOK == NET_OK, "NET_OK");
        CHECK(ack.iCSPoint == 10, "CSP clamped to max 10");
        CHECK(ack.iSPoint == 1 + (3 - 5) + 4, "overflow 4 rolls back into SP (1 + (-2) + 4 = 3)");
        CashSkillPointValues cash; std::string e2;
        CHECK(fx.store.GetCashSkillPoint(uid, cash, e2) && cash.csPoint == 10, "gskillcash persisted 10");
    }
}

static void TestCashSkillPointExpired()
{
    // MaxCSPoint == 0 → 現金技能點視為未啟用：投入的 CSP 消失，iAfterCSP = 0
    Fixture fx;
    const int64_t uid = fx.MakeUnit(3105, L"reset_c3", 1);
    CHECK(fx.SeedLearnedSkill(uid, 12003, 3, 1, 2), "seed 12003 Lv3 invested 2 CSP");
    CHECK(fx.SeedItem(uid, 200730, 1) > 0, "seed item");
    ResetSkillAck ack = DoReq(fx, uid, 12003, 1);
    CHECK(ack.iOK == NET_OK, "NET_OK");
    CHECK(ack.iCSPoint == 0, "expired cash pool -> ack iCSPoint 0");
    CHECK(ack.iSPoint == 1 + (3 - 2), "invested 2 CSP lost; SP refund = 3 - 2 = 1");
    CashSkillPointValues cash; std::string e2;
    CHECK(fx.store.GetCashSkillPoint(uid, cash, e2) && cash.csPoint == 0, "gskillcash written 0 (V2 一律寫入，§0a25 偏差 9)");
}

static void TestEquippedSkillBlocked()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(3106, L"reset_d1", 1);
    CHECK(fx.SeedLearnedSkill(uid, 13001, 2, 1, 0), "seed 13001 Lv2");
    CHECK(fx.SetSlotA(uid, 1, 2, 13001), "equip 13001 into slotA[2]");
    const int64_t itemUID = fx.SeedItem(uid, 200730, 2);
    ResetSkillAck ack = DoReq(fx, uid, 13001, 1);
    CHECK(ack.iOK == ERR_RESET_SKILL_05, "equipped non-default skill -> ERR_RESET_SKILL_05");
    CHECK(ack.iSPoint == 0 && ack.iCSPoint == 0 && ack.iDelSkillID == 0 && ack.vecInventorySlotInfo.empty(),
          "phase-A failure shape: all-zero ack except iOK, empty vec");
    CHECK(fx.LearnedLevel(uid, 13001, 1) == 2, "skill untouched");
    CHECK(fx.SPointOf(uid) == 1, "SP untouched");
    CHECK(fx.ItemQuantity(itemUID) == 2, "item untouched");
    CHECK(fx.SlotAOf(uid, 1) == "10000,0,13001,0", "slotA unchanged");
}

static void TestEquippedDefaultSkillAllowed()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(3107, L"reset_d2", 1);   // 10000 equipped in slotA[0] by CreateUnit
    CHECK(fx.SetLearnedSkill(uid, 10000, 2, 0), "starter Lv2");
    CHECK(fx.SeedItem(uid, 200730, 1) > 0, "seed item");
    ResetSkillAck ack = DoReq(fx, uid, 10000, 1);
    CHECK(ack.iOK == NET_OK, "equipped default skill reset allowed");
    CHECK(fx.LearnedLevel(uid, 10000, 1) == 1, "default skill kept at Lv1 (still equipped)");
    CHECK(fx.SlotAOf(uid, 1) == "10000,0,0,0", "equipped slot unchanged");
}

static void TestPageMismatch()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(3108, L"reset_e1", 1);
    CHECK(fx.SeedLearnedSkill(uid, 12011, 1, 1, 0), "seed skill");
    CHECK(fx.SeedItem(uid, 200730, 1) > 0, "seed item");
    ResetSkillAck ack = DoReq(fx, uid, 12011, 2);   // 作用頁是 1
    CHECK(ack.iOK == ERR_SKILL_PAGE_01, "wrong page -> ERR_SKILL_PAGE_01");
    CHECK(ack.iActiveSkillPageNumber == 0 && ack.iDelSkillID == 0 && ack.iSPoint == 0 &&
          ack.iCSPoint == 0 && ack.vecInventorySlotInfo.empty(),
          "phase-A failure shape: all-zero ack except iOK");
    CHECK(fx.LearnedLevel(uid, 12011, 1) == 1, "skill untouched");
}

static void TestUnknownOrUnlearnedSkill()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(3109, L"reset_e2", 1);
    CHECK(fx.SeedItem(uid, 200730, 1) > 0, "seed item");
    ResetSkillAck ack = DoReq(fx, uid, -1, 1);
    CHECK(ack.iOK == ERR_RESET_SKILL_00, "skillID <= 0 -> ERR_RESET_SKILL_00");
    ack = DoReq(fx, uid, 99999, 1);
    CHECK(ack.iOK == ERR_SKILL_20, "never-learned skill -> ERR_SKILL_20");
    // 學會於「其他頁」不算本頁學會（V2 技能為 unit-global 列帶頁碼；作用頁過濾）
    CHECK(fx.SeedLearnedSkill(uid, 12012, 1, 2, 0), "seed skill on page 2");
    ack = DoReq(fx, uid, 12012, 1);
    CHECK(ack.iOK == ERR_SKILL_20, "skill on another page is not learned on active page -> ERR_SKILL_20");
    CHECK(fx.LearnedLevel(uid, 12012, 2) == 1, "page-2 skill untouched");
}

static void TestNoResetItem()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(3110, L"reset_e3", 1);
    CHECK(fx.SeedLearnedSkill(uid, 12013, 2, 1, 0), "seed skill");
    // 無重置道具
    ResetSkillAck ack = DoReq(fx, uid, 12013, 1);
    CHECK(ack.iOK == ERR_RESET_SKILL_01, "no reset item -> ERR_RESET_SKILL_01");
    CHECK(ack.vecInventorySlotInfo.empty(), "phase-A failure: empty vec");
    CHECK(fx.LearnedLevel(uid, 12013, 1) == 2, "skill untouched");
    CHECK(fx.SPointOf(uid) == 1, "SP untouched");
}

static void TestItemPriorityAndSmallestStack()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(3111, L"reset_f1", 1);
    CHECK(fx.SeedLearnedSkill(uid, 12021, 1, 1, 0), "seed a");
    CHECK(fx.SeedLearnedSkill(uid, 12022, 1, 1, 0), "seed b");
    CHECK(fx.SeedLearnedSkill(uid, 12023, 1, 1, 0), "seed c");
    const int64_t plain = fx.SeedItem(uid, 200730, 5, 4, 0);   // CI_SKILL_RESET_ITEM
    const int64_t event = fx.SeedItem(uid, 130808, 1, 4, 1);   // CI_SKILL_RESET_EVENT_ITEM
    const int64_t event2 = fx.SeedItem(uid, 160947, 1, 4, 2);  // CI_SKILL_RESET_EVENT_ITEM2
    // 優先序：160947 > 130808 > 200730
    ResetSkillAck ack = DoReq(fx, uid, 12021, 1);
    CHECK(ack.iOK == NET_OK && fx.ItemQuantity(event2) == 0, "highest priority item (EVENT2) consumed first");
    ack = DoReq(fx, uid, 12022, 1);
    CHECK(ack.iOK == NET_OK && fx.ItemQuantity(event) == 0, "then EVENT item consumed");
    ack = DoReq(fx, uid, 12023, 1);
    CHECK(ack.iOK == NET_OK && fx.ItemQuantity(plain) == 4, "then plain item consumed (5 -> 4)");

    // 數量最少堆疊優先
    const int64_t big = fx.SeedItem(uid, 200730, 2, 4, 3);
    const int64_t small = fx.SeedItem(uid, 200730, 1, 4, 4);
    CHECK(fx.SeedLearnedSkill(uid, 12024, 1, 1, 0), "seed d");
    ack = DoReq(fx, uid, 12024, 1);
    CHECK(ack.iOK == NET_OK, "NET_OK");
    CHECK(fx.ItemQuantity(small) == -1 || !fx.ItemLive(small), "smallest stack (qty 1) consumed and deleted");
    CHECK(fx.ItemQuantity(big) == 2, "bigger stack untouched");
    CHECK(ack.vecInventorySlotInfo.size() == 1 && ack.vecInventorySlotInfo[0].itemUID == 0,
          "exhausted item -> ACK carries empty slot (itemUID=0)");
}

static void TestUnlimitedItemOutranksAll()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(3112, L"reset_f2", 1);
    CHECK(fx.SeedLearnedSkill(uid, 12031, 1, 1, 0), "seed a");
    const int64_t plain = fx.SeedItem(uid, 200730, 9, 4, 0);
    const int64_t unlimited = fx.SeedItem(uid, 60008069, 1, 4, 1);   // CI_UNLIMITED_SKILL_RESET_ITEM
    ResetSkillAck ack = DoReq(fx, uid, 12031, 1);
    CHECK(ack.iOK == NET_OK, "NET_OK");
    CHECK(fx.ItemQuantity(unlimited) == -1 || !fx.ItemLive(unlimited), "UNLIMITED item consumed first (JP)");
    CHECK(fx.ItemQuantity(plain) == 9, "plain item untouched");
}

static void TestEbItemDeleteOnExhaustedStack()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(3113, L"reset_f3", 1);
    CHECK(fx.SeedLearnedSkill(uid, 12041, 1, 1, 0), "seed a");
    const int64_t itemUID = fx.SeedItem(uid, 200730, 1);
    ResetSkillAck ack = DoReq(fx, uid, 12041, 1);
    CHECK(ack.iOK == NET_OK, "NET_OK");
    CHECK(!fx.ItemLive(itemUID), "qty 1 -> 0 => gitem soft-deleted");
    CHECK(ack.vecInventorySlotInfo.size() == 1 && ack.vecInventorySlotInfo[0].itemUID == 0 &&
          ack.vecInventorySlotInfo[0].slotCategory == 4,
          "ACK slot info is the emptied slot (itemUID=0)");
}

static void TestCommitRollbackOnItemFailure()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(3114, L"reset_g1", 1);
    CHECK(fx.SeedLearnedSkill(uid, 14001, 2, 1, 0), "seed skill");
    const int64_t itemUID = fx.SeedItem(uid, 200730, 1);
    CHECK(fx.InjectWriteFailure("gitemquantity"), "fault injection: gitemquantity write aborts");
    ResetSkillAck ack = DoReq(fx, uid, 14001, 1);
    CHECK(ack.iOK == ERR_RESET_SKILL_02, "item quantity DB failure -> ERR_RESET_SKILL_02");
    CHECK(ack.iDelSkillID == 14001 && ack.iActiveSkillPageNumber == 1,
          "phase-B failure shape: iDelSkillID/page echoed, iOK set");
    CHECK(ack.vecInventorySlotInfo.size() == 1 && ack.vecInventorySlotInfo[0].itemInfo.quantity == 1,
          "phase-B failure vec reports unchanged quantity (rolled back)");
    CHECK(fx.LearnedLevel(uid, 14001, 1) == 2, "skill rolled back (still Lv2)");
    CHECK(fx.SPointOf(uid) == 1, "SP rolled back");
    CHECK(fx.ItemLive(itemUID), "item still live (soft-delete rolled back)");
}

static void TestCommitRollbackOnCashPointFailure()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(3115, L"reset_g2", 1);
    CHECK(fx.SeedLearnedSkill(uid, 14002, 2, 1, 0), "seed skill");
    const int64_t itemUID = fx.SeedItem(uid, 200730, 1);
    CHECK(fx.InjectWriteFailure("gskillcash"), "fault injection: gskillcash write aborts (SELECT ok)");
    ResetSkillAck ack = DoReq(fx, uid, 14002, 1);
    CHECK(ack.iOK == ERR_SKILL_24, "cash skill point DB failure -> ERR_SKILL_24");
    CHECK(fx.LearnedLevel(uid, 14002, 1) == 2, "skill rolled back (still Lv2)");
    CHECK(fx.SPointOf(uid) == 1, "SP rolled back");
    CHECK(fx.ItemQuantity(itemUID) == 1, "item quantity rolled back");
}

static void TestNegativeSPointAllowed()
{
    // 原 SP 扣減可倒扣為負（faithful）
    Fixture fx;
    const int64_t uid = fx.MakeUnit(3116, L"reset_g3", 1);
    CHECK(fx.SeedCash(uid, 0, 10), "seed cash 0/10");
    CHECK(fx.SeedLearnedSkill(uid, 14003, 1, 1, 5), "seed skill invested 5 CSP");
    CHECK(fx.SeedItem(uid, 200730, 1) > 0, "seed item");
    ResetSkillAck ack = DoReq(fx, uid, 14003, 1);
    CHECK(ack.iOK == NET_OK, "NET_OK");
    CHECK(ack.iSPoint == 1 + (1 - 5), "SP can go negative: 1 + (1 - 5) = -3");
    CHECK(fx.SPointOf(uid) == -3, "negative SPoint persisted");
}

static void TestDefaultSkillNotEquippedOtherPage()
{
    // 預設技能重置後等級保留 1 且 SkillCSPoint 歸零；ACK 帶 iSPoint
    Fixture fx;
    const int64_t uid = fx.MakeUnit(3117, L"reset_g4", 1);
    CHECK(fx.SetLearnedSkill(uid, 10000, 4, 3), "starter Lv4, invested 3 CSP");
    CHECK(fx.SeedCash(uid, 5, 10), "seed cash 5/10");
    CHECK(fx.SeedItem(uid, 200730, 1) > 0, "seed item");
    ResetSkillAck ack = DoReq(fx, uid, 10000, 1);
    CHECK(ack.iOK == NET_OK, "NET_OK");
    CHECK(ack.iCSPoint == 8, "CSP = 5 + 3 invested");
    CHECK(ack.iSPoint == 1 + (4 - 1) - 3, "default: refund 3 upgrades - 3 invested = 0 net SP change (1)");
    CHECK(fx.LearnedLevel(uid, 10000, 1) == 1, "default skill kept at Lv1");
    CHECK(fx.LearnedCSP(uid, 10000, 1) == 0, "SkillCSPoint zeroed");
}

void RunResetSkillTestsByRef(int& pass, int& fail)
{
    g_pass_rs = 0; g_fail_rs = 0;
    TestReqGoldenBytes();
    TestAckGoldenBytes();
    TestEventIdsAndErrorCodes();
    TestNonDefaultSkillReset();
    TestDefaultSkillReset();
    TestCashSkillPointRefundAndOverflow();
    TestCashSkillPointExpired();
    TestEquippedSkillBlocked();
    TestEquippedDefaultSkillAllowed();
    TestPageMismatch();
    TestUnknownOrUnlearnedSkill();
    TestNoResetItem();
    TestItemPriorityAndSmallestStack();
    TestUnlimitedItemOutranksAll();
    TestEbItemDeleteOnExhaustedStack();
    TestCommitRollbackOnItemFailure();
    TestCommitRollbackOnCashPointFailure();
    TestNegativeSPointAllowed();
    TestDefaultSkillNotEquippedOtherPage();
    pass += g_pass_rs; fail += g_fail_rs;
    std::printf("reset_skill: %d passed, %d failed\n", g_pass_rs, g_fail_rs);
}
