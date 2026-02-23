// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  CARDS — Création des cartes et rendu de la grille
//  Dépend de : App (app.js), DATA (skills-data.js)
// ══════════════════════════════════════════════════════

/**
 * Retourne le nom du picto dans la première langue disponible
 * qui n'est pas la langue courante (pour affichage secondaire).
 * @param {Object} picto
 * @returns {string}
 */
App.nomSecondaire = function (picto) {
  for (var i = 0; i < App.SUPPORTED_LANGS.length; i++) {
    var l = App.SUPPORTED_LANGS[i];
    if (l !== App.LANG && picto['nom_' + l]) return picto['nom_' + l];
  }
  return '';
};

/**
 * Crée un élément DOM pour une carte picto.
 * @param {Object} picto - Objet picto issu de DATA.pictos
 * @returns {HTMLElement}
 */
App.creerCartePicto = function (picto) {
  var el = document.createElement('div');
  el.className = 'carte-picto' + (App.etat.possedes.has(picto.id) ? ' possede' : '');
  el.dataset.id = picto.id;
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label',
    App.champ(picto, 'nom') + ' — ' +
    (App.etat.possedes.has(picto.id) ? App.t('aria_owned') : App.t('aria_not_owned'))
  );

  // Stats badges
  var statsHTML = '';
  var LABELS = App.getStatLabels();
  var stats = picto.statistiques || {};
  var keys = Object.keys(stats);
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i], v = stats[k];
    var meta = LABELS[k] || { label: k, classe: 'vitesse', icone: '•' };
    statsHTML += '<span class="stat-badge ' + meta.classe + '">' + meta.icone + ' ' + App.formatStatVal(k, v) + '</span>';
  }

  // Badge traduction non confirmée
  var badgeTrad = !picto.traduction_confirmee
    ? '<span class="badge-non-confirme">' + App.t('badge_derived') + '</span>'
    : '';

  // Nom principal = langue courante, nom secondaire = autre langue
  var nomPrincipal = App.champ(picto, 'nom');
  var nomSec = App.nomSecondaire(picto);

  el.innerHTML =
    '<div class="coin-deco"></div>' +
    '<div class="carte-header">' +
      '<div class="carte-nom-fr">' + nomPrincipal + '</div>' +
      '<div class="carte-nom-en">' + nomSec + '</div>' +
      badgeTrad +
      '<div class="carte-id">#' + String(picto.id).padStart(3, '0') + '</div>' +
    '</div>' +
    '<div class="carte-corps">' +
      '<div class="carte-effet">' + App.champ(picto, 'effet') + '</div>' +
      (statsHTML ? '<div class="carte-stats">' + statsHTML + '</div>' : '') +
    '</div>' +
    '<div class="carte-footer">' +
      '<div class="carte-zone">' + (picto.zone || '') + '</div>' +
      '<button class="possession-indicateur" aria-label="' + App.t('aria_toggle') + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
    '</div>';

  // Référence au picto pour tri/filtre
  el._picto = picto;

  // Clic sur l'indicateur de possession → toggle (intercepte avant le clic carte)
  el.querySelector('.possession-indicateur').addEventListener('click', function (e) {
    e.stopPropagation();
    App.togglePossession(picto.id, el);
  });

  // Clic gauche sur la carte → ouvrir le détail
  el.addEventListener('click', function () {
    App.ouvrirTooltip(picto);
  });

  // Clic droit → détail
  el.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    App.ouvrirTooltip(picto);
  });

  // Clavier : Enter → détail, Espace → toggle possession
  el.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') App.ouvrirTooltip(picto);
    if (e.key === ' ') { e.preventDefault(); App.togglePossession(picto.id, el); }
  });

  return el;
};

/**
 * Bascule l'état de possession d'un picto.
 * @param {number} id - ID du picto
 * @param {HTMLElement} el - Élément carte DOM
 */
App.togglePossession = function (id, el) {
  if (App.etat.possedes.has(id)) {
    App.etat.possedes.delete(id);
    el.classList.remove('possede');
  } else {
    App.etat.possedes.add(id);
    el.classList.add('possede');
  }
  // Reconstruire l'aria-label
  var nom = App.champ(el._picto, 'nom');
  el.setAttribute('aria-label',
    nom + ' — ' + (App.etat.possedes.has(id) ? App.t('aria_owned') : App.t('aria_not_owned'))
  );
  App.sauvegarder();
  App.mettreAJourProgression();
  App.appliquerFiltres();
};

/**
 * Rend la grille complète à partir de DATA.pictos.
 */
App.rendreGrille = function () {
  var grille = document.getElementById('grille');
  grille.innerHTML = '';
  App.toutes_cartes = [];
  App.cartesParId = {};

  DATA.pictos.forEach(function (picto, i) {
    var carte = App.creerCartePicto(picto);
    carte.style.animationDelay = Math.min(i * App.ANIMATION_DELAY_PER_CARD, App.ANIMATION_DELAY_MAX) + 'ms';
    grille.appendChild(carte);
    App.toutes_cartes.push(carte);
    App.cartesParId[picto.id] = carte;
  });

  App.appliquerTri();
  App.appliquerFiltres();
};

/**
 * Met à jour les textes des cartes en place (sans recréer le DOM).
 * Utilisé lors du changement de langue pour éviter de reconstruire la grille.
 */
App.mettreAJourCartesTexte = function () {
  App.toutes_cartes.forEach(function (el) {
    var picto = el._picto;
    el.querySelector('.carte-nom-fr').textContent = App.champ(picto, 'nom');
    el.querySelector('.carte-nom-en').textContent = App.nomSecondaire(picto);
    el.querySelector('.carte-effet').textContent = App.champ(picto, 'effet');
    el.querySelector('.possession-indicateur').setAttribute('aria-label', App.t('aria_toggle'));
    // Badge traduction
    var badge = el.querySelector('.badge-non-confirme');
    if (badge) badge.textContent = App.t('badge_derived');
    // Aria-label
    var nom = App.champ(picto, 'nom');
    el.setAttribute('aria-label',
      nom + ' — ' + (App.etat.possedes.has(picto.id) ? App.t('aria_owned') : App.t('aria_not_owned'))
    );
  });
};
