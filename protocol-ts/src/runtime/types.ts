/**
 * Primitive C++ / KNCSDK scalar type aliases mapped cleanly to TypeScript types.
 */

export type Int8 = number;
export type UInt8 = number;
export type Int16 = number;
export type UInt16 = number;
export type Int32 = number;
export type UInt32 = number;
export type Int64 = bigint;
export type UInt64 = bigint;
export type Float32 = number;
export type Float64 = number;

/** `typedef __int64 UidType;` (KncWX2Server/Common/KncUidType.h) */
export type UidType = bigint;

/** Unserialized MFC CTime / __time32_t placeholder */
export type CTimeValue = number;

/** `#define SERVER_SN 12` (KncWX2Server/Common/CommonPacket.h) */
export const SERVER_SN = 12 as const;

/** `KUnitSkillData::EQUIPPED_SKILL_SLOT_COUNT = 4` */
export const EQUIPPED_SKILL_SLOT_COUNT = 4 as const;
