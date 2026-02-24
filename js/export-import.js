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
 * Parse une chaîne d'import (base64 ou JSON) et retourne les IDs.
 * @param {string} code - Code à parser
 * @returns {number[]|null} Tableau d'IDs ou null si format invalide
 */
App.parseImportData = function (code) {
  var trimmed = code.trim();

  // Tentative 1 : base64
  try {
    var decoded = JSON.parse(atob(trimmed));
    if (Array.isArray(decoded)) return decoded;
  } catch (e) { /* pas du base64 valide */ }

  // Tentative 2 : JSON brut
  try {
    var json = JSON.parse(trimmed);
    // Format v2 : { possedes: [...] }
    if (json && json.possedes && Array.isArray(json.possedes)) return json.possedes;
    // Format v3 stockage global : { profils: [...], profil_actif: ... }
    if (json && Array.isArray(json.profils)) {
      var profilSource = null;
      if (typeof json.profil_actif === 'string') {
        for (var i = 0; i < json.profils.length; i++) {
          if (json.profils[i] && json.profils[i].id === json.profil_actif) {
            profilSource = json.profils[i];
            break;
          }
        }
      }
      if (!profilSource && json.profils.length) {
        profilSource = json.profils[0];
      }
      if (profilSource && Array.isArray(profilSource.possedes)) return profilSource.possedes;
    }
    // Format tableau brut
    if (Array.isArray(json)) return json;
  } catch (e2) { /* pas du JSON valide */ }

  return null;
};

/**
 * Valide et applique un tableau d'IDs importés.
 * Utilise le cache App._idsValides pour validation O(1).
 * @param {number[]} ids
 * @returns {boolean} true si l'import a réussi
 */
App.appliquerImport = function (ids) {
  if (!Array.isArray(ids) || !ids.every(function (id) {
    return typeof id === 'number' && App._idsValides.has(id);
  })) {
    App.afficherToast(App.t('toast_invalid_data'), true);
    return false;
  }
  App.etat.possedes.clear();
  ids.forEach(function (id) { App.etat.possedes.add(id); });
  App.sauvegarder();
  App.rafraichirEtatCartes();
  App.mettreAJourProgression();
  App.appliquerTri();
  App.appliquerFiltres();

  if (App.etat.pictoOuvert && typeof App.ouvrirTooltip === 'function') {
    var picto = App.getPictoById(App.etat.pictoOuvert);
    if (picto) App.ouvrirTooltip(picto);
  }

  return true;
};

/**
 * Décode et importe un code (base64 ou JSON brut).
 * Utilise parseImportData pour un parsing consolidé.
 * @param {string} code
 * @returns {boolean} true si l'import a réussi
 */
App.importerDepuisCode = function (code) {
  var ids = App.parseImportData(code);
  if (ids === null) {
    App.afficherToast(App.t('toast_invalid_code'), true);
    return false;
  }
  if (App.appliquerImport(ids)) {
    App.afficherToast(App.t('toast_imported', { n: App.etat.possedes.size }));
    return true;
  }
  return false;
};

/**
 * Ouvre la modal d'import.
 */
App.ouvrirImportModal = function () {
  var textarea = document.getElementById('import-textarea');
  textarea.value = '';
  App.ouvrirModal(document.getElementById('import-overlay'), textarea);
};

/**
 * Ferme la modal d'import.
 */
App.fermerImportModal = function () {
  App.fermerModal(document.getElementById('import-overlay'));
};

/**
 * Ouvre la modal d'export avec le code base64 pré-rempli.
 */
App.ouvrirExportModal = function () {
  var code = App.genererCodeExport();
  var textarea = document.getElementById('export-textarea');
  textarea.value = code;
  App.ouvrirModal(document.getElementById('export-overlay'), textarea);
  textarea.select();
};

/**
 * Ferme la modal d'export.
 */
App.fermerExportModal = function () {
  App.fermerModal(document.getElementById('export-overlay'));
};
