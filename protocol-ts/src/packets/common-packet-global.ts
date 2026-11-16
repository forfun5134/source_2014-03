// Auto-generated from common-packet-global (.h/.cpp) by scripts/generate.py — DO NOT EDIT MANUALLY.
/* eslint-disable @typescript-eslint/no-unused-vars */
import { KSerializer } from '../runtime/serializer.ts';
import type {
  CTimeValue,
  Float32,
  Float64,
  Int8,
  Int16,
  Int32,
  Int64,
  UInt8,
  UInt16,
  UInt32,
  UInt64,
  UidType,
} from '../runtime/types.ts';
import { resolveFlags } from '../flags/presets.ts';
import type { FlagInput, ServerFlags } from '../flags/server-flags.ts';
import { type KPacketOK, createKPacketOK, putKPacketOK, getKPacketOK } from './common-packet.ts';
import { type KRewardData, createKRewardData, putKRewardData, getKRewardData } from './common-packet.ts';
export { type EVENT_DATA, createEVENT_DATA, putEVENT_DATA, getEVENT_DATA } from './common-packet.ts';
export { type KRewardData, createKRewardData, putKRewardData, getKRewardData };

export interface KGuildInviteMsgInfo {
}
export function createKGuildInviteMsgInfo(flags?: FlagInput): KGuildInviteMsgInfo {
  const f = resolveFlags(flags);
  return {};
}
export function putKGuildInviteMsgInfo(ks: KSerializer, obj: KGuildInviteMsgInfo, flags?: FlagInput): boolean {
  return true;
}
export function getKGuildInviteMsgInfo(ks: KSerializer, flags?: FlagInput): KGuildInviteMsgInfo {
  return createKGuildInviteMsgInfo(flags);
}

export interface KGuildFindAdInfo {
}
export function createKGuildFindAdInfo(flags?: FlagInput): KGuildFindAdInfo {
  const f = resolveFlags(flags);
  return {};
}
export function putKGuildFindAdInfo(ks: KSerializer, obj: KGuildFindAdInfo, flags?: FlagInput): boolean {
  return true;
}
export function getKGuildFindAdInfo(ks: KSerializer, flags?: FlagInput): KGuildFindAdInfo {
  return createKGuildFindAdInfo(flags);
}

