#!/usr/bin/env python3
# gen_unit_classes.py — 由本倉庫 KncWX2Server/Common/X2Data/XSLUnit.h 的 UNIT_CLASS enum，
#   依 ServerDefine.h 的 #define（JP INT_INTERNAL 建置旗標；該建置所有 SERV_* 皆為無條件定義）
#   機械求值，產生 src/server/UnitClassData.inc（勿手改）。
# 執行：python3 tools/gen_unit_classes.py   （純 stdlib）
# 規則：
#   - 求值 #ifdef/#ifndef/#else/#endif；defined 集合＝ServerDefine.h 全部 `^#define` 名稱。
#   - 顯式 `= N` 重設計數器；未顯式則遞增。
#   - 哨兵 UC_NONE（0）／UC_MAX 排除於「已宣告可建立職業」表之外。
#   - 此表為 templet 存在性的**模型**：執行期 templet 由 UnitTemplet.lua（未隨倉庫提供）載入；
#     模型假設所有已宣告的可玩職業在部署 templet 表中皆有列（已發佈職業成立）。
import os
import re
import sys

here = os.path.dirname(os.path.abspath(__file__))
repo_root = os.path.abspath(os.path.join(here, '..', '..'))
define_h = os.path.join(repo_root, 'KncWX2Server', 'Common', 'ServerDefine.h')
unit_h = os.path.join(repo_root, 'KncWX2Server', 'Common', 'X2Data', 'XSLUnit.h')

# ---- 1) ServerDefine.h 的 defined 集合
defined = set()
with open(define_h, encoding='utf-8', errors='replace') as f:
    for raw in f:
        m = re.match(r'^#define\s+([A-Za-z_][A-Za-z0-9_]*)', raw)
        if m:
            defined.add(m.group(1))

# ---- 2) UNIT_CLASS enum 行範圍（從 'enum UNIT_CLASS' 到行首 '\t};'）
with open(unit_h, encoding='utf-8', errors='replace') as f:
    lines = f.readlines()
start = next(i for i, ln in enumerate(lines) if re.match(r'\s*enum\s+UNIT_CLASS\b', ln))
end = next(i for i in range(start, len(lines)) if re.match(r'\s*\};', lines[i]))
seg = lines[start:end]

# ---- 3) 簡易 preprocessor 求值 + 列舉賦值
entries = []   # (name, value)
clock = 0
frame_stack = []   # list of [parent_active(bool), branch_taken(bool)]
def active():
    return all(f[1] for f in frame_stack)

for raw in seg:
    ln = raw.strip()
    # 去除行內註解（保留 #ifdef 行；UC_ 行的 // 註解切掉）
    code = ln.split('//', 1)[0].rstrip()
    if not code.strip():
        continue
    m = re.match(r'^#(ifdef|ifndef|else|endif)\b(.*)$', code)
    if m:
        directive, arg = m.group(1), m.group(2).strip()
        parent = active()
        if directive == 'ifdef':
            frame_stack.append([parent, parent and (arg in defined)])
        elif directive == 'ifndef':
            frame_stack.append([parent, parent and (arg not in defined)])
        elif directive == 'else':
            frame = frame_stack[-1]
            parent = frame[0]
            frame[1] = parent and not frame[1]
        elif directive == 'endif':
            frame_stack.pop()
        continue
    if not active():
        continue
    m = re.match(r'^(UC_[A-Za-z0-9_]+)\s*(?:=\s*(\d+))?\s*,', code)
    if not m:
        continue
    name, val = m.group(1), m.group(2)
    if val is not None:
        clock = int(val)
    entries.append((name, clock))
    clock += 1

print('parsed entries:', len(entries))
print('defined SERV_* count:', len(defined))

known = [(n, v) for n, v in entries if n not in ('UC_NONE', 'UC_MAX')]
known.sort(key=lambda kv: kv[1])
print('known classes:', len(known))
print('set:', ','.join(str(v) for _, v in known))

out = []
out.append('// UnitClassData.inc — 由 tools/gen_unit_classes.py 自 XSLUnit.h UNIT_CLASS enum 依 ServerDefine.h #define（JP INT_INTERNAL 全開）機械求值產生（勿手改）。')
out.append('// 已宣告的可建立職業 iClass（UC_NONE=0／UC_MAX 哨兵除外）；templet 存在性之模型（見 UnitTemplet.h）。')
out.append('static const int kKnownUnitClasses[] = {')
for n, v in known:
    out.append(f'    {v},   // {n}')
out.append('};')
out.append(f'static constexpr int kKnownUnitClassesSize = {len(known)};')
dst = os.path.join(here, '..', 'src', 'server', 'UnitClassData.inc')
with open(dst, 'w', encoding='utf-8') as f:
    f.write('\n'.join(out) + '\n')
print(f'wrote {dst}')
