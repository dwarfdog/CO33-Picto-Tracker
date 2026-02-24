// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  CARDS — Création des cartes et rendu de la grille
//  Dépend de : App (app.js), DATA (skills-data.js)
// ══════════════════════════════════════════════════════

/**
 * Initialise les templates SVG réutilisables (appelé une fois au boot).
 * Évite de re-parser le SVG pour chaque carte.
 */
App.initSvgTemplates = function () {
  // SVG drapeau
  var flagSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  flagSvg.setAttribute('viewBox', '0 0 24 24');
  flagSvg.setAttribute('aria-hidden', 'true');
  var flagPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  flagPath.setAttribute('d', 'M4 2v20M4 4h12l-3 4 3 4H4');
  flagPath.setAttribute('stroke', 'currentColor');
  flagPath.setAttribute('stroke-width', '2');
  flagPath.setAttribute('fill', 'none');
  flagPath.setAttribute('stroke-linecap', 'round');
  flagPath.setAttribute('stroke-linejoin', 'round');
  flagSvg.appendChild(flagPath);

  // SVG checkmark
  var checkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  checkSvg.setAttribute('viewBox', '0 0 24 24');
  checkSvg.setAttribute('aria-hidden', 'true');
  var checkPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  checkPath.setAttribute('d', 'M20 6L9 17l-5-5');
  checkPath.setAttribute('stroke', 'currentColor');
  checkPath.setAttribute('stroke-width', '2.5');
  checkPath.setAttribute('fill', 'none');
  checkPath.setAttribute('stroke-linecap', 'round');
  checkPath.setAttribute('stroke-linejoin', 'round');
  checkSvg.appendChild(checkPath);

  App._svgTemplates = { flag: flagSvg, check: checkSvg };
};

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
 * Construit les éléments DOM des badges de stats pour un picto.
 * @param {Object} stats - Objet statistiques du picto
 * @returns {HTMLElement|null} - div.carte-stats ou null si pas de stats
 */
App.creerStatsBadges = function (stats) {
  var keys = Object.keys(stats);
  if (!keys.length) return null;

  var LABELS = App._cachedStatLabels || App.getStatLabels();
  var container = document.createElement('div');
  container.className = 'carte-stats';

  for (var i = 0; i < keys.length; i++) {
    var k = keys[i], v = stats[k];
    var meta = LABELS[k] || { label: k, classe: 'vitesse', icone: '\u2022' };
    var badge = document.createElement('span');
    badge.className = 'stat-badge ' + meta.classe;
    badge.textContent = meta.icone + ' ' + App.formatStatVal(k, v);
    container.appendChild(badge);
  }
  return container;
};

/**
 * Crée un élément DOM pour une carte picto (construction DOM pure, sans innerHTML).
 * @param {Object} picto - Objet picto issu de DATA.pictos
 * @returns {HTMLElement}
 */