export const KGlobalCashInfo_GLOBAL_CASH_TYPE = {
  GCT_PUBLISHER_CASH: 0,
  GCT_KOG_ELSWORD_CASH: 1,
  GCT_KOG_ELSWORD_BONUS_POINT: 2,
  GCT_PUBLISHER_ELSWORD_CASH: 3,
  GCT_TOTAL_NUM: 4,
} as const;
export type KGlobalCashInfo_GLOBAL_CASH_TYPE = (typeof KGlobalCashInfo_GLOBAL_CASH_TYPE)[keyof typeof KGlobalCashInfo_GLOBAL_CASH_TYPE];
export function getKGlobalCashInfo_GLOBAL_CASH_TYPE(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) {
    cur = 0;
    out['GCT_PUBLISHER_CASH'] = cur;
    cur += 1;
  }
  if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) {
    cur = 1;
    out['GCT_KOG_ELSWORD_CASH'] = cur;
    cur += 1;
  }
  if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) {
    cur = 2;
    out['GCT_KOG_ELSWORD_BONUS_POINT'] = cur;
    cur += 1;
  }
  if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) {
    cur = 3;
    out['GCT_PUBLISHER_ELSWORD_CASH'] = cur;
    cur += 1;
  }
  if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) {
    out['GCT_TOTAL_NUM'] = cur;
    cur += 1;
  }
  return out;
}
export interface KGlobalCashInfo {
  m_ulCash?: UInt32[];
}
export function createKGlobalCashInfo(flags?: FlagInput): KGlobalCashInfo {
  const f = resolveFlags(flags);
  const obj: KGlobalCashInfo = {
  };
  if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) obj.m_ulCash = Array.from({ length: 4 }, () => 0);
  return obj;
}
export function putKGlobalCashInfo(ks: KSerializer, obj: KGlobalCashInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) {
    if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) { if (!(ks.putUInt32((obj.m_ulCash?.[0] ?? 0)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) { if (!(ks.putUInt32((obj.m_ulCash?.[1] ?? 0)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) { if (!(ks.putUInt32((obj.m_ulCash?.[2] ?? 0)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) { if (!(ks.putUInt32((obj.m_ulCash?.[3] ?? 0)))) return false; }
  }
  return true;
}
export function getKGlobalCashInfo(ks: KSerializer, flags?: FlagInput): KGlobalCashInfo {
  const f = resolveFlags(flags);
  const obj = createKGlobalCashInfo(f);
  if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) {
    if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) { (obj.m_ulCash ??= [])[0] = ks.getUInt32(); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) { (obj.m_ulCash ??= [])[1] = ks.getUInt32(); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) { (obj.m_ulCash ??= [])[2] = ks.getUInt32(); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) { (obj.m_ulCash ??= [])[3] = ks.getUInt32(); }
  }
  return obj;
}

export interface KBillProductCategory {
  m_cCategoryNo?: Int8;
  m_wstrCategoryName?: string;
  m_cParentCategoryNo?: Int8;
  m_cDisplayNo?: Int8;
}
export function createKBillProductCategory(flags?: FlagInput): KBillProductCategory {
  const f = resolveFlags(flags);
  const obj: KBillProductCategory = {
  };
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_cCategoryNo = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_wstrCategoryName = '';
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_cParentCategoryNo = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_cDisplayNo = 0;
  return obj;
}
export function putKBillProductCategory(ks: KSerializer, obj: KBillProductCategory, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt8((obj.m_cCategoryNo ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putWString((obj.m_wstrCategoryName ?? '')))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt8((obj.m_cParentCategoryNo ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt8((obj.m_cDisplayNo ?? 0)))) return false; }
  }
  return true;
}
export function getKBillProductCategory(ks: KSerializer, flags?: FlagInput): KBillProductCategory {
  const f = resolveFlags(flags);
  const obj = createKBillProductCategory(f);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_cCategoryNo = ks.getInt8(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_wstrCategoryName = ks.getWString(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_cParentCategoryNo = ks.getInt8(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_cDisplayNo = ks.getInt8(); }
  }
  return obj;
}

export interface KBillProductInfo {
  m_iProductNo?: Int32;
  m_iProductID?: Int32;
  m_bSale?: boolean;
  m_bEvent?: boolean;
  m_bShow?: boolean;
  m_bIsCashInvenSkip?: boolean;
  m_wstrProductName?: string;
  m_cCategoryNo?: Int8;
  m_iSalePrice?: Int32;
  m_iRealPrice?: Int32;
  m_cPeriod?: Int8;
  m_cQuantity?: Int8;
  m_bEnableGift?: boolean;
  m_cLimitLevel?: Int8;
  m_wstrEndDate?: string;
  m_setSalePeriod?: Set<[Int64, boolean]>;
}
export function createKBillProductInfo(flags?: FlagInput): KBillProductInfo {
  const f = resolveFlags(flags);
  const obj: KBillProductInfo = {
  };
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iProductNo = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iProductID = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_bSale = false;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_bEvent = false;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_bShow = false;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_bIsCashInvenSkip = false;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_wstrProductName = '';
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_cCategoryNo = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iSalePrice = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iRealPrice = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_cPeriod = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_cQuantity = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_bEnableGift = false;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_cLimitLevel = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_wstrEndDate = '';
  if (f.SERV_GLOBAL_BILLING && f.SERV_REAL_TIME_SALE_PERIOD_DESCRIPTION) obj.m_setSalePeriod = new Set<[Int64, boolean]>();
  return obj;
}
export function putKBillProductInfo(ks: KSerializer, obj: KBillProductInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_iProductNo ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_iProductID ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putBool((obj.m_bSale ?? false)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putBool((obj.m_bEvent ?? false)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putBool((obj.m_bShow ?? false)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putBool((obj.m_bIsCashInvenSkip ?? false)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putWString((obj.m_wstrProductName ?? '')))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt8((obj.m_cCategoryNo ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_iSalePrice ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_iRealPrice ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt8((obj.m_cPeriod ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt8((obj.m_cQuantity ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putBool((obj.m_bEnableGift ?? false)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt8((obj.m_cLimitLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putWString((obj.m_wstrEndDate ?? '')))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_REAL_TIME_SALE_PERIOD_DESCRIPTION) { if (!(ks.putSet((obj.m_setSalePeriod ?? new Set<[Int64, boolean]>()), (ks, item: [Int64, boolean]) => ks.putPair(item, (ks, a: Int64) => ks.putInt64(a), (ks, b: boolean) => ks.putBool(b))))) return false; }
  }
  return true;
}
export function getKBillProductInfo(ks: KSerializer, flags?: FlagInput): KBillProductInfo {
  const f = resolveFlags(flags);
  const obj = createKBillProductInfo(f);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iProductNo = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iProductID = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_bSale = ks.getBool(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_bEvent = ks.getBool(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_bShow = ks.getBool(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_bIsCashInvenSkip = ks.getBool(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_wstrProductName = ks.getWString(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_cCategoryNo = ks.getInt8(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iSalePrice = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iRealPrice = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_cPeriod = ks.getInt8(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_cQuantity = ks.getInt8(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_bEnableGift = ks.getBool(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_cLimitLevel = ks.getInt8(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_wstrEndDate = ks.getWString(); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_REAL_TIME_SALE_PERIOD_DESCRIPTION) { obj.m_setSalePeriod = ks.getSet<[Int64, boolean]>((ks) => ks.getPair<Int64, boolean>((ks) => ks.getInt64(), (ks) => ks.getBool())); }
  }
  return obj;
}

export interface KBillProductAttribute {
  m_iProductNo?: Int32;
  m_vecAttribute?: Int32[];
}
export function createKBillProductAttribute(flags?: FlagInput): KBillProductAttribute {
  const f = resolveFlags(flags);
  const obj: KBillProductAttribute = {
  };
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iProductNo = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_vecAttribute = ([] as Int32[]);
  return obj;
}
export function putKBillProductAttribute(ks: KSerializer, obj: KBillProductAttribute, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_iProductNo ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putVector((obj.m_vecAttribute ?? ([] as Int32[])), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  }
  return true;
}
export function getKBillProductAttribute(ks: KSerializer, flags?: FlagInput): KBillProductAttribute {
  const f = resolveFlags(flags);
  const obj = createKBillProductAttribute(f);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iProductNo = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_vecAttribute = ks.getVector<Int32>((ks) => ks.getInt32()); }
  }
  return obj;
}

export interface KBillPackageInfo {
  m_iPackageNo?: Int32;
  m_vecProductNo?: Int32[];
  m_ulProductNo?: UInt32;
  m_iProductID?: Int32;
  m_wstrProductID?: string;
  m_sProductExpire?: Int16;
  m_usProductPieces?: UInt16;
  m_vecSocketOption?: Int32[];
}
export function createKBillPackageInfo(flags?: FlagInput): KBillPackageInfo {
  const f = resolveFlags(flags);
  const obj: KBillPackageInfo = {
  };
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iPackageNo = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_vecProductNo = ([] as Int32[]);
  if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) obj.m_ulProductNo = 0;
  if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) obj.m_iProductID = 0;
  if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) obj.m_wstrProductID = '';
  if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) obj.m_sProductExpire = 0;
  if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) obj.m_usProductPieces = 0;
  if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) obj.m_vecSocketOption = ([] as Int32[]);
  return obj;
}
export function putKBillPackageInfo(ks: KSerializer, obj: KBillPackageInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_iPackageNo ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putVector((obj.m_vecProductNo ?? ([] as Int32[])), (ks, item: Int32) => ks.putInt32(item)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { if (!(ks.putUInt32((obj.m_ulProductNo ?? 0)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { if (!(ks.putInt32((obj.m_iProductID ?? 0)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { if (!(ks.putWString((obj.m_wstrProductID ?? '')))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { if (!(ks.putInt16((obj.m_sProductExpire ?? 0)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { if (!(ks.putUInt16((obj.m_usProductPieces ?? 0)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { if (!(ks.putVector((obj.m_vecSocketOption ?? ([] as Int32[])), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  }
  return true;
}
export function getKBillPackageInfo(ks: KSerializer, flags?: FlagInput): KBillPackageInfo {
  const f = resolveFlags(flags);
  const obj = createKBillPackageInfo(f);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iPackageNo = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_vecProductNo = ks.getVector<Int32>((ks) => ks.getInt32()); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { obj.m_ulProductNo = ks.getUInt32(); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { obj.m_iProductID = ks.getInt32(); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { obj.m_wstrProductID = ks.getWString(); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { obj.m_sProductExpire = ks.getInt16(); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { obj.m_usProductPieces = ks.getUInt16(); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { obj.m_vecSocketOption = ks.getVector<Int32>((ks) => ks.getInt32()); }
  }
  return obj;
}

export interface KBillBuyInfo {
  m_iProductNo?: Int32;
  m_iPoint?: Int32;
  m_iProductID?: Int32;
  m_usOrderQuantity?: UInt16;
  m_iCategory?: Int32;
  m_wstrMemo?: string;
  m_wstrOrderID?: string;
}
export function createKBillBuyInfo(flags?: FlagInput): KBillBuyInfo {
  const f = resolveFlags(flags);
  const obj: KBillBuyInfo = {
  };
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iProductNo = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iPoint = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iProductID = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_usOrderQuantity = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iCategory = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_wstrMemo = '';
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_wstrOrderID = '';
  return obj;
}
export function putKBillBuyInfo(ks: KSerializer, obj: KBillBuyInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_iProductNo ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_iPoint ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_iProductID ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putUInt16((obj.m_usOrderQuantity ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_iCategory ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putWString((obj.m_wstrMemo ?? '')))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putWString((obj.m_wstrOrderID ?? '')))) return false; }
  }
  return true;
}
export function getKBillBuyInfo(ks: KSerializer, flags?: FlagInput): KBillBuyInfo {
  const f = resolveFlags(flags);
  const obj = createKBillBuyInfo(f);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iProductNo = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iPoint = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iProductID = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_usOrderQuantity = ks.getUInt16(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iCategory = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_wstrMemo = ks.getWString(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_wstrOrderID = ks.getWString(); }
  }
  return obj;
}

export const KBillOrderInfo_BUY_CASH_ITEM_TYPE = {
  BCIT_INVALID: 0,
  BCIT_BUY_ITEM: 1,
  BCIT_COUPON: 2,
  BCIT_GIFT: 3,
} as const;
export type KBillOrderInfo_BUY_CASH_ITEM_TYPE = (typeof KBillOrderInfo_BUY_CASH_ITEM_TYPE)[keyof typeof KBillOrderInfo_BUY_CASH_ITEM_TYPE];
export function getKBillOrderInfo_BUY_CASH_ITEM_TYPE(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    cur = 0;
    out['BCIT_INVALID'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    out['BCIT_BUY_ITEM'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    out['BCIT_COUPON'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    out['BCIT_GIFT'] = cur;
    cur += 1;
  }
  return out;
}
export interface KBillOrderInfo {
  m_iTransNo?: UidType;
  m_wstrOrderID?: string;
  m_kBillProductInfo?: KBillProductInfo;
  m_vecSocketOption?: Int32[];
  m_byteType?: UInt8;
  m_wstrSenderNickName?: string;
  m_wstrSenderPresentMessage?: string;
  m_iFromUnitUID?: UidType;
  m_byteProductKind?: UInt8;
}
export function createKBillOrderInfo(flags?: FlagInput): KBillOrderInfo {
  const f = resolveFlags(flags);
  const obj: KBillOrderInfo = {
  };
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iTransNo = -1n;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_wstrOrderID = '';
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_kBillProductInfo = createKBillProductInfo(f);
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_vecSocketOption = ([] as Int32[]);
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_byteType = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_wstrSenderNickName = '';
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_wstrSenderPresentMessage = '';
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iFromUnitUID = 0n;
  if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) obj.m_byteProductKind = 0;
  return obj;
}
export function putKBillOrderInfo(ks: KSerializer, obj: KBillOrderInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt64((obj.m_iTransNo ?? -1n)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putWString((obj.m_wstrOrderID ?? '')))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putUserClass((obj.m_kBillProductInfo ?? createKBillProductInfo(f)), putKBillProductInfo, f))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putVector((obj.m_vecSocketOption ?? ([] as Int32[])), (ks, item: Int32) => ks.putInt32(item)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putUInt8((obj.m_byteType ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putWString((obj.m_wstrSenderNickName ?? '')))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putWString((obj.m_wstrSenderPresentMessage ?? '')))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt64((obj.m_iFromUnitUID ?? 0n)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { if (!(ks.putUInt8((obj.m_byteProductKind ?? 0)))) return false; }
  }
  return true;
}
export function getKBillOrderInfo(ks: KSerializer, flags?: FlagInput): KBillOrderInfo {
  const f = resolveFlags(flags);
  const obj = createKBillOrderInfo(f);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iTransNo = ks.getInt64(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_wstrOrderID = ks.getWString(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_kBillProductInfo = ks.getUserClass(getKBillProductInfo, f); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_vecSocketOption = ks.getVector<Int32>((ks) => ks.getInt32()); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_byteType = ks.getUInt8(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_wstrSenderNickName = ks.getWString(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_wstrSenderPresentMessage = ks.getWString(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iFromUnitUID = ks.getInt64(); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { obj.m_byteProductKind = ks.getUInt8(); }
  }
  return obj;
}

export interface kDisCountItemInfo {
  m_DisCountProNo?: Int32;
  m_BasicProNo?: Int32;
  m_DisCountKeepItem?: Int32[];
}
export function createkDisCountItemInfo(flags?: FlagInput): kDisCountItemInfo {
  const f = resolveFlags(flags);
  const obj: kDisCountItemInfo = {
  };
  if (f.SERV_GLOBAL_BILLING && f.SERV_KEEP_ITEM_SHOW_CASHSHOP) obj.m_DisCountProNo = 0;
  if (f.SERV_GLOBAL_BILLING && f.SERV_KEEP_ITEM_SHOW_CASHSHOP) obj.m_BasicProNo = 0;
  if (f.SERV_GLOBAL_BILLING && f.SERV_KEEP_ITEM_SHOW_CASHSHOP) obj.m_DisCountKeepItem = ([] as Int32[]);
  return obj;
}
export function putkDisCountItemInfo(ks: KSerializer, obj: kDisCountItemInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (f.SERV_GLOBAL_BILLING && f.SERV_KEEP_ITEM_SHOW_CASHSHOP) {
    if (f.SERV_GLOBAL_BILLING && f.SERV_KEEP_ITEM_SHOW_CASHSHOP) { if (!(ks.putInt32((obj.m_DisCountProNo ?? 0)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_KEEP_ITEM_SHOW_CASHSHOP) { if (!(ks.putInt32((obj.m_BasicProNo ?? 0)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_KEEP_ITEM_SHOW_CASHSHOP) { if (!(ks.putVector((obj.m_DisCountKeepItem ?? ([] as Int32[])), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  }
  return true;
}
export function getkDisCountItemInfo(ks: KSerializer, flags?: FlagInput): kDisCountItemInfo {
  const f = resolveFlags(flags);
  const obj = createkDisCountItemInfo(f);
  if (f.SERV_GLOBAL_BILLING && f.SERV_KEEP_ITEM_SHOW_CASHSHOP) {
    if (f.SERV_GLOBAL_BILLING && f.SERV_KEEP_ITEM_SHOW_CASHSHOP) { obj.m_DisCountProNo = ks.getInt32(); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_KEEP_ITEM_SHOW_CASHSHOP) { obj.m_BasicProNo = ks.getInt32(); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_KEEP_ITEM_SHOW_CASHSHOP) { obj.m_DisCountKeepItem = ks.getVector<Int32>((ks) => ks.getInt32()); }
  }
  return obj;
}

export interface KEGS_CHANGE_PVP_ROOM_PUBLIC_REQ {
  m_bPublic?: boolean;
  m_wstrPassword?: string;
}
export function createKEGS_CHANGE_PVP_ROOM_PUBLIC_REQ(flags?: FlagInput): KEGS_CHANGE_PVP_ROOM_PUBLIC_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_CHANGE_PVP_ROOM_PUBLIC_REQ = {
  };
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) obj.m_bPublic = false;
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) obj.m_wstrPassword = '';
  return obj;
}
export function putKEGS_CHANGE_PVP_ROOM_PUBLIC_REQ(ks: KSerializer, obj: KEGS_CHANGE_PVP_ROOM_PUBLIC_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) {
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { if (!(ks.putBool((obj.m_bPublic ?? false)))) return false; }
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { if (!(ks.putWString((obj.m_wstrPassword ?? '')))) return false; }
  }
  return true;
}
export function getKEGS_CHANGE_PVP_ROOM_PUBLIC_REQ(ks: KSerializer, flags?: FlagInput): KEGS_CHANGE_PVP_ROOM_PUBLIC_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_CHANGE_PVP_ROOM_PUBLIC_REQ(f);
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) {
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { obj.m_bPublic = ks.getBool(); }
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { obj.m_wstrPassword = ks.getWString(); }
  }
  return obj;
}

export interface KEGS_CHANGE_PVP_ROOM_PUBLIC_ACK {
  m_bPublic?: boolean;
  m_iOK?: Int32;
}
export function createKEGS_CHANGE_PVP_ROOM_PUBLIC_ACK(flags?: FlagInput): KEGS_CHANGE_PVP_ROOM_PUBLIC_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_CHANGE_PVP_ROOM_PUBLIC_ACK = {
  };
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) obj.m_bPublic = false;
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) obj.m_iOK = 0;
  return obj;
}
export function putKEGS_CHANGE_PVP_ROOM_PUBLIC_ACK(ks: KSerializer, obj: KEGS_CHANGE_PVP_ROOM_PUBLIC_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) {
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { if (!(ks.putBool((obj.m_bPublic ?? false)))) return false; }
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_CHANGE_PVP_ROOM_PUBLIC_ACK(ks: KSerializer, flags?: FlagInput): KEGS_CHANGE_PVP_ROOM_PUBLIC_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_CHANGE_PVP_ROOM_PUBLIC_ACK(f);
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) {
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { obj.m_bPublic = ks.getBool(); }
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { obj.m_iOK = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_CHANGE_PVP_ROOM_PUBLIC_NOT {
  m_bPublic?: boolean;
}
export function createKEGS_CHANGE_PVP_ROOM_PUBLIC_NOT(flags?: FlagInput): KEGS_CHANGE_PVP_ROOM_PUBLIC_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_CHANGE_PVP_ROOM_PUBLIC_NOT = {
  };
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) obj.m_bPublic = false;
  return obj;
}
export function putKEGS_CHANGE_PVP_ROOM_PUBLIC_NOT(ks: KSerializer, obj: KEGS_CHANGE_PVP_ROOM_PUBLIC_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) {
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { if (!(ks.putBool((obj.m_bPublic ?? false)))) return false; }
  }
  return true;
}
export function getKEGS_CHANGE_PVP_ROOM_PUBLIC_NOT(ks: KSerializer, flags?: FlagInput): KEGS_CHANGE_PVP_ROOM_PUBLIC_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_CHANGE_PVP_ROOM_PUBLIC_NOT(f);
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) {
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { obj.m_bPublic = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_CHANGE_PVP_ROOM_NAME_REQ {
  m_wstrRoomName?: string;
}
export function createKEGS_CHANGE_PVP_ROOM_NAME_REQ(flags?: FlagInput): KEGS_CHANGE_PVP_ROOM_NAME_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_CHANGE_PVP_ROOM_NAME_REQ = {
  };
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) obj.m_wstrRoomName = '';
  return obj;
}
export function putKEGS_CHANGE_PVP_ROOM_NAME_REQ(ks: KSerializer, obj: KEGS_CHANGE_PVP_ROOM_NAME_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) {
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { if (!(ks.putWString((obj.m_wstrRoomName ?? '')))) return false; }
  }
  return true;
}
export function getKEGS_CHANGE_PVP_ROOM_NAME_REQ(ks: KSerializer, flags?: FlagInput): KEGS_CHANGE_PVP_ROOM_NAME_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_CHANGE_PVP_ROOM_NAME_REQ(f);
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) {
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { obj.m_wstrRoomName = ks.getWString(); }
  }
  return obj;
}

export interface KEGS_CHANGE_PVP_ROOM_NAME_ACK {
  m_wstrRoomName?: string;
  m_iOK?: Int32;
}
export function createKEGS_CHANGE_PVP_ROOM_NAME_ACK(flags?: FlagInput): KEGS_CHANGE_PVP_ROOM_NAME_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_CHANGE_PVP_ROOM_NAME_ACK = {
  };
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) obj.m_wstrRoomName = '';
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) obj.m_iOK = 0;
  return obj;
}
export function putKEGS_CHANGE_PVP_ROOM_NAME_ACK(ks: KSerializer, obj: KEGS_CHANGE_PVP_ROOM_NAME_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) {
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { if (!(ks.putWString((obj.m_wstrRoomName ?? '')))) return false; }
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_CHANGE_PVP_ROOM_NAME_ACK(ks: KSerializer, flags?: FlagInput): KEGS_CHANGE_PVP_ROOM_NAME_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_CHANGE_PVP_ROOM_NAME_ACK(f);
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) {
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { obj.m_wstrRoomName = ks.getWString(); }
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { obj.m_iOK = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_CHANGE_PVP_ROOM_NAME_NOT {
  m_wstrRoomName?: string;
}
export function createKEGS_CHANGE_PVP_ROOM_NAME_NOT(flags?: FlagInput): KEGS_CHANGE_PVP_ROOM_NAME_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_CHANGE_PVP_ROOM_NAME_NOT = {
  };
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) obj.m_wstrRoomName = '';
  return obj;
}
export function putKEGS_CHANGE_PVP_ROOM_NAME_NOT(ks: KSerializer, obj: KEGS_CHANGE_PVP_ROOM_NAME_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) {
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { if (!(ks.putWString((obj.m_wstrRoomName ?? '')))) return false; }
  }
  return true;
}
export function getKEGS_CHANGE_PVP_ROOM_NAME_NOT(ks: KSerializer, flags?: FlagInput): KEGS_CHANGE_PVP_ROOM_NAME_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_CHANGE_PVP_ROOM_NAME_NOT(f);
  if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) {
    if (Boolean(f.SERV_NEW_PVPROOM_PROCESS)) { obj.m_wstrRoomName = ks.getWString(); }
  }
  return obj;
}

export interface KPcBangReward {
  m_iPcBangType?: Int32;
  m_fEXPRate?: Float32;
  m_fEDRate?: Float32;
  m_fVSPointRate?: Float32;
  m_bSpiritFree?: boolean;
  m_fPetEXPRate?: Float32;
  m_iAdditionalHenirReward?: Int32;
  m_bSecretDungeonFree?: boolean;
  m_bAvatar?: boolean;
  m_bTitle?: boolean;
}
export function createKPcBangReward(flags?: FlagInput): KPcBangReward {
  const f = resolveFlags(flags);
  const obj: KPcBangReward = {
  };
  if (Boolean(f.SERV_PC_BANG_TYPE)) obj.m_iPcBangType = -1;
  if (Boolean(f.SERV_PC_BANG_TYPE)) obj.m_fEXPRate = 0.0;
  if (Boolean(f.SERV_PC_BANG_TYPE)) obj.m_fEDRate = 0.0;
  if (Boolean(f.SERV_PC_BANG_TYPE)) obj.m_fVSPointRate = 0.0;
  if (Boolean(f.SERV_PC_BANG_TYPE)) obj.m_bSpiritFree = false;
  if (Boolean(f.SERV_PC_BANG_TYPE)) obj.m_fPetEXPRate = 0.0;
  if (Boolean(f.SERV_PC_BANG_TYPE)) obj.m_iAdditionalHenirReward = 0;
  if (Boolean(f.SERV_PC_BANG_TYPE)) obj.m_bSecretDungeonFree = false;
  if (Boolean(f.SERV_PC_BANG_TYPE)) obj.m_bAvatar = false;
  if (Boolean(f.SERV_PC_BANG_TYPE)) obj.m_bTitle = false;
  return obj;
}
export function putKPcBangReward(ks: KSerializer, obj: KPcBangReward, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PC_BANG_TYPE)) {
    if (Boolean(f.SERV_PC_BANG_TYPE)) { if (!(ks.putInt32((obj.m_iPcBangType ?? -1)))) return false; }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { if (!(ks.putFloat32((obj.m_fEXPRate ?? 0.0)))) return false; }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { if (!(ks.putFloat32((obj.m_fEDRate ?? 0.0)))) return false; }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { if (!(ks.putFloat32((obj.m_fVSPointRate ?? 0.0)))) return false; }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { if (!(ks.putBool((obj.m_bSpiritFree ?? false)))) return false; }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { if (!(ks.putFloat32((obj.m_fPetEXPRate ?? 0.0)))) return false; }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { if (!(ks.putInt32((obj.m_iAdditionalHenirReward ?? 0)))) return false; }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { if (!(ks.putBool((obj.m_bSecretDungeonFree ?? false)))) return false; }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { if (!(ks.putBool((obj.m_bAvatar ?? false)))) return false; }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { if (!(ks.putBool((obj.m_bTitle ?? false)))) return false; }
  }
  return true;
}
export function getKPcBangReward(ks: KSerializer, flags?: FlagInput): KPcBangReward {
  const f = resolveFlags(flags);
  const obj = createKPcBangReward(f);
  if (Boolean(f.SERV_PC_BANG_TYPE)) {
    if (Boolean(f.SERV_PC_BANG_TYPE)) { obj.m_iPcBangType = ks.getInt32(); }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { obj.m_fEXPRate = ks.getFloat32(); }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { obj.m_fEDRate = ks.getFloat32(); }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { obj.m_fVSPointRate = ks.getFloat32(); }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { obj.m_bSpiritFree = ks.getBool(); }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { obj.m_fPetEXPRate = ks.getFloat32(); }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { obj.m_iAdditionalHenirReward = ks.getInt32(); }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { obj.m_bSecretDungeonFree = ks.getBool(); }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { obj.m_bAvatar = ks.getBool(); }
    if (Boolean(f.SERV_PC_BANG_TYPE)) { obj.m_bTitle = ks.getBool(); }
  }
  return obj;
}

export interface KServerGroupInfo {
  m_iOrder?: Int32;
  m_iServerGroupUID?: Int32;
  m_wstrServerGroupName?: string;
  m_kServerIP?: string;
  m_usMasterPort?: UInt16;
  m_usNCUDPPort?: UInt16;
  m_bEnable?: boolean;
}
export function createKServerGroupInfo(flags?: FlagInput): KServerGroupInfo {
  const f = resolveFlags(flags);
  const obj: KServerGroupInfo = {
  };
  if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) obj.m_iOrder = 0;
  if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) obj.m_iServerGroupUID = 0;
  if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) obj.m_wstrServerGroupName = '';
  if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) obj.m_kServerIP = '';
  if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) obj.m_usMasterPort = 0;
  if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) obj.m_usNCUDPPort = 0;
  if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) obj.m_bEnable = false;
  return obj;
}
export function putKServerGroupInfo(ks: KSerializer, obj: KServerGroupInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) {
    if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) { if (!(ks.putInt32((obj.m_iOrder ?? 0)))) return false; }
    if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) { if (!(ks.putInt32((obj.m_iServerGroupUID ?? 0)))) return false; }
    if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) { if (!(ks.putWString((obj.m_wstrServerGroupName ?? '')))) return false; }
    if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) { if (!(ks.putWString((obj.m_kServerIP ?? '')))) return false; }
    if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) { if (!(ks.putUInt16((obj.m_usMasterPort ?? 0)))) return false; }
    if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) { if (!(ks.putUInt16((obj.m_usNCUDPPort ?? 0)))) return false; }
    if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) { if (!(ks.putBool((obj.m_bEnable ?? false)))) return false; }
  }
  return true;
}
export function getKServerGroupInfo(ks: KSerializer, flags?: FlagInput): KServerGroupInfo {
  const f = resolveFlags(flags);
  const obj = createKServerGroupInfo(f);
  if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) {
    if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) { obj.m_iOrder = ks.getInt32(); }
    if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) { obj.m_iServerGroupUID = ks.getInt32(); }
    if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) { obj.m_wstrServerGroupName = ks.getWString(); }
    if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) { obj.m_kServerIP = ks.getWString(); }
    if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) { obj.m_usMasterPort = ks.getUInt16(); }
    if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) { obj.m_usNCUDPPort = ks.getUInt16(); }
    if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) { obj.m_bEnable = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_CATCH_HACKUSER_INFO_NOT {
  m_iUserUID?: UidType;
  m_iUnitUID?: UidType;
  m_iCrashType?: Int32;
}
export function createKEGS_CATCH_HACKUSER_INFO_NOT(flags?: FlagInput): KEGS_CATCH_HACKUSER_INFO_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_CATCH_HACKUSER_INFO_NOT = {
  };
  if (Boolean(f.SERV_CATCH_HACKUSER_INFO)) obj.m_iUserUID = 0n;
  if (Boolean(f.SERV_CATCH_HACKUSER_INFO)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_CATCH_HACKUSER_INFO)) obj.m_iCrashType = 0;
  return obj;
}
export function putKEGS_CATCH_HACKUSER_INFO_NOT(ks: KSerializer, obj: KEGS_CATCH_HACKUSER_INFO_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CATCH_HACKUSER_INFO)) {
    if (Boolean(f.SERV_CATCH_HACKUSER_INFO)) { if (!(ks.putInt64((obj.m_iUserUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_CATCH_HACKUSER_INFO)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_CATCH_HACKUSER_INFO)) { if (!(ks.putInt32((obj.m_iCrashType ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_CATCH_HACKUSER_INFO_NOT(ks: KSerializer, flags?: FlagInput): KEGS_CATCH_HACKUSER_INFO_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_CATCH_HACKUSER_INFO_NOT(f);
  if (Boolean(f.SERV_CATCH_HACKUSER_INFO)) {
    if (Boolean(f.SERV_CATCH_HACKUSER_INFO)) { obj.m_iUserUID = ks.getInt64(); }
    if (Boolean(f.SERV_CATCH_HACKUSER_INFO)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_CATCH_HACKUSER_INFO)) { obj.m_iCrashType = ks.getInt32(); }
  }
  return obj;
}

export interface KTradeShareItemResult {
  m_iBeforeItemUID?: UidType;
  m_iNewItemUID?: UidType;
  m_wstrRegDate?: string;
}
export function createKTradeShareItemResult(flags?: FlagInput): KTradeShareItemResult {
  const f = resolveFlags(flags);
  const obj: KTradeShareItemResult = {
  };
  if (Boolean(f.SERV_SHARING_BANK_TEST)) obj.m_iBeforeItemUID = 0n;
  if (Boolean(f.SERV_SHARING_BANK_TEST)) obj.m_iNewItemUID = 0n;
  if (Boolean(f.SERV_SHARING_BANK_TEST)) obj.m_wstrRegDate = '';
  return obj;
}
export function putKTradeShareItemResult(ks: KSerializer, obj: KTradeShareItemResult, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SHARING_BANK_TEST)) {
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { if (!(ks.putInt64((obj.m_iBeforeItemUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { if (!(ks.putInt64((obj.m_iNewItemUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { if (!(ks.putWString((obj.m_wstrRegDate ?? '')))) return false; }
  }
  return true;
}
export function getKTradeShareItemResult(ks: KSerializer, flags?: FlagInput): KTradeShareItemResult {
  const f = resolveFlags(flags);
  const obj = createKTradeShareItemResult(f);
  if (Boolean(f.SERV_SHARING_BANK_TEST)) {
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { obj.m_iBeforeItemUID = ks.getInt64(); }
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { obj.m_iNewItemUID = ks.getInt64(); }
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { obj.m_wstrRegDate = ks.getWString(); }
  }
  return obj;
}

export const KBlockInfo_BLOCK_TYPE = {
  BT_TRADE_BLOCK: 0,
  BT_ACCOUNT_BLOCK: 1,
  BT_IP_BLOCK: 2,
  BT_DLL_BLOCK: 3,
  BT_MAX: 4,
} as const;
export type KBlockInfo_BLOCK_TYPE = (typeof KBlockInfo_BLOCK_TYPE)[keyof typeof KBlockInfo_BLOCK_TYPE];
export function getKBlockInfo_BLOCK_TYPE(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_BLOCK_LIST)) {
    cur = 0;
    out['BT_TRADE_BLOCK'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_BLOCK_LIST)) {
    out['BT_ACCOUNT_BLOCK'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_BLOCK_LIST)) {
    out['BT_IP_BLOCK'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_BLOCK_LIST)) {
    out['BT_DLL_BLOCK'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_BLOCK_LIST)) {
    out['BT_MAX'] = cur;
    cur += 1;
  }
  return out;
}
export interface KBlockInfo {
  m_iBlockUID?: UidType;
  m_cBlockType?: Int8;
  m_iBlockTarget?: UidType;
  m_wstrBlockTarget?: string;
  m_wstrStartDate?: string;
  m_wstrEndDate?: string;
}
export function createKBlockInfo(flags?: FlagInput): KBlockInfo {
  const f = resolveFlags(flags);
  const obj: KBlockInfo = {
  };
  if (Boolean(f.SERV_BLOCK_LIST)) obj.m_iBlockUID = 0n;
  if (Boolean(f.SERV_BLOCK_LIST)) obj.m_cBlockType = 0;
  if (Boolean(f.SERV_BLOCK_LIST)) obj.m_iBlockTarget = 0n;
  if (Boolean(f.SERV_BLOCK_LIST)) obj.m_wstrBlockTarget = '';
  if (Boolean(f.SERV_BLOCK_LIST)) obj.m_wstrStartDate = '';
  if (Boolean(f.SERV_BLOCK_LIST)) obj.m_wstrEndDate = '';
  return obj;
}
export function putKBlockInfo(ks: KSerializer, obj: KBlockInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BLOCK_LIST)) {
    if (Boolean(f.SERV_BLOCK_LIST)) { if (!(ks.putInt64((obj.m_iBlockUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_BLOCK_LIST)) { if (!(ks.putInt8((obj.m_cBlockType ?? 0)))) return false; }
    if (Boolean(f.SERV_BLOCK_LIST)) { if (!(ks.putInt64((obj.m_iBlockTarget ?? 0n)))) return false; }
    if (Boolean(f.SERV_BLOCK_LIST)) { if (!(ks.putWString((obj.m_wstrBlockTarget ?? '')))) return false; }
    if (Boolean(f.SERV_BLOCK_LIST)) { if (!(ks.putWString((obj.m_wstrStartDate ?? '')))) return false; }
    if (Boolean(f.SERV_BLOCK_LIST)) { if (!(ks.putWString((obj.m_wstrEndDate ?? '')))) return false; }
  }
  return true;
}
export function getKBlockInfo(ks: KSerializer, flags?: FlagInput): KBlockInfo {
  const f = resolveFlags(flags);
  const obj = createKBlockInfo(f);
  if (Boolean(f.SERV_BLOCK_LIST)) {
    if (Boolean(f.SERV_BLOCK_LIST)) { obj.m_iBlockUID = ks.getInt64(); }
    if (Boolean(f.SERV_BLOCK_LIST)) { obj.m_cBlockType = ks.getInt8(); }
    if (Boolean(f.SERV_BLOCK_LIST)) { obj.m_iBlockTarget = ks.getInt64(); }
    if (Boolean(f.SERV_BLOCK_LIST)) { obj.m_wstrBlockTarget = ks.getWString(); }
    if (Boolean(f.SERV_BLOCK_LIST)) { obj.m_wstrStartDate = ks.getWString(); }
    if (Boolean(f.SERV_BLOCK_LIST)) { obj.m_wstrEndDate = ks.getWString(); }
  }
  return obj;
}

export const KGiantAccountType_TYPE_MASK = {
  NORMAL_USER: 0,
  SPECIAL_USER: 2,
  VIP_USER: 4,
  EVENT_PLAYER: 8,
  ADULT_PLAYER: 16,
  BLACKLIST_USER: 32,
  DEALER: 512,
  WEB_DEALER: 1024,
} as const;
export type KGiantAccountType_TYPE_MASK = (typeof KGiantAccountType_TYPE_MASK)[keyof typeof KGiantAccountType_TYPE_MASK];
export function getKGiantAccountType_TYPE_MASK(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) {
    cur = 0;
    out['NORMAL_USER'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) {
    cur = 2;
    out['SPECIAL_USER'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) {
    cur = 4;
    out['VIP_USER'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) {
    cur = 8;
    out['EVENT_PLAYER'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) {
    cur = 16;
    out['ADULT_PLAYER'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) {
    cur = 32;
    out['BLACKLIST_USER'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) {
    cur = 512;
    out['DEALER'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) {
    cur = 1024;
    out['WEB_DEALER'] = cur;
    cur += 1;
  }
  return out;
}
export interface KGiantAccountType {
  m_uiType?: UInt32;
}
export function createKGiantAccountType(flags?: FlagInput): KGiantAccountType {
  const f = resolveFlags(flags);
  const obj: KGiantAccountType = {
  };
  if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) obj.m_uiType = 0;
  return obj;
}
export function putKGiantAccountType(ks: KSerializer, obj: KGiantAccountType, flags?: FlagInput): boolean {
  return true;
}
export function getKGiantAccountType(ks: KSerializer, flags?: FlagInput): KGiantAccountType {
  return createKGiantAccountType(flags);
}

export interface KRandomItemResult {
  m_iItemCount?: Int32;
  m_bIsSealItem?: boolean;
  m_dRate?: Float64;
  m_dItemTotalCount?: Float64;
  m_bIsNotifyMsgAttration?: boolean;
}
export function createKRandomItemResult(flags?: FlagInput): KRandomItemResult {
  const f = resolveFlags(flags);
  const obj: KRandomItemResult = {
  };
  if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) obj.m_iItemCount = 0;
  if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) obj.m_bIsSealItem = false;
  if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) obj.m_dRate = 0;
  if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) obj.m_dItemTotalCount = 0;
  if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) obj.m_bIsNotifyMsgAttration = false;
  return obj;
}
export function putKRandomItemResult(ks: KSerializer, obj: KRandomItemResult, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) {
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { if (!(ks.putInt32((obj.m_iItemCount ?? 0)))) return false; }
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { if (!(ks.putBool((obj.m_bIsSealItem ?? false)))) return false; }
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { if (!(ks.putFloat64((obj.m_dRate ?? 0)))) return false; }
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { if (!(ks.putFloat64((obj.m_dItemTotalCount ?? 0)))) return false; }
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { if (!(ks.putBool((obj.m_bIsNotifyMsgAttration ?? false)))) return false; }
  }
  return true;
}
export function getKRandomItemResult(ks: KSerializer, flags?: FlagInput): KRandomItemResult {
  const f = resolveFlags(flags);
  const obj = createKRandomItemResult(f);
  if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) {
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { obj.m_iItemCount = ks.getInt32(); }
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { obj.m_bIsSealItem = ks.getBool(); }
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { obj.m_dRate = ks.getFloat64(); }
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { obj.m_dItemTotalCount = ks.getFloat64(); }
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { obj.m_bIsNotifyMsgAttration = ks.getBool(); }
  }
  return obj;
}

export interface KECH_PCBANG_IP_AND_MAC_INFO_NOT {
  m_wstrPublicIP?: string;
  m_wstrMacInfo?: string;
}
export function createKECH_PCBANG_IP_AND_MAC_INFO_NOT(flags?: FlagInput): KECH_PCBANG_IP_AND_MAC_INFO_NOT {
  const f = resolveFlags(flags);
  const obj: KECH_PCBANG_IP_AND_MAC_INFO_NOT = {
  };
  if (Boolean(f.SERV_ID_NETMARBLE_PCBANG)) obj.m_wstrPublicIP = '';
  if (Boolean(f.SERV_ID_NETMARBLE_PCBANG)) obj.m_wstrMacInfo = '';
  return obj;
}
export function putKECH_PCBANG_IP_AND_MAC_INFO_NOT(ks: KSerializer, obj: KECH_PCBANG_IP_AND_MAC_INFO_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ID_NETMARBLE_PCBANG)) {
    if (Boolean(f.SERV_ID_NETMARBLE_PCBANG)) { if (!(ks.putWString((obj.m_wstrPublicIP ?? '')))) return false; }
    if (Boolean(f.SERV_ID_NETMARBLE_PCBANG)) { if (!(ks.putWString((obj.m_wstrMacInfo ?? '')))) return false; }
  }
  return true;
}
export function getKECH_PCBANG_IP_AND_MAC_INFO_NOT(ks: KSerializer, flags?: FlagInput): KECH_PCBANG_IP_AND_MAC_INFO_NOT {
  const f = resolveFlags(flags);
  const obj = createKECH_PCBANG_IP_AND_MAC_INFO_NOT(f);
  if (Boolean(f.SERV_ID_NETMARBLE_PCBANG)) {
    if (Boolean(f.SERV_ID_NETMARBLE_PCBANG)) { obj.m_wstrPublicIP = ks.getWString(); }
    if (Boolean(f.SERV_ID_NETMARBLE_PCBANG)) { obj.m_wstrMacInfo = ks.getWString(); }
  }
  return obj;
}

export interface kGarenaUserTokInfo_t {
  m_Uid?: UInt32;
  m_Username?: string;
  m_Timestamp?: UInt32;
  m_GcaType?: UInt16;
  m_GoldMemberType?: UInt8;
  m_IpBonus?: UInt8;
  m_Reserved?: string;
}
export function createkGarenaUserTokInfo_t(flags?: FlagInput): kGarenaUserTokInfo_t {
  const f = resolveFlags(flags);
  const obj: kGarenaUserTokInfo_t = {
  };
  if (Boolean(f.SERV_COUNTRY_PH)) obj.m_Uid = 0;
  if (Boolean(f.SERV_COUNTRY_PH)) obj.m_Username = '';
  if (Boolean(f.SERV_COUNTRY_PH)) obj.m_Timestamp = 0;
  if (Boolean(f.SERV_COUNTRY_PH)) obj.m_GcaType = 0;
  if (Boolean(f.SERV_COUNTRY_PH)) obj.m_GoldMemberType = 0;
  if (Boolean(f.SERV_COUNTRY_PH)) obj.m_IpBonus = 0;
  if (Boolean(f.SERV_COUNTRY_PH)) obj.m_Reserved = '';
  return obj;
}
export function putkGarenaUserTokInfo_t(ks: KSerializer, obj: kGarenaUserTokInfo_t, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_COUNTRY_PH)) {
    if (Boolean(f.SERV_COUNTRY_PH)) { if (!(ks.putUInt32((obj.m_Uid ?? 0)))) return false; }
    if (Boolean(f.SERV_COUNTRY_PH)) { if (!(ks.putString((obj.m_Username ?? '')))) return false; }
    if (Boolean(f.SERV_COUNTRY_PH)) { if (!(ks.putUInt32((obj.m_Timestamp ?? 0)))) return false; }
    if (Boolean(f.SERV_COUNTRY_PH)) { if (!(ks.putUInt16((obj.m_GcaType ?? 0)))) return false; }
    if (Boolean(f.SERV_COUNTRY_PH)) { if (!(ks.putUInt8((obj.m_GoldMemberType ?? 0)))) return false; }
    if (Boolean(f.SERV_COUNTRY_PH)) { if (!(ks.putUInt8((obj.m_IpBonus ?? 0)))) return false; }
    if (Boolean(f.SERV_COUNTRY_PH)) { if (!(ks.putString((obj.m_Reserved ?? '')))) return false; }
  }
  return true;
}
export function getkGarenaUserTokInfo_t(ks: KSerializer, flags?: FlagInput): kGarenaUserTokInfo_t {
  const f = resolveFlags(flags);
  const obj = createkGarenaUserTokInfo_t(f);
  if (Boolean(f.SERV_COUNTRY_PH)) {
    if (Boolean(f.SERV_COUNTRY_PH)) { obj.m_Uid = ks.getUInt32(); }
    if (Boolean(f.SERV_COUNTRY_PH)) { obj.m_Username = ks.getString(); }
    if (Boolean(f.SERV_COUNTRY_PH)) { obj.m_Timestamp = ks.getUInt32(); }
    if (Boolean(f.SERV_COUNTRY_PH)) { obj.m_GcaType = ks.getUInt16(); }
    if (Boolean(f.SERV_COUNTRY_PH)) { obj.m_GoldMemberType = ks.getUInt8(); }
    if (Boolean(f.SERV_COUNTRY_PH)) { obj.m_IpBonus = ks.getUInt8(); }
    if (Boolean(f.SERV_COUNTRY_PH)) { obj.m_Reserved = ks.getString(); }
  }
  return obj;
}

export interface KJPEventRewardInfo {
  m_iRID: Int64;
  m_wstrUserID: string;
  m_iUserUID: UidType;
  m_iUnitUID: UidType;
  m_iRewardID: Int32;
}
export function createKJPEventRewardInfo(flags?: FlagInput): KJPEventRewardInfo {
  const f = resolveFlags(flags);
  return {
    m_iRID: 0n,
    m_wstrUserID: '',
    m_iUserUID: 0n,
    m_iUnitUID: 0n,
    m_iRewardID: 0,
  };
}
export function putKJPEventRewardInfo(ks: KSerializer, obj: KJPEventRewardInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iRID))) return false;
  if (!(ks.putWString(obj.m_wstrUserID))) return false;
  if (!(ks.putInt64(obj.m_iUserUID))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putInt32(obj.m_iRewardID))) return false;
  return true;
}
export function getKJPEventRewardInfo(ks: KSerializer, flags?: FlagInput): KJPEventRewardInfo {
  const f = resolveFlags(flags);
  const obj = createKJPEventRewardInfo(f);
  obj.m_iRID = ks.getInt64();
  obj.m_wstrUserID = ks.getWString();
  obj.m_iUserUID = ks.getInt64();
  obj.m_iUnitUID = ks.getInt64();
  obj.m_iRewardID = ks.getInt32();
  return obj;
}

export interface KEventCharacterRanking {
  m_iDungeonCharacter1?: Int32;
  m_iDungeonCharacter2?: Int32;
  m_iDungeonCharacter3?: Int32;
  m_iDungeonCharacter4?: Int32;
  m_iPVPCharacter1?: Int32;
  m_iPVPCharacter2?: Int32;
  m_iPVPCharacter3?: Int32;
  m_iPVPCharacter4?: Int32;
  m_iFieldCharacter1?: Int32;
  m_iFieldCharacter2?: Int32;
  m_iFieldCharacter3?: Int32;
  m_iFieldCharacter4?: Int32;
}
export function createKEventCharacterRanking(flags?: FlagInput): KEventCharacterRanking {
  const f = resolveFlags(flags);
  const obj: KEventCharacterRanking = {
  };
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) obj.m_iDungeonCharacter1 = 0;
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) obj.m_iDungeonCharacter2 = 0;
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) obj.m_iDungeonCharacter3 = 0;
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) obj.m_iDungeonCharacter4 = 0;
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) obj.m_iPVPCharacter1 = 0;
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) obj.m_iPVPCharacter2 = 0;
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) obj.m_iPVPCharacter3 = 0;
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) obj.m_iPVPCharacter4 = 0;
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) obj.m_iFieldCharacter1 = 0;
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) obj.m_iFieldCharacter2 = 0;
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) obj.m_iFieldCharacter3 = 0;
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) obj.m_iFieldCharacter4 = 0;
  return obj;
}
export function putKEventCharacterRanking(ks: KSerializer, obj: KEventCharacterRanking, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) {
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { if (!(ks.putInt32((obj.m_iDungeonCharacter1 ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { if (!(ks.putInt32((obj.m_iDungeonCharacter2 ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { if (!(ks.putInt32((obj.m_iDungeonCharacter3 ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { if (!(ks.putInt32((obj.m_iDungeonCharacter4 ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { if (!(ks.putInt32((obj.m_iPVPCharacter1 ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { if (!(ks.putInt32((obj.m_iPVPCharacter2 ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { if (!(ks.putInt32((obj.m_iPVPCharacter3 ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { if (!(ks.putInt32((obj.m_iPVPCharacter4 ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { if (!(ks.putInt32((obj.m_iFieldCharacter1 ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { if (!(ks.putInt32((obj.m_iFieldCharacter2 ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { if (!(ks.putInt32((obj.m_iFieldCharacter3 ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { if (!(ks.putInt32((obj.m_iFieldCharacter4 ?? 0)))) return false; }
  }
  return true;
}
export function getKEventCharacterRanking(ks: KSerializer, flags?: FlagInput): KEventCharacterRanking {
  const f = resolveFlags(flags);
  const obj = createKEventCharacterRanking(f);
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) {
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { obj.m_iDungeonCharacter1 = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { obj.m_iDungeonCharacter2 = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { obj.m_iDungeonCharacter3 = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { obj.m_iDungeonCharacter4 = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { obj.m_iPVPCharacter1 = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { obj.m_iPVPCharacter2 = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { obj.m_iPVPCharacter3 = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { obj.m_iPVPCharacter4 = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { obj.m_iFieldCharacter1 = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { obj.m_iFieldCharacter2 = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { obj.m_iFieldCharacter3 = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { obj.m_iFieldCharacter4 = ks.getInt32(); }
  }
  return obj;
}

export interface KESG_REWARD_DB_DATA_NOT {
  m_mapTotalRewardData?: Map<Int32, KRewardData[]>;
}
export function createKESG_REWARD_DB_DATA_NOT(flags?: FlagInput): KESG_REWARD_DB_DATA_NOT {
  const f = resolveFlags(flags);
  const obj: KESG_REWARD_DB_DATA_NOT = {
  };
  if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_mapTotalRewardData = new Map<Int32, KRewardData[]>();
  return obj;
}
export function putKESG_REWARD_DB_DATA_NOT(ks: KSerializer, obj: KESG_REWARD_DB_DATA_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) {
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putMap((obj.m_mapTotalRewardData ?? new Map<Int32, KRewardData[]>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: KRewardData[]) => ks.putVector(v, (ks, item: KRewardData) => ks.putUserClass(item, putKRewardData, f))))) return false; }
  }
  return true;
}
export function getKESG_REWARD_DB_DATA_NOT(ks: KSerializer, flags?: FlagInput): KESG_REWARD_DB_DATA_NOT {
  const f = resolveFlags(flags);
  const obj = createKESG_REWARD_DB_DATA_NOT(f);
  if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) {
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_mapTotalRewardData = ks.getMap<Int32, KRewardData[]>((ks) => ks.getInt32(), (ks) => ks.getVector<KRewardData>((ks) => ks.getUserClass(getKRewardData, f))); }
  }
  return obj;
}

export interface kRandomItemMappingToInfoClient {
  m_iBeforeGroupID?: Int32;
  m_iAfterGroupID?: Int32;
  m_bCheckMapping?: boolean;
  m_tStartTime?: string;
  m_tEndTime?: string;
}
export function createkRandomItemMappingToInfoClient(flags?: FlagInput): kRandomItemMappingToInfoClient {
  const f = resolveFlags(flags);
  const obj: kRandomItemMappingToInfoClient = {
  };
  if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) obj.m_iBeforeGroupID = 0;
  if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) obj.m_iAfterGroupID = 0;
  if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) obj.m_bCheckMapping = false;
  if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) obj.m_tStartTime = '';
  if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) obj.m_tEndTime = '';
  return obj;
}
export function putkRandomItemMappingToInfoClient(ks: KSerializer, obj: kRandomItemMappingToInfoClient, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) {
    if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) { if (!(ks.putInt32((obj.m_iBeforeGroupID ?? 0)))) return false; }
    if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) { if (!(ks.putInt32((obj.m_iAfterGroupID ?? 0)))) return false; }
    if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) { if (!(ks.putBool((obj.m_bCheckMapping ?? false)))) return false; }
    if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) { if (!(ks.putWString((obj.m_tStartTime ?? '')))) return false; }
    if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) { if (!(ks.putWString((obj.m_tEndTime ?? '')))) return false; }
  }
  return true;
}
export function getkRandomItemMappingToInfoClient(ks: KSerializer, flags?: FlagInput): kRandomItemMappingToInfoClient {
  const f = resolveFlags(flags);
  const obj = createkRandomItemMappingToInfoClient(f);
  if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) {
    if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) { obj.m_iBeforeGroupID = ks.getInt32(); }
    if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) { obj.m_iAfterGroupID = ks.getInt32(); }
    if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) { obj.m_bCheckMapping = ks.getBool(); }
    if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) { obj.m_tStartTime = ks.getWString(); }
    if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) { obj.m_tEndTime = ks.getWString(); }
  }
  return obj;
}

export interface KRandomItemMappingToInfoServer {
  m_iIndex?: Int32;
  m_iCubeID?: Int32;
  m_iKeyItemID?: Int32;
  m_iBeforeGroupID?: Int32;
  m_iAfterGroupID?: Int32;
  m_tStartTime?: string;
  m_tEndTime?: string;
}
export function createKRandomItemMappingToInfoServer(flags?: FlagInput): KRandomItemMappingToInfoServer {
  const f = resolveFlags(flags);
  const obj: KRandomItemMappingToInfoServer = {
  };
  if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) obj.m_iIndex = 0;
  if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) obj.m_iCubeID = 0;
  if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) obj.m_iKeyItemID = 0;
  if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) obj.m_iBeforeGroupID = 0;
  if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) obj.m_iAfterGroupID = 0;
  if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) obj.m_tStartTime = '';
  if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) obj.m_tEndTime = '';
  return obj;
}
export function putKRandomItemMappingToInfoServer(ks: KSerializer, obj: KRandomItemMappingToInfoServer, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) {
    if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) { if (!(ks.putInt32((obj.m_iIndex ?? 0)))) return false; }
    if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) { if (!(ks.putInt32((obj.m_iCubeID ?? 0)))) return false; }
    if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) { if (!(ks.putInt32((obj.m_iKeyItemID ?? 0)))) return false; }
    if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) { if (!(ks.putInt32((obj.m_iBeforeGroupID ?? 0)))) return false; }
    if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) { if (!(ks.putInt32((obj.m_iAfterGroupID ?? 0)))) return false; }
    if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) { if (!(ks.putWString((obj.m_tStartTime ?? '')))) return false; }
    if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) { if (!(ks.putWString((obj.m_tEndTime ?? '')))) return false; }
  }
  return true;
}
export function getKRandomItemMappingToInfoServer(ks: KSerializer, flags?: FlagInput): KRandomItemMappingToInfoServer {
  const f = resolveFlags(flags);
  const obj = createKRandomItemMappingToInfoServer(f);
  if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) {
    if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) { obj.m_iIndex = ks.getInt32(); }
    if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) { obj.m_iCubeID = ks.getInt32(); }
    if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) { obj.m_iKeyItemID = ks.getInt32(); }
    if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) { obj.m_iBeforeGroupID = ks.getInt32(); }
    if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) { obj.m_iAfterGroupID = ks.getInt32(); }
    if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) { obj.m_tStartTime = ks.getWString(); }
    if (f.SERV_CUBE_IN_ITEM_MAPPING && f.SERV_CUBE_IN_ITEM_MAPPING_BY_DBTIME_SETTING) { obj.m_tEndTime = ks.getWString(); }
  }
  return obj;
}

export interface KItemName {
  m_wstrKRItemName?: string;
  m_wstrTransItemName?: string;
}
export function createKItemName(flags?: FlagInput): KItemName {
  const f = resolveFlags(flags);
  const obj: KItemName = {
  };
  if (Boolean(f.SERV_USE_GM_TOOL_INFO)) obj.m_wstrKRItemName = '';
  if (Boolean(f.SERV_USE_GM_TOOL_INFO)) obj.m_wstrTransItemName = '';
  return obj;
}
export function putKItemName(ks: KSerializer, obj: KItemName, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_USE_GM_TOOL_INFO)) {
    if (Boolean(f.SERV_USE_GM_TOOL_INFO)) { if (!(ks.putWString((obj.m_wstrKRItemName ?? '')))) return false; }
    if (Boolean(f.SERV_USE_GM_TOOL_INFO)) { if (!(ks.putWString((obj.m_wstrTransItemName ?? '')))) return false; }
  }
  return true;
}
export function getKItemName(ks: KSerializer, flags?: FlagInput): KItemName {
  const f = resolveFlags(flags);
  const obj = createKItemName(f);
  if (Boolean(f.SERV_USE_GM_TOOL_INFO)) {
    if (Boolean(f.SERV_USE_GM_TOOL_INFO)) { obj.m_wstrKRItemName = ks.getWString(); }
    if (Boolean(f.SERV_USE_GM_TOOL_INFO)) { obj.m_wstrTransItemName = ks.getWString(); }
  }
  return obj;
}

export interface KGlobalMissionReward {
  m_iRewardType?: Int32;
  m_iRewardDurationTime?: Int32;
  m_iScriptID?: Int32;
}
export function createKGlobalMissionReward(flags?: FlagInput): KGlobalMissionReward {
  const f = resolveFlags(flags);
  const obj: KGlobalMissionReward = {
  };
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) obj.m_iRewardType = 0;
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) obj.m_iRewardDurationTime = 0;
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) obj.m_iScriptID = 0;
  return obj;
}
export function putKGlobalMissionReward(ks: KSerializer, obj: KGlobalMissionReward, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) {
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { if (!(ks.putInt32((obj.m_iRewardType ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { if (!(ks.putInt32((obj.m_iRewardDurationTime ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { if (!(ks.putInt32((obj.m_iScriptID ?? 0)))) return false; }
  }
  return true;
}
export function getKGlobalMissionReward(ks: KSerializer, flags?: FlagInput): KGlobalMissionReward {
  const f = resolveFlags(flags);
  const obj = createKGlobalMissionReward(f);
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) {
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { obj.m_iRewardType = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { obj.m_iRewardDurationTime = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { obj.m_iScriptID = ks.getInt32(); }
  }
  return obj;
}

export interface KGlobalMissionInfo {
  m_bActive?: boolean;
  m_wstrMissionStartTime?: string;
  m_iDurationMinute?: Int32;
  m_iRemainSecond?: Int32;
  m_iMissionType?: Int32;
  m_iClearCondition?: Int32;
  m_iClearCount?: Int32;
  m_iNowCount?: Int32;
}
export function createKGlobalMissionInfo(flags?: FlagInput): KGlobalMissionInfo {
  const f = resolveFlags(flags);
  const obj: KGlobalMissionInfo = {
  };
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) obj.m_bActive = false;
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) obj.m_wstrMissionStartTime = '';
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) obj.m_iDurationMinute = 0;
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) obj.m_iRemainSecond = 0;
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) obj.m_iMissionType = 0;
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) obj.m_iClearCondition = 0;
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) obj.m_iClearCount = 0;
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) obj.m_iNowCount = 0;
  return obj;
}
export function putKGlobalMissionInfo(ks: KSerializer, obj: KGlobalMissionInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) {
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { if (!(ks.putBool((obj.m_bActive ?? false)))) return false; }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { if (!(ks.putWString((obj.m_wstrMissionStartTime ?? '')))) return false; }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { if (!(ks.putInt32((obj.m_iDurationMinute ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { if (!(ks.putInt32((obj.m_iRemainSecond ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { if (!(ks.putInt32((obj.m_iMissionType ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { if (!(ks.putInt32((obj.m_iClearCondition ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { if (!(ks.putInt32((obj.m_iClearCount ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { if (!(ks.putInt32((obj.m_iNowCount ?? 0)))) return false; }
  }
  return true;
}
export function getKGlobalMissionInfo(ks: KSerializer, flags?: FlagInput): KGlobalMissionInfo {
  const f = resolveFlags(flags);
  const obj = createKGlobalMissionInfo(f);
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) {
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { obj.m_bActive = ks.getBool(); }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { obj.m_wstrMissionStartTime = ks.getWString(); }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { obj.m_iDurationMinute = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { obj.m_iRemainSecond = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { obj.m_iMissionType = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { obj.m_iClearCondition = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { obj.m_iClearCount = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { obj.m_iNowCount = ks.getInt32(); }
  }
  return obj;
}

export interface KPacketGetItemOnOff {
  m_iType?: Int32;
  m_iItemID?: Int32;
  m_wstrStartTime?: string;
  m_wstrEndTime?: string;
}
export function createKPacketGetItemOnOff(flags?: FlagInput): KPacketGetItemOnOff {
  const f = resolveFlags(flags);
  const obj: KPacketGetItemOnOff = {
  };
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) obj.m_iType = 0;
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) obj.m_iItemID = 0;
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) obj.m_wstrStartTime = '';
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) obj.m_wstrEndTime = '';
  return obj;
}
export function putKPacketGetItemOnOff(ks: KSerializer, obj: KPacketGetItemOnOff, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) {
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { if (!(ks.putInt32((obj.m_iType ?? 0)))) return false; }
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { if (!(ks.putInt32((obj.m_iItemID ?? 0)))) return false; }
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { if (!(ks.putWString((obj.m_wstrStartTime ?? '')))) return false; }
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { if (!(ks.putWString((obj.m_wstrEndTime ?? '')))) return false; }
  }
  return true;
}
export function getKPacketGetItemOnOff(ks: KSerializer, flags?: FlagInput): KPacketGetItemOnOff {
  const f = resolveFlags(flags);
  const obj = createKPacketGetItemOnOff(f);
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) {
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { obj.m_iType = ks.getInt32(); }
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { obj.m_iItemID = ks.getInt32(); }
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { obj.m_wstrStartTime = ks.getWString(); }
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { obj.m_wstrEndTime = ks.getWString(); }
  }
  return obj;
}

export interface KStringFilterInfo {
  m_sStringFilterType?: Int16;
  m_wstrFilter?: string;
}
export function createKStringFilterInfo(flags?: FlagInput): KStringFilterInfo {
  const f = resolveFlags(flags);
  const obj: KStringFilterInfo = {
  };
  if (Boolean(f.SERV_STRING_FILTER_USING_DB)) obj.m_sStringFilterType = 0;
  if (Boolean(f.SERV_STRING_FILTER_USING_DB)) obj.m_wstrFilter = '';
  return obj;
}
export function putKStringFilterInfo(ks: KSerializer, obj: KStringFilterInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_STRING_FILTER_USING_DB)) {
    if (Boolean(f.SERV_STRING_FILTER_USING_DB)) { if (!(ks.putInt16((obj.m_sStringFilterType ?? 0)))) return false; }
    if (Boolean(f.SERV_STRING_FILTER_USING_DB)) { if (!(ks.putWString((obj.m_wstrFilter ?? '')))) return false; }
  }
  return true;
}
export function getKStringFilterInfo(ks: KSerializer, flags?: FlagInput): KStringFilterInfo {
  const f = resolveFlags(flags);
  const obj = createKStringFilterInfo(f);
  if (Boolean(f.SERV_STRING_FILTER_USING_DB)) {
    if (Boolean(f.SERV_STRING_FILTER_USING_DB)) { obj.m_sStringFilterType = ks.getInt16(); }
    if (Boolean(f.SERV_STRING_FILTER_USING_DB)) { obj.m_wstrFilter = ks.getWString(); }
  }
  return obj;
}

export type KERM_CHANGE_PVP_ROOM_PUBLIC_REQ = KEGS_CHANGE_PVP_ROOM_PUBLIC_REQ;
export function createKERM_CHANGE_PVP_ROOM_PUBLIC_REQ(flags?: FlagInput): KERM_CHANGE_PVP_ROOM_PUBLIC_REQ {
  const f = resolveFlags(flags);
  return createKEGS_CHANGE_PVP_ROOM_PUBLIC_REQ(f);
}
export function putKERM_CHANGE_PVP_ROOM_PUBLIC_REQ(ks: KSerializer, obj: KERM_CHANGE_PVP_ROOM_PUBLIC_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_CHANGE_PVP_ROOM_PUBLIC_REQ, f);
}
export function getKERM_CHANGE_PVP_ROOM_PUBLIC_REQ(ks: KSerializer, flags?: FlagInput): KERM_CHANGE_PVP_ROOM_PUBLIC_REQ {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_CHANGE_PVP_ROOM_PUBLIC_REQ, f);
}

export type KERM_CHANGE_PVP_ROOM_PUBLIC_ACK = KEGS_CHANGE_PVP_ROOM_PUBLIC_ACK;
export function createKERM_CHANGE_PVP_ROOM_PUBLIC_ACK(flags?: FlagInput): KERM_CHANGE_PVP_ROOM_PUBLIC_ACK {
  const f = resolveFlags(flags);
  return createKEGS_CHANGE_PVP_ROOM_PUBLIC_ACK(f);
}
export function putKERM_CHANGE_PVP_ROOM_PUBLIC_ACK(ks: KSerializer, obj: KERM_CHANGE_PVP_ROOM_PUBLIC_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_CHANGE_PVP_ROOM_PUBLIC_ACK, f);
}
export function getKERM_CHANGE_PVP_ROOM_PUBLIC_ACK(ks: KSerializer, flags?: FlagInput): KERM_CHANGE_PVP_ROOM_PUBLIC_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_CHANGE_PVP_ROOM_PUBLIC_ACK, f);
}

export type KERM_CHANGE_PVP_ROOM_NAME_REQ = KEGS_CHANGE_PVP_ROOM_NAME_REQ;
export function createKERM_CHANGE_PVP_ROOM_NAME_REQ(flags?: FlagInput): KERM_CHANGE_PVP_ROOM_NAME_REQ {
  const f = resolveFlags(flags);
  return createKEGS_CHANGE_PVP_ROOM_NAME_REQ(f);
}
export function putKERM_CHANGE_PVP_ROOM_NAME_REQ(ks: KSerializer, obj: KERM_CHANGE_PVP_ROOM_NAME_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_CHANGE_PVP_ROOM_NAME_REQ, f);
}
export function getKERM_CHANGE_PVP_ROOM_NAME_REQ(ks: KSerializer, flags?: FlagInput): KERM_CHANGE_PVP_ROOM_NAME_REQ {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_CHANGE_PVP_ROOM_NAME_REQ, f);
}

export type KERM_CHANGE_PVP_ROOM_NAME_ACK = KEGS_CHANGE_PVP_ROOM_NAME_ACK;
export function createKERM_CHANGE_PVP_ROOM_NAME_ACK(flags?: FlagInput): KERM_CHANGE_PVP_ROOM_NAME_ACK {
  const f = resolveFlags(flags);
  return createKEGS_CHANGE_PVP_ROOM_NAME_ACK(f);
}
export function putKERM_CHANGE_PVP_ROOM_NAME_ACK(ks: KSerializer, obj: KERM_CHANGE_PVP_ROOM_NAME_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_CHANGE_PVP_ROOM_NAME_ACK, f);
}
export function getKERM_CHANGE_PVP_ROOM_NAME_ACK(ks: KSerializer, flags?: FlagInput): KERM_CHANGE_PVP_ROOM_NAME_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_CHANGE_PVP_ROOM_NAME_ACK, f);
}

export type KDBE_PCBANG_IP_AND_MAC_INFO_NOT = KECH_PCBANG_IP_AND_MAC_INFO_NOT;
export function createKDBE_PCBANG_IP_AND_MAC_INFO_NOT(flags?: FlagInput): KDBE_PCBANG_IP_AND_MAC_INFO_NOT {
  const f = resolveFlags(flags);
  return createKECH_PCBANG_IP_AND_MAC_INFO_NOT(f);
}
export function putKDBE_PCBANG_IP_AND_MAC_INFO_NOT(ks: KSerializer, obj: KDBE_PCBANG_IP_AND_MAC_INFO_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKECH_PCBANG_IP_AND_MAC_INFO_NOT, f);
}
export function getKDBE_PCBANG_IP_AND_MAC_INFO_NOT(ks: KSerializer, flags?: FlagInput): KDBE_PCBANG_IP_AND_MAC_INFO_NOT {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKECH_PCBANG_IP_AND_MAC_INFO_NOT, f);
}

export type uint32 = UInt32;
export function createuint32(flags?: FlagInput): uint32 {
  return 0;
}
export function putuint32(ks: KSerializer, obj: uint32, flags?: FlagInput): boolean {
  return ks.putUInt32(obj);
}
export function getuint32(ks: KSerializer, flags?: FlagInput): uint32 {
  return ks.getUInt32();
}

export type uint16 = UInt16;
export function createuint16(flags?: FlagInput): uint16 {
  return 0;
}
export function putuint16(ks: KSerializer, obj: uint16, flags?: FlagInput): boolean {
  return ks.putUInt16(obj);
}
export function getuint16(ks: KSerializer, flags?: FlagInput): uint16 {
  return ks.getUInt16();
}

export type uint8 = UInt8;
export function createuint8(flags?: FlagInput): uint8 {
  return 0;
}
export function putuint8(ks: KSerializer, obj: uint8, flags?: FlagInput): boolean {
  return ks.putUInt8(obj);
}
export function getuint8(ks: KSerializer, flags?: FlagInput): uint8 {
  return ks.getUInt8();
}

export type dataBuffer_t = UInt8[];
export function createdataBuffer_t(flags?: FlagInput): dataBuffer_t {
  return ([] as UInt8[]);
}
export function putdataBuffer_t(ks: KSerializer, obj: dataBuffer_t, flags?: FlagInput): boolean {
  return ks.putVector(obj, (ks, item: UInt8) => ks.putUInt8(item));
}
export function getdataBuffer_t(ks: KSerializer, flags?: FlagInput): dataBuffer_t {
  return ks.getVector<UInt8>((ks) => ks.getUInt8());
}

export type string_t = string;
export function createstring_t(flags?: FlagInput): string_t {
  return '';
}
export function putstring_t(ks: KSerializer, obj: string_t, flags?: FlagInput): boolean {
  return ks.putString(obj);
}
export function getstring_t(ks: KSerializer, flags?: FlagInput): string_t {
  return ks.getString();
}

export type KDBE_GET_TIME_CONTROL_ITME_LIST_NOT = KPacketOK;
export function createKDBE_GET_TIME_CONTROL_ITME_LIST_NOT(flags?: FlagInput): KDBE_GET_TIME_CONTROL_ITME_LIST_NOT {
  const f = resolveFlags(flags);
  return createKPacketOK(f);
}
export function putKDBE_GET_TIME_CONTROL_ITME_LIST_NOT(ks: KSerializer, obj: KDBE_GET_TIME_CONTROL_ITME_LIST_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKPacketOK, f);
}
export function getKDBE_GET_TIME_CONTROL_ITME_LIST_NOT(ks: KSerializer, flags?: FlagInput): KDBE_GET_TIME_CONTROL_ITME_LIST_NOT {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKPacketOK, f);
}

export type KEGS_GET_TIME_CONTROL_ITME_LIST_NOT = KPacketOK;
export function createKEGS_GET_TIME_CONTROL_ITME_LIST_NOT(flags?: FlagInput): KEGS_GET_TIME_CONTROL_ITME_LIST_NOT {
  const f = resolveFlags(flags);
  return createKPacketOK(f);
}
export function putKEGS_GET_TIME_CONTROL_ITME_LIST_NOT(ks: KSerializer, obj: KEGS_GET_TIME_CONTROL_ITME_LIST_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKPacketOK, f);
}
export function getKEGS_GET_TIME_CONTROL_ITME_LIST_NOT(ks: KSerializer, flags?: FlagInput): KEGS_GET_TIME_CONTROL_ITME_LIST_NOT {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKPacketOK, f);
}

export type StringFilterVector = KStringFilterInfo[];
export function createStringFilterVector(flags?: FlagInput): StringFilterVector {
  return ([] as KStringFilterInfo[]);
}
export function putStringFilterVector(ks: KSerializer, obj: StringFilterVector, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putVector(obj, (ks, item: KStringFilterInfo) => ks.putUserClass(item, putKStringFilterInfo, f));
}
export function getStringFilterVector(ks: KSerializer, flags?: FlagInput): StringFilterVector {
  const f = resolveFlags(flags);
  return ks.getVector<KStringFilterInfo>((ks) => ks.getUserClass(getKStringFilterInfo, f));
}
