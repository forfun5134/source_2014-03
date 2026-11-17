// Sqlite.cpp — SQLite RAII 實作
#include "Sqlite.h"

namespace x2 { namespace db {

bool Database::Open(const std::string& path, std::string& err)
{
    if (path.empty()) { err = "empty database path"; return false; }
    sqlite3* db = nullptr;
    // FULLMUTEX：避免誤用多執行緒；V2 仍以外部互斥為準
    const int rc = sqlite3_open_v2(path.c_str(), &db,
                                   SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE | SQLITE_OPEN_FULLMUTEX,
                                   nullptr);
    if (rc != SQLITE_OK) {
        err = db ? sqlite3_errmsg(db) : "sqlite3_open_v2 failed";
        if (db) sqlite3_close(db);
        return false;
    }
    // 外鍵與 busy timeout 預設開啟
    char* emsg = nullptr;
    if (sqlite3_exec(db, "PRAGMA foreign_keys = ON;", nullptr, nullptr, &emsg) != SQLITE_OK) {
        err = emsg ? emsg : "PRAGMA foreign_keys failed";
        sqlite3_free(emsg);
        sqlite3_close(db);
        return false;
    }
    sqlite3_busy_timeout(db, 5000);
    m_db = db;
    return true;
}

void Database::Close()
{
    if (m_db) { sqlite3_close(m_db); m_db = nullptr; }
}

bool Database::Exec(const std::string& sql, std::string& err)
{
    if (!m_db) { err = "database not open"; return false; }
    char* emsg = nullptr;
    const int rc = sqlite3_exec(m_db, sql.c_str(), nullptr, nullptr, &emsg);
    if (rc != SQLITE_OK) {
        err = emsg ? emsg : "sqlite3_exec failed";
        sqlite3_free(emsg);
        return false;
    }
    err.clear();
    return true;
}

int Database::UserVersion(std::string& err)
{
    if (!m_db) { err = "database not open"; return -1; }
    Statement st;
    if (!st.Prepare(*this, "PRAGMA user_version;", err)) return -1;
    if (!st.StepRow(err)) return -1;
    err.clear();
    return static_cast<int>(st.ColumnInt64(0));
}

bool Database::SetUserVersion(int v, std::string& err)
{
    if (v < 0) { err = "negative user_version"; return false; }
    // PRAGMA 不支援參數綁定，整數格式化安全
    return Exec("PRAGMA user_version = " + std::to_string(v) + ";", err);
}

bool Database::Begin(std::string& err)    { return Exec("BEGIN;", err); }
bool Database::Commit(std::string& err)   { return Exec("COMMIT;", err); }
bool Database::Rollback(std::string& err) { return Exec("ROLLBACK;", err); }

bool Statement::Prepare(Database& db, const char* sql, std::string& err)
{
    Finalize();
    if (!db.IsOpen()) { err = "database not open"; return false; }
    const int rc = sqlite3_prepare_v2(db.Handle(), sql, -1, &m_stmt, nullptr);
    if (rc != SQLITE_OK) {
        err = sqlite3_errmsg(db.Handle());
        m_stmt = nullptr;
        return false;
    }
    err.clear();
    return true;
}

void Statement::Finalize()
{
    if (m_stmt) { sqlite3_finalize(m_stmt); m_stmt = nullptr; }
}

bool Statement::BindText(int index1Based, const std::string& value, std::string& err)
{
    if (!m_stmt) { err = "statement not prepared"; return false; }
    // SQLITE_TRANSIENT：SQLite 自行複製字串
    const int rc = sqlite3_bind_text(m_stmt, index1Based, value.c_str(), -1, SQLITE_TRANSIENT);
    if (rc != SQLITE_OK) { err = sqlite3_errmsg(sqlite3_db_handle(m_stmt)); return false; }
    return true;
}

bool Statement::BindInt(int index1Based, int64_t value, std::string& err)
{
    if (!m_stmt) { err = "statement not prepared"; return false; }
    const int rc = sqlite3_bind_int64(m_stmt, index1Based, value);
    if (rc != SQLITE_OK) { err = sqlite3_errmsg(sqlite3_db_handle(m_stmt)); return false; }
    return true;
}

bool Statement::BindDouble(int index1Based, double value, std::string& err)
{
    if (!m_stmt) { err = "statement not prepared"; return false; }
    const int rc = sqlite3_bind_double(m_stmt, index1Based, value);
    if (rc != SQLITE_OK) { err = sqlite3_errmsg(sqlite3_db_handle(m_stmt)); return false; }
    return true;
}

bool Statement::BindNull(int index1Based, std::string& err)
{
    if (!m_stmt) { err = "statement not prepared"; return false; }
    const int rc = sqlite3_bind_null(m_stmt, index1Based);
    if (rc != SQLITE_OK) { err = sqlite3_errmsg(sqlite3_db_handle(m_stmt)); return false; }
    return true;
}

bool Statement::BindBlob(int index1Based, const void* data, size_t len, std::string& err)
{
    if (!m_stmt) { err = "statement not prepared"; return false; }
    const int rc = sqlite3_bind_blob(m_stmt, index1Based, data, static_cast<int>(len), SQLITE_TRANSIENT);
    if (rc != SQLITE_OK) { err = sqlite3_errmsg(sqlite3_db_handle(m_stmt)); return false; }
    return true;
}

bool Statement::StepRow(std::string& err)
{
    if (!m_stmt) { err = "statement not prepared"; return false; }
    const int rc = sqlite3_step(m_stmt);
    if (rc == SQLITE_ROW) { err.clear(); return true; }
    if (rc == SQLITE_DONE) { err.clear(); return false; }
    err = sqlite3_errmsg(sqlite3_db_handle(m_stmt));
    return false;
}

bool Statement::Reset(std::string& err)
{
    if (!m_stmt) { err = "statement not prepared"; return false; }
    const int rc = sqlite3_reset(m_stmt);
    if (rc != SQLITE_OK) { err = sqlite3_errmsg(sqlite3_db_handle(m_stmt)); return false; }
    err.clear();
    return true;
}

int64_t Statement::ColumnInt64(int col) const
{
    return sqlite3_column_int64(m_stmt, col);
}

double Statement::ColumnDouble(int col) const
{
    return sqlite3_column_double(m_stmt, col);
}

std::string Statement::ColumnText(int col) const
{
    const unsigned char* t = sqlite3_column_text(m_stmt, col);
    if (!t) return {};
    const int n = sqlite3_column_bytes(m_stmt, col);
    return std::string(reinterpret_cast<const char*>(t), static_cast<size_t>(n));
}

std::vector<uint8_t> Statement::ColumnBlob(int col) const
{
    const void* p = sqlite3_column_blob(m_stmt, col);
    const int n = sqlite3_column_bytes(m_stmt, col);
    if (!p || n <= 0) return {};
    const uint8_t* b = static_cast<const uint8_t*>(p);
    return std::vector<uint8_t>(b, b + n);
}

bool Statement::ColumnIsNull(int col) const
{
    return sqlite3_column_type(m_stmt, col) == SQLITE_NULL;
}

int Statement::ColumnCount() const
{
    return m_stmt ? sqlite3_column_count(m_stmt) : 0;
}

}} // namespace x2::db
