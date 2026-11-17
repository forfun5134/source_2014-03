// PvpNpcNames.cpp — 見 PvpNpcNames.h 的來源與偏差說明。
#include "PvpNpcNames.h"
#include "../core/Region.h"   // 未定義 X2_REGION_* 時由此設定預設 JP 巨集（與 StringFilter.cpp 同作法；缺此會誤走 #else 空表）

namespace x2 { namespace pvp_npc_names {

namespace {

#if defined(X2_REGION_JP)
#include "PvpNpcNamesJP.inc"
#elif defined(X2_REGION_TW) || defined(X2_REGION_HK)
#include "PvpNpcNamesTW.inc"   // TWHK 共用 TW 表
#elif defined(X2_REGION_EU)
#include "PvpNpcNamesEU.inc"
#elif defined(X2_REGION_CN)
#include "PvpNpcNamesCN.inc"
#elif defined(X2_REGION_US)
#include "PvpNpcNamesUS.inc"
#else
// TH/ID/BR/PH：無資料 → 空表（誠實缺口，見標頭 (c)）
static const wchar_t* const kPvpNpcNames[] = { nullptr };
static constexpr int kPvpNpcNamesSize = 0;
#endif

} // namespace

bool IsExistPvpNpcName(const std::wstring& wstrNickName)
{
    for (int i = 0; i < kPvpNpcNamesSize; ++i) {
        if (wstrNickName == kPvpNpcNames[i]) return true;
    }
    return false;
}

} // namespace pvp_npc_names
} // namespace x2
