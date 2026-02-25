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
 * Priorité : zone_en > zone_fr.
 * @param {Object} picto
 * @returns {string}
 */
App.zoneKey = function (picto) {
  return picto.zone_en || picto.zone_fr || '';
};

/**
 * Retourne les éléments focusables d'un conteneur.
 * @param {HTMLElement} root
 * @returns {HTMLElement[]}
 */
App.getFocusableElements = function (root) {
  if (!root) return [];
  var selectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  return Array.prototype.slice.call(root.querySelectorAll(selectors)).filter(function (el) {
    return el.getClientRects && el.getClientRects().length > 0 && !el.hasAttribute('inert');
  });
};

/**
 * Pile de modals ouvertes (LIFO).
 * Chaque entrée : { overlay: HTMLElement, previousFocus: HTMLElement }
 * @type {Array}
 */
App._modalStack = [];

/**
 * Ouvre une modal avec gestion du focus clavier et pile de modals.
 * @param {HTMLElement} overlay
 * @param {HTMLElement} [initialFocusEl]
 */
App.ouvrirModal = function (overlay, initialFocusEl) {
  if (!overlay || overlay.classList.contains('visible')) return;

  var previousFocus = document.activeElement;
  App._modalStack.push({ overlay: overlay, previousFocus: previousFocus });
  App._activeModal = overlay;
  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';

  var focusables = App.getFocusableElements(overlay);
  var target = initialFocusEl || focusables[0] || overlay;
  if (target === overlay && !overlay.hasAttribute('tabindex')) {
    overlay.setAttribute('tabindex', '-1');
  }
  requestAnimationFrame(function () { target.focus(); });
};

/**
 * Ferme une modal et restaure le focus via la pile.
 * @param {HTMLElement} overlay
 */
App.fermerModal = function (overlay) {
  if (!overlay || !overlay.classList.contains('visible')) return;

  overlay.classList.remove('visible');

  // Retirer de la pile et récupérer le focus précédent
  var previousFocus = null;
  App._modalStack = App._modalStack.filter(function (entry) {
    if (entry.overlay === overlay) {
      previousFocus = entry.previousFocus;
      return false;
    }
    return true;
  });

  // Mettre à jour la modal active (dernière de la pile)
  if (App._modalStack.length) {
    App._activeModal = App._modalStack[App._modalStack.length - 1].overlay;
  } else {
    App._activeModal = null;
    document.body.style.overflow = '';
    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
    }
  }
};

/**
 * Maintient le focus dans la modal active lors d'un appui sur Tab.
 * @param {KeyboardEvent} e
 */
