// Auto-generated from client-packet-global (.h/.cpp) by scripts/generate.py — DO NOT EDIT MANUALLY.
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
import { type KEGS_BREAK_UP_NOT, createKEGS_BREAK_UP_NOT, putKEGS_BREAK_UP_NOT, getKEGS_BREAK_UP_NOT } from './client-packet.ts';
import { type KEGS_COUPLE_PROPOSE_ACK, createKEGS_COUPLE_PROPOSE_ACK, putKEGS_COUPLE_PROPOSE_ACK, getKEGS_COUPLE_PROPOSE_ACK } from './client-packet.ts';
import { type KEGS_COUPLE_PROPOSE_AGREE_NOT, createKEGS_COUPLE_PROPOSE_AGREE_NOT, putKEGS_COUPLE_PROPOSE_AGREE_NOT, getKEGS_COUPLE_PROPOSE_AGREE_NOT } from './client-packet.ts';
import { type KEGS_COUPLE_PROPOSE_NOT, createKEGS_COUPLE_PROPOSE_NOT, putKEGS_COUPLE_PROPOSE_NOT, getKEGS_COUPLE_PROPOSE_NOT } from './client-packet.ts';
import { type KEGS_COUPLE_PROPOSE_RESULT_NOT, createKEGS_COUPLE_PROPOSE_RESULT_NOT, putKEGS_COUPLE_PROPOSE_RESULT_NOT, getKEGS_COUPLE_PROPOSE_RESULT_NOT } from './client-packet.ts';
import { type KEGS_GET_GUILD_SKILL_IN_BOARD_ACK, createKEGS_GET_GUILD_SKILL_IN_BOARD_ACK, putKEGS_GET_GUILD_SKILL_IN_BOARD_ACK, getKEGS_GET_GUILD_SKILL_IN_BOARD_ACK } from './client-packet.ts';
import { type KEGS_GET_GUILD_SKILL_IN_BOARD_REQ, createKEGS_GET_GUILD_SKILL_IN_BOARD_REQ, putKEGS_GET_GUILD_SKILL_IN_BOARD_REQ, getKEGS_GET_GUILD_SKILL_IN_BOARD_REQ } from './client-packet.ts';
import { type KEGS_GET_PURCHASED_CASH_ITEM_ACK, createKEGS_GET_PURCHASED_CASH_ITEM_ACK, putKEGS_GET_PURCHASED_CASH_ITEM_ACK, getKEGS_GET_PURCHASED_CASH_ITEM_ACK } from './client-packet.ts';
import { type KEGS_TIME_EVENT_INFO_NOT, createKEGS_TIME_EVENT_INFO_NOT, putKEGS_TIME_EVENT_INFO_NOT, getKEGS_TIME_EVENT_INFO_NOT } from './client-packet.ts';
import { type KFieldUserInfo, createKFieldUserInfo, putKFieldUserInfo, getKFieldUserInfo } from './common-packet.ts';
import { type KInventoryItemInfo, createKInventoryItemInfo, putKInventoryItemInfo, getKInventoryItemInfo } from './common-packet.ts';
import { type KPacketOK, createKPacketOK, putKPacketOK, getKPacketOK } from './common-packet.ts';
import { type KQuestInstance, createKQuestInstance, putKQuestInstance, getKQuestInstance } from './common-packet.ts';
import { type KRecommendUserInfo, createKRecommendUserInfo, putKRecommendUserInfo, getKRecommendUserInfo } from './common-packet.ts';
import { type KBillOrderInfo, createKBillOrderInfo, putKBillOrderInfo, getKBillOrderInfo } from './common-packet-global.ts';
import { type KBillPackageInfo, createKBillPackageInfo, putKBillPackageInfo, getKBillPackageInfo } from './common-packet-global.ts';
import { type KBillProductInfo, createKBillProductInfo, putKBillProductInfo, getKBillProductInfo } from './common-packet-global.ts';
import { type KEventCharacterRanking, createKEventCharacterRanking, putKEventCharacterRanking, getKEventCharacterRanking } from './common-packet-global.ts';
import { type KGlobalCashInfo, createKGlobalCashInfo, putKGlobalCashInfo, getKGlobalCashInfo } from './common-packet-global.ts';
import { type KGlobalMissionInfo, createKGlobalMissionInfo, putKGlobalMissionInfo, getKGlobalMissionInfo } from './common-packet-global.ts';
import { type KGuildFindAdInfo, createKGuildFindAdInfo, putKGuildFindAdInfo, getKGuildFindAdInfo } from './common-packet-global.ts';
import { type KGuildInviteMsgInfo, createKGuildInviteMsgInfo, putKGuildInviteMsgInfo, getKGuildInviteMsgInfo } from './common-packet-global.ts';
import { type KPacketGetItemOnOff, createKPacketGetItemOnOff, putKPacketGetItemOnOff, getKPacketGetItemOnOff } from './common-packet-global.ts';
import { type KPcBangReward, createKPcBangReward, putKPcBangReward, getKPcBangReward } from './common-packet-global.ts';
import { type KRandomItemResult, createKRandomItemResult, putKRandomItemResult, getKRandomItemResult } from './common-packet-global.ts';
import { type KServerGroupInfo, createKServerGroupInfo, putKServerGroupInfo, getKServerGroupInfo } from './common-packet-global.ts';
import { type KTradeShareItemResult, createKTradeShareItemResult, putKTradeShareItemResult, getKTradeShareItemResult } from './common-packet-global.ts';
import { type kDisCountItemInfo, createkDisCountItemInfo, putkDisCountItemInfo, getkDisCountItemInfo } from './common-packet-global.ts';
import { type kRandomItemMappingToInfoClient, createkRandomItemMappingToInfoClient, putkRandomItemMappingToInfoClient, getkRandomItemMappingToInfoClient } from './common-packet-global.ts';

export const KECH_SECURITY_AUTH_REQ_SECURITY_AUTH_TYPE = {
  SAT_NONE: 0,
  SAT_CHK_SECOND_SECURITY: 1,
  SAT_MATRIX_CARD: 2,
} as const;
export type KECH_SECURITY_AUTH_REQ_SECURITY_AUTH_TYPE = (typeof KECH_SECURITY_AUTH_REQ_SECURITY_AUTH_TYPE)[keyof typeof KECH_SECURITY_AUTH_REQ_SECURITY_AUTH_TYPE];
export function getKECH_SECURITY_AUTH_REQ_SECURITY_AUTH_TYPE(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_GLOBAL_AUTH)) {
    out['SAT_NONE'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_GLOBAL_AUTH)) {
    out['SAT_CHK_SECOND_SECURITY'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_GLOBAL_AUTH)) {
    out['SAT_MATRIX_CARD'] = cur;
    cur += 1;
  }
  return out;
}
export interface KECH_SECURITY_AUTH_REQ {
  m_iSecurityAuthType?: Int32;
  m_iUserUID?: UidType;
  m_wstrUserID?: string;
  m_wstrMatrix?: string;
}
export function createKECH_SECURITY_AUTH_REQ(flags?: FlagInput): KECH_SECURITY_AUTH_REQ {
  const f = resolveFlags(flags);
  const obj: KECH_SECURITY_AUTH_REQ = {
  };
  if (Boolean(f.SERV_GLOBAL_AUTH)) obj.m_iSecurityAuthType = 0;
  if (Boolean(f.SERV_GLOBAL_AUTH)) obj.m_iUserUID = -1n;
  if (Boolean(f.SERV_GLOBAL_AUTH)) obj.m_wstrUserID = '';
  if (f.SERV_GLOBAL_AUTH && f.SERV_PUBLISHER_MATRIXKEY) obj.m_wstrMatrix = '';
  return obj;
}
export function putKECH_SECURITY_AUTH_REQ(ks: KSerializer, obj: KECH_SECURITY_AUTH_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_AUTH)) {
    if (Boolean(f.SERV_GLOBAL_AUTH)) { if (!(ks.putInt32((obj.m_iSecurityAuthType ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_AUTH)) { if (!(ks.putInt64((obj.m_iUserUID ?? -1n)))) return false; }
    if (Boolean(f.SERV_GLOBAL_AUTH)) { if (!(ks.putWString((obj.m_wstrUserID ?? '')))) return false; }
    if (f.SERV_GLOBAL_AUTH && f.SERV_PUBLISHER_MATRIXKEY) { if (!(ks.putWString((obj.m_wstrMatrix ?? '')))) return false; }
  }
  return true;
}
export function getKECH_SECURITY_AUTH_REQ(ks: KSerializer, flags?: FlagInput): KECH_SECURITY_AUTH_REQ {
  const f = resolveFlags(flags);
  const obj = createKECH_SECURITY_AUTH_REQ(f);
  if (Boolean(f.SERV_GLOBAL_AUTH)) {
    if (Boolean(f.SERV_GLOBAL_AUTH)) { obj.m_iSecurityAuthType = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_AUTH)) { obj.m_iUserUID = ks.getInt64(); }
    if (Boolean(f.SERV_GLOBAL_AUTH)) { obj.m_wstrUserID = ks.getWString(); }
    if (f.SERV_GLOBAL_AUTH && f.SERV_PUBLISHER_MATRIXKEY) { obj.m_wstrMatrix = ks.getWString(); }
  }
  return obj;
}

export interface KECH_SECURITY_AUTH_ACK {
  m_iOK?: Int32;
  m_strSecondSecurityURL?: string;
}
export function createKECH_SECURITY_AUTH_ACK(flags?: FlagInput): KECH_SECURITY_AUTH_ACK {
  const f = resolveFlags(flags);
  const obj: KECH_SECURITY_AUTH_ACK = {
  };
  if (Boolean(f.SERV_GLOBAL_AUTH)) obj.m_iOK = 0;
  if (Boolean(f.SERV_GLOBAL_AUTH)) obj.m_strSecondSecurityURL = '';
  return obj;
}
export function putKECH_SECURITY_AUTH_ACK(ks: KSerializer, obj: KECH_SECURITY_AUTH_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_AUTH)) {
    if (Boolean(f.SERV_GLOBAL_AUTH)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_AUTH)) { if (!(ks.putString((obj.m_strSecondSecurityURL ?? '')))) return false; }
  }
  return true;
}
export function getKECH_SECURITY_AUTH_ACK(ks: KSerializer, flags?: FlagInput): KECH_SECURITY_AUTH_ACK {
  const f = resolveFlags(flags);
  const obj = createKECH_SECURITY_AUTH_ACK(f);
  if (Boolean(f.SERV_GLOBAL_AUTH)) {
    if (Boolean(f.SERV_GLOBAL_AUTH)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_AUTH)) { obj.m_strSecondSecurityURL = ks.getString(); }
  }
  return obj;
}

export const KECH_SECURITY_INFO_NOT_SECURITY_INFO_TYPE = {
  SIT_NONE: 0,
  SIT_MATRIX_CARD: 1,
} as const;
export type KECH_SECURITY_INFO_NOT_SECURITY_INFO_TYPE = (typeof KECH_SECURITY_INFO_NOT_SECURITY_INFO_TYPE)[keyof typeof KECH_SECURITY_INFO_NOT_SECURITY_INFO_TYPE];
export function getKECH_SECURITY_INFO_NOT_SECURITY_INFO_TYPE(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_GLOBAL_AUTH)) {
    out['SIT_NONE'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_GLOBAL_AUTH)) {
    out['SIT_MATRIX_CARD'] = cur;
    cur += 1;
  }
  return out;
}
export interface KECH_SECURITY_INFO_NOT {
  m_iSecurityInfoType?: Int32;
  m_uiMatrixKey?: UInt32;
  m_wstrCoordinate?: string;
}
export function createKECH_SECURITY_INFO_NOT(flags?: FlagInput): KECH_SECURITY_INFO_NOT {
  const f = resolveFlags(flags);
  const obj: KECH_SECURITY_INFO_NOT = {
  };
  if (Boolean(f.SERV_GLOBAL_AUTH)) obj.m_iSecurityInfoType = 0;
  if (Boolean(f.SERV_GLOBAL_AUTH)) obj.m_uiMatrixKey = 0;
  if (Boolean(f.SERV_GLOBAL_AUTH)) obj.m_wstrCoordinate = '';
  return obj;
}
export function putKECH_SECURITY_INFO_NOT(ks: KSerializer, obj: KECH_SECURITY_INFO_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_AUTH)) {
    if (Boolean(f.SERV_GLOBAL_AUTH)) { if (!(ks.putInt32((obj.m_iSecurityInfoType ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_AUTH)) { if (!(ks.putUInt32((obj.m_uiMatrixKey ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_AUTH)) { if (!(ks.putWString((obj.m_wstrCoordinate ?? '')))) return false; }
  }
  return true;
}
export function getKECH_SECURITY_INFO_NOT(ks: KSerializer, flags?: FlagInput): KECH_SECURITY_INFO_NOT {
  const f = resolveFlags(flags);
  const obj = createKECH_SECURITY_INFO_NOT(f);
  if (Boolean(f.SERV_GLOBAL_AUTH)) {
    if (Boolean(f.SERV_GLOBAL_AUTH)) { obj.m_iSecurityInfoType = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_AUTH)) { obj.m_uiMatrixKey = ks.getUInt32(); }
    if (Boolean(f.SERV_GLOBAL_AUTH)) { obj.m_wstrCoordinate = ks.getWString(); }
  }
  return obj;
}

export interface KEGS_EXCHANGE_CASH_REQ {
  m_uiExchangeValue?: Int32;
}
export function createKEGS_EXCHANGE_CASH_REQ(flags?: FlagInput): KEGS_EXCHANGE_CASH_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_EXCHANGE_CASH_REQ = {
  };
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_uiExchangeValue = 0;
  return obj;
}
export function putKEGS_EXCHANGE_CASH_REQ(ks: KSerializer, obj: KEGS_EXCHANGE_CASH_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_uiExchangeValue ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_EXCHANGE_CASH_REQ(ks: KSerializer, flags?: FlagInput): KEGS_EXCHANGE_CASH_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_EXCHANGE_CASH_REQ(f);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_uiExchangeValue = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_EXCHANGE_CASH_ACK {
  m_iOK?: Int32;
  m_iPoint?: Int32;
  m_AddBonusCashInfo?: KGlobalCashInfo;
}
export function createKEGS_EXCHANGE_CASH_ACK(flags?: FlagInput): KEGS_EXCHANGE_CASH_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_EXCHANGE_CASH_ACK = {
  };
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iOK = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iPoint = 0;
  if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) obj.m_AddBonusCashInfo = createKGlobalCashInfo(f);
  return obj;
}
export function putKEGS_EXCHANGE_CASH_ACK(ks: KSerializer, obj: KEGS_EXCHANGE_CASH_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_iPoint ?? 0)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) { if (!(ks.putUserClass((obj.m_AddBonusCashInfo ?? createKGlobalCashInfo(f)), putKGlobalCashInfo, f))) return false; }
  }
  return true;
}
export function getKEGS_EXCHANGE_CASH_ACK(ks: KSerializer, flags?: FlagInput): KEGS_EXCHANGE_CASH_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_EXCHANGE_CASH_ACK(f);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iPoint = ks.getInt32(); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) { obj.m_AddBonusCashInfo = ks.getUserClass(getKGlobalCashInfo, f); }
  }
  return obj;
}

