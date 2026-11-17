// tests/test_select_not4_readback.cpp — SELECT_UNIT_4_NOT 黑名單/稱號對象（師徒）/30 分鐘連線事件讀回（§0a13）
// 對照原 DBE_SELECT_UNIT_REQ → Query_SelectUnit 的對應段（GSGameDBThread.cpp:2474–2540、2668–2745）：
//   vecChatBlackList    ← gup_select_blacklist（GBlackList JOIN gunit_nickname）：KChatBlackListUnit{ m_iUnitUID, m_wstrNickName }
//   vecTutorialDBUnitInfo ← gup_get_tutor（10 級以下＝學生（讀我的老師）、20 級以上＝老師（讀我的學生）、11–19 級不查）
//                           KTutorialDBUnitInfo{ kTutorialUnitInfo{ m_iUnitUID, m_ucLevel（EXP 換算 æ0u 慣例）, m_wstrNickName, m_bIsOnline=false }, m_wstrLastDate ← GTutor.LastDate }
//                           原 proc 學生分支會 UPDATE GTutor SET LastDate=now——V2 SELECT 唯讀，不改寫（docs §0a13 偏差聲明）
//   vecConnectTimeEvent  ← gup_select_30min（GIs30Min）：KConnectTimeEventInfo{ m_iEventUID ← EventType, m_wstrEventTime ← RegDate, m_bAccountEvent=false }
//   vecCumulativeTimeEvent：gup_get_remaintime／帳號級 gup_select_event_account_* 不在倉庫 → 恆空
// ⚠ 偏差聲明見 docs §0a13。
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>

#include "../src/core/NetError.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/UnitSelectArbiter.h"
#include "../src/server/SelectUnitProtocol.h"
#include "../src/server/CreateUnitProtocol.h"

using namespace x2;
using namespace x2::db;
using namespace x2::select_unit;
using namespace x2::create_unit;

