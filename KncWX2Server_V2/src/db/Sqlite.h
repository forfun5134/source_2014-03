// Sqlite.h — SQLite C API 的 RAII 封裝（V2 DB 層底座）
// 對應原 SQL Server 直接呼叫（dblib/ODBC，經由 KncDataBase）→ SQLite 直連。
// 三條鐵則：
//   1. 一律參數化查詢（sqlite3_bind_*），禁止字串拼接 SQL 值
//   2. 錯誤一律帶 sqlite3_errmsg 訊息回傳，禁止靜默失敗
//   3. 連線/敘述句採 RAII；資料庫為單執行緒使用（SQLITE_THREADSAFE=2 + 外部互斥由呼叫端保證）
#pragma once

#include <cstdint>
#include <string>
#include <vector>

#include "../../third_party/sqlite/sqlite3.h"

namespace x2 { namespace db {

class Database
{
public:
    Database() = default;
    ~Database() { Close(); }
    Database(const Database&) = delete;
    Database& operator=(const Database&) = delete;

    // path == ":memory:" 為記憶體資料庫；"" 拒絕（避免誤開）
    bool Open(const std::string& path, std::string& err);
    void Close();
    bool IsOpen() const { return m_db != nullptr; }

    // 執行無結果集的 SQL（DDL/DML）；失敗回 false 並帶 err
    bool Exec(const std::string& sql, std::string& err);

    // user_version PRAGMA（schema 遷移用）；失敗回 -1
    int  UserVersion(std::string& err);
    bool SetUserVersion(int v, std::string& err);

    // sqlite3_changes64：最近一條 INSERT/UPDATE/DELETE 影響的列數（0 = 未命中）
    int64_t Changes() const;

    // 交易（BEGIN/COMMIT/ROLLBACK）
    bool Begin(std::string& err);
    bool Commit(std::string& err);
    bool Rollback(std::string& err);

    sqlite3* Handle() const { return m_db; }

private:
    sqlite3* m_db = nullptr;
};

class Statement
{
public:
    Statement() = default;
    ~Statement() { Finalize(); }
    Statement(const Statement&) = delete;
    Statement& operator=(const Statement&) = delete;

    bool Prepare(Database& db, const char* sql, std::string& err);
    void Finalize();
    bool IsPrepared() const { return m_stmt != nullptr; }

    bool BindText(int index1Based, const std::string& value, std::string& err);
    bool BindInt(int index1Based, int64_t value, std::string& err);
    bool BindDouble(int index1Based, double value, std::string& err);
    bool BindNull(int index1Based, std::string& err);
    bool BindBlob(int index1Based, const void* data, size_t len, std::string& err);

    // 執行一步；SQLITE_ROW → true（有列），SQLITE_DONE → false（無更多列），錯誤 → false 並設 err
    // 注意：錯誤與 DONE 以 return false 區分時，呼叫端需檢查 err 是否為空
    bool StepRow(std::string& err);
    bool Reset(std::string& err);

    int64_t ColumnInt64(int col) const;
    double ColumnDouble(int col) const;
    std::string ColumnText(int col) const;
    std::vector<uint8_t> ColumnBlob(int col) const;
    bool ColumnIsNull(int col) const;

    int ColumnCount() const;

private:
    sqlite3_stmt* m_stmt = nullptr;
};

}} // namespace x2::db
