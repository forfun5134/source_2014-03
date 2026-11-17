// CreateUnitProtocol.h — EGS_CREATE_UNIT_REQ / EGS_CREATE_UNIT_ACK（建立角色）wire 結構。
// （V2 `x2::create_unit` 命名空間）
//
// 對齊對象：原 X2Project（SERV_INT_INTERNAL＝JP 內部版本）
//   KEGS_CREATE_UNIT_REQ { std::wstring m_wstrNickName; int m_iClass; }
//   KEGS_CREATE_UNIT_ACK {
//       int m_iOK;
//       KUnitInfo m_kUnitInfo;
//       std::vector<int> m_vecSkillSlot;
//       std::wstring m_wstrEnableDate;
//       （SERV_GUARANTEE_UNIQUENESS_OF_NAME_CN 未定義 → 無 m_bReqGiant_DeleteName / m_wstrNickName）
//   }
// 事件 ID（V2 EventIDs.h 實測）：REQ=36, ACK=37。
//
// ⚠ 線路佈局為自洽 golden bytes，未對原 SDK 實機驗證。
// ⚠ vecSkillSlot / wstrEnableDate 由原 AccountDB（DBE_ACCOUNT_CREATE_UNIT_*）填寫；V2 無 AccountDB 建角副作用，
//   HandleCreateUnitReq 一律回空 vector / 空字串（誠實佔位；不代表原版語意）。
#pragma once

#include <cstdint>
#include <string>
#include <vector>

#include "UnitData.h"

namespace x2 { class Serializer; }

namespace x2 { namespace create_unit {

struct CreateUnitReq
{
    std::wstring wstrNickName;   // 原 m_wstrNickName（wstring）
    int32_t iClass = 0;          // 原 m_iClass（int）
};

struct CreateUnitAck
{
    int32_t iOK = 0;                     // NetError（NET_OK=0；見 NetError.h ERR_CREATE_UNIT_00..09）
    unit::UnitInfo kUnitInfo;            // 原 m_kUnitInfo（KUnitInfo）
    std::vector<int32_t> vecSkillSlot;   // 原 m_vecSkillSlot（vector<int>）
    std::wstring wstrEnableDate;         // 原 m_wstrEnableDate（wstring）
};

bool PutCreateUnitReq(Serializer& ks, const CreateUnitReq& v);
bool GetCreateUnitReq(Serializer& ks, CreateUnitReq& v);
bool PutCreateUnitAck(Serializer& ks, const CreateUnitAck& v);
bool GetCreateUnitAck(Serializer& ks, CreateUnitAck& v);

} // namespace create_unit
} // namespace x2
