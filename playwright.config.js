const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    headless: true,
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'node tools/serve-static.js',
    url: 'http://127.0.0.1:4173/CO33-Pictos.html',
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  }
});
