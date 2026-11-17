// tests/test_check_nickname.cpp — EGS_ENTRY_POINT_CHECK_NICK_NAME_REQ/ACK 切片測試
// 涵蓋：wire codec roundtrip、決策層（合法/過長/注入/已存在/冷卻 14 天/可用回顯）。
// ⚠ wire 自洽，未對原 SDK 實機驗證；iServerGroup 忽略；無字串過濾器（見 CheckNicknameProtocol.h）。
#include <cstdio>
#include <cstring>
#include <string>
#include <functional>

#include "../src/core/Serializer.h"
#include "../src/core/NetError.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/CheckNicknameProtocol.h"
#include "../src/server/UnitSelectArbiter.h"

using namespace x2;
using namespace x2::db;
using namespace x2::check_nickname;
using namespace x2::select_unit;

void RunCheckNicknameTestsByRef(int& pass, int& fail);
static int g_pass_cn = 0, g_fail_cn = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_cn++; } \
    else { g_fail_cn++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
} while (0)

static SerBuffer PutPayload(const std::function<bool(Serializer&)>& fn)
{
    Serializer ks;
    SerBuffer buf;
    if (!ks.BeginWriting(&buf)) return SerBuffer{};
    if (!fn(ks)) return SerBuffer{};
    ks.EndWriting();
    return buf;
}

static void TestCheckNicknameCodec()
{
    EntryPointCheckNickNameReq req;
    req.iServerGroup = 3;
    req.wstrNickName = L"新生劍士";
    SerBuffer reqBuf = PutPayload([&req](Serializer& s) { return PutEntryPointCheckNickNameReq(s, req); });
    CHECK(reqBuf.GetLength() > 0, "checkNickNameReq encodes");
    {
        Serializer ks;
        SerBuffer tmp = reqBuf;
        EntryPointCheckNickNameReq rOut;
        CHECK(ks.BeginReading(&tmp) && GetEntryPointCheckNickNameReq(ks, rOut), "checkNickNameReq decodes");
        ks.EndReading();
        CHECK(rOut.iServerGroup == 3 && rOut.wstrNickName == L"新生劍士", "checkNickNameReq rt");
    }

    EntryPointCheckNickNameAck ack;
    ack.iOK = ERR_RESTORE_NICK_NAME_02;
    ack.iUnitUID = 0;
    ack.wstrNickName = L"已被占用";
    SerBuffer buf = PutPayload([&ack](Serializer& s) { return PutEntryPointCheckNickNameAck(s, ack); });
    {
        Serializer ks;
        SerBuffer tmp = buf;
        EntryPointCheckNickNameAck aOut;
        CHECK(ks.BeginReading(&tmp) && GetEntryPointCheckNickNameAck(ks, aOut), "checkNickNameAck decodes");
        ks.EndReading();
        CHECK(aOut.iOK == ERR_RESTORE_NICK_NAME_02 && aOut.wstrNickName == L"已被占用" && aOut.iUnitUID == 0, "checkNickNameAck rt");
    }
}

static void TestHandleCheckNicknameReq()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open in-memory game db");
    CHECK(ApplyGameMigrations(db, err), "apply game migrations");
    GameStore store(db);

    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(777, "nickchecktester", gu, err), "seed guser 777");

    // 可用暱稱 → NET_OK + 回顯
    {
        EntryPointCheckNickNameReq req;
        req.iServerGroup = 0; req.wstrNickName = L"未用名";   // 9 bytes UTF-8（≤12）
        EntryPointCheckNickNameAck ack;
        CHECK(HandleCheckNicknameReq(store, req, ack, err), "available handled");
        CHECK(ack.iOK == NET_OK, "available -> NET_OK");
        CHECK(ack.wstrNickName == L"未用名" && ack.iUnitUID == 0, "echo nickname, uid=0");
    }
    // 空暱稱 → ERR_RESTORE_NICK_NAME_06
    {
        EntryPointCheckNickNameReq req;
        req.wstrNickName = L"";
        EntryPointCheckNickNameAck ack;
        CHECK(HandleCheckNicknameReq(store, req, ack, err), "empty handled");
        CHECK(ack.iOK == ERR_RESTORE_NICK_NAME_06, "empty -> 06");
    }
    // 13+ bytes → 06
    {
        EntryPointCheckNickNameReq req;
        req.wstrNickName = L"一二三四五";   // 15 bytes UTF-8
        EntryPointCheckNickNameAck ack;
        CHECK(HandleCheckNicknameReq(store, req, ack, err), "long handled");
        CHECK(ack.iOK == ERR_RESTORE_NICK_NAME_06, "long -> 06");
    }
    // 注入標記 → 05
    {
        EntryPointCheckNickNameReq req;
        req.wstrNickName = L"a;b";
        EntryPointCheckNickNameAck ack;
        CHECK(HandleCheckNicknameReq(store, req, ack, err), "injection handled");
        CHECK(ack.iOK == ERR_RESTORE_NICK_NAME_05, "injection -> 05");
    }
    // 暱稱已存在（建立後）→ 02
    {
        int64_t uid = 0;
        { std::string e; auto r = store.CreateUnit(777, "占位暱稱", 1, uid, e); CHECK(r == CreateUnitResult::Ok, "seed unit with nickname"); }
        EntryPointCheckNickNameReq req;
        req.wstrNickName = L"占位暱稱";
        EntryPointCheckNickNameAck ack;
        CHECK(HandleCheckNicknameReq(store, req, ack, err), "taken handled");
        CHECK(ack.iOK == ERR_RESTORE_NICK_NAME_02, "taken -> 02");
    }
    // 暱稱冷卻（SoftDeleteUnit 記錄 history）→ 03
    {
        int64_t uid = 0;
        { std::string e; auto r = store.CreateUnit(777, "冷卻暱稱", 1, uid, e); CHECK(r == CreateUnitResult::Ok, "seed unit for cooldown"); }
        CHECK(store.SoftDeleteUnit(uid, err), "soft delete to push cooldown history");
        EntryPointCheckNickNameReq req;
        req.wstrNickName = L"冷卻暱稱";
        EntryPointCheckNickNameAck ack;
        CHECK(HandleCheckNicknameReq(store, req, ack, err), "cooldown handled");
        CHECK(ack.iOK == ERR_RESTORE_NICK_NAME_03, "cooldown -> 03");
    }
}

void RunCheckNicknameTestsByRef(int& pass, int& fail)
{
    TestCheckNicknameCodec();
    TestHandleCheckNicknameReq();
    pass += g_pass_cn;
    fail += g_fail_cn;
}