export interface KEGS_BONUS_CASH_EVENT_NOT {
  m_bEventStart?: boolean;
}
export function createKEGS_BONUS_CASH_EVENT_NOT(flags?: FlagInput): KEGS_BONUS_CASH_EVENT_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_BONUS_CASH_EVENT_NOT = {
  };
  if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) obj.m_bEventStart = false;
  return obj;
}
export function putKEGS_BONUS_CASH_EVENT_NOT(ks: KSerializer, obj: KEGS_BONUS_CASH_EVENT_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) {
    if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) { if (!(ks.putBool((obj.m_bEventStart ?? false)))) return false; }
  }
  return true;
}
export function getKEGS_BONUS_CASH_EVENT_NOT(ks: KSerializer, flags?: FlagInput): KEGS_BONUS_CASH_EVENT_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_BONUS_CASH_EVENT_NOT(f);
  if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) {
    if (f.SERV_GLOBAL_BILLING && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) { obj.m_bEventStart = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_BILL_PRODUCT_INFO_REQ {
  m_iPage?: Int32;
}
export function createKEGS_BILL_PRODUCT_INFO_REQ(flags?: FlagInput): KEGS_BILL_PRODUCT_INFO_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_BILL_PRODUCT_INFO_REQ = {
  };
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iPage = 0;
  return obj;
}
export function putKEGS_BILL_PRODUCT_INFO_REQ(ks: KSerializer, obj: KEGS_BILL_PRODUCT_INFO_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_iPage ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_BILL_PRODUCT_INFO_REQ(ks: KSerializer, flags?: FlagInput): KEGS_BILL_PRODUCT_INFO_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_BILL_PRODUCT_INFO_REQ(f);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iPage = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_BILL_PRODUCT_INFO_ACK {
  m_bFinal?: boolean;
  m_vecProductInfo?: KBillProductInfo[];
  m_mapKeepShowItem?: Map<Int32, Int32[]>;
  m_DisCountInfoMap?: Map<Int32, kDisCountItemInfo>;
  m_setWishListNoItemList?: Set<Int32>;
}
export function createKEGS_BILL_PRODUCT_INFO_ACK(flags?: FlagInput): KEGS_BILL_PRODUCT_INFO_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_BILL_PRODUCT_INFO_ACK = {
  };
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_bFinal = false;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_vecProductInfo = ([] as KBillProductInfo[]);
  if (f.SERV_GLOBAL_BILLING && f.SERV_KEEP_ITEM_SHOW_CASHSHOP) obj.m_mapKeepShowItem = new Map<Int32, Int32[]>();
  if (f.SERV_GLOBAL_BILLING && f.SERV_KEEP_ITEM_SHOW_CASHSHOP) obj.m_DisCountInfoMap = new Map<Int32, kDisCountItemInfo>();
  if (f.SERV_GLOBAL_BILLING && f.SERV_WISH_LIST_NO_ITEM) obj.m_setWishListNoItemList = new Set<Int32>();
  return obj;
}
export function putKEGS_BILL_PRODUCT_INFO_ACK(ks: KSerializer, obj: KEGS_BILL_PRODUCT_INFO_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putBool((obj.m_bFinal ?? false)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putVector((obj.m_vecProductInfo ?? ([] as KBillProductInfo[])), (ks, item: KBillProductInfo) => ks.putUserClass(item, putKBillProductInfo, f)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_KEEP_ITEM_SHOW_CASHSHOP) { if (!(ks.putMap((obj.m_mapKeepShowItem ?? new Map<Int32, Int32[]>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32[]) => ks.putVector(v, (ks, item: Int32) => ks.putInt32(item))))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_KEEP_ITEM_SHOW_CASHSHOP) { if (!(ks.putMap((obj.m_DisCountInfoMap ?? new Map<Int32, kDisCountItemInfo>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: kDisCountItemInfo) => ks.putUserClass(v, putkDisCountItemInfo, f)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_WISH_LIST_NO_ITEM) { if (!(ks.putSet((obj.m_setWishListNoItemList ?? new Set<Int32>()), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  }
  return true;
}
export function getKEGS_BILL_PRODUCT_INFO_ACK(ks: KSerializer, flags?: FlagInput): KEGS_BILL_PRODUCT_INFO_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_BILL_PRODUCT_INFO_ACK(f);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_bFinal = ks.getBool(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_vecProductInfo = ks.getVector<KBillProductInfo>((ks) => ks.getUserClass(getKBillProductInfo, f)); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_KEEP_ITEM_SHOW_CASHSHOP) { obj.m_mapKeepShowItem = ks.getMap<Int32, Int32[]>((ks) => ks.getInt32(), (ks) => ks.getVector<Int32>((ks) => ks.getInt32())); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_KEEP_ITEM_SHOW_CASHSHOP) { obj.m_DisCountInfoMap = ks.getMap<Int32, kDisCountItemInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getkDisCountItemInfo, f)); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_WISH_LIST_NO_ITEM) { obj.m_setWishListNoItemList = ks.getSet<Int32>((ks) => ks.getInt32()); }
  }
  return obj;
}

export interface KEGS_BILL_INVENTORY_INQUIRY_REQ {
  m_nItemPerPage?: Int32;
  m_iCurrentPage?: Int32;
}
export function createKEGS_BILL_INVENTORY_INQUIRY_REQ(flags?: FlagInput): KEGS_BILL_INVENTORY_INQUIRY_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_BILL_INVENTORY_INQUIRY_REQ = {
  };
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_nItemPerPage = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iCurrentPage = 0;
  return obj;
}
export function putKEGS_BILL_INVENTORY_INQUIRY_REQ(ks: KSerializer, obj: KEGS_BILL_INVENTORY_INQUIRY_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_nItemPerPage ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_iCurrentPage ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_BILL_INVENTORY_INQUIRY_REQ(ks: KSerializer, flags?: FlagInput): KEGS_BILL_INVENTORY_INQUIRY_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_BILL_INVENTORY_INQUIRY_REQ(f);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_nItemPerPage = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iCurrentPage = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_BILL_INVENTORY_INQUIRY_ACK {
  m_iOK?: Int32;
  m_vecOrderInfo?: KBillOrderInfo[];
  m_vecPackageInfo?: KBillPackageInfo[];
  m_vecSubPackageTrans?: Int32[];
  m_vecSubPackageInfo?: Int32[];
}
export function createKEGS_BILL_INVENTORY_INQUIRY_ACK(flags?: FlagInput): KEGS_BILL_INVENTORY_INQUIRY_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_BILL_INVENTORY_INQUIRY_ACK = {
  };
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iOK = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_vecOrderInfo = ([] as KBillOrderInfo[]);
  if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) obj.m_vecPackageInfo = ([] as KBillPackageInfo[]);
  if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) obj.m_vecSubPackageTrans = ([] as Int32[]);
  if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) obj.m_vecSubPackageInfo = ([] as Int32[]);
  return obj;
}
export function putKEGS_BILL_INVENTORY_INQUIRY_ACK(ks: KSerializer, obj: KEGS_BILL_INVENTORY_INQUIRY_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putVector((obj.m_vecOrderInfo ?? ([] as KBillOrderInfo[])), (ks, item: KBillOrderInfo) => ks.putUserClass(item, putKBillOrderInfo, f)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { if (!(ks.putVector((obj.m_vecPackageInfo ?? ([] as KBillPackageInfo[])), (ks, item: KBillPackageInfo) => ks.putUserClass(item, putKBillPackageInfo, f)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { if (!(ks.putVector((obj.m_vecSubPackageTrans ?? ([] as Int32[])), (ks, item: Int32) => ks.putInt32(item)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { if (!(ks.putVector((obj.m_vecSubPackageInfo ?? ([] as Int32[])), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  }
  return true;
}
export function getKEGS_BILL_INVENTORY_INQUIRY_ACK(ks: KSerializer, flags?: FlagInput): KEGS_BILL_INVENTORY_INQUIRY_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_BILL_INVENTORY_INQUIRY_ACK(f);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_vecOrderInfo = ks.getVector<KBillOrderInfo>((ks) => ks.getUserClass(getKBillOrderInfo, f)); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { obj.m_vecPackageInfo = ks.getVector<KBillPackageInfo>((ks) => ks.getUserClass(getKBillPackageInfo, f)); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { obj.m_vecSubPackageTrans = ks.getVector<Int32>((ks) => ks.getInt32()); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { obj.m_vecSubPackageInfo = ks.getVector<Int32>((ks) => ks.getInt32()); }
  }
  return obj;
}

export interface KEGS_BILL_GET_PURCHASED_CASH_ITEM_REQ {
  m_iTransNo?: Int32;
  m_iProductNo?: Int32;
  m_mapSocketForCash?: Map<Int32, Int32>;
  m_mapSocketGroupIDForCash?: Map<Int32, Int32>;
  m_byteProductKind?: UInt8;
}
export function createKEGS_BILL_GET_PURCHASED_CASH_ITEM_REQ(flags?: FlagInput): KEGS_BILL_GET_PURCHASED_CASH_ITEM_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_BILL_GET_PURCHASED_CASH_ITEM_REQ = {
  };
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iTransNo = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_iProductNo = 0;
  if (Boolean(f.SERV_GLOBAL_BILLING)) obj.m_mapSocketForCash = new Map<Int32, Int32>();
  if (f.SERV_GLOBAL_BILLING && f.SERV_CASH_ITEM_SOCKET_OPTION) obj.m_mapSocketGroupIDForCash = new Map<Int32, Int32>();
  if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) obj.m_byteProductKind = 0;
  return obj;
}
export function putKEGS_BILL_GET_PURCHASED_CASH_ITEM_REQ(ks: KSerializer, obj: KEGS_BILL_GET_PURCHASED_CASH_ITEM_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_iTransNo ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putInt32((obj.m_iProductNo ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { if (!(ks.putMap((obj.m_mapSocketForCash ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { if (!(ks.putMap((obj.m_mapSocketGroupIDForCash ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { if (!(ks.putUInt8((obj.m_byteProductKind ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_BILL_GET_PURCHASED_CASH_ITEM_REQ(ks: KSerializer, flags?: FlagInput): KEGS_BILL_GET_PURCHASED_CASH_ITEM_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_BILL_GET_PURCHASED_CASH_ITEM_REQ(f);
  if (Boolean(f.SERV_GLOBAL_BILLING)) {
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iTransNo = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_iProductNo = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_BILLING)) { obj.m_mapSocketForCash = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { obj.m_mapSocketGroupIDForCash = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GLOBAL_CASH_PACKAGE) { obj.m_byteProductKind = ks.getUInt8(); }
  }
  return obj;
}

export interface KEGS_CHARGE_POINT_NOT {
  m_iOK?: Int32;
  m_iChargedCash?: Int32;
}
export function createKEGS_CHARGE_POINT_NOT(flags?: FlagInput): KEGS_CHARGE_POINT_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_CHARGE_POINT_NOT = {
  };
  if (f.SERV_GLOBAL_BILLING && f.SERV_GOLD_TICKET) obj.m_iOK = 0;
  if (f.SERV_GLOBAL_BILLING && f.SERV_GOLD_TICKET) obj.m_iChargedCash = 0;
  return obj;
}
export function putKEGS_CHARGE_POINT_NOT(ks: KSerializer, obj: KEGS_CHARGE_POINT_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (f.SERV_GLOBAL_BILLING && f.SERV_GOLD_TICKET) {
    if (f.SERV_GLOBAL_BILLING && f.SERV_GOLD_TICKET) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GOLD_TICKET) { if (!(ks.putInt32((obj.m_iChargedCash ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_CHARGE_POINT_NOT(ks: KSerializer, flags?: FlagInput): KEGS_CHARGE_POINT_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_CHARGE_POINT_NOT(f);
  if (f.SERV_GLOBAL_BILLING && f.SERV_GOLD_TICKET) {
    if (f.SERV_GLOBAL_BILLING && f.SERV_GOLD_TICKET) { obj.m_iOK = ks.getInt32(); }
    if (f.SERV_GLOBAL_BILLING && f.SERV_GOLD_TICKET) { obj.m_iChargedCash = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_ADMIN_DELETE_GUILD_ADD_NOT {
  m_iGuildUID?: Int32;
}
export function createKEGS_ADMIN_DELETE_GUILD_ADD_NOT(flags?: FlagInput): KEGS_ADMIN_DELETE_GUILD_ADD_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_ADMIN_DELETE_GUILD_ADD_NOT = {
  };
  if (Boolean(f.SERV_DELETE_GUILD_ADD_CHEAT)) obj.m_iGuildUID = 0;
  return obj;
}
export function putKEGS_ADMIN_DELETE_GUILD_ADD_NOT(ks: KSerializer, obj: KEGS_ADMIN_DELETE_GUILD_ADD_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_DELETE_GUILD_ADD_CHEAT)) {
    if (Boolean(f.SERV_DELETE_GUILD_ADD_CHEAT)) { if (!(ks.putInt32((obj.m_iGuildUID ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_ADMIN_DELETE_GUILD_ADD_NOT(ks: KSerializer, flags?: FlagInput): KEGS_ADMIN_DELETE_GUILD_ADD_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_ADMIN_DELETE_GUILD_ADD_NOT(f);
  if (Boolean(f.SERV_DELETE_GUILD_ADD_CHEAT)) {
    if (Boolean(f.SERV_DELETE_GUILD_ADD_CHEAT)) { obj.m_iGuildUID = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_ADMIN_DELETE_HENIR_RANKING_RANK_NOT {
  m_iRankingType?: Int32;
  m_iRank?: Int32;
}
export function createKEGS_ADMIN_DELETE_HENIR_RANKING_RANK_NOT(flags?: FlagInput): KEGS_ADMIN_DELETE_HENIR_RANKING_RANK_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_ADMIN_DELETE_HENIR_RANKING_RANK_NOT = {
  };
  if (Boolean(f.SERV_DELETE_HENIR_RANKING)) obj.m_iRankingType = 0;
  if (Boolean(f.SERV_DELETE_HENIR_RANKING)) obj.m_iRank = 0;
  return obj;
}
export function putKEGS_ADMIN_DELETE_HENIR_RANKING_RANK_NOT(ks: KSerializer, obj: KEGS_ADMIN_DELETE_HENIR_RANKING_RANK_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_DELETE_HENIR_RANKING)) {
    if (Boolean(f.SERV_DELETE_HENIR_RANKING)) { if (!(ks.putInt32((obj.m_iRankingType ?? 0)))) return false; }
    if (Boolean(f.SERV_DELETE_HENIR_RANKING)) { if (!(ks.putInt32((obj.m_iRank ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_ADMIN_DELETE_HENIR_RANKING_RANK_NOT(ks: KSerializer, flags?: FlagInput): KEGS_ADMIN_DELETE_HENIR_RANKING_RANK_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_ADMIN_DELETE_HENIR_RANKING_RANK_NOT(f);
  if (Boolean(f.SERV_DELETE_HENIR_RANKING)) {
    if (Boolean(f.SERV_DELETE_HENIR_RANKING)) { obj.m_iRankingType = ks.getInt32(); }
    if (Boolean(f.SERV_DELETE_HENIR_RANKING)) { obj.m_iRank = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_ADMIN_DELETE_HENIR_RANKING_NICKNAME_NOT {
  m_iRankingType?: Int32;
  m_wstrNickName?: string;
}
export function createKEGS_ADMIN_DELETE_HENIR_RANKING_NICKNAME_NOT(flags?: FlagInput): KEGS_ADMIN_DELETE_HENIR_RANKING_NICKNAME_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_ADMIN_DELETE_HENIR_RANKING_NICKNAME_NOT = {
  };
  if (Boolean(f.SERV_DELETE_HENIR_RANKING)) obj.m_iRankingType = 0;
  if (Boolean(f.SERV_DELETE_HENIR_RANKING)) obj.m_wstrNickName = '';
  return obj;
}
export function putKEGS_ADMIN_DELETE_HENIR_RANKING_NICKNAME_NOT(ks: KSerializer, obj: KEGS_ADMIN_DELETE_HENIR_RANKING_NICKNAME_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_DELETE_HENIR_RANKING)) {
    if (Boolean(f.SERV_DELETE_HENIR_RANKING)) { if (!(ks.putInt32((obj.m_iRankingType ?? 0)))) return false; }
    if (Boolean(f.SERV_DELETE_HENIR_RANKING)) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
  }
  return true;
}
export function getKEGS_ADMIN_DELETE_HENIR_RANKING_NICKNAME_NOT(ks: KSerializer, flags?: FlagInput): KEGS_ADMIN_DELETE_HENIR_RANKING_NICKNAME_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_ADMIN_DELETE_HENIR_RANKING_NICKNAME_NOT(f);
  if (Boolean(f.SERV_DELETE_HENIR_RANKING)) {
    if (Boolean(f.SERV_DELETE_HENIR_RANKING)) { obj.m_iRankingType = ks.getInt32(); }
    if (Boolean(f.SERV_DELETE_HENIR_RANKING)) { obj.m_wstrNickName = ks.getWString(); }
  }
  return obj;
}

export interface KEGS_ADMIN_DELETE_HENIR_RANKING_UNITUID_NOT {
  m_iRankingType?: Int32;
  m_iUnitUID?: UidType;
}
export function createKEGS_ADMIN_DELETE_HENIR_RANKING_UNITUID_NOT(flags?: FlagInput): KEGS_ADMIN_DELETE_HENIR_RANKING_UNITUID_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_ADMIN_DELETE_HENIR_RANKING_UNITUID_NOT = {
  };
  if (Boolean(f.SERV_DELETE_HENIR_RANKING)) obj.m_iRankingType = 0;
  if (Boolean(f.SERV_DELETE_HENIR_RANKING)) obj.m_iUnitUID = 0n;
  return obj;
}
export function putKEGS_ADMIN_DELETE_HENIR_RANKING_UNITUID_NOT(ks: KSerializer, obj: KEGS_ADMIN_DELETE_HENIR_RANKING_UNITUID_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_DELETE_HENIR_RANKING)) {
    if (Boolean(f.SERV_DELETE_HENIR_RANKING)) { if (!(ks.putInt32((obj.m_iRankingType ?? 0)))) return false; }
    if (Boolean(f.SERV_DELETE_HENIR_RANKING)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
  }
  return true;
}
export function getKEGS_ADMIN_DELETE_HENIR_RANKING_UNITUID_NOT(ks: KSerializer, flags?: FlagInput): KEGS_ADMIN_DELETE_HENIR_RANKING_UNITUID_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_ADMIN_DELETE_HENIR_RANKING_UNITUID_NOT(f);
  if (Boolean(f.SERV_DELETE_HENIR_RANKING)) {
    if (Boolean(f.SERV_DELETE_HENIR_RANKING)) { obj.m_iRankingType = ks.getInt32(); }
    if (Boolean(f.SERV_DELETE_HENIR_RANKING)) { obj.m_iUnitUID = ks.getInt64(); }
  }
  return obj;
}

export interface KEGS_NEW_CHARACTER_TRADE_BLOCK_MSG_NOT {
  m_wstrNewCharTBMsg?: string;
}
export function createKEGS_NEW_CHARACTER_TRADE_BLOCK_MSG_NOT(flags?: FlagInput): KEGS_NEW_CHARACTER_TRADE_BLOCK_MSG_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_NEW_CHARACTER_TRADE_BLOCK_MSG_NOT = {
  };
  if (Boolean(f.SERV_NEW_UNIT_TRADE_LIMIT)) obj.m_wstrNewCharTBMsg = '';
  return obj;
}
export function putKEGS_NEW_CHARACTER_TRADE_BLOCK_MSG_NOT(ks: KSerializer, obj: KEGS_NEW_CHARACTER_TRADE_BLOCK_MSG_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEW_UNIT_TRADE_LIMIT)) {
    if (Boolean(f.SERV_NEW_UNIT_TRADE_LIMIT)) { if (!(ks.putWString((obj.m_wstrNewCharTBMsg ?? '')))) return false; }
  }
  return true;
}
export function getKEGS_NEW_CHARACTER_TRADE_BLOCK_MSG_NOT(ks: KSerializer, flags?: FlagInput): KEGS_NEW_CHARACTER_TRADE_BLOCK_MSG_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_NEW_CHARACTER_TRADE_BLOCK_MSG_NOT(f);
  if (Boolean(f.SERV_NEW_UNIT_TRADE_LIMIT)) {
    if (Boolean(f.SERV_NEW_UNIT_TRADE_LIMIT)) { obj.m_wstrNewCharTBMsg = ks.getWString(); }
  }
  return obj;
}

export const KEGS_USER_COMMUNITY_SURVEY_NEW_REQ_COMMUNITY_TAB_TYPE = {
  NONE: 0,
  USER_WATCH: 1,
  INVITE_GUILD: 2,
} as const;
export type KEGS_USER_COMMUNITY_SURVEY_NEW_REQ_COMMUNITY_TAB_TYPE = (typeof KEGS_USER_COMMUNITY_SURVEY_NEW_REQ_COMMUNITY_TAB_TYPE)[keyof typeof KEGS_USER_COMMUNITY_SURVEY_NEW_REQ_COMMUNITY_TAB_TYPE];
export function getKEGS_USER_COMMUNITY_SURVEY_NEW_REQ_COMMUNITY_TAB_TYPE(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_USER_WATCH_NEW)) {
    cur = 0;
    out['NONE'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_USER_WATCH_NEW)) {
    out['USER_WATCH'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_USER_WATCH_NEW)) {
    out['INVITE_GUILD'] = cur;
    cur += 1;
  }
  return out;
}
export interface KEGS_USER_COMMUNITY_SURVEY_NEW_REQ {
  m_wUnitNickName?: string;
  m_cCommunity_Tab_Type?: Int32;
  m_iOK?: Int32;
}
export function createKEGS_USER_COMMUNITY_SURVEY_NEW_REQ(flags?: FlagInput): KEGS_USER_COMMUNITY_SURVEY_NEW_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_USER_COMMUNITY_SURVEY_NEW_REQ = {
  };
  if (Boolean(f.SERV_USER_WATCH_NEW)) obj.m_wUnitNickName = '';
  if (Boolean(f.SERV_USER_WATCH_NEW)) obj.m_cCommunity_Tab_Type = 0;
  if (Boolean(f.SERV_USER_WATCH_NEW)) obj.m_iOK = 0;
  return obj;
}
export function putKEGS_USER_COMMUNITY_SURVEY_NEW_REQ(ks: KSerializer, obj: KEGS_USER_COMMUNITY_SURVEY_NEW_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_USER_WATCH_NEW)) {
    if (Boolean(f.SERV_USER_WATCH_NEW)) { if (!(ks.putWString((obj.m_wUnitNickName ?? '')))) return false; }
    if (Boolean(f.SERV_USER_WATCH_NEW)) { if (!(ks.putInt32((obj.m_cCommunity_Tab_Type ?? 0)))) return false; }
    if (Boolean(f.SERV_USER_WATCH_NEW)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_USER_COMMUNITY_SURVEY_NEW_REQ(ks: KSerializer, flags?: FlagInput): KEGS_USER_COMMUNITY_SURVEY_NEW_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_USER_COMMUNITY_SURVEY_NEW_REQ(f);
  if (Boolean(f.SERV_USER_WATCH_NEW)) {
    if (Boolean(f.SERV_USER_WATCH_NEW)) { obj.m_wUnitNickName = ks.getWString(); }
    if (Boolean(f.SERV_USER_WATCH_NEW)) { obj.m_cCommunity_Tab_Type = ks.getInt32(); }
    if (Boolean(f.SERV_USER_WATCH_NEW)) { obj.m_iOK = ks.getInt32(); }
  }
  return obj;
}

export const KEGS_USER_COMMUNITY_SURVEY_NEW_ACK_COMMUNITY_TAB_TYPE = {
  NONE: 0,
  USER_WATCH: 1,
  INVITE_GUILD: 2,
} as const;
export type KEGS_USER_COMMUNITY_SURVEY_NEW_ACK_COMMUNITY_TAB_TYPE = (typeof KEGS_USER_COMMUNITY_SURVEY_NEW_ACK_COMMUNITY_TAB_TYPE)[keyof typeof KEGS_USER_COMMUNITY_SURVEY_NEW_ACK_COMMUNITY_TAB_TYPE];
export function getKEGS_USER_COMMUNITY_SURVEY_NEW_ACK_COMMUNITY_TAB_TYPE(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_USER_WATCH_NEW)) {
    cur = 0;
    out['NONE'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_USER_WATCH_NEW)) {
    out['USER_WATCH'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_USER_WATCH_NEW)) {
    out['INVITE_GUILD'] = cur;
    cur += 1;
  }
  return out;
}
export interface KEGS_USER_COMMUNITY_SURVEY_NEW_ACK {
  unitUID?: UidType;
  m_cCommunity_Tab_Type?: Int32;
  m_iOK?: Int32;
}
export function createKEGS_USER_COMMUNITY_SURVEY_NEW_ACK(flags?: FlagInput): KEGS_USER_COMMUNITY_SURVEY_NEW_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_USER_COMMUNITY_SURVEY_NEW_ACK = {
  };
  if (Boolean(f.SERV_USER_WATCH_NEW)) obj.unitUID = 0n;
  if (Boolean(f.SERV_USER_WATCH_NEW)) obj.m_cCommunity_Tab_Type = 0;
  if (Boolean(f.SERV_USER_WATCH_NEW)) obj.m_iOK = 0;
  return obj;
}
export function putKEGS_USER_COMMUNITY_SURVEY_NEW_ACK(ks: KSerializer, obj: KEGS_USER_COMMUNITY_SURVEY_NEW_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_USER_WATCH_NEW)) {
    if (Boolean(f.SERV_USER_WATCH_NEW)) { if (!(ks.putInt64((obj.unitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_USER_WATCH_NEW)) { if (!(ks.putInt32((obj.m_cCommunity_Tab_Type ?? 0)))) return false; }
    if (Boolean(f.SERV_USER_WATCH_NEW)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_USER_COMMUNITY_SURVEY_NEW_ACK(ks: KSerializer, flags?: FlagInput): KEGS_USER_COMMUNITY_SURVEY_NEW_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_USER_COMMUNITY_SURVEY_NEW_ACK(f);
  if (Boolean(f.SERV_USER_WATCH_NEW)) {
    if (Boolean(f.SERV_USER_WATCH_NEW)) { obj.unitUID = ks.getInt64(); }
    if (Boolean(f.SERV_USER_WATCH_NEW)) { obj.m_cCommunity_Tab_Type = ks.getInt32(); }
    if (Boolean(f.SERV_USER_WATCH_NEW)) { obj.m_iOK = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_NPROTECT_CSAUTH3_CHECK_NOT {
  m_deqCSAuth3?: UInt8[];
}
export function createKEGS_NPROTECT_CSAUTH3_CHECK_NOT(flags?: FlagInput): KEGS_NPROTECT_CSAUTH3_CHECK_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_NPROTECT_CSAUTH3_CHECK_NOT = {
  };
  if (Boolean(f.SERV_NPROTECT_CS_AUTH_30)) obj.m_deqCSAuth3 = ([] as UInt8[]);
  return obj;
}
export function putKEGS_NPROTECT_CSAUTH3_CHECK_NOT(ks: KSerializer, obj: KEGS_NPROTECT_CSAUTH3_CHECK_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NPROTECT_CS_AUTH_30)) {
    if (Boolean(f.SERV_NPROTECT_CS_AUTH_30)) { if (!(ks.putDeque((obj.m_deqCSAuth3 ?? ([] as UInt8[])), (ks, item: UInt8) => ks.putUInt8(item)))) return false; }
  }
  return true;
}
export function getKEGS_NPROTECT_CSAUTH3_CHECK_NOT(ks: KSerializer, flags?: FlagInput): KEGS_NPROTECT_CSAUTH3_CHECK_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_NPROTECT_CSAUTH3_CHECK_NOT(f);
  if (Boolean(f.SERV_NPROTECT_CS_AUTH_30)) {
    if (Boolean(f.SERV_NPROTECT_CS_AUTH_30)) { obj.m_deqCSAuth3 = ks.getDeque<UInt8>((ks) => ks.getUInt8()); }
  }
  return obj;
}

export interface KEGS_PVP_REMATCH_REQ {
  m_bAcceptRematch?: boolean;
}
export function createKEGS_PVP_REMATCH_REQ(flags?: FlagInput): KEGS_PVP_REMATCH_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_PVP_REMATCH_REQ = {
  };
  if (Boolean(f.SERV_PVP_REMATCH)) obj.m_bAcceptRematch = false;
  return obj;
}
export function putKEGS_PVP_REMATCH_REQ(ks: KSerializer, obj: KEGS_PVP_REMATCH_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PVP_REMATCH)) {
    if (Boolean(f.SERV_PVP_REMATCH)) { if (!(ks.putBool((obj.m_bAcceptRematch ?? false)))) return false; }
  }
  return true;
}
export function getKEGS_PVP_REMATCH_REQ(ks: KSerializer, flags?: FlagInput): KEGS_PVP_REMATCH_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_PVP_REMATCH_REQ(f);
  if (Boolean(f.SERV_PVP_REMATCH)) {
    if (Boolean(f.SERV_PVP_REMATCH)) { obj.m_bAcceptRematch = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_PVP_REMATCH_ACK {
  m_iOK?: Int32;
}
export function createKEGS_PVP_REMATCH_ACK(flags?: FlagInput): KEGS_PVP_REMATCH_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_PVP_REMATCH_ACK = {
  };
  if (Boolean(f.SERV_PVP_REMATCH)) obj.m_iOK = 0;
  return obj;
}
export function putKEGS_PVP_REMATCH_ACK(ks: KSerializer, obj: KEGS_PVP_REMATCH_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PVP_REMATCH)) {
    if (Boolean(f.SERV_PVP_REMATCH)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_PVP_REMATCH_ACK(ks: KSerializer, flags?: FlagInput): KEGS_PVP_REMATCH_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_PVP_REMATCH_ACK(f);
  if (Boolean(f.SERV_PVP_REMATCH)) {
    if (Boolean(f.SERV_PVP_REMATCH)) { obj.m_iOK = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_PVP_REMATCH_NOT {
  m_iUnitUID?: UidType;
  m_bAcceptRematch?: boolean;
}
export function createKEGS_PVP_REMATCH_NOT(flags?: FlagInput): KEGS_PVP_REMATCH_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_PVP_REMATCH_NOT = {
  };
  if (Boolean(f.SERV_PVP_REMATCH)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_PVP_REMATCH)) obj.m_bAcceptRematch = false;
  return obj;
}
export function putKEGS_PVP_REMATCH_NOT(ks: KSerializer, obj: KEGS_PVP_REMATCH_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PVP_REMATCH)) {
    if (Boolean(f.SERV_PVP_REMATCH)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_PVP_REMATCH)) { if (!(ks.putBool((obj.m_bAcceptRematch ?? false)))) return false; }
  }
  return true;
}
export function getKEGS_PVP_REMATCH_NOT(ks: KSerializer, flags?: FlagInput): KEGS_PVP_REMATCH_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_PVP_REMATCH_NOT(f);
  if (Boolean(f.SERV_PVP_REMATCH)) {
    if (Boolean(f.SERV_PVP_REMATCH)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_PVP_REMATCH)) { obj.m_bAcceptRematch = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_RESTORE_UNIT_REQ {
  m_iUnitUID?: UidType;
  m_iUserUID?: UidType;
}
export function createKEGS_RESTORE_UNIT_REQ(flags?: FlagInput): KEGS_RESTORE_UNIT_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_RESTORE_UNIT_REQ = {
  };
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) obj.m_iUserUID = 0n;
  return obj;
}
export function putKEGS_RESTORE_UNIT_REQ(ks: KSerializer, obj: KEGS_RESTORE_UNIT_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) {
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { if (!(ks.putInt64((obj.m_iUserUID ?? 0n)))) return false; }
  }
  return true;
}
export function getKEGS_RESTORE_UNIT_REQ(ks: KSerializer, flags?: FlagInput): KEGS_RESTORE_UNIT_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_RESTORE_UNIT_REQ(f);
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) {
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { obj.m_iUserUID = ks.getInt64(); }
  }
  return obj;
}

export interface KEGS_RESTORE_UNIT_ACK {
  m_iOK?: Int32;
  m_iUnitUID?: UidType;
  m_tRestoreAbleDate?: Int64;
}
export function createKEGS_RESTORE_UNIT_ACK(flags?: FlagInput): KEGS_RESTORE_UNIT_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_RESTORE_UNIT_ACK = {
  };
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) obj.m_iOK = 0;
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) obj.m_tRestoreAbleDate = 0n;
  return obj;
}
export function putKEGS_RESTORE_UNIT_ACK(ks: KSerializer, obj: KEGS_RESTORE_UNIT_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) {
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { if (!(ks.putInt64((obj.m_tRestoreAbleDate ?? 0n)))) return false; }
  }
  return true;
}
export function getKEGS_RESTORE_UNIT_ACK(ks: KSerializer, flags?: FlagInput): KEGS_RESTORE_UNIT_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_RESTORE_UNIT_ACK(f);
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) {
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { obj.m_tRestoreAbleDate = ks.getInt64(); }
  }
  return obj;
}

export interface KEGS_FINAL_DELETE_UNIT_REQ {
  m_iUnitUID?: UidType;
  m_iUserUID?: UidType;
}
export function createKEGS_FINAL_DELETE_UNIT_REQ(flags?: FlagInput): KEGS_FINAL_DELETE_UNIT_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_FINAL_DELETE_UNIT_REQ = {
  };
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) obj.m_iUserUID = 0n;
  return obj;
}
export function putKEGS_FINAL_DELETE_UNIT_REQ(ks: KSerializer, obj: KEGS_FINAL_DELETE_UNIT_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) {
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { if (!(ks.putInt64((obj.m_iUserUID ?? 0n)))) return false; }
  }
  return true;
}
export function getKEGS_FINAL_DELETE_UNIT_REQ(ks: KSerializer, flags?: FlagInput): KEGS_FINAL_DELETE_UNIT_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_FINAL_DELETE_UNIT_REQ(f);
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) {
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { obj.m_iUserUID = ks.getInt64(); }
  }
  return obj;
}

export interface KEGS_FINAL_DELETE_UNIT_ACK {
  m_iOK?: Int32;
  m_iUnitUID?: UidType;
  m_uiKNMSerialNum?: UInt32;
  m_iGuildUID?: Int32;
  m_wstrNickName?: string;
  m_ucLevel?: UInt8;
  m_cUnitClass?: Int8;
  m_tReDelAbleDate?: Int64;
}
export function createKEGS_FINAL_DELETE_UNIT_ACK(flags?: FlagInput): KEGS_FINAL_DELETE_UNIT_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_FINAL_DELETE_UNIT_ACK = {
  };
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) obj.m_iOK = 0;
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) obj.m_uiKNMSerialNum = 0;
  if (f.SERV_UNIT_WAIT_DELETE && f.GUILD_TEST) obj.m_iGuildUID = 0;
  if (f.SERV_UNIT_WAIT_DELETE && f.SERV_CHAR_LOG) obj.m_wstrNickName = '';
  if (f.SERV_UNIT_WAIT_DELETE && f.SERV_CHAR_LOG) obj.m_ucLevel = 0;
  if (f.SERV_UNIT_WAIT_DELETE && f.SERV_CHAR_LOG) obj.m_cUnitClass = 0;
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) obj.m_tReDelAbleDate = 0n;
  return obj;
}
export function putKEGS_FINAL_DELETE_UNIT_ACK(ks: KSerializer, obj: KEGS_FINAL_DELETE_UNIT_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) {
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { if (!(ks.putUInt32((obj.m_uiKNMSerialNum ?? 0)))) return false; }
    if (f.SERV_UNIT_WAIT_DELETE && f.GUILD_TEST) { if (!(ks.putInt32((obj.m_iGuildUID ?? 0)))) return false; }
    if (f.SERV_UNIT_WAIT_DELETE && f.SERV_CHAR_LOG) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
    if (f.SERV_UNIT_WAIT_DELETE && f.SERV_CHAR_LOG) { if (!(ks.putUInt8((obj.m_ucLevel ?? 0)))) return false; }
    if (f.SERV_UNIT_WAIT_DELETE && f.SERV_CHAR_LOG) { if (!(ks.putInt8((obj.m_cUnitClass ?? 0)))) return false; }
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { if (!(ks.putInt64((obj.m_tReDelAbleDate ?? 0n)))) return false; }
  }
  return true;
}
export function getKEGS_FINAL_DELETE_UNIT_ACK(ks: KSerializer, flags?: FlagInput): KEGS_FINAL_DELETE_UNIT_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_FINAL_DELETE_UNIT_ACK(f);
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) {
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { obj.m_uiKNMSerialNum = ks.getUInt32(); }
    if (f.SERV_UNIT_WAIT_DELETE && f.GUILD_TEST) { obj.m_iGuildUID = ks.getInt32(); }
    if (f.SERV_UNIT_WAIT_DELETE && f.SERV_CHAR_LOG) { obj.m_wstrNickName = ks.getWString(); }
    if (f.SERV_UNIT_WAIT_DELETE && f.SERV_CHAR_LOG) { obj.m_ucLevel = ks.getUInt8(); }
    if (f.SERV_UNIT_WAIT_DELETE && f.SERV_CHAR_LOG) { obj.m_cUnitClass = ks.getInt8(); }
    if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { obj.m_tReDelAbleDate = ks.getInt64(); }
  }
  return obj;
}

export interface KEGS_RESOLVE_ITEM_AVATAR_REQ {
  m_mapResolveDataAvatar?: Map<Int32, UidType>;
  m_iAttachFee?: Int32;
}
export function createKEGS_RESOLVE_ITEM_AVATAR_REQ(flags?: FlagInput): KEGS_RESOLVE_ITEM_AVATAR_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_RESOLVE_ITEM_AVATAR_REQ = {
  };
  if (Boolean(f.SERV_MULTI_RESOLVE)) obj.m_mapResolveDataAvatar = new Map<Int32, UidType>();
  if (Boolean(f.SERV_MULTI_RESOLVE)) obj.m_iAttachFee = 0;
  return obj;
}
export function putKEGS_RESOLVE_ITEM_AVATAR_REQ(ks: KSerializer, obj: KEGS_RESOLVE_ITEM_AVATAR_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_MULTI_RESOLVE)) {
    if (Boolean(f.SERV_MULTI_RESOLVE)) { if (!(ks.putMap((obj.m_mapResolveDataAvatar ?? new Map<Int32, UidType>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: UidType) => ks.putInt64(v)))) return false; }
    if (Boolean(f.SERV_MULTI_RESOLVE)) { if (!(ks.putInt32((obj.m_iAttachFee ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_RESOLVE_ITEM_AVATAR_REQ(ks: KSerializer, flags?: FlagInput): KEGS_RESOLVE_ITEM_AVATAR_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_RESOLVE_ITEM_AVATAR_REQ(f);
  if (Boolean(f.SERV_MULTI_RESOLVE)) {
    if (Boolean(f.SERV_MULTI_RESOLVE)) { obj.m_mapResolveDataAvatar = ks.getMap<Int32, UidType>((ks) => ks.getInt32(), (ks) => ks.getInt64()); }
    if (Boolean(f.SERV_MULTI_RESOLVE)) { obj.m_iAttachFee = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_RESOLVE_ITEM_AVATAR_ACK {
  m_iOK?: Int32;
  m_bJackpot?: boolean;
  m_mapInsertedItem?: Map<Int32, Int32>;
  m_vecKInventorySlotInfo?: KInventoryItemInfo[];
}
export function createKEGS_RESOLVE_ITEM_AVATAR_ACK(flags?: FlagInput): KEGS_RESOLVE_ITEM_AVATAR_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_RESOLVE_ITEM_AVATAR_ACK = {
  };
  if (Boolean(f.SERV_MULTI_RESOLVE)) obj.m_iOK = 0;
  if (Boolean(f.SERV_MULTI_RESOLVE)) obj.m_bJackpot = false;
  if (Boolean(f.SERV_MULTI_RESOLVE)) obj.m_mapInsertedItem = new Map<Int32, Int32>();
  if (Boolean(f.SERV_MULTI_RESOLVE)) obj.m_vecKInventorySlotInfo = ([] as KInventoryItemInfo[]);
  return obj;
}
export function putKEGS_RESOLVE_ITEM_AVATAR_ACK(ks: KSerializer, obj: KEGS_RESOLVE_ITEM_AVATAR_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_MULTI_RESOLVE)) {
    if (Boolean(f.SERV_MULTI_RESOLVE)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_MULTI_RESOLVE)) { if (!(ks.putBool((obj.m_bJackpot ?? false)))) return false; }
    if (Boolean(f.SERV_MULTI_RESOLVE)) { if (!(ks.putMap((obj.m_mapInsertedItem ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (Boolean(f.SERV_MULTI_RESOLVE)) { if (!(ks.putVector((obj.m_vecKInventorySlotInfo ?? ([] as KInventoryItemInfo[])), (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false; }
  }
  return true;
}
export function getKEGS_RESOLVE_ITEM_AVATAR_ACK(ks: KSerializer, flags?: FlagInput): KEGS_RESOLVE_ITEM_AVATAR_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_RESOLVE_ITEM_AVATAR_ACK(f);
  if (Boolean(f.SERV_MULTI_RESOLVE)) {
    if (Boolean(f.SERV_MULTI_RESOLVE)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_MULTI_RESOLVE)) { obj.m_bJackpot = ks.getBool(); }
    if (Boolean(f.SERV_MULTI_RESOLVE)) { obj.m_mapInsertedItem = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
    if (Boolean(f.SERV_MULTI_RESOLVE)) { obj.m_vecKInventorySlotInfo = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
  }
  return obj;
}

export interface KEGS_SYNTHESIS_SOCKET_GROUPID_ACK {
  m_iOK?: Int32;
  m_mapAvatarSocketOptionGroupID?: Map<Int32, Int32>;
}
export function createKEGS_SYNTHESIS_SOCKET_GROUPID_ACK(flags?: FlagInput): KEGS_SYNTHESIS_SOCKET_GROUPID_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_SYNTHESIS_SOCKET_GROUPID_ACK = {
  };
  if (Boolean(f.SERV_SYNTHESIS_AVATAR)) obj.m_iOK = 0;
  if (Boolean(f.SERV_SYNTHESIS_AVATAR)) obj.m_mapAvatarSocketOptionGroupID = new Map<Int32, Int32>();
  return obj;
}
export function putKEGS_SYNTHESIS_SOCKET_GROUPID_ACK(ks: KSerializer, obj: KEGS_SYNTHESIS_SOCKET_GROUPID_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SYNTHESIS_AVATAR)) {
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { if (!(ks.putMap((obj.m_mapAvatarSocketOptionGroupID ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
  }
  return true;
}
export function getKEGS_SYNTHESIS_SOCKET_GROUPID_ACK(ks: KSerializer, flags?: FlagInput): KEGS_SYNTHESIS_SOCKET_GROUPID_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_SYNTHESIS_SOCKET_GROUPID_ACK(f);
  if (Boolean(f.SERV_SYNTHESIS_AVATAR)) {
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { obj.m_mapAvatarSocketOptionGroupID = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
  }
  return obj;
}

export interface KEGS_SYNTHESIS_ITEM_REQ {
  m_mapSynthesisData?: Map<Int32, UidType>;
  m_iKeyData?: UidType;
  m_iSocketNo?: Int32;
}
export function createKEGS_SYNTHESIS_ITEM_REQ(flags?: FlagInput): KEGS_SYNTHESIS_ITEM_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_SYNTHESIS_ITEM_REQ = {
  };
  if (Boolean(f.SERV_SYNTHESIS_AVATAR)) obj.m_mapSynthesisData = new Map<Int32, UidType>();
  if (Boolean(f.SERV_SYNTHESIS_AVATAR)) obj.m_iKeyData = 0n;
  if (Boolean(f.SERV_SYNTHESIS_AVATAR)) obj.m_iSocketNo = 0;
  return obj;
}
export function putKEGS_SYNTHESIS_ITEM_REQ(ks: KSerializer, obj: KEGS_SYNTHESIS_ITEM_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SYNTHESIS_AVATAR)) {
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { if (!(ks.putMap((obj.m_mapSynthesisData ?? new Map<Int32, UidType>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: UidType) => ks.putInt64(v)))) return false; }
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { if (!(ks.putInt64((obj.m_iKeyData ?? 0n)))) return false; }
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { if (!(ks.putInt32((obj.m_iSocketNo ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_SYNTHESIS_ITEM_REQ(ks: KSerializer, flags?: FlagInput): KEGS_SYNTHESIS_ITEM_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_SYNTHESIS_ITEM_REQ(f);
  if (Boolean(f.SERV_SYNTHESIS_AVATAR)) {
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { obj.m_mapSynthesisData = ks.getMap<Int32, UidType>((ks) => ks.getInt32(), (ks) => ks.getInt64()); }
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { obj.m_iKeyData = ks.getInt64(); }
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { obj.m_iSocketNo = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_SYNTHESIS_ITEM_ACK {
  m_iOK?: Int32;
  m_iRessurectionCount?: Int32;
  m_iRestoreSpirit?: Int32;
  m_mapInsertedItem?: Map<Int32, Int32>;
  m_vecKInventorySlotInfo?: KInventoryItemInfo[];
}
export function createKEGS_SYNTHESIS_ITEM_ACK(flags?: FlagInput): KEGS_SYNTHESIS_ITEM_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_SYNTHESIS_ITEM_ACK = {
  };
  if (Boolean(f.SERV_SYNTHESIS_AVATAR)) obj.m_iOK = 0;
  if (Boolean(f.SERV_SYNTHESIS_AVATAR)) obj.m_iRessurectionCount = 0;
  if (Boolean(f.SERV_SYNTHESIS_AVATAR)) obj.m_iRestoreSpirit = 0;
  if (Boolean(f.SERV_SYNTHESIS_AVATAR)) obj.m_mapInsertedItem = new Map<Int32, Int32>();
  if (Boolean(f.SERV_SYNTHESIS_AVATAR)) obj.m_vecKInventorySlotInfo = ([] as KInventoryItemInfo[]);
  return obj;
}
export function putKEGS_SYNTHESIS_ITEM_ACK(ks: KSerializer, obj: KEGS_SYNTHESIS_ITEM_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SYNTHESIS_AVATAR)) {
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { if (!(ks.putInt32((obj.m_iRessurectionCount ?? 0)))) return false; }
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { if (!(ks.putInt32((obj.m_iRestoreSpirit ?? 0)))) return false; }
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { if (!(ks.putMap((obj.m_mapInsertedItem ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { if (!(ks.putVector((obj.m_vecKInventorySlotInfo ?? ([] as KInventoryItemInfo[])), (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false; }
  }
  return true;
}
export function getKEGS_SYNTHESIS_ITEM_ACK(ks: KSerializer, flags?: FlagInput): KEGS_SYNTHESIS_ITEM_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_SYNTHESIS_ITEM_ACK(f);
  if (Boolean(f.SERV_SYNTHESIS_AVATAR)) {
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { obj.m_iRessurectionCount = ks.getInt32(); }
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { obj.m_iRestoreSpirit = ks.getInt32(); }
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { obj.m_mapInsertedItem = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
    if (Boolean(f.SERV_SYNTHESIS_AVATAR)) { obj.m_vecKInventorySlotInfo = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
  }
  return obj;
}

export interface KECH_GET_SERVERGROUP_LIST_NOT {
  m_mapServerGroupList?: Map<Int32, KServerGroupInfo>;
}
export function createKECH_GET_SERVERGROUP_LIST_NOT(flags?: FlagInput): KECH_GET_SERVERGROUP_LIST_NOT {
  const f = resolveFlags(flags);
  const obj: KECH_GET_SERVERGROUP_LIST_NOT = {
  };
  if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) obj.m_mapServerGroupList = new Map<Int32, KServerGroupInfo>();
  return obj;
}
export function putKECH_GET_SERVERGROUP_LIST_NOT(ks: KSerializer, obj: KECH_GET_SERVERGROUP_LIST_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) {
    if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) { if (!(ks.putMap((obj.m_mapServerGroupList ?? new Map<Int32, KServerGroupInfo>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: KServerGroupInfo) => ks.putUserClass(v, putKServerGroupInfo, f)))) return false; }
  }
  return true;
}
export function getKECH_GET_SERVERGROUP_LIST_NOT(ks: KSerializer, flags?: FlagInput): KECH_GET_SERVERGROUP_LIST_NOT {
  const f = resolveFlags(flags);
  const obj = createKECH_GET_SERVERGROUP_LIST_NOT(f);
  if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) {
    if (Boolean(f.SERVER_GROUP_UI_ADVANCED)) { obj.m_mapServerGroupList = ks.getMap<Int32, KServerGroupInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKServerGroupInfo, f)); }
  }
  return obj;
}

export const KEGS_ANTI_ADDICTION_NOT_NOTICE_TYPE = {
  NT_CHAT: 0,
  NT_CENTER: 1,
} as const;
export type KEGS_ANTI_ADDICTION_NOT_NOTICE_TYPE = (typeof KEGS_ANTI_ADDICTION_NOT_NOTICE_TYPE)[keyof typeof KEGS_ANTI_ADDICTION_NOT_NOTICE_TYPE];
export function getKEGS_ANTI_ADDICTION_NOT_NOTICE_TYPE(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) {
    cur = 0;
    out['NT_CHAT'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) {
    cur = 1;
    out['NT_CENTER'] = cur;
    cur += 1;
  }
  return out;
}
export interface KEGS_ANTI_ADDICTION_NOT {
  m_iType?: Int32;
  m_iPlayTime?: Int32;
}
export function createKEGS_ANTI_ADDICTION_NOT(flags?: FlagInput): KEGS_ANTI_ADDICTION_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_ANTI_ADDICTION_NOT = {
  };
  if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) obj.m_iType = 0;
  if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) obj.m_iPlayTime = 0;
  return obj;
}
export function putKEGS_ANTI_ADDICTION_NOT(ks: KSerializer, obj: KEGS_ANTI_ADDICTION_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) {
    if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) { if (!(ks.putInt32((obj.m_iType ?? 0)))) return false; }
    if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) { if (!(ks.putInt32((obj.m_iPlayTime ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_ANTI_ADDICTION_NOT(ks: KSerializer, flags?: FlagInput): KEGS_ANTI_ADDICTION_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_ANTI_ADDICTION_NOT(f);
  if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) {
    if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) { obj.m_iType = ks.getInt32(); }
    if (Boolean(f.SERV_ANTI_ADDICTION_SYSTEM)) { obj.m_iPlayTime = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_EPAY_INFO_NOT {
  m_wstrLoginID?: string;
  m_usZone?: UInt16;
  m_usGame?: UInt16;
  m_wstrCharacterName?: string;
  m_iUnitUID?: UidType;
}
export function createKEGS_EPAY_INFO_NOT(flags?: FlagInput): KEGS_EPAY_INFO_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_EPAY_INFO_NOT = {
  };
  if (Boolean(f.SERV_EPAY_SYSTEM)) obj.m_wstrLoginID = '';
  if (Boolean(f.SERV_EPAY_SYSTEM)) obj.m_usZone = 0;
  if (Boolean(f.SERV_EPAY_SYSTEM)) obj.m_usGame = 0;
  if (Boolean(f.SERV_EPAY_SYSTEM)) obj.m_wstrCharacterName = '';
  if (Boolean(f.SERV_EPAY_SYSTEM)) obj.m_iUnitUID = 0n;
  return obj;
}
export function putKEGS_EPAY_INFO_NOT(ks: KSerializer, obj: KEGS_EPAY_INFO_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EPAY_SYSTEM)) {
    if (Boolean(f.SERV_EPAY_SYSTEM)) { if (!(ks.putWString((obj.m_wstrLoginID ?? '')))) return false; }
    if (Boolean(f.SERV_EPAY_SYSTEM)) { if (!(ks.putUInt16((obj.m_usZone ?? 0)))) return false; }
    if (Boolean(f.SERV_EPAY_SYSTEM)) { if (!(ks.putUInt16((obj.m_usGame ?? 0)))) return false; }
    if (Boolean(f.SERV_EPAY_SYSTEM)) { if (!(ks.putWString((obj.m_wstrCharacterName ?? '')))) return false; }
    if (Boolean(f.SERV_EPAY_SYSTEM)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
  }
  return true;
}
export function getKEGS_EPAY_INFO_NOT(ks: KSerializer, flags?: FlagInput): KEGS_EPAY_INFO_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_EPAY_INFO_NOT(f);
  if (Boolean(f.SERV_EPAY_SYSTEM)) {
    if (Boolean(f.SERV_EPAY_SYSTEM)) { obj.m_wstrLoginID = ks.getWString(); }
    if (Boolean(f.SERV_EPAY_SYSTEM)) { obj.m_usZone = ks.getUInt16(); }
    if (Boolean(f.SERV_EPAY_SYSTEM)) { obj.m_usGame = ks.getUInt16(); }
    if (Boolean(f.SERV_EPAY_SYSTEM)) { obj.m_wstrCharacterName = ks.getWString(); }
    if (Boolean(f.SERV_EPAY_SYSTEM)) { obj.m_iUnitUID = ks.getInt64(); }
  }
  return obj;
}

export interface KEGS_IDENTITY_CONFIRM_POPUP_MESSAGE_NOT {
  m_bCheckAdult?: boolean;
}
export function createKEGS_IDENTITY_CONFIRM_POPUP_MESSAGE_NOT(flags?: FlagInput): KEGS_IDENTITY_CONFIRM_POPUP_MESSAGE_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_IDENTITY_CONFIRM_POPUP_MESSAGE_NOT = {
  };
  if (Boolean(f.SERV_IDENTITY_CONFIRM_POPUP_MESSAGE)) obj.m_bCheckAdult = false;
  return obj;
}
export function putKEGS_IDENTITY_CONFIRM_POPUP_MESSAGE_NOT(ks: KSerializer, obj: KEGS_IDENTITY_CONFIRM_POPUP_MESSAGE_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_IDENTITY_CONFIRM_POPUP_MESSAGE)) {
    if (Boolean(f.SERV_IDENTITY_CONFIRM_POPUP_MESSAGE)) { if (!(ks.putBool((obj.m_bCheckAdult ?? false)))) return false; }
  }
  return true;
}
export function getKEGS_IDENTITY_CONFIRM_POPUP_MESSAGE_NOT(ks: KSerializer, flags?: FlagInput): KEGS_IDENTITY_CONFIRM_POPUP_MESSAGE_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_IDENTITY_CONFIRM_POPUP_MESSAGE_NOT(f);
  if (Boolean(f.SERV_IDENTITY_CONFIRM_POPUP_MESSAGE)) {
    if (Boolean(f.SERV_IDENTITY_CONFIRM_POPUP_MESSAGE)) { obj.m_bCheckAdult = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_XTRAP_REQ {
  m_vecData?: UInt8[];
}
export function createKEGS_XTRAP_REQ(flags?: FlagInput): KEGS_XTRAP_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_XTRAP_REQ = {
  };
  if (Boolean(f.SERV_USE_XTRAP)) obj.m_vecData = ([] as UInt8[]);
  return obj;
}
export function putKEGS_XTRAP_REQ(ks: KSerializer, obj: KEGS_XTRAP_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_USE_XTRAP)) {
    if (Boolean(f.SERV_USE_XTRAP)) { if (!(ks.putVector((obj.m_vecData ?? ([] as UInt8[])), (ks, item: UInt8) => ks.putUInt8(item)))) return false; }
  }
  return true;
}
export function getKEGS_XTRAP_REQ(ks: KSerializer, flags?: FlagInput): KEGS_XTRAP_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_XTRAP_REQ(f);
  if (Boolean(f.SERV_USE_XTRAP)) {
    if (Boolean(f.SERV_USE_XTRAP)) { obj.m_vecData = ks.getVector<UInt8>((ks) => ks.getUInt8()); }
  }
  return obj;
}

export interface KEGS_XTRAP_ACK {
  m_vecData?: UInt8[];
}
export function createKEGS_XTRAP_ACK(flags?: FlagInput): KEGS_XTRAP_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_XTRAP_ACK = {
  };
  if (Boolean(f.SERV_USE_XTRAP)) obj.m_vecData = ([] as UInt8[]);
  return obj;
}
export function putKEGS_XTRAP_ACK(ks: KSerializer, obj: KEGS_XTRAP_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_USE_XTRAP)) {
    if (Boolean(f.SERV_USE_XTRAP)) { if (!(ks.putVector((obj.m_vecData ?? ([] as UInt8[])), (ks, item: UInt8) => ks.putUInt8(item)))) return false; }
  }
  return true;
}
export function getKEGS_XTRAP_ACK(ks: KSerializer, flags?: FlagInput): KEGS_XTRAP_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_XTRAP_ACK(f);
  if (Boolean(f.SERV_USE_XTRAP)) {
    if (Boolean(f.SERV_USE_XTRAP)) { obj.m_vecData = ks.getVector<UInt8>((ks) => ks.getUInt8()); }
  }
  return obj;
}

export interface KEGS_TOGGLE_INVISIBLE_NOT {
  m_iUnitUID?: UidType;
  m_kFieldUserInfo?: KFieldUserInfo;
}
export function createKEGS_TOGGLE_INVISIBLE_NOT(flags?: FlagInput): KEGS_TOGGLE_INVISIBLE_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_TOGGLE_INVISIBLE_NOT = {
  };
  if (Boolean(f.SERV_INVISIBLE_GM)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_INVISIBLE_GM)) obj.m_kFieldUserInfo = createKFieldUserInfo(f);
  return obj;
}
export function putKEGS_TOGGLE_INVISIBLE_NOT(ks: KSerializer, obj: KEGS_TOGGLE_INVISIBLE_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_INVISIBLE_GM)) {
    if (Boolean(f.SERV_INVISIBLE_GM)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_INVISIBLE_GM)) { if (!(ks.putUserClass((obj.m_kFieldUserInfo ?? createKFieldUserInfo(f)), putKFieldUserInfo, f))) return false; }
  }
  return true;
}
export function getKEGS_TOGGLE_INVISIBLE_NOT(ks: KSerializer, flags?: FlagInput): KEGS_TOGGLE_INVISIBLE_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_TOGGLE_INVISIBLE_NOT(f);
  if (Boolean(f.SERV_INVISIBLE_GM)) {
    if (Boolean(f.SERV_INVISIBLE_GM)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_INVISIBLE_GM)) { obj.m_kFieldUserInfo = ks.getUserClass(getKFieldUserInfo, f); }
  }
  return obj;
}

export interface KEGS_GET_SHARE_BANK_REQ_Struct {
  m_wstrNickName?: string;
  m_iNewUnitTradeBlockDay?: Int32;
  m_iNewUnitTradeBlockUnitClass?: Int32;
}
export function createKEGS_GET_SHARE_BANK_REQ_Struct(flags?: FlagInput): KEGS_GET_SHARE_BANK_REQ_Struct {
  const f = resolveFlags(flags);
  const obj: KEGS_GET_SHARE_BANK_REQ_Struct = {
  };
  if (f.SERV_SHARING_BANK_TEST && f.SERV_NEW_UNIT_TRADE_LIMIT) obj.m_wstrNickName = '';
  if (f.SERV_SHARING_BANK_TEST && f.SERV_NEW_UNIT_TRADE_LIMIT) obj.m_iNewUnitTradeBlockDay = 0;
  if (f.SERV_SHARING_BANK_TEST && f.SERV_NEW_UNIT_TRADE_LIMIT) obj.m_iNewUnitTradeBlockUnitClass = 0;
  return obj;
}
export function putKEGS_GET_SHARE_BANK_REQ_Struct(ks: KSerializer, obj: KEGS_GET_SHARE_BANK_REQ_Struct, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (f.SERV_SHARING_BANK_TEST && f.SERV_NEW_UNIT_TRADE_LIMIT) {
    if (f.SERV_SHARING_BANK_TEST && f.SERV_NEW_UNIT_TRADE_LIMIT) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
    if (f.SERV_SHARING_BANK_TEST && f.SERV_NEW_UNIT_TRADE_LIMIT) { if (!(ks.putInt32((obj.m_iNewUnitTradeBlockDay ?? 0)))) return false; }
    if (f.SERV_SHARING_BANK_TEST && f.SERV_NEW_UNIT_TRADE_LIMIT) { if (!(ks.putInt32((obj.m_iNewUnitTradeBlockUnitClass ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_GET_SHARE_BANK_REQ_Struct(ks: KSerializer, flags?: FlagInput): KEGS_GET_SHARE_BANK_REQ_Struct {
  const f = resolveFlags(flags);
  const obj = createKEGS_GET_SHARE_BANK_REQ_Struct(f);
  if (f.SERV_SHARING_BANK_TEST && f.SERV_NEW_UNIT_TRADE_LIMIT) {
    if (f.SERV_SHARING_BANK_TEST && f.SERV_NEW_UNIT_TRADE_LIMIT) { obj.m_wstrNickName = ks.getWString(); }
    if (f.SERV_SHARING_BANK_TEST && f.SERV_NEW_UNIT_TRADE_LIMIT) { obj.m_iNewUnitTradeBlockDay = ks.getInt32(); }
    if (f.SERV_SHARING_BANK_TEST && f.SERV_NEW_UNIT_TRADE_LIMIT) { obj.m_iNewUnitTradeBlockUnitClass = ks.getInt32(); }
  }
  return obj;
}

export type KEGS_GET_SHARE_BANK_REQ = KEGS_GET_SHARE_BANK_REQ_Struct | string;
export function createKEGS_GET_SHARE_BANK_REQ(flags?: FlagInput): KEGS_GET_SHARE_BANK_REQ {
  const f = resolveFlags(flags);
  if (f.SERV_SHARING_BANK_TEST && !f.SERV_NEW_UNIT_TRADE_LIMIT) return '';
  return createKEGS_GET_SHARE_BANK_REQ_Struct(f);
}
export function putKEGS_GET_SHARE_BANK_REQ(ks: KSerializer, obj: KEGS_GET_SHARE_BANK_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (f.SERV_SHARING_BANK_TEST && !f.SERV_NEW_UNIT_TRADE_LIMIT) return ks.putWString((obj as string));
  return putKEGS_GET_SHARE_BANK_REQ_Struct(ks, obj as KEGS_GET_SHARE_BANK_REQ_Struct, f);
}
export function getKEGS_GET_SHARE_BANK_REQ(ks: KSerializer, flags?: FlagInput): KEGS_GET_SHARE_BANK_REQ {
  const f = resolveFlags(flags);
  if (f.SERV_SHARING_BANK_TEST && !f.SERV_NEW_UNIT_TRADE_LIMIT) return ks.getWString();
  return getKEGS_GET_SHARE_BANK_REQ_Struct(ks, f);
}

export interface KEGS_GET_SHARE_BANK_ACK {
  m_iOK?: Int32;
  m_iUnitUID?: UidType;
  m_wstrNickName?: string;
  m_iBankSize?: Int32;
  m_mapItem?: Map<UidType, KInventoryItemInfo>;
}
export function createKEGS_GET_SHARE_BANK_ACK(flags?: FlagInput): KEGS_GET_SHARE_BANK_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_GET_SHARE_BANK_ACK = {
  };
  if (Boolean(f.SERV_SHARING_BANK_TEST)) obj.m_iOK = 0;
  if (Boolean(f.SERV_SHARING_BANK_TEST)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_SHARING_BANK_TEST)) obj.m_wstrNickName = '';
  if (Boolean(f.SERV_SHARING_BANK_TEST)) obj.m_iBankSize = 0;
  if (Boolean(f.SERV_SHARING_BANK_TEST)) obj.m_mapItem = new Map<UidType, KInventoryItemInfo>();
  return obj;
}
export function putKEGS_GET_SHARE_BANK_ACK(ks: KSerializer, obj: KEGS_GET_SHARE_BANK_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SHARING_BANK_TEST)) {
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { if (!(ks.putInt32((obj.m_iBankSize ?? 0)))) return false; }
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { if (!(ks.putMap((obj.m_mapItem ?? new Map<UidType, KInventoryItemInfo>()), (ks, k: UidType) => ks.putInt64(k), (ks, v: KInventoryItemInfo) => ks.putUserClass(v, putKInventoryItemInfo, f)))) return false; }
  }
  return true;
}
export function getKEGS_GET_SHARE_BANK_ACK(ks: KSerializer, flags?: FlagInput): KEGS_GET_SHARE_BANK_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_GET_SHARE_BANK_ACK(f);
  if (Boolean(f.SERV_SHARING_BANK_TEST)) {
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { obj.m_wstrNickName = ks.getWString(); }
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { obj.m_iBankSize = ks.getInt32(); }
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { obj.m_mapItem = ks.getMap<UidType, KInventoryItemInfo>((ks) => ks.getInt64(), (ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
  }
  return obj;
}

export interface KEGS_UPDATE_ITEM_POSITION_NOT {
  m_vecShareItemResult?: KTradeShareItemResult[];
}
export function createKEGS_UPDATE_ITEM_POSITION_NOT(flags?: FlagInput): KEGS_UPDATE_ITEM_POSITION_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_UPDATE_ITEM_POSITION_NOT = {
  };
  if (Boolean(f.SERV_SHARING_BANK_TEST)) obj.m_vecShareItemResult = ([] as KTradeShareItemResult[]);
  return obj;
}
export function putKEGS_UPDATE_ITEM_POSITION_NOT(ks: KSerializer, obj: KEGS_UPDATE_ITEM_POSITION_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SHARING_BANK_TEST)) {
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { if (!(ks.putVector((obj.m_vecShareItemResult ?? ([] as KTradeShareItemResult[])), (ks, item: KTradeShareItemResult) => ks.putUserClass(item, putKTradeShareItemResult, f)))) return false; }
  }
  return true;
}
export function getKEGS_UPDATE_ITEM_POSITION_NOT(ks: KSerializer, flags?: FlagInput): KEGS_UPDATE_ITEM_POSITION_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_UPDATE_ITEM_POSITION_NOT(f);
  if (Boolean(f.SERV_SHARING_BANK_TEST)) {
    if (Boolean(f.SERV_SHARING_BANK_TEST)) { obj.m_vecShareItemResult = ks.getVector<KTradeShareItemResult>((ks) => ks.getUserClass(getKTradeShareItemResult, f)); }
  }
  return obj;
}

export interface KEGS_SHARING_BACK_OPEN_NOT {
  m_iOK?: Int32;
  m_iOpenType?: Int32;
}
export function createKEGS_SHARING_BACK_OPEN_NOT(flags?: FlagInput): KEGS_SHARING_BACK_OPEN_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_SHARING_BACK_OPEN_NOT = {
  };
  if (Boolean(f.SERV_SHARING_BANK_QUEST_CASH)) obj.m_iOK = 0;
  if (Boolean(f.SERV_SHARING_BANK_QUEST_CASH)) obj.m_iOpenType = 0;
  return obj;
}
export function putKEGS_SHARING_BACK_OPEN_NOT(ks: KSerializer, obj: KEGS_SHARING_BACK_OPEN_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SHARING_BANK_QUEST_CASH)) {
    if (Boolean(f.SERV_SHARING_BANK_QUEST_CASH)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_SHARING_BANK_QUEST_CASH)) { if (!(ks.putInt32((obj.m_iOpenType ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_SHARING_BACK_OPEN_NOT(ks: KSerializer, flags?: FlagInput): KEGS_SHARING_BACK_OPEN_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_SHARING_BACK_OPEN_NOT(f);
  if (Boolean(f.SERV_SHARING_BANK_QUEST_CASH)) {
    if (Boolean(f.SERV_SHARING_BANK_QUEST_CASH)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_SHARING_BANK_QUEST_CASH)) { obj.m_iOpenType = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_GET_ADVERTISEMENT_EVENT_ACK {
  m_vecAdvertisementURL?: string[];
}
export function createKEGS_GET_ADVERTISEMENT_EVENT_ACK(flags?: FlagInput): KEGS_GET_ADVERTISEMENT_EVENT_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_GET_ADVERTISEMENT_EVENT_ACK = {
  };
  if (Boolean(f.SERV_ADVERTISEMENT_EVENT)) obj.m_vecAdvertisementURL = ([] as string[]);
  return obj;
}
export function putKEGS_GET_ADVERTISEMENT_EVENT_ACK(ks: KSerializer, obj: KEGS_GET_ADVERTISEMENT_EVENT_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ADVERTISEMENT_EVENT)) {
    if (Boolean(f.SERV_ADVERTISEMENT_EVENT)) { if (!(ks.putVector((obj.m_vecAdvertisementURL ?? ([] as string[])), (ks, item: string) => ks.putWString(item)))) return false; }
  }
  return true;
}
export function getKEGS_GET_ADVERTISEMENT_EVENT_ACK(ks: KSerializer, flags?: FlagInput): KEGS_GET_ADVERTISEMENT_EVENT_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_GET_ADVERTISEMENT_EVENT_ACK(f);
  if (Boolean(f.SERV_ADVERTISEMENT_EVENT)) {
    if (Boolean(f.SERV_ADVERTISEMENT_EVENT)) { obj.m_vecAdvertisementURL = ks.getVector<string>((ks) => ks.getWString()); }
  }
  return obj;
}

export interface KEGS_WARP_BY_BUTTON_REQ {
  m_iCurrentVillageWarpIndex?: Int32;
  m_bFreeWarp?: boolean;
}
export function createKEGS_WARP_BY_BUTTON_REQ(flags?: FlagInput): KEGS_WARP_BY_BUTTON_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_WARP_BY_BUTTON_REQ = {
  };
  if (Boolean(f.SERV_ADD_WARP_BUTTON)) obj.m_iCurrentVillageWarpIndex = 0;
  if (Boolean(f.SERV_ADD_WARP_BUTTON)) obj.m_bFreeWarp = false;
  return obj;
}
export function putKEGS_WARP_BY_BUTTON_REQ(ks: KSerializer, obj: KEGS_WARP_BY_BUTTON_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ADD_WARP_BUTTON)) {
    if (Boolean(f.SERV_ADD_WARP_BUTTON)) { if (!(ks.putInt32((obj.m_iCurrentVillageWarpIndex ?? 0)))) return false; }
    if (Boolean(f.SERV_ADD_WARP_BUTTON)) { if (!(ks.putBool((obj.m_bFreeWarp ?? false)))) return false; }
  }
  return true;
}
export function getKEGS_WARP_BY_BUTTON_REQ(ks: KSerializer, flags?: FlagInput): KEGS_WARP_BY_BUTTON_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_WARP_BY_BUTTON_REQ(f);
  if (Boolean(f.SERV_ADD_WARP_BUTTON)) {
    if (Boolean(f.SERV_ADD_WARP_BUTTON)) { obj.m_iCurrentVillageWarpIndex = ks.getInt32(); }
    if (Boolean(f.SERV_ADD_WARP_BUTTON)) { obj.m_bFreeWarp = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_WARP_BY_BUTTON_ACK {
  m_iOK?: Int32;
  m_iED?: Int32;
  m_iWarpPointMapID?: Int32;
}
export function createKEGS_WARP_BY_BUTTON_ACK(flags?: FlagInput): KEGS_WARP_BY_BUTTON_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_WARP_BY_BUTTON_ACK = {
  };
  if (Boolean(f.SERV_ADD_WARP_BUTTON)) obj.m_iOK = 0;
  if (Boolean(f.SERV_ADD_WARP_BUTTON)) obj.m_iED = 0;
  if (Boolean(f.SERV_ADD_WARP_BUTTON)) obj.m_iWarpPointMapID = 0;
  return obj;
}
export function putKEGS_WARP_BY_BUTTON_ACK(ks: KSerializer, obj: KEGS_WARP_BY_BUTTON_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ADD_WARP_BUTTON)) {
    if (Boolean(f.SERV_ADD_WARP_BUTTON)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_ADD_WARP_BUTTON)) { if (!(ks.putInt32((obj.m_iED ?? 0)))) return false; }
    if (Boolean(f.SERV_ADD_WARP_BUTTON)) { if (!(ks.putInt32((obj.m_iWarpPointMapID ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_WARP_BY_BUTTON_ACK(ks: KSerializer, flags?: FlagInput): KEGS_WARP_BY_BUTTON_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_WARP_BY_BUTTON_ACK(f);
  if (Boolean(f.SERV_ADD_WARP_BUTTON)) {
    if (Boolean(f.SERV_ADD_WARP_BUTTON)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_ADD_WARP_BUTTON)) { obj.m_iED = ks.getInt32(); }
    if (Boolean(f.SERV_ADD_WARP_BUTTON)) { obj.m_iWarpPointMapID = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_UPDATE_MAX_LEVEL_NOT {
  m_iMaxLevel?: Int32;
}
export function createKEGS_UPDATE_MAX_LEVEL_NOT(flags?: FlagInput): KEGS_UPDATE_MAX_LEVEL_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_UPDATE_MAX_LEVEL_NOT = {
  };
  if (Boolean(f.SERV_NEW_EVENT_TYPES)) obj.m_iMaxLevel = 0;
  return obj;
}
export function putKEGS_UPDATE_MAX_LEVEL_NOT(ks: KSerializer, obj: KEGS_UPDATE_MAX_LEVEL_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEW_EVENT_TYPES)) {
    if (Boolean(f.SERV_NEW_EVENT_TYPES)) { if (!(ks.putInt32((obj.m_iMaxLevel ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_UPDATE_MAX_LEVEL_NOT(ks: KSerializer, flags?: FlagInput): KEGS_UPDATE_MAX_LEVEL_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_UPDATE_MAX_LEVEL_NOT(f);
  if (Boolean(f.SERV_NEW_EVENT_TYPES)) {
    if (Boolean(f.SERV_NEW_EVENT_TYPES)) { obj.m_iMaxLevel = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_UPDATE_DUNGEON_STATUS_NOT {
  m_mapEnableDungeon?: Map<Int32, boolean>;
}
export function createKEGS_UPDATE_DUNGEON_STATUS_NOT(flags?: FlagInput): KEGS_UPDATE_DUNGEON_STATUS_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_UPDATE_DUNGEON_STATUS_NOT = {
  };
  if (Boolean(f.SERV_NEW_EVENT_TYPES)) obj.m_mapEnableDungeon = new Map<Int32, boolean>();
  return obj;
}
export function putKEGS_UPDATE_DUNGEON_STATUS_NOT(ks: KSerializer, obj: KEGS_UPDATE_DUNGEON_STATUS_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEW_EVENT_TYPES)) {
    if (Boolean(f.SERV_NEW_EVENT_TYPES)) { if (!(ks.putMap((obj.m_mapEnableDungeon ?? new Map<Int32, boolean>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: boolean) => ks.putBool(v)))) return false; }
  }
  return true;
}
export function getKEGS_UPDATE_DUNGEON_STATUS_NOT(ks: KSerializer, flags?: FlagInput): KEGS_UPDATE_DUNGEON_STATUS_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_UPDATE_DUNGEON_STATUS_NOT(f);
  if (Boolean(f.SERV_NEW_EVENT_TYPES)) {
    if (Boolean(f.SERV_NEW_EVENT_TYPES)) { obj.m_mapEnableDungeon = ks.getMap<Int32, boolean>((ks) => ks.getInt32(), (ks) => ks.getBool()); }
  }
  return obj;
}

export interface KEGS_UPDATE_CODE_EVENT_NOT {
  m_mapEnableCodeEnum?: Map<Int32, boolean>;
}
export function createKEGS_UPDATE_CODE_EVENT_NOT(flags?: FlagInput): KEGS_UPDATE_CODE_EVENT_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_UPDATE_CODE_EVENT_NOT = {
  };
  if (Boolean(f.SERV_CODE_EVENT)) obj.m_mapEnableCodeEnum = new Map<Int32, boolean>();
  return obj;
}
export function putKEGS_UPDATE_CODE_EVENT_NOT(ks: KSerializer, obj: KEGS_UPDATE_CODE_EVENT_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CODE_EVENT)) {
    if (Boolean(f.SERV_CODE_EVENT)) { if (!(ks.putMap((obj.m_mapEnableCodeEnum ?? new Map<Int32, boolean>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: boolean) => ks.putBool(v)))) return false; }
  }
  return true;
}
export function getKEGS_UPDATE_CODE_EVENT_NOT(ks: KSerializer, flags?: FlagInput): KEGS_UPDATE_CODE_EVENT_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_UPDATE_CODE_EVENT_NOT(f);
  if (Boolean(f.SERV_CODE_EVENT)) {
    if (Boolean(f.SERV_CODE_EVENT)) { obj.m_mapEnableCodeEnum = ks.getMap<Int32, boolean>((ks) => ks.getInt32(), (ks) => ks.getBool()); }
  }
  return obj;
}

export interface KEGS_UPDATE_WARP_VIP_NOT {
  m_iOK?: Int32;
  m_trWarpVipEndDate?: Int64;
}
export function createKEGS_UPDATE_WARP_VIP_NOT(flags?: FlagInput): KEGS_UPDATE_WARP_VIP_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_UPDATE_WARP_VIP_NOT = {
  };
  if (Boolean(f.SERV_ADD_WARP_BUTTON)) obj.m_iOK = 0;
  if (Boolean(f.SERV_ADD_WARP_BUTTON)) obj.m_trWarpVipEndDate = 0n;
  return obj;
}
export function putKEGS_UPDATE_WARP_VIP_NOT(ks: KSerializer, obj: KEGS_UPDATE_WARP_VIP_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ADD_WARP_BUTTON)) {
    if (Boolean(f.SERV_ADD_WARP_BUTTON)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_ADD_WARP_BUTTON)) { if (!(ks.putInt64((obj.m_trWarpVipEndDate ?? 0n)))) return false; }
  }
  return true;
}
export function getKEGS_UPDATE_WARP_VIP_NOT(ks: KSerializer, flags?: FlagInput): KEGS_UPDATE_WARP_VIP_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_UPDATE_WARP_VIP_NOT(f);
  if (Boolean(f.SERV_ADD_WARP_BUTTON)) {
    if (Boolean(f.SERV_ADD_WARP_BUTTON)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_ADD_WARP_BUTTON)) { obj.m_trWarpVipEndDate = ks.getInt64(); }
  }
  return obj;
}

export interface KEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_REQ {
  m_bCheckClinetDirectPcBang?: boolean;
  m_iIsGameBangType?: Int32;
  m_wstrPublicIP?: string;
  m_wstrMacAdress?: string;
}
export function createKEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_REQ(flags?: FlagInput): KEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_REQ = {
  };
  if (Boolean(f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG)) obj.m_bCheckClinetDirectPcBang = false;
  if (Boolean(f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG)) obj.m_iIsGameBangType = 0;
  if (f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG && f.SERV_ID_NETMARBLE_PCBANG) obj.m_wstrPublicIP = '';
  if (f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG && f.SERV_ID_NETMARBLE_PCBANG) obj.m_wstrMacAdress = '';
  return obj;
}
export function putKEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_REQ(ks: KSerializer, obj: KEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG)) {
    if (Boolean(f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG)) { if (!(ks.putBool((obj.m_bCheckClinetDirectPcBang ?? false)))) return false; }
    if (Boolean(f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG)) { if (!(ks.putInt32((obj.m_iIsGameBangType ?? 0)))) return false; }
    if (f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG && f.SERV_ID_NETMARBLE_PCBANG) { if (!(ks.putWString((obj.m_wstrPublicIP ?? '')))) return false; }
    if (f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG && f.SERV_ID_NETMARBLE_PCBANG) { if (!(ks.putWString((obj.m_wstrMacAdress ?? '')))) return false; }
  }
  return true;
}
export function getKEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_REQ(ks: KSerializer, flags?: FlagInput): KEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_REQ(f);
  if (Boolean(f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG)) {
    if (Boolean(f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG)) { obj.m_bCheckClinetDirectPcBang = ks.getBool(); }
    if (Boolean(f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG)) { obj.m_iIsGameBangType = ks.getInt32(); }
    if (f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG && f.SERV_ID_NETMARBLE_PCBANG) { obj.m_wstrPublicIP = ks.getWString(); }
    if (f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG && f.SERV_ID_NETMARBLE_PCBANG) { obj.m_wstrMacAdress = ks.getWString(); }
  }
  return obj;
}

