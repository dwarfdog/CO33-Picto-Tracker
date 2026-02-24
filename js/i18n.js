// © 2026 DwarfDog — MIT License
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
  var nav = (navigator.language || '').slice(0, 2).toLowerCase();
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
  // Ultime fallback : champ nu (ex: 'zone' sans suffixe de langue)
  var bare = picto[field];
  if (bare !== undefined && bare !== '') return bare;
  return '';
};

/**
 * Change la langue courante, persiste le choix et re-rend l'UI.
 * Met à jour les caches dépendant de la langue (statLabels, searchIndex).
 * @param {string} nouvelleLang - Code langue ('fr', 'en', etc.)
 */
App.changerLangue = function (nouvelleLang) {
  if (App.SUPPORTED_LANGS.indexOf(nouvelleLang) === -1) return;
  App.LANG = nouvelleLang;
  localStorage.setItem(App.LANG_STORAGE_KEY, App.LANG);
  document.documentElement.lang = App.LANG;

  // Invalider et reconstruire les caches dépendant de la langue
  App._cachedStatLabels = App.getStatLabels();
  App.buildSearchIndex();

  App.appliquerTraductions();
  App.mettreAJourCartesTexte();
  App.appliquerTri();
  App.mettreAJourProgression();

  // Rafraîchir le contenu du tooltip si ouvert (pictoOuvert = ID)
  if (App.etat.pictoOuvert) {
    var picto = App.getPictoById(App.etat.pictoOuvert);
    if (picto) App.ouvrirTooltip(picto);
  }
};

/**
 * Retourne les labels de stats traduits.
 * Utilise le cache si disponible (invalidé par changerLangue).
 * @returns {Object} ex: { sante: { label: 'Santé', classe: 'sante', icone: '♥' }, ... }
 */
App.getStatLabels = function () {
  return {
    sante: { label: App.t('stat_health'), classe: 'sante', icone: '\u2665' },
    defense: { label: App.t('stat_defense'), classe: 'defense', icone: '\u26E8' },
    vitesse: { label: App.t('stat_speed'), classe: 'vitesse', icone: '\u26A1' },
    chances_crit: { label: App.t('stat_crit'), classe: 'crit', icone: '\u2726' },
  };
};
