// StatTable.cpp — 見 StatTable.h 的對照說明
#include "StatTable.h"
#include <algorithm>

namespace x2 { namespace stat_table {

#include "StatTableData.inc"

bool GetUnitStat(int unitClass, int unitLevel, UnitStatInfo& out)
{
    out = UnitStatInfo{};
    if (unitClass <= 0 || unitLevel < 1 || unitLevel > kStatTableMaxLevel) return false;
    const UnitStatEntry key{ static_cast<int16_t>(unitClass), static_cast<int16_t>(unitLevel), 0, 0, 0, 0, 0 };
    auto cmp = [](const UnitStatEntry& a, const UnitStatEntry& b) {
        return a.unitClass != b.unitClass ? a.unitClass < b.unitClass : a.level < b.level;
    };
    const UnitStatEntry* begin = kStatTable;
    const UnitStatEntry* end = kStatTable + kStatTableSize;
    const UnitStatEntry* it = std::lower_bound(begin, end, key, cmp);
    if (it == end || it->unitClass != key.unitClass || it->level != key.level) return false;
    out.atkPhysic = it->atkPhysic;
    out.atkMagic = it->atkMagic;
    out.defPhysic = it->defPhysic;
    out.defMagic = it->defMagic;
    out.hp = it->hp;
    return true;
}

}} // namespace x2::stat_table
