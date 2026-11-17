// tests/test_change_nickname.cpp — EGS_CHANGE_NICK_NAME_REQ/ACK（含 ENTRY_POINT 變體）切片測試
// 涵蓋：wire codec roundtrip（兩種 REQ + ACK）、決策層（長度/注入/擁有權/bCheckOnly/實際改名/冷卻歷史/同名改名）。
// ⚠ wire 自洽，未對原 SDK 實機驗證；iServerGroup 忽略；無字串過濾器/PVP NPC 名檢查（見 ChangeNicknameProtocol.h）。
#include <cstdio>
#include <cstring>
#include <string>
#include <functional>

#include "../src/core/Serializer.h"
#include "../src/core/NetError.h"
#include "../src/db/Sqlite.h"
#include "../src/db/GameStore.h"
#include "../src/server/ChangeNicknameProtocol.h"
#include "../src/server/CheckNicknameProtocol.h"
#include "../src/server/UnitSelectArbiter.h"

using namespace x2;
using namespace x2::db;
using namespace x2::change_nickname;
using namespace x2::select_unit;

void RunChangeNicknameTestsByRef(int& pass, int& fail);
static int g_pass_cnc = 0, g_fail_cnc = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_cnc++; } \
    else { g_fail_cnc++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
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

static void TestChangeNicknameCodec()
{
    ChangeNickNameReq req;
    req.iUnitUID = 0x1122334455667788LL;
    req.wstrNickName = L"新名字";
    req.bCheckOnly = true;
    SerBuffer reqBuf = PutPayload([&req](Serializer& s) { return PutChangeNickNameReq(s, req); });
    {
        Serializer ks;
        SerBuffer tmp = reqBuf;
        ChangeNickNameReq rOut;
        CHECK(ks.BeginReading(&tmp) && GetChangeNickNameReq(ks, rOut), "req decodes");
        ks.EndReading();
        CHECK(rOut.iUnitUID == 0x1122334455667788LL && rOut.wstrNickName == L"新名字" && rOut.bCheckOnly, "req rt");
    }
    EntryPointChangeNickNameReq ep;
    ep.iServerGroup = 7; ep.iUnitUID = 888; ep.wstrNickName = L"新名字"; ep.bCheckOnly = false;
    SerBuffer epBuf = PutPayload([&ep](Serializer& s) { return PutEntryPointChangeNickNameReq(s, ep); });
    {
        Serializer ks;
        SerBuffer tmp = epBuf;
        EntryPointChangeNickNameReq rOut;
        CHECK(ks.BeginReading(&tmp) && GetEntryPointChangeNickNameReq(ks, rOut), "entry req decodes");
        ks.EndReading();
        CHECK(rOut.iServerGroup == 7 && rOut.iUnitUID == 888 && rOut.wstrNickName == L"新名字" && !rOut.bCheckOnly, "entry req rt");
    }
    ChangeNickNameAck ack;
    ack.iOK = ERR_RESTORE_NICK_NAME_02;
    ack.iUnitUID = 888;
    ack.wstrNickName = L"新名字";
    ack.bCheckOnly = false;
    SerBuffer buf = PutPayload([&ack](Serializer& s) { return PutChangeNickNameAck(s, ack); });
    {
        Serializer ks;
        SerBuffer tmp = buf;
        ChangeNickNameAck aOut;
        CHECK(ks.BeginReading(&tmp) && GetChangeNickNameAck(ks, aOut), "ack decodes");
        ks.EndReading();
        CHECK(aOut.iOK == ERR_RESTORE_NICK_NAME_02 && aOut.iUnitUID == 888 && aOut.wstrNickName == L"新名字" && !aOut.bCheckOnly, "ack rt");
    }
}

static void TestHandleChangeNicknameReq()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open in-memory game db");
    CHECK(ApplyGameMigrations(db, err), "apply game migrations");
    GameStore store(db);

    GUserRecord gu;
    CHECK(store.GetOrCreateGUser(777, "changer", gu, err), "seed guser 777");

    int64_t unitUID = 0;
    { std::string e; auto r = store.CreateUnit(777, "舊名字", 3, unitUID, e); CHECK(r == CreateUnitResult::Ok, "seed unit"); }

    // bCheckOnly=true：可用新名 → NET_OK
    {
        ChangeNickNameReq req; req.iUnitUID = unitUID; req.wstrNickName = L"可用新名"; req.bCheckOnly = true;
        ChangeNickNameAck ack;
        CHECK(HandleChangeNicknameReq(store, 777, req, ack, err), "check-only available handled");
        CHECK(ack.iOK == NET_OK, "check-only available -> NET_OK");
        CHECK(ack.iUnitUID == unitUID && ack.wstrNickName == L"可用新名" && ack.bCheckOnly, "ack echoes fields");
    }
    // bCheckOnly=true：佔用別人的名 → 02
    {
        int64_t otherUID = 0;
        { std::string e; auto r = store.CreateUnit(777, "占位角色", 1, otherUID, e); CHECK(r == CreateUnitResult::Ok, "seed other unit"); }
        ChangeNickNameReq req; req.iUnitUID = unitUID; req.wstrNickName = L"占位角色"; req.bCheckOnly = true;
        ChangeNickNameAck ack;
        CHECK(HandleChangeNicknameReq(store, 777, req, ack, err), "check-only taken handled");
        CHECK(ack.iOK == ERR_RESTORE_NICK_NAME_02, "check-only taken -> 02");
    }
    // bCheckOnly=true：自己的現有名 → NET_OK（排除自身）
    {
        ChangeNickNameReq req; req.iUnitUID = unitUID; req.wstrNickName = L"舊名字"; req.bCheckOnly = true;
        ChangeNickNameAck ack;
        CHECK(HandleChangeNicknameReq(store, 777, req, ack, err), "check-only self handled");
        CHECK(ack.iOK == NET_OK, "check-only self -> NET_OK");
    }
    // 空暱稱 → 06 / 注入 → 05
    {
        ChangeNickNameReq req; req.iUnitUID = unitUID; req.wstrNickName = L""; req.bCheckOnly = true;
        ChangeNickNameAck ack;
        CHECK(HandleChangeNicknameReq(store, 777, req, ack, err), "empty handled");
        CHECK(ack.iOK == ERR_RESTORE_NICK_NAME_06, "empty -> 06");
    }
    {
        ChangeNickNameReq req; req.iUnitUID = unitUID; req.wstrNickName = L"a'b"; req.bCheckOnly = true;
        ChangeNickNameAck ack;
        CHECK(HandleChangeNicknameReq(store, 777, req, ack, err), "injection handled");
        CHECK(ack.iOK == ERR_RESTORE_NICK_NAME_05, "injection -> 05");
    }
    // 非本人 → 00
    {
        ChangeNickNameReq req; req.iUnitUID = unitUID; req.wstrNickName = L"不該成功"; req.bCheckOnly = false;
        ChangeNickNameAck ack;
        CHECK(HandleChangeNicknameReq(store, /*userUID=*/999, req, ack, err), "foreign handled");
        CHECK(ack.iOK == ERR_RESTORE_NICK_NAME_00, "foreign -> 00");
    }
    // 實際改名 → NET_OK；GetUnitByUID 顯示新暱稱；舊暱稱進冷卻歷史 → 03
    {
        ChangeNickNameReq req; req.iUnitUID = unitUID; req.wstrNickName = L"真新名字"; req.bCheckOnly = false;
        ChangeNickNameAck ack;
        CHECK(HandleChangeNicknameReq(store, 777, req, ack, err), "rename handled");
        CHECK(ack.iOK == NET_OK, "rename -> NET_OK");

        db::GUnitRecord rec; bool found = false;
        CHECK(store.GetUnitByUID(unitUID, rec, found, err) && found, "re-read unit");
        CHECK(rec.nickname == "真新名字", "nickname updated in store");

        // 舊暱稱現在 14 天內冷卻 → check 應回 03
        check_nickname::EntryPointCheckNickNameReq creq; creq.wstrNickName = L"舊名字";
        check_nickname::EntryPointCheckNickNameAck cack;
        CHECK(HandleCheckNicknameReq(store, creq, cack, err), "old nickname check handled");
        CHECK(cack.iOK == ERR_RESTORE_NICK_NAME_03, "old nickname cooldown -> 03");
    }
    // 改回自己剛釋放的舊暱稱（14 天冷卻中）→ 03
    {
        ChangeNickNameReq req; req.iUnitUID = unitUID; req.wstrNickName = L"舊名字"; req.bCheckOnly = false;
        ChangeNickNameAck ack;
        CHECK(HandleChangeNicknameReq(store, 777, req, ack, err), "rename to cooldown handled");
        CHECK(ack.iOK == ERR_RESTORE_NICK_NAME_03, "cooldown target -> 03");
    }
    // 同名改名（新 == 當前）→ NET_OK
    {
        ChangeNickNameReq req; req.iUnitUID = unitUID; req.wstrNickName = L"真新名字"; req.bCheckOnly = false;
        ChangeNickNameAck ack;
        CHECK(HandleChangeNicknameReq(store, 777, req, ack, err), "same-name rename handled");
        CHECK(ack.iOK == NET_OK, "same-name -> NET_OK");
    }
    // ENTRY_POINT 入口共享決策 → NET_OK
    {
        EntryPointChangeNickNameReq req; req.iServerGroup = 1; req.iUnitUID = unitUID; req.wstrNickName = L"entry新名"; req.bCheckOnly = false;
        ChangeNickNameAck ack;
        CHECK(HandleEntryPointChangeNicknameReq(store, 777, req, ack, err), "entry-point rename handled");
        CHECK(ack.iOK == NET_OK, "entry-point rename -> NET_OK");
    }
}

void RunChangeNicknameTestsByRef(int& pass, int& fail)
{
    TestChangeNicknameCodec();
    TestHandleChangeNicknameReq();
    pass += g_pass_cnc;
    fail += g_fail_cnc;
}
