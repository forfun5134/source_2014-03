// DeleteUnitProtocol.h — EGS_DELETE_UNIT_REQ / EGS_DELETE_UNIT_ACK（刪除角色）wire 結構。
// （V2 `x2::delete_unit` 命名空間）
//
// 對齊對象：原 X2Project（SERV_INT_INTERNAL＝JP 內部版本）
//   KEGS_DELETE_UNIT_REQ { UidType m_iUnitUID; #ifdef SERV_UNIT_DELETE_EXCEPTION_MODIFY (已定義, ServerDefine.h:1786) UidType m_iUserUID; }
//   KEGS_DELETE_UNIT_ACK {
//       int m_iOK;
//       UidType m_iUnitUID;
//       u_int m_uiKNMSerialNum;
//       #ifdef GUILD_TEST (已定義, ServerDefine.h:73) int m_iGuildUID;
//       #ifdef SERV_CHAR_LOG (已定義, ServerDefine.h:754) std::wstring m_wstrNickName; u_char m_ucLevel; char m_cUnitClass;
//       #ifdef SERV_UNIT_WAIT_DELETE (已定義=否, ServerDefine.h:4594 註解) → 無 m_tReDelAbleDate / m_tDelAbleDate
//   }
// 事件 ID（V2 EventIDs.h 實測）：REQ=38, ACK=39。PUT/GET 順序機讀自原 ClientPacket.cpp:112–175。
//
// ⚠ 線路佈局為自洽 golden bytes，未對原 SDK 實機驗證。
// ⚠ m_uiKNMSerialNum 原由 AccountDB(GetMessengerSN) 填寫（VF_INTERNAL/JP 內部版實際跳過）；V2 恆為 0（誠實佔位）。
// ⚠ m_iGuildUID 原用於公會踢出流程；V2 無公會系統，一律 0（GUILD_TEST 欄位保留以對齊 wire）。
#pragma once

#include <cstdint>
#include <string>

namespace x2 { class Serializer; }

namespace x2 { namespace delete_unit {

struct DeleteUnitReq
{
    int64_t iUnitUID = 0;   // 原 m_iUnitUID（UidType=int64）
    int64_t iUserUID = 0;   // 原 m_iUserUID（SERV_UNIT_DELETE_EXCEPTION_MODIFY）
};

struct EntryPointDeleteUnitReq   // EGS_ENTRY_POINT_DELETE_UNIT_REQ（1160）：EGS_ENTRY_POINT 變體，回覆 EGS_DELETE_UNIT_ACK
{
    int64_t iUnitUID = 0;        // 原 m_iUnitUID（UidType）
    int64_t iUserUID = 0;        // 原 m_iUserUID（UidType；SERV_UNIT_DELETE_EXCEPTION_MODIFY）
    int32_t iServerGroup = 0;    // 原 m_iServerGroup（SEnum::SGI_*；V2 忽略）
};

struct DeleteUnitAck
{
    int32_t iOK = 0;             // NetError（NET_OK=0；見 NetError.h ERR_DELETE_UNIT_00/05）
    int64_t iUnitUID = 0;        // 原 m_iUnitUID
    uint32_t uiKNMSerialNum = 0; // 原 m_uiKNMSerialNum（u_int=32bit；V2 恆 0 佔位）
    int32_t iGuildUID = 0;       // 原 m_iGuildUID（GUILD_TEST；V2 恆 0 佔位——無公會系統）
    std::wstring wstrNickName;   // 原 m_wstrNickName（SERV_CHAR_LOG；刪除前的暱稱）
    uint8_t ucLevel = 0;         // 原 m_ucLevel（SERV_CHAR_LOG；刪除前的等級）
    int8_t cUnitClass = 0;       // 原 m_cUnitClass（SERV_CHAR_LOG；刪除前的職業）
};

bool PutDeleteUnitReq(Serializer& ks, const DeleteUnitReq& v);
bool GetDeleteUnitReq(Serializer& ks, DeleteUnitReq& v);
bool PutEntryPointDeleteUnitReq(Serializer& ks, const EntryPointDeleteUnitReq& v);
bool GetEntryPointDeleteUnitReq(Serializer& ks, EntryPointDeleteUnitReq& v);
bool PutDeleteUnitAck(Serializer& ks, const DeleteUnitAck& v);
bool GetDeleteUnitAck(Serializer& ks, DeleteUnitAck& v);

} // namespace delete_unit
} // namespace x2
