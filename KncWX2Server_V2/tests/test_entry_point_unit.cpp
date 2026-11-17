// tests/test_entry_point_unit.cpp — EGS_CREATE_NEW_UNIT_REQ（1159）/ EGS_ENTRY_POINT_DELETE_UNIT_REQ（1160）測試
// 兩者皆為 EGS_ENTRY_POINT 變體，忽略 iServerGroup 後共用 Create/Delete 決策（V2 單一 game DB）。
// 涵蓋：wire codec roundtrip、共享決策行為（建立/刪除經 EntryPoint 入口）、覆蓋既有測試未涵蓋的分支。
#include <cstdio>
#include <cstring>
#include <string>
#include <functional>

#include "../src/core/Serializer.h"
#include "../src/core/NetError.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/CreateUnitProtocol.h"
#include "../src/server/DeleteUnitProtocol.h"
#include "../src/server/UnitSelectArbiter.h"

using namespace x2;
using namespace x2::db;
using namespace x2::create_unit;
using namespace x2::delete_unit;
using namespace x2::select_unit;

void RunEntryPointUnitTestsByRef(int& pass, int& fail);
static int g_pass_epu = 0, g_fail_epu = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_epu++; } \
    else { g_fail_epu++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
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

static void TestEntryPointCodec()
{
    CreateNewUnitReq cn;
    cn.wstrNickName = L"入口建立";
    cn.iClass = 7;
    cn.iServerGroup = 2;
    SerBuffer cnBuf = PutPayload([&cn](Serializer& s) { return PutCreateNewUnitReq(s, cn); });
    {
        Serializer ks;
        SerBuffer tmp = cnBuf;
        CreateNewUnitReq rOut;
        CHECK(ks.BeginReading(&tmp) && GetCreateNewUnitReq(ks, rOut), "createNewUnitReq decodes");
        ks.EndReading();
        CHECK(rOut.wstrNickName == L"入口建立" && rOut.iClass == 7 && rOut.iServerGroup == 2, "createNewUnitReq rt");
    }
    EntryPointDeleteUnitReq ed;
    ed.iUnitUID = 0x1122334455667788LL;
    ed.iUserUID = 777;
    ed.iServerGroup = 2;
    SerBuffer edBuf = PutPayload([&ed](Serializer& s) { return PutEntryPointDeleteUnitReq(s, ed); });
    {
        Serializer ks;
        SerBuffer tmp = edBuf;
        EntryPointDeleteUnitReq rOut;
        CHECK(ks.BeginReading(&tmp) && GetEntryPointDeleteUnitReq(ks, rOut), "entryPointDeleteUnitReq decodes");
        ks.EndReading();
        CHECK(rOut.iUnitUID == 0x1122334455667788LL && rOut.iUserUID == 777 && rOut.iServerGroup == 2, "entryPointDeleteUnitReq rt");
    }
}

static void TestEntryPointDecision()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open in-memory game db");
    CHECK(ApplyGameMigrations(db, err), "apply game migrations");
    GameStore store(db);
    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(777, "eptester", gu, err), "seed guser 777");

    // ENTRY_POINT 建立 → 回 EGS_CREATE_UNIT_ACK 結構
    int64_t unitUID = 0;
    {
        CreateNewUnitReq req;
        req.wstrNickName = L"入口角色"; req.iClass = 3; req.iServerGroup = 1;
        CreateUnitAck ack;
        CHECK(HandleCreateNewUnitReq(store, 777, 5, req, ack, err), "entry create handled");
        CHECK(ack.iOK == NET_OK, "entry create -> NET_OK");
        CHECK(ack.kUnitInfo.unitUID != 0, "entry create filled unitInfo");
        unitUID = ack.kUnitInfo.unitUID;
    }
    // 同名再建（ENTRY_POINT 入口）→ ERR_CREATE_UNIT_01
    {
        CreateNewUnitReq req;
        req.wstrNickName = L"入口角色"; req.iClass = 1; req.iServerGroup = 1;
        CreateUnitAck ack;
        CHECK(HandleCreateNewUnitReq(store, 777, 5, req, ack, err), "entry dup handled");
        CHECK(ack.iOK == ERR_CREATE_UNIT_01, "entry dup -> 01");
    }
    // 13+ bytes → ERR_CREATE_UNIT_04
    {
        CreateNewUnitReq req;
        req.wstrNickName = L"一二三四五";   // 15 bytes
        req.iClass = 1;                    // 初始職業（class 閘門先於 length 檢查，對齊原碼次序）
        CreateUnitAck ack;
        CHECK(HandleCreateNewUnitReq(store, 777, 5, req, ack, err), "entry long handled");
        CHECK(ack.iOK == ERR_CREATE_UNIT_04, "entry long -> 04");
    }
    // ENTRY_POINT 非本人刪除 → ERR_DELETE_UNIT_00；角色仍在
    {
        EntryPointDeleteUnitReq req;
        req.iUnitUID = unitUID; req.iUserUID = 999; req.iServerGroup = 2;
        DeleteUnitAck ack;
        CHECK(HandleEntryPointDeleteUnitReq(store, 999, 5, req, ack, err), "entry-point foreign delete handled");
        CHECK(ack.iOK == ERR_DELETE_UNIT_00, "entry-point foreign -> 00");
        std::vector<GUnitRecord> units;
        CHECK(store.ListUnitsByUserUID(777, units, err), "list after foreign attempt");
        bool saw = false;
        for (const auto& u : units) if (u.unitUID == unitUID) saw = true;
        CHECK(saw, "foreign attempt left unit intact");
    }
    // ENTRY_POINT 本人刪除 → NET_OK
    {
        EntryPointDeleteUnitReq req;
        req.iUnitUID = unitUID; req.iUserUID = 777; req.iServerGroup = 2;
        DeleteUnitAck ack;
        CHECK(HandleEntryPointDeleteUnitReq(store, 777, 5, req, ack, err), "entry-point owner delete handled");
        CHECK(ack.iOK == NET_OK, "entry-point owner -> NET_OK");
        CHECK(ack.iUnitUID == unitUID && ack.wstrNickName == L"入口角色" && ack.ucLevel == 1 && ack.cUnitClass == 3, "charlog fields from pre-delete record");
    }
}

void RunEntryPointUnitTestsByRef(int& pass, int& fail)
{
    TestEntryPointCodec();
    TestEntryPointDecision();
    pass += g_pass_epu;
    fail += g_fail_epu;
}