export interface KEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_ACK {
  m_bCheckClinetDirectPcBang?: boolean;
  m_iIsGameBangType?: Int32;
  m_kPcBangReward?: KPcBangReward;
}
export function createKEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_ACK(flags?: FlagInput): KEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_ACK = {
  };
  if (Boolean(f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG)) obj.m_bCheckClinetDirectPcBang = false;
  if (Boolean(f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG)) obj.m_iIsGameBangType = 0;
  if (f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG && f.SERV_PC_BANG_TYPE) obj.m_kPcBangReward = createKPcBangReward(f);
  return obj;
}
export function putKEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_ACK(ks: KSerializer, obj: KEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG)) {
    if (Boolean(f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG)) { if (!(ks.putBool((obj.m_bCheckClinetDirectPcBang ?? false)))) return false; }
    if (Boolean(f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG)) { if (!(ks.putInt32((obj.m_iIsGameBangType ?? 0)))) return false; }
    if (f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG && f.SERV_PC_BANG_TYPE) { if (!(ks.putUserClass((obj.m_kPcBangReward ?? createKPcBangReward(f)), putKPcBangReward, f))) return false; }
  }
  return true;
}
export function getKEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_ACK(ks: KSerializer, flags?: FlagInput): KEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_CLIENT_DIRECT_CONNECT_AUTH_PCBAG_ACK(f);
  if (Boolean(f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG)) {
    if (Boolean(f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG)) { obj.m_bCheckClinetDirectPcBang = ks.getBool(); }
    if (Boolean(f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG)) { obj.m_iIsGameBangType = ks.getInt32(); }
    if (f.SERV_CLIENT_DIRECT_CONNECT_AUTH_PCBANG && f.SERV_PC_BANG_TYPE) { obj.m_kPcBangReward = ks.getUserClass(getKPcBangReward, f); }
  }
  return obj;
}

