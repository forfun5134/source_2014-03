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

#include "Sqlite.h"

namespace x2 { namespace db {

inline constexpr int kGameSchemaVersion = 5;

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
    //  gskill/gskillslot（僅 class 1..4：SkillID 10000/20030/30000/40010；class 5..9 忠實原碼——無技能列）、
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

    // Upsert GDenyOption QN1..6（EGS_UPDATE_COMMUNITY_OPTION_REQ 的 write-through，§0a10）。
    // unit 不存在/已刪除 → false＋err（鏡像 gup_update_community_opt 的 -1「該 Unit 不存在」）；
    // 缺列 → INSERT，有列 → UPDATE CodeNo；6 列於同一 transaction（原 proc 的
    // 「無列 → INSERT 4 列／有列 → CASE UPDATE」雙分支之擴充，擴至 QN1..6）。
    bool UpdateDenyOptions(int64_t unitUID, const DenyOptionValues& v, std::string& err);

    // 讀取 GResurrectionStone（缺列 → false，非錯誤；供測試/除錯）
    bool GetResurrectionStone(int64_t unitUID, ResurrectionStoneValues& out, std::string& err);

private:
    Database& m_db;

    static bool ReadUnitRow(Statement& st, GUnitRecord& out);
};

}} // namespace x2::db
