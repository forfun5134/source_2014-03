// SelectUnitProtocol.cpp — 見 SelectUnitProtocol.h 的對照說明
#include "SelectUnitProtocol.h"
#include "../core/Serializer.h"
#include "WireHelpers.h"

namespace x2 { namespace select_unit {

bool PutSelectUnitReq(Serializer& ks, const SelectUnitReq& v)
{
    return ks.Put(static_cast<int64_t>(v.unitUID));
}
bool GetSelectUnitReq(Serializer& ks, SelectUnitReq& v)
{
    return ks.Get(v.unitUID);
}

bool PutSelectUnitAck(Serializer& ks, const SelectUnitAck& v)
{
    return ks.Put(v.iOK);
}
bool GetSelectUnitAck(Serializer& ks, SelectUnitAck& v)
{
    return ks.Get(v.iOK);
}

bool PutSelectUnitNot1(Serializer& ks, const SelectUnitNot1& v)
{
    if (!ks.Put(v.iOK)) return false;
    if (!unit::PutUnitInfo(ks, v.unitInfo)) return false;
    if (!ks.Put(v.unitCreateDate)) return false;              // SERV_CHAR_LOG
    if (!ks.Put(v.realDataED)) return false;                  // SERV_LOGOUT_ED_CHECK
    if (!ks.Put(v.unitLastLoginDate)) return false;           // SERV_DAILY_CHAR_FIRST_SELECT
    if (!x2::detail::PutCountPrefixMap(ks, v.inventorySlotSize,
            [](Serializer& s2, const int32_t& e) { return s2.Put(e); },
            [](Serializer& s2, const int32_t& e) { return s2.Put(e); })) return false;   // map<int,int>
    if (!x2::detail::PutCountPrefixMap(ks, v.items,
            [](Serializer& s2, const int64_t& e) { return s2.Put(e); },
            [](Serializer& s2, const unit::InventoryItemInfo& e) { return unit::PutInventoryItemInfo(s2, e); })) return false;   // map<UidType,…>
    if (!ks.Put(v.numResurrectionStone)) return false;
    if (!ks.Put(v.numAutoPaymentResStone)) return false;      // AP_RESTONE
    if (!ks.Put(v.autoPayResStoneLastDate)) return false;     // AP_RESTONE
    if (!x2::detail::PutCountPrefixVec(ks, v.vecUserSkillPageData,
            [](Serializer& s2, const unit::UserSkillPageData& e) { return unit::PutUserSkillPageData(s2, e); })) return false;
    if (!x2::detail::PutCountPrefixVec(ks, v.vecSkillUnsealed,
            [](Serializer& s2, const int16_t& e) { return s2.Put(e); })) return false;   // vector<short>
    if (!ks.Put(v.skillNoteMaxPageNum)) return false;         // SERV_SKILL_NOTE（char）
    if (!x2::detail::PutCountPrefixMap(ks, v.mapSkillNote,
            [](Serializer& s2, const int8_t& e) { return s2.Put(e); },
            [](Serializer& s2, const int32_t& e) { return s2.Put(e); })) return false;   // map<char,int>
    return unit::PutRelationshipInfo(ks, v.relationshipInfo); // SERV_RELATIONSHIP_SYSTEM
}
bool GetSelectUnitNot1(Serializer& ks, SelectUnitNot1& v)
{
    if (!ks.Get(v.iOK)) return false;
    if (!unit::GetUnitInfo(ks, v.unitInfo)) return false;
    if (!ks.Get(v.unitCreateDate)) return false;
    if (!ks.Get(v.realDataED)) return false;
    if (!ks.Get(v.unitLastLoginDate)) return false;
    if (!x2::detail::GetCountPrefixMap(ks, v.inventorySlotSize,
            [](Serializer& s2, int32_t& e) { return s2.Get(e); },
            [](Serializer& s2, int32_t& e) { return s2.Get(e); })) return false;
    if (!x2::detail::GetCountPrefixMap(ks, v.items,
            [](Serializer& s2, int64_t& e) { return s2.Get(e); },
            [](Serializer& s2, unit::InventoryItemInfo& e) { return unit::GetInventoryItemInfo(s2, e); })) return false;
    if (!ks.Get(v.numResurrectionStone)) return false;
    if (!ks.Get(v.numAutoPaymentResStone)) return false;
    if (!ks.Get(v.autoPayResStoneLastDate)) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.vecUserSkillPageData,
            [](Serializer& s2, unit::UserSkillPageData& e) { return unit::GetUserSkillPageData(s2, e); })) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.vecSkillUnsealed,
            [](Serializer& s2, int16_t& e) { return s2.Get(e); })) return false;
    if (!ks.Get(v.skillNoteMaxPageNum)) return false;
    if (!x2::detail::GetCountPrefixMap(ks, v.mapSkillNote,
            [](Serializer& s2, int8_t& e) { return s2.Get(e); },
            [](Serializer& s2, int32_t& e) { return s2.Get(e); })) return false;
    return unit::GetRelationshipInfo(ks, v.relationshipInfo);
}

