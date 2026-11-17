// Event.h — 對應原 KEvent / KPerformerInfo（Common/Event.*），位元組相容
// 線路表示（加密前）：
//   [PerformerID DWORD BE][uid set: DWORD BE count + UidType INT64 BE * n]
//   [trace[0] INT64 BE][trace[1] INT64 BE][EventID USHORT BE]
//   [kbuff: DWORD BE len + 1 byte compressed flag + raw bytes]
// kbuff 內容 = 封包本體（以 Serializer 序列化，big-endian），可經 zlib 壓縮（m_bCompress=1）
#pragma once

#include "Platform.h"
#include "Serializer.h"
#include "UidType.h"
#include "EventIDs.h"

#include <cstdint>
#include <set>

namespace x2 {

struct PerformerInfo
{
    uint32_t performerID = 0;   // PC_USER=1, PC_MASTER=2 ...（原 PerformerID：PC_USER 等）
    std::set<UidType> uids;
};

// 原 ENUM_SYSTEM_EVENT_ID / ENUM_CLIENT_EVENT_ID / ENUM_SERVER_EVENT_ID 的交界值（V2 EventIDs.h 實測對照 legacy 列舉順序）。
// ENUM_SERVER_EVENT_ID 為連續編號：DBE_SERVER_ON_REQ = 1174 … EVENT_EVENTID_SENTINEL = 2908，
// 因此「eventID 落在 [E_SERVER_EVENT_ID_BEGIN, EVENT_EVENTID_SENTINEL]」等價於原 EventID_Server.h 的 switch 判斷。
inline constexpr uint16_t E_SYSTEM_EVENT_ID_END = 20;
inline constexpr uint16_t EGS_CLIENT_EVENT_ID_END = 1173;
inline constexpr uint16_t E_SERVER_EVENT_ID_BEGIN = EGS_CLIENT_EVENT_ID_END + 1;   // 1174
inline constexpr uint16_t EVENT_EVENTID_SENTINEL = 2908;

class Event
{
public:
    // SERV_KEVENT_FROM（2011. 06. 08）：事件來源標記。**不進入線路**——
    // 原 KEvent 的 SERIALIZE_DEFINE_PUT/GET 不寫 m_usFromType；僅供接收端本機判斷。
    enum EVENT_FROM_TYPE : uint16_t
    {
        EFT_NONE = 0,
        EFT_SERVER = 1,
        EFT_CLIENT = 2,
    };

    PerformerInfo dest;
    UidType trace[2] = { -1, -1 };
    uint16_t eventID = 0;
    uint16_t fromType = EFT_NONE;   // 原 m_usFromType（本機欄位，不序列化）
    SerBuffer payload;              // 原 m_kbuff

    Event() = default;

    uint16_t GetFromType() const { return fromType; }
    void SetFromType(uint16_t t) { fromType = t; }
    // 對應原 KEvent::IsValidEventID()：EFT_CLIENT 事件不得是伺服器內部事件 ID，
    // 否則視為偽造／誤路由封包（原碼在 GameServer GSUserFunction 的 CheckIsValidPacketEvent 用）。
    bool IsValidEventID() const
    {
        if (fromType == EFT_CLIENT &&
            eventID >= E_SERVER_EVENT_ID_BEGIN && eventID <= EVENT_EVENTID_SENTINEL)
            return false;
        return true;
    }

    void SetData(uint32_t performerID, const UidType traceIn[2], uint16_t id);
    template <typename T>
    void SetData(uint32_t performerID, const UidType traceIn[2], uint16_t id, const T& data)
    {
        SetData(performerID, traceIn, id);
        payload.Clear();
        Serializer ks;
        if (!ks.BeginWriting(&payload)) return;
        ks.Put(data);
        ks.EndWriting();
    }

    template <typename T>
    bool GetData(T& out)
    {
        Serializer ks;
        if (!ks.BeginReading(&payload)) return false;
        const bool ok = ks.Get(out);
        ks.EndReading();
        return ok;
    }

    // payload 解壓（若 kbuff 帶壓縮旗標）；原 Event 解析後統一呼叫 UnCompress()
    bool UncompressPayload() { return payload.UnCompress(); }

    bool Serialize(SerBuffer& out) const;                    // 事件本體（明文）
    static bool Deserialize(const SerBuffer& in, Event& ev); // 解析事件本體

