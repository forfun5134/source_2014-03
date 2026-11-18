// DeleteBlacklistUserProtocol.cpp — EGS_DEL_BLACKLIST_USER_REQ/ACK (363/364).
#include "DeleteBlacklistUserProtocol.h"

#include "../core/NetError.h"
#include "../core/Serializer.h"

namespace x2 { namespace delete_blacklist_user {

namespace {
std::wstring Utf8ToWide(const std::string& in)
{
    std::wstring out;
    out.reserve(in.size());
    for (size_t i = 0; i < in.size();) {
        const unsigned char c = static_cast<unsigned char>(in[i]);
        uint32_t cp = 0;
        size_t len = 0;
        if (c < 0x80) { cp = c; len = 1; }
        else if ((c & 0xE0) == 0xC0) { cp = c & 0x1F; len = 2; }
        else if ((c & 0xF0) == 0xE0) { cp = c & 0x0F; len = 3; }
        else if ((c & 0xF8) == 0xF0) { cp = c & 0x07; len = 4; }
        else { cp = 0xFFFD; len = 1; }
        if (i + len > in.size()) { cp = 0xFFFD; len = 1; }
        else if (len > 1) {
            for (size_t j = 1; j < len; ++j)
                cp = (cp << 6) | (static_cast<unsigned char>(in[i + j]) & 0x3F);
        }
        if (sizeof(wchar_t) == 2 && cp > 0xFFFF) {
            cp -= 0x10000;
            out.push_back(static_cast<wchar_t>(0xD800 + (cp >> 10)));
            out.push_back(static_cast<wchar_t>(0xDC00 + (cp & 0x3FF)));
        } else {
            out.push_back(static_cast<wchar_t>(cp));
        }
        i += len;
    }
    return out;
}
}

bool PutDeleteBlacklistUserReq(Serializer& ks, const DeleteBlacklistUserReq& value)
{
    return ks.Put(value.iUnitUID);
}
bool GetDeleteBlacklistUserReq(Serializer& ks, DeleteBlacklistUserReq& value)
{
    return ks.Get(value.iUnitUID);
}
bool PutDeleteBlacklistUserAck(Serializer& ks, const DeleteBlacklistUserAck& value)
{
    return ks.Put(value.iOK) && ks.Put(value.kChatBlackListUnit.iUnitUID) &&
           ks.Put(value.kChatBlackListUnit.wstrNickName);
}
bool GetDeleteBlacklistUserAck(Serializer& ks, DeleteBlacklistUserAck& value)
{
    return ks.Get(value.iOK) && ks.Get(value.kChatBlackListUnit.iUnitUID) &&
           ks.Get(value.kChatBlackListUnit.wstrNickName);
}

int32_t HandleDeleteBlacklistUserReq(db::GameStore& gameDb, int64_t ownerUnitUID,
                                     const DeleteBlacklistUserReq& req,
                                     DeleteBlacklistUserAck& ack, std::string& err)
{
    ack = DeleteBlacklistUserAck{};
    err.clear();
    if (req.iUnitUID == ownerUnitUID) {
        ack.iOK = ERR_BLACKLIST_06;
        return ack.iOK;
    }

    std::string nickname;
    const auto result = gameDb.DeleteBlacklistEntry(ownerUnitUID, req.iUnitUID, nickname, err);
    switch (result) {
        case db::DeleteBlacklistResult::Removed:
            ack.iOK = NET_OK;
            ack.kChatBlackListUnit.iUnitUID = req.iUnitUID;
            ack.kChatBlackListUnit.wstrNickName = Utf8ToWide(nickname);
            return ack.iOK;
        case db::DeleteBlacklistResult::NotFound:
            ack.iOK = ERR_BLACKLIST_02;
            return ack.iOK;
        case db::DeleteBlacklistResult::DbError:
            ack.iOK = ERR_BLACKLIST_04;
            return ack.iOK;
    }
    ack.iOK = ERR_BLACKLIST_04;
    return ack.iOK;
}

} } // namespace x2::delete_blacklist_user
