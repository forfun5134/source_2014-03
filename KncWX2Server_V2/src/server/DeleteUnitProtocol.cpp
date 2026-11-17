// DeleteUnitProtocol.cpp — 見 DeleteUnitProtocol.h 的對照說明
#include "DeleteUnitProtocol.h"
#include "../core/Serializer.h"

namespace x2 { namespace delete_unit {

bool PutDeleteUnitReq(Serializer& ks, const DeleteUnitReq& v)
{
    return ks.Put(v.iUnitUID) && ks.Put(v.iUserUID);
}
bool PutEntryPointDeleteUnitReq(Serializer& ks, const EntryPointDeleteUnitReq& v)
{
    return ks.Put(v.iUnitUID) && ks.Put(v.iUserUID) && ks.Put(v.iServerGroup);
}
bool GetEntryPointDeleteUnitReq(Serializer& ks, EntryPointDeleteUnitReq& v)
{
    return ks.Get(v.iUnitUID) && ks.Get(v.iUserUID) && ks.Get(v.iServerGroup);
}
bool GetDeleteUnitReq(Serializer& ks, DeleteUnitReq& v)
{
    return ks.Get(v.iUnitUID) && ks.Get(v.iUserUID);
}

bool PutDeleteUnitAck(Serializer& ks, const DeleteUnitAck& v)
{
    if (!ks.Put(v.iOK)) return false;
    if (!ks.Put(v.iUnitUID)) return false;
    if (!ks.Put(v.uiKNMSerialNum)) return false;
    if (!ks.Put(v.iGuildUID)) return false;   // GUILD_TEST
    if (!ks.Put(v.wstrNickName)) return false;
    if (!ks.Put(v.ucLevel)) return false;     // SERV_CHAR_LOG
    return ks.Put(v.cUnitClass);              // SERV_CHAR_LOG
}
bool GetDeleteUnitAck(Serializer& ks, DeleteUnitAck& v)
{
    if (!ks.Get(v.iOK)) return false;
    if (!ks.Get(v.iUnitUID)) return false;
    if (!ks.Get(v.uiKNMSerialNum)) return false;
    if (!ks.Get(v.iGuildUID)) return false;   // GUILD_TEST
    if (!ks.Get(v.wstrNickName)) return false;
    if (!ks.Get(v.ucLevel)) return false;     // SERV_CHAR_LOG
    return ks.Get(v.cUnitClass);              // SERV_CHAR_LOG
}

}} // namespace x2::delete_unit
