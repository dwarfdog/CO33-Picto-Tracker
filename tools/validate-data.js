#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '..', 'js', 'datas', 'skills-data.js');

function loadData() {
  const src = fs.readFileSync(DATA_FILE, 'utf8');
  return new Function(src + '; return DATA;')(); // eslint-disable-line no-new-func
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim() !== '';
}

function validate() {
  const errors = [];
  const warnings = [];
  const data = loadData();

  if (!data || typeof data !== 'object') {
    errors.push('DATA is missing or invalid.');
    return { errors, warnings };
  }

  if (!Array.isArray(data.pictos)) {
    errors.push('DATA.pictos must be an array.');
    return { errors, warnings };
  }

  const pictos = data.pictos;
  const meta = data.meta || {};

  if (meta.total_pictos !== pictos.length) {
    errors.push('meta.total_pictos (' + meta.total_pictos + ') does not match pictos.length (' + pictos.length + ').');
  }

  const ids = new Set();
  let minId = Infinity;
  let maxId = -Infinity;
  let confirmed = 0;
  let derived = 0;
  let effetFrCount = 0;
  let obtentionFrCount = 0;

  for (let i = 0; i < pictos.length; i++) {
    const p = pictos[i];
    const label = 'picto[' + i + ']';

    if (typeof p.id !== 'number' || !Number.isInteger(p.id) || p.id <= 0) {
      errors.push(label + ': invalid id.');
      continue;
    }

    if (ids.has(p.id)) {
      errors.push(label + ': duplicate id ' + p.id + '.');
    }
    ids.add(p.id);
    if (p.id < minId) minId = p.id;
    if (p.id > maxId) maxId = p.id;

    if (!isNonEmptyString(p.nom_en)) errors.push('id ' + p.id + ': nom_en is required.');
    if (!isNonEmptyString(p.nom_fr)) errors.push('id ' + p.id + ': nom_fr is required.');
    if (!isNonEmptyString(p.effet_en)) errors.push('id ' + p.id + ': effet_en is required.');
    if (!isNonEmptyString(p.zone_en) && !isNonEmptyString(p.zone_fr) && !isNonEmptyString(p.zone)) {
      errors.push('id ' + p.id + ': zone is required (zone_en, zone_fr, or zone).');
    }
    if (!isNonEmptyString(p.obtention_en)) errors.push('id ' + p.id + ': obtention_en is required.');

    if (typeof p.traduction_confirmee !== 'boolean') {
      errors.push('id ' + p.id + ': traduction_confirmee must be boolean.');
    } else if (p.traduction_confirmee) {
      confirmed++;
    } else {
      derived++;
    }

    if (p.lumina !== undefined && p.lumina !== null && p.lumina !== '') {
      const lumina = Number(p.lumina);
      if (!Number.isFinite(lumina) || lumina < 0) {
        errors.push('id ' + p.id + ': lumina must be a non-negative number.');
      }
    }

    if (p.statistiques !== undefined && p.statistiques !== null) {
      if (typeof p.statistiques !== 'object' || Array.isArray(p.statistiques)) {
        errors.push('id ' + p.id + ': statistiques must be an object.');
      } else {
        const entries = Object.entries(p.statistiques);
        for (let j = 0; j < entries.length; j++) {
          const key = entries[j][0];
          const val = entries[j][1];
          const parsed = parseFloat(val);
          if (Number.isNaN(parsed)) {
            errors.push('id ' + p.id + ': statistiques.' + key + ' must be numeric.');
          }
        }
      }
    }

    if (isNonEmptyString(p.effet_fr)) effetFrCount++;
    if (isNonEmptyString(p.obtention_fr)) obtentionFrCount++;
  }

  if (meta.traductions_confirmees !== undefined && meta.traductions_confirmees !== confirmed) {
    errors.push(
      'meta.traductions_confirmees (' + meta.traductions_confirmees +
      ') does not match actual (' + confirmed + ').'
    );
  }

  if (meta.traductions_derivees !== undefined && meta.traductions_derivees !== derived) {
    errors.push(
      'meta.traductions_derivees (' + meta.traductions_derivees +
      ') does not match actual (' + derived + ').'
    );
  }

  if (ids.size) {
    const expected = maxId - minId + 1;
    if (expected !== ids.size) {
      warnings.push('IDs are not contiguous: range [' + minId + '..' + maxId + '] but only ' + ids.size + ' unique IDs.');
    }
  }

  warnings.push('FR effects coverage: ' + effetFrCount + '/' + pictos.length + '.');
  warnings.push('FR obtention coverage: ' + obtentionFrCount + '/' + pictos.length + '.');

  return { errors, warnings, pictosCount: pictos.length, confirmed, derived };
}

function main() {
  let result;
  try {
    result = validate();
  } catch (err) {
    console.error('[validate-data] Fatal error:', err.message);
    process.exit(1);
  }

  console.log('[validate-data] Pictos:', result.pictosCount);
  console.log('[validate-data] Confirmed/Derived:', result.confirmed + '/' + result.derived);

  if (result.warnings.length) {
    console.log('[validate-data] Warnings:');
    for (let i = 0; i < result.warnings.length; i++) {
      console.log('  - ' + result.warnings[i]);
    }
  }

  if (result.errors.length) {
    console.error('[validate-data] Errors (' + result.errors.length + '):');
    for (let i = 0; i < result.errors.length; i++) {
      console.error('  - ' + result.errors[i]);
    }
    process.exit(1);
  }

  console.log('[validate-data] OK');
}

if (require.main === module) {
  main();
}

module.exports = validate;
