// tests/test_get_next_skill_page_ed.cpp — EGS_GET_NEXT_SKILL_PAGE_ED_REQ/ACK (1149/1150)
#include <cstdio>
#include <cstring>
#include <functional>
#include <string>

#include "../src/core/EventIDs.h"
#include "../src/core/NetError.h"
#include "../src/core/SerBuffer.h"
#include "../src/core/Serializer.h"
#include "../src/db/GameStore.h"
#include "../src/db/Sqlite.h"
#include "../src/server/GetNextSkillPageEdProtocol.h"

using namespace x2;
using namespace x2::db;
using namespace x2::get_next_skill_page_ed;

static int g_pass_page_cost = 0, g_fail_page_cost = 0;
#define CHECK(cond, name) do { \
    if (cond) { ++g_pass_page_cost; } \
    else { ++g_fail_page_cost; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

struct Fixture
{
    Database db;
    GameStore store;
    std::string err;
    int64_t uid = 0;
    Fixture() : store(db)
    {
        if (!db.Open(":memory:", err) || !ApplyGameMigrations(db, err)) return;
        GUserRecord user;
        if (!store.GetOrCreateGUser(8391, "skill_page_quote_user", user, err)) return;
        if (store.CreateUnit(8391, "skill_page_quote_unit", 1, uid, err) != CreateUnitResult::Ok) return;
    }
};

static SerBuffer Payload(const std::function<bool(Serializer&)>& put)
{
    SerBuffer buffer;
    Serializer serializer;
    if (!serializer.BeginWriting(&buffer) || !put(serializer)) return SerBuffer{};
    serializer.EndWriting();
    return buffer;
}

static void TestCodec()
{
    GetNextSkillPageEdReq req;
    SerBuffer reqBytes = Payload([&](Serializer& s) { return PutGetNextSkillPageEdReq(s, req); });
    CHECK(reqBytes.GetLength() == 0, "REQ has no wire fields");
    GetNextSkillPageEdReq reqBack;
    Serializer reqIn;
    CHECK(reqIn.BeginReading(&reqBytes) && GetGetNextSkillPageEdReq(reqIn, reqBack), "empty REQ decode");
    reqIn.EndReading();

    GetNextSkillPageEdAck ack;
    ack.iOK = NET_OK;
    ack.iED = 50000000;
    SerBuffer ackBytes = Payload([&](Serializer& s) { return PutGetNextSkillPageEdAck(s, ack); });
    const unsigned char expected[] = {0,0,0,0, 0x02,0xfa,0xf0,0x80};
    CHECK(ackBytes.GetLength() == sizeof expected &&
          std::memcmp(ackBytes.GetData(), expected, sizeof expected) == 0, "ACK golden iOK then iED");
    GetNextSkillPageEdAck ackBack;
    Serializer ackIn;
    CHECK(ackIn.BeginReading(&ackBytes) && GetGetNextSkillPageEdAck(ackIn, ackBack), "ACK decode");
    ackIn.EndReading();
    CHECK(ackBack.iOK == NET_OK && ackBack.iED == 50000000, "ACK roundtrip");
    CHECK(static_cast<int>(EventID::EGS_GET_NEXT_SKILL_PAGE_ED_REQ) == 1149 &&
          static_cast<int>(EventID::EGS_GET_NEXT_SKILL_PAGE_ED_ACK) == 1150,
          "event IDs");
    CHECK(ERR_SKILL_PAGE_02 == 1390, "page-cap error numeric value");
}

static void TestHandler()
{
    {
        Fixture f;
        GetNextSkillPageEdAck ack;
        CHECK(f.uid > 0 && HandleGetNextSkillPageEdReq(f.store, f.uid, ack, f.err) == NET_OK,
              "one page returns next expansion quote");
        CHECK(ack.iOK == NET_OK && ack.iED == 50000000, "one page quote fields");
    }
    {
        Fixture f;
        CHECK(f.db.Exec("UPDATE gskillexpand SET PageCount=2 WHERE UnitUID=" + std::to_string(f.uid) + ";", f.err),
              "set two-page state");
        GetNextSkillPageEdAck ack;
        CHECK(HandleGetNextSkillPageEdReq(f.store, f.uid, ack, f.err) == NET_OK && ack.iED == 50000000,
              "two pages returns same fixed quote");
    }
    {
        Fixture f;
        CHECK(f.db.Exec("UPDATE gskillexpand SET PageCount=3 WHERE UnitUID=" + std::to_string(f.uid) + ";", f.err),
              "set maximum-page state");
        GetNextSkillPageEdAck ack;
        CHECK(HandleGetNextSkillPageEdReq(f.store, f.uid, ack, f.err) == ERR_SKILL_PAGE_02,
              "three pages returns PAGE_02");
        CHECK(ack.iOK == ERR_SKILL_PAGE_02 && ack.iED == 0, "error ACK retains default ED");
    }
    {
        Fixture f;
        GetNextSkillPageEdAck ack;
        CHECK(HandleGetNextSkillPageEdReq(f.store, 0, ack, f.err) == ERR_ODBC_01,
              "invalid unit UID maps to infrastructure error");
        CHECK(ack.iED == 0 && !f.err.empty(), "invalid UID reports error and zero ED");
    }
    {
        Fixture f;
        GetNextSkillPageEdAck ack;
        CHECK(HandleGetNextSkillPageEdReq(f.store, f.uid + 10000, ack, f.err) == ERR_ODBC_01,
              "unknown positive UID is rejected");
        CHECK(ack.iED == 0 && !f.err.empty(), "unknown UID reports error and zero ED");
    }
    {
        Fixture f;
        CHECK(f.db.Exec("DROP TABLE gskillexpand;", f.err), "drop expansion state table");
        GetNextSkillPageEdAck ack;
        CHECK(HandleGetNextSkillPageEdReq(f.store, f.uid, ack, f.err) == ERR_ODBC_01,
              "DB read failure maps to ERR_ODBC_01");
    }
}

void RunGetNextSkillPageEdTestsByRef(int& pass, int& fail)
{
    TestCodec();
    TestHandler();
    pass += g_pass_page_cost;
    fail += g_fail_page_cost;
    std::printf("GetNextSkillPageEd: %d passed, %d failed\n", g_pass_page_cost, g_fail_page_cost);
}
