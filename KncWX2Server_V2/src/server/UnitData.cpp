// UnitData.cpp — 見 UnitData.h；PUT 順序機讀自 CommonPacket.cpp（2026-11-17）
#include "UnitData.h"
#include "../core/Serializer.h"
#include <utility>
#include <map>
#include <vector>


namespace {

template <typename T, typename PutFn>
static bool PutVec(x2::Serializer& ks, const std::vector<T>& v, PutFn&& putOne)
{
    if (!ks.Put(static_cast<uint32_t>(v.size()))) return false;   // DWORD 數量前綴
    for (const auto& e : v) if (!putOne(ks, e)) return false;
    return true;
}

template <typename T, typename GetFn>
static bool GetVec(x2::Serializer& ks, std::vector<T>& v, GetFn&& getOne)
{
    uint32_t n = 0;
    if (!ks.Get(n)) return false;
    if (n > 65536) return false;                                  // 防禦性上限（DoS guard）
    v.clear(); v.reserve(n);
    for (uint32_t i = 0; i < n; ++i) { T e{}; if (!getOne(ks, e)) return false; v.push_back(std::move(e)); }
    return true;
}

template <typename V, typename PutVFn>
static bool PutMap(x2::Serializer& ks, const std::map<int32_t, V>& m, PutVFn&& putV)
{
    if (!ks.Put(static_cast<uint32_t>(m.size()))) return false;
    for (const auto& kv : m) {
        if (!ks.Put(kv.first)) return false;                      // map 元素 = [first][second]，無 tag/wrapper
        if (!putV(ks, kv.second)) return false;
    }
    return true;
}

template <typename V, typename GetVFn>
static bool GetMap(x2::Serializer& ks, std::map<int32_t, V>& m, GetVFn&& getV)
{
    uint32_t n = 0;
    if (!ks.Get(n)) return false;
    if (n > 65536) return false;
    m.clear();
    for (uint32_t i = 0; i < n; ++i) {
        int32_t key = 0;
        if (!ks.Get(key)) return false;
        V val{};
        if (!getV(ks, val)) return false;
        m[key] = std::move(val);
    }
    return true;
}

} // namespace

