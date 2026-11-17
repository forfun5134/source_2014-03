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

bool PutChatBlackListUnit(Serializer& ks, const ChatBlackListUnit& v)
{
    return ks.Put(v.iUnitUID) && ks.Put(v.wstrNickName);
}
bool GetChatBlackListUnit(Serializer& ks, ChatBlackListUnit& v)
{
    return ks.Get(v.iUnitUID) && ks.Get(v.wstrNickName);
}

bool PutDenyOptions(Serializer& ks, const DenyOptions& v)
{
    return ks.Put(v.cDenyFriendShip) && ks.Put(v.cDenyInviteGuild) && ks.Put(v.cDenyParty) &&
           ks.Put(v.cDenyPersonalTrade) && ks.Put(v.cDenyRequestCouple) && ks.Put(v.cDenyInvitePracticePVP);
}
bool GetDenyOptions(Serializer& ks, DenyOptions& v)
{
    return ks.Get(v.cDenyFriendShip) && ks.Get(v.cDenyInviteGuild) && ks.Get(v.cDenyParty) &&
           ks.Get(v.cDenyPersonalTrade) && ks.Get(v.cDenyRequestCouple) && ks.Get(v.cDenyInvitePracticePVP);
}

bool PutTutorialUnitInfo(Serializer& ks, const TutorialUnitInfo& v)
{
    return ks.Put(v.iUnitUID) && ks.Put(v.ucLevel) && ks.Put(v.wstrNickName) && ks.Put(v.bIsOnline);
}
bool GetTutorialUnitInfo(Serializer& ks, TutorialUnitInfo& v)
{
    return ks.Get(v.iUnitUID) && ks.Get(v.ucLevel) && ks.Get(v.wstrNickName) && ks.Get(v.bIsOnline);
}

bool PutTutorialDBUnitInfo(Serializer& ks, const TutorialDBUnitInfo& v)
{
    return PutTutorialUnitInfo(ks, v.kTutorialUnitInfo) && ks.Put(v.wstrLastDate);
}
bool GetTutorialDBUnitInfo(Serializer& ks, TutorialDBUnitInfo& v)
{
    return GetTutorialUnitInfo(ks, v.kTutorialUnitInfo) && ks.Get(v.wstrLastDate);
}

bool PutConnectTimeEventInfo(Serializer& ks, const ConnectTimeEventInfo& v)
{
    return ks.Put(v.iEventUID) && ks.Put(v.wstrEventTime) && ks.Put(v.bAccountEvent);
}
bool GetConnectTimeEventInfo(Serializer& ks, ConnectTimeEventInfo& v)
{
    return ks.Get(v.iEventUID) && ks.Get(v.wstrEventTime) && ks.Get(v.bAccountEvent);
}

bool PutCumulativeTimeEventInfo(Serializer& ks, const CumulativeTimeEventInfo& v)
{
    return ks.Put(v.iEventUID) && ks.Put(v.iCumulativeTime) && ks.Put(v.bAccountEvent);
}
bool GetCumulativeTimeEventInfo(Serializer& ks, CumulativeTimeEventInfo& v)
{
    return ks.Get(v.iEventUID) && ks.Get(v.iCumulativeTime) && ks.Get(v.bAccountEvent);
}

bool PutHenirRankingInfo(Serializer& ks, const HenirRankingInfo& v)
{
    return ks.Put(v.iRank) && ks.Put(v.iStageCount) && ks.Put(v.ulPlayTime) && ks.Put(v.tRegDate) &&
           ks.Put(v.iUnitUID) && ks.Put(v.wstrNickName) && ks.Put(v.cUnitClass) && ks.Put(v.ucLevel);
}
bool GetHenirRankingInfo(Serializer& ks, HenirRankingInfo& v)
{
    return ks.Get(v.iRank) && ks.Get(v.iStageCount) && ks.Get(v.ulPlayTime) && ks.Get(v.tRegDate) &&
           ks.Get(v.iUnitUID) && ks.Get(v.wstrNickName) && ks.Get(v.cUnitClass) && ks.Get(v.ucLevel);
}

bool PutFriendInfo(Serializer& ks, const FriendInfo& v)
{
    return ks.Put(v.iUnitUID) && ks.Put(v.wstrNickName) && ks.Put(v.cGroupID) && ks.Put(v.cStatus) && ks.Put(v.cPosition);
}
bool GetFriendInfo(Serializer& ks, FriendInfo& v)
{
    return ks.Get(v.iUnitUID) && ks.Get(v.wstrNickName) && ks.Get(v.cGroupID) && ks.Get(v.cStatus) && ks.Get(v.cPosition);
}