App.maintenirFocusDansModal = function (e) {
  var overlay = App._activeModal;
  if (!overlay || !overlay.classList.contains('visible')) return;

  var focusables = App.getFocusableElements(overlay);
  if (!focusables.length) {
    e.preventDefault();
    overlay.focus();
    return;
  }

  var first = focusables[0];
  var last = focusables[focusables.length - 1];
  var active = document.activeElement;

  if (e.shiftKey && active === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
};

/**
 * Ouvre une modal de prompt personnalisée (remplace le prompt() natif).
 * @param {string}   titre    - Texte affiché comme titre/question
 * @param {string}   defaut   - Valeur par défaut dans l'input
 * @param {Function} callback - callback(valeur) si OK, callback(null) si annulé
 */
App.ouvrirPrompt = function (titre, defaut, callback) {
  var overlay = App._dom.promptOverlay || document.getElementById('prompt-overlay');
  var titleEl = App._dom.promptTitle || document.getElementById('prompt-title');
  var inputEl = App._dom.promptInput || document.getElementById('prompt-input');
  var btnOk = App._dom.btnPromptOk || document.getElementById('btn-prompt-ok');
  var btnCancel = App._dom.btnPromptCancel || document.getElementById('btn-prompt-cancel');

  if (!overlay || !inputEl) {
    // Fallback au prompt natif si le DOM n'est pas prêt
    var result = prompt(titre, defaut);
    if (callback) callback(result);
    return;
  }

  if (titleEl) titleEl.textContent = titre || '';
  inputEl.value = defaut || '';
  if (btnOk) btnOk.textContent = App.t('prompt_ok');
  if (btnCancel) btnCancel.textContent = App.t('prompt_cancel');

  function cleanup() {
    if (btnOk) btnOk.removeEventListener('click', onOk);
    if (btnCancel) btnCancel.removeEventListener('click', onCancel);
    if (inputEl) inputEl.removeEventListener('keydown', onKey);
    App.fermerModal(overlay);
  }

  function onOk() {
    var val = inputEl.value.trim();
    cleanup();
    if (callback) callback(val || null);
  }

  function onCancel() {
    cleanup();
    if (callback) callback(null);
  }

  function onKey(e) {
    if (e.key === 'Enter') { e.preventDefault(); onOk(); }
    if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
  }

  if (btnOk) btnOk.addEventListener('click', onOk);
  if (btnCancel) btnCancel.addEventListener('click', onCancel);
  inputEl.addEventListener('keydown', onKey);
  App.ouvrirModal(overlay, inputEl);
};

/**
 * Ouvre une modal de confirmation personnalisée (remplace le confirm() natif).
 * @param {string}   message  - Message de confirmation
 * @param {Function} callback - callback(true) si confirmé, callback(false) si annulé
 */
App.ouvrirConfirm = function (message, callback) {
  var overlay = App._dom.confirmOverlay || document.getElementById('confirm-overlay');
  var messageEl = App._dom.confirmMessage || document.getElementById('confirm-message');
  var btnYes = App._dom.btnConfirmYes || document.getElementById('btn-confirm-yes');
  var btnNo = App._dom.btnConfirmNo || document.getElementById('btn-confirm-no');

  if (!overlay) {
    // Fallback au confirm natif si le DOM n'est pas prêt
    var result = confirm(message);
    if (callback) callback(result);
    return;
  }

  if (messageEl) messageEl.textContent = message || '';
  if (btnYes) btnYes.textContent = App.t('confirm_yes');
  if (btnNo) btnNo.textContent = App.t('confirm_no');

  function cleanup() {
    if (btnYes) btnYes.removeEventListener('click', onYes);
    if (btnNo) btnNo.removeEventListener('click', onNo);
    App.fermerModal(overlay);
  }

  function onYes() {
    cleanup();
    if (callback) callback(true);
  }

  function onNo() {
    cleanup();
    if (callback) callback(false);
  }

  if (btnYes) btnYes.addEventListener('click', onYes);
  if (btnNo) btnNo.addEventListener('click', onNo);
  App.ouvrirModal(overlay, btnNo);
};

/**
 * Construit l'index de recherche pré-normalisé sur chaque picto.
 * Appelé au boot et lors d'un changement de langue.
 * Enrichit chaque objet picto avec _searchIndex, _nomNorm, _zoneNorm.
 */
App.buildSearchIndex = function () {
  DATA.pictos.forEach(function (picto) {
    var gameplaySearch = '';
    if (typeof App.resolveGameplayTags === 'function') {
      var tags = App.resolveGameplayTags(picto);
      if (tags && tags.length && typeof App.getGameplayTagSearchText === 'function') {
        gameplaySearch = tags.map(function (tagId) {
          return App.getGameplayTagSearchText(tagId);
        }).join(' ');
      }
    }

    var categorySearch = Array.isArray(picto.categories) ? picto.categories.join(' ') : '';

    picto._searchIndex = App.normaliserTexte(
      (picto.nom_fr || '') + ' ' + (picto.nom_en || '') + ' ' +
      (picto.effet_en || '') + ' ' + (picto.effet_fr || '') + ' ' +
      (picto.zone_en || '') + ' ' + (picto.zone_fr || '') + ' ' +
      (picto.flag_en || '') + ' ' + (picto.flag_fr || '') + ' ' +
      gameplaySearch + ' ' + categorySearch
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

/**
 * Initialise un registre DOM en résolvant les IDs.
 * Affiche un warning console si des éléments sont manquants.
 * @param {Object<string,string>} spec - { clé: 'id-html', ... }
 * @returns {Object<string,HTMLElement|null>}
 */
App.initDomRegistry = function (spec) {
  var registry = {};
  var missing = [];
  var keys = Object.keys(spec);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var el = document.getElementById(spec[key]);
    if (!el) missing.push(spec[key]);
    registry[key] = el;
  }
  if (missing.length) {
    console.warn('[DOM Registry] Éléments manquants :', missing.join(', '));
  }
  return registry;
};
