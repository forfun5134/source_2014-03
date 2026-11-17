// PvpNpcNames.h — PvP NPC 保留暱稱閘門（原 KPvpMatchManager::IsExistPvpNpcName）。
// （V2 `x2::pvp_npc_names` 命名空間）
//
// 資料來源：本倉庫 KncWX2Server/ServerResource/<REGION>/PvpNpcData.lua 的
//   `PvpMatchManager:AddPvpNpcName( '名稱' )` 列表，由 tools/gen_pvp_npc_names.py 產生
//   PvpNpcNames<REGION>.inc（勿手改；與 StringFilter/StatTable 同策略的建置期靜態快照）。
// 語意：exact match（原碼 `wstrCharName == wstrNickName`，無大小寫摺疊）。
// 呼叫時機（對齊原碼 GSUserGameCommon.cpp，均無 GM 繞過）：
//   - EGS_CREATE_UNIT_REQ / EGS_CREATE_NEW_UNIT_REQ：length → StringFilter → **本閘門** → 注入檢查；
//   - EGS_CHANGE_NICK_NAME_REQ / EGS_ENTRY_POINT_CHANGE_NICK_NAME_REQ：
//     length → StringFilter → 注入檢查 → **本閘門**；
//   命中 → ERR_CREATE_UNIT_01（=26）。
// ⚠ 誠實偏差：
//   (a) EU 的 nation-flag 子表（PvpNpcData_DE/FR/IT/PL/ES/TR/EN.lua，SERV_UNITED_SERVER_EU 路徑）
//       未建模——V2 無 nation flag 概念，EU 一律以 EU/PvpNpcData.lua（= 原根目錄預設檔內容）為準；
//       US 以 US/PvpNpcData.lua 為準（原碼 US 走 nation-flag NF_EN → PvpNpcData_EN.lua，內容與 US 檔一致）。
//   (b) HK：ServerResource 無獨立 HK 檔，建置期共用 TW 表（TWHK 單一代碼）。
//   (c) TH/ID/BR/PH：原碼非 EU/JP 路徑載入根目錄 PvpNpcData.lua，V2 未隨附該佈局 → 空表（永不命中）。
//   (d) 原碼於 GSSimLayer/CnSimLayer 啟動時以 Lua 動態載入（含 DB 外延伸的可能）；V2 僅靜態快照。
//   (e) PvpNpcData.lua 註解行（JP 有 1 行 `-- PvpMatchManager:AddPvpNpcName(...)`）依 Lua 語意排除。
#pragma once

#include <string>

namespace x2 { namespace pvp_npc_names {

bool IsExistPvpNpcName(const std::wstring& wstrNickName);

} // namespace pvp_npc_names
} // namespace x2
