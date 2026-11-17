// Md5.cpp — RFC 1321 實作
#include "Md5.h"
#include <cstring>

namespace x2 { namespace security {

namespace {

inline uint32_t Rotl(uint32_t x, int c) { return (x << c) | (x >> (32 - c)); }

inline uint32_t F(uint32_t b, uint32_t c, uint32_t d) { return (b & c) | (~b & d); }
inline uint32_t G(uint32_t b, uint32_t c, uint32_t d) { return (b & d) | (c & ~d); }
inline uint32_t H(uint32_t b, uint32_t c, uint32_t d) { return b ^ c ^ d; }
inline uint32_t I(uint32_t b, uint32_t c, uint32_t d) { return c ^ (b | ~d); }

// K[i] = floor(2^32 * abs(sin(i + 1)))，預先計算的標準常數表
const uint32_t K[64] = {
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
};
const uint8_t S[64] = {
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
};

} // namespace

Md5::Md5() : m_a(0x67452301u), m_b(0xefcdab89u), m_c(0x98badcfeu), m_d(0x10325476u) {}

void Md5::ProcessBlock(const uint8_t* block)
{
    uint32_t M[16];
    for (int i = 0; i < 16; ++i)
        M[i] = static_cast<uint32_t>(block[i * 4]) |
               (static_cast<uint32_t>(block[i * 4 + 1]) << 8) |
               (static_cast<uint32_t>(block[i * 4 + 2]) << 16) |
               (static_cast<uint32_t>(block[i * 4 + 3]) << 24);

    uint32_t a = m_a, b = m_b, c = m_c, d = m_d;
    for (int i = 0; i < 64; ++i) {
        uint32_t f, g;
        if (i < 16)      { f = F(b, c, d); g = i; }
        else if (i < 32) { f = G(b, c, d); g = (5 * i + 1) & 15; }
        else if (i < 48) { f = H(b, c, d); g = (3 * i + 5) & 15; }
        else             { f = I(b, c, d); g = (7 * i) & 15; }
        uint32_t tmp = d;
        d = c;
        c = b;
        b = b + Rotl(a + f + K[i] + M[g], S[i]);
        a = tmp;
    }
    m_a += a; m_b += b; m_c += c; m_d += d;
}

void Md5::Update(const void* data, size_t len)
{
    m_totalLen += len;
    const uint8_t* p = static_cast<const uint8_t*>(data);
    while (len > 0) {
        size_t take = 64 - m_blockLen;
        if (take > len) take = len;
        std::memcpy(m_block + m_blockLen, p, take);
        m_blockLen += take;
        p += take;
        len -= take;
        if (m_blockLen == 64) {
            ProcessBlock(m_block);
            m_blockLen = 0;
        }
    }
}

std::array<uint8_t, 16> Md5::Final()
{
    // 原始長度（bits）以小端寫入
    uint64_t bitLen = m_totalLen * 8;
    uint8_t pad = 0x80;
    Update(&pad, 1);
    uint8_t zero = 0;
    while (m_blockLen != 56) Update(&zero, 1);
    uint8_t lenBuf[8];
    for (int i = 0; i < 8; ++i) lenBuf[i] = static_cast<uint8_t>((bitLen >> (8 * i)) & 0xFF);
    // 注意：Update 會累加 totalLen，此處寫入長度時不應再計入訊息長度，
    // 因此直接呼叫 ProcessBlock 前的 buffer 填充邏輯：
    std::memcpy(m_block + m_blockLen, lenBuf, 8);
    ProcessBlock(m_block);
    m_blockLen = 0;

    std::array<uint8_t, 16> out{};
    const uint32_t words[4] = { m_a, m_b, m_c, m_d };
    for (int w = 0; w < 4; ++w)
        for (int i = 0; i < 4; ++i)
            out[w * 4 + i] = static_cast<uint8_t>((words[w] >> (8 * i)) & 0xFF);
    return out;
}

std::array<uint8_t, 16> Md5::Hash(const void* data, size_t len)
{
    Md5 md;
    md.Update(data, len);
    return md.Final();
}

std::string Md5::HexDigest(const void* data, size_t len)
{
    auto digest = Hash(data, len);
    char buf[33] = {};
    static const char* hexd = "0123456789abcdef";
    for (int i = 0; i < 16; ++i) {
        buf[i * 2] = hexd[digest[i] >> 4];
        buf[i * 2 + 1] = hexd[digest[i] & 0xF];
    }
    return std::string(buf, 32);
}

}} // namespace x2::security
