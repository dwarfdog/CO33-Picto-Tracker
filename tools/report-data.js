#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '..', 'js', 'datas', 'skills-data.js');

function loadData() {
  const src = fs.readFileSync(DATA_FILE, 'utf8');
  return new Function(src + '; return DATA;')(); // eslint-disable-line no-new-func
}

function pct(n, total) {
  if (!total) return '0.0%';
  return ((n / total) * 100).toFixed(1) + '%';
}

function run() {
  const data = loadData();
  const pictos = Array.isArray(data.pictos) ? data.pictos : [];
  const total = pictos.length;

  function countFilled(field) {
    return pictos.filter(function (p) {
      return typeof p[field] === 'string' && p[field].trim() !== '';
    }).length;
  }

  const report = {
    meta: {
      dataset_version: data.meta && data.meta.dataset_version,
      game_version: data.meta && data.meta.game_version,
      updated_at: data.meta && data.meta.updated_at,
      total_pictos: total
    },
    coverage: {
      effet_fr: { count: countFilled('effet_fr'), pct: pct(countFilled('effet_fr'), total) },
      obtention_fr: { count: countFilled('obtention_fr'), pct: pct(countFilled('obtention_fr'), total) },
      flag_fr: { count: countFilled('flag_fr'), pct: pct(countFilled('flag_fr'), total) },
      zone_en: { count: countFilled('zone_en'), pct: pct(countFilled('zone_en'), total) },
      zone_fr: { count: countFilled('zone_fr'), pct: pct(countFilled('zone_fr'), total) }
    },
    translation_state: {
      confirmed: pictos.filter(function (p) { return p.traduction_confirmee === true; }).length,
      derived: pictos.filter(function (p) { return p.traduction_confirmee === false; }).length
    }
  };

  if (process.argv.indexOf('--json') !== -1) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log('[report-data] Dataset:', report.meta.dataset_version);
  console.log('[report-data] Game:', report.meta.game_version);
  console.log('[report-data] Updated:', report.meta.updated_at);
  console.log('[report-data] Total pictos:', report.meta.total_pictos);
  console.log('[report-data] Translation state: confirmed=' + report.translation_state.confirmed + ', derived=' + report.translation_state.derived);
  console.log('[report-data] Coverage:');
  Object.keys(report.coverage).forEach(function (k) {
    const v = report.coverage[k];
    console.log('  - ' + k + ': ' + v.count + '/' + total + ' (' + v.pct + ')');
  });
}

run();
