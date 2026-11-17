// tests/test_character_list.cpp — EGS_CHARACTER_LIST_REQ(1155, NOPARAM) / EGS_CHARACTER_LIST_ACK(1158) 切片測試
// 涵蓋：REQ 空酬載 no-op roundtrip、ACK codec roundtrip（map 套 map/vector）、決策層（建立 2 角色後 ack 內容、slot=50、usSize、strUserID）。
// ⚠ wire 自洽，未對原 SDK 實機驗證；map key=serverGroupID 恆 0（見 CharacterListProtocol.h）。
#include <cstdio>
#include <cstring>
#include <string>
#include <map>
#include <vector>
#include <functional>

#include "../src/core/Serializer.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/CharacterListProtocol.h"
#include "../src/server/UnitSelectArbiter.h"

using namespace x2;
using namespace x2::db;
using namespace x2::character_list;
using namespace x2::select_unit;

void RunCharacterListTestsByRef(int& pass, int& fail);
static int g_pass_cl = 0, g_fail_cl = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_cl++; } \
    else { g_fail_cl++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
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

static void TestCharacterListCodec()
{
    CharacterListReq req;
    SerBuffer reqBuf = PutPayload([&req](Serializer& s) { return PutCharacterListReq(s, req); });
    CHECK(reqBuf.GetLength() == 0, "characterListReq empty payload");
    {
        Serializer ks;
        SerBuffer tmp = reqBuf;
        CharacterListReq rOut;
        CHECK(ks.BeginReading(&tmp) && GetCharacterListReq(ks, rOut), "characterListReq decodes (no-op)");
        ks.EndReading();
        CHECK(rOut == req, "characterListReq no-op rt");
    }
    CharacterListAck ack;
    ack.iOK = 0;
    ack.mapServerGroupUnitSlot = { { 0, 50 } };
    unit::UnitInfo u1;
    u1.unitUID = 123; u1.unitClass = 4; u1.nickName = L"甲"; u1.ownerUserUID = 777; u1.level = 3;
    u1.stat = { 10, 1, 2, 3, 4 }; u1.gameStat = u1.stat;
    unit::UnitInfo u2 = u1; u2.unitUID = 124; u2.nickName = L"乙";
    ack.mapServerGroupUnitInfo = { { 0, { u1, u2 } } };
    ack.strUserID = L"listuser";
    SerBuffer buf = PutPayload([&ack](Serializer& s) { return PutCharacterListAck(s, ack); });
    CHECK(buf.GetLength() > 0, "characterListAck encodes");
    {
        Serializer ks;
        SerBuffer tmp = buf;
        CharacterListAck aOut;
        CHECK(ks.BeginReading(&tmp) && GetCharacterListAck(ks, aOut), "characterListAck decodes");
        ks.EndReading();
        CHECK(aOut.iOK == 0, "ack iOK rt");
        CHECK(aOut.mapServerGroupUnitSlot.size() == 1 && aOut.mapServerGroupUnitSlot.at(0) == 50, "ack slot map rt");
        CHECK(aOut.mapServerGroupUnitInfo.size() == 1 && aOut.mapServerGroupUnitInfo.at(0).size() == 2, "ack unit map rt");
        CHECK(aOut.mapServerGroupUnitInfo.at(0)[0].nickName == L"甲" && aOut.mapServerGroupUnitInfo.at(0)[1].unitUID == 124, "ack units rt");
        CHECK(aOut.strUserID == L"listuser", "ack strUserID rt");
    }
}

static void TestHandleCharacterListReq()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open in-memory game db");
    CHECK(ApplyGameMigrations(db, err), "apply game migrations");
    GameStore store(db);

    // 初始（無角色）：ack.iOK=0、slot=50、info map 內 vector 空、strUserID 回顯
    {
        CharacterListAck ack;
        CHECK(HandleCharacterListReq(store, 777, "listuser", 5, ack, err), "character list handled (empty)");
        CHECK(ack.iOK == 0, "empty iOK");
        CHECK(ack.mapServerGroupUnitSlot.size() == 1 && ack.mapServerGroupUnitSlot.at(0) == 50, "empty slot=50 @ group 0");
        CHECK(ack.mapServerGroupUnitInfo.size() == 1 && ack.mapServerGroupUnitInfo.at(0).empty(), "empty vec");
        CHECK(ack.strUserID == L"listuser", "strUserID echo");
    }
    // 建立 2 角色 → info map 內含 2 筆
    {
        int64_t u1 = 0, u2 = 0;
        std::string e;
        CHECK(store.CreateUnit(777, "列表一號", 1, u1, e) == CreateUnitResult::Ok, "create unit 1");
        e.clear();
        CHECK(store.CreateUnit(777, "列表二號", 2, u2, e) == CreateUnitResult::Ok, "create unit 2");
    }
    {
        CharacterListAck ack;
        CHECK(HandleCharacterListReq(store, 777, "listuser", 5, ack, err), "character list handled (2)");
        CHECK(ack.iOK == 0, "2 units iOK");
        CHECK(ack.mapServerGroupUnitInfo.at(0).size() == 2, "2 units in group 0");
        bool sawOne = false, sawTwo = false;
        for (const auto& u : ack.mapServerGroupUnitInfo.at(0)) {
            if (u.nickName == L"列表一號") sawOne = true;
            if (u.nickName == L"列表二號") sawTwo = true;
        }
        CHECK(sawOne && sawTwo, "both units present with nicknames");
    }
    // 其他使用者不受影響
    {
        CharacterListAck ack;
        CHECK(HandleCharacterListReq(store, 888, "otheruser", 0, ack, err), "other user handled");
        CHECK(ack.mapServerGroupUnitInfo.at(0).empty(), "other user empty list");
        CHECK(ack.strUserID == L"otheruser", "other strUserID echo");
    }
}

void RunCharacterListTestsByRef(int& pass, int& fail)
{
    TestCharacterListCodec();
    TestHandleCharacterListReq();
    pass += g_pass_cl;
    fail += g_fail_cl;
}
