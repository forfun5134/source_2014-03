// GameStore.h — V2 遊戲資料庫（game DB）存取層：guser / gunit / 暱稱歷史
//
// 對應原 SQL Server 版 game DB（Database2）：
//   dbo.GUser              UserUID bigint PK（= account DB users.LoginUID，跨庫關聯，無 FK）、
//                          UserID nvarchar(50)、USSize tinyint（角色槽位數）、RegDate/DelDate smalldatetime，
//                          Deleted 計算欄 = (RegDate = DelDate)
//   dbo.GUnit              UnitUID bigint IDENTITY PK、UserUID bigint、UnitClass tinyint、Exp int、Level tinyint、
//                          GamePoint int、VSPoint int、VSPointMax int NULL、BaseHP smallint、
//                          AtkPhysic/AtkMagic/DefPhysic/DefMagic tinyint、SPoint int、Win/Lose/Seceder int、
//                          RegDate/DelDate/LastDate smalldatetime、LastPosition int、PlayDayCnt int、LoginCount int
//   dbo.GUnitNickName      UnitUID bigint、NickName nvarchar(16)、RegDate smalldatetime
//   dbo.GDeletedNickNameHistory  NickName nvarchar(16)、UnitUID bigint、RegDate smalldatetime
//
// 原版建立流程（dbo.gup_get_user_info / dbo.gup_create_unit）的語意對照：
//   - gup_get_user_info：該 UserUID 首次進入本伺服器群時 INSERT GUser（USSize=50，RegDate=DelDate=now），
//     回傳 USSize。V2 以 GetOrCreateGUser 對應（事務化 read-then-insert）。
//   - gup_create_unit：檢查 GUser 存在且未刪除 → 檢查未刪除角色數 >= USSize 則拒絕(-3) →
//     檢查暱稱在 GUnitNickName 不存在(-2)、在 GDeletedNickNameHistory 且 14 天內拒絕(-222) →
//     事務 INSERT GUnit（Exp=0,Level=1,GamePoint=0,VSPoint=0,VSPointMax=0,BaseHP=0,Atk*|Def*=0,
//       SPoint=1,Win=0,Lose=0,Seceder=0,LastPosition=20000,RegDate=DelDate=LastDate=now,
//       PlayDayCnt=0,LoginCount=0）+ INSERT GUnitNickName。
//     V2 以 CreateUnit 對應；回傳語意以 CreateUnitResult 表達（不回傳原負值碼，對照見 CreateUnitResult 註解）。
//
// ⚠ 範圍（刻意且誠實）：
//   - v2 起含 GDenyOption/GQuests/GSkill/GSkillSlot/GSpirit/GResurrectionStoneCnt（建角衛星表，§0a5）；
//     v3 起含 GResurrectionStone（角色級復活石，§0a8——SELECT_UNIT 每日補充）。
//     GSkill/GQuests 的查詢路徑、GMission/GTitle、GItem 等仍未實作（見 docs/architecture.md §12）。
//   - 14 天暱稱冷卻規則已實作；GDeletedNickNameHistory 記錄於 SoftDeleteUnit。
//   - game DB 與 account DB 是**兩個獨立 SQLite 檔**（對應原版兩個獨立 SQL Server 資料庫）；
//     跨庫 UserUID↔LoginUID 無 FK 約束（與原版一致，由應用層保證）。
//   - 一律參數化查詢；DelDate=now 即軟刪除（Deleted 由生成欄自動計算）。
//   - 所有時間為 UTC ISO8601（datetime('now')），與 users 表一致。
#pragma once

#include <cstdint>
#include <string>
#include <vector>
#include <array>
#include <map>
#include <tuple>

#include "Sqlite.h"

