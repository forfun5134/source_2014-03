// SerBuffer.h — 對應原 KSerBuffer（Serializer/SerBuffer.*）
// 位元組相容：
//   - 線路格式 [DWORD 大端 長度][m_bCompress 1 byte][raw bytes] 由 Serializer 的
//     Put/Get(SerBuffer) 負責（見 Event.cpp 的序列化）。
//   - Compress() 的內部格式：[DWORD 小端 原始長度][zlib stream]（與原 zlib compress2(level=1) 相容）
#pragma once

#include "Platform.h"
#include <vector>
#include <cstddef>

namespace x2 {

class SerBuffer
{
public:
    SerBuffer() = default;

    bool Write(const void* data, size_t len);
    bool Read(void* out, size_t len);
    const void* GetData() const { return m_buf.empty() ? nullptr : m_buf.data(); }
    size_t GetLength() const { return m_buf.size(); }
    size_t GetReadLength() const { return m_buf.size() - m_readOffset; }
    size_t GetReadOffset() const { return m_readOffset; }
    void   Clear();
    void   Reset() { m_readOffset = 0; }

    bool IsCompressed() const { return m_bCompress; }
    void SetCompressedFlag(bool v) { m_bCompress = v; }

    // zlib 格式壓縮（level 1，相容原實作）。已壓縮則直接返回 true。
    bool Compress();
    bool UnCompress();

    std::vector<byte>&       MutableBuffer() { return m_buf; }
    const std::vector<byte>& Buffer() const { return m_buf; }

private:
    bool m_bCompress = false;
    std::vector<byte> m_buf;
    size_t m_readOffset = 0;
};

} // namespace x2
