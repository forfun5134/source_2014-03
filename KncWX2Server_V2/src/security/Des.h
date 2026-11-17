// Des.h — DES（FIPS 46-3）自帶實作，供 KSecureBuffer 的 DES-CBC 使用。
//   明確的位元表實作；正確性以測試向量交叉確認：
//     Key=133457799BBCDFF1 Plaintext=0123456789ABCDEF → Ciphertext=85E813540F0AB405
//   並以 pycryptodome/OpenSSL 對多組隨機向量做端對端比對（開發期驗證）。
#pragma once

#include <cstdint>
#include <cstddef>

namespace x2 { namespace security {

class Des
{
public:
    // key[8]（56-bit 有效位元 + parity bits，與 KncSecurity 相同：直接取 8 bytes）
    void SetKey(const uint8_t key[8]);
    void EncryptBlock(const uint8_t in[8], uint8_t out[8]) const;
    void DecryptBlock(const uint8_t in[8], uint8_t out[8]) const;

private:
    void Rounds(uint64_t& block, bool encrypt) const;
    uint64_t m_subKey[16] = {};
};

}} // namespace x2::security
