// tests/test_all.cpp — V2 核心/安全模組測試（全部以「與原實作機器對賬」取得的 golden bytes 為準）
// golden 來源：
//   1) 以 MSVC 原碼重編（Linux x86_64 shim，BaseTypes 換為固定寬度）產生的線上位元組
//   2) Python hashlib/hmac、pycryptodome DES 對照
//   3) 原 KncSend.h ePerformerID 逐一機器比對（85/85 一致）
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>
#include <map>
#include <set>
#include <random>
#include <cstdint>

#include "../src/core/Serializer.h"
#include "../src/core/Event.h"
#include "../src/core/UidType.h"
#include "../src/core/EventIDs.h"
#include "../src/core/Region.h"
#include "../src/security/Md5.h"
#include "../src/security/Hmac.h"
#include "../src/security/Des.h"
#include "../src/security/SecureBuffer.h"
#include "../src/security/SADatabase.h"
#include "../src/security/SecurityAssociation.h"

using namespace x2;
using namespace x2::security;

void RunNetworkTestsByRef(int& pass, int& fail);
void RunSessionTestsByRef(int& pass, int& fail);
void RunDbTestsByRef(int& pass, int& fail);
void RunLoginSliceTestsByRef(int& pass, int& fail);
void RunGameStoreTestsByRef(int& pass, int& fail);
void RunSelectUnitTestsByRef(int& pass, int& fail);
void RunUnitDataTestsByRef(int& pass, int& fail);
void RunUnitListTestsByRef(int& pass, int& fail);
void RunCreateUnitTestsByRef(int& pass, int& fail);
void RunDeleteUnitTestsByRef(int& pass, int& fail);
void RunCreateTodayCountTestsByRef(int& pass, int& fail);
void RunCheckNicknameTestsByRef(int& pass, int& fail);
void RunChangeNicknameTestsByRef(int& pass, int& fail);
void RunEntryPointUnitTestsByRef(int& pass, int& fail);
void RunCharacterListTestsByRef(int& pass, int& fail);

