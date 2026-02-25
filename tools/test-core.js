#!/usr/bin/env node

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const reportData = require('./report-data');

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
  loadScript('js/gameplay-expert.js');
  loadScript('js/lumina-planner.js');
  loadScript('js/dataset-changes.js');
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
  assert.ok(Array.isArray(picto140._gameplayTags), 'Gameplay tags should be resolved during indexing');

  // gameplay tags catalog + resolver
  const gameplayCfg = App.getGameplayConfig();
  assert.ok(gameplayCfg.tags.length >= 5, 'Gameplay tags catalog must be populated');
  assert.ok(gameplayCfg.tagMap.ap, 'Gameplay tag "ap" must exist');
  assert.ok(gameplayCfg.tagMap.other, 'Gameplay fallback tag "other" must exist');

  const picto2 = DATA.pictos.find(function (p) { return p.id === 2; });
  const picto12 = DATA.pictos.find(function (p) { return p.id === 12; });
  assert.ok(picto2, 'Picto 2 must exist');
  assert.ok(picto12, 'Picto 12 must exist');
  assert.ok(App.resolveGameplayTags(picto2).indexOf('burn') !== -1);
  assert.ok(App.resolveGameplayTags(picto2).indexOf('crit') !== -1);
  assert.ok(App.resolveGameplayTags(picto12).indexOf('mark') !== -1);

  const unknownGameplayPicto = {
    id: 999999,
    nom_en: 'Unknown',
    nom_fr: 'Inconnu',
    effet_en: 'No documented behavior',
    effet_fr: '',
    obtention_en: '',
    obtention_fr: ''
  };
  assert.deepStrictEqual(App.resolveGameplayTags(unknownGameplayPicto), ['other']);

  // farm route grouping by zone/flag
  App.LANG = 'en';
  const route = App.construireRouteCollecte([
    DATA.pictos.find(function (p) { return p.id === 1; }),
    DATA.pictos.find(function (p) { return p.id === 2; }),
    DATA.pictos.find(function (p) { return p.id === 8; })
  ]);
  assert.strictEqual(route.length, 2);
  assert.strictEqual(route[0].zoneLabel, 'Flying Waters');
  assert.strictEqual(route[1].zoneLabel, 'Spring Meadows');
  assert.strictEqual(route[1].total, 2);
  assert.ok(route[1].flags.some(function (f) { return f.flagLabel === 'Meadows Corridor'; }));

  // parseImportData supports base64 and raw JSON/v2+/v4
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
  const importPayload = App.parseImportPayload(JSON.stringify({
    possedes: [4, 5],
    build_lumina: [4],
    budget_lumina: 25
  }));
  assert.ok(importPayload, 'parseImportPayload should decode object payload');
  assert.deepStrictEqual(importPayload.possedes, [4, 5]);
  assert.deepStrictEqual(importPayload.buildLumina, [4]);
  assert.strictEqual(importPayload.budgetLumina, 25);
  assert.strictEqual(App.parseImportData('not-a-valid-code'), null);

  // migration and persistence for multi-profile storage (v2 -> v4)
  localStorage.setItem(App.STORAGE_KEY, JSON.stringify({ version: 2, possedes: [1, 2, 999999, 2] }));
  App.chargerSauvegarde();
  assert.strictEqual(App.etat.profils.length, 1);
  assert.strictEqual(App.etat.profilActifId, App.etat.profils[0].id);
  assert.deepStrictEqual(Array.from(App.etat.possedes).sort(function (a, b) { return a - b; }), [1, 2]);
  assert.deepStrictEqual(Array.from(App.etat.buildLumina), []);
  assert.strictEqual(App.etat.luminaBudget, 0);

  const newProfile = App.creerEtActiverProfil('Run B');
  assert.ok(newProfile && newProfile.id, 'New profile should be created');
  App.etat.possedes.add(3);
  App.etat.buildLumina.add(1);
  App.etat.buildLumina.add(2);
  App.definirBudgetLumina(10);

  const expectedBuildTotal = App.getLuminaCost(App.getPictoById(1)) + App.getLuminaCost(App.getPictoById(2));
  const metrics = App.calculerPlanLumina();
  assert.strictEqual(metrics.count, 2);
  assert.strictEqual(metrics.total, expectedBuildTotal);
  assert.strictEqual(metrics.budget, 10);
  assert.strictEqual(metrics.remaining, 10 - expectedBuildTotal);

  App.sauvegarder();

  const saved = JSON.parse(localStorage.getItem(App.STORAGE_KEY));
  assert.strictEqual(saved.version, App.STORAGE_VERSION);
  assert.strictEqual(Array.isArray(saved.profils), true);
  assert.strictEqual(saved.profils.length, 2);
  assert.strictEqual(saved.profil_actif, newProfile.id);
  const savedRunB = saved.profils.find(function (p) { return p.id === newProfile.id; });
  assert.ok(savedRunB, 'Saved payload should include active profile');
  assert.deepStrictEqual(savedRunB.possedes, [3]);
  assert.deepStrictEqual(savedRunB.build_lumina, [1, 2]);
  assert.strictEqual(savedRunB.budget_lumina, 10);

  // simulated dataset comparison (added/updated/removed)
  const simV1 = reportData.loadDataFromFile(path.join(ROOT, 'tools', 'fixtures', 'dataset-sim-v1.js'));
  const simV2 = reportData.loadDataFromFile(path.join(ROOT, 'tools', 'fixtures', 'dataset-sim-v2.js'));
  const diff = reportData.compareDatasets(simV1, simV2);
  assert.deepStrictEqual(diff.added_ids, [3]);
  assert.deepStrictEqual(diff.removed_ids, [1]);
  assert.strictEqual(diff.updated.length, 1);
  assert.strictEqual(diff.updated[0].id, 2);
  assert.ok(diff.updated[0].fields.indexOf('effet_fr') !== -1);
  assert.ok(diff.updated[0].fields.indexOf('lumina') !== -1);

  // dataset changelog metadata should expose visible additions/updates
  const changesMeta = App.getDatasetChangesMeta();
  assert.deepStrictEqual(changesMeta.addedIds, [205, 206, 207, 208, 209, 210]);
  assert.strictEqual(changesMeta.updated.length, 3);
  assert.strictEqual(changesMeta.removedIds.length, 0);

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
