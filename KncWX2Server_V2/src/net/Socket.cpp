// Socket.cpp — Socket 實作（POSIX + Winsock 雙後端）
#include "Socket.h"
#include "../core/Platform.h"

#include <cerrno>
#include <cstring>
#include <cstdlib>
#include <cstdio>

#if X2_PLATFORM_WINDOWS
#   ifndef WIN32_LEAN_AND_MEAN
#   define WIN32_LEAN_AND_MEAN
#   endif
#   include <winsock2.h>
#   include <ws2tcpip.h>
#   pragma comment(lib, "ws2_32.lib")
#else
#   include <sys/types.h>
#   include <sys/socket.h>
#   include <netinet/in.h>
#   include <netinet/tcp.h>
#   include <arpa/inet.h>
#   include <netdb.h>
#   include <unistd.h>
#   include <fcntl.h>
#endif

namespace x2 {

#if X2_PLATFORM_WINDOWS
static constexpr unsigned long long kInvalidSocket = ~0ULL;
#else
static constexpr int kInvalidSocket = -1;
#endif

bool Socket::CreateTcp(Socket& out)
{
    out.Close();
#if X2_PLATFORM_WINDOWS
    SOCKET s = ::WSASocketW(AF_INET, SOCK_STREAM, IPPROTO_TCP, nullptr, 0, WSA_FLAG_OVERLAPPED);
    if (s == INVALID_SOCKET) return false;
    out.m_h.raw = static_cast<unsigned long long>(s);
    return true;
#else
    int s = ::socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (s < 0) return false;
    out.m_h.raw = s;
    return true;
#endif
}

bool Socket::IsValid() const
{
#if X2_PLATFORM_WINDOWS
    return m_h.raw != kInvalidSocket;
#else
    return m_h.raw >= 0;
#endif
}

void Socket::Close()
{
    if (!IsValid()) return;
#if X2_PLATFORM_WINDOWS
    ::closesocket(static_cast<SOCKET>(m_h.raw));
#else
    ::shutdown(m_h.raw, SHUT_RDWR);   // 失敗（未 connect）可忽略
    ::close(m_h.raw);
#endif
    Invalidate();
}

void Socket::Invalidate()
{
#if X2_PLATFORM_WINDOWS
    m_h.raw = kInvalidSocket;
#else
    m_h.raw = -1;
#endif
}

bool Socket::SetReuseAddr(bool on)
{
    if (!IsValid()) return false;
    int v = on ? 1 : 0;
#if X2_PLATFORM_WINDOWS
    return ::setsockopt(static_cast<SOCKET>(m_h.raw), SOL_SOCKET, SO_REUSEADDR,
                        reinterpret_cast<const char*>(&v), sizeof(v)) == 0;
#else
    return ::setsockopt(m_h.raw, SOL_SOCKET, SO_REUSEADDR, &v, sizeof(v)) == 0;
#endif
}

bool Socket::SetNoDelay(bool on)
{
    if (!IsValid()) return false;
    int v = on ? 1 : 0;
#if X2_PLATFORM_WINDOWS
    return ::setsockopt(static_cast<SOCKET>(m_h.raw), IPPROTO_TCP, TCP_NODELAY,
                        reinterpret_cast<const char*>(&v), sizeof(v)) == 0;
#else
    return ::setsockopt(m_h.raw, IPPROTO_TCP, TCP_NODELAY, &v, sizeof(v)) == 0;
#endif
}

bool Socket::LocalPort(uint16_t& port) const
{
    if (!IsValid()) return false;
    sockaddr_in addr{};
#if X2_PLATFORM_WINDOWS
    int len = sizeof(addr);
    if (::getsockname(static_cast<SOCKET>(m_h.raw), reinterpret_cast<sockaddr*>(&addr), &len) != 0) return false;
#else
    socklen_t len = sizeof(addr);
    if (::getsockname(m_h.raw, reinterpret_cast<sockaddr*>(&addr), &len) != 0) return false;
#endif
    port = ntohs(addr.sin_port);
    return true;
}

bool Socket::SetRecvTimeout(int milliseconds)
{
    if (!IsValid()) return false;
    if (milliseconds < 0) return false;
#if X2_PLATFORM_WINDOWS
    DWORD v = static_cast<DWORD>(milliseconds);
    return ::setsockopt(static_cast<SOCKET>(m_h.raw), SOL_SOCKET, SO_RCVTIMEO,
                        reinterpret_cast<const char*>(&v), sizeof(v)) == 0;
#else
    struct timeval tv;
    tv.tv_sec = milliseconds / 1000;
    tv.tv_usec = (milliseconds % 1000) * 1000;
    return ::setsockopt(m_h.raw, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof(tv)) == 0;
#endif
}

bool Socket::Bind(uint16_t port, const char* ip)
{
    if (!IsValid()) return false;
    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_port = htons(port);
    if (ip && *ip) {
#if X2_PLATFORM_WINDOWS
        if (::InetPtonA(AF_INET, ip, &addr.sin_addr) != 1) return false;
#else
        if (::inet_pton(AF_INET, ip, &addr.sin_addr) != 1) return false;
#endif
    } else {
        addr.sin_addr.s_addr = htonl(INADDR_ANY);
    }
#if X2_PLATFORM_WINDOWS
    return ::bind(static_cast<SOCKET>(m_h.raw), reinterpret_cast<sockaddr*>(&addr), sizeof(addr)) == 0;
#else
    return ::bind(m_h.raw, reinterpret_cast<sockaddr*>(&addr), sizeof(addr)) == 0;
#endif
}

bool Socket::Listen(int backlog)
{
    if (!IsValid()) return false;
#if X2_PLATFORM_WINDOWS
    return ::listen(static_cast<SOCKET>(m_h.raw), backlog) == 0;
#else
    return ::listen(m_h.raw, backlog) == 0;
#endif
}

bool Socket::Accept(Socket& outPeer)
{
    if (!IsValid()) return false;
    sockaddr_in remote{};
#if X2_PLATFORM_WINDOWS
    int len = sizeof(remote);
    SOCKET s = ::accept(static_cast<SOCKET>(m_h.raw), reinterpret_cast<sockaddr*>(&remote), &len);
    if (s == INVALID_SOCKET) return false;
    outPeer.Close();
    outPeer.m_h.raw = static_cast<unsigned long long>(s);
    return true;
#else
    socklen_t len = sizeof(remote);
    int s = ::accept(m_h.raw, reinterpret_cast<sockaddr*>(&remote), &len);
    if (s < 0) return false;
    outPeer.Close();
    outPeer.m_h.raw = s;
    return true;
#endif
}

bool Socket::Connect(const std::string& host, uint16_t port)
{
    if (!IsValid()) return false;
    // 數字 IP 直接轉；否則走 getaddrinfo（支援主機名）
    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_port = htons(port);
#if X2_PLATFORM_WINDOWS
    if (::InetPtonA(AF_INET, host.c_str(), &addr.sin_addr) == 1) {
        return ::connect(static_cast<SOCKET>(m_h.raw), reinterpret_cast<sockaddr*>(&addr), sizeof(addr)) == 0;
    }
#else
    if (::inet_pton(AF_INET, host.c_str(), &addr.sin_addr) == 1) {
        return ::connect(m_h.raw, reinterpret_cast<sockaddr*>(&addr), sizeof(addr)) == 0;
    }
#endif
    struct addrinfo hints{};
    hints.ai_family = AF_INET;
    hints.ai_socktype = SOCK_STREAM;
    struct addrinfo* res = nullptr;
    if (::getaddrinfo(host.c_str(), nullptr, &hints, &res) != 0 || !res) return false;
    bool ok = false;
    if (res->ai_family == AF_INET) {
        auto* a = reinterpret_cast<sockaddr_in*>(res->ai_addr);
        a->sin_port = htons(port);
#if X2_PLATFORM_WINDOWS
        ok = (::connect(static_cast<SOCKET>(m_h.raw), reinterpret_cast<sockaddr*>(a), sizeof(*a)) == 0);
#else
        ok = (::connect(m_h.raw, reinterpret_cast<sockaddr*>(a), sizeof(*a)) == 0);
#endif
    }
    ::freeaddrinfo(res);
    return ok;
}

bool Socket::SendAll(const void* data, size_t len)
{
    if (!IsValid() || (!data && len)) return false;
    const uint8_t* p = static_cast<const uint8_t*>(data);
    size_t left = len;
    while (left > 0) {
#if X2_PLATFORM_WINDOWS
        int n = ::send(static_cast<SOCKET>(m_h.raw), reinterpret_cast<const char*>(p),
                       static_cast<int>(left > 0x7fffffff ? 0x7fffffff : left), 0);
#else
        ssize_t n = ::send(m_h.raw, p, left, MSG_NOSIGNAL);
#endif
        if (n <= 0) return false;
        p += static_cast<size_t>(n);
        left -= static_cast<size_t>(n);
    }
    return true;
}

int Socket::Recv(void* out, size_t len)
{
    if (!IsValid() || !out || len == 0) return -1;
#if X2_PLATFORM_WINDOWS
    int n = ::recv(static_cast<SOCKET>(m_h.raw), static_cast<char*>(out),
                   static_cast<int>(len > 0x7fffffff ? 0x7fffffff : len), 0);
    if (n == SOCKET_ERROR) return -1;   // 含 WSAETIMEDOUT
    return n;
#else
    ssize_t n = ::recv(m_h.raw, out, len, 0);
    return static_cast<int>(n);
#endif
}

const char* Socket::LastErrorString()
{
#if X2_PLATFORM_WINDOWS
    static __declspec(thread) char buf[128];
    int err = WSAGetLastError();
    std::snprintf(buf, sizeof buf, "WSA error %d", err);
    return buf;
#else
    return std::strerror(errno);
#endif
}

} // namespace x2
