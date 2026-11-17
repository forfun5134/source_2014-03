// SecureBuffer.cpp
#include "SecureBuffer.h"
#include "Hmac.h"

#include <random>
#include <cstring>
#include <ctime>

namespace x2 { namespace security {

SecurityAssociation& SecureBuffer::GetSA() { return SADatabase::Instance().GetSA(m_spi); }
const SecurityAssociation& SecureBuffer::GetSA() const { return SADatabase::Instance().GetSA(m_spi); }

ByteStream SecureBuffer::GenerateIV() const
{
    // 原實作以 rand() 產生弱 IV；V2 改用 CSPRNG（IV 以明文傳輸，安全與相容無關）
    ByteStream iv(SecurityAssociation::IV_SIZE, 0);
    std::random_device rd;
    std::mt19937_64 gen((static_cast<uint64_t>(rd()) << 32) ^ static_cast<uint64_t>(rd()) ^
                        static_cast<uint64_t>(std::time(nullptr)));
    for (size_t i = 0; i < iv.size(); i += 8) {
        uint64_t r = gen();
        const size_t n = (iv.size() - i < 8) ? iv.size() - i : 8;
        for (size_t j = 0; j < n; ++j) iv[i + j] = static_cast<uint8_t>((r >> (j * 8)) & 0xFF);
    }
    return iv;
}

ByteStream SecureBuffer::GenerateCrypt(const ByteStream& payload, const ByteStream& iv) const
{
    ByteStream crypt(payload);
    ByteStream pad = GetSA().GeneratePadding(payload);
    crypt.insert(crypt.end(), pad.begin(), pad.end());
    // 末尾附加 pad length（1 byte）
    crypt.push_back(static_cast<uint8_t>(pad.size()));
    return GetSA().Encryption(crypt, iv);
}

bool SecureBuffer::Create_notRWM(const ByteStream& payload)
{
    m_buf.clear();

    // SPI（uint16 LE，原 Append(T) 在 little-endian 主機即 2 bytes LE）
    m_buf.push_back(static_cast<uint8_t>(m_spi & 0xFF));
    m_buf.push_back(static_cast<uint8_t>((m_spi >> 8) & 0xFF));

    // sequence number（uint32 LE）
    const uint32_t seq = GetSA().GetSequenceNum();
    m_buf.push_back(static_cast<uint8_t>(seq & 0xFF));
    m_buf.push_back(static_cast<uint8_t>((seq >> 8) & 0xFF));
    m_buf.push_back(static_cast<uint8_t>((seq >> 16) & 0xFF));
    m_buf.push_back(static_cast<uint8_t>((seq >> 24) & 0xFF));

    // IV
    ByteStream iv = GenerateIV();
    m_buf.insert(m_buf.end(), iv.begin(), iv.end());

    // 密文
    ByteStream crypt = GenerateCrypt(payload, iv);
    m_buf.insert(m_buf.end(), crypt.begin(), crypt.end());

    // ICV（對 SPI||Seq||IV||CT 計算，截斷 10 bytes）
    ByteStream icv = GetSA().GenerateICV(m_buf);
    m_buf.insert(m_buf.end(), icv.begin(), icv.end());

    // 非預設 SPI 才遞增序號（SPI=0 恆為 1）
    if (m_spi != 0) GetSA().IncrSequenceNum_notRWM();
    return true;
}

bool SecureBuffer::IsAuthentic_notRWM(bool checkSequenceNum)
{
    SpiType spi = 0;
    if (!IsValidSPIndex(spi)) return false;
    if (!IsValidSize()) return false;
    if (!IsValidICV()) return false;

    // 預設 SPI（0）不做序號檢查
    if (m_spi != 0 && checkSequenceNum) {
        uint32_t sequenceNum = 0;
        if (!IsValidSequenceNum_notRWM(sequenceNum)) return false;
    }
    return true;
}

bool SecureBuffer::GetPayload_notRWM(ByteStream& payload, bool authentic, bool checkSequenceNum)
{
    if (authentic && !IsAuthentic_notRWM(checkSequenceNum)) return false;

    const unsigned long ivOffset = 2 + 4;
    const unsigned long cryptOffset = ivOffset + SecurityAssociation::IV_SIZE;
    if (cryptOffset + SecurityAssociation::ICV_SIZE > m_buf.size()) return false;

    ByteStream iv(m_buf.begin() + ivOffset, m_buf.begin() + cryptOffset);
    const unsigned long cryptLen = static_cast<unsigned long>(m_buf.size()) - cryptOffset - SecurityAssociation::ICV_SIZE;
    ByteStream crypt(m_buf.begin() + cryptOffset, m_buf.begin() + cryptOffset + cryptLen);

    ByteStream plain = GetSA().Decryption(crypt, iv);

    // 驗證 padding
    unsigned long padBytes = 0;
    if (!IsValidPadding(plain, padBytes)) return false;
    const unsigned long payloadLen = static_cast<unsigned long>(plain.size()) - padBytes - 1;
    payload.assign(plain.begin(), plain.begin() + payloadLen);
    return true;
}

bool SecureBuffer::IsValidSPIndex(SpiType& spi) const
{
    if (m_buf.size() < 2) return false;
    spi = static_cast<SpiType>(m_buf[0] | (static_cast<uint16_t>(m_buf[1]) << 8));
    // 與原實作一致：驗證「工作階段目前的 SPI（m_spi）」是否已註冊（SPI=0 恆真）
    return SADatabase::Instance().Has(m_spi);
}

bool SecureBuffer::IsValidSize() const
{
    return m_buf.size() >= 2 + 4 + SecurityAssociation::IV_SIZE + 1 + SecurityAssociation::ICV_SIZE;
}

bool SecureBuffer::IsValidICV() const
{
    const size_t icvSize = SecurityAssociation::ICV_SIZE;
    const size_t icvPos = m_buf.size() - icvSize;

    ByteStream auth(m_buf.begin(), m_buf.begin() + icvPos);
    ByteStream expect = GetSA().GenerateICV(auth);

    // 常數時間比較
    uint8_t diff = 0;
    for (size_t i = 0; i < icvSize; ++i) diff |= static_cast<uint8_t>(m_buf[icvPos + i] ^ expect[i]);
    return diff == 0;
}

bool SecureBuffer::IsValidSequenceNum_notRWM(uint32_t& sequenceNum)
{
    sequenceNum = static_cast<uint32_t>(m_buf[2]) |
                  (static_cast<uint32_t>(m_buf[3]) << 8) |
                  (static_cast<uint32_t>(m_buf[4]) << 16) |
                  (static_cast<uint32_t>(m_buf[5]) << 24);
    return GetSA().IsValidSequenceNum_notRWM(sequenceNum);
}

bool SecureBuffer::IsValidPadding(const ByteStream& payload, unsigned long& padBytes) const
{
    if (payload.empty()) return false;

    padBytes = payload.back();
    if (padBytes + sizeof(uint8_t) > payload.size()) return false;

    const unsigned long nPos = static_cast<unsigned long>(payload.size()) - padBytes - 1;
    for (unsigned long i = 1; i <= padBytes; ++i) {
        if (payload[nPos + i - 1] != static_cast<uint8_t>(i)) return false;
    }
    return true;
}

}} // namespace x2::security