namespace x2 { namespace db {

// v14（§0a23）：2013 SERV_SKILL_PAGE_SYSTEM 反推——gskill+SkillLevel/SkillCSPoint/SkillPageNumber；
//   新 gskillexpand（P_GSkill_Expand_SEL 對應）／gskillslotnew（P_GSkillSlot_New_SEL）／gskillslot2new（P_GSkillSlot2_New_SEL）／
//   gskillunsealed（P_GSkill_Unsealed_SEL）／gskillcash（gup_get_cash_skill_point_info 對應）。
//   原 proc/表皆不在倉庫——結構與語意全由 GSGameDBThread 行為反推，見 docs §0a23。
inline constexpr int kGameSchemaVersion = 14;

// game DB 遷移：v0→v1 建立 guser / gunit / gunit_nickname / gdeleted_nickname_history；冪等
bool ApplyGameMigrations(Database& db, std::string& err);

struct GUserRecord
{
    int64_t     userUID   = 0;
    std::string userID;               // 原 nvarchar(50)
    int         usSize    = 0;        // 角色槽位數（原 tinyint）
    std::string regDate, delDate;     // ISO8601 UTC
    bool        deleted = false;      // 生成欄
};

struct GUnitRecord
{
    int64_t     unitUID   = 0;
    int64_t     userUID   = 0;
    int         unitClass = 0;        // 角色職業（原 tinyint）
    int32_t     exp       = 0;
    int         level     = 1;
    int32_t     gamePoint = 0;
    int32_t     vsPoint   = 0;
    int32_t     vsPointMax = 0;       // 原 int NULL，V2 以 0 代表未設定（見檔頭誠實說明：原 NULL 語意未保留）
    int         baseHP    = 0;        // 原 smallint
    int         atkPhysic = 0, atkMagic = 0, defPhysic = 0, defMagic = 0;
    int32_t     sPoint    = 1;
    int         win = 0, lose = 0, seceder = 0;
    std::string regDate, delDate, lastDate;
    int32_t     lastPosition = 20000;
    int32_t     playDayCnt   = 0;
    int32_t     loginCount   = 0;
    bool        deleted = false;
    std::string nickname;             // JOIN gunit_nickname 帶出；軟刪除後 NickName 已被釋放（NULL），此列為空字串
};

// ===== 2013 SERV_SKILL_PAGE_SYSTEM 反推（§0a23）=====
// 倉庫內**無**原 proc（P_GSkill_Expand_SEL／P_GSkill_New_SEL／P_GSkillSlot_New_SEL／P_GSkillSlot2_New_SEL／
// gup_get_cash_skill_point_info／gup_get_unsealed_skill_info…）也無對應表；以下結構與語意全由
// KncWX2Server/GameServer/GSGameDBThread.cpp（Query_SelectUnit）與 CommonPacket 的轉置邏輯反推：
//   Expand_SEL 返回 (SKILLPageCNT, ActivePage)（缺列 → 1/1，原 BeginFetch 失敗分支同）
//   New_SEL    返回 (SkillID, SkillLevel, SkillCSPoint, SkillPageNumber)（SkillID>0 && SkillLevel>0 才有效）
//   Slot_SEL   返回 (Slot01..04, SkillPageNumber)（整表缺列時伺服器端自癒 INSERT 0×N——見 LoadSkillPageState）
//   Slot2_SEL  返回 (Slot01..04, SkillPageNumber, EndDate)（缺列 → 哨兵 EndDate、槽位 0；不寫回）
//   Unsealed   返回 (SkillID)（isBornSealed 技能經道具解封的記錄；V2 建角流程不會寫入，恆空直到有發放路徑）
// ⚠ 反推偏差聲明見 docs §0a23。
struct SkillPageLearned
{
    int32_t skillID = 0;          // 原 short
    int32_t skillLevel = 0;       // 原 UCHAR
    int32_t skillCSPoint = 0;     // 原 UCHAR
    int32_t skillPageNumber = 0;  // 原 UCHAR
};
struct SkillPageSlotRow
{
    int32_t pageNumber = 1;       // 原 int iSkillPageNumber（UCHAR 來源）
    int32_t slot[4] = { 0, 0, 0, 0 };
};
struct SkillSlotBRow
{
    int32_t pageNumber = 1;
    int32_t slot[4] = { 0, 0, 0, 0 };
    std::string endDate = "2000-01-01 00:00:00";
};
// gup_get_cash_skill_point_info 對應（原返回 short iCSPoint, short iMaxCSPoint, wstring wstrCSPointEndDate；BeginFetch 失敗 → 0/0/哨兵）。
struct CashSkillPointValues
{
    int csPoint = 0;
    int maxCSPoint = 0;
    std::string endDate = "2000-01-01 00:00:00";   // EndDate（'YYYY-MM-DD HH:MM:SS' UTC）
};
struct SkillPageState
{
    int32_t pagesAvailable = 1;   // P_GSkill_Expand_SEL SKILLPageCNT；缺列 → 1；<1 修正為 1（原 0 會傳出 0 頁 Not1::技能頁）
    int32_t activePage = 1;       // P_GSkill_Expand_SEL ActivePage；缺列 → 1；<1 或 >pagesAvailable → 1（原 clamps）
    std::vector<SkillPageLearned> skills;        // ORDER BY SkillPageNumber, SkillID（原 proc ORDER BY 未知；V2 固定，§0a23 偏差）
    std::vector<SkillPageSlotRow> slotA;         // ORDER BY SkillPageNumber
    std::vector<SkillSlotBRow> slotB;            // ORDER BY SkillPageNumber
    std::string skillSlotBEndDate = "2000-01-01 00:00:00";  // slotB 最後一列（V2＝ORDER BY 最高頁）之 EndDate；無列 → 哨兵
    std::vector<int32_t> unsealed;               // ORDER BY SkillID
};

// GSpirit 讀回（原 gup_get_unit_info_by_unituid 的 @iSpirit/@iAllSpirit 與 gup_select_unit 的 @iSpirit/@bSpiritFlag）。
// 缺列 → {0, 0}（原 stored proc 讀到 NULL，FETCH 後呼叫端以 0/false 使用；非錯誤）。
struct SpiritValues
{
    int spirit = 0;
    int flag   = 0;   // 原 bit（DF_GSpirit_Flag：0=一般/1=當日已用？實際語意由原碼管理；V2 如實保存）
};

// GResurrectionStone（原 dbo.GResurrectionStone）讀回；缺列 → false（不視為錯誤）。
struct ResurrectionStoneValues
{
    int quantity = 0;
};

// 任務讀回（SELECT_UNIT_2_NOT 的資料源，§0a11）。db 層不依賴 server 層型別 → 以自有記錄型別帶出，讀取端轉換。
//   QuestRecord：原 gup_get_quest_list（SERV_ALL_RENEWAL_SP 未定義 → 本建置實際路徑）：SELECT QuestID, SubQuest0..4 FROM GQuests
//   QuestCompleteRecord：原 SERV_DAILY_QUEST 分支——gup_get_quest_complete_list＋gup_get_quest_Repeat_complete_list
//     （原 call site 以 FETCH_DATA 取 QuestID + wstrCompleteDate；倉庫內 gup_get_quest_complete_list 僅 SELECT QuestID——
//      與 call site 不一致，倉庫 proc 疑似過期；V2 以表結構＋call site 為準：SELECT QuestID, CompleteDate FROM gquests_complete / gquests_repeat）
//   completeDate 以 UTC 解析（原 ConvertStringToCTime 以伺服器本地時區解析 smalldatetime → V2 一律 UTC，見 docs §0a11 偏差聲明）
struct QuestRecord
{
    int32_t  questID = 0;
    uint8_t  sub[5]  = { 0, 0, 0, 0, 0 };
};
struct QuestCompleteRecord
{
    int32_t  questID = 0;
    int64_t  completeDateEpoch = 0;    // UTC epoch seconds
};
struct TitleCompleteRecord
{
    int32_t     titleID = 0;
    std::string endDate;               // 'YYYY-MM-DD HH:MM:SS' UTC；NULL（永久）→ 空字串
    bool        endDateNull = true;    // GTitle_Complete.EndDate NULL-able
    bool        isHang = false;        // IsHang bit（原 DEFAULT 0）
};
struct TitleMissionRecord
{
    int32_t titleID = 0;
    int16_t sub[5] = { 0, 0, 0, 0, 0 };   // SubMission1..5（NULL → 0）
};
struct BlacklistRecord
{
    int64_t blockUnitUID = 0;
    std::string nickname;                // gunit_nickname.NickName；NULL → 空字串
};
struct TutorRecord
{
    int64_t     unitUID = 0;
    int64_t     exp = 0;                 // gunit.Exp（level ← EXP 換算於呼叫端——§0u 政策；原讀 b.level 欄）
    std::string nickname;                // gunit_nickname.NickName；NULL → 空字串
    std::string lastDate;                // GTutor.LastDate（'YYYY-MM-DD HH:MM:SS' UTC）；NULL → 空字串
};
struct DungeonClearRecord
{
    int32_t dungeonID = 0;       // GDungeonClear.GameMode
    int32_t maxScore = 0;
    int8_t  maxTotalRank = 0;    // tinyint
    std::string clearTime;       // CAST(RegDate AS nvarchar(19)) 原樣
};

struct TCClearRecord
{
    int32_t tcid = 0;            // GTrainingCenter.TCID
    std::string clearTime;
};

struct InventoryItemRecord
{
    int64_t itemUID = 0;
    int32_t itemID = 0;
    int8_t  usageType = 0;               // gup_get_item_list 語意：match GItemQuantity → 2；match GItemEndurance → 1（覆寫；原 proc 同序）
    int32_t quantity = 0;                // GItemQuantity.Quantity（缺列 → 0）
    int16_t endurance = -1;              // GItemEndurance.Endurance（缺列 → -1）
    int8_t  enchantLevel = 0;            // COALESCE(GItemEnchant.ELevel, 0)（缺列/NULL → 0）
    int16_t period = 0;                  // GItemPeriod.Period（缺列 → 0）
    std::string expirationDate;          // GItemPeriod.ExpirationDate 原樣（缺列 → ""）
    int32_t socket[4] = { 0, 0, 0, 0 };  // GItemSocket.Socket1..4（缺列 → 全 0，proc 暫存表預設）
    int8_t  attrib[3] = { 0, 0, 0 };     // GItemAttribute（ESI_SLOT_1..3 → attrib0..2；僅 InventoryCategory IN (1,9)；缺列 → 全 0）
    int8_t  slotCategory = 0;            // gitem.InventoryCategory
    int16_t slotID = 0;                  // gitem.SlotID
};
struct ConnectTimeEventRecord
{
    int32_t     eventUID = 0;            // GIs30Min.EventType（原 proc：SELECT EVENTTYPE, REGDATE）
    std::string eventTime;               // GIs30Min.RegDate；NULL → 空字串
};

// GDenyOption 讀回 → SELECT_UNIT_4_NOT kDenyOptions（原 gup_select_unit 的 DBE ACK 一併回傳；V2 §0a9）。
// 缺列（如舊庫未補建角衛星列）→ 1（DOS_OFF），鏡像原 gup_get_community_opt_unituid 的 missing→1 慣例
//   （DOS_ON=0 / DOS_OFF=1 / DOS_ONLY_FRIEND=2）。QuestionNo 1..6 ↔ FriendShip/InviteGuild/Party/PersonalTrade/
//   RequestCouple/InvitePracticePVP；7+ 未知 QuestionNo 忽略。
// 注意：原 JP INT_INTERNAL 走 SERV_RELATIONSHIP_SYSTEM → P_GDenyOption_SEL（6 欄），該 proc **不隨倉庫提供**；
//   V2 以 gdenyoption（§0a5 建角寫入 1..4）＋缺列→1 之慣例近似。
struct DenyOptionValues
{
    int friendShip = 1;
    int inviteGuild = 1;
    int party = 1;
    int personalTrade = 1;
    int requestCouple = 1;        // SERV_RELATIONSHIP_SYSTEM（gup_create_unit 不建 QN=5 列 → 恆預設 1，誠實缺口）
    int invitePracticePVP = 1;    // 同上（QN=6）
};

enum class NicknameCheckResult
{
    Available,      // 可用
    Taken,          // 原 gup_check_nickname -1：暱稱已存在
    InCooldown,     // 原 gup_check_nickname -2：暱稱 14 天冷卻期內
    DbError         // 基礎設施錯誤（err 有訊息）
};

enum class CreateUnitResult
{
    Ok,                  // 0（原 iOK=0）
    UserNotFoundOrDeleted, // 原 -1：GUser 不存在或已刪除
    NicknameTaken,       // 原 -2：暱稱已被使用
    CapacityReached,     // 原 -3：已達 USSize 角色上限
    NicknameInCooldown,  // 原 -222：暱稱在刪除 14 天冷卻期內
    DbError              // 基礎設施錯誤（err 有訊息）
};

class GameStore
{
public:
    explicit GameStore(Database& db) : m_db(db) {}

