// WishListProtocol.h — EGS_GET_WISH_LIST_REQ/ACK、EGS_MODIFY_WISH_LIST_REQ/ACK（찜 리스트）wire 結構＋決策。
// （V2 `x2::wish_list` 命名空間）§0a21。
//
// 對齊對象：原 X2Project（ SERV_* 皆未定義本事件需要的宏）
//   KEGS_GET_WISH_LIST_ACK    { std::map<int,int> m_mapWishList; }                  （ClientPacket.h:4880）
//   KEGS_MODIFY_WISH_LIST_REQ { std::vector<int> m_vecWishListItemID; bool m_bIsDelete; } （:4887）
//   KEGS_MODIFY_WISH_LIST_ACK { int m_iOK; std::vector<int> m_vecWishListItemID; bool m_bIsDelete; }（:4893）
//   EGS_GET_WISH_LIST_REQ 為 NOPARAM（無欄位）                                    （GSUserCashShop.cpp:6816 IMPL_ON_FUNC_NOPARAM）
//   事件 ID（V2 EventIDs.h）：GET REQ=509 / GET ACK=510 / MODIFY REQ=511 / MODIFY ACK=512。
//   PUT/GET 順序機讀自原 ClientPacket.cpp:7093–7139；map<int,int> 以 eTAG_MAP 語意（DWORD BE 個數＋ (key,value) 對），
//   vector<int> 同理（無包裝）；bool 1 byte（0/1）。
//
// HandleGetWishListReq 對應原 EGS_GET_WISH_LIST_REQ handler（GSUserCashShop.cpp:6815–6822）：
//   VERIFY_STATE(S_FIELD_MAP/S_ROOM) → m_kUserWishList.GetWishList(ack.m_mapWishList) → ACK。
//   原 in-memory GetWishList 會剔除「現金商城已下架商品」（SiKBillManager::GetSellCashItemList）與 WishListNoItem
//   ——**V2 無腳本 DB → 不做此過濾**（見偏差聲明 2）。原 GetWishList 非 SERV_WISH_LIST_BUG_FIX 分支只輸出 ItemID > 0 槽。
//
// HandleModifyWishListReq 對應原 EGS_MODIFY_WISH_LIST_REQ handler（GSUserCashShop.cpp:6824–6925）：
//   1) 校驗（VERIFY_STATE_ACK；S_FIELD_MAP/S_ROOM——V2 無 FSM，不適用）
//   2) 非刪除模式：逐項 SiCXSLItemManager()->GetItemTemplet 查腳本表（不存在 → ERR_WISH_LIST_00；
//      原排除轉職/銀行擴充/技能頁擴充/活動假商品/IsPossibleCart——全部皆腳本表查詢，V2 無腳本 DB → 全部不做；偏差聲明 2）
//   3) AddWish：已在列 → 記錄＋靜默 true（no-op）；有空槽 → 放最低位空槽；滿（SLOT_MAX=21）→ ERR_WISH_LIST_02
//   4) 刪除模式：DelWish——查找 ItemID，找到則**左移壓實**（SLOT_MAX-1 格內壓縮，尾端補 0）；找不到 → 記錄後跳出（goto end_proc）
//   5) 成功 → ACK（iOK = NET_OK）＋ m_vecWishListItemID/m_bIsDelete 回顯；失敗 → iOK = GetLastError()
//   6) DB 寫入時機：原延遲到 DBE_UPDATE_UNIT_INFO_REQ → Query_UpdateWishList（僅 FlushWishListChange 標記為 IsChanged 的槽，
//      gup_update_WishList 逐槽 upsert）。V2 無 session／flush 時機 → **write-through**：單一 transaction 內
//      逐槽執行 gup_update_WishList 等價 SQL（upsert），失敗 rollback、回 ERR_WISH_LIST_02（偏差聲明 3/4）。
//
// ⚠ 偏差聲明（V2 vs 原版）：
//   1. 願望清單為**帳號級（UserUID）**資料——原 GItemWishList FK→GUser、本 handler 以 userUID 為鍵（與選角無關）。
//   2. **腳本 DB 缺失**（SiCXSLItemManager/SiCXSLCashItemManager/SiKBillManager/WishListNoItem）→ 商品存在性、
//      轉職/擴充排除、下架過濾、Say「不可加入」ERR_WISH_LIST_00 **全部不做**；ERR_WISH_LIST_00 在 V2 不會被產生。
//      對策：僅以 ItemID > 0 與 SLOT_MAX=21 限制約束行為。
//   3. **write-through vs 延遲寫**：原在副本結束/登出時批次 flush；V2 立即單一 transaction 提交（與 §0a10/§0a20 同慣例）。
//   4. **錯誤碼借用**：寫入失敗無對應原碼 → 回 ERR_WISH_LIST_02（451；最接近「無法註冊商品」語意；檔頭已明示）。
//   5. 刪除模式找不到對應項：原「log + 中斷批次、以 NET_OK 結束（DelWish 不設錯誤碼）」。V2 為
//      **drain semantics**：逐項嘗試、缺項靜默跳過、其餘照常刪除（結果為最終集合差）；失敗僅來自 DB。
//      ——避免「批次中途停」造成部分可預期的殘留狀態。
//   6. InitWishList 越界槽（SlotNo<0 或 ≥21）在讀態被略過（原同）；NULL SlotNo/ItemID 列被略過（原 ODBC 讀 NULL 進 int 為 0，
//      語意不明確，V2 以明示的略過處理）。
//   7. map<int,int> 的序列化排序：V2 std::map 自然鍵序（原 InitWishList 以 fetch 序插入、wire 上按 map 序）——一致。
//   8. 線路佈局為自洽 golden bytes，未對原 SDK 實機驗證。
#pragma once

