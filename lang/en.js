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
    label_search:            'Search',
    label_zone_filter:       'Zone filter',
    label_sort_order:        'Sort order',
    label_profile_select:    'Active profile',
    zone_all:                'All zones',
    sort_id_asc:             'Sort: # ascending',
    sort_id_desc:            'Sort: # descending',
    sort_name_asc:           'Sort: Name (A → Z)',
    sort_name_desc:          'Sort: Name (Z → A)',
    sort_zone_asc:           'Sort: Zone (A → Z)',
    sort_zone_desc:          'Sort: Zone (Z → A)',
    sort_owned_first:        'Sort: Owned first',
    sort_missing_first:      'Sort: Missing first',
    sort_build_first:        'Sort: Build first',
    sort_lumina_asc:         'Sort: Lumina (ascending)',
    sort_lumina_desc:        'Sort: Lumina (descending)',

    // Filters
    filter_label:            'Show',
    filter_all:              'All',
    filter_owned:            'Owned',
    filter_missing:          'Missing',
    progression_group_label: 'Progression',
    btn_profile_add:         '+ Profile',
    btn_export:              'Export',
    btn_import:              'Import',
    btn_reset:               '✕ Uncheck all',

    // Lumina planner
    lumina_planner_title:    'Lumina Planner',
    lumina_budget_label:     'Lumina budget',
    lumina_clear_build:      'Clear build',
    lumina_filter_label:     'Build filter',
    lumina_filter_all:       'All',
    lumina_filter_selected:  'In build',
    lumina_filter_unselected:'Out of build',
    lumina_selected_count:   'Selected: {n}',
    lumina_total_cost:       'Total Lumina: {n}',
    lumina_remaining:        'Remaining: {n}',

    // Expert gameplay filters
    gameplay_filters_title:  'Advanced gameplay filters',
    gameplay_filters_hint:   'Select one or more mechanics to isolate target builds.',
    gameplay_mode_label:     'Tag matching mode',
    gameplay_mode_any:       'Any selected tag',
    gameplay_mode_all:       'All selected tags',
    gameplay_clear:          'Clear gameplay tags',
    gameplay_selection_none: 'No gameplay tag selected',
    gameplay_selection_count:'Gameplay tags selected: {n}',

    // Dataset changes
    dataset_changes_title:         'Dataset updates',
    dataset_changes_meta_line:     'Comparison {fromDataset} / game {fromGame} -> {toDataset} / game {toGame}',
    dataset_changes_note_fallback: 'No release note provided.',
    dataset_changes_added_title:   'Additions ({n})',
    dataset_changes_updated_title: 'Updates ({n})',
    dataset_changes_removed_title: 'Removals ({n})',
    dataset_changes_none:          'No entries',
    dataset_changes_unknown_picto: 'Unknown picto',
    dataset_changes_unknown_fields:'Fields not specified',
    dataset_changes_lumina_tag:    'Lumina {n}',
    dataset_change_field_name:     'Name',
    dataset_change_field_effect:   'Effect',
    dataset_change_field_zone:     'Zone',
    dataset_change_field_flag:     'Flag',
    dataset_change_field_obtain:   'Obtention',
    dataset_change_field_lumina:   'Lumina cost',
    dataset_change_field_stats:    'Stats',
    dataset_change_field_translation:'Translation state',
    dataset_change_field_other:    'Field {field}',

    // Farm route
    farm_route_title:         'Farm route - missing pictos',
    farm_route_subtitle:      'Grouping is based on currently visible missing entries (zone + nearby flag).',
    farm_route_meta:          'Missing: {n} pictos across {zones} zone(s)',
    farm_route_empty:         'No missing picto matches current filters.',
    farm_route_zone_count:    '{n} missing',
    farm_route_no_flag:       'No nearby flag',
    farm_route_lumina_tag:    'Lumina {n}',
    farm_route_tags_tag:      'Tags: {tags}',

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
    aria_build_toggle:       'Add or remove from Lumina build',

    // Fallbacks
    effect_undocumented:     'Effect not documented.',
    zone_unknown:            'Unknown zone',

    // Toasts
    toast_copied:            'Code copied — {n} picto(s)',
    toast_downloaded:        'File downloaded — {n} picto(s)',
    toast_imported:          'Import successful — {n} picto(s)',
    toast_profile_created:   'Profile created — {name}',
    toast_profile_switched:  'Active profile — {name}',
    toast_profile_limit:     'Limit reached — max {max} profiles',
    toast_build_cleared:     'Lumina build cleared',
    toast_invalid_data:      'Invalid data.',
    toast_invalid_code:      'Invalid code — format not recognized.',
    toast_no_code:           'No code entered.',
    toast_copy_fallback:     'Select and copy manually (Ctrl+C)',
    toast_save_error:        'Unable to save (storage full).',

    // Confirmation
    confirm_reset:           'Clear all progress? This action is irreversible.',
    profile_prompt_name:     'Name for the new profile:',
    profile_default_name:    'Profile {n}',

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
