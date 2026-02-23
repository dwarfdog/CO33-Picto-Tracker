// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  UI-TRANSLATE — Traduction des éléments statiques du DOM
//  Dépend de : App (app.js), DATA (skills-data.js)
// ══════════════════════════════════════════════════════

/**
 * Met à jour tous les textes statiques du DOM pour la langue courante.
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

  // Tri
  var triSelect = document.getElementById('tri-select');
  var sortKeys = [
    'sort_id_asc', 'sort_id_desc', 'sort_name_asc', 'sort_name_desc',
    'sort_zone_asc', 'sort_zone_desc', 'sort_owned_first', 'sort_missing_first',
    'sort_lumina_asc', 'sort_lumina_desc'
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
  document.getElementById('btn-export').textContent = App.t('btn_export');
  document.getElementById('btn-import').textContent = App.t('btn_import');
  document.getElementById('btn-reset').textContent = App.t('btn_reset');

  // Compteurs — mise à jour du label sans détruire le <strong>
  var cptItems = document.querySelectorAll('.compteur-item');
  cptItems[0].querySelector('span').innerHTML =
    App.t('counter_owned') + ' <strong id="cpt-possedes">' + document.getElementById('cpt-possedes').textContent + '</strong>';
  cptItems[1].querySelector('span').innerHTML =
    App.t('counter_missing') + ' <strong id="cpt-manquants">' + document.getElementById('cpt-manquants').textContent + '</strong>';
  cptItems[2].querySelector('span').innerHTML =
    App.t('counter_shown') + ' <strong id="cpt-affiches">' + document.getElementById('cpt-affiches').textContent + '</strong>';

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
  document.querySelector('#tt-sec-obtention .tooltip-section-titre').textContent = App.t('tooltip_obtain');
  document.getElementById('tooltip-fermer').setAttribute('aria-label', App.t('tooltip_close'));

  // Modal import
  document.querySelector('.import-titre').textContent = App.t('import_title');
  document.querySelector('.import-description').textContent = App.t('import_desc');
  document.getElementById('import-textarea').placeholder = App.t('import_placeholder');
  document.getElementById('btn-import-valider').textContent = App.t('import_apply');
  document.getElementById('btn-import-fichier').textContent = App.t('import_file');
  document.getElementById('btn-import-annuler').textContent = App.t('import_cancel');

  // Footer
  document.querySelector('footer').innerHTML = App.t('footer_text');

  // Zone select
  App.initialiserSelectZone();
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

  var zonesSet = {};
  DATA.pictos.forEach(function (p) {
    if (p.zone) zonesSet[p.zone] = true;
  });
  var zones = Object.keys(zonesSet).sort();

  zones.forEach(function (zone) {
    var opt = document.createElement('option');
    opt.value = zone;
    opt.textContent = zone;
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
  container.innerHTML = '';

  App.SUPPORTED_LANGS.forEach(function (code) {
    var btn = document.createElement('button');
    btn.className = 'btn-lang' + (code === App.LANG ? ' actif' : '');
    btn.dataset.lang = code;
    btn.title = (App.langs[code] && App.langs[code].lang_name) || code.toUpperCase();
    btn.textContent = code.toUpperCase();
    container.appendChild(btn);
  });
};
