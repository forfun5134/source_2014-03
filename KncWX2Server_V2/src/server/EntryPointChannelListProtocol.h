// EntryPointChannelListProtocol.h — EGS_ENTRY_POINT_GET_CHANNEL_LIST_REQ / EGS_ENTRY_POINT_GET_CHANNEL_LIST_ACK（entry point 雙伺服器群頻道列表）wire 結構。
// （V2 `x2::channel_list` 命名空間）
//
// 對齊對象：原 X2Project（SERV_ENTRY_POINT 已定義 ServerDefine.h:4304；SERV_INT_INTERNAL＝JP 內部版本）
//   KEGS_ENTRY_POINT_GET_CHANNEL_LIST_REQ（NOPARAM，無酬載）
//   KEGS_ENTRY_POINT_GET_CHANNEL_LIST_ACK {
//       std::map<int, KChannelInfo>      m_mapSolesChannelList;
//       std::map<int, KChannelInfo>      m_mapGaiaChannelList;
//       std::map<int, KChannelBonusInfo> m_mapSolesChannelBonusList;
//       std::map<int, KChannelBonusInfo> m_mapGaiaChannelBonusList;
//   }（PUT 順序機讀自 ClientPacket.cpp:15062）
// 事件 ID（V2 EventIDs.h 實測）：REQ=1166, ACK=1167。
// KChannelInfo（原 Common/CommonPacket.h:6322；SERV_INTEGRATE_THE_CHANNEL_INFO 未定義 → 無 m_kBonusInfo 欄位）：
//   {int iServerUID, int iChannelID, wstring m_wstrChannelName, int iServerGroupID, wstring m_wstrIP,
//    uint16 m_usMasterPort, uint16 m_usNCUDPPort, int iMaxUser, int iCurrentUser, int iCurPartyCount, int iPlayGamePartyCount}
// KChannelBonusInfo（:6304）：{bool m_bEnable, int iBeginLv, int iEndLv, int iPerExp, int iPerED}
// PUT/GET 順序機讀自原 CommonPacket.cpp:5647–5697。
//
// ⚠ 線路佈局為自洽 golden bytes，未對原 SDK 實機驗證；map 走 V2 慣例（count-prefix、無 eTAG_MAP/eTAG_PAIR）。
// ⚠ V2 無頻道註冊表（SiKChannelManager）→ 決策層回四張**空表**（誠實佔位）；原碼於 SGI_SOLES/SGI_GAIA 互換 1st/2nd 對應。
#pragma once

#include <cstdint>
#include <map>
#include <string>

namespace x2 { class Serializer; }

namespace x2 { namespace channel_list {

struct ChannelInfo              // 原 KChannelInfo（SERV_INTEGRATE_THE_CHANNEL_INFO 未定義）
{
    int32_t iServerUID = 0;
    int32_t iChannelID = 0;
    std::wstring wstrChannelName;
    int32_t iServerGroupID = 0;
    std::wstring wstrIP;
    uint16_t usMasterPort = 0;
    uint16_t usNCUDPPort = 0;
    int32_t iMaxUser = 0;
    int32_t iCurrentUser = 0;
    int32_t iCurPartyCount = 0;
    int32_t iPlayGamePartyCount = 0;
};

struct ChannelBonusInfo         // 原 KChannelBonusInfo
{
    bool bEnable = false;
    int32_t iBeginLv = 0;
    int32_t iEndLv = 0;
    int32_t iPerExp = 0;
    int32_t iPerED = 0;
};

struct GetChannelListReq        // EGS_ENTRY_POINT_GET_CHANNEL_LIST_REQ（1166）；NOPARAM
{
    bool operator==(const GetChannelListReq&) const { return true; }
};

struct GetChannelListAck        // EGS_ENTRY_POINT_GET_CHANNEL_LIST_ACK（1167）
{
    std::map<int32_t, ChannelInfo> mapSolesChannelList;       // 原 m_mapSolesChannelList
    std::map<int32_t, ChannelInfo> mapGaiaChannelList;        // 原 m_mapGaiaChannelList
    std::map<int32_t, ChannelBonusInfo> mapSolesChannelBonusList;  // 原 m_mapSolesChannelBonusList
    std::map<int32_t, ChannelBonusInfo> mapGaiaChannelBonusList;   // 原 m_mapGaiaChannelBonusList
};

bool PutChannelInfo(Serializer& ks, const ChannelInfo& v);
bool GetChannelInfo(Serializer& ks, ChannelInfo& v);
bool PutChannelBonusInfo(Serializer& ks, const ChannelBonusInfo& v);
bool GetChannelBonusInfo(Serializer& ks, ChannelBonusInfo& v);

bool PutGetChannelListReq(Serializer& ks, const GetChannelListReq& v);
bool GetGetChannelListReq(Serializer& ks, GetChannelListReq& v);
bool PutGetChannelListAck(Serializer& ks, const GetChannelListAck& v);
bool GetGetChannelListAck(Serializer& ks, GetChannelListAck& v);

} // namespace channel_list
} // namespace x2
