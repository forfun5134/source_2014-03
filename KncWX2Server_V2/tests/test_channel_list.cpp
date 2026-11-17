// tests/test_channel_list.cpp — EGS_ENTRY_POINT_GET_CHANNEL_LIST_REQ(1166, NOPARAM) / EGS_ENTRY_POINT_GET_CHANNEL_LIST_ACK(1167) 測試
// 涵蓋：REQ 空酬載 no-op roundtrip、ChannelInfo / ChannelBonusInfo codec roundtrip、ACK codec roundtrip（四張表各含 1-2 項）、決策層（空表）。
// ⚠ wire 自洽，未對原 SDK 實機驗證；V2 無 SiKChannelManager → 決策層回四張空表（見 EntryPointChannelListProtocol.h）。
#include <cstdio>
#include <cstring>
#include <string>
#include <map>
#include <functional>

#include "../src/core/Serializer.h"
#include "../src/server/EntryPointChannelListProtocol.h"
#include "../src/server/UnitSelectArbiter.h"

using namespace x2;
using namespace x2::channel_list;
using namespace x2::select_unit;

void RunChannelListTestsByRef(int& pass, int& fail);
static int g_pass_ch = 0, g_fail_ch = 0;
#define CHECK(cond, name) do { \
    if (cond) { g_pass_ch++; } \
    else { g_fail_ch++; std::printf("FAIL: %s (line %d)\n", name, __LINE__); } \
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

static void TestChannelCodec()
{
    ChannelInfo ci;
    ci.iServerUID = 101; ci.iChannelID = 1; ci.wstrChannelName = L"古老頻道";
    ci.iServerGroupID = 1; ci.wstrIP = L"192.168.0.1";
    ci.usMasterPort = 7000; ci.usNCUDPPort = 7001;
    ci.iMaxUser = 300; ci.iCurrentUser = 42; ci.iCurPartyCount = 5; ci.iPlayGamePartyCount = 2;
    SerBuffer ciBuf = PutPayload([&ci](Serializer& s) { return PutChannelInfo(s, ci); });
    {
        Serializer ks;
        SerBuffer tmp = ciBuf;
        ChannelInfo out;
        CHECK(ks.BeginReading(&tmp) && GetChannelInfo(ks, out), "channelInfo decodes");
        ks.EndReading();
        CHECK(out.iServerUID == 101 && out.iChannelID == 1 && out.wstrChannelName == L"古老頻道", "channelInfo rt 1");
        CHECK(out.usMasterPort == 7000 && out.usNCUDPPort == 7001 && out.iMaxUser == 300 && out.iCurrentUser == 42, "channelInfo rt 2");
        CHECK(out.iCurPartyCount == 5 && out.iPlayGamePartyCount == 2 && out.iServerGroupID == 1 && out.wstrIP == L"192.168.0.1", "channelInfo rt 3");
    }
    ChannelBonusInfo bi;
    bi.bEnable = true; bi.iBeginLv = 1; bi.iEndLv = 10; bi.iPerExp = 50; bi.iPerED = 25;
    SerBuffer biBuf = PutPayload([&bi](Serializer& s) { return PutChannelBonusInfo(s, bi); });
    {
        Serializer ks;
        SerBuffer tmp = biBuf;
        ChannelBonusInfo out;
        CHECK(ks.BeginReading(&tmp) && GetChannelBonusInfo(ks, out), "bonusInfo decodes");
        ks.EndReading();
        CHECK(out.bEnable && out.iBeginLv == 1 && out.iEndLv == 10 && out.iPerExp == 50 && out.iPerED == 25, "bonusInfo rt");
    }
}

static void TestChannelListAck()
{
    GetChannelListReq req;
    SerBuffer reqBuf = PutPayload([&req](Serializer& s) { return PutGetChannelListReq(s, req); });
    CHECK(reqBuf.GetLength() == 0, "channelListReq empty payload");

    GetChannelListAck ack;
    ChannelInfo soles = {};
    soles.iServerUID = 1; soles.iChannelID = 1; soles.wstrChannelName = L"曙光"; soles.iServerGroupID = 1;
    ChannelInfo gaia = {};
    gaia.iServerUID = 2; gaia.iChannelID = 1; gaia.wstrChannelName = L"Gaia"; gaia.iServerGroupID = 2;
    ack.mapSolesChannelList = { { 1, soles } };
    ack.mapGaiaChannelList = { { 2, gaia } };
    ChannelBonusInfo b; b.bEnable = true; b.iBeginLv = 1; b.iEndLv = 99; b.iPerExp = 10; b.iPerED = 10;
    ack.mapSolesChannelBonusList = { { 1, b } };
    ack.mapGaiaChannelBonusList = { { 2, b } };
    SerBuffer buf = PutPayload([&ack](Serializer& s) { return PutGetChannelListAck(s, ack); });
    CHECK(buf.GetLength() > 0, "ack encodes");
    {
        Serializer ks;
        SerBuffer tmp = buf;
        GetChannelListAck aOut;
        CHECK(ks.BeginReading(&tmp) && GetGetChannelListAck(ks, aOut), "ack decodes");
        ks.EndReading();
        CHECK(aOut.mapSolesChannelList.size() == 1 && aOut.mapSolesChannelList.at(1).wstrChannelName == L"曙光", "soles list rt");
        CHECK(aOut.mapGaiaChannelList.size() == 1 && aOut.mapGaiaChannelList.at(2).wstrChannelName == L"Gaia", "gaia list rt");
        CHECK(aOut.mapSolesChannelBonusList.size() == 1 && aOut.mapSolesChannelBonusList.at(1).iPerExp == 10, "soles bonus rt");
        CHECK(aOut.mapGaiaChannelBonusList.size() == 1 && aOut.mapGaiaChannelBonusList.at(2).bEnable, "gaia bonus rt");
    }
}

static void TestHandleGetChannelListReq()
{
    GetChannelListAck ack;
    CHECK(HandleGetChannelListReq(ack), "handler returns true");
    CHECK(ack.mapSolesChannelList.empty() && ack.mapGaiaChannelList.empty(), "channel lists empty (no registry)");
    CHECK(ack.mapSolesChannelBonusList.empty() && ack.mapGaiaChannelBonusList.empty(), "bonus lists empty (no registry)");
}

void RunChannelListTestsByRef(int& pass, int& fail)
{
    TestChannelCodec();
    TestChannelListAck();
    TestHandleGetChannelListReq();
    pass += g_pass_ch;
    fail += g_fail_ch;
}
