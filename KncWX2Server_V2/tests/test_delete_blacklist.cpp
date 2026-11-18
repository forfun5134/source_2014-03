// tests/test_delete_blacklist.cpp — EGS_DEL_BLACKLIST_USER_REQ/ACK (363/364)
#include <cstdio>
#include <cstring>
#include <functional>
#include <string>
#include <vector>

#include "../src/core/EventIDs.h"
#include "../src/core/NetError.h"
#include "../src/core/SerBuffer.h"
#include "../src/core/Serializer.h"
#include "../src/db/GameStore.h"
#include "../src/db/Sqlite.h"
#include "../src/server/DeleteBlacklistUserProtocol.h"

using namespace x2;
using namespace x2::db;
using namespace x2::delete_blacklist_user;

static int g_pass_bl = 0, g_fail_bl = 0;
#define CHECK(cond, name) do { \
    if (cond) { ++g_pass_bl; } \
    else { ++g_fail_bl; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

struct DeleteBlacklistFixture
{
    Database db;
    GameStore store;
    std::string err;
    int64_t ownerUID = 0;
    int64_t targetUID = 0;
    DeleteBlacklistFixture() : store(db)
    {
        if (!db.Open(":memory:", err) || !ApplyGameMigrations(db, err)) return;
        GUserRecord user;
        if (!store.GetOrCreateGUser(9201, "blacklist_owner", user, err)) return;
        if (store.CreateUnit(9201, "BLowner", 1, ownerUID, err) != CreateUnitResult::Ok) return;
        if (!store.GetOrCreateGUser(9202, "blacklist_target", user, err)) return;
        if (store.CreateUnit(9202, "被封鎖者", 2, targetUID, err) != CreateUnitResult::Ok) return;
    }
    bool AddRelation()
    {
        return db.Exec("INSERT INTO gblacklist(MyUID,BlockUID) VALUES(" + std::to_string(ownerUID) + "," +
                       std::to_string(targetUID) + ");", err);
    }
    bool HasRelation()
    {
        Statement st;
        if (!st.Prepare(db, "SELECT COUNT(*) FROM gblacklist WHERE MyUID=? AND BlockUID=?;", err) ||
            !st.BindInt(1, ownerUID, err) || !st.BindInt(2, targetUID, err)) return false;
        if (!st.StepRow(err)) return false;
        return st.ColumnInt64(0) == 1;
    }
};

static SerBuffer Payload(const std::function<bool(Serializer&)>& put)
{
    SerBuffer b;
    Serializer s;
    if (!s.BeginWriting(&b) || !put(s)) return SerBuffer{};
    s.EndWriting();
    return b;
}

static void TestCodec()
{
    DeleteBlacklistUserReq req; req.iUnitUID = 0x0102030405060708LL;
    SerBuffer reqBytes = Payload([&](Serializer& s) { return PutDeleteBlacklistUserReq(s, req); });
    const unsigned char expectedReq[] = {1,2,3,4,5,6,7,8};
    CHECK(reqBytes.GetLength() == sizeof expectedReq &&
          std::memcmp(reqBytes.GetData(), expectedReq, sizeof expectedReq) == 0, "REQ int64 BE golden");
    DeleteBlacklistUserReq reqBack; Serializer reqIn;
    CHECK(reqIn.BeginReading(&reqBytes) && GetDeleteBlacklistUserReq(reqIn, reqBack), "REQ decode");
    reqIn.EndReading();
    CHECK(reqBack.iUnitUID == req.iUnitUID, "REQ roundtrip");

    DeleteBlacklistUserAck ack; ack.iOK = NET_OK;
    ack.kChatBlackListUnit.iUnitUID = req.iUnitUID;
    ack.kChatBlackListUnit.wstrNickName = L"被封鎖者";
    SerBuffer ackBytes = Payload([&](Serializer& s) { return PutDeleteBlacklistUserAck(s, ack); });
    DeleteBlacklistUserAck ackBack; Serializer ackIn;
    CHECK(ackIn.BeginReading(&ackBytes) && GetDeleteBlacklistUserAck(ackIn, ackBack), "ACK decode");
    ackIn.EndReading();
    CHECK(ackBack.iOK == NET_OK && ackBack.kChatBlackListUnit.iUnitUID == req.iUnitUID &&
          ackBack.kChatBlackListUnit.wstrNickName == ack.kChatBlackListUnit.wstrNickName, "ACK roundtrip");
    CHECK(static_cast<int>(EventID::EGS_DEL_BLACKLIST_USER_REQ) == 363 &&
          static_cast<int>(EventID::EGS_DEL_BLACKLIST_USER_ACK) == 364, "event IDs");
    CHECK(ERR_BLACKLIST_02 == 244 && ERR_BLACKLIST_04 == 246 && ERR_BLACKLIST_06 == 248,
          "blacklist errors match original enum");
}

static void TestDelete()
{
    {
        DeleteBlacklistFixture f;
        CHECK(f.ownerUID > 0 && f.targetUID > 0 && f.AddRelation(), "fixture relation inserted");
        DeleteBlacklistUserReq req; req.iUnitUID = f.targetUID;
        DeleteBlacklistUserAck ack;
        CHECK(HandleDeleteBlacklistUserReq(f.store, f.ownerUID, req, ack, f.err) == NET_OK,
              "existing relation deleted");
        CHECK(!f.HasRelation(), "relation removed from storage");
        CHECK(ack.kChatBlackListUnit.iUnitUID == f.targetUID &&
              ack.kChatBlackListUnit.wstrNickName == L"被封鎖者", "success ACK returns removed UID and nickname");
    }
    {
        DeleteBlacklistFixture f;
        DeleteBlacklistUserReq req; req.iUnitUID = f.ownerUID;
        DeleteBlacklistUserAck ack;
        CHECK(HandleDeleteBlacklistUserReq(f.store, f.ownerUID, req, ack, f.err) == ERR_BLACKLIST_06,
              "self delete rejected");
        CHECK(ack.kChatBlackListUnit.iUnitUID == 0, "self-delete error ACK remains empty");
    }
    {
        DeleteBlacklistFixture f;
        DeleteBlacklistUserReq req; req.iUnitUID = f.targetUID;
        DeleteBlacklistUserAck ack;
        CHECK(HandleDeleteBlacklistUserReq(f.store, f.ownerUID, req, ack, f.err) == ERR_BLACKLIST_02,
              "missing relation maps to BLACKLIST_02");
        CHECK(f.err.empty(), "not-found is a business error, not DB failure");
    }
    {
        DeleteBlacklistFixture f;
        CHECK(f.AddRelation(), "failure fixture relation inserted");
        CHECK(f.db.Exec("CREATE TRIGGER fail_blacklist_delete BEFORE DELETE ON gblacklist BEGIN SELECT RAISE(ABORT,'injected'); END;", f.err),
              "delete failure trigger installed");
        DeleteBlacklistUserReq req; req.iUnitUID = f.targetUID;
        DeleteBlacklistUserAck ack;
        CHECK(HandleDeleteBlacklistUserReq(f.store, f.ownerUID, req, ack, f.err) == ERR_BLACKLIST_04,
              "transaction failure maps to BLACKLIST_04");
        CHECK(f.HasRelation(), "failed delete rolls back and preserves relation");
    }
}

void RunDeleteBlacklistTestsByRef(int& pass, int& fail)
{
    TestCodec();
    TestDelete();
    pass += g_pass_bl;
    fail += g_fail_bl;
    std::printf("DeleteBlacklist: %d passed, %d failed\n", g_pass_bl, g_fail_bl);
}
