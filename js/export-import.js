// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  EXPORT / IMPORT — Gestion de l'export et de l'import
//  Dépend de : App (app.js), DATA (skills-data.js)
// ══════════════════════════════════════════════════════

/**
 * Affiche un toast de notification.
 * Utilise le cache DOM (App._dom) et aria-live pour l'accessibilité.
 * @param {string}  message - Texte à afficher
 * @param {boolean} [erreur=false] - Style erreur si true
 */
App.afficherToast = function (message, erreur) {
  if (typeof document === 'undefined') return;

  var toast = App._dom.toast || document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = 'toast' + (erreur ? ' erreur' : '');
  requestAnimationFrame(function () { toast.classList.add('visible'); });
  setTimeout(function () { toast.classList.remove('visible'); }, App.TOAST_DURATION);
};

/**
 * Génère un code d'export en base64.
 * @returns {string}
 */
App.genererCodeExport = function () {
  var ids = Array.from(App.etat.possedes).sort(function (a, b) { return a - b; });
  return btoa(JSON.stringify(ids));
};

/**
 * Exporte la progression en ouvrant la modal d'export.
 */
App.exporterProgression = function () {
  App.ouvrirExportModal();
};

/**
 * Télécharge la progression en fichier JSON au format v2.
 * Le format est extensible pour accueillir les futures données.
 */
App.telechargerFichier = function () {
  var profil = typeof App.getProfilActif === 'function' ? App.getProfilActif() : null;
  var profilNom = profil ? profil.nom : '';
  var profilId = profil ? profil.id : '';

  var data = {
    version: App.STORAGE_VERSION,
    date: new Date().toISOString(),
    profil: {
      id: profilId,
      nom: profilNom
    },
    possedes: Array.from(App.etat.possedes).sort(function (a, b) { return a - b; }),
    build_lumina: Array.from(App.etat.buildLumina || []).sort(function (a, b) { return a - b; }),
    budget_lumina: App.etat.luminaBudget || 0,
    maitrise: App.etat.maitrise || {},
    niveaux: App.etat.niveaux || {},
    ng_cycle: App.etat.ngCycle || 0,
    total: App.etat.possedes.size,
  };

  var profilSlug = (profilNom || 'profile')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'profile';

  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'co33-pictos-' + profilSlug + '-' + data.total + '-' + DATA.pictos.length + '.json';
  a.click();
  URL.revokeObjectURL(url);
  App.afficherToast(App.t('toast_downloaded', { n: data.total }));
};

/**
 * Télécharge un fichier JSON contenant tous les profils.
 */
App.telechargerTousProfils = function () {
  var data = {
    version: App.STORAGE_VERSION,
    date: new Date().toISOString(),
    profil_actif: App.etat.profilActifId,
    profils: App.etat.profils.map(function (p) {
      return {
        id: p.id,
        nom: p.nom,
        possedes: Array.from(p.possedes).sort(function (a, b) { return a - b; }),
        build_lumina: Array.from(p.buildLumina).sort(function (a, b) { return a - b; }),
        budget_lumina: p.budgetLumina,
        maitrise: p.maitrise || {},
        niveaux: p.niveaux || {},
        ng_cycle: p.ngCycle || 0
      };
    }),
    total_pictos: DATA.pictos.length
  };

  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'co33-pictos-all-profiles-' + data.profils.length + 'p.json';
  a.click();
  URL.revokeObjectURL(url);
  App.afficherToast(App.t('toast_imported_profiles', { n: data.profils.length }));
};

/**
 * Importe tous les profils depuis un payload multi-profils.
 * @param {string} code - Code JSON brut ou base64
 * @returns {boolean}
 */
