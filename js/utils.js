// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  UTILS — Fonctions utilitaires pures
//  Dépend de : App (app.js)
// ══════════════════════════════════════════════════════

/**
 * Formate la valeur d'une statistique pour l'affichage.
 * @param {string} key - Clé de la stat (ex: 'chances_crit')
 * @param {*} val      - Valeur brute
 * @returns {string}   - Valeur formatée (ex: '12 %', '+5')
 */
App.formatStatVal = function (key, val) {
  var v = parseFloat(val);
  if (isNaN(v)) return val;
  if (key === 'chances_crit') return Math.round(v * 100) + ' %';
  return '+' + v;
};

/**
 * Normalise un texte pour la recherche : minuscules, sans accents.
 * @param {string} str
 * @returns {string}
 */
App.normaliserTexte = function (str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

/**
 * Crée une version debounce d'une fonction.
 * @param {Function} fn    - Fonction à temporiser
 * @param {number}   delay - Délai en ms
 * @returns {Function}
 */
App.debounce = function (fn, delay) {
  var timer;
  return function () {
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () { fn.apply(null, args); }, delay);
  };
};