App.creerCartePicto = function (picto) {
  var possede = App.etat.possedes.has(picto.id);
  var el = document.createElement('article');
  el.className = 'carte-picto' + (possede ? ' possede' : '');
  el.dataset.id = picto.id;

  // ── Coin décoratif ──
  var coinDeco = document.createElement('div');
  coinDeco.className = 'coin-deco';
  el.appendChild(coinDeco);

  // ── Header ──
  var header = document.createElement('div');
  header.className = 'carte-header';

  var nomFr = document.createElement('div');
  nomFr.className = 'carte-nom-fr';
  nomFr.id = 'carte-nom-' + picto.id;
  nomFr.textContent = App.champ(picto, 'nom');
  header.appendChild(nomFr);

  var nomEn = document.createElement('div');
  nomEn.className = 'carte-nom-en';
  nomEn.textContent = App.nomSecondaire(picto);
  header.appendChild(nomEn);

  if (!picto.traduction_confirmee) {
    var badgeTrad = document.createElement('span');
    badgeTrad.className = 'badge-non-confirme';
    badgeTrad.textContent = App.t('badge_derived');
    header.appendChild(badgeTrad);
  }

  var carteId = document.createElement('div');
  carteId.className = 'carte-id';
  carteId.textContent = '#' + String(picto.id).padStart(3, '0');
  header.appendChild(carteId);

  if (picto.lumina) {
    var lumina = document.createElement('div');
    lumina.className = 'carte-lumina';
    lumina.textContent = '\u2726 ' + picto.lumina;
    header.appendChild(lumina);
  }

  el.appendChild(header);

  // ── Corps ──
  var corps = document.createElement('div');
  corps.className = 'carte-corps';

  var effet = document.createElement('div');
  effet.className = 'carte-effet';
  effet.textContent = App.champ(picto, 'effet');
  corps.appendChild(effet);

  var stats = picto.statistiques || {};
  var statsBadges = App.creerStatsBadges(stats);
  if (statsBadges) corps.appendChild(statsBadges);

  el.appendChild(corps);

  // ── Footer ──
  var footer = document.createElement('div');
  footer.className = 'carte-footer';

  var zone = document.createElement('div');
  zone.className = 'carte-zone';
  zone.textContent = App.champ(picto, 'zone');
  footer.appendChild(zone);

  // Flag (drapeau de téléportation)
  var flagTexte = App.champ(picto, 'flag');
  var flagDiv = document.createElement('div');
  flagDiv.className = 'carte-flag';
  if (!flagTexte) flagDiv.style.display = 'none';
  flagDiv.appendChild(App._svgTemplates.flag.cloneNode(true));
  var flagSpan = document.createElement('span');
  flagSpan.className = 'carte-flag-texte';
  flagSpan.textContent = flagTexte;
  flagDiv.appendChild(flagSpan);
  footer.appendChild(flagDiv);

  // Bouton possession
  var btnPossession = document.createElement('button');
  btnPossession.type = 'button';
  btnPossession.className = 'possession-indicateur';
  btnPossession.setAttribute('aria-label', App.t('aria_toggle'));
  btnPossession.setAttribute('aria-pressed', possede ? 'true' : 'false');
  btnPossession.appendChild(App._svgTemplates.check.cloneNode(true));
  footer.appendChild(btnPossession);

  // Bouton détail
  var btnDetail = document.createElement('button');
  btnDetail.type = 'button';
  btnDetail.className = 'btn-detail';
  btnDetail.setAttribute('aria-label', App.t('tooltip_detail'));
  btnDetail.textContent = '\u24D8';
  footer.appendChild(btnDetail);

  el.appendChild(footer);

  // ── Référence au picto pour tri/filtre ──
  el._picto = picto;

  // ── Événements ──
  btnPossession.addEventListener('click', function (e) {
    e.stopPropagation();
    App.togglePossession(picto.id, el);
  });

  btnDetail.addEventListener('click', function (e) {
    e.stopPropagation();
    App.ouvrirTooltip(picto);
  });

  el.addEventListener('click', function () {
    App.ouvrirTooltip(picto);
  });

  el.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    App.ouvrirTooltip(picto);
  });

  return el;
};

/**
 * Bascule l'état de possession d'un picto.
 * Utilise requestAnimationFrame pour batacher les mises à jour DOM.
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
  var btnPossession = el.querySelector('.possession-indicateur');
  if (btnPossession) {
    btnPossession.setAttribute('aria-pressed', App.etat.possedes.has(id) ? 'true' : 'false');
  }
  App.sauvegarder();
  requestAnimationFrame(function () {
    App.mettreAJourProgression();
    App.appliquerFiltres();
  });
};

/**
 * Rend la grille complète à partir de DATA.pictos.
 */
App.rendreGrille = function () {
  var grille = App._dom.grille || document.getElementById('grille');
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
    el.querySelector('.possession-indicateur').setAttribute('aria-pressed', App.etat.possedes.has(picto.id) ? 'true' : 'false');
    el.querySelector('.btn-detail').setAttribute('aria-label', App.t('tooltip_detail'));
    // Zone (traduite)
    el.querySelector('.carte-zone').textContent = App.champ(picto, 'zone');
    // Flag
    var flagEl = el.querySelector('.carte-flag');
    var flagTexte = App.champ(picto, 'flag');
    flagEl.querySelector('.carte-flag-texte').textContent = flagTexte;
    flagEl.style.display = flagTexte ? '' : 'none';
    // Badge traduction
    var badge = el.querySelector('.badge-non-confirme');
    if (badge) badge.textContent = App.t('badge_derived');

    // Stats — reconstruire les badges via DOM pur
    var oldStats = el.querySelector('.carte-stats');
    var newStats = App.creerStatsBadges(picto.statistiques || {});
    var corps = el.querySelector('.carte-corps');
    if (oldStats) corps.removeChild(oldStats);
    if (newStats) corps.appendChild(newStats);
  });
};
