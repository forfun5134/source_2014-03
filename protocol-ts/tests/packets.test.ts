import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  EVENT_TO_PACKET_NAME,
  EventID,
  KSerBuffer,
  PACKET_CODECS,
  SERVER_REGION_PRESETS,
  buildEvent,
  createFlags,
  createKEGS_SELECT_UNIT_ACK,
  createKGlobalCashInfo,
  createKPartyUserInfo,
  createKUnitInfo,
  decodeEvent,
  decodePacket,
  deserializeKEvent,
  encodePacket,
  getKDangerousEventInfo_DANGEROUS_EVENT,
  KGlobalCashInfo_GLOBAL_CASH_TYPE,
  serializeKEvent,
  type EVENT_DATA,
  type KEGS_GET_ITEM_FROM_LETTER_ACK,
  type KEGS_GET_SHARE_BANK_REQ,
  type KEGS_SOCKET_ITEM_ACK,
  type KEGS_SOCKET_ITEM_REQ,
  type KEGS_VERIFY_ACCOUNT_REQ,
  type KPartyUserInfo,
  type KStatisticsData,
  type ServerRegionPreset,
} from '../src/index.ts';

describe('Migrated packets & codecs round-trip verification', () => {
  it('round-trips EVERY registered packet codec across key region presets (tagged and untagged)', () => {
    const codecNames = Object.keys(PACKET_CODECS);
    assert.ok(codecNames.length > 1400, `Expected > 1400 codecs, got ${codecNames.length}`);

    const presetsToTest: ServerRegionPreset[] = [
      'DEFAULT',
      'KR',
      'TW',
      'HK',
      'JP',
      'EU',
      'US',
      'CN',
      'TH',
      'ID',
      'BR',
      'PH',
      'IN',
    ];

    for (const preset of presetsToTest) {
      const flags = SERVER_REGION_PRESETS[preset];
      for (const tagging of [false, true]) {
        for (const name of codecNames) {
          const entry = PACKET_CODECS[name]!;
          const sample = entry.create(flags);
          const wire = encodePacket(name, sample, { flags, tagging });
          const decoded = decodePacket(name, wire, { flags, tagging });
          assert.deepStrictEqual(
            decoded,
            sample,
            `Round-trip mismatch for ${name} under preset=${preset}, tagging=${tagging}`,
          );
        }
      }
    }
  });

  it('preserves rich populated data in CommonPacket & CommonPacket_Global structs', () => {
    // 2. Rich populated KUnitInfo, KGlobalCashInfo, KStatisticsData
    const twSpiritFlags = createFlags('TW', { SERV_CHINA_SPIRIT_EVENT: true });
    const unit = createKUnitInfo(twSpiritFlags);
    unit.m_nUnitUID = 9876543210123n;
    unit.m_wstrNickName = '엘시스검사';
    unit.m_ucLevel = 70;
    unit.m_kStat.m_iBaseHP = 250000;
    unit.m_arrChinaSpirit = [10, 20, 30, 40, 50, 60];

    const wireUnit = encodePacket('KUnitInfo', unit, { flags: twSpiritFlags, tagging: true });
    const decodedUnit = decodePacket<typeof unit>('KUnitInfo', wireUnit, { flags: twSpiritFlags, tagging: true });
    assert.deepStrictEqual(decodedUnit, unit);

    // KGlobalCashInfo with nested enum + fixed array[GCT_TOTAL_NUM = 4]
    const cash = createKGlobalCashInfo('TW');
    assert.ok(cash.m_ulCash !== undefined);
    cash.m_ulCash[KGlobalCashInfo_GLOBAL_CASH_TYPE.GCT_PUBLISHER_CASH] = 1500;
    cash.m_ulCash[KGlobalCashInfo_GLOBAL_CASH_TYPE.GCT_KOG_ELSWORD_CASH] = 250;
    const wireCash = encodePacket('KGlobalCashInfo', cash, { flags: 'TW' });
    assert.deepStrictEqual(decodePacket('KGlobalCashInfo', wireCash, { flags: 'TW' }), cash);

    // KStatisticsData (nested Map with KStatisticsKey object keys)
    const stats: KStatisticsData = new Map();
    stats.set({ m_vecIntKey: [1, 2, 3], m_vecStringKey: ['dungeon', 'normal'] }, [100n, 200n]);
    const statsWire = encodePacket('KStatisticsData', stats, { tagging: true });
    const statsDecoded = decodePacket<KStatisticsData>('KStatisticsData', statsWire, { tagging: true });
    assert.deepStrictEqual([...statsDecoded.entries()], [...stats.entries()]);
  });

  it('handles #ifdef/#else duplicate struct variants and cross-file merged packets cleanly', () => {
    // 1. KPartyUserInfo: SERV_CHANNEL_PARTY true vs false
    const pChannel = createKPartyUserInfo('DEFAULT');
    pChannel.m_iGSUID = 11n;
    pChannel.m_wstrIP = '10.0.0.1';
    pChannel.m_usPort = 9300;
    pChannel.m_wstrInternalIP = '192.168.1.5';
    pChannel.m_usInternalPort = 9301;
    const pChWire = encodePacket('KPartyUserInfo', pChannel, { flags: 'DEFAULT' });
    assert.deepStrictEqual(decodePacket<KPartyUserInfo>('KPartyUserInfo', pChWire, { flags: 'DEFAULT' }), pChannel);

    const legacyPartyFlags = createFlags('DEFAULT', { SERV_CHANNEL_PARTY: false });
    const pLegacy = createKPartyUserInfo(legacyPartyFlags);
    pLegacy.m_iUnitUID = 55n;
    pLegacy.m_wstrNickName = 'LegacyMember';
    const pLegWire = encodePacket('KPartyUserInfo', pLegacy, { flags: legacyPartyFlags });
    assert.deepStrictEqual(decodePacket('KPartyUserInfo', pLegWire, { flags: legacyPartyFlags }), pLegacy);

    // 2. KEGS_SELECT_UNIT_ACK: SERV_SELECT_UNIT_PACKET_DIVISION true vs false
    const divAck = createKEGS_SELECT_UNIT_ACK('DEFAULT');
    divAck.m_iOK = 0;
    const divWire = encodePacket('KEGS_SELECT_UNIT_ACK', divAck, { flags: 'DEFAULT' });
    assert.equal(divWire.byteLength, 4);
    assert.deepStrictEqual(decodePacket('KEGS_SELECT_UNIT_ACK', divWire, { flags: 'DEFAULT' }), divAck);

    const nonDivFlags = createFlags('DEFAULT', { SERV_SELECT_UNIT_PACKET_DIVISION: false });
    const fullAck = createKEGS_SELECT_UNIT_ACK(nonDivFlags);
    fullAck.m_iOK = 1;
    assert.ok(fullAck.m_kUnitInfo !== undefined);
    const fullWire = encodePacket('KEGS_SELECT_UNIT_ACK', fullAck, { flags: nonDivFlags });
    assert.ok(fullWire.byteLength > 50);
    assert.deepStrictEqual(decodePacket('KEGS_SELECT_UNIT_ACK', fullWire, { flags: nonDivFlags }), fullAck);

    // 3. KEGS_SOCKET_ITEM_REQ & ACK: SERV_SOCKET_NEW true vs false
    const sockReqNew: KEGS_SOCKET_ITEM_REQ = {
      m_iItemUID: 999n,
      m_mapSocketInfo: new Map([[0, 777n]]),
      m_bCheat: false,
    };
    const sockWireNew = encodePacket('KEGS_SOCKET_ITEM_REQ', sockReqNew, { flags: 'DEFAULT' });
    assert.deepStrictEqual(decodePacket('KEGS_SOCKET_ITEM_REQ', sockWireNew, { flags: 'DEFAULT' }), sockReqNew);

    const oldSockFlags = createFlags('DEFAULT', { SERV_SOCKET_NEW: false });
    const sockReqOld: KEGS_SOCKET_ITEM_REQ = {
      m_iItemUID: 999n,
      m_iSocketIndex: 2,
      m_bIsRareMagicStone: true,
      m_bIsRemoveSocketOption: false,
      m_bDebug: false,
      m_sDebugSocketOption: 0,
    };
    const sockWireOld = encodePacket('KEGS_SOCKET_ITEM_REQ', sockReqOld, { flags: oldSockFlags });
    assert.deepStrictEqual(decodePacket('KEGS_SOCKET_ITEM_REQ', sockWireOld, { flags: oldSockFlags }), sockReqOld);

    // 4. Hybrid KEGS_GET_SHARE_BANK_REQ (struct under SERV_NEW_UNIT_TRADE_LIMIT vs std::wstring otherwise)
    const sbFlagsStr = createFlags('TW', { SERV_NEW_UNIT_TRADE_LIMIT: false });
    const sbStr: KEGS_GET_SHARE_BANK_REQ = 'BankOwner';
    const sbStrWire = encodePacket('KEGS_GET_SHARE_BANK_REQ', sbStr, { flags: sbFlagsStr, tagging: true });
    assert.equal(decodePacket('KEGS_GET_SHARE_BANK_REQ', sbStrWire, { flags: sbFlagsStr, tagging: true }), sbStr);

    const sbFlagsStruct = createFlags('TW', { SERV_NEW_UNIT_TRADE_LIMIT: true });
    const sbObj: KEGS_GET_SHARE_BANK_REQ = {
      m_wstrNickName: 'BankOwner',
      m_iNewUnitTradeBlockDay: 3,
      m_iNewUnitTradeBlockUnitClass: 11,
    };
    const sbObjWire = encodePacket('KEGS_GET_SHARE_BANK_REQ', sbObj, { flags: sbFlagsStruct, tagging: true });
    assert.deepStrictEqual(
      decodePacket('KEGS_GET_SHARE_BANK_REQ', sbObjWire, { flags: sbFlagsStruct, tagging: true }),
      sbObj,
    );
    // Same hybrid packet inside a full compressed + tagged KEvent envelope
    const sbEvStr = buildEvent(EventID.EGS_GET_SHARE_BANK_REQ, sbStr, {
      flags: sbFlagsStr,
      tagging: true,
      compress: true,
    });
    assert.equal(
      decodeEvent<KEGS_GET_SHARE_BANK_REQ>(sbEvStr, { flags: sbFlagsStr, tagging: true }),
      sbStr,
    );
    const sbEvObj = buildEvent(EventID.EGS_GET_SHARE_BANK_REQ, sbObj, {
      flags: sbFlagsStruct,
      tagging: true,
      compress: true,
    });
    assert.deepStrictEqual(
      decodeEvent<KEGS_GET_SHARE_BANK_REQ>(sbEvObj, { flags: sbFlagsStruct, tagging: true }),
      sbObj,
    );

    // 5. Cross-file KEGS_GET_ITEM_FROM_LETTER_ACK & EVENT_DATA
    const letterFlagsTrue = createFlags('DEFAULT', { SERV_TRADE_LOGIC_CHANGE_LETTER: true });
    const letterTrue: KEGS_GET_ITEM_FROM_LETTER_ACK = {
      m_iOK: 0,
      m_iPostNo: 123n,
      m_bSystemLetter: true,
      m_mapResultItem: new Map([[100, 2]]),
      m_vecKInventorySlotInfo: [],
      m_iED: 5000,
      m_iUnitUID: 42n,
      m_kItemQuantityUpdate: decodePacket('KItemQuantityUpdate', encodePacket('KItemQuantityUpdate', {
        m_mapQuantityChange: new Map(),
        m_vecDeleted: [],
      })),
      m_vecMoveItemSlotInfo: [],
    };
    const letterWire = encodePacket('KEGS_GET_ITEM_FROM_LETTER_ACK', letterTrue, { flags: letterFlagsTrue });
    assert.deepStrictEqual(
      decodePacket('KEGS_GET_ITEM_FROM_LETTER_ACK', letterWire, { flags: letterFlagsTrue }),
      letterTrue,
    );

    const evDbFlags = createFlags('DEFAULT', { SERV_EVENT_DB_CONTROL_SYSTEM: true });
    const evData = decodePacket<EVENT_DATA>('EVENT_DATA', encodePacket('EVENT_DATA', {
      m_fEXPRate: 2.0,
      m_mapMinMaxReward: new Map([[[1, 10], 500]]),
    }, { flags: evDbFlags }), { flags: evDbFlags });
    assert.equal(evData.m_fEXPRate, 2.0);
    assert.deepStrictEqual([...(evData.m_mapMinMaxReward?.entries() ?? [])], [[[1, 10], 500]]);

    const evScriptFlags = createFlags('DEFAULT', { SERV_CHANGE_EVENT_INFO_SCRIPT_TO_DB: true });
    const evScriptData = decodePacket<EVENT_DATA>('EVENT_DATA', encodePacket('EVENT_DATA', {
      m_fEXPRate: 3.5,
      m_iDungeonID: 30010,
      m_iEventReward: 77,
    }, { flags: evScriptFlags }), { flags: evScriptFlags });
    assert.equal(evScriptData.m_fEXPRate, 3.5);
    assert.equal(evScriptData.m_iDungeonID, 30010);
    assert.equal(evScriptData.m_iEventReward, 77);

    // 6. Dynamic enum with #ifdefs (KDangerousEventInfo_DANGEROUS_EVENT)
    const twhkDe = getKDangerousEventInfo_DANGEROUS_EVENT('TWHK');
    const defDe = getKDangerousEventInfo_DANGEROUS_EVENT('DEFAULT');
    assert.equal(twhkDe.DE_EVENT_BOSS_MONSTER_DROP, 4);
    assert.equal(defDe.DE_EVENT_BOSS_MONSTER_DROP, undefined);
  });

  it('builds, compresses, serializes, and decodes full KEvent envelopes with EventID registry', () => {
    assert.equal(EVENT_TO_PACKET_NAME[EventID.EGS_VERIFY_ACCOUNT_REQ], 'KEGS_VERIFY_ACCOUNT_REQ');
    assert.equal(EVENT_TO_PACKET_NAME[EventID.ECH_SECURITY_AUTH_REQ], 'KECH_SECURITY_AUTH_REQ');
    assert.equal(EVENT_TO_PACKET_NAME[EventID.ESG_REWARD_DB_DATA_NOT], 'KESG_REWARD_DB_DATA_NOT');

    const jpSnFlags = createFlags('JP', { SERV_SERIAL_NUMBER_AVAILABILITY_CHECK_IN_GAMESERVER: true });
    const req = PACKET_CODECS['KEGS_VERIFY_ACCOUNT_REQ']!.create(jpSnFlags) as KEGS_VERIFY_ACCOUNT_REQ;
    req.m_wstrUserID = 'pilot_jp';
    req.m_wstrPasswd = 'secret_pw';
    req.m_iChannelingCode = 3;
    req.m_charServerSN = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    const event = buildEvent(EventID.EGS_VERIFY_ACCOUNT_REQ, req, {
      dwPerformerID: 42,
      trace: [10n, -1n],
      flags: jpSnFlags,
      compress: true,
    });
    assert.equal(event.m_kbuff.m_bCompress, true);

    const wireEnvelope = serializeKEvent(event);
    const parsedEnvelope = deserializeKEvent(wireEnvelope);
    assert.equal(parsedEnvelope.m_usEventID, EventID.EGS_VERIFY_ACCOUNT_REQ);
    assert.equal(parsedEnvelope.m_kDestPerformer.m_dwPerformerID, 42);
    assert.deepEqual(parsedEnvelope.m_anTrace, [10n, -1n]);
    assert.equal(parsedEnvelope.m_kbuff.m_bCompress, true);

    const parsedPayload = decodeEvent<KEGS_VERIFY_ACCOUNT_REQ>(parsedEnvelope, { flags: jpSnFlags });
    assert.deepStrictEqual(parsedPayload, req);

    // ID-only event (empty buffer)
    const hb = buildEvent(EventID.E_HEART_BEAT);
    assert.equal(hb.m_kbuff instanceof KSerBuffer, true);
    assert.equal(hb.m_kbuff.GetLength(), 0);
    assert.equal(decodeEvent(hb), undefined);

    // Typed usage check for KEGS_SOCKET_ITEM_ACK
    const ack: KEGS_SOCKET_ITEM_ACK = {
      m_iOK: 0,
      m_iED: 1234,
      m_iItemUID: 55n,
      m_vecInventorySlotInfo: [],
    };
    const ackWire = encodePacket('KEGS_SOCKET_ITEM_ACK', ack, { flags: 'DEFAULT' });
    assert.deepStrictEqual(decodePacket('KEGS_SOCKET_ITEM_ACK', ackWire, { flags: 'DEFAULT' }), ack);
  });
});
