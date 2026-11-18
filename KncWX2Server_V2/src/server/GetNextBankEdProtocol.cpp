#include "GetNextBankEdProtocol.h"
#include "../core/NetError.h"
#include "../core/Serializer.h"

namespace x2 { namespace get_next_bank_ed {
bool PutGetNextBankEdReq(Serializer&, const GetNextBankEdReq&) { return true; }
bool GetGetNextBankEdReq(Serializer&, GetNextBankEdReq&) { return true; }
bool PutGetNextBankEdAck(Serializer& s, const GetNextBankEdAck& a) { return s.Put(a.iOK) && s.Put(a.iED); }
bool GetGetNextBankEdAck(Serializer& s, GetNextBankEdAck& a) { return s.Get(a.iOK) && s.Get(a.iED); }

int32_t HandleGetNextBankEdReq(db::GameStore& store, int64_t uid, GetNextBankEdAck& ack, std::string& err)
{
    ack = GetNextBankEdAck{};
    err.clear();
    db::GUnitRecord unit{};
    bool found = false;
    if (uid <= 0 || !store.GetUnitByUID(uid, unit, found, err) || !found || unit.deleted) {
        if (err.empty()) err = "unit not found or invalid";
        return ack.iOK = ERR_ODBC_01;
    }
    std::map<int32_t, int32_t> slots;
    if (!store.GetInventorySlotSize(uid, slots, err)) return ack.iOK = ERR_ODBC_01;
    const auto it = slots.find(8); // ST_BANK: DB stores additions to the base eight slots.
    const int64_t expanded = it == slots.end() ? 0 : it->second;
    int64_t grade = 8 + expanded;
    // Inventory::Init resets an invalid bank membership to its base size.
    if (grade < 8 || grade > 48 || grade % 8 != 0) grade = 8;
    // Original compares grade (8..48) with item ID 213500, so platinum reaches
    // GetNextBankMemberShip(MPB_PLATINUM) == MPB_NONE and returns _03.
    if (grade == 48) return ack.iOK = ERR_EXPAND_INVENTORY_ED_03;
    static constexpr int32_t prices[] = {4000000, 8000000, 18000000, 54000000, 65000000};
    ack.iED = prices[(grade - 8) / 8];
    return ack.iOK = NET_OK;
}
} }