bool PutSelectUnitNot2(Serializer& ks, const SelectUnitNot2& v)
{
    if (!ks.Put(v.iOK)) return false;
    if (!x2::detail::PutCountPrefixVec(ks, v.vecQuest,
            [](Serializer& s2, const unit::QuestInstance& e) { return unit::PutQuestInstance(s2, e); })) return false;
    if (!x2::detail::PutCountPrefixVec(ks, v.vecCompletQuest,
            [](Serializer& s2, const unit::CompleteQuestInfo& e) { return unit::PutCompleteQuestInfo(s2, e); })) return false;
    return x2::detail::PutCountPrefixMap(ks, v.mapRandomQuestList,
            [](Serializer& s2, const int32_t& e) { return s2.Put(e); },
            [](Serializer& s2, const int32_t& e) { return s2.Put(e); });   // map<int,int>
}
bool GetSelectUnitNot2(Serializer& ks, SelectUnitNot2& v)
{
    if (!ks.Get(v.iOK)) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.vecQuest,
            [](Serializer& s2, unit::QuestInstance& e) { return unit::GetQuestInstance(s2, e); })) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.vecCompletQuest,
            [](Serializer& s2, unit::CompleteQuestInfo& e) { return unit::GetCompleteQuestInfo(s2, e); })) return false;
    return x2::detail::GetCountPrefixMap(ks, v.mapRandomQuestList,
            [](Serializer& s2, int32_t& e) { return s2.Get(e); },
            [](Serializer& s2, int32_t& e) { return s2.Get(e); });
}

bool PutSelectUnitNot3(Serializer& ks, const SelectUnitNot3& v)
{
    if (!ks.Put(v.iOK)) return false;
    if (!x2::detail::PutCountPrefixVec(ks, v.vecMission,
            [](Serializer& s2, const unit::MissionInstance& e) { return unit::PutMissionInstance(s2, e); })) return false;
    if (!x2::detail::PutCountPrefixVec(ks, v.vecTitle,
            [](Serializer& s2, const unit::TitleInfo& e) { return unit::PutTitleInfo(s2, e); })) return false;
    if (!ks.Put(v.iSummonedPetUID)) return false;
    if (!x2::detail::PutCountPrefixVec(ks, v.vecPetList,
            [](Serializer& s2, const unit::PetInfo& e) { return unit::PutPetInfo(s2, e); })) return false;
    if (!x2::detail::PutCountPrefixVec(ks, v.vecCanEvolutionPetList,
            [](Serializer& s2, const int64_t& e) { return s2.Put(e); })) return false;
    if (!x2::detail::PutCountPrefixVec(ks, v.vecNeverSummonPetList,
            [](Serializer& s2, const int64_t& e) { return s2.Put(e); })) return false;
    return x2::detail::PutCountPrefixMap(ks, v.mapPetItem,
            [](Serializer& s2, const int64_t& e) { return s2.Put(e); },
            [](Serializer& s2, const std::map<int64_t, unit::InventoryItemInfo>& inner) {
                return x2::detail::PutCountPrefixMap(s2, inner,
                    [](Serializer& s3, const int64_t& e) { return s3.Put(e); },
                    [](Serializer& s3, const unit::InventoryItemInfo& e) { return unit::PutInventoryItemInfo(s3, e); });
            });
}
bool GetSelectUnitNot3(Serializer& ks, SelectUnitNot3& v)
{
    if (!ks.Get(v.iOK)) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.vecMission,
            [](Serializer& s2, unit::MissionInstance& e) { return unit::GetMissionInstance(s2, e); })) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.vecTitle,
            [](Serializer& s2, unit::TitleInfo& e) { return unit::GetTitleInfo(s2, e); })) return false;
    if (!ks.Get(v.iSummonedPetUID)) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.vecPetList,
            [](Serializer& s2, unit::PetInfo& e) { return unit::GetPetInfo(s2, e); })) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.vecCanEvolutionPetList,
            [](Serializer& s2, int64_t& e) { return s2.Get(e); })) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.vecNeverSummonPetList,
            [](Serializer& s2, int64_t& e) { return s2.Get(e); })) return false;
    return x2::detail::GetCountPrefixMap(ks, v.mapPetItem,
            [](Serializer& s2, int64_t& e) { return s2.Get(e); },
            [](Serializer& s2, std::map<int64_t, unit::InventoryItemInfo>& inner) {
                return x2::detail::GetCountPrefixMap(s2, inner,
                    [](Serializer& s3, int64_t& e) { return s3.Get(e); },
                    [](Serializer& s3, unit::InventoryItemInfo& e) { return unit::GetInventoryItemInfo(s3, e); });
            });
}

