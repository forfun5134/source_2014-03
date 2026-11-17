// Session.cpp — Session 狀態機實作（見 Session.h 的「完成的部分 / 尚未完成」清單）
#include "Session.h"

#include "../core/Serializer.h"
#include "../security/SecurityAssociation.h"

using namespace x2::security;

namespace x2 {

static constexpr uint16_t kEventAcceptConnectionNot =
    static_cast<uint16_t>(EventID::E_ACCEPT_CONNECTION_NOT);
static constexpr uint16_t kEventHeartBeat =
    static_cast<uint16_t>(EventID::E_HEART_BEAT);

bool Session::Connect(const std::string& host, uint16_t port)
{
    if (!Socket::CreateTcp(m_sock)) return false;
    if (!m_sock.Connect(host, port)) { Close(); return false; }
    m_sock.SetNoDelay(true);
    m_state = State::Connected;
    return true;
}

bool Session::ListenAndAccept(uint16_t port)
{
    Socket listener;
    if (!Socket::CreateTcp(listener)) return false;
    if (!listener.SetReuseAddr(true)) return false;
    if (!listener.Bind(port)) return false;
    if (!listener.Listen(1)) return false;
    uint16_t actualPort = 0;
    if (!listener.LocalPort(actualPort)) return false;
    if (!listener.Accept(m_sock)) return false;
    m_sock.SetNoDelay(true);
    m_state = State::Connected;
    return true;
}

uint16_t Session::LocalPort() const
{
    uint16_t port = 0;
    return m_sock.LocalPort(port) ? port : 0;
}

bool Session::SendSecurityHandshake()
{
    if (m_state != State::Connected) return false;
    // acceptor：建立隨機金鑰 SA（存於 SADB）
    SpiType spi = SADatabase::Instance().CreateNewSA();
    const SecurityAssociation sa = SADatabase::Instance().GetSA(spi);   // 複本

    // payload = [u16 BE SPI][SA]
    Serializer ks;
    SerBuffer inner;
    if (!ks.BeginWriting(&inner)) return false;
    if (!ks.Put(static_cast<uint16_t>(spi))) return false;   // Put(USHORT) → BE
    if (!PutSecurityAssociation(ks, sa)) return false;
    ks.EndWriting();

    Event ev;
    ev.eventID = kEventAcceptConnectionNot;
    ev.payload = inner;
    ev.dest.performerID = m_performerID;
    // 原碼此時 m_nSPIndex=0 → 以 SPI=0 加密
    if (!SendEventWithSpi(ev, /*spi=*/0)) return false;
    m_spi = spi;                       // 本端傳送改走新 SPI；接收忽略封包頭 SPI（同原版）
    m_state = State::Secured;
    return true;
}

bool Session::SendHeartbeat()
{
    if (m_state == State::Closed) return false;
    // 原 PROXY_ONLY 分支以空 kEvent 送 E_HEART_BEAT（SendPacket）
    Event ev;
    ev.eventID = kEventHeartBeat;
    ev.dest.performerID = m_performerID;
    return SendEvent(ev);
}

bool Session::SendEventWithSpi(const Event& ev, SpiType spi)
{
    SerBuffer buf;
    if (!ev.Serialize(buf)) return false;
    ByteStream plain(reinterpret_cast<const uint8_t*>(buf.GetData()), buf.GetLength());
    SecureBuffer sb(spi);
    if (!sb.Create_notRWM(plain)) return false;
    std::vector<uint8_t> frame;
    if (!BuildFrame(sb.GetDataPtr(), static_cast<size_t>(sb.GetSize()), frame)) return false;
    if (!m_sock.SendAll(frame.data(), frame.size())) return false;
    ++m_stats.sentEvents;
    return true;
}

bool Session::SendEvent(const Event& ev)
{
    if (m_state == State::Closed) return false;
    return SendEventWithSpi(ev, m_spi);
}

bool Session::HandleSecurityHandshake(const Event& ev)
{
    Event work = ev;   // payload 可能帶壓縮旗標
    if (work.payload.IsCompressed()) {
        if (!work.payload.UnCompress()) return false;
    }
    Serializer ks;
    if (!ks.BeginReading(&work.payload)) return false;
    uint16_t spiRemote = 0;
    SecurityAssociation sa;
    const bool ok = ks.Get(spiRemote) && GetSecurityAssociation(ks, sa);
    ks.EndReading();
    if (!ok) return false;
    (void)spiRemote;   // 原版不以封包 SPI 入表，而是自擲新 SPI（Session.h）
    // 以自己的隨機 SPI 存入 SADB（對應原 KSADatabase::Insert(OUT SpiType&, IN sa)）
    SpiType localSpi = SADatabase::Instance().InsertWithNewSpi(sa);
    if (localSpi == 0) return false;
    m_spi = localSpi;
    m_state = State::Secured;
    return true;
}

Session::RecvResult Session::HandleSecureFrame(const uint8_t* secureBytes, size_t len)
{
    // 原版：以 session 自身 SPI 建構 KSecureBuffer（忽略封包頭 SPI）
    SecureBuffer dec(m_spi, secureBytes, static_cast<unsigned long>(len));
    if (!dec.IsAuthentic_notRWM(m_checkSeq)) {
        ++m_stats.authFailCount;
        return (m_stats.authFailCount >= m_authFailLimit) ? RecvResult::AuthFailed
                                                          : RecvResult::Timeout;   //  under limit：跳過此訊框繼續收
    }
    ByteStream payload;
    if (!dec.GetPayload_notRWM(payload, /*authentic=*/false)) {
        ++m_stats.authFailCount;
        return (m_stats.authFailCount >= m_authFailLimit) ? RecvResult::AuthFailed
                                                          : RecvResult::Timeout;
    }
    SerBuffer plain;
    if (!plain.Write(payload.data(), payload.size())) return RecvResult::ProtocolError;
    Event ev;
    if (!Event::Deserialize(plain, ev)) return RecvResult::ProtocolError;
    if (ev.payload.IsCompressed()) {
        if (!ev.payload.UnCompress()) return RecvResult::ProtocolError;
    }
    // 任一成功解析的封包（含 E_HEART_BEAT，原碼在 OnRecvCompleted 尾端無條件續期 m_dwHBTick）
    m_lastRecvTick = std::chrono::steady_clock::now();
    if (m_clientFacing) ev.SetFromType(Event::EFT_CLIENT);   // SERV_KEVENT_FROM
    if (ev.eventID == kEventHeartBeat) {
        // 原 case E_HEART_BEAT: break; —— 丟棄、不入佇列
        ++m_stats.heartbeats;
        return RecvResult::Timeout;   //「本幀無 app 可見事件」；RecvEvent 會繼續收
    }
    ++m_stats.recvEvents;
    if (ev.eventID == kEventAcceptConnectionNot) {
        return HandleSecurityHandshake(ev) ? RecvResult::Handshake : RecvResult::ProtocolError;
    }
    m_pending.push_back(std::move(ev));
    return RecvResult::Event;
}

Session::RecvResult Session::RecvEvent(Event& out, int recvTimeoutMs)
{
    if (m_state == State::Closed) return RecvResult::Closed;
    if (ZombieExpired()) { Close(); return RecvResult::ZombieKicked; }
    // 先消化同批次佇列
    if (!m_pending.empty()) {
        out = std::move(m_pending.front());
        m_pending.pop_front();
        return RecvResult::Event;
    }
    m_sock.SetRecvTimeout(recvTimeoutMs);

    std::vector<uint8_t> rx(64 * 1024);
    for (;;) {
        int n = m_sock.Recv(rx.data(), rx.size());
        if (n == 0) { Close(); return RecvResult::Closed; }
        if (n < 0) {
            if (ZombieExpired()) { Close(); return RecvResult::ZombieKicked; }
            return RecvResult::Timeout;                // 含 SO_RCVTIMEO 逾時
        }

        RecvResult batch = RecvResult::Timeout;        // 預設：本批沒有 app 事件
        m_rx.Feed(rx.data(), static_cast<size_t>(n),
                  [this, &batch](const uint8_t* fb, size_t len) {
                      RecvResult r = HandleSecureFrame(fb, len);
                      if (r == RecvResult::AuthFailed) batch = r;
                      else if (r == RecvResult::ProtocolError && batch != RecvResult::AuthFailed) batch = r;
                      else if (r == RecvResult::Handshake && batch == RecvResult::Timeout) batch = r;
                  });
        if (m_rx.Overflowed()) { Close(); return RecvResult::ProtocolError; }
        if (batch == RecvResult::AuthFailed) { Close(); return RecvResult::AuthFailed; }
        if (batch == RecvResult::ProtocolError) { Close(); return RecvResult::ProtocolError; }
        if (batch == RecvResult::Handshake) return RecvResult::Handshake;
        if (!m_pending.empty()) {
            out = std::move(m_pending.front());
            m_pending.pop_front();
            return RecvResult::Event;
        }
        // 本批只有被跳過的驗證失敗訊框（under limit）：繼續讀
    }
}

bool Session::ZombieExpired() const
{
    if (!m_checkHBTick) return false;
    return (std::chrono::steady_clock::now() - m_lastRecvTick) >
           std::chrono::milliseconds(m_zombieTimeoutMs);
}

void Session::Close()
{
    m_sock.Close();
    m_rx.Reset();
    m_pending.clear();
    m_state = State::Closed;
}

} // namespace x2
