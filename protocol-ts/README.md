# `@elsword-protocol/protocol-ts`

Strict **TypeScript 7.1 Beta** (native compiler, ESM, `erasableSyntaxOnly`) migration of the Elsword C++ network protocol layer:

- **`KSerializer` & `KSerBuffer`** (`KNCSDK/Include_2010/Serializer/*`) — binary wire-compatible codec with big-endian primitives, UTF-16LE `std::wstring`, UTF-8 `std::string`, STL container codecs, optional `SerializeTag` (`0..27`) mode, and zlib level-1 payload compression (`Compress` / `UnCompress`).
- **`KEvent`, `KPerformerInfo`, `KncUid`** (`KncWX2Server/Common/Event.{h,cpp}`, `KncUidType.{h,cpp}`) — envelope codec, trace stack helpers, and 64-bit UID bit-packing (`EXTEND_SERVER_GROUP_MASK` for `CN`/`US`).
- **992 `ServerDefine` feature flags & 14 regional presets** (`DEFAULT`, `KR`, `TW`, `HK`, `TWHK`, `JP`, `EU`, `US`, `CN`, `TH`, `ID`, `BR`, `PH`, `IN`) evaluated cleanly at runtime without recompiling.
- **1,325 `EventID` definitions** (`21` system events `0..20` + `1,304` client events `21..1324`, including `151` from `EventID_Client_Global.h`), exact index-for-index aligned with `KEvent::ms_szEventID`.
- **1,218 packet/data structs & 237 typedefs** across `CommonPacket`, `CommonPacket_Global`, `ClientPacket`, and `ClientPacket_Global`, plus `PACKET_CODECS` and `EVENT_TO_PACKET_NAME` registries.

## Requirements

- **Node.js** `>= 22.6.0` (verified on `v22.22.3` with `--experimental-strip-types`)
- **TypeScript** `7.1.0-beta` (installed via `devDependencies`)
- **Python 3** (only needed if re-running `npm run generate` against the C++ headers)

## Commands

```bash
cd protocol-ts
npm install
npm run typecheck   # tsc -p tsconfig.test.json (strict check across src + tests)
npm run build       # tsc -p tsconfig.json (emits dist/ ESM JS + .d.ts + sourcemaps)
npm test            # runs node --experimental-strip-types --test tests/*.test.ts
npm run generate    # regenerates src/{flags,events,packets,index}.ts from C++ sources
```

## Quick Start

### Encode & Decode a Packet

```ts
import {
  encodePacket,
  decodePacket,
  createKUnitInfo,
  createFlags,
} from '@elsword-protocol/protocol-ts';

const unit = createKUnitInfo('TW');
unit.m_nUnitUID = 9876543210123n;
unit.m_wstrNickName = '엘시스';
unit.m_ucLevel = 70;

const wire = encodePacket('KUnitInfo', unit, { flags: 'TW' });
const decoded = decodePacket<typeof unit>('KUnitInfo', wire, { flags: 'TW' });

// Override any individual ServerDefine flag at runtime:
const customFlags = createFlags('JP', {
  SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER: true,
});
```

### Build & Serialize a Compressed `KEvent` Envelope

```ts
import {
  EventID,
  buildEvent,
  decodeEvent,
  serializeKEvent,
  deserializeKEvent,
  PACKET_CODECS,
  type KEGS_VERIFY_ACCOUNT_REQ,
} from '@elsword-protocol/protocol-ts';

const req = PACKET_CODECS['KEGS_VERIFY_ACCOUNT_REQ']!.create('JP') as KEGS_VERIFY_ACCOUNT_REQ;
req.m_wstrUserID = 'pilot_jp';
req.m_wstrPasswd = 'secret';

const ev = buildEvent(EventID.EGS_VERIFY_ACCOUNT_REQ, req, {
  dwPerformerID: 1,
  flags: 'JP',
  compress: true,
});

const frameBytes = serializeKEvent(ev);
const parsedEnvelope = deserializeKEvent(frameBytes);
const parsedPayload = decodeEvent<KEGS_VERIFY_ACCOUNT_REQ>(parsedEnvelope, { flags: 'JP' });
```

