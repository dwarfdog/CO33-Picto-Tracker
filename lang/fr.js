// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  LANGUE : Français
//  Fichier auto-enregistré dans App.langs
// ══════════════════════════════════════════════════════
(function () {
  App.langs.fr = {
    // Page
    page_title:              'Clair Obscur — Carnet des Pictos',
    header_title:            'Carnet des Pictos',
    header_subtitle:         'Clair Obscur · Expédition 33',

    // Progression
    progression_label:       'Progression — Collection',
    progression_pct:         '{pct} % de la collection complétée',

    // Contrôles
    search_placeholder:      'Rechercher un picto…',
    zone_all:                'Toutes les zones',
    sort_id_asc:             'Tri : # croissant',
    sort_id_desc:            'Tri : # décroissant',
    sort_name_asc:           'Tri : Nom (A → Z)',
    sort_name_desc:          'Tri : Nom (Z → A)',
    sort_zone_asc:           'Tri : Zone (A → Z)',
    sort_zone_desc:          'Tri : Zone (Z → A)',
    sort_owned_first:        'Tri : Possédés d\'abord',
    sort_missing_first:      'Tri : Manquants d\'abord',
    sort_lumina_asc:         'Tri : Lumina (croissant)',
    sort_lumina_desc:        'Tri : Lumina (décroissant)',

    // Filtres
    filter_label:            'Afficher',
    filter_all:              'Tous',
    filter_owned:            'Possédés',
    filter_missing:          'Manquants',
    progression_group_label: 'Progression',
    btn_export:              'Exporter',
    btn_import:              'Importer',
    btn_reset:               '✕ Tout décocher',

    // Compteurs
    counter_owned:           'Possédés :',
    counter_missing:         'Manquants :',
    counter_shown:           'Affichés :',

    // Légende
    legend_click:            'CLIC',
    legend_check:            'voir le détail',
    legend_detail:           'cocher / décocher',
    legend_space:            'ESPACE',
    legend_space_desc:       'cocher au clavier',

    // État vide
    empty_state:             'Aucun picto ne correspond à votre recherche.',

    // Tooltip
    tooltip_effect:          'Effet',
    tooltip_stats:           'Statistiques',
    tooltip_lumina:          'Coût Lumina',
    tooltip_zone:            'Zone',
    tooltip_flag:            'Drapeau à proximité',
    tooltip_obtain:          'Comment l\'obtenir',
    tooltip_close:           'Fermer',
    tooltip_detail:          'Voir le détail',
    tooltip_remove:          '— Retirer de ma collection',
    tooltip_add:             '+ Marquer comme possédé',

    // Carte
    badge_derived:           '~ trad. dérivée',
    aria_owned:              'Possédé',
    aria_not_owned:          'Non possédé',
    aria_toggle:             'Cocher / décocher',

    // Fallbacks
    effect_undocumented:     'Effet non documenté.',
    zone_unknown:            'Zone inconnue',

    // Toasts
    toast_copied:            'Code copié — {n} picto(s)',
    toast_downloaded:        'Fichier téléchargé — {n} picto(s)',
    toast_imported:          'Import réussi — {n} picto(s)',
    toast_invalid_data:      'Données invalides.',
    toast_invalid_code:      'Code invalide — format non reconnu.',
    toast_no_code:           'Aucun code saisi.',
    toast_copy_fallback:     'Sélectionnez et copiez manuellement (Ctrl+C)',
    toast_save_error:        'Sauvegarde impossible (stockage plein).',

    // Confirmation
    confirm_reset:           'Effacer toute la progression ? Cette action est irréversible.',

    // Modal import
    import_title:            'Importer une progression',
    import_desc:             'Collez le code d\'export ci-dessous, ou chargez un fichier .json',
    import_placeholder:      'Collez votre code ici…',
    import_apply:            'Appliquer',
    import_file:             'Fichier .json',
    import_cancel:           'Annuler',

    // Modal export
    export_title:            'Exporter la progression',
    export_desc:             'Copiez le code ci-dessous, ou téléchargez un fichier .json',
    export_copy:             'Copier',
    export_download:         'Fichier .json',
    export_close:            'Fermer',

    // Footer
    footer_text:             'Données extraites de <span>Clair Obscur : Expédition 33</span> — Sandfall Interactive &nbsp;·&nbsp; Progression sauvegardée localement<br>MIT License © 2026 DwarfDog',
    footer_data:             'Données extraites de Clair Obscur : Expédition 33',
    footer_studio:           'Sandfall Interactive',
    footer_save:             'Progression sauvegardée localement',
    footer_dataset_line:     'Dataset {dataset} · Jeu {game} · Maj {date}',
    footer_license:          'MIT License \u00a9 2026 DwarfDog',

    // Validation fichier
    toast_file_too_large:    'Fichier trop volumineux (max 1 Mo).',
    toast_file_wrong_type:   'Type de fichier non supporté (.json ou .txt uniquement).',

    // Stats
    stat_health:             'Santé',
    stat_defense:            'Défense',
    stat_speed:              'Vitesse',
    stat_crit:               'Crit.',
    stat_lumina:             'Lumina',

    // Switcher
    lang_label:              'Langue',
    lang_name:               'Français',
  };

  App.SUPPORTED_LANGS.push('fr');
})();
