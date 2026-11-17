// UnitTemplet.cpp — 見 UnitTemplet.h 的對照說明
#include "UnitTemplet.h"

namespace x2 { namespace unit_templet {

bool IsInitNormalJob(int unitClass)
{
    // 對齊原碼 switch（定義全開）：1..9 為初始普通職業
    return unitClass >= 1 && unitClass <= 9;
}

}} // namespace x2::unit_templet
