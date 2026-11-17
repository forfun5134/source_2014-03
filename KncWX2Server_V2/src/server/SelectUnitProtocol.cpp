// SelectUnitProtocol.cpp — 見 SelectUnitProtocol.h 的對照說明
#include "SelectUnitProtocol.h"
#include "../core/Serializer.h"

namespace x2 { namespace select_unit {

bool PutSelectUnitReq(Serializer& ks, const SelectUnitReq& v)
{
    return ks.Put(static_cast<int64_t>(v.unitUID));
}
bool GetSelectUnitReq(Serializer& ks, SelectUnitReq& v)
{
    return ks.Get(v.unitUID);
}

bool PutSelectUnitAck(Serializer& ks, const SelectUnitAck& v)
{
    return ks.Put(v.iOK);
}
bool GetSelectUnitAck(Serializer& ks, SelectUnitAck& v)
{
    return ks.Get(v.iOK);
}

}} // namespace x2::select_unit
