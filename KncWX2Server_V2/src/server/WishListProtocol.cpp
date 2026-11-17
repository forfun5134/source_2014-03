// WishListProtocol.cpp — 見 .h 檔頭的語意對照與偏差聲明
#include "WishListProtocol.h"

#include "../core/NetError.h"
#include "../core/Serializer.h"
#include "WireHelpers.h"

namespace x2 { namespace wish_list {

bool PutGetWishListReq(Serializer& ks, const GetWishListReq&)   { return true; }   // NOPARAM
bool GetGetWishListReq(Serializer& ks, GetWishListReq& v)       { v = GetWishListReq{}; return true; }

bool PutGetWishListAck(Serializer& ks, const GetWishListAck& v)
{
    return x2::detail::PutCountPrefixMap(ks, v.m_mapWishList,
        [](Serializer& s2, const int32_t& e) { return s2.Put(e); },
        [](Serializer& s2, const int32_t& e) { return s2.Put(e); });
}

bool GetGetWishListAck(Serializer& ks, GetWishListAck& v)
{
    return x2::detail::GetCountPrefixMap(ks, v.m_mapWishList,
        [](Serializer& s2, int32_t& e) { return s2.Get(e); },
        [](Serializer& s2, int32_t& e) { return s2.Get(e); });
}

bool PutModifyWishListReq(Serializer& ks, const ModifyWishListReq& v)
{
    return x2::detail::PutCountPrefixVec(ks, v.m_vecWishListItemID,
               [](Serializer& s2, const int32_t& e) { return s2.Put(e); })
        && ks.Put(v.m_bIsDelete);
}

bool GetModifyWishListReq(Serializer& ks, ModifyWishListReq& v)
{
    return x2::detail::GetCountPrefixVec(ks, v.m_vecWishListItemID,
               [](Serializer& s2, int32_t& e) { return s2.Get(e); })
        && ks.Get(v.m_bIsDelete);
}

bool PutModifyWishListAck(Serializer& ks, const ModifyWishListAck& v)
{
    return ks.Put(v.iOK)
        && x2::detail::PutCountPrefixVec(ks, v.m_vecWishListItemID,
               [](Serializer& s2, const int32_t& e) { return s2.Put(e); })
        && ks.Put(v.m_bIsDelete);
}

bool GetModifyWishListAck(Serializer& ks, ModifyWishListAck& v)
{
    return ks.Get(v.iOK)
        && x2::detail::GetCountPrefixVec(ks, v.m_vecWishListItemID,
               [](Serializer& s2, int32_t& e) { return s2.Get(e); })
        && ks.Get(v.m_bIsDelete);
}

void HandleGetWishListReq(db::GameStore& gameDb, int64_t userUID, GetWishListAck& ack, std::string& err)
{
    ack = GetWishListAck{};
    if (userUID <= 0) {   // 原無此檢查（DBE 以帳號 UID 查、無效即空結果）—— V2 同等處理：空 map
        err.clear();
        return;
    }
    std::map<int32_t, int32_t> m;
    if (!gameDb.GetWishList(userUID, m, err)) {
        err = std::string("get wish list: ") + err;
        return;   // ack 留空 map；呼叫端記日誌（原封包無 iOK 欄位）
    }
    ack.m_mapWishList = std::move(m);
    err.clear();
}

void HandleModifyWishListReq(db::GameStore& gameDb, int64_t userUID,
                             const ModifyWishListReq& req, ModifyWishListAck& ack, std::string& err)
{
    ack = ModifyWishListAck{};
    ack.iOK = NET_OK;
    ack.m_vecWishListItemID = req.m_vecWishListItemID;    // 原 end_proc：回顯 req
    ack.m_bIsDelete = req.m_bIsDelete;

    if (userUID <= 0) {
        ack.iOK = ERR_WISH_LIST_02;    // 原無此檢查；V2 借用「無法註冊」碼（偏差聲明 4）
        err = "invalid user uid";
        return;
    }

    std::array<int32_t, db::GameStore::kWishListSlotMax> slots;
    if (!gameDb.GetWishListSlots(userUID, slots, err)) {
        err = std::string("get wish list slots: ") + err;
        ack.iOK = ERR_WISH_LIST_02;
        return;
    }
    const std::array<int32_t, db::GameStore::kWishListSlotMax> before = slots;

    if (!req.m_bIsDelete) {
        // ── AddWish 語義（UserWishList.cpp:118–146）──
        for (int32_t itemID : req.m_vecWishListItemID) {
            if (itemID <= 0) continue;             // 原：ItemID=0 撞上第一個空槽 → 視為「已在列」→ 靜默 no-op；負值同視為無效
            bool present = false;
            for (int s = 0; s < db::GameStore::kWishListSlotMax; ++s) {
                if (slots[static_cast<size_t>(s)] == itemID) { present = true; break; }
            }
            if (present) continue;                 // 原：log + return true（冪等）
            int freeSlot = -1;
            for (int s = 0; s < db::GameStore::kWishListSlotMax; ++s) {
                if (slots[static_cast<size_t>(s)] == 0) { freeSlot = s; break; }
            }
            if (freeSlot < 0) {
                ack.iOK = ERR_WISH_LIST_02;        // 滿（原 AddWish SET_ERROR( ERR_WISH_LIST_02 )）
                err = "wish list full";
                return;                            // 未寫入（原：失敗項之後的項不再處理；V2 全無副作用——更安全）
            }
            slots[static_cast<size_t>(freeSlot)] = itemID;
        }
    } else {
        // ── DelWish 語義（UserWishList.cpp:149–185）：找到即左移壓實（SLOT_MAX-1 內壓縮，尾端補 0）──
        for (int32_t itemID : req.m_vecWishListItemID) {
            if (itemID <= 0) continue;             // 刪除 0/負值 = no-op（原不會匹配到 m_arrWishList[]==0 之外的槽……其實 0 匹配第 0 個空槽的 GetSlotData()==0；但對整體行為無意義）
            for (int s = 0; s < db::GameStore::kWishListSlotMax; ++s) {
                if (slots[static_cast<size_t>(s)] != itemID) continue;
                for (int t = s; t < db::GameStore::kWishListSlotMax - 1; ++t) {
                    slots[static_cast<size_t>(t)] = slots[static_cast<size_t>(t + 1)];
                }
                slots[static_cast<size_t>(db::GameStore::kWishListSlotMax - 1)] = 0;
                break;
            }
            // 原「找不到」：log 並中斷批次（goto end_proc）且 iOK 保持 NET_OK；
            // V2 採 drain semantics：缺項靜默跳過（偏差聲明 5）
        }
    }

    // ── write-through flush（File header 偏差聲明 3）：僅變更槽 upsert，單一 transaction ──
    std::vector<std::pair<int32_t, int32_t>> upserts;
    for (size_t s = 0; s < slots.size(); ++s) {
        if (slots[s] != before[s]) upserts.emplace_back(static_cast<int32_t>(s), slots[s]);
    }
    if (!upserts.empty()) {
        if (!gameDb.ApplyWishListChanges(userUID, upserts, err)) {
            err = std::string("apply wish list changes: ") + err;
            ack.iOK = ERR_WISH_LIST_02;            // 無對應原碼（偏差聲明 4）
            return;
        }
    }
    err.clear();
}

} // namespace wish_list
} // namespace x2
