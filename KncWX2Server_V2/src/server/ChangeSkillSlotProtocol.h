// ChangeSkillSlotProtocol.h — EGS_CHANGE_SKILL_SLOT_REQ/ACK（스킬 슬롯 변경／技能欄位變更）wire 結構＋決策。
// （V2 `x2::change_skill_slot` 命名空間）§0a24。
//
// 對齊對象：原 X2Project（SERV_SKILL_PAGE_SYSTEM／SERV_SKILL_SLOT_CHANGE_PACKET_INTEGRATE 皆已定義；
//   SERV_SKILL_CHANGE_COOL_TIME_AT_START_COUNT 亦已定義，但其冷卻檢查依賴 session timer，V2 無 session → 見偏差聲明）
//   KEGS_CHANGE_SKILL_SLOT_REQ { int m_iSlotID; int m_iSkillID }                （ClientPacket.h:2568／ClientPacket.cpp PUT/GET）
//   KEGS_CHANGE_SKILL_SLOT_ACK { int m_iOK; int m_iSlotID; int m_iSkillID;
//                               int m_iSlotID2; int m_iSkillID2 }                （ClientPacket.h:2580；INTEGRATE 追加後兩欄）
//   EGS_CHANGE_SKILL_SLOT_NOT { 同 ACK 前四欄 + UidType m_iUnitUID }              （ClientPacket.h:2606）
//   事件 ID（V2 EventIDs.h）：REQ=296, ACK=297, NOT=298。
//
// HandleChangeSkillSlotReq 對應原 GSUserGameCommon::IMPL_ON_FUNC(EGS_CHANGE_SKILL_SLOT_REQ)
//   （GSUserGameCommon.cpp:2756–2832）＋ KUserSkillTree::ChangeSkillSlot（UserSkillTree.cpp:353–470，
//    SERV_SKILL_SLOT_CHANGE_PACKET_INTEGRATE 版；非整合版 :292 未採用）＋ ChangeSkillSlot(int,int) :292 之共同語意。
//   演算法（整合版，原碼逐步）：
//     iSlotID2 = GetSlotID(iSkillID)  —— 該技能目前所在的欄位；未學會/未裝備 → -1
//     iSkillID2 = GetSkillID(iSlotID) —— 目標欄位目前裝備的技能（無 → 0）
//     [1] iSlotID 越界（<0 或 >= MAX_SKILL_SLOT=8）→ ERR_SKILL_09
//     [2] iSkillID == 0 → 清空 iSlotID（卸下）；
//         否則 iSkillID 必須已在「使用中頁」學會（IsExistOnUsedPage → 該頁 m_mapSkillTree 有列；
//         例外：SI_ETC_WS_COMMON_LOVE=6001 硬編碼恆存在），否則 ERR_SKILL_10；
//         且 iSlotID 屬欄位 B（索引 4..7）時，SlotB 已過期（now > m_tSkillSlotBEndDate）→ ERR_SKILL_13
//     [3] 僅當 0 <= iSlotID2 < 8：iSkillID2 > 0 且未學會 → ERR_SKILL_10；
//         若 iSlotID2 屬欄位 B 且已過期 → ERR_SKILL_13；
//         否則欄位 iSlotID2 寫入 iSkillID2（交換；iSkillID2==0 即清空）
//     [4] 欄位 iSlotID 寫入 iSkillID
//   ACK 成功時：iOK=NET_OK、iSlotID/iSkillID 回顯、iSlotID2=iSlotID2（未在任何欄位 → -1）、iSkillID2=iSkillID2（目標欄為空 → 0）。
//
// ⚠ 偏差聲明（V2 vs 原版）：
//   1. 原版「成功」只改寫記憶體 KUserSkillTree（該頁 m_aiSkillSlot）；DB 寫入**延遲到副本結束的
//      DBE_UPDATE_UNIT_INFO_REQ → Query_UpdateSkillSlotInfo**（GSGameDBThread.cpp:5801；
//      SERV_SKILL_PAGE_SYSTEM 下：gskillslotnew ← P_GSkillSlot_New_INS、gskillslot2new ← P_GSkillSlot2_New_INS，
//      每頁一列 upsert；SERV_ALL_RENEWAL_SP 未定義 → INS 路徑）。
//      V2 無 session UnitInfo、亦無副本結束路徑 → **write-through**（與 §0a10/§0a20 慣例一致）：
//      驗證通過後於單一 transaction 內 upsert 作用頁的 gskillslotnew/gskillslot2new 兩列
//      （B 列 EndDate 寫回 unit-global 值＝原 flush 行為；缺列 → INSERT）。
//      失敗 → 不落盤（原版為 in-memory 漸進修改，失敗後部分欄位可能已變更——V2 採 validate-then-commit，
//      失敗不改任何欄位）。
//   2. 原版於 [iSkillID2==0 且 iSlotID2 屬欄位 B 且已過期] 失敗路徑會**先把欄位 iSlotID2 寫成字面值 2**
//      （`SetSkillIDToSlotUsedPage( iSlotID2, 2 )`，顯然的原碼缺陷，成功路徑隨即被覆寫為 0）。
//      V2 不重現此缺陷：失敗即 ERR_SKILL_13、不寫任何欄位（涵蓋於偏差 1 的 validate-then-commit）。
//   3. 原碼 iSkillID 為負值時 [2] 的 `iSkillID > 0` 檢查直接放行（會把負技能 ID 寫進欄位）。
//      V2 將負值 iSkillID 視為未學會技能 → ERR_SKILL_10（gskill 表 SkillID>0 過濾使其不可能被學會）。
//   4. SlotB 過期判斷：原 write 路徑用嚴格 `tCurrentTime > m_tSkillSlotBEndDate`（UserSkillTree.cpp 整合版），
//      與 GetSkillSlotBExpirationState 的 `>=` 不一致——V2 沿用 write 路徑的 `>`。
//      m_tSkillSlotBEndDate 為 unit-global 值（V2 讀回 = gskillslot2new 最高頁之 EndDate，缺列/不可解析 → 哨兵
//      '2000-01-01 00:00:00' → 視為已過期，與 CreateUnit 後未購買 SlotB 的語意一致）；
//      **不**使用作用頁自身的 EndDate（原 KUserSkillTree 亦然——單一 unit-global EndDate）。
//      EndDate TEXT 以 UTC 字典序比較（與 EquipTitleProtocol IsExpired 相同慣例）。
//   5. SI_ETC_WS_COMMON_LOVE=6001：原碼硬編碼的「恆存在」技能（UserSkillTree.cpp:1222），V2 同值硬編碼；
//      真值來自 CXSLSkillTree Lua 列舉，不隨倉庫提供。其餘須學會 = gskill 列（作用頁、SkillID>0、SkillLevel>0）。
//   6. VERIFY_STATE（S_FIELD_MAP/S_ROOM）V2 無 FSM → 不適用。
//      SERV_SKILL_CHANGE_COOL_TIME_AT_START_COUNT（3 秒冷卻，需 m_kTimer）V2 無 session timer → 不移植。
//      成功時原版若人在 Room（PVP/副本/競技場/練習場）送 ERM_SET_UNIT_INFO_NOT 廣播、否則不送；
//      V2 無 Room/Field 子系統 → 不送 NOT（EGS_CHANGE_SKILL_SLOT_NOT 亦不產生）。
//   7. DB 讀取/寫入失敗：原版無對應路徑（僅 in-memory）；V2 映射 ERR_SKILL_14
//      （原「스킬 슬롯 B 확장 중 DB오류가 발생하였습니다」——V2 借用為「欄位寫入的 DB 失敗」語列）。
//   8. 原 ACK 失敗路徑未設 m_iSlotID/m_iSkillID/m_iSlotID2/m_iSkillID2（保留 ctor 預設 -1/0/-1/0）；
//      V2 同（ack 以預設初始化，失敗不回顯輸入值）。成功路徑回顯同原碼。
//   9. 線路佈局為自洽 golden bytes，未對原 SDK 實機驗證。
#pragma once

