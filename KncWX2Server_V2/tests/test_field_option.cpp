#include <cstdio>
#include <cstring>
#include <limits>
#include "../src/core/EventIDs.h"
#include "../src/core/NetError.h"
#include "../src/core/SerBuffer.h"
#include "../src/core/Serializer.h"
#include "../src/server/FieldOptionProtocol.h"
using namespace x2;
using namespace x2::field_option;
namespace {
int passed = 0, failed = 0;
#define CHECK(c) do { if (c) ++passed; else { ++failed; std::printf("field option FAIL line %d\n", __LINE__); } } while (0)
void Test() {
    CHECK(static_cast<int>(EventID::EGS_OPTION_UPDATE_REQ) == 573 && static_cast<int>(EventID::EGS_OPTION_UPDATE_ACK) == 574);
    FieldOption first, second; CHECK(first.limit == 35 && second.limit == 35);
    OptionUpdateReq req; req.option.limit = 25;
    SerBuffer b; Serializer s; CHECK(s.BeginWriting(&b) && PutOptionUpdateReq(s, req)); s.EndWriting();
    const unsigned char expected[] = {0, 25}; CHECK(b.GetLength() == 2 && std::memcmp(b.GetData(), expected, 2) == 0);
    Serializer r; OptionUpdateReq decoded; CHECK(r.BeginReading(&b) && GetOptionUpdateReq(r, decoded)); r.EndReading(); CHECK(decoded.option.limit == 25);
    OptionUpdateAck ack; ack.iOK = -42;
    CHECK(HandleOptionUpdateReq(first, decoded, ack) == NET_OK && ack.iOK == NET_OK);
    CHECK(first.limit == 25 && second.limit == 35);
    SerBuffer ackBuffer; CHECK(s.BeginWriting(&ackBuffer) && PutOptionUpdateAck(s, ack)); s.EndWriting();
    const unsigned char ackExpected[] = {0,0,0,0}; CHECK(ackBuffer.GetLength() == 4 && std::memcmp(ackBuffer.GetData(), ackExpected, 4) == 0);
    OptionUpdateAck ackBack; ackBack.iOK = -1; CHECK(r.BeginReading(&ackBuffer) && GetOptionUpdateAck(r, ackBack)); r.EndReading(); CHECK(ackBack.iOK == NET_OK);
    const int16_t values[] = {10, 35, 0, -1, std::numeric_limits<int16_t>::min(), std::numeric_limits<int16_t>::max()};
    for (int16_t v : values) { req.option.limit = v; CHECK(HandleOptionUpdateReq(first, req, ack) == NET_OK && first.limit == v && second.limit == 35); }
    SerBuffer empty; CHECK(r.BeginReading(&empty)); CHECK(!GetOptionUpdateReq(r, decoded)); r.EndReading();
    CHECK(r.BeginReading(&empty)); CHECK(!GetOptionUpdateAck(r, ackBack)); r.EndReading();
}
}
void RunFieldOptionTestsByRef(int& pass, int& fail) { Test(); pass += passed; fail += failed; std::printf("FieldOption: %d passed, %d failed\n", passed, failed); }
