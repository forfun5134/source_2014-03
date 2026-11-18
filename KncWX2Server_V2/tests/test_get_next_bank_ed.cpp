#include <cstdio>
#include <cstring>
#include <string>
#include "../src/core/EventIDs.h"
#include "../src/core/NetError.h"
#include "../src/core/SerBuffer.h"
#include "../src/core/Serializer.h"
#include "../src/db/GameStore.h"
#include "../src/db/Sqlite.h"
#include "../src/server/GetNextBankEdProtocol.h"
using namespace x2;
using namespace x2::db;
using namespace x2::get_next_bank_ed;
namespace {
int passed = 0, failed = 0;
#define CHECK(c) do { if (c) ++passed; else { ++failed; std::printf("bank quote FAIL line %d\n", __LINE__); } } while (0)
struct BankQuoteFixture {
    Database db; GameStore store; std::string err; int64_t uid = 0;
    BankQuoteFixture() : store(db) {
        GUserRecord user;
        if (!db.Open(":memory:", err) || !ApplyGameMigrations(db, err) ||
            !store.GetOrCreateGUser(9732, "bank_quote_user", user, err)) return;
        store.CreateUnit(9732, "bank_quote_unit", 1, uid, err);
    }
    bool set(int count) {
        return db.Exec("DELETE FROM giteminventorysize WHERE UnitUID=" + std::to_string(uid) +
            " AND InventoryCategory=8; INSERT INTO giteminventorysize(UnitUID,InventoryCategory,NumSlot) VALUES(" +
            std::to_string(uid) + ",8," + std::to_string(count) + ");", err);
    }
};
void TestCodec() {
    CHECK(static_cast<int>(EventID::EGS_GET_NEXT_BANK_ED_REQ) == 1141 && static_cast<int>(EventID::EGS_GET_NEXT_BANK_ED_ACK) == 1142);
    SerBuffer b; Serializer s; GetNextBankEdReq req;
    CHECK(s.BeginWriting(&b) && PutGetNextBankEdReq(s, req)); s.EndWriting(); CHECK(b.GetLength() == 0);
    Serializer r; CHECK(r.BeginReading(&b) && GetGetNextBankEdReq(r, req)); r.EndReading();
    GetNextBankEdAck ack; ack.iED = 4000000;
    CHECK(s.BeginWriting(&b) && PutGetNextBankEdAck(s, ack)); s.EndWriting();
    const unsigned char expected[] = {0,0,0,0,0,0x3d,0x09,0x00};
    CHECK(b.GetLength() == 8 && std::memcmp(b.GetData(), expected, 8) == 0);
    GetNextBankEdAck decoded;
    CHECK(r.BeginReading(&b) && GetGetNextBankEdAck(r, decoded)); r.EndReading(); CHECK(decoded.iOK == 0 && decoded.iED == 4000000);
}
void TestHandler() {
    BankQuoteFixture f; GetNextBankEdAck ack; CHECK(f.uid > 0);
    CHECK(HandleGetNextBankEdReq(f.store, f.uid, ack, f.err) == NET_OK && ack.iED == 4000000);
    const int prices[] = {4000000,8000000,18000000,54000000,65000000};
    for (int i = 0; i < 5; ++i) {
        CHECK(f.set(i * 8));
        CHECK(HandleGetNextBankEdReq(f.store, f.uid, ack, f.err) == NET_OK && ack.iED == prices[i]);
    }
    CHECK(f.set(40)); CHECK(HandleGetNextBankEdReq(f.store, f.uid, ack, f.err) == ERR_EXPAND_INVENTORY_ED_03 && ack.iED == 0);
    CHECK(f.set(9)); CHECK(HandleGetNextBankEdReq(f.store, f.uid, ack, f.err) == NET_OK && ack.iED == 4000000);
    CHECK(f.set(48)); CHECK(HandleGetNextBankEdReq(f.store, f.uid, ack, f.err) == NET_OK && ack.iED == 4000000);
    CHECK(HandleGetNextBankEdReq(f.store, 0, ack, f.err) == ERR_ODBC_01 && !f.err.empty());
    CHECK(HandleGetNextBankEdReq(f.store, f.uid + 999, ack, f.err) == ERR_ODBC_01 && ack.iED == 0);
    CHECK(f.db.Exec("DROP TABLE giteminventorysize;", f.err));
    CHECK(HandleGetNextBankEdReq(f.store, f.uid, ack, f.err) == ERR_ODBC_01 && !f.err.empty());
}
}
void RunGetNextBankEdTestsByRef(int& pass, int& fail) {
    TestCodec(); TestHandler(); pass += passed; fail += failed;
    std::printf("GetNextBankEd: %d passed, %d failed\n", passed, failed);
}
