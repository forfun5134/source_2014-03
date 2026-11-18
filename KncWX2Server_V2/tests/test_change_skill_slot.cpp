// tests/test_change_skill_slot.cpp — EGS_CHANGE_SKILL_SLOT_REQ/ACK（§0a24）
// 對照原 GSUserGameCommon::IMPL_ON_FUNC(EGS_CHANGE_SKILL_SLOT_REQ)（GSUserGameCommon.cpp:2756–2832）
//   ＋ KUserSkillTree::ChangeSkillSlot（UserSkillTree.cpp:353–470，SERV_SKILL_SLOT_CHANGE_PACKET_INTEGRATE 版）：
//   REQ{ m_iSlotID:int, m_iSkillID:int }；ACK{ m_iOK, m_iSlotID, m_iSkillID, m_iSlotID2, m_iSkillID2 }；事件 296/297；
//   iSlotID2 = 該技能交換前所在欄位（未裝備 → -1）；iSkillID2 = 被擠出的技能（目標欄為空 → 0）。
// 原版只改記憶體、延遲到 DBE_UPDATE_UNIT_INFO_REQ 才 upsert gskillslotnew/gskillslot2new；V2 為 write-through（見 .h 偏差聲明 1）。
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
#include "../src/server/ChangeSkillSlotProtocol.h"
#include "../src/server/CreateUnitProtocol.h"
#include "../src/server/UnitSelectArbiter.h"

using namespace x2;
using namespace x2::db;
using namespace x2::change_skill_slot;
using namespace x2::create_unit;
using namespace x2::select_unit;

static int g_pass_cs = 0, g_fail_cs = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_cs++; } \
    else { g_fail_cs++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
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
        std::snprintf(buf, sizeof buf, "cs_%lld", (long long)userUID);
        GUserRecord gu;
        if (!store.GetOrCreateGUser(userUID, buf, gu, err)) return -1;
        CreateUnitReq req; req.iClass = unitClass; req.wstrNickName = nick;
        CreateUnitAck ack;
        if (!HandleCreateUnitReq(store, userUID, 5, req, ack, err)) return -1;
        return ack.iOK == NET_OK ? ack.kUnitInfo.unitUID : -1;
    }
    // 直接播種一個「已學會」技能（繞過建角流程；SkillLevel>=1 才會被讀回過濾）
    bool SeedLearnedSkill(int64_t unitUID, int32_t skillID, int32_t level = 1, int32_t page = 1, int32_t csp = 0)
    {
        const std::string sql = "INSERT INTO gskill (UnitUID, SkillID, SkillLevel, SkillCSPoint, SkillPageNumber) VALUES ("
            + std::to_string(unitUID) + ", " + std::to_string(skillID) + ", " + std::to_string(level) + ", "
            + std::to_string(csp) + ", " + std::to_string(page) + ");";
        return db.Exec(sql, err);
    }
    // 直接設定欄位（測試交換語意；bypass 決策層）
    bool SeedSlotRow(int64_t unitUID, int32_t page, const int32_t (&slotA)[4], const int32_t (&slotB)[4], const char* bEnd)
    {
        const std::string sqlA = "INSERT OR REPLACE INTO gskillslotnew (UnitUID, SkillPageNumber, Slot01, Slot02, Slot03, Slot04) VALUES ("
            + std::to_string(unitUID) + ", " + std::to_string(page) + ", "
            + std::to_string(slotA[0]) + ", " + std::to_string(slotA[1]) + ", " + std::to_string(slotA[2]) + ", " + std::to_string(slotA[3]) + ");";
        const std::string sqlB = "INSERT OR REPLACE INTO gskillslot2new (UnitUID, SkillPageNumber, Slot01, Slot02, Slot03, Slot04, EndDate) VALUES ("
            + std::to_string(unitUID) + ", " + std::to_string(page) + ", "
            + std::to_string(slotB[0]) + ", " + std::to_string(slotB[1]) + ", " + std::to_string(slotB[2]) + ", " + std::to_string(slotB[3]) + ", '"
            + std::string(bEnd) + "');";
        return db.Exec(sqlA, err) && db.Exec(sqlB, err);
    }
    // 只改 SlotB 的 EndDate（unit-global：最高頁之列）
    bool SetSlotBEndDate(int64_t unitUID, int32_t page, const char* bEnd)
    {
        const std::string sql = "UPDATE gskillslot2new SET EndDate = '" + std::string(bEnd)
            + "' WHERE UnitUID = " + std::to_string(unitUID) + " AND SkillPageNumber = " + std::to_string(page) + ";";
        return db.Exec(sql, err);
    }
};

