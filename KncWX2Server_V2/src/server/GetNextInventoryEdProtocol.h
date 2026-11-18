// Read-only EGS_GET_NEXT_INVENTORY_ED_REQ/ACK (1145/1146).
#pragma once
#include <cstdint>
#include <string>
#include "../db/GameStore.h"
namespace x2 { class Serializer; }
namespace x2 { namespace get_next_inventory_ed {
struct GetNextInventoryEdReq {};
struct GetNextInventoryEdAck { int32_t iOK = 0; int32_t iED = 0; };
bool PutGetNextInventoryEdReq(Serializer&, const GetNextInventoryEdReq&);
bool GetGetNextInventoryEdReq(Serializer&, GetNextInventoryEdReq&);
bool PutGetNextInventoryEdAck(Serializer&, const GetNextInventoryEdAck&);
bool GetGetNextInventoryEdAck(Serializer&, GetNextInventoryEdAck&);
int32_t HandleGetNextInventoryEdReq(db::GameStore&, int64_t unitUID, GetNextInventoryEdAck&, std::string& err);
} }
