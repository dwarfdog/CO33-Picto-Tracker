// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  CHARACTER-BUILDS — Build planner par personnage
//  Dépend de : App (app.js), DATA (skills-data.js)
// ══════════════════════════════════════════════════════

/**
 * Retourne le catalogue des personnages.
 * @returns {Array}
 */
App.getCharacterCatalog = function () {
  return (DATA.meta && Array.isArray(DATA.meta.characters)) ? DATA.meta.characters : [];
};

/**
 * Retourne un personnage par son ID.
 * @param {string} id
 * @returns {Object|null}
 */
App.getCharacterById = function (id) {
  var chars = App.getCharacterCatalog();
  for (var i = 0; i < chars.length; i++) {
    if (chars[i].id === id) return chars[i];
  }
  return null;
};

/**
 * Calcule un score d'affinité entre un personnage et un picto.
 * Score basé sur l'intersection des affinités du personnage avec les tags gameplay du picto.
 * @param {string} characterId
 * @param {Object} picto
 * @returns {number} 0-3
 */
App.getCharacterAffinityScore = function (characterId, picto) {
  var character = App.getCharacterById(characterId);
  if (!character || !Array.isArray(character.affinities)) return 0;

  var tags = (typeof App.resolveGameplayTags === 'function') ? App.resolveGameplayTags(picto) : [];
  if (!tags.length) return 0;

  var score = 0;
  for (var i = 0; i < character.affinities.length; i++) {
    if (tags.indexOf(character.affinities[i]) !== -1) score++;
  }
  return score;
};

/**
 * Retourne les N meilleurs pictos pour un personnage, triés par score d'affinité.
 * @param {string} characterId
 * @param {number} [n=10]
 * @returns {Array<{picto:Object, score:number}>}
 */
App.getRecommendedPictos = function (characterId, n) {
  var limit = n || 10;
  var results = [];

  DATA.pictos.forEach(function (picto) {
    var score = App.getCharacterAffinityScore(characterId, picto);
    if (score > 0) {
      results.push({ picto: picto, score: score });
    }
  });

  results.sort(function (a, b) {
    return b.score - a.score || a.picto.id - b.picto.id;
  });

  return results.slice(0, limit);
};

/**
 * Détecte les synergies actives pour un ensemble de picto IDs.
 * @param {number[]} pictoIds
 * @returns {Array<Object>} Synergies actives
 */
App.detecterSynergies = function (pictoIds) {
  var synergies = (DATA.meta && Array.isArray(DATA.meta.synergies)) ? DATA.meta.synergies : [];
  if (!synergies.length || !pictoIds.length) return [];

  // Collecter tous les tags gameplay des pictos
  var allTags = new Set();
  pictoIds.forEach(function (id) {
    var picto = App.getPictoById(id);
    if (!picto) return;
    var tags = (typeof App.resolveGameplayTags === 'function') ? App.resolveGameplayTags(picto) : [];
    tags.forEach(function (t) { allTags.add(t); });
  });

  var actives = [];
  synergies.forEach(function (syn) {
    if (!Array.isArray(syn.required_tags)) return;
    var allPresent = true;
    for (var i = 0; i < syn.required_tags.length; i++) {
      if (!allTags.has(syn.required_tags[i])) {
        allPresent = false;
        break;
      }
    }
    if (allPresent) actives.push(syn);
  });

  return actives;
};

/**
 * Calcule un score de synergie numérique pour un ensemble de pictos.
 * @param {number[]} pictoIds
 * @returns {number}
 */
App.getSynergyScore = function (pictoIds) {
  return App.detecterSynergies(pictoIds).length;
};

/**
 * Rend la section build planner par personnage dans le DOM.
 */
