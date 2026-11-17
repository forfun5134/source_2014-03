// tests/test_wish_list.cpp — EGS_GET/MODIFY_WISH_LIST_REQ/ACK（찜 리스트；§0a21）
// 對照原 GSUserCashShop::IMPL_ON_FUNC( EGS_GET_WISH_LIST_REQ / EGS_MODIFY_WISH_LIST_REQ )
//   ＋ KUserWishList（UserWishList.cpp；SLOT_MAX=21；AddWish/DelWish/壓實）＋ UserWishListFlush（gup_update_WishList）
// 原版 DB 寫入延遲到 DBE_UPDATE_UNIT_INFO；V2 write-through（見 WishListProtocol.h 檔頭偏差聲明 3）。
#include <cstdio>
#include <cstring>
#include <functional>
#include <string>
#include <array>
#include <vector>

#include "../src/core/NetError.h"
#include "../src/core/SerBuffer.h"
#include "../src/core/Serializer.h"
#include "../src/core/EventIDs.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/WishListProtocol.h"

using namespace x2;
using namespace x2::db;
using namespace x2::wish_list;

static int g_pass_wl = 0, g_fail_wl = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_wl++; } \
    else { g_fail_wl++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
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
    int64_t MakeUser(int64_t userUID)
    {
        char buf[32];
        std::snprintf(buf, sizeof buf, "wl_%lld", (long long)userUID);
        GUserRecord gu;
        if (!store.GetOrCreateGUser(userUID, buf, gu, err)) return -1;
        return userUID;
    }
};

static ModifyWishListAck HandleModify(Fixture& fx, int64_t userUID, std::vector<int32_t> items, bool isDelete)
{
    ModifyWishListReq req;
    req.m_vecWishListItemID = std::move(items);
    req.m_bIsDelete = isDelete;
    ModifyWishListAck ack;
    std::string err;
    HandleModifyWishListReq(fx.store, userUID, req, ack, err);
    return ack;
}

// (slot, itemID) 非零槽，依槽位升序
static std::vector<std::pair<int32_t, int32_t>> SlotsOf(Fixture& fx, int64_t userUID)
{
    std::array<int32_t, GameStore::kWishListSlotMax> slots{};
    std::string err;
    fx.store.GetWishListSlots(userUID, slots, err);
    std::vector<std::pair<int32_t, int32_t>> v;
    for (int s = 0; s < GameStore::kWishListSlotMax; ++s) {
        if (slots[static_cast<size_t>(s)] != 0) v.emplace_back(s, slots[static_cast<size_t>(s)]);
    }
    return v;
}

static SerBuffer PutPayload(const std::function<bool(Serializer&)>& fn)
{
    SerBuffer buf;
    Serializer ks;
    if (!ks.BeginWriting(&buf)) return SerBuffer{};
    if (!fn(ks)) return SerBuffer{};
    ks.EndWriting();
    return buf;
}

// ---------- codec golden ----------

static void TestGetAckGoldenBytes()
{
    GetWishListAck ack;
    ack.m_mapWishList.emplace(0, 100);
    ack.m_mapWishList.emplace(5, 70000);
    SerBuffer buf = PutPayload([&ack](Serializer& s) { return PutGetWishListAck(s, ack); });
    const unsigned char expect[20] = {
        0x00, 0x00, 0x00, 0x02,                             // map size = 2 (DWORD BE)
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x64,     // key 0, value 100
        0x00, 0x00, 0x00, 0x05, 0x00, 0x01, 0x11, 0x70      // key 5, value 70000
    };
    CHECK(buf.GetLength() == sizeof(expect) && std::memcmp(buf.GetData(), expect, sizeof(expect)) == 0,
          "GET ACK golden bytes (DWORD count + 2×(int32 key,int32 value))");
    GetWishListAck back;
    Serializer ks;
    CHECK(ks.BeginReading(&buf) && GetGetWishListAck(ks, back), "ack parse");
    ks.EndReading();
    CHECK(back.m_mapWishList.size() == 2 && back.m_mapWishList.at(0) == 100 && back.m_mapWishList.at(5) == 70000,
          "GET ACK roundtrip");
}

static void TestModifyReqGoldenBytes()
{
    ModifyWishListReq req;
    req.m_vecWishListItemID = { 100, 2000 };
    req.m_bIsDelete = false;
    SerBuffer buf = PutPayload([&req](Serializer& s) { return PutModifyWishListReq(s, req); });
    const unsigned char expect[13] = {
        0x00, 0x00, 0x00, 0x02,             // vector size
        0x00, 0x00, 0x00, 0x64,             // 100
        0x00, 0x00, 0x07, 0xD0,             // 2000
        0x00                                // m_bIsDelete = false
    };
    CHECK(buf.GetLength() == sizeof(expect) && std::memcmp(buf.GetData(), expect, sizeof(expect)) == 0,
          "MODIFY REQ golden bytes");
    ModifyWishListReq back;
    Serializer ks;
    CHECK(ks.BeginReading(&buf) && GetModifyWishListReq(ks, back), "req parse");
    ks.EndReading();
    CHECK(back.m_vecWishListItemID.size() == 2 && back.m_vecWishListItemID[1] == 2000 && !back.m_bIsDelete,
          "MODIFY REQ roundtrip");
}

