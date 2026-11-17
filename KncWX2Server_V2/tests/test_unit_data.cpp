// tests/test_unit_data.cpp — KUnitInfo 子系列（JP INT_INTERNAL）線路 codec 測試
// 涵蓋：巢狀型別 golden bytes、完整 UnitInfo roundtrip（含 map/vector 容器）、
//      KBuffFactor「不序列化 m_uidMesGameUnit / m_bIsMesGameUnitNpc」的位元組長度證明。
// ⚠ golden bytes 為自洽佈局，未對原 SDK 實機驗證；更換巨集組合會改變佈局。
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>
#include <functional>

#include "../src/core/Serializer.h"
#include "../src/server/UnitData.h"

using namespace x2;
using namespace x2::unit;

void RunUnitDataTestsByRef(int& pass, int& fail);
static int g_pass_ud = 0, g_fail_ud = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_ud++; } \
    else { g_fail_ud++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static SerBuffer Encode(const std::function<bool(Serializer&)>& fn)
{
    Serializer ks;
    SerBuffer buf;
    if (!ks.BeginWriting(&buf)) return SerBuffer{};
    if (!fn(ks)) return SerBuffer{};
    ks.EndWriting();
    return buf;
}

template <typename T>
static bool RoundTrip(const T& in, T& out, const std::function<bool(Serializer&, const T&)>& putter,
                      const std::function<bool(Serializer&, T&)>& getter)
{
    SerBuffer buf = Encode([&](Serializer& ks) { return putter(ks, in); });
    if (buf.GetLength() == 0) return false;
    Serializer ks2;
    SerBuffer tmp = buf;
    if (!ks2.BeginReading(&tmp)) return false;
    if (!getter(ks2, out)) return false;
    ks2.EndReading();
    return true;
}

static void TestGoldenScalars()
{
    {
        Stat v; v.baseHP = 0x01020304; v.atkPhysic = 0x0A0B0C0D; v.atkMagic = 0x11121314;
        v.defPhysic = 0x21222324; v.defMagic = 0x31323334;
        SerBuffer buf = Encode([&](Serializer& ks) { return PutStat(ks, v); });
        static const uint8_t expect[] = {
            0x01,0x02,0x03,0x04, 0x0A,0x0B,0x0C,0x0D, 0x11,0x12,0x13,0x14,
            0x21,0x22,0x23,0x24, 0x31,0x32,0x33,0x34
        };
        CHECK(buf.GetLength() == sizeof(expect), "stat byte length");
        CHECK(std::memcmp(buf.GetData(), expect, sizeof(expect)) == 0, "stat golden bytes");
    }
    {
        SkillData v; v.skillID = 0x0102; v.skillLevel = 0x07;
        SerBuffer buf = Encode([&](Serializer& ks) { return PutSkillData(ks, v); });
        static const uint8_t expect[] = { 0x01, 0x02, 0x07 };
        CHECK(buf.GetLength() == 3, "skilldata byte length");
        CHECK(std::memcmp(buf.GetData(), expect, 3) == 0, "skilldata golden bytes");
    }
    {
        ItemAttributeEnchantInfo v; v.cAttribEnchant0 = 1; v.cAttribEnchant1 = -2; v.cAttribEnchant2 = 100;
        SerBuffer buf = Encode([&](Serializer& ks) { return PutItemAttributeEnchantInfo(ks, v); });
        static const uint8_t expect[] = { 0x01, 0xFE, 0x64 };
        CHECK(buf.GetLength() == 3, "attrib byte length");
        CHECK(std::memcmp(buf.GetData(), expect, 3) == 0, "attrib golden bytes");
    }
}

static void TestGoldenItemInfo()
{
    ItemInfo v;
    v.itemID = 0x01020304;
    v.usageType = 5;
    v.quantity = 7;
    v.endurance = 0x0102;
    v.sealData = 100;
    v.enchantLevel = 3;
    v.attrib = {1, 2, 3};
    v.itemSocket = {0x0A, 0x0B};
    v.randomSocket = {};
    v.itemState = 2;
    v.period = 0x000A;
    v.expirationDate = L"A";              // 2 bytes UTF-16LE
    v.expandedSocketNum = 9;

    SerBuffer buf = Encode([&](Serializer& ks) { return PutItemInfo(ks, v); });
    std::vector<uint8_t> expect = {
        0x01,0x02,0x03,0x04,        // itemID
        0x05,                       // usageType
        0x00,0x00,0x00,0x07,        // quantity
        0x01,0x02,                  // endurance (short BE)
        0x64,                       // sealData
        0x03,                       // enchantLevel
        0x01,0x02,0x03,             // attrib
        0x00,0x00,0x00,0x02,        // itemSocket count = 2
        0x00,0x00,0x00,0x0A, 0x00,0x00,0x00,0x0B,   // itemSocket elems
        0x00,0x00,0x00,0x00,        // randomSocket count = 0
        0x02,                       // itemState
        0x00,0x0A,                  // period (short BE)
        0x00,0x00,0x00,0x02, 0x41,0x00,   // expirationDate = L"A" (DWORD bytes=2 + UTF16LE)
        0x09                        // expandedSocketNum
    };
    CHECK(buf.GetLength() == expect.size(), "iteminfo byte length");
    CHECK(std::memcmp(buf.GetData(), expect.data(), expect.size()) == 0, "iteminfo golden bytes");
}

static void TestBuffFactorWireOmitsUidAndNpc()
{
    BuffInfo v;
    v.factorInfo.vecBuffBehaviorFactors.push_back({0x11223344, {1.5f, -2.25f}});
    v.factorInfo.vecBuffFinalizerFactors.push_back({0x55667788, {3.0f}});
    v.factorInfo.identity = {0x01020304, 0xA1B2C3D4};
    v.factorInfo.accumulationMultiplier = 2.5f;
    v.factorInfo.accumulationCountNow = 7;
    v.factorInfo.factorID = 0x0BADF00D;
    v.buffStartTime = 0x0102030405060708LL;
    v.buffEndTime   = 0x1112131415161718LL;

    SerBuffer buf = Encode([&](Serializer& ks) { return PutBuffInfo(ks, v); });
    std::vector<uint8_t> expect;
    // vecBuffBehaviorFactors: count=1 (DWORD), elem{ uiType DWORD, vector<float> count=2, f32 BE, f32 BE }
    auto putDw = [&expect](uint32_t x) {
        expect.push_back((x >> 24) & 0xFF); expect.push_back((x >> 16) & 0xFF);
        expect.push_back((x >> 8) & 0xFF);  expect.push_back(x & 0xFF);
    };
    auto putF32 = [&expect](float f) {
        uint32_t u; std::memcpy(&u, &f, 4);
        // 主機為小端 → 轉 BE
        expect.push_back((u >> 24) & 0xFF); expect.push_back((u >> 16) & 0xFF);
        expect.push_back((u >> 8) & 0xFF);  expect.push_back(u & 0xFF);
    };
    auto putI64 = [&expect](uint64_t x) {
        for (int i = 7; i >= 0; --i) expect.push_back(static_cast<uint8_t>((x >> (i * 8)) & 0xFF));
    };
    putDw(0x00000001); putDw(0x11223344); putDw(0x00000002); putF32(1.5f); putF32(-2.25f);   // behavior
    putDw(0x00000001); putDw(0x55667788); putDw(0x00000001); putF32(3.0f);                   // finalizer
    putDw(0x01020304); putDw(0xA1B2C3D4);                                                     // identity
    putF32(2.5f);                                                                             // accumulationMultiplier
    expect.push_back(0x07);                                                                   // accumulationCountNow
    putDw(0x0BADF00D);                                                                        // factorID
    putI64(0x0102030405060708LL);                                                             // buffStartTime
    putI64(0x1112131415161718LL);                                                             // buffEndTime

    CHECK(buf.GetLength() == expect.size(), "buffinfo byte length (m_uidMesGameUnit/m_bIsMesGameUnitNpc 未上線)");
    CHECK(std::memcmp(buf.GetData(), expect.data(), expect.size()) == 0, "buffinfo golden bytes");
}

static void TestRoundTrips()
{
    {
        InventoryItemInfo v;
        v.itemUID = 0x1020304050607080LL;
        v.slotCategory = 3;
        v.slotID = 0x0102;
        v.itemInfo.itemID = 0x0BADF00D;
        v.itemInfo.usageType = 1;
        v.itemInfo.quantity = 99;
        v.itemInfo.endurance = 32000;
        v.itemInfo.sealData = 107;
        v.itemInfo.enchantLevel = 12;
        v.itemInfo.attrib = {10, 20, 30};
        v.itemInfo.itemSocket = {1, 2, 3};
        v.itemInfo.randomSocket = {0x7FFFFFFF};
        v.itemInfo.itemState = 1;
        v.itemInfo.period = 30;
        v.itemInfo.expirationDate = L"2026-12-31 00:00:00";
        v.itemInfo.expandedSocketNum = 2;
        InventoryItemInfo out;
        CHECK(RoundTrip<InventoryItemInfo>(v, out,
              [](Serializer& ks, const InventoryItemInfo& x) { return PutInventoryItemInfo(ks, x); },
              [](Serializer& ks, InventoryItemInfo& x) { return GetInventoryItemInfo(ks, x); }), "item roundtrip ok");
        CHECK(out.itemUID == v.itemUID && out.slotID == v.slotID && out.slotCategory == 3, "item scalars rt");
        CHECK(out.itemInfo.itemID == 0x0BADF00D && out.itemInfo.quantity == 99 && out.itemInfo.sealData == 107, "item fields rt");
        CHECK(out.itemInfo.itemSocket == std::vector<int32_t>({1,2,3}), "item socket vec rt");
        CHECK(out.itemInfo.randomSocket == std::vector<int32_t>({0x7FFFFFFF}), "item random socket vec rt");
        CHECK(out.itemInfo.expirationDate == L"2026-12-31 00:00:00", "item expiry rt");
        CHECK(out.itemInfo.expandedSocketNum == 2, "item expandedSocketNum rt");
    }
    {
        UnitSkillData v;
        v.equippedSkill[0] = {10001, 16};
        v.equippedSkill[3] = {10004, 9};
        v.equippedSkillSlotB[0] = {20001, 1};
        v.skillSlotBEndDate = L"2026-01-01 00:00:00";
        v.skillSlotBExpirationState = 2;
        v.passiveSkill = {{static_cast<int16_t>(30001), 5}, {static_cast<int16_t>(30002), 7}};
        v.guildPassiveSkill = {{static_cast<int16_t>(4001), 1}};
        v.skillNote = {11, 22};
        v.activeSkillPagesNumber = 3;
        v.theNumberOfSkillPagesAvailable = 5;
        UnitSkillData out;
        CHECK(RoundTrip<UnitSkillData>(v, out,
              [](Serializer& ks, const UnitSkillData& x) { return PutUnitSkillData(ks, x); },
              [](Serializer& ks, UnitSkillData& x) { return GetUnitSkillData(ks, x); }), "skilldata roundtrip ok");
        CHECK(out.equippedSkill[0].skillID == 10001 && out.equippedSkill[0].skillLevel == 16, "equip[0] rt");
        CHECK(out.equippedSkill[3].skillID == 10004, "equip[3] rt");
        CHECK(out.equippedSkillSlotB[0].skillID == 20001, "slotB rt");
        CHECK(out.skillSlotBExpirationState == 2 && out.activeSkillPagesNumber == 3 && out.theNumberOfSkillPagesAvailable == 5, "skill pages rt");
        CHECK(out.passiveSkill.size() == 2 && out.passiveSkill[1].skillLevel == 7, "passive vec rt");
        CHECK(out.guildPassiveSkill.size() == 1 && out.guildPassiveSkill[0].skillID == 4001, "guild passive vec rt");
        CHECK(out.skillNote == std::vector<int32_t>({11,22}), "skillNote vec rt");
        CHECK(out.skillSlotBEndDate == L"2026-01-01 00:00:00", "slotB end date rt");
    }
    {
        UnitInfo v;
        v.ownerUserUID = 0x1122334455667788LL;
        v.authLevel = 5;
        v.unitUID = 0x7766554433221100LL;
        v.knmSerialNum = 0xDEADBEEF;
        v.unitClass = 1;
        v.nickName = L"瓦雷利亞";
        v.ip = L"203.0.113.5";
        v.port = 6000;
        v.ed = 12345;
        v.level = 77;
        v.exp = 987654;
        v.officialMatchCnt = 12;
        v.rating = 2300;
        v.maxRating = 2500;
        v.rPoint = 111;
        v.aPoint = 222;
        v.isWinBeforeMatch = true;
        v.rank = 3;
        v.kFactor = 24.0f;
        v.isRedistributionUser = true;
        v.pastSeasonWin = 40;
        v.sPoint = 7;
        v.csPoint = 1234;
        v.maxCSPoint = 5000;
        v.csPointEndDate = L"2027-01-01 00:00:00";
        v.nowBaseLevelEXP = 1000;
        v.nextBaseLevelEXP = 2000;
        v.straightVictories = 9;
        v.stat = {100, 20, 30, 40, 50};
        v.gameStat = {110, 21, 31, 41, 51};
        v.lastPos = {201, 7, 30000, true};
        v.buffInfo.push_back({});
        v.buffInfo[0].factorInfo.vecBuffBehaviorFactors.push_back({0xAABBCCDD, {1.0f, 2.0f}});
        v.buffInfo[0].factorInfo.identity = {7, 8};
        v.buffInfo[0].buffStartTime = 100;
        v.buffInfo[0].buffEndTime = 200;
        v.win = 55;
        v.lose = 33;
        v.dungeonClear[1001] = {1001, 99999, 10, L"00:05:00", false};
        v.dungeonClear[1002] = {1002, 88888, 9,  L"00:06:00", true};
        v.tcClear[2001] = {2001, L"00:01:00", false};
        v.equippedItem[1] = {};
        v.equippedItem[1].itemUID = 0x0BADCAFE11223344LL;
        v.equippedItem[1].slotCategory = 1;
        v.equippedItem[1].slotID = 10;
        v.equippedItem[1].itemInfo.itemID = 555;
        v.unitSkillData.equippedSkill[0] = {10001, 16};
        v.unitSkillData.activeSkillPagesNumber = 2;
        v.unitSkillData.theNumberOfSkillPagesAvailable = 4;
        v.isParty = true;
        v.spiritMax = 300;
        v.spirit = 150;
        v.isGameBang = true;
        v.titleID = 1234;
        v.userGuildInfo = {4242, L"星輝騎士團", 2, 7777};
        v.lastLoginTime = L"2026-11-17 08:00:00";

        UnitInfo out;
        CHECK(RoundTrip<UnitInfo>(v, out,
              [](Serializer& ks, const UnitInfo& x) { return PutUnitInfo(ks, x); },
              [](Serializer& ks, UnitInfo& x) { return GetUnitInfo(ks, x); }), "unitinfo roundtrip ok");
        CHECK(out.ownerUserUID == v.ownerUserUID && out.unitUID == v.unitUID, "uids rt");
        CHECK(out.nickName == L"瓦雷利亞" && out.ip == L"203.0.113.5" && out.port == 6000, "nick/ip/port rt");
        CHECK(out.level == 77 && out.exp == 987654 && out.ed == 12345, "level/exp/ed rt");
        CHECK(out.rating == 2300 && out.rank == 3 && out.isRedistributionUser && out.kFactor == 24.0f, "pvp rt");
        CHECK(out.officialMatchCnt == 12 && out.maxRating == 2500 && out.rPoint == 111 && out.aPoint == 222, "pvp misc rt");
        CHECK(out.stat.baseHP == 100 && out.gameStat.defMagic == 51, "stats rt");
        CHECK(out.lastPos.mapID == 201 && out.lastPos.lastPosValue == 30000 && out.lastPos.ignoreLastTouch, "lastpos rt");
        CHECK(out.buffInfo.size() == 1 && out.buffInfo[0].factorInfo.identity.uniqueNum == 8, "buff rt");
        CHECK(out.dungeonClear.size() == 2 && out.dungeonClear[1002].isNew && out.dungeonClear[1001].maxScore == 99999, "dungeon map rt");
        CHECK(out.tcClear.size() == 1 && out.tcClear[2001].clearTime == L"00:01:00", "tc map rt");
        CHECK(out.equippedItem.size() == 1 && out.equippedItem[1].itemInfo.itemID == 555, "equip map rt");
        CHECK(out.equippedItem[1].itemUID == 0x0BADCAFE11223344LL, "equip uid rt");
        CHECK(out.unitSkillData.equippedSkill[0].skillID == 10001 && out.unitSkillData.theNumberOfSkillPagesAvailable == 4, "skill rt");
        CHECK(out.isParty && out.spiritMax == 300 && out.spirit == 150 && out.isGameBang, "flags/spirit rt");
        CHECK(out.titleID == 1234, "titleID rt");
        CHECK(out.userGuildInfo.guildUID == 4242 && out.userGuildInfo.guildName == L"星輝騎士團" && out.userGuildInfo.memberShipGrade == 2, "guild rt");
        CHECK(out.lastLoginTime == L"2026-11-17 08:00:00", "lastLoginTime rt");
    }
}

void RunUnitDataTestsByRef(int& pass, int& fail)
{
    TestGoldenScalars();
    TestGoldenItemInfo();
    TestBuffFactorWireOmitsUidAndNpc();
    TestRoundTrips();
    pass += g_pass_ud;
    fail += g_fail_ud;
}
