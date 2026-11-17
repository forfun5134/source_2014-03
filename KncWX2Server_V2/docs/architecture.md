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

`src/db/GameStore.{h,cpp}`、`tests/test_game_store.cpp` 新增：game DB（對應原 Database2）的 `guser`／`gunit`／`gunit_nickname`／`gdeleted_nickname_history` 四表 schema（v1，`Deleted` 生成欄、partial index）+ 存取層：`GetOrCreateGUser`（對應 gup_get_user_info，USSize=50）、`CreateUnit`（對應 gup_create_unit：usSize 上限／暱稱唯一／14 天刪除冷卻／事務化插入 gunit+gunit_nickname，LastPosition=20000、SPoint=1）、`ListUnitsByUserUID`／`GetUnitByUID`（JOIN 暱稱）、`SoftDeleteUnit`（DelDate=now + 釋放暱稱 NULL + 寫入冷卻歷史，事務化、冪等）、`RecordUnitLogin`。

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

**組裝路徑**：`BuildSelectUnitNot1(userUID, authLevel, GUnitRecord, out)`（UnitSelectArbiter）由 V2 game DB 的 gunit 表組裝——level/exp/win/lose/stat/lastPos.mapID(←lastPosition)/nickname/regDate/lastDate 有真實資料源；**items/inventorySlotSize/dungeonClear/tcClear/spirit/rating/ED/resStone/skillPages 無對應表，一律填空容器/0/單一全預設技能頁（pages=1/1，與 KUnitSkillData 一致），這些值不代表角色實際狀態，不得當真**。`HandleSelectUnitReq` 成功路徑新增 outNot1/authLevel 參數（二級密碼閘門之後）。迴路整合測試：server 端成功時**先送 1_NOT(42) 再送收尾 ACK**（對齊原 `SendSelectUnitACK` 次序），client 端先收 1_NOT 再收 ACK。測試自 524 → **557 passed / 0 failed**（新增 Not1 codec golden roundtrip + gunit→Not1 建構 + 迴路 1_NOT 順序斷言）。

⚠ 誠實聲明：golden bytes 為自洽佈局，**未對原 SDK 實機驗證**；SELECT_UNIT 1_NOT…5_NOT 分片皆已移植（§0e…§0i）；**完整角色資料載入管線與 2_NOT…5_NOT 佔位內容替換為真實 DB 資料未開始**；1_NOT 中無資料來源的欄位全為佔位值（見上）；更換巨集組合佈局即變。

## 0f. 2026-11-17 快照（SELECT_UNIT_2_NOT 移植）

**UnitData 擴充**：`SubQuestInstance`（int iID / UCHAR ucClearData / bool bIsSuccess）、`QuestInstance`（int iID / UidType ownerUnitUID / vector<SubQuestInstance>）、`CompleteQuestInfo`（int questID / int completeCount / __int64 completeDate，SERV_DAILY_QUEST）——對應原 KSubQuestInstance/KQuestInstance/KCompleteQuestInfo（CommonPacket.cpp 機讀 PUT 順序）。

**SelectUnitNot2**（`SelectUnitProtocol.{h,cpp}`，事件 ID 43）：`int32 iOK → vector<QuestInstance> vecQuest → (SERV_DAILY_QUEST) vector<CompleteQuestInfo> vecCompletQuest → (SERV_RANDOM_DAY_QUEST) map<int32,int32> mapRandomQuestList`。Put 順序機讀自 CommonPacket.cpp `KEGS_SELECT_UNIT_2_NOT`。JP 巨集核對（寬鬆樣式）：SERV_DAILY_QUEST:236、SERV_RANDOM_DAY_QUEST:1291 已定義。

**組裝**：`BuildSelectUnitNot2(out)`——V2 game DB 無任務/日常任務/隨機日常任務表，容器一律空（不代表角色真實任務狀態）。迴路：server 成功時**先 1_NOT、再 2_NOT、再收尾 ACK**（對齊原 `SendSelectUnitACK` 次序）；client 按序收取斷言。測試自 557 → **572 passed / 0 failed**。

⚠ 誠實聲明：golden bytes 為自洽佈局，**未對原 SDK 實機驗證**；SELECT_UNIT **3_NOT…5_NOT 未移植**；2_NOT 容器為空佔位（見上）。

## 0g. 2026-11-17 快照（SELECT_UNIT_3_NOT 移植）

