#include <cstdio>
#include <atomic>
#include <chrono>
#include <thread>
#include "../src/net/Session.h"
#include "../src/net/Socket.h"
#include <string>
#include "../src/core/NetError.h"
#include "../src/core/Serializer.h"
#include "../src/db/Sqlite.h"
#include "../src/server/QuoteEventDispatcher.h"
using namespace x2;
using namespace x2::db;
namespace {
int passed = 0, failed = 0;
#define CHECK(c) do { if (c) ++passed; else { ++failed; std::printf("quote dispatch FAIL line %d\n", __LINE__); } } while (0)
struct QuoteDispatchFixture {
    Database db; GameStore store; std::string err; int64_t uid = 0, other = 0;
    QuoteDispatchFixture() : store(db) {
        GUserRecord user;
        if (!db.Open(":memory:", err) || !ApplyGameMigrations(db, err) ||
            !store.GetOrCreateGUser(1001, "quote_user", user, err) ||
            !store.GetOrCreateGUser(1002, "other_user", user, err)) return;
        if (store.CreateUnit(1001, "quote_unit", 1, uid, err) != CreateUnitResult::Ok) return;
        store.CreateUnit(1002, "other_unit", 1, other, err);
    }
};
void Test() {
    QuoteDispatchFixture f; CHECK(f.uid > 0 && f.other > 0);
    QuoteSession session; Event req, reply; std::string err;
    req.eventID = static_cast<uint16_t>(EventID::EGS_GET_NEXT_BANK_ED_REQ);
    reply.eventID = 42;
    CHECK(DispatchQuoteEvent(f.store, session, req, reply, err) == QuoteDispatchResult::Unauthenticated && reply.eventID == 42);
    session.authenticated = true; session.userUID = 1001;
    CHECK(DispatchQuoteEvent(f.store, session, req, reply, err) == QuoteDispatchResult::NoSelection && reply.eventID == 42);
    session.unitUID = f.other;
    CHECK(DispatchQuoteEvent(f.store, session, req, reply, err) == QuoteDispatchResult::Forbidden && reply.eventID == 42);
    session.unitUID = f.uid + 99999;
    CHECK(DispatchQuoteEvent(f.store, session, req, reply, err) == QuoteDispatchResult::Forbidden && reply.eventID == 42);
    session.unitUID = f.uid;
    const unsigned char byte = 1; CHECK(req.payload.Write(&byte, 1));
    CHECK(DispatchQuoteEvent(f.store, session, req, reply, err) == QuoteDispatchResult::Malformed && reply.eventID == 42);
    req.payload.Clear(); req.payload.SetCompressedFlag(true);
    CHECK(DispatchQuoteEvent(f.store, session, req, reply, err) == QuoteDispatchResult::Malformed);
    req.payload.Clear();
    const EventID requests[] = {EventID::EGS_GET_NEXT_BANK_ED_REQ, EventID::EGS_GET_NEXT_INVENTORY_ED_REQ, EventID::EGS_GET_NEXT_SKILL_PAGE_ED_REQ};
    const EventID responses[] = {EventID::EGS_GET_NEXT_BANK_ED_ACK, EventID::EGS_GET_NEXT_INVENTORY_ED_ACK, EventID::EGS_GET_NEXT_SKILL_PAGE_ED_ACK};
    const int prices[] = {4000000,5000000,50000000};
    for (int i = 0; i < 3; ++i) {
        req.eventID = static_cast<uint16_t>(requests[i]);
        CHECK(DispatchQuoteEvent(f.store, session, req, reply, err) == QuoteDispatchResult::Handled && err.empty());
        CHECK(reply.eventID == static_cast<uint16_t>(responses[i]) && reply.dest.performerID == PerformerID::PI_GS_USER);
        Serializer r; int32_t code = -1, price = -1;
        CHECK(r.BeginReading(&reply.payload) && r.Get(code) && r.Get(price) && r.GetReadLength() == 0 && code == NET_OK && price == prices[i]); r.EndReading();
    }
    CHECK(f.db.Exec("UPDATE gskillexpand SET PageCount=3 WHERE UnitUID=" + std::to_string(f.uid), f.err));
    CHECK(DispatchQuoteEvent(f.store, session, req, reply, err) == QuoteDispatchResult::Handled);
    Serializer r; int32_t code = 0, price = -1;
    CHECK(r.BeginReading(&reply.payload) && r.Get(code) && r.Get(price) && code == ERR_SKILL_PAGE_02 && price == 0); r.EndReading();
    CHECK(f.db.Exec("DROP TABLE giteminventorysize;", f.err));
    req.eventID = static_cast<uint16_t>(EventID::EGS_GET_NEXT_BANK_ED_REQ);
    CHECK(DispatchQuoteEvent(f.store, session, req, reply, err) == QuoteDispatchResult::Handled && !err.empty());
    CHECK(r.BeginReading(&reply.payload) && r.Get(code) && r.Get(price) && code == ERR_ODBC_01 && price == 0); r.EndReading();
    CHECK(f.db.Exec("UPDATE gunit SET DelDate='1900-01-01' WHERE UnitUID=" + std::to_string(f.uid), f.err));
    reply.eventID = 42; CHECK(DispatchQuoteEvent(f.store, session, req, reply, err) == QuoteDispatchResult::Forbidden && reply.eventID == 42);
    req.eventID = 65535; CHECK(DispatchQuoteEvent(f.store, session, req, reply, err) == QuoteDispatchResult::Unsupported && reply.eventID == 42);
    CHECK(f.db.Exec("PRAGMA foreign_keys=OFF; DROP TABLE gunit;", f.err));
    req.eventID = static_cast<uint16_t>(EventID::EGS_GET_NEXT_BANK_ED_REQ);
    CHECK(DispatchQuoteEvent(f.store, session, req, reply, err) == QuoteDispatchResult::DatabaseError && !err.empty() && reply.eventID == 42);
}
void TestLoopback() {
#if X2_PLATFORM_POSIX
    uint16_t port = 0;
    { Socket probe; CHECK(Socket::CreateTcp(probe) && probe.Bind(0) && probe.LocalPort(port) && port != 0); }
    if (!port) return;
    std::atomic<bool> serverOk{false};
    std::thread server([&] {
        QuoteDispatchFixture fixture;
        if (!fixture.uid) return;
        Session net(PerformerID::PI_GS_SERVER);
        if (!net.ListenAndAccept(port) || !net.SendSecurityHandshake()) return;
        QuoteSession state; state.authenticated = true; state.userUID = 1001; state.unitUID = fixture.uid;
        for (int i = 0; i < 3; ++i) {
            Event req, ack; std::string err;
            if (net.RecvEvent(req, 5000) != Session::RecvResult::Event ||
                DispatchQuoteEvent(fixture.store, state, req, ack, err) != QuoteDispatchResult::Handled ||
                !net.SendEvent(ack)) return;
        }
        serverOk = true;
    });
    std::this_thread::sleep_for(std::chrono::milliseconds(200));
    Session client(PerformerID::PI_GS_USER); Event hs;
    bool ok = client.Connect("127.0.0.1", port);
    if (ok) ok = client.RecvEvent(hs, 5000) == Session::RecvResult::Handshake;
    const EventID requests[] = {EventID::EGS_GET_NEXT_BANK_ED_REQ, EventID::EGS_GET_NEXT_INVENTORY_ED_REQ, EventID::EGS_GET_NEXT_SKILL_PAGE_ED_REQ};
    const EventID acks[] = {EventID::EGS_GET_NEXT_BANK_ED_ACK, EventID::EGS_GET_NEXT_INVENTORY_ED_ACK, EventID::EGS_GET_NEXT_SKILL_PAGE_ED_ACK};
    const int prices[] = {4000000, 5000000, 50000000};
    for (int i = 0; i < 3 && ok; ++i) {
        Event req, reply; req.eventID = static_cast<uint16_t>(requests[i]);
        ok = client.SendEvent(req) && client.RecvEvent(reply, 5000) == Session::RecvResult::Event && reply.eventID == static_cast<uint16_t>(acks[i]);
        Serializer r; int32_t code = -1, price = 0;
        if (ok) { ok = r.BeginReading(&reply.payload) && r.Get(code) && r.Get(price) && code == NET_OK && price == prices[i]; r.EndReading(); }
    }
    client.Close(); server.join(); CHECK(ok && serverOk.load());
#endif
}
}
void RunQuoteEventDispatcherTestsByRef(int& pass, int& fail) { Test(); TestLoopback(); pass += passed; fail += failed; std::printf("QuoteEventDispatcher: %d passed, %d failed\n", passed, failed); }
