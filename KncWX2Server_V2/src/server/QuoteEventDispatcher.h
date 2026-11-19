// Prototype adapter for the three read-only expansion quote requests.
#pragma once
#include <cstdint>
#include <string>
#include "../core/Event.h"
#include "../db/GameStore.h"
namespace x2 {
// Caller must set these from a verified login and selected character, never from request payload.
struct QuoteSession { bool authenticated = false; int64_t userUID = 0; int64_t unitUID = 0; };
enum class QuoteDispatchResult { Handled, Unsupported, Unauthenticated, NoSelection, Forbidden, Malformed, DatabaseError, EncodeError };
// Only Handled replaces reply. err is cleared on entry and contains server-side diagnostics only.
// The caller owns auth, session lifecycle and delivery of the returned ACK.
QuoteDispatchResult DispatchQuoteEvent(db::GameStore&, const QuoteSession&, const Event& request,
                                       Event& reply, std::string& err);
}
