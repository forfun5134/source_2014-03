// ResetSkillProtocol.h — EGS_RESET_SKILL_REQ/ACK（스킬 초기화／技能重置道具消耗）wire 結構＋決策。
// （V2 `x2::reset_skill` 命名空間）§0a25。
//
// 對齊對象：原 X2Project（SERV_SKILL_PAGE_SYSTEM／SERV_UPGRADE_SKILL_SYSTEM_2013 皆已定義）
//   KEGS_RESET_SKILL_REQ { int m_iSkillID; int m_iActiveSkillPageNumber }        （ClientPacket.h:4827；ClientPacket.cpp PUT/GET）
//   KEGS_RESET_SKILL_ACK { int m_iOK; int m_iActiveSkillPageNumber; int m_iDelSkillID;
//                          int m_iSPoint; int m_iCSPoint;
//                          std::vector<KInventoryItemInfo> m_vecInventorySlotInfo } （ClientPacket.h:4839）
//   wire 順序＝ PUT 順序：iOK, iActiveSkillPageNumber, iDelSkillID, iSPoint, iCSPoint, vec。
//   事件 ID（V2 EventIDs.h）：REQ=305, ACK=306。
//
// HandleResetSkillReq 對應原 GSUserGameCommon::IMPL_ON_FUNC(EGS_RESET_SKILL_REQ)
//   （GSUserGameCommon.cpp:4642–4887）＋ IMPL_ON_FUNC(DBE_RESET_SKILL_ACK)（同檔:4900–5040，
//   原於 DBE_RESET_SKILL_REQ 的 DB worker（GSGameDBThread.cpp:14731–）成功後才執行技能列重置與成功 ACK）。
//   V2 無 DB worker/無副本結束路徑 → 單一函數內「驗證 → 單一 transaction 提交 → 組 ACK」（write-through，
//   與 §0a10/§0a20/§0a24 慣例一致；失敗整體 rollback＝原失敗路徑的回滾語義，但不產生中途可見狀態）。
//
// 演算法（原碼逐步對位；SERV_SKILL_PAGE_SYSTEM 分支）：
//   [0] 背包鎖定檢查 → ERR_INVENTORY_LOCK_00　（V2 無背包鎖定子系統 → 不適用；偏差聲明 1）
//   [1] req.iActiveSkillPageNumber != 作用頁 → ERR_SKILL_PAGE_01（1387）
//   [2] GetSkillTemplet(skillID) == NULL → ERR_RESET_SKILL_00　（V2 無 SkillTemplet → 見偏差聲明 2）
//   [3] GetSkillTreeTemplet(class, skillID) == NULL → ERR_RESET_SKILL_00　（V2 無技能樹 templet → 見偏差聲明 3）
//   [4] CheckResetSkill：GetSkillLevel(作用頁) < 1 → ERR_SKILL_20（200）
//       bSKillInitLevel 初值 true；IsUnitTypeDefaultSkill(id) || !IsAllFollowingSkillLevelZero(id) → false
//       （V2：IsAllFollowingSkillLevelZero ≡ true（無前置技能資料）；IsUnitTypeDefaultSkill＝
//         CreateUnit 預設技能 {10000,20030,30000,40010}；見偏差聲明 4/5）
//   [5] GetSkillLevelAndCSP(作用頁 gskill(SkillLevel,SkillCSPoint))；失敗 → ERR_RESET_SKILL_00
//   [6] iAfterDelSkillLevel = bSKillInitLevel ? 0 : 1
//   [7] GetSkillSlot（作用頁 8 欄位）；若該技能已裝備 && iAfterDelSkillLevel <= 0 && iDelSkillLevel > 0
//       → ERR_RESET_SKILL_05（449，「裝備中不可重置」）
//   [8] SP 退還：i==0 且 iAfterDelSkillLevel==0 → += m_iRequireLearnSkillPoint（V2 定數 1；偏差聲明 6）；
//       其餘每級 → += m_iRequireUpgradeSkillPoint（V2 定數 1）；iAfterSP -= iDelSkillCSPoint（可為負，原同）
//   [9] CSP 退還：IsCashSkillPointExpired()（V2＝ gskillcash.MaxCSPoint == 0；偏差聲明 8）false →
//       iAfterCSP = curCSP + invested；超過 maxCSPoint → 溢出部分加回 SP，iAfterCSP 截斷；
//       true（未啟用現金技能點）→ iAfterCSP = 0（invested 的 CSP 直接消失，原同）
//   [10] ResetSkillItem：依 JP 生效優先序探測重置道具（UNLIMITED 60008069 → EVENT2 160947 → EVENT 130808 →
//        EI_EVENT2 67003592 → CI_SKILL_RESET_ITEM 200730；地區 SERV_* 開關未移植——偏差聲明 7）；
//        使用者背包分類 ST_*（1..7）且為數量型且數量 ≥ 1；最早的是數量最少的堆疊（原 PT_QUANTITY 升序）。
//        無可消耗道具 → ERR_RESET_SKILL_01（445），不落盤
//   [11] DBE_RESET_SKILL_REQ 等價物（單一 transaction）：
//        a. gitemquantity Quantity -= 1（數量不足/未命中 → 整體 rollback → ERR_RESET_SKILL_02=446）
//        b. 數量歸零 → gitem 軟刪除（DelDate = max(nowUtc, RegDate+1s)；原 gup_delete_item 慣例）
//        c. 技能列：iAfterDelSkillLevel <= 0 → DELETE gskill（作用頁該列）；否則 UPDATE SkillLevel=1, SkillCSPoint=0
//           （失敗 → rollback → ERR_RESET_SKILL_03=447）
//        d. gunit.SPoint += iAfterSP（可為負）；讀回絕對值供 ACK（失敗 → rollback → ERR_RESET_SKILL_03）
//        e. gskillcash upsert CSPoint=iAfterCSP（失敗 → rollback → ERR_SKILL_24=204；偏差聲明 9）
//   [12] EGS_RESET_SKILL_ACK：iOK=NET_OK、iActiveSkillPageNumber=req 頁、iDelSkillID=skillID、
//        iSPoint/iCSPoint=提交後讀回值、m_vecInventorySlotInfo=[消耗後道具資訊（歸零刪除→ itemUID=0 空槽）]。
//        失敗 ACK：見偏差聲明 10（A 相＝全零＋空向量；B 相＝回顯 iActiveSkillPageNumber/iDelSkillID＋[未變更道具槽]，iSPoint/iCSPoint=0）。
//
// ⚠ 偏差聲明（V2 vs 原版）：
//   1. 背包鎖定（KInventory::IsLocked）V2 無此子系統 → 不檢查、不產生 ERR_INVENTORY_LOCK_00(1030)。
//   2. SkillTemplet（SiCXSLSkillTree()->GetSkillTemplet）不在倉庫（NewSkillTempletVer2.lua；且 in-repo 的
//      NewSkillTreeTable.xlsm 為 2011 定稿、技能 ID 空間與 V2 CreateUnit 寫入的 legacy ID 不相交）→
//      V2 以「skillID > 0」通過此檢查；技能不存在的錯誤由 [4]（未學會 → ERR_SKILL_20）承接，
//      與原碼 GetSkillLevel<1 分支同碼。ERR_RESET_SKILL_00 僅自 [5] 路徑可達。
//   3. SkillTreeTemplet 逐職業技能樹同上缺資料 → V2 不做逐職業合法性/費用判定（與 §0a23 偏差 12 一致）。
//   4. IsAllFollowingSkillLevelZero：無 m_vecFollowingSkill 資料 → ≡ true（所有後續技能等級為 0）；
//      副作用：有後續技能時原版會把重置後等級保留為 1，V2 一律重置到 0（預設技能走 [4] 的 default 分支＝保留 1）。
//   5. IsUnitTypeDefaultSkill：原 m_setDefaultSkill 來自 Lua → V2 以 CreateUnit 預設技能集合
//      {10000=Swordsman, 20030=VioletMage, 30000=ElvenRanger, 40010=Fighter}（class 1..4；見 GameStore
//      InsertCreateUnitSideEffects）近似；class 5+（Eve/Elesis/Chung/Ara…）無可考來源 → 非預設技能。
//   6. RequireLearnSkillPoint / RequireUpgradeSkillPoint 不在倉庫 → V2 定數 1/1（每級 1 SP 推定；
//      可隨資料落地改為 per-skill 費用）。
//   7. 重置道具優先序採 JP 參考地區生效集（SERV_UNLIMITED_SKILL_RESET_ITEM/JP 已定義、
//      SERV_EVENT_CASH_SKILL_POINT_ITEM_JP 於 JP/CN/US/EU 已定義；CI_SKILL_RESET_EVENT_ITEM(130808)/EVENT2(160947)/
//      CI_SKILL_RESET_ITEM(200730) 恆定義）：60008069 → 160947 → 130808 → 67003592 → 200730。
//      其餘地區/事件道具（COBO 135433、RESET_A 60001726、RURIEL 67006453/67006451、2ND_CLASS 141000036、
//      QUEST 141000000）之 SERV_* 開關未移植 → 不列入探測。數量型最少堆疊優先消耗的排序為近似實作
//      （原 PT_QUANTITY 升序 bubble 近似＋map ItemUID 序，V2 固定 ORDER BY Quantity ASC, ItemUID ASC）。
//   8. IsCashSkillPointExpired：原 SERV_SKILL_PAGE_SYSTEM 版＝(m_iMaxCSPoint == 0) → V2 同（gskillcash.MaxCSPoint==0）。
//      原版 EndDate 完全未參與此判定（原碼未讀取）→ V2 同；EndDate 僅保存不參與。
//   9. 現金技能點寫回：原版僅當 iAfterCSP > 0（DBE m_iCSPoint >= 0）才 upsert gskillcash
//      （過期分支 iAfterCSP=0 故意不寫，避免清空可能有效的共用現金池）；V2 gskillcash 為 unit-global 主表、
//      無分頁池可保護，為 ACK 與唯讀回一致，**一律寫入**（含 0）——自洽優先，偏差於此聲明。
//  10. 失敗 ACK 形狀（兩相位）：
//      (A) 提交前失敗（ERR_SKILL_PAGE_01/ERR_RESET_SKILL_00/ERR_SKILL_20/ERR_RESET_SKILL_05/
//          ERR_RESET_SKILL_01/ERR_SKILL_24 前置讀取失敗等）：ACK 全欄位 0（iOK 除外）、向量空——
//          與原碼「驗證階段失敗即無回顯」同形。
//      (B) 提交中失敗（ERR_RESET_SKILL_02/03 或 ERR_SKILL_24）：transaction 已 rollback，ACK 帶
//          iActiveSkillPageNumber/iDelSkillID 回顯與 [未變更] 道具槽（itemUID 保留、原 quantity），
//          iSPoint=iCSPoint=0——報告真實已回滾狀態（原版仍帶內存已遞減後的值，DB 回滾後與實際不符）。
//          故 failStage→錯誤碼映射：Item→ERR_RESET_SKILL_02(446)；Skill/SPoint/Commit→ERR_RESET_SKILL_03(447)；
//          CashPoint→ERR_SKILL_24(204)。
//  11. 原成功路徑於 ACKs2 才呼叫 ResetSkill/CheckAndUpdateSkillLevelAndCSPOnUsedPage（作用頁內存）後組 ACK；
//      V2 於 transaction 內直接落盤等價語義（見演算法 [11c]），並在 ACK 回填提交後讀回值。
//  12. SERV_ROOM/FSM（S_FIELD_MAP/S_ROOM）VERIFY_STATE 與成功後 ERM_CHANGE_SKILL_INFO_IN_ROOM_NOT 廣播：
//      V2 無 Room/Field 子系統 → 不送 NOT（與 §0a24 偏差 6 同類）。
//  13. SPoint：原 2013 為「每技能頁獨立 SP 池」（KUserSkillPageData）；V2 沿用 unit-global gunit.SPoint
//      （§0a23 偏差 8：頁池無資料源）。iAfterSP 加到 unit-global SPoint；可倒扣為負（原同）。
//  14. 原 DBE_RESET_SKILL_REQ 的 iCSPoint <= 0 → DB 傳 -1 → GSGameDBThread 跳過現金點更新；
//      V2 改為一律寫入（偏差 9），無 -1 通道。
//  15. wire 佈局為自洽 golden bytes，未對原 SDK 實機驗證；m_vecInventorySlotInfo 的 ItemInfo 依 SERV_* 巨集組合
//      （同 §0a17/SelectUnit 讀回口徑）。
#pragma once

