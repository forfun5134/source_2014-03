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

} // namespace

namespace x2 { namespace select_unit {

void BuildSelectUnitNot2(SelectUnitNot2& out)
{
    out = SelectUnitNot2{};
    out.iOK = NET_OK;
    // vecQuest / vecCompletQuest / mapRandomQuestList：無資料來源 → 空容器（誠實佔位）
}

void BuildSelectUnitNot1(int64_t userUID, int authLevel, const db::GUnitRecord& unit,
                         SelectUnitNot1& out)
{
    out = SelectUnitNot1{};
    out.iOK = NET_OK;

    auto& u = out.unitInfo;
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

    out.unitCreateDate = Utf8ToWide(unit.regDate);  // SERV_CHAR_LOG
    out.realDataED = 0;                             // SERV_LOGOUT_ED_CHECK（無資料來源）
    out.unitLastLoginDate = Utf8ToWide(unit.lastDate);  // SERV_DAILY_CHAR_FIRST_SELECT
    // inventorySlotSize / items / resStone：無對應表 → 空/0
    out.vecUserSkillPageData.push_back(unit::UserSkillPageData{});  // 一頁全預設（pages 1/1 一致）
    // vecSkillUnsealed / mapSkillNote：空；skillNoteMaxPageNum = 0
    out.relationshipInfo = unit::RelationshipInfo{};  // 無伴侶 → 全預設
}

int32_t HandleSelectUnitReq(db::GameStore& gameDb, int64_t userUID, const SelectUnitReq& req,
                            SelectUnitAck& ack, std::string& err,
                            bool secondSecurityOk,
                            db::GUnitRecord* outUnit,
                            SelectUnitNot1* outNot1,
                            int authLevel,
                            SelectUnitNot2* outNot2)
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
    if (outUnit || outNot1 || outNot2) {
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

    ack.iOK = NET_OK;
    err.clear();
    return ack.iOK;
}

}} // namespace x2::select_unit
