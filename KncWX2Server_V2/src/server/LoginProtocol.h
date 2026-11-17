// LoginProtocol.h — EGS_CONNECT_REQ / EGS_VERIFY_ACCOUNT_REQ / EGS_VERIFY_ACCOUNT_ACK
// 的 wire 結構與序列化（V2 `x2::login` 命名空間）。
//
// 對齊對象：原 X2Project（SERV_INT_INTERNAL＝JP 內部版本）的 KEGS_CONNECT_REQ /
// KUserAuthenticateReq(＝KEGS_VERIFY_ACCOUNT_REQ) / KEGS_VERIFY_ACCOUNT_ACK / KAccountInfo
// 的 **實際序列化順序**（見 KncWX2Server/Common/CommonPacket.{h,cpp} 與 ClientPacket.h）。
//
// SERV_INT_INTERNAL 的成員集合（機器查核，2026-11-16）：
//   ConnectReq        : wstring m_wstrVersion
//   VerifyAccountReq  : bool   m_bDebugAuth
//                       wstring m_wstrUserID / m_wstrPasswd / m_wstrHWID   (SERV_OTP_AUTH)
//                       string  m_strMachineID                            (SERV_MACHINE_ID_DUPLICATE_CHECK)
//                       int32   m_kChannelRandomKey                       (SERV_DLL_LIST_CHECK_BEFOR_LOADING)
//                       char    m_charServerSN[12]（12 個 1-byte Put，無長度前綴）(SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)
//                       int32   m_iChannelingCode                          (無條件)
//                       bool    m_bManualLogin                             (SERV_KOG_OTP_VERIFY，SERV_GLOBAL_COMMON 定義）
//                       ← SERV_CHECK_MACHINE_LOCALTIME 未定義；SERV_COUNTRY_TH/SERV_STEAM/SERV_CHANNELING_AERIA 未定義（JP）
//   ConnectAck        : int32 iOK, int32 UDPPort, int32 ChannelID       (UDP_CAN_NOT_SEND_USER_KICK 未定義)
//   AccountInfo       : int64 UserUID, wstring ID, wstring Name, int32 AuthLevel, bool InternalUser,
//                       KAccountOption{bool PlayGuide},
//                       KAccountBlockInfo{wstring EndTime, wstring BlockReason},
//                       bool IsRecommend, bool IsGuestUser, wstring OTP,
//                       wstring RegDate          (SERV_CASH_ITEM_LIST **已定義**，#define 雙空格曾被漏讀)
//                       wstring LastLogin        (SERV_SECOND_SECURITY)
//                       int32  ChannelRandomKey  (SERV_DLL_LIST_CHECK_BEFOR_LOADING)
//                       ← SERV_HACKING_USER_CHECK_COUNT 未定義
//   VerifyAccountAck  : int32 OK, AccountInfo, char HackingUserType, wstring AdURL,
//                       bool Sex, uint32 Age, uint32 NexonSN,
//                       wstring ClientIP         (SERV_CLIENT_PUBLIC_IP)
//                       uint8 ChannelCode        (無條件), wstring ChannelUserID
//                       ← SERV_EVENT_MONEY 未定義
//
// 注意：這只覆蓋上述定義組合；更換地區或開關定義會改變 wire 佈局（原碼即如此）。
// 事件 ID 對應（V2 EventIDs.h 實測）：EGS_CONNECT_REQ=26, EGS_CONNECT_ACK=27,
//                                     EGS_VERIFY_ACCOUNT_REQ=30, EGS_VERIFY_ACCOUNT_ACK=31。
// 事件本身由 x2::Event（Session 層）封裝；本檔只處理 kbuff 內容。
#pragma once

#include <cstdint>
#include <string>

namespace x2 { class Serializer; }

namespace x2 { namespace login {

struct ConnectReq
{
    std::wstring version;
};
struct ConnectAck
{
    int32_t iOK = 0;
    int32_t udpPort = 0;
    int32_t channelId = 0;
};

struct AccountOption
{
    bool playGuide = false;
};
struct AccountBlockInfo
{
    std::wstring endTime;
    std::wstring blockReason;
};
struct AccountInfo
{
    int64_t userUID = 0;
    std::wstring id;
    std::wstring name;
    int32_t authLevel = 0;
    bool internalUser = false;
    AccountOption option;
    AccountBlockInfo blockInfo;
    bool isRecommend = false;
    bool isGuestUser = false;
    std::wstring otp;
    std::wstring regDate;          // SERV_CASH_ITEM_LIST（#define  雙空格——建置巨集核對必須寬鬆匹配）
    std::wstring lastLogin;        // SERV_SECOND_SECURITY
    int32_t channelRandomKey = 0;  // SERV_DLL_LIST_CHECK_BEFOR_LOADING
};

struct VerifyAccountReq
{
    bool debugAuth = false;
    std::wstring userID;
    std::wstring passwd;
    std::wstring hwid;                    // SERV_OTP_AUTH
    std::string machineID;                // SERV_MACHINE_ID_DUPLICATE_CHECK
    int32_t channelRandomKey = 0;         // SERV_DLL_LIST_CHECK_BEFOR_LOADING
    char serverSN[12] = {};               // SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER（無長度前綴）
    int32_t channelingCode = 0;           // 無條件
    bool manualLogin = false;             // SERV_KOG_OTP_VERIFY
};

struct VerifyAccountAck
{
    int32_t iOK = 0;
    AccountInfo accountInfo;
    char hackingUserType = 0;
    std::wstring adURL;
    bool sex = false;
    uint32_t age = 0;
    uint32_t nexonSN = 0;
    std::wstring clientIP;                // SERV_CLIENT_PUBLIC_IP
    uint8_t channelCode = 0;              // 無條件（0=自有/3=TooniLand）
    std::wstring channelUserID;
};

bool PutConnectReq(Serializer& ks, const ConnectReq& v);
bool GetConnectReq(Serializer& ks, ConnectReq& v);
bool PutConnectAck(Serializer& ks, const ConnectAck& v);
bool GetConnectAck(Serializer& ks, ConnectAck& v);
bool PutAccountInfo(Serializer& ks, const AccountInfo& v);
bool GetAccountInfo(Serializer& ks, AccountInfo& v);
bool PutVerifyAccountReq(Serializer& ks, const VerifyAccountReq& v);
bool GetVerifyAccountReq(Serializer& ks, VerifyAccountReq& v);
bool PutVerifyAccountAck(Serializer& ks, const VerifyAccountAck& v);
bool GetVerifyAccountAck(Serializer& ks, VerifyAccountAck& v);

} // namespace login
} // namespace x2
