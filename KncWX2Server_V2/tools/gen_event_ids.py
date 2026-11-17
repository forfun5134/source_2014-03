#!/usr/bin/env python3
# gen_event_ids.py — 從原始 KncWX2Server 的 EventID_{System,Client,Server}.h
# 依序解析所有 _ENUM( ... ) 項目（含可選的 = 常數值），產生位元組相容的
# V2 列舉與名稱對照表 C++ 標頭。
#
# 原始 enum 為非 scoped enum（int），依出現順序自動遞增。
# 注意：EventID_System.h 內第一項 _ENUM( E_HEART_BEAT = 0 ) 含顯式賦值。
#
# 用法: python3 tools/gen_event_ids.py <原始Common目錄> <輸出標頭>
import re
import sys
import io

def parse(path):
    text = io.open(path, 'r', encoding='cp949', errors='replace').read()
    # strip // comments (保留字串，這些檔案沒有字串，安全)
    text = re.sub(r'//[^\n]*', '', text)
    # 移除前置處理器行（例如 #define _ENUM(VAL) VAL, 會被誤解析成 VAL 項目）
    text = re.sub(r'(?m)^\s*#[^\n]*\n', '\n', text)
    items = []  # (name, explicit_value_or_None)
    for m in re.finditer(r'_ENUM\(\s*([A-Za-z_][A-Za-z_0-9]*)\s*(?:=\s*([0-9]+)\s*)?\)', text):
        items.append((m.group(1), int(m.group(2)) if m.group(2) else None))
    return items

def main():
    src_common, out_path = sys.argv[1], sys.argv[2]
    order = ['EventID_System.h', 'EventID_Client.h', 'EventID_Server.h']

    all_items = []
    for name in order:
        all_items.extend(parse(src_common + '/' + name))

    # 建立名稱 → 數值 映射（重複名稱在原始碼中不存在；若有則保留第一次出現並警告）
    value = 0
    seen = {}
    entries = []
    for name, explicit in all_items:
        if explicit is not None:
            value = explicit
        if name in seen:
            print(f'WARNING: duplicate enum {name} (first value {seen[name]}), skipping re-def')
            value += 1
            continue
        seen[name] = value
        entries.append((name, value))
        value += 1

    with io.open(out_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write('// EventIDs.h — 由 tools/gen_event_ids.py 自動產生，請勿手動編輯。\n')
        f.write('// 來源: KncWX2Server/Common/EventID_{System,Client,Server}.h\n')
        f.write('// 值與原始 enum 完全一致（依出現順序遞增）。\n\n')
        f.write('#pragma once\n\n#include <cstdint>\n\nnamespace x2 {\n\n')
        f.write('enum class EventID : uint16_t\n{\n')
        for name, v in entries:
            f.write(f'    {name} = {v},\n')
        f.write(f'    EVENT_ID_COUNT = {len(entries)}\n')
        f.write('};\n\n')
        f.write('// 事件名稱表（供日誌/除錯；索引 = EventID 數值）\n')
        f.write('inline const char* EventIDName(uint16_t id)\n{\n    switch (id)\n    {\n')
        for name, v in entries:
            f.write(f'        case {v}: return "{name}";\n')
        f.write('        default: return "UNKNOWN";\n    }\n}\n\n} // namespace x2\n')
    print(f'wrote {out_path}: {len(entries)} event ids')

if __name__ == '__main__':
    main()