export interface KEGS_OPEN_RANDOM_ITEM_DEVELOPER_REQ {
  m_iItemID?: Int32;
  m_iItemKeyID?: Int32;
  m_iOpenCount?: Int32;
}
export function createKEGS_OPEN_RANDOM_ITEM_DEVELOPER_REQ(flags?: FlagInput): KEGS_OPEN_RANDOM_ITEM_DEVELOPER_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_OPEN_RANDOM_ITEM_DEVELOPER_REQ = {
  };
  if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) obj.m_iItemID = 0;
  if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) obj.m_iItemKeyID = 0;
  if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) obj.m_iOpenCount = 0;
  return obj;
}
export function putKEGS_OPEN_RANDOM_ITEM_DEVELOPER_REQ(ks: KSerializer, obj: KEGS_OPEN_RANDOM_ITEM_DEVELOPER_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) {
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { if (!(ks.putInt32((obj.m_iItemID ?? 0)))) return false; }
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { if (!(ks.putInt32((obj.m_iItemKeyID ?? 0)))) return false; }
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { if (!(ks.putInt32((obj.m_iOpenCount ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_OPEN_RANDOM_ITEM_DEVELOPER_REQ(ks: KSerializer, flags?: FlagInput): KEGS_OPEN_RANDOM_ITEM_DEVELOPER_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_OPEN_RANDOM_ITEM_DEVELOPER_REQ(f);
  if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) {
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { obj.m_iItemID = ks.getInt32(); }
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { obj.m_iItemKeyID = ks.getInt32(); }
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { obj.m_iOpenCount = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_OPEN_RANDOM_ITEM_DEVELOPER_ACK {
  m_iOK?: Int32;
  m_map_RandomItemResult?: Map<Int32, KRandomItemResult>;
}
export function createKEGS_OPEN_RANDOM_ITEM_DEVELOPER_ACK(flags?: FlagInput): KEGS_OPEN_RANDOM_ITEM_DEVELOPER_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_OPEN_RANDOM_ITEM_DEVELOPER_ACK = {
  };
  if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) obj.m_iOK = 0;
  if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) obj.m_map_RandomItemResult = new Map<Int32, KRandomItemResult>();
  return obj;
}
export function putKEGS_OPEN_RANDOM_ITEM_DEVELOPER_ACK(ks: KSerializer, obj: KEGS_OPEN_RANDOM_ITEM_DEVELOPER_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) {
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { if (!(ks.putMap((obj.m_map_RandomItemResult ?? new Map<Int32, KRandomItemResult>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: KRandomItemResult) => ks.putUserClass(v, putKRandomItemResult, f)))) return false; }
  }
  return true;
}
export function getKEGS_OPEN_RANDOM_ITEM_DEVELOPER_ACK(ks: KSerializer, flags?: FlagInput): KEGS_OPEN_RANDOM_ITEM_DEVELOPER_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_OPEN_RANDOM_ITEM_DEVELOPER_ACK(f);
  if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) {
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_DEVELOPER_RANDOM_OPEN_ITEM_LOG)) { obj.m_map_RandomItemResult = ks.getMap<Int32, KRandomItemResult>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKRandomItemResult, f)); }
  }
  return obj;
}

export interface KEGS_EVENT_QUEST_CHECK_FOR_ADMIN_NOT {
  m_vecWarningQuestID?: Int32[];
}
export function createKEGS_EVENT_QUEST_CHECK_FOR_ADMIN_NOT(flags?: FlagInput): KEGS_EVENT_QUEST_CHECK_FOR_ADMIN_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_EVENT_QUEST_CHECK_FOR_ADMIN_NOT = {
  };
  if (Boolean(f.SERV_CHECK_TIME_QUEST)) obj.m_vecWarningQuestID = ([] as Int32[]);
  return obj;
}
export function putKEGS_EVENT_QUEST_CHECK_FOR_ADMIN_NOT(ks: KSerializer, obj: KEGS_EVENT_QUEST_CHECK_FOR_ADMIN_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CHECK_TIME_QUEST)) {
    if (Boolean(f.SERV_CHECK_TIME_QUEST)) { if (!(ks.putVector((obj.m_vecWarningQuestID ?? ([] as Int32[])), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  }
  return true;
}
export function getKEGS_EVENT_QUEST_CHECK_FOR_ADMIN_NOT(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_QUEST_CHECK_FOR_ADMIN_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_EVENT_QUEST_CHECK_FOR_ADMIN_NOT(f);
  if (Boolean(f.SERV_CHECK_TIME_QUEST)) {
    if (Boolean(f.SERV_CHECK_TIME_QUEST)) { obj.m_vecWarningQuestID = ks.getVector<Int32>((ks) => ks.getInt32()); }
  }
  return obj;
}

export interface KEGS_MOMOTI_QUIZ_EVENT_REQ {
  m_iOK?: Int32;
  m_istrReply?: Int32;
}
export function createKEGS_MOMOTI_QUIZ_EVENT_REQ(flags?: FlagInput): KEGS_MOMOTI_QUIZ_EVENT_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_MOMOTI_QUIZ_EVENT_REQ = {
  };
  if (Boolean(f.SERV_MOMOTI_EVENT)) obj.m_iOK = 0;
  if (Boolean(f.SERV_MOMOTI_EVENT)) obj.m_istrReply = 0;
  return obj;
}
export function putKEGS_MOMOTI_QUIZ_EVENT_REQ(ks: KSerializer, obj: KEGS_MOMOTI_QUIZ_EVENT_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_MOMOTI_EVENT)) {
    if (Boolean(f.SERV_MOMOTI_EVENT)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_MOMOTI_EVENT)) { if (!(ks.putInt32((obj.m_istrReply ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_MOMOTI_QUIZ_EVENT_REQ(ks: KSerializer, flags?: FlagInput): KEGS_MOMOTI_QUIZ_EVENT_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_MOMOTI_QUIZ_EVENT_REQ(f);
  if (Boolean(f.SERV_MOMOTI_EVENT)) {
    if (Boolean(f.SERV_MOMOTI_EVENT)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_MOMOTI_EVENT)) { obj.m_istrReply = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_MOMOTI_QUIZ_EVENT_ACK {
  m_iOK?: Int32;
  m_iCheckReward?: Int32;
}
export function createKEGS_MOMOTI_QUIZ_EVENT_ACK(flags?: FlagInput): KEGS_MOMOTI_QUIZ_EVENT_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_MOMOTI_QUIZ_EVENT_ACK = {
  };
  if (Boolean(f.SERV_MOMOTI_EVENT)) obj.m_iOK = 0;
  if (Boolean(f.SERV_MOMOTI_EVENT)) obj.m_iCheckReward = 0;
  return obj;
}
export function putKEGS_MOMOTI_QUIZ_EVENT_ACK(ks: KSerializer, obj: KEGS_MOMOTI_QUIZ_EVENT_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_MOMOTI_EVENT)) {
    if (Boolean(f.SERV_MOMOTI_EVENT)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_MOMOTI_EVENT)) { if (!(ks.putInt32((obj.m_iCheckReward ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_MOMOTI_QUIZ_EVENT_ACK(ks: KSerializer, flags?: FlagInput): KEGS_MOMOTI_QUIZ_EVENT_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_MOMOTI_QUIZ_EVENT_ACK(f);
  if (Boolean(f.SERV_MOMOTI_EVENT)) {
    if (Boolean(f.SERV_MOMOTI_EVENT)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_MOMOTI_EVENT)) { obj.m_iCheckReward = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_CLIENT_POPRT_CHANGE_REQUEST_INFO_NOT {
  m_iUDPPortSuccessType?: Int32;
  m_iUseUdpPort?: Int32;
}
export function createKEGS_CLIENT_POPRT_CHANGE_REQUEST_INFO_NOT(flags?: FlagInput): KEGS_CLIENT_POPRT_CHANGE_REQUEST_INFO_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_CLIENT_POPRT_CHANGE_REQUEST_INFO_NOT = {
  };
  if (Boolean(f.SERV_CLIENT_PORT_CHANGE_REQUEST_LOG)) obj.m_iUDPPortSuccessType = 0;
  if (Boolean(f.SERV_CLIENT_PORT_CHANGE_REQUEST_LOG)) obj.m_iUseUdpPort = 0;
  return obj;
}
export function putKEGS_CLIENT_POPRT_CHANGE_REQUEST_INFO_NOT(ks: KSerializer, obj: KEGS_CLIENT_POPRT_CHANGE_REQUEST_INFO_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CLIENT_PORT_CHANGE_REQUEST_LOG)) {
    if (Boolean(f.SERV_CLIENT_PORT_CHANGE_REQUEST_LOG)) { if (!(ks.putInt32((obj.m_iUDPPortSuccessType ?? 0)))) return false; }
    if (Boolean(f.SERV_CLIENT_PORT_CHANGE_REQUEST_LOG)) { if (!(ks.putInt32((obj.m_iUseUdpPort ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_CLIENT_POPRT_CHANGE_REQUEST_INFO_NOT(ks: KSerializer, flags?: FlagInput): KEGS_CLIENT_POPRT_CHANGE_REQUEST_INFO_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_CLIENT_POPRT_CHANGE_REQUEST_INFO_NOT(f);
  if (Boolean(f.SERV_CLIENT_PORT_CHANGE_REQUEST_LOG)) {
    if (Boolean(f.SERV_CLIENT_PORT_CHANGE_REQUEST_LOG)) { obj.m_iUDPPortSuccessType = ks.getInt32(); }
    if (Boolean(f.SERV_CLIENT_PORT_CHANGE_REQUEST_LOG)) { obj.m_iUseUdpPort = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_SKILL_USE_REQ {
  m_iSkillID?: Int32;
}
export function createKEGS_SKILL_USE_REQ(flags?: FlagInput): KEGS_SKILL_USE_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_SKILL_USE_REQ = {
  };
  if (Boolean(f.SERV_SKILL_USE_SUBQUEST)) obj.m_iSkillID = -1;
  return obj;
}
export function putKEGS_SKILL_USE_REQ(ks: KSerializer, obj: KEGS_SKILL_USE_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SKILL_USE_SUBQUEST)) {
    if (Boolean(f.SERV_SKILL_USE_SUBQUEST)) { if (!(ks.putInt32((obj.m_iSkillID ?? -1)))) return false; }
  }
  return true;
}
export function getKEGS_SKILL_USE_REQ(ks: KSerializer, flags?: FlagInput): KEGS_SKILL_USE_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_SKILL_USE_REQ(f);
  if (Boolean(f.SERV_SKILL_USE_SUBQUEST)) {
    if (Boolean(f.SERV_SKILL_USE_SUBQUEST)) { obj.m_iSkillID = ks.getInt32(); }
  }
  return obj;
}

export interface KECH_GET_SERVER_TIME_ACK {
  m_wstrCurrentTime?: string;
}
export function createKECH_GET_SERVER_TIME_ACK(flags?: FlagInput): KECH_GET_SERVER_TIME_ACK {
  const f = resolveFlags(flags);
  const obj: KECH_GET_SERVER_TIME_ACK = {
  };
  if (Boolean(f.SERV_SERVER_TIME_GET)) obj.m_wstrCurrentTime = '';
  return obj;
}
export function putKECH_GET_SERVER_TIME_ACK(ks: KSerializer, obj: KECH_GET_SERVER_TIME_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SERVER_TIME_GET)) {
    if (Boolean(f.SERV_SERVER_TIME_GET)) { if (!(ks.putWString((obj.m_wstrCurrentTime ?? '')))) return false; }
  }
  return true;
}
export function getKECH_GET_SERVER_TIME_ACK(ks: KSerializer, flags?: FlagInput): KECH_GET_SERVER_TIME_ACK {
  const f = resolveFlags(flags);
  const obj = createKECH_GET_SERVER_TIME_ACK(f);
  if (Boolean(f.SERV_SERVER_TIME_GET)) {
    if (Boolean(f.SERV_SERVER_TIME_GET)) { obj.m_wstrCurrentTime = ks.getWString(); }
  }
  return obj;
}

export interface KEGS_QUEST_POINT_COUNT_SYSTEM_NOT {
  m_mapQuestInstance?: Map<Int32, KQuestInstance>;
}
export function createKEGS_QUEST_POINT_COUNT_SYSTEM_NOT(flags?: FlagInput): KEGS_QUEST_POINT_COUNT_SYSTEM_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_QUEST_POINT_COUNT_SYSTEM_NOT = {
  };
  if (Boolean(f.SERV_POINT_COUNT_SYSTEM)) obj.m_mapQuestInstance = new Map<Int32, KQuestInstance>();
  return obj;
}
export function putKEGS_QUEST_POINT_COUNT_SYSTEM_NOT(ks: KSerializer, obj: KEGS_QUEST_POINT_COUNT_SYSTEM_NOT, flags?: FlagInput): boolean {
  return true;
}
export function getKEGS_QUEST_POINT_COUNT_SYSTEM_NOT(ks: KSerializer, flags?: FlagInput): KEGS_QUEST_POINT_COUNT_SYSTEM_NOT {
  return createKEGS_QUEST_POINT_COUNT_SYSTEM_NOT(flags);
}

export interface KEGS_EXCHANGE_CASH_CLIENT_NOT {
  m_iOK?: Int32;
  m_iPoint?: Int32;
  m_AddBonusCashInfo?: KGlobalCashInfo;
}
export function createKEGS_EXCHANGE_CASH_CLIENT_NOT(flags?: FlagInput): KEGS_EXCHANGE_CASH_CLIENT_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_EXCHANGE_CASH_CLIENT_NOT = {
  };
  if (Boolean(f.SERV_COUNTRY_PH)) obj.m_iOK = 0;
  if (Boolean(f.SERV_COUNTRY_PH)) obj.m_iPoint = 0;
  if (f.SERV_COUNTRY_PH && f.SERV_SUPPORT_SEVERAL_CASH_TYPES) obj.m_AddBonusCashInfo = createKGlobalCashInfo(f);
  return obj;
}
export function putKEGS_EXCHANGE_CASH_CLIENT_NOT(ks: KSerializer, obj: KEGS_EXCHANGE_CASH_CLIENT_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_COUNTRY_PH)) {
    if (Boolean(f.SERV_COUNTRY_PH)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_COUNTRY_PH)) { if (!(ks.putInt32((obj.m_iPoint ?? 0)))) return false; }
    if (Boolean(f.SERV_COUNTRY_PH)) { if (!(ks.putUserClass((obj.m_AddBonusCashInfo ?? createKGlobalCashInfo(f)), putKGlobalCashInfo, f))) return false; }
  }
  return true;
}
export function getKEGS_EXCHANGE_CASH_CLIENT_NOT(ks: KSerializer, flags?: FlagInput): KEGS_EXCHANGE_CASH_CLIENT_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_EXCHANGE_CASH_CLIENT_NOT(f);
  if (Boolean(f.SERV_COUNTRY_PH)) {
    if (Boolean(f.SERV_COUNTRY_PH)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_COUNTRY_PH)) { obj.m_iPoint = ks.getInt32(); }
    if (Boolean(f.SERV_COUNTRY_PH)) { obj.m_AddBonusCashInfo = ks.getUserClass(getKGlobalCashInfo, f); }
  }
  return obj;
}

export interface KEGS_CHANGE_PET_ID_NOT {
  m_iOK?: Int32;
  m_iPetUID?: UidType;
}
export function createKEGS_CHANGE_PET_ID_NOT(flags?: FlagInput): KEGS_CHANGE_PET_ID_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_CHANGE_PET_ID_NOT = {
  };
  if (Boolean(f.SERV_HALLOWEEN_PUMPKIN_FAIRY_PET)) obj.m_iOK = 0;
  if (Boolean(f.SERV_HALLOWEEN_PUMPKIN_FAIRY_PET)) obj.m_iPetUID = 0n;
  return obj;
}
export function putKEGS_CHANGE_PET_ID_NOT(ks: KSerializer, obj: KEGS_CHANGE_PET_ID_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_HALLOWEEN_PUMPKIN_FAIRY_PET)) {
    if (Boolean(f.SERV_HALLOWEEN_PUMPKIN_FAIRY_PET)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_HALLOWEEN_PUMPKIN_FAIRY_PET)) { if (!(ks.putInt64((obj.m_iPetUID ?? 0n)))) return false; }
  }
  return true;
}
export function getKEGS_CHANGE_PET_ID_NOT(ks: KSerializer, flags?: FlagInput): KEGS_CHANGE_PET_ID_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_CHANGE_PET_ID_NOT(f);
  if (Boolean(f.SERV_HALLOWEEN_PUMPKIN_FAIRY_PET)) {
    if (Boolean(f.SERV_HALLOWEEN_PUMPKIN_FAIRY_PET)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_HALLOWEEN_PUMPKIN_FAIRY_PET)) { obj.m_iPetUID = ks.getInt64(); }
  }
  return obj;
}

