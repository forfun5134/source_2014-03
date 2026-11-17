// Region.h — 建置期地區設定（對應原版 SERV_COUNTRY_* / SERV_INT_INTERNAL 的語意）
//
// 地區代碼與原版一致：EU US TW HK JP CN TH ID BR PH（虛擬地區 TWHK = TW ∪ HK）。
//
// 用法：以編譯定義 -DX2_REGION_<CODE> 選擇地區（例如 -DX2_REGION_TW）；未指定時
//       預設 X2_REGION_JP（與原版內部版本 SERV_INT_INTERNAL 鎖定 SERV_COUNTRY_JP 的行為一致）。
//       同時定義兩個以上 → 編譯錯誤（故意 fail fast，避免手滑把 TW 和 JP 一起開）。
//
// 內部版本相容開關 X2_INTERNAL_BUILD（預設 1）：
//   1 = 對齊原版內部版本語意 → 不定義 SERV_PRIVATE_IP_SERVER_NETWORKING；
//   0 = 對齊原版一般建置語意 → 定義 SERV_PRIVATE_IP_SERVER_NETWORKING
//       （原版於 ServerDefine.h:2504 定義、SERV_INT_INTERNAL 區塊 #undef）。
//   本旗標與地區正交：所有地區在內部/一般建置下都可選。
//
// 注意：V2 目前尚未移植任何地區相關的遊戲邏輯（登入驗證、背包/物品規格、登入伺服器等），
//       此標頭先提供「建置期可切換 + SERV_COUNTRY_* 相容巨集 + x2::CurrentRegion()」。
//       舊代碼逐步移植時，含 #ifdef SERV_COUNTRY_JP 的檔案不必改寫即可參與 V2 編譯。
#pragma once

#include <cstdint>

// ---- 擇一檢查（fail fast）----
#if (defined(X2_REGION_EU) + defined(X2_REGION_US) + defined(X2_REGION_TW) + defined(X2_REGION_HK) + \
     defined(X2_REGION_JP) + defined(X2_REGION_CN) + defined(X2_REGION_TH) + defined(X2_REGION_ID) + \
     defined(X2_REGION_BR) + defined(X2_REGION_PH)) > 1
#error "X2_REGION_*: 一次只能定義一個地區（例如 -DX2_REGION_JP 或 -DX2_REGION_TW）"
#endif

#if !defined(X2_REGION_EU) && !defined(X2_REGION_US) && !defined(X2_REGION_TW) && !defined(X2_REGION_HK) && \
    !defined(X2_REGION_JP) && !defined(X2_REGION_CN) && !defined(X2_REGION_TH) && !defined(X2_REGION_ID) && \
    !defined(X2_REGION_BR) && !defined(X2_REGION_PH)
// 預設：與原版內部版本一致 → JP
#define X2_REGION_JP 1
#endif

#if !defined(X2_INTERNAL_BUILD)
#define X2_INTERNAL_BUILD 1
#endif

// ---- 原版相容巨集（供逐步移植的舊代碼使用；V2 新代碼請用 x2::CurrentRegion()）----
#ifdef X2_REGION_EU
#define SERV_COUNTRY_EU 1
#elif defined(X2_REGION_US)
#define SERV_COUNTRY_US 1
#elif defined(X2_REGION_TW)
#define SERV_COUNTRY_TW 1
#elif defined(X2_REGION_HK)
#define SERV_COUNTRY_HK 1
#elif defined(X2_REGION_JP)
#define SERV_COUNTRY_JP 1
#elif defined(X2_REGION_CN)
#define SERV_COUNTRY_CN 1
#elif defined(X2_REGION_TH)
#define SERV_COUNTRY_TH 1
#elif defined(X2_REGION_ID)
#define SERV_COUNTRY_ID 1
#elif defined(X2_REGION_BR)
#define SERV_COUNTRY_BR 1
#elif defined(X2_REGION_PH)
#define SERV_COUNTRY_PH 1
#endif

#if defined(SERV_COUNTRY_TW) || defined(SERV_COUNTRY_HK)
#ifndef SERV_COUNTRY_TWHK
#define SERV_COUNTRY_TWHK 1
#endif
#endif

// 內部版本不包含 private IP networking（對齊原版 SERV_INT_INTERNAL 的 #undef）
#if !X2_INTERNAL_BUILD
#define SERV_PRIVATE_IP_SERVER_NETWORKING 1
#endif

namespace x2 {

enum class Region : uint8_t { EU, US, TW, HK, JP, CN, TH, ID, BR, PH };

constexpr Region CurrentRegion()
{
#if defined(X2_REGION_EU)
    return Region::EU;
#elif defined(X2_REGION_US)
    return Region::US;
#elif defined(X2_REGION_TW)
    return Region::TW;
#elif defined(X2_REGION_HK)
    return Region::HK;
#elif defined(X2_REGION_JP)
    return Region::JP;
#elif defined(X2_REGION_CN)
    return Region::CN;
#elif defined(X2_REGION_TH)
    return Region::TH;
#elif defined(X2_REGION_ID)
    return Region::ID;
#elif defined(X2_REGION_BR)
    return Region::BR;
#else
    return Region::PH;
#endif
}

// 地區代碼（"JP" 等，對應原版檔案/目錄命名慣例，例如 ChannelUserAuth_JP.cpp）
const char* RegionCode(Region r);
// 繁體中文地區名（供日誌/診斷輸出）
const char* RegionNameZhTW(Region r);
// 是否為原版內部版本語意的建置
constexpr bool IsInternalBuild() { return X2_INTERNAL_BUILD != 0; }

} // namespace x2
