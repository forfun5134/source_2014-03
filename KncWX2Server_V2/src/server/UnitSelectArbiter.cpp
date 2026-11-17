// UnitSelectArbiter.cpp — 見 UnitSelectArbiter.h 的流程對照
#include "UnitSelectArbiter.h"
#include "ExpTable.h"
#include "StatTable.h"
#include "StringFilter.h"
#include "UnitTemplet.h"
#include "PvpNpcNames.h"
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

void BuildSelectUnitNot5(SelectUnitNot5& out, const db::SpiritValues* spiritValues)
{
    out = SelectUnitNot5{};
    out.iOK = NET_OK;
    // bIsSpiritUpdated ← GSpirit.Flag（原 gup_get_unit_info_by_unituid 以 `@iAllSpirit = Flag` 讀出、
    //   經 KDBE_SELECT_UNIT_ACK 原樣轉發；Flag != 0 → true）。spiritValues == nullptr → false（list 路徑/未讀回）。
    out.bIsSpiritUpdated = spiritValues ? (spiritValues->flag != 0) : false;
    // mapCharGameCount（gup_get_Character_Count / P_GCharacter_Count_SEL——proc 不在倉庫，GCharacterLog 表亦無）
    // kPShopAgencyInfo（P_GPShopInfo_SEL_ShopCheck——proc/表不在倉庫）
    // packetHenirRewardCount（gup_get_henir_reward_cnt / P_GHenirRewardCnt_SEL——proc/表不在倉庫）
    // bCashShopOpen / bFirstSelect / bLocalRankingUser：runtime／帳號級（V2 無帳號 DB）→ false（誠實佔位）
}

void BuildSelectUnitNot4(SelectUnitNot4& out, const db::DenyOptionValues& denyOptions,
                         const std::vector<db::BlacklistRecord>& blacklist,
                         const std::vector<db::TutorRecord>& tutor,
                         const std::vector<db::ConnectTimeEventRecord>& connectTimeEvents,
                         int64_t recommendUnitUID)
{
    out = SelectUnitNot4{};
    out.iOK = NET_OK;
    // iRecommendUnitUID ← GRecommend.OldUID（原 gup_get_unit_info_by_unituid：`SELECT @iOldUID = OldUID
    //   FROM GRecommend WHERE NewUID = @iUnitUID_`；缺列 → 0）。
    // bIsRecommend：原碼 ← 帳號級 IsRecommend()（KUserRecommendManager；帳號 DB 源）——V2 無帳號 DB → false（誠實佔位，見 docs §0a15）
    out.iRecommendUnitUID = recommendUnitUID;
    // vecChatBlackList ← gblacklist（原 gup_select_blacklist；NickName NULL → 空字串；kUnitInfo 對手方實際等級等未建模）
    out.vecChatBlackList.reserve(blacklist.size());
    for (const auto& b : blacklist) {
        unit::ChatBlackListUnit e;
        e.iUnitUID = b.blockUnitUID;
        e.wstrNickName = Utf8ToWide(b.nickname);
        out.vecChatBlackList.push_back(std::move(e));
    }
    // kDenyOptions ← GDenyOption（§0a9；question 1..6 → friendShip/inviteGuild/party/personalTrade/requestCouple/invitePracticePVP）
    out.kDenyOptions.cDenyFriendShip      = static_cast<int8_t>(denyOptions.friendShip);
    out.kDenyOptions.cDenyInviteGuild     = static_cast<int8_t>(denyOptions.inviteGuild);
    out.kDenyOptions.cDenyParty           = static_cast<int8_t>(denyOptions.party);
    out.kDenyOptions.cDenyPersonalTrade   = static_cast<int8_t>(denyOptions.personalTrade);
    out.kDenyOptions.cDenyRequestCouple   = static_cast<int8_t>(denyOptions.requestCouple);
    out.kDenyOptions.cDenyInvitePracticePVP = static_cast<int8_t>(denyOptions.invitePracticePVP);
    // vecTutorialDBUnitInfo ← gtutor（原 gup_get_tutor；11~19 級 → 不查詢（原 iTutorialFlag=-1）；
    //   bIsOnline=false（原 fetch 不填）；ucLevel ← EXP 換算（§0u 政策，非 gunit.Level 欄）；wstrLastDate ← GTutor.LastDate 原樣
    out.vecTutorialDBUnitInfo.reserve(tutor.size());
    for (const auto& t : tutor) {
        unit::TutorialDBUnitInfo ti;
        ti.kTutorialUnitInfo.iUnitUID = t.unitUID;
        const int level = exp_table::CheckLevelUp(1, t.exp);
        ti.kTutorialUnitInfo.ucLevel = static_cast<uint8_t>(level < 0 ? 0 : (level > 255 ? 255 : level));
        ti.kTutorialUnitInfo.wstrNickName = Utf8ToWide(t.nickname);
        ti.kTutorialUnitInfo.bIsOnline = false;
        ti.wstrLastDate = Utf8ToWide(t.lastDate);
        out.vecTutorialDBUnitInfo.push_back(std::move(ti));
    }
    // vecConnectTimeEvent ← gis30min（原 gup_select_30min；bAccountEvent=false（原 fetch 不填））；
    //   帳號級／累積事件（gup_select_event_account_nor／gup_get_remaintime）表不在倉庫 → vecCumulativeTimeEvent 恆空
    out.vecConnectTimeEvent.reserve(connectTimeEvents.size());
    for (const auto& c : connectTimeEvents) {
        unit::ConnectTimeEventInfo e;
        e.iEventUID = c.eventUID;
        e.wstrEventTime = Utf8ToWide(c.eventTime);
        e.bAccountEvent = false;
        out.vecConnectTimeEvent.push_back(std::move(e));
    }
    // 其餘（推薦／Henir／Messenger／戰場／招募）：無資料源 → 全預設/空（誠實佔位）
}

