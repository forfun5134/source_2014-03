import { deflateSync, inflateSync } from 'node:zlib';

/**
 * TypeScript port of KNCSDK `KSerBuffer` (`KNCSDK/Include/Serializer/SerBuffer.{h,cpp}`).
 *
 * Compression format (`Compress` / `UnCompress`):
 * - 4-byte little-endian `DWORD dwOriginSize` (x86 host byte order via `Write(&dwOriginSize, 4)`)
 * - zlib `compress2(..., Z_BEST_SPEED = 1)` stream bytes (`node:zlib` `deflateSync({ level: 1 })`)
 */
export class KSerBuffer {
  private m_buf: Uint8Array;
  private m_length: number;
  private m_readOffset: number;
  public m_bCompress: boolean;

  constructor(initial?: Uint8Array | KSerBuffer, compressed = false) {
    if (initial instanceof KSerBuffer) {
      this.m_length = initial.m_length;
      this.m_buf = new Uint8Array(Math.max(64, this.m_length));
      this.m_buf.set(initial.GetData());
      this.m_readOffset = initial.m_readOffset;
      this.m_bCompress = initial.m_bCompress;
    } else if (initial !== undefined) {
      this.m_length = initial.byteLength;
      this.m_buf = new Uint8Array(Math.max(64, this.m_length));
      this.m_buf.set(initial);
      this.m_readOffset = 0;
      this.m_bCompress = compressed;
    } else {
      this.m_buf = new Uint8Array(64);
      this.m_length = 0;
      this.m_readOffset = 0;
      this.m_bCompress = false;
    }
  }

  public Clear(): void {
    this.m_length = 0;
    this.m_readOffset = 0;
    this.m_bCompress = false;
  }

  public Reset(): void {
    this.m_readOffset = 0;
  }

  public GetLength(): number {
    return this.m_length;
  }

  public GetReadLength(): number {
    return this.m_length - this.m_readOffset;
  }

  public GetReadOffset(): number {
    return this.m_readOffset;
  }

  /** Returns a contiguous view of the valid written bytes. */
  public GetData(): Uint8Array {
    return this.m_buf.subarray(0, this.m_length);
  }

  /** Returns an independent copy of the serialized bytes. */
  public toUint8Array(): Uint8Array {
    return this.m_buf.slice(0, this.m_length);
  }

  public SetData(data: Uint8Array, compressed = false): void {
    this.ensureCapacity(data.byteLength);
    this.m_buf.set(data, 0);
    this.m_length = data.byteLength;
    this.m_readOffset = 0;
    this.m_bCompress = compressed;
  }

  private ensureCapacity(required: number): void {
    if (required <= this.m_buf.byteLength) return;
    let nextCap = Math.max(64, this.m_buf.byteLength);
    while (nextCap < required) {
      nextCap *= 2;
    }
    const nextBuf = new Uint8Array(nextCap);
    if (this.m_length > 0) {
      nextBuf.set(this.m_buf.subarray(0, this.m_length), 0);
    }
    this.m_buf = nextBuf;
  }

  public Write(data: Uint8Array): boolean {
    const len = data.byteLength;
    if (len === 0) return true;
    this.ensureCapacity(this.m_length + len);
    this.m_buf.set(data, this.m_length);
    this.m_length += len;
    return true;
  }

  public WriteByte(byte: number): void {
    this.ensureCapacity(this.m_length + 1);
    this.m_buf[this.m_length++] = byte & 0xff;
  }

  public Read(len: number): Uint8Array | null {
    if (len < 0 || len > this.GetReadLength()) {
      return null;
    }
    if (len === 0) {
      return new Uint8Array(0);
    }
    const view = this.m_buf.subarray(this.m_readOffset, this.m_readOffset + len);
    this.m_readOffset += len;
    return view;
  }

  public ReadByte(): number | null {
    if (this.m_readOffset >= this.m_length) {
      return null;
    }
    const val = this.m_buf[this.m_readOffset];
    if (val === undefined) return null;
    this.m_readOffset += 1;
    return val;
  }

  public equals(other: KSerBuffer): boolean {
    if (this.m_length !== other.m_length || this.m_bCompress !== other.m_bCompress) {
      return false;
    }
    const a = this.GetData();
    const b = other.GetData();
    for (let i = 0; i < this.m_length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  public Compress(): boolean {
    if (this.m_bCompress) return true;

    const originSize = this.m_length >>> 0;
    const raw = this.GetData();
    const compressed = deflateSync(raw, { level: 1 });

    const header = new Uint8Array(4);
    new DataView(header.buffer).setUint32(0, originSize, true); // C++ writes host little-endian DWORD

    this.Clear();
    this.Write(header);
    this.Write(compressed);
    this.m_bCompress = true;
    return true;
  }

  public UnCompress(): boolean {
    if (!this.m_bCompress) return true;

    this.m_readOffset = 0;
    const sizeBytes = this.Read(4);
    if (sizeBytes === null) return false;

    const originSize = new DataView(
      sizeBytes.buffer,
      sizeBytes.byteOffset,
      4,
    ).getUint32(0, true);

    const payload = this.m_buf.subarray(this.m_readOffset, this.m_length);
    try {
      const decompressed = inflateSync(payload);
      if (decompressed.byteLength !== originSize) {
        return false;
      }
      this.Clear();
      this.Write(decompressed);
      this.m_bCompress = false;
      return true;
    } catch {
      return false;
    }
  }
}
