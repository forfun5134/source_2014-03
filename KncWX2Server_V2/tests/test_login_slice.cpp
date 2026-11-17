// tests/test_login_slice.cpp — 「連線 → 認證」最短路徑垂直切片測試
// 涵蓋：NetError 數值對照、連線/認證封包 codec（含 golden bytes）、LoginArbiter 決策、
//      loopback TCP 完整流程（Session 握手 → CONNECT_REQ/ACK → VERIFY_ACCOUNT_REQ/ACK，含成功與失敗兩路徑）。
// ⚠ 警告：VERIFY_ACCOUNT 的密碼驗證是「開發用替代品」（UserStore + salted SHA-256），
//         不是出版商（Nexon）認證；僅用於本倉庫內的端到端打通，禁用於生產。
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>
#include <functional>
#include <thread>
#include <atomic>
#include <chrono>
#include <unistd.h>

#include "../src/core/Event.h"
#include "../src/core/EventIDs.h"
#include "../src/core/NetError.h"
#include "../src/core/Serializer.h"
#include "../src/db/Sqlite.h"
#include "../src/db/UserStore.h"
#include "../src/net/Session.h"
#include "../src/server/LoginArbiter.h"
#include "../src/server/LoginProtocol.h"

using namespace x2;
using namespace x2::db;
using namespace x2::login;

