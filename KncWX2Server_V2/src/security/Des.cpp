// Des.cpp — DES 實作（FIPS 46-3）。依已驗證的位元陣列版本逐一對譯，
// 正確性以 FIPS 向量（133457799BBCDFF1/0123456789ABCDEF→85E813540F0AB405）
// 及 50+ 組隨機向量（pycryptodome 對拍）驗證。
#include "Des.h"
#include <cstring>
#include <array>

namespace x2 { namespace security {

namespace {

// 1-based 位元位置表（FIPS 46-3）
const uint8_t IP[64] = {
    58,50,42,34,26,18,10,2, 60,52,44,36,28,20,12,4,
    62,54,46,38,30,22,14,6, 64,56,48,40,32,24,16,8,
    57,49,41,33,25,17,9,1,  59,51,43,35,27,19,11,3,
    61,53,45,37,29,21,13,5, 63,55,47,39,31,23,15,7
};
const uint8_t FP[64] = {
    40,8,48,16,56,24,64,32, 39,7,47,15,55,23,63,31,
    38,6,46,14,54,22,62,30, 37,5,45,13,53,21,61,29,
    36,4,44,12,52,20,60,28, 35,3,43,11,51,19,59,27,
    34,2,42,10,50,18,58,26, 33,1,41,9,49,17,57,25
};
const uint8_t E[48] = {
    32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,
    16,17,18,19,20,21,20,21,22,23,24,25,24,25,26,27,28,29,28,29,30,31,32,1
};
const uint8_t P[32] = {
    16,7,20,21,29,12,28,17, 1,15,23,26,5,18,31,10,
    2,8,24,14,32,27,3,9,  19,13,30,6,22,11,4,25
};
const uint8_t PC1[56] = {
    57,49,41,33,25,17,9,  1,58,50,42,34,26,18,
    10,2,59,51,43,35,27,  19,11,3,60,52,44,36,
    63,55,47,39,31,23,15,  7,62,54,46,38,30,22,
    14,6,61,53,45,37,29,  21,13,5,28,20,12,4
};
const uint8_t PC2[48] = {
    14,17,11,24,1,5,  3,28,15,6,21,10,  23,19,12,4,26,8,
    16,7,27,20,13,2,  41,52,31,37,47,55,  30,40,51,45,33,48,
    44,49,39,56,34,53,  46,42,50,36,29,32
};
const uint8_t SHIFTS[16] = { 1,1,2,2,2,2,2,2, 1,2,2,2,2,2,2,1 };

const uint8_t SBOX[8][4][16] = {
    {
        { 14, 4,13, 1, 2,15,11, 8, 3,10, 6,12, 5, 9, 0, 7 },
        {  0,15, 7, 4,14, 2,13, 1,10, 6,12,11, 9, 5, 3, 8 },
        {  4, 1,14, 8,13, 6, 2,11,15,12, 9, 7, 3,10, 5, 0 },
        { 15,12, 8, 2, 4, 9, 1, 7, 5,11, 3,14,10, 0, 6,13 },
    },
    {
        { 15, 1, 8,14, 6,11, 3, 4, 9, 7, 2,13,12, 0, 5,10 },
        {  3,13, 4, 7,15, 2, 8,14,12, 0, 1,10, 6, 9,11, 5 },
        {  0,14, 7,11,10, 4,13, 1, 5, 8,12, 6, 9, 3, 2,15 },
        { 13, 8,10, 1, 3,15, 4, 2,11, 6, 7,12, 0, 5,14, 9 },
    },
    {
        { 10, 0, 9,14, 6, 3,15, 5, 1,13,12, 7,11, 4, 2, 8 },
        { 13, 7, 0, 9, 3, 4, 6,10, 2, 8, 5,14,12,11,15, 1 },
        { 13, 6, 4, 9, 8,15, 3, 0,11, 1, 2,12, 5,10,14, 7 },
        {  1,10,13, 0, 6, 9, 8, 7, 4,15,14, 3,11, 5, 2,12 },
    },
    {
        {  7,13,14, 3, 0, 6, 9,10, 1, 2, 8, 5,11,12, 4,15 },
        { 13, 8,11, 5, 6,15, 0, 3, 4, 7, 2,12, 1,10,14, 9 },
        { 10, 6, 9, 0,12,11, 7,13,15, 1, 3,14, 5, 2, 8, 4 },
        {  3,15, 0, 6,10, 1,13, 8, 9, 4, 5,11,12, 7, 2,14 },
    },
    {
        {  2,12, 4, 1, 7,10,11, 6, 8, 5, 3,15,13, 0,14, 9 },
        { 14,11, 2,12, 4, 7,13, 1, 5, 0,15,10, 3, 9, 8, 6 },
        {  4, 2, 1,11,10,13, 7, 8,15, 9,12, 5, 6, 3, 0,14 },
        { 11, 8,12, 7, 1,14, 2,13, 6,15, 0, 9,10, 4, 5, 3 },
    },
    {
        { 12, 1,10,15, 9, 2, 6, 8, 0,13, 3, 4,14, 7, 5,11 },
        { 10,15, 4, 2, 7,12, 9, 5, 6, 1,13,14, 0,11, 3, 8 },
        {  9,14,15, 5, 2, 8,12, 3, 7, 0, 4,10, 1,13,11, 6 },
        {  4, 3, 2,12, 9, 5,15,10,11,14, 1, 7, 6, 0, 8,13 },
    },
    {
        {  4,11, 2,14,15, 0, 8,13, 3,12, 9, 7, 5,10, 6, 1 },
        { 13, 0,11, 7, 4, 9, 1,10,14, 3, 5,12, 2,15, 8, 6 },
        {  1, 4,11,13,12, 3, 7,14,10,15, 6, 8, 0, 5, 9, 2 },
        {  6,11,13, 8, 1, 4,10, 7, 9, 5, 0,15,14, 2, 3,12 },
    },
    {
        { 13, 2, 8, 4, 6,15,11, 1,10, 9, 3,14, 5, 0,12, 7 },
        {  1,15,13, 8,10, 3, 7, 4,12, 5, 6,11, 0,14, 9, 2 },
        {  7,11, 4, 1, 9,12,14, 2, 0, 6,10,13,15, 3, 5, 8 },
        {  2, 1,14, 7, 4,10, 8,13,15,12, 9, 0, 3, 5, 6,11 },
    },
};

using Bits = std::array<uint8_t, 64>;
using Bits28 = std::array<uint8_t, 28>;

inline void BytesToBits(const uint8_t* data, size_t bytes, uint8_t* bitsOut)
{
    for (size_t i = 0; i < bytes; ++i)
        for (int j = 0; j < 8; ++j)
            bitsOut[i * 8 + j] = static_cast<uint8_t>((data[i] >> (7 - j)) & 1u);
}

inline void BitsToBytes(const uint8_t* bits, size_t bitCount, uint8_t* out)
{
    for (size_t i = 0; i < bitCount; i += 8) {
        uint8_t v = 0;
        for (int j = 0; j < 8; ++j) v = static_cast<uint8_t>((v << 1) | bits[i + j]);
        out[i / 8] = v;
    }
}

template <size_t N, size_t M>
void Permute(const uint8_t* in, const uint8_t (&table)[M], uint8_t (&out)[N])
{
    for (size_t i = 0; i < N; ++i) out[i] = in[table[i] - 1];
}

inline void Rol28(std::array<uint8_t, 28>& b, int n)
{
    std::array<uint8_t, 28> t;
    for (int i = 0; i < 28; ++i) t[i] = b[(i + n) % 28];
    b = t;
}

} // namespace

void Des::SetKey(const uint8_t key[8])
{
    uint8_t keyBits[64];
    BytesToBits(key, 8, keyBits);
    uint8_t pc1[56];
    Permute(keyBits, PC1, pc1);

    std::array<uint8_t, 28> c{}, d{};
    for (int i = 0; i < 28; ++i) c[i] = pc1[i];
    for (int i = 0; i < 28; ++i) d[i] = pc1[28 + i];

    for (int round = 0; round < 16; ++round) {
        Rol28(c, SHIFTS[round]);
        Rol28(d, SHIFTS[round]);
        uint8_t cd[56];
        for (int i = 0; i < 28; ++i) cd[i] = c[i];
        for (int i = 0; i < 28; ++i) cd[28 + i] = d[i];
        uint8_t sub[48];
        Permute(cd, PC2, sub);
        uint64_t packed = 0;
        for (int i = 0; i < 48; ++i) packed = (packed << 1) | sub[i];
        m_subKey[round] = packed;
    }
}

void Des::Rounds(uint64_t& block, bool encrypt) const
{
    uint8_t bits[64];
    for (int i = 0; i < 64; ++i) bits[i] = static_cast<uint8_t>((block >> (63 - i)) & 1u);

    uint8_t L[32], R[32];
    for (int i = 0; i < 32; ++i) L[i] = bits[i];
    for (int i = 0; i < 32; ++i) R[i] = bits[32 + i];

    for (int round = 0; round < 16; ++round) {
        const uint64_t sk = encrypt ? m_subKey[round] : m_subKey[15 - round];
        // E(R)
        uint8_t er[48];
        for (int i = 0; i < 48; ++i) er[i] = R[E[i] - 1];
        // XOR subkey
        for (int i = 0; i < 48; ++i) er[i] = static_cast<uint8_t>(er[i] ^ ((sk >> (47 - i)) & 1u));
        // S-boxes
        uint8_t sOut[32];
        for (int box = 0; box < 8; ++box) {
            const uint8_t* six = er + box * 6;
            const int row = (six[0] << 1) | six[5];
            const int col = (six[1] << 3) | (six[2] << 2) | (six[3] << 1) | six[4];
            const uint8_t v = SBOX[box][row][col];
            for (int j = 0; j < 4; ++j) sOut[box * 4 + j] = static_cast<uint8_t>((v >> (3 - j)) & 1u);
        }
        // P
        uint8_t f[32];
        Permute(sOut, P, f);
        // L, R = R, L ^ f
        uint8_t newR[32];
        for (int i = 0; i < 32; ++i) newR[i] = static_cast<uint8_t>(L[i] ^ f[i]);
        for (int i = 0; i < 32; ++i) L[i] = R[i];
        for (int i = 0; i < 32; ++i) R[i] = newR[i];
    }

    // preoutput = R16 || L16，FP 在 EncryptBlock/DecryptBlock 做
    uint64_t out = 0;
    for (int i = 0; i < 32; ++i) out = (out << 1) | R[i];
    for (int i = 0; i < 32; ++i) out = (out << 1) | L[i];
    block = out;
}

void Des::EncryptBlock(const uint8_t in[8], uint8_t out[8]) const
{
    uint8_t bits[64];
    BytesToBits(in, 8, bits);
    uint8_t ipBits[64];
    Permute(bits, IP, ipBits);
    uint64_t block = 0;
    for (int i = 0; i < 64; ++i) block = (block << 1) | ipBits[i];
    Rounds(block, true);
    uint8_t preBits[64];
    for (int i = 0; i < 64; ++i) preBits[i] = static_cast<uint8_t>((block >> (63 - i)) & 1u);
    uint8_t fpBits[64];
    Permute(preBits, FP, fpBits);
    BitsToBytes(fpBits, 64, out);
}

void Des::DecryptBlock(const uint8_t in[8], uint8_t out[8]) const
{
    uint8_t bits[64];
    BytesToBits(in, 8, bits);
    uint8_t ipBits[64];
    Permute(bits, IP, ipBits);
    uint64_t block = 0;
    for (int i = 0; i < 64; ++i) block = (block << 1) | ipBits[i];
    Rounds(block, false);
    uint8_t preBits[64];
    for (int i = 0; i < 64; ++i) preBits[i] = static_cast<uint8_t>((block >> (63 - i)) & 1u);
    uint8_t fpBits[64];
    Permute(preBits, FP, fpBits);
    BitsToBytes(fpBits, 64, out);
}

}} // namespace x2::security
