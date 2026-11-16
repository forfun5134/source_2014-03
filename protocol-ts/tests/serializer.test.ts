import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  KSerBuffer,
  KSerializeError,
  KSerializer,
  SerializeTag,
} from '../src/runtime/index.ts';

describe('KSerBuffer & KSerializer (KNCSDK wire parity)', () => {
  it('encodes integers and floats in big-endian network byte order', () => {
    const buf = new KSerBuffer();
    const ks = new KSerializer();
    assert.equal(ks.BeginWriting(buf, false), true);
    ks.putInt8(-42);
    ks.putUInt8(0xfe);
    ks.putInt16(-1234);
    ks.putUInt16(0x1234);
    ks.putInt32(-0x12345678);
    ks.putUInt32(0xdeadbeef);
    ks.putInt64(-0x0123456789abcdefn);
    ks.putUInt64(0xfedcba9876543210n);
    ks.putFloat32(3.5);
    ks.putFloat64(-123.625);
    ks.putBool(true);
    ks.putBool(false);
    ks.EndWriting();

    const raw = buf.GetData();
    // 1 + 1 + 2 + 2 + 4 + 4 + 8 + 8 + 4 + 8 + 1 + 1 = 44 bytes
    assert.equal(raw.byteLength, 44);
    // Check big-endian U16 0x1234 at offset 4..5
    assert.equal(raw[4], 0x12);
    assert.equal(raw[5], 0x34);
    // Check big-endian U32 0xdeadbeef at offset 10..13
    assert.deepEqual([...raw.subarray(10, 14)], [0xde, 0xad, 0xbe, 0xef]);
    // Check big-endian float32 3.5 = 0x40600000 at offset 30..33
    assert.deepEqual([...raw.subarray(30, 34)], [0x40, 0x60, 0x00, 0x00]);
    // Check bool bytes at offset 42..43
    assert.equal(raw[42], 1);
    assert.equal(raw[43], 0);

    const ksRead = new KSerializer();
    assert.equal(ksRead.BeginReading(buf, false), true);
    assert.equal(ksRead.getInt8(), -42);
    assert.equal(ksRead.getUInt8(), 0xfe);
    assert.equal(ksRead.getInt16(), -1234);
    assert.equal(ksRead.getUInt16(), 0x1234);
    assert.equal(ksRead.getInt32(), -0x12345678);
    assert.equal(ksRead.getUInt32(), 0xdeadbeef);
    assert.equal(ksRead.getInt64(), -0x0123456789abcdefn);
    assert.equal(ksRead.getUInt64(), 0xfedcba9876543210n);
    assert.equal(ksRead.getFloat32(), 3.5);
    assert.equal(ksRead.getFloat64(), -123.625);
    assert.equal(ksRead.getBool(), true);
    assert.equal(ksRead.getBool(), false);
    assert.equal(buf.GetReadLength(), 0);
    ksRead.EndReading();
  });

  it('encodes std::string and UTF-16LE std::wstring (including Korean & non-ASCII)', () => {
    const buf = new KSerBuffer();
    const ks = new KSerializer();
    ks.BeginWriting(buf, false);
    ks.putString('elsword_auth_token');
    ks.putWString('엘소드_Test_123');
    ks.putWString('');
    ks.EndWriting();

    const raw = buf.GetData();
    // '엘소드_Test_123' has 12 UTF-16 code units -> byteLen = 24
    // After 4 + 18 = 22 bytes for std::string: BE uint32 = 24 ([0,0,0,24]), then '엘' = U+C5D8 -> LE [0xD8, 0xC5]
    assert.deepEqual([...raw.subarray(22, 26)], [0x00, 0x00, 0x00, 24]);
    assert.deepEqual([...raw.subarray(26, 28)], [0xd8, 0xc5]);

    ks.BeginReading(buf, false);
    assert.equal(ks.getString(), 'elsword_auth_token');
    assert.equal(ks.getWString(), '엘소드_Test_123');
    assert.equal(ks.getWString(), '');
    assert.equal(buf.GetReadLength(), 0);
    ks.EndReading();
  });

  it('rejects odd wstring byte lengths and truncated reads', () => {
    const bad = new KSerBuffer(new Uint8Array([0x00, 0x00, 0x00, 0x03, 0x41, 0x00, 0x42]));
    const ks = new KSerializer();
    ks.BeginReading(bad, false);
    assert.throws(() => ks.getWString(), KSerializeError);

    const shortBuf = new KSerBuffer(new Uint8Array([0x00, 0x01]));
    ks.BeginReading(shortBuf, false);
    assert.throws(() => ks.getInt32(), KSerializeError);
  });

  it('supports tagging=true with exact SerializeTag prefixes matching C++ KNCSDK', () => {
    const buf = new KSerBuffer();
    const ks = new KSerializer();
    ks.BeginWriting(buf, true);
    ks.putVector([10, 20], (s, v) => s.putInt32(v));
    ks.putMap(
      new Map<number, string>([[7, '한글']]),
      (s, k) => s.putInt32(k),
      (s, v) => s.putWString(v),
    );
    ks.putSet(new Set([99n]), (s, v) => s.putInt64(v));
    ks.putMultiMap([[1, 'a'], [1, 'b']], (s, k) => s.putInt32(k), (s, v) => s.putString(v));
    ks.EndWriting();

    const raw = buf.GetData();
    // First byte must be eTAG_VECTOR (17), then eTAG_DWORD (6), then BE count=2
    assert.equal(raw[0], SerializeTag.eTAG_VECTOR);
    assert.equal(raw[1], SerializeTag.eTAG_DWORD);
    assert.deepEqual([...raw.subarray(2, 6)], [0, 0, 0, 2]);
    // Next element: eTAG_INT (5), then BE 10
    assert.equal(raw[6], SerializeTag.eTAG_INT);
    assert.deepEqual([...raw.subarray(7, 11)], [0, 0, 0, 10]);

    // Reading with tagging=false must fail or mismatch; reading with tagging=true succeeds
    ks.BeginReading(buf, true);
    assert.deepEqual(
      ks.getVector((s) => s.getInt32()),
      [10, 20],
    );
    assert.deepEqual(
      [...ks.getMap((s) => s.getInt32(), (s) => s.getWString()).entries()],
      [[7, '한글']],
    );
    assert.deepEqual([...ks.getSet((s) => s.getInt64())], [99n]);
    assert.deepEqual(
      ks.getMultiMap((s) => s.getInt32(), (s) => s.getString()),
      [
        [1, 'a'],
        [1, 'b'],
      ],
    );
    assert.equal(buf.GetReadLength(), 0);
    ks.EndReading();

    // Tag mismatch test
    buf.Reset();
    ks.BeginReading(buf, true);
    assert.throws(() => ks.getMap((s) => s.getInt32(), (s) => s.getInt32()), KSerializeError);
  });

  it('compresses & uncompresses KSerBuffer with LE originSize + zlib stream and roundtrips inside KSerializer', () => {
    const inner = new KSerBuffer();
    const ks = new KSerializer();
    ks.BeginWriting(inner, false);
    for (let i = 0; i < 100; i++) {
      ks.putWString('Repeated payload data for compression test');
    }
    ks.EndWriting();
    const originalLen = inner.GetLength();
    assert.ok(originalLen > 8000);

    assert.equal(inner.Compress(), true);
    assert.equal(inner.m_bCompress, true);
    assert.ok(inner.GetLength() < originalLen);

    // First 4 bytes are little-endian original length
    const hdrView = new DataView(inner.GetData().buffer, inner.GetData().byteOffset, 4);
    assert.equal(hdrView.getUint32(0, true), originalLen);

    // Wrap compressed KSerBuffer inside an outer KSerializer (both untagged and tagged)
    for (const tagging of [false, true]) {
      const outer = new KSerBuffer();
      ks.BeginWriting(outer, tagging);
      ks.putBuffer(inner);
      ks.EndWriting();

      if (tagging) {
        assert.equal(outer.GetData()[0], SerializeTag.eTAG_BUFFER);
      }

      ks.BeginReading(outer, tagging);
      const decodedInner = ks.getBuffer();
      assert.equal(outer.GetReadLength(), 0);
      assert.equal(decodedInner.m_bCompress, true);
      assert.equal(decodedInner.UnCompress(), true);
      assert.equal(decodedInner.m_bCompress, false);
      assert.equal(decodedInner.GetLength(), originalLen);

      ks.BeginReading(decodedInner, false);
      for (let i = 0; i < 100; i++) {
        assert.equal(ks.getWString(), 'Repeated payload data for compression test');
      }
      assert.equal(decodedInner.GetReadLength(), 0);
    }

    // Empty KSerBuffer Compress/UnCompress & putBuffer/getBuffer parity
    const emptyBuf = new KSerBuffer();
    assert.equal(emptyBuf.Compress(), true);
    assert.equal(emptyBuf.m_bCompress, true);
    assert.equal(emptyBuf.UnCompress(), true);
    assert.equal(emptyBuf.m_bCompress, false);
    assert.equal(emptyBuf.GetLength(), 0);
  });
});
