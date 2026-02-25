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

if (typeof global.requestAnimationFrame === 'undefined') {
  global.requestAnimationFrame = function (fn) { fn(); return 0; };
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

  // ── PR5: categorie & obtention_type ──

  // meta.categories and meta.obtention_types should be present
  assert.ok(Array.isArray(DATA.meta.categories) && DATA.meta.categories.length >= 3);
  assert.ok(Array.isArray(DATA.meta.obtention_types) && DATA.meta.obtention_types.length >= 4);

  // Every picto should have valid categorie and obtention_type
  var validCats = new Set(DATA.meta.categories.map(function (c) { return c.id; }));
  var validObts = new Set(DATA.meta.obtention_types.map(function (o) { return o.id; }));
  DATA.pictos.forEach(function (p) {
    assert.ok(typeof p.categorie === 'string' && validCats.has(p.categorie),
      'Picto ' + p.id + ' should have valid categorie, got: ' + p.categorie);
    assert.ok(typeof p.obtention_type === 'string' && validObts.has(p.obtention_type),
      'Picto ' + p.id + ' should have valid obtention_type, got: ' + p.obtention_type);
  });

  // ── PR5: maitrise & niveaux ──

  // MASTERY_MAX and PICTO_LEVEL_MAX constants
  assert.strictEqual(App.MASTERY_MAX, 4);
  assert.strictEqual(App.PICTO_LEVEL_MAX, 33);
  assert.strictEqual(App.STORAGE_VERSION, 6);

  // normaliserMaitrise
  assert.deepStrictEqual(App.normaliserMaitrise(null), {});
  assert.deepStrictEqual(App.normaliserMaitrise({ 1: 3, 999999: 2 }), { 1: 3 });
  assert.deepStrictEqual(App.normaliserMaitrise({ 1: 10 }), { 1: 4 }); // clamped
  assert.deepStrictEqual(App.normaliserMaitrise({ 1: 0 }), {}); // 0 not stored
  assert.deepStrictEqual(App.normaliserMaitrise({ 1: -1 }), {}); // negative → 0

  // normaliserNiveaux
  assert.deepStrictEqual(App.normaliserNiveaux(null), {});
  assert.deepStrictEqual(App.normaliserNiveaux({ 1: 5, 999999: 2 }), { 1: 5 });
  assert.deepStrictEqual(App.normaliserNiveaux({ 1: 50 }), { 1: 33 }); // clamped
  assert.deepStrictEqual(App.normaliserNiveaux({ 1: 1 }), {}); // 1 is default, not stored
  assert.deepStrictEqual(App.normaliserNiveaux({ 1: 0 }), {}); // below 1 → 1

  // setMaitrise / getMaitrise
  App.setMaitrise(1, 3);
  assert.strictEqual(App.getMaitrise(1), 3);
  App.setMaitrise(1, 0);
  assert.strictEqual(App.getMaitrise(1), 0);

  // setNiveau / getNiveau
  App.setNiveau(1, 15);
  assert.strictEqual(App.getNiveau(1), 15);
  App.setNiveau(1, 1);
  assert.strictEqual(App.getNiveau(1), 1);

  // Migration v4→v5 : maitrise and niveaux should default to {}
  localStorage.clear();
  localStorage.setItem(App.STORAGE_KEY, JSON.stringify({
    version: 4,
    profil_actif: 'p1',
    profils: [{ id: 'p1', nom: 'Old', possedes: [1, 2], build_lumina: [], budget_lumina: 0 }]
  }));
  App.chargerSauvegarde();
  assert.ok(App.etat.profils.length >= 1, 'Should load v4 profile');
  assert.deepStrictEqual(App.etat.maitrise, {});
  assert.deepStrictEqual(App.etat.niveaux, {});

  // Verify v6 save includes maitrise, niveaux and ng_cycle
  App.setMaitrise(1, 2);
  App.setNiveau(2, 10);
  App.setNgCycle(2);
  App.sauvegarder();
  var savedV6 = JSON.parse(localStorage.getItem(App.STORAGE_KEY));
  assert.strictEqual(savedV6.version, 6);
  var profV6 = savedV6.profils[0];
  assert.strictEqual(profV6.maitrise[1], 2);
  assert.strictEqual(profV6.niveaux[2], 10);
  assert.strictEqual(profV6.ng_cycle, 2);

  // ── PR7: NG Cycle ──

  // NG_CYCLES constant
  assert.ok(Array.isArray(App.NG_CYCLES) && App.NG_CYCLES.length === 4);
  assert.strictEqual(App.NG_CYCLES[0].maxLevel, 15);
  assert.strictEqual(App.NG_CYCLES[3].maxLevel, 33);

  // getNgMaxLevel
  App.setNgCycle(0);
  assert.strictEqual(App.getNgMaxLevel(), 15);
  App.setNgCycle(1);
  assert.strictEqual(App.getNgMaxLevel(), 22);
  App.setNgCycle(2);
  assert.strictEqual(App.getNgMaxLevel(), 28);
  App.setNgCycle(3);
  assert.strictEqual(App.getNgMaxLevel(), 33);

  // setNgCycle clamping
  App.setNgCycle(-1);
  assert.strictEqual(App.etat.ngCycle, 0);
  App.setNgCycle(5);
  assert.strictEqual(App.etat.ngCycle, 3);

  // Migration v5→v6 : ng_cycle should default to 0
  localStorage.clear();
  localStorage.setItem(App.STORAGE_KEY, JSON.stringify({
    version: 5,
    profil_actif: 'p1',
    profils: [{ id: 'p1', nom: 'OldV5', possedes: [1], build_lumina: [], budget_lumina: 0, maitrise: {}, niveaux: {} }]
  }));
  App.chargerSauvegarde();
  assert.ok(App.etat.profils.length >= 1, 'Should load v5 profile');
  assert.strictEqual(App.etat.ngCycle, 0);

  // source_endgame and source_boss fields should exist on some pictos
  var endgamePictos = DATA.pictos.filter(function (p) { return p.source_endgame === true; });
  assert.ok(endgamePictos.length >= 10, 'Should have at least 10 endgame pictos');
  var bossPictos = DATA.pictos.filter(function (p) { return typeof p.source_boss === 'string' && p.source_boss.length > 0; });
  assert.ok(bossPictos.length >= 10, 'Should have at least 10 boss drop pictos');
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
