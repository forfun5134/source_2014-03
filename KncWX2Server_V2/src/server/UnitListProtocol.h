// UnitListProtocol.h — EGS_MY_UNIT_AND_INVENTORY_INFO_LIST_REQ/ACK（角色清單，選角畫面用）wire 結構。
// （V2 `x2::unit_list` 命名空間）
//
// 對齊對象：原 X2Project（SERV_INT_INTERNAL＝JP 內部版本）
//   KEGS_MY_UNIT_AND_INVENTORY_INFO_LIST_REQ（無參數，原 IMPL_ON_FUNC_NOPARAM）
//   KEGS_MY_UNIT_AND_INVENTORY_INFO_LIST_ACK {
//       int m_iOK;
//       int m_nUnitSlot;
//       std::vector<KUnitInfo> m_vecUnitInfo;
//       （SERV_SHARING_BANK_QUEST_CASH 未定義 → 無 m_bSharingBank）
//       （SERV_4TH_ANNIVERSARY_EVENT 未定義 → 無 m_4ThAnnivEventInfo）
//   }
// 事件 ID（V2 EventIDs.h 實測）：REQ=34, ACK=35。
//
// ⚠ 線路佈局為自洽 golden bytes，未對原 SDK 實機驗證。
// ⚠ 原版成功路徑對每個角色再衍生 m_ucLevel/m_nNowBaseLevelEXP/m_nNextBaseLevelEXP（EXP 表）、
//   m_kStat（職業/等級 stat 表）、m_iOwnerUserUID/m_wstrIP/m_usPort（P2P）——
//   V2 無 EXP 表/stat 表/P2P，PopulateUnitInfoFromGUnit 沿用 gunit 儲存值並把 IP/port 填空（見 architecture §0k）。
#pragma once

#include <cstdint>
#include <vector>

#include "UnitData.h"

namespace x2 { class Serializer; }

namespace x2 { namespace unit_list {

struct MyUnitAndInventoryInfoListReq
{
};

struct MyUnitAndInventoryInfoListAck
{
    int32_t iOK = 0;                               // NetError（NET_OK=0）
    int32_t nUnitSlot = 0;                         // int（guser.usSize；原 m_nUnitSlot）
    std::vector<unit::UnitInfo> vecUnitInfo;       // vector<KUnitInfo>
};

bool PutMyUnitAndInventoryInfoListReq(Serializer& ks, const MyUnitAndInventoryInfoListReq& v);
bool GetMyUnitAndInventoryInfoListReq(Serializer& ks, MyUnitAndInventoryInfoListReq& v);
bool PutMyUnitAndInventoryInfoListAck(Serializer& ks, const MyUnitAndInventoryInfoListAck& v);
bool GetMyUnitAndInventoryInfoListAck(Serializer& ks, MyUnitAndInventoryInfoListAck& v);

} // namespace unit_list
} // namespace x2