    // gup_get_user_info 對應：不存在則以 USSize=50 建立（事務化），回傳建立的記錄。
    bool GetOrCreateGUser(int64_t userUID, const std::string& userID,
                          GUserRecord& out, std::string& err);

    // 讀取 GUser；找不到 → found=false（err 空）；DB 錯誤 → false + err
    bool GetGUser(int64_t userUID, GUserRecord& out, bool& found, std::string& err);

    // gup_create_unit 對應；成功回傳 Ok 且 unitUID 有效。
    //  nickname 長度檢查 1..16（原 nvarchar(16)），違反視為 DbError？否——回傳 NicknameTaken 語意外故
    //  以參數驗證先行：nickname/unitClass 不符 → false + err（程式錯誤，非業務拒絕）。
    //  副作用（§0a5，同一 transaction，失敗整體 ROLLBACK → DbError）：gquests(QuestID=13,SubQuest0=1，所有職業)、
    //  gskill/gskillslotnew/gskillexpand（僅 class 1..4：SkillID 10000/20030/30000/40010；class 5..9 忠實原碼——無技能列；v14 起 legacy gskillslot 不再寫入，§0a23）、
    //  gspirit（Spirit←gresurrectionstonecnt 第一列 StartSpirit；缺列/NULL → 0；Flag=0）、gdenyoption(QuestionNo 1..4, CodeNo=1)。
    CreateUnitResult CreateUnit(int64_t userUID, const std::string& nickname, int unitClass,
                                int64_t& unitUIDOut, std::string& err);

