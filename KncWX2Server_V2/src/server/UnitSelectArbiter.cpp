// UnitSelectArbiter.cpp — 見 UnitSelectArbiter.h 的流程對照
#include "UnitSelectArbiter.h"
#include "../core/NetError.h"

#include <string>

namespace {

// UTF-8 → wstring（僅 ASCII/BMP；非法序列以 U+FFFD 替代）
std::wstring Utf8ToWide(const std::string& in)
{
    std::wstring out;
    out.reserve(in.size());
    for (size_t i = 0; i < in.size();) {
        unsigned char c = static_cast<unsigned char>(in[i]);
        uint32_t cp = 0;
        size_t len = 0;
        if (c < 0x80) { cp = c; len = 1; }
        else if ((c & 0xE0) == 0xC0) { cp = c & 0x1F; len = 2; }
        else if ((c & 0xF0) == 0xE0) { cp = c & 0x0F; len = 3; }
        else if ((c & 0xF8) == 0xF0) { cp = c & 0x07; len = 4; }
        else { cp = 0xFFFD; len = 1; }
        if (i + len > in.size()) { cp = 0xFFFD; len = 1; }
        else if (len > 1) {
            for (size_t j = 1; j < len; ++j)
                cp = (cp << 6) | (static_cast<unsigned char>(in[i + j]) & 0x3F);
        }
        if (cp <= 0xFFFF) out.push_back(static_cast<wchar_t>(cp));
        else if (cp <= 0x10FFFF) {
            cp -= 0x10000;
            out.push_back(static_cast<wchar_t>(0xD800 + (cp >> 10)));
            out.push_back(static_cast<wchar_t>(0xDC00 + (cp & 0x3FF)));
        } else out.push_back(L'\uFFFD');
        i += len;
    }
    return out;
}

// wstring（V2 內部可能是 UTF-32 或 UTF-16；含代理對時成對出現）→ UTF-8
std::string WideToUtf8(const std::wstring& in)
{
    std::string out;
    for (size_t i = 0; i < in.size(); ++i) {
        uint32_t cp = static_cast<uint32_t>(in[i]);
        if (cp >= 0xD800 && cp <= 0xDBFF && i + 1 < in.size()) {
            uint32_t lo = static_cast<uint32_t>(in[i + 1]);
            if (lo >= 0xDC00 && lo <= 0xDFFF) {
                cp = 0x10000u + (((cp - 0xD800) << 10) | (lo - 0xDC00));
                ++i;
            }
        }
        if (cp < 0x80) {
            out.push_back(static_cast<char>(cp));
        } else if (cp < 0x800) {
            out.push_back(static_cast<char>(0xC0 | (cp >> 6)));
            out.push_back(static_cast<char>(0x80 | (cp & 0x3F)));
        } else if (cp < 0x10000) {
            out.push_back(static_cast<char>(0xE0 | (cp >> 12)));
            out.push_back(static_cast<char>(0x80 | ((cp >> 6) & 0x3F)));
            out.push_back(static_cast<char>(0x80 | (cp & 0x3F)));
        } else {
            out.push_back(static_cast<char>(0xF0 | (cp >> 18)));
            out.push_back(static_cast<char>(0x80 | ((cp >> 12) & 0x3F)));
            out.push_back(static_cast<char>(0x80 | ((cp >> 6) & 0x3F)));
            out.push_back(static_cast<char>(0x80 | (cp & 0x3F)));
        }
    }
    return out;
}

} // namespace