static int g_fail = 0, g_pass = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass++; } \
    else { g_fail++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static bool BytesEq(const void* a, const void* b, size_t n) { return std::memcmp(a, b, n) == 0; }

static std::string HexOf(const void* data, size_t n) {
    std::string s; char t[4];
    const unsigned char* p = static_cast<const unsigned char*>(data);
    for (size_t i = 0; i < n; ++i) { std::snprintf(t, sizeof t, "%02x", p[i]); s += t; }
    return s;
}
static std::string HexOf(const SerBuffer& b) {
    std::string s; char t[4];
    const unsigned char* p = static_cast<const unsigned char*>(b.GetData());
    for (size_t i = 0; i < b.GetLength(); ++i) { std::snprintf(t, sizeof t, "%02x", p[i]); s += t; }
    return s;
}

static void TestSerializerGolden() {
    {   // scalars
        SerBuffer buf; Serializer ks; ks.BeginWriting(&buf);
        ks.Put(-2); ks.Put((uint32_t)0xDEADBEEFu);
        ks.Put((int16_t)0x0102); ks.Put((uint16_t)0xAB12);
        ks.Put((int64_t)-0x0011223344556677LL); ks.Put((uint64_t)0x0102030405060708ULL);
        ks.Put(1.5f); ks.Put(1.5); ks.Put(true); ks.Put('A');
        ks.EndWriting();
        const char* expect = "fffffffedeadbeef0102ab12ffeeddccbbaa998901020304050607083fc000003ff80000000000000141";
        CHECK(HexOf(buf) == expect, "scalars golden");
    }
    { SerBuffer buf; Serializer ks; ks.BeginWriting(&buf); std::string s = "hello world"; ks.Put(s); ks.EndWriting();
      CHECK(HexOf(buf) == "0000000b68656c6c6f20776f726c64", "string golden"); }
    { SerBuffer buf; Serializer ks; ks.BeginWriting(&buf); std::vector<int> v = {1, -2, 300}; ks.Put(v); ks.EndWriting();
      CHECK(HexOf(buf) == "0000000300000001fffffffe0000012c", "vector golden"); }
    { SerBuffer buf; Serializer ks; ks.BeginWriting(&buf); std::map<int,int> m; m[7] = 70; m[3] = 30; ks.Put(m); ks.EndWriting();
      CHECK(HexOf(buf) == "00000002000000030000001e0000000700000046", "map golden (sorted by key)"); }
    { SerBuffer buf; Serializer ks; ks.BeginWriting(&buf); std::set<int> st = {9, 4, 5}; ks.Put(st); ks.EndWriting();
      CHECK(HexOf(buf) == "00000003000000040000000500000009", "set golden (sorted)"); }
    { SerBuffer buf; Serializer ks; ks.BeginWriting(&buf); std::wstring w = L"\uAC00\uB098"; ks.Put(w); ks.EndWriting();
      CHECK(HexOf(buf) == "0000000400ac98b0", "wstring UTF-16LE golden"); }
    // wstring roundtrip 含代理對（Linux wchar_t = 4 bytes 路徑）
    { SerBuffer buf; Serializer ks; ks.BeginWriting(&buf); std::wstring w;
#if __SIZEOF_WCHAR_T__ == 4
      w.push_back((wchar_t)0x10000); w.push_back((wchar_t)'A');
#else
      w.push_back((wchar_t)0xD83D); w.push_back((wchar_t)0xDE00); w.push_back((wchar_t)'A');
#endif
      ks.Put(w); ks.EndWriting();
      Serializer ks2; SerBuffer bin = buf; std::wstring back;
      ks2.BeginReading(&bin);
      ks2.Get(back);
      ks2.EndReading();
      CHECK(back == w, "wstring roundtrip (surrogate pair)"); }
    // 讀取回壓測試：從 golden bytes 解析
    { SerBuffer buf; const unsigned char raw[] = {0x00,0x00,0x00,0x03,0x00,0x00,0x00,0x01,0xff,0xff,0xff,0xfe,0x00,0x00,0x01,0x2c};
      buf.Write(raw, sizeof raw); Serializer ks; std::vector<int> v; ks.BeginReading(&buf); ks.Get(v); ks.EndReading();
      CHECK(v.size() == 3 && v[0] == 1 && v[1] == -2 && v[2] == 300, "vector parse from golden bytes"); }
}

static void TestPutArrayWchar() {
    // tagging=false（預設）：[DWORD BE 元素數][elements BE]
    { SerBuffer buf; Serializer ks; ks.BeginWriting(&buf);
      int32_t ary[3] = {1, -2, 300};
      CHECK(ks.PutArray(ary, 3), "PutArray int32"); ks.EndWriting();
      CHECK(HexOf(buf) == "0000000300000001fffffffe0000012c", "array(int32) golden bytes"); }
    { SerBuffer buf; Serializer ks; ks.BeginWriting(&buf);
      uint16_t ary[2] = {0xAB12, 0x0102};
      CHECK(ks.PutArray(ary, 2), "PutArray uint16"); ks.EndWriting();
      CHECK(HexOf(buf) == "00000002ab120102", "array(uint16) golden bytes"); }
    // 逐元素序列化（同原版）：double 陣列各占 8 bytes BE
    { SerBuffer buf; Serializer ks; ks.BeginWriting(&buf);
      double ary[1] = {1.5};
      CHECK(ks.PutArray(ary, 1), "PutArray double"); ks.EndWriting();
      CHECK(HexOf(buf) == "000000013ff8000000000000", "array(double) golden bytes"); }
    // roundtrip：count 傳入=容量，傳出=實際讀取數
    { SerBuffer buf; Serializer ks; ks.BeginWriting(&buf);
      int32_t ary[3] = {5, 6, 7}; ks.PutArray(ary, 3); ks.EndWriting();
      Serializer ks2; SerBuffer bin = buf; int32_t out[3] = {0,0,0}; size_t cap = 3;
      ks2.BeginReading(&bin);
      CHECK(ks2.GetArray(out, cap), "GetArray roundtrip"); ks2.EndReading();
      CHECK(cap == 3 && out[0] == 5 && out[1] == 6 && out[2] == 7, "GetArray values"); }
    // 容量不足：元素超出緩衝區 → 失敗（同原版 numInOut 上限檢查）
    { SerBuffer buf; Serializer ks; ks.BeginWriting(&buf);
      int32_t ary[2] = {9, 8}; ks.PutArray(ary, 2); ks.EndWriting();
      Serializer ks2; SerBuffer bin = buf; int32_t out[1] = {0}; size_t cap = 1;
      ks2.BeginReading(&bin);
      CHECK(!ks2.GetArray(out, cap), "GetArray capacity overflow -> false"); ks2.EndReading(); }
    // tagging=true：eTAG_ARRAY=14(0e)、eTAG_DWORD=6(06)、eTAG_INT=5(05)
    { SerBuffer buf; Serializer ks; ks.BeginWriting(&buf, /*tagging=*/true);
      int32_t ary[2] = {5, -7};
      ks.PutArray(ary, 2); ks.EndWriting();
      CHECK(HexOf(buf) == "0e0600000002050000000505fffffff9", "array tagging golden bytes");
      Serializer ks2; SerBuffer bin = buf; int32_t out[2] = {0,0}; size_t cap = 2;
      ks2.BeginReading(&bin, true);
      CHECK(ks2.GetArray(out, cap) && out[0] == 5 && out[1] == -7 && cap == 2, "array tagging roundtrip"); ks2.EndReading(); }

    // tagging=true：eTAG_MAP=22(16) eTAG_PAIR=16(10) eTAG_INT=5(05) eTAG_DWORD=6(06)
    { SerBuffer buf; Serializer ks; ks.BeginWriting(&buf, /*tagging=*/true);
      std::map<int,int> m; m[7] = 70; ks.Put(m); ks.EndWriting();
      CHECK(HexOf(buf) == "1606000000011005000000070500000046", "map tagging golden bytes");
      Serializer ks2; SerBuffer bin = buf; std::map<int,int> m2;
      ks2.BeginReading(&bin, true);
      CHECK(ks2.Get(m2) && m2.size() == 1 && m2.at(7) == 70, "map tagging roundtrip"); ks2.EndReading(); }

    // multimap / multiset：V2 新增（原 SerMap/SerSet 對應），tagging=true
    { SerBuffer buf; Serializer ks; ks.BeginWriting(&buf, /*tagging=*/true);
      std::multimap<int,std::string> mm; mm.emplace(1, "a"); ks.Put(mm); ks.EndWriting();
      CHECK(HexOf(buf) == "1706000000011005000000010c060000000161", "multimap tagging golden bytes");
      Serializer ks2; SerBuffer bin = buf; std::multimap<int,std::string> mm2;
      ks2.BeginReading(&bin, true);
      CHECK(ks2.Get(mm2) && mm2.size() == 1 && mm2.begin()->second == "a", "multimap tagging roundtrip"); ks2.EndReading(); }
    { SerBuffer buf; Serializer ks; ks.BeginWriting(&buf, /*tagging=*/true);
      std::multiset<int> ms = {9, 4}; ks.Put(ms); ks.EndWriting();
      CHECK(HexOf(buf) == "15060000000205000000040500000009", "multiset tagging golden bytes");
      Serializer ks2; SerBuffer bin = buf; std::multiset<int> ms2;
      ks2.BeginReading(&bin, true);
      CHECK(ks2.Get(ms2) && ms2.size() == 2 && *ms2.begin() == 4, "multiset tagging roundtrip"); ks2.EndReading(); }

    // 防禦：宣告巨量元素個數的容器 → 立即失敗，不分配巨量記憶體
    { const unsigned char raw[] = {0xFF, 0xFF, 0xFF, 0xFF};
      SerBuffer buf; buf.Write(raw, sizeof raw); Serializer ks; std::vector<int32_t> v;
      ks.BeginReading(&buf);
      CHECK(!ks.Get(v), "vector oversize count rejected"); ks.EndReading(); }
    { const unsigned char raw[] = {0xFF, 0xFF, 0xFF, 0xFF};
      SerBuffer buf; buf.Write(raw, sizeof raw); Serializer ks; std::map<int32_t,int32_t> m;
      ks.BeginReading(&buf);
      CHECK(!ks.Get(m), "map oversize count rejected"); ks.EndReading(); }

    // PutWchar：tagging=false -> [2 bytes UTF-16LE]
    { SerBuffer buf; Serializer ks; ks.BeginWriting(&buf);
      ks.PutWchar(0x1344); ks.EndWriting();
      CHECK(HexOf(buf) == "4413", "wchar golden bytes (LE)"); }
    // tagging=true：eTAG_WCHAR=1(01)
    { SerBuffer buf; Serializer ks; ks.BeginWriting(&buf, /*tagging=*/true);
      ks.PutWchar(0xAC00); ks.EndWriting();
      CHECK(HexOf(buf) == "0100ac", "wchar tagging golden bytes");
      Serializer ks2; SerBuffer bin = buf; uint16_t u = 0;
      ks2.BeginReading(&bin, true);
      CHECK(ks2.GetWchar(u) && u == 0xAC00, "wchar tagging roundtrip"); ks2.EndReading(); }
}

static void TestSerBufferCompress() {
    SerBuffer b;
    std::string orig;
    for (int i = 0; i < 500; ++i) orig += "line " + std::to_string(i % 9) + "\n";
    b.Write(orig.data(), orig.size());
    CHECK(b.Compress(), "Compress");
    CHECK(b.IsCompressed(), "compressed flag");
    CHECK(b.GetLength() >= 4, "compressed size");
    uint32_t le32 = 0;
    std::memcpy(&le32, b.GetData(), 4);
    CHECK(le32 == (uint32_t)orig.size(), "compress header = LE original size");
    CHECK(b.UnCompress(), "UnCompress");
    CHECK(std::string((const char*)b.GetData(), b.GetLength()) == orig, "compress roundtrip");
}

static void TestEventGolden() {
    Event ev;
    UidType tr[2] = { 0xAA, -1 };
    ev.SetData(PerformerID::PI_GS_PROXY, tr, 0x1234);
    ev.dest.uids.insert(0x0000000100020003LL);
    SerBuffer out;
    CHECK(ev.Serialize(out), "event serialize");
    const char* expect =
        "0000010100000001000000010002000300000000000000aaffffffffffffffff123400000000";
    CHECK(HexOf(out) == expect, "event golden == original KEvent wire bytes");

    Event ev2;
    CHECK(Event::Deserialize(out, ev2), "event deserialize");
    CHECK(ev2.dest.performerID == PerformerID::PI_GS_PROXY, "event performerID roundtrip");
    CHECK(ev2.eventID == 0x1234, "event id roundtrip");
    CHECK(ev2.dest.uids.count(0x0000000100020003LL) == 1, "event uid set roundtrip");
    CHECK(ev2.trace[0] == 0xAA && ev2.trace[1] == -1, "event trace roundtrip");
    CHECK(ev2.payload.GetLength() == 0, "event empty payload");

    // 含 payload（GetData 型別化取值）
    Event ev3;
    ev3.SetData(PerformerID::PI_GS_USER, tr, static_cast<uint16_t>(EventID::E_HEART_BEAT), static_cast<uint32_t>(0xCAFEBABE));
    SerBuffer buf3;
    CHECK(ev3.Serialize(buf3), "event with payload serialize");
    Event ev4;
    CHECK(Event::Deserialize(buf3, ev4), "event with payload deserialize");
    uint32_t got = 0;
    CHECK(ev4.GetData(got) && got == 0xCAFEBABE, "event typed payload roundtrip");
}

static void TestMd5Hmac() {
    auto h = [](const std::string& s) { return Md5::HexDigest(s.data(), s.size()); };
    CHECK(h("") == "d41d8cd98f00b204e9800998ecf8427e", "md5 empty");
    CHECK(h("abc") == "900150983cd24fb0d6963f7d28e17f72", "md5 abc");
    CHECK(h("The quick brown fox jumps over the lazy dog") == "9e107d9d372bb6826bd81d3542a419d6", "md5 fox");
    CHECK(h(std::string(64, 'a')) == "014842d480b571495a4a0363793f7367", "md5 64*a");

    uint8_t key1[16]; std::memset(key1, 0x0b, 16);
    { auto d = HmacMd5(key1, 16, "Hi There", 8);
      CHECK(HexOf(d.data(), d.size()) == "9294727a3638bb1c13f48ef8158bfc9d", "hmac-md5 rfc2202 case1"); }
    uint8_t key2[16]; std::memset(key2, 0xaa, 16);
    uint8_t data2[50]; std::memset(data2, 0xdd, 50);
    { auto d = HmacMd5(key2, 16, data2, sizeof data2);
      CHECK(HexOf(d.data(), d.size()) == "56be34521d144c88dbb8c733f0e8b3f6", "hmac-md5 rfc2202 case2"); }
    // 預設 auth key（原 KncSecurity 預設）+ seq/iv/sample 的 golden（pycrypto 對照）
    { const uint8_t auth[8] = {0xb3, 0xd8, 0xbd, 0xbc, 0xc0, 0xaf, 0xc0, 0xfa};
      const unsigned char msg[32] = {0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31};
      auto d = HmacMd5(auth, 8, msg, 32);
      char buf[21] = {}; for (int i = 0; i < 10; ++i) std::snprintf(buf + i * 2, 3, "%02x", d[i]);
      CHECK(std::string(buf) == "2cd0374e9a00114fdfdb", "hmac-md5 default auth key trunc10 golden"); }
}

static void TestDes() {
    uint8_t key[8]  = {0x13, 0x34, 0x57, 0x79, 0x9B, 0xBC, 0xDF, 0xF1};
    uint8_t pt[8]   = {0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF};
    uint8_t ct[8];
    Des des; des.SetKey(key); des.EncryptBlock(pt, ct);
    const uint8_t expect[8] = {0x85, 0xE8, 0x13, 0x54, 0x0F, 0x0A, 0xB4, 0x05};
    CHECK(BytesEq(ct, expect, 8), "DES FIPS 46-3 vector");
    uint8_t back[8]; des.DecryptBlock(ct, back);
    CHECK(BytesEq(back, pt, 8), "DES decrypt FIPS vector");

    uint8_t key2[8] = {0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef};
    uint8_t pt2[8]  = {0xfe, 0xdc, 0xba, 0x98, 0x76, 0x54, 0x32, 0x10};
    Des des2; des2.SetKey(key2); des2.EncryptBlock(pt2, ct);
    const uint8_t expect2[8] = {0x12, 0xC6, 0x26, 0xAF, 0x05, 0x8B, 0x43, 0x3B};
    CHECK(BytesEq(ct, expect2, 8), "DES second vector");

    // 隨機鍵加解密 roundtrip（50 組）
    std::mt19937_64 rng(20240517);
    int bad = 0;
    for (int i = 0; i < 50; ++i) {
        uint8_t k[8], p[8], c[8], b[8];
        for (int j = 0; j < 8; ++j) { k[j] = (uint8_t)rng(); p[j] = (uint8_t)rng(); }
        Des d; d.SetKey(k); d.EncryptBlock(p, c); d.DecryptBlock(c, b);
        if (!BytesEq(p, b, 8)) bad++;
    }
    CHECK(bad == 0, "DES random roundtrip x50");

    // DES-CBC（原 SecurityAssociation 規則，含原始 padding）：對照 pycryptodome
    SecurityAssociation sa;
    const uint8_t iv[8] = {0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48};
    std::string payload = "Hello, Elsword!";
    ByteStream data((const uint8_t*)payload.data(), payload.size());
    ByteStream pad = sa.GeneratePadding(data);
    std::vector<uint8_t> full(data.begin(), data.end());
    full.insert(full.end(), pad.begin(), pad.end());
    full.push_back((uint8_t)pad.size());   // 末尾 pad length byte（GenerateCrypt 的做法）
    ByteStream arg(full.data(), full.size());
    ByteStream enc = sa.Encryption(arg, ByteStream(iv, 8));
    const uint8_t expectCt[24] = {0x6d, 0x48, 0x87, 0x53, 0x93, 0xe9, 0xc0, 0xf1,
                                  0x8b, 0x8e, 0xbb, 0xfb, 0x86, 0xef, 0xe8, 0x35,
                                  0x65, 0x5c, 0xb0, 0xc1, 0x70, 0x81, 0x5b, 0x84};
    CHECK(enc.size() == 24 && BytesEq(enc.data(), expectCt, 24), "DES-CBC golden (orig padding + default keys)");
}

static void TestRegion() {
    // 地區代碼與 CurrentRegion() 必須自洽（不硬編某一地區，方便 -DX2_REGION_* 換區建置）
    const char* code = RegionCode(CurrentRegion());
    CHECK(code != nullptr && code[0] != '\0' && code[0] != '?', "region code resolves");
    CHECK(RegionNameZhTW(CurrentRegion())[0] != '\0', "region zh-TW name present");
    // 未指定 -DX2_REGION_* 時應預設 JP（SERV_INT_INTERNAL  parity）
#if !defined(X2_REGION_EU) && !defined(X2_REGION_US) && !defined(X2_REGION_TW) && !defined(X2_REGION_HK) && \
    !defined(X2_REGION_JP) && !defined(X2_REGION_CN) && !defined(X2_REGION_TH) && !defined(X2_REGION_ID) && \
    !defined(X2_REGION_BR) && !defined(X2_REGION_PH)
    CHECK(CurrentRegion() == Region::JP, "default region = JP (SERV_INT_INTERNAL parity)");
#endif
#if X2_INTERNAL_BUILD
    CHECK(IsInternalBuild(), "default X2_INTERNAL_BUILD=1");
#ifdef SERV_PRIVATE_IP_SERVER_NETWORKING
    CHECK(false, "internal build must NOT define SERV_PRIVATE_IP_SERVER_NETWORKING");
#endif
#else
    CHECK(!IsInternalBuild(), "X2_INTERNAL_BUILD=0 build");
#endif
    // zh-TW 名稱健全性
    CHECK(std::string(RegionNameZhTW(Region::TW)) == "台灣", "TW zh-TW name");
    CHECK(std::string(RegionNameZhTW(Region::JP)) == "日本", "JP zh-TW name");
}

static void TestSecureBuffer() {
    const char* msg = "Cross-check message for KSecureBuffer!";
    ByteStream payload((const uint8_t*)msg, std::strlen(msg));
    SecureBuffer enc(0);
    CHECK(enc.Create_notRWM(payload), "SecureBuffer create");
    CHECK(enc.GetSize() == 2 + 4 + 8 + ((payload.size() + 1 + 7) / 8) * 8 + 10, "SecureBuffer size formula");

    SecureBuffer dec(0, enc.GetDataPtr(), enc.GetSize());
    ByteStream out;
    CHECK(dec.GetPayload_notRWM(out), "SecureBuffer decrypt");
    CHECK(out.size() == payload.size() && BytesEq(out.data(), payload.data(), payload.size()), "SecureBuffer roundtrip");

    // 竄改 1 bit → ICV 驗證失敗
    std::vector<uint8_t> blob(enc.GetDataPtr(), enc.GetDataPtr() + enc.GetSize());
    blob[12] ^= 0x01;   // 落在 ciphertext 區（IV 之後）
    SecureBuffer bad(0, blob.data(), blob.size());
    ByteStream out2;
    CHECK(!bad.GetPayload_notRWM(out2), "SecureBuffer tamper detected");

    // 以獨立認證路徑驗證 ICV（防止加解密各自正確但互相自洽的情況）
    SecureBuffer dec2(0, enc.GetDataPtr(), enc.GetSize());
    CHECK(dec2.IsAuthentic_notRWM(false), "SecureBuffer ICV self-verify");
}

static void TestUidLayout() {
    UidType id = 0;
    uid::SetPureUID(id, 0x123456789A);
    uid::SetServerID(id, 0xAB);
    uid::SetReservedID(id, 0xCD);
    uid::SetServerGroupID(id, 0x2A);
    CHECK(uid::ExtractPureUID(id) == 0x123456789A, "uid pure extract");
    CHECK(uid::ExtractServerID(id) == 0xAB, "uid serverID extract");
    CHECK(uid::ExtractReservedID(id) == 0xCD, "uid reservedID extract");
    CHECK(uid::ExtractServerGroupID(id) == 0x2A, "uid serverGroupID extract");
    CHECK(uid::ExtractCodeID(id) == ((0xAB << 8) | 0xCD), "uid codeID extract");
    UidType t = uid::GetTempUID();
    CHECK((t & (static_cast<UidType>(1) << 62)) != 0, "uid temp flag");
}

static void TestPerformerID() {
    CHECK(PerformerID::PI_GS_PROXY == 0x00000101, "PI_GS_PROXY");
    CHECK(PerformerID::PI_GS_USER == 0x00000202, "PI_GS_USER");
    CHECK(PerformerID::PI_CN_USER == 0x00000302, "PI_CN_USER");
    CHECK(PerformerID::PI_CHANNEL_SERVER == 0x00000404, "PI_CHANNEL_SERVER");
    CHECK(PerformerID::PI_LOGIN_USER == 0x00000502, "PI_LOGIN_USER");
    CHECK(PerformerID::PI_GLOBAL_USER == 0x00000702, "PI_GLOBAL_USER");
    CHECK(PerformerID::PI_GS_SERVER_SAME == 0x00001204, "PI_GS_SERVER_SAME (ST_SAME_SERV_GROUP)");
    CHECK(PerformerID::PI_NULL == 0xFFFFFFFFu, "PI_NULL");
}

static void TestEventIDs() {
    CHECK(static_cast<uint16_t>(EventID::E_HEART_BEAT) == 0, "E_HEART_BEAT");
    CHECK(static_cast<uint16_t>(EventID::EGS_CONNECT_REQ) == 26, "EGS_CONNECT_REQ");
    CHECK(static_cast<uint16_t>(EventID::EGS_VERIFY_ACCOUNT_REQ) == 30, "EGS_VERIFY_ACCOUNT_REQ");
}

int main() {
    TestSerializerGolden();
    TestPutArrayWchar();
    TestRegion();
    TestSerBufferCompress();
    TestEventGolden();
    TestMd5Hmac();
    TestDes();
    TestSecureBuffer();
    TestUidLayout();
    TestPerformerID();
    TestEventIDs();
    RunNetworkTestsByRef(g_pass, g_fail);
    RunSessionTestsByRef(g_pass, g_fail);
    RunDbTestsByRef(g_pass, g_fail);
    RunLoginSliceTestsByRef(g_pass, g_fail);
    RunGameStoreTestsByRef(g_pass, g_fail);
    RunSelectUnitTestsByRef(g_pass, g_fail);
    RunUnitDataTestsByRef(g_pass, g_fail);
    RunUnitListTestsByRef(g_pass, g_fail);
    RunCreateUnitTestsByRef(g_pass, g_fail);
    RunDeleteUnitTestsByRef(g_pass, g_fail);
    RunCreateTodayCountTestsByRef(g_pass, g_fail);
    RunCheckNicknameTestsByRef(g_pass, g_fail);
    RunChangeNicknameTestsByRef(g_pass, g_fail);
    RunEntryPointUnitTestsByRef(g_pass, g_fail);
    RunCharacterListTestsByRef(g_pass, g_fail);
    std::printf("\n%d passed, %d failed\n", g_pass, g_fail);
    return g_fail == 0 ? 0 : 1;
}
