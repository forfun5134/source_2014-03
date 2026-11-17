// tests/test_create_today_count.cpp — EGS_GET_CREATE_UNIT_TODAY_COUNT_REQ/ACK 切片測試
// 涵蓋：空酬載 REQ codec、ACK codec（含 map ctors）、決策層（建立 2 個角色→今日計數=2；其他使用者不受影響；刪除後計數下降）。
// ⚠ wire 自洽，未對原 SDK 實機驗證；map key=serverGroupID 恆 0；1ST_ACK 折疊為單段（見 CreateTodayCountProtocol.h）。
#include <cstdio>
#include <cstring>
#include <string>
#include <map>
#include <functional>

#include "../src/core/Serializer.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/CreateTodayCountProtocol.h"
#include "../src/server/UnitSelectArbiter.h"

using namespace x2;
using namespace x2::db;
using namespace x2::today_count;
using namespace x2::select_unit;

void RunCreateTodayCountTestsByRef(int& pass, int& fail);
static int g_pass_ctc = 0, g_fail_ctc = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_ctc++; } \
    else { g_fail_ctc++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static SerBuffer PutPayload(const std::function<bool(Serializer&)>& fn)
{
    Serializer ks;
    SerBuffer buf;
    if (!ks.BeginWriting(&buf)) return SerBuffer{};
    if (!fn(ks)) return SerBuffer{};
    ks.EndWriting();
    return buf;
}

static void TestTodayCountCodec()
{
    GetCreateUnitTodayCountReq req;
    SerBuffer reqBuf = PutPayload([&req](Serializer& s) { return PutGetCreateUnitTodayCountReq(s, req); });
    CHECK(reqBuf.GetLength() == 0, "todayCountReq empty payload");
    {
        Serializer ks;
        SerBuffer tmp = reqBuf;
        GetCreateUnitTodayCountReq rOut;
        CHECK(ks.BeginReading(&tmp) && GetGetCreateUnitTodayCountReq(ks, rOut), "todayCountReq decodes (no-op)");
        ks.EndReading();
        CHECK(rOut == req, "todayCountReq no-op rt");
    }

    GetCreateUnitTodayCountAck ack;
    ack.iUserUID = 777;
    ack.mapCreateCharCountToday = { { 0, 2 }, { 8, 1 } };
    SerBuffer buf = PutPayload([&ack](Serializer& s) { return PutGetCreateUnitTodayCountAck(s, ack); });
    CHECK(buf.GetLength() > 0, "todayCountAck encodes");
    {
        Serializer ks;
        SerBuffer tmp = buf;
        GetCreateUnitTodayCountAck aOut;
        CHECK(ks.BeginReading(&tmp) && GetGetCreateUnitTodayCountAck(ks, aOut), "todayCountAck decodes");
        ks.EndReading();
        CHECK(aOut.iUserUID == 777, "todayCountAck userUID rt");
        CHECK(aOut.mapCreateCharCountToday == (std::map<int32_t, int32_t>{ { 0, 2 }, { 8, 1 } }), "todayCountAck map rt");
    }
}

static void TestHandleTodayCount()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open in-memory game db");
    CHECK(ApplyGameMigrations(db, err), "apply game migrations");
    GameStore store(db);

    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(777, "counttester", gu, err), "seed guser 777");

    // 尚未建立角色 → 今日計數 0
    {
        GetCreateUnitTodayCountAck ack;
        CHECK(HandleGetCreateUnitTodayCountReq(store, 777, ack, err), "todayCount handled (0)");
        CHECK(ack.iUserUID == 777, "ack userUID");
        CHECK(ack.mapCreateCharCountToday.size() == 1 && ack.mapCreateCharCountToday[0] == 0, "empty day count = 0 @ serverGroup 0");
    }
    // 建立 2 個角色 → 2
    int64_t u1 = 0, u2 = 0;
    {
        std::string e; auto r1 = store.CreateUnit(777, "今日一號", 1, u1, e);
        std::string e2; auto r2 = store.CreateUnit(777, "今日二號", 2, u2, e2);
        CHECK(r1 == CreateUnitResult::Ok && r2 == CreateUnitResult::Ok, "create 2 units");
    }
    {
        GetCreateUnitTodayCountAck ack;
        CHECK(HandleGetCreateUnitTodayCountReq(store, 777, ack, err), "todayCount handled (2)");
        CHECK(ack.mapCreateCharCountToday[0] == 2, "today count = 2");
    }
    // 其他使用者不受影響
    {
        GUserRecord gu2;
        CHECK(store.GetOrCreateGUser(888, "othercounter", gu2, err), "seed guser 888");
        GetCreateUnitTodayCountAck ack;
        CHECK(HandleGetCreateUnitTodayCountReq(store, 888, ack, err), "todayCount other handled");
        CHECK(ack.mapCreateCharCountToday[0] == 0, "other user count = 0");
    }
    // 刪除其中一個 → 1
    {
        CHECK(store.SoftDeleteUnit(u1, err), "soft delete u1");
        GetCreateUnitTodayCountAck ack;
        CHECK(HandleGetCreateUnitTodayCountReq(store, 777, ack, err), "todayCount handled (1)");
        CHECK(ack.mapCreateCharCountToday[0] == 1, "today count drops to 1 after delete");
    }
}

void RunCreateTodayCountTestsByRef(int& pass, int& fail)
{
    TestTodayCountCodec();
    TestHandleTodayCount();
    pass += g_pass_ctc;
    fail += g_fail_ctc;
}
