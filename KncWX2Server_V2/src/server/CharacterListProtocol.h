// CharacterListProtocol.h — EGS_CHARACTER_LIST_REQ / EGS_CHARACTER_LIST_ACK（entry point 全角色列表）wire 結構。
// （V2 `x2::character_list` 命名空間）
//
// 對齊對象：原 X2Project（SERV_ENTRY_POINT 已定義 ServerDefine.h:4304；SERV_INT_INTERNAL＝JP 內部版本）
//   KEGS_CHARACTER_LIST_REQ（NOPARAM，無酬載）
//   KEGS_CHARACTER_LIST_ACK { int m_iOK; std::map<int,int> m_mapServerGroupUnitSlot; // first=server group, second=角色槽數
//                            std::map<int, std::vector<KUnitInfo>> m_mapServerGroupUnitInfo; // first=server group
//                            std::wstring m_strUserID; }
//   typedef KEGS_CHARACTER_LIST_ACK KEGS_CHARACTER_LIST_1ST_ACK；DOUBLE_SERVER_GROUP 才走 DBE_CHARACTER_LIST_2ND_REQ。
// 事件 ID（V2 EventIDs.h 實測）：REQ=1155, 1ST_ACK=1156, 2ND_REQ=1157, ACK=1158。
// PUT/GET 順序機讀自原 ClientPacket.cpp:14964–14980。
//
// 流程折疊：原碼 REQ→GameDB→1ST_ACK（SINGLE：本地組裝 / DOUBLE：送 2nd DB 會合）→EGS_CHARACTER_LIST_ACK 直接回 Client；
//   V2 無 server group / 2nd GameDB → SINGLE_SERVER_GROUP 語意折疊為單段；1ST_ACK 與最終 ACK 共用結構，折疊為一段回覆。
//
// ⚠ 線路佈局為自洽 golden bytes，未對原 SDK 實機驗證（原版外部 Serializer SDK 的 std::map wire 編碼無法從本倉庫驗證；
//   V2 復用內建 eTAG_MAP 模板，count-prefixed）。
// ⚠ map key=serverGroupID 一律 0（V2 無 server group 設定，誠實佔位）。
#pragma once

#include <cstdint>
#include <map>
#include <vector>
#include <string>

#include "UnitData.h"

namespace x2 { class Serializer; }

namespace x2 { namespace character_list {

struct CharacterListReq
{
    // 無酬載（原 IMPL_ON_FUNC_NOPARAM）
    bool operator==(const CharacterListReq&) const { return true; }
};

struct CharacterListAck
{
    int32_t iOK = 0;                                       // 原 m_iOK（NET_OK=0）
    std::map<int32_t, int32_t> mapServerGroupUnitSlot;     // 原 m_mapServerGroupUnitSlot
    std::map<int32_t, std::vector<unit::UnitInfo>> mapServerGroupUnitInfo;   // 原 m_mapServerGroupUnitInfo
    std::wstring strUserID;                                // 原 m_strUserID
};

bool PutCharacterListReq(Serializer& ks, const CharacterListReq& v);
bool GetCharacterListReq(Serializer& ks, CharacterListReq& v);
bool PutCharacterListAck(Serializer& ks, const CharacterListAck& v);
bool GetCharacterListAck(Serializer& ks, CharacterListAck& v);

} // namespace character_list
} // namespace x2
