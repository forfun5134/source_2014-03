// EquipTitleProtocol.cpp — 見 .h 檔頭的語意對照與偏差聲明
#include "EquipTitleProtocol.h"

#include <ctime>

#include "../core/NetError.h"
#include "../core/Serializer.h"

namespace x2 { namespace equip_title {

bool PutEquipTitleReq(Serializer& ks, const EquipTitleReq& v)
{
    return ks.Put(v.iTitleID);
}

bool GetEquipTitleReq(Serializer& ks, EquipTitleReq& v)
{
    return ks.Get(v.iTitleID);
}

bool PutEquipTitleAck(Serializer& ks, const EquipTitleAck& v)
{
    return ks.Put(v.iOK) && ks.Put(v.iTitleID);
}

bool GetEquipTitleAck(Serializer& ks, EquipTitleAck& v)
{
    return ks.Get(v.iOK) && ks.Get(v.iTitleID);
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

// true = EndDate 非空且為「已過期」；無法解析 → fail closed（視為過期）
static bool IsExpired(const db::TitleCompleteRecord& t, const std::string& nowUtc)
{
    if (t.endDateNull) return false;   // NULL = 永久
    if (t.endDate.empty()) return false;
    if (t.endDate.size() != 19) return true;
    for (size_t i : { 0,1,2,3,5,6,8,9,11,12,14,15,17,18 }) {
        if (t.endDate[i] < '0' || t.endDate[i] > '9') return true;
    }
    return nowUtc > t.endDate;   // 固定寬度 UTC 字串可直接字典序比較
}

int32_t HandleEquipTitleReq(db::GameStore& gameDb, int64_t unitUID,
                            const EquipTitleReq& req,
                            EquipTitleAck& ack,
                            std::string& err,
                            const std::string& nowUtc)
{
    ack = EquipTitleAck{};
    ack.iOK = NET_OK;
    ack.iTitleID = req.iTitleID;   // 原碼回顯輸入值（不歸零）

    if (unitUID <= 0 || req.iTitleID < 0) {
        ack.iOK = ERR_TITLE_03;    // 非法輸入（原 IsExistTitleID 失敗 → ERR_TITLE_03；不可為負）
        err = "invalid uid or title id";
        return ack.iOK;
    }

    const std::string now = nowUtc.empty() ? NowUtcString() : nowUtc;

    // 讀取持有稱號（單次；選出 owned / 現裝備態 / 過期性）
    std::vector<db::TitleCompleteRecord> titles;
    if (!gameDb.GetTitleCompleteList(unitUID, titles, err)) {
        err = std::string("get title complete list: ") + err;
        ack.iOK = ERR_TITLE_04;    // DB 失敗（見檔頭偏差聲明 2）
        return ack.iOK;
    }
    int32_t currentEquipped = 0;
    int32_t equippedCount = 0;
    for (const auto& t : titles) {
        if (t.isHang) { ++equippedCount; if (currentEquipped == 0) currentEquipped = t.titleID; }
    }

    if (req.iTitleID == 0) {
        // 脫下（全部）；無 [1]–[4] 驗證（原碼同）
        if (!gameDb.EquipTitleHang(unitUID, /*oldTitleID=*/0, /*newTitleID=*/0, err)) {
            err = std::string("unequip title: ") + err;
            ack.iOK = ERR_TITLE_04;
            return ack.iOK;
        }
        err.clear();
        return ack.iOK;
    }

    // [2] 已裝備中？
    if (currentEquipped == req.iTitleID) {
        ack.iOK = ERR_TITLE_01;
        err.clear();
        return ack.iOK;
    }

    // [3] 持有？
    const db::TitleCompleteRecord* owned = nullptr;
    for (const auto& t : titles) {
        if (t.titleID == req.iTitleID) { owned = &t; break; }
    }
    if (owned == nullptr) {
        ack.iOK = ERR_TITLE_00;
        err.clear();
        return ack.iOK;
    }

    // [4] 過期？
    if (IsExpired(*owned, now)) {
        ack.iOK = ERR_TITLE_02;
        err.clear();
        return ack.iOK;
    }

    // 寫入（write-through；原延遲到 DBE_UPDATE_UNIT_INFO_REQ，見檔頭偏差聲明 2）
    if (!gameDb.EquipTitleHang(unitUID, currentEquipped, req.iTitleID, err)) {
        err = std::string("equip title: ") + err;
        ack.iOK = ERR_TITLE_04;
        return ack.iOK;
    }
    err.clear();
    return ack.iOK;
}

} // namespace equip_title
} // namespace x2
