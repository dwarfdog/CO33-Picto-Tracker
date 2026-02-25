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

  // Cache des éléments DOM fréquemment accédés (AVANT rendreGrille/progression)
  App._dom = {
    nbPossedes:  document.getElementById('nb-possedes'),
    nbTotal:     document.getElementById('nb-total'),
    barreProg:   document.getElementById('barre-prog'),
    progPct:     document.getElementById('prog-pct'),
    cptPossedes: document.getElementById('cpt-possedes'),
    cptManquants: document.getElementById('cpt-manquants'),
    cptAffiches: document.getElementById('cpt-affiches'),
    etatVide:    document.getElementById('etat-vide'),
    grille:      document.getElementById('grille'),
    toast:       document.getElementById('toast'),
  };

  // Rendu de la grille et mise à jour de la progression
  App.rendreGrille();
  App.mettreAJourProgression();
  if (typeof App.mettreAJourPlanificateurLumina === 'function') {
    App.mettreAJourPlanificateurLumina();
  }

  // Attachement des événements
  App.attacher();
})();
