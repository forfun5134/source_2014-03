// UserStore.h — V2 帳號（users 表）存取層
//
// 對應原 SQL Server 版 `users`（LoginServer 認證路徑）
//   原：[Login] nvarchar(20) PK CLUSTERED、LoginUID int IDENTITY(1,1)、passwd nvarchar(32)
//       （疑似未加鹽 MD5 十六進位——**V2 拒絕原樣照搬**）
//
// V2 差異（刻意且與原版不相容於「密碼語意」，其餘欄位語意保持）：
//   - passwd 存 sha256(saltHex + ":" + password) 的十六進位（64 字元，演算法 sha256-salt）；
//     遷移自原庫的 md5 列保留 passwd_algo='md5' 並仍可登入驗證，登入成功時應呼叫
//     UpgradePasswordIfLegacy 重寫為 sha256-salt。
//   - 新增 salt（hex，16 bytes random_device）與 passwd_algo（'md5'|'sha256-salt'）兩欄。
//   - Login 改 COLLATE NOCASE（原 SQL Server 預設 CI collation 的近似；僅 ASCII 大小寫不敏感）。
//   - LoginUID INTEGER PRIMARY KEY AUTOINCREMENT（原 IDENTITY(1,1)）；Login UNIQUE。
//   - smalldatetime → TEXT（ISO8601 UTC，datetime('now')）；Connecting → INTEGER 0/1。
//   - gamePoint 預設 200、Connecting/Grade 預設 0、IPAddress 預設 '0.0.0.0'、
//     ModeLevel 預設 x'00'、firstLogin/lastConnect/lastLogin 預設 datetime('now')——與原 DF_* 一致。
//   - 一律參數化查詢；密碼比較採常數時間演算法。
#pragma once

#include <cstdint>
#include <string>

#include "Sqlite.h"

namespace x2 { namespace db {

inline constexpr int kSchemaVersion = 1;

// schema 遷移：v0→v1 建立 users 表；可重複呼叫（冪等）
bool ApplyMigrations(Database& db, std::string& err);

struct UserRecord
{
    std::string login;
    int64_t loginUID = 0;
    std::string sex;                        // 原 char(1)
    std::string firstLogin, lastConnect, lastLogin;   // ISO8601 UTC
    int32_t playTime = 0;
    int32_t gamePoint = 0;
    int32_t grade = 0;
    std::string ipAddress;
    bool connecting = false;
};

enum class VerifyResult { Valid, Invalid, Error };

class UserStore
{
public:
    explicit UserStore(Database& db) : m_db(db) {}

    // 建立使用者；密碼以 sha256-salt 存入。sex 依原 DDL 允許任意長度（原 char(1) 寬鬆），但不得為空。
    bool CreateUser(const std::string& login, const std::string& rawPassword,
                    const std::string& sex, std::string& err);

    // 讀取使用者（不含密碼欄位）；找不到 → false 且 err 空？不——以 bool 回傳，err 僅供基礎設施錯誤。
    // 用法：found = FindUser(...)；exists=true/false 由回傳值表達（見回傳語意註解）
    bool FindUser(const std::string& login, UserRecord& out, bool& found, std::string& err);

    // 驗證密碼；Valid/Invalid（含帳號不存在）/Error（DB 錯誤）。
    // 對不存在帳號執行一次假雜湊比較以拉平時序差異。
    VerifyResult VerifyPassword(const std::string& login, const std::string& rawPassword, std::string& err);

    // 登入成功：Connecting=1、lastLogin=now、lastConnect=now、IPAddress=ip
    bool RecordLogin(const std::string& login, const std::string& ip, std::string& err);
    // 登出：Connecting=0
    bool RecordLogout(const std::string& login, std::string& err);

    // 登入成功後呼叫：若該列仍是 md5 演算法，以 sha256-salt 重寫（原地升級）
    bool UpgradePasswordIfLegacy(const std::string& login, const std::string& rawPassword, std::string& err);

    // 刪除使用者（admin 用途；原版由 GM 工具處理）
    bool DeleteUser(const std::string& login, std::string& err);

private:
    Database& m_db;

    static std::string GenerateSaltHex();                       // 16 random bytes → 32 hex
    static std::string HashSha256Salted(const std::string& saltHex, const std::string& rawPassword);
    static std::string HashLegacyMd5(const std::string& rawPassword);
    static std::string ToLowerHex(const unsigned char* data, size_t len);
};

}} // namespace x2::db
