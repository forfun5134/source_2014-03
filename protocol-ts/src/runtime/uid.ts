import type { UidType } from './types.ts';

/**
 * TypeScript port of `KncUid` bit-packing utilities (`KncWX2Server/Common/KncUidType.{h,cpp}`).
 *
 * Notice `#if defined( SERV_COUNTRY_CN ) || defined( SERV_COUNTRY_US ) #define EXTEND_SERVER_GROUP_MASK`:
 * - Standard: 39:0 PureUID (40 bits), 47:40 ReservedID (8 bits), 55:48 ServerID (8 bits), 61:56 ServerGroupID (6 bits), bit 62 TempUID
 * - Extended (CN / US): 35:0 PureUID (36 bits), 43:36 ReservedID (8 bits), 51:44 ServerID (8 bits), 61:52 ServerGroupID (10 bits), bit 62 TempUID
 */

const MASK_64 = 0xffff_ffff_ffff_ffffn;

export interface UidMaskOptions {
  readonly extendServerGroupMask?: boolean;
}

export function extractPureUID(uid: UidType, opts?: UidMaskOptions): UidType {
  const u = BigInt.asUintN(64, uid);
  return opts?.extendServerGroupMask
    ? u & 0x0000_000f_ffff_ffffn
    : u & 0x0000_00ff_ffff_ffffn;
}

export function extractServerGroupID(uid: UidType, opts?: UidMaskOptions): UidType {
  const u = BigInt.asUintN(64, uid);
  return opts?.extendServerGroupMask
    ? (u >> 52n) & 0x3ffn
    : (u >> 56n) & 0x3fn;
}

export function extractServerID(uid: UidType, opts?: UidMaskOptions): UidType {
  const u = BigInt.asUintN(64, uid);
  return opts?.extendServerGroupMask
    ? (u >> 44n) & 0xffn
    : (u >> 48n) & 0xffn;
}

export function extractReservedID(uid: UidType, opts?: UidMaskOptions): UidType {
  const u = BigInt.asUintN(64, uid);
  return opts?.extendServerGroupMask
    ? (u >> 36n) & 0xffn
    : (u >> 40n) & 0xffn;
}

export function extractCodeID(uid: UidType, opts?: UidMaskOptions): UidType {
  const u = BigInt.asUintN(64, uid);
  return opts?.extendServerGroupMask
    ? (u >> 36n) & 0xffffn
    : (u >> 40n) & 0xffffn;
}

export function setTempUID(destUid: UidType): UidType {
  const u = BigInt.asUintN(64, destUid);
  return BigInt.asIntN(64, (u & 0xbfff_ffff_ffff_ffffn) | (1n << 62n));
}

export function isTempUID(uid: UidType): boolean {
  const u = BigInt.asUintN(64, uid);
  return ((u >> 62n) & 1n) === 1n;
}

export function setPureUID(destUid: UidType, srcUid: UidType, opts?: UidMaskOptions): UidType {
  const d = BigInt.asUintN(64, destUid);
  const s = BigInt.asUintN(64, srcUid);
  const out = opts?.extendServerGroupMask
    ? (d & (0xffff_fff0_0000_0000n & MASK_64)) | (s & 0x0000_000f_ffff_ffffn)
    : (d & (0xffff_ff00_0000_0000n & MASK_64)) | (s & 0x0000_00ff_ffff_ffffn);
  return BigInt.asIntN(64, out);
}

export function setServerGroupID(destUid: UidType, srcUid: UidType, opts?: UidMaskOptions): UidType {
  const d = BigInt.asUintN(64, destUid);
  const s = BigInt.asUintN(64, srcUid);
  const out = opts?.extendServerGroupMask
    ? (d & 0xc00f_ffff_ffff_ffffn) | ((s & 0x3ffn) << 52n)
    : (d & 0xc0ff_ffff_ffff_ffffn) | ((s & 0x3fn) << 56n);
  return BigInt.asIntN(64, out);
}

export function setServerID(destUid: UidType, srcUid: UidType, opts?: UidMaskOptions): UidType {
  const d = BigInt.asUintN(64, destUid);
  const s = BigInt.asUintN(64, srcUid);
  const out = opts?.extendServerGroupMask
    ? (d & 0xfff0_0fff_ffff_ffffn) | ((s & 0xffn) << 44n)
    : (d & 0xff00_ffff_ffff_ffffn) | ((s & 0xffn) << 48n);
  return BigInt.asIntN(64, out);
}

export function setReservedID(destUid: UidType, srcUid: UidType, opts?: UidMaskOptions): UidType {
  const d = BigInt.asUintN(64, destUid);
  const s = BigInt.asUintN(64, srcUid);
  const out = opts?.extendServerGroupMask
    ? (d & 0xffff_f00f_ffff_ffffn) | ((s & 0xffn) << 36n)
    : (d & 0xffff_00ff_ffff_ffffn) | ((s & 0xffn) << 40n);
  return BigInt.asIntN(64, out);
}

export function setCodeID(destUid: UidType, srcUid: UidType, opts?: UidMaskOptions): UidType {
  const d = BigInt.asUintN(64, destUid);
  const s = BigInt.asUintN(64, srcUid);
  const out = opts?.extendServerGroupMask
    ? (d & 0xfff0_000f_ffff_ffffn) | ((s & 0xffffn) << 36n)
    : (d & 0xff00_00ff_ffff_ffffn) | ((s & 0xffffn) << 40n);
  return BigInt.asIntN(64, out);
}
