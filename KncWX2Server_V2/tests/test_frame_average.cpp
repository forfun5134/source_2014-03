#include <cstdio>
#include <cstring>
#include <initializer_list>
#include <limits>
#include "../src/core/EventIDs.h"
#include "../src/core/NetError.h"
#include "../src/core/SerBuffer.h"
#include "../src/core/Serializer.h"
#include "../src/server/FrameAverageProtocol.h"
using namespace x2;
using namespace x2::frame_average;
namespace {
int passed = 0, failed = 0;
#define CHECK(c) do { if (c) ++passed; else { ++failed; std::printf("frame average FAIL line %d\n", __LINE__); } } while (0)
void TestCodec() {
    CHECK(static_cast<int>(EventID::EGS_FRAME_AVERAGE_REQ) == 429 && static_cast<int>(EventID::EGS_FRAME_AVERAGE_ACK) == 430);
    CHECK(ERR_STATISTICS_00 == 327);
    FrameAverageReq req; req.gameType = 2; req.totalFrame = 0x01020304; req.frameAverage = 60;
    SerBuffer b; Serializer s; CHECK(s.BeginWriting(&b) && PutFrameAverageReq(s, req)); s.EndWriting();
    const unsigned char expected[] = {2,1,2,3,4,0,0,0,60}; CHECK(b.GetLength() == sizeof expected && std::memcmp(b.GetData(), expected, sizeof expected) == 0);
    FrameAverageReq decoded; Serializer r; CHECK(r.BeginReading(&b) && GetFrameAverageReq(r, decoded)); r.EndReading();
    CHECK(decoded.gameType == 2 && decoded.totalFrame == 0x01020304 && decoded.frameAverage == 60);
    FrameAverageAck ack; ack.iOK = ERR_STATISTICS_00; SerBuffer a;
    CHECK(s.BeginWriting(&a) && PutFrameAverageAck(s, ack)); s.EndWriting();
    const unsigned char expectedAck[] = {0,0,1,0x47}; CHECK(a.GetLength() == 4 && std::memcmp(a.GetData(), expectedAck, 4) == 0);
    FrameAverageAck out; CHECK(r.BeginReading(&a) && GetFrameAverageAck(r, out)); r.EndReading(); CHECK(out.iOK == ERR_STATISTICS_00);
    SerBuffer empty; CHECK(r.BeginReading(&empty)); CHECK(!GetFrameAverageReq(r, decoded)); r.EndReading();
    CHECK(r.BeginReading(&empty)); CHECK(!GetFrameAverageAck(r, out)); r.EndReading();
}
void TestHandler() {
    FrameAverageReq req; FrameAverageAck ack; FrameStatistics stat;
    const int values[] = {0,20,21,30,31,40,41,50,51,60,61,70,71,80,81,90,91,std::numeric_limits<int32_t>::max()};
    const int buckets[] = {0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8};
    for (int game = 1; game <= 3; ++game) {
        req.gameType = static_cast<int8_t>(game); req.totalFrame = -1;
        for (unsigned i = 0; i < sizeof values / sizeof *values; ++i) {
            req.frameAverage = values[i];
            CHECK(HandleFrameAverageReq(req, ack, stat) == NET_OK && stat.emit && stat.gameIndex == game - 1 && stat.fpsBucket == buckets[i]);
        }
    }
    for (int type : {0, 4, -1}) {
        req.gameType = static_cast<int8_t>(type); req.frameAverage = 42; stat.emit = true;
        CHECK(HandleFrameAverageReq(req, ack, stat) == NET_OK && !stat.emit);
        req.frameAverage = -1; CHECK(HandleFrameAverageReq(req, ack, stat) == ERR_STATISTICS_00 && !stat.emit);
    }
}
}
void RunFrameAverageTestsByRef(int& pass, int& fail) { TestCodec(); TestHandler(); pass += passed; fail += failed; std::printf("FrameAverage: %d passed, %d failed\n", passed, failed); }
