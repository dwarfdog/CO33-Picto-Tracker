// © 2026 DwarfDog — MIT License
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
  pictoOuvert: null, // ID du picto ouvert (number | null)
};

/**
 * Construit les caches de données au boot.
 * - App._idsValides : Set d'IDs valides pour validation rapide
 * - App._pictoParId : Map pour lookup O(1) par ID
 */
App.construireCaches = function () {
  App._idsValides = new Set();
  App._pictoParId = new Map();
  DATA.pictos.forEach(function (p) {
    App._idsValides.add(p.id);
    App._pictoParId.set(p.id, p);
  });
};

/**
 * Retourne un objet picto par son ID.
 * @param {number} id
 * @returns {Object|undefined}
 */
App.getPictoById = function (id) {
  return App._pictoParId ? App._pictoParId.get(id) : undefined;
};

/**
 * Charge la progression depuis localStorage.
 * Supporte le format v1 (tableau brut) et v2 (objet versionné).
 * Purge automatiquement les IDs qui n'existent plus dans DATA.
 */
App.chargerSauvegarde = function () {
  try {
    var raw = localStorage.getItem(App.STORAGE_KEY);
    if (!raw) return;

    var parsed = JSON.parse(raw);
    var ids;
    var needsMigration = false;

    // Détection du format : v1 (Array) vs v2 (Object avec version)
    if (Array.isArray(parsed)) {
      // Format v1 — migration automatique vers v2
      ids = parsed;
      needsMigration = true;
    } else if (parsed && typeof parsed === 'object' && parsed.version) {
      // Format v2+
      ids = parsed.possedes || [];
    } else {
      return;
    }

    if (!Array.isArray(ids)) return;

    var purged = false;
    ids.forEach(function (id) {
      if (App._idsValides.has(id)) {
        App.etat.possedes.add(id);
      } else {
        purged = true;
      }
    });

    // Re-sauvegarder en v2 si migration depuis v1 ou purge effectuée
    if (purged || needsMigration) {
      App.sauvegarder();
    }
  } catch (e) {
    console.warn('Impossible de lire la sauvegarde:', e);
  }
};

/**
 * Sauvegarde la progression dans localStorage au format v2.
 * Format : { version: 2, possedes: [1, 2, 5, ...] }
 * Extensible pour accueillir de futures données (maîtrise, niveaux, etc.)
 */
App.sauvegarder = function () {
  try {
    var data = {
      version: App.STORAGE_VERSION,
      possedes: Array.from(App.etat.possedes).sort(function (a, b) { return a - b; })
    };
    localStorage.setItem(App.STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Impossible de sauvegarder:', e);
    if (typeof App.afficherToast === 'function') {
      App.afficherToast(App.t('toast_save_error'), true);
    }
  }
};
