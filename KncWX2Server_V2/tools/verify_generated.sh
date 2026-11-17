#!/usr/bin/env bash
# verify_generated.sh — 重新產生三個 .inc 並與版控比對（防漂移；gen 產物一律不手改）。
# 依賴：python3 + xlrd（pip install xlrd）。用法：bash tools/verify_generated.sh
set -euo pipefail
cd "$(dirname "$0")/.."

tmp="$(mktemp -d)"
for f in ExpTableData.inc StatTableData.inc StringFilterData.inc; do cp "src/server/$f" "$tmp/$f"; done

python3 tools/gen_exp_table.py >/dev/null
python3 tools/gen_stat_table.py >/dev/null
python3 tools/gen_string_filter.py >/dev/null

ok=1
for f in ExpTableData.inc StatTableData.inc StringFilterData.inc; do
    if ! cmp -s "$tmp/$f" "src/server/$f"; then
        echo "DRIFT: src/server/$f 與產生器輸出不一致（請重跑 python3 tools/gen_*.py 並提交）" >&2
        ok=0
    fi
done
rm -rf "$tmp"
[ "$ok" -eq 1 ] || exit 1
echo "OK: 所有 generated .inc 與產生器輸出一致"
