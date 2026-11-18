// EGS_FRAME_AVERAGE_REQ/ACK (429/430): codec and statistics classification.
#pragma once
#include <cstdint>
namespace x2 { class Serializer; }
namespace x2 { namespace frame_average {
struct FrameAverageReq { int8_t gameType = 0; int32_t totalFrame = 0; int32_t frameAverage = 0; };
struct FrameAverageAck { int32_t iOK = 0; };
// A classified count for the caller's future statistics sink; no event when emit is false.
struct FrameStatistics { bool emit = false; int32_t gameIndex = 0; int32_t fpsBucket = 0; };
bool PutFrameAverageReq(Serializer&, const FrameAverageReq&);
bool GetFrameAverageReq(Serializer&, FrameAverageReq&);
bool PutFrameAverageAck(Serializer&, const FrameAverageAck&);
bool GetFrameAverageAck(Serializer&, FrameAverageAck&);
int32_t HandleFrameAverageReq(const FrameAverageReq&, FrameAverageAck&, FrameStatistics&);
} }
