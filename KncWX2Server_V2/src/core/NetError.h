// NetError.h — 原 NetError_def.h 的常用子集（數值與原碼完全一致）
// 原檔有 ~200 個代碼；V2 只保留已用到的，之後按需擴充（新增時照抄數值，勿重排）。
#pragma once

namespace x2 {

inline constexpr int NET_OK        = 0;   // 成功
// ERR_UNKNOWN                       = 1
// ERR_CLIENT_STATE                  = 2
inline constexpr int ERR_CONNECT_00 = 3;   // 版本不符
inline constexpr int ERR_CONNECT_04 = 4;   // 伺服器滿
inline constexpr int ERR_CONNECT_05 = 5;   // 維護中
// ERR_VERIFY_00..03                 = 6..9
inline constexpr int ERR_VERIFY_04  = 10;  // 유저가 존재하지 않습니다 (使用者不存在)
// ERR_VERIFY_05                     = 11  (已刪除的使用者)
inline constexpr int ERR_VERIFY_06  = 12;  // 패스워드가 다릅니다 (密碼錯誤)
// ERR_VERIFY_08                     = 13
inline constexpr int ERR_VERIFY_10  = 14;  // NEXON 認證失敗
inline constexpr int ERR_VERIFY_11  = 15;  // 已封鎖的帳號
inline constexpr int ERR_CREATE_UNIT_00 = 25;  // 已刪除的使用者建立角色
inline constexpr int ERR_CREATE_UNIT_01 = 26;  // 暱稱已存在
inline constexpr int ERR_CREATE_UNIT_02 = 27;  // 交易（事務）錯誤
inline constexpr int ERR_CREATE_UNIT_03 = 28;  // 角色資料讀取失敗
inline constexpr int ERR_CREATE_UNIT_04 = 29;  // 暱稱長度錯誤
inline constexpr int ERR_CREATE_UNIT_05 = 30;  // 無法再建立角色（達上限）
inline constexpr int ERR_CREATE_UNIT_06 = 31;  // 暱稱 14 天冷卻中
inline constexpr int ERR_CREATE_UNIT_07 = 32;  // Nexon Messenger CharacterSN 建立失敗
inline constexpr int ERR_CREATE_UNIT_08 = 33;  // 無法使用的暱稱
inline constexpr int ERR_CREATE_UNIT_09 = 34;  // 每日建立上限
// ERR_CREATE_UNIT_10/11 未用到，數值未以編譯實測，故不添加（勿推算）
inline constexpr int ERR_SELECT_UNIT_00 = 35;  // 選擇的角色不在此遊戲伺服器
inline constexpr int ERR_SELECT_UNIT_01 = 36;  // 角色職業異常
inline constexpr int ERR_SELECT_UNIT_03 = 37;  // 復活石資訊 DB 錯誤
inline constexpr int ERR_SELECT_UNIT_04 = 38;  // Nexon Messenger CharacterSN 取得失敗
inline constexpr int ERR_SELECT_UNIT_05 = 39;  // 角色選擇過程 DB 錯誤
inline constexpr int ERR_SELECT_UNIT_06 = 40;  // 暱稱需要變更
inline constexpr int ERR_SELECT_UNIT_07 = 1081; // 非正常的角色選擇（實測編譯值）
// NetError_def.h enum 計數機讀核對（前綴均連續 enum，已驗證 CREATE_UNIT_00=25/SELECT_UNIT_05=39/SELECT_UNIT_07=1081 顯式值等與既有常數一致）
inline constexpr int ERR_DELETE_UNIT_00 = 986; // 無法找到要刪除的角色（原 -1/-1）
inline constexpr int ERR_DELETE_UNIT_05 = 987; // 角色刪除失敗（原 -1 以外的其他失敗）
// ERR_DELETE_UNIT_01..04 = 979..982（[CN] SERV_UNIT_WAIT_DELETE 路徑，該巨集未定義且 JP 未啟用）
// ERR_DELETE_UNIT_06 = 1258（인연 상태不可刪除；V2 無 Relationship 系統）
inline constexpr int ERR_VERIFY_21      = 578;  // 認證過程系統錯誤（實測編譯值）

} // namespace x2