static int SlotOf(Fixture& fx, int64_t unitUID, int32_t page, int slotIndex, bool slotB)
{
    SkillPageState st;
    std::string err;
    if (!fx.store.LoadSkillPageState(unitUID, st, err)) return -99999;
    if (!slotB) {
        for (const auto& r : st.slotA) if (r.pageNumber == page) return r.slot[slotIndex];
    } else {
        for (const auto& r : st.slotB) if (r.pageNumber == page) return r.slot[slotIndex];
    }
    return -99999;
}

static std::string SlotBEndDateOf(Fixture& fx, int64_t unitUID)
{
    SkillPageState st;
    std::string err;
    if (!fx.store.LoadSkillPageState(unitUID, st, err)) return std::string("<err>");
    return st.skillSlotBEndDate;
}

static SerBuffer PutPayload(const std::function<bool(Serializer&)>& fn)
{
    SerBuffer buf;
    Serializer ks;
    if (!ks.BeginWriting(&buf)) return SerBuffer{};
    if (!fn(ks)) return SerBuffer{};
    ks.EndWriting();
    return buf;
}

// ---------- codec golden ----------

static void TestReqGoldenBytes()
{
    ChangeSkillSlotReq req;
    req.iSlotID = 0x01020304;
    req.iSkillID = 0x05060708;
    SerBuffer buf = PutPayload([&req](Serializer& s) { return PutChangeSkillSlotReq(s, req); });
    const unsigned char expect[8] = { 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08 };
    CHECK(buf.GetLength() == sizeof(expect) && std::memcmp(buf.GetData(), expect, sizeof(expect)) == 0,
          "req golden bytes (2x int32 BE)");
    ChangeSkillSlotReq back;
    Serializer ks;
    CHECK(ks.BeginReading(&buf) && GetChangeSkillSlotReq(ks, back), "req parse");
    ks.EndReading();
    CHECK(back.iSlotID == 0x01020304 && back.iSkillID == 0x05060708, "req roundtrip");
    // 預設值對齊原 ctor（iSlotID=-1, iSkillID=0）
    ChangeSkillSlotReq def;
    CHECK(def.iSlotID == -1 && def.iSkillID == 0, "req ctor defaults (-1/0)");
}

static void TestAckGoldenBytes()
{
    ChangeSkillSlotAck ack;
    ack.iOK = 0x0000002a;
    ack.iSlotID = 0x01020304;
    ack.iSkillID = 0x05060708;
    ack.iSlotID2 = static_cast<int32_t>(0xfffffffe);  // -2
    ack.iSkillID2 = 0x0a0b0c0d;
    SerBuffer buf = PutPayload([&ack](Serializer& s) { return PutChangeSkillSlotAck(s, ack); });
    const unsigned char expect[20] = {
        0x00, 0x00, 0x00, 0x2a,
        0x01, 0x02, 0x03, 0x04,
        0x05, 0x06, 0x07, 0x08,
        0xff, 0xff, 0xff, 0xfe,
        0x0a, 0x0b, 0x0c, 0x0d
    };
    CHECK(buf.GetLength() == sizeof(expect) && std::memcmp(buf.GetData(), expect, sizeof(expect)) == 0,
          "ack golden bytes (5x int32 BE)");
    ChangeSkillSlotAck back;
    Serializer ks;
    CHECK(ks.BeginReading(&buf) && GetChangeSkillSlotAck(ks, back), "ack parse");
    ks.EndReading();
    CHECK(back.iOK == 0x2a && back.iSlotID == 0x01020304 && back.iSkillID == 0x05060708 &&
          back.iSlotID2 == -2 && back.iSkillID2 == 0x0a0b0c0d, "ack roundtrip");
    ChangeSkillSlotAck def;
    CHECK(def.iOK == 0 && def.iSlotID == -1 && def.iSkillID == 0 && def.iSlotID2 == -1 && def.iSkillID2 == 0,
          "ack ctor defaults (0/-1/0/-1/0)");
}

