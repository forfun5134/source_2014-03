// UnitData.cpp — 見 UnitData.h；PUT 順序機讀自 CommonPacket.cpp（2026-11-17）
#include "UnitData.h"
#include "../core/Serializer.h"
#include "WireHelpers.h"
#include <utility>
#include <map>
#include <vector>


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
    if (!x2::detail::PutCountPrefixVec(ks, v.itemSocket, [](Serializer& s2, const int32_t& e) { return s2.Put(e); })) return false;   // vector<int>（SERV_ITEM_OPTION_DATA_SIZE）
    if (!x2::detail::PutCountPrefixVec(ks, v.randomSocket, [](Serializer& s2, const int32_t& e) { return s2.Put(e); })) return false;  // vector<int>（SERV_NEW_ITEM_SYSTEM_2013_05）
    if (!ks.Put(v.itemState)) return false;          // char
    return ks.Put(v.period) && ks.Put(v.expirationDate) && ks.Put(v.expandedSocketNum);  // SERV_BATTLE_FIELD_BOSS
}
bool GetItemInfo(Serializer& ks, ItemInfo& v)
{
    if (!(ks.Get(v.itemID) && ks.Get(v.usageType) && ks.Get(v.quantity) &&
          ks.Get(v.endurance) && ks.Get(v.sealData) && ks.Get(v.enchantLevel))) return false;
    if (!GetItemAttributeEnchantInfo(ks, v.attrib)) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.itemSocket, [](Serializer& s2, int32_t& e) { return s2.Get(e); })) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.randomSocket, [](Serializer& s2, int32_t& e) { return s2.Get(e); })) return false;
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
    if (!x2::detail::PutCountPrefixVec(ks, v.passiveSkill, [](Serializer& s2, const SkillData& e) { return PutSkillData(s2, e); })) return false;       // vector<KSkillData>
    if (!x2::detail::PutCountPrefixVec(ks, v.guildPassiveSkill, [](Serializer& s2, const SkillData& e) { return PutSkillData(s2, e); })) return false;   // GUILD_SKILL_TEST
    if (!x2::detail::PutCountPrefixVec(ks, v.skillNote, [](Serializer& s2, const int32_t& e) { return s2.Put(e); })) return false;                       // SERV_SKILL_NOTE（vector<int>）
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
    if (!x2::detail::GetCountPrefixVec(ks, v.passiveSkill, [](Serializer& s2, SkillData& e) { return GetSkillData(s2, e); })) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.guildPassiveSkill, [](Serializer& s2, SkillData& e) { return GetSkillData(s2, e); })) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.skillNote, [](Serializer& s2, int32_t& e) { return s2.Get(e); })) return false;
    return ks.Get(v.activeSkillPagesNumber) && ks.Get(v.theNumberOfSkillPagesAvailable);
}

bool PutUserSkillData(Serializer& ks, const UserSkillData& v)
{
    return ks.Put(v.skillID) && ks.Put(v.skillLevel) && ks.Put(v.skillCSPoint);
}
bool GetUserSkillData(Serializer& ks, UserSkillData& v)
{
    return ks.Get(v.skillID) && ks.Get(v.skillLevel) && ks.Get(v.skillCSPoint);
}

bool PutUserSkillPageData(Serializer& ks, const UserSkillPageData& v)
{
    for (int i = 0; i < UserSkillPageData::kEquippedSkillSlotCount; ++i)
        if (!PutSkillData(ks, v.equippedSkill[i])) return false;
    for (int i = 0; i < UserSkillPageData::kEquippedSkillSlotCount; ++i)
        if (!PutSkillData(ks, v.equippedSkillSlotB[i])) return false;
    if (!ks.Put(v.usSkillPoint) || !ks.Put(v.usCashSkillPoint)) return false;
    return x2::detail::PutCountPrefixVec(ks, v.userSkillData,
               [](Serializer& s2, const UserSkillData& e) { return PutUserSkillData(s2, e); });
}
bool GetUserSkillPageData(Serializer& ks, UserSkillPageData& v)
{
    for (int i = 0; i < UserSkillPageData::kEquippedSkillSlotCount; ++i)
        if (!GetSkillData(ks, v.equippedSkill[i])) return false;
    for (int i = 0; i < UserSkillPageData::kEquippedSkillSlotCount; ++i)
        if (!GetSkillData(ks, v.equippedSkillSlotB[i])) return false;
    if (!ks.Get(v.usSkillPoint) || !ks.Get(v.usCashSkillPoint)) return false;
    return x2::detail::GetCountPrefixVec(ks, v.userSkillData,
               [](Serializer& s2, UserSkillData& e) { return GetUserSkillData(s2, e); });
}

