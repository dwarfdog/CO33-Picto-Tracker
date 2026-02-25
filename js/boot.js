// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  BOOT — Séquence d'initialisation
//  Chargé en dernier, après tous les modules.
// ══════════════════════════════════════════════════════
(function () {
  // Guard : vérifier que les données sont chargées
  /**
   * Affiche une erreur fatale dans le body (construction DOM pure).
   * @param {string[]} lines - Lignes de texte à afficher
   */
  function afficherErreurFatale(lines) {
    var p = document.createElement('p');
    p.style.cssText = 'color:#c0392b;text-align:center;padding:80px 20px;font-family:sans-serif;font-size:1.2rem;';
    lines.forEach(function (line, i) {
      if (i > 0) p.appendChild(document.createElement('br'));
      p.appendChild(document.createTextNode(line));
    });
    while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
    document.body.appendChild(p);
  }

  if (typeof DATA === 'undefined' || !DATA.pictos) {
    afficherErreurFatale([
      'Error: data could not be loaded.',
      'Erreur\u00a0: les donn\u00e9es n\u2019ont pas pu \u00eatre charg\u00e9es.',
      'V\u00e9rifiez que le fichier js/datas/skills-data.js est pr\u00e9sent.'
    ]);
    return;
  }

  // Validation de la structure des données
  var sample = DATA.pictos[0];
  if (!sample || typeof sample.id !== 'number' || !sample.nom_en) {
    afficherErreurFatale([
      'Error: data format is invalid.',
      'Erreur\u00a0: le format des donn\u00e9es est invalide.',
      'V\u00e9rifiez la structure de js/datas/skills-data.js.'
    ]);
    return;
  }

  // Construction des caches de données (IDs valides, lookup par ID)
  App.construireCaches();

  // Initialisation des templates SVG réutilisables
  App.initSvgTemplates();

  // Détection de la langue
  App.LANG = App.detecterLangue();

  // Construction du cache des labels de stats
  App._cachedStatLabels = App.getStatLabels();

  // Construction de l'index de recherche pré-normalisé
  App.buildSearchIndex();

  // Chargement de la progression sauvegardée
  App.chargerSauvegarde();

  // Génération dynamique des boutons de langue
  App.genererBoutonsLangue();

  // Traduction des éléments statiques avant le premier rendu
  App.appliquerTraductions();

  // Cache centralisé des éléments DOM (AVANT rendreGrille/progression)
  App._dom = App.initDomRegistry({
    // Progression
    nbPossedes:  'nb-possedes',
    nbTotal:     'nb-total',
    barreProg:   'barre-prog',
    progPct:     'prog-pct',
    // Compteurs
    cptPossedes: 'cpt-possedes',
    cptManquants:'cpt-manquants',
    cptAffiches: 'cpt-affiches',
    // Grille
    grille:      'grille',
    etatVide:    'etat-vide',
    // Toast
    toast:       'toast',
    // Contrôles
    recherche:       'recherche',
    filtreZone:      'filtre-zone',
    triSelect:       'tri-select',
    profilSelect:    'profil-select',
    btnProfilAdd:    'btn-profil-add',
    btnReset:        'btn-reset',
    // Export / Import
    btnExport:       'btn-export',
    btnImport:       'btn-import',
    importOverlay:   'import-overlay',
    exportOverlay:   'export-overlay',
    importTextarea:  'import-textarea',
    exportTextarea:  'export-textarea',
    importFichier:   'import-fichier',
    btnImportValider:'btn-import-valider',
    btnImportFichier:'btn-import-fichier',
    btnImportAnnuler:'btn-import-annuler',
    btnExportCopier: 'btn-export-copier',
    btnExportFichier:'btn-export-fichier',
    btnExportAll:    'btn-export-all',
    btnExportFermer: 'btn-export-fermer',
    // Tooltip
    tooltipOverlay:  'tooltip-overlay',
    tooltipFermer:   'tooltip-fermer',
    ttBtnPossession: 'tt-btn-possession',
    // Lumina
    luminaBudget:    'lumina-budget',
    btnLuminaClear:  'btn-lumina-clear',
    // Gameplay
    filtreCategorie:   'filtre-categorie',
    filtreObtention:   'filtre-obtention',
    filtreGameplayMode:'filtre-gameplay-mode',
    btnGameplayClear:'btn-gameplay-clear',
    // NG Cycle
    ngCycleSelect:   'ng-cycle-select',
    // Modal prompt
    promptOverlay:   'prompt-overlay',
    promptTitle:     'prompt-title',
    promptInput:     'prompt-input',
    btnPromptOk:     'btn-prompt-ok',
    btnPromptCancel: 'btn-prompt-cancel',
    // Modal confirm
    confirmOverlay:  'confirm-overlay',
    confirmMessage:  'confirm-message',
    btnConfirmYes:   'btn-confirm-yes',
    btnConfirmNo:    'btn-confirm-no',
    // Settings popover
    btnSettings:     'btn-settings',
    settingsPopover: 'settings-popover',
    // Tab bar
    tabBar:          'tab-bar',
    // Grille conteneur
    grilleConteneur: 'grille-conteneur',
    // Export all shortcut (in settings popover)
    btnExportAllShortcut: 'btn-export-all-shortcut',
  });

  // Restaurer les préférences UI persistées dans les contrôles DOM
  if (App._dom.triSelect && App.etat.tri) App._dom.triSelect.value = App.etat.tri;
  if (App._dom.filtreZone && App.etat.filtreZone) App._dom.filtreZone.value = App.etat.filtreZone;
  if (App.etat.filtreCollection && App.etat.filtreCollection !== 'tous') {
    document.querySelectorAll('.btn-filtre[data-filtre]').forEach(function (btn) {
      btn.classList.toggle('actif', btn.dataset.filtre === App.etat.filtreCollection);
    });
  }
  if (App.etat.filtreBuild && App.etat.filtreBuild !== 'tous') {
    document.querySelectorAll('.btn-filtre-build[data-build-filtre]').forEach(function (btn) {
      btn.classList.toggle('actif', btn.dataset.buildFiltre === App.etat.filtreBuild);
    });
  }
  if (App._dom.filtreCategorie && App.etat.filtreCategorie) {
    App._dom.filtreCategorie.value = App.etat.filtreCategorie;
  }
  if (App._dom.filtreObtention && App.etat.filtreObtention) {
    App._dom.filtreObtention.value = App.etat.filtreObtention;
  }
  if (App._dom.filtreGameplayMode && App.etat.filtreGameplayMode) {
    App._dom.filtreGameplayMode.value = App.etat.filtreGameplayMode;
  }
  if (App._dom.ngCycleSelect) {
    App._dom.ngCycleSelect.value = App.etat.ngCycle || 0;
  }

  // Rendu de la grille et mise à jour de la progression
  App.rendreGrille();
  App.mettreAJourProgression();
  if (typeof App.mettreAJourPlanificateurLumina === 'function') {
    App.mettreAJourPlanificateurLumina();
  }
  if (typeof App.rendreCharacterBuilds === 'function') {
    App.rendreCharacterBuilds();
  }

  // Initialiser l'onglet actif
  App.setActiveTab(App.etat.activeTab || 'collection');

  // Attachement des événements
  App.attacher();

  // Enregistrement du Service Worker (PWA offline)
  // Désactivé sur file:// (pas de support SW/CORS hors serveur HTTP)
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js').catch(function (err) {
      console.warn('[SW] Registration failed:', err);
    });
  }
})();
