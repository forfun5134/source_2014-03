// PacketIO.h — TCP 訊框 framing（對齊原 KSkSession::OnRecvCompleted 的重組邏輯）
//
// 原版線路格式（主 TCP 通道，client↔server 雙向皆同）：
//   [u16 LE frameLen（含自身 2 bytes）][frameLen-2 bytes KSecureBuffer]
// KSecureBuffer 本體：[u16 LE SPI][u32 LE Seq][8B IV][DES-CBC CT][10B ICV]
// 其中 frameLen 上限 = MAX_PACKET_SIZE（原 Overlapped.h = 32768）
//
// 本檔提供兩件事：
//   1) BuildFrame()：把「已加密的 SecureBuffer bytes」包成 TCP 訊框（含長度頭）
//   2) FrameAssembler：TCP 串流重組——餵入任意切塊的位元組，吐出完整訊框；
//      超過 kMaxPacketSize 的宣告長度視為協議錯誤（對應原 SERV_CHECK_RECV_BUFFER_FULL）
//
// 注意：原版長度頭為 USHORT host-order（x86 = LE）；本模組固定 LE 直寫，與原版一致。
#pragma once

#include <cstdint>
#include <cstddef>
#include <cstring>
#include <vector>
#include <functional>
#include <stdexcept>

namespace x2 {

constexpr uint16_t kMaxPacketSize = 32768;

// 組出完整 TCP 訊框：[u16 LE frameLen][payload]；回傳訊框 bytes；payload 過大 → return false
inline bool BuildFrame(const uint8_t* payload, size_t payloadLen, std::vector<uint8_t>& out)
{
    if (payloadLen > kMaxPacketSize - 2) return false;
    out.resize(2 + payloadLen);
    const uint16_t frameLen = static_cast<uint16_t>(2 + payloadLen);
    out[0] = static_cast<uint8_t>(frameLen & 0xFF);
    out[1] = static_cast<uint8_t>((frameLen >> 8) & 0xFF);
    if (payloadLen) std::memcpy(out.data() + 2, payload, payloadLen);
    return true;
}

// 解析 2 bytes 長度頭（LE）；呼叫端已確認至少 2 bytes 可讀
inline uint16_t ReadFrameLength(const uint8_t* p)
{
    return static_cast<uint16_t>(p[0] | (static_cast<uint16_t>(p[1]) << 8));
}

// TCP 串流重組器：非阻塞、無 socket 依賴、可單元測試
class FrameAssembler
{
public:
    enum class FeedResult : uint8_t { Ok, TooLarge };

    // 餵入位元組；每當一個完整訊框就呼叫 cb(payload, payloadLen)。
    // TooLarge：宣告長度 > kMaxPacketSize 或 < 2 → 協議錯誤，呼叫端應斷線（原版為踢除）
    template <typename F>
    FeedResult Feed(const uint8_t* data, size_t len, F&& cb)
    {
        if (m_overflow) return FeedResult::TooLarge;
        m_buf.insert(m_buf.end(), data, data + len);
        for (;;) {
            if (m_buf.size() < 2) return FeedResult::Ok;   // 長度頭未到齊
            const uint16_t frameLen = ReadFrameLength(m_buf.data());
            if (frameLen < 2 || frameLen > kMaxPacketSize) { m_overflow = true; return FeedResult::TooLarge; }
            if (m_buf.size() < frameLen) return FeedResult::Ok;  // 訊框未收完
            if (frameLen > 2) cb(m_buf.data() + 2, frameLen - 2);
            else cb(nullptr, 0);                               // 只含長度頭的空訊框
            m_buf.erase(m_buf.begin(), m_buf.begin() + frameLen);
        }
    }

    size_t PendingBytes() const { return m_buf.size(); }
    bool   Overflowed() const { return m_overflow; }
    void   Reset() { m_buf.clear(); m_overflow = false; }

private:
    std::vector<uint8_t> m_buf;
    bool m_overflow = false;
};

} // namespace x2
