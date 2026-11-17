#!/usr/bin/env python3
# gen_stat_table.py — 由本倉庫 ServerResource/JP/StatTable.lua 產生 src/server/StatTableData.inc
# （StatTable.lua 與 KR 原碼之 Lua 同源，為本倉庫既有遊戲官方資料；JP/TW/root 三份 md5 一致）。
# 執行：python3 tools/gen_stat_table.py
# 依賴：僅標準函式庫。
# 規則（對齊原碼 KStatTable）：
#   - ReserveMemory(class, maxLevel) 決定容量；本表全數 maxLevel=80（含 dummy level 0）。
#   - level 1..maxLevel 之外的 SetUnitStat 會被原碼 SetUnitStat 的 JIF 丟棄（寫不進 81+ 容量），
#     產生器比照：丟棄並報告（JP 資料中即 class 110/111 的 level 81..99，共 38 列）。
#   - Lua 數值轉 UINT 為截斷（lua_tinker）；HP 之 x.5 與唯一 DefMagic 77.6 皆截斷。
# 產生後：完整性檢查（每保留 class 恰好 1..80 各一列、無重複、數值非負）。
import os
import re
import sys
import collections

here = os.path.dirname(os.path.abspath(__file__))
repo_root = os.path.abspath(os.path.join(here, '..', '..'))
lua_path = os.path.join(repo_root, 'KncWX2Server', 'ServerResource', 'JP', 'StatTable.lua')

txt = open(lua_path, encoding='utf-8', errors='ignore').read()

reserved = {}
for m in re.finditer(r'ReserveMemory\(\s*(\d+)\s*,\s*(\d+)\s*\)', txt):
    cls, max_level = int(m.group(1)), int(m.group(2))
    if cls in reserved:
        sys.exit(f'duplicate ReserveMemory for class {cls}')
    reserved[cls] = max_level

row_re = re.compile(r'SetUnitStat\(\s*(\d+)\s*,\s*(\d+)\s*,\s*\{\s*'
                    r'AtkPhysic\s*=\s*([\d.]+)\s*,\s*AtkMagic\s*=\s*([\d.]+)\s*,\s*'
                    r'DefPhysic\s*=\s*([\d.]+)\s*,\s*DefMagic\s*=\s*([\d.]+)\s*,\s*'
                    r'HP\s*=\s*([\d.]+)\s*\}\s*\)')
rows = []
dropped = []
seen = set()
for m in row_re.finditer(txt):
    cls, level = int(m.group(1)), int(m.group(2))
    vals = [float(m.group(i)) for i in range(3, 8)]
    if cls not in reserved:
        sys.exit(f'SetUnitStat for unreserved class {cls}')
    if level > reserved[cls]:
        dropped.append((cls, level))   # 原碼寫不進去（vector 容量 = maxLevel+1，dummy 0）
        continue
    if level < 1:
        sys.exit(f'level < 1 at class {cls}')
    key = (cls, level)
    if key in seen:
        sys.exit(f'duplicate SetUnitStat class {cls} level {level}')
    seen.add(key)
    vals = [int(v) for v in vals]      # Lua→UINT：截斷（正數）
    if any(v < 0 for v in vals):
        sys.exit(f'negative stat at class {cls} level {level}')
    rows.append((cls, level, *vals))

# 完整性：每個 reserved class：1..maxLevel 各恰好一列
for cls, max_level in sorted(reserved.items()):
    lv = sorted(l for c, l, *_ in rows if c == cls)
    if lv != list(range(1, max_level + 1)):
        missing = sorted(set(range(1, max_level + 1)) - set(lv))
        sys.exit(f'class {cls}: incomplete levels, missing {missing[:10]}')

rows.sort(key=lambda r: (r[0], r[1]))

out = []
out.append('// StatTableData.inc — 由 tools/gen_stat_table.py 自 ServerResource/JP/StatTable.lua 產生（勿手改）。')
out.append('// StatTable.lua 與 KR 原碼 Lua 同源，為本倉庫既有遊戲官方資料；JP/TW/root 三份 md5 一致。')
out.append(f'// 丟棄列（原碼容量外）：{len(dropped)} 列（class 110/111 level 81..99）。')
out.append('static const UnitStatEntry kStatTable[{}] = {{'.format(len(rows)))
for cls, level, atk_p, atk_m, def_p, def_m, hp in rows:
    out.append(f'    {{ {cls}, {level}, {atk_p}, {atk_m}, {def_p}, {def_m}, {hp} }},')
out.append('};')
out.append(f'static constexpr int kStatTableSize = {len(rows)};')
out.append('static constexpr int kStatTableMaxLevel = 80;')

dst = os.path.join(here, '..', 'src', 'server', 'StatTableData.inc')
with open(dst, 'w', encoding='utf-8') as f:
    f.write('\n'.join(out) + '\n')
print(f'wrote {dst}')
print(f'classes={len(reserved)} rows={len(rows)} dropped(beyond capacity)={len(dropped)}')
