// EntryPointChannelListProtocol.cpp — 見 EntryPointChannelListProtocol.h 的對照說明
#include "EntryPointChannelListProtocol.h"
#include "../core/Serializer.h"
#include "WireHelpers.h"

namespace x2 { namespace channel_list {

bool PutChannelInfo(Serializer& ks, const ChannelInfo& v)
{
    if (!ks.Put(v.iServerUID)) return false;
    if (!ks.Put(v.iChannelID)) return false;
    if (!ks.Put(v.wstrChannelName)) return false;
    if (!ks.Put(v.iServerGroupID)) return false;
    if (!ks.Put(v.wstrIP)) return false;
    if (!ks.Put(v.usMasterPort)) return false;
    if (!ks.Put(v.usNCUDPPort)) return false;
    if (!ks.Put(v.iMaxUser)) return false;
    if (!ks.Put(v.iCurrentUser)) return false;
    if (!ks.Put(v.iCurPartyCount)) return false;
    return ks.Put(v.iPlayGamePartyCount);
}
bool GetChannelInfo(Serializer& ks, ChannelInfo& v)
{
    if (!ks.Get(v.iServerUID)) return false;
    if (!ks.Get(v.iChannelID)) return false;
    if (!ks.Get(v.wstrChannelName)) return false;
    if (!ks.Get(v.iServerGroupID)) return false;
    if (!ks.Get(v.wstrIP)) return false;
    if (!ks.Get(v.usMasterPort)) return false;
    if (!ks.Get(v.usNCUDPPort)) return false;
    if (!ks.Get(v.iMaxUser)) return false;
    if (!ks.Get(v.iCurrentUser)) return false;
    if (!ks.Get(v.iCurPartyCount)) return false;
    return ks.Get(v.iPlayGamePartyCount);
}

bool PutChannelBonusInfo(Serializer& ks, const ChannelBonusInfo& v)
{
    return ks.Put(v.bEnable) && ks.Put(v.iBeginLv) && ks.Put(v.iEndLv) && ks.Put(v.iPerExp) && ks.Put(v.iPerED);
}
bool GetChannelBonusInfo(Serializer& ks, ChannelBonusInfo& v)
{
    return ks.Get(v.bEnable) && ks.Get(v.iBeginLv) && ks.Get(v.iEndLv) && ks.Get(v.iPerExp) && ks.Get(v.iPerED);
}

bool PutGetChannelListReq(Serializer&, const GetChannelListReq&) { return true; }
bool GetGetChannelListReq(Serializer&, GetChannelListReq&) { return true; }

static bool PutChannelInfoMap(Serializer& ks, const std::map<int32_t, ChannelInfo>& m)
{
    return x2::detail::PutCountPrefixMap(ks, m,
        [](Serializer& s2, const int32_t& k) { return s2.Put(k); },
        [](Serializer& s2, const ChannelInfo& v) { return PutChannelInfo(s2, v); });
}
static bool GetChannelInfoMap(Serializer& ks, std::map<int32_t, ChannelInfo>& m)
{
    return x2::detail::GetCountPrefixMap(ks, m,
        [](Serializer& s2, int32_t& k) { return s2.Get(k); },
        [](Serializer& s2, ChannelInfo& v) { return GetChannelInfo(s2, v); });
}
static bool PutChannelBonusInfoMap(Serializer& ks, const std::map<int32_t, ChannelBonusInfo>& m)
{
    return x2::detail::PutCountPrefixMap(ks, m,
        [](Serializer& s2, const int32_t& k) { return s2.Put(k); },
        [](Serializer& s2, const ChannelBonusInfo& v) { return PutChannelBonusInfo(s2, v); });
}
static bool GetChannelBonusInfoMap(Serializer& ks, std::map<int32_t, ChannelBonusInfo>& m)
{
    return x2::detail::GetCountPrefixMap(ks, m,
        [](Serializer& s2, int32_t& k) { return s2.Get(k); },
        [](Serializer& s2, ChannelBonusInfo& v) { return GetChannelBonusInfo(s2, v); });
}

bool PutGetChannelListAck(Serializer& ks, const GetChannelListAck& v)
{
    if (!PutChannelInfoMap(ks, v.mapSolesChannelList)) return false;
    if (!PutChannelInfoMap(ks, v.mapGaiaChannelList)) return false;
    if (!PutChannelBonusInfoMap(ks, v.mapSolesChannelBonusList)) return false;
    return PutChannelBonusInfoMap(ks, v.mapGaiaChannelBonusList);
}
bool GetGetChannelListAck(Serializer& ks, GetChannelListAck& v)
{
    if (!GetChannelInfoMap(ks, v.mapSolesChannelList)) return false;
    if (!GetChannelInfoMap(ks, v.mapGaiaChannelList)) return false;
    if (!GetChannelBonusInfoMap(ks, v.mapSolesChannelBonusList)) return false;
    return GetChannelBonusInfoMap(ks, v.mapGaiaChannelBonusList);
}

}} // namespace x2::channel_list