**UnitData 擴充**：`SubMissionInstance`（int iID / short sClearData / bool bIsSuccess）、`MissionInstance`（int iID / vector<SubMissionInstance>）、`TitleInfo`（int iTitleID / wstr wstrEndDate / __int64 kCTime / bool bInfinity）、`PetInfo`（UidType iPetUID / int iPetID〔SERV_PETID_DATA_TYPE_CHANGE〕/ wstr petName / char cEvolutionStep / short sSatiety / int iIntimacy / short sExtroversion / short sEmotion / bool bAutoFeed / wstr lastFeed·lastSummon·regDate / bool bAutoLooting〔SERV_PET_AUTO_LOOTING〕）——對應原 KSubMissionInstance/KMissionInstance/KTitleInfo/KPetInfo（CommonPacket.cpp 機讀）。JP 巨集核對（寬鬆樣式）：SERV_PET_SYSTEM:460、SERV_PETID_DATA_TYPE_CHANGE:3891、SERV_PET_AUTO_LOOTING:2342 已定義；SERV_EVENT_PET_INVENTORY/FREE_AUTO_LOOTING/PERIOD_PET 未定義。

**SelectUnitNot3**（`SelectUnitProtocol.{h,cpp}`，事件 ID 44）：`int32 iOK → vector<MissionInstance> → vector<TitleInfo> → (SERV_PET_SYSTEM) int64 iSummonedPetUID → vector<PetInfo> → vector<int64> vecCanEvolutionPetList → vector<int64> vecNeverSummonPetList → (SERV_PET_SYSTEM) map<int64, map<int64, InventoryItemInfo>> mapPetItem`。Put 順序機讀自 CommonPacket.cpp `KEGS_SELECT_UNIT_3_NOT`。嵌套 map 走 WireHelpers 內層 PutCountPrefixMap。

**組裝**：`BuildSelectUnitNot3(out)`——V2 game DB 無 mission/title/pet/petItem 表，容器空、iSummonedPetUID=0（誠實佔位）。迴路：server 成功時**1_NOT → 2_NOT → 3_NOT → 收尾 ACK**；client 按序斷言。測試自 572 → **590 passed / 0 failed**。

⚠ 誠實聲明：golden bytes 為自洽佈局，**未對原 SDK 實機驗證**；SELECT_UNIT **4_NOT…5_NOT 未移植**；3_NOT 容器為空佔位（見上）。

## 0h. 2026-11-17 快照（SELECT_UNIT_4_NOT 移植）

**UnitData 擴充**：`ChatBlackListUnit`、`DenyOptions`（SERV_RELATIONSHIP_SYSTEM 下 6×char）、`TutorialUnitInfo`、`TutorialDBUnitInfo`、`ConnectTimeEventInfo`（SERV_ACC_TIME_EVENT）、`CumulativeTimeEventInfo`（CUMULATIVE_TIME_EVENT + SERV_ACC_TIME_EVENT）、`HenirRankingInfo`（UINT m_ulPlayTime 以 uint32_t 序列化＝wire 4 bytes；SERV_HENIR_RENEWAL_2013 未定義 → 無 bytePlayStartedUserNum）、`FriendInfo`、`FriendMessageInfo`、`MessengerInfo`（map<int64,FriendInfo> + map<char,wstr> + vec<FriendMessageInfo>）、`GamePlayStatus`（含 set<int> m_mapPetMP，依 SDK SerSet＝計數+元素；SERV_RIDING_PET_SYSTM 已定義 → mapRidingPetCoolTime 在線）、`GamePlayStatusContainer`。Put 順序機讀自 CommonPacket.cpp。

**SelectUnitNot4**（`SelectUnitProtocol.{h,cpp}`，事件 ID 45）：`int32 iOK → vecChatBlackList → kDenyOptions → bool bIsRecommend → int64 iRecommendUnitUID → vecTutorialDBUnitInfo → vecConnectTimeEvent → vecCumulativeTimeEvent → vecHenirRanking → kMessengerInfo → kGamePlayStatus`。JP 巨集核對（寬鬆樣式）：SERV_RELATIONSHIP_SYSTEM:3643、SERV_ACC_TIME_EVENT:288、CUMULATIVE_TIME_EVENT:101、SERV_BATTLE_FIELD_SYSTEM:2768、SERV_RIDING_PET_SYSTM:2523 已定義；SERV_RECRUIT_EVENT_BASE、SERV_ARCHUANGEL_S_COIN_EVENT_GUIDE、SERV_HENIR_RENEWAL_2013 未定義。

