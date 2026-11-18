// ChangeSkillSlotProtocol.cpp — 見 .h 檔頭的語意對照與偏差聲明
#include "ChangeSkillSlotProtocol.h"

#include <ctime>
#include <set>

#include "../core/NetError.h"
#include "../core/Serializer.h"

namespace x2 { namespace change_skill_slot {

bool PutChangeSkillSlotReq(Serializer& ks, const ChangeSkillSlotReq& v)
{
    return ks.Put(v.iSlotID) && ks.Put(v.iSkillID);
}

bool GetChangeSkillSlotReq(Serializer& ks, ChangeSkillSlotReq& v)
{
    return ks.Get(v.iSlotID) && ks.Get(v.iSkillID);
}

bool PutChangeSkillSlotAck(Serializer& ks, const ChangeSkillSlotAck& v)
{
    return ks.Put(v.iOK) && ks.Put(v.iSlotID) && ks.Put(v.iSkillID) &&
           ks.Put(v.iSlotID2) && ks.Put(v.iSkillID2);
}

bool GetChangeSkillSlotAck(Serializer& ks, ChangeSkillSlotAck& v)
{
    return ks.Get(v.iOK) && ks.Get(v.iSlotID) && ks.Get(v.iSkillID) &&
           ks.Get(v.iSlotID2) && ks.Get(v.iSkillID2);
}

static std::string NowUtcString()
{
    char buf[20];
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

int32_t HandleChangeSkillSlotReq(db::GameStore& gameDb, int64_t unitUID,
                                 const ChangeSkillSlotReq& req,
                                 ChangeSkillSlotAck& ack,
                                 std::string& err,
                                 const std::string& nowUtc)
{
    ack = ChangeSkillSlotAck{};   // iOK=0(NET_OK), iSlotID=-1, iSkillID=0, iSlotID2=-1, iSkillID2=0（原 ACK ctor 預設）
    err.clear();

    if (unitUID <= 0) {
        ack.iOK = ERR_SKILL_14;
        err = "invalid unit uid";
        return ack.iOK;
    }
    const std::string now = nowUtc.empty() ? NowUtcString() : nowUtc;

    // 1) 讀取技能頁狀態（含 slotA 整表缺列自癒；FK 失敗 → false → ERR_SKILL_14）
    db::SkillPageState state;
    if (!gameDb.LoadSkillPageState(unitUID, state, err)) {
        err = std::string("load skill page state: ") + err;
        ack.iOK = ERR_SKILL_14;
        return ack.iOK;
    }
    const int32_t activePage = state.activePage;   // ≥ 1

    // 2) 作用頁 8 欄位工作副本（缺列 → 全 0；A=0..3、B=4..7）
    int32_t slot[kSkillSlotCount] = { 0, 0, 0, 0, 0, 0, 0, 0 };
    for (const auto& r : state.slotA) {
        if (r.pageNumber != activePage) continue;
        for (int i = 0; i < 4; ++i) slot[i] = r.slot[i];
        break;
    }
    for (const auto& r : state.slotB) {
        if (r.pageNumber != activePage) continue;
        for (int i = 0; i < 4; ++i) slot[kSlotBFirstIndex + i] = r.slot[i];
        break;
    }

    // 3) 作用頁的「學會」技能集（原 IsExistOnThisPage：該頁 m_mapSkillTree；+ 硬編碼 6001）
    std::set<int32_t> learned;
    for (const auto& sk : state.skills) {
        if (sk.skillPageNumber == activePage && sk.skillID > 0 && sk.skillLevel > 0) {
            learned.insert(sk.skillID);
        }
    }
    learned.insert(kCommonLoveSkillId);

    // 4) SlotB 過期（unit-global EndDate；嚴格大於，同原 write 路徑；不可解析/缺列 → 哨兵 → 過期）
    const bool slotBExpired = now > state.skillSlotBEndDate;

    // 5) validate-then-commit（原 in-memory 漸進修改；V2 失敗不改任何欄位）
    const int32_t iSlotID = req.iSlotID;
    const int32_t iSkillID = req.iSkillID;

    // GetSlotID(iSkillID)：未學會 → -1；否則回傳第一個裝備該技能的欄位（無 → -1）
    int32_t iSlotID2 = -1;
    if (iSkillID > 0 && learned.count(iSkillID) != 0) {
        iSlotID2 = -1;
        for (int i = 0; i < kSkillSlotCount; ++i) {
            if (slot[i] == iSkillID) { iSlotID2 = i; break; }
        }
    } else if (iSkillID <= 0) {
        iSlotID2 = -1;   // 原 GetSlotID(0)：IsExistOnUsedPage(0)==false → -1
    }
    const int32_t iSkillID2 = (iSlotID >= 0 && iSlotID < kSkillSlotCount) ? slot[iSlotID] : 0;

    // [1] 欄位 ID 範圍
    if (iSlotID < 0 || iSlotID >= kSkillSlotCount) {
        ack.iOK = ERR_SKILL_09;
        err.clear();
        return ack.iOK;
    }

    // [2] iSkillID == 0 → 卸下（無失敗路徑）；否則須已學會；欄位 B 另驗過期
    if (iSkillID == 0) {
        // 原碼直接清空；V2 於 commit 階段一次寫入
    } else {
        // 負值 iSkillID → 未學會（偏差聲明 3）
        if (learned.count(iSkillID) == 0) {
            ack.iOK = ERR_SKILL_10;
            err.clear();
            return ack.iOK;
        }
        if (iSlotID >= kSlotBFirstIndex && slotBExpired) {
            ack.iOK = ERR_SKILL_13;
            err.clear();
            return ack.iOK;
        }
    }

    // [3] 僅當 iSlotID2 ∈ [0, 8)
    if (iSlotID2 >= 0 && iSlotID2 < kSkillSlotCount) {
        if (iSkillID2 > 0 && learned.count(iSkillID2) == 0) {
            ack.iOK = ERR_SKILL_10;
            err.clear();
            return ack.iOK;
        }
        if (iSlotID2 >= kSlotBFirstIndex && slotBExpired) {
            // 原版於此失敗路徑會先把 iSlotID2 寫成字面值 2（原碼缺陷）——V2 不重現（偏差聲明 2）
            ack.iOK = ERR_SKILL_13;
            err.clear();
            return ack.iOK;
        }
    }

    // commit：先交換 iSlotID2（若有），再寫入 iSlotID
    if (iSlotID2 >= 0 && iSlotID2 < kSkillSlotCount) {
        slot[iSlotID2] = iSkillID2;
    }
    slot[iSlotID] = iSkillID;

    // 6) write-through（單一 transaction upsert 兩列；B 列 EndDate 寫回 unit-global 值＝原 flush 行為）
    const int32_t slotA[4] = { slot[0], slot[1], slot[2], slot[3] };
    const int32_t slotB[4] = { slot[4], slot[5], slot[6], slot[7] };
    const std::string& bEnd = state.skillSlotBEndDate.empty()
        ? std::string("2000-01-01 00:00:00")
        : state.skillSlotBEndDate;
    if (!gameDb.UpdateSkillSlots(unitUID, activePage, slotA, slotB, bEnd, err)) {
        err = std::string("update skill slots: ") + err;
        ack.iOK = ERR_SKILL_14;
        return ack.iOK;
    }

    ack.iOK = NET_OK;
    ack.iSlotID = iSlotID;
    ack.iSkillID = iSkillID;
    ack.iSlotID2 = iSlotID2;    // 未在任何欄位 → -1（原碼同）
    ack.iSkillID2 = iSkillID2;  // 目標欄為空 → 0（原碼同）
    err.clear();
    return ack.iOK;
}

} // namespace change_skill_slot
} // namespace x2
