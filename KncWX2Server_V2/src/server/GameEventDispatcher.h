// Prototype event adapter for selected in-session game requests.
#pragma once
#include "../core/Event.h"
#include "FieldOptionProtocol.h"
#include "FrameAverageProtocol.h"
namespace x2 {
// One instance per authenticated connection. Authentication and lifecycle are owned by the caller.
struct GameEventSession {
    bool authenticated = false;
    field_option::FieldOption fieldOption;
};
enum class GameDispatchResult { Handled, Unsupported, Unauthenticated, Malformed };
// On Handled, reply is an ACK and statistics may contain one FPS count.
// Other results leave reply and session state unchanged; statistics is reset.
// Input must already be decompressed by Session; no socket I/O is performed here.
GameDispatchResult DispatchGameEvent(GameEventSession&, const Event& request, Event& reply,
                                     frame_average::FrameStatistics& statistics);
}