bool PutSelectUnitNot4(Serializer& ks, const SelectUnitNot4& v)
{
    if (!ks.Put(v.iOK)) return false;
    if (!x2::detail::PutCountPrefixVec(ks, v.vecChatBlackList,
            [](Serializer& s2, const unit::ChatBlackListUnit& e) { return unit::PutChatBlackListUnit(s2, e); })) return false;
    if (!unit::PutDenyOptions(ks, v.kDenyOptions)) return false;
    if (!ks.Put(v.bIsRecommend)) return false;
    if (!ks.Put(v.iRecommendUnitUID)) return false;
    if (!x2::detail::PutCountPrefixVec(ks, v.vecTutorialDBUnitInfo,
            [](Serializer& s2, const unit::TutorialDBUnitInfo& e) { return unit::PutTutorialDBUnitInfo(s2, e); })) return false;
    if (!x2::detail::PutCountPrefixVec(ks, v.vecConnectTimeEvent,
            [](Serializer& s2, const unit::ConnectTimeEventInfo& e) { return unit::PutConnectTimeEventInfo(s2, e); })) return false;
    if (!x2::detail::PutCountPrefixVec(ks, v.vecCumulativeTimeEvent,
            [](Serializer& s2, const unit::CumulativeTimeEventInfo& e) { return unit::PutCumulativeTimeEventInfo(s2, e); })) return false;
    if (!x2::detail::PutCountPrefixVec(ks, v.vecHenirRanking,
            [](Serializer& s2, const unit::HenirRankingInfo& e) { return unit::PutHenirRankingInfo(s2, e); })) return false;
    if (!unit::PutMessengerInfo(ks, v.kMessengerInfo)) return false;
    return unit::PutGamePlayStatusContainer(ks, v.kGamePlayStatus);
}
bool GetSelectUnitNot4(Serializer& ks, SelectUnitNot4& v)
{
    if (!ks.Get(v.iOK)) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.vecChatBlackList,
            [](Serializer& s2, unit::ChatBlackListUnit& e) { return unit::GetChatBlackListUnit(s2, e); })) return false;
    if (!unit::GetDenyOptions(ks, v.kDenyOptions)) return false;
    if (!ks.Get(v.bIsRecommend)) return false;
    if (!ks.Get(v.iRecommendUnitUID)) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.vecTutorialDBUnitInfo,
            [](Serializer& s2, unit::TutorialDBUnitInfo& e) { return unit::GetTutorialDBUnitInfo(s2, e); })) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.vecConnectTimeEvent,
            [](Serializer& s2, unit::ConnectTimeEventInfo& e) { return unit::GetConnectTimeEventInfo(s2, e); })) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.vecCumulativeTimeEvent,
            [](Serializer& s2, unit::CumulativeTimeEventInfo& e) { return unit::GetCumulativeTimeEventInfo(s2, e); })) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.vecHenirRanking,
            [](Serializer& s2, unit::HenirRankingInfo& e) { return unit::GetHenirRankingInfo(s2, e); })) return false;
    if (!unit::GetMessengerInfo(ks, v.kMessengerInfo)) return false;
    return unit::GetGamePlayStatusContainer(ks, v.kGamePlayStatus);
}