App.rendreCharacterBuilds = function () {
  var container = document.getElementById('character-builds');
  if (!container) return;

  var chars = App.getCharacterCatalog();
  if (!chars.length) {
    container.style.display = 'none';
    return;
  }

  container.style.display = '';

  // Titre
  var title = document.getElementById('character-builds-title');
  if (title) title.textContent = App.t('character_builds_title');

  // Sélecteur de personnage
  var selector = document.getElementById('character-selector');
  if (selector) {
    while (selector.firstChild) selector.removeChild(selector.firstChild);

    chars.forEach(function (ch) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'char-btn' + (App.etat.selectedCharacter === ch.id ? ' actif' : '');
      btn.dataset.charId = ch.id;
      btn.textContent = App.LANG === 'fr' ? ch.nom_fr : ch.nom_en;
      btn.addEventListener('click', function () {
        App.etat.selectedCharacter = ch.id;
        App.rendreCharacterBuilds();
      });
      selector.appendChild(btn);
    });
  }

  // Détail du personnage sélectionné
  var detailEl = document.getElementById('character-build-detail');
  if (!detailEl) return;
  while (detailEl.firstChild) detailEl.removeChild(detailEl.firstChild);

  var selectedChar = App.getCharacterById(App.etat.selectedCharacter);
  if (!selectedChar) return;

  // Rôle
  var roleEl = document.createElement('div');
  roleEl.className = 'char-role';
  roleEl.textContent = App.LANG === 'fr' ? selectedChar.role_fr : selectedChar.role_en;
  detailEl.appendChild(roleEl);

  // Affinités
  var affinEl = document.createElement('div');
  affinEl.className = 'char-affinities';
  var affinLabel = document.createElement('span');
  affinLabel.className = 'char-affin-label';
  affinLabel.textContent = App.t('character_affinities') + ' ';
  affinEl.appendChild(affinLabel);

  (selectedChar.affinities || []).forEach(function (tagId) {
    var gameplayCfg = App.getGameplayConfig();
    var tagMeta = gameplayCfg.tagMap[tagId];
    var badge = document.createElement('span');
    badge.className = 'char-affin-badge';
    badge.textContent = tagMeta ? (App.LANG === 'fr' ? tagMeta.label_fr : tagMeta.label_en) : tagId;
    affinEl.appendChild(badge);
  });
  detailEl.appendChild(affinEl);

  // Recommandations de pictos
  var recoTitle = document.createElement('div');
  recoTitle.className = 'char-reco-title';
  recoTitle.textContent = App.t('character_recommended');
  detailEl.appendChild(recoTitle);

  var recos = App.getRecommendedPictos(selectedChar.id, 6);
  var recoList = document.createElement('div');
  recoList.className = 'char-reco-list';

  recos.forEach(function (rec) {
    var item = document.createElement('div');
    item.className = 'char-reco-item';

    var stars = '';
    for (var s = 0; s < rec.score; s++) stars += '\u2605';
    for (var e = rec.score; e < 3; e++) stars += '\u2606';

    var nameSpan = document.createElement('span');
    nameSpan.className = 'char-reco-name';
    nameSpan.textContent = App.champ(rec.picto, 'nom');
    item.appendChild(nameSpan);

    var scoreSpan = document.createElement('span');
    scoreSpan.className = 'char-reco-score';
    scoreSpan.textContent = stars;
    item.appendChild(scoreSpan);

    var idSpan = document.createElement('span');
    idSpan.className = 'char-reco-id';
    idSpan.textContent = '#' + rec.picto.id;
    item.appendChild(idSpan);

    item.addEventListener('click', function () {
      App.ouvrirTooltip(rec.picto);
    });

    recoList.appendChild(item);
  });

  detailEl.appendChild(recoList);

  // Synergies des pictos possédés
  var ownedIds = Array.from(App.etat.possedes);
  var activeSynergies = App.detecterSynergies(ownedIds);

  if (activeSynergies.length) {
    var synTitle = document.createElement('div');
    synTitle.className = 'char-syn-title';
    synTitle.textContent = App.t('character_synergies');
    detailEl.appendChild(synTitle);

    activeSynergies.forEach(function (syn) {
      var synItem = document.createElement('div');
      synItem.className = 'char-syn-item';

      var synName = document.createElement('span');
      synName.className = 'char-syn-name';
      synName.textContent = App.LANG === 'fr' ? syn.label_fr : syn.label_en;
      synItem.appendChild(synName);

      var synDesc = document.createElement('span');
      synDesc.className = 'char-syn-desc';
      synDesc.textContent = App.LANG === 'fr' ? syn.description_fr : syn.description_en;
      synItem.appendChild(synDesc);

      detailEl.appendChild(synItem);
    });
  }
};
