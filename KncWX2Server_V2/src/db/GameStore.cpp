// GameStore.cpp — 見 GameStore.h 檔頭的語意對照與誠實說明
#include "GameStore.h"

namespace x2 { namespace db {

static const char* kCreateGUserV1 = R"SQL(
CREATE TABLE guser (
    UserUID   INTEGER PRIMARY KEY,
    UserID    TEXT NOT NULL CHECK (length(UserID) BETWEEN 1 AND 50),
    USSize    INTEGER NOT NULL DEFAULT 50 CHECK (USSize BETWEEN 0 AND 255),
    RegDate   TEXT NOT NULL DEFAULT (datetime('now')),
    DelDate   TEXT NOT NULL DEFAULT (datetime('now')),
    Deleted   INTEGER GENERATED ALWAYS AS (CASE WHEN RegDate = DelDate THEN 0 ELSE 1 END) STORED
);
)SQL";

static const char* kCreateGUnitV1 = R"SQL(
CREATE TABLE gunit (
    UnitUID       INTEGER PRIMARY KEY AUTOINCREMENT,
    UserUID       INTEGER NOT NULL REFERENCES guser(UserUID),
    UnitClass     INTEGER NOT NULL CHECK (UnitClass BETWEEN 0 AND 255),
    Exp           INTEGER NOT NULL DEFAULT 0 CHECK (Exp >= 0),
    Level         INTEGER NOT NULL DEFAULT 1 CHECK (Level BETWEEN 1 AND 255),
    GamePoint     INTEGER NOT NULL DEFAULT 0,
    VSPoint       INTEGER NOT NULL DEFAULT 0,
    VSPointMax    INTEGER NOT NULL DEFAULT 0,
    BaseHP        INTEGER NOT NULL DEFAULT 0 CHECK (BaseHP BETWEEN 0 AND 32767),
    AtkPhysic     INTEGER NOT NULL DEFAULT 0 CHECK (AtkPhysic BETWEEN 0 AND 255),
    AtkMagic      INTEGER NOT NULL DEFAULT 0 CHECK (AtkMagic BETWEEN 0 AND 255),
    DefPhysic     INTEGER NOT NULL DEFAULT 0 CHECK (DefPhysic BETWEEN 0 AND 255),
    DefMagic      INTEGER NOT NULL DEFAULT 0 CHECK (DefMagic BETWEEN 0 AND 255),
    SPoint        INTEGER NOT NULL DEFAULT 1,
    Win           INTEGER NOT NULL DEFAULT 0,
    Lose          INTEGER NOT NULL DEFAULT 0,
    Seceder       INTEGER NOT NULL DEFAULT 0,
    RegDate       TEXT NOT NULL DEFAULT (datetime('now')),
    DelDate       TEXT NOT NULL DEFAULT (datetime('now')),
    LastDate      TEXT NOT NULL DEFAULT (datetime('now')),
    LastPosition  INTEGER NOT NULL DEFAULT 20000,
    PlayDayCnt    INTEGER NOT NULL DEFAULT 0,
    LoginCount    INTEGER NOT NULL DEFAULT 0,
    Deleted       INTEGER GENERATED ALWAYS AS (CASE WHEN RegDate = DelDate THEN 0 ELSE 1 END) STORED
);
CREATE INDEX ix_gunit_useruid ON gunit(UserUID) WHERE Deleted = 0;
)SQL";

static const char* kCreateGUnitNickNameV1 = R"SQL(
-- NickName 允許 NULL：軟刪除時釋放暱稱（SET NickName = NULL，對照 gup_delete_unit），
-- SQLite UNIQUE 允許多個 NULL，且建立流程的 NicknameTaken 檢查以 `= ?` 比對不會命中 NULL 列
CREATE TABLE gunit_nickname (
    UnitUID   INTEGER PRIMARY KEY REFERENCES gunit(UnitUID),
    NickName  TEXT UNIQUE CHECK (NickName IS NULL OR length(NickName) BETWEEN 1 AND 16),
    RegDate   TEXT NOT NULL DEFAULT (datetime('now'))
);
)SQL";

static const char* kCreateGDeletedNickNameHistoryV1 = R"SQL(
CREATE TABLE gdeleted_nickname_history (
    NickName  TEXT NOT NULL CHECK (length(NickName) BETWEEN 1 AND 16),
    UnitUID   INTEGER NOT NULL,
    RegDate   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX ix_gdeleted_nickname ON gdeleted_nickname_history(NickName, RegDate);
)SQL";

// --- v2（§0a5）：原 gup_create_unit 衛星副作用所需表 ---
static const char* kCreateGDenyOptionV2 = R"SQL(
CREATE TABLE gdenyoption (
    UnitUID    INTEGER NOT NULL REFERENCES gunit(UnitUID),
    QuestionNo INTEGER NOT NULL CHECK (QuestionNo BETWEEN 1 AND 255),
    CodeNo     INTEGER NOT NULL CHECK (CodeNo BETWEEN 0 AND 255),
    PRIMARY KEY (UnitUID, QuestionNo)
);
)SQL";

static const char* kCreateGQuestsV2 = R"SQL(
CREATE TABLE gquests (
    UnitUID   INTEGER NOT NULL REFERENCES gunit(UnitUID),
    QuestID   INTEGER NOT NULL,
    SubQuest0 INTEGER NOT NULL DEFAULT 0 CHECK (SubQuest0 BETWEEN 0 AND 255),
    SubQuest1 INTEGER NOT NULL DEFAULT 0 CHECK (SubQuest1 BETWEEN 0 AND 255),
    SubQuest2 INTEGER NOT NULL DEFAULT 0 CHECK (SubQuest2 BETWEEN 0 AND 255),
    SubQuest3 INTEGER NOT NULL DEFAULT 0 CHECK (SubQuest3 BETWEEN 0 AND 255),
    SubQuest4 INTEGER NOT NULL DEFAULT 0 CHECK (SubQuest4 BETWEEN 0 AND 255),
    RegDate   TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (UnitUID, QuestID)
);
)SQL";

static const char* kCreateGSkillV2 = R"SQL(
CREATE TABLE gskill (
    UnitUID INTEGER NOT NULL REFERENCES gunit(UnitUID),
    SkillID INTEGER NOT NULL,
    RegDate TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (UnitUID, SkillID)
);
)SQL";

static const char* kCreateGSkillSlotV2 = R"SQL(
CREATE TABLE gskillslot (
    UnitUID INTEGER NOT NULL PRIMARY KEY REFERENCES gunit(UnitUID),
    Slot01  INTEGER NOT NULL,
    Slot02  INTEGER NOT NULL,
    Slot03  INTEGER NOT NULL
);
)SQL";

static const char* kCreateGSpiritV2 = R"SQL(
CREATE TABLE gspirit (
    UnitUID INTEGER NOT NULL PRIMARY KEY REFERENCES gunit(UnitUID),
    Spirit  INTEGER NOT NULL,
    RegDate TEXT NOT NULL DEFAULT (datetime('now')),
    Flag    INTEGER NOT NULL DEFAULT 0 CHECK (Flag IN (0, 1))   -- 原 DF_GSpirit_Flag DEFAULT(0)
);
)SQL";

static const char* kCreateGResurrectionStoneV3 = R"SQL(
-- 原 dbo.GResurrectionStone（角色級復活石持有量；gup_select_unit 每日補充）。§0a8。
CREATE TABLE gresurrectionstone (
    UnitUID  INTEGER NOT NULL PRIMARY KEY REFERENCES gunit(UnitUID),
    Quantity INTEGER NOT NULL DEFAULT 0
);
)SQL";

static const char* kCreateGResurrectionStoneCntV2 = R"SQL(
-- 單列全域設定表（原 dbo.GResurrectionStoneCnt；StartSpirit=GSpirit 起始值來源）。倉庫無 seed 資料 → V2 不預置列。
CREATE TABLE gresurrectionstonecnt (
    StartCnt    INTEGER,
    SupplyCnt   INTEGER,
    StartSpirit INTEGER
);
)SQL";

// --- v4（§0a9）：gdenyoption 重建 —— CodeNo 允許 0（= DOS_ON）。
// v2 建表時 CodeNo CHECK 為 1..255，擋掉原 tinyint 合法值 DOS_ON=0；
// 原 dbo.GDenyOption 為 tinyint 且無範圍限制（KDenyOptions DOS_ON=0/DOS_OFF=1/DOS_ONLY_FRIEND=2）。
// SQLite 無法在原位改 CHECK → 整表重建（migrate 於單一 transaction，失敗整體 ROLLBACK）。
static const char* kMigrateGDenyOptionV4 = R"SQL(
CREATE TABLE gdenyoption_v4 (
    UnitUID    INTEGER NOT NULL REFERENCES gunit(UnitUID),
    QuestionNo INTEGER NOT NULL CHECK (QuestionNo BETWEEN 1 AND 255),
    CodeNo     INTEGER NOT NULL CHECK (CodeNo BETWEEN 0 AND 255),
    PRIMARY KEY (UnitUID, QuestionNo)
);
INSERT INTO gdenyoption_v4 (UnitUID, QuestionNo, CodeNo) SELECT UnitUID, QuestionNo, CodeNo FROM gdenyoption;
DROP TABLE gdenyoption;
ALTER TABLE gdenyoption_v4 RENAME TO gdenyoption;
)SQL";

// --- v5（§0a11）：原 dbo.GQuests_Complete／dbo.GQuests_Repeat（SERV_DAILY_QUEST 的已完成任務表）。
// 原表：UnitUID bigint NOT NULL（FK→GUnit ON DELETE CASCADE）、QuestID int NOT NULL、RegDate／CompleteDate smalldatetime NOT NULL；
// GQuests_Complete 有 PK(UnitUID, QuestID)；GQuests_Repeat 無 PK（忠實保留）。V2 時間一律 UTC TEXT。
static const char* kCreateGQuestsCompleteV5 = R"SQL(
CREATE TABLE gquests_complete (
    UnitUID      INTEGER NOT NULL REFERENCES gunit(UnitUID) ON DELETE CASCADE,
    QuestID      INTEGER NOT NULL,
    RegDate      TEXT NOT NULL DEFAULT (datetime('now')),
    CompleteDate TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (UnitUID, QuestID)
);
)SQL";
static const char* kCreateGQuestsRepeatV5 = R"SQL(
CREATE TABLE gquests_repeat (
    UnitUID      INTEGER NOT NULL REFERENCES gunit(UnitUID) ON DELETE CASCADE,
    QuestID      INTEGER NOT NULL,
    RegDate      TEXT NOT NULL DEFAULT (datetime('now')),
    CompleteDate TEXT NOT NULL DEFAULT (datetime('now'))
);
)SQL";

// GTitle_Complete：PK(UnitUID, TitleID)、EndDate NULL（永久）、IsHang bit NOT NULL DEFAULT 0（原 DF__GTitle_Co__IsHan__222B06A9 DEFAULT(0)）、FK→gunit ON DELETE CASCADE ON UPDATE CASCADE
// GTitle_Mission：PK(UnitUID, TitleID)；SubMission1..5 smallint NULL-able（V2 收斂為 NOT NULL DEFAULT 0；NULL → ODBC 讀回失敗換算 0 之近似，見 docs §0a12 偏差聲明）
static const char* kCreateGTitleCompleteV6 = R"SQL(
CREATE TABLE gtitle_complete (
    UnitUID  INTEGER NOT NULL REFERENCES gunit(UnitUID) ON DELETE CASCADE ON UPDATE CASCADE,
    TitleID  INTEGER NOT NULL CHECK (TitleID BETWEEN -32768 AND 32767),
    EndDate  TEXT,
    IsHang   INTEGER NOT NULL DEFAULT 0 CHECK (IsHang BETWEEN 0 AND 1),
    PRIMARY KEY (UnitUID, TitleID)
);
)SQL";
static const char* kCreateGTitleMissionV6 = R"SQL(
CREATE TABLE gtitle_mission (
    UnitUID      INTEGER NOT NULL REFERENCES gunit(UnitUID) ON DELETE CASCADE ON UPDATE CASCADE,
    TitleID      INTEGER NOT NULL CHECK (TitleID BETWEEN -32768 AND 32767),
    SubMission1  INTEGER NOT NULL DEFAULT 0 CHECK (SubMission1 BETWEEN -32768 AND 32767),
    SubMission2  INTEGER NOT NULL DEFAULT 0 CHECK (SubMission2 BETWEEN -32768 AND 32767),
    SubMission3  INTEGER NOT NULL DEFAULT 0 CHECK (SubMission3 BETWEEN -32768 AND 32767),
    SubMission4  INTEGER NOT NULL DEFAULT 0 CHECK (SubMission4 BETWEEN -32768 AND 32767),
    SubMission5  INTEGER NOT NULL DEFAULT 0 CHECK (SubMission5 BETWEEN -32768 AND 32767),
    PRIMARY KEY (UnitUID, TitleID)
);
)SQL";

