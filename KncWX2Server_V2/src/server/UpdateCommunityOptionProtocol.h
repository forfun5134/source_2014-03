// UpdateCommunityOptionProtocol.h — EGS_UPDATE_COMMUNITY_OPTION_REQ/ACK（社群/拒絕選項更新）wire 結構＋決策。
// （V2 `x2::community_option` 命名空間）
//
// 對齊對象：原 X2Project（SERV_INT_INTERNAL＝JP；SERV_RELATIONSHIP_SYSTEM:3643 已定義）
//   KEGS_UPDATE_COMMUNITY_OPTION_REQ { KDenyOptions m_kDenyOptions }              （ClientPacket.h:3508）
//   KEGS_UPDATE_COMMUNITY_OPTION_ACK { int m_iOK; KDenyOptions m_kDenyOptions }   （ClientPacket.h:3513）
//   KDenyOptions { char cDenyFriendShip, cDenyInviteGuild, cDenyParty, cDenyPersonalTrade,
//                  cDenyRequestCouple（SERV_RELATIONSHIP_SYSTEM）, cDenyInvitePracticePVP }
//   DenyOptionState: DOS_ON=0, DOS_OFF=1, DOS_ONLY_FRIEND=2                        （CommonPacket.h:2817–2837）
//   事件 ID（V2 EventIDs.h）：REQ=365, ACK=366。
//   PUT/GET 順序機讀自原 ClientPacket.cpp:4910–4934（REQ：m_kDenyOptions；ACK：m_iOK → m_kDenyOptions）。
//
// HandleUpdateCommunityOptionReq 對應原 GSUserGameCommon::IMPL_ON_FUNC(EGS_UPDATE_COMMUNITY_OPTION_REQ)
// （GSUserGameCommon.cpp:2981–3009）＋ KUserGameOption::SetDenyOptions 的**驗證段**（UserGameOption.cpp:35–96）：
//   cDenyFriendShip ∈ [0, DOS_OFF(1)]；InviteGuild/Party/PersonalTrade/RequestCouple/InvitePracticePVP ∈ [0, DOS_ONLY_FRIEND(2)]；
//   驗證失敗 → ERR_COMMUNITY_OPT_01（原碼 goto end_proc；ACK 一律送出）。
//
// ⚠ 偏差聲明（V2 vs 原版）：
//   1. 原版「成功」只改寫記憶體中的 KUserGameOption（in-memory），DB 寫入**延遲到副本結束**
//      （DBE_UPDATE_UNIT_INFO_REQ → Query_UpdateCommunityOption → SERV_RELATIONSHIP_SYSTEM 下 P_GDenyOption_UPD
//        ——該 proc **不隨倉庫提供**；legacy 路徑 gup_update_community_opt 僅寫 QN1..4）。
//      V2 無 session option 狀態物件、亦無副本結束路徑 → **write-through**：驗證通過後立即同一 transaction
//      upsert gdenyoption（QN1..6）；缺列 → INSERT，有列 → UPDATE CodeNo（semantically 鏡像 gup_update_community_opt
//      的 "無列 → INSERT 4 列／有列 → CASE UPDATE" 雙分支，擴充至 QN1..6；QN5/6 無對應原 proc，以同一模式處理）。
//   2. 原版送 ELG_UPDATE_DENY_FRIEND_SHIP_NOT 通知 LoginServer（更新好友拒絕狀態）；V2 無 LoginServer → 不移植。
//   3. VERIFY_STATE（S_FIELD_MAP/S_ROOM）V2 無 FSM → 不適用。
//   4. 單位不存在/已刪除：原版無此檢查（in-memory 成功即回 NET_OK）；V2 write-through 需要 unit 存在 →
//      不存在/已刪除 → ERR_COMMUNITY_OPT_02＋err（借用原「CommunityOpt DB 失敗」碼）。
//   5. 失敗路徑 ACK 的 m_kDenyOptions：原版未初始化（wire 可能洩漏堆疊內容）；V2 一律歸零。
//   6. 線路佈局為自洽 golden bytes，未對原 SDK 實機驗證。
#pragma once

#include <cstdint>
#include <string>

#include "../db/GameStore.h"
#include "UnitData.h"

namespace x2 { class Serializer; }

namespace x2 { namespace community_option {

using x2::unit::DenyOptions;   // KDenyOptions（6×char；SERV_RELATIONSHIP_SYSTEM 定義）

struct UpdateCommunityOptionReq          // EGS_UPDATE_COMMUNITY_OPTION_REQ（365）
{
    x2::unit::DenyOptions kDenyOptions;            // 原 m_kDenyOptions（6×char）
};

struct UpdateCommunityOptionAck          // EGS_UPDATE_COMMUNITY_OPTION_ACK（366）
{
    int32_t iOK = 0;                     // NetError（NET_OK=0；ERR_COMMUNITY_OPT_01=240；ERR_COMMUNITY_OPT_02=241）
    x2::unit::DenyOptions kDenyOptions;            // 原 m_kDenyOptions（成功時回顯；失敗時歸零）
};

bool PutUpdateCommunityOptionReq(Serializer& ks, const UpdateCommunityOptionReq& v);
bool GetUpdateCommunityOptionReq(Serializer& ks, UpdateCommunityOptionReq& v);
bool PutUpdateCommunityOptionAck(Serializer& ks, const UpdateCommunityOptionAck& v);
bool GetUpdateCommunityOptionAck(Serializer& ks, UpdateCommunityOptionAck& v);

// KUserGameOption::SetDenyOptions 的驗證段（原 UserGameOption.cpp:35–96）。
// 保留原碼的不對稱上限：FriendShip 僅允許 [0, DOS_OFF=1]；其餘五欄允許 [0, DOS_ONLY_FRIEND=2]。
// true = 全部合法；false = 有非法值。
bool ValidateDenyOptions(const x2::unit::DenyOptions& v);

// 決策層（原 EGS_UPDATE_COMMUNITY_OPTION_REQ handler；unitUID 對應原 GetCharUID()，由呼叫端傳入）：
//   1) ValidateDenyOptions 失敗 → ack.iOK = ERR_COMMUNITY_OPT_01，ack.kDenyOptions 歸零，不動 DB
//   2) UpdateDenyOptions（write-through，見檔頭偏差聲明 1/4）失敗 → ack.iOK = ERR_COMMUNITY_OPT_02（err 記詳細原因）
//   3) 成功 → ack.iOK = NET_OK，ack.kDenyOptions = 驗證後的輸入值
// 任何路徑都產出 ACK（鏡像原 end_proc）；err 僅供伺服器側日誌。
int32_t HandleUpdateCommunityOptionReq(db::GameStore& gameDb, int64_t unitUID,
                                       const UpdateCommunityOptionReq& req,
                                       UpdateCommunityOptionAck& ack,
                                       std::string& err);

} // namespace community_option
} // namespace x2
