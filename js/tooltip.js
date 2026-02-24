// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  TOOLTIP — Modal de détail d'un picto
//  Dépend de : App (app.js)
// ══════════════════════════════════════════════════════

/**
 * Ouvre la modal de détail pour un picto donné.
 * @param {Object} picto - Objet picto issu de DATA.pictos
 */
App.ouvrirTooltip = function (picto) {
  App.etat.pictoOuvert = picto;
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

  // Flag (drapeau de téléportation)
  var flagEl = document.getElementById('tt-flag');
  var secFlag = document.getElementById('tt-sec-flag');
  var flagText = App.champ(picto, 'flag');
  if (flagText) {
    flagEl.innerHTML =
      '<svg class="flag-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2v20M4 4h12l-3 4 3 4H4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg> ' +
      flagText;
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

  // Stats
  var statsGrille = document.getElementById('tt-stats');
  var secStats = document.getElementById('tt-sec-stats');
  statsGrille.innerHTML = '';
  var LABELS = App.getStatLabels();
  var stats = picto.statistiques || {};
  var statEntries = Object.entries(stats);

  if (statEntries.length) {
    secStats.style.display = '';
    var htmlParts = [];
    statEntries.forEach(function (entry) {
      var k = entry[0], v = entry[1];
      var meta = LABELS[k] || { label: k, classe: 'vitesse' };
      htmlParts.push(
        '<div class="tooltip-stat-item">' +
          '<span class="tooltip-stat-nom">' + meta.label + '</span>' +
          '<span class="tooltip-stat-val ' + meta.classe + '">' + App.formatStatVal(k, v) + '</span>' +
        '</div>'
      );
    });
    statsGrille.innerHTML = htmlParts.join('');
  } else {
    secStats.style.display = 'none';
  }

  // Lumina
  var ttLumina = document.getElementById('tt-lumina');
  var secLumina = document.getElementById('tt-sec-lumina');
  if (picto.lumina) {
    ttLumina.textContent = '✦ ' + picto.lumina;
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
