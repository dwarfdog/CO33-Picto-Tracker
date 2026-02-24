// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  EVENTS — Attachement de tous les événements
//  Dépend de : App (app.js) — tous les modules
// ══════════════════════════════════════════════════════

/**
 * Attache tous les écouteurs d'événements de l'application.
 * Appelé une seule fois au boot.
 */
App.attacher = function () {

  // ── Recherche (avec debounce) ──
  var rechercheDebounced = App.debounce(function () {
    App.appliquerFiltres();
  }, App.DEBOUNCE_DELAY);

  document.getElementById('recherche').addEventListener('input', function (e) {
    App.etat.recherche = e.target.value.trim();
    rechercheDebounced();
  });

  // ── Filtre zone ──
  document.getElementById('filtre-zone').addEventListener('change', function (e) {
    App.etat.filtreZone = e.target.value;
    App.appliquerFiltres();
  });

  // ── Tri ──
  document.getElementById('tri-select').addEventListener('change', function (e) {
    App.etat.tri = e.target.value;
    App.appliquerTri();
    App.appliquerFiltres();
  });

  // ── Profils de progression ──
  document.getElementById('profil-select').addEventListener('change', function (e) {
    App.activerProfil(e.target.value);
  });

  document.getElementById('btn-profil-add').addEventListener('click', function () {
    var suggestion = App.nomProfilParDefaut(App.etat.profils.length + 1);
    var nom = prompt(App.t('profile_prompt_name'), suggestion);
    if (nom === null) return; // Annulation utilisateur
    App.creerEtActiverProfil(nom);
  });

  // ── Filtres collection (délégation) ──
  document.querySelectorAll('.btn-filtre[data-filtre]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.btn-filtre').forEach(function (b) { b.classList.remove('actif'); });
      btn.classList.add('actif');
      App.etat.filtreCollection = btn.dataset.filtre;
      App.appliquerFiltres();
    });
  });

  // ── Reset ──
  document.getElementById('btn-reset').addEventListener('click', function () {
    if (!confirm(App.t('confirm_reset'))) return;
    App.etat.possedes.clear();
    App.sauvegarder();
    App.toutes_cartes.forEach(function (c) { c.classList.remove('possede'); });
    App.mettreAJourProgression();
    App.appliquerFiltres();
  });

  // ── Export ──
  document.getElementById('btn-export').addEventListener('click', App.exporterProgression);

  // ── Import — ouvrir modal ──
  document.getElementById('btn-import').addEventListener('click', App.ouvrirImportModal);

  // ── Import — valider le code collé ──
  document.getElementById('btn-import-valider').addEventListener('click', function () {
    var code = document.getElementById('import-textarea').value;
    if (!code.trim()) { App.afficherToast(App.t('toast_no_code'), true); return; }
    if (App.importerDepuisCode(code)) App.fermerImportModal();
  });

  // ── Import — charger un fichier .json ──
  document.getElementById('btn-import-fichier').addEventListener('click', function () {
    document.getElementById('import-fichier').click();
  });

  document.getElementById('import-fichier').addEventListener('change', function (e) {
    var fichier = e.target.files[0];
    if (!fichier) return;

    // Validation taille
    if (fichier.size > App.FILE_MAX_SIZE) {
      App.afficherToast(App.t('toast_file_too_large'), true);
      e.target.value = '';
      return;
    }

    // Validation type
    if (!fichier.name.match(/\.(json|txt)$/i)) {
      App.afficherToast(App.t('toast_file_wrong_type'), true);
      e.target.value = '';
      return;
    }

    var reader = new FileReader();
    reader.onload = function (ev) {
      if (App.importerDepuisCode(ev.target.result)) App.fermerImportModal();
    };
    reader.onerror = function () {
      App.afficherToast(App.t('toast_invalid_code'), true);
    };
    reader.readAsText(fichier);
    e.target.value = '';
  });

  // ── Import — annuler ──
  document.getElementById('btn-import-annuler').addEventListener('click', App.fermerImportModal);
  document.getElementById('import-overlay').addEventListener('click', function (e) {
    if (e.target === document.getElementById('import-overlay')) App.fermerImportModal();
  });

  // ── Export modal — copier le code ──
  document.getElementById('btn-export-copier').addEventListener('click', function () {
    var code = document.getElementById('export-textarea').value;
    navigator.clipboard.writeText(code).then(function () {
      App.afficherToast(App.t('toast_copied', { n: App.etat.possedes.size }));
      App.fermerExportModal();
    }).catch(function () {
      document.getElementById('export-textarea').select();
      App.afficherToast(App.t('toast_copy_fallback'), true);
    });
  });

  // ── Export modal — télécharger fichier .json ──
  document.getElementById('btn-export-fichier').addEventListener('click', function () {
    App.telechargerFichier();
  });

  // ── Export modal — fermer ──
  document.getElementById('btn-export-fermer').addEventListener('click', App.fermerExportModal);
  document.getElementById('export-overlay').addEventListener('click', function (e) {
    if (e.target === document.getElementById('export-overlay')) App.fermerExportModal();
  });

  // ── Tooltip ──
  document.getElementById('tooltip-fermer').addEventListener('click', App.fermerTooltip);
  document.getElementById('tooltip-overlay').addEventListener('click', function (e) {
    if (e.target === document.getElementById('tooltip-overlay')) App.fermerTooltip();
  });

  // ── Tooltip — toggle possession (pictoOuvert = ID maintenant) ──
  document.getElementById('tt-btn-possession').addEventListener('click', function () {
    if (!App.etat.pictoOuvert) return;
    var id = App.etat.pictoOuvert;
    var carte = App.cartesParId[id];
    var picto = App.getPictoById(id);
    if (carte) App.togglePossession(id, carte);
    if (picto) App.ouvrirTooltip(picto);
  });

  // ── Clavier global ──
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      App.maintenirFocusDansModal(e);
    }
    if (e.key === 'Escape') {
      App.fermerTooltip();
      App.fermerImportModal();
      App.fermerExportModal();
    }
  });

  // ── Switcher de langue ──
  document.querySelectorAll('.btn-lang').forEach(function (btn) {
    btn.addEventListener('click', function () {
      App.changerLangue(btn.dataset.lang);
      document.querySelectorAll('.btn-lang').forEach(function (b) {
        b.classList.toggle('actif', b.dataset.lang === App.LANG);
      });
    });
  });
};
