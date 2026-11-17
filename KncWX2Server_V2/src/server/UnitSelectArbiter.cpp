// UnitSelectArbiter.cpp — 見 UnitSelectArbiter.h 的流程對照
#include "UnitSelectArbiter.h"
#include "../core/NetError.h"

namespace x2 { namespace select_unit {

int32_t HandleSelectUnitReq(db::GameStore& gameDb, int64_t userUID, const SelectUnitReq& req,
                            SelectUnitAck& ack, std::string& err,
                            bool secondSecurityOk,
                            db::GUnitRecord* outUnit)
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
    if (outUnit) {
        bool found2 = false;
        if (!gameDb.GetUnitByUID(req.unitUID, *outUnit, found2, err) || !found2) {
            // 記錄剛寫過卻讀不回：視為 DB 錯誤（誠實失敗，不假裝成功）
            if (err.empty()) err = "unit vanished between RecordUnitLogin and re-read";
            ack.iOK = ERR_SELECT_UNIT_05;
            return ack.iOK;
        }
    }

    ack.iOK = NET_OK;
    err.clear();
    return ack.iOK;
}

}} // namespace x2::select_unit
