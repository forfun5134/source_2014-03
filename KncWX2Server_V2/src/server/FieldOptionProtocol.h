// EGS_OPTION_UPDATE_REQ/ACK (573/574), scoped to the caller's session.
#pragma once
#include <cstdint>
namespace x2 { class Serializer; }
namespace x2 { namespace field_option {
struct FieldOption { int16_t limit = 35; };
struct OptionUpdateReq { FieldOption option; };
struct OptionUpdateAck { int32_t iOK = 0; };
bool PutOptionUpdateReq(Serializer&, const OptionUpdateReq&);
bool GetOptionUpdateReq(Serializer&, OptionUpdateReq&);
bool PutOptionUpdateAck(Serializer&, const OptionUpdateAck&);
bool GetOptionUpdateAck(Serializer&, OptionUpdateAck&);
// Caller owns one state per user session. Original handler does not validate limit.
int32_t HandleOptionUpdateReq(FieldOption& sessionOption, const OptionUpdateReq&, OptionUpdateAck&);
} }
