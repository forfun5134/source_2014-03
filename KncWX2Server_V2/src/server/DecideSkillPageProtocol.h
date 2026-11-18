// DecideSkillPageProtocol.h — EGS_DECIDE_TO_USE_THIS_SKILL_PAGE_REQ/ACK（§0a27）.
// 原流程：GSUserGameCommon.cpp:10436–10516 → DBE_DECIDE_TO_USE_THIS_SKILL_PAGE_REQ →
// GSGameDBThread.cpp:25285+（P_GSkill_Expand_UPD[_Active]）→ DBE ACK → GS ACK。
// V2 無 DB worker／角色內存技能樹：讀取狀態→校驗→單一 transaction 更新 ActivePage→組 ACK。
#pragma once

#include <cstdint>
#include <string>

#include "../db/GameStore.h"
#include "UnitData.h"

namespace x2 { class Serializer; }

namespace x2 { namespace decide_skill_page {

struct DecideSkillPageReq       // EGS_DECIDE_TO_USE_THIS_SKILL_PAGE_REQ（1153）
{
    int32_t iSkillPagesNumberDecidedToUse = 0;
};

struct DecideSkillPageAck       // EGS_DECIDE_TO_USE_THIS_SKILL_PAGE_ACK（1154）
{
    int32_t iOK = 0;
    int32_t iSkillPagesNumberDecidedToUse = 0;
    int32_t iSPointAvailable = 0;
    int32_t iCSPointAvailable = 0;
    unit::UserSkillPageData kUserSkillPageData;
};

bool PutDecideSkillPageReq(Serializer& ks, const DecideSkillPageReq& v);
bool GetDecideSkillPageReq(Serializer& ks, DecideSkillPageReq& v);
bool PutDecideSkillPageAck(Serializer& ks, const DecideSkillPageAck& v);
bool GetDecideSkillPageAck(Serializer& ks, DecideSkillPageAck& v);

// 回傳值與 ack.iOK 同；頁面切換成功會在 DB transaction 中持久化 ActivePage。
int32_t HandleDecideSkillPageReq(db::GameStore& gameDb, int64_t unitUID,
                                 const DecideSkillPageReq& req,
                                 DecideSkillPageAck& ack,
                                 std::string& err);

} // namespace decide_skill_page
} // namespace x2
