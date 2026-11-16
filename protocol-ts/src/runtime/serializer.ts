import { KSerBuffer } from './ser-buffer.ts';
import { SerializeTag } from './tags.ts';

export class KSerializeError extends Error {
  public readonly reason: string;

  constructor(reason: string) {
    super(`KSerializer error: ${reason}`);
    this.name = 'KSerializeError';
    this.reason = reason;
  }
}

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder('utf-8');
const utf16leDecoder = new TextDecoder('utf-16le');

export type PutCodec<T, Flags = unknown> = (
  ks: KSerializer,
  obj: T,
  flags?: Flags,
) => boolean;

export type GetCodec<T, Flags = unknown> = (
  ks: KSerializer,
  flags?: Flags,
) => T;

/**
 * TypeScript port of KNCSDK `KSerializer` (`KNCSDK/Include/Serializer/Serializer.{h,cpp}`
 * and `SerSTL.h`, `SerPair.h`, `SerVector.h`, `SerList.h`, `SerDeque.h`, `SerMap.h`, `SerSet.h`).
 *
 * Wire format (`BYTEORDER_NET = BYTEORDER_BIG` on x86/Windows `KncWX2Server`):
 * - All 16/32/64-bit integers and 32/64-bit IEEE-754 floats are encoded big-endian.
 * - `std::wstring` encodes `DWORD byteLength` (`length * 2`) + raw UTF-16LE code units.
 * - `std::string` encodes `DWORD byteLength` + raw UTF-8/ANSI bytes.
 * - `bool` encodes 1 unsigned byte (`1` or `0`).
 * - Tagging defaults to `false`; when `true`, prepends 1-byte `SerializeTag`.
 */
export class KSerializer {
  private m_buffer: KSerBuffer | null = null;
  private m_tagsEnabled = false;

  // Scratch 8-byte view for numeric conversions without per-call buffer allocations
  private readonly scratch = new ArrayBuffer(8);
  private readonly scratchBytes = new Uint8Array(this.scratch);
  private readonly scratchView = new DataView(this.scratch);

  public BeginWriting(buf: KSerBuffer, tagging = false): boolean {
    this.m_buffer = buf;
    this.m_tagsEnabled = tagging;
    return true;
  }

  public EndWriting(): boolean {
    this.m_buffer = null;
    return true;
  }

  public BeginReading(buf: KSerBuffer, tagging = false): boolean {
    this.m_buffer = buf;
    this.m_tagsEnabled = tagging;
    return true;
  }

  public EndReading(): boolean {
    this.m_buffer = null;
    return true;
  }

  public IsTaggingEnabled(): boolean {
    return this.m_tagsEnabled;
  }

  public GetReadLength(): number {
    if (this.m_buffer === null) return 0;
    return this.m_buffer.GetReadLength();
  }

  private requireBuffer(): KSerBuffer {
    if (this.m_buffer === null) {
      throw new KSerializeError('No active KSerBuffer attached (call BeginWriting/BeginReading first)');
    }
    return this.m_buffer;
  }

  private writeTag(tag: SerializeTag): boolean {
    if (!this.m_tagsEnabled) return true;
    const buf = this.requireBuffer();
    buf.WriteByte(tag);
    return true;
  }

  private readAndCheckTag(expectedTag: SerializeTag): void {
    if (!this.m_tagsEnabled) return;
    const buf = this.requireBuffer();
    const got = buf.ReadByte();
    if (got === null) {
      throw new KSerializeError(`Unexpected EOF reading SerializeTag (expected ${expectedTag})`);
    }
    if (got !== expectedTag) {
      throw new KSerializeError(`SerializeTag mismatch: expected ${expectedTag}, got ${got}`);
    }
  }

  private readExact(len: number): Uint8Array {
    const buf = this.requireBuffer();
    const data = buf.Read(len);
    if (data === null) {
      throw new KSerializeError(`Unexpected EOF reading ${len} byte(s) (remaining=${buf.GetReadLength()})`);
    }
    return data;
  }

  private writeBytes(bytes: Uint8Array): boolean {
    const buf = this.requireBuffer();
    return buf.Write(bytes);
  }

  // ---- Primitives ----

  public putInt8(x: number): boolean {
    this.writeTag(SerializeTag.eTAG_CHAR);
    this.scratchView.setInt8(0, x);
    return this.writeBytes(this.scratchBytes.subarray(0, 1));
  }

