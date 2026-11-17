// SecureBuffer.h — 對應原 KSecureBuffer（KNCSDK），線路相容實作（not-RWM 模式）
// 線路格式（全部小端，與原 Windows 實作相同）：
//   [SPI: uint16 LE][SequenceNum: uint32 LE][IV: 8 bytes]
//   [DES-CBC(key=default/隨機 CryptoKey)(payload || 1..N padding || padlen)]
//   [ICV: 10 bytes = HMAC-MD5(AuthKey, SPI||Seq||IV||CT) 截斷]
#pragma once

#include <cstdint>
#include "ByteStream.h"
#include "SADatabase.h"

namespace x2 { namespace security {

class SecureBuffer
{
public:
    SecureBuffer() : m_spi(0) {}
    explicit SecureBuffer(SpiType spi) : m_spi(spi) {}
    SecureBuffer(SpiType spi, const void* data, unsigned long bytes)
        : m_spi(spi) { m_buf.assign(static_cast<const uint8_t*>(data),
                                       static_cast<const uint8_t*>(data) + bytes); }

    bool Create_notRWM(const ByteStream& payload);          // 加密
    bool IsAuthentic_notRWM(bool checkSequenceNum = true);  // 驗證（ICV + 可選 seq）
    bool GetPayload_notRWM(ByteStream& payload, bool authentic = true, bool checkSequenceNum = true); // 解密

    const uint8_t* GetDataPtr() const { return m_buf.data(); }
    unsigned long GetSize() const { return static_cast<unsigned long>(m_buf.size()); }
    SpiType GetSPI() const { return m_spi; }

private:
    SecurityAssociation& GetSA();
    const SecurityAssociation& GetSA() const;

    bool IsValidSPIndex(SpiType& spi) const;
    bool IsValidSize() const;
    bool IsValidICV() const;
    bool IsValidSequenceNum_notRWM(uint32_t& sequenceNum);
    bool IsValidPadding(const ByteStream& payload, unsigned long& padBytes) const;

    ByteStream GenerateIV() const;
    ByteStream GenerateCrypt(const ByteStream& payload, const ByteStream& iv) const;

    ByteStream m_buf;
    SpiType m_spi;
};

}} // namespace x2::security
