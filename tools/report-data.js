#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '..', 'js', 'datas', 'skills-data.js');
const TRANSLATABLE_FIELDS = ['nom', 'effet', 'zone', 'flag', 'obtention'];

function loadData() {
  const src = fs.readFileSync(DATA_FILE, 'utf8');
  return new Function(src + '; return DATA;')(); // eslint-disable-line no-new-func
}

function pct(n, total) {
  if (!total) return '0.0%';
  return ((n / total) * 100).toFixed(1) + '%';
}

function isFilled(v) {
  return typeof v === 'string' && v.trim() !== '';
}

function countFilled(pictos, field) {
  return pictos.filter(function (p) {
    return isFilled(p[field]);
  }).length;
}

function detectLanguageCodes(pictos) {
  const out = new Set();
  const re = /^(nom|effet|zone|flag|obtention)_([a-z0-9]+)$/i;

  pictos.forEach(function (picto) {
    Object.keys(picto).forEach(function (key) {
      const m = key.match(re);
      if (m) out.add(m[2].toLowerCase());
    });
  });

  out.add('en');
  return Array.from(out).sort();
}

function buildLanguageCoverage(pictos, total, languages) {
  const coverage = {};

  languages.forEach(function (lang) {
    const byField = {};

    TRANSLATABLE_FIELDS.forEach(function (base) {
      const rawField = base + '_' + lang;
      const fallbackField = base + '_en';
      const rawCount = countFilled(pictos, rawField);
      const resolvedCount = lang === 'en'
        ? rawCount
        : pictos.filter(function (p) { return isFilled(p[rawField]) || isFilled(p[fallbackField]); }).length;

      byField[base] = {
        raw: { count: rawCount, pct: pct(rawCount, total) },
        resolved: { count: resolvedCount, pct: pct(resolvedCount, total) }
      };
    });

    const completeRaw = pictos.filter(function (p) {
      return TRANSLATABLE_FIELDS.every(function (base) {
        return isFilled(p[base + '_' + lang]);
      });
    }).length;

    const completeResolved = lang === 'en'
      ? completeRaw
      : pictos.filter(function (p) {
        return TRANSLATABLE_FIELDS.every(function (base) {
          return isFilled(p[base + '_' + lang]) || isFilled(p[base + '_en']);
        });
      }).length;

    coverage[lang] = {
      fields: byField,
      complete_entries: {
        raw: { count: completeRaw, pct: pct(completeRaw, total) },
        resolved: { count: completeResolved, pct: pct(completeResolved, total) }
      }
    };
  });

  return coverage;
}

function run() {
  const data = loadData();
  const pictos = Array.isArray(data.pictos) ? data.pictos : [];
  const total = pictos.length;
  const languageCodes = detectLanguageCodes(pictos);

  const report = {
    meta: {
      dataset_version: data.meta && data.meta.dataset_version,
      game_version: data.meta && data.meta.game_version,
      updated_at: data.meta && data.meta.updated_at,
      total_pictos: total
    },
    translation_fields: TRANSLATABLE_FIELDS.slice(),
    language_codes: languageCodes,
    coverage: {
      effet_fr: { count: countFilled(pictos, 'effet_fr'), pct: pct(countFilled(pictos, 'effet_fr'), total) },
      obtention_fr: { count: countFilled(pictos, 'obtention_fr'), pct: pct(countFilled(pictos, 'obtention_fr'), total) },
      flag_fr: { count: countFilled(pictos, 'flag_fr'), pct: pct(countFilled(pictos, 'flag_fr'), total) },
      zone_en: { count: countFilled(pictos, 'zone_en'), pct: pct(countFilled(pictos, 'zone_en'), total) },
      zone_fr: { count: countFilled(pictos, 'zone_fr'), pct: pct(countFilled(pictos, 'zone_fr'), total) }
    },
    coverage_by_language: buildLanguageCoverage(pictos, total, languageCodes),
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

  console.log('[report-data] Coverage by language:');
  report.language_codes.forEach(function (lang) {
    const langReport = report.coverage_by_language[lang];
    console.log('  [' + lang + ']');
    TRANSLATABLE_FIELDS.forEach(function (field) {
      const fieldReport = langReport.fields[field];
      if (lang === 'en') {
        console.log('    - ' + field + ': ' + fieldReport.raw.count + '/' + total + ' (' + fieldReport.raw.pct + ')');
      } else {
        console.log(
          '    - ' + field + ': raw ' + fieldReport.raw.count + '/' + total + ' (' + fieldReport.raw.pct + ')' +
          ' | resolved(en fallback) ' + fieldReport.resolved.count + '/' + total + ' (' + fieldReport.resolved.pct + ')'
        );
      }
    });
    if (lang === 'en') {
      console.log(
        '    - complete_entries: ' + langReport.complete_entries.raw.count + '/' + total +
        ' (' + langReport.complete_entries.raw.pct + ')'
      );
    } else {
      console.log(
        '    - complete_entries: raw ' + langReport.complete_entries.raw.count + '/' + total +
        ' (' + langReport.complete_entries.raw.pct + ')' +
        ' | resolved(en fallback) ' + langReport.complete_entries.resolved.count + '/' + total +
        ' (' + langReport.complete_entries.resolved.pct + ')'
      );
    }
  });
}

run();