  public getInt8(): number {
    this.readAndCheckTag(SerializeTag.eTAG_CHAR);
    const bytes = this.readExact(1);
    return new DataView(bytes.buffer, bytes.byteOffset, 1).getInt8(0);
  }

  public putWChar(x: number): boolean {
    this.writeTag(SerializeTag.eTAG_WCHAR);
    // C++ Serializer.cpp: Put(wchar_t) writes unswapped Win32 UTF-16LE uint16
    this.scratchView.setUint16(0, x, true);
    return this.writeBytes(this.scratchBytes.subarray(0, 2));
  }

  public getWChar(): number {
    this.readAndCheckTag(SerializeTag.eTAG_WCHAR);
    const bytes = this.readExact(2);
    return new DataView(bytes.buffer, bytes.byteOffset, 2).getUint16(0, true);
  }

  public putUInt8(x: number): boolean {
    this.writeTag(SerializeTag.eTAG_UCHAR);
    this.scratchView.setUint8(0, x);
    return this.writeBytes(this.scratchBytes.subarray(0, 1));
  }

  public getUInt8(): number {
    this.readAndCheckTag(SerializeTag.eTAG_UCHAR);
    const bytes = this.readExact(1);
    return bytes[0] ?? 0;
  }

  public putInt16(x: number): boolean {
    this.writeTag(SerializeTag.eTAG_SHORT);
    this.scratchView.setInt16(0, x, false);
    return this.writeBytes(this.scratchBytes.subarray(0, 2));
  }

  public getInt16(): number {
    this.readAndCheckTag(SerializeTag.eTAG_SHORT);
    const bytes = this.readExact(2);
    return new DataView(bytes.buffer, bytes.byteOffset, 2).getInt16(0, false);
  }

  public putUInt16(x: number): boolean {
    this.writeTag(SerializeTag.eTAG_USHORT);
    this.scratchView.setUint16(0, x, false);
    return this.writeBytes(this.scratchBytes.subarray(0, 2));
  }

  public getUInt16(): number {
    this.readAndCheckTag(SerializeTag.eTAG_USHORT);
    const bytes = this.readExact(2);
    return new DataView(bytes.buffer, bytes.byteOffset, 2).getUint16(0, false);
  }

  public putInt32(x: number): boolean {
    this.writeTag(SerializeTag.eTAG_INT);
    this.scratchView.setInt32(0, x, false);
    return this.writeBytes(this.scratchBytes.subarray(0, 4));
  }

  public getInt32(): number {
    this.readAndCheckTag(SerializeTag.eTAG_INT);
    const bytes = this.readExact(4);
    return new DataView(bytes.buffer, bytes.byteOffset, 4).getInt32(0, false);
  }

  public putUInt32(x: number): boolean {
    this.writeTag(SerializeTag.eTAG_DWORD);
    this.scratchView.setUint32(0, x, false);
    return this.writeBytes(this.scratchBytes.subarray(0, 4));
  }

  public getUInt32(): number {
    this.readAndCheckTag(SerializeTag.eTAG_DWORD);
    const bytes = this.readExact(4);
    return new DataView(bytes.buffer, bytes.byteOffset, 4).getUint32(0, false);
  }

  public putInt64(x: bigint): boolean {
    this.writeTag(SerializeTag.eTAG_INT64);
    this.scratchView.setBigInt64(0, BigInt.asIntN(64, x), false);
    return this.writeBytes(this.scratchBytes.subarray(0, 8));
  }

  public getInt64(): bigint {
    this.readAndCheckTag(SerializeTag.eTAG_INT64);
    const bytes = this.readExact(8);
    return new DataView(bytes.buffer, bytes.byteOffset, 8).getBigInt64(0, false);
  }

  public putUInt64(x: bigint): boolean {
    this.writeTag(SerializeTag.eTAG_UINT64);
    this.scratchView.setBigUint64(0, BigInt.asUintN(64, x), false);
    return this.writeBytes(this.scratchBytes.subarray(0, 8));
  }

  public getUInt64(): bigint {
    this.readAndCheckTag(SerializeTag.eTAG_UINT64);
    const bytes = this.readExact(8);
    return new DataView(bytes.buffer, bytes.byteOffset, 8).getBigUint64(0, false);
  }

  public putFloat32(x: number): boolean {
    this.writeTag(SerializeTag.eTAG_FLOAT);
    this.scratchView.setFloat32(0, x, false);
    return this.writeBytes(this.scratchBytes.subarray(0, 4));
  }