#include <cstdint>
#include <string>
#include <vector>

#include "../db/GameStore.h"
#include "UnitData.h"

namespace x2 { class Serializer; }

namespace x2 { namespace reset_skill {

// V2 定數推定（原為 Lua/技能樹資料；見檔頭偏差聲明 6）
constexpr int32_t kRequireLearnSkillPoint = 1;
constexpr int32_t kRequireUpgradeSkillPoint = 1;

struct ResetSkillReq           // EGS_RESET_SKILL_REQ（305）
{
    int32_t iSkillID = 0;              // 原 int，ctor 預設 0
    int32_t iActiveSkillPageNumber = 0; // 原 int，ctor 預設 0
};

struct ResetSkillAck           // EGS_RESET_SKILL_ACK（306）
{
    int32_t iOK = 0;                  // NetError（NET_OK=0；ERR_SKILL_PAGE_01=1387；ERR_SKILL_20=200；ERR_SKILL_24=204；ERR_RESET_SKILL_00=444 起）
    int32_t iActiveSkillPageNumber = 0;
    int32_t iDelSkillID = 0;
    int32_t iSPoint = 0;
    int32_t iCSPoint = 0;
    std::vector<unit::InventoryItemInfo> vecInventorySlotInfo;   // 原 std::vector<KInventoryItemInfo>
};

bool PutResetSkillReq(Serializer& ks, const ResetSkillReq& v);
bool GetResetSkillReq(Serializer& ks, ResetSkillReq& v);
bool PutResetSkillAck(Serializer& ks, const ResetSkillAck& v);
bool GetResetSkillAck(Serializer& ks, ResetSkillAck& v);

// 決策層（原 EGS_RESET_SKILL_REQ handler；unitUID 對應原 GetCharUID()，由呼叫端傳入）。
//   流程見檔頭演算法 [1]–[12]。nowUtc 空 → 執行時刻 UTC；僅供測試注入固定時間（影響 gitem 軟刪除時間戳）。
//   任何路徑都產出 ACK（鏡像原 end_proc）；err 僅供伺服器側日誌。
int32_t HandleResetSkillReq(db::GameStore& gameDb, int64_t unitUID,
                            const ResetSkillReq& req,
                            ResetSkillAck& ack,
                            std::string& err,
                            const std::string& nowUtc);

// 預設技能集合（V2 推定；見檔頭偏差聲明 5）——create-unit 預設技能
bool IsUnitTypeDefaultSkill(int32_t skillID);

// JP 生效之重置道具優先序（見檔頭偏差聲明 7）
const std::vector<int32_t>& ResetSkillItemPriority();

} // namespace reset_skill
} // namespace x2
