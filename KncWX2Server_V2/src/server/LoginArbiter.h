// LoginArbiter.h — 「連線 → 認證」仲裁器（無 socket 依賴，可單元測試）
//
// 對應原 KGSUser::OnConnectReq / OnNexonUserAuthenticateAck 的「決策」部分。
// 重要誠實聲明：
//   - 原版 JP 的密碼驗證走 **NEXON / 出版商認證**（SOAP/GW），不碰 users.passwd；
//     V2 這裡的本地驗證是 **開發用替代品**（UserStore + salted SHA-256），
//     僅用於在沒有出版商基礎設施時打通「連線 → 認證 → ACK」最短路徑，
//     **不得用於生產**；publisher 接入後會整體替換 VerifyAccount 路徑。
//   - CONNECT_ACK 語意對齊原 OnConnectReq：版本不符→ERR_CONNECT_00、伺服器滿→ERR_CONNECT_04、正常→NET_OK。
//   - VERIFY_ACCOUNT_ACK 語意：NET_OK=成功；user 不存在→ERR_VERIFY_04；密碼錯誤→ERR_VERIFY_06。
//   - 成功時呼叫 UserStore::RecordLogin（Connecting=1、lastLogin/lastConnect=now、IPAddress=ip）。
#pragma once

#include <cstdint>
#include <string>

#include "../db/UserStore.h"
#include "LoginProtocol.h"

namespace x2 {

struct LoginConfig
{
    std::wstring mainVersion = L"1.0.0";   // 原 KBaseServer::GetKObj()->GetMainVersion()
    int32_t udpPort = 0;                   // 接續 NET_LAYER 的 NC UDP port（0=未配置）
    int32_t channelId = 0;                 // 原 SiKChannelManager()->GetChannelID()
    int32_t maxUser = 10000;               // 伺服器容納上限
    int32_t nowUser = 0;                   // 目前人數（不含自己）
};

class LoginArbiter
{
public:
    // 版本檢查 + 容量檢查；填充 kAck（含 iOK）；回傳是否接受（原函式 bool 語意）
    static bool HandleConnectReq(const login::ConnectReq& kReq, login::ConnectAck& kAck,
                                 const LoginConfig& cfg);

    // 本地（開發用）帳號驗證；填充 kAck；成功時更新 DB 的登入狀態（RecordLogin + 可選升級 md5）。
    // clientIp 以 UTF-8 存入 IPAddress（原欄 nvarchar(15)；超長會被 DB CHECK 拒絕——此為刻意）。
    // 回傳 NET_OK / ERR_VERIFY_04 / ERR_VERIFY_06 / ERR_UNKNOWN(DB 錯誤)。
    static int HandleVerifyAccountReq(db::UserStore& users,
                                      const login::VerifyAccountReq& kReq,
                                      const std::string& clientIp,
                                      login::VerifyAccountAck& kAck);
};

} // namespace x2