**組裝**：`BuildSelectUnitNot4(out)`——V2 無黑名單/拒絕選項/教學/連線時間/Henir/好友/戰場狀態表，全預設/空（誠實佔位；不代表角色真實狀態）。迴路：server **1_NOT → 2_NOT → 3_NOT → 4_NOT → 收尾 ACK**；client 按序斷言。測試自 590 → **610 passed / 0 failed**。

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

**決策層** `HandleMyUnitAndInventoryInfoListReq(gameDb, userUID, userID, authLevel, ack, err)`（UnitSelectArbiter）：guser 以 GetOrCreateGUser 取/建（USSize=50）→ `ListUnitsByUserUID`（Deleted=0、UnitUID 升序）→ 每個角色以 `PopulateUnitInfoFromGUnit`（**自 BuildSelectUnitNot1 抽取的共用填值函式**，UnitData/SelectUnit 行為不變）填 KUnitInfo；ack.iOK=NET_OK。原版對每個角色衍生 level/nowEXP/nextEXP（EXP 表）、疊加職業/等級 stat（stat 表）、填 P2P IP/port——**V2 無 EXP 表/stat 表/P2P，沿用 gunit 儲存值、IP/port 填空**（誠實偏差）；原版 S_SERVER_SELECT 狀態閘門與二級密碼前置未建模。DB 失敗 → false（呼叫端可回 ERR_SELECT_UNIT_05）。

**迴路**（雙庫 mkstemp）：CONNECT → VERIFY → **MY_UNIT_LIST REQ → ACK（iOK=NET_OK、nUnitSlot=50、含種子角色「選擇切片」）** → SELECT_UNIT（own）→ 5×NOT → ACK → GET_MY_INVENTORY（合成背包）→ SELECT_UNIT（foreign → ERR_SELECT_UNIT_07）→ SELECT_UNIT（ghost → ERR_SELECT_UNIT_00）。**附帶修正：迴路伺服器事件迴圈上限 6→7**（新增 MY_UNIT_LIST 後原本 6 個事件不夠，ghost 被吃掉；曾以 stdbuf 追出）。另有 `tests/test_unit_list.cpp`（codec roundtrip、guser 自建、ListUnits 過濾其他使用者、空帳號 USSize=50）。測試自 654 → **685 passed / 0 failed**。vcxproj 登記 UnitListProtocol.{h,cpp}。

⚠ 誠實聲明：wire 佈局為自洽 golden bytes，**未對原 SDK 實機驗證**；角色衍生欄位（EXP→level、stat 表疊加、P2P）為佔位/沿用儲存值；nUnitSlot 來自 V2 guser（USSize=50 慣例）；MY_UNIT_LIST 之前的 S_SERVER_SELECT 狀態閘門未建模。

## 0l. 2026-11-17 快照（CREATE_UNIT 流程移植）

**NetError**：補 `ERR_CREATE_UNIT_00…09 = 25…34`（沿用 V2 原檔既有註解數值，與 SELECT_UNIT_00=35 銜接一致；ERR_CREATE_UNIT_10/11 數值未以編譯實測，**故不添加、勿推算**）。

**新增模組** `src/server/CreateUnitProtocol.{h,cpp}`（命名空間 `x2::create_unit`）：`CreateUnitReq`（EGS_CREATE_UNIT_REQ=36；{wstrNickName, int iClass}，PUT 順序機讀自原 ClientPacket.cpp）、`CreateUnitAck`（37；{int iOK, KUnitInfo, vector<int> vecSkillSlot, wstr wstrEnableDate}；SERV_GUARANTEE_UNIQUENESS_OF_NAME_CN 未定義 → 無額外欄位）。