static void TestEventIdsAndErrorCodes()
{
    CHECK(static_cast<uint16_t>(EventID::EGS_CHANGE_SKILL_SLOT_REQ) == 296 &&
          static_cast<uint16_t>(EventID::EGS_CHANGE_SKILL_SLOT_ACK) == 297 &&
          static_cast<uint16_t>(EventID::EGS_CHANGE_SKILL_SLOT_NOT) == 298,
          "event ids 296/297/298");
    CHECK(ERR_SKILL_09 == 190 && ERR_SKILL_10 == 191 && ERR_SKILL_13 == 193 && ERR_SKILL_14 == 194,
          "ERR_SKILL_09/10/13/14 == 190/191/193/194 (g++ -fpermissive 機讀實編原 NetError_def.h；早前 164/165/167/168 為手工計數錯誤，§0a26 修正)");
}

// ---------- handler ----------

static ChangeSkillSlotAck DoReq(Fixture& fx, int64_t unitUID, int32_t slotID, int32_t skillID,
                                const char* nowUtc = "2026-11-18 00:00:00")
{
    ChangeSkillSlotReq req; req.iSlotID = slotID; req.iSkillID = skillID;
    ChangeSkillSlotAck ack;
    std::string err;
    HandleChangeSkillSlotReq(fx.store, unitUID, req, ack, err, nowUtc ? std::string(nowUtc) : std::string());
    return ack;
}

