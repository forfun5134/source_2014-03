// DeleteBlacklistUserProtocol.h — EGS_DEL_BLACKLIST_USER_REQ/ACK (363/364).
// Only the persistent delete half is ported here; adding a nickname still depends on LoginServer online-user lookup.
#pragma once

#include <cstdint>
#include <string>

#include "../db/GameStore.h"

namespace x2 { class Serializer; }

namespace x2 { namespace delete_blacklist_user {

struct DeleteBlacklistUserReq
{
    int64_t iUnitUID = 0;
};
struct ChatBlacklistUnit
{
    int64_t iUnitUID = 0;
    std::wstring wstrNickName;
};
struct DeleteBlacklistUserAck
{
    int32_t iOK = 0;
    ChatBlacklistUnit kChatBlackListUnit;
};

bool PutDeleteBlacklistUserReq(Serializer& ks, const DeleteBlacklistUserReq& value);
bool GetDeleteBlacklistUserReq(Serializer& ks, DeleteBlacklistUserReq& value);
bool PutDeleteBlacklistUserAck(Serializer& ks, const DeleteBlacklistUserAck& value);
bool GetDeleteBlacklistUserAck(Serializer& ks, DeleteBlacklistUserAck& value);

// Self target → ERR_BLACKLIST_06; absent membership → ERR_BLACKLIST_02; transactional DB failure → ERR_BLACKLIST_04.
int32_t HandleDeleteBlacklistUserReq(db::GameStore& gameDb, int64_t ownerUnitUID,
                                     const DeleteBlacklistUserReq& req,
                                     DeleteBlacklistUserAck& ack, std::string& err);

} } // namespace x2::delete_blacklist_user
