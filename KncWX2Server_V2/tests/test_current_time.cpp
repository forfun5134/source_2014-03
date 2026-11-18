// tests/test_current_time.cpp — EGS_CURRENT_TIME_REQ/ACK（サーバー現在時刻；§0a22）
// 對照原 GSUserGameCommon::IMPL_ON_FUNC_NOPARAM( EGS_CURRENT_TIME_REQ )（GSUserGameCommon.cpp:6232–6244）
// ＋ ClientPacket.cpp（SERIALIZE_DEFINE_PUT/GET(KEGS_CURRENT_TIME_ACK)）。SERVER_CURRENT_TIME_INT64 未定義 → 僅 wstring。
#include <cstdio>
#include <cstring>
#include <functional>
#include <string>

#include "../src/core/EventIDs.h"
#include "../src/core/SerBuffer.h"
#include "../src/core/Serializer.h"
#include "../src/server/CurrentTimeProtocol.h"

using namespace x2;
using namespace x2::current_time;

static int g_pass_ct = 0, g_fail_ct = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_ct++; } \
    else { g_fail_ct++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static SerBuffer PutPayload(const std::function<bool(Serializer&)>& fn)
{
    SerBuffer buf;
    Serializer ks;
    if (!ks.BeginWriting(&buf)) return SerBuffer{};
    if (!fn(ks)) return SerBuffer{};
    ks.EndWriting();
    return buf;
}

static void TestReqGoldenBytes()
{
    CurrentTimeReq req;
    SerBuffer buf = PutPayload([&req](Serializer& s) { return PutCurrentTimeReq(s, req); });
    CHECK(buf.GetLength() == 0, "REQ is NOPARAM (empty wire payload)");
}

static void TestAckGoldenBytes()
{
    CurrentTimeAck ack;
    ack.wstrCurrentTime = L"2026-11-17 12:34:56";
    SerBuffer buf = PutPayload([&ack](Serializer& s) { return PutCurrentTimeAck(s, ack); });
    const unsigned char expect[42] = {
        0x00, 0x00, 0x00, 0x26,
        0x32, 0x00, 0x30, 0x00, 0x32, 0x00, 0x36, 0x00, 0x2D, 0x00, 0x31, 0x00, 0x31, 0x00, 0x2D, 0x00,
        0x31, 0x00, 0x37, 0x00, 0x20, 0x00, 0x31, 0x00, 0x32, 0x00, 0x3A, 0x00, 0x33, 0x00, 0x34, 0x00,
        0x3A, 0x00, 0x35, 0x00, 0x36, 0x00
    };
    CHECK(buf.GetLength() == sizeof(expect) && std::memcmp(buf.GetData(), expect, sizeof(expect)) == 0,
          "ACK golden bytes ([DWORD byte length][UTF-16LE 38 bytes])");
    CurrentTimeAck back;
    Serializer ks;
    CHECK(ks.BeginReading(&buf) && GetCurrentTimeAck(ks, back), "ack parse");
    ks.EndReading();
    CHECK(back.wstrCurrentTime == L"2026-11-17 12:34:56", "ack roundtrip");
}

static void TestEventIds()
{
    CHECK(static_cast<uint16_t>(EventID::EGS_CURRENT_TIME_REQ) == 507 &&
          static_cast<uint16_t>(EventID::EGS_CURRENT_TIME_ACK) == 508,
          "event ids 507/508");
}

static void TestHandler()
{
    CurrentTimeReq req;
    // 注入：handler 直接採用
    CurrentTimeAck ack;
    HandleCurrentTimeReq(req, ack, L"2026-11-17 12:34:56");
    CHECK(ack.wstrCurrentTime == L"2026-11-17 12:34:56", "injected time adopted verbatim");
    // 計算：格式必須符合 YYYY-MM-DD HH:MM:SS（長度 19；數字/分隔符位置）
    CurrentTimeAck ack2;
    HandleCurrentTimeReq(req, ack2);   // 真實本地時間
    CHECK(ack2.wstrCurrentTime.size() == 19, "computed time is 19 wide");
    bool shape = true;
    const wchar_t* w = ack2.wstrCurrentTime.c_str();
    for (int i = 0; i < 19; ++i) {
        if (i == 4 || i == 7) shape = shape && w[i] == L'-';
        else if (i == 10) shape = shape && w[i] == L' ';
        else if (i == 13 || i == 16) shape = shape && w[i] == L':';
        else shape = shape && (w[i] >= L'0' && w[i] <= L'9');
    }
    CHECK(shape, "computed time matches YYYY-MM-DD HH:MM:SS shape");
}

void RunCurrentTimeTestsByRef(int& pass, int& fail)
{
    TestReqGoldenBytes();
    TestAckGoldenBytes();
    TestEventIds();
    TestHandler();
    pass += g_pass_ct;
    fail += g_fail_ct;
}
