// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  LUMINA PLANNER — Construction de builds par budget
//  Dépend de : App (app.js), DATA (skills-data.js)
// ══════════════════════════════════════════════════════

/**
 * Retourne le coût Lumina numérique d'un picto.
 * @param {Object} picto
 * @returns {number}
 */
App.getLuminaCost = function (picto) {
  var n = parseInt(picto && picto.lumina, 10);
  return isFinite(n) && n > 0 ? n : 0;
};

/**
 * Indique si un picto est sélectionné dans le build actif.
 * @param {number} id
 * @returns {boolean}
 */
App.estDansBuild = function (id) {
  return !!(App.etat.buildLumina && App.etat.buildLumina.has(id));
};

/**
 * Calcule les métriques du planificateur Lumina.
 * @returns {{count:number,total:number,budget:number,remaining:number,overBudget:boolean}}
 */
App.calculerPlanLumina = function () {
  var total = 0;
  var count = 0;

  if (App.etat.buildLumina) {
    App.etat.buildLumina.forEach(function (id) {
      var picto = App.getPictoById(id);
      if (!picto) return;
      total += App.getLuminaCost(picto);
      count++;
    });
  }

  var budget = App.etat.luminaBudget || 0;
  var remaining = budget - total;
  return {
    count: count,
    total: total,
    budget: budget,
    remaining: remaining,
    overBudget: remaining < 0
  };
};

/**
 * Met à jour l'UI du planificateur Lumina.
 */
App.mettreAJourPlanificateurLumina = function () {
  if (typeof document === 'undefined') return;

  var panel = document.getElementById('lumina-planner');
  var budgetInput = document.getElementById('lumina-budget');
  var countEl = document.getElementById('lumina-selected-count');
  var totalEl = document.getElementById('lumina-total-cost');
  var remainingEl = document.getElementById('lumina-remaining');

  if (!panel || !budgetInput || !countEl || !totalEl || !remainingEl) return;

  var metrics = App.calculerPlanLumina();
  budgetInput.value = String(metrics.budget);

  countEl.textContent = App.t('lumina_selected_count', { n: metrics.count });
  totalEl.textContent = App.t('lumina_total_cost', { n: metrics.total });
  remainingEl.textContent = App.t('lumina_remaining', { n: metrics.remaining });
  panel.classList.toggle('over-budget', metrics.overBudget);
  remainingEl.classList.toggle('negative', metrics.overBudget);
};

/**
 * Définit le budget Lumina du profil actif.
 * @param {*} rawValue
 */
App.definirBudgetLumina = function (rawValue) {
  var normalized = App.normaliserBudgetLumina(rawValue);
  var budget = normalized.value;

  App.etat.luminaBudget = budget;
  var profil = App.getProfilActif();
  if (profil) profil.budgetLumina = budget;

  App.sauvegarder();
  App.mettreAJourPlanificateurLumina();
};

/**
 * Bascule la sélection d'un picto dans le build Lumina.
 * @param {number} id
 * @param {HTMLElement} [carte]
 */
App.toggleBuildSelection = function (id, carte) {
  if (!App._idsValides || !App._idsValides.has(id)) return;

  if (App.etat.buildLumina.has(id)) {
    App.etat.buildLumina.delete(id);
  } else {
    App.etat.buildLumina.add(id);
  }

  App.sauvegarder();

  if (carte) {
    var inBuild = App.etat.buildLumina.has(id);
    carte.classList.toggle('dans-build', inBuild);
    var btnBuild = carte.querySelector('.build-indicateur');
    if (btnBuild) {
      btnBuild.classList.toggle('actif', inBuild);
      btnBuild.setAttribute('aria-pressed', inBuild ? 'true' : 'false');
    }
  } else {
    App.rafraichirEtatCartes();
  }

  App.mettreAJourPlanificateurLumina();
  App.appliquerTri();
  App.appliquerFiltres();

  if (App.etat.pictoOuvert === id && typeof App.ouvrirTooltip === 'function') {
    var picto = App.getPictoById(id);
    if (picto) App.ouvrirTooltip(picto);
  }
};

/**
 * Vide la sélection build du profil actif.
 */
App.viderBuildLumina = function () {
  if (!App.etat.buildLumina || !App.etat.buildLumina.size) return;

  App.etat.buildLumina.clear();
  App.sauvegarder();
  App.rafraichirEtatCartes();
  App.mettreAJourPlanificateurLumina();
  App.appliquerTri();
  App.appliquerFiltres();

  if (typeof App.afficherToast === 'function') {
    App.afficherToast(App.t('toast_build_cleared'));
  }

  if (App.etat.pictoOuvert && typeof App.ouvrirTooltip === 'function') {
    var picto = App.getPictoById(App.etat.pictoOuvert);
    if (picto) App.ouvrirTooltip(picto);
  }
};