    UidType GetFirstSenderUID() const { return trace[0]; }
    UidType GetLastSenderUID() const { return trace[1] == -1 ? trace[0] : trace[1]; }
    bool IsEmptyTrace() const { return trace[0] == -1; }
    void PushTrace(UidType uid) { if (trace[0] == -1) trace[0] = uid; else if (trace[1] == -1) trace[1] = uid; }
    void PopTrace() { if (trace[1] != -1) trace[1] = -1; else trace[0] = -1; }
};

// 原 PerformerID（KncSend.h）完整對照；INT/通用模式（SERV_INT_INTERNAL → JP + Global defines）下全部有效。
// 合成規則：SC_*(server class) | PC_*(performer class) [| ST_SAME_SERV_GROUP]
namespace PerformerID {
// --- PC_* Performer Class ---
inline constexpr uint32_t PC_PROXY = 0x00000001, PC_USER = 0x00000002, PC_CHARACTER = 0x00000003,
                          PC_SERVER = 0x00000004, PC_ROOM = 0x00000005, PC_ACCOUNT_DB = 0x00000006,
                          PC_GAME_DB = 0x00000007, PC_LOG_DB = 0x00000008, PC_SMS_DB = 0x00000009,
                          PC_NX_WEB_DB = 0x0000000A, PC_NX_AUTH = 0x0000000B, PC_PARTY = 0x0000000C,
                          PC_NX_BILLING = 0x0000000D, PC_NX_BILLING_TCP = 0x0000000E,
                          PC_MATCH_MAKING = 0x0000000F, PC_NX_SOAP = 0x00000010,
                          PC_AUTO_PARTY = 0x00000011, PC_GAME_DB_2ND = 0x00000012, PC_LOG_DB_2ND = 0x00000013,
                          PC_NX_GMTOOL_TCP = 0x00000014, PC_CHAT_LOG_DB = 0x00000015,
                          // global billing / publisher auth
                          PC_KOG_BILLING_MANAGER = 0x00000051, PC_KOG_BILLING_DB = 0x00000052,
                          PC_PUBLISHER_AUTH = 0x00000053, PC_PUBLISHER_BILLING = 0x00000054,
                          PC_PUBLISHER_BILLING_DB = 0x00000055, PC_PUBLISHER_AUTH_DB = 0x00000056,
                          PC_AS_OTP_THREAD = 0x00000071,
                          PC_GIANT_AUTH = 0x00000083, PC_GIANT_ROLEREG = 0x00000084, PC_GIANT_INFO = 0x00000085,
                          PC_GIANT_BILLING = 0x00000086, PC_GIANT_COUPON = 0x00000087,
                          PC_ID_PCBANG_AUTH_DB = 0x00000090, PC_EVENT_DB = 0x00000091,
                          PC_SCRIPT_DB = 0x00000092, PC_JP_RELAY_DB = 0x000000A0;
inline constexpr uint32_t PC_MASK_BIT = 0x000000FF;
// --- SC_* Server Class ---
inline constexpr uint32_t SC_CLIENT = 0x00000100, SC_GAME = 0x00000200, SC_CENTER = 0x00000300,
                          SC_CHANNEL = 0x00000400, SC_LOGIN = 0x00000500, SC_SIMULATION = 0x00000600,
                          SC_GLOBAL = 0x00000700;
inline constexpr uint32_t SC_MASK_BIT = 0x00000F00, ST_MASK_BIT = 0x0000F000, ST_SAME_SERV_GROUP = 0x00001000;
// --- 合成 PerformerID（ePerformerID 全量對照，PI_NULL = 0xFFFFFFFF）---
// Client
inline constexpr uint32_t PI_GS_PROXY = SC_CLIENT | PC_PROXY;
// Game Server
inline constexpr uint32_t PI_GS_USER = SC_GAME | PC_USER;
inline constexpr uint32_t PI_GS_CHARACTER = SC_GAME | PC_CHARACTER;
inline constexpr uint32_t PI_GS_SERVER = SC_GAME | PC_SERVER;
inline constexpr uint32_t PI_GS_SERVER_SAME = SC_GAME | PC_SERVER | ST_SAME_SERV_GROUP;
inline constexpr uint32_t PI_GS_GAME_DB = SC_GAME | PC_GAME_DB;
inline constexpr uint32_t PI_GS_ACCOUNT_DB = SC_GAME | PC_ACCOUNT_DB;
inline constexpr uint32_t PI_GS_LOG_DB = SC_GAME | PC_LOG_DB;
inline constexpr uint32_t PI_GS_SMS_DB = SC_GAME | PC_SMS_DB;
inline constexpr uint32_t PI_GS_NX_WEB_DB = SC_GAME | PC_NX_WEB_DB;
inline constexpr uint32_t PI_CN_PROXY = SC_GAME | PC_PROXY, PI_LOGIN_PROXY = SC_GAME | PC_PROXY, PI_GLOBAL_PROXY = SC_GAME | PC_PROXY;
inline constexpr uint32_t PI_GS_NX_BILLING = SC_GAME | PC_NX_BILLING;
inline constexpr uint32_t PI_GS_NX_BILLING_TCP = SC_GAME | PC_NX_BILLING_TCP;
inline constexpr uint32_t PI_GS_FIELD = SC_GAME | PC_ROOM;
inline constexpr uint32_t PI_GS_PARTY = SC_GAME | PC_PARTY;
inline constexpr uint32_t PI_GS_NX_SOAP = SC_GAME | PC_NX_SOAP;
inline constexpr uint32_t PI_GS_GAME_DB_2ND = SC_GAME | PC_GAME_DB_2ND;
inline constexpr uint32_t PI_GS_LOG_DB_2ND = SC_GAME | PC_LOG_DB_2ND;
inline constexpr uint32_t PI_GS_CHAT_LOG_DB = SC_GAME | PC_CHAT_LOG_DB;
inline constexpr uint32_t PI_GS_KOG_BILLING_MANAGER = SC_GAME | PC_KOG_BILLING_MANAGER;
inline constexpr uint32_t PI_GS_KOG_BILLING_DB = SC_GAME | PC_KOG_BILLING_DB;
inline constexpr uint32_t PI_GS_PUBLISHER_AUTH = SC_GAME | PC_PUBLISHER_AUTH;
inline constexpr uint32_t PI_GS_PUBLISHER_BILLING = SC_GAME | PC_PUBLISHER_BILLING;
inline constexpr uint32_t PI_GS_PUBLISHER_BILLING_DB = SC_GAME | PC_PUBLISHER_BILLING_DB;
inline constexpr uint32_t PI_GS_ID_PUBLISHER_PCBANG_DB = SC_GAME | PC_ID_PCBANG_AUTH_DB;
inline constexpr uint32_t PI_GS_JP_RELAY_DB = SC_GAME | PC_JP_RELAY_DB;
inline constexpr uint32_t PI_GS_EVENT_DB = SC_GAME | PC_EVENT_DB;
inline constexpr uint32_t PI_GS_SCRIPT_DB = SC_GAME | PC_SCRIPT_DB;
// Center Server
inline constexpr uint32_t PI_CN_USER = SC_CENTER | PC_USER;
inline constexpr uint32_t PI_CN_SERVER = SC_CENTER | PC_SERVER;
inline constexpr uint32_t PI_CN_ROOM = SC_CENTER | PC_ROOM;
inline constexpr uint32_t PI_CN_PARTY = SC_CENTER | PC_PARTY;
inline constexpr uint32_t PI_CN_ACCOUNT_DB = SC_CENTER | PC_ACCOUNT_DB;
inline constexpr uint32_t PI_CN_GAME_DB = SC_CENTER | PC_GAME_DB;
inline constexpr uint32_t PI_CN_LOG_DB = SC_CENTER | PC_LOG_DB;
inline constexpr uint32_t PI_CN_SMS_DB = SC_CENTER | PC_SMS_DB;
inline constexpr uint32_t PI_CN_EVENT_DB = SC_CENTER | PC_EVENT_DB;
// Login Server
inline constexpr uint32_t PI_LOGIN_USER = SC_LOGIN | PC_USER;
inline constexpr uint32_t PI_LOGIN_SERVER = SC_LOGIN | PC_SERVER;
inline constexpr uint32_t PI_LOGIN_ROOM = SC_LOGIN | PC_ROOM;
inline constexpr uint32_t PI_LOGIN_ACCOUNT_DB = SC_LOGIN | PC_ACCOUNT_DB;
inline constexpr uint32_t PI_LOGIN_GAME_DB = SC_LOGIN | PC_GAME_DB;
inline constexpr uint32_t PI_LOGIN_LOG_DB = SC_LOGIN | PC_LOG_DB;
inline constexpr uint32_t PI_LOGIN_SMS_DB = SC_LOGIN | PC_SMS_DB;
inline constexpr uint32_t PI_LOGIN_NX_AUTH = SC_LOGIN | PC_NX_AUTH;
inline constexpr uint32_t PI_LOGIN_NX_WEB_DB = SC_LOGIN | PC_NX_WEB_DB;
inline constexpr uint32_t PI_LOGIN_EVENT_DB = SC_LOGIN | PC_EVENT_DB;
inline constexpr uint32_t PI_LOGIN_KOG_BILLING_MANAGER = SC_LOGIN | PC_KOG_BILLING_MANAGER;
inline constexpr uint32_t PI_LOGIN_KOG_BILLING_DB = SC_LOGIN | PC_KOG_BILLING_DB;
inline constexpr uint32_t PI_LOGIN_PUBLISHER_AUTH = SC_LOGIN | PC_PUBLISHER_AUTH;
inline constexpr uint32_t PI_LOGIN_PUBLISHER_BILLING = SC_LOGIN | PC_PUBLISHER_BILLING;
inline constexpr uint32_t PI_LOGIN_PUBLISHER_BILLING_DB = SC_LOGIN | PC_PUBLISHER_BILLING_DB;
inline constexpr uint32_t PI_LOGIN_GIANT_AUTH = SC_LOGIN | PC_GIANT_AUTH;
inline constexpr uint32_t PI_LOGIN_GIANT_ROLEREG = SC_LOGIN | PC_GIANT_ROLEREG;
inline constexpr uint32_t PI_LOGIN_GIANT_INFO = SC_LOGIN | PC_GIANT_INFO;
inline constexpr uint32_t PI_LOGIN_GIANT_BILLING = SC_LOGIN | PC_GIANT_BILLING;
inline constexpr uint32_t PI_LOGIN_GIANT_COUPON = SC_LOGIN | PC_GIANT_COUPON;
inline constexpr uint32_t PI_LOGIN_AS_OTP_THREAD = SC_LOGIN | PC_AS_OTP_THREAD;
inline constexpr uint32_t PI_LOGIN_GARENA_BILLING = SC_LOGIN | PC_PUBLISHER_BILLING;
// Channel Server
inline constexpr uint32_t PI_CHANNEL_USER = SC_CHANNEL | PC_USER;
inline constexpr uint32_t PI_CHANNEL_SERVER = SC_CHANNEL | PC_SERVER;
inline constexpr uint32_t PI_CHANNEL_LOG_DB = SC_CHANNEL | PC_LOG_DB;
inline constexpr uint32_t PI_CHANNEL_ACCOUNT_DB = SC_CHANNEL | PC_ACCOUNT_DB;
inline constexpr uint32_t PI_CHANNEL_LOGIN_PROXY = SC_CHANNEL | PC_PROXY;
inline constexpr uint32_t PI_CHANNEL_SMS_DB = SC_CHANNEL | PC_SMS_DB;
inline constexpr uint32_t PI_CHANNEL_GAME_DB = SC_CHANNEL | PC_GAME_DB;
inline constexpr uint32_t PI_CHANNEL_EVENT_DB = SC_CHANNEL | PC_EVENT_DB;
inline constexpr uint32_t PI_CHANNEL_AUTH_DB = SC_CHANNEL | PC_PUBLISHER_AUTH_DB;
// Global Server
inline constexpr uint32_t PI_GLOBAL_USER = SC_GLOBAL | PC_USER;
inline constexpr uint32_t PI_GLOBAL_SERVER = SC_GLOBAL | PC_SERVER;
inline constexpr uint32_t PI_GLOBAL_MATCH_MAKING = SC_GLOBAL | PC_MATCH_MAKING;
inline constexpr uint32_t PI_GLOBAL_AUTO_PARTY = SC_GLOBAL | PC_AUTO_PARTY;
inline constexpr uint32_t PI_GLOBAL_GAME_DB = SC_GLOBAL | PC_GAME_DB;
inline constexpr uint32_t PI_GLOBAL_LOG_DB = SC_GLOBAL | PC_LOG_DB;
inline constexpr uint32_t PI_GLOBAL_SMS_DB = SC_GLOBAL | PC_SMS_DB;
inline constexpr uint32_t PI_GLOBAL_ACCOUNT_DB = SC_GLOBAL | PC_ACCOUNT_DB;
inline constexpr uint32_t PI_GLOBAL_NX_GMTOOL_TCP = SC_GLOBAL | PC_NX_GMTOOL_TCP;
inline constexpr uint32_t PI_GLOBAL_EVENT_DB = SC_GLOBAL | PC_EVENT_DB;
// Common DB
inline constexpr uint32_t PI_ACCOUNT_DB = PC_ACCOUNT_DB;
inline constexpr uint32_t PI_LOG_DB = PC_LOG_DB;
inline constexpr uint32_t PI_EVENT_DB = PC_EVENT_DB;
inline constexpr uint32_t PI_SCRIPT_DB = PC_SCRIPT_DB;
inline constexpr uint32_t PI_NULL = 0xFFFFFFFFu;
} // namespace PerformerID

} // namespace x2
