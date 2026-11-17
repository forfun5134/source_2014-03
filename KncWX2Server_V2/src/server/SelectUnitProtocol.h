// SelectUnitProtocol.h — EGS_SELECT_UNIT_REQ / EGS_SELECT_UNIT_ACK 的 wire 結構與序列化
// （V2 `x2::select_unit` 命名空間）。
//
// 對齊對象：原 X2Project（SERV_INT_INTERNAL＝JP 內部版本）
//   KEGS_SELECT_UNIT_REQ { UidType m_iUnitUID }
//     ← SERV_CODE_EVENT / SERV_GLOBAL_EVENT_TABLE **未定義**（2026-11-17 機讀核對 ServerDefine.h，無任何匹配）
//   SERV_SELECT_UNIT_PACKET_DIVISION **已定義**（ServerDefine.h:3401），故：
//     DB 回應不再內嵌巨大的 KEGS_SELECT_UNIT_ACK，而是拆成
//     SELECT_UNIT_1_NOT…5_NOT（角色/任務/寵物…分片）+ 一個極簡的 EGS_SELECT_UNIT_ACK { int m_iOK } 收尾。
//   事件 ID（V2 EventIDs.h 實測）：EGS_SELECT_UNIT_REQ=40, EGS_SELECT_UNIT_ACK=41,
//                                    EGS_SELECT_UNIT_1_NOT..5_NOT = 42..46。
//
// ⚠ 本檔只覆蓋 REQ 與「收尾 ACK」。
//   SELECT_UNIT_1_NOT…5_NOT（KUnitInfo / KInventoryItemInfo / KQuestInstance / KMissionInstance /
//   KPetInfo / KDenyOptions / KMessengerInfo … 約 20 個巢狀型別）**尚未移植**；
//   在它們完成前，真實客戶端無法用 V2 完成角色選擇流程（見 docs/architecture.md §12）。
//   線路佈局為自洽 golden bytes，未對原 SDK 實機驗證。
#pragma once

#include <cstdint>

namespace x2 { class Serializer; }

namespace x2 { namespace select_unit {

struct SelectUnitReq
{
    int64_t unitUID = 0;   // UidType（INT64 BE，eTAG_INT64）
};

struct SelectUnitAck   // SERV_SELECT_UNIT_PACKET_DIVISION 下的收尾 ACK
{
    int32_t iOK = 0;      // NetError（NET_OK=0）
};

bool PutSelectUnitReq(Serializer& ks, const SelectUnitReq& v);
bool GetSelectUnitReq(Serializer& ks, SelectUnitReq& v);
bool PutSelectUnitAck(Serializer& ks, const SelectUnitAck& v);
bool GetSelectUnitAck(Serializer& ks, SelectUnitAck& v);

} // namespace select_unit
} // namespace x2