bool PutSubQuestInstance(Serializer& ks, const SubQuestInstance& v)
{
    return ks.Put(v.iID) && ks.Put(v.ucClearData) && ks.Put(v.bIsSuccess);
}
bool GetSubQuestInstance(Serializer& ks, SubQuestInstance& v)
{
    return ks.Get(v.iID) && ks.Get(v.ucClearData) && ks.Get(v.bIsSuccess);
}

bool PutQuestInstance(Serializer& ks, const QuestInstance& v)
{
    return ks.Put(v.iID) && ks.Put(v.ownerUnitUID) &&
           x2::detail::PutCountPrefixVec(ks, v.subQuests,
               [](Serializer& s2, const SubQuestInstance& e) { return PutSubQuestInstance(s2, e); });
}
bool GetQuestInstance(Serializer& ks, QuestInstance& v)
{
    return ks.Get(v.iID) && ks.Get(v.ownerUnitUID) &&
           x2::detail::GetCountPrefixVec(ks, v.subQuests,
               [](Serializer& s2, SubQuestInstance& e) { return GetSubQuestInstance(s2, e); });
}

bool PutCompleteQuestInfo(Serializer& ks, const CompleteQuestInfo& v)
{
    return ks.Put(v.questID) && ks.Put(v.completeCount) && ks.Put(v.completeDate);
}
bool GetCompleteQuestInfo(Serializer& ks, CompleteQuestInfo& v)
{
    return ks.Get(v.questID) && ks.Get(v.completeCount) && ks.Get(v.completeDate);
}

bool PutRelationshipInfo(Serializer& ks, const RelationshipInfo& v)
{
    return ks.Put(v.relationshipType) && ks.Put(v.otherUnitUID) &&
           ks.Put(v.otherNickName) && ks.Put(v.loveWord) &&
           ks.Put(v.date) && ks.Put(v.lastReward) &&
           ks.Put(v.rewardTitleType);
}
bool GetRelationshipInfo(Serializer& ks, RelationshipInfo& v)
{
    return ks.Get(v.relationshipType) && ks.Get(v.otherUnitUID) &&
           ks.Get(v.otherNickName) && ks.Get(v.loveWord) &&
           ks.Get(v.date) && ks.Get(v.lastReward) &&
           ks.Get(v.rewardTitleType);
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
    return x2::detail::PutCountPrefixVec(ks, v.vecValues, [](Serializer& s2, const float& e) { return s2.Put(e); });   // UINT + vector<float>
}
bool GetBuffBehaviorFactor(Serializer& ks, BuffBehaviorFactor& v)
{
    if (!ks.Get(v.uiType)) return false;
    return x2::detail::GetCountPrefixVec(ks, v.vecValues, [](Serializer& s2, float& e) { return s2.Get(e); });
}

