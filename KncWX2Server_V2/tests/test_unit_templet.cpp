// tests/test_unit_templet.cpp — UnitTemplet（IsInitNormalJob 謂詞）測試
// 涵蓋：謂詞全域邊界（0..9..100..255..負數）、HandleCreateUnitReq 閘門接線（class 不在 1..9 → ERR_CREATE_UNIT_11=1289）、
//       ENTRY_POINT_CREATE_NEW_UNIT 共用閘門、合法 class 9 可建立。
#include <cstdio>
#include <string>

#include "../src/core/NetError.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/UnitTemplet.h"
#include "../src/server/UnitSelectArbiter.h"
#include "../src/server/CreateUnitProtocol.h"

using namespace x2;
using namespace x2::db;
using namespace x2::unit_templet;
using namespace x2::select_unit;

void RunUnitTempletTestsByRef(int& pass, int& fail);
static int g_pass_ut = 0, g_fail_ut = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_ut++; } \
    else { g_fail_ut++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static void TestIsInitNormalJob()
{
    for (int c = 1; c <= 9; ++c) CHECK(IsInitNormalJob(c), "init job accepted");
    CHECK(!IsInitNormalJob(0), "0 rejected");
    CHECK(!IsInitNormalJob(-1), "negative rejected");
    CHECK(!IsInitNormalJob(10), "1st-job class 10 rejected");
    CHECK(!IsInitNormalJob(31), "1st-job class 31 rejected");
    CHECK(!IsInitNormalJob(100), "2nd-job class 100 rejected");
    CHECK(!IsInitNormalJob(121), "class 121 rejected");
    CHECK(!IsInitNormalJob(122), "class 122 rejected");
    CHECK(!IsInitNormalJob(200), "nonexistent class 200 rejected");
    CHECK(!IsInitNormalJob(255), "255 rejected");
}

static void TestCreateUnitClassGate()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open in-memory game db");
    CHECK(ApplyGameMigrations(db, err), "apply migrations");
    GameStore store(db);
    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(4242, "unittemplet", gu, err), "seed guser");
    const struct { int cls; bool ok; } cases[] = {
        { 1, true }, { 5, true }, { 7, true }, { 8, true }, { 9, true },
        { 0, false }, { 10, false }, { 100, false }, { 121, false }, { 200, false }, { 255, false }, { -1, false },
    };
    int idx = 0;
    for (const auto& tc : cases) {
        ++idx;
        create_unit::CreateUnitReq req; req.wstrNickName = L"職業" + std::to_wstring(idx); req.iClass = tc.cls;   // 唯一暱稱（DB 冷卻/唯一性）
        create_unit::CreateUnitAck ack;
        CHECK(HandleCreateUnitReq(store, 4242, /*authLevel=*/5, req, ack, err), "handled");
        if (tc.ok) {
            CHECK(ack.iOK == NET_OK, "init class accepted");
        } else {
            CHECK(ack.iOK == ERR_CREATE_UNIT_11, "non-init class -> ERR_CREATE_UNIT_11");
        }
        (void)idx;
    }
    // ENTRY_POINT_CREATE_NEW_UNIT 共用同一道閘門
    {
        create_unit::CreateNewUnitReq req; req.wstrNickName = L"職業二"; req.iClass = 100; req.iServerGroup = 1;
        create_unit::CreateUnitAck ack;
        CHECK(HandleCreateNewUnitReq(store, 4242, /*authLevel=*/5, req, ack, err), "entry-point handled");
        CHECK(ack.iOK == ERR_CREATE_UNIT_11, "entry-point non-init class -> ERR_CREATE_UNIT_11");
    }
}

void RunUnitTempletTestsByRef(int& pass, int& fail)
{
    TestIsInitNormalJob();
    TestCreateUnitClassGate();
    pass += g_pass_ut;
    fail += g_fail_ut;
}
