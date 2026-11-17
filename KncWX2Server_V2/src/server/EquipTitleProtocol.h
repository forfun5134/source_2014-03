// EquipTitleProtocol.h — EGS_EQUIP_TITLE_REQ/ACK（칭호 장착/해제）wire 結構＋決策。
// （V2 `x2::equip_title` 命名空間）§0a20。
//
// 對齊對象：原 X2Project（SERV_TITLE_DATA_SIZE 已定義；SERV_RELATIONSHIP_SYSTEM 與本事件無互動）
//   KEGS_EQUIP_TITLE_REQ { int m_iTitleID }                     （ClientPacket.h:5039／ClientPacket.cpp:7385–7395）
//   KEGS_EQUIP_TITLE_ACK { int m_iOK; int m_iTitleID }          （ClientPacket.h:5044／ClientPacket.cpp:7397–7410）
//   事件 ID（V2 EventIDs.h）：REQ=543, ACK=544。PUT/GET 順序機讀自原 ClientPacket.cpp。
//
// HandleEquipTitleReq 對應原 GSUserGameCommon::IMPL_ON_FUNC( EGS_EQUIP_TITLE_REQ )（GSUserGameCommon.cpp:6540–…）
//   ＋ KUserTitleManager::EquipTitle 的驗證段（UserTitleManager.cpp:1437–1506）：
//     iTitleID != 0：
//       [1] SiCXSLTitleManager()->IsExistTitleID(iTitleID) —— 稱號 templet 腳本表存在性。
//           **V2 無稱號腳本表** → 不執行此檢查（偏差聲明 1）；持有檢查（[3]）覆蓋絕大多數場景。
//       [2] m_iEquippedTitle == iTitleID → ERR_TITLE_01（已裝備中的稱號）
//       [3] 未持有（m_mapTitle 無該 ID）→ ERR_TITLE_00
//       [4] 過期（tCurTime > m_kCTime；NULL EndDate＝永久）→ ERR_TITLE_02
//     iTitleID == 0 → 直接脫下（無 [1]–[4]）。
//   ✔ ACK 一律送出（原碼 end_proc 慣例）；iOK = NetError（NET_OK=0 / ERR_TITLE_00=494 / ERR_TITLE_01=495 / ERR_TITLE_02=496）。
//
// ⚠ 偏差聲明（V2 vs 原版）：
//   1. 稱號 templet 腳本表（SiCXSLTitleManager / Title.lua）未隨倉庫提供 → 不驗證「稱號存在性」（ERR_TITLE_03 不會由 V2 產生；
//      見 [1]）。原 iTitleID 合法性由 DB 持有列背書（gtitle_complete 主鍵 (UnitUID, TitleID)）。
//   2. 原版「成功」只改寫記憶體 KUserTitleManager（in-memory）；DB 寫入**延遲到 DBE_UPDATE_UNIT_INFO_REQ**（Query_UpdateUnit：
//      `gup_update_title_hang(UnitUID, m_iInitTitleID, m_iEquippedTitleID)`；SERV_TITLE_DATA_SIZE）。
//      V2 無 session UnitInfo、亦無副本結束路徑 → **write-through**（與社群選項 §0a10 慣例一致）：
//      驗證通過後立即以單一 transaction 執行等價 SQL（EquipTitleHang；proc 本身隨附於倉庫，其語義逐字移植：
//      @iTitleID=0 → 全部 IsHang=0；否則 detach @iOldID=old equipped（≠0 且≠new）、attach @iTitleID）。
//   3. m_iEquippedTitle：原版讀記憶體；V2 無 FSM/session → **讀 DB**（gtitle_complete 中首個 IsHang=1（TitleID ASC），
//      與選角路徑 §0a19 的 equippedTitleID 一致）。並發下以 transaction 內再驗證 attached 列兜底（見 GameStore::EquipTitleHang）。
//   4. 過期判斷：EndDate TEXT（'YYYY-MM-DD HH:MM:SS'，UTC）以**字串比較**對 today（空字串 → 執行時 UTC）；
//      NULL EndDate（永久）恆有效；無法解析的非空 EndDate → 視為過期（fail closed＝原 CTime 轉換失敗後 GetTime()=0 < now 的語義）。
//   5. VERIFY_STATE（S_FIELD_MAP/S_ROOM）V2 無 FSM → 不適用；發送 ERM_CHANGE_EQUIPPED_*_NOT（Field/Room）V2 無 Room/Field 子系統 → 不移植。
//   6. 失敗路徑 ACK 的 m_iTitleID：原版回顯輸入值；V2 同（回顯，不歸零——與社群選項 §0a10「kDenyOptions 歸零」不同；
//      原碼此處 ACK 未觸碰 m_iTitleID，保持回顯是更忠實的選擇）。
//   7. 線路佈局為自洽 golden bytes，未對原 SDK 實機驗證。
#pragma once

#include <cstdint>
#include <string>

#include "../db/GameStore.h"

namespace x2 { class Serializer; }

namespace x2 { namespace equip_title {

struct EquipTitleReq          // EGS_EQUIP_TITLE_REQ（543）
{
    int32_t iTitleID = 0;     // 原 int（SERV_TITLE_DATA_SIZE）；0 = 脫下（全部）
};

struct EquipTitleAck          // EGS_EQUIP_TITLE_ACK（544）
{
    int32_t iOK = 0;          // NetError（NET_OK=0；ERR_TITLE_00=494；ERR_TITLE_01=495；ERR_TITLE_02=496）
    int32_t iTitleID = 0;     // 回顯輸入值（原碼同）
};

bool PutEquipTitleReq(Serializer& ks, const EquipTitleReq& v);
bool GetEquipTitleReq(Serializer& ks, EquipTitleReq& v);
bool PutEquipTitleAck(Serializer& ks, const EquipTitleAck& v);
bool GetEquipTitleAck(Serializer& ks, EquipTitleAck& v);

// 決策層（原 EGS_EQUIP_TITLE_REQ handler；unitUID 對應原 GetCharUID()，由呼叫端傳入）：
//   1) iTitleID != 0：
//      a) 未持有 → ERR_TITLE_00（DBE 慣例：不動 DB）
//      b) 已裝備中 → ERR_TITLE_01
//      c) 已過期 → ERR_TITLE_02（nowUtc 為 "" → 以執行時 UTC 比較字串）
//   2) EquipTitleHang 寫入失敗 → ERR_TITLE_04（498，「稱號を獲得できませんでした」）：
//      原無「稱號 DB 失敗」碼；選用最接近語意的 ERR_TITLE_04（非 ERR_TITLE_03「稱號不存在」，避免誤導）。
//   3) 成功 → NET_OK。
// err 僅供伺服器側日誌；ACK 一律產出（原 end_proc 慣例）。
int32_t HandleEquipTitleReq(db::GameStore& gameDb, int64_t unitUID,
                            const EquipTitleReq& req,
                            EquipTitleAck& ack,
                            std::string& err,
                            const std::string& nowUtc = "");

} // namespace equip_title
} // namespace x2
