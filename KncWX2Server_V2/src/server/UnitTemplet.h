// UnitTemplet.h — 角色職業（iClass）驗證片段（原 CXSLUnit::GetUnitTemplet / IsInitNormalJob，Common/X2Data/XSLUnit*.cpp）。
// （V2 `x2::unit_templet` 命名空間）
//
// 1) UnitTempletExists（ templet 存在性閘門；原 `SiCXSLUnitManager()->GetUnitTemplet(iClass) == NULL → ERR_CREATE_UNIT_03(28)`，
//    SERV_CHECK_CREATE_UNIT_CLASS 之前的位置）
//    ⚠ 資料源是執行期載入的 UnitTemplet.lua（GSSimLayer），**該檔未隨本倉庫提供**；ScriptData/UnitTemplet.mdb
//    經查為 2007 樣板（UnitClass 表 14 列／Units 表**僅 1 列**、欄位為初版 ELISIS 結構），與 2014 前提不符。
//    本函式以「JP INT_INTERNAL 建置旗標下已宣告的可玩職業」作為 templet 存在性的**模型**
//    （UnitClassData.inc，tools/gen_unit_classes.py 自 XSLUnit.h UNIT_CLASS enum 依 ServerDefine.h #define 機械求值產生；
//    UC_NONE=0／UC_MAX 哨兵除外，共 55 個 iClass：1..32、100..122）。
//    模型假設已宣告之可玩職業在部署 templet 表中皆有列（已發佈職業成立）；templet 名稱／IsFirstChangeJob 仍未建模。
// 2) IsInitNormalJob（原 #ifdef SERV_CHECK_CREATE_UNIT_CLASS 之 class 閘門，→ ERR_CREATE_UNIT_11=1289）
//    JP 內部版本定義齊全 → 初始普通職業 = 1..9（1 UC_ELSWORD_SWORDMAN … 9 UC_ADD_NASOD_RULER）。
#pragma once

namespace x2 { namespace unit_templet {

// templet 存在性（enum 模型；見上）；僅含已宣告之可玩職業。
bool UnitTempletExists(int unitClass);

// 初始普通職業（JP 定義全開）：1..9。
bool IsInitNormalJob(int unitClass);

} // namespace unit_templet
} // namespace x2
