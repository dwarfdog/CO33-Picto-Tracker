# Data Maintenance

This project stores Picto data in `js/datas/skills-data.js`.

## Picto schema

Each `DATA.pictos[]` entry must follow this contract:

- Required: `id`, `nom_en`, `nom_fr`, `effet_en`, `zone_en` or `zone_fr`, `obtention_en`, `traduction_confirmee`
- Optional: `effet_fr`, `obtention_fr`, `flag_en`, `flag_fr`, `lumina`, `statistiques`
- Legacy fields are forbidden: `zone`, `localisation`, `localisation_en`, `localisation_fr`

For a new language `xx`, add `lang/xx.js` and data fields like `nom_xx`, `effet_xx`, `zone_xx`, `flag_xx`, `obtention_xx`.
Runtime fallback stays English (`*_en`) when `*_xx` is missing.

## Required metadata

`DATA.meta` must include:

- `dataset_version` (string)
- `game_version` (string)
- `updated_at` (`YYYY-MM-DD`)
- `total_pictos` (must match actual count)
- `traductions_confirmees` (must match actual count)
- `traductions_derivees` (must match actual count)
- `sources` (non-empty array)

## Local checks

Run all checks:

```bash
node tools/check-all.js
```

Generate a coverage report:

```bash
node tools/report-data.js
```

JSON output:

```bash
node tools/report-data.js --json
```

## Update procedure

1. Edit `js/datas/skills-data.js`.
2. Update metadata fields in `DATA.meta`.
3. Run `node tools/check-all.js`.
4. Run `node tools/report-data.js` and review coverage.
5. Open a pull request with source links for modified entries.
