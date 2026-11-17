// StringFilter.cpp — 見 StringFilter.h 的對照說明
#include "StringFilter.h"
#include "../core/Region.h"
#include <cwctype>
#include <vector>
#include <mutex>

namespace x2 { namespace string_filter {

#include "StringFilterData.inc"

namespace {

struct CharRange { uint32_t lo, hi; };

#if defined(X2_REGION_JP)
constexpr CharRange kExtraAllowed[] = {
    { 0x3040, 0x309F },   // 平假名
    { 0x30A0, 0x30FF },   // 片假名
    { 0x31F0, 0x31FF },   // 片假名音節擴充
    { 0x2E80, 0x2EFF },   // 康熙部首
    { 0x3400, 0x4DBF },   // CJK 擴 A
    { 0x4E00, 0x9FBF },   // CJK 統一
    { 0xF900, 0xFAFF },   // CJK 相容表意文字
    { 0x20000, 0x2A6DF }, // CJK 擴 B（astral）
    { 0x2F800, 0x2FA1F }  // CJK 相容表意文字補充（astral）
};
constexpr bool kCharsetGate = true;
#elif defined(X2_REGION_TW) || defined(X2_REGION_HK) || defined(X2_REGION_CN)
constexpr CharRange kExtraAllowed[] = { { 0x4E00, 0x9FA5 } };  // 原 TWHK/CN 分支
constexpr bool kCharsetGate = true;
#else
constexpr CharRange kExtraAllowed[] = {};
constexpr bool kCharsetGate = false;   // 原碼最終 else → continue（寬鬆）
#endif

inline bool InAsciiAlnum(uint32_t c) { return (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9'); }

inline bool InCharset(uint32_t c)
{
    if (InAsciiAlnum(c)) return true;
    for (const CharRange& r : kExtraAllowed)
        if (c >= r.lo && c <= r.hi) return true;
    return false;
}

std::wstring AsciiUpper(const std::wstring& in)
{
    std::wstring out;
    out.reserve(in.size());
    for (wchar_t ch : in) {
        if (ch >= L'a' && ch <= L'z') ch = static_cast<wchar_t>(ch - L'a' + L'A');
        out.push_back(ch);
    }
    return out;
}

struct BannedSets {
    std::vector<std::wstring> banNick;   // 已 ASCII 上轉
    std::vector<std::wstring> banWord;   // 已 ASCII 上轉
};

const BannedSets& GetBannedSets()
{
    static BannedSets sets;
    static std::once_flag flag;
    std::call_once(flag, [] {
        sets.banNick.reserve(kBanNickNameListSize);
        for (int i = 0; i < kBanNickNameListSize; ++i) sets.banNick.push_back(AsciiUpper(kBanNickNameList[i]));
        sets.banWord.reserve(kBanWordListSize);
        for (int i = 0; i < kBanWordListSize; ++i) sets.banWord.push_back(AsciiUpper(kBanWordList[i]));
    });
    return sets;
}

const wchar_t* const kForbiddenTokens[] = {
    L" ", L"\"", L"/", L"\\", L"(", L")", L"]", L"[", L"%", L"!", L"GM"
};

} // namespace

NickNameCheck CheckNickName(const std::wstring& wstr)
{
    const std::wstring upper = AsciiUpper(wstr);

    // 1) 字元集閘門
    if (kCharsetGate) {
        for (wchar_t ch : upper) {
            if (!InCharset(static_cast<uint32_t>(ch))) return NickNameCheck::InvalidCharset;
        }
    }

    const BannedSets& sets = GetBannedSets();

    // 2) exact ban nickname
    for (const std::wstring& banned : sets.banNick)
        if (upper == banned) return NickNameCheck::BannedNickName;

    // 3) substring ban word
    for (const std::wstring& banned : sets.banWord)
        if (!banned.empty() && upper.find(banned) != std::wstring::npos) return NickNameCheck::BannedWord;

    // 4) 禁用標記
    for (const wchar_t* token : kForbiddenTokens)
        if (upper.find(token) != std::wstring::npos) return NickNameCheck::ForbiddenToken;

    return NickNameCheck::Ok;
}

bool IsValidNickName(const std::wstring& wstr)
{
    return CheckNickName(wstr) == NickNameCheck::Ok;
}

}} // namespace x2::string_filter
