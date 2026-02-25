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

  // Catégorie
  var secCategorie = document.getElementById('tt-sec-categorie');
  var ttCategorie = document.getElementById('tt-categorie');
  if (picto.categorie && DATA.meta && Array.isArray(DATA.meta.categories)) {
    var catMeta = null;
    for (var ci = 0; ci < DATA.meta.categories.length; ci++) {
      if (DATA.meta.categories[ci].id === picto.categorie) { catMeta = DATA.meta.categories[ci]; break; }
    }
    if (catMeta) {
      ttCategorie.textContent = App.LANG === 'fr' ? catMeta.label_fr : catMeta.label_en;
      secCategorie.style.display = '';
    } else {
      secCategorie.style.display = 'none';
    }
  } else {
    secCategorie.style.display = 'none';
  }

  // Type d'obtention
  var secObtType = document.getElementById('tt-sec-obtention-type');
  var ttObtType = document.getElementById('tt-obtention-type');
  if (picto.obtention_type && DATA.meta && Array.isArray(DATA.meta.obtention_types)) {
    var obtMeta = null;
    for (var oi = 0; oi < DATA.meta.obtention_types.length; oi++) {
      if (DATA.meta.obtention_types[oi].id === picto.obtention_type) { obtMeta = DATA.meta.obtention_types[oi]; break; }
    }
    if (obtMeta) {
      ttObtType.textContent = App.LANG === 'fr' ? obtMeta.label_fr : obtMeta.label_en;
      secObtType.style.display = '';
    } else {
      secObtType.style.display = 'none';
    }
  } else {
    secObtType.style.display = 'none';
  }

  // Maîtrise Lumina (0-4 circles)
  var secMastery = document.getElementById('tt-sec-mastery');
  var masteryControls = document.getElementById('tt-mastery-controls');
  while (masteryControls.firstChild) masteryControls.removeChild(masteryControls.firstChild);

  var currentMastery = App.getMaitrise(picto.id);
  for (var mi = 1; mi <= App.MASTERY_MAX; mi++) {
    var circle = document.createElement('button');
    circle.type = 'button';
    circle.className = 'mastery-circle' + (mi <= currentMastery ? ' filled' : '');
    circle.dataset.level = mi;
    circle.setAttribute('aria-label', App.t('tooltip_mastery_count', { n: mi, max: App.MASTERY_MAX }));
    (function (level) {
      circle.addEventListener('click', function () {
        var newVal = (App.getMaitrise(picto.id) === level) ? level - 1 : level;
        App.setMaitrise(picto.id, newVal);
        App.ouvrirTooltip(picto);
      });
    })(mi);
    masteryControls.appendChild(circle);
  }
  var masteryLabel = document.createElement('span');
  masteryLabel.className = 'mastery-label';
  masteryLabel.textContent = App.t('tooltip_mastery_count', { n: currentMastery, max: App.MASTERY_MAX });
  masteryControls.appendChild(masteryLabel);
  secMastery.style.display = '';

  // Niveau (1-33)
  var secLevel = document.getElementById('tt-sec-level');
  var levelControls = document.getElementById('tt-level-controls');
  while (levelControls.firstChild) levelControls.removeChild(levelControls.firstChild);

  var currentLevel = App.getNiveau(picto.id);

  var btnLevelDown = document.createElement('button');
  btnLevelDown.type = 'button';
  btnLevelDown.className = 'level-btn';
  btnLevelDown.textContent = '\u2212';
  btnLevelDown.disabled = currentLevel <= 1;
  btnLevelDown.addEventListener('click', function () {
    App.setNiveau(picto.id, App.getNiveau(picto.id) - 1);
    App.ouvrirTooltip(picto);
  });

  var levelDisplay = document.createElement('span');
  levelDisplay.className = 'level-display';
  levelDisplay.textContent = App.t('tooltip_level_count', { n: currentLevel });

  var btnLevelUp = document.createElement('button');
  btnLevelUp.type = 'button';
  btnLevelUp.className = 'level-btn';
  btnLevelUp.textContent = '+';
  btnLevelUp.disabled = currentLevel >= App.PICTO_LEVEL_MAX;
  btnLevelUp.addEventListener('click', function () {
    App.setNiveau(picto.id, App.getNiveau(picto.id) + 1);
    App.ouvrirTooltip(picto);
  });

  levelControls.appendChild(btnLevelDown);
  levelControls.appendChild(levelDisplay);
  levelControls.appendChild(btnLevelUp);
  secLevel.style.display = '';

  // Bouton possession
  var btn = document.getElementById('tt-btn-possession');
  var possede = App.etat.possedes.has(picto.id);
  btn.textContent = possede ? App.t('tooltip_remove') : App.t('tooltip_add');
  btn.className = 'tooltip-btn-possession' + (possede ? ' possede-btn' : '');

  App.ouvrirModal(overlay, document.getElementById('tooltip-fermer'));
};

/**
 * Ferme la modal de détail.
 */
App.fermerTooltip = function () {
  App.fermerModal(document.getElementById('tooltip-overlay'));
  App.etat.pictoOuvert = null;
};