export interface KEGS_COUPON_ITEM_CHECK_REQ {
  m_iButtonType?: Int32;
}
export function createKEGS_COUPON_ITEM_CHECK_REQ(flags?: FlagInput): KEGS_COUPON_ITEM_CHECK_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_COUPON_ITEM_CHECK_REQ = {
  };
  if (Boolean(f.SERV_COUPON_EVENT)) obj.m_iButtonType = 0;
  return obj;
}
export function putKEGS_COUPON_ITEM_CHECK_REQ(ks: KSerializer, obj: KEGS_COUPON_ITEM_CHECK_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_COUPON_EVENT)) {
    if (Boolean(f.SERV_COUPON_EVENT)) { if (!(ks.putInt32((obj.m_iButtonType ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_COUPON_ITEM_CHECK_REQ(ks: KSerializer, flags?: FlagInput): KEGS_COUPON_ITEM_CHECK_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_COUPON_ITEM_CHECK_REQ(f);
  if (Boolean(f.SERV_COUPON_EVENT)) {
    if (Boolean(f.SERV_COUPON_EVENT)) { obj.m_iButtonType = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_COUPON_ITEM_CHECK_ACK {
  m_iOK?: Int32;
  m_iCouponType?: Int32;
  m_iItemID?: Int32;
}
export function createKEGS_COUPON_ITEM_CHECK_ACK(flags?: FlagInput): KEGS_COUPON_ITEM_CHECK_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_COUPON_ITEM_CHECK_ACK = {
  };
  if (Boolean(f.SERV_COUPON_EVENT)) obj.m_iOK = 0;
  if (Boolean(f.SERV_COUPON_EVENT)) obj.m_iCouponType = 0;
  if (Boolean(f.SERV_COUPON_EVENT)) obj.m_iItemID = 0;
  return obj;
}
export function putKEGS_COUPON_ITEM_CHECK_ACK(ks: KSerializer, obj: KEGS_COUPON_ITEM_CHECK_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_COUPON_EVENT)) {
    if (Boolean(f.SERV_COUPON_EVENT)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_COUPON_EVENT)) { if (!(ks.putInt32((obj.m_iCouponType ?? 0)))) return false; }
    if (Boolean(f.SERV_COUPON_EVENT)) { if (!(ks.putInt32((obj.m_iItemID ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_COUPON_ITEM_CHECK_ACK(ks: KSerializer, flags?: FlagInput): KEGS_COUPON_ITEM_CHECK_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_COUPON_ITEM_CHECK_ACK(f);
  if (Boolean(f.SERV_COUPON_EVENT)) {
    if (Boolean(f.SERV_COUPON_EVENT)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_COUPON_EVENT)) { obj.m_iCouponType = ks.getInt32(); }
    if (Boolean(f.SERV_COUPON_EVENT)) { obj.m_iItemID = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_COUPON_ENTRY_REQ {
  m_iCouponType?: Int32;
}
export function createKEGS_COUPON_ENTRY_REQ(flags?: FlagInput): KEGS_COUPON_ENTRY_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_COUPON_ENTRY_REQ = {
  };
  if (Boolean(f.SERV_COUPON_EVENT)) obj.m_iCouponType = 0;
  return obj;
}
export function putKEGS_COUPON_ENTRY_REQ(ks: KSerializer, obj: KEGS_COUPON_ENTRY_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_COUPON_EVENT)) {
    if (Boolean(f.SERV_COUPON_EVENT)) { if (!(ks.putInt32((obj.m_iCouponType ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_COUPON_ENTRY_REQ(ks: KSerializer, flags?: FlagInput): KEGS_COUPON_ENTRY_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_COUPON_ENTRY_REQ(f);
  if (Boolean(f.SERV_COUPON_EVENT)) {
    if (Boolean(f.SERV_COUPON_EVENT)) { obj.m_iCouponType = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_COUPON_ENTRY_ACK {
  m_iOK?: Int32;
  m_vecUpdatedInventorySlot?: KInventoryItemInfo[];
}
export function createKEGS_COUPON_ENTRY_ACK(flags?: FlagInput): KEGS_COUPON_ENTRY_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_COUPON_ENTRY_ACK = {
  };
  if (Boolean(f.SERV_COUPON_EVENT)) obj.m_iOK = 0;
  if (Boolean(f.SERV_COUPON_EVENT)) obj.m_vecUpdatedInventorySlot = ([] as KInventoryItemInfo[]);
  return obj;
}
export function putKEGS_COUPON_ENTRY_ACK(ks: KSerializer, obj: KEGS_COUPON_ENTRY_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_COUPON_EVENT)) {
    if (Boolean(f.SERV_COUPON_EVENT)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_COUPON_EVENT)) { if (!(ks.putVector((obj.m_vecUpdatedInventorySlot ?? ([] as KInventoryItemInfo[])), (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false; }
  }
  return true;
}
export function getKEGS_COUPON_ENTRY_ACK(ks: KSerializer, flags?: FlagInput): KEGS_COUPON_ENTRY_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_COUPON_ENTRY_ACK(f);
  if (Boolean(f.SERV_COUPON_EVENT)) {
    if (Boolean(f.SERV_COUPON_EVENT)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_COUPON_EVENT)) { obj.m_vecUpdatedInventorySlot = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
  }
  return obj;
}

export const KEGS_GET_GUILD_FIND_AD_LIST_REQ_FIND_AD_SORT_TYPE = {
  FAST_REG_DATE: 0,
  FAST_UNIT_LEVEL: 1,
  FAST_MAX: 2,
} as const;
export type KEGS_GET_GUILD_FIND_AD_LIST_REQ_FIND_AD_SORT_TYPE = (typeof KEGS_GET_GUILD_FIND_AD_LIST_REQ_FIND_AD_SORT_TYPE)[keyof typeof KEGS_GET_GUILD_FIND_AD_LIST_REQ_FIND_AD_SORT_TYPE];
export function getKEGS_GET_GUILD_FIND_AD_LIST_REQ_FIND_AD_SORT_TYPE(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    cur = 0;
    out['FAST_REG_DATE'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    out['FAST_UNIT_LEVEL'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    out['FAST_MAX'] = cur;
    cur += 1;
  }
  return out;
}
export interface KEGS_GET_GUILD_FIND_AD_LIST_REQ {
  m_cSortType?: Int8;
  m_uiViewPage?: UInt32;
}
export function createKEGS_GET_GUILD_FIND_AD_LIST_REQ(flags?: FlagInput): KEGS_GET_GUILD_FIND_AD_LIST_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_GET_GUILD_FIND_AD_LIST_REQ = {
  };
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_cSortType = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_uiViewPage = 0;
  return obj;
}
export function putKEGS_GET_GUILD_FIND_AD_LIST_REQ(ks: KSerializer, obj: KEGS_GET_GUILD_FIND_AD_LIST_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt8((obj.m_cSortType ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putUInt32((obj.m_uiViewPage ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_GET_GUILD_FIND_AD_LIST_REQ(ks: KSerializer, flags?: FlagInput): KEGS_GET_GUILD_FIND_AD_LIST_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_GET_GUILD_FIND_AD_LIST_REQ(f);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_cSortType = ks.getInt8(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_uiViewPage = ks.getUInt32(); }
  }
  return obj;
}

export interface KEGS_GET_GUILD_FIND_AD_LIST_ACK {
  m_cSortType?: Int8;
  m_uiTotalPage?: UInt32;
  m_uiViewPage?: UInt32;
  m_vecGuildFindAdList?: KGuildFindAdInfo[];
  m_bCanShowInviteUserList?: boolean;
  m_bCanShowInviteGuildList?: boolean;
  m_bRegMyGuildFindAd?: boolean;
}
export function createKEGS_GET_GUILD_FIND_AD_LIST_ACK(flags?: FlagInput): KEGS_GET_GUILD_FIND_AD_LIST_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_GET_GUILD_FIND_AD_LIST_ACK = {
  };
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_cSortType = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_uiTotalPage = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_uiViewPage = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_vecGuildFindAdList = ([] as KGuildFindAdInfo[]);
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_bCanShowInviteUserList = false;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_bCanShowInviteGuildList = false;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_bRegMyGuildFindAd = false;
  return obj;
}
export function putKEGS_GET_GUILD_FIND_AD_LIST_ACK(ks: KSerializer, obj: KEGS_GET_GUILD_FIND_AD_LIST_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt8((obj.m_cSortType ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putUInt32((obj.m_uiTotalPage ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putUInt32((obj.m_uiViewPage ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putVector((obj.m_vecGuildFindAdList ?? ([] as KGuildFindAdInfo[])), (ks, item: KGuildFindAdInfo) => ks.putUserClass(item, putKGuildFindAdInfo, f)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putBool((obj.m_bCanShowInviteUserList ?? false)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putBool((obj.m_bCanShowInviteGuildList ?? false)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putBool((obj.m_bRegMyGuildFindAd ?? false)))) return false; }
  }
  return true;
}
export function getKEGS_GET_GUILD_FIND_AD_LIST_ACK(ks: KSerializer, flags?: FlagInput): KEGS_GET_GUILD_FIND_AD_LIST_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_GET_GUILD_FIND_AD_LIST_ACK(f);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_cSortType = ks.getInt8(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_uiTotalPage = ks.getUInt32(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_uiViewPage = ks.getUInt32(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_vecGuildFindAdList = ks.getVector<KGuildFindAdInfo>((ks) => ks.getUserClass(getKGuildFindAdInfo, f)); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_bCanShowInviteUserList = ks.getBool(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_bCanShowInviteGuildList = ks.getBool(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_bRegMyGuildFindAd = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_REGISTRATION_GUILD_INVITE_MSG_REQ {
  m_bOldInviteMsgDelete?: boolean;
  m_iUnitUID?: UidType;
  m_cUnitClass?: Int8;
  m_iUnitLevel?: Int32;
  m_wstrNickName?: string;
  m_wstrMessage?: string;
}
export function createKEGS_REGISTRATION_GUILD_INVITE_MSG_REQ(flags?: FlagInput): KEGS_REGISTRATION_GUILD_INVITE_MSG_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_REGISTRATION_GUILD_INVITE_MSG_REQ = {
  };
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_bOldInviteMsgDelete = false;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_cUnitClass = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_iUnitLevel = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_wstrNickName = '';
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_wstrMessage = '';
  return obj;
}
export function putKEGS_REGISTRATION_GUILD_INVITE_MSG_REQ(ks: KSerializer, obj: KEGS_REGISTRATION_GUILD_INVITE_MSG_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putBool((obj.m_bOldInviteMsgDelete ?? false)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt8((obj.m_cUnitClass ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt32((obj.m_iUnitLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putWString((obj.m_wstrMessage ?? '')))) return false; }
  }
  return true;
}
export function getKEGS_REGISTRATION_GUILD_INVITE_MSG_REQ(ks: KSerializer, flags?: FlagInput): KEGS_REGISTRATION_GUILD_INVITE_MSG_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_REGISTRATION_GUILD_INVITE_MSG_REQ(f);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_bOldInviteMsgDelete = ks.getBool(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_cUnitClass = ks.getInt8(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_iUnitLevel = ks.getInt32(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_wstrNickName = ks.getWString(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_wstrMessage = ks.getWString(); }
  }
  return obj;
}

export interface KEGS_REGISTRATION_GUILD_INVITE_MSG_ACK {
  m_iOK?: Int32;
  m_iED?: Int32;
  m_sPeriod?: Int16;
  m_wstrNickName?: string;
  m_wstrMessage?: string;
}
export function createKEGS_REGISTRATION_GUILD_INVITE_MSG_ACK(flags?: FlagInput): KEGS_REGISTRATION_GUILD_INVITE_MSG_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_REGISTRATION_GUILD_INVITE_MSG_ACK = {
  };
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_iOK = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_iED = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_sPeriod = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_wstrNickName = '';
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_wstrMessage = '';
  return obj;
}
export function putKEGS_REGISTRATION_GUILD_INVITE_MSG_ACK(ks: KSerializer, obj: KEGS_REGISTRATION_GUILD_INVITE_MSG_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt32((obj.m_iED ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt16((obj.m_sPeriod ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putWString((obj.m_wstrMessage ?? '')))) return false; }
  }
  return true;
}
export function getKEGS_REGISTRATION_GUILD_INVITE_MSG_ACK(ks: KSerializer, flags?: FlagInput): KEGS_REGISTRATION_GUILD_INVITE_MSG_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_REGISTRATION_GUILD_INVITE_MSG_ACK(f);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_iED = ks.getInt32(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_sPeriod = ks.getInt16(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_wstrNickName = ks.getWString(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_wstrMessage = ks.getWString(); }
  }
  return obj;
}

export interface KEGS_REGISTRATION_GUILD_FIND_AD_REQ {
  m_sPeriod?: Int16;
  m_wstrFindAdMessage?: string;
}
export function createKEGS_REGISTRATION_GUILD_FIND_AD_REQ(flags?: FlagInput): KEGS_REGISTRATION_GUILD_FIND_AD_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_REGISTRATION_GUILD_FIND_AD_REQ = {
  };
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_sPeriod = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_wstrFindAdMessage = '';
  return obj;
}
export function putKEGS_REGISTRATION_GUILD_FIND_AD_REQ(ks: KSerializer, obj: KEGS_REGISTRATION_GUILD_FIND_AD_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt16((obj.m_sPeriod ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putWString((obj.m_wstrFindAdMessage ?? '')))) return false; }
  }
  return true;
}
export function getKEGS_REGISTRATION_GUILD_FIND_AD_REQ(ks: KSerializer, flags?: FlagInput): KEGS_REGISTRATION_GUILD_FIND_AD_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_REGISTRATION_GUILD_FIND_AD_REQ(f);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_sPeriod = ks.getInt16(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_wstrFindAdMessage = ks.getWString(); }
  }
  return obj;
}

export interface KEGS_REGISTRATION_GUILD_FIND_AD_ACK {
  m_iOK?: Int32;
  m_iED?: Int32;
  m_sPeriod?: Int16;
  m_wstrFindAdMessage?: string;
}
export function createKEGS_REGISTRATION_GUILD_FIND_AD_ACK(flags?: FlagInput): KEGS_REGISTRATION_GUILD_FIND_AD_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_REGISTRATION_GUILD_FIND_AD_ACK = {
  };
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_iOK = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_iED = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_sPeriod = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_wstrFindAdMessage = '';
  return obj;
}
export function putKEGS_REGISTRATION_GUILD_FIND_AD_ACK(ks: KSerializer, obj: KEGS_REGISTRATION_GUILD_FIND_AD_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt32((obj.m_iED ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt16((obj.m_sPeriod ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putWString((obj.m_wstrFindAdMessage ?? '')))) return false; }
  }
  return true;
}
export function getKEGS_REGISTRATION_GUILD_FIND_AD_ACK(ks: KSerializer, flags?: FlagInput): KEGS_REGISTRATION_GUILD_FIND_AD_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_REGISTRATION_GUILD_FIND_AD_ACK(f);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_iED = ks.getInt32(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_sPeriod = ks.getInt16(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_wstrFindAdMessage = ks.getWString(); }
  }
  return obj;
}

export interface KEGS_GET_GUILD_INVITE_USER_LIST_REQ {
  m_uiViewPage?: UInt32;
}
export function createKEGS_GET_GUILD_INVITE_USER_LIST_REQ(flags?: FlagInput): KEGS_GET_GUILD_INVITE_USER_LIST_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_GET_GUILD_INVITE_USER_LIST_REQ = {
  };
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_uiViewPage = 0;
  return obj;
}
export function putKEGS_GET_GUILD_INVITE_USER_LIST_REQ(ks: KSerializer, obj: KEGS_GET_GUILD_INVITE_USER_LIST_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putUInt32((obj.m_uiViewPage ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_GET_GUILD_INVITE_USER_LIST_REQ(ks: KSerializer, flags?: FlagInput): KEGS_GET_GUILD_INVITE_USER_LIST_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_GET_GUILD_INVITE_USER_LIST_REQ(f);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_uiViewPage = ks.getUInt32(); }
  }
  return obj;
}

export interface KEGS_GET_GUILD_INVITE_USER_LIST_ACK {
  m_iOK?: Int32;
  m_wstrGuildName?: string;
  m_uiTotalPage?: UInt32;
  m_uiViewPage?: UInt32;
  m_vecGuildInviteUserList?: KGuildInviteMsgInfo[];
}
export function createKEGS_GET_GUILD_INVITE_USER_LIST_ACK(flags?: FlagInput): KEGS_GET_GUILD_INVITE_USER_LIST_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_GET_GUILD_INVITE_USER_LIST_ACK = {
  };
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_iOK = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_wstrGuildName = '';
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_uiTotalPage = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_uiViewPage = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_vecGuildInviteUserList = ([] as KGuildInviteMsgInfo[]);
  return obj;
}
export function putKEGS_GET_GUILD_INVITE_USER_LIST_ACK(ks: KSerializer, obj: KEGS_GET_GUILD_INVITE_USER_LIST_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putWString((obj.m_wstrGuildName ?? '')))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putUInt32((obj.m_uiTotalPage ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putUInt32((obj.m_uiViewPage ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putVector((obj.m_vecGuildInviteUserList ?? ([] as KGuildInviteMsgInfo[])), (ks, item: KGuildInviteMsgInfo) => ks.putUserClass(item, putKGuildInviteMsgInfo, f)))) return false; }
  }
  return true;
}
export function getKEGS_GET_GUILD_INVITE_USER_LIST_ACK(ks: KSerializer, flags?: FlagInput): KEGS_GET_GUILD_INVITE_USER_LIST_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_GET_GUILD_INVITE_USER_LIST_ACK(f);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_wstrGuildName = ks.getWString(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_uiTotalPage = ks.getUInt32(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_uiViewPage = ks.getUInt32(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_vecGuildInviteUserList = ks.getVector<KGuildInviteMsgInfo>((ks) => ks.getUserClass(getKGuildInviteMsgInfo, f)); }
  }
  return obj;
}

export interface KEGS_GET_GUILD_INVITE_GUILD_LIST_REQ {
  m_uiViewPage?: UInt32;
}
export function createKEGS_GET_GUILD_INVITE_GUILD_LIST_REQ(flags?: FlagInput): KEGS_GET_GUILD_INVITE_GUILD_LIST_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_GET_GUILD_INVITE_GUILD_LIST_REQ = {
  };
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_uiViewPage = 0;
  return obj;
}
export function putKEGS_GET_GUILD_INVITE_GUILD_LIST_REQ(ks: KSerializer, obj: KEGS_GET_GUILD_INVITE_GUILD_LIST_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putUInt32((obj.m_uiViewPage ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_GET_GUILD_INVITE_GUILD_LIST_REQ(ks: KSerializer, flags?: FlagInput): KEGS_GET_GUILD_INVITE_GUILD_LIST_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_GET_GUILD_INVITE_GUILD_LIST_REQ(f);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_uiViewPage = ks.getUInt32(); }
  }
  return obj;
}

export interface KEGS_GET_GUILD_INVITE_GUILD_LIST_ACK {
  m_iOK?: Int32;
  m_uiTotalPage?: UInt32;
  m_uiViewPage?: UInt32;
  m_vecGuildInviteGuildList?: KGuildInviteMsgInfo[];
}
export function createKEGS_GET_GUILD_INVITE_GUILD_LIST_ACK(flags?: FlagInput): KEGS_GET_GUILD_INVITE_GUILD_LIST_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_GET_GUILD_INVITE_GUILD_LIST_ACK = {
  };
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_iOK = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_uiTotalPage = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_uiViewPage = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_vecGuildInviteGuildList = ([] as KGuildInviteMsgInfo[]);
  return obj;
}
export function putKEGS_GET_GUILD_INVITE_GUILD_LIST_ACK(ks: KSerializer, obj: KEGS_GET_GUILD_INVITE_GUILD_LIST_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putUInt32((obj.m_uiTotalPage ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putUInt32((obj.m_uiViewPage ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putVector((obj.m_vecGuildInviteGuildList ?? ([] as KGuildInviteMsgInfo[])), (ks, item: KGuildInviteMsgInfo) => ks.putUserClass(item, putKGuildInviteMsgInfo, f)))) return false; }
  }
  return true;
}
export function getKEGS_GET_GUILD_INVITE_GUILD_LIST_ACK(ks: KSerializer, flags?: FlagInput): KEGS_GET_GUILD_INVITE_GUILD_LIST_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_GET_GUILD_INVITE_GUILD_LIST_ACK(f);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_uiTotalPage = ks.getUInt32(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_uiViewPage = ks.getUInt32(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_vecGuildInviteGuildList = ks.getVector<KGuildInviteMsgInfo>((ks) => ks.getUserClass(getKGuildInviteMsgInfo, f)); }
  }
  return obj;
}

export interface KEGS_ACCEPT_INVITE_REQ {
  m_iGuildUID?: Int32;
}
export function createKEGS_ACCEPT_INVITE_REQ(flags?: FlagInput): KEGS_ACCEPT_INVITE_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_ACCEPT_INVITE_REQ = {
  };
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_iGuildUID = 0;
  return obj;
}
export function putKEGS_ACCEPT_INVITE_REQ(ks: KSerializer, obj: KEGS_ACCEPT_INVITE_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt32((obj.m_iGuildUID ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_ACCEPT_INVITE_REQ(ks: KSerializer, flags?: FlagInput): KEGS_ACCEPT_INVITE_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_ACCEPT_INVITE_REQ(f);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_iGuildUID = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_CANCEL_INVITE_MSG_REQ {
  m_iGuildUID?: Int32;
  m_iDeletedUnitUID?: UidType;
}
export function createKEGS_CANCEL_INVITE_MSG_REQ(flags?: FlagInput): KEGS_CANCEL_INVITE_MSG_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_CANCEL_INVITE_MSG_REQ = {
  };
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_iGuildUID = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_iDeletedUnitUID = 0n;
  return obj;
}
export function putKEGS_CANCEL_INVITE_MSG_REQ(ks: KSerializer, obj: KEGS_CANCEL_INVITE_MSG_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt32((obj.m_iGuildUID ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt64((obj.m_iDeletedUnitUID ?? 0n)))) return false; }
  }
  return true;
}
export function getKEGS_CANCEL_INVITE_MSG_REQ(ks: KSerializer, flags?: FlagInput): KEGS_CANCEL_INVITE_MSG_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_CANCEL_INVITE_MSG_REQ(f);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_iGuildUID = ks.getInt32(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_iDeletedUnitUID = ks.getInt64(); }
  }
  return obj;
}

export interface KEGS_CANCEL_INVITE_MSG_ACK {
  m_iOK?: Int32;
  m_bCancel?: boolean;
}
export function createKEGS_CANCEL_INVITE_MSG_ACK(flags?: FlagInput): KEGS_CANCEL_INVITE_MSG_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_CANCEL_INVITE_MSG_ACK = {
  };
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_iOK = 0;
  if (Boolean(f.SERV_GUILD_FIND_AD)) obj.m_bCancel = false;
  return obj;
}
export function putKEGS_CANCEL_INVITE_MSG_ACK(ks: KSerializer, obj: KEGS_CANCEL_INVITE_MSG_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { if (!(ks.putBool((obj.m_bCancel ?? false)))) return false; }
  }
  return true;
}
export function getKEGS_CANCEL_INVITE_MSG_ACK(ks: KSerializer, flags?: FlagInput): KEGS_CANCEL_INVITE_MSG_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_CANCEL_INVITE_MSG_ACK(f);
  if (Boolean(f.SERV_GUILD_FIND_AD)) {
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_GUILD_FIND_AD)) { obj.m_bCancel = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_READY_TO_SOSUN_EVENT_ACK {
  m_iOK?: Int32;
  m_vecKInventorySlotInfo?: KInventoryItemInfo[];
  m_iFirstUnitClass?: Int32;
}
export function createKEGS_READY_TO_SOSUN_EVENT_ACK(flags?: FlagInput): KEGS_READY_TO_SOSUN_EVENT_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_READY_TO_SOSUN_EVENT_ACK = {
  };
  if (Boolean(f.SERV_READY_TO_SOSUN_EVENT)) obj.m_iOK = 0;
  if (Boolean(f.SERV_READY_TO_SOSUN_EVENT)) obj.m_vecKInventorySlotInfo = ([] as KInventoryItemInfo[]);
  if (Boolean(f.SERV_READY_TO_SOSUN_EVENT)) obj.m_iFirstUnitClass = 0;
  return obj;
}
export function putKEGS_READY_TO_SOSUN_EVENT_ACK(ks: KSerializer, obj: KEGS_READY_TO_SOSUN_EVENT_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_READY_TO_SOSUN_EVENT)) {
    if (Boolean(f.SERV_READY_TO_SOSUN_EVENT)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_READY_TO_SOSUN_EVENT)) { if (!(ks.putVector((obj.m_vecKInventorySlotInfo ?? ([] as KInventoryItemInfo[])), (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false; }
    if (Boolean(f.SERV_READY_TO_SOSUN_EVENT)) { if (!(ks.putInt32((obj.m_iFirstUnitClass ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_READY_TO_SOSUN_EVENT_ACK(ks: KSerializer, flags?: FlagInput): KEGS_READY_TO_SOSUN_EVENT_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_READY_TO_SOSUN_EVENT_ACK(f);
  if (Boolean(f.SERV_READY_TO_SOSUN_EVENT)) {
    if (Boolean(f.SERV_READY_TO_SOSUN_EVENT)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_READY_TO_SOSUN_EVENT)) { obj.m_vecKInventorySlotInfo = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
    if (Boolean(f.SERV_READY_TO_SOSUN_EVENT)) { obj.m_iFirstUnitClass = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_USE_PROPOSE_ITEM_REQ {
  m_iUsedItemUID?: UidType;
  m_wstrNickName?: string;
}
export function createKEGS_USE_PROPOSE_ITEM_REQ(flags?: FlagInput): KEGS_USE_PROPOSE_ITEM_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_USE_PROPOSE_ITEM_REQ = {
  };
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) obj.m_iUsedItemUID = 0n;
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) obj.m_wstrNickName = '';
  return obj;
}
export function putKEGS_USE_PROPOSE_ITEM_REQ(ks: KSerializer, obj: KEGS_USE_PROPOSE_ITEM_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) {
    if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { if (!(ks.putInt64((obj.m_iUsedItemUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
  }
  return true;
}
export function getKEGS_USE_PROPOSE_ITEM_REQ(ks: KSerializer, flags?: FlagInput): KEGS_USE_PROPOSE_ITEM_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_USE_PROPOSE_ITEM_REQ(f);
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) {
    if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { obj.m_iUsedItemUID = ks.getInt64(); }
    if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { obj.m_wstrNickName = ks.getWString(); }
  }
  return obj;
}

export interface KEGS_USE_PROPOSE_ITEM_ACK {
  m_iOK?: Int32;
  m_wstrNickName?: string;
  m_vecKInventorySlotInfo?: KInventoryItemInfo[];
}
export function createKEGS_USE_PROPOSE_ITEM_ACK(flags?: FlagInput): KEGS_USE_PROPOSE_ITEM_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_USE_PROPOSE_ITEM_ACK = {
  };
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) obj.m_iOK = 0;
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) obj.m_wstrNickName = '';
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) obj.m_vecKInventorySlotInfo = ([] as KInventoryItemInfo[]);
  return obj;
}
export function putKEGS_USE_PROPOSE_ITEM_ACK(ks: KSerializer, obj: KEGS_USE_PROPOSE_ITEM_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) {
    if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { if (!(ks.putVector((obj.m_vecKInventorySlotInfo ?? ([] as KInventoryItemInfo[])), (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false; }
  }
  return true;
}
export function getKEGS_USE_PROPOSE_ITEM_ACK(ks: KSerializer, flags?: FlagInput): KEGS_USE_PROPOSE_ITEM_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_USE_PROPOSE_ITEM_ACK(f);
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) {
    if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { obj.m_wstrNickName = ks.getWString(); }
    if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { obj.m_vecKInventorySlotInfo = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
  }
  return obj;
}

export interface KEGS_EVENT_PROPOSE_RESULT_ACCEPTOR_NOT {
  m_vecUpdatedInventorySlot?: KInventoryItemInfo[];
}
export function createKEGS_EVENT_PROPOSE_RESULT_ACCEPTOR_NOT(flags?: FlagInput): KEGS_EVENT_PROPOSE_RESULT_ACCEPTOR_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_EVENT_PROPOSE_RESULT_ACCEPTOR_NOT = {
  };
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) obj.m_vecUpdatedInventorySlot = ([] as KInventoryItemInfo[]);
  return obj;
}
export function putKEGS_EVENT_PROPOSE_RESULT_ACCEPTOR_NOT(ks: KSerializer, obj: KEGS_EVENT_PROPOSE_RESULT_ACCEPTOR_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) {
    if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { if (!(ks.putVector((obj.m_vecUpdatedInventorySlot ?? ([] as KInventoryItemInfo[])), (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false; }
  }
  return true;
}
export function getKEGS_EVENT_PROPOSE_RESULT_ACCEPTOR_NOT(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_PROPOSE_RESULT_ACCEPTOR_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_EVENT_PROPOSE_RESULT_ACCEPTOR_NOT(f);
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) {
    if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { obj.m_vecUpdatedInventorySlot = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
  }
  return obj;
}

export interface KEGS_USE_DIVORCE_ITEM_ACK {
  m_iOK?: Int32;
  m_vecUpdatedInventorySlot?: KInventoryItemInfo[];
}
export function createKEGS_USE_DIVORCE_ITEM_ACK(flags?: FlagInput): KEGS_USE_DIVORCE_ITEM_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_USE_DIVORCE_ITEM_ACK = {
  };
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) obj.m_iOK = 0;
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) obj.m_vecUpdatedInventorySlot = ([] as KInventoryItemInfo[]);
  return obj;
}
export function putKEGS_USE_DIVORCE_ITEM_ACK(ks: KSerializer, obj: KEGS_USE_DIVORCE_ITEM_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) {
    if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { if (!(ks.putVector((obj.m_vecUpdatedInventorySlot ?? ([] as KInventoryItemInfo[])), (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false; }
  }
  return true;
}
export function getKEGS_USE_DIVORCE_ITEM_ACK(ks: KSerializer, flags?: FlagInput): KEGS_USE_DIVORCE_ITEM_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_USE_DIVORCE_ITEM_ACK(f);
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) {
    if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { obj.m_vecUpdatedInventorySlot = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
  }
  return obj;
}

export interface KEGS_USE_INTIMACY_UP_ITEM_REQ {
  m_iItemUID?: UidType;
}
export function createKEGS_USE_INTIMACY_UP_ITEM_REQ(flags?: FlagInput): KEGS_USE_INTIMACY_UP_ITEM_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_USE_INTIMACY_UP_ITEM_REQ = {
  };
  if (Boolean(f.SERV_EVENT_VC)) obj.m_iItemUID = 0n;
  return obj;
}
export function putKEGS_USE_INTIMACY_UP_ITEM_REQ(ks: KSerializer, obj: KEGS_USE_INTIMACY_UP_ITEM_REQ, flags?: FlagInput): boolean {
  return true;
}
export function getKEGS_USE_INTIMACY_UP_ITEM_REQ(ks: KSerializer, flags?: FlagInput): KEGS_USE_INTIMACY_UP_ITEM_REQ {
  return createKEGS_USE_INTIMACY_UP_ITEM_REQ(flags);
}

export interface KEGS_USE_INTIMACY_UP_ITEM_ACK {
  m_iOK?: Int32;
  m_vecInventorySlotInfo?: KInventoryItemInfo[];
  m_iUpPercent?: Int32;
}
export function createKEGS_USE_INTIMACY_UP_ITEM_ACK(flags?: FlagInput): KEGS_USE_INTIMACY_UP_ITEM_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_USE_INTIMACY_UP_ITEM_ACK = {
  };
  if (Boolean(f.SERV_EVENT_VC)) obj.m_iOK = 0;
  if (Boolean(f.SERV_EVENT_VC)) obj.m_vecInventorySlotInfo = ([] as KInventoryItemInfo[]);
  if (Boolean(f.SERV_EVENT_VC)) obj.m_iUpPercent = 0;
  return obj;
}
export function putKEGS_USE_INTIMACY_UP_ITEM_ACK(ks: KSerializer, obj: KEGS_USE_INTIMACY_UP_ITEM_ACK, flags?: FlagInput): boolean {
  return true;
}
export function getKEGS_USE_INTIMACY_UP_ITEM_ACK(ks: KSerializer, flags?: FlagInput): KEGS_USE_INTIMACY_UP_ITEM_ACK {
  return createKEGS_USE_INTIMACY_UP_ITEM_ACK(flags);
}

export interface KEGS_USE_SPIRIT_REWARD_REQ {
  m_iLocationIndex?: Int32;
}
export function createKEGS_USE_SPIRIT_REWARD_REQ(flags?: FlagInput): KEGS_USE_SPIRIT_REWARD_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_USE_SPIRIT_REWARD_REQ = {
  };
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) obj.m_iLocationIndex = 0;
  return obj;
}
export function putKEGS_USE_SPIRIT_REWARD_REQ(ks: KSerializer, obj: KEGS_USE_SPIRIT_REWARD_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) {
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_iLocationIndex ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_USE_SPIRIT_REWARD_REQ(ks: KSerializer, flags?: FlagInput): KEGS_USE_SPIRIT_REWARD_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_USE_SPIRIT_REWARD_REQ(f);
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) {
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { obj.m_iLocationIndex = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_USE_SPIRIT_REWARD_ACK {
  m_iOK?: Int32;
  m_arrChinaSpirit?: Int32[];
  m_iLocationIndex?: Int32;
}
export function createKEGS_USE_SPIRIT_REWARD_ACK(flags?: FlagInput): KEGS_USE_SPIRIT_REWARD_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_USE_SPIRIT_REWARD_ACK = {
  };
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) obj.m_iOK = 0;
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) obj.m_arrChinaSpirit = Array.from({ length: 6 }, () => 0);
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) obj.m_iLocationIndex = 0;
  return obj;
}
export function putKEGS_USE_SPIRIT_REWARD_ACK(ks: KSerializer, obj: KEGS_USE_SPIRIT_REWARD_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) {
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[0] ?? 0)))) return false; }
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[1] ?? 0)))) return false; }
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[2] ?? 0)))) return false; }
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[3] ?? 0)))) return false; }
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[4] ?? 0)))) return false; }
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[5] ?? 0)))) return false; }
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_iLocationIndex ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_USE_SPIRIT_REWARD_ACK(ks: KSerializer, flags?: FlagInput): KEGS_USE_SPIRIT_REWARD_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_USE_SPIRIT_REWARD_ACK(f);
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) {
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[0] = ks.getInt32(); }
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[1] = ks.getInt32(); }
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[2] = ks.getInt32(); }
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[3] = ks.getInt32(); }
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[4] = ks.getInt32(); }
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[5] = ks.getInt32(); }
    if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { obj.m_iLocationIndex = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_RELEASE_PET_REQ {
  m_iPetUID?: UidType;
}
export function createKEGS_RELEASE_PET_REQ(flags?: FlagInput): KEGS_RELEASE_PET_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_RELEASE_PET_REQ = {
  };
  if (Boolean(f.SERV_PERIOD_PET)) obj.m_iPetUID = 0n;
  return obj;
}
export function putKEGS_RELEASE_PET_REQ(ks: KSerializer, obj: KEGS_RELEASE_PET_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PERIOD_PET)) {
    if (Boolean(f.SERV_PERIOD_PET)) { if (!(ks.putInt64((obj.m_iPetUID ?? 0n)))) return false; }
  }
  return true;
}
export function getKEGS_RELEASE_PET_REQ(ks: KSerializer, flags?: FlagInput): KEGS_RELEASE_PET_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_RELEASE_PET_REQ(f);
  if (Boolean(f.SERV_PERIOD_PET)) {
    if (Boolean(f.SERV_PERIOD_PET)) { obj.m_iPetUID = ks.getInt64(); }
  }
  return obj;
}

