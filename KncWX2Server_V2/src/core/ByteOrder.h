// ByteOrder.h — 位元組序工具（與原 KNCSDK ByteOrder.h 語意一致：
// 多位元組整數一律以 big-endian（網路序）上線；float/double 亦先交換位元組）
#pragma once

#include <cstdint>
#include <cstring>

namespace x2 {

inline uint16_t SwapInt16(uint16_t v) { return static_cast<uint16_t>((v >> 8) | (v << 8)); }
inline uint32_t SwapInt32(uint32_t v)
{
    return ((v & 0x000000FFu) << 24) | ((v & 0x0000FF00u) << 8) |
           ((v & 0x00FF0000u) >> 8)  | ((v & 0xFF000000u) >> 24);
}
inline uint64_t SwapInt64(uint64_t v)
{
    return (SwapInt32(static_cast<uint32_t>(v & 0xFFFFFFFFu)) * 0x100000000ull) |
            SwapInt32(static_cast<uint32_t>(v >> 32));
}

#if defined(__BYTE_ORDER__) && defined(__ORDER_BIG_ENDIAN__) && (__BYTE_ORDER__ == __ORDER_BIG_ENDIAN__)
#  define X2_HOST_IS_BIG_ENDIAN 1
#else
#  define X2_HOST_IS_BIG_ENDIAN 0
#endif

// 主機序 → 網路序（big-endian）；主機本身即 big-endian 時為恆等
template <typename T> T HToNet(T v);
template <> inline int16_t  HToNet<int16_t>(int16_t v)   { return static_cast<int16_t>(X2_HOST_IS_BIG_ENDIAN ? v : SwapInt16((uint16_t)v)); }
template <> inline uint16_t HToNet<uint16_t>(uint16_t v) { return X2_HOST_IS_BIG_ENDIAN ? v : SwapInt16(v); }
template <> inline int32_t  HToNet<int32_t>(int32_t v)   { return static_cast<int32_t>(X2_HOST_IS_BIG_ENDIAN ? v : SwapInt32((uint32_t)v)); }
template <> inline uint32_t HToNet<uint32_t>(uint32_t v) { return X2_HOST_IS_BIG_ENDIAN ? v : SwapInt32(v); }
template <> inline int64_t  HToNet<int64_t>(int64_t v)   { return static_cast<int64_t>(X2_HOST_IS_BIG_ENDIAN ? v : SwapInt64((uint64_t)v)); }
template <> inline uint64_t HToNet<uint64_t>(uint64_t v) { return X2_HOST_IS_BIG_ENDIAN ? v : SwapInt64(v); }

inline float HToNetFloat(float v)
{
#if X2_HOST_IS_BIG_ENDIAN
    return v;
#else
    uint32_t u; std::memcpy(&u, &v, 4); u = SwapInt32(u); float r; std::memcpy(&r, &u, 4); return r;
#endif
}
inline double HToNetDouble(double v)
{
#if X2_HOST_IS_BIG_ENDIAN
    return v;
#else
    uint64_t u; std::memcpy(&u, &v, 8); u = SwapInt64(u); double r; std::memcpy(&r, &u, 8); return r;
#endif
}

template <typename T> T NetToHost(T v) { return HToNet(v); } // 對合運算
inline float  NetToHostFloat(float v) { return HToNetFloat(v); }
inline double NetToHostDouble(double v) { return HToNetDouble(v); }

} // namespace x2
