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
// ERR_CREATE_UNIT_00..09            = 25..34
inline constexpr int ERR_SELECT_UNIT_00 = 35;  // 選擇的角色不在此遊戲伺服器
inline constexpr int ERR_SELECT_UNIT_01 = 36;  // 角色職業異常
inline constexpr int ERR_SELECT_UNIT_03 = 37;  // 復活石資訊 DB 錯誤
inline constexpr int ERR_SELECT_UNIT_04 = 38;  // Nexon Messenger CharacterSN 取得失敗
inline constexpr int ERR_SELECT_UNIT_05 = 39;  // 角色選擇過程 DB 錯誤
inline constexpr int ERR_SELECT_UNIT_06 = 40;  // 暱稱需要變更
inline constexpr int ERR_SELECT_UNIT_07 = 1081; // 非正常的角色選擇（實測編譯值）
inline constexpr int ERR_VERIFY_21      = 578;  // 認證過程系統錯誤（實測編譯值）

} // namespace x2
