// CheckNicknameProtocol.h — EGS_ENTRY_POINT_CHECK_NICK_NAME_REQ / EGS_ENTRY_POINT_CHECK_NICK_NAME_ACK（暱稱可用性檢查）wire 結構。
// （V2 `x2::check_nickname` 命名空間）
//
// 對齊對象：原 X2Project（SERV_ENTRY_POINT 已定義 ServerDefine.h:4304；SERV_INT_INTERNAL＝JP 內部版本）
//   KEGS_ENTRY_POINT_CHECK_NICK_NAME_REQ { int m_iServerGroup; std::wstring m_wstrNickName; }
//   KEGS_CHECK_NICK_NAME_ACK           { int m_iOK; UidType m_iUnitUID; std::wstring m_wstrNickName; }
//   （typedef KEGS_CHECK_NICK_NAME_ACK KEGS_ENTRY_POINT_CHECK_NICK_NAME_ACK——client 收到的就是 CheckNickNameAck）
// 事件 ID（V2 EventIDs.h 實測）：REQ=1161, ACK=1162。PUT/GET 順序機讀自原 ClientPacket.cpp:13614–13628 / 15013–15028。
//
// ⚠ 線路佈局為自洽 golden bytes，未對原 SDK 實機驗證。
// ⚠ 原碼依 server group 路由到當前/第二個 GameDB；V2 單一 game DB，iServerGroup 一律忽略（誠實偏差）。
#pragma once

#include <cstdint>
#include <string>

namespace x2 { class Serializer; }

namespace x2 { namespace check_nickname {

struct EntryPointCheckNickNameReq
{
    int32_t iServerGroup = 0;        // 原 m_iServerGroup（SEnum::SGI_*；V2 忽略）
    std::wstring wstrNickName;       // 原 m_wstrNickName
};

struct EntryPointCheckNickNameAck
{
    int32_t iOK = 0;                 // NetError（NET_OK=0；ERR_RESTORE_NICK_NAME_02/03/05/06）
    int64_t iUnitUID = 0;            // 原 m_iUnitUID（原碼未設定 → 恆 0）
    std::wstring wstrNickName;       // 原 m_wstrNickName（回顯查詢暱稱）
};

bool PutEntryPointCheckNickNameReq(Serializer& ks, const EntryPointCheckNickNameReq& v);
bool GetEntryPointCheckNickNameReq(Serializer& ks, EntryPointCheckNickNameReq& v);
bool PutEntryPointCheckNickNameAck(Serializer& ks, const EntryPointCheckNickNameAck& v);
bool GetEntryPointCheckNickNameAck(Serializer& ks, EntryPointCheckNickNameAck& v);

} // namespace check_nickname
} // namespace x2
