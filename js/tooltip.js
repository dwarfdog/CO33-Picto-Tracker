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

  // ── Meta bar (header) : #ID, catégorie, lumina ──
  var metaId = document.getElementById('tt-meta-id');
  metaId.textContent = '#' + String(picto.id).padStart(3, '0');

  var metaCat = document.getElementById('tt-meta-cat');
  if (Array.isArray(picto.categories) && picto.categories.length && DATA.meta && Array.isArray(DATA.meta.categories)) {
    var catLabels = [];
    for (var ci = 0; ci < picto.categories.length; ci++) {
      for (var cm = 0; cm < DATA.meta.categories.length; cm++) {
        if (DATA.meta.categories[cm].id === picto.categories[ci]) {
          catLabels.push(App.LANG === 'fr' ? DATA.meta.categories[cm].label_fr : DATA.meta.categories[cm].label_en);
          break;
        }
      }
    }
    if (catLabels.length) {
      metaCat.textContent = catLabels.join(' / ');
      metaCat.className = 'tooltip-meta-cat cat-' + picto.categories[0];
      metaCat.style.display = '';
    } else {
      metaCat.style.display = 'none';
    }
  } else {
    metaCat.style.display = 'none';
  }

  var metaLumina = document.getElementById('tt-meta-lumina');
  if (picto.lumina) {
    metaLumina.textContent = '\u2726 ' + picto.lumina;
    metaLumina.style.display = '';
  } else {
    metaLumina.style.display = 'none';
  }

  // Nom principal (langue active)
  document.getElementById('tt-nom-fr').textContent = App.champ(picto, 'nom');

  // Nom secondaire : seulement si traduction dérivée (fallback)
  var nomEnEl = document.getElementById('tt-nom-en');
  if (!picto.traduction_confirmee) {
    nomEnEl.textContent = App.nomSecondaire(picto);
    nomEnEl.style.display = '';
  } else {
    nomEnEl.textContent = '';
    nomEnEl.style.display = 'none';
  }

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

  // Source (boss / endgame)
  var secSource = document.getElementById('tt-sec-source');
  var ttSource = document.getElementById('tt-source');
  var sourceTexts = [];
  if (picto.source_endgame) {
    sourceTexts.push(App.t('tooltip_source_endgame'));
  }
  if (picto.source_boss) {
    sourceTexts.push(App.t('tooltip_source_boss', { boss: picto.source_boss }));
  }
  if (sourceTexts.length) {
    ttSource.textContent = sourceTexts.join(' \u2014 ');
    secSource.style.display = '';
  } else {
    secSource.style.display = 'none';
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

  // Catégorie (avec badges colorés + texte)
  var secCategorie = document.getElementById('tt-sec-categorie');
  var ttCategorie = document.getElementById('tt-categorie');
  while (ttCategorie.firstChild) ttCategorie.removeChild(ttCategorie.firstChild);
  if (Array.isArray(picto.categories) && picto.categories.length && DATA.meta && Array.isArray(DATA.meta.categories)) {
    var badgeContainer = document.createElement('div');
    badgeContainer.className = 'tooltip-cat-badges';
    var catTexts = [];
    for (var ci2 = 0; ci2 < picto.categories.length; ci2++) {
      for (var cm2 = 0; cm2 < DATA.meta.categories.length; cm2++) {
        if (DATA.meta.categories[cm2].id === picto.categories[ci2]) {
          var catLabel = App.LANG === 'fr' ? DATA.meta.categories[cm2].label_fr : DATA.meta.categories[cm2].label_en;
          catTexts.push(catLabel);
          var badge = document.createElement('span');
          badge.className = 'tooltip-cat-badge cat-' + picto.categories[ci2];
          badge.textContent = catLabel;
          badgeContainer.appendChild(badge);
          break;
        }
      }
    }
    if (catTexts.length) {
      ttCategorie.appendChild(badgeContainer);
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

  // Affinités par personnage
  var secCharAffinity = document.getElementById('tt-sec-char-affinity');
  var charAffinEl = document.getElementById('tt-char-affinities');
  var chars = (typeof App.getCharacterCatalog === 'function') ? App.getCharacterCatalog() : [];
  if (chars.length) {
    while (charAffinEl.firstChild) charAffinEl.removeChild(charAffinEl.firstChild);
    chars.forEach(function (ch) {
      var score = App.getCharacterAffinityScore(ch.id, picto);
      var item = document.createElement('span');
      item.className = 'char-affin-inline';
      var nameSpan = document.createElement('span');
      nameSpan.className = 'char-affin-inline-name';
      nameSpan.textContent = App.LANG === 'fr' ? ch.nom_fr : ch.nom_en;
      item.appendChild(nameSpan);
      var stars = '';
      for (var si = 0; si < 4; si++) stars += (si < score) ? '\u2605' : '\u2606';
      var starsSpan = document.createElement('span');
      starsSpan.className = 'char-affin-inline-stars' + (score > 0 ? ' has-affinity' : '');
      starsSpan.textContent = stars;
      item.appendChild(starsSpan);
      charAffinEl.appendChild(item);
    });
    secCharAffinity.style.display = '';
  } else {
    secCharAffinity.style.display = 'none';
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
        App.mettreAJourCarteTracking(picto.id);
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

  // Niveau (1-33 max absolu)
  var secLevel = document.getElementById('tt-sec-level');
  var levelControls = document.getElementById('tt-level-controls');
  while (levelControls.firstChild) levelControls.removeChild(levelControls.firstChild);

  var currentLevel = App.getNiveau(picto.id);
  var maxLevel = App.PICTO_LEVEL_MAX;

  var btnLevelDown = document.createElement('button');
  btnLevelDown.type = 'button';
  btnLevelDown.className = 'level-btn';
  btnLevelDown.textContent = '\u2212';
  btnLevelDown.disabled = currentLevel <= 1;
  btnLevelDown.addEventListener('click', function () {
    App.setNiveau(picto.id, App.getNiveau(picto.id) - 1);
    App.mettreAJourCarteTracking(picto.id);
    App.ouvrirTooltip(picto);
  });

  var levelDisplay = document.createElement('span');
  levelDisplay.className = 'level-display';
  levelDisplay.textContent = App.t('tooltip_level_count', { n: currentLevel, max: maxLevel });

  var btnLevelUp = document.createElement('button');
  btnLevelUp.type = 'button';
  btnLevelUp.className = 'level-btn';
  btnLevelUp.textContent = '+';
  btnLevelUp.disabled = currentLevel >= maxLevel;
  btnLevelUp.addEventListener('click', function () {
    App.setNiveau(picto.id, Math.min(App.getNiveau(picto.id) + 1, App.PICTO_LEVEL_MAX));
    App.mettreAJourCarteTracking(picto.id);
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

  // ── Visibilité des groupes : masquer un groupe si tous ses enfants section sont display:none ──
  var groups = ['tt-group-location', 'tt-group-classification'];
  for (var gi = 0; gi < groups.length; gi++) {
    var group = document.getElementById(groups[gi]);
    if (!group) continue;
    var sections = group.querySelectorAll('.tooltip-section');
    var allHidden = true;
    for (var si2 = 0; si2 < sections.length; si2++) {
      if (sections[si2].style.display !== 'none') { allHidden = false; break; }
    }
    group.style.display = allHidden ? 'none' : '';
  }

  App.ouvrirModal(overlay, document.getElementById('tooltip-fermer'));
};

/**
 * Ferme la modal de détail.
 */
App.fermerTooltip = function () {
  App.fermerModal(document.getElementById('tooltip-overlay'));
  App.etat.pictoOuvert = null;
};
