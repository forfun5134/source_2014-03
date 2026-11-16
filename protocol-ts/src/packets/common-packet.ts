// Auto-generated from common-packet (.h/.cpp) by scripts/generate.py — DO NOT EDIT MANUALLY.
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

export interface KWeddingHallInfo {
  m_iWeddingUID?: Int32;
  m_cWeddingHallType?: Int8;
  m_cOfficiantNPC?: Int8;
  m_iGroom?: UidType;
  m_iBride?: UidType;
  m_wstrWeddingDate?: string;
  m_tWeddingDate?: Int64;
  m_wstrWeddingMsg?: string;
  m_iRoomUID?: UidType;
  m_bSuccess?: boolean;
  m_bDelete?: boolean;
}
export function createKWeddingHallInfo(flags?: FlagInput): KWeddingHallInfo {
  const f = resolveFlags(flags);
  const obj: KWeddingHallInfo = {
  };
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_iWeddingUID = 0;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_cWeddingHallType = 0;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_cOfficiantNPC = 0;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_iGroom = 0n;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_iBride = 0n;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_wstrWeddingDate = '';
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_tWeddingDate = 0n;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_wstrWeddingMsg = '';
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_iRoomUID = 0n;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_bSuccess = false;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_bDelete = false;
  return obj;
}
export function putKWeddingHallInfo(ks: KSerializer, obj: KWeddingHallInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) {
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt32((obj.m_iWeddingUID ?? 0)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt8((obj.m_cWeddingHallType ?? 0)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt8((obj.m_cOfficiantNPC ?? 0)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt64((obj.m_iGroom ?? 0n)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt64((obj.m_iBride ?? 0n)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putWString((obj.m_wstrWeddingDate ?? '')))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt64((obj.m_tWeddingDate ?? 0n)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putWString((obj.m_wstrWeddingMsg ?? '')))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt64((obj.m_iRoomUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putBool((obj.m_bSuccess ?? false)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putBool((obj.m_bDelete ?? false)))) return false; }
  }
  return true;
}
export function getKWeddingHallInfo(ks: KSerializer, flags?: FlagInput): KWeddingHallInfo {
  const f = resolveFlags(flags);
  const obj = createKWeddingHallInfo(f);
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) {
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_iWeddingUID = ks.getInt32(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_cWeddingHallType = ks.getInt8(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_cOfficiantNPC = ks.getInt8(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_iGroom = ks.getInt64(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_iBride = ks.getInt64(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_wstrWeddingDate = ks.getWString(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_tWeddingDate = ks.getInt64(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_wstrWeddingMsg = ks.getWString(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_iRoomUID = ks.getInt64(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_bSuccess = ks.getBool(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_bDelete = ks.getBool(); }
  }
  return obj;
}

export interface KWeddingItemInfo {
  m_iItemUID?: UidType;
  m_iWeddingUID?: Int32;
  m_cWeddingHallType?: Int8;
  m_cOfficiantNPC?: Int8;
  m_iGroom?: UidType;
  m_iBride?: UidType;
  m_wstrGroom?: string;
  m_wstrBride?: string;
  m_wstrWeddingDate?: string;
  m_wstrWeddingMsg?: string;
}
export function createKWeddingItemInfo(flags?: FlagInput): KWeddingItemInfo {
  const f = resolveFlags(flags);
  const obj: KWeddingItemInfo = {
  };
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_iItemUID = 0n;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_iWeddingUID = 0;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_cWeddingHallType = 0;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_cOfficiantNPC = 0;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_iGroom = 0n;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_iBride = 0n;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_wstrGroom = '';
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_wstrBride = '';
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_wstrWeddingDate = '';
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_wstrWeddingMsg = '';
  return obj;
}
export function putKWeddingItemInfo(ks: KSerializer, obj: KWeddingItemInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) {
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt64((obj.m_iItemUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt32((obj.m_iWeddingUID ?? 0)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt8((obj.m_cWeddingHallType ?? 0)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt8((obj.m_cOfficiantNPC ?? 0)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt64((obj.m_iGroom ?? 0n)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt64((obj.m_iBride ?? 0n)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putWString((obj.m_wstrGroom ?? '')))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putWString((obj.m_wstrBride ?? '')))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putWString((obj.m_wstrWeddingDate ?? '')))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putWString((obj.m_wstrWeddingMsg ?? '')))) return false; }
  }
  return true;
}
export function getKWeddingItemInfo(ks: KSerializer, flags?: FlagInput): KWeddingItemInfo {
  const f = resolveFlags(flags);
  const obj = createKWeddingItemInfo(f);
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) {
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_iItemUID = ks.getInt64(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_iWeddingUID = ks.getInt32(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_cWeddingHallType = ks.getInt8(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_cOfficiantNPC = ks.getInt8(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_iGroom = ks.getInt64(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_iBride = ks.getInt64(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_wstrGroom = ks.getWString(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_wstrBride = ks.getWString(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_wstrWeddingDate = ks.getWString(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_wstrWeddingMsg = ks.getWString(); }
  }
  return obj;
}

export interface KRelationshipInfo {
  m_cRelationshipType?: Int8;
  m_iOtherUnitUID?: UidType;
  m_wstrOtherNickName?: string;
  m_wstrLoveWord?: string;
  m_tDate?: Int64;
  m_tLastReward?: Int64;
  m_cRewardTitleType?: Int8;
}
export function createKRelationshipInfo(flags?: FlagInput): KRelationshipInfo {
  const f = resolveFlags(flags);
  const obj: KRelationshipInfo = {
  };
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_cRelationshipType = 0;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_iOtherUnitUID = 0n;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_wstrOtherNickName = '';
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_wstrLoveWord = '';
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_tDate = 0n;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_tLastReward = 0n;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_cRewardTitleType = 0;
  return obj;
}
export function putKRelationshipInfo(ks: KSerializer, obj: KRelationshipInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) {
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt8((obj.m_cRelationshipType ?? 0)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt64((obj.m_iOtherUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putWString((obj.m_wstrOtherNickName ?? '')))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putWString((obj.m_wstrLoveWord ?? '')))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt64((obj.m_tDate ?? 0n)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt64((obj.m_tLastReward ?? 0n)))) return false; }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt8((obj.m_cRewardTitleType ?? 0)))) return false; }
  }
  return true;
}
export function getKRelationshipInfo(ks: KSerializer, flags?: FlagInput): KRelationshipInfo {
  const f = resolveFlags(flags);
  const obj = createKRelationshipInfo(f);
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) {
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_cRelationshipType = ks.getInt8(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_iOtherUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_wstrOtherNickName = ks.getWString(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_wstrLoveWord = ks.getWString(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_tDate = ks.getInt64(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_tLastReward = ks.getInt64(); }
    if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_cRewardTitleType = ks.getInt8(); }
  }
  return obj;
}

export interface KDBConnectionInfo {
  m_iDBType?: Int32;
  m_wstrConnectionString?: string;
  m_iThreadCount?: Int32;
}
export function createKDBConnectionInfo(flags?: FlagInput): KDBConnectionInfo {
  const f = resolveFlags(flags);
  const obj: KDBConnectionInfo = {
  };
  if (Boolean(f.SERV_DB_CONNECTION_SECURITY)) obj.m_iDBType = 0;
  if (Boolean(f.SERV_DB_CONNECTION_SECURITY)) obj.m_wstrConnectionString = '';
  if (Boolean(f.SERV_DB_CONNECTION_SECURITY)) obj.m_iThreadCount = 0;
  return obj;
}
export function putKDBConnectionInfo(ks: KSerializer, obj: KDBConnectionInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_DB_CONNECTION_SECURITY)) {
    if (Boolean(f.SERV_DB_CONNECTION_SECURITY)) { if (!(ks.putInt32((obj.m_iDBType ?? 0)))) return false; }
    if (Boolean(f.SERV_DB_CONNECTION_SECURITY)) { if (!(ks.putWString((obj.m_wstrConnectionString ?? '')))) return false; }
    if (Boolean(f.SERV_DB_CONNECTION_SECURITY)) { if (!(ks.putInt32((obj.m_iThreadCount ?? 0)))) return false; }
  }
  return true;
}
export function getKDBConnectionInfo(ks: KSerializer, flags?: FlagInput): KDBConnectionInfo {
  const f = resolveFlags(flags);
  const obj = createKDBConnectionInfo(f);
  if (Boolean(f.SERV_DB_CONNECTION_SECURITY)) {
    if (Boolean(f.SERV_DB_CONNECTION_SECURITY)) { obj.m_iDBType = ks.getInt32(); }
    if (Boolean(f.SERV_DB_CONNECTION_SECURITY)) { obj.m_wstrConnectionString = ks.getWString(); }
    if (Boolean(f.SERV_DB_CONNECTION_SECURITY)) { obj.m_iThreadCount = ks.getInt32(); }
  }
  return obj;
}

export interface KNetAddress {
  m_wstrIP: string;
  m_usPort: UInt16;
}
export function createKNetAddress(flags?: FlagInput): KNetAddress {
  const f = resolveFlags(flags);
  return {
    m_wstrIP: '',
    m_usPort: 0,
  };
}
export function putKNetAddress(ks: KSerializer, obj: KNetAddress, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putWString(obj.m_wstrIP))) return false;
  if (!(ks.putUInt16(obj.m_usPort))) return false;
  return true;
}
export function getKNetAddress(ks: KSerializer, flags?: FlagInput): KNetAddress {
  const f = resolveFlags(flags);
  const obj = createKNetAddress(f);
  obj.m_wstrIP = ks.getWString();
  obj.m_usPort = ks.getUInt16();
  return obj;
}

export const KNexonAccountInfo_CHANNELING_ENUM = {
  CE_NONE: -1,
  CE_NEXON_ACCOUNT: 0,
  CE_TOONILAND_ACCOUNT: 3,
  CE_NAVER_ACCOUNT: 6,
  CE_NAVER_SESSION: 14,
} as const;
export type KNexonAccountInfo_CHANNELING_ENUM = (typeof KNexonAccountInfo_CHANNELING_ENUM)[keyof typeof KNexonAccountInfo_CHANNELING_ENUM];
export function getKNexonAccountInfo_CHANNELING_ENUM(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_TOONILAND_CHANNELING)) {
    cur = -1;
    out['CE_NONE'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_TOONILAND_CHANNELING)) {
    cur = 0;
    out['CE_NEXON_ACCOUNT'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_TOONILAND_CHANNELING)) {
    cur = 3;
    out['CE_TOONILAND_ACCOUNT'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_TOONILAND_CHANNELING)) {
    cur = 6;
    out['CE_NAVER_ACCOUNT'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_TOONILAND_CHANNELING)) {
    cur = 14;
    out['CE_NAVER_SESSION'] = cur;
    cur += 1;
  }
  return out;
}
export const KNexonAccountInfo_JAPAN_CHANNELING_ENUM = {
  JCE_NONE: -1,
  JCE_NHN: 0,
  JCE_MSN: 1,
  JCE_NICO: 2,
  JCE_NEXON: 3,
  JCE_MAX: 4,
} as const;
export type KNexonAccountInfo_JAPAN_CHANNELING_ENUM = (typeof KNexonAccountInfo_JAPAN_CHANNELING_ENUM)[keyof typeof KNexonAccountInfo_JAPAN_CHANNELING_ENUM];
export function getKNexonAccountInfo_JAPAN_CHANNELING_ENUM(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_CHANNELING_USER_MANAGER)) {
    cur = -1;
    out['JCE_NONE'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_CHANNELING_USER_MANAGER)) {
    cur = 0;
    out['JCE_NHN'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_CHANNELING_USER_MANAGER)) {
    cur = 1;
    out['JCE_MSN'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_CHANNELING_USER_MANAGER)) {
    cur = 2;
    out['JCE_NICO'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_CHANNELING_USER_MANAGER)) {
    cur = 3;
    out['JCE_NEXON'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_CHANNELING_USER_MANAGER)) {
    cur = 4;
    out['JCE_MAX'] = cur;
    cur += 1;
  }
  return out;
}
export const KNexonAccountInfo_BF_EVENT_TEAM = {
  BFET_NONE: 0,
  BFET_ELSWORD: 1,
  BFET_BUBBLE_FIGHTER: 2,
} as const;
export type KNexonAccountInfo_BF_EVENT_TEAM = (typeof KNexonAccountInfo_BF_EVENT_TEAM)[keyof typeof KNexonAccountInfo_BF_EVENT_TEAM];
export function getKNexonAccountInfo_BF_EVENT_TEAM(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_BUBBLE_FIGHTER_TOGETHER_EVENT)) {
    cur = 0;
    out['BFET_NONE'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_BUBBLE_FIGHTER_TOGETHER_EVENT)) {
    cur = 1;
    out['BFET_ELSWORD'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_BUBBLE_FIGHTER_TOGETHER_EVENT)) {
    cur = 2;
    out['BFET_BUBBLE_FIGHTER'] = cur;
    cur += 1;
  }
  return out;
}
export interface KNexonAccountInfo {
  m_wstrID: string;
  m_wstrLoginIP: string;
  m_bSex: boolean;
  m_uiAge: UInt32;
  m_uiNexonSN: UInt32;
  m_uiPwdHash: UInt32;
  m_uiSsnHash: UInt32;
  m_uiFlag0: UInt32;
  m_uiFlag1: UInt32;
  m_bNewMembership?: boolean;
  m_uMainAuthLevel?: UInt8;
  m_uSubAuthLevel?: UInt8;
  m_wstrNationCode?: string;
  m_wstrMeta?: string;
  m_uSecureCode?: UInt8;
  m_uChannelCode?: UInt8;
  m_wstrChannelUID?: string;
  m_uiServerHash?: UInt32;
  m_wstrServerName?: string;
  m_byteGuestUser: UInt8;
  m_iBF_Team?: Int32;
  m_uRegisteredPC?: UInt8;
}
export function createKNexonAccountInfo(flags?: FlagInput): KNexonAccountInfo {
  const f = resolveFlags(flags);
  const obj: KNexonAccountInfo = {
    m_wstrID: '',
    m_wstrLoginIP: '',
    m_bSex: false,
    m_uiAge: 0,
    m_uiNexonSN: 0,
    m_uiPwdHash: 0,
    m_uiSsnHash: 0,
    m_uiFlag0: 0,
    m_uiFlag1: 0,
    m_byteGuestUser: 0,
  };
  if (Boolean(f.SERV_CHANGE_NEXON_AUTH_ATL_LEVEL)) obj.m_bNewMembership = false;
  if (Boolean(f.SERV_CHANGE_NEXON_AUTH_ATL_LEVEL)) obj.m_uMainAuthLevel = 0;
  if (Boolean(f.SERV_CHANGE_NEXON_AUTH_ATL_LEVEL)) obj.m_uSubAuthLevel = 0;
  if (Boolean(f.SERV_OTP_AUTH)) obj.m_wstrNationCode = '';
  if (Boolean(f.SERV_OTP_AUTH)) obj.m_wstrMeta = '';
  if (Boolean(f.SERV_OTP_AUTH)) obj.m_uSecureCode = 0;
  if (Boolean(f.SERV_OTP_AUTH)) obj.m_uChannelCode = 0;
  if (Boolean(f.SERV_OTP_AUTH)) obj.m_wstrChannelUID = '';
  if (!f.SERV_OTP_AUTH) obj.m_uiServerHash = 0;
  if (!f.SERV_OTP_AUTH) obj.m_wstrServerName = '';
  if (Boolean(f.SERV_BUBBLE_FIGHTER_TOGETHER_EVENT)) obj.m_iBF_Team = 0;
  return obj;
}
export function putKNexonAccountInfo(ks: KSerializer, obj: KNexonAccountInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putWString(obj.m_wstrID))) return false;
  if (!(ks.putUInt32(obj.m_uiNexonSN))) return false;
  if (!(ks.putWString(obj.m_wstrLoginIP))) return false;
  if (!(ks.putBool(obj.m_bSex))) return false;
  if (!(ks.putUInt32(obj.m_uiAge))) return false;
  if (!(ks.putUInt32(obj.m_uiPwdHash))) return false;
  if (!(ks.putUInt32(obj.m_uiSsnHash))) return false;
  if (!(ks.putUInt32(obj.m_uiFlag0))) return false;
  if (!(ks.putUInt32(obj.m_uiFlag1))) return false;
  if (Boolean(f.SERV_CHANGE_NEXON_AUTH_ATL_LEVEL)) { if (!(ks.putBool((obj.m_bNewMembership ?? false)))) return false; }
  if (Boolean(f.SERV_CHANGE_NEXON_AUTH_ATL_LEVEL)) { if (!(ks.putUInt8((obj.m_uMainAuthLevel ?? 0)))) return false; }
  if (Boolean(f.SERV_CHANGE_NEXON_AUTH_ATL_LEVEL)) { if (!(ks.putUInt8((obj.m_uSubAuthLevel ?? 0)))) return false; }
  if (Boolean(f.SERV_OTP_AUTH)) { if (!(ks.putWString((obj.m_wstrNationCode ?? '')))) return false; }
  if (Boolean(f.SERV_OTP_AUTH)) { if (!(ks.putWString((obj.m_wstrMeta ?? '')))) return false; }
  if (Boolean(f.SERV_OTP_AUTH)) { if (!(ks.putUInt8((obj.m_uSecureCode ?? 0)))) return false; }
  if (f.SERV_OTP_AUTH && f.SERV_TOONILAND_CHANNELING) { if (!(ks.putUInt8((obj.m_uChannelCode ?? 0)))) return false; }
  if (f.SERV_OTP_AUTH && f.SERV_TOONILAND_CHANNELING) { if (!(ks.putWString((obj.m_wstrChannelUID ?? '')))) return false; }
  if (f.SERV_OTP_AUTH && !f.SERV_TOONILAND_CHANNELING) { if (!(ks.putUInt8((obj.m_uRegisteredPC ?? 0)))) return false; }
  if (!f.SERV_OTP_AUTH) { if (!(ks.putUInt32((obj.m_uiServerHash ?? 0)))) return false; }
  if (!f.SERV_OTP_AUTH) { if (!(ks.putWString((obj.m_wstrServerName ?? '')))) return false; }
  if (!(ks.putUInt8(obj.m_byteGuestUser))) return false;
  if (Boolean(f.SERV_BUBBLE_FIGHTER_TOGETHER_EVENT)) { if (!(ks.putInt32((obj.m_iBF_Team ?? 0)))) return false; }
  return true;
}
export function getKNexonAccountInfo(ks: KSerializer, flags?: FlagInput): KNexonAccountInfo {
  const f = resolveFlags(flags);
  const obj = createKNexonAccountInfo(f);
  obj.m_wstrID = ks.getWString();
  obj.m_uiNexonSN = ks.getUInt32();
  obj.m_wstrLoginIP = ks.getWString();
  obj.m_bSex = ks.getBool();
  obj.m_uiAge = ks.getUInt32();
  obj.m_uiPwdHash = ks.getUInt32();
  obj.m_uiSsnHash = ks.getUInt32();
  obj.m_uiFlag0 = ks.getUInt32();
  obj.m_uiFlag1 = ks.getUInt32();
  if (Boolean(f.SERV_CHANGE_NEXON_AUTH_ATL_LEVEL)) { obj.m_bNewMembership = ks.getBool(); }
  if (Boolean(f.SERV_CHANGE_NEXON_AUTH_ATL_LEVEL)) { obj.m_uMainAuthLevel = ks.getUInt8(); }
  if (Boolean(f.SERV_CHANGE_NEXON_AUTH_ATL_LEVEL)) { obj.m_uSubAuthLevel = ks.getUInt8(); }
  if (Boolean(f.SERV_OTP_AUTH)) { obj.m_wstrNationCode = ks.getWString(); }
  if (Boolean(f.SERV_OTP_AUTH)) { obj.m_wstrMeta = ks.getWString(); }
  if (Boolean(f.SERV_OTP_AUTH)) { obj.m_uSecureCode = ks.getUInt8(); }
  if (f.SERV_OTP_AUTH && f.SERV_TOONILAND_CHANNELING) { obj.m_uChannelCode = ks.getUInt8(); }
  if (f.SERV_OTP_AUTH && f.SERV_TOONILAND_CHANNELING) { obj.m_wstrChannelUID = ks.getWString(); }
  if (f.SERV_OTP_AUTH && !f.SERV_TOONILAND_CHANNELING) { obj.m_uRegisteredPC = ks.getUInt8(); }
  if (!f.SERV_OTP_AUTH) { obj.m_uiServerHash = ks.getUInt32(); }
  if (!f.SERV_OTP_AUTH) { obj.m_wstrServerName = ks.getWString(); }
  obj.m_byteGuestUser = ks.getUInt8();
  if (Boolean(f.SERV_BUBBLE_FIGHTER_TOGETHER_EVENT)) { obj.m_iBF_Team = ks.getInt32(); }
  return obj;
}

export interface KUserAuthenticateReq {
  m_bDebugAuth: boolean;
  m_wstrUserID: string;
  m_wstrPasswd: string;
  m_wstrHWID?: string;
  m_strMachineID?: string;
  m_kChannelRandomKey?: Int32;
  m_charServerSN?: UInt8[];
  m_wstrClientTime?: string;
  m_iChannelingCode: Int32;
  m_bManualLogin?: boolean;
  m_wstrSocketID?: string;
  m_bSteamClient?: boolean;
  m_bAeriaClient?: boolean;
}
export function createKUserAuthenticateReq(flags?: FlagInput): KUserAuthenticateReq {
  const f = resolveFlags(flags);
  const obj: KUserAuthenticateReq = {
    m_bDebugAuth: false,
    m_wstrUserID: '',
    m_wstrPasswd: '',
    m_iChannelingCode: 0,
  };
  if (Boolean(f.SERV_OTP_AUTH)) obj.m_wstrHWID = '';
  if (Boolean(f.SERV_MACHINE_ID_DUPLICATE_CHECK)) obj.m_strMachineID = '';
  if (Boolean(f.SERV_DLL_LIST_CHECK_BEFOR_LOADING)) obj.m_kChannelRandomKey = 0;
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) obj.m_charServerSN = Array.from({ length: 12 }, () => 0);
  if (Boolean(f.SERV_CHECK_MACHINE_LOCALTIME)) obj.m_wstrClientTime = '';
  if (Boolean(f.SERV_KOG_OTP_VERIFY)) obj.m_bManualLogin = false;
  if (Boolean(f.SERV_COUNTRY_TH)) obj.m_wstrSocketID = '';
  if (Boolean(f.SERV_STEAM)) obj.m_bSteamClient = false;
  if (Boolean(f.SERV_CHANNELING_AERIA)) obj.m_bAeriaClient = false;
  return obj;
}
export function putKUserAuthenticateReq(ks: KSerializer, obj: KUserAuthenticateReq, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putBool(obj.m_bDebugAuth))) return false;
  if (!(ks.putWString(obj.m_wstrUserID))) return false;
  if (!(ks.putWString(obj.m_wstrPasswd))) return false;
  if (Boolean(f.SERV_OTP_AUTH)) { if (!(ks.putWString((obj.m_wstrHWID ?? '')))) return false; }
  if (Boolean(f.SERV_MACHINE_ID_DUPLICATE_CHECK)) { if (!(ks.putString((obj.m_strMachineID ?? '')))) return false; }
  if (Boolean(f.SERV_DLL_LIST_CHECK_BEFOR_LOADING)) { if (!(ks.putInt32((obj.m_kChannelRandomKey ?? 0)))) return false; }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { if (!(ks.putUInt8((obj.m_charServerSN?.[0] ?? 0)))) return false; }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { if (!(ks.putUInt8((obj.m_charServerSN?.[1] ?? 0)))) return false; }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { if (!(ks.putUInt8((obj.m_charServerSN?.[2] ?? 0)))) return false; }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { if (!(ks.putUInt8((obj.m_charServerSN?.[3] ?? 0)))) return false; }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { if (!(ks.putUInt8((obj.m_charServerSN?.[4] ?? 0)))) return false; }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { if (!(ks.putUInt8((obj.m_charServerSN?.[5] ?? 0)))) return false; }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { if (!(ks.putUInt8((obj.m_charServerSN?.[6] ?? 0)))) return false; }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { if (!(ks.putUInt8((obj.m_charServerSN?.[7] ?? 0)))) return false; }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { if (!(ks.putUInt8((obj.m_charServerSN?.[8] ?? 0)))) return false; }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { if (!(ks.putUInt8((obj.m_charServerSN?.[9] ?? 0)))) return false; }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { if (!(ks.putUInt8((obj.m_charServerSN?.[10] ?? 0)))) return false; }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { if (!(ks.putUInt8((obj.m_charServerSN?.[11] ?? 0)))) return false; }
  if (Boolean(f.SERV_CHECK_MACHINE_LOCALTIME)) { if (!(ks.putWString((obj.m_wstrClientTime ?? '')))) return false; }
  if (!(ks.putInt32(obj.m_iChannelingCode))) return false;
  if (Boolean(f.SERV_KOG_OTP_VERIFY)) { if (!(ks.putBool((obj.m_bManualLogin ?? false)))) return false; }
  if (Boolean(f.SERV_COUNTRY_TH)) { if (!(ks.putWString((obj.m_wstrSocketID ?? '')))) return false; }
  if (Boolean(f.SERV_STEAM)) { if (!(ks.putBool((obj.m_bSteamClient ?? false)))) return false; }
  if (Boolean(f.SERV_CHANNELING_AERIA)) { if (!(ks.putBool((obj.m_bAeriaClient ?? false)))) return false; }
  return true;
}
export function getKUserAuthenticateReq(ks: KSerializer, flags?: FlagInput): KUserAuthenticateReq {
  const f = resolveFlags(flags);
  const obj = createKUserAuthenticateReq(f);
  obj.m_bDebugAuth = ks.getBool();
  obj.m_wstrUserID = ks.getWString();
  obj.m_wstrPasswd = ks.getWString();
  if (Boolean(f.SERV_OTP_AUTH)) { obj.m_wstrHWID = ks.getWString(); }
  if (Boolean(f.SERV_MACHINE_ID_DUPLICATE_CHECK)) { obj.m_strMachineID = ks.getString(); }
  if (Boolean(f.SERV_DLL_LIST_CHECK_BEFOR_LOADING)) { obj.m_kChannelRandomKey = ks.getInt32(); }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { (obj.m_charServerSN ??= [])[0] = ks.getUInt8(); }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { (obj.m_charServerSN ??= [])[1] = ks.getUInt8(); }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { (obj.m_charServerSN ??= [])[2] = ks.getUInt8(); }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { (obj.m_charServerSN ??= [])[3] = ks.getUInt8(); }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { (obj.m_charServerSN ??= [])[4] = ks.getUInt8(); }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { (obj.m_charServerSN ??= [])[5] = ks.getUInt8(); }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { (obj.m_charServerSN ??= [])[6] = ks.getUInt8(); }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { (obj.m_charServerSN ??= [])[7] = ks.getUInt8(); }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { (obj.m_charServerSN ??= [])[8] = ks.getUInt8(); }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { (obj.m_charServerSN ??= [])[9] = ks.getUInt8(); }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { (obj.m_charServerSN ??= [])[10] = ks.getUInt8(); }
  if (Boolean(f.SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER)) { (obj.m_charServerSN ??= [])[11] = ks.getUInt8(); }
  if (Boolean(f.SERV_CHECK_MACHINE_LOCALTIME)) { obj.m_wstrClientTime = ks.getWString(); }
  obj.m_iChannelingCode = ks.getInt32();
  if (Boolean(f.SERV_KOG_OTP_VERIFY)) { obj.m_bManualLogin = ks.getBool(); }
  if (Boolean(f.SERV_COUNTRY_TH)) { obj.m_wstrSocketID = ks.getWString(); }
  if (Boolean(f.SERV_STEAM)) { obj.m_bSteamClient = ks.getBool(); }
  if (Boolean(f.SERV_CHANNELING_AERIA)) { obj.m_bAeriaClient = ks.getBool(); }
  return obj;
}

export interface KAccountOption {
  m_bPlayGuide: boolean;
}
export function createKAccountOption(flags?: FlagInput): KAccountOption {
  const f = resolveFlags(flags);
  return {
    m_bPlayGuide: false,
  };
}
export function putKAccountOption(ks: KSerializer, obj: KAccountOption, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putBool(obj.m_bPlayGuide))) return false;
  return true;
}
export function getKAccountOption(ks: KSerializer, flags?: FlagInput): KAccountOption {
  const f = resolveFlags(flags);
  const obj = createKAccountOption(f);
  obj.m_bPlayGuide = ks.getBool();
  return obj;
}

export interface KAccountBlockInfo {
  m_wstrEndTime: string;
  m_wstrBlockReason: string;
  m_byteBlockType?: UInt8;
  m_wstrBlockReason2?: string;
  m_wstrBlockEndDate?: string;
}
export function createKAccountBlockInfo(flags?: FlagInput): KAccountBlockInfo {
  const f = resolveFlags(flags);
  const obj: KAccountBlockInfo = {
    m_wstrEndTime: '',
    m_wstrBlockReason: '',
  };
  if (Boolean(f.SERV_HACKING_USER_CHECK_COUNT)) obj.m_byteBlockType = 0;
  if (Boolean(f.SERV_HACKING_USER_CHECK_COUNT)) obj.m_wstrBlockReason2 = '';
  if (Boolean(f.SERV_HACKING_USER_CHECK_COUNT)) obj.m_wstrBlockEndDate = '';
  return obj;
}
export function putKAccountBlockInfo(ks: KSerializer, obj: KAccountBlockInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putWString(obj.m_wstrEndTime))) return false;
  if (!(ks.putWString(obj.m_wstrBlockReason))) return false;
  if (Boolean(f.SERV_HACKING_USER_CHECK_COUNT)) { if (!(ks.putUInt8((obj.m_byteBlockType ?? 0)))) return false; }
  if (Boolean(f.SERV_HACKING_USER_CHECK_COUNT)) { if (!(ks.putWString((obj.m_wstrBlockReason2 ?? '')))) return false; }
  if (Boolean(f.SERV_HACKING_USER_CHECK_COUNT)) { if (!(ks.putWString((obj.m_wstrBlockEndDate ?? '')))) return false; }
  return true;
}
export function getKAccountBlockInfo(ks: KSerializer, flags?: FlagInput): KAccountBlockInfo {
  const f = resolveFlags(flags);
  const obj = createKAccountBlockInfo(f);
  obj.m_wstrEndTime = ks.getWString();
  obj.m_wstrBlockReason = ks.getWString();
  if (Boolean(f.SERV_HACKING_USER_CHECK_COUNT)) { obj.m_byteBlockType = ks.getUInt8(); }
  if (Boolean(f.SERV_HACKING_USER_CHECK_COUNT)) { obj.m_wstrBlockReason2 = ks.getWString(); }
  if (Boolean(f.SERV_HACKING_USER_CHECK_COUNT)) { obj.m_wstrBlockEndDate = ks.getWString(); }
  return obj;
}

export interface KAccountInfo {
  m_nUserUID: UidType;
  m_wstrID: string;
  m_wstrName: string;
  m_iAuthLevel: Int32;
  m_bInternalUser: boolean;
  m_kAccountOption: KAccountOption;
  m_kAccountBlockInfo: KAccountBlockInfo;
  m_bIsRecommend: boolean;
  m_bIsGuestUser: boolean;
  m_wstrOTP: string;
  m_wstrRegDate?: string;
  m_wstrLastLogin?: string;
  m_iChannelRandomKey?: Int32;
}
export function createKAccountInfo(flags?: FlagInput): KAccountInfo {
  const f = resolveFlags(flags);
  const obj: KAccountInfo = {
    m_nUserUID: 0n,
    m_wstrID: '',
    m_wstrName: '',
    m_iAuthLevel: 0,
    m_bInternalUser: false,
    m_kAccountOption: createKAccountOption(f),
    m_kAccountBlockInfo: createKAccountBlockInfo(f),
    m_bIsRecommend: false,
    m_bIsGuestUser: false,
    m_wstrOTP: '',
  };
  if (Boolean(f.SERV_CASH_ITEM_LIST)) obj.m_wstrRegDate = '';
  if (Boolean(f.SERV_SECOND_SECURITY)) obj.m_wstrLastLogin = '';
  if (Boolean(f.SERV_DLL_LIST_CHECK_BEFOR_LOADING)) obj.m_iChannelRandomKey = 0;
  return obj;
}
export function putKAccountInfo(ks: KSerializer, obj: KAccountInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_nUserUID))) return false;
  if (!(ks.putWString(obj.m_wstrID))) return false;
  if (!(ks.putWString(obj.m_wstrName))) return false;
  if (!(ks.putInt32(obj.m_iAuthLevel))) return false;
  if (!(ks.putBool(obj.m_bInternalUser))) return false;
  if (!(ks.putUserClass(obj.m_kAccountOption, putKAccountOption, f))) return false;
  if (!(ks.putUserClass(obj.m_kAccountBlockInfo, putKAccountBlockInfo, f))) return false;
  if (!(ks.putBool(obj.m_bIsRecommend))) return false;
  if (!(ks.putBool(obj.m_bIsGuestUser))) return false;
  if (!(ks.putWString(obj.m_wstrOTP))) return false;
  if (Boolean(f.SERV_CASH_ITEM_LIST)) { if (!(ks.putWString((obj.m_wstrRegDate ?? '')))) return false; }
  if (Boolean(f.SERV_SECOND_SECURITY)) { if (!(ks.putWString((obj.m_wstrLastLogin ?? '')))) return false; }
  if (Boolean(f.SERV_DLL_LIST_CHECK_BEFOR_LOADING)) { if (!(ks.putInt32((obj.m_iChannelRandomKey ?? 0)))) return false; }
  return true;
}
export function getKAccountInfo(ks: KSerializer, flags?: FlagInput): KAccountInfo {
  const f = resolveFlags(flags);
  const obj = createKAccountInfo(f);
  obj.m_nUserUID = ks.getInt64();
  obj.m_wstrID = ks.getWString();
  obj.m_wstrName = ks.getWString();
  obj.m_iAuthLevel = ks.getInt32();
  obj.m_bInternalUser = ks.getBool();
  obj.m_kAccountOption = ks.getUserClass(getKAccountOption, f);
  obj.m_kAccountBlockInfo = ks.getUserClass(getKAccountBlockInfo, f);
  obj.m_bIsRecommend = ks.getBool();
  obj.m_bIsGuestUser = ks.getBool();
  obj.m_wstrOTP = ks.getWString();
  if (Boolean(f.SERV_CASH_ITEM_LIST)) { obj.m_wstrRegDate = ks.getWString(); }
  if (Boolean(f.SERV_SECOND_SECURITY)) { obj.m_wstrLastLogin = ks.getWString(); }
  if (Boolean(f.SERV_DLL_LIST_CHECK_BEFOR_LOADING)) { obj.m_iChannelRandomKey = ks.getInt32(); }
  return obj;
}

export interface KItemAttributeEnchantInfo {
  m_cAttribEnchant0: Int8;
  m_cAttribEnchant1: Int8;
  m_cAttribEnchant2: Int8;
}
export function createKItemAttributeEnchantInfo(flags?: FlagInput): KItemAttributeEnchantInfo {
  const f = resolveFlags(flags);
  return {
    m_cAttribEnchant0: 0,
    m_cAttribEnchant1: 0,
    m_cAttribEnchant2: 0,
  };
}
export function putKItemAttributeEnchantInfo(ks: KSerializer, obj: KItemAttributeEnchantInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt8(obj.m_cAttribEnchant0))) return false;
  if (!(ks.putInt8(obj.m_cAttribEnchant1))) return false;
  if (!(ks.putInt8(obj.m_cAttribEnchant2))) return false;
  return true;
}
export function getKItemAttributeEnchantInfo(ks: KSerializer, flags?: FlagInput): KItemAttributeEnchantInfo {
  const f = resolveFlags(flags);
  const obj = createKItemAttributeEnchantInfo(f);
  obj.m_cAttribEnchant0 = ks.getInt8();
  obj.m_cAttribEnchant1 = ks.getInt8();
  obj.m_cAttribEnchant2 = ks.getInt8();
  return obj;
}

export const KItemInfo_ITEM_STATE = {
  IS_INIT: 0,
  IS_NORMAL: 1,
  IS_NOT_EVALUATED: 2,
} as const;
export type KItemInfo_ITEM_STATE = (typeof KItemInfo_ITEM_STATE)[keyof typeof KItemInfo_ITEM_STATE];
export function getKItemInfo_ITEM_STATE(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) {
    cur = 0;
    out['IS_INIT'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) {
    out['IS_NORMAL'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) {
    out['IS_NOT_EVALUATED'] = cur;
    cur += 1;
  }
  return out;
}
export interface KItemInfo {
  m_iItemID: Int32;
  m_cUsageType: Int8;
  m_iQuantity: Int32;
  m_sEndurance: Int16;
  m_ucSealData: UInt8;
  m_cEnchantLevel: Int8;
  m_kAttribEnchantInfo: KItemAttributeEnchantInfo;
  m_vecItemSocket: Int32[] | Int16[];
  m_vecRandomSocket?: Int32[];
  m_cItemState?: Int8;
  m_sPeriod: Int16;
  m_wstrExpirationDate: string;
  m_iGoldTicketKeyUID?: UidType;
  m_byteExpandedSocketNum?: UInt8;
}
export function createKItemInfo(flags?: FlagInput): KItemInfo {
  const f = resolveFlags(flags);
  const obj: KItemInfo = {
    m_iItemID: 0,
    m_cUsageType: 0,
    m_iQuantity: 1,
    m_sEndurance: 0,
    m_ucSealData: 0,
    m_cEnchantLevel: 0,
    m_kAttribEnchantInfo: createKItemAttributeEnchantInfo(f),
    m_vecItemSocket: (Boolean(f.SERV_ITEM_OPTION_DATA_SIZE)) ? ([] as Int32[]) : ([] as Int16[]),
    m_sPeriod: 0,
    m_wstrExpirationDate: '',
  };
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) obj.m_vecRandomSocket = ([] as Int32[]);
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) obj.m_cItemState = 0;
  if (Boolean(f.SERV_GOLD_TICKET)) obj.m_iGoldTicketKeyUID = 0n;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_byteExpandedSocketNum = 0;
  return obj;
}
export function putKItemInfo(ks: KSerializer, obj: KItemInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iItemID))) return false;
  if (!(ks.putInt8(obj.m_cUsageType))) return false;
  if (!(ks.putInt32(obj.m_iQuantity))) return false;
  if (!(ks.putInt16(obj.m_sEndurance))) return false;
  if (!(ks.putUInt8(obj.m_ucSealData))) return false;
  if (!(ks.putInt8(obj.m_cEnchantLevel))) return false;
  if (!(ks.putUserClass(obj.m_kAttribEnchantInfo, putKItemAttributeEnchantInfo, f))) return false;
  if (Boolean(f.SERV_ITEM_OPTION_DATA_SIZE)) { if (!(ks.putVector((obj.m_vecItemSocket as Int32[]), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  else if (!f.SERV_ITEM_OPTION_DATA_SIZE) { if (!(ks.putVector((obj.m_vecItemSocket as Int16[]), (ks, item: Int16) => ks.putInt16(item)))) return false; }
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { if (!(ks.putVector((obj.m_vecRandomSocket ?? ([] as Int32[])), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { if (!(ks.putInt8((obj.m_cItemState ?? 0)))) return false; }
  if (!(ks.putInt16(obj.m_sPeriod))) return false;
  if (!(ks.putWString(obj.m_wstrExpirationDate))) return false;
  if (Boolean(f.SERV_GOLD_TICKET)) { if (!(ks.putInt64((obj.m_iGoldTicketKeyUID ?? 0n)))) return false; }
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putUInt8((obj.m_byteExpandedSocketNum ?? 0)))) return false; }
  return true;
}
export function getKItemInfo(ks: KSerializer, flags?: FlagInput): KItemInfo {
  const f = resolveFlags(flags);
  const obj = createKItemInfo(f);
  obj.m_iItemID = ks.getInt32();
  obj.m_cUsageType = ks.getInt8();
  obj.m_iQuantity = ks.getInt32();
  obj.m_sEndurance = ks.getInt16();
  obj.m_ucSealData = ks.getUInt8();
  obj.m_cEnchantLevel = ks.getInt8();
  obj.m_kAttribEnchantInfo = ks.getUserClass(getKItemAttributeEnchantInfo, f);
  if (Boolean(f.SERV_ITEM_OPTION_DATA_SIZE)) { obj.m_vecItemSocket = ks.getVector<Int32>((ks) => ks.getInt32()); }
  else if (!f.SERV_ITEM_OPTION_DATA_SIZE) { obj.m_vecItemSocket = ks.getVector<Int16>((ks) => ks.getInt16()); }
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { obj.m_vecRandomSocket = ks.getVector<Int32>((ks) => ks.getInt32()); }
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { obj.m_cItemState = ks.getInt8(); }
  obj.m_sPeriod = ks.getInt16();
  obj.m_wstrExpirationDate = ks.getWString();
  if (Boolean(f.SERV_GOLD_TICKET)) { obj.m_iGoldTicketKeyUID = ks.getInt64(); }
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_byteExpandedSocketNum = ks.getUInt8(); }
  return obj;
}

export interface KBuyGPItemInfo {
  m_iItemID: Int32;
  m_iPrice: Int32;
  m_iPvPPoint: Int32;
  m_cPeriodType: Int8;
  m_iQuantity: Int32;
  m_sEndurance: Int16;
  m_sPeriod: Int16;
}
export function createKBuyGPItemInfo(flags?: FlagInput): KBuyGPItemInfo {
  const f = resolveFlags(flags);
  return {
    m_iItemID: 0,
    m_iPrice: 0,
    m_iPvPPoint: 0,
    m_cPeriodType: 0,
    m_iQuantity: 1,
    m_sEndurance: 0,
    m_sPeriod: 0,
  };
}
export function putKBuyGPItemInfo(ks: KSerializer, obj: KBuyGPItemInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iItemID))) return false;
  if (!(ks.putInt32(obj.m_iPrice))) return false;
  if (!(ks.putInt32(obj.m_iPvPPoint))) return false;
  if (!(ks.putInt8(obj.m_cPeriodType))) return false;
  if (!(ks.putInt32(obj.m_iQuantity))) return false;
  if (!(ks.putInt16(obj.m_sEndurance))) return false;
  if (!(ks.putInt16(obj.m_sPeriod))) return false;
  return true;
}
export function getKBuyGPItemInfo(ks: KSerializer, flags?: FlagInput): KBuyGPItemInfo {
  const f = resolveFlags(flags);
  const obj = createKBuyGPItemInfo(f);
  obj.m_iItemID = ks.getInt32();
  obj.m_iPrice = ks.getInt32();
  obj.m_iPvPPoint = ks.getInt32();
  obj.m_cPeriodType = ks.getInt8();
  obj.m_iQuantity = ks.getInt32();
  obj.m_sEndurance = ks.getInt16();
  obj.m_sPeriod = ks.getInt16();
  return obj;
}

export const KItemPosition_ITEM_POS_ENUM = {
  IPE_INVALID_PET_UID: -1,
} as const;
export type KItemPosition_ITEM_POS_ENUM = (typeof KItemPosition_ITEM_POS_ENUM)[keyof typeof KItemPosition_ITEM_POS_ENUM];
export function getKItemPosition_ITEM_POS_ENUM(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_PET_SYSTEM)) {
    cur = -1;
    out['IPE_INVALID_PET_UID'] = cur;
    cur += 1;
  }
  return out;
}
export interface KItemPosition {
  m_iSlotCategory?: Int32;
  m_iSlotID?: Int32;
  m_iPetUID?: UidType;
}
export function createKItemPosition(flags?: FlagInput): KItemPosition {
  const f = resolveFlags(flags);
  const obj: KItemPosition = {
  };
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_iSlotCategory = 0;
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_iSlotID = 0;
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_iPetUID = 0n;
  return obj;
}
export function putKItemPosition(ks: KSerializer, obj: KItemPosition, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PET_SYSTEM)) {
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putInt32((obj.m_iSlotCategory ?? 0)))) return false; }
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putInt32((obj.m_iSlotID ?? 0)))) return false; }
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putInt64((obj.m_iPetUID ?? 0n)))) return false; }
  }
  return true;
}
export function getKItemPosition(ks: KSerializer, flags?: FlagInput): KItemPosition {
  const f = resolveFlags(flags);
  const obj = createKItemPosition(f);
  if (Boolean(f.SERV_PET_SYSTEM)) {
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_iSlotCategory = ks.getInt32(); }
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_iSlotID = ks.getInt32(); }
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_iPetUID = ks.getInt64(); }
  }
  return obj;
}

export interface KInventoryItemSimpleInfo {
  m_iItemUID: UidType;
  m_iItemID: Int32;
  m_cSlotCategory: Int8;
  m_sSlotID?: Int16;
  m_cSlotID?: Int8;
  m_EnchantLevel: Int8;
  m_kAttribEnchantInfo: KItemAttributeEnchantInfo;
}
export function createKInventoryItemSimpleInfo(flags?: FlagInput): KInventoryItemSimpleInfo {
  const f = resolveFlags(flags);
  const obj: KInventoryItemSimpleInfo = {
    m_iItemUID: 0n,
    m_iItemID: 0,
    m_cSlotCategory: 0,
    m_EnchantLevel: 0,
    m_kAttribEnchantInfo: createKItemAttributeEnchantInfo(f),
  };
  if (Boolean(f.SERV_EXPAND_SLOT_ID_DATA_SIZE)) obj.m_sSlotID = 0;
  if (!f.SERV_EXPAND_SLOT_ID_DATA_SIZE) obj.m_cSlotID = 0;
  return obj;
}
export function putKInventoryItemSimpleInfo(ks: KSerializer, obj: KInventoryItemSimpleInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iItemUID))) return false;
  if (!(ks.putInt32(obj.m_iItemID))) return false;
  if (!(ks.putInt8(obj.m_cSlotCategory))) return false;
  if (Boolean(f.SERV_EXPAND_SLOT_ID_DATA_SIZE)) { if (!(ks.putInt16((obj.m_sSlotID ?? 0)))) return false; }
  if (!f.SERV_EXPAND_SLOT_ID_DATA_SIZE) { if (!(ks.putInt8((obj.m_cSlotID ?? 0)))) return false; }
  if (!(ks.putInt8(obj.m_EnchantLevel))) return false;
  if (!(ks.putUserClass(obj.m_kAttribEnchantInfo, putKItemAttributeEnchantInfo, f))) return false;
  return true;
}
export function getKInventoryItemSimpleInfo(ks: KSerializer, flags?: FlagInput): KInventoryItemSimpleInfo {
  const f = resolveFlags(flags);
  const obj = createKInventoryItemSimpleInfo(f);
  obj.m_iItemUID = ks.getInt64();
  obj.m_iItemID = ks.getInt32();
  obj.m_cSlotCategory = ks.getInt8();
  if (Boolean(f.SERV_EXPAND_SLOT_ID_DATA_SIZE)) { obj.m_sSlotID = ks.getInt16(); }
  if (!f.SERV_EXPAND_SLOT_ID_DATA_SIZE) { obj.m_cSlotID = ks.getInt8(); }
  obj.m_EnchantLevel = ks.getInt8();
  obj.m_kAttribEnchantInfo = ks.getUserClass(getKItemAttributeEnchantInfo, f);
  return obj;
}

export interface KInventoryItemInfo {
  m_iItemUID: UidType;
  m_cSlotCategory: Int8;
  m_sSlotID?: Int16;
  m_cSlotID?: Int8;
  m_kItemInfo: KItemInfo;
}
export function createKInventoryItemInfo(flags?: FlagInput): KInventoryItemInfo {
  const f = resolveFlags(flags);
  const obj: KInventoryItemInfo = {
    m_iItemUID: 0n,
    m_cSlotCategory: 0,
    m_kItemInfo: createKItemInfo(f),
  };
  if (Boolean(f.SERV_EXPAND_SLOT_ID_DATA_SIZE)) obj.m_sSlotID = 0;
  if (!f.SERV_EXPAND_SLOT_ID_DATA_SIZE) obj.m_cSlotID = 0;
  return obj;
}
export function putKInventoryItemInfo(ks: KSerializer, obj: KInventoryItemInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iItemUID))) return false;
  if (!(ks.putInt8(obj.m_cSlotCategory))) return false;
  if (Boolean(f.SERV_EXPAND_SLOT_ID_DATA_SIZE)) { if (!(ks.putInt16((obj.m_sSlotID ?? 0)))) return false; }
  if (!f.SERV_EXPAND_SLOT_ID_DATA_SIZE) { if (!(ks.putInt8((obj.m_cSlotID ?? 0)))) return false; }
  if (!(ks.putUserClass(obj.m_kItemInfo, putKItemInfo, f))) return false;
  return true;
}
export function getKInventoryItemInfo(ks: KSerializer, flags?: FlagInput): KInventoryItemInfo {
  const f = resolveFlags(flags);
  const obj = createKInventoryItemInfo(f);
  obj.m_iItemUID = ks.getInt64();
  obj.m_cSlotCategory = ks.getInt8();
  if (Boolean(f.SERV_EXPAND_SLOT_ID_DATA_SIZE)) { obj.m_sSlotID = ks.getInt16(); }
  if (!f.SERV_EXPAND_SLOT_ID_DATA_SIZE) { obj.m_cSlotID = ks.getInt8(); }
  obj.m_kItemInfo = ks.getUserClass(getKItemInfo, f);
  return obj;
}

export const KDeletedItemInfo_DELETE_REASON = {
  DR_NOT_DELETE: 0,
  DR_NO_REASON: 1,
  DR_DISCARD: 2,
  DR_SELL_TO_NPC: 3,
  DR_RESOLVE: 4,
  DR_TRADE: 5,
  DR_PERSONAL_SHOP: 6,
  DR_LETTER: 7,
  DR_RANDOM_ITEM: 8,
  DR_EXCHANGE: 9,
  DR_EXPIRED: 10,
  DR_QUEST_COMPLETE: 11,
  DR_MANUFACTURE: 12,
  DR_ENCHANT_PLUOR: 13,
  DR_RESTORE: 14,
  DR_SEAL: 15,
  DR_ENCHANT_STONE: 16,
  DR_ATTACH: 17,
  DR_DUNGEON_REQUIRE: 18,
  DR_USE_QUICK_SLOT: 19,
  DR_CREATE_GUILD: 20,
  DR_RESET_GUILD_SKILL: 21,
  DR_INIT_GUILD_SKILL: 22,
  DR_RESET_SKILL: 23,
  DR_INIT_SKILL: 24,
  DR_USE_ITEM_IN_INVENTORY: 25,
  DR_IDENTIFY: 26,
  DR_ATTRIB_ENCHANT: 27,
  DR_SOCKET_MAGIC_STONE: 28,
  DR_PREPARE_INSERT: 29,
  DR_MOVE_SLOT: 30,
  DR_DELETED_BY_SYSTEM: 31,
  DR_UNIT_DELETE: 32,
  DR_PET_CREATE_ITEM: 33,
  DR_PET_FEED: 34,
  DR_PET_AUTO_FEED: 35,
  DR_QUEST_GIVE_UP: 36,
  DR_ATTRIB_ATTACH: 37,
  DR_BUG_USER_DELETE: 38,
  DR_PSHOP_AGENCY: 39,
  DR_SYNTHESIS: 40,
  DR_BY_GM_TOOL: 41,
  DR_PUT_SHARE_BANK: 42,
  DR_GET_SHARE_BANK: 43,
  DR_DUNGEON_REWARD: 44,
  DR_ZERO_QUANTITY_SHARE_BANK: 45,
  DR_PET_NAME_CHANGE: 46,
  DR_GUILD_NAME_CHANGE: 47,
  DR_FISHING_BAIT: 48,
  DR_EXTRACT_ENCHANT: 49,
  DR_DEFENCE_DUNGEON_DUMMY_ITEM: 50,
  DR_RELATIONSHIP: 51,
  DR_RIDING_PET_CREATE_ITEM: 52,
  DR_ITEM_EXTRACT: 53,
  DR_USE_FINALITY_SKILL: 54,
  DR_EXPAND_SOCKET_SLOT: 55,
} as const;
export type KDeletedItemInfo_DELETE_REASON = (typeof KDeletedItemInfo_DELETE_REASON)[keyof typeof KDeletedItemInfo_DELETE_REASON];
export interface KDeletedItemInfo {
  m_iItemUID: UidType;
  m_ucDeleteReason: UInt8;
}
export function createKDeletedItemInfo(flags?: FlagInput): KDeletedItemInfo {
  const f = resolveFlags(flags);
  return {
    m_iItemUID: 0n,
    m_ucDeleteReason: 1,
  };
}
export function putKDeletedItemInfo(ks: KSerializer, obj: KDeletedItemInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iItemUID))) return false;
  if (!(ks.putUInt8(obj.m_ucDeleteReason))) return false;
  return true;
}
export function getKDeletedItemInfo(ks: KSerializer, flags?: FlagInput): KDeletedItemInfo {
  const f = resolveFlags(flags);
  const obj = createKDeletedItemInfo(f);
  obj.m_iItemUID = ks.getInt64();
  obj.m_ucDeleteReason = ks.getUInt8();
  return obj;
}

export interface KItemQuantityUpdate {
  m_mapQuantityChange: Map<UidType, Int32>;
  m_vecDeleted: KDeletedItemInfo[] | UidType[];
}
export function createKItemQuantityUpdate(flags?: FlagInput): KItemQuantityUpdate {
  const f = resolveFlags(flags);
  const obj: KItemQuantityUpdate = {
    m_mapQuantityChange: new Map<UidType, Int32>(),
    m_vecDeleted: (Boolean(f.DELETE_ITEM)) ? ([] as KDeletedItemInfo[]) : ([] as UidType[]),
  };
  return obj;
}
export function putKItemQuantityUpdate(ks: KSerializer, obj: KItemQuantityUpdate, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putMap(obj.m_mapQuantityChange, (ks, k: UidType) => ks.putInt64(k), (ks, v: Int32) => ks.putInt32(v)))) return false;
  if (Boolean(f.DELETE_ITEM)) { if (!(ks.putVector((obj.m_vecDeleted as KDeletedItemInfo[]), (ks, item: KDeletedItemInfo) => ks.putUserClass(item, putKDeletedItemInfo, f)))) return false; }
  else if (!f.DELETE_ITEM) { if (!(ks.putVector((obj.m_vecDeleted as UidType[]), (ks, item: UidType) => ks.putInt64(item)))) return false; }
  return true;
}
export function getKItemQuantityUpdate(ks: KSerializer, flags?: FlagInput): KItemQuantityUpdate {
  const f = resolveFlags(flags);
  const obj = createKItemQuantityUpdate(f);
  obj.m_mapQuantityChange = ks.getMap<UidType, Int32>((ks) => ks.getInt64(), (ks) => ks.getInt32());
  if (Boolean(f.DELETE_ITEM)) { obj.m_vecDeleted = ks.getVector<KDeletedItemInfo>((ks) => ks.getUserClass(getKDeletedItemInfo, f)); }
  else if (!f.DELETE_ITEM) { obj.m_vecDeleted = ks.getVector<UidType>((ks) => ks.getInt64()); }
  return obj;
}

export interface KDungeonClearInfo {
  m_iDungeonID: Int32;
  m_iMaxScore: Int32;
  m_cMaxTotalRank: Int8;
  m_wstrClearTime: string;
  m_bNew: boolean;
}
export function createKDungeonClearInfo(flags?: FlagInput): KDungeonClearInfo {
  const f = resolveFlags(flags);
  return {
    m_iDungeonID: 0,
    m_iMaxScore: 0,
    m_cMaxTotalRank: 0,
    m_wstrClearTime: '',
    m_bNew: false,
  };
}
export function putKDungeonClearInfo(ks: KSerializer, obj: KDungeonClearInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iDungeonID))) return false;
  if (!(ks.putInt32(obj.m_iMaxScore))) return false;
  if (!(ks.putInt8(obj.m_cMaxTotalRank))) return false;
  if (!(ks.putWString(obj.m_wstrClearTime))) return false;
  if (!(ks.putBool(obj.m_bNew))) return false;
  return true;
}
export function getKDungeonClearInfo(ks: KSerializer, flags?: FlagInput): KDungeonClearInfo {
  const f = resolveFlags(flags);
  const obj = createKDungeonClearInfo(f);
  obj.m_iDungeonID = ks.getInt32();
  obj.m_iMaxScore = ks.getInt32();
  obj.m_cMaxTotalRank = ks.getInt8();
  obj.m_wstrClearTime = ks.getWString();
  obj.m_bNew = ks.getBool();
  return obj;
}

export interface KDungeonPlayInfo {
  m_iDungeonID?: Int32;
  m_iPlayTimes?: Int32;
  m_iClearTimes?: Int32;
  m_bNew?: boolean;
}
export function createKDungeonPlayInfo(flags?: FlagInput): KDungeonPlayInfo {
  const f = resolveFlags(flags);
  const obj: KDungeonPlayInfo = {
  };
  if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) obj.m_iDungeonID = 0;
  if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) obj.m_iPlayTimes = 0;
  if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) obj.m_iClearTimes = 0;
  if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) obj.m_bNew = false;
  return obj;
}
export function putKDungeonPlayInfo(ks: KSerializer, obj: KDungeonPlayInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) {
    if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) { if (!(ks.putInt32((obj.m_iDungeonID ?? 0)))) return false; }
    if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) { if (!(ks.putInt32((obj.m_iPlayTimes ?? 0)))) return false; }
    if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) { if (!(ks.putInt32((obj.m_iClearTimes ?? 0)))) return false; }
    if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) { if (!(ks.putBool((obj.m_bNew ?? false)))) return false; }
  }
  return true;
}
export function getKDungeonPlayInfo(ks: KSerializer, flags?: FlagInput): KDungeonPlayInfo {
  const f = resolveFlags(flags);
  const obj = createKDungeonPlayInfo(f);
  if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) {
    if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) { obj.m_iDungeonID = ks.getInt32(); }
    if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) { obj.m_iPlayTimes = ks.getInt32(); }
    if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) { obj.m_iClearTimes = ks.getInt32(); }
    if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) { obj.m_bNew = ks.getBool(); }
  }
  return obj;
}

export interface KTCClearInfo {
  m_iTCID: Int32;
  m_wstrClearTime: string;
  m_bNew: boolean;
}
export function createKTCClearInfo(flags?: FlagInput): KTCClearInfo {
  const f = resolveFlags(flags);
  return {
    m_iTCID: 0,
    m_wstrClearTime: '',
    m_bNew: false,
  };
}
export function putKTCClearInfo(ks: KSerializer, obj: KTCClearInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iTCID))) return false;
  if (!(ks.putWString(obj.m_wstrClearTime))) return false;
  if (!(ks.putBool(obj.m_bNew))) return false;
  return true;
}
export function getKTCClearInfo(ks: KSerializer, flags?: FlagInput): KTCClearInfo {
  const f = resolveFlags(flags);
  const obj = createKTCClearInfo(f);
  obj.m_iTCID = ks.getInt32();
  obj.m_wstrClearTime = ks.getWString();
  obj.m_bNew = ks.getBool();
  return obj;
}

export interface KCompleteQuestInfo {
  m_iQuestID: Int32;
  m_iCompleteCount: Int32;
  m_tCompleteDate: Int64;
}
export function createKCompleteQuestInfo(flags?: FlagInput): KCompleteQuestInfo {
  const f = resolveFlags(flags);
  return {
    m_iQuestID: 0,
    m_iCompleteCount: 0,
    m_tCompleteDate: 0n,
  };
}
export function putKCompleteQuestInfo(ks: KSerializer, obj: KCompleteQuestInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iQuestID))) return false;
  if (!(ks.putInt32(obj.m_iCompleteCount))) return false;
  if (!(ks.putInt64(obj.m_tCompleteDate))) return false;
  return true;
}
export function getKCompleteQuestInfo(ks: KSerializer, flags?: FlagInput): KCompleteQuestInfo {
  const f = resolveFlags(flags);
  const obj = createKCompleteQuestInfo(f);
  obj.m_iQuestID = ks.getInt32();
  obj.m_iCompleteCount = ks.getInt32();
  obj.m_tCompleteDate = ks.getInt64();
  return obj;
}

export interface KSubQuestInstance {
  m_iID: Int32;
  m_ucClearData: UInt8;
  m_bIsSuccess: boolean;
}
export function createKSubQuestInstance(flags?: FlagInput): KSubQuestInstance {
  const f = resolveFlags(flags);
  return {
    m_iID: 0,
    m_ucClearData: 0,
    m_bIsSuccess: false,
  };
}
export function putKSubQuestInstance(ks: KSerializer, obj: KSubQuestInstance, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iID))) return false;
  if (!(ks.putUInt8(obj.m_ucClearData))) return false;
  if (!(ks.putBool(obj.m_bIsSuccess))) return false;
  return true;
}
export function getKSubQuestInstance(ks: KSerializer, flags?: FlagInput): KSubQuestInstance {
  const f = resolveFlags(flags);
  const obj = createKSubQuestInstance(f);
  obj.m_iID = ks.getInt32();
  obj.m_ucClearData = ks.getUInt8();
  obj.m_bIsSuccess = ks.getBool();
  return obj;
}

export interface KQuestInstance {
  m_iID: Int32;
  m_OwnorUnitUID: UidType;
  m_vecSubQuestInstance: KSubQuestInstance[];
}
export function createKQuestInstance(flags?: FlagInput): KQuestInstance {
  const f = resolveFlags(flags);
  return {
    m_iID: 0,
    m_OwnorUnitUID: 0n,
    m_vecSubQuestInstance: ([] as KSubQuestInstance[]),
  };
}
export function putKQuestInstance(ks: KSerializer, obj: KQuestInstance, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iID))) return false;
  if (!(ks.putInt64(obj.m_OwnorUnitUID))) return false;
  if (!(ks.putVector(obj.m_vecSubQuestInstance, (ks, item: KSubQuestInstance) => ks.putUserClass(item, putKSubQuestInstance, f)))) return false;
  return true;
}
export function getKQuestInstance(ks: KSerializer, flags?: FlagInput): KQuestInstance {
  const f = resolveFlags(flags);
  const obj = createKQuestInstance(f);
  obj.m_iID = ks.getInt32();
  obj.m_OwnorUnitUID = ks.getInt64();
  obj.m_vecSubQuestInstance = ks.getVector<KSubQuestInstance>((ks) => ks.getUserClass(getKSubQuestInstance, f));
  return obj;
}

export interface KStat {
  m_iBaseHP: Int32;
  m_iAtkPhysic: Int32;
  m_iAtkMagic: Int32;
  m_iDefPhysic: Int32;
  m_iDefMagic: Int32;
}
export function createKStat(flags?: FlagInput): KStat {
  const f = resolveFlags(flags);
  return {
    m_iBaseHP: 0,
    m_iAtkPhysic: 0,
    m_iAtkMagic: 0,
    m_iDefPhysic: 0,
    m_iDefMagic: 0,
  };
}
export function putKStat(ks: KSerializer, obj: KStat, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iBaseHP))) return false;
  if (!(ks.putInt32(obj.m_iAtkPhysic))) return false;
  if (!(ks.putInt32(obj.m_iAtkMagic))) return false;
  if (!(ks.putInt32(obj.m_iDefPhysic))) return false;
  if (!(ks.putInt32(obj.m_iDefMagic))) return false;
  return true;
}
export function getKStat(ks: KSerializer, flags?: FlagInput): KStat {
  const f = resolveFlags(flags);
  const obj = createKStat(f);
  obj.m_iBaseHP = ks.getInt32();
  obj.m_iAtkPhysic = ks.getInt32();
  obj.m_iAtkMagic = ks.getInt32();
  obj.m_iDefPhysic = ks.getInt32();
  obj.m_iDefMagic = ks.getInt32();
  return obj;
}

export interface KSkillData {
  m_iSkillID: Int16;
  m_cSkillLevel: UInt8;
}
export function createKSkillData(flags?: FlagInput): KSkillData {
  const f = resolveFlags(flags);
  return {
    m_iSkillID: 0,
    m_cSkillLevel: 0,
  };
}
export function putKSkillData(ks: KSerializer, obj: KSkillData, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt16(obj.m_iSkillID))) return false;
  if (!(ks.putUInt8(obj.m_cSkillLevel))) return false;
  return true;
}
export function getKSkillData(ks: KSerializer, flags?: FlagInput): KSkillData {
  const f = resolveFlags(flags);
  const obj = createKSkillData(f);
  obj.m_iSkillID = ks.getInt16();
  obj.m_cSkillLevel = ks.getUInt8();
  return obj;
}

export interface KUnitSkillData {
  m_aEquippedSkill: KSkillData[];
  m_aEquippedSkillSlotB: KSkillData[];
  m_wstrSkillSlotBEndDate: string;
  m_cSkillSlotBExpirationState: Int8;
  m_vecPassiveSkill: KSkillData[];
  m_vecGuildPassiveSkill?: KSkillData[];
  m_vecSkillNote?: Int32[];
  m_nActiveSkillPagesNumber?: UInt8;
  m_nTheNumberOfSkillPagesAvailable?: UInt8;
}
export function createKUnitSkillData(flags?: FlagInput): KUnitSkillData {
  const f = resolveFlags(flags);
  const obj: KUnitSkillData = {
    m_aEquippedSkill: Array.from({ length: 4 }, () => createKSkillData(f)),
    m_aEquippedSkillSlotB: Array.from({ length: 4 }, () => createKSkillData(f)),
    m_wstrSkillSlotBEndDate: '',
    m_cSkillSlotBExpirationState: 0,
    m_vecPassiveSkill: ([] as KSkillData[]),
  };
  if (Boolean(f.GUILD_SKILL_TEST)) obj.m_vecGuildPassiveSkill = ([] as KSkillData[]);
  if (Boolean(f.SERV_SKILL_NOTE)) obj.m_vecSkillNote = ([] as Int32[]);
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) obj.m_nActiveSkillPagesNumber = 1;
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) obj.m_nTheNumberOfSkillPagesAvailable = 1;
  return obj;
}
export function putKUnitSkillData(ks: KSerializer, obj: KUnitSkillData, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUserClass((obj.m_aEquippedSkill[0] ?? createKSkillData(f)), putKSkillData, f))) return false;
  if (!(ks.putUserClass((obj.m_aEquippedSkill[1] ?? createKSkillData(f)), putKSkillData, f))) return false;
  if (!(ks.putUserClass((obj.m_aEquippedSkill[2] ?? createKSkillData(f)), putKSkillData, f))) return false;
  if (!(ks.putUserClass((obj.m_aEquippedSkill[3] ?? createKSkillData(f)), putKSkillData, f))) return false;
  if (!(ks.putUserClass((obj.m_aEquippedSkillSlotB[0] ?? createKSkillData(f)), putKSkillData, f))) return false;
  if (!(ks.putUserClass((obj.m_aEquippedSkillSlotB[1] ?? createKSkillData(f)), putKSkillData, f))) return false;
  if (!(ks.putUserClass((obj.m_aEquippedSkillSlotB[2] ?? createKSkillData(f)), putKSkillData, f))) return false;
  if (!(ks.putUserClass((obj.m_aEquippedSkillSlotB[3] ?? createKSkillData(f)), putKSkillData, f))) return false;
  if (!(ks.putWString(obj.m_wstrSkillSlotBEndDate))) return false;
  if (!(ks.putInt8(obj.m_cSkillSlotBExpirationState))) return false;
  if (!(ks.putVector(obj.m_vecPassiveSkill, (ks, item: KSkillData) => ks.putUserClass(item, putKSkillData, f)))) return false;
  if (Boolean(f.GUILD_SKILL_TEST)) { if (!(ks.putVector((obj.m_vecGuildPassiveSkill ?? ([] as KSkillData[])), (ks, item: KSkillData) => ks.putUserClass(item, putKSkillData, f)))) return false; }
  if (Boolean(f.SERV_SKILL_NOTE)) { if (!(ks.putVector((obj.m_vecSkillNote ?? ([] as Int32[])), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putUInt8((obj.m_nActiveSkillPagesNumber ?? 1)))) return false; }
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putUInt8((obj.m_nTheNumberOfSkillPagesAvailable ?? 1)))) return false; }
  return true;
}
export function getKUnitSkillData(ks: KSerializer, flags?: FlagInput): KUnitSkillData {
  const f = resolveFlags(flags);
  const obj = createKUnitSkillData(f);
  obj.m_aEquippedSkill[0] = ks.getUserClass(getKSkillData, f);
  obj.m_aEquippedSkill[1] = ks.getUserClass(getKSkillData, f);
  obj.m_aEquippedSkill[2] = ks.getUserClass(getKSkillData, f);
  obj.m_aEquippedSkill[3] = ks.getUserClass(getKSkillData, f);
  obj.m_aEquippedSkillSlotB[0] = ks.getUserClass(getKSkillData, f);
  obj.m_aEquippedSkillSlotB[1] = ks.getUserClass(getKSkillData, f);
  obj.m_aEquippedSkillSlotB[2] = ks.getUserClass(getKSkillData, f);
  obj.m_aEquippedSkillSlotB[3] = ks.getUserClass(getKSkillData, f);
  obj.m_wstrSkillSlotBEndDate = ks.getWString();
  obj.m_cSkillSlotBExpirationState = ks.getInt8();
  obj.m_vecPassiveSkill = ks.getVector<KSkillData>((ks) => ks.getUserClass(getKSkillData, f));
  if (Boolean(f.GUILD_SKILL_TEST)) { obj.m_vecGuildPassiveSkill = ks.getVector<KSkillData>((ks) => ks.getUserClass(getKSkillData, f)); }
  if (Boolean(f.SERV_SKILL_NOTE)) { obj.m_vecSkillNote = ks.getVector<Int32>((ks) => ks.getInt32()); }
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { obj.m_nActiveSkillPagesNumber = ks.getUInt8(); }
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { obj.m_nTheNumberOfSkillPagesAvailable = ks.getUInt8(); }
  return obj;
}

export const KFriendInfo_FRIEND_STATUS = {
  FS_NORMAL: 0,
  FS_REQUESTED: 1,
  FS_WAITING: 2,
  FS_BLOCKED: 3,
  FS_NUM: 4,
} as const;
export type KFriendInfo_FRIEND_STATUS = (typeof KFriendInfo_FRIEND_STATUS)[keyof typeof KFriendInfo_FRIEND_STATUS];
export const KFriendInfo_FRIEND_POSITION = {
  FP_OFF_LINE: 0,
  FP_ON_LINE: 1,
} as const;
export type KFriendInfo_FRIEND_POSITION = (typeof KFriendInfo_FRIEND_POSITION)[keyof typeof KFriendInfo_FRIEND_POSITION];
export interface KFriendInfo {
  m_iUnitUID: UidType;
  m_wstrNickName: string;
  m_cGroupID: Int8;
  m_cStatus: Int8;
  m_cPosition: Int8;
}
export function createKFriendInfo(flags?: FlagInput): KFriendInfo {
  const f = resolveFlags(flags);
  return {
    m_iUnitUID: 0n,
    m_wstrNickName: '',
    m_cGroupID: 0,
    m_cStatus: 0,
    m_cPosition: 0,
  };
}
export function putKFriendInfo(ks: KSerializer, obj: KFriendInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (!(ks.putInt8(obj.m_cGroupID))) return false;
  if (!(ks.putInt8(obj.m_cStatus))) return false;
  if (!(ks.putInt8(obj.m_cPosition))) return false;
  return true;
}
export function getKFriendInfo(ks: KSerializer, flags?: FlagInput): KFriendInfo {
  const f = resolveFlags(flags);
  const obj = createKFriendInfo(f);
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  obj.m_cGroupID = ks.getInt8();
  obj.m_cStatus = ks.getInt8();
  obj.m_cPosition = ks.getInt8();
  return obj;
}

export const KFriendMessageInfo_MESSAGE_TYPE = {
  MT_REQUEST_FRIEND: 0,
} as const;
export type KFriendMessageInfo_MESSAGE_TYPE = (typeof KFriendMessageInfo_MESSAGE_TYPE)[keyof typeof KFriendMessageInfo_MESSAGE_TYPE];
export interface KFriendMessageInfo {
  m_iUnitUID: UidType;
  m_wstrNickName: string;
  m_cMessageType: Int8;
  m_wstrMessage: string;
  m_wstrRegDate: string;
}
export function createKFriendMessageInfo(flags?: FlagInput): KFriendMessageInfo {
  const f = resolveFlags(flags);
  return {
    m_iUnitUID: 0n,
    m_wstrNickName: '',
    m_cMessageType: 0,
    m_wstrMessage: '',
    m_wstrRegDate: '',
  };
}
export function putKFriendMessageInfo(ks: KSerializer, obj: KFriendMessageInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (!(ks.putInt8(obj.m_cMessageType))) return false;
  if (!(ks.putWString(obj.m_wstrMessage))) return false;
  if (!(ks.putWString(obj.m_wstrRegDate))) return false;
  return true;
}
export function getKFriendMessageInfo(ks: KSerializer, flags?: FlagInput): KFriendMessageInfo {
  const f = resolveFlags(flags);
  const obj = createKFriendMessageInfo(f);
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  obj.m_cMessageType = ks.getInt8();
  obj.m_wstrMessage = ks.getWString();
  obj.m_wstrRegDate = ks.getWString();
  return obj;
}

export interface KMessengerInfo {
  m_mapFriendInfo: Map<UidType, KFriendInfo>;
  m_mapGroup: Map<Int8, string>;
  m_vecFriendMessageInfo: KFriendMessageInfo[];
}
export function createKMessengerInfo(flags?: FlagInput): KMessengerInfo {
  const f = resolveFlags(flags);
  return {
    m_mapFriendInfo: new Map<UidType, KFriendInfo>(),
    m_mapGroup: new Map<Int8, string>(),
    m_vecFriendMessageInfo: ([] as KFriendMessageInfo[]),
  };
}
export function putKMessengerInfo(ks: KSerializer, obj: KMessengerInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putMap(obj.m_mapFriendInfo, (ks, k: UidType) => ks.putInt64(k), (ks, v: KFriendInfo) => ks.putUserClass(v, putKFriendInfo, f)))) return false;
  if (!(ks.putMap(obj.m_mapGroup, (ks, k: Int8) => ks.putInt8(k), (ks, v: string) => ks.putWString(v)))) return false;
  if (!(ks.putVector(obj.m_vecFriendMessageInfo, (ks, item: KFriendMessageInfo) => ks.putUserClass(item, putKFriendMessageInfo, f)))) return false;
  return true;
}
export function getKMessengerInfo(ks: KSerializer, flags?: FlagInput): KMessengerInfo {
  const f = resolveFlags(flags);
  const obj = createKMessengerInfo(f);
  obj.m_mapFriendInfo = ks.getMap<UidType, KFriendInfo>((ks) => ks.getInt64(), (ks) => ks.getUserClass(getKFriendInfo, f));
  obj.m_mapGroup = ks.getMap<Int8, string>((ks) => ks.getInt8(), (ks) => ks.getWString());
  obj.m_vecFriendMessageInfo = ks.getVector<KFriendMessageInfo>((ks) => ks.getUserClass(getKFriendMessageInfo, f));
  return obj;
}

export interface KUserGuildInfo {
  m_iGuildUID: Int32;
  m_wstrGuildName: string;
  m_ucMemberShipGrade: UInt8;
  m_iHonorPoint: Int32;
}
export function createKUserGuildInfo(flags?: FlagInput): KUserGuildInfo {
  const f = resolveFlags(flags);
  return {
    m_iGuildUID: 0,
    m_wstrGuildName: '',
    m_ucMemberShipGrade: 0,
    m_iHonorPoint: 0,
  };
}
export function putKUserGuildInfo(ks: KSerializer, obj: KUserGuildInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iGuildUID))) return false;
  if (!(ks.putWString(obj.m_wstrGuildName))) return false;
  if (!(ks.putUInt8(obj.m_ucMemberShipGrade))) return false;
  if (!(ks.putInt32(obj.m_iHonorPoint))) return false;
  return true;
}
export function getKUserGuildInfo(ks: KSerializer, flags?: FlagInput): KUserGuildInfo {
  const f = resolveFlags(flags);
  const obj = createKUserGuildInfo(f);
  obj.m_iGuildUID = ks.getInt32();
  obj.m_wstrGuildName = ks.getWString();
  obj.m_ucMemberShipGrade = ks.getUInt8();
  obj.m_iHonorPoint = ks.getInt32();
  return obj;
}

export interface KLastPositionInfo {
  m_iMapID?: Int32;
  m_ucLastTouchLineIndex?: UInt8;
  m_usLastPosValue?: UInt16;
  m_bIgnoreLastTouch?: boolean;
}
export function createKLastPositionInfo(flags?: FlagInput): KLastPositionInfo {
  const f = resolveFlags(flags);
  const obj: KLastPositionInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iMapID = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_ucLastTouchLineIndex = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_usLastPosValue = 0;
  if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_BATTLE_FIELD_BOSS) obj.m_bIgnoreLastTouch = false;
  return obj;
}
export function putKLastPositionInfo(ks: KSerializer, obj: KLastPositionInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iMapID ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putUInt8((obj.m_ucLastTouchLineIndex ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putUInt16((obj.m_usLastPosValue ?? 0)))) return false; }
    if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_BATTLE_FIELD_BOSS) { if (!(ks.putBool((obj.m_bIgnoreLastTouch ?? false)))) return false; }
  }
  return true;
}
export function getKLastPositionInfo(ks: KSerializer, flags?: FlagInput): KLastPositionInfo {
  const f = resolveFlags(flags);
  const obj = createKLastPositionInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iMapID = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_ucLastTouchLineIndex = ks.getUInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_usLastPosValue = ks.getUInt16(); }
    if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_BATTLE_FIELD_BOSS) { obj.m_bIgnoreLastTouch = ks.getBool(); }
  }
  return obj;
}

export interface KBuffBehaviorFactor {
  m_uiType?: UInt32;
  m_vecValues?: Float32[];
}
export function createKBuffBehaviorFactor(flags?: FlagInput): KBuffBehaviorFactor {
  const f = resolveFlags(flags);
  const obj: KBuffBehaviorFactor = {
  };
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_uiType = 0;
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_vecValues = ([] as Float32[]);
  return obj;
}
export function putKBuffBehaviorFactor(ks: KSerializer, obj: KBuffBehaviorFactor, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putUInt32((obj.m_uiType ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putVector((obj.m_vecValues ?? ([] as Float32[])), (ks, item: Float32) => ks.putFloat32(item)))) return false; }
  }
  return true;
}
export function getKBuffBehaviorFactor(ks: KSerializer, flags?: FlagInput): KBuffBehaviorFactor {
  const f = resolveFlags(flags);
  const obj = createKBuffBehaviorFactor(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_uiType = ks.getUInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_vecValues = ks.getVector<Float32>((ks) => ks.getFloat32()); }
  }
  return obj;
}

export interface KBuffFinalizerFactor {
  m_uiType?: UInt32;
  m_vecValues?: Float32[];
}
export function createKBuffFinalizerFactor(flags?: FlagInput): KBuffFinalizerFactor {
  const f = resolveFlags(flags);
  const obj: KBuffFinalizerFactor = {
  };
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_uiType = 0;
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_vecValues = ([] as Float32[]);
  return obj;
}
export function putKBuffFinalizerFactor(ks: KSerializer, obj: KBuffFinalizerFactor, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putUInt32((obj.m_uiType ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putVector((obj.m_vecValues ?? ([] as Float32[])), (ks, item: Float32) => ks.putFloat32(item)))) return false; }
  }
  return true;
}
export function getKBuffFinalizerFactor(ks: KSerializer, flags?: FlagInput): KBuffFinalizerFactor {
  const f = resolveFlags(flags);
  const obj = createKBuffFinalizerFactor(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_uiType = ks.getUInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_vecValues = ks.getVector<Float32>((ks) => ks.getFloat32()); }
  }
  return obj;
}

export interface KBuffIdentity {
  m_eBuffTempletID?: Int32;
  m_uiUniqueNum?: UInt32;
}
export function createKBuffIdentity(flags?: FlagInput): KBuffIdentity {
  const f = resolveFlags(flags);
  const obj: KBuffIdentity = {
  };
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_eBuffTempletID = 0;
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_uiUniqueNum = 0;
  return obj;
}
export function putKBuffIdentity(ks: KSerializer, obj: KBuffIdentity, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_eBuffTempletID ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putUInt32((obj.m_uiUniqueNum ?? 0)))) return false; }
  }
  return true;
}
export function getKBuffIdentity(ks: KSerializer, flags?: FlagInput): KBuffIdentity {
  const f = resolveFlags(flags);
  const obj = createKBuffIdentity(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_eBuffTempletID = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_uiUniqueNum = ks.getUInt32(); }
  }
  return obj;
}

export interface KBuffFactor {
  m_vecBuffBehaviorFactors?: KBuffBehaviorFactor[];
  m_vecBuffFinalizerFactors?: KBuffFinalizerFactor[];
  m_BuffIdentity?: KBuffIdentity;
  m_uidMesGameUnit?: UidType;
  m_fAccumulationMultiplier?: Float32;
  m_ucAccumulationCountNow?: UInt8;
  m_bIsMesGameUnitNpc?: boolean;
  m_iFactorID?: Int32;
}
export function createKBuffFactor(flags?: FlagInput): KBuffFactor {
  const f = resolveFlags(flags);
  const obj: KBuffFactor = {
  };
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_vecBuffBehaviorFactors = ([] as KBuffBehaviorFactor[]);
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_vecBuffFinalizerFactors = ([] as KBuffFinalizerFactor[]);
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_BuffIdentity = createKBuffIdentity(f);
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_uidMesGameUnit = 0n;
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_fAccumulationMultiplier = 0.0;
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_ucAccumulationCountNow = 0;
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_bIsMesGameUnitNpc = false;
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_iFactorID = 0;
  return obj;
}
export function putKBuffFactor(ks: KSerializer, obj: KBuffFactor, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putVector((obj.m_vecBuffBehaviorFactors ?? ([] as KBuffBehaviorFactor[])), (ks, item: KBuffBehaviorFactor) => ks.putUserClass(item, putKBuffBehaviorFactor, f)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putVector((obj.m_vecBuffFinalizerFactors ?? ([] as KBuffFinalizerFactor[])), (ks, item: KBuffFinalizerFactor) => ks.putUserClass(item, putKBuffFinalizerFactor, f)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putUserClass((obj.m_BuffIdentity ?? createKBuffIdentity(f)), putKBuffIdentity, f))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putFloat32((obj.m_fAccumulationMultiplier ?? 0.0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putUInt8((obj.m_ucAccumulationCountNow ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iFactorID ?? 0)))) return false; }
  }
  return true;
}
export function getKBuffFactor(ks: KSerializer, flags?: FlagInput): KBuffFactor {
  const f = resolveFlags(flags);
  const obj = createKBuffFactor(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_vecBuffBehaviorFactors = ks.getVector<KBuffBehaviorFactor>((ks) => ks.getUserClass(getKBuffBehaviorFactor, f)); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_vecBuffFinalizerFactors = ks.getVector<KBuffFinalizerFactor>((ks) => ks.getUserClass(getKBuffFinalizerFactor, f)); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_BuffIdentity = ks.getUserClass(getKBuffIdentity, f); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_fAccumulationMultiplier = ks.getFloat32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_ucAccumulationCountNow = ks.getUInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iFactorID = ks.getInt32(); }
  }
  return obj;
}

export interface KBuffInfo {
  m_kFactorInfo?: KBuffFactor;
  m_iBuffStartTime?: Int64;
  m_iBuffEndTime?: Int64;
}
export function createKBuffInfo(flags?: FlagInput): KBuffInfo {
  const f = resolveFlags(flags);
  const obj: KBuffInfo = {
  };
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_kFactorInfo = createKBuffFactor(f);
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_iBuffStartTime = 0n;
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_iBuffEndTime = 0n;
  return obj;
}
export function putKBuffInfo(ks: KSerializer, obj: KBuffInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) {
    if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) { if (!(ks.putUserClass((obj.m_kFactorInfo ?? createKBuffFactor(f)), putKBuffFactor, f))) return false; }
    if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) { if (!(ks.putInt64((obj.m_iBuffStartTime ?? 0n)))) return false; }
    if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) { if (!(ks.putInt64((obj.m_iBuffEndTime ?? 0n)))) return false; }
  }
  return true;
}
export function getKBuffInfo(ks: KSerializer, flags?: FlagInput): KBuffInfo {
  const f = resolveFlags(flags);
  const obj = createKBuffInfo(f);
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) {
    if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) { obj.m_kFactorInfo = ks.getUserClass(getKBuffFactor, f); }
    if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) { obj.m_iBuffStartTime = ks.getInt64(); }
    if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) { obj.m_iBuffEndTime = ks.getInt64(); }
  }
  return obj;
}

export interface KUnitBuffInfo {
  m_iInsertTime?: Int64;
  m_mapBuffInfo?: Map<Int32, KBuffInfo>;
}
export function createKUnitBuffInfo(flags?: FlagInput): KUnitBuffInfo {
  const f = resolveFlags(flags);
  const obj: KUnitBuffInfo = {
  };
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_iInsertTime = 0n;
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_mapBuffInfo = new Map<Int32, KBuffInfo>();
  return obj;
}
export function putKUnitBuffInfo(ks: KSerializer, obj: KUnitBuffInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) {
    if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) { if (!(ks.putInt64((obj.m_iInsertTime ?? 0n)))) return false; }
    if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) { if (!(ks.putMap((obj.m_mapBuffInfo ?? new Map<Int32, KBuffInfo>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: KBuffInfo) => ks.putUserClass(v, putKBuffInfo, f)))) return false; }
  }
  return true;
}
export function getKUnitBuffInfo(ks: KSerializer, flags?: FlagInput): KUnitBuffInfo {
  const f = resolveFlags(flags);
  const obj = createKUnitBuffInfo(f);
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) {
    if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) { obj.m_iInsertTime = ks.getInt64(); }
    if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) { obj.m_mapBuffInfo = ks.getMap<Int32, KBuffInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKBuffInfo, f)); }
  }
  return obj;
}

export interface KNpcUnitBuffInfo {
  m_iNpcUID?: Int32;
  m_vecBuffFactor?: KBuffFactor[];
}
export function createKNpcUnitBuffInfo(flags?: FlagInput): KNpcUnitBuffInfo {
  const f = resolveFlags(flags);
  const obj: KNpcUnitBuffInfo = {
  };
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_iNpcUID = 0;
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) obj.m_vecBuffFactor = ([] as KBuffFactor[]);
  return obj;
}
export function putKNpcUnitBuffInfo(ks: KSerializer, obj: KNpcUnitBuffInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) {
    if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) { if (!(ks.putInt32((obj.m_iNpcUID ?? 0)))) return false; }
    if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) { if (!(ks.putVector((obj.m_vecBuffFactor ?? ([] as KBuffFactor[])), (ks, item: KBuffFactor) => ks.putUserClass(item, putKBuffFactor, f)))) return false; }
  }
  return true;
}
export function getKNpcUnitBuffInfo(ks: KSerializer, flags?: FlagInput): KNpcUnitBuffInfo {
  const f = resolveFlags(flags);
  const obj = createKNpcUnitBuffInfo(f);
  if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) {
    if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) { obj.m_iNpcUID = ks.getInt32(); }
    if (Boolean(f.SERV_SERVER_BUFF_SYSTEM)) { obj.m_vecBuffFactor = ks.getVector<KBuffFactor>((ks) => ks.getUserClass(getKBuffFactor, f)); }
  }
  return obj;
}

export interface KUnitInfo {
  m_iOwnerUserUID: UidType;
  m_cAuthLevel: Int8;
  m_nUnitUID: UidType;
  m_uiKNMSerialNum: UInt32;
  m_cUnitClass: Int8;
  m_wstrNickName: string;
  m_wstrIP: string;
  m_usPort: UInt16;
  m_iED: Int32;
  m_ucLevel: UInt8;
  m_iEXP: Int32;
  m_iOfficialMatchCnt?: Int32;
  m_iRating?: Int32;
  m_iMaxRating?: Int32;
  m_iRPoint?: Int32;
  m_iAPoint?: Int32;
  m_bIsWinBeforeMatch?: boolean;
  m_cRank?: Int8;
  m_fKFactor?: Float32;
  m_bIsRedistributionUser?: boolean;
  m_iPastSeasonWin?: Int32;
  m_iPVPEmblem?: Int32;
  m_iVSPoint?: Int32;
  m_iVSPointMax?: Int32;
  m_iSPoint: Int32;
  m_iCSPoint: Int32;
  m_iMaxCSPoint: Int32;
  m_wstrCSPointEndDate: string;
  m_nNowBaseLevelEXP: Int32;
  m_nNextBaseLevelEXP: Int32;
  m_nStraightVictories: Int32;
  m_kStat: KStat;
  m_kGameStat: KStat;
  m_kLastPos?: KLastPositionInfo;
  m_nMapID?: Int32;
  m_ucLastTouchLineIndex?: UInt8;
  m_usLastPosValue?: UInt16;
  m_vecBuffInfo?: KBuffInfo[];
  m_iWin: Int32;
  m_iLose: Int32;
  m_mapDungeonClear: Map<Int32, KDungeonClearInfo>;
  m_mapTCClear: Map<Int32, KTCClearInfo>;
  m_mapDungeonPlay?: Map<Int32, KDungeonPlayInfo>;
  m_mapEquippedItem: Map<Int32, KInventoryItemInfo>;
  m_UnitSkillData: KUnitSkillData;
  m_bIsParty: boolean;
  m_iSpiritMax: Int32;
  m_iSpirit: Int32;
  m_bIsGameBang: boolean;
  m_iPcBangType?: Int32;
  m_iTitleID?: Int32;
  m_sTitleID?: Int16;
  m_kUserGuildInfo?: KUserGuildInfo;
  m_wstrLastLoginTime: string;
  m_wstrLastDate?: string;
  m_bDeleted?: boolean;
  m_trDelAbleDate?: Int64;
  m_trRestoreAbleDate?: Int64;
  m_trWarpVipEndData?: Int64;
  m_iEventQuestClearCount?: Int32;
  m_iExchangeCount?: Int32;
  m_iAccumulationSpirit?: Int32;
  m_arrChinaSpirit?: Int32[];
  m_bRecruit?: boolean;
  m_ucOldYearMissionRewardedLevel?: UInt8;
  m_iNewYearMissionStepID?: Int32;
  m_ucCheckPowerCount?: UInt8;
  m_iCheckPowerTime?: Int64;
  m_bCheckPowerShowPopUp?: boolean;
  m_ucCheckPowerScore?: UInt8;
  m_iAccountPVPLoseCount?: UInt32;
}
export function createKUnitInfo(flags?: FlagInput): KUnitInfo {
  const f = resolveFlags(flags);
  const obj: KUnitInfo = {
    m_iOwnerUserUID: 0n,
    m_cAuthLevel: 0,
    m_nUnitUID: 0n,
    m_uiKNMSerialNum: 0,
    m_cUnitClass: 0,
    m_wstrNickName: '',
    m_wstrIP: '',
    m_usPort: 0,
    m_iED: 0,
    m_ucLevel: 0,
    m_iEXP: 0,
    m_iSPoint: 0,
    m_iCSPoint: 0,
    m_iMaxCSPoint: 0,
    m_wstrCSPointEndDate: '',
    m_nNowBaseLevelEXP: 0,
    m_nNextBaseLevelEXP: 0,
    m_nStraightVictories: 0,
    m_kStat: createKStat(f),
    m_kGameStat: createKStat(f),
    m_iWin: 0,
    m_iLose: 0,
    m_mapDungeonClear: new Map<Int32, KDungeonClearInfo>(),
    m_mapTCClear: new Map<Int32, KTCClearInfo>(),
    m_mapEquippedItem: new Map<Int32, KInventoryItemInfo>(),
    m_UnitSkillData: createKUnitSkillData(f),
    m_bIsParty: false,
    m_iSpiritMax: 0,
    m_iSpirit: 0,
    m_bIsGameBang: false,
    m_wstrLastLoginTime: '',
  };
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iOfficialMatchCnt = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iRating = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iMaxRating = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iRPoint = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iAPoint = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_bIsWinBeforeMatch = false;
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) obj.m_cRank = 0;
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) obj.m_fKFactor = 0.0;
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) obj.m_bIsRedistributionUser = false;
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) obj.m_iPastSeasonWin = 0;
  if (!f.SERV_PVP_NEW_SYSTEM) obj.m_iPVPEmblem = 0;
  if (!f.SERV_PVP_NEW_SYSTEM) obj.m_iVSPoint = 0;
  if (!f.SERV_PVP_NEW_SYSTEM) obj.m_iVSPointMax = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_kLastPos = createKLastPositionInfo(f);
  if (!f.SERV_BATTLE_FIELD_SYSTEM) obj.m_nMapID = 0;
  if (!f.SERV_BATTLE_FIELD_SYSTEM) obj.m_ucLastTouchLineIndex = 0;
  if (!f.SERV_BATTLE_FIELD_SYSTEM) obj.m_usLastPosValue = 0;
  if (Boolean(f.SERV_REFORM_THE_GATE_OF_DARKNESS)) obj.m_vecBuffInfo = ([] as KBuffInfo[]);
  if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) obj.m_mapDungeonPlay = new Map<Int32, KDungeonPlayInfo>();
  if (Boolean(f.SERV_PC_BANG_TYPE)) obj.m_iPcBangType = -1;
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) obj.m_iTitleID = 0;
  if (!f.SERV_TITLE_DATA_SIZE) obj.m_sTitleID = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_kUserGuildInfo = createKUserGuildInfo(f);
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) obj.m_wstrLastDate = '';
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) obj.m_bDeleted = false;
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) obj.m_trDelAbleDate = 0n;
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) obj.m_trRestoreAbleDate = 0n;
  if (Boolean(f.SERV_ADD_WARP_BUTTON)) obj.m_trWarpVipEndData = 0n;
  if (Boolean(f.SERV_GROW_UP_SOCKET)) obj.m_iEventQuestClearCount = 0;
  if (Boolean(f.SERV_GROW_UP_SOCKET)) obj.m_iExchangeCount = 0;
  if (Boolean(f.SERV_ACCUMULATION_SPIRIT_SYSTEM)) obj.m_iAccumulationSpirit = 0;
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) obj.m_arrChinaSpirit = Array.from({ length: 6 }, () => 0);
  if (Boolean(f.SERV_RECRUIT_EVENT_QUEST_FOR_NEW_USER)) obj.m_bRecruit = false;
  if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) obj.m_ucOldYearMissionRewardedLevel = 0;
  if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) obj.m_iNewYearMissionStepID = -1;
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) obj.m_ucCheckPowerCount = 0;
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) obj.m_iCheckPowerTime = 0n;
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) obj.m_bCheckPowerShowPopUp = false;
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) obj.m_ucCheckPowerScore = 0;
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_iAccountPVPLoseCount = 0;
  return obj;
}
export function putKUnitInfo(ks: KSerializer, obj: KUnitInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iOwnerUserUID))) return false;
  if (!(ks.putInt8(obj.m_cAuthLevel))) return false;
  if (!(ks.putInt64(obj.m_nUnitUID))) return false;
  if (!(ks.putUInt32(obj.m_uiKNMSerialNum))) return false;
  if (!(ks.putInt8(obj.m_cUnitClass))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (!(ks.putWString(obj.m_wstrIP))) return false;
  if (!(ks.putUInt16(obj.m_usPort))) return false;
  if (!(ks.putInt32(obj.m_iED))) return false;
  if (!(ks.putUInt8(obj.m_ucLevel))) return false;
  if (!(ks.putInt32(obj.m_iEXP))) return false;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iOfficialMatchCnt ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iRating ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iMaxRating ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iRPoint ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iAPoint ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putBool((obj.m_bIsWinBeforeMatch ?? false)))) return false; }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { if (!(ks.putInt8((obj.m_cRank ?? 0)))) return false; }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { if (!(ks.putFloat32((obj.m_fKFactor ?? 0.0)))) return false; }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { if (!(ks.putBool((obj.m_bIsRedistributionUser ?? false)))) return false; }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { if (!(ks.putInt32((obj.m_iPastSeasonWin ?? 0)))) return false; }
  if (!f.SERV_PVP_NEW_SYSTEM) { if (!(ks.putInt32((obj.m_iPVPEmblem ?? 0)))) return false; }
  if (!f.SERV_PVP_NEW_SYSTEM) { if (!(ks.putInt32((obj.m_iVSPoint ?? 0)))) return false; }
  if (!f.SERV_PVP_NEW_SYSTEM) { if (!(ks.putInt32((obj.m_iVSPointMax ?? 0)))) return false; }
  if (!(ks.putInt32(obj.m_iSPoint))) return false;
  if (!(ks.putInt32(obj.m_iCSPoint))) return false;
  if (!(ks.putInt32(obj.m_iMaxCSPoint))) return false;
  if (!(ks.putWString(obj.m_wstrCSPointEndDate))) return false;
  if (!(ks.putInt32(obj.m_nNowBaseLevelEXP))) return false;
  if (!(ks.putInt32(obj.m_nNextBaseLevelEXP))) return false;
  if (!(ks.putInt32(obj.m_nStraightVictories))) return false;
  if (!(ks.putUserClass(obj.m_kStat, putKStat, f))) return false;
  if (!(ks.putUserClass(obj.m_kGameStat, putKStat, f))) return false;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putUserClass((obj.m_kLastPos ?? createKLastPositionInfo(f)), putKLastPositionInfo, f))) return false; }
  if (!f.SERV_BATTLE_FIELD_SYSTEM) { if (!(ks.putInt32((obj.m_nMapID ?? 0)))) return false; }
  if (!f.SERV_BATTLE_FIELD_SYSTEM) { if (!(ks.putUInt8((obj.m_ucLastTouchLineIndex ?? 0)))) return false; }
  if (!f.SERV_BATTLE_FIELD_SYSTEM) { if (!(ks.putUInt16((obj.m_usLastPosValue ?? 0)))) return false; }
  if (Boolean(f.SERV_REFORM_THE_GATE_OF_DARKNESS)) { if (!(ks.putVector((obj.m_vecBuffInfo ?? ([] as KBuffInfo[])), (ks, item: KBuffInfo) => ks.putUserClass(item, putKBuffInfo, f)))) return false; }
  if (!(ks.putInt32(obj.m_iWin))) return false;
  if (!(ks.putInt32(obj.m_iLose))) return false;
  if (!(ks.putMap(obj.m_mapDungeonClear, (ks, k: Int32) => ks.putInt32(k), (ks, v: KDungeonClearInfo) => ks.putUserClass(v, putKDungeonClearInfo, f)))) return false;
  if (!(ks.putMap(obj.m_mapTCClear, (ks, k: Int32) => ks.putInt32(k), (ks, v: KTCClearInfo) => ks.putUserClass(v, putKTCClearInfo, f)))) return false;
  if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) { if (!(ks.putMap((obj.m_mapDungeonPlay ?? new Map<Int32, KDungeonPlayInfo>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: KDungeonPlayInfo) => ks.putUserClass(v, putKDungeonPlayInfo, f)))) return false; }
  if (!(ks.putMap(obj.m_mapEquippedItem, (ks, k: Int32) => ks.putInt32(k), (ks, v: KInventoryItemInfo) => ks.putUserClass(v, putKInventoryItemInfo, f)))) return false;
  if (!(ks.putUserClass(obj.m_UnitSkillData, putKUnitSkillData, f))) return false;
  if (!(ks.putBool(obj.m_bIsParty))) return false;
  if (!(ks.putInt32(obj.m_iSpiritMax))) return false;
  if (!(ks.putInt32(obj.m_iSpirit))) return false;
  if (!(ks.putBool(obj.m_bIsGameBang))) return false;
  if (Boolean(f.SERV_PC_BANG_TYPE)) { if (!(ks.putInt32((obj.m_iPcBangType ?? -1)))) return false; }
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) { if (!(ks.putInt32((obj.m_iTitleID ?? 0)))) return false; }
  if (!f.SERV_TITLE_DATA_SIZE) { if (!(ks.putInt16((obj.m_sTitleID ?? 0)))) return false; }
  if (Boolean(f.GUILD_TEST)) { if (!(ks.putUserClass((obj.m_kUserGuildInfo ?? createKUserGuildInfo(f)), putKUserGuildInfo, f))) return false; }
  if (!(ks.putWString(obj.m_wstrLastLoginTime))) return false;
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { if (!(ks.putWString((obj.m_wstrLastDate ?? '')))) return false; }
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { if (!(ks.putBool((obj.m_bDeleted ?? false)))) return false; }
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { if (!(ks.putInt64((obj.m_trDelAbleDate ?? 0n)))) return false; }
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { if (!(ks.putInt64((obj.m_trRestoreAbleDate ?? 0n)))) return false; }
  if (Boolean(f.SERV_ADD_WARP_BUTTON)) { if (!(ks.putInt64((obj.m_trWarpVipEndData ?? 0n)))) return false; }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { if (!(ks.putInt32((obj.m_iEventQuestClearCount ?? 0)))) return false; }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { if (!(ks.putInt32((obj.m_iExchangeCount ?? 0)))) return false; }
  if (Boolean(f.SERV_ACCUMULATION_SPIRIT_SYSTEM)) { if (!(ks.putInt32((obj.m_iAccumulationSpirit ?? 0)))) return false; }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[0] ?? 0)))) return false; }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[1] ?? 0)))) return false; }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[2] ?? 0)))) return false; }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[3] ?? 0)))) return false; }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[4] ?? 0)))) return false; }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[5] ?? 0)))) return false; }
  if (Boolean(f.SERV_RECRUIT_EVENT_QUEST_FOR_NEW_USER)) { if (!(ks.putBool((obj.m_bRecruit ?? false)))) return false; }
  if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) { if (!(ks.putUInt8((obj.m_ucOldYearMissionRewardedLevel ?? 0)))) return false; }
  if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) { if (!(ks.putInt32((obj.m_iNewYearMissionStepID ?? -1)))) return false; }
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) { if (!(ks.putUInt8((obj.m_ucCheckPowerCount ?? 0)))) return false; }
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) { if (!(ks.putInt64((obj.m_iCheckPowerTime ?? 0n)))) return false; }
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) { if (!(ks.putBool((obj.m_bCheckPowerShowPopUp ?? false)))) return false; }
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) { if (!(ks.putUInt8((obj.m_ucCheckPowerScore ?? 0)))) return false; }
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putUInt32((obj.m_iAccountPVPLoseCount ?? 0)))) return false; }
  return true;
}
export function getKUnitInfo(ks: KSerializer, flags?: FlagInput): KUnitInfo {
  const f = resolveFlags(flags);
  const obj = createKUnitInfo(f);
  obj.m_iOwnerUserUID = ks.getInt64();
  obj.m_cAuthLevel = ks.getInt8();
  obj.m_nUnitUID = ks.getInt64();
  obj.m_uiKNMSerialNum = ks.getUInt32();
  obj.m_cUnitClass = ks.getInt8();
  obj.m_wstrNickName = ks.getWString();
  obj.m_wstrIP = ks.getWString();
  obj.m_usPort = ks.getUInt16();
  obj.m_iED = ks.getInt32();
  obj.m_ucLevel = ks.getUInt8();
  obj.m_iEXP = ks.getInt32();
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iOfficialMatchCnt = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iRating = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iMaxRating = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iRPoint = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iAPoint = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_bIsWinBeforeMatch = ks.getBool(); }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { obj.m_cRank = ks.getInt8(); }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { obj.m_fKFactor = ks.getFloat32(); }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { obj.m_bIsRedistributionUser = ks.getBool(); }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { obj.m_iPastSeasonWin = ks.getInt32(); }
  if (!f.SERV_PVP_NEW_SYSTEM) { obj.m_iPVPEmblem = ks.getInt32(); }
  if (!f.SERV_PVP_NEW_SYSTEM) { obj.m_iVSPoint = ks.getInt32(); }
  if (!f.SERV_PVP_NEW_SYSTEM) { obj.m_iVSPointMax = ks.getInt32(); }
  obj.m_iSPoint = ks.getInt32();
  obj.m_iCSPoint = ks.getInt32();
  obj.m_iMaxCSPoint = ks.getInt32();
  obj.m_wstrCSPointEndDate = ks.getWString();
  obj.m_nNowBaseLevelEXP = ks.getInt32();
  obj.m_nNextBaseLevelEXP = ks.getInt32();
  obj.m_nStraightVictories = ks.getInt32();
  obj.m_kStat = ks.getUserClass(getKStat, f);
  obj.m_kGameStat = ks.getUserClass(getKStat, f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_kLastPos = ks.getUserClass(getKLastPositionInfo, f); }
  if (!f.SERV_BATTLE_FIELD_SYSTEM) { obj.m_nMapID = ks.getInt32(); }
  if (!f.SERV_BATTLE_FIELD_SYSTEM) { obj.m_ucLastTouchLineIndex = ks.getUInt8(); }
  if (!f.SERV_BATTLE_FIELD_SYSTEM) { obj.m_usLastPosValue = ks.getUInt16(); }
  if (Boolean(f.SERV_REFORM_THE_GATE_OF_DARKNESS)) { obj.m_vecBuffInfo = ks.getVector<KBuffInfo>((ks) => ks.getUserClass(getKBuffInfo, f)); }
  obj.m_iWin = ks.getInt32();
  obj.m_iLose = ks.getInt32();
  obj.m_mapDungeonClear = ks.getMap<Int32, KDungeonClearInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKDungeonClearInfo, f));
  obj.m_mapTCClear = ks.getMap<Int32, KTCClearInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKTCClearInfo, f));
  if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) { obj.m_mapDungeonPlay = ks.getMap<Int32, KDungeonPlayInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKDungeonPlayInfo, f)); }
  obj.m_mapEquippedItem = ks.getMap<Int32, KInventoryItemInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKInventoryItemInfo, f));
  obj.m_UnitSkillData = ks.getUserClass(getKUnitSkillData, f);
  obj.m_bIsParty = ks.getBool();
  obj.m_iSpiritMax = ks.getInt32();
  obj.m_iSpirit = ks.getInt32();
  obj.m_bIsGameBang = ks.getBool();
  if (Boolean(f.SERV_PC_BANG_TYPE)) { obj.m_iPcBangType = ks.getInt32(); }
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) { obj.m_iTitleID = ks.getInt32(); }
  if (!f.SERV_TITLE_DATA_SIZE) { obj.m_sTitleID = ks.getInt16(); }
  if (Boolean(f.GUILD_TEST)) { obj.m_kUserGuildInfo = ks.getUserClass(getKUserGuildInfo, f); }
  obj.m_wstrLastLoginTime = ks.getWString();
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { obj.m_wstrLastDate = ks.getWString(); }
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { obj.m_bDeleted = ks.getBool(); }
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { obj.m_trDelAbleDate = ks.getInt64(); }
  if (Boolean(f.SERV_UNIT_WAIT_DELETE)) { obj.m_trRestoreAbleDate = ks.getInt64(); }
  if (Boolean(f.SERV_ADD_WARP_BUTTON)) { obj.m_trWarpVipEndData = ks.getInt64(); }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { obj.m_iEventQuestClearCount = ks.getInt32(); }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { obj.m_iExchangeCount = ks.getInt32(); }
  if (Boolean(f.SERV_ACCUMULATION_SPIRIT_SYSTEM)) { obj.m_iAccumulationSpirit = ks.getInt32(); }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[0] = ks.getInt32(); }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[1] = ks.getInt32(); }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[2] = ks.getInt32(); }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[3] = ks.getInt32(); }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[4] = ks.getInt32(); }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[5] = ks.getInt32(); }
  if (Boolean(f.SERV_RECRUIT_EVENT_QUEST_FOR_NEW_USER)) { obj.m_bRecruit = ks.getBool(); }
  if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) { obj.m_ucOldYearMissionRewardedLevel = ks.getUInt8(); }
  if (Boolean(f.SERV_NEW_YEAR_EVENT_2014)) { obj.m_iNewYearMissionStepID = ks.getInt32(); }
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) { obj.m_ucCheckPowerCount = ks.getUInt8(); }
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) { obj.m_iCheckPowerTime = ks.getInt64(); }
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) { obj.m_bCheckPowerShowPopUp = ks.getBool(); }
  if (Boolean(f.SERV_EVENT_CHECK_POWER)) { obj.m_ucCheckPowerScore = ks.getUInt8(); }
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_iAccountPVPLoseCount = ks.getUInt32(); }
  return obj;
}

export interface VECTOR3 {
  x: Float32;
  y: Float32;
  z: Float32;
}
export function createVECTOR3(flags?: FlagInput): VECTOR3 {
  const f = resolveFlags(flags);
  return {
    x: 0.0,
    y: 0.0,
    z: 0.0,
  };
}
export function putVECTOR3(ks: KSerializer, obj: VECTOR3, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putFloat32(obj.x))) return false;
  if (!(ks.putFloat32(obj.y))) return false;
  if (!(ks.putFloat32(obj.z))) return false;
  return true;
}
export function getVECTOR3(ks: KSerializer, flags?: FlagInput): VECTOR3 {
  const f = resolveFlags(flags);
  const obj = createVECTOR3(f);
  obj.x = ks.getFloat32();
  obj.y = ks.getFloat32();
  obj.z = ks.getFloat32();
  return obj;
}

export interface KRoomInfo {
  m_RoomType: Int8;
  m_RoomUID: UidType;
  m_uiRoomListID: UInt32;
  m_RoomName: string;
  m_RoomState: Int8;
  m_bPublic: boolean;
  m_bTeamBalance: boolean;
  m_wstrPassword: string;
  m_MaxSlot: Int8;
  m_JoinSlot: Int8;
  m_wstrUDPRelayIP: string;
  m_usUDPRelayPort: UInt16;
  m_bStartedByAutoParty?: boolean;
  m_PVPGameType: Int8;
  m_bIsItemMode?: boolean;
  m_iPVPChannelClass: Int32;
  m_WinKillNum: Int8;
  m_bCanIntrude: boolean;
  m_fPlayTime: Float32;
  m_WorldID: Int16;
  m_ShowPvpMapWorldID: Int16;
  m_DifficultyLevel: Int8;
  m_iDungeonID: Int32;
  m_cGetItemType: Int8;
  m_cDungeonMode: Int8;
  m_iPartyUID: UidType;
  m_iBattleFieldID?: Int32;
  m_mapAllPlayersSelectedMap?: Map<Int16, Int32>;
  m_bDefenceDungeonOpen?: boolean;
}
export function createKRoomInfo(flags?: FlagInput): KRoomInfo {
  const f = resolveFlags(flags);
  const obj: KRoomInfo = {
    m_RoomType: -1,
    m_RoomUID: 0n,
    m_uiRoomListID: 0,
    m_RoomName: '',
    m_RoomState: 0,
    m_bPublic: true,
    m_bTeamBalance: false,
    m_wstrPassword: '',
    m_MaxSlot: 0,
    m_JoinSlot: 0,
    m_wstrUDPRelayIP: '',
    m_usUDPRelayPort: 0,
    m_PVPGameType: -1,
    m_iPVPChannelClass: -1,
    m_WinKillNum: 0,
    m_bCanIntrude: false,
    m_fPlayTime: 0.0,
    m_WorldID: 0,
    m_ShowPvpMapWorldID: 0,
    m_DifficultyLevel: 0,
    m_iDungeonID: 0,
    m_cGetItemType: 0,
    m_cDungeonMode: 0,
    m_iPartyUID: 0n,
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_bStartedByAutoParty = false;
  if (Boolean(f.DUNGEON_ITEM)) obj.m_bIsItemMode = false;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iBattleFieldID = 0;
  if (Boolean(f.SERV_PVP_REMATCH)) obj.m_mapAllPlayersSelectedMap = new Map<Int16, Int32>();
  if (Boolean(f.SERV_NEW_DEFENCE_DUNGEON)) obj.m_bDefenceDungeonOpen = false;
  return obj;
}
export function putKRoomInfo(ks: KSerializer, obj: KRoomInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt8(obj.m_RoomType))) return false;
  if (!(ks.putInt64(obj.m_RoomUID))) return false;
  if (!(ks.putUInt32(obj.m_uiRoomListID))) return false;
  if (!(ks.putWString(obj.m_RoomName))) return false;
  if (!(ks.putInt8(obj.m_RoomState))) return false;
  if (!(ks.putBool(obj.m_bPublic))) return false;
  if (!(ks.putBool(obj.m_bTeamBalance))) return false;
  if (!(ks.putWString(obj.m_wstrPassword))) return false;
  if (!(ks.putInt8(obj.m_MaxSlot))) return false;
  if (!(ks.putInt8(obj.m_JoinSlot))) return false;
  if (!(ks.putWString(obj.m_wstrUDPRelayIP))) return false;
  if (!(ks.putUInt16(obj.m_usUDPRelayPort))) return false;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putBool((obj.m_bStartedByAutoParty ?? false)))) return false; }
  if (!(ks.putInt8(obj.m_PVPGameType))) return false;
  if (Boolean(f.DUNGEON_ITEM)) { if (!(ks.putBool((obj.m_bIsItemMode ?? false)))) return false; }
  if (!(ks.putInt32(obj.m_iPVPChannelClass))) return false;
  if (!(ks.putInt8(obj.m_WinKillNum))) return false;
  if (!(ks.putBool(obj.m_bCanIntrude))) return false;
  if (!(ks.putFloat32(obj.m_fPlayTime))) return false;
  if (!(ks.putInt16(obj.m_WorldID))) return false;
  if (!(ks.putInt16(obj.m_ShowPvpMapWorldID))) return false;
  if (!(ks.putInt8(obj.m_DifficultyLevel))) return false;
  if (!(ks.putInt32(obj.m_iDungeonID))) return false;
  if (!(ks.putInt8(obj.m_cGetItemType))) return false;
  if (!(ks.putInt8(obj.m_cDungeonMode))) return false;
  if (!(ks.putInt64(obj.m_iPartyUID))) return false;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iBattleFieldID ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_REMATCH)) { if (!(ks.putMap((obj.m_mapAllPlayersSelectedMap ?? new Map<Int16, Int32>()), (ks, k: Int16) => ks.putInt16(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
  if (Boolean(f.SERV_NEW_DEFENCE_DUNGEON)) { if (!(ks.putBool((obj.m_bDefenceDungeonOpen ?? false)))) return false; }
  return true;
}
export function getKRoomInfo(ks: KSerializer, flags?: FlagInput): KRoomInfo {
  const f = resolveFlags(flags);
  const obj = createKRoomInfo(f);
  obj.m_RoomType = ks.getInt8();
  obj.m_RoomUID = ks.getInt64();
  obj.m_uiRoomListID = ks.getUInt32();
  obj.m_RoomName = ks.getWString();
  obj.m_RoomState = ks.getInt8();
  obj.m_bPublic = ks.getBool();
  obj.m_bTeamBalance = ks.getBool();
  obj.m_wstrPassword = ks.getWString();
  obj.m_MaxSlot = ks.getInt8();
  obj.m_JoinSlot = ks.getInt8();
  obj.m_wstrUDPRelayIP = ks.getWString();
  obj.m_usUDPRelayPort = ks.getUInt16();
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_bStartedByAutoParty = ks.getBool(); }
  obj.m_PVPGameType = ks.getInt8();
  if (Boolean(f.DUNGEON_ITEM)) { obj.m_bIsItemMode = ks.getBool(); }
  obj.m_iPVPChannelClass = ks.getInt32();
  obj.m_WinKillNum = ks.getInt8();
  obj.m_bCanIntrude = ks.getBool();
  obj.m_fPlayTime = ks.getFloat32();
  obj.m_WorldID = ks.getInt16();
  obj.m_ShowPvpMapWorldID = ks.getInt16();
  obj.m_DifficultyLevel = ks.getInt8();
  obj.m_iDungeonID = ks.getInt32();
  obj.m_cGetItemType = ks.getInt8();
  obj.m_cDungeonMode = ks.getInt8();
  obj.m_iPartyUID = ks.getInt64();
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iBattleFieldID = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_REMATCH)) { obj.m_mapAllPlayersSelectedMap = ks.getMap<Int16, Int32>((ks) => ks.getInt16(), (ks) => ks.getInt32()); }
  if (Boolean(f.SERV_NEW_DEFENCE_DUNGEON)) { obj.m_bDefenceDungeonOpen = ks.getBool(); }
  return obj;
}

export interface KTCInfo {
  m_iTCID: Int32;
  m_iDungeonID: Int32;
  m_RoomUID: UidType;
  m_cRoomType: Int8;
  m_wstrUDPRelayIP: string;
  m_usUDPRelayPort: UInt16;
  m_fPlayTime: Float32;
}
export function createKTCInfo(flags?: FlagInput): KTCInfo {
  const f = resolveFlags(flags);
  return {
    m_iTCID: 0,
    m_iDungeonID: 0,
    m_RoomUID: 0n,
    m_cRoomType: 0,
    m_wstrUDPRelayIP: '',
    m_usUDPRelayPort: 0,
    m_fPlayTime: 0,
  };
}
export function putKTCInfo(ks: KSerializer, obj: KTCInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iTCID))) return false;
  if (!(ks.putInt32(obj.m_iDungeonID))) return false;
  if (!(ks.putInt64(obj.m_RoomUID))) return false;
  if (!(ks.putInt8(obj.m_cRoomType))) return false;
  if (!(ks.putWString(obj.m_wstrUDPRelayIP))) return false;
  if (!(ks.putUInt16(obj.m_usUDPRelayPort))) return false;
  if (!(ks.putFloat32(obj.m_fPlayTime))) return false;
  return true;
}
export function getKTCInfo(ks: KSerializer, flags?: FlagInput): KTCInfo {
  const f = resolveFlags(flags);
  const obj = createKTCInfo(f);
  obj.m_iTCID = ks.getInt32();
  obj.m_iDungeonID = ks.getInt32();
  obj.m_RoomUID = ks.getInt64();
  obj.m_cRoomType = ks.getInt8();
  obj.m_wstrUDPRelayIP = ks.getWString();
  obj.m_usUDPRelayPort = ks.getUInt16();
  obj.m_fPlayTime = ks.getFloat32();
  return obj;
}

export interface KSubQuestData {
  m_iInInventoryItemCount?: Int32;
  m_bSussece?: boolean;
}
export function createKSubQuestData(flags?: FlagInput): KSubQuestData {
  const f = resolveFlags(flags);
  const obj: KSubQuestData = {
  };
  if (Boolean(f.SERV_REFORM_QUEST)) obj.m_iInInventoryItemCount = 0;
  if (Boolean(f.SERV_REFORM_QUEST)) obj.m_bSussece = false;
  return obj;
}
export function putKSubQuestData(ks: KSerializer, obj: KSubQuestData, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_REFORM_QUEST)) {
    if (Boolean(f.SERV_REFORM_QUEST)) { if (!(ks.putInt32((obj.m_iInInventoryItemCount ?? 0)))) return false; }
    if (Boolean(f.SERV_REFORM_QUEST)) { if (!(ks.putBool((obj.m_bSussece ?? false)))) return false; }
  }
  return true;
}
export function getKSubQuestData(ks: KSerializer, flags?: FlagInput): KSubQuestData {
  const f = resolveFlags(flags);
  const obj = createKSubQuestData(f);
  if (Boolean(f.SERV_REFORM_QUEST)) {
    if (Boolean(f.SERV_REFORM_QUEST)) { obj.m_iInInventoryItemCount = ks.getInt32(); }
    if (Boolean(f.SERV_REFORM_QUEST)) { obj.m_bSussece = ks.getBool(); }
  }
  return obj;
}

export interface KSubQuestInfo {
  m_mapSubQuestInfo: Map<Int32, KSubQuestData> | Map<Int32, Int32>;
}
export function createKSubQuestInfo(flags?: FlagInput): KSubQuestInfo {
  const f = resolveFlags(flags);
  const obj: KSubQuestInfo = {
    m_mapSubQuestInfo: (Boolean(f.SERV_REFORM_QUEST)) ? new Map<Int32, KSubQuestData>() : new Map<Int32, Int32>(),
  };
  return obj;
}
export function putKSubQuestInfo(ks: KSerializer, obj: KSubQuestInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_REFORM_QUEST)) { if (!(ks.putMap((obj.m_mapSubQuestInfo as Map<Int32, KSubQuestData>), (ks, k: Int32) => ks.putInt32(k), (ks, v: KSubQuestData) => ks.putUserClass(v, putKSubQuestData, f)))) return false; }
  else if (!f.SERV_REFORM_QUEST) { if (!(ks.putMap((obj.m_mapSubQuestInfo as Map<Int32, Int32>), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
  return true;
}
export function getKSubQuestInfo(ks: KSerializer, flags?: FlagInput): KSubQuestInfo {
  const f = resolveFlags(flags);
  const obj = createKSubQuestInfo(f);
  if (Boolean(f.SERV_REFORM_QUEST)) { obj.m_mapSubQuestInfo = ks.getMap<Int32, KSubQuestData>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKSubQuestData, f)); }
  else if (!f.SERV_REFORM_QUEST) { obj.m_mapSubQuestInfo = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
  return obj;
}

export interface KPetInfo {
  m_iPetUID?: UidType;
  m_iPetID?: Int32;
  m_cPetID?: Int8;
  m_wstrPetName?: string;
  m_cEvolutionStep?: Int8;
  m_sSatiety?: Int16;
  m_iIntimacy?: Int32;
  m_sExtroversion?: Int16;
  m_sEmotion?: Int16;
  m_bAutoFeed?: boolean;
  m_wstrLastFeedDate?: string;
  m_wstrLastSummonDate?: string;
  m_wstrRegDate?: string;
  m_bAutoLooting?: boolean;
  m_bEventFoodEat?: boolean;
  m_bIsEventPetID?: boolean;
  m_bFreeAutoLooting?: boolean;
  m_wstrDestroyDate?: string;
}
export function createKPetInfo(flags?: FlagInput): KPetInfo {
  const f = resolveFlags(flags);
  const obj: KPetInfo = {
  };
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_iPetUID = 0n;
  if (f.SERV_PET_SYSTEM && f.SERV_PETID_DATA_TYPE_CHANGE) obj.m_iPetID = 0;
  if (f.SERV_PET_SYSTEM && !f.SERV_PETID_DATA_TYPE_CHANGE) obj.m_cPetID = 0;
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_wstrPetName = '';
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_cEvolutionStep = 0;
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_sSatiety = 0;
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_iIntimacy = 0;
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_sExtroversion = 0;
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_sEmotion = 0;
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_bAutoFeed = false;
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_wstrLastFeedDate = '';
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_wstrLastSummonDate = '';
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_wstrRegDate = '';
  if (f.SERV_PET_SYSTEM && f.SERV_PET_AUTO_LOOTING) obj.m_bAutoLooting = false;
  if (f.SERV_PET_SYSTEM && f.SERV_EVENT_PET_INVENTORY) obj.m_bEventFoodEat = false;
  if (f.SERV_PET_SYSTEM && f.SERV_EVENT_PET_INVENTORY) obj.m_bIsEventPetID = false;
  if (f.SERV_PET_SYSTEM && f.SERV_FREE_AUTO_LOOTING) obj.m_bFreeAutoLooting = false;
  if (f.SERV_PET_SYSTEM && f.SERV_PERIOD_PET) obj.m_wstrDestroyDate = '';
  return obj;
}
export function putKPetInfo(ks: KSerializer, obj: KPetInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PET_SYSTEM)) {
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putInt64((obj.m_iPetUID ?? 0n)))) return false; }
    if (f.SERV_PET_SYSTEM && f.SERV_PETID_DATA_TYPE_CHANGE) { if (!(ks.putInt32((obj.m_iPetID ?? 0)))) return false; }
    if (f.SERV_PET_SYSTEM && !f.SERV_PETID_DATA_TYPE_CHANGE) { if (!(ks.putInt8((obj.m_cPetID ?? 0)))) return false; }
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putWString((obj.m_wstrPetName ?? '')))) return false; }
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putInt8((obj.m_cEvolutionStep ?? 0)))) return false; }
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putInt16((obj.m_sSatiety ?? 0)))) return false; }
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putInt32((obj.m_iIntimacy ?? 0)))) return false; }
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putInt16((obj.m_sExtroversion ?? 0)))) return false; }
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putInt16((obj.m_sEmotion ?? 0)))) return false; }
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putBool((obj.m_bAutoFeed ?? false)))) return false; }
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putWString((obj.m_wstrLastFeedDate ?? '')))) return false; }
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putWString((obj.m_wstrLastSummonDate ?? '')))) return false; }
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putWString((obj.m_wstrRegDate ?? '')))) return false; }
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putBool((obj.m_bAutoLooting ?? false)))) return false; }
    if (f.SERV_PET_SYSTEM && f.SERV_EVENT_PET_INVENTORY) { if (!(ks.putBool((obj.m_bEventFoodEat ?? false)))) return false; }
    if (f.SERV_PET_SYSTEM && f.SERV_EVENT_PET_INVENTORY) { if (!(ks.putBool((obj.m_bIsEventPetID ?? false)))) return false; }
    if (f.SERV_PET_SYSTEM && f.SERV_FREE_AUTO_LOOTING) { if (!(ks.putBool((obj.m_bFreeAutoLooting ?? false)))) return false; }
    if (f.SERV_PET_SYSTEM && f.SERV_PERIOD_PET) { if (!(ks.putWString((obj.m_wstrDestroyDate ?? '')))) return false; }
  }
  return true;
}
export function getKPetInfo(ks: KSerializer, flags?: FlagInput): KPetInfo {
  const f = resolveFlags(flags);
  const obj = createKPetInfo(f);
  if (Boolean(f.SERV_PET_SYSTEM)) {
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_iPetUID = ks.getInt64(); }
    if (f.SERV_PET_SYSTEM && f.SERV_PETID_DATA_TYPE_CHANGE) { obj.m_iPetID = ks.getInt32(); }
    if (f.SERV_PET_SYSTEM && !f.SERV_PETID_DATA_TYPE_CHANGE) { obj.m_cPetID = ks.getInt8(); }
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_wstrPetName = ks.getWString(); }
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_cEvolutionStep = ks.getInt8(); }
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_sSatiety = ks.getInt16(); }
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_iIntimacy = ks.getInt32(); }
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_sExtroversion = ks.getInt16(); }
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_sEmotion = ks.getInt16(); }
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_bAutoFeed = ks.getBool(); }
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_wstrLastFeedDate = ks.getWString(); }
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_wstrLastSummonDate = ks.getWString(); }
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_wstrRegDate = ks.getWString(); }
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_bAutoLooting = ks.getBool(); }
    if (f.SERV_PET_SYSTEM && f.SERV_EVENT_PET_INVENTORY) { obj.m_bEventFoodEat = ks.getBool(); }
    if (f.SERV_PET_SYSTEM && f.SERV_EVENT_PET_INVENTORY) { obj.m_bIsEventPetID = ks.getBool(); }
    if (f.SERV_PET_SYSTEM && f.SERV_FREE_AUTO_LOOTING) { obj.m_bFreeAutoLooting = ks.getBool(); }
    if (f.SERV_PET_SYSTEM && f.SERV_PERIOD_PET) { obj.m_wstrDestroyDate = ks.getWString(); }
  }
  return obj;
}

export interface KFieldPetInfo {
  m_iPetUID?: UidType;
  m_iPetID?: Int32;
  m_cPetID?: Int8;
  m_wstrPetName?: string;
  m_cEvolutionStep?: Int8;
  m_iIntimacy?: Int32;
}
export function createKFieldPetInfo(flags?: FlagInput): KFieldPetInfo {
  const f = resolveFlags(flags);
  const obj: KFieldPetInfo = {
  };
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_iPetUID = 0n;
  if (f.SERV_PET_SYSTEM && f.SERV_PETID_DATA_TYPE_CHANGE) obj.m_iPetID = 0;
  if (f.SERV_PET_SYSTEM && !f.SERV_PETID_DATA_TYPE_CHANGE) obj.m_cPetID = 0;
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_wstrPetName = '';
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_cEvolutionStep = 0;
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_iIntimacy = 0;
  return obj;
}
export function putKFieldPetInfo(ks: KSerializer, obj: KFieldPetInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PET_SYSTEM)) {
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putInt64((obj.m_iPetUID ?? 0n)))) return false; }
    if (f.SERV_PET_SYSTEM && f.SERV_PETID_DATA_TYPE_CHANGE) { if (!(ks.putInt32((obj.m_iPetID ?? 0)))) return false; }
    if (f.SERV_PET_SYSTEM && !f.SERV_PETID_DATA_TYPE_CHANGE) { if (!(ks.putInt8((obj.m_cPetID ?? 0)))) return false; }
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putWString((obj.m_wstrPetName ?? '')))) return false; }
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putInt8((obj.m_cEvolutionStep ?? 0)))) return false; }
    if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putInt32((obj.m_iIntimacy ?? 0)))) return false; }
  }
  return true;
}
export function getKFieldPetInfo(ks: KSerializer, flags?: FlagInput): KFieldPetInfo {
  const f = resolveFlags(flags);
  const obj = createKFieldPetInfo(f);
  if (Boolean(f.SERV_PET_SYSTEM)) {
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_iPetUID = ks.getInt64(); }
    if (f.SERV_PET_SYSTEM && f.SERV_PETID_DATA_TYPE_CHANGE) { obj.m_iPetID = ks.getInt32(); }
    if (f.SERV_PET_SYSTEM && !f.SERV_PETID_DATA_TYPE_CHANGE) { obj.m_cPetID = ks.getInt8(); }
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_wstrPetName = ks.getWString(); }
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_cEvolutionStep = ks.getInt8(); }
    if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_iIntimacy = ks.getInt32(); }
  }
  return obj;
}

export const KGamePlayStatus_CHAR_ABIL_TYPE = {
  CAC_NONE: 0,
  CAC_WSP: 1,
  CAC_CANNON_BALL_COUNT: 2,
  CAC_FORCE_POWER: 3,
  CAC_NP_AND_MUTATION_AND_FORMATION_MODE: 4,
  CAC_NATURAL_FORCE: 5,
} as const;
export type KGamePlayStatus_CHAR_ABIL_TYPE = (typeof KGamePlayStatus_CHAR_ABIL_TYPE)[keyof typeof KGamePlayStatus_CHAR_ABIL_TYPE];
export function getKGamePlayStatus_CHAR_ABIL_TYPE(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    cur = 0;
    out['CAC_NONE'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    out['CAC_WSP'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    out['CAC_CANNON_BALL_COUNT'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    out['CAC_FORCE_POWER'] = cur;
    cur += 1;
  }
  if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_9TH_NEW_CHARACTER) {
    out['CAC_NP_AND_MUTATION_AND_FORMATION_MODE'] = cur;
    cur += 1;
  }
  if (f.SERV_BATTLE_FIELD_SYSTEM && f.ADD_RENA_SYSTEM) {
    out['CAC_NATURAL_FORCE'] = cur;
    cur += 1;
  }
  return out;
}
export const KGamePlayStatus_COOL_TIME_TYPE = {
  CTT_SKILL_COOL_TIME: 0,
  CTT_QUICK_SLOT_COOL_TIME: 1,
  CTT_RIDING_PET_COOL_TIME: 2,
} as const;
export type KGamePlayStatus_COOL_TIME_TYPE = (typeof KGamePlayStatus_COOL_TIME_TYPE)[keyof typeof KGamePlayStatus_COOL_TIME_TYPE];
export function getKGamePlayStatus_COOL_TIME_TYPE(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    cur = 0;
    out['CTT_SKILL_COOL_TIME'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    out['CTT_QUICK_SLOT_COOL_TIME'] = cur;
    cur += 1;
  }
  if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_RIDING_PET_SYSTM) {
    out['CTT_RIDING_PET_COOL_TIME'] = cur;
    cur += 1;
  }
  return out;
}
export interface KGamePlayStatus {
  m_iMaxHP?: Int32;
  m_iCurHP?: Int32;
  m_iMaxMP?: Int32;
  m_iCurMP?: Int32;
  m_iCurHyperGage?: Int32;
  m_cCurHyperCount?: Int8;
  m_cCharAbilType?: Int8;
  m_iCharAbilCount?: Int32;
  m_mapSkillCoolTime?: Map<Int32, Int32>;
  m_mapQuickSlotCoolTime?: Map<Int32, Int32>;
  m_mapPetMP?: Set<Int32>;
  m_mapRidingPetCoolTime?: Map<Int32, Int32>;
}
export function createKGamePlayStatus(flags?: FlagInput): KGamePlayStatus {
  const f = resolveFlags(flags);
  const obj: KGamePlayStatus = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iMaxHP = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iCurHP = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iMaxMP = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iCurMP = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iCurHyperGage = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_cCurHyperCount = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_cCharAbilType = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iCharAbilCount = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_mapSkillCoolTime = new Map<Int32, Int32>();
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_mapQuickSlotCoolTime = new Map<Int32, Int32>();
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_mapPetMP = new Set<Int32>();
  if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_RIDING_PET_SYSTM) obj.m_mapRidingPetCoolTime = new Map<Int32, Int32>();
  return obj;
}
export function putKGamePlayStatus(ks: KSerializer, obj: KGamePlayStatus, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iMaxHP ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iCurHP ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iMaxMP ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iCurMP ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iCurHyperGage ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_cCurHyperCount ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_cCharAbilType ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iCharAbilCount ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putMap((obj.m_mapSkillCoolTime ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putMap((obj.m_mapQuickSlotCoolTime ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putSet((obj.m_mapPetMP ?? new Set<Int32>()), (ks, item: Int32) => ks.putInt32(item)))) return false; }
    if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_RIDING_PET_SYSTM) { if (!(ks.putMap((obj.m_mapRidingPetCoolTime ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
  }
  return true;
}
export function getKGamePlayStatus(ks: KSerializer, flags?: FlagInput): KGamePlayStatus {
  const f = resolveFlags(flags);
  const obj = createKGamePlayStatus(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iMaxHP = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iCurHP = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iMaxMP = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iCurMP = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iCurHyperGage = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_cCurHyperCount = ks.getInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_cCharAbilType = ks.getInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iCharAbilCount = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_mapSkillCoolTime = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_mapQuickSlotCoolTime = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_mapPetMP = ks.getSet<Int32>((ks) => ks.getInt32()); }
    if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_RIDING_PET_SYSTM) { obj.m_mapRidingPetCoolTime = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
  }
  return obj;
}

export interface KGamePlayStatusContainer {
  m_vecGamePlayStatus?: KGamePlayStatus[];
}
export function createKGamePlayStatusContainer(flags?: FlagInput): KGamePlayStatusContainer {
  const f = resolveFlags(flags);
  const obj: KGamePlayStatusContainer = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_vecGamePlayStatus = ([] as KGamePlayStatus[]);
  return obj;
}
export function putKGamePlayStatusContainer(ks: KSerializer, obj: KGamePlayStatusContainer, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putVector((obj.m_vecGamePlayStatus ?? ([] as KGamePlayStatus[])), (ks, item: KGamePlayStatus) => ks.putUserClass(item, putKGamePlayStatus, f)))) return false; }
  }
  return true;
}
export function getKGamePlayStatusContainer(ks: KSerializer, flags?: FlagInput): KGamePlayStatusContainer {
  const f = resolveFlags(flags);
  const obj = createKGamePlayStatusContainer(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_vecGamePlayStatus = ks.getVector<KGamePlayStatus>((ks) => ks.getUserClass(getKGamePlayStatus, f)); }
  }
  return obj;
}

export interface KPartyMemberStatus {
  m_fHpPercent?: Float32;
  m_fMpPercent?: Float32;
}
export function createKPartyMemberStatus(flags?: FlagInput): KPartyMemberStatus {
  const f = resolveFlags(flags);
  const obj: KPartyMemberStatus = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_fHpPercent = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_fMpPercent = 0;
  return obj;
}
export function putKPartyMemberStatus(ks: KSerializer, obj: KPartyMemberStatus, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putFloat32((obj.m_fHpPercent ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putFloat32((obj.m_fMpPercent ?? 0)))) return false; }
  }
  return true;
}
export function getKPartyMemberStatus(ks: KSerializer, flags?: FlagInput): KPartyMemberStatus {
  const f = resolveFlags(flags);
  const obj = createKPartyMemberStatus(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_fHpPercent = ks.getFloat32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_fMpPercent = ks.getFloat32(); }
  }
  return obj;
}

export const KRoomUserInfo_BONUS_TYPE = {
  BT_PREMIUM_EXP_RATE: 0,
  BT_SOCKET_OPT_EXP_RATE: 1,
  BT_CHANNEL_BONUS_EXP_RATE: 2,
  BT_SOCKET_OPT_ED_RATE: 3,
  BT_GUILD_BONUS_EXP_RATE: 4,
  BT_GEV_EXP: 5,
  BT_GEV_VP: 6,
  BT_GEV_ED: 7,
  BT_GEV_PARTY_EXP: 8,
  BT_GEV_PARTY_VP: 9,
  BT_GEV_PARTY_ED: 10,
  BT_GEV_WITH_CHAR_EXP: 11,
  BT_GEV_RANKING_POINT: 12,
  BT_GEV_PARTY_RANKING_POINT: 13,
} as const;
export type KRoomUserInfo_BONUS_TYPE = (typeof KRoomUserInfo_BONUS_TYPE)[keyof typeof KRoomUserInfo_BONUS_TYPE];
export interface KRoomUserInfo {
  m_iGSUID: UidType;
  m_iOwnerUserUID: UidType;
  m_sServerGroupID?: Int16;
  m_cAuthLevel: Int8;
  m_bMale: boolean;
  m_ucAge: UInt8;
  m_nUnitUID: UidType;
  m_uiKNMSerialNum: UInt32;
  m_cUnitClass: Int8;
  m_wstrNickName: string;
  m_iNumResurrectionStone?: Int32;
  m_wstrIP: string;
  m_usPort: UInt16;
  m_wstrInternalIP: string;
  m_usInternalPort: UInt16;
  m_iPartyUID?: UidType;
  m_vecGamePlayStatus?: KGamePlayStatus[];
  m_vecBuffInfo?: KBuffInfo[];
  m_ucLevel: UInt8;
  m_kGameStat: KStat;
  m_mapEquippedItem: Map<Int32, KInventoryItemInfo>;
  m_mapSpecialItem?: Map<Int32, KInventoryItemInfo>;
  m_UnitSkillData: KUnitSkillData;
  m_bIsPvpNpc: boolean;
  m_iOfficialMatchCnt: Int32;
  m_iRating: Int32;
  m_iMaxRating: Int32;
  m_bIsWinBeforeMatch: boolean;
  m_cRank?: Int8;
  m_cRankForServer?: Int8;
  m_fKFactor?: Float32;
  m_bIsRedistributionUser?: boolean;
  m_iSpiritMax?: Int32;
  m_iSpirit?: Int32;
  m_bIsGameBang: boolean;
  m_iPcBangType?: Int32;
  m_bIsObserver: boolean;
  m_mapBonusRate: Map<Int8, Float32>;
  m_bIsRingofpvprebirth: boolean;
  m_bIsGuestUser: boolean;
  m_mapOngoingQuest: Map<Int32, KSubQuestInfo>;
  m_iTitleID: Int32;
  m_iGuildUID?: Int32;
  m_wstrGuildName?: string;
  m_ucMemberShipGrade?: UInt8;
  m_vecPet?: KPetInfo[];
  m_setQuestInfo?: Set<Int32>;
  m_bUseItem?: boolean;
  m_setGoingQuestInfo?: Set<Int32>;
  m_bComeBackUser?: boolean;
  m_bHenirReward?: boolean;
  m_setUseSkillBuffInPlay?: Set<Int32>;
  m_bEnterCashShop?: boolean;
  m_iRidingPetUID?: UidType;
  m_usRidingPetID?: UInt16;
  m_cWeddingStatus?: Int8;
  m_iLoverUnitUID?: UidType;
  m_iEventQuestClearCount?: Int32;
  m_iExchangeCount?: Int32;
  m_bMaxLevelUnitInAccount?: boolean;
  m_iGateOfDarknessSupportEventTime?: Int32;
  m_bCouple?: boolean;
  m_iRelationTargetUserUid?: UidType;
  m_wstrRelationTargetUserNickname?: string;
  m_iRecruiterUnitUID?: UidType;
  m_vecRecruitUnitUID?: UidType[];
  m_iValentineItemCount?: Int32;
  m_iAccountPVPLoseCount?: UInt32;
}
export function createKRoomUserInfo(flags?: FlagInput): KRoomUserInfo {
  const f = resolveFlags(flags);
  const obj: KRoomUserInfo = {
    m_iGSUID: 0n,
    m_iOwnerUserUID: 0n,
    m_cAuthLevel: 0,
    m_bMale: false,
    m_ucAge: 0,
    m_nUnitUID: 0n,
    m_uiKNMSerialNum: 0,
    m_cUnitClass: 0,
    m_wstrNickName: '',
    m_wstrIP: '',
    m_usPort: 0,
    m_wstrInternalIP: '',
    m_usInternalPort: 0,
    m_ucLevel: 0,
    m_kGameStat: createKStat(f),
    m_mapEquippedItem: new Map<Int32, KInventoryItemInfo>(),
    m_UnitSkillData: createKUnitSkillData(f),
    m_bIsPvpNpc: false,
    m_iOfficialMatchCnt: 0,
    m_iRating: 0,
    m_iMaxRating: 0,
    m_bIsWinBeforeMatch: false,
    m_bIsGameBang: false,
    m_bIsObserver: false,
    m_mapBonusRate: new Map<Int8, Float32>(),
    m_bIsRingofpvprebirth: false,
    m_bIsGuestUser: false,
    m_mapOngoingQuest: new Map<Int32, KSubQuestInfo>(),
    m_iTitleID: 0,
  };
  if (Boolean(f.SERV_SERVER_GROUP_EVENT_SYSTEM)) obj.m_sServerGroupID = -1;
  if (Boolean(f.SERV_ADD_DUNGEON_LOG_COLUMN_NUM_2)) obj.m_iNumResurrectionStone = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iPartyUID = 0n;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_vecGamePlayStatus = ([] as KGamePlayStatus[]);
  if (Boolean(f.SERV_REFORM_THE_GATE_OF_DARKNESS)) obj.m_vecBuffInfo = ([] as KBuffInfo[]);
  if (Boolean(f.SERV_PAYMENT_ITEM_WITH_CONSUMING_OTHER_ITEM)) obj.m_mapSpecialItem = new Map<Int32, KInventoryItemInfo>();
  if (Boolean(f.SERV_2012_PVP_SEASON2)) obj.m_cRank = 0;
  if (Boolean(f.SERV_2012_PVP_SEASON2)) obj.m_cRankForServer = 0;
  if (Boolean(f.SERV_2012_PVP_SEASON2)) obj.m_fKFactor = 0.0;
  if (Boolean(f.SERV_2012_PVP_SEASON2)) obj.m_bIsRedistributionUser = false;
  if (!f.SERV_DELETE_ROOM_USER_INFO_DATA) obj.m_iSpiritMax = 0;
  if (!f.SERV_DELETE_ROOM_USER_INFO_DATA) obj.m_iSpirit = 0;
  if (Boolean(f.SERV_PC_BANG_TYPE)) obj.m_iPcBangType = -1;
  if (Boolean(f.GUILD_TEST)) obj.m_iGuildUID = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_wstrGuildName = '';
  if (Boolean(f.GUILD_TEST)) obj.m_ucMemberShipGrade = 0;
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_vecPet = ([] as KPetInfo[]);
  if (Boolean(f.SERV_DUNGEON_CLEAR_PAYMENT_ITEM)) obj.m_setQuestInfo = new Set<Int32>();
  if (f.SERV_DUNGEON_CLEAR_PAYMENT_ITEM && f.SERV_DUNGEON_CLEAR_PAYMENT_ITEM_FIX) obj.m_bUseItem = false;
  if (Boolean(f.SERV_PAYMENT_ITEM_ON_GOING_QUEST)) obj.m_setGoingQuestInfo = new Set<Int32>();
  if (Boolean(f.SERV_COME_BACK_USER_REWARD)) obj.m_bComeBackUser = false;
  if (Boolean(f.SERV_NEW_HENIR_TEST)) obj.m_bHenirReward = false;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_setUseSkillBuffInPlay = new Set<Int32>();
  if (Boolean(f.SERV_VISIT_CASH_SHOP)) obj.m_bEnterCashShop = false;
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) obj.m_iRidingPetUID = 0n;
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) obj.m_usRidingPetID = 0;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_cWeddingStatus = 0;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_iLoverUnitUID = 0n;
  if (Boolean(f.SERV_GROW_UP_SOCKET)) obj.m_iEventQuestClearCount = 0;
  if (Boolean(f.SERV_GROW_UP_SOCKET)) obj.m_iExchangeCount = 0;
  if (Boolean(f.SERV_BLESS_OF_GODDESS_EVENT)) obj.m_bMaxLevelUnitInAccount = false;
  if (Boolean(f.SERV_GATE_OF_DARKNESS_SUPPORT_EVENT)) obj.m_iGateOfDarknessSupportEventTime = 0;
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) obj.m_bCouple = false;
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) obj.m_iRelationTargetUserUid = 0n;
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) obj.m_wstrRelationTargetUserNickname = '';
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) obj.m_iRecruiterUnitUID = 0n;
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) obj.m_vecRecruitUnitUID = ([] as UidType[]);
  if (Boolean(f.SERV_EVENT_VALENTINE_DUNGEON_GIVE_ITEM)) obj.m_iValentineItemCount = -1;
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_iAccountPVPLoseCount = 0;
  return obj;
}
export function putKRoomUserInfo(ks: KSerializer, obj: KRoomUserInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iGSUID))) return false;
  if (!(ks.putInt64(obj.m_iOwnerUserUID))) return false;
  if (Boolean(f.SERV_SERVER_GROUP_EVENT_SYSTEM)) { if (!(ks.putInt16((obj.m_sServerGroupID ?? -1)))) return false; }
  if (!(ks.putInt8(obj.m_cAuthLevel))) return false;
  if (!(ks.putBool(obj.m_bMale))) return false;
  if (!(ks.putUInt8(obj.m_ucAge))) return false;
  if (!(ks.putInt64(obj.m_nUnitUID))) return false;
  if (!(ks.putUInt32(obj.m_uiKNMSerialNum))) return false;
  if (!(ks.putInt8(obj.m_cUnitClass))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (Boolean(f.SERV_ADD_DUNGEON_LOG_COLUMN_NUM_2)) { if (!(ks.putInt32((obj.m_iNumResurrectionStone ?? 0)))) return false; }
  if (!(ks.putWString(obj.m_wstrIP))) return false;
  if (!(ks.putUInt16(obj.m_usPort))) return false;
  if (!(ks.putWString(obj.m_wstrInternalIP))) return false;
  if (!(ks.putUInt16(obj.m_usInternalPort))) return false;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt64((obj.m_iPartyUID ?? 0n)))) return false; }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putVector((obj.m_vecGamePlayStatus ?? ([] as KGamePlayStatus[])), (ks, item: KGamePlayStatus) => ks.putUserClass(item, putKGamePlayStatus, f)))) return false; }
  if (Boolean(f.SERV_REFORM_THE_GATE_OF_DARKNESS)) { if (!(ks.putVector((obj.m_vecBuffInfo ?? ([] as KBuffInfo[])), (ks, item: KBuffInfo) => ks.putUserClass(item, putKBuffInfo, f)))) return false; }
  if (!(ks.putUInt8(obj.m_ucLevel))) return false;
  if (!(ks.putUserClass(obj.m_kGameStat, putKStat, f))) return false;
  if (!(ks.putMap(obj.m_mapEquippedItem, (ks, k: Int32) => ks.putInt32(k), (ks, v: KInventoryItemInfo) => ks.putUserClass(v, putKInventoryItemInfo, f)))) return false;
  if (Boolean(f.SERV_PAYMENT_ITEM_WITH_CONSUMING_OTHER_ITEM)) { if (!(ks.putMap((obj.m_mapSpecialItem ?? new Map<Int32, KInventoryItemInfo>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: KInventoryItemInfo) => ks.putUserClass(v, putKInventoryItemInfo, f)))) return false; }
  if (!(ks.putUserClass(obj.m_UnitSkillData, putKUnitSkillData, f))) return false;
  if (!(ks.putBool(obj.m_bIsPvpNpc))) return false;
  if (!(ks.putInt32(obj.m_iOfficialMatchCnt))) return false;
  if (!(ks.putInt32(obj.m_iRating))) return false;
  if (!(ks.putInt32(obj.m_iMaxRating))) return false;
  if (!(ks.putBool(obj.m_bIsWinBeforeMatch))) return false;
  if (Boolean(f.SERV_2012_PVP_SEASON2)) { if (!(ks.putInt8((obj.m_cRank ?? 0)))) return false; }
  if (Boolean(f.SERV_2012_PVP_SEASON2)) { if (!(ks.putInt8((obj.m_cRankForServer ?? 0)))) return false; }
  if (Boolean(f.SERV_2012_PVP_SEASON2)) { if (!(ks.putFloat32((obj.m_fKFactor ?? 0.0)))) return false; }
  if (Boolean(f.SERV_2012_PVP_SEASON2)) { if (!(ks.putBool((obj.m_bIsRedistributionUser ?? false)))) return false; }
  if (!f.SERV_DELETE_ROOM_USER_INFO_DATA) { if (!(ks.putInt32((obj.m_iSpiritMax ?? 0)))) return false; }
  if (!f.SERV_DELETE_ROOM_USER_INFO_DATA) { if (!(ks.putInt32((obj.m_iSpirit ?? 0)))) return false; }
  if (!(ks.putBool(obj.m_bIsGameBang))) return false;
  if (Boolean(f.SERV_PC_BANG_TYPE)) { if (!(ks.putInt32((obj.m_iPcBangType ?? -1)))) return false; }
  if (!(ks.putBool(obj.m_bIsObserver))) return false;
  if (!(ks.putMap(obj.m_mapBonusRate, (ks, k: Int8) => ks.putInt8(k), (ks, v: Float32) => ks.putFloat32(v)))) return false;
  if (!(ks.putBool(obj.m_bIsRingofpvprebirth))) return false;
  if (!(ks.putBool(obj.m_bIsGuestUser))) return false;
  if (!(ks.putMap(obj.m_mapOngoingQuest, (ks, k: Int32) => ks.putInt32(k), (ks, v: KSubQuestInfo) => ks.putUserClass(v, putKSubQuestInfo, f)))) return false;
  if (!(ks.putInt32(obj.m_iTitleID))) return false;
  if (Boolean(f.GUILD_TEST)) { if (!(ks.putWString((obj.m_wstrGuildName ?? '')))) return false; }
  if (Boolean(f.GUILD_TEST)) { if (!(ks.putInt32((obj.m_iGuildUID ?? 0)))) return false; }
  if (Boolean(f.GUILD_TEST)) { if (!(ks.putUInt8((obj.m_ucMemberShipGrade ?? 0)))) return false; }
  if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putVector((obj.m_vecPet ?? ([] as KPetInfo[])), (ks, item: KPetInfo) => ks.putUserClass(item, putKPetInfo, f)))) return false; }
  if (Boolean(f.SERV_DUNGEON_CLEAR_PAYMENT_ITEM)) { if (!(ks.putSet((obj.m_setQuestInfo ?? new Set<Int32>()), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  if (f.SERV_DUNGEON_CLEAR_PAYMENT_ITEM && f.SERV_DUNGEON_CLEAR_PAYMENT_ITEM_FIX) { if (!(ks.putBool((obj.m_bUseItem ?? false)))) return false; }
  if (Boolean(f.SERV_PAYMENT_ITEM_ON_GOING_QUEST)) { if (!(ks.putSet((obj.m_setGoingQuestInfo ?? new Set<Int32>()), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  if (Boolean(f.SERV_COME_BACK_USER_REWARD)) { if (!(ks.putBool((obj.m_bComeBackUser ?? false)))) return false; }
  if (Boolean(f.SERV_NEW_HENIR_TEST)) { if (!(ks.putBool((obj.m_bHenirReward ?? false)))) return false; }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putSet((obj.m_setUseSkillBuffInPlay ?? new Set<Int32>()), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  if (Boolean(f.SERV_VISIT_CASH_SHOP)) { if (!(ks.putBool((obj.m_bEnterCashShop ?? false)))) return false; }
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) { if (!(ks.putInt64((obj.m_iRidingPetUID ?? 0n)))) return false; }
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) { if (!(ks.putUInt16((obj.m_usRidingPetID ?? 0)))) return false; }
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt8((obj.m_cWeddingStatus ?? 0)))) return false; }
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt64((obj.m_iLoverUnitUID ?? 0n)))) return false; }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { if (!(ks.putInt32((obj.m_iEventQuestClearCount ?? 0)))) return false; }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { if (!(ks.putInt32((obj.m_iExchangeCount ?? 0)))) return false; }
  if (Boolean(f.SERV_BLESS_OF_GODDESS_EVENT)) { if (!(ks.putBool((obj.m_bMaxLevelUnitInAccount ?? false)))) return false; }
  if (Boolean(f.SERV_GATE_OF_DARKNESS_SUPPORT_EVENT)) { if (!(ks.putInt32((obj.m_iGateOfDarknessSupportEventTime ?? 0)))) return false; }
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { if (!(ks.putBool((obj.m_bCouple ?? false)))) return false; }
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { if (!(ks.putInt64((obj.m_iRelationTargetUserUid ?? 0n)))) return false; }
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { if (!(ks.putWString((obj.m_wstrRelationTargetUserNickname ?? '')))) return false; }
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { if (!(ks.putInt64((obj.m_iRecruiterUnitUID ?? 0n)))) return false; }
  if (Boolean(f.SERV_EVENT_VALENTINE_DUNGEON_GIVE_ITEM)) { if (!(ks.putInt32((obj.m_iValentineItemCount ?? -1)))) return false; }
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putUInt32((obj.m_iAccountPVPLoseCount ?? 0)))) return false; }
  return true;
}
export function getKRoomUserInfo(ks: KSerializer, flags?: FlagInput): KRoomUserInfo {
  const f = resolveFlags(flags);
  const obj = createKRoomUserInfo(f);
  obj.m_iGSUID = ks.getInt64();
  obj.m_iOwnerUserUID = ks.getInt64();
  if (Boolean(f.SERV_SERVER_GROUP_EVENT_SYSTEM)) { obj.m_sServerGroupID = ks.getInt16(); }
  obj.m_cAuthLevel = ks.getInt8();
  obj.m_bMale = ks.getBool();
  obj.m_ucAge = ks.getUInt8();
  obj.m_nUnitUID = ks.getInt64();
  obj.m_uiKNMSerialNum = ks.getUInt32();
  obj.m_cUnitClass = ks.getInt8();
  obj.m_wstrNickName = ks.getWString();
  if (Boolean(f.SERV_ADD_DUNGEON_LOG_COLUMN_NUM_2)) { obj.m_iNumResurrectionStone = ks.getInt32(); }
  obj.m_wstrIP = ks.getWString();
  obj.m_usPort = ks.getUInt16();
  obj.m_wstrInternalIP = ks.getWString();
  obj.m_usInternalPort = ks.getUInt16();
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iPartyUID = ks.getInt64(); }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_vecGamePlayStatus = ks.getVector<KGamePlayStatus>((ks) => ks.getUserClass(getKGamePlayStatus, f)); }
  if (Boolean(f.SERV_REFORM_THE_GATE_OF_DARKNESS)) { obj.m_vecBuffInfo = ks.getVector<KBuffInfo>((ks) => ks.getUserClass(getKBuffInfo, f)); }
  obj.m_ucLevel = ks.getUInt8();
  obj.m_kGameStat = ks.getUserClass(getKStat, f);
  obj.m_mapEquippedItem = ks.getMap<Int32, KInventoryItemInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKInventoryItemInfo, f));
  if (Boolean(f.SERV_PAYMENT_ITEM_WITH_CONSUMING_OTHER_ITEM)) { obj.m_mapSpecialItem = ks.getMap<Int32, KInventoryItemInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
  obj.m_UnitSkillData = ks.getUserClass(getKUnitSkillData, f);
  obj.m_bIsPvpNpc = ks.getBool();
  obj.m_iOfficialMatchCnt = ks.getInt32();
  obj.m_iRating = ks.getInt32();
  obj.m_iMaxRating = ks.getInt32();
  obj.m_bIsWinBeforeMatch = ks.getBool();
  if (Boolean(f.SERV_2012_PVP_SEASON2)) { obj.m_cRank = ks.getInt8(); }
  if (Boolean(f.SERV_2012_PVP_SEASON2)) { obj.m_cRankForServer = ks.getInt8(); }
  if (Boolean(f.SERV_2012_PVP_SEASON2)) { obj.m_fKFactor = ks.getFloat32(); }
  if (Boolean(f.SERV_2012_PVP_SEASON2)) { obj.m_bIsRedistributionUser = ks.getBool(); }
  if (!f.SERV_DELETE_ROOM_USER_INFO_DATA) { obj.m_iSpiritMax = ks.getInt32(); }
  if (!f.SERV_DELETE_ROOM_USER_INFO_DATA) { obj.m_iSpirit = ks.getInt32(); }
  obj.m_bIsGameBang = ks.getBool();
  if (Boolean(f.SERV_PC_BANG_TYPE)) { obj.m_iPcBangType = ks.getInt32(); }
  obj.m_bIsObserver = ks.getBool();
  obj.m_mapBonusRate = ks.getMap<Int8, Float32>((ks) => ks.getInt8(), (ks) => ks.getFloat32());
  obj.m_bIsRingofpvprebirth = ks.getBool();
  obj.m_bIsGuestUser = ks.getBool();
  obj.m_mapOngoingQuest = ks.getMap<Int32, KSubQuestInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKSubQuestInfo, f));
  obj.m_iTitleID = ks.getInt32();
  if (Boolean(f.GUILD_TEST)) { obj.m_wstrGuildName = ks.getWString(); }
  if (Boolean(f.GUILD_TEST)) { obj.m_iGuildUID = ks.getInt32(); }
  if (Boolean(f.GUILD_TEST)) { obj.m_ucMemberShipGrade = ks.getUInt8(); }
  if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_vecPet = ks.getVector<KPetInfo>((ks) => ks.getUserClass(getKPetInfo, f)); }
  if (Boolean(f.SERV_DUNGEON_CLEAR_PAYMENT_ITEM)) { obj.m_setQuestInfo = ks.getSet<Int32>((ks) => ks.getInt32()); }
  if (f.SERV_DUNGEON_CLEAR_PAYMENT_ITEM && f.SERV_DUNGEON_CLEAR_PAYMENT_ITEM_FIX) { obj.m_bUseItem = ks.getBool(); }
  if (Boolean(f.SERV_PAYMENT_ITEM_ON_GOING_QUEST)) { obj.m_setGoingQuestInfo = ks.getSet<Int32>((ks) => ks.getInt32()); }
  if (Boolean(f.SERV_COME_BACK_USER_REWARD)) { obj.m_bComeBackUser = ks.getBool(); }
  if (Boolean(f.SERV_NEW_HENIR_TEST)) { obj.m_bHenirReward = ks.getBool(); }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_setUseSkillBuffInPlay = ks.getSet<Int32>((ks) => ks.getInt32()); }
  if (Boolean(f.SERV_VISIT_CASH_SHOP)) { obj.m_bEnterCashShop = ks.getBool(); }
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) { obj.m_iRidingPetUID = ks.getInt64(); }
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) { obj.m_usRidingPetID = ks.getUInt16(); }
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_cWeddingStatus = ks.getInt8(); }
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_iLoverUnitUID = ks.getInt64(); }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { obj.m_iEventQuestClearCount = ks.getInt32(); }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { obj.m_iExchangeCount = ks.getInt32(); }
  if (Boolean(f.SERV_BLESS_OF_GODDESS_EVENT)) { obj.m_bMaxLevelUnitInAccount = ks.getBool(); }
  if (Boolean(f.SERV_GATE_OF_DARKNESS_SUPPORT_EVENT)) { obj.m_iGateOfDarknessSupportEventTime = ks.getInt32(); }
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { obj.m_bCouple = ks.getBool(); }
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { obj.m_iRelationTargetUserUid = ks.getInt64(); }
  if (Boolean(f.SERV_RELATIONSHIP_EVENT_INT)) { obj.m_wstrRelationTargetUserNickname = ks.getWString(); }
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { obj.m_iRecruiterUnitUID = ks.getInt64(); }
  if (Boolean(f.SERV_EVENT_VALENTINE_DUNGEON_GIVE_ITEM)) { obj.m_iValentineItemCount = ks.getInt32(); }
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_iAccountPVPLoseCount = ks.getUInt32(); }
  return obj;
}

export interface KRoomSlotInfo {
  m_Index: Int8;
  m_SlotState: Int8;
  m_bHost: boolean;
  m_bReady: boolean;
  m_bPitIn: boolean;
  m_bTrade: boolean;
  m_TeamNum: Int32;
  m_kRoomUserInfo: KRoomUserInfo;
}
export function createKRoomSlotInfo(flags?: FlagInput): KRoomSlotInfo {
  const f = resolveFlags(flags);
  return {
    m_Index: 0,
    m_SlotState: 0,
    m_bHost: false,
    m_bReady: false,
    m_bPitIn: false,
    m_bTrade: false,
    m_TeamNum: 0,
    m_kRoomUserInfo: createKRoomUserInfo(f),
  };
}
export function putKRoomSlotInfo(ks: KSerializer, obj: KRoomSlotInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt8(obj.m_Index))) return false;
  if (!(ks.putInt8(obj.m_SlotState))) return false;
  if (!(ks.putBool(obj.m_bHost))) return false;
  if (!(ks.putBool(obj.m_bReady))) return false;
  if (!(ks.putBool(obj.m_bPitIn))) return false;
  if (!(ks.putBool(obj.m_bTrade))) return false;
  if (!(ks.putInt32(obj.m_TeamNum))) return false;
  if (!(ks.putUserClass(obj.m_kRoomUserInfo, putKRoomUserInfo, f))) return false;
  return true;
}
export function getKRoomSlotInfo(ks: KSerializer, flags?: FlagInput): KRoomSlotInfo {
  const f = resolveFlags(flags);
  const obj = createKRoomSlotInfo(f);
  obj.m_Index = ks.getInt8();
  obj.m_SlotState = ks.getInt8();
  obj.m_bHost = ks.getBool();
  obj.m_bReady = ks.getBool();
  obj.m_bPitIn = ks.getBool();
  obj.m_bTrade = ks.getBool();
  obj.m_TeamNum = ks.getInt32();
  obj.m_kRoomUserInfo = ks.getUserClass(getKRoomUserInfo, f);
  return obj;
}

export interface KDungeonPlayResultInfo {
  m_fHP: Float32;
  m_nDamageCount: Int32;
  m_TotalScore: Int32;
  m_ComboScore: Int32;
  m_TechScore: Int32;
  m_iTotalGivenDamamge?: Int32;
  m_iTotalAttackedDamage?: Int32;
  m_iTotalSumNpcHP?: Int32;
  m_iTotalRecoveryHP?: Int32;
  m_iUsingKindOfSkill?: Int32;
  m_iCommandTechScore?: Int32;
  m_iSkillTechScore?: Int32;
  m_iDashCount?: Int32;
  m_iFrame?: Int32;
  m_bSkillSlotType?: boolean;
}
export function createKDungeonPlayResultInfo(flags?: FlagInput): KDungeonPlayResultInfo {
  const f = resolveFlags(flags);
  const obj: KDungeonPlayResultInfo = {
    m_fHP: 0.0,
    m_nDamageCount: 0,
    m_TotalScore: 0,
    m_ComboScore: 0,
    m_TechScore: 0,
  };
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) obj.m_iTotalGivenDamamge = 0;
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) obj.m_iTotalAttackedDamage = 0;
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) obj.m_iTotalSumNpcHP = 0;
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) obj.m_iTotalRecoveryHP = 0;
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) obj.m_iUsingKindOfSkill = 0;
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) obj.m_iCommandTechScore = 0;
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) obj.m_iSkillTechScore = 0;
  if (Boolean(f.SERV_DUNGEON_DASH_LOG)) obj.m_iDashCount = 0;
  if (Boolean(f.SERV_ADD_DUNGEON_LOG_COLUMN_NUM_2)) obj.m_iFrame = 0;
  if (Boolean(f.SERV_USE_SKILL_SLOT_TYPE_LOG)) obj.m_bSkillSlotType = true;
  return obj;
}
export function putKDungeonPlayResultInfo(ks: KSerializer, obj: KDungeonPlayResultInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putFloat32(obj.m_fHP))) return false;
  if (!(ks.putInt32(obj.m_nDamageCount))) return false;
  if (!(ks.putInt32(obj.m_TotalScore))) return false;
  if (!(ks.putInt32(obj.m_ComboScore))) return false;
  if (!(ks.putInt32(obj.m_TechScore))) return false;
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) { if (!(ks.putInt32((obj.m_iTotalGivenDamamge ?? 0)))) return false; }
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) { if (!(ks.putInt32((obj.m_iTotalAttackedDamage ?? 0)))) return false; }
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) { if (!(ks.putInt32((obj.m_iTotalSumNpcHP ?? 0)))) return false; }
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) { if (!(ks.putInt32((obj.m_iTotalRecoveryHP ?? 0)))) return false; }
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) { if (!(ks.putInt32((obj.m_iUsingKindOfSkill ?? 0)))) return false; }
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) { if (!(ks.putInt32((obj.m_iCommandTechScore ?? 0)))) return false; }
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) { if (!(ks.putInt32((obj.m_iSkillTechScore ?? 0)))) return false; }
  if (Boolean(f.SERV_DUNGEON_DASH_LOG)) { if (!(ks.putInt32((obj.m_iDashCount ?? 0)))) return false; }
  if (Boolean(f.SERV_ADD_DUNGEON_LOG_COLUMN_NUM_2)) { if (!(ks.putInt32((obj.m_iFrame ?? 0)))) return false; }
  if (Boolean(f.SERV_USE_SKILL_SLOT_TYPE_LOG)) { if (!(ks.putBool((obj.m_bSkillSlotType ?? true)))) return false; }
  return true;
}
export function getKDungeonPlayResultInfo(ks: KSerializer, flags?: FlagInput): KDungeonPlayResultInfo {
  const f = resolveFlags(flags);
  const obj = createKDungeonPlayResultInfo(f);
  obj.m_fHP = ks.getFloat32();
  obj.m_nDamageCount = ks.getInt32();
  obj.m_TotalScore = ks.getInt32();
  obj.m_ComboScore = ks.getInt32();
  obj.m_TechScore = ks.getInt32();
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) { obj.m_iTotalGivenDamamge = ks.getInt32(); }
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) { obj.m_iTotalAttackedDamage = ks.getInt32(); }
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) { obj.m_iTotalSumNpcHP = ks.getInt32(); }
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) { obj.m_iTotalRecoveryHP = ks.getInt32(); }
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) { obj.m_iUsingKindOfSkill = ks.getInt32(); }
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) { obj.m_iCommandTechScore = ks.getInt32(); }
  if (Boolean(f.SERV_DUNGEON_RANK_NEW)) { obj.m_iSkillTechScore = ks.getInt32(); }
  if (Boolean(f.SERV_DUNGEON_DASH_LOG)) { obj.m_iDashCount = ks.getInt32(); }
  if (Boolean(f.SERV_ADD_DUNGEON_LOG_COLUMN_NUM_2)) { obj.m_iFrame = ks.getInt32(); }
  if (Boolean(f.SERV_USE_SKILL_SLOT_TYPE_LOG)) { obj.m_bSkillSlotType = ks.getBool(); }
  return obj;
}

export const KGlobalEventTableData_EVENT_ACCOUNT_ENUM = {
  EAE_NONE: 0,
  EAE_ACCOUNT_NORMAL: 1,
  EAE_ACCOUNT_SUM: 2,
} as const;
export type KGlobalEventTableData_EVENT_ACCOUNT_ENUM = (typeof KGlobalEventTableData_EVENT_ACCOUNT_ENUM)[keyof typeof KGlobalEventTableData_EVENT_ACCOUNT_ENUM];
export function getKGlobalEventTableData_EVENT_ACCOUNT_ENUM(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) {
    cur = 0;
    out['EAE_NONE'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) {
    cur = 1;
    out['EAE_ACCOUNT_NORMAL'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) {
    cur = 2;
    out['EAE_ACCOUNT_SUM'] = cur;
    cur += 1;
  }
  return out;
}
export interface KGlobalEventTableData {
  m_iUserUID?: UidType;
  m_iUnitUID?: UidType;
  m_iEventID?: Int32;
  m_usCategory?: UInt16;
  m_veciParamData?: Int32[];
  m_iEventType?: Int32;
  m_iEventScriptID?: Int32;
  m_cEventAccountType?: Int8;
}
export function createKGlobalEventTableData(flags?: FlagInput): KGlobalEventTableData {
  const f = resolveFlags(flags);
  const obj: KGlobalEventTableData = {
  };
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) obj.m_iUserUID = -1n;
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) obj.m_iUnitUID = -1n;
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) obj.m_iEventID = -1;
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) obj.m_usCategory = 0;
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) obj.m_veciParamData = ([] as Int32[]);
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) obj.m_iEventType = 0;
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) obj.m_iEventScriptID = 0;
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) obj.m_cEventAccountType = 0;
  return obj;
}
export function putKGlobalEventTableData(ks: KSerializer, obj: KGlobalEventTableData, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) {
    if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { if (!(ks.putInt64((obj.m_iUserUID ?? -1n)))) return false; }
    if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { if (!(ks.putInt64((obj.m_iUnitUID ?? -1n)))) return false; }
    if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { if (!(ks.putInt32((obj.m_iEventID ?? -1)))) return false; }
    if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { if (!(ks.putUInt16((obj.m_usCategory ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { if (!(ks.putVector((obj.m_veciParamData ?? ([] as Int32[])), (ks, item: Int32) => ks.putInt32(item)))) return false; }
    if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { if (!(ks.putInt32((obj.m_iEventType ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { if (!(ks.putInt32((obj.m_iEventScriptID ?? 0)))) return false; }
    if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { if (!(ks.putInt8((obj.m_cEventAccountType ?? 0)))) return false; }
  }
  return true;
}
export function getKGlobalEventTableData(ks: KSerializer, flags?: FlagInput): KGlobalEventTableData {
  const f = resolveFlags(flags);
  const obj = createKGlobalEventTableData(f);
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) {
    if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { obj.m_iUserUID = ks.getInt64(); }
    if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { obj.m_iEventID = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { obj.m_usCategory = ks.getUInt16(); }
    if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { obj.m_veciParamData = ks.getVector<Int32>((ks) => ks.getInt32()); }
    if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { obj.m_iEventType = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { obj.m_iEventScriptID = ks.getInt32(); }
    if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { obj.m_cEventAccountType = ks.getInt8(); }
  }
  return obj;
}

export interface KECN_VERIFY_SERVER_CONNECT_ACK {
  m_nOK: Int32;
  m_nUID: UidType;
  m_iDBRegServerGroupID?: Int32;
  m_iLocalServerGroupID?: Int32;
  m_sGroupID?: Int16;
  m_iServerUID: UidType;
  m_iServerType?: Int32;
  m_strName: string;
  m_sMaxNum: Int16;
  m_kAddr: KNetAddress;
  m_iVersion: Int32;
}
export function createKECN_VERIFY_SERVER_CONNECT_ACK(flags?: FlagInput): KECN_VERIFY_SERVER_CONNECT_ACK {
  const f = resolveFlags(flags);
  const obj: KECN_VERIFY_SERVER_CONNECT_ACK = {
    m_nOK: 0,
    m_nUID: 0n,
    m_iServerUID: 0n,
    m_strName: '',
    m_sMaxNum: 0,
    m_kAddr: createKNetAddress(f),
    m_iVersion: 0,
  };
  if (Boolean(f.SERV_INTEGRATION)) obj.m_iDBRegServerGroupID = 0;
  if (Boolean(f.SERV_INTEGRATION)) obj.m_iLocalServerGroupID = 0;
  if (!f.SERV_INTEGRATION) obj.m_sGroupID = 0;
  if (Boolean(f.SERV_FROM_CHANNEL_TO_LOGIN_PROXY)) obj.m_iServerType = 0;
  return obj;
}
export function putKECN_VERIFY_SERVER_CONNECT_ACK(ks: KSerializer, obj: KECN_VERIFY_SERVER_CONNECT_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_nOK))) return false;
  if (!(ks.putInt64(obj.m_nUID))) return false;
  if (Boolean(f.SERV_INTEGRATION)) { if (!(ks.putInt32((obj.m_iDBRegServerGroupID ?? 0)))) return false; }
  if (Boolean(f.SERV_INTEGRATION)) { if (!(ks.putInt32((obj.m_iLocalServerGroupID ?? 0)))) return false; }
  if (!f.SERV_INTEGRATION) { if (!(ks.putInt16((obj.m_sGroupID ?? 0)))) return false; }
  if (!(ks.putInt64(obj.m_iServerUID))) return false;
  if (Boolean(f.SERV_FROM_CHANNEL_TO_LOGIN_PROXY)) { if (!(ks.putInt32((obj.m_iServerType ?? 0)))) return false; }
  if (!(ks.putWString(obj.m_strName))) return false;
  if (!(ks.putInt16(obj.m_sMaxNum))) return false;
  if (!(ks.putUserClass(obj.m_kAddr, putKNetAddress, f))) return false;
  if (!(ks.putInt32(obj.m_iVersion))) return false;
  return true;
}
export function getKECN_VERIFY_SERVER_CONNECT_ACK(ks: KSerializer, flags?: FlagInput): KECN_VERIFY_SERVER_CONNECT_ACK {
  const f = resolveFlags(flags);
  const obj = createKECN_VERIFY_SERVER_CONNECT_ACK(f);
  obj.m_nOK = ks.getInt32();
  obj.m_nUID = ks.getInt64();
  if (Boolean(f.SERV_INTEGRATION)) { obj.m_iDBRegServerGroupID = ks.getInt32(); }
  if (Boolean(f.SERV_INTEGRATION)) { obj.m_iLocalServerGroupID = ks.getInt32(); }
  if (!f.SERV_INTEGRATION) { obj.m_sGroupID = ks.getInt16(); }
  obj.m_iServerUID = ks.getInt64();
  if (Boolean(f.SERV_FROM_CHANNEL_TO_LOGIN_PROXY)) { obj.m_iServerType = ks.getInt32(); }
  obj.m_strName = ks.getWString();
  obj.m_sMaxNum = ks.getInt16();
  obj.m_kAddr = ks.getUserClass(getKNetAddress, f);
  obj.m_iVersion = ks.getInt32();
  return obj;
}

export interface KGamePlayNetworkInfo {
  m_iOpponentUnitUID?: UidType;
  m_iHolePunchingTryCount?: Int32;
  m_fP2PPlayTime?: Float32;
  m_fRelayPlayTime?: Float32;
}
export function createKGamePlayNetworkInfo(flags?: FlagInput): KGamePlayNetworkInfo {
  const f = resolveFlags(flags);
  const obj: KGamePlayNetworkInfo = {
  };
  if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) obj.m_iOpponentUnitUID = 0n;
  if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) obj.m_iHolePunchingTryCount = 0;
  if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) obj.m_fP2PPlayTime = 0;
  if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) obj.m_fRelayPlayTime = 0;
  return obj;
}
export function putKGamePlayNetworkInfo(ks: KSerializer, obj: KGamePlayNetworkInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) {
    if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) { if (!(ks.putInt64((obj.m_iOpponentUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) { if (!(ks.putInt32((obj.m_iHolePunchingTryCount ?? 0)))) return false; }
    if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) { if (!(ks.putFloat32((obj.m_fP2PPlayTime ?? 0)))) return false; }
    if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) { if (!(ks.putFloat32((obj.m_fRelayPlayTime ?? 0)))) return false; }
  }
  return true;
}
export function getKGamePlayNetworkInfo(ks: KSerializer, flags?: FlagInput): KGamePlayNetworkInfo {
  const f = resolveFlags(flags);
  const obj = createKGamePlayNetworkInfo(f);
  if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) {
    if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) { obj.m_iOpponentUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) { obj.m_iHolePunchingTryCount = ks.getInt32(); }
    if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) { obj.m_fP2PPlayTime = ks.getFloat32(); }
    if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) { obj.m_fRelayPlayTime = ks.getFloat32(); }
  }
  return obj;
}

export interface KGamePlayNetworkInfoPackage {
  m_vecGamePlayNetworkInfo?: KGamePlayNetworkInfo[];
}
export function createKGamePlayNetworkInfoPackage(flags?: FlagInput): KGamePlayNetworkInfoPackage {
  const f = resolveFlags(flags);
  const obj: KGamePlayNetworkInfoPackage = {
  };
  if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) obj.m_vecGamePlayNetworkInfo = ([] as KGamePlayNetworkInfo[]);
  return obj;
}
export function putKGamePlayNetworkInfoPackage(ks: KSerializer, obj: KGamePlayNetworkInfoPackage, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) {
    if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) { if (!(ks.putVector((obj.m_vecGamePlayNetworkInfo ?? ([] as KGamePlayNetworkInfo[])), (ks, item: KGamePlayNetworkInfo) => ks.putUserClass(item, putKGamePlayNetworkInfo, f)))) return false; }
  }
  return true;
}
export function getKGamePlayNetworkInfoPackage(ks: KSerializer, flags?: FlagInput): KGamePlayNetworkInfoPackage {
  const f = resolveFlags(flags);
  const obj = createKGamePlayNetworkInfoPackage(f);
  if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) {
    if (Boolean(f.SERV_COLLECTION_OF_RELAY_AND_P2P_INFO)) { obj.m_vecGamePlayNetworkInfo = ks.getVector<KGamePlayNetworkInfo>((ks) => ks.getUserClass(getKGamePlayNetworkInfo, f)); }
  }
  return obj;
}

export interface KPacketOK {
  m_iOK: Int32;
}
export function createKPacketOK(flags?: FlagInput): KPacketOK {
  const f = resolveFlags(flags);
  return {
    m_iOK: 0,
  };
}
export function putKPacketOK(ks: KSerializer, obj: KPacketOK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  return true;
}
export function getKPacketOK(ks: KSerializer, flags?: FlagInput): KPacketOK {
  const f = resolveFlags(flags);
  const obj = createKPacketOK(f);
  obj.m_iOK = ks.getInt32();
  return obj;
}

export interface KPacketReason {
  m_iReason: Int32;
}
export function createKPacketReason(flags?: FlagInput): KPacketReason {
  const f = resolveFlags(flags);
  return {
    m_iReason: 0,
  };
}
export function putKPacketReason(ks: KSerializer, obj: KPacketReason, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iReason))) return false;
  return true;
}
export function getKPacketReason(ks: KSerializer, flags?: FlagInput): KPacketReason {
  const f = resolveFlags(flags);
  const obj = createKPacketReason(f);
  obj.m_iReason = ks.getInt32();
  return obj;
}

export interface KERM_OPEN_ROOM_REQ {
  m_bQuickJoin: boolean;
  m_kRoomInfo: KRoomInfo;
  m_kRoomUserInfo: KRoomUserInfo;
  m_vecStudentUnitUID: UidType[];
  m_wstrChannelIP?: string;
  m_iCurEXP?: Int32;
  m_iCurED?: Int32;
}
export function createKERM_OPEN_ROOM_REQ(flags?: FlagInput): KERM_OPEN_ROOM_REQ {
  const f = resolveFlags(flags);
  const obj: KERM_OPEN_ROOM_REQ = {
    m_bQuickJoin: false,
    m_kRoomInfo: createKRoomInfo(f),
    m_kRoomUserInfo: createKRoomUserInfo(f),
    m_vecStudentUnitUID: ([] as UidType[]),
  };
  if (Boolean(f.SERV_ADD_DUNGEON_LOG_COLUMN_NUM_2)) obj.m_wstrChannelIP = '';
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iCurEXP = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iCurED = 0;
  return obj;
}
export function putKERM_OPEN_ROOM_REQ(ks: KSerializer, obj: KERM_OPEN_ROOM_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putBool(obj.m_bQuickJoin))) return false;
  if (!(ks.putUserClass(obj.m_kRoomInfo, putKRoomInfo, f))) return false;
  if (!(ks.putUserClass(obj.m_kRoomUserInfo, putKRoomUserInfo, f))) return false;
  if (!(ks.putVector(obj.m_vecStudentUnitUID, (ks, item: UidType) => ks.putInt64(item)))) return false;
  if (Boolean(f.SERV_ADD_DUNGEON_LOG_COLUMN_NUM_2)) { if (!(ks.putWString((obj.m_wstrChannelIP ?? '')))) return false; }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iCurEXP ?? 0)))) return false; }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iCurED ?? 0)))) return false; }
  return true;
}
export function getKERM_OPEN_ROOM_REQ(ks: KSerializer, flags?: FlagInput): KERM_OPEN_ROOM_REQ {
  const f = resolveFlags(flags);
  const obj = createKERM_OPEN_ROOM_REQ(f);
  obj.m_bQuickJoin = ks.getBool();
  obj.m_kRoomInfo = ks.getUserClass(getKRoomInfo, f);
  obj.m_kRoomUserInfo = ks.getUserClass(getKRoomUserInfo, f);
  obj.m_vecStudentUnitUID = ks.getVector<UidType>((ks) => ks.getInt64());
  if (Boolean(f.SERV_ADD_DUNGEON_LOG_COLUMN_NUM_2)) { obj.m_wstrChannelIP = ks.getWString(); }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iCurEXP = ks.getInt32(); }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iCurED = ks.getInt32(); }
  return obj;
}

export interface KQuestUpdate {
  m_iQuestID: Int32;
  m_vecClearData: UInt8[];
}
export function createKQuestUpdate(flags?: FlagInput): KQuestUpdate {
  const f = resolveFlags(flags);
  return {
    m_iQuestID: 0,
    m_vecClearData: ([] as UInt8[]),
  };
}
export function putKQuestUpdate(ks: KSerializer, obj: KQuestUpdate, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iQuestID))) return false;
  if (!(ks.putVector(obj.m_vecClearData, (ks, item: UInt8) => ks.putUInt8(item)))) return false;
  return true;
}
export function getKQuestUpdate(ks: KSerializer, flags?: FlagInput): KQuestUpdate {
  const f = resolveFlags(flags);
  const obj = createKQuestUpdate(f);
  obj.m_iQuestID = ks.getInt32();
  obj.m_vecClearData = ks.getVector<UInt8>((ks) => ks.getUInt8());
  return obj;
}

export interface KMissionUpdate {
  m_iTitleID: Int32;
  m_vecClearData: Int16[];
}
export function createKMissionUpdate(flags?: FlagInput): KMissionUpdate {
  const f = resolveFlags(flags);
  return {
    m_iTitleID: 0,
    m_vecClearData: ([] as Int16[]),
  };
}
export function putKMissionUpdate(ks: KSerializer, obj: KMissionUpdate, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iTitleID))) return false;
  if (!(ks.putVector(obj.m_vecClearData, (ks, item: Int16) => ks.putInt16(item)))) return false;
  return true;
}
export function getKMissionUpdate(ks: KSerializer, flags?: FlagInput): KMissionUpdate {
  const f = resolveFlags(flags);
  const obj = createKMissionUpdate(f);
  obj.m_iTitleID = ks.getInt32();
  obj.m_vecClearData = ks.getVector<Int16>((ks) => ks.getInt16());
  return obj;
}

export const KDenyOptions_DenyOptionState = {
  DOS_ON: 0,
  DOS_OFF: 1,
  DOS_ONLY_FRIEND: 2,
} as const;
export type KDenyOptions_DenyOptionState = (typeof KDenyOptions_DenyOptionState)[keyof typeof KDenyOptions_DenyOptionState];
export interface KDenyOptions {
  m_cDenyFriendShip: Int8;
  m_cDenyInviteGuild: Int8;
  m_cDenyParty: Int8;
  m_cDenyPersonalTrade: Int8;
  m_cDenyRequestCouple?: Int8;
  m_cDenyInvitePracticePVP: Int8;
}
export function createKDenyOptions(flags?: FlagInput): KDenyOptions {
  const f = resolveFlags(flags);
  const obj: KDenyOptions = {
    m_cDenyFriendShip: 0,
    m_cDenyInviteGuild: 0,
    m_cDenyParty: 0,
    m_cDenyPersonalTrade: 0,
    m_cDenyInvitePracticePVP: 0,
  };
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_cDenyRequestCouple = 0;
  return obj;
}
export function putKDenyOptions(ks: KSerializer, obj: KDenyOptions, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt8(obj.m_cDenyFriendShip))) return false;
  if (!(ks.putInt8(obj.m_cDenyInviteGuild))) return false;
  if (!(ks.putInt8(obj.m_cDenyParty))) return false;
  if (!(ks.putInt8(obj.m_cDenyPersonalTrade))) return false;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt8((obj.m_cDenyRequestCouple ?? 0)))) return false; }
  if (!(ks.putInt8(obj.m_cDenyInvitePracticePVP))) return false;
  return true;
}
export function getKDenyOptions(ks: KSerializer, flags?: FlagInput): KDenyOptions {
  const f = resolveFlags(flags);
  const obj = createKDenyOptions(f);
  obj.m_cDenyFriendShip = ks.getInt8();
  obj.m_cDenyInviteGuild = ks.getInt8();
  obj.m_cDenyParty = ks.getInt8();
  obj.m_cDenyPersonalTrade = ks.getInt8();
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_cDenyRequestCouple = ks.getInt8(); }
  obj.m_cDenyInvitePracticePVP = ks.getInt8();
  return obj;
}

export interface KChatBlackListUnit {
  m_iUnitUID: UidType;
  m_wstrNickName: string;
}
export function createKChatBlackListUnit(flags?: FlagInput): KChatBlackListUnit {
  const f = resolveFlags(flags);
  return {
    m_iUnitUID: 0n,
    m_wstrNickName: '',
  };
}
export function putKChatBlackListUnit(ks: KSerializer, obj: KChatBlackListUnit, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  return true;
}
export function getKChatBlackListUnit(ks: KSerializer, flags?: FlagInput): KChatBlackListUnit {
  const f = resolveFlags(flags);
  const obj = createKChatBlackListUnit(f);
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  return obj;
}

export interface KRankerInfo {
  m_iUnitUID: UidType;
  m_wstrNickName: string;
}
export function createKRankerInfo(flags?: FlagInput): KRankerInfo {
  const f = resolveFlags(flags);
  return {
    m_iUnitUID: 0n,
    m_wstrNickName: '',
  };
}
export function putKRankerInfo(ks: KSerializer, obj: KRankerInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  return true;
}
export function getKRankerInfo(ks: KSerializer, flags?: FlagInput): KRankerInfo {
  const f = resolveFlags(flags);
  const obj = createKRankerInfo(f);
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  return obj;
}

export interface KHenirRankingInfo {
  m_iRank: Int32;
  m_iStageCount: Int32;
  m_ulPlayTime: UInt32;
  m_tRegDate: Int64;
  m_iUnitUID: UidType;
  m_wstrNickName: string;
  m_cUnitClass: Int8;
  m_ucLevel: UInt8;
  m_bytePlayStartedUserNum?: UInt8;
}
export function createKHenirRankingInfo(flags?: FlagInput): KHenirRankingInfo {
  const f = resolveFlags(flags);
  const obj: KHenirRankingInfo = {
    m_iRank: 0,
    m_iStageCount: 0,
    m_ulPlayTime: 0,
    m_tRegDate: 0n,
    m_iUnitUID: 0n,
    m_wstrNickName: '',
    m_cUnitClass: 0,
    m_ucLevel: 0,
  };
  if (Boolean(f.SERV_HENIR_RENEWAL_2013)) obj.m_bytePlayStartedUserNum = 0;
  return obj;
}
export function putKHenirRankingInfo(ks: KSerializer, obj: KHenirRankingInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iRank))) return false;
  if (!(ks.putInt32(obj.m_iStageCount))) return false;
  if (!(ks.putUInt32(obj.m_ulPlayTime))) return false;
  if (!(ks.putInt64(obj.m_tRegDate))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (!(ks.putInt8(obj.m_cUnitClass))) return false;
  if (!(ks.putUInt8(obj.m_ucLevel))) return false;
  if (Boolean(f.SERV_HENIR_RENEWAL_2013)) { if (!(ks.putUInt8((obj.m_bytePlayStartedUserNum ?? 0)))) return false; }
  return true;
}
export function getKHenirRankingInfo(ks: KSerializer, flags?: FlagInput): KHenirRankingInfo {
  const f = resolveFlags(flags);
  const obj = createKHenirRankingInfo(f);
  obj.m_iRank = ks.getInt32();
  obj.m_iStageCount = ks.getInt32();
  obj.m_ulPlayTime = ks.getUInt32();
  obj.m_tRegDate = ks.getInt64();
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  obj.m_cUnitClass = ks.getInt8();
  obj.m_ucLevel = ks.getUInt8();
  if (Boolean(f.SERV_HENIR_RENEWAL_2013)) { obj.m_bytePlayStartedUserNum = ks.getUInt8(); }
  return obj;
}

export interface KDungeonRankingInfo {
  m_iRank: Int32;
  m_iUnitUID: UidType;
  m_wstrNickName: string;
  m_cUnitClass: Int8;
  m_ucLevel: UInt8;
  m_iEXP: Int32;
}
export function createKDungeonRankingInfo(flags?: FlagInput): KDungeonRankingInfo {
  const f = resolveFlags(flags);
  return {
    m_iRank: 0,
    m_iUnitUID: 0n,
    m_wstrNickName: '',
    m_cUnitClass: 0,
    m_ucLevel: 0,
    m_iEXP: 0,
  };
}
export function putKDungeonRankingInfo(ks: KSerializer, obj: KDungeonRankingInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iRank))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (!(ks.putInt8(obj.m_cUnitClass))) return false;
  if (!(ks.putUInt8(obj.m_ucLevel))) return false;
  if (!(ks.putInt32(obj.m_iEXP))) return false;
  return true;
}
export function getKDungeonRankingInfo(ks: KSerializer, flags?: FlagInput): KDungeonRankingInfo {
  const f = resolveFlags(flags);
  const obj = createKDungeonRankingInfo(f);
  obj.m_iRank = ks.getInt32();
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  obj.m_cUnitClass = ks.getInt8();
  obj.m_ucLevel = ks.getUInt8();
  obj.m_iEXP = ks.getInt32();
  return obj;
}

export interface KPvpRankingInfo {
  m_iRank: Int32;
  m_iUnitUID: UidType;
  m_wstrNickName: string;
  m_cUnitClass: Int8;
  m_ucLevel: UInt8;
  m_cRank?: Int8;
  m_iRating?: Int32;
  m_iRPoint?: Int32;
  m_cPvpEmblem?: Int8;
  m_iLose?: Int32;
  m_iWin: Int32;
}
export function createKPvpRankingInfo(flags?: FlagInput): KPvpRankingInfo {
  const f = resolveFlags(flags);
  const obj: KPvpRankingInfo = {
    m_iRank: 0,
    m_iUnitUID: 0n,
    m_wstrNickName: '',
    m_cUnitClass: 0,
    m_ucLevel: 0,
    m_iWin: 0,
  };
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) obj.m_cRank = 0;
  if (f.SERV_PVP_NEW_SYSTEM && !f.SERV_2012_PVP_SEASON2) obj.m_iRating = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iRPoint = 0;
  if (!f.SERV_PVP_NEW_SYSTEM) obj.m_cPvpEmblem = 0;
  if (!f.SERV_PVP_NEW_SYSTEM) obj.m_iLose = 0;
  return obj;
}
export function putKPvpRankingInfo(ks: KSerializer, obj: KPvpRankingInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iRank))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (!(ks.putInt8(obj.m_cUnitClass))) return false;
  if (!(ks.putUInt8(obj.m_ucLevel))) return false;
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { if (!(ks.putInt8((obj.m_cRank ?? 0)))) return false; }
  if (f.SERV_PVP_NEW_SYSTEM && !f.SERV_2012_PVP_SEASON2) { if (!(ks.putInt32((obj.m_iRating ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iRPoint ?? 0)))) return false; }
  if (!f.SERV_PVP_NEW_SYSTEM) { if (!(ks.putInt8((obj.m_cPvpEmblem ?? 0)))) return false; }
  if (!f.SERV_PVP_NEW_SYSTEM) { if (!(ks.putInt32((obj.m_iLose ?? 0)))) return false; }
  if (!(ks.putInt32(obj.m_iWin))) return false;
  return true;
}
export function getKPvpRankingInfo(ks: KSerializer, flags?: FlagInput): KPvpRankingInfo {
  const f = resolveFlags(flags);
  const obj = createKPvpRankingInfo(f);
  obj.m_iRank = ks.getInt32();
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  obj.m_cUnitClass = ks.getInt8();
  obj.m_ucLevel = ks.getUInt8();
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { obj.m_cRank = ks.getInt8(); }
  if (f.SERV_PVP_NEW_SYSTEM && !f.SERV_2012_PVP_SEASON2) { obj.m_iRating = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iRPoint = ks.getInt32(); }
  if (!f.SERV_PVP_NEW_SYSTEM) { obj.m_cPvpEmblem = ks.getInt8(); }
  if (!f.SERV_PVP_NEW_SYSTEM) { obj.m_iLose = ks.getInt32(); }
  obj.m_iWin = ks.getInt32();
  return obj;
}

export interface KConnectTimeEventInfo {
  m_iEventUID: Int32;
  m_wstrEventTime: string;
  m_bAccountEvent?: boolean;
  m_iScriptID?: Int32;
}
export function createKConnectTimeEventInfo(flags?: FlagInput): KConnectTimeEventInfo {
  const f = resolveFlags(flags);
  const obj: KConnectTimeEventInfo = {
    m_iEventUID: 0,
    m_wstrEventTime: '',
  };
  if (Boolean(f.SERV_ACC_TIME_EVENT)) obj.m_bAccountEvent = false;
  if (Boolean(f.SERV_ARCHUANGEL_S_COIN_EVENT_GUIDE)) obj.m_iScriptID = 0;
  return obj;
}
export function putKConnectTimeEventInfo(ks: KSerializer, obj: KConnectTimeEventInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iEventUID))) return false;
  if (!(ks.putWString(obj.m_wstrEventTime))) return false;
  if (Boolean(f.SERV_ACC_TIME_EVENT)) { if (!(ks.putBool((obj.m_bAccountEvent ?? false)))) return false; }
  if (Boolean(f.SERV_ARCHUANGEL_S_COIN_EVENT_GUIDE)) { if (!(ks.putInt32((obj.m_iScriptID ?? 0)))) return false; }
  return true;
}
export function getKConnectTimeEventInfo(ks: KSerializer, flags?: FlagInput): KConnectTimeEventInfo {
  const f = resolveFlags(flags);
  const obj = createKConnectTimeEventInfo(f);
  obj.m_iEventUID = ks.getInt32();
  obj.m_wstrEventTime = ks.getWString();
  if (Boolean(f.SERV_ACC_TIME_EVENT)) { obj.m_bAccountEvent = ks.getBool(); }
  if (Boolean(f.SERV_ARCHUANGEL_S_COIN_EVENT_GUIDE)) { obj.m_iScriptID = ks.getInt32(); }
  return obj;
}

export interface KCumulativeTimeEventInfo {
  m_iEventUID?: Int32;
  m_iCumulativeTime?: Int32;
  m_bAccountEvent?: boolean;
}
export function createKCumulativeTimeEventInfo(flags?: FlagInput): KCumulativeTimeEventInfo {
  const f = resolveFlags(flags);
  const obj: KCumulativeTimeEventInfo = {
  };
  if (Boolean(f.CUMULATIVE_TIME_EVENT)) obj.m_iEventUID = 0;
  if (Boolean(f.CUMULATIVE_TIME_EVENT)) obj.m_iCumulativeTime = 0;
  if (f.CUMULATIVE_TIME_EVENT && f.SERV_ACC_TIME_EVENT) obj.m_bAccountEvent = false;
  return obj;
}
export function putKCumulativeTimeEventInfo(ks: KSerializer, obj: KCumulativeTimeEventInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.CUMULATIVE_TIME_EVENT)) {
    if (Boolean(f.CUMULATIVE_TIME_EVENT)) { if (!(ks.putInt32((obj.m_iEventUID ?? 0)))) return false; }
    if (Boolean(f.CUMULATIVE_TIME_EVENT)) { if (!(ks.putInt32((obj.m_iCumulativeTime ?? 0)))) return false; }
    if (f.CUMULATIVE_TIME_EVENT && f.SERV_ACC_TIME_EVENT) { if (!(ks.putBool((obj.m_bAccountEvent ?? false)))) return false; }
  }
  return true;
}
export function getKCumulativeTimeEventInfo(ks: KSerializer, flags?: FlagInput): KCumulativeTimeEventInfo {
  const f = resolveFlags(flags);
  const obj = createKCumulativeTimeEventInfo(f);
  if (Boolean(f.CUMULATIVE_TIME_EVENT)) {
    if (Boolean(f.CUMULATIVE_TIME_EVENT)) { obj.m_iEventUID = ks.getInt32(); }
    if (Boolean(f.CUMULATIVE_TIME_EVENT)) { obj.m_iCumulativeTime = ks.getInt32(); }
    if (f.CUMULATIVE_TIME_EVENT && f.SERV_ACC_TIME_EVENT) { obj.m_bAccountEvent = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_HENIR_REWARD_COUNT_NOT {
  m_bUnLimited?: boolean;
  m_iNormal?: Int32;
  m_iPremium?: Int32;
  m_iEvent?: Int32;
  m_iPremiumMAX?: Int32;
  m_iEventMAX?: Int32;
  m_iChallengeNormal?: Int32;
  m_iChallengePremium?: Int32;
  m_iChallengeEvent?: Int32;
}
export function createKEGS_HENIR_REWARD_COUNT_NOT(flags?: FlagInput): KEGS_HENIR_REWARD_COUNT_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_HENIR_REWARD_COUNT_NOT = {
  };
  if (Boolean(f.SERV_NEW_HENIR_TEST)) obj.m_bUnLimited = false;
  if (Boolean(f.SERV_NEW_HENIR_TEST)) obj.m_iNormal = 0;
  if (Boolean(f.SERV_NEW_HENIR_TEST)) obj.m_iPremium = 0;
  if (Boolean(f.SERV_NEW_HENIR_TEST)) obj.m_iEvent = 0;
  if (Boolean(f.SERV_NEW_HENIR_TEST)) obj.m_iPremiumMAX = 0;
  if (Boolean(f.SERV_NEW_HENIR_TEST)) obj.m_iEventMAX = 0;
  if (f.SERV_NEW_HENIR_TEST && f.SERV_HENIR_RENEWAL_2013) obj.m_iChallengeNormal = 0;
  if (f.SERV_NEW_HENIR_TEST && f.SERV_HENIR_RENEWAL_2013) obj.m_iChallengePremium = 0;
  if (f.SERV_NEW_HENIR_TEST && f.SERV_HENIR_RENEWAL_2013) obj.m_iChallengeEvent = 0;
  return obj;
}
export function putKEGS_HENIR_REWARD_COUNT_NOT(ks: KSerializer, obj: KEGS_HENIR_REWARD_COUNT_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEW_HENIR_TEST)) {
    if (Boolean(f.SERV_NEW_HENIR_TEST)) { if (!(ks.putBool((obj.m_bUnLimited ?? false)))) return false; }
    if (Boolean(f.SERV_NEW_HENIR_TEST)) { if (!(ks.putInt32((obj.m_iNormal ?? 0)))) return false; }
    if (Boolean(f.SERV_NEW_HENIR_TEST)) { if (!(ks.putInt32((obj.m_iPremium ?? 0)))) return false; }
    if (Boolean(f.SERV_NEW_HENIR_TEST)) { if (!(ks.putInt32((obj.m_iEvent ?? 0)))) return false; }
    if (Boolean(f.SERV_NEW_HENIR_TEST)) { if (!(ks.putInt32((obj.m_iPremiumMAX ?? 0)))) return false; }
    if (Boolean(f.SERV_NEW_HENIR_TEST)) { if (!(ks.putInt32((obj.m_iEventMAX ?? 0)))) return false; }
    if (f.SERV_NEW_HENIR_TEST && f.SERV_HENIR_RENEWAL_2013) { if (!(ks.putInt32((obj.m_iChallengeNormal ?? 0)))) return false; }
    if (f.SERV_NEW_HENIR_TEST && f.SERV_HENIR_RENEWAL_2013) { if (!(ks.putInt32((obj.m_iChallengePremium ?? 0)))) return false; }
    if (f.SERV_NEW_HENIR_TEST && f.SERV_HENIR_RENEWAL_2013) { if (!(ks.putInt32((obj.m_iChallengeEvent ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_HENIR_REWARD_COUNT_NOT(ks: KSerializer, flags?: FlagInput): KEGS_HENIR_REWARD_COUNT_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_HENIR_REWARD_COUNT_NOT(f);
  if (Boolean(f.SERV_NEW_HENIR_TEST)) {
    if (Boolean(f.SERV_NEW_HENIR_TEST)) { obj.m_bUnLimited = ks.getBool(); }
    if (Boolean(f.SERV_NEW_HENIR_TEST)) { obj.m_iNormal = ks.getInt32(); }
    if (Boolean(f.SERV_NEW_HENIR_TEST)) { obj.m_iPremium = ks.getInt32(); }
    if (Boolean(f.SERV_NEW_HENIR_TEST)) { obj.m_iEvent = ks.getInt32(); }
    if (Boolean(f.SERV_NEW_HENIR_TEST)) { obj.m_iPremiumMAX = ks.getInt32(); }
    if (Boolean(f.SERV_NEW_HENIR_TEST)) { obj.m_iEventMAX = ks.getInt32(); }
    if (f.SERV_NEW_HENIR_TEST && f.SERV_HENIR_RENEWAL_2013) { obj.m_iChallengeNormal = ks.getInt32(); }
    if (f.SERV_NEW_HENIR_TEST && f.SERV_HENIR_RENEWAL_2013) { obj.m_iChallengePremium = ks.getInt32(); }
    if (f.SERV_NEW_HENIR_TEST && f.SERV_HENIR_RENEWAL_2013) { obj.m_iChallengeEvent = ks.getInt32(); }
  }
  return obj;
}

export interface KRecordBuffInfo {
  m_iBuffID?: Int32;
  m_wstrStartTime?: string;
}
export function createKRecordBuffInfo(flags?: FlagInput): KRecordBuffInfo {
  const f = resolveFlags(flags);
  const obj: KRecordBuffInfo = {
  };
  if (Boolean(f.SERV_REFORM_THE_GATE_OF_DARKNESS)) obj.m_iBuffID = 0;
  if (Boolean(f.SERV_REFORM_THE_GATE_OF_DARKNESS)) obj.m_wstrStartTime = '';
  return obj;
}
export function putKRecordBuffInfo(ks: KSerializer, obj: KRecordBuffInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_REFORM_THE_GATE_OF_DARKNESS)) {
    if (Boolean(f.SERV_REFORM_THE_GATE_OF_DARKNESS)) { if (!(ks.putInt32((obj.m_iBuffID ?? 0)))) return false; }
    if (Boolean(f.SERV_REFORM_THE_GATE_OF_DARKNESS)) { if (!(ks.putWString((obj.m_wstrStartTime ?? '')))) return false; }
  }
  return true;
}
export function getKRecordBuffInfo(ks: KSerializer, flags?: FlagInput): KRecordBuffInfo {
  const f = resolveFlags(flags);
  const obj = createKRecordBuffInfo(f);
  if (Boolean(f.SERV_REFORM_THE_GATE_OF_DARKNESS)) {
    if (Boolean(f.SERV_REFORM_THE_GATE_OF_DARKNESS)) { obj.m_iBuffID = ks.getInt32(); }
    if (Boolean(f.SERV_REFORM_THE_GATE_OF_DARKNESS)) { obj.m_wstrStartTime = ks.getWString(); }
  }
  return obj;
}

export interface KRidingPetInfo {
  m_iRidingPetUID?: UidType;
  m_usRindingPetID?: UInt16;
  m_fStamina?: Float32;
  m_wstrDestroyDate?: string;
  m_iLastUnSummonDate?: Int64;
}
export function createKRidingPetInfo(flags?: FlagInput): KRidingPetInfo {
  const f = resolveFlags(flags);
  const obj: KRidingPetInfo = {
  };
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) obj.m_iRidingPetUID = 0n;
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) obj.m_usRindingPetID = 0;
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) obj.m_fStamina = 0.0;
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) obj.m_wstrDestroyDate = '';
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) obj.m_iLastUnSummonDate = 0n;
  return obj;
}
export function putKRidingPetInfo(ks: KSerializer, obj: KRidingPetInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) {
    if (Boolean(f.SERV_RIDING_PET_SYSTM)) { if (!(ks.putInt64((obj.m_iRidingPetUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_RIDING_PET_SYSTM)) { if (!(ks.putUInt16((obj.m_usRindingPetID ?? 0)))) return false; }
    if (Boolean(f.SERV_RIDING_PET_SYSTM)) { if (!(ks.putFloat32((obj.m_fStamina ?? 0.0)))) return false; }
    if (Boolean(f.SERV_RIDING_PET_SYSTM)) { if (!(ks.putWString((obj.m_wstrDestroyDate ?? '')))) return false; }
    if (Boolean(f.SERV_RIDING_PET_SYSTM)) { if (!(ks.putInt64((obj.m_iLastUnSummonDate ?? 0n)))) return false; }
  }
  return true;
}
export function getKRidingPetInfo(ks: KSerializer, flags?: FlagInput): KRidingPetInfo {
  const f = resolveFlags(flags);
  const obj = createKRidingPetInfo(f);
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) {
    if (Boolean(f.SERV_RIDING_PET_SYSTM)) { obj.m_iRidingPetUID = ks.getInt64(); }
    if (Boolean(f.SERV_RIDING_PET_SYSTM)) { obj.m_usRindingPetID = ks.getUInt16(); }
    if (Boolean(f.SERV_RIDING_PET_SYSTM)) { obj.m_fStamina = ks.getFloat32(); }
    if (Boolean(f.SERV_RIDING_PET_SYSTM)) { obj.m_wstrDestroyDate = ks.getWString(); }
    if (Boolean(f.SERV_RIDING_PET_SYSTM)) { obj.m_iLastUnSummonDate = ks.getInt64(); }
  }
  return obj;
}

export interface KDBE_UPDATE_UNIT_INFO_REQ {
  m_bFinal: boolean;
  m_iEventID: Int32;
  m_iUnitUID: UidType;
  m_iEXP: Int32;
  m_iLevel: Int32;
  m_iED: Int32;
  m_iRealDataED?: Int32;
  m_iOfficialMatchCnt?: Int32;
  m_iRating?: Int32;
  m_iMaxRating?: Int32;
  m_iRPoint?: Int32;
  m_iAPoint?: Int32;
  m_bIsWinBeforeMatch?: boolean;
  m_cEmblemEnum?: Int8;
  m_fKFactor?: Float32;
  m_iVSPoint?: Int32;
  m_iVSPointMax?: Int32;
  m_iSPoint?: Int32;
  m_iWin: Int32;
  m_iLose: Int32;
  m_kLastPos?: KLastPositionInfo;
  m_iMapID?: Int32;
  m_mapDungeonClear: Map<Int32, KDungeonClearInfo>;
  m_mapTCClear: Map<Int32, KTCClearInfo>;
  m_mapDungeonPlay?: Map<Int32, KDungeonPlayInfo>;
  m_kItemQuantityUpdate: KItemQuantityUpdate;
  m_kItemEnduranceUpdate: KItemEnduranceUpdate;
  m_kItemPositionUpdate: KItemPositionUpdate;
  m_vecQuestData: KQuestUpdate[];
  m_vecMissionData: KMissionUpdate[];
  m_iInitTitleID?: Int32;
  m_iEquippedTitleID?: Int32;
  m_sInitTitleID?: Int16;
  m_sEquippedTitleID?: Int16;
  m_mapSkillSlotVector?: Map<Int32, Int32[]>;
  m_wstrSkillSlotBEndDate?: string;
  m_vecSkillSlot?: Int32[];
  m_kDenyOptions: KDenyOptions;
  m_iSpirit: Int32;
  m_bIsSpiritUpdated: boolean;
  m_iNumResurrectionStone: Int32;
  m_iNumAutoPaymentResStone?: Int32;
  m_mapWishList: Map<Int32, Int32>;
  m_vecHenirRanking: KHenirRankingInfo[];
  m_vecHenirHeroRanking?: KHenirRankingInfo[];
  m_iGuildUID?: Int32;
  m_iHonorPoint?: Int32;
  m_vecUpdateEventTime?: KCumulativeTimeEventInfo[];
  m_vecGiveUpQuestList?: Int32[];
  m_vecPet?: KPetInfo[];
  m_mapCharGameCount?: Map<Int32, Int32>;
  m_kHenirRewardCnt?: KEGS_HENIR_REWARD_COUNT_NOT;
  m_kGamePlayStatus?: KGamePlayStatusContainer;
  m_vecRecordBuffInfo?: KRecordBuffInfo[];
  m_iChangedLocalRankingSpirit?: Int32;
  m_iChangedLocalRankingAP?: Int32;
  m_vecRidingPetList?: KRidingPetInfo[];
  m_cUnitRelationshipType?: Int8;
  m_iAccumultionSpirit?: Int32;
  m_iGateOfDarknessSupportEventTime?: Int32;
  m_arrChinaSpirit?: Int32[];
  m_iNoteViewCount?: Int32;
}
export function createKDBE_UPDATE_UNIT_INFO_REQ(flags?: FlagInput): KDBE_UPDATE_UNIT_INFO_REQ {
  const f = resolveFlags(flags);
  const obj: KDBE_UPDATE_UNIT_INFO_REQ = {
    m_bFinal: false,
    m_iEventID: 0,
    m_iUnitUID: 0n,
    m_iEXP: 0,
    m_iLevel: 0,
    m_iED: 0,
    m_iWin: 0,
    m_iLose: 0,
    m_mapDungeonClear: new Map<Int32, KDungeonClearInfo>(),
    m_mapTCClear: new Map<Int32, KTCClearInfo>(),
    m_kItemQuantityUpdate: createKItemQuantityUpdate(f),
    m_kItemEnduranceUpdate: createKItemEnduranceUpdate(f),
    m_kItemPositionUpdate: createKItemPositionUpdate(f),
    m_vecQuestData: ([] as KQuestUpdate[]),
    m_vecMissionData: ([] as KMissionUpdate[]),
    m_kDenyOptions: createKDenyOptions(f),
    m_iSpirit: 0,
    m_bIsSpiritUpdated: false,
    m_iNumResurrectionStone: 0,
    m_mapWishList: new Map<Int32, Int32>(),
    m_vecHenirRanking: ([] as KHenirRankingInfo[]),
  };
  if (Boolean(f.SERV_LOGOUT_ED_CHECK)) obj.m_iRealDataED = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iOfficialMatchCnt = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iRating = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iMaxRating = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iRPoint = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iAPoint = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_bIsWinBeforeMatch = false;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_cEmblemEnum = 0;
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) obj.m_fKFactor = 0;
  if (!f.SERV_PVP_NEW_SYSTEM) obj.m_iVSPoint = 0;
  if (!f.SERV_PVP_NEW_SYSTEM) obj.m_iVSPointMax = 0;
  if (!f.SERV_SKILL_PAGE_SYSTEM) obj.m_iSPoint = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_kLastPos = createKLastPositionInfo(f);
  if (!f.SERV_BATTLE_FIELD_SYSTEM) obj.m_iMapID = 0;
  if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) obj.m_mapDungeonPlay = new Map<Int32, KDungeonPlayInfo>();
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) obj.m_iInitTitleID = 0;
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) obj.m_iEquippedTitleID = 0;
  if (!f.SERV_TITLE_DATA_SIZE) obj.m_sInitTitleID = 0;
  if (!f.SERV_TITLE_DATA_SIZE) obj.m_sEquippedTitleID = 0;
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) obj.m_mapSkillSlotVector = new Map<Int32, Int32[]>();
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) obj.m_wstrSkillSlotBEndDate = '';
  if (!f.SERV_SKILL_PAGE_SYSTEM) obj.m_vecSkillSlot = ([] as Int32[]);
  if (Boolean(f.AP_RESTONE)) obj.m_iNumAutoPaymentResStone = 0;
  if (Boolean(f.SERV_HENIR_RENEWAL_2013)) obj.m_vecHenirHeroRanking = ([] as KHenirRankingInfo[]);
  if (Boolean(f.GUILD_TEST)) obj.m_iGuildUID = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_iHonorPoint = 0;
  if (Boolean(f.CUMULATIVE_TIME_EVENT)) obj.m_vecUpdateEventTime = ([] as KCumulativeTimeEventInfo[]);
  if (Boolean(f.SERV_DAY_QUEST)) obj.m_vecGiveUpQuestList = ([] as Int32[]);
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_vecPet = ([] as KPetInfo[]);
  if (Boolean(f.SERV_CHAR_LOG)) obj.m_mapCharGameCount = new Map<Int32, Int32>();
  if (Boolean(f.SERV_NEW_HENIR_TEST)) obj.m_kHenirRewardCnt = createKEGS_HENIR_REWARD_COUNT_NOT(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_kGamePlayStatus = createKGamePlayStatusContainer(f);
  if (Boolean(f.SERV_REFORM_THE_GATE_OF_DARKNESS)) obj.m_vecRecordBuffInfo = ([] as KRecordBuffInfo[]);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_iChangedLocalRankingSpirit = 0;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_iChangedLocalRankingAP = 0;
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) obj.m_vecRidingPetList = ([] as KRidingPetInfo[]);
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_cUnitRelationshipType = 0;
  if (Boolean(f.SERV_ACCUMULATION_SPIRIT_SYSTEM)) obj.m_iAccumultionSpirit = 0;
  if (Boolean(f.SERV_GATE_OF_DARKNESS_SUPPORT_EVENT)) obj.m_iGateOfDarknessSupportEventTime = 0;
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) obj.m_arrChinaSpirit = Array.from({ length: 6 }, () => 0);
  if (Boolean(f.SERV_ELESIS_UPDATE_EVENT)) obj.m_iNoteViewCount = 0;
  return obj;
}
export function putKDBE_UPDATE_UNIT_INFO_REQ(ks: KSerializer, obj: KDBE_UPDATE_UNIT_INFO_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putBool(obj.m_bFinal))) return false;
  if (!(ks.putInt32(obj.m_iEventID))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putInt32(obj.m_iEXP))) return false;
  if (!(ks.putInt32(obj.m_iLevel))) return false;
  if (!(ks.putInt32(obj.m_iED))) return false;
  if (Boolean(f.SERV_LOGOUT_ED_CHECK)) { if (!(ks.putInt32((obj.m_iRealDataED ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iOfficialMatchCnt ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iRating ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iMaxRating ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iRPoint ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iAPoint ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putBool((obj.m_bIsWinBeforeMatch ?? false)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt8((obj.m_cEmblemEnum ?? 0)))) return false; }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { if (!(ks.putFloat32((obj.m_fKFactor ?? 0)))) return false; }
  if (!f.SERV_PVP_NEW_SYSTEM) { if (!(ks.putInt32((obj.m_iVSPoint ?? 0)))) return false; }
  if (!f.SERV_PVP_NEW_SYSTEM) { if (!(ks.putInt32((obj.m_iVSPointMax ?? 0)))) return false; }
  if (!f.SERV_SKILL_PAGE_SYSTEM) { if (!(ks.putInt32((obj.m_iSPoint ?? 0)))) return false; }
  if (!(ks.putInt32(obj.m_iWin))) return false;
  if (!(ks.putInt32(obj.m_iLose))) return false;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putUserClass((obj.m_kLastPos ?? createKLastPositionInfo(f)), putKLastPositionInfo, f))) return false; }
  if (!f.SERV_BATTLE_FIELD_SYSTEM) { if (!(ks.putInt32((obj.m_iMapID ?? 0)))) return false; }
  if (!(ks.putMap(obj.m_mapDungeonClear, (ks, k: Int32) => ks.putInt32(k), (ks, v: KDungeonClearInfo) => ks.putUserClass(v, putKDungeonClearInfo, f)))) return false;
  if (!(ks.putMap(obj.m_mapTCClear, (ks, k: Int32) => ks.putInt32(k), (ks, v: KTCClearInfo) => ks.putUserClass(v, putKTCClearInfo, f)))) return false;
  if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) { if (!(ks.putMap((obj.m_mapDungeonPlay ?? new Map<Int32, KDungeonPlayInfo>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: KDungeonPlayInfo) => ks.putUserClass(v, putKDungeonPlayInfo, f)))) return false; }
  if (!(ks.putUserClass(obj.m_kItemQuantityUpdate, putKItemQuantityUpdate, f))) return false;
  if (!(putKItemEnduranceUpdate(ks, obj.m_kItemEnduranceUpdate, f))) return false;
  if (!(putKItemPositionUpdate(ks, obj.m_kItemPositionUpdate, f))) return false;
  if (!(ks.putVector(obj.m_vecQuestData, (ks, item: KQuestUpdate) => ks.putUserClass(item, putKQuestUpdate, f)))) return false;
  if (!(ks.putVector(obj.m_vecMissionData, (ks, item: KMissionUpdate) => ks.putUserClass(item, putKMissionUpdate, f)))) return false;
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) { if (!(ks.putInt32((obj.m_iInitTitleID ?? 0)))) return false; }
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) { if (!(ks.putInt32((obj.m_iEquippedTitleID ?? 0)))) return false; }
  if (!f.SERV_TITLE_DATA_SIZE) { if (!(ks.putInt16((obj.m_sInitTitleID ?? 0)))) return false; }
  if (!f.SERV_TITLE_DATA_SIZE) { if (!(ks.putInt16((obj.m_sEquippedTitleID ?? 0)))) return false; }
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putMap((obj.m_mapSkillSlotVector ?? new Map<Int32, Int32[]>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32[]) => ks.putVector(v, (ks, item: Int32) => ks.putInt32(item))))) return false; }
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putWString((obj.m_wstrSkillSlotBEndDate ?? '')))) return false; }
  if (!f.SERV_SKILL_PAGE_SYSTEM) { if (!(ks.putVector((obj.m_vecSkillSlot ?? ([] as Int32[])), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  if (!(ks.putUserClass(obj.m_kDenyOptions, putKDenyOptions, f))) return false;
  if (!(ks.putInt32(obj.m_iSpirit))) return false;
  if (!(ks.putBool(obj.m_bIsSpiritUpdated))) return false;
  if (!(ks.putInt32(obj.m_iNumResurrectionStone))) return false;
  if (Boolean(f.AP_RESTONE)) { if (!(ks.putInt32((obj.m_iNumAutoPaymentResStone ?? 0)))) return false; }
  if (!(ks.putMap(obj.m_mapWishList, (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false;
  if (!(ks.putVector(obj.m_vecHenirRanking, (ks, item: KHenirRankingInfo) => ks.putUserClass(item, putKHenirRankingInfo, f)))) return false;
  if (Boolean(f.SERV_HENIR_RENEWAL_2013)) { if (!(ks.putVector((obj.m_vecHenirHeroRanking ?? ([] as KHenirRankingInfo[])), (ks, item: KHenirRankingInfo) => ks.putUserClass(item, putKHenirRankingInfo, f)))) return false; }
  if (Boolean(f.GUILD_TEST)) { if (!(ks.putInt32((obj.m_iGuildUID ?? 0)))) return false; }
  if (Boolean(f.GUILD_TEST)) { if (!(ks.putInt32((obj.m_iHonorPoint ?? 0)))) return false; }
  if (Boolean(f.CUMULATIVE_TIME_EVENT)) { if (!(ks.putVector((obj.m_vecUpdateEventTime ?? ([] as KCumulativeTimeEventInfo[])), (ks, item: KCumulativeTimeEventInfo) => ks.putUserClass(item, putKCumulativeTimeEventInfo, f)))) return false; }
  if (Boolean(f.SERV_DAY_QUEST)) { if (!(ks.putVector((obj.m_vecGiveUpQuestList ?? ([] as Int32[])), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putVector((obj.m_vecPet ?? ([] as KPetInfo[])), (ks, item: KPetInfo) => ks.putUserClass(item, putKPetInfo, f)))) return false; }
  if (Boolean(f.SERV_CHAR_LOG)) { if (!(ks.putMap((obj.m_mapCharGameCount ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
  if (Boolean(f.SERV_NEW_HENIR_TEST)) { if (!(ks.putUserClass((obj.m_kHenirRewardCnt ?? createKEGS_HENIR_REWARD_COUNT_NOT(f)), putKEGS_HENIR_REWARD_COUNT_NOT, f))) return false; }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putUserClass((obj.m_kGamePlayStatus ?? createKGamePlayStatusContainer(f)), putKGamePlayStatusContainer, f))) return false; }
  if (Boolean(f.SERV_REFORM_THE_GATE_OF_DARKNESS)) { if (!(ks.putVector((obj.m_vecRecordBuffInfo ?? ([] as KRecordBuffInfo[])), (ks, item: KRecordBuffInfo) => ks.putUserClass(item, putKRecordBuffInfo, f)))) return false; }
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt32((obj.m_iChangedLocalRankingSpirit ?? 0)))) return false; }
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt32((obj.m_iChangedLocalRankingAP ?? 0)))) return false; }
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) { if (!(ks.putVector((obj.m_vecRidingPetList ?? ([] as KRidingPetInfo[])), (ks, item: KRidingPetInfo) => ks.putUserClass(item, putKRidingPetInfo, f)))) return false; }
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt8((obj.m_cUnitRelationshipType ?? 0)))) return false; }
  if (Boolean(f.SERV_ACCUMULATION_SPIRIT_SYSTEM)) { if (!(ks.putInt32((obj.m_iAccumultionSpirit ?? 0)))) return false; }
  if (Boolean(f.SERV_GATE_OF_DARKNESS_SUPPORT_EVENT)) { if (!(ks.putInt32((obj.m_iGateOfDarknessSupportEventTime ?? 0)))) return false; }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[0] ?? 0)))) return false; }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[1] ?? 0)))) return false; }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[2] ?? 0)))) return false; }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[3] ?? 0)))) return false; }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[4] ?? 0)))) return false; }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { if (!(ks.putInt32((obj.m_arrChinaSpirit?.[5] ?? 0)))) return false; }
  if (Boolean(f.SERV_ELESIS_UPDATE_EVENT)) { if (!(ks.putInt32((obj.m_iNoteViewCount ?? 0)))) return false; }
  return true;
}
export function getKDBE_UPDATE_UNIT_INFO_REQ(ks: KSerializer, flags?: FlagInput): KDBE_UPDATE_UNIT_INFO_REQ {
  const f = resolveFlags(flags);
  const obj = createKDBE_UPDATE_UNIT_INFO_REQ(f);
  obj.m_bFinal = ks.getBool();
  obj.m_iEventID = ks.getInt32();
  obj.m_iUnitUID = ks.getInt64();
  obj.m_iEXP = ks.getInt32();
  obj.m_iLevel = ks.getInt32();
  obj.m_iED = ks.getInt32();
  if (Boolean(f.SERV_LOGOUT_ED_CHECK)) { obj.m_iRealDataED = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iOfficialMatchCnt = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iRating = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iMaxRating = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iRPoint = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iAPoint = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_bIsWinBeforeMatch = ks.getBool(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_cEmblemEnum = ks.getInt8(); }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { obj.m_fKFactor = ks.getFloat32(); }
  if (!f.SERV_PVP_NEW_SYSTEM) { obj.m_iVSPoint = ks.getInt32(); }
  if (!f.SERV_PVP_NEW_SYSTEM) { obj.m_iVSPointMax = ks.getInt32(); }
  if (!f.SERV_SKILL_PAGE_SYSTEM) { obj.m_iSPoint = ks.getInt32(); }
  obj.m_iWin = ks.getInt32();
  obj.m_iLose = ks.getInt32();
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_kLastPos = ks.getUserClass(getKLastPositionInfo, f); }
  if (!f.SERV_BATTLE_FIELD_SYSTEM) { obj.m_iMapID = ks.getInt32(); }
  obj.m_mapDungeonClear = ks.getMap<Int32, KDungeonClearInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKDungeonClearInfo, f));
  obj.m_mapTCClear = ks.getMap<Int32, KTCClearInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKTCClearInfo, f));
  if (Boolean(f.SERV_LIMITED_DUNGEON_PLAY_TIMES)) { obj.m_mapDungeonPlay = ks.getMap<Int32, KDungeonPlayInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKDungeonPlayInfo, f)); }
  obj.m_kItemQuantityUpdate = ks.getUserClass(getKItemQuantityUpdate, f);
  obj.m_kItemEnduranceUpdate = getKItemEnduranceUpdate(ks, f);
  obj.m_kItemPositionUpdate = getKItemPositionUpdate(ks, f);
  obj.m_vecQuestData = ks.getVector<KQuestUpdate>((ks) => ks.getUserClass(getKQuestUpdate, f));
  obj.m_vecMissionData = ks.getVector<KMissionUpdate>((ks) => ks.getUserClass(getKMissionUpdate, f));
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) { obj.m_iInitTitleID = ks.getInt32(); }
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) { obj.m_iEquippedTitleID = ks.getInt32(); }
  if (!f.SERV_TITLE_DATA_SIZE) { obj.m_sInitTitleID = ks.getInt16(); }
  if (!f.SERV_TITLE_DATA_SIZE) { obj.m_sEquippedTitleID = ks.getInt16(); }
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { obj.m_mapSkillSlotVector = ks.getMap<Int32, Int32[]>((ks) => ks.getInt32(), (ks) => ks.getVector<Int32>((ks) => ks.getInt32())); }
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { obj.m_wstrSkillSlotBEndDate = ks.getWString(); }
  if (!f.SERV_SKILL_PAGE_SYSTEM) { obj.m_vecSkillSlot = ks.getVector<Int32>((ks) => ks.getInt32()); }
  obj.m_kDenyOptions = ks.getUserClass(getKDenyOptions, f);
  obj.m_iSpirit = ks.getInt32();
  obj.m_bIsSpiritUpdated = ks.getBool();
  obj.m_iNumResurrectionStone = ks.getInt32();
  if (Boolean(f.AP_RESTONE)) { obj.m_iNumAutoPaymentResStone = ks.getInt32(); }
  obj.m_mapWishList = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32());
  obj.m_vecHenirRanking = ks.getVector<KHenirRankingInfo>((ks) => ks.getUserClass(getKHenirRankingInfo, f));
  if (Boolean(f.SERV_HENIR_RENEWAL_2013)) { obj.m_vecHenirHeroRanking = ks.getVector<KHenirRankingInfo>((ks) => ks.getUserClass(getKHenirRankingInfo, f)); }
  if (Boolean(f.GUILD_TEST)) { obj.m_iGuildUID = ks.getInt32(); }
  if (Boolean(f.GUILD_TEST)) { obj.m_iHonorPoint = ks.getInt32(); }
  if (Boolean(f.CUMULATIVE_TIME_EVENT)) { obj.m_vecUpdateEventTime = ks.getVector<KCumulativeTimeEventInfo>((ks) => ks.getUserClass(getKCumulativeTimeEventInfo, f)); }
  if (Boolean(f.SERV_DAY_QUEST)) { obj.m_vecGiveUpQuestList = ks.getVector<Int32>((ks) => ks.getInt32()); }
  if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_vecPet = ks.getVector<KPetInfo>((ks) => ks.getUserClass(getKPetInfo, f)); }
  if (Boolean(f.SERV_CHAR_LOG)) { obj.m_mapCharGameCount = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
  if (Boolean(f.SERV_NEW_HENIR_TEST)) { obj.m_kHenirRewardCnt = ks.getUserClass(getKEGS_HENIR_REWARD_COUNT_NOT, f); }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_kGamePlayStatus = ks.getUserClass(getKGamePlayStatusContainer, f); }
  if (Boolean(f.SERV_REFORM_THE_GATE_OF_DARKNESS)) { obj.m_vecRecordBuffInfo = ks.getVector<KRecordBuffInfo>((ks) => ks.getUserClass(getKRecordBuffInfo, f)); }
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_iChangedLocalRankingSpirit = ks.getInt32(); }
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_iChangedLocalRankingAP = ks.getInt32(); }
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) { obj.m_vecRidingPetList = ks.getVector<KRidingPetInfo>((ks) => ks.getUserClass(getKRidingPetInfo, f)); }
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_cUnitRelationshipType = ks.getInt8(); }
  if (Boolean(f.SERV_ACCUMULATION_SPIRIT_SYSTEM)) { obj.m_iAccumultionSpirit = ks.getInt32(); }
  if (Boolean(f.SERV_GATE_OF_DARKNESS_SUPPORT_EVENT)) { obj.m_iGateOfDarknessSupportEventTime = ks.getInt32(); }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[0] = ks.getInt32(); }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[1] = ks.getInt32(); }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[2] = ks.getInt32(); }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[3] = ks.getInt32(); }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[4] = ks.getInt32(); }
  if (Boolean(f.SERV_CHINA_SPIRIT_EVENT)) { (obj.m_arrChinaSpirit ??= [])[5] = ks.getInt32(); }
  if (Boolean(f.SERV_ELESIS_UPDATE_EVENT)) { obj.m_iNoteViewCount = ks.getInt32(); }
  return obj;
}

export interface KDBE_UPDATE_UNIT_INFO_ACK {
  m_iOK: Int32;
  m_iEventID: Int32;
  m_iEXP: Int32;
  m_iED: Int32;
  m_iOfficialMatchCnt?: Int32;
  m_iRating?: Int32;
  m_iMaxRating?: Int32;
  m_iRPoint?: Int32;
  m_iAPoint?: Int32;
  m_iWin?: Int32;
  m_iLose?: Int32;
  m_fKFactor?: Float32;
  m_iVSPoint?: Int32;
  m_iVSPointMax?: Int32;
  m_vecDungeonClear: Int32[];
  m_vecTCClear: Int32[];
  m_kItemQuantityUpdate: KItemQuantityUpdate;
  m_kItemEnduranceUpdate: KItemEnduranceUpdate;
  m_kItemPositionUpdate: KItemPositionUpdate;
  m_iNumResurrectionStone: Int32;
  m_iNumAutoPaymentResStone?: Int32;
  m_vecPet?: KPetInfo[];
  m_iChangedLocalRankingSpirit?: Int32;
  m_iChangedLocalRankingAP?: Int32;
  m_vecRidingPetUID?: UidType[];
}
export function createKDBE_UPDATE_UNIT_INFO_ACK(flags?: FlagInput): KDBE_UPDATE_UNIT_INFO_ACK {
  const f = resolveFlags(flags);
  const obj: KDBE_UPDATE_UNIT_INFO_ACK = {
    m_iOK: 0,
    m_iEventID: 0,
    m_iEXP: 0,
    m_iED: 0,
    m_vecDungeonClear: ([] as Int32[]),
    m_vecTCClear: ([] as Int32[]),
    m_kItemQuantityUpdate: createKItemQuantityUpdate(f),
    m_kItemEnduranceUpdate: createKItemEnduranceUpdate(f),
    m_kItemPositionUpdate: createKItemPositionUpdate(f),
    m_iNumResurrectionStone: 0,
  };
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iOfficialMatchCnt = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iRating = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iMaxRating = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iRPoint = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iAPoint = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iWin = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iLose = 0;
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) obj.m_fKFactor = 0;
  if (!f.SERV_PVP_NEW_SYSTEM) obj.m_iVSPoint = 0;
  if (!f.SERV_PVP_NEW_SYSTEM) obj.m_iVSPointMax = 0;
  if (Boolean(f.AP_RESTONE)) obj.m_iNumAutoPaymentResStone = 0;
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_vecPet = ([] as KPetInfo[]);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_iChangedLocalRankingSpirit = 0;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_iChangedLocalRankingAP = 0;
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) obj.m_vecRidingPetUID = ([] as UidType[]);
  return obj;
}
export function putKDBE_UPDATE_UNIT_INFO_ACK(ks: KSerializer, obj: KDBE_UPDATE_UNIT_INFO_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putInt32(obj.m_iEventID))) return false;
  if (!(ks.putInt32(obj.m_iEXP))) return false;
  if (!(ks.putInt32(obj.m_iED))) return false;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iOfficialMatchCnt ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iRating ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iMaxRating ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iRPoint ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iAPoint ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iWin ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iLose ?? 0)))) return false; }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { if (!(ks.putFloat32((obj.m_fKFactor ?? 0)))) return false; }
  if (!f.SERV_PVP_NEW_SYSTEM) { if (!(ks.putInt32((obj.m_iVSPoint ?? 0)))) return false; }
  if (!f.SERV_PVP_NEW_SYSTEM) { if (!(ks.putInt32((obj.m_iVSPointMax ?? 0)))) return false; }
  if (!(ks.putVector(obj.m_vecDungeonClear, (ks, item: Int32) => ks.putInt32(item)))) return false;
  if (!(ks.putVector(obj.m_vecTCClear, (ks, item: Int32) => ks.putInt32(item)))) return false;
  if (!(ks.putUserClass(obj.m_kItemQuantityUpdate, putKItemQuantityUpdate, f))) return false;
  if (!(putKItemEnduranceUpdate(ks, obj.m_kItemEnduranceUpdate, f))) return false;
  if (!(putKItemPositionUpdate(ks, obj.m_kItemPositionUpdate, f))) return false;
  if (!(ks.putInt32(obj.m_iNumResurrectionStone))) return false;
  if (Boolean(f.AP_RESTONE)) { if (!(ks.putInt32((obj.m_iNumAutoPaymentResStone ?? 0)))) return false; }
  if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putVector((obj.m_vecPet ?? ([] as KPetInfo[])), (ks, item: KPetInfo) => ks.putUserClass(item, putKPetInfo, f)))) return false; }
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt32((obj.m_iChangedLocalRankingSpirit ?? 0)))) return false; }
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt32((obj.m_iChangedLocalRankingAP ?? 0)))) return false; }
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) { if (!(ks.putVector((obj.m_vecRidingPetUID ?? ([] as UidType[])), (ks, item: UidType) => ks.putInt64(item)))) return false; }
  return true;
}
export function getKDBE_UPDATE_UNIT_INFO_ACK(ks: KSerializer, flags?: FlagInput): KDBE_UPDATE_UNIT_INFO_ACK {
  const f = resolveFlags(flags);
  const obj = createKDBE_UPDATE_UNIT_INFO_ACK(f);
  obj.m_iOK = ks.getInt32();
  obj.m_iEventID = ks.getInt32();
  obj.m_iEXP = ks.getInt32();
  obj.m_iED = ks.getInt32();
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iOfficialMatchCnt = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iRating = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iMaxRating = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iRPoint = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iAPoint = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iWin = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iLose = ks.getInt32(); }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { obj.m_fKFactor = ks.getFloat32(); }
  if (!f.SERV_PVP_NEW_SYSTEM) { obj.m_iVSPoint = ks.getInt32(); }
  if (!f.SERV_PVP_NEW_SYSTEM) { obj.m_iVSPointMax = ks.getInt32(); }
  obj.m_vecDungeonClear = ks.getVector<Int32>((ks) => ks.getInt32());
  obj.m_vecTCClear = ks.getVector<Int32>((ks) => ks.getInt32());
  obj.m_kItemQuantityUpdate = ks.getUserClass(getKItemQuantityUpdate, f);
  obj.m_kItemEnduranceUpdate = getKItemEnduranceUpdate(ks, f);
  obj.m_kItemPositionUpdate = getKItemPositionUpdate(ks, f);
  obj.m_iNumResurrectionStone = ks.getInt32();
  if (Boolean(f.AP_RESTONE)) { obj.m_iNumAutoPaymentResStone = ks.getInt32(); }
  if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_vecPet = ks.getVector<KPetInfo>((ks) => ks.getUserClass(getKPetInfo, f)); }
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_iChangedLocalRankingSpirit = ks.getInt32(); }
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_iChangedLocalRankingAP = ks.getInt32(); }
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) { obj.m_vecRidingPetUID = ks.getVector<UidType>((ks) => ks.getInt64()); }
  return obj;
}

export interface KERM_UPDATE_PVP_UNIT_INFO_NOT {
  m_iEXP: Int32;
  m_iCurrentRating?: Int32;
  m_iCurrentMaxRating?: Int32;
  m_iCurrentRPoint?: Int32;
  m_iCurrentAPoint?: Int32;
  m_bIsOfficialMatch?: boolean;
  m_iRating?: Int32;
  m_iRPoint?: Int32;
  m_iAPoint?: Int32;
  m_cRank?: Int8;
  m_cRankForServer?: Int8;
  m_fKFactorIncrement?: Float32;
  m_iVSPoint?: Int32;
  m_iWin: Int32;
  m_iLose: Int32;
  m_bOutRoom: boolean;
  m_iMemberCount: Int32;
  m_iPlayTime: Int32;
  m_mapItem: Map<Int32, KItemInfo>;
}
export function createKERM_UPDATE_PVP_UNIT_INFO_NOT(flags?: FlagInput): KERM_UPDATE_PVP_UNIT_INFO_NOT {
  const f = resolveFlags(flags);
  const obj: KERM_UPDATE_PVP_UNIT_INFO_NOT = {
    m_iEXP: 0,
    m_iWin: 0,
    m_iLose: 0,
    m_bOutRoom: false,
    m_iMemberCount: 0,
    m_iPlayTime: 0,
    m_mapItem: new Map<Int32, KItemInfo>(),
  };
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iCurrentRating = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iCurrentMaxRating = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iCurrentRPoint = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iCurrentAPoint = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_bIsOfficialMatch = false;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iRating = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iRPoint = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iAPoint = 0;
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) obj.m_cRank = 0;
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) obj.m_cRankForServer = 0;
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) obj.m_fKFactorIncrement = 0.0;
  if (!f.SERV_PVP_NEW_SYSTEM) obj.m_iVSPoint = 0;
  return obj;
}
export function putKERM_UPDATE_PVP_UNIT_INFO_NOT(ks: KSerializer, obj: KERM_UPDATE_PVP_UNIT_INFO_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iEXP))) return false;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iCurrentRating ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iCurrentMaxRating ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iCurrentRPoint ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iCurrentAPoint ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putBool((obj.m_bIsOfficialMatch ?? false)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iRating ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iRPoint ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iAPoint ?? 0)))) return false; }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { if (!(ks.putInt8((obj.m_cRank ?? 0)))) return false; }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { if (!(ks.putInt8((obj.m_cRankForServer ?? 0)))) return false; }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { if (!(ks.putFloat32((obj.m_fKFactorIncrement ?? 0.0)))) return false; }
  if (!f.SERV_PVP_NEW_SYSTEM) { if (!(ks.putInt32((obj.m_iVSPoint ?? 0)))) return false; }
  if (!(ks.putInt32(obj.m_iWin))) return false;
  if (!(ks.putInt32(obj.m_iLose))) return false;
  if (!(ks.putBool(obj.m_bOutRoom))) return false;
  if (!(ks.putInt32(obj.m_iMemberCount))) return false;
  if (!(ks.putInt32(obj.m_iPlayTime))) return false;
  if (!(ks.putMap(obj.m_mapItem, (ks, k: Int32) => ks.putInt32(k), (ks, v: KItemInfo) => ks.putUserClass(v, putKItemInfo, f)))) return false;
  return true;
}
export function getKERM_UPDATE_PVP_UNIT_INFO_NOT(ks: KSerializer, flags?: FlagInput): KERM_UPDATE_PVP_UNIT_INFO_NOT {
  const f = resolveFlags(flags);
  const obj = createKERM_UPDATE_PVP_UNIT_INFO_NOT(f);
  obj.m_iEXP = ks.getInt32();
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iCurrentRating = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iCurrentMaxRating = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iCurrentRPoint = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iCurrentAPoint = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_bIsOfficialMatch = ks.getBool(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iRating = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iRPoint = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iAPoint = ks.getInt32(); }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { obj.m_cRank = ks.getInt8(); }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { obj.m_cRankForServer = ks.getInt8(); }
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { obj.m_fKFactorIncrement = ks.getFloat32(); }
  if (!f.SERV_PVP_NEW_SYSTEM) { obj.m_iVSPoint = ks.getInt32(); }
  obj.m_iWin = ks.getInt32();
  obj.m_iLose = ks.getInt32();
  obj.m_bOutRoom = ks.getBool();
  obj.m_iMemberCount = ks.getInt32();
  obj.m_iPlayTime = ks.getInt32();
  obj.m_mapItem = ks.getMap<Int32, KItemInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKItemInfo, f));
  return obj;
}

export interface KERM_UPDATE_DUNGEON_UNIT_INFO_NOT {
  m_iEXP: Int32;
  m_iED: Int32;
  m_iPvPGameType: Int32;
  m_iDungeonID: Int32;
  m_iUserCount: Int32;
  m_bDungeonClear: boolean;
  m_mapGetItem: Map<Int32, Int32>;
  m_mapResultItem: Map<Int32, KItemInfo>;
  m_iDropItemUID: Int32;
  m_bOutRoom: boolean;
  m_iPlayTime: Int32;
  m_iMaxScore: Int32;
  m_cMaxTotalRank: Int8;
  m_bIsTutorialSuccess: boolean;
  m_bGetWorldMissionReward?: boolean;
  m_kHenirRankingInfo: KHenirRankingInfo[];
  m_bStartedByAutoParty?: boolean;
}
export function createKERM_UPDATE_DUNGEON_UNIT_INFO_NOT(flags?: FlagInput): KERM_UPDATE_DUNGEON_UNIT_INFO_NOT {
  const f = resolveFlags(flags);
  const obj: KERM_UPDATE_DUNGEON_UNIT_INFO_NOT = {
    m_iEXP: 0,
    m_iED: 0,
    m_iPvPGameType: 0,
    m_iDungeonID: 0,
    m_iUserCount: 0,
    m_bDungeonClear: false,
    m_mapGetItem: new Map<Int32, Int32>(),
    m_mapResultItem: new Map<Int32, KItemInfo>(),
    m_iDropItemUID: 0,
    m_bOutRoom: false,
    m_iPlayTime: 0,
    m_iMaxScore: 0,
    m_cMaxTotalRank: 0,
    m_bIsTutorialSuccess: false,
    m_kHenirRankingInfo: ([] as KHenirRankingInfo[]),
  };
  if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) obj.m_bGetWorldMissionReward = false;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_bStartedByAutoParty = false;
  return obj;
}
export function putKERM_UPDATE_DUNGEON_UNIT_INFO_NOT(ks: KSerializer, obj: KERM_UPDATE_DUNGEON_UNIT_INFO_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iEXP))) return false;
  if (!(ks.putInt32(obj.m_iED))) return false;
  if (!(ks.putInt32(obj.m_iPvPGameType))) return false;
  if (!(ks.putInt32(obj.m_iDungeonID))) return false;
  if (!(ks.putInt32(obj.m_iUserCount))) return false;
  if (!(ks.putBool(obj.m_bDungeonClear))) return false;
  if (!(ks.putMap(obj.m_mapGetItem, (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false;
  if (!(ks.putMap(obj.m_mapResultItem, (ks, k: Int32) => ks.putInt32(k), (ks, v: KItemInfo) => ks.putUserClass(v, putKItemInfo, f)))) return false;
  if (!(ks.putInt32(obj.m_iDropItemUID))) return false;
  if (!(ks.putBool(obj.m_bOutRoom))) return false;
  if (!(ks.putInt32(obj.m_iPlayTime))) return false;
  if (!(ks.putInt32(obj.m_iMaxScore))) return false;
  if (!(ks.putInt8(obj.m_cMaxTotalRank))) return false;
  if (!(ks.putBool(obj.m_bIsTutorialSuccess))) return false;
  if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) { if (!(ks.putBool((obj.m_bGetWorldMissionReward ?? false)))) return false; }
  if (!(ks.putVector(obj.m_kHenirRankingInfo, (ks, item: KHenirRankingInfo) => ks.putUserClass(item, putKHenirRankingInfo, f)))) return false;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putBool((obj.m_bStartedByAutoParty ?? false)))) return false; }
  return true;
}
export function getKERM_UPDATE_DUNGEON_UNIT_INFO_NOT(ks: KSerializer, flags?: FlagInput): KERM_UPDATE_DUNGEON_UNIT_INFO_NOT {
  const f = resolveFlags(flags);
  const obj = createKERM_UPDATE_DUNGEON_UNIT_INFO_NOT(f);
  obj.m_iEXP = ks.getInt32();
  obj.m_iED = ks.getInt32();
  obj.m_iPvPGameType = ks.getInt32();
  obj.m_iDungeonID = ks.getInt32();
  obj.m_iUserCount = ks.getInt32();
  obj.m_bDungeonClear = ks.getBool();
  obj.m_mapGetItem = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32());
  obj.m_mapResultItem = ks.getMap<Int32, KItemInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKItemInfo, f));
  obj.m_iDropItemUID = ks.getInt32();
  obj.m_bOutRoom = ks.getBool();
  obj.m_iPlayTime = ks.getInt32();
  obj.m_iMaxScore = ks.getInt32();
  obj.m_cMaxTotalRank = ks.getInt8();
  obj.m_bIsTutorialSuccess = ks.getBool();
  if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) { obj.m_bGetWorldMissionReward = ks.getBool(); }
  obj.m_kHenirRankingInfo = ks.getVector<KHenirRankingInfo>((ks) => ks.getUserClass(getKHenirRankingInfo, f));
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_bStartedByAutoParty = ks.getBool(); }
  return obj;
}

export interface KStatisticsDetailData {
  m_iNum: Int32;
  m_wszString: string;
}
export function createKStatisticsDetailData(flags?: FlagInput): KStatisticsDetailData {
  const f = resolveFlags(flags);
  return {
    m_iNum: 0,
    m_wszString: '',
  };
}
export function putKStatisticsDetailData(ks: KSerializer, obj: KStatisticsDetailData, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iNum))) return false;
  if (!(ks.putWString(obj.m_wszString))) return false;
  return true;
}
export function getKStatisticsDetailData(ks: KSerializer, flags?: FlagInput): KStatisticsDetailData {
  const f = resolveFlags(flags);
  const obj = createKStatisticsDetailData(f);
  obj.m_iNum = ks.getInt32();
  obj.m_wszString = ks.getWString();
  return obj;
}

export interface KErrorMsgInfo {
  m_iErrorMsgID: Int32;
  m_wstrErrorMsg: string;
}
export function createKErrorMsgInfo(flags?: FlagInput): KErrorMsgInfo {
  const f = resolveFlags(flags);
  return {
    m_iErrorMsgID: 0,
    m_wstrErrorMsg: '',
  };
}
export function putKErrorMsgInfo(ks: KSerializer, obj: KErrorMsgInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iErrorMsgID))) return false;
  if (!(ks.putWString(obj.m_wstrErrorMsg))) return false;
  return true;
}
export function getKErrorMsgInfo(ks: KSerializer, flags?: FlagInput): KErrorMsgInfo {
  const f = resolveFlags(flags);
  const obj = createKErrorMsgInfo(f);
  obj.m_iErrorMsgID = ks.getInt32();
  obj.m_wstrErrorMsg = ks.getWString();
  return obj;
}

export interface KStatisticsKey {
  m_vecIntKey: Int32[];
  m_vecStringKey: string[];
}
export function createKStatisticsKey(flags?: FlagInput): KStatisticsKey {
  const f = resolveFlags(flags);
  return {
    m_vecIntKey: ([] as Int32[]),
    m_vecStringKey: ([] as string[]),
  };
}
export function putKStatisticsKey(ks: KSerializer, obj: KStatisticsKey, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putVector(obj.m_vecIntKey, (ks, item: Int32) => ks.putInt32(item)))) return false;
  if (!(ks.putVector(obj.m_vecStringKey, (ks, item: string) => ks.putWString(item)))) return false;
  return true;
}
export function getKStatisticsKey(ks: KSerializer, flags?: FlagInput): KStatisticsKey {
  const f = resolveFlags(flags);
  const obj = createKStatisticsKey(f);
  obj.m_vecIntKey = ks.getVector<Int32>((ks) => ks.getInt32());
  obj.m_vecStringKey = ks.getVector<string>((ks) => ks.getWString());
  return obj;
}

export interface KNPCUnitReq {
  m_UID: Int32;
  m_NPCID: Int32;
  m_Level: Int8;
  m_vPos: VECTOR3;
  m_nStartPos: Int32;
  m_vecPetrolLineIndex?: Int32[];
  m_vecPlayLineIndex?: Int32[];
  m_iGroupID?: Int32;
  m_bAggressive?: boolean;
  m_bActive: boolean;
  m_fDelayTime: Float32;
  m_KeyCode: Int8;
  m_bFocusCamera: boolean;
  m_bShowGage: boolean;
  m_AddPos: VECTOR3;
  m_bHasBossGage: boolean;
  m_bShowBossName: boolean;
  m_bShowSubBossName: boolean;
  m_bSiegeMode: boolean;
  m_bIsRight: boolean;
  m_bNoDrop: boolean;
  m_fUnitScale: Float32;
  m_cTeamNum: Int8;
  m_cAIType: Int8;
  m_iAllyUID: UidType;
  m_cAllyTeam?: Int8;
  m_cMonsterGrade: Int8;
  m_usBossGaugeHPLines?: UInt16;
  m_bAllyNpc?: boolean;
  m_bAttributeNpc?: boolean;
  m_cCreateMonsterType?: Int8;
  m_bIsMonsterCard?: boolean;
  m_fShowBossNameDelayTime?: Float32;
  m_bStopAtStartState?: boolean;
  m_iBossGroupID?: Int32;
}
export function createKNPCUnitReq(flags?: FlagInput): KNPCUnitReq {
  const f = resolveFlags(flags);
  const obj: KNPCUnitReq = {
    m_UID: -1,
    m_NPCID: -1,
    m_Level: 0,
    m_vPos: createVECTOR3(f),
    m_nStartPos: 0,
    m_bActive: false,
    m_fDelayTime: 0.0,
    m_KeyCode: -1,
    m_bFocusCamera: false,
    m_bShowGage: false,
    m_AddPos: createVECTOR3(f),
    m_bHasBossGage: false,
    m_bShowBossName: false,
    m_bShowSubBossName: false,
    m_bSiegeMode: false,
    m_bIsRight: false,
    m_bNoDrop: false,
    m_fUnitScale: 0,
    m_cTeamNum: 2,
    m_cAIType: 0,
    m_iAllyUID: -1n,
    m_cMonsterGrade: 0,
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_vecPetrolLineIndex = ([] as Int32[]);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_vecPlayLineIndex = ([] as Int32[]);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iGroupID = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_bAggressive = true;
  if (Boolean(f.SERV_TRAPPING_RANGER_TEST)) obj.m_cAllyTeam = 2;
  if (Boolean(f.SERV_BOSS_GAUGE_HP_LINES)) obj.m_usBossGaugeHPLines = 0;
  if (Boolean(f.SERV_ALLY_NPC)) obj.m_bAllyNpc = false;
  if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) obj.m_bAttributeNpc = false;
  if (f.SERV_MONSTER_SUMMON_CARD && f.SERV_NEW_DEFENCE_DUNGEON) obj.m_cCreateMonsterType = 0;
  if (f.SERV_MONSTER_SUMMON_CARD && !f.SERV_NEW_DEFENCE_DUNGEON) obj.m_bIsMonsterCard = false;
  if (Boolean(f.SERV_MODIFY_DUNGEON_STAGING)) obj.m_fShowBossNameDelayTime = 0;
  if (Boolean(f.SERV_MODIFY_DUNGEON_STAGING)) obj.m_bStopAtStartState = false;
  if (Boolean(f.SERV_BATTLEFIELD_MIDDLE_BOSS)) obj.m_iBossGroupID = 0;
  return obj;
}
export function putKNPCUnitReq(ks: KSerializer, obj: KNPCUnitReq, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_UID))) return false;
  if (!(ks.putInt32(obj.m_NPCID))) return false;
  if (!(ks.putInt8(obj.m_Level))) return false;
  if (!(ks.putUserClass(obj.m_vPos, putVECTOR3, f))) return false;
  if (!(ks.putInt32(obj.m_nStartPos))) return false;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putVector((obj.m_vecPetrolLineIndex ?? ([] as Int32[])), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putVector((obj.m_vecPlayLineIndex ?? ([] as Int32[])), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iGroupID ?? 0)))) return false; }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putBool((obj.m_bAggressive ?? true)))) return false; }
  if (!(ks.putBool(obj.m_bActive))) return false;
  if (!(ks.putFloat32(obj.m_fDelayTime))) return false;
  if (!(ks.putInt8(obj.m_KeyCode))) return false;
  if (!(ks.putBool(obj.m_bFocusCamera))) return false;
  if (!(ks.putBool(obj.m_bShowGage))) return false;
  if (!(ks.putUserClass(obj.m_AddPos, putVECTOR3, f))) return false;
  if (!(ks.putBool(obj.m_bHasBossGage))) return false;
  if (!(ks.putBool(obj.m_bShowBossName))) return false;
  if (!(ks.putBool(obj.m_bShowSubBossName))) return false;
  if (!(ks.putBool(obj.m_bSiegeMode))) return false;
  if (!(ks.putBool(obj.m_bIsRight))) return false;
  if (!(ks.putBool(obj.m_bNoDrop))) return false;
  if (!(ks.putFloat32(obj.m_fUnitScale))) return false;
  if (!(ks.putInt8(obj.m_cTeamNum))) return false;
  if (!(ks.putInt8(obj.m_cAIType))) return false;
  if (!(ks.putInt64(obj.m_iAllyUID))) return false;
  if (Boolean(f.SERV_TRAPPING_RANGER_TEST)) { if (!(ks.putInt8((obj.m_cAllyTeam ?? 2)))) return false; }
  if (!(ks.putInt8(obj.m_cMonsterGrade))) return false;
  if (Boolean(f.SERV_BOSS_GAUGE_HP_LINES)) { if (!(ks.putUInt16((obj.m_usBossGaugeHPLines ?? 0)))) return false; }
  if (Boolean(f.SERV_ALLY_NPC)) { if (!(ks.putBool((obj.m_bAllyNpc ?? false)))) return false; }
  if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) { if (!(ks.putBool((obj.m_bAttributeNpc ?? false)))) return false; }
  if (f.SERV_MONSTER_SUMMON_CARD && f.SERV_NEW_DEFENCE_DUNGEON) { if (!(ks.putInt8((obj.m_cCreateMonsterType ?? 0)))) return false; }
  if (f.SERV_MONSTER_SUMMON_CARD && !f.SERV_NEW_DEFENCE_DUNGEON) { if (!(ks.putBool((obj.m_bIsMonsterCard ?? false)))) return false; }
  if (Boolean(f.SERV_MODIFY_DUNGEON_STAGING)) { if (!(ks.putFloat32((obj.m_fShowBossNameDelayTime ?? 0)))) return false; }
  if (Boolean(f.SERV_MODIFY_DUNGEON_STAGING)) { if (!(ks.putBool((obj.m_bStopAtStartState ?? false)))) return false; }
  if (Boolean(f.SERV_BATTLEFIELD_MIDDLE_BOSS)) { if (!(ks.putInt32((obj.m_iBossGroupID ?? 0)))) return false; }
  return true;
}
export function getKNPCUnitReq(ks: KSerializer, flags?: FlagInput): KNPCUnitReq {
  const f = resolveFlags(flags);
  const obj = createKNPCUnitReq(f);
  obj.m_UID = ks.getInt32();
  obj.m_NPCID = ks.getInt32();
  obj.m_Level = ks.getInt8();
  obj.m_vPos = ks.getUserClass(getVECTOR3, f);
  obj.m_nStartPos = ks.getInt32();
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_vecPetrolLineIndex = ks.getVector<Int32>((ks) => ks.getInt32()); }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_vecPlayLineIndex = ks.getVector<Int32>((ks) => ks.getInt32()); }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iGroupID = ks.getInt32(); }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_bAggressive = ks.getBool(); }
  obj.m_bActive = ks.getBool();
  obj.m_fDelayTime = ks.getFloat32();
  obj.m_KeyCode = ks.getInt8();
  obj.m_bFocusCamera = ks.getBool();
  obj.m_bShowGage = ks.getBool();
  obj.m_AddPos = ks.getUserClass(getVECTOR3, f);
  obj.m_bHasBossGage = ks.getBool();
  obj.m_bShowBossName = ks.getBool();
  obj.m_bShowSubBossName = ks.getBool();
  obj.m_bSiegeMode = ks.getBool();
  obj.m_bIsRight = ks.getBool();
  obj.m_bNoDrop = ks.getBool();
  obj.m_fUnitScale = ks.getFloat32();
  obj.m_cTeamNum = ks.getInt8();
  obj.m_cAIType = ks.getInt8();
  obj.m_iAllyUID = ks.getInt64();
  if (Boolean(f.SERV_TRAPPING_RANGER_TEST)) { obj.m_cAllyTeam = ks.getInt8(); }
  obj.m_cMonsterGrade = ks.getInt8();
  if (Boolean(f.SERV_BOSS_GAUGE_HP_LINES)) { obj.m_usBossGaugeHPLines = ks.getUInt16(); }
  if (Boolean(f.SERV_ALLY_NPC)) { obj.m_bAllyNpc = ks.getBool(); }
  if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) { obj.m_bAttributeNpc = ks.getBool(); }
  if (f.SERV_MONSTER_SUMMON_CARD && f.SERV_NEW_DEFENCE_DUNGEON) { obj.m_cCreateMonsterType = ks.getInt8(); }
  if (f.SERV_MONSTER_SUMMON_CARD && !f.SERV_NEW_DEFENCE_DUNGEON) { obj.m_bIsMonsterCard = ks.getBool(); }
  if (Boolean(f.SERV_MODIFY_DUNGEON_STAGING)) { obj.m_fShowBossNameDelayTime = ks.getFloat32(); }
  if (Boolean(f.SERV_MODIFY_DUNGEON_STAGING)) { obj.m_bStopAtStartState = ks.getBool(); }
  if (Boolean(f.SERV_BATTLEFIELD_MIDDLE_BOSS)) { obj.m_iBossGroupID = ks.getInt32(); }
  return obj;
}

export interface KNPCList {
  m_NPCList: KNPCUnitReq[];
}
export function createKNPCList(flags?: FlagInput): KNPCList {
  const f = resolveFlags(flags);
  return {
    m_NPCList: ([] as KNPCUnitReq[]),
  };
}
export function putKNPCList(ks: KSerializer, obj: KNPCList, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putVector(obj.m_NPCList, (ks, item: KNPCUnitReq) => ks.putUserClass(item, putKNPCUnitReq, f)))) return false;
  return true;
}
export function getKNPCList(ks: KSerializer, flags?: FlagInput): KNPCList {
  const f = resolveFlags(flags);
  const obj = createKNPCList(f);
  obj.m_NPCList = ks.getVector<KNPCUnitReq>((ks) => ks.getUserClass(getKNPCUnitReq, f));
  return obj;
}

export interface KERM_NPC_UNIT_DIE_ACK {
  m_iOK: Int32;
  m_iNPCID: Int32;
}
export function createKERM_NPC_UNIT_DIE_ACK(flags?: FlagInput): KERM_NPC_UNIT_DIE_ACK {
  const f = resolveFlags(flags);
  return {
    m_iOK: 0,
    m_iNPCID: 0,
  };
}
export function putKERM_NPC_UNIT_DIE_ACK(ks: KSerializer, obj: KERM_NPC_UNIT_DIE_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putInt32(obj.m_iNPCID))) return false;
  return true;
}
export function getKERM_NPC_UNIT_DIE_ACK(ks: KSerializer, flags?: FlagInput): KERM_NPC_UNIT_DIE_ACK {
  const f = resolveFlags(flags);
  const obj = createKERM_NPC_UNIT_DIE_ACK(f);
  obj.m_iOK = ks.getInt32();
  obj.m_iNPCID = ks.getInt32();
  return obj;
}

export interface KQuestReq {
  m_UnitUID: UidType;
  m_iQuestID: Int32;
}
export function createKQuestReq(flags?: FlagInput): KQuestReq {
  const f = resolveFlags(flags);
  return {
    m_UnitUID: 0n,
    m_iQuestID: 0,
  };
}
export function putKQuestReq(ks: KSerializer, obj: KQuestReq, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_UnitUID))) return false;
  if (!(ks.putInt32(obj.m_iQuestID))) return false;
  return true;
}
export function getKQuestReq(ks: KSerializer, flags?: FlagInput): KQuestReq {
  const f = resolveFlags(flags);
  const obj = createKQuestReq(f);
  obj.m_UnitUID = ks.getInt64();
  obj.m_iQuestID = ks.getInt32();
  return obj;
}

export interface KQuestAck {
  m_iOK: Int32;
  m_iQuestID: Int32;
  m_mapInsertedItem?: Map<Int32, Int32>;
  m_kItemQuantityUpdate?: KItemQuantityUpdate;
  m_vecUpdatedInventorySlot?: KInventoryItemInfo[];
  m_mapItemInfo?: Map<UidType, KItemInfo>;
}
export function createKQuestAck(flags?: FlagInput): KQuestAck {
  const f = resolveFlags(flags);
  const obj: KQuestAck = {
    m_iOK: 0,
    m_iQuestID: 0,
  };
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) obj.m_mapInsertedItem = new Map<Int32, Int32>();
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) obj.m_kItemQuantityUpdate = createKItemQuantityUpdate(f);
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) obj.m_vecUpdatedInventorySlot = ([] as KInventoryItemInfo[]);
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) obj.m_mapItemInfo = new Map<UidType, KItemInfo>();
  return obj;
}
export function putKQuestAck(ks: KSerializer, obj: KQuestAck, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putInt32(obj.m_iQuestID))) return false;
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) { if (!(ks.putMap((obj.m_mapInsertedItem ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) { if (!(ks.putUserClass((obj.m_kItemQuantityUpdate ?? createKItemQuantityUpdate(f)), putKItemQuantityUpdate, f))) return false; }
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) { if (!(ks.putVector((obj.m_vecUpdatedInventorySlot ?? ([] as KInventoryItemInfo[])), (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false; }
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) { if (!(ks.putMap((obj.m_mapItemInfo ?? new Map<UidType, KItemInfo>()), (ks, k: UidType) => ks.putInt64(k), (ks, v: KItemInfo) => ks.putUserClass(v, putKItemInfo, f)))) return false; }
  return true;
}
export function getKQuestAck(ks: KSerializer, flags?: FlagInput): KQuestAck {
  const f = resolveFlags(flags);
  const obj = createKQuestAck(f);
  obj.m_iOK = ks.getInt32();
  obj.m_iQuestID = ks.getInt32();
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) { obj.m_mapInsertedItem = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) { obj.m_kItemQuantityUpdate = ks.getUserClass(getKItemQuantityUpdate, f); }
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) { obj.m_vecUpdatedInventorySlot = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) { obj.m_mapItemInfo = ks.getMap<UidType, KItemInfo>((ks) => ks.getInt64(), (ks) => ks.getUserClass(getKItemInfo, f)); }
  return obj;
}

export interface KDBE_NEW_QUEST_REQ {
  m_UnitUID: UidType;
  m_iQuestID: Int32;
  m_iTalkNPCID: Int32;
  m_mapInsertedItem?: Map<Int32, Int32>;
  m_kItemQuantityUpdate?: KItemQuantityUpdate;
  m_vecUpdatedInventorySlot?: KInventoryItemInfo[];
  m_vecItemInfo?: KItemInfo[];
  m_UserUID?: UidType;
}
export function createKDBE_NEW_QUEST_REQ(flags?: FlagInput): KDBE_NEW_QUEST_REQ {
  const f = resolveFlags(flags);
  const obj: KDBE_NEW_QUEST_REQ = {
    m_UnitUID: 0n,
    m_iQuestID: 0,
    m_iTalkNPCID: 0,
  };
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) obj.m_mapInsertedItem = new Map<Int32, Int32>();
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) obj.m_kItemQuantityUpdate = createKItemQuantityUpdate(f);
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) obj.m_vecUpdatedInventorySlot = ([] as KInventoryItemInfo[]);
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) obj.m_vecItemInfo = ([] as KItemInfo[]);
  if (Boolean(f.SERV_ACCOUNT_MISSION_SYSTEM)) obj.m_UserUID = 0n;
  return obj;
}
export function putKDBE_NEW_QUEST_REQ(ks: KSerializer, obj: KDBE_NEW_QUEST_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_UnitUID))) return false;
  if (!(ks.putInt32(obj.m_iQuestID))) return false;
  if (!(ks.putInt32(obj.m_iTalkNPCID))) return false;
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) { if (!(ks.putMap((obj.m_mapInsertedItem ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) { if (!(ks.putUserClass((obj.m_kItemQuantityUpdate ?? createKItemQuantityUpdate(f)), putKItemQuantityUpdate, f))) return false; }
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) { if (!(ks.putVector((obj.m_vecUpdatedInventorySlot ?? ([] as KInventoryItemInfo[])), (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false; }
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) { if (!(ks.putVector((obj.m_vecItemInfo ?? ([] as KItemInfo[])), (ks, item: KItemInfo) => ks.putUserClass(item, putKItemInfo, f)))) return false; }
  if (Boolean(f.SERV_ACCOUNT_MISSION_SYSTEM)) { if (!(ks.putInt64((obj.m_UserUID ?? 0n)))) return false; }
  return true;
}
export function getKDBE_NEW_QUEST_REQ(ks: KSerializer, flags?: FlagInput): KDBE_NEW_QUEST_REQ {
  const f = resolveFlags(flags);
  const obj = createKDBE_NEW_QUEST_REQ(f);
  obj.m_UnitUID = ks.getInt64();
  obj.m_iQuestID = ks.getInt32();
  obj.m_iTalkNPCID = ks.getInt32();
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) { obj.m_mapInsertedItem = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) { obj.m_kItemQuantityUpdate = ks.getUserClass(getKItemQuantityUpdate, f); }
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) { obj.m_vecUpdatedInventorySlot = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
  if (Boolean(f.SERV_QUEST_CLEAR_EXPAND)) { obj.m_vecItemInfo = ks.getVector<KItemInfo>((ks) => ks.getUserClass(getKItemInfo, f)); }
  if (Boolean(f.SERV_ACCOUNT_MISSION_SYSTEM)) { obj.m_UserUID = ks.getInt64(); }
  return obj;
}

export interface KDBE_QUEST_COMPLETE_REQ {
  m_UnitUID: UidType;
  m_iQuestID: Int32;
  m_bIsRepeat: boolean;
  m_bIsChangeJob: boolean;
  m_cChangeUnitClass: Int8;
  m_bIsNew: boolean;
  m_mapInsertedItem: Map<Int32, KItemInfo>;
  m_kItemQuantityUpdate: KItemQuantityUpdate;
  m_vecUpdatedInventorySlot: KInventoryItemInfo[];
  m_vecItemInfo: KItemInfo[];
  m_bAutoComplete?: boolean;
  m_iNewDefaultSkill1?: Int32;
  m_iNewDefaultSkill2?: Int32;
  m_iTheNumberOfSkillPagesAvailable?: Int32;
}
export function createKDBE_QUEST_COMPLETE_REQ(flags?: FlagInput): KDBE_QUEST_COMPLETE_REQ {
  const f = resolveFlags(flags);
  const obj: KDBE_QUEST_COMPLETE_REQ = {
    m_UnitUID: 0n,
    m_iQuestID: 0,
    m_bIsRepeat: false,
    m_bIsChangeJob: false,
    m_cChangeUnitClass: 0,
    m_bIsNew: false,
    m_mapInsertedItem: new Map<Int32, KItemInfo>(),
    m_kItemQuantityUpdate: createKItemQuantityUpdate(f),
    m_vecUpdatedInventorySlot: ([] as KInventoryItemInfo[]),
    m_vecItemInfo: ([] as KItemInfo[]),
  };
  if (Boolean(f.SERV_ENTER_FIELD_QUEST_CLEAR)) obj.m_bAutoComplete = false;
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) obj.m_iNewDefaultSkill1 = 0;
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) obj.m_iNewDefaultSkill2 = 0;
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) obj.m_iTheNumberOfSkillPagesAvailable = 1;
  return obj;
}
export function putKDBE_QUEST_COMPLETE_REQ(ks: KSerializer, obj: KDBE_QUEST_COMPLETE_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_UnitUID))) return false;
  if (!(ks.putInt32(obj.m_iQuestID))) return false;
  if (!(ks.putBool(obj.m_bIsRepeat))) return false;
  if (!(ks.putBool(obj.m_bIsChangeJob))) return false;
  if (!(ks.putInt8(obj.m_cChangeUnitClass))) return false;
  if (!(ks.putBool(obj.m_bIsNew))) return false;
  if (!(ks.putMap(obj.m_mapInsertedItem, (ks, k: Int32) => ks.putInt32(k), (ks, v: KItemInfo) => ks.putUserClass(v, putKItemInfo, f)))) return false;
  if (!(ks.putUserClass(obj.m_kItemQuantityUpdate, putKItemQuantityUpdate, f))) return false;
  if (!(ks.putVector(obj.m_vecUpdatedInventorySlot, (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false;
  if (!(ks.putVector(obj.m_vecItemInfo, (ks, item: KItemInfo) => ks.putUserClass(item, putKItemInfo, f)))) return false;
  if (Boolean(f.SERV_ENTER_FIELD_QUEST_CLEAR)) { if (!(ks.putBool((obj.m_bAutoComplete ?? false)))) return false; }
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) { if (!(ks.putInt32((obj.m_iNewDefaultSkill1 ?? 0)))) return false; }
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) { if (!(ks.putInt32((obj.m_iNewDefaultSkill2 ?? 0)))) return false; }
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putInt32((obj.m_iTheNumberOfSkillPagesAvailable ?? 1)))) return false; }
  return true;
}
export function getKDBE_QUEST_COMPLETE_REQ(ks: KSerializer, flags?: FlagInput): KDBE_QUEST_COMPLETE_REQ {
  const f = resolveFlags(flags);
  const obj = createKDBE_QUEST_COMPLETE_REQ(f);
  obj.m_UnitUID = ks.getInt64();
  obj.m_iQuestID = ks.getInt32();
  obj.m_bIsRepeat = ks.getBool();
  obj.m_bIsChangeJob = ks.getBool();
  obj.m_cChangeUnitClass = ks.getInt8();
  obj.m_bIsNew = ks.getBool();
  obj.m_mapInsertedItem = ks.getMap<Int32, KItemInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKItemInfo, f));
  obj.m_kItemQuantityUpdate = ks.getUserClass(getKItemQuantityUpdate, f);
  obj.m_vecUpdatedInventorySlot = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f));
  obj.m_vecItemInfo = ks.getVector<KItemInfo>((ks) => ks.getUserClass(getKItemInfo, f));
  if (Boolean(f.SERV_ENTER_FIELD_QUEST_CLEAR)) { obj.m_bAutoComplete = ks.getBool(); }
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) { obj.m_iNewDefaultSkill1 = ks.getInt32(); }
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) { obj.m_iNewDefaultSkill2 = ks.getInt32(); }
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { obj.m_iTheNumberOfSkillPagesAvailable = ks.getInt32(); }
  return obj;
}

export interface KDBE_QUEST_COMPLETE_ACK {
  m_iOK: Int32;
  m_kCompleteQuestInfo?: KCompleteQuestInfo;
  m_iQuestID?: Int32;
  m_bIsChangeJob: boolean;
  m_cChangeUnitClass: Int8;
  m_bIsNew: boolean;
  m_mapInsertedItem: Map<Int32, KItemInfo>;
  m_kItemQuantityUpdate: KItemQuantityUpdate;
  m_vecUpdatedInventorySlot: KInventoryItemInfo[];
  m_mapItemInfo: Map<UidType, KItemInfo>;
  m_bAutoComplete?: boolean;
  m_iNewDefaultSkill1?: Int32;
  m_iNewDefaultSkill2?: Int32;
}
export function createKDBE_QUEST_COMPLETE_ACK(flags?: FlagInput): KDBE_QUEST_COMPLETE_ACK {
  const f = resolveFlags(flags);
  const obj: KDBE_QUEST_COMPLETE_ACK = {
    m_iOK: 0,
    m_bIsChangeJob: false,
    m_cChangeUnitClass: 0,
    m_bIsNew: false,
    m_mapInsertedItem: new Map<Int32, KItemInfo>(),
    m_kItemQuantityUpdate: createKItemQuantityUpdate(f),
    m_vecUpdatedInventorySlot: ([] as KInventoryItemInfo[]),
    m_mapItemInfo: new Map<UidType, KItemInfo>(),
  };
  if (Boolean(f.SERV_DAILY_QUEST)) obj.m_kCompleteQuestInfo = createKCompleteQuestInfo(f);
  if (!f.SERV_DAILY_QUEST) obj.m_iQuestID = 0;
  if (Boolean(f.SERV_ENTER_FIELD_QUEST_CLEAR)) obj.m_bAutoComplete = false;
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) obj.m_iNewDefaultSkill1 = 0;
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) obj.m_iNewDefaultSkill2 = 0;
  return obj;
}
export function putKDBE_QUEST_COMPLETE_ACK(ks: KSerializer, obj: KDBE_QUEST_COMPLETE_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (Boolean(f.SERV_DAILY_QUEST)) { if (!(ks.putUserClass((obj.m_kCompleteQuestInfo ?? createKCompleteQuestInfo(f)), putKCompleteQuestInfo, f))) return false; }
  if (!f.SERV_DAILY_QUEST) { if (!(ks.putInt32((obj.m_iQuestID ?? 0)))) return false; }
  if (!(ks.putBool(obj.m_bIsChangeJob))) return false;
  if (!(ks.putInt8(obj.m_cChangeUnitClass))) return false;
  if (!(ks.putBool(obj.m_bIsNew))) return false;
  if (!(ks.putMap(obj.m_mapInsertedItem, (ks, k: Int32) => ks.putInt32(k), (ks, v: KItemInfo) => ks.putUserClass(v, putKItemInfo, f)))) return false;
  if (!(ks.putUserClass(obj.m_kItemQuantityUpdate, putKItemQuantityUpdate, f))) return false;
  if (!(ks.putVector(obj.m_vecUpdatedInventorySlot, (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false;
  if (!(ks.putMap(obj.m_mapItemInfo, (ks, k: UidType) => ks.putInt64(k), (ks, v: KItemInfo) => ks.putUserClass(v, putKItemInfo, f)))) return false;
  if (Boolean(f.SERV_ENTER_FIELD_QUEST_CLEAR)) { if (!(ks.putBool((obj.m_bAutoComplete ?? false)))) return false; }
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) { if (!(ks.putInt32((obj.m_iNewDefaultSkill1 ?? 0)))) return false; }
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) { if (!(ks.putInt32((obj.m_iNewDefaultSkill2 ?? 0)))) return false; }
  return true;
}
export function getKDBE_QUEST_COMPLETE_ACK(ks: KSerializer, flags?: FlagInput): KDBE_QUEST_COMPLETE_ACK {
  const f = resolveFlags(flags);
  const obj = createKDBE_QUEST_COMPLETE_ACK(f);
  obj.m_iOK = ks.getInt32();
  if (Boolean(f.SERV_DAILY_QUEST)) { obj.m_kCompleteQuestInfo = ks.getUserClass(getKCompleteQuestInfo, f); }
  if (!f.SERV_DAILY_QUEST) { obj.m_iQuestID = ks.getInt32(); }
  obj.m_bIsChangeJob = ks.getBool();
  obj.m_cChangeUnitClass = ks.getInt8();
  obj.m_bIsNew = ks.getBool();
  obj.m_mapInsertedItem = ks.getMap<Int32, KItemInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKItemInfo, f));
  obj.m_kItemQuantityUpdate = ks.getUserClass(getKItemQuantityUpdate, f);
  obj.m_vecUpdatedInventorySlot = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f));
  obj.m_mapItemInfo = ks.getMap<UidType, KItemInfo>((ks) => ks.getInt64(), (ks) => ks.getUserClass(getKItemInfo, f));
  if (Boolean(f.SERV_ENTER_FIELD_QUEST_CLEAR)) { obj.m_bAutoComplete = ks.getBool(); }
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) { obj.m_iNewDefaultSkill1 = ks.getInt32(); }
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) { obj.m_iNewDefaultSkill2 = ks.getInt32(); }
  return obj;
}

export interface KELG_REGISTER_UNIT_NOT {
  m_nUnitUID: UidType;
  m_uiKNMSerialNum: UInt32;
  m_wstrUnitNickName: string;
  m_bDenyFriendShip: boolean;
  m_setFriendUID: Set<UidType>;
}
export function createKELG_REGISTER_UNIT_NOT(flags?: FlagInput): KELG_REGISTER_UNIT_NOT {
  const f = resolveFlags(flags);
  return {
    m_nUnitUID: 0n,
    m_uiKNMSerialNum: 0,
    m_wstrUnitNickName: '',
    m_bDenyFriendShip: false,
    m_setFriendUID: new Set<UidType>(),
  };
}
export function putKELG_REGISTER_UNIT_NOT(ks: KSerializer, obj: KELG_REGISTER_UNIT_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_nUnitUID))) return false;
  if (!(ks.putUInt32(obj.m_uiKNMSerialNum))) return false;
  if (!(ks.putWString(obj.m_wstrUnitNickName))) return false;
  if (!(ks.putBool(obj.m_bDenyFriendShip))) return false;
  if (!(ks.putSet(obj.m_setFriendUID, (ks, item: UidType) => ks.putInt64(item)))) return false;
  return true;
}
export function getKELG_REGISTER_UNIT_NOT(ks: KSerializer, flags?: FlagInput): KELG_REGISTER_UNIT_NOT {
  const f = resolveFlags(flags);
  const obj = createKELG_REGISTER_UNIT_NOT(f);
  obj.m_nUnitUID = ks.getInt64();
  obj.m_uiKNMSerialNum = ks.getUInt32();
  obj.m_wstrUnitNickName = ks.getWString();
  obj.m_bDenyFriendShip = ks.getBool();
  obj.m_setFriendUID = ks.getSet<UidType>((ks) => ks.getInt64());
  return obj;
}

export interface KLocalRankingUserInfo {
  m_iUserUID?: UidType;
  m_iCategory?: Int32;
  m_iBirth?: Int64;
  m_wstrProfile?: string;
  m_byteFilter?: UInt8;
  m_byteGender?: UInt8;
}
export function createKLocalRankingUserInfo(flags?: FlagInput): KLocalRankingUserInfo {
  const f = resolveFlags(flags);
  const obj: KLocalRankingUserInfo = {
  };
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_iUserUID = 0n;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_iCategory = -1;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_iBirth = 0n;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_wstrProfile = '';
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_byteFilter = 0;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_byteGender = 0;
  return obj;
}
export function putKLocalRankingUserInfo(ks: KSerializer, obj: KLocalRankingUserInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) {
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt64((obj.m_iUserUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt32((obj.m_iCategory ?? -1)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt64((obj.m_iBirth ?? 0n)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putWString((obj.m_wstrProfile ?? '')))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putUInt8((obj.m_byteFilter ?? 0)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putUInt8((obj.m_byteGender ?? 0)))) return false; }
  }
  return true;
}
export function getKLocalRankingUserInfo(ks: KSerializer, flags?: FlagInput): KLocalRankingUserInfo {
  const f = resolveFlags(flags);
  const obj = createKLocalRankingUserInfo(f);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) {
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_iUserUID = ks.getInt64(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_iCategory = ks.getInt32(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_iBirth = ks.getInt64(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_wstrProfile = ks.getWString(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_byteFilter = ks.getUInt8(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_byteGender = ks.getUInt8(); }
  }
  return obj;
}

export interface KConnectionUnitInfo {
  m_iUnitUID: UidType;
  m_nKNMSN: Int32;
  m_cUnitClass: Int8;
  m_ucLevel: UInt8;
  m_wstrCharName: string;
  m_cRank?: Int8;
  m_iRating?: Int32;
  m_iRPoint?: Int32;
  m_iPVPEmblem?: Int32;
  m_uiPVPRanking: UInt32;
  m_iWin: Int32;
  m_iLose: Int32;
  m_uiKillNum: UInt32;
  m_iChannelID: Int32;
  m_cState: Int8;
  m_iStateCode: Int32;
  m_iPartyUID: UidType;
  m_iRoomUID: UidType;
  m_bPublic: boolean;
  m_bCanIntrude: boolean;
  m_iDungeonID: Int32;
  m_iRoomListID: Int8;
  m_wstrGuildName?: string;
  m_kLocalRankingUserInfo?: KLocalRankingUserInfo;
}
export function createKConnectionUnitInfo(flags?: FlagInput): KConnectionUnitInfo {
  const f = resolveFlags(flags);
  const obj: KConnectionUnitInfo = {
    m_iUnitUID: 0n,
    m_nKNMSN: 0,
    m_cUnitClass: 0,
    m_ucLevel: 0,
    m_wstrCharName: '',
    m_uiPVPRanking: 0,
    m_iWin: 0,
    m_iLose: 0,
    m_uiKillNum: 0,
    m_iChannelID: 0,
    m_cState: 0,
    m_iStateCode: 0,
    m_iPartyUID: 0n,
    m_iRoomUID: 0n,
    m_bPublic: false,
    m_bCanIntrude: false,
    m_iDungeonID: 0,
    m_iRoomListID: 0,
  };
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) obj.m_cRank = 0;
  if (f.SERV_PVP_NEW_SYSTEM && !f.SERV_2012_PVP_SEASON2) obj.m_iRating = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iRPoint = 0;
  if (!f.SERV_PVP_NEW_SYSTEM) obj.m_iPVPEmblem = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_wstrGuildName = '';
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_kLocalRankingUserInfo = createKLocalRankingUserInfo(f);
  return obj;
}
export function putKConnectionUnitInfo(ks: KSerializer, obj: KConnectionUnitInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putInt32(obj.m_nKNMSN))) return false;
  if (!(ks.putInt8(obj.m_cUnitClass))) return false;
  if (!(ks.putUInt8(obj.m_ucLevel))) return false;
  if (!(ks.putWString(obj.m_wstrCharName))) return false;
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { if (!(ks.putInt8((obj.m_cRank ?? 0)))) return false; }
  if (f.SERV_PVP_NEW_SYSTEM && !f.SERV_2012_PVP_SEASON2) { if (!(ks.putInt32((obj.m_iRating ?? 0)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iRPoint ?? 0)))) return false; }
  if (!f.SERV_PVP_NEW_SYSTEM) { if (!(ks.putInt32((obj.m_iPVPEmblem ?? 0)))) return false; }
  if (!(ks.putUInt32(obj.m_uiPVPRanking))) return false;
  if (!(ks.putInt32(obj.m_iWin))) return false;
  if (!(ks.putInt32(obj.m_iLose))) return false;
  if (!(ks.putUInt32(obj.m_uiKillNum))) return false;
  if (!(ks.putInt32(obj.m_iChannelID))) return false;
  if (!(ks.putInt8(obj.m_cState))) return false;
  if (!(ks.putInt32(obj.m_iStateCode))) return false;
  if (!(ks.putInt64(obj.m_iPartyUID))) return false;
  if (!(ks.putInt64(obj.m_iRoomUID))) return false;
  if (!(ks.putBool(obj.m_bPublic))) return false;
  if (!(ks.putBool(obj.m_bCanIntrude))) return false;
  if (!(ks.putInt32(obj.m_iDungeonID))) return false;
  if (!(ks.putInt8(obj.m_iRoomListID))) return false;
  if (Boolean(f.GUILD_TEST)) { if (!(ks.putWString((obj.m_wstrGuildName ?? '')))) return false; }
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putUserClass((obj.m_kLocalRankingUserInfo ?? createKLocalRankingUserInfo(f)), putKLocalRankingUserInfo, f))) return false; }
  return true;
}
export function getKConnectionUnitInfo(ks: KSerializer, flags?: FlagInput): KConnectionUnitInfo {
  const f = resolveFlags(flags);
  const obj = createKConnectionUnitInfo(f);
  obj.m_iUnitUID = ks.getInt64();
  obj.m_nKNMSN = ks.getInt32();
  obj.m_cUnitClass = ks.getInt8();
  obj.m_ucLevel = ks.getUInt8();
  obj.m_wstrCharName = ks.getWString();
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { obj.m_cRank = ks.getInt8(); }
  if (f.SERV_PVP_NEW_SYSTEM && !f.SERV_2012_PVP_SEASON2) { obj.m_iRating = ks.getInt32(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iRPoint = ks.getInt32(); }
  if (!f.SERV_PVP_NEW_SYSTEM) { obj.m_iPVPEmblem = ks.getInt32(); }
  obj.m_uiPVPRanking = ks.getUInt32();
  obj.m_iWin = ks.getInt32();
  obj.m_iLose = ks.getInt32();
  obj.m_uiKillNum = ks.getUInt32();
  obj.m_iChannelID = ks.getInt32();
  obj.m_cState = ks.getInt8();
  obj.m_iStateCode = ks.getInt32();
  obj.m_iPartyUID = ks.getInt64();
  obj.m_iRoomUID = ks.getInt64();
  obj.m_bPublic = ks.getBool();
  obj.m_bCanIntrude = ks.getBool();
  obj.m_iDungeonID = ks.getInt32();
  obj.m_iRoomListID = ks.getInt8();
  if (Boolean(f.GUILD_TEST)) { obj.m_wstrGuildName = ks.getWString(); }
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_kLocalRankingUserInfo = ks.getUserClass(getKLocalRankingUserInfo, f); }
  return obj;
}

export interface KELG_GET_UNIT_INFO_REQ {
  m_usEventID: UInt16;
  m_iDemandUserUID: UidType;
  m_iDemandGSUID: UidType;
  m_nKNMSN: Int32;
  m_wstrNickName: string;
}
export function createKELG_GET_UNIT_INFO_REQ(flags?: FlagInput): KELG_GET_UNIT_INFO_REQ {
  const f = resolveFlags(flags);
  return {
    m_usEventID: 0,
    m_iDemandUserUID: 0n,
    m_iDemandGSUID: 0n,
    m_nKNMSN: 0,
    m_wstrNickName: '',
  };
}
export function putKELG_GET_UNIT_INFO_REQ(ks: KSerializer, obj: KELG_GET_UNIT_INFO_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUInt16(obj.m_usEventID))) return false;
  if (!(ks.putInt64(obj.m_iDemandUserUID))) return false;
  if (!(ks.putInt64(obj.m_iDemandGSUID))) return false;
  if (!(ks.putInt32(obj.m_nKNMSN))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  return true;
}
export function getKELG_GET_UNIT_INFO_REQ(ks: KSerializer, flags?: FlagInput): KELG_GET_UNIT_INFO_REQ {
  const f = resolveFlags(flags);
  const obj = createKELG_GET_UNIT_INFO_REQ(f);
  obj.m_usEventID = ks.getUInt16();
  obj.m_iDemandUserUID = ks.getInt64();
  obj.m_iDemandGSUID = ks.getInt64();
  obj.m_nKNMSN = ks.getInt32();
  obj.m_wstrNickName = ks.getWString();
  return obj;
}

export interface KELG_GET_UNIT_INFO_ACK {
  m_usEventID: UInt16;
  m_iDemandUserUID: UidType;
  m_iDemandGSUID: UidType;
  m_iOK: Int32;
  m_kCUnitInfo: KConnectionUnitInfo;
}
export function createKELG_GET_UNIT_INFO_ACK(flags?: FlagInput): KELG_GET_UNIT_INFO_ACK {
  const f = resolveFlags(flags);
  return {
    m_usEventID: 0,
    m_iDemandUserUID: 0n,
    m_iDemandGSUID: 0n,
    m_iOK: 0,
    m_kCUnitInfo: createKConnectionUnitInfo(f),
  };
}
export function putKELG_GET_UNIT_INFO_ACK(ks: KSerializer, obj: KELG_GET_UNIT_INFO_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUInt16(obj.m_usEventID))) return false;
  if (!(ks.putInt64(obj.m_iDemandUserUID))) return false;
  if (!(ks.putInt64(obj.m_iDemandGSUID))) return false;
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putUserClass(obj.m_kCUnitInfo, putKConnectionUnitInfo, f))) return false;
  return true;
}
export function getKELG_GET_UNIT_INFO_ACK(ks: KSerializer, flags?: FlagInput): KELG_GET_UNIT_INFO_ACK {
  const f = resolveFlags(flags);
  const obj = createKELG_GET_UNIT_INFO_ACK(f);
  obj.m_usEventID = ks.getUInt16();
  obj.m_iDemandUserUID = ks.getInt64();
  obj.m_iDemandGSUID = ks.getInt64();
  obj.m_iOK = ks.getInt32();
  obj.m_kCUnitInfo = ks.getUserClass(getKConnectionUnitInfo, f);
  return obj;
}

export interface KSquareInfo {
  m_cSquareType: Int8;
  m_cSortIndex?: Int8;
  m_iSquareUID: UidType;
  m_wstrRoomName: string;
  m_MaxSlot: Int8;
  m_JoinSlot: Int8;
  m_RelayIP: string;
  m_Port: Int32;
}
export function createKSquareInfo(flags?: FlagInput): KSquareInfo {
  const f = resolveFlags(flags);
  const obj: KSquareInfo = {
    m_cSquareType: 0,
    m_iSquareUID: 0n,
    m_wstrRoomName: '',
    m_MaxSlot: 0,
    m_JoinSlot: 0,
    m_RelayIP: '',
    m_Port: 0,
  };
  if (Boolean(f.SERV_SQUARE_LIST_SERV_UID)) obj.m_cSortIndex = 0;
  return obj;
}
export function putKSquareInfo(ks: KSerializer, obj: KSquareInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt8(obj.m_cSquareType))) return false;
  if (Boolean(f.SERV_SQUARE_LIST_SERV_UID)) { if (!(ks.putInt8((obj.m_cSortIndex ?? 0)))) return false; }
  if (!(ks.putInt64(obj.m_iSquareUID))) return false;
  if (!(ks.putWString(obj.m_wstrRoomName))) return false;
  if (!(ks.putInt8(obj.m_MaxSlot))) return false;
  if (!(ks.putInt8(obj.m_JoinSlot))) return false;
  if (!(ks.putWString(obj.m_RelayIP))) return false;
  if (!(ks.putInt32(obj.m_Port))) return false;
  return true;
}
export function getKSquareInfo(ks: KSerializer, flags?: FlagInput): KSquareInfo {
  const f = resolveFlags(flags);
  const obj = createKSquareInfo(f);
  obj.m_cSquareType = ks.getInt8();
  if (Boolean(f.SERV_SQUARE_LIST_SERV_UID)) { obj.m_cSortIndex = ks.getInt8(); }
  obj.m_iSquareUID = ks.getInt64();
  obj.m_wstrRoomName = ks.getWString();
  obj.m_MaxSlot = ks.getInt8();
  obj.m_JoinSlot = ks.getInt8();
  obj.m_RelayIP = ks.getWString();
  obj.m_Port = ks.getInt32();
  return obj;
}

export interface KSquareUserInfo {
  m_iGSUID: UidType;
  m_iUnitUID: UidType;
  m_wstrNickName: string;
  m_wstrIP: string;
  m_usPort: UInt16;
  m_cUnitClass: Int8;
  m_ucLevel: UInt8;
  m_cRank?: Int8;
  m_iRating?: Int32;
  m_cPVPEmblem?: Int8;
  m_bIsParty: boolean;
  m_cPersonalShopState: Int8;
  m_cPersonalShopType: Int8;
  m_wstrPersonalShopName: string;
  m_vecEquippedItem: KInventoryItemSimpleInfo[];
  m_iTitleID?: Int32;
  m_sTitleID?: Int16;
  m_wstrGuildName?: string;
  m_iED?: Int32;
  m_iEventQuestClearCount?: Int32;
  m_iExchangeCount?: Int32;
  m_iAccountPVPLoseCount?: UInt32;
}
export function createKSquareUserInfo(flags?: FlagInput): KSquareUserInfo {
  const f = resolveFlags(flags);
  const obj: KSquareUserInfo = {
    m_iGSUID: 0n,
    m_iUnitUID: 0n,
    m_wstrNickName: '',
    m_wstrIP: '',
    m_usPort: 0,
    m_cUnitClass: 0,
    m_ucLevel: 0,
    m_bIsParty: false,
    m_cPersonalShopState: 0,
    m_cPersonalShopType: 0,
    m_wstrPersonalShopName: '',
    m_vecEquippedItem: ([] as KInventoryItemSimpleInfo[]),
  };
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) obj.m_cRank = 0;
  if (f.SERV_PVP_NEW_SYSTEM && !f.SERV_2012_PVP_SEASON2) obj.m_iRating = 0;
  if (!f.SERV_PVP_NEW_SYSTEM) obj.m_cPVPEmblem = 0;
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) obj.m_iTitleID = 0;
  if (!f.SERV_TITLE_DATA_SIZE) obj.m_sTitleID = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_wstrGuildName = '';
  if (Boolean(f.SERV_ED_MONITORING_IN_GAME)) obj.m_iED = 0;
  if (Boolean(f.SERV_GROW_UP_SOCKET)) obj.m_iEventQuestClearCount = 0;
  if (Boolean(f.SERV_GROW_UP_SOCKET)) obj.m_iExchangeCount = 0;
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_iAccountPVPLoseCount = 0;
  return obj;
}
export function putKSquareUserInfo(ks: KSerializer, obj: KSquareUserInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iGSUID))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (!(ks.putWString(obj.m_wstrIP))) return false;
  if (!(ks.putUInt16(obj.m_usPort))) return false;
  if (!(ks.putInt8(obj.m_cUnitClass))) return false;
  if (!(ks.putUInt8(obj.m_ucLevel))) return false;
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { if (!(ks.putInt8((obj.m_cRank ?? 0)))) return false; }
  if (f.SERV_PVP_NEW_SYSTEM && !f.SERV_2012_PVP_SEASON2) { if (!(ks.putInt32((obj.m_iRating ?? 0)))) return false; }
  if (!f.SERV_PVP_NEW_SYSTEM) { if (!(ks.putInt8((obj.m_cPVPEmblem ?? 0)))) return false; }
  if (!(ks.putBool(obj.m_bIsParty))) return false;
  if (!(ks.putInt8(obj.m_cPersonalShopState))) return false;
  if (!(ks.putInt8(obj.m_cPersonalShopType))) return false;
  if (!(ks.putWString(obj.m_wstrPersonalShopName))) return false;
  if (!(ks.putVector(obj.m_vecEquippedItem, (ks, item: KInventoryItemSimpleInfo) => ks.putUserClass(item, putKInventoryItemSimpleInfo, f)))) return false;
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) { if (!(ks.putInt32((obj.m_iTitleID ?? 0)))) return false; }
  if (!f.SERV_TITLE_DATA_SIZE) { if (!(ks.putInt16((obj.m_sTitleID ?? 0)))) return false; }
  if (Boolean(f.GUILD_TEST)) { if (!(ks.putWString((obj.m_wstrGuildName ?? '')))) return false; }
  if (Boolean(f.SERV_ED_MONITORING_IN_GAME)) { if (!(ks.putInt32((obj.m_iED ?? 0)))) return false; }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { if (!(ks.putInt32((obj.m_iEventQuestClearCount ?? 0)))) return false; }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { if (!(ks.putInt32((obj.m_iExchangeCount ?? 0)))) return false; }
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putUInt32((obj.m_iAccountPVPLoseCount ?? 0)))) return false; }
  return true;
}
export function getKSquareUserInfo(ks: KSerializer, flags?: FlagInput): KSquareUserInfo {
  const f = resolveFlags(flags);
  const obj = createKSquareUserInfo(f);
  obj.m_iGSUID = ks.getInt64();
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  obj.m_wstrIP = ks.getWString();
  obj.m_usPort = ks.getUInt16();
  obj.m_cUnitClass = ks.getInt8();
  obj.m_ucLevel = ks.getUInt8();
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { obj.m_cRank = ks.getInt8(); }
  if (f.SERV_PVP_NEW_SYSTEM && !f.SERV_2012_PVP_SEASON2) { obj.m_iRating = ks.getInt32(); }
  if (!f.SERV_PVP_NEW_SYSTEM) { obj.m_cPVPEmblem = ks.getInt8(); }
  obj.m_bIsParty = ks.getBool();
  obj.m_cPersonalShopState = ks.getInt8();
  obj.m_cPersonalShopType = ks.getInt8();
  obj.m_wstrPersonalShopName = ks.getWString();
  obj.m_vecEquippedItem = ks.getVector<KInventoryItemSimpleInfo>((ks) => ks.getUserClass(getKInventoryItemSimpleInfo, f));
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) { obj.m_iTitleID = ks.getInt32(); }
  if (!f.SERV_TITLE_DATA_SIZE) { obj.m_sTitleID = ks.getInt16(); }
  if (Boolean(f.GUILD_TEST)) { obj.m_wstrGuildName = ks.getWString(); }
  if (Boolean(f.SERV_ED_MONITORING_IN_GAME)) { obj.m_iED = ks.getInt32(); }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { obj.m_iEventQuestClearCount = ks.getInt32(); }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { obj.m_iExchangeCount = ks.getInt32(); }
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_iAccountPVPLoseCount = ks.getUInt32(); }
  return obj;
}

export const KPartyInfo_PARTY_TYPE = {
  PT_NONE: 0,
  PT_DUNGEON_PARTY: 1,
  PT_PVP_PARTY: 2,
} as const;
export type KPartyInfo_PARTY_TYPE = (typeof KPartyInfo_PARTY_TYPE)[keyof typeof KPartyInfo_PARTY_TYPE];
export function getKPartyInfo_PARTY_TYPE(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) {
    cur = 0;
    out['PT_NONE'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) {
    out['PT_DUNGEON_PARTY'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) {
    out['PT_PVP_PARTY'] = cur;
    cur += 1;
  }
  return out;
}
export interface KPartyInfo {
  m_iPartyUID: UidType;
  m_cPartyType?: Int8;
  m_wstrPartyName: string;
  m_JoinSlot: Int8;
  m_MaxSlot: Int8;
  m_bPublic: boolean;
  m_iDungeonID: Int32;
  m_DifficultyLevel: Int8;
  m_cGetItemType: Int8;
  m_cDungeonMode: Int8;
  m_sPartyFever?: Int16;
  m_ucPartyFever?: UInt8;
  m_bCheckLowLevel?: boolean;
  m_cPVPGameType?: Int8;
  m_bComeBackBuff?: boolean;
  m_wsrtComeBackBuffEnd?: string;
}
export function createKPartyInfo(flags?: FlagInput): KPartyInfo {
  const f = resolveFlags(flags);
  const obj: KPartyInfo = {
    m_iPartyUID: 0n,
    m_wstrPartyName: '',
    m_JoinSlot: 0,
    m_MaxSlot: 0,
    m_bPublic: true,
    m_iDungeonID: 0,
    m_DifficultyLevel: 0,
    m_cGetItemType: 1,
    m_cDungeonMode: 0,
  };
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_cPartyType = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_sPartyFever = 0;
  if (!f.SERV_BATTLE_FIELD_SYSTEM) obj.m_ucPartyFever = 0;
  if (Boolean(f.SERV_DUNGEON_DIFFICULTY_REVISION)) obj.m_bCheckLowLevel = false;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_cPVPGameType = 0;
  if (Boolean(f.SERV_COME_BACK_USER_REWARD)) obj.m_bComeBackBuff = false;
  if (Boolean(f.SERV_COME_BACK_USER_REWARD)) obj.m_wsrtComeBackBuffEnd = '';
  return obj;
}
export function putKPartyInfo(ks: KSerializer, obj: KPartyInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iPartyUID))) return false;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt8((obj.m_cPartyType ?? 0)))) return false; }
  if (!(ks.putWString(obj.m_wstrPartyName))) return false;
  if (!(ks.putInt8(obj.m_JoinSlot))) return false;
  if (!(ks.putInt8(obj.m_MaxSlot))) return false;
  if (!(ks.putBool(obj.m_bPublic))) return false;
  if (!(ks.putInt32(obj.m_iDungeonID))) return false;
  if (!(ks.putInt8(obj.m_DifficultyLevel))) return false;
  if (!(ks.putInt8(obj.m_cGetItemType))) return false;
  if (!(ks.putInt8(obj.m_cDungeonMode))) return false;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt16((obj.m_sPartyFever ?? 0)))) return false; }
  if (!f.SERV_BATTLE_FIELD_SYSTEM) { if (!(ks.putUInt8((obj.m_ucPartyFever ?? 0)))) return false; }
  if (Boolean(f.SERV_DUNGEON_DIFFICULTY_REVISION)) { if (!(ks.putBool((obj.m_bCheckLowLevel ?? false)))) return false; }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt8((obj.m_cPVPGameType ?? 0)))) return false; }
  if (Boolean(f.SERV_COME_BACK_USER_REWARD)) { if (!(ks.putBool((obj.m_bComeBackBuff ?? false)))) return false; }
  if (Boolean(f.SERV_COME_BACK_USER_REWARD)) { if (!(ks.putWString((obj.m_wsrtComeBackBuffEnd ?? '')))) return false; }
  return true;
}
export function getKPartyInfo(ks: KSerializer, flags?: FlagInput): KPartyInfo {
  const f = resolveFlags(flags);
  const obj = createKPartyInfo(f);
  obj.m_iPartyUID = ks.getInt64();
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_cPartyType = ks.getInt8(); }
  obj.m_wstrPartyName = ks.getWString();
  obj.m_JoinSlot = ks.getInt8();
  obj.m_MaxSlot = ks.getInt8();
  obj.m_bPublic = ks.getBool();
  obj.m_iDungeonID = ks.getInt32();
  obj.m_DifficultyLevel = ks.getInt8();
  obj.m_cGetItemType = ks.getInt8();
  obj.m_cDungeonMode = ks.getInt8();
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_sPartyFever = ks.getInt16(); }
  if (!f.SERV_BATTLE_FIELD_SYSTEM) { obj.m_ucPartyFever = ks.getUInt8(); }
  if (Boolean(f.SERV_DUNGEON_DIFFICULTY_REVISION)) { obj.m_bCheckLowLevel = ks.getBool(); }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_cPVPGameType = ks.getInt8(); }
  if (Boolean(f.SERV_COME_BACK_USER_REWARD)) { obj.m_bComeBackBuff = ks.getBool(); }
  if (Boolean(f.SERV_COME_BACK_USER_REWARD)) { obj.m_wsrtComeBackBuffEnd = ks.getWString(); }
  return obj;
}

export interface KCreatePartyInfo {
  m_cPartyType?: Int8;
  m_iDungeonID?: Int32;
  m_DifficultyLevel?: Int8;
  m_cGetItemType?: Int8;
  m_cDungeonMode?: Int8;
  m_bCheckLowLevel?: boolean;
  m_cPVPGameType?: Int8;
}
export function createKCreatePartyInfo(flags?: FlagInput): KCreatePartyInfo {
  const f = resolveFlags(flags);
  const obj: KCreatePartyInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_cPartyType = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iDungeonID = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_DifficultyLevel = -1;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_cGetItemType = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_cDungeonMode = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_bCheckLowLevel = false;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_cPVPGameType = -1;
  return obj;
}
export function putKCreatePartyInfo(ks: KSerializer, obj: KCreatePartyInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_cPartyType ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iDungeonID ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_DifficultyLevel ?? -1)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_cGetItemType ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_cDungeonMode ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putBool((obj.m_bCheckLowLevel ?? false)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_cPVPGameType ?? -1)))) return false; }
  }
  return true;
}
export function getKCreatePartyInfo(ks: KSerializer, flags?: FlagInput): KCreatePartyInfo {
  const f = resolveFlags(flags);
  const obj = createKCreatePartyInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_cPartyType = ks.getInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iDungeonID = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_DifficultyLevel = ks.getInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_cGetItemType = ks.getInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_cDungeonMode = ks.getInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_bCheckLowLevel = ks.getBool(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_cPVPGameType = ks.getInt8(); }
  }
  return obj;
}

export interface KPartyUserInfo {
  m_iGSUID?: UidType;
  m_iChannelID?: Int32;
  m_iFieldUID?: UidType;
  m_iUnitUID?: UidType;
  m_cUnitClass?: Int8;
  m_wstrNickName?: string;
  m_ucLevel?: UInt8;
  m_bIsGuestUser?: boolean;
  m_cState?: UInt8;
  m_iStateCode?: Int32;
  m_bReady?: boolean;
  m_bHost?: boolean;
  m_bComeBack?: boolean;
  m_wsrtComeBackEnd?: string;
  m_cRank?: Int8;
  m_iOfficialMatchCnt?: Int32;
  m_iRating?: Int32;
  m_iRPoint?: Int32;
  m_kGamePlayStatus?: KPartyMemberStatus;
  m_wstrIP?: string;
  m_usPort?: UInt16;
  m_dwPingScore?: UInt32;
  m_wstrInternalIP?: string;
  m_usInternalPort?: UInt16;
}
export function createKPartyUserInfo(flags?: FlagInput): KPartyUserInfo {
  const f = resolveFlags(flags);
  const obj: KPartyUserInfo = {
  };
  if (Boolean(f.SERV_CHANNEL_PARTY)) {
    if (Boolean(f.SERV_CHANNEL_PARTY)) obj.m_iGSUID = 0n;
    if (Boolean(f.SERV_CHANNEL_PARTY)) obj.m_iChannelID = 0;
    if (Boolean(f.SERV_CHANNEL_PARTY)) obj.m_iFieldUID = 0n;
    if (Boolean(f.SERV_CHANNEL_PARTY)) obj.m_iUnitUID = 0n;
    if (Boolean(f.SERV_CHANNEL_PARTY)) obj.m_cUnitClass = 0;
    if (Boolean(f.SERV_CHANNEL_PARTY)) obj.m_wstrNickName = '';
    if (Boolean(f.SERV_CHANNEL_PARTY)) obj.m_ucLevel = 0;
    if (Boolean(f.SERV_CHANNEL_PARTY)) obj.m_bIsGuestUser = false;
    if (Boolean(f.SERV_CHANNEL_PARTY)) obj.m_cState = 0;
    if (Boolean(f.SERV_CHANNEL_PARTY)) obj.m_iStateCode = 0;
    if (Boolean(f.SERV_CHANNEL_PARTY)) obj.m_bReady = false;
    if (Boolean(f.SERV_CHANNEL_PARTY)) obj.m_bHost = false;
    if (f.SERV_CHANNEL_PARTY && f.SERV_COME_BACK_USER_REWARD) obj.m_bComeBack = false;
    if (f.SERV_CHANNEL_PARTY && f.SERV_COME_BACK_USER_REWARD) obj.m_wsrtComeBackEnd = '';
    if (f.SERV_CHANNEL_PARTY && f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) obj.m_cRank = 0;
    if (f.SERV_CHANNEL_PARTY && f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) obj.m_iOfficialMatchCnt = 0;
    if (f.SERV_CHANNEL_PARTY && f.SERV_PVP_NEW_SYSTEM) obj.m_iRating = 0;
    if (f.SERV_CHANNEL_PARTY && f.SERV_PVP_NEW_SYSTEM) obj.m_iRPoint = 0;
    if (f.SERV_CHANNEL_PARTY && f.SERV_BATTLE_FIELD_SYSTEM) obj.m_kGamePlayStatus = createKPartyMemberStatus(f);
    if (f.SERV_CHANNEL_PARTY && f.SERV_CHOOSE_FASTEST_HOST) obj.m_wstrIP = '';
    if (f.SERV_CHANNEL_PARTY && f.SERV_CHOOSE_FASTEST_HOST) obj.m_usPort = 0;
    if (f.SERV_CHANNEL_PARTY && f.SERV_CHOOSE_FASTEST_HOST) obj.m_dwPingScore = 99999;
    if (Boolean(f.SERV_CHANNEL_PARTY)) obj.m_wstrInternalIP = '';
    if (Boolean(f.SERV_CHANNEL_PARTY)) obj.m_usInternalPort = 0;
  }
  else if (!f.SERV_CHANNEL_PARTY) {
    if (!f.SERV_CHANNEL_PARTY) obj.m_iUnitUID = 0n;
    if (!f.SERV_CHANNEL_PARTY) obj.m_wstrNickName = '';
    if (!f.SERV_CHANNEL_PARTY) obj.m_cUnitClass = 0;
    if (!f.SERV_CHANNEL_PARTY) obj.m_ucLevel = 0;
    if (!f.SERV_CHANNEL_PARTY) obj.m_cState = 0;
    if (!f.SERV_CHANNEL_PARTY) obj.m_iStateCode = 0;
    if (!f.SERV_CHANNEL_PARTY) obj.m_bReady = false;
    if (!f.SERV_CHANNEL_PARTY) obj.m_bHost = false;
  }
  return obj;
}
export function putKPartyUserInfo(ks: KSerializer, obj: KPartyUserInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CHANNEL_PARTY)) {
    if (Boolean(f.SERV_CHANNEL_PARTY)) { if (!(ks.putInt64((obj.m_iGSUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { if (!(ks.putInt32((obj.m_iChannelID ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { if (!(ks.putInt64((obj.m_iFieldUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { if (!(ks.putInt8((obj.m_cUnitClass ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { if (!(ks.putUInt8((obj.m_ucLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { if (!(ks.putBool((obj.m_bIsGuestUser ?? false)))) return false; }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { if (!(ks.putUInt8((obj.m_cState ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { if (!(ks.putInt32((obj.m_iStateCode ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { if (!(ks.putBool((obj.m_bReady ?? false)))) return false; }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { if (!(ks.putBool((obj.m_bHost ?? false)))) return false; }
    if (f.SERV_CHANNEL_PARTY && f.SERV_COME_BACK_USER_REWARD) { if (!(ks.putBool((obj.m_bComeBack ?? false)))) return false; }
    if (f.SERV_CHANNEL_PARTY && f.SERV_COME_BACK_USER_REWARD) { if (!(ks.putWString((obj.m_wsrtComeBackEnd ?? '')))) return false; }
    if (f.SERV_CHANNEL_PARTY && f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { if (!(ks.putInt8((obj.m_cRank ?? 0)))) return false; }
    if (f.SERV_CHANNEL_PARTY && f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { if (!(ks.putInt32((obj.m_iOfficialMatchCnt ?? 0)))) return false; }
    if (f.SERV_CHANNEL_PARTY && f.SERV_PVP_NEW_SYSTEM) { if (!(ks.putInt32((obj.m_iRating ?? 0)))) return false; }
    if (f.SERV_CHANNEL_PARTY && f.SERV_PVP_NEW_SYSTEM) { if (!(ks.putInt32((obj.m_iRPoint ?? 0)))) return false; }
    if (f.SERV_CHANNEL_PARTY && f.SERV_BATTLE_FIELD_SYSTEM) { if (!(ks.putUserClass((obj.m_kGamePlayStatus ?? createKPartyMemberStatus(f)), putKPartyMemberStatus, f))) return false; }
    if (f.SERV_CHANNEL_PARTY && f.SERV_CHOOSE_FASTEST_HOST) { if (!(ks.putWString((obj.m_wstrIP ?? '')))) return false; }
    if (f.SERV_CHANNEL_PARTY && f.SERV_CHOOSE_FASTEST_HOST) { if (!(ks.putUInt16((obj.m_usPort ?? 0)))) return false; }
    if (f.SERV_CHANNEL_PARTY && f.SERV_CHOOSE_FASTEST_HOST) { if (!(ks.putUInt32((obj.m_dwPingScore ?? 99999)))) return false; }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { if (!(ks.putWString((obj.m_wstrInternalIP ?? '')))) return false; }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { if (!(ks.putUInt16((obj.m_usInternalPort ?? 0)))) return false; }
  }
  else if (!f.SERV_CHANNEL_PARTY) {
    if (!f.SERV_CHANNEL_PARTY) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (!f.SERV_CHANNEL_PARTY) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
    if (!f.SERV_CHANNEL_PARTY) { if (!(ks.putInt8((obj.m_cUnitClass ?? 0)))) return false; }
    if (!f.SERV_CHANNEL_PARTY) { if (!(ks.putUInt8((obj.m_ucLevel ?? 0)))) return false; }
    if (!f.SERV_CHANNEL_PARTY) { if (!(ks.putUInt8((obj.m_cState ?? 0)))) return false; }
    if (!f.SERV_CHANNEL_PARTY) { if (!(ks.putInt32((obj.m_iStateCode ?? 0)))) return false; }
    if (!f.SERV_CHANNEL_PARTY) { if (!(ks.putBool((obj.m_bReady ?? false)))) return false; }
    if (!f.SERV_CHANNEL_PARTY) { if (!(ks.putBool((obj.m_bHost ?? false)))) return false; }
  }
  return true;
}
export function getKPartyUserInfo(ks: KSerializer, flags?: FlagInput): KPartyUserInfo {
  const f = resolveFlags(flags);
  const obj = createKPartyUserInfo(f);
  if (Boolean(f.SERV_CHANNEL_PARTY)) {
    if (Boolean(f.SERV_CHANNEL_PARTY)) { obj.m_iGSUID = ks.getInt64(); }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { obj.m_iChannelID = ks.getInt32(); }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { obj.m_iFieldUID = ks.getInt64(); }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { obj.m_cUnitClass = ks.getInt8(); }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { obj.m_wstrNickName = ks.getWString(); }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { obj.m_ucLevel = ks.getUInt8(); }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { obj.m_bIsGuestUser = ks.getBool(); }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { obj.m_cState = ks.getUInt8(); }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { obj.m_iStateCode = ks.getInt32(); }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { obj.m_bReady = ks.getBool(); }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { obj.m_bHost = ks.getBool(); }
    if (f.SERV_CHANNEL_PARTY && f.SERV_COME_BACK_USER_REWARD) { obj.m_bComeBack = ks.getBool(); }
    if (f.SERV_CHANNEL_PARTY && f.SERV_COME_BACK_USER_REWARD) { obj.m_wsrtComeBackEnd = ks.getWString(); }
    if (f.SERV_CHANNEL_PARTY && f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { obj.m_cRank = ks.getInt8(); }
    if (f.SERV_CHANNEL_PARTY && f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { obj.m_iOfficialMatchCnt = ks.getInt32(); }
    if (f.SERV_CHANNEL_PARTY && f.SERV_PVP_NEW_SYSTEM) { obj.m_iRating = ks.getInt32(); }
    if (f.SERV_CHANNEL_PARTY && f.SERV_PVP_NEW_SYSTEM) { obj.m_iRPoint = ks.getInt32(); }
    if (f.SERV_CHANNEL_PARTY && f.SERV_BATTLE_FIELD_SYSTEM) { obj.m_kGamePlayStatus = ks.getUserClass(getKPartyMemberStatus, f); }
    if (f.SERV_CHANNEL_PARTY && f.SERV_CHOOSE_FASTEST_HOST) { obj.m_wstrIP = ks.getWString(); }
    if (f.SERV_CHANNEL_PARTY && f.SERV_CHOOSE_FASTEST_HOST) { obj.m_usPort = ks.getUInt16(); }
    if (f.SERV_CHANNEL_PARTY && f.SERV_CHOOSE_FASTEST_HOST) { obj.m_dwPingScore = ks.getUInt32(); }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { obj.m_wstrInternalIP = ks.getWString(); }
    if (Boolean(f.SERV_CHANNEL_PARTY)) { obj.m_usInternalPort = ks.getUInt16(); }
  }
  else if (!f.SERV_CHANNEL_PARTY) {
    if (!f.SERV_CHANNEL_PARTY) { obj.m_iUnitUID = ks.getInt64(); }
    if (!f.SERV_CHANNEL_PARTY) { obj.m_wstrNickName = ks.getWString(); }
    if (!f.SERV_CHANNEL_PARTY) { obj.m_cUnitClass = ks.getInt8(); }
    if (!f.SERV_CHANNEL_PARTY) { obj.m_ucLevel = ks.getUInt8(); }
    if (!f.SERV_CHANNEL_PARTY) { obj.m_cState = ks.getUInt8(); }
    if (!f.SERV_CHANNEL_PARTY) { obj.m_iStateCode = ks.getInt32(); }
    if (!f.SERV_CHANNEL_PARTY) { obj.m_bReady = ks.getBool(); }
    if (!f.SERV_CHANNEL_PARTY) { obj.m_bHost = ks.getBool(); }
  }
  return obj;
}

export interface KOldPartyInfo {
  m_iOldPartyUID?: UidType;
  m_iOldHostUnitUID?: UidType;
  m_setOldPartyMember?: Set<UidType>;
  m_sOldPartyFever?: Int16;
}
export function createKOldPartyInfo(flags?: FlagInput): KOldPartyInfo {
  const f = resolveFlags(flags);
  const obj: KOldPartyInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iOldPartyUID = 0n;
  if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_REGROUP_OLD_PARTY_HOST) obj.m_iOldHostUnitUID = 0n;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_setOldPartyMember = new Set<UidType>();
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_sOldPartyFever = 0;
  return obj;
}
export function putKOldPartyInfo(ks: KSerializer, obj: KOldPartyInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt64((obj.m_iOldPartyUID ?? 0n)))) return false; }
    if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_REGROUP_OLD_PARTY_HOST) { if (!(ks.putInt64((obj.m_iOldHostUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putSet((obj.m_setOldPartyMember ?? new Set<UidType>()), (ks, item: UidType) => ks.putInt64(item)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt16((obj.m_sOldPartyFever ?? 0)))) return false; }
  }
  return true;
}
export function getKOldPartyInfo(ks: KSerializer, flags?: FlagInput): KOldPartyInfo {
  const f = resolveFlags(flags);
  const obj = createKOldPartyInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iOldPartyUID = ks.getInt64(); }
    if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_REGROUP_OLD_PARTY_HOST) { obj.m_iOldHostUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_setOldPartyMember = ks.getSet<UidType>((ks) => ks.getInt64()); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_sOldPartyFever = ks.getInt16(); }
  }
  return obj;
}

export interface KPartyListUserInfo {
  m_iChannelID: Int32;
  m_iUnitUID: UidType;
  m_wstrNickName: string;
  m_cUnitClass: Int8;
  m_ucLevel: UInt8;
  m_cState: UInt8;
  m_iStateCode: Int32;
  m_bHost: boolean;
}
export function createKPartyListUserInfo(flags?: FlagInput): KPartyListUserInfo {
  const f = resolveFlags(flags);
  return {
    m_iChannelID: 0,
    m_iUnitUID: 0n,
    m_wstrNickName: '',
    m_cUnitClass: 0,
    m_ucLevel: 0,
    m_cState: 0,
    m_iStateCode: 0,
    m_bHost: false,
  };
}
export function putKPartyListUserInfo(ks: KSerializer, obj: KPartyListUserInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iChannelID))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (!(ks.putInt8(obj.m_cUnitClass))) return false;
  if (!(ks.putUInt8(obj.m_ucLevel))) return false;
  if (!(ks.putUInt8(obj.m_cState))) return false;
  if (!(ks.putInt32(obj.m_iStateCode))) return false;
  if (!(ks.putBool(obj.m_bHost))) return false;
  return true;
}
export function getKPartyListUserInfo(ks: KSerializer, flags?: FlagInput): KPartyListUserInfo {
  const f = resolveFlags(flags);
  const obj = createKPartyListUserInfo(f);
  obj.m_iChannelID = ks.getInt32();
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  obj.m_cUnitClass = ks.getInt8();
  obj.m_ucLevel = ks.getUInt8();
  obj.m_cState = ks.getUInt8();
  obj.m_iStateCode = ks.getInt32();
  obj.m_bHost = ks.getBool();
  return obj;
}

export interface KPartyListInfo {
  m_kPartyInfo: KPartyInfo;
  m_vecPartyListUserInfo: KPartyListUserInfo[];
}
export function createKPartyListInfo(flags?: FlagInput): KPartyListInfo {
  const f = resolveFlags(flags);
  return {
    m_kPartyInfo: createKPartyInfo(f),
    m_vecPartyListUserInfo: ([] as KPartyListUserInfo[]),
  };
}
export function putKPartyListInfo(ks: KSerializer, obj: KPartyListInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUserClass(obj.m_kPartyInfo, putKPartyInfo, f))) return false;
  if (!(ks.putVector(obj.m_vecPartyListUserInfo, (ks, item: KPartyListUserInfo) => ks.putUserClass(item, putKPartyListUserInfo, f)))) return false;
  return true;
}
export function getKPartyListInfo(ks: KSerializer, flags?: FlagInput): KPartyListInfo {
  const f = resolveFlags(flags);
  const obj = createKPartyListInfo(f);
  obj.m_kPartyInfo = ks.getUserClass(getKPartyInfo, f);
  obj.m_vecPartyListUserInfo = ks.getVector<KPartyListUserInfo>((ks) => ks.getUserClass(getKPartyListUserInfo, f));
  return obj;
}

export interface KPartyRoomUserInfo {
  m_kRoomUserInfo: KRoomUserInfo;
  m_vecStudentUnitUID: UidType[];
  m_kOldPartyInfo?: KOldPartyInfo;
  m_bAutoPartyBonus?: boolean;
  m_wstrChannelIP?: string;
  m_iCurEXP: Int32;
  m_iCurED: Int32;
  m_iAutoPartyWaitTime?: Int32;
}
export function createKPartyRoomUserInfo(flags?: FlagInput): KPartyRoomUserInfo {
  const f = resolveFlags(flags);
  const obj: KPartyRoomUserInfo = {
    m_kRoomUserInfo: createKRoomUserInfo(f),
    m_vecStudentUnitUID: ([] as UidType[]),
    m_iCurEXP: 0,
    m_iCurED: 0,
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_kOldPartyInfo = createKOldPartyInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_bAutoPartyBonus = false;
  if (Boolean(f.SERV_ADD_DUNGEON_LOG_COLUMN_NUM_2)) obj.m_wstrChannelIP = '';
  if (Boolean(f.SERV_AUTO_PARTY_MATCHING_REQUIRED_TIME_LOG)) obj.m_iAutoPartyWaitTime = 0;
  return obj;
}
export function putKPartyRoomUserInfo(ks: KSerializer, obj: KPartyRoomUserInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUserClass(obj.m_kRoomUserInfo, putKRoomUserInfo, f))) return false;
  if (!(ks.putVector(obj.m_vecStudentUnitUID, (ks, item: UidType) => ks.putInt64(item)))) return false;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putUserClass((obj.m_kOldPartyInfo ?? createKOldPartyInfo(f)), putKOldPartyInfo, f))) return false; }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putBool((obj.m_bAutoPartyBonus ?? false)))) return false; }
  if (Boolean(f.SERV_ADD_DUNGEON_LOG_COLUMN_NUM_2)) { if (!(ks.putWString((obj.m_wstrChannelIP ?? '')))) return false; }
  if (!(ks.putInt32(obj.m_iCurEXP))) return false;
  if (!(ks.putInt32(obj.m_iCurED))) return false;
  if (Boolean(f.SERV_AUTO_PARTY_MATCHING_REQUIRED_TIME_LOG)) { if (!(ks.putInt32((obj.m_iAutoPartyWaitTime ?? 0)))) return false; }
  return true;
}
export function getKPartyRoomUserInfo(ks: KSerializer, flags?: FlagInput): KPartyRoomUserInfo {
  const f = resolveFlags(flags);
  const obj = createKPartyRoomUserInfo(f);
  obj.m_kRoomUserInfo = ks.getUserClass(getKRoomUserInfo, f);
  obj.m_vecStudentUnitUID = ks.getVector<UidType>((ks) => ks.getInt64());
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_kOldPartyInfo = ks.getUserClass(getKOldPartyInfo, f); }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_bAutoPartyBonus = ks.getBool(); }
  if (Boolean(f.SERV_ADD_DUNGEON_LOG_COLUMN_NUM_2)) { obj.m_wstrChannelIP = ks.getWString(); }
  obj.m_iCurEXP = ks.getInt32();
  obj.m_iCurED = ks.getInt32();
  if (Boolean(f.SERV_AUTO_PARTY_MATCHING_REQUIRED_TIME_LOG)) { obj.m_iAutoPartyWaitTime = ks.getInt32(); }
  return obj;
}

export interface KTradeUserInfo {
  m_iGSUID: UidType;
  m_iUserUID: UidType;
  m_iUnitUID: UidType;
  m_wstrNickName: string;
  m_iED: Int32;
}
export function createKTradeUserInfo(flags?: FlagInput): KTradeUserInfo {
  const f = resolveFlags(flags);
  return {
    m_iGSUID: 0n,
    m_iUserUID: 0n,
    m_iUnitUID: 0n,
    m_wstrNickName: '',
    m_iED: 0,
  };
}
export function putKTradeUserInfo(ks: KSerializer, obj: KTradeUserInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iGSUID))) return false;
  if (!(ks.putInt64(obj.m_iUserUID))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (!(ks.putInt32(obj.m_iED))) return false;
  return true;
}
export function getKTradeUserInfo(ks: KSerializer, flags?: FlagInput): KTradeUserInfo {
  const f = resolveFlags(flags);
  const obj = createKTradeUserInfo(f);
  obj.m_iGSUID = ks.getInt64();
  obj.m_iUserUID = ks.getInt64();
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  obj.m_iED = ks.getInt32();
  return obj;
}

export interface KPersonalShopUserInfo {
  m_iGSUID: UidType;
  m_iUserUID: UidType;
  m_iUnitUID: UidType;
  m_wstrNickName: string;
  m_bIsSquare: boolean;
}
export function createKPersonalShopUserInfo(flags?: FlagInput): KPersonalShopUserInfo {
  const f = resolveFlags(flags);
  return {
    m_iGSUID: 0n,
    m_iUserUID: 0n,
    m_iUnitUID: 0n,
    m_wstrNickName: '',
    m_bIsSquare: false,
  };
}
export function putKPersonalShopUserInfo(ks: KSerializer, obj: KPersonalShopUserInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iGSUID))) return false;
  if (!(ks.putInt64(obj.m_iUserUID))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (!(ks.putBool(obj.m_bIsSquare))) return false;
  return true;
}
export function getKPersonalShopUserInfo(ks: KSerializer, flags?: FlagInput): KPersonalShopUserInfo {
  const f = resolveFlags(flags);
  const obj = createKPersonalShopUserInfo(f);
  obj.m_iGSUID = ks.getInt64();
  obj.m_iUserUID = ks.getInt64();
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  obj.m_bIsSquare = ks.getBool();
  return obj;
}

export interface KERM_SQUARE_LIST_INFO_NOT {
  m_iCode: Int32;
  m_kSquareInfo: KSquareInfo;
}
export function createKERM_SQUARE_LIST_INFO_NOT(flags?: FlagInput): KERM_SQUARE_LIST_INFO_NOT {
  const f = resolveFlags(flags);
  return {
    m_iCode: 0,
    m_kSquareInfo: createKSquareInfo(f),
  };
}
export function putKERM_SQUARE_LIST_INFO_NOT(ks: KSerializer, obj: KERM_SQUARE_LIST_INFO_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iCode))) return false;
  if (!(ks.putUserClass(obj.m_kSquareInfo, putKSquareInfo, f))) return false;
  return true;
}
export function getKERM_SQUARE_LIST_INFO_NOT(ks: KSerializer, flags?: FlagInput): KERM_SQUARE_LIST_INFO_NOT {
  const f = resolveFlags(flags);
  const obj = createKERM_SQUARE_LIST_INFO_NOT(f);
  obj.m_iCode = ks.getInt32();
  obj.m_kSquareInfo = ks.getUserClass(getKSquareInfo, f);
  return obj;
}

export interface KNMUnitInfo {
  m_iUnitUID: UidType;
  m_iState: Int32;
  m_iDungeonID: Int32;
  m_iRoomUID: UidType;
}
export function createKNMUnitInfo(flags?: FlagInput): KNMUnitInfo {
  const f = resolveFlags(flags);
  return {
    m_iUnitUID: 0n,
    m_iState: 0,
    m_iDungeonID: 0,
    m_iRoomUID: 0n,
  };
}
export function putKNMUnitInfo(ks: KSerializer, obj: KNMUnitInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putInt32(obj.m_iState))) return false;
  if (!(ks.putInt32(obj.m_iDungeonID))) return false;
  if (!(ks.putInt64(obj.m_iRoomUID))) return false;
  return true;
}
export function getKNMUnitInfo(ks: KSerializer, flags?: FlagInput): KNMUnitInfo {
  const f = resolveFlags(flags);
  const obj = createKNMUnitInfo(f);
  obj.m_iUnitUID = ks.getInt64();
  obj.m_iState = ks.getInt32();
  obj.m_iDungeonID = ks.getInt32();
  obj.m_iRoomUID = ks.getInt64();
  return obj;
}

export interface KELG_KNM_TOGETHER_BY_UNIT_INFO_REQ {
  m_iDemandGSUID: UidType;
  m_iDemandUserUID: UidType;
}
export function createKELG_KNM_TOGETHER_BY_UNIT_INFO_REQ(flags?: FlagInput): KELG_KNM_TOGETHER_BY_UNIT_INFO_REQ {
  const f = resolveFlags(flags);
  return {
    m_iDemandGSUID: 0n,
    m_iDemandUserUID: 0n,
  };
}
export function putKELG_KNM_TOGETHER_BY_UNIT_INFO_REQ(ks: KSerializer, obj: KELG_KNM_TOGETHER_BY_UNIT_INFO_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iDemandGSUID))) return false;
  if (!(ks.putInt64(obj.m_iDemandUserUID))) return false;
  return true;
}
export function getKELG_KNM_TOGETHER_BY_UNIT_INFO_REQ(ks: KSerializer, flags?: FlagInput): KELG_KNM_TOGETHER_BY_UNIT_INFO_REQ {
  const f = resolveFlags(flags);
  const obj = createKELG_KNM_TOGETHER_BY_UNIT_INFO_REQ(f);
  obj.m_iDemandGSUID = ks.getInt64();
  obj.m_iDemandUserUID = ks.getInt64();
  return obj;
}

export interface KELG_KNM_TOGETHER_BY_UNIT_INFO_ACK {
  m_iOK: Int32;
  m_iDemandGSUID: UidType;
  m_iDemandUserUID: UidType;
  m_kUnitInfo: KNMUnitInfo;
}
export function createKELG_KNM_TOGETHER_BY_UNIT_INFO_ACK(flags?: FlagInput): KELG_KNM_TOGETHER_BY_UNIT_INFO_ACK {
  const f = resolveFlags(flags);
  return {
    m_iOK: 0,
    m_iDemandGSUID: 0n,
    m_iDemandUserUID: 0n,
    m_kUnitInfo: createKNMUnitInfo(f),
  };
}
export function putKELG_KNM_TOGETHER_BY_UNIT_INFO_ACK(ks: KSerializer, obj: KELG_KNM_TOGETHER_BY_UNIT_INFO_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putInt64(obj.m_iDemandGSUID))) return false;
  if (!(ks.putInt64(obj.m_iDemandUserUID))) return false;
  if (!(ks.putUserClass(obj.m_kUnitInfo, putKNMUnitInfo, f))) return false;
  return true;
}
export function getKELG_KNM_TOGETHER_BY_UNIT_INFO_ACK(ks: KSerializer, flags?: FlagInput): KELG_KNM_TOGETHER_BY_UNIT_INFO_ACK {
  const f = resolveFlags(flags);
  const obj = createKELG_KNM_TOGETHER_BY_UNIT_INFO_ACK(f);
  obj.m_iOK = ks.getInt32();
  obj.m_iDemandGSUID = ks.getInt64();
  obj.m_iDemandUserUID = ks.getInt64();
  obj.m_kUnitInfo = ks.getUserClass(getKNMUnitInfo, f);
  return obj;
}

export interface KEXPData {
  m_iEXP: Int32;
  m_iPartyEXP: Int32;
  m_iSocketOptEXP: Int32;
  m_iEventBonusEXP?: Int32;
}
export function createKEXPData(flags?: FlagInput): KEXPData {
  const f = resolveFlags(flags);
  const obj: KEXPData = {
    m_iEXP: 0,
    m_iPartyEXP: 0,
    m_iSocketOptEXP: 0,
  };
  if (Boolean(f.SERV_EVENT_EXP_BONUS_IN_BATTLE_FIELD)) obj.m_iEventBonusEXP = 0;
  return obj;
}
export function putKEXPData(ks: KSerializer, obj: KEXPData, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iEXP))) return false;
  if (!(ks.putInt32(obj.m_iPartyEXP))) return false;
  if (!(ks.putInt32(obj.m_iSocketOptEXP))) return false;
  if (Boolean(f.SERV_EVENT_EXP_BONUS_IN_BATTLE_FIELD)) { if (!(ks.putInt32((obj.m_iEventBonusEXP ?? 0)))) return false; }
  return true;
}
export function getKEXPData(ks: KSerializer, flags?: FlagInput): KEXPData {
  const f = resolveFlags(flags);
  const obj = createKEXPData(f);
  obj.m_iEXP = ks.getInt32();
  obj.m_iPartyEXP = ks.getInt32();
  obj.m_iSocketOptEXP = ks.getInt32();
  if (Boolean(f.SERV_EVENT_EXP_BONUS_IN_BATTLE_FIELD)) { obj.m_iEventBonusEXP = ks.getInt32(); }
  return obj;
}

export interface KNXBTCategoryInfo {
  m_ulCategoryNo: UInt32;
  m_wstrCategoryName: string;
  m_ulParentCategoryNo: UInt32;
  m_ulDisplayNo: UInt32;
}
export function createKNXBTCategoryInfo(flags?: FlagInput): KNXBTCategoryInfo {
  const f = resolveFlags(flags);
  return {
    m_ulCategoryNo: 0,
    m_wstrCategoryName: '',
    m_ulParentCategoryNo: 0,
    m_ulDisplayNo: 0,
  };
}
export function putKNXBTCategoryInfo(ks: KSerializer, obj: KNXBTCategoryInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUInt32(obj.m_ulCategoryNo))) return false;
  if (!(ks.putWString(obj.m_wstrCategoryName))) return false;
  if (!(ks.putUInt32(obj.m_ulParentCategoryNo))) return false;
  if (!(ks.putUInt32(obj.m_ulDisplayNo))) return false;
  return true;
}
export function getKNXBTCategoryInfo(ks: KSerializer, flags?: FlagInput): KNXBTCategoryInfo {
  const f = resolveFlags(flags);
  const obj = createKNXBTCategoryInfo(f);
  obj.m_ulCategoryNo = ks.getUInt32();
  obj.m_wstrCategoryName = ks.getWString();
  obj.m_ulParentCategoryNo = ks.getUInt32();
  obj.m_ulDisplayNo = ks.getUInt32();
  return obj;
}

export interface KNXBTBonusProductInfo {
  m_ulProductNo: UInt32;
  m_wstrExtend: string;
}
export function createKNXBTBonusProductInfo(flags?: FlagInput): KNXBTBonusProductInfo {
  const f = resolveFlags(flags);
  return {
    m_ulProductNo: 0,
    m_wstrExtend: '',
  };
}
export function putKNXBTBonusProductInfo(ks: KSerializer, obj: KNXBTBonusProductInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUInt32(obj.m_ulProductNo))) return false;
  if (!(ks.putWString(obj.m_wstrExtend))) return false;
  return true;
}
export function getKNXBTBonusProductInfo(ks: KSerializer, flags?: FlagInput): KNXBTBonusProductInfo {
  const f = resolveFlags(flags);
  const obj = createKNXBTBonusProductInfo(f);
  obj.m_ulProductNo = ks.getUInt32();
  obj.m_wstrExtend = ks.getWString();
  return obj;
}

export interface KNXBTBonusProductInfoPickUp {
  m_ulBonusProduct: UInt32;
  m_ulBonusAmount: UInt32;
}
export function createKNXBTBonusProductInfoPickUp(flags?: FlagInput): KNXBTBonusProductInfoPickUp {
  const f = resolveFlags(flags);
  return {
    m_ulBonusProduct: 0,
    m_ulBonusAmount: 0,
  };
}
export function putKNXBTBonusProductInfoPickUp(ks: KSerializer, obj: KNXBTBonusProductInfoPickUp, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUInt32(obj.m_ulBonusProduct))) return false;
  if (!(ks.putUInt32(obj.m_ulBonusAmount))) return false;
  return true;
}
export function getKNXBTBonusProductInfoPickUp(ks: KSerializer, flags?: FlagInput): KNXBTBonusProductInfoPickUp {
  const f = resolveFlags(flags);
  const obj = createKNXBTBonusProductInfoPickUp(f);
  obj.m_ulBonusProduct = ks.getUInt32();
  obj.m_ulBonusAmount = ks.getUInt32();
  return obj;
}

export interface KNXBTProductInfo {
  m_ulProductNo: UInt32;
  m_ulRelationProductNo: UInt32;
  m_sProductExpire: Int16;
  m_usProductPieces: UInt16;
  m_wstrProductID: string;
  m_wstrProductGUID: string;
  m_ulPaymentType: UInt32;
  m_wstrProductType: string;
  m_ulSalePrice: UInt32;
  m_ulCategoryNo: UInt32;
  m_vecBonusProductInfo: KNXBTBonusProductInfo[];
}
export function createKNXBTProductInfo(flags?: FlagInput): KNXBTProductInfo {
  const f = resolveFlags(flags);
  return {
    m_ulProductNo: 0,
    m_ulRelationProductNo: 0,
    m_sProductExpire: 0,
    m_usProductPieces: 0,
    m_wstrProductID: '',
    m_wstrProductGUID: '',
    m_ulPaymentType: 0,
    m_wstrProductType: '',
    m_ulSalePrice: 0,
    m_ulCategoryNo: 0,
    m_vecBonusProductInfo: ([] as KNXBTBonusProductInfo[]),
  };
}
export function putKNXBTProductInfo(ks: KSerializer, obj: KNXBTProductInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUInt32(obj.m_ulProductNo))) return false;
  if (!(ks.putUInt32(obj.m_ulRelationProductNo))) return false;
  if (!(ks.putInt16(obj.m_sProductExpire))) return false;
  if (!(ks.putUInt16(obj.m_usProductPieces))) return false;
  if (!(ks.putWString(obj.m_wstrProductID))) return false;
  if (!(ks.putWString(obj.m_wstrProductGUID))) return false;
  if (!(ks.putUInt32(obj.m_ulPaymentType))) return false;
  if (!(ks.putWString(obj.m_wstrProductType))) return false;
  if (!(ks.putUInt32(obj.m_ulSalePrice))) return false;
  if (!(ks.putUInt32(obj.m_ulCategoryNo))) return false;
  if (!(ks.putVector(obj.m_vecBonusProductInfo, (ks, item: KNXBTBonusProductInfo) => ks.putUserClass(item, putKNXBTBonusProductInfo, f)))) return false;
  return true;
}
export function getKNXBTProductInfo(ks: KSerializer, flags?: FlagInput): KNXBTProductInfo {
  const f = resolveFlags(flags);
  const obj = createKNXBTProductInfo(f);
  obj.m_ulProductNo = ks.getUInt32();
  obj.m_ulRelationProductNo = ks.getUInt32();
  obj.m_sProductExpire = ks.getInt16();
  obj.m_usProductPieces = ks.getUInt16();
  obj.m_wstrProductID = ks.getWString();
  obj.m_wstrProductGUID = ks.getWString();
  obj.m_ulPaymentType = ks.getUInt32();
  obj.m_wstrProductType = ks.getWString();
  obj.m_ulSalePrice = ks.getUInt32();
  obj.m_ulCategoryNo = ks.getUInt32();
  obj.m_vecBonusProductInfo = ks.getVector<KNXBTBonusProductInfo>((ks) => ks.getUserClass(getKNXBTBonusProductInfo, f));
  return obj;
}

export interface KNXBTPurchaseReqInfo {
  m_ulProductNo: UInt32;
  m_usOrderQuantity: UInt16;
  m_iCouponCardNo?: Int32;
}
export function createKNXBTPurchaseReqInfo(flags?: FlagInput): KNXBTPurchaseReqInfo {
  const f = resolveFlags(flags);
  const obj: KNXBTPurchaseReqInfo = {
    m_ulProductNo: 0,
    m_usOrderQuantity: 0,
  };
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_iCouponCardNo = 0;
  return obj;
}
export function putKNXBTPurchaseReqInfo(ks: KSerializer, obj: KNXBTPurchaseReqInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUInt32(obj.m_ulProductNo))) return false;
  if (!(ks.putUInt16(obj.m_usOrderQuantity))) return false;
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putInt32((obj.m_iCouponCardNo ?? 0)))) return false; }
  return true;
}
export function getKNXBTPurchaseReqInfo(ks: KSerializer, flags?: FlagInput): KNXBTPurchaseReqInfo {
  const f = resolveFlags(flags);
  const obj = createKNXBTPurchaseReqInfo(f);
  obj.m_ulProductNo = ks.getUInt32();
  obj.m_usOrderQuantity = ks.getUInt16();
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_iCouponCardNo = ks.getInt32(); }
  return obj;
}

export interface KNXBTPurchaseAckInfo {
  m_ulProductNo: UInt32;
  m_usOrderQuantity: UInt16;
  m_ulCouponUseApproval?: UInt32;
  m_wstrExtendValue: string;
}
export function createKNXBTPurchaseAckInfo(flags?: FlagInput): KNXBTPurchaseAckInfo {
  const f = resolveFlags(flags);
  const obj: KNXBTPurchaseAckInfo = {
    m_ulProductNo: 0,
    m_usOrderQuantity: 0,
    m_wstrExtendValue: '',
  };
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_ulCouponUseApproval = 0;
  return obj;
}
export function putKNXBTPurchaseAckInfo(ks: KSerializer, obj: KNXBTPurchaseAckInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUInt32(obj.m_ulProductNo))) return false;
  if (!(ks.putUInt16(obj.m_usOrderQuantity))) return false;
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putUInt32((obj.m_ulCouponUseApproval ?? 0)))) return false; }
  if (!(ks.putWString(obj.m_wstrExtendValue))) return false;
  return true;
}
export function getKNXBTPurchaseAckInfo(ks: KSerializer, flags?: FlagInput): KNXBTPurchaseAckInfo {
  const f = resolveFlags(flags);
  const obj = createKNXBTPurchaseAckInfo(f);
  obj.m_ulProductNo = ks.getUInt32();
  obj.m_usOrderQuantity = ks.getUInt16();
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_ulCouponUseApproval = ks.getUInt32(); }
  obj.m_wstrExtendValue = ks.getWString();
  return obj;
}

export interface KNXBTOrderInfo {
  m_ulOrderNo: UInt32;
  m_ulProductNo: UInt32;
  m_byteProductKind: UInt8;
  m_wstrProductName: string;
  m_wstrProductID: string;
  m_sProductExpire: Int16;
  m_usProductPieces: UInt16;
  m_usOrderQuantity: UInt16;
  m_usRemainOrderQuantity: UInt16;
  m_byteIsPresent: UInt8;
  m_byteIsRead: UInt8;
  m_byteSenderServerNo: UInt8;
  m_wstrSenderGameID: string;
  m_wstrSenderPresentMessage: string;
  m_wstrProductAttribute0: string;
  m_wstrProductAttribute1: string;
  m_wstrProductAttribute2: string;
  m_wstrProductAttribute3: string;
  m_wstrProductAttribute4: string;
  m_wstrExtendValue: string;
}
export function createKNXBTOrderInfo(flags?: FlagInput): KNXBTOrderInfo {
  const f = resolveFlags(flags);
  return {
    m_ulOrderNo: 0,
    m_ulProductNo: 0,
    m_byteProductKind: 0,
    m_wstrProductName: '',
    m_wstrProductID: '',
    m_sProductExpire: 0,
    m_usProductPieces: 0,
    m_usOrderQuantity: 0,
    m_usRemainOrderQuantity: 0,
    m_byteIsPresent: 0,
    m_byteIsRead: 0,
    m_byteSenderServerNo: 0,
    m_wstrSenderGameID: '',
    m_wstrSenderPresentMessage: '',
    m_wstrProductAttribute0: '',
    m_wstrProductAttribute1: '',
    m_wstrProductAttribute2: '',
    m_wstrProductAttribute3: '',
    m_wstrProductAttribute4: '',
    m_wstrExtendValue: '',
  };
}
export function putKNXBTOrderInfo(ks: KSerializer, obj: KNXBTOrderInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUInt32(obj.m_ulOrderNo))) return false;
  if (!(ks.putUInt32(obj.m_ulProductNo))) return false;
  if (!(ks.putUInt8(obj.m_byteProductKind))) return false;
  if (!(ks.putWString(obj.m_wstrProductName))) return false;
  if (!(ks.putWString(obj.m_wstrProductID))) return false;
  if (!(ks.putInt16(obj.m_sProductExpire))) return false;
  if (!(ks.putUInt16(obj.m_usProductPieces))) return false;
  if (!(ks.putUInt16(obj.m_usOrderQuantity))) return false;
  if (!(ks.putUInt16(obj.m_usRemainOrderQuantity))) return false;
  if (!(ks.putUInt8(obj.m_byteIsPresent))) return false;
  if (!(ks.putUInt8(obj.m_byteIsRead))) return false;
  if (!(ks.putUInt8(obj.m_byteSenderServerNo))) return false;
  if (!(ks.putWString(obj.m_wstrSenderGameID))) return false;
  if (!(ks.putWString(obj.m_wstrSenderPresentMessage))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute0))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute1))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute2))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute3))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute4))) return false;
  if (!(ks.putWString(obj.m_wstrExtendValue))) return false;
  return true;
}
export function getKNXBTOrderInfo(ks: KSerializer, flags?: FlagInput): KNXBTOrderInfo {
  const f = resolveFlags(flags);
  const obj = createKNXBTOrderInfo(f);
  obj.m_ulOrderNo = ks.getUInt32();
  obj.m_ulProductNo = ks.getUInt32();
  obj.m_byteProductKind = ks.getUInt8();
  obj.m_wstrProductName = ks.getWString();
  obj.m_wstrProductID = ks.getWString();
  obj.m_sProductExpire = ks.getInt16();
  obj.m_usProductPieces = ks.getUInt16();
  obj.m_usOrderQuantity = ks.getUInt16();
  obj.m_usRemainOrderQuantity = ks.getUInt16();
  obj.m_byteIsPresent = ks.getUInt8();
  obj.m_byteIsRead = ks.getUInt8();
  obj.m_byteSenderServerNo = ks.getUInt8();
  obj.m_wstrSenderGameID = ks.getWString();
  obj.m_wstrSenderPresentMessage = ks.getWString();
  obj.m_wstrProductAttribute0 = ks.getWString();
  obj.m_wstrProductAttribute1 = ks.getWString();
  obj.m_wstrProductAttribute2 = ks.getWString();
  obj.m_wstrProductAttribute3 = ks.getWString();
  obj.m_wstrProductAttribute4 = ks.getWString();
  obj.m_wstrExtendValue = ks.getWString();
  return obj;
}

export interface KNXBTPackageInfo {
  m_ulOrderNo: UInt32;
  m_ulPackageProductNo: UInt32;
  m_ulProductNo: UInt32;
  m_wstrProductName: string;
  m_wstrProductID: string;
  m_sProductExpire: Int16;
  m_usProductPieces: UInt16;
  m_wstrProductAttribute0: string;
  m_wstrProductAttribute1: string;
  m_wstrProductAttribute2: string;
  m_wstrProductAttribute3: string;
  m_wstrProductAttribute4: string;
}
export function createKNXBTPackageInfo(flags?: FlagInput): KNXBTPackageInfo {
  const f = resolveFlags(flags);
  return {
    m_ulOrderNo: 0,
    m_ulPackageProductNo: 0,
    m_ulProductNo: 0,
    m_wstrProductName: '',
    m_wstrProductID: '',
    m_sProductExpire: 0,
    m_usProductPieces: 0,
    m_wstrProductAttribute0: '',
    m_wstrProductAttribute1: '',
    m_wstrProductAttribute2: '',
    m_wstrProductAttribute3: '',
    m_wstrProductAttribute4: '',
  };
}
export function putKNXBTPackageInfo(ks: KSerializer, obj: KNXBTPackageInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUInt32(obj.m_ulOrderNo))) return false;
  if (!(ks.putUInt32(obj.m_ulPackageProductNo))) return false;
  if (!(ks.putUInt32(obj.m_ulProductNo))) return false;
  if (!(ks.putWString(obj.m_wstrProductName))) return false;
  if (!(ks.putWString(obj.m_wstrProductID))) return false;
  if (!(ks.putInt16(obj.m_sProductExpire))) return false;
  if (!(ks.putUInt16(obj.m_usProductPieces))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute0))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute1))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute2))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute3))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute4))) return false;
  return true;
}
export function getKNXBTPackageInfo(ks: KSerializer, flags?: FlagInput): KNXBTPackageInfo {
  const f = resolveFlags(flags);
  const obj = createKNXBTPackageInfo(f);
  obj.m_ulOrderNo = ks.getUInt32();
  obj.m_ulPackageProductNo = ks.getUInt32();
  obj.m_ulProductNo = ks.getUInt32();
  obj.m_wstrProductName = ks.getWString();
  obj.m_wstrProductID = ks.getWString();
  obj.m_sProductExpire = ks.getInt16();
  obj.m_usProductPieces = ks.getUInt16();
  obj.m_wstrProductAttribute0 = ks.getWString();
  obj.m_wstrProductAttribute1 = ks.getWString();
  obj.m_wstrProductAttribute2 = ks.getWString();
  obj.m_wstrProductAttribute3 = ks.getWString();
  obj.m_wstrProductAttribute4 = ks.getWString();
  return obj;
}

export interface KNXBTPickUpPackageInfo {
  m_ulProductNo: UInt32;
  m_wstrProductID: string;
  m_sProductExpire: Int16;
  m_usProductPieces: UInt16;
  m_iSubProductNo?: Int32;
}
export function createKNXBTPickUpPackageInfo(flags?: FlagInput): KNXBTPickUpPackageInfo {
  const f = resolveFlags(flags);
  const obj: KNXBTPickUpPackageInfo = {
    m_ulProductNo: 0,
    m_wstrProductID: '',
    m_sProductExpire: 0,
    m_usProductPieces: 0,
  };
  if (Boolean(f.SERV_GLOBAL_CASH_PACKAGE)) obj.m_iSubProductNo = 0;
  return obj;
}
export function putKNXBTPickUpPackageInfo(ks: KSerializer, obj: KNXBTPickUpPackageInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUInt32(obj.m_ulProductNo))) return false;
  if (!(ks.putWString(obj.m_wstrProductID))) return false;
  if (!(ks.putInt16(obj.m_sProductExpire))) return false;
  if (!(ks.putUInt16(obj.m_usProductPieces))) return false;
  if (Boolean(f.SERV_GLOBAL_CASH_PACKAGE)) { if (!(ks.putInt32((obj.m_iSubProductNo ?? 0)))) return false; }
  return true;
}
export function getKNXBTPickUpPackageInfo(ks: KSerializer, flags?: FlagInput): KNXBTPickUpPackageInfo {
  const f = resolveFlags(flags);
  const obj = createKNXBTPickUpPackageInfo(f);
  obj.m_ulProductNo = ks.getUInt32();
  obj.m_wstrProductID = ks.getWString();
  obj.m_sProductExpire = ks.getInt16();
  obj.m_usProductPieces = ks.getUInt16();
  if (Boolean(f.SERV_GLOBAL_CASH_PACKAGE)) { obj.m_iSubProductNo = ks.getInt32(); }
  return obj;
}

export interface KNXBTLotteryInfo {
  m_ulOrderNo: UInt32;
  m_ulLotteryProductNo: UInt32;
  m_ulProductNo: UInt32;
  m_wstrProductName: string;
  m_wstrProductID: string;
  m_sProductExpire: Int16;
  m_usProductPieces: UInt16;
  m_wstrProductAttribute0: string;
  m_wstrProductAttribute1: string;
  m_wstrProductAttribute2: string;
  m_wstrProductAttribute3: string;
  m_wstrProductAttribute4: string;
}
export function createKNXBTLotteryInfo(flags?: FlagInput): KNXBTLotteryInfo {
  const f = resolveFlags(flags);
  return {
    m_ulOrderNo: 0,
    m_ulLotteryProductNo: 0,
    m_ulProductNo: 0,
    m_wstrProductName: '',
    m_wstrProductID: '',
    m_sProductExpire: 0,
    m_usProductPieces: 0,
    m_wstrProductAttribute0: '',
    m_wstrProductAttribute1: '',
    m_wstrProductAttribute2: '',
    m_wstrProductAttribute3: '',
    m_wstrProductAttribute4: '',
  };
}
export function putKNXBTLotteryInfo(ks: KSerializer, obj: KNXBTLotteryInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUInt32(obj.m_ulOrderNo))) return false;
  if (!(ks.putUInt32(obj.m_ulLotteryProductNo))) return false;
  if (!(ks.putUInt32(obj.m_ulProductNo))) return false;
  if (!(ks.putWString(obj.m_wstrProductName))) return false;
  if (!(ks.putWString(obj.m_wstrProductID))) return false;
  if (!(ks.putInt16(obj.m_sProductExpire))) return false;
  if (!(ks.putUInt16(obj.m_usProductPieces))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute0))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute1))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute2))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute3))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute4))) return false;
  return true;
}
export function getKNXBTLotteryInfo(ks: KSerializer, flags?: FlagInput): KNXBTLotteryInfo {
  const f = resolveFlags(flags);
  const obj = createKNXBTLotteryInfo(f);
  obj.m_ulOrderNo = ks.getUInt32();
  obj.m_ulLotteryProductNo = ks.getUInt32();
  obj.m_ulProductNo = ks.getUInt32();
  obj.m_wstrProductName = ks.getWString();
  obj.m_wstrProductID = ks.getWString();
  obj.m_sProductExpire = ks.getInt16();
  obj.m_usProductPieces = ks.getUInt16();
  obj.m_wstrProductAttribute0 = ks.getWString();
  obj.m_wstrProductAttribute1 = ks.getWString();
  obj.m_wstrProductAttribute2 = ks.getWString();
  obj.m_wstrProductAttribute3 = ks.getWString();
  obj.m_wstrProductAttribute4 = ks.getWString();
  return obj;
}

export interface KNXBTCouponProductInfo {
  m_ulProductNo: UInt32;
  m_wstrExtendValue: string;
}
export function createKNXBTCouponProductInfo(flags?: FlagInput): KNXBTCouponProductInfo {
  const f = resolveFlags(flags);
  return {
    m_ulProductNo: 0,
    m_wstrExtendValue: '',
  };
}
export function putKNXBTCouponProductInfo(ks: KSerializer, obj: KNXBTCouponProductInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUInt32(obj.m_ulProductNo))) return false;
  if (!(ks.putWString(obj.m_wstrExtendValue))) return false;
  return true;
}
export function getKNXBTCouponProductInfo(ks: KSerializer, flags?: FlagInput): KNXBTCouponProductInfo {
  const f = resolveFlags(flags);
  const obj = createKNXBTCouponProductInfo(f);
  obj.m_ulProductNo = ks.getUInt32();
  obj.m_wstrExtendValue = ks.getWString();
  return obj;
}

export interface KNXBTSubProductInfo {
  m_ulProductNo: UInt32;
  m_wstrProductName: string;
  m_wstrProductID: string;
  m_sProductExpire: Int16;
  m_usProductPieces: UInt16;
  m_wstrProductAttribute0: string;
  m_wstrProductAttribute1: string;
  m_wstrProductAttribute2: string;
  m_wstrProductAttribute3: string;
  m_wstrProductAttribute4: string;
}
export function createKNXBTSubProductInfo(flags?: FlagInput): KNXBTSubProductInfo {
  const f = resolveFlags(flags);
  return {
    m_ulProductNo: 0,
    m_wstrProductName: '',
    m_wstrProductID: '',
    m_sProductExpire: 0,
    m_usProductPieces: 0,
    m_wstrProductAttribute0: '',
    m_wstrProductAttribute1: '',
    m_wstrProductAttribute2: '',
    m_wstrProductAttribute3: '',
    m_wstrProductAttribute4: '',
  };
}
export function putKNXBTSubProductInfo(ks: KSerializer, obj: KNXBTSubProductInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUInt32(obj.m_ulProductNo))) return false;
  if (!(ks.putWString(obj.m_wstrProductName))) return false;
  if (!(ks.putWString(obj.m_wstrProductID))) return false;
  if (!(ks.putInt16(obj.m_sProductExpire))) return false;
  if (!(ks.putUInt16(obj.m_usProductPieces))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute0))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute1))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute2))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute3))) return false;
  if (!(ks.putWString(obj.m_wstrProductAttribute4))) return false;
  return true;
}
export function getKNXBTSubProductInfo(ks: KSerializer, flags?: FlagInput): KNXBTSubProductInfo {
  const f = resolveFlags(flags);
  const obj = createKNXBTSubProductInfo(f);
  obj.m_ulProductNo = ks.getUInt32();
  obj.m_wstrProductName = ks.getWString();
  obj.m_wstrProductID = ks.getWString();
  obj.m_sProductExpire = ks.getInt16();
  obj.m_usProductPieces = ks.getUInt16();
  obj.m_wstrProductAttribute0 = ks.getWString();
  obj.m_wstrProductAttribute1 = ks.getWString();
  obj.m_wstrProductAttribute2 = ks.getWString();
  obj.m_wstrProductAttribute3 = ks.getWString();
  obj.m_wstrProductAttribute4 = ks.getWString();
  return obj;
}

export const KSquarePersonalShopInfo_UPDATE_TYPE = {
  UT_ALL: 0,
  UT_STATE_NAME: 1,
  UT_DATA_CLEAR: 2,
} as const;
export type KSquarePersonalShopInfo_UPDATE_TYPE = (typeof KSquarePersonalShopInfo_UPDATE_TYPE)[keyof typeof KSquarePersonalShopInfo_UPDATE_TYPE];
export interface KSquarePersonalShopInfo {
  m_cUpdateType: Int8;
  m_cPersonalShopState: Int8;
  m_cPersonalShopType: Int8;
  m_iPersonalShopUID: UidType;
  m_wstrPersonalShopName: string;
}
export function createKSquarePersonalShopInfo(flags?: FlagInput): KSquarePersonalShopInfo {
  const f = resolveFlags(flags);
  return {
    m_cUpdateType: 0,
    m_cPersonalShopState: 0,
    m_cPersonalShopType: 0,
    m_iPersonalShopUID: 0n,
    m_wstrPersonalShopName: '',
  };
}
export function putKSquarePersonalShopInfo(ks: KSerializer, obj: KSquarePersonalShopInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt8(obj.m_cUpdateType))) return false;
  if (!(ks.putInt8(obj.m_cPersonalShopState))) return false;
  if (!(ks.putInt8(obj.m_cPersonalShopType))) return false;
  if (!(ks.putInt64(obj.m_iPersonalShopUID))) return false;
  if (!(ks.putWString(obj.m_wstrPersonalShopName))) return false;
  return true;
}
export function getKSquarePersonalShopInfo(ks: KSerializer, flags?: FlagInput): KSquarePersonalShopInfo {
  const f = resolveFlags(flags);
  const obj = createKSquarePersonalShopInfo(f);
  obj.m_cUpdateType = ks.getInt8();
  obj.m_cPersonalShopState = ks.getInt8();
  obj.m_cPersonalShopType = ks.getInt8();
  obj.m_iPersonalShopUID = ks.getInt64();
  obj.m_wstrPersonalShopName = ks.getWString();
  return obj;
}

export interface KRegPersonalShopItemInfo {
  m_iItemUID: UidType;
  m_iQuantity: Int32;
  m_iPricePerOne: Int32;
}
export function createKRegPersonalShopItemInfo(flags?: FlagInput): KRegPersonalShopItemInfo {
  const f = resolveFlags(flags);
  return {
    m_iItemUID: 0n,
    m_iQuantity: 0,
    m_iPricePerOne: 0,
  };
}
export function putKRegPersonalShopItemInfo(ks: KSerializer, obj: KRegPersonalShopItemInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iItemUID))) return false;
  if (!(ks.putInt32(obj.m_iQuantity))) return false;
  if (!(ks.putInt32(obj.m_iPricePerOne))) return false;
  return true;
}
export function getKRegPersonalShopItemInfo(ks: KSerializer, flags?: FlagInput): KRegPersonalShopItemInfo {
  const f = resolveFlags(flags);
  const obj = createKRegPersonalShopItemInfo(f);
  obj.m_iItemUID = ks.getInt64();
  obj.m_iQuantity = ks.getInt32();
  obj.m_iPricePerOne = ks.getInt32();
  return obj;
}

export interface KPersonalShopItemInfo {
  m_iItemUID: UidType;
  m_iQuantity: Int32;
}
export function createKPersonalShopItemInfo(flags?: FlagInput): KPersonalShopItemInfo {
  const f = resolveFlags(flags);
  return {
    m_iItemUID: 0n,
    m_iQuantity: 0,
  };
}
export function putKPersonalShopItemInfo(ks: KSerializer, obj: KPersonalShopItemInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iItemUID))) return false;
  if (!(ks.putInt32(obj.m_iQuantity))) return false;
  return true;
}
export function getKPersonalShopItemInfo(ks: KSerializer, flags?: FlagInput): KPersonalShopItemInfo {
  const f = resolveFlags(flags);
  const obj = createKPersonalShopItemInfo(f);
  obj.m_iItemUID = ks.getInt64();
  obj.m_iQuantity = ks.getInt32();
  return obj;
}

export const KSellPersonalShopItemInfo_SELL_PSHOP_ITEM_TYPE = {
  SPIT_PERSONAL_SHOP: 0,
  SPIT_PSHOP_AGENCY: 1,
} as const;
export type KSellPersonalShopItemInfo_SELL_PSHOP_ITEM_TYPE = (typeof KSellPersonalShopItemInfo_SELL_PSHOP_ITEM_TYPE)[keyof typeof KSellPersonalShopItemInfo_SELL_PSHOP_ITEM_TYPE];
export function getKSellPersonalShopItemInfo_SELL_PSHOP_ITEM_TYPE(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_PSHOP_AGENCY)) {
    cur = 0;
    out['SPIT_PERSONAL_SHOP'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_PSHOP_AGENCY)) {
    out['SPIT_PSHOP_AGENCY'] = cur;
    cur += 1;
  }
  return out;
}
export interface KSellPersonalShopItemInfo {
  m_kInventoryItemInfo: KInventoryItemInfo;
  m_iPricePerOne: Int32;
  m_iFeePerOne: Int32;
  m_cPShopItemType?: Int8;
  m_iTotalSellEDIn?: Int32;
  m_iTotalSoldItemQuantity?: Int32;
  m_iInventoryItemUID?: UidType;
}
export function createKSellPersonalShopItemInfo(flags?: FlagInput): KSellPersonalShopItemInfo {
  const f = resolveFlags(flags);
  const obj: KSellPersonalShopItemInfo = {
    m_kInventoryItemInfo: createKInventoryItemInfo(f),
    m_iPricePerOne: 0,
    m_iFeePerOne: 0,
  };
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_cPShopItemType = 0;
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_iTotalSellEDIn = 0;
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_iTotalSoldItemQuantity = 0;
  if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_AGENCY_SHOP)) obj.m_iInventoryItemUID = 0n;
  return obj;
}
export function putKSellPersonalShopItemInfo(ks: KSerializer, obj: KSellPersonalShopItemInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUserClass(obj.m_kInventoryItemInfo, putKInventoryItemInfo, f))) return false;
  if (!(ks.putInt32(obj.m_iPricePerOne))) return false;
  if (!(ks.putInt32(obj.m_iFeePerOne))) return false;
  if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putInt8((obj.m_cPShopItemType ?? 0)))) return false; }
  if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putInt32((obj.m_iTotalSellEDIn ?? 0)))) return false; }
  if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putInt32((obj.m_iTotalSoldItemQuantity ?? 0)))) return false; }
  if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_AGENCY_SHOP)) { if (!(ks.putInt64((obj.m_iInventoryItemUID ?? 0n)))) return false; }
  return true;
}
export function getKSellPersonalShopItemInfo(ks: KSerializer, flags?: FlagInput): KSellPersonalShopItemInfo {
  const f = resolveFlags(flags);
  const obj = createKSellPersonalShopItemInfo(f);
  obj.m_kInventoryItemInfo = ks.getUserClass(getKInventoryItemInfo, f);
  obj.m_iPricePerOne = ks.getInt32();
  obj.m_iFeePerOne = ks.getInt32();
  if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_cPShopItemType = ks.getInt8(); }
  if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_iTotalSellEDIn = ks.getInt32(); }
  if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_iTotalSoldItemQuantity = ks.getInt32(); }
  if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_AGENCY_SHOP)) { obj.m_iInventoryItemUID = ks.getInt64(); }
  return obj;
}

export interface KSellPShopItemDBUpdateInfo {
  m_iItemUID?: UidType;
  m_iQuantity?: Int32;
  m_iTotalSellEDIn?: Int32;
  m_iTotalSoldItemQuantity?: Int32;
  m_iTotalSellCommissionED?: Int32;
}
export function createKSellPShopItemDBUpdateInfo(flags?: FlagInput): KSellPShopItemDBUpdateInfo {
  const f = resolveFlags(flags);
  const obj: KSellPShopItemDBUpdateInfo = {
  };
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_iItemUID = 0n;
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_iQuantity = 0;
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_iTotalSellEDIn = 0;
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_iTotalSoldItemQuantity = 0;
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_iTotalSellCommissionED = 0;
  return obj;
}
export function putKSellPShopItemDBUpdateInfo(ks: KSerializer, obj: KSellPShopItemDBUpdateInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PSHOP_AGENCY)) {
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putInt64((obj.m_iItemUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putInt32((obj.m_iQuantity ?? 0)))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putInt32((obj.m_iTotalSellEDIn ?? 0)))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putInt32((obj.m_iTotalSoldItemQuantity ?? 0)))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putInt32((obj.m_iTotalSellCommissionED ?? 0)))) return false; }
  }
  return true;
}
export function getKSellPShopItemDBUpdateInfo(ks: KSerializer, flags?: FlagInput): KSellPShopItemDBUpdateInfo {
  const f = resolveFlags(flags);
  const obj = createKSellPShopItemDBUpdateInfo(f);
  if (Boolean(f.SERV_PSHOP_AGENCY)) {
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_iItemUID = ks.getInt64(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_iQuantity = ks.getInt32(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_iTotalSellEDIn = ks.getInt32(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_iTotalSoldItemQuantity = ks.getInt32(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_iTotalSellCommissionED = ks.getInt32(); }
  }
  return obj;
}

export interface KSellPShopItemBackupData {
  m_kSellPShopItemInfo?: KSellPersonalShopItemInfo;
  m_iTotalSoldItemQuantity?: Int32;
  m_iTotalSellCommissionED?: Int32;
}
export function createKSellPShopItemBackupData(flags?: FlagInput): KSellPShopItemBackupData {
  const f = resolveFlags(flags);
  const obj: KSellPShopItemBackupData = {
  };
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_kSellPShopItemInfo = createKSellPersonalShopItemInfo(f);
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_iTotalSoldItemQuantity = 0;
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_iTotalSellCommissionED = 0;
  return obj;
}
export function putKSellPShopItemBackupData(ks: KSerializer, obj: KSellPShopItemBackupData, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PSHOP_AGENCY)) {
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putUserClass((obj.m_kSellPShopItemInfo ?? createKSellPersonalShopItemInfo(f)), putKSellPersonalShopItemInfo, f))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putInt32((obj.m_iTotalSoldItemQuantity ?? 0)))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putInt32((obj.m_iTotalSellCommissionED ?? 0)))) return false; }
  }
  return true;
}
export function getKSellPShopItemBackupData(ks: KSerializer, flags?: FlagInput): KSellPShopItemBackupData {
  const f = resolveFlags(flags);
  const obj = createKSellPShopItemBackupData(f);
  if (Boolean(f.SERV_PSHOP_AGENCY)) {
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_kSellPShopItemInfo = ks.getUserClass(getKSellPersonalShopItemInfo, f); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_iTotalSoldItemQuantity = ks.getInt32(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_iTotalSellCommissionED = ks.getInt32(); }
  }
  return obj;
}

export interface KLogData {
  m_byteLogLevel: UInt8;
  m_wstrRegDate: string;
  m_wstrFunctionName: string;
  m_vecContent: string[];
  m_wstrFileName: string;
  m_iFileLine: Int32;
}
export function createKLogData(flags?: FlagInput): KLogData {
  const f = resolveFlags(flags);
  return {
    m_byteLogLevel: 0,
    m_wstrRegDate: '',
    m_wstrFunctionName: '',
    m_vecContent: ([] as string[]),
    m_wstrFileName: '',
    m_iFileLine: 0,
  };
}
export function putKLogData(ks: KSerializer, obj: KLogData, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUInt8(obj.m_byteLogLevel))) return false;
  if (!(ks.putWString(obj.m_wstrRegDate))) return false;
  if (!(ks.putWString(obj.m_wstrFunctionName))) return false;
  if (!(ks.putVector(obj.m_vecContent, (ks, item: string) => ks.putWString(item)))) return false;
  if (!(ks.putWString(obj.m_wstrFileName))) return false;
  if (!(ks.putInt32(obj.m_iFileLine))) return false;
  return true;
}
export function getKLogData(ks: KSerializer, flags?: FlagInput): KLogData {
  const f = resolveFlags(flags);
  const obj = createKLogData(f);
  obj.m_byteLogLevel = ks.getUInt8();
  obj.m_wstrRegDate = ks.getWString();
  obj.m_wstrFunctionName = ks.getWString();
  obj.m_vecContent = ks.getVector<string>((ks) => ks.getWString());
  obj.m_wstrFileName = ks.getWString();
  obj.m_iFileLine = ks.getInt32();
  return obj;
}

export const KPostItemInfo_LETTER_TYPE = {
  LT_NONE: 0,
  LT_POST_OFFICE: 1,
  LT_RECOMMEND: 2,
  LT_TUTOL: 3,
  LT_EVENT: 4,
  LT_MESSAGE: 5,
  LT_RANKING_TITLE: 6,
  LT_BROKEN_ITEM: 7,
  LT_GUILD_DISBAND: 8,
  LT_GUILD_KICK: 9,
  LT_GUILD_JOIN: 10,
  LT_WEB_POINT_EVENT: 11,
  LT_STOP_SALE_PSHOP: 12,
  LT_SELL_ITEM_PSHOP: 13,
  LT_COME_BACK_USER_NOTIFY: 14,
  LT_OUT_USER_RETANING_REWARD: 15,
  LT_DUNGEON_REWARD_ITEM: 16,
  LT_QUEST_REWARD: 17,
  LT_INDEMNIFICATION_DB_ONLY: 18,
  LT_JACKPOT_EVENT_REWARD: 19,
  LT_DB_REWARD: 20,
  LT_SYSTEM_ERROR_REWARD: 21,
  LT_WEDDING_REWARD: 22,
  LT_WEDDING_INVITATION: 23,
  LT_WEDDING_RESERVE: 24,
  LT_BREAK_UP: 25,
} as const;
export type KPostItemInfo_LETTER_TYPE = (typeof KPostItemInfo_LETTER_TYPE)[keyof typeof KPostItemInfo_LETTER_TYPE];
export interface KPostItemInfo {
  m_iPostNo: UidType;
  m_iFromUnitUID: UidType;
  m_iToUnitUID: UidType;
  m_cScriptType: Int8;
  m_iScriptIndex: Int32;
  m_iQuantity: Int32;
  m_cEnchantLevel: Int8;
  m_kAttribEnchantInfo: KItemAttributeEnchantInfo;
  m_vecItemSocket: Int32[] | Int16[];
  m_vecRandomSocket?: Int32[];
  m_cItemState?: Int8;
  m_ucSealData: UInt8;
  m_wstrRegDate: string;
  m_wstrFromNickName: string;
  m_wstrTitle: string;
  m_wstrMessage: string;
  m_bRead: boolean;
  m_iItemUID?: UidType;
  m_iUsageType?: UInt8;
  m_bSenderDeleted?: boolean;
  m_byteExpandedSocketNum?: UInt8;
}
export function createKPostItemInfo(flags?: FlagInput): KPostItemInfo {
  const f = resolveFlags(flags);
  const obj: KPostItemInfo = {
    m_iPostNo: 0n,
    m_iFromUnitUID: 0n,
    m_iToUnitUID: 0n,
    m_cScriptType: 0,
    m_iScriptIndex: 0,
    m_iQuantity: 0,
    m_cEnchantLevel: 0,
    m_kAttribEnchantInfo: createKItemAttributeEnchantInfo(f),
    m_vecItemSocket: (Boolean(f.SERV_ITEM_OPTION_DATA_SIZE)) ? ([] as Int32[]) : ([] as Int16[]),
    m_ucSealData: 0,
    m_wstrRegDate: '',
    m_wstrFromNickName: '',
    m_wstrTitle: '',
    m_wstrMessage: '',
    m_bRead: false,
  };
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) obj.m_vecRandomSocket = ([] as Int32[]);
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) obj.m_cItemState = 0;
  if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) obj.m_iItemUID = 0n;
  if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) obj.m_iUsageType = 0;
  if (Boolean(f.SERV_NETERROR_STR_GET_FROM_CLIENT)) obj.m_bSenderDeleted = false;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_byteExpandedSocketNum = 0;
  return obj;
}
export function putKPostItemInfo(ks: KSerializer, obj: KPostItemInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iPostNo))) return false;
  if (!(ks.putInt64(obj.m_iFromUnitUID))) return false;
  if (!(ks.putInt64(obj.m_iToUnitUID))) return false;
  if (!(ks.putInt8(obj.m_cScriptType))) return false;
  if (!(ks.putInt32(obj.m_iScriptIndex))) return false;
  if (!(ks.putInt32(obj.m_iQuantity))) return false;
  if (!(ks.putInt8(obj.m_cEnchantLevel))) return false;
  if (!(ks.putUserClass(obj.m_kAttribEnchantInfo, putKItemAttributeEnchantInfo, f))) return false;
  if (Boolean(f.SERV_ITEM_OPTION_DATA_SIZE)) { if (!(ks.putVector((obj.m_vecItemSocket as Int32[]), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  else if (!f.SERV_ITEM_OPTION_DATA_SIZE) { if (!(ks.putVector((obj.m_vecItemSocket as Int16[]), (ks, item: Int16) => ks.putInt16(item)))) return false; }
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { if (!(ks.putVector((obj.m_vecRandomSocket ?? ([] as Int32[])), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { if (!(ks.putInt8((obj.m_cItemState ?? 0)))) return false; }
  if (!(ks.putUInt8(obj.m_ucSealData))) return false;
  if (!(ks.putWString(obj.m_wstrRegDate))) return false;
  if (!(ks.putWString(obj.m_wstrFromNickName))) return false;
  if (!(ks.putWString(obj.m_wstrTitle))) return false;
  if (!(ks.putWString(obj.m_wstrMessage))) return false;
  if (!(ks.putBool(obj.m_bRead))) return false;
  if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { if (!(ks.putInt64((obj.m_iItemUID ?? 0n)))) return false; }
  if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { if (!(ks.putUInt8((obj.m_iUsageType ?? 0)))) return false; }
  if (Boolean(f.SERV_NETERROR_STR_GET_FROM_CLIENT)) { if (!(ks.putBool((obj.m_bSenderDeleted ?? false)))) return false; }
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putUInt8((obj.m_byteExpandedSocketNum ?? 0)))) return false; }
  return true;
}
export function getKPostItemInfo(ks: KSerializer, flags?: FlagInput): KPostItemInfo {
  const f = resolveFlags(flags);
  const obj = createKPostItemInfo(f);
  obj.m_iPostNo = ks.getInt64();
  obj.m_iFromUnitUID = ks.getInt64();
  obj.m_iToUnitUID = ks.getInt64();
  obj.m_cScriptType = ks.getInt8();
  obj.m_iScriptIndex = ks.getInt32();
  obj.m_iQuantity = ks.getInt32();
  obj.m_cEnchantLevel = ks.getInt8();
  obj.m_kAttribEnchantInfo = ks.getUserClass(getKItemAttributeEnchantInfo, f);
  if (Boolean(f.SERV_ITEM_OPTION_DATA_SIZE)) { obj.m_vecItemSocket = ks.getVector<Int32>((ks) => ks.getInt32()); }
  else if (!f.SERV_ITEM_OPTION_DATA_SIZE) { obj.m_vecItemSocket = ks.getVector<Int16>((ks) => ks.getInt16()); }
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { obj.m_vecRandomSocket = ks.getVector<Int32>((ks) => ks.getInt32()); }
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { obj.m_cItemState = ks.getInt8(); }
  obj.m_ucSealData = ks.getUInt8();
  obj.m_wstrRegDate = ks.getWString();
  obj.m_wstrFromNickName = ks.getWString();
  obj.m_wstrTitle = ks.getWString();
  obj.m_wstrMessage = ks.getWString();
  obj.m_bRead = ks.getBool();
  if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { obj.m_iItemUID = ks.getInt64(); }
  if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { obj.m_iUsageType = ks.getUInt8(); }
  if (Boolean(f.SERV_NETERROR_STR_GET_FROM_CLIENT)) { obj.m_bSenderDeleted = ks.getBool(); }
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_byteExpandedSocketNum = ks.getUInt8(); }
  return obj;
}

export interface KPostItemTitleInfo {
  m_iPostNo: UidType;
  m_cScriptType: Int8;
  m_iScriptIndex: Int32;
  m_cEnchantLevel: Int8;
  m_wstrRegDate: string;
  m_wstrFromNickName: string;
  m_wstrTitle: string;
  m_bRead: boolean;
  m_bSenderDeleted?: boolean;
}
export function createKPostItemTitleInfo(flags?: FlagInput): KPostItemTitleInfo {
  const f = resolveFlags(flags);
  const obj: KPostItemTitleInfo = {
    m_iPostNo: 0n,
    m_cScriptType: 0,
    m_iScriptIndex: 0,
    m_cEnchantLevel: 0,
    m_wstrRegDate: '',
    m_wstrFromNickName: '',
    m_wstrTitle: '',
    m_bRead: false,
  };
  if (Boolean(f.SERV_NETERROR_STR_GET_FROM_CLIENT)) obj.m_bSenderDeleted = false;
  return obj;
}
export function putKPostItemTitleInfo(ks: KSerializer, obj: KPostItemTitleInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iPostNo))) return false;
  if (!(ks.putInt8(obj.m_cScriptType))) return false;
  if (!(ks.putInt32(obj.m_iScriptIndex))) return false;
  if (!(ks.putInt8(obj.m_cEnchantLevel))) return false;
  if (!(ks.putWString(obj.m_wstrRegDate))) return false;
  if (!(ks.putWString(obj.m_wstrFromNickName))) return false;
  if (!(ks.putWString(obj.m_wstrTitle))) return false;
  if (!(ks.putBool(obj.m_bRead))) return false;
  if (Boolean(f.SERV_NETERROR_STR_GET_FROM_CLIENT)) { if (!(ks.putBool((obj.m_bSenderDeleted ?? false)))) return false; }
  return true;
}
export function getKPostItemTitleInfo(ks: KSerializer, flags?: FlagInput): KPostItemTitleInfo {
  const f = resolveFlags(flags);
  const obj = createKPostItemTitleInfo(f);
  obj.m_iPostNo = ks.getInt64();
  obj.m_cScriptType = ks.getInt8();
  obj.m_iScriptIndex = ks.getInt32();
  obj.m_cEnchantLevel = ks.getInt8();
  obj.m_wstrRegDate = ks.getWString();
  obj.m_wstrFromNickName = ks.getWString();
  obj.m_wstrTitle = ks.getWString();
  obj.m_bRead = ks.getBool();
  if (Boolean(f.SERV_NETERROR_STR_GET_FROM_CLIENT)) { obj.m_bSenderDeleted = ks.getBool(); }
  return obj;
}

export interface KPostSmallTitleInfo {
  m_cScriptType: Int8;
  m_wstrLetterTitle: string;
}
export function createKPostSmallTitleInfo(flags?: FlagInput): KPostSmallTitleInfo {
  const f = resolveFlags(flags);
  return {
    m_cScriptType: 0,
    m_wstrLetterTitle: '',
  };
}
export function putKPostSmallTitleInfo(ks: KSerializer, obj: KPostSmallTitleInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt8(obj.m_cScriptType))) return false;
  if (!(ks.putWString(obj.m_wstrLetterTitle))) return false;
  return true;
}
export function getKPostSmallTitleInfo(ks: KSerializer, flags?: FlagInput): KPostSmallTitleInfo {
  const f = resolveFlags(flags);
  const obj = createKPostSmallTitleInfo(f);
  obj.m_cScriptType = ks.getInt8();
  obj.m_wstrLetterTitle = ks.getWString();
  return obj;
}

export interface KTutorialUnitInfo {
  m_iUnitUID: UidType;
  m_ucLevel: UInt8;
  m_wstrNickName: string;
  m_bIsOnline: boolean;
}
export function createKTutorialUnitInfo(flags?: FlagInput): KTutorialUnitInfo {
  const f = resolveFlags(flags);
  return {
    m_iUnitUID: 0n,
    m_ucLevel: 0,
    m_wstrNickName: '',
    m_bIsOnline: false,
  };
}
export function putKTutorialUnitInfo(ks: KSerializer, obj: KTutorialUnitInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putUInt8(obj.m_ucLevel))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (!(ks.putBool(obj.m_bIsOnline))) return false;
  return true;
}
export function getKTutorialUnitInfo(ks: KSerializer, flags?: FlagInput): KTutorialUnitInfo {
  const f = resolveFlags(flags);
  const obj = createKTutorialUnitInfo(f);
  obj.m_iUnitUID = ks.getInt64();
  obj.m_ucLevel = ks.getUInt8();
  obj.m_wstrNickName = ks.getWString();
  obj.m_bIsOnline = ks.getBool();
  return obj;
}

export interface KTutorialDBUnitInfo {
  m_kTutorialUnitInfo: KTutorialUnitInfo;
  m_wstrLastDate: string;
}
export function createKTutorialDBUnitInfo(flags?: FlagInput): KTutorialDBUnitInfo {
  const f = resolveFlags(flags);
  return {
    m_kTutorialUnitInfo: createKTutorialUnitInfo(f),
    m_wstrLastDate: '',
  };
}
export function putKTutorialDBUnitInfo(ks: KSerializer, obj: KTutorialDBUnitInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUserClass(obj.m_kTutorialUnitInfo, putKTutorialUnitInfo, f))) return false;
  if (!(ks.putWString(obj.m_wstrLastDate))) return false;
  return true;
}
export function getKTutorialDBUnitInfo(ks: KSerializer, flags?: FlagInput): KTutorialDBUnitInfo {
  const f = resolveFlags(flags);
  const obj = createKTutorialDBUnitInfo(f);
  obj.m_kTutorialUnitInfo = ks.getUserClass(getKTutorialUnitInfo, f);
  obj.m_wstrLastDate = ks.getWString();
  return obj;
}

export interface KItemAbuserLogInfo {
  m_iRewardState: Int32;
  m_iItemID: Int32;
  m_iQuantity: Int32;
}
export function createKItemAbuserLogInfo(flags?: FlagInput): KItemAbuserLogInfo {
  const f = resolveFlags(flags);
  return {
    m_iRewardState: 0,
    m_iItemID: 0,
    m_iQuantity: 0,
  };
}
export function putKItemAbuserLogInfo(ks: KSerializer, obj: KItemAbuserLogInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iRewardState))) return false;
  if (!(ks.putInt32(obj.m_iItemID))) return false;
  if (!(ks.putInt32(obj.m_iQuantity))) return false;
  return true;
}
export function getKItemAbuserLogInfo(ks: KSerializer, flags?: FlagInput): KItemAbuserLogInfo {
  const f = resolveFlags(flags);
  const obj = createKItemAbuserLogInfo(f);
  obj.m_iRewardState = ks.getInt32();
  obj.m_iItemID = ks.getInt32();
  obj.m_iQuantity = ks.getInt32();
  return obj;
}

export interface KCashItemResolveInfo {
  m_iItemID: Int32;
  m_iSalePrice: Int32;
}
export function createKCashItemResolveInfo(flags?: FlagInput): KCashItemResolveInfo {
  const f = resolveFlags(flags);
  return {
    m_iItemID: 0,
    m_iSalePrice: 0,
  };
}
export function putKCashItemResolveInfo(ks: KSerializer, obj: KCashItemResolveInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iItemID))) return false;
  if (!(ks.putInt32(obj.m_iSalePrice))) return false;
  return true;
}
export function getKCashItemResolveInfo(ks: KSerializer, flags?: FlagInput): KCashItemResolveInfo {
  const f = resolveFlags(flags);
  const obj = createKCashItemResolveInfo(f);
  obj.m_iItemID = ks.getInt32();
  obj.m_iSalePrice = ks.getInt32();
  return obj;
}

export interface KAttribEnchantNpcInfo {
  m_cAttribEnchant1: Int8;
  m_cAttribEnchant2: Int8;
  m_cExtraSpecialAbility1: Int8;
  m_cExtraSpecialAbility2: Int8;
}
export function createKAttribEnchantNpcInfo(flags?: FlagInput): KAttribEnchantNpcInfo {
  const f = resolveFlags(flags);
  return {
    m_cAttribEnchant1: 0,
    m_cAttribEnchant2: 0,
    m_cExtraSpecialAbility1: 0,
    m_cExtraSpecialAbility2: 0,
  };
}
export function putKAttribEnchantNpcInfo(ks: KSerializer, obj: KAttribEnchantNpcInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt8(obj.m_cAttribEnchant1))) return false;
  if (!(ks.putInt8(obj.m_cAttribEnchant2))) return false;
  if (!(ks.putInt8(obj.m_cExtraSpecialAbility1))) return false;
  if (!(ks.putInt8(obj.m_cExtraSpecialAbility2))) return false;
  return true;
}
export function getKAttribEnchantNpcInfo(ks: KSerializer, flags?: FlagInput): KAttribEnchantNpcInfo {
  const f = resolveFlags(flags);
  const obj = createKAttribEnchantNpcInfo(f);
  obj.m_cAttribEnchant1 = ks.getInt8();
  obj.m_cAttribEnchant2 = ks.getInt8();
  obj.m_cExtraSpecialAbility1 = ks.getInt8();
  obj.m_cExtraSpecialAbility2 = ks.getInt8();
  return obj;
}

export interface KSubMissionInstance {
  m_iID: Int32;
  m_sClearData: Int16;
  m_bIsSuccess: boolean;
}
export function createKSubMissionInstance(flags?: FlagInput): KSubMissionInstance {
  const f = resolveFlags(flags);
  return {
    m_iID: 0,
    m_sClearData: 0,
    m_bIsSuccess: false,
  };
}
export function putKSubMissionInstance(ks: KSerializer, obj: KSubMissionInstance, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iID))) return false;
  if (!(ks.putInt16(obj.m_sClearData))) return false;
  if (!(ks.putBool(obj.m_bIsSuccess))) return false;
  return true;
}
export function getKSubMissionInstance(ks: KSerializer, flags?: FlagInput): KSubMissionInstance {
  const f = resolveFlags(flags);
  const obj = createKSubMissionInstance(f);
  obj.m_iID = ks.getInt32();
  obj.m_sClearData = ks.getInt16();
  obj.m_bIsSuccess = ks.getBool();
  return obj;
}

export interface KMissionInstance {
  m_iID: Int32;
  m_vecSubMissionInstance: KSubMissionInstance[];
}
export function createKMissionInstance(flags?: FlagInput): KMissionInstance {
  const f = resolveFlags(flags);
  return {
    m_iID: 0,
    m_vecSubMissionInstance: ([] as KSubMissionInstance[]),
  };
}
export function putKMissionInstance(ks: KSerializer, obj: KMissionInstance, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iID))) return false;
  if (!(ks.putVector(obj.m_vecSubMissionInstance, (ks, item: KSubMissionInstance) => ks.putUserClass(item, putKSubMissionInstance, f)))) return false;
  return true;
}
export function getKMissionInstance(ks: KSerializer, flags?: FlagInput): KMissionInstance {
  const f = resolveFlags(flags);
  const obj = createKMissionInstance(f);
  obj.m_iID = ks.getInt32();
  obj.m_vecSubMissionInstance = ks.getVector<KSubMissionInstance>((ks) => ks.getUserClass(getKSubMissionInstance, f));
  return obj;
}

export interface KTitleInfo {
  m_iTitleID: Int32;
  m_wstrEndDate: string;
  m_kCTime: Int64;
  m_bInfinity: boolean;
}
export function createKTitleInfo(flags?: FlagInput): KTitleInfo {
  const f = resolveFlags(flags);
  return {
    m_iTitleID: 0,
    m_wstrEndDate: '',
    m_kCTime: 0n,
    m_bInfinity: false,
  };
}
export function putKTitleInfo(ks: KSerializer, obj: KTitleInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iTitleID))) return false;
  if (!(ks.putWString(obj.m_wstrEndDate))) return false;
  if (!(ks.putInt64(obj.m_kCTime))) return false;
  if (!(ks.putBool(obj.m_bInfinity))) return false;
  return true;
}
export function getKTitleInfo(ks: KSerializer, flags?: FlagInput): KTitleInfo {
  const f = resolveFlags(flags);
  const obj = createKTitleInfo(f);
  obj.m_iTitleID = ks.getInt32();
  obj.m_wstrEndDate = ks.getWString();
  obj.m_kCTime = ks.getInt64();
  obj.m_bInfinity = ks.getBool();
  return obj;
}

export interface KTitleReward {
  m_iTitleID: Int32;
  m_sPeriod: Int16;
}
export function createKTitleReward(flags?: FlagInput): KTitleReward {
  const f = resolveFlags(flags);
  return {
    m_iTitleID: 0,
    m_sPeriod: 0,
  };
}
export function putKTitleReward(ks: KSerializer, obj: KTitleReward, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iTitleID))) return false;
  if (!(ks.putInt16(obj.m_sPeriod))) return false;
  return true;
}
export function getKTitleReward(ks: KSerializer, flags?: FlagInput): KTitleReward {
  const f = resolveFlags(flags);
  const obj = createKTitleReward(f);
  obj.m_iTitleID = ks.getInt32();
  obj.m_sPeriod = ks.getInt16();
  return obj;
}

export interface KRankingTitleReward {
  m_iUnitUID: UidType;
  m_vecReward: KTitleReward[];
}
export function createKRankingTitleReward(flags?: FlagInput): KRankingTitleReward {
  const f = resolveFlags(flags);
  return {
    m_iUnitUID: 0n,
    m_vecReward: ([] as KTitleReward[]),
  };
}
export function putKRankingTitleReward(ks: KSerializer, obj: KRankingTitleReward, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putVector(obj.m_vecReward, (ks, item: KTitleReward) => ks.putUserClass(item, putKTitleReward, f)))) return false;
  return true;
}
export function getKRankingTitleReward(ks: KSerializer, flags?: FlagInput): KRankingTitleReward {
  const f = resolveFlags(flags);
  const obj = createKRankingTitleReward(f);
  obj.m_iUnitUID = ks.getInt64();
  obj.m_vecReward = ks.getVector<KTitleReward>((ks) => ks.getUserClass(getKTitleReward, f));
  return obj;
}

export interface KAbuserList {
  m_iReleaseTick: Int32;
  m_vecAbuserList: UidType[];
}
export function createKAbuserList(flags?: FlagInput): KAbuserList {
  const f = resolveFlags(flags);
  return {
    m_iReleaseTick: 0,
    m_vecAbuserList: ([] as UidType[]),
  };
}
export function putKAbuserList(ks: KSerializer, obj: KAbuserList, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iReleaseTick))) return false;
  if (!(ks.putVector(obj.m_vecAbuserList, (ks, item: UidType) => ks.putInt64(item)))) return false;
  return true;
}
export function getKAbuserList(ks: KSerializer, flags?: FlagInput): KAbuserList {
  const f = resolveFlags(flags);
  const obj = createKAbuserList(f);
  obj.m_iReleaseTick = ks.getInt32();
  obj.m_vecAbuserList = ks.getVector<UidType>((ks) => ks.getInt64());
  return obj;
}

export interface KFieldUserInfo {
  m_iUnitUID: UidType;
  m_wstrNickName: string;
  m_cUnitClass: Int8;
  m_ucLevel: UInt8;
  m_cRank?: Int8;
  m_iRating?: Int32;
  m_cPVPEmblem?: Int8;
  m_vecEquippedItem: KInventoryItemSimpleInfo[];
  m_iTitleID?: Int32;
  m_sTitleID?: Int16;
  m_vPos: VECTOR3;
  m_iPartyUID: UidType;
  m_wstrGuildName?: string;
  m_vecPet?: KFieldPetInfo[];
  m_iED?: Int32;
  m_bInvisible?: boolean;
  m_iRidingPetUID?: UidType;
  m_usRidingPetID?: UInt16;
  m_iLoverUnitUID?: UidType;
  m_iEventQuestClearCount?: Int32;
  m_iExchangeCount?: Int32;
  m_iAccountPVPLoseCount?: UInt32;
}
export function createKFieldUserInfo(flags?: FlagInput): KFieldUserInfo {
  const f = resolveFlags(flags);
  const obj: KFieldUserInfo = {
    m_iUnitUID: 0n,
    m_wstrNickName: '',
    m_cUnitClass: 0,
    m_ucLevel: 0,
    m_vecEquippedItem: ([] as KInventoryItemSimpleInfo[]),
    m_vPos: createVECTOR3(f),
    m_iPartyUID: 0n,
  };
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) obj.m_cRank = 0;
  if (f.SERV_PVP_NEW_SYSTEM && !f.SERV_2012_PVP_SEASON2) obj.m_iRating = 0;
  if (!f.SERV_PVP_NEW_SYSTEM) obj.m_cPVPEmblem = 0;
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) obj.m_iTitleID = 0;
  if (!f.SERV_TITLE_DATA_SIZE) obj.m_sTitleID = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_wstrGuildName = '';
  if (Boolean(f.SERV_PET_SYSTEM)) obj.m_vecPet = ([] as KFieldPetInfo[]);
  if (Boolean(f.SERV_ED_MONITORING_IN_GAME)) obj.m_iED = 0;
  if (Boolean(f.SERV_INVISIBLE_GM)) obj.m_bInvisible = false;
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) obj.m_iRidingPetUID = 0n;
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) obj.m_usRidingPetID = 0;
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) obj.m_iLoverUnitUID = 0n;
  if (Boolean(f.SERV_GROW_UP_SOCKET)) obj.m_iEventQuestClearCount = 0;
  if (Boolean(f.SERV_GROW_UP_SOCKET)) obj.m_iExchangeCount = 0;
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_iAccountPVPLoseCount = 0;
  return obj;
}
export function putKFieldUserInfo(ks: KSerializer, obj: KFieldUserInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (!(ks.putInt8(obj.m_cUnitClass))) return false;
  if (!(ks.putUInt8(obj.m_ucLevel))) return false;
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { if (!(ks.putInt8((obj.m_cRank ?? 0)))) return false; }
  if (f.SERV_PVP_NEW_SYSTEM && !f.SERV_2012_PVP_SEASON2) { if (!(ks.putInt32((obj.m_iRating ?? 0)))) return false; }
  if (!f.SERV_PVP_NEW_SYSTEM) { if (!(ks.putInt8((obj.m_cPVPEmblem ?? 0)))) return false; }
  if (!(ks.putVector(obj.m_vecEquippedItem, (ks, item: KInventoryItemSimpleInfo) => ks.putUserClass(item, putKInventoryItemSimpleInfo, f)))) return false;
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) { if (!(ks.putInt32((obj.m_iTitleID ?? 0)))) return false; }
  if (!f.SERV_TITLE_DATA_SIZE) { if (!(ks.putInt16((obj.m_sTitleID ?? 0)))) return false; }
  if (!(ks.putUserClass(obj.m_vPos, putVECTOR3, f))) return false;
  if (!(ks.putInt64(obj.m_iPartyUID))) return false;
  if (Boolean(f.GUILD_TEST)) { if (!(ks.putWString((obj.m_wstrGuildName ?? '')))) return false; }
  if (Boolean(f.SERV_PET_SYSTEM)) { if (!(ks.putVector((obj.m_vecPet ?? ([] as KFieldPetInfo[])), (ks, item: KFieldPetInfo) => ks.putUserClass(item, putKFieldPetInfo, f)))) return false; }
  if (Boolean(f.SERV_ED_MONITORING_IN_GAME)) { if (!(ks.putInt32((obj.m_iED ?? 0)))) return false; }
  if (Boolean(f.SERV_INVISIBLE_GM)) { if (!(ks.putBool((obj.m_bInvisible ?? false)))) return false; }
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) { if (!(ks.putInt64((obj.m_iRidingPetUID ?? 0n)))) return false; }
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) { if (!(ks.putUInt16((obj.m_usRidingPetID ?? 0)))) return false; }
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { if (!(ks.putInt64((obj.m_iLoverUnitUID ?? 0n)))) return false; }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { if (!(ks.putInt32((obj.m_iEventQuestClearCount ?? 0)))) return false; }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { if (!(ks.putInt32((obj.m_iExchangeCount ?? 0)))) return false; }
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putUInt32((obj.m_iAccountPVPLoseCount ?? 0)))) return false; }
  return true;
}
export function getKFieldUserInfo(ks: KSerializer, flags?: FlagInput): KFieldUserInfo {
  const f = resolveFlags(flags);
  const obj = createKFieldUserInfo(f);
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  obj.m_cUnitClass = ks.getInt8();
  obj.m_ucLevel = ks.getUInt8();
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { obj.m_cRank = ks.getInt8(); }
  if (f.SERV_PVP_NEW_SYSTEM && !f.SERV_2012_PVP_SEASON2) { obj.m_iRating = ks.getInt32(); }
  if (!f.SERV_PVP_NEW_SYSTEM) { obj.m_cPVPEmblem = ks.getInt8(); }
  obj.m_vecEquippedItem = ks.getVector<KInventoryItemSimpleInfo>((ks) => ks.getUserClass(getKInventoryItemSimpleInfo, f));
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) { obj.m_iTitleID = ks.getInt32(); }
  if (!f.SERV_TITLE_DATA_SIZE) { obj.m_sTitleID = ks.getInt16(); }
  obj.m_vPos = ks.getUserClass(getVECTOR3, f);
  obj.m_iPartyUID = ks.getInt64();
  if (Boolean(f.GUILD_TEST)) { obj.m_wstrGuildName = ks.getWString(); }
  if (Boolean(f.SERV_PET_SYSTEM)) { obj.m_vecPet = ks.getVector<KFieldPetInfo>((ks) => ks.getUserClass(getKFieldPetInfo, f)); }
  if (Boolean(f.SERV_ED_MONITORING_IN_GAME)) { obj.m_iED = ks.getInt32(); }
  if (Boolean(f.SERV_INVISIBLE_GM)) { obj.m_bInvisible = ks.getBool(); }
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) { obj.m_iRidingPetUID = ks.getInt64(); }
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) { obj.m_usRidingPetID = ks.getUInt16(); }
  if (Boolean(f.SERV_RELATIONSHIP_SYSTEM)) { obj.m_iLoverUnitUID = ks.getInt64(); }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { obj.m_iEventQuestClearCount = ks.getInt32(); }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { obj.m_iExchangeCount = ks.getInt32(); }
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_iAccountPVPLoseCount = ks.getUInt32(); }
  return obj;
}

export const KCommunityUserInfo_USER_STATE = {
  US_NONE: 0,
  US_FIELD: 1,
  US_DUNGEON_LOUNGE: 2,
  US_PVP_LOBBY: 3,
  US_PVP_WAIT: 4,
  US_PVP_PLAY: 5,
  US_ENTER_LOBBY: 6,
  US_LEAVE_LOBBY: 7,
} as const;
export type KCommunityUserInfo_USER_STATE = (typeof KCommunityUserInfo_USER_STATE)[keyof typeof KCommunityUserInfo_USER_STATE];
export interface KCommunityUserInfo {
  m_iUnitUID: UidType;
  m_wstrNickName: string;
  m_cUnitClass: Int8;
  m_ucLevel: UInt8;
  m_cState: Int8;
  m_iStateCode: UidType;
  m_iRoomUID: UidType;
  m_iED?: Int32;
}
export function createKCommunityUserInfo(flags?: FlagInput): KCommunityUserInfo {
  const f = resolveFlags(flags);
  const obj: KCommunityUserInfo = {
    m_iUnitUID: 0n,
    m_wstrNickName: '',
    m_cUnitClass: 0,
    m_ucLevel: 0,
    m_cState: 0,
    m_iStateCode: 0n,
    m_iRoomUID: 0n,
  };
  if (Boolean(f.SERV_ED_MONITORING_IN_GAME)) obj.m_iED = 0;
  return obj;
}
export function putKCommunityUserInfo(ks: KSerializer, obj: KCommunityUserInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (!(ks.putInt8(obj.m_cUnitClass))) return false;
  if (!(ks.putUInt8(obj.m_ucLevel))) return false;
  if (!(ks.putInt8(obj.m_cState))) return false;
  if (!(ks.putInt64(obj.m_iStateCode))) return false;
  if (!(ks.putInt64(obj.m_iRoomUID))) return false;
  if (Boolean(f.SERV_ED_MONITORING_IN_GAME)) { if (!(ks.putInt32((obj.m_iED ?? 0)))) return false; }
  return true;
}
export function getKCommunityUserInfo(ks: KSerializer, flags?: FlagInput): KCommunityUserInfo {
  const f = resolveFlags(flags);
  const obj = createKCommunityUserInfo(f);
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  obj.m_cUnitClass = ks.getInt8();
  obj.m_ucLevel = ks.getUInt8();
  obj.m_cState = ks.getInt8();
  obj.m_iStateCode = ks.getInt64();
  obj.m_iRoomUID = ks.getInt64();
  if (Boolean(f.SERV_ED_MONITORING_IN_GAME)) { obj.m_iED = ks.getInt32(); }
  return obj;
}

export interface KTileInfo {
  m_NumX: Int32;
  m_NumY: Int32;
  m_NumZ: Int32;
  m_SizeX: Int16;
  m_SizeY: Int16;
  m_SizeZ: Int16;
}
export function createKTileInfo(flags?: FlagInput): KTileInfo {
  const f = resolveFlags(flags);
  return {
    m_NumX: 0,
    m_NumY: 0,
    m_NumZ: 0,
    m_SizeX: 0,
    m_SizeY: 0,
    m_SizeZ: 0,
  };
}
export function putKTileInfo(ks: KSerializer, obj: KTileInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_NumX))) return false;
  if (!(ks.putInt32(obj.m_NumY))) return false;
  if (!(ks.putInt32(obj.m_NumZ))) return false;
  if (!(ks.putInt16(obj.m_SizeX))) return false;
  if (!(ks.putInt16(obj.m_SizeY))) return false;
  if (!(ks.putInt16(obj.m_SizeZ))) return false;
  return true;
}
export function getKTileInfo(ks: KSerializer, flags?: FlagInput): KTileInfo {
  const f = resolveFlags(flags);
  const obj = createKTileInfo(f);
  obj.m_NumX = ks.getInt32();
  obj.m_NumY = ks.getInt32();
  obj.m_NumZ = ks.getInt32();
  obj.m_SizeX = ks.getInt16();
  obj.m_SizeY = ks.getInt16();
  obj.m_SizeZ = ks.getInt16();
  return obj;
}

export interface KMapInfo {
  m_MinX: Int16;
  m_MinY: Int16;
  m_MinZ: Int16;
  m_MaxX: Int16;
  m_MaxY: Int16;
  m_MaxZ: Int16;
}
export function createKMapInfo(flags?: FlagInput): KMapInfo {
  const f = resolveFlags(flags);
  return {
    m_MinX: 0,
    m_MinY: 0,
    m_MinZ: 0,
    m_MaxX: 0,
    m_MaxY: 0,
    m_MaxZ: 0,
  };
}
export function putKMapInfo(ks: KSerializer, obj: KMapInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt16(obj.m_MinX))) return false;
  if (!(ks.putInt16(obj.m_MinY))) return false;
  if (!(ks.putInt16(obj.m_MinZ))) return false;
  if (!(ks.putInt16(obj.m_MaxX))) return false;
  if (!(ks.putInt16(obj.m_MaxY))) return false;
  if (!(ks.putInt16(obj.m_MaxZ))) return false;
  return true;
}
export function getKMapInfo(ks: KSerializer, flags?: FlagInput): KMapInfo {
  const f = resolveFlags(flags);
  const obj = createKMapInfo(f);
  obj.m_MinX = ks.getInt16();
  obj.m_MinY = ks.getInt16();
  obj.m_MinZ = ks.getInt16();
  obj.m_MaxX = ks.getInt16();
  obj.m_MaxY = ks.getInt16();
  obj.m_MaxZ = ks.getInt16();
  return obj;
}

export interface KFieldCoordinates {
  m_PosX: Int16;
  m_PosY: Int16;
  m_PosZ: Int16;
}
export function createKFieldCoordinates(flags?: FlagInput): KFieldCoordinates {
  const f = resolveFlags(flags);
  return {
    m_PosX: 0,
    m_PosY: 0,
    m_PosZ: 0,
  };
}
export function putKFieldCoordinates(ks: KSerializer, obj: KFieldCoordinates, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt16(obj.m_PosX))) return false;
  if (!(ks.putInt16(obj.m_PosY))) return false;
  if (!(ks.putInt16(obj.m_PosZ))) return false;
  return true;
}
export function getKFieldCoordinates(ks: KSerializer, flags?: FlagInput): KFieldCoordinates {
  const f = resolveFlags(flags);
  const obj = createKFieldCoordinates(f);
  obj.m_PosX = ks.getInt16();
  obj.m_PosY = ks.getInt16();
  obj.m_PosZ = ks.getInt16();
  return obj;
}

export interface KFieldFrameInfo {
  m_StateID: UInt8;
  m_FrameCount: UInt8;
}
export function createKFieldFrameInfo(flags?: FlagInput): KFieldFrameInfo {
  const f = resolveFlags(flags);
  return {
    m_StateID: 0,
    m_FrameCount: 0,
  };
}
export function putKFieldFrameInfo(ks: KSerializer, obj: KFieldFrameInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUInt8(obj.m_StateID))) return false;
  if (!(ks.putUInt8(obj.m_FrameCount))) return false;
  return true;
}
export function getKFieldFrameInfo(ks: KSerializer, flags?: FlagInput): KFieldFrameInfo {
  const f = resolveFlags(flags);
  const obj = createKFieldFrameInfo(f);
  obj.m_StateID = ks.getUInt8();
  obj.m_FrameCount = ks.getUInt8();
  return obj;
}

export const KFieldOption_LIMIT_OPTION = {
  LO_LOW: 10,
  LO_MIDDLE: 25,
  LO_HIGH: 35,
} as const;
export type KFieldOption_LIMIT_OPTION = (typeof KFieldOption_LIMIT_OPTION)[keyof typeof KFieldOption_LIMIT_OPTION];
export interface KFieldOption {
  m_sLimitOption: Int16;
}
export function createKFieldOption(flags?: FlagInput): KFieldOption {
  const f = resolveFlags(flags);
  return {
    m_sLimitOption: 35,
  };
}
export function putKFieldOption(ks: KSerializer, obj: KFieldOption, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt16(obj.m_sLimitOption))) return false;
  return true;
}
export function getKFieldOption(ks: KSerializer, flags?: FlagInput): KFieldOption {
  const f = resolveFlags(flags);
  const obj = createKFieldOption(f);
  obj.m_sLimitOption = ks.getInt16();
  return obj;
}

export interface KChannelBonusInfo {
  m_bEnable: boolean;
  m_iBeginLv: Int32;
  m_iEndLv: Int32;
  m_iPerExp: Int32;
  m_iPerED: Int32;
}
export function createKChannelBonusInfo(flags?: FlagInput): KChannelBonusInfo {
  const f = resolveFlags(flags);
  return {
    m_bEnable: false,
    m_iBeginLv: 0,
    m_iEndLv: 0,
    m_iPerExp: 0,
    m_iPerED: 0,
  };
}
export function putKChannelBonusInfo(ks: KSerializer, obj: KChannelBonusInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putBool(obj.m_bEnable))) return false;
  if (!(ks.putInt32(obj.m_iBeginLv))) return false;
  if (!(ks.putInt32(obj.m_iEndLv))) return false;
  if (!(ks.putInt32(obj.m_iPerExp))) return false;
  if (!(ks.putInt32(obj.m_iPerED))) return false;
  return true;
}
export function getKChannelBonusInfo(ks: KSerializer, flags?: FlagInput): KChannelBonusInfo {
  const f = resolveFlags(flags);
  const obj = createKChannelBonusInfo(f);
  obj.m_bEnable = ks.getBool();
  obj.m_iBeginLv = ks.getInt32();
  obj.m_iEndLv = ks.getInt32();
  obj.m_iPerExp = ks.getInt32();
  obj.m_iPerED = ks.getInt32();
  return obj;
}

export interface KChannelInfo {
  m_iServerUID: Int32;
  m_iChannelID: Int32;
  m_wstrChannelName: string;
  m_iServerGroupID: Int32;
  m_wstrIP: string;
  m_usMasterPort: UInt16;
  m_usNCUDPPort: UInt16;
  m_iMaxUser: Int32;
  m_iCurrentUser: Int32;
  m_iCurPartyCount: Int32;
  m_iPlayGamePartyCount: Int32;
  m_kBonusInfo?: KChannelBonusInfo;
}
export function createKChannelInfo(flags?: FlagInput): KChannelInfo {
  const f = resolveFlags(flags);
  const obj: KChannelInfo = {
    m_iServerUID: 0,
    m_iChannelID: 0,
    m_wstrChannelName: '',
    m_iServerGroupID: 0,
    m_wstrIP: '',
    m_usMasterPort: 0,
    m_usNCUDPPort: 0,
    m_iMaxUser: 0,
    m_iCurrentUser: 0,
    m_iCurPartyCount: 0,
    m_iPlayGamePartyCount: 0,
  };
  if (Boolean(f.SERV_INTEGRATE_THE_CHANNEL_INFO)) obj.m_kBonusInfo = createKChannelBonusInfo(f);
  return obj;
}
export function putKChannelInfo(ks: KSerializer, obj: KChannelInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iServerUID))) return false;
  if (!(ks.putInt32(obj.m_iChannelID))) return false;
  if (!(ks.putWString(obj.m_wstrChannelName))) return false;
  if (!(ks.putInt32(obj.m_iServerGroupID))) return false;
  if (!(ks.putWString(obj.m_wstrIP))) return false;
  if (!(ks.putUInt16(obj.m_usMasterPort))) return false;
  if (!(ks.putUInt16(obj.m_usNCUDPPort))) return false;
  if (!(ks.putInt32(obj.m_iMaxUser))) return false;
  if (!(ks.putInt32(obj.m_iCurrentUser))) return false;
  if (!(ks.putInt32(obj.m_iCurPartyCount))) return false;
  if (!(ks.putInt32(obj.m_iPlayGamePartyCount))) return false;
  if (Boolean(f.SERV_INTEGRATE_THE_CHANNEL_INFO)) { if (!(ks.putUserClass((obj.m_kBonusInfo ?? createKChannelBonusInfo(f)), putKChannelBonusInfo, f))) return false; }
  return true;
}
export function getKChannelInfo(ks: KSerializer, flags?: FlagInput): KChannelInfo {
  const f = resolveFlags(flags);
  const obj = createKChannelInfo(f);
  obj.m_iServerUID = ks.getInt32();
  obj.m_iChannelID = ks.getInt32();
  obj.m_wstrChannelName = ks.getWString();
  obj.m_iServerGroupID = ks.getInt32();
  obj.m_wstrIP = ks.getWString();
  obj.m_usMasterPort = ks.getUInt16();
  obj.m_usNCUDPPort = ks.getUInt16();
  obj.m_iMaxUser = ks.getInt32();
  obj.m_iCurrentUser = ks.getInt32();
  obj.m_iCurPartyCount = ks.getInt32();
  obj.m_iPlayGamePartyCount = ks.getInt32();
  if (Boolean(f.SERV_INTEGRATE_THE_CHANNEL_INFO)) { obj.m_kBonusInfo = ks.getUserClass(getKChannelBonusInfo, f); }
  return obj;
}

export interface KChannelSimpleInfo {
  m_iChannelID: Int32;
  m_iMaxUser: Int32;
  m_iCurrentUser: Int32;
}
export function createKChannelSimpleInfo(flags?: FlagInput): KChannelSimpleInfo {
  const f = resolveFlags(flags);
  return {
    m_iChannelID: 0,
    m_iMaxUser: 0,
    m_iCurrentUser: 0,
  };
}
export function putKChannelSimpleInfo(ks: KSerializer, obj: KChannelSimpleInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iChannelID))) return false;
  if (!(ks.putInt32(obj.m_iMaxUser))) return false;
  if (!(ks.putInt32(obj.m_iCurrentUser))) return false;
  return true;
}
export function getKChannelSimpleInfo(ks: KSerializer, flags?: FlagInput): KChannelSimpleInfo {
  const f = resolveFlags(flags);
  const obj = createKChannelSimpleInfo(f);
  obj.m_iChannelID = ks.getInt32();
  obj.m_iMaxUser = ks.getInt32();
  obj.m_iCurrentUser = ks.getInt32();
  return obj;
}

export interface KPVPUserSimpleInfo {
  m_iUnitUID: UidType;
  m_cState: Int8;
  m_iStateCode: Int32;
  m_iRoomUID: UidType;
}
export function createKPVPUserSimpleInfo(flags?: FlagInput): KPVPUserSimpleInfo {
  const f = resolveFlags(flags);
  return {
    m_iUnitUID: 0n,
    m_cState: 0,
    m_iStateCode: 0,
    m_iRoomUID: 0n,
  };
}
export function putKPVPUserSimpleInfo(ks: KSerializer, obj: KPVPUserSimpleInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putInt8(obj.m_cState))) return false;
  if (!(ks.putInt32(obj.m_iStateCode))) return false;
  if (!(ks.putInt64(obj.m_iRoomUID))) return false;
  return true;
}
export function getKPVPUserSimpleInfo(ks: KSerializer, flags?: FlagInput): KPVPUserSimpleInfo {
  const f = resolveFlags(flags);
  const obj = createKPVPUserSimpleInfo(f);
  obj.m_iUnitUID = ks.getInt64();
  obj.m_cState = ks.getInt8();
  obj.m_iStateCode = ks.getInt32();
  obj.m_iRoomUID = ks.getInt64();
  return obj;
}

export interface KUserSkillData {
  m_iSkillID: Int16;
  m_cSkillLevel: UInt8;
  m_cSkillCSPoint: UInt8;
}
export function createKUserSkillData(flags?: FlagInput): KUserSkillData {
  const f = resolveFlags(flags);
  return {
    m_iSkillID: 0,
    m_cSkillLevel: 0,
    m_cSkillCSPoint: 0,
  };
}
export function putKUserSkillData(ks: KSerializer, obj: KUserSkillData, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt16(obj.m_iSkillID))) return false;
  if (!(ks.putUInt8(obj.m_cSkillLevel))) return false;
  if (!(ks.putUInt8(obj.m_cSkillCSPoint))) return false;
  return true;
}
export function getKUserSkillData(ks: KSerializer, flags?: FlagInput): KUserSkillData {
  const f = resolveFlags(flags);
  const obj = createKUserSkillData(f);
  obj.m_iSkillID = ks.getInt16();
  obj.m_cSkillLevel = ks.getUInt8();
  obj.m_cSkillCSPoint = ks.getUInt8();
  return obj;
}

export interface KRetrievedSkillPageData {
  m_iRetrievedSPoint?: Int32;
  m_vecUserSkillData?: KUserSkillData[];
}
export function createKRetrievedSkillPageData(flags?: FlagInput): KRetrievedSkillPageData {
  const f = resolveFlags(flags);
  const obj: KRetrievedSkillPageData = {
  };
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) obj.m_iRetrievedSPoint = 0;
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) obj.m_vecUserSkillData = ([] as KUserSkillData[]);
  return obj;
}
export function putKRetrievedSkillPageData(ks: KSerializer, obj: KRetrievedSkillPageData, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) {
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putInt32((obj.m_iRetrievedSPoint ?? 0)))) return false; }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putVector((obj.m_vecUserSkillData ?? ([] as KUserSkillData[])), (ks, item: KUserSkillData) => ks.putUserClass(item, putKUserSkillData, f)))) return false; }
  }
  return true;
}
export function getKRetrievedSkillPageData(ks: KSerializer, flags?: FlagInput): KRetrievedSkillPageData {
  const f = resolveFlags(flags);
  const obj = createKRetrievedSkillPageData(f);
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) {
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { obj.m_iRetrievedSPoint = ks.getInt32(); }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { obj.m_vecUserSkillData = ks.getVector<KUserSkillData>((ks) => ks.getUserClass(getKUserSkillData, f)); }
  }
  return obj;
}

export interface KUserSkillPageData {
  m_aEquippedSkill?: KSkillData[];
  m_aEquippedSkillSlotB?: KSkillData[];
  m_usSkillPoint?: UInt16;
  m_usCashSkillPoint?: UInt16;
  m_vecUserSkillData?: KUserSkillData[];
}
export function createKUserSkillPageData(flags?: FlagInput): KUserSkillPageData {
  const f = resolveFlags(flags);
  const obj: KUserSkillPageData = {
  };
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) obj.m_aEquippedSkill = Array.from({ length: 4 }, () => createKSkillData(f));
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) obj.m_aEquippedSkillSlotB = Array.from({ length: 4 }, () => createKSkillData(f));
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) obj.m_usSkillPoint = 0;
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) obj.m_usCashSkillPoint = 0;
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) obj.m_vecUserSkillData = ([] as KUserSkillData[]);
  return obj;
}
export function putKUserSkillPageData(ks: KSerializer, obj: KUserSkillPageData, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) {
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putUserClass((obj.m_aEquippedSkill?.[0] ?? createKSkillData(f)), putKSkillData, f))) return false; }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putUserClass((obj.m_aEquippedSkill?.[1] ?? createKSkillData(f)), putKSkillData, f))) return false; }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putUserClass((obj.m_aEquippedSkill?.[2] ?? createKSkillData(f)), putKSkillData, f))) return false; }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putUserClass((obj.m_aEquippedSkill?.[3] ?? createKSkillData(f)), putKSkillData, f))) return false; }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putUserClass((obj.m_aEquippedSkillSlotB?.[0] ?? createKSkillData(f)), putKSkillData, f))) return false; }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putUserClass((obj.m_aEquippedSkillSlotB?.[1] ?? createKSkillData(f)), putKSkillData, f))) return false; }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putUserClass((obj.m_aEquippedSkillSlotB?.[2] ?? createKSkillData(f)), putKSkillData, f))) return false; }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putUserClass((obj.m_aEquippedSkillSlotB?.[3] ?? createKSkillData(f)), putKSkillData, f))) return false; }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putUInt16((obj.m_usSkillPoint ?? 0)))) return false; }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putUInt16((obj.m_usCashSkillPoint ?? 0)))) return false; }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { if (!(ks.putVector((obj.m_vecUserSkillData ?? ([] as KUserSkillData[])), (ks, item: KUserSkillData) => ks.putUserClass(item, putKUserSkillData, f)))) return false; }
  }
  return true;
}
export function getKUserSkillPageData(ks: KSerializer, flags?: FlagInput): KUserSkillPageData {
  const f = resolveFlags(flags);
  const obj = createKUserSkillPageData(f);
  if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) {
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { (obj.m_aEquippedSkill ??= [])[0] = ks.getUserClass(getKSkillData, f); }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { (obj.m_aEquippedSkill ??= [])[1] = ks.getUserClass(getKSkillData, f); }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { (obj.m_aEquippedSkill ??= [])[2] = ks.getUserClass(getKSkillData, f); }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { (obj.m_aEquippedSkill ??= [])[3] = ks.getUserClass(getKSkillData, f); }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { (obj.m_aEquippedSkillSlotB ??= [])[0] = ks.getUserClass(getKSkillData, f); }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { (obj.m_aEquippedSkillSlotB ??= [])[1] = ks.getUserClass(getKSkillData, f); }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { (obj.m_aEquippedSkillSlotB ??= [])[2] = ks.getUserClass(getKSkillData, f); }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { (obj.m_aEquippedSkillSlotB ??= [])[3] = ks.getUserClass(getKSkillData, f); }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { obj.m_usSkillPoint = ks.getUInt16(); }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { obj.m_usCashSkillPoint = ks.getUInt16(); }
    if (Boolean(f.SERV_SKILL_PAGE_SYSTEM)) { obj.m_vecUserSkillData = ks.getVector<KUserSkillData>((ks) => ks.getUserClass(getKUserSkillData, f)); }
  }
  return obj;
}

export interface KDungeonRewardED {
  m_iED: Int32;
  m_iBonusED: Int32;
}
export function createKDungeonRewardED(flags?: FlagInput): KDungeonRewardED {
  const f = resolveFlags(flags);
  return {
    m_iED: 0,
    m_iBonusED: 0,
  };
}
export function putKDungeonRewardED(ks: KSerializer, obj: KDungeonRewardED, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iED))) return false;
  if (!(ks.putInt32(obj.m_iBonusED))) return false;
  return true;
}
export function getKDungeonRewardED(ks: KSerializer, flags?: FlagInput): KDungeonRewardED {
  const f = resolveFlags(flags);
  const obj = createKDungeonRewardED(f);
  obj.m_iED = ks.getInt32();
  obj.m_iBonusED = ks.getInt32();
  return obj;
}

export const KEGS_GET_ITEM_NOT_GET_ITEM_TYPE = {
  GIT_DROP_ITEM: 0,
  GIT_QUEST_ITEM: 1,
  GIT_RESULT_ITEM: 2,
  GIT_DROP_EVENT_ITEM: 3,
} as const;
export type KEGS_GET_ITEM_NOT_GET_ITEM_TYPE = (typeof KEGS_GET_ITEM_NOT_GET_ITEM_TYPE)[keyof typeof KEGS_GET_ITEM_NOT_GET_ITEM_TYPE];
export interface KEGS_GET_ITEM_NOT {
  m_GetUnitUID: UidType;
  m_iItemID: Int32;
  m_iDropItemUID: Int32;
  m_cGetItemType: Int8;
  m_bIsItemSuccess?: boolean;
  m_iTotalED: Int32;
  m_mapGetED: Map<UidType, KDungeonRewardED>;
  m_cEnchantLevel?: Int8;
}
export function createKEGS_GET_ITEM_NOT(flags?: FlagInput): KEGS_GET_ITEM_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_GET_ITEM_NOT = {
    m_GetUnitUID: 0n,
    m_iItemID: 0,
    m_iDropItemUID: 0,
    m_cGetItemType: 0,
    m_iTotalED: 0,
    m_mapGetED: new Map<UidType, KDungeonRewardED>(),
  };
  if (Boolean(f.DUNGEON_ITEM)) obj.m_bIsItemSuccess = false;
  if (Boolean(f.SERV_ENCHANT_ITEM_DROP_EVENT)) obj.m_cEnchantLevel = 0;
  return obj;
}
export function putKEGS_GET_ITEM_NOT(ks: KSerializer, obj: KEGS_GET_ITEM_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_GetUnitUID))) return false;
  if (!(ks.putInt32(obj.m_iItemID))) return false;
  if (!(ks.putInt32(obj.m_iDropItemUID))) return false;
  if (!(ks.putInt8(obj.m_cGetItemType))) return false;
  if (Boolean(f.DUNGEON_ITEM)) { if (!(ks.putBool((obj.m_bIsItemSuccess ?? false)))) return false; }
  if (!(ks.putInt32(obj.m_iTotalED))) return false;
  if (!(ks.putMap(obj.m_mapGetED, (ks, k: UidType) => ks.putInt64(k), (ks, v: KDungeonRewardED) => ks.putUserClass(v, putKDungeonRewardED, f)))) return false;
  if (Boolean(f.SERV_ENCHANT_ITEM_DROP_EVENT)) { if (!(ks.putInt8((obj.m_cEnchantLevel ?? 0)))) return false; }
  return true;
}
export function getKEGS_GET_ITEM_NOT(ks: KSerializer, flags?: FlagInput): KEGS_GET_ITEM_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_GET_ITEM_NOT(f);
  obj.m_GetUnitUID = ks.getInt64();
  obj.m_iItemID = ks.getInt32();
  obj.m_iDropItemUID = ks.getInt32();
  obj.m_cGetItemType = ks.getInt8();
  if (Boolean(f.DUNGEON_ITEM)) { obj.m_bIsItemSuccess = ks.getBool(); }
  obj.m_iTotalED = ks.getInt32();
  obj.m_mapGetED = ks.getMap<UidType, KDungeonRewardED>((ks) => ks.getInt64(), (ks) => ks.getUserClass(getKDungeonRewardED, f));
  if (Boolean(f.SERV_ENCHANT_ITEM_DROP_EVENT)) { obj.m_cEnchantLevel = ks.getInt8(); }
  return obj;
}

export interface KDecreaseEnduranceInfo {
  m_iItemUID: UidType;
  m_iEndurance: Int32;
}
export function createKDecreaseEnduranceInfo(flags?: FlagInput): KDecreaseEnduranceInfo {
  const f = resolveFlags(flags);
  return {
    m_iItemUID: 0n,
    m_iEndurance: 0,
  };
}
export function putKDecreaseEnduranceInfo(ks: KSerializer, obj: KDecreaseEnduranceInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iItemUID))) return false;
  if (!(ks.putInt32(obj.m_iEndurance))) return false;
  return true;
}
export function getKDecreaseEnduranceInfo(ks: KSerializer, flags?: FlagInput): KDecreaseEnduranceInfo {
  const f = resolveFlags(flags);
  const obj = createKDecreaseEnduranceInfo(f);
  obj.m_iItemUID = ks.getInt64();
  obj.m_iEndurance = ks.getInt32();
  return obj;
}

export interface KTimeDropInfo {
  m_iTimeDropID: Int32;
  m_iDropItemID: Int32;
  m_wstrDropTime: string;
  m_wstrServerIP: string;
  m_bNoticeMsg: boolean;
}
export function createKTimeDropInfo(flags?: FlagInput): KTimeDropInfo {
  const f = resolveFlags(flags);
  return {
    m_iTimeDropID: 0,
    m_iDropItemID: 0,
    m_wstrDropTime: '',
    m_wstrServerIP: '',
    m_bNoticeMsg: false,
  };
}
export function putKTimeDropInfo(ks: KSerializer, obj: KTimeDropInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iTimeDropID))) return false;
  if (!(ks.putInt32(obj.m_iDropItemID))) return false;
  if (!(ks.putWString(obj.m_wstrDropTime))) return false;
  if (!(ks.putWString(obj.m_wstrServerIP))) return false;
  if (!(ks.putBool(obj.m_bNoticeMsg))) return false;
  return true;
}
export function getKTimeDropInfo(ks: KSerializer, flags?: FlagInput): KTimeDropInfo {
  const f = resolveFlags(flags);
  const obj = createKTimeDropInfo(f);
  obj.m_iTimeDropID = ks.getInt32();
  obj.m_iDropItemID = ks.getInt32();
  obj.m_wstrDropTime = ks.getWString();
  obj.m_wstrServerIP = ks.getWString();
  obj.m_bNoticeMsg = ks.getBool();
  return obj;
}

export interface KUserPShopAgencyInfo {
  m_bIsPShopOpen?: boolean;
  m_wstrAgencyExpirationDate?: string;
  m_cShopType?: Int8;
  m_vecSellItemInfo?: KSellPShopItemBackupData[];
  m_iUserUID?: UidType;
  m_iUnitUID?: UidType;
  m_wstrNickName?: string;
  m_wstrAgencyOpenDate?: string;
  m_wstrPersonalShopName?: string;
  m_bOnSale?: boolean;
}
export function createKUserPShopAgencyInfo(flags?: FlagInput): KUserPShopAgencyInfo {
  const f = resolveFlags(flags);
  const obj: KUserPShopAgencyInfo = {
  };
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_bIsPShopOpen = false;
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_wstrAgencyExpirationDate = '';
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_cShopType = 0;
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_vecSellItemInfo = ([] as KSellPShopItemBackupData[]);
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_iUserUID = 0n;
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_wstrNickName = '';
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_wstrAgencyOpenDate = '';
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_wstrPersonalShopName = '';
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_bOnSale = false;
  return obj;
}
export function putKUserPShopAgencyInfo(ks: KSerializer, obj: KUserPShopAgencyInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PSHOP_AGENCY)) {
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putBool((obj.m_bIsPShopOpen ?? false)))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putWString((obj.m_wstrAgencyExpirationDate ?? '')))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putInt8((obj.m_cShopType ?? 0)))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putVector((obj.m_vecSellItemInfo ?? ([] as KSellPShopItemBackupData[])), (ks, item: KSellPShopItemBackupData) => ks.putUserClass(item, putKSellPShopItemBackupData, f)))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putInt64((obj.m_iUserUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putWString((obj.m_wstrAgencyOpenDate ?? '')))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putWString((obj.m_wstrPersonalShopName ?? '')))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putBool((obj.m_bOnSale ?? false)))) return false; }
  }
  return true;
}
export function getKUserPShopAgencyInfo(ks: KSerializer, flags?: FlagInput): KUserPShopAgencyInfo {
  const f = resolveFlags(flags);
  const obj = createKUserPShopAgencyInfo(f);
  if (Boolean(f.SERV_PSHOP_AGENCY)) {
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_bIsPShopOpen = ks.getBool(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_wstrAgencyExpirationDate = ks.getWString(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_cShopType = ks.getInt8(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_vecSellItemInfo = ks.getVector<KSellPShopItemBackupData>((ks) => ks.getUserClass(getKSellPShopItemBackupData, f)); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_iUserUID = ks.getInt64(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_wstrNickName = ks.getWString(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_wstrAgencyOpenDate = ks.getWString(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_wstrPersonalShopName = ks.getWString(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_bOnSale = ks.getBool(); }
  }
  return obj;
}

export interface KPersonalShopAgencyInfo {
  m_iHostUnitUID?: UidType;
  m_iPShopAgencyUID?: UidType;
  m_wstrAgencyOpenDate?: string;
  m_wstrAgencyExpirationDate?: string;
  m_bOnSale?: boolean;
  m_vecSellPShopAgencyItem?: KSellPersonalShopItemInfo[];
}
export function createKPersonalShopAgencyInfo(flags?: FlagInput): KPersonalShopAgencyInfo {
  const f = resolveFlags(flags);
  const obj: KPersonalShopAgencyInfo = {
  };
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_iHostUnitUID = 0n;
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_iPShopAgencyUID = 0n;
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_wstrAgencyOpenDate = '';
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_wstrAgencyExpirationDate = '';
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_bOnSale = false;
  if (Boolean(f.SERV_PSHOP_AGENCY)) obj.m_vecSellPShopAgencyItem = ([] as KSellPersonalShopItemInfo[]);
  return obj;
}
export function putKPersonalShopAgencyInfo(ks: KSerializer, obj: KPersonalShopAgencyInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PSHOP_AGENCY)) {
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putInt64((obj.m_iHostUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putInt64((obj.m_iPShopAgencyUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putWString((obj.m_wstrAgencyOpenDate ?? '')))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putWString((obj.m_wstrAgencyExpirationDate ?? '')))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putBool((obj.m_bOnSale ?? false)))) return false; }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { if (!(ks.putVector((obj.m_vecSellPShopAgencyItem ?? ([] as KSellPersonalShopItemInfo[])), (ks, item: KSellPersonalShopItemInfo) => ks.putUserClass(item, putKSellPersonalShopItemInfo, f)))) return false; }
  }
  return true;
}
export function getKPersonalShopAgencyInfo(ks: KSerializer, flags?: FlagInput): KPersonalShopAgencyInfo {
  const f = resolveFlags(flags);
  const obj = createKPersonalShopAgencyInfo(f);
  if (Boolean(f.SERV_PSHOP_AGENCY)) {
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_iHostUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_iPShopAgencyUID = ks.getInt64(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_wstrAgencyOpenDate = ks.getWString(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_wstrAgencyExpirationDate = ks.getWString(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_bOnSale = ks.getBool(); }
    if (Boolean(f.SERV_PSHOP_AGENCY)) { obj.m_vecSellPShopAgencyItem = ks.getVector<KSellPersonalShopItemInfo>((ks) => ks.getUserClass(getKSellPersonalShopItemInfo, f)); }
  }
  return obj;
}

export interface KEGS_CONNECT_REQ {
  m_wstrVersion: string;
}
export function createKEGS_CONNECT_REQ(flags?: FlagInput): KEGS_CONNECT_REQ {
  const f = resolveFlags(flags);
  return {
    m_wstrVersion: '',
  };
}
export function putKEGS_CONNECT_REQ(ks: KSerializer, obj: KEGS_CONNECT_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putWString(obj.m_wstrVersion))) return false;
  return true;
}
export function getKEGS_CONNECT_REQ(ks: KSerializer, flags?: FlagInput): KEGS_CONNECT_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_CONNECT_REQ(f);
  obj.m_wstrVersion = ks.getWString();
  return obj;
}

export interface KEGS_CONNECT_ACK {
  m_iOK: Int32;
  m_UDPPort: Int32;
  m_iChannelID: Int32;
  m_bUDPKickOff?: boolean;
}
export function createKEGS_CONNECT_ACK(flags?: FlagInput): KEGS_CONNECT_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_CONNECT_ACK = {
    m_iOK: 0,
    m_UDPPort: 0,
    m_iChannelID: 0,
  };
  if (Boolean(f.UDP_CAN_NOT_SEND_USER_KICK)) obj.m_bUDPKickOff = false;
  return obj;
}
export function putKEGS_CONNECT_ACK(ks: KSerializer, obj: KEGS_CONNECT_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putInt32(obj.m_UDPPort))) return false;
  if (!(ks.putInt32(obj.m_iChannelID))) return false;
  if (Boolean(f.UDP_CAN_NOT_SEND_USER_KICK)) { if (!(ks.putBool((obj.m_bUDPKickOff ?? false)))) return false; }
  return true;
}
export function getKEGS_CONNECT_ACK(ks: KSerializer, flags?: FlagInput): KEGS_CONNECT_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_CONNECT_ACK(f);
  obj.m_iOK = ks.getInt32();
  obj.m_UDPPort = ks.getInt32();
  obj.m_iChannelID = ks.getInt32();
  if (Boolean(f.UDP_CAN_NOT_SEND_USER_KICK)) { obj.m_bUDPKickOff = ks.getBool(); }
  return obj;
}

export interface KEGS_VERIFY_ACCOUNT_ACK {
  m_iOK: Int32;
  m_kAccountInfo: KAccountInfo;
  m_cHackingUserType: Int8;
  m_wstrAdURL: string;
  m_bSex: boolean;
  m_uiAge: UInt32;
  m_uiNexonSN: UInt32;
  m_wstrClientIP?: string;
  m_uChannelCode: UInt8;
  m_wstrChannelUserID: string;
  m_iEventMoney?: Int32;
}
export function createKEGS_VERIFY_ACCOUNT_ACK(flags?: FlagInput): KEGS_VERIFY_ACCOUNT_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_VERIFY_ACCOUNT_ACK = {
    m_iOK: 0,
    m_kAccountInfo: createKAccountInfo(f),
    m_cHackingUserType: 0,
    m_wstrAdURL: '',
    m_bSex: false,
    m_uiAge: 0,
    m_uiNexonSN: 0,
    m_uChannelCode: 0,
    m_wstrChannelUserID: '',
  };
  if (Boolean(f.SERV_CLIENT_PUBLIC_IP)) obj.m_wstrClientIP = '';
  if (Boolean(f.SERV_EVENT_MONEY)) obj.m_iEventMoney = 0;
  return obj;
}
export function putKEGS_VERIFY_ACCOUNT_ACK(ks: KSerializer, obj: KEGS_VERIFY_ACCOUNT_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putUserClass(obj.m_kAccountInfo, putKAccountInfo, f))) return false;
  if (!(ks.putInt8(obj.m_cHackingUserType))) return false;
  if (!(ks.putWString(obj.m_wstrAdURL))) return false;
  if (!(ks.putBool(obj.m_bSex))) return false;
  if (!(ks.putUInt32(obj.m_uiAge))) return false;
  if (!(ks.putUInt32(obj.m_uiNexonSN))) return false;
  if (Boolean(f.SERV_CLIENT_PUBLIC_IP)) { if (!(ks.putWString((obj.m_wstrClientIP ?? '')))) return false; }
  if (Boolean(f.SERV_TOONILAND_CHANNELING)) { if (!(ks.putUInt8(obj.m_uChannelCode))) return false; }
  if (Boolean(f.SERV_TOONILAND_CHANNELING)) { if (!(ks.putWString(obj.m_wstrChannelUserID))) return false; }
  if (Boolean(f.SERV_EVENT_MONEY)) { if (!(ks.putInt32((obj.m_iEventMoney ?? 0)))) return false; }
  return true;
}
export function getKEGS_VERIFY_ACCOUNT_ACK(ks: KSerializer, flags?: FlagInput): KEGS_VERIFY_ACCOUNT_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_VERIFY_ACCOUNT_ACK(f);
  obj.m_iOK = ks.getInt32();
  obj.m_kAccountInfo = ks.getUserClass(getKAccountInfo, f);
  obj.m_cHackingUserType = ks.getInt8();
  obj.m_wstrAdURL = ks.getWString();
  obj.m_bSex = ks.getBool();
  obj.m_uiAge = ks.getUInt32();
  obj.m_uiNexonSN = ks.getUInt32();
  if (Boolean(f.SERV_CLIENT_PUBLIC_IP)) { obj.m_wstrClientIP = ks.getWString(); }
  if (Boolean(f.SERV_TOONILAND_CHANNELING)) { obj.m_uChannelCode = ks.getUInt8(); }
  if (Boolean(f.SERV_TOONILAND_CHANNELING)) { obj.m_wstrChannelUserID = ks.getWString(); }
  if (Boolean(f.SERV_EVENT_MONEY)) { obj.m_iEventMoney = ks.getInt32(); }
  return obj;
}

export interface KTempInventoryItemInfo {
  m_iTempItemUID: Int32;
  m_iItemID: Int32;
  m_iQuantity: Int32;
  m_ucSealData: UInt8;
  m_cEnchantLevel?: Int8;
}
export function createKTempInventoryItemInfo(flags?: FlagInput): KTempInventoryItemInfo {
  const f = resolveFlags(flags);
  const obj: KTempInventoryItemInfo = {
    m_iTempItemUID: 0,
    m_iItemID: 0,
    m_iQuantity: 0,
    m_ucSealData: 0,
  };
  if (Boolean(f.SERV_ENCHANT_ITEM_DROP_EVENT)) obj.m_cEnchantLevel = 0;
  return obj;
}
export function putKTempInventoryItemInfo(ks: KSerializer, obj: KTempInventoryItemInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iTempItemUID))) return false;
  if (!(ks.putInt32(obj.m_iItemID))) return false;
  if (!(ks.putInt32(obj.m_iQuantity))) return false;
  if (!(ks.putUInt8(obj.m_ucSealData))) return false;
  if (Boolean(f.SERV_ENCHANT_ITEM_DROP_EVENT)) { if (!(ks.putInt8((obj.m_cEnchantLevel ?? 0)))) return false; }
  return true;
}
export function getKTempInventoryItemInfo(ks: KSerializer, flags?: FlagInput): KTempInventoryItemInfo {
  const f = resolveFlags(flags);
  const obj = createKTempInventoryItemInfo(f);
  obj.m_iTempItemUID = ks.getInt32();
  obj.m_iItemID = ks.getInt32();
  obj.m_iQuantity = ks.getInt32();
  obj.m_ucSealData = ks.getUInt8();
  if (Boolean(f.SERV_ENCHANT_ITEM_DROP_EVENT)) { obj.m_cEnchantLevel = ks.getInt8(); }
  return obj;
}

export interface KEGS_REQUEST_FRIEND_REQ {
  m_wstrNickName: string;
  m_wstrMessage: string;
}
export function createKEGS_REQUEST_FRIEND_REQ(flags?: FlagInput): KEGS_REQUEST_FRIEND_REQ {
  const f = resolveFlags(flags);
  return {
    m_wstrNickName: '',
    m_wstrMessage: '',
  };
}
export function putKEGS_REQUEST_FRIEND_REQ(ks: KSerializer, obj: KEGS_REQUEST_FRIEND_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (!(ks.putWString(obj.m_wstrMessage))) return false;
  return true;
}
export function getKEGS_REQUEST_FRIEND_REQ(ks: KSerializer, flags?: FlagInput): KEGS_REQUEST_FRIEND_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_REQUEST_FRIEND_REQ(f);
  obj.m_wstrNickName = ks.getWString();
  obj.m_wstrMessage = ks.getWString();
  return obj;
}

export interface KEGS_REQUEST_FRIEND_ACK {
  m_iOK: Int32;
  m_iUnitUID: UidType;
  m_wstrNickName: string;
}
export function createKEGS_REQUEST_FRIEND_ACK(flags?: FlagInput): KEGS_REQUEST_FRIEND_ACK {
  const f = resolveFlags(flags);
  return {
    m_iOK: 0,
    m_iUnitUID: 0n,
    m_wstrNickName: '',
  };
}
export function putKEGS_REQUEST_FRIEND_ACK(ks: KSerializer, obj: KEGS_REQUEST_FRIEND_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  return true;
}
export function getKEGS_REQUEST_FRIEND_ACK(ks: KSerializer, flags?: FlagInput): KEGS_REQUEST_FRIEND_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_REQUEST_FRIEND_ACK(f);
  obj.m_iOK = ks.getInt32();
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  return obj;
}

export interface KEGS_REQUEST_FRIEND_NOT {
  m_iUnitUID: UidType;
  m_wstrNickName: string;
  m_wstrMessage: string;
}
export function createKEGS_REQUEST_FRIEND_NOT(flags?: FlagInput): KEGS_REQUEST_FRIEND_NOT {
  const f = resolveFlags(flags);
  return {
    m_iUnitUID: 0n,
    m_wstrNickName: '',
    m_wstrMessage: '',
  };
}
export function putKEGS_REQUEST_FRIEND_NOT(ks: KSerializer, obj: KEGS_REQUEST_FRIEND_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (!(ks.putWString(obj.m_wstrMessage))) return false;
  return true;
}
export function getKEGS_REQUEST_FRIEND_NOT(ks: KSerializer, flags?: FlagInput): KEGS_REQUEST_FRIEND_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_REQUEST_FRIEND_NOT(f);
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  obj.m_wstrMessage = ks.getWString();
  return obj;
}

export interface KEGS_ACCEPT_FRIEND_ACK {
  m_iOK: Int32;
  m_iUnitUID: UidType;
}
export function createKEGS_ACCEPT_FRIEND_ACK(flags?: FlagInput): KEGS_ACCEPT_FRIEND_ACK {
  const f = resolveFlags(flags);
  return {
    m_iOK: 0,
    m_iUnitUID: 0n,
  };
}
export function putKEGS_ACCEPT_FRIEND_ACK(ks: KSerializer, obj: KEGS_ACCEPT_FRIEND_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  return true;
}
export function getKEGS_ACCEPT_FRIEND_ACK(ks: KSerializer, flags?: FlagInput): KEGS_ACCEPT_FRIEND_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_ACCEPT_FRIEND_ACK(f);
  obj.m_iOK = ks.getInt32();
  obj.m_iUnitUID = ks.getInt64();
  return obj;
}

export interface KEGS_ACCEPT_FRIEND_NOT {
  m_iUnitUID: UidType;
}
export function createKEGS_ACCEPT_FRIEND_NOT(flags?: FlagInput): KEGS_ACCEPT_FRIEND_NOT {
  const f = resolveFlags(flags);
  return {
    m_iUnitUID: 0n,
  };
}
export function putKEGS_ACCEPT_FRIEND_NOT(ks: KSerializer, obj: KEGS_ACCEPT_FRIEND_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  return true;
}
export function getKEGS_ACCEPT_FRIEND_NOT(ks: KSerializer, flags?: FlagInput): KEGS_ACCEPT_FRIEND_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_ACCEPT_FRIEND_NOT(f);
  obj.m_iUnitUID = ks.getInt64();
  return obj;
}

export interface KEGS_DENY_FRIEND_ACK {
  m_iOK: Int32;
  m_iUnitUID: UidType;
}
export function createKEGS_DENY_FRIEND_ACK(flags?: FlagInput): KEGS_DENY_FRIEND_ACK {
  const f = resolveFlags(flags);
  return {
    m_iOK: 0,
    m_iUnitUID: 0n,
  };
}
export function putKEGS_DENY_FRIEND_ACK(ks: KSerializer, obj: KEGS_DENY_FRIEND_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  return true;
}
export function getKEGS_DENY_FRIEND_ACK(ks: KSerializer, flags?: FlagInput): KEGS_DENY_FRIEND_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_DENY_FRIEND_ACK(f);
  obj.m_iOK = ks.getInt32();
  obj.m_iUnitUID = ks.getInt64();
  return obj;
}

export interface KEGS_DENY_FRIEND_NOT {
  m_iUnitUID: UidType;
  m_wstrNickName: string;
}
export function createKEGS_DENY_FRIEND_NOT(flags?: FlagInput): KEGS_DENY_FRIEND_NOT {
  const f = resolveFlags(flags);
  return {
    m_iUnitUID: 0n,
    m_wstrNickName: '',
  };
}
export function putKEGS_DENY_FRIEND_NOT(ks: KSerializer, obj: KEGS_DENY_FRIEND_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  return true;
}
export function getKEGS_DENY_FRIEND_NOT(ks: KSerializer, flags?: FlagInput): KEGS_DENY_FRIEND_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_DENY_FRIEND_NOT(f);
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  return obj;
}

export interface KEGS_BLOCK_FRIEND_ACK {
  m_iOK: Int32;
  m_iUnitUID: UidType;
}
export function createKEGS_BLOCK_FRIEND_ACK(flags?: FlagInput): KEGS_BLOCK_FRIEND_ACK {
  const f = resolveFlags(flags);
  return {
    m_iOK: 0,
    m_iUnitUID: 0n,
  };
}
export function putKEGS_BLOCK_FRIEND_ACK(ks: KSerializer, obj: KEGS_BLOCK_FRIEND_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  return true;
}
export function getKEGS_BLOCK_FRIEND_ACK(ks: KSerializer, flags?: FlagInput): KEGS_BLOCK_FRIEND_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_BLOCK_FRIEND_ACK(f);
  obj.m_iOK = ks.getInt32();
  obj.m_iUnitUID = ks.getInt64();
  return obj;
}

export interface KEGS_BLOCK_FRIEND_NOT {
  m_iUnitUID: UidType;
}
export function createKEGS_BLOCK_FRIEND_NOT(flags?: FlagInput): KEGS_BLOCK_FRIEND_NOT {
  const f = resolveFlags(flags);
  return {
    m_iUnitUID: 0n,
  };
}
export function putKEGS_BLOCK_FRIEND_NOT(ks: KSerializer, obj: KEGS_BLOCK_FRIEND_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  return true;
}
export function getKEGS_BLOCK_FRIEND_NOT(ks: KSerializer, flags?: FlagInput): KEGS_BLOCK_FRIEND_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_BLOCK_FRIEND_NOT(f);
  obj.m_iUnitUID = ks.getInt64();
  return obj;
}

export interface KEGS_UNBLOCK_FRIEND_ACK {
  m_iOK: Int32;
  m_iUnitUID: UidType;
}
export function createKEGS_UNBLOCK_FRIEND_ACK(flags?: FlagInput): KEGS_UNBLOCK_FRIEND_ACK {
  const f = resolveFlags(flags);
  return {
    m_iOK: 0,
    m_iUnitUID: 0n,
  };
}
export function putKEGS_UNBLOCK_FRIEND_ACK(ks: KSerializer, obj: KEGS_UNBLOCK_FRIEND_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  return true;
}
export function getKEGS_UNBLOCK_FRIEND_ACK(ks: KSerializer, flags?: FlagInput): KEGS_UNBLOCK_FRIEND_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_UNBLOCK_FRIEND_ACK(f);
  obj.m_iOK = ks.getInt32();
  obj.m_iUnitUID = ks.getInt64();
  return obj;
}

export interface KEGS_UNBLOCK_FRIEND_NOT {
  m_iUnitUID: UidType;
}
export function createKEGS_UNBLOCK_FRIEND_NOT(flags?: FlagInput): KEGS_UNBLOCK_FRIEND_NOT {
  const f = resolveFlags(flags);
  return {
    m_iUnitUID: 0n,
  };
}
export function putKEGS_UNBLOCK_FRIEND_NOT(ks: KSerializer, obj: KEGS_UNBLOCK_FRIEND_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  return true;
}
export function getKEGS_UNBLOCK_FRIEND_NOT(ks: KSerializer, flags?: FlagInput): KEGS_UNBLOCK_FRIEND_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_UNBLOCK_FRIEND_NOT(f);
  obj.m_iUnitUID = ks.getInt64();
  return obj;
}

export interface KEGS_DELETE_FRIEND_ACK {
  m_iOK: Int32;
  m_iUnitUID: UidType;
}
export function createKEGS_DELETE_FRIEND_ACK(flags?: FlagInput): KEGS_DELETE_FRIEND_ACK {
  const f = resolveFlags(flags);
  return {
    m_iOK: 0,
    m_iUnitUID: 0n,
  };
}
export function putKEGS_DELETE_FRIEND_ACK(ks: KSerializer, obj: KEGS_DELETE_FRIEND_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  return true;
}
export function getKEGS_DELETE_FRIEND_ACK(ks: KSerializer, flags?: FlagInput): KEGS_DELETE_FRIEND_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_DELETE_FRIEND_ACK(f);
  obj.m_iOK = ks.getInt32();
  obj.m_iUnitUID = ks.getInt64();
  return obj;
}

export interface KEGS_DELETE_FRIEND_NOT {
  m_iUnitUID: UidType;
}
export function createKEGS_DELETE_FRIEND_NOT(flags?: FlagInput): KEGS_DELETE_FRIEND_NOT {
  const f = resolveFlags(flags);
  return {
    m_iUnitUID: 0n,
  };
}
export function putKEGS_DELETE_FRIEND_NOT(ks: KSerializer, obj: KEGS_DELETE_FRIEND_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  return true;
}
export function getKEGS_DELETE_FRIEND_NOT(ks: KSerializer, flags?: FlagInput): KEGS_DELETE_FRIEND_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_DELETE_FRIEND_NOT(f);
  obj.m_iUnitUID = ks.getInt64();
  return obj;
}

export interface KEGS_MOVE_FRIEND_REQ {
  m_iUnitUID: UidType;
  m_cTargetGroupID: Int8;
}
export function createKEGS_MOVE_FRIEND_REQ(flags?: FlagInput): KEGS_MOVE_FRIEND_REQ {
  const f = resolveFlags(flags);
  return {
    m_iUnitUID: 0n,
    m_cTargetGroupID: 0,
  };
}
export function putKEGS_MOVE_FRIEND_REQ(ks: KSerializer, obj: KEGS_MOVE_FRIEND_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putInt8(obj.m_cTargetGroupID))) return false;
  return true;
}
export function getKEGS_MOVE_FRIEND_REQ(ks: KSerializer, flags?: FlagInput): KEGS_MOVE_FRIEND_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_MOVE_FRIEND_REQ(f);
  obj.m_iUnitUID = ks.getInt64();
  obj.m_cTargetGroupID = ks.getInt8();
  return obj;
}

export interface KEGS_MOVE_FRIEND_ACK {
  m_iOK: Int32;
  m_iUnitUID: UidType;
  m_cTargetGroupID: Int8;
}
export function createKEGS_MOVE_FRIEND_ACK(flags?: FlagInput): KEGS_MOVE_FRIEND_ACK {
  const f = resolveFlags(flags);
  return {
    m_iOK: 0,
    m_iUnitUID: 0n,
    m_cTargetGroupID: 0,
  };
}
export function putKEGS_MOVE_FRIEND_ACK(ks: KSerializer, obj: KEGS_MOVE_FRIEND_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putInt8(obj.m_cTargetGroupID))) return false;
  return true;
}
export function getKEGS_MOVE_FRIEND_ACK(ks: KSerializer, flags?: FlagInput): KEGS_MOVE_FRIEND_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_MOVE_FRIEND_ACK(f);
  obj.m_iOK = ks.getInt32();
  obj.m_iUnitUID = ks.getInt64();
  obj.m_cTargetGroupID = ks.getInt8();
  return obj;
}

export interface KEGS_MAKE_FRIEND_GROUP_REQ {
  m_wstrGroupName: string;
}
export function createKEGS_MAKE_FRIEND_GROUP_REQ(flags?: FlagInput): KEGS_MAKE_FRIEND_GROUP_REQ {
  const f = resolveFlags(flags);
  return {
    m_wstrGroupName: '',
  };
}
export function putKEGS_MAKE_FRIEND_GROUP_REQ(ks: KSerializer, obj: KEGS_MAKE_FRIEND_GROUP_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putWString(obj.m_wstrGroupName))) return false;
  return true;
}
export function getKEGS_MAKE_FRIEND_GROUP_REQ(ks: KSerializer, flags?: FlagInput): KEGS_MAKE_FRIEND_GROUP_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_MAKE_FRIEND_GROUP_REQ(f);
  obj.m_wstrGroupName = ks.getWString();
  return obj;
}

export interface KEGS_MAKE_FRIEND_GROUP_ACK {
  m_iOK: Int32;
  m_cGroupID: Int8;
  m_wstrGroupName: string;
}
export function createKEGS_MAKE_FRIEND_GROUP_ACK(flags?: FlagInput): KEGS_MAKE_FRIEND_GROUP_ACK {
  const f = resolveFlags(flags);
  return {
    m_iOK: 0,
    m_cGroupID: 0,
    m_wstrGroupName: '',
  };
}
export function putKEGS_MAKE_FRIEND_GROUP_ACK(ks: KSerializer, obj: KEGS_MAKE_FRIEND_GROUP_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putInt8(obj.m_cGroupID))) return false;
  if (!(ks.putWString(obj.m_wstrGroupName))) return false;
  return true;
}
export function getKEGS_MAKE_FRIEND_GROUP_ACK(ks: KSerializer, flags?: FlagInput): KEGS_MAKE_FRIEND_GROUP_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_MAKE_FRIEND_GROUP_ACK(f);
  obj.m_iOK = ks.getInt32();
  obj.m_cGroupID = ks.getInt8();
  obj.m_wstrGroupName = ks.getWString();
  return obj;
}

export interface KEGS_RENAME_FRIEND_GROUP_REQ {
  m_cGroupID: Int8;
  m_wstrGroupName: string;
}
export function createKEGS_RENAME_FRIEND_GROUP_REQ(flags?: FlagInput): KEGS_RENAME_FRIEND_GROUP_REQ {
  const f = resolveFlags(flags);
  return {
    m_cGroupID: 0,
    m_wstrGroupName: '',
  };
}
export function putKEGS_RENAME_FRIEND_GROUP_REQ(ks: KSerializer, obj: KEGS_RENAME_FRIEND_GROUP_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt8(obj.m_cGroupID))) return false;
  if (!(ks.putWString(obj.m_wstrGroupName))) return false;
  return true;
}
export function getKEGS_RENAME_FRIEND_GROUP_REQ(ks: KSerializer, flags?: FlagInput): KEGS_RENAME_FRIEND_GROUP_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_RENAME_FRIEND_GROUP_REQ(f);
  obj.m_cGroupID = ks.getInt8();
  obj.m_wstrGroupName = ks.getWString();
  return obj;
}

export interface KEGS_RENAME_FRIEND_GROUP_ACK {
  m_iOK: Int32;
  m_cGroupID: Int8;
  m_wstrGroupName: string;
}
export function createKEGS_RENAME_FRIEND_GROUP_ACK(flags?: FlagInput): KEGS_RENAME_FRIEND_GROUP_ACK {
  const f = resolveFlags(flags);
  return {
    m_iOK: 0,
    m_cGroupID: 0,
    m_wstrGroupName: '',
  };
}
export function putKEGS_RENAME_FRIEND_GROUP_ACK(ks: KSerializer, obj: KEGS_RENAME_FRIEND_GROUP_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putInt8(obj.m_cGroupID))) return false;
  if (!(ks.putWString(obj.m_wstrGroupName))) return false;
  return true;
}
export function getKEGS_RENAME_FRIEND_GROUP_ACK(ks: KSerializer, flags?: FlagInput): KEGS_RENAME_FRIEND_GROUP_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_RENAME_FRIEND_GROUP_ACK(f);
  obj.m_iOK = ks.getInt32();
  obj.m_cGroupID = ks.getInt8();
  obj.m_wstrGroupName = ks.getWString();
  return obj;
}

export interface KEGS_DELETE_FRIEND_GROUP_REQ {
  m_cGroupID: Int8;
}
export function createKEGS_DELETE_FRIEND_GROUP_REQ(flags?: FlagInput): KEGS_DELETE_FRIEND_GROUP_REQ {
  const f = resolveFlags(flags);
  return {
    m_cGroupID: 0,
  };
}
export function putKEGS_DELETE_FRIEND_GROUP_REQ(ks: KSerializer, obj: KEGS_DELETE_FRIEND_GROUP_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt8(obj.m_cGroupID))) return false;
  return true;
}
export function getKEGS_DELETE_FRIEND_GROUP_REQ(ks: KSerializer, flags?: FlagInput): KEGS_DELETE_FRIEND_GROUP_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_DELETE_FRIEND_GROUP_REQ(f);
  obj.m_cGroupID = ks.getInt8();
  return obj;
}

export interface KEGS_DELETE_FRIEND_GROUP_ACK {
  m_iOK: Int32;
  m_cGroupID: Int8;
}
export function createKEGS_DELETE_FRIEND_GROUP_ACK(flags?: FlagInput): KEGS_DELETE_FRIEND_GROUP_ACK {
  const f = resolveFlags(flags);
  return {
    m_iOK: 0,
    m_cGroupID: 0,
  };
}
export function putKEGS_DELETE_FRIEND_GROUP_ACK(ks: KSerializer, obj: KEGS_DELETE_FRIEND_GROUP_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putInt8(obj.m_cGroupID))) return false;
  return true;
}
export function getKEGS_DELETE_FRIEND_GROUP_ACK(ks: KSerializer, flags?: FlagInput): KEGS_DELETE_FRIEND_GROUP_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_DELETE_FRIEND_GROUP_ACK(f);
  obj.m_iOK = ks.getInt32();
  obj.m_cGroupID = ks.getInt8();
  return obj;
}

export const KGuildInfo_GUILD_INFO = {
  GUILD_MAX_MEMBER_LIMIT: 100,
} as const;
export type KGuildInfo_GUILD_INFO = (typeof KGuildInfo_GUILD_INFO)[keyof typeof KGuildInfo_GUILD_INFO];
export function getKGuildInfo_GUILD_INFO(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.GUILD_TEST)) {
    cur = 100;
    out['GUILD_MAX_MEMBER_LIMIT'] = cur;
    cur += 1;
  }
  return out;
}
export interface KGuildInfo {
  m_iGuildUID?: Int32;
  m_wstrGuildName?: string;
  m_usMaxNumMember?: UInt16;
  m_ucGuildLevel?: UInt8;
  m_iGuildEXP?: Int32;
  m_wstrGuildMessage?: string;
  m_wstrFoundingDay?: string;
}
export function createKGuildInfo(flags?: FlagInput): KGuildInfo {
  const f = resolveFlags(flags);
  const obj: KGuildInfo = {
  };
  if (Boolean(f.GUILD_TEST)) obj.m_iGuildUID = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_wstrGuildName = '';
  if (Boolean(f.GUILD_TEST)) obj.m_usMaxNumMember = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_ucGuildLevel = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_iGuildEXP = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_wstrGuildMessage = '';
  if (Boolean(f.GUILD_TEST)) obj.m_wstrFoundingDay = '';
  return obj;
}
export function putKGuildInfo(ks: KSerializer, obj: KGuildInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.GUILD_TEST)) {
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putInt32((obj.m_iGuildUID ?? 0)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putWString((obj.m_wstrGuildName ?? '')))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putUInt16((obj.m_usMaxNumMember ?? 0)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putUInt8((obj.m_ucGuildLevel ?? 0)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putInt32((obj.m_iGuildEXP ?? 0)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putWString((obj.m_wstrGuildMessage ?? '')))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putWString((obj.m_wstrFoundingDay ?? '')))) return false; }
  }
  return true;
}
export function getKGuildInfo(ks: KSerializer, flags?: FlagInput): KGuildInfo {
  const f = resolveFlags(flags);
  const obj = createKGuildInfo(f);
  if (Boolean(f.GUILD_TEST)) {
    if (Boolean(f.GUILD_TEST)) { obj.m_iGuildUID = ks.getInt32(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_wstrGuildName = ks.getWString(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_usMaxNumMember = ks.getUInt16(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_ucGuildLevel = ks.getUInt8(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_iGuildEXP = ks.getInt32(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_wstrGuildMessage = ks.getWString(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_wstrFoundingDay = ks.getWString(); }
  }
  return obj;
}

export interface KGuildMemberInfo {
  m_iGSUID?: UidType;
  m_iUnitUID?: UidType;
  m_wstrNickName?: string;
  m_cUnitClass?: Int8;
  m_ucLevel?: UInt8;
  m_ucMemberShipGrade?: UInt8;
  m_iChannelID?: Int32;
  m_iMapID?: Int32;
  m_cPosition?: Int8;
  m_tLogInTime?: Int64;
  m_tLogOutTime?: Int64;
  m_wstrMessage?: string;
}
export function createKGuildMemberInfo(flags?: FlagInput): KGuildMemberInfo {
  const f = resolveFlags(flags);
  const obj: KGuildMemberInfo = {
  };
  if (Boolean(f.GUILD_TEST)) obj.m_iGSUID = 0n;
  if (Boolean(f.GUILD_TEST)) obj.m_iUnitUID = 0n;
  if (Boolean(f.GUILD_TEST)) obj.m_wstrNickName = '';
  if (Boolean(f.GUILD_TEST)) obj.m_cUnitClass = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_ucLevel = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_ucMemberShipGrade = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_iChannelID = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_iMapID = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_cPosition = -1;
  if (Boolean(f.GUILD_TEST)) obj.m_tLogInTime = 0n;
  if (Boolean(f.GUILD_TEST)) obj.m_tLogOutTime = 0n;
  if (Boolean(f.GUILD_TEST)) obj.m_wstrMessage = '';
  return obj;
}
export function putKGuildMemberInfo(ks: KSerializer, obj: KGuildMemberInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.GUILD_TEST)) {
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putInt64((obj.m_iGSUID ?? 0n)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putInt8((obj.m_cUnitClass ?? 0)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putUInt8((obj.m_ucLevel ?? 0)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putUInt8((obj.m_ucMemberShipGrade ?? 0)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putInt32((obj.m_iChannelID ?? 0)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putInt32((obj.m_iMapID ?? 0)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putInt8((obj.m_cPosition ?? -1)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putInt64((obj.m_tLogInTime ?? 0n)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putInt64((obj.m_tLogOutTime ?? 0n)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putWString((obj.m_wstrMessage ?? '')))) return false; }
  }
  return true;
}
export function getKGuildMemberInfo(ks: KSerializer, flags?: FlagInput): KGuildMemberInfo {
  const f = resolveFlags(flags);
  const obj = createKGuildMemberInfo(f);
  if (Boolean(f.GUILD_TEST)) {
    if (Boolean(f.GUILD_TEST)) { obj.m_iGSUID = ks.getInt64(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_wstrNickName = ks.getWString(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_cUnitClass = ks.getInt8(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_ucLevel = ks.getUInt8(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_ucMemberShipGrade = ks.getUInt8(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_iChannelID = ks.getInt32(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_iMapID = ks.getInt32(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_cPosition = ks.getInt8(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_tLogInTime = ks.getInt64(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_tLogOutTime = ks.getInt64(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_wstrMessage = ks.getWString(); }
  }
  return obj;
}

export interface KGuildMemberMessageInfo {
  m_iUnitUID?: UidType;
  m_wstrNickName?: string;
  m_ucMemberShipGrade?: UInt8;
  m_cUnitClass?: Int8;
  m_ucLevel?: UInt8;
  m_wstrMessage?: string;
}
export function createKGuildMemberMessageInfo(flags?: FlagInput): KGuildMemberMessageInfo {
  const f = resolveFlags(flags);
  const obj: KGuildMemberMessageInfo = {
  };
  if (Boolean(f.GUILD_TEST)) obj.m_iUnitUID = 0n;
  if (Boolean(f.GUILD_TEST)) obj.m_wstrNickName = '';
  if (Boolean(f.GUILD_TEST)) obj.m_ucMemberShipGrade = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_cUnitClass = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_ucLevel = 0;
  if (Boolean(f.GUILD_TEST)) obj.m_wstrMessage = '';
  return obj;
}
export function putKGuildMemberMessageInfo(ks: KSerializer, obj: KGuildMemberMessageInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.GUILD_TEST)) {
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putUInt8((obj.m_ucMemberShipGrade ?? 0)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putInt8((obj.m_cUnitClass ?? 0)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putUInt8((obj.m_ucLevel ?? 0)))) return false; }
    if (Boolean(f.GUILD_TEST)) { if (!(ks.putWString((obj.m_wstrMessage ?? '')))) return false; }
  }
  return true;
}
export function getKGuildMemberMessageInfo(ks: KSerializer, flags?: FlagInput): KGuildMemberMessageInfo {
  const f = resolveFlags(flags);
  const obj = createKGuildMemberMessageInfo(f);
  if (Boolean(f.GUILD_TEST)) {
    if (Boolean(f.GUILD_TEST)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_wstrNickName = ks.getWString(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_ucMemberShipGrade = ks.getUInt8(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_cUnitClass = ks.getInt8(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_ucLevel = ks.getUInt8(); }
    if (Boolean(f.GUILD_TEST)) { obj.m_wstrMessage = ks.getWString(); }
  }
  return obj;
}

export interface KGuildSkillData {
  m_iSkillID?: Int16;
  m_cSkillLevel?: UInt8;
  m_cSkillCSPoint?: UInt8;
}
export function createKGuildSkillData(flags?: FlagInput): KGuildSkillData {
  const f = resolveFlags(flags);
  const obj: KGuildSkillData = {
  };
  if (Boolean(f.GUILD_SKILL_TEST)) obj.m_iSkillID = 0;
  if (Boolean(f.GUILD_SKILL_TEST)) obj.m_cSkillLevel = 0;
  if (Boolean(f.GUILD_SKILL_TEST)) obj.m_cSkillCSPoint = 0;
  return obj;
}
export function putKGuildSkillData(ks: KSerializer, obj: KGuildSkillData, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.GUILD_SKILL_TEST)) {
    if (Boolean(f.GUILD_SKILL_TEST)) { if (!(ks.putInt16((obj.m_iSkillID ?? 0)))) return false; }
    if (Boolean(f.GUILD_SKILL_TEST)) { if (!(ks.putUInt8((obj.m_cSkillLevel ?? 0)))) return false; }
    if (Boolean(f.GUILD_SKILL_TEST)) { if (!(ks.putUInt8((obj.m_cSkillCSPoint ?? 0)))) return false; }
  }
  return true;
}
export function getKGuildSkillData(ks: KSerializer, flags?: FlagInput): KGuildSkillData {
  const f = resolveFlags(flags);
  const obj = createKGuildSkillData(f);
  if (Boolean(f.GUILD_SKILL_TEST)) {
    if (Boolean(f.GUILD_SKILL_TEST)) { obj.m_iSkillID = ks.getInt16(); }
    if (Boolean(f.GUILD_SKILL_TEST)) { obj.m_cSkillLevel = ks.getUInt8(); }
    if (Boolean(f.GUILD_SKILL_TEST)) { obj.m_cSkillCSPoint = ks.getUInt8(); }
  }
  return obj;
}

export interface KGuildSkillInfo {
  m_vecGuildSkill?: KGuildSkillData[];
  m_iGuildSPoint?: Int32;
  m_iGuildCSPoint?: Int32;
  m_iMaxGuildCSPoint?: Int32;
  m_wstrGuildCSPointEndDate?: string;
}
export function createKGuildSkillInfo(flags?: FlagInput): KGuildSkillInfo {
  const f = resolveFlags(flags);
  const obj: KGuildSkillInfo = {
  };
  if (Boolean(f.GUILD_SKILL_TEST)) obj.m_vecGuildSkill = ([] as KGuildSkillData[]);
  if (Boolean(f.GUILD_SKILL_TEST)) obj.m_iGuildSPoint = 0;
  if (Boolean(f.GUILD_SKILL_TEST)) obj.m_iGuildCSPoint = 0;
  if (Boolean(f.GUILD_SKILL_TEST)) obj.m_iMaxGuildCSPoint = 0;
  if (Boolean(f.GUILD_SKILL_TEST)) obj.m_wstrGuildCSPointEndDate = '';
  return obj;
}
export function putKGuildSkillInfo(ks: KSerializer, obj: KGuildSkillInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.GUILD_SKILL_TEST)) {
    if (Boolean(f.GUILD_SKILL_TEST)) { if (!(ks.putVector((obj.m_vecGuildSkill ?? ([] as KGuildSkillData[])), (ks, item: KGuildSkillData) => ks.putUserClass(item, putKGuildSkillData, f)))) return false; }
    if (Boolean(f.GUILD_SKILL_TEST)) { if (!(ks.putInt32((obj.m_iGuildSPoint ?? 0)))) return false; }
    if (Boolean(f.GUILD_SKILL_TEST)) { if (!(ks.putInt32((obj.m_iGuildCSPoint ?? 0)))) return false; }
    if (Boolean(f.GUILD_SKILL_TEST)) { if (!(ks.putInt32((obj.m_iMaxGuildCSPoint ?? 0)))) return false; }
    if (Boolean(f.GUILD_SKILL_TEST)) { if (!(ks.putWString((obj.m_wstrGuildCSPointEndDate ?? '')))) return false; }
  }
  return true;
}
export function getKGuildSkillInfo(ks: KSerializer, flags?: FlagInput): KGuildSkillInfo {
  const f = resolveFlags(flags);
  const obj = createKGuildSkillInfo(f);
  if (Boolean(f.GUILD_SKILL_TEST)) {
    if (Boolean(f.GUILD_SKILL_TEST)) { obj.m_vecGuildSkill = ks.getVector<KGuildSkillData>((ks) => ks.getUserClass(getKGuildSkillData, f)); }
    if (Boolean(f.GUILD_SKILL_TEST)) { obj.m_iGuildSPoint = ks.getInt32(); }
    if (Boolean(f.GUILD_SKILL_TEST)) { obj.m_iGuildCSPoint = ks.getInt32(); }
    if (Boolean(f.GUILD_SKILL_TEST)) { obj.m_iMaxGuildCSPoint = ks.getInt32(); }
    if (Boolean(f.GUILD_SKILL_TEST)) { obj.m_wstrGuildCSPointEndDate = ks.getWString(); }
  }
  return obj;
}

export interface KEGS_GUILD_INFO_NOT {
  m_kGuildInfo: KGuildInfo;
  m_wstrGuildMasterName: string;
  m_vecMemberUnitUID: UidType[];
  m_kGuildSkillInfo?: KGuildSkillInfo;
}
export function createKEGS_GUILD_INFO_NOT(flags?: FlagInput): KEGS_GUILD_INFO_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_GUILD_INFO_NOT = {
    m_kGuildInfo: createKGuildInfo(f),
    m_wstrGuildMasterName: '',
    m_vecMemberUnitUID: ([] as UidType[]),
  };
  if (Boolean(f.GUILD_SKILL_TEST)) obj.m_kGuildSkillInfo = createKGuildSkillInfo(f);
  return obj;
}
export function putKEGS_GUILD_INFO_NOT(ks: KSerializer, obj: KEGS_GUILD_INFO_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putUserClass(obj.m_kGuildInfo, putKGuildInfo, f))) return false;
  if (!(ks.putWString(obj.m_wstrGuildMasterName))) return false;
  if (!(ks.putVector(obj.m_vecMemberUnitUID, (ks, item: UidType) => ks.putInt64(item)))) return false;
  if (Boolean(f.GUILD_SKILL_TEST)) { if (!(ks.putUserClass((obj.m_kGuildSkillInfo ?? createKGuildSkillInfo(f)), putKGuildSkillInfo, f))) return false; }
  return true;
}
export function getKEGS_GUILD_INFO_NOT(ks: KSerializer, flags?: FlagInput): KEGS_GUILD_INFO_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_GUILD_INFO_NOT(f);
  obj.m_kGuildInfo = ks.getUserClass(getKGuildInfo, f);
  obj.m_wstrGuildMasterName = ks.getWString();
  obj.m_vecMemberUnitUID = ks.getVector<UidType>((ks) => ks.getInt64());
  if (Boolean(f.GUILD_SKILL_TEST)) { obj.m_kGuildSkillInfo = ks.getUserClass(getKGuildSkillInfo, f); }
  return obj;
}

export interface KUserConnectTimeEventInfo {
  m_iEventID: Int32;
  m_fEventTime: Float32;
  m_kCTime: Int64;
  m_wstrEventName: string;
  m_bInit: boolean;
  m_bGiveOnce: boolean;
  m_bAccountEvent?: boolean;
  m_fBackUpTime?: Float64;
  m_bRepeatEvent?: boolean;
  m_iScriptID?: Int32;
  m_bRepeatRewardEvent?: boolean;
  m_iBeforeEventID?: Int32;
  m_bNewUnit?: boolean;
  m_bNewUnit2?: boolean;
  m_bCurrentUnit?: boolean;
  m_iEventItemID?: Int32;
  m_iCustomEventID?: Int32;
  m_bOnlySteamUser?: boolean;
  m_bOnlyNotSteamUser?: boolean;
}
export function createKUserConnectTimeEventInfo(flags?: FlagInput): KUserConnectTimeEventInfo {
  const f = resolveFlags(flags);
  const obj: KUserConnectTimeEventInfo = {
    m_iEventID: 0,
    m_fEventTime: 0.0,
    m_kCTime: 0n,
    m_wstrEventName: '',
    m_bInit: false,
    m_bGiveOnce: true,
  };
  if (Boolean(f.SERV_ACC_TIME_EVENT)) obj.m_bAccountEvent = false;
  if (Boolean(f.SERV_TIME_EVENT_BUG_FIX)) obj.m_fBackUpTime = 0.0;
  if (Boolean(f.SERV_REPEAT_CONNECT__REWARD_ITEM_EVENT)) obj.m_bRepeatEvent = false;
  if (Boolean(f.SERV_ARCHUANGEL_S_COIN_EVENT_GUIDE)) obj.m_iScriptID = 0;
  if (Boolean(f.SERV_CONNECT_EVENT_CONSECUTIVELY_REWARD)) obj.m_bRepeatRewardEvent = false;
  if (Boolean(f.SERV_CONNECT_EVENT_CONSECUTIVELY_REWARD)) obj.m_iBeforeEventID = -1;
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) obj.m_bNewUnit = false;
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) obj.m_bNewUnit2 = false;
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) obj.m_bCurrentUnit = false;
  if (Boolean(f.SERV_ITEM_IN_INVENTORY_CONNECT_EVENT)) obj.m_iEventItemID = 0;
  if (Boolean(f.SERV_CUSTOM_CONNECT_EVENT)) obj.m_iCustomEventID = 0;
  if (Boolean(f.SERV_STEAM_USER_CONNECT_EVENT)) obj.m_bOnlySteamUser = false;
  if (Boolean(f.SERV_STEAM_USER_CONNECT_EVENT)) obj.m_bOnlyNotSteamUser = false;
  return obj;
}
export function putKUserConnectTimeEventInfo(ks: KSerializer, obj: KUserConnectTimeEventInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iEventID))) return false;
  if (!(ks.putFloat32(obj.m_fEventTime))) return false;
  if (!(ks.putInt64(obj.m_kCTime))) return false;
  if (!(ks.putWString(obj.m_wstrEventName))) return false;
  if (!(ks.putBool(obj.m_bInit))) return false;
  if (!(ks.putBool(obj.m_bGiveOnce))) return false;
  if (Boolean(f.SERV_ACC_TIME_EVENT)) { if (!(ks.putBool((obj.m_bAccountEvent ?? false)))) return false; }
  if (Boolean(f.SERV_TIME_EVENT_BUG_FIX)) { if (!(ks.putFloat64((obj.m_fBackUpTime ?? 0.0)))) return false; }
  if (Boolean(f.SERV_ARCHUANGEL_S_COIN_EVENT_GUIDE)) { if (!(ks.putInt32((obj.m_iScriptID ?? 0)))) return false; }
  if (Boolean(f.SERV_CONNECT_EVENT_CONSECUTIVELY_REWARD)) { if (!(ks.putBool((obj.m_bRepeatRewardEvent ?? false)))) return false; }
  if (Boolean(f.SERV_CONNECT_EVENT_CONSECUTIVELY_REWARD)) { if (!(ks.putInt32((obj.m_iBeforeEventID ?? -1)))) return false; }
  if (Boolean(f.SERV_ITEM_IN_INVENTORY_CONNECT_EVENT)) { if (!(ks.putInt32((obj.m_iEventItemID ?? 0)))) return false; }
  if (Boolean(f.SERV_CUSTOM_CONNECT_EVENT)) { if (!(ks.putInt32((obj.m_iCustomEventID ?? 0)))) return false; }
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) { if (!(ks.putBool((obj.m_bNewUnit ?? false)))) return false; }
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) { if (!(ks.putBool((obj.m_bNewUnit2 ?? false)))) return false; }
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) { if (!(ks.putBool((obj.m_bCurrentUnit ?? false)))) return false; }
  if (Boolean(f.SERV_STEAM_USER_CONNECT_EVENT)) { if (!(ks.putBool((obj.m_bOnlySteamUser ?? false)))) return false; }
  if (Boolean(f.SERV_STEAM_USER_CONNECT_EVENT)) { if (!(ks.putBool((obj.m_bOnlyNotSteamUser ?? false)))) return false; }
  return true;
}
export function getKUserConnectTimeEventInfo(ks: KSerializer, flags?: FlagInput): KUserConnectTimeEventInfo {
  const f = resolveFlags(flags);
  const obj = createKUserConnectTimeEventInfo(f);
  obj.m_iEventID = ks.getInt32();
  obj.m_fEventTime = ks.getFloat32();
  obj.m_kCTime = ks.getInt64();
  obj.m_wstrEventName = ks.getWString();
  obj.m_bInit = ks.getBool();
  obj.m_bGiveOnce = ks.getBool();
  if (Boolean(f.SERV_ACC_TIME_EVENT)) { obj.m_bAccountEvent = ks.getBool(); }
  if (Boolean(f.SERV_TIME_EVENT_BUG_FIX)) { obj.m_fBackUpTime = ks.getFloat64(); }
  if (Boolean(f.SERV_ARCHUANGEL_S_COIN_EVENT_GUIDE)) { obj.m_iScriptID = ks.getInt32(); }
  if (Boolean(f.SERV_CONNECT_EVENT_CONSECUTIVELY_REWARD)) { obj.m_bRepeatRewardEvent = ks.getBool(); }
  if (Boolean(f.SERV_CONNECT_EVENT_CONSECUTIVELY_REWARD)) { obj.m_iBeforeEventID = ks.getInt32(); }
  if (Boolean(f.SERV_ITEM_IN_INVENTORY_CONNECT_EVENT)) { obj.m_iEventItemID = ks.getInt32(); }
  if (Boolean(f.SERV_CUSTOM_CONNECT_EVENT)) { obj.m_iCustomEventID = ks.getInt32(); }
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) { obj.m_bNewUnit = ks.getBool(); }
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) { obj.m_bNewUnit2 = ks.getBool(); }
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) { obj.m_bCurrentUnit = ks.getBool(); }
  if (Boolean(f.SERV_STEAM_USER_CONNECT_EVENT)) { obj.m_bOnlySteamUser = ks.getBool(); }
  if (Boolean(f.SERV_STEAM_USER_CONNECT_EVENT)) { obj.m_bOnlyNotSteamUser = ks.getBool(); }
  return obj;
}

export interface KUserCumulativeTimeEventInfo {
  m_iEventUID: Int32;
  m_iEventID: Int32;
  m_bInit: boolean;
  m_wstrEventName: string;
  m_fEventTime: Float32;
  m_bDirectReward: boolean;
  m_bAccountEvent?: boolean;
  m_iCustomEventID?: Int32;
  m_bNewUnitEvent?: boolean;
  m_bNewUnitEvent2?: boolean;
  m_bCurrentUnitEvent?: boolean;
}
export function createKUserCumulativeTimeEventInfo(flags?: FlagInput): KUserCumulativeTimeEventInfo {
  const f = resolveFlags(flags);
  const obj: KUserCumulativeTimeEventInfo = {
    m_iEventUID: 0,
    m_iEventID: 0,
    m_bInit: false,
    m_wstrEventName: '',
    m_fEventTime: 0.0,
    m_bDirectReward: false,
  };
  if (Boolean(f.SERV_ACC_TIME_EVENT)) obj.m_bAccountEvent = false;
  if (Boolean(f.SERV_CUSTOM_CONNECT_EVENT)) obj.m_iCustomEventID = 0;
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) obj.m_bNewUnitEvent = false;
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) obj.m_bNewUnitEvent2 = false;
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) obj.m_bCurrentUnitEvent = false;
  return obj;
}
export function putKUserCumulativeTimeEventInfo(ks: KSerializer, obj: KUserCumulativeTimeEventInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iEventUID))) return false;
  if (!(ks.putInt32(obj.m_iEventID))) return false;
  if (!(ks.putBool(obj.m_bInit))) return false;
  if (!(ks.putWString(obj.m_wstrEventName))) return false;
  if (!(ks.putFloat32(obj.m_fEventTime))) return false;
  if (!(ks.putBool(obj.m_bDirectReward))) return false;
  if (Boolean(f.SERV_ACC_TIME_EVENT)) { if (!(ks.putBool((obj.m_bAccountEvent ?? false)))) return false; }
  if (Boolean(f.SERV_CUSTOM_CONNECT_EVENT)) { if (!(ks.putInt32((obj.m_iCustomEventID ?? 0)))) return false; }
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) { if (!(ks.putBool((obj.m_bNewUnitEvent ?? false)))) return false; }
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) { if (!(ks.putBool((obj.m_bNewUnitEvent2 ?? false)))) return false; }
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) { if (!(ks.putBool((obj.m_bCurrentUnitEvent ?? false)))) return false; }
  return true;
}
export function getKUserCumulativeTimeEventInfo(ks: KSerializer, flags?: FlagInput): KUserCumulativeTimeEventInfo {
  const f = resolveFlags(flags);
  const obj = createKUserCumulativeTimeEventInfo(f);
  obj.m_iEventUID = ks.getInt32();
  obj.m_iEventID = ks.getInt32();
  obj.m_bInit = ks.getBool();
  obj.m_wstrEventName = ks.getWString();
  obj.m_fEventTime = ks.getFloat32();
  obj.m_bDirectReward = ks.getBool();
  if (Boolean(f.SERV_ACC_TIME_EVENT)) { obj.m_bAccountEvent = ks.getBool(); }
  if (Boolean(f.SERV_CUSTOM_CONNECT_EVENT)) { obj.m_iCustomEventID = ks.getInt32(); }
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) { obj.m_bNewUnitEvent = ks.getBool(); }
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) { obj.m_bNewUnitEvent2 = ks.getBool(); }
  if (Boolean(f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR)) { obj.m_bCurrentUnitEvent = ks.getBool(); }
  return obj;
}

export interface KTimeEventSimpleInfo {
  m_iEventUID: Int32;
  m_iEventID: Int32;
  m_wstrEventName: string;
  m_fEventTime: Float32;
  m_wstrAdvertisementURL?: string;
}
export function createKTimeEventSimpleInfo(flags?: FlagInput): KTimeEventSimpleInfo {
  const f = resolveFlags(flags);
  const obj: KTimeEventSimpleInfo = {
    m_iEventUID: 0,
    m_iEventID: 0,
    m_wstrEventName: '',
    m_fEventTime: 0.0,
  };
  if (Boolean(f.SERV_ADVERTISEMENT_EVENT)) obj.m_wstrAdvertisementURL = '';
  return obj;
}
export function putKTimeEventSimpleInfo(ks: KSerializer, obj: KTimeEventSimpleInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iEventUID))) return false;
  if (!(ks.putInt32(obj.m_iEventID))) return false;
  if (!(ks.putWString(obj.m_wstrEventName))) return false;
  if (!(ks.putFloat32(obj.m_fEventTime))) return false;
  if (Boolean(f.SERV_ADVERTISEMENT_EVENT)) { if (!(ks.putWString((obj.m_wstrAdvertisementURL ?? '')))) return false; }
  return true;
}
export function getKTimeEventSimpleInfo(ks: KSerializer, flags?: FlagInput): KTimeEventSimpleInfo {
  const f = resolveFlags(flags);
  const obj = createKTimeEventSimpleInfo(f);
  obj.m_iEventUID = ks.getInt32();
  obj.m_iEventID = ks.getInt32();
  obj.m_wstrEventName = ks.getWString();
  obj.m_fEventTime = ks.getFloat32();
  if (Boolean(f.SERV_ADVERTISEMENT_EVENT)) { obj.m_wstrAdvertisementURL = ks.getWString(); }
  return obj;
}

export interface KDailyGiftBoxInfo {
  m_iUnitUID?: UidType;
  m_iState?: UInt8;
  m_wstrRegDate?: string;
}
export function createKDailyGiftBoxInfo(flags?: FlagInput): KDailyGiftBoxInfo {
  const f = resolveFlags(flags);
  const obj: KDailyGiftBoxInfo = {
  };
  if (Boolean(f.SERV_EVENT_DAILY_GIFT_BOX)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_EVENT_DAILY_GIFT_BOX)) obj.m_iState = 0;
  if (Boolean(f.SERV_EVENT_DAILY_GIFT_BOX)) obj.m_wstrRegDate = '';
  return obj;
}
export function putKDailyGiftBoxInfo(ks: KSerializer, obj: KDailyGiftBoxInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_DAILY_GIFT_BOX)) {
    if (Boolean(f.SERV_EVENT_DAILY_GIFT_BOX)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_EVENT_DAILY_GIFT_BOX)) { if (!(ks.putUInt8((obj.m_iState ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DAILY_GIFT_BOX)) { if (!(ks.putWString((obj.m_wstrRegDate ?? '')))) return false; }
  }
  return true;
}
export function getKDailyGiftBoxInfo(ks: KSerializer, flags?: FlagInput): KDailyGiftBoxInfo {
  const f = resolveFlags(flags);
  const obj = createKDailyGiftBoxInfo(f);
  if (Boolean(f.SERV_EVENT_DAILY_GIFT_BOX)) {
    if (Boolean(f.SERV_EVENT_DAILY_GIFT_BOX)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_EVENT_DAILY_GIFT_BOX)) { obj.m_iState = ks.getUInt8(); }
    if (Boolean(f.SERV_EVENT_DAILY_GIFT_BOX)) { obj.m_wstrRegDate = ks.getWString(); }
  }
  return obj;
}

export interface KChannelChangeInfo {
  m_mapEventDurationTime: Map<Int32, KUserConnectTimeEventInfo> | Map<Int32, Float64>;
  m_iEquippedTitleID?: Int32;
  m_sEquippedTitleID?: Int16;
  m_bIsPcBang: boolean;
  m_iPcBangType?: Int32;
  m_vecPcBangItemInfo: KInventoryItemInfo[];
  m_mmapDailyGiftBoxList?: Array<[Int32, KDailyGiftBoxInfo]>;
  m_wstrWinterVacationEventRegDate?: string;
  m_iWinterVacationEventCount?: Int32;
  m_nUnitSlot?: Int32;
  m_iSummonedRidingPetUID?: UidType;
  m_ButtonStartUI?: boolean;
  m_DungeonClearUI?: boolean;
  m_FieldCountUI?: boolean;
  m_DungeonCount?: Int32;
  m_FieldMonsterKillCount?: Int32;
  m_wstrButtonClickTime?: string;
  m_RemaindTime?: Int32;
  m_bCoboItemGive?: boolean;
  m_mapGlobalEventData?: Map<Int32, KGlobalEventTableData>;
}
export function createKChannelChangeInfo(flags?: FlagInput): KChannelChangeInfo {
  const f = resolveFlags(flags);
  const obj: KChannelChangeInfo = {
    m_mapEventDurationTime: (Boolean(f.SERV_TIME_EVENT_BUG_FIX)) ? new Map<Int32, KUserConnectTimeEventInfo>() : new Map<Int32, Float64>(),
    m_bIsPcBang: false,
    m_vecPcBangItemInfo: ([] as KInventoryItemInfo[]),
  };
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) obj.m_iEquippedTitleID = 0;
  if (!f.SERV_TITLE_DATA_SIZE) obj.m_sEquippedTitleID = 0;
  if (Boolean(f.SERV_PC_BANG_TYPE)) obj.m_iPcBangType = -1;
  if (Boolean(f.SERV_EVENT_DAILY_GIFT_BOX)) obj.m_mmapDailyGiftBoxList = ([] as Array<[Int32, KDailyGiftBoxInfo]>);
  if (Boolean(f.SERV_2012_WINTER_VACATION_EVENT)) obj.m_wstrWinterVacationEventRegDate = '';
  if (Boolean(f.SERV_2012_WINTER_VACATION_EVENT)) obj.m_iWinterVacationEventCount = -1;
  if (Boolean(f.SERV_CHANNEL_CHANGE_BUG_FIX)) obj.m_nUnitSlot = 0;
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) obj.m_iSummonedRidingPetUID = 0n;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_ButtonStartUI = false;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_DungeonClearUI = false;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_FieldCountUI = false;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_DungeonCount = 0;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_FieldMonsterKillCount = 0;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_wstrButtonClickTime = '1900-01-01 00:00:00';
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_RemaindTime = 0;
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) obj.m_bCoboItemGive = false;
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) obj.m_mapGlobalEventData = new Map<Int32, KGlobalEventTableData>();
  return obj;
}
export function putKChannelChangeInfo(ks: KSerializer, obj: KChannelChangeInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_TIME_EVENT_BUG_FIX)) { if (!(ks.putMap((obj.m_mapEventDurationTime as Map<Int32, KUserConnectTimeEventInfo>), (ks, k: Int32) => ks.putInt32(k), (ks, v: KUserConnectTimeEventInfo) => ks.putUserClass(v, putKUserConnectTimeEventInfo, f)))) return false; }
  else if (!f.SERV_TIME_EVENT_BUG_FIX) { if (!(ks.putMap((obj.m_mapEventDurationTime as Map<Int32, Float64>), (ks, k: Int32) => ks.putInt32(k), (ks, v: Float64) => ks.putFloat64(v)))) return false; }
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) { if (!(ks.putInt32((obj.m_iEquippedTitleID ?? 0)))) return false; }
  if (!f.SERV_TITLE_DATA_SIZE) { if (!(ks.putInt16((obj.m_sEquippedTitleID ?? 0)))) return false; }
  if (!(ks.putBool(obj.m_bIsPcBang))) return false;
  if (Boolean(f.SERV_PC_BANG_TYPE)) { if (!(ks.putInt32((obj.m_iPcBangType ?? -1)))) return false; }
  if (!(ks.putVector(obj.m_vecPcBangItemInfo, (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false;
  if (Boolean(f.SERV_EVENT_DAILY_GIFT_BOX)) { if (!(ks.putMultiMap((obj.m_mmapDailyGiftBoxList ?? ([] as Array<[Int32, KDailyGiftBoxInfo]>)), (ks, k: Int32) => ks.putInt32(k), (ks, v: KDailyGiftBoxInfo) => ks.putUserClass(v, putKDailyGiftBoxInfo, f)))) return false; }
  if (Boolean(f.SERV_2012_WINTER_VACATION_EVENT)) { if (!(ks.putWString((obj.m_wstrWinterVacationEventRegDate ?? '')))) return false; }
  if (Boolean(f.SERV_2012_WINTER_VACATION_EVENT)) { if (!(ks.putInt32((obj.m_iWinterVacationEventCount ?? -1)))) return false; }
  if (Boolean(f.SERV_CHANNEL_CHANGE_BUG_FIX)) { if (!(ks.putInt32((obj.m_nUnitSlot ?? 0)))) return false; }
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) { if (!(ks.putInt64((obj.m_iSummonedRidingPetUID ?? 0n)))) return false; }
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putBool((obj.m_ButtonStartUI ?? false)))) return false; }
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putBool((obj.m_DungeonClearUI ?? false)))) return false; }
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putBool((obj.m_FieldCountUI ?? false)))) return false; }
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putInt32((obj.m_DungeonCount ?? 0)))) return false; }
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putInt32((obj.m_FieldMonsterKillCount ?? 0)))) return false; }
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putWString((obj.m_wstrButtonClickTime ?? '1900-01-01 00:00:00')))) return false; }
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putInt32((obj.m_RemaindTime ?? 0)))) return false; }
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { if (!(ks.putBool((obj.m_bCoboItemGive ?? false)))) return false; }
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { if (!(ks.putMap((obj.m_mapGlobalEventData ?? new Map<Int32, KGlobalEventTableData>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: KGlobalEventTableData) => ks.putUserClass(v, putKGlobalEventTableData, f)))) return false; }
  return true;
}
export function getKChannelChangeInfo(ks: KSerializer, flags?: FlagInput): KChannelChangeInfo {
  const f = resolveFlags(flags);
  const obj = createKChannelChangeInfo(f);
  if (Boolean(f.SERV_TIME_EVENT_BUG_FIX)) { obj.m_mapEventDurationTime = ks.getMap<Int32, KUserConnectTimeEventInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKUserConnectTimeEventInfo, f)); }
  else if (!f.SERV_TIME_EVENT_BUG_FIX) { obj.m_mapEventDurationTime = ks.getMap<Int32, Float64>((ks) => ks.getInt32(), (ks) => ks.getFloat64()); }
  if (Boolean(f.SERV_TITLE_DATA_SIZE)) { obj.m_iEquippedTitleID = ks.getInt32(); }
  if (!f.SERV_TITLE_DATA_SIZE) { obj.m_sEquippedTitleID = ks.getInt16(); }
  obj.m_bIsPcBang = ks.getBool();
  if (Boolean(f.SERV_PC_BANG_TYPE)) { obj.m_iPcBangType = ks.getInt32(); }
  obj.m_vecPcBangItemInfo = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f));
  if (Boolean(f.SERV_EVENT_DAILY_GIFT_BOX)) { obj.m_mmapDailyGiftBoxList = ks.getMultiMap<Int32, KDailyGiftBoxInfo>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKDailyGiftBoxInfo, f)); }
  if (Boolean(f.SERV_2012_WINTER_VACATION_EVENT)) { obj.m_wstrWinterVacationEventRegDate = ks.getWString(); }
  if (Boolean(f.SERV_2012_WINTER_VACATION_EVENT)) { obj.m_iWinterVacationEventCount = ks.getInt32(); }
  if (Boolean(f.SERV_CHANNEL_CHANGE_BUG_FIX)) { obj.m_nUnitSlot = ks.getInt32(); }
  if (Boolean(f.SERV_RIDING_PET_SYSTM)) { obj.m_iSummonedRidingPetUID = ks.getInt64(); }
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_ButtonStartUI = ks.getBool(); }
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_DungeonClearUI = ks.getBool(); }
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_FieldCountUI = ks.getBool(); }
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_DungeonCount = ks.getInt32(); }
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_FieldMonsterKillCount = ks.getInt32(); }
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_wstrButtonClickTime = ks.getWString(); }
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_RemaindTime = ks.getInt32(); }
  if (Boolean(f.SERV_EVENT_COBO_DUNGEON_AND_FIELD)) { obj.m_bCoboItemGive = ks.getBool(); }
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { obj.m_mapGlobalEventData = ks.getMap<Int32, KGlobalEventTableData>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKGlobalEventTableData, f)); }
  return obj;
}

export interface KCCUInfo {
  m_iCCUTime: Int64;
  m_iCCUCount: Int32;
}
export function createKCCUInfo(flags?: FlagInput): KCCUInfo {
  const f = resolveFlags(flags);
  return {
    m_iCCUTime: 0n,
    m_iCCUCount: 0,
  };
}
export function putKCCUInfo(ks: KSerializer, obj: KCCUInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iCCUTime))) return false;
  if (!(ks.putInt32(obj.m_iCCUCount))) return false;
  return true;
}
export function getKCCUInfo(ks: KSerializer, flags?: FlagInput): KCCUInfo {
  const f = resolveFlags(flags);
  const obj = createKCCUInfo(f);
  obj.m_iCCUTime = ks.getInt64();
  obj.m_iCCUCount = ks.getInt32();
  return obj;
}

export const KE_TOOL_GET_CCU_INFO_REQ_CCU_TYPE = {
  CT_TODAY: 0,
  CT_YESTERDAY: 1,
  CT_DATE: 2,
  CT_NOWTIME: 3,
} as const;
export type KE_TOOL_GET_CCU_INFO_REQ_CCU_TYPE = (typeof KE_TOOL_GET_CCU_INFO_REQ_CCU_TYPE)[keyof typeof KE_TOOL_GET_CCU_INFO_REQ_CCU_TYPE];
export interface KE_TOOL_GET_CCU_INFO_REQ {
  m_cCCUType: Int8;
  m_iServerUID: UidType;
  m_wstrDate: string;
}
export function createKE_TOOL_GET_CCU_INFO_REQ(flags?: FlagInput): KE_TOOL_GET_CCU_INFO_REQ {
  const f = resolveFlags(flags);
  return {
    m_cCCUType: 0,
    m_iServerUID: 0n,
    m_wstrDate: '',
  };
}
export function putKE_TOOL_GET_CCU_INFO_REQ(ks: KSerializer, obj: KE_TOOL_GET_CCU_INFO_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt8(obj.m_cCCUType))) return false;
  if (!(ks.putInt64(obj.m_iServerUID))) return false;
  if (!(ks.putWString(obj.m_wstrDate))) return false;
  return true;
}
export function getKE_TOOL_GET_CCU_INFO_REQ(ks: KSerializer, flags?: FlagInput): KE_TOOL_GET_CCU_INFO_REQ {
  const f = resolveFlags(flags);
  const obj = createKE_TOOL_GET_CCU_INFO_REQ(f);
  obj.m_cCCUType = ks.getInt8();
  obj.m_iServerUID = ks.getInt64();
  obj.m_wstrDate = ks.getWString();
  return obj;
}

export interface KE_TOOL_GET_CCU_INFO_ACK {
  m_iOK: Int32;
  m_cCCUType: Int8;
  m_iServerUID: UidType;
  m_wstrDate: string;
  m_vecCCUInfo: KCCUInfo[];
}
export function createKE_TOOL_GET_CCU_INFO_ACK(flags?: FlagInput): KE_TOOL_GET_CCU_INFO_ACK {
  const f = resolveFlags(flags);
  return {
    m_iOK: 0,
    m_cCCUType: 0,
    m_iServerUID: 0n,
    m_wstrDate: '',
    m_vecCCUInfo: ([] as KCCUInfo[]),
  };
}
export function putKE_TOOL_GET_CCU_INFO_ACK(ks: KSerializer, obj: KE_TOOL_GET_CCU_INFO_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putInt8(obj.m_cCCUType))) return false;
  if (!(ks.putInt64(obj.m_iServerUID))) return false;
  if (!(ks.putWString(obj.m_wstrDate))) return false;
  if (!(ks.putVector(obj.m_vecCCUInfo, (ks, item: KCCUInfo) => ks.putUserClass(item, putKCCUInfo, f)))) return false;
  return true;
}
export function getKE_TOOL_GET_CCU_INFO_ACK(ks: KSerializer, flags?: FlagInput): KE_TOOL_GET_CCU_INFO_ACK {
  const f = resolveFlags(flags);
  const obj = createKE_TOOL_GET_CCU_INFO_ACK(f);
  obj.m_iOK = ks.getInt32();
  obj.m_cCCUType = ks.getInt8();
  obj.m_iServerUID = ks.getInt64();
  obj.m_wstrDate = ks.getWString();
  obj.m_vecCCUInfo = ks.getVector<KCCUInfo>((ks) => ks.getUserClass(getKCCUInfo, f));
  return obj;
}

export interface KGuildAdInfo {
  m_iGuildUID: Int32;
  m_wstrGuildName: string;
  m_ucGuildLevel: UInt8;
  m_iGuildEXP: Int32;
  m_wstrMasterNickName: string;
  m_usCurNumMember: UInt16;
  m_wstrAdMessage: string;
  m_wstrFoundingDay: string;
  m_wstrAdRegDate: string;
  m_wstrAdEndDate: string;
}
export function createKGuildAdInfo(flags?: FlagInput): KGuildAdInfo {
  const f = resolveFlags(flags);
  return {
    m_iGuildUID: 0,
    m_wstrGuildName: '',
    m_ucGuildLevel: 0,
    m_iGuildEXP: 0,
    m_wstrMasterNickName: '',
    m_usCurNumMember: 0,
    m_wstrAdMessage: '',
    m_wstrFoundingDay: '',
    m_wstrAdRegDate: '',
    m_wstrAdEndDate: '',
  };
}
export function putKGuildAdInfo(ks: KSerializer, obj: KGuildAdInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iGuildUID))) return false;
  if (!(ks.putWString(obj.m_wstrGuildName))) return false;
  if (!(ks.putUInt8(obj.m_ucGuildLevel))) return false;
  if (!(ks.putInt32(obj.m_iGuildEXP))) return false;
  if (!(ks.putWString(obj.m_wstrMasterNickName))) return false;
  if (!(ks.putUInt16(obj.m_usCurNumMember))) return false;
  if (!(ks.putWString(obj.m_wstrAdMessage))) return false;
  if (!(ks.putWString(obj.m_wstrFoundingDay))) return false;
  if (!(ks.putWString(obj.m_wstrAdRegDate))) return false;
  if (!(ks.putWString(obj.m_wstrAdEndDate))) return false;
  return true;
}
export function getKGuildAdInfo(ks: KSerializer, flags?: FlagInput): KGuildAdInfo {
  const f = resolveFlags(flags);
  const obj = createKGuildAdInfo(f);
  obj.m_iGuildUID = ks.getInt32();
  obj.m_wstrGuildName = ks.getWString();
  obj.m_ucGuildLevel = ks.getUInt8();
  obj.m_iGuildEXP = ks.getInt32();
  obj.m_wstrMasterNickName = ks.getWString();
  obj.m_usCurNumMember = ks.getUInt16();
  obj.m_wstrAdMessage = ks.getWString();
  obj.m_wstrFoundingDay = ks.getWString();
  obj.m_wstrAdRegDate = ks.getWString();
  obj.m_wstrAdEndDate = ks.getWString();
  return obj;
}

export interface KApplyJoinGuildInfo {
  m_iApplyJoinGuildUID: Int32;
  m_iUnitUID: UidType;
  m_wstrNickName: string;
  m_cUnitClass: Int8;
  m_ucLevel: UInt8;
  m_wstrMessage: string;
  m_wstrRegDate: string;
  m_tRegDate: Int64;
}
export function createKApplyJoinGuildInfo(flags?: FlagInput): KApplyJoinGuildInfo {
  const f = resolveFlags(flags);
  return {
    m_iApplyJoinGuildUID: 0,
    m_iUnitUID: 0n,
    m_wstrNickName: '',
    m_cUnitClass: 0,
    m_ucLevel: 0,
    m_wstrMessage: '',
    m_wstrRegDate: '',
    m_tRegDate: 0n,
  };
}
export function putKApplyJoinGuildInfo(ks: KSerializer, obj: KApplyJoinGuildInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iApplyJoinGuildUID))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (!(ks.putInt8(obj.m_cUnitClass))) return false;
  if (!(ks.putUInt8(obj.m_ucLevel))) return false;
  if (!(ks.putWString(obj.m_wstrMessage))) return false;
  if (!(ks.putWString(obj.m_wstrRegDate))) return false;
  if (!(ks.putInt64(obj.m_tRegDate))) return false;
  return true;
}
export function getKApplyJoinGuildInfo(ks: KSerializer, flags?: FlagInput): KApplyJoinGuildInfo {
  const f = resolveFlags(flags);
  const obj = createKApplyJoinGuildInfo(f);
  obj.m_iApplyJoinGuildUID = ks.getInt32();
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  obj.m_cUnitClass = ks.getInt8();
  obj.m_ucLevel = ks.getUInt8();
  obj.m_wstrMessage = ks.getWString();
  obj.m_wstrRegDate = ks.getWString();
  obj.m_tRegDate = ks.getInt64();
  return obj;
}

export interface KApplyDeleteInfo {
  m_iGuildUID: Int32;
  m_iUnitUID: UidType;
}
export function createKApplyDeleteInfo(flags?: FlagInput): KApplyDeleteInfo {
  const f = resolveFlags(flags);
  return {
    m_iGuildUID: 0,
    m_iUnitUID: 0n,
  };
}
export function putKApplyDeleteInfo(ks: KSerializer, obj: KApplyDeleteInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iGuildUID))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  return true;
}
export function getKApplyDeleteInfo(ks: KSerializer, flags?: FlagInput): KApplyDeleteInfo {
  const f = resolveFlags(flags);
  const obj = createKApplyDeleteInfo(f);
  obj.m_iGuildUID = ks.getInt32();
  obj.m_iUnitUID = ks.getInt64();
  return obj;
}

export const KRecommendUserInfo_RECOMMEND_USER_INFO_TYPE = {
  RUIT_LOGIN: 0,
  RUIT_LOGOUT: 1,
  RUIT_LEVEL_UP: 2,
} as const;
export type KRecommendUserInfo_RECOMMEND_USER_INFO_TYPE = (typeof KRecommendUserInfo_RECOMMEND_USER_INFO_TYPE)[keyof typeof KRecommendUserInfo_RECOMMEND_USER_INFO_TYPE];
export interface KRecommendUserInfo {
  m_iUnitUID: UidType;
  m_wstrNickName: string;
  m_ucLevel: UInt8;
  m_wstrRecommendDate: string;
  m_bIsOnline: boolean;
  m_cUnitClass?: Int8;
}
export function createKRecommendUserInfo(flags?: FlagInput): KRecommendUserInfo {
  const f = resolveFlags(flags);
  const obj: KRecommendUserInfo = {
    m_iUnitUID: 0n,
    m_wstrNickName: '',
    m_ucLevel: 0,
    m_wstrRecommendDate: '',
    m_bIsOnline: false,
  };
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) obj.m_cUnitClass = 0;
  return obj;
}
export function putKRecommendUserInfo(ks: KSerializer, obj: KRecommendUserInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putWString(obj.m_wstrNickName))) return false;
  if (!(ks.putUInt8(obj.m_ucLevel))) return false;
  if (!(ks.putWString(obj.m_wstrRecommendDate))) return false;
  if (!(ks.putBool(obj.m_bIsOnline))) return false;
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { if (!(ks.putInt8((obj.m_cUnitClass ?? 0)))) return false; }
  return true;
}
export function getKRecommendUserInfo(ks: KSerializer, flags?: FlagInput): KRecommendUserInfo {
  const f = resolveFlags(flags);
  const obj = createKRecommendUserInfo(f);
  obj.m_iUnitUID = ks.getInt64();
  obj.m_wstrNickName = ks.getWString();
  obj.m_ucLevel = ks.getUInt8();
  obj.m_wstrRecommendDate = ks.getWString();
  obj.m_bIsOnline = ks.getBool();
  if (Boolean(f.SERV_RECRUIT_EVENT_BASE)) { obj.m_cUnitClass = ks.getInt8(); }
  return obj;
}

export interface KEventQuestInfo {
  m_bInit?: boolean;
  m_iEventUID?: Int32;
  m_iQuestID?: Int32;
}
export function createKEventQuestInfo(flags?: FlagInput): KEventQuestInfo {
  const f = resolveFlags(flags);
  const obj: KEventQuestInfo = {
  };
  if (Boolean(f.SERV_DAY_QUEST)) obj.m_bInit = false;
  if (Boolean(f.SERV_DAY_QUEST)) obj.m_iEventUID = 0;
  if (Boolean(f.SERV_DAY_QUEST)) obj.m_iQuestID = 0;
  return obj;
}
export function putKEventQuestInfo(ks: KSerializer, obj: KEventQuestInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_DAY_QUEST)) {
    if (Boolean(f.SERV_DAY_QUEST)) { if (!(ks.putBool((obj.m_bInit ?? false)))) return false; }
    if (Boolean(f.SERV_DAY_QUEST)) { if (!(ks.putInt32((obj.m_iEventUID ?? 0)))) return false; }
    if (Boolean(f.SERV_DAY_QUEST)) { if (!(ks.putInt32((obj.m_iQuestID ?? 0)))) return false; }
  }
  return true;
}
export function getKEventQuestInfo(ks: KSerializer, flags?: FlagInput): KEventQuestInfo {
  const f = resolveFlags(flags);
  const obj = createKEventQuestInfo(f);
  if (Boolean(f.SERV_DAY_QUEST)) {
    if (Boolean(f.SERV_DAY_QUEST)) { obj.m_bInit = ks.getBool(); }
    if (Boolean(f.SERV_DAY_QUEST)) { obj.m_iEventUID = ks.getInt32(); }
    if (Boolean(f.SERV_DAY_QUEST)) { obj.m_iQuestID = ks.getInt32(); }
  }
  return obj;
}

export interface KHackingToolInfo {
  m_wstrProcessName?: string;
  m_wstrWindowClassName?: string;
  m_cFlag?: Int8;
}
export function createKHackingToolInfo(flags?: FlagInput): KHackingToolInfo {
  const f = resolveFlags(flags);
  const obj: KHackingToolInfo = {
  };
  if (Boolean(f.SERV_HACKING_TOOL_LIST)) obj.m_wstrProcessName = '';
  if (Boolean(f.SERV_HACKING_TOOL_LIST)) obj.m_wstrWindowClassName = '';
  if (Boolean(f.SERV_HACKING_TOOL_LIST)) obj.m_cFlag = 0;
  return obj;
}
export function putKHackingToolInfo(ks: KSerializer, obj: KHackingToolInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_HACKING_TOOL_LIST)) {
    if (Boolean(f.SERV_HACKING_TOOL_LIST)) { if (!(ks.putWString((obj.m_wstrProcessName ?? '')))) return false; }
    if (Boolean(f.SERV_HACKING_TOOL_LIST)) { if (!(ks.putWString((obj.m_wstrWindowClassName ?? '')))) return false; }
    if (Boolean(f.SERV_HACKING_TOOL_LIST)) { if (!(ks.putInt8((obj.m_cFlag ?? 0)))) return false; }
  }
  return true;
}
export function getKHackingToolInfo(ks: KSerializer, flags?: FlagInput): KHackingToolInfo {
  const f = resolveFlags(flags);
  const obj = createKHackingToolInfo(f);
  if (Boolean(f.SERV_HACKING_TOOL_LIST)) {
    if (Boolean(f.SERV_HACKING_TOOL_LIST)) { obj.m_wstrProcessName = ks.getWString(); }
    if (Boolean(f.SERV_HACKING_TOOL_LIST)) { obj.m_wstrWindowClassName = ks.getWString(); }
    if (Boolean(f.SERV_HACKING_TOOL_LIST)) { obj.m_cFlag = ks.getInt8(); }
  }
  return obj;
}

export interface KWebPointRewardInfo {
  m_iApplySN?: Int32;
  m_wstrUserID?: string;
  m_wstrNickName?: string;
  m_iUnitUID?: UidType;
  m_iRewardItemID?: Int32;
}
export function createKWebPointRewardInfo(flags?: FlagInput): KWebPointRewardInfo {
  const f = resolveFlags(flags);
  const obj: KWebPointRewardInfo = {
  };
  if (Boolean(f.SERV_WEB_POINT_EVENT)) obj.m_iApplySN = 0;
  if (Boolean(f.SERV_WEB_POINT_EVENT)) obj.m_wstrUserID = '';
  if (Boolean(f.SERV_WEB_POINT_EVENT)) obj.m_wstrNickName = '';
  if (Boolean(f.SERV_WEB_POINT_EVENT)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_WEB_POINT_EVENT)) obj.m_iRewardItemID = 0;
  return obj;
}
export function putKWebPointRewardInfo(ks: KSerializer, obj: KWebPointRewardInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_WEB_POINT_EVENT)) {
    if (Boolean(f.SERV_WEB_POINT_EVENT)) { if (!(ks.putInt32((obj.m_iApplySN ?? 0)))) return false; }
    if (Boolean(f.SERV_WEB_POINT_EVENT)) { if (!(ks.putWString((obj.m_wstrUserID ?? '')))) return false; }
    if (Boolean(f.SERV_WEB_POINT_EVENT)) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
    if (Boolean(f.SERV_WEB_POINT_EVENT)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_WEB_POINT_EVENT)) { if (!(ks.putInt32((obj.m_iRewardItemID ?? 0)))) return false; }
  }
  return true;
}
export function getKWebPointRewardInfo(ks: KSerializer, flags?: FlagInput): KWebPointRewardInfo {
  const f = resolveFlags(flags);
  const obj = createKWebPointRewardInfo(f);
  if (Boolean(f.SERV_WEB_POINT_EVENT)) {
    if (Boolean(f.SERV_WEB_POINT_EVENT)) { obj.m_iApplySN = ks.getInt32(); }
    if (Boolean(f.SERV_WEB_POINT_EVENT)) { obj.m_wstrUserID = ks.getWString(); }
    if (Boolean(f.SERV_WEB_POINT_EVENT)) { obj.m_wstrNickName = ks.getWString(); }
    if (Boolean(f.SERV_WEB_POINT_EVENT)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_WEB_POINT_EVENT)) { obj.m_iRewardItemID = ks.getInt32(); }
  }
  return obj;
}

export interface KTradeBoardItemInfo {
  m_iPersonalShopUID?: UidType;
  m_iHostUnitUID?: UidType;
  m_wstrSellerNickName?: string;
  m_kSellItemInfo?: KSellPersonalShopItemInfo;
}
export function createKTradeBoardItemInfo(flags?: FlagInput): KTradeBoardItemInfo {
  const f = resolveFlags(flags);
  const obj: KTradeBoardItemInfo = {
  };
  if (Boolean(f.DEF_TRADE_BOARD)) obj.m_iPersonalShopUID = 0n;
  if (f.DEF_TRADE_BOARD && f.SERV_PSHOP_AGENCY) obj.m_iHostUnitUID = 0n;
  if (Boolean(f.DEF_TRADE_BOARD)) obj.m_wstrSellerNickName = '';
  if (Boolean(f.DEF_TRADE_BOARD)) obj.m_kSellItemInfo = createKSellPersonalShopItemInfo(f);
  return obj;
}
export function putKTradeBoardItemInfo(ks: KSerializer, obj: KTradeBoardItemInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.DEF_TRADE_BOARD)) {
    if (Boolean(f.DEF_TRADE_BOARD)) { if (!(ks.putInt64((obj.m_iPersonalShopUID ?? 0n)))) return false; }
    if (f.DEF_TRADE_BOARD && f.SERV_PSHOP_AGENCY) { if (!(ks.putInt64((obj.m_iHostUnitUID ?? 0n)))) return false; }
    if (Boolean(f.DEF_TRADE_BOARD)) { if (!(ks.putWString((obj.m_wstrSellerNickName ?? '')))) return false; }
    if (Boolean(f.DEF_TRADE_BOARD)) { if (!(ks.putUserClass((obj.m_kSellItemInfo ?? createKSellPersonalShopItemInfo(f)), putKSellPersonalShopItemInfo, f))) return false; }
  }
  return true;
}
export function getKTradeBoardItemInfo(ks: KSerializer, flags?: FlagInput): KTradeBoardItemInfo {
  const f = resolveFlags(flags);
  const obj = createKTradeBoardItemInfo(f);
  if (Boolean(f.DEF_TRADE_BOARD)) {
    if (Boolean(f.DEF_TRADE_BOARD)) { obj.m_iPersonalShopUID = ks.getInt64(); }
    if (f.DEF_TRADE_BOARD && f.SERV_PSHOP_AGENCY) { obj.m_iHostUnitUID = ks.getInt64(); }
    if (Boolean(f.DEF_TRADE_BOARD)) { obj.m_wstrSellerNickName = ks.getWString(); }
    if (Boolean(f.DEF_TRADE_BOARD)) { obj.m_kSellItemInfo = ks.getUserClass(getKSellPersonalShopItemInfo, f); }
  }
  return obj;
}

export interface KUpdateCCUInfo {
  m_iServerUID?: UidType;
  m_iConcurrentUser?: Int32;
  m_iCurPartyCount?: Int32;
  m_iPlayGamePartyCount?: Int32;
  m_mapChannelingUserList?: Map<Int32, Int32>;
}
export function createKUpdateCCUInfo(flags?: FlagInput): KUpdateCCUInfo {
  const f = resolveFlags(flags);
  const obj: KUpdateCCUInfo = {
  };
  if (Boolean(f.SERV_CCU_NEW)) obj.m_iServerUID = 0n;
  if (Boolean(f.SERV_CCU_NEW)) obj.m_iConcurrentUser = 0;
  if (Boolean(f.SERV_CCU_NEW)) obj.m_iCurPartyCount = 0;
  if (Boolean(f.SERV_CCU_NEW)) obj.m_iPlayGamePartyCount = 0;
  if (f.SERV_CCU_NEW && f.SERV_CHANNELING_USER_MANAGER) obj.m_mapChannelingUserList = new Map<Int32, Int32>();
  return obj;
}
export function putKUpdateCCUInfo(ks: KSerializer, obj: KUpdateCCUInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CCU_NEW)) {
    if (Boolean(f.SERV_CCU_NEW)) { if (!(ks.putInt64((obj.m_iServerUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_CCU_NEW)) { if (!(ks.putInt32((obj.m_iConcurrentUser ?? 0)))) return false; }
    if (Boolean(f.SERV_CCU_NEW)) { if (!(ks.putInt32((obj.m_iCurPartyCount ?? 0)))) return false; }
    if (Boolean(f.SERV_CCU_NEW)) { if (!(ks.putInt32((obj.m_iPlayGamePartyCount ?? 0)))) return false; }
    if (f.SERV_CCU_NEW && f.SERV_CHANNELING_USER_MANAGER) { if (!(ks.putMap((obj.m_mapChannelingUserList ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
  }
  return true;
}
export function getKUpdateCCUInfo(ks: KSerializer, flags?: FlagInput): KUpdateCCUInfo {
  const f = resolveFlags(flags);
  const obj = createKUpdateCCUInfo(f);
  if (Boolean(f.SERV_CCU_NEW)) {
    if (Boolean(f.SERV_CCU_NEW)) { obj.m_iServerUID = ks.getInt64(); }
    if (Boolean(f.SERV_CCU_NEW)) { obj.m_iConcurrentUser = ks.getInt32(); }
    if (Boolean(f.SERV_CCU_NEW)) { obj.m_iCurPartyCount = ks.getInt32(); }
    if (Boolean(f.SERV_CCU_NEW)) { obj.m_iPlayGamePartyCount = ks.getInt32(); }
    if (f.SERV_CCU_NEW && f.SERV_CHANNELING_USER_MANAGER) { obj.m_mapChannelingUserList = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
  }
  return obj;
}

export interface KRolicyResults {
  m_byteRolicyCount?: UInt8;
  m_byteRolicyListNo?: UInt8;
  m_wstrRolicyName?: string;
  m_byteRolicyResult?: UInt8;
  m_wstrOption?: string;
}
export function createKRolicyResults(flags?: FlagInput): KRolicyResults {
  const f = resolveFlags(flags);
  const obj: KRolicyResults = {
  };
  if (Boolean(f.SERV_SHUTDOWN_SYSTEM)) obj.m_byteRolicyCount = 0;
  if (Boolean(f.SERV_SHUTDOWN_SYSTEM)) obj.m_byteRolicyListNo = 0;
  if (Boolean(f.SERV_SHUTDOWN_SYSTEM)) obj.m_wstrRolicyName = '';
  if (Boolean(f.SERV_SHUTDOWN_SYSTEM)) obj.m_byteRolicyResult = 0;
  if (Boolean(f.SERV_SHUTDOWN_SYSTEM)) obj.m_wstrOption = '';
  return obj;
}
export function putKRolicyResults(ks: KSerializer, obj: KRolicyResults, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SHUTDOWN_SYSTEM)) {
    if (Boolean(f.SERV_SHUTDOWN_SYSTEM)) { if (!(ks.putUInt8((obj.m_byteRolicyCount ?? 0)))) return false; }
    if (Boolean(f.SERV_SHUTDOWN_SYSTEM)) { if (!(ks.putUInt8((obj.m_byteRolicyListNo ?? 0)))) return false; }
    if (Boolean(f.SERV_SHUTDOWN_SYSTEM)) { if (!(ks.putWString((obj.m_wstrRolicyName ?? '')))) return false; }
    if (Boolean(f.SERV_SHUTDOWN_SYSTEM)) { if (!(ks.putUInt8((obj.m_byteRolicyResult ?? 0)))) return false; }
    if (Boolean(f.SERV_SHUTDOWN_SYSTEM)) { if (!(ks.putWString((obj.m_wstrOption ?? '')))) return false; }
  }
  return true;
}
export function getKRolicyResults(ks: KSerializer, flags?: FlagInput): KRolicyResults {
  const f = resolveFlags(flags);
  const obj = createKRolicyResults(f);
  if (Boolean(f.SERV_SHUTDOWN_SYSTEM)) {
    if (Boolean(f.SERV_SHUTDOWN_SYSTEM)) { obj.m_byteRolicyCount = ks.getUInt8(); }
    if (Boolean(f.SERV_SHUTDOWN_SYSTEM)) { obj.m_byteRolicyListNo = ks.getUInt8(); }
    if (Boolean(f.SERV_SHUTDOWN_SYSTEM)) { obj.m_wstrRolicyName = ks.getWString(); }
    if (Boolean(f.SERV_SHUTDOWN_SYSTEM)) { obj.m_byteRolicyResult = ks.getUInt8(); }
    if (Boolean(f.SERV_SHUTDOWN_SYSTEM)) { obj.m_wstrOption = ks.getWString(); }
  }
  return obj;
}

export interface KPropertyValue {
  m_bytePropertyValue?: UInt8;
  m_uintPropertyValue?: UInt32;
  m_ulongPropertyValue?: UInt32;
  m_wstrPropertyValue?: string;
  m_vecPropertyValue?: UInt32[];
  m_mapRolicyResult?: Map<UInt8, KRolicyResults>;
  m_int64PropertyValue?: Int64;
}
export function createKPropertyValue(flags?: FlagInput): KPropertyValue {
  const f = resolveFlags(flags);
  const obj: KPropertyValue = {
  };
  if (Boolean(f.SERV_PCBANG_AUTH_NEW)) obj.m_bytePropertyValue = 0;
  if (Boolean(f.SERV_PCBANG_AUTH_NEW)) obj.m_uintPropertyValue = 0;
  if (Boolean(f.SERV_PCBANG_AUTH_NEW)) obj.m_ulongPropertyValue = 0;
  if (Boolean(f.SERV_PCBANG_AUTH_NEW)) obj.m_wstrPropertyValue = '';
  if (Boolean(f.SERV_PCBANG_AUTH_NEW)) obj.m_vecPropertyValue = ([] as UInt32[]);
  if (f.SERV_PCBANG_AUTH_NEW && f.SERV_SHUTDOWN_SYSTEM) obj.m_mapRolicyResult = new Map<UInt8, KRolicyResults>();
  if (f.SERV_PCBANG_AUTH_NEW && f.SERV_SHUTDOWN_SYSTEM) obj.m_int64PropertyValue = 0n;
  return obj;
}
export function putKPropertyValue(ks: KSerializer, obj: KPropertyValue, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PCBANG_AUTH_NEW)) {
    if (Boolean(f.SERV_PCBANG_AUTH_NEW)) { if (!(ks.putUInt8((obj.m_bytePropertyValue ?? 0)))) return false; }
    if (Boolean(f.SERV_PCBANG_AUTH_NEW)) { if (!(ks.putUInt32((obj.m_uintPropertyValue ?? 0)))) return false; }
    if (Boolean(f.SERV_PCBANG_AUTH_NEW)) { if (!(ks.putUInt32((obj.m_ulongPropertyValue ?? 0)))) return false; }
    if (Boolean(f.SERV_PCBANG_AUTH_NEW)) { if (!(ks.putWString((obj.m_wstrPropertyValue ?? '')))) return false; }
    if (Boolean(f.SERV_PCBANG_AUTH_NEW)) { if (!(ks.putVector((obj.m_vecPropertyValue ?? ([] as UInt32[])), (ks, item: UInt32) => ks.putUInt32(item)))) return false; }
    if (f.SERV_PCBANG_AUTH_NEW && f.SERV_SHUTDOWN_SYSTEM) { if (!(ks.putMap((obj.m_mapRolicyResult ?? new Map<UInt8, KRolicyResults>()), (ks, k: UInt8) => ks.putUInt8(k), (ks, v: KRolicyResults) => ks.putUserClass(v, putKRolicyResults, f)))) return false; }
    if (f.SERV_PCBANG_AUTH_NEW && f.SERV_SHUTDOWN_SYSTEM) { if (!(ks.putInt64((obj.m_int64PropertyValue ?? 0n)))) return false; }
  }
  return true;
}
export function getKPropertyValue(ks: KSerializer, flags?: FlagInput): KPropertyValue {
  const f = resolveFlags(flags);
  const obj = createKPropertyValue(f);
  if (Boolean(f.SERV_PCBANG_AUTH_NEW)) {
    if (Boolean(f.SERV_PCBANG_AUTH_NEW)) { obj.m_bytePropertyValue = ks.getUInt8(); }
    if (Boolean(f.SERV_PCBANG_AUTH_NEW)) { obj.m_uintPropertyValue = ks.getUInt32(); }
    if (Boolean(f.SERV_PCBANG_AUTH_NEW)) { obj.m_ulongPropertyValue = ks.getUInt32(); }
    if (Boolean(f.SERV_PCBANG_AUTH_NEW)) { obj.m_wstrPropertyValue = ks.getWString(); }
    if (Boolean(f.SERV_PCBANG_AUTH_NEW)) { obj.m_vecPropertyValue = ks.getVector<UInt32>((ks) => ks.getUInt32()); }
    if (f.SERV_PCBANG_AUTH_NEW && f.SERV_SHUTDOWN_SYSTEM) { obj.m_mapRolicyResult = ks.getMap<UInt8, KRolicyResults>((ks) => ks.getUInt8(), (ks) => ks.getUserClass(getKRolicyResults, f)); }
    if (f.SERV_PCBANG_AUTH_NEW && f.SERV_SHUTDOWN_SYSTEM) { obj.m_int64PropertyValue = ks.getInt64(); }
  }
  return obj;
}

export interface KStatisticsInfo {
  m_iStatisticsID?: Int32;
  m_kKey?: KStatisticsKey;
  m_iIndex?: Int32;
  m_iCount?: Int32;
}
export function createKStatisticsInfo(flags?: FlagInput): KStatisticsInfo {
  const f = resolveFlags(flags);
  const obj: KStatisticsInfo = {
  };
  if (Boolean(f.SERV_STATISTICS_THREAD)) obj.m_iStatisticsID = 0;
  if (Boolean(f.SERV_STATISTICS_THREAD)) obj.m_kKey = createKStatisticsKey(f);
  if (Boolean(f.SERV_STATISTICS_THREAD)) obj.m_iIndex = 0;
  if (Boolean(f.SERV_STATISTICS_THREAD)) obj.m_iCount = 0;
  return obj;
}
export function putKStatisticsInfo(ks: KSerializer, obj: KStatisticsInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_STATISTICS_THREAD)) {
    if (Boolean(f.SERV_STATISTICS_THREAD)) { if (!(ks.putInt32((obj.m_iStatisticsID ?? 0)))) return false; }
    if (Boolean(f.SERV_STATISTICS_THREAD)) { if (!(ks.putUserClass((obj.m_kKey ?? createKStatisticsKey(f)), putKStatisticsKey, f))) return false; }
    if (Boolean(f.SERV_STATISTICS_THREAD)) { if (!(ks.putInt32((obj.m_iIndex ?? 0)))) return false; }
    if (Boolean(f.SERV_STATISTICS_THREAD)) { if (!(ks.putInt32((obj.m_iCount ?? 0)))) return false; }
  }
  return true;
}
export function getKStatisticsInfo(ks: KSerializer, flags?: FlagInput): KStatisticsInfo {
  const f = resolveFlags(flags);
  const obj = createKStatisticsInfo(f);
  if (Boolean(f.SERV_STATISTICS_THREAD)) {
    if (Boolean(f.SERV_STATISTICS_THREAD)) { obj.m_iStatisticsID = ks.getInt32(); }
    if (Boolean(f.SERV_STATISTICS_THREAD)) { obj.m_kKey = ks.getUserClass(getKStatisticsKey, f); }
    if (Boolean(f.SERV_STATISTICS_THREAD)) { obj.m_iIndex = ks.getInt32(); }
    if (Boolean(f.SERV_STATISTICS_THREAD)) { obj.m_iCount = ks.getInt32(); }
  }
  return obj;
}

export interface KItemPeriodInfo {
  m_iItemUID?: UidType;
  m_sPeriod?: Int16;
  m_wstrExpirationDate?: string;
}
export function createKItemPeriodInfo(flags?: FlagInput): KItemPeriodInfo {
  const f = resolveFlags(flags);
  const obj: KItemPeriodInfo = {
  };
  if (Boolean(f.SERV_RESET_PERIOD_EVENT)) obj.m_iItemUID = 0n;
  if (Boolean(f.SERV_RESET_PERIOD_EVENT)) obj.m_sPeriod = 0;
  if (Boolean(f.SERV_RESET_PERIOD_EVENT)) obj.m_wstrExpirationDate = '';
  return obj;
}
export function putKItemPeriodInfo(ks: KSerializer, obj: KItemPeriodInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_RESET_PERIOD_EVENT)) {
    if (Boolean(f.SERV_RESET_PERIOD_EVENT)) { if (!(ks.putInt64((obj.m_iItemUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_RESET_PERIOD_EVENT)) { if (!(ks.putInt16((obj.m_sPeriod ?? 0)))) return false; }
    if (Boolean(f.SERV_RESET_PERIOD_EVENT)) { if (!(ks.putWString((obj.m_wstrExpirationDate ?? '')))) return false; }
  }
  return true;
}
export function getKItemPeriodInfo(ks: KSerializer, flags?: FlagInput): KItemPeriodInfo {
  const f = resolveFlags(flags);
  const obj = createKItemPeriodInfo(f);
  if (Boolean(f.SERV_RESET_PERIOD_EVENT)) {
    if (Boolean(f.SERV_RESET_PERIOD_EVENT)) { obj.m_iItemUID = ks.getInt64(); }
    if (Boolean(f.SERV_RESET_PERIOD_EVENT)) { obj.m_sPeriod = ks.getInt16(); }
    if (Boolean(f.SERV_RESET_PERIOD_EVENT)) { obj.m_wstrExpirationDate = ks.getWString(); }
  }
  return obj;
}

export const KModuleInfo_MODULE_INFO_ALLOW = {
  MIA_NONE: 0,
  MIA_BLACK_LIST: 1,
  MIA_MONITORING: 2,
} as const;
export type KModuleInfo_MODULE_INFO_ALLOW = (typeof KModuleInfo_MODULE_INFO_ALLOW)[keyof typeof KModuleInfo_MODULE_INFO_ALLOW];
export function getKModuleInfo_MODULE_INFO_ALLOW(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (f.SERV_DLL_MANAGER && f.SERV_HACKING_DLL_CHECK) {
    cur = 0;
    out['MIA_NONE'] = cur;
    cur += 1;
  }
  if (f.SERV_DLL_MANAGER && f.SERV_HACKING_DLL_CHECK) {
    cur = 1;
    out['MIA_BLACK_LIST'] = cur;
    cur += 1;
  }
  if (f.SERV_DLL_MANAGER && f.SERV_HACKING_DLL_CHECK) {
    cur = 2;
    out['MIA_MONITORING'] = cur;
    cur += 1;
  }
  return out;
}
export interface KModuleInfo {
  m_iModuleUID?: Int32;
  m_wstrModuleName?: string;
  m_iCount?: Int64;
  m_iFlag?: Int32;
  m_iAllow?: Int32;
  m_bAllow?: boolean;
  m_bReserveDBUpdate?: boolean;
}
export function createKModuleInfo(flags?: FlagInput): KModuleInfo {
  const f = resolveFlags(flags);
  const obj: KModuleInfo = {
  };
  if (Boolean(f.SERV_DLL_MANAGER)) obj.m_iModuleUID = 0;
  if (Boolean(f.SERV_DLL_MANAGER)) obj.m_wstrModuleName = '';
  if (Boolean(f.SERV_DLL_MANAGER)) obj.m_iCount = 0n;
  if (Boolean(f.SERV_DLL_MANAGER)) obj.m_iFlag = 0;
  if (f.SERV_DLL_MANAGER && f.SERV_HACKING_DLL_CHECK) obj.m_iAllow = 0;
  if (f.SERV_DLL_MANAGER && !f.SERV_HACKING_DLL_CHECK) obj.m_bAllow = false;
  if (Boolean(f.SERV_DLL_MANAGER)) obj.m_bReserveDBUpdate = false;
  return obj;
}
export function putKModuleInfo(ks: KSerializer, obj: KModuleInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_DLL_MANAGER)) {
    if (Boolean(f.SERV_DLL_MANAGER)) { if (!(ks.putInt32((obj.m_iModuleUID ?? 0)))) return false; }
    if (Boolean(f.SERV_DLL_MANAGER)) { if (!(ks.putWString((obj.m_wstrModuleName ?? '')))) return false; }
    if (Boolean(f.SERV_DLL_MANAGER)) { if (!(ks.putInt64((obj.m_iCount ?? 0n)))) return false; }
    if (Boolean(f.SERV_DLL_MANAGER)) { if (!(ks.putInt32((obj.m_iFlag ?? 0)))) return false; }
    if (f.SERV_DLL_MANAGER && f.SERV_HACKING_DLL_CHECK) { if (!(ks.putInt32((obj.m_iAllow ?? 0)))) return false; }
    if (f.SERV_DLL_MANAGER && !f.SERV_HACKING_DLL_CHECK) { if (!(ks.putBool((obj.m_bAllow ?? false)))) return false; }
    if (Boolean(f.SERV_DLL_MANAGER)) { if (!(ks.putBool((obj.m_bReserveDBUpdate ?? false)))) return false; }
  }
  return true;
}
export function getKModuleInfo(ks: KSerializer, flags?: FlagInput): KModuleInfo {
  const f = resolveFlags(flags);
  const obj = createKModuleInfo(f);
  if (Boolean(f.SERV_DLL_MANAGER)) {
    if (Boolean(f.SERV_DLL_MANAGER)) { obj.m_iModuleUID = ks.getInt32(); }
    if (Boolean(f.SERV_DLL_MANAGER)) { obj.m_wstrModuleName = ks.getWString(); }
    if (Boolean(f.SERV_DLL_MANAGER)) { obj.m_iCount = ks.getInt64(); }
    if (Boolean(f.SERV_DLL_MANAGER)) { obj.m_iFlag = ks.getInt32(); }
    if (f.SERV_DLL_MANAGER && f.SERV_HACKING_DLL_CHECK) { obj.m_iAllow = ks.getInt32(); }
    if (f.SERV_DLL_MANAGER && !f.SERV_HACKING_DLL_CHECK) { obj.m_bAllow = ks.getBool(); }
    if (Boolean(f.SERV_DLL_MANAGER)) { obj.m_bReserveDBUpdate = ks.getBool(); }
  }
  return obj;
}

export interface KStatIncreaseRate {
  m_fIncreaseAtkPhysicRate?: Float32;
  m_fIncreaseAtkMagicRate?: Float32;
  m_fIncreaseDefPhysicRate?: Float32;
  m_fIncreaseDefMagicRate?: Float32;
}
export function createKStatIncreaseRate(flags?: FlagInput): KStatIncreaseRate {
  const f = resolveFlags(flags);
  const obj: KStatIncreaseRate = {
  };
  if (Boolean(f.SERV_PET_AURA_SKILL)) obj.m_fIncreaseAtkPhysicRate = 0;
  if (Boolean(f.SERV_PET_AURA_SKILL)) obj.m_fIncreaseAtkMagicRate = 0;
  if (Boolean(f.SERV_PET_AURA_SKILL)) obj.m_fIncreaseDefPhysicRate = 0;
  if (Boolean(f.SERV_PET_AURA_SKILL)) obj.m_fIncreaseDefMagicRate = 0;
  return obj;
}
export function putKStatIncreaseRate(ks: KSerializer, obj: KStatIncreaseRate, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PET_AURA_SKILL)) {
    if (Boolean(f.SERV_PET_AURA_SKILL)) { if (!(ks.putFloat32((obj.m_fIncreaseAtkPhysicRate ?? 0)))) return false; }
    if (Boolean(f.SERV_PET_AURA_SKILL)) { if (!(ks.putFloat32((obj.m_fIncreaseAtkMagicRate ?? 0)))) return false; }
    if (Boolean(f.SERV_PET_AURA_SKILL)) { if (!(ks.putFloat32((obj.m_fIncreaseDefPhysicRate ?? 0)))) return false; }
    if (Boolean(f.SERV_PET_AURA_SKILL)) { if (!(ks.putFloat32((obj.m_fIncreaseDefMagicRate ?? 0)))) return false; }
  }
  return true;
}
export function getKStatIncreaseRate(ks: KSerializer, flags?: FlagInput): KStatIncreaseRate {
  const f = resolveFlags(flags);
  const obj = createKStatIncreaseRate(f);
  if (Boolean(f.SERV_PET_AURA_SKILL)) {
    if (Boolean(f.SERV_PET_AURA_SKILL)) { obj.m_fIncreaseAtkPhysicRate = ks.getFloat32(); }
    if (Boolean(f.SERV_PET_AURA_SKILL)) { obj.m_fIncreaseAtkMagicRate = ks.getFloat32(); }
    if (Boolean(f.SERV_PET_AURA_SKILL)) { obj.m_fIncreaseDefPhysicRate = ks.getFloat32(); }
    if (Boolean(f.SERV_PET_AURA_SKILL)) { obj.m_fIncreaseDefMagicRate = ks.getFloat32(); }
  }
  return obj;
}

export interface KAbuserEventLog {
  m_iUserUID: UidType;
  m_iUnitUID: UidType;
  m_iED: Int32;
  m_iGetItemCount: Int32;
  m_iSpirit?: Int32;
  m_iRegDate: Int64;
  m_usEventID: UInt16;
}
export function createKAbuserEventLog(flags?: FlagInput): KAbuserEventLog {
  const f = resolveFlags(flags);
  const obj: KAbuserEventLog = {
    m_iUserUID: 0n,
    m_iUnitUID: 0n,
    m_iED: 0,
    m_iGetItemCount: 0,
    m_iRegDate: 0n,
    m_usEventID: 0,
  };
  if (Boolean(f.SERV_PACKET_MORNITORING_SPIRIT_COL)) obj.m_iSpirit = 0;
  return obj;
}
export function putKAbuserEventLog(ks: KSerializer, obj: KAbuserEventLog, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUserUID))) return false;
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (!(ks.putInt32(obj.m_iED))) return false;
  if (!(ks.putInt32(obj.m_iGetItemCount))) return false;
  if (Boolean(f.SERV_PACKET_MORNITORING_SPIRIT_COL)) { if (!(ks.putInt32((obj.m_iSpirit ?? 0)))) return false; }
  if (!(ks.putInt64(obj.m_iRegDate))) return false;
  if (!(ks.putUInt16(obj.m_usEventID))) return false;
  return true;
}
export function getKAbuserEventLog(ks: KSerializer, flags?: FlagInput): KAbuserEventLog {
  const f = resolveFlags(flags);
  const obj = createKAbuserEventLog(f);
  obj.m_iUserUID = ks.getInt64();
  obj.m_iUnitUID = ks.getInt64();
  obj.m_iED = ks.getInt32();
  obj.m_iGetItemCount = ks.getInt32();
  if (Boolean(f.SERV_PACKET_MORNITORING_SPIRIT_COL)) { obj.m_iSpirit = ks.getInt32(); }
  obj.m_iRegDate = ks.getInt64();
  obj.m_usEventID = ks.getUInt16();
  return obj;
}

export interface KDungeonDropEventNpcInfo {
  m_iEventUID?: Int32;
  m_iNpcID?: Int32;
  m_tDropDate?: Int64;
}
export function createKDungeonDropEventNpcInfo(flags?: FlagInput): KDungeonDropEventNpcInfo {
  const f = resolveFlags(flags);
  const obj: KDungeonDropEventNpcInfo = {
  };
  if (Boolean(f.SERV_TIME_DROP_MONSTER_EVENT)) obj.m_iEventUID = 0;
  if (Boolean(f.SERV_TIME_DROP_MONSTER_EVENT)) obj.m_iNpcID = 0;
  if (Boolean(f.SERV_TIME_DROP_MONSTER_EVENT)) obj.m_tDropDate = 0n;
  return obj;
}
export function putKDungeonDropEventNpcInfo(ks: KSerializer, obj: KDungeonDropEventNpcInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_TIME_DROP_MONSTER_EVENT)) {
    if (Boolean(f.SERV_TIME_DROP_MONSTER_EVENT)) { if (!(ks.putInt32((obj.m_iEventUID ?? 0)))) return false; }
    if (Boolean(f.SERV_TIME_DROP_MONSTER_EVENT)) { if (!(ks.putInt32((obj.m_iNpcID ?? 0)))) return false; }
    if (Boolean(f.SERV_TIME_DROP_MONSTER_EVENT)) { if (!(ks.putInt64((obj.m_tDropDate ?? 0n)))) return false; }
  }
  return true;
}
export function getKDungeonDropEventNpcInfo(ks: KSerializer, flags?: FlagInput): KDungeonDropEventNpcInfo {
  const f = resolveFlags(flags);
  const obj = createKDungeonDropEventNpcInfo(f);
  if (Boolean(f.SERV_TIME_DROP_MONSTER_EVENT)) {
    if (Boolean(f.SERV_TIME_DROP_MONSTER_EVENT)) { obj.m_iEventUID = ks.getInt32(); }
    if (Boolean(f.SERV_TIME_DROP_MONSTER_EVENT)) { obj.m_iNpcID = ks.getInt32(); }
    if (Boolean(f.SERV_TIME_DROP_MONSTER_EVENT)) { obj.m_tDropDate = ks.getInt64(); }
  }
  return obj;
}

export interface KUserAppropriateLevelInfo {
  m_iUnitUID?: UidType;
  m_ucLevel?: UInt8;
  m_iWeaponLevel?: Int32;
  m_iWeaponGrade?: Int32;
  m_iStartedAtkPhysic?: Int32;
  m_iStartedAtkMagic?: Int32;
}
export function createKUserAppropriateLevelInfo(flags?: FlagInput): KUserAppropriateLevelInfo {
  const f = resolveFlags(flags);
  const obj: KUserAppropriateLevelInfo = {
  };
  if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) obj.m_ucLevel = 0;
  if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) obj.m_iWeaponLevel = 0;
  if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) obj.m_iWeaponGrade = 0;
  if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) obj.m_iStartedAtkPhysic = 0;
  if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) obj.m_iStartedAtkMagic = 0;
  return obj;
}
export function putKUserAppropriateLevelInfo(ks: KSerializer, obj: KUserAppropriateLevelInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) {
    if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) { if (!(ks.putUInt8((obj.m_ucLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) { if (!(ks.putInt32((obj.m_iWeaponLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) { if (!(ks.putInt32((obj.m_iWeaponGrade ?? 0)))) return false; }
    if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) { if (!(ks.putInt32((obj.m_iStartedAtkPhysic ?? 0)))) return false; }
    if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) { if (!(ks.putInt32((obj.m_iStartedAtkMagic ?? 0)))) return false; }
  }
  return true;
}
export function getKUserAppropriateLevelInfo(ks: KSerializer, flags?: FlagInput): KUserAppropriateLevelInfo {
  const f = resolveFlags(flags);
  const obj = createKUserAppropriateLevelInfo(f);
  if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) {
    if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) { obj.m_ucLevel = ks.getUInt8(); }
    if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) { obj.m_iWeaponLevel = ks.getInt32(); }
    if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) { obj.m_iWeaponGrade = ks.getInt32(); }
    if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) { obj.m_iStartedAtkPhysic = ks.getInt32(); }
    if (Boolean(f.SERV_APPROPRIATE_LEVEL_STAT)) { obj.m_iStartedAtkMagic = ks.getInt32(); }
  }
  return obj;
}

export interface KTimeOpenRandomItemEventInfo {
  m_iID?: Int32;
  m_iItemID?: Int32;
  m_wstrDropTime?: string;
  m_wstrDropEndTime?: string;
  m_iOpenItemID?: Int32;
}
export function createKTimeOpenRandomItemEventInfo(flags?: FlagInput): KTimeOpenRandomItemEventInfo {
  const f = resolveFlags(flags);
  const obj: KTimeOpenRandomItemEventInfo = {
  };
  if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) obj.m_iID = 0;
  if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) obj.m_iItemID = 0;
  if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) obj.m_wstrDropTime = '';
  if (f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT && f.SERV_NAVER_PROMOTIONS) obj.m_wstrDropEndTime = '';
  if (f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT && f.SERV_RANDOM_CUBE_GOLD_REWARD) obj.m_iOpenItemID = 0;
  return obj;
}
export function putKTimeOpenRandomItemEventInfo(ks: KSerializer, obj: KTimeOpenRandomItemEventInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) {
    if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) { if (!(ks.putInt32((obj.m_iID ?? 0)))) return false; }
    if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) { if (!(ks.putInt32((obj.m_iItemID ?? 0)))) return false; }
    if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) { if (!(ks.putWString((obj.m_wstrDropTime ?? '')))) return false; }
    if (f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT && f.SERV_NAVER_PROMOTIONS) { if (!(ks.putWString((obj.m_wstrDropEndTime ?? '')))) return false; }
    if (f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT && f.SERV_RANDOM_CUBE_GOLD_REWARD) { if (!(ks.putInt32((obj.m_iOpenItemID ?? 0)))) return false; }
  }
  return true;
}
export function getKTimeOpenRandomItemEventInfo(ks: KSerializer, flags?: FlagInput): KTimeOpenRandomItemEventInfo {
  const f = resolveFlags(flags);
  const obj = createKTimeOpenRandomItemEventInfo(f);
  if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) {
    if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) { obj.m_iID = ks.getInt32(); }
    if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) { obj.m_iItemID = ks.getInt32(); }
    if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) { obj.m_wstrDropTime = ks.getWString(); }
    if (f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT && f.SERV_NAVER_PROMOTIONS) { obj.m_wstrDropEndTime = ks.getWString(); }
    if (f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT && f.SERV_RANDOM_CUBE_GOLD_REWARD) { obj.m_iOpenItemID = ks.getInt32(); }
  }
  return obj;
}

export interface KTimeOpenRandomItemEventDBUPdate {
  m_iID?: Int32;
  m_tUpdateTime?: Int64;
  m_iGetUserUID?: UidType;
  m_iGetUnitUID?: UidType;
}
export function createKTimeOpenRandomItemEventDBUPdate(flags?: FlagInput): KTimeOpenRandomItemEventDBUPdate {
  const f = resolveFlags(flags);
  const obj: KTimeOpenRandomItemEventDBUPdate = {
  };
  if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) obj.m_iID = 0;
  if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) obj.m_tUpdateTime = 0n;
  if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) obj.m_iGetUserUID = 0n;
  if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) obj.m_iGetUnitUID = 0n;
  return obj;
}
export function putKTimeOpenRandomItemEventDBUPdate(ks: KSerializer, obj: KTimeOpenRandomItemEventDBUPdate, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) {
    if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) { if (!(ks.putInt32((obj.m_iID ?? 0)))) return false; }
    if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) { if (!(ks.putInt64((obj.m_tUpdateTime ?? 0n)))) return false; }
    if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) { if (!(ks.putInt64((obj.m_iGetUserUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) { if (!(ks.putInt64((obj.m_iGetUnitUID ?? 0n)))) return false; }
  }
  return true;
}
export function getKTimeOpenRandomItemEventDBUPdate(ks: KSerializer, flags?: FlagInput): KTimeOpenRandomItemEventDBUPdate {
  const f = resolveFlags(flags);
  const obj = createKTimeOpenRandomItemEventDBUPdate(f);
  if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) {
    if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) { obj.m_iID = ks.getInt32(); }
    if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) { obj.m_tUpdateTime = ks.getInt64(); }
    if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) { obj.m_iGetUserUID = ks.getInt64(); }
    if (Boolean(f.SERV_TIME_OPEN_RANDOM_ITEM_EVENT)) { obj.m_iGetUnitUID = ks.getInt64(); }
  }
  return obj;
}

export interface KToolServerList {
  m_iServerUID?: Int32;
  m_iServerSetID?: Int32;
  m_iServerType?: Int32;
  m_iChannelID?: Int32;
  m_wstrChannelName?: string;
  m_wstrIP?: string;
  m_iPort?: Int32;
}
export function createKToolServerList(flags?: FlagInput): KToolServerList {
  const f = resolveFlags(flags);
  const obj: KToolServerList = {
  };
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) obj.m_iServerUID = 0;
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) obj.m_iServerSetID = 0;
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) obj.m_iServerType = 0;
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) obj.m_iChannelID = 0;
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) obj.m_wstrChannelName = '';
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) obj.m_wstrIP = '';
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) obj.m_iPort = 0;
  return obj;
}
export function putKToolServerList(ks: KSerializer, obj: KToolServerList, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) {
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { if (!(ks.putInt32((obj.m_iServerUID ?? 0)))) return false; }
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { if (!(ks.putInt32((obj.m_iServerSetID ?? 0)))) return false; }
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { if (!(ks.putInt32((obj.m_iServerType ?? 0)))) return false; }
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { if (!(ks.putInt32((obj.m_iChannelID ?? 0)))) return false; }
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { if (!(ks.putWString((obj.m_wstrChannelName ?? '')))) return false; }
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { if (!(ks.putWString((obj.m_wstrIP ?? '')))) return false; }
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { if (!(ks.putInt32((obj.m_iPort ?? 0)))) return false; }
  }
  return true;
}
export function getKToolServerList(ks: KSerializer, flags?: FlagInput): KToolServerList {
  const f = resolveFlags(flags);
  const obj = createKToolServerList(f);
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) {
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { obj.m_iServerUID = ks.getInt32(); }
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { obj.m_iServerSetID = ks.getInt32(); }
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { obj.m_iServerType = ks.getInt32(); }
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { obj.m_iChannelID = ks.getInt32(); }
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { obj.m_wstrChannelName = ks.getWString(); }
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { obj.m_wstrIP = ks.getWString(); }
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { obj.m_iPort = ks.getInt32(); }
  }
  return obj;
}

export interface KE_TOOL_CHECK_LOGIN_REQ {
  m_wstrID?: string;
  m_wstrPW?: string;
}
export function createKE_TOOL_CHECK_LOGIN_REQ(flags?: FlagInput): KE_TOOL_CHECK_LOGIN_REQ {
  const f = resolveFlags(flags);
  const obj: KE_TOOL_CHECK_LOGIN_REQ = {
  };
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) obj.m_wstrID = '';
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) obj.m_wstrPW = '';
  return obj;
}
export function putKE_TOOL_CHECK_LOGIN_REQ(ks: KSerializer, obj: KE_TOOL_CHECK_LOGIN_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) {
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { if (!(ks.putWString((obj.m_wstrID ?? '')))) return false; }
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { if (!(ks.putWString((obj.m_wstrPW ?? '')))) return false; }
  }
  return true;
}
export function getKE_TOOL_CHECK_LOGIN_REQ(ks: KSerializer, flags?: FlagInput): KE_TOOL_CHECK_LOGIN_REQ {
  const f = resolveFlags(flags);
  const obj = createKE_TOOL_CHECK_LOGIN_REQ(f);
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) {
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { obj.m_wstrID = ks.getWString(); }
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { obj.m_wstrPW = ks.getWString(); }
  }
  return obj;
}

export interface KE_TOOL_CHECK_LOGIN_ACK {
  m_iAuthLevel?: Int32;
}
export function createKE_TOOL_CHECK_LOGIN_ACK(flags?: FlagInput): KE_TOOL_CHECK_LOGIN_ACK {
  const f = resolveFlags(flags);
  const obj: KE_TOOL_CHECK_LOGIN_ACK = {
  };
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) obj.m_iAuthLevel = 0;
  return obj;
}
export function putKE_TOOL_CHECK_LOGIN_ACK(ks: KSerializer, obj: KE_TOOL_CHECK_LOGIN_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) {
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { if (!(ks.putInt32((obj.m_iAuthLevel ?? 0)))) return false; }
  }
  return true;
}
export function getKE_TOOL_CHECK_LOGIN_ACK(ks: KSerializer, flags?: FlagInput): KE_TOOL_CHECK_LOGIN_ACK {
  const f = resolveFlags(flags);
  const obj = createKE_TOOL_CHECK_LOGIN_ACK(f);
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) {
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { obj.m_iAuthLevel = ks.getInt32(); }
  }
  return obj;
}

export interface KE_TOOL_SERVER_LIST_ACK {
  m_iServerCount?: Int32;
  m_vecServerList?: KToolServerList[];
}
export function createKE_TOOL_SERVER_LIST_ACK(flags?: FlagInput): KE_TOOL_SERVER_LIST_ACK {
  const f = resolveFlags(flags);
  const obj: KE_TOOL_SERVER_LIST_ACK = {
  };
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) obj.m_iServerCount = 0;
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) obj.m_vecServerList = ([] as KToolServerList[]);
  return obj;
}
export function putKE_TOOL_SERVER_LIST_ACK(ks: KSerializer, obj: KE_TOOL_SERVER_LIST_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) {
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { if (!(ks.putInt32((obj.m_iServerCount ?? 0)))) return false; }
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { if (!(ks.putVector((obj.m_vecServerList ?? ([] as KToolServerList[])), (ks, item: KToolServerList) => ks.putUserClass(item, putKToolServerList, f)))) return false; }
  }
  return true;
}
export function getKE_TOOL_SERVER_LIST_ACK(ks: KSerializer, flags?: FlagInput): KE_TOOL_SERVER_LIST_ACK {
  const f = resolveFlags(flags);
  const obj = createKE_TOOL_SERVER_LIST_ACK(f);
  if (Boolean(f.SERV_CCU_MONITORING_TOOL)) {
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { obj.m_iServerCount = ks.getInt32(); }
    if (Boolean(f.SERV_CCU_MONITORING_TOOL)) { obj.m_vecServerList = ks.getVector<KToolServerList>((ks) => ks.getUserClass(getKToolServerList, f)); }
  }
  return obj;
}

export interface KEGS_WORLD_TRIGGER_RELOCATION_REQ {
  m_iWorldTrigger?: Int32;
}
export function createKEGS_WORLD_TRIGGER_RELOCATION_REQ(flags?: FlagInput): KEGS_WORLD_TRIGGER_RELOCATION_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_WORLD_TRIGGER_RELOCATION_REQ = {
  };
  if (Boolean(f.SERV_WORLD_TRIGGER_RELOCATION)) obj.m_iWorldTrigger = 0;
  return obj;
}
export function putKEGS_WORLD_TRIGGER_RELOCATION_REQ(ks: KSerializer, obj: KEGS_WORLD_TRIGGER_RELOCATION_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_WORLD_TRIGGER_RELOCATION)) {
    if (Boolean(f.SERV_WORLD_TRIGGER_RELOCATION)) { if (!(ks.putInt32((obj.m_iWorldTrigger ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_WORLD_TRIGGER_RELOCATION_REQ(ks: KSerializer, flags?: FlagInput): KEGS_WORLD_TRIGGER_RELOCATION_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_WORLD_TRIGGER_RELOCATION_REQ(f);
  if (Boolean(f.SERV_WORLD_TRIGGER_RELOCATION)) {
    if (Boolean(f.SERV_WORLD_TRIGGER_RELOCATION)) { obj.m_iWorldTrigger = ks.getInt32(); }
  }
  return obj;
}

export interface KCashPruductInfo {
  m_ulProductNo?: UInt32;
  m_sProductExpire?: Int16;
  m_usProductPieces?: UInt16;
  m_iItemID?: Int32;
  m_ulSalePrice?: UInt32;
}
export function createKCashPruductInfo(flags?: FlagInput): KCashPruductInfo {
  const f = resolveFlags(flags);
  const obj: KCashPruductInfo = {
  };
  if (Boolean(f.SERV_CASH_ITEM_LIST)) obj.m_ulProductNo = 0;
  if (Boolean(f.SERV_CASH_ITEM_LIST)) obj.m_sProductExpire = 0;
  if (Boolean(f.SERV_CASH_ITEM_LIST)) obj.m_usProductPieces = 0;
  if (Boolean(f.SERV_CASH_ITEM_LIST)) obj.m_iItemID = 0;
  if (Boolean(f.SERV_CASH_ITEM_LIST)) obj.m_ulSalePrice = 0;
  return obj;
}
export function putKCashPruductInfo(ks: KSerializer, obj: KCashPruductInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CASH_ITEM_LIST)) {
    if (Boolean(f.SERV_CASH_ITEM_LIST)) { if (!(ks.putUInt32((obj.m_ulProductNo ?? 0)))) return false; }
    if (Boolean(f.SERV_CASH_ITEM_LIST)) { if (!(ks.putInt16((obj.m_sProductExpire ?? 0)))) return false; }
    if (Boolean(f.SERV_CASH_ITEM_LIST)) { if (!(ks.putUInt16((obj.m_usProductPieces ?? 0)))) return false; }
    if (Boolean(f.SERV_CASH_ITEM_LIST)) { if (!(ks.putInt32((obj.m_iItemID ?? 0)))) return false; }
    if (Boolean(f.SERV_CASH_ITEM_LIST)) { if (!(ks.putUInt32((obj.m_ulSalePrice ?? 0)))) return false; }
  }
  return true;
}
export function getKCashPruductInfo(ks: KSerializer, flags?: FlagInput): KCashPruductInfo {
  const f = resolveFlags(flags);
  const obj = createKCashPruductInfo(f);
  if (Boolean(f.SERV_CASH_ITEM_LIST)) {
    if (Boolean(f.SERV_CASH_ITEM_LIST)) { obj.m_ulProductNo = ks.getUInt32(); }
    if (Boolean(f.SERV_CASH_ITEM_LIST)) { obj.m_sProductExpire = ks.getInt16(); }
    if (Boolean(f.SERV_CASH_ITEM_LIST)) { obj.m_usProductPieces = ks.getUInt16(); }
    if (Boolean(f.SERV_CASH_ITEM_LIST)) { obj.m_iItemID = ks.getInt32(); }
    if (Boolean(f.SERV_CASH_ITEM_LIST)) { obj.m_ulSalePrice = ks.getUInt32(); }
  }
  return obj;
}

export interface KBuffSkillInfo {
  m_iCaughtUnitUID?: UidType;
  m_iBuffEnum?: Int32;
  m_iCastingUnitUID?: UidType;
  m_bIsBuffCasting?: boolean;
  m_cBuffLevel?: Int8;
}
export function createKBuffSkillInfo(flags?: FlagInput): KBuffSkillInfo {
  const f = resolveFlags(flags);
  const obj: KBuffSkillInfo = {
  };
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) obj.m_iCaughtUnitUID = 0n;
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) obj.m_iBuffEnum = 0;
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) obj.m_iCastingUnitUID = 0n;
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) obj.m_bIsBuffCasting = false;
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) obj.m_cBuffLevel = 0;
  return obj;
}
export function putKBuffSkillInfo(ks: KSerializer, obj: KBuffSkillInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) {
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { if (!(ks.putInt64((obj.m_iCaughtUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { if (!(ks.putInt32((obj.m_iBuffEnum ?? 0)))) return false; }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { if (!(ks.putInt64((obj.m_iCastingUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { if (!(ks.putBool((obj.m_bIsBuffCasting ?? false)))) return false; }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { if (!(ks.putInt8((obj.m_cBuffLevel ?? 0)))) return false; }
  }
  return true;
}
export function getKBuffSkillInfo(ks: KSerializer, flags?: FlagInput): KBuffSkillInfo {
  const f = resolveFlags(flags);
  const obj = createKBuffSkillInfo(f);
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) {
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { obj.m_iCaughtUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { obj.m_iBuffEnum = ks.getInt32(); }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { obj.m_iCastingUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { obj.m_bIsBuffCasting = ks.getBool(); }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { obj.m_cBuffLevel = ks.getInt8(); }
  }
  return obj;
}

export interface KEGS_BUFF_SKILL_INFO_CONVEY_REQ {
  m_iBuffEnum?: Int32;
  m_iCastingUnitUID?: UidType;
  m_fBuffTime?: Float32;
  m_bIsBuffCasting?: boolean;
  m_cBuffLevel?: Int8;
  m_vecCaughtUIDList?: UidType[];
}
export function createKEGS_BUFF_SKILL_INFO_CONVEY_REQ(flags?: FlagInput): KEGS_BUFF_SKILL_INFO_CONVEY_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_BUFF_SKILL_INFO_CONVEY_REQ = {
  };
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) obj.m_iBuffEnum = 0;
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) obj.m_iCastingUnitUID = 0n;
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) obj.m_fBuffTime = 0;
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) obj.m_bIsBuffCasting = false;
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) obj.m_cBuffLevel = 0;
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) obj.m_vecCaughtUIDList = ([] as UidType[]);
  return obj;
}
export function putKEGS_BUFF_SKILL_INFO_CONVEY_REQ(ks: KSerializer, obj: KEGS_BUFF_SKILL_INFO_CONVEY_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) {
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { if (!(ks.putInt32((obj.m_iBuffEnum ?? 0)))) return false; }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { if (!(ks.putInt64((obj.m_iCastingUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { if (!(ks.putFloat32((obj.m_fBuffTime ?? 0)))) return false; }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { if (!(ks.putBool((obj.m_bIsBuffCasting ?? false)))) return false; }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { if (!(ks.putInt8((obj.m_cBuffLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { if (!(ks.putVector((obj.m_vecCaughtUIDList ?? ([] as UidType[])), (ks, item: UidType) => ks.putInt64(item)))) return false; }
  }
  return true;
}
export function getKEGS_BUFF_SKILL_INFO_CONVEY_REQ(ks: KSerializer, flags?: FlagInput): KEGS_BUFF_SKILL_INFO_CONVEY_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_BUFF_SKILL_INFO_CONVEY_REQ(f);
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) {
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { obj.m_iBuffEnum = ks.getInt32(); }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { obj.m_iCastingUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { obj.m_fBuffTime = ks.getFloat32(); }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { obj.m_bIsBuffCasting = ks.getBool(); }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { obj.m_cBuffLevel = ks.getInt8(); }
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { obj.m_vecCaughtUIDList = ks.getVector<UidType>((ks) => ks.getInt64()); }
  }
  return obj;
}

export interface KEGS_BUFF_SKILL_INFO_CONVEY_NOT {
  m_mapCaughtUIDList?: Map<Int32, KBuffSkillInfo[]>;
}
export function createKEGS_BUFF_SKILL_INFO_CONVEY_NOT(flags?: FlagInput): KEGS_BUFF_SKILL_INFO_CONVEY_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_BUFF_SKILL_INFO_CONVEY_NOT = {
  };
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) obj.m_mapCaughtUIDList = new Map<Int32, KBuffSkillInfo[]>();
  return obj;
}
export function putKEGS_BUFF_SKILL_INFO_CONVEY_NOT(ks: KSerializer, obj: KEGS_BUFF_SKILL_INFO_CONVEY_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) {
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { if (!(ks.putMap((obj.m_mapCaughtUIDList ?? new Map<Int32, KBuffSkillInfo[]>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: KBuffSkillInfo[]) => ks.putVector(v, (ks, item: KBuffSkillInfo) => ks.putUserClass(item, putKBuffSkillInfo, f))))) return false; }
  }
  return true;
}
export function getKEGS_BUFF_SKILL_INFO_CONVEY_NOT(ks: KSerializer, flags?: FlagInput): KEGS_BUFF_SKILL_INFO_CONVEY_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_BUFF_SKILL_INFO_CONVEY_NOT(f);
  if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) {
    if (Boolean(f.SERV_ADD_BUFF_SKILL_INFO)) { obj.m_mapCaughtUIDList = ks.getMap<Int32, KBuffSkillInfo[]>((ks) => ks.getInt32(), (ks) => ks.getVector<KBuffSkillInfo>((ks) => ks.getUserClass(getKBuffSkillInfo, f))); }
  }
  return obj;
}

export interface KDBE_WRITE_LETTER_AND_TRADE_MOINTORING_REQ {
  m_cType?: Int8;
  m_iRecvUnitUID?: UidType;
  m_wstrRegDate?: string;
}
export function createKDBE_WRITE_LETTER_AND_TRADE_MOINTORING_REQ(flags?: FlagInput): KDBE_WRITE_LETTER_AND_TRADE_MOINTORING_REQ {
  const f = resolveFlags(flags);
  const obj: KDBE_WRITE_LETTER_AND_TRADE_MOINTORING_REQ = {
  };
  if (Boolean(f.SERV_MONITORING_LETTER_AND_TRADE)) obj.m_cType = 0;
  if (Boolean(f.SERV_MONITORING_LETTER_AND_TRADE)) obj.m_iRecvUnitUID = 0n;
  if (Boolean(f.SERV_MONITORING_LETTER_AND_TRADE)) obj.m_wstrRegDate = '';
  return obj;
}
export function putKDBE_WRITE_LETTER_AND_TRADE_MOINTORING_REQ(ks: KSerializer, obj: KDBE_WRITE_LETTER_AND_TRADE_MOINTORING_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_MONITORING_LETTER_AND_TRADE)) {
    if (Boolean(f.SERV_MONITORING_LETTER_AND_TRADE)) { if (!(ks.putInt8((obj.m_cType ?? 0)))) return false; }
    if (Boolean(f.SERV_MONITORING_LETTER_AND_TRADE)) { if (!(ks.putInt64((obj.m_iRecvUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_MONITORING_LETTER_AND_TRADE)) { if (!(ks.putWString((obj.m_wstrRegDate ?? '')))) return false; }
  }
  return true;
}
export function getKDBE_WRITE_LETTER_AND_TRADE_MOINTORING_REQ(ks: KSerializer, flags?: FlagInput): KDBE_WRITE_LETTER_AND_TRADE_MOINTORING_REQ {
  const f = resolveFlags(flags);
  const obj = createKDBE_WRITE_LETTER_AND_TRADE_MOINTORING_REQ(f);
  if (Boolean(f.SERV_MONITORING_LETTER_AND_TRADE)) {
    if (Boolean(f.SERV_MONITORING_LETTER_AND_TRADE)) { obj.m_cType = ks.getInt8(); }
    if (Boolean(f.SERV_MONITORING_LETTER_AND_TRADE)) { obj.m_iRecvUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_MONITORING_LETTER_AND_TRADE)) { obj.m_wstrRegDate = ks.getWString(); }
  }
  return obj;
}

export interface KDefenseOpenTime {
  m_iStartHour?: Int32;
  m_iStartMinute?: Int32;
  m_iDurationTime?: Int32;
}
export function createKDefenseOpenTime(flags?: FlagInput): KDefenseOpenTime {
  const f = resolveFlags(flags);
  const obj: KDefenseOpenTime = {
  };
  if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) obj.m_iStartHour = 0;
  if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) obj.m_iStartMinute = 0;
  if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) obj.m_iDurationTime = 0;
  return obj;
}
export function putKDefenseOpenTime(ks: KSerializer, obj: KDefenseOpenTime, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) {
    if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) { if (!(ks.putInt32((obj.m_iStartHour ?? 0)))) return false; }
    if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) { if (!(ks.putInt32((obj.m_iStartMinute ?? 0)))) return false; }
    if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) { if (!(ks.putInt32((obj.m_iDurationTime ?? 0)))) return false; }
  }
  return true;
}
export function getKDefenseOpenTime(ks: KSerializer, flags?: FlagInput): KDefenseOpenTime {
  const f = resolveFlags(flags);
  const obj = createKDefenseOpenTime(f);
  if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) {
    if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) { obj.m_iStartHour = ks.getInt32(); }
    if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) { obj.m_iStartMinute = ks.getInt32(); }
    if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) { obj.m_iDurationTime = ks.getInt32(); }
  }
  return obj;
}

export interface KAttribNpcUnitInfo {
  m_sNPCUnitReq?: KNPCUnitReq;
  m_sAttribEnchantNpcInfo?: KAttribEnchantNpcInfo;
}
export function createKAttribNpcUnitInfo(flags?: FlagInput): KAttribNpcUnitInfo {
  const f = resolveFlags(flags);
  const obj: KAttribNpcUnitInfo = {
  };
  if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) obj.m_sNPCUnitReq = createKNPCUnitReq(f);
  if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) obj.m_sAttribEnchantNpcInfo = createKAttribEnchantNpcInfo(f);
  return obj;
}
export function putKAttribNpcUnitInfo(ks: KSerializer, obj: KAttribNpcUnitInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) {
    if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) { if (!(ks.putUserClass((obj.m_sNPCUnitReq ?? createKNPCUnitReq(f)), putKNPCUnitReq, f))) return false; }
    if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) { if (!(ks.putUserClass((obj.m_sAttribEnchantNpcInfo ?? createKAttribEnchantNpcInfo(f)), putKAttribEnchantNpcInfo, f))) return false; }
  }
  return true;
}
export function getKAttribNpcUnitInfo(ks: KSerializer, flags?: FlagInput): KAttribNpcUnitInfo {
  const f = resolveFlags(flags);
  const obj = createKAttribNpcUnitInfo(f);
  if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) {
    if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) { obj.m_sNPCUnitReq = ks.getUserClass(getKNPCUnitReq, f); }
    if (Boolean(f.SERV_INSERT_GLOBAL_SERVER)) { obj.m_sAttribEnchantNpcInfo = ks.getUserClass(getKAttribEnchantNpcInfo, f); }
  }
  return obj;
}

export interface KMatchUserInfo {
  m_iGSUID?: UidType;
  m_iUnitUID?: UidType;
  m_iPartyUID?: UidType;
  m_wstrNickName?: string;
  m_cUnitClass?: Int8;
  m_ucLevel?: UInt8;
  m_cCurrentRank?: Int8;
  m_iOfficialMatchCnt?: Int32;
  m_iRating?: Int32;
  m_iRPoint?: Int32;
  m_iMatchWaitTime?: Int32;
}
export function createKMatchUserInfo(flags?: FlagInput): KMatchUserInfo {
  const f = resolveFlags(flags);
  const obj: KMatchUserInfo = {
  };
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iGSUID = 0n;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iPartyUID = 0n;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_wstrNickName = '';
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_cUnitClass = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_ucLevel = 0;
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) obj.m_cCurrentRank = 0;
  if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) obj.m_iOfficialMatchCnt = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iRating = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iRPoint = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iMatchWaitTime = 0;
  return obj;
}
export function putKMatchUserInfo(ks: KSerializer, obj: KMatchUserInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) {
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt64((obj.m_iGSUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt64((obj.m_iPartyUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt8((obj.m_cUnitClass ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putUInt8((obj.m_ucLevel ?? 0)))) return false; }
    if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { if (!(ks.putInt8((obj.m_cCurrentRank ?? 0)))) return false; }
    if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { if (!(ks.putInt32((obj.m_iOfficialMatchCnt ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iRating ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iRPoint ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iMatchWaitTime ?? 0)))) return false; }
  }
  return true;
}
export function getKMatchUserInfo(ks: KSerializer, flags?: FlagInput): KMatchUserInfo {
  const f = resolveFlags(flags);
  const obj = createKMatchUserInfo(f);
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) {
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iGSUID = ks.getInt64(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iPartyUID = ks.getInt64(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_wstrNickName = ks.getWString(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_cUnitClass = ks.getInt8(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_ucLevel = ks.getUInt8(); }
    if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { obj.m_cCurrentRank = ks.getInt8(); }
    if (f.SERV_PVP_NEW_SYSTEM && f.SERV_2012_PVP_SEASON2) { obj.m_iOfficialMatchCnt = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iRating = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iRPoint = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iMatchWaitTime = ks.getInt32(); }
  }
  return obj;
}

export interface KPvpNpcInfo {
  m_iNpcID?: Int32;
}
export function createKPvpNpcInfo(flags?: FlagInput): KPvpNpcInfo {
  const f = resolveFlags(flags);
  const obj: KPvpNpcInfo = {
  };
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iNpcID = 0;
  return obj;
}
export function putKPvpNpcInfo(ks: KSerializer, obj: KPvpNpcInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) {
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iNpcID ?? 0)))) return false; }
  }
  return true;
}
export function getKPvpNpcInfo(ks: KSerializer, flags?: FlagInput): KPvpNpcInfo {
  const f = resolveFlags(flags);
  const obj = createKPvpNpcInfo(f);
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) {
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iNpcID = ks.getInt32(); }
  }
  return obj;
}

export const KPvpMatchUserResultLog_END_TYPE = {
  ET_EALRY_LEAVE: 0,
  ET_ALL_KILL: 1,
  ET_TIME_OUT: 2,
  ET_LEAVE_ALL: 3,
  ET_LEAVE_SELF: 4,
  ET_ETC: 5,
} as const;
export type KPvpMatchUserResultLog_END_TYPE = (typeof KPvpMatchUserResultLog_END_TYPE)[keyof typeof KPvpMatchUserResultLog_END_TYPE];
export function getKPvpMatchUserResultLog_END_TYPE(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) {
    cur = 0;
    out['ET_EALRY_LEAVE'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) {
    out['ET_ALL_KILL'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) {
    out['ET_TIME_OUT'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) {
    out['ET_LEAVE_ALL'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) {
    out['ET_LEAVE_SELF'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) {
    out['ET_ETC'] = cur;
    cur += 1;
  }
  return out;
}
export interface KPvpMatchUserResultLog {
  m_iUnitUID?: UidType;
  m_wstrNickName?: string;
  m_ucLevel?: UInt8;
  m_cUnitClass?: Int8;
  m_iRating?: Int32;
  m_cPvpRank?: Int8;
  m_iRPoint?: Int32;
  m_iAPoint?: Int32;
  m_iOfficialMatchCnt?: Int32;
  m_cTeam?: Int8;
  m_bPartyApp?: boolean;
  m_iWaitTime?: Int32;
  m_iWin?: Int32;
  m_iKill?: Int32;
  m_iAssist?: Int32;
  m_iDeath?: Int32;
  m_iNetRatingInc?: Int32;
  m_iNetRPInc?: Int32;
  m_iNetAPInc?: Int32;
  m_iEXPearned?: Int32;
  m_cEndType?: Int8;
}
export function createKPvpMatchUserResultLog(flags?: FlagInput): KPvpMatchUserResultLog {
  const f = resolveFlags(flags);
  const obj: KPvpMatchUserResultLog = {
  };
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_wstrNickName = '';
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_ucLevel = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_cUnitClass = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iRating = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_cPvpRank = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iRPoint = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iAPoint = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iOfficialMatchCnt = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_cTeam = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_bPartyApp = false;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iWaitTime = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iWin = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iKill = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iAssist = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iDeath = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iNetRatingInc = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iNetRPInc = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iNetAPInc = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iEXPearned = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_cEndType = 5;
  return obj;
}
export function putKPvpMatchUserResultLog(ks: KSerializer, obj: KPvpMatchUserResultLog, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) {
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putUInt8((obj.m_ucLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt8((obj.m_cUnitClass ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iRating ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt8((obj.m_cPvpRank ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iRPoint ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iAPoint ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iOfficialMatchCnt ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt8((obj.m_cTeam ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putBool((obj.m_bPartyApp ?? false)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iWaitTime ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iWin ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iKill ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iAssist ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iDeath ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iNetRatingInc ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iNetRPInc ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iNetAPInc ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iEXPearned ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt8((obj.m_cEndType ?? 5)))) return false; }
  }
  return true;
}
export function getKPvpMatchUserResultLog(ks: KSerializer, flags?: FlagInput): KPvpMatchUserResultLog {
  const f = resolveFlags(flags);
  const obj = createKPvpMatchUserResultLog(f);
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) {
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_wstrNickName = ks.getWString(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_ucLevel = ks.getUInt8(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_cUnitClass = ks.getInt8(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iRating = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_cPvpRank = ks.getInt8(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iRPoint = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iAPoint = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iOfficialMatchCnt = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_cTeam = ks.getInt8(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_bPartyApp = ks.getBool(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iWaitTime = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iWin = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iKill = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iAssist = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iDeath = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iNetRatingInc = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iNetRPInc = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iNetAPInc = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iEXPearned = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_cEndType = ks.getInt8(); }
  }
  return obj;
}

export interface KPvpPlayResultInfo {
  m_iRPoint?: Int32;
  m_iAPoint?: Int32;
  m_iWinCount?: Int32;
  m_bIsPlayWithParty?: boolean;
}
export function createKPvpPlayResultInfo(flags?: FlagInput): KPvpPlayResultInfo {
  const f = resolveFlags(flags);
  const obj: KPvpPlayResultInfo = {
  };
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iRPoint = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iAPoint = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_iWinCount = 0;
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) obj.m_bIsPlayWithParty = false;
  return obj;
}
export function putKPvpPlayResultInfo(ks: KSerializer, obj: KPvpPlayResultInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) {
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iRPoint ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iAPoint ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putInt32((obj.m_iWinCount ?? 0)))) return false; }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { if (!(ks.putBool((obj.m_bIsPlayWithParty ?? false)))) return false; }
  }
  return true;
}
export function getKPvpPlayResultInfo(ks: KSerializer, flags?: FlagInput): KPvpPlayResultInfo {
  const f = resolveFlags(flags);
  const obj = createKPvpPlayResultInfo(f);
  if (Boolean(f.SERV_PVP_NEW_SYSTEM)) {
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iRPoint = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iAPoint = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_iWinCount = ks.getInt32(); }
    if (Boolean(f.SERV_PVP_NEW_SYSTEM)) { obj.m_bIsPlayWithParty = ks.getBool(); }
  }
  return obj;
}

export interface KRewardItem {
  m_iItemID?: Int32;
  m_iQuantity?: Int32;
}
export function createKRewardItem(flags?: FlagInput): KRewardItem {
  const f = resolveFlags(flags);
  const obj: KRewardItem = {
  };
  if (Boolean(f.SERV_NEXON_SESSION_PROTOCOL)) {
    if (Boolean(f.SERV_NEXON_SESSION_PROTOCOL)) obj.m_iItemID = 0;
    if (Boolean(f.SERV_NEXON_SESSION_PROTOCOL)) obj.m_iQuantity = 0;
  }
  else if (!f.SERV_NEXON_SESSION_PROTOCOL && f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB) {
    if (!f.SERV_NEXON_SESSION_PROTOCOL && f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB) obj.m_iItemID = 0;
    if (!f.SERV_NEXON_SESSION_PROTOCOL && f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB) obj.m_iQuantity = 0;
  }
  return obj;
}
export function putKRewardItem(ks: KSerializer, obj: KRewardItem, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEXON_SESSION_PROTOCOL)) {
    if (Boolean(f.SERV_NEXON_SESSION_PROTOCOL)) { if (!(ks.putInt32((obj.m_iItemID ?? 0)))) return false; }
    if (Boolean(f.SERV_NEXON_SESSION_PROTOCOL)) { if (!(ks.putInt32((obj.m_iQuantity ?? 0)))) return false; }
  }
  else if (!f.SERV_NEXON_SESSION_PROTOCOL && f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB) {
    if (!f.SERV_NEXON_SESSION_PROTOCOL && f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB) { if (!(ks.putInt32((obj.m_iItemID ?? 0)))) return false; }
    if (!f.SERV_NEXON_SESSION_PROTOCOL && f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB) { if (!(ks.putInt32((obj.m_iQuantity ?? 0)))) return false; }
  }
  return true;
}
export function getKRewardItem(ks: KSerializer, flags?: FlagInput): KRewardItem {
  const f = resolveFlags(flags);
  const obj = createKRewardItem(f);
  if (Boolean(f.SERV_NEXON_SESSION_PROTOCOL)) {
    if (Boolean(f.SERV_NEXON_SESSION_PROTOCOL)) { obj.m_iItemID = ks.getInt32(); }
    if (Boolean(f.SERV_NEXON_SESSION_PROTOCOL)) { obj.m_iQuantity = ks.getInt32(); }
  }
  else if (!f.SERV_NEXON_SESSION_PROTOCOL && f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB) {
    if (!f.SERV_NEXON_SESSION_PROTOCOL && f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB) { obj.m_iItemID = ks.getInt32(); }
    if (!f.SERV_NEXON_SESSION_PROTOCOL && f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB) { obj.m_iQuantity = ks.getInt32(); }
  }
  return obj;
}

export interface KDBE_BINGO_EVENT_INFO_READ_ACK {
  m_iOK?: Int32;
  m_iBalance?: Int32;
  m_iLotteryChance?: Int32;
  m_iLotteryRecord?: Int32;
  m_iMixChance?: Int32;
  m_iResetChance?: Int32;
  m_vecBingoBoard?: UInt8[];
  m_vecPresentInfo?: [Int32, boolean][];
}
export function createKDBE_BINGO_EVENT_INFO_READ_ACK(flags?: FlagInput): KDBE_BINGO_EVENT_INFO_READ_ACK {
  const f = resolveFlags(flags);
  const obj: KDBE_BINGO_EVENT_INFO_READ_ACK = {
  };
  if (Boolean(f.SERV_EVENT_BINGO)) obj.m_iOK = 0;
  if (Boolean(f.SERV_EVENT_BINGO)) obj.m_iBalance = 0;
  if (Boolean(f.SERV_EVENT_BINGO)) obj.m_iLotteryChance = 0;
  if (Boolean(f.SERV_EVENT_BINGO)) obj.m_iLotteryRecord = 0;
  if (Boolean(f.SERV_EVENT_BINGO)) obj.m_iMixChance = 0;
  if (Boolean(f.SERV_EVENT_BINGO)) obj.m_iResetChance = 0;
  if (Boolean(f.SERV_EVENT_BINGO)) obj.m_vecBingoBoard = ([] as UInt8[]);
  if (Boolean(f.SERV_EVENT_BINGO)) obj.m_vecPresentInfo = ([] as [Int32, boolean][]);
  return obj;
}
export function putKDBE_BINGO_EVENT_INFO_READ_ACK(ks: KSerializer, obj: KDBE_BINGO_EVENT_INFO_READ_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_EVENT_BINGO)) {
    if (Boolean(f.SERV_EVENT_BINGO)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_BINGO)) { if (!(ks.putInt32((obj.m_iBalance ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_BINGO)) { if (!(ks.putInt32((obj.m_iLotteryChance ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_BINGO)) { if (!(ks.putInt32((obj.m_iLotteryRecord ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_BINGO)) { if (!(ks.putInt32((obj.m_iMixChance ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_BINGO)) { if (!(ks.putInt32((obj.m_iResetChance ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_BINGO)) { if (!(ks.putVector((obj.m_vecBingoBoard ?? ([] as UInt8[])), (ks, item: UInt8) => ks.putUInt8(item)))) return false; }
    if (Boolean(f.SERV_EVENT_BINGO)) { if (!(ks.putVector((obj.m_vecPresentInfo ?? ([] as [Int32, boolean][])), (ks, item: [Int32, boolean]) => ks.putPair(item, (ks, a: Int32) => ks.putInt32(a), (ks, b: boolean) => ks.putBool(b))))) return false; }
  }
  return true;
}
export function getKDBE_BINGO_EVENT_INFO_READ_ACK(ks: KSerializer, flags?: FlagInput): KDBE_BINGO_EVENT_INFO_READ_ACK {
  const f = resolveFlags(flags);
  const obj = createKDBE_BINGO_EVENT_INFO_READ_ACK(f);
  if (Boolean(f.SERV_EVENT_BINGO)) {
    if (Boolean(f.SERV_EVENT_BINGO)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_BINGO)) { obj.m_iBalance = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_BINGO)) { obj.m_iLotteryChance = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_BINGO)) { obj.m_iLotteryRecord = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_BINGO)) { obj.m_iMixChance = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_BINGO)) { obj.m_iResetChance = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_BINGO)) { obj.m_vecBingoBoard = ks.getVector<UInt8>((ks) => ks.getUInt8()); }
    if (Boolean(f.SERV_EVENT_BINGO)) { obj.m_vecPresentInfo = ks.getVector<[Int32, boolean]>((ks) => ks.getPair<Int32, boolean>((ks) => ks.getInt32(), (ks) => ks.getBool())); }
  }
  return obj;
}

export interface KEGS_SELECT_UNIT_REQ {
  m_iUnitUID: UidType;
  m_setCodeEventScriptID?: Set<Int32>;
  m_mapGlobalEventData?: Map<Int32, KGlobalEventTableData>;
}
export function createKEGS_SELECT_UNIT_REQ(flags?: FlagInput): KEGS_SELECT_UNIT_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_SELECT_UNIT_REQ = {
    m_iUnitUID: 0n,
  };
  if (Boolean(f.SERV_CODE_EVENT)) obj.m_setCodeEventScriptID = new Set<Int32>();
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) obj.m_mapGlobalEventData = new Map<Int32, KGlobalEventTableData>();
  return obj;
}
export function putKEGS_SELECT_UNIT_REQ(ks: KSerializer, obj: KEGS_SELECT_UNIT_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt64(obj.m_iUnitUID))) return false;
  if (Boolean(f.SERV_CODE_EVENT)) { if (!(ks.putSet((obj.m_setCodeEventScriptID ?? new Set<Int32>()), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { if (!(ks.putMap((obj.m_mapGlobalEventData ?? new Map<Int32, KGlobalEventTableData>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: KGlobalEventTableData) => ks.putUserClass(v, putKGlobalEventTableData, f)))) return false; }
  return true;
}
export function getKEGS_SELECT_UNIT_REQ(ks: KSerializer, flags?: FlagInput): KEGS_SELECT_UNIT_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_SELECT_UNIT_REQ(f);
  obj.m_iUnitUID = ks.getInt64();
  if (Boolean(f.SERV_CODE_EVENT)) { obj.m_setCodeEventScriptID = ks.getSet<Int32>((ks) => ks.getInt32()); }
  if (Boolean(f.SERV_GLOBAL_EVENT_TABLE)) { obj.m_mapGlobalEventData = ks.getMap<Int32, KGlobalEventTableData>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKGlobalEventTableData, f)); }
  return obj;
}

export interface KEGS_SELECT_UNIT_1_NOT {
  m_iOK?: Int32;
  m_kUnitInfo?: KUnitInfo;
  m_wstrUnitCreateDate?: string;
  m_iRealDataED?: Int32;
  m_wstrUnitLastLoginDate?: string;
  m_mapInventorySlotSize?: Map<Int32, Int32>;
  m_mapItem?: Map<UidType, KInventoryItemInfo>;
  m_iNumResurrectionStone?: Int32;
  m_iNumAutoPaymentResStone?: Int32;
  m_wstrAutoPayResStoneLastDate?: string;
  m_vecUserSkillPageData?: KUserSkillPageData[];
  m_vecSkillAcquired?: KUserSkillData[];
  m_vecSkillUnsealed?: Int16[];
  m_cSkillNoteMaxPageNum?: Int8;
  m_mapSkillNote?: Map<Int8, Int32>;
  m_bIsNewUnitTradeBlock?: boolean;
  m_iNewUnitTradeBlockDay?: Int32;
  m_iNewUnitTradeBlockUnitClass?: Int32;
  m_kRelationshipInfo?: KRelationshipInfo;
}
export function createKEGS_SELECT_UNIT_1_NOT(flags?: FlagInput): KEGS_SELECT_UNIT_1_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_SELECT_UNIT_1_NOT = {
  };
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_iOK = 0;
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_kUnitInfo = createKUnitInfo(f);
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CHAR_LOG) obj.m_wstrUnitCreateDate = '';
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_LOGOUT_ED_CHECK) obj.m_iRealDataED = 0;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_DAILY_CHAR_FIRST_SELECT) obj.m_wstrUnitLastLoginDate = '';
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_mapInventorySlotSize = new Map<Int32, Int32>();
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_mapItem = new Map<UidType, KInventoryItemInfo>();
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_iNumResurrectionStone = 0;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.AP_RESTONE) obj.m_iNumAutoPaymentResStone = 0;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.AP_RESTONE) obj.m_wstrAutoPayResStoneLastDate = '';
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_SKILL_PAGE_SYSTEM) obj.m_vecUserSkillPageData = ([] as KUserSkillPageData[]);
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && !f.SERV_SKILL_PAGE_SYSTEM) obj.m_vecSkillAcquired = ([] as KUserSkillData[]);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_vecSkillUnsealed = ([] as Int16[]);
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_SKILL_NOTE) obj.m_cSkillNoteMaxPageNum = 0;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_SKILL_NOTE) obj.m_mapSkillNote = new Map<Int8, Int32>();
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_NEW_UNIT_TRADE_LIMIT) obj.m_bIsNewUnitTradeBlock = false;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_NEW_UNIT_TRADE_LIMIT) obj.m_iNewUnitTradeBlockDay = 0;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_NEW_UNIT_TRADE_LIMIT) obj.m_iNewUnitTradeBlockUnitClass = 0;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RELATIONSHIP_SYSTEM) obj.m_kRelationshipInfo = createKRelationshipInfo(f);
  return obj;
}
export function putKEGS_SELECT_UNIT_1_NOT(ks: KSerializer, obj: KEGS_SELECT_UNIT_1_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) {
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putUserClass((obj.m_kUnitInfo ?? createKUnitInfo(f)), putKUnitInfo, f))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CHAR_LOG) { if (!(ks.putWString((obj.m_wstrUnitCreateDate ?? '')))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_LOGOUT_ED_CHECK) { if (!(ks.putInt32((obj.m_iRealDataED ?? 0)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_DAILY_CHAR_FIRST_SELECT) { if (!(ks.putWString((obj.m_wstrUnitLastLoginDate ?? '')))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putMap((obj.m_mapInventorySlotSize ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putMap((obj.m_mapItem ?? new Map<UidType, KInventoryItemInfo>()), (ks, k: UidType) => ks.putInt64(k), (ks, v: KInventoryItemInfo) => ks.putUserClass(v, putKInventoryItemInfo, f)))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putInt32((obj.m_iNumResurrectionStone ?? 0)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.AP_RESTONE) { if (!(ks.putInt32((obj.m_iNumAutoPaymentResStone ?? 0)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.AP_RESTONE) { if (!(ks.putWString((obj.m_wstrAutoPayResStoneLastDate ?? '')))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_SKILL_PAGE_SYSTEM) { if (!(ks.putVector((obj.m_vecUserSkillPageData ?? ([] as KUserSkillPageData[])), (ks, item: KUserSkillPageData) => ks.putUserClass(item, putKUserSkillPageData, f)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && !f.SERV_SKILL_PAGE_SYSTEM) { if (!(ks.putVector((obj.m_vecSkillAcquired ?? ([] as KUserSkillData[])), (ks, item: KUserSkillData) => ks.putUserClass(item, putKUserSkillData, f)))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putVector((obj.m_vecSkillUnsealed ?? ([] as Int16[])), (ks, item: Int16) => ks.putInt16(item)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_SKILL_NOTE) { if (!(ks.putInt8((obj.m_cSkillNoteMaxPageNum ?? 0)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_SKILL_NOTE) { if (!(ks.putMap((obj.m_mapSkillNote ?? new Map<Int8, Int32>()), (ks, k: Int8) => ks.putInt8(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_NEW_UNIT_TRADE_LIMIT) { if (!(ks.putBool((obj.m_bIsNewUnitTradeBlock ?? false)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_NEW_UNIT_TRADE_LIMIT) { if (!(ks.putInt32((obj.m_iNewUnitTradeBlockDay ?? 0)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_NEW_UNIT_TRADE_LIMIT) { if (!(ks.putInt32((obj.m_iNewUnitTradeBlockUnitClass ?? 0)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RELATIONSHIP_SYSTEM) { if (!(ks.putUserClass((obj.m_kRelationshipInfo ?? createKRelationshipInfo(f)), putKRelationshipInfo, f))) return false; }
  }
  return true;
}
export function getKEGS_SELECT_UNIT_1_NOT(ks: KSerializer, flags?: FlagInput): KEGS_SELECT_UNIT_1_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_SELECT_UNIT_1_NOT(f);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) {
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_kUnitInfo = ks.getUserClass(getKUnitInfo, f); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CHAR_LOG) { obj.m_wstrUnitCreateDate = ks.getWString(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_LOGOUT_ED_CHECK) { obj.m_iRealDataED = ks.getInt32(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_DAILY_CHAR_FIRST_SELECT) { obj.m_wstrUnitLastLoginDate = ks.getWString(); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_mapInventorySlotSize = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_mapItem = ks.getMap<UidType, KInventoryItemInfo>((ks) => ks.getInt64(), (ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_iNumResurrectionStone = ks.getInt32(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.AP_RESTONE) { obj.m_iNumAutoPaymentResStone = ks.getInt32(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.AP_RESTONE) { obj.m_wstrAutoPayResStoneLastDate = ks.getWString(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_SKILL_PAGE_SYSTEM) { obj.m_vecUserSkillPageData = ks.getVector<KUserSkillPageData>((ks) => ks.getUserClass(getKUserSkillPageData, f)); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && !f.SERV_SKILL_PAGE_SYSTEM) { obj.m_vecSkillAcquired = ks.getVector<KUserSkillData>((ks) => ks.getUserClass(getKUserSkillData, f)); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_vecSkillUnsealed = ks.getVector<Int16>((ks) => ks.getInt16()); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_SKILL_NOTE) { obj.m_cSkillNoteMaxPageNum = ks.getInt8(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_SKILL_NOTE) { obj.m_mapSkillNote = ks.getMap<Int8, Int32>((ks) => ks.getInt8(), (ks) => ks.getInt32()); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_NEW_UNIT_TRADE_LIMIT) { obj.m_bIsNewUnitTradeBlock = ks.getBool(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_NEW_UNIT_TRADE_LIMIT) { obj.m_iNewUnitTradeBlockDay = ks.getInt32(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_NEW_UNIT_TRADE_LIMIT) { obj.m_iNewUnitTradeBlockUnitClass = ks.getInt32(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RELATIONSHIP_SYSTEM) { obj.m_kRelationshipInfo = ks.getUserClass(getKRelationshipInfo, f); }
  }
  return obj;
}

export interface KEGS_SELECT_UNIT_2_NOT {
  m_iOK?: Int32;
  m_vecQuest?: KQuestInstance[];
  m_vecCompletQuest?: KCompleteQuestInfo[] | Int32[];
  m_mapRandomQuestList?: Map<Int32, Int32>;
}
export function createKEGS_SELECT_UNIT_2_NOT(flags?: FlagInput): KEGS_SELECT_UNIT_2_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_SELECT_UNIT_2_NOT = {
  };
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_iOK = 0;
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_vecQuest = ([] as KQuestInstance[]);
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_DAILY_QUEST) obj.m_vecCompletQuest = ([] as KCompleteQuestInfo[]);
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && !f.SERV_DAILY_QUEST) obj.m_vecCompletQuest = ([] as Int32[]);
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RANDOM_DAY_QUEST) obj.m_mapRandomQuestList = new Map<Int32, Int32>();
  return obj;
}
export function putKEGS_SELECT_UNIT_2_NOT(ks: KSerializer, obj: KEGS_SELECT_UNIT_2_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) {
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putVector((obj.m_vecQuest ?? ([] as KQuestInstance[])), (ks, item: KQuestInstance) => ks.putUserClass(item, putKQuestInstance, f)))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) {
      if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_DAILY_QUEST) { if (!(ks.putVector(((obj.m_vecCompletQuest ?? ([] as KCompleteQuestInfo[])) as KCompleteQuestInfo[]), (ks, item: KCompleteQuestInfo) => ks.putUserClass(item, putKCompleteQuestInfo, f)))) return false; }
      else if (f.SERV_SELECT_UNIT_PACKET_DIVISION && !f.SERV_DAILY_QUEST) { if (!(ks.putVector(((obj.m_vecCompletQuest ?? ([] as Int32[])) as Int32[]), (ks, item: Int32) => ks.putInt32(item)))) return false; }
    }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RANDOM_DAY_QUEST) { if (!(ks.putMap((obj.m_mapRandomQuestList ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
  }
  return true;
}
export function getKEGS_SELECT_UNIT_2_NOT(ks: KSerializer, flags?: FlagInput): KEGS_SELECT_UNIT_2_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_SELECT_UNIT_2_NOT(f);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) {
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_vecQuest = ks.getVector<KQuestInstance>((ks) => ks.getUserClass(getKQuestInstance, f)); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) {
      if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_DAILY_QUEST) { obj.m_vecCompletQuest = ks.getVector<KCompleteQuestInfo>((ks) => ks.getUserClass(getKCompleteQuestInfo, f)); }
      else if (f.SERV_SELECT_UNIT_PACKET_DIVISION && !f.SERV_DAILY_QUEST) { obj.m_vecCompletQuest = ks.getVector<Int32>((ks) => ks.getInt32()); }
    }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RANDOM_DAY_QUEST) { obj.m_mapRandomQuestList = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
  }
  return obj;
}

export interface KEGS_SELECT_UNIT_3_NOT {
  m_iOK?: Int32;
  m_vecMission?: KMissionInstance[];
  m_vecTitle?: KTitleInfo[];
  m_iSummonedPetUID?: UidType;
  m_vecPetList?: KPetInfo[];
  m_vecCanEvolutionPetList?: UidType[];
  m_vecNeverSummonPetList?: UidType[];
  m_mapPetItem?: Map<UidType, Map<UidType, KInventoryItemInfo>>;
}
export function createKEGS_SELECT_UNIT_3_NOT(flags?: FlagInput): KEGS_SELECT_UNIT_3_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_SELECT_UNIT_3_NOT = {
  };
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_iOK = 0;
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_vecMission = ([] as KMissionInstance[]);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_vecTitle = ([] as KTitleInfo[]);
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) obj.m_iSummonedPetUID = 0n;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) obj.m_vecPetList = ([] as KPetInfo[]);
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) obj.m_vecCanEvolutionPetList = ([] as UidType[]);
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) obj.m_vecNeverSummonPetList = ([] as UidType[]);
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) obj.m_mapPetItem = new Map<UidType, Map<UidType, KInventoryItemInfo>>();
  return obj;
}
export function putKEGS_SELECT_UNIT_3_NOT(ks: KSerializer, obj: KEGS_SELECT_UNIT_3_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) {
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putVector((obj.m_vecMission ?? ([] as KMissionInstance[])), (ks, item: KMissionInstance) => ks.putUserClass(item, putKMissionInstance, f)))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putVector((obj.m_vecTitle ?? ([] as KTitleInfo[])), (ks, item: KTitleInfo) => ks.putUserClass(item, putKTitleInfo, f)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { if (!(ks.putInt64((obj.m_iSummonedPetUID ?? 0n)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { if (!(ks.putVector((obj.m_vecPetList ?? ([] as KPetInfo[])), (ks, item: KPetInfo) => ks.putUserClass(item, putKPetInfo, f)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { if (!(ks.putVector((obj.m_vecCanEvolutionPetList ?? ([] as UidType[])), (ks, item: UidType) => ks.putInt64(item)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { if (!(ks.putVector((obj.m_vecNeverSummonPetList ?? ([] as UidType[])), (ks, item: UidType) => ks.putInt64(item)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { if (!(ks.putMap((obj.m_mapPetItem ?? new Map<UidType, Map<UidType, KInventoryItemInfo>>()), (ks, k: UidType) => ks.putInt64(k), (ks, v: Map<UidType, KInventoryItemInfo>) => ks.putMap(v, (ks, k: UidType) => ks.putInt64(k), (ks, v: KInventoryItemInfo) => ks.putUserClass(v, putKInventoryItemInfo, f))))) return false; }
  }
  return true;
}
export function getKEGS_SELECT_UNIT_3_NOT(ks: KSerializer, flags?: FlagInput): KEGS_SELECT_UNIT_3_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_SELECT_UNIT_3_NOT(f);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) {
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_vecMission = ks.getVector<KMissionInstance>((ks) => ks.getUserClass(getKMissionInstance, f)); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_vecTitle = ks.getVector<KTitleInfo>((ks) => ks.getUserClass(getKTitleInfo, f)); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { obj.m_iSummonedPetUID = ks.getInt64(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { obj.m_vecPetList = ks.getVector<KPetInfo>((ks) => ks.getUserClass(getKPetInfo, f)); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { obj.m_vecCanEvolutionPetList = ks.getVector<UidType>((ks) => ks.getInt64()); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { obj.m_vecNeverSummonPetList = ks.getVector<UidType>((ks) => ks.getInt64()); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { obj.m_mapPetItem = ks.getMap<UidType, Map<UidType, KInventoryItemInfo>>((ks) => ks.getInt64(), (ks) => ks.getMap<UidType, KInventoryItemInfo>((ks) => ks.getInt64(), (ks) => ks.getUserClass(getKInventoryItemInfo, f))); }
  }
  return obj;
}

export interface KEGS_SELECT_UNIT_4_NOT {
  m_iOK?: Int32;
  m_vecChatBlackList?: KChatBlackListUnit[];
  m_kDenyOptions?: KDenyOptions;
  m_bIsRecommend?: boolean;
  m_iRecommendUnitUID?: UidType;
  m_vecRecruiterUnitInfo?: KRecommendUserInfo[];
  m_vecRecruitUnitInfo?: KRecommendUserInfo[];
  m_vecTutorialDBUnitInfo?: KTutorialDBUnitInfo[];
  m_vecConnectTimeEvent?: KConnectTimeEventInfo[];
  m_vecCumulativeTimeEvent?: KCumulativeTimeEventInfo[];
  m_vecHenirRanking?: KHenirRankingInfo[];
  m_kMessengerInfo?: KMessengerInfo;
  m_kGamePlayStatus?: KGamePlayStatusContainer;
}
export function createKEGS_SELECT_UNIT_4_NOT(flags?: FlagInput): KEGS_SELECT_UNIT_4_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_SELECT_UNIT_4_NOT = {
  };
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_iOK = 0;
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_vecChatBlackList = ([] as KChatBlackListUnit[]);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_kDenyOptions = createKDenyOptions(f);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_bIsRecommend = false;
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_iRecommendUnitUID = 0n;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RECRUIT_EVENT_BASE) obj.m_vecRecruiterUnitInfo = ([] as KRecommendUserInfo[]);
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RECRUIT_EVENT_BASE) obj.m_vecRecruitUnitInfo = ([] as KRecommendUserInfo[]);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_vecTutorialDBUnitInfo = ([] as KTutorialDBUnitInfo[]);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_vecConnectTimeEvent = ([] as KConnectTimeEventInfo[]);
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.CUMULATIVE_TIME_EVENT) obj.m_vecCumulativeTimeEvent = ([] as KCumulativeTimeEventInfo[]);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_vecHenirRanking = ([] as KHenirRankingInfo[]);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_kMessengerInfo = createKMessengerInfo(f);
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_BATTLE_FIELD_SYSTEM) obj.m_kGamePlayStatus = createKGamePlayStatusContainer(f);
  return obj;
}
export function putKEGS_SELECT_UNIT_4_NOT(ks: KSerializer, obj: KEGS_SELECT_UNIT_4_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) {
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putVector((obj.m_vecChatBlackList ?? ([] as KChatBlackListUnit[])), (ks, item: KChatBlackListUnit) => ks.putUserClass(item, putKChatBlackListUnit, f)))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putUserClass((obj.m_kDenyOptions ?? createKDenyOptions(f)), putKDenyOptions, f))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putBool((obj.m_bIsRecommend ?? false)))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putInt64((obj.m_iRecommendUnitUID ?? 0n)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RECRUIT_EVENT_BASE) { if (!(ks.putVector((obj.m_vecRecruiterUnitInfo ?? ([] as KRecommendUserInfo[])), (ks, item: KRecommendUserInfo) => ks.putUserClass(item, putKRecommendUserInfo, f)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RECRUIT_EVENT_BASE) { if (!(ks.putVector((obj.m_vecRecruitUnitInfo ?? ([] as KRecommendUserInfo[])), (ks, item: KRecommendUserInfo) => ks.putUserClass(item, putKRecommendUserInfo, f)))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putVector((obj.m_vecTutorialDBUnitInfo ?? ([] as KTutorialDBUnitInfo[])), (ks, item: KTutorialDBUnitInfo) => ks.putUserClass(item, putKTutorialDBUnitInfo, f)))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putVector((obj.m_vecConnectTimeEvent ?? ([] as KConnectTimeEventInfo[])), (ks, item: KConnectTimeEventInfo) => ks.putUserClass(item, putKConnectTimeEventInfo, f)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.CUMULATIVE_TIME_EVENT) { if (!(ks.putVector((obj.m_vecCumulativeTimeEvent ?? ([] as KCumulativeTimeEventInfo[])), (ks, item: KCumulativeTimeEventInfo) => ks.putUserClass(item, putKCumulativeTimeEventInfo, f)))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putVector((obj.m_vecHenirRanking ?? ([] as KHenirRankingInfo[])), (ks, item: KHenirRankingInfo) => ks.putUserClass(item, putKHenirRankingInfo, f)))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putUserClass((obj.m_kMessengerInfo ?? createKMessengerInfo(f)), putKMessengerInfo, f))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_BATTLE_FIELD_SYSTEM) { if (!(ks.putUserClass((obj.m_kGamePlayStatus ?? createKGamePlayStatusContainer(f)), putKGamePlayStatusContainer, f))) return false; }
  }
  return true;
}
export function getKEGS_SELECT_UNIT_4_NOT(ks: KSerializer, flags?: FlagInput): KEGS_SELECT_UNIT_4_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_SELECT_UNIT_4_NOT(f);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) {
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_vecChatBlackList = ks.getVector<KChatBlackListUnit>((ks) => ks.getUserClass(getKChatBlackListUnit, f)); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_kDenyOptions = ks.getUserClass(getKDenyOptions, f); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_bIsRecommend = ks.getBool(); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_iRecommendUnitUID = ks.getInt64(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RECRUIT_EVENT_BASE) { obj.m_vecRecruiterUnitInfo = ks.getVector<KRecommendUserInfo>((ks) => ks.getUserClass(getKRecommendUserInfo, f)); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RECRUIT_EVENT_BASE) { obj.m_vecRecruitUnitInfo = ks.getVector<KRecommendUserInfo>((ks) => ks.getUserClass(getKRecommendUserInfo, f)); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_vecTutorialDBUnitInfo = ks.getVector<KTutorialDBUnitInfo>((ks) => ks.getUserClass(getKTutorialDBUnitInfo, f)); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_vecConnectTimeEvent = ks.getVector<KConnectTimeEventInfo>((ks) => ks.getUserClass(getKConnectTimeEventInfo, f)); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.CUMULATIVE_TIME_EVENT) { obj.m_vecCumulativeTimeEvent = ks.getVector<KCumulativeTimeEventInfo>((ks) => ks.getUserClass(getKCumulativeTimeEventInfo, f)); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_vecHenirRanking = ks.getVector<KHenirRankingInfo>((ks) => ks.getUserClass(getKHenirRankingInfo, f)); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_kMessengerInfo = ks.getUserClass(getKMessengerInfo, f); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_BATTLE_FIELD_SYSTEM) { obj.m_kGamePlayStatus = ks.getUserClass(getKGamePlayStatusContainer, f); }
  }
  return obj;
}

export interface KEGS_SELECT_UNIT_5_NOT {
  m_iOK?: Int32;
  m_bIsSpiritUpdated?: boolean;
  m_mapCharGameCount?: Map<Int32, Int32>;
  m_kPShopAgencyInfo?: KUserPShopAgencyInfo;
  m_PacketHenirRewardCount?: KEGS_HENIR_REWARD_COUNT_NOT;
  m_bCashShopOpen?: boolean;
  m_iEventMoney?: Int32;
  m_iPvpEventIndex?: Int32;
  m_wstrLastPvpEventDate?: string;
  m_kBingoEvent?: KDBE_BINGO_EVENT_INFO_READ_ACK;
  m_bFirstSelect?: boolean;
  m_iCustomEventID?: boolean;
  m_bLocalRankingUser?: boolean;
  m_iConnectExperienceAck?: Int32;
  m_iReward7DaysItem?: Int32;
  m_iGateOfDarknessSupportEventTime?: Int32;
  m_bCouple?: boolean;
  m_iRelationTargetUserUid?: UidType;
  m_wstrRelationTargetUserNickname?: string;
  m_bOnlySteamUser?: boolean;
  m_bOnlyNotSteamUser?: boolean;
  m_iNoteViewCount?: Int32;
  m_wstrGiveMeTheItemTime_One?: string;
  m_wstrGiveMeTheItemTime_Two?: string;
  m_wstrGiveMeTheItemTime_Tree?: string;
  m_vec4ThAnnivEventRewardInfo?: boolean[];
  m_tLastRewardTime?: Int64;
}
export function createKEGS_SELECT_UNIT_5_NOT(flags?: FlagInput): KEGS_SELECT_UNIT_5_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_SELECT_UNIT_5_NOT = {
  };
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_iOK = 0;
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_bIsSpiritUpdated = false;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CHAR_LOG) obj.m_mapCharGameCount = new Map<Int32, Int32>();
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PSHOP_AGENCY) obj.m_kPShopAgencyInfo = createKUserPShopAgencyInfo(f);
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_NEW_HENIR_TEST) obj.m_PacketHenirRewardCount = createKEGS_HENIR_REWARD_COUNT_NOT(f);
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CONTENT_MANAGER) obj.m_bCashShopOpen = false;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_MONEY) obj.m_iEventMoney = 0;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_2012_PVP_SEASON2_EVENT) obj.m_iPvpEventIndex = 0;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_2012_PVP_SEASON2_EVENT) obj.m_wstrLastPvpEventDate = '';
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_BINGO) obj.m_kBingoEvent = createKDBE_BINGO_EVENT_INFO_READ_ACK(f);
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_ARA_FIRST_SELECT_TUTORIAL) obj.m_bFirstSelect = false;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CUSTOM_CONNECT_EVENT) obj.m_iCustomEventID = false;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_LOCAL_RANKING_SYSTEM) obj.m_bLocalRankingUser = false;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_BOUNS_ITEM_AFTER_7DAYS_BY_LEVEL) obj.m_iConnectExperienceAck = -1;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_BOUNS_ITEM_AFTER_7DAYS_BY_LEVEL) obj.m_iReward7DaysItem = -1;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_GATE_OF_DARKNESS_SUPPORT_EVENT) obj.m_iGateOfDarknessSupportEventTime = 0;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RELATIONSHIP_EVENT_INT) obj.m_bCouple = false;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RELATIONSHIP_EVENT_INT) obj.m_iRelationTargetUserUid = 0n;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RELATIONSHIP_EVENT_INT) obj.m_wstrRelationTargetUserNickname = '';
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_STEAM_USER_CONNECT_EVENT) obj.m_bOnlySteamUser = false;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_STEAM_USER_CONNECT_EVENT) obj.m_bOnlyNotSteamUser = false;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_ELESIS_UPDATE_EVENT) obj.m_iNoteViewCount = 0;
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_CHUNG_GIVE_ITEM) obj.m_wstrGiveMeTheItemTime_One = '1900-01-01 00:00:00';
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_CHUNG_GIVE_ITEM) obj.m_wstrGiveMeTheItemTime_Two = '1900-01-01 00:00:00';
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_CHUNG_GIVE_ITEM) obj.m_wstrGiveMeTheItemTime_Tree = '1900-01-01 00:00:00';
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_4TH_ANNIVERSARY_EVENT) obj.m_vec4ThAnnivEventRewardInfo = ([] as boolean[]);
  if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_4TH_ANNIVERSARY_EVENT) obj.m_tLastRewardTime = 0n;
  return obj;
}
export function putKEGS_SELECT_UNIT_5_NOT(ks: KSerializer, obj: KEGS_SELECT_UNIT_5_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) {
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putBool((obj.m_bIsSpiritUpdated ?? false)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CHAR_LOG) { if (!(ks.putMap((obj.m_mapCharGameCount ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PSHOP_AGENCY) { if (!(ks.putUserClass((obj.m_kPShopAgencyInfo ?? createKUserPShopAgencyInfo(f)), putKUserPShopAgencyInfo, f))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_NEW_HENIR_TEST) { if (!(ks.putUserClass((obj.m_PacketHenirRewardCount ?? createKEGS_HENIR_REWARD_COUNT_NOT(f)), putKEGS_HENIR_REWARD_COUNT_NOT, f))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CONTENT_MANAGER) { if (!(ks.putBool((obj.m_bCashShopOpen ?? false)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_MONEY) { if (!(ks.putInt32((obj.m_iEventMoney ?? 0)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_2012_PVP_SEASON2_EVENT) { if (!(ks.putInt32((obj.m_iPvpEventIndex ?? 0)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_2012_PVP_SEASON2_EVENT) { if (!(ks.putWString((obj.m_wstrLastPvpEventDate ?? '')))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_BINGO) { if (!(ks.putUserClass((obj.m_kBingoEvent ?? createKDBE_BINGO_EVENT_INFO_READ_ACK(f)), putKDBE_BINGO_EVENT_INFO_READ_ACK, f))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_ARA_FIRST_SELECT_TUTORIAL) { if (!(ks.putBool((obj.m_bFirstSelect ?? false)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CUSTOM_CONNECT_EVENT) { if (!(ks.putBool((obj.m_iCustomEventID ?? false)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_LOCAL_RANKING_SYSTEM) { if (!(ks.putBool((obj.m_bLocalRankingUser ?? false)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_BOUNS_ITEM_AFTER_7DAYS_BY_LEVEL) { if (!(ks.putInt32((obj.m_iConnectExperienceAck ?? -1)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_BOUNS_ITEM_AFTER_7DAYS_BY_LEVEL) { if (!(ks.putInt32((obj.m_iReward7DaysItem ?? -1)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_GATE_OF_DARKNESS_SUPPORT_EVENT) { if (!(ks.putInt32((obj.m_iGateOfDarknessSupportEventTime ?? 0)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RELATIONSHIP_EVENT_INT) { if (!(ks.putBool((obj.m_bCouple ?? false)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RELATIONSHIP_EVENT_INT) { if (!(ks.putInt64((obj.m_iRelationTargetUserUid ?? 0n)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RELATIONSHIP_EVENT_INT) { if (!(ks.putWString((obj.m_wstrRelationTargetUserNickname ?? '')))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_STEAM_USER_CONNECT_EVENT) { if (!(ks.putBool((obj.m_bOnlySteamUser ?? false)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_STEAM_USER_CONNECT_EVENT) { if (!(ks.putBool((obj.m_bOnlyNotSteamUser ?? false)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_ELESIS_UPDATE_EVENT) { if (!(ks.putInt32((obj.m_iNoteViewCount ?? 0)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_CHUNG_GIVE_ITEM) { if (!(ks.putWString((obj.m_wstrGiveMeTheItemTime_One ?? '1900-01-01 00:00:00')))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_CHUNG_GIVE_ITEM) { if (!(ks.putWString((obj.m_wstrGiveMeTheItemTime_Two ?? '1900-01-01 00:00:00')))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_CHUNG_GIVE_ITEM) { if (!(ks.putWString((obj.m_wstrGiveMeTheItemTime_Tree ?? '1900-01-01 00:00:00')))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_4TH_ANNIVERSARY_EVENT) { if (!(ks.putVector((obj.m_vec4ThAnnivEventRewardInfo ?? ([] as boolean[])), (ks, item: boolean) => ks.putBool(item)))) return false; }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_4TH_ANNIVERSARY_EVENT) { if (!(ks.putInt64((obj.m_tLastRewardTime ?? 0n)))) return false; }
  }
  return true;
}
export function getKEGS_SELECT_UNIT_5_NOT(ks: KSerializer, flags?: FlagInput): KEGS_SELECT_UNIT_5_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_SELECT_UNIT_5_NOT(f);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) {
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_bIsSpiritUpdated = ks.getBool(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CHAR_LOG) { obj.m_mapCharGameCount = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PSHOP_AGENCY) { obj.m_kPShopAgencyInfo = ks.getUserClass(getKUserPShopAgencyInfo, f); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_NEW_HENIR_TEST) { obj.m_PacketHenirRewardCount = ks.getUserClass(getKEGS_HENIR_REWARD_COUNT_NOT, f); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CONTENT_MANAGER) { obj.m_bCashShopOpen = ks.getBool(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_MONEY) { obj.m_iEventMoney = ks.getInt32(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_2012_PVP_SEASON2_EVENT) { obj.m_iPvpEventIndex = ks.getInt32(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_2012_PVP_SEASON2_EVENT) { obj.m_wstrLastPvpEventDate = ks.getWString(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_BINGO) { obj.m_kBingoEvent = ks.getUserClass(getKDBE_BINGO_EVENT_INFO_READ_ACK, f); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_ARA_FIRST_SELECT_TUTORIAL) { obj.m_bFirstSelect = ks.getBool(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CUSTOM_CONNECT_EVENT) { obj.m_iCustomEventID = ks.getBool(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_LOCAL_RANKING_SYSTEM) { obj.m_bLocalRankingUser = ks.getBool(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_BOUNS_ITEM_AFTER_7DAYS_BY_LEVEL) { obj.m_iConnectExperienceAck = ks.getInt32(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_BOUNS_ITEM_AFTER_7DAYS_BY_LEVEL) { obj.m_iReward7DaysItem = ks.getInt32(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_GATE_OF_DARKNESS_SUPPORT_EVENT) { obj.m_iGateOfDarknessSupportEventTime = ks.getInt32(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RELATIONSHIP_EVENT_INT) { obj.m_bCouple = ks.getBool(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RELATIONSHIP_EVENT_INT) { obj.m_iRelationTargetUserUid = ks.getInt64(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RELATIONSHIP_EVENT_INT) { obj.m_wstrRelationTargetUserNickname = ks.getWString(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_STEAM_USER_CONNECT_EVENT) { obj.m_bOnlySteamUser = ks.getBool(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_STEAM_USER_CONNECT_EVENT) { obj.m_bOnlyNotSteamUser = ks.getBool(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_ELESIS_UPDATE_EVENT) { obj.m_iNoteViewCount = ks.getInt32(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_CHUNG_GIVE_ITEM) { obj.m_wstrGiveMeTheItemTime_One = ks.getWString(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_CHUNG_GIVE_ITEM) { obj.m_wstrGiveMeTheItemTime_Two = ks.getWString(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_CHUNG_GIVE_ITEM) { obj.m_wstrGiveMeTheItemTime_Tree = ks.getWString(); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_4TH_ANNIVERSARY_EVENT) { obj.m_vec4ThAnnivEventRewardInfo = ks.getVector<boolean>((ks) => ks.getBool()); }
    if (f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_4TH_ANNIVERSARY_EVENT) { obj.m_tLastRewardTime = ks.getInt64(); }
  }
  return obj;
}

export interface KEGS_SELECT_UNIT_ACK {
  m_iOK?: Int32;
  m_kUnitInfo?: KUnitInfo;
  m_wstrUnitCreateDate?: string;
  m_iRealDataED?: Int32;
  m_wstrUnitLastLoginDate?: string;
  m_mapInventorySlotSize?: Map<Int32, Int32>;
  m_mapItem?: Map<UidType, KInventoryItemInfo>;
  m_mapPetItem?: Map<UidType, Map<UidType, KInventoryItemInfo>>;
  m_iNumResurrectionStone?: Int32;
  m_iNumAutoPaymentResStone?: Int32;
  m_wstrAutoPayResStoneLastDate?: string;
  m_vecQuest?: KQuestInstance[];
  m_vecCompletQuest?: KCompleteQuestInfo[] | Int32[];
  m_vecMission?: KMissionInstance[];
  m_vecTitle?: KTitleInfo[];
  m_vecSkillAcquired?: KUserSkillData[];
  m_vecSkillUnsealed?: Int16[];
  m_cSkillNoteMaxPageNum?: Int8;
  m_mapSkillNote?: Map<Int8, Int32>;
  m_vecChatBlackList?: KChatBlackListUnit[];
  m_kDenyOptions?: KDenyOptions;
  m_bIsRecommend?: boolean;
  m_iRecommendUnitUID?: UidType;
  m_vecTutorialDBUnitInfo?: KTutorialDBUnitInfo[];
  m_bIsSpiritUpdated?: boolean;
  m_vecConnectTimeEvent?: KConnectTimeEventInfo[];
  m_vecCumulativeTimeEvent?: KCumulativeTimeEventInfo[];
  m_vecHenirRanking?: KHenirRankingInfo[];
  m_kMessengerInfo?: KMessengerInfo;
  m_iSummonedPetUID?: UidType;
  m_vecPetList?: KPetInfo[];
  m_vecCanEvolutionPetList?: UidType[];
  m_vecNeverSummonPetList?: UidType[];
  m_mapCharGameCount?: Map<Int32, Int32>;
  m_kPShopAgencyInfo?: KUserPShopAgencyInfo;
  m_PacketHenirRewardCount?: KEGS_HENIR_REWARD_COUNT_NOT;
  m_mapRandomQuestList?: Map<Int32, Int32>;
  m_bCashShopOpen?: boolean;
  m_kGamePlayStatus?: KGamePlayStatusContainer;
  m_iEventMoney?: Int32;
  m_iPvpEventIndex?: Int32;
  m_wstrLastPvpEventDate?: string;
  m_kBingoEvent?: KDBE_BINGO_EVENT_INFO_READ_ACK;
  m_iCustomEventID?: boolean;
}
export function createKEGS_SELECT_UNIT_ACK(flags?: FlagInput): KEGS_SELECT_UNIT_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_SELECT_UNIT_ACK = {
  };
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) {
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) obj.m_iOK = 0;
  }
  else if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) {
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_iOK = 0;
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_kUnitInfo = createKUnitInfo(f);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CHAR_LOG) obj.m_wstrUnitCreateDate = '';
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_LOGOUT_ED_CHECK) obj.m_iRealDataED = 0;
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_DAILY_CHAR_FIRST_SELECT) obj.m_wstrUnitLastLoginDate = '';
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_mapInventorySlotSize = new Map<Int32, Int32>();
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_mapItem = new Map<UidType, KInventoryItemInfo>();
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) obj.m_mapPetItem = new Map<UidType, Map<UidType, KInventoryItemInfo>>();
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_iNumResurrectionStone = 0;
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.AP_RESTONE) obj.m_iNumAutoPaymentResStone = 0;
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.AP_RESTONE) obj.m_wstrAutoPayResStoneLastDate = '';
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_vecQuest = ([] as KQuestInstance[]);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_DAILY_QUEST) obj.m_vecCompletQuest = ([] as KCompleteQuestInfo[]);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && !f.SERV_DAILY_QUEST) obj.m_vecCompletQuest = ([] as Int32[]);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_vecMission = ([] as KMissionInstance[]);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_vecTitle = ([] as KTitleInfo[]);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_vecSkillAcquired = ([] as KUserSkillData[]);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_vecSkillUnsealed = ([] as Int16[]);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_SKILL_NOTE) obj.m_cSkillNoteMaxPageNum = 0;
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_SKILL_NOTE) obj.m_mapSkillNote = new Map<Int8, Int32>();
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_vecChatBlackList = ([] as KChatBlackListUnit[]);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_kDenyOptions = createKDenyOptions(f);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_bIsRecommend = false;
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_iRecommendUnitUID = 0n;
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_vecTutorialDBUnitInfo = ([] as KTutorialDBUnitInfo[]);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_bIsSpiritUpdated = false;
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_vecConnectTimeEvent = ([] as KConnectTimeEventInfo[]);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.CUMULATIVE_TIME_EVENT) obj.m_vecCumulativeTimeEvent = ([] as KCumulativeTimeEventInfo[]);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_vecHenirRanking = ([] as KHenirRankingInfo[]);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) obj.m_kMessengerInfo = createKMessengerInfo(f);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) obj.m_iSummonedPetUID = 0n;
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) obj.m_vecPetList = ([] as KPetInfo[]);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) obj.m_vecCanEvolutionPetList = ([] as UidType[]);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) obj.m_vecNeverSummonPetList = ([] as UidType[]);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CHAR_LOG) obj.m_mapCharGameCount = new Map<Int32, Int32>();
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PSHOP_AGENCY) obj.m_kPShopAgencyInfo = createKUserPShopAgencyInfo(f);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_NEW_HENIR_TEST) obj.m_PacketHenirRewardCount = createKEGS_HENIR_REWARD_COUNT_NOT(f);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RANDOM_DAY_QUEST) obj.m_mapRandomQuestList = new Map<Int32, Int32>();
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CONTENT_MANAGER) obj.m_bCashShopOpen = false;
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_BATTLE_FIELD_SYSTEM) obj.m_kGamePlayStatus = createKGamePlayStatusContainer(f);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_MONEY) obj.m_iEventMoney = 0;
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_2012_PVP_SEASON2_EVENT) obj.m_iPvpEventIndex = 0;
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_2012_PVP_SEASON2_EVENT) obj.m_wstrLastPvpEventDate = '';
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_BINGO) obj.m_kBingoEvent = createKDBE_BINGO_EVENT_INFO_READ_ACK(f);
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CUSTOM_CONNECT_EVENT) obj.m_iCustomEventID = false;
  }
  return obj;
}
export function putKEGS_SELECT_UNIT_ACK(ks: KSerializer, obj: KEGS_SELECT_UNIT_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) {
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
  }
  else if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) {
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putUserClass((obj.m_kUnitInfo ?? createKUnitInfo(f)), putKUnitInfo, f))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CHAR_LOG) { if (!(ks.putWString((obj.m_wstrUnitCreateDate ?? '')))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_LOGOUT_ED_CHECK) { if (!(ks.putInt32((obj.m_iRealDataED ?? 0)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_DAILY_CHAR_FIRST_SELECT) { if (!(ks.putWString((obj.m_wstrUnitLastLoginDate ?? '')))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putMap((obj.m_mapInventorySlotSize ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putMap((obj.m_mapItem ?? new Map<UidType, KInventoryItemInfo>()), (ks, k: UidType) => ks.putInt64(k), (ks, v: KInventoryItemInfo) => ks.putUserClass(v, putKInventoryItemInfo, f)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { if (!(ks.putMap((obj.m_mapPetItem ?? new Map<UidType, Map<UidType, KInventoryItemInfo>>()), (ks, k: UidType) => ks.putInt64(k), (ks, v: Map<UidType, KInventoryItemInfo>) => ks.putMap(v, (ks, k: UidType) => ks.putInt64(k), (ks, v: KInventoryItemInfo) => ks.putUserClass(v, putKInventoryItemInfo, f))))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putInt32((obj.m_iNumResurrectionStone ?? 0)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.AP_RESTONE) { if (!(ks.putInt32((obj.m_iNumAutoPaymentResStone ?? 0)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.AP_RESTONE) { if (!(ks.putWString((obj.m_wstrAutoPayResStoneLastDate ?? '')))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putVector((obj.m_vecQuest ?? ([] as KQuestInstance[])), (ks, item: KQuestInstance) => ks.putUserClass(item, putKQuestInstance, f)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) {
      if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_DAILY_QUEST) { if (!(ks.putVector(((obj.m_vecCompletQuest ?? ([] as KCompleteQuestInfo[])) as KCompleteQuestInfo[]), (ks, item: KCompleteQuestInfo) => ks.putUserClass(item, putKCompleteQuestInfo, f)))) return false; }
      else if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && !f.SERV_DAILY_QUEST) { if (!(ks.putVector(((obj.m_vecCompletQuest ?? ([] as Int32[])) as Int32[]), (ks, item: Int32) => ks.putInt32(item)))) return false; }
    }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putVector((obj.m_vecMission ?? ([] as KMissionInstance[])), (ks, item: KMissionInstance) => ks.putUserClass(item, putKMissionInstance, f)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putVector((obj.m_vecTitle ?? ([] as KTitleInfo[])), (ks, item: KTitleInfo) => ks.putUserClass(item, putKTitleInfo, f)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putVector((obj.m_vecSkillAcquired ?? ([] as KUserSkillData[])), (ks, item: KUserSkillData) => ks.putUserClass(item, putKUserSkillData, f)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putVector((obj.m_vecSkillUnsealed ?? ([] as Int16[])), (ks, item: Int16) => ks.putInt16(item)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_SKILL_NOTE) { if (!(ks.putInt8((obj.m_cSkillNoteMaxPageNum ?? 0)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_SKILL_NOTE) { if (!(ks.putMap((obj.m_mapSkillNote ?? new Map<Int8, Int32>()), (ks, k: Int8) => ks.putInt8(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putVector((obj.m_vecChatBlackList ?? ([] as KChatBlackListUnit[])), (ks, item: KChatBlackListUnit) => ks.putUserClass(item, putKChatBlackListUnit, f)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putUserClass((obj.m_kDenyOptions ?? createKDenyOptions(f)), putKDenyOptions, f))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putBool((obj.m_bIsRecommend ?? false)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putInt64((obj.m_iRecommendUnitUID ?? 0n)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putVector((obj.m_vecTutorialDBUnitInfo ?? ([] as KTutorialDBUnitInfo[])), (ks, item: KTutorialDBUnitInfo) => ks.putUserClass(item, putKTutorialDBUnitInfo, f)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putBool((obj.m_bIsSpiritUpdated ?? false)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putVector((obj.m_vecConnectTimeEvent ?? ([] as KConnectTimeEventInfo[])), (ks, item: KConnectTimeEventInfo) => ks.putUserClass(item, putKConnectTimeEventInfo, f)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.CUMULATIVE_TIME_EVENT) { if (!(ks.putVector((obj.m_vecCumulativeTimeEvent ?? ([] as KCumulativeTimeEventInfo[])), (ks, item: KCumulativeTimeEventInfo) => ks.putUserClass(item, putKCumulativeTimeEventInfo, f)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putVector((obj.m_vecHenirRanking ?? ([] as KHenirRankingInfo[])), (ks, item: KHenirRankingInfo) => ks.putUserClass(item, putKHenirRankingInfo, f)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { if (!(ks.putUserClass((obj.m_kMessengerInfo ?? createKMessengerInfo(f)), putKMessengerInfo, f))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { if (!(ks.putInt64((obj.m_iSummonedPetUID ?? 0n)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { if (!(ks.putVector((obj.m_vecPetList ?? ([] as KPetInfo[])), (ks, item: KPetInfo) => ks.putUserClass(item, putKPetInfo, f)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { if (!(ks.putVector((obj.m_vecCanEvolutionPetList ?? ([] as UidType[])), (ks, item: UidType) => ks.putInt64(item)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { if (!(ks.putVector((obj.m_vecNeverSummonPetList ?? ([] as UidType[])), (ks, item: UidType) => ks.putInt64(item)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CHAR_LOG) { if (!(ks.putMap((obj.m_mapCharGameCount ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PSHOP_AGENCY) { if (!(ks.putUserClass((obj.m_kPShopAgencyInfo ?? createKUserPShopAgencyInfo(f)), putKUserPShopAgencyInfo, f))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_NEW_HENIR_TEST) { if (!(ks.putUserClass((obj.m_PacketHenirRewardCount ?? createKEGS_HENIR_REWARD_COUNT_NOT(f)), putKEGS_HENIR_REWARD_COUNT_NOT, f))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RANDOM_DAY_QUEST) { if (!(ks.putMap((obj.m_mapRandomQuestList ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CONTENT_MANAGER) { if (!(ks.putBool((obj.m_bCashShopOpen ?? false)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_BATTLE_FIELD_SYSTEM) { if (!(ks.putUserClass((obj.m_kGamePlayStatus ?? createKGamePlayStatusContainer(f)), putKGamePlayStatusContainer, f))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_MONEY) { if (!(ks.putInt32((obj.m_iEventMoney ?? 0)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_2012_PVP_SEASON2_EVENT) { if (!(ks.putInt32((obj.m_iPvpEventIndex ?? 0)))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_2012_PVP_SEASON2_EVENT) { if (!(ks.putWString((obj.m_wstrLastPvpEventDate ?? '')))) return false; }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_BINGO) { if (!(ks.putUserClass((obj.m_kBingoEvent ?? createKDBE_BINGO_EVENT_INFO_READ_ACK(f)), putKDBE_BINGO_EVENT_INFO_READ_ACK, f))) return false; }
  }
  return true;
}
export function getKEGS_SELECT_UNIT_ACK(ks: KSerializer, flags?: FlagInput): KEGS_SELECT_UNIT_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_SELECT_UNIT_ACK(f);
  if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) {
    if (Boolean(f.SERV_SELECT_UNIT_PACKET_DIVISION)) { obj.m_iOK = ks.getInt32(); }
  }
  else if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) {
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_iOK = ks.getInt32(); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_kUnitInfo = ks.getUserClass(getKUnitInfo, f); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CHAR_LOG) { obj.m_wstrUnitCreateDate = ks.getWString(); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_LOGOUT_ED_CHECK) { obj.m_iRealDataED = ks.getInt32(); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_DAILY_CHAR_FIRST_SELECT) { obj.m_wstrUnitLastLoginDate = ks.getWString(); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_mapInventorySlotSize = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_mapItem = ks.getMap<UidType, KInventoryItemInfo>((ks) => ks.getInt64(), (ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { obj.m_mapPetItem = ks.getMap<UidType, Map<UidType, KInventoryItemInfo>>((ks) => ks.getInt64(), (ks) => ks.getMap<UidType, KInventoryItemInfo>((ks) => ks.getInt64(), (ks) => ks.getUserClass(getKInventoryItemInfo, f))); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_iNumResurrectionStone = ks.getInt32(); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.AP_RESTONE) { obj.m_iNumAutoPaymentResStone = ks.getInt32(); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.AP_RESTONE) { obj.m_wstrAutoPayResStoneLastDate = ks.getWString(); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_vecQuest = ks.getVector<KQuestInstance>((ks) => ks.getUserClass(getKQuestInstance, f)); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) {
      if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_DAILY_QUEST) { obj.m_vecCompletQuest = ks.getVector<KCompleteQuestInfo>((ks) => ks.getUserClass(getKCompleteQuestInfo, f)); }
      else if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && !f.SERV_DAILY_QUEST) { obj.m_vecCompletQuest = ks.getVector<Int32>((ks) => ks.getInt32()); }
    }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_vecMission = ks.getVector<KMissionInstance>((ks) => ks.getUserClass(getKMissionInstance, f)); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_vecTitle = ks.getVector<KTitleInfo>((ks) => ks.getUserClass(getKTitleInfo, f)); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_vecSkillAcquired = ks.getVector<KUserSkillData>((ks) => ks.getUserClass(getKUserSkillData, f)); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_vecSkillUnsealed = ks.getVector<Int16>((ks) => ks.getInt16()); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_SKILL_NOTE) { obj.m_cSkillNoteMaxPageNum = ks.getInt8(); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_SKILL_NOTE) { obj.m_mapSkillNote = ks.getMap<Int8, Int32>((ks) => ks.getInt8(), (ks) => ks.getInt32()); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_vecChatBlackList = ks.getVector<KChatBlackListUnit>((ks) => ks.getUserClass(getKChatBlackListUnit, f)); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_kDenyOptions = ks.getUserClass(getKDenyOptions, f); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_bIsRecommend = ks.getBool(); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_iRecommendUnitUID = ks.getInt64(); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_vecTutorialDBUnitInfo = ks.getVector<KTutorialDBUnitInfo>((ks) => ks.getUserClass(getKTutorialDBUnitInfo, f)); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_bIsSpiritUpdated = ks.getBool(); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_vecConnectTimeEvent = ks.getVector<KConnectTimeEventInfo>((ks) => ks.getUserClass(getKConnectTimeEventInfo, f)); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.CUMULATIVE_TIME_EVENT) { obj.m_vecCumulativeTimeEvent = ks.getVector<KCumulativeTimeEventInfo>((ks) => ks.getUserClass(getKCumulativeTimeEventInfo, f)); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_vecHenirRanking = ks.getVector<KHenirRankingInfo>((ks) => ks.getUserClass(getKHenirRankingInfo, f)); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION) { obj.m_kMessengerInfo = ks.getUserClass(getKMessengerInfo, f); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { obj.m_iSummonedPetUID = ks.getInt64(); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { obj.m_vecPetList = ks.getVector<KPetInfo>((ks) => ks.getUserClass(getKPetInfo, f)); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { obj.m_vecCanEvolutionPetList = ks.getVector<UidType>((ks) => ks.getInt64()); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PET_SYSTEM) { obj.m_vecNeverSummonPetList = ks.getVector<UidType>((ks) => ks.getInt64()); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CHAR_LOG) { obj.m_mapCharGameCount = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_PSHOP_AGENCY) { obj.m_kPShopAgencyInfo = ks.getUserClass(getKUserPShopAgencyInfo, f); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_NEW_HENIR_TEST) { obj.m_PacketHenirRewardCount = ks.getUserClass(getKEGS_HENIR_REWARD_COUNT_NOT, f); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_RANDOM_DAY_QUEST) { obj.m_mapRandomQuestList = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_CONTENT_MANAGER) { obj.m_bCashShopOpen = ks.getBool(); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_BATTLE_FIELD_SYSTEM) { obj.m_kGamePlayStatus = ks.getUserClass(getKGamePlayStatusContainer, f); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_MONEY) { obj.m_iEventMoney = ks.getInt32(); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_2012_PVP_SEASON2_EVENT) { obj.m_iPvpEventIndex = ks.getInt32(); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_2012_PVP_SEASON2_EVENT) { obj.m_wstrLastPvpEventDate = ks.getWString(); }
    if (!f.SERV_SELECT_UNIT_PACKET_DIVISION && f.SERV_EVENT_BINGO) { obj.m_kBingoEvent = ks.getUserClass(getKDBE_BINGO_EVENT_INFO_READ_ACK, f); }
  }
  return obj;
}

export interface KPacketProcessingLatencyInfo {
  m_usEventID?: UInt16;
  m_iUnitUID?: UidType;
  m_dwMaxLatency?: UInt32;
  m_wstrMaxLatencyTime?: string;
}
export function createKPacketProcessingLatencyInfo(flags?: FlagInput): KPacketProcessingLatencyInfo {
  const f = resolveFlags(flags);
  const obj: KPacketProcessingLatencyInfo = {
  };
  if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) obj.m_usEventID = 0;
  if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) obj.m_dwMaxLatency = 0;
  if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) obj.m_wstrMaxLatencyTime = '';
  return obj;
}
export function putKPacketProcessingLatencyInfo(ks: KSerializer, obj: KPacketProcessingLatencyInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) {
    if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) { if (!(ks.putUInt16((obj.m_usEventID ?? 0)))) return false; }
    if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) { if (!(ks.putUInt32((obj.m_dwMaxLatency ?? 0)))) return false; }
    if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) { if (!(ks.putWString((obj.m_wstrMaxLatencyTime ?? '')))) return false; }
  }
  return true;
}
export function getKPacketProcessingLatencyInfo(ks: KSerializer, flags?: FlagInput): KPacketProcessingLatencyInfo {
  const f = resolveFlags(flags);
  const obj = createKPacketProcessingLatencyInfo(f);
  if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) {
    if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) { obj.m_usEventID = ks.getUInt16(); }
    if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) { obj.m_dwMaxLatency = ks.getUInt32(); }
    if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) { obj.m_wstrMaxLatencyTime = ks.getWString(); }
  }
  return obj;
}

export interface KPacketProcessingCountInfo {
  m_usEventID?: UInt16;
  m_dwCount?: UInt32;
}
export function createKPacketProcessingCountInfo(flags?: FlagInput): KPacketProcessingCountInfo {
  const f = resolveFlags(flags);
  const obj: KPacketProcessingCountInfo = {
  };
  if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) obj.m_usEventID = 0;
  if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) obj.m_dwCount = 0;
  return obj;
}
export function putKPacketProcessingCountInfo(ks: KSerializer, obj: KPacketProcessingCountInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) {
    if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) { if (!(ks.putUInt16((obj.m_usEventID ?? 0)))) return false; }
    if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) { if (!(ks.putUInt32((obj.m_dwCount ?? 0)))) return false; }
  }
  return true;
}
export function getKPacketProcessingCountInfo(ks: KSerializer, flags?: FlagInput): KPacketProcessingCountInfo {
  const f = resolveFlags(flags);
  const obj = createKPacketProcessingCountInfo(f);
  if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) {
    if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) { obj.m_usEventID = ks.getUInt16(); }
    if (Boolean(f.SERV_PACKET_PROCESSING_LATENCY_CHECK)) { obj.m_dwCount = ks.getUInt32(); }
  }
  return obj;
}

export interface EVENT_DATA {
  m_fEXPRate?: Float32;
  m_fVPRate?: Float32;
  m_fEDRate?: Float32;
  m_iDungeonID?: Int32;
  m_iDungeonMode?: Int32;
  m_iUnitLevel?: Int32;
  m_cUnitType?: Int8;
  m_cUnitClass?: Int8;
  m_iPartyNum?: Int32;
  m_fEventTime?: Float32;
  m_iEventReward?: Int32;
  m_mapMinMaxReward?: Map<[Int32, Int32], Int32>;
  m_bGiveOnce?: boolean;
  m_bDelEndEvent?: boolean;
  m_bPcBangEvent?: boolean;
  m_bDirectReward?: boolean;
  m_bAccountEvent?: boolean;
  m_iDropCount?: Int32;
  m_bWithPlayPcBang?: boolean;
  m_iChannelCode?: Int32;
  m_iBF_Team?: Int32;
  m_iHenirRewardEventCount?: Int32;
  m_bHenirRewardUnLimited?: boolean;
  m_iServerGroup?: Int32;
  m_fRankingPointRate?: Float32;
  m_fDropRate?: Float32;
  m_bAccumulateEXP?: boolean;
  m_iStartLevel?: Int32;
  m_iEndLevel?: Int32;
  m_bRepeatEvent?: boolean;
  m_bRepeatRewardEvent?: boolean;
  m_iBeforeEventID?: Int32;
  m_bPlayWithCharEXP?: boolean;
  m_iEventGroupID?: Int32;
  m_fQuestItemDropRate?: Float32;
  m_wstrAdvertisementURL?: string;
  m_iEventItemID?: Int32;
  m_iCustomEventID?: Int32;
  m_fDefenseDungeonOpenRate?: Float32;
  m_byteCriterionUserType?: UInt8;
  m_byteCriterionPresentUserType?: UInt8;
  m_tCriterionDateBegin?: CTimeValue;
  m_tCriterionDateEnd?: CTimeValue;
  m_bOnlySteamUser?: boolean;
  m_bOnlyNotSteamUser?: boolean;
  m_bNewUnitEvent?: boolean;
  m_bNewUnitEvent2?: boolean;
  m_bCurrentUnitEvent?: boolean;
  m_iUnitClassLevel?: Int32;
  m_bAccumulate?: boolean;
}
export function createEVENT_DATA(flags?: FlagInput): EVENT_DATA {
  const f = resolveFlags(flags);
  const obj: EVENT_DATA = {
  };
  if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) {
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_fEXPRate = 0;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_fVPRate = 0;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_fEDRate = 0;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_iDungeonID = 0;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_iDungeonMode = 0;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_iUnitLevel = 0;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_cUnitType = 0;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_cUnitClass = 0;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_iPartyNum = 0;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_fEventTime = 0;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_iEventReward = 0;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_mapMinMaxReward = new Map<[Int32, Int32], Int32>();
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_bGiveOnce = false;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_bDelEndEvent = false;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_bPcBangEvent = false;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_bDirectReward = false;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_bAccountEvent = false;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_iDropCount = 0;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_bWithPlayPcBang = false;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_iChannelCode = 0;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_iBF_Team = 0;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_iHenirRewardEventCount = 0;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_bHenirRewardUnLimited = false;
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_iServerGroup = 0;
  }
  else if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) {
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_fEXPRate = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_fVPRate = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_fEDRate = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_fRankingPointRate = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_iDungeonID = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_iDungeonMode = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_iUnitLevel = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_cUnitType = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_cUnitClass = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_iPartyNum = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_fEventTime = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_iEventReward = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_mapMinMaxReward = new Map<[Int32, Int32], Int32>();
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_bGiveOnce = true;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_bDelEndEvent = false;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_bPcBangEvent = false;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_bDirectReward = false;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_bAccountEvent = false;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_DROP_EVENT_RENEWAL) obj.m_fDropRate = 0.0;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && !f.SERV_DROP_EVENT_RENEWAL) obj.m_iDropCount = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_bWithPlayPcBang = false;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_iChannelCode = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_iBF_Team = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_iHenirRewardEventCount = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_bHenirRewardUnLimited = false;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_iServerGroup = -1;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_bAccumulateEXP = false;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.DROPEVENT_RENEWAL) obj.m_iStartLevel = 0;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.DROPEVENT_RENEWAL) obj.m_iEndLevel = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_bRepeatEvent = false;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_bRepeatRewardEvent = false;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_iBeforeEventID = -1;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_PLAY_WITH_CHAR_PARTY_BONUS_EXP) obj.m_bPlayWithCharEXP = false;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_iEventGroupID = -1;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_fQuestItemDropRate = 0;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_ADVERTISEMENT_EVENT) obj.m_wstrAdvertisementURL = '';
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_iEventItemID = 0;
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) obj.m_iCustomEventID = 0;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_DEFENSE_DUNGEON_OPEN_RATE_EVENT) obj.m_fDefenseDungeonOpenRate = 1.0;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_CRITERION_DATE_EVENT) obj.m_byteCriterionUserType = 0;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_CRITERION_DATE_EVENT) obj.m_byteCriterionPresentUserType = 0;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_CRITERION_DATE_EVENT) obj.m_tCriterionDateBegin = 0;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_CRITERION_DATE_EVENT) obj.m_tCriterionDateEnd = 0;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_STEAM_USER_CONNECT_EVENT) obj.m_bOnlySteamUser = false;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_STEAM_USER_CONNECT_EVENT) obj.m_bOnlyNotSteamUser = false;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR) obj.m_bNewUnitEvent = false;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR) obj.m_bNewUnitEvent2 = false;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR) obj.m_bCurrentUnitEvent = false;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_UNIT_CLASS_LEVEL_EVENT) obj.m_iUnitClassLevel = -1;
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_HENIR_REWARD_EVENT) obj.m_bAccumulate = false;
  }
  return obj;
}
export function putEVENT_DATA(ks: KSerializer, obj: EVENT_DATA, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) {
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putFloat32((obj.m_fEXPRate ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putFloat32((obj.m_fVPRate ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putFloat32((obj.m_fEDRate ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putInt32((obj.m_iDungeonID ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putInt32((obj.m_iDungeonMode ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putInt32((obj.m_iUnitLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putInt8((obj.m_cUnitType ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putInt8((obj.m_cUnitClass ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putInt32((obj.m_iPartyNum ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putFloat32((obj.m_fEventTime ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putInt32((obj.m_iEventReward ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putMap((obj.m_mapMinMaxReward ?? new Map<[Int32, Int32], Int32>()), (ks, k: [Int32, Int32]) => ks.putPair(k, (ks, a: Int32) => ks.putInt32(a), (ks, b: Int32) => ks.putInt32(b)), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putBool((obj.m_bGiveOnce ?? false)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putBool((obj.m_bDelEndEvent ?? false)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putBool((obj.m_bPcBangEvent ?? false)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putBool((obj.m_bDirectReward ?? false)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putBool((obj.m_bAccountEvent ?? false)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putInt32((obj.m_iDropCount ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putBool((obj.m_bWithPlayPcBang ?? false)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putInt32((obj.m_iChannelCode ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putInt32((obj.m_iBF_Team ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putInt32((obj.m_iHenirRewardEventCount ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putBool((obj.m_bHenirRewardUnLimited ?? false)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putInt32((obj.m_iServerGroup ?? 0)))) return false; }
  }
  else if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) {
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putFloat32((obj.m_fEXPRate ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putFloat32((obj.m_fVPRate ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putFloat32((obj.m_fEDRate ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putFloat32((obj.m_fRankingPointRate ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putInt32((obj.m_iDungeonID ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putInt32((obj.m_iDungeonMode ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putInt32((obj.m_iUnitLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putInt8((obj.m_cUnitType ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putInt8((obj.m_cUnitClass ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putInt32((obj.m_iPartyNum ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putFloat32((obj.m_fEventTime ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putInt32((obj.m_iEventReward ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putMap((obj.m_mapMinMaxReward ?? new Map<[Int32, Int32], Int32>()), (ks, k: [Int32, Int32]) => ks.putPair(k, (ks, a: Int32) => ks.putInt32(a), (ks, b: Int32) => ks.putInt32(b)), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putBool((obj.m_bGiveOnce ?? true)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putBool((obj.m_bDelEndEvent ?? false)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putBool((obj.m_bPcBangEvent ?? false)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putBool((obj.m_bDirectReward ?? false)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putBool((obj.m_bAccountEvent ?? false)))) return false; }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_DROP_EVENT_RENEWAL) { if (!(ks.putFloat32((obj.m_fDropRate ?? 0.0)))) return false; }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && !f.SERV_DROP_EVENT_RENEWAL) { if (!(ks.putInt32((obj.m_iDropCount ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putBool((obj.m_bWithPlayPcBang ?? false)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putInt32((obj.m_iChannelCode ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putInt32((obj.m_iBF_Team ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putInt32((obj.m_iHenirRewardEventCount ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putBool((obj.m_bHenirRewardUnLimited ?? false)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putInt32((obj.m_iServerGroup ?? -1)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putBool((obj.m_bAccumulateEXP ?? false)))) return false; }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.DROPEVENT_RENEWAL) { if (!(ks.putInt32((obj.m_iStartLevel ?? 0)))) return false; }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.DROPEVENT_RENEWAL) { if (!(ks.putInt32((obj.m_iEndLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putBool((obj.m_bRepeatEvent ?? false)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putBool((obj.m_bRepeatRewardEvent ?? false)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putInt32((obj.m_iBeforeEventID ?? -1)))) return false; }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_PLAY_WITH_CHAR_PARTY_BONUS_EXP) { if (!(ks.putBool((obj.m_bPlayWithCharEXP ?? false)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putInt32((obj.m_iEventGroupID ?? -1)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putFloat32((obj.m_fQuestItemDropRate ?? 0)))) return false; }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_ADVERTISEMENT_EVENT) { if (!(ks.putWString((obj.m_wstrAdvertisementURL ?? '')))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putInt32((obj.m_iEventItemID ?? 0)))) return false; }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { if (!(ks.putInt32((obj.m_iCustomEventID ?? 0)))) return false; }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_DEFENSE_DUNGEON_OPEN_RATE_EVENT) { if (!(ks.putFloat32((obj.m_fDefenseDungeonOpenRate ?? 1.0)))) return false; }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_CRITERION_DATE_EVENT) { if (!(ks.putUInt8((obj.m_byteCriterionUserType ?? 0)))) return false; }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_CRITERION_DATE_EVENT) { if (!(ks.putUInt8((obj.m_byteCriterionPresentUserType ?? 0)))) return false; }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_STEAM_USER_CONNECT_EVENT) { if (!(ks.putBool((obj.m_bOnlySteamUser ?? false)))) return false; }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_STEAM_USER_CONNECT_EVENT) { if (!(ks.putBool((obj.m_bOnlyNotSteamUser ?? false)))) return false; }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR) { if (!(ks.putBool((obj.m_bNewUnitEvent ?? false)))) return false; }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR) { if (!(ks.putBool((obj.m_bNewUnitEvent2 ?? false)))) return false; }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR) { if (!(ks.putBool((obj.m_bCurrentUnitEvent ?? false)))) return false; }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_UNIT_CLASS_LEVEL_EVENT) { if (!(ks.putInt32((obj.m_iUnitClassLevel ?? -1)))) return false; }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_HENIR_REWARD_EVENT) { if (!(ks.putBool((obj.m_bAccumulate ?? false)))) return false; }
  }
  return true;
}
export function getEVENT_DATA(ks: KSerializer, flags?: FlagInput): EVENT_DATA {
  const f = resolveFlags(flags);
  const obj = createEVENT_DATA(f);
  if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) {
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_fEXPRate = ks.getFloat32(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_fVPRate = ks.getFloat32(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_fEDRate = ks.getFloat32(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_iDungeonID = ks.getInt32(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_iDungeonMode = ks.getInt32(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_iUnitLevel = ks.getInt32(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_cUnitType = ks.getInt8(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_cUnitClass = ks.getInt8(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_iPartyNum = ks.getInt32(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_fEventTime = ks.getFloat32(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_iEventReward = ks.getInt32(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_mapMinMaxReward = ks.getMap<[Int32, Int32], Int32>((ks) => ks.getPair<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()), (ks) => ks.getInt32()); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_bGiveOnce = ks.getBool(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_bDelEndEvent = ks.getBool(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_bPcBangEvent = ks.getBool(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_bDirectReward = ks.getBool(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_bAccountEvent = ks.getBool(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_iDropCount = ks.getInt32(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_bWithPlayPcBang = ks.getBool(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_iChannelCode = ks.getInt32(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_iBF_Team = ks.getInt32(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_iHenirRewardEventCount = ks.getInt32(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_bHenirRewardUnLimited = ks.getBool(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_iServerGroup = ks.getInt32(); }
  }
  else if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) {
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_fEXPRate = ks.getFloat32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_fVPRate = ks.getFloat32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_fEDRate = ks.getFloat32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_fRankingPointRate = ks.getFloat32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_iDungeonID = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_iDungeonMode = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_iUnitLevel = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_cUnitType = ks.getInt8(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_cUnitClass = ks.getInt8(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_iPartyNum = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_fEventTime = ks.getFloat32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_iEventReward = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_mapMinMaxReward = ks.getMap<[Int32, Int32], Int32>((ks) => ks.getPair<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()), (ks) => ks.getInt32()); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_bGiveOnce = ks.getBool(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_bDelEndEvent = ks.getBool(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_bPcBangEvent = ks.getBool(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_bDirectReward = ks.getBool(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_bAccountEvent = ks.getBool(); }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_DROP_EVENT_RENEWAL) { obj.m_fDropRate = ks.getFloat32(); }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && !f.SERV_DROP_EVENT_RENEWAL) { obj.m_iDropCount = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_bWithPlayPcBang = ks.getBool(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_iChannelCode = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_iBF_Team = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_iHenirRewardEventCount = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_bHenirRewardUnLimited = ks.getBool(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_iServerGroup = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_bAccumulateEXP = ks.getBool(); }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.DROPEVENT_RENEWAL) { obj.m_iStartLevel = ks.getInt32(); }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.DROPEVENT_RENEWAL) { obj.m_iEndLevel = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_bRepeatEvent = ks.getBool(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_bRepeatRewardEvent = ks.getBool(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_iBeforeEventID = ks.getInt32(); }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_PLAY_WITH_CHAR_PARTY_BONUS_EXP) { obj.m_bPlayWithCharEXP = ks.getBool(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_iEventGroupID = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_fQuestItemDropRate = ks.getFloat32(); }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_ADVERTISEMENT_EVENT) { obj.m_wstrAdvertisementURL = ks.getWString(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_iEventItemID = ks.getInt32(); }
    if (Boolean(f.SERV_EVENT_DB_CONTROL_SYSTEM)) { obj.m_iCustomEventID = ks.getInt32(); }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_DEFENSE_DUNGEON_OPEN_RATE_EVENT) { obj.m_fDefenseDungeonOpenRate = ks.getFloat32(); }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_CRITERION_DATE_EVENT) { obj.m_byteCriterionUserType = ks.getUInt8(); }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_CRITERION_DATE_EVENT) { obj.m_byteCriterionPresentUserType = ks.getUInt8(); }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_STEAM_USER_CONNECT_EVENT) { obj.m_bOnlySteamUser = ks.getBool(); }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_STEAM_USER_CONNECT_EVENT) { obj.m_bOnlyNotSteamUser = ks.getBool(); }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR) { obj.m_bNewUnitEvent = ks.getBool(); }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR) { obj.m_bNewUnitEvent2 = ks.getBool(); }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_TIME_EVENT_ONLY_CURRENT_USER_CHAR) { obj.m_bCurrentUnitEvent = ks.getBool(); }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_UNIT_CLASS_LEVEL_EVENT) { obj.m_iUnitClassLevel = ks.getInt32(); }
    if (f.SERV_EVENT_DB_CONTROL_SYSTEM && f.SERV_HENIR_REWARD_EVENT) { obj.m_bAccumulate = ks.getBool(); }
  }
  return obj;
}

export interface EVENT_MONSTER_DATA {
  m_iEventID?: Int32;
  m_iMonsterDropCount?: Int32;
  m_bIsAdventInBossStage?: boolean;
  m_mapNpcIDAndRate?: Map<Int32, Float32>;
  m_setAdventDungeon?: Set<Int32>;
  m_setNoAdventDungeon?: Set<Int32>;
  m_setNoAdventStage?: Set<Int32>;
  m_bAllyNPC?: boolean;
}
export function createEVENT_MONSTER_DATA(flags?: FlagInput): EVENT_MONSTER_DATA {
  const f = resolveFlags(flags);
  const obj: EVENT_MONSTER_DATA = {
  };
  if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_iEventID = 0;
  if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_iMonsterDropCount = 0;
  if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_bIsAdventInBossStage = false;
  if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_mapNpcIDAndRate = new Map<Int32, Float32>();
  if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_setAdventDungeon = new Set<Int32>();
  if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_setNoAdventDungeon = new Set<Int32>();
  if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) obj.m_setNoAdventStage = new Set<Int32>();
  if (f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB && f.SERV_ALLY_EVENT_MONSTER) obj.m_bAllyNPC = false;
  return obj;
}
export function putEVENT_MONSTER_DATA(ks: KSerializer, obj: EVENT_MONSTER_DATA, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) {
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putInt32((obj.m_iEventID ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putInt32((obj.m_iMonsterDropCount ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putBool((obj.m_bIsAdventInBossStage ?? false)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putMap((obj.m_mapNpcIDAndRate ?? new Map<Int32, Float32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Float32) => ks.putFloat32(v)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putSet((obj.m_setAdventDungeon ?? new Set<Int32>()), (ks, item: Int32) => ks.putInt32(item)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putSet((obj.m_setNoAdventDungeon ?? new Set<Int32>()), (ks, item: Int32) => ks.putInt32(item)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putSet((obj.m_setNoAdventStage ?? new Set<Int32>()), (ks, item: Int32) => ks.putInt32(item)))) return false; }
    if (f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB && f.SERV_ALLY_EVENT_MONSTER) { if (!(ks.putBool((obj.m_bAllyNPC ?? false)))) return false; }
  }
  return true;
}
export function getEVENT_MONSTER_DATA(ks: KSerializer, flags?: FlagInput): EVENT_MONSTER_DATA {
  const f = resolveFlags(flags);
  const obj = createEVENT_MONSTER_DATA(f);
  if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) {
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_iEventID = ks.getInt32(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_iMonsterDropCount = ks.getInt32(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_bIsAdventInBossStage = ks.getBool(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_mapNpcIDAndRate = ks.getMap<Int32, Float32>((ks) => ks.getInt32(), (ks) => ks.getFloat32()); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_setAdventDungeon = ks.getSet<Int32>((ks) => ks.getInt32()); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_setNoAdventDungeon = ks.getSet<Int32>((ks) => ks.getInt32()); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_setNoAdventStage = ks.getSet<Int32>((ks) => ks.getInt32()); }
    if (f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB && f.SERV_ALLY_EVENT_MONSTER) { obj.m_bAllyNPC = ks.getBool(); }
  }
  return obj;
}

export interface KRewardData {
  m_iRewardItemID?: Int32;
  m_iQuantity?: Int32;
  m_sPeriod?: Int16;
}
export function createKRewardData(flags?: FlagInput): KRewardData {
  const f = resolveFlags(flags);
  const obj: KRewardData = {
  };
  if ((f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB || f.SERV_EVENT_DB_CONTROL_SYSTEM) && f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB) obj.m_iRewardItemID = 0;
  if ((f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB || f.SERV_EVENT_DB_CONTROL_SYSTEM) && f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB) obj.m_iQuantity = 0;
  if ((f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB || f.SERV_EVENT_DB_CONTROL_SYSTEM) && f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB) obj.m_sPeriod = 0;
  return obj;
}
export function putKRewardData(ks: KSerializer, obj: KRewardData, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) {
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putInt32((obj.m_iRewardItemID ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putInt32((obj.m_iQuantity ?? 0)))) return false; }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { if (!(ks.putInt16((obj.m_sPeriod ?? 0)))) return false; }
  }
  return true;
}
export function getKRewardData(ks: KSerializer, flags?: FlagInput): KRewardData {
  const f = resolveFlags(flags);
  const obj = createKRewardData(f);
  if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) {
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_iRewardItemID = ks.getInt32(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_iQuantity = ks.getInt32(); }
    if (Boolean(f.SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB)) { obj.m_sPeriod = ks.getInt16(); }
  }
  return obj;
}

export interface KBattleFieldJoinInfo {
  m_iBattleFieldID?: Int32;
  m_iStartPosIndex?: Int32;
  m_vecPartyMemberList?: UidType[];
  m_bMoveForMyParty?: boolean;
  m_bNowBattleFieldPositionInfoStartPosition?: boolean;
  m_usBattleFieldPositionValue?: UInt16;
}
export function createKBattleFieldJoinInfo(flags?: FlagInput): KBattleFieldJoinInfo {
  const f = resolveFlags(flags);
  const obj: KBattleFieldJoinInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iBattleFieldID = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iStartPosIndex = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_vecPartyMemberList = ([] as UidType[]);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_bMoveForMyParty = false;
  if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_OPTIMIZE_MOVE_TO_BATTLEFIELD_LOGIC_FIX) obj.m_bNowBattleFieldPositionInfoStartPosition = false;
  if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_OPTIMIZE_MOVE_TO_BATTLEFIELD_LOGIC_FIX) obj.m_usBattleFieldPositionValue = 0;
  return obj;
}
export function putKBattleFieldJoinInfo(ks: KSerializer, obj: KBattleFieldJoinInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iBattleFieldID ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iStartPosIndex ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putVector((obj.m_vecPartyMemberList ?? ([] as UidType[])), (ks, item: UidType) => ks.putInt64(item)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putBool((obj.m_bMoveForMyParty ?? false)))) return false; }
    if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_OPTIMIZE_MOVE_TO_BATTLEFIELD_LOGIC_FIX) { if (!(ks.putBool((obj.m_bNowBattleFieldPositionInfoStartPosition ?? false)))) return false; }
    if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_OPTIMIZE_MOVE_TO_BATTLEFIELD_LOGIC_FIX) { if (!(ks.putUInt16((obj.m_usBattleFieldPositionValue ?? 0)))) return false; }
  }
  return true;
}
export function getKBattleFieldJoinInfo(ks: KSerializer, flags?: FlagInput): KBattleFieldJoinInfo {
  const f = resolveFlags(flags);
  const obj = createKBattleFieldJoinInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iBattleFieldID = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iStartPosIndex = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_vecPartyMemberList = ks.getVector<UidType>((ks) => ks.getInt64()); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_bMoveForMyParty = ks.getBool(); }
    if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_OPTIMIZE_MOVE_TO_BATTLEFIELD_LOGIC_FIX) { obj.m_bNowBattleFieldPositionInfoStartPosition = ks.getBool(); }
    if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_OPTIMIZE_MOVE_TO_BATTLEFIELD_LOGIC_FIX) { obj.m_usBattleFieldPositionValue = ks.getUInt16(); }
  }
  return obj;
}

export interface KBattleFieldRoomInfo {
  m_iBattleFieldID?: Int32;
  m_RoomUID?: UidType;
  m_MaxSlot?: Int8;
  m_mapUnitUIDPartyUID?: Map<UidType, UidType>;
  m_mapPartyList?: Map<UidType, Set<UidType>>;
  m_byteBossFieldState?: UInt8;
}
export function createKBattleFieldRoomInfo(flags?: FlagInput): KBattleFieldRoomInfo {
  const f = resolveFlags(flags);
  const obj: KBattleFieldRoomInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iBattleFieldID = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_RoomUID = 0n;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_MaxSlot = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_mapUnitUIDPartyUID = new Map<UidType, UidType>();
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_mapPartyList = new Map<UidType, Set<UidType>>();
  if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_BATTLE_FIELD_BOSS) obj.m_byteBossFieldState = 0;
  return obj;
}
export function putKBattleFieldRoomInfo(ks: KSerializer, obj: KBattleFieldRoomInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iBattleFieldID ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt64((obj.m_RoomUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_MaxSlot ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putMap((obj.m_mapUnitUIDPartyUID ?? new Map<UidType, UidType>()), (ks, k: UidType) => ks.putInt64(k), (ks, v: UidType) => ks.putInt64(v)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putMap((obj.m_mapPartyList ?? new Map<UidType, Set<UidType>>()), (ks, k: UidType) => ks.putInt64(k), (ks, v: Set<UidType>) => ks.putSet(v, (ks, item: UidType) => ks.putInt64(item))))) return false; }
    if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_BATTLE_FIELD_BOSS) { if (!(ks.putUInt8((obj.m_byteBossFieldState ?? 0)))) return false; }
  }
  return true;
}
export function getKBattleFieldRoomInfo(ks: KSerializer, flags?: FlagInput): KBattleFieldRoomInfo {
  const f = resolveFlags(flags);
  const obj = createKBattleFieldRoomInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iBattleFieldID = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_RoomUID = ks.getInt64(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_MaxSlot = ks.getInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_mapUnitUIDPartyUID = ks.getMap<UidType, UidType>((ks) => ks.getInt64(), (ks) => ks.getInt64()); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_mapPartyList = ks.getMap<UidType, Set<UidType>>((ks) => ks.getInt64(), (ks) => ks.getSet<UidType>((ks) => ks.getInt64())); }
    if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_BATTLE_FIELD_BOSS) { obj.m_byteBossFieldState = ks.getUInt8(); }
  }
  return obj;
}

export const KDangerousEventInfo_DANGEROUS_EVENT = {
  DE_WARNING_MESSAGE: 0,
  DE_ELITE_MONSTER_DROP: 1,
  DE_BOSS_MONSTER_DROP: 2,
  DE_MIDDLE_BOSS_MONSTER_DROP: 3,
  DE_EVENT_BOSS_MONSTER_DROP: 4,
} as const;
export type KDangerousEventInfo_DANGEROUS_EVENT = (typeof KDangerousEventInfo_DANGEROUS_EVENT)[keyof typeof KDangerousEventInfo_DANGEROUS_EVENT];
export function getKDangerousEventInfo_DANGEROUS_EVENT(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    cur = 0;
    out['DE_WARNING_MESSAGE'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    out['DE_ELITE_MONSTER_DROP'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    out['DE_BOSS_MONSTER_DROP'] = cur;
    cur += 1;
  }
  if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_BATTLEFIELD_MIDDLE_BOSS) {
    out['DE_MIDDLE_BOSS_MONSTER_DROP'] = cur;
    cur += 1;
  }
  if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_BATTLEFIELD_EVENT_BOSS_INT) {
    out['DE_EVENT_BOSS_MONSTER_DROP'] = cur;
    cur += 1;
  }
  return out;
}
export interface KDangerousEventInfo {
  m_setEventInfo?: Set<Int32>;
}
export function createKDangerousEventInfo(flags?: FlagInput): KDangerousEventInfo {
  const f = resolveFlags(flags);
  const obj: KDangerousEventInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_setEventInfo = new Set<Int32>();
  return obj;
}
export function putKDangerousEventInfo(ks: KSerializer, obj: KDangerousEventInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putSet((obj.m_setEventInfo ?? new Set<Int32>()), (ks, item: Int32) => ks.putInt32(item)))) return false; }
  }
  return true;
}
export function getKDangerousEventInfo(ks: KSerializer, flags?: FlagInput): KDangerousEventInfo {
  const f = resolveFlags(flags);
  const obj = createKDangerousEventInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_setEventInfo = ks.getSet<Int32>((ks) => ks.getInt32()); }
  }
  return obj;
}

export interface KAutoPartyMakingProcessCondition {
  m_iDungeonMode?: Int32;
  m_iDungeonIDWithDif?: Int32;
  m_iBeginLevel?: Int32;
  m_iEndLevel?: Int32;
}
export function createKAutoPartyMakingProcessCondition(flags?: FlagInput): KAutoPartyMakingProcessCondition {
  const f = resolveFlags(flags);
  const obj: KAutoPartyMakingProcessCondition = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iDungeonMode = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iDungeonIDWithDif = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iBeginLevel = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iEndLevel = 0;
  return obj;
}
export function putKAutoPartyMakingProcessCondition(ks: KSerializer, obj: KAutoPartyMakingProcessCondition, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iDungeonMode ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iDungeonIDWithDif ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iBeginLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iEndLevel ?? 0)))) return false; }
  }
  return true;
}
export function getKAutoPartyMakingProcessCondition(ks: KSerializer, flags?: FlagInput): KAutoPartyMakingProcessCondition {
  const f = resolveFlags(flags);
  const obj = createKAutoPartyMakingProcessCondition(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iDungeonMode = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iDungeonIDWithDif = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iBeginLevel = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iEndLevel = ks.getInt32(); }
  }
  return obj;
}

export interface KAutoPartyConditionInfo {
  m_iDungeonID?: Int32;
  m_cDifficultyLevel?: Int8;
  m_cGetItemType?: Int8;
  m_cDungeonMode?: Int8;
  m_cLimitPlayerCount?: Int8;
}
export function createKAutoPartyConditionInfo(flags?: FlagInput): KAutoPartyConditionInfo {
  const f = resolveFlags(flags);
  const obj: KAutoPartyConditionInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iDungeonID = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_cDifficultyLevel = -1;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_cGetItemType = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_cDungeonMode = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_cLimitPlayerCount = 0;
  return obj;
}
export function putKAutoPartyConditionInfo(ks: KSerializer, obj: KAutoPartyConditionInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iDungeonID ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_cDifficultyLevel ?? -1)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_cGetItemType ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_cDungeonMode ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_cLimitPlayerCount ?? 0)))) return false; }
  }
  return true;
}
export function getKAutoPartyConditionInfo(ks: KSerializer, flags?: FlagInput): KAutoPartyConditionInfo {
  const f = resolveFlags(flags);
  const obj = createKAutoPartyConditionInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iDungeonID = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_cDifficultyLevel = ks.getInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_cGetItemType = ks.getInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_cDungeonMode = ks.getInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_cLimitPlayerCount = ks.getInt8(); }
  }
  return obj;
}

export interface KAutoPartyUserInfo {
  m_iGSUID?: UidType;
  m_iUnitUID?: UidType;
  m_kOldPartyInfo?: KOldPartyInfo;
  m_wstrNickName?: string;
  m_cUnitClass?: Int8;
  m_ucLevel?: UInt8;
  m_iAutoPartyWaitTime?: Int32;
  m_bAutoPartyBonus?: boolean;
}
export function createKAutoPartyUserInfo(flags?: FlagInput): KAutoPartyUserInfo {
  const f = resolveFlags(flags);
  const obj: KAutoPartyUserInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iGSUID = 0n;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_kOldPartyInfo = createKOldPartyInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_wstrNickName = '';
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_cUnitClass = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_ucLevel = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iAutoPartyWaitTime = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_bAutoPartyBonus = false;
  return obj;
}
export function putKAutoPartyUserInfo(ks: KSerializer, obj: KAutoPartyUserInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt64((obj.m_iGSUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putUserClass((obj.m_kOldPartyInfo ?? createKOldPartyInfo(f)), putKOldPartyInfo, f))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_cUnitClass ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putUInt8((obj.m_ucLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iAutoPartyWaitTime ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putBool((obj.m_bAutoPartyBonus ?? false)))) return false; }
  }
  return true;
}
export function getKAutoPartyUserInfo(ks: KSerializer, flags?: FlagInput): KAutoPartyUserInfo {
  const f = resolveFlags(flags);
  const obj = createKAutoPartyUserInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iGSUID = ks.getInt64(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_kOldPartyInfo = ks.getUserClass(getKOldPartyInfo, f); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_wstrNickName = ks.getWString(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_cUnitClass = ks.getInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_ucLevel = ks.getUInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iAutoPartyWaitTime = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_bAutoPartyBonus = ks.getBool(); }
  }
  return obj;
}

export interface KRegroupPartyUserInfo {
  m_kPartyUserInfo?: KPartyUserInfo;
  m_kPartyRoomUserInfo?: KPartyRoomUserInfo;
  m_kOldPartyInfo?: KOldPartyInfo;
}
export function createKRegroupPartyUserInfo(flags?: FlagInput): KRegroupPartyUserInfo {
  const f = resolveFlags(flags);
  const obj: KRegroupPartyUserInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_kPartyUserInfo = createKPartyUserInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_kPartyRoomUserInfo = createKPartyRoomUserInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_kOldPartyInfo = createKOldPartyInfo(f);
  return obj;
}
export function putKRegroupPartyUserInfo(ks: KSerializer, obj: KRegroupPartyUserInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putUserClass((obj.m_kPartyUserInfo ?? createKPartyUserInfo(f)), putKPartyUserInfo, f))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putUserClass((obj.m_kPartyRoomUserInfo ?? createKPartyRoomUserInfo(f)), putKPartyRoomUserInfo, f))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putUserClass((obj.m_kOldPartyInfo ?? createKOldPartyInfo(f)), putKOldPartyInfo, f))) return false; }
  }
  return true;
}
export function getKRegroupPartyUserInfo(ks: KSerializer, flags?: FlagInput): KRegroupPartyUserInfo {
  const f = resolveFlags(flags);
  const obj = createKRegroupPartyUserInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_kPartyUserInfo = ks.getUserClass(getKPartyUserInfo, f); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_kPartyRoomUserInfo = ks.getUserClass(getKPartyRoomUserInfo, f); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_kOldPartyInfo = ks.getUserClass(getKOldPartyInfo, f); }
  }
  return obj;
}

export interface KAutoPartyBonusInfo {
  m_cDungeonMode?: Int8;
  m_iDungeonIDWithDif?: Int32;
  m_bActivatedBonus?: boolean;
}
export function createKAutoPartyBonusInfo(flags?: FlagInput): KAutoPartyBonusInfo {
  const f = resolveFlags(flags);
  const obj: KAutoPartyBonusInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_cDungeonMode = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iDungeonIDWithDif = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_bActivatedBonus = false;
  return obj;
}
export function putKAutoPartyBonusInfo(ks: KSerializer, obj: KAutoPartyBonusInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_cDungeonMode ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iDungeonIDWithDif ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putBool((obj.m_bActivatedBonus ?? false)))) return false; }
  }
  return true;
}
export function getKAutoPartyBonusInfo(ks: KSerializer, flags?: FlagInput): KAutoPartyBonusInfo {
  const f = resolveFlags(flags);
  const obj = createKAutoPartyBonusInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_cDungeonMode = ks.getInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iDungeonIDWithDif = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_bActivatedBonus = ks.getBool(); }
  }
  return obj;
}

export interface KPartyUserJoinRoomInfo {
  m_iRoomUID?: UidType;
  m_iBattleFieldID?: Int32;
}
export function createKPartyUserJoinRoomInfo(flags?: FlagInput): KPartyUserJoinRoomInfo {
  const f = resolveFlags(flags);
  const obj: KPartyUserJoinRoomInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iRoomUID = 0n;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iBattleFieldID = 0;
  return obj;
}
export function putKPartyUserJoinRoomInfo(ks: KSerializer, obj: KPartyUserJoinRoomInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt64((obj.m_iRoomUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iBattleFieldID ?? 0)))) return false; }
  }
  return true;
}
export function getKPartyUserJoinRoomInfo(ks: KSerializer, flags?: FlagInput): KPartyUserJoinRoomInfo {
  const f = resolveFlags(flags);
  const obj = createKPartyUserJoinRoomInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iRoomUID = ks.getInt64(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iBattleFieldID = ks.getInt32(); }
  }
  return obj;
}

export interface KDungeonGameInfo {
  m_iDungeonID?: Int32;
  m_cDungeonMode?: Int8;
  m_cDifficulty?: Int8;
}
export function createKDungeonGameInfo(flags?: FlagInput): KDungeonGameInfo {
  const f = resolveFlags(flags);
  const obj: KDungeonGameInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iDungeonID = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_cDungeonMode = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_cDifficulty = 0;
  return obj;
}
export function putKDungeonGameInfo(ks: KSerializer, obj: KDungeonGameInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iDungeonID ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_cDungeonMode ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_cDifficulty ?? 0)))) return false; }
  }
  return true;
}
export function getKDungeonGameInfo(ks: KSerializer, flags?: FlagInput): KDungeonGameInfo {
  const f = resolveFlags(flags);
  const obj = createKDungeonGameInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iDungeonID = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_cDungeonMode = ks.getInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_cDifficulty = ks.getInt8(); }
  }
  return obj;
}

export interface KDungeonGameSimpleInfo {
  m_iDungeonID?: Int32;
  m_cDungeonMode?: Int8;
}
export function createKDungeonGameSimpleInfo(flags?: FlagInput): KDungeonGameSimpleInfo {
  const f = resolveFlags(flags);
  const obj: KDungeonGameSimpleInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iDungeonID = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_cDungeonMode = 0;
  return obj;
}
export function putKDungeonGameSimpleInfo(ks: KSerializer, obj: KDungeonGameSimpleInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iDungeonID ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_cDungeonMode ?? 0)))) return false; }
  }
  return true;
}
export function getKDungeonGameSimpleInfo(ks: KSerializer, flags?: FlagInput): KDungeonGameSimpleInfo {
  const f = resolveFlags(flags);
  const obj = createKDungeonGameSimpleInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iDungeonID = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_cDungeonMode = ks.getInt8(); }
  }
  return obj;
}

export interface KAutoPartyDungeonBonusInfo {
  m_iDungeonID?: Int32;
  m_cDungeonMode?: Int8;
  m_bActivatedBonus?: boolean;
}
export function createKAutoPartyDungeonBonusInfo(flags?: FlagInput): KAutoPartyDungeonBonusInfo {
  const f = resolveFlags(flags);
  const obj: KAutoPartyDungeonBonusInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iDungeonID = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_cDungeonMode = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_bActivatedBonus = false;
  return obj;
}
export function putKAutoPartyDungeonBonusInfo(ks: KSerializer, obj: KAutoPartyDungeonBonusInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iDungeonID ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_cDungeonMode ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putBool((obj.m_bActivatedBonus ?? false)))) return false; }
  }
  return true;
}
export function getKAutoPartyDungeonBonusInfo(ks: KSerializer, flags?: FlagInput): KAutoPartyDungeonBonusInfo {
  const f = resolveFlags(flags);
  const obj = createKAutoPartyDungeonBonusInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iDungeonID = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_cDungeonMode = ks.getInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_bActivatedBonus = ks.getBool(); }
  }
  return obj;
}

export interface KReturnToFieldInfo {
  m_iReturnToFieldUnitUID?: UidType;
  m_iRoomUID?: UidType;
  m_setRemainUnitUID?: Set<UidType>;
}
export function createKReturnToFieldInfo(flags?: FlagInput): KReturnToFieldInfo {
  const f = resolveFlags(flags);
  const obj: KReturnToFieldInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iReturnToFieldUnitUID = 0n;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iRoomUID = 0n;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_setRemainUnitUID = new Set<UidType>();
  return obj;
}
export function putKReturnToFieldInfo(ks: KSerializer, obj: KReturnToFieldInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt64((obj.m_iReturnToFieldUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt64((obj.m_iRoomUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putSet((obj.m_setRemainUnitUID ?? new Set<UidType>()), (ks, item: UidType) => ks.putInt64(item)))) return false; }
  }
  return true;
}
export function getKReturnToFieldInfo(ks: KSerializer, flags?: FlagInput): KReturnToFieldInfo {
  const f = resolveFlags(flags);
  const obj = createKReturnToFieldInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iReturnToFieldUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iRoomUID = ks.getInt64(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_setRemainUnitUID = ks.getSet<UidType>((ks) => ks.getInt64()); }
  }
  return obj;
}

export interface KE_CONNECT_RELAY_ACK {
  m_wstrRelayServerIP?: string;
}
export function createKE_CONNECT_RELAY_ACK(flags?: FlagInput): KE_CONNECT_RELAY_ACK {
  const f = resolveFlags(flags);
  const obj: KE_CONNECT_RELAY_ACK = {
  };
  if (Boolean(f.SERV_UDP_RELAY_CHECKER)) obj.m_wstrRelayServerIP = '';
  return obj;
}
export function putKE_CONNECT_RELAY_ACK(ks: KSerializer, obj: KE_CONNECT_RELAY_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_UDP_RELAY_CHECKER)) {
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { if (!(ks.putWString((obj.m_wstrRelayServerIP ?? '')))) return false; }
  }
  return true;
}
export function getKE_CONNECT_RELAY_ACK(ks: KSerializer, flags?: FlagInput): KE_CONNECT_RELAY_ACK {
  const f = resolveFlags(flags);
  const obj = createKE_CONNECT_RELAY_ACK(f);
  if (Boolean(f.SERV_UDP_RELAY_CHECKER)) {
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { obj.m_wstrRelayServerIP = ks.getWString(); }
  }
  return obj;
}

export interface KE_UDP_RELAY_SERVER_CHECK_PACKET_NOT {
  m_wstrRelayServerIP?: string;
  m_dwEndTickCount?: UInt32;
  m_dwEndTimeGetTime?: UInt32;
}
export function createKE_UDP_RELAY_SERVER_CHECK_PACKET_NOT(flags?: FlagInput): KE_UDP_RELAY_SERVER_CHECK_PACKET_NOT {
  const f = resolveFlags(flags);
  const obj: KE_UDP_RELAY_SERVER_CHECK_PACKET_NOT = {
  };
  if (Boolean(f.SERV_UDP_RELAY_CHECKER)) obj.m_wstrRelayServerIP = '';
  if (Boolean(f.SERV_UDP_RELAY_CHECKER)) obj.m_dwEndTickCount = 0;
  if (Boolean(f.SERV_UDP_RELAY_CHECKER)) obj.m_dwEndTimeGetTime = 0;
  return obj;
}
export function putKE_UDP_RELAY_SERVER_CHECK_PACKET_NOT(ks: KSerializer, obj: KE_UDP_RELAY_SERVER_CHECK_PACKET_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_UDP_RELAY_CHECKER)) {
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { if (!(ks.putWString((obj.m_wstrRelayServerIP ?? '')))) return false; }
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { if (!(ks.putUInt32((obj.m_dwEndTickCount ?? 0)))) return false; }
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { if (!(ks.putUInt32((obj.m_dwEndTimeGetTime ?? 0)))) return false; }
  }
  return true;
}
export function getKE_UDP_RELAY_SERVER_CHECK_PACKET_NOT(ks: KSerializer, flags?: FlagInput): KE_UDP_RELAY_SERVER_CHECK_PACKET_NOT {
  const f = resolveFlags(flags);
  const obj = createKE_UDP_RELAY_SERVER_CHECK_PACKET_NOT(f);
  if (Boolean(f.SERV_UDP_RELAY_CHECKER)) {
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { obj.m_wstrRelayServerIP = ks.getWString(); }
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { obj.m_dwEndTickCount = ks.getUInt32(); }
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { obj.m_dwEndTimeGetTime = ks.getUInt32(); }
  }
  return obj;
}

export interface KUdpRelayCheckLog {
  m_iServerUID?: UidType;
  m_wstrServerIP?: string;
  m_dwAvgDelayTime?: UInt32;
  m_dwMaxDelayTime?: UInt32;
  m_wstrRegDate?: string;
}
export function createKUdpRelayCheckLog(flags?: FlagInput): KUdpRelayCheckLog {
  const f = resolveFlags(flags);
  const obj: KUdpRelayCheckLog = {
  };
  if (Boolean(f.SERV_UDP_RELAY_CHECKER)) obj.m_iServerUID = 0n;
  if (Boolean(f.SERV_UDP_RELAY_CHECKER)) obj.m_wstrServerIP = '';
  if (Boolean(f.SERV_UDP_RELAY_CHECKER)) obj.m_dwAvgDelayTime = 0;
  if (Boolean(f.SERV_UDP_RELAY_CHECKER)) obj.m_dwMaxDelayTime = 0;
  if (Boolean(f.SERV_UDP_RELAY_CHECKER)) obj.m_wstrRegDate = '';
  return obj;
}
export function putKUdpRelayCheckLog(ks: KSerializer, obj: KUdpRelayCheckLog, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_UDP_RELAY_CHECKER)) {
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { if (!(ks.putInt64((obj.m_iServerUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { if (!(ks.putWString((obj.m_wstrServerIP ?? '')))) return false; }
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { if (!(ks.putUInt32((obj.m_dwAvgDelayTime ?? 0)))) return false; }
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { if (!(ks.putUInt32((obj.m_dwMaxDelayTime ?? 0)))) return false; }
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { if (!(ks.putWString((obj.m_wstrRegDate ?? '')))) return false; }
  }
  return true;
}
export function getKUdpRelayCheckLog(ks: KSerializer, flags?: FlagInput): KUdpRelayCheckLog {
  const f = resolveFlags(flags);
  const obj = createKUdpRelayCheckLog(f);
  if (Boolean(f.SERV_UDP_RELAY_CHECKER)) {
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { obj.m_iServerUID = ks.getInt64(); }
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { obj.m_wstrServerIP = ks.getWString(); }
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { obj.m_dwAvgDelayTime = ks.getUInt32(); }
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { obj.m_dwMaxDelayTime = ks.getUInt32(); }
    if (Boolean(f.SERV_UDP_RELAY_CHECKER)) { obj.m_wstrRegDate = ks.getWString(); }
  }
  return obj;
}

export interface KKeyboardMappingInfo {
  m_mapKeyboardMappingInfo?: Map<Int16, Int16>;
  m_mapGamePadMappingInfo?: Map<Int16, Int16>;
}
export function createKKeyboardMappingInfo(flags?: FlagInput): KKeyboardMappingInfo {
  const f = resolveFlags(flags);
  const obj: KKeyboardMappingInfo = {
  };
  if (Boolean(f.SERV_KEYBOARD_MAPPING_INFO_RW)) obj.m_mapKeyboardMappingInfo = new Map<Int16, Int16>();
  if (f.SERV_KEYBOARD_MAPPING_INFO_RW && f.SERV_KEY_MAPPING_INT) obj.m_mapGamePadMappingInfo = new Map<Int16, Int16>();
  return obj;
}
export function putKKeyboardMappingInfo(ks: KSerializer, obj: KKeyboardMappingInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_KEYBOARD_MAPPING_INFO_RW)) {
    if (Boolean(f.SERV_KEYBOARD_MAPPING_INFO_RW)) { if (!(ks.putMap((obj.m_mapKeyboardMappingInfo ?? new Map<Int16, Int16>()), (ks, k: Int16) => ks.putInt16(k), (ks, v: Int16) => ks.putInt16(v)))) return false; }
    if (f.SERV_KEYBOARD_MAPPING_INFO_RW && f.SERV_KEY_MAPPING_INT) { if (!(ks.putMap((obj.m_mapGamePadMappingInfo ?? new Map<Int16, Int16>()), (ks, k: Int16) => ks.putInt16(k), (ks, v: Int16) => ks.putInt16(v)))) return false; }
  }
  return true;
}
export function getKKeyboardMappingInfo(ks: KSerializer, flags?: FlagInput): KKeyboardMappingInfo {
  const f = resolveFlags(flags);
  const obj = createKKeyboardMappingInfo(f);
  if (Boolean(f.SERV_KEYBOARD_MAPPING_INFO_RW)) {
    if (Boolean(f.SERV_KEYBOARD_MAPPING_INFO_RW)) { obj.m_mapKeyboardMappingInfo = ks.getMap<Int16, Int16>((ks) => ks.getInt16(), (ks) => ks.getInt16()); }
    if (f.SERV_KEYBOARD_MAPPING_INFO_RW && f.SERV_KEY_MAPPING_INT) { obj.m_mapGamePadMappingInfo = ks.getMap<Int16, Int16>((ks) => ks.getInt16(), (ks) => ks.getInt16()); }
  }
  return obj;
}

export interface KAdminCheatSkill {
  m_iSkillLevel?: Int32;
  m_iSkillCSPoint?: Int32;
}
export function createKAdminCheatSkill(flags?: FlagInput): KAdminCheatSkill {
  const f = resolveFlags(flags);
  const obj: KAdminCheatSkill = {
  };
  if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) obj.m_iSkillLevel = 0;
  if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) obj.m_iSkillCSPoint = 0;
  return obj;
}
export function putKAdminCheatSkill(ks: KSerializer, obj: KAdminCheatSkill, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) {
    if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) { if (!(ks.putInt32((obj.m_iSkillLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) { if (!(ks.putInt32((obj.m_iSkillCSPoint ?? 0)))) return false; }
  }
  return true;
}
export function getKAdminCheatSkill(ks: KSerializer, flags?: FlagInput): KAdminCheatSkill {
  const f = resolveFlags(flags);
  const obj = createKAdminCheatSkill(f);
  if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) {
    if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) { obj.m_iSkillLevel = ks.getInt32(); }
    if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) { obj.m_iSkillCSPoint = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_ADMIN_CHEAT_GET_ALL_SKILL_REQ {
  m_iActiveSkillPageNumber?: Int32;
}
export function createKEGS_ADMIN_CHEAT_GET_ALL_SKILL_REQ(flags?: FlagInput): KEGS_ADMIN_CHEAT_GET_ALL_SKILL_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_ADMIN_CHEAT_GET_ALL_SKILL_REQ = {
  };
  if (f.SERV_ADMIN_CHEAT_GET_ALL_SKILL && f.SERV_SKILL_PAGE_SYSTEM) obj.m_iActiveSkillPageNumber = 0;
  return obj;
}
export function putKEGS_ADMIN_CHEAT_GET_ALL_SKILL_REQ(ks: KSerializer, obj: KEGS_ADMIN_CHEAT_GET_ALL_SKILL_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (f.SERV_ADMIN_CHEAT_GET_ALL_SKILL && f.SERV_SKILL_PAGE_SYSTEM) {
    if (f.SERV_ADMIN_CHEAT_GET_ALL_SKILL && f.SERV_SKILL_PAGE_SYSTEM) { if (!(ks.putInt32((obj.m_iActiveSkillPageNumber ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_ADMIN_CHEAT_GET_ALL_SKILL_REQ(ks: KSerializer, flags?: FlagInput): KEGS_ADMIN_CHEAT_GET_ALL_SKILL_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_ADMIN_CHEAT_GET_ALL_SKILL_REQ(f);
  if (f.SERV_ADMIN_CHEAT_GET_ALL_SKILL && f.SERV_SKILL_PAGE_SYSTEM) {
    if (f.SERV_ADMIN_CHEAT_GET_ALL_SKILL && f.SERV_SKILL_PAGE_SYSTEM) { obj.m_iActiveSkillPageNumber = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_ADMIN_CHEAT_GET_ALL_SKILL_ACK {
  m_iOK?: Int32;
  m_iActiveSkillPageNumber?: Int32;
  m_vecUnSealedSkill?: Int16[];
  m_mapSkillInfo?: Map<Int32, KAdminCheatSkill>;
}
export function createKEGS_ADMIN_CHEAT_GET_ALL_SKILL_ACK(flags?: FlagInput): KEGS_ADMIN_CHEAT_GET_ALL_SKILL_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_ADMIN_CHEAT_GET_ALL_SKILL_ACK = {
  };
  if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) obj.m_iOK = 0;
  if (f.SERV_ADMIN_CHEAT_GET_ALL_SKILL && f.SERV_SKILL_PAGE_SYSTEM) obj.m_iActiveSkillPageNumber = 0;
  if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) obj.m_vecUnSealedSkill = ([] as Int16[]);
  if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) obj.m_mapSkillInfo = new Map<Int32, KAdminCheatSkill>();
  return obj;
}
export function putKEGS_ADMIN_CHEAT_GET_ALL_SKILL_ACK(ks: KSerializer, obj: KEGS_ADMIN_CHEAT_GET_ALL_SKILL_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) {
    if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (f.SERV_ADMIN_CHEAT_GET_ALL_SKILL && f.SERV_SKILL_PAGE_SYSTEM) { if (!(ks.putInt32((obj.m_iActiveSkillPageNumber ?? 0)))) return false; }
    if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) { if (!(ks.putVector((obj.m_vecUnSealedSkill ?? ([] as Int16[])), (ks, item: Int16) => ks.putInt16(item)))) return false; }
    if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) { if (!(ks.putMap((obj.m_mapSkillInfo ?? new Map<Int32, KAdminCheatSkill>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: KAdminCheatSkill) => ks.putUserClass(v, putKAdminCheatSkill, f)))) return false; }
  }
  return true;
}
export function getKEGS_ADMIN_CHEAT_GET_ALL_SKILL_ACK(ks: KSerializer, flags?: FlagInput): KEGS_ADMIN_CHEAT_GET_ALL_SKILL_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_ADMIN_CHEAT_GET_ALL_SKILL_ACK(f);
  if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) {
    if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) { obj.m_iOK = ks.getInt32(); }
    if (f.SERV_ADMIN_CHEAT_GET_ALL_SKILL && f.SERV_SKILL_PAGE_SYSTEM) { obj.m_iActiveSkillPageNumber = ks.getInt32(); }
    if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) { obj.m_vecUnSealedSkill = ks.getVector<Int16>((ks) => ks.getInt16()); }
    if (Boolean(f.SERV_ADMIN_CHEAT_GET_ALL_SKILL)) { obj.m_mapSkillInfo = ks.getMap<Int32, KAdminCheatSkill>((ks) => ks.getInt32(), (ks) => ks.getUserClass(getKAdminCheatSkill, f)); }
  }
  return obj;
}

export interface KRegUnitInfo {
  m_iUserUID?: UidType;
  m_iUnitUID?: UidType;
  m_wstrUnitNickName?: string;
  m_iGSUID?: UidType;
  m_iChannelID?: Int32;
  m_wstrIP?: string;
  m_cAuthLevel?: Int8;
  m_iChannelCode?: Int32;
}
export function createKRegUnitInfo(flags?: FlagInput): KRegUnitInfo {
  const f = resolveFlags(flags);
  const obj: KRegUnitInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iUserUID = 0n;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_wstrUnitNickName = '';
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iGSUID = 0n;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_iChannelID = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_wstrIP = '';
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) obj.m_cAuthLevel = 0;
  if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_EVENT_JACKPOT) obj.m_iChannelCode = 0;
  return obj;
}
export function putKRegUnitInfo(ks: KSerializer, obj: KRegUnitInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt64((obj.m_iUserUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putWString((obj.m_wstrUnitNickName ?? '')))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt64((obj.m_iGSUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt32((obj.m_iChannelID ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putWString((obj.m_wstrIP ?? '')))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { if (!(ks.putInt8((obj.m_cAuthLevel ?? 0)))) return false; }
    if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_EVENT_JACKPOT) { if (!(ks.putInt32((obj.m_iChannelCode ?? 0)))) return false; }
  }
  return true;
}
export function getKRegUnitInfo(ks: KSerializer, flags?: FlagInput): KRegUnitInfo {
  const f = resolveFlags(flags);
  const obj = createKRegUnitInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) {
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iUserUID = ks.getInt64(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_wstrUnitNickName = ks.getWString(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iGSUID = ks.getInt64(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_iChannelID = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_wstrIP = ks.getWString(); }
    if (Boolean(f.SERV_BATTLE_FIELD_SYSTEM)) { obj.m_cAuthLevel = ks.getInt8(); }
    if (f.SERV_BATTLE_FIELD_SYSTEM && f.SERV_EVENT_JACKPOT) { obj.m_iChannelCode = ks.getInt32(); }
  }
  return obj;
}

export interface KDBE_CHECK_THE_ARCHUANGEL_S_COIN_EVENT_LETTER_ACK {
  m_iOK?: Int32;
  m_bReceiveTheLetter?: boolean;
}
export function createKDBE_CHECK_THE_ARCHUANGEL_S_COIN_EVENT_LETTER_ACK(flags?: FlagInput): KDBE_CHECK_THE_ARCHUANGEL_S_COIN_EVENT_LETTER_ACK {
  const f = resolveFlags(flags);
  const obj: KDBE_CHECK_THE_ARCHUANGEL_S_COIN_EVENT_LETTER_ACK = {
  };
  if (Boolean(f.SERV_ARCHUANGEL_S_COIN_EVENT_GUIDE)) obj.m_iOK = 0;
  if (Boolean(f.SERV_ARCHUANGEL_S_COIN_EVENT_GUIDE)) obj.m_bReceiveTheLetter = false;
  return obj;
}
export function putKDBE_CHECK_THE_ARCHUANGEL_S_COIN_EVENT_LETTER_ACK(ks: KSerializer, obj: KDBE_CHECK_THE_ARCHUANGEL_S_COIN_EVENT_LETTER_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ARCHUANGEL_S_COIN_EVENT_GUIDE)) {
    if (Boolean(f.SERV_ARCHUANGEL_S_COIN_EVENT_GUIDE)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_ARCHUANGEL_S_COIN_EVENT_GUIDE)) { if (!(ks.putBool((obj.m_bReceiveTheLetter ?? false)))) return false; }
  }
  return true;
}
export function getKDBE_CHECK_THE_ARCHUANGEL_S_COIN_EVENT_LETTER_ACK(ks: KSerializer, flags?: FlagInput): KDBE_CHECK_THE_ARCHUANGEL_S_COIN_EVENT_LETTER_ACK {
  const f = resolveFlags(flags);
  const obj = createKDBE_CHECK_THE_ARCHUANGEL_S_COIN_EVENT_LETTER_ACK(f);
  if (Boolean(f.SERV_ARCHUANGEL_S_COIN_EVENT_GUIDE)) {
    if (Boolean(f.SERV_ARCHUANGEL_S_COIN_EVENT_GUIDE)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_ARCHUANGEL_S_COIN_EVENT_GUIDE)) { obj.m_bReceiveTheLetter = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_GET_ITEM_FROM_LETTER_ACK {
  m_iOK?: Int32;
  m_iPostNo?: UidType;
  m_bSystemLetter?: boolean;
  m_mapResultItem?: Map<Int32, Int32>;
  m_vecKInventorySlotInfo?: KInventoryItemInfo[];
  m_iED?: Int32;
  m_iUnitUID?: UidType;
  m_kItemQuantityUpdate?: KItemQuantityUpdate;
  m_vecMoveItemSlotInfo?: KInventoryItemInfo[];
  m_cLetterType?: Int8;
}
export function createKEGS_GET_ITEM_FROM_LETTER_ACK(flags?: FlagInput): KEGS_GET_ITEM_FROM_LETTER_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_GET_ITEM_FROM_LETTER_ACK = {
  };
  if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) {
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) obj.m_iOK = 0;
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) obj.m_iPostNo = 0n;
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) obj.m_bSystemLetter = false;
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) obj.m_mapResultItem = new Map<Int32, Int32>();
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) obj.m_vecKInventorySlotInfo = ([] as KInventoryItemInfo[]);
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) obj.m_iED = 0;
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) obj.m_iUnitUID = 0n;
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) obj.m_kItemQuantityUpdate = createKItemQuantityUpdate(f);
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) obj.m_vecMoveItemSlotInfo = ([] as KInventoryItemInfo[]);
  }
  else if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) {
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) obj.m_iOK = 0;
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) obj.m_iPostNo = 0n;
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER && f.SERV_RELATIONSHIP_SYSTEM) obj.m_cLetterType = 0;
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER && !f.SERV_RELATIONSHIP_SYSTEM) obj.m_bSystemLetter = false;
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) obj.m_mapResultItem = new Map<Int32, Int32>();
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) obj.m_vecKInventorySlotInfo = ([] as KInventoryItemInfo[]);
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) obj.m_iED = 0;
  }
  return obj;
}
export function putKEGS_GET_ITEM_FROM_LETTER_ACK(ks: KSerializer, obj: KEGS_GET_ITEM_FROM_LETTER_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) {
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { if (!(ks.putInt64((obj.m_iPostNo ?? 0n)))) return false; }
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { if (!(ks.putBool((obj.m_bSystemLetter ?? false)))) return false; }
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { if (!(ks.putMap((obj.m_mapResultItem ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { if (!(ks.putVector((obj.m_vecKInventorySlotInfo ?? ([] as KInventoryItemInfo[])), (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false; }
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { if (!(ks.putInt32((obj.m_iED ?? 0)))) return false; }
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { if (!(ks.putUserClass((obj.m_kItemQuantityUpdate ?? createKItemQuantityUpdate(f)), putKItemQuantityUpdate, f))) return false; }
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { if (!(ks.putVector((obj.m_vecMoveItemSlotInfo ?? ([] as KInventoryItemInfo[])), (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false; }
  }
  else if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) {
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) { if (!(ks.putInt64((obj.m_iPostNo ?? 0n)))) return false; }
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER && f.SERV_RELATIONSHIP_SYSTEM) { if (!(ks.putInt8((obj.m_cLetterType ?? 0)))) return false; }
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER && !f.SERV_RELATIONSHIP_SYSTEM) { if (!(ks.putBool((obj.m_bSystemLetter ?? false)))) return false; }
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) { if (!(ks.putMap((obj.m_mapResultItem ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) { if (!(ks.putVector((obj.m_vecKInventorySlotInfo ?? ([] as KInventoryItemInfo[])), (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false; }
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) { if (!(ks.putInt32((obj.m_iED ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_GET_ITEM_FROM_LETTER_ACK(ks: KSerializer, flags?: FlagInput): KEGS_GET_ITEM_FROM_LETTER_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_GET_ITEM_FROM_LETTER_ACK(f);
  if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) {
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { obj.m_iPostNo = ks.getInt64(); }
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { obj.m_bSystemLetter = ks.getBool(); }
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { obj.m_mapResultItem = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { obj.m_vecKInventorySlotInfo = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { obj.m_iED = ks.getInt32(); }
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { obj.m_kItemQuantityUpdate = ks.getUserClass(getKItemQuantityUpdate, f); }
    if (Boolean(f.SERV_TRADE_LOGIC_CHANGE_LETTER)) { obj.m_vecMoveItemSlotInfo = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
  }
  else if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) {
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) { obj.m_iOK = ks.getInt32(); }
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) { obj.m_iPostNo = ks.getInt64(); }
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER && f.SERV_RELATIONSHIP_SYSTEM) { obj.m_cLetterType = ks.getInt8(); }
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER && !f.SERV_RELATIONSHIP_SYSTEM) { obj.m_bSystemLetter = ks.getBool(); }
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) { obj.m_mapResultItem = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) { obj.m_vecKInventorySlotInfo = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f)); }
    if (!f.SERV_TRADE_LOGIC_CHANGE_LETTER) { obj.m_iED = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_PARTY_GAME_START_OPINION_CHECK_NOT {
  m_iDungeonID?: Int32;
  m_cDifficultyLevel?: Int8;
  m_cDungeonMode?: Int8;
}
export function createKEGS_PARTY_GAME_START_OPINION_CHECK_NOT(flags?: FlagInput): KEGS_PARTY_GAME_START_OPINION_CHECK_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_PARTY_GAME_START_OPINION_CHECK_NOT = {
  };
  if (Boolean(f.SERV_FIX_MANUAL_PARTY_DUNGEON_POPUP_BUG)) obj.m_iDungeonID = 0;
  if (Boolean(f.SERV_FIX_MANUAL_PARTY_DUNGEON_POPUP_BUG)) obj.m_cDifficultyLevel = 0;
  if (Boolean(f.SERV_FIX_MANUAL_PARTY_DUNGEON_POPUP_BUG)) obj.m_cDungeonMode = 0;
  return obj;
}
export function putKEGS_PARTY_GAME_START_OPINION_CHECK_NOT(ks: KSerializer, obj: KEGS_PARTY_GAME_START_OPINION_CHECK_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_FIX_MANUAL_PARTY_DUNGEON_POPUP_BUG)) {
    if (Boolean(f.SERV_FIX_MANUAL_PARTY_DUNGEON_POPUP_BUG)) { if (!(ks.putInt32((obj.m_iDungeonID ?? 0)))) return false; }
    if (Boolean(f.SERV_FIX_MANUAL_PARTY_DUNGEON_POPUP_BUG)) { if (!(ks.putInt8((obj.m_cDifficultyLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_FIX_MANUAL_PARTY_DUNGEON_POPUP_BUG)) { if (!(ks.putInt8((obj.m_cDungeonMode ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_PARTY_GAME_START_OPINION_CHECK_NOT(ks: KSerializer, flags?: FlagInput): KEGS_PARTY_GAME_START_OPINION_CHECK_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_PARTY_GAME_START_OPINION_CHECK_NOT(f);
  if (Boolean(f.SERV_FIX_MANUAL_PARTY_DUNGEON_POPUP_BUG)) {
    if (Boolean(f.SERV_FIX_MANUAL_PARTY_DUNGEON_POPUP_BUG)) { obj.m_iDungeonID = ks.getInt32(); }
    if (Boolean(f.SERV_FIX_MANUAL_PARTY_DUNGEON_POPUP_BUG)) { obj.m_cDifficultyLevel = ks.getInt8(); }
    if (Boolean(f.SERV_FIX_MANUAL_PARTY_DUNGEON_POPUP_BUG)) { obj.m_cDungeonMode = ks.getInt8(); }
  }
  return obj;
}

export interface KEGS_ITEM_EXCHANGE_REQ {
  m_iHouseID: Int32;
  m_iSourceItemUID?: UidType;
  m_iSourceItemID: Int32;
  m_iSourceQuantity?: Int32;
  m_iDestItemID: Int32;
}
export function createKEGS_ITEM_EXCHANGE_REQ(flags?: FlagInput): KEGS_ITEM_EXCHANGE_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_ITEM_EXCHANGE_REQ = {
    m_iHouseID: 0,
    m_iSourceItemID: 0,
    m_iDestItemID: 0,
  };
  if (Boolean(f.SERV_ITEM_EXCHANGE_NEW)) obj.m_iSourceItemUID = 0n;
  if (Boolean(f.SERV_ITEM_EXCHANGE_NEW)) obj.m_iSourceQuantity = 0;
  return obj;
}
export function putKEGS_ITEM_EXCHANGE_REQ(ks: KSerializer, obj: KEGS_ITEM_EXCHANGE_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iHouseID))) return false;
  if (Boolean(f.SERV_ITEM_EXCHANGE_NEW)) { if (!(ks.putInt64((obj.m_iSourceItemUID ?? 0n)))) return false; }
  if (!(ks.putInt32(obj.m_iSourceItemID))) return false;
  if (Boolean(f.SERV_ITEM_EXCHANGE_NEW)) { if (!(ks.putInt32((obj.m_iSourceQuantity ?? 0)))) return false; }
  if (!(ks.putInt32(obj.m_iDestItemID))) return false;
  return true;
}
export function getKEGS_ITEM_EXCHANGE_REQ(ks: KSerializer, flags?: FlagInput): KEGS_ITEM_EXCHANGE_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_ITEM_EXCHANGE_REQ(f);
  obj.m_iHouseID = ks.getInt32();
  if (Boolean(f.SERV_ITEM_EXCHANGE_NEW)) { obj.m_iSourceItemUID = ks.getInt64(); }
  obj.m_iSourceItemID = ks.getInt32();
  if (Boolean(f.SERV_ITEM_EXCHANGE_NEW)) { obj.m_iSourceQuantity = ks.getInt32(); }
  obj.m_iDestItemID = ks.getInt32();
  return obj;
}

export interface KEGS_ITEM_EXCHANGE_ACK {
  m_iOK: Int32;
  m_vecKInventorySlotInfo: KInventoryItemInfo[];
  m_mapResultItem?: Map<Int32, Int32>;
  m_iExchangeCount?: Int32;
}
export function createKEGS_ITEM_EXCHANGE_ACK(flags?: FlagInput): KEGS_ITEM_EXCHANGE_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_ITEM_EXCHANGE_ACK = {
    m_iOK: 0,
    m_vecKInventorySlotInfo: ([] as KInventoryItemInfo[]),
  };
  if (Boolean(f.SERV_RANDOM_EXCHANGE_RESULT_VIEW)) obj.m_mapResultItem = new Map<Int32, Int32>();
  if (Boolean(f.SERV_GROW_UP_SOCKET)) obj.m_iExchangeCount = 0;
  return obj;
}
export function putKEGS_ITEM_EXCHANGE_ACK(ks: KSerializer, obj: KEGS_ITEM_EXCHANGE_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (!(ks.putInt32(obj.m_iOK))) return false;
  if (!(ks.putVector(obj.m_vecKInventorySlotInfo, (ks, item: KInventoryItemInfo) => ks.putUserClass(item, putKInventoryItemInfo, f)))) return false;
  if (Boolean(f.SERV_RANDOM_EXCHANGE_RESULT_VIEW)) { if (!(ks.putMap((obj.m_mapResultItem ?? new Map<Int32, Int32>()), (ks, k: Int32) => ks.putInt32(k), (ks, v: Int32) => ks.putInt32(v)))) return false; }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { if (!(ks.putInt32((obj.m_iExchangeCount ?? 0)))) return false; }
  return true;
}
export function getKEGS_ITEM_EXCHANGE_ACK(ks: KSerializer, flags?: FlagInput): KEGS_ITEM_EXCHANGE_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_ITEM_EXCHANGE_ACK(f);
  obj.m_iOK = ks.getInt32();
  obj.m_vecKInventorySlotInfo = ks.getVector<KInventoryItemInfo>((ks) => ks.getUserClass(getKInventoryItemInfo, f));
  if (Boolean(f.SERV_RANDOM_EXCHANGE_RESULT_VIEW)) { obj.m_mapResultItem = ks.getMap<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()); }
  if (Boolean(f.SERV_GROW_UP_SOCKET)) { obj.m_iExchangeCount = ks.getInt32(); }
  return obj;
}

export interface KLogStatInfo {
  m_wstrFunctionName?: string;
  m_wstrFileName?: string;
  m_wstrLineNum?: string;
  m_iCount?: Int32;
}
export function createKLogStatInfo(flags?: FlagInput): KLogStatInfo {
  const f = resolveFlags(flags);
  const obj: KLogStatInfo = {
  };
  if (Boolean(f.SERV_LOG_SYSTEM_NEW)) obj.m_wstrFunctionName = '';
  if (Boolean(f.SERV_LOG_SYSTEM_NEW)) obj.m_wstrFileName = '';
  if (Boolean(f.SERV_LOG_SYSTEM_NEW)) obj.m_wstrLineNum = '';
  if (Boolean(f.SERV_LOG_SYSTEM_NEW)) obj.m_iCount = 0;
  return obj;
}
export function putKLogStatInfo(ks: KSerializer, obj: KLogStatInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_LOG_SYSTEM_NEW)) {
    if (Boolean(f.SERV_LOG_SYSTEM_NEW)) { if (!(ks.putWString((obj.m_wstrFunctionName ?? '')))) return false; }
    if (Boolean(f.SERV_LOG_SYSTEM_NEW)) { if (!(ks.putWString((obj.m_wstrFileName ?? '')))) return false; }
    if (Boolean(f.SERV_LOG_SYSTEM_NEW)) { if (!(ks.putWString((obj.m_wstrLineNum ?? '')))) return false; }
    if (Boolean(f.SERV_LOG_SYSTEM_NEW)) { if (!(ks.putInt32((obj.m_iCount ?? 0)))) return false; }
  }
  return true;
}
export function getKLogStatInfo(ks: KSerializer, flags?: FlagInput): KLogStatInfo {
  const f = resolveFlags(flags);
  const obj = createKLogStatInfo(f);
  if (Boolean(f.SERV_LOG_SYSTEM_NEW)) {
    if (Boolean(f.SERV_LOG_SYSTEM_NEW)) { obj.m_wstrFunctionName = ks.getWString(); }
    if (Boolean(f.SERV_LOG_SYSTEM_NEW)) { obj.m_wstrFileName = ks.getWString(); }
    if (Boolean(f.SERV_LOG_SYSTEM_NEW)) { obj.m_wstrLineNum = ks.getWString(); }
    if (Boolean(f.SERV_LOG_SYSTEM_NEW)) { obj.m_iCount = ks.getInt32(); }
  }
  return obj;
}

export const KFirstSelectUnitReward_FIRST_SELECT_UNIT_REWARD = {
  FSUR_NONE: 0,
  FSUR_WEB_EVENT: 1,
  FSUR_SYSTEM_ERROR: 2,
  FSUR_END: 3,
} as const;
export type KFirstSelectUnitReward_FIRST_SELECT_UNIT_REWARD = (typeof KFirstSelectUnitReward_FIRST_SELECT_UNIT_REWARD)[keyof typeof KFirstSelectUnitReward_FIRST_SELECT_UNIT_REWARD];
export function getKFirstSelectUnitReward_FIRST_SELECT_UNIT_REWARD(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) {
    cur = 0;
    out['FSUR_NONE'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) {
    out['FSUR_WEB_EVENT'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) {
    out['FSUR_SYSTEM_ERROR'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) {
    out['FSUR_END'] = cur;
    cur += 1;
  }
  return out;
}
export const KFirstSelectUnitReward_GIVE_GROUP_TYPE = {
  GGT_ONLY_ONE: -1,
  GGT_SOLES: 0,
  GGT_GAIA: 1,
} as const;
export type KFirstSelectUnitReward_GIVE_GROUP_TYPE = (typeof KFirstSelectUnitReward_GIVE_GROUP_TYPE)[keyof typeof KFirstSelectUnitReward_GIVE_GROUP_TYPE];
export function getKFirstSelectUnitReward_GIVE_GROUP_TYPE(flags?: FlagInput): Record<string, number> {
  const f = resolveFlags(flags);
  const out: Record<string, number> = {};
  let cur = 0;
  if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) {
    cur = -1;
    out['GGT_ONLY_ONE'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) {
    cur = 0;
    out['GGT_SOLES'] = cur;
    cur += 1;
  }
  if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) {
    cur = 1;
    out['GGT_GAIA'] = cur;
    cur += 1;
  }
  return out;
}
export interface KFirstSelectUnitReward {
  m_iUnitUID?: UidType;
  m_cRewardType?: Int8;
  m_cGiveType?: Int8;
  m_iItemID?: Int32;
  m_iQuantity?: Int32;
  m_iDBIndexID?: Int32;
}
export function createKFirstSelectUnitReward(flags?: FlagInput): KFirstSelectUnitReward {
  const f = resolveFlags(flags);
  const obj: KFirstSelectUnitReward = {
  };
  if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) obj.m_cRewardType = 0;
  if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) obj.m_cGiveType = -1;
  if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) obj.m_iItemID = 0;
  if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) obj.m_iQuantity = 0;
  if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) obj.m_iDBIndexID = 0;
  return obj;
}
export function putKFirstSelectUnitReward(ks: KSerializer, obj: KFirstSelectUnitReward, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) {
    if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) { if (!(ks.putInt8((obj.m_cRewardType ?? 0)))) return false; }
    if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) { if (!(ks.putInt8((obj.m_cGiveType ?? -1)))) return false; }
    if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) { if (!(ks.putInt32((obj.m_iItemID ?? 0)))) return false; }
    if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) { if (!(ks.putInt32((obj.m_iQuantity ?? 0)))) return false; }
    if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) { if (!(ks.putInt32((obj.m_iDBIndexID ?? 0)))) return false; }
  }
  return true;
}
export function getKFirstSelectUnitReward(ks: KSerializer, flags?: FlagInput): KFirstSelectUnitReward {
  const f = resolveFlags(flags);
  const obj = createKFirstSelectUnitReward(f);
  if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) {
    if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) { obj.m_cRewardType = ks.getInt8(); }
    if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) { obj.m_cGiveType = ks.getInt8(); }
    if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) { obj.m_iItemID = ks.getInt32(); }
    if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) { obj.m_iQuantity = ks.getInt32(); }
    if (Boolean(f.SERV_FIRST_SELECT_UNIT_REWARD_SYSTEM)) { obj.m_iDBIndexID = ks.getInt32(); }
  }
  return obj;
}

export interface KLocalRankingUnitInfo {
  m_iUnitUID?: UidType;
  m_wstrNickName?: string;
  m_ucLevel?: UInt8;
  m_cUnitClass?: Int8;
  m_iPoint?: Int32[];
}
export function createKLocalRankingUnitInfo(flags?: FlagInput): KLocalRankingUnitInfo {
  const f = resolveFlags(flags);
  const obj: KLocalRankingUnitInfo = {
  };
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_wstrNickName = '';
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_ucLevel = 0;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_cUnitClass = 0;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_iPoint = Array.from({ length: 2 }, () => 0);
  return obj;
}
export function putKLocalRankingUnitInfo(ks: KSerializer, obj: KLocalRankingUnitInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) {
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putUInt8((obj.m_ucLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt8((obj.m_cUnitClass ?? 0)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt32((obj.m_iPoint?.[0] ?? 0)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt32((obj.m_iPoint?.[1] ?? 0)))) return false; }
  }
  return true;
}
export function getKLocalRankingUnitInfo(ks: KSerializer, flags?: FlagInput): KLocalRankingUnitInfo {
  const f = resolveFlags(flags);
  const obj = createKLocalRankingUnitInfo(f);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) {
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_wstrNickName = ks.getWString(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_ucLevel = ks.getUInt8(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_cUnitClass = ks.getInt8(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { (obj.m_iPoint ??= [])[0] = ks.getInt32(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { (obj.m_iPoint ??= [])[1] = ks.getInt32(); }
  }
  return obj;
}

export interface KLocalRankingUserInfoCounter {
  m_kInfo?: KLocalRankingUserInfo;
  m_iCounter?: Int32;
}
export function createKLocalRankingUserInfoCounter(flags?: FlagInput): KLocalRankingUserInfoCounter {
  const f = resolveFlags(flags);
  const obj: KLocalRankingUserInfoCounter = {
  };
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_kInfo = createKLocalRankingUserInfo(f);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_iCounter = 0;
  return obj;
}
export function putKLocalRankingUserInfoCounter(ks: KSerializer, obj: KLocalRankingUserInfoCounter, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) {
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putUserClass((obj.m_kInfo ?? createKLocalRankingUserInfo(f)), putKLocalRankingUserInfo, f))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt32((obj.m_iCounter ?? 0)))) return false; }
  }
  return true;
}
export function getKLocalRankingUserInfoCounter(ks: KSerializer, flags?: FlagInput): KLocalRankingUserInfoCounter {
  const f = resolveFlags(flags);
  const obj = createKLocalRankingUserInfoCounter(f);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) {
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_kInfo = ks.getUserClass(getKLocalRankingUserInfo, f); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_iCounter = ks.getInt32(); }
  }
  return obj;
}

export interface KLocalRankingUnitInfoCounter {
  m_iUserUID?: UidType;
  m_iCounter?: Int32;
  m_kInfo?: KLocalRankingUnitInfo;
}
export function createKLocalRankingUnitInfoCounter(flags?: FlagInput): KLocalRankingUnitInfoCounter {
  const f = resolveFlags(flags);
  const obj: KLocalRankingUnitInfoCounter = {
  };
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_iUserUID = 0n;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_iCounter = 0;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_kInfo = createKLocalRankingUnitInfo(f);
  return obj;
}
export function putKLocalRankingUnitInfoCounter(ks: KSerializer, obj: KLocalRankingUnitInfoCounter, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) {
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt64((obj.m_iUserUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt32((obj.m_iCounter ?? 0)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putUserClass((obj.m_kInfo ?? createKLocalRankingUnitInfo(f)), putKLocalRankingUnitInfo, f))) return false; }
  }
  return true;
}
export function getKLocalRankingUnitInfoCounter(ks: KSerializer, flags?: FlagInput): KLocalRankingUnitInfoCounter {
  const f = resolveFlags(flags);
  const obj = createKLocalRankingUnitInfoCounter(f);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) {
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_iUserUID = ks.getInt64(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_iCounter = ks.getInt32(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_kInfo = ks.getUserClass(getKLocalRankingUnitInfo, f); }
  }
  return obj;
}

export interface KLocalRankingRankerInfo {
  m_iRank?: Int32;
  m_kUserInfo?: KLocalRankingUserInfo;
  m_kUnitInfo?: KLocalRankingUnitInfo;
}
export function createKLocalRankingRankerInfo(flags?: FlagInput): KLocalRankingRankerInfo {
  const f = resolveFlags(flags);
  const obj: KLocalRankingRankerInfo = {
  };
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_iRank = 0;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_kUserInfo = createKLocalRankingUserInfo(f);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_kUnitInfo = createKLocalRankingUnitInfo(f);
  return obj;
}
export function putKLocalRankingRankerInfo(ks: KSerializer, obj: KLocalRankingRankerInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) {
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt32((obj.m_iRank ?? 0)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putUserClass((obj.m_kUserInfo ?? createKLocalRankingUserInfo(f)), putKLocalRankingUserInfo, f))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putUserClass((obj.m_kUnitInfo ?? createKLocalRankingUnitInfo(f)), putKLocalRankingUnitInfo, f))) return false; }
  }
  return true;
}
export function getKLocalRankingRankerInfo(ks: KSerializer, flags?: FlagInput): KLocalRankingRankerInfo {
  const f = resolveFlags(flags);
  const obj = createKLocalRankingRankerInfo(f);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) {
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_iRank = ks.getInt32(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_kUserInfo = ks.getUserClass(getKLocalRankingUserInfo, f); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_kUnitInfo = ks.getUserClass(getKLocalRankingUnitInfo, f); }
  }
  return obj;
}

export interface KLocalRankingInquiryData {
  m_nViewPage?: UInt32;
  m_cMainTabIndex?: Int8;
  m_cSubTabIndex?: Int8;
  m_byteFilter?: UInt8;
  m_kMyRankInfo?: KLocalRankingRankerInfo;
  m_setFriendList?: Set<UidType>;
  m_iGuildUID?: Int32;
}
export function createKLocalRankingInquiryData(flags?: FlagInput): KLocalRankingInquiryData {
  const f = resolveFlags(flags);
  const obj: KLocalRankingInquiryData = {
  };
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_nViewPage = 0;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_cMainTabIndex = -1;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_cSubTabIndex = -1;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_byteFilter = 0;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_kMyRankInfo = createKLocalRankingRankerInfo(f);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_setFriendList = new Set<UidType>();
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_iGuildUID = 0;
  return obj;
}
export function putKLocalRankingInquiryData(ks: KSerializer, obj: KLocalRankingInquiryData, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) {
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putUInt32((obj.m_nViewPage ?? 0)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt8((obj.m_cMainTabIndex ?? -1)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt8((obj.m_cSubTabIndex ?? -1)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putUInt8((obj.m_byteFilter ?? 0)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putUserClass((obj.m_kMyRankInfo ?? createKLocalRankingRankerInfo(f)), putKLocalRankingRankerInfo, f))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putSet((obj.m_setFriendList ?? new Set<UidType>()), (ks, item: UidType) => ks.putInt64(item)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt32((obj.m_iGuildUID ?? 0)))) return false; }
  }
  return true;
}
export function getKLocalRankingInquiryData(ks: KSerializer, flags?: FlagInput): KLocalRankingInquiryData {
  const f = resolveFlags(flags);
  const obj = createKLocalRankingInquiryData(f);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) {
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_nViewPage = ks.getUInt32(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_cMainTabIndex = ks.getInt8(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_cSubTabIndex = ks.getInt8(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_byteFilter = ks.getUInt8(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_kMyRankInfo = ks.getUserClass(getKLocalRankingRankerInfo, f); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_setFriendList = ks.getSet<UidType>((ks) => ks.getInt64()); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_iGuildUID = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_LOCAL_RANKING_RANK_UP_NOT {
  m_iMyRank?: Int32;
  m_cMainTabIndex?: Int8;
  m_cSubTabIndex?: Int8;
  m_kMyUnitInfo?: KLocalRankingUnitInfo;
  m_kNextUnitInfo?: KLocalRankingUnitInfo;
}
export function createKEGS_LOCAL_RANKING_RANK_UP_NOT(flags?: FlagInput): KEGS_LOCAL_RANKING_RANK_UP_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_LOCAL_RANKING_RANK_UP_NOT = {
  };
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_iMyRank = 0;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_cMainTabIndex = -1;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_cSubTabIndex = -1;
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_kMyUnitInfo = createKLocalRankingUnitInfo(f);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) obj.m_kNextUnitInfo = createKLocalRankingUnitInfo(f);
  return obj;
}
export function putKEGS_LOCAL_RANKING_RANK_UP_NOT(ks: KSerializer, obj: KEGS_LOCAL_RANKING_RANK_UP_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) {
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt32((obj.m_iMyRank ?? 0)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt8((obj.m_cMainTabIndex ?? -1)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putInt8((obj.m_cSubTabIndex ?? -1)))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putUserClass((obj.m_kMyUnitInfo ?? createKLocalRankingUnitInfo(f)), putKLocalRankingUnitInfo, f))) return false; }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { if (!(ks.putUserClass((obj.m_kNextUnitInfo ?? createKLocalRankingUnitInfo(f)), putKLocalRankingUnitInfo, f))) return false; }
  }
  return true;
}
export function getKEGS_LOCAL_RANKING_RANK_UP_NOT(ks: KSerializer, flags?: FlagInput): KEGS_LOCAL_RANKING_RANK_UP_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_LOCAL_RANKING_RANK_UP_NOT(f);
  if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) {
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_iMyRank = ks.getInt32(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_cMainTabIndex = ks.getInt8(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_cSubTabIndex = ks.getInt8(); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_kMyUnitInfo = ks.getUserClass(getKLocalRankingUnitInfo, f); }
    if (Boolean(f.SERV_LOCAL_RANKING_SYSTEM)) { obj.m_kNextUnitInfo = ks.getUserClass(getKLocalRankingUnitInfo, f); }
  }
  return obj;
}

export interface KVillageLagInfo {
  m_iLagType?: Int32;
  m_iPartyType?: Int32;
  m_iPartyUserNum?: Int32;
  m_iMapID?: Int32;
  m_iVillageUserNum?: Int32;
  m_fLagTime?: Float32;
  m_fPlayTime?: Float32;
  m_iLagTotalNum?: Int32;
  m_fLagTotalTime?: Float32;
}
export function createKVillageLagInfo(flags?: FlagInput): KVillageLagInfo {
  const f = resolveFlags(flags);
  const obj: KVillageLagInfo = {
  };
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iLagType = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iPartyType = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iPartyUserNum = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iMapID = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iVillageUserNum = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_fLagTime = -1.0;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_fPlayTime = -1.0;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iLagTotalNum = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_fLagTotalTime = -1.0;
  return obj;
}
export function putKVillageLagInfo(ks: KSerializer, obj: KVillageLagInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) {
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iLagType ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iPartyType ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iPartyUserNum ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iMapID ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iVillageUserNum ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putFloat32((obj.m_fLagTime ?? -1.0)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putFloat32((obj.m_fPlayTime ?? -1.0)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iLagTotalNum ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putFloat32((obj.m_fLagTotalTime ?? -1.0)))) return false; }
  }
  return true;
}
export function getKVillageLagInfo(ks: KSerializer, flags?: FlagInput): KVillageLagInfo {
  const f = resolveFlags(flags);
  const obj = createKVillageLagInfo(f);
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) {
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iLagType = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iPartyType = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iPartyUserNum = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iMapID = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iVillageUserNum = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_fLagTime = ks.getFloat32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_fPlayTime = ks.getFloat32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iLagTotalNum = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_fLagTotalTime = ks.getFloat32(); }
  }
  return obj;
}

export interface KFieldLagInfo {
  m_iLagType?: Int32;
  m_iPartyType?: Int32;
  m_iPartyUserNum?: Int32;
  m_iMapID?: Int32;
  m_iFieldUserNum?: Int32;
  m_fLagTime?: Float32;
  m_fPlayTime?: Float32;
  m_iLagTotalNum?: Int32;
  m_fLagTotalTime?: Float32;
}
export function createKFieldLagInfo(flags?: FlagInput): KFieldLagInfo {
  const f = resolveFlags(flags);
  const obj: KFieldLagInfo = {
  };
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iLagType = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iPartyType = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iPartyUserNum = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iMapID = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iFieldUserNum = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_fLagTime = -1.0;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_fPlayTime = -1.0;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iLagTotalNum = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_fLagTotalTime = -1.0;
  return obj;
}
export function putKFieldLagInfo(ks: KSerializer, obj: KFieldLagInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) {
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iLagType ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iPartyType ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iPartyUserNum ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iMapID ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iFieldUserNum ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putFloat32((obj.m_fLagTime ?? -1.0)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putFloat32((obj.m_fPlayTime ?? -1.0)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iLagTotalNum ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putFloat32((obj.m_fLagTotalTime ?? -1.0)))) return false; }
  }
  return true;
}
export function getKFieldLagInfo(ks: KSerializer, flags?: FlagInput): KFieldLagInfo {
  const f = resolveFlags(flags);
  const obj = createKFieldLagInfo(f);
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) {
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iLagType = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iPartyType = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iPartyUserNum = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iMapID = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iFieldUserNum = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_fLagTime = ks.getFloat32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_fPlayTime = ks.getFloat32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iLagTotalNum = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_fLagTotalTime = ks.getFloat32(); }
  }
  return obj;
}

export interface KDungeonLagInfo {
  m_iLagType?: Int32;
  m_iPartyType?: Int32;
  m_iPartyUserNum?: Int32;
  m_iMapID?: Int32;
  m_iDifficulty?: Int32;
  m_iStage?: Int32;
  m_iBlock?: Int32;
  m_fLagTime?: Float32;
  m_fPlayTime?: Float32;
  m_iLagTotalNum?: Int32;
  m_fLagTotalTime?: Float32;
}
export function createKDungeonLagInfo(flags?: FlagInput): KDungeonLagInfo {
  const f = resolveFlags(flags);
  const obj: KDungeonLagInfo = {
  };
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iLagType = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iPartyType = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iPartyUserNum = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iMapID = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iDifficulty = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iStage = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iBlock = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_fLagTime = -1.0;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_fPlayTime = -1.0;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iLagTotalNum = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_fLagTotalTime = -1.0;
  return obj;
}
export function putKDungeonLagInfo(ks: KSerializer, obj: KDungeonLagInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) {
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iLagType ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iPartyType ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iPartyUserNum ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iMapID ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iDifficulty ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iStage ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iBlock ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putFloat32((obj.m_fLagTime ?? -1.0)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putFloat32((obj.m_fPlayTime ?? -1.0)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iLagTotalNum ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putFloat32((obj.m_fLagTotalTime ?? -1.0)))) return false; }
  }
  return true;
}
export function getKDungeonLagInfo(ks: KSerializer, flags?: FlagInput): KDungeonLagInfo {
  const f = resolveFlags(flags);
  const obj = createKDungeonLagInfo(f);
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) {
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iLagType = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iPartyType = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iPartyUserNum = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iMapID = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iDifficulty = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iStage = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iBlock = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_fLagTime = ks.getFloat32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_fPlayTime = ks.getFloat32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iLagTotalNum = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_fLagTotalTime = ks.getFloat32(); }
  }
  return obj;
}

export interface KPvPLagInfo {
  m_iLagType?: Int32;
  m_iMapID?: Int32;
  m_iPvPUserNum?: Int32;
  m_iRuleType?: Int32;
  m_iRound?: Int32;
  m_fLagTime?: Float32;
  m_fPlayTime?: Float32;
  m_iLagTotalNum?: Int32;
  m_fLagTotalTime?: Float32;
}
export function createKPvPLagInfo(flags?: FlagInput): KPvPLagInfo {
  const f = resolveFlags(flags);
  const obj: KPvPLagInfo = {
  };
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iLagType = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iMapID = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iPvPUserNum = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iRuleType = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iRound = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_fLagTime = -1.0;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_fPlayTime = -1.0;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_iLagTotalNum = -1;
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) obj.m_fLagTotalTime = -1.0;
  return obj;
}
export function putKPvPLagInfo(ks: KSerializer, obj: KPvPLagInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) {
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iLagType ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iMapID ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iPvPUserNum ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iRuleType ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iRound ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putFloat32((obj.m_fLagTime ?? -1.0)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putFloat32((obj.m_fPlayTime ?? -1.0)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putInt32((obj.m_iLagTotalNum ?? -1)))) return false; }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { if (!(ks.putFloat32((obj.m_fLagTotalTime ?? -1.0)))) return false; }
  }
  return true;
}
export function getKPvPLagInfo(ks: KSerializer, flags?: FlagInput): KPvPLagInfo {
  const f = resolveFlags(flags);
  const obj = createKPvPLagInfo(f);
  if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) {
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iLagType = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iMapID = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iPvPUserNum = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iRuleType = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iRound = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_fLagTime = ks.getFloat32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_fPlayTime = ks.getFloat32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_iLagTotalNum = ks.getInt32(); }
    if (Boolean(f.SERV_ACTIVE_KOG_GAME_PERFORMANCE_CHECK)) { obj.m_fLagTotalTime = ks.getFloat32(); }
  }
  return obj;
}

export interface KStatRelationLevel {
  m_fBaseHPRelLV?: Float32;
  m_fAtkPhysicRelLV?: Float32;
  m_fAtkMagicRelLV?: Float32;
  m_fDefPhysicRelLV?: Float32;
  m_fDefMagicRelLV?: Float32;
}
export function createKStatRelationLevel(flags?: FlagInput): KStatRelationLevel {
  const f = resolveFlags(flags);
  const obj: KStatRelationLevel = {
  };
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) obj.m_fBaseHPRelLV = 0;
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) obj.m_fAtkPhysicRelLV = 0;
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) obj.m_fAtkMagicRelLV = 0;
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) obj.m_fDefPhysicRelLV = 0;
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) obj.m_fDefMagicRelLV = 0;
  return obj;
}
export function putKStatRelationLevel(ks: KSerializer, obj: KStatRelationLevel, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) {
    if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { if (!(ks.putFloat32((obj.m_fBaseHPRelLV ?? 0)))) return false; }
    if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { if (!(ks.putFloat32((obj.m_fAtkPhysicRelLV ?? 0)))) return false; }
    if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { if (!(ks.putFloat32((obj.m_fAtkMagicRelLV ?? 0)))) return false; }
    if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { if (!(ks.putFloat32((obj.m_fDefPhysicRelLV ?? 0)))) return false; }
    if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { if (!(ks.putFloat32((obj.m_fDefMagicRelLV ?? 0)))) return false; }
  }
  return true;
}
export function getKStatRelationLevel(ks: KSerializer, flags?: FlagInput): KStatRelationLevel {
  const f = resolveFlags(flags);
  const obj = createKStatRelationLevel(f);
  if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) {
    if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { obj.m_fBaseHPRelLV = ks.getFloat32(); }
    if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { obj.m_fAtkPhysicRelLV = ks.getFloat32(); }
    if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { obj.m_fAtkMagicRelLV = ks.getFloat32(); }
    if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { obj.m_fDefPhysicRelLV = ks.getFloat32(); }
    if (Boolean(f.SERV_NEW_ITEM_SYSTEM_2013_05)) { obj.m_fDefMagicRelLV = ks.getFloat32(); }
  }
  return obj;
}

export interface KHeroPvpUserInfo {
  m_iServerGroupID?: UidType;
  m_wstrNickName?: string;
  m_bOn?: boolean;
  m_bConnect?: boolean;
}
export function createKHeroPvpUserInfo(flags?: FlagInput): KHeroPvpUserInfo {
  const f = resolveFlags(flags);
  const obj: KHeroPvpUserInfo = {
  };
  if (Boolean(f.SERV_HERO_PVP_MANAGE_LIST)) obj.m_iServerGroupID = -1n;
  if (Boolean(f.SERV_HERO_PVP_MANAGE_LIST)) obj.m_wstrNickName = '';
  if (Boolean(f.SERV_HERO_PVP_MANAGE_LIST)) obj.m_bOn = false;
  if (Boolean(f.SERV_HERO_PVP_MANAGE_LIST)) obj.m_bConnect = false;
  return obj;
}
export function putKHeroPvpUserInfo(ks: KSerializer, obj: KHeroPvpUserInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_HERO_PVP_MANAGE_LIST)) {
    if (Boolean(f.SERV_HERO_PVP_MANAGE_LIST)) { if (!(ks.putInt64((obj.m_iServerGroupID ?? -1n)))) return false; }
    if (Boolean(f.SERV_HERO_PVP_MANAGE_LIST)) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
    if (Boolean(f.SERV_HERO_PVP_MANAGE_LIST)) { if (!(ks.putBool((obj.m_bOn ?? false)))) return false; }
    if (Boolean(f.SERV_HERO_PVP_MANAGE_LIST)) { if (!(ks.putBool((obj.m_bConnect ?? false)))) return false; }
  }
  return true;
}
export function getKHeroPvpUserInfo(ks: KSerializer, flags?: FlagInput): KHeroPvpUserInfo {
  const f = resolveFlags(flags);
  const obj = createKHeroPvpUserInfo(f);
  if (Boolean(f.SERV_HERO_PVP_MANAGE_LIST)) {
    if (Boolean(f.SERV_HERO_PVP_MANAGE_LIST)) { obj.m_iServerGroupID = ks.getInt64(); }
    if (Boolean(f.SERV_HERO_PVP_MANAGE_LIST)) { obj.m_wstrNickName = ks.getWString(); }
    if (Boolean(f.SERV_HERO_PVP_MANAGE_LIST)) { obj.m_bOn = ks.getBool(); }
    if (Boolean(f.SERV_HERO_PVP_MANAGE_LIST)) { obj.m_bConnect = ks.getBool(); }
  }
  return obj;
}

export interface KGetSkillInfo {
  m_iSkillID?: Int32;
  m_iBeforeSkillLevel?: Int32;
  m_iSkillLevel?: Int32;
  m_iSpendSkillCSPoint?: Int32;
}
export function createKGetSkillInfo(flags?: FlagInput): KGetSkillInfo {
  const f = resolveFlags(flags);
  const obj: KGetSkillInfo = {
  };
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) obj.m_iSkillID = 0;
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) obj.m_iBeforeSkillLevel = 0;
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) obj.m_iSkillLevel = 0;
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) obj.m_iSpendSkillCSPoint = 0;
  return obj;
}
export function putKGetSkillInfo(ks: KSerializer, obj: KGetSkillInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) {
    if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) { if (!(ks.putInt32((obj.m_iSkillID ?? 0)))) return false; }
    if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) { if (!(ks.putInt32((obj.m_iBeforeSkillLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) { if (!(ks.putInt32((obj.m_iSkillLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) { if (!(ks.putInt32((obj.m_iSpendSkillCSPoint ?? 0)))) return false; }
  }
  return true;
}
export function getKGetSkillInfo(ks: KSerializer, flags?: FlagInput): KGetSkillInfo {
  const f = resolveFlags(flags);
  const obj = createKGetSkillInfo(f);
  if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) {
    if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) { obj.m_iSkillID = ks.getInt32(); }
    if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) { obj.m_iBeforeSkillLevel = ks.getInt32(); }
    if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) { obj.m_iSkillLevel = ks.getInt32(); }
    if (Boolean(f.SERV_UPGRADE_SKILL_SYSTEM_2013)) { obj.m_iSpendSkillCSPoint = ks.getInt32(); }
  }
  return obj;
}

export interface KCouponBoxTargetItem {
  m_iItemQuantity?: Int32;
  m_sItemUseDuration?: Int16;
  m_wstrItemCode?: string;
  m_wstrItemName?: string;
}
export function createKCouponBoxTargetItem(flags?: FlagInput): KCouponBoxTargetItem {
  const f = resolveFlags(flags);
  const obj: KCouponBoxTargetItem = {
  };
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_iItemQuantity = 0;
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_sItemUseDuration = 0;
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_wstrItemCode = '';
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_wstrItemName = '';
  return obj;
}
export function putKCouponBoxTargetItem(ks: KSerializer, obj: KCouponBoxTargetItem, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) {
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putInt32((obj.m_iItemQuantity ?? 0)))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putInt16((obj.m_sItemUseDuration ?? 0)))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putWString((obj.m_wstrItemCode ?? '')))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putWString((obj.m_wstrItemName ?? '')))) return false; }
  }
  return true;
}
export function getKCouponBoxTargetItem(ks: KSerializer, flags?: FlagInput): KCouponBoxTargetItem {
  const f = resolveFlags(flags);
  const obj = createKCouponBoxTargetItem(f);
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) {
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_iItemQuantity = ks.getInt32(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_sItemUseDuration = ks.getInt16(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_wstrItemCode = ks.getWString(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_wstrItemName = ks.getWString(); }
  }
  return obj;
}

export interface KClientCouponBox {
  m_wstrContractDetailName?: string;
  m_iContractDetailNo?: Int32;
  m_wstrCouponBoxType?: string;
  m_wstrCouponBoxTypeText?: string;
  m_iCouponCardNo?: Int32;
  m_iCouponCardStatus?: Int16;
  m_wstrCouponCardStatusText?: string;
  m_wstrDiscountValue?: string;
  m_wstrExpireDateTime?: string;
  m_wstrObtainDateTime?: string;
  m_wstrValidDateRange?: string;
  m_wstrUsedDateTime?: string;
  m_vecTargetItem?: KCouponBoxTargetItem[];
}
export function createKClientCouponBox(flags?: FlagInput): KClientCouponBox {
  const f = resolveFlags(flags);
  const obj: KClientCouponBox = {
  };
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_wstrContractDetailName = '';
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_iContractDetailNo = 0;
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_wstrCouponBoxType = '';
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_wstrCouponBoxTypeText = '';
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_iCouponCardNo = 0;
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_iCouponCardStatus = 0;
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_wstrCouponCardStatusText = '';
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_wstrDiscountValue = '';
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_wstrExpireDateTime = '';
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_wstrObtainDateTime = '';
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_wstrValidDateRange = '';
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_wstrUsedDateTime = '';
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_vecTargetItem = ([] as KCouponBoxTargetItem[]);
  return obj;
}
export function putKClientCouponBox(ks: KSerializer, obj: KClientCouponBox, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) {
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putWString((obj.m_wstrContractDetailName ?? '')))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putInt32((obj.m_iContractDetailNo ?? 0)))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putWString((obj.m_wstrCouponBoxType ?? '')))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putWString((obj.m_wstrCouponBoxTypeText ?? '')))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putInt32((obj.m_iCouponCardNo ?? 0)))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putInt16((obj.m_iCouponCardStatus ?? 0)))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putWString((obj.m_wstrCouponCardStatusText ?? '')))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putWString((obj.m_wstrDiscountValue ?? '')))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putWString((obj.m_wstrExpireDateTime ?? '')))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putWString((obj.m_wstrObtainDateTime ?? '')))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putWString((obj.m_wstrValidDateRange ?? '')))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putWString((obj.m_wstrUsedDateTime ?? '')))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putVector((obj.m_vecTargetItem ?? ([] as KCouponBoxTargetItem[])), (ks, item: KCouponBoxTargetItem) => ks.putUserClass(item, putKCouponBoxTargetItem, f)))) return false; }
  }
  return true;
}
export function getKClientCouponBox(ks: KSerializer, flags?: FlagInput): KClientCouponBox {
  const f = resolveFlags(flags);
  const obj = createKClientCouponBox(f);
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) {
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_wstrContractDetailName = ks.getWString(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_iContractDetailNo = ks.getInt32(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_wstrCouponBoxType = ks.getWString(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_wstrCouponBoxTypeText = ks.getWString(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_iCouponCardNo = ks.getInt32(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_iCouponCardStatus = ks.getInt16(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_wstrCouponCardStatusText = ks.getWString(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_wstrDiscountValue = ks.getWString(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_wstrExpireDateTime = ks.getWString(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_wstrObtainDateTime = ks.getWString(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_wstrValidDateRange = ks.getWString(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_wstrUsedDateTime = ks.getWString(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_vecTargetItem = ks.getVector<KCouponBoxTargetItem>((ks) => ks.getUserClass(getKCouponBoxTargetItem, f)); }
  }
  return obj;
}

export interface KDiscountCoupon {
  m_iCouponCardNo?: Int32;
  m_wstrContractDetailName?: string;
  m_wstrDiscountValue?: string;
  m_wstrExpireDateTime?: string;
}
export function createKDiscountCoupon(flags?: FlagInput): KDiscountCoupon {
  const f = resolveFlags(flags);
  const obj: KDiscountCoupon = {
  };
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_iCouponCardNo = 0;
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_wstrContractDetailName = '';
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_wstrDiscountValue = '';
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_wstrExpireDateTime = '';
  return obj;
}
export function putKDiscountCoupon(ks: KSerializer, obj: KDiscountCoupon, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) {
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putInt32((obj.m_iCouponCardNo ?? 0)))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putWString((obj.m_wstrContractDetailName ?? '')))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putWString((obj.m_wstrDiscountValue ?? '')))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putWString((obj.m_wstrExpireDateTime ?? '')))) return false; }
  }
  return true;
}
export function getKDiscountCoupon(ks: KSerializer, flags?: FlagInput): KDiscountCoupon {
  const f = resolveFlags(flags);
  const obj = createKDiscountCoupon(f);
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) {
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_iCouponCardNo = ks.getInt32(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_wstrContractDetailName = ks.getWString(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_wstrDiscountValue = ks.getWString(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_wstrExpireDateTime = ks.getWString(); }
  }
  return obj;
}

export interface KDiscountCouponInquriyInfo {
  m_ulProductNo?: UInt32;
  m_usOrderQuantity?: UInt16;
}
export function createKDiscountCouponInquriyInfo(flags?: FlagInput): KDiscountCouponInquriyInfo {
  const f = resolveFlags(flags);
  const obj: KDiscountCouponInquriyInfo = {
  };
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_ulProductNo = 0;
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) obj.m_usOrderQuantity = 0;
  return obj;
}
export function putKDiscountCouponInquriyInfo(ks: KSerializer, obj: KDiscountCouponInquriyInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) {
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putUInt32((obj.m_ulProductNo ?? 0)))) return false; }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { if (!(ks.putUInt16((obj.m_usOrderQuantity ?? 0)))) return false; }
  }
  return true;
}
export function getKDiscountCouponInquriyInfo(ks: KSerializer, flags?: FlagInput): KDiscountCouponInquriyInfo {
  const f = resolveFlags(flags);
  const obj = createKDiscountCouponInquriyInfo(f);
  if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) {
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_ulProductNo = ks.getUInt32(); }
    if (Boolean(f.SERV_NEXON_COUPON_SYSTEM)) { obj.m_usOrderQuantity = ks.getUInt16(); }
  }
  return obj;
}

export interface KBossFieldCreateInfo {
  m_tFieldHoldingTime?: Int64;
  m_tPortalOpenTime?: Int64;
  m_iBossFieldID?: Int32;
  m_iPortalMapID?: Int32;
  m_bBossField?: boolean;
}
export function createKBossFieldCreateInfo(flags?: FlagInput): KBossFieldCreateInfo {
  const f = resolveFlags(flags);
  const obj: KBossFieldCreateInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_tFieldHoldingTime = 0n;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_tPortalOpenTime = 0n;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_iBossFieldID = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_iPortalMapID = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_bBossField = false;
  return obj;
}
export function putKBossFieldCreateInfo(ks: KSerializer, obj: KBossFieldCreateInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt64((obj.m_tFieldHoldingTime ?? 0n)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt64((obj.m_tPortalOpenTime ?? 0n)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt32((obj.m_iBossFieldID ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt32((obj.m_iPortalMapID ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putBool((obj.m_bBossField ?? false)))) return false; }
  }
  return true;
}
export function getKBossFieldCreateInfo(ks: KSerializer, flags?: FlagInput): KBossFieldCreateInfo {
  const f = resolveFlags(flags);
  const obj = createKBossFieldCreateInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_tFieldHoldingTime = ks.getInt64(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_tPortalOpenTime = ks.getInt64(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_iBossFieldID = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_iPortalMapID = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_bBossField = ks.getBool(); }
  }
  return obj;
}

export interface KBossFieldJoinInfo {
  m_iReturnMapID?: Int32;
  m_ucLastTouchLineIndex?: UInt8;
  m_usLastPosValue?: UInt16;
  m_bIgnoreLastTouch?: boolean;
}
export function createKBossFieldJoinInfo(flags?: FlagInput): KBossFieldJoinInfo {
  const f = resolveFlags(flags);
  const obj: KBossFieldJoinInfo = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_iReturnMapID = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_ucLastTouchLineIndex = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_usLastPosValue = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_bIgnoreLastTouch = false;
  return obj;
}
export function putKBossFieldJoinInfo(ks: KSerializer, obj: KBossFieldJoinInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt32((obj.m_iReturnMapID ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putUInt8((obj.m_ucLastTouchLineIndex ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putUInt16((obj.m_usLastPosValue ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putBool((obj.m_bIgnoreLastTouch ?? false)))) return false; }
  }
  return true;
}
export function getKBossFieldJoinInfo(ks: KSerializer, flags?: FlagInput): KBossFieldJoinInfo {
  const f = resolveFlags(flags);
  const obj = createKBossFieldJoinInfo(f);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_iReturnMapID = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_ucLastTouchLineIndex = ks.getUInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_usLastPosValue = ks.getUInt16(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_bIgnoreLastTouch = ks.getBool(); }
  }
  return obj;
}

export interface KEGS_ADMIN_BOSS_FIELD_GATE_OPEN_REQ {
  m_iBattleFieldID?: Int32;
}
export function createKEGS_ADMIN_BOSS_FIELD_GATE_OPEN_REQ(flags?: FlagInput): KEGS_ADMIN_BOSS_FIELD_GATE_OPEN_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_ADMIN_BOSS_FIELD_GATE_OPEN_REQ = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_iBattleFieldID = 0;
  return obj;
}
export function putKEGS_ADMIN_BOSS_FIELD_GATE_OPEN_REQ(ks: KSerializer, obj: KEGS_ADMIN_BOSS_FIELD_GATE_OPEN_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt32((obj.m_iBattleFieldID ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_ADMIN_BOSS_FIELD_GATE_OPEN_REQ(ks: KSerializer, flags?: FlagInput): KEGS_ADMIN_BOSS_FIELD_GATE_OPEN_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_ADMIN_BOSS_FIELD_GATE_OPEN_REQ(f);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_iBattleFieldID = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_REQ {
  m_iBattleFieldID?: Int32;
}
export function createKEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_REQ(flags?: FlagInput): KEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_REQ = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_iBattleFieldID = 0;
  return obj;
}
export function putKEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_REQ(ks: KSerializer, obj: KEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt32((obj.m_iBattleFieldID ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_REQ(ks: KSerializer, flags?: FlagInput): KEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_REQ(f);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_iBattleFieldID = ks.getInt32(); }
  }
  return obj;
}

export interface KEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_ACK {
  m_iOK?: Int32;
  m_iBattleFieldID?: Int32;
  m_byteTotalDangerousValue?: UInt8;
}
export function createKEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_ACK(flags?: FlagInput): KEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_ACK {
  const f = resolveFlags(flags);
  const obj: KEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_ACK = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_iOK = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_iBattleFieldID = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_byteTotalDangerousValue = 0;
  return obj;
}
export function putKEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_ACK(ks: KSerializer, obj: KEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt32((obj.m_iOK ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt32((obj.m_iBattleFieldID ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putUInt8((obj.m_byteTotalDangerousValue ?? 0)))) return false; }
  }
  return true;
}
export function getKEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_ACK(ks: KSerializer, flags?: FlagInput): KEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_ACK {
  const f = resolveFlags(flags);
  const obj = createKEGS_ADMIN_GET_TOTAL_DANGEROUS_VALUE_ACK(f);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_iOK = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_iBattleFieldID = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_byteTotalDangerousValue = ks.getUInt8(); }
  }
  return obj;
}

export interface KEGS_ADMIN_SET_TOTAL_DANGEROUS_VALUE_REQ {
  m_iBattleFieldID?: Int32;
  m_iTotalDangerousValue?: Int32;
  m_bSet?: boolean;
}
export function createKEGS_ADMIN_SET_TOTAL_DANGEROUS_VALUE_REQ(flags?: FlagInput): KEGS_ADMIN_SET_TOTAL_DANGEROUS_VALUE_REQ {
  const f = resolveFlags(flags);
  const obj: KEGS_ADMIN_SET_TOTAL_DANGEROUS_VALUE_REQ = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_iBattleFieldID = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_iTotalDangerousValue = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_bSet = true;
  return obj;
}
export function putKEGS_ADMIN_SET_TOTAL_DANGEROUS_VALUE_REQ(ks: KSerializer, obj: KEGS_ADMIN_SET_TOTAL_DANGEROUS_VALUE_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt32((obj.m_iBattleFieldID ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt32((obj.m_iTotalDangerousValue ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putBool((obj.m_bSet ?? true)))) return false; }
  }
  return true;
}
export function getKEGS_ADMIN_SET_TOTAL_DANGEROUS_VALUE_REQ(ks: KSerializer, flags?: FlagInput): KEGS_ADMIN_SET_TOTAL_DANGEROUS_VALUE_REQ {
  const f = resolveFlags(flags);
  const obj = createKEGS_ADMIN_SET_TOTAL_DANGEROUS_VALUE_REQ(f);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_iBattleFieldID = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_iTotalDangerousValue = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_bSet = ks.getBool(); }
  }
  return obj;
}

export interface KBossFieldLog {
  m_iBossFieldID?: Int32;
  m_iPortalMapID?: Int32;
  m_iPlayTime?: Int32;
  m_byteRemainUserCount?: UInt8;
  m_bSucceed?: boolean;
  m_wstrPortalOpenTime?: string;
}
export function createKBossFieldLog(flags?: FlagInput): KBossFieldLog {
  const f = resolveFlags(flags);
  const obj: KBossFieldLog = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_iBossFieldID = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_iPortalMapID = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_iPlayTime = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_byteRemainUserCount = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_bSucceed = false;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_wstrPortalOpenTime = '';
  return obj;
}
export function putKBossFieldLog(ks: KSerializer, obj: KBossFieldLog, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt32((obj.m_iBossFieldID ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt32((obj.m_iPortalMapID ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt32((obj.m_iPlayTime ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putUInt8((obj.m_byteRemainUserCount ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putBool((obj.m_bSucceed ?? false)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putWString((obj.m_wstrPortalOpenTime ?? '')))) return false; }
  }
  return true;
}
export function getKBossFieldLog(ks: KSerializer, flags?: FlagInput): KBossFieldLog {
  const f = resolveFlags(flags);
  const obj = createKBossFieldLog(f);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_iBossFieldID = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_iPortalMapID = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_iPlayTime = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_byteRemainUserCount = ks.getUInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_bSucceed = ks.getBool(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_wstrPortalOpenTime = ks.getWString(); }
  }
  return obj;
}

export interface KBossFieldUserLog {
  m_iUnitUID?: UidType;
  m_iGivenDamage?: Int64;
  m_iAttackDamage?: Int64;
  m_iEXP?: Int32;
  m_iED?: Int32;
  m_sNumResurrectionStone?: Int16;
  m_byteLevel?: UInt8;
  m_byteClass?: UInt8;
  m_byteCompletionType?: UInt8;
  m_byteContributionRank?: UInt8;
  m_wstrNickName?: string;
}
export function createKBossFieldUserLog(flags?: FlagInput): KBossFieldUserLog {
  const f = resolveFlags(flags);
  const obj: KBossFieldUserLog = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_iUnitUID = 0n;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_iGivenDamage = 0n;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_iAttackDamage = 0n;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_iEXP = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_iED = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_sNumResurrectionStone = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_byteLevel = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_byteClass = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_byteCompletionType = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_byteContributionRank = 0;
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_wstrNickName = '';
  return obj;
}
export function putKBossFieldUserLog(ks: KSerializer, obj: KBossFieldUserLog, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt64((obj.m_iUnitUID ?? 0n)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt64((obj.m_iGivenDamage ?? 0n)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt64((obj.m_iAttackDamage ?? 0n)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt32((obj.m_iEXP ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt32((obj.m_iED ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putInt16((obj.m_sNumResurrectionStone ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putUInt8((obj.m_byteLevel ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putUInt8((obj.m_byteClass ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putUInt8((obj.m_byteCompletionType ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putUInt8((obj.m_byteContributionRank ?? 0)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putWString((obj.m_wstrNickName ?? '')))) return false; }
  }
  return true;
}
export function getKBossFieldUserLog(ks: KSerializer, flags?: FlagInput): KBossFieldUserLog {
  const f = resolveFlags(flags);
  const obj = createKBossFieldUserLog(f);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_iUnitUID = ks.getInt64(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_iGivenDamage = ks.getInt64(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_iAttackDamage = ks.getInt64(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_iEXP = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_iED = ks.getInt32(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_sNumResurrectionStone = ks.getInt16(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_byteLevel = ks.getUInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_byteClass = ks.getUInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_byteCompletionType = ks.getUInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_byteContributionRank = ks.getUInt8(); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_wstrNickName = ks.getWString(); }
  }
  return obj;
}

export interface KEGS_BOSS_FIELD_LOG_NOT {
  m_mapGivenDamage?: Map<UidType, Int64>;
  m_mapAttackDamage?: Map<UidType, Int64>;
}
export function createKEGS_BOSS_FIELD_LOG_NOT(flags?: FlagInput): KEGS_BOSS_FIELD_LOG_NOT {
  const f = resolveFlags(flags);
  const obj: KEGS_BOSS_FIELD_LOG_NOT = {
  };
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_mapGivenDamage = new Map<UidType, Int64>();
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) obj.m_mapAttackDamage = new Map<UidType, Int64>();
  return obj;
}
export function putKEGS_BOSS_FIELD_LOG_NOT(ks: KSerializer, obj: KEGS_BOSS_FIELD_LOG_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putMap((obj.m_mapGivenDamage ?? new Map<UidType, Int64>()), (ks, k: UidType) => ks.putInt64(k), (ks, v: Int64) => ks.putInt64(v)))) return false; }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { if (!(ks.putMap((obj.m_mapAttackDamage ?? new Map<UidType, Int64>()), (ks, k: UidType) => ks.putInt64(k), (ks, v: Int64) => ks.putInt64(v)))) return false; }
  }
  return true;
}
export function getKEGS_BOSS_FIELD_LOG_NOT(ks: KSerializer, flags?: FlagInput): KEGS_BOSS_FIELD_LOG_NOT {
  const f = resolveFlags(flags);
  const obj = createKEGS_BOSS_FIELD_LOG_NOT(f);
  if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) {
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_mapGivenDamage = ks.getMap<UidType, Int64>((ks) => ks.getInt64(), (ks) => ks.getInt64()); }
    if (Boolean(f.SERV_BATTLE_FIELD_BOSS)) { obj.m_mapAttackDamage = ks.getMap<UidType, Int64>((ks) => ks.getInt64(), (ks) => ks.getInt64()); }
  }
  return obj;
}

export interface K4ThAnnivEventInfo {
  m_tTimeFirstPlay?: Int64;
  m_tTimeFirstPet?: Int64;
  m_tTimeFirstHenir?: Int64;
  m_tTimeFirstDeleteChar?: Int64;
  m_iItemIDFirstBuy?: Int32;
  m_iLongestConnectTime?: Int32;
  m_iCountQuestComplete?: Int32;
  m_iCountReceivedPost?: Int32;
  m_iDayTotalConnect?: Int32;
  m_iCountPvpLose?: Int32;
  m_iCountResurrect?: Int32;
  m_iCountDungeonClear?: Int32;
}
export function createK4ThAnnivEventInfo(flags?: FlagInput): K4ThAnnivEventInfo {
  const f = resolveFlags(flags);
  const obj: K4ThAnnivEventInfo = {
  };
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_tTimeFirstPlay = 0n;
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_tTimeFirstPet = 0n;
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_tTimeFirstHenir = 0n;
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_tTimeFirstDeleteChar = 0n;
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_iItemIDFirstBuy = 0;
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_iLongestConnectTime = 0;
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_iCountQuestComplete = 0;
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_iCountReceivedPost = 0;
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_iDayTotalConnect = 0;
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_iCountPvpLose = 0;
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_iCountResurrect = 0;
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) obj.m_iCountDungeonClear = 0;
  return obj;
}
export function putK4ThAnnivEventInfo(ks: KSerializer, obj: K4ThAnnivEventInfo, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) {
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putInt64((obj.m_tTimeFirstPlay ?? 0n)))) return false; }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putInt64((obj.m_tTimeFirstPet ?? 0n)))) return false; }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putInt64((obj.m_tTimeFirstHenir ?? 0n)))) return false; }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putInt64((obj.m_tTimeFirstDeleteChar ?? 0n)))) return false; }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putInt32((obj.m_iItemIDFirstBuy ?? 0)))) return false; }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putInt32((obj.m_iLongestConnectTime ?? 0)))) return false; }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putInt32((obj.m_iCountQuestComplete ?? 0)))) return false; }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putInt32((obj.m_iCountReceivedPost ?? 0)))) return false; }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putInt32((obj.m_iDayTotalConnect ?? 0)))) return false; }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putInt32((obj.m_iCountPvpLose ?? 0)))) return false; }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putInt32((obj.m_iCountResurrect ?? 0)))) return false; }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { if (!(ks.putInt32((obj.m_iCountDungeonClear ?? 0)))) return false; }
  }
  return true;
}
export function getK4ThAnnivEventInfo(ks: KSerializer, flags?: FlagInput): K4ThAnnivEventInfo {
  const f = resolveFlags(flags);
  const obj = createK4ThAnnivEventInfo(f);
  if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) {
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_tTimeFirstPlay = ks.getInt64(); }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_tTimeFirstPet = ks.getInt64(); }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_tTimeFirstHenir = ks.getInt64(); }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_tTimeFirstDeleteChar = ks.getInt64(); }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_iItemIDFirstBuy = ks.getInt32(); }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_iLongestConnectTime = ks.getInt32(); }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_iCountQuestComplete = ks.getInt32(); }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_iCountReceivedPost = ks.getInt32(); }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_iDayTotalConnect = ks.getInt32(); }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_iCountPvpLose = ks.getInt32(); }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_iCountResurrect = ks.getInt32(); }
    if (Boolean(f.SERV_4TH_ANNIVERSARY_EVENT)) { obj.m_iCountDungeonClear = ks.getInt32(); }
  }
  return obj;
}

export type KItemEnduranceUpdate = Map<UidType, Int32>;
export function createKItemEnduranceUpdate(flags?: FlagInput): KItemEnduranceUpdate {
  return new Map<UidType, Int32>();
}
export function putKItemEnduranceUpdate(ks: KSerializer, obj: KItemEnduranceUpdate, flags?: FlagInput): boolean {
  return ks.putMap(obj, (ks, k: UidType) => ks.putInt64(k), (ks, v: Int32) => ks.putInt32(v));
}
export function getKItemEnduranceUpdate(ks: KSerializer, flags?: FlagInput): KItemEnduranceUpdate {
  return ks.getMap<UidType, Int32>((ks) => ks.getInt64(), (ks) => ks.getInt32());
}

export type KItemPositionUpdate = Map<UidType, KItemPosition> | Map<UidType, [Int32, Int32]>;
export function createKItemPositionUpdate(flags?: FlagInput): KItemPositionUpdate {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PET_SYSTEM)) return new Map<UidType, KItemPosition>();
  return new Map<UidType, [Int32, Int32]>();
}
export function putKItemPositionUpdate(ks: KSerializer, obj: KItemPositionUpdate, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PET_SYSTEM)) return ks.putMap((obj as Map<UidType, KItemPosition>), (ks, k: UidType) => ks.putInt64(k), (ks, v: KItemPosition) => ks.putUserClass(v, putKItemPosition, f));
  return ks.putMap((obj as Map<UidType, [Int32, Int32]>), (ks, k: UidType) => ks.putInt64(k), (ks, v: [Int32, Int32]) => ks.putPair(v, (ks, a: Int32) => ks.putInt32(a), (ks, b: Int32) => ks.putInt32(b)));
}
export function getKItemPositionUpdate(ks: KSerializer, flags?: FlagInput): KItemPositionUpdate {
  const f = resolveFlags(flags);
  if (Boolean(f.SERV_PET_SYSTEM)) return ks.getMap<UidType, KItemPosition>((ks) => ks.getInt64(), (ks) => ks.getUserClass(getKItemPosition, f));
  return ks.getMap<UidType, [Int32, Int32]>((ks) => ks.getInt64(), (ks) => ks.getPair<Int32, Int32>((ks) => ks.getInt32(), (ks) => ks.getInt32()));
}

export type KDBE_NEW_QUEST_ACK = KQuestAck;
export function createKDBE_NEW_QUEST_ACK(flags?: FlagInput): KDBE_NEW_QUEST_ACK {
  const f = resolveFlags(flags);
  return createKQuestAck(f);
}
export function putKDBE_NEW_QUEST_ACK(ks: KSerializer, obj: KDBE_NEW_QUEST_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKQuestAck, f);
}
export function getKDBE_NEW_QUEST_ACK(ks: KSerializer, flags?: FlagInput): KDBE_NEW_QUEST_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKQuestAck, f);
}

export type KDBE_GIVE_UP_QUEST_REQ = KQuestReq;
export function createKDBE_GIVE_UP_QUEST_REQ(flags?: FlagInput): KDBE_GIVE_UP_QUEST_REQ {
  const f = resolveFlags(flags);
  return createKQuestReq(f);
}
export function putKDBE_GIVE_UP_QUEST_REQ(ks: KSerializer, obj: KDBE_GIVE_UP_QUEST_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKQuestReq, f);
}
export function getKDBE_GIVE_UP_QUEST_REQ(ks: KSerializer, flags?: FlagInput): KDBE_GIVE_UP_QUEST_REQ {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKQuestReq, f);
}

export type KDBE_GIVE_UP_QUEST_ACK = KQuestAck;
export function createKDBE_GIVE_UP_QUEST_ACK(flags?: FlagInput): KDBE_GIVE_UP_QUEST_ACK {
  const f = resolveFlags(flags);
  return createKQuestAck(f);
}
export function putKDBE_GIVE_UP_QUEST_ACK(ks: KSerializer, obj: KDBE_GIVE_UP_QUEST_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKQuestAck, f);
}
export function getKDBE_GIVE_UP_QUEST_ACK(ks: KSerializer, flags?: FlagInput): KDBE_GIVE_UP_QUEST_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKQuestAck, f);
}

export type KStatisticsData = Map<KStatisticsKey, Int64[]>;
export function createKStatisticsData(flags?: FlagInput): KStatisticsData {
  return new Map<KStatisticsKey, Int64[]>();
}
export function putKStatisticsData(ks: KSerializer, obj: KStatisticsData, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putMap(obj, (ks, k: KStatisticsKey) => ks.putUserClass(k, putKStatisticsKey, f), (ks, v: Int64[]) => ks.putVector(v, (ks, item: Int64) => ks.putInt64(item)));
}
export function getKStatisticsData(ks: KSerializer, flags?: FlagInput): KStatisticsData {
  const f = resolveFlags(flags);
  return ks.getMap<KStatisticsKey, Int64[]>((ks) => ks.getUserClass(getKStatisticsKey, f), (ks) => ks.getVector<Int64>((ks) => ks.getInt64()));
}

export type KGSCID = [UidType, UidType];
export function createKGSCID(flags?: FlagInput): KGSCID {
  return [0n, 0n];
}
export function putKGSCID(ks: KSerializer, obj: KGSCID, flags?: FlagInput): boolean {
  return ks.putPair(obj, (ks, a: UidType) => ks.putInt64(a), (ks, b: UidType) => ks.putInt64(b));
}
export function getKGSCID(ks: KSerializer, flags?: FlagInput): KGSCID {
  return ks.getPair<UidType, UidType>((ks) => ks.getInt64(), (ks) => ks.getInt64());
}

export type KEGS_VERIFY_ACCOUNT_REQ = KUserAuthenticateReq;
export function createKEGS_VERIFY_ACCOUNT_REQ(flags?: FlagInput): KEGS_VERIFY_ACCOUNT_REQ {
  const f = resolveFlags(flags);
  return createKUserAuthenticateReq(f);
}
export function putKEGS_VERIFY_ACCOUNT_REQ(ks: KSerializer, obj: KEGS_VERIFY_ACCOUNT_REQ, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKUserAuthenticateReq, f);
}
export function getKEGS_VERIFY_ACCOUNT_REQ(ks: KSerializer, flags?: FlagInput): KEGS_VERIFY_ACCOUNT_REQ {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKUserAuthenticateReq, f);
}

export type KEGS_ACCEPT_FRIEND_REQ = UidType;
export function createKEGS_ACCEPT_FRIEND_REQ(flags?: FlagInput): KEGS_ACCEPT_FRIEND_REQ {
  return 0n;
}
export function putKEGS_ACCEPT_FRIEND_REQ(ks: KSerializer, obj: KEGS_ACCEPT_FRIEND_REQ, flags?: FlagInput): boolean {
  return ks.putInt64(obj);
}
export function getKEGS_ACCEPT_FRIEND_REQ(ks: KSerializer, flags?: FlagInput): KEGS_ACCEPT_FRIEND_REQ {
  return ks.getInt64();
}

export type KEGS_DENY_FRIEND_REQ = UidType;
export function createKEGS_DENY_FRIEND_REQ(flags?: FlagInput): KEGS_DENY_FRIEND_REQ {
  return 0n;
}
export function putKEGS_DENY_FRIEND_REQ(ks: KSerializer, obj: KEGS_DENY_FRIEND_REQ, flags?: FlagInput): boolean {
  return ks.putInt64(obj);
}
export function getKEGS_DENY_FRIEND_REQ(ks: KSerializer, flags?: FlagInput): KEGS_DENY_FRIEND_REQ {
  return ks.getInt64();
}

export type KEGS_BLOCK_FRIEND_REQ = UidType;
export function createKEGS_BLOCK_FRIEND_REQ(flags?: FlagInput): KEGS_BLOCK_FRIEND_REQ {
  return 0n;
}
export function putKEGS_BLOCK_FRIEND_REQ(ks: KSerializer, obj: KEGS_BLOCK_FRIEND_REQ, flags?: FlagInput): boolean {
  return ks.putInt64(obj);
}
export function getKEGS_BLOCK_FRIEND_REQ(ks: KSerializer, flags?: FlagInput): KEGS_BLOCK_FRIEND_REQ {
  return ks.getInt64();
}

export type KEGS_UNBLOCK_FRIEND_REQ = UidType;
export function createKEGS_UNBLOCK_FRIEND_REQ(flags?: FlagInput): KEGS_UNBLOCK_FRIEND_REQ {
  return 0n;
}
export function putKEGS_UNBLOCK_FRIEND_REQ(ks: KSerializer, obj: KEGS_UNBLOCK_FRIEND_REQ, flags?: FlagInput): boolean {
  return ks.putInt64(obj);
}
export function getKEGS_UNBLOCK_FRIEND_REQ(ks: KSerializer, flags?: FlagInput): KEGS_UNBLOCK_FRIEND_REQ {
  return ks.getInt64();
}

export type KEGS_DELETE_FRIEND_REQ = UidType;
export function createKEGS_DELETE_FRIEND_REQ(flags?: FlagInput): KEGS_DELETE_FRIEND_REQ {
  return 0n;
}
export function putKEGS_DELETE_FRIEND_REQ(ks: KSerializer, obj: KEGS_DELETE_FRIEND_REQ, flags?: FlagInput): boolean {
  return ks.putInt64(obj);
}
export function getKEGS_DELETE_FRIEND_REQ(ks: KSerializer, flags?: FlagInput): KEGS_DELETE_FRIEND_REQ {
  return ks.getInt64();
}

export type KEGS_WORLD_TRIGGER_RELOCATION_ACK = KPacketOK;
export function createKEGS_WORLD_TRIGGER_RELOCATION_ACK(flags?: FlagInput): KEGS_WORLD_TRIGGER_RELOCATION_ACK {
  const f = resolveFlags(flags);
  return createKPacketOK(f);
}
export function putKEGS_WORLD_TRIGGER_RELOCATION_ACK(ks: KSerializer, obj: KEGS_WORLD_TRIGGER_RELOCATION_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKPacketOK, f);
}
export function getKEGS_WORLD_TRIGGER_RELOCATION_ACK(ks: KSerializer, flags?: FlagInput): KEGS_WORLD_TRIGGER_RELOCATION_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKPacketOK, f);
}

export type KEGS_WORLD_TRIGGER_RELOCATION_NOT = KEGS_WORLD_TRIGGER_RELOCATION_REQ;
export function createKEGS_WORLD_TRIGGER_RELOCATION_NOT(flags?: FlagInput): KEGS_WORLD_TRIGGER_RELOCATION_NOT {
  const f = resolveFlags(flags);
  return createKEGS_WORLD_TRIGGER_RELOCATION_REQ(f);
}
export function putKEGS_WORLD_TRIGGER_RELOCATION_NOT(ks: KSerializer, obj: KEGS_WORLD_TRIGGER_RELOCATION_NOT, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKEGS_WORLD_TRIGGER_RELOCATION_REQ, f);
}
export function getKEGS_WORLD_TRIGGER_RELOCATION_NOT(ks: KSerializer, flags?: FlagInput): KEGS_WORLD_TRIGGER_RELOCATION_NOT {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKEGS_WORLD_TRIGGER_RELOCATION_REQ, f);
}

export type KEGS_BUFF_SKILL_INFO_CONVEY_ACK = KPacketOK;
export function createKEGS_BUFF_SKILL_INFO_CONVEY_ACK(flags?: FlagInput): KEGS_BUFF_SKILL_INFO_CONVEY_ACK {
  const f = resolveFlags(flags);
  return createKPacketOK(f);
}
export function putKEGS_BUFF_SKILL_INFO_CONVEY_ACK(ks: KSerializer, obj: KEGS_BUFF_SKILL_INFO_CONVEY_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKPacketOK, f);
}
export function getKEGS_BUFF_SKILL_INFO_CONVEY_ACK(ks: KSerializer, flags?: FlagInput): KEGS_BUFF_SKILL_INFO_CONVEY_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKPacketOK, f);
}

export type KDBE_WRITE_LETTER_AND_TRADE_MOINTORING_ACK = KPacketOK;
export function createKDBE_WRITE_LETTER_AND_TRADE_MOINTORING_ACK(flags?: FlagInput): KDBE_WRITE_LETTER_AND_TRADE_MOINTORING_ACK {
  const f = resolveFlags(flags);
  return createKPacketOK(f);
}
export function putKDBE_WRITE_LETTER_AND_TRADE_MOINTORING_ACK(ks: KSerializer, obj: KDBE_WRITE_LETTER_AND_TRADE_MOINTORING_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKPacketOK, f);
}
export function getKDBE_WRITE_LETTER_AND_TRADE_MOINTORING_ACK(ks: KSerializer, flags?: FlagInput): KDBE_WRITE_LETTER_AND_TRADE_MOINTORING_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKPacketOK, f);
}

export type KEGS_ADMIN_BOSS_FIELD_GATE_OPEN_ACK = KPacketOK;
export function createKEGS_ADMIN_BOSS_FIELD_GATE_OPEN_ACK(flags?: FlagInput): KEGS_ADMIN_BOSS_FIELD_GATE_OPEN_ACK {
  const f = resolveFlags(flags);
  return createKPacketOK(f);
}
export function putKEGS_ADMIN_BOSS_FIELD_GATE_OPEN_ACK(ks: KSerializer, obj: KEGS_ADMIN_BOSS_FIELD_GATE_OPEN_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKPacketOK, f);
}
export function getKEGS_ADMIN_BOSS_FIELD_GATE_OPEN_ACK(ks: KSerializer, flags?: FlagInput): KEGS_ADMIN_BOSS_FIELD_GATE_OPEN_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKPacketOK, f);
}

export type KEGS_ADMIN_SET_TOTAL_DANGEROUS_VALUE_ACK = KPacketOK;
export function createKEGS_ADMIN_SET_TOTAL_DANGEROUS_VALUE_ACK(flags?: FlagInput): KEGS_ADMIN_SET_TOTAL_DANGEROUS_VALUE_ACK {
  const f = resolveFlags(flags);
  return createKPacketOK(f);
}
export function putKEGS_ADMIN_SET_TOTAL_DANGEROUS_VALUE_ACK(ks: KSerializer, obj: KEGS_ADMIN_SET_TOTAL_DANGEROUS_VALUE_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKPacketOK, f);
}
export function getKEGS_ADMIN_SET_TOTAL_DANGEROUS_VALUE_ACK(ks: KSerializer, flags?: FlagInput): KEGS_ADMIN_SET_TOTAL_DANGEROUS_VALUE_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKPacketOK, f);
}

export type KEGS_BOSS_FIELD_INTRUDE_RESTRICTION_ACK = KPacketOK;
export function createKEGS_BOSS_FIELD_INTRUDE_RESTRICTION_ACK(flags?: FlagInput): KEGS_BOSS_FIELD_INTRUDE_RESTRICTION_ACK {
  const f = resolveFlags(flags);
  return createKPacketOK(f);
}
export function putKEGS_BOSS_FIELD_INTRUDE_RESTRICTION_ACK(ks: KSerializer, obj: KEGS_BOSS_FIELD_INTRUDE_RESTRICTION_ACK, flags?: FlagInput): boolean {
  const f = resolveFlags(flags);
  return ks.putUserClass(obj, putKPacketOK, f);
}
export function getKEGS_BOSS_FIELD_INTRUDE_RESTRICTION_ACK(ks: KSerializer, flags?: FlagInput): KEGS_BOSS_FIELD_INTRUDE_RESTRICTION_ACK {
  const f = resolveFlags(flags);
  return ks.getUserClass(getKPacketOK, f);
}
