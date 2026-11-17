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
#include <string>
#include <vector>
#include <map>

#include "UnitData.h"

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

// EGS_SELECT_UNIT_1_NOT（服務端 → 客戶端）：角色本體 + 背包/技能進度分片之首。
// JP INT_INTERNAL（SERV_SELECT_UNIT_PACKET_DIVISION、SERV_CHAR_LOG、SERV_LOGOUT_ED_CHECK、
// SERV_DAILY_CHAR_FIRST_SELECT、SERV_SKILL_PAGE_SYSTEM、SERV_SKILL_NOTE、
// AP_RESTONE、SERV_RELATIONSHIP_SYSTEM 皆已定義；SERV_NEW_UNIT_TRADE_LIMIT 未定義）
// PUT 順序機讀自 CommonPacket.cpp（2026-11-17）：
//   iOK, kUnitInfo, wstrUnitCreateDate, iRealDataED, wstrUnitLastLoginDate,
//   mapInventorySlotSize<int,int>, mapItem<UidType,KInventoryItemInfo>, iNumResurrectionStone,
//   iNumAutoPaymentResStone, wstrAutoPayResStoneLastDate, vecUserSkillPageData, vecSkillUnsealed<short>,
//   cSkillNoteMaxPageNum, mapSkillNote<char,int>, kRelationshipInfo
// 事件 ID：EGS_SELECT_UNIT_1_NOT = 42。
// ⚠ 自洽 golden bytes；未對原 SDK 實機驗證。
struct SelectUnitNot1
{
    int32_t iOK = 0;
    unit::UnitInfo unitInfo;
    std::wstring unitCreateDate;                    // SERV_CHAR_LOG（原 wstring）
    int32_t realDataED = 0;                         // SERV_LOGOUT_ED_CHECK（int）
    std::wstring unitLastLoginDate;                 // SERV_DAILY_CHAR_FIRST_SELECT
    std::map<int32_t, int32_t> inventorySlotSize;   // map<int,int>
    std::map<int64_t, unit::InventoryItemInfo> items; // map<UidType,KInventoryItemInfo>
    int32_t numResurrectionStone = 0;               // int
    int32_t numAutoPaymentResStone = 0;             // AP_RESTONE（int）
    std::wstring autoPayResStoneLastDate;           // AP_RESTONE（wstring）
    std::vector<unit::UserSkillPageData> vecUserSkillPageData;  // SERV_SKILL_PAGE_SYSTEM
    std::vector<int16_t> vecSkillUnsealed;          // vector<short>
    int8_t skillNoteMaxPageNum = 0;                 // SERV_SKILL_NOTE（char）
    std::map<int8_t, int32_t> mapSkillNote;         // SERV_SKILL_NOTE（map<char,int>，char key eTAG_CHAR）
    unit::RelationshipInfo relationshipInfo;        // SERV_RELATIONSHIP_SYSTEM
};

bool PutSelectUnitReq(Serializer& ks, const SelectUnitReq& v);
bool GetSelectUnitReq(Serializer& ks, SelectUnitReq& v);
bool PutSelectUnitAck(Serializer& ks, const SelectUnitAck& v);
bool GetSelectUnitAck(Serializer& ks, SelectUnitAck& v);
bool PutSelectUnitNot1(Serializer& ks, const SelectUnitNot1& v);
bool GetSelectUnitNot1(Serializer& ks, SelectUnitNot1& v);

} // namespace select_unit
} // namespace x2
