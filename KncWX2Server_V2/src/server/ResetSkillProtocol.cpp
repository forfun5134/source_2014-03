// ResetSkillProtocol.cpp — 見 .h 檔頭的語意對照與偏差聲明
#include "ResetSkillProtocol.h"

#include <ctime>
#include <limits>

#include "../core/NetError.h"
#include "../core/Serializer.h"
#include "WireHelpers.h"

namespace x2 { namespace reset_skill {

bool PutResetSkillReq(Serializer& ks, const ResetSkillReq& v)
{
    return ks.Put(v.iSkillID) && ks.Put(v.iActiveSkillPageNumber);
}
bool GetResetSkillReq(Serializer& ks, ResetSkillReq& v)
{
    return ks.Get(v.iSkillID) && ks.Get(v.iActiveSkillPageNumber);
}
bool PutResetSkillAck(Serializer& ks, const ResetSkillAck& v)
{
    return ks.Put(v.iOK) && ks.Put(v.iActiveSkillPageNumber) && ks.Put(v.iDelSkillID) &&
           ks.Put(v.iSPoint) && ks.Put(v.iCSPoint) &&
           x2::detail::PutCountPrefixVec(ks, v.vecInventorySlotInfo,
               [](Serializer& s2, const unit::InventoryItemInfo& e) { return unit::PutInventoryItemInfo(s2, e); });
}
bool GetResetSkillAck(Serializer& ks, ResetSkillAck& v)
{
    return ks.Get(v.iOK) && ks.Get(v.iActiveSkillPageNumber) && ks.Get(v.iDelSkillID) &&
           ks.Get(v.iSPoint) && ks.Get(v.iCSPoint) &&
           x2::detail::GetCountPrefixVec(ks, v.vecInventorySlotInfo,
               [](Serializer& s2, unit::InventoryItemInfo& e) { return unit::GetInventoryItemInfo(s2, e); });
}

bool IsUnitTypeDefaultSkill(int32_t skillID)
{
    // V2 推定：CreateUnit 預設技能集合（見 .h 偏差聲明 5）
    switch (skillID) {
        case 10000:   // UC_ELSWORD_SWORDMAN（class 1）
        case 20030:   // UC_ARME_VIOLET_MAGE（class 2）
        case 30000:   // UC_LIRE_ELVEN_RANGER（class 3）
        case 40010:   // UC_RAVEN_FIGHTER（class 4）
            return true;
        default:
            return false;
    }
}

const std::vector<int32_t>& ResetSkillItemPriority()
{
    // JP 生效優先序（見 .h 偏差聲明 7）
    static const std::vector<int32_t> kPriority = { 60008069, 160947, 130808, 67003592, 200730 };
    return kPriority;
}

static std::string NowUtcString()
{
    char buf[32];
    const std::time_t t = std::time(nullptr);
    std::tm tmv{};
#if defined(_WIN32)
    gmtime_s(&tmv, &t);
#else
    if (::gmtime_r(&t, &tmv) == nullptr) return std::string();
#endif
    std::snprintf(buf, sizeof buf, "%04d-%02d-%02d %02d:%02d:%02d",
                  tmv.tm_year + 1900, tmv.tm_mon + 1, tmv.tm_mday, tmv.tm_hour, tmv.tm_min, tmv.tm_sec);
    return std::string(buf);
}

static std::wstring AsciiToWide(const std::string& in)
{
    // V2 datetime 欄位皆為 'YYYY-MM-DD HH:MM:SS' ASCII → 直譯即可
    std::wstring out;
    out.reserve(in.size());
    for (unsigned char c : in) out.push_back(static_cast<wchar_t>(c));
    return out;
}

static unit::InventoryItemInfo MakeSlotInfo(const db::InventoryItemRecord& r, int32_t newQuantity /* <0 → 空槽 */)
{
    unit::InventoryItemInfo it{};
    it.slotCategory = r.slotCategory;
    it.slotID = r.slotID;
    if (newQuantity < 0) {
        it.itemUID = 0;   // 空槽（原 GetInventorySlotInfo EMPTY 分支同）
        return it;
    }
    it.itemUID = r.itemUID;
    it.itemInfo.itemID = r.itemID;
    it.itemInfo.usageType = r.usageType;
    it.itemInfo.quantity = newQuantity;
    it.itemInfo.endurance = r.endurance;
    it.itemInfo.sealData = 0;
    it.itemInfo.enchantLevel = r.enchantLevel;
    it.itemInfo.attrib.cAttribEnchant0 = r.attrib[0];
    it.itemInfo.attrib.cAttribEnchant1 = r.attrib[1];
    it.itemInfo.attrib.cAttribEnchant2 = r.attrib[2];
    size_t sockN = 4;
    while (sockN > 0 && r.socket[sockN - 1] == 0) --sockN;
    it.itemInfo.itemSocket.assign(r.socket, r.socket + sockN);
    it.itemInfo.randomSocket = {};
    it.itemInfo.itemState = 0;
    it.itemInfo.period = r.period;
    it.itemInfo.expirationDate = AsciiToWide(r.expirationDate);
    it.itemInfo.expandedSocketNum = 0;
    return it;
}

// 探測可消耗的重置道具（JP 優先序；數量最少堆疊優先）。找到 → true 並填 out。
static bool PickResetSkillItem(const std::vector<db::InventoryItemRecord>& items,
                               db::InventoryItemRecord& out)
{
    for (const int32_t itemID : ResetSkillItemPriority()) {
        const db::InventoryItemRecord* best = nullptr;
        int32_t bestQty = std::numeric_limits<int32_t>::max();
        for (const auto& rec : items) {
            if (rec.itemID != itemID) continue;
            if (rec.slotCategory < 1 || rec.slotCategory > 7) continue;  // IsUserInventoryCategory：ST_EQUIP..ST_AVARTA
            if (rec.usageType != 2) continue;                            // PT_QUANTITY（可扣數量）
            if (rec.quantity < 1) continue;
            if (rec.quantity < bestQty ||
                (rec.quantity == bestQty && best != nullptr && rec.itemUID < best->itemUID)) {
                best = &rec;
                bestQty = rec.quantity;
            }
        }
        if (best != nullptr) { out = *best; return true; }
    }
    return false;
}

int32_t HandleResetSkillReq(db::GameStore& gameDb, int64_t unitUID,
                            const ResetSkillReq& req,
                            ResetSkillAck& ack,
                            std::string& err,
                            const std::string& nowUtc)
{
    ack = ResetSkillAck{};   // 全欄位 0（原 ctor 預設；含 iActiveSkillPageNumber/iDelSkillID = 0）
    err.clear();

    if (unitUID <= 0) {
        ack.iOK = ERR_RESET_SKILL_03;
        err = "invalid unit uid";
        return ack.iOK;
    }

    // 預先讀取（失敗 → ERR_RESET_SKILL_03；全零 ACK，與原 REQ 階段失敗形狀一致）
    db::SkillPageState state;
    if (!gameDb.LoadSkillPageState(unitUID, state, err)) {
        err = std::string("load skill page state: ") + err;
        ack.iOK = ERR_RESET_SKILL_03;
        return ack.iOK;
    }
    db::CashSkillPointValues cash;
    if (!gameDb.GetCashSkillPoint(unitUID, cash, err)) {
        err = std::string("get cash skill point: ") + err;
        ack.iOK = ERR_RESET_SKILL_03;
        return ack.iOK;
    }
    const int32_t activePage = state.activePage;   // >= 1

    // [1] 作用頁一致性
    if (req.iActiveSkillPageNumber != activePage) {
        ack.iOK = ERR_SKILL_PAGE_01;
        err.clear();
        return ack.iOK;
    }

    const int32_t skillID = req.iSkillID;

    // [2]==[3] SkillTemplet / SkillTreeTemplet：V2 無資料 → skillID > 0 即視為存在（偏差聲明 2/3）
    if (skillID <= 0) {
        ack.iOK = ERR_RESET_SKILL_00;
        err.clear();
        return ack.iOK;
    }

    // 作用頁已學會（原 AccessLearnedSkillTree() 的 V2 等價物＝ gskill 過濾 (page == activePage, SkillID>0, SkillLevel>0)；偏差聲明同 §0a23）
    int32_t iDelSkillLevel = 0, iDelSkillCSPoint = 0;
    {
        bool found = false;
        for (const auto& sk : state.skills) {
            if (sk.skillPageNumber == activePage && sk.skillID == skillID) {
                iDelSkillLevel = sk.skillLevel;
                iDelSkillCSPoint = sk.skillCSPoint;
                found = true;
                break;
            }
        }
        if (!found) { iDelSkillLevel = 0; iDelSkillCSPoint = 0; }
    }

    // [4] CheckResetSkill（iOK 以 ref 傳出，對齊原簽名）
    bool bSKillInitLevel = true;
    if (iDelSkillLevel < 1) {
        ack.iOK = ERR_SKILL_20;
        err.clear();
        return ack.iOK;
    }
    // IsUnitTypeDefaultSkill || !IsAllFollowingSkillLevelZero（V2 ≡ true）→ iAfterDelSkillLevel=1
    if (IsUnitTypeDefaultSkill(skillID) /* || !IsAllFollowingSkillLevelZero(...) 恆為 false */) {
        bSKillInitLevel = false;
    }

    // [5] GetSkillLevelAndCSP（[4] 已保證存在且 level >= 1；保留失敗分支形狀以對齊原碼）
    if (iDelSkillLevel < 1) {
        ack.iOK = ERR_RESET_SKILL_00;
        err.clear();
        return ack.iOK;
    }

    // [6]
    const int32_t iAfterDelSkillLevel = (bSKillInitLevel ? 0 : 1);

    // [7] 裝備中技能且完全重置 → ERR_RESET_SKILL_05
    {
        bool equipped = false;
        for (const auto& r : state.slotA) {
            if (r.pageNumber != activePage) continue;
            for (int i = 0; i < 4; ++i) if (r.slot[i] == skillID) equipped = true;
            break;
        }
        if (!equipped) {
            for (const auto& r : state.slotB) {
                if (r.pageNumber != activePage) continue;
                for (int i = 0; i < 4; ++i) if (r.slot[i] == skillID) equipped = true;
                break;
            }
        }
        if (equipped && iAfterDelSkillLevel <= 0 && iDelSkillLevel > 0) {
            ack.iOK = ERR_RESET_SKILL_05;
            err.clear();
            return ack.iOK;
        }
    }

    // [8] SP 退還
    int32_t iAfterSP = 0;
    for (int32_t i = 0; i < iDelSkillLevel; ++i) {
        if (i == 0) {
            if (iAfterDelSkillLevel > 0) continue;
            iAfterSP += kRequireLearnSkillPoint;
        } else {
            iAfterSP += kRequireUpgradeSkillPoint;
        }
    }
    iAfterSP -= iDelSkillCSPoint;   // 可為負（原同）

    // [9] CSP 退還
    const bool cashExpired = (cash.maxCSPoint == 0);   // 原 IsCashSkillPointExpired ≡ (m_iMaxCSPoint == 0)
    int32_t iAfterCSP = 0;
    if (!cashExpired) {
        iAfterCSP = cash.csPoint + iDelSkillCSPoint;
        if (cash.maxCSPoint < iAfterCSP) {
            iAfterSP += iAfterCSP - cash.maxCSPoint;   // 溢出加回 SP
            iAfterCSP = cash.maxCSPoint;
        }
    } else {
        iAfterCSP = 0;   // 現金技能點未啟用 → 投入的 CSP 消失（原同）
    }

    // [10] 重置道具探測（僅讀；不落盤）
    std::vector<db::InventoryItemRecord> items;
    if (!gameDb.GetInventoryItems(unitUID, items, err)) {
        err = std::string("get inventory items: ") + err;
        ack.iOK = ERR_RESET_SKILL_03;   // 原無此失敗面（內存路徑）；V2 誠實映射
        return ack.iOK;
    }
    db::InventoryItemRecord chosen;
    if (!PickResetSkillItem(items, chosen)) {
        ack.iOK = ERR_RESET_SKILL_01;
        err.clear();
        return ack.iOK;
    }

    // [11] DBE_RESET_SKILL_REQ 等價物（單一 transaction）
    const std::string now = nowUtc.empty() ? NowUtcString() : nowUtc;
    db::GameStore::ResetSkillCommit commit;
    db::GameStore::ResetSkillFailure stage = db::GameStore::ResetSkillFailure::None;
    if (!gameDb.CommitResetSkill(unitUID, chosen.itemUID, activePage,
                                 skillID, iAfterDelSkillLevel,
                                 iAfterSP, iAfterCSP, now,
                                 commit, stage, err)) {
        switch (stage) {
            case db::GameStore::ResetSkillFailure::Item:      ack.iOK = ERR_RESET_SKILL_02; break;
            case db::GameStore::ResetSkillFailure::CashPoint: ack.iOK = ERR_SKILL_24;       break;
            case db::GameStore::ResetSkillFailure::Skill:
            case db::GameStore::ResetSkillFailure::SPoint:
            case db::GameStore::ResetSkillFailure::None:      ack.iOK = ERR_RESET_SKILL_03; break;
        }
        // phase-B 失敗 ACK：帶 iDelSkillID/作用頁與「未變更」的道具槽位資訊（偏差聲明 10）
        ack.iActiveSkillPageNumber = req.iActiveSkillPageNumber;
        ack.iDelSkillID = skillID;
        ack.vecInventorySlotInfo.push_back(MakeSlotInfo(chosen, chosen.quantity));
        return ack.iOK;
    }

    // [12] 成功 ACK（SPoint/CSPoint 為提交後讀回值）
    ack.iOK = NET_OK;
    ack.iActiveSkillPageNumber = req.iActiveSkillPageNumber;
    ack.iDelSkillID = skillID;
    ack.iSPoint = commit.sPointAbsolute;
    ack.iCSPoint = commit.csPoint;
    if (commit.itemDeleted) {
        ack.vecInventorySlotInfo.push_back(MakeSlotInfo(chosen, -1));   // 空槽（itemUID=0）
    } else {
        ack.vecInventorySlotInfo.push_back(MakeSlotInfo(chosen, chosen.quantity - 1));
    }
    err.clear();
    return ack.iOK;
}

} // namespace reset_skill
} // namespace x2