#include <cstdint>
#include <map>
#include <string>
#include <vector>

#include "../db/GameStore.h"

namespace x2 { class Serializer; }

namespace x2 { namespace wish_list {

struct GetWishListReq          // EGS_GET_WISH_LIST_REQ（509）—— NOPARAM
{
};

struct GetWishListAck          // EGS_GET_WISH_LIST_ACK（510）
{
    std::map<int32_t, int32_t> m_mapWishList;   // SlotNo → ItemID（僅 ItemID > 0）
};

struct ModifyWishListReq       // EGS_MODIFY_WISH_LIST_REQ（511）
{
    std::vector<int32_t> m_vecWishListItemID;
    bool                 m_bIsDelete = false;
};

struct ModifyWishListAck       // EGS_MODIFY_WISH_LIST_ACK（512）
{
    int32_t              iOK = 0;                // NetError（NET_OK=0；ERR_WISH_LIST_02=451——寫入失敗借用；ERR_WISH_LIST_00 不產生）
    std::vector<int32_t> m_vecWishListItemID;    // 回顯 req
    bool                 m_bIsDelete = false;    // 回顯 req
};

bool PutGetWishListReq(Serializer& ks, const GetWishListReq& v);
bool GetGetWishListReq(Serializer& ks, GetWishListReq& v);
bool PutGetWishListAck(Serializer& ks, const GetWishListAck& v);
bool GetGetWishListAck(Serializer& ks, GetWishListAck& v);
bool PutModifyWishListReq(Serializer& ks, const ModifyWishListReq& v);
bool GetModifyWishListReq(Serializer& ks, ModifyWishListReq& v);
bool PutModifyWishListAck(Serializer& ks, const ModifyWishListAck& v);
bool GetModifyWishListAck(Serializer& ks, ModifyWishListAck& v);

// 決策層（unitUID 不使用；願望清單為帳號級——原 GetCharUID 對應 userUID，由呼叫端傳入）：

// GET：讀取持有願望商品（ItemID > 0）；ACK 無 iOK 欄位（原封包同）。失敗 → map 空＋err（呼叫端記日誌）。
void HandleGetWishListReq(db::GameStore& gameDb, int64_t userUID, GetWishListAck& ack, std::string& err);

// MODIFY：依 req.m_bIsDelete 走 AddWish / DelWish 語義（見檔頭 3–5），寫入前做滿額校驗；
//   寫入成功才 ACK NET_OK；任何 DBE 失敗 → 全 rollback＋ERR_WISH_LIST_02。ack 回顯 req（原 end_proc 慣例）。
void HandleModifyWishListReq(db::GameStore& gameDb, int64_t userUID,
                             const ModifyWishListReq& req, ModifyWishListAck& ack, std::string& err);

} // namespace wish_list
} // namespace x2
