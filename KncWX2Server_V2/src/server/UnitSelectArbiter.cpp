// UnitSelectArbiter.cpp — 見 UnitSelectArbiter.h 的流程對照
#include "UnitSelectArbiter.h"
#include "ExpTable.h"
#include "StatTable.h"
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
    u.exp = unit.exp;
    u.level = static_cast<uint8_t>(exp_table::CheckLevelUp(1, unit.exp));   // 原碼 SELECT_UNIT 路徑：level ← CheckLevelUp(1, EXP)
    u.nowBaseLevelEXP = exp_table::GetRequireTotalExpbyLevel(u.level);      // 原碼同法（SiKExpTable()->GetRequireTotalExpbyLevel）
    u.nextBaseLevelEXP = exp_table::GetRequireTotalExpbyLevel(static_cast<int>(u.level) + 1);
    // PVP（SERV_PVP_NEW_SYSTEM）：GUnit 無 rating 欄位 → 0
    u.officialMatchCnt = 0; u.rating = 0; u.maxRating = 0; u.rPoint = 0; u.aPoint = 0;
    u.isWinBeforeMatch = false;
    u.rank = 0; u.kFactor = 0.0f; u.isRedistributionUser = false; u.pastSeasonWin = 0;
    u.sPoint = unit.sPoint;
    u.csPoint = 0; u.maxCSPoint = 0; u.csPointEndDate = L"";
    u.straightVictories = 0;
    // 原碼 OnAccountSelectUnitAck：stat ← DB 值 + SiKStatTable()->GetUnitStat(class, level)（查無 → 加 0）
    stat_table::UnitStatInfo sZero;
    stat_table::GetUnitStat(static_cast<int>(u.unitClass), static_cast<int>(u.level), sZero);   // 失敗 → 全 0（原碼同）
    u.stat = { unit.baseHP + static_cast<int32_t>(sZero.hp), unit.atkPhysic + sZero.atkPhysic,
               unit.atkMagic + sZero.atkMagic, unit.defPhysic + sZero.defPhysic,
               unit.defMagic + sZero.defMagic };
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

bool HandleDeleteUnitReq(db::GameStore& gameDb, int64_t userUID, int authLevel,
                         const delete_unit::DeleteUnitReq& req,
                         delete_unit::DeleteUnitAck& ack, std::string& err)
{
    (void)authLevel;  // 原用於 LogDB 分流（SEnum::UAL_NORMAL/UAL_BLOCKED_1）；V2 無 LogDB
    ack = delete_unit::DeleteUnitAck{};
    ack.iUnitUID = req.iUnitUID;

    db::GUnitRecord rec;
    bool found = false;
    if (!gameDb.GetUnitByUID(req.iUnitUID, rec, found, err)) return false;   // 基礎設施錯誤
    if (!found || rec.deleted || rec.userUID != userUID) {
        ack.iOK = ERR_DELETE_UNIT_00;   // 無法找到要刪除的角色（含非本人；原 -1 → ERR_DELETE_UNIT_00）
        err.clear();
        return true;
    }
    // 在刪除前捕捉 SERV_CHAR_LOG 欄位（原碼於刪除前 SELECT，同語意）
    const std::wstring wstrNickName = Utf8ToWide(rec.nickname);
    const uint8_t ucLevel = static_cast<uint8_t>(rec.level);
    const int8_t cUnitClass = static_cast<int8_t>(rec.unitClass);

    if (!gameDb.SoftDeleteUnit(req.iUnitUID, err)) {
        // 已在上方排除「不存在」與「已刪除」；此處僅剩基礎設施錯誤
        ack.iOK = ERR_DELETE_UNIT_05;
        return true;
    }
    ack.iOK = NET_OK;
    ack.uiKNMSerialNum = 0;               // AccountDB GetMessengerSN 未建模；JP VF_INTERNAL 原碼亦跳過 → 0
    ack.iGuildUID = 0;                    // GUILD_TEST 欄位保留；無公會踢出 → 0
    ack.wstrNickName = wstrNickName;
    ack.ucLevel = ucLevel;
    ack.cUnitClass = cUnitClass;
    err.clear();
    return true;
}

