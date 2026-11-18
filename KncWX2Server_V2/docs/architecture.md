# KncWX2Server_V2 — 架構文件

> 文件狀態：**初稿，待審核**
> 日期：2026-11-16
> 分支：`arena/e7573545-source-2014-03`（基於 `86749efabeeaea4014b218a366e57318181fda96`，`main`）
> 讀者：接手此代碼庫的工程師（含日後的 Windows 端建置負責人）

---

## 0a. 2026-11-17 快照（Login 切片原型）

`src/server/LoginProtocol.{h,cpp}`、`src/server/LoginArbiter.{h,cpp}`、`src/core/NetError.h`、`tests/test_login_slice.cpp` 新增：JP `SERV_INT_INTERNAL` 組合下 Connect→VerifyAccount 的線路 codec（golden bytes 自洽，**尚未對原 SDK 實機位元組驗證**）、本地決策（版本不符 ERR_CONNECT_00／滿員 ERR_CONNECT_04／帳號不存在 ERR_VERIFY_04／密碼錯 ERR_VERIFY_06／成功 NET_OK + RecordLogin），以及 loopback TCP 端對端測試（Session 握手 → CONNECT → VERIFY，成功與失敗兩路徑，含 DB 副作用斷言）。

⚠ 認證語意是**開發用替代品**（UserStore + salted SHA-256），不是出版商 Nexon 認證（`ChannelUserAuth_JP`/`NexonUserAuthenticate`）；publisher 接入後整段替換。
⚠ 此切片是「LoginServer 最短路徑」的第一步落地，**方向仍未獲架構裁示**（§14 待審）；未接入任何真實客戶端/部署。

## 0b. 2026-11-17 快照（game DB Phase 2a）

`src/db/GameStore.{h,cpp}`、`tests/test_game_store.cpp` 新增：game DB（對應原 Database2）的 `guser`／`gunit`／`gunit_nickname`／`gdeleted_nickname_history` 四表 schema（v1，`Deleted` 生成欄、partial index）+ 存取層：`GetOrCreateGUser`（對應 gup_get_user_info，USSize=50）、`CreateUnit`（對應 gup_create_unit：usSize 上限／暱稱唯一／14 天刪除冷卻／事務化插入 gunit+gunit_nickname，LastPosition=20000、SPoint=1；衛星副作用已於 §0a5 補齊：gquests/gskill/gskillslot/gspirit/gdenyoption，GameDB schema v2；GDenyOption CodeNo CHECK 於 schema v4 放寬為 0..255，§0a9）、`ListUnitsByUserUID`／`GetUnitByUID`（JOIN 暱稱）、`SoftDeleteUnit`（DelDate=now + 釋放暱稱 NULL + 寫入冷卻歷史，事務化、冪等）、`RecordUnitLogin`（SELECT_UNIT 的登入副作用自 §0a8 起改為 `ApplyUnitLoginReset`）。

⚠ 範圍誠實聲明：GDenyOption／GResurrectionStoneCnt／GSkill／GQuests／GItem 等衛星表**未實作**；SoftDeleteUnit 只處理 gunit 本身（原 proc 還會級聯 GTutor/GItem）；LastPosition 寫死 20000 為原 proc 預設；game DB 與 account DB 是兩個獨立 SQLite 檔，跨庫 UserUID↔LoginUID 無 FK（與原版一致）。
⚠ wire 層尚未消費此 store（SELECT_UNIT_ACK 未動）。

## 0c. 2026-11-17 快照（SELECT_UNIT Step 3a）

`src/server/SelectUnitProtocol.{h,cpp}`、`src/server/UnitSelectArbiter.{h,cpp}`、`tests/test_select_unit.cpp` 新增：JP INT_INTERNAL（`SERV_SELECT_UNIT_PACKET_DIVISION` 定義）下的 `EGS_SELECT_UNIT_REQ`（{UidType}，無 CODE_EVENT/GLOBAL_EVENT_TABLE 欄位）與收尾 `EGS_SELECT_UNIT_ACK`（{int iOK}）線路 codec（golden bytes 自洽）+ 決策層：unit 不存在/已刪除→ERR_SELECT_UNIT_00(35)、歸屬錯誤→ERR_SELECT_UNIT_07(1081，編譯實測)、DB 錯誤→ERR_SELECT_UNIT_05、二級密碼未驗證（bool 參數，V2 尚無帳號二級服務）→ERR_VERIFY_21(578，編譯實測)、成功→NET_OK + RecordUnitLogin。

⚠ 誠實聲明（已被 §0e 部分取代）：**SELECT_UNIT_2_NOT…5_NOT** 未移植；`SELECT_UNIT_1_NOT` 已移植（codec+組裝，§0e），上一版「成功路徑只回收尾 ACK」不再成立。Golden bytes 未對原 SDK 實機驗證。

## 0d. 2026-11-17 快照（UnitData KUnitInfo 子系列 + Login 線路訂正）

**Login 線路訂正**：`SERV_CASH_ITEM_LIST` 實際**已定義**（`#define  SERV_CASH_ITEM_LIST` 雙空格，先前以單空格 grep 漏讀）→ KAccountInfo wire 必含 `m_wstrRegDate`（wstring），位置在 OTP 與 LastLogin 之間。V2 LoginProtocol 已補上 `regDate` 欄位並更新測試。**凡巨集核對必須用寬鬆樣式 `^#define[[:space:]]+X`，已錯兩次（SERV_CASH_ITEM_LIST、SERV_SERVER_BUFF_SYSTEM）。**

**UnitData**：`src/server/UnitData.{h,cpp}`、`tests/test_unit_data.cpp` 新增：KUnitInfo（JP INT_INTERNAL 組合）及其巢狀型別的 wire codec——KStat、KSkillData、KUnitSkillData（含 EQUIPPED_SKILL_SLOT_COUNT=4、GUILD_SKILL_TEST guildPassiveSkill、SERV_SKILL_NOTE skillNote、SERV_SKILL_PAGE_SYSTEM）、KItemAttributeEnchantInfo、KItemInfo（SERV_ITEM_OPTION_DATA_SIZE→vector<int>、SERV_NEW_ITEM_SYSTEM_2013_05→vector<int>+cItemState、SERV_BATTLE_FIELD_BOSS→expandedSocketNum）、KInventoryItemInfo、KDungeonClearInfo、KTCClearInfo、KUserGuildInfo、KLastPositionInfo（SERV_BATTLE_FIELD_SYSTEM+BOSS ignoreLastTouch）、KBuffBehaviorFactor/KBuffFinalizerFactor/KBuffIdentity/KBuffFactor/KBuffInfo（**KBuffFactor 不序列化 m_uidMesGameUnit/m_bIsMesGameUnitNpc**，與原 PUT 一致，有位元組長度斷言保護）、UnitInfo 完整結構（map<int,…> 三組、vector<KBuffInfo>、SERV_PVP_NEW_SYSTEM+SERV_2012_PVP_SEASON2 欄位、SERV_TITLE_DATA_SIZE int titleID、GUILD_TEST userGuildInfo）。容器格式：DWORD 數量前綴 + 元素，map 元素 = [first][second]（tagging=false）。

⚠ 誠實聲明：golden bytes 為自洽佈局，**未對原 SDK 實機驗證**；UnitInfo 結構已有但 SELECT_UNIT_1_NOT…5_NOT 封包本身與資料載入管線未實作；更換巨集組合佈局即變。

## 0e. 2026-11-17 快照（SELECT_UNIT_1_NOT 移植）

**WireHelpers.h**（新增，header-only）：`x2::detail::Put/GetCountPrefixVec/Map` 共享模板——DWORD 數量前綴 + 元素，map 走 key functor（固定 `map<int32_t,…>` 與任意鍵皆可），Get 側有 65536 DoS guard。UnitData.cpp 已重構改用；`x2::Serializer` 需全限定（anonymous namespace 先前踩過）。

**UnitData 擴充**：`UserSkillData`（short skillID / UCHAR skillLevel / UCHAR skillCSPoint）、`UserSkillPageData`（EQUIPPED_SKILL_SLOT_COUNT=4 的 active/passive SkillData + uint16 usSkillPoint/usCashSkillPoint + vector<UserSkillData>）、`RelationshipInfo`（char relationshipType / int64 otherUnitUID / wstr×2 / int64 date / int64 lastReward / char rewardTitleType）——對應原 `KUserSkillData`/`KUserSkillPageData`/`KRelationshipInfo`（CommonPacket.cpp 機讀）。

**SelectUnitNot1**（`SelectUnitProtocol.{h,cpp}`，事件 ID 42）：`int32 iOK → KUnitInfo → wstr unitCreateDate(SERV_CHAR_LOG) → int32 realDataED(SERV_LOGOUT_ED_CHECK) → wstr unitLastLoginDate(SERV_DAILY_CHAR_FIRST_SELECT) → map<int32,int32> inventorySlotSize → map<int64,InventoryItemInfo> items → int32 iNumResurrectionStone → (AP_RESTONE) int32 iNumAutoPaymentResStone + wstr autoPayResStoneLastDate → (SKILL_PAGE_SYSTEM) vector<UserSkillPageData> → vector<int16> vecSkillUnsealed → (SERV_SKILL_NOTE) int8 skillNoteMaxPageNum + map<int8,int32> mapSkillNote → (RELATIONSHIP_SYSTEM) RelationshipInfo`。Put 順序機讀自 CommonPacket.cpp `KEGS_SELECT_UNIT_1_NOT`（SERIALIZE_DEFINE_PUT）。

**組裝路徑**：`BuildSelectUnitNot1(userUID, authLevel, GUnitRecord, out)`（UnitSelectArbiter）由 V2 game DB 的 gunit 表組裝——level/exp/win/lose/stat/lastPos.mapID(←lastPosition)/nickname/regDate/lastDate 有真實資料源；**items/inventorySlotSize/dungeonClear/tcClear/rating/ED/resStone 無對應表，一律填空容器/0（rating/ED 不適用）**；技能頁自 §0a23 起自 gskillexpand/gskill/gskillslotnew/gskillslot2new/gskillunsealed/gskillcash 讀回（§0a23），supplemental==nullptr 時維持 1 頁全預設；spirit 自 GSpirit 讀回（§0a8），spiritMax 恆 0（SpiritTable.lua 未隨倉庫提供）。`HandleSelectUnitReq` 成功路徑新增 outNot1/authLevel 參數（二級密碼閘門之後）。迴路整合測試：server 端成功時**先送 1_NOT(42) 再送收尾 ACK**（對齊原 `SendSelectUnitACK` 次序），client 端先收 1_NOT 再收 ACK。測試自 524 → **557 passed / 0 failed**（新增 Not1 codec golden roundtrip + gunit→Not1 建構 + 迴路 1_NOT 順序斷言）。

⚠ 誠實聲明：golden bytes 為自洽佈局，**未對原 SDK 實機驗證**；SELECT_UNIT 1_NOT…5_NOT 分片皆已移植（§0e…§0i）；**完整角色資料載入管線與 2_NOT…5_NOT 佔位內容替換為真實 DB 資料未開始**；1_NOT 中無資料來源的欄位全為佔位值（見上）；更換巨集組合佈局即變。

## 0f. 2026-11-17 快照（SELECT_UNIT_2_NOT 移植）

**UnitData 擴充**：`SubQuestInstance`（int iID / UCHAR ucClearData / bool bIsSuccess）、`QuestInstance`（int iID / UidType ownerUnitUID / vector<SubQuestInstance>）、`CompleteQuestInfo`（int questID / int completeCount / __int64 completeDate，SERV_DAILY_QUEST）——對應原 KSubQuestInstance/KQuestInstance/KCompleteQuestInfo（CommonPacket.cpp 機讀 PUT 順序）。

**SelectUnitNot2**（`SelectUnitProtocol.{h,cpp}`，事件 ID 43）：`int32 iOK → vector<QuestInstance> vecQuest → (SERV_DAILY_QUEST) vector<CompleteQuestInfo> vecCompletQuest → (SERV_RANDOM_DAY_QUEST) map<int32,int32> mapRandomQuestList`。Put 順序機讀自 CommonPacket.cpp `KEGS_SELECT_UNIT_2_NOT`。JP 巨集核對（寬鬆樣式）：SERV_DAILY_QUEST:236、SERV_RANDOM_DAY_QUEST:1291 已定義。

**組裝**：`BuildSelectUnitNot2(out)`——V2 game DB 無任務/日常任務/隨機日常任務表，容器一律空（不代表角色真實任務狀態。**§0a11 已改為 gquests／gquests_complete／gquests_repeat 讀回；mapRandomQuestList 恆空（script 無資料源）**）。迴路：server 成功時**先 1_NOT、再 2_NOT、再收尾 ACK**（對齊原 `SendSelectUnitACK` 次序）；client 按序收取斷言。測試自 557 → **572 passed / 0 failed**。

⚠ 誠實聲明：golden bytes 為自洽佈局，**未對原 SDK 實機驗證**；SELECT_UNIT **3_NOT…5_NOT 未移植**；2_NOT 容器為空佔位（見上）。

## 0g. 2026-11-17 快照（SELECT_UNIT_3_NOT 移植）

**UnitData 擴充**：`SubMissionInstance`（int iID / short sClearData / bool bIsSuccess）、`MissionInstance`（int iID / vector<SubMissionInstance>）、`TitleInfo`（int iTitleID / wstr wstrEndDate / __int64 kCTime / bool bInfinity）、`PetInfo`（UidType iPetUID / int iPetID〔SERV_PETID_DATA_TYPE_CHANGE〕/ wstr petName / char cEvolutionStep / short sSatiety / int iIntimacy / short sExtroversion / short sEmotion / bool bAutoFeed / wstr lastFeed·lastSummon·regDate / bool bAutoLooting〔SERV_PET_AUTO_LOOTING〕）——對應原 KSubMissionInstance/KMissionInstance/KTitleInfo/KPetInfo（CommonPacket.cpp 機讀）。JP 巨集核對（寬鬆樣式）：SERV_PET_SYSTEM:460、SERV_PETID_DATA_TYPE_CHANGE:3891、SERV_PET_AUTO_LOOTING:2342 已定義；SERV_EVENT_PET_INVENTORY/FREE_AUTO_LOOTING/PERIOD_PET 未定義。

**SelectUnitNot3**（`SelectUnitProtocol.{h,cpp}`，事件 ID 44）：`int32 iOK → vector<MissionInstance> → vector<TitleInfo> → (SERV_PET_SYSTEM) int64 iSummonedPetUID → vector<PetInfo> → vector<int64> vecCanEvolutionPetList → vector<int64> vecNeverSummonPetList → (SERV_PET_SYSTEM) map<int64, map<int64, InventoryItemInfo>> mapPetItem`。Put 順序機讀自 CommonPacket.cpp `KEGS_SELECT_UNIT_3_NOT`。嵌套 map 走 WireHelpers 內層 PutCountPrefixMap。

**組裝**：`BuildSelectUnitNot3(out)`——V2 game DB 無 mission/title/pet/petItem 表，容器空、iSummonedPetUID=0（誠實佔位）。**§0a12 已改為 gtitle_complete/gtitle_mission 讀回 vecTitle/vecMission（pet 仍空佔位）**。迴路：server 成功時**1_NOT → 2_NOT → 3_NOT → 收尾 ACK**；client 按序斷言。測試自 572 → **590 passed / 0 failed**。

⚠ 誠實聲明：golden bytes 為自洽佈局，**未對原 SDK 實機驗證**；SELECT_UNIT **4_NOT…5_NOT 未移植**；3_NOT 容器為空佔位（見上）。

## 0h. 2026-11-17 快照（SELECT_UNIT_4_NOT 移植）

**UnitData 擴充**：`ChatBlackListUnit`、`DenyOptions`（SERV_RELATIONSHIP_SYSTEM 下 6×char）、`TutorialUnitInfo`、`TutorialDBUnitInfo`、`ConnectTimeEventInfo`（SERV_ACC_TIME_EVENT）、`CumulativeTimeEventInfo`（CUMULATIVE_TIME_EVENT + SERV_ACC_TIME_EVENT）、`HenirRankingInfo`（UINT m_ulPlayTime 以 uint32_t 序列化＝wire 4 bytes；SERV_HENIR_RENEWAL_2013 未定義 → 無 bytePlayStartedUserNum）、`FriendInfo`、`FriendMessageInfo`、`MessengerInfo`（map<int64,FriendInfo> + map<char,wstr> + vec<FriendMessageInfo>）、`GamePlayStatus`（含 set<int> m_mapPetMP，依 SDK SerSet＝計數+元素；SERV_RIDING_PET_SYSTM 已定義 → mapRidingPetCoolTime 在線）、`GamePlayStatusContainer`。Put 順序機讀自 CommonPacket.cpp。

**SelectUnitNot4**（`SelectUnitProtocol.{h,cpp}`，事件 ID 45）：`int32 iOK → vecChatBlackList → kDenyOptions → bool bIsRecommend → int64 iRecommendUnitUID → vecTutorialDBUnitInfo → vecConnectTimeEvent → vecCumulativeTimeEvent → vecHenirRanking → kMessengerInfo → kGamePlayStatus`。JP 巨集核對（寬鬆樣式）：SERV_RELATIONSHIP_SYSTEM:3643、SERV_ACC_TIME_EVENT:288、CUMULATIVE_TIME_EVENT:101、SERV_BATTLE_FIELD_SYSTEM:2768、SERV_RIDING_PET_SYSTM:2523 已定義；SERV_RECRUIT_EVENT_BASE、SERV_ARCHUANGEL_S_COIN_EVENT_GUIDE、SERV_HENIR_RENEWAL_2013 未定義。

**組裝**：`BuildSelectUnitNot4(out)`——V2 無黑名單/教學/連線時間/Henir/好友/戰場狀態表，全預設/空（誠實佔位；不代表角色真實狀態）。**kDenyOptions 自 §0a9 起 ← gdenyoption 讀回**（不再是佔位）。迴路：server **1_NOT → 2_NOT → 3_NOT → 4_NOT → 收尾 ACK**；client 按序斷言。測試自 590 → **610 passed / 0 failed**。

⚠ 誠實聲明：golden bytes 為自洽佈局，**未對原 SDK 實機驗證**；SELECT_UNIT **5_NOT 未移植**；4_NOT 各欄位為佔位（見上）。

## 0i. 2026-11-17 快照（SELECT_UNIT_5_NOT 移植完成——1_NOT…5_NOT 全數落地）

**UnitData 擴充**：`SellPersonalShopItemInfo`（kInventoryItemInfo + iPricePerOne/iFeePerOne/(SERV_PSHOP_AGENCY) cPShopItemType/iTotalSellEDIn/iTotalSoldItemQuantity/(SERV_TRADE_LOGIC_CHANGE_AGENCY_SHOP:1978) iInventoryItemUID(UidType)）、`SellPShopItemBackupData`、`UserPShopAgencyInfo`（bIsPShopOpen → wstrAgencyExpirationDate → cShopType → vecSellItemInfo → iUserUID/iUnitUID → wstr×3 → bOnSale）、`HenirRewardCountNot`（SERV_NEW_HENIR_TEST；SERV_HENIR_RENEWAL_2013 未定義 → 無 Challenge 系列）——Put/Get 順序機讀自 CommonPacket.cpp。

**SelectUnitNot5**（`SelectUnitProtocol.{h,cpp}`，事件 ID 46）：`int32 iOK → bool bIsSpiritUpdated → (SERV_CHAR_LOG) map<int32,int32> mapCharGameCount → (SERV_PSHOP_AGENCY) kPShopAgencyInfo → (SERV_NEW_HENIR_TEST) packetHenirRewardCount → (SERV_CONTENT_MANAGER) bCashShopOpen → (SERV_ARA_FIRST_SELECT_TUTORIAL) bFirstSelect → (SERV_LOCAL_RANKING_SYSTEM) bLocalRankingUser`。未定義巨集全數跳過（EVENT_MONEY / 2012_PVP_SEASON2_EVENT / EVENT_BINGO / CUSTOM_CONNECT_EVENT / BOUNS_ITEM_AFTER_7DAYS_BY_LEVEL / GATE_OF_DARKNESS_SUPPORT_EVENT / RELATIONSHIP_EVENT_INT / STEAM_USER_CONNECT_EVENT / ELESIS_UPDATE_EVENT / EVENT_CHUNG_GIVE_ITEM / 4TH_ANNIVERSARY_EVENT）。

**組裝**：`BuildSelectUnitNot5(out)`——V2 無 spirit/CHAR_LOG/pshop/henir-reward/cashshop 狀態表，全 false/0/空（誠實佔位）。迴路：server 成功時 **1_NOT → 2_NOT → 3_NOT → 4_NOT → 5_NOT → 收尾 ACK**（完整對齊原 `SendSelectUnitACK` 次序）；client 按序斷言。測試自 610 → **626 passed / 0 failed**。

⚠ 誠實聲明：golden bytes 為自洽佈局，**未對原 SDK 實機驗證**；1_NOT 中 items/ED/rating/spirit… 與 2_NOT…5_NOT 各容器皆為**佔位值，不代表角色真實狀態**；角色資料載入管線（items/quests/missions/pets/messenger/… 真實 DB 表）未開始。

## 0j. 2026-11-17 快照（GET_MY_INVENTORY 流程移植）

**新增封包**（`SelectUnitProtocol.{h,cpp}`）：`GetMyInventoryReq`（EGS_GET_MY_INVENTORY_REQ=47，原 `IMPL_ON_FUNC_NOPARAM`，空 payload）、`GetMyInventoryAck`（48；{int iOK, bool bIsRecommend}；SERV_SHARING_BANK_QUEST_CASH 未定義 → 無 m_bSharingBank）、`SelectUnitInventoryInfoNot`（EGS_SELECT_UNIT_INVENTORY_INFO_NOT=49；{int iSlotCategory, map<int64,InventoryItemInfo> mapItem}；PUT 順序機讀自原 ClientPacket.cpp）。

**決策**：`HandleGetMyInventoryReq(items, outAck, outNots)`——依 `slotCategory` 分組、空 category 不送（與原 `KInventory::GetSelectUnitInventoryInfo` 一致）、category 升序輸出；`outAck.bIsRecommend=false`（V2 無推薦系統狀態，佔位）。原版會跳過 CXSLInventory ST_BANK/ST_E_EQUIP，V2 未建模該分類常量，**不跳過**。

**迴路**：client 送空 payload 的 47 REQ → server 注入**合成背包**（僅測試線路分片，非真實角色資料）→ 依 category 收到 2 個 49 NOT（category 1→2 升序）→ 48 ACK（iOK=NET_OK）。另有 `TestHandleGetMyInventoryReqGroupsByCategory`（分組排序、空背包 0 NOT 直接 ACK）與 47/48/49 codec roundtrip 測試。測試自 626 → **654 passed / 0 failed**。

⚠ 誠實聲明：V2 **無背包 DB 表**（gunit 無 items；1_NOT items 亦為佔位）——HandleGetMyInventoryReq 不接 DB，呼叫方須傳入 items（目前僅測試以合成資料注入）；wire 佈局為自洽 golden bytes，**未對原 SDK 實機驗證**；推薦狀態 bIsRecommend 為佔位 false；ST_BANK/ST_E_EQUIP 跳過邏輯未建模。

## 0k. 2026-11-17 快照（MY_UNIT_AND_INVENTORY_INFO_LIST 流程移植）

**新增模組** `src/server/UnitListProtocol.{h,cpp}`（命名空間 `x2::unit_list`）：`MyUnitAndInventoryInfoListReq`（EGS_MY_UNIT_AND_INVENTORY_INFO_LIST_REQ=34，NOPARAM 空 payload）、`MyUnitAndInventoryInfoListAck`（35；{int iOK, int nUnitSlot, vector<KUnitInfo> vecUnitInfo}；SERV_SHARING_BANK_QUEST_CASH / SERV_4TH_ANNIVERSARY_EVENT 皆未定義 → 無額外欄位）。PUT 順序機讀自原 ClientPacket.cpp。

**決策層** `HandleMyUnitAndInventoryInfoListReq(gameDb, userUID, userID, authLevel, ack, err)`（UnitSelectArbiter）：guser 以 GetOrCreateGUser 取/建（USSize=50）→ `ListUnitsByUserUID`（Deleted=0、UnitUID 升序）→ 每個角色以 `PopulateUnitInfoFromGUnit`（**自 BuildSelectUnitNot1 抽取的共用填值函式**，UnitData/SelectUnit 行為不變）填 KUnitInfo；ack.iOK=NET_OK。原版對每個角色衍生 level/nowEXP/nextEXP（EXP 表）、疊加職業/等級 stat（stat 表）、填 P2P IP/port——**V2 無 P2P、沿用 gunit 儲存值**（EXP/stat 表已移植 §0u/§0v、IP/port 填空）；原版 S_SERVER_SELECT 狀態閘門與二級密碼前置未建模。DB 失敗 → false（呼叫端可回 ERR_SELECT_UNIT_05）。

**迴路**（雙庫 mkstemp）：CONNECT → VERIFY → **MY_UNIT_LIST REQ → ACK（iOK=NET_OK、nUnitSlot=50、含種子角色「選擇切片」）** → SELECT_UNIT（own）→ 5×NOT → ACK → GET_MY_INVENTORY（合成背包）→ SELECT_UNIT（foreign → ERR_SELECT_UNIT_07）→ SELECT_UNIT（ghost → ERR_SELECT_UNIT_00）。**附帶修正：迴路伺服器事件迴圈上限 6→7**（新增 MY_UNIT_LIST 後原本 6 個事件不夠，ghost 被吃掉；曾以 stdbuf 追出）。另有 `tests/test_unit_list.cpp`（codec roundtrip、guser 自建、ListUnits 過濾其他使用者、空帳號 USSize=50）。測試自 654 → **685 passed / 0 failed**。vcxproj 登記 UnitListProtocol.{h,cpp}。

⚠ 誠實聲明：wire 佈局為自洽 golden bytes，**未對原 SDK 實機驗證**；角色衍生欄位（EXP→level／stat 表疊加已移植 §0u/§0v；P2P）為佔位/沿用儲存值；nUnitSlot 來自 V2 guser（USSize=50 慣例）；MY_UNIT_LIST 之前的 S_SERVER_SELECT 狀態閘門未建模。

## 0l. 2026-11-17 快照（CREATE_UNIT 流程移植）

**NetError**：補 `ERR_CREATE_UNIT_00…09 = 25…34`（沿用 V2 原檔既有註解數值，與 SELECT_UNIT_00=35 銜接一致；ERR_CREATE_UNIT_10/11 數值未以編譯實測，**故不添加、勿推算**）。

**新增模組** `src/server/CreateUnitProtocol.{h,cpp}`（命名空間 `x2::create_unit`）：`CreateUnitReq`（EGS_CREATE_UNIT_REQ=36；{wstrNickName, int iClass}，PUT 順序機讀自原 ClientPacket.cpp）、`CreateUnitAck`（37；{int iOK, KUnitInfo, vector<int> vecSkillSlot, wstr wstrEnableDate}；SERV_GUARANTEE_UNIQUENESS_OF_NAME_CN 未定義 → 無額外欄位）。

