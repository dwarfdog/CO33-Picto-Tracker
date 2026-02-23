// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  PROGRESS — Barre de progression et compteurs
//  Dépend de : App (app.js), DATA (skills-data.js)
// ══════════════════════════════════════════════════════

/**
 * Met à jour la barre de progression, les compteurs et le pourcentage.
 */
App.mettreAJourProgression = function () {
  var n = App.etat.possedes.size;
  var total = DATA.pictos.length;
  var pct = total ? (n / total * 100).toFixed(1) : '0.0';

  document.getElementById('nb-possedes').textContent = n;
  document.getElementById('nb-total').textContent = total;
  document.getElementById('barre-prog').style.width = pct + '%';
  document.getElementById('prog-pct').textContent = App.t('progression_pct', { pct: pct });
  document.getElementById('cpt-possedes').textContent = n;
  document.getElementById('cpt-manquants').textContent = total - n;
};