export interface KEGS_RELEASE_PET_ACK {
  m_iOK?: UidType;
  m_iPetUID?: UidType;
}
export function createKEGS_RELEASE_PET_ACK(flags?: FlagInput): KEGS_RELEASE_PET_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_RELEASE_PET_ACK = {
  };
  if (Boolean(f.SERV_PERIOD_PET)) obj.m_iOK = 0n;
  if (Boolean(f.SERV_PERIOD_PET)) obj.m_iPetUID = 0n;
  return obj;
}
export function putKEGS_RELEASE_PET_ACK(ks: KSerializer, obj: KEGS_RELEASE_PET_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PERIOD_PET)) {
    if (Boolean(f.SERV_PERIOD_PET)) { if (!(ks.putInt64((obj.m_iOK ?? 0n)))) return false; }
    if (Boolean(f.SERV_PERIOD_PET)) { if (!(ks.putInt64((obj.m_iPetUID ?? 0n)))) return false; }
  }
  return true;
}
export function getKEGS_RELEASE_PET_ACK(ks: KSerializer, flags?: FlagInput): KEGS_RELEASE_PET_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_RELEASE_PET_ACK(f);
  if (Boolean(f.SERV_PERIOD_PET)) {
    if (Boolean(f.SERV_PERIOD_PET)) { obj.m_iOK = ks.getInt64(); }
    if (Boolean(f.SERV_PERIOD_PET)) { obj.m_iPetUID = ks.getInt64(); }
  }
  return obj;
}

export interface KEGS_RELEASE_PET_NOT {
  m_iPetUID?: UidType;
  m_iUnitUID?: UidType;
  m_iPetID?: Int32;
}
export function createKEGS_RELEASE_PET_NOT(flags?: FlagInput): KEGS_RELEASE_PET_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_RELEASE_PET_NOT = {
  };
  if (Boolean(f.SERV_PERIOD_PET)) obj.m_iPetUID = 0n;
  if (Boolean(f.SERV_PERIOD_PET)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_PERIOD_PET)) obj.m_iPetID = 0;
  return obj;
}
export function putKEGS_RELEASE_PET_NOT(ks: KSerializer, obj: KEGS_RELEASE_PET_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PERIOD_PET)) {
    if (Boolean(f.SERV_PERIOD_PET)) { if (!(ks.putInt64((obj.m_iPetUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_PERIOD_PET)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_PERIOD_PET)) { if (!(ks.putInt32((obj.m_iPetID ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_RELEASE_PET_NOT(ks: KSerializer, flags?: FlagInput): KEGS_RELEASE_PET_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_RELEASE_PET_NOT(f);
  if (Boolean(f.SERV_PERIOD_PET)) {
    if (Boolean(f.SERV_PERIOD_PET)) { obj.m_iPetUID = ks.getInt64(); }
    if (Boolean(f.SERV_PERIOD_PET)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_PERIOD_PET)) { obj.m_iPetID = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_CUBE_IN_ITEM_MAPPING_NOT {
  m_mapCubeInItemMapping?: Map<Int32, Map<Int32, kRandomItemMappingToInfoClient>>;
}
export function createKEGS_CUBE_IN_ITEM_MAPPING_NOT(flags?: FlagInput): KEGS_CUBE_IN_ITEM_MAPPING_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_CUBE_IN_ITEM_MAPPING_NOT = {
  };
  if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) obj.m_mapCubeInItemMapping = new Map<Int32, Map<Int32, kRandomItemMappingToInfoClient>>();
  return obj;
}
export function putKEGS_CUBE_IN_ITEM_MAPPING_NOT(ks: KSerializer, obj: KEGS_CUBE_IN_ITEM_MAPPING_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) {
    if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) { if (!(ks.putMap((obj.m_mapCubeInItemMapping ?? new Map<Int32, Map<Int32, kRandomItemMappingToInfoClient>>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Map<Int32, kRandomItemMappingToInfoClient>) => ks.putMap(v, (ks, k: Int32) => ks.putInt32(k), (ks, v: kRandomItemMappingToInfoClient) => ks.putUserClass(v, putkRandomItemMappingToInfoClient, f))))) return false; }
  }
  return true;
}
export function getKEGS_CUBE_IN_ITEM_MAPPING_NOT(ks: KSerializer, flags?: FlagInput): KEGS_CUBE_IN_ITEM_MAPPING_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_CUBE_IN_ITEM_MAPPING_NOT(f);
  if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) {
    if (Boolean(f.SERV_CUBE_IN_ITEM_MAPPING)) { obj.m_mapCubeInItemMapping = ks.getMap<Int32, Map<Int32, kRandomItemMappingToInfoClient>>((ks) => ks.getInt32(), (ks) => ks.getMap<Int32, kRandomItemMappingToInfoClient>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getkRandomItemMappingToInfoClient, f))); }
  }
  return obj;
}

export interface KEGS_USE_RECRUIT_TICKET_REQ {
  m_iItemUID?: UidType;
}
export function createKEGS_USE_RECRUIT_TICKET_REQ(flags?: FlagInput): KEGS_USE_RECRUIT_TICKET_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_USE_RECRUIT_TICKET_REQ = {
  };
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) obj.m_iItemUID = 0n;
  return obj;
}
export function putKEGS_USE_RECRUIT_TICKET_REQ(ks: KSerializer, obj: KEGS_USE_RECRUIT_TICKET_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) {
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { if (!(ks.putInt64((obj.m_iItemUID ?? 0n)))) return false; }
  }
  return true;
}
export function getKEGS_USE_RECRUIT_TICKET_REQ(ks: KSerializer, flags?: FlagInput): KEGS_USE_RECRUIT_TICKET_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_USE_RECRUIT_TICKET_REQ(f);
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) {
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { obj.m_iItemUID = ks.getInt64(); }
  }
  return obj;
}

export interface KEGS_USE_RECRUIT_TICKET_ACK {
  m_iOK?: Int32;
}
export function createKEGS_USE_RECRUIT_TICKET_ACK(flags?: FlagInput): KEGS_USE_RECRUIT_TICKET_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_USE_RECRUIT_TICKET_ACK = {
  };
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) obj.m_iOK = 0;
  return obj;
}
export function putKEGS_USE_RECRUIT_TICKET_ACK(ks: KSerializer, obj: KEGS_USE_RECRUIT_TICKET_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) {
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_USE_RECRUIT_TICKET_ACK(ks: KSerializer, flags?: FlagInput): KEGS_USE_RECRUIT_TICKET_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_USE_RECRUIT_TICKET_ACK(f);
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) {
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { obj.m_iOK = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_REGISTER_RECRUITER_REQ {
  m_wstrNickname?: string;
}
export function createKEGS_REGISTER_RECRUITER_REQ(flags?: FlagInput): KEGS_REGISTER_RECRUITER_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_REGISTER_RECRUITER_REQ = {
  };
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) obj.m_wstrNickname = '';
  return obj;
}
export function putKEGS_REGISTER_RECRUITER_REQ(ks: KSerializer, obj: KEGS_REGISTER_RECRUITER_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) {
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { if (!(ks.putWString((obj.m_wstrNickname ?? '')))) return false; }
  }
  return true;
}
export function getKEGS_REGISTER_RECRUITER_REQ(ks: KSerializer, flags?: FlagInput): KEGS_REGISTER_RECRUITER_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_REGISTER_RECRUITER_REQ(f);
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) {
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { obj.m_wstrNickname = ks.getWString(); }
  }
  return obj;
}

