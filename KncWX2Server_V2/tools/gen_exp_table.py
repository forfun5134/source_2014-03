#!/usr/bin/env python3
# gen_exp_table.py — 由本倉庫 ScriptData/ExpTable.xls（Sheet1：레벨/필요EXP/총경험치，與 Lua 產生器同一來源）
# 產生 src/server/ExpTableData.inc（constexpr 陣列）。執行：python3 tools/gen_exp_table.py
# 依賴：pip install xlrd（僅產生器需要，V2 無 python 依賴）
import os
import sys

try:
    import xlrd
except ImportError:
    sys.exit("gen_exp_table.py 需要 xlrd：pip install xlrd")

here = os.path.dirname(os.path.abspath(__file__))
repo_root = os.path.abspath(os.path.join(here, '..', '..'))
xls_path = os.path.join(repo_root, 'ScriptData', 'ExpTable.xls')

wb = xlrd.open_workbook(xls_path)
sh = wb.sheet_by_name('Sheet1')
rows = []
for r in range(1, sh.nrows):
    level = int(sh.cell_value(r, 0)); need = int(sh.cell_value(r, 1)); total = int(sh.cell_value(r, 2))
    rows.append((level, need, total))

rows.sort(key=lambda t: t[0])
assert rows[0][0] == 1 and rows[0][1] == 0 and rows[0][2] == 0, 'level 1 必須為 (1, 0, 0)'
assert len(rows) == 80 and [r[0] for r in rows] == list(range(1, 81)), '必須為連續 1..80'
cum = 0
for lvl, need, total in rows:
    if lvl != 1:
        assert cum + need == total, f'level {lvl}: 累加不符'
    assert total >= 0 and need >= 0
    cum = total

out = []
out.append('// ExpTableData.inc — 由 tools/gen_exp_table.py 自 ScriptData/ExpTable.xls（Sheet1, 레벨/필요EXP/총경험치）產生。')
out.append('// 這是本倉庫既有的**遊戲官方資料表**（原碼 KExpTable/AddExpTable_LUA 讀入之同源），勿手改。')
out.append('// 標頭位於本檔案（.inc），由 ExpTable.cpp #include。')
out.append('static const ExpTableEntry kExpTable[80] = {')
for lvl, need, total in rows:
    out.append('    { %d, %d, %d },' % (lvl, need, total))
out.append('};')
out.append('static constexpr int kExpTableMaxLevel = 80;')
out.append(f'static constexpr int kExpTableMaxTotalExp = {rows[-1][2]};')
out.append(f'static constexpr int kExpTableMaxNeedExp = {rows[-1][1]};')

dst = os.path.join(here, '..', 'src', 'server', 'ExpTableData.inc')
with open(dst, 'w', encoding='utf-8') as f:
    f.write('\n'.join(out) + '\n')
print(f'wrote {dst} ({len(rows)} rows, max total = {rows[-1][2]})')