void BuildSelectUnitNot3(SelectUnitNot3& out,
                         const std::vector<db::TitleCompleteRecord>& titles,
                         const std::vector<db::TitleMissionRecord>& missions)
{
    out = SelectUnitNot3{};
    out.iOK = NET_OK;
    // vecTitle ← gtitle_complete（原 gup_get_title_list）：KTitleInfo{ m_iTitleID, m_wstrEndDate（EndDate 原樣；NULL→空）,
    //   m_kCTime=0、m_bInfinity=false（原 legacy fetch 不填——SERV_ALL_RENEWAL_SP 未定義，見 docs §0a12 偏差聲明）
    out.vecTitle.reserve(titles.size());
    for (const auto& t : titles) {
        unit::TitleInfo ti;
        ti.iTitleID = t.titleID;
        ti.wstrEndDate = t.endDateNull ? std::wstring() : Utf8ToWide(t.endDate);
        ti.kCTime = 0;
        ti.bInfinity = false;
        out.vecTitle.push_back(std::move(ti));
    }
    // vecMission ← gtitle_mission（原 gup_get_title_mission_list）：5×KSubMissionInstance 僅填 m_sClearData（原 fetch 不填 iID/bIsSuccess）；
    //   跳過 TitleID 已存在於 vecTitle 者（SERV_TITLE_DUPLICATE_PROCESS_REVISION 已定義——原碼同法）
    out.vecMission.reserve(missions.size());
    for (const auto& m : missions) {
        bool duplicated = false;
        for (const auto& vt : out.vecTitle) {
            if (vt.iTitleID == m.titleID) { duplicated = true; break; }
        }
        if (duplicated) continue;
        unit::MissionInstance mi;
        mi.iID = m.titleID;
        mi.subMissionInstances.reserve(5);
        for (int i = 0; i < 5; ++i) {
            unit::SubMissionInstance sq;
            sq.iID = 0;
            sq.sClearData = m.sub[i];
            sq.bIsSuccess = false;
            mi.subMissionInstances.push_back(sq);
        }
        out.vecMission.push_back(std::move(mi));
    }
    // pet（SERV_PET_SYSTEM 已定義）：V2 無 GPet 等 pet 表 → 空容器／iSummonedPetUID=0（誠實佔位；見 docs §0a12）
}

