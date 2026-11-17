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
#include "UnitListProtocol.h"
#include "CreateUnitProtocol.h"
#include "DeleteUnitProtocol.h"
#include "CreateTodayCountProtocol.h"
#include "CheckNicknameProtocol.h"
#include "ChangeNicknameProtocol.h"
#include "CharacterListProtocol.h"
#include "EntryPointChannelListProtocol.h"

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

// EGS_CREATE_UNIT_REQ 決策（原 GSUserGameCommon::IMPL_ON_FUNC(EGS_CREATE_UNIT_REQ)）：
//   0) IsInitNormalJob 閘門（§0a3）：iClass ∉ {1..9} → ERR_CREATE_UNIT_11(1289)（原 SERV_CHECK_CREATE_UNIT_CLASS，先於 length）
//   1) 暱稱驗證：空或 UTF-8 位元組數 > 12 → ERR_CREATE_UNIT_04(29)（原版 CP_ACP 12 bytes；JP 未定義 SERV_NICK_NAME_MINIMUM_CHECK → 無最小長度檢查）
//   1.5) FT_NICKNAME 過濾（§0w，authLevel ≥ UAL_GM(2) 繞過）→ ERR_CREATE_UNIT_08(33)
//   1.6) IsExistPvpNpcName 閘門（§0a4，無 GM 繞過）：暱稱命中 PvP NPC 保留名單 → ERR_CREATE_UNIT_01(26)
//      含 KODBC 注入標記（; ' " -- /* */ \）→ ERR_CREATE_UNIT_08(33)（「無法使用的暱稱」）
//   2) GameStore::CreateUnit（guser 不存在/已刪除 → ERR_CREATE_UNIT_00(25)；暱稱重複 → ERR_CREATE_UNIT_01(26)；
//      槽位達 USSize → ERR_CREATE_UNIT_05(30)；暱稱 14 天冷卻 → ERR_CREATE_UNIT_06(31)；DB 錯誤 → ERR_CREATE_UNIT_02(27)；
//      §0a5：gunit+gunit_nickname 與衛星副作用（gquests/gskill/gskillslot/gspirit/gdenyoption）同一 transaction）
//   3) 成功 → 重讀角色，kUnitInfo ← PopulateUnitInfoFromGUnit(userUID, authLevel, rec)；
//      vecSkillSlot / wstrEnableDate 原由 AccountDB(DBE_ACCOUNT_CREATE_UNIT_*) 填寫，V2 一律空（誠實佔位）。
//   （FT_NICKNAME 過濾已移植 §0w：字元集閘門＋禁用暱稱 266＋禁用字 1389＋禁用標記；無 NICKNAMEWORD 子列表、無禁用字 DB 動態更新）
// 誠實偏差：無職業 templet 表（iClass 僅檢查 tinyint 範圍 0..255，由 GameStore 把關；IsInitNormalJob 閘門已移植 §0a3）、
//   IsExistPvpNpcName 閘門已移植（§0a4；TH/ID/BR/PH 空表、EU nation-flag 子表與 HK 獨立表未建模）；
//   每日建立上限（ERR_CREATE_UNIT_03/09 的其他路徑未建模）、
//   原版 S_SERVER_SELECT 狀態閘門與 DBE_ACCOUNT_CREATE_UNIT_REQ 兩段式未建模（V2 單段 game DB）。
bool HandleCreateUnitReq(db::GameStore& gameDb, int64_t userUID, int authLevel,
                         const create_unit::CreateUnitReq& req,
                         create_unit::CreateUnitAck& ack, std::string& err);

