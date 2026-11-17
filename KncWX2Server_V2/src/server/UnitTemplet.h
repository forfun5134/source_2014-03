// UnitTemplet.h — 角色職業（iClass）驗證片段（原 CXSLUnit::IsInitNormalJob，Common/X2Data/XSLUnit.cpp）。
// （V2 `x2::unit_templet` 命名空間）
//
// 原碼 IsInitNormalJob 於 #ifdef SERV_UNIT_CLASS_CHANGE_ITEM（ServerDefine.h 已定義）內；
//   JP 內部版本定義齊全（SERV_ARA_MARTIAL_ARTIST／SERV_NEW_CHARACTER_EL／SERV_9TH_NEW_CHARACTER 皆定義），
//   且 CREATE_UNIT 的呼叫端另以 #ifdef SERV_CHECK_CREATE_UNIT_CLASS（ServerDefine.h:3911 已定義）包裹 → JP 建置生效。
// 初始普通職業集合（JP 定義全開）：1..9
//   1 UC_ELSWORD_SWORDMAN／2 UC_ARME_VIOLET_MAGE／3 UC_LIRE_ELVEN_RANGER／4 UC_RAVEN_FIGHTER／
//   5 UC_EVE_NASOD／6 UC_CHUNG_IRON_CANNON／7 UC_ARA_MARTIAL_ARTIST／8 UC_ELESIS_KNIGHT／9 UC_ADD_NASOD_RULER
// ⚠ 僅移植 IsInitNormalJob 這一個謂詞——templet 存在性/名稱/IsFirstChangeJob 等（XSLUnit UnitTemplet 表，
//   資料源 ScriptData/UnitTemplet.mdb）V2 無法解析（Jet4 variable-length record，access-parser 崩潰），
//   故 ERR_CREATE_UNIT_03（缺 templet → 28）閘門**未建模**：iClass=200 等不存在的 class 會被本閘門以
//   ERR_CREATE_UNIT_11（1289）拒絕，而原碼會以 ERR_CREATE_UNIT_03（28）拒絕（已知偏差）。
#pragma once

namespace x2 { namespace unit_templet {

bool IsInitNormalJob(int unitClass);

} // namespace unit_templet
} // namespace x2
