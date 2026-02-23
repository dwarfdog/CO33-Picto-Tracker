// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  BOOT — Séquence d'initialisation
//  Chargé en dernier, après tous les modules.
// ══════════════════════════════════════════════════════
(function () {
  // Guard : vérifier que les données sont chargées
  if (typeof DATA === 'undefined' || !DATA.pictos) {
    document.body.innerHTML =
      '<p style="color:#c0392b;text-align:center;padding:80px 20px;font-family:sans-serif;font-size:1.2rem;">' +
      'Error: data could not be loaded.<br>' +
      'Erreur : les données n\'ont pas pu être chargées.<br>' +
      'Vérifiez que le fichier <code>js/datas/skills-data.js</code> est présent.</p>';
    return;
  }

  // Détection de la langue
  App.LANG = App.detecterLangue();

  // Chargement de la progression sauvegardée
  App.chargerSauvegarde();

  // Génération dynamique des boutons de langue
  App.genererBoutonsLangue();

  // Traduction des éléments statiques avant le premier rendu
  App.appliquerTraductions();

  // Rendu de la grille et mise à jour de la progression
  App.rendreGrille();
  App.mettreAJourProgression();

  // Attachement des événements
  App.attacher();
})();
