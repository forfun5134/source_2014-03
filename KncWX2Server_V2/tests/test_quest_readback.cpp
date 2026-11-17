// tests/test_quest_readback.cpp — SELECT_UNIT_2_NOT 任務資料讀回（§0a11；gup_get_quest_list／SERV_DAILY_QUEST 分支）
// 對照原 DBE_SELECT_UNIT_REQ → Query_SelectUnit 的任務段（GSGameDBThread.cpp:1716–1823）：
//   1) vecQuest ← gup_get_quest_list（SERV_ALL_RENEWAL_SP 未定義 → 本建置實際路徑）：SELECT QuestID, SubQuest0..4 FROM GQuests
//      → KQuestInstance{ m_iID=QuestID, m_OwnorUnitUID=req.m_iUnitUID, 5×KSubQuestInstance{ m_iID=0, m_bIsSuccess=false, m_ucClearData=SubQuestN } }
//   2) vecCompletQuest ← SERV_DAILY_QUEST 分支：gup_get_quest_complete_list（GQuests_Complete）先 ∪ gup_get_quest_Repeat_complete_list（GQuests_Repeat）後；
//      KCompleteQuestInfo{ m_iQuestID, m_iCompleteCount=1, m_tCompleteDate ← ConvertStringToCTime(wstrCompleteDate) }
//   3) mapRandomQuestList：SiCXSLQuestManager（script）→ 無資料源 → 空 map
// ⚠ 倉庫內 gup_get_quest_complete_list 僅 SELECT QuestID，與 SERV_DAILY_QUEST call site（QuestID + wstrCompleteDate）不一致——
//   倉庫 proc 疑似過期；V2 以表結構（QuestID/RegDate/CompleteDate）＋ call site 為準，含 CompleteDate（見 docs §0a11 偏差聲明）。
// ⚠ m_tCompleteDate：原以伺服器本地時區將 smalldatetime 字串轉為 time_t；V2 一律 UTC 解析（docs §0a11 偏差聲明）。
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>

#include "../src/core/NetError.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/UnitSelectArbiter.h"
#include "../src/server/SelectUnitProtocol.h"
#include "../src/server/CreateUnitProtocol.h"

using namespace x2;
using namespace x2::db;
using namespace x2::select_unit;
using namespace x2::create_unit;

