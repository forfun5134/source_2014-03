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

}} // namespace x2::select_unit
