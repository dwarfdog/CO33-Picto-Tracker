// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  FILTERS — Filtrage et tri des cartes
//  Dépend de : App (app.js)
// ══════════════════════════════════════════════════════

/**
 * Trie les cartes dans la grille selon le critère actif (App.etat.tri).
 */
App.appliquerTri = function () {
  var grille = document.getElementById('grille');
  var tri = App.etat.tri;

  App.toutes_cartes.sort(function (a, b) {
    var pa = a._picto;
    var pb = b._picto;
    var oa, ob;

    switch (tri) {
      case 'id-asc':   return pa.id - pb.id;
      case 'id-desc':  return pb.id - pa.id;
      case 'nom-asc':
        return App.normaliserTexte(App.champ(pa, 'nom'))
          .localeCompare(App.normaliserTexte(App.champ(pb, 'nom')));
      case 'nom-desc':
        return App.normaliserTexte(App.champ(pb, 'nom'))
          .localeCompare(App.normaliserTexte(App.champ(pa, 'nom')));
      case 'zone-asc':
        return App.normaliserTexte(App.champ(pa, 'zone'))
          .localeCompare(App.normaliserTexte(App.champ(pb, 'zone')));
      case 'zone-desc':
        return App.normaliserTexte(App.champ(pb, 'zone'))
          .localeCompare(App.normaliserTexte(App.champ(pa, 'zone')));
      case 'possedes-first':
        oa = App.etat.possedes.has(pa.id) ? 0 : 1;
        ob = App.etat.possedes.has(pb.id) ? 0 : 1;
        return oa !== ob ? oa - ob : pa.id - pb.id;
      case 'manquants-first':
        oa = App.etat.possedes.has(pa.id) ? 1 : 0;
        ob = App.etat.possedes.has(pb.id) ? 1 : 0;
        return oa !== ob ? oa - ob : pa.id - pb.id;
      case 'lumina-asc':
        return (pa.lumina || 0) - (pb.lumina || 0) || pa.id - pb.id;
      case 'lumina-desc':
        return (pb.lumina || 0) - (pa.lumina || 0) || pa.id - pb.id;
      default: return 0;
    }
  });

  App.toutes_cartes.forEach(function (carte) { grille.appendChild(carte); });
};

/**
 * Applique tous les filtres actifs : collection, zone, recherche.
 * Met à jour le compteur d'affichés et l'état vide.
 */
App.appliquerFiltres = function () {
  var rechercheNorm = App.normaliserTexte(App.etat.recherche);
  var nbAffiches = 0;

  App.toutes_cartes.forEach(function (carte) {
    var picto = carte._picto;
    var possede = App.etat.possedes.has(picto.id);

    // Filtre collection
    var ok = true;
    if (App.etat.filtreCollection === 'possedes' && !possede) ok = false;
    if (App.etat.filtreCollection === 'manquants' && possede) ok = false;

    // Filtre zone
    if (App.etat.filtreZone && picto.zone !== App.etat.filtreZone) ok = false;

    // Filtre recherche (bilingue, toutes données)
    if (rechercheNorm) {
      var haystack = App.normaliserTexte(
        (picto.nom_fr || '') + ' ' + (picto.nom_en || '') + ' ' +
        (picto.effet_en || '') + ' ' + (picto.effet_fr || '') + ' ' +
        (picto.zone || '') + ' ' + (picto.zone_fr || '') + ' ' +
        (picto.localisation_en || '') + ' ' + (picto.localisation_fr || '') + ' ' +
        (picto.flag_en || '') + ' ' + (picto.flag_fr || '')
      );
      if (haystack.indexOf(rechercheNorm) === -1) ok = false;
    }

    carte.classList.toggle('cachee', !ok);
    if (ok) nbAffiches++;
  });

  document.getElementById('cpt-affiches').textContent = nbAffiches;
  document.getElementById('etat-vide').classList.toggle('visible', nbAffiches === 0);
};
