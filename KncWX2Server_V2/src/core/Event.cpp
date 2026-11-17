// Event.cpp
#include "Event.h"

namespace x2 {

void Event::SetData(uint32_t performerID, const UidType traceIn[2], uint16_t id)
{
    dest.performerID = performerID;
    eventID = id;
    if (traceIn) { trace[0] = traceIn[0]; trace[1] = traceIn[1]; }
    else { trace[0] = trace[1] = -1; }
}

bool Event::Serialize(SerBuffer& out) const
{
    Serializer ks;
    if (!ks.BeginWriting(&out)) return false;
    // KPerformerInfo
    if (!ks.Put(dest.performerID)) return false;
    if (!ks.Put(dest.uids)) return false;
    // trace
    if (!ks.Put(static_cast<int64_t>(trace[0]))) return false;
    if (!ks.Put(static_cast<int64_t>(trace[1]))) return false;
    // event id (USHORT)
    if (!ks.Put(static_cast<uint16_t>(eventID))) return false;
    // kbuff
    if (!ks.Put(payload)) return false;
    ks.EndWriting();
    return true;
}

bool Event::Deserialize(const SerBuffer& in, Event& ev)
{
    SerBuffer tmp = in;   // Deserialize 需要非 const 讀取游標
    Serializer ks;
    if (!ks.BeginReading(&tmp)) return false;
    if (!ks.Get(ev.dest.performerID)) return false;
    if (!ks.Get(ev.dest.uids)) return false;
    if (!ks.Get(ev.trace[0])) return false;
    if (!ks.Get(ev.trace[1])) return false;
    if (!ks.Get(ev.eventID)) return false;
    if (!ks.Get(ev.payload)) return false;
    ks.EndReading();
    return true;
}

} // namespace x2
