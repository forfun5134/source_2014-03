// GetSkillProtocol.cpp — 見 .h 檔頭的語意對照與偏差聲明
#include "GetSkillProtocol.h"

#include <algorithm>

#include "../core/NetError.h"
#include "../core/Serializer.h"
#include "WireHelpers.h"

namespace x2 { namespace get_skill {

static bool PutGetSkillInfo(Serializer& ks, const GetSkillInfo& v)
{
    return ks.Put(v.iSkillID) && ks.Put(v.iBeforeSkillLevel) && ks.Put(v.iSkillLevel) && ks.Put(v.iSpendSkillCSPoint);
}
bool GetGetSkillInfo(Serializer& ks, GetSkillInfo& v)
{
    return ks.Get(v.iSkillID) && ks.Get(v.iBeforeSkillLevel) && ks.Get(v.iSkillLevel) && ks.Get(v.iSpendSkillCSPoint);
}

static bool PutSkillInfoMap(Serializer& ks, const std::map<int32_t, GetSkillInfo>& m)
{
    return x2::detail::PutCountPrefixMap(ks, m,
        [](Serializer& s2, const int32_t& e) { return s2.Put(e); },
        [](Serializer& s2, const GetSkillInfo& e) { return PutGetSkillInfo(s2, e); });
}
static bool GetSkillInfoMap(Serializer& ks, std::map<int32_t, GetSkillInfo>& m)
{
    return x2::detail::GetCountPrefixMap(ks, m,
        [](Serializer& s2, int32_t& e) { return s2.Get(e); },
        [](Serializer& s2, GetSkillInfo& e) { return GetGetSkillInfo(s2, e); });
}

bool PutGetSkillReq(Serializer& ks, const GetSkillReq& v)
{
#if defined(X2_REGION_JP)
    // SERV_SUB_QUEST_LEARN_NEW_SKILL（原 ServerDefine_JP.h:458 / ServerDefine_Global.h:1102）——
    //   僅 JP 地區上游此欄位（TW/EU/CN/US 無）
    if (!x2::detail::PutCountPrefixVec(ks, v.vecNowLearnSkill,
            [](Serializer& s2, const int32_t& e) { return s2.Put(e); })) return false;
#endif
    return ks.Put(v.iActiveSkillPageNumber) && PutSkillInfoMap(ks, v.mapSkillList);
}
bool GetGetSkillReq(Serializer& ks, GetSkillReq& v)
{
#if defined(X2_REGION_JP)
    if (!x2::detail::GetCountPrefixVec(ks, v.vecNowLearnSkill,
            [](Serializer& s2, int32_t& e) { return s2.Get(e); })) return false;
#else
    v.vecNowLearnSkill.clear();
#endif
    return ks.Get(v.iActiveSkillPageNumber) && GetSkillInfoMap(ks, v.mapSkillList);
}

bool PutGetSkillAck(Serializer& ks, const GetSkillAck& v)
{
    return ks.Put(v.iOK) && ks.Put(v.iActiveSkillPageNumber) && PutSkillInfoMap(ks, v.mapSkillList) &&
           ks.Put(v.iRemainSP) && ks.Put(v.iRemainCSP);
}
bool GetGetSkillAck(Serializer& ks, GetSkillAck& v)
{
    return ks.Get(v.iOK) && ks.Get(v.iActiveSkillPageNumber) && GetSkillInfoMap(ks, v.mapSkillList) &&
           ks.Get(v.iRemainSP) && ks.Get(v.iRemainCSP);
}

namespace {

struct PlanEntry
{
    int32_t skillID = 0;
    int32_t target = 0;
    int32_t beforeSkillLevel = 0;   // 原樣保留 client 值（原碼不覆寫）
    int32_t prevCSP = 0;            // 既有 gskill.SkillCSPoint（作用頁）
    int32_t requestSpendCSP = 0;    // req 中 m_iSpendSkillCSPoint（過期時原版保留）
    int64_t unitCost = 0;           // 本技能點數 cost（SP 計價）
    int32_t spendCSPAfter = 0;      // 原版寫回：未過期時 cost + 既有投入；過期時 req 值 + 既有投入
};

} // namespace

int32_t HandleGetSkillReq(db::GameStore& gameDb, int64_t unitUID,
                          const GetSkillReq& req,
                          GetSkillAck& ack,
                          std::string& err)
{
    ack = GetSkillAck{};   // 全欄位 0（原 ACK ctor 預設；map 空）
    err.clear();

    if (unitUID <= 0) {
        ack.iOK = ERR_ODBC_01;
        err = "invalid unit uid";
        return ack.iOK;
    }

    // 預先讀取（失敗 → ERR_ODBC_01；全零 ACK，與原 REQ 階段失敗形狀一致；見檔頭偏差聲明 10）
    db::SkillPageState state;
    if (!gameDb.LoadSkillPageState(unitUID, state, err)) {
        err = std::string("load skill page state: ") + err;
        ack.iOK = ERR_ODBC_01;
        return ack.iOK;
    }
    db::CashSkillPointValues cash;
    if (!gameDb.GetCashSkillPoint(unitUID, cash, err)) {
        err = std::string("get cash skill point: ") + err;
        ack.iOK = ERR_ODBC_01;
        return ack.iOK;
    }
    db::GUnitRecord unit{};
    bool unitFound = false;
    if (!gameDb.GetUnitByUID(unitUID, unit, unitFound, err)) {
        err = std::string("get unit: ") + err;
        ack.iOK = ERR_ODBC_01;
        return ack.iOK;
    }
    if (!unitFound || unit.deleted) {
        err = "unit not found or deleted";
        ack.iOK = ERR_ODBC_01;
        return ack.iOK;
    }
    const int32_t activePage = state.activePage;   // >= 1
    const int32_t sPoint = unit.sPoint;
    const int32_t csPoint = cash.csPoint;

    // [1] 作用頁一致性
    if (req.iActiveSkillPageNumber != activePage) {
        ack.iOK = ERR_SKILL_PAGE_01;
        err.clear();
        return ack.iOK;
    }

    // [2] 空技能清單
    if (req.mapSkillList.empty()) {
        ack.iOK = ERR_SKILL_09;
        err.clear();
        return ack.iOK;
    }

    // [3] CheckGetNewSkill（V2 可達部分：skillID > 0；其餘 templet 依賴路徑全放行——見檔頭 [3]）
    for (const auto& kv : req.mapSkillList) {
        if (kv.first <= 0 || kv.second.iSkillID != kv.first) {
            // 原版查驗以 map key 為準、DB 寫入卻以 value.m_iSkillID 為準；V2 要求兩者相同，
            // 避免 key/value 分歧把計價與持久化對象拆開（偏差聲明 15）。
            ack.iOK = ERR_SKILL_01;
            err.clear();
            return ack.iOK;
        }
    }

    // [4] cash 過期／未過期的 SP/SP+CSP 下限檢查（原 handler 於 GetNecessarySkillPoint 之前）
    const bool cashExpired = (cash.maxCSPoint == 0);   // 原 IsCashSkillPointExpired ≡ (m_iMaxCSPoint == 0)
    if (cashExpired) {
        if (sPoint <= 0) {
            ack.iOK = ERR_SKILL_17;
            err.clear();
            return ack.iOK;
        }
    } else {
        if (sPoint + csPoint <= 0) {
            ack.iOK = ERR_SKILL_18;
            err.clear();
            return ack.iOK;
        }
    }

    // [5] GetNecessarySkillPoint：逐技能計價（作用頁現狀；V2 以 map key 為準）
    std::vector<PlanEntry> plan;
    plan.reserve(req.mapSkillList.size());
    int64_t totalCost = 0;   // 未分派 CSP 前的總 cost（SP 計價）
    for (const auto& kv : req.mapSkillList) {
        PlanEntry p;
        p.skillID = kv.first;
        p.target = kv.second.iSkillLevel;
        p.beforeSkillLevel = kv.second.iBeforeSkillLevel;
        p.requestSpendCSP = kv.second.iSpendSkillCSPoint;
        int32_t curLevel = 0, curCSP = 0;
        for (const auto& sk : state.skills) {
            if (sk.skillPageNumber == activePage && sk.skillID == p.skillID) {
                curLevel = sk.skillLevel;
                curCSP = sk.skillCSPoint;
                break;
            }
        }
        p.prevCSP = curCSP;
        if (curLevel > 0) {
            const int64_t up = static_cast<int64_t>(p.target) - curLevel;
            if (up < 0) {
                ack.iOK = ERR_SKILL_17;   // 等級遞減（原 GetNecessarySkillPoint return false）
                err.clear();
                return ack.iOK;
            }
            p.unitCost = static_cast<int64_t>(kRequireUpgradeSkillPoint) * up;
        } else {
            const int64_t up = static_cast<int64_t>(p.target) - 1;
            if (up < 0) {
                ack.iOK = ERR_SKILL_17;   // 目標等級 < 1（原 return false）
                err.clear();
                return ack.iOK;
            }
            p.unitCost = kRequireLearnSkillPoint + static_cast<int64_t>(kRequireUpgradeSkillPoint) * up;
        }
        totalCost += p.unitCost;
        // 原 GetNecessarySkillPoint：未過期時把本技能「完整 cost」寫入 m_iSpendSkillCSPoint；
        // 過期時不覆寫（保留 client 欄位），其後 handler 兩種情況都加上既有 SkillCSPoint。
        const int64_t spendCSP = (cashExpired ? static_cast<int64_t>(p.requestSpendCSP) : p.unitCost) + p.prevCSP;
        if (spendCSP < 0 || spendCSP > INT32_MAX) {
            ack.iOK = ERR_SKILL_17;   // V2 防止 client 投資值／整數溢位破壞持久化欄位
            err.clear();
            return ack.iOK;
        }
        p.spendCSPAfter = static_cast<int32_t>(spendCSP);
        plan.push_back(p);
    }

    // 原 GetNecessarySkillPoint 對總池切分：未過期時從總 cost 優先扣 CSP，剩餘才扣 SP；
    // 每技能 m_iSpendSkillCSPoint 卻各自保留全額 cost（而非按 CSP/SP 比例分派）。V2 忠實保持此行為。
    const int64_t totalCSP = cashExpired ? 0 : std::min<int64_t>(totalCost, csPoint);
    const int64_t totalSP = totalCost - totalCSP;

    // [6] SP/CSP 足夠性（iTotalCSP > csPoint 不可達；保留原檢查形狀）
    if (totalSP > sPoint || totalCSP > csPoint) {
        ack.iOK = ERR_SKILL_18;
        err.clear();
        return ack.iOK;
    }

    // [7] cash 過期且 iTotalCSP > 0 → ERR_SKILL_24（不可達——過期時 iTotalCSP 恆 0；保留原檢查形狀）
    if (cashExpired && totalCSP > 0) {
        ack.iOK = ERR_SKILL_24;
        err.clear();
        return ack.iOK;
    }

    // [8][9] 新 CSP 絕對值與每技能持久化 CSP（每技能依原算法計算；V2 一律寫入 gskillcash）
    const int32_t newCSPoint = csPoint - static_cast<int32_t>(totalCSP);

    // [10][11] CommitGetSkill（單一 transaction：gskill upsert → gunit.SPoint -= totalSP → gskillcash upsert）
    std::vector<db::GameStore::GetSkillCommitSkill> skills;
    skills.reserve(plan.size());
    for (const auto& p : plan) {
        db::GameStore::GetSkillCommitSkill sks;
        sks.skillID = p.skillID;
        sks.skillLevelAfter = p.target;
        sks.skillCSPoint = p.spendCSPAfter;
        skills.push_back(sks);
    }
    db::GameStore::GetSkillCommit commit;
    db::GameStore::GetSkillFailure stage = db::GameStore::GetSkillFailure::None;
    if (!gameDb.CommitGetSkill(unitUID, activePage, skills,
                               static_cast<int32_t>(totalSP), newCSPoint,
                               commit, stage, err)) {
        // [11] 失敗 ACK（B 相）：iOK=映射碼、頁碼回顯、map 空、Remain=0（見檔頭偏差聲明 10）
        switch (stage) {
            case db::GameStore::GetSkillFailure::CashPoint: ack.iOK = ERR_SKILL_24; break;
            case db::GameStore::GetSkillFailure::None:
            case db::GameStore::GetSkillFailure::Skill:
            case db::GameStore::GetSkillFailure::SPoint:    ack.iOK = ERR_SKILL_00; break;
        }
        ack.iActiveSkillPageNumber = req.iActiveSkillPageNumber;
        return ack.iOK;
    }

    // [12] 成功 ACK（iRemainSP/iRemainCSP＝提交後讀回值）
    ack.iOK = NET_OK;
    ack.iActiveSkillPageNumber = req.iActiveSkillPageNumber;
    for (const auto& p : plan) {
        GetSkillInfo info = req.mapSkillList.at(p.skillID); // 原 ACK 回顯整個 request map 結構
        info.iSpendSkillCSPoint = p.spendCSPAfter;
        ack.mapSkillList[p.skillID] = info;       // map 鍵遞增（與 req map 一致）
    }
    ack.iRemainSP = commit.sPointAbsolute;
    ack.iRemainCSP = commit.csPoint;
    err.clear();
    return ack.iOK;
}

} // namespace get_skill
} // namespace x2
