// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  UI-TRANSLATE — Traduction des éléments statiques du DOM
//  Dépend de : App (app.js), DATA (skills-data.js)
// ══════════════════════════════════════════════════════

/**
 * Met à jour tous les textes statiques du DOM pour la langue courante.
 * Aucun innerHTML avec données dynamiques — construction DOM pure.
 */
App.appliquerTraductions = function () {
  document.title = App.t('page_title');
  document.documentElement.lang = App.LANG;

  // Header — s'assurer qu'un nœud texte existe avant le <span>
  var h1 = document.querySelector('h1');
  if (h1.firstChild.nodeType !== 3) {
    h1.insertBefore(document.createTextNode(''), h1.firstChild);
  }
  h1.firstChild.textContent = App.t('header_title');
  h1.querySelector('span').textContent = App.t('header_subtitle');

  // Progression
  document.querySelector('.progression-label').textContent = App.t('progression_label');

  // Recherche
  var recherche = document.getElementById('recherche');
  recherche.placeholder = App.t('search_placeholder');
  recherche.setAttribute('aria-label', App.t('search_placeholder'));
  document.getElementById('lbl-recherche').textContent = App.t('label_search');
  document.getElementById('lbl-filtre-zone').textContent = App.t('label_zone_filter');
  document.getElementById('lbl-tri-select').textContent = App.t('label_sort_order');
  document.getElementById('lbl-profil-select').textContent = App.t('label_profile_select');

  // Tri
  var triSelect = document.getElementById('tri-select');
  var sortKeys = [
    'sort_id_asc', 'sort_id_desc', 'sort_name_asc', 'sort_name_desc',
    'sort_zone_asc', 'sort_zone_desc', 'sort_owned_first', 'sort_missing_first',
    'sort_build_first', 'sort_lumina_asc', 'sort_lumina_desc'
  ];
  for (var i = 0; i < sortKeys.length; i++) {
    triSelect.options[i].textContent = App.t(sortKeys[i]);
  }

  // Filtres
  var filtreGroupes = document.querySelectorAll('.filtre-groupe');
  filtreGroupes[0].querySelector('.filtre-label').textContent = App.t('filter_label');
  var filterBtns = document.querySelectorAll('.btn-filtre[data-filtre]');
  filterBtns[0].textContent = App.t('filter_all');
  filterBtns[1].textContent = App.t('filter_owned');
  filterBtns[2].textContent = App.t('filter_missing');

  // Groupe Progression
  filtreGroupes[1].querySelector('.filtre-label').textContent = App.t('progression_group_label');

  // Boutons
  document.getElementById('btn-profil-add').textContent = App.t('btn_profile_add');
  document.getElementById('btn-profil-add').setAttribute('aria-label', App.t('btn_profile_add'));
  document.getElementById('btn-export').textContent = App.t('btn_export');
  document.getElementById('btn-import').textContent = App.t('btn_import');
  document.getElementById('btn-reset').textContent = App.t('btn_reset');

  // Planificateur Lumina
  document.getElementById('lumina-planner-title').textContent = App.t('lumina_planner_title');
  document.getElementById('lbl-lumina-budget').textContent = App.t('lumina_budget_label');
  document.getElementById('lumina-budget').setAttribute('aria-label', App.t('lumina_budget_label'));
  document.getElementById('btn-lumina-clear').textContent = App.t('lumina_clear_build');
  document.getElementById('btn-lumina-clear').setAttribute('aria-label', App.t('lumina_clear_build'));
  document.getElementById('lumina-filter-label').textContent = App.t('lumina_filter_label');

  var luminaFilterButtons = document.querySelectorAll('.btn-filtre-build[data-build-filtre]');
  luminaFilterButtons[0].textContent = App.t('lumina_filter_all');
  luminaFilterButtons[1].textContent = App.t('lumina_filter_selected');
  luminaFilterButtons[2].textContent = App.t('lumina_filter_unselected');

  // Filtres gameplay experts
  document.getElementById('gameplay-filters-title').textContent = App.t('gameplay_filters_title');
  document.getElementById('gameplay-filters-hint').textContent = App.t('gameplay_filters_hint');
  document.getElementById('lbl-gameplay-mode').textContent = App.t('gameplay_mode_label');

  var gameplayModeSelect = document.getElementById('filtre-gameplay-mode');
  gameplayModeSelect.options[0].textContent = App.t('gameplay_mode_any');
  gameplayModeSelect.options[1].textContent = App.t('gameplay_mode_all');

  var btnGameplayClear = document.getElementById('btn-gameplay-clear');
  btnGameplayClear.textContent = App.t('gameplay_clear');
  btnGameplayClear.setAttribute('aria-label', App.t('gameplay_clear'));

  if (typeof App.rendreFiltresGameplay === 'function') {
    App.rendreFiltresGameplay();
  }

  // Compteurs — mise à jour du label via textContent (plus de innerHTML)
  var cptItems = document.querySelectorAll('.compteur-item');
  var cptLabel0 = cptItems[0].querySelector('.cpt-label');
  if (cptLabel0) cptLabel0.textContent = App.t('counter_owned') + ' ';
  var cptLabel1 = cptItems[1].querySelector('.cpt-label');
  if (cptLabel1) cptLabel1.textContent = App.t('counter_missing') + ' ';
  var cptLabel2 = cptItems[2].querySelector('.cpt-label');
  if (cptLabel2) cptLabel2.textContent = App.t('counter_shown') + ' ';

  // Légende
  var legendItems = document.querySelectorAll('.legende-item');
  legendItems[0].querySelector('.legende-touche').textContent = App.t('legend_click');
  legendItems[0].querySelector('.legende-texte').textContent = App.t('legend_check');
  legendItems[1].querySelector('.legende-texte').textContent = App.t('legend_detail');
  legendItems[2].querySelector('.legende-touche').textContent = App.t('legend_space');
  legendItems[2].querySelector('.legende-texte').textContent = App.t('legend_space_desc');

  // État vide
  document.querySelector('.etat-vide p').textContent = App.t('empty_state');

  // Tooltip section titres
  document.querySelector('#tt-sec-effet .tooltip-section-titre').textContent = App.t('tooltip_effect');
  document.querySelector('#tt-sec-stats .tooltip-section-titre').textContent = App.t('tooltip_stats');
  document.querySelector('#tt-sec-zone .tooltip-section-titre').textContent = App.t('tooltip_zone');
  document.querySelector('#tt-sec-lumina .tooltip-section-titre').textContent = App.t('tooltip_lumina');
  document.querySelector('#tt-sec-flag .tooltip-section-titre').textContent = App.t('tooltip_flag');
  document.querySelector('#tt-sec-obtention .tooltip-section-titre').textContent = App.t('tooltip_obtain');
  document.getElementById('tooltip-fermer').setAttribute('aria-label', App.t('tooltip_close'));

  // Modal import
  document.getElementById('import-title').textContent = App.t('import_title');
  document.getElementById('import-description').textContent = App.t('import_desc');
  document.getElementById('import-textarea').placeholder = App.t('import_placeholder');
  document.getElementById('btn-import-valider').textContent = App.t('import_apply');
  document.getElementById('btn-import-fichier').textContent = App.t('import_file');
  document.getElementById('btn-import-annuler').textContent = App.t('import_cancel');

  // Modal export
  document.getElementById('export-title').textContent = App.t('export_title');
  document.getElementById('export-description').textContent = App.t('export_desc');
  document.getElementById('btn-export-copier').textContent = App.t('export_copy');
  document.getElementById('btn-export-fichier').textContent = App.t('export_download');
  document.getElementById('btn-export-fermer').textContent = App.t('export_close');

  // Footer — éléments séparés, sans innerHTML
  var ftData = document.getElementById('ft-data');
  var ftStudio = document.getElementById('ft-studio');
  var ftSave = document.getElementById('ft-save');
  var ftDataset = document.getElementById('ft-dataset');
  var ftLicense = document.getElementById('ft-license');
  var meta = (typeof DATA !== 'undefined' && DATA.meta) ? DATA.meta : {};
  var datasetVersion = meta.dataset_version || 'n/a';
  var gameVersion = meta.game_version || 'n/a';
  var updatedAt = meta.updated_at || 'n/a';
  if (ftData) ftData.textContent = App.t('footer_data');
  if (ftStudio) ftStudio.textContent = App.t('footer_studio');
  if (ftSave) ftSave.textContent = App.t('footer_save');
  if (ftDataset) {
    ftDataset.textContent = App.t('footer_dataset_line', {
      dataset: datasetVersion,
      game: gameVersion,
      date: updatedAt
    });
  }
  if (ftLicense) ftLicense.textContent = App.t('footer_license');

  // Zone select
  App.initialiserSelectZone();

  // Profils
  App.rafraichirSelectProfils();

  // Planificateur Lumina
  if (typeof App.mettreAJourPlanificateurLumina === 'function') {
    App.mettreAJourPlanificateurLumina();
  }

  // Nouveautes dataset
  if (typeof App.rendreNouveautesDataset === 'function') {
    App.rendreNouveautesDataset();
  }

  // Route de collecte
  if (typeof App.rendreRouteCollecte === 'function') {
    App.rendreRouteCollecte();
  }
};

