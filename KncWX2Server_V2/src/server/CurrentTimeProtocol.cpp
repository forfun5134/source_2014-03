// CurrentTimeProtocol.cpp — 見 .h 檔頭的語意對照與偏差聲明
#include "CurrentTimeProtocol.h"

#include <ctime>
#include <cstdio>

#include "../core/Serializer.h"

namespace x2 { namespace current_time {

bool PutCurrentTimeReq(Serializer& ks, const CurrentTimeReq&)   { return true; }   // NOPARAM
bool GetCurrentTimeReq(Serializer& ks, CurrentTimeReq& v)       { v = CurrentTimeReq{}; return true; }

bool PutCurrentTimeAck(Serializer& ks, const CurrentTimeAck& v)
{
    return ks.Put(v.wstrCurrentTime);
}

bool GetCurrentTimeAck(Serializer& ks, CurrentTimeAck& v)
{
    return ks.Get(v.wstrCurrentTime);
}

// "YYYY-MM-DD HH:MM:SS"（原 CTime::Format( "%Y-%m-%d %H:%M:%S" ) 的固定寬度形狀）
static std::wstring FormatLocalNow()
{
    const std::time_t t = std::time(nullptr);
    std::tm tmv{};
#if defined(_WIN32)
    localtime_s(&tmv, &t);
#else
    if (localtime_r(&t, &tmv) == nullptr) return std::wstring();
#endif
    char buf[20];
    std::snprintf(buf, sizeof buf, "%04d-%02d-%02d %02d:%02d:%02d",
                  tmv.tm_year + 1900, tmv.tm_mon + 1, tmv.tm_mday, tmv.tm_hour, tmv.tm_min, tmv.tm_sec);
    std::wstring out;
    out.reserve(19);
    for (const char* p = buf; *p; ++p) out.push_back(static_cast<wchar_t>(static_cast<unsigned char>(*p)));
    return out;
}

void HandleCurrentTimeReq(const CurrentTimeReq&, CurrentTimeAck& ack, const std::wstring& wstrNow)
{
    ack = CurrentTimeAck{};
    ack.wstrCurrentTime = wstrNow.empty() ? FormatLocalNow() : wstrNow;
}

} // namespace current_time
} // namespace x2
