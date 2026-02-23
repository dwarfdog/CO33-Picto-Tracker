// © 2026 Nicolas Markiewicz (DwarfDog) — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  STATE — État applicatif et persistance localStorage
//  Dépend de : App (app.js), DATA (skills-data.js)
// ══════════════════════════════════════════════════════

App.etat = {
  possedes: new Set(),
  filtreCollection: 'tous', // 'tous' | 'possedes' | 'manquants'
  filtreZone: '',
  recherche: '',
  tri: 'id-asc',
  pictoOuvert: null,
};

/**
 * Charge la progression depuis localStorage.
 * Purge automatiquement les IDs qui n'existent plus dans DATA.
 */
App.chargerSauvegarde = function () {
  try {
    var raw = localStorage.getItem(App.STORAGE_KEY);
    if (raw) {
      var ids = JSON.parse(raw);
      if (Array.isArray(ids)) {
        var idsValides = new Set(DATA.pictos.map(function (p) { return p.id; }));
        var purged = false;
        ids.forEach(function (id) {
          if (idsValides.has(id)) {
            App.etat.possedes.add(id);
          } else {
            purged = true;
          }
        });
        if (purged) App.sauvegarder();
      }
    }
  } catch (e) {
    console.warn('Impossible de lire la sauvegarde:', e);
  }
};

/**
 * Sauvegarde la progression dans localStorage.
 */
App.sauvegarder = function () {
  try {
    localStorage.setItem(App.STORAGE_KEY, JSON.stringify([].concat(Array.from(App.etat.possedes))));
  } catch (e) {
    console.warn('Impossible de sauvegarder:', e);
    if (typeof App.afficherToast === 'function') {
      App.afficherToast(App.t('toast_save_error'), true);
    }
  }
};
