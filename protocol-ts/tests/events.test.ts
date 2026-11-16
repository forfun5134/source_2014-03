import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  E_CLIENT_EVENT_ID_BEGIN,
  E_SYSTEM_EVENT_ID_END,
  EVENT_X2_STARTUP,
  EventID,
  EventIDClient,
  EventIDClientGlobal,
  EventIDSystem,
  getEventIdName,
  getEventIdValue,
} from '../src/events/index.ts';
import {
  KSerBuffer,
  KSerializer,
  createKEvent,
  createKPerformerInfo,
  extractCodeID,
  extractPureUID,
  extractReservedID,
  extractServerGroupID,
  extractServerID,
  getKEvent,
  isTempUID,
  popKEventTrace,
  pushKEventTrace,
  putKEvent,
  setCodeID,
  setPureUID,
  setReservedID,
  setServerGroupID,
  setServerID,
  setTempUID,
} from '../src/runtime/index.ts';
import { getUidMaskOptions } from '../src/flags/index.ts';

describe('EventID alignment, KEvent envelope, and KncUid bit-packing', () => {
  it('matches exact C++ Event.h / X2ServerEvent.h EventID numbering across all 1,325 entries', () => {
    assert.equal(EventIDSystem.E_HEART_BEAT, 0);
    assert.equal(E_SYSTEM_EVENT_ID_END, 20);
    assert.equal(EventIDSystem.E_SYSTEM_EVENT_ID_END, 20);
    assert.equal(E_CLIENT_EVENT_ID_BEGIN, 20);
    assert.equal(EVENT_X2_STARTUP, 20);

    assert.equal(EventIDClient.EGS_GOOD_JOB_1_REQ, 21);
    assert.equal(EventIDClient.EGS_GET_NAVER_ACCESS_TOKEN_ACK, 1172);
    // OnlyGlobal/EventID_Client_Global.h starts immediately at 1173
    assert.equal(EventIDClientGlobal.ECH_SECURITY_AUTH_REQ, 1173);
    assert.equal(EventIDClient.ECH_SECURITY_AUTH_REQ, 1173);
    assert.equal(EventIDClientGlobal.EGS_4TH_ANNIV_EVENT_REWARD_ACK, 1323);
    assert.equal(EventIDClient.EGS_CLIENT_EVENT_ID_END, 1324);

    assert.equal(Object.keys(EventIDSystem).length, 21);
    assert.equal(Object.keys(EventIDClientGlobal).length, 151);
    assert.equal(Object.keys(EventIDClient).length, 1304);

    // Every integer 0..1324 resolves uniquely and matches EventID[name]
    for (let id = 0; id <= EventID.EGS_CLIENT_EVENT_ID_END; id++) {
      const name = getEventIdName(id);
      assert.ok(name !== undefined, `Missing EventID name at ${id}`);
      assert.equal(getEventIdValue(name as keyof typeof EventID), id);
    }
  });

  it('roundtrips KPerformerInfo & KEvent envelope and manages trace stack', () => {
    const perf = createKPerformerInfo();
    perf.m_dwPerformerID = 1001;
    perf.m_setUID.add(100001n);
    perf.m_setUID.add(100002n);

    const ev = createKEvent();
    ev.m_kDestPerformer = perf;
    ev.m_usEventID = EventID.EGS_CONNECT_REQ;
    pushKEventTrace(ev, 5001n);
    pushKEventTrace(ev, 6001n);
    assert.deepEqual(ev.m_anTrace, [5001n, 6001n]);

    const buf = new KSerBuffer();
    const ks = new KSerializer();
    ks.BeginWriting(buf, false);
    ks.putUserClass(ev, putKEvent);
    ks.EndWriting();

    ks.BeginReading(buf, false);
    const decoded = ks.getUserClass(getKEvent);
    assert.equal(buf.GetReadLength(), 0);
    assert.equal(decoded.m_kDestPerformer.m_dwPerformerID, 1001);
    assert.deepEqual([...decoded.m_kDestPerformer.m_setUID], [100001n, 100002n]);
    assert.deepEqual(decoded.m_anTrace, [5001n, 6001n]);
    assert.equal(decoded.m_usEventID, EventID.EGS_CONNECT_REQ);

    popKEventTrace(decoded);
    assert.deepEqual(decoded.m_anTrace, [5001n, -1n]);
    popKEventTrace(decoded);
    assert.deepEqual(decoded.m_anTrace, [-1n, -1n]);
  });

  it('packs & unpacks KncUid bitfields accurately for standard and CN/US extended masks', () => {
    // Standard mask
    const stdOpts = getUidMaskOptions('KR');
    let uid = 0n;
    uid = setPureUID(uid, 0x123456789an, stdOpts);
    uid = setReservedID(uid, 0x2bn, stdOpts);
    uid = setServerID(uid, 0x05n, stdOpts);
    uid = setServerGroupID(uid, 0x17n, stdOpts);
    assert.equal(extractPureUID(uid, stdOpts), 0x123456789an);
    assert.equal(extractReservedID(uid, stdOpts), 0x2bn);
    assert.equal(extractServerID(uid, stdOpts), 0x05n);
    assert.equal(extractServerGroupID(uid, stdOpts), 0x17n);
    assert.equal(extractCodeID(uid, stdOpts), 0x052bn);

    // CN/US extended mask (10-bit server group, 36-bit pure UID)
    const cnOpts = getUidMaskOptions('CN');
    let cnUid = 0n;
    cnUid = setPureUID(cnUid, 0x0987654321n, cnOpts);
    cnUid = setCodeID(cnUid, 0x1a2bn, cnOpts);
    cnUid = setServerGroupID(cnUid, 0x2ffn, cnOpts);
    assert.equal(extractPureUID(cnUid, cnOpts), 0x0987654321n);
    assert.equal(extractServerID(cnUid, cnOpts), 0x1an);
    assert.equal(extractReservedID(cnUid, cnOpts), 0x2bn);
    assert.equal(extractServerGroupID(cnUid, cnOpts), 0x2ffn);
    assert.equal(isTempUID(cnUid), false);
    cnUid = setTempUID(cnUid);
    assert.equal(isTempUID(cnUid), true);
  });
});