// GBlackList：主鍵 (MyUID, BlockUID)；原表無 FK/無 Index（V2 加 FK CASCADE——純衛生，原語意無影響：刪除皆為軟刪除）
// GTutor：原表無 PK（heap）；RegDate/DelDate/LastDate smalldatetime NULL → V2 收斂為 NOT NULL DEFAULT (datetime('now'))（生成欄位 Deleted 需要可比字串）；
//   Deleted 為生成欄位，逐字鏡像原計算欄位 CASE WHEN [RegDate] = [DelDate] THEN 0 ELSE 1 END
// GIs30Min：原表無 PK（heap）＋IX_GIs30Min_UnitUID；V2 FK→gunit ON DELETE CASCADE
static const char* kCreateGBlacklistV7 = R"SQL(
CREATE TABLE gblacklist (
    MyUID    INTEGER NOT NULL REFERENCES gunit(UnitUID) ON DELETE CASCADE,
    BlockUID INTEGER NOT NULL REFERENCES gunit(UnitUID) ON DELETE CASCADE,
    PRIMARY KEY (MyUID, BlockUID)
);
)SQL";
static const char* kCreateGTutorV7 = R"SQL(
CREATE TABLE gtutor (
    TeacherUID INTEGER NOT NULL REFERENCES gunit(UnitUID) ON DELETE CASCADE,
    StudentUID INTEGER NOT NULL REFERENCES gunit(UnitUID) ON DELETE CASCADE,
    RegDate    TEXT NOT NULL DEFAULT (datetime('now')),
    LastDate   TEXT NOT NULL DEFAULT (datetime('now')),
    DelDate    TEXT NOT NULL DEFAULT (datetime('now')),
    Deleted    INTEGER GENERATED ALWAYS AS (CASE WHEN RegDate = DelDate THEN 0 ELSE 1 END) STORED
);
CREATE INDEX ix_gtutor_teacher ON gtutor(TeacherUID);
CREATE INDEX ix_gtutor_student ON gtutor(StudentUID);
)SQL";
static const char* kCreateGIs30MinV7 = R"SQL(
CREATE TABLE gis30min (
    UnitUID   INTEGER NOT NULL REFERENCES gunit(UnitUID) ON DELETE CASCADE,
    EventType INTEGER NOT NULL CHECK (EventType BETWEEN 0 AND 255),
    RegDate   TEXT
);
CREATE INDEX ix_gis30min_unituid ON gis30min(UnitUID);
)SQL";

// GItem：ItemUID IDENTITY(1,1) → INTEGER PRIMARY KEY AUTOINCREMENT；RegDate/DelDate smalldatetime NOT NULL；
//   Deleted AS CASE WHEN RegDate = DelDate THEN 0 ELSE 1 END（逐字鏡像原計算欄位）
// GItemInventorySize：無 PK（heap；原表即如此）＋IX_GItemInventorySize_UnitUID；FK→gunit CASCADE
static const char* kCreateGItemV8 = R"SQL(
CREATE TABLE gitem (
    ItemUID          INTEGER PRIMARY KEY AUTOINCREMENT,
    UnitUID          INTEGER NOT NULL REFERENCES gunit(UnitUID) ON DELETE CASCADE,
    ItemID           INTEGER NOT NULL,
    InventoryCategory INTEGER NOT NULL CHECK (InventoryCategory BETWEEN 0 AND 255),
    SlotID           INTEGER NOT NULL CHECK (SlotID BETWEEN 0 AND 255),
    RegDate          TEXT NOT NULL DEFAULT (datetime('now')),
    DelDate          TEXT NOT NULL DEFAULT (datetime('now')),
    Deleted          INTEGER GENERATED ALWAYS AS (CASE WHEN RegDate = DelDate THEN 0 ELSE 1 END) STORED
);
CREATE INDEX ix_gitem_unituid ON gitem(UnitUID);
)SQL";
static const char* kCreateGItemInventorySizeV8 = R"SQL(
CREATE TABLE giteminventorysize (
    UnitUID           INTEGER NOT NULL REFERENCES gunit(UnitUID) ON DELETE CASCADE,
    InventoryCategory INTEGER NOT NULL CHECK (InventoryCategory BETWEEN 0 AND 255),
    NumSlot           INTEGER NOT NULL CHECK (NumSlot BETWEEN 0 AND 255),
    RegDate           TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX ix_giteminventorysize_unituid ON giteminventorysize(UnitUID);
)SQL";

static const char* kCreateGItemSatellitesV10 = R"SQL(
CREATE TABLE gitemquantity (
    ItemUID  INTEGER PRIMARY KEY REFERENCES gitem(ItemUID) ON DELETE CASCADE,
    Quantity INTEGER NOT NULL
);
CREATE TABLE gitemendurance (
    ItemUID   INTEGER PRIMARY KEY REFERENCES gitem(ItemUID) ON DELETE CASCADE,
    Endurance INTEGER NOT NULL
);
CREATE TABLE gitemenchant (
    ItemUID INTEGER PRIMARY KEY REFERENCES gitem(ItemUID) ON DELETE CASCADE,
    ELevel  INTEGER NULL  -- 原 GItemEnchant.ELevel smallint NULL
);
CREATE TABLE gitemperiod (
    ItemUID        INTEGER PRIMARY KEY REFERENCES gitem(ItemUID) ON DELETE CASCADE,
    Period         INTEGER NOT NULL CHECK (Period BETWEEN -32768 AND 32767),
    ExpirationDate TEXT NOT NULL
);
CREATE TABLE gitemsocket (
    ItemUID INTEGER PRIMARY KEY REFERENCES gitem(ItemUID) ON DELETE CASCADE,
    Socket1 INTEGER NOT NULL DEFAULT -1,  -- 原 DF__GItemSock__Socke__* DEFAULT(-1)
    Socket2 INTEGER NOT NULL DEFAULT -1,
    Socket3 INTEGER NOT NULL DEFAULT -1,
    Socket4 INTEGER NOT NULL DEFAULT -1
);
)SQL";

static const char* kCreateGItemAttributeV11 = R"SQL(
CREATE TABLE gitemattribute (
    ItemUID   INTEGER NULL REFERENCES gitem(ItemUID) ON DELETE CASCADE,  -- 原 GItemAttribute 無 PK；ItemUID 可 NULL
    SlotNo    INTEGER NULL CHECK (SlotNo BETWEEN 0 AND 255),             -- tinyint NULL
    Attribute INTEGER NULL CHECK (Attribute BETWEEN 0 AND 255)           -- tinyint NULL
);
CREATE INDEX ix_gitemattribute_itemuid ON gitemattribute(ItemUID);
)SQL";

static const char* kCreateGDungeonClearV12 = R"SQL(
CREATE TABLE gdungeonclear (
    UnitUID      INTEGER NOT NULL REFERENCES gunit(UnitUID) ON DELETE CASCADE,
    GameMode     INTEGER NOT NULL,
    MaxScore     INTEGER NOT NULL,
    MaxTotalRank INTEGER NOT NULL CHECK (MaxTotalRank BETWEEN 0 AND 255),
    RegDate      TEXT NOT NULL,
    PRIMARY KEY (UnitUID, GameMode)
);
)SQL";
static const char* kCreateGTrainingCenterV12 = R"SQL(
CREATE TABLE gtrainingcenter (
    UnitUID INTEGER NOT NULL REFERENCES gunit(UnitUID) ON DELETE CASCADE,
    TCID    INTEGER NOT NULL,
    RegDate TEXT NOT NULL,
    PRIMARY KEY (UnitUID, TCID)
);
)SQL";

static const char* kCreateGSkillExpandV14 = R"SQL(
CREATE TABLE gskillexpand (
    UnitUID     INTEGER NOT NULL PRIMARY KEY REFERENCES gunit(UnitUID) ON DELETE CASCADE,
    PageCount   INTEGER NOT NULL DEFAULT 1 CHECK (PageCount >= 1),   -- SKILLPageCNT（缺列 → 視為 1）
    ActivePage  INTEGER NOT NULL DEFAULT 1 CHECK (ActivePage >= 1)   -- ActivePage（1-based；> PageCount/0 → LoadSkillPageState 修正為 1）
);
)SQL";

static const char* kCreateGSkillSlotNewV14 = R"SQL(
CREATE TABLE gskillslotnew (
    UnitUID         INTEGER NOT NULL REFERENCES gunit(UnitUID) ON DELETE CASCADE,
    SkillPageNumber INTEGER NOT NULL DEFAULT 1 CHECK (SkillPageNumber >= 1),   -- iSkillPageNumber
    Slot01 INTEGER NOT NULL DEFAULT 0,
    Slot02 INTEGER NOT NULL DEFAULT 0,
    Slot03 INTEGER NOT NULL DEFAULT 0,
    Slot04 INTEGER NOT NULL DEFAULT 0,
    RegDate TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (UnitUID, SkillPageNumber)
);
)SQL";

static const char* kCreateGSkillSlot2NewV14 = R"SQL(
CREATE TABLE gskillslot2new (
    UnitUID         INTEGER NOT NULL REFERENCES gunit(UnitUID) ON DELETE CASCADE,
    SkillPageNumber INTEGER NOT NULL DEFAULT 1 CHECK (SkillPageNumber >= 1),
    Slot01 INTEGER NOT NULL DEFAULT 0,
    Slot02 INTEGER NOT NULL DEFAULT 0,
    Slot03 INTEGER NOT NULL DEFAULT 0,
    Slot04 INTEGER NOT NULL DEFAULT 0,
    EndDate TEXT NOT NULL DEFAULT '2000-01-01 00:00:00',   -- m_wstrSkillSlotBEndDate（smalldatetime → UTC 文字）
    RegDate TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (UnitUID, SkillPageNumber)
);
)SQL";

static const char* kCreateGSkillUnsealedV14 = R"SQL(
CREATE TABLE gskillunsealed (
    UnitUID     INTEGER NOT NULL REFERENCES gunit(UnitUID) ON DELETE CASCADE,
    SkillID     INTEGER NOT NULL,                          -- 原 short iSkillID
    RegDate     TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (UnitUID, SkillID)
);
)SQL";

static const char* kCreateGSkillCashV14 = R"SQL(
CREATE TABLE gskillcash (
    UnitUID     INTEGER NOT NULL PRIMARY KEY REFERENCES gunit(UnitUID) ON DELETE CASCADE,
    CSPoint     INTEGER NOT NULL DEFAULT 0,                -- m_iCSPoint（原 short）
    MaxCSPoint  INTEGER NOT NULL DEFAULT 0,                -- m_iMaxCSPoint（原 short）
    EndDate     TEXT NOT NULL DEFAULT '2000-01-01 00:00:00',   -- m_wstrCSPointEndDate（原 smalldatetime）
    RegDate     TEXT NOT NULL DEFAULT (datetime('now'))
);
)SQL";

static const char* kCreateGItemWishListV13 = R"SQL(
CREATE TABLE gitemwishlist (
    UserUID INTEGER NOT NULL REFERENCES guser(UserUID) ON DELETE CASCADE ON UPDATE CASCADE,  -- 原 FK→GUser CASCADE
    SlotNo  INTEGER NULL CHECK (SlotNo BETWEEN 0 AND 32767),        -- smallint NULL（proc 無過濾）
    ItemID  INTEGER NULL,                                           -- int NULL；0 = 空槽（DelWish flush 會寫回 0）
    UNIQUE (UserUID, SlotNo)                                        -- proc 的 NOT EXISTS→INSERT / 否則 UPDATE 隱含唯一性；NULL SlotNo 不參與唯一性
);
CREATE INDEX ix_gitemwishlist_useruid ON gitemwishlist(UserUID);    -- 原 CLUSTERED IX UserUID
)SQL";

static const char* kCreateGRecommendV9 = R"SQL(
CREATE TABLE grecommend (
    OldUID        INTEGER NOT NULL,
    NewUID        INTEGER NOT NULL,
    RegDate       TEXT NULL
);
CREATE INDEX ix_grecommend_newuid ON grecommend(NewUID);
)SQL";

// 'YYYY-MM-DD HH:MM:SS'（SQLite datetime('now') 格式）以 UTC 解析為 epoch 秒（days_from_civil 演算法，平台無關）。
static bool ParseUtcDatetime(const std::string& s, int64_t& epochOut)
{
    if (s.size() < 19) return false;
    auto dig = [&s](size_t i) -> int { return s[i] - '0'; };
    for (size_t i : { 0,1,2,3,5,6,8,9,11,12,14,15,17,18 }) {
        const char c = s[i];
        if (c < '0' || c > '9') return false;
    }
    const int64_t y = dig(0)*1000 + dig(1)*100 + dig(2)*10 + dig(3);
    const unsigned mo = static_cast<unsigned>(dig(5)*10 + dig(6));
    const unsigned d  = static_cast<unsigned>(dig(8)*10 + dig(9));
    const unsigned H  = static_cast<unsigned>(dig(11)*10 + dig(12));
    const unsigned M  = static_cast<unsigned>(dig(14)*10 + dig(15));
    const unsigned S  = static_cast<unsigned>(dig(17)*10 + dig(18));
    if (mo < 1 || mo > 12 || d < 1 || d > 31 || H > 23 || M > 59 || S > 60) return false;
    // days_from_civil（Howard Hinnant, public domain）
    const int64_t yy = (mo <= 2) ? y - 1 : y;
    const int64_t era = (yy >= 0 ? yy : yy - 399) / 400;
    const unsigned yoe = static_cast<unsigned>(yy - era * 400);
    const unsigned mp = (mo + 9) % 12;
    const unsigned doy = (153 * mp + 2) / 5 + d - 1;
    const unsigned doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    const int64_t days = era * 146097 + static_cast<int64_t>(doe) - 719468;
    epochOut = days * 86400 + static_cast<int64_t>(H) * 3600 + static_cast<int64_t>(M) * 60 + static_cast<int64_t>(S);
    return true;
}

