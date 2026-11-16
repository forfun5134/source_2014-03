import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_SERVER_FLAGS,
  PRESET_BR,
  PRESET_CN,
  PRESET_DEFAULT,
  PRESET_EU,
  PRESET_HK,
  PRESET_ID,
  PRESET_IN,
  PRESET_JP,
  PRESET_KR,
  PRESET_PH,
  PRESET_TH,
  PRESET_TW,
  PRESET_TWHK,
  PRESET_US,
  SERVER_REGION_PRESETS,
  createFlags,
  getUidMaskOptions,
  isFlagEnabled,
  resolveFlags,
  type ServerRegionPreset,
} from '../src/flags/index.ts';

describe('ServerDefine runtime flags & region presets', () => {
  it('exposes all 14 evaluated region presets cleanly', () => {
    const names: ServerRegionPreset[] = [
      'DEFAULT',
      'KR',
      'TW',
      'HK',
      'TWHK',
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
    for (const name of names) {
      assert.ok(SERVER_REGION_PRESETS[name], `Missing preset ${name}`);
      assert.equal(resolveFlags(name), SERVER_REGION_PRESETS[name]);
    }
    assert.equal(resolveFlags(undefined), DEFAULT_SERVER_FLAGS);
    assert.equal(PRESET_DEFAULT, DEFAULT_SERVER_FLAGS);
  });

  it('preserves ServerDefine.h + ServerDefine_Global.h + ServerDefine_<Country>.h differences', () => {
    // KR pre-global skips SERV_GLOBAL_COMMON; DEFAULT enables SERV_GLOBAL_COMMON
    assert.equal(PRESET_KR.SERV_GLOBAL_COMMON, false);
    assert.equal(PRESET_KR.SERV_GLOBAL_BILLING, false);
    assert.equal(PRESET_DEFAULT.SERV_GLOBAL_COMMON, true);
    assert.equal(PRESET_DEFAULT.SERV_GLOBAL_BILLING, true);

    // TW vs HK differences inside ServerDefine_TWHK.h
    assert.equal(PRESET_TW.SERV_COUNTRY_TW, true);
    assert.equal(PRESET_TW.SERV_COUNTRY_TWHK, true);
    assert.equal(PRESET_TW.SERV_COUNTRY_HK, false);
    assert.equal(PRESET_HK.SERV_COUNTRY_HK, true);
    assert.equal(PRESET_HK.SERV_COUNTRY_TWHK, true);
    assert.equal(PRESET_HK.SERV_COUNTRY_TW, false);
    assert.equal(PRESET_TWHK.SERV_COUNTRY_TWHK, true);

    // Country-specific packet flags
    assert.equal(PRESET_PH.SERV_COUNTRY_PH, true);
    assert.equal(PRESET_TH.SERV_COUNTRY_TH, true);
    assert.equal(PRESET_CN.SERV_ANTI_ADDICTION_SYSTEM, true);
    assert.equal(PRESET_CN.SERV_VIP_SYSTEM, true);
    assert.equal(PRESET_US.SERV_COUNTRY_US, true);
    assert.equal(PRESET_EU.SERV_COUNTRY_EU, true);
    assert.equal(PRESET_JP.SERV_COUNTRY_JP, true);
    assert.equal(PRESET_ID.SERV_COUNTRY_ID, true);
    assert.equal(PRESET_BR.SERV_COUNTRY_BR, true);
    assert.equal(PRESET_IN.SERV_COUNTRY_IN, true);
  });

  it('supports runtime flag overrides and UID mask detection for CN/US', () => {
    const custom = createFlags('JP', { SERV_CHANNEL_PARTY: false, SERV_DUNGEON_FPS_LOG: true });
    assert.equal(custom.SERV_COUNTRY_JP, true);
    assert.equal(custom.SERV_CHANNEL_PARTY, false);
    assert.equal(custom.SERV_DUNGEON_FPS_LOG, true);
    assert.equal(isFlagEnabled({ preset: 'TW', overrides: { SERV_SOCKET_NEW: false } }, 'SERV_SOCKET_NEW'), false);

    assert.equal(getUidMaskOptions('DEFAULT').extendServerGroupMask, false);
    assert.equal(getUidMaskOptions('JP').extendServerGroupMask, false);
    assert.equal(getUidMaskOptions('CN').extendServerGroupMask, true);
    assert.equal(getUidMaskOptions('US').extendServerGroupMask, true);
  });
});
