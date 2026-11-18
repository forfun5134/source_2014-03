// GetNextSkillPageEdProtocol.h — EGS_GET_NEXT_SKILL_PAGE_ED_REQ/ACK (1149/1150).
// Read-only quote for the next skill-page expansion cost; the actual expansion remains blocked by missing authoritative defaults/SP data.
#pragma once

#include <cstdint>
#include <string>

#include "../db/GameStore.h"

namespace x2 { class Serializer; }

namespace x2 { namespace get_next_skill_page_ed {

struct GetNextSkillPageEdReq {};
struct GetNextSkillPageEdAck
{
    int32_t iOK = 0;
    int32_t iED = 0;
};

bool PutGetNextSkillPageEdReq(Serializer& ks, const GetNextSkillPageEdReq& value);
bool GetGetNextSkillPageEdReq(Serializer& ks, GetNextSkillPageEdReq& value);
bool PutGetNextSkillPageEdAck(Serializer& ks, const GetNextSkillPageEdAck& value);
bool GetGetNextSkillPageEdAck(Serializer& ks, GetNextSkillPageEdAck& value);

// Uses the original fixed quote (50,000,000 ED) while one or two pages are available.
// Original Field/Room state gating is not available in V2; this operation does not mutate state.
int32_t HandleGetNextSkillPageEdReq(db::GameStore& gameDb, int64_t unitUID,
                                    GetNextSkillPageEdAck& ack, std::string& err);

} } // namespace x2::get_next_skill_page_ed