bool ApplyGameMigrations(Database& db, std::string& err)
{
    if (!db.IsOpen()) { err = "database not open"; return false; }
    const int v = db.UserVersion(err);
    if (v < 0) return false;
    if (v >= kGameSchemaVersion) { err.clear(); return true; }

    if (!db.Begin(err)) return false;
    if (v < 1) {
        if (!db.Exec(kCreateGUserV1, err) ||
            !db.Exec(kCreateGUnitV1, err) ||
            !db.Exec(kCreateGUnitNickNameV1, err) ||
            !db.Exec(kCreateGDeletedNickNameHistoryV1, err)) {
            std::string unused;
            db.Rollback(unused);
            err = std::string("game migration v1 failed: ") + err;
            return false;
        }
    }
    if (v < 2) {
        if (!db.Exec(kCreateGDenyOptionV2, err) ||
            !db.Exec(kCreateGQuestsV2, err) ||
            !db.Exec(kCreateGSkillV2, err) ||
            !db.Exec(kCreateGSkillSlotV2, err) ||
            !db.Exec(kCreateGSpiritV2, err) ||
            !db.Exec(kCreateGResurrectionStoneCntV2, err)) {
            std::string unused;
            db.Rollback(unused);
            err = std::string("game migration v2 failed: ") + err;
            return false;
        }
    }
    if (v < 3) {
        if (!db.Exec(kCreateGResurrectionStoneV3, err)) {
            std::string unused;
            db.Rollback(unused);
            err = std::string("game migration v3 failed: ") + err;
            return false;
        }
    }
    if (v < 4) {
        if (!db.Exec(kMigrateGDenyOptionV4, err)) {
            std::string unused;
            db.Rollback(unused);
            err = std::string("game migration v4 failed: ") + err;
            return false;
        }
    }
    if (v < 5) {
        if (!db.Exec(kCreateGQuestsCompleteV5, err) || !db.Exec(kCreateGQuestsRepeatV5, err)) {
            std::string unused;
            db.Rollback(unused);
            err = std::string("game migration v5 failed: ") + err;
            return false;
        }
    }
    if (v < 6) {
        if (!db.Exec(kCreateGTitleCompleteV6, err) || !db.Exec(kCreateGTitleMissionV6, err)) {
            std::string unused;
            db.Rollback(unused);
            err = std::string("game migration v6 failed: ") + err;
            return false;
        }
    }
    if (v < 7) {
        if (!db.Exec(kCreateGBlacklistV7, err) || !db.Exec(kCreateGTutorV7, err) || !db.Exec(kCreateGIs30MinV7, err)) {
            std::string unused;
            db.Rollback(unused);
            err = std::string("game migration v7 failed: ") + err;
            return false;
        }
    }
    if (v < 8) {
        if (!db.Exec(kCreateGItemV8, err) || !db.Exec(kCreateGItemInventorySizeV8, err)) {
            std::string unused;
            db.Rollback(unused);
            err = std::string("game migration v8 failed: ") + err;
            return false;
        }
    }
    if (v < 9) {
        if (!db.Exec(kCreateGRecommendV9, err)) {
            std::string unused;
            db.Rollback(unused);
            err = std::string("game migration v9 failed: ") + err;
            return false;
        }
    }
    if (v < 10) {
        if (!db.Exec(kCreateGItemSatellitesV10, err)) {
            std::string unused;
            db.Rollback(unused);
            err = std::string("game migration v10 failed: ") + err;
            return false;
        }
    }
    if (v < 11) {
        if (!db.Exec(kCreateGItemAttributeV11, err)) {
            std::string unused;
            db.Rollback(unused);
            err = std::string("game migration v11 failed: ") + err;
            return false;
        }
    }
    if (v < 12) {
        if (!db.Exec(kCreateGDungeonClearV12, err) || !db.Exec(kCreateGTrainingCenterV12, err)) {
            std::string unused;
            db.Rollback(unused);
            err = std::string("game migration v12 failed: ") + err;
            return false;
        }
    }
    if (v < 13) {
        if (!db.Exec(kCreateGItemWishListV13, err)) {
            std::string unused;
            db.Rollback(unused);
            err = std::string("game migration v13 failed: ") + err;
            return false;
        }
    }
    if (v < 14) {
        // §0a23：2013 SERV_SKILL_PAGE_SYSTEM 反推。gskill 擴充欄位；既有列 SkillLevel 補 1（= 已學基礎技能語意）、
        //   頁碼 1、CSPoint 0。gskillslot（2008 單頁 Slot01..03）→ gskillslotnew 第 1 頁遷移（Slot04=0）；
        //   gskillexpand 由 gskill 既有角色回填 1/1。Legacy gskill/gskillslot 保留（否則舊測試/外部工具噴掉），不再寫入。
        const char* const alters[] = {
            "ALTER TABLE gskill ADD COLUMN SkillLevel INTEGER NOT NULL DEFAULT 1;",
            "ALTER TABLE gskill ADD COLUMN SkillCSPoint INTEGER NOT NULL DEFAULT 0;",
            "ALTER TABLE gskill ADD COLUMN SkillPageNumber INTEGER NOT NULL DEFAULT 1;"
        };
        for (const char* alter : alters) {
            if (!db.Exec(alter, err)) {
                std::string unused;
                db.Rollback(unused);
                err = std::string("game migration v14 failed (alter gskill): ") + err;
                return false;
            }
        }
        if (!db.Exec(kCreateGSkillExpandV14, err) ||
            !db.Exec(kCreateGSkillSlotNewV14, err) ||
            !db.Exec(kCreateGSkillSlot2NewV14, err) ||
            !db.Exec(kCreateGSkillUnsealedV14, err) ||
            !db.Exec(kCreateGSkillCashV14, err)) {
            std::string unused;
            db.Rollback(unused);
            err = std::string("game migration v14 failed (create tables): ") + err;
            return false;
        }
        // 舊庫可能有 gunit 已刪除但 gskill/gskillslot 尚存的孤兒列（FK 曾關閉時代入可能）→ JOIN gunit 濾除，
        //   否則整個升級交易被 FK 擋下而無法開服（§0a23 偏差登錄）。
        if (!db.Exec("INSERT OR IGNORE INTO gskillslotnew (UnitUID, SkillPageNumber, Slot01, Slot02, Slot03, Slot04) "
                     "SELECT s.UnitUID, 1, s.Slot01, s.Slot02, s.Slot03, 0 FROM gskillslot s JOIN gunit u ON u.UnitUID = s.UnitUID;", err)) {
            std::string unused;
            db.Rollback(unused);
            err = std::string("game migration v14 failed (backfill slotA): ") + err;
            return false;
        }
        if (!db.Exec("INSERT OR IGNORE INTO gskillexpand (UnitUID, PageCount, ActivePage) "
                     "SELECT DISTINCT s.UnitUID, 1, 1 FROM gskill s JOIN gunit u ON u.UnitUID = s.UnitUID;", err)) {
            std::string unused;
            db.Rollback(unused);
            err = std::string("game migration v14 failed (backfill expand): ") + err;
            return false;
        }
    }
    if (!db.SetUserVersion(kGameSchemaVersion, err)) { std::string unused; db.Rollback(unused); return false; }
    return db.Commit(err);
}

// 原 gup_create_unit 的衛星副作用（呼叫端已 Begin）：
//   GQuests：QuestID=13（로우의 호출）, SubQuest0=1（原 proc 對所有職業）
//   GSkill/GSkillSlotNew：class 1→10000 / 2→20030 / 3→30000 / 4→40010（**僅 1..4**；原 proc 如此，
//     5..9 無技能列——忠實照抄）；SkillLevel=1、SkillPageNumber=1；gskillslotnew(page 1): Slot01=SkillID、Slot04=0；gskillexpand(1,1)；
//     v14 起 legacy gskillslot 不再寫入（§0a23）
//   GSpirit：StartSpirit ← gresurrectionstonecnt（缺列或 NULL → 0；
//     原 stored proc 空表時 @iStartSpirit=NULL → Spirit NULL → -21 → 建角整體 ROLLBACK；
//     V2 以 0 續建並於文件誠實聲明）；Flag=0（原 DF_GSpirit_Flag DEFAULT(0)）
//   GDenyOption：(1..4, CodeNo=1)
static bool InsertCreateUnitSideEffects(Database& db, int64_t unitUID, int unitClass, std::string& err)
{
    auto insert = [&db, unitUID, &err](const char* sql, const char* what, int64_t bind2 = -1, bool hasBind2 = false) -> bool {
        Statement st;
        if (!st.Prepare(db, sql, err)) { err = std::string(what) + " prepare: " + err; return false; }
        if (!st.BindInt(1, unitUID, err)) { err = std::string(what) + " bind: " + err; return false; }
        if (hasBind2 && !st.BindInt(2, bind2, err)) { err = std::string(what) + " bind2: " + err; return false; }
        std::string stepErr;
        if (st.StepRow(stepErr)) { err = std::string(what) + ": unexpected row"; return false; }
        if (!stepErr.empty()) { err = std::string(what) + ": " + stepErr; return false; }
        return true;
    };

    if (!insert("INSERT INTO gquests (UnitUID, QuestID, SubQuest0, SubQuest1, SubQuest2, SubQuest3, SubQuest4)"
                " VALUES (?, 13, 1, 0, 0, 0, 0);", "gquests")) return false;

    static const int kClassSkill[5] = { 0, 10000, 20030, 30000, 40010 };
    if (unitClass >= 1 && unitClass <= 4) {
        // §0a23：2013 頁系統路徑——技能寫入 gskill（SkillLevel=1、SkillPageNumber=1）＋ gskillslotnew 第 1 頁（Slot04=0）
        //   ＋ gskillexpand(1,1)。Legacy gskillslot（2008 單頁）不再寫入（v14 起僅供遷移來源；見 docs §0a23）。
        const int64_t skillID = kClassSkill[unitClass];
        if (!insert("INSERT INTO gskill (UnitUID, SkillID, SkillLevel, SkillCSPoint, SkillPageNumber) VALUES (?, ?, 1, 0, 1);",
                    "gskill", skillID, true)) return false;
        if (!insert("INSERT INTO gskillslotnew (UnitUID, SkillPageNumber, Slot01, Slot02, Slot03, Slot04) VALUES (?, 1, ?, 0, 0, 0);",
                    "gskillslotnew", skillID, true)) return false;
        if (!insert("INSERT OR IGNORE INTO gskillexpand (UnitUID, PageCount, ActivePage) VALUES (?, 1, 1);",
                    "gskillexpand")) return false;
    }

    {
        int64_t startSpirit = 0;   // 缺列 / NULL → 0（見標頭說明）
        Statement st;
        if (!st.Prepare(db, "SELECT StartSpirit FROM gresurrectionstonecnt LIMIT 1;", err)) return false;
        std::string stepErr;
        if (st.StepRow(stepErr)) {
            if (!st.ColumnIsNull(0)) startSpirit = st.ColumnInt64(0);
            err.clear();
        } else if (!stepErr.empty()) { err = stepErr; return false; }
        if (!insert("INSERT INTO gspirit (UnitUID, Spirit, Flag) VALUES (?, ?, 0);",
                    "gspirit", startSpirit, true)) return false;
    }

    for (int q = 1; q <= 4; ++q) {
        if (!insert("INSERT INTO gdenyoption (UnitUID, QuestionNo, CodeNo) VALUES (?, ?, 1);",
                    "gdenyoption", q, true)) return false;
    }
    return true;
}

static bool ReadGUserRow(Statement& st, GUserRecord& out)
{
    out.userUID  = st.ColumnInt64(0);
    out.userID   = st.ColumnText(1);
    out.usSize   = static_cast<int>(st.ColumnInt64(2));
    out.regDate  = st.ColumnText(3);
    out.delDate  = st.ColumnText(4);
    out.deleted  = st.ColumnInt64(5) != 0;
    return true;
}

bool GameStore::GetGUser(int64_t userUID, GUserRecord& out, bool& found, std::string& err)
{
    Statement st;
    if (!st.Prepare(m_db,
            "SELECT UserUID, UserID, USSize, RegDate, DelDate, Deleted FROM guser WHERE UserUID = ?;",
            err)) return false;
    if (!st.BindInt(1, userUID, err)) return false;
    std::string stepErr;
    if (st.StepRow(stepErr)) {
        ReadGUserRow(st, out);
        found = true;
        err.clear();
        return true;
    }
    if (!stepErr.empty()) { err = stepErr; return false; }
    found = false;
    err.clear();
    return true;
}

bool GameStore::GetOrCreateGUser(int64_t userUID, const std::string& userID,
                                 GUserRecord& out, std::string& err)
{
    if (userID.empty() || userID.size() > 50) { err = "userID must be 1..50 chars"; return false; }

    if (!m_db.Begin(err)) return false;

    Statement st;
    if (!st.Prepare(m_db, "SELECT UserUID, UserID, USSize, RegDate, DelDate, Deleted FROM guser WHERE UserUID = ?;", err)) {
        std::string u; m_db.Rollback(u); return false;
    }
    if (!st.BindInt(1, userUID, err)) { std::string u; m_db.Rollback(u); return false; }
    std::string stepErr;
    if (st.StepRow(stepErr)) {
        ReadGUserRow(st, out);
        st.Finalize();
        if (!m_db.Commit(err)) return false;
        return true;
    }
    if (!stepErr.empty()) { std::string u; m_db.Rollback(u); err = stepErr; return false; }
    st.Finalize();

    Statement ins;
    if (!ins.Prepare(m_db,
            "INSERT INTO guser (UserUID, UserID, USSize, RegDate, DelDate) VALUES (?, ?, 50, datetime('now'), datetime('now'));",
            err)) { std::string u; m_db.Rollback(u); return false; }
    if (!ins.BindInt(1, userUID, err)) { std::string u; m_db.Rollback(u); return false; }
    if (!ins.BindText(2, userID, err)) { std::string u; m_db.Rollback(u); return false; }
    std::string insErr;
    if (ins.StepRow(insErr)) { std::string u; m_db.Rollback(u); err = "unexpected row from INSERT"; return false; }
    if (!insErr.empty()) { std::string u; m_db.Rollback(u); err = insErr; return false; }

    // 讀回剛建立的列（含生成欄）
    Statement sel;
    if (!sel.Prepare(m_db, "SELECT UserUID, UserID, USSize, RegDate, DelDate, Deleted FROM guser WHERE UserUID = ?;", err)) {
        std::string u; m_db.Rollback(u); return false;
    }
    if (!sel.BindInt(1, userUID, err)) { std::string u; m_db.Rollback(u); return false; }
    std::string selErr;
    if (sel.StepRow(selErr)) {
        ReadGUserRow(sel, out);
        sel.Finalize();
        if (!m_db.Commit(err)) return false;
        err.clear();
        return true;
    }
    std::string u; m_db.Rollback(u);
    err = selErr.empty() ? "insert then select returned no row" : selErr;
    return false;
}

