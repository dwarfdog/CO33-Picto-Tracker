// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  TOOLTIP — Modal de détail d'un picto
//  Dépend de : App (app.js)
// ══════════════════════════════════════════════════════

/**
 * Ouvre la modal de détail pour un picto donné.
 * Construction DOM pure — aucun innerHTML avec données picto.
 * @param {Object} picto - Objet picto issu de DATA.pictos
 */
App.ouvrirTooltip = function (picto) {
  App.etat.pictoOuvert = picto.id;
  var overlay = document.getElementById('tooltip-overlay');

  // Noms
  document.getElementById('tt-nom-fr').textContent = App.champ(picto, 'nom');
  document.getElementById('tt-nom-en').textContent = App.nomSecondaire(picto);

  // Effet
  document.getElementById('tt-effet').textContent =
    App.champ(picto, 'effet') || App.t('effect_undocumented');

  // Zone / Localisation
  document.getElementById('tt-zone').textContent =
    App.champ(picto, 'localisation') || App.champ(picto, 'zone') || App.t('zone_unknown');

  // Flag (drapeau de téléportation) — DOM pur
  var flagEl = document.getElementById('tt-flag');
  var secFlag = document.getElementById('tt-sec-flag');
  var flagText = App.champ(picto, 'flag');
  if (flagText) {
    // Vider et reconstruire sans innerHTML
    while (flagEl.firstChild) flagEl.removeChild(flagEl.firstChild);
    var flagSvg = App._svgTemplates.flag.cloneNode(true);
    flagSvg.classList.add('flag-icon');
    flagEl.appendChild(flagSvg);
    flagEl.appendChild(document.createTextNode(' ' + flagText));
    secFlag.style.display = '';
  } else {
    secFlag.style.display = 'none';
  }

  // Obtention
  var obtentionEl = document.getElementById('tt-obtention');
  var secObtention = document.getElementById('tt-sec-obtention');
  var obtentionText = App.champ(picto, 'obtention');
  if (obtentionText) {
    obtentionEl.textContent = obtentionText;
    secObtention.style.display = '';
  } else {
    secObtention.style.display = 'none';
  }

  // Stats — construction DOM pure
  var statsGrille = document.getElementById('tt-stats');
  var secStats = document.getElementById('tt-sec-stats');
  while (statsGrille.firstChild) statsGrille.removeChild(statsGrille.firstChild);
  var LABELS = App._cachedStatLabels || App.getStatLabels();
  var stats = picto.statistiques || {};
  var statEntries = Object.entries(stats);

  if (statEntries.length) {
    secStats.style.display = '';
    statEntries.forEach(function (entry) {
      var k = entry[0], v = entry[1];
      var meta = LABELS[k] || { label: k, classe: 'vitesse' };

      var item = document.createElement('div');
      item.className = 'tooltip-stat-item';

      var nomSpan = document.createElement('span');
      nomSpan.className = 'tooltip-stat-nom';
      nomSpan.textContent = meta.label;
      item.appendChild(nomSpan);

      var valSpan = document.createElement('span');
      valSpan.className = 'tooltip-stat-val ' + meta.classe;
      valSpan.textContent = App.formatStatVal(k, v);
      item.appendChild(valSpan);

      statsGrille.appendChild(item);
    });
  } else {
    secStats.style.display = 'none';
  }

  // Lumina
  var ttLumina = document.getElementById('tt-lumina');
  var secLumina = document.getElementById('tt-sec-lumina');
  if (picto.lumina) {
    ttLumina.textContent = '\u2726 ' + picto.lumina;
    secLumina.style.display = '';
  } else {
    secLumina.style.display = 'none';
  }

  // Bouton possession
  var btn = document.getElementById('tt-btn-possession');
  var possede = App.etat.possedes.has(picto.id);
  btn.textContent = possede ? App.t('tooltip_remove') : App.t('tooltip_add');
  btn.className = 'tooltip-btn-possession' + (possede ? ' possede-btn' : '');

  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
};

/**
 * Ferme la modal de détail.
 */
App.fermerTooltip = function () {
  document.getElementById('tooltip-overlay').classList.remove('visible');
  document.body.style.overflow = '';
  App.etat.pictoOuvert = null;
};
