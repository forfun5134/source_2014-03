// CurrentTimeProtocol.h — EGS_CURRENT_TIME_REQ/ACK（サーバー現在時刻）wire 結構＋決策。
// （V2 `x2::current_time` 命名空間）§0a22。
//
// 對齊對象：原 X2Project（SERV_INT_INTERNAL＝JP）
//   KEGS_CURRENT_TIME_REQ = NOPARAM（無欄位）                  （ClientPacket.h:4865 附近）
//   KEGS_CURRENT_TIME_ACK { std::wstring m_wstrCurrentTime;
//     #ifdef SERVER_CURRENT_TIME_INT64   __int64 m_tCurrentTime;   #endif }  （ClientPacket.h:4865–4875）
//   事件 ID（V2 EventIDs.h）：REQ=507, ACK=508。PUT/GET 順序機讀自原 ClientPacket.cpp:7070–7086。
//   SERVER_CURRENT_TIME_INT64 **未定義**（ServerDefine.h 無此巨集）→ ACK 僅 m_wstrCurrentTime。
//
// HandleCurrentTimeReq 對應原 GSUserGameCommon::IMPL_ON_FUNC_NOPARAM( EGS_CURRENT_TIME_REQ )（GSUserGameCommon.cpp:6232–6244）：
//   CTime::GetCurrentTime().Format( _T( "%Y-%m-%d %H:%M:%S" ) ) → wstrCurrentTime；無 DB、無狀態檢查、無條件送出。
//
// ⚠ 偏差聲明（V2 vs 原版）：
//   1. **時區**：原 CTime::GetCurrentTime() 為**本地時間**（Windows CTime 語意）；V2 以 localtime_r/gmtime_s 格式化本地時間
//      （對應相同語意；偏差為實作層差異：Windows CRT 與 POSIX 的本地時區來源不同——皆屬 "server local time"）。
//   2. 字串寬度：原 Format 產生「YYYY-MM-DD HH:MM:SS」固定 19 寬 ASCII；V2 同（手動組裝，不依賴 strftime）。
//   3. **nowUtc 注入**：HandleCurrentTimeReq 接受 `const std::wstring& wstrNow = L""`；非空則直接採用（測試用），
//      空則計算本地時間（勿用注入值上線）。
//   4. VERIFY_STATE / 無（原 NOPARAM handler 無狀態檢查）。
//   5. 線路佈局為自洽 golden bytes，未對原 SDK 實機驗證。
#pragma once

#include <cstdint>
#include <string>

namespace x2 { class Serializer; }

namespace x2 { namespace current_time {

struct CurrentTimeReq          // EGS_CURRENT_TIME_REQ（507）—— NOPARAM
{
};

struct CurrentTimeAck          // EGS_CURRENT_TIME_ACK（508）
{
    std::wstring wstrCurrentTime;   // 原 m_wstrCurrentTime；"YYYY-MM-DD HH:MM:SS"（19 寬 ASCII）
};

bool PutCurrentTimeReq(Serializer& ks, const CurrentTimeReq& v);
bool GetCurrentTimeReq(Serializer& ks, CurrentTimeReq& v);
bool PutCurrentTimeAck(Serializer& ks, const CurrentTimeAck& v);
bool GetCurrentTimeAck(Serializer& ks, CurrentTimeAck& v);

// 決策層（原 handler；無參數）。wstrNow 非空 → 直接採用（測試注入）；空 → 本地時間。
void HandleCurrentTimeReq(const CurrentTimeReq& req, CurrentTimeAck& ack, const std::wstring& wstrNow = L"");

} // namespace current_time
} // namespace x2