static void TestHandlerBasicFlow()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(2101, L"skill_slot_a", 1);
    CHECK(uid > 0, "class1 unit created");
    if (uid <= 0) return;
    // 建角：學會 10000（page1），slotA page1 = [10000, 0, 0, 0]

    // [成功] 把 10000 從欄位 0 移到欄位 3（目標欄為空 → iSkillID2=0；原已裝在欄位 0 → iSlotID2=0）
    {
        ChangeSkillSlotAck ack = DoReq(fx, uid, 3, 10000);
        CHECK(ack.iOK == NET_OK, "move learned skill to empty slot -> NET_OK");
        CHECK(ack.iSlotID == 3 && ack.iSkillID == 10000, "ack echoes slot/skill");
        CHECK(ack.iSlotID2 == 0, "iSlotID2 == 0 (skill was in slot 0)");
        CHECK(ack.iSkillID2 == 0, "iSkillID2 == 0 (target slot was empty)");
        CHECK(SlotOf(fx, uid, 1, 0, false) == 0, "slot0 cleared (moved)");
        CHECK(SlotOf(fx, uid, 1, 3, false) == 10000, "slot3 now holds 10000");
    }

    // [成功] 學會第二個技能並放上欄位 1，再把 21001 換到欄位 3（iSkillID2=10000 被擠出）
    CHECK(fx.SeedLearnedSkill(uid, 21001, 1, 1, 0), "seed learned skill 21001");
    CHECK(fx.SeedSlotRow(uid, 1, { 0, 21001, 0, 10000 }, { 0, 0, 0, 0 }, "2000-01-01 00:00:00"), "seed slots");
    {
        ChangeSkillSlotAck ack = DoReq(fx, uid, 3, 21001);
        CHECK(ack.iOK == NET_OK, "swap into occupied slot -> NET_OK");
        CHECK(ack.iSlotID2 == 1, "iSlotID2 == 1 (21001 was in slot 1)");
        CHECK(ack.iSkillID2 == 10000, "iSkillID2 == 10000 (displaced)");
        CHECK(SlotOf(fx, uid, 1, 1, false) == 10000, "displaced skill moved to slot 1");
        CHECK(SlotOf(fx, uid, 1, 3, false) == 21001, "slot3 now holds 21001");
    }

    // [成功] 技能已在目標欄位 → 自身交換（iSlotID2 == iSlotID，內容不變）
    {
        ChangeSkillSlotAck ack = DoReq(fx, uid, 3, 21001);
        CHECK(ack.iOK == NET_OK, "skill already in target slot -> NET_OK");
        CHECK(ack.iSlotID2 == 3 && ack.iSkillID2 == 21001, "iSlotID2 == iSlotID (self-swap)");
        CHECK(SlotOf(fx, uid, 1, 3, false) == 21001, "slot3 unchanged");
    }

    // [成功] 卸下（iSkillID=0）：slot3 清空；iSlotID2=-1（0 不是學會技能）
    {
        ChangeSkillSlotAck ack = DoReq(fx, uid, 3, 0);
        CHECK(ack.iOK == NET_OK, "unequip -> NET_OK");
        CHECK(ack.iSkillID == 0, "ack echoes skillID 0");
        CHECK(ack.iSlotID2 == -1, "dequip: iSlotID2=-1 (skill 0 not learned)");
        CHECK(ack.iSkillID2 == 21001, "dequip: iSkillID2=21001 (occupant reported; original GetSkillID(slot))");
        CHECK(SlotOf(fx, uid, 1, 3, false) == 0, "slot3 cleared");
    }

    // [失敗] 欄位越界 → ERR_SKILL_09；DB 不變
    {
        ChangeSkillSlotAck ack = DoReq(fx, uid, 8, 21001);
        CHECK(ack.iOK == ERR_SKILL_09, "slot 8 -> ERR_SKILL_09");
        ack = DoReq(fx, uid, -1, 21001);
        CHECK(ack.iOK == ERR_SKILL_09, "slot -1 -> ERR_SKILL_09");
        ack = DoReq(fx, uid, 4 + 4, 21001);
        CHECK(ack.iOK == ERR_SKILL_09, "slot 8 again -> ERR_SKILL_09");
        CHECK(SlotOf(fx, uid, 1, 1, false) == 10000, "db unchanged after ERR_SKILL_09");
        CHECK(ack.iSlotID == -1 && ack.iSkillID == 0 && ack.iSlotID2 == -1 && ack.iSkillID2 == 0,
              "failure ack keeps ctor defaults (-1/0/-1/0)");
    }

    // [失敗] 未學會技能 → ERR_SKILL_10；DB 不變
    {
        ChangeSkillSlotAck ack = DoReq(fx, uid, 0, 99999);
        CHECK(ack.iOK == ERR_SKILL_10, "unlearned skill -> ERR_SKILL_10");
        ack = DoReq(fx, uid, 0, -5);
        CHECK(ack.iOK == ERR_SKILL_10, "negative skill id -> ERR_SKILL_10 (deviation 3)");
        CHECK(SlotOf(fx, uid, 1, 0, false) == 0, "slot0 unchanged after ERR_SKILL_10");
    }

    // [失敗] 欄位 B 已過期（新建角色無 SlotB 購買 → 哨兵 EndDate → 過期）→ ERR_SKILL_13
    {
        ChangeSkillSlotAck ack = DoReq(fx, uid, 4, 10000);
        CHECK(ack.iOK == ERR_SKILL_13, "slot B (index 4) with expired slot B -> ERR_SKILL_13");
        CHECK(SlotOf(fx, uid, 1, 0, false) == 0, "slot A unchanged");
        CHECK(SlotOf(fx, uid, 1, 0, true) == 0, "slot B unchanged");
    }

    // [成功] SlotB 設為未過期（2999）→ 可裝備欄位 B；B 列 EndDate 以 unit-global 值寫回
    CHECK(fx.SeedSlotRow(uid, 1, { 0, 21001, 0, 0 }, { 0, 0, 0, 0 }, "2999-12-31 00:00:00"), "set future slot B");
    {
        // 確保 unit-global EndDate = 2999（LoadSkillPageState 取最高頁列）
        SkillPageState st;
        CHECK(fx.store.LoadSkillPageState(uid, st, fx.err), "reload state");
        CHECK(st.skillSlotBEndDate == "2999-12-31 00:00:00", "unit-global slot B end date is future");
        ChangeSkillSlotAck ack = DoReq(fx, uid, 4, 10000);
        CHECK(ack.iOK == NET_OK, "slot B with unexpired end date -> NET_OK");
        CHECK(ack.iSlotID2 == -1, "requested skill 10000 not slotted (unequipped earlier) -> -1");
        CHECK(SlotOf(fx, uid, 1, 0, true) == 10000, "slot B index 0 (A1-style index 4) holds 10000");
        CHECK(SlotBEndDateOf(fx, uid) == "2999-12-31 00:00:00", "B row end date written back (unit-global)");
    }

    // [失敗] 欄位 B 過期後：目標欄位是 A、但被請求技能住在欄位 B → iSlotID2 過期路徑 → ERR_SKILL_13
    CHECK(fx.SetSlotBEndDate(uid, 1, "2000-01-01 00:00:00"), "expire slot B");
    {
        ChangeSkillSlotAck ack = DoReq(fx, uid, 0, 10000);
        CHECK(ack.iOK == ERR_SKILL_13, "requested skill parked in expired slot B -> ERR_SKILL_13");
        CHECK(SlotOf(fx, uid, 1, 0, false) == 0, "slot A unchanged");
        CHECK(SlotOf(fx, uid, 1, 0, true) == 10000, "slot B unchanged (validate-then-commit)");
    }

    // [邊界] 請求技能未裝備但目標欄現有「未學會」技能 → 依原碼語意：不驗證 iSkillID2（validate 僅在 iSlotID2∈[0,8) 時執行）→ NET_OK、直接覆寫
    CHECK(fx.SeedSlotRow(uid, 1, { 99998, 21001, 0, 0 }, { 0, 0, 0, 0 }, "2999-12-31 00:00:00"), "seed unlearned skill in slot0 (overwrite case)");
    CHECK(fx.SeedLearnedSkill(uid, 21002, 1, 1, 0), "seed learned skill 21002");
    {
        ChangeSkillSlotAck ack = DoReq(fx, uid, 0, 21002);
        CHECK(ack.iOK == NET_OK, "requested skill not slotted -> displaced unlearned skill NOT validated (original semantics)");
        CHECK(SlotOf(fx, uid, 1, 0, false) == 21002, "slot0 overwritten with 21002");
    }
}