    // 列出未刪除角色（依 UnitUID 升序），含暱稱
    bool ListUnitsByUserUID(int64_t userUID, std::vector<GUnitRecord>& out, std::string& err);

    // 依 UnitUID 取單一角色（含暱稱）；單一角色查詢不過濾 Deleted（呼叫端判斷）
    bool GetUnitByUID(int64_t unitUID, GUnitRecord& out, bool& found, std::string& err);

    // 軟刪除：DelDate=now（Deleted 生成欄隨之變 1）+ 暱稱寫入 GDeletedNickNameHistory；事務化。
    // 已刪除（DelDate≠RegDate）→ found=false 回傳 true（冪等）；不存在 → false + err
    bool SoftDeleteUnit(int64_t unitUID, std::string& err);
    // 原 P_GUnit_CreateCNT_GET：計算本使用者「今日」建立（未刪除）的角色數。今日=本機 UTC 日（server day）。
    bool CountUnitsCreatedTodayByUser(int64_t userUID, int& count, std::string& err);
    // 原 gup_check_nickname 語意：暱稱可用性（僅查詢；不寫入）。
    NicknameCheckResult CheckNicknameAvailable(const std::string& nickname, std::string& err,
                                               int64_t excludeUnitUID = 0);   // 排除指定角色自身（改名情境）
    // 原 gup_restore_nickname 語意：變更角色暱稱（非 bCheckOnly 分支）。事務化；
    // 舊暱稱寫入 gdeleted_nickname_history（對應 CreateUnit/SoftDeleteUnit 的 14 天冷卻機制）。
    enum class ChangeNicknameResult
    {
        Ok,                  // 0（原 iOK=0）
        UnitNotFoundOrDeleted, // 原 -1 → ERR_RESTORE_NICK_NAME_00
        NotRestorable,       // 原 -2 → ERR_RESTORE_NICK_NAME_01（V2 未使用路徑，保留映射）
        Taken,               // 原 -3 → ERR_RESTORE_NICK_NAME_02
        InCooldown,          // 原 -4 → ERR_RESTORE_NICK_NAME_03
        Failure,             // 原 -5 → ERR_RESTORE_NICK_NAME_04
        DbError              // 基礎設施錯誤（err 有訊息）
    };
    ChangeNicknameResult ChangeUnitNickname(int64_t unitUID, const std::string& newNickname, std::string& err);

