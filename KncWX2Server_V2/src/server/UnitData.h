// UnitData.h — KUnitInfo 與其巢狀型別的 JP INT_INTERNAL wire 結構與序列化
// （V2 `x2::unit` 命名空間）。
//
// 對齊對象：原 X2Project（SERV_INT_INTERNAL = JP 內部版本）
//   - KUnitInfo / KStat / KSkillData / KUnitSkillData / KLastPositionInfo / KBuffInfo
//     / KBuffFactor / KBuffBehaviorFactor / KBuffFinalizerFactor / KBuffIdentity
//     / KDungeonClearInfo / KTCClearInfo / KItemAttributeEnchantInfo / KItemInfo
//     / KInventoryItemInfo / KUserGuildInfo（見 KncWX2Server/Common/CommonPacket.{h,cpp}）
//   - 序列化順序與 CommonPacket.cpp 的 PUT 順序一致（機讀擷取，2026-11-17）。
//   - 容器格式：DWORD 數量前綴 + 元素（map 元素為 eTAG_PAIR + first + second），與 KNCSDK SerSTL/SerPair 一致。
//
// JP（SERV_INT_INTERNAL）巨集組合（以寬鬆樣式 grep 機讀核對 2026-11-17，`#define  X` 雙空格已被發現兩次）：
//   已定義 → 保留此處：SERV_PVP_NEW_SYSTEM(1188)、SERV_2012_PVP_SEASON2(2182)、
//     SERV_BATTLE_FIELD_SYSTEM(2768)、SERV_BATTLE_FIELD_BOSS、SERV_REFORM_THE_GATE_OF_DARKNESS(1924)、
//     SERV_TITLE_DATA_SIZE(747)、GUILD_TEST(73)、GUILD_SKILL_TEST、SERV_SKILL_PAGE_SYSTEM(4314)、
//     SERV_SKILL_NOTE(222)、SERV_SERVER_BUFF_SYSTEM、SERV_EXPAND_SLOT_ID_DATA_SIZE(1582)、
//     SERV_ITEM_OPTION_DATA_SIZE、SERV_NEW_ITEM_SYSTEM_2013_05、CUMULATIVE_TIME_EVENT(101)、
//     SERV_PET_SYSTEM(460)、AP_RESTONE(80)、SERV_RANDOM_DAY_QUEST(1291)、SERV_DAILY_QUEST(236)
//   未定義 → 不含此處：SERV_PVP_NEW_SYSTEM 的 #else 分支（m_iPVPEmblem/m_iVSPoint…）、
//     SERV_LIMITED_DUNGEON_PLAY_TIMES、SERV_PC_BANG_TYPE、SERV_UNIT_WAIT_DELETE、
//     SERV_ADD_WARP_BUTTON、SERV_GROW_UP_SOCKET、SERV_ACCUMULATION_SPIRIT_SYSTEM、
//     SERV_CHINA_SPIRIT_EVENT、SERV_RECRUIT_EVENT_QUEST_FOR_NEW_USER、SERV_NEW_YEAR_EVENT_2014、
//     SERV_EVENT_CHECK_POWER、SERV_4TH_ANNIVERSARY_EVENT、SERV_GOLD_TICKET
//
// 重要：KBuffFactor 不序列化 m_uidMesGameUnit / m_bIsMesGameUnitNpc（原碼 PUT 如此）——V2 照抄。
// EQUIPPED_SKILL_SLOT_COUNT = 4（KUnitSkillData）。
//
// ⚠ 僅覆蓋上述巨集組合；更換地區/開關定義會改變 wire 佈局。
// ⚠ golden bytes 為自洽佈局，未對原 SDK 實機驗證。
#pragma once

#include <cstdint>
#include <string>
#include <vector>
#include <map>

namespace x2 { class Serializer; }

