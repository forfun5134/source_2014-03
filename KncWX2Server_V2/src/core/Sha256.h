// Sha256.h — SHA-256（FIPS 180-4）自帶實作。
// 用途：V2 密碼雜湊（取代原版 users.passwd 疑似 MD5 明文摘要）。
// 正確性以 FIPS/公開測試向量 + openssl CLI 交叉驗證（tools/verify_sha256.sh / tests）。
#pragma once

#include <cstdint>
#include <cstddef>
#include <array>
#include <string>

namespace x2 {

class Sha256
{
public:
    Sha256();
    void Update(const void* data, size_t len);
    std::array<uint8_t, 32> Final();

    static std::array<uint8_t, 32> Hash(const void* data, size_t len);
    static std::string HexDigest(const void* data, size_t len);
    static std::string HexDigest(const std::string& data);

private:
    void ProcessBlock(const uint8_t* block);

    uint64_t m_totalLen = 0;
    uint8_t  m_block[64] = {};
    size_t   m_blockLen = 0;
    uint32_t m_h[8] = {};
};

// 常數時間比較（避免時序側通道）；兩 digest 長度不同回傳 false
bool ConstantTimeEquals(const uint8_t* a, const uint8_t* b, size_t len);
bool ConstantTimeHexEquals(const std::string& a, const std::string& b);

} // namespace x2
