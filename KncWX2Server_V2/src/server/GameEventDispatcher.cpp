#include "GameEventDispatcher.h"
#include "../core/Serializer.h"
namespace x2 {
GameDispatchResult DispatchGameEvent(GameEventSession& session, const Event& request, Event& reply,
                                     frame_average::FrameStatistics& statistics)
{
    statistics = frame_average::FrameStatistics{};
    const auto fieldReq = static_cast<uint16_t>(EventID::EGS_OPTION_UPDATE_REQ);
    const auto frameReq = static_cast<uint16_t>(EventID::EGS_FRAME_AVERAGE_REQ);
    if (request.eventID != fieldReq && request.eventID != frameReq) return GameDispatchResult::Unsupported;
    if (!session.authenticated) return GameDispatchResult::Unauthenticated;
    if (request.payload.IsCompressed()) return GameDispatchResult::Malformed;
    SerBuffer payload = request.payload;
    Serializer in;
    if (!in.BeginReading(&payload)) return GameDispatchResult::Malformed;
    Event response;
    response.dest.performerID = PerformerID::PI_GS_USER;
    Serializer out;
    if (!out.BeginWriting(&response.payload)) return GameDispatchResult::Malformed;
    if (request.eventID == fieldReq) {
        field_option::OptionUpdateReq req;
        if (!field_option::GetOptionUpdateReq(in, req) || in.GetReadLength() != 0) return GameDispatchResult::Malformed;
        // Stage state so serialization failure cannot partially apply the request.
        auto updated = session.fieldOption;
        field_option::OptionUpdateAck ack;
        field_option::HandleOptionUpdateReq(updated, req, ack);
        if (!field_option::PutOptionUpdateAck(out, ack)) return GameDispatchResult::Malformed;
        response.eventID = static_cast<uint16_t>(EventID::EGS_OPTION_UPDATE_ACK);
        session.fieldOption = updated;
    } else {
        frame_average::FrameAverageReq req;
        if (!frame_average::GetFrameAverageReq(in, req) || in.GetReadLength() != 0) return GameDispatchResult::Malformed;
        frame_average::FrameAverageAck ack;
        frame_average::FrameStatistics staged;
        frame_average::HandleFrameAverageReq(req, ack, staged);
        if (!frame_average::PutFrameAverageAck(out, ack)) return GameDispatchResult::Malformed;
        response.eventID = static_cast<uint16_t>(EventID::EGS_FRAME_AVERAGE_ACK);
        statistics = staged;
    }
    in.EndReading();
    out.EndWriting();
    reply = response;
    return GameDispatchResult::Handled;
}
}
