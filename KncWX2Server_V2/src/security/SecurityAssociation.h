// SecurityAssociation.h — 對應原 KSecurityAssociation（KNCSDK KncSecurity）
// 預設 SPI=0 安全關聯（固定金鑰，與原 client 相容）：
//   AuthKey   = CP949 bytes "b3 d8 bd bc c0 af c0 fa"（原值取自原始碼中 "넥슨유저의보안" 的前 8 bytes）
//   CryptoKey = CP949 bytes "b1 d7 b3 d7 c6 c0 c0 c7"（原值取自原始碼中 "그네팀의보안" 的前 8 bytes）
//   SequenceNumber(初始) = 1；IV = 8 bytes（傳輸於明文，不影響安全）
#pragma once

#include <cstdint>
#include <array>
#include <vector>
#include "ByteStream.h"

namespace x2 { class Serializer; }

namespace x2 { namespace security {

class SecurityAssociation
{
public:
    static constexpr size_t AUTH_KEY_SIZE = 8;
    static constexpr size_t CRYPTO_KEY_SIZE = 8;
    static constexpr size_t IV_SIZE = 8;
    static constexpr size_t ICV_SIZE = 10;
    static constexpr size_t BLOCK_SIZE = 8;
    static constexpr uint32_t MAX_SEQUENCE_NUM = 0xFFFFFFFFu;

    SecurityAssociation();

    void ResetRandomizeKey();
    void SetAuthKey(const uint8_t* key, size_t len);
    void SetCryptoKey(const uint8_t* key, size_t len);
    const ByteStream& GetAuthKey() const { return m_authKey; }
    const ByteStream& GetCipherKey() const { return m_cryptoKey; }

    uint32_t GetSequenceNum() const { return m_sequenceNum; }
    void SetSequenceNum(uint32_t v) { m_sequenceNum = v; }
    uint32_t GetLastSequenceNum() const { return m_lastSequenceNum; }
    void SetLastSequenceNum(uint32_t v) { m_lastSequenceNum = v; }
    uint32_t GetReplayWindowMask() const { return m_replayWindowMask; }
    void SetReplayWindowMask(uint32_t v) { m_replayWindowMask = v; }
    void IncrSequenceNum_notRWM();               // ++，回繞到 1
    // 接收驗證（not replay window mask）：接受 seq>last 或 last 已回繞
    bool IsValidSequenceNum_notRWM(uint32_t sequenceNum);

    // 對稱加解密（DES-CBC）
    ByteStream Encryption(const ByteStream& payload, const ByteStream& iv) const;
    ByteStream Decryption(const ByteStream& crypt, const ByteStream& iv) const;
    // ICV = HMAC-MD5(authKey, auth) 截斷 10 bytes
    ByteStream GenerateICV(const ByteStream& auth) const;
    // 依 RFC 2406 風格的填充：1,2,3,...,N + 末尾 1 byte padLength
    ByteStream GeneratePadding(const ByteStream& payload) const;

private:
    ByteStream m_authKey;
    ByteStream m_cryptoKey;
    uint32_t m_sequenceNum = 1;
    uint32_t m_lastSequenceNum = 0;
    uint32_t m_replayWindowMask = 0;   // 原 m_nReplayWindowMask（相容欄位；V2 不做 bit-window 驗證）
};

// ---- E_ACCEPT_CONNECTION_NOT 載荷用：SecurityAssociation 序列化（與原 KSerializer 非 tagging 模式位元組一致）----
//   [ByteStream authKey : u32BE len + bytes]
//   [ByteStream cryptoKey: u32BE len + bytes]
//   [m_sequenceNum u32BE][m_lastSequenceNum u32BE][m_replayWindowMask u32BE]
// 註：原版 tagging 模式下每個 ByteStream 前有 eTAG_USERCLASS tag；此處僅支援預設（非 tagging）模式，與線上協議一致。
// 需要 Serializer（core/Serializer.h）一起編譯。
bool PutSecurityAssociation(Serializer& ks, const SecurityAssociation& sa);
bool GetSecurityAssociation(Serializer& ks, SecurityAssociation& sa);

} // namespace x2::security
} // namespace x2