static void TestHandlerDisplacementUnlearned()
{
    // 精確驗證：目標欄現有技能未學會 → ERR_SKILL_10，DB 不變
    Fixture fx;
    const int64_t uid = fx.MakeUnit(2102, L"skill_slot_b", 1);
    CHECK(uid > 0, "class1 unit created (b)");
    if (uid <= 0) return;
    CHECK(fx.SeedLearnedSkill(uid, 21001, 1, 1, 0), "seed learned 21001");
    // slotA = [99998, 21001, 0, 0]（99998 未學會）
    CHECK(fx.SeedSlotRow(uid, 1, { 99998, 21001, 0, 0 }, { 0, 0, 0, 0 }, "2000-01-01 00:00:00"), "seed slots (b)");
    // 把 21001（未裝備）放到欄位 0（現有 99998）→ iSkillID2=99998 > 0 且未學會 → ERR_SKILL_10
    {
        ChangeSkillSlotAck ack = DoReq(fx, uid, 0, 21001);
        CHECK(ack.iOK == ERR_SKILL_10, "displaced slotted-but-unlearned skill -> ERR_SKILL_10");
        CHECK(SlotOf(fx, uid, 1, 0, false) == 99998, "slot0 unchanged");
        CHECK(SlotOf(fx, uid, 1, 1, false) == 21001, "slot1 unchanged");
    }
    // 把已學會但未裝備的 10000 放到空欄位 2 → NET_OK；iSlotID2=-1（21001 仍裝備在欄位 1）
    {
        ChangeSkillSlotAck ack = DoReq(fx, uid, 2, 10000);
        CHECK(ack.iOK == NET_OK, "place learned-but-unslotted skill into empty slot -> NET_OK");
        CHECK(ack.iSlotID2 == -1, "iSlotID2 == -1 (skill not slotted anywhere)");
        CHECK(ack.iSkillID2 == 0, "iSkillID2 == 0 (target empty)");
        CHECK(SlotOf(fx, uid, 1, 2, false) == 10000, "slot2 now holds 10000");
        CHECK(SlotOf(fx, uid, 1, 1, false) == 21001, "slot1 still holds 21001");
    }
}

