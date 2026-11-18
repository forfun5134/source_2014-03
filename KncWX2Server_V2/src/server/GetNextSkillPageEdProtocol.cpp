// GetNextSkillPageEdProtocol.cpp — EGS_GET_NEXT_SKILL_PAGE_ED_REQ/ACK (1149/1150).
#include "GetNextSkillPageEdProtocol.h"

#include "../core/NetError.h"
#include "../core/Serializer.h"

namespace x2 { namespace get_next_skill_page_ed {

namespace {
constexpr int32_t kEdNeededToExpandSkillPage = 50000000;
constexpr int32_t kMaxSkillPages = 3;
}

bool PutGetNextSkillPageEdReq(Serializer&, const GetNextSkillPageEdReq&) { return true; }
bool GetGetNextSkillPageEdReq(Serializer&, GetNextSkillPageEdReq&) { return true; }
bool PutGetNextSkillPageEdAck(Serializer& ks, const GetNextSkillPageEdAck& value)
{
    return ks.Put(value.iOK) && ks.Put(value.iED);
}
bool GetGetNextSkillPageEdAck(Serializer& ks, GetNextSkillPageEdAck& value)
{
    return ks.Get(value.iOK) && ks.Get(value.iED);
}

int32_t HandleGetNextSkillPageEdReq(db::GameStore& gameDb, int64_t unitUID,
                                    GetNextSkillPageEdAck& ack, std::string& err)
{
    ack = GetNextSkillPageEdAck{};
    err.clear();
    if (unitUID <= 0) {
        ack.iOK = ERR_ODBC_01;
        err = "invalid unit uid";
        return ack.iOK;
    }

    db::GUnitRecord unit{};
    bool found = false;
    if (!gameDb.GetUnitByUID(unitUID, unit, found, err) || !found || unit.deleted) {
        if (err.empty()) err = "unit not found";
        ack.iOK = ERR_ODBC_01;
        return ack.iOK;
    }

    db::SkillPageState state;
    if (!gameDb.LoadSkillPageState(unitUID, state, err)) {
        err = std::string("load skill page state: ") + err;
        ack.iOK = ERR_ODBC_01;
        return ack.iOK;
    }
    if (state.pagesAvailable >= kMaxSkillPages) {
        ack.iOK = ERR_SKILL_PAGE_02;
        err.clear();
        return ack.iOK;
    }

    ack.iOK = NET_OK;
    ack.iED = kEdNeededToExpandSkillPage;
    return ack.iOK;
}

} } // namespace x2::get_next_skill_page_ed
