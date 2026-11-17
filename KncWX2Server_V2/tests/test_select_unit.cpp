// tests/test_select_unit.cpp — SELECT_UNIT 最短路徑垂直切片測試
// 涵蓋：REQ/ACK 線路 codec（含 golden bytes）、UnitSelectArbiter 決策（in-memory game DB）、
//      loopback TCP 完整流程（Session 握手 → CONNECT → VERIFY → SELECT_UNIT，含歸屬錯誤/不存在兩路徑，
//      account DB 與 game DB 雙庫聯動）。
// 涵蓋 SELECT_UNIT_1_NOT…5_NOT 分片（codec + gunit→Not1 組裝 + 迴路先 NOT 後 ACK）、
//   EGS_GET_MY_INVENTORY_REQ/ACK 與 EGS_SELECT_UNIT_INVENTORY_INFO_NOT（合成背包資料）。
//   golden bytes 為自洽佈局，未對原 SDK 實機驗證。
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>
#include <functional>
#include <thread>
#include <atomic>
#include <chrono>
#include <unistd.h>

#include "../src/core/Event.h"
#include "../src/core/EventIDs.h"
#include "../src/core/NetError.h"
#include "../src/core/Serializer.h"
#include "../src/db/GameStore.h"
#include "../src/db/Sqlite.h"
#include "../src/db/UserStore.h"
#include "../src/net/Session.h"
#include "../src/server/LoginArbiter.h"
#include "../src/server/LoginProtocol.h"
#include "../src/server/SelectUnitProtocol.h"
#include "../src/server/UnitSelectArbiter.h"
#include "../src/server/UnitListProtocol.h"

using namespace x2;
using namespace x2::db;
using namespace x2::login;
using namespace x2::select_unit;

