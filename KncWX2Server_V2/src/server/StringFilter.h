// StringFilter.h — 暱稱字串過濾（原 CXSLStringFilter::FT_NICKNAME + KStringFilterManager）。
// （V2 `x2::string_filter` 命名空間；僅實作 FT_NICKNAME；FT_CHAT/FT_POST 留待聊天/信件系統移植）
//
// 資料來源：本倉庫既有官方資料 `ScriptData/StringFilter.xls`（NickName 266 列 → exact ban list；
//   Word 1389 列（剔除 1 條全空白）→ substring ban list），由 tools/gen_string_filter.py 產生
//   StringFilterData.inc（勿手改）。NICKNAMEWORD 子型別：xls 無對應 sheet → 無此列表。
// 語意對齊原碼（Common/X2Data/XSLStringFilter.cpp + Common/StringFilterManager.cpp）：
//   1) 字元集閘門（依建置期地區；原碼依 runtime AuthFlag → V2 無 KSimLayer，以 X2_REGION_* 對應，
//      且 V2 無 AF_INTERNAL/AF_NEXON_KOREA → 不分支）：
//        JP          ：{A-Za-z0-9} ∪ 平假名 3040-309F／片假名 30A0-30FF／片假名音節擴充 31F0-31FF／
//                      康熙部首 2E80-2EFF／CJK 擴 A 3400-4DBF／CJK 統一 4E00-9FBF／CJK 相容 9xxx F900-FAFF／
//                      astral：20000-2A6DF、2F800-2FA1F
//        TW／HK／CN  ：{A-Za-z0-9} ∪ 4E00-9FA5
//        其他地區     ：寬鬆（不做字元集閘門；原碼最終 else → continue 的語意）
//   2) 精確命中 BanNickNameList（ASCII 上轉後比較）→ 拒
//   3) 子字串命中 BanWordList → 拒（NICKNAMEWORD 無資料 → 略過）
//   4) 禁用標記子字串：「 」「"」「/」「\」「(」「)」「]」「[」「%」「!」「GM」→ 拒（原碼為無條件檢查）
//   呼叫端須自行排除 GM 以上權限（原碼 GetAuthLevel() < SEnum::UAL_GM(2) 才檢查；V2 同）。
// ⚠ 誠實偏差：
//   (a) 原碼以 towupper(locale) 上轉；V2 僅 ASCII 上轉（CJK/Hangul 無大小寫，語意等價）。
//   (b) astral 字元：V2 在 Linux 上 wchar_t=32-bit，20000-2A6DF 可直接比對；MSVC 上 wchar_t=16-bit，
//       astral 會拆成 surrogate 對 → 逐單元檢查不過 → JP 建置下含 astral 暱稱被拒（Windows 限定偏差）。
//   (c) 原碼 CJK 範圍終止於 9FBF（JP 分支）或 9FA5（TWHK/CN 分支），與 Unicode 實際邊界不同，
//       此處忠實照抄原碼範圍。
//   (d) 原碼 ban list 由 StringFilter.lua + DB（ScriptDB 動態更新）共同供給；V2 只有 xls 靜態快照，
//       無 DB 動態更新路徑、無 ScriptDB 往返。
//   (e) SERV_STRING_FILTER_USING_DB 分支（KStringFilterManager，另一套同名列表）與
//       SiCXSLStringFilter 是兩份重複實作，語意相同 → V2 合併為一份。
#pragma once

#include <string>

namespace x2 { namespace string_filter {

enum class NickNameCheck
{
    Ok = 0,
    InvalidCharset,     // 字元集閘門未過
    BannedNickName,     // 精確命中 banned nickname list
    BannedWord,         // 子字串命中 banned word list
    ForbiddenToken      // 含禁用標記（空格／引號／斜線／括號／%／!／GM）
};

// 完整 FT_NICKNAME 檢查（不含 GM 權限繞過——由呼叫端把 authLevel >= 2 的使用者跳過）。
NickNameCheck CheckNickName(const std::wstring& wstr);
bool IsValidNickName(const std::wstring& wstr);   // CheckNickName(...) == Ok 的便捷包裝

} // namespace string_filter
} // namespace x2
