// UnitSelectArbiter.h — SELECT_UNIT 的決策層（game DB 查詢 + 驗證）
//
// 對應原版流程（JP INT_INTERNAL, SERV_SELECT_UNIT_PACKET_DIVISION 定義）：
//   GSUserGameCommon::IMPL_ON_FUNC(EGS_SELECT_UNIT_REQ)
//     → 二級密碼閘門（SERV_SECOND_SECURITY）：未驗證 → ERR_VERIFY_21
//     → SendToGameDB(DBE_GAME_SELECT_UNIT_REQ)
//     → GSGameDBThread::Query_SelectUnit → gup_select_unit(UnitUID[, iUserUID]) 讀角色 + 檢查歸屬
//     → DBE_GAME_SELECT_UNIT_ACK → GSUserFunction::SendSelectUnitACK
//        ├─ iOK != NET_OK → EGS_SELECT_UNIT_ACK{iOK}（本層回應的亦只有這一條 wire 訊息）
//        └─ NET_OK → SELECT_UNIT_1_NOT…5_NOT + 收尾 EGS_SELECT_UNIT_ACK{NET_OK}
//
// V2 對應：
//   UnitSelectArbiter::HandleSelectUnitReq(GameStore&, userUID, req, ack, err[, outUnit])
//     - 決策：unit 不存在或已刪除 → ERR_SELECT_UNIT_00（35）
//             unitUID 不屬於此 userUID（或單位 ID 非法）→ ERR_SELECT_UNIT_07（1081，常數實測編譯值）
//             DB 錯誤 → ERR_SELECT_UNIT_05（39）
//             二級密碼未驗證（secondSecurityOk=false）→ ERR_VERIFY_21（578，實測編譯值）
//             成功 → NET_OK + RecordUnitLogin（LoginCount+1、LastDate=now，比照原版角色登入副作用）
//   ⚠ 二級密碼閘門目前只有 bool 參數（V2 尚無帳號二級認證服務）；
//   ⚠ SELECT_UNIT_1_NOT…5_NOT 分片訊息未移植，本層成功時僅回送 EGS_SELECT_UNIT_ACK{NET_OK}。
//     真實客戶端在收到 ACK 後仍缺 1_NOT…5_NOT 會無法進大廳 —— 見 docs/architecture.md §12。
//   不洩漏 DB 錯誤細節給客戶端（對外僅 ERR_SELECT_UNIT_05）；err 僅供伺服器日誌。
#pragma once

#include <cstdint>
#include <string>

#include "../db/GameStore.h"
#include "SelectUnitProtocol.h"

namespace x2 { namespace select_unit {

// 成功時回傳 NET_OK；失敗回傳對應 NetError；DB 錯誤訊息寫入 err（僅伺服器側用）。
// outUnit（可為 nullptr）：成功時帶出已更新 LoginCount 的角色記錄。
// outNot1（可為 nullptr）：成功時填入 SELECT_UNIT_1_NOT 的最小合法內容（見 BuildSelectUnitNot1）；
// outNot2（可為 nullptr）：成功時填入 SELECT_UNIT_2_NOT 的最小合法內容（見 BuildSelectUnitNot2）；
//   失敗時不動。呼叫端應「先送 1_NOT、2_NOT…，再送收尾 ACK」（對照原版 SendSelectUnitACK 的次序）。
int32_t HandleSelectUnitReq(db::GameStore& gameDb, int64_t userUID, const SelectUnitReq& req,
                            SelectUnitAck& ack, std::string& err,
                            bool secondSecurityOk = true,
                            db::GUnitRecord* outUnit = nullptr,
                            SelectUnitNot1* outNot1 = nullptr,
                            int authLevel = 0,
                            SelectUnitNot2* outNot2 = nullptr);

// 組裝 SELECT_UNIT_2_NOT（成功路徑的任務進度分片）。
// 誠實說明：V2 game DB 無任務/日常任務/隨機日常任務表，vecQuest/vecCompletQuest/mapRandomQuestList
// 一律空容器——不代表角色真實任務狀態。iOK=NET_OK。
void BuildSelectUnitNot2(SelectUnitNot2& out);

// 由 GUnitRecord 組裝 SELECT_UNIT_1_NOT（成功路徑的角色資料分片，第一手資料）。
// 誠實說明：V2 game DB 僅有 gunit 一表可用——items/quests/titles/resStone/spirit/rating 等
// 無資料來源，一律填 0/空容器；該值「不代表」角色實際狀態，僅為格式完整的佔位。
// unitCreateDate=regDate、unitLastLoginDate=lastDate、lastPos.mapID=lastPosition、
// Stat ← gunit 的 BaseHP/Atk*/Def*、win/lose ← GUnit.Win/Lose、exp/level ← GUnit。
// vecUserSkillPageData 填一頁全預設資料（與 unitSkillData pages=1/1 一致）。
void BuildSelectUnitNot1(int64_t userUID, int authLevel, const db::GUnitRecord& unit,
                         SelectUnitNot1& out);

} // namespace select_unit
} // namespace x2