bool HandleCheckNicknameReq(db::GameStore& gameDb,
                            const check_nickname::EntryPointCheckNickNameReq& req,
                            check_nickname::EntryPointCheckNickNameAck& ack, std::string& err)
{
    ack = check_nickname::EntryPointCheckNickNameAck{};
    const std::string nick = WideToUtf8(req.wstrNickName);
    if (nick.empty() || nick.size() > 12) {
        ack.iOK = ERR_RESTORE_NICK_NAME_06;   // 暱稱長度錯誤（原 CP_ACP > 12 bytes）
        err.clear();
        return true;
    }
    static const char* const kMarks[] = { ";", "'", "\"", "--", "/*", "*/", "\\" };
    for (const char* m : kMarks) {
        if (nick.find(m) != std::string::npos) {
            ack.iOK = ERR_RESTORE_NICK_NAME_05;   // 非法暱稱（注入標記）
            err.clear();
            return true;
        }
    }
    switch (gameDb.CheckNicknameAvailable(nick, err)) {
    case db::NicknameCheckResult::Available:  ack.iOK = NET_OK; break;
    case db::NicknameCheckResult::Taken:      ack.iOK = ERR_RESTORE_NICK_NAME_02; break;
    case db::NicknameCheckResult::InCooldown: ack.iOK = ERR_RESTORE_NICK_NAME_03; break;
    case db::NicknameCheckResult::DbError:    return false;   // 基礎設施錯誤
    }
    ack.iUnitUID = 0;                 // 原碼未填 → 0
    ack.wstrNickName = req.wstrNickName;   // 回顯
    if (ack.iOK == NET_OK) err.clear();
    return true;
}

bool HandleGetChannelListReq(channel_list::GetChannelListAck& ack)
{
    // V2 無 SiKChannelManager（頻道註冊表）→ 四張表一律空；不查 DB；SGI_SOLES/SGI_GAIA 互換 1st/2nd 對應無從互換
    ack = channel_list::GetChannelListAck{};
    return true;
}

bool HandleCharacterListReq(db::GameStore& gameDb, int64_t userUID, const std::string& userID, int authLevel,
                            character_list::CharacterListAck& ack, std::string& err)
{
    ack = character_list::CharacterListAck{};
    db::GUserRecord guser;
    if (!gameDb.GetOrCreateGUser(userUID, userID, guser, err)) return false;

    std::vector<db::GUnitRecord> units;
    if (!gameDb.ListUnitsByUserUID(userUID, units, err)) return false;

    std::vector<unit::UnitInfo> infos;
    infos.reserve(units.size());
    for (const auto& u : units) {
        unit::UnitInfo info;
        PopulateUnitInfoFromGUnit(userUID, authLevel, u, info);
        infos.push_back(std::move(info));
    }
    // V2 無 server group 設定 → serverGroupID 一律 0（誠實佔位）
    ack.mapServerGroupUnitSlot.clear();
    ack.mapServerGroupUnitSlot.emplace(0, guser.usSize);
    ack.mapServerGroupUnitInfo.clear();
    ack.mapServerGroupUnitInfo.emplace(0, std::move(infos));
    ack.strUserID = Utf8ToWide(userID);
    ack.iOK = NET_OK;
    err.clear();
    return true;
}

bool HandleCreateNewUnitReq(db::GameStore& gameDb, int64_t userUID, int authLevel,
                            const create_unit::CreateNewUnitReq& req,
                            create_unit::CreateUnitAck& ack, std::string& err)
{
    // EGS_ENTRY_POINT 變體：忽略 iServerGroup（V2 單一 game DB）；共用 HandleCreateUnitReq 決策。
    // 無 templet/IsInitNormalJob/PVP-NPC 名閘門（見標頭說明）。
    create_unit::CreateUnitReq sub;
    sub.wstrNickName = req.wstrNickName;
    sub.iClass = req.iClass;
    return HandleCreateUnitReq(gameDb, userUID, authLevel, sub, ack, err);
}

bool HandleEntryPointDeleteUnitReq(db::GameStore& gameDb, int64_t userUID, int authLevel,
                                   const delete_unit::EntryPointDeleteUnitReq& req,
                                   delete_unit::DeleteUnitAck& ack, std::string& err)
{
    // EGS_ENTRY_POINT 變體：忽略 iServerGroup（V2 單一 game DB）；共用 HandleDeleteUnitReq 決策。
    delete_unit::DeleteUnitReq sub;
    sub.iUnitUID = req.iUnitUID;
    sub.iUserUID = req.iUserUID;
    return HandleDeleteUnitReq(gameDb, userUID, authLevel, sub, ack, err);
}

