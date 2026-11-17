// UserStore.cpp
#include "UserStore.h"

#include <random>
#include <vector>

#include "../core/Sha256.h"
#include "../security/Md5.h"

namespace x2 { namespace db {

static const char* kCreateUsersV1 = R"SQL(
CREATE TABLE users (
    LoginUID     INTEGER PRIMARY KEY AUTOINCREMENT,
    Login        TEXT NOT NULL UNIQUE COLLATE NOCASE
                 CHECK (length(Login) BETWEEN 1 AND 20),
    passwd       TEXT NOT NULL
                 CHECK (length(passwd) IN (32, 64)),   -- 32=legacy md5 hex，64=sha256-salt hex
    passwd_algo  TEXT NOT NULL DEFAULT 'sha256-salt'
                 CHECK (passwd_algo IN ('md5', 'sha256-salt')),
    salt         TEXT NOT NULL DEFAULT '',
    sex          TEXT NOT NULL CHECK (length(sex) BETWEEN 1 AND 8),
    firstLogin   TEXT NOT NULL DEFAULT (datetime('now')),
    lastConnect  TEXT NOT NULL DEFAULT (datetime('now')),
    lastLogin    TEXT NOT NULL DEFAULT (datetime('now')),
    playTime     INTEGER NOT NULL DEFAULT 0,
    gamePoint    INTEGER NOT NULL DEFAULT 200,
    IPAddress    TEXT NOT NULL DEFAULT '0.0.0.0',
    Connecting   INTEGER NOT NULL DEFAULT 0 CHECK (Connecting IN (0, 1)),
    ModeLevel    BLOB NOT NULL DEFAULT (x'00'),
    Grade        INTEGER NOT NULL DEFAULT 0
);
)SQL";

bool ApplyMigrations(Database& db, std::string& err)
{
    if (!db.IsOpen()) { err = "database not open"; return false; }
    const int v = db.UserVersion(err);
    if (v < 0) return false;
    if (v >= kSchemaVersion) { err.clear(); return true; }

    if (!db.Begin(err)) return false;
    if (v < 1) {
        if (!db.Exec(kCreateUsersV1, err)) {
            std::string unused;
            db.Rollback(unused);
            err = std::string("migration v1 failed: ") + err;
            return false;
        }
    }
    if (!db.SetUserVersion(kSchemaVersion, err)) { std::string unused; db.Rollback(unused); return false; }
    return db.Commit(err);
}

std::string UserStore::ToLowerHex(const unsigned char* data, size_t len)
{
    static const char* hex = "0123456789abcdef";
    std::string out;
    out.reserve(len * 2);
    for (size_t i = 0; i < len; ++i) {
        out.push_back(hex[data[i] >> 4]);
        out.push_back(hex[data[i] & 0xF]);
    }
    return out;
}

std::string UserStore::GenerateSaltHex()
{
    std::random_device rd;
    unsigned char bytes[16];
    for (int i = 0; i < 16; i += 4) {
        const uint32_t r = rd();
        bytes[i + 0] = static_cast<unsigned char>(r & 0xFF);
        bytes[i + 1] = static_cast<unsigned char>((r >> 8) & 0xFF);
        bytes[i + 2] = static_cast<unsigned char>((r >> 16) & 0xFF);
        bytes[i + 3] = static_cast<unsigned char>((r >> 24) & 0xFF);
    }
    return ToLowerHex(bytes, sizeof(bytes));
}

std::string UserStore::HashSha256Salted(const std::string& saltHex, const std::string& rawPassword)
{
    // 雜湊輸入為 saltHex + ":" + 密碼（明文僅存在記憶體中）
    Sha256 sha;
    sha.Update(saltHex.data(), saltHex.size());
    const char colon = ':';
    sha.Update(&colon, 1);
    sha.Update(rawPassword.data(), rawPassword.size());
    const auto digest = sha.Final();
    return ToLowerHex(digest.data(), digest.size());
}

std::string UserStore::HashLegacyMd5(const std::string& rawPassword)
{
    return security::Md5::HexDigest(rawPassword.data(), rawPassword.size());
}

bool UserStore::CreateUser(const std::string& login, const std::string& rawPassword,
                           const std::string& sex, std::string& err)
{
    if (login.empty()) { err = "empty login"; return false; }
    if (sex.empty()) { err = "empty sex"; return false; }
    if (rawPassword.empty()) { err = "empty password"; return false; }

    const std::string salt = GenerateSaltHex();
    const std::string passwd = HashSha256Salted(salt, rawPassword);

    Statement st;
    if (!st.Prepare(m_db,
            "INSERT INTO users (Login, passwd, passwd_algo, salt, sex) VALUES (?, ?, 'sha256-salt', ?, ?);",
            err)) return false;
    if (!st.BindText(1, login, err)) return false;
    if (!st.BindText(2, passwd, err)) return false;
    if (!st.BindText(3, salt, err)) return false;
    if (!st.BindText(4, sex, err)) return false;
    std::string stepErr;
    if (st.StepRow(stepErr)) { err = "unexpected row returned by INSERT"; return false; }
    if (!stepErr.empty()) { err = stepErr; return false; }
    err.clear();
    return true;
}

bool UserStore::FindUser(const std::string& login, UserRecord& out, bool& found, std::string& err)
{
    Statement st;
    if (!st.Prepare(m_db,
            "SELECT LoginUID, Login, sex, firstLogin, lastConnect, lastLogin, playTime, gamePoint,"
            " grade, IPAddress, Connecting FROM users WHERE Login = ?;",
            err)) return false;
    if (!st.BindText(1, login, err)) return false;

    std::string stepErr;
    if (st.StepRow(stepErr)) {
        out.loginUID   = st.ColumnInt64(0);
        out.login      = st.ColumnText(1);
        out.sex        = st.ColumnText(2);
        out.firstLogin = st.ColumnText(3);
        out.lastConnect= st.ColumnText(4);
        out.lastLogin  = st.ColumnText(5);
        out.playTime   = static_cast<int32_t>(st.ColumnInt64(6));
        out.gamePoint  = static_cast<int32_t>(st.ColumnInt64(7));
        out.grade      = static_cast<int32_t>(st.ColumnInt64(8));
        out.ipAddress  = st.ColumnText(9);
        out.connecting = st.ColumnInt64(10) != 0;
        found = true;
        err.clear();
        return true;
    }
    if (!stepErr.empty()) { err = stepErr; return false; }
    found = false;
    err.clear();
    return true;
}

VerifyResult UserStore::VerifyPassword(const std::string& login, const std::string& rawPassword, std::string& err)
{
    Statement st;
    if (!st.Prepare(m_db,
            "SELECT passwd, passwd_algo, salt FROM users WHERE Login = ?;",
            err)) return VerifyResult::Error;
    if (!st.BindText(1, login, err)) return VerifyResult::Error;

    std::string stepErr;
    if (st.StepRow(stepErr)) {
        const std::string stored = st.ColumnText(0);
        const std::string algo   = st.ColumnText(1);
        const std::string salt   = st.ColumnText(2);
        std::string expect;
        if (algo == "md5") {
            expect = HashLegacyMd5(rawPassword);           // 原庫遷移資料（鹽值無）
        } else if (algo == "sha256-salt") {
            expect = HashSha256Salted(salt, rawPassword);
        } else {
            err = "unknown passwd_algo: " + algo;
            return VerifyResult::Error;
        }
        err.clear();
        return ConstantTimeHexEquals(stored, expect) ? VerifyResult::Valid : VerifyResult::Invalid;
    }
    if (!stepErr.empty()) { err = stepErr; return VerifyResult::Error; }

    // 帳號不存在：仍做一次假雜湊比較，拉平時序差異（不洩漏帳號是否存在）
    const std::string dummy = HashSha256Salted("00000000000000000000000000000000", rawPassword);
    (void)ConstantTimeHexEquals(dummy, dummy);
    err.clear();
    return VerifyResult::Invalid;
}

bool UserStore::RecordLogin(const std::string& login, const std::string& ip, std::string& err)
{
    Statement st;
    if (!st.Prepare(m_db,
            "UPDATE users SET Connecting = 1, lastLogin = datetime('now'),"
            " lastConnect = datetime('now'), IPAddress = ? WHERE Login = ?;",
            err)) return false;
    if (!st.BindText(1, ip, err)) return false;
    if (!st.BindText(2, login, err)) return false;
    std::string stepErr;
    if (st.StepRow(stepErr)) { err = "unexpected row returned by UPDATE"; return false; }
    if (!stepErr.empty()) { err = stepErr; return false; }
    err.clear();
    return true;
}

bool UserStore::RecordLogout(const std::string& login, std::string& err)
{
    Statement st;
    if (!st.Prepare(m_db, "UPDATE users SET Connecting = 0 WHERE Login = ?;", err)) return false;
    if (!st.BindText(1, login, err)) return false;
    std::string stepErr;
    if (st.StepRow(stepErr)) { err = "unexpected row returned by UPDATE"; return false; }
    if (!stepErr.empty()) { err = stepErr; return false; }
    err.clear();
    return true;
}

bool UserStore::UpgradePasswordIfLegacy(const std::string& login, const std::string& rawPassword, std::string& err)
{
    Statement st;
    if (!st.Prepare(m_db, "SELECT passwd_algo FROM users WHERE Login = ?;", err)) return false;
    if (!st.BindText(1, login, err)) return false;
    std::string stepErr;
    if (st.StepRow(stepErr)) {
        const std::string algo = st.ColumnText(0);
        if (algo != "md5") { err.clear(); return true; }   // 已是新演算法
        const std::string salt = GenerateSaltHex();
        const std::string passwd = HashSha256Salted(salt, rawPassword);
        Statement up;
        if (!up.Prepare(m_db,
                "UPDATE users SET passwd = ?, passwd_algo = 'sha256-salt', salt = ? WHERE Login = ?;",
                err)) return false;
        if (!up.BindText(1, passwd, err)) return false;
        if (!up.BindText(2, salt, err)) return false;
        if (!up.BindText(3, login, err)) return false;
        std::string us;
        if (up.StepRow(us)) { err = "unexpected row returned by UPDATE"; return false; }
        if (!us.empty()) { err = us; return false; }
        err.clear();
        return true;
    }
    if (!stepErr.empty()) { err = stepErr; return false; }
    err = "user not found: " + login;
    return false;
}

bool UserStore::DeleteUser(const std::string& login, std::string& err)
{
    Statement st;
    if (!st.Prepare(m_db, "DELETE FROM users WHERE Login = ?;", err)) return false;
    if (!st.BindText(1, login, err)) return false;
    std::string stepErr;
    if (st.StepRow(stepErr)) { err = "unexpected row returned by DELETE"; return false; }
    if (!stepErr.empty()) { err = stepErr; return false; }
    err.clear();
    return true;
}

}} // namespace x2::db
