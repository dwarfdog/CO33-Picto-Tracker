// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  STATE — État applicatif et persistance localStorage
//  Dépend de : App (app.js), DATA (skills-data.js)
// ══════════════════════════════════════════════════════

App.etat = {
  profils: [],
  profilActifId: '',
  possedes: new Set(),
  buildLumina: new Set(),
  luminaBudget: 0,
  filtreCollection: 'tous', // 'tous' | 'possedes' | 'manquants'
  filtreBuild: 'tous', // 'tous' | 'planifies' | 'hors-plan'
  filtreZone: '',
  recherche: '',
  tri: 'id-asc',
  pictoOuvert: null, // ID du picto ouvert (number | null)
};

/**
 * Construit les caches de données au boot.
 * - App._idsValides : Set d'IDs valides pour validation rapide
 * - App._pictoParId : Map pour lookup O(1) par ID
 */
App.construireCaches = function () {
  App._idsValides = new Set();
  App._pictoParId = new Map();
  DATA.pictos.forEach(function (p) {
    App._idsValides.add(p.id);
    App._pictoParId.set(p.id, p);
  });
};

/**
 * Retourne un objet picto par son ID.
 * @param {number} id
 * @returns {Object|undefined}
 */
App.getPictoById = function (id) {
  return App._pictoParId ? App._pictoParId.get(id) : undefined;
};

/**
 * Retourne un nom de profil par défaut traduit.
 * @param {number} index
 * @returns {string}
 */
App.nomProfilParDefaut = function (index) {
  var n = index > 0 ? index : 1;
  if (typeof App.t === 'function') return App.t('profile_default_name', { n: n });
  return 'Profile ' + n;
};

/**
 * Génère un identifiant de profil.
 * @returns {string}
 */
App.genererIdProfil = function () {
  return 'profil_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
};

/**
 * Normalise une liste d'IDs possédés.
 * Purge les IDs invalides, les doublons et les valeurs non numériques.
 * @param {Array} ids
 * @returns {{set:Set<number>, purged:boolean}}
 */
App.normaliserIdsPossedes = function (ids) {
  var set = new Set();
  var purged = false;

  if (!Array.isArray(ids)) {
    return { set: set, purged: true };
  }

  ids.forEach(function (id) {
    if (typeof id === 'number' && App._idsValides.has(id)) {
      var before = set.size;
      set.add(id);
      if (set.size === before) purged = true; // doublon
    } else {
      purged = true;
    }
  });

  return { set: set, purged: purged };
};

/**
 * Normalise un budget Lumina.
 * @param {*} raw
 * @returns {{value:number, changed:boolean}}
 */
App.normaliserBudgetLumina = function (raw) {
  if (raw === undefined || raw === null || raw === '') {
    return { value: 0, changed: true };
  }

  var n = parseInt(raw, 10);
  if (!isFinite(n) || n < 0) {
    return { value: 0, changed: true };
  }

  return { value: n, changed: String(n) !== String(raw) };
};

/**
 * Retourne un profil par son ID.
 * @param {string} profilId
 * @returns {{id:string, nom:string, possedes:Set<number>, buildLumina:Set<number>, budgetLumina:number}|null}
 */
App.getProfilById = function (profilId) {
  for (var i = 0; i < App.etat.profils.length; i++) {
    if (App.etat.profils[i].id === profilId) return App.etat.profils[i];
  }
  return null;
};

/**
 * Retourne le profil actif.
 * @returns {{id:string, nom:string, possedes:Set<number>, buildLumina:Set<number>, budgetLumina:number}|null}
 */
App.getProfilActif = function () {
  return App.getProfilById(App.etat.profilActifId);
};

/**
 * Ajoute un profil dans l'état applicatif.
 * @param {{id?:string, nom?:string, possedes?:Array, build_lumina?:Array, buildLumina?:Array, budget_lumina?:number, budgetLumina?:number}} config
 * @returns {{profil:{id:string, nom:string, possedes:Set<number>, buildLumina:Set<number>, budgetLumina:number}, changed:boolean}}
 */
App.ajouterProfil = function (config) {
  var cfg = config || {};
  var changed = false;

  var rawId = typeof cfg.id === 'string' ? cfg.id.trim() : '';
  var profilId = rawId || App.genererIdProfil();
  if (!rawId) changed = true;
  while (App.getProfilById(profilId)) {
    profilId = App.genererIdProfil();
    changed = true;
  }

  var rawNom = typeof cfg.nom === 'string' ? cfg.nom.trim() : '';
  var nom = rawNom || App.nomProfilParDefaut(App.etat.profils.length + 1);
  if (!rawNom) changed = true;

  var normalized = App.normaliserIdsPossedes(cfg.possedes || []);
  if (normalized.purged) changed = true;

  var buildSource = cfg.build_lumina;
  if (buildSource === undefined) buildSource = cfg.buildLumina;
  if (buildSource === undefined) {
    buildSource = [];
    changed = true;
  }

  var normalizedBuild = App.normaliserIdsPossedes(buildSource);
  if (normalizedBuild.purged) changed = true;

  var budgetSource = cfg.budget_lumina;
  if (budgetSource === undefined) budgetSource = cfg.budgetLumina;
  if (budgetSource === undefined) {
    budgetSource = 0;
    changed = true;
  }

  var normalizedBudget = App.normaliserBudgetLumina(budgetSource);
  if (normalizedBudget.changed) changed = true;

  var profil = {
    id: profilId,
    nom: nom,
    possedes: normalized.set,
    buildLumina: normalizedBuild.set,
    budgetLumina: normalizedBudget.value
  };

  App.etat.profils.push(profil);
  return { profil: profil, changed: changed };
};