bool PutFriendMessageInfo(Serializer& ks, const FriendMessageInfo& v)
{
    return ks.Put(v.iUnitUID) && ks.Put(v.wstrNickName) && ks.Put(v.cMessageType) &&
           ks.Put(v.wstrMessage) && ks.Put(v.wstrRegDate);
}
bool GetFriendMessageInfo(Serializer& ks, FriendMessageInfo& v)
{
    return ks.Get(v.iUnitUID) && ks.Get(v.wstrNickName) && ks.Get(v.cMessageType) &&
           ks.Get(v.wstrMessage) && ks.Get(v.wstrRegDate);
}

bool PutMessengerInfo(Serializer& ks, const MessengerInfo& v)
{
    if (!x2::detail::PutCountPrefixMap(ks, v.mapFriendInfo,
            [](Serializer& s2, const int64_t& e) { return s2.Put(e); },
            [](Serializer& s2, const FriendInfo& e) { return PutFriendInfo(s2, e); })) return false;
    if (!x2::detail::PutCountPrefixMap(ks, v.mapGroup,
            [](Serializer& s2, const int8_t& e) { return s2.Put(e); },
            [](Serializer& s2, const std::wstring& e) { return s2.Put(e); })) return false;
    return x2::detail::PutCountPrefixVec(ks, v.vecFriendMessageInfo,
               [](Serializer& s2, const FriendMessageInfo& e) { return PutFriendMessageInfo(s2, e); });
}
bool GetMessengerInfo(Serializer& ks, MessengerInfo& v)
{
    if (!x2::detail::GetCountPrefixMap(ks, v.mapFriendInfo,
            [](Serializer& s2, int64_t& e) { return s2.Get(e); },
            [](Serializer& s2, FriendInfo& e) { return GetFriendInfo(s2, e); })) return false;
    if (!x2::detail::GetCountPrefixMap(ks, v.mapGroup,
            [](Serializer& s2, int8_t& e) { return s2.Get(e); },
            [](Serializer& s2, std::wstring& e) { return s2.Get(e); })) return false;
    return x2::detail::GetCountPrefixVec(ks, v.vecFriendMessageInfo,
               [](Serializer& s2, FriendMessageInfo& e) { return GetFriendMessageInfo(s2, e); });
}

bool PutGamePlayStatus(Serializer& ks, const GamePlayStatus& v)
{
    if (!ks.Put(v.iMaxHP) || !ks.Put(v.iCurHP) || !ks.Put(v.iMaxMP) || !ks.Put(v.iCurMP)) return false;
    if (!ks.Put(v.iCurHyperGage) || !ks.Put(v.cCurHyperCount) || !ks.Put(v.cCharAbilType)) return false;
    if (!ks.Put(v.iCharAbilCount)) return false;
    {
        const std::map<int32_t,int32_t>& m = v.mapSkillCoolTime;
        if (!x2::detail::PutCountPrefixMap(ks, m,
                [](Serializer& s2, const int32_t& e) { return s2.Put(e); },
                [](Serializer& s2, const int32_t& e) { return s2.Put(e); })) return false;
    }
    if (!x2::detail::PutCountPrefixMap(ks, v.mapQuickSlotCoolTime,
            [](Serializer& s2, const int32_t& e) { return s2.Put(e); },
            [](Serializer& s2, const int32_t& e) { return s2.Put(e); })) return false;
    if (!ks.Put(static_cast<uint32_t>(v.mapPetMP.size()))) return false;   // set<int>：SDK SerSet 行為＝計數+元素
    for (int32_t e : v.mapPetMP) if (!ks.Put(e)) return false;
    return x2::detail::PutCountPrefixMap(ks, v.mapRidingPetCoolTime,
            [](Serializer& s2, const int32_t& e) { return s2.Put(e); },
            [](Serializer& s2, const int32_t& e) { return s2.Put(e); });
}
bool GetGamePlayStatus(Serializer& ks, GamePlayStatus& v)
{
    if (!ks.Get(v.iMaxHP) || !ks.Get(v.iCurHP) || !ks.Get(v.iMaxMP) || !ks.Get(v.iCurMP)) return false;
    if (!ks.Get(v.iCurHyperGage) || !ks.Get(v.cCurHyperCount) || !ks.Get(v.cCharAbilType)) return false;
    if (!ks.Get(v.iCharAbilCount)) return false;
    if (!x2::detail::GetCountPrefixMap(ks, v.mapSkillCoolTime,
            [](Serializer& s2, int32_t& e) { return s2.Get(e); },
            [](Serializer& s2, int32_t& e) { return s2.Get(e); })) return false;
    if (!x2::detail::GetCountPrefixMap(ks, v.mapQuickSlotCoolTime,
            [](Serializer& s2, int32_t& e) { return s2.Get(e); },
            [](Serializer& s2, int32_t& e) { return s2.Get(e); })) return false;
    {
        uint32_t n = 0;
        if (!ks.Get(n)) return false;
        if (n > 65536) return false;
        v.mapPetMP.clear();
        for (uint32_t i = 0; i < n; ++i) {
            int32_t e = 0;
            if (!ks.Get(e)) return false;
            v.mapPetMP.insert(e);
        }
    }
    return x2::detail::GetCountPrefixMap(ks, v.mapRidingPetCoolTime,
            [](Serializer& s2, int32_t& e) { return s2.Get(e); },
            [](Serializer& s2, int32_t& e) { return s2.Get(e); });
}

