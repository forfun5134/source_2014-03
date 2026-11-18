#include "FrameAverageProtocol.h"
#include "../core/NetError.h"
#include "../core/Serializer.h"
namespace x2 { namespace frame_average {
bool PutFrameAverageReq(Serializer& s, const FrameAverageReq& r) { return s.Put(r.gameType) && s.Put(r.totalFrame) && s.Put(r.frameAverage); }
bool GetFrameAverageReq(Serializer& s, FrameAverageReq& r) { return s.Get(r.gameType) && s.Get(r.totalFrame) && s.Get(r.frameAverage); }
bool PutFrameAverageAck(Serializer& s, const FrameAverageAck& a) { return s.Put(a.iOK); }
bool GetFrameAverageAck(Serializer& s, FrameAverageAck& a) { return s.Get(a.iOK); }
int32_t HandleFrameAverageReq(const FrameAverageReq& req, FrameAverageAck& ack, FrameStatistics& stat)
{
    ack = FrameAverageAck{};
    stat = FrameStatistics{};
    if (req.frameAverage < 0) return ack.iOK = ERR_STATISTICS_00;
    // GT_NONE and unknown types are acknowledged but do not increment statistics.
    if (req.gameType < 1 || req.gameType > 3) return ack.iOK;
    stat.emit = true;
    stat.gameIndex = req.gameType - 1;
    stat.fpsBucket = req.frameAverage <= 20 ? 0 : req.frameAverage <= 90 ? (req.frameAverage - 11) / 10 : 8;
    return ack.iOK;
}
} }