### Direct `KSerializer` & `KSerBuffer`

```ts
import { KSerBuffer, KSerializer } from '@elsword-protocol/protocol-ts/runtime';

const buf = new KSerBuffer();
const ks = new KSerializer();
ks.BeginWriting(buf, false);
ks.putUInt32(0x12345678);
ks.putWString('테스트');
ks.EndWriting();

buf.Compress();   // prepends 4-byte LE uncompressed length + zlib level-1 payload
buf.UnCompress(); // inflates and validates uncompressed byte length
```

## Module Layout

```text
protocol-ts/
├── package.json
├── tsconfig.json
├── tsconfig.test.json
├── scripts/
│   └── generate.py                 # C++ -> TypeScript generator (ServerDefine, EventID, Packets)
├── src/
│   ├── index.ts                    # Top-level barrel export
│   ├── runtime/
│   │   ├── tags.ts                 # SerializeTag (0..27) as const
│   │   ├── types.ts                # Int8..UInt64, Float32/64, UidType, CTimeValue, SERVER_SN
│   │   ├── ser-buffer.ts           # KSerBuffer + zlib Compress/UnCompress
│   │   ├── serializer.ts           # KSerializer binary reader/writer (tagged & untagged)
│   │   ├── uid.ts                  # KncUid bitfield helpers (standard & CN/US extended masks)
│   │   ├── event.ts                # KPerformerInfo & KEvent envelope codec
│   │   └── index.ts
│   ├── flags/
│   │   ├── server-flags.ts         # 992 ServerDefine flag defaults & type
│   │   ├── presets.ts              # 14 country/build presets + createFlags/resolveFlags
│   │   └── index.ts
│   ├── events/
│   │   ├── event-id-system.ts      # EventID_System (0..20)
│   │   ├── event-id-client.ts      # EventID_Client (21..1172 + Global tail 1324)
│   │   ├── event-id-client-global.ts # EventID_Client_Global (1173..1323)
│   │   └── index.ts                # Unified EventID map & name/value helpers
│   └── packets/
│       ├── common-packet.ts        # KncWX2Server/Common/CommonPacket.{h,cpp}
│       ├── common-packet-global.ts # KncWX2Server/Common/OnlyGlobal/CommonPacket_Global.{h,cpp}
│       ├── client-packet.ts        # KncWX2Server/Common/ClientPacket.{h,cpp}
│       ├── client-packet-global.ts # KncWX2Server/Common/OnlyGlobal/ClientPacket_Global.{h,cpp}
│       ├── registry.ts             # PACKET_CODECS, EVENT_TO_PACKET_NAME, buildEvent/decodeEvent
│       └── index.ts
└── tests/
    ├── serializer.test.ts
    ├── flags.test.ts
    ├── events.test.ts
    └── packets.test.ts
```

## C++ to TypeScript Porting Notes

1. **Wire Format Parity (`KNCSDK`)**:
   - Multi-byte integers (`Int16`..`UInt64`, `DWORD`/`UINT`) and IEEE-754 floats (`Float32`, `Float64`) are serialized in **big-endian** network byte order (`DataView`), matching `ByteOrder.h` (`BYTEORDER_NET = BIG`).
   - `std::string` uses a 4-byte BE length + UTF-8 bytes; `std::wstring` uses a 4-byte BE **byte length** + UTF-16LE code units (even byte length enforced).
   - `KSerBuffer.Compress()` writes a 4-byte **little-endian** host `DWORD` original size followed by `zlib` `deflateSync({ level: 1 })` bytes, matching Win32 `compress2(..., 1)`.
   - `KSerializer` defaults to `tagging = false` (matching C++ `BeginWriting`/`BeginReading`) and supports `tagging = true` emitting `SerializeTag` bytes (`eTAG_USERCLASS` = `27`, `eTAG_BUFFER` = `25`, STL `eTAG_PAIR`, etc.).