static void TestModifyAckGoldenBytes()
{
    ModifyWishListAck ack;
    ack.iOK = NET_OK;
    ack.m_vecWishListItemID = { 300 };
    ack.m_bIsDelete = true;
    SerBuffer buf = PutPayload([&ack](Serializer& s) { return PutModifyWishListAck(s, ack); });
    const unsigned char expect[13] = {
        0x00, 0x00, 0x00, 0x00,             // NET_OK
        0x00, 0x00, 0x00, 0x01,             // vector size 1
        0x00, 0x00, 0x01, 0x2C,             // 300
        0x01                                // m_bIsDelete = true
    };
    CHECK(buf.GetLength() == sizeof(expect) && std::memcmp(buf.GetData(), expect, sizeof(expect)) == 0,
          "MODIFY ACK golden bytes");
    ModifyWishListAck back;
    Serializer ks;
    CHECK(ks.BeginReading(&buf) && GetModifyWishListAck(ks, back), "ack parse");
    ks.EndReading();
    CHECK(back.iOK == NET_OK && back.m_vecWishListItemID.size() == 1 && back.m_bIsDelete, "MODIFY ACK roundtrip");
}

static void TestGetReqGoldenBytes()
{
    GetWishListReq req;
    SerBuffer buf = PutPayload([&req](Serializer& s) { return PutGetWishListReq(s, req); });
    CHECK(buf.GetLength() == 0, "GET REQ is NOPARAM (empty wire payload)");
}

static void TestEventIdsAndErrorCodes()
{
    CHECK(static_cast<uint16_t>(EventID::EGS_GET_WISH_LIST_REQ) == 509 &&
          static_cast<uint16_t>(EventID::EGS_GET_WISH_LIST_ACK) == 510 &&
          static_cast<uint16_t>(EventID::EGS_MODIFY_WISH_LIST_REQ) == 511 &&
          static_cast<uint16_t>(EventID::EGS_MODIFY_WISH_LIST_ACK) == 512,
          "event ids 509/510/511/512");
    CHECK(ERR_WISH_LIST_00 == 450 && ERR_WISH_LIST_02 == 451,
          "ERR_WISH_LIST_00=450, ERR_WISH_LIST_02=451 (compiled against original NetError_def.h)");
}

// ---------- read path ----------

static void TestGetWishListFilters()
{
    Fixture fx;
    const int64_t u = fx.MakeUser(555001);
    CHECK(u > 0, "user created");
    // SlotNo/ItemID 皆 NULL、SlotNo 越界、ItemID=0、ItemID>0
    CHECK(fx.db.Exec("INSERT INTO gitemwishlist (UserUID, SlotNo, ItemID) VALUES "
                     "(555001, 0, 100),(555001, 3, 200),(555001, 7, 0),(555001, NULL, 999),(555001, 30, 777),(555001, 1, NULL);", fx.err),
          "seed wishlist rows");
    GetWishListAck ack;
    std::string err;
    HandleGetWishListReq(fx.store, 555001, ack, err);
    CHECK(err.empty(), "get ok");
    CHECK(ack.m_mapWishList.size() == 2, "ItemID>0 filter, NULL SlotNo skipped, out-of-range kept by raw get? no");
    CHECK(ack.m_mapWishList.at(0) == 100 && ack.m_mapWishList.at(3) == 200, "map contents");
    // 無效 userUID → 空 map、無錯誤（原無該檢查）
    GetWishListAck ack2;
    std::string err2;
    HandleGetWishListReq(fx.store, -1, ack2, err2);
    CHECK(err2.empty() && ack2.m_mapWishList.empty(), "invalid user uid -> empty map, no error");
}

// ---------- modify: add ----------

