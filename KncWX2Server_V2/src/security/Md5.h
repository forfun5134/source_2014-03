// Md5.h — MD5（RFC 1321）自帶實作，供 HMAC-MD5 使用。
// 正確性以測試向量比對（tests/test_security.cpp）：
//   MD5("")   = d41d8cd98f00b204e9800998ecf8427e
//   MD5("abc")= 900150983cd24fb0d6963f7d28e17f72
#pragma once

#include <cstdint>
#include <cstddef>
#include <array>
#include <string>
#include <vector>

namespace x2 { namespace security {

class Md5
{
public:
    Md5();
    void Update(const void* data, size_t len);
    std::array<uint8_t, 16> Final();

    static std::array<uint8_t, 16> Hash(const void* data, size_t len);
    static std::string HexDigest(const void* data, size_t len);

private:
    void ProcessBlock(const uint8_t* block);

    uint64_t m_totalLen = 0;
    uint8_t  m_block[64] = {};
    size_t   m_blockLen = 0;
    uint32_t m_a, m_b, m_c, m_d;
};

}} // namespace x2::security