bool PutBuffFinalizerFactor(Serializer& ks, const BuffFinalizerFactor& v)
{
    if (!ks.Put(v.uiType)) return false;
    return x2::detail::PutCountPrefixVec(ks, v.vecValues, [](Serializer& s2, const float& e) { return s2.Put(e); });
}
bool GetBuffFinalizerFactor(Serializer& ks, BuffFinalizerFactor& v)
{
    if (!ks.Get(v.uiType)) return false;
    return x2::detail::GetCountPrefixVec(ks, v.vecValues, [](Serializer& s2, float& e) { return s2.Get(e); });
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
    if (!x2::detail::PutCountPrefixVec(ks, v.vecBuffBehaviorFactors, [](Serializer& s2, const BuffBehaviorFactor& e) { return PutBuffBehaviorFactor(s2, e); })) return false;
    if (!x2::detail::PutCountPrefixVec(ks, v.vecBuffFinalizerFactors, [](Serializer& s2, const BuffFinalizerFactor& e) { return PutBuffFinalizerFactor(s2, e); })) return false;
    if (!PutBuffIdentity(ks, v.identity)) return false;
    return ks.Put(v.accumulationMultiplier) && ks.Put(v.accumulationCountNow) && ks.Put(v.factorID);
}
bool GetBuffFactor(Serializer& ks, BuffFactor& v)
{
    if (!x2::detail::GetCountPrefixVec(ks, v.vecBuffBehaviorFactors, [](Serializer& s2, BuffBehaviorFactor& e) { return GetBuffBehaviorFactor(s2, e); })) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.vecBuffFinalizerFactors, [](Serializer& s2, BuffFinalizerFactor& e) { return GetBuffFinalizerFactor(s2, e); })) return false;
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
    if (!x2::detail::PutCountPrefixVec(ks, v.buffInfo, [](Serializer& s2, const BuffInfo& e) { return PutBuffInfo(s2, e); })) return false;   // SERV_REFORM_THE_GATE_OF_DARKNESS（vector<KBuffInfo>）
    if (!(ks.Put(v.win) && ks.Put(v.lose))) return false;
    if (!x2::detail::PutCountPrefixMap(ks, v.dungeonClear, [](Serializer& s2, const int32_t& e) { return s2.Put(e); }, [](Serializer& s2, const DungeonClearInfo& e) { return PutDungeonClearInfo(s2, e); })) return false;   // map<int,KDungeonClearInfo>
    if (!x2::detail::PutCountPrefixMap(ks, v.tcClear, [](Serializer& s2, const int32_t& e) { return s2.Put(e); }, [](Serializer& s2, const TCClearInfo& e) { return PutTCClearInfo(s2, e); })) return false;                     // map<int,KTCClearInfo>
    if (!x2::detail::PutCountPrefixMap(ks, v.equippedItem, [](Serializer& s2, const int32_t& e) { return s2.Put(e); }, [](Serializer& s2, const InventoryItemInfo& e) { return PutInventoryItemInfo(s2, e); })) return false;    // map<int,KInventoryItemInfo>
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
    if (!x2::detail::GetCountPrefixVec(ks, v.buffInfo, [](Serializer& s2, BuffInfo& e) { return GetBuffInfo(s2, e); })) return false;
    if (!(ks.Get(v.win) && ks.Get(v.lose))) return false;
    if (!x2::detail::GetCountPrefixMap(ks, v.dungeonClear, [](Serializer& s2, int32_t& e) { return s2.Get(e); }, [](Serializer& s2, DungeonClearInfo& e) { return GetDungeonClearInfo(s2, e); })) return false;
    if (!x2::detail::GetCountPrefixMap(ks, v.tcClear, [](Serializer& s2, int32_t& e) { return s2.Get(e); }, [](Serializer& s2, TCClearInfo& e) { return GetTCClearInfo(s2, e); })) return false;
    if (!x2::detail::GetCountPrefixMap(ks, v.equippedItem, [](Serializer& s2, int32_t& e) { return s2.Get(e); }, [](Serializer& s2, InventoryItemInfo& e) { return GetInventoryItemInfo(s2, e); })) return false;
    if (!GetUnitSkillData(ks, v.unitSkillData)) return false;
    if (!(ks.Get(v.isParty) && ks.Get(v.spiritMax) && ks.Get(v.spirit) && ks.Get(v.isGameBang))) return false;
    if (!ks.Get(v.titleID)) return false;
    if (!GetUserGuildInfo(ks, v.userGuildInfo)) return false;
    return ks.Get(v.lastLoginTime);
}

}} // namespace x2::unit