bool GameStore::ReadUnitRow(Statement& st, GUnitRecord& out)
{
    out.unitUID      = st.ColumnInt64(0);
    out.userUID      = st.ColumnInt64(1);
    out.unitClass    = static_cast<int>(st.ColumnInt64(2));
    out.exp          = static_cast<int32_t>(st.ColumnInt64(3));
    out.level        = static_cast<int>(st.ColumnInt64(4));
    out.gamePoint    = static_cast<int32_t>(st.ColumnInt64(5));
    out.vsPoint      = static_cast<int32_t>(st.ColumnInt64(6));
    out.vsPointMax   = static_cast<int32_t>(st.ColumnInt64(7));
    out.baseHP       = static_cast<int>(st.ColumnInt64(8));
    out.atkPhysic    = static_cast<int>(st.ColumnInt64(9));
    out.atkMagic     = static_cast<int>(st.ColumnInt64(10));
    out.defPhysic    = static_cast<int>(st.ColumnInt64(11));
    out.defMagic     = static_cast<int>(st.ColumnInt64(12));
    out.sPoint       = static_cast<int32_t>(st.ColumnInt64(13));
    out.win          = static_cast<int>(st.ColumnInt64(14));
    out.lose         = static_cast<int>(st.ColumnInt64(15));
    out.seceder      = static_cast<int>(st.ColumnInt64(16));
    out.regDate      = st.ColumnText(17);
    out.delDate      = st.ColumnText(18);
    out.lastDate     = st.ColumnText(19);
    out.lastPosition = static_cast<int32_t>(st.ColumnInt64(20));
    out.playDayCnt   = static_cast<int32_t>(st.ColumnInt64(21));
    out.loginCount   = static_cast<int32_t>(st.ColumnInt64(22));
    out.deleted      = st.ColumnInt64(23) != 0;
    out.nickname     = (st.ColumnCount() > 24 && !st.ColumnIsNull(24)) ? st.ColumnText(24) : std::string();
    return true;
}

static const char* kUnitSelectCols =
    "u.UnitUID, u.UserUID, u.UnitClass, u.Exp, u.Level, u.GamePoint, u.VSPoint, u.VSPointMax,"
    " u.BaseHP, u.AtkPhysic, u.AtkMagic, u.DefPhysic, u.DefMagic, u.SPoint, u.Win, u.Lose, u.Seceder,"
    " u.RegDate, u.DelDate, u.LastDate, u.LastPosition, u.PlayDayCnt, u.LoginCount, u.Deleted,"
    " n.NickName";

CreateUnitResult GameStore::CreateUnit(int64_t userUID, const std::string& nickname, int unitClass,
                                       int64_t& unitUIDOut, std::string& err)
{
    unitUIDOut = 0;
    if (nickname.empty() || nickname.size() > 16) { err = "nickname must be 1..16 bytes"; return CreateUnitResult::DbError; }
    if (unitClass < 0 || unitClass > 255) { err = "unitClass out of tinyint range"; return CreateUnitResult::DbError; }

    // 1) GUser 狀態檢查（對應 gup_create_unit：guser 不存在或已刪除 → -1）
    bool found = false;
    GUserRecord gu;
    if (!GetGUser(userUID, gu, found, err)) return CreateUnitResult::DbError;
    if (!found || gu.deleted) { err.clear(); return CreateUnitResult::UserNotFoundOrDeleted; }

    // 2) 角色槽位上限（對應 gup_create_unit：active count >= USSize → -3）
    {
        Statement st;
        if (!st.Prepare(m_db, "SELECT count(*) FROM gunit WHERE UserUID = ? AND Deleted = 0;", err))
            return CreateUnitResult::DbError;
        if (!st.BindInt(1, userUID, err)) return CreateUnitResult::DbError;
        std::string stepErr;
        int64_t cnt = 0;
        if (st.StepRow(stepErr)) {
            cnt = st.ColumnInt64(0);
            err.clear();
        } else if (!stepErr.empty()) { err = stepErr; return CreateUnitResult::DbError; }
        if (cnt >= gu.usSize) { err.clear(); return CreateUnitResult::CapacityReached; }
    }

    // 3) 暱稱唯一性（對應 gup_create_unit：GUnitNickName 已存在 → -2）
    {
        Statement st;
        if (!st.Prepare(m_db, "SELECT 1 FROM gunit_nickname WHERE NickName = ? COLLATE NOCASE LIMIT 1;", err))
            return CreateUnitResult::DbError;
        if (!st.BindText(1, nickname, err)) return CreateUnitResult::DbError;
        std::string stepErr;
        if (st.StepRow(stepErr)) { err.clear(); return CreateUnitResult::NicknameTaken; }
        if (!stepErr.empty()) { err = stepErr; return CreateUnitResult::DbError; }
    }

    // 4) 暱稱 14 天冷卻（對應 gup_create_unit：GDeletedNickNameHistory 14 天內 → -222）
    {
        Statement st;
        if (!st.Prepare(m_db,
                "SELECT 1 FROM gdeleted_nickname_history"
                " WHERE NickName = ? COLLATE NOCASE AND RegDate > datetime('now', '-14 days') LIMIT 1;",
                err))
            return CreateUnitResult::DbError;
        if (!st.BindText(1, nickname, err)) return CreateUnitResult::DbError;
        std::string stepErr;
        if (st.StepRow(stepErr)) { err.clear(); return CreateUnitResult::NicknameInCooldown; }
        if (!stepErr.empty()) { err = stepErr; return CreateUnitResult::DbError; }
    }

    // 5) 事務化插入 gunit + gunit_nickname（對應原 proc 的 BEGIN TRAN … INSERT … INSERT）
    if (!m_db.Begin(err)) return CreateUnitResult::DbError;

    Statement iu;
    const char* kUnitInsert =
        "INSERT INTO gunit (UserUID, UnitClass, Exp, Level, GamePoint, VSPoint, VSPointMax, BaseHP,"
        " AtkPhysic, AtkMagic, DefPhysic, DefMagic, SPoint, Win, Lose, Seceder,"
        " RegDate, DelDate, LastDate, LastPosition, PlayDayCnt, LoginCount)"
        " VALUES (?, ?, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,"
        " datetime('now'), datetime('now'), datetime('now'), 20000, 0, 0);";
    if (!iu.Prepare(m_db, kUnitInsert, err)) { std::string u; m_db.Rollback(u); return CreateUnitResult::DbError; }
    if (!iu.BindInt(1, userUID, err)) { std::string u; m_db.Rollback(u); return CreateUnitResult::DbError; }
    if (!iu.BindInt(2, unitClass, err)) { std::string u; m_db.Rollback(u); return CreateUnitResult::DbError; }
    {
        std::string stepErr;
        if (iu.StepRow(stepErr)) { std::string u; m_db.Rollback(u); err = "unexpected row from INSERT"; return CreateUnitResult::DbError; }
        if (!stepErr.empty()) { std::string u; m_db.Rollback(u); err = stepErr; return CreateUnitResult::DbError; }
    }
    iu.Finalize();

    // 取剛插入的 UnitUID（last_insert_rowid 需同連線）
    {
        Statement st;
        if (!st.Prepare(m_db, "SELECT last_insert_rowid();", err)) { std::string u; m_db.Rollback(u); return CreateUnitResult::DbError; }
        std::string stepErr;
        if (st.StepRow(stepErr) && st.ColumnCount() == 1) {
            unitUIDOut = st.ColumnInt64(0);
            err.clear();
        } else {
            std::string u; m_db.Rollback(u);
            err = stepErr.empty() ? "last_insert_rowid failed" : stepErr;
            return CreateUnitResult::DbError;
        }
    }

    Statement in;
    if (!in.Prepare(m_db, "INSERT INTO gunit_nickname (UnitUID, NickName, RegDate) VALUES (?, ?, datetime('now'));", err)) {
        std::string u; m_db.Rollback(u); return CreateUnitResult::DbError;
    }
    if (!in.BindInt(1, unitUIDOut, err)) { std::string u; m_db.Rollback(u); return CreateUnitResult::DbError; }
    if (!in.BindText(2, nickname, err)) { std::string u; m_db.Rollback(u); return CreateUnitResult::DbError; }
    {
        std::string stepErr;
        if (in.StepRow(stepErr)) { std::string u; m_db.Rollback(u); err = "unexpected row from INSERT"; return CreateUnitResult::DbError; }
        if (!stepErr.empty()) { std::string u; m_db.Rollback(u); err = stepErr; return CreateUnitResult::DbError; }
    }

    // 5.5) 原 gup_create_unit 衛星副作用（GQuests/GSkill/GSkillSlot/GSpirit/GDenyOption）；失敗 → 整體 ROLLBACK
    if (!InsertCreateUnitSideEffects(m_db, unitUIDOut, unitClass, err)) {
        std::string u; m_db.Rollback(u); return CreateUnitResult::DbError;
    }

    if (!m_db.Commit(err)) return CreateUnitResult::DbError;
    return CreateUnitResult::Ok;
}

bool GameStore::ListUnitsByUserUID(int64_t userUID, std::vector<GUnitRecord>& out, std::string& err)
{
    out.clear();
    Statement st;
    const std::string sql = std::string("SELECT ") + kUnitSelectCols +
        " FROM gunit u LEFT JOIN gunit_nickname n ON n.UnitUID = u.UnitUID"
        " WHERE u.UserUID = ? AND u.Deleted = 0 ORDER BY u.UnitUID ASC;";
    if (!st.Prepare(m_db, sql.c_str(), err)) return false;
    if (!st.BindInt(1, userUID, err)) return false;
    std::string stepErr;
    while (true) {
        stepErr.clear();
        if (st.StepRow(stepErr)) {
            GUnitRecord rec;
            ReadUnitRow(st, rec);
            out.push_back(rec);
        } else {
            if (!stepErr.empty()) { err = stepErr; return false; }
            break;
        }
    }
    err.clear();
    return true;
}

bool GameStore::GetUnitByUID(int64_t unitUID, GUnitRecord& out, bool& found, std::string& err)
{
    Statement st;
    const std::string sql = std::string("SELECT ") + kUnitSelectCols +
        " FROM gunit u LEFT JOIN gunit_nickname n ON n.UnitUID = u.UnitUID"
        " WHERE u.UnitUID = ?;";
    if (!st.Prepare(m_db, sql.c_str(), err)) return false;
    if (!st.BindInt(1, unitUID, err)) return false;
    std::string stepErr;
    if (st.StepRow(stepErr)) {
        ReadUnitRow(st, out);
        found = true;
        err.clear();
        return true;
    }
    if (!stepErr.empty()) { err = stepErr; return false; }
    found = false;
    err.clear();
    return true;
}

NicknameCheckResult GameStore::CheckNicknameAvailable(const std::string& nickname, std::string& err,
                                                      int64_t excludeUnitUID)
{
    {   // 1) 暱稱已存在（含活躍角色；excludeUnitUID 排除自身）
        Statement st;
        if (!st.Prepare(m_db, "SELECT 1 FROM gunit_nickname WHERE NickName = ? COLLATE NOCASE AND UnitUID != ? LIMIT 1;", err))
            return NicknameCheckResult::DbError;
        if (!st.BindText(1, nickname, err)) return NicknameCheckResult::DbError;
        if (!st.BindInt(2, excludeUnitUID, err)) return NicknameCheckResult::DbError;
        std::string stepErr;
        if (st.StepRow(stepErr)) { err.clear(); return NicknameCheckResult::Taken; }
        if (!stepErr.empty()) { err = stepErr; return NicknameCheckResult::DbError; }
    }
    {   // 2) 14 天冷卻（GDeletedNickNameHistory）
        Statement st;
        if (!st.Prepare(m_db,
                "SELECT 1 FROM gdeleted_nickname_history"
                " WHERE NickName = ? COLLATE NOCASE AND RegDate > datetime('now', '-14 days') LIMIT 1;", err))
            return NicknameCheckResult::DbError;
        if (!st.BindText(1, nickname, err)) return NicknameCheckResult::DbError;
        std::string stepErr;
        if (st.StepRow(stepErr)) { err.clear(); return NicknameCheckResult::InCooldown; }
        if (!stepErr.empty()) { err = stepErr; return NicknameCheckResult::DbError; }
    }
    err.clear();
    return NicknameCheckResult::Available;
}

GameStore::ChangeNicknameResult GameStore::ChangeUnitNickname(int64_t unitUID, const std::string& newNickname, std::string& err)
{
    if (newNickname.empty() || newNickname.size() > 16) { err = "nickname must be 1..16 bytes"; return ChangeNicknameResult::Failure; }
    if (!m_db.Begin(err)) return ChangeNicknameResult::DbError;

    std::string oldNickname;
    {   // 1) 角色存在且未刪除；讀出目前暱稱
        Statement st;
        if (!st.Prepare(m_db,
                "SELECT u.Deleted, COALESCE(n.NickName, '') FROM gunit u"
                " LEFT JOIN gunit_nickname n ON n.UnitUID = u.UnitUID WHERE u.UnitUID = ?;", err)) {
            std::string u; m_db.Rollback(u); return ChangeNicknameResult::DbError;
        }
        if (!st.BindInt(1, unitUID, err)) { std::string u; m_db.Rollback(u); return ChangeNicknameResult::DbError; }
        std::string stepErr;
        if (st.StepRow(stepErr)) {
            const bool deleted = st.ColumnInt64(0) != 0;
            oldNickname = st.ColumnText(1);
            err.clear();
            if (deleted) { std::string u; m_db.Rollback(u); err.clear(); return ChangeNicknameResult::UnitNotFoundOrDeleted; }
        } else {
            std::string u; m_db.Rollback(u);
            err = stepErr.empty() ? ("unit not found: " + std::to_string(unitUID)) : stepErr;
            return ChangeNicknameResult::UnitNotFoundOrDeleted;
        }
    }
    // 2) 新暱稱可用性（排除自身）+ 冷卻
    switch (CheckNicknameAvailable(newNickname, err, unitUID)) {
    case NicknameCheckResult::Available: break;
    case NicknameCheckResult::Taken:     { std::string u; m_db.Rollback(u); err.clear(); return ChangeNicknameResult::Taken; }
    case NicknameCheckResult::InCooldown:{ std::string u; m_db.Rollback(u); err.clear(); return ChangeNicknameResult::InCooldown; }
    case NicknameCheckResult::DbError:   { std::string u; m_db.Rollback(u); return ChangeNicknameResult::DbError; }
    }
    // 3) 舊暱稱寫入冷卻歷史（若有）——與 SoftDeleteUnit 同語意
    if (!oldNickname.empty()) {
        Statement st;
        if (!st.Prepare(m_db,
                "INSERT INTO gdeleted_nickname_history (NickName, UnitUID, RegDate) VALUES (?, ?, datetime('now'));", err)) {
            std::string u; m_db.Rollback(u); return ChangeNicknameResult::DbError;
        }
        if (!st.BindText(1, oldNickname, err)) { std::string u; m_db.Rollback(u); return ChangeNicknameResult::DbError; }
        if (!st.BindInt(2, unitUID, err)) { std::string u; m_db.Rollback(u); return ChangeNicknameResult::DbError; }
        std::string stepErr;
        if (st.StepRow(stepErr)) { std::string u; m_db.Rollback(u); err = "unexpected row from INSERT"; return ChangeNicknameResult::DbError; }
        if (!stepErr.empty()) { std::string u; m_db.Rollback(u); err = stepErr; return ChangeNicknameResult::DbError; }
    }
    // 4) 更新暱稱
    {
        Statement st;
        if (!st.Prepare(m_db, "UPDATE gunit_nickname SET NickName = ?, RegDate = datetime('now') WHERE UnitUID = ?;", err)) {
            std::string u; m_db.Rollback(u); return ChangeNicknameResult::DbError;
        }
        if (!st.BindText(1, newNickname, err)) { std::string u; m_db.Rollback(u); return ChangeNicknameResult::DbError; }
        if (!st.BindInt(2, unitUID, err)) { std::string u; m_db.Rollback(u); return ChangeNicknameResult::DbError; }
        std::string stepErr;
        if (st.StepRow(stepErr)) { std::string u; m_db.Rollback(u); err = "unexpected row from UPDATE"; return ChangeNicknameResult::DbError; }
        if (!stepErr.empty()) { std::string u; m_db.Rollback(u); err = stepErr; return ChangeNicknameResult::DbError; }
        st.Finalize();
    }
    if (!m_db.Commit(err)) return ChangeNicknameResult::DbError;
    err.clear();
    return ChangeNicknameResult::Ok;
}

