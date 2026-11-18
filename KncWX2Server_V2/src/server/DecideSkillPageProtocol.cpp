// DecideSkillPageProtocol.cpp — §0a27 EGS_DECIDE_TO_USE_THIS_SKILL_PAGE_REQ/ACK
#include "DecideSkillPageProtocol.h"

#include "../core/NetError.h"
#include "../core/Serializer.h"

namespace x2 { namespace decide_skill_page {

bool PutDecideSkillPageReq(Serializer& ks, const DecideSkillPageReq& v) { return ks.Put(v.iSkillPagesNumberDecidedToUse); }
bool GetDecideSkillPageReq(Serializer& ks, DecideSkillPageReq& v) { return ks.Get(v.iSkillPagesNumberDecidedToUse); }
bool PutDecideSkillPageAck(Serializer& ks, const DecideSkillPageAck& v)
{
    return ks.Put(v.iOK) && ks.Put(v.iSkillPagesNumberDecidedToUse) &&
           ks.Put(v.iSPointAvailable) && ks.Put(v.iCSPointAvailable) &&
           unit::PutUserSkillPageData(ks, v.kUserSkillPageData);
}
bool GetDecideSkillPageAck(Serializer& ks, DecideSkillPageAck& v)
{
    return ks.Get(v.iOK) && ks.Get(v.iSkillPagesNumberDecidedToUse) &&
           ks.Get(v.iSPointAvailable) && ks.Get(v.iCSPointAvailable) &&
           unit::GetUserSkillPageData(ks, v.kUserSkillPageData);
}

namespace {
int16_t ClampShort(int32_t value)
{
    if (value <= 0) return 0;
    if (value > 32767) return 32767;
    return static_cast<int16_t>(value);
}
uint8_t ClampUchar(int32_t value)
{
    if (value <= 0) return 0;
    if (value > 255) return 255;
    return static_cast<uint8_t>(value);
}
int32_t LevelOf(const db::SkillPageState& state, int32_t skillID, int32_t page)
{
    for (const auto& skill : state.skills)
        if (skill.skillID == skillID && skill.skillPageNumber == page) return skill.skillLevel;
    return 0;
}
} // namespace

int32_t HandleDecideSkillPageReq(db::GameStore& gameDb, int64_t unitUID,
                                 const DecideSkillPageReq& req,
                                 DecideSkillPageAck& ack,
                                 std::string& err)
{
    ack = DecideSkillPageAck{};
    err.clear();
    if (unitUID <= 0) {
        ack.iOK = ERR_ODBC_01;
        err = "invalid unit uid";
        return ack.iOK;
    }

    // Pre-read for page availability and ACK snapshot. The write repeats count/existence checks in its transaction.
    db::SkillPageState state;
    if (!gameDb.LoadSkillPageState(unitUID, state, err)) {
        err = std::string("load skill page state: ") + err;
        ack.iOK = ERR_ODBC_01;
        return ack.iOK;
    }
    if (req.iSkillPagesNumberDecidedToUse < 1 ||
        req.iSkillPagesNumberDecidedToUse > state.pagesAvailable) {
        ack.iOK = ERR_SKILL_PAGE_03;
        err.clear();
        return ack.iOK;
    }

    // Read balances before mutation so a read failure cannot leave a committed page switch with an error ACK.
    db::GUnitRecord unit{};
    bool found = false;
    if (!gameDb.GetUnitByUID(unitUID, unit, found, err) || !found || unit.deleted) {
        if (err.empty()) err = "unit not found";
        ack.iOK = ERR_ODBC_01;
        return ack.iOK;
    }
    db::CashSkillPointValues cash;
    if (!gameDb.GetCashSkillPoint(unitUID, cash, err)) {
        ack.iOK = ERR_ODBC_01;
        return ack.iOK;
    }

    const auto result = gameDb.SetActiveSkillPage(unitUID, req.iSkillPagesNumberDecidedToUse, err);
    switch (result) {
        case db::GameStore::SetActiveSkillPageResult::Ok:
            break;
        case db::GameStore::SetActiveSkillPageResult::NeverExpanded:
            ack.iOK = ERR_SKILL_PAGE_06;
            return ack.iOK;
        case db::GameStore::SetActiveSkillPageResult::InvalidPage:
            ack.iOK = ERR_SKILL_PAGE_03;
            return ack.iOK;
        case db::GameStore::SetActiveSkillPageResult::UpdateFailed:
            ack.iOK = ERR_SKILL_PAGE_07;
            return ack.iOK;
    }

    // The persisted unit-global pools are the closest V2 equivalent to original page-local in-memory values.
    const int32_t page = req.iSkillPagesNumberDecidedToUse;
    const db::SkillPageSlotRow* slotA = nullptr;
    for (const auto& row : state.slotA) if (row.pageNumber == page) { slotA = &row; break; }
    const db::SkillSlotBRow* slotB = nullptr;
    for (const auto& row : state.slotB) if (row.pageNumber == page) { slotB = &row; break; }
    for (int i = 0; i < unit::UserSkillPageData::kEquippedSkillSlotCount; ++i) {
        const int32_t idA = slotA ? slotA->slot[i] : 0;
        const int32_t idB = slotB ? slotB->slot[i] : 0;
        ack.kUserSkillPageData.equippedSkill[i].skillID = ClampShort(idA);
        ack.kUserSkillPageData.equippedSkill[i].skillLevel = ClampUchar(LevelOf(state, idA, page));
        ack.kUserSkillPageData.equippedSkillSlotB[i].skillID = ClampShort(idB);
        ack.kUserSkillPageData.equippedSkillSlotB[i].skillLevel = ClampUchar(LevelOf(state, idB, page));
    }
    // Original KUserSkillPageData has page-local pools; V2 stores only unit-global gunit.SPoint and gskillcash.CSPoint.
    // Preserve §0a23 readback's zero placeholders in per-page payload; expose the unit-global approximations in ACK fields.
    ack.kUserSkillPageData.usSkillPoint = 0;
    ack.kUserSkillPageData.usCashSkillPoint = 0;
    for (const auto& skill : state.skills) {
        if (skill.skillPageNumber != page) continue;
        unit::UserSkillData item;
        item.skillID = ClampShort(skill.skillID);
        item.skillLevel = ClampUchar(skill.skillLevel);
        item.skillCSPoint = ClampUchar(skill.skillCSPoint);
        ack.kUserSkillPageData.userSkillData.push_back(item);
    }

    ack.iOK = NET_OK;
    ack.iSkillPagesNumberDecidedToUse = page;
    ack.iSPointAvailable = unit.sPoint;
    ack.iCSPointAvailable = cash.csPoint;
    err.clear();
    return ack.iOK;
}

} // namespace decide_skill_page
} // namespace x2