// EGS_DELETE_UNIT_REQ 決策（原 IMPL_ON_FUNC(EGS_DELETE_UNIT_REQ) + DBE_GAME_DELETE_UNIT_REQ 分支）：
//   1) 先 GetUnitByUID(unitUID)：不存在/已刪除/不屬於自己 → ERR_DELETE_UNIT_00(986)（原 gup_delete_unit/P_GUnit_UPD_Delete 回 -1 → ERR_DELETE_UNIT_00）
//   2) GameStore::SoftDeleteUnit 失敗 → ERR_DELETE_UNIT_05(987)
//   3) 成功：m_iUnitUID=iUnitUID、m_uiKNMSerialNum=0（原由 AccountDB GetMessengerSN 填寫；JP VF_INTERNAL 跳過、V2 無 AccountDB，誠實佔位）、
//      m_iGuildUID=0（GUILD_TEST 欄位保留以對齊 wire；V2 無公會踢出）、wstrNickName/ucLevel/cUnitClass=刪除前角色資料（SERV_CHAR_LOG）
// 誠實偏差：無 SERV_UNIT_WAIT_DELETE（未定義 → 無 P_GUnitWaitDelete_INS/m_tDelAbleDate）、無公會踢出/公會廣告/關係系統刪除閘門、
//   S_SERVER_SELECT 狀態閘門未建模、DBE_ACCOUNT_DELETE_UNIT_REQ 兩段式未建模（V2 單段 game DB；不含 GetMessengerSN）。
bool HandleDeleteUnitReq(db::GameStore& gameDb, int64_t userUID, int authLevel,
                         const delete_unit::DeleteUnitReq& req,
                         delete_unit::DeleteUnitAck& ack, std::string& err);

// EGS_GET_CREATE_UNIT_TODAY_COUNT_REQ 決策（原 IMPL_ON_FUNC_NOPARAM → DBE_GET_CREATE_UNIT_TODAY_COUNT_REQ → gup 今日建立數）：
//   ack.iUserUID = userUID；mapCreateCharCountToday = {{ serverGroupID=0, count } }，count 由
//   GameStore::CountUnitsCreatedTodayByUser 取得（今日=本機 UTC 日）。
// 誠實偏差：V2 無 server group / 2nd GameDB → SINGLE_SERVER_GROUP 語意折疊為單段；1ST_ACK 與最終 ACK 結構相同，折疊為一段；
//   map key（serverGroupID）一律 0；P_GUnit_CreateCNT_GET 的精確口徑（是否排除 Deleted？）原 stored proc 未隨倉庫提供，
//   V2 採「Deleted=0 且 RegDate >= 本機 UTC 今日 00:00」口徑，與 gup_create_unit 的 14 天冷卻查詢風格一致。
bool HandleGetCreateUnitTodayCountReq(db::GameStore& gameDb, int64_t userUID,
                                      today_count::GetCreateUnitTodayCountAck& ack, std::string& err);

// EGS_ENTRY_POINT_CHECK_NICK_NAME_REQ 決策（原 IMPL_ON_FUNC(EGS_ENTRY_POINT_CHECK_NICK_NAME_REQ)）：
//   1) 暱稱 UTF-8 位元組數 1..12 → 否則 ERR_RESTORE_NICK_NAME_06(334)（原 CP_ACP > 12 bytes）
//   2) KODBC 注入標記（; ' " -- /* */ \）→ ERR_RESTORE_NICK_NAME_05(333)（原 IsInvalidMarkIn → 同錯誤碼）
//   3) GameStore::CheckNicknameAvailable → Available→NET_OK；Taken→ERR_RESTORE_NICK_NAME_02(330)（原 -1）；
//      InCooldown→ERR_RESTORE_NICK_NAME_03(331)（原 -2）；DbError → return false（基礎設施錯誤）
//   ack.iUnitUID=0（原碼未填）；ack.wstrNickName=回顯。
//   1.5) FT_NICKNAME 過濾（§0w：字元集閘門＋266 nickname exact＋1389 word substring＋禁用標記；authLevel ≥ UAL_GM(2) 繞過，同原碼）→ ERR_RESTORE_NICK_NAME_05(333)；
//   原碼依 server group 路由 1st/2nd GameDB → V2 單一 game DB，m_iServerGroup 忽略；
//   AF_INTERNAL 分支（default: 內部旗標直接放行）未建模——V2 一律走查詢。
bool HandleCheckNicknameReq(db::GameStore& gameDb,
                            const check_nickname::EntryPointCheckNickNameReq& req,
                            check_nickname::EntryPointCheckNickNameAck& ack, std::string& err,
                            int authLevel = 0);