export interface KEGS_REGISTER_RECRUITER_ACK {
  m_iOK?: Int32;
  m_vecKInventorySlotInfo?: KInventoryItemInfo[];
  m_iUsedItemID?: Int32;
}
export function createKEGS_REGISTER_RECRUITER_ACK(flags?: FlagInput): KEGS_REGISTER_RECRUITER_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_REGISTER_RECRUITER_ACK = {
  };
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) obj.m_iOK = 0;
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) obj.m_vecKInventorySlotInfo = ([] as KInventoryItemInfo[]);
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) obj.m_iUsedItemID = 0;
  return obj;
}
export function putKEGS_REGISTER_RECRUITER_ACK(ks: KSerializer, obj: KEGS_REGISTER_RECRUITER_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) {
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { if (!(ks.putVector((obj.m_vecKInventorySlotInfo ?? ([] as KInventoryItemInfo[])), (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false; }
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { if (!(ks.putInt32((obj.m_iUsedItemID ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_REGISTER_RECRUITER_ACK(ks: KSerializer, flags?: FlagInput): KEGS_REGISTER_RECRUITER_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_REGISTER_RECRUITER_ACK(f);
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) {
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { obj.m_vecKInventorySlotInfo = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { obj.m_iUsedItemID = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_REGISTER_RECRUITER_NOT {
  m_iRecruiterUnitUID?: UidType;
  m_kRecruitUnitInfo?: KRecommendUserInfo;
}
export function createKEGS_REGISTER_RECRUITER_NOT(flags?: FlagInput): KEGS_REGISTER_RECRUITER_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_REGISTER_RECRUITER_NOT = {
  };
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) obj.m_iRecruiterUnitUID = 0n;
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) obj.m_kRecruitUnitInfo = createKRecommendUserInfo(f);
  return obj;
}
export function putKEGS_REGISTER_RECRUITER_NOT(ks: KSerializer, obj: KEGS_REGISTER_RECRUITER_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) {
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { if (!(ks.putInt64((obj.m_iRecruiterUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { if (!(ks.putUserClass((obj.m_kRecruitUnitInfo ?? createKRecommendUserInfo(f)), putKRecommendUserInfo, f))) return false; }
  }
  return true;
}
export function getKEGS_REGISTER_RECRUITER_NOT(ks: KSerializer, flags?: FlagInput): KEGS_REGISTER_RECRUITER_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_REGISTER_RECRUITER_NOT(f);
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) {
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { obj.m_iRecruiterUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { obj.m_kRecruitUnitInfo = ks.getUserClass(getKRecommendUserInfo, f); }
  }
  return obj;
}

export interface KEGS_GET_RECRUIT_RECRUITER_LIST_ACK {
  m_iOK?: Int32;
  m_vecRecruitUnitInfo?: KRecommendUserInfo[];
  m_vecRecruiterUnitInfo?: KRecommendUserInfo[];
}
export function createKEGS_GET_RECRUIT_RECRUITER_LIST_ACK(flags?: FlagInput): KEGS_GET_RECRUIT_RECRUITER_LIST_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_GET_RECRUIT_RECRUITER_LIST_ACK = {
  };
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) obj.m_iOK = 0;
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) obj.m_vecRecruitUnitInfo = ([] as KRecommendUserInfo[]);
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) obj.m_vecRecruiterUnitInfo = ([] as KRecommendUserInfo[]);
  return obj;
}
export function putKEGS_GET_RECRUIT_RECRUITER_LIST_ACK(ks: KSerializer, obj: KEGS_GET_RECRUIT_RECRUITER_LIST_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) {
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { if (!(ks.putVector((obj.m_vecRecruitUnitInfo ?? ([] as KRecommendUserInfo[])), (ks, item: KRecommendUserInfo) => ks.putUserClass(item, putKRecommendUserInfo, f)))) return false; }
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { if (!(ks.putVector((obj.m_vecRecruiterUnitInfo ?? ([] as KRecommendUserInfo[])), (ks, item: KRecommendUserInfo) => ks.putUserClass(item, putKRecommendUserInfo, f)))) return false; }
  }
  return true;
}
export function getKEGS_GET_RECRUIT_RECRUITER_LIST_ACK(ks: KSerializer, flags?: FlagInput): KEGS_GET_RECRUIT_RECRUITER_LIST_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_GET_RECRUIT_RECRUITER_LIST_ACK(f);
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) {
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { obj.m_vecRecruitUnitInfo = ks.getVector<KRecommendUserInfo>((ks) => ks.getUserClass(getKRecommendUserInfo, f)); }
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { obj.m_vecRecruiterUnitInfo = ks.getVector<KRecommendUserInfo>((ks) => ks.getUserClass(getKRecommendUserInfo, f)); }
  }
  return obj;
}

export interface KEGS_RECRUIT_RECRUITER_INFO_NOT {
  m_iSenderUnitUID?: UidType;
  m_cType?: Int8;
  m_iData?: Int32;
}
export function createKEGS_RECRUIT_RECRUITER_INFO_NOT(flags?: FlagInput): KEGS_RECRUIT_RECRUITER_INFO_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_RECRUIT_RECRUITER_INFO_NOT = {
  };
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) obj.m_iSenderUnitUID = 0n;
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) obj.m_cType = 0;
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) obj.m_iData = 0;
  return obj;
}
export function putKEGS_RECRUIT_RECRUITER_INFO_NOT(ks: KSerializer, obj: KEGS_RECRUIT_RECRUITER_INFO_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) {
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { if (!(ks.putInt64((obj.m_iSenderUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { if (!(ks.putInt8((obj.m_cType ?? 0)))) return false; }
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { if (!(ks.putInt32((obj.m_iData ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_RECRUIT_RECRUITER_INFO_NOT(ks: KSerializer, flags?: FlagInput): KEGS_RECRUIT_RECRUITER_INFO_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_RECRUIT_RECRUITER_INFO_NOT(f);
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) {
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { obj.m_iSenderUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { obj.m_cType = ks.getInt8(); }
    if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { obj.m_iData = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_GET_EVENT_INFO_ACK {
  m_iOK?: Int32;
  m_kEventCharacterRaking?: KEventCharacterRanking;
}
export function createKEGS_GET_EVENT_INFO_ACK(flags?: FlagInput): KEGS_GET_EVENT_INFO_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_GET_EVENT_INFO_ACK = {
  };
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) obj.m_iOK = 0;
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) obj.m_kEventCharacterRaking = createKEventCharacterRanking(f);
  return obj;
}
export function putKEGS_GET_EVENT_INFO_ACK(ks: KSerializer, obj: KEGS_GET_EVENT_INFO_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) {
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { if (!(ks.putUserClass((obj.m_kEventCharacterRaking ?? createKEventCharacterRanking(f)), putKEventCharacterRanking, f))) return false; }
  }
  return true;
}
export function getKEGS_GET_EVENT_INFO_ACK(ks: KSerializer, flags?: FlagInput): KEGS_GET_EVENT_INFO_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_GET_EVENT_INFO_ACK(f);
  if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) {
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_CHARACTER_QUEST_RANKING)) { obj.m_kEventCharacterRaking = ks.getUserClass(getKEventCharacterRanking, f); }
  }
  return obj;
}

export interface KEGS_EVENT_NOTE_VIEW_ACK {
  m_iOK?: Int32;
  m_iTitleID?: Int32;
  m_iNoteViewCount?: Int32;
}
export function createKEGS_EVENT_NOTE_VIEW_ACK(flags?: FlagInput): KEGS_EVENT_NOTE_VIEW_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_EVENT_NOTE_VIEW_ACK = {
  };
  if (Boolean(f.SERV_ELESIS_UPDATE_EVENT)) obj.m_iOK = 0;
  if (Boolean(f.SERV_ELESIS_UPDATE_EVENT)) obj.m_iTitleID = 0;
  if (Boolean(f.SERV_ELESIS_UPDATE_EVENT)) obj.m_iNoteViewCount = 0;
  return obj;
}
export function putKEGS_EVENT_NOTE_VIEW_ACK(ks: KSerializer, obj: KEGS_EVENT_NOTE_VIEW_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ELESIS_UPDATE_EVENT)) {
    if (Boolean(f.SERV_ELESIS_UPDATE_EVENT)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_ELESIS_UPDATE_EVENT)) { if (!(ks.putInt32((obj.m_iTitleID ?? 0)))) return false; }
    if (Boolean(f.SERV_ELESIS_UPDATE_EVENT)) { if (!(ks.putInt32((obj.m_iNoteViewCount ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_EVENT_NOTE_VIEW_ACK(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_NOTE_VIEW_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_EVENT_NOTE_VIEW_ACK(f);
  if (Boolean(f.SERV_ELESIS_UPDATE_EVENT)) {
    if (Boolean(f.SERV_ELESIS_UPDATE_EVENT)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_ELESIS_UPDATE_EVENT)) { obj.m_iTitleID = ks.getInt32(); }
    if (Boolean(f.SERV_ELESIS_UPDATE_EVENT)) { obj.m_iNoteViewCount = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_2013_EVENT_MISSION_COMPLETE_REQ {
  m_bLevelUpEvent?: boolean;
}
export function createKEGS_2013_EVENT_MISSION_COMPLETE_REQ(flags?: FlagInput): KEGS_2013_EVENT_MISSION_COMPLETE_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_2013_EVENT_MISSION_COMPLETE_REQ = {
  };
  if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) obj.m_bLevelUpEvent = false;
  return obj;
}
export function putKEGS_2013_EVENT_MISSION_COMPLETE_REQ(ks: KSerializer, obj: KEGS_2013_EVENT_MISSION_COMPLETE_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) {
    if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) { if (!(ks.putBool((obj.m_bLevelUpEvent ?? false)))) return false; }
  }
  return true;
}
export function getKEGS_2013_EVENT_MISSION_COMPLETE_REQ(ks: KSerializer, flags?: FlagInput): KEGS_2013_EVENT_MISSION_COMPLETE_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_2013_EVENT_MISSION_COMPLETE_REQ(f);
  if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) {
    if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) { obj.m_bLevelUpEvent = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_2013_EVENT_MISSION_COMPLETE_ACK {
  m_iOK?: Int32;
  m_iRewardedLevel?: Int32;
  m_vecInventorySlotInfo?: KInventoryItemInfo[];
}
export function createKEGS_2013_EVENT_MISSION_COMPLETE_ACK(flags?: FlagInput): KEGS_2013_EVENT_MISSION_COMPLETE_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_2013_EVENT_MISSION_COMPLETE_ACK = {
  };
  if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) obj.m_iOK = 0;
  if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) obj.m_iRewardedLevel = 0;
  if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) obj.m_vecInventorySlotInfo = ([] as KInventoryItemInfo[]);
  return obj;
}
export function putKEGS_2013_EVENT_MISSION_COMPLETE_ACK(ks: KSerializer, obj: KEGS_2013_EVENT_MISSION_COMPLETE_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) {
    if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) { if (!(ks.putInt32((obj.m_iRewardedLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) { if (!(ks.putVector((obj.m_vecInventorySlotInfo ?? ([] as KInventoryItemInfo[])), (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false; }
  }
  return true;
}
export function getKEGS_2013_EVENT_MISSION_COMPLETE_ACK(ks: KSerializer, flags?: FlagInput): KEGS_2013_EVENT_MISSION_COMPLETE_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_2013_EVENT_MISSION_COMPLETE_ACK(f);
  if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) {
    if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) { obj.m_iRewardedLevel = ks.getInt32(); }
    if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) { obj.m_vecInventorySlotInfo = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
  }
  return obj;
}

export interface KEGS_GLOBAL_MISSION_UPDATE_NOT {
  m_mapGlobalMissionInfo?: Map<string, KGlobalMissionInfo>;
}
export function createKEGS_GLOBAL_MISSION_UPDATE_NOT(flags?: FlagInput): KEGS_GLOBAL_MISSION_UPDATE_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_GLOBAL_MISSION_UPDATE_NOT = {
  };
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) obj.m_mapGlobalMissionInfo = new Map<string, KGlobalMissionInfo>();
  return obj;
}
export function putKEGS_GLOBAL_MISSION_UPDATE_NOT(ks: KSerializer, obj: KEGS_GLOBAL_MISSION_UPDATE_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) {
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { if (!(ks.putMap((obj.m_mapGlobalMissionInfo ?? new Map<string, KGlobalMissionInfo>()), (ks, k: string) => ks.putWString(k), (ks, v: KGlobalMissionInfo) => ks.putUserClass(v, putKGlobalMissionInfo, f)))) return false; }
  }
  return true;
}
export function getKEGS_GLOBAL_MISSION_UPDATE_NOT(ks: KSerializer, flags?: FlagInput): KEGS_GLOBAL_MISSION_UPDATE_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_GLOBAL_MISSION_UPDATE_NOT(f);
  if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) {
    if (Boolean(f.SERV_GLOBAL_MISSION_MANAGER)) { obj.m_mapGlobalMissionInfo = ks.getMap<string, KGlobalMissionInfo>((ks) => ks.getWString(), (ks) => ks.getUserClass(getKGlobalMissionInfo, f)); }
  }
  return obj;
}

export interface KEGS_UNLIMITED_SECOND_CHANGE_JOB_NOT {
  m_iUnlimitedSecondChangeJob?: Int32;
}
export function createKEGS_UNLIMITED_SECOND_CHANGE_JOB_NOT(flags?: FlagInput): KEGS_UNLIMITED_SECOND_CHANGE_JOB_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_UNLIMITED_SECOND_CHANGE_JOB_NOT = {
  };
  if (Boolean(f.SERV_UNLIMITED_SECOND_CHANGE_JOB)) obj.m_iUnlimitedSecondChangeJob = 0;
  return obj;
}
export function putKEGS_UNLIMITED_SECOND_CHANGE_JOB_NOT(ks: KSerializer, obj: KEGS_UNLIMITED_SECOND_CHANGE_JOB_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_UNLIMITED_SECOND_CHANGE_JOB)) {
    if (Boolean(f.SERV_UNLIMITED_SECOND_CHANGE_JOB)) { if (!(ks.putInt32((obj.m_iUnlimitedSecondChangeJob ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_UNLIMITED_SECOND_CHANGE_JOB_NOT(ks: KSerializer, flags?: FlagInput): KEGS_UNLIMITED_SECOND_CHANGE_JOB_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_UNLIMITED_SECOND_CHANGE_JOB_NOT(f);
  if (Boolean(f.SERV_UNLIMITED_SECOND_CHANGE_JOB)) {
    if (Boolean(f.SERV_UNLIMITED_SECOND_CHANGE_JOB)) { obj.m_iUnlimitedSecondChangeJob = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_START_CHECK_POWER_REQ {
  m_bStart?: boolean;
}
export function createKEGS_START_CHECK_POWER_REQ(flags?: FlagInput): KEGS_START_CHECK_POWER_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_START_CHECK_POWER_REQ = {
  };
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) obj.m_bStart = false;
  return obj;
}
export function putKEGS_START_CHECK_POWER_REQ(ks: KSerializer, obj: KEGS_START_CHECK_POWER_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) {
    if (Boolean(f.SERV_EVENT_CHECK_POWER)) { if (!(ks.putBool((obj.m_bStart ?? false)))) return false; }
  }
  return true;
}
export function getKEGS_START_CHECK_POWER_REQ(ks: KSerializer, flags?: FlagInput): KEGS_START_CHECK_POWER_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_START_CHECK_POWER_REQ(f);
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) {
    if (Boolean(f.SERV_EVENT_CHECK_POWER)) { obj.m_bStart = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_UPDATE_CHECK_POWER_NOT {
  m_ucCheckPowerCount?: UInt8;
  m_iCheckPowerTime?: Int64;
  m_ucCheckPowerScore?: UInt8;
}
export function createKEGS_UPDATE_CHECK_POWER_NOT(flags?: FlagInput): KEGS_UPDATE_CHECK_POWER_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_UPDATE_CHECK_POWER_NOT = {
  };
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) obj.m_ucCheckPowerCount = 0;
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) obj.m_iCheckPowerTime = 0n;
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) obj.m_ucCheckPowerScore = 0;
  return obj;
}
export function putKEGS_UPDATE_CHECK_POWER_NOT(ks: KSerializer, obj: KEGS_UPDATE_CHECK_POWER_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) {
    if (Boolean(f.SERV_EVENT_CHECK_POWER)) { if (!(ks.putUInt8((obj.m_ucCheckPowerCount ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_CHECK_POWER)) { if (!(ks.putInt64((obj.m_iCheckPowerTime ?? 0n)))) return false; }
    if (Boolean(f.SERV_EVENT_CHECK_POWER)) { if (!(ks.putUInt8((obj.m_ucCheckPowerScore ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_UPDATE_CHECK_POWER_NOT(ks: KSerializer, flags?: FlagInput): KEGS_UPDATE_CHECK_POWER_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_UPDATE_CHECK_POWER_NOT(f);
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) {
    if (Boolean(f.SERV_EVENT_CHECK_POWER)) { obj.m_ucCheckPowerCount = ks.getUInt8(); }
    if (Boolean(f.SERV_EVENT_CHECK_POWER)) { obj.m_iCheckPowerTime = ks.getInt64(); }
    if (Boolean(f.SERV_EVENT_CHECK_POWER)) { obj.m_ucCheckPowerScore = ks.getUInt8(); }
  }
  return obj;
}

export interface KEGS_SET_MULTIPLYER {
  fM?: Float32;
}
export function createKEGS_SET_MULTIPLYER(flags?: FlagInput): KEGS_SET_MULTIPLYER {
  const f = resolveFlags(flags);
  const obj: KEGS_SET_MULTIPLYER = {
  };
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) obj.fM = 0;
  return obj;
}
export function putKEGS_SET_MULTIPLYER(ks: KSerializer, obj: KEGS_SET_MULTIPLYER, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) {
    if (Boolean(f.SERV_EVENT_CHECK_POWER)) { if (!(ks.putFloat32((obj.fM ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_SET_MULTIPLYER(ks: KSerializer, flags?: FlagInput): KEGS_SET_MULTIPLYER {
  const f = resolveFlags(flags);
  const obj = createKEGS_SET_MULTIPLYER(f);
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) {
    if (Boolean(f.SERV_EVENT_CHECK_POWER)) { obj.fM = ks.getFloat32(); }
  }
  return obj;
}

export interface KEGS_BUY_UI_SETTING_REQ {
  m_iTimeControlItemType?: Int32;
  m_iHouseID?: Int32;
}
export function createKEGS_BUY_UI_SETTING_REQ(flags?: FlagInput): KEGS_BUY_UI_SETTING_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_BUY_UI_SETTING_REQ = {
  };
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) obj.m_iTimeControlItemType = 0;
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) obj.m_iHouseID = 0;
  return obj;
}
export function putKEGS_BUY_UI_SETTING_REQ(ks: KSerializer, obj: KEGS_BUY_UI_SETTING_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) {
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { if (!(ks.putInt32((obj.m_iTimeControlItemType ?? 0)))) return false; }
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { if (!(ks.putInt32((obj.m_iHouseID ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_BUY_UI_SETTING_REQ(ks: KSerializer, flags?: FlagInput): KEGS_BUY_UI_SETTING_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_BUY_UI_SETTING_REQ(f);
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) {
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { obj.m_iTimeControlItemType = ks.getInt32(); }
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { obj.m_iHouseID = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_BUY_UI_SETTING_ACK {
  m_iOK?: Int32;
  m_setGetItemOnOff?: Set<Int32>;
  m_iHouseID?: Int32;
  m_iTimeControlItemType?: Int32;
}
export function createKEGS_BUY_UI_SETTING_ACK(flags?: FlagInput): KEGS_BUY_UI_SETTING_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_BUY_UI_SETTING_ACK = {
  };
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) obj.m_iOK = 0;
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) obj.m_setGetItemOnOff = new Set<Int32>();
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) obj.m_iHouseID = 0;
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) obj.m_iTimeControlItemType = 0;
  return obj;
}
export function putKEGS_BUY_UI_SETTING_ACK(ks: KSerializer, obj: KEGS_BUY_UI_SETTING_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) {
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { if (!(ks.putSet((obj.m_setGetItemOnOff ?? new Set<Int32>()), (ks, item: Int32) => ks.putInt32(item)))) return false; }
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { if (!(ks.putInt32((obj.m_iHouseID ?? 0)))) return false; }
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { if (!(ks.putInt32((obj.m_iTimeControlItemType ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_BUY_UI_SETTING_ACK(ks: KSerializer, flags?: FlagInput): KEGS_BUY_UI_SETTING_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_BUY_UI_SETTING_ACK(f);
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) {
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { obj.m_setGetItemOnOff = ks.getSet<Int32>((ks) => ks.getInt32()); }
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { obj.m_iHouseID = ks.getInt32(); }
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { obj.m_iTimeControlItemType = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_GET_TIME_CONTROL_ITME_TALK_LIST_ACK {
  m_mapGetItemOnOff?: Map<Int32, KPacketGetItemOnOff[]>;
}
export function createKEGS_GET_TIME_CONTROL_ITME_TALK_LIST_ACK(flags?: FlagInput): KEGS_GET_TIME_CONTROL_ITME_TALK_LIST_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_GET_TIME_CONTROL_ITME_TALK_LIST_ACK = {
  };
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) obj.m_mapGetItemOnOff = new Map<Int32, KPacketGetItemOnOff[]>();
  return obj;
}
export function putKEGS_GET_TIME_CONTROL_ITME_TALK_LIST_ACK(ks: KSerializer, obj: KEGS_GET_TIME_CONTROL_ITME_TALK_LIST_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) {
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { if (!(ks.putMap((obj.m_mapGetItemOnOff ?? new Map<Int32, KPacketGetItemOnOff[]>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: KPacketGetItemOnOff[]) => ks.putVector(v, (ks, item: KPacketGetItemOnOff) => ks.putUserClass(item, putKPacketGetItemOnOff, f))))) return false; }
  }
  return true;
}
export function getKEGS_GET_TIME_CONTROL_ITME_TALK_LIST_ACK(ks: KSerializer, flags?: FlagInput): KEGS_GET_TIME_CONTROL_ITME_TALK_LIST_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_GET_TIME_CONTROL_ITME_TALK_LIST_ACK(f);
  if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) {
    if (Boolean(f.SERV_ITEM_ACTION_BY_DBTIME_SETTING)) { obj.m_mapGetItemOnOff = ks.getMap<Int32, KPacketGetItemOnOff[]>((ks) => ks.getInt32(), (ks) => ks.getVector<KPacketGetItemOnOff>((ks) => ks.getUserClass(getKPacketGetItemOnOff, f))); }
  }
  return obj;
}

export interface KEGS_EVENT_CHUNG_GIVE_ITEM_NOT {
  m_bGiveItemGet?: boolean;
  m_wstrToolTipTime?: string;
  m_cGetUnitClass?: Int8;
  m_bTwoGiveItem?: boolean;
}
export function createKEGS_EVENT_CHUNG_GIVE_ITEM_NOT(flags?: FlagInput): KEGS_EVENT_CHUNG_GIVE_ITEM_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_EVENT_CHUNG_GIVE_ITEM_NOT = {
  };
  if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) obj.m_bGiveItemGet = false;
  if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) obj.m_wstrToolTipTime = '';
  if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) obj.m_cGetUnitClass = 0;
  if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) obj.m_bTwoGiveItem = false;
  return obj;
}
export function putKEGS_EVENT_CHUNG_GIVE_ITEM_NOT(ks: KSerializer, obj: KEGS_EVENT_CHUNG_GIVE_ITEM_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) {
    if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) { if (!(ks.putBool((obj.m_bGiveItemGet ?? false)))) return false; }
    if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) { if (!(ks.putWString((obj.m_wstrToolTipTime ?? '')))) return false; }
    if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) { if (!(ks.putInt8((obj.m_cGetUnitClass ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) { if (!(ks.putBool((obj.m_bTwoGiveItem ?? false)))) return false; }
  }
  return true;
}
export function getKEGS_EVENT_CHUNG_GIVE_ITEM_NOT(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_CHUNG_GIVE_ITEM_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_EVENT_CHUNG_GIVE_ITEM_NOT(f);
  if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) {
    if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) { obj.m_bGiveItemGet = ks.getBool(); }
    if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) { obj.m_wstrToolTipTime = ks.getWString(); }
    if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) { obj.m_cGetUnitClass = ks.getInt8(); }
    if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) { obj.m_bTwoGiveItem = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_EVENT_CHUNG_GIVE_ITEM_REQ {
  iChoice?: Int32;
  bTwoGiveItem?: boolean;
}
export function createKEGS_EVENT_CHUNG_GIVE_ITEM_REQ(flags?: FlagInput): KEGS_EVENT_CHUNG_GIVE_ITEM_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_EVENT_CHUNG_GIVE_ITEM_REQ = {
  };
  if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) obj.iChoice = 0;
  if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) obj.bTwoGiveItem = false;
  return obj;
}
export function putKEGS_EVENT_CHUNG_GIVE_ITEM_REQ(ks: KSerializer, obj: KEGS_EVENT_CHUNG_GIVE_ITEM_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) {
    if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) { if (!(ks.putInt32((obj.iChoice ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) { if (!(ks.putBool((obj.bTwoGiveItem ?? false)))) return false; }
  }
  return true;
}
export function getKEGS_EVENT_CHUNG_GIVE_ITEM_REQ(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_CHUNG_GIVE_ITEM_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_EVENT_CHUNG_GIVE_ITEM_REQ(f);
  if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) {
    if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) { obj.iChoice = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) { obj.bTwoGiveItem = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_EVENT_CHUNG_GIVE_ITEM_ACK {
  m_iOK?: Int32;
  m_wstrGetItemTime?: string;
}
export function createKEGS_EVENT_CHUNG_GIVE_ITEM_ACK(flags?: FlagInput): KEGS_EVENT_CHUNG_GIVE_ITEM_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_EVENT_CHUNG_GIVE_ITEM_ACK = {
  };
  if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) obj.m_iOK = 0;
  if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) obj.m_wstrGetItemTime = ' ';
  return obj;
}
export function putKEGS_EVENT_CHUNG_GIVE_ITEM_ACK(ks: KSerializer, obj: KEGS_EVENT_CHUNG_GIVE_ITEM_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) {
    if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) { if (!(ks.putWString((obj.m_wstrGetItemTime ?? ' ')))) return false; }
  }
  return true;
}
export function getKEGS_EVENT_CHUNG_GIVE_ITEM_ACK(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_CHUNG_GIVE_ITEM_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_EVENT_CHUNG_GIVE_ITEM_ACK(f);
  if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) {
    if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_CHUNG_GIVE_ITEM)) { obj.m_wstrGetItemTime = ks.getWString(); }
  }
  return obj;
}

export interface KEGS_EVENT_COBO_DUNGEON_FIELD_NOT {
  m_StartButtonUI?: boolean;
  m_DungeonCountUI?: boolean;
  m_FieldCountUI?: boolean;
  m_DungeonCount?: Int32;
  m_FieldMonsterKillCount?: Int32;
  m_iOk?: Int32;
  m_iRemaindTime?: Int32;
  m_tPushTime?: Int64;
}
export function createKEGS_EVENT_COBO_DUNGEON_FIELD_NOT(flags?: FlagInput): KEGS_EVENT_COBO_DUNGEON_FIELD_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_EVENT_COBO_DUNGEON_FIELD_NOT = {
  };
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_StartButtonUI = false;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_DungeonCountUI = false;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_FieldCountUI = false;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_DungeonCount = 0;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_FieldMonsterKillCount = 0;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_iOk = 0;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_iRemaindTime = -1;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_tPushTime = 0n;
  return obj;
}
export function putKEGS_EVENT_COBO_DUNGEON_FIELD_NOT(ks: KSerializer, obj: KEGS_EVENT_COBO_DUNGEON_FIELD_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) {
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putBool((obj.m_StartButtonUI ?? false)))) return false; }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putBool((obj.m_DungeonCountUI ?? false)))) return false; }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putBool((obj.m_FieldCountUI ?? false)))) return false; }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putInt32((obj.m_DungeonCount ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putInt32((obj.m_FieldMonsterKillCount ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putInt32((obj.m_iOk ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putInt32((obj.m_iRemaindTime ?? -1)))) return false; }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putInt64((obj.m_tPushTime ?? 0n)))) return false; }
  }
  return true;
}
export function getKEGS_EVENT_COBO_DUNGEON_FIELD_NOT(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_COBO_DUNGEON_FIELD_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_EVENT_COBO_DUNGEON_FIELD_NOT(f);
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) {
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_StartButtonUI = ks.getBool(); }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_DungeonCountUI = ks.getBool(); }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_FieldCountUI = ks.getBool(); }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_DungeonCount = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_FieldMonsterKillCount = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_iOk = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_iRemaindTime = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_tPushTime = ks.getInt64(); }
  }
  return obj;
}

export interface KEGS_EVENT_COBO_DUNGEON_FIELD_REQ {
  m_iOK?: Int32;
  m_EventStart?: boolean;
}
export function createKEGS_EVENT_COBO_DUNGEON_FIELD_REQ(flags?: FlagInput): KEGS_EVENT_COBO_DUNGEON_FIELD_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_EVENT_COBO_DUNGEON_FIELD_REQ = {
  };
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_iOK = 0;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_EventStart = false;
  return obj;
}
export function putKEGS_EVENT_COBO_DUNGEON_FIELD_REQ(ks: KSerializer, obj: KEGS_EVENT_COBO_DUNGEON_FIELD_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) {
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putBool((obj.m_EventStart ?? false)))) return false; }
  }
  return true;
}
export function getKEGS_EVENT_COBO_DUNGEON_FIELD_REQ(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_COBO_DUNGEON_FIELD_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_EVENT_COBO_DUNGEON_FIELD_REQ(f);
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) {
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_EventStart = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_EVENT_COBO_DUNGEON_FIELD_ACK {
  m_bStartUI?: boolean;
  m_DungeonCountUI?: boolean;
  m_FieldCountUI?: boolean;
  m_DungeonCount?: Int32;
  m_FieldMonsterKillCount?: Int32;
  m_iOK?: Int32;
  m_iRemaindTime?: Int32;
  m_wstrPushTime?: string;
  m_tPushTime?: Int64;
}
export function createKEGS_EVENT_COBO_DUNGEON_FIELD_ACK(flags?: FlagInput): KEGS_EVENT_COBO_DUNGEON_FIELD_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_EVENT_COBO_DUNGEON_FIELD_ACK = {
  };
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_bStartUI = false;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_DungeonCountUI = false;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_FieldCountUI = false;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_DungeonCount = 0;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_FieldMonsterKillCount = 0;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_iOK = 0;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_iRemaindTime = -1;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_wstrPushTime = '';
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_tPushTime = 0n;
  return obj;
}
export function putKEGS_EVENT_COBO_DUNGEON_FIELD_ACK(ks: KSerializer, obj: KEGS_EVENT_COBO_DUNGEON_FIELD_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) {
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putBool((obj.m_bStartUI ?? false)))) return false; }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putBool((obj.m_DungeonCountUI ?? false)))) return false; }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putBool((obj.m_FieldCountUI ?? false)))) return false; }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putInt32((obj.m_DungeonCount ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putInt32((obj.m_FieldMonsterKillCount ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putInt32((obj.m_iRemaindTime ?? -1)))) return false; }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putWString((obj.m_wstrPushTime ?? '')))) return false; }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putInt64((obj.m_tPushTime ?? 0n)))) return false; }
  }
  return true;
}
export function getKEGS_EVENT_COBO_DUNGEON_FIELD_ACK(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_COBO_DUNGEON_FIELD_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_EVENT_COBO_DUNGEON_FIELD_ACK(f);
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) {
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_bStartUI = ks.getBool(); }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_DungeonCountUI = ks.getBool(); }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_FieldCountUI = ks.getBool(); }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_DungeonCount = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_FieldMonsterKillCount = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_iRemaindTime = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_wstrPushTime = ks.getWString(); }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_tPushTime = ks.getInt64(); }
  }
  return obj;
}

export interface KEGS_EVENT_COBO_DUNGEON_CLEAR_COUNT_NOT {
  m_iDungeonClearCount?: Int32;
}
export function createKEGS_EVENT_COBO_DUNGEON_CLEAR_COUNT_NOT(flags?: FlagInput): KEGS_EVENT_COBO_DUNGEON_CLEAR_COUNT_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_EVENT_COBO_DUNGEON_CLEAR_COUNT_NOT = {
  };
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_iDungeonClearCount = 0;
  return obj;
}
export function putKEGS_EVENT_COBO_DUNGEON_CLEAR_COUNT_NOT(ks: KSerializer, obj: KEGS_EVENT_COBO_DUNGEON_CLEAR_COUNT_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) {
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putInt32((obj.m_iDungeonClearCount ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_EVENT_COBO_DUNGEON_CLEAR_COUNT_NOT(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_COBO_DUNGEON_CLEAR_COUNT_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_EVENT_COBO_DUNGEON_CLEAR_COUNT_NOT(f);
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) {
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_iDungeonClearCount = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_EVENT_COBO_FIELD_MONSTER_KILL_NOT {
  m_iFieldMonsterKillCount?: Int32;
}
export function createKEGS_EVENT_COBO_FIELD_MONSTER_KILL_NOT(flags?: FlagInput): KEGS_EVENT_COBO_FIELD_MONSTER_KILL_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_EVENT_COBO_FIELD_MONSTER_KILL_NOT = {
  };
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_iFieldMonsterKillCount = 0;
  return obj;
}
export function putKEGS_EVENT_COBO_FIELD_MONSTER_KILL_NOT(ks: KSerializer, obj: KEGS_EVENT_COBO_FIELD_MONSTER_KILL_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) {
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putInt32((obj.m_iFieldMonsterKillCount ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_EVENT_COBO_FIELD_MONSTER_KILL_NOT(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_COBO_FIELD_MONSTER_KILL_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_EVENT_COBO_FIELD_MONSTER_KILL_NOT(f);
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) {
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_iFieldMonsterKillCount = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_EVENT_COBO_ITEM_GIVE_CHEAT_NOT {
  m_CoboEventITemGet?: boolean;
  m_bNextDay?: boolean;
}
export function createKEGS_EVENT_COBO_ITEM_GIVE_CHEAT_NOT(flags?: FlagInput): KEGS_EVENT_COBO_ITEM_GIVE_CHEAT_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_EVENT_COBO_ITEM_GIVE_CHEAT_NOT = {
  };
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_CoboEventITemGet = false;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_bNextDay = false;
  return obj;
}
export function putKEGS_EVENT_COBO_ITEM_GIVE_CHEAT_NOT(ks: KSerializer, obj: KEGS_EVENT_COBO_ITEM_GIVE_CHEAT_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) {
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putBool((obj.m_CoboEventITemGet ?? false)))) return false; }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putBool((obj.m_bNextDay ?? false)))) return false; }
  }
  return true;
}
export function getKEGS_EVENT_COBO_ITEM_GIVE_CHEAT_NOT(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_COBO_ITEM_GIVE_CHEAT_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_EVENT_COBO_ITEM_GIVE_CHEAT_NOT(f);
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) {
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_CoboEventITemGet = ks.getBool(); }
    if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_bNextDay = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_NOT {
  m_iValentineItemCount?: Int32;
}
export function createKEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_NOT(flags?: FlagInput): KEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_NOT = {
  };
  if (Boolean(f.SERV_EVENT_VALENTINE_DUNGEON_GIVE_ITEM)) obj.m_iValentineItemCount = -1;
  return obj;
}
export function putKEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_NOT(ks: KSerializer, obj: KEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_VALENTINE_DUNGEON_GIVE_ITEM)) {
    if (Boolean(f.SERV_EVENT_VALENTINE_DUNGEON_GIVE_ITEM)) { if (!(ks.putInt32((obj.m_iValentineItemCount ?? -1)))) return false; }
  }
  return true;
}
export function getKEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_NOT(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_NOT(f);
  if (Boolean(f.SERV_EVENT_VALENTINE_DUNGEON_GIVE_ITEM)) {
    if (Boolean(f.SERV_EVENT_VALENTINE_DUNGEON_GIVE_ITEM)) { obj.m_iValentineItemCount = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_CHEAT_NOT {
  m_iValentineItemCount?: Int32;
}
export function createKEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_CHEAT_NOT(flags?: FlagInput): KEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_CHEAT_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_CHEAT_NOT = {
  };
  if (Boolean(f.SERV_EVENT_VALENTINE_DUNGEON_GIVE_ITEM)) obj.m_iValentineItemCount = -1;
  return obj;
}
export function putKEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_CHEAT_NOT(ks: KSerializer, obj: KEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_CHEAT_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_VALENTINE_DUNGEON_GIVE_ITEM)) {
    if (Boolean(f.SERV_EVENT_VALENTINE_DUNGEON_GIVE_ITEM)) { if (!(ks.putInt32((obj.m_iValentineItemCount ?? -1)))) return false; }
  }
  return true;
}
export function getKEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_CHEAT_NOT(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_CHEAT_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_EVENT_VALENTINE_DUNGEON_GIVE_ITEM_CHEAT_NOT(f);
  if (Boolean(f.SERV_EVENT_VALENTINE_DUNGEON_GIVE_ITEM)) {
    if (Boolean(f.SERV_EVENT_VALENTINE_DUNGEON_GIVE_ITEM)) { obj.m_iValentineItemCount = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_CASH_DIRECT_CHARGE_CN_REQ {
  m_iUserUID?: UidType;
}
export function createKEGS_CASH_DIRECT_CHARGE_CN_REQ(flags?: FlagInput): KEGS_CASH_DIRECT_CHARGE_CN_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_CASH_DIRECT_CHARGE_CN_REQ = {
  };
  if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) obj.m_iUserUID = 0n;
  return obj;
}
export function putKEGS_CASH_DIRECT_CHARGE_CN_REQ(ks: KSerializer, obj: KEGS_CASH_DIRECT_CHARGE_CN_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) {
    if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) { if (!(ks.putInt64((obj.m_iUserUID ?? 0n)))) return false; }
  }
  return true;
}
export function getKEGS_CASH_DIRECT_CHARGE_CN_REQ(ks: KSerializer, flags?: FlagInput): KEGS_CASH_DIRECT_CHARGE_CN_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_CASH_DIRECT_CHARGE_CN_REQ(f);
  if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) {
    if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) { obj.m_iUserUID = ks.getInt64(); }
  }
  return obj;
}

