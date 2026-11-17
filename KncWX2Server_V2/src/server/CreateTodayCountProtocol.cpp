// CreateTodayCountProtocol.cpp — 見 CreateTodayCountProtocol.h 的對照說明
#include "CreateTodayCountProtocol.h"
#include "../core/Serializer.h"

namespace x2 { namespace today_count {

bool PutGetCreateUnitTodayCountReq(Serializer&, const GetCreateUnitTodayCountReq&) { return true; }
bool GetGetCreateUnitTodayCountReq(Serializer&, GetCreateUnitTodayCountReq&) { return true; }

bool PutGetCreateUnitTodayCountAck(Serializer& ks, const GetCreateUnitTodayCountAck& v)
{
    return ks.Put(v.iUserUID) && ks.Put(v.mapCreateCharCountToday);
}
bool GetGetCreateUnitTodayCountAck(Serializer& ks, GetCreateUnitTodayCountAck& v)
{
    return ks.Get(v.iUserUID) && ks.Get(v.mapCreateCharCountToday);
}

}} // namespace x2::today_count