void RunSelectUnitTestsByRef(int& pass, int& fail);
static int g_pass_sel = 0, g_fail_sel = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_sel++; } \
    else { g_fail_sel++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static const uint16_t kSelectUnitReqID = static_cast<uint16_t>(EventID::EGS_SELECT_UNIT_REQ);
static const uint16_t kSelectUnitAckID = static_cast<uint16_t>(EventID::EGS_SELECT_UNIT_ACK);
static const uint16_t kSelectUnit1NotID = static_cast<uint16_t>(EventID::EGS_SELECT_UNIT_1_NOT);
static const uint16_t kSelectUnit2NotID = static_cast<uint16_t>(EventID::EGS_SELECT_UNIT_2_NOT);
static const uint16_t kSelectUnit3NotID = static_cast<uint16_t>(EventID::EGS_SELECT_UNIT_3_NOT);
static const uint16_t kSelectUnit4NotID = static_cast<uint16_t>(EventID::EGS_SELECT_UNIT_4_NOT);
static const uint16_t kSelectUnit5NotID = static_cast<uint16_t>(EventID::EGS_SELECT_UNIT_5_NOT);
static const uint16_t kGetMyInventoryReqID = static_cast<uint16_t>(EventID::EGS_GET_MY_INVENTORY_REQ);
static const uint16_t kGetMyInventoryAckID = static_cast<uint16_t>(EventID::EGS_GET_MY_INVENTORY_ACK);
static const uint16_t kInventoryInfoNotID = static_cast<uint16_t>(EventID::EGS_SELECT_UNIT_INVENTORY_INFO_NOT);
static const uint16_t kConnectReqID = static_cast<uint16_t>(EventID::EGS_CONNECT_REQ);
static const uint16_t kConnectAckID = static_cast<uint16_t>(EventID::EGS_CONNECT_ACK);
static const uint16_t kVerifyReqID  = static_cast<uint16_t>(EventID::EGS_VERIFY_ACCOUNT_REQ);
static const uint16_t kVerifyAckID  = static_cast<uint16_t>(EventID::EGS_VERIFY_ACCOUNT_ACK);
static const uint16_t kMyUnitListReqID = static_cast<uint16_t>(EventID::EGS_MY_UNIT_AND_INVENTORY_INFO_LIST_REQ);
static const uint16_t kMyUnitListAckID = static_cast<uint16_t>(EventID::EGS_MY_UNIT_AND_INVENTORY_INFO_LIST_ACK);

static SerBuffer PutPayload(const std::function<bool(Serializer&)>& fn)
{
    Serializer ks;
    SerBuffer buf;
    if (!ks.BeginWriting(&buf)) return SerBuffer{};
    if (!fn(ks)) return SerBuffer{};
    ks.EndWriting();
    return buf;
}

static Event MakeEvent(uint16_t eventID, const SerBuffer& payload)
{
    Event ev;
    ev.eventID = eventID;
    ev.payload = payload;
    ev.dest.performerID = PerformerID::PI_GS_USER;
    return ev;
}

// ---- codec golden bytes ----
static void TestSelectUnitCodec()
{
    SelectUnitReq req;
    req.unitUID = 0x0102030405060708LL;
    Serializer ks;
    SerBuffer buf;
    CHECK(ks.BeginWriting(&buf), "begin");
    CHECK(PutSelectUnitReq(ks, req), "put req");
    ks.EndWriting();
    static const uint8_t expectReq[] = { 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08 };
    CHECK(buf.GetLength() == 8, "req is exactly 8 bytes");
    CHECK(std::memcmp(buf.GetData(), expectReq, 8) == 0, "req golden bytes (int64 BE)");

    Serializer ks2;
    SerBuffer tmp = buf;
    SelectUnitReq back;
    CHECK(ks2.BeginReading(&tmp), "begin read");
    CHECK(GetSelectUnitReq(ks2, back), "get req");
    ks2.EndReading();
    CHECK(back.unitUID == req.unitUID, "req roundtrip");

    SelectUnitAck ack;
    ack.iOK = ERR_SELECT_UNIT_07;
    SerBuffer buf2;
    Serializer ks3;
    CHECK(ks3.BeginWriting(&buf2), "begin ack");
    CHECK(PutSelectUnitAck(ks3, ack), "put ack");
    ks3.EndWriting();
    static const uint8_t expectAck[] = { 0x00, 0x00, 0x04, 0x39 };  // 1081 = 0x439
    CHECK(buf2.GetLength() == 4, "ack is 4 bytes");
    CHECK(std::memcmp(buf2.GetData(), expectAck, 4) == 0, "ack golden bytes 1081");

    Serializer ks4;
    SerBuffer tmp2 = buf2;
    SelectUnitAck ackBack;
    CHECK(ks4.BeginReading(&tmp2), "begin read ack");
    CHECK(GetSelectUnitAck(ks4, ackBack), "get ack");
    ks4.EndReading();
    CHECK(ackBack.iOK == ERR_SELECT_UNIT_07, "ack roundtrip");
}

// ---- arbiter 決策（in-memory game DB）----
static bool SeedGameDb(Database& db, std::string& err, int64_t& unitUIDOut, int64_t userUID = 777)
{
    if (!db.Open(":memory:", err)) return false;
    if (!ApplyGameMigrations(db, err)) return false;
    GameStore store(db);
    GUserRecord gu;
    if (!store.GetOrCreateGUser(userUID, "selecttester", gu, err)) return false;
    return store.CreateUnit(userUID, "選擇測試", 1, unitUIDOut, err) == CreateUnitResult::Ok;
}

static void TestUnitSelectArbiterDecisions()
{
    Database db;
    std::string err;
    int64_t unitUID = 0;
    CHECK(SeedGameDb(db, err, unitUID), "seed game db");
    GameStore store(db);

    SelectUnitReq req;
    SelectUnitAck ack;

    // 成功：歸屬正確
    req.unitUID = unitUID;
    int rc = HandleSelectUnitReq(store, 777, req, ack, err);
    CHECK(rc == NET_OK && ack.iOK == NET_OK, "own unit accepted");
    {
        bool found = false;
        GUnitRecord u;
        CHECK(store.GetUnitByUID(unitUID, u, found, err) && found, "unit re-read ok");
        CHECK(u.loginCount == 1, "loginCount incremented on successful select");
    }

    // 不存在
    req.unitUID = 0x7FFFFFFF00000001LL;
    rc = HandleSelectUnitReq(store, 777, req, ack, err);
    CHECK(rc == ERR_SELECT_UNIT_00 && ack.iOK == ERR_SELECT_UNIT_00, "unknown unit -> ERR_SELECT_UNIT_00");

    // 歸屬錯誤（unit 屬於 777，以 888 身分選）
    req.unitUID = unitUID;
    rc = HandleSelectUnitReq(store, 888, req, ack, err);
    CHECK(rc == ERR_SELECT_UNIT_07 && ack.iOK == ERR_SELECT_UNIT_07, "foreign unit -> ERR_SELECT_UNIT_07");
    {
        bool found = false;
        GUnitRecord u;
        CHECK(store.GetUnitByUID(unitUID, u, found, err) && found, "unit re-read after foreign select");
        CHECK(u.loginCount == 1, "foreign select does NOT increment loginCount");
    }

    // 已刪除
    CHECK(store.SoftDeleteUnit(unitUID, err), "soft delete ok");
    req.unitUID = unitUID;
    rc = HandleSelectUnitReq(store, 777, req, ack, err);
    CHECK(rc == ERR_SELECT_UNIT_00, "deleted unit -> ERR_SELECT_UNIT_00");

    // 二級密碼未通過
    req.unitUID = unitUID;
    rc = HandleSelectUnitReq(store, 777, req, ack, err, /*secondSecurityOk=*/false);
    CHECK(rc == ERR_VERIFY_21 && ack.iOK == ERR_VERIFY_21, "second security not ok -> ERR_VERIFY_21");

    // 非法 UID
    req.unitUID = 0;
    rc = HandleSelectUnitReq(store, 777, req, ack, err);
    CHECK(rc == ERR_SELECT_UNIT_07, "zero unitUID -> ERR_SELECT_UNIT_07");
}

static void TestSelectUnitNot1Codec()
{
    SelectUnitNot1 v;
    v.iOK = NET_OK;
    v.unitInfo.ownerUserUID = 0x1020304050607080LL;
    v.unitInfo.authLevel = 3;
    v.unitInfo.unitUID = 0x7766554433221100LL;
    v.unitInfo.unitClass = 2;
    v.unitInfo.nickName = L"阿斯特雷亞";
    v.unitInfo.level = 42;
    v.unitInfo.exp = 123456;
    v.unitInfo.stat = { 500, 60, 70, 80, 90 };
    v.unitInfo.gameStat = v.unitInfo.stat;
    v.unitInfo.lastPos = { 20000, 1, 30000, false };
    v.unitInfo.win = 10;
    v.unitInfo.lose = 4;
    v.unitInfo.unitSkillData.equippedSkill[0] = { 10001, 16 };
    v.unitInfo.unitSkillData.activeSkillPagesNumber = 2;
    v.unitInfo.unitSkillData.theNumberOfSkillPagesAvailable = 3;
    v.unitCreateDate = L"2026-11-01 10:00:00";
    v.realDataED = 123;
    v.unitLastLoginDate = L"2026-11-17 08:00:00";
    v.inventorySlotSize[1] = 60;
    v.inventorySlotSize[2] = 30;
    v.items[0x1122334455667788LL].itemUID = 0x1122334455667788LL;
    v.items[0x1122334455667788LL].slotCategory = 1;
    v.items[0x1122334455667788LL].slotID = 10;
    v.items[0x1122334455667788LL].itemInfo.itemID = 777;
    v.numResurrectionStone = 5;
    v.numAutoPaymentResStone = 2;
    v.autoPayResStoneLastDate = L"2026-12-01 00:00:00";
    {
        unit::UserSkillPageData page;
        page.usSkillPoint = 10;
        page.usCashSkillPoint = 3;
        page.userSkillData.push_back({ 10001, 16, 2 });
        v.vecUserSkillPageData.push_back(page);
    }
    v.vecSkillUnsealed = { 10001, 10002 };
    v.skillNoteMaxPageNum = 4;
    v.mapSkillNote[1] = 1001;
    v.relationshipInfo = { 2, 0x0BADCAFE12345678LL, L"戀人", L"甜蜜宣言", 999, 111, 1 };

    SerBuffer buf = PutPayload([&v](Serializer& s) { return PutSelectUnitNot1(s, v); });
    CHECK(buf.GetLength() > 0, "not1 encodes");

    Serializer ks2;
    SerBuffer tmp = buf;
    SelectUnitNot1 out;
    CHECK(ks2.BeginReading(&tmp), "not1 begin read");
    CHECK(GetSelectUnitNot1(ks2, out), "not1 decodes");
    ks2.EndReading();
    CHECK(out.iOK == NET_OK, "not1 iOK rt");
    CHECK(out.unitInfo.unitUID == v.unitInfo.unitUID && out.unitInfo.nickName == L"阿斯特雷亞", "not1 unit rt");
    CHECK(out.unitInfo.level == 42 && out.unitInfo.stat.atkMagic == 70 && out.unitInfo.gameStat.baseHP == 500, "not1 stat rt");
    CHECK(out.unitInfo.lastPos.mapID == 20000 && out.unitInfo.win == 10 && out.unitInfo.lose == 4, "not1 lastpos/winlose rt");
    CHECK(out.unitInfo.unitSkillData.equippedSkill[0].skillID == 10001 && out.unitInfo.unitSkillData.theNumberOfSkillPagesAvailable == 3, "not1 skill rt");
    CHECK(out.unitCreateDate == L"2026-11-01 10:00:00" && out.unitLastLoginDate == L"2026-11-17 08:00:00" && out.realDataED == 123, "not1 dates/ED rt");
    CHECK(out.inventorySlotSize.size() == 2 && out.inventorySlotSize[1] == 60 && out.inventorySlotSize[2] == 30, "not1 inv slot map rt");
    CHECK(out.items.size() == 1 && out.items.begin()->second.itemInfo.itemID == 777, "not1 items map rt");
    CHECK(out.numResurrectionStone == 5 && out.numAutoPaymentResStone == 2 && out.autoPayResStoneLastDate == L"2026-12-01 00:00:00", "not1 restone rt");
    CHECK(out.vecUserSkillPageData.size() == 1 && out.vecUserSkillPageData[0].userSkillData.size() == 1 &&
          out.vecUserSkillPageData[0].userSkillData[0].skillCSPoint == 2 && out.vecUserSkillPageData[0].usSkillPoint == 10, "not1 skill page rt");
    CHECK(out.vecSkillUnsealed == std::vector<int16_t>({ 10001, 10002 }), "not1 unsealed rt");
    CHECK(out.skillNoteMaxPageNum == 4 && out.mapSkillNote.size() == 1 && out.mapSkillNote[1] == 1001, "not1 skill note rt");
    CHECK(out.relationshipInfo.relationshipType == 2 && out.relationshipInfo.otherUnitUID == 0x0BADCAFE12345678LL &&
          out.relationshipInfo.otherNickName == L"戀人" && out.relationshipInfo.date == 999 && out.relationshipInfo.rewardTitleType == 1, "not1 relationship rt");
}

static void TestBuildSelectUnitNot1FromGUnit()
{
    Database db;
    std::string err;
    int64_t unitUID = 0;
    CHECK(SeedGameDb(db, err, unitUID), "seed game db");
    GameStore store(db);

    SelectUnitReq req;
    req.unitUID = unitUID;
    SelectUnitAck ack;
    SelectUnitNot1 not1;
    int rc = HandleSelectUnitReq(store, 777, req, ack, err, /*secondSecurityOk=*/true, /*outUnit=*/nullptr, &not1, /*authLevel=*/5);
    CHECK(rc == NET_OK, "select ok with outNot1");
    CHECK(not1.iOK == NET_OK, "not1 iOK");
    CHECK(not1.unitInfo.unitUID == unitUID, "not1 carries unitUID");
    CHECK(not1.unitInfo.ownerUserUID == 777, "not1 ownerUserUID");
    CHECK(not1.unitInfo.authLevel == 5, "not1 authLevel from account");
    CHECK(not1.unitInfo.nickName == L"選擇測試", "not1 nickname utf8->wide");
    CHECK(not1.unitInfo.level == 1 && not1.unitInfo.exp == 0, "not1 level/exp from gunit");
    CHECK(not1.unitInfo.stat.baseHP == 0 && not1.unitInfo.lastPos.mapID == 20000, "not1 stat/lastpos");
    CHECK(!not1.unitCreateDate.empty() && not1.unitCreateDate == not1.unitLastLoginDate, "not1 dates filled from gunit");
    CHECK(not1.vecUserSkillPageData.size() == 1, "not1 one default skill page");
    // 空資料誠實佔位
    CHECK(not1.items.empty() && not1.inventorySlotSize.empty() && not1.numResurrectionStone == 0, "not1 no fabricated items/stones");
}

static void TestSelectUnitNot2Codec()
{
    SelectUnitNot2 v;
    v.iOK = NET_OK;
    {
        unit::QuestInstance q;
        q.iID = 8001;
        q.ownerUnitUID = 0x0BADCAFE12345678LL;
        q.subQuests.push_back({ 9001, 7, true });
        q.subQuests.push_back({ 9002, 0, false });
        v.vecQuest.push_back(q);
    }
    v.vecCompletQuest.push_back({ 7001, 3, 0x0102030405060708LL });
    v.mapRandomQuestList[11] = 101;
    v.mapRandomQuestList[12] = 102;

    SerBuffer buf = PutPayload([&v](Serializer& s) { return PutSelectUnitNot2(s, v); });
    CHECK(buf.GetLength() > 0, "not2 encodes");

    Serializer ks2;
    SerBuffer tmp = buf;
    SelectUnitNot2 out;
    CHECK(ks2.BeginReading(&tmp), "not2 begin read");
    CHECK(GetSelectUnitNot2(ks2, out), "not2 decodes");
    ks2.EndReading();
    CHECK(out.iOK == NET_OK, "not2 iOK rt");
    CHECK(out.vecQuest.size() == 1 && out.vecQuest[0].iID == 8001 && out.vecQuest[0].ownerUnitUID == 0x0BADCAFE12345678LL, "not2 quest rt");
    CHECK(out.vecQuest[0].subQuests.size() == 2 && out.vecQuest[0].subQuests[0].ucClearData == 7 && out.vecQuest[0].subQuests[0].bIsSuccess, "not2 subquest rt");
    CHECK(out.vecCompletQuest.size() == 1 && out.vecCompletQuest[0].questID == 7001 && out.vecCompletQuest[0].completeCount == 3 && out.vecCompletQuest[0].completeDate == 0x0102030405060708LL, "not2 completeQuest rt");
    CHECK(out.mapRandomQuestList.size() == 2 && out.mapRandomQuestList[11] == 101 && out.mapRandomQuestList[12] == 102, "not2 randomQuest rt");
}

static void TestBuildSelectUnitNot2Defaults()
{
    SelectUnitNot2 not2;
    BuildSelectUnitNot2(not2);
    CHECK(not2.iOK == NET_OK, "not2 builder iOK");
    CHECK(not2.vecQuest.empty() && not2.vecCompletQuest.empty() && not2.mapRandomQuestList.empty(),
          "not2 builder: no fabricated quest data (empty placeholders)");
}

static void TestSelectUnitNot3Codec()
{
    SelectUnitNot3 v;
    v.iOK = NET_OK;
    {
        unit::MissionInstance m;
        m.iID = 5001;
        m.subMissionInstances.push_back({ 6001, 3, true });
        m.subMissionInstances.push_back({ 6002, 0, false });
        v.vecMission.push_back(m);
    }
    v.vecTitle.push_back({ 3001, L"2099-12-31 00:00:00", 0x0102030405060708LL, true });
    v.iSummonedPetUID = 0x0BADCAFE12345678LL;
    {
        unit::PetInfo p;
        p.iPetUID = 0x0BADCAFE12345678LL;
        p.iPetID = 9001;
        p.wstrPetName = L"小火";
        p.cEvolutionStep = 2;
        p.sSatiety = 80;
        p.iIntimacy = 12345;
        p.sExtroversion = 50;
        p.sEmotion = 60;
        p.bAutoFeed = true;
        p.wstrLastFeedDate = L"2026-11-15 10:00:00";
        p.wstrLastSummonDate = L"2026-11-16 10:00:00";
        p.wstrRegDate = L"2026-01-01 00:00:00";
        p.bAutoLooting = true;
        v.vecPetList.push_back(p);
    }
    v.vecCanEvolutionPetList = { 0x1111111111111111LL, 0x2222222222222222LL };
    v.vecNeverSummonPetList = { 0x3333333333333333LL };
    {
        unit::InventoryItemInfo ii;
        ii.itemUID = 0x4444444444444444LL;
        ii.slotCategory = 9;
        ii.slotID = 3;
        ii.itemInfo.itemID = 1234;
        v.mapPetItem[0x0BADCAFE12345678LL][0x4444444444444444LL] = ii;
    }

    SerBuffer buf = PutPayload([&v](Serializer& s) { return PutSelectUnitNot3(s, v); });
    CHECK(buf.GetLength() > 0, "not3 encodes");

    Serializer ks2;
    SerBuffer tmp = buf;
    SelectUnitNot3 out;
    CHECK(ks2.BeginReading(&tmp), "not3 begin read");
    CHECK(GetSelectUnitNot3(ks2, out), "not3 decodes");
    ks2.EndReading();
    CHECK(out.iOK == NET_OK, "not3 iOK rt");
    CHECK(out.vecMission.size() == 1 && out.vecMission[0].iID == 5001 && out.vecMission[0].subMissionInstances.size() == 2 &&
          out.vecMission[0].subMissionInstances[0].sClearData == 3, "not3 mission rt");
    CHECK(out.vecTitle.size() == 1 && out.vecTitle[0].iTitleID == 3001 && out.vecTitle[0].bInfinity &&
          out.vecTitle[0].kCTime == 0x0102030405060708LL, "not3 title rt");
    CHECK(out.iSummonedPetUID == 0x0BADCAFE12345678LL, "not3 summoned pet rt");
    CHECK(out.vecPetList.size() == 1 && out.vecPetList[0].iPetID == 9001 && out.vecPetList[0].wstrPetName == L"小火" &&
          out.vecPetList[0].sSatiety == 80 && out.vecPetList[0].bAutoFeed && out.vecPetList[0].bAutoLooting, "not3 pet rt");
    CHECK(out.vecCanEvolutionPetList == std::vector<int64_t>({ 0x1111111111111111LL, 0x2222222222222222LL }), "not3 canEvolution rt");
    CHECK(out.vecNeverSummonPetList == std::vector<int64_t>({ 0x3333333333333333LL }), "not3 neverSummon rt");
    CHECK(out.mapPetItem.size() == 1 &&
          out.mapPetItem.begin()->second.begin()->second.itemInfo.itemID == 1234, "not3 petItem nested map rt");
}

static void TestBuildSelectUnitNot3Defaults()
{
    SelectUnitNot3 not3;
    BuildSelectUnitNot3(not3);
    CHECK(not3.iOK == NET_OK, "not3 builder iOK");
    CHECK(not3.vecMission.empty() && not3.vecTitle.empty() && not3.vecPetList.empty() &&
          not3.vecCanEvolutionPetList.empty() && not3.vecNeverSummonPetList.empty() &&
          not3.mapPetItem.empty() && not3.iSummonedPetUID == 0,
          "not3 builder: no fabricated mission/title/pet data (empty placeholders)");
}

static void TestSelectUnitNot4Codec()
{
    SelectUnitNot4 v;
    v.iOK = NET_OK;
    v.vecChatBlackList.push_back({ 0x0BADCAFE12345678LL, L"壞人" });
    v.kDenyOptions = { 1, 2, 0, 1, 2, 0 };
    v.bIsRecommend = true;
    v.iRecommendUnitUID = 0x1122334455667788LL;
    {
        unit::TutorialDBUnitInfo t;
        t.kTutorialUnitInfo = { 0x0BADCAFE12345678LL, 55, L"朋友", true };
        t.wstrLastDate = L"2026-11-10 12:00:00";
        v.vecTutorialDBUnitInfo.push_back(t);
    }
    v.vecConnectTimeEvent.push_back({ 1234, L"2026-11-01 00:00:00", true });
    v.vecCumulativeTimeEvent.push_back({ 2234, 7200, true });
    v.vecHenirRanking.push_back({ 1, 99, 3600, 0x0102030405060708LL, 0x0BADCAFE12345678LL, L"排行第一", 5, 42 });
    {
        unit::MessengerInfo msg;
        msg.mapFriendInfo[0x0BADCAFE12345678LL] = { 0x0BADCAFE12345678LL, L"老友", 1, 3, 1 };
        msg.mapGroup[1] = L"同學";
        msg.mapGroup[2] = L"同事";
        msg.vecFriendMessageInfo.push_back({ 0x0BADCAFE12345678LL, L"老友", 0, L"一起玩嗎", L"2026-11-16 20:00:00" });
        v.kMessengerInfo = msg;
    }
    {
        unit::GamePlayStatus st;
        st.iMaxHP = 1000; st.iCurHP = 800; st.iMaxMP = 200; st.iCurMP = 150;
        st.iCurHyperGage = 50; st.cCurHyperCount = 2; st.cCharAbilType = 1; st.iCharAbilCount = 7;
        st.mapSkillCoolTime[10001] = 30;
        st.mapQuickSlotCoolTime[20001] = 5;
        st.mapPetMP = { 301, 302, 303 };
        st.mapRidingPetCoolTime[40001] = 60;
        v.kGamePlayStatus.vecGamePlayStatus.push_back(st);
    }

    SerBuffer buf = PutPayload([&v](Serializer& s) { return PutSelectUnitNot4(s, v); });
    CHECK(buf.GetLength() > 0, "not4 encodes");

    Serializer ks2;
    SerBuffer tmp = buf;
    SelectUnitNot4 out;
    CHECK(ks2.BeginReading(&tmp), "not4 begin read");
    CHECK(GetSelectUnitNot4(ks2, out), "not4 decodes");
    ks2.EndReading();
    CHECK(out.iOK == NET_OK, "not4 iOK rt");
    CHECK(out.vecChatBlackList.size() == 1 && out.vecChatBlackList[0].wstrNickName == L"壞人", "not4 blacklist rt");
    CHECK(out.kDenyOptions.cDenyFriendShip == 1 && out.kDenyOptions.cDenyRequestCouple == 2 && out.kDenyOptions.cDenyInvitePracticePVP == 0, "not4 denyOptions rt");
    CHECK(out.bIsRecommend && out.iRecommendUnitUID == 0x1122334455667788LL, "not4 recommend rt");
    CHECK(out.vecTutorialDBUnitInfo.size() == 1 && out.vecTutorialDBUnitInfo[0].kTutorialUnitInfo.ucLevel == 55 && out.vecTutorialDBUnitInfo[0].wstrLastDate == L"2026-11-10 12:00:00", "not4 tutorial rt");
    CHECK(out.vecConnectTimeEvent.size() == 1 && out.vecConnectTimeEvent[0].bAccountEvent && out.vecConnectTimeEvent[0].iEventUID == 1234, "not4 connectTime rt");
    CHECK(out.vecCumulativeTimeEvent.size() == 1 && out.vecCumulativeTimeEvent[0].iCumulativeTime == 7200, "not4 cumulativeTime rt");
    CHECK(out.vecHenirRanking.size() == 1 && out.vecHenirRanking[0].ulPlayTime == 3600 && out.vecHenirRanking[0].ucLevel == 42, "not4 henir rt");
    CHECK(out.kMessengerInfo.mapFriendInfo.size() == 1 && out.kMessengerInfo.mapGroup.size() == 2 &&
          out.kMessengerInfo.mapGroup[2] == L"同事" && out.kMessengerInfo.vecFriendMessageInfo.size() == 1 &&
          out.kMessengerInfo.vecFriendMessageInfo[0].wstrMessage == L"一起玩嗎", "not4 messenger rt");
    CHECK(out.kGamePlayStatus.vecGamePlayStatus.size() == 1 &&
          out.kGamePlayStatus.vecGamePlayStatus[0].mapSkillCoolTime[10001] == 30 &&
          out.kGamePlayStatus.vecGamePlayStatus[0].mapPetMP.count(302) == 1 &&
          out.kGamePlayStatus.vecGamePlayStatus[0].mapRidingPetCoolTime[40001] == 60, "not4 gamePlayStatus rt");
}

static void TestBuildSelectUnitNot4Defaults()
{
    SelectUnitNot4 not4;
    BuildSelectUnitNot4(not4);
    CHECK(not4.iOK == NET_OK, "not4 builder iOK");
    CHECK(not4.vecChatBlackList.empty() && not4.vecTutorialDBUnitInfo.empty() && not4.vecHenirRanking.empty() &&
          not4.kMessengerInfo.mapFriendInfo.empty() && not4.kGamePlayStatus.vecGamePlayStatus.empty() &&
          !not4.bIsRecommend && not4.iRecommendUnitUID == 0 &&
          not4.kDenyOptions.cDenyFriendShip == 0 && not4.kDenyOptions.cDenyInvitePracticePVP == 0,
          "not4 builder: no fabricated social/tutorial data (zeroed/empty placeholders)");
}

static void TestSelectUnitNot5Codec()
{
    SelectUnitNot5 v;
    v.iOK = NET_OK;
    v.bIsSpiritUpdated = true;
    v.mapCharGameCount[10001] = 5;
    v.mapCharGameCount[10002] = 7;
    {
        unit::UserPShopAgencyInfo ps;
        ps.bIsPShopOpen = true;
        ps.wstrAgencyExpirationDate = L"2026-12-31 23:59:59";
        ps.cShopType = 1;
        unit::SellPersonalShopItemInfo sell;
        sell.kInventoryItemInfo.itemUID = 0x0BADCAFE12345678LL;
        sell.kInventoryItemInfo.itemInfo.itemID = 4321;
        sell.iPricePerOne = 10000;
        sell.iFeePerOne = 100;
        sell.cPShopItemType = 1;
        sell.iTotalSellEDIn = 50000;
        sell.iTotalSoldItemQuantity = 5;
        sell.iInventoryItemUID = 0x1122334455667788LL;
        unit::SellPShopItemBackupData bak;
        bak.kSellPShopItemInfo = sell;
        bak.iTotalSoldItemQuantity = 5;
        bak.iTotalSellCommissionED = 500;
        ps.vecSellItemInfo.push_back(bak);
        ps.iUserUID = 777;
        ps.iUnitUID = 0x7766554433221100LL;
        ps.wstrNickName = L"掌櫃";
        ps.wstrAgencyOpenDate = L"2026-11-01 00:00:00";
        ps.wstrPersonalShopName = L"寶物店";
        ps.bOnSale = true;
        v.kPShopAgencyInfo = ps;
    }
    v.packetHenirRewardCount = { true, 3, 2, 1, 10, 5 };
    v.bCashShopOpen = true;
    v.bFirstSelect = true;
    v.bLocalRankingUser = true;

    SerBuffer buf = PutPayload([&v](Serializer& s) { return PutSelectUnitNot5(s, v); });
    CHECK(buf.GetLength() > 0, "not5 encodes");

    Serializer ks2;
    SerBuffer tmp = buf;
    SelectUnitNot5 out;
    CHECK(ks2.BeginReading(&tmp), "not5 begin read");
    CHECK(GetSelectUnitNot5(ks2, out), "not5 decodes");
    ks2.EndReading();
    CHECK(out.iOK == NET_OK, "not5 iOK rt");
    CHECK(out.bIsSpiritUpdated, "not5 spirit rt");
    CHECK(out.mapCharGameCount.size() == 2 && out.mapCharGameCount[10001] == 5, "not5 charGameCount rt");
    CHECK(out.kPShopAgencyInfo.bIsPShopOpen && out.kPShopAgencyInfo.cShopType == 1 &&
          out.kPShopAgencyInfo.vecSellItemInfo.size() == 1 &&
          out.kPShopAgencyInfo.vecSellItemInfo[0].kSellPShopItemInfo.kInventoryItemInfo.itemInfo.itemID == 4321 &&
          out.kPShopAgencyInfo.vecSellItemInfo[0].kSellPShopItemInfo.iInventoryItemUID == 0x1122334455667788LL &&
          out.kPShopAgencyInfo.wstrPersonalShopName == L"寶物店" && out.kPShopAgencyInfo.bOnSale, "not5 pshop rt");
    CHECK(out.packetHenirRewardCount.bUnLimited && out.packetHenirRewardCount.iNormal == 3 &&
          out.packetHenirRewardCount.iPremiumMAX == 10 && out.packetHenirRewardCount.iEventMAX == 5, "not5 henirReward rt");
    CHECK(out.bCashShopOpen && out.bFirstSelect && out.bLocalRankingUser, "not5 bools rt");
}

static void TestBuildSelectUnitNot5Defaults()
{
    SelectUnitNot5 not5;
    BuildSelectUnitNot5(not5);
    CHECK(not5.iOK == NET_OK, "not5 builder iOK");
    CHECK(!not5.bIsSpiritUpdated && not5.mapCharGameCount.empty() &&
          !not5.kPShopAgencyInfo.bIsPShopOpen && not5.kPShopAgencyInfo.vecSellItemInfo.empty() &&
          !not5.packetHenirRewardCount.bUnLimited && not5.packetHenirRewardCount.iNormal == 0 &&
          !not5.bCashShopOpen && !not5.bFirstSelect && !not5.bLocalRankingUser,
          "not5 builder: no fabricated state (false/0 placeholders)");
}

static void TestGetMyInventoryCodec()
{
    // REQ：空 payload，Put/Get 皆回 true
    GetMyInventoryReq req;
    SerBuffer reqBuf = PutPayload([&req](Serializer& s) { return PutGetMyInventoryReq(s, req); });
    CHECK(reqBuf.GetLength() == 0, "getMyInventoryReq encodes to empty payload");
    {
        Serializer ks;
        SerBuffer tmp = reqBuf;
        GetMyInventoryReq rOut;
        CHECK(ks.BeginReading(&tmp) && GetGetMyInventoryReq(ks, rOut), "getMyInventoryReq decodes");
        ks.EndReading();
    }
    // ACK golden
    GetMyInventoryAck ack;
    ack.iOK = NET_OK;
    ack.bIsRecommend = true;
    SerBuffer buf = PutPayload([&ack](Serializer& s) { return PutGetMyInventoryAck(s, ack); });
    {
        Serializer ks;
        SerBuffer tmp = buf;
        GetMyInventoryAck aOut;
        CHECK(ks.BeginReading(&tmp) && GetGetMyInventoryAck(ks, aOut), "getMyInventoryAck decodes");
        ks.EndReading();
        CHECK(aOut.iOK == NET_OK && aOut.bIsRecommend, "getMyInventoryAck rt");
    }
    // INFO_NOT golden
    SelectUnitInventoryInfoNot invInfo;
    invInfo.iSlotCategory = 3;
    unit::InventoryItemInfo ii;
    ii.itemUID = 0x0BADCAFE12345678LL;
    ii.slotCategory = 3;
    ii.slotID = 10;
    ii.itemInfo.itemID = 555;
    ii.itemInfo.quantity = 2;
    invInfo.mapItem[ii.itemUID] = ii;
    buf = PutPayload([&invInfo](Serializer& s) { return PutSelectUnitInventoryInfoNot(s, invInfo); });
    CHECK(buf.GetLength() > 0, "inventoryInfoNot encodes");
    {
        Serializer ks;
        SerBuffer tmp = buf;
        SelectUnitInventoryInfoNot nOut;
        CHECK(ks.BeginReading(&tmp) && GetSelectUnitInventoryInfoNot(ks, nOut), "inventoryInfoNot decodes");
        ks.EndReading();
        CHECK(nOut.iSlotCategory == 3 && nOut.mapItem.size() == 1 &&
              nOut.mapItem.begin()->second.itemInfo.itemID == 555 &&
              nOut.mapItem.begin()->second.itemInfo.quantity == 2, "inventoryInfoNot rt");
    }
}

static void TestHandleGetMyInventoryReqGroupsByCategory()
{
    std::map<int64_t, unit::InventoryItemInfo> items;
    auto mk = [](int64_t uid, int32_t cat, int32_t id) {
        unit::InventoryItemInfo ii;
        ii.itemUID = uid; ii.slotCategory = cat; ii.slotID = 1; ii.itemInfo.itemID = id;
        return ii;
    };
    items[0x1000] = mk(0x1000, 2, 200);
    items[0x1001] = mk(0x1001, 1, 100);
    items[0x1002] = mk(0x1002, 2, 201);

    GetMyInventoryAck ack;
    std::vector<SelectUnitInventoryInfoNot> nots;
    size_t n = HandleGetMyInventoryReq(items, ack, nots);
    CHECK(n == 2, "two non-empty categories -> 2 NOTs");
    CHECK(nots[0].iSlotCategory == 1 && nots[0].mapItem.size() == 1, "category 1 group (sorted)");
    CHECK(nots[1].iSlotCategory == 2 && nots[1].mapItem.size() == 2, "category 2 group (sorted)");
    CHECK(ack.iOK == NET_OK && !ack.bIsRecommend, "ack iOK=NET_OK, bIsRecommend=false (V2 no recommend state)");

    // 空背包 → 0 個 NOT，直接 ACK（原版亦對空 category 不送）
    std::map<int64_t, unit::InventoryItemInfo> empty;
    GetMyInventoryAck ack2;
    std::vector<SelectUnitInventoryInfoNot> nots2;
    size_t n2 = HandleGetMyInventoryReq(empty, ack2, nots2);
    CHECK(n2 == 0 && nots2.empty() && ack2.iOK == NET_OK, "empty inventory -> ACK only");
}

// ---- loopback：CONNECT → VERIFY → SELECT_UNIT（雙庫聯動）----
static void TestSelectUnitLoopback()
{
#if !X2_PLATFORM_POSIX
    return;
#else
    const std::wstring kVersion = L"9.9.9-test";

    char acctTmpl[] = "/tmp/x2_select_acct_XXXXXX";
    int fd1 = mkstemp(acctTmpl);
    CHECK(fd1 >= 0, "mkstemp account db");
    if (fd1 < 0) return;
    ::close(fd1);
    ::unlink(acctTmpl);
    const std::string acctPath = acctTmpl;

    char gameTmpl[] = "/tmp/x2_select_game_XXXXXX";
    int fd2 = mkstemp(gameTmpl);
    CHECK(fd2 >= 0, "mkstemp game db");
    if (fd2 < 0) { ::unlink(acctPath.c_str()); return; }
    ::close(fd2);
    ::unlink(gameTmpl);
    const std::string gamePath = gameTmpl;

    int64_t loginUID = 0;
    int64_t unitUID = 0;
    int64_t otherUnitUID = 0;
    {
        Database acct;
        std::string err;
        CHECK(acct.Open(acctPath, err), "open account db for seeding");
        CHECK(ApplyMigrations(acct, err), "migrate account db");
        UserStore users(acct);
        CHECK(users.CreateUser("selectslice", "pw123!", "M", err), "seed account user");
        UserRecord rec;
        bool found = false;
        CHECK(users.FindUser("selectslice", rec, found, err) && found, "read loginUID");
        loginUID = rec.loginUID;
    }
    {
        Database game;
        std::string err;
        CHECK(game.Open(gamePath, err), "open game db for seeding");
        CHECK(ApplyGameMigrations(game, err), "migrate game db");
        GameStore store(game);
        GUserRecord gu;
        CHECK(store.GetOrCreateGUser(loginUID, "selectslice", gu, err), "seed guser");
        CHECK(store.CreateUnit(loginUID, "選擇切片", 2, unitUID, err) == CreateUnitResult::Ok, "seed unit");
        // 別人的角色（歸屬檢查用）
        GUserRecord gu2;
        CHECK(store.GetOrCreateGUser(999001, "otheraccount", gu2, err), "seed other guser");
        CHECK(store.CreateUnit(999001, "別人的角色", 1, otherUnitUID, err) == CreateUnitResult::Ok, "seed other unit");
    }

    uint16_t port = 0;
    {
        Socket probe;
        if (!Socket::CreateTcp(probe)) { ::unlink(acctPath.c_str()); ::unlink(gamePath.c_str()); CHECK(false, "probe socket"); return; }
        if (!probe.Bind(0) || !probe.LocalPort(port) || port == 0) { probe.Close(); ::unlink(acctPath.c_str()); ::unlink(gamePath.c_str()); CHECK(false, "probe port"); return; }
        probe.Close();
    }

    std::atomic<bool> serverOk{false};
    std::atomic<int64_t> seenUserUID{0};
    std::thread srvThread([&]() {
        Database acct;
        std::string err;
        if (!acct.Open(acctPath, err)) return;
        UserStore users(acct);
        Database game;
        if (!game.Open(gamePath, err)) return;
        GameStore gameStore(game);

        Session srv(PerformerID::PI_GS_SERVER);
        if (!srv.ListenAndAccept(port)) return;
        if (!srv.SendSecurityHandshake()) return;

        LoginConfig cfg;
        cfg.mainVersion = kVersion;
        cfg.udpPort = 6000;
        cfg.channelId = 4242;

        for (int i = 0; i < 7; ++i) {   // CONNECT, VERIFY, MY_UNIT_LIST, SELECT, GET_MY_INVENTORY, SELECT(foreign), SELECT(ghost)
            Event ev;
            if (srv.RecvEvent(ev, 5000) != Session::RecvResult::Event) break;
            Serializer ks;
            if (ev.eventID == kConnectReqID) {
                if (!ks.BeginReading(&ev.payload)) return;
                ConnectReq req;
                if (!GetConnectReq(ks, req)) return;
                ks.EndReading();
                ConnectAck ack;
                LoginArbiter::HandleConnectReq(req, ack, cfg);
                SerBuffer payload = PutPayload([&ack](Serializer& s) { return PutConnectAck(s, ack); });
                if (!srv.SendEvent(MakeEvent(kConnectAckID, payload))) return;
            } else if (ev.eventID == kVerifyReqID) {
                if (!ks.BeginReading(&ev.payload)) return;
                VerifyAccountReq req;
                if (!GetVerifyAccountReq(ks, req)) return;
                ks.EndReading();
                VerifyAccountAck ack;
                LoginArbiter::HandleVerifyAccountReq(users, req, "127.0.0.1", ack);
                seenUserUID = ack.accountInfo.userUID;
                SerBuffer payload = PutPayload([&ack](Serializer& s) { return PutVerifyAccountAck(s, ack); });
                if (!srv.SendEvent(MakeEvent(kVerifyAckID, payload))) return;
            } else if (ev.eventID == kSelectUnitReqID) {
                if (!ks.BeginReading(&ev.payload)) return;
                SelectUnitReq req;
                if (!GetSelectUnitReq(ks, req)) return;
                ks.EndReading();
                SelectUnitAck ack;
                SelectUnitNot1 not1;
                SelectUnitNot2 not2;
                SelectUnitNot3 not3;
                SelectUnitNot4 not4;
                SelectUnitNot5 not5;
                HandleSelectUnitReq(gameStore, seenUserUID.load(), req, ack, err, true, nullptr, &not1, 5, &not2, &not3, &not4, &not5);
                if (ack.iOK == NET_OK) {
                    SerBuffer p1 = PutPayload([&not1](Serializer& s2) { return PutSelectUnitNot1(s2, not1); });
                    if (!srv.SendEvent(MakeEvent(kSelectUnit1NotID, p1))) return;
                    SerBuffer p2 = PutPayload([&not2](Serializer& s2) { return PutSelectUnitNot2(s2, not2); });
                    if (!srv.SendEvent(MakeEvent(kSelectUnit2NotID, p2))) return;
                    SerBuffer p3 = PutPayload([&not3](Serializer& s2) { return PutSelectUnitNot3(s2, not3); });
                    if (!srv.SendEvent(MakeEvent(kSelectUnit3NotID, p3))) return;
                    SerBuffer p4 = PutPayload([&not4](Serializer& s2) { return PutSelectUnitNot4(s2, not4); });
                    if (!srv.SendEvent(MakeEvent(kSelectUnit4NotID, p4))) return;
                    SerBuffer p5 = PutPayload([&not5](Serializer& s2) { return PutSelectUnitNot5(s2, not5); });
                    if (!srv.SendEvent(MakeEvent(kSelectUnit5NotID, p5))) return;
                }
                SerBuffer payload = PutPayload([&ack](Serializer& s) { return PutSelectUnitAck(s, ack); });
                if (!srv.SendEvent(MakeEvent(kSelectUnitAckID, payload))) return;
            } else if (ev.eventID == kMyUnitListReqID) {
                // EGS_MY_UNIT_AND_INVENTORY_INFO_LIST_REQ：真實資料來源為 game DB guser/gunit（此迴路即連真實 mkstemp 庫）
                unit_list::MyUnitAndInventoryInfoListAck ulAck;
                std::string ulErr;
                if (!HandleMyUnitAndInventoryInfoListReq(gameStore, seenUserUID.load(), "selectslice", 5, ulAck, ulErr)) {
                    ulAck = unit_list::MyUnitAndInventoryInfoListAck{};
                    ulAck.iOK = ERR_SELECT_UNIT_05;   // DB 錯誤（誠實失敗）
                }
                SerBuffer ulPayload = PutPayload([&ulAck](Serializer& s2) { return unit_list::PutMyUnitAndInventoryInfoListAck(s2, ulAck); });
                if (!srv.SendEvent(MakeEvent(kMyUnitListAckID, ulPayload))) return;
            } else if (ev.eventID == kGetMyInventoryReqID) {
                // V2 無背包 DB 表：注入合成背包（僅測試線路分片；非真實角色資料）
                std::map<int64_t, unit::InventoryItemInfo> synthetic;
                auto mkSyn = [](int64_t uid, int32_t cat, int32_t slot, int32_t id) {
                    unit::InventoryItemInfo ii;
                    ii.itemUID = uid; ii.slotCategory = cat; ii.slotID = slot;
                    ii.itemInfo.itemID = id; ii.itemInfo.quantity = 1;
                    return ii;
                };
                synthetic[0x5000] = mkSyn(0x5000, 1, 0, 1001);
                synthetic[0x5001] = mkSyn(0x5001, 1, 1, 1002);
                synthetic[0x5002] = mkSyn(0x5002, 2, 0, 2001);
                GetMyInventoryAck invAck;
                std::vector<SelectUnitInventoryInfoNot> nots;
                HandleGetMyInventoryReq(synthetic, invAck, nots);
                for (const auto& one : nots) {
                    SerBuffer p = PutPayload([&one](Serializer& s2) { return PutSelectUnitInventoryInfoNot(s2, one); });
                    if (!srv.SendEvent(MakeEvent(kInventoryInfoNotID, p))) return;
                }
                SerBuffer invPayload = PutPayload([&invAck](Serializer& s2) { return PutGetMyInventoryAck(s2, invAck); });
                if (!srv.SendEvent(MakeEvent(kGetMyInventoryAckID, invPayload))) return;
            }
        }
        serverOk = true;
    });

    std::this_thread::sleep_for(std::chrono::milliseconds(200));
    Session client(PerformerID::PI_GS_USER);
    CHECK(client.Connect("127.0.0.1", port), "client connect");
    Event hs;
    CHECK(client.RecvEvent(hs, 5000) == Session::RecvResult::Handshake, "handshake completes");

    // CONNECT_REQ
    {
        ConnectReq req;
        req.version = kVersion;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return PutConnectReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kConnectReqID, payload)), "connect req sent");
        Event ackEv;
        CHECK(client.RecvEvent(ackEv, 5000) == Session::RecvResult::Event, "connect ack received");
        ConnectAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload), "read connect ack");
        CHECK(GetConnectAck(ks, ack), "decode connect ack");
        ks.EndReading();
        CHECK(ack.iOK == NET_OK, "connect accepted");
    }

    // VERIFY_ACCOUNT_REQ（正確密碼）
    {
        VerifyAccountReq req;
        req.userID = L"selectslice";
        req.passwd = L"pw123!";
        req.channelRandomKey = 0x0BADCAFE;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return PutVerifyAccountReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kVerifyReqID, payload)), "verify req sent");
        Event ackEv;
        CHECK(client.RecvEvent(ackEv, 5000) == Session::RecvResult::Event, "verify ack received");
        VerifyAccountAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload), "read verify ack");
        CHECK(GetVerifyAccountAck(ks, ack), "decode verify ack");
        ks.EndReading();
        CHECK(ack.iOK == NET_OK, "verify accepted");
        CHECK(ack.accountInfo.userUID == loginUID, "account userUID == seeded LoginUID");
        // EGS_MY_UNIT_AND_INVENTORY_INFO_LIST_REQ（NOPARAM）→ ACK（iOK/nUnitSlot/vecUnitInfo）
        {
            CHECK(client.SendEvent(MakeEvent(kMyUnitListReqID, SerBuffer{})), "my unit list req sent");
            Event ulAckEv;
            CHECK(client.RecvEvent(ulAckEv, 5000) == Session::RecvResult::Event, "my unit list ack received");
            CHECK(ulAckEv.eventID == kMyUnitListAckID, "my unit list ack id == 35");
            unit_list::MyUnitAndInventoryInfoListAck ulAck;
            Serializer ksUl;
            CHECK(ksUl.BeginReading(&ulAckEv.payload), "read my unit list ack");
            CHECK(unit_list::GetMyUnitAndInventoryInfoListAck(ksUl, ulAck), "decode my unit list ack");
            ksUl.EndReading();
            CHECK(ulAck.iOK == NET_OK && ulAck.nUnitSlot == 50, "my unit list ack NET_OK, USSize 50");
            CHECK(ulAck.vecUnitInfo.size() == 1 && ulAck.vecUnitInfo[0].unitUID == unitUID &&
                  ulAck.vecUnitInfo[0].nickName == L"選擇切片", "my unit list ack carries seeded unit");
        }
    }

    // SELECT_UNIT_REQ #1：自己的角色 → NET_OK
    {
        SelectUnitReq req;
        req.unitUID = unitUID;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return PutSelectUnitReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kSelectUnitReqID, payload)), "select unit req (own) sent");
        // 先收 1_NOT（角色本體分片），再收收尾 ACK（原版 SendSelectUnitACK 次序：1_NOT…5_NOT → ACK）
        Event notEv;
        CHECK(client.RecvEvent(notEv, 5000) == Session::RecvResult::Event, "select 1_NOT received");
        CHECK(notEv.eventID == kSelectUnit1NotID, "select 1_NOT id == 42");
        SelectUnitNot1 not1;
        Serializer ksNot;
        CHECK(ksNot.BeginReading(&notEv.payload), "read 1_NOT");
        CHECK(GetSelectUnitNot1(ksNot, not1), "decode 1_NOT");
        ksNot.EndReading();
        CHECK(not1.iOK == NET_OK && not1.unitInfo.unitUID == unitUID && not1.unitInfo.nickName == L"選擇切片", "1_NOT carries selected unit");
        Event not2Ev;
        CHECK(client.RecvEvent(not2Ev, 5000) == Session::RecvResult::Event, "select 2_NOT received");
        CHECK(not2Ev.eventID == kSelectUnit2NotID, "select 2_NOT id == 43");
        SelectUnitNot2 not2;
        Serializer ksNot2;
        CHECK(ksNot2.BeginReading(&not2Ev.payload), "read 2_NOT");
        CHECK(GetSelectUnitNot2(ksNot2, not2), "decode 2_NOT");
        ksNot2.EndReading();
        CHECK(not2.iOK == NET_OK, "2_NOT iOK");
        Event not3Ev;
        CHECK(client.RecvEvent(not3Ev, 5000) == Session::RecvResult::Event, "select 3_NOT received");
        CHECK(not3Ev.eventID == kSelectUnit3NotID, "select 3_NOT id == 44");
        SelectUnitNot3 not3;
        Serializer ksNot3;
        CHECK(ksNot3.BeginReading(&not3Ev.payload), "read 3_NOT");
        CHECK(GetSelectUnitNot3(ksNot3, not3), "decode 3_NOT");
        ksNot3.EndReading();
        CHECK(not3.iOK == NET_OK, "3_NOT iOK");
        Event not4Ev;
        CHECK(client.RecvEvent(not4Ev, 5000) == Session::RecvResult::Event, "select 4_NOT received");
        CHECK(not4Ev.eventID == kSelectUnit4NotID, "select 4_NOT id == 45");
        SelectUnitNot4 not4;
        Serializer ksNot4;
        CHECK(ksNot4.BeginReading(&not4Ev.payload), "read 4_NOT");
        CHECK(GetSelectUnitNot4(ksNot4, not4), "decode 4_NOT");
        ksNot4.EndReading();
        CHECK(not4.iOK == NET_OK, "4_NOT iOK");
        Event not5Ev;
        CHECK(client.RecvEvent(not5Ev, 5000) == Session::RecvResult::Event, "select 5_NOT received");
        CHECK(not5Ev.eventID == kSelectUnit5NotID, "select 5_NOT id == 46");
        SelectUnitNot5 not5;
        Serializer ksNot5;
        CHECK(ksNot5.BeginReading(&not5Ev.payload), "read 5_NOT");
        CHECK(GetSelectUnitNot5(ksNot5, not5), "decode 5_NOT");
        ksNot5.EndReading();
        CHECK(not5.iOK == NET_OK, "5_NOT iOK");
        Event ackEv;
        CHECK(client.RecvEvent(ackEv, 5000) == Session::RecvResult::Event, "select ack (own) received");
        CHECK(ackEv.eventID == kSelectUnitAckID, "select ack (own) id");
        SelectUnitAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload), "read select ack");
        CHECK(GetSelectUnitAck(ks, ack), "decode select ack");
        ks.EndReading();
        CHECK(ack.iOK == NET_OK, "own unit select -> NET_OK");
        // EGS_GET_MY_INVENTORY_REQ（NOPARAM，空 payload）→ 依 category 分片 NOT ×2 → ACK
        CHECK(client.SendEvent(MakeEvent(kGetMyInventoryReqID, SerBuffer{})), "get my inventory req sent");
        for (int expectCat = 1; expectCat <= 2; ++expectCat) {
            Event invEv;
            CHECK(client.RecvEvent(invEv, 5000) == Session::RecvResult::Event, "inventory info not received");
            CHECK(invEv.eventID == kInventoryInfoNotID, "inventory info not id == 49");
            SelectUnitInventoryInfoNot invNot;
            Serializer ksInv;
            CHECK(ksInv.BeginReading(&invEv.payload), "read inventory info not");
            CHECK(GetSelectUnitInventoryInfoNot(ksInv, invNot), "decode inventory info not");
            ksInv.EndReading();
            CHECK(invNot.iSlotCategory == expectCat, "inventory info not category ascending");
        }
        {
            Event invAckEv;
            CHECK(client.RecvEvent(invAckEv, 5000) == Session::RecvResult::Event, "get my inventory ack received");
            CHECK(invAckEv.eventID == kGetMyInventoryAckID, "get my inventory ack id == 48");
            GetMyInventoryAck invAck;
            Serializer ksInvAck;
            CHECK(ksInvAck.BeginReading(&invAckEv.payload), "read get my inventory ack");
            CHECK(GetGetMyInventoryAck(ksInvAck, invAck), "decode get my inventory ack");
            ksInvAck.EndReading();
            CHECK(invAck.iOK == NET_OK && !invAck.bIsRecommend, "get my inventory ack NET_OK, bIsRecommend=false");
        }
    }

    // SELECT_UNIT_REQ #2：別人的角色 → ERR_SELECT_UNIT_07
    {
        SelectUnitReq req;
        req.unitUID = otherUnitUID;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return PutSelectUnitReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kSelectUnitReqID, payload)), "select unit req (foreign) sent");
        Event ackEv;
        CHECK(client.RecvEvent(ackEv, 5000) == Session::RecvResult::Event, "select ack (foreign) received");
        SelectUnitAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload), "read foreign ack");
        CHECK(GetSelectUnitAck(ks, ack), "decode foreign ack");
        ks.EndReading();
        CHECK(ack.iOK == ERR_SELECT_UNIT_07, "foreign unit -> ERR_SELECT_UNIT_07");
    }

    // SELECT_UNIT_REQ #3：不存在 → ERR_SELECT_UNIT_00
    {
        SelectUnitReq req;
        req.unitUID = 0x7FFFFFFF00000001LL;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return PutSelectUnitReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kSelectUnitReqID, payload)), "select unit req (ghost) sent");
        Event ackEv;
        CHECK(client.RecvEvent(ackEv, 5000) == Session::RecvResult::Event, "select ack (ghost) received");
        SelectUnitAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload), "read ghost ack");
        CHECK(GetSelectUnitAck(ks, ack), "decode ghost ack");
        ks.EndReading();
        CHECK(ack.iOK == ERR_SELECT_UNIT_00, "unknown unit -> ERR_SELECT_UNIT_00");
    }

    client.Close();
    srvThread.join();
    CHECK(serverOk.load(), "server completed the flow");

    // game DB 副作用：只有成功選擇應 +1 次 LoginCount
    {
        Database game;
        std::string err;
        CHECK(game.Open(gamePath, err), "reopen game db");
        GameStore store(game);
        bool found = false;
        GUnitRecord u;
        CHECK(store.GetUnitByUID(unitUID, u, found, err) && found, "unit found after flow");
        CHECK(u.loginCount == 1, "successful select incremented loginCount exactly once");
    }
    ::unlink(acctPath.c_str());
    ::unlink(gamePath.c_str());
#endif
}

void RunSelectUnitTestsByRef(int& pass, int& fail)
{
    TestSelectUnitCodec();
    TestSelectUnitNot1Codec();
    TestBuildSelectUnitNot1FromGUnit();
    TestSelectUnitNot2Codec();
    TestBuildSelectUnitNot2Defaults();
    TestSelectUnitNot3Codec();
    TestBuildSelectUnitNot3Defaults();
    TestSelectUnitNot4Codec();
    TestBuildSelectUnitNot4Defaults();
    TestSelectUnitNot5Codec();
    TestBuildSelectUnitNot5Defaults();
    TestGetMyInventoryCodec();
    TestHandleGetMyInventoryReqGroupsByCategory();
    TestUnitSelectArbiterDecisions();
    TestSelectUnitLoopback();
    pass += g_pass_sel;
    fail += g_fail_sel;
}
