// tests/test_string_filter.cpp — StringFilter（暱稱過濾，源自本倉庫 ScriptData/StringFilter.xls）測試
// 涵蓋：字元集閘門（JP 建置預設）、banned nickname exact、banned word substring、禁用標記、
//       邊界（空字串/GM 標記）、HandleCreateUnitReq/HandleChangeNicknameReq 接線（authLevel < UAL_GM 才擋、
//       authLevel ≥ UAL_GM 繞過）。
#include <cstdio>
#include <string>
#include <cstring>

#include "../src/core/Region.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/StringFilter.h"
#include "../src/core/NetError.h"
#include "../src/server/UnitSelectArbiter.h"
#include "../src/server/CreateUnitProtocol.h"
#include "../src/server/ChangeNicknameProtocol.h"
#include "../src/server/CheckNicknameProtocol.h"

using namespace x2;
using namespace x2::db;
using namespace x2::string_filter;
using namespace x2::select_unit;

void RunStringFilterTestsByRef(int& pass, int& fail);
static int g_pass_sf = 0, g_fail_sf = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_sf++; } \
    else { g_fail_sf++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static void TestCharsetGate()
{
    // JP 建置預設：A-Z/0-9（含小寫經上轉）、CJK 允許
    CHECK(CheckNickName(L"AbC123") == NickNameCheck::Ok, "ascii alnum ok");
    CHECK(CheckNickName(L"占位角色") == NickNameCheck::Ok, "CJK unified ok（JP/TWHK/CN 均允）");
#if defined(X2_REGION_JP)
    CHECK(CheckNickName(L"テスト") == NickNameCheck::Ok, "katakana ok (JP)");
    CHECK(CheckNickName(L"ひらがな") == NickNameCheck::Ok, "hiragana ok (JP)");
    CHECK(CheckNickName(L"プレイヤー99") == NickNameCheck::Ok, "katakana + alnum ok (JP)");
    CHECK(CheckNickName(L"プレイヤー９９") == NickNameCheck::InvalidCharset, "fullwidth digits（U+FF19）rejected (JP)");
    // '（半形括號）等非法字元
    CHECK(CheckNickName(L"a'b") == NickNameCheck::InvalidCharset, "apostrophe rejected by charset (JP)");
    CHECK(CheckNickName(L"nick name") == NickNameCheck::ForbiddenToken || CheckNickName(L"nick name") == NickNameCheck::InvalidCharset,
          "space rejected (forbidden token or charset) (JP)");
    CHECK(CheckNickName(L"한글방") == NickNameCheck::InvalidCharset, "hangul rejected (JP charset)");
    CHECK(CheckNickName(L"bad;name") == NickNameCheck::InvalidCharset, "semicolon rejected (JP)");
#elif defined(X2_REGION_TW) || defined(X2_REGION_HK) || defined(X2_REGION_CN)
    CHECK(CheckNickName(L"テスト") == NickNameCheck::InvalidCharset, "katakana rejected (TWHK/CN)");
    CHECK(CheckNickName(L"ひらがな") == NickNameCheck::InvalidCharset, "hiragana rejected (TWHK/CN)");
    CHECK(CheckNickName(L"プレイヤー99") == NickNameCheck::InvalidCharset, "katakana rejected (TWHK/CN)");
    CHECK(CheckNickName(L"プレイヤー９９") == NickNameCheck::InvalidCharset, "fullwidth digits rejected (TWHK/CN)");
    CHECK(CheckNickName(L"a'b") == NickNameCheck::InvalidCharset, "apostrophe rejected by charset (TWHK/CN)");
    CHECK(CheckNickName(L"nick name") == NickNameCheck::ForbiddenToken || CheckNickName(L"nick name") == NickNameCheck::InvalidCharset,
          "space rejected (TWHK/CN)");
    CHECK(CheckNickName(L"한글방") == NickNameCheck::InvalidCharset, "hangul rejected (TWHK/CN charset)");
    CHECK(CheckNickName(L"bad;name") == NickNameCheck::InvalidCharset, "semicolon rejected (TWHK/CN)");
#else
    // 其餘地區：原碼最終 else → continue（寬鬆字元集；ban list 與禁用標記仍生效）
    CHECK(CheckNickName(L"テスト") == NickNameCheck::Ok, "katakana ok (permissive)");
    CHECK(CheckNickName(L"한글방") == NickNameCheck::Ok, "hangul ok (permissive)");
    CHECK(CheckNickName(L"プレイヤー９９") == NickNameCheck::Ok, "fullwidth digits ok (permissive)");
    CHECK(CheckNickName(L"a'b") == NickNameCheck::Ok, "apostrophe ok (permissive charset; 注入閘門另擋)");
    CHECK(CheckNickName(L"bad;name") == NickNameCheck::Ok, "semicolon ok (permissive charset; 注入閘門另擋)");
    CHECK(CheckNickName(L"nick name") == NickNameCheck::ForbiddenToken, "space rejected (forbidden token, permissive)");
#endif
}

static void TestBannedLists()
{
    // banned nickname exact（大小寫不敏感）
    CHECK(CheckNickName(L"넥손") == NickNameCheck::InvalidCharset || CheckNickName(L"넥손") == NickNameCheck::BannedNickName,
          "넥손 rejected (charset or exact ban)");
    CHECK(CheckNickName(L"NEXON") == NickNameCheck::BannedNickName, "NEXON exact ban (upper)");
    CHECK(CheckNickName(L"nexon") == NickNameCheck::BannedNickName, "nexon exact ban (lower -> upper)");
    CHECK(CheckNickName(L"Mplay") == NickNameCheck::BannedNickName, "Mplay exact ban (ci)");
    CHECK(CheckNickName(L"GM") == NickNameCheck::BannedNickName || CheckNickName(L"GM") == NickNameCheck::ForbiddenToken,
          "GM rejected (ban list or forbidden token)");
    CHECK(CheckNickName(L"notABANNED") != NickNameCheck::BannedNickName, "not banned exact");
    // banned word substring
    CHECK(CheckNickName(L"fuckyou") == NickNameCheck::BannedWord, "fuck substring ban");
    CHECK(CheckNickName(L"18금짱") == NickNameCheck::InvalidCharset || CheckNickName(L"18금짱") == NickNameCheck::BannedWord,
          "18금 substring ban");
    CHECK(CheckNickName(L"xyzFUCKabc") == NickNameCheck::BannedWord, "FUCK substring ci");
    CHECK(CheckNickName(L"safeword") == NickNameCheck::Ok, "safe word ok");
}

static void TestForbiddenTokens()
{
    CHECK(CheckNickName(L"a b") == NickNameCheck::ForbiddenToken || CheckNickName(L"a b") == NickNameCheck::InvalidCharset, "space");
    CHECK(CheckNickName(L"a/b") != NickNameCheck::Ok, "slash");
    CHECK(CheckNickName(L"a\\b") != NickNameCheck::Ok, "backslash");
    CHECK(CheckNickName(L"a(b") != NickNameCheck::Ok, "paren");
    CHECK(CheckNickName(L"a[b") != NickNameCheck::Ok, "bracket");
    CHECK(CheckNickName(L"a%b") != NickNameCheck::Ok, "percent");
    CHECK(CheckNickName(L"a!b") != NickNameCheck::Ok, "bang");
    CHECK(CheckNickName(L"a\"b") != NickNameCheck::Ok, "quote");
    CHECK(CheckNickName(L"myGMname") != NickNameCheck::Ok, "GM substring");
    CHECK(CheckNickName(L"[GM]") != NickNameCheck::Ok, "bracket+GM");
    // GM token 大小寫不敏感（上轉後比對）
    CHECK(CheckNickName(L"gmnickname") != NickNameCheck::Ok, "gm lowercase substring");
}

static void TestCreateUnitFilterWiring()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open game db");
    CHECK(ApplyGameMigrations(db, err), "migrations");
    GameStore store(db);
    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(555, "filtertester", gu, err), "seed guser");
    // 非 GM（authLevel=1）：被過濾器擋下（NEXON 精確禁用）
    {
        create_unit::CreateUnitReq req; req.wstrNickName = L"NEXON"; req.iClass = 1;
        create_unit::CreateUnitAck ack;
        CHECK(HandleCreateUnitReq(store, 555, /*authLevel=*/1, req, ack, err), "gm-less create handled");
        CHECK(ack.iOK == ERR_CREATE_UNIT_08, "filtered nickname -> ERR_CREATE_UNIT_08");
    }
    // GM（authLevel=2）：繞過過濾器（仍可能被長度/注入/DB 擋，但不過濾器）
    {
        create_unit::CreateUnitReq req; req.wstrNickName = L"NEXON"; req.iClass = 1;
        create_unit::CreateUnitAck ack;
        CHECK(HandleCreateUnitReq(store, 555, /*authLevel=*/2, req, ack, err), "GM create handled");
        CHECK(ack.iOK == NET_OK, "GM bypasses string filter");
    }
    // 非 GM：非法字元（JP charset）→ _08
    {
        create_unit::CreateUnitReq req; req.wstrNickName = L"a'b"; req.iClass = 1;
        create_unit::CreateUnitAck ack;
        CHECK(HandleCreateUnitReq(store, 555, 1, req, ack, err), "charset create handled");
        CHECK(ack.iOK == ERR_CREATE_UNIT_08, "charset-invalid -> ERR_CREATE_UNIT_08");
    }
}

