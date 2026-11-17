// Session.h — V2 連線 Session 狀態機（對齊原 KSession / KSkSession 的可運作子集）
//
// 完成的部分（對齊原碼行為）：
//   - SPI=0 預設 SA 加解密（與原 client 相容）
//   - 伺服器端（acceptor）在 accept 後主動建立隨機金鑰 SA，以 E_ACCEPT_CONNECTION_NOT
//     將 [SPI u16 BE][SecurityAssociation] 送給對端（以 SPI=0 加密）
//   - 對端（connector）收到後以自己的隨機 SPI 存入 SADB（對應原 KSADatabase::Insert 的 OUT 語意），
//     此後雙方以新 SA 通訊（各自傳送時用自己的 SPI；接收時忽略封包頭 SPI——
//     對應原 IsValidSPIndex 使用 session 的 m_nSPIndex 而非封包頭 SPI 的行為）
//   - ICV 驗證失敗計數（達上限回 AuthFailed 並斷線；預設上限 5）
//   - 序號檢查預設關閉（同原版 NetLayer 預設 m_bCheckSequenceNum=false）
//   - 一個 TCP 區段內多個訊框 → 依序解密並以 m_pending 佇列保留（每次 RecvEvent 吐一個）
//   - E_HEART_BEAT 接收即丟棄（原 case E_HEART_BEAT: break; 不入佇列）；可觀察 stats.heartbeats
//   - 殭屍檢測（原 m_bCheckHBTick + m_dwHBTick）：任一成功解析的封包（含心跳）會更新 m_lastRecvTick；
//     若啟用檢查且 now-lastRecv > zombieTimeout（預設 60s）→ 關閉連線並回 RecvResult::ZombieKicked
//   - SetClientFacing(true)（對應 SERV_KEVENT_FROM 的 SST_CLIENT）：接收到的事件標記 EFT_CLIENT，
//     上層可用 Event::IsValidEventID() 過濾伺服器內部事件 ID（原 GSUserFunction CheckIsValidPacketEvent）
//
// 尚未完成（明確缺口）：
//   - IOCP/epoll 非同步 I/O（目前同步 blocking + SetRecvTimeout）
//   - SERV_KEVENT_FROM 的 SST_SERVER / 其他角色（目前僅 EFT_CLIENT 標記）
//   - 代理（PROXY_ONLY）15s 心跳發送迴圈（SendHeartbeat 已提供，由上層定時器驅動）
//   - LS→GS 等 proxy 角色宏（UNPROXY_ONLY/PROXY_ONLY）語意
#pragma once

#include <cstdint>
#include <deque>
#include <chrono>
#include <string>
#include <vector>

#include "../core/Event.h"
#include "../net/Socket.h"
#include "../net/PacketIO.h"
#include "../security/SADatabase.h"
#include "../security/SecureBuffer.h"

namespace x2 {

class Session
{
public:
    enum class State : uint8_t { Closed, Connected, Secured };
    enum class RecvResult : uint8_t { Event, Handshake, Timeout, Closed, AuthFailed, ProtocolError, ZombieKicked };

    struct Stats
    {
        uint32_t sentEvents = 0;
        uint32_t recvEvents = 0;
        uint32_t authFailCount = 0;
        uint32_t heartbeats = 0;     // 接收並丟棄的 E_HEART_BEAT 數
    };

    explicit Session(uint32_t performerID = 0) : m_performerID(performerID) {}
    ~Session() { Close(); }

    Session(const Session&) = delete;
    Session& operator=(const Session&) = delete;

    // ---- 連線 ----
    // client/connector：連到 host:port
    bool Connect(const std::string& host, uint16_t port);
    // server/acceptor：在 port 上 accept 一條連線（port=0 由 OS 指派；LocalPort 查詢實際 port）
    bool ListenAndAccept(uint16_t port);
    uint16_t LocalPort() const;

    // acceptor 端：建立隨機 SA 並以 E_ACCEPT_CONNECTION_NOT 傳送（以 SPI=0），並將本端切到新 SPI
    bool SendSecurityHandshake();
    // 代理角色：送出 E_HEART_BEAT（原 PROXY_ONLY 分支每 15s 一次；由上層定時器呼叫）
    bool SendHeartbeat();

    // ---- 收發 ----
    // 送出事件（依目前狀態選 SPI 加密；未 secured 前一律 SPI=0）
    bool SendEvent(const Event& ev);
    // 收取一個事件（blocking 至 recvTimeoutMs 逾時）。
    // 若收到 E_ACCEPT_CONNECTION_NOT 會內部完成握手（InsertWithNewSpi、切換 m_spi）並回傳 Handshake。
    // E_HEART_BEAT 一律內部丟棄不回傳；逾時回 Timeout；60s 無封包且啟用心跳檢查回 ZombieKicked。
    RecvResult RecvEvent(Event& out, int recvTimeoutMs);

    // ---- 狀態 ----
    State GetState() const { return m_state; }
    security::SpiType CurrentSpi() const { return m_spi; }
    const Stats& GetStats() const { return m_stats; }
    void SetAuthFailLimit(uint32_t n) { m_authFailLimit = n; }       // 預設 5（對應 m_uiPacketAuthFailLimit）
    void SetCheckSequenceNum(bool v) { m_checkSeq = v; }             // 預設 false（同原版）
    // 殭屍檢測（對應原 m_bCheckHBTick、預設 true）；timeoutMs 對應 60000ms
    void SetCheckHBTick(bool v) { m_checkHBTick = v; }
    void SetZombieTimeout(uint32_t timeoutMs) { m_zombieTimeoutMs = timeoutMs; }
    // SERV_KEVENT_FROM：此 session 面向客戶端，接收事件標記為 EFT_CLIENT
    void SetClientFacing(bool v) { m_clientFacing = v; }
    bool IsValid() const { return m_sock.IsValid(); }
    void Close();

private:
    RecvResult HandleSecureFrame(const uint8_t* secureBytes, size_t len);
    bool HandleSecurityHandshake(const Event& ev);
    bool SendEventWithSpi(const Event& ev, security::SpiType spi);
    bool ZombieExpired() const;

    Socket m_sock;
    FrameAssembler m_rx;
    std::deque<Event> m_pending;   // 同一批次內解出的多個事件
    State m_state = State::Closed;
    security::SpiType m_spi = 0;        // 0 = 預設 SA（與原 client 相容）
    uint32_t m_authFailLimit = 5;
    bool m_checkSeq = false;
    bool m_checkHBTick = true;
    uint32_t m_zombieTimeoutMs = 60000;
    bool m_clientFacing = false;
    uint32_t m_performerID = 0;
    std::chrono::steady_clock::time_point m_lastRecvTick = std::chrono::steady_clock::now();
    Stats m_stats;
};

} // namespace x2