App.importerTousProfils = function (code) {
  var payload = App.parseImportPayload(code);
  if (!payload) {
    App.afficherToast(App.t('toast_invalid_code'), true);
    return false;
  }

  // Si le payload contient des profils multiples (JSON brut)
  var trimmed = code.trim();
  var parsed = null;
  try { parsed = JSON.parse(trimmed); } catch (e) {
    try { parsed = JSON.parse(atob(trimmed)); } catch (e2) { /* ignore */ }
  }

  if (parsed && Array.isArray(parsed.profils) && parsed.profils.length) {
    App.etat.profils = [];
    parsed.profils.forEach(function (entry) {
      if (!entry || typeof entry !== 'object') return;
      App.ajouterProfil({
        id: entry.id,
        nom: entry.nom,
        possedes: entry.possedes || [],
        build_lumina: entry.build_lumina || entry.buildLumina || [],
        budget_lumina: entry.budget_lumina !== undefined ? entry.budget_lumina : (entry.budgetLumina || 0),
        maitrise: entry.maitrise || {},
        niveaux: entry.niveaux || {},
        ng_cycle: entry.ng_cycle || 0
      });
    });
    if (typeof parsed.profil_actif === 'string') {
      App.etat.profilActifId = parsed.profil_actif;
    }
    App.assurerProfils();
    App.activerProfil(App.etat.profilActifId, { silentToast: true });
    App.sauvegarder();
    App.afficherToast(App.t('toast_imported_profiles', { n: App.etat.profils.length }));
    return true;
  }

  // Fallback : import mono-profil classique
  return App.importerDepuisCode(code);
};

/**
 * Parse une chaîne d'import (base64 ou JSON) en payload normalisé.
 * @param {string} code - Code à parser
 * @returns {{possedes:number[], buildLumina:number[]|null, budgetLumina:number|null}|null}
 */
App.parseImportPayload = function (code) {
  var trimmed = code.trim();

  function fromJsonPayload(json) {
    if (Array.isArray(json)) {
      return { possedes: json, buildLumina: null, budgetLumina: null };
    }

    if (!json || typeof json !== 'object') return null;

    if (Array.isArray(json.possedes)) {
      var buildLumina = null;
      if (Array.isArray(json.build_lumina)) buildLumina = json.build_lumina;
      else if (Array.isArray(json.buildLumina)) buildLumina = json.buildLumina;

      var budgetLumina = null;
      if (json.budget_lumina !== undefined) budgetLumina = json.budget_lumina;
      else if (json.budgetLumina !== undefined) budgetLumina = json.budgetLumina;
      else if (json.lumina_budget !== undefined) budgetLumina = json.lumina_budget;

      return {
        possedes: json.possedes,
        buildLumina: buildLumina,
        budgetLumina: budgetLumina
      };
    }

    if (Array.isArray(json.profils)) {
      var profilSource = null;
      if (typeof json.profil_actif === 'string') {
        for (var i = 0; i < json.profils.length; i++) {
          if (json.profils[i] && json.profils[i].id === json.profil_actif) {
            profilSource = json.profils[i];
            break;
          }
        }
      }
      if (!profilSource && json.profils.length) profilSource = json.profils[0];
      if (!profilSource || !Array.isArray(profilSource.possedes)) return null;

      return {
        possedes: profilSource.possedes,
        buildLumina: Array.isArray(profilSource.build_lumina)
          ? profilSource.build_lumina
          : (Array.isArray(profilSource.buildLumina) ? profilSource.buildLumina : null),
        budgetLumina: profilSource.budget_lumina !== undefined
          ? profilSource.budget_lumina
          : (profilSource.budgetLumina !== undefined ? profilSource.budgetLumina : null)
      };
    }

    return null;
  }

  // Tentative 1 : base64
  try {
    var decoded = JSON.parse(atob(trimmed));
    var payloadFromB64 = fromJsonPayload(decoded);
    if (payloadFromB64) return payloadFromB64;
  } catch (e) { /* pas du base64 valide */ }

  // Tentative 2 : JSON brut
  try {
    var payloadFromJson = fromJsonPayload(JSON.parse(trimmed));
    if (payloadFromJson) return payloadFromJson;
  } catch (e2) { /* pas du JSON valide */ }

  return null;
};