bool HandleChangeNicknameReq(db::GameStore& gameDb, int64_t userUID,
                             const change_nickname::ChangeNickNameReq& req,
                             change_nickname::ChangeNickNameAck& ack, std::string& err)
{
    ack = change_nickname::ChangeNickNameAck{};
    ack.iUnitUID = req.iUnitUID;
    ack.wstrNickName = req.wstrNickName;
    ack.bCheckOnly = req.bCheckOnly;

    const std::string nick = WideToUtf8(req.wstrNickName);
    if (nick.empty() || nick.size() > 12) {
        ack.iOK = ERR_RESTORE_NICK_NAME_06;   // 暱稱長度錯誤
        err.clear();
        return true;
    }
    static const char* const kMarks[] = { ";", "'", "\"", "--", "/*", "*/", "\\" };
    for (const char* m : kMarks) {
        if (nick.find(m) != std::string::npos) {
            ack.iOK = ERR_RESTORE_NICK_NAME_05;   // 非法暱稱（注入標記）
            err.clear();
            return true;
        }
    }
    // 擁有權閘門（V2 加固；原碼未檢查）
    db::GUnitRecord rec;
    bool found = false;
    if (!gameDb.GetUnitByUID(req.iUnitUID, rec, found, err)) return false;
    if (!found || rec.deleted || rec.userUID != userUID) {
        ack.iOK = ERR_RESTORE_NICK_NAME_00;   // 找不到可改名的角色
        err.clear();
        return true;
    }
    if (req.bCheckOnly) {
        switch (gameDb.CheckNicknameAvailable(nick, err, req.iUnitUID)) {
        case db::NicknameCheckResult::Available:  ack.iOK = NET_OK; err.clear(); break;
        case db::NicknameCheckResult::Taken:      ack.iOK = ERR_RESTORE_NICK_NAME_02; err.clear(); break;
        case db::NicknameCheckResult::InCooldown: ack.iOK = ERR_RESTORE_NICK_NAME_03; err.clear(); break;
        case db::NicknameCheckResult::DbError:    return false;
        }
        return true;
    }
    switch (gameDb.ChangeUnitNickname(req.iUnitUID, nick, err)) {
    case db::GameStore::ChangeNicknameResult::Ok:                 ack.iOK = NET_OK; break;
    case db::GameStore::ChangeNicknameResult::UnitNotFoundOrDeleted: ack.iOK = ERR_RESTORE_NICK_NAME_00; break;
    case db::GameStore::ChangeNicknameResult::NotRestorable:      ack.iOK = ERR_RESTORE_NICK_NAME_01; break;
    case db::GameStore::ChangeNicknameResult::Taken:              ack.iOK = ERR_RESTORE_NICK_NAME_02; break;
    case db::GameStore::ChangeNicknameResult::InCooldown:         ack.iOK = ERR_RESTORE_NICK_NAME_03; break;
    case db::GameStore::ChangeNicknameResult::Failure:            ack.iOK = ERR_RESTORE_NICK_NAME_04; break;
    case db::GameStore::ChangeNicknameResult::DbError:            return false;
    }
    if (ack.iOK == NET_OK) err.clear();
    return true;
}

bool HandleEntryPointChangeNicknameReq(db::GameStore& gameDb, int64_t userUID,
                                       const change_nickname::EntryPointChangeNickNameReq& req,
                                       change_nickname::ChangeNickNameAck& ack, std::string& err)
{
    // V2 單一 game DB，忽略 iServerGroup；共用決策（見 HandleChangeNicknameReq 之說明）
    change_nickname::ChangeNickNameReq sub;
    sub.iUnitUID = req.iUnitUID;
    sub.wstrNickName = req.wstrNickName;
    sub.bCheckOnly = req.bCheckOnly;
    return HandleChangeNicknameReq(gameDb, userUID, sub, ack, err);
}

bool HandleGetCreateUnitTodayCountReq(db::GameStore& gameDb, int64_t userUID,
                                      today_count::GetCreateUnitTodayCountAck& ack, std::string& err)
{
    ack = today_count::GetCreateUnitTodayCountAck{};
    int count = 0;
    if (!gameDb.CountUnitsCreatedTodayByUser(userUID, count, err)) return false;
    ack.iUserUID = userUID;
    ack.mapCreateCharCountToday.clear();
    // V2 無 server group 設定 → serverGroupID 一律 0（誠實佔位；原碼以 KBaseServer::GetKObj()->GetServerGroupID() 取得）
    ack.mapCreateCharCountToday.emplace(0, count);
    err.clear();
    return true;
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