static void TestAddFlow()
{
    Fixture fx;
    const int64_t u = fx.MakeUser(555002);
    CHECK(u > 0, "user created");
    ModifyWishListAck a1 = HandleModify(fx, u, { 1000, 1001 }, false);
    CHECK(a1.iOK == NET_OK, "add two -> NET_OK");
    CHECK(a1.m_vecWishListItemID.size() == 2 && !a1.m_bIsDelete, "ack echoes req");
    std::vector<std::pair<int32_t, int32_t>> got = SlotsOf(fx, u);
    CHECK(got.size() == 2 && got[0] == std::make_pair(0, 1000) && got[1] == std::make_pair(1, 1001), "slots 0,1 filled");
    // 重複加入 → 冪等 no-op
    ModifyWishListAck a2 = HandleModify(fx, u, { 1000 }, false);
    CHECK(a2.iOK == NET_OK, "duplicate add -> NET_OK");
    CHECK(SlotsOf(fx, u).size() == 2, "duplicate add is a no-op");
    // 填滿 21 槽
    for (int i = 0; i < 19; ++i) HandleModify(fx, u, { 2000 + i }, false);
    CHECK(SlotsOf(fx, u).size() == 21, "21 slots filled");
    // 第 22 個 → ERR_WISH_LIST_02，且不寫入
    ModifyWishListAck a3 = HandleModify(fx, u, { 9999 }, false);
    CHECK(a3.iOK == ERR_WISH_LIST_02, "22nd distinct item -> ERR_WISH_LIST_02");
    CHECK(SlotsOf(fx, u).size() == 21, "failed add persisted nothing");
    // 加入 0 / 負值 → 靜默忽略
    ModifyWishListAck a4 = HandleModify(fx, u, { 0, -5 }, false);
    CHECK(a4.iOK == NET_OK, "add zero/negative -> NET_OK (no-op)");
    CHECK(SlotsOf(fx, u).size() == 21, "no phantom slots");
}

static void TestAddDeleteFileFailure()
{
    Fixture fx;
    const int64_t u = fx.MakeUser(555003);
    CHECK(u > 0, "user created");
    HandleModify(fx, u, { 3000 }, false);
    std::string err2;
    CHECK(fx.db.Exec("ALTER TABLE gitemwishlist RENAME TO gitemwishlist_bak;", err2), "rename gitemwishlist");
    ModifyWishListAck a = HandleModify(fx, u, { 3001 }, false);
    CHECK(a.iOK == ERR_WISH_LIST_02, "missing table -> ERR_WISH_LIST_02");
    CHECK(fx.db.Exec("ALTER TABLE gitemwishlist_bak RENAME TO gitemwishlist;", err2), "restore table");
}

// ---------- modify: delete ----------

static void TestDeleteCompaction()
{
    Fixture fx;
    const int64_t u = fx.MakeUser(555004);
    CHECK(u > 0, "user created");
    HandleModify(fx, u, { 111, 222, 333, 444 }, false);
    // 刪除中間項 → 左移壓實
    ModifyWishListAck a = HandleModify(fx, u, { 222 }, true);
    CHECK(a.iOK == NET_OK, "delete -> NET_OK");
    std::vector<std::pair<int32_t, int32_t>> got = SlotsOf(fx, u);
    CHECK(got.size() == 3 && got[0] == std::make_pair(0, 111) && got[1] == std::make_pair(1, 333) && got[2] == std::make_pair(2, 444),
          "left-shift compaction after delete");
    // 刪除不存在項 → NET_OK、不變
    a = HandleModify(fx, u, { 99999 }, true);
    CHECK(a.iOK == NET_OK, "delete missing -> NET_OK");
    CHECK(SlotsOf(fx, u) == got, "delete missing is a no-op");
    // 全部刪光
    a = HandleModify(fx, u, { 111, 333, 444 }, true);
    CHECK(a.iOK == NET_OK, "delete all -> NET_OK");
    CHECK(SlotsOf(fx, u).empty(), "all cleared");
    // 空清單上刪除 → NET_OK
    a = HandleModify(fx, u, { 111 }, true);
    CHECK(a.iOK == NET_OK, "delete from empty -> NET_OK");
    // ItemID 0 刪除 → NET_OK no-op
    a = HandleModify(fx, u, { 0 }, true);
    CHECK(a.iOK == NET_OK, "delete zero -> NET_OK");
}

static void TestAccountScope()
{
    Fixture fx;
    const int64_t u1 = fx.MakeUser(555005);
    const int64_t u2 = fx.MakeUser(555006);
    CHECK(u1 > 0 && u2 > 0, "users created");
    HandleModify(fx, u1, { 8888 }, false);
    CHECK(SlotsOf(fx, u1).size() == 1 && SlotsOf(fx, u2).empty(), "wishlist is per-account (UserUID)");
    ModifyWishListAck a = HandleModify(fx, u2, { 8888 }, true);
    CHECK(a.iOK == NET_OK, "delete of foreign item -> NET_OK no-op");
    CHECK(SlotsOf(fx, u1).size() == 1, "foreign account unaffected");
}

void RunWishListTestsByRef(int& pass, int& fail)
{
    TestGetReqGoldenBytes();
    TestGetAckGoldenBytes();
    TestModifyReqGoldenBytes();
    TestModifyAckGoldenBytes();
    TestEventIdsAndErrorCodes();
    TestGetWishListFilters();
    TestAddFlow();
    TestAddDeleteFileFailure();
    TestDeleteCompaction();
    TestAccountScope();
    pass += g_pass_wl;
    fail += g_fail_wl;
}
