// ExpTable.cpp — 見 ExpTable.h 的對照說明
#include "ExpTable.h"

namespace x2 { namespace exp_table {

#include "ExpTableData.inc"

int32_t GetRequireNeedExpbyLevel(int32_t nLevel)
{
    if (nLevel < 1) return 0;                       // 原碼 map 查無且 table.maxLevel(80) >= nLevel → 0
    if (nLevel <= kExpTableMaxLevel) return kExpTable[nLevel - 1].needExp;
    return kExpTableMaxNeedExp;                     // 超過表頂 → 最大需求值（原碼 rbegin 邏輯）
}

int32_t GetRequireTotalExpbyLevel(int32_t nLevel)
{
    if (nLevel < 1) return 0;
    if (nLevel <= kExpTableMaxLevel) return kExpTable[nLevel - 1].totalExp;
    return kExpTableMaxTotalExp;                    // 超過表頂 → 最大累計值（原碼 rbegin 邏輯）
}

int CheckLevelUp(int nLevel, int nExp)
{
    if (nLevel < 1) nLevel = 1;
    if (nExp < 0) nExp = 0;
    for (int level = nLevel; level <= kExpTableMaxLevel; ++level) {
        if (nExp < kExpTable[level - 1].totalExp) {
            return (level == nLevel) ? nLevel : level - 1;
        }
    }
    return kExpTableMaxLevel;                       // nExp >= totalExp(80)（原碼 mrit 邏輯 + V2 硬上限 80）
}

}} // namespace x2::exp_table