namespace x2 { namespace unit {

struct ItemAttributeEnchantInfo
{
    int8_t cAttribEnchant0 = 0;
    int8_t cAttribEnchant1 = 0;
    int8_t cAttribEnchant2 = 0;
};

struct ItemInfo
{
    int32_t itemID = 0;
    int8_t  usageType = 0;
    int32_t quantity = 1;
    int16_t endurance = 0;
    uint8_t sealData = 0;                 // UCHAR
    int8_t  enchantLevel = 0;
    ItemAttributeEnchantInfo attrib;
    std::vector<int32_t> itemSocket;      // SERV_ITEM_OPTION_DATA_SIZE（vector<int>）
    std::vector<int32_t> randomSocket;    // SERV_NEW_ITEM_SYSTEM_2013_05（vector<int>）
    int8_t  itemState = 0;                // SERV_NEW_ITEM_SYSTEM_2013_05
    int16_t period = 0;
    std::wstring expirationDate;
    uint8_t expandedSocketNum = 0;        // SERV_BATTLE_FIELD_BOSS（byte）
};

struct InventoryItemInfo
{
    int64_t itemUID = 0;                  // UidType（eTAG_INT64）
    int8_t  slotCategory = 0;
    int16_t slotID = 0;                   // SERV_EXPAND_SLOT_ID_DATA_SIZE（short）
    ItemInfo itemInfo;
};

struct DungeonClearInfo
{
    int32_t dungeonID = 0;
    int32_t maxScore = 0;
    int8_t  maxTotalRank = 0;
    std::wstring clearTime;
    bool    isNew = false;
};

struct TCClearInfo
{
    int32_t tcid = 0;
    std::wstring clearTime;
    bool    isNew = false;
};

struct Stat
{
    int32_t baseHP = 0;
    int32_t atkPhysic = 0;
    int32_t atkMagic = 0;
    int32_t defPhysic = 0;
    int32_t defMagic = 0;
};

struct SkillData
{
    int16_t skillID = 0;                  // short
    uint8_t skillLevel = 0;               // UCHAR
};

struct UnitSkillData
{
    static constexpr int kEquippedSkillSlotCount = 4;
    SkillData equippedSkill[kEquippedSkillSlotCount];
    SkillData equippedSkillSlotB[kEquippedSkillSlotCount];
    std::wstring skillSlotBEndDate;
    int8_t  skillSlotBExpirationState = 0;    // char
    std::vector<SkillData> passiveSkill;
    std::vector<SkillData> guildPassiveSkill; // GUILD_SKILL_TEST
    std::vector<int32_t> skillNote;           // SERV_SKILL_NOTE（vector<int>）
    uint8_t activeSkillPagesNumber = 1;       // SERV_SKILL_PAGE_SYSTEM（unsigned char）
    uint8_t theNumberOfSkillPagesAvailable = 1;
};

struct UserGuildInfo
{
    int32_t guildUID = 0;
    std::wstring guildName;
    uint8_t memberShipGrade = 0;              // u_char
    int32_t honorPoint = 0;
};

struct LastPositionInfo             // SERV_BATTLE_FIELD_SYSTEM
{
    int32_t mapID = 0;
    uint8_t lastTouchLineIndex = 0;           // UCHAR
    uint16_t lastPosValue = 0;                // USHORT
    bool    ignoreLastTouch = false;          // SERV_BATTLE_FIELD_BOSS
};

struct BuffBehaviorFactor
{
    uint32_t uiType = 0;                      // UINT（eTAG_DWORD）
    std::vector<float> vecValues;
};

struct BuffFinalizerFactor
{
    uint32_t uiType = 0;
    std::vector<float> vecValues;
};

struct BuffIdentity
{
    int32_t buffTempletID = 0;                // int
    uint32_t uniqueNum = 0;                   // UINT
};

struct BuffFactor
{
    std::vector<BuffBehaviorFactor> vecBuffBehaviorFactors;
    std::vector<BuffFinalizerFactor> vecBuffFinalizerFactors;
    BuffIdentity identity;
    float  accumulationMultiplier = 0.0f;
    uint8_t accumulationCountNow = 0;         // UCHAR
    int32_t factorID = 0;
    // ⚠ 原碼 m_uidMesGameUnit / m_bIsMesGameUnitNpc **不序列化**——V2 照抄
};

struct BuffInfo
{
    BuffFactor factorInfo;
    int64_t buffStartTime = 0;                // __int64
    int64_t buffEndTime = 0;                  // __int64
};


struct UserSkillData                      // SERV_SKILL_PAGE_SYSTEM（KUserSkillData）
{
    int16_t skillID = 0;                  // short
    uint8_t skillLevel = 0;               // UCHAR
    uint8_t skillCSPoint = 0;             // UCHAR
};

struct UserSkillPageData
{
    static constexpr int kEquippedSkillSlotCount = 4;
    SkillData equippedSkill[kEquippedSkillSlotCount];
    SkillData equippedSkillSlotB[kEquippedSkillSlotCount];
    uint16_t usSkillPoint = 0;            // USHORT
    uint16_t usCashSkillPoint = 0;        // USHORT
    std::vector<UserSkillData> userSkillData;
};

struct RelationshipInfo               // SERV_RELATIONSHIP_SYSTEM（KRelationshipInfo）
{
    int8_t  relationshipType = 0;         // char
    int64_t otherUnitUID = 0;             // UidType
    std::wstring otherNickName;
    std::wstring loveWord;
    int64_t date = 0;                     // __int64
    int64_t lastReward = 0;               // __int64
    int8_t  rewardTitleType = 0;          // char
};

struct UnitInfo
{
    int64_t ownerUserUID = 0;                 // UidType
    int8_t  authLevel = 0;                    // char
    int64_t unitUID = 0;                      // UidType
    uint32_t knmSerialNum = 0;                // u_int（eTAG_DWORD）
    int8_t  unitClass = 0;                    // char
    std::wstring nickName;
    std::wstring ip;
    uint16_t port = 0;                        // USHORT
    int32_t ed = 0;
    uint8_t level = 0;                        // UCHAR
    int32_t exp = 0;
    // SERV_PVP_NEW_SYSTEM（+ SERV_2012_PVP_SEASON2）
    int32_t officialMatchCnt = 0;
    int32_t rating = 0;
    int32_t maxRating = 0;
    int32_t rPoint = 0;
    int32_t aPoint = 0;
    bool    isWinBeforeMatch = false;
    int8_t  rank = 0;                         // SERV_2012_PVP_SEASON2（char）
    float   kFactor = 0.0f;
    bool    isRedistributionUser = false;
    int32_t pastSeasonWin = 0;
    // ---- SPoint / CSPoint ----
    int32_t sPoint = 0;
    int32_t csPoint = 0;
    int32_t maxCSPoint = 0;
    std::wstring csPointEndDate;
    int32_t nowBaseLevelEXP = 0;
    int32_t nextBaseLevelEXP = 0;
    int32_t straightVictories = 0;
    Stat    stat;
    Stat    gameStat;
    LastPositionInfo lastPos;                 // SERV_BATTLE_FIELD_SYSTEM
    std::vector<BuffInfo> buffInfo;           // SERV_REFORM_THE_GATE_OF_DARKNESS
    int32_t win = 0;
    int32_t lose = 0;
    std::map<int32_t, DungeonClearInfo> dungeonClear;   // map<int,…>
    std::map<int32_t, TCClearInfo> tcClear;             // map<int,…>
    std::map<int32_t, InventoryItemInfo> equippedItem;  // map<int,…>
    UnitSkillData unitSkillData;
    bool    isParty = false;
    int32_t spiritMax = 0;
    int32_t spirit = 0;
    bool    isGameBang = false;
    int32_t titleID = 0;                      // SERV_TITLE_DATA_SIZE（int）
    UserGuildInfo userGuildInfo;              // GUILD_TEST
    std::wstring lastLoginTime;
    // SERV_UNIT_WAIT_DELETE 未定義 → 無 m_wstrLastDate/m_bDeleted/m_trDelAbleDate/m_trRestoreAbleDate
};

bool PutItemAttributeEnchantInfo(Serializer& ks, const ItemAttributeEnchantInfo& v);
bool GetItemAttributeEnchantInfo(Serializer& ks, ItemAttributeEnchantInfo& v);
bool PutItemInfo(Serializer& ks, const ItemInfo& v);
bool GetItemInfo(Serializer& ks, ItemInfo& v);
bool PutInventoryItemInfo(Serializer& ks, const InventoryItemInfo& v);
bool GetInventoryItemInfo(Serializer& ks, InventoryItemInfo& v);
bool PutDungeonClearInfo(Serializer& ks, const DungeonClearInfo& v);
bool GetDungeonClearInfo(Serializer& ks, DungeonClearInfo& v);
bool PutTCClearInfo(Serializer& ks, const TCClearInfo& v);
bool GetTCClearInfo(Serializer& ks, TCClearInfo& v);
bool PutStat(Serializer& ks, const Stat& v);
bool GetStat(Serializer& ks, Stat& v);
bool PutSkillData(Serializer& ks, const SkillData& v);
bool GetSkillData(Serializer& ks, SkillData& v);
bool PutUnitSkillData(Serializer& ks, const UnitSkillData& v);
bool GetUnitSkillData(Serializer& ks, UnitSkillData& v);
bool PutUserSkillData(Serializer& ks, const UserSkillData& v);
bool GetUserSkillData(Serializer& ks, UserSkillData& v);
bool PutUserSkillPageData(Serializer& ks, const UserSkillPageData& v);
bool GetUserSkillPageData(Serializer& ks, UserSkillPageData& v);
bool PutRelationshipInfo(Serializer& ks, const RelationshipInfo& v);
bool GetRelationshipInfo(Serializer& ks, RelationshipInfo& v);
bool PutUserGuildInfo(Serializer& ks, const UserGuildInfo& v);
bool GetUserGuildInfo(Serializer& ks, UserGuildInfo& v);
bool PutLastPositionInfo(Serializer& ks, const LastPositionInfo& v);
bool GetLastPositionInfo(Serializer& ks, LastPositionInfo& v);
bool PutBuffBehaviorFactor(Serializer& ks, const BuffBehaviorFactor& v);
bool GetBuffBehaviorFactor(Serializer& ks, BuffBehaviorFactor& v);
bool PutBuffFinalizerFactor(Serializer& ks, const BuffFinalizerFactor& v);
bool GetBuffFinalizerFactor(Serializer& ks, BuffFinalizerFactor& v);
bool PutBuffIdentity(Serializer& ks, const BuffIdentity& v);
bool GetBuffIdentity(Serializer& ks, BuffIdentity& v);
bool PutBuffFactor(Serializer& ks, const BuffFactor& v);
bool GetBuffFactor(Serializer& ks, BuffFactor& v);
bool PutBuffInfo(Serializer& ks, const BuffInfo& v);
bool GetBuffInfo(Serializer& ks, BuffInfo& v);
bool PutUnitInfo(Serializer& ks, const UnitInfo& v);
bool GetUnitInfo(Serializer& ks, UnitInfo& v);

} // namespace unit
} // namespace x2
