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
// outNot3（可為 nullptr）：成功時填入 SELECT_UNIT_3_NOT 的最小合法內容（見 BuildSelectUnitNot3）；
// outNot4（可為 nullptr）：成功時填入 SELECT_UNIT_4_NOT 的最小合法內容（見 BuildSelectUnitNot4）；
// outNot5（可為 nullptr）：成功時填入 SELECT_UNIT_5_NOT 的最小合法內容（見 BuildSelectUnitNot5）；
//   失敗時不動。呼叫端應「先送 1_NOT…5_NOT，再送收尾 ACK」（對照原版 SendSelectUnitACK 的次序）。
int32_t HandleSelectUnitReq(db::GameStore& gameDb, int64_t userUID, const SelectUnitReq& req,
                            SelectUnitAck& ack, std::string& err,
                            bool secondSecurityOk = true,
                            db::GUnitRecord* outUnit = nullptr,
                            SelectUnitNot1* outNot1 = nullptr,
                            int authLevel = 0,
                            SelectUnitNot2* outNot2 = nullptr,
                            SelectUnitNot3* outNot3 = nullptr,
                            SelectUnitNot4* outNot4 = nullptr,
                            SelectUnitNot5* outNot5 = nullptr);

// 組裝 SELECT_UNIT_5_NOT（成功路徑的首次選擇/ETC 分片）。
// 誠實說明：V2 無 spirit/CHAR_LOG/pshop-agency/henir-reward/cashshop 狀態表，
// 全 false/0/空容器（誠實佔位；不代表角色真實狀態）。iOK=NET_OK。
void BuildSelectUnitNot5(SelectUnitNot5& out);

// EGS_GET_MY_INVENTORY_REQ 決策（原 IMPL_ON_FUNC_NOPARAM(EGS_GET_MY_INVENTORY_REQ)）：
// 依槽位分類把 items 分組成 SELECT_UNIT_INVENTORY_INFO_NOT 分片（空 category 不送，
// 與原 KInventory::GetSelectUnitInventoryInfo 一致）。
// 誠實說明：V2 **沒有背包 DB 表**（gunit 無 items 欄位；1_NOT 的 items 亦為佔位）；
// 呼叫方須自行提供 items（目前僅測試以合成資料注入）。原版會跳過 CXSLInventory
// ST_BANK / ST_E_EQUIP 兩類，V2 未建模該分類常量，**不跳過**。
// outAck：iOK=NET_OK、bIsRecommend=false（V2 無推薦系統狀態，佔位）。
// 回傳分片數量（= outNots.size()）。
size_t HandleGetMyInventoryReq(const std::map<int64_t, unit::InventoryItemInfo>& items,
                               GetMyInventoryAck& outAck,
                               std::vector<SelectUnitInventoryInfoNot>& outNots);

// 組裝 SELECT_UNIT_4_NOT（成功路徑的社交/教學/Henir排行/Messenger/戰場狀態分片）。
// 誠實說明：V2 game DB 無黑名單/拒絕選項/教學/連線時間/Henir排行/好友/戰場狀態表，
// 容器一律空、旗標全 false/0（kDenyOptions 全 0；不代表角色真實狀態）。iOK=NET_OK。
void BuildSelectUnitNot4(SelectUnitNot4& out);

// 組裝 SELECT_UNIT_3_NOT（成功路徑的使命/稱號/寵物分片）。
// 誠實說明：V2 game DB 無 mission/title/pet/petItem 表，這些容器一律空、iSummonedPetUID=0——
// 不代表角色真實使命/稱號/寵物狀態。iOK=NET_OK。
void BuildSelectUnitNot3(SelectUnitNot3& out);

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
