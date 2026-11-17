// CharacterListProtocol.cpp — 見 CharacterListProtocol.h 的對照說明
#include "CharacterListProtocol.h"
#include "../core/Serializer.h"
#include "WireHelpers.h"

namespace x2 { namespace character_list {

static bool PutUnitInfoVec(Serializer& s2, const std::vector<unit::UnitInfo>& v)
{
    return x2::detail::PutCountPrefixVec(s2, v,
        [](Serializer& s3, const unit::UnitInfo& e) { return unit::PutUnitInfo(s3, e); });
}
static bool GetUnitInfoVec(Serializer& s2, std::vector<unit::UnitInfo>& v)
{
    return x2::detail::GetCountPrefixVec(s2, v,
        [](Serializer& s3, unit::UnitInfo& e) { return unit::GetUnitInfo(s3, e); });
}

bool PutCharacterListReq(Serializer&, const CharacterListReq&) { return true; }
bool GetCharacterListReq(Serializer&, CharacterListReq&) { return true; }

bool PutCharacterListAck(Serializer& ks, const CharacterListAck& v)
{
    if (!ks.Put(v.iOK)) return false;
    if (!x2::detail::PutCountPrefixMap(ks, v.mapServerGroupUnitSlot,
            [](Serializer& s2, const int32_t& k) { return s2.Put(k); },
            [](Serializer& s2, const int32_t& v2) { return s2.Put(v2); })) return false;
    if (!x2::detail::PutCountPrefixMap(ks, v.mapServerGroupUnitInfo,
            [](Serializer& s2, const int32_t& k) { return s2.Put(k); },
            [](Serializer& s2, const std::vector<unit::UnitInfo>& v2) { return PutUnitInfoVec(s2, v2); })) return false;
    return ks.Put(v.strUserID);
}
bool GetCharacterListAck(Serializer& ks, CharacterListAck& v)
{
    if (!ks.Get(v.iOK)) return false;
    if (!x2::detail::GetCountPrefixMap(ks, v.mapServerGroupUnitSlot,
            [](Serializer& s2, int32_t& k) { return s2.Get(k); },
            [](Serializer& s2, int32_t& v2) { return s2.Get(v2); })) return false;
    if (!x2::detail::GetCountPrefixMap(ks, v.mapServerGroupUnitInfo,
            [](Serializer& s2, int32_t& k) { return s2.Get(k); },
            [](Serializer& s2, std::vector<unit::UnitInfo>& v2) { return GetUnitInfoVec(s2, v2); })) return false;
    return ks.Get(v.strUserID);
}

}} // namespace x2::character_list
