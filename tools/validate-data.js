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
  const changesMeta = meta.changes;
  let changeAddedIds = [];
  let changeRemovedIds = [];
  let changeUpdatedEntries = [];

  if (!isNonEmptyString(meta.dataset_version)) {
    errors.push('meta.dataset_version is required.');
  }

  if (!isNonEmptyString(meta.game_version)) {
    errors.push('meta.game_version is required.');
  }

  if (!isNonEmptyString(meta.updated_at)) {
    errors.push('meta.updated_at is required.');
  } else {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(meta.updated_at)) {
      errors.push('meta.updated_at must use YYYY-MM-DD format.');
    } else {
      const dateObj = new Date(meta.updated_at + 'T00:00:00Z');
      if (Number.isNaN(dateObj.getTime())) {
        errors.push('meta.updated_at must be a valid date.');
      }
    }
  }

  if (!Array.isArray(meta.sources) || meta.sources.length === 0) {
    errors.push('meta.sources must be a non-empty array.');
  }

  if (changesMeta !== undefined) {
    if (!changesMeta || typeof changesMeta !== 'object' || Array.isArray(changesMeta)) {
      errors.push('meta.changes must be an object when provided.');
    } else {
      if (changesMeta.from_dataset_version !== undefined && !isNonEmptyString(changesMeta.from_dataset_version)) {
        errors.push('meta.changes.from_dataset_version must be a non-empty string when provided.');
      }
      if (changesMeta.from_game_version !== undefined && !isNonEmptyString(changesMeta.from_game_version)) {
        errors.push('meta.changes.from_game_version must be a non-empty string when provided.');
      }
      if (changesMeta.note_en !== undefined && typeof changesMeta.note_en !== 'string') {
        errors.push('meta.changes.note_en must be a string when provided.');
      }
      if (changesMeta.note_fr !== undefined && typeof changesMeta.note_fr !== 'string') {
        errors.push('meta.changes.note_fr must be a string when provided.');
      }

      if (changesMeta.added_ids !== undefined) {
        if (!Array.isArray(changesMeta.added_ids)) {
          errors.push('meta.changes.added_ids must be an array when provided.');
        } else {
          changeAddedIds = changesMeta.added_ids.slice();
          const seenAdded = new Set();
          for (let i = 0; i < changeAddedIds.length; i++) {
            const id = changeAddedIds[i];
            if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {
              errors.push('meta.changes.added_ids[' + i + '] must be a positive integer.');
              continue;
            }
            if (seenAdded.has(id)) {
              errors.push('meta.changes.added_ids contains duplicate id ' + id + '.');
            }
            seenAdded.add(id);
          }
        }
      }

      if (changesMeta.removed_ids !== undefined) {
        if (!Array.isArray(changesMeta.removed_ids)) {
          errors.push('meta.changes.removed_ids must be an array when provided.');
        } else {
          changeRemovedIds = changesMeta.removed_ids.slice();
          const seenRemoved = new Set();
          for (let i = 0; i < changeRemovedIds.length; i++) {
            const id = changeRemovedIds[i];
            if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {
              errors.push('meta.changes.removed_ids[' + i + '] must be a positive integer.');
              continue;
            }
            if (seenRemoved.has(id)) {
              errors.push('meta.changes.removed_ids contains duplicate id ' + id + '.');
            }
            seenRemoved.add(id);
          }
        }
      }

      if (changesMeta.updated !== undefined) {
        if (!Array.isArray(changesMeta.updated)) {
          errors.push('meta.changes.updated must be an array when provided.');
        } else {
          const seenUpdated = new Set();
          for (let i = 0; i < changesMeta.updated.length; i++) {
            const entry = changesMeta.updated[i];
            if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
              errors.push('meta.changes.updated[' + i + '] must be an object.');
              continue;
            }
            if (typeof entry.id !== 'number' || !Number.isInteger(entry.id) || entry.id <= 0) {
              errors.push('meta.changes.updated[' + i + '].id must be a positive integer.');
              continue;
            }
            if (seenUpdated.has(entry.id)) {
              errors.push('meta.changes.updated contains duplicate id ' + entry.id + '.');
            }
            seenUpdated.add(entry.id);

            if (!Array.isArray(entry.fields)) {
              errors.push('meta.changes.updated[' + i + '].fields must be an array.');
              continue;
            }

            const fieldSeen = new Set();
            for (let j = 0; j < entry.fields.length; j++) {
              const field = entry.fields[j];
              if (!isNonEmptyString(field)) {
                errors.push('meta.changes.updated[' + i + '].fields[' + j + '] must be a non-empty string.');
                continue;
              }
              if (fieldSeen.has(field)) {
                errors.push('meta.changes.updated[' + i + '].fields contains duplicate field "' + field + '".');
              }
              fieldSeen.add(field);
            }

            changeUpdatedEntries.push({ id: entry.id, fields: entry.fields.slice() });
          }
        }
      }
    }
  }

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
    if (!isNonEmptyString(p.zone_en) && !isNonEmptyString(p.zone_fr)) {
      errors.push('id ' + p.id + ': zone is required (zone_en or zone_fr).');
    }
    if (!isNonEmptyString(p.obtention_en)) errors.push('id ' + p.id + ': obtention_en is required.');

    if (Object.prototype.hasOwnProperty.call(p, 'zone')) {
      errors.push('id ' + p.id + ': legacy field zone is forbidden. Use zone_en/zone_fr.');
    }
    if (Object.prototype.hasOwnProperty.call(p, 'localisation')) {
      errors.push('id ' + p.id + ': legacy field localisation is forbidden.');
    }
    if (Object.prototype.hasOwnProperty.call(p, 'localisation_en')) {
      errors.push('id ' + p.id + ': legacy field localisation_en is forbidden.');
    }
    if (Object.prototype.hasOwnProperty.call(p, 'localisation_fr')) {
      errors.push('id ' + p.id + ': legacy field localisation_fr is forbidden.');
    }

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

  for (let i = 0; i < changeAddedIds.length; i++) {
    const id = changeAddedIds[i];
    if (!ids.has(id)) {
      errors.push('meta.changes.added_ids contains unknown id ' + id + '.');
    }
  }

  for (let i = 0; i < changeUpdatedEntries.length; i++) {
    const id = changeUpdatedEntries[i].id;
    if (!ids.has(id)) {
      errors.push('meta.changes.updated contains unknown id ' + id + '.');
    }
  }

  // removed_ids represent entries from previous dataset: they should not exist in current pictos
  for (let i = 0; i < changeRemovedIds.length; i++) {
    const id = changeRemovedIds[i];
    if (ids.has(id)) {
      warnings.push('meta.changes.removed_ids contains id ' + id + ' still present in current dataset.');
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