**決策層** `HandleCreateUnitReq(gameDb, userUID, authLevel, req, ack, err)`（UnitSelectArbiter）：暱稱 UTF-8 位元組數 1..12（>12 或空 → ERR_CREATE_UNIT_04=29；JP 未定義 SERV_NICK_NAME_MINIMUM_CHECK → 無最小長度）；含 KODBC 注入標記（`;` `'` `"` `--` `/*` `*/` `\`）→ ERR_CREATE_UNIT_08=33；`GameStore::CreateUnit` 結果映射：Ok→NET_OK、UserNotFoundOrDeleted→ERR_CREATE_UNIT_00=25、NicknameTaken→ERR_CREATE_UNIT_01=26、CapacityReached→ERR_CREATE_UNIT_05=30、NicknameInCooldown→ERR_CREATE_UNIT_06=31、DbError→ERR_CREATE_UNIT_02=27；成功後重讀角色，`kUnitInfo ← PopulateUnitInfoFromGUnit`；**vecSkillSlot / wstrEnableDate 原由 AccountDB（DBE_ACCOUNT_CREATE_UNIT_*）填寫，V2 一律空**（誠實佔位）。

⚠ 誠實偏差：無職業 templet 表（iClass 由 GameStore tinyint 範圍把關）、無字串過濾器/PVP NPC 名檢查/每日建立上限、原版兩段式（DBE_GAME_CREATE_UNIT_* → DBE_ACCOUNT_CREATE_UNIT_*）未建模（V2 單段 game DB）、S_SERVER_SELECT 狀態閘門未建模；wire 佈局為自洽 golden bytes，**未對原 SDK 實機驗證**。`WideToUtf8`（含代理對合併）與 `Utf8ToWide` 互為逆運算（均為 Linux wchar_t=4 下的 UTF-16 代理對路徑，供線路互通）。

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

⚠ 誠實偏差：無 SiCXSLStringFilter（FT_NICKNAME；原碼對 GetAuthLevel() < UAL_GM 生效）→ 無效暱稱不擋（僅長度+注入兩關）；原碼依 server group 路由 1st/2nd GameDB → V2 單一 game DB，**m_iServerGroup 忽略**；AF_INTERNAL 分支（內部旗標直接放行）未建模；gup_check_nickname 在 NULL SERV_ALL_RENEWAL_SP 下的精確口徑以 V2 兩表查詢近似（與 CreateUnit 的冷卻查詢一致）。SERV_ENTRY_POINT 已定義（ServerDefine.h:4304）故功能可達。

**測試**（tests/test_check_nickname.cpp，16 項）：REQ/ACK codec roundtrip（含 CJK）、可用→NET_OK+回顯、空→06、13+ bytes→06（UTF-8 CJK 3B/字邊界）、注入→05、暱稱已存在→02、SoftDeleteUnit 後冷卻→03。測試自 766 → **790 passed / 0 failed**。vcxproj 登記 CheckNicknameProtocol.{h,cpp}；Loopback 未擴充。**註**：首版測試暱稱為 21-byte CJK 誤判（>12）導致 2 FAIL，改用 9-byte 暱稱後全綠——UTF-8 位元組口徑測試需自量長度。

## 0p. 2026-11-17 快照（CHANGE_NICK_NAME 流程移植）

**NetError**（NetError_def.h enum 機讀計數核對值；解析器已重現既有信任常數）：補 `ERR_RESTORE_NICK_NAME_00=328`（找不到角色，原 -1）、`_01=329`（非復原對象，原 -2）、`_04=332`（復原失敗/SP 未命中，原 -5）。

**GameStore**：① `CheckNicknameAvailable` 增加 `excludeUnitUID` 參數（預設 0；`UnitUID != ?` 排除自身——改名情境用）；② 新增 enum `ChangeNicknameResult{Ok, UnitNotFoundOrDeleted, NotRestorable, Taken, InCooldown, Failure, DbError}` 與 `ChangeUnitNickname(unitUID, newNickname)`——事務化：讀舊暱稱（含刪除標記）→ `CheckNicknameAvailable`（排除自身）→ **舊暱稱寫入 `gdeleted_nickname_history`**（與 SoftDeleteUnit 同語意）→ `UPDATE gunit_nickname`。

**新增模組** `src/server/ChangeNicknameProtocol.{h,cpp}`（命名空間 `x2::change_nickname`）：`ChangeNickNameReq`（EGS_CHANGE_NICK_NAME_REQ=431；`{iUnitUID, wstrNickName, bCheckOnly}`，PUT 順序機讀自 ClientPacket.cpp:5715）、`EntryPointChangeNickNameReq`（EGS_ENTRY_POINT_CHANGE_NICK_NAME_REQ=1168；`{iServerGroup, iUnitUID, wstrNickName, bCheckOnly}`，:15044）、`ChangeNickNameAck`（EGS_CHANGE_NICK_NAME_ACK=432；`{iOK, iUnitUID, wstrNickName, bCheckOnly}`，:5731）。wire 佈局自洽，**未對原 SDK 實機驗證**。

**決策層** `HandleChangeNicknameReq(gameDb, userUID, req, ack, err)`（`HandleEntryPointChangeNicknameReq` 轉發至同一路徑）：UTF-8 1..12 bytes 否則 `_06`；KODBC 注入標記 → `_05`；**擁有權閘門**（GetUnitByUID 不存在/已刪除/非本人 → `_00`；原碼未檢查擁有權——V2 加固，誠實偏差）；`bCheckOnly=true` → `CheckNicknameAvailable(排除自身)`：Available→NET_OK／Taken→02／InCooldown→03；`bCheckOnly=false` → `ChangeUnitNickname`：Ok→NET_OK／UnitNotFoundOrDeleted→00／NotRestorable→01／Taken→02／InCooldown→03／Failure→04／DbError→false。ack 回顯 iUnitUID/wstrNickName/bCheckOnly。

⚠ 誠實偏差：無 SiCXSLStringFilter（FT_NICKNAME）；無 SERV_PVP_NEW_SYSTEM **已定義**之 NPC 名檢查（不擋）；原碼依 server group 路由 1st/2nd GameDB → V2 單一 game DB，**iServerGroup 忽略**；SERV_GUARANTEE_UNIQUENESS_OF_NAME_CN 未定義 → 無 Giant RoleReg 路徑；成功後**無 LogDB**（ELOG_CHANGE_NICK_NAME_NOT）；S_SERVER_SELECT 閘門未建模；舊暱稱 14 天冷卻為 V2 重建（原 stored proc 未隨倉庫提供）。

**測試**（tests/test_change_nickname.cpp，18 項）：codec roundtrip（兩種 REQ + ACK）、空→06、注入→05、非本人→00、bCheckOnly 可用/占用他人/**自己的現有名（排除自身）→NET_OK**、實際改名→NET_OK（再讀回 store 為新暱稱；**舊暱稱進 14 天冷卻 → check 回 03**）、改回冷卻中舊暱稱→03、同名改名→NET_OK、ENTRY_POINT 入口共享決策。測試自 790 → **826 passed / 0 failed**。vcxproj 登記 ChangeNicknameProtocol.{h,cpp}；Loopback 未擴充。**修正記錄**：測試首版 fixture「別人的占位」為 15 bytes CJK 被長度閘門擋下（06≠02），改 12 bytes fixture 後全綠（UTF-8 字節口徑需先自量）。

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
4. 遊戲邏輯（GS/LS/CS/CenterServer）全部未移植；Lua 腳本層未移植。
5. Windows 實機建置、安裝/升級路徑、符號伺服器、CI。
6. 效能與容量測試；記憶體/句柄洩漏基線（原版以 VLD 除錯，V2 無對應）。
7. `LoadINIFile`、設定檔格式與部署工具（原 `ReleaseTool`/`.bat` 流程）。
8. EventIDs 以外的大型表（道具/技能/副本資料）從 `X2/dat/Script` 的轉換管道。
9. `SELECT_UNIT` 的 REQ/收尾 ACK + 決策層已完成（§0c）；`SELECT_UNIT_1_NOT` codec + 組裝（gunit 表 → Not1，缺資料項佔位）已完成（§0e）；`SELECT_UNIT_2_NOT` codec + 組裝（任務無資料源→空容器佔位）已完成（§0f）；`SELECT_UNIT_3_NOT` codec + 組裝（mission/title/pet 無資料源→空容器佔位）已完成（§0g）；`SELECT_UNIT_4_NOT` codec + 組裝（社交/Henir/Messenger/戰場狀態無資料源→空容器/零值佔位）已完成（§0h）；`SELECT_UNIT_5_NOT` codec + 組裝（spirit/pshop/henir-reward/cashshop 無資料源→false/0 佔位）已完成（§0i），1_NOT…5_NOT 全數落地；1_NOT…5_NOT 分片 codec 全數移植（§0e…0i）；完整角色資料載入管線未開始。Login 切片打通到 SELECT_UNIT_1_NOT 為止（items/任務/寵物/ED/rating 等無資料來源，值為佔位）。
11. GDenyOption（社群拒絕選項）／GResurrectionStoneCnt／角色技能與任務衛星表未實作；帳號→角色建立的完整 `gup_create_unit` 副作用不完整。
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
