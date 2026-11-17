// tests/test_unit_list.cpp — EGS_MY_UNIT_AND_INVENTORY_INFO_LIST_REQ/ACK 切片測試
// 涵蓋：wire codec roundtrip（REQ 空、ACK 含 vector<KUnitInfo>）、
//      HandleMyUnitAndInventoryInfoListReq（guser 自建/USSize、ListUnitsByUserUID、逐角色 PopulateUnitInfoFromGUnit）。
// ⚠ wire 佈局為自洽 golden bytes，未對原 SDK 實機驗證；
//   EXP→level / 職業 stat 表 / P2P IP:port 衍生欄位 V2 無對應表，沿用 gunit 儲存值（見 architecture §0k）。
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>
#include <functional>

#include "../src/core/Serializer.h"
#include "../src/core/NetError.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/UnitListProtocol.h"
#include "../src/server/UnitSelectArbiter.h"

using namespace x2;
using namespace x2::db;
using namespace x2::unit_list;
using namespace x2::select_unit;

void RunUnitListTestsByRef(int& pass, int& fail);
static int g_pass_ul = 0, g_fail_ul = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_ul++; } \
    else { g_fail_ul++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
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

static void TestUnitListCodec()
{
    // REQ：空 payload
    MyUnitAndInventoryInfoListReq req;
    SerBuffer reqBuf = PutPayload([&req](Serializer& s) { return PutMyUnitAndInventoryInfoListReq(s, req); });
    CHECK(reqBuf.GetLength() == 0, "myUnitListReq encodes to empty payload");
    {
        Serializer ks;
        SerBuffer tmp = reqBuf;
        MyUnitAndInventoryInfoListReq rOut;
        CHECK(ks.BeginReading(&tmp) && GetMyUnitAndInventoryInfoListReq(ks, rOut), "myUnitListReq decodes");
        ks.EndReading();
    }

    // ACK roundtrip：iOK + nUnitSlot + 2 個 KUnitInfo
    MyUnitAndInventoryInfoListAck ack;
    ack.iOK = NET_OK;
    ack.nUnitSlot = 50;
    {
        unit::UnitInfo u;
        u.ownerUserUID = 777;
        u.unitUID = 0x1111111111111111LL;
        u.unitClass = 2;
        u.nickName = L"角色甲";
        u.level = 10;
        u.exp = 5000;
        u.stat = { 300, 30, 40, 50, 60 };
        u.gameStat = u.stat;
        u.win = 3; u.lose = 1;
        ack.vecUnitInfo.push_back(u);
        u.unitUID = 0x2222222222222222LL;
        u.nickName = L"角色乙";
        u.level = 20;
        ack.vecUnitInfo.push_back(u);
    }
    SerBuffer buf = PutPayload([&ack](Serializer& s) { return PutMyUnitAndInventoryInfoListAck(s, ack); });
    CHECK(buf.GetLength() > 0, "myUnitListAck encodes");
    {
        Serializer ks;
        SerBuffer tmp = buf;
        MyUnitAndInventoryInfoListAck aOut;
        CHECK(ks.BeginReading(&tmp) && GetMyUnitAndInventoryInfoListAck(ks, aOut), "myUnitListAck decodes");
        ks.EndReading();
        CHECK(aOut.iOK == NET_OK && aOut.nUnitSlot == 50, "myUnitListAck iOK/nUnitSlot rt");
        CHECK(aOut.vecUnitInfo.size() == 2 && aOut.vecUnitInfo[0].nickName == L"角色甲" &&
              aOut.vecUnitInfo[0].unitUID == 0x1111111111111111LL && aOut.vecUnitInfo[0].level == 10, "myUnitListAck unit1 rt");
        CHECK(aOut.vecUnitInfo[1].nickName == L"角色乙" && aOut.vecUnitInfo[1].unitUID == 0x2222222222222222LL, "myUnitListAck unit2 rt");
    }
}

static void TestHandleMyUnitAndInventoryInfoListReq()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open in-memory game db");
    CHECK(ApplyGameMigrations(db, err), "apply game migrations");
    GameStore store(db);

    // CreateUnit 需要 guser 先存在（同 test_select_unit.cpp 的 SeedGameDb 模式）
    GUserRecord gu1, gu2, guOther;
    CHECK(store.GetOrCreateGUser(777, "listtester", gu1, err), "get-or-create guser 777");
    CHECK(store.GetOrCreateGUser(888, "othertester", guOther, err), "get-or-create guser 888");
    int64_t uid1 = 0, uid2 = 0;
    CHECK(store.CreateUnit(777, "清單甲", 1, uid1, err) == CreateUnitResult::Ok, "create unit 1");
    CHECK(store.CreateUnit(777, "清單乙", 5, uid2, err) == CreateUnitResult::Ok, "create unit 2");
    // 其他使用者的角色不應出現
    int64_t uidOther = 0;
    CHECK(store.CreateUnit(888, "別人的角色", 1, uidOther, err) == CreateUnitResult::Ok, "create other-user unit");

    MyUnitAndInventoryInfoListAck ack;
    CHECK(HandleMyUnitAndInventoryInfoListReq(store, 777, "listtester", /*authLevel=*/5, ack, err), "handle list req ok");
    CHECK(ack.iOK == NET_OK, "list ack iOK");
    CHECK(ack.nUnitSlot == 50, "list ack nUnitSlot = guser USSize(50)");
    CHECK(ack.vecUnitInfo.size() == 2, "list ack carries only this user's 2 units");
    bool saw1 = false, saw2 = false, sawOther = false;
    for (const auto& u : ack.vecUnitInfo) {
        if (u.unitUID == uid1) { saw1 = true; CHECK(u.nickName == L"清單甲" && u.unitClass == 1 && u.ownerUserUID == 777, "unit1 fields"); }
        if (u.unitUID == uid2) { saw2 = true; CHECK(u.nickName == L"清單乙" && u.unitClass == 5, "unit2 fields"); }
        if (u.unitUID == uidOther) sawOther = true;
    }
    CHECK(saw1 && saw2 && !sawOther, "unit list contents correct");
    if (ack.vecUnitInfo.size() == 2)
        CHECK(ack.vecUnitInfo[0].unitUID < ack.vecUnitInfo[1].unitUID, "units sorted by UnitUID (store order)");

    // 空帳號（無角色）：iOK=NET_OK、0 個角色、nUnitSlot 仍為 50（guser 自建）
    MyUnitAndInventoryInfoListAck ack2;
    CHECK(HandleMyUnitAndInventoryInfoListReq(store, 999, "emptytester", /*authLevel=*/0, ack2, err), "handle list req empty ok");
    CHECK(ack2.iOK == NET_OK && ack2.nUnitSlot == 50 && ack2.vecUnitInfo.empty(), "empty user -> empty list, USSize 50");
}

void RunUnitListTestsByRef(int& pass, int& fail)
{
    TestUnitListCodec();
    TestHandleMyUnitAndInventoryInfoListReq();
    pass += g_pass_ul;
    fail += g_fail_ul;
}
