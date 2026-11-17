// SelectUnitProtocol.h — EGS_SELECT_UNIT_REQ / EGS_SELECT_UNIT_ACK 的 wire 結構與序列化
// （V2 `x2::select_unit` 命名空間）。
//
// 對齊對象：原 X2Project（SERV_INT_INTERNAL＝JP 內部版本）
//   KEGS_SELECT_UNIT_REQ { UidType m_iUnitUID }
//     ← SERV_CODE_EVENT / SERV_GLOBAL_EVENT_TABLE **未定義**（2026-11-17 機讀核對 ServerDefine.h，無任何匹配）
//   SERV_SELECT_UNIT_PACKET_DIVISION **已定義**（ServerDefine.h:3401），故：
//     DB 回應不再內嵌巨大的 KEGS_SELECT_UNIT_ACK，而是拆成
//     SELECT_UNIT_1_NOT…5_NOT（角色/任務/寵物…分片）+ 一個極簡的 EGS_SELECT_UNIT_ACK { int m_iOK } 收尾。
//   事件 ID（V2 EventIDs.h 實測）：EGS_SELECT_UNIT_REQ=40, EGS_SELECT_UNIT_ACK=41,
//                                    EGS_SELECT_UNIT_1_NOT..5_NOT = 42..46。
//
// ⚠ 本檔覆蓋 REQ、「收尾 ACK」、SELECT_UNIT_1_NOT…5_NOT，
//   以及 EGS_GET_MY_INVENTORY_REQ/ACK（47/48）與 EGS_SELECT_UNIT_INVENTORY_INFO_NOT（49）。
//   在它們完成前，真實客戶端無法用 V2 完成角色選擇流程（見 docs/architecture.md §12）。
//   線路佈局為自洽 golden bytes，未對原 SDK 實機驗證。
#pragma once

#include <cstdint>
#include <string>
#include <vector>
#include <map>

#include "UnitData.h"

namespace x2 { class Serializer; }