static void TestChangeNicknameFilterWiring()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open game db");
    CHECK(ApplyGameMigrations(db, err), "migrations");
    GameStore store(db);
    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(556, "changenickfilter", gu, err), "seed guser");
    int64_t uid = 0;
    CHECK(store.CreateUnit(556, "原始角色", 1, uid, err) == CreateUnitResult::Ok, "create unit");
    // 非 GM：改成禁用暱稱 → ERR_RESTORE_NICK_NAME_05
    {
        change_nickname::ChangeNickNameReq req; req.iUnitUID = uid; req.wstrNickName = L"NEXON"; req.bCheckOnly = true;
        change_nickname::ChangeNickNameAck ack;
        CHECK(HandleChangeNicknameReq(store, 556, req, ack, err, /*authLevel=*/1), "handled");
        CHECK(ack.iOK == ERR_RESTORE_NICK_NAME_05, "filtered -> ERR_RESTORE_NICK_NAME_05");
    }
    // GM：繞過
    {
        change_nickname::ChangeNickNameReq req; req.iUnitUID = uid; req.wstrNickName = L"NEXON"; req.bCheckOnly = true;
        change_nickname::ChangeNickNameAck ack;
        CHECK(HandleChangeNicknameReq(store, 556, req, ack, err, /*authLevel=*/2), "GM handled");
        CHECK(ack.iOK != ERR_RESTORE_NICK_NAME_05, "GM bypasses filter");
    }
    // check-only 入口同樣套用
    {
        check_nickname::EntryPointCheckNickNameReq creq; creq.wstrNickName = L"NEXON";
        check_nickname::EntryPointCheckNickNameAck cack;
        CHECK(HandleCheckNicknameReq(store, creq, cack, err, /*authLevel=*/1), "check handled");
        CHECK(cack.iOK == ERR_RESTORE_NICK_NAME_05, "check filtered -> _05");
    }
}

void RunStringFilterTestsByRef(int& pass, int& fail)
{
    TestCharsetGate();
    TestBannedLists();
    TestForbiddenTokens();
    TestCreateUnitFilterWiring();
    TestChangeNicknameFilterWiring();
    pass += g_pass_sf;
    fail += g_fail_sf;
}
