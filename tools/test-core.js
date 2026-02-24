#!/usr/bin/env node

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

if (typeof global.atob === 'undefined') {
  global.atob = function (str) {
    return Buffer.from(str, 'base64').toString('binary');
  };
}

if (typeof global.btoa === 'undefined') {
  global.btoa = function (str) {
    return Buffer.from(str, 'binary').toString('base64');
  };
}

function loadScript(relPath) {
  const full = path.join(ROOT, relPath);
  const code = fs.readFileSync(full, 'utf8');
  vm.runInThisContext(code, { filename: relPath });
}

function createLocalStorageMock() {
  const store = {};
  return {
    getItem: function (key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem: function (key, value) {
      store[key] = String(value);
    },
    removeItem: function (key) {
      delete store[key];
    },
    clear: function () {
      Object.keys(store).forEach(function (key) { delete store[key]; });
    }
  };
}

function run() {
  global.localStorage = createLocalStorageMock();

  loadScript('js/app.js');
  loadScript('js/datas/skills-data.js');
  loadScript('lang/fr.js');
  loadScript('lang/en.js');
  loadScript('js/i18n.js');
  loadScript('js/utils.js');
  loadScript('js/state.js');
  loadScript('js/export-import.js');

  App.LANG = 'fr';
  App.construireCaches();

  // zoneKey fallback order (zone_en -> zone_fr)
  assert.strictEqual(App.zoneKey({ zone_en: 'A', zone_fr: 'B' }), 'A');
  assert.strictEqual(App.zoneKey({ zone_fr: 'B' }), 'B');
  assert.strictEqual(App.zoneKey({ zone_en: '', zone_fr: 'B' }), 'B');
  assert.strictEqual(App.zoneKey({}), '');

  // champ fallback FR -> EN when FR value is missing
  const picto45 = DATA.pictos.find(function (p) { return p.id === 45; });
  assert.ok(picto45, 'Picto 45 must exist');
  assert.strictEqual(App.champ(picto45, 'effet'), picto45.effet_en);

  // search index should include zone_en values
  App.LANG = 'en';
  App.buildSearchIndex();
  const picto140 = DATA.pictos.find(function (p) { return p.id === 140; });
  assert.ok(picto140, 'Picto 140 must exist');
  assert.ok((picto140._searchIndex || '').indexOf('flying manor') !== -1);

  // parseImportData supports base64 and raw JSON/v2
  const sampleIds = [1, 2, 3];
  const b64 = btoa(JSON.stringify(sampleIds));
  assert.deepStrictEqual(App.parseImportData(b64), sampleIds);
  assert.deepStrictEqual(App.parseImportData(JSON.stringify(sampleIds)), sampleIds);
  assert.deepStrictEqual(App.parseImportData(JSON.stringify({ possedes: sampleIds })), sampleIds);
  assert.deepStrictEqual(
    App.parseImportData(JSON.stringify({
      version: 3,
      profil_actif: 'run-b',
      profils: [
        { id: 'run-a', nom: 'Run A', possedes: [1] },
        { id: 'run-b', nom: 'Run B', possedes: [2, 3] }
      ]
    })),
    [2, 3]
  );
  assert.strictEqual(App.parseImportData('not-a-valid-code'), null);

  // migration and persistence for multi-profile storage (v2 -> v3)
  localStorage.setItem(App.STORAGE_KEY, JSON.stringify({ version: 2, possedes: [1, 2, 999999, 2] }));
  App.chargerSauvegarde();
  assert.strictEqual(App.etat.profils.length, 1);
  assert.strictEqual(App.etat.profilActifId, App.etat.profils[0].id);
  assert.deepStrictEqual(Array.from(App.etat.possedes).sort(function (a, b) { return a - b; }), [1, 2]);

  const newProfile = App.creerEtActiverProfil('Run B');
  assert.ok(newProfile && newProfile.id, 'New profile should be created');
  App.etat.possedes.add(3);
  App.sauvegarder();

  const saved = JSON.parse(localStorage.getItem(App.STORAGE_KEY));
  assert.strictEqual(saved.version, App.STORAGE_VERSION);
  assert.strictEqual(Array.isArray(saved.profils), true);
  assert.strictEqual(saved.profils.length, 2);
  assert.strictEqual(saved.profil_actif, newProfile.id);
  const savedRunB = saved.profils.find(function (p) { return p.id === newProfile.id; });
  assert.ok(savedRunB, 'Saved payload should include active profile');
  assert.deepStrictEqual(savedRunB.possedes, [3]);

  // meta translation counters should match actual values
  const confirmed = DATA.pictos.filter(function (p) { return p.traduction_confirmee === true; }).length;
  const derived = DATA.pictos.filter(function (p) { return p.traduction_confirmee === false; }).length;
  assert.strictEqual(DATA.meta.traductions_confirmees, confirmed);
  assert.strictEqual(DATA.meta.traductions_derivees, derived);

  // legacy fields should not exist in dataset
  assert.strictEqual(DATA.pictos.some(function (p) { return Object.prototype.hasOwnProperty.call(p, 'zone'); }), false);
  assert.strictEqual(DATA.pictos.some(function (p) { return Object.prototype.hasOwnProperty.call(p, 'localisation'); }), false);
  assert.strictEqual(DATA.pictos.some(function (p) { return Object.prototype.hasOwnProperty.call(p, 'localisation_en'); }), false);
  assert.strictEqual(DATA.pictos.some(function (p) { return Object.prototype.hasOwnProperty.call(p, 'localisation_fr'); }), false);

  // meta dataset governance fields
  assert.ok(typeof DATA.meta.dataset_version === 'string' && DATA.meta.dataset_version.length > 0);
  assert.ok(typeof DATA.meta.game_version === 'string' && DATA.meta.game_version.length > 0);
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(DATA.meta.updated_at));
}

if (require.main === module) {
  try {
    run();
    console.log('[test-core] OK');
  } catch (err) {
    console.error('[test-core] FAILED:', err.message);
    process.exit(1);
  }
}

module.exports = run;