  public getFloat32(): number {
    this.readAndCheckTag(SerializeTag.eTAG_FLOAT);
    const bytes = this.readExact(4);
    return new DataView(bytes.buffer, bytes.byteOffset, 4).getFloat32(0, false);
  }

  public putFloat64(x: number): boolean {
    this.writeTag(SerializeTag.eTAG_DOUBLE);
    this.scratchView.setFloat64(0, x, false);
    return this.writeBytes(this.scratchBytes.subarray(0, 8));
  }

  public getFloat64(): number {
    this.readAndCheckTag(SerializeTag.eTAG_DOUBLE);
    const bytes = this.readExact(8);
    return new DataView(bytes.buffer, bytes.byteOffset, 8).getFloat64(0, false);
  }

  public putBool(x: boolean): boolean {
    this.writeTag(SerializeTag.eTAG_BOOL);
    this.scratchBytes[0] = x ? 1 : 0;
    return this.writeBytes(this.scratchBytes.subarray(0, 1));
  }

  public getBool(): boolean {
    this.readAndCheckTag(SerializeTag.eTAG_BOOL);
    const bytes = this.readExact(1);
    return bytes[0] === 1;
  }

  // ---- Strings ----

  public putString(x: string): boolean {
    this.writeTag(SerializeTag.eTAG_STRING);
    const encoded = utf8Encoder.encode(x);
    this.putUInt32(encoded.byteLength);
    if (encoded.byteLength === 0) return true;
    return this.writeBytes(encoded);
  }

  public getString(): string {
    this.readAndCheckTag(SerializeTag.eTAG_STRING);
    const size = this.getUInt32();
    if (size === 0) return '';
    if (size > this.GetReadLength()) {
      throw new KSerializeError(`std::string length ${size} exceeds remaining bytes ${this.GetReadLength()}`);
    }
    const bytes = this.readExact(size);
    return utf8Decoder.decode(bytes);
  }

  public putWString(x: string): boolean {
    this.writeTag(SerializeTag.eTAG_WSTRING);
    const byteLen = x.length * 2;
    this.putUInt32(byteLen);
    if (byteLen === 0) return true;
    const out = new Uint8Array(byteLen);
    for (let i = 0; i < x.length; i++) {
      const code = x.charCodeAt(i);
      out[i * 2] = code & 0xff;
      out[i * 2 + 1] = (code >>> 8) & 0xff;
    }
    return this.writeBytes(out);
  }

  public getWString(): string {
    this.readAndCheckTag(SerializeTag.eTAG_WSTRING);
    const size = this.getUInt32();
    if (size % 2 !== 0) {
      throw new KSerializeError(`std::wstring byte length ${size} is odd`);
    }
    if (size === 0) return '';
    if (size > this.GetReadLength()) {
      throw new KSerializeError(`std::wstring byte length ${size} exceeds remaining bytes ${this.GetReadLength()}`);
    }
    const bytes = this.readExact(size);
    return utf16leDecoder.decode(bytes);
  }

  // ---- Raw & KSerBuffer ----

  public putRaw(bytes: Uint8Array): boolean {
    this.writeTag(SerializeTag.eTAG_RAWBYTES);
    if (bytes.byteLength === 0) return true;
    return this.writeBytes(bytes);
  }

  public getRaw(len: number): Uint8Array {
    this.readAndCheckTag(SerializeTag.eTAG_RAWBYTES);
    if (len === 0) return new Uint8Array(0);
    return this.readExact(len).slice();
  }

  public putBuffer(buf: KSerBuffer): boolean {
    this.writeTag(SerializeTag.eTAG_BUFFER);
    const len = buf.GetLength();
    this.putUInt32(len);
    if (len === 0) return true;
    return this.putBool(buf.m_bCompress) && this.putRaw(buf.GetData());
  }

  public getBuffer(): KSerBuffer {
    this.readAndCheckTag(SerializeTag.eTAG_BUFFER);
    const len = this.getUInt32();
    const out = new KSerBuffer();
    if (len === 0) return out;
    if (len > this.GetReadLength()) {
      throw new KSerializeError(`KSerBuffer length ${len} exceeds remaining bytes ${this.GetReadLength()}`);
    }
    const compressed = this.getBool();
    const raw = this.getRaw(len);
    out.SetData(raw, compressed);
    return out;
  }

  // ---- Arrays & STL Containers ----

  public putArray<T>(items: readonly T[], putItem: (ks: KSerializer, item: T) => boolean): boolean {
    this.writeTag(SerializeTag.eTAG_ARRAY);
    this.putUInt32(items.length);
    for (let i = 0; i < items.length; i++) {
      if (!putItem(this, items[i]!)) return false;
    }
    return true;
  }

