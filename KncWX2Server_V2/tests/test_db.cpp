// tests/test_db.cpp — DB 層測試（in-memory SQLite；不觸碰真實檔案）
// RunDbTestsByRef 由 tests/test_all.cpp 的 main() 呼叫
#include <cstdio>
#include <string>
#include <vector>

#include "../src/core/Sha256.h"
#include "../src/db/Sqlite.h"
#include "../src/db/UserStore.h"
#include "../src/security/Md5.h"

using namespace x2;
using namespace x2::db;

void RunDbTestsByRef(int& pass, int& fail);
static int g_pass_db = 0, g_fail_db = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_db++; } \
    else { g_fail_db++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static void TestSha256Vectors()
{
    CHECK(Sha256::HexDigest("") == "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "sha256 empty");
    CHECK(Sha256::HexDigest("abc") == "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad", "sha256 abc");
    CHECK(Sha256::HexDigest("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq") ==
          "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1", "sha256 56-byte");
    Sha256 s;
    const std::string millionA(1000000, 'a');
    s.Update(millionA.data(), millionA.size());
    const auto digest = s.Final();
    static const char* hex = "0123456789abcdef";
    std::string got;
    for (uint8_t b : digest) { got.push_back(hex[b >> 4]); got.push_back(hex[b & 0xF]); }
    CHECK(got == "cdc76e5c9914fb9281a1c7e284d73e67f1809a48a497200e046d39ccc7112cd0", "sha256 1M a");
}

static bool OpenMemDb(Database& db, std::string& err)
{
    if (!db.Open(":memory:", err)) return false;
    return ApplyMigrations(db, err);
}

static void TestMigrationsIdempotent()
{
    Database db;
    std::string err;
    CHECK(OpenMemDb(db, err), "migrate ok");
    CHECK(db.UserVersion(err) == 1, "user_version == 1 after migrate");
    CHECK(ApplyMigrations(db, err), "migrate idempotent (2nd call)");
    CHECK(db.UserVersion(err) == 1, "user_version still 1");
    // 重複套用不會重建表（若重建會炸在 duplicate table）
}

static void TestCreateFindVerify()
{
    Database db;
    std::string err;
    CHECK(OpenMemDb(db, err), "open");
    UserStore store(db);

    CHECK(store.CreateUser("warrior77", "s3cret!", "M", err), "create user");
    CHECK(!store.CreateUser("warrior77", "other", "M", err), "duplicate login rejected");

    bool found = false;
    UserRecord rec;
    CHECK(store.FindUser("warrior77", rec, found, err), "find ok");
    CHECK(found, "user found");
    CHECK(rec.login == "warrior77", "login");
    CHECK(rec.loginUID >= 1, "loginUID auto-increment");
    CHECK(rec.gamePoint == 200, "default gamePoint 200");
    CHECK(rec.grade == 0, "default grade 0");
    CHECK(rec.playTime == 0, "default playTime 0");
    CHECK(rec.ipAddress == "0.0.0.0", "default ip");
    CHECK(!rec.connecting, "default not connecting");
    CHECK(rec.sex == "M", "sex stored");

    CHECK(store.VerifyPassword("warrior77", "s3cret!", err) == VerifyResult::Valid, "verify valid");
    CHECK(store.VerifyPassword("warrior77", "wrong", err) == VerifyResult::Invalid, "verify wrong password");
    CHECK(store.VerifyPassword("nosuchuser", "whatever", err) == VerifyResult::Invalid, "verify unknown user");

    // 大小寫不敏感（對應 SQL Server CI collation 近似）
    bool found2 = false;
    UserRecord rec2;
    CHECK(store.FindUser("WARRIOR77", rec2, found2, err), "find ci ok");
    CHECK(found2, "case-insensitive login lookup");

    // 兩個使用者同密碼 → 鹽不同 → passwd 不同
    std::string p1, p2;
    {
        Statement st;
        CHECK(st.Prepare(db, "SELECT passwd FROM users WHERE Login = 'warrior77';", err), "select pw");
        CHECK(st.StepRow(err), "select pw row");
        p1 = st.ColumnText(0);
    }
    CHECK(store.CreateUser("mage99", "s3cret!", "F", err), "second user same pw");
    {
        Statement st;
        CHECK(st.Prepare(db, "SELECT passwd FROM users WHERE Login = 'mage99';", err), "select pw2");
        CHECK(st.StepRow(err), "select pw2 row");
        p2 = st.ColumnText(0);
    }
    CHECK(p1 != p2, "different salts produce different passwd");
    CHECK(p1.size() == 64 && p2.size() == 64, "sha256-salt hex length");

    // ModeLevel 預設 x'00'（長度 1 的 blob）
    {
        Statement st;
        CHECK(st.Prepare(db, "SELECT length(ModeLevel) FROM users WHERE Login = 'warrior77';", err), "modelevel query");
        CHECK(st.StepRow(err), "modelevel row");
        CHECK(st.ColumnInt64(0) == 1, "modelevel default x'00'");
    }
}

static void TestLegacyMd5Upgrade()
{
    Database db;
    std::string err;
    CHECK(OpenMemDb(db, err), "open");
    // 模擬自原 SQL Server 遷移進來的 md5 列（passwd_algo='md5'、無鹽）
    const std::string legacy = security::Md5::HexDigest("legacypw", 8);
    {
        Statement st;
        CHECK(st.Prepare(db,
            "INSERT INTO users (Login, passwd, passwd_algo, salt, sex) VALUES ('olduser', ?, 'md5', '', 'F');",
            err), "insert legacy");
        CHECK(st.BindText(1, legacy, err), "bind legacy");
        std::string e;
        CHECK(!st.StepRow(e), "insert legacy done");
        CHECK(e.empty(), "insert legacy err empty");
    }
    CHECK(UserStore(db).VerifyPassword("olduser", "legacypw", err) == VerifyResult::Valid, "md5 legacy verify valid");
    CHECK(UserStore(db).VerifyPassword("olduser", "bogus", err) == VerifyResult::Invalid, "md5 legacy verify wrong pw");

    // 登入成功後升級
    CHECK(UserStore(db).UpgradePasswordIfLegacy("olduser", "legacypw", err), "upgrade legacy");
    {
        Statement st;
        CHECK(st.Prepare(db, "SELECT passwd_algo, salt FROM users WHERE Login = 'olduser';", err), "check algo");
        CHECK(st.StepRow(err), "check algo row");
        CHECK(st.ColumnText(0) == "sha256-salt", "algo upgraded to sha256-salt");
        CHECK(!st.ColumnText(1).empty(), "salt assigned on upgrade");
    }
    CHECK(UserStore(db).VerifyPassword("olduser", "legacypw", err) == VerifyResult::Valid, "verify after upgrade");
    CHECK(UserStore(db).VerifyPassword("olduser", "bogus", err) == VerifyResult::Invalid, "wrong pw after upgrade");
}

static void TestRecordLoginLogout()
{
    Database db;
    std::string err;
    CHECK(OpenMemDb(db, err), "open");
    UserStore store(db);
    CHECK(store.CreateUser("loginguard", "pw", "M", err), "create");
    CHECK(store.RecordLogin("loginguard", "1.2.3.4", err), "record login");
    bool found = false;
    UserRecord rec;
    CHECK(store.FindUser("loginguard", rec, found, err), "find");
    CHECK(found && rec.connecting, "connecting set on login");
    CHECK(rec.ipAddress == "1.2.3.4", "ip recorded");
    CHECK(store.RecordLogout("loginguard", err), "record logout");
    CHECK(store.FindUser("loginguard", rec, found, err), "find2");
    CHECK(found && !rec.connecting, "connecting cleared on logout");
}

static void TestSqlInjectionSafe()
{
    Database db;
    std::string err;
    CHECK(OpenMemDb(db, err), "open");
    UserStore store(db);
    const std::string evil = "x' OR '1'='1";
    CHECK(store.CreateUser(evil, "pw", "M", err), "create with injection-shaped login (stored literally)");
    bool found = false;
    UserRecord rec;
    // 只會找到「字面上等於 x' OR '1'='1」的列，不會因注入而命中其他列
    CHECK(store.FindUser(evil, rec, found, err), "find literal");
    CHECK(found && rec.login == evil, "literal match only");
    bool found2 = false;
    UserRecord rec2;
    CHECK(store.FindUser("nonexistent' OR '1'='1'--", rec2, found2, err), "find injection no-hit");
    CHECK(!found2, "injection string does not match anything");
    CHECK(store.VerifyPassword(evil, "pw", err) == VerifyResult::Valid, "verify literal login");
    // 表仍完整
    {
        Statement st;
        CHECK(st.Prepare(db, "SELECT count(*) FROM users;", err), "count");
        CHECK(st.StepRow(err), "count row");
        CHECK(st.ColumnInt64(0) == 1, "exactly one user row");
    }
}

static void TestConstraintViolations()
{
    Database db;
    std::string err;
    CHECK(OpenMemDb(db, err), "open");
    UserStore store(db);
    CHECK(!store.CreateUser("", "pw", "M", err), "empty login rejected");
    CHECK(!store.CreateUser(std::string(21, 'a'), "pw", "M", err), "login > 20 chars rejected (nvarchar(20))");
    CHECK(!store.CreateUser("okname", "", "M", err), "empty password rejected");
    CHECK(!store.CreateUser("okname", "pw", "", err), "empty sex rejected");
}

void RunDbTestsByRef(int& pass, int& fail)
{
    TestSha256Vectors();
    TestMigrationsIdempotent();
    TestCreateFindVerify();
    TestLegacyMd5Upgrade();
    TestRecordLoginLogout();
    TestSqlInjectionSafe();
    TestConstraintViolations();
    pass += g_pass_db;
    fail += g_fail_db;
}