void BuildSelectUnitNot2(SelectUnitNot2& out,
                         int64_t ownerUnitUID,
                         const std::vector<db::QuestRecord>& quests,
                         const std::vector<db::QuestCompleteRecord>& completed)
{
    out = SelectUnitNot2{};
    out.iOK = NET_OK;
    // vecQuest ← gquests（原 gup_get_quest_list）：5 個 SubQuestInstance，m_iID=0、m_bIsSuccess=false（原 call site 僅填 m_ucClearData）
    out.vecQuest.reserve(quests.size());
    for (const auto& q : quests) {
        unit::QuestInstance qi;
        qi.iID = q.questID;
        qi.ownerUnitUID = ownerUnitUID;   // 原 kQuest.m_OwnorUnitUID = kReq.m_iUnitUID
        qi.subQuests.reserve(5);
        for (int i = 0; i < 5; ++i) {
            unit::SubQuestInstance sq;
            sq.iID = 0; sq.ucClearData = q.sub[i]; sq.bIsSuccess = false;
            qi.subQuests.push_back(sq);
        }
        out.vecQuest.push_back(std::move(qi));
    }
    // vecCompletQuest ← gquests_complete（先）∪ gquests_repeat（後）；completeCount=1（原 call site 固定值）
    out.vecCompletQuest.reserve(completed.size());
    for (const auto& c : completed) {
        unit::CompleteQuestInfo ci;
        ci.questID = c.questID;
        ci.completeCount = 1;
        ci.completeDate = c.completeDateEpoch;
        out.vecCompletQuest.push_back(ci);
    }
    // mapRandomQuestList：SERV_RANDOM_DAY_QUEST 已定義，但原資料源為 SiCXSLQuestManager（script）——無資料源 → 空 map（誠實佔位）
}

void PopulateUnitInfoFromGUnit(int64_t userUID, int authLevel, const db::GUnitRecord& unit,
                               unit::UnitInfo& u,
                               const db::SpiritValues* spiritValues,
                               int32_t equippedTitleID)
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
    u.spiritMax = 0;                                // SpiritTable.lua 未隨倉庫提供（spirit 上限未知，誠實置 0）
    u.spirit = spiritValues ? spiritValues->spirit : 0;   // ← GSpirit 讀回（§0a8）；list 路徑傳 nullptr → 0
    u.isGameBang = false;
    u.titleID = equippedTitleID;                  // ← GTitle_Complete.IsHang（§0a12；SELECT_UNIT 路徑傳入；其餘路徑 0）
    u.userGuildInfo = unit::UserGuildInfo{};
    u.lastLoginTime = Utf8ToWide(unit.lastDate);
}