// EGS_CHANGE_NICK_NAME_REQ / EGS_ENTRY_POINT_CHANGE_NICK_NAME_REQ 決策
// （原 IMPL_ON_FUNC(EGS_CHANGE_NICK_NAME_REQ) + EGS_ENTRY_POINT_CHANGE_NICK_NAME_REQ，兩者共享 DBE_CHANGE_NICK_NAME_REQ 與 EGS_CHANGE_NICK_NAME_ACK）：
//   1) 暱稱 UTF-8 位元組數 1..12 否則 ERR_RESTORE_NICK_NAME_06(334)；KODBC 注入標記 → ERR_RESTORE_NICK_NAME_05(333)
//   1.6) IsExistPvpNpcName 閘門（§0a4：原 SERV_PVP_NEW_SYSTEM，無 GM 繞過，bCheckOnly 亦擋）→ ERR_CREATE_UNIT_01(26)
//   2) 擁有權：GetUnitByUID(unitUID) 不存在/已刪除/rec.userUID != userUID → ERR_RESTORE_NICK_NAME_00(328)
//      （原碼未檢查擁有權——任何客戶端可改任意角色暱稱；V2 加上擁有權閘門，誠實偏差）
//   3) bCheckOnly=true：GameStore::CheckNicknameAvailable（**排除自身單位**——unitUID 對應自己時不算占用）
//      Available→NET_OK / Taken→02(330) / InCooldown→03(331)
//   4) bCheckOnly=false：GameStore::ChangeUnitNickname（事務化：讀舊暱稱→可用性→舊暱稱入冷卻歷史→UPDATE）
//      Ok→NET_OK / UnitNotFoundOrDeleted→00(328) / Taken→02 / InCooldown→03 / Failure→04(332) / DbError→false
// ack 回顯 m_iUnitUID / m_wstrNickName / m_bCheckOnly。
//   1.5) FT_NICKNAME 過濾（§0w）→ ERR_RESTORE_NICK_NAME_05(333)；
// 誠實偏差：IsExistPvpNpcName 閘門已移植（§0a4；TH/ID/BR/PH 空表、EU nation-flag 子表與 HK 獨立表未建模）；
//   原碼依 server group 路由 1st/2nd GameDB → V2 單一 game DB，iServerGroup 忽略；
//   SERV_GUARANTEE_UNIQUENESS_OF_NAME_CN 未定義 → 無 Giant RoleReg 路徑；成功後無 LogDB（ELOG_CHANGE_NICK_NAME_NOT）。
bool HandleChangeNicknameReq(db::GameStore& gameDb, int64_t userUID,
                             const change_nickname::ChangeNickNameReq& req,
                             change_nickname::ChangeNickNameAck& ack, std::string& err,
                             int authLevel = 0);
bool HandleEntryPointChangeNicknameReq(db::GameStore& gameDb, int64_t userUID,
                                       const change_nickname::EntryPointChangeNickNameReq& req,
                                       change_nickname::ChangeNickNameAck& ack, std::string& err,
                                       int authLevel = 0);

// EGS_CREATE_NEW_UNIT_REQ / EGS_ENTRY_POINT_DELETE_UNIT_REQ（EGS_ENTRY_POINT 變體）：
//   兩者皆忽略 iServerGroup（V2 單一 game DB）後分別共用 HandleCreateUnitReq / HandleDeleteUnitReq 決策。
// 誠實偏差（CREATE 變體特有）：原碼以 SiCXSLUnitManager()->GetUnitTemplet 驗證 m_iClass（無 templet → ERR_CREATE_UNIT_03(28)）、
//   IsInitNormalJob 閘門已移植（§0a3；非初始普通職業 → ERR_CREATE_UNIT_11=1289，enum 機讀核對）、IsExistPvpNpcName
//   閘門已移植（§0a4；命中 PvP NPC 保留暱稱 → ERR_CREATE_UNIT_01=26，名單源自 ServerResource/<REGION>/PvpNpcData.lua）——
//   V2 無 XSL templet 表，templet 閘門**未建模**；僅共用既有檢查
//   （長度→04 / 注入→ODBC_00? 注意：原 ENTRY_POINT CREATE_NEW_UNIT 的注入分支用 ERR_ODBC_00 而非 ERR_CREATE_UNIT_08，
//    但為了與 EGS_CREATE_UNIT_REQ 一致，V2 共用決策一律 ERR_CREATE_UNIT_08——見文件 §0q）。
bool HandleCreateNewUnitReq(db::GameStore& gameDb, int64_t userUID, int authLevel,
                            const create_unit::CreateNewUnitReq& req,
                            create_unit::CreateUnitAck& ack, std::string& err);
