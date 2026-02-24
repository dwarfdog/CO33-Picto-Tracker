// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  DATASET CHANGES — Vue des ajouts/modifs entre versions
//  Dépend de : App (app.js), DATA (skills-data.js)
// ══════════════════════════════════════════════════════

/**
 * Normalise la meta changelog du dataset.
 * @returns {{fromDataset:string,fromGame:string,addedIds:number[],updated:Array<{id:number,fields:string[]}>,removedIds:number[],noteEn:string,noteFr:string}}
 */
App.getDatasetChangesMeta = function () {
  var meta = (typeof DATA !== 'undefined' && DATA.meta) ? DATA.meta : {};
  var raw = (meta && meta.changes && typeof meta.changes === 'object') ? meta.changes : {};

  function uniqueSortedIds(value) {
    if (!Array.isArray(value)) return [];
    var set = new Set();
    value.forEach(function (id) {
      if (typeof id === 'number' && isFinite(id) && id > 0) set.add(id);
    });
    return Array.from(set).sort(function (a, b) { return a - b; });
  }

  function normalizeUpdated(value) {
    if (!Array.isArray(value)) return [];
    var out = [];
    var seen = new Set();

    value.forEach(function (entry) {
      var id = null;
      var fields = [];

      if (typeof entry === 'number' && isFinite(entry) && entry > 0) {
        id = entry;
      } else if (entry && typeof entry === 'object') {
        if (typeof entry.id === 'number' && isFinite(entry.id) && entry.id > 0) {
          id = entry.id;
        }
        if (Array.isArray(entry.fields)) {
          fields = entry.fields.filter(function (f) { return typeof f === 'string' && f.trim() !== ''; });
        }
      }

      if (!id || seen.has(id)) return;
      seen.add(id);

      var fieldSet = new Set(fields.map(function (f) { return f.trim(); }));
      out.push({
        id: id,
        fields: Array.from(fieldSet).sort()
      });
    });

    out.sort(function (a, b) { return a.id - b.id; });
    return out;
  }

  return {
    fromDataset: typeof raw.from_dataset_version === 'string' ? raw.from_dataset_version : '',
    fromGame: typeof raw.from_game_version === 'string' ? raw.from_game_version : '',
    addedIds: uniqueSortedIds(raw.added_ids),
    updated: normalizeUpdated(raw.updated),
    removedIds: uniqueSortedIds(raw.removed_ids),
    noteEn: typeof raw.note_en === 'string' ? raw.note_en : '',
    noteFr: typeof raw.note_fr === 'string' ? raw.note_fr : ''
  };
};

/**
 * Retourne un label lisible pour un champ modifié.
 * @param {string} field
 * @returns {string}
 */
App.formatDatasetChangeField = function (field) {
  if (!field) return App.t('dataset_change_field_other', { field: '?' });

  var key = field;
  var suffixMatch = key.match(/^(.*)_([a-z0-9]+)$/i);
  if (suffixMatch) key = suffixMatch[1];

  switch (key) {
    case 'nom': return App.t('dataset_change_field_name');
    case 'effet': return App.t('dataset_change_field_effect');
    case 'zone': return App.t('dataset_change_field_zone');
    case 'flag': return App.t('dataset_change_field_flag');
    case 'obtention': return App.t('dataset_change_field_obtain');
    case 'lumina': return App.t('dataset_change_field_lumina');
    case 'statistiques': return App.t('dataset_change_field_stats');
    case 'traduction_confirmee': return App.t('dataset_change_field_translation');
    default: return App.t('dataset_change_field_other', { field: field });
  }
};

/**
 * Rend la vue des nouveautes dataset.
 */
App.rendreNouveautesDataset = function () {
  if (typeof document === 'undefined') return;

  var section = document.getElementById('dataset-changes');
  if (!section) return;

  var titleEl = document.getElementById('dataset-changes-title');
  var metaEl = document.getElementById('dataset-changes-meta');
  var noteEl = document.getElementById('dataset-changes-note');
  var addedTitleEl = document.getElementById('dataset-changes-added-title');
  var updatedTitleEl = document.getElementById('dataset-changes-updated-title');
  var removedTitleEl = document.getElementById('dataset-changes-removed-title');
  var addedListEl = document.getElementById('dataset-changes-added-list');
  var updatedListEl = document.getElementById('dataset-changes-updated-list');
  var removedListEl = document.getElementById('dataset-changes-removed-list');

  var meta = (typeof DATA !== 'undefined' && DATA.meta) ? DATA.meta : {};
  var currentDataset = meta.dataset_version || 'n/a';
  var currentGame = meta.game_version || 'n/a';
  var changes = App.getDatasetChangesMeta();

  titleEl.textContent = App.t('dataset_changes_title');
  metaEl.textContent = App.t('dataset_changes_meta_line', {
    fromDataset: changes.fromDataset || 'n/a',
    fromGame: changes.fromGame || 'n/a',
    toDataset: currentDataset,
    toGame: currentGame
  });

  var localizedNote = App.LANG === 'fr'
    ? (changes.noteFr || changes.noteEn)
    : (changes.noteEn || changes.noteFr);
  noteEl.textContent = localizedNote || App.t('dataset_changes_note_fallback');

  addedTitleEl.textContent = App.t('dataset_changes_added_title', { n: changes.addedIds.length });
  updatedTitleEl.textContent = App.t('dataset_changes_updated_title', { n: changes.updated.length });
  removedTitleEl.textContent = App.t('dataset_changes_removed_title', { n: changes.removedIds.length });

  function clearList(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function appendEmpty(el) {
    var li = document.createElement('li');
    li.className = 'dataset-changes-empty';
    li.textContent = App.t('dataset_changes_none');
    el.appendChild(li);
  }

  clearList(addedListEl);
  clearList(updatedListEl);
  clearList(removedListEl);

  if (!changes.addedIds.length) {
    appendEmpty(addedListEl);
  } else {
    changes.addedIds.forEach(function (id) {
      var li = document.createElement('li');
      var picto = App.getPictoById(id);
      var nom = picto ? App.champ(picto, 'nom') : App.t('dataset_changes_unknown_picto');
      var cost = 0;
      if (picto) {
        if (typeof App.getLuminaCost === 'function') {
          cost = App.getLuminaCost(picto);
        } else {
          var parsed = parseInt(picto.lumina, 10);
          cost = isFinite(parsed) && parsed > 0 ? parsed : 0;
        }
      }
      li.textContent = '#' + id + ' - ' + nom + ' (' + App.t('dataset_changes_lumina_tag', { n: cost }) + ')';
      addedListEl.appendChild(li);
    });
  }

  if (!changes.updated.length) {
    appendEmpty(updatedListEl);
  } else {
    changes.updated.forEach(function (entry) {
      var li = document.createElement('li');
      var picto = App.getPictoById(entry.id);
      var nom = picto ? App.champ(picto, 'nom') : App.t('dataset_changes_unknown_picto');
      var labels = entry.fields.map(function (f) { return App.formatDatasetChangeField(f); });
      var fieldsText = labels.length ? labels.join(', ') : App.t('dataset_changes_unknown_fields');
      li.textContent = '#' + entry.id + ' - ' + nom + ' · ' + fieldsText;
      updatedListEl.appendChild(li);
    });
  }

  if (!changes.removedIds.length) {
    appendEmpty(removedListEl);
  } else {
    changes.removedIds.forEach(function (id) {
      var li = document.createElement('li');
      li.textContent = '#' + id;
      removedListEl.appendChild(li);
    });
  }
};
