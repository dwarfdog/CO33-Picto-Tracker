// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  EVENTS — Attachement de tous les événements
//  Dépend de : App (app.js) — tous les modules
// ══════════════════════════════════════════════════════

/**
 * Attache tous les écouteurs d'événements de l'application.
 * Utilise le registre DOM centralisé (App._dom) pour éviter les getElementById répétés.
 * Appelé une seule fois au boot.
 */
App.attacher = function () {
  var dom = App._dom;

  // ── Recherche (avec debounce) ──
  var rechercheDebounced = App.debounce(function () {
    App.appliquerFiltres();
  }, App.DEBOUNCE_DELAY);

  if (dom.recherche) {
    dom.recherche.addEventListener('input', function (e) {
      App.etat.recherche = e.target.value.trim();
      rechercheDebounced();
    });
  }

  // ── Filtre zone ──
  if (dom.filtreZone) {
    dom.filtreZone.addEventListener('change', function (e) {
      App.etat.filtreZone = e.target.value;
      App.appliquerFiltres();
    });
  }

  // ── Filtre catégorie ──
  if (dom.filtreCategorie) {
    dom.filtreCategorie.addEventListener('change', function (e) {
      App.etat.filtreCategorie = e.target.value;
      App.appliquerFiltres();
    });
  }

  // ── Filtre type d'obtention ──
  if (dom.filtreObtention) {
    dom.filtreObtention.addEventListener('change', function (e) {
      App.etat.filtreObtention = e.target.value;
      App.appliquerFiltres();
    });
  }

  // ── Tri ──
  if (dom.triSelect) {
    dom.triSelect.addEventListener('change', function (e) {
      App.etat.tri = e.target.value;
      App.appliquerTri();
      App.appliquerFiltres();
    });
  }

  // ── Profils de progression ──
  if (dom.profilSelect) {
    dom.profilSelect.addEventListener('change', function (e) {
      App.activerProfil(e.target.value);
    });
  }

  if (dom.btnProfilAdd) {
    dom.btnProfilAdd.addEventListener('click', function () {
      var suggestion = App.nomProfilParDefaut(App.etat.profils.length + 1);
      App.ouvrirPrompt(App.t('profile_prompt_name'), suggestion, function (nom) {
        if (nom !== null) App.creerEtActiverProfil(nom);
      });
    });
  }

  // ── Planificateur Lumina ──
  var budgetDebounced = App.debounce(function (value) {
    App.definirBudgetLumina(value);
  }, App.DEBOUNCE_DELAY);

  if (dom.luminaBudget) {
    dom.luminaBudget.addEventListener('input', function (e) {
      budgetDebounced(e.target.value);
    });

    dom.luminaBudget.addEventListener('change', function (e) {
      App.definirBudgetLumina(e.target.value);
      App.mettreAJourPlanificateurLumina();
    });
  }

  if (dom.btnLuminaClear) {
    dom.btnLuminaClear.addEventListener('click', function () {
      App.viderBuildLumina();
    });
  }

  document.querySelectorAll('.btn-filtre-build[data-build-filtre]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.btn-filtre-build[data-build-filtre]').forEach(function (b) {
        b.classList.remove('actif');
      });
      btn.classList.add('actif');
      App.etat.filtreBuild = btn.dataset.buildFiltre;
      App.appliquerFiltres();
    });
  });

  // ── Filtres gameplay experts ──
  if (dom.filtreGameplayMode) {
    dom.filtreGameplayMode.addEventListener('change', function (e) {
      App.etat.filtreGameplayMode = e.target.value === 'all' ? 'all' : 'any';
      App.appliquerFiltres();
    });
  }

  if (dom.btnGameplayClear) {
    dom.btnGameplayClear.addEventListener('click', function () {
      App.viderFiltresGameplay();
    });
  }

  // ── Filtres collection (délégation) ──
  document.querySelectorAll('.btn-filtre[data-filtre]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.btn-filtre[data-filtre]').forEach(function (b) { b.classList.remove('actif'); });
      btn.classList.add('actif');
      App.etat.filtreCollection = btn.dataset.filtre;
      App.appliquerFiltres();
    });
  });

  // ── Reset ──
  if (dom.btnReset) {
    dom.btnReset.addEventListener('click', function () {
      App.ouvrirConfirm(App.t('confirm_reset'), function (ok) {
        if (!ok) return;
        App.etat.possedes.clear();
        App.rafraichirComplet();
      });
    });
  }

  // ── Export ──
  if (dom.btnExport) {
    dom.btnExport.addEventListener('click', App.exporterProgression);
  }

  // ── Import — ouvrir modal ──
  if (dom.btnImport) {
    dom.btnImport.addEventListener('click', App.ouvrirImportModal);
  }

  // ── Import — valider le code collé ──
  if (dom.btnImportValider) {
    dom.btnImportValider.addEventListener('click', function () {
      var code = dom.importTextarea ? dom.importTextarea.value : '';
      if (!code.trim()) { App.afficherToast(App.t('toast_no_code'), true); return; }
      if (App.importerDepuisCode(code)) App.fermerImportModal();
    });
  }

  // ── Import — charger un fichier .json ──
  if (dom.btnImportFichier) {
    dom.btnImportFichier.addEventListener('click', function () {
      if (dom.importFichier) dom.importFichier.click();
    });
  }

  if (dom.importFichier) {
    dom.importFichier.addEventListener('change', function (e) {
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
  }

  // ── Import — annuler ──
  if (dom.btnImportAnnuler) {
    dom.btnImportAnnuler.addEventListener('click', App.fermerImportModal);
  }
  if (dom.importOverlay) {
    dom.importOverlay.addEventListener('click', function (e) {
      if (e.target === dom.importOverlay) App.fermerImportModal();
    });
  }

  // ── Export modal — copier le code ──
  if (dom.btnExportCopier) {
    dom.btnExportCopier.addEventListener('click', function () {
      var code = dom.exportTextarea ? dom.exportTextarea.value : '';
      navigator.clipboard.writeText(code).then(function () {
        App.afficherToast(App.t('toast_copied', { n: App.etat.possedes.size }));
        App.fermerExportModal();
      }).catch(function () {
        if (dom.exportTextarea) dom.exportTextarea.select();
        App.afficherToast(App.t('toast_copy_fallback'), true);
      });
    });
  }

  // ── Export modal — télécharger fichier .json ──
  if (dom.btnExportFichier) {
    dom.btnExportFichier.addEventListener('click', function () {
      App.telechargerFichier();
    });
  }

  // ── Export modal — exporter tous les profils ──
  if (dom.btnExportAll) {
    dom.btnExportAll.addEventListener('click', function () {
      App.telechargerTousProfils();
    });
  }

  // ── Export modal — fermer ──
  if (dom.btnExportFermer) {
    dom.btnExportFermer.addEventListener('click', App.fermerExportModal);
  }
  if (dom.exportOverlay) {
    dom.exportOverlay.addEventListener('click', function (e) {
      if (e.target === dom.exportOverlay) App.fermerExportModal();
    });
  }

  // ── Tooltip ──
  if (dom.tooltipFermer) {
    dom.tooltipFermer.addEventListener('click', App.fermerTooltip);
  }
  if (dom.tooltipOverlay) {
    dom.tooltipOverlay.addEventListener('click', function (e) {
      if (e.target === dom.tooltipOverlay) App.fermerTooltip();
    });
  }

  // ── Tooltip — toggle possession (pictoOuvert = ID maintenant) ──
  if (dom.ttBtnPossession) {
    dom.ttBtnPossession.addEventListener('click', function () {
      if (!App.etat.pictoOuvert) return;
      var id = App.etat.pictoOuvert;
      var carte = App.cartesParId[id];
      var picto = App.getPictoById(id);
      if (carte) App.togglePossession(id, carte);
      if (picto) App.ouvrirTooltip(picto);
    });
  }

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