void RunQuestReadbackTestsByRef(int& pass, int& fail);
static int g_pass_qr = 0, g_fail_qr = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_qr++; } \
    else { g_fail_qr++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

struct Fixture
{
    Database db;
    std::string err;
    Fixture()
    {
        if (!db.Open(":memory:", err)) return;
        ApplyGameMigrations(db, err);
    }
};

static int64_t CreateUnitOk(GameStore& store, int64_t userUID, const wchar_t* nick, int unitClass)
{
    CreateUnitReq req; req.iClass = unitClass; req.wstrNickName = nick;
    CreateUnitAck ack;
    std::string err;
    if (!HandleCreateUnitReq(store, userUID, /*authLevel=*/5, req, ack, err)) return -1;
    if (ack.iOK != NET_OK) return -2;
    return ack.kUnitInfo.unitUID;
}

static bool SelectNot2(GameStore& store, int64_t userUID, int64_t unitUID, SelectUnitNot2* not2)
{
    SelectUnitReq req; req.unitUID = unitUID;
    SelectUnitAck ack;
    std::string err;
    int rc = HandleSelectUnitReq(store, userUID, req, ack, err, /*secondSecurityOk=*/true,
                                 /*outUnit=*/nullptr, /*outNot1=*/nullptr, /*authLevel=*/5,
                                 not2, /*outNot3=*/nullptr, /*outNot4=*/nullptr, /*outNot5=*/nullptr);
    return rc == NET_OK && ack.iOK == NET_OK;
}

static void TestSchemaV5()
{
    Fixture fx;
    int v = fx.db.UserVersion(fx.err);
    CHECK(v == kGameSchemaVersion && kGameSchemaVersion == 8, "schema v8 (user_version == 8; gquests_* created at v5)");
    CHECK(fx.db.Exec("SELECT 1 FROM gquests_complete LIMIT 0;", fx.err), "gquests_complete table exists");
    CHECK(fx.db.Exec("SELECT 1 FROM gquests_repeat LIMIT 0;", fx.err), "gquests_repeat table exists");
    // PK：gquests_complete PK(UnitUID, QuestID)——需要一個真實 unit（FK 啟用）
    GameStore store(fx.db);
    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(777, "qr_schema", gu, fx.err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"qr.schema", 1);
    CHECK(uid > 0, "unit created");
    CHECK(fx.db.Exec("INSERT INTO gquests_complete (UnitUID, QuestID) VALUES (" + std::to_string(uid) + ", 9001);", fx.err), "seed complete row");
    std::string err2;
    CHECK(!fx.db.Exec("INSERT INTO gquests_complete (UnitUID, QuestID) VALUES (" + std::to_string(uid) + ", 9001);", err2), "complete PK rejects duplicate (UnitUID, QuestID)");
}

static void TestGetQuestList()
{
    Fixture fx;
    GameStore store(fx.db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "qr_list", gu, err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"qr.list", 1);
    CHECK(uid > 0, "unit created");

    // 建角副作用（§0a5）插入 QuestID=13、SubQuest0=1
    {
        std::vector<QuestRecord> quests;
        CHECK(store.GetQuestList(uid, quests, err), "quest list readable");
        CHECK(quests.size() == 1 && quests[0].questID == 13, "one quest (13) after create");
        CHECK(quests[0].sub[0] == 1 && quests[0].sub[1] == 0 && quests[0].sub[2] == 0 &&
              quests[0].sub[3] == 0 && quests[0].sub[4] == 0, "SubQuest0=1, rest 0");
    }
    // 再加一筆（模擬任務系統寫入——直接 SQL）
    CHECK(fx.db.Exec("INSERT INTO gquests (UnitUID, QuestID, SubQuest0, SubQuest1) VALUES (" + std::to_string(uid) + ", 42, 3, 2);", err), "insert quest 42");
    {
        std::vector<QuestRecord> quests;
        CHECK(store.GetQuestList(uid, quests, err), "quest list readable 2");
        CHECK(quests.size() == 2 && quests[0].questID == 13 && quests[1].questID == 42, "ordered by QuestID");
        CHECK(quests[1].sub[0] == 3 && quests[1].sub[1] == 2, "quest 42 sub values");
    }
    // 不存在 unitUID → 空列表、非錯誤（原 proc 不檢查 unit）
    {
        std::vector<QuestRecord> quests;
        CHECK(store.GetQuestList(0x7FFFFFFF00000005LL, quests, err), "nonexistent unit -> true");
        CHECK(quests.empty(), "nonexistent unit -> empty list");
    }
    // 表損壞（DROP TABLE）→ false + err
    {
        std::string err2;
        CHECK(fx.db.Exec("DROP TABLE gquests;", err2), "drop gquests");
        std::vector<QuestRecord> quests;
        CHECK(!store.GetQuestList(uid, quests, err2), "missing table -> false");
        CHECK(!err2.empty(), "err recorded");
    }
}

static void TestGetQuestCompleteList()
{
    Fixture fx;
    GameStore store(fx.db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "qr_complete", gu, err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"qr.complete", 1);
    CHECK(uid > 0, "unit created");

    // 空 → true, 0 筆
    {
        std::vector<QuestCompleteRecord> cc;
        CHECK(store.GetQuestCompleteList(uid, cc, err), "empty complete list ok");
        CHECK(cc.empty(), "empty complete list");
    }
    // GQuests_Complete 先、GQuests_Repeat 後（鏡像原 call site 順序）；重複 QuestID 各一筆
    CHECK(fx.db.Exec(
        "INSERT INTO gquests_complete (UnitUID, QuestID, RegDate, CompleteDate) VALUES "
        "(" + std::to_string(uid) + ", 13, '1999-12-31 00:00:00', '2000-01-01 00:00:00');", err), "seed complete 13");
    CHECK(fx.db.Exec(
        "INSERT INTO gquests_repeat (UnitUID, QuestID, RegDate, CompleteDate) VALUES "
        "(" + std::to_string(uid) + ", 13, '2000-06-01 00:00:00', '2000-06-02 00:00:00'),"
        "(" + std::to_string(uid) + ", 17, '2000-06-01 00:00:00', '2001-02-03 04:05:06');", err), "seed repeats");
    {
        std::vector<QuestCompleteRecord> cc;
        CHECK(store.GetQuestCompleteList(uid, cc, err), "complete list readable");
        CHECK(cc.size() == 3, "union of complete + repeat");
        CHECK(cc[0].questID == 13 && cc[0].completeDateEpoch == 946684800, "complete first: 2000-01-01 = 946684800");
        CHECK(cc[1].questID == 13 && cc[1].completeDateEpoch == 959904000, "repeat row: 2000-06-02 = 959904000");
        CHECK(cc[2].questID == 17 && cc[2].completeDateEpoch == 981173106, "repeat row: 2001-02-03 04:05:06 = 981173106");
    }
    // CompleteDate 損壞 → false + err（不回傳部分資料）
    CHECK(fx.db.Exec("UPDATE gquests_repeat SET CompleteDate = 'not-a-date' WHERE QuestID = 17;", err), "corrupt CompleteDate");
    {
        std::vector<QuestCompleteRecord> cc;
        CHECK(!store.GetQuestCompleteList(uid, cc, err), "bad CompleteDate -> false");
        CHECK(!err.empty(), "err recorded");
    }
}

static void TestNot2Integration()
{
    Fixture fx;
    GameStore store(fx.db);
    GUserRecord gu;
    std::string err;
    CHECK(store.GetOrCreateGUser(777, "qr_not2", gu, err), "guser ok");
    const int64_t uid = CreateUnitOk(store, 777, L"qr.not2", 1);
    CHECK(uid > 0, "unit created");

    // 建角後 Not2：1 個進行中任務（13/SubQuest0=1）、0 個完成任務、空 random map
    {
        SelectUnitNot2 not2{};
        CHECK(SelectNot2(store, 777, uid, &not2), "select ok");
        CHECK(not2.vecQuest.size() == 1 && not2.vecQuest[0].iID == 13 && not2.vecQuest[0].ownerUnitUID == uid,
              "not2 vecQuest from gquests");
        CHECK(not2.vecQuest[0].subQuests.size() == 5 && not2.vecQuest[0].subQuests[0].ucClearData == 1 &&
              not2.vecQuest[0].subQuests[0].iID == 0 && not2.vecQuest[0].subQuests[0].bIsSuccess == false,
              "not2 subquests (ucClearData only)");
        CHECK(not2.vecCompletQuest.empty() && not2.mapRandomQuestList.empty(),
              "not2: no completions yet; random map empty (no script source)");
    }
    // 種入完成任務 → Not2 反映（completeCount=1）
    CHECK(fx.db.Exec(
        "INSERT INTO gquests_complete (UnitUID, QuestID, RegDate, CompleteDate) VALUES "
        "(" + std::to_string(uid) + ", 13, '1999-12-31 00:00:00', '2000-01-01 00:00:00');", err), "seed complete");
    {
        SelectUnitNot2 not2{};
        CHECK(SelectNot2(store, 777, uid, &not2), "select ok 2");
        CHECK(not2.vecCompletQuest.size() == 1 && not2.vecCompletQuest[0].questID == 13 &&
              not2.vecCompletQuest[0].completeCount == 1 && not2.vecCompletQuest[0].completeDate == 946684800,
              "not2 vecCompletQuest reflects gquests_complete");
    }
    // 歸屬錯誤 → 不建 Not2
    {
        SelectUnitReq req; req.unitUID = uid;
        SelectUnitAck ack;
        SelectUnitNot2 not2{};
        std::string err2;
        int rc = HandleSelectUnitReq(store, /*userUID=*/888, req, ack, err2, true,
                                     nullptr, nullptr, 5, &not2, nullptr, nullptr, nullptr);
        CHECK(rc == ERR_SELECT_UNIT_07, "foreign select rejected");
    }
}

void RunQuestReadbackTestsByRef(int& pass, int& fail)
{
    TestSchemaV5();
    TestGetQuestList();
    TestGetQuestCompleteList();
    TestNot2Integration();
    pass += g_pass_qr;
    fail += g_fail_qr;
}
