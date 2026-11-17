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
    if (!db.SetUserVersion(kGameSchemaVersion, err)) { std::string unused; db.Rollback(unused); return false; }
    return db.Commit(err);
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
