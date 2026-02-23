// © 2026 Nicolas Markiewicz (DwarfDog) — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  I18N — Détection de langue et fonctions de traduction
//  Dépend de : App (app.js), App.langs (lang/*.js)
// ══════════════════════════════════════════════════════

/**
 * Détecte la langue préférée de l'utilisateur.
 * Priorité : localStorage > navigator.language > DEFAULT_LANG
 */
App.detecterLangue = function () {
  var saved = localStorage.getItem(App.LANG_STORAGE_KEY);
  if (saved && App.SUPPORTED_LANGS.indexOf(saved) !== -1) return saved;
  var nav = (navigator.language || navigator.userLanguage || '').slice(0, 2).toLowerCase();
  return App.SUPPORTED_LANGS.indexOf(nav) !== -1 ? nav : App.DEFAULT_LANG;
};

/**
 * Traduit une clé UI avec interpolation de paramètres.
 * @param {string} key   - Clé de traduction (ex: 'toast_copied')
 * @param {Object} [params] - Paramètres à injecter (ex: { n: 5 })
 * @returns {string}
 */
App.t = function (key, params) {
  var str = (App.langs[App.LANG] && App.langs[App.LANG][key])
         || (App.langs[App.DEFAULT_LANG] && App.langs[App.DEFAULT_LANG][key])
         || key;
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, function (_, k) {
    return params[k] !== undefined ? params[k] : '{' + k + '}';
  });
};

/**
 * Récupère un champ localisé d'un picto avec fallback.
 * Ex: champ(picto, 'nom') → picto.nom_fr ou picto.nom_en
 * @param {Object} picto - Objet picto issu de DATA.pictos
 * @param {string} field - Préfixe du champ (ex: 'nom', 'effet', 'localisation')
 * @returns {string}
 */
App.champ = function (picto, field) {
  var localized = picto[field + '_' + App.LANG];
  if (localized !== undefined && localized !== '') return localized;
  var fallback = picto[field + '_' + App.DEFAULT_LANG];
  if (fallback !== undefined && fallback !== '') return fallback;
  // Dernier recours : essayer toutes les langues supportées
  for (var i = 0; i < App.SUPPORTED_LANGS.length; i++) {
    var val = picto[field + '_' + App.SUPPORTED_LANGS[i]];
    if (val !== undefined && val !== '') return val;
  }
  return '';
};

/**
 * Change la langue courante, persiste le choix et re-rend l'UI.
 * @param {string} nouvelleLang - Code langue ('fr', 'en', etc.)
 */
App.changerLangue = function (nouvelleLang) {
  if (App.SUPPORTED_LANGS.indexOf(nouvelleLang) === -1) return;
  App.LANG = nouvelleLang;
  localStorage.setItem(App.LANG_STORAGE_KEY, App.LANG);
  document.documentElement.lang = App.LANG;
  App.appliquerTraductions();
  App.mettreAJourCartesTexte();
  App.appliquerTri();
  App.mettreAJourProgression();
};

/**
 * Retourne les labels de stats traduits.
 * @returns {Object} ex: { sante: { label: 'Santé', classe: 'sante', icone: '♥' }, ... }
 */
App.getStatLabels = function () {
  return {
    sante:        { label: App.t('stat_health'),  classe: 'sante',   icone: '♥' },
    defense:      { label: App.t('stat_defense'), classe: 'defense', icone: '⛨' },
    vitesse:      { label: App.t('stat_speed'),   classe: 'vitesse', icone: '⚡' },
    chances_crit: { label: App.t('stat_crit'),    classe: 'crit',    icone: '✦' },
  };
};