/**
 * Garantit qu'au moins un profil existe et qu'un profil actif est défini.
 * Retourne true si l'état a été corrigé.
 * @returns {boolean}
 */
App.assurerProfils = function () {
  var changed = false;

  if (!Array.isArray(App.etat.profils)) {
    App.etat.profils = [];
    changed = true;
  }

  if (!App.etat.profils.length) {
    App.ajouterProfil({ possedes: [], build_lumina: [], budget_lumina: 0 });
    changed = true;
  }

  if (!App.getProfilById(App.etat.profilActifId)) {
    App.etat.profilActifId = App.etat.profils[0].id;
    changed = true;
  }

  var profilActif = App.getProfilActif();
  App.etat.possedes = profilActif ? profilActif.possedes : new Set();
  App.etat.buildLumina = profilActif ? profilActif.buildLumina : new Set();
  App.etat.luminaBudget = profilActif ? profilActif.budgetLumina : 0;

  if (['tous', 'planifies', 'hors-plan'].indexOf(App.etat.filtreBuild) === -1) {
    App.etat.filtreBuild = 'tous';
    changed = true;
  }

  return changed;
};

/**
 * Rafraîchit les états visuels de possession sur toutes les cartes.
 */
App.rafraichirEtatCartes = function () {
  if (!App.toutes_cartes || !App.toutes_cartes.length) return;

  App.toutes_cartes.forEach(function (carte) {
    var id = parseInt(carte.dataset.id, 10);
    var possede = App.etat.possedes.has(id);
    var dansBuild = App.etat.buildLumina.has(id);

    carte.classList.toggle('possede', possede);
    carte.classList.toggle('dans-build', dansBuild);

    var btnPossession = carte.querySelector('.possession-indicateur');
    if (btnPossession) {
      btnPossession.setAttribute('aria-pressed', possede ? 'true' : 'false');
    }

    var btnBuild = carte.querySelector('.build-indicateur');
    if (btnBuild) {
      btnBuild.setAttribute('aria-pressed', dansBuild ? 'true' : 'false');
      btnBuild.classList.toggle('actif', dansBuild);
    }
  });
};

/**
 * Met à jour les options du sélecteur de profils.
 */
App.rafraichirSelectProfils = function () {
  if (typeof document === 'undefined') return;

  var select = document.getElementById('profil-select');
  if (!select) return;

  while (select.options.length) select.remove(0);

  App.etat.profils.forEach(function (profil) {
    var option = document.createElement('option');
    option.value = profil.id;
    option.textContent = profil.nom;
    select.appendChild(option);
  });

  if (App.getProfilById(App.etat.profilActifId)) {
    select.value = App.etat.profilActifId;
  }

  var btnAdd = document.getElementById('btn-profil-add');
  if (btnAdd) {
    btnAdd.disabled = App.etat.profils.length >= App.MAX_PROFILES;
  }
};

/**
 * Active un profil existant et rafraîchit l'UI.
 * @param {string} profilId
 * @param {{skipSave?:boolean, skipRender?:boolean, silentToast?:boolean, skipTooltip?:boolean}} [options]
 * @returns {boolean}
 */
App.activerProfil = function (profilId, options) {
  var opts = options || {};
  var profil = App.getProfilById(profilId);
  if (!profil) return false;

  var profilChanged = App.etat.profilActifId !== profil.id;
  App.etat.profilActifId = profil.id;
  App.etat.possedes = profil.possedes;
  App.etat.buildLumina = profil.buildLumina;
  App.etat.luminaBudget = profil.budgetLumina;

  App.rafraichirSelectProfils();

  if (!opts.skipSave) {
    App.sauvegarder();
  }

  if (!opts.skipRender) {
    App.rafraichirEtatCartes();
    if (typeof App.mettreAJourPlanificateurLumina === 'function') App.mettreAJourPlanificateurLumina();
    if (typeof App.mettreAJourProgression === 'function') App.mettreAJourProgression();
    if (typeof App.appliquerTri === 'function') App.appliquerTri();
    if (typeof App.appliquerFiltres === 'function') App.appliquerFiltres();
  }

  if (!opts.skipTooltip && App.etat.pictoOuvert && typeof App.ouvrirTooltip === 'function') {
    var picto = App.getPictoById(App.etat.pictoOuvert);
    if (picto) App.ouvrirTooltip(picto);
  }

  if (!opts.silentToast && profilChanged && typeof App.afficherToast === 'function' && typeof App.t === 'function') {
    App.afficherToast(App.t('toast_profile_switched', { name: profil.nom }));
  }

  return true;
};

