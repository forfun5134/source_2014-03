// tests/test_unit_templet.cpp — UnitTemplet（UnitTempletExists templet 模型＋IsInitNormalJob 謂詞）測試
// 涵蓋：謂詞全域邊界、enum 模型集合（1..32、100..122 存在；0/33..99/123+/200/255 不存在）、
//       HandleCreateUnitReq 閘門接線（原碼順序：templet→03、class→1289）、ENTRY_POINT_CREATE_NEW_UNIT 共用閘門。
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

static void TestUnitTempletExists()
{
    // enum 模型（JP INT_INTERNAL）：已宣告可玩職業存在
    for (int c : {1, 2, 7, 8, 9, 10, 22, 23, 27, 28, 29, 30, 31, 32, 100, 111, 112, 117, 118, 119, 120, 121, 122}) {
        CHECK(UnitTempletExists(c), "declared class exists");
    }
    // 哨兵／未宣告 → 不存在
    for (int c : {0, -1, 33, 50, 99, 123, 124, 150, 200, 255}) {
        CHECK(!UnitTempletExists(c), "undeclared class does not exist");
    }
}

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
    // ok：建立成功；init1279：templet 存在但非初始普通職業 → 1289；notemplet：無 templet → 28
    const struct { int cls; int expect; } cases[] = {
        { 1, NET_OK }, { 5, NET_OK }, { 7, NET_OK }, { 8, NET_OK }, { 9, NET_OK },
        { 10, ERR_CREATE_UNIT_11 }, { 22, ERR_CREATE_UNIT_11 }, { 31, ERR_CREATE_UNIT_11 }, { 32, ERR_CREATE_UNIT_11 },
        { 100, ERR_CREATE_UNIT_11 }, { 112, ERR_CREATE_UNIT_11 }, { 121, ERR_CREATE_UNIT_11 }, { 122, ERR_CREATE_UNIT_11 },
        { 0, ERR_CREATE_UNIT_03 }, { -1, ERR_CREATE_UNIT_03 }, { 33, ERR_CREATE_UNIT_03 },
        { 50, ERR_CREATE_UNIT_03 }, { 99, ERR_CREATE_UNIT_03 }, { 123, ERR_CREATE_UNIT_03 },
        { 200, ERR_CREATE_UNIT_03 }, { 255, ERR_CREATE_UNIT_03 },
    };
    int idx = 0;
    for (const auto& tc : cases) {
        ++idx;
        create_unit::CreateUnitReq req; req.wstrNickName = L"職業" + std::to_wstring(idx); req.iClass = tc.cls;   // 唯一暱稱（DB 冷卻/唯一性）
        create_unit::CreateUnitAck ack;
        CHECK(HandleCreateUnitReq(store, 4242, /*authLevel=*/5, req, ack, err), "handled");
        CHECK(ack.iOK == tc.expect, "class gate result as expected");
        (void)idx;
    }
    // ENTRY_POINT_CREATE_NEW_UNIT 共用同一道閘門
    {
        create_unit::CreateNewUnitReq req; req.wstrNickName = L"職業二"; req.iClass = 100; req.iServerGroup = 1;
        create_unit::CreateUnitAck ack;
        CHECK(HandleCreateNewUnitReq(store, 4242, /*authLevel=*/5, req, ack, err), "entry-point handled");
        CHECK(ack.iOK == ERR_CREATE_UNIT_11, "entry-point declared non-init class -> ERR_CREATE_UNIT_11");
    }
}

void RunUnitTempletTestsByRef(int& pass, int& fail)
{
    TestUnitTempletExists();
    TestIsInitNormalJob();
    TestCreateUnitClassGate();
    pass += g_pass_ut;
    fail += g_fail_ut;
}