bool GameStore::CountUnitsCreatedTodayByUser(int64_t userUID, int& count, std::string& err)
{
    Statement st;
    if (!st.Prepare(m_db,
            "SELECT count(*) FROM gunit WHERE UserUID = ? AND Deleted = 0 AND RegDate >= datetime('now', 'start of day');", err))
        return false;
    if (!st.BindInt(1, userUID, err)) return false;
    std::string stepErr;
    if (st.StepRow(stepErr)) {
        count = static_cast<int>(st.ColumnInt64(0));
        err.clear();
        return true;
    }
    if (!stepErr.empty()) { err = stepErr; return false; }
    count = 0;
    err.clear();
    return true;
}

bool GameStore::SoftDeleteUnit(int64_t unitUID, std::string& err)
{
    if (!m_db.Begin(err)) return false;

    // 讀出暱稱與目前 Deleted 狀態（冪等：已刪除 → true）
    std::string nickname;
    {
        Statement st;
        if (!st.Prepare(m_db,
                "SELECT n.NickName, u.Deleted FROM gunit u LEFT JOIN gunit_nickname n ON n.UnitUID = u.UnitUID"
                " WHERE u.UnitUID = ?;", err)) { std::string u; m_db.Rollback(u); return false; }
        if (!st.BindInt(1, unitUID, err)) { std::string u; m_db.Rollback(u); return false; }
        std::string stepErr;
        if (st.StepRow(stepErr)) {
            if (st.ColumnInt64(1) != 0) { st.Finalize(); if (!m_db.Commit(err)) return false; err.clear(); return true; }  // 已刪除，冪等
            if (!st.ColumnIsNull(0)) nickname = st.ColumnText(0);
            err.clear();
        } else {
            std::string u; m_db.Rollback(u);
            err = stepErr.empty() ? ("unit not found: " + std::to_string(unitUID)) : stepErr;
            return false;
        }
    }

    {
        Statement st;
        // 保證 DelDate != RegDate（datetime('now') 只有秒級精度，同秒建立+刪除會誤判為未刪除；
        // 與原版 smalldatetime 的 1 分鐘精度問題同類，V2 在此修正）
        if (!st.Prepare(m_db,
                "UPDATE gunit SET DelDate = max(datetime('now'), datetime(RegDate, '+1 second'))"
                " WHERE UnitUID = ? AND Deleted = 0;", err)) {
            std::string u; m_db.Rollback(u); return false;
        }
        if (!st.BindInt(1, unitUID, err)) { std::string u; m_db.Rollback(u); return false; }
        std::string stepErr;
        if (st.StepRow(stepErr)) { std::string u; m_db.Rollback(u); err = "unexpected row from UPDATE"; return false; }
        if (!stepErr.empty()) { std::string u; m_db.Rollback(u); err = stepErr; return false; }
    }

    // 釋放暱稱（對應 gup_delete_unit：UPDATE GUnitNickName SET NickName = NULL），
    // 否則已被刪除的帳號永久占住暱稱，gup_create_unit 的暱稱重複檢查會永遠命中
    {
        Statement st;
        if (!st.Prepare(m_db, "UPDATE gunit_nickname SET NickName = NULL WHERE UnitUID = ?;", err)) {
            std::string u; m_db.Rollback(u); return false;
        }
        if (!st.BindInt(1, unitUID, err)) { std::string u; m_db.Rollback(u); return false; }
        std::string stepErr;
        if (st.StepRow(stepErr)) { std::string u; m_db.Rollback(u); err = "unexpected row from UPDATE"; return false; }
        if (!stepErr.empty()) { std::string u; m_db.Rollback(u); err = stepErr; return false; }
    }

    if (!nickname.empty()) {
        Statement st;
        if (!st.Prepare(m_db,
                "INSERT INTO gdeleted_nickname_history (NickName, UnitUID, RegDate) VALUES (?, ?, datetime('now'));",
                err)) { std::string u; m_db.Rollback(u); return false; }
        if (!st.BindText(1, nickname, err)) { std::string u; m_db.Rollback(u); return false; }
        if (!st.BindInt(2, unitUID, err)) { std::string u; m_db.Rollback(u); return false; }
        std::string stepErr;
        if (st.StepRow(stepErr)) { std::string u; m_db.Rollback(u); err = "unexpected row from INSERT"; return false; }
        if (!stepErr.empty()) { std::string u; m_db.Rollback(u); err = stepErr; return false; }
    }

    return m_db.Commit(err);
}

// ===== §0a23：2013 SERV_SKILL_PAGE_SYSTEM 反推 =====
bool GameStore::LoadSkillPageState(int64_t unitUID, SkillPageState& out, std::string& err)
{
    out = SkillPageState{};

    // 1) Expand（P_GSkill_Expand_SEL）：gskillexpand 缺列 → 1/1；PageCount<1 → 1；ActivePage<1 或 >PageCount → 1。
    {
        Statement st;
        if (!st.Prepare(m_db, "SELECT PageCount, ActivePage FROM gskillexpand WHERE UnitUID = ?;", err)) return false;
        if (!st.BindInt(1, unitUID, err)) return false;
        std::string se;
        if (st.StepRow(se)) {
            int pages = static_cast<int>(st.ColumnInt64(0));
            int active = static_cast<int>(st.ColumnInt64(1));
            if (pages < 1) pages = 1;
            if (active < 1 || active > pages) active = 1;
            out.pagesAvailable = pages;
            out.activePage = active;
            err.clear();
        } else if (!se.empty()) { err = se; return false; }
        // 缺列 → 預設 1/1（原 BeginFetch 失敗分支同）
    }

    // 2) Learned（P_GSkill_New_SEL）：gskill；同原 fetch 端過濾 SkillID>0 && SkillLevel>0；ORDER BY 原 proc 未知 → V2 固定 (頁, ID)（§0a23 偏差）
    {
        Statement st;
        if (!st.Prepare(m_db,
                "SELECT SkillID, SkillLevel, SkillCSPoint, SkillPageNumber FROM gskill"
                " WHERE UnitUID = ? AND SkillID > 0 AND SkillLevel > 0"
                " ORDER BY SkillPageNumber, SkillID;", err)) return false;
        if (!st.BindInt(1, unitUID, err)) return false;
        while (true) {
            std::string rowErr;
            if (!st.StepRow(rowErr)) {
                if (!rowErr.empty()) { err = rowErr; return false; }
                break;
            }
            SkillPageLearned sk;
            sk.skillID = static_cast<int32_t>(st.ColumnInt64(0));
            sk.skillLevel = static_cast<int32_t>(st.ColumnInt64(1));
            sk.skillCSPoint = static_cast<int32_t>(st.ColumnInt64(2));
            sk.skillPageNumber = static_cast<int32_t>(st.ColumnInt64(3));
            out.skills.push_back(sk);
        }
        err.clear();
    }

    // 3) SlotA（P_GSkillSlot_New_SEL）：gskillslotnew；**整表缺列** → 自癒 INSERT 0×pagesAvailable（原 select-unit 路徑 InsertSkillWithSkillSlot 副作用，§0a23 偏差：V2 於讀取端執行）
    bool slotAEmpty = true;
    {
        Statement st;
        if (!st.Prepare(m_db,
                "SELECT SkillPageNumber, Slot01, Slot02, Slot03, Slot04 FROM gskillslotnew"
                " WHERE UnitUID = ? ORDER BY SkillPageNumber;", err)) return false;
        if (!st.BindInt(1, unitUID, err)) return false;
        while (true) {
            std::string rowErr;
            if (!st.StepRow(rowErr)) {
                if (!rowErr.empty()) { err = rowErr; return false; }
                break;
            }
            slotAEmpty = false;
            SkillPageSlotRow row;
            row.pageNumber = static_cast<int32_t>(st.ColumnInt64(0));
            for (int i = 0; i < 4; ++i) row.slot[i] = static_cast<int32_t>(st.ColumnInt64(1 + i));
            out.slotA.push_back(row);
        }
        err.clear();
    }
    if (slotAEmpty && out.pagesAvailable >= 1) {
        if (!m_db.Begin(err)) return false;
        auto rollbackHeal = [this, &err]() {
            std::string unused;
            m_db.Rollback(unused);
            return false;
        };
        {
            int64_t cnt = -1;
            Statement st;
            if (!st.Prepare(m_db, "SELECT COUNT(*) FROM gskillslotnew WHERE UnitUID = ?;", err)) return rollbackHeal();
            if (!st.BindInt(1, unitUID, err)) return rollbackHeal();
            std::string se;
            if (!st.StepRow(se)) { err = se.empty() ? "count: no row" : se; return rollbackHeal(); }
            cnt = st.ColumnInt64(0);
            err.clear();
            if (cnt == 0) {
                for (int page = 1; page <= out.pagesAvailable; ++page) {
                    Statement ins;
                    if (!ins.Prepare(m_db,
                            "INSERT INTO gskillslotnew (UnitUID, SkillPageNumber, Slot01, Slot02, Slot03, Slot04)"
                            " VALUES (?, ?, 0, 0, 0, 0);", err)) return rollbackHeal();
                    if (!ins.BindInt(1, unitUID, err)) return rollbackHeal();
                    if (!ins.BindInt(2, page, err)) return rollbackHeal();
                    std::string stepErr;
                    if (ins.StepRow(stepErr) || !stepErr.empty()) { err = "self-heal insert: " + stepErr; return rollbackHeal(); }
                }
            }
        }
        if (!m_db.Commit(err)) return rollbackHeal();
        out.slotA.clear();
        for (int page = 1; page <= out.pagesAvailable; ++page) {
            SkillPageSlotRow row;
            row.pageNumber = page;
            out.slotA.push_back(row);
        }
    }

    // 4) SlotB（P_GSkillSlot2_New_SEL）：缺列不寫回；EndDate 取最高頁列；無列 → 哨兵 2000-01-01 00:00:00
    {
        Statement st;
        if (!st.Prepare(m_db,
                "SELECT SkillPageNumber, Slot01, Slot02, Slot03, Slot04, EndDate FROM gskillslot2new"
                " WHERE UnitUID = ? ORDER BY SkillPageNumber;", err)) return false;
        if (!st.BindInt(1, unitUID, err)) return false;
        while (true) {
            std::string rowErr;
            if (!st.StepRow(rowErr)) {
                if (!rowErr.empty()) { err = rowErr; return false; }
                break;
            }
            SkillSlotBRow row;
            row.pageNumber = static_cast<int32_t>(st.ColumnInt64(0));
            for (int i = 0; i < 4; ++i) row.slot[i] = static_cast<int32_t>(st.ColumnInt64(1 + i));
            row.endDate = st.ColumnText(5);
            out.skillSlotBEndDate = row.endDate;   // ORDER BY 遞增 → 迴圈結束時 = 最高頁 EndDate
            out.slotB.push_back(std::move(row));
        }
        err.clear();
    }

    // 5) Unsealed（gup_get_unsealed_skill_info）：isBornSealed 技能的解封記錄
    {
        Statement st;
        if (!st.Prepare(m_db, "SELECT SkillID FROM gskillunsealed WHERE UnitUID = ? ORDER BY SkillID;", err)) return false;
        if (!st.BindInt(1, unitUID, err)) return false;
        while (true) {
            std::string rowErr;
            if (!st.StepRow(rowErr)) {
                if (!rowErr.empty()) { err = rowErr; return false; }
                break;
            }
            out.unsealed.push_back(static_cast<int32_t>(st.ColumnInt64(0)));
        }
        err.clear();
    }
    return true;
}

bool GameStore::GetCashSkillPoint(int64_t unitUID, CashSkillPointValues& out, std::string& err)
{
    out = CashSkillPointValues{};
    Statement st;
    if (!st.Prepare(m_db, "SELECT CSPoint, MaxCSPoint, EndDate FROM gskillcash WHERE UnitUID = ?;", err)) return false;
    if (!st.BindInt(1, unitUID, err)) return false;
    std::string se;
    if (st.StepRow(se)) {
        out.csPoint = static_cast<int>(st.ColumnInt64(0));
        out.maxCSPoint = static_cast<int>(st.ColumnInt64(1));
        out.endDate = st.ColumnText(2);
        err.clear();
        return true;
    }
    if (!se.empty()) { err = se; return false; }
    // 缺列 → {0, 0, 哨兵}（原 BeginFetch 失敗分支）
    err.clear();
    return true;
}

