#include "GetNextInventoryEdProtocol.h"
#include "../core/NetError.h"
#include "../core/Region.h"
#include "../core/Serializer.h"

namespace x2 { namespace get_next_inventory_ed {
bool PutGetNextInventoryEdReq(Serializer&, const GetNextInventoryEdReq&) { return true; }
bool GetGetNextInventoryEdReq(Serializer&, GetNextInventoryEdReq&) { return true; }
bool PutGetNextInventoryEdAck(Serializer& s, const GetNextInventoryEdAck& a) { return s.Put(a.iOK) && s.Put(a.iED); }
bool GetGetNextInventoryEdAck(Serializer& s, GetNextInventoryEdAck& a) { return s.Get(a.iOK) && s.Get(a.iED); }

int32_t HandleGetNextInventoryEdReq(db::GameStore& store, int64_t uid, GetNextInventoryEdAck& ack, std::string& err)
{
    ack = GetNextInventoryEdAck{};
    err.clear();
    db::GUnitRecord unit{};
    bool found = false;
    if (uid <= 0 || !store.GetUnitByUID(uid, unit, found, err) || !found || unit.deleted) {
        if (err.empty()) err = "unit not found or invalid";
        return ack.iOK = ERR_ODBC_01;
    }
    std::map<int32_t, int32_t> slots;
    if (!store.GetInventorySlotSize(uid, slots, err)) return ack.iOK = ERR_ODBC_01;
    // Original IsAbleToExpandSlot checks all six categories; values stored in DB are additions to base.
    const bool twhk = CurrentRegion() == Region::TW || CurrentRegion() == Region::HK;
    const bool special24 = twhk || CurrentRegion() == Region::CN || CurrentRegion() == Region::US ||
                           CurrentRegion() == Region::TH || CurrentRegion() == Region::PH;
    int32_t equip = 0;
    for (int category = 1; category <= 6; ++category) {
        const auto it = slots.find(category);
        const int32_t expanded = it == slots.end() ? 0 : it->second;
        if (expanded < 0) { err = "invalid inventory slot count"; return ack.iOK = ERR_ODBC_01; }
        const int base = category == 4 ? (special24 ? 24 : 32) : (twhk ? 16 : 24);
        if (static_cast<int64_t>(base) + expanded + 8 > 56)
            return ack.iOK = ERR_EXPAND_INVENTORY_ED_02;
        if (category == 1) equip = expanded;
    }
    static constexpr int32_t prices[] = {5000000, 10000000, 24000000, 75000000};
    const int stage = equip / 8;
    if (stage >= 4) return ack.iOK = ERR_EXPAND_INVENTORY_ED_03;
    ack.iED = prices[stage];
    return ack.iOK = NET_OK;
}
} }
