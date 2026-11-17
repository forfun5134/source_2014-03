// CreateTodayCountProtocol.cpp — 見 CreateTodayCountProtocol.h 的對照說明
#include "CreateTodayCountProtocol.h"
#include "../core/Serializer.h"
#include "WireHelpers.h"

namespace x2 { namespace today_count {

bool PutGetCreateUnitTodayCountReq(Serializer&, const GetCreateUnitTodayCountReq&) { return true; }
bool GetGetCreateUnitTodayCountReq(Serializer&, GetCreateUnitTodayCountReq&) { return true; }

bool PutGetCreateUnitTodayCountAck(Serializer& ks, const GetCreateUnitTodayCountAck& v)
{
    if (!ks.Put(v.iUserUID)) return false;
    // V2 線路慣例：map = count-prefix + 無 tag/wrapper 元素（與 WriteTag(eTAG_MAP) 不同，見 WireHelpers.h）
    return x2::detail::PutCountPrefixMap(ks, v.mapCreateCharCountToday,
        [](Serializer& s2, const int32_t& k) { return s2.Put(k); },
        [](Serializer& s2, const int32_t& v2) { return s2.Put(v2); });
}
bool GetGetCreateUnitTodayCountAck(Serializer& ks, GetCreateUnitTodayCountAck& v)
{
    if (!ks.Get(v.iUserUID)) return false;
    return x2::detail::GetCountPrefixMap(ks, v.mapCreateCharCountToday,
        [](Serializer& s2, int32_t& k) { return s2.Get(k); },
        [](Serializer& s2, int32_t& v2) { return s2.Get(v2); });
}

}} // namespace x2::today_count
