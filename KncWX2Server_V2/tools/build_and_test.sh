#!/usr/bin/env bash
# Linux/gcc 交叉確認建置：只編譯平台無關核心 + 安全模組 + 測試
set -euo pipefail
cd "$(dirname "$0")/.."

OUT=build
mkdir -p "$OUT"
CXX=${CXX:-g++}
CXXFLAGS=${CXXFLAGS:-"-std=c++17 -O1 -g -Wall -Wextra -fno-strict-aliasing"}
DEFS="-D_CRT_SECURE_NO_WARNINGS"
# 可選：REGION=TW X2_INTERNAL_BUILD=0 bash tools/build_and_test.sh
[ -n "${REGION:-}" ] && DEFS="$DEFS -DX2_REGION_${REGION}"
[ -n "${X2_INTERNAL_BUILD:-}" ] && DEFS="$DEFS -DX2_INTERNAL_BUILD=${X2_INTERNAL_BUILD}"

CORE_SRCS="src/core/UidType.cpp src/core/SerBuffer.cpp src/core/Event.cpp src/core/Region.cpp src/core/Sha256.cpp src/net/Socket.cpp src/net/Session.cpp"
SRV_SRCS=$(ls src/server/*.cpp 2>/dev/null || true)
SEC_SRCS=$(ls src/security/*.cpp 2>/dev/null || true)
DB_SRCS=$(ls src/db/*.cpp 2>/dev/null || true)
TEST_SRCS=$(ls tests/*.cpp | sort)
MINIZ="third_party/miniz/miniz.c third_party/miniz/miniz_tdef.c third_party/miniz/miniz_tinfl.c"
SQLITE=""
[ -f third_party/sqlite/sqlite3.c ] && SQLITE=third_party/sqlite/sqlite3.c

echo "== compile miniz (C) =="
CC=${CC:-gcc}
for _m in $MINIZ; do $CC -std=c11 -O1 -c "$_m" -o "$OUT/$(basename ${_m%.c}).o"; done

if [ -n "$SQLITE" ]; then
  echo "== compile sqlite3 amalgamation (C) =="
  gcc -std=c11 -O1 -DSQLITE_THREADSAFE=2 -DSQLITE_ENABLE_FTS5 -DSQLITE_ENABLE_JSON1 -c $SQLITE -o "$OUT/sqlite3.o"
fi

echo "== collect objects =="
OBJS="$OUT/miniz.o $OUT/miniz_tdef.o $OUT/miniz_tinfl.o"
[ -f "$OUT/sqlite3.o" ] && OBJS="$OBJS $OUT/sqlite3.o"
for f in $CORE_SRCS $SEC_SRCS $DB_SRCS $SRV_SRCS; do
  obj="$OUT/$(echo "$f" | tr '/.' '__').o"
  echo "  $f"
  $CXX $CXXFLAGS $DEFS -c "$f" -o "$obj"
  OBJS="$OBJS $obj"
done

echo "== build test runner =="
for f in $TEST_SRCS; do
  obj="$OUT/$(echo "$f" | tr '/.' '__').o"
  $CXX $CXXFLAGS $DEFS -c "$f" -o "$obj"
  OBJS="$OBJS $obj"
done

$CXX $CXXFLAGS $OBJS -ldl -lpthread -o "$OUT/x2_tests"
echo "== run =="
"./$OUT/x2_tests"
