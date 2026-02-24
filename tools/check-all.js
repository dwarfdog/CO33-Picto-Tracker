#!/usr/bin/env node

const runSyntaxCheck = require('./check-syntax');
const runI18nCheck = require('./check-i18n');
const validateData = require('./validate-data');
const runCoreTests = require('./test-core');

const STEPS = [
  {
    name: 'syntax',
    run: function () {
      runSyntaxCheck();
    }
  },
  {
    name: 'data',
    run: function () {
      const result = validateData();
      console.log('[validate-data] Pictos:', result.pictosCount);
      console.log('[validate-data] Confirmed/Derived:', result.confirmed + '/' + result.derived);
      if (result.warnings.length) {
        console.log('[validate-data] Warnings:');
        for (let i = 0; i < result.warnings.length; i++) {
          console.log('  - ' + result.warnings[i]);
        }
      }
      if (result.errors.length) {
        console.error('[validate-data] Errors (' + result.errors.length + '):');
        for (let i = 0; i < result.errors.length; i++) {
          console.error('  - ' + result.errors[i]);
        }
        throw new Error('Data validation failed');
      }
      console.log('[validate-data] OK');
    }
  },
  {
    name: 'i18n',
    run: function () {
      const result = runI18nCheck();
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
        throw new Error('I18n validation failed');
      }
      console.log('[check-i18n] OK');
    }
  },
  {
    name: 'core',
    run: function () {
      runCoreTests();
      console.log('[test-core] OK');
    }
  }
];

for (let i = 0; i < STEPS.length; i++) {
  const step = STEPS[i];
  console.log('[check-all] Running:', step.name);
  try {
    step.run();
  } catch (err) {
    console.error('[check-all] FAILED at step', step.name + ':', err.message);
    process.exit(1);
  }
}

console.log('[check-all] OK');
