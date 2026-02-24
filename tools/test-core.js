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

function run() {
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

  // zoneKey fallback order
  assert.strictEqual(App.zoneKey({ zone_en: 'A', zone_fr: 'B', zone: 'C' }), 'A');
  assert.strictEqual(App.zoneKey({ zone_fr: 'B', zone: 'C' }), 'B');
  assert.strictEqual(App.zoneKey({ zone: 'C' }), 'C');
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
  assert.strictEqual(App.parseImportData('not-a-valid-code'), null);

  // meta translation counters should match actual values
  const confirmed = DATA.pictos.filter(function (p) { return p.traduction_confirmee === true; }).length;
  const derived = DATA.pictos.filter(function (p) { return p.traduction_confirmee === false; }).length;
  assert.strictEqual(DATA.meta.traductions_confirmees, confirmed);
  assert.strictEqual(DATA.meta.traductions_derivees, derived);

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
