#include "FieldOptionProtocol.h"
#include "../core/NetError.h"
#include "../core/Serializer.h"
namespace x2 { namespace field_option {
bool PutOptionUpdateReq(Serializer& s, const OptionUpdateReq& r) { return s.Put(r.option.limit); }
bool GetOptionUpdateReq(Serializer& s, OptionUpdateReq& r) { return s.Get(r.option.limit); }
bool PutOptionUpdateAck(Serializer& s, const OptionUpdateAck& a) { return s.Put(a.iOK); }
bool GetOptionUpdateAck(Serializer& s, OptionUpdateAck& a) { return s.Get(a.iOK); }
int32_t HandleOptionUpdateReq(FieldOption& sessionOption, const OptionUpdateReq& req, OptionUpdateAck& ack)
{
    sessionOption = req.option;
    ack.iOK = NET_OK;
    return ack.iOK;
}
} }
