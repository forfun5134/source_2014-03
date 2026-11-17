// LoginProtocol.cpp — 見 LoginProtocol.h 的序列化順序對照表
#include "LoginProtocol.h"
#include "../core/Serializer.h"

namespace x2 { namespace login {

bool PutConnectReq(Serializer& ks, const ConnectReq& v)
{
    return ks.Put(v.version);
}
bool GetConnectReq(Serializer& ks, ConnectReq& v)
{
    return ks.Get(v.version);
}

bool PutConnectAck(Serializer& ks, const ConnectAck& v)
{
    return ks.Put(v.iOK) && ks.Put(v.udpPort) && ks.Put(v.channelId);
}
bool GetConnectAck(Serializer& ks, ConnectAck& v)
{
    return ks.Get(v.iOK) && ks.Get(v.udpPort) && ks.Get(v.channelId);
}

bool PutAccountInfo(Serializer& ks, const AccountInfo& v)
{
    return ks.Put(static_cast<int64_t>(v.userUID)) &&
           ks.Put(v.id) && ks.Put(v.name) &&
           ks.Put(v.authLevel) && ks.Put(v.internalUser) &&
           ks.Put(v.option.playGuide) &&
           ks.Put(v.blockInfo.endTime) && ks.Put(v.blockInfo.blockReason) &&
           ks.Put(v.isRecommend) && ks.Put(v.isGuestUser) &&
           ks.Put(v.otp) &&
           ks.Put(v.lastLogin) &&               // SERV_SECOND_SECURITY
           ks.Put(v.channelRandomKey);          // SERV_DLL_LIST_CHECK_BEFOR_LOADING
}
bool GetAccountInfo(Serializer& ks, AccountInfo& v)
{
    return ks.Get(v.userUID) &&
           ks.Get(v.id) && ks.Get(v.name) &&
           ks.Get(v.authLevel) && ks.Get(v.internalUser) &&
           ks.Get(v.option.playGuide) &&
           ks.Get(v.blockInfo.endTime) && ks.Get(v.blockInfo.blockReason) &&
           ks.Get(v.isRecommend) && ks.Get(v.isGuestUser) &&
           ks.Get(v.otp) &&
           ks.Get(v.lastLogin) &&
           ks.Get(v.channelRandomKey);
}

bool PutVerifyAccountReq(Serializer& ks, const VerifyAccountReq& v)
{
    if (!(ks.Put(v.debugAuth) && ks.Put(v.userID) && ks.Put(v.passwd) && ks.Put(v.hwid))) return false;
    if (!ks.Put(v.machineID)) return false;
    if (!ks.Put(v.channelRandomKey)) return false;      // int (INT32 BE)
    for (int i = 0; i < 12; ++i) {                      // char serverSN[12]，12 個 1-byte Put，無長度前綴
        if (!ks.Put(v.serverSN[i])) return false;
    }
    return ks.Put(v.channelingCode) && ks.Put(v.manualLogin);
}
bool GetVerifyAccountReq(Serializer& ks, VerifyAccountReq& v)
{
    if (!(ks.Get(v.debugAuth) && ks.Get(v.userID) && ks.Get(v.passwd) && ks.Get(v.hwid))) return false;
    if (!ks.Get(v.machineID)) return false;
    if (!ks.Get(v.channelRandomKey)) return false;
    for (int i = 0; i < 12; ++i) {
        if (!ks.Get(v.serverSN[i])) return false;
    }
    return ks.Get(v.channelingCode) && ks.Get(v.manualLogin);
}

bool PutVerifyAccountAck(Serializer& ks, const VerifyAccountAck& v)
{
    return ks.Put(v.iOK) &&
           PutAccountInfo(ks, v.accountInfo) &&
           ks.Put(v.hackingUserType) &&
           ks.Put(v.adURL) &&
           ks.Put(v.sex) && ks.Put(v.age) && ks.Put(v.nexonSN) &&
           ks.Put(v.clientIP) &&                 // SERV_CLIENT_PUBLIC_IP
           ks.Put(v.channelCode) && ks.Put(v.channelUserID);
}
bool GetVerifyAccountAck(Serializer& ks, VerifyAccountAck& v)
{
    return ks.Get(v.iOK) &&
           GetAccountInfo(ks, v.accountInfo) &&
           ks.Get(v.hackingUserType) &&
           ks.Get(v.adURL) &&
           ks.Get(v.sex) && ks.Get(v.age) && ks.Get(v.nexonSN) &&
           ks.Get(v.clientIP) &&
           ks.Get(v.channelCode) && ks.Get(v.channelUserID);
}

}} // namespace x2::login
