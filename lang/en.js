// © 2026 DwarfDog — MIT License
// https://github.com/DwarfDog/CO33-Picto-Tracker
// ══════════════════════════════════════════════════════
//  LANGUAGE: English
//  Self-registering into App.langs
// ══════════════════════════════════════════════════════
(function () {
  App.langs.en = {
    // Page
    page_title:              'Clair Obscur — Picto Tracker',
    header_title:            'Picto Tracker',
    header_subtitle:         'Clair Obscur · Expedition 33',

    // Progression
    progression_label:       'Progression — Collection',
    progression_pct:         '{pct}% of collection completed',

    // Controls
    search_placeholder:      'Search for a picto…',
    zone_all:                'All zones',
    sort_id_asc:             'Sort: # ascending',
    sort_id_desc:            'Sort: # descending',
    sort_name_asc:           'Sort: Name (A → Z)',
    sort_name_desc:          'Sort: Name (Z → A)',
    sort_zone_asc:           'Sort: Zone (A → Z)',
    sort_zone_desc:          'Sort: Zone (Z → A)',
    sort_owned_first:        'Sort: Owned first',
    sort_missing_first:      'Sort: Missing first',
    sort_lumina_asc:         'Sort: Lumina (ascending)',
    sort_lumina_desc:        'Sort: Lumina (descending)',

    // Filters
    filter_label:            'Show',
    filter_all:              'All',
    filter_owned:            'Owned',
    filter_missing:          'Missing',
    progression_group_label: 'Progression',
    btn_export:              'Export',
    btn_import:              'Import',
    btn_reset:               '✕ Uncheck all',

    // Counters
    counter_owned:           'Owned:',
    counter_missing:         'Missing:',
    counter_shown:           'Shown:',

    // Legend
    legend_click:            'CLICK',
    legend_check:            'view details',
    legend_detail:           'check / uncheck',
    legend_space:            'SPACE',
    legend_space_desc:       'toggle via keyboard',

    // Empty state
    empty_state:             'No picto matches your search.',

    // Tooltip
    tooltip_effect:          'Effect',
    tooltip_stats:           'Statistics',
    tooltip_lumina:          'Lumina Cost',
    tooltip_zone:            'Zone',
    tooltip_flag:            'Nearby Flag',
    tooltip_obtain:          'How to obtain',
    tooltip_close:           'Close',
    tooltip_detail:          'View details',
    tooltip_remove:          '— Remove from collection',
    tooltip_add:             '+ Mark as owned',

    // Card
    badge_derived:           '~ derived translation',
    aria_owned:              'Owned',
    aria_not_owned:          'Not owned',
    aria_toggle:             'Check / uncheck',

    // Fallbacks
    effect_undocumented:     'Effect not documented.',
    zone_unknown:            'Unknown zone',

    // Toasts
    toast_copied:            'Code copied — {n} picto(s)',
    toast_downloaded:        'File downloaded — {n} picto(s)',
    toast_imported:          'Import successful — {n} picto(s)',
    toast_invalid_data:      'Invalid data.',
    toast_invalid_code:      'Invalid code — format not recognized.',
    toast_no_code:           'No code entered.',
    toast_copy_fallback:     'Select and copy manually (Ctrl+C)',
    toast_save_error:        'Unable to save (storage full).',

    // Confirmation
    confirm_reset:           'Clear all progress? This action is irreversible.',

    // Modal import
    import_title:            'Import progress',
    import_desc:             'Paste the export code below, or load a .json file',
    import_placeholder:      'Paste your code here…',
    import_apply:            'Apply',
    import_file:             '.json file',
    import_cancel:           'Cancel',

    // Modal export
    export_title:            'Export progress',
    export_desc:             'Copy the code below, or download a .json file',
    export_copy:             'Copy',
    export_download:         '.json file',
    export_close:            'Close',

    // Footer
    footer_text:             'Data extracted from <span>Clair Obscur: Expedition 33</span> — Sandfall Interactive &nbsp;·&nbsp; Progress saved locally<br>MIT License © 2026 DwarfDog',
    footer_data:             'Data extracted from Clair Obscur: Expedition 33',
    footer_studio:           'Sandfall Interactive',
    footer_save:             'Progress saved locally',
    footer_dataset_line:     'Dataset {dataset} · Game {game} · Updated {date}',
    footer_license:          'MIT License \u00a9 2026 DwarfDog',

    // File validation
    toast_file_too_large:    'File too large (max 1 MB).',
    toast_file_wrong_type:   'Unsupported file type (.json or .txt only).',

    // Stats
    stat_health:             'Health',
    stat_defense:            'Defense',
    stat_speed:              'Speed',
    stat_crit:               'Crit.',
    stat_lumina:             'Lumina',

    // Switcher
    lang_label:              'Language',
    lang_name:               'English',
  };

  App.SUPPORTED_LANGS.push('en');
})();
