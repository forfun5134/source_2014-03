// tests/test_decide_skill_page.cpp — EGS_DECIDE_TO_USE_THIS_SKILL_PAGE_REQ/ACK（§0a27）
#include <cstdio>
#include <cstring>
#include <functional>
#include <string>

#include "../src/core/NetError.h"
#include "../src/core/SerBuffer.h"
#include "../src/core/Serializer.h"
#include "../src/core/EventIDs.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/DecideSkillPageProtocol.h"

using namespace x2;
using namespace x2::db;
using namespace x2::decide_skill_page;

static int g_pass_page = 0, g_fail_page = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_page++; } \
    else { g_fail_page++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
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
        if (!store.GetOrCreateGUser(8101, "page_switch_user", user, err)) return;
        if (store.CreateUnit(8101, "page_switch_unit", 1, uid, err) != CreateUnitResult::Ok) return;
        db.Exec("UPDATE gskillexpand SET PageCount=2, ActivePage=1 WHERE UnitUID=" + std::to_string(uid) + ";", err);
        db.Exec("UPDATE gskillslotnew SET Slot01=10000 WHERE UnitUID=" + std::to_string(uid) + " AND SkillPageNumber=1;", err);
        db.Exec("INSERT OR REPLACE INTO gskillslotnew(UnitUID,SkillPageNumber,Slot01,Slot02,Slot03,Slot04) VALUES (" +
                std::to_string(uid) + ",2,12001,0,0,0);", err);
        db.Exec("INSERT OR REPLACE INTO gskillslot2new(UnitUID,SkillPageNumber,Slot01,Slot02,Slot03,Slot04,EndDate) VALUES (" +
                std::to_string(uid) + ",1,0,0,0,0,'2000-01-01 00:00:00'),(" + std::to_string(uid) + ",2,0,0,0,0,'2000-01-01 00:00:00');", err);
        db.Exec("INSERT OR REPLACE INTO gskill(UnitUID,SkillID,SkillLevel,SkillCSPoint,SkillPageNumber) VALUES (" +
                std::to_string(uid) + ",10000,1,0,1),(" + std::to_string(uid) + ",12001,3,2,2);", err);
        db.Exec("INSERT OR REPLACE INTO gskillcash(UnitUID,CSPoint,MaxCSPoint) VALUES (" + std::to_string(uid) + ",7,30);", err);
        db.Exec("UPDATE gunit SET SPoint=42 WHERE UnitUID=" + std::to_string(uid) + ";", err);
    }
    int32_t ActivePage()
    {
        Statement st; std::string e;
        if (!st.Prepare(db, "SELECT ActivePage FROM gskillexpand WHERE UnitUID=?;", e) || !st.BindInt(1, uid, e)) return -1;
        if (!st.StepRow(e)) return -1;
        return static_cast<int32_t>(st.ColumnInt64(0));
    }
    bool AddUpdateFailure()
    {
        return db.Exec("CREATE TRIGGER fail_active_page BEFORE UPDATE ON gskillexpand BEGIN SELECT RAISE(ABORT,'injected'); END;", err);
    }
};

static SerBuffer Payload(const std::function<bool(Serializer&)>& put)
{
    SerBuffer b; Serializer s;
    if (!s.BeginWriting(&b) || !put(s)) return SerBuffer{};
    s.EndWriting(); return b;
}