2. **64-bit Integers & Time**:
   - `UidType` (`__int64`), `INT64`, `UINT64`, and `__time64_t` (`CTimeValue`) map to TypeScript `bigint` (`0n`).
   - `CTime` fields present on `EVENT_DATA` (`m_tCriterionDateBegin`, `m_tCriterionDateEnd`) are intentionally **not serialized on the wire**, matching `SERIALIZE_DEFINE_PUT(EVENT_DATA)` in C++.

3. **Runtime `#ifdef` Evaluation & Region Presets**:
   - `PRESET_DEFAULT` mirrors `ServerDefine.h` + `ServerDefine_Global.h` (`SERV_GLOBAL_COMMON` enabled). `PRESET_KR` represents the pre-Global baseline without `ServerDefine_Global.h`.
   - `PRESET_TW` and `PRESET_HK` reflect the country blocks inside `ServerDefine_TWHK.h`.
   - `SERV_COUNTRY_JP` in `ServerDefine.h:4575` sits inside `#ifdef SERV_INT_INTERNAL` (inactive in `DEFAULT`), while `PRESET_JP` explicitly enables `SERV_COUNTRY_JP` and `ServerDefine_JP.h`.
   - `getUidMaskOptions(flags)` automatically enables the 10-bit extended server group / 36-bit pure UID mask for `SERV_COUNTRY_CN || SERV_COUNTRY_US`.

4. **Structural Edge Cases Handled by `scripts/generate.py`**:
   - **`erasableSyntaxOnly`**: Every C++ `enum` becomes an `as const` object + companion union type (dynamic `get<Struct>_<Enum>(flags)` getters are also emitted when enum values depend on `#ifdef` flags).
   - **`#ifdef` Struct/Typedef Collisions**:
     - `KEGS_BREAK_TRADE_REQ`, `KEGS_BREAK_TRADE_NOT`, `KEGS_STATE_CHANGE_FIELD_ACK`, `KEGS_FIELD_LOADING_COMPLETE_ACK`, and `KEGS_UDP_KICK_STATE_CHANGE_FIELD_NOT` unify `struct` vs `KPacketOK`/`KPacketReason` variants into single runtime-branched types & codecs.
     - `KEGS_GET_SHARE_BANK_REQ` emits `KEGS_GET_SHARE_BANK_REQ_Struct | string` with conditional `eTAG_USERCLASS` handling in `PACKET_CODECS` (`isUserClassFor`).
   - **Cross-File Merges & Duplicates**: `KRewardData`, `EVENT_DATA`, `KEGS_GET_ITEM_FROM_LETTER_ACK`, plus intra-file `#ifdef`/`#else` duplicate definitions (`KPartyUserInfo`, `KEGS_SELECT_UNIT_ACK`, `KEGS_SOCKET_ITEM_REQ`, `KEGS_SOCKET_ITEM_ACK`, `KPostItemInfo`, etc.) are merged cleanly.
   - **`Put`/`Get` Asymmetries Preserved/Fixed**: Known C++ mismatches (`KPartyUserInfo.m_wstrInternalIP/m_usInternalPort` in `CommonPacket.cpp`, `KEGS_EXPIRE_CASH_SKILL_POINT_NOT` `#ifdef SERV_UPGRADE_SKILL_SYSTEM_2013` order in `ClientPacket.cpp`, `KNexonAccountInfo.m_uRegisteredPC`, and `KEGS_ADMIN_GAME_ETC_NOT.m_fLogFPS`) are resolved consistently across `Put` and `Get`.
   - **Unreferenced External Guild Types**: `KGuildFindAdInfo` and `KGuildInviteMsgInfo` (not defined anywhere in the C++ source tree) are emitted as placeholder interfaces so dependent guild packets stay type-safe.
