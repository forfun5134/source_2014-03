// ByteStream.h — KncSecurity 的 KByteStream 對應（byte 的 std::vector 封裝）
#pragma once

#include <cstdint>
#include <vector>
#include <cstring>
#include <algorithm>
#include "../core/Platform.h"

namespace x2 { namespace security {

class ByteStream : public std::vector<uint8_t>
{
public:
    ByteStream() = default;
    ByteStream(const uint8_t* data, size_t size) : std::vector<uint8_t>(data, data + size) {}
    ByteStream(std::initializer_list<uint8_t> il) : std::vector<uint8_t>(il) {}
    explicit ByteStream(size_t count, uint8_t value = 0) : std::vector<uint8_t>(count, value) {}
    template <typename It> ByteStream(It first, It last) : std::vector<uint8_t>(first, last) {}

    template <typename T>
    void AppendRaw(const T& v) { AppendRaw(&v, sizeof(T)); }
    void AppendRaw(const void* p, size_t n)
    {
        const uint8_t* b = static_cast<const uint8_t*>(p);
        insert(end(), b, b + n);
    }
    void Append(const void* p, size_t n) { AppendRaw(p, n); }
    template <typename T>
    void Append(const T& v) { AppendRaw(&v, sizeof(T)); }

    void Assign(const void* p, size_t n) { const uint8_t* b = static_cast<const uint8_t*>(p); assign(b, b + n); }
    template <typename T>
    void Assign(const T& v) { Assign(&v, sizeof(T)); }
    void Assign(const char* s, size_t n) { assign(s, s + n); }
};

}} // namespace x2::security
