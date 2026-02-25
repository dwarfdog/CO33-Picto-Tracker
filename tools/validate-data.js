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

function normalizeGameplayText(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeGameplayList(input) {
  if (!Array.isArray(input)) return [];
  const out = [];
  const seen = new Set();

  for (let i = 0; i < input.length; i++) {
    const value = input[i];
    if (typeof value !== 'string' || !value.trim()) continue;
    const normalized = normalizeGameplayText(value);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }

  return out;
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
  const gameplayMeta = meta.gameplay;
  let changeAddedIds = [];
  let changeRemovedIds = [];
  let changeUpdatedEntries = [];
  const gameplayTagIds = new Set();
  const gameplayRules = [];
  const gameplayOverrides = {};
  let gameplayFallbackTag = '';

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

  if (!gameplayMeta || typeof gameplayMeta !== 'object' || Array.isArray(gameplayMeta)) {
    errors.push('meta.gameplay must be an object.');
  } else {
    if (!Array.isArray(gameplayMeta.tags) || gameplayMeta.tags.length === 0) {
      errors.push('meta.gameplay.tags must be a non-empty array.');
    } else {
      for (let i = 0; i < gameplayMeta.tags.length; i++) {
        const tag = gameplayMeta.tags[i];
        if (!tag || typeof tag !== 'object' || Array.isArray(tag)) {
          errors.push('meta.gameplay.tags[' + i + '] must be an object.');
          continue;
        }

        const tagId = typeof tag.id === 'string' ? tag.id.trim() : '';
        if (!tagId) {
          errors.push('meta.gameplay.tags[' + i + '].id must be a non-empty string.');
          continue;
        }
        if (gameplayTagIds.has(tagId)) {
          errors.push('meta.gameplay.tags contains duplicate id "' + tagId + '".');
          continue;
        }
        gameplayTagIds.add(tagId);

        if (!isNonEmptyString(tag.label_en)) {
          errors.push('meta.gameplay.tags[' + i + '].label_en is required.');
        }
        if (!isNonEmptyString(tag.label_fr)) {
          errors.push('meta.gameplay.tags[' + i + '].label_fr is required.');
        }

        if (tag.aliases_en !== undefined && !Array.isArray(tag.aliases_en)) {
          errors.push('meta.gameplay.tags[' + i + '].aliases_en must be an array when provided.');
        }
        if (tag.aliases_fr !== undefined && !Array.isArray(tag.aliases_fr)) {
          errors.push('meta.gameplay.tags[' + i + '].aliases_fr must be an array when provided.');
        }
      }
    }

    if (!Array.isArray(gameplayMeta.rules) || gameplayMeta.rules.length === 0) {
      errors.push('meta.gameplay.rules must be a non-empty array.');
    } else {
      for (let i = 0; i < gameplayMeta.rules.length; i++) {
        const rule = gameplayMeta.rules[i];
        if (!rule || typeof rule !== 'object' || Array.isArray(rule)) {
          errors.push('meta.gameplay.rules[' + i + '] must be an object.');
          continue;
        }

        const tag = typeof rule.tag === 'string' ? rule.tag.trim() : '';
        if (!tag) {
          errors.push('meta.gameplay.rules[' + i + '].tag must be a non-empty string.');
          continue;
        }
        if (!gameplayTagIds.has(tag)) {
          errors.push('meta.gameplay.rules[' + i + '].tag references unknown tag "' + tag + '".');
          continue;
        }

        const keywords = normalizeGameplayList(
          []
            .concat(Array.isArray(rule.keywords_en) ? rule.keywords_en : [])
            .concat(Array.isArray(rule.keywords_fr) ? rule.keywords_fr : [])
        );
        if (!keywords.length) {
          errors.push('meta.gameplay.rules[' + i + '] must define at least one keyword in keywords_en or keywords_fr.');
          continue;
        }

        gameplayRules.push({ tag, keywords });
      }
    }

    if (gameplayMeta.tag_overrides !== undefined) {
      if (!gameplayMeta.tag_overrides || typeof gameplayMeta.tag_overrides !== 'object' || Array.isArray(gameplayMeta.tag_overrides)) {
        errors.push('meta.gameplay.tag_overrides must be an object when provided.');
      } else {
        const overrideIds = Object.keys(gameplayMeta.tag_overrides);
        for (let i = 0; i < overrideIds.length; i++) {
          const id = overrideIds[i];
          const tags = gameplayMeta.tag_overrides[id];
          if (!Array.isArray(tags)) {
            errors.push('meta.gameplay.tag_overrides[' + id + '] must be an array.');
            continue;
          }

          const seenTags = new Set();
          const normalizedTags = [];
          for (let j = 0; j < tags.length; j++) {
            const tagId = typeof tags[j] === 'string' ? tags[j].trim() : '';
            if (!tagId) {
              errors.push('meta.gameplay.tag_overrides[' + id + '][' + j + '] must be a non-empty string.');
              continue;
            }
            if (!gameplayTagIds.has(tagId)) {
              errors.push('meta.gameplay.tag_overrides[' + id + '][' + j + '] references unknown tag "' + tagId + '".');
              continue;
            }
            if (seenTags.has(tagId)) {
              errors.push('meta.gameplay.tag_overrides[' + id + '] contains duplicate tag "' + tagId + '".');
              continue;
            }
            seenTags.add(tagId);
            normalizedTags.push(tagId);
          }

          if (normalizedTags.length) gameplayOverrides[String(id)] = normalizedTags;
        }
      }
    }

    if (gameplayTagIds.has('other')) {
      gameplayFallbackTag = 'other';
    } else if (gameplayTagIds.size) {
      gameplayFallbackTag = Array.from(gameplayTagIds)[0];
      warnings.push('meta.gameplay.tags does not include "other"; fallback tag is "' + gameplayFallbackTag + '".');
    }
  }

  if (meta.total_pictos !== pictos.length) {
    errors.push('meta.total_pictos (' + meta.total_pictos + ') does not match pictos.length (' + pictos.length + ').');
  }

  // Validate meta.categories
  const validCategories = new Set();
  if (meta.categories !== undefined) {
    if (!Array.isArray(meta.categories) || meta.categories.length === 0) {
      errors.push('meta.categories must be a non-empty array when provided.');
    } else {
      for (let i = 0; i < meta.categories.length; i++) {
        const cat = meta.categories[i];
        if (!cat || typeof cat !== 'object') {
          errors.push('meta.categories[' + i + '] must be an object.');
          continue;
        }
        if (!isNonEmptyString(cat.id)) {
          errors.push('meta.categories[' + i + '].id must be a non-empty string.');
          continue;
        }
        if (validCategories.has(cat.id)) {
          errors.push('meta.categories contains duplicate id "' + cat.id + '".');
        }
        validCategories.add(cat.id);
        if (!isNonEmptyString(cat.label_en)) errors.push('meta.categories[' + i + '].label_en is required.');
        if (!isNonEmptyString(cat.label_fr)) errors.push('meta.categories[' + i + '].label_fr is required.');
      }
    }
  }

  // Validate meta.obtention_types
  const validObtentionTypes = new Set();
  if (meta.obtention_types !== undefined) {
    if (!Array.isArray(meta.obtention_types) || meta.obtention_types.length === 0) {
      errors.push('meta.obtention_types must be a non-empty array when provided.');
    } else {
      for (let i = 0; i < meta.obtention_types.length; i++) {
        const ot = meta.obtention_types[i];
        if (!ot || typeof ot !== 'object') {
          errors.push('meta.obtention_types[' + i + '] must be an object.');
          continue;
        }
        if (!isNonEmptyString(ot.id)) {
          errors.push('meta.obtention_types[' + i + '].id must be a non-empty string.');
          continue;
        }
        if (validObtentionTypes.has(ot.id)) {
          errors.push('meta.obtention_types contains duplicate id "' + ot.id + '".');
        }
        validObtentionTypes.add(ot.id);
        if (!isNonEmptyString(ot.label_en)) errors.push('meta.obtention_types[' + i + '].label_en is required.');
        if (!isNonEmptyString(ot.label_fr)) errors.push('meta.obtention_types[' + i + '].label_fr is required.');
      }
    }
  }

  const ids = new Set();
  let minId = Infinity;
  let maxId = -Infinity;
  let confirmed = 0;
  let derived = 0;
  let effetFrCount = 0;
  let obtentionFrCount = 0;
  const gameplayUsage = {};
  const categorieUsage = {};
  const obtentionTypeUsage = {};

  function resolveGameplayTagsForPicto(picto) {
    const resolved = [];
    const seen = new Set();

    function addTag(tagId) {
      if (!tagId || !gameplayTagIds.has(tagId) || seen.has(tagId)) return;
      seen.add(tagId);
      resolved.push(tagId);
    }

    if (Array.isArray(picto.tags_gameplay)) {
      for (let i = 0; i < picto.tags_gameplay.length; i++) {
        if (typeof picto.tags_gameplay[i] === 'string') {
          addTag(picto.tags_gameplay[i].trim());
        }
      }
    }

    const override = gameplayOverrides[String(picto.id)];
    if (Array.isArray(override)) {
      for (let i = 0; i < override.length; i++) addTag(override[i]);
    }

    const corpus = normalizeGameplayText(
      [
        picto.nom_en || '',
        picto.nom_fr || '',
        picto.effet_en || '',
        picto.effet_fr || '',
        picto.obtention_en || '',
        picto.obtention_fr || ''
      ].join(' ')
    );
    const padded = ' ' + corpus + ' ';

    for (let i = 0; i < gameplayRules.length; i++) {
      const rule = gameplayRules[i];
      for (let j = 0; j < rule.keywords.length; j++) {
        const keyword = rule.keywords[j];
        if (padded.indexOf(' ' + keyword + ' ') !== -1) {
          addTag(rule.tag);
          break;
        }
      }
    }

    if (!resolved.length && gameplayFallbackTag) {
      addTag(gameplayFallbackTag);
    }

    return resolved;
  }

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

    if (p.tags_gameplay !== undefined) {
      if (!Array.isArray(p.tags_gameplay)) {
        errors.push('id ' + p.id + ': tags_gameplay must be an array when provided.');
      } else {
        const seenTags = new Set();
        for (let j = 0; j < p.tags_gameplay.length; j++) {
          const tagId = typeof p.tags_gameplay[j] === 'string' ? p.tags_gameplay[j].trim() : '';
          if (!tagId) {
            errors.push('id ' + p.id + ': tags_gameplay[' + j + '] must be a non-empty string.');
            continue;
          }
          if (!gameplayTagIds.has(tagId)) {
            errors.push('id ' + p.id + ': tags_gameplay[' + j + '] references unknown tag "' + tagId + '".');
            continue;
          }
          if (seenTags.has(tagId)) {
            errors.push('id ' + p.id + ': tags_gameplay contains duplicate tag "' + tagId + '".');
            continue;
          }
          seenTags.add(tagId);
        }
      }
    }

    const resolvedTags = resolveGameplayTagsForPicto(p);
    if (!resolvedTags.length) {
      errors.push('id ' + p.id + ': no gameplay tag could be resolved (rules/overrides/fallback).');
    } else {
      for (let j = 0; j < resolvedTags.length; j++) {
        gameplayUsage[resolvedTags[j]] = (gameplayUsage[resolvedTags[j]] || 0) + 1;
      }
    }

    // Validate categories (array of 1-2 strings)
    if (p.categories !== undefined) {
      if (!Array.isArray(p.categories) || p.categories.length === 0) {
        errors.push('id ' + p.id + ': categories must be a non-empty array.');
      } else {
        for (let k = 0; k < p.categories.length; k++) {
          if (!isNonEmptyString(p.categories[k])) {
            errors.push('id ' + p.id + ': categories[' + k + '] must be a non-empty string.');
          } else if (validCategories.size && !validCategories.has(p.categories[k])) {
            errors.push('id ' + p.id + ': categories "' + p.categories[k] + '" not in meta.categories.');
          } else {
            categorieUsage[p.categories[k]] = (categorieUsage[p.categories[k]] || 0) + 1;
          }
        }
      }
    }

    // Validate obtention_type
    if (p.obtention_type !== undefined) {
      if (!isNonEmptyString(p.obtention_type)) {
        errors.push('id ' + p.id + ': obtention_type must be a non-empty string when provided.');
      } else if (validObtentionTypes.size && !validObtentionTypes.has(p.obtention_type)) {
        errors.push('id ' + p.id + ': obtention_type "' + p.obtention_type + '" is not declared in meta.obtention_types.');
      } else {
        obtentionTypeUsage[p.obtention_type] = (obtentionTypeUsage[p.obtention_type] || 0) + 1;
      }
    }

    // Validate source_endgame
    if (p.source_endgame !== undefined && typeof p.source_endgame !== 'boolean') {
      errors.push('id ' + p.id + ': source_endgame must be a boolean when provided.');
    }

    // Validate source_boss
    if (p.source_boss !== undefined && !isNonEmptyString(p.source_boss)) {
      errors.push('id ' + p.id + ': source_boss must be a non-empty string when provided.');
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

  if (gameplayTagIds.size) {
    const coverage = Object.keys(gameplayUsage)
      .sort()
      .map(function (tagId) { return tagId + '=' + gameplayUsage[tagId]; })
      .join(', ');
    warnings.push('Gameplay tags coverage: ' + (coverage || 'none') + '.');
  }

  // Report categories coverage (multi-category: count pictos, not assignments)
  if (validCategories.size) {
    const catCoverage = Object.keys(categorieUsage)
      .sort()
      .map(function (k) { return k + '=' + categorieUsage[k]; })
      .join(', ');
    let pictosWithCat = 0;
    for (let i = 0; i < pictos.length; i++) {
      if (Array.isArray(pictos[i].categories) && pictos[i].categories.length) pictosWithCat++;
    }
    warnings.push('Categories coverage: ' + pictosWithCat + '/' + pictos.length + ' pictos (' + (catCoverage || 'none') + ').');
  }

  // Report obtention_type coverage
  if (validObtentionTypes.size) {
    const obtCoverage = Object.keys(obtentionTypeUsage)
      .sort()
      .map(function (k) { return k + '=' + obtentionTypeUsage[k]; })
      .join(', ');
    const obtTotal = Object.values(obtentionTypeUsage).reduce(function (a, b) { return a + b; }, 0);
    warnings.push('Obtention type coverage: ' + obtTotal + '/' + pictos.length + ' (' + (obtCoverage || 'none') + ').');
  }

  // Report endgame/boss coverage
  let endgameCount = 0;
  let bossCount = 0;
  for (let i = 0; i < pictos.length; i++) {
    if (pictos[i].source_endgame === true) endgameCount++;
    if (isNonEmptyString(pictos[i].source_boss)) bossCount++;
  }
  if (endgameCount || bossCount) {
    warnings.push('Endgame coverage: ' + endgameCount + '/' + pictos.length + ', Boss drops: ' + bossCount + '/' + pictos.length + '.');
  }

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
