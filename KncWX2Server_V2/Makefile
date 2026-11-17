# KncWX2Server_V2 — Linux/gcc 交叉確認建置（Windows 走 KncWX2Server_V2.sln / MSBuild）
# 用法：make            # 編譯並執行測試
#       make build      # 只編譯
#       make clean
CXX      ?= g++
CC       ?= gcc
CXXFLAGS ?= -std=c++17 -O2 -g -Wall -Wextra -fno-strict-aliasing -I.

# 建置期地區：make REGION=TW（預設 JP，對齊原版 SERV_INT_INTERNAL）
REGION        ?= JP
ifneq ($(REGION),)
CXXFLAGS     += -DX2_REGION_$(REGION)
endif
# 內部版本（預設 1，對齊 SERV_INT_INTERNAL）；release 式：make INTERNAL_BUILD=0
INTERNAL_BUILD ?= 1
CXXFLAGS     += -DX2_INTERNAL_BUILD=$(INTERNAL_BUILD)
CFLAGS   ?= -std=c11 -O2 -DSQLITE_THREADSAFE=2 -DSQLITE_ENABLE_FTS5 -DSQLITE_ENABLE_JSON1

OUT      := build
CORE     := src/core/UidType.cpp src/core/SerBuffer.cpp src/core/Event.cpp src/core/Region.cpp src/core/Sha256.cpp
NET      := src/net/Socket.cpp src/net/Session.cpp
SRV      := $(wildcard src/server/*.cpp)
SEC      := $(wildcard src/security/*.cpp)
DB       := $(wildcard src/db/*.cpp)
TEST     := $(wildcard tests/*.cpp)
MINIZ_C  := third_party/miniz/miniz.c third_party/miniz/miniz_tdef.c third_party/miniz/miniz_tinfl.c
SQLITE_C := $(wildcard third_party/sqlite/sqlite3.c)

CORE_OBJ := $(patsubst %.cpp,$(OUT)/%.o,$(CORE))
NET_OBJ  := $(patsubst %.cpp,$(OUT)/%.o,$(NET))
SEC_OBJ  := $(patsubst %.cpp,$(OUT)/%.o,$(SEC))
DB_OBJ   := $(patsubst %.cpp,$(OUT)/%.o,$(DB))
SRV_OBJ  := $(patsubst %.cpp,$(OUT)/%.o,$(SRV))
TEST_OBJ := $(patsubst %.cpp,$(OUT)/%.o,$(TEST))
MINIZ_OBJ:= $(patsubst %.c,$(OUT)/%.o,$(MINIZ_C))
SQLITE_OBJ := $(if $(SQLITE_C),$(OUT)/third_party/sqlite/sqlite3.o,)
OBJS := $(MINIZ_OBJ) $(SQLITE_OBJ) $(CORE_OBJ) $(NET_OBJ) $(SEC_OBJ) $(DB_OBJ) $(SRV_OBJ) $(TEST_OBJ)

.PHONY: all build test clean
all: test

$(OUT)/%.o: %.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(OUT)/%.o: %.c
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

$(OUT)/third_party/sqlite/sqlite3.o: third_party/sqlite/sqlite3.c
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

build: $(OUT)/x2_tests

$(OUT)/x2_tests: $(OBJS)
	$(CXX) $(CXXFLAGS) $(OBJS) -ldl -lpthread -o $@

test: $(OUT)/x2_tests
	./$(OUT)/x2_tests

clean:
	rm -rf $(OUT)
