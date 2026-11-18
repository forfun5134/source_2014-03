// tests/test_get_skill.cpp — EGS_GET_SKILL_REQ/ACK（§0a26）
// 原版：GSUserGameCommon.cpp:4337–4636 + GSGameDBThread.cpp DBE_INSERT_SKILL_REQ + GSUserGameCommon.cpp DBE_INSERT_SKILL_ACK。
#include <cstdio>
#include <cstring>
#include <functional>
#include <string>
#include <vector>

#include "../src/core/NetError.h"
#include "../src/core/SerBuffer.h"
#include "../src/core/Serializer.h"
#include "../src/core/EventIDs.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/GetSkillProtocol.h"
#include "../src/server/CreateUnitProtocol.h"

using namespace x2;
using namespace x2::db;
using namespace x2::get_skill;
using namespace x2::create_unit;

static int g_pass_get_skill = 0, g_fail_get_skill = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_get_skill++; } \
    else { g_fail_get_skill++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

struct Fixture
{
    Database db;
    GameStore store;
    std::string err;
    Fixture() : store(db)
    {
        if (!db.Open(":memory:", err)) return;
        ApplyGameMigrations(db, err);
    }
    int64_t MakeUnit(int64_t userUID, const wchar_t* nick, int unitClass = 1)
    {
        char id[32]; std::snprintf(id, sizeof id, "gs_%lld", static_cast<long long>(userUID));
        GUserRecord gu;
        if (!store.GetOrCreateGUser(userUID, id, gu, err)) return -1;
        (void)nick;
        int64_t uid = 0;
        const std::string unitNick = std::string("getskill_") + std::to_string(userUID);
        if (store.CreateUnit(userUID, unitNick, unitClass, uid, err) != CreateUnitResult::Ok) return -1;
        return SeedSkill(uid, 10000, 1, 1, 0) ? uid : -1;
    }
    bool SeedCash(int64_t uid, int32_t csp, int32_t maxCsp)
    {
        Statement st;
        if (!st.Prepare(db, "INSERT INTO gskillcash (UnitUID, CSPoint, MaxCSPoint) VALUES (?, ?, ?) "
                            "ON CONFLICT(UnitUID) DO UPDATE SET CSPoint=excluded.CSPoint, MaxCSPoint=excluded.MaxCSPoint;", err)) return false;
        if (!st.BindInt(1, uid, err) || !st.BindInt(2, csp, err) || !st.BindInt(3, maxCsp, err)) return false;
        std::string se;
        return !st.StepRow(se) && se.empty();
    }
    bool SetSPoint(int64_t uid, int32_t sp)
    {
        Statement st;
        if (!st.Prepare(db, "UPDATE gunit SET SPoint=? WHERE UnitUID=?;", err) ||
            !st.BindInt(1, sp, err) || !st.BindInt(2, uid, err)) return false;
        std::string se;
        return !st.StepRow(se) && se.empty();
    }
    bool SeedSkill(int64_t uid, int32_t id, int32_t level, int32_t page, int32_t csp)
    {
        Statement st;
        if (!st.Prepare(db, "INSERT INTO gskill (UnitUID, SkillID, SkillLevel, SkillPageNumber, SkillCSPoint) VALUES (?, ?, ?, ?, ?);", err) ||
            !st.BindInt(1, uid, err) || !st.BindInt(2, id, err) || !st.BindInt(3, level, err) ||
            !st.BindInt(4, page, err) || !st.BindInt(5, csp, err)) return false;
        std::string se;
        return !st.StepRow(se) && se.empty();
    }
    int32_t Scalar(const char* sql, int64_t a, int64_t b = 0)
    {
        Statement st; std::string e;
        if (!st.Prepare(db, sql, e) || !st.BindInt(1, a, e)) return -999999;
        if (b != 0 && !st.BindInt(2, b, e)) return -999999;
        std::string se;
        if (!st.StepRow(se)) return -999999;
        return static_cast<int32_t>(st.ColumnInt64(0));
    }
    bool InjectFailure(const char* table)
    {
        const std::string name = std::string("getskill_fail_") + table;
        return db.Exec("CREATE TRIGGER " + name + "_i BEFORE INSERT ON " + table + " BEGIN SELECT RAISE(ABORT, 'injected'); END;", err) &&
               db.Exec("CREATE TRIGGER " + name + "_u BEFORE UPDATE ON " + table + " BEGIN SELECT RAISE(ABORT, 'injected'); END;", err);
    }
};

static SerBuffer Payload(const std::function<bool(Serializer&)>& put)
{
    SerBuffer b; Serializer s;
    if (!s.BeginWriting(&b) || !put(s)) return SerBuffer{};
    s.EndWriting(); return b;
}

static GetSkillReq One(int32_t key, int32_t level, int32_t before = 0, int32_t spend = 0, int32_t page = 1)
{
    GetSkillReq req; req.iActiveSkillPageNumber = page;
    GetSkillInfo i; i.iSkillID = key; i.iBeforeSkillLevel = before; i.iSkillLevel = level; i.iSpendSkillCSPoint = spend;
    req.mapSkillList[key] = i;
    return req;
}

static GetSkillAck DoReq(Fixture& fx, int64_t uid, const GetSkillReq& req)
{
    GetSkillAck ack; std::string e;
    HandleGetSkillReq(fx.store, uid, req, ack, e);
    fx.err = e;
    return ack;
}

static void TestCodecGoldenAndRoundtrip()
{
    GetSkillReq req = One(0x01020304, 3, 2, 4, 5);
#if defined(X2_REGION_JP)
    req.vecNowLearnSkill = {0x21222324};
#endif
    SerBuffer b = Payload([&](Serializer& s) { return PutGetSkillReq(s, req); });
    const unsigned char jp[] = {0,0,0,1,0x21,0x22,0x23,0x24, 0,0,0,5, 0,0,0,1,
        1,2,3,4, 1,2,3,4, 0,0,0,2, 0,0,0,3, 0,0,0,4};
#if !defined(X2_REGION_JP)
    const unsigned char other[] = {0,0,0,5, 0,0,0,1, 1,2,3,4, 1,2,3,4,
        0,0,0,2, 0,0,0,3, 0,0,0,4};
#endif
#if defined(X2_REGION_JP)
    CHECK(b.GetLength() == sizeof jp && std::memcmp(b.GetData(), jp, sizeof jp) == 0, "REQ golden (JP vector, page, tagged-compatible map pairs)");
#else
    CHECK(b.GetLength() == sizeof other && std::memcmp(b.GetData(), other, sizeof other) == 0, "REQ golden (page, map; non-JP has no quest vector)");
#endif
    GetSkillReq back; Serializer r;
    CHECK(r.BeginReading(&b) && GetGetSkillReq(r, back), "REQ parse"); r.EndReading();
    CHECK(back.iActiveSkillPageNumber == 5 && back.mapSkillList.size() == 1 && back.mapSkillList[0x01020304].iSkillLevel == 3 &&
          back.mapSkillList[0x01020304].iSpendSkillCSPoint == 4, "REQ roundtrip");
#if defined(X2_REGION_JP)
    CHECK(back.vecNowLearnSkill == req.vecNowLearnSkill, "JP quest vector roundtrip");
#else
    CHECK(back.vecNowLearnSkill.empty(), "non-JP quest vector omitted");
#endif

    GetSkillAck ack; ack.iOK = 1; ack.iActiveSkillPageNumber = 2; ack.iRemainSP = 8; ack.iRemainCSP = -2;
    GetSkillInfo info; info.iSkillID = 4; info.iBeforeSkillLevel = 5; info.iSkillLevel = 6; info.iSpendSkillCSPoint = 7;
    ack.mapSkillList[3] = info;
    b = Payload([&](Serializer& s) { return PutGetSkillAck(s, ack); });
    const unsigned char expected[] = {0,0,0,1, 0,0,0,2, 0,0,0,1, 0,0,0,3,
        0,0,0,4, 0,0,0,5, 0,0,0,6, 0,0,0,7, 0,0,0,8, 0xff,0xff,0xff,0xfe};
    CHECK(b.GetLength() == sizeof expected && std::memcmp(b.GetData(), expected, sizeof expected) == 0, "ACK golden bytes");
    GetSkillAck ack2; Serializer r2;
    CHECK(r2.BeginReading(&b) && GetGetSkillAck(r2, ack2), "ACK parse"); r2.EndReading();
    CHECK(ack2.iOK == 1 && ack2.iActiveSkillPageNumber == 2 && ack2.mapSkillList[3].iBeforeSkillLevel == 5 &&
          ack2.iRemainSP == 8 && ack2.iRemainCSP == -2, "ACK roundtrip");
    CHECK(static_cast<uint16_t>(EventID::EGS_GET_SKILL_REQ) == 294 && static_cast<uint16_t>(EventID::EGS_GET_SKILL_ACK) == 295,
          "event ids 294/295");
    CHECK(ERR_SKILL_00 == 182 && ERR_SKILL_01 == 183 && ERR_SKILL_03 == 184 && ERR_SKILL_07 == 188 &&
          ERR_SKILL_09 == 190 && ERR_SKILL_10 == 191 && ERR_SKILL_13 == 193 && ERR_SKILL_14 == 194 &&
          ERR_SKILL_17 == 197 && ERR_SKILL_18 == 198 && ERR_SKILL_19 == 199 && ERR_SKILL_20 == 200 &&
          ERR_SKILL_21 == 201 && ERR_SKILL_24 == 204 && ERR_SKILL_29 == 1278 &&
          ERR_SKILL_PAGE_01 == 1387 && ERR_SKILL_PAGE_04 == 1386, "skill error codes are machine-read originals");
}

static void TestNewSkillAndUpgradeCommit()
{
    Fixture fx; int64_t uid = fx.MakeUnit(7101, L"getskill_a");
    CHECK(uid > 0, "create unit"); if (uid <= 0) return;
    CHECK(fx.SetSPoint(uid, 10), "set SP");
    CHECK(fx.SeedCash(uid, 1, 10), "seed active cash pool");
    GetSkillReq req = One(10000, 3, 1, 0);  // starter Lv1 -> Lv3, cost 2; 1 CSP then 1 SP
    GetSkillAck ack = DoReq(fx, uid, req);
    CHECK(ack.iOK == NET_OK && ack.iRemainSP == 9 && ack.iRemainCSP == 0, "upgrade spends total 2 (1 CSP + 1 SP)");
    CHECK(ack.mapSkillList.size() == 1 && ack.mapSkillList[10000].iSkillLevel == 3 &&
          ack.mapSkillList[10000].iSpendSkillCSPoint == 2, "original per-skill full cost + existing investment is persisted");
    CHECK(fx.Scalar("SELECT SkillLevel FROM gskill WHERE UnitUID=? AND SkillID=10000 AND SkillPageNumber=1;", uid) == 3 &&
          fx.Scalar("SELECT SkillCSPoint FROM gskill WHERE UnitUID=? AND SkillID=10000 AND SkillPageNumber=1;", uid) == 2,
          "upgrade gskill write-through");
    CHECK(fx.Scalar("SELECT CSPoint FROM gskillcash WHERE UnitUID=?;", uid) == 0, "cash pool debited");

    // A distinct skill id can be learned on a page where no such row exists.
    GetSkillReq learn = One(900001, 2, 0, 0);  // 1 learn + 1 upgrade = 2 SP
    learn.iActiveSkillPageNumber = 1;
    ack = DoReq(fx, uid, learn);
    CHECK(ack.iOK == NET_OK && ack.iRemainSP == 7 && ack.mapSkillList[900001].iSkillLevel == 2,
          "new skill learn plus upgrade cost");
    CHECK(fx.Scalar("SELECT SkillLevel FROM gskill WHERE UnitUID=? AND SkillID=900001 AND SkillPageNumber=1;", uid) == 2,
          "new gskill upsert");
}

static void TestErrorPaths()
{
    Fixture fx; int64_t uid = fx.MakeUnit(7102, L"getskill_b");
    CHECK(uid > 0, "create unit"); if (uid <= 0) return;
    GetSkillReq req; req.iActiveSkillPageNumber = 1;
    GetSkillAck ack = DoReq(fx, uid, req);
    CHECK(ack.iOK == ERR_SKILL_09 && ack.iActiveSkillPageNumber == 0 && ack.mapSkillList.empty(), "empty map -> ERR_SKILL_09 and validation ACK blank");
    req = One(10000, 2); req.iActiveSkillPageNumber = 2;
    ack = DoReq(fx, uid, req);
    CHECK(ack.iOK == ERR_SKILL_PAGE_01 && ack.iActiveSkillPageNumber == 0, "wrong active page -> ERR_SKILL_PAGE_01");
    req = One(0, 1);
    ack = DoReq(fx, uid, req);
    CHECK(ack.iOK == ERR_SKILL_01, "nonpositive skill ID -> ERR_SKILL_01");
    req = One(10000, 2); req.mapSkillList[10000].iSkillID = 900000;
    ack = DoReq(fx, uid, req);
    CHECK(ack.iOK == ERR_SKILL_01, "map key/value skill ID mismatch -> ERR_SKILL_01 (V2 integrity guard)");
    req = One(10000, 0);
    ack = DoReq(fx, uid, req);
    CHECK(ack.iOK == ERR_SKILL_17, "target level below one -> ERR_SKILL_17");
    req = One(10000, 0); req.iActiveSkillPageNumber = 1;
    CHECK(fx.SetSPoint(uid, 10), "set SP for decreasing-level validation");
    ack = DoReq(fx, uid, req);
    CHECK(ack.iOK == ERR_SKILL_17, "lower than learned level -> ERR_SKILL_17");
    CHECK(fx.SetSPoint(uid, 1), "restore SP");
    CHECK(fx.SeedCash(uid, 0, 10), "seed empty active cash pool");
    req = One(10000, 3);
    ack = DoReq(fx, uid, req);
    CHECK(ack.iOK == ERR_SKILL_18 && ack.mapSkillList.empty(), "insufficient SP/CSP -> ERR_SKILL_18");

    // Expired cash pool has no CSP; even positive gskillcash.CSPoint cannot be spent.
    CHECK(fx.SeedCash(uid, 5, 0), "seed expired cash pool");
    CHECK(fx.SetSPoint(uid, 0), "zero SP");
    req = One(10000, 2);
    ack = DoReq(fx, uid, req);
    CHECK(ack.iOK == ERR_SKILL_17, "expired cash and nonpositive SP -> ERR_SKILL_17");
}

static void TestCrossPageAndExpiredCspRetention()
{
    Fixture fx; int64_t uid = fx.MakeUnit(7103, L"getskill_c");
    CHECK(uid > 0, "create unit"); if (uid <= 0) return;
    CHECK(fx.SetSPoint(uid, 10), "set SP");
    CHECK(fx.SeedCash(uid, 0, 0), "seed expired pool");
    CHECK(fx.SeedSkill(uid, 900002, 1, 2, 0), "same skill can exist on page 2 (v15 PK)");
    GetSkillReq req = One(900002, 2, 1, 5);
    req.iActiveSkillPageNumber = 1;
    GetSkillAck ack = DoReq(fx, uid, req);
    CHECK(ack.iOK == NET_OK && ack.iRemainSP == 8, "expired pool uses SP cost only (new skill Lv2 costs 2)");
    CHECK(ack.mapSkillList[900002].iSpendSkillCSPoint == 5, "expired path preserves client spend field then adds existing investment");
    CHECK(fx.Scalar("SELECT SkillLevel FROM gskill WHERE UnitUID=? AND SkillID=900002 AND SkillPageNumber=1;", uid) == 2 &&
          fx.Scalar("SELECT SkillLevel FROM gskill WHERE UnitUID=? AND SkillID=900002 AND SkillPageNumber=2;", uid) == 1,
          "page-scoped write leaves same skill on other page untouched");
}

static void TestTransactionRollback()
{
    {
        Fixture fx; int64_t uid = fx.MakeUnit(7104, L"getskill_d");
        CHECK(uid > 0, "create unit"); if (uid <= 0) return;
        CHECK(fx.SetSPoint(uid, 10) && fx.SeedCash(uid, 0, 0), "seed");
        CHECK(fx.InjectFailure("gskill"), "inject gskill failure");
        GetSkillAck ack = DoReq(fx, uid, One(900003, 2));
        CHECK(ack.iOK == ERR_SKILL_00 && ack.iActiveSkillPageNumber == 1 && ack.mapSkillList.empty() && ack.iRemainSP == 0,
              "skill write failure -> ERR_SKILL_00 phase-B ACK");
        CHECK(fx.Scalar("SELECT SPoint FROM gunit WHERE UnitUID=?;", uid) == 10 &&
              fx.Scalar("SELECT COUNT(*) FROM gskill WHERE UnitUID=? AND SkillID=900003;", uid) == 0,
              "skill failure rolls back all writes");
    }
    {
        Fixture fx; int64_t uid = fx.MakeUnit(7105, L"getskill_e");
        CHECK(uid > 0, "create unit"); if (uid <= 0) return;
        CHECK(fx.SetSPoint(uid, 10) && fx.SeedCash(uid, 0, 0), "seed");
        CHECK(fx.InjectFailure("gskillcash"), "inject cash failure");
        GetSkillAck ack = DoReq(fx, uid, One(900004, 2));
        CHECK(ack.iOK == ERR_SKILL_24 && ack.iActiveSkillPageNumber == 1 && ack.mapSkillList.empty(),
              "cash write failure -> ERR_SKILL_24 phase-B ACK");
        CHECK(fx.Scalar("SELECT SPoint FROM gunit WHERE UnitUID=?;", uid) == 10 &&
              fx.Scalar("SELECT COUNT(*) FROM gskill WHERE UnitUID=? AND SkillID=900004;", uid) == 0,
              "cash failure rolls back skill/SP writes");
    }
}

void RunGetSkillTestsByRef(int& pass, int& fail)
{
    g_pass_get_skill = 0; g_fail_get_skill = 0;
    TestCodecGoldenAndRoundtrip();
    TestNewSkillAndUpgradeCommit();
    TestErrorPaths();
    TestCrossPageAndExpiredCspRetention();
    TestTransactionRollback();
    pass += g_pass_get_skill; fail += g_fail_get_skill;
    std::printf("get_skill: %d passed, %d failed\n", g_pass_get_skill, g_fail_get_skill);
}