bool PutGamePlayStatusContainer(Serializer& ks, const GamePlayStatusContainer& v)
{
    return x2::detail::PutCountPrefixVec(ks, v.vecGamePlayStatus,
               [](Serializer& s2, const GamePlayStatus& e) { return PutGamePlayStatus(s2, e); });
}
bool GetGamePlayStatusContainer(Serializer& ks, GamePlayStatusContainer& v)
{
    return x2::detail::GetCountPrefixVec(ks, v.vecGamePlayStatus,
               [](Serializer& s2, GamePlayStatus& e) { return GetGamePlayStatus(s2, e); });
}

bool PutSubMissionInstance(Serializer& ks, const SubMissionInstance& v)
{
    return ks.Put(v.iID) && ks.Put(v.sClearData) && ks.Put(v.bIsSuccess);
}
bool GetSubMissionInstance(Serializer& ks, SubMissionInstance& v)
{
    return ks.Get(v.iID) && ks.Get(v.sClearData) && ks.Get(v.bIsSuccess);
}

bool PutMissionInstance(Serializer& ks, const MissionInstance& v)
{
    if (!ks.Put(v.iID)) return false;
    return x2::detail::PutCountPrefixVec(ks, v.subMissionInstances,
               [](Serializer& s2, const SubMissionInstance& e) { return PutSubMissionInstance(s2, e); });
}
bool GetMissionInstance(Serializer& ks, MissionInstance& v)
{
    if (!ks.Get(v.iID)) return false;
    return x2::detail::GetCountPrefixVec(ks, v.subMissionInstances,
               [](Serializer& s2, SubMissionInstance& e) { return GetSubMissionInstance(s2, e); });
}

bool PutTitleInfo(Serializer& ks, const TitleInfo& v)
{
    return ks.Put(v.iTitleID) && ks.Put(v.wstrEndDate) && ks.Put(v.kCTime) && ks.Put(v.bInfinity);
}
bool GetTitleInfo(Serializer& ks, TitleInfo& v)
{
    return ks.Get(v.iTitleID) && ks.Get(v.wstrEndDate) && ks.Get(v.kCTime) && ks.Get(v.bInfinity);
}

bool PutPetInfo(Serializer& ks, const PetInfo& v)
{
    return ks.Put(v.iPetUID) && ks.Put(v.iPetID) && ks.Put(v.wstrPetName) &&
           ks.Put(v.cEvolutionStep) && ks.Put(v.sSatiety) && ks.Put(v.iIntimacy) &&
           ks.Put(v.sExtroversion) && ks.Put(v.sEmotion) && ks.Put(v.bAutoFeed) &&
           ks.Put(v.wstrLastFeedDate) && ks.Put(v.wstrLastSummonDate) && ks.Put(v.wstrRegDate) &&
           ks.Put(v.bAutoLooting);
}
bool GetPetInfo(Serializer& ks, PetInfo& v)
{
    return ks.Get(v.iPetUID) && ks.Get(v.iPetID) && ks.Get(v.wstrPetName) &&
           ks.Get(v.cEvolutionStep) && ks.Get(v.sSatiety) && ks.Get(v.iIntimacy) &&
           ks.Get(v.sExtroversion) && ks.Get(v.sEmotion) && ks.Get(v.bAutoFeed) &&
           ks.Get(v.wstrLastFeedDate) && ks.Get(v.wstrLastSummonDate) && ks.Get(v.wstrRegDate) &&
           ks.Get(v.bAutoLooting);
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