export interface KEGS_CASH_DIRECT_CHARGE_CN_ACK {
  m_iOK?: Int32;
  m_wstrToken?: string;
}
export function createKEGS_CASH_DIRECT_CHARGE_CN_ACK(flags?: FlagInput): KEGS_CASH_DIRECT_CHARGE_CN_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_CASH_DIRECT_CHARGE_CN_ACK = {
  };
  if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) obj.m_iOK = 0;
  if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) obj.m_wstrToken = '';
  return obj;
}
export function putKEGS_CASH_DIRECT_CHARGE_CN_ACK(ks: KSerializer, obj: KEGS_CASH_DIRECT_CHARGE_CN_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) {
    if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) { if (!(ks.putWString((obj.m_wstrToken ?? '')))) return false; }
  }
  return true;
}
export function getKEGS_CASH_DIRECT_CHARGE_CN_ACK(ks: KSerializer, flags?: FlagInput): KEGS_CASH_DIRECT_CHARGE_CN_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_CASH_DIRECT_CHARGE_CN_ACK(f);
  if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) {
    if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) { obj.m_wstrToken = ks.getWString(); }
  }
  return obj;
}

export interface KEGS_CASH_DIRECT_CHARGE_CN_NOT {
  m_iOK?: Int32;
}
export function createKEGS_CASH_DIRECT_CHARGE_CN_NOT(flags?: FlagInput): KEGS_CASH_DIRECT_CHARGE_CN_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_CASH_DIRECT_CHARGE_CN_NOT = {
  };
  if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) obj.m_iOK = 0;
  return obj;
}
export function putKEGS_CASH_DIRECT_CHARGE_CN_NOT(ks: KSerializer, obj: KEGS_CASH_DIRECT_CHARGE_CN_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) {
    if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_CASH_DIRECT_CHARGE_CN_NOT(ks: KSerializer, flags?: FlagInput): KEGS_CASH_DIRECT_CHARGE_CN_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_CASH_DIRECT_CHARGE_CN_NOT(f);
  if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) {
    if (Boolean(f.SERV_DIRECT_CHARGE_ELSWORD_CASH)) { obj.m_iOK = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_MANUFACTURE_PERIOD_SETTING_REQ {
  m_iHouseID?: Int32;
}
export function createKEGS_MANUFACTURE_PERIOD_SETTING_REQ(flags?: FlagInput): KEGS_MANUFACTURE_PERIOD_SETTING_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_MANUFACTURE_PERIOD_SETTING_REQ = {
  };
  if (Boolean(f.SERV_MANUFACTURE_PERIOD_FIX)) obj.m_iHouseID = 0;
  return obj;
}
export function putKEGS_MANUFACTURE_PERIOD_SETTING_REQ(ks: KSerializer, obj: KEGS_MANUFACTURE_PERIOD_SETTING_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_MANUFACTURE_PERIOD_FIX)) {
    if (Boolean(f.SERV_MANUFACTURE_PERIOD_FIX)) { if (!(ks.putInt32((obj.m_iHouseID ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_MANUFACTURE_PERIOD_SETTING_REQ(ks: KSerializer, flags?: FlagInput): KEGS_MANUFACTURE_PERIOD_SETTING_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_MANUFACTURE_PERIOD_SETTING_REQ(f);
  if (Boolean(f.SERV_MANUFACTURE_PERIOD_FIX)) {
    if (Boolean(f.SERV_MANUFACTURE_PERIOD_FIX)) { obj.m_iHouseID = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_MANUFACTURE_PERIOD_SETTING_ACK {
  m_iOK?: Int32;
  m_mapPeriodGroup?: Map<Int32, Int32>;
  m_iHouseID?: Int32;
}
export function createKEGS_MANUFACTURE_PERIOD_SETTING_ACK(flags?: FlagInput): KEGS_MANUFACTURE_PERIOD_SETTING_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_MANUFACTURE_PERIOD_SETTING_ACK = {
  };
  if (Boolean(f.SERV_MANUFACTURE_PERIOD_FIX)) obj.m_iOK = 0;
  if (Boolean(f.SERV_MANUFACTURE_PERIOD_FIX)) obj.m_mapPeriodGroup = new Map<Int32, Int32>();
  if (Boolean(f.SERV_MANUFACTURE_PERIOD_FIX)) obj.m_iHouseID = 0;
  return obj;
}
export function putKEGS_MANUFACTURE_PERIOD_SETTING_ACK(ks: KSerializer, obj: KEGS_MANUFACTURE_PERIOD_SETTING_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_MANUFACTURE_PERIOD_FIX)) {
    if (Boolean(f.SERV_MANUFACTURE_PERIOD_FIX)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_MANUFACTURE_PERIOD_FIX)) { if (!(ks.putMap((obj.m_mapPeriodGroup ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (Boolean(f.SERV_MANUFACTURE_PERIOD_FIX)) { if (!(ks.putInt32((obj.m_iHouseID ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_MANUFACTURE_PERIOD_SETTING_ACK(ks: KSerializer, flags?: FlagInput): KEGS_MANUFACTURE_PERIOD_SETTING_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_MANUFACTURE_PERIOD_SETTING_ACK(f);
  if (Boolean(f.SERV_MANUFACTURE_PERIOD_FIX)) {
    if (Boolean(f.SERV_MANUFACTURE_PERIOD_FIX)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_MANUFACTURE_PERIOD_FIX)) { obj.m_mapPeriodGroup = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
    if (Boolean(f.SERV_MANUFACTURE_PERIOD_FIX)) { obj.m_iHouseID = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_4TH_ANNIV_EVENT_REWARD_REQ {
  m_iSeletedIndex?: Int32;
}
export function createKEGS_4TH_ANNIV_EVENT_REWARD_REQ(flags?: FlagInput): KEGS_4TH_ANNIV_EVENT_REWARD_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_4TH_ANNIV_EVENT_REWARD_REQ = {
  };
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_iSeletedIndex = 0;
  return obj;
}
export function putKEGS_4TH_ANNIV_EVENT_REWARD_REQ(ks: KSerializer, obj: KEGS_4TH_ANNIV_EVENT_REWARD_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) {
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putInt32((obj.m_iSeletedIndex ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_4TH_ANNIV_EVENT_REWARD_REQ(ks: KSerializer, flags?: FlagInput): KEGS_4TH_ANNIV_EVENT_REWARD_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_4TH_ANNIV_EVENT_REWARD_REQ(f);
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) {
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_iSeletedIndex = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_4TH_ANNIV_EVENT_REWARD_ACK {
  m_iOK?: Int32;
  m_iSeletedIndex?: Int32;
}
export function createKEGS_4TH_ANNIV_EVENT_REWARD_ACK(flags?: FlagInput): KEGS_4TH_ANNIV_EVENT_REWARD_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_4TH_ANNIV_EVENT_REWARD_ACK = {
  };
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_iOK = 0;
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_iSeletedIndex = 0;
  return obj;
}
export function putKEGS_4TH_ANNIV_EVENT_REWARD_ACK(ks: KSerializer, obj: KEGS_4TH_ANNIV_EVENT_REWARD_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) {
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putInt32((obj.m_iSeletedIndex ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_4TH_ANNIV_EVENT_REWARD_ACK(ks: KSerializer, flags?: FlagInput): KEGS_4TH_ANNIV_EVENT_REWARD_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_4TH_ANNIV_EVENT_REWARD_ACK(f);
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) {
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_iSeletedIndex = ks.getInt32(); }
  }
  return obj;
}

export type KEGS_BILL_GET_PURCHASED_CASH_ITEM_ACK = KEGS_GET_PURCHASED_CASH_ITEM_ACK;
export function createKEGS_BILL_GET_PURCHASED_CASH_ITEM_ACK(flags?: FlagInput): KEGS_BILL_GET_PURCHASED_CASH_ITEM_ACK {
  const f = resolveFlags(flags);
  return createKEGS_GET_PURCHASED_CASH_ITEM_ACK(f);
}
export function putKEGS_BILL_GET_PURCHASED_CASH_ITEM_ACK(ks: KSerializer, obj: KEGS_BILL_GET_PURCHASED_CASH_ITEM_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_GET_PURCHASED_CASH_ITEM_ACK, f);
}
export function getKEGS_BILL_GET_PURCHASED_CASH_ITEM_ACK(ks: KSerializer, flags?: FlagInput): KEGS_BILL_GET_PURCHASED_CASH_ITEM_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_GET_PURCHASED_CASH_ITEM_ACK, f);
}

export type KEGS_NPROTECT_CSAUTH3_RESPONE_NOT = KEGS_NPROTECT_CSAUTH3_CHECK_NOT;
export function createKEGS_NPROTECT_CSAUTH3_RESPONE_NOT(flags?: FlagInput): KEGS_NPROTECT_CSAUTH3_RESPONE_NOT {
  const f = resolveFlags(flags);
  return createKEGS_NPROTECT_CSAUTH3_CHECK_NOT(f);
}
export function putKEGS_NPROTECT_CSAUTH3_RESPONE_NOT(ks: KSerializer, obj: KEGS_NPROTECT_CSAUTH3_RESPONE_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_NPROTECT_CSAUTH3_CHECK_NOT, f);
}
export function getKEGS_NPROTECT_CSAUTH3_RESPONE_NOT(ks: KSerializer, flags?: FlagInput): KEGS_NPROTECT_CSAUTH3_RESPONE_NOT {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_NPROTECT_CSAUTH3_CHECK_NOT, f);
}

export type KEGS_NPROTECT_CSAUTH3_GAMEHACK_REPORT_NOT = KEGS_NPROTECT_CSAUTH3_CHECK_NOT;
export function createKEGS_NPROTECT_CSAUTH3_GAMEHACK_REPORT_NOT(flags?: FlagInput): KEGS_NPROTECT_CSAUTH3_GAMEHACK_REPORT_NOT {
  const f = resolveFlags(flags);
  return createKEGS_NPROTECT_CSAUTH3_CHECK_NOT(f);
}
export function putKEGS_NPROTECT_CSAUTH3_GAMEHACK_REPORT_NOT(ks: KSerializer, obj: KEGS_NPROTECT_CSAUTH3_GAMEHACK_REPORT_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_NPROTECT_CSAUTH3_CHECK_NOT, f);
}
export function getKEGS_NPROTECT_CSAUTH3_GAMEHACK_REPORT_NOT(ks: KSerializer, flags?: FlagInput): KEGS_NPROTECT_CSAUTH3_GAMEHACK_REPORT_NOT {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_NPROTECT_CSAUTH3_CHECK_NOT, f);
}

export type KECH_GET_SERVERGROUP_LIST_ACK = KPacketOK;
export function createKECH_GET_SERVERGROUP_LIST_ACK(flags?: FlagInput): KECH_GET_SERVERGROUP_LIST_ACK {
  const f = resolveFlags(flags);
  return createKPacketOK(f);
}
export function putKECH_GET_SERVERGROUP_LIST_ACK(ks: KSerializer, obj: KECH_GET_SERVERGROUP_LIST_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKPacketOK, f);
}
export function getKECH_GET_SERVERGROUP_LIST_ACK(ks: KSerializer, flags?: FlagInput): KECH_GET_SERVERGROUP_LIST_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKPacketOK, f);
}

export type KEGS_SHARE_BANK_UPDATE_OK_NOT = KPacketOK;
export function createKEGS_SHARE_BANK_UPDATE_OK_NOT(flags?: FlagInput): KEGS_SHARE_BANK_UPDATE_OK_NOT {
  const f = resolveFlags(flags);
  return createKPacketOK(f);
}
export function putKEGS_SHARE_BANK_UPDATE_OK_NOT(ks: KSerializer, obj: KEGS_SHARE_BANK_UPDATE_OK_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKPacketOK, f);
}
export function getKEGS_SHARE_BANK_UPDATE_OK_NOT(ks: KSerializer, flags?: FlagInput): KEGS_SHARE_BANK_UPDATE_OK_NOT {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKPacketOK, f);
}

export type KEGS_ADVERTISEMENT_EVENT_INFO_NOT = KEGS_TIME_EVENT_INFO_NOT;
export function createKEGS_ADVERTISEMENT_EVENT_INFO_NOT(flags?: FlagInput): KEGS_ADVERTISEMENT_EVENT_INFO_NOT {
  const f = resolveFlags(flags);
  return createKEGS_TIME_EVENT_INFO_NOT(f);
}
export function putKEGS_ADVERTISEMENT_EVENT_INFO_NOT(ks: KSerializer, obj: KEGS_ADVERTISEMENT_EVENT_INFO_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_TIME_EVENT_INFO_NOT, f);
}
export function getKEGS_ADVERTISEMENT_EVENT_INFO_NOT(ks: KSerializer, flags?: FlagInput): KEGS_ADVERTISEMENT_EVENT_INFO_NOT {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_TIME_EVENT_INFO_NOT, f);
}

export type KEGS_SHOW_DISCONNECT_REASON_NOT = KPacketOK;
export function createKEGS_SHOW_DISCONNECT_REASON_NOT(flags?: FlagInput): KEGS_SHOW_DISCONNECT_REASON_NOT {
  const f = resolveFlags(flags);
  return createKPacketOK(f);
}
export function putKEGS_SHOW_DISCONNECT_REASON_NOT(ks: KSerializer, obj: KEGS_SHOW_DISCONNECT_REASON_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKPacketOK, f);
}
export function getKEGS_SHOW_DISCONNECT_REASON_NOT(ks: KSerializer, flags?: FlagInput): KEGS_SHOW_DISCONNECT_REASON_NOT {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKPacketOK, f);
}

export type KEGS_GET_GUILD_SKILL_IN_INVITE_GUILD_LIST_REQ = KEGS_GET_GUILD_SKILL_IN_BOARD_REQ;
export function createKEGS_GET_GUILD_SKILL_IN_INVITE_GUILD_LIST_REQ(flags?: FlagInput): KEGS_GET_GUILD_SKILL_IN_INVITE_GUILD_LIST_REQ {
  const f = resolveFlags(flags);
  return createKEGS_GET_GUILD_SKILL_IN_BOARD_REQ(f);
}
export function putKEGS_GET_GUILD_SKILL_IN_INVITE_GUILD_LIST_REQ(ks: KSerializer, obj: KEGS_GET_GUILD_SKILL_IN_INVITE_GUILD_LIST_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_GET_GUILD_SKILL_IN_BOARD_REQ, f);
}
export function getKEGS_GET_GUILD_SKILL_IN_INVITE_GUILD_LIST_REQ(ks: KSerializer, flags?: FlagInput): KEGS_GET_GUILD_SKILL_IN_INVITE_GUILD_LIST_REQ {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_GET_GUILD_SKILL_IN_BOARD_REQ, f);
}

export type KEGS_GET_GUILD_SKILL_IN_INVITE_GUILD_LIST_ACK = KEGS_GET_GUILD_SKILL_IN_BOARD_ACK;
export function createKEGS_GET_GUILD_SKILL_IN_INVITE_GUILD_LIST_ACK(flags?: FlagInput): KEGS_GET_GUILD_SKILL_IN_INVITE_GUILD_LIST_ACK {
  const f = resolveFlags(flags);
  return createKEGS_GET_GUILD_SKILL_IN_BOARD_ACK(f);
}
export function putKEGS_GET_GUILD_SKILL_IN_INVITE_GUILD_LIST_ACK(ks: KSerializer, obj: KEGS_GET_GUILD_SKILL_IN_INVITE_GUILD_LIST_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_GET_GUILD_SKILL_IN_BOARD_ACK, f);
}
export function getKEGS_GET_GUILD_SKILL_IN_INVITE_GUILD_LIST_ACK(ks: KSerializer, flags?: FlagInput): KEGS_GET_GUILD_SKILL_IN_INVITE_GUILD_LIST_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_GET_GUILD_SKILL_IN_BOARD_ACK, f);
}

export type KEGS_MODIFY_REG_GUILD_INVITE_MSG_REQ = KEGS_REGISTRATION_GUILD_INVITE_MSG_REQ;
export function createKEGS_MODIFY_REG_GUILD_INVITE_MSG_REQ(flags?: FlagInput): KEGS_MODIFY_REG_GUILD_INVITE_MSG_REQ {
  const f = resolveFlags(flags);
  return createKEGS_REGISTRATION_GUILD_INVITE_MSG_REQ(f);
}
export function putKEGS_MODIFY_REG_GUILD_INVITE_MSG_REQ(ks: KSerializer, obj: KEGS_MODIFY_REG_GUILD_INVITE_MSG_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_REGISTRATION_GUILD_INVITE_MSG_REQ, f);
}
export function getKEGS_MODIFY_REG_GUILD_INVITE_MSG_REQ(ks: KSerializer, flags?: FlagInput): KEGS_MODIFY_REG_GUILD_INVITE_MSG_REQ {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_REGISTRATION_GUILD_INVITE_MSG_REQ, f);
}

export type KEGS_MODIFY_REG_GUILD_INVITE_MSG_ACK = KEGS_REGISTRATION_GUILD_INVITE_MSG_ACK;
export function createKEGS_MODIFY_REG_GUILD_INVITE_MSG_ACK(flags?: FlagInput): KEGS_MODIFY_REG_GUILD_INVITE_MSG_ACK {
  const f = resolveFlags(flags);
  return createKEGS_REGISTRATION_GUILD_INVITE_MSG_ACK(f);
}
export function putKEGS_MODIFY_REG_GUILD_INVITE_MSG_ACK(ks: KSerializer, obj: KEGS_MODIFY_REG_GUILD_INVITE_MSG_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_REGISTRATION_GUILD_INVITE_MSG_ACK, f);
}
export function getKEGS_MODIFY_REG_GUILD_INVITE_MSG_ACK(ks: KSerializer, flags?: FlagInput): KEGS_MODIFY_REG_GUILD_INVITE_MSG_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_REGISTRATION_GUILD_INVITE_MSG_ACK, f);
}

export type KEGS_MODIFY_REG_GUILD_FIND_AD_REQ = KEGS_REGISTRATION_GUILD_FIND_AD_REQ;
export function createKEGS_MODIFY_REG_GUILD_FIND_AD_REQ(flags?: FlagInput): KEGS_MODIFY_REG_GUILD_FIND_AD_REQ {
  const f = resolveFlags(flags);
  return createKEGS_REGISTRATION_GUILD_FIND_AD_REQ(f);
}
export function putKEGS_MODIFY_REG_GUILD_FIND_AD_REQ(ks: KSerializer, obj: KEGS_MODIFY_REG_GUILD_FIND_AD_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_REGISTRATION_GUILD_FIND_AD_REQ, f);
}
export function getKEGS_MODIFY_REG_GUILD_FIND_AD_REQ(ks: KSerializer, flags?: FlagInput): KEGS_MODIFY_REG_GUILD_FIND_AD_REQ {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_REGISTRATION_GUILD_FIND_AD_REQ, f);
}

export type KEGS_MODIFY_REG_GUILD_FIND_AD_ACK = KEGS_REGISTRATION_GUILD_FIND_AD_ACK;
export function createKEGS_MODIFY_REG_GUILD_FIND_AD_ACK(flags?: FlagInput): KEGS_MODIFY_REG_GUILD_FIND_AD_ACK {
  const f = resolveFlags(flags);
  return createKEGS_REGISTRATION_GUILD_FIND_AD_ACK(f);
}
export function putKEGS_MODIFY_REG_GUILD_FIND_AD_ACK(ks: KSerializer, obj: KEGS_MODIFY_REG_GUILD_FIND_AD_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_REGISTRATION_GUILD_FIND_AD_ACK, f);
}
export function getKEGS_MODIFY_REG_GUILD_FIND_AD_ACK(ks: KSerializer, flags?: FlagInput): KEGS_MODIFY_REG_GUILD_FIND_AD_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_REGISTRATION_GUILD_FIND_AD_ACK, f);
}

export type KEGS_ACCEPT_INVITE_ACK = KPacketOK;
export function createKEGS_ACCEPT_INVITE_ACK(flags?: FlagInput): KEGS_ACCEPT_INVITE_ACK {
  const f = resolveFlags(flags);
  return createKPacketOK(f);
}
export function putKEGS_ACCEPT_INVITE_ACK(ks: KSerializer, obj: KEGS_ACCEPT_INVITE_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKPacketOK, f);
}
export function getKEGS_ACCEPT_INVITE_ACK(ks: KSerializer, flags?: FlagInput): KEGS_ACCEPT_INVITE_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKPacketOK, f);
}

export type KEGS_DELETE_GUILD_FIND_AD_ACK = KPacketOK;
export function createKEGS_DELETE_GUILD_FIND_AD_ACK(flags?: FlagInput): KEGS_DELETE_GUILD_FIND_AD_ACK {
  const f = resolveFlags(flags);
  return createKPacketOK(f);
}
export function putKEGS_DELETE_GUILD_FIND_AD_ACK(ks: KSerializer, obj: KEGS_DELETE_GUILD_FIND_AD_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKPacketOK, f);
}
export function getKEGS_DELETE_GUILD_FIND_AD_ACK(ks: KSerializer, flags?: FlagInput): KEGS_DELETE_GUILD_FIND_AD_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKPacketOK, f);
}

export type KEGS_EVENT_PROPOSE_NOT = KEGS_COUPLE_PROPOSE_NOT;
export function createKEGS_EVENT_PROPOSE_NOT(flags?: FlagInput): KEGS_EVENT_PROPOSE_NOT {
  const f = resolveFlags(flags);
  return createKEGS_COUPLE_PROPOSE_NOT(f);
}
export function putKEGS_EVENT_PROPOSE_NOT(ks: KSerializer, obj: KEGS_EVENT_PROPOSE_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_COUPLE_PROPOSE_NOT, f);
}
export function getKEGS_EVENT_PROPOSE_NOT(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_PROPOSE_NOT {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_COUPLE_PROPOSE_NOT, f);
}

export type KEGS_EVENT_PROPOSE_ACK = KEGS_COUPLE_PROPOSE_ACK;
export function createKEGS_EVENT_PROPOSE_ACK(flags?: FlagInput): KEGS_EVENT_PROPOSE_ACK {
  const f = resolveFlags(flags);
  return createKEGS_COUPLE_PROPOSE_ACK(f);
}
export function putKEGS_EVENT_PROPOSE_ACK(ks: KSerializer, obj: KEGS_EVENT_PROPOSE_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_COUPLE_PROPOSE_ACK, f);
}
export function getKEGS_EVENT_PROPOSE_ACK(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_PROPOSE_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_COUPLE_PROPOSE_ACK, f);
}

export type KEGS_EVENT_PROPOSE_AGREE_NOT = KEGS_COUPLE_PROPOSE_AGREE_NOT;
export function createKEGS_EVENT_PROPOSE_AGREE_NOT(flags?: FlagInput): KEGS_EVENT_PROPOSE_AGREE_NOT {
  const f = resolveFlags(flags);
  return createKEGS_COUPLE_PROPOSE_AGREE_NOT(f);
}
export function putKEGS_EVENT_PROPOSE_AGREE_NOT(ks: KSerializer, obj: KEGS_EVENT_PROPOSE_AGREE_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_COUPLE_PROPOSE_AGREE_NOT, f);
}
export function getKEGS_EVENT_PROPOSE_AGREE_NOT(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_PROPOSE_AGREE_NOT {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_COUPLE_PROPOSE_AGREE_NOT, f);
}

export type KEGS_EVENT_PROPOSE_RESULT_NOT = KEGS_COUPLE_PROPOSE_RESULT_NOT;
export function createKEGS_EVENT_PROPOSE_RESULT_NOT(flags?: FlagInput): KEGS_EVENT_PROPOSE_RESULT_NOT {
  const f = resolveFlags(flags);
  return createKEGS_COUPLE_PROPOSE_RESULT_NOT(f);
}
export function putKEGS_EVENT_PROPOSE_RESULT_NOT(ks: KSerializer, obj: KEGS_EVENT_PROPOSE_RESULT_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_COUPLE_PROPOSE_RESULT_NOT, f);
}
export function getKEGS_EVENT_PROPOSE_RESULT_NOT(ks: KSerializer, flags?: FlagInput): KEGS_EVENT_PROPOSE_RESULT_NOT {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_COUPLE_PROPOSE_RESULT_NOT, f);
}

export type KEGS_DIVORCE_NOT = KEGS_BREAK_UP_NOT;
export function createKEGS_DIVORCE_NOT(flags?: FlagInput): KEGS_DIVORCE_NOT {
  const f = resolveFlags(flags);
  return createKEGS_BREAK_UP_NOT(f);
}
export function putKEGS_DIVORCE_NOT(ks: KSerializer, obj: KEGS_DIVORCE_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_BREAK_UP_NOT, f);
}
export function getKEGS_DIVORCE_NOT(ks: KSerializer, flags?: FlagInput): KEGS_DIVORCE_NOT {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_BREAK_UP_NOT, f);
}

export type KEGS_2014_EVENT_MISSION_COMPLETE_ACK = KPacketOK;
export function createKEGS_2014_EVENT_MISSION_COMPLETE_ACK(flags?: FlagInput): KEGS_2014_EVENT_MISSION_COMPLETE_ACK {
  const f = resolveFlags(flags);
  return createKPacketOK(f);
}
export function putKEGS_2014_EVENT_MISSION_COMPLETE_ACK(ks: KSerializer, obj: KEGS_2014_EVENT_MISSION_COMPLETE_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKPacketOK, f);
}
export function getKEGS_2014_EVENT_MISSION_COMPLETE_ACK(ks: KSerializer, flags?: FlagInput): KEGS_2014_EVENT_MISSION_COMPLETE_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKPacketOK, f);
}

export type KEGS_START_CHECK_POWER_ACK = KPacketOK;
export function createKEGS_START_CHECK_POWER_ACK(flags?: FlagInput): KEGS_START_CHECK_POWER_ACK {
  const f = resolveFlags(flags);
  return createKPacketOK(f);
}
export function putKEGS_START_CHECK_POWER_ACK(ks: KSerializer, obj: KEGS_START_CHECK_POWER_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKPacketOK, f);
}
export function getKEGS_START_CHECK_POWER_ACK(ks: KSerializer, flags?: FlagInput): KEGS_START_CHECK_POWER_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKPacketOK, f);
}

export type KEGS_GET_TIME_CONTROL_ITME_TALK_LIST_REQ = KPacketOK;
export function createKEGS_GET_TIME_CONTROL_ITME_TALK_LIST_REQ(flags?: FlagInput): KEGS_GET_TIME_CONTROL_ITME_TALK_LIST_REQ {
  const f = resolveFlags(flags);
  return createKPacketOK(f);
}
export function putKEGS_GET_TIME_CONTROL_ITME_TALK_LIST_REQ(ks: KSerializer, obj: KEGS_GET_TIME_CONTROL_ITME_TALK_LIST_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKPacketOK, f);
}
export function getKEGS_GET_TIME_CONTROL_ITME_TALK_LIST_REQ(ks: KSerializer, flags?: FlagInput): KEGS_GET_TIME_CONTROL_ITME_TALK_LIST_REQ {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKPacketOK, f);
}