    // 角色登入：LoginCount+1、LastDate=now（不修改 PlayDayCnt——原版對應邏輯分散於多個 proc，未移植）
    bool RecordUnitLogin(int64_t unitUID, std::string& err);

    // SELECT_UNIT 登入副作用（原 gup_select_unit 的 DB 部分；不含 Statistics DB 的 StatsStoneCnt 統計、
    //   SERV_ACCUMULATION_SPIRIT_SYSTEM 變體、GAME01/GAME02 跨庫寫法）：
    //   1) GSpirit 每日重置：以 gspirit.RegDate（+9h 轉 KST、+18h、取日期、該日 06:00 KST） < now(KST) 為條件，
    //      成立 → Spirit=IFNULL(gresurrectionstonecnt.StartSpirit,0)、Flag=0、RegDate=now。
    //      （原 stored proc 每日 06:00 重置復活石/精力；V2 以 UTC 儲存時間，KST 邊界於 SQL 內換算）
    //   2) 復活石每日補充：以 GUnit.LastDate（同法換算 06:00 KST） < now(KST) 為條件，成立 →
    //      無 gresurrectionstone 列 → INSERT (UnitUID, IFNULL(StartCnt,0))；
    //      有列且 Quantity < IFNULL(SupplyCnt,0) → UPDATE Quantity=SupplyCnt。
    //   3) PlayDayCnt+1（LastDate 與 now 的日期不同時）；
    //   4) LoginCount+1、LastDate=now（與 RecordUnitLogin 相同）。
    // 單事務；任一步失敗整體 ROLLBACK。unitUID 不存在/已刪除 → false + err。
    bool ApplyUnitLoginReset(int64_t unitUID, std::string& err);

