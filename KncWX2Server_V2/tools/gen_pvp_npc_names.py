#!/usr/bin/env python3
# gen_pvp_npc_names.py — 由本倉庫 KncWX2Server/ServerResource/<REGION>/PvpNpcData.lua
#   產生 src/server/PvpNpcNames<REGION>.inc（勿手改）。
# 執行：python3 tools/gen_pvp_npc_names.py   （純 stdlib，不依賴 xlrd）
# 規則：
#   - 僅匹配行首（允許前導空白）的 `PvpMatchManager:AddPvpNpcName( '名稱' )` 呼叫；
#     行首 `--` 註解行（例如 JP 的 `-- PvpMatchManager:AddPvpNpcName( '0oLucifero0' )`）依 Lua 語意忽略。
#   - exact match 語意：原碼 IsExistPvpNpcName 為 wstring == 比較（無大小寫摺疊），保留原樣。
#   - 組內完全重複的名稱保留（原碼 push_back 全部），僅報告。
#   - 空字串／全空白名稱剔除（防禦；目前資料無此列）。
#   - 地區→檔案：JP/TW/EU/CN/US 各自；HK 無獨立檔（建置期共用 TW，見 PvpNpcNames.cpp）；
#     TH/ID/BR/PH 無資料 → 空表（誠實缺口）；EU 的 nation-flag 子表（PvpNpcData_DE/FR/...）未建模。
# 輸出 wstring 標頭；L"..." 以 \uXXXX（BMP）/\UXXXXXXXX（astral）逸出（與 gen_string_filter.py 同規格）。
import os
import re
import sys
import collections

here = os.path.dirname(os.path.abspath(__file__))
repo_root = os.path.abspath(os.path.join(here, '..', '..'))

REGIONS = ['JP', 'TW', 'EU', 'CN', 'US']
LINE_RE = re.compile(r"^\s*PvpMatchManager:AddPvpNpcName\(\s*'([^']*)'\s*\)\s*$")

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

total = 0
for region in REGIONS:
    lua_path = os.path.join(repo_root, 'KncWX2Server', 'ServerResource', region, 'PvpNpcData.lua')
    names, dropped_blank, commented = [], 0, 0
    with open(lua_path, encoding='utf-8') as f:
        for raw in f:
            line = raw.rstrip('\n')
            if 'AddPvpNpcName' in line and not LINE_RE.match(line):
                commented += 1
                continue
            m = LINE_RE.match(line)
            if not m:
                continue
            n = m.group(1)
            if not n.strip():
                dropped_blank += 1
                continue
            names.append(n)
    dups = sum(v - 1 for v in collections.Counter(names).values() if v > 1)
    out = []
    out.append(f'// PvpNpcNames{region}.inc — 由 tools/gen_pvp_npc_names.py 自 ServerResource/{region}/PvpNpcData.lua 產生（勿手改）。')
    out.append(f'// PvP NPC 保留暱稱（exact match）；共 {len(names)} 條（註解忽略 {commented}、剔除空 {dropped_blank}、完全重複保留 {dups} 條）。')
    out.append('static const wchar_t* const kPvpNpcNames[] = {')
    for s in names:
        out.append(f'    L"{esc(s)}",')
    out.append('};')
    out.append(f'static constexpr int kPvpNpcNamesSize = {len(names)};')
    dst = os.path.join(here, '..', 'src', 'server', f'PvpNpcNames{region}.inc')
    with open(dst, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out) + '\n')
    total += len(names)
    print(f'{region}: {len(names)} names (commented {commented}, blank-dropped {dropped_blank}, exact-dups kept {dups}) -> {dst}')
print(f'total: {total}')
