// GetSkillProtocol.h — EGS_GET_SKILL_REQ/ACK（스킬 습득／技能學習・升級）wire 結構＋決策。
// （V2 `x2::get_skill` 命名空間）§0a26。
//
// 對齊對象：原 X2Project（SERV_UPGRADE_SKILL_SYSTEM_2013／SERV_SKILL_PAGE_SYSTEM 皆已定義；
//   SERVERDefine.h:3693/4314）
//   KGetSkillInfo                     （CommonPacket.h:9648；DECL_DATA）
//   KEGS_GET_SKILL_REQ { [SERV_SUB_QUEST_LEARN_NEW_SKILL: std::vector<int> m_vecNowLearnSkill]
//                        int m_iActiveSkillPageNumber;
//                        std::map<int, KGetSkillInfo> m_mapSkillList }    （ClientPacket.h:2508）
//   KEGS_GET_SKILL_ACK { int m_iOK; int m_iActiveSkillPageNumber;
//                        std::map<int, KGetSkillInfo> m_mapSkillList;
//                        int m_iRemainSP; int m_iRemainCSP }              （ClientPacket.h:2526）
//   wire 順序＝ PUT 順序：REQ VECTOR? → iActiveSkillPageNumber → MAP；ACK iOK → iActiveSkillPageNumber → MAP → iRemainSP → iRemainCSP。
//   map 線路格式（tagging=false）＝ [u32 count][逐對 first][second]（int key BE、KGetSkillInfo 4×int32 BE）。
//   事件 ID（V2 EventIDs.h）：REQ=294, ACK=295。
//
// HandleGetSkillReq 對應原 GSUserGameCommon::IMPL_ON_FUNC( EGS_GET_SKILL_REQ )
//   （GSUserGameCommon.cpp:4337–4636）＋ DBE_INSERT_SKILL_REQ（GSGameDBThread.cpp:11040–）
//   ＋ DBE_INSERT_SKILL_ACK（GSUserGameCommon.cpp:4638–）：
//   原為「驗證 → SubtractSPoint/SetCSPoint（內存先扣）→ SendToGameDB 非同步 → DBE ACK 回來後 CheckAndUpdate/恢復」
//   兩跳結構；V2 無 DB worker/無副本內存技能樹 → 單一函數內「即時讀庫 → 驗證 → 單一 transaction 提交 →
//   組 ACK」（write-through，與 §0a10/§0a20/§0a24/§0a25 慣例一致；失敗整體 rollback＝原失敗路徑的回滾語義，
//   且不產生中途可見狀態）。
//
// 演算法（原碼逐步對位；SERV_SKILL_PAGE_SYSTEM 分支）：
//   [1] req.iActiveSkillPageNumber != 作用頁 → ERR_SKILL_PAGE_01（1387）
//   [2] mapSkillList 空 → ERR_SKILL_09（190）
//   [3] CheckGetNewSkill（UserSkillTree.cpp:2559）：IsActiveSkillPageNumberValid → ERR_SKILL_PAGE_04（V2 不可達：
//         頁碼恆 >= 1）；GetSkillTemplet/GetSkillTreeTemplet == NULL → ERR_SKILL_01（183）——V2 無 templet，
//         以「skillID > 0」近似；IsMasterSkillLevel／req 等級 > iMasterSkillLevel → ERR_SKILL_00（無 templet 資料，不可達）；
//         m_vecRequireCharactorLevel／m_bBornSealed／IsMyUnitClassSkill／IsAllPrecedingSkillLearned／tier 規則
//         （ERR_SKILL_03/15/16/07/29）全部依賴 SkillTemplet/SkillTreeTemplet —— V2 無資料 → 全部放行（偏差聲明 2/3）。
//   [4] cash 過期（MaxCSPoint == 0）且 SPoint <= 0 → ERR_SKILL_17（197）；
//         未過期且 SPoint + CSPoint <= 0 → ERR_SKILL_18（198）
//   [5] GetNecessarySkillPoint（UserSkillTree.cpp:1673；SERV_SKILL_PAGE_SYSTEM 版 :2366 同構）：
//         每技能以作用頁現狀計價——已學會：cost = kRequireUpgradeSkillPoint × (target − cur)；target < cur → false。
//         未學會/新技能：cost = kRequireLearnSkillPoint + kRequireUpgradeSkillPoint × (target − 1)；target < 1 → false。
//         任一 false → ERR_SKILL_17。
//         未過期時把「每技能完整 cost」寫入其 m_iSpendSkillCSPoint；過期時不覆寫 client 欄位。
//         總 CSP/SP 分池（未過期）：iTotalCSP=min(iTotalCost,CSPoint)，iTotalSP=iTotalCost−iTotalCSP。
//         過期時 iTotalCSP=0、iTotalSP=全額。
//   [6] iTotalSP > SPoint || iTotalCSP > CSPoint → ERR_SKILL_18
//   [7] cash 過期且 iTotalCSP > 0 → ERR_SKILL_24（不可達；保留原檢查形狀）
//   [8] m_iCSPoint = CSPoint > 0 ? CSPoint − iTotalCSP : −1（V2：無 -1 通道，一律寫入 gskillcash，偏差聲明 9）
//   [9] 逐技能 m_iSpendSkillCSPoint：未過期＝全額本技能 cost + 既有 SkillCSPoint；過期＝client 欄位 + 既有 SkillCSPoint
//  [10] SubtractSPoint(iTotalSP)／SetCSPoint(iRemainCSP)——併入單一 transaction（CommitGetSkill）
//  [11] DBE_INSERT_SKILL_REQ 等價物（單一 transaction）：
//         a. gskill upsert（v15 起 PK = (UnitUID, SkillID, SkillPageNumber)；§0a26 schema 變更）
//         b. gunit.SPoint -= iTotalSP（讀回絕對值供 ACK）
//         c. gskillcash upsert CSPoint = iRemainCSP
//         失敗（failStage=Skill/SPoint/CashPoint）→ rollback → ACK{ iOK=ERR_SKILL_00(182)／ERR_SKILL_24(204),
//         iActiveSkillPageNumber=req 頁, mapSkillList 空, iRemainSP/iRemainCSP=0 }（偏差聲明 10：原 DBE 失敗路徑
//         EGS ACK 之 m_iOK 以 NetError::GetLastError() 覆寫，值未定義；V2 明確回報映射碼）
//  [12] 成功 ACK：iOK=NET_OK；iActiveSkillPageNumber=req 頁；m_mapSkillList＝請求 map（iSpendSkillCSPoint 回填 [9]，
//       iSkillID 強制 = map key，其餘欄位（iBeforeSkillLevel 等）原樣保留）；iRemainSP／iRemainCSP＝提交後讀回值。
//  [13] SERV_SUB_QUEST_LEARN_NEW_SKILL（僅 JP／Global 定義；V2 地區 JP 才有此欄位）：
//       REQ 序列化 m_vecNowLearnSkill（JP 先、page 次、map 次）；Handler_OnLearnNewSkill 子任務系統
//       V2 無等價子系統 → 欄位收無捨棄（偏差聲明 11）。
//
// ⚠ 偏差聲明（V2 vs 原版；全部為推定，非原版保證；完整條列見 docs §0a26）：
//   1. VERIFY_STATE_REPEAT_FILTER（S_FIELD_MAP/S_ROOM）與成功後 ERM_CHANGE_SKILL_INFO_IN_ROOM_NOT 廣播：
//      V2 無 Room/Field 子系統 → 不檢查、不廣播（與 §0a24 偏差 6、§0a25 偏差 12 同類）。
//   2. SkillTemplet（NewSkillTempletVer2.lua 不在倉庫；X2Tools/X2WorldTool 的 .lua 多為加密 blob）→ V2 以
//      skillID > 0 通過存在性檢查；正整數未知 ID 仍可能被寫入（V2 無法區分真實技能與未知技能）；
//      原 ERR_SKILL_01 僅 skillID<=0 可達。此為重大偏差，需在 templet 資料可用後補回存在性閘門。
//   3. SkillTreeTemplet（含 tier/iColumn/m_vecRequireCharactorLevel/m_bBornSealed/IsMyUnitClassSkill/
//      IsAllPrecedingSkillLearned）全部無資料 → ERR_SKILL_03/15/16/07/29 路徑不可達；級聯規則不驗證。
//   4. IsActiveSkillPageNumberValid：V2 SkillPageState 頁碼恆 >= 1 → ERR_SKILL_PAGE_04（1386）不可達。
//   5. RequireLearnSkillPoint / RequireUpgradeSkillPoint 不在倉庫 → V2 定數 1/1（與 §0a25 推定一致）。
//   6. SP 扣減對象：原 2013 為「每技能頁獨立 SP 池」（KUserSkillPageData m_iSPoint）；V2 沿用 unit-global
//      gunit.SPoint（§0a23 偏差 8；頁池無資料源）。不倒扣為負（[6] 先擋 → ERR_SKILL_18）。
//   7. m_iSpendSkillCSPoint：原版在未過期時計算每個技能的完整 cost（不依實際 SP/CSP 分池比例拆分），
//      再加上作用頁既有 SkillCSPoint；已過期時不覆寫 REQ 送來的 m_iSpendSkillCSPoint（仍加既有值）。
//      V2 沿用原算法。這代表 cost 超過可用 CSP 時，技能列仍記錄全額 cost，後續重置退 CSP 可能高於
//      實際 CSP 支出；屬原版語意，不以 V2 自行「修正」。（舊工作草稿曾提出 greedy CSP 分派，已撤回。）
//   8. SERV_ALL_RENEWAL_SP（僅 IN 定義；V2 五地區 JP/TW/EU/CN/US 皆無 → 全走非 RENEWAL_SP 路徑
//      （gup_update_cash_skill_point_info / P_GSkill_New_UPD 對應面），與 JP 參考地區一致。
//   9. m_iCSPoint = -1 通道（CSPoint==0 時跳過現金點更新）：V2 無 -1 通道，gskillcash 一律 upsert
//      （含 [newCSPoint == 0]；與 §0a25 偏差 9/14 一致）。連帶：從未有 gskillcash 列且全額 SP 支付時，
//      V2 仍建立 CSPoint=0, MaxCSPoint=0 之列（GetCashSkillPoint 讀回 {0,0,哨兵}，與缺列語意相同）。
//  10. 失敗 ACK 形狀：(A) 提交前失敗＝ACK 全零（iOK 除外）＋空 map（與原「驗證階段失敗無回顯」同形）；
//      (B) 提交中失敗（gskill upsert/gunit SP/gskillcash/COMMIT）＝rollback 後 iOK=ERR_SKILL_00 或 ERR_SKILL_24、
//      iActiveSkillPageNumber 回顯、mapSkillList 空、iRemainSP/iRemainCSP=0。
//      （原 DBE 失敗路徑 EGS ACK 的 m_iOK 以 NetError::GetLastError() 覆寫、值未定義；V2 明確回報映射碼。）
//  11. SERV_SUB_QUEST_LEARN_NEW_SKILL（僅 JP／Global）：REQ 多一個 vec<int> m_vecNowLearnSkill（置於最前）。
//      V2 地區僅 JP 序列化此欄位（TW/EU/CN/US 無，與原 ServerDefine_JP.h:458 / ServerDefine_Global.h:1102 對應；
//      TW/EU/CN/US 對應地區檔無此 define）。Handler_OnLearnNewSkill（子任務系統）V2 無等價物 → 欄位收而不用。
//  12. SPoint 持久化：原 SubtractSPoint 僅扣內存池，gunit.SPoint 靠 gup_update_unit_info 週期回寫；
//      V2 write-through（transaction 內直接扣減並讀回），與 §0a24/§0a25 一致。
//  13. 原 DBE_INSERT_SKILL_ACK 成功路徑呼叫 CheckAndUpdateSkillLevelAndCSPOnUsedPage（內存）與
//      Handler_OnUseSkillPoint／UseSkillPoint 統計與 WriteCharacterLogToDB(LT_FIRST_USE_SKILL_POINT)：
//      V2 無對應統計/日誌子系統 → 不產生（偏差）。NetError::GetLastError() 線程局部狀態機不複製。
//  14. wire 佈局為自洽 golden bytes，未對原 SDK 實機驗證（gskill／gskillexpand 表結構為 §0a23 反推、
//      非實機 dump）。
#pragma once