bool HandleEntryPointDeleteUnitReq(db::GameStore& gameDb, int64_t userUID, int authLevel,
                                   const delete_unit::EntryPointDeleteUnitReq& req,
                                   delete_unit::DeleteUnitAck& ack, std::string& err);

// EGS_CHARACTER_LIST_REQ 決策（原 IMPL_ON_FUNC_NOPARAM(EGS_CHARACTER_LIST_REQ) → DBE_CHARACTER_LIST_REQ → SINGLE_SERVER_GROUP 本地組裝）：
//   GetOrCreateGUser（userUID, userID）→ ack.mapServerGroupUnitSlot = {{ serverGroupID=0, guser.usSize }}；
//   ListUnitsByUserUID → mapServerGroupUnitInfo = {{ 0, vec<UnitInfo> }}（逐個 PopulateUnitInfoFromGUnit）；
//   ack.strUserID = Utf8ToWide(userID)；ack.iOK = NET_OK。DB 失敗 → return false。
// 誠實偏差：EXP/stat 表已移植（§0u/§0v：stat=DB+表、level ← CheckLevelUp(1, EXP)）、IsInitNormalJob 閘門已移植（§0a3；templet 存在性/名稱閘門未建模 → iClass=200 等以 ERR_CREATE_UNIT_11=1289 拒絕，原碼為 ERR_CREATE_UNIT_03=28）、
//   無 PVP rating 表、無 P2P IP/port（空）、無 server group / 1st+2nd GameDB 會合；SERV_BATTLE_FIELD_BOSS 地圖修正未建模；
//   handler 不在 2_NOT 鏈上寫 m_setMyUnitUIDList——V2 無此狀態。
bool HandleCharacterListReq(db::GameStore& gameDb, int64_t userUID, const std::string& userID, int authLevel,
                            character_list::CharacterListAck& ack, std::string& err);

// EGS_ENTRY_POINT_GET_CHANNEL_LIST_REQ 決策（原 IMPL_ON_FUNC_NOPARAM，GSUserSession.cpp:3480）：
//   ack 四張表（Soles/Gaia × ChannelList/ChannelBonusList）；原碼依 SGI_SOLES/SGI_GAIA 互換 1st/2nd SiKChannelManager 對應。
//   V2 無 SiKChannelManager（頻道註冊表）→ 四張表一律空（誠實佔位）；不查 DB；永遠成功。
bool HandleGetChannelListReq(channel_list::GetChannelListAck& ack);

// EGS_MY_UNIT_AND_INVENTORY_INFO_LIST_REQ（無參數）決策：
//   guser（GetOrCreateGUser，缺則建，USSize=50）取 nUnitSlot；ListUnitsByUserUID（Deleted=0，UnitUID 升序）
//   取角色清單並逐個以 PopulateUnitInfoFromGUnit 填 KUnitInfo；ack.iOK=NET_OK。
// 誠實偏差：EXP/stat 表已移植（§0u/§0v）；仍缺 P2P IP/port——
//   EXP/stat 已由表疊加（gunit 儲存值 + 表值）；P2P IP/port 仍空（見 architecture §0u/§0v）。原版 S_SERVER_SELECT 狀態閘門未建模。
// 失敗：GetOrCreateGUser 或 ListUnitsByUserUID 出錯 → false（ack.iOK 由呼叫端定，err 有訊息）。
bool HandleMyUnitAndInventoryInfoListReq(db::GameStore& gameDb, int64_t userUID, const std::string& userID,
                                         int authLevel,
                                         unit_list::MyUnitAndInventoryInfoListAck& ack,
                                         std::string& err);

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

// 由 GUnitRecord 填出 KUnitInfo（LoginCount/IP/port/exp→level 換算等原版衍生欄位無 V2 對應表，沿用儲存值）。
// 供 BuildSelectUnitNot1 與 MY_UNIT_AND_INVENTORY_INFO_LIST_ACK 共用。
void PopulateUnitInfoFromGUnit(int64_t userUID, int authLevel, const db::GUnitRecord& unit,
                               unit::UnitInfo& outUnitInfo);

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