**決策層** `HandleCreateUnitReq(gameDb, userUID, authLevel, req, ack, err)`（UnitSelectArbiter）：暱稱 UTF-8 位元組數 1..12（>12 或空 → ERR_CREATE_UNIT_04=29；JP 未定義 SERV_NICK_NAME_MINIMUM_CHECK → 無最小長度）；含 KODBC 注入標記（`;` `'` `"` `--` `/*` `*/` `\`）→ ERR_CREATE_UNIT_08=33；`GameStore::CreateUnit` 結果映射：Ok→NET_OK、UserNotFoundOrDeleted→ERR_CREATE_UNIT_00=25、NicknameTaken→ERR_CREATE_UNIT_01=26、CapacityReached→ERR_CREATE_UNIT_05=30、NicknameInCooldown→ERR_CREATE_UNIT_06=31、DbError→ERR_CREATE_UNIT_02=27；成功後重讀角色，`kUnitInfo ← PopulateUnitInfoFromGUnit`；**vecSkillSlot / wstrEnableDate 原由 AccountDB（DBE_ACCOUNT_CREATE_UNIT_*）填寫，V2 一律空**（誠實佔位）。

⚠ 誠實偏差：職業 templet 以 **enum 模型**近似（原 templet 源 `UnitTemplet.lua` 未隨倉庫提供、`UnitTemplet.mdb` 經徹查為樣板期資料——見 §0a7；templet 存在性閘門已移植，IsInitNormalJob 閘門 §0a3）、~~無字串過濾器/PVP NPC 名檢查~~（FT_NICKNAME §0w／PvP NPC 名 §0a4 已移植）/每日建立上限仍未建模、原版兩段式（DBE_GAME_CREATE_UNIT_* → DBE_ACCOUNT_CREATE_UNIT_*）未建模（V2 單段 game DB）、S_SERVER_SELECT 狀態閘門未建模；wire 佈局為自洽 golden bytes，**未對原 SDK 實機驗證**。`WideToUtf8`（含代理對合併）與 `Utf8ToWide` 互為逆運算（均為 Linux wchar_t=4 下的 UTF-16 代理對路徑，供線路互通）。

**測試**（tests/test_create_unit.cpp）：codec roundtrip（含 CJK 暱稱/skillSlot/enableDate）、空暱稱→04、13+ bytes→04（UTF-8 CJK 3B/字邊界）、恰好 12 bytes→成功、重複暱稱→01、注入標記→08、guser 不存在→00、建立後 ListUnitsByUserUID 可見。測試自 685 → **713 passed / 0 failed**。vcxproj 登記 CreateUnitProtocol.{h,cpp}。**Loopback 未擴充 CREATE_UNIT**（會牽動 MY_UNIT_LIST/ghost 斷言鏈；codec roundtrip + 記憶體內決策層已覆蓋，create→list 副作用以 ListUnitsByUserUID 斷言替代）。

## 0m. 2026-11-17 快照（DELETE_UNIT 流程移植）

**NetError**（均為 NetError_def.h **enum 機讀計數核對值**，而非推算；解析器已重現 CREATE_UNIT_00=25/SELECT_UNIT_05=39/SELECT_UNIT_07=1081 顯式值等既有信任常數）：補 `ERR_DELETE_UNIT_00=986`（無法找到要刪除的角色）、`ERR_DELETE_UNIT_05=987`（刪除失敗）。`ERR_DELETE_UNIT_01..04=979..982`（[CN] SERV_UNIT_WAIT_DELETE 路徑，該巨集未定義）、`ERR_DELETE_UNIT_06=1258`（인연 상태，V2 無 Relationship 系統）→ **不添加**。

**新增模組** `src/server/DeleteUnitProtocol.{h,cpp}`（命名空間 `x2::delete_unit`）：`DeleteUnitReq`（EGS_DELETE_UNIT_REQ=38；`{int64 iUnitUID, int64 iUserUID}`——UidType=int64（KncUidType.h），iUserUID 僅在 SERV_UNIT_DELETE_EXCEPTION_MODIFY 下存在，該巨集已定義 ServerDefine.h:1786）、`DeleteUnitAck`（EGS_DELETE_UNIT_ACK=39；`{int32 iOK, int64 iUnitUID, uint32 uiKNMSerialNum, int32 iGuildUID（GUILD_TEST 已定義 ServerDefine.h:73）, wstring wstrNickName, uint8 ucLevel, int8 cUnitClass（SERV_CHAR_LOG 已定義 :754）}`）；SERV_UNIT_WAIT_DELETE **未定義**（:4594 註解）→ 無 m_tReDelAbleDate/m_tDelAbleDate。PUT/GET 順序機讀自原 ClientPacket.cpp:112–175。

**決策層** `HandleDeleteUnitReq(gameDb, userUID, authLevel, req, ack, err)`（UnitSelectArbiter）：`GetUnitByUID(unitUID)` → 不存在/`deleted`/`rec.userUID != userUID` → `ERR_DELETE_UNIT_00`（原 gup_delete_unit / P_GUnit_UPD_Delete 對不存在或非本人回 -1 → ERR_DELETE_UNIT_00）；`GameStore::SoftDeleteUnit` 失敗 → `ERR_DELETE_UNIT_05`；成功時 ACK：`uiKNMSerialNum=0`（原由 AccountDB `GetMessengerSN` 填寫；JP/VF_INTERNAL 原碼亦跳過、V2 無 AccountDB → 誠實佔位）、`iGuildUID=0`（GUILD_TEST 欄位保留對齊 wire；V2 無公會踢出）、`wstrNickName/ucLevel/cUnitClass`=刪除前角色資料（SERV_CHAR_LOG，同原碼刪除前 SELECT 語意）。

⚠ 誠實偏差：無 SERV_UNIT_WAIT_DELETE（無 P_GUnitWaitDelete_INS/m_tDelAbleDate/wstrReDelAbleDate）、無公會踢出（GUILD_TEST 僅保留欄位）、無公會廣告（SERV_GUILD_AD）、無 Relationship 系統刪除閘門（SERV_RELATIONSHIP_SYSTEM 雖定義，V2 未建模 → ERR_DELETE_UNIT_06 不映射）、`DBE_ACCOUNT_DELETE_UNIT_REQ` 兩段式未建模（V2 單段 game DB，無 GetMessengerSN）、S_SERVER_SELECT 狀態閘門未建模；wire 佈局為自洽 golden bytes，**未對原 SDK 實機驗證**。

**測試**（tests/test_delete_unit.cpp，15 項）：codec roundtrip（含 SERV_CHAR_LOG 欄位）、成功刪除→NET_OK 且 ListUnitsByUserUID 不再可見、重複刪除→00、幽靈角色→00、擁有者 888 合法刪除→NET_OK、非本人（userUID 不符）→00 且受害角色仍在。測試自 713 → **744 passed / 0 failed**。vcxproj 登記 DeleteUnitProtocol.{h,cpp}；EventIDs 38/39 既有。**Loopback 未擴充**（同 CREATE_UNIT 理由；以 list 副作用斷言替代）。

## 0n. 2026-11-17 快照（GET_CREATE_UNIT_TODAY_COUNT 流程移植）

**GameStore**：新增 `CountUnitsCreatedTodayByUser(userUID, &count, err)`——`count(*) FROM gunit WHERE UserUID=? AND Deleted=0 AND RegDate >= datetime('now','start of day')`（今日=本機 UTC 日；原 `P_GUnit_CreateCNT_GET` stored proc 口徑未隨倉庫提供，V2 採此口徑並於此誠實聲明）。

**新增模組** `src/server/CreateTodayCountProtocol.{h,cpp}`（命名空間 `x2::today_count`）：`GetCreateUnitTodayCountReq`（EGS_GET_CREATE_UNIT_TODAY_COUNT_REQ=1163，**無酬載**——原碼 `IMPL_ON_FUNC_NOPARAM`）、`GetCreateUnitTodayCountAck`（**1165**；`{int64 iUserUID, map<int32,int32> mapCreateCharCountToday}`——first=server group, second=當日建立數；1ST_ACK=1164 與最終 ACK 結構相同，**折疊為單段**：原碼 SINGLE_SERVER_GROUP 直接回 Client、DOUBLE_SERVER_GROUP 轉 2nd GameDB；V2 無 server group / 2nd GameDB）。REQ 的 PUT/GET 為 no-op true。**原版外部 Serializer SDK 的 std::map wire 編碼無法從本倉庫驗證**；V2 復用內建 eTAG_MAP 模板（count-prefixed），自洽 golden bytes，**未對原 SDK 實機驗證**。SERV_ENTRY_POINT 已定義（ServerDefine.h:4304）故功能可達；map key（serverGroupID）一律 0 佔位（原碼取 `KBaseServer::GetKObj()->GetServerGroupID()`）。

**決策層** `HandleGetCreateUnitTodayCountReq(gameDb, userUID, ack, err)`（UnitSelectArbiter）：`ack={}` → `CountUnitsCreatedTodayByUser` → `iUserUID=userUID`、`map={{0,count}}`；DB 失敗回傳 false。

**測試**（tests/test_create_today_count.cpp，13 項）：REQ 空酬載 no-op roundtrip、ACK roundtrip（含 map 兩組）、初始計數 0、建立 2 角色→計數 2、他人計數 0、刪除 1 個→計數 1。測試自 744 → **766 passed / 0 failed**。vcxproj 登記 CreateTodayCountProtocol.{h,cpp}；Loopback 未擴充。

**累計事件覆蓋（REQ/ACK 成對）**：CREATE(36/37)、DELETE(38/39)、SELECT(40/41)、SELECT_UNIT 1~5_NOT(42~46)、GET_MY_INVENTORY(47/48/49)、MY_UNIT_AND_INVENTORY_INFO_LIST(34/35)、GET_CREATE_UNIT_TODAY_COUNT(1163→1165)。

## 0o. 2026-11-17 快照（ENTRY_POINT_CHECK_NICK_NAME 流程移植）

**GameStore**：新增 `NicknameCheckResult CheckNicknameAvailable(nickname, err)`——純查詢（`gunit_nickname` 活躍暱稱 → `Taken`；`gdeleted_nickname_history` 14 天內 → `InCooldown`；否則 `Available`）。新增 enum `NicknameCheckResult { Available, Taken, InCooldown, DbError }`。

**NetError**（NetError_def.h enum 機讀計數核對值）：補 `ERR_RESTORE_NICK_NAME_02=330`（同名已存在，原 gup_check_nickname -1）、`_03=331`（冷卻，原 -2）、`_05=333`（非法暱稱/注入標記）、`_06=334`（暱稱長度）。

**新增模組** `src/server/CheckNicknameProtocol.{h,cpp}`（命名空間 `x2::check_nickname`）：`EntryPointCheckNickNameReq`（EGS_ENTRY_POINT_CHECK_NICK_NAME_REQ=1161；`{int32 iServerGroup, wstring wstrNickName}`，PUT 順序機讀自 ClientPacket.cpp:15013）、`EntryPointCheckNickNameAck`（=1162；**`KEGS_CHECK_NICK_NAME_ACK`** typedef 別名 `KEGS_ENTRY_POINT_CHECK_NICK_NAME_ACK`；`{int32 iOK, int64 iUnitUID, wstring wstrNickName}`）。wire 佈局自洽，**未對原 SDK 實機驗證**。

**決策層** `HandleCheckNicknameReq(gameDb, req, ack, err)`：UTF-8 位元組數 1..12 否則 `ERR_RESTORE_NICK_NAME_06`；KODBC 注入標記 → `ERR_RESTORE_NICK_NAME_05`；`CheckNicknameAvailable` 映射 Available→NET_OK / Taken→02 / InCooldown→03；DB 錯誤 → return false。ack.iUnitUID=0（原碼未填）、wstrNickName=回顯。

⚠ 誠實偏差：~~無 SiCXSLStringFilter~~ FT_NICKNAME 已移植（§0w；GetAuthLevel() < UAL_GM(2) 才生效、GM 繞過）；原碼依 server group 路由 1st/2nd GameDB → V2 單一 game DB，**m_iServerGroup 忽略**；AF_INTERNAL 分支（內部旗標直接放行）未建模；gup_check_nickname 在 NULL SERV_ALL_RENEWAL_SP 下的精確口徑以 V2 兩表查詢近似（與 CreateUnit 的冷卻查詢一致）。SERV_ENTRY_POINT 已定義（ServerDefine.h:4304）故功能可達。

**測試**（tests/test_check_nickname.cpp，16 項）：REQ/ACK codec roundtrip（含 CJK）、可用→NET_OK+回顯、空→06、13+ bytes→06（UTF-8 CJK 3B/字邊界）、注入→05、暱稱已存在→02、SoftDeleteUnit 後冷卻→03。測試自 766 → **790 passed / 0 failed**。vcxproj 登記 CheckNicknameProtocol.{h,cpp}；Loopback 未擴充。**註**：首版測試暱稱為 21-byte CJK 誤判（>12）導致 2 FAIL，改用 9-byte 暱稱後全綠——UTF-8 位元組口徑測試需自量長度。

## 0p. 2026-11-17 快照（CHANGE_NICK_NAME 流程移植）

**NetError**（NetError_def.h enum 機讀計數核對值；解析器已重現既有信任常數）：補 `ERR_RESTORE_NICK_NAME_00=328`（找不到角色，原 -1）、`_01=329`（非復原對象，原 -2）、`_04=332`（復原失敗/SP 未命中，原 -5）。

**GameStore**：① `CheckNicknameAvailable` 增加 `excludeUnitUID` 參數（預設 0；`UnitUID != ?` 排除自身——改名情境用）；② 新增 enum `ChangeNicknameResult{Ok, UnitNotFoundOrDeleted, NotRestorable, Taken, InCooldown, Failure, DbError}` 與 `ChangeUnitNickname(unitUID, newNickname)`——事務化：讀舊暱稱（含刪除標記）→ `CheckNicknameAvailable`（排除自身）→ **舊暱稱寫入 `gdeleted_nickname_history`**（與 SoftDeleteUnit 同語意）→ `UPDATE gunit_nickname`。

**新增模組** `src/server/ChangeNicknameProtocol.{h,cpp}`（命名空間 `x2::change_nickname`）：`ChangeNickNameReq`（EGS_CHANGE_NICK_NAME_REQ=431；`{iUnitUID, wstrNickName, bCheckOnly}`，PUT 順序機讀自 ClientPacket.cpp:5715）、`EntryPointChangeNickNameReq`（EGS_ENTRY_POINT_CHANGE_NICK_NAME_REQ=1168；`{iServerGroup, iUnitUID, wstrNickName, bCheckOnly}`，:15044）、`ChangeNickNameAck`（EGS_CHANGE_NICK_NAME_ACK=432；`{iOK, iUnitUID, wstrNickName, bCheckOnly}`，:5731）。wire 佈局自洽，**未對原 SDK 實機驗證**。

**決策層** `HandleChangeNicknameReq(gameDb, userUID, req, ack, err)`（`HandleEntryPointChangeNicknameReq` 轉發至同一路徑）：UTF-8 1..12 bytes 否則 `_06`；KODBC 注入標記 → `_05`；**擁有權閘門**（GetUnitByUID 不存在/已刪除/非本人 → `_00`；原碼未檢查擁有權——V2 加固，誠實偏差）；`bCheckOnly=true` → `CheckNicknameAvailable(排除自身)`：Available→NET_OK／Taken→02／InCooldown→03；`bCheckOnly=false` → `ChangeUnitNickname`：Ok→NET_OK／UnitNotFoundOrDeleted→00／NotRestorable→01／Taken→02／InCooldown→03／Failure→04／DbError→false。ack 回顯 iUnitUID/wstrNickName/bCheckOnly。

⚠ 誠實偏差：~~無 SiCXSLStringFilter~~ FT_NICKNAME 已移植（§0w）；~~無 SERV_PVP_NEW_SYSTEM **已定義**之 NPC 名檢查~~（§0a4 已移植，→ERR_CREATE_UNIT_01=26）；原碼依 server group 路由 1st/2nd GameDB → V2 單一 game DB，**iServerGroup 忽略**；SERV_GUARANTEE_UNIQUENESS_OF_NAME_CN 未定義 → 無 Giant RoleReg 路徑；成功後**無 LogDB**（ELOG_CHANGE_NICK_NAME_NOT）；S_SERVER_SELECT 閘門未建模；舊暱稱 14 天冷卻為 V2 重建（原 stored proc 未隨倉庫提供）。

**測試**（tests/test_change_nickname.cpp，18 項）：codec roundtrip（兩種 REQ + ACK）、空→06、注入→05、非本人→00、bCheckOnly 可用/占用他人/**自己的現有名（排除自身）→NET_OK**、實際改名→NET_OK（再讀回 store 為新暱稱；**舊暱稱進 14 天冷卻 → check 回 03**）、改回冷卻中舊暱稱→03、同名改名→NET_OK、ENTRY_POINT 入口共享決策。測試自 790 → **826 passed / 0 failed**。vcxproj 登記 ChangeNicknameProtocol.{h,cpp}；Loopback 未擴充。**修正記錄**：測試首版 fixture「別人的占位」為 15 bytes CJK 被長度閘門擋下（06≠02），改 12 bytes fixture 後全綠（UTF-8 字節口徑需先自量）。

## 0q. 2026-11-17 快照（ENTRY_POINT CREATE_NEW_UNIT / DELETE_UNIT 變體）

原 `SERV_ENTRY_POINT`（ServerDefine.h:4304）家族的兩個變體事件完成移植。兩者皆為 EGS_ENTRY_POINT 版本，沿用既有後端決策：

**EGS_CREATE_NEW_UNIT_REQ（1159）**＝{wstrNickName, iClass, iServerGroup}（PUT 順序機讀自 ClientPacket.cpp:15012 起），回覆 **EGS_CREATE_UNIT_ACK（37）**。`HandleCreateNewUnitReq` 忽略 iServerGroup 並轉發至 `HandleCreateUnitReq`。
原碼特有閘門：`SiCXSLUnitManager()->GetUnitTemplet` 驗證 iClass（無 templet → `ERR_CREATE_UNIT_03`=28）**已於 §0a7 以 enum 模型移植**（原碼順序：templet(03) → IsInitNormalJob(1289)）；`SiKPvpMatchManager()->IsExistPvpNpcName`（→ERR_CREATE_UNIT_01=26）**已於 §0a4 移植**（CREATE_UNIT 共用決策：length→StringFilter→本閘門→注入；原碼 CHANGE_NICK_NAME 順序為 StringFilter→注入→本閘門，V2 各 handler 對齊各自原碼順序）。`IsInitNormalJob`（→ `ERR_CREATE_UNIT_11`，**enum 機讀實測＝1289**）**已於 §0a3 移植**（templet 存在性閘門 §0a7 已先行移植，失敗為 28、通過後才進 IsInitNormalJob）。注入分支原碼用 `ERR_ODBC_00=175`（與 EGS_CREATE_UNIT_REQ 的 ERR_CREATE_UNIT_08=33 不同）。V2 共用決策（長度→04／注入→08）與誠實偏差聲明不變。

**EGS_ENTRY_POINT_DELETE_UNIT_REQ（1160）**＝{iUnitUID, iUserUID, iServerGroup}（PUT 順序機讀自 :15028 起），回覆 **EGS_DELETE_UNIT_ACK（39）**。`HandleEntryPointDeleteUnitReq` 忽略 iServerGroup 並轉發至 `HandleDeleteUnitReq`（擁有權閘門等語意同前）。

兩者皆經由 `DeleteUnitProtocol`/`CreateUnitProtocol` 擴充的 `EntryPointDeleteUnitReq` / `CreateNewUnitReq` 結構。EventIDs 1159/1160 既有。

**測試**（tests/test_entry_point_unit.cpp，15 項）：兩種 REQ codec roundtrip（PUT 順序 iServerGroup 在第 3 位）、ENTRY_POINT 建立→NET_OK+unitInfo、同名再建→01、13+ bytes→04、ENTRY_POINT 非本人刪除→00（受害角色仍在）、ENTRY_POINT 本人刪除→NET_OK（SERV_CHAR_LOG 欄位自刪除前 record 回填）。測試自 826 → **847 passed / 0 failed**。wire 佈局自洽，**未對原 SDK 實機驗證**；Loopback 未擴充。未新增 .cpp → vcxproj 無需登記。

**NetError 更正紀錄**：本輪 enum 機讀計數（同 §0m 解析器）實測 `ERR_CREATE_UNIT_11=1289`（舊筆記 1294 錯誤，已更正）、`ERR_ODBC_00=175`、`ERR_ODBC_01=555`。

## 0r. 2026-11-17 快照（CHARACTER_LIST + map 線路慣例統一）

**EGS_CHARACTER_LIST_REQ（1155，NOPARAM）/ _1ST_ACK（1156）/ _2ND_REQ（1157）/ EGS_CHARACTER_LIST_ACK（1158）**：原 `SERV_ENTRY_POINT` 家族；`KEGS_CHARACTER_LIST_1ST_ACK` 為 `KEGS_CHARACTER_LIST_ACK` 的 typedef（同一結構）。wire（ACK）：`{int iOK, map<int,int> mapServerGroupUnitSlot, map<int, vector<KUnitInfo>> mapServerGroupUnitInfo, wstring strUserID}`；PUT 順序機讀自 ClientPacket.cpp:14964。

**新增模組** `src/server/CharacterListProtocol.{h,cpp}`（`x2::character_list`）。**決策層** `HandleCharacterListReq(gameDb, userUID, userID, authLevel, ack, err)`：`GetOrCreateGUser`（取得 `usSize`→`mapServerGroupUnitSlot={{0,usSize}}`）→ `ListUnitsByUserUID` → `mapServerGroupUnitInfo={{0, vec}}`（逐個 `PopulateUnitInfoFromGUnit`）→ `strUserID=Utf8ToWide(userID)`、`iOK=NET_OK`。SINGLE_SERVER_GROUP 語意折疊（無 2nd DB、無會合）；map key=serverGroupID 一律 0 佔位。

**map 線路慣例統一（⚠️ wire 變更）**：V2 的 map wire 慣例（`WireHelpers.h` `detail::PutCountPrefixMap`：count-prefix + 無 tag/wrapper）此前已被 10+ 處使用（SelectUnitProtocol / UnitData / UnitListProtocol…），但 `CreateTodayCountProtocol`（§0n）誤用了 `Serializer::Put(std::map)`（會寫 `eTAG_MAP`+`eTAG_PAIR`）。本輪將其改為 count-prefix 慣例（**wire 自洽佈局，非 SDK 驗證**）。`map<int, vector<KUnitInfo>>` 因 UnitInfo 無 Serializer 模板，改走 `PutCountPrefixMap` + 內層 `PutCountPrefixVec(unit::PutUnitInfo)`。

⚠ 誠實偏差：templet 以 enum 模型近似（§0a7；原碼缺 templet → `ERR_CREATE_UNIT_03`=28，V2 無 templet 模型未命中同樣回 28）、~~無 EXP/stat 表~~（已移植 §0u/§0v）、無 P2P IP/port（空）、無 server group / 1st+2nd GameDB 會合、SERV_BATTLE_FIELD_BOSS 地圖修正未建模、`m_setMyUnitUIDList` 狀態未複製。

**測試**（tests/test_character_list.cpp，14 項）：REQ 空酬載 no-op roundtrip、ACK codec roundtrip（map→map→vector<UnitInfo> 巢狀）、空列表（slot=50、空 vec、strUserID 回顯）→ 建 2 角色→2 筆→他人使用者空列表。測試自 847 → **873 passed / 0 failed**。vcxproj 登記 CharacterListProtocol.{h,cpp}；Loopback 未擴充。

## 0s. 2026-11-17 快照（ENTRY_POINT_GET_CHANNEL_LIST 流程移植）

**EGS_ENTRY_POINT_GET_CHANNEL_LIST_REQ（1166，NOPARAM）/ EGS_ENTRY_POINT_GET_CHANNEL_LIST_ACK（1167）**（原 GSUserSession.cpp:3480 `IMPL_ON_FUNC_NOPARAM`）。REQ 空酬載；ACK=`{map<int,KChannelInfo> m_mapSolesChannelList, map<int,KChannelInfo> m_mapGaiaChannelList, map<int,KChannelBonusInfo> m_mapSolesChannelBonusList, map<int,KChannelBonusInfo> m_mapGaiaChannelBonusList}`，PUT 順序機讀自 ClientPacket.cpp:15062。

**KChannelInfo**（Common/CommonPacket.h:6322；SERV_INTEGRATE_THE_CHANNEL_INFO **未定義** → 無內嵌 bonus 欄位）wire：`{int iServerUID, int iChannelID, wstring wstrChannelName, int iServerGroupID, wstring wstrIP, uint16 usMasterPort, uint16 usNCUDPPort, int iMaxUser, int iCurrentUser, int iCurPartyCount, int iPlayGamePartyCount}`（PUT 順序機讀自 CommonPacket.cpp:5667–5688）。**KChannelBonusInfo**（:6304）：`{bool bEnable, int iBeginLv, int iEndLv, int iPerExp, int iPerED}`（:5647–5655）。map 走 V2 慣例 count-prefix（無 eTAG_MAP/eTAG_PAIR）。

**新增模組** `src/server/EntryPointChannelListProtocol.{h,cpp}`（`x2::channel_list`）；**決策層** `HandleGetChannelListReq(ack)`：V2 無 SiKChannelManager（頻道註冊表）→ **四張表一律空**（誠實佔位）、不查 DB、永遠成功；原碼 SGI_SOLES/SGI_GAIA 的 1st/2nd 對應互換亦無從建模。

⚠ 誠實偏差：wire 佈局自洽 golden bytes，**未對原 SDK 實機驗證**；map 編碼不可從倉庫驗證（原版外部 Serializer SDK）；無頻道資料來源（空表為合法佔位）；未含 SERV_GET_CHANNEL_LIST_REQ（field-map 事件，S_FIELD_MAP 狀態閘門）。

**測試**（tests/test_channel_list.cpp，11 項）：REQ 空酬載 no-op roundtrip、ChannelInfo roundtrip（含 wstring CJK 頻道名與埠）、ChannelBonusInfo roundtrip、ACK roundtrip（四表各 1–2 項）、HandleGetChannelListReq 回空表。測試自 873 → **889 passed / 0 failed**。vcxproj 登記 EntryPointChannelListProtocol.{h,cpp}；Loopback 未擴充。

**SERV_ENTRY_POINT 事件狀態**：EGS_CHARACTER_LIST(1155–1158 折疊)、EAGLE CREATE_NEW_UNIT(1159)、ENTRY_POINT_DELETE_UNIT(1160)、CHECK_NICK_NAME(1161/1162)、GET_CREATE_UNIT_TODAY_COUNT(1163–1165)、GET_CHANNEL_LIST(1166/1167)、ENTRY_POINT_CHANGE_NICK_NAME(1168)——**SERV_ENTRY_POINT 家族已全部覆蓋**（REQ/ACK 成對；1157 2ND_REQ 無 2nd DB 未實作；1164–1165 1ST_ACK 折疊）。

## 0t. 2026-11-17 快照（CREATE→LIST→DELETE 迴路整合測試）

**新增** `tests/test_create_delete_flow.cpp`（`RunCreateDeleteFlowTestsByRef`）：以真實 mkstemp account/game 庫 + TCP loopback 跑完整閉環——CONNECT → VERIFY（"flowtester"）→ MY_UNIT_AND_INVENTORY_INFO_LIST_REQ（初始 0 角色）→ **CREATE_UNIT_REQ（36）**（ACK：NET_OK、kUnitInfo、nickName L"迴路角色"、iClass=5）→ MY_UNIT_LIST（1 角色，unitUID 與 CREATE 一致）→ **DELETE_UNIT_REQ（38）**（ACK：NET_OK、iUnitUID 回顯、SERV_CHAR_LOG 欄位 wstrNickName=L"迴路角色"／ucLevel=1／cUnitClass=5）→ MY_UNIT_LIST（0 角色）。伺服器端 7 個事件依序（`for i<7`）全部走真實決策層 + 真實 DBs；客戶端逐一斷言。

意義：之前各 REQ/ACK 僅有 codec roundtrip + 記憶體內決策層單元測試；本測試首次**以真實 socket + 真實雙庫驗證 create→visible→delete→gone 閉環**（不經記憶體模擬）。

測試自 889 → **929 passed / 0 failed**。無新模組 → vcxproj 無需登記。

**⚠ 上方「無 EXP/stat 表（沿用 gunit 值）」已由 §0u/§0v 解除（EXP 表與 stat 表皆已移植）。**

**目前 wire 事件覆蓋總覽**（全部成對，自洽 golden bytes，未對 SDK 實機驗證）：CONNECT/VERIFY、SELECT_UNIT(40/41)、SELECT_UNIT_1..5_NOT(42–46)、GET_MY_INVENTORY(47/48/49)、MY_UNIT_AND_INVENTORY_INFO_LIST(34/35)、CREATE_UNIT(36/37)、DELETE_UNIT(38/39)、CHECK_NICK_NAME(1161/1162)、CHANGE_NICK_NAME(431/432，含 ENTRY_POINT 1168)、ENTRY_POINT_CREATE_NEW_UNIT(1159)/ENTRY_POINT_DELETE_UNIT(1160)、CHARACTER_LIST(1155→1158 折疊）、GET_CREATE_UNIT_TODAY_COUNT(1163→1165 折疊）、GET_CHANNEL_LIST(1166/1167，空表佔位）。

## 0u. 2026-11-17 快照（ExpTable 經驗值→等級換算移植）

**新增模組** `src/server/ExpTable.{h,cpp}`（`x2::exp_table`）＋`src/server/ExpTableData.inc`（**由 tools/gen_exp_table.py 自動產生，勿手改**）。

**資料來源**：本倉庫既有的遊戲官方資料表 `ScriptData/ExpTable.xls`（Sheet1：레벨/필요EXP/총경험치；80 級；產生器同源於原碼 `AddExpTable_LUA` 讀入的 EXP 表）。產生器載入 xls 後做完整性檢查：級別連續 1..80、level 1 = (need 0, total 0)、need 累加＝total（2..80 全表）、total 嚴格遞增；任一不符即中止，不會寫出不一致的 inc。

**API**（語意對齊原碼 `Common/ExpTable.{h,cpp}`）：
- `GetRequireNeedExpbyLevel(nLevel)` / `GetRequireTotalExpbyLevel(nLevel)`：查無 level 時——若 nLevel ≤ 0 → 0；若 nLevel > 80 → 表頂值（原碼 `rbegin()` 邏輯）；表內直接索引。
- `CheckLevelUp(nLevel, nExp)`：nLevel<1 夾到 1、nExp<0 夾到 0；自 nLevel 起第一個 `totalExp > nExp` 的層 L；L == nLevel → 回 nLevel，否則回 L-1；nExp ≥ totalExp(80)=866,438,000 → 80。

**UnitInfo 接上**：`PopulateUnitInfoFromGUnit` 現在以 EXP 重算 `level = CheckLevelUp(1, gunit.Exp)`，並填 `nowBaseLevelEXP = GetRequireTotalExpbyLevel(level)`、`nextBaseLevelEXP = GetRequireTotalExpbyLevel(level+1)`（原碼 SELECT_UNIT 路徑同法），取代先前「無 EXP 表、沿用 gunit.Level、now/nextBaseLevelEXP=0 佔位」（STUDIO 偏差）。gunit.Level 欄位本身仍照原值存檔（未於寫入時強制覆寫），讀出時一律以 EXP 換算為準。

⚠ 誠實偏差：(1) 原碼 `SERV_MAX_LEVEL_CHECK` 路徑以 `SiKGameSysVal()->GetLimitsLevel()` 截斷結果；V2 無 GameSysVal → **以 80 為硬上限**（若 JP 實際上限較低，需待 GameSysVal 移植後再收）。(2) `ExpTable.lua` 不存在於本倉庫（資料真源是 xls）；未對照原 Lua 逐列 diff（xls 已自洽驗證）。(3) 等級換算只在「讀 gunit → UnitInfo」時發生；其他寫入路徑（如 CREATE_UNIT 固定 level 1）行為不變。(4) totalExp 最大 866,438,000 < 2^31，int32 安全。

**測試**（tests/test_exp_table.cpp）：表完整性（累加/遞增/抽樣值/表頂溢出/0 與負數）、`CheckLevelUp` 邊界（0/599/600/1899/1900/6700/表頂/溢出/夾層）、`PopulateUnitInfoFromGUnit` 以 `:memory:` 庫改 gunit.Exp=6700 後讀出（level=5、nowBase=6700、nextBase=10500）。測試自 929 → **967 passed / 0 failed**。vcxproj/filters 登記 ExpTable.{h,cpp}＋ExpTableData.inc；Linux 建置腳本以 `ls src/server/*.cpp` 自動納入（無需改登記）。

## 0v. 2026-11-17 快照（StatTable 等級→基礎屬性表移植）

**新增模組** `src/server/StatTable.{h,cpp}`（`x2::stat_table`）＋`src/server/StatTableData.inc`（**由 tools/gen_stat_table.py 自動產生，勿手改**，180 KB / 4160 列）。

**資料來源**：本倉庫既有的遊戲官方資料 `ServerResource/JP/StatTable.lua`（與 KR 原碼 Lua 同源；**JP/TW/root 三份 md5 一致** = 25d523bb711baf638fd65270ea3312d6）。產生器解析 `ReserveMemory(class, 80)`（52 個 class）與 `SetUnitStat(class, level, {AtkPhysic=…, AtkMagic=…, DefPhysic=…, DefMagic=…, HP=…})`（4198 列），並做完整性檢查：僅保留 level ≤ ReserveMemory 容量者、每保留 class 恰好 1..80 各一列、無重複、數值非負、**Lua→UINT 截斷**（720 列 HP 帶 .5、唯一 DefMagic=77.6→77、class 121 L62 HP 114187.5→114187）。

**容量外丟棄**：class 110/111 的 level 81..99 共 **38 列**，原碼 `SetUnitStat` 的 JIF 容量檢查（vector 容量 81、dummy 0）本來就寫不進去；產生器比照丟棄並於 inc 標頭註記——**與原碼行為一致**，非資料缺漏。

**API**：`bool GetUnitStat(int unitClass, int unitLevel, UnitStatInfo& out)`（binary search；查無（未知 class／level<1／level>80）→ false 且 out 歸零）。

**UnitInfo 接上**：`PopulateUnitInfoFromGUnit` 現在以 `level = CheckLevelUp(1, Exp)`（§0u）查 stat 表，`u.stat = {gunit.BaseHP + s.hp, gunit.AtkPhysic + s.atkPhysic, gunit.AtkMagic + s.atkMagic, gunit.DefPhysic + s.defPhysic, gunit.DefMagic + s.defMagic}`——**逐欄 "+= 表值"**，對齊原碼 `OnAccountSelectUnitAck`（GSUserFunction.cpp:4742，查無時 sUnitStat 保持 0）。gunit 未知 class 或攻擊屬性 seed 為 0 → 新建角色之 UnitInfo stat 恰為表值。`gameStat` 仍鏡射 `stat`（佔位不變）。

⚠ 誠實偏差：(1) 原碼以 `CXSLUnit::UT_END` 範圍閘控 class（2 轉 /100 規則），V2 以「表內存在」為準（等價、更簡單）。(2) StatTable.xls（ScriptData）未解析——資料真源是 Lua（與原碼載入路徑相同）。(3) 2 轉角色 1 級 stat 由「1 級보정 던전」額外補償 80%（HP 100%）之機制（lua 檔頭註解）**未建模**。(4) JP 為預設地區（StatTable.lua 三份相同，無地區差異）。(5) wire 佈局不變（UnitInfo 欄位語意變更，非格式變更）。

**測試**（tests/test_stat_table.cpp，33 項）：已知值（class 1 L1/L80、class 118 L1 DefMagic 77.6→77、class 121 L62 HP x.5 截斷、class 110/80 無空格 lua 列）、miss 語意（110/81、111/99、level 0/81、class 0/-1/999、miss 歸零）、52 class × 1..80 全可查、`:memory:` 遊戲庫（create class-1 → UPDATE Exp=1900 → level 3 → stat = 0 + 表值(1,3)、gameStat 鏡射）。tests/test_select_unit.cpp 的 not1 stat 斷言隨語意更新（0 → 表值(1,1)）。測試自 967 → **1002 passed / 0 failed**。vcxproj/filters 登記 StatTable.{h,cpp}＋StatTableData.inc；Linux 建置腳本以 `ls src/server/*.cpp` 自動納入。

## 0w. 2026-11-17 快照（StringFilter 暱稱過濾移植，FT_NICKNAME 語意）

**新增模組** `src/server/StringFilter.{h,cpp}`（`x2::string_filter`）＋`src/server/StringFilterData.inc`（**由 tools/gen_string_filter.py 自動產生，勿手改**，266+1389 條）。

**資料來源**：本倉庫既有官方資料 `ScriptData/StringFilter.xls`（`NickName` 266 列 → exact ban list；`Word` 1390 列剔除 1 條全空白列 → 1389 條 substring ban list）。6 組（NickName）/27 組（Word）大小寫不敏感重複保留、與兩端空白列保留（原資料如此，僅報告）。xls 無 NICKNAMEWORD／POSTWORD 型別 → **無 NickNameWord／PostWord 列表**（誠實缺口）。禁用字由 DB ScriptDB 動態更新之路徑**未建模**（靜態 xls 快照）。

**語意對齊原碼**（Common/X2Data/XSLStringFilter.cpp `FT_NICKNAME`＋Common/StringFilterManager.cpp `CheckIsValidString`）：
1) 字元集閘門依建置期地區（`X2_REGION_*` ↔ 原 runtime AuthFlag，V2 無 KSimLayer）：JP（預設）→ {A-Za-z0-9} ∪ 平假名/片假名/片假名擴充/康熙部首/CJK 擴A/CJK 統一/CJK 相容/astral 20000-2A6DF+2F800-2FA1F（原 SERV_COUNTRY_JP 的 SERV_COUNTRY_TWHK|CN 分支）；TW/HK/CN → {A-Za-z0-9} ∪ 4E00-9FA5；其他地區 → 寬鬆（原碼最終 else → continue）。輸入先 ASCII 上轉（原碼 towupper(locale)）。
2) ASCII 上轉後 exact 命中 nickname ban list → 拒；3) substring 命中 word ban list → 拒；4) 禁用標記子字串（空格／半形引號／`/`／`\`／`(`／`)`／`]`／`[`／`%`／`!`／`GM`）→ 拒（無條件，同原碼）。
**接線**：CREATE_UNIT（length→filter→injection，filter 拒 → `ERR_CREATE_UNIT_08`）、CHANGE_NICK_NAME 與 CHECK_NICK_NAME（filter 拒 → `ERR_RESTORE_NICK_NAME_05`）；僅 `authLevel < SEnum::UAL_GM(2)` 時生效（GM 以上繞過，同原碼）。`HandleCheckNicknameReq`／`HandleChangeNicknameReq`／`HandleEntryPointChangeNicknameReq` 新增 `authLevel` 參數（**預設 0＝非 GM**）；ENTRY_POINT 變體透傳；CREATE_NEW_UNIT 已由既有 authLevel 透傳。順序與錯誤碼對齊原碼（length→filter→injection；create 的兩關共用 _08、change/check 的兩關共用 _05，無法由外部區辨——與原碼一致）。

⚠ 誠實偏差：(a) 僅 ASCII 上轉（CJK/Hangul 無大小寫，語意等價）；(b) astral 字元——Linux wchar_t=32-bit 可比對；MSVC wchar_t=16-bit → astral 拆 surrogate、逐單元不過字元集閘門（JP 建置下 astral 暱稱被拒，Windows 限定）；(c) 原碼 CJK 上限 9FBF/9FA5 與 Unicode 實際邊界不同，忠實照抄；(d) 原碼 SERV_STRING_FILTER_SCRIPT_REFRESH/DB 動態更新/RefreshSingleton 路徑未建模；(e) 原碼兩套重複實作（XSLStringFilter vs KStringFilterManager，USING_DB 巨集分流）語意相同 → V2 合併為一份；(f) 呼叫端（check/change/entry-point）目前無 session authLevel 來源，預設 0＝套用過濾器（安全預設）。

**測試**（tests/test_string_filter.cpp，50 項）：字元集閘門（alnum CJK 片假名 全形數字拒 半形括號 韓文 JPEG）、banned exact（NEXON 大小寫不敏感）、banned substring（FUCK/18금）、禁用標記（GM 含大小寫、括號、斜線、百分號、驚嘆號…）、CREATE_UNIT 接線（authLevel 1 擋 NEXON→_08、authLevel 2 GM 繞過、a'b→_08）、CHANGE_NICKNAME/CHECK_NICK_NAME 接線（authLevel 1→_05、GM 繞過、entry-point 透傳）。測試自 1002 → **1052 passed / 0 failed**。vcxproj/filters 登記；Linux 建置腳本自動納入；生建器僅需 xlrd。

## 0x. 2026-11-17 快照（FT_NICKNAME 過濾器迴路整合測試）

**新增** `tests/test_nickname_filter_flow.cpp`（`RunNicknameFilterFlowTestsByRef`）：以真實 mkstemp account/game 雙庫 + TCP loopback 跑 **CONNECT → VERIFY → CREATE_UNIT ×4 → MY_UNIT_AND_INVENTORY_INFO_LIST** 全鏈，authLevel 一律傳 **0（UAL_NORMAL）**：

1. `NEXON`（banned nickname exact）→ ACK `ERR_CREATE_UNIT_08`；
2. `FUCK之王`（banned word substring「FUCK」）→ `ERR_CREATE_UNIT_08`；
3. `a'b`（JP 字元集閘門拒絕，半形單引號）→ `ERR_CREATE_UNIT_08`；
4. `湯姆熊`（合法 CJK）→ `NET_OK`；
5. MY_UNIT_LIST 只見建立成功的那一隻（unitUID 與第 4 步一致；前 3 個失敗請求不落库）。

意義：§0w 的過濾器先前僅有決策層單元測試；本測試首次以**真實 socket + 真實雙庫**驗證非 GM 呼叫端的線路級拒絕與通過閉環（codec → 決策 → DB）。（既有 `tests/test_create_delete_flow.cpp` 以 authLevel=5 為 GM 繞過 harness，語意保留不動。）

測試自 1052 → **1085 passed / 0 failed**。無新模組 → vcxproj 無需登記。§12-11（GDenyOption 等）不受影響。

## 0y. 2026-11-17 快照（CHANGE_NICK_NAME／CHECK_NICK_NAME 迴路整合測試）

**新增** `tests/test_nickname_change_flow.cpp`（`RunNicknameChangeFlowTestsByRef`）：真實 mkstemp account/game 雙庫 + TCP loopback，**authLevel 一律 0（UAL_NORMAL，filter 生效；handler 走 authLevel 預設參數）**：

CONNECT → VERIFY（"changenickflow"）→ CREATE_UNIT(L"原創者", class 5) → CHANGE_NICK_NAME_REQ(431，bCheckOnly=true)：

1. 新名稱 → `NET_OK`；
2. 自己現名（排除自身）→ `NET_OK`；
3. `NEXON`（禁用精確，非 GM）→ `ERR_RESTORE_NICK_NAME_05`；
4. ENTRY_POINT_CHECK_NICK_NAME_REQ(1161) 新名稱 → `NET_OK`；
5. CHANGE_NICK_NAME_REQ 實際改名 → `NET_OK`；
6. ENTRY_POINT_CHECK_NICK_NAME_REQ 舊暱稱（14 天冷卻）→ `ERR_RESTORE_NICK_NAME_03`；
7. MY_UNIT_AND_INVENTORY_INFO_LIST_REQ → 唯一角色 nickName == L"新名稱"（改名落庫可見）。

意義：暱稱變更鏈（431 含 check-only 語意、1161 ENTRY_POINT 檢查、14 天冷卻狀態機、rename→list 可見）自此有**真實 socket + 真實雙庫**的端到端覆蓋；codec→決策→DB 全鏈連動。既有 unit 測試（tests/test_change_nickname.cpp）僅覆蓋記憶體內決策層。

測試自 1085 → **1128 passed / 0 failed**。無新模組 → vcxproj 無需登記。

## 0z. 2026-11-17 快照（SERV_ENTRY_POINT 家族迴路整合測試）

**新增** `tests/test_entry_point_flow.cpp`（`RunEntryPointFlowTestsByRef`）：真實 mkstemp account/game 雙庫 + TCP loopback，**authLevel 一律 0**，一次跑完 SERV_ENTRY_POINT 家族主要事件的端到端閉環：

CONNECT → VERIFY → `EGS_CHARACTER_LIST_REQ`(1155，0 角色：slot[0]==50、空 vec、strUserID 回顯) → `EGS_CREATE_NEW_UNIT_REQ`(1159，iClass=5／iServerGroup=1 忽略) → `EGS_CREATE_UNIT_ACK`(37) → CHARACTER_LIST(1155，1 角色，unitUID 一致、level/exp=0/1) → `EGS_ENTRY_POINT_GET_CHANNEL_LIST_REQ`(1166；四張表皆空) → `EGS_GET_CREATE_UNIT_TODAY_COUNT_REQ`(1163；map{0→1}) → `EGS_ENTRY_POINT_DELETE_UNIT_REQ`(1160；回 `EGS_DELETE_UNIT_ACK` 39) → CHARACTER_LIST（0 角色）→ TODAY_COUNT（map{0→0}，`Deleted=0` 過濾驗證）。

意義：SERV_ENTRY_POINT 家族（CHARACTER_LIST／CREATE_NEW_UNIT／ENTRY_POINT_DELETE_UNIT／GET_CHANNEL_LIST／TODAY_COUNT）此前僅有 codec 自洽與記憶體內決策層單元測試；本測試首次以真實 socket + 真實雙庫驗證全家族的 wire→決策→DB 閉環。

⚠ 附帶記錄（已由 §0a7 取代）：`ScriptData/UnitTemplet.mdb`（SELECT_UNIT/CREATE_UNIT 的 templet 來源）當時嘗試以 PyPI `access-parser` 解析——能開檔列出 Units/UnitClass/UnitType/WeaponType 四表，但 Jet4 variable-length record 解析失敗；純 Python 無法讀此檔、mdbtools C 函式庫不在可達網路。**後續徹查（§0a7）證實此檔為樣板期資料且缺 UnitTemplet.lua，templet 存在性閘門已以 enum 模型移植；名稱/IsFirstChangeJob 仍未建模。**

測試自 1128 → **1181 passed / 0 failed**。無新模組 → vcxproj 無需登記。

## 0a1. 2026-11-17 附記（StringFilter 測試地區感知）

tests/test_string_filter.cpp 的字元集閘門斷言改為依 `X2_REGION_*` 分支（JP 預設／TW-HK-CN／其他寬鬆），並補上 `#include "../src/core/Region.h"`（未定義時預設 JP 的巨集由 Region.h 設定）。**JP（預設）與 `REGION=TW` 兩種建置皆 1181 passed / 0 failed**；TW 建置以既有 `REGION=TW ./tools/build_and_test.sh` 驗證（StringFilter 行為 TW 語意亦綠）。

## 0a2. 2026-11-17 附記（SELECT_UNIT 1_NOT 線路級驗證 + 生成物防漂移）

- tests/test_select_unit.cpp 的 SELECT_UNIT loopback：在 1_NOT 接收處新增 **wire 級**斷言——`level`（由 gunit.Exp 換算）、`stat == gunit(0) + StatTable(class 2, level 1)`、`now/nextBaseLevelEXP`（EXP 表）。§0u/§0v 的接線自此不僅有單元測試，也有實際線路覆蓋。
- 新增 tools/verify_generated.sh：重跑 `gen_exp_table.py`／`gen_stat_table.py`／`gen_string_filter.py` 並 `cmp` 比對三個 .inc（防漂移；需 python3 + xlrd）。**實測三個 .inc 與產生器輸出一致。**
- 地區建置矩陣：`JP`（預設）= 1185、`REGION=TW` = 1185、`REGION=EU` = 1183（permissive 分支測項較少）、`REGION=CN` = 1185——**全部 0 failed**（EU permissive 分支首次納入驗證）。
- 註：system-level pip installs（xlrd 等）不跨 turn 保留——verify_generated.sh 使用前需 `pip install --break-system-packages xlrd`。

## 0a3. 2026-11-17 附記（CREATE_UNIT IsInitNormalJob class 閘門）

原碼 `XSLUnit::IsInitNormalJob`（KncWX2Server/Common/X2Data/XSLUnit.cpp）：JP 定義下 SERV_ARA_MARTIAL_ARTIST／SERV_NEW_CHARACTER_EL／SERV_9TH_NEW_CHARACTER 全開 → 初始普通職業 = **1..9**（ELSWORD_SWORDMAN … ADD_NASOD_RULER；UNIT_CLASS enum 見 XSLUnit.h；2nd class 自 100 起）。`SERV_CHECK_CREATE_UNIT_CLASS`（ServerDefine.h:3911）已定義 → 原碼 JP 路徑對 CREATE_UNIT 強制此閘門；失敗 → `ERR_CREATE_UNIT_11`。`GSUserGameCommon.cpp` 的呼叫包裹於 `#ifdef SERV_CHECK_CREATE_UNIT_CLASS`。

- **NetError_def.h 機讀 enum 計數實測**：ERR_CREATE_UNIT_10=**687**、ERR_CREATE_UNIT_11=**1289**（先前 1294 為 enum 位序反推、錯誤；docs §0u 原已正確記錄 1289）。`src/core/NetError.h` 已納入 `ERR_CREATE_UNIT_11 = 1289`。
- **新模組** `src/server/UnitTemplet.{h,cpp}`（namespace `x2::unit_templet`）：僅移植 `IsInitNormalJob(iClass)` 謂詞（1..9 → true）。
- **UnitSelectArbiter.cpp**：HandleCreateUnitReq 於長度檢查**之前**插入閘門：`!x2::unit_templet::IsInitNormalJob(req.iClass)` → ack.iOK = ERR_CREATE_UNIT_11、err.clear()、return true。ENTRY_POINT_CREATE_NEW_UNIT 共用閘門同步生效。
- **已知偏差（誠實聲明，已由 §0a7 收斂）**：templet 存在性當時未建模——iClass=200 等一律以 1289 拒絕，原碼為 28。**§0a7 已移植 templet 存在性閘門（enum 模型，55 個 iClass）；不存在 → 28、存在但非初始普通職業 → 1289，與原碼呼叫順序一致。** 剩餘：templet 名稱／IsFirstChangeJob 未建模（資料源 UnitTemplet.lua 未隨倉庫提供）。
- **測試**：`tests/test_unit_templet.cpp`（RunUnitTempletTestsByRef）：IsInitNormalJob 邊界、HandleCreateUnitReq 合法 1/5/7/8/9 → NET_OK、ENTRY_POINT_CREATE_NEW_UNIT 共用閘門；§0a7 已改為兩階段閘門接線與期望值（見下）。
- 測試自 1185 → **JP/TW/CN = 1232、EU = 1230 passed / 0 failed**（EU permissive 分支較少）。

## 0a4. 2026-11-17 附記（CREATE_UNIT / CHANGE_NICK_NAME IsExistPvpNpcName 閘門（PvP NPC 保留暱稱））

原碼 `KPvpMatchManager::IsExistPvpNpcName`（Common/PvpMatch/PvpMatchManager.cpp:496）：exact-match 比對 `m_vecPvpNpcName`（無大小寫摺疊），名單由啟動時 Lua `PvpNpcData.lua` 的 `AddPvpNpcName( '名稱' )` 填入；`SERV_PVP_NEW_SYSTEM`（ServerDefine.h:1188）已定義 → 閘門生效。原碼呼叫點共 4 處，全部命中 → `ERR_CREATE_UNIT_01`(26)：`EGS_CREATE_UNIT_REQ`(397)／`EGS_CREATE_NEW_UNIT_REQ`(10681，ENTRY_POINT 變體)／`EGS_CHANGE_NICK_NAME_REQ`(3180)／`EGS_ENTRY_POINT_CHANGE_NICK_NAME_REQ`(11001)。**無 GM 繞過**（與 StringFilter 不同）。

- **新模組** `src/server/PvpNpcNames.{h,cpp}`（namespace `x2::pvp_npc_names`）：`IsExistPvpNpcName(wstrNickName)`；名單常數由 `PvpNpcNames<REGION>.inc` 提供。
- **資料**（`tools/gen_pvp_npc_names.py`，純 stdlib）：解析 `ServerResource/<REGION>/PvpNpcData.lua`（僅匹配行首 `PvpMatchManager:AddPvpNpcName( '…' )`；JP 有 1 行註解 `-- PvpMatchManager:AddPvpNpcName( '0oLucifero0' )` 依 Lua 語意排除）。產出：**JP=390**（6 條完全重複保留）、**TW=497**、**EU=503**、**CN=633**（2 條重複保留）、**US=300**（計 2323）。HK 建置共用 TW 表（ServerResource 無 HK 獨立檔）；TH/ID/BR/PH 無資料 → 空表（永不命中，誠實缺口）；EU nation-flag 子表（PvpNpcData_DE/FR/…，SERV_UNITED_SERVER_EU 路徑）未建模——V2 無 nation flag；US 與原 NF_EN→PvpNpcData_EN.lua 內容一致（300≈301，根目錄 EN 檔比 US 檔多 1 行，V2 採 US 目錄檔）。
- **接線**（對齊原碼各 handler 順序）：CREATE_UNIT／CREATE_NEW_UNIT（HandleCreateUnitReq）：IsInitNormalJob(§0a3) → length(→04) → StringFilter(→08) → **本閘門(→01)** → 注入(→08)；CHANGE_NICK_NAME／ENTRY_POINT_CHANGE_NICK_NAME（HandleChangeNicknameReq）：length(→06) → StringFilter(→05) → 注入(→05) → **本閘門(→01)** → 擁有權(→00)。本閘門無 GM 繞過、bCheckOnly 亦擋（與原碼位置一致）。
- **測試** `tests/test_pvp_npc_names.cpp`：謂詞（地區 fixture，含 case-insensitive 反證：`bendaboss` 不命中／`BenDaBoss` 命中；TW=Ancel——**注意命名 fixture 須先確認不命中 StringFilter**：'Aleron' 命中 ban word 子字串）＋決策層（CREATE_UNIT 命中→26、GM authLevel=9 亦 26、正常名→NET_OK；CHANGE_NICK_NAME 命中→26、bCheckOnly→26、GM→26）。build_and_test.sh 的 REGION 巨集**僅經 -D 傳入**，Region.h 的 JP 預設 fallback 只在 `#include Region.h` 處生效——PvpNpcNames.cpp 與測試檔均須顯式包含之（否則 #if 分支誤走 #else 空表，實測 1256→1238＋7 FAIL 才察覺）。
- **測試數**：**JP = 1256、TW = 1254、EU = 1252、CN = 1254、US = 1253 passed / 0 failed**（US 順帶驗證）。verify_generated.sh 擴充為 8 個 .inc 全數防漂移。

## 0a5. 2026-11-17 附記（CREATE_UNIT gup_create_unit 衛星表副作用）

原 `gup_create_unit`（DataBase/Database2/Database2/Schema Objects/Stored Procedures/dbo.gup_create_unit.proc.sql）除 gunit/gunit_nickname 外還會：`GQuests`（QuestID=13「로우의 호출」、SubQuest0=1，所有職業）、`GSkill`/`GSkillSlot`（**僅 class 1..4**：1→10000／2→20030／3→30000／4→40010，Slot01=SkillID、Slot02/03=0——class 5..9 在原 proc 中無技能列，忠實照抄）、`GSpirit`（Spirit ← `GResurrectionStoneCnt.StartSpirit`，Flag 由 DF_GSpirit_Flag 預設 0）、`GDenyOption`（QuestionNo 1..4、CodeNo=1）。任一 insert 失敗 → 整體 ROLLBACK（原 iOK=-14..-21 → V2 映射為 DbError → ERR_CREATE_UNIT_02=27）。

- **Schema v2 migration**（`kGameSchemaVersion` 1→2）：新增 `gdenyoption`（PK(UnitUID,QuestionNo)）、`gquests`（PK(UnitUID,QuestID)）、`gskill`（PK(UnitUID,SkillID)）、`gskillslot`（PK(UnitUID)）、`gspirit`（PK(UnitUID)、Flag DEFAULT 0）、`gresurrectionstonecnt`（StartCnt/SupplyCnt/StartSpirit，單列全域設定）。v1 建表不動；既有 v1 庫升級僅跑新表。
- **GameStore::CreateUnit 改動**：`gunit_nickname` INSERT 後、COMMIT 前，呼叫 `InsertCreateUnitSideEffects`（gquests→gskill/gskillslot（class 1..4 才有）→gspirit→gdenyoption）；任一步失敗 → ROLLBACK 回 DbError。
- **⚠ StartSpirit 起始值**：原 production DB 的 `GResurrectionStoneCnt` 有列（值不在倉庫）；原 stored proc 空表時 `@iStartSpirit` 保持 NULL → Spirit NULL → -21 → 建角整體失敗。**V2 以 0 續建**（誠實偏差；倉庫無 seed 資料，無法重現任何原值）。測試以 `INSERT INTO gresurrectionstonecnt … (StartSpirit=100)` 覆蓋「有列」路徑；「空表」路徑斷言 Spirit=0。
- **測試** `tests/test_create_unit_satellite.cpp`（41 項）：class 1..4 SkillID 對應／class 5 無 gskill・gskillslot（忠實）／GQuests 所有職業 QuestID=13・SubQuest0=1／GDenyOption 4 列 CodeNo=1／GSpirit（空表→0、Flag=0；有列→100）／**副作用失敗 → 整體 ROLLBACK**（`DROP TABLE gskillslot` 後 create → ack=ERR_CREATE_UNIT_02、gunit/gunit_nickname/gquests 皆 0 列）。
- **測試數**：**JP = 1297、TW = 1295、EU = 1293、CN = 1295 passed / 0 failed**。
- 剩餘未移植：gmo_*_skill（技能 slot 更新）／gup_get_community_opt_unituid（社群選項查詢——V2 改以 gdenyoption 直接讀回近似，§0a9；relationship 6 欄寫入 EGS_UPDATE_COMMUNITY_OPT 已於 §0a10 以 write-through upsert 移植；P_GDenyOption_UPD 仍缺 proc）／class 5..9 技能列（原 proc 不存在）／LogDB；gspirit 的 Flag 完整語意與復活石補充/精力重置已於 §0a8 移植；Flag 並列槽位 UI 亦未建模。

## 0a28. 2026-11-16 可行性稽核（EGS_INIT_SKILL_TREE_REQ/ACK：技能樹初始化／重置）

本輪先對照原 GS handler、技能樹 helper、DB worker 協議與 V2 schema/API；**尚未實作協議或資料庫寫入**。結論：V2 已有足以承載部分交易的技能／背包資料表，但缺少兩項會直接決定重置結果的權威遊戲資料，因此不能安全地以猜測值完成「技能樹初始化」。重置會消耗道具並刪除作用頁技能列，錯誤預設技能或 SP 會造成不可逆資料損失；本切片暫停在可行性稽核，不將技能頁切換（§0a27）視為技能樹初始化。

**原版行為查核**：

- `GameServer/GSUserGameCommon.cpp` `EGS_INIT_SKILL_TREE_REQ/ACK`：Inventory Lock → 作用頁須與 server active page 一致（PAGE_01）→ item UID 必須存在且 item ID 必須在白名單（否則 ITEM_04）→ `GetUnitClassDefaultSkill` 取本職業 2/4/6 個預設技能（失敗 SKILL_12）→ `GetCalcInitSkillPoint(level)` 累加 Lua `CalcLevelUpIncreaseSkillPoint` 的 2..level 各級點數（失敗 SKILL_20）→ CSP 未過期時重設為 MaxCSP；過期時若任一頁仍有 CSP 則 SKILL_12 → DB request。
- DB worker 使用倉庫未提供的 `P_GSkill_New_UPD_Reset` 或 `P_GSkill_New_All_DEL_20131212`（依 SERV_ALL_RENEWAL_SP）；DB 成功後 GS 消耗道具、清空作用頁技能、加回最多六個預設技能，設定該頁 SP/CSP，並回 ACK／日誌。DB 內部 ACK 還攜帶六個 default skill ID 與 before SP/CSP；對 client 的 wire 則是 `iOK`、（技能頁制）active page、SPoint、CSPoint、inventory-slot-info vector（`ClientPacket.h:4421`、`ClientPacket.cpp:6350–6387`）。REQ 為 item UID、（技能頁制）active page。
- 此倉庫 `XSLItem.h` 可確認基本道具 `203800`、事件道具 `130633/135416/135417/160946`、JP `65000430`、以及條件編譯的 `60001727/67006454`；實際白名單會受地區 `SERV_*` 巨集影響。V2 `GetInventoryItems` 已可取得 item ID、分類、槽位、quantity/endurance、到期資料，可支持道具存在／數量型消耗的基本判定。

**V2 能力與阻塞**：

- 已有 schema v15 `gskill(UnitUID,SkillID,SkillPageNumber,SkillLevel,SkillCSPoint)`、技能槽頁表、`gunit.SPoint`、unit-global `gskillcash(CSPoint,MaxCSPoint,EndDate)`，以及背包表與 `GetInventoryItems`；基本上可用單一 SQLite transaction 實作「扣道具、刪作用頁 gskill、插入預設技能、更新 SP/CSP」。DB transaction 本身不是阻塞項。
- **阻塞 A：等級→總 SP 曲線**。原 `XSLSkillTree.cpp:GetCalcInitSkillPoint` 是 `sum(CalcLevelUpIncreaseSkillPoint(level), level=2..characterLevel)`；函式實作只存在缺失/加密的 Lua 資料，倉庫無可信表格或公式。把 V2 現有 `gunit.SPoint` 當初始化總額會把「目前可用點數」誤當「角色應有總點數」，不等價且會讓重置後點數錯誤。
- **阻塞 B：完整 class→預設技能清單**。原 `m_mapDefaultSkill` 來自缺失的技能樹資料；倉庫可追到初始建角時少數 class 的技能 seed，但不能代表各職業（含轉職）的 2/4/6 清單。V2 ResetSkill 既有 `{10000,20030,30000,40010}` 僅是 class 1..4 的近似，不能挪用為全職業初始化清單。
- **額外相容缺口（可在取得資料後明確記錄/處理）**：原 CSP 過期檢查會查各技能頁 CSP；V2 目前 `gskillcash` 是 unit-global 且沒有 per-page pool；原 FIELD_MAP/ROOM 狀態 gate、Inventory Lock 子系統、Lua item whitelist 的地區條件皆未移植；DB stored procedure 原文缺失。wire request/ack、NetError 數值及背包數量型／耐久型消耗，仍需依 ClientPacket codec、原錯誤碼機讀與既有 V2 API 落實。

**決定／下一步**：使用者選擇暫緩初始化切片並先做其他有資料支撐的功能；不新增會猜測 SP 或職業預設技能的可寫 handler。若日後重啟此切片，需取得可核對的 `CalcLevelUpIncreaseSkillPoint` 等級曲線與完整 class default-skill map（或明確核准有界限的替代規則），再實作協議、原子 DB transaction、錯誤 ACK／道具消耗測試。後續先移植只讀的技能頁擴充 ED 報價查詢（§0a29），再改做資料表可支撐的黑名單刪除（§0a30）。

## 0a29. 2026-11-16 附記（EGS_GET_NEXT_SKILL_PAGE_ED_REQ/ACK：查詢下一技能頁 ED 費用）

依使用者選擇，暫緩需要缺失技能曲線／預設技能表的技能樹初始化（§0a28），改移植有原始常數與 schema 支援的 read-only 查詢 `EGS_GET_NEXT_SKILL_PAGE_ED_REQ`（1149）→ `EGS_GET_NEXT_SKILL_PAGE_ED_ACK`（1150）。這不是實際購買或擴充頁面；`EGS_EXPAND_SKILL_PAGE_REQ/ACK`（1151/1152）仍未實作。

**原版對照**（`GSUserGameCommon.cpp:10248–10280`）：REQ 無欄位；ACK 沿用 `KEGS_GET_NEXT_BANK_ED_ACK`，wire 為 `iOK, iED`。可擴充頁數為 1 或 2 時回固定費用 `ED_NEEDED_TO_EXPAND_SECOND_SKILL_PAGE=50,000,000`；其他狀態回 `ERR_SKILL_PAGE_02`。`UserSkillTree.h` 的上限為 3。`ERR_SKILL_PAGE_02` 由原 `NetError_def.h` 實編核對為 **1390**（注意頁碼錯誤碼 enum 順序並非按尾數排序）。原 handler 的狀態 gate 允許 FIELD_MAP/ROOM；V2 無 FSM。

**V2 實作**：`src/server/GetNextSkillPageEdProtocol.{h,cpp}` 提供空 REQ codec、`iOK+iED` ACK codec 與 `HandleGetNextSkillPageEdReq`；使用既有 `LoadSkillPageState`。頁數未達 3 → `NET_OK + 50,000,000`；已達 3 → `ERR_SKILL_PAGE_02 + iED=0`；無效 unit UID 或 DB 讀取失敗 → `ERR_ODBC_01 + iED=0`。此操作純查詢、不修改 DB；無新增 schema／migration。因 request 不需資料，handler 只為判斷頁數讀取 DB，V2 無法實作 Field/Room gate。

**測試**：REQ 空 payload、ACK golden bytes／roundtrip、事件 ID、PAGE_02=1390；1/2 頁報價、3 頁錯誤 ACK、非法 UID、缺表造成 DB 讀取錯誤。新增 20 checks；五地區 build/test 全綠：JP **2318**、TW **2316**、EU **2314**、CN **2316**、US **2315 passed / 0 failed**。

## 0a30. 2026-11-16 附記（EGS_DEL_BLACKLIST_USER_REQ/ACK：移除聊天黑名單對象）

依使用者「都可以」的授權，選擇資料表與既有讀回路徑完整支撐、且不依賴缺失技能資料的刪除操作：`EGS_DEL_BLACKLIST_USER_REQ`（363）→ `EGS_DEL_BLACKLIST_USER_ACK`（364）。此切片僅處理**移除**；新增黑名單需 LoginServer 在線使用者查詢及新增上限邏輯，尚未移植。

**原版對照**（`GSUserGameCommon.cpp:2935–2978`）：REQ=`iUnitUID`；ACK 與新增黑名單 ACK 共用 `{iOK, KChatBlackListUnit{iUnitUID,wstrNickName}}`。目標是自己 → `ERR_BLACKLIST_06`；目標不在記憶體黑名單 → `ERR_BLACKLIST_02`；DB worker 執行 `gup_delete_blacklist`／`P_GBlackList_DEL`，成功後 ACK 帶目標 UID／暱稱；DB 回 -1/-2 → BLACKLIST_02/04。原 NetError 機讀：BLACKLIST_02=244、_04=246、_06=248。

**V2 實作**：

- `GameStore::DeleteBlacklistEntry` 在單一 transaction 內讀取目標暱稱並按 `(MyUID,BlockUID)` 刪除；無關係→NotFound，不存在的目標 UID 不會被誤刪；SQL／commit 失敗 rollback。
- `src/server/DeleteBlacklistUserProtocol.{h,cpp}` 實作 REQ/ACK codec 與 handler：自己→248；無關係→244；成功→NET_OK 並帶 UID／UTF-8 轉寬字暱稱；transaction 失敗→246。事件與 NetError 常數加入測試核對。
- **偏差**：V2 沒有 FIELD_MAP/ROOM 狀態閘門，也沒有 `KUserGameOption` 的在線記憶體黑名單鏡像；以持久化 `gblacklist` 為來源。僅移除路徑，不提供新增流程；wire golden 對照使用 V2 serializer，自洽但未對原 SDK 實機驗證。

**測試**：REQ golden／roundtrip、ACK roundtrip、事件碼與錯誤碼；成功刪除及回傳暱稱、自我刪除、缺少關係、trigger 注入失敗並驗證 rollback。19 checks。全五地區 build/test 全綠：JP **2337**、TW **2335**、EU **2333**、CN **2335**、US **2334 passed / 0 failed**；generated、NUL 與 VS project XML 驗證通過。

## 0a27. 2026-11-18 附記（EGS_DECIDE_TO_USE_THIS_SKILL_PAGE_REQ/ACK：切換作用技能頁；schema v15 沿用）

承 §0a23（技能頁資料讀回）／§0a26（技能學習與升級）。本切片移植 `EGS_DECIDE_TO_USE_THIS_SKILL_PAGE_REQ`（1153）→ `EGS_DECIDE_TO_USE_THIS_SKILL_PAGE_ACK`（1154）：將某個已擴充頁設為作用頁，並回傳該頁欄位與已學技能資料。

**原版對照**：

- `GSUserGameCommon.cpp:10436+`：僅 S_FIELD_MAP 可切頁；頁碼 `<1` 或 `> GetTheNumberOfSkillPagesAvailable()` → ERR_SKILL_PAGE_03；否則送 DBE_DECIDE_TO_USE_THIS_SKILL_PAGE_REQ。
- `GSGameDBThread.cpp:25285+`：SERV_ALL_RENEWAL_SP（僅 IN）走 `P_GSkill_Expand_UPD_Active`，其他區走 `P_GSkill_Expand_UPD`；回傳 -1（未擴充過）→ ERR_SKILL_PAGE_06，-2（更新失敗）→ ERR_SKILL_PAGE_07；成功 ACK 帶 requested page。
- DB ACK handler 驗證頁碼一次（超範圍仍 PAGE_03），設 in-memory ActivePage，再回 ACK=`iOK, requestedPage, GetSPoint(), GetCSPoint(), KUserSkillPageData`。REQ 單 int；ACK 順序如上（`ClientPacket.h:10908`、`ClientPacket.cpp:14929–14961`）。錯誤碼原版機讀（原 NetError_def.h）：PAGE_03=1388、PAGE_06=1391、PAGE_07=1392。原 state gate 是 S_FIELD_MAP（村莊／休息處），重複包 ACK gate 同。

**V2 實作**：

- `src/server/DecideSkillPageProtocol.{h,cpp}`：REQ/ACK codec、`HandleDecideSkillPageReq`；以已存在的 `LoadSkillPageState` 取得可用頁與作用頁資料，頁碼驗證後呼叫 `GameStore::SetActiveSkillPage`，成功 transaction 提交後回傳該頁 `UserSkillPageData`。
- `SetActiveSkillPage` 單一 transaction：查 `gskillexpand`；列不存在→NeverExpanded（PAGE_06），頁碼大於 PageCount→InvalidPage（PAGE_03），否則 UPDATE ActivePage（命中非 1 或 SQL/commit 失敗→PAGE_07），失敗 rollback。與 §0a26 v15 composite key 可跨頁保存技能資料相容。
- **無新增 migration**：v15 `gskillexpand(PageCount,ActivePage)`、`gskill`、`gskillslotnew/gskillslot2new` 已足夠；原 update proc 不在倉庫，以 GSGameDBThread 回傳碼分支反推。
- **偏差**：(1) V2 無 FSM/村莊狀態，無法執行原 S_FIELD_MAP gate；(2) 原 ACK SPoint/CSP 與每頁池相關，V2 無 page-local pool，`iSPointAvailable` 使用 `gunit.SPoint`、`iCSPointAvailable` 使用 unit-global `gskillcash.CSPoint`；`KUserSkillPageData.usSkillPoint/usCashSkillPoint` 沿用 §0a23 的 0 佔位；(3) 技能欄位對應等級若 gskill row 缺失回 0，無 SkillTemplet 無法重建原技能等級規則；(4) 切頁 ACK 不包含 unit-wide 通知；(5) wire golden bytes 自洽，未對原 SDK 實機驗證。
- **測試**：codec golden/roundtrip、1153/1154、三個錯誤碼、成功切換持久化與目標頁 payload、越界／未擴充／更新 trigger 故障及頁碼未變。五地區 `tools/build_and_test.sh` 全綠：JP **2298**、TW **2296**、EU **2294**、CN **2296**、US **2295 passed / 0 failed**；本 slice 新增 20 checks。

**狀態**：驗收完成；五地區 build/test 全綠，`verify_generated` OK，NUL clean。

## 0a26. 2026-11-18 附記（EGS_GET_SKILL_REQ/ACK：技能學習／升級寫路徑；schema v15）

承 §0a23（技能頁讀回）／§0a24（技能欄位變更）／§0a25（技能重置）。本切片實作技能學習與升級：`EGS_GET_SKILL_REQ`（294）→ `EGS_GET_SKILL_ACK`（295）。原版為 GS handler 先扣內存 SP/CSP、再非同步送 DB worker 寫技能；V2 無 DB worker／角色內存技能樹，以讀庫驗證→單一 transaction→ACK 一跳 write-through。

**原版（SERV_UPGRADE_SKILL_SYSTEM_2013、SERV_SKILL_PAGE_SYSTEM）**：

- **REQ／ACK**（`Common/ClientPacket.h:2508/2526`；`Common/CommonPacket.h:9648`）：REQ=`[JP only: vector<int> m_vecNowLearnSkill] + int m_iActiveSkillPageNumber + map<int,KGetSkillInfo>`；KGetSkillInfo=`m_iSkillID, m_iBeforeSkillLevel, m_iSkillLevel, m_iSpendSkillCSPoint` 四個 int；ACK=`m_iOK + m_iActiveSkillPageNumber + map<int,KGetSkillInfo> + m_iRemainSP + m_iRemainCSP`。wire 順序即 PUT 順序（`ClientPacket.cpp:3610–3710`）。事件 294/295。
- **驗證順序**（`GameServer/GSUserGameCommon.cpp:4337–4567`）：頁碼不符→ERR_SKILL_PAGE_01；map 空→ERR_SKILL_09；`CheckGetNewSkill`（`UserSkillTree.cpp:2559–2721`：技能 templet/tree 存在、未達 max、角色等級、born-sealed 解封、class、前置技能、tier 同階排斥）；CSP 過期且 SP≤0→ERR_SKILL_17，未過期且 SP+CSP≤0→ERR_SKILL_18；`GetNecessarySkillPoint`（:1673–1803）：已學技能 cost=`RequireUpgrade×(target−current)`，未學 cost=`RequireLearn + RequireUpgrade×(target−1)`，target 小於 current／小於 1 → false；若 CSP 未過期，總 CSP=`min(totalCost, CSP)`、總 SP=`totalCost−totalCSP`，否則全額 SP；資源不足→ERR_SKILL_18；過期且 totalCSP>0→ERR_SKILL_24（一般不可達）。逐技能 `m_iSpendSkillCSPoint`：未過期時先寫該技能**全額 cost**，隨後再加既有 `SkillCSPoint`；過期時不覆寫 REQ 欄位，仍加既有值。`SubtractSPoint`／`SetCSPoint` 後送 DB。
- **DB 兩跳**（`GSGameDBThread.cpp:11040+`）：`m_iCSPoint >= 0` 才更新現金池；逐技能呼叫 `P_GSkill_New_UPD`（僅 IN 使用 SERV_ALL_RENEWAL_SP 時改 MER）；存 `(UnitUID, SkillID=value.m_iSkillID, SkillLevel, SkillCSPoint, SkillPageNumber)`。DB 失敗回 ACK，GS 恢復 SP/CSP；成功後 `CheckAndUpdateSkillLevelAndCSPOnUsedPage` 更新內存並在特定 Room 類型廣播 `ERM_CHANGE_SKILL_INFO_IN_ROOM_NOT`。
- **NetError 實編核對**（原 `Common/Neterror/NetError_def.h`，g++ -fpermissive；JP/TW/EU/CN/US/Global enum 值一致）：ERR_SKILL_00=182、_01=183、_03=184、_07=188、_09=190、_10=191、_13=193、_14=194、_15=195、_16=196、_17=197、_18=198、_19=199、_20=200、_21=201、_24=204、_29=1278、ERR_SKILL_PAGE_01=1387、PAGE_04=1386、ERR_ODBC_01=555。曾在 V2 `NetError.h`／`test_change_skill_slot.cpp` 誤記 ERR_SKILL_09/10/13/14=164/165/167/168（手工計數）；本切片以實編機讀修正為 190/191/193/194。

**V2 實作**：

- **wire／決策** `src/server/GetSkillProtocol.{h,cpp}`：REQ／ACK、KGetSkillInfo 四 int、map count-prefix serializer；只在 `X2_REGION_JP` REQ 帶 `vecNowLearnSkill`（其他五建置地區不帶）。成功 ACK 回傳完整 map，更新每列 `iSpendSkillCSPoint`；`iRemainSP/CSP` 為 transaction 後讀回值。
- **成本與限制**：原 SkillTemplet/SkillTreeTemplet/NewSkillTempletVer2.lua 與 `CalcLevelUpIncreaseSkillPoint` Lua 不在明碼倉庫（工具目錄的 Lua 多為加密 blob）；V2 僅能推定 Learn=1／Upgrade=1，且不能校驗技能存在、職業、角色等級、解封、max level、前置技能／tier 規則。正整數未知 SkillID 因此仍可能被寫入；需在取得可信技能表後補存在性/前置規則。SP 檢查以 `gunit.SPoint` unit-global 持久值代替原技能頁內存 SP；CSP 過期定義沿用 `MaxCSPoint==0`。
- **交易** `GameStore::CommitGetSkill`：同一 transaction 逐列 upsert `gskill`、`gunit.SPoint -= totalSP`、upsert `gskillcash.CSPoint`；任何階段失敗整筆 rollback。ERR 映射：技能列／SP／COMMIT → ERR_SKILL_00=182；現金池 → ERR_SKILL_24=204。此為原 DB worker 路徑的 write-through 對位，無中間內存扣點／補償。
- **schema v15（§0a26）**：v14 的 `gskill` PK 為 `(UnitUID,SkillID)`，不能表示同技能在多個 SkillPageNumber 各自學習；新增 migration v15 重建表為 PK `(UnitUID,SkillID,SkillPageNumber)`、搬移可 JOIN 到 gunit 的舊列且欄位值不變（孤兒 gskill 列被濾除以維持 FK 完整性）。**此 schema v15 必要變更**；v14 已有 SkillLevel/SkillCSPoint/SkillPageNumber，無需再加欄位。
- **驗證／測試**：`tests/test_get_skill.cpp` codec golden bytes（含 JP-only vector）、事件／NetError 機讀值、學習／升級扣點、過期 CSP 欄位行為、跨頁同技能、失敗 ACK 與 transaction rollback。全五地區 `tools/build_and_test.sh` 全綠：JP **2278**、TW **2276**、EU **2274**、CN **2276**、US **2275 passed / 0 failed**（各含 get_skill 49 checks、reset_skill 129 checks）；`bash tools/verify_generated.sh` OK（xlrd 2.0.2）；原始碼 NUL scan clean。

**偏差聲明**（完整條目另列於 `GetSkillProtocol.h` 檔頭）：(1) 無 Field/Room 狀態閘門、NOT 廣播與統計/角色日誌；(2) 技能 Lua/templet 缺失，以 ID>0 放行，正數未知技能亦可能寫入；(3) class/level/max/seal/prerequisite/tier 驗證暫缺；(4) active page 始終有效，PAGE_04 不可達；(5) 費用 1/1 推定；(6) unit-global SPoint 代替 page-local；(7) 忠實保留原奇特的 per-skill full-cost CSP 記錄（總 CSP/SP 則共用池切分）與 expired 時信任 REQ spend 欄位；(8) `SERV_ALL_RENEWAL_SP` 僅 IN 定義，JP/TW/EU/CN/US 均走非 RENEWAL_SP 對位；(9) CSP=0 原 `-1` 不寫回通道未保留，V2 一律寫 gskillcash；(10) 預驗證錯誤 ACK 全零、transaction 失敗 ACK 回顯頁碼且餘額為零（原 DB ACK 的 `GetLastError()` 值不定）；(11) JP 子任務 vector 收線不處理；(12) SP 直接 transaction 持久化（原靠週期 gup_update_unit_info）；(13) 對 `map key != value.m_iSkillID` 加 V2 完整性閘門（原驗證查 key、DB 寫 value，V2 mismatch 回 ERR_SKILL_01）；expired pool 的 REQ `m_iSpendSkillCSPoint` 只接受非負 int32，溢位/負值回 ERR_SKILL_17；(14) wire golden bytes 自洽、未對原 SDK 實機驗證。

**狀態**：實作與驗收完成；五地區 build/test 全綠，`verify_generated` OK，NUL clean。

## 0a25. 2026-11-18 附記（EGS_RESET_SKILL_REQ/ACK：技能重置道具消耗；實作時 schema v14，現由 v15 延伸）

承 §0a23（技能頁讀回）／§0a24（欄位變更）。本期實作**技能重置**——消耗「技能重置道具」退還 SP／技能點並重置技能等級：`EGS_RESET_SKILL_REQ`（305）→ `EGS_RESET_SKILL_ACK`（306）。原版對應 `DBE_RESET_SKILL_REQ`（DB worker）→ `DBE_RESET_SKILL_ACK`（GSGameDBThread 派發）路徑；V2 無 DB worker → 驗證→單一 transaction→ACK 一跳完成（write-through，§0a24 慣例）。

**原版（SERV_SKILL_PAGE_SYSTEM／SERV_UPGRADE_SKILL_SYSTEM_2013 皆已定義）**：

- **Handler**（`GameServer/GSUserGameCommon.cpp`：EGS_RESET_SKILL_REQ@4642–4887；DBE_RESET_SKILL_ACK@4900–5040）：VERIFY_STATE（S_FIELD_MAP/S_ROOM）→ `KUserSkillTree::CheckResetSkill`（UserSkillTree.cpp:2723）→ `ResetSkill`（:1868）→ 組 ACK；裝備中完全重置 → ERR_RESET_SKILL_05（449）；CSP 退還溢出 maxCSPoint 時溢出部分加回 SP（:1133 GetSkillLevelAndCSP / :564 IsCashSkillPointExpired ≡ `m_iMaxCSPoint == 0`）。
- **DB 路徑**（`GSGameDBThread.cpp:14731` DBE_RESET_SKILL_REQ）：`Query_UpdateItemQuantity`@4681（gup_update_item PT_QUANTITY delta=-1）→ 數量歸零 `Query_DeleteItem`@4991（gitem 軟刪除）→ `P_GSkill_Cash_UPD_PointInfo`（gskillcash 寫回）→ `P_GSkill_New_MER`（技能列寫回）→ DBE_RESET_SKILL_ACK。
- **REQ/ACK 結構**（`Common/ClientPacket.h:4827/4839`）：REQ{ m_iSkillID:int, m_iActiveSkillPageNumber:int }；ACK{ m_iOK, m_iActiveSkillPageNumber, m_iDelSkillID, m_iSPoint, m_iCSPoint, std::vector<KInventoryItemInfo> m_vecInventorySlotInfo }；wire PUT 序 ClientPacket.cpp:7012–7070（ACK=iOK, iActiveSkillPageNumber, iDelSkillID, iSPoint, iCSPoint, vec）。事件 ID：REQ=305／ACK=306（V2 EventIDs.h 已有）。
- **NetError**（五地區值一致；2026-11-18 以 g++ 實編原 `Common/Neterror/NetError_def*.h` 核對；`Common/Neterror/NetError_def.h` 為正典，`Common/NetError_def.h` 較舊且缺 ERR_SKILL_PAGE_01、無 `_EU.h`）：ERR_SKILL_20=200、ERR_SKILL_24=204、ERR_SKILL_PAGE_01=1387、ERR_RESET_SKILL_00=444、_01=445、_02=446、_03=447、_04=448、_05=449、ERR_ODBC_01=555、ERR_INVENTORY_LOCK_00=1030。V2 已加入（ERR_RESET_SKILL_04=448 已登錄但本切片不產生）。
- **重置道具**（ResetSkillItem@Inventory.cpp:15049）：IN_INVENTORY 分類 ST_*(1–7)、數量型（UsageType=2）、數量 ≥1；JP 生效優先序：60008069（UNLIMITED，僅 JP/TWHK 定義）→ 160947（EVENT_ITEM2）→ 130808（EVENT_ITEM）→ 67003592（EI_SKILL_RESET_EVENT_ITEM2）→ 200730（CI_SKILL_RESET_ITEM，恆定義）；最少堆疊優先（原 PT_QUANTITY 升序＋map ItemUID 序）。

**V2 實作**：

- **協議** `src/server/ResetSkillProtocol.{h,cpp}`（x2::reset_skill）：REQ/ACK codec（int32 BE ×2 / ×5＋count-prefix vector<InventoryItemInfo>）；golden bytes；`HandleResetSkillReq(gameDb, unitUID, req, ack, err, nowUtc)`。
- **演算法**（檔頭 [0]–[12] 逐步對位原 handler；SERV_SKILL_PAGE_SYSTEM 分支）：[1] 作用頁一致性 → ERR_SKILL_PAGE_01；[2][3] templet 檢查（V2 無資料 → skillID>0 放行）；[4] 作用頁未學會 → ERR_SKILL_20；[5] GetSkillLevelAndCSP 失敗 → ERR_RESET_SKILL_00（V2 可達性＝僅資料不一致時）；[6] afterDel = 0/1；[7] 裝備中且完全重置 → ERR_RESET_SKILL_05；[8] SP 退還（第 1 級 Learn=1，其餘每級 Upgrade=1，減 invested CSP，可為負）；[9] CSP 退還（未過期(MaxCSPoint>0) → curCSP+invested，超上限溢出加回 SP；過期 → 0）；[10] 重置道具探測（無 → ERR_RESET_SKILL_01）；[11] 單一 transaction 提交；[12] ACK（iSPoint/iCSPoint 提交後讀回；vec=[消耗後道具]；歸零刪除 → itemUID=0 空槽）。
- **GameStore**：新增 `CommitResetSkill(unitUID, itemUID, activePage, delSkillID, skillLevelAfter, sPointDelta, newCSPoint, nowUtc, &out, &failStage, &err)`——單一 transaction：(a) `UPDATE gitemquantity SET Quantity=Quantity-1 WHERE ItemUID=? AND Quantity>=1`（命中≠1 → failStage=Item）；(b) 讀回（仍為 0 → gitem 軟刪除 `DelDate = max(now, datetime(RegDate,'+1 second')) WHERE Deleted=0`）；(c) gskill：levelAfter≤0 → `DELETE … WHERE UnitUID/SkillID/SkillPageNumber`，否則 `UPDATE SkillLevel=?, SkillCSPoint=0`（命中≠1 → failStage=Skill）；(d) `gunit.SPoint = SPoint + ?`（差分，可負）＋讀回絕對值（failStage=SPoint）；(e) gskillcash upsert（`INSERT … ON CONFLICT(UnitUID) DO UPDATE SET CSPoint=excluded.CSPoint`——一律寫入）（failStage=CashPoint）→ COMMIT；任一失敗整體 rollback。呼叫端映射：Item→ERR_RESET_SKILL_02(446)、Skill/SPoint/Commit→ERR_RESET_SKILL_03(447)、CashPoint→ERR_SKILL_24(204)。TOCTOU：探測僅讀，ItemUID 於 transaction 內重驗（Quantity>=1）。
- **測試**：`tests/test_reset_skill.cpp`（19 測試函數 / **129 檢查**）：REQ/ACK golden bytes＋roundtrip＋ctor 預設、事件 id、NetError 實編值、主流程（非預設技能重置 Lv3→刪除列、預設技能重置→保留 Lv1）、SP 退還（Learn+Upgrade−invested CSP，可為負）、CSP 退還/溢出截斷（溢出加回 SP）/過期歸零（MariaDB 現金池未啟用 → invested CSP 消失）、裝備中封鎖（ERR_RESET_SKILL_05）與裝備中預設技能放行、錯頁（ERR_SKILL_PAGE_01）、skillID≤0（ERR_RESET_SKILL_00）/未學會（ERR_SKILL_20）/他頁已學會不算本頁、無重置道具（ERR_RESET_SKILL_01、不落盤）、道具優先序（EVENT2>EVENT>plain）與最少堆疊優先、UNLIMITED 優先壓過全部、歸零軟刪除（gitem.Deleted=1＋ACK itemUID=0 空槽）、兩個故障注入（BEFORE INSERT/UPDATE trigger RAISE(ABORT)）驗證 rollback（ERR_RESET_SKILL_02；ERR_SKILL_24）與 iSPoint/iCSPoint=0、iDelSkillID 回顯、未變更道具槽、SPoint/SP/技能列全部回滾、預設技能 SkillCSPoint 歸零（§12 偏差 9）。
- **測試數**：**JP = 2226、TW = 2224、EU = 2222、CN = 2224、US = 2223 passed / 0 failed**（vs §0a24：各 +129）。`verify_generated` OK（2026-11-18 以 pip 安裝 xlrd 2.0.2 後實機重跑——先前缺 xlrd 僅能跳過此步）；NUL clean；五地區以 `tools/build_and_test.sh REGION=<R>` 為準。Windows vcxproj/.filters 同步加入新檔。
- **Schema**：v14 沿用（無 DDL；gitem 軟刪除慣例（DelDate 生成欄 Deleted）與 gskill/gskillcash 表結構不變）。

**偏差聲明**（V2 vs 原版；全部為推定，非原版保證；完整 15 條逐條列於 `src/server/ResetSkillProtocol.h` 檔頭）：

1. **背包鎖定**（KInventory::IsLocked → ERR_INVENTORY_LOCK_00=1030）：V2 無背包鎖定子系統 → 不檢查。
2. **SkillTemplet**（NewSkillTempletVer2.lua 不在倉庫）→ V2 以 skillID>0 通過 templet 檢查；不存在之錯誤由 [4] 未學會 → ERR_SKILL_20 承接（原同碼）；ERR_RESET_SKILL_00 僅自 [5] 資料不一致可達。
3. **SkillTreeTemplet** 逐職業合法性/費用判定不做（NewSkillTreeTable.xlsm 僅 2011 技能樹，且與 V2 CreateUnit 的 legacy ID 不相交）。
4. **IsAllFollowingSkillLevelZero** ≡ true（無 m_vecFollowingSkill 資料）；副作用：有後續技能時原版重置後保留 Lv1，V2 一律重置到 0（預設技能走 default 分支＝保留 1，見偏差 5）。
5. **IsUnitTypeDefaultSkill**：Lua 來源缺 → V2 推定 CreateUnit 預設技能 {10000=Swordsman、20030=VioletMage、30000=ElvenRanger、40010=Fighter}（class 1–4）；class 5+ 無可考來源 → 非預設技能。
6. **RequireLearnSkillPoint / RequireUpgradeSkillPoint** 缺資料 → V2 定數 1/1（每級 1 SP 推定）。
7. **重置道具優先序** 採 JP 生效集：60008069 → 160947 → 130808 → 67003592 → 200730（SERV_* 地區開關未移植；COBO/QUEST/2ND_CLASS/RURIEL/RESET_A 不列入）；最少堆疊優先以 `ORDER BY Quantity ASC, ItemUID ASC` 近似原 PT_QUANTITY 升序＋map ItemUID 序。
8. **IsCashSkillPointExpired** ≡ `MaxCSPoint == 0`（原 `m_iMaxCSPoint == 0`；EndDate 完全不參與，原同）。
9. **gskillcash 一律寫入**（含 iAfterCSP=0）：原僅 iAfterCSP>0 才 upsert（避免清空過期現金池）；V2 gskillcash 為 unit-global 主表，自洽優先一律寫。連帶：過期池投入的 CSP 一律消失（原同）。
10. **失敗 ACK 形狀**：(A) 提交前失敗＝ACK 全零（iOK 除外）＋空向量（與原「驗證階段失敗無回顯」同形）；(B) 提交中失敗＝rollback 後帶 iActiveSkillPageNumber/iDelSkillID 回顯＋未變更道具槽，iSPoint=iCSPoint=0（原版帶遞減後內存值，與 DB 實際不符）。錯誤碼映射：Item→ERR_RESET_SKILL_02；Skill/SPoint/Commit→ERR_RESET_SKILL_03；CashPoint→ERR_SKILL_24（204；V2 借用 NetError 原「현금스킬포인트를 사용하는 중 에러가 발생하였습니다」語列）。
11. **成功路徑**：原於 DBE_RESET_SKILL_ACK 才 ResetSkill/CheckAndUpdate（內存）後組 ACK；V2 transaction 內直接落盤，ACK 回讀回值（等價且不產生中途可見狀態）。
12. **SERV_ROOM/S_FIELD_MAP VERIFY_STATE** 與成功後 ERM_CHANGE_SKILL_INFO_IN_ROOM_NOT 廣播：V2 無 Room/Field → 不送 NOT。
13. **SPoint unit-global**（§0a23 偏差 8：每頁 SP 池無資料源）；可倒扣為負（原同）。
14. **無 -1 通道**：原 DBE 以 iCSPoint<=0 → DB 傳 -1 跳過現金點更新；V2 一律寫入（偏差 9）。
15. **wire 佈局自洽 golden bytes**，未對原 SDK 實機驗證；vec<KInventoryItemInfo> 逐元素依 §0a17/SelectUnit 讀回口徑（itemUID/slotCategory/slotID/itemInfo；randomSocket 固定空、itemState=0、expandedSocketNum=0）。

**已移植**：EGS_GET_SKILL_REQ（§0a26；技能表資料缺失造成的規則偏差仍待補）、EGS_RESET_SKILL_REQ（§0a25）；EGS_ADMIN_* 屬管理協議，不納入；原 DBE 的 DB worker 兩跳為 V2 無 DB thread 的架構差異。技能頁切換/展開事件另行移植。

## 0a24. 2026-11-18 附記（EGS_CHANGE_SKILL_SLOT_REQ/ACK：技能欄位變更寫路徑；schema v14 沿用）

承 §0a23（技能頁讀回）。本期實作**技能欄位變更**寫路徑——`EGS_CHANGE_SKILL_SLOT_REQ`（296）→ `EGS_CHANGE_SKILL_SLOT_ACK`（297）：把已學會技能裝上/卸下欄位（技能欄位 A/B 共 8 欄）、含原碼的「交換」語意——客戶端只送 (iSlotID, iSkillID)，被擠出的技能由伺服器計算並回報。`EGS_CHANGE_SKILL_SLOT_NOT`（298）不移植（偏差 6/14）。

**原版（SERV_SKILL_PAGE_SYSTEM／SERV_SKILL_SLOT_CHANGE_PACKET_INTEGRATE 皆已定義）**：

- **REQ/ACK 結構**（`Common/ClientPacket.h:2568/2580`）：REQ{ m_iSlotID, m_iSkillID }；ACK{ m_iOK, m_iSlotID, m_iSkillID, m_iSlotID2, m_iSkillID2 }（INTEGRATE 追加後兩欄）。
- **Handler**（`GSUserGameCommon.cpp:2756–2832`）：VERIFY_STATE（S_FIELD_MAP/S_ROOM）→ `KUserSkillTree::ChangeSkillSlot(req, ack)`（`UserSkillTree.cpp:353–470`）→ 失敗即回 ACK（iOK=GetLastError()）、成功回顯＋iSlotID2/iSkillID2；人在 Room（PVP/副本/競技場/練習場）且為 Field 狀態時送 ERM_SET_UNIT_INFO_NOT 廣播。
- **ChangeSkillSlot（整合版）演算法**：iSlotID2 = GetSlotID(iSkillID)（該技能目前欄位，未學會/未裝備 → -1）；iSkillID2 = GetSkillID(iSlotID)。[1] iSlotID 越界 → ERR_SKILL_09（=164）；[2] iSkillID==0 → 清空 iSlotID，否則該技能須在「使用中頁」學會（IsExistOnUsedPage；硬編碼 SI_ETC_WS_COMMON_LOVE=6001 恆學會），否則 ERR_SKILL_10（=165）；且 iSlotID 屬欄位 B（索引 4–7）且 SlotB 已過期（`now > m_tSkillSlotBEndDate`）→ ERR_SKILL_13（=167）；[3] 僅當 0 <= iSlotID2 < 8：iSkillID2 > 0 且未學會 → ERR_SKILL_10；若 iSlotID2 屬欄位 B 且已過期 → ERR_SKILL_13；否則欄位 iSlotID2 寫入 iSkillID2（iSkillID2==0 即清空）；[4] 欄位 iSlotID 寫入 iSkillID。ACK 成功：iOK=NET_OK、iSlotID/iSkillID 回顯、iSlotID2=交換前欄位（未裝備 → -1）、iSkillID2=被擠出的技能（目標欄為空 → 0）。
- **持久化（延遲 flush）**：handler 不碰 DB——成功只改記憶體該頁 `m_aiSkillSlot`；副本結束時 `DBE_UPDATE_UNIT_INFO_REQ → Query_UpdateSkillSlotInfo`（`GSGameDBThread.cpp:5801–5990`；SERV_SKILL_PAGE_SYSTEM 且 SERV_ALL_RENEWAL_SP 未定義 → `P_GSkillSlot_New_INS`／`P_GSkillSlot2_New_INS`；SERV_ALL_RENEWAL_SP 已定義時才用 _MER）逐頁 upsert，B 列帶 unit-global EndDate。
- **事件 ID**（V2 EventIDs.h 已有 296/297/298）；**NetError**（V2 NetError.h 本期新增）：ERR_SKILL_09=164、ERR_SKILL_10=165、ERR_SKILL_13=167、ERR_SKILL_14=168——2026-11-18 以 g++ 直接編譯原 `Common/NetError_def.h` 機讀核對（純連續 enum；ERR_SKILL_27=528 顯式值未納入）。

**V2 實作**：

- **協議** `src/server/ChangeSkillSlotProtocol.{h,cpp}`（x2::change_skill_slot）：REQ/ACK codec（int32 BE ×2 / ×5；REQ/ACK ctor 預設對齊原碼 -1/0、0/-1/0/-1/0）；golden bytes 驗證。
- **`HandleChangeSkillSlotReq(gameDb, unitUID, req, ack, err, nowUtc)`**：`nowUtc` 空 → 執行時刻 UTC；測試注入固定時間。流程：① `LoadSkillPageState`（失敗（含 hostile 錯誤、FK 自癒失敗）→ ERR_SKILL_14＋err）② 取**作用頁** 8 欄位工作副本（slotA/slotB 缺列 → 0；unit-global SlotB EndDate ＝ 最高頁列，沿用 §0a23 讀回語意）③ 學會集＝作用頁 gskill 列（SkillID>0 && SkillLevel>0，LoadSkillPageState 已過濾）∪ {6001} ④ validate-then-commit：iSlotID 越界 → ERR_SKILL_09；iSkillID≠0 且未學會（含負值）→ ERR_SKILL_10；iSlotID 屬 B 且已過期 → ERR_SKILL_13；若 iSlotID2∈[0,8)：iSkillID2>0 未學會 → ERR_SKILL_10、iSlotID2 屬 B 且已過期 → ERR_SKILL_13；否則交換並於**單一 transaction** upsert 作用頁 `gskillslotnew`／`gskillslot2new`（缺列 → INSERT，B 列 EndDate 寫回 unit-global 值＝原 flush 行為）。⑤ ACK 成功回顯；失敗保留 ctor 預設（不回顯）。
- **GameStore**：新增 `UpdateSkillSlots(unitUID, pageNumber, slotA[4], slotB[4], slotBEndDate, err)`——單一 transaction；逐表先 UPDATE 命中驗證、0 命中 → INSERT（對應原 INS＝upsert）；失敗整體 rollback → false。
- **測試**：`tests/test_change_skill_slot.cpp`（REQ/ACK golden bytes ×2、ctor 預設值、事件 id、NetError 實編值、基本流程（移動/交換/自身交換/卸下/越界/未學會/欄位 B 過期與未過期、unit-global EndDate 寫回斷言、作用頁限定、iSlotID2 過期路徑不落盤、未裝備請求技能不驗證 iSkillID2 之原碼語意、6001 硬編碼、跨頁技能、不存在 unit → ERR_SKILL_14、now == EndDate 不算過期（嚴格 >））。
- **測試數**：**JP = 2097、TW = 2095、EU = 2093、CN = 2095、US = 2094 passed / 0 failed**（vs §0a23：各 +80）。`verify_generated` OK；NUL clean；五地區以 `tools/build_and_test.sh` 為準。Windows vcxproj 同步加入新檔（tests 不列入）。

**偏差聲明**（V2 vs 原版；全部為推定，非原版保證）：

1. **write-through**：原版只改記憶體、延遲到副本結束 flush（Query_UpdateSkillSlotInfo，INS 路徑）；V2 無 session UnitInfo、無副本結束路徑 → 驗證通過後立即單一 transaction 寫回作用頁兩列（與 §0a10/§0a20 慣例一致）。
2. **validate-then-commit**：原版為 in-memory 漸進修改，失敗時部分欄位可能已變更——特別是 iSkillID2==0 且 iSlotID2 屬欄位 B 且已過期時，原碼會**先把欄位 iSlotID2 寫成字面值 2**（`SetSkillIDToSlotUsedPage( iSlotID2, 2 )`，顯然的原碼缺陷，成功路徑隨即被覆寫為 0）。V2 不重現：失敗 → 不寫任何欄位；iSkillID==0 的卸下語意（原碼先行清空）在 V2 同為 commit 階段一次寫入。
3. **iSkillID 負值**：原碼對負值 iSkillID 放行（`iSkillID > 0` 檢查不攔），會把負 ID 寫進欄位；V2 視為未學會 → ERR_SKILL_10。
4. **SlotB 過期判斷**：沿用原 write 路徑的嚴格 `>`（與 `GetSkillSlotBExpirationState` 的 `>=` 不一致——照抄 write 路徑）；`m_tSkillSlotBEndDate` 為 unit-global 值（V2 = gskillslot2new 最高頁列 EndDate，缺列/不可解析 → 哨兵 → 過期；即建角未購買 SlotB 的角色恆不可用 B 欄，語意與原版一致）；**不**使用作用頁自身 EndDate（原 KUserSkillTree 亦然）。EndDate 以 UTC 字典序比較（同 EquipTitleProtocol 慣例）。
5. **SI_ETC_WS_COMMON_LOVE=6001**：原碼硬編碼的恆學會技能（UserSkillTree.cpp:1222），V2 同值硬編碼；其餘「學會」= 作用頁 gskill 列（SkillID>0 && SkillLevel>0，與 LoadSkillPageState 過濾一致）。
6. **VERIFY_STATE／冷卻／NOT**：V2 無 FSM、無 session timer、無 Room/Field 子系統 → VERIFY_STATE（S_FIELD_MAP/S_ROOM）不移植；SERV_SKILL_CHANGE_COOL_TIME_AT_START_COUNT（3 秒冷卻）不移植；EGS_CHANGE_SKILL_SLOT_NOT 與 ERM_SET_UNIT_INFO_NOT 廣播不產生。
7. **DB 失敗**：原版無對應路徑（純 in-memory）；V2 映射 ERR_SKILL_14（原「스킬 슬롯 B 확장 중 DB오류가 발생하였습니다」——V2 借用為「技能欄位寫入 DB 失敗」語列，含 LoadSkillPageState 失敗、UpdateSkillSlots 失敗、作用頁自癒 INSERT 撞 FK 等）。
8. **ACK 失敗路徑**：保留 ctor 預設（iSlotID=-1、iSkillID=0、iSlotID2=-1、iSkillID2=0），不回顯輸入值（原碼同）。
9. **iSkillID2 的驗證範圍**：僅當 iSlotID2∈[0,8)（請求技能已裝備於某欄位）時才驗證被擠出的 iSkillID2（須學會）——與原碼一致；請求技能未裝備時，被擠出的未學會技能**不**觸發 ERR_SKILL_10、直接覆寫（測試明示此原碼語意）。
10. **UpdateSkillSlots 語意**：B 列 EndDate 一律寫回 unit-global 值（覆寫作用頁自身 EndDate）——對齊原 flush「整張 map 帶 m_wstrSkillSlotBEndDate 重寫」行為；缺列 → INSERT（upsert）；不對欄位值做 int16 範圍拒絕（DB 為 64-bit INTEGER，wire short clamp 僅在 Not1 組裝層處理；否則 legacy 髒資料會永久卡死寫入）。
11. **交換目標**：iSlotID2 = **第一個**（欄位索引最小）裝備該技能的欄位（GetSlotID 語意）；同一技能可裝備多欄（原版允許）。
12. 線路佈局為自洽 golden bytes（BE、tagging=false），未對原 SDK 實機驗證。
13. 本期修復/補齊：NetError ERR_SKILL_09/10/13/14 常數（2026-11-18 實編原 NetError_def.h 核對）；`Database::Changes()`（sqlite3_changes64）已於 §0a21 存在，本期沿用。
14. 已移植：EGS_GET_SKILL_REQ（§0a26；技能表資料缺失導致的技能規則偏差仍待補）、EGS_RESET_SKILL_REQ（§0a25）；EGS_ADMIN_* 屬管理協議，不納入。技能欄位變更／學習的 Room 廣播與副本延遲 flush 為 V2 無 Room/副本之架構差異。

## 0a23. 2026-11-18 附記（SELECT_UNIT_1_NOT 技能頁系統：SERV_SKILL_PAGE_SYSTEM 2013 路徑反推；schema v14）

**用戶選定「硬啃 2013 版（大量推測）」**（2026-11-18 決定；在「缺 xlsm→TempletVer2、缺全部頁系統 proc/表、缺 SkillTemplet.lua」的前提下仍實作）。反推資料源**僅**以下幾處（全部唯讀機讀）：

- 原版 `GameServer/GSGameDBThread.cpp` Query_SelectUnit：`P_GSkill_Expand_SEL`（SKILLPageCNT>>ActivePage；缺列→1/1；Active 越界 log 後 clamp 1）→ `P_GSkill_New_SEL`/`P_GSkill_Cash_SEL`/`gup_get_cash_skill_point_info`（short,short,wstrEndDate；BeginFetch 失敗→0/0/L"2000-01-01 00:00:00"）→ `gup_get_unsealed_skill_info`（short 迴圈）→ `P_GSkillSlot_New_SEL`/`P_GSkillSlot2_New_SEL`（**整表缺列 → 自癒 INSERT 0 槽×頁**（gup_get_skill_slot_add 等價）；Active 頁技能鏡射 KUnitSkillData.m_aEquippedSkill）。
- `Common/CommonPacket.h`：KSkillData{short skillID; UCHAR cSkillLevel}、KUserSkillData、KUserSkillPageData（EQUIPPED_SKILL_SLOT_COUNT=4）、KUnitSkillData（SERV_SKILL_PAGE_SYSTEM：UCHAR m_nActiveSkillPagesNumber=1、m_nTheNumberOfSkillPagesAvailable=1）。
- `GSUserFunction.cpp`（m_nTheNumberOfSkillPagesAvailable ← SkillTree->GetTheNumberOfSkillPagesAvailable()，2 處）、`GSUserCashShop.cpp`（m_wstrCSPointEndDate 寫入）、`UserSkillTree.cpp`（SetCSPointEndDate 解析）。
- 2013 proc 名稱以 `SERV_ALL_RENEWAL_SP` 為判定分兩路（P_GSkill_*_SEL vs gup_*），V2 以單一路徑實作。

**⚠ 全部表結構／欄位語意／層級制皆為推定**——方向性（讀回什麼、預設值、自癒副作用）與原版一致，欄位級與位元級保證**不存在**；任何與原版不符之處只能靠本節偏差清單揭露。

**Schema v14**（`kGameSchemaVersion` 13→14）：

- `gskill` 擴充：`SkillLevel` INTEGER NOT NULL DEFAULT 1、`SkillCSPoint` INTEGER NOT NULL DEFAULT 0、`SkillPageNumber` INTEGER NOT NULL DEFAULT 1（Migration 既有列自動補 1/1/0＝「已學基礎技能」語意近似；技能等級過濾 SkillID>0 && SkillLevel>0 抄自原 New_SEL fetch 端）。
- 新表（FK→gunit，`ON DELETE CASCADE`）：
  - `gskillexpand`（UnitUID PK；`PageCount` INTEGER NOT NULL DEFAULT 1 `CHECK (PageCount >= 1)`；`ActivePage` INTEGER NOT NULL DEFAULT 1 `CHECK (ActivePage >= 1)`）— P_GSkill_Expand_SEL
  - `gskillslotnew`（PK(UnitUID, SkillPageNumber)；`Slot01..04` INTEGER NOT NULL DEFAULT 0；RegDate）— P_GSkillSlot_New_SEL
  - `gskillslot2new`（PK(UnitUID, SkillPageNumber)；`Slot01..04`；`EndDate` TEXT NOT NULL DEFAULT '2000-01-01 00:00:00'；RegDate）— P_GSkillSlot2_New_SEL
  - `gskillunsealed`（PK(UnitUID, SkillID)；RegDate）— gup_get_unsealed_skill_info
  - `gskillcash`（UnitUID PK；`CSPoint`、`MaxCSPoint` INTEGER NOT NULL DEFAULT 0；`EndDate` TEXT NOT NULL DEFAULT '2000-01-01 00:00:00'）— gup_get_cash_skill_point_info／P_GSkill_Cash_SEL
- **Backfill**（v13→v14）：legacy `gskillslot`（2008 單頁 Slot01..03）→ `gskillslotnew` 第 1 頁（Slot04=0）；`gskillexpand` ← gskill 既有角色（1/1）。**v13 庫可能存在 gunit 已刪但 skill 列殘留的孤兒列 → JOIN gunit 濾除**（FK 曾關閉時代入；不濾除則整個升級交易被 FK 擋死而無法開服，見偏差 14）。Legacy `gskill`/`gskillslot` **保留但不再寫入**（僅供舊測試/外部工具過渡）。
- 建角衛星（`InsertCreateUnitSideEffects`，§0a5）改寫頁系統：`gskill(SkillLevel=1, SkillPageNumber=1)` ＋ `gskillslotnew` 第 1 頁（Slot01=SkillID, Slot04=0）＋ `gskillexpand(1,1)`；class 5..9 仍忠實無列；失敗整體 ROLLBACK 不變。

**GameStore API**：

- `LoadSkillPageState(unitUID, SkillPageState& out, err)`：① `gskillexpand`（缺列→1/1；PageCount<1→1；ActivePage<1 或 >PageCount→1）② `gskill`（過濾 SkillID>0 && SkillLevel>0，ORDER BY SkillPageNumber, SkillID）③ `gskillslotnew` ORDER BY SkillPageNumber（**整表缺列 → 自癒**：Begin→recount→INSERT 0×PageCount→Commit，失敗 ROLLBACK→false，對應原 select-unit 路徑 InsertSkillWithSkillSlot 副作用）④ `gskillslot2new`（缺列不寫回；EndDate 取最高頁列；無列→哨兵）⑤ `gskillunsealed` ORDER BY SkillID。DB 錯誤/缺表→false；缺資料列皆預設值，非錯誤。
- `GetCashSkillPoint(unitUID, CashSkillPointValues& out, err)`：缺列→{0,0,哨兵} 非錯誤；DB 錯誤→false。

**Not1 組裝**：

- `unitInfo.unitSkillData`：`equippedSkill`/`equippedSkillSlotB` ← active 頁列（技能等級＝skills 查表，未學或未命中→0）；`skillSlotBEndDate` ← 讀回（哨兵同原）；`skillSlotBExpirationState`=0（偏差 9）；`activeSkillPagesNumber`/`theNumberOfSkillPagesAvailable` ← expand（u8 clamp）；`passiveSkill`/`guildPassiveSkill`/`skillNote` 空（偏差 10/11）。
- `unitInfo.csPoint`/`maxCSPoint`/`csPointEndDate` ← `gskillcash`（缺→0/0/哨兵）。
- `vecUserSkillPageData`：pagesAvailable 頁、每頁 equippedSkill/equippedSkillSlotB＋`userSkillData`（該頁 gskill 列，SkillCSPoint 直通 u8）；`usSkillPoint`/`usCashSkillPoint`=0（偏差 8）。
- `vecSkillUnsealed` ← `gskillunsealed`；`mapSkillNote` 空、`skillNoteMaxPageNum`=0（偏差 10）。
- `supplemental==nullptr`（list 路徑）：維持 1 頁全預設（pages 1/1），與 §0a2 行為一致。

**測試**：`tests/test_skill_page_readback.cpp`（新增 99 斷言）：schema v14 建表/欄位；v13→v14 手工最小庫遷移（backfill Slot04=0、expand 回填 1/1、SkillLevel 預設 1、**孤兒列被 JOIN 濾除**）；建角 class1 → 讀回 1 頁 {10000 Lv1 頁1 Slot01}、EndDate 哨兵、現金 0/0/哨兵；多頁場景（expand 3/2、頁 2 學 12001 Lv17 CSPoint 7、頁 3 學 13001、slotA 頁2=[20001,0,0,10000]、slotB 頁3=[21001]+EndDate 2026-05-01 ⇒ Not1 active 頁＝頁 2、skillSlotBEndDate 取最高頁、pages vec=3、page1/2/3 userSkillData 各自正確、裝備鏡射 10000→Lv1／20001→Lv0）；ActivePage 99→1；v14 CHECK 拒絕 ActivePage/PageCount=0；**SlotA 整表缺列自癒**（DB 補回 2 頁 0 槽，與原 InsertSkillWithSkillSlot 等價）；`gskill`／`gskillcash` 缺表 → `ERR_SELECT_UNIT_05`；現金點 roundtrip。
`tests/test_create_unit_satellite.cpp` 更新對應 v14（斷言 gskill 擴充欄位 / gskillslotnew 第 1 頁 Slot04=0 / gskillexpand 1/1；rollback 測試 DROP `gskillslotnew`）。
`tests/test_select_unit.cpp`、`tests/test_inventory_readback.cpp`：Not1 技能斷言更新為讀回值（pages 1/1、equippedSkill[0]={10000,1}、unsealed/note 空）。
**測試數**：**JP = 2017、TW = 2015、EU = 2013、CN = 2015、US = 2014 passed / 0 failed**（vs §0a22：JP 1908、TW 1906、EU 1904、CN 1906、US 1905）。`verify_generated` OK；NUL clean。

**偏差聲明**（全部為推定，非原版保證）：

1. 表名／欄位名／型別全為反推命名（`gskillslotnew`/`gskillslot2new`/`gskillunsealed`/`gskillexpand`/`gskillcash`）；原 proc 名稱以 SERV_ALL_RENEWAL_SP 分兩路（P_GSkill_*_SEL vs gup_*），V2 採單一路徑。
2. `SKILLPageCNT` 來源表名無證據——採 (UnitUID → PageCount, ActivePage) 單列表假設；無列 → 1/1（原 BeginFetch 失敗分支同）。
3. ActivePage 越界：原 clamp 1；V2 同＋schema `CHECK (>= 1)`（0 被 DB 直接拒絕，比 clamp 更強）。
4. `SkillLevel > 0` 過濾採自 New_SEL fetch 端（KimHC 註解語意）；`SkillID > 0` 同。
5. `gskill` ORDER BY 原 proc 未知 → V2 固定 (SkillPageNumber, SkillID)。
6. **自癒副作用位置**：原在 select-unit 讀路徑發生（InsertSkillWithSkillSlot）；V2 同一位置執行（讀路徑寫入副作用，僅整表缺列時、單一 transaction）。若排斥讀路徑寫入，可改為建角時寫入——本實作保留原行為。
7. `gskillslot2new` 缺列 → 哨兵 EndDate、不寫回（同原 Slot2_SEL「an 스킬슬롯B EndDate 비교는 하지 않는다」行為）。
8. `usSkillPoint`/`usCashSkillPoint`（頁 SP/CSP 池）無資料源 → 0；原 SP/CSP 池儲存表名完全未知。
9. `skillSlotBExpirationState`（char）無資料源 → 0（原語意不明：有效/過期狀態推測）。
10. `mapSkillNote`/`skillNoteMaxPageNum`（SERV_SKILL_NOTE）無資料源 → 空/0；GSkillNote 表名/原 P_GSkill_Note 系 proc 皆不存在於倉庫。
11. `passiveSkill`/`guildPassiveSkill`（被動/公會被動技能）無資料源 → 空。
12. **技能樹完全未建模**：SLV_MAX_LEVEL=30／技能學習·升級 SP 費用／SLV_MAX_LEVEL 的 Stat/SA／m_vecPrecedingSkill 前置關係／class 技能樹定義（NewSkillTempletVer2.lua **不在倉庫**）——V2 不做技能學習合法性/費用/解封判斷，僅持久化+回讀當前狀態。
13. `gskillunsealed`＝「已解封」清單（isBornSealed 技能經道具解封）；V2 無解封道具發放路徑 → 恆空（直到有寫入端點）。
14. v13→v14 Backfill 之**孤兒列 JOIN gunit 濾除**；不濾除則整個遷移被 FK 擋死（本輪實測複現並修復）。
15. `KSkillData.skillID` int16：DB int→clamp [0, 32767]（mod 超範圍資料降級為 32767，不報錯；<0 → 0）。
16. EndDate('YYYY-MM-DD HH:MM:SS')＝smalldatetime 以小時秒精度 UTC 保存（V2 其他 datetime 欄位一致慣例）。
17. `gskillcash` 缺列 → 0/0/哨兵（原 BeginFetch 失敗分支），非錯誤；原 P_GSkill_Cash_SEL 之 EndDate 更新時機（續期）完全不可移植——無現金商城技能續期端點。
18. CreateUnit 寫入 gskillexpand(1,1)/gskill(SkillLevel=1,PageNumber=1)/gskillslotnew(1頁)——**原 2013 CreateUnit 行為未知**（未確認建角 proc 是否直接建頁系統列，抑或首次 select 時由自癒路徑補列；V2 選擇建角即建列，與 2008 衛星慣例一致）。
19. Wire 佈局**未變更**（SELECT_UNIT_1_NOT 格式不變；golden bytes 不變）；變的是填充值（不再是預設假資料）。
20. 讀取失敗政策：缺表/DB 錯誤 → 整個選角失敗 `ERR_SELECT_UNIT_05`（比照 §0a14 背包／§0a18 清單政策）；缺「資料列」不視為錯誤（原缺列→預設值）。
21. sPoint（gunit.SPoint）與 CSPoint（gskillcash）兩者語意分離（SkillPoint vs CashSkillPoint，原 DB 分表）；V2 亦分表，不要混用。
22. list 路徑（MyUnitAndInventoryInfoList 等）`PopulateUnitInfoFromGUnit` 傳 nullptr → 技能頁/現金點維持 0/空（list 本來只給靜態欄位）。
23. 本 slice 修復三個既有/潛伏缺陷：v13→v14 Backfill 未濾孤兒列導致 FK brick（本輪實測複現）；測試暱稱 > 12 bytes（UTF-8 上限）靜默觸發 ERR_CREATE_UNIT_04 後未檢查 uid≤0 即繼續使用導致 vec 越界 **segv**（本輪實測複現）；以及 `test_select_not4_readback` 等 5 個測試的 `schema v13` 斷言未隨版本升級。
24. 已知未覆蓋：ASAN build 於 `test_select_not4_readback.cpp:72`（`std::__cxx11::basic_string<char>::clear()`）null-write **在純淨 312aa54 上亦 100% 複現**（已驗證），與本 slice 無關；正式 `build_and_test.sh` 五地區全綠，未深入根因（偏差登錄代查）。

## 0a22. 2026-11-17 附記（EGS_CURRENT_TIME_REQ/ACK：サーバー現在時刻）

SELECT_UNIT 全流程已落地；本期實作**完全自足、無 DB／無腳本表**的客戶端事件——`EGS_CURRENT_TIME_REQ`（NOPARAM）→ `EGS_CURRENT_TIME_ACK{ std::wstring m_wstrCurrentTime }`。

原版：

- **GSUserGameCommon::IMPL_ON_FUNC_NOPARAM( EGS_CURRENT_TIME_REQ )**（GSUserGameCommon.cpp:6232–6244）：
  `CTime::GetCurrentTime().Format( _T( "%Y-%m-%d %H:%M:%S" ) )` → ACK；無狀態檢查、無 DB、無條件送出。
- **ClientPacket.cpp**：PUT/GET 只含 `m_wstrCurrentTime`（`SERVER_CURRENT_TIME_INT64` **未定義**（ServerDefine.h 無此巨集）→ ACK 無 `m_tCurrentTime`）。

**V2 實作**：

- **協議** `src/server/CurrentTimeProtocol.{h,cpp}`（x2::current_time）：events 507/508；REQ NOPARAM／ACK{ wstring }；PUT/GET 逐字（`ks.Put(wstr)`＝[DWORD byte 長][UTF-16LE bytes]）；golden bytes 驗證。
- **handler**：`HandleCurrentTimeReq(req, ack, wstrNow = L"")`——`wstrNow` 非空直接採用（測試注入）；空 → 本地時間格式化（`localtime_r`／Windows `localtime_s`＋snprintf；固定 19 寬 ASCII，與原 Format 形狀逐字一致）。
- **測試**：`tests/test_current_time.cpp`（REQ NOPARAM、ACK golden bytes（注入 "2026-11-17 12:34:56"）、事件 id、注入路徑、真實時間路徑的形狀檢查（19 寬、`-`/` `/`:` 位置））。
- **測試數**：**JP = 1908、TW = 1906、EU = 1904、CN = 1906、US = 1905 passed / 0 failed**。
- **偏差聲明**（完整列表見 CurrentTimeProtocol.h 檔頭）：
  1. **時區**：原 CTime::GetCurrentTime()＝Windows **本地時間**；V2 以 POSIX `localtime_r`／Windows `localtime_s` 格式化本地時間——皆屬 "server local time"，但 Windows CRT 與 POSIX 的本地時區來源不同（實作層差異）。
  2. 形狀以手動組裝（不依賴 strftime 的 %Y-%m-%d 行為差異）；非法時間（localtime 失敗）→ 空 wstring。
  3. 無 DBE 轉發（原 handler 也無）。
  4. 線路佈局自洽 golden bytes；未對原 SDK 實機驗證。

## 0a21. 2026-11-17 附記（EGS_GET/MODIFY_WISH_LIST：찜 리스트讀寫；schema v13；帳號級）

原版 `EGS_GET_WISH_LIST_REQ`（NOPARAM）→ in-memory `KUserWishList.GetWishList` → `EGS_GET_WISH_LIST_ACK{ map<int,int> m_mapWishList }`；`EGS_MODIFY_WISH_LIST_REQ{ vector<int> m_vecWishListItemID; bool m_bIsDelete }` → `AddWish`/`DelWish`（SLOT_MAX=21）→ `EGS_MODIFY_WISH_LIST_ACK{ iOK, vec, bIsDelete }`。ItemID 為**現金商城產品 ID**（DB 商品），非道具 ID。**帳號級（UserUID）**，與角色選擇無關；FK→GUser。

原版：

- **Get**：VERIFY_STATE（S_FIELD_MAP/S_ROOM）；`GetWishList` 回傳 map（非 SERV_WISH_LIST_BUG_FIX）；
- **Modify**：VERIFY_STATE_ACK；非刪除路徑逐項 `SiCXSLItemManager()->GetItemTemplet` 查腳本表（缺 → ERR_WISH_LIST_00）、再排除轉職/銀行擴充/技能頁擴充/活動假商品/IsPossibleCart 等（全部腳本表查詢）；`AddWish` 已列→log+true、有空槽→最低位空槽、滿→`ERR_WISH_LIST_02`；刪除路徑 `DelWish` 找到→**左移壓實**（SLOT_MAX-1 內壓縮、尾端補 0），找不到→log+`goto end_proc`（批次中斷、iOK 保持 NET_OK——與原 `DelWish` 不 SET_ERROR 一致）；成功 → `FlushWishListChange` 標記 IsChanged 槽，於 `Query_UpdateWishList`（DBE_UPDATE_UNIT_INFO_REQ）逐槽 `gup_update_WishList`（upsert）。

**V2 實作**：

- **Schema v13**：`gitemwishlist`（UserUID FK→guser CASCADE；SlotNo smallint NULL（CHECK 0..32767）；ItemID int NULL；**UNIQUE(UserUID, SlotNo)**（proc NOT EXISTS→INSERT / 否則 UPDATE 隱含唯一性；NULL SlotNo 不參與）；IX UserUID（原 CLUSTERED））。
- **GameStore**：`GetWishList`（ItemID>0 過濾，**SlotNo BETWEEN 0 AND 20**（原 InitWishList 越界略過——內聯 SQL，wire 結果一致），ORDER BY SlotNo（原未指定；偏差明示）；NULL 列略過）／`GetWishListSlots`（完整 21 槽快照供 modify 讀態）／`ApplyWishListChanges`（單一 transaction；逐槽：不存在→INSERT、存在→UPDATE ItemID；每條 `Changes()==1` 驗證（proc @@ROWCOUNT<>1 → FAIL_TRAN 的等價））＋ `Database::Changes()`（sqlite3_changes64）。
- **協議** `src/server/WishListProtocol.{h,cpp}`（x2::wish_list）：GET REQ NOPARAM／GET ACK map<int,int>；MODIFY REQ vec<int>+bool／ACK{iOK, vec<int>, bool}；**map/vector 的序列化＝dword BE 個數＋元素**（與原 eTAG_MAP/eTAG_VECTOR 無 tag 模式逐位元組一致；golden tests 驗證）。event id 509/510/511/512。**NetError：ERR_WISH_LIST_00=450、ERR_WISH_LIST_02=451**（2026-11-17 g++ 實編原 NetError_def.h 實測）。
- **Handler**：GET 回傳持有商品（ItemID>0）；MODIFY 指示（AddWish/DelWish）為 **drain semantics**：AddWish 逐項（≤0 item 靜默跳過、已列 no-op、最低位空槽、滿→ERR_WISH_LIST_02、**全無部分寫入**）；DelWish 逐項（找到→壓實；缺項→靜默跳過——偏差聲明 5）；成功才 NET_OK＋回顯；寫入失敗→全 rollback、ERR_WISH_LIST_02（借用，偏差聲明 4）。**write-through**（單一 transaction 僅變更槽；原為副本結束延遲 flush，偏差聲明 3）。
- **測試**：`tests/test_wish_list.cpp`（codec golden bytes ×4（GET ACK map 序列化、MODIFY REQ/ACK、GET REQ NOPARAM）、事件 id、NetError 值、讀過濾（ItemID>0/NULL/越界）、Add（空清單填槽/dup no-op/21 槽上限/22nd→ERR_WISH_LIST_02 且零寫入）、寫失敗（換名表 → ERR_WISH_LIST_02）、Delete 壓實、帳號級隔離）。
- **測試數**：**JP = 1900、TW = 1898、EU = 1896、CN = 1898、US = 1897 passed / 0 failed**。
- **偏差聲明**（完整列表見 WishListProtocol.h 檔頭）：
  1. **腳本 DB 缺失**（SiCXSLItemManager/SiCXSLCashItemManager/SiKBillManager/WishListNoItem）→ 商品存在性/轉職擴充排除/下架過濾 **全不做**；ERR_WISH_LIST_00 不產生。
  2. InitWishList 越界槽過濾內聯 SQL；GetWishList ORDER BY 追加（原未指定）。
  3. write-through vs 延遲 flush。
  4. 寫入失敗 → ERR_WISH_LIST_02（無原碼可用）。
  5. DelWish 缺項：drain（繼續其餘項）而非原「中斷批次」。
  6. NULL SlotNo/ItemID 列略過（原 ODBC 讀 NULL 進 int 語意不明確）。
  7. 線路佈局自洽 golden bytes；未對原 SDK 實機驗證。

## 0a20. 2026-11-17 附記（EGS_EQUIP_TITLE_REQ：칭호 장착/해제——首個稱號寫入事件；write-through）

選角路徑（§0a19）處理「重複配裝損壞修復」；稱號的**主動裝/卸事件**（客戶端稱號欄點擊）此前未實作。本切片落地 `EGS_EQUIP_TITLE_REQ/ACK`（事件 543/544）。

原版：

- **GSUserGameCommon::IMPL_ON_FUNC( EGS_EQUIP_TITLE_REQ )**（GSUserGameCommon.cpp:6540–…）：VERIFY_STATE(S_FIELD_MAP/S_ROOM)；`m_kUserTitleManager.EquipTitle( iTitleID )`（UserTitleManager.cpp:1437–1506）：
  - [1] `SiCXSLTitleManager()->IsExistTitleID(iTitleID)` 不存在 → ERR_TITLE_03；
  - [2] `m_iEquippedTitle == iTitleID` → ERR_TITLE_01；
  - [3] 未持有（in-memory `m_mapTitle` 無）→ ERR_TITLE_00；
  - [4] 過期（`tCurTime > m_kCTime`；`m_kCTime` 為稱號讀入時的 EndDate 換算）→ ERR_TITLE_02；
  - [5] 成功 → 改寫記憶體 `m_iEquippedTitle` → NET_OK。
- ACK{ m_iOK, m_iTitleID }（CLIENT 回顯 iTitleID，不歸零）。非 FIELD_MAP/ROOM 狀態 → SEND ERM_CHANGE_EQUIPPED_*_NOT（稱號換裝廣播）。
- **DB 寫入延遲**到下一次 DBE_UPDATE_UNIT_INFO_REQ（Query_UpdateUnit → `gup_update_title_hang(unitUID, m_iInitTitleID, m_iEquippedTitleID)`；SERV_TITLE_DATA_SIZE；proc 存在於倉庫）。

**V2 實作**：

- **協議** `src/server/EquipTitleProtocol.{h,cpp}`（x2::equip_title）：REQ{iTitleID:int32}；ACK{iOK, iTitleID}；events 543/544；golden bytes 自洽。
- **NetError**：新增 `ERR_TITLE_00..05 = 494..499`（**以 g++ 實際編譯原 `NetError_def.h` 實測**，與既有「實測編譯值」慣例一致；原 enum 計數人工/機器核對不可靠——見 NOTE）。
- **handler**：unitUID 對應原 GetCharUID()（呼叫端傳入）；`nowUtc` 可注入（測試固定時間，字串比較）。驗證順序同原 [2][3][4]（見偏差聲明 1），通過後 **write-through** `GameStore::EquipTitleHang`：
  - `iTitleID == 0` → 全部 `IsHang = 0`（proc @iTitleID=0 分支）；
  - 否則 → detach 舊配裝（≠0 且≠新；proc @iOldID）＋ attach 新（proc @iTitleID）；transaction 內先驗證持有（COUNT=1）、attach 後驗證 IsHang=1 恰一列；失敗 → rollback + false。
- **ERR_TITLE_03**（templet 不存在）V2 無法產生（無 ScriptDB；見偏差聲明 1）；負值 iTitleID → ERR_TITLE_03。
- **DBE 失敗碼**：無原碼對應 → 採 **ERR_TITLE_04（498，稱號を獲得できませんでした）**，非 ERR_TITLE_03（避免誤導「不存在」）。
- **測試**：`tests/test_equip_title.cpp`（golden bytes、句柄 event id、ERR_TITLE_* 值=編譯實測值、handler 全分支：已配裝/未持有/過期/切換/全卸/負值/不可解析 EndDate fail-closed/回饒/foreign unit）。
- **測試數**：**JP = 1853、TW = 1851、EU = 1849、CN = 1851、US = 1850 passed / 0 failed**。
- **偏差聲明**：
  1. **SiCXSLTitleManager（Title 腳本表）不在倉庫** → [1] 稱號存在性不驗證；持有背書取代（gtitle_complete 主鍵 (UnitUID, TitleID)）。
  2. **write-through vs 延遲寫**：原版在 DBE_UPDATE_UNIT_INFO（副本結束或強制 info update）才落盤；V2 無 session 記憶體與副本結束路徑 → 立即寫入同一 transaction（與 §0a10 社群選項同慣例；V2 選角/副本系統未來落地時可改為 write-back）。
  3. **當前配裝態來自 DB**：讀 gtitle_complete 首個 IsHang=1（TitleID ASC）——與選角路徑一致（§0a12/§0a19）；並發以 transaction 內再驗證兜底（無跨請求鎖）。
  4. **VERIFY_STATE / ERM_CHANGE_EQUIPPED_*_NOT 不移植**（無 FSM；無 Room/Field 子系統）。
  5. **過期以 EndDate 字串比較**：非空但無法解析 → 視為過期（fail closed；原 CTime 轉換失敗後 GetTime()=0 語義）；NULL（永久）恆有效。
  6. 線路佈局自洽 golden bytes；未對原 SDK 實機驗證。

NOTE：`NetError_def.h` 的 enum 人工/樸素腳本核對計數與實際編譯值不符（ERR_SELECT_UNIT_07 實測 1081≠朴素計數 1020）——**凡新增 NetError 常數一律以 g++ -I 直接編譯原標頭實測**。

## 0a19. 2026-11-17 附記（SELECT_UNIT_1_NOT：重複 IsHang 修復寫路徑——原 bResetTitle 路徑）

§0a12 將「bResetTitle 寫路徑」列為待辦；本節落地。

原版（Query_SelectUnit，GSGameDBThread.cpp:1829–1879、1883–1934；SERV_ALL_RENEWAL_SP 未定義 → legacy `gup_update_title_hang`）：

- fetch `gup_get_title_list` 逐列 `FETCH_DATA(TitleID >> EndDate >> bIsEquippedTitle)`；
- `m_kUnitInfo.m_iTitleID` 尚為 0 時：首個 `bIsEquippedTitle==1` 列生效；
- 已有 m_iTitleID 卻又來一列 `bIsEquippedTitle==1` → 記錄 duplicate、`bResetTitle = true`、`continue`；
- `if (bResetTitle)`：呼叫兩次 `gup_update_title_hang(UnitUID, 0, 0)`（**全部脫下**：`UPDATE GTitle_Complete SET IsHang = 0 WHERE UnitUID = …`）＋ `gup_update_title_hang(UnitUID, 0, m_iTitleID)`（**重新裝回首個**：`UPDATE … IsHang = 1 WHERE UnitUID = … AND TitleID = m_iTitleID`）；兩次皆只 FETCH RETURN iOK、**錯誤僅 log，不中斷選角**。

**V2 實作**：

- **GameStore::RepairDuplicateEquippedTitle(unitUID, equippedTitleID)**：單一 transaction 內兩條 UPDATE（IsHang→0 全清；IsHang→1 僅首個 TitleID）；失敗 → rollback、false。`gup_update_title_hang` proc 存在但 V2 一律以等價 SQL 執行（與全局慣例一致）。
- **HandleSelectUnitReq**：title 段統計 `IsHang==1` 列數；>1 → 呼叫修復；修復失敗 → `x2::Logger::Instance().Write(Warn, …)` 並繼續選角（與原碼「僅 log 不中斷」一致）；修復成功 → DB 與 wire（m_iTitleID＝首個 TitleID）一致。
- **測試**：tests/test_inventory_readback.cpp `TestTitleRepair`（重複 100/200 → select 後僅 100 IsHang=1；單一 IsHang=1 → 不寫路徑；重命名 gtitle_complete → RepairDuplicateEquippedTitle false＋rollback、原樣保留兩筆 IsHang=1）。
- **測試數**：**JP = 1825、TW = 1823、EU = 1821、CN = 1823、US = 1822 passed / 0 failed**。
- **偏差聲明**：
  1. **首列的定義**：V2 `GetTitleCompleteList ORDER BY TitleID ASC` ⇒ equippedTitleID 為最小 TitleID；原 fetch 順序由 `gup_get_title_list` 的排序決定（其 proc 未指定 ORDER BY → 表順序未定義）——V2 固定 TitleID 序，偏差明示。
  2. **repair 的 TitleID**：原用 `m_iTitleID`（首個 fetch 到的 IsHang=1 列之 TitleID）——V2 同（最小 TitleID）。
  3. **修復失敗不中斷選角**（原碼同；V2 經 Logger::Warn 記錄——V2 無原 START_LOG 系統）。
  4. **write 路徑**：本切片是 V2 選角流程中第一處「讀路徑內隱含修復寫入」；模式為單 transaction、無跨請求副作用。

## 0a18. 2026-11-17 附記（SELECT_UNIT_1_NOT：UnitInfo.dungeonClear / tcClear 讀回；schema v12）

Not1 的 `UnitInfo.mapDungeonClear`／`UnitInfo.mapTCClear`（原版寫法：`m_mapDungeonClear` ← `gup_get_dungeon_clear`；`m_mapTCClear` ← `gup_get_tc_clear`）原為空容器佔位。兩 proc 均**在倉庫內**（legacy 分支生效——SERV_ALL_RENEWAL_SP 未定義），兩表（GDungeonClear / GTrainingCenter，含 PK (UnitUID, GameMode) / (UnitUID, TCID)）同樣存在。

原版：

- **gup_get_dungeon_clear**：`SELECT GameMode, MaxScore, MaxTotalRank, CAST(RegDate AS nvarchar(19)) FROM GDungeonClear WHERE UnitUID=@iUnitUID_`；FETCH → `KDungeonClearInfo{ m_iDungeonID←GameMode, m_iMaxScore, m_cMaxTotalRank, m_wstrClearTime, m_bNew=false }`；`map::insert`（重複 GameMode 保留首筆）。
- **gup_get_tc_clear**：`SELECT TCID, CAST(RegDate AS nvarchar(19)) FROM GTrainingCenter WHERE UnitUID=@iUnitUID_`；同法填 `KTCClearInfo`。
- FETCH 於 Title 段之後、技能段之前；失敗 → 整體選角失敗（V2 同：ERR_SELECT_UNIT_05）。

**V2 實作**：

- **Schema v12**：`gdungeonclear`／`gtrainingcenter`（UnitUID FK→gunit CASCADE；複合 PK (UnitUID, GameMode|TCID) 對應原 CLUSTERED PK；MaxTotalRank CHECK 0..255；RegDate TEXT NOT NULL 保留 CAST 字串格式 `YYYY-MM-DD HH:MM:SS`）。
- **GameStore**：`GetDungeonClears`／`GetTCClears`。`SelectUnit1Supplemental` 新增 `dungeonClear`／`tcClear`；HandleSelectUnitReq 於復活石讀取後取得（缺表 → ERR_SELECT_UNIT_05）；`BuildSelectUnitNot1` supplemental 段填 `unitInfo.dungeonClear/tcClear`（`isNew=false`；map::insert 保留首筆）。
- **測試**：TestDungeonClears（空/填充/Not1 端到端/缺表 → ERR_SELECT_UNIT_05）。
- **測試數**：**JP = 1806、TW = 1804、EU = 1802、CN = 1804、US = 1803 passed / 0 failed**。
- **偏差聲明**：
  1. RegDate 存字串原樣（CAST(RegDate AS nvarchar(19)) 對應 SQLite datetime 預設格式；V2 以 TEXT 保存，輸出逐字）。
  2. `m_bNew` 恆 false（原 insert 時設為 false；無續作語意）。
  3. map::insert 保留首筆（原碼同；PK 保證不重複，無實質差異）。
  4. buffInfo 無資料源（Buff 系統表不在本倉庫分支的選角 DB 範圍）→ 空容器。

## 0a17. 2026-11-17 附記（SELECT_UNIT_1_NOT：GItemAttribute 合併＋socket 尾端 0 裁剪；schema v11）

**勘誤（續）**：§0a16 稱「`gup_get_attribute` 不在倉庫、attrib 恆預設」——**同樣錯誤**。`gup_get_attribute.proc.sql` 實際存在於 `Database2/Database2/Schema Objects/Stored Procedures/`（Database2/…）。本節將其接上，並回溯修正 §0a16「仍未接」清單。

原版（Query_GetInventory，GSGameDBThread.cpp:3674–3710、3890–3926）：

- **gup_get_attribute**（SERV_ALL_RENEWAL_SP **未定義** → legacy 分支生效）：
  `SELECT * FROM GItemAttribute WHERE ItemUID IN (SELECT ItemUID FROM GItem WHERE UnitUID=@iUnitUID AND Inventorycategory IN (1,9) AND Deleted=0)`
  欄位 (ItemUID, SlotNo, Attribute)；依 SlotNo 分派：0→ESI_SLOT_1→`m_kAttribEnchantInfo.m_cAttribEnchant0`，1→`m_cAttribEnchant1`，2→`m_cAttribEnchant2`；其他 SlotNo → log + 忽略（ESI_MAX=3）。僅**裝備類（カテゴリ 1, 9）**。
- **socket 組裝**（arrSocketOption[4]）：自尾端去除 0 → `m_vecItemSocket`（內嵌 0 保留；全 0 → 空 vector）。

**V2 實作**：

- **Schema v11**：`gitemattribute`（ItemUID/SlotNo/Attribute 三欄全 NULL（保留原 heap＋可空語意）；ItemUID 索引（對應原 IXC_GItemAttribute_ItemUID，SQL Server 為 CLUSTERED → SQLite 普通索引）；無 PK（原無 PK））。FK→gitem ON DELETE CASCADE 依 V10 慣例補上（偏差：原無 constraint 檔）。
- **GetItemAttributes**：gup_get_attribute 逐字移植（category IN (1,9)、Deleted=0）。**GetInventoryItems** 主查詢後以 `uidToIdx` map 合併（ESI_SLOT 外列忽略——與原 log+drop 一致，V2 不記 log）。原 `SELECT *` 欄位順序含 SlotNo 直接映射，無 SlotNo 過濾。
- **BuildSelectUnitNot1**：`itemSocket` 尾端 0 裁剪（全 0 → 空 vector）；`attrib` ← rec.attrib（ESI_SLOT_1..3 → cAttribEnchant0..2）。
- **測試**：TestAttributes（category 過濾、ESI_SLOT 外 SlotNo 忽略、weapon 一槽、Not1 端到端 attrib/socket 裁剪（內嵌 0 保留）、GetItemAttributes 原始列檢視）。
- **測試數**：**JP = 1786、TW = 1784、EU = 1782、CN = 1784、US = 1783 passed / 0 failed**。
- **仍未接（確定缺失，本次已全倉庫掃過確認）**：
  - `gup_get_item_list_seal`／`gup_get_item_list_seal`（sealData 恆 0；GItemSeal 表是否存在**未再驗證**——proc 缺即無法對齊欄位）；
  - `P_GItemSocket_Random_SEL`（randomSocket 恆空）；
  - `P_GItem_ItemList_SEL` 等 `P_*`／`*_new` 系 proc（SERV_BATTLE_FIELD_BOSS／SERV_SKILL_PAGE_SYSTEM 路徑——技能／CS／未封印技能全族）；
  - `GItemInventory` 表（`gup_get_inventory[_by_category]` 的資料源）；
  - `P_GEnhCount_*`／`gup_get_cash_skill_point_info`／`gup_get_unsealed_skill_info`（現金技能點／未封印技能）；
  - `messengersn`（account DB，跨庫；Not4 kMessengerInfo 佔位）；
  - GCharacter_Log 系計數（Not5 mapCharGameCount）；`P_GPShopInfo_SEL_ShopCheck`／GHenir*（Not5）。
- **偏差聲明**：
  1. 原 `SELECT *` 欄位**順序**未在 proc 中固定；V2 明確 (ItemUID, SlotNo, Attribute)——與 IXC 一致。
  2. ESI_SLOT 外 SlotNo：V2 靜默忽略（原 log+cerr）；欄位不外洩為錯誤（與「部分料理跳過」慣例一致）。
  3. Attribute 值以 int8 截斷（原 char 同）。
  4. ELevel/Socket/Quantity/Period：§0a16 已接；本節不變。

## 0a16. 2026-11-17 附記（SELECT_UNIT_1_NOT：物品衛星欄位讀回——修正 §0a14 勘誤；schema v10）

**勘誤**：§0a14 以「衛星表（GItemQuantity/GItemEndurance/GItemEnchant/GItemPeriod/GItemSocket）均不在倉庫」為由，quantity/endurance/enchantLevel/period/sockets 一律填預設。**此結論錯誤**：這些表實際存在於 `Database2/Database2/Schema Objects/Tables/`（`dbo.GItemQuantity.table.sql` 等；keys 目錄含 PKs：ItemUID CLUSTERED PK ＋ FK→GItem ON DELETE CASCADE；GItemSocket 四欄 DF 預設 -1；GItemEnchant.ELevel 為 smallint NULL）。本節將衛星欄位接上真實資料源，並回溯修正 §0a14 的偏差聲明（第 3、4 條作廢）。

原版（`gup_get_item_list.proc.sql`，隨附）語意：

- 暫存表 `@ItemList`（ItemUID PK；UsageType tinyint DEFAULT 0；Quantity int DEFAULT 0；Endurance int DEFAULT -1；Period/EndDate；ELevel tinyint DEFAULT 0；Socket1..4 smallint DEFAULT 0；InventoryCategory/SlotID tinyint）
- `UPDATE … JOIN GItemQuantity` → `UsageType=2, Quantity=Quantity`
- `UPDATE … JOIN GItemEndurance` → `UsageType=1, Endurance=Endurance`（**耐久覆寫量型**——Leech 最後套用）
- `UPDATE … JOIN GItemEnchant` → `ELevel`
- `UPDATE … JOIN GItemPeriod` → `Period, EndDate`
- `UPDATE … JOIN GItemSocket` → `Socket1..4`
- `order by inventorycategory`

**V2 實作**：

- **Schema v10**：`gitemquantity`／`gitemendurance`／`gitemenchant`／`gitemperiod`／`gitemsocket` 五表（ItemUID INTEGER PK REFERENCES gitem(ItemUID) ON DELETE CASCADE；ELevel INTEGER NULL 保留 NULL；GItemSocket 預設 -1 保留；Period CHECK ±32767；ExpirationDate TEXT NOT NULL 保留 smalldatetime→字串原樣）。
- **GetInventoryItems**：LEFT JOIN 五表一次讀取；UsageType 依原 proc 同序推導（`endurance row` 存在 → 1，否則 `quantity row` 存在 → 2，否則 0）；ELevel `COALESCE(NULL→0)`；缺列 → proc 暫存表預設（Quantity=0/Endurance=-1/Period=0/EndDate=""/Sockets=0/UsageType=0）。
- **Not1 端到端**：quantity/UsageType/period/ExpirationDate（→ Utf8ToWide wstrEndDate）/enchantLevel/itemSocket[4] 經 BuildSelectUnitNot1 進 mapItem；equippedItem 映射同步真實值。
- **測試**：`tests/test_inventory_readback.cpp` 新增 TestSatellites（兩表同列 UsageType=1 覆寫、NULL ELevel→0、缺列→預設、Not1 端到端 quantity/period/expirationDate/socket/enchant 接線）。
- **測試數**：**JP = 1765、TW = 1763、EU = 1761、CN = 1763、US = 1762 passed / 0 failed**。
- **仍未接**（已由 §0a17 更新：`gup_get_attribute` 實際存在並已接線；seal/randomSocket/BOSS 路徑仍缺——見 §0a17 清單）。
- **偏差聲明**：
  1. ELevel：NULL → 0（原 proc 將 NULL 寫入 NOT NULL tinyint 會失敗；V2 以 0 收斂——較寬容，偏差明示）。
  2. ExpirationDate 存字串原樣（smalldatetime 的 V2 儲存格式為 UTC 文本；proto wire 同 §0a14 慣例 Utf8ToWide）。
  3. ORDER BY 明確 `InventoryCategory, SlotID, ItemUID`（原無 SlotID 序）。
  4. Equipped mirror 不變（SlotCategory==9、key=SlotID、insert 保留首筆）。

## 0a15. 2026-11-17 附記（SELECT_UNIT_4_NOT：iRecommendUnitUID 讀回；SELECT_UNIT_5_NOT：bIsSpiritUpdated 讀回；schema v9）

§0a9/§0a13 落地 Not4、§0e 落地 Not5 時，`iRecommendUnitUID`/`bIsSpiritUpdated` 皆為 0/false 佔位。本切片接上兩個**資料源在倉庫內**的項目。

原版：

- **`kAck.m_iRecommendUnitUID`**（GSGameDBThread.cpp:789–838，`gup_get_unit_info_by_unituid`）：`SELECT @iOldUID = OldUID FROM GRecommend WHERE NewUID = @iUnitUID_`（缺列 → @iOldUID 保持 0；標量賦值多列時取「最後讀到的那列」，順序未定義）→ SendSelectUnitACK：`kNot_4.m_iRecommendUnitUID`（GSUserFunction.cpp:18093）。GRecommend 表（Database2）**在倉庫內**（OldUID/NewUID bigint、RegDate smalldatetime NULL；IX_GRecommend_NewUID 非叢集索引）。
- **`Not4.m_bIsRecommend`**：← `m_kUserRecommendManager.IsRecommend()`，其值源自**帳號級** `KAccountManager`（KIntroduceServer/DBE_ACCOUNT_*；Database1 的 RSGRecommendSystem 等）——**V2 無帳號 DB** → 恆 false（誠實佔位）。
- **`Not5.m_bIsSpiritUpdated`**（GSGameDBThread.cpp:814/836，同 proc）：`@iAllSpirit = Flag`（`SELECT Spirit, Flag FROM GSpirit WHERE UnitUID`）→ SendSelectUnitACK：`kNot_5.m_bIsSpiritUpdated`（GSUserFunction.cpp:18117）。Flag bit 直接轉 bool。
- **Not5 其餘**：`mapCharGameCount` ← `gup_get_Character_Count`／`P_GCharacter_Count_SEL`（**proc 不在倉庫**；對應計數表（GCharacterLog 等）亦未見於 Tables 樹）；`kPShopAgencyInfo` ← `P_GPShopInfo_SEL_ShopCheck`（**proc/GPShopInfo 表不在倉庫**）；`packetHenirRewardCount` ← `gup_get_henir_reward_cnt`／`P_GHenirRewardCnt_SEL`（**proc/表不在倉庫**）；`bCashShopOpen`（SERV_CONTENT_MANAGER，runtime `SiKGSContentManager()->IsEnableCashShop()`）、`bFirstSelect`（SERV_ARA_FIRST_SELECT_TUTORIAL，`GetCharacterCount(CGCT_SELECT_CHAR) == 0`）、`bLocalRankingUser`（SERV_LOCAL_RANKING_SYSTEM，runtime）——**均無資料源** → false/0/空。

**V2 實作**：

- **Schema v9**：`grecommend`（OldUID/NewUID INTEGER NOT NULL；RegDate TEXT NULL；IX NewUID）。原 heap/無 PK 保留。
- **GameStore**：`GetRecommendOldUID`（`SELECT OldUID FROM grecommend WHERE NewUID = ? ORDER BY RegDate ASC, OldUID ASC LIMIT 1`；found=false → 缺列非錯誤）。
- **`BuildSelectUnitNot4(..., recommendUnitUID=0)`**（尾參預設 0）；HandleSelectUnitReq 於 Not4 段讀 GRecommend（缺表 → ERR_SELECT_UNIT_05）。
- **`BuildSelectUnitNot5(out, spiritValues=nullptr)`**：`out.bIsSpiritUpdated = spiritValues ? (spiritValues->flag != 0) : false`。HandleSelectUnitReq hoist `db::SpiritValues`（Not1 與 Not5 共用同一次讀回）。
- **測試** `tests/test_select_not45_readback.cpp`（grecommend 缺列/多列 determinism/不存在、Not4 iRecommendUnitUID 接線＋bIsRecommend 恆 false、Not5 flag=0/1/nullptr、缺表 → ERR_SELECT_UNIT_05、歸屬錯誤）。TestSelectNot4 defaults / Not5 defaults 路徑不變（尾參預設）。
- **測試數**：**JP = 1734、TW = 1732、EU = 1730、CN = 1732、US = 1731 passed / 0 failed**。
- **偏差聲明（逐條）**：
  1. **多列 determinism**：原標量賦值取「最後讀到的列」（未定義順序）；V2 固定 `ORDER BY RegDate ASC, OldUID ASC LIMIT 1`（取最早一列）。正常情況每 GRecommend 應僅一列（GUnit 級別唯一入會），差異僅見資料損壞時。
  2. **bIsRecommend 恆 false**：源為帳號 DB（V2 無）；文件化佔位。
  3. **bIsSpiritUpdated = (GSpirit.Flag != 0)**：原碼 bit→bool 直轉，一致；Flag 語意（DF_GSpirit_Flag）由原碼管理，V2 如實保存（§0a8 政策）。
  4. **mapCharGameCount / PShopAgencyInfo / HenirRewardCount / bCashShopOpen / bFirstSelect / bLocalRankingUser 恆空/false**：proc/表缺失或屬 runtime/帳號級。若日後補 proc 與表，改配接線即可。
  5. **缺表 → ERR_SELECT_UNIT_05**（與 §0a9/§0a13/§0a14 慣例一致）。

## 0a14. 2026-11-17 附記（SELECT_UNIT_1_NOT：背包格數／物品／裝備映射／復活石量讀回；schema v8）

§0e 落地 Not1 時，`mapInventorySlotSize`/`mapItem`/`iNumResurrectionStone`/`equippedItem` 皆為空/0 佔位。本切片接上**可移植的部分**；衛星表缺失部分恆為 proc 預設值（見偏差聲明）。

原版（JP；SERV_BATTLE_FIELD_BOSS:4257 已定義 → 主物品清單走 `P_GItem_ItemList_SEL`（**5 socket**）；SERV_ALL_RENEWAL_SP 未定義；SERV_ITEM_OPTION_DATA_SIZE:1182 已定義；SERV_NEW_ITEM_SYSTEM_2013_05:3653 已定義；SERV_EXPAND_SLOT_ID_DATA_SIZE:1582 已定義；SERV_GET_INVENTORY_REFAC:487 已定義）：

- **Query_GetInventory**（GSGameDBThread.cpp:3604–）：`gup_get_inventory_size`（倉庫 **proc 隨附**，但 `SELECT InventoryCategory, SUM(NumSlot) FROM GItemInventorySize WHERE UnitUID=@iUnitUID_ GROUP BY NumSlot, InventoryCategory`——**GROUP BY NumSlot 為疑似 bug**：同 category 多列時，`map::insert` 只保留第一列，且 SUM 對 (Category, NumSlot) 群組語意不通）→ `mapInventorySlotSize`。
- **主物品清單**：BOSS 路徑 `P_GItem_ItemList_SEL`——**proc 不在倉庫**（`gup_get_item_list` 存在，但非本建置路徑）→ 無法逐 byte 對齊 FETCH 欄位；V2 以**表結構**（GItem 存在）＋ **call site 8 欄**（ItemUID, ItemID, InventoryCategory, SlotID＋衛星欄位）為準移植**降級版**：`SELECT ItemUID, ItemID, InventoryCategory, SlotID FROM GItem WHERE UnitUID=? AND Deleted=0 ORDER BY InventoryCategory, SlotID, ItemUID`。
- **Addl**：`gup_get_item_list_pet`（GItemPet/GItemPetKeep？）、`gup_get_attribute`（GItemAttribute）、`gup_get_item_list_seal`（GItemSeal）、`P_GItemSocket_Random_SEL`——**衛星表/proc 均不在倉庫**。
- **UnitInfo.m_mapEquippedItem**（GSGameDBThread.cpp:1556–1594）：`mapItem` 中 `m_cSlotCategory == ST_E_EQUIP`（CXSLInventory 枚舉，`ST_NONE=0…ST_BANK=8, ST_E_EQUIP=9`）→ `keyed by m_sSlotID`（SERV_EXPAND_SLOT_ID_DATA_SIZE）插入 UnitInfo.equippedItem。
- **kNot_1.m_iNumResurrectionStone**（GSGameDBThread.cpp:1596–…）：`gup_get_resurrection_stone`（缺 → 0）。
- **SendSelectUnitACK**（GSUserFunction.cpp:17970–）：`kNot_1.m_mapInventorySlotSize/m_mapItem` 原樣轉發。

**V2 實作**：

- **Schema v8**：`gitem`（ItemUID INTEGER PK AUTOINCREMENT；UnitUID FK→gunit CASCADE；ItemID；InventoryCategory/SlotID 0..255；RegDate/DelDate NOT NULL；`Deleted AS CASE WHEN RegDate = DelDate THEN 0 ELSE 1 END` 逐字鏡像原計算欄位；IX UnitUID）／`giteminventorysize`（**無 PK**（原 heap 忠實保留）；InventoryCategory/NumSlot 0..255；FK→gunit CASCADE；IX UnitUID）。**衛星表不建**（不存在原 DDL——寧缺毋假）。
- **GameStore**：`GetInventorySlotSize`（**category GROUP BY SUM(NumSlot)**——修正原 proc 疑似 bug，見偏差聲明；ORDER BY category）／`GetInventoryItems`（`Deleted = 0`；ORDER BY InventoryCategory, SlotID, ItemUID）。unit 不存在 → 空、true。
- **`SelectUnit1Supplemental`**（header 新增）＋ **`BuildSelectUnitNot1(..., supplemental)`**（尾參、預設 nullptr——舊呼叫點不變）：
  - `out.inventorySlotSize ← supplemental->inventorySlotSize`；`out.items` ← 以**gup_get_item_list 暫存表預設值**建 `ItemInfo`（quantity=0、usageType=0、endurance=-1、period=0、enchantLevel=0、sockets 全 0、sealData=0、attrib 全 0、randomSocket **空 vector**、itemState=0、expandedSocketNum=0、expirationDate=""）；`equippedItem`：SlotCategory==9 → keyed by SlotID（`map::insert` 保留第一筆，與原碼一致）。
  - `out.numResurrectionStone ← gresurrectionstone.Quantity`（缺列 → 0）。
- **HandleSelectUnitReq**：outNot1 非空時於 Spirit 讀回後取得三項；任一失敗 → `ERR_SELECT_UNIT_05`（DBE 慣例）。
- **測試** `tests/test_inventory_readback.cpp`（schema v8／gitem AUTOINCREMENT／slot size per-category SUM（同 category 多列求和）／items（ORDER BY、軟刪除排除、衛星預設值）／Not1 整合（slot size 接線、equippedItem key=slotID、復活石 3、技能佔位保持，於 §0a23 更新為讀回斷言）／缺表 → ERR_SELECT_UNIT_05／歸屬錯誤）。TestBuildSelectUnitNot1Defaults 未改（supplemental=nullptr 路徑）。
- **測試數**：**JP = 1700、TW = 1698、EU = 1696、CN = 1698、US = 1697 passed / 0 failed**。
- **偏差聲明（逐條）**：
  1. **`gup_get_inventory_size` 疑似 bug 已修正**：原 proc `GROUP BY NumSlot, InventoryCategory`（每 (Category, NumSlot) 群組一列的 SUM，再靠 `map::insert` 只保留第一列、且同類多列只顯示不定哪列）；V2 以 **category GROUP BY SUM(NumSlot)** 實作（每類格數總和，deterministic）。若原語意（每類僅一列、NumSlot 即總數）成立，兩者結果一致；若 NumSlot 多列（副本/深淵等擴格）——V2 求和，原碼行為未定義。
  2. **主物品清單以表結構＋call site 為準、proc 降級**：`P_GItem_ItemList_SEL` 不在倉庫（BOSS 路徑、**5 socket**）；V2 以 GItem 8 欄實作，socket 5 欄只建 4（`ItemInfo.itemSocket` 為 SERV_ITEM_OPTION_DATA_SIZE 的 vector，V2 放 4 個 0 對齊常見情形；actual wire 由 client 端 socket 數決定，未對原 SDK 驗證）。
  3. **衛星欄位恆為預設**：GItemQuantity/GItemEndurance/GItemEnchant/GItemPeriod/GItemSocket 表**均不在倉庫** → quantity=0／usageType=0／endurance=-1／enchantLevel=0／period=0／sockets=0／sealData=0／attribEnchant 全 0／randomSocket=[]／itemState=0／expandedSocketNum=0／expirationDate=""（`gup_get_item_list` 暫存表的 DEFAULT 值，非臆造）。
  4. **`ucSealData` 恆 0**（GItemSeal 表不在倉庫）。
  5. **`ItemUID` 為 gitem 自增主鍵**（原 IDENTITY(1,1) bigint → SQLite INTEGER PRIMARY KEY AUTOINCREMENT）；itemUID 由 DB 生成。
  6. **ORDER BY**：原 `order by inventorycategory`（slotID 順序未定義）；V2 明確 `InventoryCategory, SlotID, ItemUID`。
  7. **裝備映射** SlotCategory==9（ST_E_EQUIP）；**無跳過 ST_BANK/ST_E_EQUIP**（原 Query_GetInventory 不跳過；MY_UNIT_AND_INVENTORY_INFO_LIST 路徑跳過邏輯未建模）。
  8. **技能樹/被動技能不建模**（NewSkillTempletVer2.lua 及 P_GSkill_Passive_SEL 皆不在倉庫）；裝備 Buff 不建模。技能頁已於 §0a23 讀回（gskill/gskillslotnew/gskillslot2new/gskillexpand/gskillunsealed/gskillcash）。
  9. **GItem 軟刪除語意**：`Deleted` 生成欄位 = `CASE WHEN RegDate = DelDate THEN 0 ELSE 1 END`（原計算欄位逐字對應）；軟刪除為 `DelDate > RegDate`。

## 0a13. 2026-11-17 附記（SELECT_UNIT_4_NOT：黑名單／師徒（사제）／30 分鐘連線事件讀回；schema v7）

§0h 落地 Not4 時，DB 讀回僅 kDenyOptions（§0a9）。本切片把三個**角色級** DB 源接上（其餘仍為佔位）。

原版（JP；SERV_ALL_RENEWAL_SP 未定義 → legacy proc；SERV_NO_DISCIPLE 未定義 → 師徒路徑啟用；SERV_ADD_EVENT_DB 未定義 → legacy 30min／帳號事件路徑；CUMULATIVE_TIME_EVENT:101 已定義；SERV_ACC_TIME_EVENT:288 已定義）：

- **vecChatBlackList**（GSGameDBThread.cpp:2465–2478）：`gup_select_blacklist`（倉庫 **proc 隨附**）：`SELECT a.BlockUID, b.Nickname FROM GBlackList a, GUnitNickName b WHERE a.MyUID = @iMyUID AND a.blockuid = b.unituid`（comma join = inner join）→ `KChatBlackListUnit{ m_iUnitUID ← BlockUID, m_wstrNickName ← Nickname }`。表：`GBlacklist`（PK(MyUID, BlockUID)；**無 FK**）。
- **vecTutorialDBUnitInfo**（GSGameDBThread.cpp:2493–2517）：`iTutorialFlag`＝ 等級 ≤ `UNIT_LEVEL_STUDENT_MAX=10` → 0（我是學生）、≥ `UNIT_LEVEL_TEACHER_MIN=20` → 1（我是老師）、11–19 級 → **不查詢**。`gup_get_tutor(flag, unitUID)`：我是學生 → `SELECT a.TeacherUID, b.level, c.Nickname, a.lastdate FROM GTutor a JOIN GUnit b ON a.StudentUID=unit AND a.TeacherUID=b.UnitUID JOIN GUnitNickName c ON a.TeacherUID=c.UnitUID AND a.Deleted=0`；**學生分支原碼還有 `UPDATE GTutor SET LastDate=GETDATE() WHERE StudentUID=unit`**；我是老師 → 對稱。→ `KTutorialDBUnitInfo{ kTutorialUnitInfo{ m_iUnitUID, m_ucLevel ← level, m_wstrNickName ← Nickname, m_bIsOnline=false（fetch 不填） }, m_wstrLastDate ← a.lastdate }`。
  - 表 `GTutor`：**無 PK**（heap）；`Deleted AS CASE WHEN RegDate = DelDate THEN 0 ELSE 1 END`（計算欄位）；RegDate/DelDate NULL-able；`GIs30Min`：無 PK（heap＋IX_GIs30Min_UnitUID）；FK→GUnit CASCADE。
- **vecConnectTimeEvent**（GSGameDBThread.cpp:2522–2540 ＋ SERV_ACC_TIME_EVENT 段 2668–2683）：
  - 角色級：`gup_select_30min`（倉庫 **proc 隨附**）→ `SELECT EventType, RegDate FROM GIs30min WHERE UnitUID=@iUnitUID` → `KConnectTimeEventInfo{ m_iEventUID ← EventType, m_wstrEventTime ← RegDate, m_bAccountEvent=false（fetch 不填） }`。
  - **帳號級**：`gup_select_event_account_nor`（iUserUID scoped）——**proc 與表均不在倉庫** → 無法移植。
- **vecCumulativeTimeEvent**（CUMULATIVE_TIME_EVENT，GSGameDBThread.cpp:2697–2745）：角色級 `gup_get_remaintime`、帳號級 `gup_select_event_account_acc`——**proc 與表均不在倉庫** → 容器維持空。

**V2 實作**：

- **Schema v7**（`kGameSchemaVersion` 6→7）：`gblacklist`（PK(MyUID, BlockUID)；FK→gunit CASCADE ×2——原表無 FK，V2 加 CASCADE 純衛生，實際刪除皆為軟刪除不受影響，見偏差聲明）／`gtutor`（**無 PK**（忠實保留 heap）；TeacherUID/StudentUID FK→gunit CASCADE；RegDate/LastDate/DelDate TEXT NOT NULL DEFAULT (datetime('now'))（收斂 NULL-able；生成欄位需可比字串）；`Deleted INTEGER GENERATED ALWAYS AS (CASE WHEN RegDate = DelDate THEN 0 ELSE 1 END) STORED`——**逐字鏡像原計算欄位**；ix_gtutor_teacher/student 索引）／`gis30min`（FK→gunit CASCADE；EventType 0..255；IX→UnitUID）。
- **GameStore**：`GetBlacklist`（`ORDER BY BlockUID ASC`；nickname NULL → 空字串）／`GetTutorInfo(isTeacher, unitUID)`（`Deleted = 0`；INNER JOIN gunit＋gunit_nickname；`exp` 原樣帶回）／`GetConnectTimeEvents`（`ORDER BY EventType ASC`）。unit 不存在也回空列表 true（原 proc 不檢查）。
- **`BuildSelectUnitNot4(out, denyOptions, blacklist, tutor, connectTimeEvents)`**（簽名變更）：黑名單／師徒／30 分鐘事件如上；`bIsOnline=false`；**ucLevel ← `exp_table::CheckLevelUp(1, exp)`**（§0u 政策；原讀 b.level 欄——見偏差聲明）；`bAccountEvent=false`。HandleSelectUnitReq：outNot4 非空時依 **`CheckLevelUp(1, unit.exp)`** 求 10/20 閘門（等同原 kUnitInfo.m_ucLevel）。
- **測試** `tests/test_select_not4_readback.cpp`（schema v7／三表／黑名單 JOIN（暱稱釋放→空字串）／GetTutorInfo（學生/老師雙路徑、Deleted 生成欄位 soft-delete 排除）／GetConnectTimeEvents（ORDER BY）／Not4 整合（三源接線、cumulative 恆空、缺表→ERR_SELECT_UNIT_05、歸屬錯誤））；TestBuildSelectUnitNot4Defaults 同步新簽名。
- **測試數**：**JP = 1658、TW = 1656、EU = 1654、CN = 1656、US = 1655 passed / 0 failed**。
- **偏差聲明（逐條）**：
  1. **學生分支 `UPDATE GTutor SET LastDate=now` 未移植**——V2 SELECT 唯讀；LastDate 保留原值（wire 僅帶回字串）。
  2. **ucLevel ← EXP 換算**，非 gunit.Level 欄（§0u 政策：gunit.Level 在 V2 不維護）；uint8 截斷 255。
  3. **帳號級 30 分鐘事件未移植**（`gup_select_event_account_nor`）——proc 與表均不在倉庫；vecConnectTimeEvent 只含角色級 30 分鐘事件。
  4. **vecCumulativeTimeEvent 恆空**（`gup_get_remaintime`／`gup_select_event_account_acc` 均不在倉庫）。
  5. **gblacklist 加 FK→gunit CASCADE**（原表無任何 FK）——純資料完整性衛生；V2 刪除皆為軟刪除，CASCADE 不會實際觸發。
  6. **RegDate/DelDate 收斂 NOT NULL**（原 smalldatetime NULL-able）——生成欄位 Deleted 的字串比較需要可比值；語意不變（預設 now）。
  7. **ORDER BY**：原 proc 無 ORDER BY；V2 明確排序（輸出確定性）。
  8. **GTutor 軟刪除為 DelDate > RegDate**（而非「DelDate 非 NULL」）——忠實保留原計算欄位語意（`CASE WHEN RegDate = DelDate THEN 0 ELSE 1 END`）；將來接入 gup_insert_tutor/gup_delete_Tutor 時必須以該語意標記刪除。
  9. **INNER JOIN 語意**：對手方缺 gunit_nickname 列 → 黑名單／師徒列整個不出現（與原 comma join 一致）。

## 0a12. 2026-11-17 附記（SELECT_UNIT_3_NOT 稱號/稱號任務讀回：gtitle_complete ∪ gtitle_mission；schema v6）

§0g 落地 Not3 時，V2 game DB 尚無稱號表，vecTitle／vecMission 一律空容器佔位。本切片補上真實資料源（pet 部分維持空佔位，見偏差聲明）。

原版（JP INT_INTERNAL；SERV_ALL_RENEWAL_SP 未定義 → legacy proc 路徑；SERV_TITLE_DATA_SIZE 已定義 → m_iTitleID(int)；SERV_TITLE_DUPLICATE_PROCESS_REVISION:1411 已定義；SERV_PET_SYSTEM:460 已定義）：

- **vecTitle**（GSGameDBThread.cpp:1829–1866）：`gup_get_title_list`（`SELECT TitleID, EndDate, IsHang FROM GTitle_Complete WHERE UnitUID = @iUnitUID`；倉庫 **proc 隨附**、語意與 V2 schema 對應 → **原樣可移植**，`P_GTitle_Complete_SEL` 未採用）
  - `KTitleInfo{ m_iTitleID ← TitleID, m_wstrEndDate ← EndDate 原始字串（含 NULL 永久列）, m_kCTime=0／m_bInfinity=false（legacy fetch 不填） }`
  - **第一個 IsHang=1 列 → kUnitInfo.m_iTitleID**（SERV_TITLE_DATA_SIZE int）；後續 IsHang=1 列 → `bResetTitle=true`（視為 DB 損壞），原會 `gup_update_title_hang` 兩段式修復（先 unhang 全部、再掛回第一筆）。
- **vecMission**（GSGameDBThread.cpp:1945–1991）：`gup_get_title_mission_list`（倉庫 **proc 隨附**；`SELECT TitleID, SubMission1..5 FROM GTitle_Mission`）→ `KMissionInstance{ m_iID=TitleID, 5×KSubMissionInstance{ m_iID=0、m_sClearData=SubMissionN、m_bIsSuccess=false } }`；**跳過 TitleID 已在 vecTitle 者**（SERV_TITLE_DUPLICATE_PROCESS_REVISION）。
- 表：`GTitle_Complete`（PK(UnitUID,TitleID)；EndDate smalldatetime **NULL**；IsHang bit **NULL DEFAULT 0**；FK→GUnit ON DELETE CASCADE ON UPDATE CASCADE）；`GTitle_Mission`（PK(UnitUID,TitleID)；SubMission1..5 smallint NULL-able）。

**V2 實作**：

- **Schema v6**（`kGameSchemaVersion` 5→6）：`gtitle_complete`（TitleID CHECK ±32767；EndDate TEXT NULL-able；IsHang INTEGER NOT NULL DEFAULT 0 CHECK 0/1）、`gtitle_mission`（SubMission1..5 NOT NULL DEFAULT 0 CHECK ±32767——**收斂 NULL-able 為 NOT NULL**，NULL→0 換算之近似）。兩表 PK(UnitUID, TitleID)、FK→gunit CASCADE。
- **GameStore**：`GetTitleCompleteList`／`GetTitleMissionList`——unit 不存在也回空列表 true（原 proc 不檢查）；V2 加 `ORDER BY TitleID ASC`（原無 ORDER BY，僅保證輸出確定性）；`EndDate` NULL → `endDateNull=true`、空字串。
- **`PopulateUnitInfoFromGUnit`**／**`BuildSelectUnitNot1`** 新增 `equippedTitleID = 0` 尾參（預設 0，其餘呼叫點不變）：`u.titleID ← equippedTitleID`（僅 SELECT_UNIT 路徑傳入；MY_UNIT_LIST/CHARACTER_LIST 路徑 titleID 仍 0 佔位）。
- **`HandleSelectUnitReq`**：outNot1/outNot3 非空時先讀 `gtitle_complete` 求 `equippedTitleID`（第一個 IsHang=1；**多筆 IsHang=1 → 第一筆生效，DB 不改寫**——SELECT 唯讀；原 bResetTitle 修復寫路徑未移植）；outNot3 再讀 `gtitle_mission`。任一步失敗 → `ERR_SELECT_UNIT_05`。
- **`BuildSelectUnitNot3(out, titles, missions)`**（簽名變更）：vecTitle（wstrEndDate ← EndDate 原樣（Utf8ToWide）或空 wstring（NULL）；kCTime=0、bInfinity=false）＋ vecMission（SERV_TITLE_DUPLICATE_PROCESS_REVISION 過濾；iID/sClearData/bIsSuccess=0/clear/false）。pet 容器維持空／iSummonedPetUID=0。
- **測試** `tests/test_title_readback.cpp`（schema v6／兩表 PK／GetTitleCompleteList（ORDER BY／NULL EndDate／不存在 unit／缺表→false）／GetTitleMissionList／Not1+Not3 整合（equipped title→Not1.titleID；永久稱號→空 wstring；dup-of-title mission 過濾；雙 IsHang=1 → 第一筆生效；缺表→ERR_SELECT_UNIT_05；歸屬錯誤））；`tests/test_select_unit.cpp` TestBuildSelectUnitNot3Defaults 同步新簽名。
- **測試數**：**JP = 1616、TW = 1614、EU = 1612、CN = 1614、US = 1613 passed / 0 failed**。
- **偏差聲明（逐條）**：
  1. **bResetTitle 修復寫路徑未移植**：原 SELECT_UNIT 於多筆 IsHang=1（DB 損壞）時會 unhang-all + 掛回第一筆（`gup_update_title_hang` ×2）；V2 SELECT 唯讀，不改寫 DB，僅第一筆生效。V2 尚無任何寫入稱號掛載狀態的路徑，此損壞態無法由 V2 自行產生。
  2. **EndDate 不解析**：原 legacy fetch 僅原樣搬 WString；m_kCTime=0、m_bInfinity=false（SERV_ALL_RENEWAL_SP 的 `P_GTitle_Complete_SEL` 未採用；可能填 CTime 語意，未對照）。V2 同值（kCTime=0/bInfinity=false），EndDate 僅原樣字串。
  3. **GTitle_Mission SubMission NULL → 0**（欄位收斂 NOT NULL DEFAULT 0）；原 smalldatetime NULL→ODBC 讀回語意。
  4. **ORDER BY TitleID ASC**：原 proc 無 ORDER BY（輸出順序依 DB 實作）；V2 明確排序（wire 輸出確定性）。
  5. **清單路徑 titleID 佔位**：MY_UNIT_LIST / CHARACTER_LIST 的 UnitInfo.titleID 仍為 0（清單路徑讀回稱號未移植）。
  6. **pet 未移植**：SERV_PET_SYSTEM 已定義，但 V2 無 GPet 等表——iSummonedPetUID=0、vecPetList/vecCanEvolutionPetList/vecNeverSummonPetList/mapPetItem 空容器。
  7. **IsHang=1 掛載寫入端未移植**（無台詞執行緒實際寫 gtitle_complete 的路徑；Not3 目前只讀）。
  8. V1 新表不做「SELECT 修復」：`gtitle_complete` 為 GameStore 遷移之 v6 新表，v0→v6 遷移鏈完整（v1..v5 於舊庫上依序套用）。

## 0a11. 2026-11-17 附記（SELECT_UNIT_2_NOT 任務資料讀回：gquests／gquests_complete ∪ gquests_repeat；schema v5）

§0f 落地 Not2 時，V2 game DB 尚無任務完成表，vecQuest／vecCompletQuest 一律空容器佔位。本切片補上真實資料源。

原版（JP INT_INTERNAL；SERV_ALL_RENEWAL_SP 已註解→legacy 路徑為本建置實際路徑；SERV_DAILY_QUEST:236、SERV_RANDOM_DAY_QUEST:1291 已定義）：

- **vecQuest**（GSGameDBThread.cpp:1716–1739）：`gup_get_quest_list` → `KQuestInstance{ m_iID=QuestID, m_OwnorUnitUID=req.m_iUnitUID, 5×KSubQuestInstance{ m_iID=0（fetch 不填）, m_bIsSuccess=false（fetch 不填）, m_ucClearData=SubQuest0..4 } }`。`gup_get_quest_list.proc.sql` **隨倉庫提供**，語意與 V2 gquests 表（§0a5）完全對應——**原樣可移植**。
- **vecCompletQuest**（SERV_DAILY_QUEST 分支，GSGameDBThread.cpp:1744–1788）：`gup_get_quest_complete_list`（GQuests_Complete；QuestID＋wstrCompleteDate）先 ∪ `gup_get_quest_Repeat_complete_list`（GQuests_Repeat；`SELECT DISTINCT QuestID FROM GQUESTS_REPEAT`——同樣回兩欄）後，各 `KCompleteQuestInfo{ m_iCompleteCount=1, m_tCompleteDate ← ConvertStringToCTime(wstrCompleteDate) }`。
  - **倉庫內 `gup_get_quest_complete_list.proc.sql` 僅 SELECT QuestID**（與 call site 的 `FETCH_DATA( QuestID >> wstrCompleteDate )` 不一致——倉庫 proc 疑似過期）；V2 以**表結構**（GQuests_Complete／GQuests_Repeat：UnitUID／QuestID／RegDate／CompleteDate smalldatetime NOT NULL；Complete 有 PK(UnitUID,QuestID)、FK→GUnit CASCADE；Repeat 無 PK——忠實保留）＋ **call site** 為準：`SELECT QuestID, CompleteDate`。
- **mapRandomQuestList**：資料源為 `SiCXSLQuestManager()->GetRandomQuestGroupList(...)`（GSUserFunction.cpp:5125，script/QuestTemplet 態）——無資料源 → 空 map（誠實佔位）。

**V2 實作**：

- **Schema v5**（`kGameSchemaVersion` 4→5）：新增 `gquests_complete`（PK(UnitUID,QuestID)）／`gquests_repeat`（無 PK），FK→gunit ON DELETE CASCADE，RegDate/CompleteDate TEXT UTC（`datetime('now')`）。
- **GameStore**：`GetQuestList(unitUID)`（`SELECT QuestID, SubQuest0..4 FROM gquests ORDER BY QuestID`；unit 不存在 → 空列表 true（原 proc 不檢查））；`GetQuestCompleteList(unitUID)`（先 complete 後 repeat，回 QuestCompleteRecord{questID, completeDateEpoch}；CompleteDate 以內置 **days_from_civil** 演算法按 **UTC** 解析為 epoch（平台無關，避免 timegm/_mkgmtime 差異）；**解析失敗 → false＋err**（不回傳部分資料））。
- **BuildSelectUnitNot2(out, ownerUnitUID, quests, completed)**（簽名變更）：QuestInstance（ownerUnitUID←參數）／5×SubQuestInstance（僅 ucClearData，iID=0/bIsSuccess=false）／CompleteQuestInfo（completeCount=1）。`HandleSelectUnitReq`：outNot2 非空時查詢；任一失敗 → `ERR_SELECT_UNIT_05`。`mapRandomQuestList` 恆空。
- **測試** `tests/test_quest_readback.cpp`（schema v5／gquests_complete PK／GetQuestList（含建角副作用 QN=13/SubQuest0=1、ORDER BY、unit 不存在→true、缺表→false）／GetQuestCompleteList（complete 先 repeat 後、重複 QuestID 各一筆、epoch 946684800=2000-01-01／959904000=2000-06-02／981173106=2001-02-03 04:05:06、CompleteDate 損壞→false）／Not2 整合（建角→Not2 帶 1 任務、種入完成表→vecCompletQuest 反映）／歸屬錯誤路徑）；`tests/test_select_unit.cpp` TestBuildSelectUnitNot2Defaults 同步更新（新簽名＋映射斷言）。
- **測試數**：**JP = 1562、TW = 1560、EU = 1558、CN = 1560、US = 1559 passed / 0 failed**。
- **偏差聲明（逐條）**：
  1. `gup_get_quest_complete_list` 倉庫 proc 與 call site 不符（缺 CompleteDate 欄）——以表結構＋call site 為準（CompleteDate 保留）；若將來發現更新版 proc，應以其為準。
  2. `m_tCompleteDate`：原以**伺服器本地時區**將 smalldatetime 字串解析為 time_t（CTime）；V2 一律 **UTC**（V2 時間為 UTC ISO8601），跨時區部署時 CompleteDate 會與原版差一個時區偏移。
  3. `GQuests_Repeat` 無 PK（原表即如此）。原 Repeat proc 用 `SELECT DISTINCT(QUESTID)`（僅一欄）——但 SERV_DAILY_QUEST call site 卻 FETCH 兩欄（QuestID + CompleteDate），兩者不相容，倉庫 proc 與 call site 必有一方過期。V2 選擇**以 call site 的兩欄輸出為準**：`SELECT QuestID, CompleteDate`、**不做 DISTINCT**（repeat 表重複列全部輸出，completeCount=1 各一筆）。若將來核對到原 SERV_DAILY_QUEST 實機行為（或補上更新版 proc），應回頭對齊 DISTINCT 與否。
  4. `mapRandomQuestList` 空（SiCXSLQuestManager/script 無資料源）；QuestInstance.m_iID/bIsSuccess 恆 0/false（原 fetch 不填）；Quest 寫路徑（gup_create_quest／gup_update_quest／gup_complete_quest／P_GQuests_*，寫入者）**未移植**——Not2 目前只能讀。

## 0a10. 2026-11-17 附記（EGS_UPDATE_COMMUNITY_OPTION_REQ/ACK：社群選項寫路徑；write-through）

§0a9 已把 Not4 的 kDenyOptions 接上 gdenyoption 讀回，但當時 V2 **無任何寫路徑**——客戶端改不了這些值。本切片補上 `EGS_UPDATE_COMMUNITY_OPTION_REQ`（365）/`ACK`（366，V2 EventIDs.h 既有生成值）。

原版語意（2014 JP，`SERV_RELATIONSHIP_SYSTEM` 已定義）：

- `IMPL_ON_FUNC(EGS_UPDATE_COMMUNITY_OPTION_REQ)`（GSUserGameCommon.cpp:2981）：VERIFY_STATE（S_FIELD_MAP/S_ROOM）→ `KUserGameOption::SetDenyOptions`（UserGameOption.cpp:35）驗證 → 寫入**記憶體** → `SendToLoginServer(ELG_UPDATE_DENY_FRIEND_SHIP_NOT, { m_bDenyFriendShip })` → 送 ACK（iOK=NET_OK）。**DB 不在此處寫**——延遲到副本結束（`DBE_UPDATE_UNIT_INFO_REQ → Query_UpdateCommunityOption`，GSGameDBThread.cpp:6030）：relationship 路徑呼叫 `P_GDenyOption_UPD`（**不隨倉庫提供**）；legacy 非 relationship 路徑呼叫 `gup_update_community_opt`（**隨倉庫提供**——unit 不存在→-1；無列→INSERT 4 列／有列→CASE UPDATE；`@@ROWCOUNT<>4`→-2/-3）。
- 驗證（SetDenyOptions 原碼）：**不對稱上限**——cDenyFriendShip ∈ [0, DOS_OFF=1]（原碼不接受 DOS_ONLY_FRIEND=2）；其餘五欄 ∈ [0, DOS_ONLY_FRIEND=2]；失敗 → `ERR_COMMUNITY_OPT_01`，**ACK 仍送出**（原版此時 m_kDenyOptions 未初始化——wire 洩漏堆疊內容）。
- 選角時（GSUserFunction.cpp:5119）`m_kUserGameOption.SetDenyOptions(kAck_.m_kDenyOptions)` 把 DBE_SELECT_UNIT_ACK 的 6 值灌入記憶體。

**V2 實作**：

- **新模組** `UpdateCommunityOptionProtocol.{h,cpp}`（`x2::community_option`）：REQ/ACK codec（REQ=6×char；ACK=int32 BE iOK→6×char，與 KDenyOptions wire 佈局一致）＋ `ValidateDenyOptions`（照抄原不對稱上限）＋ `HandleUpdateCommunityOptionReq(gameDb, unitUID, req, ack, err)`（`unitUID` 對應原 `GetCharUID()`，由呼叫端傳入；驗證通過立即 write-through）。
- **Schema**：沿用 §0a9 的 v4（`gdenyoption.CodeNo` 0..255）。
- **GameStore::UpdateDenyOptions(unitUID, v, err)**：同一 transaction——`unit 存在且 Deleted=0` 否則 false＋err（鏡像 `gup_update_community_opt` 的 -1）→ 逐 QN(1..6) `INSERT ... ON CONFLICT(UnitUID, QuestionNo) DO UPDATE SET CodeNo=excluded.CodeNo`（SQLite 3.54.1 支援 UPSERT；語意＝原 proc「無列→INSERT／有列→UPDATE」雙分支的 6 欄擴充；QN5/6 無對應原 proc，同模式處理，**誠實缺口**）；CodeNo 負數/>255 → 拒絕（原表 tinyint 無範圍限制，V2 僅擋明顯非法值）。
- **NetError**：新增 `ERR_COMMUNITY_OPT_01=240`／`ERR_COMMUNITY_OPT_02=241`（`NetError_def.h` 純連續列舉無 #ifdef；機讀計數法重現既有全部實測值——SELECT_UNIT_05=39、SELECT_UNIT_07=1081、RESTORE_NICK_NAME_00=328、DELETE_UNIT_00=986、VERIFY_21=578、CREATE_UNIT_11=1289——故 240/241 可信）。
- **與 §0a9 連動**：測試斷言更新後 `HandleSelectUnitReq(..., outNot4)` 帶出的 kDenyOptions 反映新值（DB 即真值，write-through 後無快取不一致）。
- **測試** `tests/test_community_option.cpp`（codec golden bytes×3、事件 ID、ValidateDenyOptions 邊界、GameStore upsert 全部分支（含缺列重插、全刪重建、負數/>255、unit 不存在/已刪除）、Handler 決策（01 驗證失敗不動 DB／02 unit 不存在／NET_OK 回顯）、SELECT_UNIT_4_NOT 連動、wire 迴路）；`test_all.cpp` 登記 `RunCommunityOptionTestsByRef`；**vcxproj 登記 UpdateCommunityOptionProtocol.{h,cpp}**（tests/ 不進 Windows 工程，與既有慣例一致）。
- **測試數**：**JP = 1514、TW = 1512、EU = 1510、CN = 1512、US = 1511 passed / 0 failed**。
- **偏差聲明（逐條）**：
  1. **write-through vs 延遲寫**：原版成功僅改記憶體、DB 於副本結束才寫；V2 無 session option 物件、亦無副本結束路徑 → 驗證通過立即 transaction upsert。行為差異：客戶端收到 ACK 成功時，原版 DB 可能尚未更新（crash 即遺失），V2 保證已落盤。
  2. **ELG_UPDATE_DENY_FRIEND_SHIP_NOT 未移植**：V2 無 LoginServer 通道；好友拒絕狀態不同步到登入伺服器（好友系統整體未移植）。
  3. **VERIFY_STATE（S_FIELD_MAP/S_ROOM）不適用**：V2 無 FSM。
  4. **unit 不存在/已刪除 → ERR_COMMUNITY_OPT_02**（原版無此檢查，in-memory 必成功）；原版副本結束延遲寫失敗時 ACK 不回報——V2 write-through 必須當場回報，故借用原「CommunityOpt DB 失敗」碼。
  5. **失敗路徑 ACK 歸零**（原版 m_kDenyOptions 未初始化）；**QN5/6 upsert 無對應原 proc**；若將來補上副本結束延遲寫路徑（DBE_UPDATE_UNIT_INFO_REQ 家族），應改為在該處呼叫本寫入並移除 write-through。

## 0a9. 2026-11-17 附記（SELECT_UNIT_4_NOT kDenyOptions ← GDenyOption 讀回；schema v4）

原路徑（2014 JP；`SERV_RELATIONSHIP_SYSTEM`:3643 已定義）：

- `GSUserFunction::SendSelectUnitACK`（GSUserFunction.cpp:18085–18117）把 DBE ACK 的 `m_kDenyOptions` 放進 `EGS_SELECT_UNIT_4_NOT`；ACK 的 deny options 來自 `DBE_GAME_SELECT_UNIT_REQ → Query_SelectUnit` 流程（GSGameDBThread.cpp）中的 `P_GDenyOption_SEL`——**`P_GDenyOption_SEL`／`P_GDenyOption_UPD`／`P_GDenyOption_MER` 均不隨倉庫提供**（find/grep 皆無）。6 欄（`KDenyOptions`：cDenyFriendShip／cDenyInviteGuild／cDenyParty／cDenyPersonalTrade／cDenyRequestCouple／cDenyInvitePracticePVP；`DenyOptionState`：**DOS_ON=0／DOS_OFF=1／DOS_ONLY_FRIEND=2**，CommonPacket.h）。
- relationship 之前的舊路徑 `gup_get_community_opt_unituid.proc.sql`（4 值、QuestionNo 1–4 各查一次、**缺列 → CodeNo=1**、`SELECT 1,2,3,4`、NOLOCK）**隨倉庫提供**，但非本建置啟用路徑——V2 僅借用它的「缺列→1」慣例與欄序語意。
- `gup_update_community_opt.proc.sql`（4 參數 @iInsertFriendDeny_/@iManToManChatDeny_/@iPartyDeny_/@iPrivateDealDeny_；unit 不存在→-1；無列→INSERT 4 列／有列→CASE UPDATE；`@@ROWCOUNT<>4`→-2/-3）**隨倉庫提供**（舊版 `EGS_UPDATE_COMMUNITY_OPT` 路徑）。V2 於 §0a9 落地時尚無寫路徑（§0a10 已補上 write-through；relationship `P_GDenyOption_UPD` 仍缺 proc）。

**V2 實作**：

- **Schema v4 migration**（`kGameSchemaVersion` 3→4）：`gdenyoption.CodeNo` CHECK 由 1..255 放寬為 **0..255**（SQLite 無法在原位改 CHECK，故整表重建於單一 transaction，失敗整體 ROLLBACK）。原 `dbo.GDenyOption` 為 tinyint 且**無範圍限制**；v2 建表時 1..255 會擋掉合法值 DOS_ON=0。v2 CREATE TABLE 一併放寬（新庫直建即正確）。
- **`GameStore::GetDenyOptions(unitUID)`**：`SELECT QuestionNo, CodeNo FROM gdenyoption WHERE UnitUID = ?`；**缺列 → 全 1（DOS_OFF），非錯誤**（鏡像 `gup_get_community_opt_unituid` 的 missing→1 慣例）；unit 不存在/已刪除 → true（原 proc 不檢查 unit 存在）；未知 QuestionNo 忽略；QN1..6 → friendShip/inviteGuild/party/personalTrade/requestCouple/invitePracticePVP。
- **`BuildSelectUnitNot4(out, denyOptions)`**：kDenyOptions ← QN1..6 原樣；其餘欄位（黑名單/教學/連線時間/Henir/好友/戰場狀態…）仍全預設/空（誠實佔位）。**§0a13 已改為 gblacklist／gtutor／gis30min 讀回（vecCumulativeTimeEvent 仍空）**。`HandleSelectUnitReq`：outNot4 非空時查詢 gdenyoption；失敗 → `ERR_SELECT_UNIT_05`（DBE 流程失敗慣例，與 §0a8 spirit/re-read 一致）。
- **QN=5（RequestCouple）／QN=6（InvitePracticePVP）**：V2 建角副作用（§0a5）鏡像原 `gup_create_unit` 只 INSERT QN1..4 → 缺列 → **恆預設 1**；relationship 路徑才會寫 5/6（客戶端 `EGS_UPDATE_COMMUNITY_OPT`）——§0a9 當時 V2 無該封包處理器（§0a10 已補上 write-through 寫路徑；P_GDenyOption_* 仍缺 proc，以 upsert 近似）。
- **測試** `tests/test_select_unit_daily_reset.cpp` 新增 `TestDenyOptionReadback`（8 個子情境：建角預設 1×6、Not4 同步讀回、UPDATE 庫→Not4 反映（0/2/1）、QN5/6 補列→讀回、未知 QN 忽略、全刪→全 1 非錯誤、unitUID 不存在→true＋預設值、v4 migration 覆蓋）；`tests/test_select_unit.cpp` `TestBuildSelectUnitNot4Defaults` 同步更新（預設 1、顯式值傳入）。
- **測試數**：**JP = 1455、TW = 1453、EU = 1451、CN = 1453、US = 1452 passed / 0 failed**。
- **偏差聲明**：NOT 逐欄忠實 relationship 啟用路徑（`P_GDenyOption_SEL` 缺 proc）；以「gdenyoption 直接讀回＋缺列→1 舊版慣例」近似；QN5/6 無資料來源恆為 1。

## 0a8. 2026-11-17 附記（SELECT_UNIT 登入副作用：gup_select_unit 的 DB 部分＋GSpirit 讀回）

原 `DBE_GAME_SELECT_UNIT_REQ → gup_select_unit`（DataBase/…/dbo.gup_select_unit.proc.sql）在角色登入時會：

1. **GSpirit 每日重置**：`CONVERT(SMALLDATETIME, CONVERT(NVARCHAR(10), dateadd(hh,+18,@sdtSpiritDate),120)+' 06:00') < @sdtNow` 成立 → `Spirit=@iStartSpirit（GResurrectionStoneCnt）, Flag=0, RegDate=now`（跨日 06:00 重置精力）。
2. **復活石每日補充**：同法以 `@sdtLastLogin`（GUnit.LastDate）換算 06:00 邊界；成立 → 無 `GResurrectionStone` 列 → `INSERT (UnitUID, StartCnt)`；有列且 `Quantity < SupplyCnt` → `UPDATE SET Quantity=SupplyCnt`。
3. **PlayDayCnt+1**（`DateDiff(day, @sdtLastLogin, @sdtNow) > 0`）；**LoginCount+1、LastDate=now**。
4. `DBE_GAME_CREATE_UNIT_ACK`／`DBE_GAME_SELECT_UNIT_ACK` 的 `KUnitInfo.m_iSpirit` ← `gup_get_unit_info_by_unituid` 的 `@iSpirit`（GSpirit 讀回）；`gup_select_unit` 會先執行 1–3 再由 ACK 帶出最新值。

**V2 實作（Schema v3 migration：`kGameSchemaVersion` 2→3，新增 `gresurrectionstone`（UnitUID PK、Quantity，對應原 dbo.GResurrectionStone））：**

- **`GameStore::ApplyUnitLoginReset(unitUID)`**：單事務執行上述 1–4（其中 6:00 KST 邊界以 UTC 儲存時間＋SQL 內 `+9 hours` 換算；V2 時間一律 UTC ISO8601）：1) `UPDATE gspirit … WHERE (date(datetime(RegDate,'+9 hours','+18 hours')) || ' 06:00:00') < datetime('now','+9 hours')`，StartSpirit 缺列/NULL → `IFNULL(...,0)`；2) 先 `SELECT 1 FROM gresurrectionstone` 判斷有無列——無 → `INSERT IFNULL(StartCnt,0)`，有 → Quantity<IFNULL(SupplyCnt,0) 才補至 SupplyCnt（**INSERT 與 UPDATE 互斥，鏡像原 proc 的 IF/ELSE**；首版曾誤實作為 "INSERT 後又跑 UPDATE"，測試抓出 StartCnt=10 被改成 SupplyCnt=20，已修正）；3) `PlayDayCnt+1`（`substr(datetime('now'),1,10)` 與 LastDate 日期比對）；4) `LoginCount+1, LastDate=now`（與 `RecordUnitLogin` 相同）。unitUID 不存在/已刪除 → false＋err（整體 ROLLBACK）。
- **GSpirit 讀回**：新增 `GetSpiritValues(unitUID)`（缺列 → `{0,0}`，非錯誤）與 `GetResurrectionStone`（測試用）；`PopulateUnitInfoFromGUnit(..., spiritValues=nullptr)` 第 5 參數——非空則 `UnitInfo.spirit=spiritValues->spirit`，空則 0（MY_UNIT_LIST/CHARACTER_LIST 路徑——原 `P_GUnit_Userinfo_GET_20131212` 亦不回傳 Spirit，忠實不填）。**spiritMax 恆 0**（SpiritTable.lua 未隨倉庫提供——與 §0a7 UnitTemplet.lua 同類缺口）。
- **`HandleSelectUnitReq`**：`RecordUnitLogin` → `ApplyUnitLoginReset`（含 1–4）；re-read 後 `GetSpiritValues` → `BuildSelectUnitNot1(..., &sv)`（1_NOT 的 UnitInfo.spirit 為最新值）。歸屬錯誤/不存在路徑不觸動 GSpirit/PlayDayCnt/LoginCount（測試斷言）。
- **`HandleCreateUnitReq`**：建立後 re-read 同時 `GetSpiritValues` → ACK 的 `kUnitInfo.spirit = StartSpirit`（§0a5 已寫入 gspirit；修掉原先硬編碼 0）；讀取失敗 → ERR_CREATE_UNIT_03（角色已建立，與原碼讀取失敗回 03 一致）。
- **未移植（誠實聲明）**：`Statistics.dbo.StatsStoneCnt` 統計（LogDB/Statistics 庫不在倉庫配置）；`SERV_ACCUMULATION_SPIRIT_SYSTEM` 變體；`gup_select_unit` 的 `GAME01.dbo.GSpirit` 跨庫前綴；`GResurrectionStoneCnt` 的 seed（倉庫無值，V2 不預置列；缺值 → spirit/石頭補充為 0）；`KUnitInfo.m_bIsSpiritUpdated`（V2 UnitInfo 無此欄位——V2 wire 自洽，非原 KUnitInfo 逐欄對齊）。
- **測試** `tests/test_select_unit_daily_reset.cpp`（41 項）：CREATE_ACK spirit（有/無 seed）、建角當日 spirit 不重置、跨日精靈重置＋Flag 歸零、無 seed → 重置為 0、復活石 INSERT StartCnt／補滿 SupplyCnt／高於 SupplyCnt 不動／無 seed → 0、PlayDayCnt 跨日 +1／同日不變、LoginCount 累加、GSpirit 缺列不炸（石頭補充仍執行）、歸屬錯誤不觸動 GSpirit/計數。
- **測試數**：**JP = 1427、TW = 1425、EU = 1423、CN = 1425、US = 1424 passed / 0 failed**。

## 0a7. 2026-11-17 附記（GetUnitTemplet／UnitTemplet.mdb 徹查＋enum 模型移植 templet 存在性閘門）

目標：`SiCXSLUnitManager()->GetUnitTemplet(iClass)` 在原碼 CREATE_UNIT 路徑的唯一用途是**存在性檢查**（無 templet → `ERR_CREATE_UNIT_03`=28；`pUnitTemplet->欄位` 從未被解引用——post-create ACK 也只用於 NULL 檢查與 StatTable/EXP 表修補）。原碼其他 9 處呼叫點同樣只做 NULL 檢查（CHARACTER_LIST_ACK×2、EGS_CREATE_NEW_UNIT_REQ、DBE_ACCOUNT_CREATE_UNIT_ACK…）。

**徹查 ScriptData/UnitTemplet.mdb（Jet4，1,839,104 B，449 頁）**——結論：**樣板期資料，無法也不該用於 2014 JP 閘門**：

- 檔案附編 VBA 宏（「select * from [Units]」＋枚舉 `AddUnitTemplet` 呼叫，Jet4 壓縮 Unicode 存放）——即當年的 **UnitTemplet.lua 產生器**；真正的執行期 templet 源是 `UnitTemplet.lua`（`GSSimLayer.cpp` 於啟動時載入），**該 lua 未隨本倉庫提供**（`git ls-tree -r HEAD` 全倉庫無 UnitTemplet.lua）。
- 表內容與 2007/2011 樣板一致：UnitClass 僅 14 列（UC_NONE／SWORDMAN／VIOLET_MAGE(誤綴 VIOLET_MAGED)／ELVEN_RANGER／ELISIS_KNIGHT + 6 個 ELISIS 進階 + ELSWORD_SWORD_EXPERT/SQUERD_LEADER + ARME_ARCH_MAGE/ARCHIMIST/ARCANE_MASTER）；UnitType 僅 UT_NONE/ELSWORD/ARME/LIRE/ELISIS（無 UT_RAVEN/UT_EVE/UT_CHUNG/UT_ARA）；WeaponType 僅 WT_NONE/GREAT_SWORD/LONG_BOW/WAND。**缺 2009 後的全部職業**：RAVEN_FIGHTER=4、EVE_NASOD=5、CHUNG_IRON_CANNON=6、ARA_MARTIAL_ARTIST=7、ELESIS_KNIGHT=8、ADD_NASOD_RULER=9 及所有 2nd 職業。
- Units 主表（23 欄，12 fixed int + 11 Jet4 壓縮 Unicode variable text）：頁0 為 Jet4 標頭（"Standard Jet DB"）、頁1 幾近空置（17 printable bytes）、Units TDef 頁 51–84 僅欄定義；**record_count 表徵異常**（access-parser 報告 1 列、variable_length 偏移 3869 < page_size，且 header variable_columns=16 ≠ 實際 11）；可見 fixed BaseStat_* = [5,6,7,8,9,9,0,9,9,9,9,9]。可解析的三張衛星表（UnitClass 14／UnitType 5／WeaponType 4）也都是樣板值。access-parser（0.0.6，本機 sys.path）在 Units 上 `StreamError(variable_length_field_offsets)`；mdbtools 不可達（可達網路僅 pypi/github/npm）。
- 即便修復解析，此檔也**不能**用於當前閘門：以它判斷存在性會把 RAVEN/EVE/CHUNG/ARA/ELESIS 全部誤判為不存在（原 2014 JP 可用職業）。

**決策（已移植）**：templet 存在性以**enum 模型**近似——「已宣告可玩職業即存在」。`UNIT_CLASS`（XSLUnit.h）依 `ServerDefine.h` 之 `#define` 集合（JP INT_INTERNAL，561 個宏）機械求值：`tools/gen_unit_classes.py` 解析 enum 段（處理 `#ifdef/#ifndef/#else/#endif`，可重設計數器），排除 UC_NONE=0／UC_MAX 哨兵 → **55 個 iClass**（1..32、100..122），產出 `src/server/UnitClassData.inc`（verify_generated.sh 納入防漂移）。

- **新模組** `UnitTemplet.{h,cpp}` 增加 `UnitTempletExists(iClass)`（查 55 成員集合）：`HandleCreateUnitReq`／ENTRY_POINT_CREATE_NEW_UNIT 依原碼順序先 templet(→ERR_CREATE_UNIT_03=28) 再 IsInitNormalJob(→1289)。測試期望值同步拆分（0/-1/33/50/99/123/200/255 → 28；10/22/31/32/100/112/121/122 → 1289；1/5/7/8/9 → NET_OK）。
- **偏差聲明**：templet 的 baseStat/unitType/weaponType 等欄位 V2 路徑**不需要**（creation ack 的 stat 由 §0v StatTable 補上；`m_kStat.m_iBaseHP` 等實際來源為 KStatTable）。模型是「存在性白名單」，不是 templet 內容；若某未來部署 templet 漏列已宣告職業，行為為「允許建立」而非原碼的 28——已發佈職業不存在此情形。templet 名稱（暱稱相似檢查）/IsFirstChangeJob（CHANGE_CLASS_SPECIFIC 專用）仍未建模。

**測試數**：**JP = 1348、TW = 1346、EU = 1344、CN = 1346、US = 1345 passed / 0 failed**。

## 0a6. 2026-11-17 附記（每日建立上限考察——原版無伺服器端閘門）

先前筆記一直記著「每日建立上限未建模（ERR_CREATE_UNIT_03/09 其他路徑）」。本輪徹查：

- 原 `gup_create_unit` proc 內的每日上限檢查（`= 4`，即 `CREATE_UNIT_MAX_NUMBER_SERVER`）**已被註解掉**——原伺服器**不攔截** CREATE_UNIT。
- `P_GUnit_CreateCNT_GET`（DBE_GET_CREATE_UNIT_TODAY_COUNT）僅供客戶端**顯示**今日已建立數（V2 §0n/§0 已移植，GET_CREATE_UNIT_TODAY_COUNT_ACK，map{0→count}）。
- 唯一真正的 4 次/日（或 `FIX_REFORM_ENTRY_POINT_CREATE_UNIT_UNLIMITED` 下 50 次/日）限制在**客戶端** `X2Lib/X2StateCreateUnit.cpp`（`TODAY_CREATE_UNIT_MAX_NUMBER_SERVER`，`#ifdef REFORM_ENTRY_POINT`，停用 Gaia/Soles 兩個按鈕——純 UI 閘門，伺服器不驗證）。
- **V2 不擋：與原版伺服器語意一致**；客戶端 UI 限制不在本伺服器重寫範圍（也不是 `SERV_*` 旗標）。`ERR_CREATE_UNIT_03`(28) 在 V2 僅保留給「建立後讀不回」的內部斷言路徑；`ERR_CREATE_UNIT_09` 未映射。

## 0. 一句話現況

V2 是原 Elsword 韓服伺服器（`X2Project`）的 **C++ 重寫地基**：平台無關的線路格式核心、安全模組已完成並以 golden bytes 測試驗證；最短網路路徑（同步 TCP + 原版 TCP 訊框 + 迴路 echo 整合測試）與 Session 層（SPI 握手換發、驗證失敗踢除、E_HEART_BEAT 丟棄、殭屍檢測、SERV_KEVENT_FROM 標記）已完成並 238 項測試全綠；**遊戲邏輯、非同步網路層未完成；資料庫層已完成 Phase 1（users 表 + 帳號存取層）**。V2 不是可運行的伺服器，不要部署它。

---

## 1. 背景：原代碼庫地圖

原始倉庫（Windows / Visual C++ 2003 時代為主，另有 2010 遷移樹）：

| 目錄 | 內容 |
|---|---|
| `KncWX2Server/` | 伺服器本體（594 個 .cpp，約 60 萬行）：`GameServer`、`LoginServer`、`ChannelServer`、`CenterServer`、`GlobalServer`、`Common/`（含 `ServerDefine.h` 4,645 行的地區/功能開關總開關）、`GameClient/` |
| `KNCSDK/` | 核心 SDK（VC7.1）：`Include/Serializer`（線路序列化）、`Include/KncSecurity`（DES / MD5 / HMAC / SecurityAssociation / SecureBuffer / SADatabase）、`Include/Thread`、Lua 5.0/5.1 |
| `KNCSDK_2010/`、`KNCSDK/Include_2010/` | VS2010 遷移版；**`KncSecurity` 的 2010 版額外多出 `Create_notRWM_Local(..., KSADatabase*)` 一整條「以共用 SA 資料庫 + 會話密鑰」加密路徑，2003 版沒有** |
| `KTDXLIB/`、`KNCSDK/KncSerialize71` 等 | 介面/共用庫；多數只留 `.vcproj` 殼 |
| `X2Lib/` | 共用庫：HShield／nProtect 反作弊（`.lib` 閉源）、IGA（Nexon）、Lua、cryptopp、UI 代碼（含 `X2UIInventory.cpp`，JP 地區條件） |
| `KncWX2Server_V2/` | **本次重寫的新代碼** |
| `DataBase/` | SQL Server 2005 腳本（`Database2/Database1/`＝帳號/GM 庫，**216 張表 / 395 個 sproc**；`Database2/Database2/`＝遊戲庫，**68 張表 / 132 個 sproc**；合計 **284 表 / 527 sproc**、外加 Security 與 Views）。`DataBase/SQL_Project/`＝SSMS 方案檔 |
| `KncTools/`、`X2*Tool/`、`ReleaseTool/` 等 | 離線工具鏈（檢查、匯出、發布） |

原始方案檔：`X2Project_2003.sln`（VC7）、`X2Project_2010.sln`（VC10）、`KncWX2Server/KncWX2Server_2003.sln`。
原始編譯定義 **`SERV_INT_INTERNAL`**（見 §7）是內部版本的代號，全倉所有 `*_2003.vcproj` 都帶著它。

## 2. V2 現有架構

```
KncWX2Server_V2/
├── KncWX2Server_V2.sln / .vcxproj / .vcxproj.filters   # VS2026 骨架（未驗證，見 §8）
├── Makefile                                             # Linux/GCC 交叉確認建置
├── src/
│   ├── core/
│   │   ├── Serializer.h      # wire 序列化（tagging 模式 + 預設非 tagging），big-endian
│   │   ├── Tags.h            # eTAG_* 列舉（與原 SerDefs.h 一致順序）
│   │   ├── SerBuffer.{h,cpp} # 緩衝區 + zlib 格式壓縮（miniz），頭 4 byte = LE 原文長度
│   │   ├── Event.{h,cpp}     # KEvent 線路結構（performerID / eventID / trace / dest / payload）
│   │   ├── EventIDs.h        # 85+ 個 PerformerID / 4,000+ EventID（tools/gen_event_ids.py 自原碼生成）
│   │   ├── UidType.{h,cpp}   # 64-bit UID 位元欄位（DEFAULT/EXTEND 兩種版式；含 codeID）
│   │   ├── Sha256.{h,cpp}    # SHA-256（FIPS 180-4）+ 常數時間比較（密碼雜湊用）
│   │   ├── ByteOrder.h       # BE 交換；主機序偵測自動化（原版只支援 LE Windows）
│   │   ├── Platform.h / Logger.h
│   │   └── Region.{h,cpp}    # 建置期地區設定（本次新增，見 §7）
│   ├── db/
│   │   ├── Sqlite.{h,cpp}    # SQLite C API RAII 封裝（參數化查詢、錯誤帶 errmsg、user_version 遷移、busy_timeout 5s）
│   │   └── UserStore.{h,cpp} # users 表：schema v1 + apply migration + UserStore（建/查/驗密/登入登出/md5→sha256 升級）
│   └── security/
│       ├── Des.{h,cpp}       # DES-CBC（8-byte key/IV）
│       ├── Md5.{h,cpp} / Hmac.h / ByteStream.h
│       ├── SecureBuffer.{h,cpp}      # 含 ICV 的安全封包（SPI + Sequence + IV + ciphertext）
│       ├── SecurityAssociation.{h,cpp}
│       └── SADatabase.{h,cpp}        # SPI 表（預設 SPI=0，見 §6）
├── src/net/
│   ├── Socket.{h,cpp}        # RAII TCP socket（POSIX/winsock2 雙後端、同步 blocking）
│   ├── PacketIO.h            # TCP 訊框：BuildFrame/ReadFrameLength/FrameAssembler（原版重組邏輯對齊）
│   └── Session.{h,cpp}       # 連線 Session 狀態機（SPI=0 握手換發、AuthFail 踢除；非 IOCP，見 §9）
├── tests/test_all.cpp        # 核心/安全模組 golden-bytes / roundtrip 測試
├── tests/test_network.cpp    # Socket / 訊框重組 / SecureBuffer 訊框往返 / 迴路 TCP echo 整合測試
├── tests/test_session.cpp    # Session：SA wire codec roundtrip / loopback 握手+加密收發 / AuthFail 上限
├── tests/test_db.cpp         # DB：SHA-256 測試向量 / migration 冪等 / 建帳號驗密 / md5 升級 / SQL 注入防護
├── tools/build_and_test.sh   # 一鍵建置+測試（Linux）
├── tools/fetch_sqlite.sh     # 從 sqlite.org 更新 SQLite（本環境網路不可達，見 §9）
├── tools/gen_event_ids.py    # EventIDs.h 產生器
└── third_party/
    ├── miniz/                # public domain deflate/inflate（zlib 線路相容）
    └── sqlite/               # SQLite 3.54.1 amalgamation（SOURCE.md 記錄來源與 SHA-256）
```

依賴方向：`tests → src/security → src/core → third_party`。核心不依賴任何 OS API（僅標準庫）；`Region.*` 之外的核心對 `_WIN32` 無感。

### 2.1 序列化：要相容什麼、不相容什麼

- 整數 / float / double 一律 **big-endian** 上線；bool 1 byte（0/1）；`std::string`：`[u32 BE 長度][bytes]`；`std::wstring`：`[u32 BE 位元組數][UTF-16LE]`；容器：`[u32 BE 個數][elements]`。
- **tagging 模式**：預設關閉（`BeginWriting(buf, tagging=false)`），與原版 `BeginWriting(buf)` 相同；開啟後每個寫入路徑多 1 byte `eTAG_*`。
- `eTAG_*` 順序與原 `SerDefs.h` 完全一致（已逐項對照）。
- `PutArray`/`GetArray` 與原版一致為**逐元素序列化**（早期 V2 草稿誤寫成 raw bytes，已修正並補測試）。
- `std::map`／`std::multimap` 的元素以 **pair** 套疊（`eTAG_PAIR` + key + value）——這是原版 `PutRange` 對 `std::pair<const K,V>` 呼叫 `Put` 的實際線路格式；早期 V2 草稿直接寫 key/value，tagging 模式下位元組不一致，已修正。
- 已補上 `std::multiset`／`std::multimap`（對應原 `SerSet.h`／`SerMap.h`），`eTAG_MULTISET`／`eTAG_MULTIMAP` 順序與原 `SerDefs.h` 一致。
- 容器 `Get` 在讀取個數 `n` 前先檢查 `n ≤ GetReadLength()`（每元素至少 1 byte），避免惡意或損毀資料宣告巨量元素導致巨量配置／OOM。
- tagging 模式 golden bytes 已以**原版 `KSerializer` 重編譯的參考實作**（`/tmp/origsdk`，BaseTypes shim）逐一機器對照，完全一致（見 §3）。
- `wchar_t` 拼字串路徑不交換位元組，統一 UTF-16LE，LE Windows 上與原版位元組一致。
- 壓縮：`mz_compress2(..., MZ_BEST_SPEED)`，與原 `compress2(level=1)` 等價；壓縮頭 = **LE 原文長度**（`SerBuffer::Compress()` 行為，含測試）。

## 3. 線路相容性驗證（目前的可信度）

驗證方法：

1. 以原 KNCSDK 原始碼為「參考實作」，在 Linux 用 shim（`DWORD`=`uint32_t` 等）重編並與 V2 比對線路位元組；
2. Python `hashlib`/`hmac`、pycryptodome DES 交叉驗證；
3. 原碼 `ePerformerID` 列舉以 Python 逐一比對 V2 生成的 `EventIDs.h`（85/85）。

現有 golden 覆蓋（`tests/test_all.cpp` + `tests/test_network.cpp` + `tests/test_session.cpp`，238 passed / 0 failed；含 ASan/UBSan 全量建置）：

- 純量集（scalars / string / wstring UTF-16LE 與代理對 / vector / map / set 的 golden bytes）；
- `Event::Serialize` 的完整線路映像（含 `dest.uids`、`trace`、empty payload；對齊原 `KEvent`）；
- DES-CBC 測試向量、MD5/HMAC-MD5（RFC 2202）、`UidType` 佈局與遮罩、`SecureBuffer` 加解密與竄改偵測；
- `PutArray`/`PutWchar`（本次修正後）及 tagging 模式位元組；
- **tagging 模式線路格式以原版 `KSerializer` 重編譯參考實作直接對拍**（`/tmp/origsdk`，VC7 原始碼 + Linux BaseTypes shim）：`map{7:70}`、`multimap{1:"a"}`、`multiset{9,4}`、`set{9,4,5}`、`vector{5,-7}`、`array{5,-7}` 的位元組**逐位元相同**。
  - `wchar_t` 特例：原版 `Put(wchar_t)` 直寫 `sizeof(wchar_t)` 位元組——Windows（2 bytes）與 V2 的 2-byte UTF-16LE 輸出一致；Linux shim（`wchar_t`=4 bytes）則為 4-byte LE，屬平台差異而非格式差異（V2 固定 2 bytes 為正確的跨平台定義）。
- ASan+UBSan（`-fsanitize=address,undefined`）全量建置後跑同一測試，無任何錯誤。

**明確不包含**：

- 真實客戶端（X2GameClient）互連——尚無任何執行階段驗證；
- 跨編譯器（MSVC）的浮點位元模式——`/fp:fast` 等會破壞相容假設，vcxproj 未設（保持預設 `/fp:precise`）；
- 壓縮在任意訊息長度上的邊界行為（miniz 與 zlib 的輸出串流在極小輸入上可能不同位元，但皆可互解）。

## 4. 資料庫：SQL Server → SQLite

使用者指示：**KncWX2Server_V2 改用 SQLite**，並採用 "SQLite 3.54"。

### 4.1 現況（誠實）

- V2 中 **SQLite 已 vendored（3.54.1）且納入編譯**（`third_party/sqlite/sqlite3.c`，`SQLITE_THREADSAFE=2 SQLITE_ENABLE_FTS5 SQLITE_ENABLE_JSON1`），且 **Phase 1 已完成**：`src/db/Sqlite.{h,cpp}`（RAII、參數化查詢、user_version 遷移、交易）與 `src/db/UserStore.{h,cpp}`（users 表 schema v1、帳號建立/查詢/驗證/登入登出、md5→sha256 原地升級），以 in-memory SQLite 完整測試（tests/test_db.cpp）。**尚無連線池**（目前同步、單連線）；game 庫（Database2：GUser/GUnit/GItem…）尚未開始。
- `SADatabase`（SPI→Key 表）目前是**純記憶體**表，不落地；原版同名類別亦然。
- 原版資料庫是 **SQL Server 2005**（SSMS 2005 方案檔），兩庫：
  - `Database1`：帳號/GM/管理工具用表（216 表，395 sproc）。例：`users`（Login/passwd/sex/…）——注意 **`passwd nvarchar(32)` 看起來是 MD5/HEX 摘要**（未實測）；`up_query_user_passwd.proc.sql` 等 sproc 內含字串比對邏輯。
  - `Database2`（遊戲庫）：`GUser` / `GUnit`（角色）/ `GItem` / `GQuests` / `GSkill`…（68 表，132 sproc）——**這是遊戲執行時直接存取的庫**。
- 合計 **284 張表**（每表一個 `dbo.<name>.table.sql`）、**527 個 sproc**。存在 `IDENTITY`、`smalldatetime`、`varbinary(200)`、計算欄位（`AS (case ...)`）、跨庫存取等 T-SQL 特性，**無法機器轉換**，只能人工重建 schema。

### 4.2 遷移策略（待執行）

1. Phase 0：vendored SQLite 3.54.1 + 建置系統接入。✅
2. Phase 1：schema 重建——`users`（帳號/登入）已完成 ✅（schema v1，PK 改 AUTOINCREMENT LoginUID + UNIQUE Login；密碼改 sha256-salt；見 §4.4）；sproc 改寫為 C++ 參數化查詢（不保留 sproc，避免 T-SQL 直譯）✅。下一步：`LoginServer` 認證需要的關聯表 + game 庫表（`GUser`→`GUnit`→`GItem`…）。
3. Phase 2：遊戲庫表（`GUser`→`GUnit`→`GItem`…）按登入 → 角色載入 → 大廳順序逐步支撐；每張表附「原 T-SQL 語意 → SQLite 對照」註記。
4. Phase 3：資料搬運工具（SQL Server → SQLite 匯出/匯入）與校驗（筆數 + 抽樣雜湊）。
5. 全程**不**在 V2 中保留 SQL Server 依賴；如需對照，只讀 `DataBase/` 原腳本。

### 4.3 SQLite 版本與來源（2026-11-16 決議：接受）

使用者要求 "SQLite 3.54"。本環境網路白名單**不含 `sqlite.org`**，PyPI/npm 上均無官方 3.54.x C 合體版（npm `sqlite-source` 封頂 3.52.0，`@sqlite.org/sqlite-wasm` 僅 WASM）。
因此 vendored 的是 **npm `better-sqlite3@13.2.0` 內嵌的官方 3.54.1 合體版**，其標頭宣告：

```
SQLITE_VERSION "3.54.1"  /  SQLITE_SCM_TAGS "release version-3.54.1"
SQLITE_SOURCE_ID "2026-10-16 14:45:20 555e07ef33f69a0957d24d8e555b702464a131d6f1607f4c3c1e4551e8e6ca76"
```

完整性以兩條獨立證據交叉驗證（見 `third_party/sqlite/SOURCE.md`）：

- rusqlite 官方綁定 `libsqlite3-sys` 的 `bindgen_bundled_version.rs` 記錄同一 `SQLITE_SOURCE_ID` 與 `release version-3.54.1`；
- GitHub code search 顯示同一 Fossil check-in 雜湊出現在 sqlcipher、fluent-bit 等正規專案。

SHA-256：`sqlite3.c` `75a4760a…8e254`、`sqlite3.h` `d6c84557…242b8c`、`sqlite3ext.h` `48963abf…2721b`。
**使用者已確認接受此來源**；待環境可連 sqlite.org 時以 `tools/fetch_sqlite.sh 3540100 2026` 換官方檔並重對 SHA-256。

### 4.4 users 表 v1 對照（機器查核遺留 DDL + 設計差異）

原：`[Login] PK CLUSTERED nvarchar(20)`、`LoginUID IDENTITY(1,1)`、`passwd nvarchar(32)`（疑似 MD5）、`firstLogin/lastConnect/lastLogin smalldatetime`、`ModeLevel varbinary(200)`、`gamePoint 預設 200` 等 DF_* 約束。

V2（`src/db/UserStore.cpp` + schema v1）：
- `LoginUID INTEGER PRIMARY KEY AUTOINCREMENT` + `Login UNIQUE COLLATE NOCASE CHECK(length(Login) BETWEEN 1 AND 20)`——`NOCASE` 是原 SQL Server CI collation 的 ASCII 近似（非 Unicode 等價）
- **密碼：`passwd_algo='sha256-salt'`**（`sha256(saltHex + ":" + password)` hex，per-user salt hex）；遷移自原庫的列保留 `passwd_algo='md5'` 仍可驗證，`UpgradePasswordIfLegacy()` 於登入成功後原地升級；**拒絕原樣照搬 MD5**（architecture §6 待辦）
- 比較一律常數時間（`ConstantTimeHexEquals`）；帳號不存在時執行一次假雜湊拉平時序
- 一律參數化查詢（`sqlite3_bind_*` + `SQLITE_TRANSIENT`）；不存在字串拼接
- 日期為 `datetime('now')`（UTC ISO8601）；`Connecting` INTEGER 0/1；`ModeLevel` BLOB 預設 `x'00'`；其餘預設與原 DF_* 一致（gamePoint 200、Grade 0、IPAddress '0.0.0.0'）
- 冪等遷移（`PRAGMA user_version`），全程單一連線、同步、無連線池

## 5. 建置系統

### 5.1 Linux（目前唯一可執行的驗證路徑）

```bash
cd KncWX2Server_V2
bash tools/build_and_test.sh        # 建置 + 238 項測試
make test                           # 同上（Makefile 路徑）
REGION=TW make test                 # 以台灣地區建置
make INTERNAL_BUILD=0 test          # 一般建置（定義 SERV_PRIVATE_IP_SERVER_NETWORKING）
```

工具鏈：GCC/G++ **12.2.0**（Debian 12）、C++17、`-fno-strict-aliasing`（DES/MD5 位元操作依賴）。
`build/` 目錄已加入 `.gitignore`。

### 5.2 Windows / Visual Studio 2026（**未驗證**）

`KncWX2Server_V2.sln`、`KncWX2Server_V2.vcxproj`、`.filters` 為**手寫骨架**：

- `<PlatformToolset>v145</PlatformToolset>`、`<LanguageStandard>stdcpplatest</LanguageStandard>`——**這是對 VS2026 的預期命名，不是任何實際安裝的工具組驗證結果**；本環境無 Windows，無法執行 MSBuild。
- 若本機未安裝 v145，IDE 開啟時 retarget 至已安裝最新 MSVC 即可（語法目前僅用 C++17 子集，無 VS2026 專屬語法）。
- Windows 差異點（已知、未驗證）：`wchar_t` = 2 bytes（Linux = 4；V2 wstring 路徑已規避）、UCRT vs glibc、`winsock2`（網路層未移植）、`_DEBUG` 巨集、警告等級 L3 + SDL。
- 依據「Linux 綠燈 = 語法/語意正確子集」的策略（使用者決議 D2，見 §11）：先以 GCC 驗證，Windows 上發現的編譯錯誤以 Linux 修復為主、Windows 僅驗證平台差異。

### 5.3 依賴取捨

| 函式庫 | 原版 | V2 | 原因 |
|---|---|---|---|
| zlib | `compress2/uncompress`（level=1） | **miniz**（public domain，`mz_compress2(…, MZ_BEST_SPEED)`） | 減少 Windows 依賴；zlib 格式線路相容，已測試 roundtrip |
| boost | 原序列化測試用（TestSerializer） | 不採用 | 標準庫足夠；避免大型依賴 |
| cryptopp | `X2Lib/cryptopp`（AES?） | 不引入 | 協議相容只需 DES/MD5/HMAC-MD5；現代加密請見 §6 |
| Lua | 5.0/5.1 雙軌（`KncLua71`、`luajitLib`） | 暫不移植 | 腳本層屬後續階段 |

## 6. 安全性評估（原版相容層）

V2 目前**原樣保留**協議所需的密碼學直譯，這些本身**不符合現代安全標準**，是「與原 client 相容」的必要條件，不是推薦方案：

1. **DES-CBC**（56-bit 金鑰）——暴力破解成本已低；若未來 client 升級，應遷移至 AES-256-GCM 或 ChaCha20-Poly1305。
2. **HMAC-MD5**——碰撞/前像攻擊已不安全；建議遷移 HMAC-SHA-256。
3. **SecurityAssociation 預設 SPI=0 固定金鑰**（`SADatabase` 建構時註冊 `SecurityAssociation{}`）——知道協議的人都能推導金鑰；生產部署**必須**在啟動時 `CreateNewSA()` 並以安全通道將 SPI 下發 client（原版流程亦然）。V2 尚未實作該下發流程。
4. **SecureBuffer ICV**：MD5-based；竄改偵測有效（已測試），完整性強度不足。
5. **2010 版 SecureBuffer 的 `…_Local(..., KSADatabase*)` 路徑未移植**（每會話 SA + 共用 SADatabase）。這是已知的缺口——登入握手階段的會話密鑰建立尚無 V2 對應物。
6. ~~原版 `users.passwd nvarchar(32)` MD5~~：V2 已改為 salted SHA-256（`passwd_algo` 欄；見 §4.4），常數時間比較。**注意：salted SHA-256 仍非 Argon2/bcrypt**——上線前應再遷移一次至 Argon2id（需引入第三方庫或 `tools/` 重寫）；目前的設計（`passwd_algo` 分派）允許再次無痛平移。

## 7. 地區設定與 SERV_INT_INTERNAL 發現

### 7.1 原碼事實（機器查核）

`KncWX2Server/Common/ServerDefine.h:4570` 起：

```c
#ifdef SERV_INT_INTERNAL          // 「內部版本」開關（所有 *_2003.vcproj 都定義）
//#define SERV_COUNTRY_EU/US/TW/HK/CN/TH/ID/BR/PH ...
#define SERV_COUNTRY_JP           // ← 內部版本預設鎖定日本
#undef SERV_TIME_DROP_MONSTER_EVENT
#undef SERV_TIME_OPEN_RANDOM_ITEM_EVENT
#undef SERV_BUY_CASH_ITEM_LOG
#undef SERV_PRIVATE_IP_SERVER_NETWORKING   // 內部版本不定義 private-IP 模式
#endif //SERV_INT_INTERNAL
```

全倉 14+ 檔案有 `#ifdef SERV_COUNTRY_JP` 分支（例：`ChannelServer/ChannelUserAuth_JP.cpp`、`GameServer/Inventory.cpp`、`Common/X2Data/XSLItem.h`、`X2Lib/X2UIInventory.cpp`、`LoginServer/*`、`SimLayer.*`、`GSGameDBThread.cpp`）。**這些是遊戲規則層的地區差異（登入認證、背包/物品、商城、日誌），V2 尚未移植任何一個**。

### 7.2 V2 決議（使用者 2026-11-16 裁定：建置期設定、保留全部地區）

`src/core/Region.{h,cpp}` 提供：

- 編譯定義 `-DX2_REGION_{EU,US,TW,HK,JP,CN,TH,ID,BR,PH}` **擇一**（多定義 → `#error` fail fast）；
- 未指定 → **預設 `JP`**（= 原內部版本行為）；
- `X2_INTERNAL_BUILD`（預設 **1**）：1 = 不定義 `SERV_PRIVATE_IP_SERVER_NETWORKING`（對齊內部版本）；0 = 定義（對齊一般建置）；
- `SERV_COUNTRY_*`／`SERV_COUNTRY_TWHK` 相容巨集——未來移植含舊 `#ifdef` 的檔案時**不必改寫**；
- `x2::CurrentRegion()` / `RegionCode()`（"JP"…）/ `RegionNameZhTW()`（"日本"…）；
- `make REGION=TW`、`make INTERNAL_BUILD=0`、`REGION=… X2_INTERNAL_BUILD=… bash tools/build_and_test.sh` 均可切換；
- 測試 `TestRegion()` 驗證預設地區=JP、zhTW 名稱、內部版本下無 `SERV_PRIVATE_IP_SERVER_NETWORKING`。

**限制**：V2 目前沒有任何地區相關的遊戲代碼，此開關現在只影響巨集與 `x2::CurrentRegion()`；它是為之後移植 JP 路徑準備的管道，不是已完成的功能。

## 8. VS2026 / C++26 現況（誠實聲明）

- 本開發環境為 Linux x86_64；**無法編譯、連結或執行 Windows 產物**。
- `.sln/.vcxproj` 手寫；XML well-formed（以 `xml.dom.minidom` 解析驗證），GUID 為固定值；**未經 MSBuild 實測**；`v145`／`stdcpplatest` 為對 VS2026 的預期命名，實際以本機安裝為準（開啟時 retarget 即可）。
- 代碼標準：**目前只使用 C++17 子集**。使用者指示的「C++26」目標，在 Linux GCC 12.2 下只能以 `-std=c++2b/c++23` 局部嘗試、且無 MSVC 對照，**未採用**；等 Windows 端可用後，再評估 reflection、`std::execution`、契約等支援情況後逐步引入，並以 `/std:c++latest` 編譯。**不要在 V2 現有代碼中使用 C++26 專屬語法**。
- 64-bit only：UID 位元欄位、buffer 長度全部以固定寬度型別處理；32-bit 不支援、不測試。

## 9. 網路與執行時（最短路徑已完成原型；IOCP/epoll 未開始）

原版網路層（`KncWX2Server/Common/NetLayer.*`、`Socket/Accepter.*`、`Socket/SocketObject.*`、`Socket/Session.*`）為 **Windows IOCP 綁定**。V2 已完成：

- **原版 TCP 訊框格式**（機器查核自 `KSkSession::OnRecvCompleted`）：`[u16 LE frameLen（含自身 2 bytes）][frameLen-2 bytes KSecureBuffer]`，`frameLen` 宣告超過 `MAX_PACKET_SIZE`（32768）視為協議錯誤——與原 `SERV_CHECK_RECV_BUFFER_FULL` 路徑一致踢除。
- **`src/net/PacketIO.h`**：`BuildFrame`（u16 LE 長度頭 + payload）、`ReadFrameLength`、`FrameAssembler`（任意切塊位元組流重組；`frameLen < 2` 或 `> 32768` → `TooLarge` 並鎖存溢位；逐位元組揋入測試通過）。
- **`src/net/Socket.{h,cpp}`**：RAII TCP socket（POSIX/winsock2 雙後端）：`CreateTcp/Bind/Listen/Accept/Connect/SendAll/Recv/SetReuseAddr/SetNoDelay/SetRecvTimeout/LocalPort`；Windows 需 `WsaGuard`（WSAStartup/WSACleanup 守衛）。
- **整合測試（`tests/test_network.cpp`）**：spawn 背景 thread 做 loopback TCP echo server（SPI=0 預設 SA 加密），client 加密送出 → server 解密 → server 加密回覆 → client 解密比對 payload，全程經過原版 TCP 訊框 + SecureBuffer 雙重封裝；**測試實測通過（含 ASan/UBSan 全量建置）**。
- **Session 層（`src/net/Session.{h,cpp}`）**：狀態機 `Closed → Connected → Secured`；acceptor 於接受連線後建立隨機金鑰 SA，以 SPI=0 加密送出 `E_ACCEPT_CONNECTION_NOT`（payload = `[u16 BE SPI][SecurityAssociation]`，與原 `OnAcceptConnection` 一致），此後雙方以自己的 SPI 收發（接收端忽略封包頭 SPI——對應原 `IsValidSPIndex` 使用 session 的 `m_nSPIndex`）；client 收到握手後以**自己的隨機 SPI** 存入 SADB（對應原 `KSADatabase::Insert(OUT spi, kSA)` 擲骰覆寫 OUT 參數的行為）。
  - ICV 驗證失敗計數 `authFailCount`，達 `authFailLimit`（預設 5，對應原 `PacketAuthFailLimit`）即回 `AuthFailed` 並斷線；上限以內靜默跳過該訊框。
  - 序號檢查預設關閉（對應原 `m_bCheckSequenceNum = false`）；封包頭 SPI 不入表。
  - `SecurityAssociation` 的 wire codec（`Put/GetSecurityAssociation`）以長度前綴 ByteStream + u32BE 與原 `KByteStream` 非 tagging 模式位元組一致。
  - **Windows 專屬路徑未測**：winsock 後端碼路徑與 POSIX 對稱，但本環境無 Windows 可實測。
- **整合測試（`tests/test_session.cpp`）**：SA wire codec roundtrip（金鑰/金鑰行為等價）；loopback 完整握手 + 加密 ping/pong；limit=1 → `AuthFailed` 斷線；預設 limit → 跳過 2 個損毀訊框後 `Timeout`，計數==2；E_HEART_BEAT 接收即丟棄（`stats.heartbeats` 計數）；任一成功解析的封包續期 `m_lastRecvTick`，啟用心跳檢查且超過 60s 無封包（`SetZombieTimeout`）→ 關閉連線並回 `RecvResult::ZombieKicked`（對應原 `m_bCheckHBTick` + 殭屍切斷）；`SetClientFacing(true)`（對應 `SERV_KEVENT_FROM` 的 `SST_CLIENT`）會將接收事件標記 `EFT_CLIENT`，上層可用 `Event::IsValidEventID()` 拒絕伺服器內部事件 ID（原 `CheckIsValidPacketEvent`）；`SendHeartbeat()` 供代理角色每 15s 心跳發送使用。**164 項測試全綠，含 ASan/UBSan**。

**尚未開始**：IOCP/epoll 非同步後端（目前為同步 blocking + thread）；LS→GS 內部通道；proxy 角色宏（`UNPROXY_ONLY`/`PROXY_ONLY`）與代理 15s 心跳**迴圈**（`SendHeartbeat` 已提供，上層定時器驅動未移植）；`SERV_KEVENT_FROM` 的 `SST_SERVER` 等其他角色標記（目前僅 `EFT_CLIENT`）；SA 序號/重放窗口的 bit-window 驗證（V2 僅實作 not-RWM 模式）。

下一個里程碑：

1. IOCP/epoll 後端（保持 `Socket` API 不變，加入非同步讀寫迴圈）；
2. LoginServer／ChannelServer／GameServer 的「連線 → 認證 → 登入 → 進場」最短路徑移植；
3. `KSADatabase::…_Local`（2010 專有，每會話 SA + 共用 SADatabase）路徑評估。

## 10. 測試與品質

- 執行：`bash tools/build_and_test.sh`；輸出 `238 passed, 0 failed`（2026-11-16 實測，含 ASan/UBSan 變體；loopback 整合測試以 127.0.0.1 實際 TCP 往返驗證；DB 測試全部以 `:memory:` SQLite 執行）。
- 無 TSAN 基線；`-Wall -Wextra` 無新增警告（miniz/sqlite 第三方不在此列）。
- 測試大部分為單進程；網路測試只走 loopback，不需外部服務；無 DB 實體（V2 尚無 DB 層）。

## 11. 決策記錄（ADR-lite）

| # | 決議 | 決定者/日期 |
|---|---|---|
| D1 | 地區做成**建置期設定**（全部地區保留，預設 JP），`X2_INTERNAL_BUILD` 對齊內部版本 | 使用者，2026-11-16 |
| D2 | **Linux/GCC 交叉確認建置**作為唯一可執行驗證；VS2026 vcxproj 為未驗證骨架；代碼先用 C++17 子集 | 使用者，2026-11-16 |
| D3 | SQLite **3.54.1** 採納 npm better-sqlite3@13.2.0 內嵌合體版（官方取得受限），保留並記錄 SHA-256；可連 sqlite.org 時改官方檔 | 使用者，2026-11-16 |
| D4 | 本次（2014-03 07 原始提交後的 V2 補齊）**直接提交**到分支 `arena/e7573545-source-2014-03` | 使用者，2026-11-16 |
| D5 | KncWX2Server_V2 使用 **SQLite** 取代 SQL Server（原始指示）；sproc **不**直譯，改寫為參數化查詢 | 原始任務指示 |
| D6 | 依賴以 miniz 取代 zlib；不引入 boost | 本專案先前決議 |

## 12. 未完成清單（顯式）

1. 非同步網路層（IOCP/epoll）；`…_Local(KSADatabase*)` 會話金鑰路徑（2010 專有）；`SST_SERVER` 來源標記；代理 15s 心跳迴圈；SA bit-window 驗證。（同步 TCP 訊框原型與 Session 層已完成，見 §9。）
2. 帳號驗證（含 JP 專屬 `ChannelUserAuth_JP`）、密碼雜湊遷移（禁明文 MD5）。→ 已有**開發替代品**（LoginArbiter，loopback 綠），正式出版商認證端點 RPC 未實作。
3. 284 張表 / 527 sproc → SQLite schema 與參數化查詢的逐步重建（users ✅；game 庫 guser/gunit/暱稱歷史 ✅ + GameStore 存取層 + 單元測試；其餘表未開始）。
4. 遊戲邏輯（GS/LS/CS/CenterServer）全部未移植；Lua 腳本層未移植。（UnitTemplet.lua 未隨倉庫提供——templet 存在性閘門 §0a7 以 enum 模型近似；真正的 templet 內容/名稱檢查/IsFirstChangeJob 不可移植。）
5. Windows 實機建置、安裝/升級路徑、符號伺服器、CI。
6. 效能與容量測試；記憶體/句柄洩漏基線（原版以 VLD 除錯，V2 無對應）。
7. `LoadINIFile`、設定檔格式與部署工具（原 `ReleaseTool`/`.bat` 流程）。
8. EventIDs 以外的大型表（道具/技能/副本資料）從 `X2/dat/Script` 的轉換管道。
9. `SELECT_UNIT` 的 REQ/收尾 ACK + 決策層已完成（§0c）；`SELECT_UNIT_1_NOT` codec + 組裝（gunit 表 → Not1，缺資料項佔位；背包 slot size/items/equippedItem 自 §0a14 ← gitem/giteminventorysize；復活石量 ← gresurrectionstone）已完成（§0e）；`SELECT_UNIT_2_NOT` codec + 組裝（§0f；任務讀回自 §0a11 ← gquests/gquests_complete/gquests_repeat）已完成（§0f）；`SELECT_UNIT_3_NOT` codec + 組裝（§0g；title/mission 讀回自 §0a12 ← gtitle_complete/gtitle_mission；pet 仍空佔位）已完成（§0g）；`SELECT_UNIT_4_NOT` codec + 組裝（Henir/Messenger/戰場狀態無資料源→空容器/零值佔位；kDenyOptions ← gdenyoption（§0a9）；vecChatBlackList ← gblacklist、vecTutorialDBUnitInfo ← gtutor（≤10 級＝學生／≥20 級＝老師）、vecConnectTimeEvent ← gis30min，§0a13）已完成（§0h）；`SELECT_UNIT_5_NOT` codec + 組裝（spirit/pshop/henir-reward/cashshop 無資料源→false/0 佔位）已完成（§0i），1_NOT…5_NOT 全數落地；1_NOT…5_NOT 分片 codec 全數移植（§0e…0i）；完整角色資料載入管線逐步推進（技能頁載入自 §0a23 起落地；技能欄位變更 EGS_CHANGE_SKILL_SLOT_REQ 已於 §0a24 移植（write-through）；技能學習/升級（EGS_GET_SKILL_REQ，依賴 SkillTemplet/CalcLevelUpIncreaseSkillPoint，Lua 未隨倉庫提供）；EGS_RESET_SKILL_REQ（消耗重置道具退還 SP/CSP，§0a25，write-through）已完成）。Login 切片打通到 SELECT_UNIT_1_NOT 為止（items/寵物/ED/rating 等無資料來源，值為佔位；spirit 自 GSpirit 讀回，§0a8；任務自 §0a11 起讀 gquests/gquests_complete/gquests_repeat；稱號/稱號任務自 §0a12 起讀 gtitle_complete/gtitle_mission；黑名單/師徒/30 分鐘事件自 §0a13 起讀 gblacklist/gtutor/gis30min）。
11. GDenyOption／GResurrectionStoneCnt／GSkill／GSkillSlot／GSpirit／GQuests——**建立流程副作用已移植（§0a5）；GSpirit 讀回與 gup_select_unit 每日重置／GResurrectionStone 每日補充／PlayDayCnt／LoginCount 登入副作用已移植（§0a8）**；其餘查詢/更新路徑（gup_get_community_opt_unituid——V2 改以 gdenyoption 直接讀回近似，§0a9；EGS_UPDATE_COMMUNITY_OPT 6 欄寫入（§0a10 write-through；P_GDenyOption_UPD 缺 proc，以 upsert 近似）已移植；gup_*_skill 之讀路徑（SELECT_UNIT 技能段）已於 §0a23 移植（v14 schema v14 反推），寫路徑（EGS_CHANGE_SKILL_SLOT_REQ/ACK §0a24 已移植，write-through）；EGS_GET_SKILL_REQ 未實作（EGS_RESET_SKILL_REQ 已於 §0a25 完成）；gspirit Flag 語意變體）未實作；建角道具發放（gup_create_unit_set_promotion／P_GItemPeriod_INS，**不隨倉庫提供**）不可移植。
10. Wire 相容：Login 切片 codec 只有自洽 golden bytes，**缺原 SDK 實機對照向量**（見 §13）。

## 13. 風險

- **Wire 相容僅限測試向量**：任何原版讀者/寫者未被重編對照測試覆蓋的路徑，都可能藏有位元組級差異；接入真實 client 前必須跑互通測試。
- **協議中的「負長度」/對齊慣例**：原版部分結構以 `#pragma pack` 混合；V2 目前無此類結構（ Event/SerBuffer 已驗證），移植新結構時須逐一確認。
- **預設金鑰**：若有人按目前狀態部署，所有連線皆可被動解密（§6）。
- **SQLite 來源**：非官方下載通道；已做雙重交叉驗證，但供應鏈風險只能以 `tools/fetch_sqlite.sh` 回官方後根絕。
- **地區預設 JP**：未指定 `REGION` 的建置會是 JP；台灣/香港部署時務必顯式 `-DX2_REGION_TW`（或 HK）。

---

**審核重點（請您過目）**：

1. §7.2 的地區機制是否符合您的預期（特別是預設 JP 與 `X2_INTERNAL_BUILD` 的預設值）；
2. §4.3 SQLite 來源的接受範圍（僅本專案 vendored，不外流）；
3. §8 的「C++26 暫不採用」是否需要改成「GCC 12 可用的最強特性集」；
4. §12 清單的優先序——下一步應先做 IOCP/epoll 非同步後端（並維持 `Socket` API），還是先移植 LoginServer 最短路徑，或先動資料庫層。

### §0a31 背包擴充 ED 報價（唯讀）

- 對照原版 `GSUserInventory.cpp` 的 `EGS_GET_NEXT_INVENTORY_ED_REQ/ACK`（1145/1146），REQ 無欄位，ACK 為 `iOK, iED`。先對裝備、飾品、材料、特殊、任務、快捷六分類檢查是否均可增加 8 格，再以裝備已擴充格數除以 8 決定下一階；`EDInventoryExpand.lua` 階段 1–4 依序為 5M、10M、24M、75M ED。容量不足回 1356，沒有正值報價回 1357。
- 依 `Inventory.cpp` 的啟用巨集還原各地區基礎格數：TW/HK 一般分類 16，其餘 24；特殊分類 TW/HK/CN/TH/US/PH 為 24，其餘 V2 支援地區為 32；六分類上限皆為 56。已擴充格數由 V2 現有 `GetInventorySlotSize` 讀取；其重複列加總偏差見 §0a14。容量檢查優先於費用查詢，因此某些地區可能在查到表格全部階段之前就達上限。
- 偏差：V2 固定內建目前倉庫 Lua 費用，不載入可變的伺服器資源；使用 DB 持久化快照而非原版在線記憶體狀態，且尚未實作 Field/Room 狀態檢查。缺失、刪除角色或 DB 錯誤回 `ERR_ODBC_01`。此切片不扣 ED、不擴充或寫入背包，也不等同完成購買流程。
- 驗收：五地區建置及測試 JP 2383、TW 2381、EU 2379、CN 2381、US 2380 passed / 0 failed；涵蓋封包 golden bytes、四階費用、六分類容量限制、地區差異、錯誤與 DB 失敗。

### §0a32 個人倉庫擴充 ED 報價（唯讀）

- 對照 `GSUserInventory.cpp` 的 `EGS_GET_NEXT_BANK_ED_REQ/ACK`（1141/1142），REQ 無欄位，ACK 為 `iOK, iED`。`ST_BANK` 為類別 8；原版以基本 8 格加 DB 擴充格數形成會員等級，無效等級在 `Inventory::Init` 重設為 8 格。依 `EDInventoryExpand.lua`，從 8、16、24、32、40 格升至下一等級所需 ED 為 4M、8M、18M、54M、65M。
- 保留原版特殊行為：handler 將目前等級（最大 48）誤與白金會員**物品 ID** `CI_BANK_MEMBERSHIP_PLATINUM`（213500）比較，故 48 格不會進入 `_02`，而是取下一等級 `MPB_NONE`、找不到費用並回 `ERR_EXPAND_INVENTORY_ED_03`（1357）。V2 按此實際行為回 `_03`，不將疑似 bug 當成設計意圖改寫。
- 偏差：固定使用倉庫 Lua 中的費用，未載入可變資源；使用 DB 快照而非在線記憶體，且未實作 Field/Room 狀態檢查。重複 DB 列依現有 V2 加總語義（§0a14）處理；角色不存在、已刪除及 DB 讀取失敗映射 `ERR_ODBC_01`。報價不扣款、不修改倉庫，不包含購買流程。
- 驗收：JP 2413、TW 2411、EU 2409、CN 2411、US 2410 passed / 0 failed；涵蓋 wire golden bytes、各會員等級、滿級、無效等級回復及 DB 錯誤。