void BuildSelectUnitNot1(int64_t userUID, int authLevel, const db::GUnitRecord& unit,
                         SelectUnitNot1& out,
                         const db::SpiritValues* spiritValues,
                         int32_t equippedTitleID,
                         const SelectUnit1Supplemental* supplemental)
{
    out = SelectUnitNot1{};
    out.iOK = NET_OK;

    PopulateUnitInfoFromGUnit(userUID, authLevel, unit, out.unitInfo, spiritValues, equippedTitleID);

    out.unitCreateDate = Utf8ToWide(unit.regDate);  // SERV_CHAR_LOG
    out.realDataED = 0;                             // SERV_LOGOUT_ED_CHECK（無資料來源）
    out.unitLastLoginDate = Utf8ToWide(unit.lastDate);  // SERV_DAILY_CHAR_FIRST_SELECT
    if (supplemental) {
        // mapInventorySlotSize ← giteminventorysize（§0a14）
        out.inventorySlotSize = supplemental->inventorySlotSize;
        // mapItem ← gitem（§0a14；衛星欄位自 §0a16 ← gitemquantity/endurance/enchant/period/socket，缺列 → proc 暫存表預設）
        out.items.clear();
        for (const auto& rec : supplemental->items) {
            unit::InventoryItemInfo it;
            it.itemUID = rec.itemUID;
            it.slotCategory = rec.slotCategory;
            it.slotID = rec.slotID;
            it.itemInfo.itemID = rec.itemID;
            it.itemInfo.usageType = rec.usageType;
            it.itemInfo.quantity = rec.quantity;
            it.itemInfo.endurance = rec.endurance;
            it.itemInfo.sealData = 0;
            it.itemInfo.enchantLevel = rec.enchantLevel;
            it.itemInfo.attrib = unit::ItemAttributeEnchantInfo{};
            it.itemInfo.itemSocket = { rec.socket[0], rec.socket[1], rec.socket[2], rec.socket[3] };
            it.itemInfo.randomSocket = {};              // SERV_NEW_ITEM_SYSTEM_2013_05：GItemSocketRandom 表不在倉庫
            it.itemInfo.itemState = 0;
            it.itemInfo.period = rec.period;
            it.itemInfo.expirationDate = rec.expirationDate.empty() ? std::wstring() : Utf8ToWide(rec.expirationDate);
            it.itemInfo.expandedSocketNum = 0;          // SERV_BATTLE_FIELD_BOSS：欄位不在倉庫
            out.items.insert({ rec.itemUID, it });
        }
        // 裝備映射：SlotCategory == ST_E_EQUIP(9) → UnitInfo.equippedItem（key = SlotID；SERV_EXPAND_SLOT_ID_DATA_SIZE 已定義）
        for (const auto& kv : out.items) {
            if (kv.second.slotCategory == 9) {
                out.unitInfo.equippedItem.insert({ static_cast<int32_t>(kv.second.slotID), kv.second });   // map::insert：重複 SlotID 保留第一筆（原碼同）
            }
        }
        // numResurrectionStone ← gresurrectionstone.Quantity（缺列 → §0a8 政策 0；§0a14）
        out.numResurrectionStone = supplemental->numResurrectionStone;
    }
    // inventorySlotSize / items / resStone：supplemental 為空（list 路徑等）→ 沿用空/0 佔位
    out.vecUserSkillPageData.push_back(unit::UserSkillPageData{});  // 一頁全預設（pages 1/1 一致；技能 proc 缺）
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
                            check_nickname::EntryPointCheckNickNameAck& ack, std::string& err,
                            int authLevel)
{
    ack = check_nickname::EntryPointCheckNickNameAck{};
    const std::string nick = WideToUtf8(req.wstrNickName);
    if (nick.empty() || nick.size() > 12) {
        ack.iOK = ERR_RESTORE_NICK_NAME_06;   // 暱稱長度錯誤（原 CP_ACP > 12 bytes）
        err.clear();
        return true;
    }
    if (authLevel < 2 && !string_filter::IsValidNickName(req.wstrNickName)) {   // 原碼 GetAuthLevel() < UAL_GM(2)
        ack.iOK = ERR_RESTORE_NICK_NAME_05;   // FT_NICKNAME 過濾（字元集/禁用暱稱/禁用字/標記）
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
                             change_nickname::ChangeNickNameAck& ack, std::string& err,
                             int authLevel)
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
    if (authLevel < 2 && !string_filter::IsValidNickName(req.wstrNickName)) {   // 原碼 GetAuthLevel() < UAL_GM(2)
        ack.iOK = ERR_RESTORE_NICK_NAME_05;   // FT_NICKNAME 過濾（字元集/禁用暱稱/禁用字/標記）
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
    // PvP NPC 保留暱稱（原 SERV_PVP_NEW_SYSTEM；無 GM 繞過；bCheckOnly 亦擋，與原碼位置一致）
    if (pvp_npc_names::IsExistPvpNpcName(req.wstrNickName)) {
        ack.iOK = ERR_CREATE_UNIT_01;   // 原碼 CHANGE_NICK_NAME/ENTRY_POINT_CHANGE_NICK_NAME 亦用此代碼
        err.clear();
        return true;
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
                                       change_nickname::ChangeNickNameAck& ack, std::string& err,
                                       int authLevel)
{
    // V2 單一 game DB，忽略 iServerGroup；共用決策（見 HandleChangeNicknameReq 之說明）
    change_nickname::ChangeNickNameReq sub;
    sub.iUnitUID = req.iUnitUID;
    sub.wstrNickName = req.wstrNickName;
    sub.bCheckOnly = req.bCheckOnly;
    return HandleChangeNicknameReq(gameDb, userUID, sub, ack, err, authLevel);
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
    // 原碼順序：GetUnitTemplet（無 templet → 03）→ IsInitNormalJob（SERV_CHECK_CREATE_UNIT_CLASS → 11）
    if (!unit_templet::UnitTempletExists(req.iClass)) {
        ack.iOK = ERR_CREATE_UNIT_03;      // 無 templet（enum 模型；見 UnitTemplet.h—— UnitTemplet.lua 未隨倉庫提供）
        err.clear();
        return true;
    }
    if (!unit_templet::IsInitNormalJob(req.iClass)) {
        ack.iOK = ERR_CREATE_UNIT_11;      // 非初始普通職業（enum 實測＝1289）
        err.clear();
        return true;
    }
    const std::string nick = WideToUtf8(req.wstrNickName);
    if (nick.empty() || nick.size() > 12) {
        ack.iOK = ERR_CREATE_UNIT_04;      // 暱稱長度錯誤（原 CP_ACP > 12 bytes）
        err.clear();
        return true;                        // 決策性失敗（非基礎設施錯誤）：仍送 ACK
    }
    // KODBC 注入標記（比照原版 IsInvalidMarkIn 的常見集合；V2 無 KODBC 模組）
    if (authLevel < 2 && !string_filter::IsValidNickName(req.wstrNickName)) {   // 原碼 GetAuthLevel() < UAL_GM(2)
        ack.iOK = ERR_CREATE_UNIT_08;   // FT_NICKNAME 過濾（字元集/禁用暱稱/禁用字/標記）
        err.clear();
        return true;
    }
    // PvP NPC 保留暱稱（原 SERV_PVP_NEW_SYSTEM；無 GM 繞過）
    if (pvp_npc_names::IsExistPvpNpcName(req.wstrNickName)) {
        ack.iOK = ERR_CREATE_UNIT_01;   // 與原碼四處呼叫點一致（CREATE_UNIT/ENTRY_POINT 變體共用）
        err.clear();
        return true;
    }
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
    db::SpiritValues sv;
    if (!gameDb.GetSpiritValues(unitUID, sv, err)) {
        ack.iOK = ERR_CREATE_UNIT_03;      // 建立後讀 spirit 失敗（誠實失敗；角色已建立）
        err = std::string("get spirit after create: ") + err;
        return true;
    }
    PopulateUnitInfoFromGUnit(userUID, authLevel, rec, ack.kUnitInfo, &sv);
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

    // 4) 成功：角色登入副作用（gup_select_unit 的 DB 部分：GSpirit 每日重置／復活石每日補充／PlayDayCnt／LoginCount+1／LastDate=now）
    if (!gameDb.ApplyUnitLoginReset(req.unitUID, err)) {
        err = std::string("game db error applying unit login reset: ") + err;
        ack.iOK = ERR_SELECT_UNIT_05;
        return ack.iOK;
    }
    // ApplyUnitLoginReset 後重讀一次，讓呼叫端拿到含最新 LoginCount／Spirit 的記錄
    // §0a12：稱號 complete list（先於 Not1/Not3——Not1 的 UnitInfo.titleID ← 第一個 IsHang=1 列；原 SELECT_UNIT 語意）
    std::vector<db::TitleCompleteRecord> titleComplete;
    std::vector<db::TitleMissionRecord> titleMission;
    int32_t equippedTitleID = 0;
    if (outNot1 || outNot3) {
        if (!gameDb.GetTitleCompleteList(req.unitUID, titleComplete, err)) {
            err = std::string("get title complete list: ") + err;
            ack.iOK = ERR_SELECT_UNIT_05;
            return ack.iOK;
        }
        for (const auto& t : titleComplete) {
            if (t.isHang) { equippedTitleID = t.titleID; break; }   // 原碼：第一個 IsHang=1 生效（多筆 → 視為損壞；V2 唯讀不改寫，見 docs §0a12 偏差聲明）
        }
        if (outNot3) {
            if (!gameDb.GetTitleMissionList(req.unitUID, titleMission, err)) {
                err = std::string("get title mission list: ") + err;
                ack.iOK = ERR_SELECT_UNIT_05;
                return ack.iOK;
            }
        }
    }
    db::SpiritValues sv;   // hoisted：Not1（PopulateUnitInfo）與 Not5（bIsSpiritUpdated）共用
    bool svRead = false;
    if (outUnit || outNot1 || outNot2 || outNot3 || outNot4 || outNot5) {
        db::GUnitRecord tmp;
        db::GUnitRecord& uRef = outUnit ? *outUnit : tmp;
        bool found2 = false;
        if (!gameDb.GetUnitByUID(req.unitUID, uRef, found2, err) || !found2) {
            // 記錄剛寫過卻讀不回：視為 DB 錯誤（誠實失敗，不假裝成功）
            if (err.empty()) err = "unit vanished between ApplyUnitLoginReset and re-read";
            ack.iOK = ERR_SELECT_UNIT_05;
            return ack.iOK;
        }
        if (!gameDb.GetSpiritValues(req.unitUID, sv, err)) {
            err = std::string("get spirit after login reset: ") + err;
            ack.iOK = ERR_SELECT_UNIT_05;
            return ack.iOK;
        }
        svRead = true;
        SelectUnit1Supplemental sup;
        if (outNot1) {
            if (!gameDb.GetInventorySlotSize(req.unitUID, sup.inventorySlotSize, err)) {
                err = std::string("get inventory slot size: ") + err;
                ack.iOK = ERR_SELECT_UNIT_05;
                return ack.iOK;
            }
            if (!gameDb.GetInventoryItems(req.unitUID, sup.items, err)) {
                err = std::string("get inventory items: ") + err;
                ack.iOK = ERR_SELECT_UNIT_05;
                return ack.iOK;
            }
            db::ResurrectionStoneValues rs;
            if (!gameDb.GetResurrectionStone(req.unitUID, rs, err)) {
                if (!err.empty()) {   // 缺列 → 0（非錯誤）；DB 錯誤 → 中斷
                    err = std::string("get resurrection stone: ") + err;
                    ack.iOK = ERR_SELECT_UNIT_05;
                    return ack.iOK;
                }
            } else {
                sup.numResurrectionStone = rs.quantity;
            }
        }
        if (outNot1) BuildSelectUnitNot1(userUID, authLevel, uRef, *outNot1, &sv, equippedTitleID, &sup);
    }
    if (outNot2) {
        std::vector<db::QuestRecord> quests;
        std::vector<db::QuestCompleteRecord> completed;
        if (!gameDb.GetQuestList(req.unitUID, quests, err)) {
            err = std::string("get quest list: ") + err;
            ack.iOK = ERR_SELECT_UNIT_05;
            return ack.iOK;
        }
        if (!gameDb.GetQuestCompleteList(req.unitUID, completed, err)) {
            err = std::string("get quest complete list: ") + err;
            ack.iOK = ERR_SELECT_UNIT_05;
            return ack.iOK;
        }
        BuildSelectUnitNot2(*outNot2, req.unitUID, quests, completed);
    }
    if (outNot3) BuildSelectUnitNot3(*outNot3, titleComplete, titleMission);
    if (outNot4) {
        db::DenyOptionValues deny;
        if (!gameDb.GetDenyOptions(req.unitUID, deny, err)) {
            err = std::string("get deny options: ") + err;
            ack.iOK = ERR_SELECT_UNIT_05;
            return ack.iOK;
        }
        // §0a13：Not4 DB 讀回（黑名單／사제（稱號？不——사제＝師徒）／30 分鐘連線事件）
        std::vector<db::BlacklistRecord> blacklist;
        if (!gameDb.GetBlacklist(req.unitUID, blacklist, err)) {
            err = std::string("get blacklist: ") + err;
            ack.iOK = ERR_SELECT_UNIT_05;
            return ack.iOK;
        }
        std::vector<db::TutorRecord> tutor;
        const int unitLevel = exp_table::CheckLevelUp(1, unit.exp);           // 原 kAck.m_kUnitInfo.m_ucLevel（同批資料）
        if (unitLevel <= 10 || unitLevel >= 20) {                              // UNIT_LEVEL_STUDENT_MAX=10 / UNIT_LEVEL_TEACHER_MIN=20（原 iTutorialFlag，11~19 不查）
            const bool isTeacher = unitLevel >= 20;
            if (!gameDb.GetTutorInfo(isTeacher, req.unitUID, tutor, err)) {
                err = std::string("get tutor info: ") + err;
                ack.iOK = ERR_SELECT_UNIT_05;
                return ack.iOK;
            }
        }
        std::vector<db::ConnectTimeEventRecord> timeEvents;
        if (!gameDb.GetConnectTimeEvents(req.unitUID, timeEvents, err)) {
            err = std::string("get connect time events: ") + err;
            ack.iOK = ERR_SELECT_UNIT_05;
            return ack.iOK;
        }
        int64_t recommendOldUID = 0;
        bool recommendFound = false;
        if (!gameDb.GetRecommendOldUID(req.unitUID, recommendOldUID, recommendFound, err)) {
            err = std::string("get recommend old uid: ") + err;
            ack.iOK = ERR_SELECT_UNIT_05;
            return ack.iOK;
        }
        BuildSelectUnitNot4(*outNot4, deny, blacklist, tutor, timeEvents, recommendFound ? recommendOldUID : 0);
    }
    if (outNot5) BuildSelectUnitNot5(*outNot5, svRead ? &sv : nullptr);

    ack.iOK = NET_OK;
    err.clear();
    return ack.iOK;
}

}} // namespace x2::select_unit