bool GameStore::GetSpiritValues(int64_t unitUID, SpiritValues& out, std::string& err)
{
    out = SpiritValues{};
    Statement st;
    if (!st.Prepare(m_db, "SELECT Spirit, Flag FROM gspirit WHERE UnitUID = ?;", err)) return false;
    if (!st.BindInt(1, unitUID, err)) return false;
    std::string stepErr;
    if (st.StepRow(stepErr)) {
        out.spirit = static_cast<int>(st.ColumnInt64(0));
        out.flag   = static_cast<int>(st.ColumnInt64(1));
        err.clear();
        return true;
    }
    if (!stepErr.empty()) { err = stepErr; return false; }
    // 缺列 → {0,0}（原 proc 讀到 NULL，呼叫端以 0/false 使用）
    err.clear();
    return true;
}

bool GameStore::GetDenyOptions(int64_t unitUID, DenyOptionValues& out, std::string& err)
{
    out = DenyOptionValues{};   // 全 1（DOS_OFF 預設；缺列慣例，見標頭）
    Statement st;
    if (!st.Prepare(m_db, "SELECT QuestionNo, CodeNo FROM gdenyoption WHERE UnitUID = ?;", err)) return false;
    if (!st.BindInt(1, unitUID, err)) return false;
    std::string stepErr;
    while (true) {
        std::string rowErr;
        if (!st.StepRow(rowErr)) {
            if (!rowErr.empty()) { err = rowErr; return false; }
            break;   // 無更多列
        }
        const int qn = static_cast<int>(st.ColumnInt64(0));
        const int cn = static_cast<int>(st.ColumnInt64(1));
        switch (qn) {
            case 1: out.friendShip = cn; break;
            case 2: out.inviteGuild = cn; break;
            case 3: out.party = cn; break;
            case 4: out.personalTrade = cn; break;
            case 5: out.requestCouple = cn; break;
            case 6: out.invitePracticePVP = cn; break;
            default: break;   // 未知 QuestionNo 忽略
        }
    }
    err.clear();
    return true;
}

bool GameStore::UpdateDenyOptions(int64_t unitUID, const DenyOptionValues& v, std::string& err)
{
    // 參數檢查：CodeNo 必須是合法的 tinyint-ish 值（0=DOS_ON / 1=DOS_OFF / 2=DOS_ONLY_FRIEND；原表無範圍限制，V2 僅擋負數）
    const int code[6] = { v.friendShip, v.inviteGuild, v.party, v.personalTrade, v.requestCouple, v.invitePracticePVP };
    for (int i = 0; i < 6; ++i) {
        if (code[i] < 0 || code[i] > 255) { err = "deny option CodeNo out of range"; return false; }
    }

    if (!m_db.Begin(err)) return false;

    auto rollback = [this, &err]() {
        std::string unused;
        m_db.Rollback(unused);
        return false;
    };

    // unit 存在性檢查（原 gup_update_community_opt：該 Unit 不存在 → -1）
    {
        Statement st;
        if (!st.Prepare(m_db, "SELECT 1 FROM gunit WHERE UnitUID = ? AND Deleted = 0;", err)) return rollback();
        if (!st.BindInt(1, unitUID, err)) return rollback();
        std::string stepErr;
        if (!st.StepRow(stepErr)) {
            if (!stepErr.empty()) { err = stepErr; return rollback(); }
            err = "unit not found (or deleted)";
            return rollback();
        }
    }

    // upsert 6 列（缺列 → INSERT，有列 → UPDATE；同一 transaction）
    static const char* kUpsert =
        "INSERT INTO gdenyoption (UnitUID, QuestionNo, CodeNo) VALUES (?, ?, ?) "
        "ON CONFLICT(UnitUID, QuestionNo) DO UPDATE SET CodeNo = excluded.CodeNo;";
    for (int qn = 1; qn <= 6; ++qn) {
        Statement st;
        if (!st.Prepare(m_db, kUpsert, err)) return rollback();
        if (!st.BindInt(1, unitUID, err)) return rollback();
        if (!st.BindInt(2, qn, err)) return rollback();
        if (!st.BindInt(3, code[qn - 1], err)) return rollback();
        std::string stepErr;
        if (st.StepRow(stepErr)) { err = "upsert: unexpected row"; return rollback(); }
        if (!stepErr.empty()) { err = stepErr; return rollback(); }
    }

    if (!m_db.Commit(err)) {
        std::string unused;
        m_db.Rollback(unused);
        return false;
    }
    err.clear();
    return true;
}

bool GameStore::GetQuestList(int64_t unitUID, std::vector<QuestRecord>& out, std::string& err)
{
    out.clear();
    Statement st;
    if (!st.Prepare(m_db,
            "SELECT QuestID, SubQuest0, SubQuest1, SubQuest2, SubQuest3, SubQuest4 FROM gquests WHERE UnitUID = ? ORDER BY QuestID ASC;", err)) return false;
    if (!st.BindInt(1, unitUID, err)) return false;
    std::string stepErr;
    while (true) {
        stepErr.clear();
        if (st.StepRow(stepErr)) {
            QuestRecord rec;
            rec.questID = static_cast<int32_t>(st.ColumnInt64(0));
            for (int i = 0; i < 5; ++i) rec.sub[i] = static_cast<uint8_t>(st.ColumnInt64(1 + i));
            out.push_back(rec);
        } else {
            if (!stepErr.empty()) { err = stepErr; return false; }
            break;
        }
    }
    err.clear();
    return true;
}

bool GameStore::GetQuestCompleteList(int64_t unitUID, std::vector<QuestCompleteRecord>& out, std::string& err)
{
    out.clear();
    // 先 GQuests_Complete，後 GQuests_Repeat（鏡像原 call site 的查詢順序）
    static const char* kTables[2] = { "gquests_complete", "gquests_repeat" };
    for (const char* table : kTables) {
        Statement st;
        const std::string sql = std::string("SELECT QuestID, CompleteDate FROM ") + table + " WHERE UnitUID = ? ORDER BY QuestID ASC;";
        if (!st.Prepare(m_db, sql.c_str(), err)) return false;
        if (!st.BindInt(1, unitUID, err)) return false;
        std::string stepErr;
        while (true) {
            stepErr.clear();
            if (st.StepRow(stepErr)) {
                QuestCompleteRecord rec;
                rec.questID = static_cast<int32_t>(st.ColumnInt64(0));
                const std::string cd = st.ColumnText(1);
                if (!ParseUtcDatetime(cd, rec.completeDateEpoch)) {
                    err = std::string("bad CompleteDate in ") + table + ": " + cd;
                    return false;
                }
                out.push_back(rec);
            } else {
                if (!stepErr.empty()) { err = stepErr; return false; }
                break;
            }
        }
    }
    err.clear();
    return true;
}

bool GameStore::GetTitleCompleteList(int64_t unitUID, std::vector<TitleCompleteRecord>& out, std::string& err)
{
    out.clear();
    Statement st;
    if (!st.Prepare(m_db,
            "SELECT TitleID, EndDate, IsHang FROM gtitle_complete WHERE UnitUID = ? ORDER BY TitleID ASC;", err)) return false;
    if (!st.BindInt(1, unitUID, err)) return false;
    std::string stepErr;
    while (true) {
        stepErr.clear();
        if (st.StepRow(stepErr)) {
            TitleCompleteRecord rec;
            rec.titleID = static_cast<int32_t>(st.ColumnInt64(0));
            if (st.ColumnIsNull(1)) { rec.endDate.clear(); rec.endDateNull = true; }
            else { rec.endDate = st.ColumnText(1); rec.endDateNull = false; }
            rec.isHang = st.ColumnInt64(2) != 0;
            out.push_back(std::move(rec));
        } else {
            if (!stepErr.empty()) { err = stepErr; return false; }
            break;
        }
    }
    err.clear();
    return true;
}

bool GameStore::GetTitleMissionList(int64_t unitUID, std::vector<TitleMissionRecord>& out, std::string& err)
{
    out.clear();
    Statement st;
    if (!st.Prepare(m_db,
            "SELECT TitleID, SubMission1, SubMission2, SubMission3, SubMission4, SubMission5 FROM gtitle_mission WHERE UnitUID = ? ORDER BY TitleID ASC;", err)) return false;
    if (!st.BindInt(1, unitUID, err)) return false;
    std::string stepErr;
    while (true) {
        stepErr.clear();
        if (st.StepRow(stepErr)) {
            TitleMissionRecord rec;
            rec.titleID = static_cast<int32_t>(st.ColumnInt64(0));
            for (int i = 0; i < 5; ++i) rec.sub[i] = static_cast<int16_t>(st.ColumnInt64(1 + i));
            out.push_back(rec);
        } else {
            if (!stepErr.empty()) { err = stepErr; return false; }
            break;
        }
    }
    err.clear();
    return true;
}

bool GameStore::GetBlacklist(int64_t unitUID, std::vector<BlacklistRecord>& out, std::string& err)
{
    out.clear();
    Statement st;
    if (!st.Prepare(m_db,
            "SELECT bl.BlockUID, n.NickName FROM gblacklist bl"
            " INNER JOIN gunit_nickname n ON n.UnitUID = bl.BlockUID"
            " WHERE bl.MyUID = ? ORDER BY bl.BlockUID ASC;", err)) return false;
    if (!st.BindInt(1, unitUID, err)) return false;
    std::string stepErr;
    while (true) {
        stepErr.clear();
        if (st.StepRow(stepErr)) {
            BlacklistRecord rec;
            rec.blockUnitUID = st.ColumnInt64(0);
            rec.nickname = st.ColumnIsNull(1) ? std::string() : st.ColumnText(1);
            out.push_back(std::move(rec));
        } else {
            if (!stepErr.empty()) { err = stepErr; return false; }
            break;
        }
    }
    err.clear();
    return true;
}

bool GameStore::GetTutorInfo(bool isTeacher, int64_t unitUID, std::vector<TutorRecord>& out, std::string& err)
{
    out.clear();
    Statement st;
    const char* sql = isTeacher
        // 我是老師：讀我的學生（TeacherUID = 我）
        ? "SELECT a.StudentUID, b.Exp, n.NickName, a.LastDate FROM gtutor a"
          " JOIN gunit b ON a.TeacherUID = ? AND a.StudentUID = b.UnitUID"
          " JOIN gunit_nickname n ON n.UnitUID = a.StudentUID"
          " WHERE a.Deleted = 0 ORDER BY a.StudentUID ASC;"
        // 我是學生：讀我的老師（StudentUID = 我）
        : "SELECT a.TeacherUID, b.Exp, n.NickName, a.LastDate FROM gtutor a"
          " JOIN gunit b ON a.StudentUID = ? AND a.TeacherUID = b.UnitUID"
          " JOIN gunit_nickname n ON n.UnitUID = a.TeacherUID"
          " WHERE a.Deleted = 0 ORDER BY a.TeacherUID ASC;";
    if (!st.Prepare(m_db, sql, err)) return false;
    if (!st.BindInt(1, unitUID, err)) return false;
    std::string stepErr;
    while (true) {
        stepErr.clear();
        if (st.StepRow(stepErr)) {
            TutorRecord rec;
            rec.unitUID = st.ColumnInt64(0);
            rec.exp = st.ColumnInt64(1);
            rec.nickname = st.ColumnIsNull(2) ? std::string() : st.ColumnText(2);
            rec.lastDate = st.ColumnIsNull(3) ? std::string() : st.ColumnText(3);
            out.push_back(std::move(rec));
        } else {
            if (!stepErr.empty()) { err = stepErr; return false; }
            break;
        }
    }
    err.clear();
    return true;
}

bool GameStore::GetConnectTimeEvents(int64_t unitUID, std::vector<ConnectTimeEventRecord>& out, std::string& err)
{
    out.clear();
    Statement st;
    if (!st.Prepare(m_db,
            "SELECT EventType, RegDate FROM gis30min WHERE UnitUID = ? ORDER BY EventType ASC;", err)) return false;
    if (!st.BindInt(1, unitUID, err)) return false;
    std::string stepErr;
    while (true) {
        stepErr.clear();
        if (st.StepRow(stepErr)) {
            ConnectTimeEventRecord rec;
            rec.eventUID = static_cast<int32_t>(st.ColumnInt64(0));
            rec.eventTime = st.ColumnIsNull(1) ? std::string() : st.ColumnText(1);
            out.push_back(std::move(rec));
        } else {
            if (!stepErr.empty()) { err = stepErr; return false; }
            break;
        }
    }
    err.clear();
    return true;
}

bool GameStore::GetInventorySlotSize(int64_t unitUID, std::map<int32_t, int32_t>& out, std::string& err)
{
    out.clear();
    Statement st;
    if (!st.Prepare(m_db,
            "SELECT InventoryCategory, SUM(NumSlot) FROM giteminventorysize"
            " WHERE UnitUID = ? GROUP BY InventoryCategory ORDER BY InventoryCategory ASC;", err)) return false;
    if (!st.BindInt(1, unitUID, err)) return false;
    std::string stepErr;
    while (true) {
        stepErr.clear();
        if (st.StepRow(stepErr)) {
            out[static_cast<int32_t>(st.ColumnInt64(0))] = static_cast<int32_t>(st.ColumnInt64(1));
        } else {
            if (!stepErr.empty()) { err = stepErr; return false; }
            break;
        }
    }
    err.clear();
    return true;
}