namespace x2 { namespace select_unit {

void BuildSelectUnitNot5(SelectUnitNot5& out)
{
    out = SelectUnitNot5{};
    out.iOK = NET_OK;
    // bIsSpiritUpdated / mapCharGameCount / kPShopAgencyInfo / packetHenirRewardCount / …：
    // 無資料來源 → 全 false/0/空容器（誠實佔位）
}

void BuildSelectUnitNot4(SelectUnitNot4& out)
{
    out = SelectUnitNot4{};
    out.iOK = NET_OK;
    // vecChatBlackList / kDenyOptions / vecTutorialDBUnitInfo / …：無資料來源 → 全預設（誠實佔位）
}

void BuildSelectUnitNot3(SelectUnitNot3& out)
{
    out = SelectUnitNot3{};
    out.iOK = NET_OK;
    // vecMission / vecTitle / vecPetList / …：無資料來源 → 空容器、iSummonedPetUID=0（誠實佔位）
}

void BuildSelectUnitNot2(SelectUnitNot2& out)
{
    out = SelectUnitNot2{};
    out.iOK = NET_OK;
    // vecQuest / vecCompletQuest / mapRandomQuestList：無資料來源 → 空容器（誠實佔位）
}

void PopulateUnitInfoFromGUnit(int64_t userUID, int authLevel, const db::GUnitRecord& unit,
                               unit::UnitInfo& u)
{
    u = unit::UnitInfo{};
    u.ownerUserUID = userUID;
    u.authLevel = static_cast<int8_t>(authLevel);
    u.unitUID = unit.unitUID;
    u.knmSerialNum = 0;                             // 無資料來源（原 m_uiKNMSerialNum）
    u.unitClass = static_cast<int8_t>(unit.unitClass);
    u.nickName = Utf8ToWide(unit.nickname);
    u.ip = L"";
    u.port = 0;
    u.ed = 0;                                       // GUnit 無 ED 欄位；GamePoint 無對應 wire 槽，刻意不映射
    u.level = static_cast<uint8_t>(unit.level);
    u.exp = unit.exp;
    // PVP（SERV_PVP_NEW_SYSTEM）：GUnit 無 rating 欄位 → 0
    u.officialMatchCnt = 0; u.rating = 0; u.maxRating = 0; u.rPoint = 0; u.aPoint = 0;
    u.isWinBeforeMatch = false;
    u.rank = 0; u.kFactor = 0.0f; u.isRedistributionUser = false; u.pastSeasonWin = 0;
    u.sPoint = unit.sPoint;
    u.csPoint = 0; u.maxCSPoint = 0; u.csPointEndDate = L"";
    u.nowBaseLevelEXP = 0; u.nextBaseLevelEXP = 0; u.straightVictories = 0;
    u.stat = { unit.baseHP, unit.atkPhysic, unit.atkMagic, unit.defPhysic, unit.defMagic };
    u.gameStat = u.stat;                            // 無獨立 GameStat 來源，鏡射 Stat（誠實佔位）
    u.lastPos = { unit.lastPosition, 0, 0, false }; // lastPos.mapID ← GUnit.LastPosition
    // buffInfo / dungeonClear / tcClear / equippedItem：無對應表，保持空容器
    u.win = unit.win;
    u.lose = unit.lose;
    u.unitSkillData = unit::UnitSkillData{};        // 全預設（pages 1/1、槽位 0）
    u.isParty = false;
    u.spiritMax = 0; u.spirit = 0;                  // GUnit 無 spirit 欄位
    u.isGameBang = false;
    u.titleID = 0;
    u.userGuildInfo = unit::UserGuildInfo{};
    u.lastLoginTime = Utf8ToWide(unit.lastDate);
}

void BuildSelectUnitNot1(int64_t userUID, int authLevel, const db::GUnitRecord& unit,
                         SelectUnitNot1& out)
{
    out = SelectUnitNot1{};
    out.iOK = NET_OK;

    PopulateUnitInfoFromGUnit(userUID, authLevel, unit, out.unitInfo);

    out.unitCreateDate = Utf8ToWide(unit.regDate);  // SERV_CHAR_LOG
    out.realDataED = 0;                             // SERV_LOGOUT_ED_CHECK（無資料來源）
    out.unitLastLoginDate = Utf8ToWide(unit.lastDate);  // SERV_DAILY_CHAR_FIRST_SELECT
    // inventorySlotSize / items / resStone：無對應表 → 空/0
    out.vecUserSkillPageData.push_back(unit::UserSkillPageData{});  // 一頁全預設（pages 1/1 一致）
    // vecSkillUnsealed / mapSkillNote：空；skillNoteMaxPageNum = 0
    out.relationshipInfo = unit::RelationshipInfo{};  // 無伴侶 → 全預設
}

bool HandleMyUnitAndInventoryInfoListReq(db::GameStore& gameDb, int64_t userUID, const std::string& userID,
                                         int authLevel,
                                         unit_list::MyUnitAndInventoryInfoListAck& ack,
                                         std::string& err)
{
    ack = unit_list::MyUnitAndInventoryInfoListAck{};
    db::GUserRecord guser;
    if (!gameDb.GetOrCreateGUser(userUID, userID, guser, err)) return false;
    ack.nUnitSlot = guser.usSize;
    std::vector<db::GUnitRecord> units;
    if (!gameDb.ListUnitsByUserUID(userUID, units, err)) return false;
    for (const auto& u : units) {
        unit::UnitInfo info;
        PopulateUnitInfoFromGUnit(userUID, authLevel, u, info);
        ack.vecUnitInfo.push_back(std::move(info));
    }
    ack.iOK = NET_OK;
    return true;
}

size_t HandleGetMyInventoryReq(const std::map<int64_t, unit::InventoryItemInfo>& items,
                               GetMyInventoryAck& outAck,
                               std::vector<SelectUnitInventoryInfoNot>& outNots)
{
    outNots.clear();
    // 依 slotCategory 分組（map<int32, map<int64, InventoryItemInfo>>），與原版「每 category 一個 NOT」一致
    std::map<int32_t, std::map<int64_t, unit::InventoryItemInfo>> byCategory;
    for (const auto& kv : items) byCategory[kv.second.slotCategory][kv.first] = kv.second;
    for (const auto& cat : byCategory) {
        if (cat.second.empty()) continue;   // 空 category 不送（原版亦如此）
        SelectUnitInventoryInfoNot one;
        one.iSlotCategory = cat.first;
        one.mapItem = cat.second;
        outNots.push_back(std::move(one));
    }
    outAck.iOK = NET_OK;
    outAck.bIsRecommend = false;            // V2 無推薦系統狀態（誠實佔位）
    return outNots.size();
}

bool HandleCreateUnitReq(db::GameStore& gameDb, int64_t userUID, int authLevel,
                         const create_unit::CreateUnitReq& req,
                         create_unit::CreateUnitAck& ack, std::string& err)
{
    ack = create_unit::CreateUnitAck{};
    const std::string nick = WideToUtf8(req.wstrNickName);
    if (nick.empty() || nick.size() > 12) {
        ack.iOK = ERR_CREATE_UNIT_04;      // 暱稱長度錯誤（原 CP_ACP > 12 bytes）
        err.clear();
        return true;                        // 決策性失敗（非基礎設施錯誤）：仍送 ACK
    }
    // KODBC 注入標記（比照原版 IsInvalidMarkIn 的常見集合；V2 無 KODBC 模組）
    static const char* const kMarks[] = { ";", "'", "\"", "--", "/*", "*/", "\\" };
    for (const char* m : kMarks) {
        if (nick.find(m) != std::string::npos) {
            ack.iOK = ERR_CREATE_UNIT_08;  // 無法使用的暱稱
            err.clear();
            return true;
        }
    }
    int64_t unitUID = 0;
    const auto result = gameDb.CreateUnit(userUID, nick, req.iClass, unitUID, err);
    switch (result) {
    case db::CreateUnitResult::Ok: break;
    case db::CreateUnitResult::UserNotFoundOrDeleted: ack.iOK = ERR_CREATE_UNIT_00; return true;
    case db::CreateUnitResult::NicknameTaken:         ack.iOK = ERR_CREATE_UNIT_01; return true;
    case db::CreateUnitResult::CapacityReached:       ack.iOK = ERR_CREATE_UNIT_05; return true;
    case db::CreateUnitResult::NicknameInCooldown:    ack.iOK = ERR_CREATE_UNIT_06; return true;
    case db::CreateUnitResult::DbError:               ack.iOK = ERR_CREATE_UNIT_02; return true;  // err 有訊息
    }
    db::GUnitRecord rec;
    bool found = false;
    if (!gameDb.GetUnitByUID(unitUID, rec, found, err) || !found) {
        ack.iOK = ERR_CREATE_UNIT_03;      // 建立後讀不回（理論上不該發生）
        if (err.empty()) err = "unit vanished right after create";
        return true;
    }
    PopulateUnitInfoFromGUnit(userUID, authLevel, rec, ack.kUnitInfo);
    ack.vecSkillSlot.clear();              // 原由 AccountDB 填；V2 空（誠實佔位）
    ack.wstrEnableDate = L"";              // 原由 AccountDB 填；V2 空（誠實佔位）
    ack.iOK = NET_OK;
    err.clear();
    return true;
}

int32_t HandleSelectUnitReq(db::GameStore& gameDb, int64_t userUID, const SelectUnitReq& req,
                            SelectUnitAck& ack, std::string& err,
                            bool secondSecurityOk,
                            db::GUnitRecord* outUnit,
                            SelectUnitNot1* outNot1,
                            int authLevel,
                            SelectUnitNot2* outNot2,
                            SelectUnitNot3* outNot3,
                            SelectUnitNot4* outNot4,
                            SelectUnitNot5* outNot5)
{
    // 0) 二級密碼閘門（對應 GSUserGameCommon 的 SERV_SECOND_SECURITY 檢查）
    if (!secondSecurityOk) {
        ack.iOK = ERR_VERIFY_21;
        err.clear();
        return ack.iOK;
    }

    // 1) 基本合法性（負值/0 視為非法選擇，防掃描）
    if (req.unitUID <= 0 || userUID <= 0) {
        ack.iOK = ERR_SELECT_UNIT_07;
        err.clear();
        return ack.iOK;
    }

    // 2) 讀取角色
    bool found = false;
    db::GUnitRecord unit;
    if (!gameDb.GetUnitByUID(req.unitUID, unit, found, err)) {
        err = std::string("game db error on unit select: ") + err;
        ack.iOK = ERR_SELECT_UNIT_05;
        return ack.iOK;
    }

    // 不存在或已刪除 → 視為「此伺服器上沒有該角色」（不洩漏刪除狀態）
    if (!found || unit.deleted) {
        ack.iOK = ERR_SELECT_UNIT_00;
        err.clear();
        return ack.iOK;
    }

    // 3) 歸屬檢查：UnitUID 屬於別人（對應原版 SERV_POST_COPY_BUG_FIX 的 ERR_SELECT_UNIT_07 路徑）
    if (unit.userUID != userUID) {
        ack.iOK = ERR_SELECT_UNIT_07;
        err = "unit ownership mismatch: unitUID belongs to another account";
        return ack.iOK;
    }

    // 4) 成功：角色登入副作用（LoginCount+1、LastDate=now）
    if (!gameDb.RecordUnitLogin(req.unitUID, err)) {
        err = std::string("game db error recording unit login: ") + err;
        ack.iOK = ERR_SELECT_UNIT_05;
        return ack.iOK;
    }
    // RecordUnitLogin 後重讀一次，讓呼叫端拿到含最新 LoginCount 的記錄
    if (outUnit || outNot1 || outNot2 || outNot3 || outNot4 || outNot5) {
        db::GUnitRecord tmp;
        db::GUnitRecord& uRef = outUnit ? *outUnit : tmp;
        bool found2 = false;
        if (!gameDb.GetUnitByUID(req.unitUID, uRef, found2, err) || !found2) {
            // 記錄剛寫過卻讀不回：視為 DB 錯誤（誠實失敗，不假裝成功）
            if (err.empty()) err = "unit vanished between RecordUnitLogin and re-read";
            ack.iOK = ERR_SELECT_UNIT_05;
            return ack.iOK;
        }
        if (outNot1) BuildSelectUnitNot1(userUID, authLevel, uRef, *outNot1);
    }
    if (outNot2) BuildSelectUnitNot2(*outNot2);
    if (outNot3) BuildSelectUnitNot3(*outNot3);
    if (outNot4) BuildSelectUnitNot4(*outNot4);
    if (outNot5) BuildSelectUnitNot5(*outNot5);

    ack.iOK = NET_OK;
    err.clear();
    return ack.iOK;
}

}} // namespace x2::select_unit
