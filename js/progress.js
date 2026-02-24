// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  PROGRESS — Barre de progression et compteurs
//  Dépend de : App (app.js), DATA (skills-data.js)
// ══════════════════════════════════════════════════════

/**
 * Met à jour la barre de progression, les compteurs et le pourcentage.
 * Utilise le cache DOM (App._dom) pour éviter les lookups répétés.
 */
App.mettreAJourProgression = function () {
  var n = App.etat.possedes.size;
  var total = DATA.pictos.length;
  var pct = total ? (n / total * 100).toFixed(1) : '0.0';
  var dom = App._dom;

  dom.nbPossedes.textContent = n;
  dom.nbTotal.textContent = total;
  dom.barreProg.style.width = pct + '%';
  dom.progPct.textContent = App.t('progression_pct', { pct: pct });
  dom.cptPossedes.textContent = n;
  dom.cptManquants.textContent = total - n;
};
