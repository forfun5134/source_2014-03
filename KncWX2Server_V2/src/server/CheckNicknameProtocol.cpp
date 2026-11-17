// CheckNicknameProtocol.cpp — 見 CheckNicknameProtocol.h 的對照說明
#include "CheckNicknameProtocol.h"
#include "../core/Serializer.h"

namespace x2 { namespace check_nickname {

bool PutEntryPointCheckNickNameReq(Serializer& ks, const EntryPointCheckNickNameReq& v)
{
    return ks.Put(v.iServerGroup) && ks.Put(v.wstrNickName);
}
bool GetEntryPointCheckNickNameReq(Serializer& ks, EntryPointCheckNickNameReq& v)
{
    return ks.Get(v.iServerGroup) && ks.Get(v.wstrNickName);
}

bool PutEntryPointCheckNickNameAck(Serializer& ks, const EntryPointCheckNickNameAck& v)
{
    return ks.Put(v.iOK) && ks.Put(v.iUnitUID) && ks.Put(v.wstrNickName);
}
bool GetEntryPointCheckNickNameAck(Serializer& ks, EntryPointCheckNickNameAck& v)
{
    return ks.Get(v.iOK) && ks.Get(v.iUnitUID) && ks.Get(v.wstrNickName);
}

}} // namespace x2::check_nickname
