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
  var toast = App._dom.toast || document.getElementById('toast');
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
  var data = {
    version: App.STORAGE_VERSION,
    date: new Date().toISOString(),
    possedes: Array.from(App.etat.possedes).sort(function (a, b) { return a - b; }),
    total: App.etat.possedes.size,
  };
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'co33-pictos-' + data.total + '-' + DATA.pictos.length + '.json';
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
  App.toutes_cartes.forEach(function (c) {
    var id = parseInt(c.dataset.id);
    c.classList.toggle('possede', App.etat.possedes.has(id));
  });
  App.mettreAJourProgression();
  App.appliquerTri();
  App.appliquerFiltres();
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
  document.getElementById('import-textarea').value = '';
  document.getElementById('import-overlay').classList.add('visible');
  document.body.style.overflow = 'hidden';
  document.getElementById('import-textarea').focus();
};

/**
 * Ferme la modal d'import.
 */
App.fermerImportModal = function () {
  document.getElementById('import-overlay').classList.remove('visible');
  document.body.style.overflow = '';
};

/**
 * Ouvre la modal d'export avec le code base64 pré-rempli.
 */
App.ouvrirExportModal = function () {
  var code = App.genererCodeExport();
  var textarea = document.getElementById('export-textarea');
  textarea.value = code;
  document.getElementById('export-overlay').classList.add('visible');
  document.body.style.overflow = 'hidden';
  textarea.select();
};

/**
 * Ferme la modal d'export.
 */
App.fermerExportModal = function () {
  document.getElementById('export-overlay').classList.remove('visible');
  document.body.style.overflow = '';
};