    // 讀取 GSpirit（缺列 → {0,0}，非錯誤）
    bool GetSpiritValues(int64_t unitUID, SpiritValues& out, std::string& err);

    // 讀取 GDenyOption（缺列 → 全 1（DOS_OFF），非錯誤；不存在檢查——原 proc 亦不檢查）
    bool GetDenyOptions(int64_t unitUID, DenyOptionValues& out, std::string& err);

    // 讀取進行中的任務（原 gup_get_quest_list；unit 不存在/已刪除也回空列表（原 proc 不檢查）；DB 錯誤 → false）
    bool GetQuestList(int64_t unitUID, std::vector<QuestRecord>& out, std::string& err);

    // 讀取已完成任務（SERV_DAILY_QUEST：GQuests_Complete（先）∪ GQuests_Repeat（後）；非 Repeat 表忠實保留無 PK）
    // completeDate 解析失敗 → false＋err（整個讀回視為 DB 錯誤，不回傳部分資料）
    bool GetQuestCompleteList(int64_t unitUID, std::vector<QuestCompleteRecord>& out, std::string& err);

    // 讀取已獲得稱號（原 gup_get_title_list；unit 不存在也回空列表（原 proc 不檢查）；
    // V2 加 ORDER BY TitleID ASC（原無 ORDER BY，僅為輸出確定性））
    bool GetTitleCompleteList(int64_t unitUID, std::vector<TitleCompleteRecord>& out, std::string& err);

    // 讀取稱號任務進度（原 gup_get_title_mission_list；同上）
    bool GetTitleMissionList(int64_t unitUID, std::vector<TitleMissionRecord>& out, std::string& err);

    // 讀取聊天黑名單（原 gup_select_blacklist：GBlackList ∩ gunit_nickname；deleted/無 nickname 列之對手方，暱稱 → 空字串）
    bool GetBlacklist(int64_t unitUID, std::vector<BlacklistRecord>& out, std::string& err);

    // 讀取稱號（사제）對象（原 gup_get_tutor，isTeacher=false → 讀「我的老師」（我是學生）、true → 「我的學生」（我是老師））：
    //   gtutor.Deleted = 0（生成欄位，鏡像原 CASE WHEN RegDate = DelDate THEN 0 ELSE 1 END）
    //   level ← 呼叫端以 gunit.Exp 換算（§0u 政策）；原 proc 於學生分支會 UPDATE GTutor SET LastDate=now——
    //   V2 SELECT 唯讀，不改寫 LastDate（見 docs §0a13 偏差聲明）
    bool GetTutorInfo(bool isTeacher, int64_t unitUID, std::vector<TutorRecord>& out, std::string& err);

    // 讀取 30 分鐘連線事件（原 gup_select_30min：GIs30Min WHERE UnitUID=?）；
    //   帳號級事件（gup_select_event_account_nor／gup_get_remaintime）表不在倉庫 → 不提供（見 docs §0a13）
    bool GetConnectTimeEvents(int64_t unitUID, std::vector<ConnectTimeEventRecord>& out, std::string& err);

    // 讀取各類別背包格數（原 gup_get_inventory_size；V2 以 category GROUP BY SUM(NumSlot) 現實語義實作，
    //   原 proc 的 GROUP BY NumSlot, InventoryCategory 為疑似 bug，見 docs §0a14 偏差聲明）
    bool GetInventorySlotSize(int64_t unitUID, std::map<int32_t, int32_t>& out, std::string& err);