bool GameStore::GetInventoryItems(int64_t unitUID, std::vector<InventoryItemRecord>& out, std::string& err)
{
    out.clear();
    Statement st;
    // 對照原 gup_get_item_list：INSERT 暫存表（defaults）→ GItemQuantity（UsageType=2）→ GItemEndurance（UsageType=1，覆寫）
    //   → GItemEnchant（ELevel）→ GItemPeriod（Period/EndDate）→ GItemSocket（Socket1..4）。
    // V2 以 LEFT JOIN 一次讀取；UsageType 依同序推導（Endurance 覆寫 Quantity）。缺列 → proc 暫存表預設。
    if (!st.Prepare(m_db,
            "SELECT g.ItemUID, g.ItemID, g.InventoryCategory, g.SlotID,"
            "       (CASE WHEN e.ItemUID IS NOT NULL THEN 1"
            "             WHEN q.ItemUID IS NOT NULL THEN 2"
            "             ELSE 0 END) AS UsageType,"
            "       COALESCE(q.Quantity, 0) AS Quantity,"
            "       COALESCE(e.Endurance, -1) AS Endurance,"
            "       COALESCE(en.ELevel, 0) AS ELevel,"
            "       COALESCE(p.Period, 0) AS Period,"
            "       COALESCE(p.ExpirationDate, '') AS ExpirationDate,"
            "       COALESCE(s.Socket1, 0) AS Socket1, COALESCE(s.Socket2, 0) AS Socket2,"
            "       COALESCE(s.Socket3, 0) AS Socket3, COALESCE(s.Socket4, 0) AS Socket4"
            "  FROM gitem g"
            "  LEFT JOIN gitemquantity q  ON q.ItemUID  = g.ItemUID"
            "  LEFT JOIN gitemendurance e ON e.ItemUID  = g.ItemUID"
            "  LEFT JOIN gitemenchant en  ON en.ItemUID = g.ItemUID"
            "  LEFT JOIN gitemperiod p    ON p.ItemUID  = g.ItemUID"
            "  LEFT JOIN gitemsocket s    ON s.ItemUID  = g.ItemUID"
            " WHERE g.UnitUID = ? AND g.Deleted = 0"
            " ORDER BY g.InventoryCategory ASC, g.SlotID ASC, g.ItemUID ASC;", err)) return false;
    if (!st.BindInt(1, unitUID, err)) return false;
    std::string stepErr;
    while (true) {
        stepErr.clear();
        if (st.StepRow(stepErr)) {
            InventoryItemRecord rec;
            rec.itemUID = st.ColumnInt64(0);
            rec.itemID = static_cast<int32_t>(st.ColumnInt64(1));
            rec.slotCategory = static_cast<int8_t>(st.ColumnInt64(2));
            rec.slotID = static_cast<int16_t>(st.ColumnInt64(3));
            rec.usageType = static_cast<int8_t>(st.ColumnInt64(4));
            rec.quantity = static_cast<int32_t>(st.ColumnInt64(5));
            rec.endurance = static_cast<int16_t>(st.ColumnInt64(6));
            rec.enchantLevel = static_cast<int8_t>(st.ColumnInt64(7));
            rec.period = static_cast<int16_t>(st.ColumnInt64(8));
            rec.expirationDate = st.ColumnText(9);
            for (int i = 0; i < 4; ++i) rec.socket[i] = static_cast<int32_t>(st.ColumnInt64(10 + i));
            out.push_back(rec);
        } else {
            if (!stepErr.empty()) { err = stepErr; return false; }
            break;
        }
    }
    // GItemAttribute（gup_get_attribute：僅 InventoryCategory IN (1,9)）：逐列合併；ESI_SLOT_1..3 → attrib[0..2]
    std::vector<std::tuple<int64_t, int32_t, int32_t>> attrs;
    if (!GetItemAttributes(unitUID, attrs, err)) return false;
    std::map<int64_t, int> uidToIdx;
    for (size_t i = 0; i < out.size(); ++i) uidToIdx.emplace(out[i].itemUID, static_cast<int>(i));
    for (const auto& a : attrs) {
        auto it = uidToIdx.find(std::get<0>(a));
        if (it == uidToIdx.end()) continue;   // 防禦：proc 的 IN (subquery) 與主查詢一致，不該發生
        const int32_t slotNo = std::get<1>(a);
        const int32_t attribute = std::get<2>(a);
        if (slotNo < 0 || slotNo > 2) continue;  // §原碼 log + 忽略（ESI_MAX=3）
        out[static_cast<size_t>(it->second)].attrib[slotNo] = static_cast<int8_t>(attribute & 0xFF);
    }
    err.clear();
    return true;
}

bool GameStore::GetItemAttributes(int64_t unitUID, std::vector<std::tuple<int64_t, int32_t, int32_t>>& out, std::string& err)
{
    out.clear();
    Statement st;
    // 原 gup_get_attribute.proc.sql 逐字移植：SELECT * FROM GItemAttribute WHERE ItemUID IN
    //   (SELECT ItemUID FROM GItem WHERE UnitUID = @iUnitUID AND Inventorycategory IN (1,9) AND Deleted = 0)
    if (!st.Prepare(m_db,
            "SELECT ItemUID, SlotNo, Attribute FROM gitemattribute"
            " WHERE ItemUID IN (SELECT ItemUID FROM gitem WHERE UnitUID = ? AND InventoryCategory IN (1, 9) AND Deleted = 0);", err)) return false;
    if (!st.BindInt(1, unitUID, err)) return false;
    std::string stepErr;
    while (true) {
        stepErr.clear();
        if (st.StepRow(stepErr)) {
            out.emplace_back(st.ColumnInt64(0), static_cast<int32_t>(st.ColumnInt64(1)),
                             static_cast<int32_t>(st.ColumnInt64(2)));
        } else {
            if (!stepErr.empty()) { err = stepErr; return false; }
            break;
        }
    }
    err.clear();
    return true;
}

bool GameStore::GetResurrectionStone(int64_t unitUID, ResurrectionStoneValues& out, std::string& err)
{
    out = ResurrectionStoneValues{};
    Statement st;
    if (!st.Prepare(m_db, "SELECT Quantity FROM gresurrectionstone WHERE UnitUID = ?;", err)) return false;
    if (!st.BindInt(1, unitUID, err)) return false;
    std::string stepErr;
    if (st.StepRow(stepErr)) {
        out.quantity = static_cast<int>(st.ColumnInt64(0));
        err.clear();
        return true;
    }
    if (!stepErr.empty()) { err = stepErr; return false; }
    err.clear();
    return false;   // 缺列（非錯誤）：以回傳值區分
}

bool GameStore::GetDungeonClears(int64_t unitUID, std::vector<DungeonClearRecord>& out, std::string& err)
{
    out.clear();
    Statement st;
    // 原 gup_get_dungeon_clear：SELECT GameMode, MaxScore, MaxTotalRank, CAST(RegDate AS nvarchar(19))
    //   FROM GDungeonClear WHERE UnitUID = @iUnitUID_（CAST → V2 存字串，原樣輸出）
    if (!st.Prepare(m_db,
            "SELECT GameMode, MaxScore, MaxTotalRank, RegDate FROM gdungeonclear WHERE UnitUID = ?;", err)) return false;
    if (!st.BindInt(1, unitUID, err)) return false;
    std::string stepErr;
    while (true) {
        stepErr.clear();
        if (st.StepRow(stepErr)) {
            DungeonClearRecord rec;
            rec.dungeonID = static_cast<int32_t>(st.ColumnInt64(0));
            rec.maxScore = static_cast<int32_t>(st.ColumnInt64(1));
            rec.maxTotalRank = static_cast<int8_t>(st.ColumnInt64(2));
            rec.clearTime = st.ColumnText(3);
            out.push_back(rec);
        } else {
            if (!stepErr.empty()) { err = stepErr; return false; }
            break;
        }
    }
    err.clear();
    return true;
}

bool GameStore::GetTCClears(int64_t unitUID, std::vector<TCClearRecord>& out, std::string& err)
{
    out.clear();
    Statement st;
    // 原 gup_get_tc_clear：SELECT TCID, CAST(RegDate AS nvarchar(19)) FROM GTrainingCenter WHERE UnitUID = @iUnitUID_
    if (!st.Prepare(m_db,
            "SELECT TCID, RegDate FROM gtrainingcenter WHERE UnitUID = ?;", err)) return false;
    if (!st.BindInt(1, unitUID, err)) return false;
    std::string stepErr;
    while (true) {
        stepErr.clear();
        if (st.StepRow(stepErr)) {
            TCClearRecord rec;
            rec.tcid = static_cast<int32_t>(st.ColumnInt64(0));
            rec.clearTime = st.ColumnText(1);
            out.push_back(rec);
        } else {
            if (!stepErr.empty()) { err = stepErr; return false; }
            break;
        }
    }
    err.clear();
    return true;
}

bool GameStore::RepairDuplicateEquippedTitle(int64_t unitUID, int32_t equippedTitleID, std::string& err)
{
    if (!m_db.Begin(err)) return false;
    {
        Statement st;
        if (!st.Prepare(m_db, "UPDATE gtitle_complete SET IsHang = 0 WHERE UnitUID = ?;", err)) { std::string u; m_db.Rollback(u); return false; }
        if (!st.BindInt(1, unitUID, err)) { std::string u; m_db.Rollback(u); return false; }
        std::string stepErr;
        if (st.StepRow(stepErr)) { std::string u; m_db.Rollback(u); err = "unexpected row from UPDATE"; return false; }
        if (!stepErr.empty()) { err = stepErr; std::string u; m_db.Rollback(u); return false; }
    }
    {
        Statement st;
        if (!st.Prepare(m_db, "UPDATE gtitle_complete SET IsHang = 1 WHERE UnitUID = ? AND TitleID = ?;", err)) { std::string u; m_db.Rollback(u); return false; }
        if (!st.BindInt(1, unitUID, err)) { std::string u; m_db.Rollback(u); return false; }
        if (!st.BindInt(2, equippedTitleID, err)) { std::string u; m_db.Rollback(u); return false; }
        std::string stepErr;
        if (st.StepRow(stepErr)) { std::string u; m_db.Rollback(u); err = "unexpected row from UPDATE"; return false; }
        if (!stepErr.empty()) { err = stepErr; std::string u; m_db.Rollback(u); return false; }
    }
    return m_db.Commit(err);
}

bool GameStore::EquipTitleHang(int64_t unitUID, int32_t oldTitleID, int32_t newTitleID, std::string& err)
{
    if (!m_db.Begin(err)) return false;
    auto rollback = [this]() { std::string u; m_db.Rollback(u); };
    if (newTitleID == 0) {
        // 全部脫下（proc @iTitleID=0 分支）
        Statement st;
        if (!st.Prepare(m_db, "UPDATE gtitle_complete SET IsHang = 0 WHERE UnitUID = ?;", err)) { rollback(); return false; }
        if (!st.BindInt(1, unitUID, err)) { rollback(); return false; }
        std::string stepErr;
        if (st.StepRow(stepErr)) { rollback(); err = "unexpected row from UPDATE"; return false; }
        if (!stepErr.empty()) { err = stepErr; rollback(); return false; }
        return m_db.Commit(err);
    }
    // 持有驗證（attach 前；proc -2 的等價保險）
    {
        Statement st;
        if (!st.Prepare(m_db, "SELECT COUNT(*) FROM gtitle_complete WHERE UnitUID = ? AND TitleID = ?;", err)) { rollback(); return false; }
        if (!st.BindInt(1, unitUID, err) || !st.BindInt(2, newTitleID, err)) { rollback(); return false; }
        std::string stepErr;
        if (!st.StepRow(stepErr)) { rollback(); err = "count query failed"; return false; }
        if (st.ColumnInt64(0) != 1) { rollback(); err = "title not owned"; return false; }
    }
    // 脫下舊稱號（proc @iOldID 分支；僅 oldTitleID != 0）
    if (oldTitleID != 0 && oldTitleID != newTitleID) {
        Statement st;
        if (!st.Prepare(m_db, "UPDATE gtitle_complete SET IsHang = 0 WHERE UnitUID = ? AND TitleID = ?;", err)) { rollback(); return false; }
        if (!st.BindInt(1, unitUID, err) || !st.BindInt(2, oldTitleID, err)) { rollback(); return false; }
        std::string stepErr;
        if (st.StepRow(stepErr)) { rollback(); err = "unexpected row from UPDATE"; return false; }
        if (!stepErr.empty()) { err = stepErr; rollback(); return false; }
    }
    // 掛上新稱號（proc @iTitleID 分支）
    {
        Statement st;
        if (!st.Prepare(m_db, "UPDATE gtitle_complete SET IsHang = 1 WHERE UnitUID = ? AND TitleID = ?;", err)) { rollback(); return false; }
        if (!st.BindInt(1, unitUID, err) || !st.BindInt(2, newTitleID, err)) { rollback(); return false; }
        std::string stepErr;
        if (st.StepRow(stepErr)) { rollback(); err = "unexpected row from UPDATE"; return false; }
        if (!stepErr.empty()) { err = stepErr; rollback(); return false; }
    }
    // 掛上後驗證（IsHang=1 恰好一列——防禦；失敗 → rollback）
    {
        Statement st;
        if (!st.Prepare(m_db, "SELECT COUNT(*) FROM gtitle_complete WHERE UnitUID = ? AND TitleID = ? AND IsHang = 1;", err)) { rollback(); return false; }
        if (!st.BindInt(1, unitUID, err) || !st.BindInt(2, newTitleID, err)) { rollback(); return false; }
        std::string stepErr;
        if (!st.StepRow(stepErr)) { rollback(); err = "verify query failed"; return false; }
        if (st.ColumnInt64(0) != 1) { rollback(); err = "attach verify failed"; return false; }
    }
    return m_db.Commit(err);
}

bool GameStore::GetWishList(int64_t userUID, std::map<int32_t, int32_t>& out, std::string& err)
{
    out.clear();
    Statement st;
    // 原 gup_get_WishList：SELECT SlotNo, ItemID FROM GItemWishList WHERE UserUID = @iUserUID AND ItemID > 0
    // V2 將 InitWishList 的越界槽過濾（原 UserWishList.cpp:SlotNo<0 或 >=SLOT_MAX 略過）內聯到 SQL（wire 結果一致）；
    // ORDER BY SlotNo 為 V2 追加（原未指定；偏差明示）
    if (!st.Prepare(m_db,
            "SELECT SlotNo, ItemID FROM gitemwishlist WHERE UserUID = ? AND ItemID > 0 AND SlotNo BETWEEN 0 AND 20 ORDER BY SlotNo ASC;", err)) return false;
    if (!st.BindInt(1, userUID, err)) return false;
    std::string stepErr;
    while (true) {
        stepErr.clear();
        if (st.StepRow(stepErr)) {
            if (st.ColumnIsNull(0) || st.ColumnIsNull(1)) continue;   // 原 FETCH 至 int 會得 0/NULL 混雜；V2 略過（明示）
            out.emplace(static_cast<int32_t>(st.ColumnInt64(0)), static_cast<int32_t>(st.ColumnInt64(1)));
        } else {
            if (!stepErr.empty()) { err = stepErr; return false; }
            break;
        }
    }
    err.clear();
    return true;
}

