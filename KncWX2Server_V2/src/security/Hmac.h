// Hmac.h — HMAC-MD5（RFC 2104）。KSecureBuffer 的 ICV = HMAC-MD5(authKey, data) 截斷 10 bytes。
#pragma once

#include "Md5.h"
#include <array>
#include <cstring>

namespace x2 { namespace security {

inline std::array<uint8_t, 16> HmacMd5(const void* key, size_t keyLen, const void* data, size_t dataLen)
{
    uint8_t keyBlock[64] = {};
    if (keyLen > 64) {
        auto kf = Md5::Hash(key, keyLen);
        std::memcpy(keyBlock, kf.data(), 16);
    } else {
        std::memcpy(keyBlock, key, keyLen);
    }

    uint8_t ipad[64], opad[64];
    for (int i = 0; i < 64; ++i) {
        ipad[i] = static_cast<uint8_t>(keyBlock[i] ^ 0x36);
        opad[i] = static_cast<uint8_t>(keyBlock[i] ^ 0x5C);
    }

    Md5 inner;
    inner.Update(ipad, 64);
    inner.Update(data, dataLen);
    auto innerDigest = inner.Final();

    Md5 outer;
    outer.Update(opad, 64);
    outer.Update(innerDigest.data(), innerDigest.size());
    return outer.Final();
}

}} // namespace x2::security
