# Data Maintenance

This project stores Picto data in `js/datas/skills-data.js`.

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
