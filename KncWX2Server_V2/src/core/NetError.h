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
inline constexpr int ERR_CREATE_UNIT_01 = 26;  // 暱稱已存在 / PvP NPC 保留暱稱（CREATE_UNIT 與 CHANGE_NICK_NAME 決策共用，與原碼一致）
inline constexpr int ERR_CREATE_UNIT_02 = 27;  // 交易（事務）錯誤
inline constexpr int ERR_CREATE_UNIT_03 = 28;  // 角色資料讀取失敗
inline constexpr int ERR_CREATE_UNIT_04 = 29;  // 暱稱長度錯誤
inline constexpr int ERR_CREATE_UNIT_05 = 30;  // 無法再建立角色（達上限）
inline constexpr int ERR_CREATE_UNIT_06 = 31;  // 暱稱 14 天冷卻中
inline constexpr int ERR_CREATE_UNIT_07 = 32;  // Nexon Messenger CharacterSN 建立失敗
inline constexpr int ERR_CREATE_UNIT_08 = 33;  // 無法使用的暱稱
inline constexpr int ERR_CREATE_UNIT_09 = 34;  // 每日建立上限
inline constexpr int ERR_CREATE_UNIT_11 = 1289; // 初始職業限制（IsInitNormalJob；enum 機讀計數核對於 2026-11-17，NetError_def.h 顯式賦值＝1289）
inline constexpr int ERR_SELECT_UNIT_00 = 35;  // 選擇的角色不在此遊戲伺服器
inline constexpr int ERR_SELECT_UNIT_01 = 36;  // 角色職業異常
inline constexpr int ERR_SELECT_UNIT_03 = 37;  // 復活石資訊 DB 錯誤
inline constexpr int ERR_SELECT_UNIT_04 = 38;  // Nexon Messenger CharacterSN 取得失敗
inline constexpr int ERR_SELECT_UNIT_05 = 39;  // 角色選擇過程 DB 錯誤
inline constexpr int ERR_SELECT_UNIT_06 = 40;  // 暱稱需要變更
inline constexpr int ERR_SELECT_UNIT_07 = 1081; // 非正常的角色選擇（實測編譯值）
// NetError_def.h enum 計數機讀核對（無 #ifdef，純連續 enum；與上列實測值吻合）
inline constexpr int ERR_COMMUNITY_OPT_01 = 240;  // 없는 상태 값을 업데이트 하려고 하였습니다.（無效的拒絕選項值）
inline constexpr int ERR_COMMUNITY_OPT_02 = 241;  // 커뮤니티 옵션 값을 받아오지 못했습니다.（CommunityOpt DB 失敗）
// ERR_BLACKLIST_00..07（242..249；原 NetError_def.h enum 機讀值）
inline constexpr int ERR_BLACKLIST_00 = 242;  // 黑名單已達上限
inline constexpr int ERR_BLACKLIST_01 = 243;  // 已在黑名單
inline constexpr int ERR_BLACKLIST_02 = 244;  // 不在黑名單
inline constexpr int ERR_BLACKLIST_03 = 245;  // 對象不存在
inline constexpr int ERR_BLACKLIST_04 = 246;  // 黑名單 DB 刪除失敗
inline constexpr int ERR_BLACKLIST_05 = 247;  // 不能把自己加入黑名單
inline constexpr int ERR_BLACKLIST_06 = 248;  // 不能從黑名單刪除自己
inline constexpr int ERR_BLACKLIST_07 = 249;  // 只能加入目前在線的使用者（V2 無在線狀態）
inline constexpr int ERR_STATISTICS_00 = 327;  // 負的平均幀率
// ERR_EXPAND_INVENTORY_ED_01..03（1355..1357；原 NetError_def.h enum 機讀值）
inline constexpr int ERR_EXPAND_INVENTORY_ED_01 = 1355;  // ED 不足
inline constexpr int ERR_EXPAND_INVENTORY_ED_02 = 1356;  // 背包欄位已達上限
inline constexpr int ERR_EXPAND_INVENTORY_ED_03 = 1357;  // 找不到有效擴充費用
// ERR_WISH_LIST_*（2026-11-17 以 g++ 編譯原 NetError_def.h 實測）
inline constexpr int ERR_WISH_LIST_00 = 450;  // 찜 리스트에 등록할 수 없는 상품입니다.（不可加入願望清單的商品——V2 無腳本表，不產生此碼）
inline constexpr int ERR_WISH_LIST_02 = 451;  // 찜 리스트에 더 이상 상품을 등록할 수 없습니다.（願望清單已滿／寫入失敗借用）
// NetError_def.h enum 計數機讀核對（前綴均連續 enum，已驗證 CREATE_UNIT_00=25/SELECT_UNIT_05=39/SELECT_UNIT_07=1081 顯式值等與既有常數一致）
inline constexpr int ERR_RESTORE_NICK_NAME_00 = 328; // 無法找到角色（gup_restore_nickname -1）
inline constexpr int ERR_RESTORE_NICK_NAME_01 = 329; // 非暱稱復原對象（gup_restore_nickname -2）
inline constexpr int ERR_RESTORE_NICK_NAME_04 = 332; // 暱稱復原失敗（gup_restore_nickname -5；SP 未命中）
inline constexpr int ERR_RESTORE_NICK_NAME_02 = 330; // 同名暱稱已存在（原 gup_check_nickname -1）
inline constexpr int ERR_RESTORE_NICK_NAME_03 = 331; // 暱稱 14 天冷卻中（原 gup_check_nickname -2）
inline constexpr int ERR_RESTORE_NICK_NAME_05 = 333; // 非法暱稱（過濾器/注入標記）
inline constexpr int ERR_RESTORE_NICK_NAME_06 = 334; // 暱稱長度錯誤
inline constexpr int ERR_DELETE_UNIT_00 = 986; // 無法找到要刪除的角色（原 -1/-1）
inline constexpr int ERR_DELETE_UNIT_05 = 987; // 角色刪除失敗（原 -1 以外的其他失敗）
// ERR_DELETE_UNIT_01..04 = 979..982（[CN] SERV_UNIT_WAIT_DELETE 路徑，該巨集未定義且 JP 未啟用）
// ERR_DELETE_UNIT_06 = 1258（인연 상태不可刪除；V2 無 Relationship 系統）
inline constexpr int ERR_VERIFY_21      = 578;  // 認證過程系統錯誤（實測編譯值）
// ERR_TITLE_*（494–499；2026-11-17 以 g++ 直接編譯原 NetError_def.h 實測，與 JP build 一致）
inline constexpr int ERR_TITLE_00 = 494;  // 보유하고 있는 칭호가 아닙니다.（未持有該稱號）
inline constexpr int ERR_TITLE_01 = 495;  // 이미 장착중인 칭호입니다.（已裝備中）
inline constexpr int ERR_TITLE_02 = 496;  // 사용 가능한 기간이 지난 칭호입니다.（已過期）
inline constexpr int ERR_TITLE_03 = 497;  // 존재하지 않는 칭호입니다.（不存在該稱號）
inline constexpr int ERR_TITLE_04 = 498;  // 칭호를 획득하지 못했습니다.
inline constexpr int ERR_TITLE_05 = 499;  // 이미 보유 중인 칭호입니다.
// ERR_SKILL_*（182–206；2026-11-18 以 g++ -fpermissive 直接編譯原 Common/Neterror/NetError_def.h 機讀核對，五個地區變體 JP/TW/CN/US/Global 一致；純連續 enum）
//   ⚠ 更正：本檔早前（2026-11-18 早些時候）ERR_SKILL_09/10/13/14 誤植 164/165/167/168（手工計數）；
//   g++ 機讀實測連續 enum 為 190/191/193/194，已隨 §0a26 修正（tests/test_change_skill_slot.cpp 同步修正）。
inline constexpr int ERR_SKILL_00 = 182;  // 이미 최고 레벨까지 배운 스킬입니다.（已達最高等級；V2 借用為「技能列 upsert／gunit SP 寫入 DB 失敗」語列）
inline constexpr int ERR_SKILL_01 = 183;  // 존재하지 않는 스킬입니다.（不存在的技能）
inline constexpr int ERR_SKILL_03 = 184;  // 레벨이 낮아서 아직 스킬을 배울 수 없습니다.（角色等級不足）
inline constexpr int ERR_SKILL_07 = 188;  // 선행 습득 스킬을 배우지 않았습니다.（未學前置技能）
inline constexpr int ERR_SKILL_09 = 190;  // 변경할 스킬 슬롯 아이디가 잘못되었습니다.（技能欄位 ID 錯誤；原碼 CHECK/GET_SKILL_REQ 亦用於空 mapSkillList）
inline constexpr int ERR_SKILL_10 = 191;  // 배우지 않은 스킬을 등록하려고 하였습니다.（未學會的技能）
inline constexpr int ERR_SKILL_13 = 193;  // 스킬 슬롯 B를 사용하실 수 없습니다.（技能欄位 B 不可用／已過期）
inline constexpr int ERR_SKILL_14 = 194;  // 스킬 슬롯 B 확장 중 DB오류가 발생하였습니다.（V2 借用為「技能欄位寫入 DB 失敗」語列）
inline constexpr int ERR_SKILL_15 = 195;  // 봉인 해제되지 않은 스킬은 배울 수 없습니다.（未解封技能）
inline constexpr int ERR_SKILL_16 = 196;  // 배울 수 없는 계층에 있는 스킬입니다.（不可學習的職業）
inline constexpr int ERR_SKILL_17 = 197;  // 스킬 포인트가 부족해서 스킬을 획득할 수 없습니다.（技能點不足／請求等級遞減非法）
inline constexpr int ERR_SKILL_18 = 198;  // 스킬 포인트가 부족해서 스킬을 획득할 수 없습니다.（技能點不足）
inline constexpr int ERR_SKILL_19 = 199;  // 존재하지 않는 스킬의 정보를 변경하려고 하였습니다.（修改不存在的技能）
inline constexpr int ERR_SKILL_21 = 201;  // 스킬 제한 레벨보다 높은 레벨로 설정하려고 하였습니다.（超過技能等級上限）
inline constexpr int ERR_SKILL_29 = 1278; // 동일 등급의 스킬을 동시에 습득하려고 합니다.（同階技能互斥）
inline constexpr int ERR_ODBC_01 = 555;  // ODBC 실패（原 DBE 系查詢失敗 primordial 值；V2 用於 EGS_GET_SKILL_REQ 提交前 DB 讀取失敗映射）
// ERR_SKILL_20 / ERR_SKILL_24 / ERR_SKILL_PAGE_01 / ERR_RESET_SKILL_00..05（200·204·1387·444..449；2026-11-18 以 g++ -fpermissive 直接編譯原 Common/Neterror/NetError_def.h 機讀核對，五個地區變體 JP/TW/CN/US/Global 全部一致）
inline constexpr int ERR_SKILL_20 = 200;  // 스킬 레벨 정보가 이상합니다.（技能等級資訊異常——V2 用於「未學會/等級不足 1」）
inline constexpr int ERR_SKILL_24 = 204;  // 캐시 스킬포인트 정보 갱신이 실패하였습니다.（現金技能點更新失敗）
inline constexpr int ERR_SKILL_PAGE_01 = 1387;  // 클라이언트에서 보내준 활성화된 스킬 페이지 번호가 서버의 정보와 다릅니다.（作用技能頁不一致）
inline constexpr int ERR_SKILL_PAGE_02 = 1390;  // 더이상 스킬 페이지를 확장 할 수 없습니다.（技能頁已達上限）
inline constexpr int ERR_SKILL_PAGE_03 = 1388;  // 사용하기로 선택한 스킬 페이지가 이상 합니다.（選擇的技能頁碼超出已擴充範圍）
inline constexpr int ERR_SKILL_PAGE_04 = 1386;  // 활성화 중인 스킬 페이지 번호가 이상 합니다.（作用技能頁碼異常）
inline constexpr int ERR_SKILL_PAGE_06 = 1391;  // 스킬 페이지를 확장한 적이 없는데 페이지 변경을 시도함（未曾擴充技能頁）
inline constexpr int ERR_SKILL_PAGE_07 = 1392;  // 스킬 페이지 변경 업데이트 실패（技能頁切換 DB 更新失敗）
inline constexpr int ERR_RESET_SKILL_00 = 444;  // 존재하지 않는 스킬입니다.（不存在的技能）
inline constexpr int ERR_RESET_SKILL_01 = 445;  // 스킬 초기화 아이템이 존재하지 않습니다.（無技能重置道具）
inline constexpr int ERR_RESET_SKILL_02 = 446;  // 스킬 초기화 아이템을 DB에서 삭제하지 못했습니다.（重置道具 DB 更新/刪除失敗）
inline constexpr int ERR_RESET_SKILL_03 = 447;  // 스킬 초기화 DB쿼리 결과 실패가 반환되었습니다.（技能重置 DB 查詢失敗）
inline constexpr int ERR_RESET_SKILL_04 = 448;  // 초기화 할 수 없는 스킬입니다.（不可初始化的技能——V2 本切片不產生此碼）
inline constexpr int ERR_RESET_SKILL_05 = 449;  // 스킬 슬롯에 장착 중인 스킬은 초기화 할 수 없습니다.（已裝備中的技能不可重置）
// ERR_INVENTORY_LOCK_00 = 1030 / ERR_ODBC_01 = 555：原值已核對（同為全地區一致），V2 無對應路徑（無背包鎖定/無 ODBC）——本切片不使用。

} // namespace x2