  public getArray<T>(getItem: (ks: KSerializer) => T, maxItems?: number): T[] {
    this.readAndCheckTag(SerializeTag.eTAG_ARRAY);
    const count = this.getUInt32();
    if (maxItems !== undefined && count > maxItems) {
      throw new KSerializeError(`Array count ${count} exceeds maximum ${maxItems}`);
    }
    const out: T[] = new Array(count);
    for (let i = 0; i < count; i++) {
      out[i] = getItem(this);
    }
    return out;
  }

  public putPair<A, B>(
    pair: readonly [A, B],
    putFirst: (ks: KSerializer, a: A) => boolean,
    putSecond: (ks: KSerializer, b: B) => boolean,
  ): boolean {
    this.writeTag(SerializeTag.eTAG_PAIR);
    return putFirst(this, pair[0]) && putSecond(this, pair[1]);
  }

  public getPair<A, B>(
    getFirst: (ks: KSerializer) => A,
    getSecond: (ks: KSerializer) => B,
  ): [A, B] {
    this.readAndCheckTag(SerializeTag.eTAG_PAIR);
    const first = getFirst(this);
    const second = getSecond(this);
    return [first, second];
  }

  private putSequence<T>(
    tag: SerializeTag,
    items: readonly T[],
    putItem: (ks: KSerializer, item: T) => boolean,
  ): boolean {
    this.writeTag(tag);
    this.putUInt32(items.length);
    for (let i = 0; i < items.length; i++) {
      if (!putItem(this, items[i]!)) return false;
    }
    return true;
  }

  private getSequence<T>(
    tag: SerializeTag,
    getItem: (ks: KSerializer) => T,
  ): T[] {
    this.readAndCheckTag(tag);
    const count = this.getUInt32();
    const out: T[] = new Array(count);
    for (let i = 0; i < count; i++) {
      out[i] = getItem(this);
    }
    return out;
  }

  public putVector<T>(items: readonly T[], putItem: (ks: KSerializer, item: T) => boolean): boolean {
    return this.putSequence(SerializeTag.eTAG_VECTOR, items, putItem);
  }

  public getVector<T>(getItem: (ks: KSerializer) => T): T[] {
    return this.getSequence(SerializeTag.eTAG_VECTOR, getItem);
  }

  public putList<T>(items: readonly T[], putItem: (ks: KSerializer, item: T) => boolean): boolean {
    return this.putSequence(SerializeTag.eTAG_LIST, items, putItem);
  }

  public getList<T>(getItem: (ks: KSerializer) => T): T[] {
    return this.getSequence(SerializeTag.eTAG_LIST, getItem);
  }

  public putDeque<T>(items: readonly T[], putItem: (ks: KSerializer, item: T) => boolean): boolean {
    return this.putSequence(SerializeTag.eTAG_DEQUE, items, putItem);
  }

  public getDeque<T>(getItem: (ks: KSerializer) => T): T[] {
    return this.getSequence(SerializeTag.eTAG_DEQUE, getItem);
  }

  public putSet<T>(items: ReadonlySet<T>, putItem: (ks: KSerializer, item: T) => boolean): boolean {
    this.writeTag(SerializeTag.eTAG_SET);
    this.putUInt32(items.size);
    for (const item of items) {
      if (!putItem(this, item)) return false;
    }
    return true;
  }

  public getSet<T>(getItem: (ks: KSerializer) => T): Set<T> {
    this.readAndCheckTag(SerializeTag.eTAG_SET);
    const count = this.getUInt32();
    const out = new Set<T>();
    for (let i = 0; i < count; i++) {
      out.add(getItem(this));
    }
    return out;
  }

  public putMultiSet<T>(items: readonly T[], putItem: (ks: KSerializer, item: T) => boolean): boolean {
    return this.putSequence(SerializeTag.eTAG_MULTISET, items, putItem);
  }

  public getMultiSet<T>(getItem: (ks: KSerializer) => T): T[] {
    return this.getSequence(SerializeTag.eTAG_MULTISET, getItem);
  }

  public putMap<K, V>(
    entries: ReadonlyMap<K, V>,
    putKey: (ks: KSerializer, k: K) => boolean,
    putVal: (ks: KSerializer, v: V) => boolean,
  ): boolean {
    this.writeTag(SerializeTag.eTAG_MAP);
    this.putUInt32(entries.size);
    for (const [k, v] of entries) {
      this.writeTag(SerializeTag.eTAG_PAIR);
      if (!putKey(this, k) || !putVal(this, v)) return false;
    }
    return true;
  }

