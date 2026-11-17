// UidType.cpp
#include "UidType.h"

#include <random>
#include <mutex>

namespace x2 { namespace uid {

static std::mutex g_rngMutex;
static std::mt19937_64 g_rng{std::random_device{}()};

UidType ExtractCodeID(UidType id)
{
#if defined(X2_EXTEND_SERVER_GROUP_MASK)
    return (id >> 36) & 0xFFFF;
#else
    return (id >> 40) & 0xFFFF;
#endif
}
void SetCodeID(UidType& dst, UidType src)
{
#if defined(X2_EXTEND_SERVER_GROUP_MASK)
    dst = (dst & 0xFFF0000FFFFFFFFF) | (((src & 0xFFFF) << 36) & 0x000FFFF000000000);
#else
    dst = (dst & 0xFF0000FFFFFFFFFF) | (((src & 0xFFFF) << 40) & 0x00FFFF0000000000);
#endif
}

uint32_t Die32()
{
    std::lock_guard<std::mutex> lk(g_rngMutex);
    std::uniform_int_distribution<uint32_t> die(1, 0xFFFFFFFFu);
    return die(g_rng);
}

UidType GetTempUID()
{
    std::lock_guard<std::mutex> lk(g_rngMutex);
    std::uniform_int_distribution<UidType> die(1, kPureUidMask);
    return die(g_rng) | (static_cast<UidType>(0x1) << 62);
}

void SetTempUID(UidType& id)
{
    id = (id & 0xBFFFFFFFFFFFFFFF) | ((static_cast<UidType>(0x1) << 62) & 0x4000000000000000);
}

UidType ExtractPureUID(UidType id)     { return id & kPureUidMask; }
UidType ExtractServerGroupID(UidType id) { return (id >> kServerGroupShift) & kServerGroupMask; }
UidType ExtractServerID(UidType id)    { return (id >> kServerIDShift) & kServerIDMask; }
UidType ExtractReservedID(UidType id)  { return (id >> kReservedIDShift) & kReservedIDMask; }

void SetPureUID(UidType& dst, UidType src)
{
    dst = (dst & ~kPureUidMask) | (src & kPureUidMask);
}
void SetServerGroupID(UidType& dst, UidType src)
{
#if defined(X2_EXTEND_SERVER_GROUP_MASK)
    dst = (dst & 0xC00FFFFFFFFFFFFF) | (((src & 0x3FF) << 52) & 0x3FF0000000000000);
#else
    dst = (dst & 0xC0FFFFFFFFFFFFFF) | (((src & 0x3F) << 56) & 0x3F00000000000000);
#endif
}
void SetServerID(UidType& dst, UidType src)
{
#if defined(X2_EXTEND_SERVER_GROUP_MASK)
    dst = (dst & 0xFFF00FFFFFFFFFFF) | (((src & 0xFF) << 44) & 0x000FF00000000000);
#else
    dst = (dst & 0xFF00FFFFFFFFFFFF) | (((src & 0xFF) << 48) & 0x00FF000000000000);
#endif
}
void SetReservedID(UidType& dst, UidType src)
{
#if defined(X2_EXTEND_SERVER_GROUP_MASK)
    dst = (dst & 0xFFFFF00FFFFFFFFF) | (((src & 0xFF) << 36) & 0x00000FF000000000);
#else
    dst = (dst & 0xFFFF00FFFFFFFFFF) | (((src & 0xFF) << 40) & 0x0000FF0000000000);
#endif
}

}} // namespace x2::uid
