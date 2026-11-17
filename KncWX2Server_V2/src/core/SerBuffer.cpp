// SerBuffer.cpp
#include "SerBuffer.h"

#include "../../third_party/miniz/miniz.h"
#include <cstring>

namespace x2 {

bool SerBuffer::Write(const void* data, size_t len)
{
    if (len == 0) return true;
    if (!data) return false;
    const size_t old = m_buf.size();
    m_buf.resize(old + len);
    std::memcpy(m_buf.data() + old, data, len);
    return true;
}

bool SerBuffer::Read(void* out, size_t len)
{
    if (len == 0) return true;
    if (!out) return false;
    if (len > m_buf.size() - m_readOffset) return false;
    std::memcpy(out, m_buf.data() + m_readOffset, len);
    m_readOffset += len;
    return true;
}

void SerBuffer::Clear()
{
    m_bCompress = false;
    m_buf.clear();
    m_readOffset = 0;
}

bool SerBuffer::Compress()
{
    if (m_bCompress) return true;

    const mz_ulong originSize = static_cast<mz_ulong>(m_buf.size());
    std::vector<byte> vec(static_cast<size_t>(mz_compressBound(originSize)));
    mz_ulong destLen = static_cast<mz_ulong>(vec.size());
    // 原版使用 compress2(..., level=1)
    if (mz_compress2(vec.data(), &destLen, m_buf.data(), originSize, MZ_BEST_SPEED) != MZ_OK)
        return false;
    vec.resize(static_cast<size_t>(destLen));

    // 與原實作一致：原始長度以「小端」未交換的 4 bytes 前置
    std::vector<byte> packed;
    const uint32_t le32 = static_cast<uint32_t>(originSize);
    packed.resize(4);
    packed[0] = static_cast<byte>(le32 & 0xFF);
    packed[1] = static_cast<byte>((le32 >> 8) & 0xFF);
    packed[2] = static_cast<byte>((le32 >> 16) & 0xFF);
    packed[3] = static_cast<byte>((le32 >> 24) & 0xFF);
    packed.insert(packed.end(), vec.begin(), vec.end());

    m_buf.swap(packed);
    m_readOffset = 0;
    m_bCompress = true;
    return true;
}

bool SerBuffer::UnCompress()
{
    if (!m_bCompress) return true;
    if (m_buf.size() < 4) return false;

    m_readOffset = 0;
    uint32_t originSize = 0;
    byte hdr[4];
    if (!Read(hdr, 4)) return false;
    originSize = static_cast<uint32_t>(hdr[0]) | (static_cast<uint32_t>(hdr[1]) << 8) |
                 (static_cast<uint32_t>(hdr[2]) << 16) | (static_cast<uint32_t>(hdr[3]) << 24);

    std::vector<byte> out(originSize);
    mz_ulong destLen = static_cast<mz_ulong>(out.size());
    if (mz_uncompress(out.data(), &destLen, m_buf.data() + 4, static_cast<mz_ulong>(m_buf.size() - 4)) != MZ_OK)
        return false;
    if (destLen != originSize) return false;

    m_buf.swap(out);
    m_readOffset = 0;
    m_bCompress = false;
    return true;
}

} // namespace x2
