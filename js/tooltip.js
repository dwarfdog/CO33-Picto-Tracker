// © 2026 Nicolas Markiewicz (DwarfDog) — MIT License
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
    App.champ(picto, 'localisation') || picto.zone || App.t('zone_unknown');

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