bool PutSelectUnitNot5(Serializer& ks, const SelectUnitNot5& v)
{
    if (!ks.Put(v.iOK)) return false;
    if (!ks.Put(v.bIsSpiritUpdated)) return false;
    if (!x2::detail::PutCountPrefixMap(ks, v.mapCharGameCount,
            [](Serializer& s2, const int32_t& e) { return s2.Put(e); },
            [](Serializer& s2, const int32_t& e) { return s2.Put(e); })) return false;
    if (!unit::PutUserPShopAgencyInfo(ks, v.kPShopAgencyInfo)) return false;
    if (!unit::PutHenirRewardCountNot(ks, v.packetHenirRewardCount)) return false;
    if (!ks.Put(v.bCashShopOpen)) return false;
    if (!ks.Put(v.bFirstSelect)) return false;
    return ks.Put(v.bLocalRankingUser);
}
bool GetSelectUnitNot5(Serializer& ks, SelectUnitNot5& v)
{
    if (!ks.Get(v.iOK)) return false;
    if (!ks.Get(v.bIsSpiritUpdated)) return false;
    if (!x2::detail::GetCountPrefixMap(ks, v.mapCharGameCount,
            [](Serializer& s2, int32_t& e) { return s2.Get(e); },
            [](Serializer& s2, int32_t& e) { return s2.Get(e); })) return false;
    if (!unit::GetUserPShopAgencyInfo(ks, v.kPShopAgencyInfo)) return false;
    if (!unit::GetHenirRewardCountNot(ks, v.packetHenirRewardCount)) return false;
    if (!ks.Get(v.bCashShopOpen)) return false;
    if (!ks.Get(v.bFirstSelect)) return false;
    return ks.Get(v.bLocalRankingUser);
}

bool PutGetMyInventoryReq(Serializer& ks, const GetMyInventoryReq& /*v*/)
{
    (void)ks;
    return true;   // 原 NOPARAM：無欄位；BeginWriting/EndWriting 即構成合法空 payload
}
bool GetGetMyInventoryReq(Serializer& ks, GetMyInventoryReq& /*v*/)
{
    (void)ks;
    return true;
}

bool PutGetMyInventoryAck(Serializer& ks, const GetMyInventoryAck& v)
{
    return ks.Put(v.iOK) && ks.Put(v.bIsRecommend);
}
bool GetGetMyInventoryAck(Serializer& ks, GetMyInventoryAck& v)
{
    return ks.Get(v.iOK) && ks.Get(v.bIsRecommend);
}

bool PutSelectUnitInventoryInfoNot(Serializer& ks, const SelectUnitInventoryInfoNot& v)
{
    if (!ks.Put(v.iSlotCategory)) return false;
    return x2::detail::PutCountPrefixMap(ks, v.mapItem,
            [](Serializer& s2, const int64_t& e) { return s2.Put(e); },
            [](Serializer& s2, const unit::InventoryItemInfo& e) { return unit::PutInventoryItemInfo(s2, e); });
}
bool GetSelectUnitInventoryInfoNot(Serializer& ks, SelectUnitInventoryInfoNot& v)
{
    if (!ks.Get(v.iSlotCategory)) return false;
    return x2::detail::GetCountPrefixMap(ks, v.mapItem,
            [](Serializer& s2, int64_t& e) { return s2.Get(e); },
            [](Serializer& s2, unit::InventoryItemInfo& e) { return unit::GetInventoryItemInfo(s2, e); });
}

}} // namespace x2::select_unit