#include <cstdint>
#include <string>
#include <vector>
#include <map>

#include "../db/GameStore.h"

namespace x2 { class Serializer; }

namespace x2 { namespace get_skill {

// V2 定數推定（原為 Lua/技能樹資料；見檔頭偏差聲明 5；與 §0a25 一致）
constexpr int32_t kRequireLearnSkillPoint = 1;
constexpr int32_t kRequireUpgradeSkillPoint = 1;

struct GetSkillInfo           // KGetSkillInfo（原 CommonPacket.h:9648；DECL_DATA）
{
    int32_t iSkillID = 0;
    int32_t iBeforeSkillLevel = 0;
    int32_t iSkillLevel = 0;        // 目標絕對等級（原 m_iSkillLevel；>= cur 才合法）
    int32_t iSpendSkillCSPoint = 0; // 本技能投入值（原算法：未過期 cost / 過期 client 值，再加既有；見檔頭偏差聲明 7）
};

struct GetSkillReq            // EGS_GET_SKILL_REQ（294）
{
    // SERV_SUB_QUEST_LEARN_NEW_SKILL（原僅 JP／Global）：V2 僅 X2_REGION_JP 序列化此欄位；
    //   其他地區該欄位不上游（與原 ServerDefine 地區差異對齊）。結構體一致，僅 wire 行為差。
    std::vector<int32_t> vecNowLearnSkill;
    int32_t iActiveSkillPageNumber = 0;
    std::map<int32_t, GetSkillInfo> mapSkillList;   // key = SkillID（V2 以 key 為準；原 value.m_iSkillID 不可信）
};

struct GetSkillAck            // EGS_GET_SKILL_ACK（295）
{
    int32_t iOK = 0;                        // NetError（NET_OK=0；ERR_SKILL_PAGE_01=1387；ERR_SKILL_09=190；
                                            //          ERR_SKILL_01=183；ERR_SKILL_00=182；ERR_SKILL_17=197；
                                            //          ERR_SKILL_18=198；ERR_SKILL_24=204；ERR_ODBC_01=555）
    int32_t iActiveSkillPageNumber = 0;
    std::map<int32_t, GetSkillInfo> mapSkillList;   // 成功時回填（iSkillID=key、iSpendSkillCSPoint=[9]）；失敗為空
    int32_t iRemainSP = 0;
    int32_t iRemainCSP = 0;
};

bool PutGetSkillReq(Serializer& ks, const GetSkillReq& v);
bool GetGetSkillReq(Serializer& ks, GetSkillReq& v);
bool PutGetSkillAck(Serializer& ks, const GetSkillAck& v);
bool GetGetSkillAck(Serializer& ks, GetSkillAck& v);

// 決策層（原 EGS_GET_SKILL_REQ handler；unitUID 對應原 GetCharUID()，由呼叫端傳入）。
//   流程見檔頭演算法 [1]–[13]。任何路徑都產出 ACK（鏡像原 end_proc）；err 僅供伺服器側日誌。
int32_t HandleGetSkillReq(db::GameStore& gameDb, int64_t unitUID,
                          const GetSkillReq& req,
                          GetSkillAck& ack,
                          std::string& err);

} // namespace get_skill
} // namespace x2
