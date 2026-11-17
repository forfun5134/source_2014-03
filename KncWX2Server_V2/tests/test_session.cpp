// tests/test_session.cpp — Session 握手/加解密收發/驗證失敗上限 整合測試
// RunSessionTestsByRef 由 tests/test_all.cpp 的 main() 呼叫
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>
#include <thread>
#include <atomic>
#include <chrono>

#include "../src/core/Event.h"
#include "../src/core/EventIDs.h"
#include "../src/core/Serializer.h"
#include "../src/net/Session.h"
#include "../src/net/PacketIO.h"
#include "../src/net/Socket.h"
#include "../src/security/SADatabase.h"
#include "../src/security/SecurityAssociation.h"

using namespace x2;
using namespace x2::security;

void RunSessionTestsByRef(int& pass, int& fail);
static int g_pass_sess = 0, g_fail_sess = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_sess++; } \
    else { g_fail_sess++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

// ---- SA 序列化 roundtrip（不經網路）----
static void TestSecurityAssociationWire()
{
    SpiType spi = SADatabase::Instance().CreateNewSA();
    const SecurityAssociation& sa = SADatabase::Instance().GetSA(spi);
    Serializer ks;
    SerBuffer buf;
    CHECK(ks.BeginWriting(&buf), "begin writing");
    CHECK(PutSecurityAssociation(ks, sa), "PutSecurityAssociation");
    ks.EndWriting();

    Serializer ks2;
    SerBuffer bin = buf;
    SecurityAssociation sa2;
    CHECK(ks2.BeginReading(&bin), "begin reading");
    CHECK(GetSecurityAssociation(ks2, sa2), "GetSecurityAssociation");
    ks2.EndReading();
    CHECK(sa2.GetAuthKey() == sa.GetAuthKey(), "authKey roundtrip");
    CHECK(sa2.GetCipherKey() == sa.GetCipherKey(), "cryptoKey roundtrip");
    CHECK(sa2.GetSequenceNum() == sa.GetSequenceNum(), "seq roundtrip");
    CHECK(sa2.GetLastSequenceNum() == sa.GetLastSequenceNum(), "lastSeq roundtrip");
    CHECK(sa2.GetReplayWindowMask() == sa.GetReplayWindowMask(), "mask roundtrip");
    // 同金鑰 + 同 IV → 密文一致（確保序列化後的 SA 行為等價）
    // 使用 8-byte 倍數的 payload（DES-CBC 要求 block 對齊）
    ByteStream payload(reinterpret_cast<const uint8_t*>("sixteen byte msg!"), 16);
    ByteStream iv(8, 0x42);
    CHECK(sa.Encryption(payload, iv) == sa2.Encryption(payload, iv), "SA behaviour identical after roundtrip");
}

// ---- 完整握手 + 加密收發（loopback TCP）----
static void TestHandshakeEcho()
{
#if !X2_PLATFORM_POSIX
    (void)0;   // Windows 迴路測試待 winsock CI
    return;
#else
    const uint16_t kTestMagicEvent = 0xBEEF;
    const uint32_t kPing = 0xDEADBEEFu, kPong = 0xCAFEBABEu;

    // 先以 probe socket 取得一個可用的 ephemeral port（避免 Accept 阻塞導致 port 發布不出來的死鎖）
    uint16_t port = 0;
    {
        Socket probe;
        if (!Socket::CreateTcp(probe)) return;
        if (!probe.Bind(0) || !probe.LocalPort(port) || port == 0) { probe.Close(); return; }
        probe.Close();
    }

    std::atomic<bool> serverOk{false};
    std::thread srvThread([&]() {
        Session srv(PerformerID::PI_GS_SERVER);
        if (!srv.ListenAndAccept(port)) return;
        if (!srv.SendSecurityHandshake()) return;
        Event ev;
        if (srv.RecvEvent(ev, 5000) != Session::RecvResult::Event) return;
        if (ev.eventID != kTestMagicEvent) return;
        uint32_t magic = 0;
        if (!ev.GetData(magic) || magic != kPing) return;
        Event reply;
        reply.SetData(PerformerID::PI_GS_USER, nullptr, kTestMagicEvent, kPong);
        if (!srv.SendEvent(reply)) return;
        serverOk = true;
    });

    std::this_thread::sleep_for(std::chrono::milliseconds(200));   // 讓 server thread 就緒
    Session client(PerformerID::PI_GS_USER);
    CHECK(client.Connect("127.0.0.1", port), "client connect");
    Event hs;
    CHECK(client.RecvEvent(hs, 5000) == Session::RecvResult::Handshake, "client processes handshake");
    CHECK(client.GetState() == Session::State::Secured, "client secured");
    CHECK(client.CurrentSpi() != 0, "client has non-zero SPI");

    Event ping;
    ping.SetData(PerformerID::PI_GS_USER, nullptr, kTestMagicEvent, kPing);
    CHECK(client.SendEvent(ping), "client sends ping");

    Event reply;
    CHECK(client.RecvEvent(reply, 5000) == Session::RecvResult::Event, "client receives reply");
    CHECK(reply.eventID == kTestMagicEvent, "reply event id");
    uint32_t pong = 0;
    CHECK(reply.GetData(pong) && pong == kPong, "reply payload roundtrip");

    srvThread.join();
    CHECK(serverOk.load(), "server completed roundtrip");
    client.Close();
#endif
}

// ---- ICV 驗證失敗處理：limit=1 → AuthFailed；預設 limit → 跳過壞訊框後逾時（計數=2）----
// 不透過 Session 的 raw socket（未公開），以「raw Socket 模擬損毀的伺服器」對客戶端送訊框。
static std::vector<uint8_t> MakeTamperedFrame()
{
    SerBuffer buf;
    Event ping;
    ping.SetData(PerformerID::PI_GS_USER, nullptr, 0xBEEF, (uint32_t)1);
    ping.Serialize(buf);
    SecureBuffer sb(0);   // SPI=0 預設 SA
    ByteStream plain(reinterpret_cast<const uint8_t*>(buf.GetData()), buf.GetLength());
    sb.Create_notRWM(plain);
    std::vector<uint8_t> raw(sb.GetDataPtr(), sb.GetDataPtr() + sb.GetSize());
    raw[raw.size() / 2] ^= 0x01;   // 翻轉密文中一個 bit → ICV 必敗
    std::vector<uint8_t> frame;
    BuildFrame(raw.data(), raw.size(), frame);
    return frame;
}

static void TestAuthFailLimit()
{
#if !X2_PLATFORM_POSIX
    return;
#else
    const std::vector<uint8_t> badFrame = MakeTamperedFrame();

    // 案例 A：limit=1 → 第一個壞訊框即 AuthFailed，連線關閉
    {
        std::atomic<uint16_t> srvPort{0};
        std::thread srvThread([&]() {
            Socket listener;
            if (!Socket::CreateTcp(listener)) return;
            listener.SetReuseAddr(true);
            if (!listener.Bind(0) || !listener.Listen(1)) return;
            uint16_t p = 0;
            listener.LocalPort(p);
            srvPort = p;
            Socket peer;
            if (!listener.Accept(peer)) return;
            peer.SendAll(badFrame.data(), badFrame.size());
            std::this_thread::sleep_for(std::chrono::milliseconds(500));   // 保持連線讓 client 讀完
        });
        while (srvPort.load() == 0) std::this_thread::sleep_for(std::chrono::milliseconds(1));
        Session client(PerformerID::PI_GS_USER);
        client.SetAuthFailLimit(1);
        CHECK(client.Connect("127.0.0.1", srvPort.load()), "case A: client connect");
        Event ev;
        CHECK(client.RecvEvent(ev, 3000) == Session::RecvResult::AuthFailed, "case A: auth fail -> AuthFailed");
        CHECK(client.GetStats().authFailCount == 1, "case A: auth fail count == 1");
        CHECK(client.GetState() == Session::State::Closed, "case A: session closed");
        srvThread.join();
    }

    // 案例 B：預設 limit=5 → 2 個壞訊框被跳過，之後無資料 → Timeout；計數 == 2
    {
        std::atomic<uint16_t> srvPort{0};
        std::thread srvThread([&]() {
            Socket listener;
            if (!Socket::CreateTcp(listener)) return;
            listener.SetReuseAddr(true);
            if (!listener.Bind(0) || !listener.Listen(1)) return;
            uint16_t p = 0;
            listener.LocalPort(p);
            srvPort = p;
            Socket peer;
            if (!listener.Accept(peer)) return;
            peer.SendAll(badFrame.data(), badFrame.size());
            peer.SendAll(badFrame.data(), badFrame.size());
            std::this_thread::sleep_for(std::chrono::milliseconds(1500));  // 之後保持安靜
        });
        while (srvPort.load() == 0) std::this_thread::sleep_for(std::chrono::milliseconds(1));
        Session client(PerformerID::PI_GS_USER);   // 預設 limit=5
        CHECK(client.Connect("127.0.0.1", srvPort.load()), "case B: client connect");
        Event ev;
        CHECK(client.RecvEvent(ev, 1000) == Session::RecvResult::Timeout, "case B: bad frames skipped, then timeout");
        CHECK(client.GetStats().authFailCount == 2, "case B: auth fail count == 2");
        client.Close();
        srvThread.join();
    }
#endif
}

// ---- E_HEART_BEAT 接收丟棄 + heartbeats 計數 ----
static void TestHeartbeatDropped()
{
#if !X2_PLATFORM_POSIX
    return;
#else
    const uint16_t kMagicEvent = 0xBEEE;
    uint16_t port = 0;
    {
        Socket probe;
        if (!Socket::CreateTcp(probe)) return;
        if (!probe.Bind(0) || !probe.LocalPort(port) || port == 0) { probe.Close(); return; }
        probe.Close();
    }

    std::atomic<bool> serverOk{false};
    std::thread srvThread([&]() {
        Session srv(PerformerID::PI_GS_SERVER);
        if (!srv.ListenAndAccept(port)) return;
        if (!srv.SendSecurityHandshake()) return;
        // 送出 E_HEART_BEAT 再送真正的事件
        if (!srv.SendHeartbeat()) return;
        Event ev;
        ev.SetData(PerformerID::PI_GS_SERVER, nullptr, kMagicEvent, (uint32_t)1234);
        if (!srv.SendEvent(ev)) return;
        serverOk = true;
    });

    std::this_thread::sleep_for(std::chrono::milliseconds(200));
    Session client(PerformerID::PI_GS_USER);
    CHECK(client.Connect("127.0.0.1", port), "hb: client connect");
    Event hs;
    CHECK(client.RecvEvent(hs, 5000) == Session::RecvResult::Handshake, "hb: handshake");
    Event got;
    CHECK(client.RecvEvent(got, 5000) == Session::RecvResult::Event, "hb: real event received");
    CHECK(got.eventID == kMagicEvent, "hb: heartbeat was dropped, magic event surfaced");
    CHECK(client.GetStats().heartbeats == 1, "hb: heartbeats counted");
    srvThread.join();
    CHECK(serverOk.load(), "hb: server completed");
    client.Close();
#endif
}

// ---- SERV_KEVENT_FROM：client-facing session 標記 EFT_CLIENT + IsValidEventID 過濾 ----
static void TestClientFacingMarker()
{
#if !X2_PLATFORM_POSIX
    return;
#else
    const uint16_t kServerOnlyEvent = static_cast<uint16_t>(EventID::DBE_SERVER_ON_REQ);   // 1174，伺服器內部 ID

    uint16_t port = 0;
    {
        Socket probe;
        if (!Socket::CreateTcp(probe)) return;
        if (!probe.Bind(0) || !probe.LocalPort(port) || port == 0) { probe.Close(); return; }
        probe.Close();
    }

    auto sendFromRawServer = [port]() {
        Socket listener;
        if (!Socket::CreateTcp(listener)) return;
        listener.SetReuseAddr(true);
        if (!listener.Bind(port) || !listener.Listen(1)) return;
        Socket peer;
        if (!listener.Accept(peer)) return;
        // 先送握手？不需要——用 SPI=0 直接送一個「伺服器內部事件 ID」與一個一般事件
        SerBuffer buf;
        Event e1;
        e1.SetData(PerformerID::PI_GS_SERVER, nullptr, kServerOnlyEvent, (uint32_t)7);
        if (e1.Serialize(buf)) {
            SecureBuffer sb(0);
            ByteStream plain(reinterpret_cast<const uint8_t*>(buf.GetData()), buf.GetLength());
            if (sb.Create_notRWM(plain)) {
                std::vector<uint8_t> frame;
                if (BuildFrame(sb.GetDataPtr(), static_cast<size_t>(sb.GetSize()), frame))
                    peer.SendAll(frame.data(), frame.size());
            }
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(300));
    };

    std::thread srvThread(sendFromRawServer);
    std::this_thread::sleep_for(std::chrono::milliseconds(200));
    Session client(PerformerID::PI_GS_USER);
    client.SetClientFacing(true);
    CHECK(client.Connect("127.0.0.1", port), "from: client connect");
    Event got;
    CHECK(client.RecvEvent(got, 3000) == Session::RecvResult::Event, "from: event received");
    CHECK(got.GetFromType() == Event::EFT_CLIENT, "from: marked EFT_CLIENT");
    CHECK(!got.IsValidEventID(), "from: server-only event ID rejected for EFT_CLIENT");
    got.SetFromType(Event::EFT_NONE);
    CHECK(got.IsValidEventID(), "from: cleared marker passes IsValidEventID");
    // 事件本身的數值正確性：1174 在 server-only 區段內
    CHECK(kServerOnlyEvent == 1174, "from: DBE_SERVER_ON_REQ == 1174");
    client.Close();
    srvThread.join();
#endif
}

// ---- 殭屍檢測：60s 無封包（此處以 150ms 逾時模擬）→ ZombieKicked ----
static void TestZombieKicked()
{
#if !X2_PLATFORM_POSIX
    return;
#else
    uint16_t port = 0;
    {
        Socket probe;
        if (!Socket::CreateTcp(probe)) return;
        if (!probe.Bind(0) || !probe.LocalPort(port) || port == 0) { probe.Close(); return; }
        probe.Close();
    }
    std::atomic<bool> accepted{false};
    std::thread srvThread([&]() {
        Socket listener;
        if (!Socket::CreateTcp(listener)) return;
        listener.SetReuseAddr(true);
        if (!listener.Bind(port) || !listener.Listen(1)) return;
        Socket peer;
        if (!listener.Accept(peer)) return;
        accepted = true;
        std::this_thread::sleep_for(std::chrono::milliseconds(1500));   // 完全沉默
    });

    std::this_thread::sleep_for(std::chrono::milliseconds(200));
    Session client(PerformerID::PI_GS_USER);
    client.SetZombieTimeout(150);   // 150ms 無封包即視為殭屍
    CHECK(client.Connect("127.0.0.1", port), "zombie: client connect");
    Event ev;
    CHECK(client.RecvEvent(ev, 50) == Session::RecvResult::Timeout, "zombie: first quiet recv is Timeout");
    if (accepted.load()) {
        std::this_thread::sleep_for(std::chrono::milliseconds(200));   // 超過 150ms 殭屍門檻
        CHECK(client.RecvEvent(ev, 50) == Session::RecvResult::ZombieKicked, "zombie: kicked after silence");
        CHECK(client.GetState() == Session::State::Closed, "zombie: session closed");
    } else {
        CHECK(false, "zombie: server accepted connection");
    }
    srvThread.join();
#endif
}

void RunSessionTestsByRef(int& pass, int& fail)
{
    TestSecurityAssociationWire();
    TestHandshakeEcho();
    TestAuthFailLimit();
    TestHeartbeatDropped();
    TestClientFacingMarker();
    TestZombieKicked();
    pass += g_pass_sess;
    fail += g_fail_sess;
}
