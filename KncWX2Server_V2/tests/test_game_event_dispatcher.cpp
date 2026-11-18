#include <cstdio>
#include <atomic>
#include <chrono>
#include <thread>
#include "../src/net/Session.h"
#include "../src/net/Socket.h"
#include "../src/core/Serializer.h"
#include "../src/core/NetError.h"
#include "../src/server/GameEventDispatcher.h"
using namespace x2;
namespace {
int passed = 0, failed = 0;
#define CHECK(c) do { if (c) ++passed; else { ++failed; std::printf("game dispatch FAIL line %d\n", __LINE__); } } while (0)
void Test() {
    GameEventSession a, b; Event req, reply; frame_average::FrameStatistics stat;
    req.eventID = static_cast<uint16_t>(EventID::EGS_OPTION_UPDATE_REQ);
    Serializer s; field_option::OptionUpdateReq f; f.option.limit = 25;
    CHECK(s.BeginWriting(&req.payload) && field_option::PutOptionUpdateReq(s, f)); s.EndWriting();
    reply.eventID = 999; stat.emit = true;
    CHECK(DispatchGameEvent(a, req, reply, stat) == GameDispatchResult::Unauthenticated && a.fieldOption.limit == 35 && reply.eventID == 999 && !stat.emit);
    a.authenticated = true; b.authenticated = true;
    CHECK(DispatchGameEvent(a, req, reply, stat) == GameDispatchResult::Handled && a.fieldOption.limit == 25 && b.fieldOption.limit == 35);
    CHECK(reply.eventID == static_cast<uint16_t>(EventID::EGS_OPTION_UPDATE_ACK) && reply.dest.performerID == PerformerID::PI_GS_USER);
    field_option::OptionUpdateAck fa; CHECK(s.BeginReading(&reply.payload) && field_option::GetOptionUpdateAck(s, fa) && fa.iOK == NET_OK && s.GetReadLength() == 0); s.EndReading();
    Event malformed = req; malformed.payload.Clear(); reply.eventID = 999;
    CHECK(DispatchGameEvent(a, malformed, reply, stat) == GameDispatchResult::Malformed && a.fieldOption.limit == 25 && reply.eventID == 999);
    const unsigned char extra = 1; CHECK(malformed.payload.Write(&extra, 1));
    CHECK(DispatchGameEvent(a, malformed, reply, stat) == GameDispatchResult::Malformed && a.fieldOption.limit == 25);
    malformed = req; CHECK(malformed.payload.Write(&extra, 1));
    CHECK(DispatchGameEvent(a, malformed, reply, stat) == GameDispatchResult::Malformed && a.fieldOption.limit == 25);
    malformed = req; malformed.payload.SetCompressedFlag(true);
    CHECK(DispatchGameEvent(a, malformed, reply, stat) == GameDispatchResult::Malformed);
    req.eventID = static_cast<uint16_t>(EventID::EGS_FRAME_AVERAGE_REQ); req.payload.Clear();
    frame_average::FrameAverageReq fr; fr.gameType = 3; fr.frameAverage = 90;
    CHECK(s.BeginWriting(&req.payload) && frame_average::PutFrameAverageReq(s, fr)); s.EndWriting();
    CHECK(DispatchGameEvent(a, req, reply, stat) == GameDispatchResult::Handled && stat.emit && stat.gameIndex == 2 && stat.fpsBucket == 7);
    CHECK(reply.eventID == static_cast<uint16_t>(EventID::EGS_FRAME_AVERAGE_ACK));
    frame_average::FrameAverageAck far; CHECK(s.BeginReading(&reply.payload) && frame_average::GetFrameAverageAck(s, far) && far.iOK == NET_OK); s.EndReading();
    req.payload.Clear(); fr.frameAverage = -1;
    CHECK(s.BeginWriting(&req.payload) && frame_average::PutFrameAverageReq(s, fr)); s.EndWriting();
    CHECK(DispatchGameEvent(a, req, reply, stat) == GameDispatchResult::Handled && !stat.emit);
    CHECK(s.BeginReading(&reply.payload) && frame_average::GetFrameAverageAck(s, far) && far.iOK == ERR_STATISTICS_00); s.EndReading();
    req.eventID = 65535; reply.eventID = 999; stat.emit = true;
    CHECK(DispatchGameEvent(a, req, reply, stat) == GameDispatchResult::Unsupported && reply.eventID == 999 && !stat.emit);
}
void TestLoopback() {
#if X2_PLATFORM_POSIX
    uint16_t port = 0;
    { Socket probe; CHECK(Socket::CreateTcp(probe) && probe.Bind(0) && probe.LocalPort(port) && port != 0); }
    if (!port) return;
    std::atomic<bool> serverOk{false};
    std::thread server([&] {
        Session net(PerformerID::PI_GS_SERVER);
        if (!net.ListenAndAccept(port) || !net.SendSecurityHandshake()) return;
        // Authentication is injected by the test; no login service is implemented here.
        GameEventSession state; state.authenticated = true;
        for (int i = 0; i < 2; ++i) {
            Event request, response; frame_average::FrameStatistics stats;
            if (net.RecvEvent(request, 5000) != Session::RecvResult::Event) return;
            if (DispatchGameEvent(state, request, response, stats) != GameDispatchResult::Handled) return;
            if (i == 0 && state.fieldOption.limit != 10) return;
            if (i == 1 && (!stats.emit || stats.gameIndex != 1 || stats.fpsBucket != 8)) return;
            if (!net.SendEvent(response)) return;
        }
        serverOk = true;
    });
    std::this_thread::sleep_for(std::chrono::milliseconds(200));
    Session client(PerformerID::PI_GS_USER); Event hs;
    bool ok = client.Connect("127.0.0.1", port);
    if (ok) ok = client.RecvEvent(hs, 5000) == Session::RecvResult::Handshake;
    Event req, ack; Serializer ser;
    if (ok) {
        req.eventID = static_cast<uint16_t>(EventID::EGS_OPTION_UPDATE_REQ);
        field_option::OptionUpdateReq value; value.option.limit = 10;
        ok = ser.BeginWriting(&req.payload) && field_option::PutOptionUpdateReq(ser, value); ser.EndWriting();
        if (ok) ok = client.SendEvent(req) && client.RecvEvent(ack, 5000) == Session::RecvResult::Event && ack.eventID == static_cast<uint16_t>(EventID::EGS_OPTION_UPDATE_ACK);
    }
    if (ok) {
        req.payload.Clear(); req.eventID = static_cast<uint16_t>(EventID::EGS_FRAME_AVERAGE_REQ);
        frame_average::FrameAverageReq value; value.gameType = 2; value.frameAverage = 91;
        ok = ser.BeginWriting(&req.payload) && frame_average::PutFrameAverageReq(ser, value); ser.EndWriting();
        if (ok) ok = client.SendEvent(req) && client.RecvEvent(ack, 5000) == Session::RecvResult::Event && ack.eventID == static_cast<uint16_t>(EventID::EGS_FRAME_AVERAGE_ACK);
    }
    client.Close(); server.join(); CHECK(ok && serverOk.load());
#endif
}
}
void RunGameEventDispatcherTestsByRef(int& pass, int& fail) { Test(); TestLoopback(); pass += passed; fail += failed; std::printf("GameEventDispatcher: %d passed, %d failed\n", passed, failed); }