static int g_pass_n4 = 0, g_fail_n4 = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_n4++; } \
    else { g_fail_n4++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

struct Fixture
{
    Database db;
    GameStore store;
    std::string err;
    Fixture() : store(db)
    {
        if (!db.Open(":memory:", err)) return;
        ApplyGameMigrations(db, err);
    }
    int64_t MakeUnit(int64_t userUID, const wchar_t* nick)
    {
        // userID 需要唯一（GetOrCreateGUser 只在第一次建立）
        char buf[32];
        std::snprintf(buf, sizeof buf, "n4_%lld", (long long)userUID);
        GUserRecord gu;
        if (!store.GetOrCreateGUser(userUID, buf, gu, err)) return -1;
        CreateUnitReq req; req.iClass = 1; req.wstrNickName = nick;
        CreateUnitAck ack;
        if (!HandleCreateUnitReq(store, userUID, 5, req, ack, err)) return -1;
        return ack.iOK == NET_OK ? ack.kUnitInfo.unitUID : -1;
    }
};

static bool SelectNot4(GameStore& store, int64_t userUID, int64_t unitUID, SelectUnitNot4* not4)
{
    SelectUnitReq req; req.unitUID = unitUID;
    SelectUnitAck ack;
    std::string err;
    int rc = HandleSelectUnitReq(store, userUID, req, ack, err, /*secondSecurityOk=*/true,
                                 /*outUnit=*/nullptr, /*outNot1=*/nullptr, /*authLevel=*/5,
                                 /*outNot2=*/nullptr, /*outNot3=*/nullptr,
                                 not4, /*outNot5=*/nullptr);
    return rc == NET_OK && ack.iOK == NET_OK;
}

static void TestSchemaV7()
{
    Fixture fx;
    int v = fx.db.UserVersion(fx.err);
    CHECK(v == kGameSchemaVersion && kGameSchemaVersion == 11, "schema v11 (user_version == 11)");
    CHECK(fx.db.Exec("SELECT 1 FROM gblacklist LIMIT 0;", fx.err), "gblacklist exists");
    CHECK(fx.db.Exec("SELECT 1 FROM gtutor LIMIT 0;", fx.err), "gtutor exists");
    CHECK(fx.db.Exec("SELECT 1 FROM gis30min LIMIT 0;", fx.err), "gis30min exists");
}

static void TestBlacklist()
{
    Fixture fx;
    const int64_t me = fx.MakeUnit(777, L"n4.me");
    const int64_t other = fx.MakeUnit(888, L"n4.other");
    CHECK(me > 0 && other > 0, "units created");
    {
        std::vector<BlacklistRecord> bl;
        CHECK(fx.store.GetBlacklist(me, bl, fx.err), "blacklist readable (empty)");
        CHECK(bl.empty(), "blacklist empty initially");
    }
    CHECK(fx.db.Exec("INSERT INTO gblacklist (MyUID, BlockUID) VALUES (" + std::to_string(me) + ", " + std::to_string(other) + ");", fx.err), "seed blacklist");
    {
        std::vector<BlacklistRecord> bl;
        CHECK(fx.store.GetBlacklist(me, bl, fx.err), "blacklist readable");
        CHECK(bl.size() == 1 && bl[0].blockUnitUID == other && bl[0].nickname == "n4.other", "blacklist joined nickname");
    }
    // 對方暱稱釋放（軟刪除）→ 仍列出、暱稱空字串（與原 INNER JOIN GUnitNickName 語意一致：列存在即出）
    CHECK(fx.db.Exec("UPDATE gunit_nickname SET NickName = NULL WHERE UnitUID = " + std::to_string(other) + ";", fx.err), "release nickname");
    {
        std::vector<BlacklistRecord> bl;
        CHECK(fx.store.GetBlacklist(me, bl, fx.err), "blacklist readable after release");
        CHECK(bl.size() == 1 && bl[0].nickname.empty(), "NULL nickname -> empty string");
    }
}

static void TestTutor()
{
    Fixture fx;
    // 我的老師（我是學生）：me(level 1, Exp=0) ← teacher(level 20+)
    const int64_t me = fx.MakeUnit(777, L"n4.student");
    const int64_t teacher = fx.MakeUnit(888, L"n4.teacher");
    const int64_t myStudent = fx.MakeUnit(999, L"n4.pupil");
    CHECK(me > 0 && teacher > 0 && myStudent > 0, "units created");
    // 把 teacher 提升到高 EXP（>= level 20 門檻相關值）——以 10^9 EXP 換算（CheckLevelUp 上限 250）
    CHECK(fx.db.Exec("UPDATE gunit SET Exp = 1000000000 WHERE UnitUID = " + std::to_string(teacher) + ";", fx.err), "promote teacher EXP");
    // 我是 teacher 時，myStudent 的老師是我：INSERT (TeacherUID=teacher, StudentUID=myStudent)；但等級用 me<10 → 學生路徑
    CHECK(fx.db.Exec("INSERT INTO gtutor (TeacherUID, StudentUID) VALUES (" + std::to_string(teacher) + ", " + std::to_string(me) + ");", fx.err), "seed tutor link");
    {
        // me Exp=0 → level 1 ≤ 10 → 學生路徑：讀我的老師
        std::vector<TutorRecord> t;
        CHECK(fx.store.GetTutorInfo(/*isTeacher=*/false, me, t, fx.err), "tutor(student) readable");
        CHECK(t.size() == 1 && t[0].unitUID == teacher && t[0].nickname == "n4.teacher", "student path: my teacher");
    }
    {
        // teacher（level 250）≥ 20 → 老師路徑：讀我的學生 me
        std::vector<TutorRecord> t;
        CHECK(fx.store.GetTutorInfo(/*isTeacher=*/true, teacher, t, fx.err), "tutor(teacher) readable");
        CHECK(t.size() == 1 && t[0].unitUID == me && t[0].nickname == "n4.student", "teacher path: my student");
    }
    // Deleted 語意：RegDate = DelDate（預設同秒）→ Deleted=0（生成欄位）——link 可讀
    // 模擬軟刪除（DelDate 改成未來）→ Deleted=1 → 讀不到
    CHECK(fx.db.Exec("UPDATE gtutor SET DelDate = '2999-01-01 00:00:00' WHERE TeacherUID = " + std::to_string(teacher) + " AND StudentUID = " + std::to_string(me) + ";", fx.err), "soft-delete tutor link");
    {
        std::vector<TutorRecord> t;
        CHECK(fx.store.GetTutorInfo(/*isTeacher=*/false, me, t, fx.err), "tutor after soft-delete readable");
        CHECK(t.empty(), "Deleted=1 link excluded");
    }
}

static void TestConnectTimeEvents()
{
    Fixture fx;
    const int64_t me = fx.MakeUnit(777, L"n4.events");
    CHECK(me > 0, "unit created");
    {
        std::vector<ConnectTimeEventRecord> ev;
        CHECK(fx.store.GetConnectTimeEvents(me, ev, fx.err), "events readable (empty)");
        CHECK(ev.empty(), "events empty initially");
    }
    CHECK(fx.db.Exec(
        "INSERT INTO gis30min (UnitUID, EventType, RegDate) VALUES "
        "(" + std::to_string(me) + ", 2, '2000-01-01 00:30:00'),"
        "(" + std::to_string(me) + ", 1, '2000-01-01 00:00:00');", fx.err), "seed events");
    {
        std::vector<ConnectTimeEventRecord> ev;
        CHECK(fx.store.GetConnectTimeEvents(me, ev, fx.err), "events readable");
        CHECK(ev.size() == 2 && ev[0].eventUID == 1 && ev[1].eventUID == 2, "ordered by EventType");
        CHECK(ev[0].eventTime == "2000-01-01 00:00:00", "RegDate mapped verbatim");
    }
}

static void TestSelectIntegration()
{
    Fixture fx;
    const int64_t me = fx.MakeUnit(777, L"n4.select");
    const int64_t villain = fx.MakeUnit(888, L"n4.villain");
    CHECK(me > 0 && villain > 0, "units created");
    CHECK(fx.db.Exec("INSERT INTO gblacklist (MyUID, BlockUID) VALUES (" + std::to_string(me) + ", " + std::to_string(villain) + ");", fx.err), "seed blacklist");
    CHECK(fx.db.Exec("INSERT INTO gis30min (UnitUID, EventType, RegDate) VALUES (" + std::to_string(me) + ", 7, '2000-05-06 07:08:09');", fx.err), "seed event");
    {
        SelectUnitNot4 not4{};
        CHECK(SelectNot4(fx.store, 777, me, &not4), "select ok");
        CHECK(not4.vecChatBlackList.size() == 1 && not4.vecChatBlackList[0].iUnitUID == villain &&
              not4.vecChatBlackList[0].wstrNickName == std::wstring(L"n4.villain"), "Not4 blacklist wired");
        CHECK(not4.vecConnectTimeEvent.size() == 1 && not4.vecConnectTimeEvent[0].iEventUID == 7 &&
              not4.vecConnectTimeEvent[0].wstrEventTime == std::wstring(L"2000-05-06 07:08:09") &&
              not4.vecConnectTimeEvent[0].bAccountEvent == false, "Not4 connect-time event wired");
        // 11~19 級：無稱號對象查詢 → vecTutorialDBUnitInfo 空；me Exp=0 → level 1 ≤ 10 → 學生路徑（無老師連結 → 空）
        CHECK(not4.vecTutorialDBUnitInfo.empty(), "Not4 tutor list empty (no links)");
        CHECK(not4.vecCumulativeTimeEvent.empty(), "cumulative events stay placeholder (procs/tables absent)");
    }
    // 缺表 → ERR_SELECT_UNIT_05
    {
        std::string err2;
        CHECK(fx.db.Exec("ALTER TABLE gblacklist RENAME TO gblacklist_bak;", err2), "rename blacklist");
        SelectUnitReq req; req.unitUID = me;
        SelectUnitAck ack2;
        SelectUnitNot4 not4{};
        std::string err3;
        int rc = HandleSelectUnitReq(fx.store, 777, req, ack2, err3, true,
                                     nullptr, nullptr, 5, nullptr, nullptr, &not4, nullptr);
        CHECK(rc == ERR_SELECT_UNIT_05, "missing blacklist table -> ERR_SELECT_UNIT_05");
        CHECK(fx.db.Exec("ALTER TABLE gblacklist_bak RENAME TO gblacklist;", err2), "restore blacklist");
    }
    // 歸屬錯誤 → 不建 Not4
    {
        SelectUnitReq req; req.unitUID = me;
        SelectUnitAck ack2;
        SelectUnitNot4 not4{};
        std::string err2;
        int rc = HandleSelectUnitReq(fx.store, /*userUID=*/888, req, ack2, err2, true,
                                     nullptr, nullptr, 5, nullptr, nullptr, &not4, nullptr);
        CHECK(rc == ERR_SELECT_UNIT_07, "foreign select rejected");
    }
}

void RunSelectNot4ReadbackTestsByRef(int& pass, int& fail)
{
    TestSchemaV7();
    TestBlacklist();
    TestTutor();
    TestConnectTimeEvents();
    TestSelectIntegration();
    pass += g_pass_n4;
    fail += g_fail_n4;
}
