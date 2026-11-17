// UnitTemplet.cpp — 見 UnitTemplet.h 的對照說明與模型偏差
#include "UnitTemplet.h"
#include "UnitClassData.inc"

namespace x2 { namespace unit_templet {

bool UnitTempletExists(int unitClass)
{
    for (int i = 0; i < kKnownUnitClassesSize; ++i) {
        if (kKnownUnitClasses[i] == unitClass) return true;
    }
    return false;
}

bool IsInitNormalJob(int unitClass)
{
    // 對齊原碼 switch（定義全開）：1..9 為初始普通職業
    return unitClass >= 1 && unitClass <= 9;
}

}} // namespace x2::unit_templet
