// Read-only EGS_GET_NEXT_BANK_ED_REQ/ACK (1141/1142).
#pragma once
#include <cstdint>
#include <string>
#include "../db/GameStore.h"
namespace x2 { class Serializer; }
namespace x2 { namespace get_next_bank_ed {
struct GetNextBankEdReq {};
struct GetNextBankEdAck { int32_t iOK = 0; int32_t iED = 0; };
bool PutGetNextBankEdReq(Serializer&, const GetNextBankEdReq&);
bool GetGetNextBankEdReq(Serializer&, GetNextBankEdReq&);
bool PutGetNextBankEdAck(Serializer&, const GetNextBankEdAck&);
bool GetGetNextBankEdAck(Serializer&, GetNextBankEdAck&);
int32_t HandleGetNextBankEdReq(db::GameStore&, int64_t unitUID, GetNextBankEdAck&, std::string& err);
} }