/**
 * Initialise le sélecteur de zone à partir des zones présentes dans DATA.
 */
App.initialiserSelectZone = function () {
  var sel = document.getElementById('filtre-zone');
  var valeurCourante = sel.value;

  // Supprimer les options dynamiques (garder la première = "Toutes les zones")
  while (sel.options.length > 1) sel.remove(1);
  sel.options[0].textContent = App.t('zone_all');

  var zonesMap = {};
  DATA.pictos.forEach(function (p) {
    var zoneKey = App.zoneKey(p);
    if (zoneKey && !zonesMap[zoneKey]) {
      zonesMap[zoneKey] = App.champ(p, 'zone');
    }
  });

  // Trier par nom traduit
  var zoneKeys = Object.keys(zonesMap).sort(function (a, b) {
    return zonesMap[a].localeCompare(zonesMap[b]);
  });

  zoneKeys.forEach(function (zoneKey) {
    var opt = document.createElement('option');
    opt.value = zoneKey;
    opt.textContent = zonesMap[zoneKey];
    sel.appendChild(opt);
  });

  sel.value = valeurCourante;
};

/**
 * Génère dynamiquement les boutons du switcher de langue
 * à partir de App.SUPPORTED_LANGS.
 * Appelé une seule fois au boot.
 */
App.genererBoutonsLangue = function () {
  var container = document.getElementById('lang-switcher');
  while (container.firstChild) container.removeChild(container.firstChild);

  App.SUPPORTED_LANGS.forEach(function (code) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-lang' + (code === App.LANG ? ' actif' : '');
    btn.dataset.lang = code;
    btn.title = (App.langs[code] && App.langs[code].lang_name) || code.toUpperCase();
    btn.textContent = code.toUpperCase();
    container.appendChild(btn);
  });
};