    // 讀取背包物品（GItem；Deleted=0；ORDER BY InventoryCategory, SlotID 確定性輸出）
    // 衛星表（GItemQuantity/GItemEndurance/GItemEnchant/GItemPeriod/GItemSocket）不在倉庫 →
    //   quantity=0 / endurance=-1 / enchantLevel=0 / period=0 / sockets=0（gup_get_item_list 暫存表預設值）
    bool GetInventoryItems(int64_t unitUID, std::vector<InventoryItemRecord>& out, std::string& err);
    // GItemAttribute 讀回（原 gup_get_attribute：category IN (1,9)）：每筆 (ItemUID, ESI_SLOT 0..2, Attribute)。
    // GetInventoryItems 內部已合併；此方法供需要逐列檢視的呼叫端（測試用）。
    bool GetItemAttributes(int64_t unitUID, std::vector<std::tuple<int64_t, int32_t, int32_t>>& out, std::string& err);
    // 찜 리스트（GItemWishList；§0a21；gup_get_WishList/gup_update_WishList 語義）
    //   GetWishList：只回傳 ItemID > 0 的列（proc 過濾）且 ORDER BY SlotNo（原無序；偏差明示）；NULL SlotNo 略過
    static constexpr int kWishListSlotMax = 21;   // 原 SLOT_MAX=21
    bool GetWishList(int64_t userUID, std::map<int32_t, int32_t>& out, std::string& err);
    // 讀完整 21 槽快照（ItemID=0/ NULL 皆歸零；越界略過）——modify handler 的讀態用
    bool GetWishListSlots(int64_t userUID, std::array<int32_t, kWishListSlotMax>& slots, std::string& err);
    // 單一 transaction upsert 所有 (slot, itemID)：row 存在→UPDATE ItemID；否則 INSERT（gup_update_WishList 語義）；
    // 每條影響列數必須為 1（否則 -2 式失敗、rollback）。
    bool ApplyWishListChanges(int64_t userUID, const std::vector<std::pair<int32_t, int32_t>>& upserts, std::string& err);

    // Upsert GDenyOption QN1..6（EGS_UPDATE_COMMUNITY_OPTION_REQ 的 write-through，§0a10）。
    // unit 不存在/已刪除 → false＋err（鏡像 gup_update_community_opt 的 -1「該 Unit 不存在」）；
    // 缺列 → INSERT，有列 → UPDATE CodeNo；6 列於同一 transaction（原 proc 的
    // 「無列 → INSERT 4 列／有列 → CASE UPDATE」雙分支之擴充，擴至 QN1..6）。
    bool UpdateDenyOptions(int64_t unitUID, const DenyOptionValues& v, std::string& err);

