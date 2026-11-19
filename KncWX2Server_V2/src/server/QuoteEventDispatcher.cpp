#include "QuoteEventDispatcher.h"
#include "GetNextBankEdProtocol.h"
#include "GetNextInventoryEdProtocol.h"
#include "GetNextSkillPageEdProtocol.h"
#include "../core/Serializer.h"

namespace x2 {
QuoteDispatchResult DispatchQuoteEvent(db::GameStore& store, const QuoteSession& session,
                                       const Event& request, Event& reply, std::string& err)
{
    err.clear();
    const auto bank = static_cast<uint16_t>(EventID::EGS_GET_NEXT_BANK_ED_REQ);
    const auto inventory = static_cast<uint16_t>(EventID::EGS_GET_NEXT_INVENTORY_ED_REQ);
    const auto skill = static_cast<uint16_t>(EventID::EGS_GET_NEXT_SKILL_PAGE_ED_REQ);
    if (request.eventID != bank && request.eventID != inventory && request.eventID != skill)
        return QuoteDispatchResult::Unsupported;
    if (!session.authenticated || session.userUID <= 0) return QuoteDispatchResult::Unauthenticated;
    if (session.unitUID <= 0) return QuoteDispatchResult::NoSelection;
    if (request.payload.IsCompressed() || request.payload.GetLength() != 0) return QuoteDispatchResult::Malformed;
    db::GUnitRecord unit{};
    bool found = false;
    if (!store.GetUnitByUID(session.unitUID, unit, found, err)) return QuoteDispatchResult::DatabaseError;
    if (!found || unit.deleted || unit.userUID != session.userUID) return QuoteDispatchResult::Forbidden;

    Event response;
    response.dest.performerID = PerformerID::PI_GS_USER;
    Serializer writer;
    if (!writer.BeginWriting(&response.payload)) { err = "serialize quote ACK failed"; return QuoteDispatchResult::EncodeError; }
    bool ok = false;
    if (request.eventID == bank) {
        get_next_bank_ed::GetNextBankEdAck ack;
        get_next_bank_ed::HandleGetNextBankEdReq(store, session.unitUID, ack, err);
        response.eventID = static_cast<uint16_t>(EventID::EGS_GET_NEXT_BANK_ED_ACK);
        ok = get_next_bank_ed::PutGetNextBankEdAck(writer, ack);
    } else if (request.eventID == inventory) {
        get_next_inventory_ed::GetNextInventoryEdAck ack;
        get_next_inventory_ed::HandleGetNextInventoryEdReq(store, session.unitUID, ack, err);
        response.eventID = static_cast<uint16_t>(EventID::EGS_GET_NEXT_INVENTORY_ED_ACK);
        ok = get_next_inventory_ed::PutGetNextInventoryEdAck(writer, ack);
    } else {
        get_next_skill_page_ed::GetNextSkillPageEdAck ack;
        get_next_skill_page_ed::HandleGetNextSkillPageEdReq(store, session.unitUID, ack, err);
        response.eventID = static_cast<uint16_t>(EventID::EGS_GET_NEXT_SKILL_PAGE_ED_ACK);
        ok = get_next_skill_page_ed::PutGetNextSkillPageEdAck(writer, ack);
    }
    writer.EndWriting();
    if (!ok) { err = "serialize quote ACK failed"; return QuoteDispatchResult::EncodeError; }
    reply = response;
    return QuoteDispatchResult::Handled;
}
}
