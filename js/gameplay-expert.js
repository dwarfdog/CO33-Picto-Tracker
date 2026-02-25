// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  GAMEPLAY EXPERT — Tags mecaniques, filtres avances, route de collecte
//  Dépend de : App (app.js), DATA (skills-data.js)
// ══════════════════════════════════════════════════════

/**
 * Normalise un texte pour le matching gameplay.
 * @param {*} value
 * @returns {string}
 */
App.normaliserTexteGameplay = function (value) {
  if (value === undefined || value === null) return '';
  var base = String(value);
  if (typeof App.normaliserTexte === 'function') {
    base = App.normaliserTexte(base);
  } else {
    base = base.toLowerCase();
  }
  return base.replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * Retourne un tableau de chaines normalisees et uniques.
 * @param {*} input
 * @returns {string[]}
 */
App.normaliserListeGameplay = function (input) {
  if (!Array.isArray(input)) return [];
  var out = [];
  var seen = {};

  input.forEach(function (value) {
    if (typeof value !== 'string') return;
    var normalized = App.normaliserTexteGameplay(value);
    if (!normalized || seen[normalized]) return;
    seen[normalized] = true;
    out.push(normalized);
  });

  return out;
};

/**
 * Parse la configuration gameplay depuis DATA.meta.gameplay.
 * Met en cache la version normalisee.
 * @returns {{
 *   tags:Array<{id:string,label_en:string,label_fr:string,aliases_en:string[],aliases_fr:string[]}>,
 *   tagMap:Object<string, Object>,
 *   orderMap:Object<string, number>,
 *   rules:Array<{tag:string,keywords:string[]}>,
 *   overrides:Object<string, string[]>,
 *   fallbackTag:string
 * }}
 */
App.getGameplayConfig = function () {
  if (App._gameplayConfigCache) return App._gameplayConfigCache;

  var raw = (DATA && DATA.meta && DATA.meta.gameplay) ? DATA.meta.gameplay : {};
  var rawTags = Array.isArray(raw.tags) ? raw.tags : [];
  var tagMap = {};
  var tags = [];

  rawTags.forEach(function (entry) {
    if (!entry || typeof entry !== 'object') return;
    var id = (typeof entry.id === 'string' ? entry.id.trim() : '');
    if (!id || tagMap[id]) return;

    var normalizedTag = {
      id: id,
      label_en: typeof entry.label_en === 'string' && entry.label_en.trim() ? entry.label_en.trim() : id,
      label_fr: typeof entry.label_fr === 'string' && entry.label_fr.trim() ? entry.label_fr.trim() : (typeof entry.label_en === 'string' ? entry.label_en.trim() : id),
      aliases_en: App.normaliserListeGameplay(entry.aliases_en),
      aliases_fr: App.normaliserListeGameplay(entry.aliases_fr)
    };

    tags.push(normalizedTag);
    tagMap[id] = normalizedTag;
  });

  if (!tags.length) {
    var fallback = {
      id: 'other',
      label_en: 'Other mechanics',
      label_fr: 'Autres mecaniques',
      aliases_en: [],
      aliases_fr: []
    };
    tags.push(fallback);
    tagMap[fallback.id] = fallback;
  }

  var orderMap = {};
  tags.forEach(function (tag, idx) {
    orderMap[tag.id] = idx;
  });

  var rawRules = Array.isArray(raw.rules) ? raw.rules : [];
  var rules = [];
  rawRules.forEach(function (entry) {
    if (!entry || typeof entry !== 'object') return;
    var tag = typeof entry.tag === 'string' ? entry.tag.trim() : '';
    if (!tag || !tagMap[tag]) return;

    var keywords = App.normaliserListeGameplay(
      []
        .concat(Array.isArray(entry.keywords_en) ? entry.keywords_en : [])
        .concat(Array.isArray(entry.keywords_fr) ? entry.keywords_fr : [])
    );

    if (!keywords.length) return;
    rules.push({ tag: tag, keywords: keywords });
  });

  var overrides = {};
  if (raw.tag_overrides && typeof raw.tag_overrides === 'object' && !Array.isArray(raw.tag_overrides)) {
    Object.keys(raw.tag_overrides).forEach(function (id) {
      var list = raw.tag_overrides[id];
      if (!Array.isArray(list)) return;

      var cleaned = [];
      var seen = {};
      list.forEach(function (tagId) {
        if (typeof tagId !== 'string') return;
        var cleanTag = tagId.trim();
        if (!cleanTag || !tagMap[cleanTag] || seen[cleanTag]) return;
        seen[cleanTag] = true;
        cleaned.push(cleanTag);
      });

      if (cleaned.length) overrides[String(id)] = cleaned;
    });
  }

  var fallbackTag = tagMap.other ? 'other' : tags[0].id;
  App._gameplayConfigCache = {
    tags: tags,
    tagMap: tagMap,
    orderMap: orderMap,
    rules: rules,
    overrides: overrides,
    fallbackTag: fallbackTag
  };

  return App._gameplayConfigCache;
};

/**
 * Retourne le catalogue des tags gameplay.
 * @returns {Array}
 */
App.getGameplayTagCatalog = function () {
  return App.getGameplayConfig().tags.slice();
};

/**
 * Retourne le label localise d'un tag gameplay.
 * @param {string} tagId
 * @returns {string}
 */
App.getGameplayTagLabel = function (tagId) {
  var cfg = App.getGameplayConfig();
  var tag = cfg.tagMap[tagId];
  if (!tag) return tagId || '';
  return App.champ(tag, 'label') || tag.label_en || tag.id;
};

/**
 * Retourne une chaine de recherche pour un tag gameplay.
 * @param {string} tagId
 * @returns {string}
 */
App.getGameplayTagSearchText = function (tagId) {
  var cfg = App.getGameplayConfig();
  var tag = cfg.tagMap[tagId];
  if (!tag) return '';

  var parts = [tag.id, tag.label_en, tag.label_fr]
    .concat(tag.aliases_en || [])
    .concat(tag.aliases_fr || []);

  return App.normaliserTexteGameplay(parts.join(' '));
};

/**
 * Nettoie l'etat des filtres gameplay (mode + tags).
 */
App.nettoyerFiltresGameplay = function () {
  if (!App.etat) return;

  var cfg = App.getGameplayConfig();
  if (['any', 'all'].indexOf(App.etat.filtreGameplayMode) === -1) {
    App.etat.filtreGameplayMode = 'any';
  }

  var selected = Array.isArray(App.etat.filtreGameplayTags) ? App.etat.filtreGameplayTags : [];
  var seen = {};
  var cleaned = [];

  selected.forEach(function (tagId) {
    if (typeof tagId !== 'string') return;
    var id = tagId.trim();
    if (!id || !cfg.tagMap[id] || seen[id]) return;
    seen[id] = true;
    cleaned.push(id);
  });

  cleaned.sort(function (a, b) {
    return (cfg.orderMap[a] || 0) - (cfg.orderMap[b] || 0);
  });

  App.etat.filtreGameplayTags = cleaned;
};

/**
 * Resout les tags gameplay d'un picto.
 * Combine: tags explicites + overrides + matching par regles.
 * @param {Object} picto
 * @returns {string[]}
 */
App.resolveGameplayTags = function (picto) {
  if (!picto || typeof picto !== 'object') return [];
  if (Array.isArray(picto._gameplayTags) && picto._gameplayTags.length) {
    return picto._gameplayTags.slice();
  }

  var cfg = App.getGameplayConfig();
  var set = {};
  var resolved = [];

  function addTag(tagId) {
    if (!tagId || !cfg.tagMap[tagId] || set[tagId]) return;
    set[tagId] = true;
    resolved.push(tagId);
  }

  if (Array.isArray(picto.tags_gameplay)) {
    picto.tags_gameplay.forEach(function (tagId) {
      if (typeof tagId === 'string') addTag(tagId.trim());
    });
  }

  var override = cfg.overrides[String(picto.id)];
  if (Array.isArray(override)) {
    override.forEach(addTag);
  }

  var corpus = App.normaliserTexteGameplay(
    [
      picto.nom_en || '',
      picto.nom_fr || '',
      picto.effet_en || '',
      picto.effet_fr || '',
      picto.obtention_en || '',
      picto.obtention_fr || ''
    ].join(' ')
  );
  var padded = ' ' + corpus + ' ';

  cfg.rules.forEach(function (rule) {
    for (var i = 0; i < rule.keywords.length; i++) {
      var keyword = rule.keywords[i];
      if (!keyword) continue;
      if (padded.indexOf(' ' + keyword + ' ') !== -1) {
        addTag(rule.tag);
        break;
      }
    }
  });

  if (!resolved.length && cfg.fallbackTag) {
    addTag(cfg.fallbackTag);
  }

  resolved.sort(function (a, b) {
    return (cfg.orderMap[a] || 0) - (cfg.orderMap[b] || 0);
  });

  picto._gameplayTags = resolved.slice();
  return resolved;
};

/**
 * Toggle un tag dans la selection active des filtres gameplay.
 * @param {string} tagId
 */
App.toggleFiltreGameplayTag = function (tagId) {
  if (!tagId) return;
  App.nettoyerFiltresGameplay();

  var i = App.etat.filtreGameplayTags.indexOf(tagId);
  if (i === -1) {
    App.etat.filtreGameplayTags.push(tagId);
  } else {
    App.etat.filtreGameplayTags.splice(i, 1);
  }

  App.nettoyerFiltresGameplay();
  App.rendreFiltresGameplay();
  App.appliquerFiltres();
};

/**
 * Vide les tags gameplay selectionnes.
 */
App.viderFiltresGameplay = function () {
  App.etat.filtreGameplayTags = [];
  App.rendreFiltresGameplay();
  App.appliquerFiltres();
};

/**
 * Met a jour le resume du filtre gameplay.
 */
App.mettreAJourResumeFiltresGameplay = function () {
  var summary = document.getElementById('gameplay-tag-summary');
  if (!summary) return;

  App.nettoyerFiltresGameplay();
  var n = App.etat.filtreGameplayTags.length;
  summary.textContent = n
    ? App.t('gameplay_selection_count', { n: n })
    : App.t('gameplay_selection_none');
};

/**
 * Rend les boutons de tags gameplay.
 */
App.rendreFiltresGameplay = function () {
  if (typeof document === 'undefined') return;

  var container = document.getElementById('gameplay-tag-buttons');
  var modeSelect = document.getElementById('filtre-gameplay-mode');
  if (!container || !modeSelect) return;

  App.nettoyerFiltresGameplay();
  modeSelect.value = App.etat.filtreGameplayMode;

  while (container.firstChild) container.removeChild(container.firstChild);
  var tags = App.getGameplayTagCatalog();

  tags.forEach(function (tag) {
    var active = App.etat.filtreGameplayTags.indexOf(tag.id) !== -1;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-filtre btn-filtre-gameplay' + (active ? ' actif' : '');
    btn.dataset.gameplayTag = tag.id;
    btn.textContent = App.getGameplayTagLabel(tag.id);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    btn.addEventListener('click', function () {
      App.toggleFiltreGameplayTag(tag.id);
    });
    container.appendChild(btn);
  });

  App.mettreAJourResumeFiltresGameplay();
};

/**
 * Construit une route de collecte (manquants) groupee par zone/flag.
 * @param {Object[]} pictos
 * @returns {Array<{zoneKey:string,zoneLabel:string,total:number,flags:Array<{flagKey:string,flagLabel:string,total:number,pictos:Array<{id:number,nom:string,lumina:number,tags:string[]}>}>}>}
 */
App.construireRouteCollecte = function (pictos) {
  if (!Array.isArray(pictos)) return [];

  var groupsByZone = {};

  pictos.forEach(function (picto) {
    if (!picto || typeof picto !== 'object') return;

    var zoneKey = App.zoneKey(picto) || '__unknown__';
    var zoneLabel = App.champ(picto, 'zone') || App.t('zone_unknown');
    var flagLabel = App.champ(picto, 'flag') || '';
    var flagKey = flagLabel || '__no_flag__';

    if (!groupsByZone[zoneKey]) {
      groupsByZone[zoneKey] = {
        zoneKey: zoneKey,
        zoneLabel: zoneLabel,
        total: 0,
        flags: {}
      };
    }

    var zoneGroup = groupsByZone[zoneKey];
    zoneGroup.total++;

    if (!zoneGroup.flags[flagKey]) {
      zoneGroup.flags[flagKey] = {
        flagKey: flagKey,
        flagLabel: flagLabel,
        total: 0,
        pictos: []
      };
    }

    var flagGroup = zoneGroup.flags[flagKey];
    flagGroup.total++;
    flagGroup.pictos.push({
      id: picto.id,
      nom: App.champ(picto, 'nom'),
      lumina: typeof App.getLuminaCost === 'function' ? App.getLuminaCost(picto) : 0,
      tags: App.resolveGameplayTags(picto)
    });
  });

  var zones = Object.keys(groupsByZone).map(function (zoneKey) {
    var zoneGroup = groupsByZone[zoneKey];
    var flags = Object.keys(zoneGroup.flags).map(function (flagKey) {
      var flagGroup = zoneGroup.flags[flagKey];
      flagGroup.pictos.sort(function (a, b) { return a.id - b.id; });
      return flagGroup;
    });

    flags.sort(function (a, b) {
      if (a.flagKey === '__no_flag__') return 1;
      if (b.flagKey === '__no_flag__') return -1;
      return a.flagLabel.localeCompare(b.flagLabel);
    });

    return {
      zoneKey: zoneGroup.zoneKey,
      zoneLabel: zoneGroup.zoneLabel,
      total: zoneGroup.total,
      flags: flags
    };
  });

  zones.sort(function (a, b) {
    return a.zoneLabel.localeCompare(b.zoneLabel);
  });

  return zones;
};

/**
 * Retourne les pictos manquants et visibles dans la grille.
 * @returns {Object[]}
 */
App.getPictosManquantsVisibles = function () {
  if (!Array.isArray(App.toutes_cartes) || !App.toutes_cartes.length) return [];

  var pictos = [];
  App.toutes_cartes.forEach(function (carte) {
    if (!carte || carte.classList.contains('cachee')) return;
    var picto = carte._picto;
    if (!picto || App.etat.possedes.has(picto.id)) return;
    pictos.push(picto);
  });

  return pictos;
};

/**
 * Rend la section de route de collecte.
 */
App.rendreRouteCollecte = function () {
  if (typeof document === 'undefined') return;

  var section = document.getElementById('farm-route');
  if (!section) return;

  var title = document.getElementById('farm-route-title');
  var subtitle = document.getElementById('farm-route-subtitle');
  var meta = document.getElementById('farm-route-meta');
  var empty = document.getElementById('farm-route-empty');
  var groupsContainer = document.getElementById('farm-route-groups');
  if (!title || !subtitle || !meta || !empty || !groupsContainer) return;

  title.textContent = App.t('farm_route_title');
  subtitle.textContent = App.t('farm_route_subtitle');

  while (groupsContainer.firstChild) groupsContainer.removeChild(groupsContainer.firstChild);

  var missing = App.getPictosManquantsVisibles();
  var groups = App.construireRouteCollecte(missing);

  meta.textContent = App.t('farm_route_meta', { n: missing.length, zones: groups.length });
  empty.textContent = App.t('farm_route_empty');
  empty.classList.toggle('visible', missing.length === 0);

  if (!missing.length) return;

  groups.forEach(function (zone) {
    var zoneBlock = document.createElement('article');
    zoneBlock.className = 'farm-route-zone';
    zoneBlock.dataset.zoneKey = zone.zoneKey;

    var zoneHead = document.createElement('div');
    zoneHead.className = 'farm-route-zone-head';

    var zoneTitle = document.createElement('div');
    zoneTitle.className = 'farm-route-zone-title';
    zoneTitle.textContent = zone.zoneLabel;
    zoneHead.appendChild(zoneTitle);

    var zoneCount = document.createElement('div');
    zoneCount.className = 'farm-route-zone-count';
    zoneCount.textContent = App.t('farm_route_zone_count', { n: zone.total });
    zoneHead.appendChild(zoneCount);
    zoneBlock.appendChild(zoneHead);

    zone.flags.forEach(function (flag) {
      var flagBlock = document.createElement('div');
      flagBlock.className = 'farm-route-flag';
      flagBlock.dataset.flagKey = flag.flagKey;

      var flagTitle = document.createElement('div');
      flagTitle.className = 'farm-route-flag-title';
      flagTitle.textContent = (flag.flagKey === '__no_flag__')
        ? App.t('farm_route_no_flag')
        : flag.flagLabel;
      flagBlock.appendChild(flagTitle);

      var list = document.createElement('ul');
      list.className = 'farm-route-items';

      flag.pictos.forEach(function (item) {
        var li = document.createElement('li');
        li.className = 'farm-route-item';
        li.dataset.id = String(item.id);

        var primary = document.createElement('span');
        primary.className = 'farm-route-item-main';
        primary.textContent = '#' + String(item.id).padStart(3, '0') + ' - ' + item.nom;
        li.appendChild(primary);

        var details = [];
        details.push(App.t('farm_route_lumina_tag', { n: item.lumina }));
        if (item.tags && item.tags.length) {
          var translatedTags = item.tags.map(function (tagId) { return App.getGameplayTagLabel(tagId); });
          details.push(App.t('farm_route_tags_tag', { tags: translatedTags.join(', ') }));
        }

        var secondary = document.createElement('span');
        secondary.className = 'farm-route-item-meta';
        secondary.textContent = details.join(' · ');
        li.appendChild(secondary);
        list.appendChild(li);
      });

      flagBlock.appendChild(list);
      zoneBlock.appendChild(flagBlock);
    });

    groupsContainer.appendChild(zoneBlock);
  });
};
