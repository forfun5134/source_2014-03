// ExpTable.h — 經驗值→等級換算（原 KExpTable，Common/ExpTable.{h,cpp}）。
// （V2 `x2::exp_table` 命名空間）
//
// 資料來源：ScriptData/ExpTable.xls（Sheet1：레벨/필요EXP/총경험치）——本倉庫既有的**遊戲官方資料表**，
//   與原碼 EXP 表（Lua 檔由同一 xls 產生）同源；由 tools/gen_exp_table.py 產生 ExpTableData.inc（勿手改）。
// 語意對齊原碼（Common/ExpTable.cpp）：
//   GetRequireNeedExpbyLevel(nLevel)：查無 level 時，若 table.maxLevel < nLevel 回傳 maxNeedExp，否則 0。
//   GetRequireTotalExpbyLevel(nLevel)：同上，回傳 maxTotalExp。
//   CheckLevelUp(nLevel, nExp)：nLevel<1→1；nExp<0→0；自 nLevel 查起第一個 totalExp > nExp 的 level L，
//     L == nLevel → 回 nLevel；否則回 L-1；nExp >= totalExp(80) → 80。
// ⚠ 原碼 SERV_MAX_LEVEL_CHECK 路徑會以 SiKGameSysVal()->GetLimitsLevel() 截斷；V2 無 GameSysVal → 以 80 為硬上限（誠實偏差）。
// ⚠ 等級/需求值為 int32；totalExp 最大 866,438,000（<2^31）。
#pragma once

#include <cstdint>

namespace x2 { namespace exp_table {

struct ExpTableEntry
{
    int32_t level;
    int32_t needExp;
    int32_t totalExp;
};

int32_t GetRequireNeedExpbyLevel(int32_t nLevel);
int32_t GetRequireTotalExpbyLevel(int32_t nLevel);
int CheckLevelUp(int nLevel, int nExp);

} // namespace exp_table
} // namespace x2
