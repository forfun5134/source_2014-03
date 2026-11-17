// ChangeNicknameProtocol.h — EGS_CHANGE_NICK_NAME_REQ/ACK（暱稱變更）wire 結構。
// （V2 `x2::change_nickname` 命名空間）
//
// 對齊對象：原 X2Project（內部版本 SERV_INT_INTERNAL＝JP）
//   EGS_CHANGE_NICK_NAME_REQ（ClientPacket.h）{ UidType m_iUnitUID; std::wstring m_wstrNickName; bool m_bCheckOnly; }
//   EGS_CHANGE_NICK_NAME_ACK            { int m_iOK; UidType m_iUnitUID; std::wstring m_wstrNickName; bool m_bCheckOnly; }
//   EGS_ENTRY_POINT_CHANGE_NICK_NAME_REQ { int m_iServerGroup; UidType m_iUnitUID; std::wstring m_wstrNickName; bool m_bCheckOnly; }
//   （typedef 後端共用：EGS_ENTRY_POINT_CHANGE_NICK_NAME_REQ 由同一 handler 接收，路由至 1st/2nd GameDB；ACK 與 EGS_CHANGE_NICK_NAME_ACK 相同）
// 事件 ID（V2 EventIDs.h 實測）：EGS_CHANGE_NICK_NAME_REQ=431, ACK=432；EGS_ENTRY_POINT_CHANGE_NICK_NAME_REQ=1168（reuses ACK 432）。
// PUT/GET 順序機讀自原 ClientPacket.cpp:5715–5748 / 15044–15064。
//
// ⚠ 線路佈局為自洽 golden bytes，未對原 SDK 實機驗證。
// ⚠ 原碼依 server group 路由至 1st/2nd GameDB；V2 單一 game DB → iServerGroup 一律忽略（誠實偏差）。
#pragma once

#include <cstdint>
#include <string>

namespace x2 { class Serializer; }

namespace x2 { namespace change_nickname {

struct ChangeNickNameReq          // EGS_CHANGE_NICK_NAME_REQ（431）
{
    int64_t iUnitUID = 0;        // 原 m_iUnitUID（UidType）
    std::wstring wstrNickName;   // 原 m_wstrNickName
    bool bCheckOnly = false;     // 原 m_bCheckOnly
};

struct EntryPointChangeNickNameReq   // EGS_ENTRY_POINT_CHANGE_NICK_NAME_REQ（1168）；以 EGS_CHANGE_NICK_NAME_ACK 回覆
{
    int32_t iServerGroup = 0;    // 原 m_iServerGroup（SEnum::SGI_*；V2 忽略）
    int64_t iUnitUID = 0;
    std::wstring wstrNickName;
    bool bCheckOnly = false;
};

struct ChangeNickNameAck          // EGS_CHANGE_NICK_NAME_ACK（432）
{
    int32_t iOK = 0;             // NetError（NET_OK=0；ERR_RESTORE_NICK_NAME_00..06）
    int64_t iUnitUID = 0;        // 原 m_iUnitUID（回顯）
    std::wstring wstrNickName;   // 原 m_wstrNickName（回顯）
    bool bCheckOnly = false;     // 原 m_bCheckOnly（回顯）
};

bool PutChangeNickNameReq(Serializer& ks, const ChangeNickNameReq& v);
bool GetChangeNickNameReq(Serializer& ks, ChangeNickNameReq& v);
bool PutEntryPointChangeNickNameReq(Serializer& ks, const EntryPointChangeNickNameReq& v);
bool GetEntryPointChangeNickNameReq(Serializer& ks, EntryPointChangeNickNameReq& v);
bool PutChangeNickNameAck(Serializer& ks, const ChangeNickNameAck& v);
bool GetChangeNickNameAck(Serializer& ks, ChangeNickNameAck& v);

} // namespace change_nickname
} // namespace x2
