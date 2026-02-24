// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  UTILS — Fonctions utilitaires pures
//  Dépend de : App (app.js)
// ══════════════════════════════════════════════════════

/**
 * Échappe les caractères HTML dangereux pour prévenir les injections XSS.
 * @param {string} str - Chaîne à échapper
 * @returns {string}
 */
App.escapeHTML = function (str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Crée un élément DOM de manière sécurisée (sans innerHTML).
 * @param {string}  tag      - Nom de la balise (ex: 'div', 'span', 'button')
 * @param {Object}  [attrs]  - Attributs de l'élément
 * @param {string}  [attrs.className]    - Classes CSS
 * @param {string}  [attrs.textContent]  - Contenu texte (échappé automatiquement)
 * @param {Object}  [attrs.dataset]      - Attributs data-* (ex: { id: '5' } → data-id="5")
 * @param {Object}  [attrs.aria]         - Attributs aria-* (ex: { label: 'Fermer' } → aria-label="Fermer")
 * @param {Object}  [attrs.style]        - Styles inline (ex: { display: 'none' })
 * @param {string}  [attrs.type]         - Attribut type (pour button, input)
 * @param {string}  [attrs.role]         - Attribut role
 * @param {string}  [attrs.tabindex]     - Attribut tabindex
 * @param {string}  [attrs.id]           - Attribut id
 * @param {Array}   [children]           - Enfants : éléments DOM ou chaînes de texte
 * @returns {HTMLElement}
 */
App.creerElement = function (tag, attrs, children) {
  var el = document.createElement(tag);
  if (attrs) {
    if (attrs.className)   el.className = attrs.className;
    if (attrs.textContent !== undefined) el.textContent = attrs.textContent;
    if (attrs.id)          el.id = attrs.id;
    if (attrs.type)        el.setAttribute('type', attrs.type);
    if (attrs.role)        el.setAttribute('role', attrs.role);
    if (attrs.tabindex !== undefined) el.setAttribute('tabindex', attrs.tabindex);
    if (attrs.dataset) {
      var keys = Object.keys(attrs.dataset);
      for (var i = 0; i < keys.length; i++) {
        el.dataset[keys[i]] = attrs.dataset[keys[i]];
      }
    }
    if (attrs.aria) {
      var ariaKeys = Object.keys(attrs.aria);
      for (var j = 0; j < ariaKeys.length; j++) {
        el.setAttribute('aria-' + ariaKeys[j], attrs.aria[ariaKeys[j]]);
      }
    }
    if (attrs.style) {
      var styleKeys = Object.keys(attrs.style);
      for (var s = 0; s < styleKeys.length; s++) {
        el.style[styleKeys[s]] = attrs.style[styleKeys[s]];
      }
    }
  }
  if (children) {
    for (var c = 0; c < children.length; c++) {
      if (typeof children[c] === 'string') {
        el.appendChild(document.createTextNode(children[c]));
      } else if (children[c]) {
        el.appendChild(children[c]);
      }
    }
  }
  return el;
};

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
 * Retourne une clé de zone stable pour les filtres/tri.
 * Priorité : zone_en > zone_fr > zone.
 * @param {Object} picto
 * @returns {string}
 */
App.zoneKey = function (picto) {
  return picto.zone_en || picto.zone_fr || picto.zone || '';
};

/**
 * Construit l'index de recherche pré-normalisé sur chaque picto.
 * Appelé au boot et lors d'un changement de langue.
 * Enrichit chaque objet picto avec _searchIndex, _nomNorm, _zoneNorm.
*/
App.buildSearchIndex = function () {
  DATA.pictos.forEach(function (picto) {
    picto._searchIndex = App.normaliserTexte(
      (picto.nom_fr || '') + ' ' + (picto.nom_en || '') + ' ' +
      (picto.effet_en || '') + ' ' + (picto.effet_fr || '') + ' ' +
      (picto.zone || '') + ' ' + (picto.zone_en || '') + ' ' + (picto.zone_fr || '') + ' ' +
      (picto.localisation_en || '') + ' ' + (picto.localisation_fr || '') + ' ' +
      (picto.flag_en || '') + ' ' + (picto.flag_fr || '')
    );
    picto._nomNorm = App.normaliserTexte(App.champ(picto, 'nom'));
    picto._zoneNorm = App.normaliserTexte(App.champ(picto, 'zone'));
  });
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

/**
 * Exécute une fonction dans un try/catch avec notification d'erreur.
 * @param {Function} fn          - Fonction à exécuter
 * @param {string}   [fallbackMsg] - Message à afficher en toast si erreur
 * @returns {*} Résultat de fn() ou undefined en cas d'erreur
 */
App.safeExec = function (fn, fallbackMsg) {
  try {
    return fn();
  } catch (e) {
    console.error(e);
    if (fallbackMsg && typeof App.afficherToast === 'function') {
      App.afficherToast(fallbackMsg, true);
    }
  }
};
