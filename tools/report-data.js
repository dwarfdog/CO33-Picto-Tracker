#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'js', 'datas', 'skills-data.js');
const TRANSLATABLE_FIELDS = ['nom', 'effet', 'zone', 'flag', 'obtention'];

function loadDataFromFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
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

function stableClone(value) {
  if (Array.isArray(value)) {
    return value.map(stableClone);
  }

  if (value && typeof value === 'object') {
    const out = {};
    Object.keys(value).sort().forEach(function (k) {
      out[k] = stableClone(value[k]);
    });
    return out;
  }

  return value;
}

function isEqual(a, b) {
  return JSON.stringify(stableClone(a)) === JSON.stringify(stableClone(b));
}

function compareDatasets(baseData, targetData) {
  const basePictos = Array.isArray(baseData && baseData.pictos) ? baseData.pictos : [];
  const targetPictos = Array.isArray(targetData && targetData.pictos) ? targetData.pictos : [];

  const baseById = new Map();
  const targetById = new Map();

  basePictos.forEach(function (p) {
    if (p && typeof p.id === 'number') baseById.set(p.id, p);
  });
  targetPictos.forEach(function (p) {
    if (p && typeof p.id === 'number') targetById.set(p.id, p);
  });

  const addedIds = [];
  const removedIds = [];
  const updated = [];

  targetById.forEach(function (_, id) {
    if (!baseById.has(id)) addedIds.push(id);
  });
  baseById.forEach(function (_, id) {
    if (!targetById.has(id)) removedIds.push(id);
  });

  targetById.forEach(function (nextPicto, id) {
    if (!baseById.has(id)) return;
    const prevPicto = baseById.get(id);
    const keys = new Set();

    Object.keys(prevPicto || {}).forEach(function (k) { keys.add(k); });
    Object.keys(nextPicto || {}).forEach(function (k) { keys.add(k); });

    const changedFields = [];
    Array.from(keys).sort().forEach(function (key) {
      if (key === 'id' || key.charAt(0) === '_') return;
      if (!isEqual(prevPicto[key], nextPicto[key])) changedFields.push(key);
    });

    if (changedFields.length) {
      updated.push({ id: id, fields: changedFields });
    }
  });

  addedIds.sort(function (a, b) { return a - b; });
  removedIds.sort(function (a, b) { return a - b; });
  updated.sort(function (a, b) { return a.id - b.id; });

  return {
    base: {
      dataset_version: baseData && baseData.meta && baseData.meta.dataset_version,
      game_version: baseData && baseData.meta && baseData.meta.game_version,
      total_pictos: basePictos.length
    },
    target: {
      dataset_version: targetData && targetData.meta && targetData.meta.dataset_version,
      game_version: targetData && targetData.meta && targetData.meta.game_version,
      total_pictos: targetPictos.length
    },
    added_ids: addedIds,
    removed_ids: removedIds,
    updated: updated,
    counts: {
      added: addedIds.length,
      removed: removedIds.length,
      updated: updated.length
    }
  };
}

function buildReport(data, options) {
  const opts = options || {};
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

  if (opts.compareData) {
    report.comparison = compareDatasets(opts.compareData, data);
  }

  return report;
}

function parseArgs(argv) {
  const options = {
    file: DATA_FILE,
    compare: null,
    json: false
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--json') {
      options.json = true;
      continue;
    }

    if (arg === '--file') {
      const value = argv[i + 1];
      if (!value) throw new Error('Missing value for --file');
      options.file = path.resolve(process.cwd(), value);
      i++;
      continue;
    }

    if (arg === '--compare') {
      const value = argv[i + 1];
      if (!value) throw new Error('Missing value for --compare');
      options.compare = path.resolve(process.cwd(), value);
      i++;
      continue;
    }

    throw new Error('Unknown argument: ' + arg);
  }

  return options;
}

function run(options) {
  const opts = options || parseArgs(process.argv);
  const data = loadDataFromFile(opts.file);
  const compareData = opts.compare ? loadDataFromFile(opts.compare) : null;
  const report = buildReport(data, { compareData: compareData });
  const total = report.meta.total_pictos;

  if (opts.json) {
    console.log(JSON.stringify(report, null, 2));
    return report;
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

  if (report.comparison) {
    console.log('[report-data] Dataset diff:');
    console.log(
      '  - Base: ' + (report.comparison.base.dataset_version || 'n/a') +
      ' / game ' + (report.comparison.base.game_version || 'n/a') +
      ' / pictos ' + report.comparison.base.total_pictos
    );
    console.log(
      '  - Target: ' + (report.comparison.target.dataset_version || 'n/a') +
      ' / game ' + (report.comparison.target.game_version || 'n/a') +
      ' / pictos ' + report.comparison.target.total_pictos
    );
    console.log(
      '  - Added: ' + report.comparison.counts.added +
      ' | Updated: ' + report.comparison.counts.updated +
      ' | Removed: ' + report.comparison.counts.removed
    );

    if (report.comparison.added_ids.length) {
      console.log('  - Added IDs: ' + report.comparison.added_ids.join(', '));
    }
    if (report.comparison.removed_ids.length) {
      console.log('  - Removed IDs: ' + report.comparison.removed_ids.join(', '));
    }
    if (report.comparison.updated.length) {
      console.log('  - Updated IDs / fields:');
      report.comparison.updated.forEach(function (entry) {
        console.log('    - #' + entry.id + ': ' + entry.fields.join(', '));
      });
    }
  }

  return report;
}

if (require.main === module) {
  try {
    run();
  } catch (err) {
    console.error('[report-data] FAILED:', err.message);
    process.exit(1);
  }
}

module.exports = {
  run,
  parseArgs,
  buildReport,
  compareDatasets,
  loadDataFromFile
};