void RunLoginSliceTestsByRef(int& pass, int& fail);
static int g_pass_login = 0, g_fail_login = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_login++; } \
    else { g_fail_login++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
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

static Event MakeEvent(uint16_t eventID, const SerBuffer& payload)
{
    Event ev;
    ev.eventID = eventID;
    ev.payload = payload;
    ev.dest.performerID = PerformerID::PI_GS_USER;
    return ev;
}

static const uint16_t kConnectReqID = static_cast<uint16_t>(EventID::EGS_CONNECT_REQ);
static const uint16_t kConnectAckID = static_cast<uint16_t>(EventID::EGS_CONNECT_ACK);
static const uint16_t kVerifyReqID  = static_cast<uint16_t>(EventID::EGS_VERIFY_ACCOUNT_REQ);
static const uint16_t kVerifyAckID  = static_cast<uint16_t>(EventID::EGS_VERIFY_ACCOUNT_ACK);

// ---- NetError 數值對照 NetError_def.h ----
static void TestNetErrorValues()
{
    CHECK(NET_OK == 0, "NET_OK == 0");
    CHECK(ERR_CONNECT_00 == 3, "ERR_CONNECT_00 == 3");
    CHECK(ERR_CONNECT_04 == 4, "ERR_CONNECT_04 == 4");
    CHECK(ERR_VERIFY_04 == 10, "ERR_VERIFY_04 == 10");
    CHECK(ERR_VERIFY_06 == 12, "ERR_VERIFY_06 == 12");
    CHECK(ERR_VERIFY_10 == 14, "ERR_VERIFY_10 == 14");
    CHECK(ERR_VERIFY_11 == 15, "ERR_VERIFY_11 == 15");
}

// ---- ConnectReq golden bytes：[wstring len u32BE][UTF-16LE] ----
static void TestConnectReqGolden()
{
    ConnectReq req;
    req.version = L"AB";
    Serializer ks;
    SerBuffer buf;
    CHECK(ks.BeginWriting(&buf), "begin");
    CHECK(PutConnectReq(ks, req), "put");
    ks.EndWriting();
    static const uint8_t expect[] = { 0x00, 0x00, 0x00, 0x04, 0x41, 0x00, 0x42, 0x00 };
    CHECK(buf.GetLength() == sizeof(expect), "connect req byte length");
    CHECK(std::memcmp(buf.GetData(), expect, sizeof(expect)) == 0, "connect req golden bytes");
}

// ---- VerifyAccountReq 的完整線路佈局 golden（SERV_INT_INTERNAL JP 組合）----
static void TestVerifyAccountReqGolden()
{
    VerifyAccountReq req;
    req.debugAuth = true;
    req.userID = L"u";
    req.passwd = L"p";
    req.hwid = L"h";
    req.machineID = "mid";
    req.channelRandomKey = 0x01020304;
    const char sn[12] = { 'A','B','C','D','E','F','G','H','I','J','K','L' };
    std::memcpy(req.serverSN, sn, 12);
    req.channelingCode = 0x05060708;
    req.manualLogin = true;

    Serializer ks;
    SerBuffer buf;
    CHECK(ks.BeginWriting(&buf), "begin");
    CHECK(PutVerifyAccountReq(ks, req), "put");
    ks.EndWriting();

    // 預期：debugAuth(1) | wstring u/p/h（各 4+2） | string mid（4+3） | chRandomKey(4) | SN(12) | chCode(4) | manualLogin(1)
    std::vector<uint8_t> expect = {
        0x01,                                       // debugAuth = true
        0x00,0x00,0x00,0x02, 0x75,0x00,             // "u"
        0x00,0x00,0x00,0x02, 0x70,0x00,             // "p"
        0x00,0x00,0x00,0x02, 0x68,0x00,             // "h"
        0x00,0x00,0x00,0x03, 0x6D,0x69,0x64,       // "mid"
        0x01,0x02,0x03,0x04,                        // channelRandomKey (BE)
        0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48,0x49,0x4A,0x4B,0x4C,  // serverSN 12 bytes raw
        0x05,0x06,0x07,0x08,                        // channelingCode (BE)
        0x01                                        // manualLogin
    };
    CHECK(buf.GetLength() == expect.size(), "verify req byte length");
    CHECK(std::memcmp(buf.GetData(), expect.data(), expect.size()) == 0, "verify req golden bytes");

    // roundtrip
    Serializer ks2;
    SerBuffer tmp = buf;
    VerifyAccountReq back;
    CHECK(ks2.BeginReading(&tmp), "begin read");
    CHECK(GetVerifyAccountReq(ks2, back), "get");
    ks2.EndReading();
    CHECK(back.debugAuth == true, "rt debugAuth");
    CHECK(back.userID == L"u" && back.passwd == L"p" && back.hwid == L"h", "rt strings");
    CHECK(back.machineID == "mid", "rt machineID");
    CHECK(back.channelRandomKey == 0x01020304, "rt channelRandomKey");
    CHECK(std::memcmp(back.serverSN, sn, 12) == 0, "rt serverSN");
    CHECK(back.channelingCode == 0x05060708, "rt channelingCode");
    CHECK(back.manualLogin == true, "rt manualLogin");
}

static void TestVerifyAccountAckRoundTrip()
{
    VerifyAccountAck ack;
    ack.iOK = NET_OK;
    ack.accountInfo.userUID = 0x1122334455667788LL;
    ack.accountInfo.id = L"warrior99";
    ack.accountInfo.name = L"warrior99";
    ack.accountInfo.authLevel = 3;
    ack.accountInfo.internalUser = false;
    ack.accountInfo.option.playGuide = true;
    ack.accountInfo.blockInfo.endTime = L"";
    ack.accountInfo.blockInfo.blockReason = L"";
    ack.accountInfo.isRecommend = true;
    ack.accountInfo.isGuestUser = false;
    ack.accountInfo.otp = L"OTP123";
    ack.accountInfo.lastLogin = L"2014-03-08 12:00:00";
    ack.accountInfo.channelRandomKey = 0x0A0B0C0D;
    ack.hackingUserType = 7;
    ack.adURL = L"https://example.invalid/ad";
    ack.sex = true;
    ack.age = 25;
    ack.nexonSN = 987654321;
    ack.clientIP = L"203.0.113.7";
    ack.channelCode = 3;
    ack.channelUserID = L"tooni_user";

    Serializer ks;
    SerBuffer buf;
    CHECK(ks.BeginWriting(&buf), "begin");
    CHECK(PutVerifyAccountAck(ks, ack), "put");
    ks.EndWriting();

    Serializer ks2;
    SerBuffer tmp = buf;
    VerifyAccountAck back;
    CHECK(ks2.BeginReading(&tmp), "begin read");
    CHECK(GetVerifyAccountAck(ks2, back), "get");
    ks2.EndReading();
    CHECK(back.iOK == NET_OK, "rt iOK");
    CHECK(back.accountInfo.userUID == ack.accountInfo.userUID, "rt userUID");
    CHECK(back.accountInfo.id == L"warrior99" && back.accountInfo.name == L"warrior99", "rt id/name");
    CHECK(back.accountInfo.authLevel == 3 && back.accountInfo.option.playGuide == true, "rt authLevel/guide");
    CHECK(back.accountInfo.isRecommend == true && back.accountInfo.isGuestUser == false, "rt flags");
    CHECK(back.accountInfo.otp == L"OTP123" && back.accountInfo.lastLogin == L"2014-03-08 12:00:00", "rt otp/lastLogin");
    CHECK(back.accountInfo.channelRandomKey == 0x0A0B0C0D, "rt ack channelRandomKey");
    CHECK(back.hackingUserType == 7, "rt hackingUserType");
    CHECK(back.adURL == L"https://example.invalid/ad", "rt adURL");
    CHECK(back.sex == true && back.age == 25 && back.nexonSN == 987654321, "rt sex/age/nexonSN");
    CHECK(back.clientIP == L"203.0.113.7", "rt clientIP");
    CHECK(back.channelCode == 3 && back.channelUserID == L"tooni_user", "rt channel fields");
}

static void TestConnectArb()
{
    LoginConfig cfg;
    cfg.mainVersion = L"9.9.9-test";
    cfg.udpPort = 6000;
    cfg.channelId = 4242;
    cfg.maxUser = 100;
    cfg.nowUser = 0;

    ConnectReq req;
    req.version = L"8.8.8-other";
    ConnectAck ack;
    CHECK(!LoginArbiter::HandleConnectReq(req, ack, cfg), "version mismatch rejected");
    CHECK(ack.iOK == ERR_CONNECT_00, "version mismatch -> ERR_CONNECT_00");

    req.version = L"9.9.9-test";
    CHECK(LoginArbiter::HandleConnectReq(req, ack, cfg), "accepted");
    CHECK(ack.iOK == NET_OK && ack.udpPort == 6000 && ack.channelId == 4242, "ack propagates config");

    cfg.nowUser = 100;
    cfg.maxUser = 100;
    CHECK(!LoginArbiter::HandleConnectReq(req, ack, cfg), "full server rejected");
    CHECK(ack.iOK == ERR_CONNECT_04, "full server -> ERR_CONNECT_04");
}

static void TestVerifyArbLocalDb()
{
    Database db;
    std::string err;
    CHECK(db.Open(":memory:", err), "open memory db");
    CHECK(ApplyMigrations(db, err), "migrate");
    UserStore users(db);
    CHECK(users.CreateUser("slicedancer", "pw123!", "M", err), "seed user");
    // 讓 Grade 可觀察（AuthLevel 的本地對應）
    {
        Statement st;
        CHECK(st.Prepare(db, "UPDATE users SET Grade = 5 WHERE Login = 'slicedancer';", err), "prep grade");
        std::string e;
        CHECK(!st.StepRow(e) && e.empty(), "grade set");
    }

    VerifyAccountReq req;
    req.userID = L"slicedancer";
    req.passwd = L"pw123!";
    req.channelRandomKey = 0x11223344;
    VerifyAccountAck ack;
    int rc = LoginArbiter::HandleVerifyAccountReq(users, req, "203.0.113.9", ack);
    CHECK(rc == NET_OK, "valid credentials accepted");
    CHECK(ack.accountInfo.userUID >= 1, "userUID from DB");
    CHECK(ack.accountInfo.authLevel == 5, "authLevel <- Grade");
    CHECK(ack.accountInfo.channelRandomKey == 0x11223344, "channelRandomKey echoed");
    CHECK(ack.clientIP == L"203.0.113.9", "clientIp recorded");

    // RecordLogin 已套用？
    bool found = false;
    UserRecord rec;
    CHECK(users.FindUser("slicedancer", rec, found, err), "find after login");
    CHECK(found && rec.connecting, "connecting set after auth");
    CHECK(rec.ipAddress == "203.0.113.9", "ip recorded after auth");

    // 錯誤密碼 / 不存在帳號
    req.passwd = L"nope";
    rc = LoginArbiter::HandleVerifyAccountReq(users, req, "203.0.113.9", ack);
    CHECK(rc == ERR_VERIFY_06, "wrong password -> ERR_VERIFY_06");

    req.userID = L"ghostuser";
    req.passwd = L"pw123!";
    rc = LoginArbiter::HandleVerifyAccountReq(users, req, "203.0.113.9", ack);
    CHECK(rc == ERR_VERIFY_04, "unknown user -> ERR_VERIFY_04");
}

// ---- loopback 完整流程（需 POSIX + temp file DB）----
static void TestLoginSliceLoopback()
{
#if !X2_PLATFORM_POSIX
    return;
#else
    const std::wstring kVersion = L"9.9.9-test";
    char tmpl[] = "/tmp/x2_logintest_XXXXXX";
    int fd = mkstemp(tmpl);
    CHECK(fd >= 0, "mkstemp db path");
    if (fd < 0) return;
    ::close(fd);
    const std::string dbPath = tmpl;
    ::unlink(dbPath.c_str());   // 讓 SQLite 自己建立，避免 open 舊檔

    // 預置帳號
    {
        Database db;
        std::string err;
        CHECK(db.Open(dbPath, err), "open db for seeding");
        CHECK(ApplyMigrations(db, err), "migrate for seeding");
        UserStore users(db);
        CHECK(users.CreateUser("slicedancer", "pw123!", "M", err), "seed user");
    }

    uint16_t port = 0;
    {
        Socket probe;
        if (!Socket::CreateTcp(probe)) { ::unlink(dbPath.c_str()); CHECK(false, "probe socket"); return; }
        if (!probe.Bind(0) || !probe.LocalPort(port) || port == 0) { probe.Close(); ::unlink(dbPath.c_str()); CHECK(false, "probe port"); return; }
        probe.Close();
    }

    std::atomic<bool> serverOk{false};
    std::atomic<bool> serverDbWriteOk{false};
    std::thread srvThread([&]() {
        Database db;
        std::string err;
        if (!db.Open(dbPath, err)) return;
        if (!ApplyMigrations(db, err)) return;
        UserStore users(db);

        Session srv(PerformerID::PI_GS_SERVER);
        if (!srv.ListenAndAccept(port)) return;
        if (!srv.SendSecurityHandshake()) return;

        LoginConfig cfg;
        cfg.mainVersion = kVersion;
        cfg.udpPort = 6000;
        cfg.channelId = 4242;

        for (int i = 0; i < 3; ++i) {
            Event ev;
            if (srv.RecvEvent(ev, 5000) != Session::RecvResult::Event) return;
            Serializer ks;
            if (ev.eventID == kConnectReqID) {
                if (!ks.BeginReading(&ev.payload)) return;
                ConnectReq req;
                if (!GetConnectReq(ks, req)) return;
                ks.EndReading();
                ConnectAck ack;
                LoginArbiter::HandleConnectReq(req, ack, cfg);
                SerBuffer payload = PutPayload([&ack](Serializer& s) { return PutConnectAck(s, ack); });
                if (!srv.SendEvent(MakeEvent(kConnectAckID, payload))) return;
            } else if (ev.eventID == kVerifyReqID) {
                if (!ks.BeginReading(&ev.payload)) return;
                VerifyAccountReq req;
                if (!GetVerifyAccountReq(ks, req)) return;
                ks.EndReading();
                VerifyAccountAck ack;
                LoginArbiter::HandleVerifyAccountReq(users, req, "127.0.0.1", ack);
                if (ack.iOK == NET_OK) serverDbWriteOk = true;
                SerBuffer payload = PutPayload([&ack](Serializer& s) { return PutVerifyAccountAck(s, ack); });
                if (!srv.SendEvent(MakeEvent(kVerifyAckID, payload))) return;
            }
        }
        serverOk = true;
    });

    std::this_thread::sleep_for(std::chrono::milliseconds(200));
    Session client(PerformerID::PI_GS_USER);
    CHECK(client.Connect("127.0.0.1", port), "client connect");
    Event hs;
    CHECK(client.RecvEvent(hs, 5000) == Session::RecvResult::Handshake, "handshake completes");

    // 1) CONNECT_REQ（正確版本）
    {
        ConnectReq req;
        req.version = kVersion;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return PutConnectReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kConnectReqID, payload)), "connect req sent");
        Event ackEv;
        CHECK(client.RecvEvent(ackEv, 5000) == Session::RecvResult::Event, "connect ack received");
        CHECK(ackEv.eventID == kConnectAckID, "connect ack id");
        ConnectAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload), "read ack");
        CHECK(GetConnectAck(ks, ack), "decode ack");
        ks.EndReading();
        CHECK(ack.iOK == NET_OK, "connect accepted");
        CHECK(ack.channelId == 4242 && ack.udpPort == 6000, "connect ack propagates config");
    }

    // 2) VERIFY_ACCOUNT_REQ（錯誤密碼 → ERR_VERIFY_06）
    {
        VerifyAccountReq req;
        req.userID = L"slicedancer";
        req.passwd = L"WRONG";
        req.channelRandomKey = 0x0BADCAFE;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return PutVerifyAccountReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kVerifyReqID, payload)), "verify req (bad) sent");
        Event ackEv;
        CHECK(client.RecvEvent(ackEv, 5000) == Session::RecvResult::Event, "verify ack (bad) received");
        CHECK(ackEv.eventID == kVerifyAckID, "verify ack (bad) id");
        VerifyAccountAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload), "read bad ack");
        CHECK(GetVerifyAccountAck(ks, ack), "decode bad ack");
        ks.EndReading();
        CHECK(ack.iOK == ERR_VERIFY_06, "wrong password -> ERR_VERIFY_06");
    }

    // 3) VERIFY_ACCOUNT_REQ（正確密碼 → NET_OK；server 會 RecordLogin）
    {
        VerifyAccountReq req;
        req.userID = L"slicedancer";
        req.passwd = L"pw123!";
        req.channelRandomKey = 0x0BADCAFE;
        SerBuffer payload = PutPayload([&req](Serializer& s) { return PutVerifyAccountReq(s, req); });
        CHECK(client.SendEvent(MakeEvent(kVerifyReqID, payload)), "verify req (good) sent");
        Event ackEv;
        CHECK(client.RecvEvent(ackEv, 5000) == Session::RecvResult::Event, "verify ack (good) received");
        CHECK(ackEv.eventID == kVerifyAckID, "verify ack (good) id");
        VerifyAccountAck ack;
        Serializer ks;
        CHECK(ks.BeginReading(&ackEv.payload), "read good ack");
        CHECK(GetVerifyAccountAck(ks, ack), "decode good ack");
        ks.EndReading();
        CHECK(ack.iOK == NET_OK, "correct password -> NET_OK");
        CHECK(ack.accountInfo.userUID >= 1, "good ack carries DB userUID");
        CHECK(ack.accountInfo.channelRandomKey == 0x0BADCAFE, "good ack echoes channelRandomKey");
    }

    client.Close();
    srvThread.join();
    CHECK(serverOk.load(), "server completed all three steps");
    CHECK(serverDbWriteOk.load(), "server executed successful auth path");

    // 4) DB 狀態：成功的那次登入應已把 connecting 設為 1、IP 記為 127.0.0.1
    {
        Database db;
        std::string err;
        CHECK(db.Open(dbPath, err), "reopen db");
        UserStore users(db);
        UserRecord rec;
        bool found = false;
        CHECK(users.FindUser("slicedancer", rec, found, err), "find after flow");
        CHECK(found, "user exists");
        CHECK(rec.connecting, "successful auth sets connecting=1");
        CHECK(rec.ipAddress == "127.0.0.1", "successful auth records loopback IP");
    }
    ::unlink(dbPath.c_str());
#endif
}

void RunLoginSliceTestsByRef(int& pass, int& fail)
{
    TestNetErrorValues();
    TestConnectReqGolden();
    TestVerifyAccountReqGolden();
    TestVerifyAccountAckRoundTrip();
    TestConnectArb();
    TestVerifyArbLocalDb();
    TestLoginSliceLoopback();
    pass += g_pass_login;
    fail += g_fail_login;
}