static void TestCodec()
{
    DecideSkillPageReq req; req.iSkillPagesNumberDecidedToUse = 0x01020304;
    SerBuffer b = Payload([&](Serializer& s) { return PutDecideSkillPageReq(s, req); });
    const unsigned char reqBytes[] = {1,2,3,4};
    CHECK(b.GetLength() == sizeof reqBytes && std::memcmp(b.GetData(), reqBytes, sizeof reqBytes) == 0, "REQ golden int32 BE");
    DecideSkillPageReq backReq; Serializer in;
    CHECK(in.BeginReading(&b) && GetDecideSkillPageReq(in, backReq), "REQ decode"); in.EndReading();
    CHECK(backReq.iSkillPagesNumberDecidedToUse == req.iSkillPagesNumberDecidedToUse, "REQ roundtrip");

    DecideSkillPageAck ack; ack.iOK = 1; ack.iSkillPagesNumberDecidedToUse = 2;
    ack.iSPointAvailable = 0x01020304; ack.iCSPointAvailable = 0x05060708;
    ack.kUserSkillPageData.equippedSkill[0] = {0x0102, 3};
    ack.kUserSkillPageData.equippedSkillSlotB[3] = {0x0405, 6};
    ack.kUserSkillPageData.usSkillPoint = 7; ack.kUserSkillPageData.usCashSkillPoint = 8;
    unit::UserSkillData learned; learned.skillID = 9; learned.skillLevel = 10; learned.skillCSPoint = 11;
    ack.kUserSkillPageData.userSkillData.push_back(learned);
    b = Payload([&](Serializer& s) { return PutDecideSkillPageAck(s, ack); });
    const unsigned char expected[] = {
        0x00,0x00,0x00,0x01, 0x00,0x00,0x00,0x02, 0x01,0x02,0x03,0x04, 0x05,0x06,0x07,0x08,
        0x01,0x02,0x03, 0x00,0x00,0x00, 0x00,0x00,0x00, 0x00,0x00,0x00,
        0x00,0x00,0x00, 0x00,0x00,0x00, 0x00,0x00,0x00, 0x04,0x05,0x06, 0x00,0x07, 0x00,0x08,
        0x00,0x00,0x00,0x01, 0x00,0x09,0x0a,0x0b
    };
    CHECK(b.GetLength() == sizeof expected && std::memcmp(b.GetData(), expected, sizeof expected) == 0, "ACK golden bytes");
    DecideSkillPageAck backAck; Serializer inAck;
    CHECK(inAck.BeginReading(&b) && GetDecideSkillPageAck(inAck, backAck), "ACK decode"); inAck.EndReading();
    CHECK(backAck.iOK == 1 && backAck.iSkillPagesNumberDecidedToUse == 2 && backAck.iSPointAvailable == 0x01020304 &&
          backAck.iCSPointAvailable == 0x05060708 && backAck.kUserSkillPageData.equippedSkill[0].skillID == 0x0102 &&
          backAck.kUserSkillPageData.userSkillData.size() == 1 && backAck.kUserSkillPageData.userSkillData[0].skillCSPoint == 11,
          "ACK roundtrip");
    CHECK(static_cast<uint16_t>(EventID::EGS_DECIDE_TO_USE_THIS_SKILL_PAGE_REQ) == 1153 &&
          static_cast<uint16_t>(EventID::EGS_DECIDE_TO_USE_THIS_SKILL_PAGE_ACK) == 1154, "event IDs 1153/1154");
    CHECK(ERR_SKILL_PAGE_03 == 1388 && ERR_SKILL_PAGE_06 == 1391 && ERR_SKILL_PAGE_07 == 1392,
          "skill page errors match original enum machine values");
}

static void TestSwitchPageSuccess()
{
    Fixture fx;
    CHECK(fx.uid > 0, "fixture unit created"); if (fx.uid <= 0) return;
    DecideSkillPageReq req; req.iSkillPagesNumberDecidedToUse = 2;
    DecideSkillPageAck ack;
    HandleDecideSkillPageReq(fx.store, fx.uid, req, ack, fx.err);
    CHECK(ack.iOK == NET_OK && ack.iSkillPagesNumberDecidedToUse == 2, "page 2 selected");
    CHECK(fx.ActivePage() == 2, "ActivePage persisted");
    CHECK(ack.iSPointAvailable == 42 && ack.iCSPointAvailable == 7, "unit-global balances returned (page-pool approximation)");
    CHECK(ack.kUserSkillPageData.userSkillData.size() == 1 && ack.kUserSkillPageData.userSkillData[0].skillID == 12001 &&
          ack.kUserSkillPageData.userSkillData[0].skillLevel == 3 && ack.kUserSkillPageData.userSkillData[0].skillCSPoint == 2,
          "selected page learned skills returned");
    CHECK(ack.kUserSkillPageData.equippedSkill[0].skillID == 12001 && ack.kUserSkillPageData.equippedSkill[0].skillLevel == 3,
          "selected page slot A returned with level");
}

static void TestFailures()
{
    {
        Fixture fx; DecideSkillPageReq req; req.iSkillPagesNumberDecidedToUse = 3; DecideSkillPageAck ack;
        HandleDecideSkillPageReq(fx.store, fx.uid, req, ack, fx.err);
        CHECK(ack.iOK == ERR_SKILL_PAGE_03 && ack.iSkillPagesNumberDecidedToUse == 0, "page above available -> PAGE_03, blank ACK");
        CHECK(fx.ActivePage() == 1, "invalid page leaves ActivePage unchanged");
    }
    {
        Fixture fx; fx.db.Exec("DELETE FROM gskillexpand WHERE UnitUID=" + std::to_string(fx.uid) + ";", fx.err);
        DecideSkillPageReq req; req.iSkillPagesNumberDecidedToUse = 1; DecideSkillPageAck ack;
        HandleDecideSkillPageReq(fx.store, fx.uid, req, ack, fx.err);
        CHECK(ack.iOK == ERR_SKILL_PAGE_06, "no expansion record -> PAGE_06");
    }
    {
        Fixture fx; CHECK(fx.AddUpdateFailure(), "install update trigger");
        DecideSkillPageReq req; req.iSkillPagesNumberDecidedToUse = 2; DecideSkillPageAck ack;
        HandleDecideSkillPageReq(fx.store, fx.uid, req, ack, fx.err);
        CHECK(ack.iOK == ERR_SKILL_PAGE_07, "DB update failure -> PAGE_07");
        CHECK(fx.ActivePage() == 1, "failed update leaves ActivePage unchanged");
    }
}

void RunDecideSkillPageTestsByRef(int& pass, int& fail)
{
    g_pass_page = 0; g_fail_page = 0;
    TestCodec(); TestSwitchPageSuccess(); TestFailures();
    pass += g_pass_page; fail += g_fail_page;
    std::printf("decide_skill_page: %d passed, %d failed\n", g_pass_page, g_fail_page);
}
