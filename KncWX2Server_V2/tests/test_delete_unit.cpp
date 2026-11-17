// tests/test_delete_unit.cpp — EGS_DELETE_UNIT_REQ/ACK 切片測試
// 涵蓋：wire codec roundtrip（含 SERV_CHAR_LOG 欄位）、HandleDeleteUnitReq（成功 / 幽靈角色 / 非本人 / 重複刪除 / DB 副作用）。
// ⚠ wire 佈局自洽，未對原 SDK 實機驗證；m_uiKNMSerialNum / m_iGuildUID 恆為 0 佔位（見 DeleteUnitProtocol.h）。
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>
#include <functional>

#include "../src/core/Serializer.h"
#include "../src/core/NetError.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/DeleteUnitProtocol.h"
#include "../src/server/UnitSelectArbiter.h"

using namespace x2;
using namespace x2::db;
using namespace x2::delete_unit;
using namespace x2::select_unit;

void RunDeleteUnitTestsByRef(int& pass, int& fail);
static int g_pass_delu = 0, g_fail_delu = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_delu++; } \
    else { g_fail_delu++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
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

static void TestDeleteUnitCodec()
{
    DeleteUnitReq req;
    req.iUnitUID = 0x1122334455667788LL;
    req.iUserUID = 777;
    SerBuffer reqBuf = PutPayload([&req](Serializer& s) { return PutDeleteUnitReq(s, req); });
    CHECK(reqBuf.GetLength() > 0, "deleteUnitReq encodes");
    {
        Serializer ks;
        SerBuffer tmp = reqBuf;
        DeleteUnitReq rOut;
        CHECK(ks.BeginReading(&tmp) && GetDeleteUnitReq(ks, rOut), "deleteUnitReq decodes");
        ks.EndReading();
        CHECK(rOut.iUnitUID == 0x1122334455667788LL && rOut.iUserUID == 777, "deleteUnitReq rt");
    }

    DeleteUnitAck ack;
    ack.iOK = NET_OK;
    ack.iUnitUID = 0x1122334455667788LL;
    ack.uiKNMSerialNum = 0xDEADBEEFu;
    ack.iGuildUID = 12345;
    ack.wstrNickName = L"新生劍士";
    ack.ucLevel = 42;
    ack.cUnitClass = 7;
    SerBuffer buf = PutPayload([&ack](Serializer& s) { return PutDeleteUnitAck(s, ack); });
    CHECK(buf.GetLength() > 0, "deleteUnitAck encodes");
    {
        Serializer ks;
        SerBuffer tmp = buf;
        DeleteUnitAck aOut;
        CHECK(ks.BeginReading(&tmp) && GetDeleteUnitAck(ks, aOut), "deleteUnitAck decodes");
        ks.EndReading();
        CHECK(aOut.iOK == NET_OK && aOut.iUnitUID == 0x1122334455667788LL, "deleteUnitAck iOK/uid rt");
        CHECK(aOut.uiKNMSerialNum == 0xDEADBEEFu && aOut.iGuildUID == 12345, "deleteUnitAck knm/guild rt");
        CHECK(aOut.wstrNickName == L"新生劍士" && aOut.ucLevel == 42 && aOut.cUnitClass == 7, "deleteUnitAck charlog rt");
    }
}

static void TestHandleDeleteUnitReq()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open in-memory game db");
    CHECK(ApplyGameMigrations(db, err), "apply game migrations");
    GameStore store(db);

    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(777, "deletetester", gu, err), "seed guser 777");

    int64_t unitUID = 0;
    {
        std::string e;
        auto r = store.CreateUnit(777, "刪我吧角色", /*unitClass=*/4, unitUID, e);
        CHECK(r == CreateUnitResult::Ok, "seed unit created");
    }

    // 成功刪除 → NET_OK、KNM/Guild=0、SERV_CHAR_LOG 欄位=刪除前值
    {
        DeleteUnitReq req; req.iUnitUID = unitUID; req.iUserUID = 777;
        DeleteUnitAck ack;
        CHECK(HandleDeleteUnitReq(store, 777, /*authLevel=*/5, req, ack, err), "delete handled");
        CHECK(ack.iOK == NET_OK, "delete success -> NET_OK");
        CHECK(ack.uiKNMSerialNum == 0 && ack.iGuildUID == 0, "knm/guild zero placeholders");
        CHECK(ack.wstrNickName == L"刪我吧角色" && ack.ucLevel == 1 && ack.cUnitClass == 4, "charlog from pre-delete record");
    }
    // 刪除後不可見（ListUnitsByUserUID 不再包含）
    {
        std::vector<GUnitRecord> units;
        CHECK(store.ListUnitsByUserUID(777, units, err), "list after delete");
        bool saw = false;
        for (const auto& u : units) if (u.unitUID == unitUID) saw = true;
        CHECK(!saw, "deleted unit hidden from list");
    }
    // 重複刪除 → ERR_DELETE_UNIT_00（已刪除）
    {
        DeleteUnitReq req; req.iUnitUID = unitUID; req.iUserUID = 777;
        DeleteUnitAck ack;
        CHECK(HandleDeleteUnitReq(store, 777, 5, req, ack, err), "re-delete handled");
        CHECK(ack.iOK == ERR_DELETE_UNIT_00, "re-delete -> ERR_DELETE_UNIT_00");
    }
    // 幽靈角色（不存在）→ ERR_DELETE_UNIT_00
    {
        DeleteUnitReq req; req.iUnitUID = 0x0DEADBEEFLL, req.iUserUID = 777;
        DeleteUnitAck ack;
        CHECK(HandleDeleteUnitReq(store, 777, 5, req, ack, err), "ghost handled");
        CHECK(ack.iOK == ERR_DELETE_UNIT_00, "ghost uid -> ERR_DELETE_UNIT_00");
    }
    // 本人合法刪除自己的角色（擁有者 888）→ NET_OK
    {
        GUserRecord gu2;
        CHECK(store.GetOrCreateGUser(888, "otherowner", gu2, err), "seed guser 888");
        int64_t mineUID = 0;
        { std::string e; auto r = store.CreateUnit(888, "888自己的", 2, mineUID, e); CHECK(r == CreateUnitResult::Ok, "seed 888's unit"); }
        DeleteUnitReq req; req.iUnitUID = mineUID; req.iUserUID = 888;
        DeleteUnitAck ack;
        CHECK(HandleDeleteUnitReq(store, 888, 0, req, ack, err), "owner delete handled");
        CHECK(ack.iOK == NET_OK, "owner can delete own unit");
    }
    // 非本人刪除（userUID 不符）→ ERR_DELETE_UNIT_00
    {
        int64_t victimUID = 0;
        { std::string e; auto r = store.CreateUnit(777, "受害角色", 6, victimUID, e); CHECK(r == CreateUnitResult::Ok, "seed victim unit"); }
        DeleteUnitReq req; req.iUnitUID = victimUID; req.iUserUID = 999;
        DeleteUnitAck ack;
        CHECK(HandleDeleteUnitReq(store, /*userUID=*/999, 5, req, ack, err), "foreign delete handled");
        CHECK(ack.iOK == ERR_DELETE_UNIT_00, "foreign unit -> ERR_DELETE_UNIT_00");
        // 受害角色仍存在
        std::vector<GUnitRecord> units;
        CHECK(store.ListUnitsByUserUID(777, units, err), "list after foreign attempt");
        bool saw = false;
        for (const auto& u : units) if (u.unitUID == victimUID) saw = true;
        CHECK(saw, "foreign attempt left victim unit intact");
    }
}

void RunDeleteUnitTestsByRef(int& pass, int& fail)
{
    TestDeleteUnitCodec();
    TestHandleDeleteUnitReq();
    pass += g_pass_delu;
    fail += g_fail_delu;
}
