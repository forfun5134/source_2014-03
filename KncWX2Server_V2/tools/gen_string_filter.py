#!/usr/bin/env python3
# gen_string_filter.py — 由本倉庫 ScriptData/StringFilter.xls 產生 src/server/StringFilterData.inc
# （V2 無 Lua 執行期；xls 為本倉庫既有官方資料，與原 StringFilter.lua 同源）。
# 執行：python3 tools/gen_string_filter.py   依賴：xlrd（只在產生器需要）
# 規則：
#   - NickName sheet 266 列 → kBanNickNameList（exact match，FT_NICKNAME 語意；原 load 時 towupper，V2 於 load 時 ASCII 上轉）
#   - Word sheet 1390 列 → kBanWordList（substring，FT_NICKNAME/FT_CHAT 共用語意）
#   - 全空白/空字串列一律剔除（若保留，find("") 恆命中 → 所有暱稱都會被拒；明顯非資料本意）
#   - 大小寫不敏感重複與兩端空白列保留（與原資料一致；僅報告）
#   - NICKNAMEWORD 型別：xls 無對應 sheet（Word 即 ban word）→ 無此列表（誠實缺口）
# 輸出 wstring 標頭；L"..." 以 \uXXXX（BMP）/\UXXXXXXXX（astral）逸出。
import os
import re
import sys
import collections

try:
    import xlrd
except ImportError:
    sys.exit('gen_string_filter.py 需要 xlrd：pip install xlrd')

here = os.path.dirname(os.path.abspath(__file__))
repo_root = os.path.abspath(os.path.join(here, '..', '..'))
xls_path = os.path.join(repo_root, 'ScriptData', 'StringFilter.xls')

wb = xlrd.open_workbook(xls_path)

def load_sheet(name):
    sh = wb.sheet_by_name(name)
    rows, dropped_blank = [], 0
    for r in range(1, sh.nrows):
        v = sh.cell_value(r, 1)
        if not isinstance(v, str) or v == '':
            sys.exit(f'{name} row {r+1}: non-string/empty cell')
        if not v.strip():
            dropped_blank += 1
            continue
        rows.append(v)
    dups = [k for k, v in collections.Counter(x.upper() for x in rows).items() if v > 1]
    return rows, dropped_blank, dups

nicks, nick_dropped, nick_dups = load_sheet('NickName')
words, word_dropped, word_dups = load_sheet('Word')
print(f'NickName: {len(nicks)} entries (dropped blank {nick_dropped}, ci-dups {len(nick_dups)})')
print(f'Word:     {len(words)} entries (dropped blank {word_dropped}, ci-dups {len(word_dups)})')

def esc(s):
    out = []
    for ch in s:
        cp = ord(ch)
        if ch == '\\': out.append('\\\\')
        elif ch == '"': out.append('\\"')
        elif 0x20 <= cp <= 0x7E: out.append(ch)
        elif cp <= 0xFFFF: out.append('\\u%04X' % cp)
        else: out.append('\\U%08X' % cp)
    return ''.join(out)

out = []
out.append('// StringFilterData.inc — 由 tools/gen_string_filter.py 自 ScriptData/StringFilter.xls 產生（勿手改）。')
out.append('// NickName→exact ban list（kBanNickNameList）；Word→substring ban list（kBanWordList）。')
out.append(f'// 剔除全空白列 {nick_dropped + word_dropped} 條；大小寫不敏感重複保留（NickName {len(nick_dups)} 組 / Word {len(word_dups)} 組）。')
out.append('static const wchar_t* const kBanNickNameList[] = {')
for s in nicks: out.append(f'    L"{esc(s)}",')
out.append('};')
out.append(f'static constexpr int kBanNickNameListSize = {len(nicks)};')
out.append('')
out.append('static const wchar_t* const kBanWordList[] = {')
for s in words: out.append(f'    L"{esc(s)}",')
out.append('};')
out.append(f'static constexpr int kBanWordListSize = {len(words)};')

dst = os.path.join(here, '..', 'src', 'server', 'StringFilterData.inc')
with open(dst, 'w', encoding='utf-8') as f:
    f.write('\n'.join(out) + '\n')
print(f'wrote {dst} ({len(nicks)} + {len(words)} entries)')
