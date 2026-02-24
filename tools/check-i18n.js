#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const LANG_DIR = path.join(ROOT, 'lang');

function rel(p) {
  return path.relative(ROOT, p).replace(/\\/g, '/');
}

function loadScript(relPath) {
  const full = path.join(ROOT, relPath);
  const code = fs.readFileSync(full, 'utf8');
  vm.runInThisContext(code, { filename: rel(full) });
}

function listLangFiles() {
  if (!fs.existsSync(LANG_DIR)) return [];
  return fs.readdirSync(LANG_DIR)
    .filter(function (name) { return /\.js$/i.test(name); })
    .sort()
    .map(function (name) { return path.join('lang', name); });
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim() !== '';
}

function unique(arr) {
  return Array.from(new Set(arr));
}

function getDuplicateValues(arr) {
  const counts = {};
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i];
    counts[v] = (counts[v] || 0) + 1;
  }
  return Object.keys(counts).filter(function (k) { return counts[k] > 1; });
}

function placeholders(str) {
  if (typeof str !== 'string') return [];
  const values = [];
  const re = /\{(\w+)\}/g;
  let m;
  while ((m = re.exec(str)) !== null) {
    values.push(m[1]);
  }
  return unique(values).sort();
}

function formatKeys(keys) {
  if (!keys.length) return '(none)';
  const LIMIT = 8;
  if (keys.length <= LIMIT) return keys.join(', ');
  return keys.slice(0, LIMIT).join(', ') + ' … +' + (keys.length - LIMIT);
}

function runI18nCheck() {
  const errors = [];
  const warnings = [];

  global.App = undefined;
  loadScript('js/app.js');

  const langFiles = listLangFiles();
  if (!langFiles.length) {
    errors.push('No language file found in lang/.');
    return { errors, warnings, langFiles, supported: [], defaultLang: App && App.DEFAULT_LANG };
  }

  for (let i = 0; i < langFiles.length; i++) {
    loadScript(langFiles[i]);
  }

  const supported = Array.isArray(App.SUPPORTED_LANGS) ? App.SUPPORTED_LANGS.slice() : [];
  const duplicates = getDuplicateValues(supported);
  const uniqueSupported = unique(supported);
  const declared = Object.keys(App.langs || {});
  const defaultLang = App.DEFAULT_LANG;

  if (!uniqueSupported.length) {
    errors.push('No language registered in App.SUPPORTED_LANGS.');
  }

  if (duplicates.length) {
    errors.push('Duplicate language code(s) in App.SUPPORTED_LANGS: ' + duplicates.join(', ') + '.');
  }

  if (!isNonEmptyString(defaultLang)) {
    errors.push('App.DEFAULT_LANG must be a non-empty string.');
  } else if (uniqueSupported.indexOf(defaultLang) === -1) {
    errors.push('App.DEFAULT_LANG (' + defaultLang + ') must exist in App.SUPPORTED_LANGS.');
  }

  const missingFromSupported = declared.filter(function (code) {
    return uniqueSupported.indexOf(code) === -1;
  });
  if (missingFromSupported.length) {
    errors.push('Language(s) declared in App.langs but missing in App.SUPPORTED_LANGS: ' + missingFromSupported.join(', ') + '.');
  }

  for (let i = 0; i < uniqueSupported.length; i++) {
    const code = uniqueSupported[i];
    const dict = App.langs && App.langs[code];
    if (!dict || typeof dict !== 'object' || Array.isArray(dict)) {
      errors.push('App.langs.' + code + ' is missing or invalid.');
      continue;
    }
    if (!isNonEmptyString(dict.lang_name)) {
      errors.push('App.langs.' + code + '.lang_name is required.');
    }
  }

  const base = App.langs && App.langs[defaultLang];
  const baseKeys = base && typeof base === 'object' ? Object.keys(base) : [];

  if (!base || typeof base !== 'object') {
    errors.push('Default language dictionary App.langs.' + defaultLang + ' is missing.');
  } else if (!baseKeys.length) {
    errors.push('Default language dictionary App.langs.' + defaultLang + ' has no keys.');
  }

  for (let i = 0; i < uniqueSupported.length; i++) {
    const code = uniqueSupported[i];
    const dict = App.langs[code];
    if (!dict || typeof dict !== 'object' || Array.isArray(dict)) continue;

    const keys = Object.keys(dict);
    const missingKeys = baseKeys.filter(function (k) { return !Object.prototype.hasOwnProperty.call(dict, k); });
    const extraKeys = keys.filter(function (k) { return !Object.prototype.hasOwnProperty.call(base, k); });

    if (missingKeys.length) {
      errors.push('App.langs.' + code + ' is missing ' + missingKeys.length + ' key(s): ' + formatKeys(missingKeys) + '.');
    }

    if (extraKeys.length) {
      warnings.push('App.langs.' + code + ' has extra key(s): ' + formatKeys(extraKeys) + '.');
    }

    for (let j = 0; j < baseKeys.length; j++) {
      const key = baseKeys[j];
      if (!Object.prototype.hasOwnProperty.call(dict, key)) continue;

      if (typeof dict[key] !== 'string') {
        errors.push('App.langs.' + code + '.' + key + ' must be a string.');
        continue;
      }

      const expected = placeholders(base[key]).join('|');
      const actual = placeholders(dict[key]).join('|');
      if (expected !== actual) {
        errors.push('Placeholder mismatch for App.langs.' + code + '.' + key + ' (expected {' + placeholders(base[key]).join(', ') + '} got {' + placeholders(dict[key]).join(', ') + '}).');
      }
    }
  }

  loadScript('js/i18n.js');
  if (typeof App.t !== 'function' || typeof App.champ !== 'function') {
    errors.push('i18n functions App.t/App.champ are missing.');
  } else if (baseKeys.length) {
    const fallbackKey = baseKeys[0];
    const expected = base[fallbackKey];
    App.LANG = 'zz';
    if (App.t(fallbackKey) !== expected) {
      errors.push('App.t fallback to default language failed for key ' + fallbackKey + '.');
    }
    if (App.t('__missing_key__') !== '__missing_key__') {
      errors.push('App.t must return key when translation is missing in all languages.');
    }

    if (App.champ({ effet_en: 'Effect EN', effet_fr: '' }, 'effet') !== 'Effect EN') {
      errors.push('App.champ fallback to effet_en failed.');
    }
  }

  return { errors, warnings, langFiles, supported: uniqueSupported, defaultLang };
}

function main() {
  let result;
  try {
    result = runI18nCheck();
  } catch (err) {
    console.error('[check-i18n] Fatal error:', err.message);
    process.exit(1);
  }

  console.log('[check-i18n] Lang files:', result.langFiles.length);
  console.log('[check-i18n] Registered:', result.supported.length ? result.supported.join(', ') : '(none)');
  console.log('[check-i18n] Default:', result.defaultLang || '(none)');

  if (result.warnings.length) {
    console.log('[check-i18n] Warnings:');
    for (let i = 0; i < result.warnings.length; i++) {
      console.log('  - ' + result.warnings[i]);
    }
  }

  if (result.errors.length) {
    console.error('[check-i18n] Errors (' + result.errors.length + '):');
    for (let i = 0; i < result.errors.length; i++) {
      console.error('  - ' + result.errors[i]);
    }
    process.exit(1);
  }

  console.log('[check-i18n] OK');
}

if (require.main === module) {
  main();
}

module.exports = runI18nCheck;