  public getMap<K, V>(
    getKey: (ks: KSerializer) => K,
    getVal: (ks: KSerializer) => V,
  ): Map<K, V> {
    this.readAndCheckTag(SerializeTag.eTAG_MAP);
    const count = this.getUInt32();
    const out = new Map<K, V>();
    for (let i = 0; i < count; i++) {
      this.readAndCheckTag(SerializeTag.eTAG_PAIR);
      const k = getKey(this);
      const v = getVal(this);
      out.set(k, v);
    }
    return out;
  }

  public putMultiMap<K, V>(
    entries: ReadonlyArray<readonly [K, V]>,
    putKey: (ks: KSerializer, k: K) => boolean,
    putVal: (ks: KSerializer, v: V) => boolean,
  ): boolean {
    this.writeTag(SerializeTag.eTAG_MULTIMAP);
    this.putUInt32(entries.length);
    for (let i = 0; i < entries.length; i++) {
      const [k, v] = entries[i]!;
      this.writeTag(SerializeTag.eTAG_PAIR);
      if (!putKey(this, k) || !putVal(this, v)) return false;
    }
    return true;
  }

  public getMultiMap<K, V>(
    getKey: (ks: KSerializer) => K,
    getVal: (ks: KSerializer) => V,
  ): Array<[K, V]> {
    this.readAndCheckTag(SerializeTag.eTAG_MULTIMAP);
    const count = this.getUInt32();
    const out: Array<[K, V]> = new Array(count);
    for (let i = 0; i < count; i++) {
      this.readAndCheckTag(SerializeTag.eTAG_PAIR);
      const k = getKey(this);
      const v = getVal(this);
      out[i] = [k, v];
    }
    return out;
  }

  // ---- User-Defined Struct Dispatch (matches C++ ComputeTag eTAG_USERCLASS) ----

  public putUserClass<T, Flags = unknown>(
    obj: T,
    putInto: PutCodec<T, Flags>,
    flags?: Flags,
  ): boolean {
    this.writeTag(SerializeTag.eTAG_USERCLASS);
    return putInto(this, obj, flags);
  }

  public getUserClass<T, Flags = unknown>(
    getFrom: GetCodec<T, Flags>,
    flags?: Flags,
  ): T {
    this.readAndCheckTag(SerializeTag.eTAG_USERCLASS);
    return getFrom(this, flags);
  }
}

/**
 * Convenience helper: encodes an object using a `PutCodec` (wrapped in `eTAG_USERCLASS` if `tagging = true`)
 * into a fresh `Uint8Array`.
 */
export function encodeWithCodec<T, Flags = unknown>(
  value: T,
  putCodec: PutCodec<T, Flags>,
  options?: { flags?: Flags; tagging?: boolean; userClassTag?: boolean },
): Uint8Array {
  const buf = new KSerBuffer();
  const ks = new KSerializer();
  const tagging = options?.tagging ?? false;
  const wrapUserClass = options?.userClassTag ?? true;
  ks.BeginWriting(buf, tagging);
  if (wrapUserClass) {
    ks.putUserClass(value, putCodec, options?.flags);
  } else {
    putCodec(ks, value, options?.flags);
  }
  ks.EndWriting();
  return buf.toUint8Array();
}

/**
 * Convenience helper: decodes bytes using a `GetCodec` (expecting `eTAG_USERCLASS` if `tagging = true`).
 */
export function decodeWithCodec<T, Flags = unknown>(
  bytes: Uint8Array,
  getCodec: GetCodec<T, Flags>,
  options?: { flags?: Flags; tagging?: boolean; userClassTag?: boolean; requireExactConsume?: boolean },
): T {
  const buf = new KSerBuffer(bytes);
  const ks = new KSerializer();
  const tagging = options?.tagging ?? false;
  const wrapUserClass = options?.userClassTag ?? true;
  ks.BeginReading(buf, tagging);
  const value = wrapUserClass
    ? ks.getUserClass(getCodec, options?.flags)
    : getCodec(ks, options?.flags);
  if (options?.requireExactConsume && buf.GetReadLength() !== 0) {
    throw new KSerializeError(`Trailing unread bytes: ${buf.GetReadLength()} byte(s) remaining`);
  }
  ks.EndReading();
  return value;
}
