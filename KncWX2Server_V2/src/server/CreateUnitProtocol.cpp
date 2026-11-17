// CreateUnitProtocol.cpp — 見 CreateUnitProtocol.h 的對照說明
#include "CreateUnitProtocol.h"
#include "../core/Serializer.h"
#include "WireHelpers.h"

namespace x2 { namespace create_unit {

bool PutCreateUnitReq(Serializer& ks, const CreateUnitReq& v)
{
    return ks.Put(v.wstrNickName) && ks.Put(v.iClass);
}
bool PutCreateNewUnitReq(Serializer& ks, const CreateNewUnitReq& v)
{
    return ks.Put(v.wstrNickName) && ks.Put(v.iClass) && ks.Put(v.iServerGroup);
}
bool GetCreateNewUnitReq(Serializer& ks, CreateNewUnitReq& v)
{
    return ks.Get(v.wstrNickName) && ks.Get(v.iClass) && ks.Get(v.iServerGroup);
}
bool GetCreateUnitReq(Serializer& ks, CreateUnitReq& v)
{
    return ks.Get(v.wstrNickName) && ks.Get(v.iClass);
}

bool PutCreateUnitAck(Serializer& ks, const CreateUnitAck& v)
{
    if (!ks.Put(v.iOK)) return false;
    if (!unit::PutUnitInfo(ks, v.kUnitInfo)) return false;
    if (!x2::detail::PutCountPrefixVec(ks, v.vecSkillSlot,
            [](Serializer& s2, const int32_t& e) { return s2.Put(e); })) return false;
    return ks.Put(v.wstrEnableDate);
}
bool GetCreateUnitAck(Serializer& ks, CreateUnitAck& v)
{
    if (!ks.Get(v.iOK)) return false;
    if (!unit::GetUnitInfo(ks, v.kUnitInfo)) return false;
    if (!x2::detail::GetCountPrefixVec(ks, v.vecSkillSlot,
            [](Serializer& s2, int32_t& e) { return s2.Get(e); })) return false;
    return ks.Get(v.wstrEnableDate);
}

}} // namespace x2::create_unit
