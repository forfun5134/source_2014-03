// StatTable.h — 角色等級→基礎屬性表（原 KStatTable，GameServer/StatTable.{h,cpp}）。
// （V2 `x2::stat_table` 命名空間）
//
// 資料來源：本倉庫既有的遊戲官方資料 `ServerResource/JP/StatTable.lua`（與 KR 原碼 Lua 同源；JP/TW/root 三份 md5 一致），
//   由 tools/gen_stat_table.py 產生 StatTableData.inc（勿手改）。
// 語意對齊原碼：
//   - 表只含 level 1..80（ReserveMemory(class, 80) → vector 容量 81、0 dummy）；
//     Lua 中 class 110/111 level 81..99 共 38 列，原碼會被 SetUnitStat 的 JIF 容量檢查丟棄，產生器比照丟棄。
//   - Lua 數值轉 UINT 為截斷（x.5 HP、唯一 DefMagic 77.6→77）。
//   - GetUnitStat：查無 (class, level) → false（原碼回傳 false 時呼叫端 sUnitStat 保持 0 → SELECT_UNIT 的 += 相當於加 0）。
// ⚠ 誠實偏差：原碼以 CXSLUnit::UT_END 範圍閘控 class（以及 2 轉 /100 規則）；V2 以「表內存在」為準（等價但更簡單）。
// ⚠ 原碼 SELECT_UNIT 路徑會把 stat 加到 DB 值上（m_iBaseHP += sUnitStat.m_uiHP …）；V2 PopulateUnitInfoFromGUnit 同法處理。
#pragma once

#include <cstdint>

namespace x2 { namespace stat_table {

struct UnitStatInfo
{
    uint16_t atkPhysic = 0;
    uint16_t atkMagic = 0;
    uint16_t defPhysic = 0;
    uint16_t defMagic = 0;
    uint32_t hp = 0;
};

struct UnitStatEntry
{
    int16_t unitClass;
    int16_t level;
    uint16_t atkPhysic;
    uint16_t atkMagic;
    uint16_t defPhysic;
    uint16_t defMagic;
    uint32_t hp;
};

bool GetUnitStat(int unitClass, int unitLevel, UnitStatInfo& out);

} // namespace stat_table
} // namespace x2