/**
 * Parse une chaîne d'import (base64 ou JSON) et retourne les IDs possédés.
 * @param {string} code
 * @returns {number[]|null}
 */
App.parseImportData = function (code) {
  var payload = App.parseImportPayload(code);
  return payload ? payload.possedes : null;
};

/**
 * Valide et applique un tableau d'IDs importés.
 * Utilise le cache App._idsValides pour validation O(1).
 * @param {number[]} ids
 * @param {{buildLumina?:number[]|null,budgetLumina?:number|null}} [options]
 * @returns {boolean} true si l'import a réussi
 */
App.appliquerImport = function (ids, options) {
  var opts = options || {};

  if (!Array.isArray(ids) || !ids.every(function (id) {
    return typeof id === 'number' && App._idsValides.has(id);
  })) {
    App.afficherToast(App.t('toast_invalid_data'), true);
    return false;
  }

  if (opts.buildLumina !== null && opts.buildLumina !== undefined) {
    if (!Array.isArray(opts.buildLumina) || !opts.buildLumina.every(function (id) {
      return typeof id === 'number' && App._idsValides.has(id);
    })) {
      App.afficherToast(App.t('toast_invalid_data'), true);
      return false;
    }
  }

  App.etat.possedes.clear();
  ids.forEach(function (id) { App.etat.possedes.add(id); });

  if (opts.buildLumina !== null && opts.buildLumina !== undefined) {
    App.etat.buildLumina.clear();
    opts.buildLumina.forEach(function (id) { App.etat.buildLumina.add(id); });
  }

  if (opts.budgetLumina !== null && opts.budgetLumina !== undefined) {
    var budget = App.normaliserBudgetLumina(opts.budgetLumina).value;
    App.etat.luminaBudget = budget;
    var profil = App.getProfilActif();
    if (profil) profil.budgetLumina = budget;
  }

  App.rafraichirComplet();

  return true;
};

/**
 * Décode et importe un code (base64 ou JSON brut).
 * Utilise parseImportData pour un parsing consolidé.
 * @param {string} code
 * @returns {boolean} true si l'import a réussi
 */
App.importerDepuisCode = function (code) {
  var payload = App.parseImportPayload(code);
  if (payload === null) {
    App.afficherToast(App.t('toast_invalid_code'), true);
    return false;
  }
  if (App.appliquerImport(payload.possedes, {
    buildLumina: payload.buildLumina,
    budgetLumina: payload.budgetLumina
  })) {
    App.afficherToast(App.t('toast_imported', { n: App.etat.possedes.size }));
    return true;
  }
  return false;
};

/**
 * Ouvre la modal d'import.
 */
App.ouvrirImportModal = function () {
  var dom = App._dom;
  var textarea = dom.importTextarea || document.getElementById('import-textarea');
  if (textarea) textarea.value = '';
  App.ouvrirModal(dom.importOverlay || document.getElementById('import-overlay'), textarea);
};

/**
 * Ferme la modal d'import.
 */
App.fermerImportModal = function () {
  App.fermerModal(App._dom.importOverlay || document.getElementById('import-overlay'));
};

/**
 * Ouvre la modal d'export avec le code base64 pré-rempli.
 */
App.ouvrirExportModal = function () {
  var dom = App._dom;
  var code = App.genererCodeExport();
  var textarea = dom.exportTextarea || document.getElementById('export-textarea');
  if (textarea) {
    textarea.value = code;
  }
  App.ouvrirModal(dom.exportOverlay || document.getElementById('export-overlay'), textarea);
  if (textarea) textarea.select();
};

/**
 * Ferme la modal d'export.
 */
App.fermerExportModal = function () {
  App.fermerModal(App._dom.exportOverlay || document.getElementById('export-overlay'));
};
