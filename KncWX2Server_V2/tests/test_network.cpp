// tests/test_network.cpp — Socket / TCP 訊框 / FrameAssembler / 迴路整合測試
// RunNetworkTests 由 tests/test_all.cpp 的 main() 呼叫（build_and_test.sh 會 glob tests/*.cpp）
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>
#include <thread>
#include <atomic>

#include "../src/net/Socket.h"
#include "../src/net/PacketIO.h"
#include "../src/security/SecureBuffer.h"
#include "../src/security/SADatabase.h"
#include "../src/core/Platform.h"

using namespace x2;
using namespace x2::security;

void RunNetworkTestsByRef(int& pass, int& fail);

static int g_pass_net = 0, g_fail_net = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_net++; } \
    else { g_fail_net++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static void TestBuildFrame()
{
    const uint8_t payload[] = {0xDE, 0xAD, 0xBE, 0xEF};
    std::vector<uint8_t> frame;
    CHECK(BuildFrame(payload, sizeof payload, frame), "BuildFrame ok");
    CHECK(frame.size() == 6, "frame size = payload + 2");
    CHECK(frame[0] == 0x06 && frame[1] == 0x00, "frameLen LE = 6");
    CHECK(ReadFrameLength(frame.data()) == 6, "ReadFrameLength roundtrip");
    // 過大 payload → false
    std::vector<uint8_t> big(kMaxPacketSize);   // 超過上限（32766）
    CHECK(!BuildFrame(big.data(), big.size(), frame), "oversize payload rejected");
    // 空 payload → 2 bytes 訊框
    std::vector<uint8_t> empty;
    CHECK(BuildFrame(nullptr, 0, empty) && empty.size() == 2, "empty payload frame");
}

static void TestFrameAssembler()
{
    // 合成「兩個完整訊框 + 第三個殘段」的位元組流
    auto mkFrame = [](const std::string& s) {
        std::vector<uint8_t> f;
        BuildFrame(reinterpret_cast<const uint8_t*>(s.data()), s.size(), f);
        return f;
    };
    std::vector<uint8_t> stream;
    for (const std::string& s : {std::string("alpha"), std::string("beta")}) {
        auto f = mkFrame(s);
        stream.insert(stream.end(), f.begin(), f.end());
    }
    std::vector<uint8_t> tail = mkFrame("gamma");
    stream.insert(stream.end(), tail.begin(), tail.begin() + 4);   // 殘段 4 bytes

    std::vector<std::string> got;
    FrameAssembler asmbl;
    auto res = asmbl.Feed(stream.data(), stream.size(), [&](const uint8_t* p, size_t n) {
        got.emplace_back(reinterpret_cast<const char*>(p), n);
    });
    CHECK(res == FrameAssembler::FeedResult::Ok, "feed ok");
    CHECK(got.size() == 2 && got[0] == "alpha" && got[1] == "beta", "two frames reassembled");
    CHECK(asmbl.PendingBytes() == 4, "partial frame pending");

    // 逐位元組餵入（模擬破碎 TCP 分段）
    FrameAssembler byteWise;
    std::vector<std::string> got2;
    auto f1 = mkFrame("hello");
    bool okAll = true;
    for (uint8_t b : f1) {
        auto r = byteWise.Feed(&b, 1, [&](const uint8_t* p, size_t n) {
            got2.emplace_back(reinterpret_cast<const char*>(p), n);
        });
        okAll = okAll && (r == FrameAssembler::FeedResult::Ok);
    }
    CHECK(okAll && got2.size() == 1 && got2[0] == "hello", "byte-by-byte reassembly");

    // 宣告長度超過 kMaxPacketSize → 協議錯誤
    const uint8_t bad[2] = {0xFF, 0xFF};
    FrameAssembler flood;
    int calls = 0;
    auto r = flood.Feed(bad, 2, [&](const uint8_t*, size_t) { ++calls; });
    CHECK(r == FrameAssembler::FeedResult::TooLarge, "oversize declared length rejected");
    CHECK(flood.Overflowed() && calls == 0, "overflow latched, no callback");

    // 長度 < 2（例如 0x0001）→ 協議錯誤
    const uint8_t bad2[2] = {0x01, 0x00};
    FrameAssembler tiny;
    calls = 0;
    r = tiny.Feed(bad2, 2, [&](const uint8_t*, size_t) { ++calls; });
    CHECK(r == FrameAssembler::FeedResult::TooLarge, "frameLen < 2 rejected");
}

static void TestSecureFrameRoundtrip()
{
    // payload → SecureBuffer → TCP 訊框 → FrameAssembler → 解密
    const char* msg = "Elsword echo payload";
    ByteStream payload(reinterpret_cast<const uint8_t*>(msg), std::strlen(msg));
    SecureBuffer enc(0);
    CHECK(enc.Create_notRWM(payload), "encrypt");

    std::vector<uint8_t> frame;
    CHECK(BuildFrame(enc.GetDataPtr(), enc.GetSize(), frame), "frame build");

    FrameAssembler asmbl;
    std::vector<uint8_t> secureBytes;
    auto r = asmbl.Feed(frame.data(), frame.size(), [&](const uint8_t* p, size_t n) {
        secureBytes.assign(p, p + n);
    });
    CHECK(r == FrameAssembler::FeedResult::Ok, "frame feed");
    CHECK(secureBytes.size() == enc.GetSize(), "secure bytes size");

    SecureBuffer dec(0, secureBytes.data(), static_cast<unsigned long>(secureBytes.size()));
    ByteStream out;
    // authentic=false：ICV 驗證路徑已由 test_all 覆蓋；此處驗證 wire 通道上解密
    CHECK(dec.GetPayload_notRWM(out, false), "decrypt after framing");
    CHECK(out.size() == payload.size() && std::memcmp(out.data(), payload.data(), payload.size()) == 0,
          "payload roundtrip through framing");
}

static void TestLoopbackEcho()
{
#if !X2_PLATFORM_POSIX
    // Windows 迴路測試待 winsock CI 環境；此處跳過而不失敗
    return;
#else
    WsaGuard wsa;   // POSIX 下為空物件
    Socket listener;
    CHECK(Socket::CreateTcp(listener), "create listener");
    CHECK(listener.SetReuseAddr(true), "reuseaddr");
    CHECK(listener.Bind(0), "bind ephemeral port");   // 0 = OS 指派
    CHECK(listener.Listen(1), "listen");
    uint16_t port = 0;
    CHECK(listener.LocalPort(port) && port != 0, "local port assigned");

    std::atomic<bool> serverOk{false};
    std::thread server([&listener, &serverOk]() {
        Socket peer;
        if (!listener.Accept(peer)) return;
        std::vector<uint8_t> rx(64 * 1024);
        FrameAssembler asmbl;
        bool replied = false;
        for (int guard = 0; guard < 100 && !replied; ++guard) {
            int n = peer.Recv(rx.data(), rx.size());
            if (n <= 0) break;
            asmbl.Feed(rx.data(), static_cast<size_t>(n), [&](const uint8_t* p, size_t len) {
                SecureBuffer dec(0, p, static_cast<unsigned long>(len));
                ByteStream payload;
                if (!dec.GetPayload_notRWM(payload, false)) return;
                SecureBuffer reply(0);
                if (!reply.Create_notRWM(payload)) return;
                std::vector<uint8_t> frame;
                if (!BuildFrame(reply.GetDataPtr(), reply.GetSize(), frame)) return;
                replied = peer.SendAll(frame.data(), frame.size());
            });
        }
        serverOk = replied;
    });

    Socket client;
    CHECK(Socket::CreateTcp(client), "create client");
    CHECK(client.SetRecvTimeout(5000), "recv timeout");
    CHECK(client.Connect("127.0.0.1", port), "connect loopback");

    ByteStream payload(reinterpret_cast<const uint8_t*>("echo-me"), 7);
    SecureBuffer enc(0);
    CHECK(enc.Create_notRWM(payload), "encrypt request");
    std::vector<uint8_t> frame;
    CHECK(BuildFrame(enc.GetDataPtr(), enc.GetSize(), frame), "build request frame");
    CHECK(client.SendAll(frame.data(), frame.size()), "send request");

    uint8_t rx[64 * 1024];
    int n = client.Recv(rx, sizeof rx);               // 阻塞（含逾時）
    CHECK(n > 0, "recv echo reply");
    FrameAssembler asmbl;
    std::vector<uint8_t> secureBytes;
    asmbl.Feed(rx, static_cast<size_t>(n < 0 ? 0 : n), [&](const uint8_t* p, size_t len) {
        secureBytes.assign(p, p + len);
    });
    CHECK(!secureBytes.empty(), "echo frame assembled");
    if (!secureBytes.empty()) {
        SecureBuffer dec(0, secureBytes.data(), static_cast<unsigned long>(secureBytes.size()));
        ByteStream out;
        CHECK(dec.GetPayload_notRWM(out, false), "decrypt echo");
        CHECK(out.size() == 7 && std::memcmp(out.data(), "echo-me", 7) == 0, "echo payload matches");
    }
    client.Close();
    listener.Close();
    server.join();
    CHECK(serverOk.load(), "server side completed roundtrip");
#endif
}

void RunNetworkTestsByRef(int& pass, int& fail)
{
    TestBuildFrame();
    TestFrameAssembler();
    TestSecureFrameRoundtrip();
    TestLoopbackEcho();
    pass += g_pass_net;
    fail += g_fail_net;
}