#include <cstdint>
#include <string>

#include "../db/GameStore.h"

namespace x2 { class Serializer; }

namespace x2 { namespace change_skill_slot {

constexpr int32_t kSkillSlotCount = 8;   // MAX_SKILL_SLOT（A1..A4=0..3，B1..B4=4..7）
constexpr int32_t kSlotBFirstIndex = 4;  // SKILL_SLOT_B1
constexpr int32_t kCommonLoveSkillId = 6001;  // SI_ETC_WS_COMMON_LOVE（原碼硬編碼）

struct ChangeSkillSlotReq          // EGS_CHANGE_SKILL_SLOT_REQ（296）
{
    int32_t iSlotID = -1;          // 原 int，ctor 預設 -1
    int32_t iSkillID = 0;          // 原 int，ctor 預設 0；0 = 卸下該欄位
};

struct ChangeSkillSlotAck          // EGS_CHANGE_SKILL_SLOT_ACK（297）
{
    int32_t iOK = 0;               // NetError（NET_OK=0；ERR_SKILL_09=164；ERR_SKILL_10=165；ERR_SKILL_13=167；ERR_SKILL_14=168）
    int32_t iSlotID = -1;          // 成功時回顯 req.iSlotID；失敗時保留 -1（原 ACK ctor 預設）
    int32_t iSkillID = 0;          // 成功時回顯 req.iSkillID；失敗時保留 0
    int32_t iSlotID2 = -1;         // 成功時＝該技能交換前所在欄位（未裝備 → -1）；失敗時保留 -1
    int32_t iSkillID2 = 0;         // 成功時＝被擠出的技能（目標欄為空 → 0）；失敗時保留 0
};

bool PutChangeSkillSlotReq(Serializer& ks, const ChangeSkillSlotReq& v);
bool GetChangeSkillSlotReq(Serializer& ks, ChangeSkillSlotReq& v);
bool PutChangeSkillSlotAck(Serializer& ks, const ChangeSkillSlotAck& v);
bool GetChangeSkillSlotAck(Serializer& ks, ChangeSkillSlotAck& v);

// 決策層（原 EGS_CHANGE_SKILL_SLOT_REQ handler；unitUID 對應原 GetCharUID()，由呼叫端傳入）。
//   流程：LoadSkillPageState（自癒 slotA 整表缺列）→ 取作用頁 8 欄位 → 學會集（作用頁 gskill；+6001）
//         → 驗證（validate-then-commit）→ 單一 transaction upsert 作用頁 gskillslotnew/gskillslot2new
//   nowUtc 空 → 執行時刻 UTC（'YYYY-MM-DD HH:MM:SS'）；僅供測試注入固定時間。
//   任何路徑都產出 ACK（鏡像原 end_proc）；err 僅供伺服器側日誌。
int32_t HandleChangeSkillSlotReq(db::GameStore& gameDb, int64_t unitUID,
                                 const ChangeSkillSlotReq& req,
                                 ChangeSkillSlotAck& ack,
                                 std::string& err,
                                 const std::string& nowUtc);

} // namespace change_skill_slot
} // namespace x2