bool GameStore::GetWishListSlots(int64_t userUID, std::array<int32_t, kWishListSlotMax>& slots, std::string& err)
{
    slots.fill(0);
    Statement st;
    // 不掛 ItemID 過濾：modify handler 需要 0 槽位的原始狀態（原 m_arrWishList）
    if (!st.Prepare(m_db,
            "SELECT SlotNo, ItemID FROM gitemwishlist WHERE UserUID = ?;", err)) return false;
    if (!st.BindInt(1, userUID, err)) return false;
    std::string stepErr;
    while (true) {
        stepErr.clear();
        if (st.StepRow(stepErr)) {
            if (st.ColumnIsNull(0) || st.ColumnIsNull(1)) continue;
            const int32_t slot = static_cast<int32_t>(st.ColumnInt64(0));
            if (slot < 0 || slot >= kWishListSlotMax) continue;      // 原 InitWishList 亦略過越界槽
            slots[static_cast<size_t>(slot)] = static_cast<int32_t>(st.ColumnInt64(1));
        } else {
            if (!stepErr.empty()) { err = stepErr; return false; }
            break;
        }
    }
    err.clear();
    return true;
}

bool GameStore::ApplyWishListChanges(int64_t userUID, const std::vector<std::pair<int32_t, int32_t>>& upserts, std::string& err)
{
    if (!m_db.Begin(err)) return false;
    for (const auto& kv : upserts) {
        const int32_t slot = kv.first, itemID = kv.second;
        if (slot < 0 || slot >= kWishListSlotMax) { err = "wish list slot out of range"; std::string u; m_db.Rollback(u); return false; }
        // 原 gup_update_WishList：NOT EXISTS → INSERT；否則 UPDATE（@@ROWCOUNT<>1 → FAIL_TRAN）
        Statement stSel;
        if (!stSel.Prepare(m_db, "SELECT COUNT(*) FROM gitemwishlist WHERE UserUID = ? AND SlotNo = ?;", err)) { std::string u; m_db.Rollback(u); return false; }
        if (!stSel.BindInt(1, userUID, err) || !stSel.BindInt(2, slot, err)) { std::string u; m_db.Rollback(u); return false; }
        std::string stepErr;
        if (!stSel.StepRow(stepErr)) { std::string u; m_db.Rollback(u); err = "wish list existence check failed"; return false; }
        const bool exists = stSel.ColumnInt64(0) > 0;
        if (!exists) {
            Statement stI;
            if (!stI.Prepare(m_db, "INSERT INTO gitemwishlist (UserUID, SlotNo, ItemID) VALUES (?, ?, ?);", err)) { std::string u; m_db.Rollback(u); return false; }
            if (!stI.BindInt(1, userUID, err) || !stI.BindInt(2, slot, err) || !stI.BindInt(3, itemID, err)) { std::string u; m_db.Rollback(u); return false; }
            std::string stErr;
            if (stI.StepRow(stErr)) { std::string u; m_db.Rollback(u); err = "unexpected row from INSERT"; return false; }
            if (!stErr.empty()) { std::string u; m_db.Rollback(u); err = stErr; return false; }
            if (m_db.Changes() != 1) { std::string u; m_db.Rollback(u); err = "wish list insert affected rows != 1"; return false; }
        } else {
            Statement stU;
            if (!stU.Prepare(m_db, "UPDATE gitemwishlist SET ItemID = ? WHERE UserUID = ? AND SlotNo = ?;", err)) { std::string u; m_db.Rollback(u); return false; }
            if (!stU.BindInt(1, itemID, err) || !stU.BindInt(2, userUID, err) || !stU.BindInt(3, slot, err)) { std::string u; m_db.Rollback(u); return false; }
            std::string stErr;
            if (stU.StepRow(stErr)) { std::string u; m_db.Rollback(u); err = "unexpected row from UPDATE"; return false; }
            if (!stErr.empty()) { std::string u; m_db.Rollback(u); err = stErr; return false; }
            if (m_db.Changes() != 1) { std::string u; m_db.Rollback(u); err = "wish list update affected rows != 1"; return false; }
        }
    }
    return m_db.Commit(err);
}

bool GameStore::GetRecommendOldUID(int64_t newUID, int64_t& outOldUID, bool& found, std::string& err)
{
    outOldUID = 0;
    found = false;
    Statement st;
    // 原 gup_get_unit_info_by_unituid：`SELECT @iOldUID = OldUID FROM GRecommend WHERE NewUID = @iUnitUID_`
    // （標量賦值，多列時取「最後讀到的那列」——未定義順序）；V2 以 ORDER BY RegDate ASC LIMIT 1 固定為最早一列，
    // 並於 docs §0a15 偏差聲明。
    if (!st.Prepare(m_db, "SELECT OldUID FROM grecommend WHERE NewUID = ? ORDER BY RegDate ASC, OldUID ASC LIMIT 1;", err)) return false;
    if (!st.BindInt(1, newUID, err)) return false;
    std::string stepErr;
    if (st.StepRow(stepErr)) {
        outOldUID = st.ColumnInt64(0);
        found = true;
        err.clear();
        return true;
    }
    if (!stepErr.empty()) { err = stepErr; return false; }
    err.clear();
    return true;
}

bool GameStore::ApplyUnitLoginReset(int64_t unitUID, std::string& err)
{
    if (!m_db.Begin(err)) return false;

    // 讀取 LastDate（不存在/已刪除直接失敗）
    std::string lastDate;
    {
        Statement st;
        if (!st.Prepare(m_db, "SELECT LastDate FROM gunit WHERE UnitUID = ? AND Deleted = 0;", err)) {
            std::string u; m_db.Rollback(u); return false;
        }
        if (!st.BindInt(1, unitUID, err)) { std::string u; m_db.Rollback(u); return false; }
        std::string stepErr;
        if (st.StepRow(stepErr)) { lastDate = st.ColumnText(0); }
        else if (!stepErr.empty()) { std::string u; m_db.Rollback(u); err = stepErr; return false; }
        else { std::string u; m_db.Rollback(u); err = "unit not found or deleted"; return false; }
    }

    // 1) GSpirit 每日重置（06:00 KST 邊界）
    {
        Statement st;
        const char* sql =
            "UPDATE gspirit SET"
            "   Spirit = IFNULL((SELECT StartSpirit FROM gresurrectionstonecnt LIMIT 1), 0),"
            "   Flag = 0,"
            "   RegDate = datetime('now')"
            " WHERE UnitUID = ?"
            "   AND (date(datetime(RegDate, '+9 hours', '+18 hours')) || ' 06:00:00')"
            "       < datetime('now', '+9 hours');";
        if (!st.Prepare(m_db, sql, err)) { std::string u; m_db.Rollback(u); return false; }
        if (!st.BindInt(1, unitUID, err)) { std::string u; m_db.Rollback(u); return false; }
        std::string stepErr;
        if (st.StepRow(stepErr)) { std::string u; m_db.Rollback(u); err = "unexpected row from spirit reset UPDATE"; return false; }
        if (!stepErr.empty()) { std::string u; m_db.Rollback(u); err = stepErr; return false; }
    }

    // 2) 復活石每日補充（以 LastDate 換算的 06:00 KST 邊界）
    {
        auto kstMidnight = [&](const char* base, std::string& out) -> bool {
            Statement st;
            const std::string sql = std::string(
                "SELECT date(datetime(?, '+9 hours', '+18 hours')) || ' 06:00:00'"
            );
            if (!st.Prepare(m_db, sql.c_str(), out)) return false;
            if (!st.BindText(1, base, out)) return false;
            std::string stepErr;
            if (st.StepRow(stepErr)) { out = st.ColumnText(0); }
            else if (!stepErr.empty()) { out = stepErr; return false; }
            else { out = ""; }
            return true;
        };
        std::string refillAt;
        if (!kstMidnight(lastDate.c_str(), refillAt)) {
            std::string u; m_db.Rollback(u); err = std::string("kst boundary compute: ") + refillAt; return false;
        }
        std::string nowKst;
        {
            Statement st;
            if (!st.Prepare(m_db, "SELECT datetime('now', '+9 hours');", err)) { std::string u; m_db.Rollback(u); return false; }
            std::string stepErr;
            if (st.StepRow(stepErr)) nowKst = st.ColumnText(0);
            else { std::string u; m_db.Rollback(u); err = stepErr.empty() ? "cannot read now(KST)" : stepErr; return false; }
        }
        if (!refillAt.empty() && refillAt < nowKst) {
            // 2a) 鏡像原 proc：無列 → INSERT StartCnt；有列 → Quantity < SupplyCnt 才補至 SupplyCnt
            bool stoneExists = false;
            {
                Statement st;
                if (!st.Prepare(m_db, "SELECT 1 FROM gresurrectionstone WHERE UnitUID = ?;", err)) { std::string u; m_db.Rollback(u); return false; }
                if (!st.BindInt(1, unitUID, err)) { std::string u; m_db.Rollback(u); return false; }
                std::string stepErr;
                if (st.StepRow(stepErr)) stoneExists = true;
                else if (!stepErr.empty()) { std::string u; m_db.Rollback(u); err = stepErr; return false; }
            }
            if (!stoneExists) {
                Statement st;
                const char* sql =
                    "INSERT INTO gresurrectionstone (UnitUID, Quantity)"
                    "   VALUES (?, IFNULL((SELECT StartCnt FROM gresurrectionstonecnt LIMIT 1), 0));";
                if (!st.Prepare(m_db, sql, err)) { std::string u; m_db.Rollback(u); return false; }
                if (!st.BindInt(1, unitUID, err)) { std::string u; m_db.Rollback(u); return false; }
                std::string stepErr;
                if (st.StepRow(stepErr)) { std::string u; m_db.Rollback(u); err = "unexpected row from refill INSERT"; return false; }
                if (!stepErr.empty()) { std::string u; m_db.Rollback(u); err = stepErr; return false; }
            } else {
                Statement st2;
                const char* sql2 =
                    "UPDATE gresurrectionstone SET Quantity = IFNULL((SELECT SupplyCnt FROM gresurrectionstonecnt LIMIT 1), 0)"
                    " WHERE UnitUID = ? AND Quantity < IFNULL((SELECT SupplyCnt FROM gresurrectionstonecnt LIMIT 1), 0);";
                if (!st2.Prepare(m_db, sql2, err)) { std::string u; m_db.Rollback(u); return false; }
                if (!st2.BindInt(1, unitUID, err)) { std::string u; m_db.Rollback(u); return false; }
                std::string stepErr2;
                if (st2.StepRow(stepErr2)) { std::string u; m_db.Rollback(u); err = "unexpected row from refill UPDATE"; return false; }
                if (!stepErr2.empty()) { std::string u; m_db.Rollback(u); err = stepErr2; return false; }
            }
        }
    }

    // 3) PlayDayCnt+1（日期不同時）
    if (lastDate.size() >= 10) {
        std::string todayPrefix;
        {
            Statement st;
            if (!st.Prepare(m_db, "SELECT substr(datetime('now'), 1, 10);", err)) { std::string u; m_db.Rollback(u); return false; }
            std::string stepErr;
            if (st.StepRow(stepErr)) { todayPrefix = st.ColumnText(0); }
            else { std::string u; m_db.Rollback(u); err = stepErr.empty() ? "cannot read today" : stepErr; return false; }
        }
        if (!todayPrefix.empty() && lastDate.substr(0, 10) != todayPrefix) {
            Statement st;
            if (!st.Prepare(m_db, "UPDATE gunit SET PlayDayCnt = PlayDayCnt + 1 WHERE UnitUID = ?;", err)) {
                std::string u; m_db.Rollback(u); return false;
            }
            if (!st.BindInt(1, unitUID, err)) { std::string u; m_db.Rollback(u); return false; }
            std::string stepErr;
            if (st.StepRow(stepErr)) { std::string u; m_db.Rollback(u); err = "unexpected row from playday UPDATE"; return false; }
            if (!stepErr.empty()) { std::string u; m_db.Rollback(u); err = stepErr; return false; }
        }
    }

    // 4) LoginCount+1、LastDate=now（與 RecordUnitLogin 相同語意）
    {
        Statement st;
        if (!st.Prepare(m_db,
                "UPDATE gunit SET LoginCount = LoginCount + 1, LastDate = datetime('now') WHERE UnitUID = ? AND Deleted = 0;",
                err)) { std::string u; m_db.Rollback(u); return false; }
        if (!st.BindInt(1, unitUID, err)) { std::string u; m_db.Rollback(u); return false; }
        std::string stepErr;
        if (st.StepRow(stepErr)) { std::string u; m_db.Rollback(u); err = "unexpected row from login UPDATE"; return false; }
        if (!stepErr.empty()) { std::string u; m_db.Rollback(u); err = stepErr; return false; }
    }

    return m_db.Commit(err);
}

bool GameStore::RecordUnitLogin(int64_t unitUID, std::string& err)
{
    Statement st;
    if (!st.Prepare(m_db,
            "UPDATE gunit SET LoginCount = LoginCount + 1, LastDate = datetime('now') WHERE UnitUID = ? AND Deleted = 0;",
            err)) return false;
    if (!st.BindInt(1, unitUID, err)) return false;
    std::string stepErr;
    if (st.StepRow(stepErr)) { err = "unexpected row from UPDATE"; return false; }
    if (!stepErr.empty()) { err = stepErr; return false; }
    // changes 數未回傳：由呼叫端以 GetUnitByUID 驗證
    err.clear();
    return true;
}

}} // namespace x2::db