namespace x2 { namespace unit {

bool PutItemAttributeEnchantInfo(Serializer& ks, const ItemAttributeEnchantInfo& v)
{
    return ks.Put(v.cAttribEnchant0) && ks.Put(v.cAttribEnchant1) && ks.Put(v.cAttribEnchant2);
}
bool GetItemAttributeEnchantInfo(Serializer& ks, ItemAttributeEnchantInfo& v)
{
    return ks.Get(v.cAttribEnchant0) && ks.Get(v.cAttribEnchant1) && ks.Get(v.cAttribEnchant2);
}

bool PutItemInfo(Serializer& ks, const ItemInfo& v)
{
    if (!(ks.Put(v.itemID) && ks.Put(v.usageType) && ks.Put(v.quantity) &&
          ks.Put(v.endurance) && ks.Put(v.sealData) && ks.Put(v.enchantLevel))) return false;
    if (!PutItemAttributeEnchantInfo(ks, v.attrib)) return false;
    if (!PutVec(ks, v.itemSocket, [](Serializer& s2, const int32_t& e) { return s2.Put(e); })) return false;   // vector<int>（SERV_ITEM_OPTION_DATA_SIZE）
    if (!PutVec(ks, v.randomSocket, [](Serializer& s2, const int32_t& e) { return s2.Put(e); })) return false;  // vector<int>（SERV_NEW_ITEM_SYSTEM_2013_05）
    if (!ks.Put(v.itemState)) return false;          // char
    return ks.Put(v.period) && ks.Put(v.expirationDate) && ks.Put(v.expandedSocketNum);  // SERV_BATTLE_FIELD_BOSS
}
bool GetItemInfo(Serializer& ks, ItemInfo& v)
{
    if (!(ks.Get(v.itemID) && ks.Get(v.usageType) && ks.Get(v.quantity) &&
          ks.Get(v.endurance) && ks.Get(v.sealData) && ks.Get(v.enchantLevel))) return false;
    if (!GetItemAttributeEnchantInfo(ks, v.attrib)) return false;
    if (!GetVec(ks, v.itemSocket, [](Serializer& s2, int32_t& e) { return s2.Get(e); })) return false;
    if (!GetVec(ks, v.randomSocket, [](Serializer& s2, int32_t& e) { return s2.Get(e); })) return false;
    if (!ks.Get(v.itemState)) return false;
    return ks.Get(v.period) && ks.Get(v.expirationDate) && ks.Get(v.expandedSocketNum);
}

bool PutInventoryItemInfo(Serializer& ks, const InventoryItemInfo& v)
{
    return ks.Put(v.itemUID) && ks.Put(v.slotCategory) &&
           ks.Put(v.slotID) &&                                // short（SERV_EXPAND_SLOT_ID_DATA_SIZE）
           PutItemInfo(ks, v.itemInfo);
}
bool GetInventoryItemInfo(Serializer& ks, InventoryItemInfo& v)
{
    return ks.Get(v.itemUID) && ks.Get(v.slotCategory) &&
           ks.Get(v.slotID) &&
           GetItemInfo(ks, v.itemInfo);
}

bool PutDungeonClearInfo(Serializer& ks, const DungeonClearInfo& v)
{
    return ks.Put(v.dungeonID) && ks.Put(v.maxScore) && ks.Put(v.maxTotalRank) &&
           ks.Put(v.clearTime) && ks.Put(v.isNew);
}
bool GetDungeonClearInfo(Serializer& ks, DungeonClearInfo& v)
{
    return ks.Get(v.dungeonID) && ks.Get(v.maxScore) && ks.Get(v.maxTotalRank) &&
           ks.Get(v.clearTime) && ks.Get(v.isNew);
}

bool PutTCClearInfo(Serializer& ks, const TCClearInfo& v)
{
    return ks.Put(v.tcid) && ks.Put(v.clearTime) && ks.Put(v.isNew);
}
bool GetTCClearInfo(Serializer& ks, TCClearInfo& v)
{
    return ks.Get(v.tcid) && ks.Get(v.clearTime) && ks.Get(v.isNew);
}

bool PutStat(Serializer& ks, const Stat& v)
{
    return ks.Put(v.baseHP) && ks.Put(v.atkPhysic) && ks.Put(v.atkMagic) &&
           ks.Put(v.defPhysic) && ks.Put(v.defMagic);
}
bool GetStat(Serializer& ks, Stat& v)
{
    return ks.Get(v.baseHP) && ks.Get(v.atkPhysic) && ks.Get(v.atkMagic) &&
           ks.Get(v.defPhysic) && ks.Get(v.defMagic);
}

bool PutSkillData(Serializer& ks, const SkillData& v)
{
    return ks.Put(v.skillID) && ks.Put(v.skillLevel);
}
bool GetSkillData(Serializer& ks, SkillData& v)
{
    return ks.Get(v.skillID) && ks.Get(v.skillLevel);
}

bool PutUnitSkillData(Serializer& ks, const UnitSkillData& v)
{
    for (int i = 0; i < UnitSkillData::kEquippedSkillSlotCount; ++i)
        if (!PutSkillData(ks, v.equippedSkill[i])) return false;
    for (int i = 0; i < UnitSkillData::kEquippedSkillSlotCount; ++i)
        if (!PutSkillData(ks, v.equippedSkillSlotB[i])) return false;
    if (!ks.Put(v.skillSlotBEndDate)) return false;       // wstring
    if (!ks.Put(v.skillSlotBExpirationState)) return false;  // char
    if (!PutVec(ks, v.passiveSkill, [](Serializer& s2, const SkillData& e) { return PutSkillData(s2, e); })) return false;       // vector<KSkillData>
    if (!PutVec(ks, v.guildPassiveSkill, [](Serializer& s2, const SkillData& e) { return PutSkillData(s2, e); })) return false;   // GUILD_SKILL_TEST
    if (!PutVec(ks, v.skillNote, [](Serializer& s2, const int32_t& e) { return s2.Put(e); })) return false;                       // SERV_SKILL_NOTE（vector<int>）
    return ks.Put(v.activeSkillPagesNumber) && ks.Put(v.theNumberOfSkillPagesAvailable);  // SERV_SKILL_PAGE_SYSTEM
}
bool GetUnitSkillData(Serializer& ks, UnitSkillData& v)
{
    for (int i = 0; i < UnitSkillData::kEquippedSkillSlotCount; ++i)
        if (!GetSkillData(ks, v.equippedSkill[i])) return false;
    for (int i = 0; i < UnitSkillData::kEquippedSkillSlotCount; ++i)
        if (!GetSkillData(ks, v.equippedSkillSlotB[i])) return false;
    if (!ks.Get(v.skillSlotBEndDate)) return false;
    if (!ks.Get(v.skillSlotBExpirationState)) return false;
    if (!GetVec(ks, v.passiveSkill, [](Serializer& s2, SkillData& e) { return GetSkillData(s2, e); })) return false;
    if (!GetVec(ks, v.guildPassiveSkill, [](Serializer& s2, SkillData& e) { return GetSkillData(s2, e); })) return false;
    if (!GetVec(ks, v.skillNote, [](Serializer& s2, int32_t& e) { return s2.Get(e); })) return false;
    return ks.Get(v.activeSkillPagesNumber) && ks.Get(v.theNumberOfSkillPagesAvailable);
}

bool PutUserGuildInfo(Serializer& ks, const UserGuildInfo& v)
{
    return ks.Put(v.guildUID) && ks.Put(v.guildName) &&
           ks.Put(v.memberShipGrade) && ks.Put(v.honorPoint);
}
bool GetUserGuildInfo(Serializer& ks, UserGuildInfo& v)
{
    return ks.Get(v.guildUID) && ks.Get(v.guildName) &&
           ks.Get(v.memberShipGrade) && ks.Get(v.honorPoint);
}

bool PutLastPositionInfo(Serializer& ks, const LastPositionInfo& v)
{
    return ks.Put(v.mapID) && ks.Put(v.lastTouchLineIndex) && ks.Put(v.lastPosValue) &&
           ks.Put(v.ignoreLastTouch);                     // SERV_BATTLE_FIELD_BOSS（bool）
}
bool GetLastPositionInfo(Serializer& ks, LastPositionInfo& v)
{
    return ks.Get(v.mapID) && ks.Get(v.lastTouchLineIndex) && ks.Get(v.lastPosValue) &&
           ks.Get(v.ignoreLastTouch);
}

bool PutBuffBehaviorFactor(Serializer& ks, const BuffBehaviorFactor& v)
{
    if (!ks.Put(v.uiType)) return false;
    return PutVec(ks, v.vecValues, [](Serializer& s2, const float& e) { return s2.Put(e); });   // UINT + vector<float>
}
bool GetBuffBehaviorFactor(Serializer& ks, BuffBehaviorFactor& v)
{
    if (!ks.Get(v.uiType)) return false;
    return GetVec(ks, v.vecValues, [](Serializer& s2, float& e) { return s2.Get(e); });
}

bool PutBuffFinalizerFactor(Serializer& ks, const BuffFinalizerFactor& v)
{
    if (!ks.Put(v.uiType)) return false;
    return PutVec(ks, v.vecValues, [](Serializer& s2, const float& e) { return s2.Put(e); });
}
bool GetBuffFinalizerFactor(Serializer& ks, BuffFinalizerFactor& v)
{
    if (!ks.Get(v.uiType)) return false;
    return GetVec(ks, v.vecValues, [](Serializer& s2, float& e) { return s2.Get(e); });
}

bool PutBuffIdentity(Serializer& ks, const BuffIdentity& v)
{
    return ks.Put(v.buffTempletID) && ks.Put(v.uniqueNum);
}
bool GetBuffIdentity(Serializer& ks, BuffIdentity& v)
{
    return ks.Get(v.buffTempletID) && ks.Get(v.uniqueNum);
}

bool PutBuffFactor(Serializer& ks, const BuffFactor& v)
{
    // ⚠ 不寫出 m_uidMesGameUnit / m_bIsMesGameUnitNpc（原碼 PUT 如此）
    if (!PutVec(ks, v.vecBuffBehaviorFactors, [](Serializer& s2, const BuffBehaviorFactor& e) { return PutBuffBehaviorFactor(s2, e); })) return false;
    if (!PutVec(ks, v.vecBuffFinalizerFactors, [](Serializer& s2, const BuffFinalizerFactor& e) { return PutBuffFinalizerFactor(s2, e); })) return false;
    if (!PutBuffIdentity(ks, v.identity)) return false;
    return ks.Put(v.accumulationMultiplier) && ks.Put(v.accumulationCountNow) && ks.Put(v.factorID);
}
bool GetBuffFactor(Serializer& ks, BuffFactor& v)
{
    if (!GetVec(ks, v.vecBuffBehaviorFactors, [](Serializer& s2, BuffBehaviorFactor& e) { return GetBuffBehaviorFactor(s2, e); })) return false;
    if (!GetVec(ks, v.vecBuffFinalizerFactors, [](Serializer& s2, BuffFinalizerFactor& e) { return GetBuffFinalizerFactor(s2, e); })) return false;
    if (!GetBuffIdentity(ks, v.identity)) return false;
    return ks.Get(v.accumulationMultiplier) && ks.Get(v.accumulationCountNow) && ks.Get(v.factorID);
}

bool PutBuffInfo(Serializer& ks, const BuffInfo& v)
{
    return PutBuffFactor(ks, v.factorInfo) &&
           ks.Put(v.buffStartTime) && ks.Put(v.buffEndTime);
}
bool GetBuffInfo(Serializer& ks, BuffInfo& v)
{
    return GetBuffFactor(ks, v.factorInfo) &&
           ks.Get(v.buffStartTime) && ks.Get(v.buffEndTime);
}

bool PutUnitInfo(Serializer& ks, const UnitInfo& v)
{
    if (!(ks.Put(v.ownerUserUID) && ks.Put(v.authLevel) && ks.Put(v.unitUID) &&
          ks.Put(v.knmSerialNum) && ks.Put(v.unitClass) &&
          ks.Put(v.nickName) && ks.Put(v.ip) && ks.Put(v.port) &&
          ks.Put(v.ed) && ks.Put(v.level) && ks.Put(v.exp))) return false;
    // SERV_PVP_NEW_SYSTEM（+ SERV_2012_PVP_SEASON2）
    if (!(ks.Put(v.officialMatchCnt) && ks.Put(v.rating) && ks.Put(v.maxRating) &&
          ks.Put(v.rPoint) && ks.Put(v.aPoint) && ks.Put(v.isWinBeforeMatch))) return false;
    if (!(ks.Put(v.rank) && ks.Put(v.kFactor) && ks.Put(v.isRedistributionUser) &&
          ks.Put(v.pastSeasonWin))) return false;
    // SPoint / CSPoint
    if (!(ks.Put(v.sPoint) && ks.Put(v.csPoint) && ks.Put(v.maxCSPoint) && ks.Put(v.csPointEndDate))) return false;
    if (!(ks.Put(v.nowBaseLevelEXP) && ks.Put(v.nextBaseLevelEXP) && ks.Put(v.straightVictories))) return false;
    if (!PutStat(ks, v.stat)) return false;
    if (!PutStat(ks, v.gameStat)) return false;
    if (!PutLastPositionInfo(ks, v.lastPos)) return false;               // SERV_BATTLE_FIELD_SYSTEM
    if (!PutVec(ks, v.buffInfo, [](Serializer& s2, const BuffInfo& e) { return PutBuffInfo(s2, e); })) return false;   // SERV_REFORM_THE_GATE_OF_DARKNESS（vector<KBuffInfo>）
    if (!(ks.Put(v.win) && ks.Put(v.lose))) return false;
    if (!PutMap(ks, v.dungeonClear, [](Serializer& s2, const DungeonClearInfo& e) { return PutDungeonClearInfo(s2, e); })) return false;   // map<int,KDungeonClearInfo>
    if (!PutMap(ks, v.tcClear, [](Serializer& s2, const TCClearInfo& e) { return PutTCClearInfo(s2, e); })) return false;                     // map<int,KTCClearInfo>
    if (!PutMap(ks, v.equippedItem, [](Serializer& s2, const InventoryItemInfo& e) { return PutInventoryItemInfo(s2, e); })) return false;    // map<int,KInventoryItemInfo>
    if (!PutUnitSkillData(ks, v.unitSkillData)) return false;
    if (!(ks.Put(v.isParty) && ks.Put(v.spiritMax) && ks.Put(v.spirit) && ks.Put(v.isGameBang))) return false;
    if (!ks.Put(v.titleID)) return false;                                // SERV_TITLE_DATA_SIZE（int）
    if (!PutUserGuildInfo(ks, v.userGuildInfo)) return false;            // GUILD_TEST
    return ks.Put(v.lastLoginTime);
}
bool GetUnitInfo(Serializer& ks, UnitInfo& v)
{
    if (!(ks.Get(v.ownerUserUID) && ks.Get(v.authLevel) && ks.Get(v.unitUID) &&
          ks.Get(v.knmSerialNum) && ks.Get(v.unitClass) &&
          ks.Get(v.nickName) && ks.Get(v.ip) && ks.Get(v.port) &&
          ks.Get(v.ed) && ks.Get(v.level) && ks.Get(v.exp))) return false;
    if (!(ks.Get(v.officialMatchCnt) && ks.Get(v.rating) && ks.Get(v.maxRating) &&
          ks.Get(v.rPoint) && ks.Get(v.aPoint) && ks.Get(v.isWinBeforeMatch))) return false;
    if (!(ks.Get(v.rank) && ks.Get(v.kFactor) && ks.Get(v.isRedistributionUser) &&
          ks.Get(v.pastSeasonWin))) return false;
    if (!(ks.Get(v.sPoint) && ks.Get(v.csPoint) && ks.Get(v.maxCSPoint) && ks.Get(v.csPointEndDate))) return false;
    if (!(ks.Get(v.nowBaseLevelEXP) && ks.Get(v.nextBaseLevelEXP) && ks.Get(v.straightVictories))) return false;
    if (!GetStat(ks, v.stat)) return false;
    if (!GetStat(ks, v.gameStat)) return false;
    if (!GetLastPositionInfo(ks, v.lastPos)) return false;
    if (!GetVec(ks, v.buffInfo, [](Serializer& s2, BuffInfo& e) { return GetBuffInfo(s2, e); })) return false;
    if (!(ks.Get(v.win) && ks.Get(v.lose))) return false;
    if (!GetMap(ks, v.dungeonClear, [](Serializer& s2, DungeonClearInfo& e) { return GetDungeonClearInfo(s2, e); })) return false;
    if (!GetMap(ks, v.tcClear, [](Serializer& s2, TCClearInfo& e) { return GetTCClearInfo(s2, e); })) return false;
    if (!GetMap(ks, v.equippedItem, [](Serializer& s2, InventoryItemInfo& e) { return GetInventoryItemInfo(s2, e); })) return false;
    if (!GetUnitSkillData(ks, v.unitSkillData)) return false;
    if (!(ks.Get(v.isParty) && ks.Get(v.spiritMax) && ks.Get(v.spirit) && ks.Get(v.isGameBang))) return false;
    if (!ks.Get(v.titleID)) return false;
    if (!GetUserGuildInfo(ks, v.userGuildInfo)) return false;
    return ks.Get(v.lastLoginTime);
}

}} // namespace x2::unit
