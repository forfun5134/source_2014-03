// UnitListProtocol.cpp — 見 UnitListProtocol.h 的對照說明
#include "UnitListProtocol.h"
#include "../core/Serializer.h"
#include "WireHelpers.h"

namespace x2 { namespace unit_list {

bool PutMyUnitAndInventoryInfoListReq(Serializer& ks, const MyUnitAndInventoryInfoListReq& /*v*/)
{
    (void)ks;
    return true;   // 原 NOPARAM：無欄位
}
bool GetMyUnitAndInventoryInfoListReq(Serializer& ks, MyUnitAndInventoryInfoListReq& /*v*/)
{
    (void)ks;
    return true;
}

bool PutMyUnitAndInventoryInfoListAck(Serializer& ks, const MyUnitAndInventoryInfoListAck& v)
{
    if (!ks.Put(v.iOK)) return false;
    if (!ks.Put(v.nUnitSlot)) return false;
    return x2::detail::PutCountPrefixVec(ks, v.vecUnitInfo,
               [](Serializer& s2, const unit::UnitInfo& e) { return unit::PutUnitInfo(s2, e); });
}
bool GetMyUnitAndInventoryInfoListAck(Serializer& ks, MyUnitAndInventoryInfoListAck& v)
{
    if (!ks.Get(v.iOK)) return false;
    if (!ks.Get(v.nUnitSlot)) return false;
    return x2::detail::GetCountPrefixVec(ks, v.vecUnitInfo,
               [](Serializer& s2, unit::UnitInfo& e) { return unit::GetUnitInfo(s2, e); });
}

}} // namespace x2::unit_list
