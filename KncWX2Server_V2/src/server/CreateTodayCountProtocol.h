// CreateTodayCountProtocol.h — EGS_GET_CREATE_UNIT_TODAY_COUNT_REQ / _ACK（今日建立角色數）wire 結構。
// （V2 `x2::today_count` 命名空間）
//
// 對齊對象：原 X2Project（SERV_ENTRY_POINT 已定義 ServerDefine.h:4304；SERV_INT_INTERNAL＝JP 內部版本）
//   KEGS_GET_CREATE_UNIT_TODAY_COUNT_REQ：客戶端→伺服器為 NOPARAM 事件（IMPL_ON_FUNC_NOPARAM），無酬載。
//   KEGS_GET_CREATE_UNIT_TODAY_COUNT_ACK { UidType m_iUserUID; std::map<int,int> m_mapCreateCharCountToday; }
//   （first=server group, second=當日建立數；SERV_ENTRY_POINT 下 REQ 經 GameDB 一次彙總，DOUBLE_SERVER_GROUP 才走 2nd DB）
// 事件 ID（V2 EventIDs.h 實測）：REQ=1163, 1ST_ACK=1164, ACK=1165。
//
// 流程折疊：原碼 1ST_ACK→SINGLE_SERVER_GROUP 直接回 Client / DOUBLE_SERVER_GROUP 轉 2nd GameDB；
//   V2 無 server group、無 2nd GameDB，SINGLE_SERVER_GROUP 語意折疊為單段處理（ACK 直接回覆）。
//
// ⚠ m_mapCreateCharCountToday 的 key=serverGroupID；V2 無 server group 設定 → 一律 0（誠實佔位）。
// ⚠ 原版外部 Serializer SDK 的 std::map wire 編碼無法從本倉庫驗證；V2 直接復用內建 eTAG_MAP 模板
//   （count-prefixed），為自洽 golden bytes，**未對原 SDK 實機驗證**。
#pragma once

#include <cstdint>
#include <map>

namespace x2 { class Serializer; }

namespace x2 { namespace today_count {

struct GetCreateUnitTodayCountReq
{
    // 無酬載（原 IMPL_ON_FUNC_NOPARAM）
    bool operator==(const GetCreateUnitTodayCountReq&) const { return true; }
};

struct GetCreateUnitTodayCountAck
{
    int64_t iUserUID = 0;                            // 原 m_iUserUID（UidType）
    std::map<int32_t, int32_t> mapCreateCharCountToday;  // 原 m_mapCreateCharCountToday（first=server group, second=count）
};

bool PutGetCreateUnitTodayCountReq(Serializer& ks, const GetCreateUnitTodayCountReq& v);
bool GetGetCreateUnitTodayCountReq(Serializer& ks, GetCreateUnitTodayCountReq& v);
bool PutGetCreateUnitTodayCountAck(Serializer& ks, const GetCreateUnitTodayCountAck& v);
bool GetGetCreateUnitTodayCountAck(Serializer& ks, GetCreateUnitTodayCountAck& v);

} // namespace today_count
} // namespace x2
