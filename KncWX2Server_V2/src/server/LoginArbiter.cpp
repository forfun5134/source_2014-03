// LoginArbiter.cpp
#include "LoginArbiter.h"

#include "../core/NetError.h"

namespace x2 {

static std::string WideToUtf8(const std::wstring& w)
{
    // Login 僅允許 [A-Za-z0-9_-] 區段時此函式只作 ASCII 轉換；
    // 非 ASCII 以 UTF-8 編碼（不依賴平台 API）。
    std::string out;
    out.reserve(w.size());
    for (wchar_t ch : w) {
        const uint32_t c = static_cast<uint32_t>(ch);
        if (c < 0x80) out.push_back(static_cast<char>(c));
        else if (c < 0x800) {
            out.push_back(static_cast<char>(0xC0 | (c >> 6)));
            out.push_back(static_cast<char>(0x80 | (c & 0x3F)));
        } else {
            out.push_back(static_cast<char>(0xE0 | (c >> 12)));
            out.push_back(static_cast<char>(0x80 | ((c >> 6) & 0x3F)));
            out.push_back(static_cast<char>(0x80 | (c & 0x3F)));
        }
    }
    return out;
}

bool LoginArbiter::HandleConnectReq(const login::ConnectReq& kReq, login::ConnectAck& kAck,
                                    const LoginConfig& cfg)
{
    kAck = login::ConnectAck{};
    if (kReq.version != cfg.mainVersion) {
        kAck.iOK = ERR_CONNECT_00;          // 原碼：版本不符 → ERR_CONNECT_00 + ReserveDestroy
        return false;
    }
    if (cfg.nowUser >= cfg.maxUser && cfg.maxUser > 0) {
        kAck.iOK = ERR_CONNECT_04;          // 原碼：(iNowUser - 1) >= iMaxUser → ERR_CONNECT_04
        return false;
    }
    kAck.iOK = NET_OK;
    kAck.udpPort = cfg.udpPort;
    kAck.channelId = cfg.channelId;
    return true;
}

int LoginArbiter::HandleVerifyAccountReq(db::UserStore& users,
                                         const login::VerifyAccountReq& kReq,
                                         const std::string& clientIp,
                                         login::VerifyAccountAck& kAck)
{
    kAck = login::VerifyAccountAck{};
    const std::string userId = WideToUtf8(kReq.userID);
    const std::string password = WideToUtf8(kReq.passwd);

    std::string err;
    db::UserRecord rec;
    bool found = false;
    if (!users.FindUser(userId, rec, found, err)) {
        kAck.iOK = ERR_VERIFY_10;           // DB 層錯誤對外一律不透露細節；以 NEXON 失敗碼兜底
        return kAck.iOK;
    }
    if (!found) {
        kAck.iOK = ERR_VERIFY_04;           // 使用者不存在
        return kAck.iOK;
    }

    const db::VerifyResult vr = users.VerifyPassword(userId, password, err);
    if (vr == db::VerifyResult::Error) {
        kAck.iOK = ERR_VERIFY_10;
        return kAck.iOK;
    }
    if (vr == db::VerifyResult::Invalid) {
        kAck.iOK = ERR_VERIFY_06;           // 密碼錯誤
        return kAck.iOK;
    }

    // 成功：先升級舊 md5 列（需明文密碼），再記錄登入
    users.UpgradePasswordIfLegacy(userId, password, err);   // 失敗不影響登入（下次再升級）
    if (!users.RecordLogin(userId, clientIp, err)) {
        // 登入狀態寫入失敗：仍回成功（不踢使用者），由上層記 log
    }

    kAck.iOK = NET_OK;
    kAck.accountInfo.userUID = rec.loginUID;
    kAck.accountInfo.id = kReq.userID;
    kAck.accountInfo.name = kReq.userID;    // 原版 name 來自出版商資料（無本地欄位）；先以 ID 代替，文件註明
    kAck.accountInfo.authLevel = rec.grade; // 暫以 users.Grade 對應 AuthLevel（provisioning 層級，文件註明）
    kAck.accountInfo.internalUser = false;
    kAck.accountInfo.option.playGuide = false;
    // blockInfo 留空（無本地封鎖資料）
    kAck.accountInfo.isRecommend = false;
    kAck.accountInfo.isGuestUser = false;
    kAck.accountInfo.otp = L"";
    kAck.accountInfo.lastLogin = L"";
    kAck.accountInfo.channelRandomKey = kReq.channelRandomKey;   // 原版回傳同值（繞過重放）
    kAck.hackingUserType = 0;
    kAck.adURL = L"";
    kAck.sex = (rec.sex == "F");
    kAck.age = 0;                            // 無本地年齡資料
    kAck.nexonSN = 0;                        // 出版商 SN 由 publisher 後端提供（開發替代品無此資料）
    {
        // clientIp (UTF-8) → wstring（ASCII 區段直轉）
        kAck.clientIP.assign(clientIp.begin(), clientIp.end());
    }
    kAck.channelCode = 0;                    // 0 = 自有通路（非 TooniLand）
    kAck.channelUserID = L"";
    return kAck.iOK;
}

} // namespace x2