/**
 * Crée un nouveau profil (run) puis l'active.
 * @param {string} nom
 * @returns {{id:string, nom:string, possedes:Set<number>, buildLumina:Set<number>, budgetLumina:number}|null}
 */
App.creerEtActiverProfil = function (nom) {
  if (App.etat.profils.length >= App.MAX_PROFILES) {
    if (typeof App.afficherToast === 'function' && typeof App.t === 'function') {
      App.afficherToast(App.t('toast_profile_limit', { max: App.MAX_PROFILES }), true);
    }
    return null;
  }

  var result = App.ajouterProfil({ nom: nom, possedes: [], build_lumina: [], budget_lumina: 0 });
  var profil = result.profil;
  App.activerProfil(profil.id, { skipSave: true, silentToast: true });
  App.sauvegarder();

  if (typeof App.afficherToast === 'function' && typeof App.t === 'function') {
    App.afficherToast(App.t('toast_profile_created', { name: profil.nom }));
  }

  return profil;
};

/**
 * Charge la progression depuis localStorage.
 * Supporte les formats v1 (tableau brut), v2 (objet possedes)
 * et v3+/v4 (multi-profils).
 */
App.chargerSauvegarde = function () {
  App.etat.profils = [];
  App.etat.profilActifId = '';

  var raw;
  try {
    raw = localStorage.getItem(App.STORAGE_KEY);
  } catch (e) {
    console.warn('Impossible de lire la sauvegarde:', e);
    App.assurerProfils();
    return;
  }

  var needsMigration = false;

  if (!raw) {
    App.assurerProfils();
    return;
  }

  try {
    var parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      // Format v1: tableau d'IDs
      App.ajouterProfil({ possedes: parsed, build_lumina: [], budget_lumina: 0 });
      needsMigration = true;
    } else if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.profils)) {
        // Format v3+/v4: multi-profils
        parsed.profils.forEach(function (entry) {
          if (!entry || typeof entry !== 'object') {
            needsMigration = true;
            return;
          }

          var possedes = Array.isArray(entry.possedes) ? entry.possedes : [];
          if (!Array.isArray(entry.possedes)) needsMigration = true;
          var buildLumina = [];

          if (Array.isArray(entry.build_lumina)) {
            buildLumina = entry.build_lumina;
          } else if (Array.isArray(entry.buildLumina)) {
            buildLumina = entry.buildLumina;
            needsMigration = true;
          } else {
            needsMigration = true;
          }

          var budgetLumina = entry.budget_lumina;
          if (budgetLumina === undefined) {
            if (entry.budgetLumina !== undefined) {
              budgetLumina = entry.budgetLumina;
              needsMigration = true;
            } else if (entry.lumina_budget !== undefined) {
              budgetLumina = entry.lumina_budget;
              needsMigration = true;
            } else {
              budgetLumina = 0;
              needsMigration = true;
            }
          }

          var added = App.ajouterProfil({
            id: entry.id,
            nom: entry.nom,
            possedes: possedes,
            build_lumina: buildLumina,
            budget_lumina: budgetLumina
          });

          if (added.changed) needsMigration = true;
        });

        if (typeof parsed.profil_actif === 'string') {
          App.etat.profilActifId = parsed.profil_actif;
        } else {
          needsMigration = true;
        }

        if (parsed.version !== App.STORAGE_VERSION) {
          needsMigration = true;
        }
      } else if (Array.isArray(parsed.possedes)) {
        // Format v2: objet {version, possedes}
        App.ajouterProfil({ possedes: parsed.possedes, build_lumina: [], budget_lumina: 0 });
        needsMigration = true;
      } else {
        needsMigration = true;
      }
    } else {
      needsMigration = true;
    }
  } catch (e) {
    console.warn('Impossible de lire la sauvegarde:', e);
    needsMigration = true;
  }

  if (App.assurerProfils()) {
    needsMigration = true;
  }

  if (needsMigration) {
    App.sauvegarder();
  }
};

/**
 * Sauvegarde la progression dans localStorage au format v4 (multi-profils).
 * Format :
 * {
 *   version: 4,
 *   profil_actif: 'profil_xxx',
 *   profils: [{ id, nom, possedes: [...], build_lumina: [...], budget_lumina: 0 }, ...]
 * }
 */
App.sauvegarder = function () {
  try {
    App.assurerProfils();

    var profils = App.etat.profils.map(function (profil) {
      return {
        id: profil.id,
        nom: profil.nom,
        possedes: Array.from(profil.possedes).sort(function (a, b) { return a - b; }),
        build_lumina: Array.from(profil.buildLumina).sort(function (a, b) { return a - b; }),
        budget_lumina: profil.budgetLumina
      };
    });

    var data = {
      version: App.STORAGE_VERSION,
      profil_actif: App.etat.profilActifId,
      profils: profils
    };

    localStorage.setItem(App.STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Impossible de sauvegarder:', e);
    if (typeof App.afficherToast === 'function') {
      App.afficherToast(App.t('toast_save_error'), true);
    }
  }
};
