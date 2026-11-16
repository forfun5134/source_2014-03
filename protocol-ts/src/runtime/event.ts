import { KSerBuffer } from './ser-buffer.ts';
import { KSerializer, type GetCodec, type PutCodec } from './serializer.ts';
import type { UInt16, UInt32, UidType } from './types.ts';

/**
 * TypeScript port of `KPerformerInfo` and `KEvent` (`KncWX2Server/Common/Event.{h,cpp}`).
 */

export const KPerformerInfoConstants = {
  MAX_UID_NUM: 2000,
} as const;

export interface KPerformerInfo {
  m_dwPerformerID: UInt32;
  m_setUID: Set<UidType>;
}

export function createKPerformerInfo(): KPerformerInfo {
  return {
    m_dwPerformerID: 0,
    m_setUID: new Set<UidType>(),
  };
}

export function putKPerformerInfo(ks: KSerializer, obj: KPerformerInfo): boolean {
  return (
    ks.putUInt32(obj.m_dwPerformerID) &&
    ks.putSet(obj.m_setUID, (s, uid) => s.putInt64(uid))
  );
}

export function getKPerformerInfo(ks: KSerializer): KPerformerInfo {
  const m_dwPerformerID = ks.getUInt32();
  const m_setUID = ks.getSet((s) => s.getInt64());
  return { m_dwPerformerID, m_setUID };
}

export const EventFromType = {
  EFT_NONE: 0,
  EFT_SERVER: 1,
  EFT_CLIENT: 2,
} as const;

export type EventFromType = (typeof EventFromType)[keyof typeof EventFromType];

export interface KEvent {
  m_kDestPerformer: KPerformerInfo;
  m_anTrace: [UidType, UidType];
  m_usEventID: UInt16;
  m_kbuff: KSerBuffer;
  /** Non-serialized metadata (`#ifdef SERV_KEVENT_FROM`) */
  m_usFromType?: EventFromType;
}

export function createKEvent(): KEvent {
  return {
    m_kDestPerformer: createKPerformerInfo(),
    m_anTrace: [-1n, -1n],
    m_usEventID: 0,
    m_kbuff: new KSerBuffer(),
    m_usFromType: EventFromType.EFT_NONE,
  };
}

export function setKEventData<T, Flags = unknown>(
  event: KEvent,
  dwPerformerID: UInt32,
  anTrace: readonly [UidType, UidType] | null,
  usEventID: UInt16,
  data?: T,
  putCodec?: PutCodec<T, Flags>,
  options?: { flags?: Flags; tagging?: boolean },
): KEvent {
  event.m_kDestPerformer.m_dwPerformerID = dwPerformerID;
  event.m_usEventID = usEventID;
  if (anTrace !== null) {
    event.m_anTrace = [anTrace[0], anTrace[1]];
  } else {
    event.m_anTrace = [-1n, -1n];
  }
  event.m_kbuff.Clear();
  if (data !== undefined && putCodec !== undefined) {
    const ks = new KSerializer();
    ks.BeginWriting(event.m_kbuff, options?.tagging ?? false);
    ks.putUserClass(data, putCodec, options?.flags);
    ks.EndWriting();
  }
  return event;
}

export function decodeKEventPayload<T, Flags = unknown>(
  event: KEvent,
  getCodec: GetCodec<T, Flags>,
  options?: { flags?: Flags; tagging?: boolean; uncompress?: boolean },
): T {
  const buf = new KSerBuffer(event.m_kbuff);
  if (options?.uncompress !== false && buf.m_bCompress) {
    buf.UnCompress();
  }
  buf.Reset();
  const ks = new KSerializer();
  ks.BeginReading(buf, options?.tagging ?? false);
  const value = ks.getUserClass(getCodec, options?.flags);
  ks.EndReading();
  return value;
}

export function pushKEventTrace(event: KEvent, uid: UidType): void {
  if (event.m_anTrace[0] === -1n) {
    event.m_anTrace[0] = uid;
  } else {
    event.m_anTrace[1] = uid;
  }
}

export function popKEventTrace(event: KEvent): void {
  if (event.m_anTrace[1] !== -1n) {
    event.m_anTrace[1] = -1n;
  } else {
    event.m_anTrace[0] = -1n;
  }
}

/**
 * Matches `SERIALIZE_DEFINE_PUT( KEvent, obj, ks )` in `KncWX2Server/Common/Event.cpp`.
 */
export function putKEvent(ks: KSerializer, obj: KEvent): boolean {
  return (
    ks.putUserClass(obj.m_kDestPerformer, putKPerformerInfo) &&
    ks.putInt64(obj.m_anTrace[0]) &&
    ks.putInt64(obj.m_anTrace[1]) &&
    ks.putUInt16(obj.m_usEventID) &&
    ks.putBuffer(obj.m_kbuff)
  );
}

/**
 * Matches `SERIALIZE_DEFINE_GET( KEvent, obj, ks )` in `KncWX2Server/Common/Event.cpp`.
 */
export function getKEvent(ks: KSerializer): KEvent {
  const m_kDestPerformer = ks.getUserClass(getKPerformerInfo);
  const trace0 = ks.getInt64();
  const trace1 = ks.getInt64();
  const m_usEventID = ks.getUInt16();
  const m_kbuff = ks.getBuffer();
  return {
    m_kDestPerformer,
    m_anTrace: [trace0, trace1],
    m_usEventID,
    m_kbuff,
    m_usFromType: EventFromType.EFT_NONE,
  };
}
