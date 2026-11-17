// tests/test_create_unit.cpp — EGS_CREATE_UNIT_REQ/ACK 切片測試
// 涵蓋：wire codec roundtrip、HandleCreateUnitReq（暱稱驗證、重複、成功、DB 副作用：ListUnitsByUserUID 可見）。
// ⚠ wire 佈局自洽，未對原 SDK 實機驗證；vecSkillSlot/wstrEnableDate 為佔位（見 CreateUnitProtocol.h）。
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>
#include <functional>

#include "../src/core/Serializer.h"
#include "../src/core/NetError.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/CreateUnitProtocol.h"
#include "../src/server/UnitSelectArbiter.h"

using namespace x2;
using namespace x2::db;
using namespace x2::create_unit;
using namespace x2::select_unit;

void RunCreateUnitTestsByRef(int& pass, int& fail);
static int g_pass_cu = 0, g_fail_cu = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_cu++; } \
    else { g_fail_cu++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
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

static void TestCreateUnitCodec()
{
    CreateUnitReq req;
    req.wstrNickName = L"新生劍士";
    req.iClass = 5;
    SerBuffer reqBuf = PutPayload([&req](Serializer& s) { return PutCreateUnitReq(s, req); });
    CHECK(reqBuf.GetLength() > 0, "createUnitReq encodes");
    {
        Serializer ks;
        SerBuffer tmp = reqBuf;
        CreateUnitReq rOut;
        CHECK(ks.BeginReading(&tmp) && GetCreateUnitReq(ks, rOut), "createUnitReq decodes");
        ks.EndReading();
        CHECK(rOut.wstrNickName == L"新生劍士" && rOut.iClass == 5, "createUnitReq rt");
    }

    CreateUnitAck ack;
    ack.iOK = NET_OK;
    ack.kUnitInfo.unitUID = 0x1122334455667788LL;
    ack.kUnitInfo.unitClass = 5;
    ack.kUnitInfo.nickName = L"新生劍士";
    ack.kUnitInfo.ownerUserUID = 777;
    ack.kUnitInfo.level = 1;
    ack.kUnitInfo.stat = { 100, 10, 20, 30, 40 };
    ack.kUnitInfo.gameStat = ack.kUnitInfo.stat;
    ack.vecSkillSlot = { 9, 9, 9, 9 };
    ack.wstrEnableDate = L"2099-01-01 00:00:00";
    SerBuffer buf = PutPayload([&ack](Serializer& s) { return PutCreateUnitAck(s, ack); });
    CHECK(buf.GetLength() > 0, "createUnitAck encodes");
    {
        Serializer ks;
        SerBuffer tmp = buf;
        CreateUnitAck aOut;
        CHECK(ks.BeginReading(&tmp) && GetCreateUnitAck(ks, aOut), "createUnitAck decodes");
        ks.EndReading();
        CHECK(aOut.iOK == NET_OK, "createUnitAck iOK rt");
        CHECK(aOut.kUnitInfo.unitUID == 0x1122334455667788LL && aOut.kUnitInfo.nickName == L"新生劍士" &&
              aOut.kUnitInfo.unitClass == 5 && aOut.kUnitInfo.level == 1, "createUnitAck unitInfo rt");
        CHECK(aOut.vecSkillSlot == std::vector<int32_t>({ 9, 9, 9, 9 }), "createUnitAck skillSlot rt");
        CHECK(aOut.wstrEnableDate == L"2099-01-01 00:00:00", "createUnitAck enableDate rt");
    }
}

static void TestHandleCreateUnitReq()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open in-memory game db");
    CHECK(ApplyGameMigrations(db, err), "apply game migrations");
    GameStore store(db);

    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(777, "createtester", gu, err), "seed guser 777");

    // 空暱稱 → ERR_CREATE_UNIT_04
    {
        CreateUnitReq req; req.wstrNickName = L""; req.iClass = 1;
        CreateUnitAck ack;
        CHECK(HandleCreateUnitReq(store, 777, /*authLevel=*/5, req, ack, err), "empty nickname handled");
        CHECK(ack.iOK == ERR_CREATE_UNIT_04, "empty nickname -> ERR_CREATE_UNIT_04");
    }
    // 超過 12 bytes 暱稱 → ERR_CREATE_UNIT_04（UTF-8 位元組數：中文 3 bytes/字）
    {
        CreateUnitReq req; req.wstrNickName = L"一二三四五"; req.iClass = 1;   // 15 bytes > 12
        CreateUnitAck ack;
        CHECK(HandleCreateUnitReq(store, 777, 5, req, ack, err), "long nickname handled");
        CHECK(ack.iOK == ERR_CREATE_UNIT_04, "13+ byte nickname -> ERR_CREATE_UNIT_04");
    }
    // 恰好 12 bytes → 合法
    int64_t uidFirst = 0;
    {
        CreateUnitReq req; req.wstrNickName = L"一二三四"; req.iClass = 3;     // 12 bytes
        CreateUnitAck ack;
        CHECK(HandleCreateUnitReq(store, 777, 5, req, ack, err), "12-byte nickname handled");
        CHECK(ack.iOK == NET_OK, "12-byte nickname accepted");
        CHECK(ack.kUnitInfo.unitUID != 0 && ack.kUnitInfo.unitClass == 3 && ack.kUnitInfo.nickName == L"一二三四", "created unit info filled");
        CHECK(ack.vecSkillSlot.empty() && ack.wstrEnableDate.empty(), "skillSlot/enableDate empty placeholders");
        uidFirst = ack.kUnitInfo.unitUID;
    }
    // 重複暱稱 → ERR_CREATE_UNIT_01
    {
        CreateUnitReq req; req.wstrNickName = L"一二三四"; req.iClass = 1;
        CreateUnitAck ack;
        CHECK(HandleCreateUnitReq(store, 777, 5, req, ack, err), "dup nickname handled");
        CHECK(ack.iOK == ERR_CREATE_UNIT_01, "duplicate nickname -> ERR_CREATE_UNIT_01");
    }
    // 注入標記 → ERR_CREATE_UNIT_08
    {
        CreateUnitReq req; req.wstrNickName = L"ab;cd"; req.iClass = 1;
        CreateUnitAck ack;
        CHECK(HandleCreateUnitReq(store, 777, 5, req, ack, err), "injection nickname handled");
        CHECK(ack.iOK == ERR_CREATE_UNIT_08, "injection mark -> ERR_CREATE_UNIT_08");
    }
    // guser 不存在 → ERR_CREATE_UNIT_00
    {
        CreateUnitReq req; req.wstrNickName = L"孤兒角色"; req.iClass = 1;
        CreateUnitAck ack;
        CHECK(HandleCreateUnitReq(store, 888888, 0, req, ack, err), "ghost user handled");
        CHECK(ack.iOK == ERR_CREATE_UNIT_00, "missing guser -> ERR_CREATE_UNIT_00");
    }
    // DB 副作用：建立後 ListUnitsByUserUID 應看到該角色
    {
        std::vector<GUnitRecord> units;
        CHECK(store.ListUnitsByUserUID(777, units, err), "list units after create");
        bool saw = false;
        for (const auto& u : units) if (u.unitUID == uidFirst) saw = true;
        CHECK(saw, "created unit visible in ListUnitsByUserUID");
    }
}

void RunCreateUnitTestsByRef(int& pass, int& fail)
{
    TestCreateUnitCodec();
    TestHandleCreateUnitReq();
    pass += g_pass_cu;
    fail += g_fail_cu;
}
