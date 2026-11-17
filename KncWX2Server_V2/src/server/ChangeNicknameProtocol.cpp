// ChangeNicknameProtocol.cpp — 見 ChangeNicknameProtocol.h 的對照說明
#include "ChangeNicknameProtocol.h"
#include "../core/Serializer.h"

namespace x2 { namespace change_nickname {

bool PutChangeNickNameReq(Serializer& ks, const ChangeNickNameReq& v)
{
    return ks.Put(v.iUnitUID) && ks.Put(v.wstrNickName) && ks.Put(v.bCheckOnly);
}
bool GetChangeNickNameReq(Serializer& ks, ChangeNickNameReq& v)
{
    return ks.Get(v.iUnitUID) && ks.Get(v.wstrNickName) && ks.Get(v.bCheckOnly);
}

bool PutEntryPointChangeNickNameReq(Serializer& ks, const EntryPointChangeNickNameReq& v)
{
    return ks.Put(v.iServerGroup) && ks.Put(v.iUnitUID) && ks.Put(v.wstrNickName) && ks.Put(v.bCheckOnly);
}
bool GetEntryPointChangeNickNameReq(Serializer& ks, EntryPointChangeNickNameReq& v)
{
    return ks.Get(v.iServerGroup) && ks.Get(v.iUnitUID) && ks.Get(v.wstrNickName) && ks.Get(v.bCheckOnly);
}

bool PutChangeNickNameAck(Serializer& ks, const ChangeNickNameAck& v)
{
    return ks.Put(v.iOK) && ks.Put(v.iUnitUID) && ks.Put(v.wstrNickName) && ks.Put(v.bCheckOnly);
}
bool GetChangeNickNameAck(Serializer& ks, ChangeNickNameAck& v)
{
    return ks.Get(v.iOK) && ks.Get(v.iUnitUID) && ks.Get(v.wstrNickName) && ks.Get(v.bCheckOnly);
}

}} // namespace x2::change_nickname