namespace x2 { namespace select_unit {

struct SelectUnitReq
{
    int64_t unitUID = 0;   // UidType（INT64 BE，eTAG_INT64）
};

struct SelectUnitAck   // SERV_SELECT_UNIT_PACKET_DIVISION 下的收尾 ACK
{
    int32_t iOK = 0;      // NetError（NET_OK=0）
};

// EGS_SELECT_UNIT_1_NOT（服務端 → 客戶端）：角色本體 + 背包/技能進度分片之首。
// JP INT_INTERNAL（SERV_SELECT_UNIT_PACKET_DIVISION、SERV_CHAR_LOG、SERV_LOGOUT_ED_CHECK、
// SERV_DAILY_CHAR_FIRST_SELECT、SERV_SKILL_PAGE_SYSTEM、SERV_SKILL_NOTE、
// AP_RESTONE、SERV_RELATIONSHIP_SYSTEM 皆已定義；SERV_NEW_UNIT_TRADE_LIMIT 未定義）
// PUT 順序機讀自 CommonPacket.cpp（2026-11-17）：
//   iOK, kUnitInfo, wstrUnitCreateDate, iRealDataED, wstrUnitLastLoginDate,
//   mapInventorySlotSize<int,int>, mapItem<UidType,KInventoryItemInfo>, iNumResurrectionStone,
//   iNumAutoPaymentResStone, wstrAutoPayResStoneLastDate, vecUserSkillPageData, vecSkillUnsealed<short>,
//   cSkillNoteMaxPageNum, mapSkillNote<char,int>, kRelationshipInfo
// 事件 ID：EGS_SELECT_UNIT_1_NOT = 42。
// ⚠ 自洽 golden bytes；未對原 SDK 實機驗證。
struct SelectUnitNot1
{
    int32_t iOK = 0;
    unit::UnitInfo unitInfo;
    std::wstring unitCreateDate;                    // SERV_CHAR_LOG（原 wstring）
    int32_t realDataED = 0;                         // SERV_LOGOUT_ED_CHECK（int）
    std::wstring unitLastLoginDate;                 // SERV_DAILY_CHAR_FIRST_SELECT
    std::map<int32_t, int32_t> inventorySlotSize;   // map<int,int>
    std::map<int64_t, unit::InventoryItemInfo> items; // map<UidType,KInventoryItemInfo>
    int32_t numResurrectionStone = 0;               // int
    int32_t numAutoPaymentResStone = 0;             // AP_RESTONE（int）
    std::wstring autoPayResStoneLastDate;           // AP_RESTONE（wstring）
    std::vector<unit::UserSkillPageData> vecUserSkillPageData;  // SERV_SKILL_PAGE_SYSTEM
    std::vector<int16_t> vecSkillUnsealed;          // vector<short>
    int8_t skillNoteMaxPageNum = 0;                 // SERV_SKILL_NOTE（char）
    std::map<int8_t, int32_t> mapSkillNote;         // SERV_SKILL_NOTE（map<char,int>，char key eTAG_CHAR）
    unit::RelationshipInfo relationshipInfo;        // SERV_RELATIONSHIP_SYSTEM
};

bool PutSelectUnitReq(Serializer& ks, const SelectUnitReq& v);
bool GetSelectUnitReq(Serializer& ks, SelectUnitReq& v);
bool PutSelectUnitAck(Serializer& ks, const SelectUnitAck& v);
bool GetSelectUnitAck(Serializer& ks, SelectUnitAck& v);
// EGS_SELECT_UNIT_2_NOT（服務端 → 客戶端）：任務進度分片。
// JP INT_INTERNAL（SERV_DAILY_QUEST、SERV_RANDOM_DAY_QUEST 皆已定義，2026-11-17 機讀核對）
// PUT 順序機讀自 CommonPacket.cpp（2026-11-17）：
//   iOK, vecQuest<KQuestInstance>, vecCompletQuest<KCompleteQuestInfo>, mapRandomQuestList<int,int>
// 事件 ID：EGS_SELECT_UNIT_2_NOT = 43。
// ⚠ 自洽 golden bytes；未對原 SDK 實機驗證。
struct SelectUnitNot2
{
    int32_t iOK = 0;
    std::vector<unit::QuestInstance> vecQuest;              // vector<KQuestInstance>
    std::vector<unit::CompleteQuestInfo> vecCompletQuest;   // SERV_DAILY_QUEST（vector<KCompleteQuestInfo>）
    std::map<int32_t, int32_t> mapRandomQuestList;          // SERV_RANDOM_DAY_QUEST（map<int,int>）
};

bool PutSelectUnitNot1(Serializer& ks, const SelectUnitNot1& v);
bool GetSelectUnitNot1(Serializer& ks, SelectUnitNot1& v);
// EGS_SELECT_UNIT_3_NOT（服務端 → 客戶端）：使命/稱號/寵物分片。
// JP INT_INTERNAL（SERV_PET_SYSTEM:460、SERV_PETID_DATA_TYPE_CHANGE:3891、SERV_PET_AUTO_LOOTING:2342 皆已定義；
// SERV_EVENT_PET_INVENTORY/SERV_FREE_AUTO_LOOTING/SERV_PERIOD_PET 未定義——2026-11-17 機讀核對）
// PUT 順序機讀自 CommonPacket.cpp（2026-11-17）：
//   iOK, vecMission<KMissionInstance>, vecTitle<KTitleInfo>,
//   iSummonedPetUID(UidType), vecPetList<KPetInfo>,
//   vecCanEvolutionPetList<UidType>, vecNeverSummonPetList<UidType>,
//   mapPetItem<UidType, map<UidType,KInventoryItemInfo>>
// 事件 ID：EGS_SELECT_UNIT_3_NOT = 44。
// ⚠ 自洽 golden bytes；未對原 SDK 實機驗證。
struct SelectUnitNot3
{
    int32_t iOK = 0;
    std::vector<unit::MissionInstance> vecMission;                       // vector<KMissionInstance>
    std::vector<unit::TitleInfo> vecTitle;                               // vector<KTitleInfo>
    int64_t iSummonedPetUID = 0;                                         // UidType（SERV_PET_SYSTEM）
    std::vector<unit::PetInfo> vecPetList;                               // SERV_PET_SYSTEM
    std::vector<int64_t> vecCanEvolutionPetList;                         // SERV_PET_SYSTEM（vector<UidType>）
    std::vector<int64_t> vecNeverSummonPetList;                          // SERV_PET_SYSTEM（vector<UidType>）
    std::map<int64_t, std::map<int64_t, unit::InventoryItemInfo>> mapPetItem;  // SERV_PET_SYSTEM（map<UidType,map<UidType,KInventoryItemInfo>>）
};

bool PutSelectUnitNot2(Serializer& ks, const SelectUnitNot2& v);
bool GetSelectUnitNot2(Serializer& ks, SelectUnitNot2& v);
// EGS_SELECT_UNIT_4_NOT（服務端 → 客戶端）：社交/教學/累積連線/Henir排行/Messenger/戰場狀態分片。
// JP INT_INTERNAL（SERV_RELATIONSHIP_SYSTEM:3643、SERV_ACC_TIME_EVENT:288、CUMULATIVE_TIME_EVENT:101、
// SERV_BATTLE_FIELD_SYSTEM:2768、SERV_RIDING_PET_SYSTM:2523 皆已定義；
// SERV_RECRUIT_EVENT_BASE、SERV_ARCHUANGEL_S_COIN_EVENT_GUIDE、SERV_HENIR_RENEWAL_2013 未定義——2026-11-17 機讀核對）
// PUT 順序機讀自 CommonPacket.cpp（2026-11-17）：
//   iOK, vecChatBlackList<KChatBlackListUnit>, kDenyOptions, bIsRecommend(bool), iRecommendUnitUID(UidType),
//   vecTutorialDBUnitInfo<KTutorialDBUnitInfo>, vecConnectTimeEvent<KConnectTimeEventInfo>,
//   vecCumulativeTimeEvent<KCumulativeTimeEventInfo>, vecHenirRanking<KHenirRankingInfo>,
//   kMessengerInfo, kGamePlayStatus<KGamePlayStatusContainer>
// 事件 ID：EGS_SELECT_UNIT_4_NOT = 45。
// ⚠ 自洽 golden bytes；未對原 SDK 實機驗證。
struct SelectUnitNot4
{
    int32_t iOK = 0;
    std::vector<unit::ChatBlackListUnit> vecChatBlackList;          // vector<KChatBlackListUnit>
    unit::DenyOptions kDenyOptions;                                 // KDenyOptions
    bool bIsRecommend = false;                                      // bool
    int64_t iRecommendUnitUID = 0;                                  // UidType
    std::vector<unit::TutorialDBUnitInfo> vecTutorialDBUnitInfo;    // vector<KTutorialDBUnitInfo>
    std::vector<unit::ConnectTimeEventInfo> vecConnectTimeEvent;    // vector<KConnectTimeEventInfo>
    std::vector<unit::CumulativeTimeEventInfo> vecCumulativeTimeEvent;  // CUMULATIVE_TIME_EVENT
    std::vector<unit::HenirRankingInfo> vecHenirRanking;            // vector<KHenirRankingInfo>
    unit::MessengerInfo kMessengerInfo;                             // KMessengerInfo
    unit::GamePlayStatusContainer kGamePlayStatus;                  // SERV_BATTLE_FIELD_SYSTEM
};

bool PutSelectUnitNot3(Serializer& ks, const SelectUnitNot3& v);
bool GetSelectUnitNot3(Serializer& ks, SelectUnitNot3& v);
// EGS_SELECT_UNIT_5_NOT（服務端 → 客戶端）：首次選擇/ETC 分片。
// JP INT_INTERNAL（SERV_CHAR_LOG:754、SERV_PSHOP_AGENCY:971、SERV_NEW_HENIR_TEST:1267、
// SERV_CONTENT_MANAGER:1399、SERV_LOCAL_RANKING_SYSTEM:2438、SERV_ARA_FIRST_SELECT_TUTORIAL:3440 已定義；
// SERV_EVENT_MONEY、SERV_2012_PVP_SEASON2_EVENT、SERV_EVENT_BINGO、SERV_CUSTOM_CONNECT_EVENT、
// SERV_EVENT_BOUNS_ITEM_AFTER_7DAYS_BY_LEVEL、SERV_GATE_OF_DARKNESS_SUPPORT_EVENT、SERV_RELATIONSHIP_EVENT_INT、
// SERV_STEAM_USER_CONNECT_EVENT、SERV_ELESIS_UPDATE_EVENT、SERV_EVENT_CHUNG_GIVE_ITEM、
// SERV_4TH_ANNIVERSARY_EVENT 未定義——2026-11-17 機讀核對）
// PUT 順序機讀自 CommonPacket.cpp（2026-11-17）：
//   iOK, bIsSpiritUpdated(bool), (CHAR_LOG) mapCharGameCount<int,int>,
//   (PSHOP_AGENCY) kPShopAgencyInfo, (NEW_HENIR_TEST) packetHenirRewardCount,
//   (CONTENT_MANAGER) bCashShopOpen(bool), (ARA_FIRST_SELECT_TUTORIAL) bFirstSelect(bool),
//   (LOCAL_RANKING_SYSTEM) bLocalRankingUser(bool)
// 事件 ID：EGS_SELECT_UNIT_5_NOT = 46。
// ⚠ 自洽 golden bytes；未對原 SDK 實機驗證。
struct SelectUnitNot5
{
    int32_t iOK = 0;
    bool bIsSpiritUpdated = false;                           // 原 bool
    std::map<int32_t, int32_t> mapCharGameCount;             // SERV_CHAR_LOG（map<int,int>）
    unit::UserPShopAgencyInfo kPShopAgencyInfo;              // SERV_PSHOP_AGENCY
    unit::HenirRewardCountNot packetHenirRewardCount;        // SERV_NEW_HENIR_TEST
    bool bCashShopOpen = false;                              // SERV_CONTENT_MANAGER
    bool bFirstSelect = false;                               // SERV_ARA_FIRST_SELECT_TUTORIAL
    bool bLocalRankingUser = false;                          // SERV_LOCAL_RANKING_SYSTEM
};

bool PutSelectUnitNot4(Serializer& ks, const SelectUnitNot4& v);
bool GetSelectUnitNot4(Serializer& ks, SelectUnitNot4& v);
// EGS_GET_MY_INVENTORY_REQ（無參數，原 IMPL_ON_FUNC_NOPARAM）：REQ 無欄位。
// 事件 ID：EGS_GET_MY_INVENTORY_REQ = 47。
struct GetMyInventoryReq
{
};

// EGS_GET_MY_INVENTORY_ACK（服務端 → 客戶端）：iOK + bIsRecommend。
// SERV_SHARING_BANK_QUEST_CASH **未定義**（2026-11-17 機讀核對 ServerDefine.h）→ 無 m_bSharingBank。
// 事件 ID：EGS_GET_MY_INVENTORY_ACK = 48。
// ⚠ 自洽 golden bytes；未對原 SDK 實機驗證。
struct GetMyInventoryAck
{
    int32_t iOK = 0;          // NetError（NET_OK=0）
    bool bIsRecommend = false;
};

// EGS_SELECT_UNIT_INVENTORY_INFO_NOT（服務端 → 客戶端）：依槽位分類拆分的背包分片。
// PUT 順序（ClientPacket.cpp 機讀）：iSlotCategory(int) → mapItem<UidType,KInventoryItemInfo>
// 原 KInventory::GetSelectUnitInventoryInfo 會跳過 ST_BANK / ST_E_EQUIP 且空 category 不送；
// V2 未建模 CXSLInventory 分類常量，分組時不跳過（見 BuildSelectUnitInventoryInfoNots 註解）。
// 事件 ID：EGS_SELECT_UNIT_INVENTORY_INFO_NOT = 49。
// ⚠ 自洽 golden bytes；未對原 SDK 實機驗證。
struct SelectUnitInventoryInfoNot
{
    int32_t iSlotCategory = 0;                              // int
    std::map<int64_t, unit::InventoryItemInfo> mapItem;     // map<UidType,KInventoryItemInfo>
};

bool PutSelectUnitNot5(Serializer& ks, const SelectUnitNot5& v);
bool GetSelectUnitNot5(Serializer& ks, SelectUnitNot5& v);
bool PutGetMyInventoryReq(Serializer& ks, const GetMyInventoryReq& v);
bool GetGetMyInventoryReq(Serializer& ks, GetMyInventoryReq& v);
bool PutGetMyInventoryAck(Serializer& ks, const GetMyInventoryAck& v);
bool GetGetMyInventoryAck(Serializer& ks, GetMyInventoryAck& v);
bool PutSelectUnitInventoryInfoNot(Serializer& ks, const SelectUnitInventoryInfoNot& v);
bool GetSelectUnitInventoryInfoNot(Serializer& ks, SelectUnitInventoryInfoNot& v);

} // namespace select_unit
} // namespace x2
