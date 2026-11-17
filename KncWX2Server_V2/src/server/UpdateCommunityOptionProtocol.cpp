// UpdateCommunityOptionProtocol.cpp — 見 .h 檔頭的語意對照與偏差聲明
#include "UpdateCommunityOptionProtocol.h"

#include "../core/NetError.h"
#include "../core/Serializer.h"

namespace x2 { namespace community_option {

bool PutUpdateCommunityOptionReq(Serializer& ks, const UpdateCommunityOptionReq& v)
{
    return unit::PutDenyOptions(ks, v.kDenyOptions);
}

bool GetUpdateCommunityOptionReq(Serializer& ks, UpdateCommunityOptionReq& v)
{
    return unit::GetDenyOptions(ks, v.kDenyOptions);
}

bool PutUpdateCommunityOptionAck(Serializer& ks, const UpdateCommunityOptionAck& v)
{
    return ks.Put(v.iOK) && unit::PutDenyOptions(ks, v.kDenyOptions);
}

bool GetUpdateCommunityOptionAck(Serializer& ks, UpdateCommunityOptionAck& v)
{
    return ks.Get(v.iOK) && unit::GetDenyOptions(ks, v.kDenyOptions);
}

bool ValidateDenyOptions(const DenyOptions& v)
{
    // 原 UserGameOption.cpp:35–96（KUserGameOption::SetDenyOptions 的驗證段）；保留原碼不對稱上限：
    //   FriendShip ∈ [0, DOS_OFF=1]（原碼不接受 DOS_ONLY_FRIEND——可能是刻意（好友拒絕無「僅好友」態），不自作主張放寬）
    //   其餘五欄 ∈ [0, DOS_ONLY_FRIEND=2]
    if (v.cDenyFriendShip < 0 || v.cDenyFriendShip > 1 /* DOS_OFF */) return false;
    if (v.cDenyInviteGuild < 0 || v.cDenyInviteGuild > 2 /* DOS_ONLY_FRIEND */) return false;
    if (v.cDenyParty < 0 || v.cDenyParty > 2) return false;
    if (v.cDenyPersonalTrade < 0 || v.cDenyPersonalTrade > 2) return false;
    if (v.cDenyRequestCouple < 0 || v.cDenyRequestCouple > 2) return false;
    if (v.cDenyInvitePracticePVP < 0 || v.cDenyInvitePracticePVP > 2) return false;
    return true;
}

int32_t HandleUpdateCommunityOptionReq(db::GameStore& gameDb, int64_t unitUID,
                                       const UpdateCommunityOptionReq& req,
                                       UpdateCommunityOptionAck& ack,
                                       std::string& err)
{
    // 1) 驗證（原 KUserGameOption::SetDenyOptions 驗證失敗 → ERR_COMMUNITY_OPT_01）
    if (!ValidateDenyOptions(req.kDenyOptions)) {
        ack.iOK = ERR_COMMUNITY_OPT_01;
        ack.kDenyOptions = DenyOptions{};   // 原版失敗路徑 m_kDenyOptions 未初始化；V2 歸零避免 wire 洩漏
        err.clear();
        return ack.iOK;
    }

    // 2) write-through 至 gdenyoption（見檔頭偏差聲明 1/4）
    db::DenyOptionValues dv;
    dv.friendShip        = req.kDenyOptions.cDenyFriendShip;
    dv.inviteGuild       = req.kDenyOptions.cDenyInviteGuild;
    dv.party             = req.kDenyOptions.cDenyParty;
    dv.personalTrade     = req.kDenyOptions.cDenyPersonalTrade;
    dv.requestCouple     = req.kDenyOptions.cDenyRequestCouple;
    dv.invitePracticePVP = req.kDenyOptions.cDenyInvitePracticePVP;
    if (!gameDb.UpdateDenyOptions(unitUID, dv, err)) {
        ack.iOK = ERR_COMMUNITY_OPT_02;
        ack.kDenyOptions = DenyOptions{};
        err = std::string("update community options: ") + err;
        return ack.iOK;
    }

    // 3) 成功：回顯（原 EGS_UPDATE_COMMUNITY_OPTION_REQ 成功路徑）
    ack.iOK = NET_OK;
    ack.kDenyOptions = req.kDenyOptions;
    err.clear();
    return ack.iOK;
}

}} // namespace x2::community_option
