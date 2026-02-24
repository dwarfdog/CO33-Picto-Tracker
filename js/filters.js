// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  FILTERS — Filtrage et tri des cartes
//  Dépend de : App (app.js)
// ══════════════════════════════════════════════════════

/**
 * Trie les cartes dans la grille selon le critère actif (App.etat.tri).
 * Utilise les index pré-normalisés (_nomNorm, _zoneNorm) pour la performance.
 */
App.appliquerTri = function () {
  var grille = App._dom.grille || document.getElementById('grille');
  var tri = App.etat.tri;

  App.toutes_cartes.sort(function (a, b) {
    var pa = a._picto;
    var pb = b._picto;
    var oa, ob;

    switch (tri) {
      case 'id-asc': return pa.id - pb.id;
      case 'id-desc': return pb.id - pa.id;
      case 'nom-asc':
        return (pa._nomNorm || '').localeCompare(pb._nomNorm || '');
      case 'nom-desc':
        return (pb._nomNorm || '').localeCompare(pa._nomNorm || '');
      case 'zone-asc':
        return (pa._zoneNorm || '').localeCompare(pb._zoneNorm || '');
      case 'zone-desc':
        return (pb._zoneNorm || '').localeCompare(pa._zoneNorm || '');
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
 * Utilise l'index de recherche pré-normalisé (_searchIndex) pour la performance.
 * Met à jour le compteur d'affichés et l'état vide.
 */
App.appliquerFiltres = function () {
  var rechercheNorm = App.etat.recherche ? App.normaliserTexte(App.etat.recherche) : '';
  var nbAffiches = 0;

  App.toutes_cartes.forEach(function (carte) {
    var picto = carte._picto;
    var possede = App.etat.possedes.has(picto.id);

    // Filtre collection
    var ok = true;
    if (App.etat.filtreCollection === 'possedes' && !possede) ok = false;
    if (App.etat.filtreCollection === 'manquants' && possede) ok = false;

    // Filtre zone
    if (App.etat.filtreZone && App.zoneKey(picto) !== App.etat.filtreZone) ok = false;

    // Filtre recherche — utilise l'index pré-calculé
    if (ok && rechercheNorm) {
      if ((picto._searchIndex || '').indexOf(rechercheNorm) === -1) ok = false;
    }

    carte.classList.toggle('cachee', !ok);
    if (ok) nbAffiches++;
  });

  var dom = App._dom;
  dom.cptAffiches.textContent = nbAffiches;
  dom.etatVide.classList.toggle('visible', nbAffiches === 0);
};
