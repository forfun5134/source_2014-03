// SecurityAssociation.cpp
#include "SecurityAssociation.h"
#include "Des.h"
#include "Hmac.h"

#include <random>
#include <cstring>
#include <cmath>

namespace x2 { namespace security {

SecurityAssociation::SecurityAssociation()
{
    // 預設金鑰（與原 client 線路相容；取自原始碼中 CP949 字面值的前 8 bytes）
    static const uint8_t defaultAuth[8]   = { 0xb3, 0xd8, 0xbd, 0xbc, 0xc0, 0xaf, 0xc0, 0xfa };
    static const uint8_t defaultCrypto[8] = { 0xb1, 0xd7, 0xb3, 0xd7, 0xc6, 0xc0, 0xc0, 0xc7 };
    m_authKey.assign(defaultAuth, defaultAuth + 8);
    m_cryptoKey.assign(defaultCrypto, defaultCrypto + 8);
}

void SecurityAssociation::ResetRandomizeKey()
{
    std::random_device rd;
    std::mt19937_64 gen(rd());
    m_authKey.resize(AUTH_KEY_SIZE);
    m_cryptoKey.resize(CRYPTO_KEY_SIZE);
    for (size_t i = 0; i < AUTH_KEY_SIZE; ++i)   m_authKey[i] = static_cast<uint8_t>(gen() & 0xFF);
    for (size_t i = 0; i < CRYPTO_KEY_SIZE; ++i) m_cryptoKey[i] = static_cast<uint8_t>(gen() & 0xFF);
    m_sequenceNum = 1;
    m_lastSequenceNum = 0;
}

void SecurityAssociation::SetAuthKey(const uint8_t* key, size_t len)
{
    m_authKey.assign(key, key + len);
}

void SecurityAssociation::SetCryptoKey(const uint8_t* key, size_t len)
{
    m_cryptoKey.assign(key, key + len);
}

void SecurityAssociation::IncrSequenceNum_notRWM()
{
    ++m_sequenceNum;
    if (m_sequenceNum == 0) m_sequenceNum = 1;  // 永不使用 0
}

bool SecurityAssociation::IsValidSequenceNum_notRWM(uint32_t sequenceNum)
{
    if (sequenceNum == 0) return false;
    if (sequenceNum > m_lastSequenceNum) { m_lastSequenceNum = sequenceNum; return true; }
    if (sequenceNum == m_lastSequenceNum) return false;
    if (m_lastSequenceNum != MAX_SEQUENCE_NUM) return false;
    m_lastSequenceNum = sequenceNum;
    return true;
}

ByteStream SecurityAssociation::Encryption(const ByteStream& payload, const ByteStream& iv) const
{
    // DES-CBC 只接受 8-byte 倍數輸入（呼叫端須先產生 padding）；非法輸入回傳空，不可越界讀取
    if (payload.empty() || payload.size() % BLOCK_SIZE != 0 || iv.size() < IV_SIZE) return ByteStream();
    Des des;
    des.SetKey(m_cryptoKey.data());
    ByteStream out(payload.size(), 0);
    // CBC：XOR IV，逐塊加密
    uint8_t prev[8];
    for (size_t i = 0; i < IV_SIZE && i < iv.size(); ++i) prev[i] = iv[i];
    for (size_t offset = 0; offset < payload.size(); offset += BLOCK_SIZE) {
        uint8_t block[8];
        for (size_t i = 0; i < BLOCK_SIZE; ++i) block[i] = static_cast<uint8_t>(payload[offset + i] ^ prev[i]);
        des.EncryptBlock(block, out.data() + offset);
        for (size_t i = 0; i < 8; ++i) prev[i] = out[offset + i];
    }
    return out;
}

ByteStream SecurityAssociation::Decryption(const ByteStream& crypt, const ByteStream& iv) const
{
    // 同上：只接受 8-byte 倍數的密文；非法輸入回傳空
    if (crypt.empty() || crypt.size() % BLOCK_SIZE != 0 || iv.size() < IV_SIZE) return ByteStream();
    Des des;
    des.SetKey(m_cryptoKey.data());
    ByteStream out(crypt.size(), 0);
    uint8_t prev[8];
    for (size_t i = 0; i < IV_SIZE && i < iv.size(); ++i) prev[i] = iv[i];
    for (size_t offset = 0; offset < crypt.size(); offset += BLOCK_SIZE) {
        uint8_t block[8];
        des.DecryptBlock(crypt.data() + offset, block);
        for (size_t i = 0; i < 8; ++i) out[offset + i] = static_cast<uint8_t>(block[i] ^ prev[i]);
        for (size_t i = 0; i < 8; ++i) prev[i] = crypt[offset + i];
    }
    return out;
}

ByteStream SecurityAssociation::GenerateICV(const ByteStream& auth) const
{
    auto full = HmacMd5(m_authKey.data(), m_authKey.size(), auth.data(), auth.size());
    ByteStream icv;
    icv.assign(full.begin(), full.begin() + ICV_SIZE);
    return icv;
}

ByteStream SecurityAssociation::GeneratePadding(const ByteStream& payload) const
{
    const unsigned long nBlockBytes = BLOCK_SIZE;
    unsigned long nPadBytes = nBlockBytes - ((payload.size() + 1) % nBlockBytes);
    ByteStream pad;
    pad.resize(nPadBytes);
    for (unsigned long i = 1; i <= nPadBytes; ++i) pad[i - 1] = static_cast<uint8_t>(i);
    return pad;
}

}} // namespace x2::security

#include "../core/Serializer.h"

namespace x2 { namespace security {

static bool PutByteStream(Serializer& ks, const ByteStream& bs)
{
    return ks.Put(static_cast<uint32_t>(bs.size())) &&
           (bs.empty() || ks.PutRaw(bs.data(), bs.size()));
}
static bool GetByteStream(Serializer& ks, ByteStream& bs)
{
    uint32_t len = 0;
    if (!ks.Get(len)) return false;
    if (len > 64 * 1024) return false;   // 防禦：金鑰最多 64K
    ByteStream tmp(len, 0);
    if (len && !ks.GetRaw(tmp.data(), len)) return false;
    bs.swap(tmp);   // ByteStream 需要 swap — 若無 swap 退而用 move
    return true;
}

bool PutSecurityAssociation(Serializer& ks, const SecurityAssociation& sa)
{
    return PutByteStream(ks, sa.GetAuthKey()) &&
           PutByteStream(ks, sa.GetCipherKey()) &&
           ks.Put(sa.GetSequenceNum()) &&
           ks.Put(sa.GetLastSequenceNum()) &&
           ks.Put(sa.GetReplayWindowMask());
}

bool GetSecurityAssociation(Serializer& ks, SecurityAssociation& sa)
{
    ByteStream authKey, cryptoKey;
    uint32_t seq = 0, lastSeq = 0, mask = 0;
    if (!GetByteStream(ks, authKey)) return false;
    if (!GetByteStream(ks, cryptoKey)) return false;
    if (!ks.Get(seq) || !ks.Get(lastSeq) || !ks.Get(mask)) return false;
    sa.SetAuthKey(authKey.data(), authKey.size());
    sa.SetCryptoKey(cryptoKey.data(), cryptoKey.size());
    sa.SetSequenceNum(seq);
    sa.SetLastSequenceNum(lastSeq);
    sa.SetReplayWindowMask(mask);
    return true;
}

}} // namespace x2::security