static void TestHandlerEdgeCases()
{
    Fixture fx;
    const int64_t uid = fx.MakeUnit(2103, L"skill_slot_c", 1);
    CHECK(uid > 0, "class1 unit created (c)");
    if (uid <= 0) return;
    // 6001（SI_ETC_WS_COMMON_LOVE）原碼硬編碼為恆學會；不需要（也不應）播種 gskill
    {
        ChangeSkillSlotAck ack = DoReq(fx, uid, 1, 6001);
        CHECK(ack.iOK == NET_OK, "hardcoded 6001 treated as learned -> NET_OK");
        CHECK(SlotOf(fx, uid, 1, 1, false) == 6001, "slot1 holds 6001");
    }
    // 作用頁以外的技能 → ERR_SKILL_10（IsExistOnUsedPage 是「作用頁」語意）
    {
        CHECK(fx.SeedLearnedSkill(uid, 22001, 1, /*page=*/2, 0), "seed page-2 skill 22001");
        // 注意：頁 2 不存在（expand=1 頁），該列仍是 gskill 的 1 列；作用頁=1 → 該技能視為未學會
        ChangeSkillSlotAck ack = DoReq(fx, uid, 2, 22001);
        CHECK(ack.iOK == ERR_SKILL_10, "skill learned on another page -> ERR_SKILL_10");
    }
    // 不存在的 unitUID → LoadSkillPageState 失敗（slotA 自癒 INSERT 撞 FK）→ ERR_SKILL_14
    {
        ChangeSkillSlotReq req; req.iSlotID = 0; req.iSkillID = 0;
        ChangeSkillSlotAck ack;
        std::string err;
        int32_t rc = HandleChangeSkillSlotReq(fx.store, 999999, req, ack, err, "2026-11-18 00:00:00");
        CHECK(rc == ERR_SKILL_14, "nonexistent unit -> ERR_SKILL_14 (deviation 7)");
        CHECK(ack.iSlotID == -1 && ack.iSkillID == 0, "failure ack keeps defaults");
    }
}

static void TestSlotBStrictGreater()
{
    // 原 write 路徑用嚴格 `>`：now == EndDate → 視為「未過期」（與 GetSkillSlotBExpirationState 的 >= 不同）
    Fixture fx;
    const int64_t uid = fx.MakeUnit(2104, L"skill_slot_d", 1);
    CHECK(uid > 0, "class1 unit created (d)");
    if (uid <= 0) return;
    CHECK(fx.SeedSlotRow(uid, 1, { 10000, 0, 0, 0 }, { 0, 0, 0, 0 }, "2026-11-18 00:00:00"), "slot B end date == now");
    {
        ChangeSkillSlotAck ack = DoReq(fx, uid, 4, 10000, /*nowUtc=*/"2026-11-18 00:00:00");
        CHECK(ack.iOK == NET_OK, "now == slot B end date -> NOT expired (strict >)");
    }
    {
        ChangeSkillSlotAck ack = DoReq(fx, uid, 5, 10000, /*nowUtc=*/"2026-11-18 00:00:01");
        CHECK(ack.iOK == ERR_SKILL_13, "now > slot B end date -> expired");
    }
}

// ---------- runner ----------

void RunChangeSkillSlotTestsByRef(int& pass, int& fail)
{
    TestReqGoldenBytes();
    TestAckGoldenBytes();
    TestEventIdsAndErrorCodes();
    TestHandlerBasicFlow();
    TestHandlerDisplacementUnlearned();
    TestHandlerEdgeCases();
    TestSlotBStrictGreater();
    pass += g_pass_cs;
    fail += g_fail_cs;
}
