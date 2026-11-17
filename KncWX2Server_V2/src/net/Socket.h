// Socket.h — RAII TCP socket（Linux/POSIX 為主；Windows 以 X2_PLATFORM_WINDOWS 切換 winsock2）
// 對應原 KAccepter / KSocketObject 的「最小可用子集」：
//   - TCP、IPv4、blocking、SOCK_STREAM
//   - bind 固定 0.0.0.0:port（伺服器端）、SO_REUSEADDR
//   - TCP_NODELAY 可選（原 KAccepter::Init(bNagleAlgOn=false) 對應此路徑）
//   - 非 RAII 的全域狀態（WSAStartup）以 WsaGuard 管理
// 注意：原版為 IOCP overlapped 非同步模型；本檔是同步封裝，供 V2 階段 1 使用，
//       未來 IOCP/epoll 後端接上後將被取代，但 API 會保持 source-compatible。
#pragma once

#include <cstdint>
#include <cstddef>
#include <string>

#if defined(_WIN32) || defined(_WIN64)
#   define X2_PLATFORM_WINDOWS 1
#   ifndef WIN32_LEAN_AND_MEAN
#   define WIN32_LEAN_AND_MEAN
#   endif
#   ifndef NOMINMAX
#   define NOMINMAX
#   endif
#   include <winsock2.h>
#   include <ws2tcpip.h>
#else
#   define X2_PLATFORM_POSIX 1
#endif

namespace x2 {

// Windows: WSAStartup/WSACleanup 的 RAII 守衛（POSIX 上為空物件）
class WsaGuard
{
public:
    WsaGuard()
    {
#if X2_PLATFORM_WINDOWS
        WSADATA wsa{};
        m_ok = (WSAStartup(MAKEWORD(2, 2), &wsa) == 0);
#else
        m_ok = true;
#endif
    }
    ~WsaGuard()
    {
#if X2_PLATFORM_WINDOWS
        if (m_ok) WSACleanup();
#endif
    }
    WsaGuard(const WsaGuard&) = delete;
    WsaGuard& operator=(const WsaGuard&) = delete;
    bool Ok() const { return m_ok; }
private:
    bool m_ok = false;
};

struct SocketHandle
{
#if X2_PLATFORM_WINDOWS
    unsigned long long raw = ~0ULL;   // INVALID_SOCKET
#else
    int raw = -1;
#endif
};

class Socket
{
public:
    Socket() = default;
    ~Socket() { Close(); }

    Socket(const Socket&) = delete;
    Socket& operator=(const Socket&) = delete;
    Socket(Socket&& o) noexcept { *this = static_cast<Socket&&>(o); }
    Socket& operator=(Socket&& o) noexcept
    {
        if (this != &o) { Close(); m_h = o.m_h; o.Invalidate(); }
        return *this;
    }

    static bool CreateTcp(Socket& out);              // 成功後 IsValid() == true
    bool Bind(uint16_t port, const char* ip = nullptr); // ip==nullptr → 0.0.0.0
    bool Listen(int backlog = 64);
    bool Accept(Socket& outPeer);                    // 阻塞接受；連線失敗回傳 false
    bool Connect(const std::string& host, uint16_t port);

    // 部分傳送安全：內部迴圈直到全部送出或出錯；回傳 false 表示連線中斷/錯誤
    bool SendAll(const void* data, size_t len);
    // 回傳實際讀取位元組數；0 = 對端關閉；-1 = 錯誤/逾時
    int  Recv(void* out, size_t len);

    bool SetReuseAddr(bool on = true);
    bool SetNoDelay(bool on = true);
    bool SetRecvTimeout(int milliseconds);
    bool LocalPort(uint16_t& port) const;            // 取得本端實際 port（Bind(0) 後查詢）

    bool IsValid() const;
    void Close();
    void Invalidate();
    SocketHandle Handle() const { return m_h; }

    static const char* LastErrorString();

private:
    SocketHandle m_h{};
};

} // namespace x2