    // 讀取 GResurrectionStone（缺列 → false，非錯誤；供測試/除錯）
    bool GetResurrectionStone(int64_t unitUID, ResurrectionStoneValues& out, std::string& err);
    // 技能頁系統讀回（§0a23；2013 路徑反推）：gskillexpand（缺列 → 1/1，不寫回）→ gskill（過濾 ID>0 Level>0）
    //   → gskillslotnew（**整表缺列且 pagesAvailable>=1 時自癒**：單一 transaction INSERT 0,0,0,0 × pagesAvailable，
    //     對應原 select-unit 路徑 !bConductedOnceAtLeast 的 INSERT 副作用；insert 失敗整體 ROLLBACK → false）
    //   → gskillslot2new（缺列不寫回；哨兵 EndDate）→ gskillunsealed。
    //   DB 錯誤（含缺表）→ false + err（呼叫端映射 ERR_SELECT_UNIT_05）；缺資料列皆為預設值，非錯誤。
    bool LoadSkillPageState(int64_t unitUID, SkillPageState& out, std::string& err);
    // 現金技能點讀回（§0a23；原 gup_get_cash_skill_point_info／P_GSkill_Cash_SEL）：缺列 → {0,0,哨兵 EndDate}，非錯誤；
    //   DB 錯誤（含缺表）→ false + err（呼叫端映射 ERR_SELECT_UNIT_05）。
    bool GetCashSkillPoint(int64_t unitUID, CashSkillPointValues& out, std::string& err);
    // GDungeonClear / GTrainingCenter（§0a18；原 gup_get_dungeon_clear / gup_get_tc_clear）
    bool GetDungeonClears(int64_t unitUID, std::vector<struct DungeonClearRecord>& out, std::string& err);
    bool GetTCClears(int64_t unitUID, std::vector<struct TCClearRecord>& out, std::string& err);
    // GRecommend（§0a15）：SELECT OldUID FROM grecommend WHERE NewUID = ? ORDER BY RegDate ASC LIMIT 1。
    // found=false → 缺列（= 原 @iOldUID 預設 0，非錯誤）；DB 錯誤 → false。
    bool GetRecommendOldUID(int64_t newUID, int64_t& outOldUID, bool& found, std::string& err);
    // 重複配裝修復（§0a19；原 Query_SelectUnit 的 bResetTitle 路徑）：
    //   UPDATE gtitle_complete SET IsHang = 0 WHERE UnitUID = ?；
    //   UPDATE gtitle_complete SET IsHang = 1 WHERE UnitUID = ? AND TitleID = ?；
    // 單一 transaction；失敗整體 rollback、回傳 false（呼叫端可記錄後續行，原碼僅 log 不中斷選角）。
    bool RepairDuplicateEquippedTitle(int64_t unitUID, int32_t equippedTitleID, std::string& err);
    // 稱號配裝寫入（§0a20；原 gup_update_title_hang 等價 SQL，SERV_TITLE_DATA_SIZE 語義）：
    //   newTitleID == 0 → UPDATE gtitle_complete SET IsHang = 0 WHERE UnitUID = ?（proc @iTitleID=0 全脫）；
    //   否則 → 先脫 oldTitleID（≠0 才執行；proc @iOldID），再掛 newTitleID（proc @iTitleID）。
    // 單一 transaction；attach 前驗證持有列存在；失敗 → rollback + false。
    bool EquipTitleHang(int64_t unitUID, int32_t oldTitleID, int32_t newTitleID, std::string& err);
    // 技能欄位寫入（§0a24；原 DBE_UPDATE_UNIT_INFO_REQ → Query_UpdateSkillSlotInfo 的作用頁版，write-through）：
    //   upsert gskillslotnew（Slot01..04）與 gskillslot2new（Slot01..04 ＋ EndDate←slotBEndDate，unit-global 值＝原 flush 行為）；
    //   缺列 → INSERT；EndDate 空 → 哨兵 '2000-01-01 00:00:00'。pageNumber 必須 >= 1。
    // 單一 transaction；任一步驟失敗 → rollback + false。
    bool UpdateSkillSlots(int64_t unitUID, int32_t pageNumber, const int32_t (&slotA)[4], const int32_t (&slotB)[4],
                          const std::string& slotBEndDate, std::string& err);
    // 技能重置提交（§0a25；原 DBE_RESET_SKILL_REQ 的 GSGameDBThread 路徑之 V2 單一 transaction 版）：
    //   (1) gitemquantity Quantity -= 1 WHERE ItemUID=? AND Quantity >= 1（原 gup_update_item PT_QUANTITY delta=-1；
    //       影響列數 != 1 → failStage=ItemSeek/Item → false → 呼叫端映射 ERR_RESET_SKILL_02）；
    //       新數量 == 0 → gitem 以原 gup_delete_item 慣例軟刪除（DelDate = max(nowUtc, RegDate+1s) → Deleted 翻 1），
    //       gitemquantity 列保留 Quantity=0（原同：gup_update_item 先減量、gup_delete_item 不動數量列）。
    //   (2) 技能列：levelAfter <= 0 → DELETE FROM gskill WHERE UnitUID/SkillID/SkillPageNumber（= 作用頁；影響列數 != 1 → Skill）；
    //       否則 UPDATE gskill SET SkillLevel=levelAfter, SkillCSPoint=0（同上影響列數檢查）。
    //   (3) gunit.SPoint += sPointDelta（可為負——原 SP 可倒扣；失敗 → SPoint）。
    //   (4) gskillcash upsert CSPoint=csPoint（原 m_iCSPoint>=0 才更新；V2 為自洽一律寫入——見 docs §0a25 偏差）。
    // 單一 transaction；任一步驟失敗 → 整體 rollback + false。failStage 指出失敗階段（None/Item/Skill/SPoint/CashPoint）。
    enum class ResetSkillFailure { None, Item, Skill, SPoint, CashPoint };
    struct ResetSkillCommit
    {
        int64_t itemUID = 0;
        int32_t itemNewQuantity = 0;   // 消耗後數量；0 ＝ 已刪除（itemDeleted=true）
        bool    itemDeleted = false;   // 消耗使數量歸零 → gitem 已標記刪除
        int32_t skillLevelAfter = 0;   // 重置後技能等級（0 → gskill 列已刪除；1 → 預設技能保留）
        int32_t sPointAbsolute = 0;    // gunit.SPoint 新絕對值
        int32_t csPoint = 0;           // gskillcash.CSPoint 新值
    };
    bool CommitResetSkill(int64_t unitUID, int64_t itemUID, int32_t activePage,
                          int32_t delSkillID, int32_t skillLevelAfter,
                          int32_t sPointDelta, int32_t newCSPoint,
                          const std::string& nowUtc,
                          ResetSkillCommit& out, ResetSkillFailure& failStage,
                          std::string& err);

private:
    Database& m_db;

    static bool ReadUnitRow(Statement& st, GUnitRecord& out);
};

}} // namespace x2::db
