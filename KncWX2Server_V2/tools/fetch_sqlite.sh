#!/usr/bin/env bash
# 取得「指定版本」的 SQLite 官方合體版原始碼（sqlite3.c / sqlite3.h / sqlite3ext.h）。
# 官方來源：https://www.sqlite.org/YYYY/sqlite-autoconf-VER.tar.gz
# 注意：本開發環境不含 sqlite.org 白名單，目前以 npm better-sqlite3@13.2.0 內嵌的
# 官方 3.54.1 合體版 vendored（見 third_party/sqlite/SOURCE.md）。
# 環境可連線 sqlite.org 時，執行本腳本改用官方檔案覆蓋並重新校驗 SHA-256。
set -euo pipefail
cd "$(dirname "$0")/.."

VER="${1:-3540100}"   # 例：3540100 => 3.54.1
YEAR="${2:-2026}"     # 官方下載路徑中的年份目錄
ZIP="https://www.sqlite.org/${YEAR}/sqlite-autoconf-${VER}.tar.gz"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
echo "download $ZIP"
curl -fSL --max-time 300 -o "$TMP/sqlite.tar.gz" "$ZIP"
tar -xzf "$TMP/sqlite.tar.gz" -C "$TMP"
SRC="$(find "$TMP" -maxdepth 1 -type d -name 'sqlite-autoconf-*')"
mkdir -p third_party/sqlite
cp "$SRC/sqlite3.c" "$SRC/sqlite3.h" "$SRC/sqlite3ext.h" third_party/sqlite/
grep -E '^#define SQLITE_(VERSION|VERSION_NUMBER|SOURCE_ID)' third_party/sqlite/sqlite3.h
echo "OK — 已更新 vendored SQLite；請重新執行 tools/build_and_test.sh，並更新 third_party/sqlite/SOURCE.md"
