const { test, expect } = require('@playwright/test');

async function openApp(page) {
  await page.goto('/CO33-Pictos.html');
  await expect(page.locator('#grille .carte-picto').first()).toBeVisible();
}

function parseId(text) {
  return Number(String(text || '').replace('#', '').trim());
}

/** Click the settings gear to open the popover */
async function openSettings(page) {
  await page.locator('#btn-settings').click();
  await expect(page.locator('#settings-popover.visible')).toBeVisible();
}

/** Switch to a tab by data-tab value */
async function switchTab(page, tabName) {
  await page.locator('.tab-btn[data-tab="' + tabName + '"]').click();
}

test('renders cards and progression counters', async ({ page }) => {
  await openApp(page);

  const totalText = await page.locator('#nb-total').textContent();
  const total = Number(totalText);
  const cards = await page.locator('#grille .carte-picto').count();

  expect(total).toBeGreaterThan(0);
  expect(cards).toBe(total);
  await expect(page.locator('#prog-pct')).not.toBeEmpty();
});

test('supports zone filter and id-desc sorting', async ({ page }) => {
  await openApp(page);

  await page.selectOption('#tri-select', 'id-desc');

  const idTexts = await page.locator('#grille .carte-picto .carte-id').allTextContents();
  const ids = idTexts.map(parseId).filter(function (n) { return Number.isFinite(n); });
  const firstId = parseId(idTexts[0]);
  const maxId = Math.max.apply(null, ids);
  expect(firstId).toBe(maxId);

  const zoneSelect = page.locator('#filtre-zone');
  const options = zoneSelect.locator('option');
  const optionCount = await options.count();
  expect(optionCount).toBeGreaterThan(1);

  const firstZoneValue = await options.nth(1).getAttribute('value');
  expect(firstZoneValue).toBeTruthy();
  await zoneSelect.selectOption(firstZoneValue);

  const selectedZoneLabel = ((await zoneSelect.locator('option:checked').textContent()) || '').trim();
  const visibleCards = page.locator('#grille .carte-picto:not(.cachee)');
  const visibleCount = await visibleCards.count();
  expect(visibleCount).toBeGreaterThan(0);

  const sampleSize = Math.min(3, visibleCount);
  for (let i = 0; i < sampleSize; i++) {
    await expect(visibleCards.nth(i).locator('.carte-zone')).toContainText(selectedZoneLabel);
  }
});

test('opens and closes tooltip from card interaction', async ({ page }) => {
  await openApp(page);

  await page.locator('#grille .carte-picto').first().click();
  await expect(page.locator('#tooltip-overlay.visible')).toBeVisible();
  await expect(page.locator('#tt-nom-fr')).not.toBeEmpty();
  await expect(page.locator('#tt-effet')).not.toBeEmpty();

  await page.locator('#tooltip-panneau').evaluate(el => el.scrollTop = 0);
  await page.locator('#tooltip-fermer').click();
  await expect(page.locator('#tooltip-overlay.visible')).toHaveCount(0);
});

test('imports progress from code and updates owned counters', async ({ page }) => {
  await openApp(page);

  const importCode = Buffer.from(JSON.stringify([1, 2, 3])).toString('base64');
  // Open settings popover to access import button
  await openSettings(page);
  await page.locator('#btn-import').click();
  await expect(page.locator('#import-overlay.visible')).toBeVisible();
  await page.locator('#import-textarea').fill(importCode);
  await page.locator('#btn-import-valider').click();

  await expect(page.locator('#import-overlay.visible')).toHaveCount(0);
  await expect(page.locator('#nb-possedes')).toHaveText('3');
  await expect(page.locator('.carte-picto[data-id="1"]')).toHaveClass(/possede/);
});

test('isolates owned state between progression profiles', async ({ page }) => {
  await openApp(page);

  const profileSelect = page.locator('#profil-select');
  await expect(profileSelect.locator('option')).toHaveCount(1);
  const baseProfileId = await profileSelect.inputValue();

  await page.locator('.carte-picto[data-id="1"] .possession-indicateur').click();
  await expect(page.locator('#nb-possedes')).toHaveText('1');

  await page.locator('#btn-profil-add').click();
  await expect(page.locator('#prompt-overlay')).toBeVisible();
  await page.locator('#prompt-input').fill('Run B');
  await page.locator('#btn-prompt-ok').click();
  await expect(page.locator('#prompt-overlay')).not.toBeVisible();

  await expect(profileSelect.locator('option')).toHaveCount(2);
  const runBId = await profileSelect.inputValue();
  expect(runBId).not.toBe(baseProfileId);
  await expect(page.locator('#nb-possedes')).toHaveText('0');
  await expect(page.locator('.carte-picto[data-id="1"]')).not.toHaveClass(/possede/);

  const runBImportCode = Buffer.from(JSON.stringify([2, 3])).toString('base64');
  // Open settings popover to access import button
  await openSettings(page);
  await page.locator('#btn-import').click();
  await expect(page.locator('#import-overlay.visible')).toBeVisible();
  await page.locator('#import-textarea').fill(runBImportCode);
  await page.locator('#btn-import-valider').click();
  await expect(page.locator('#import-overlay.visible')).toHaveCount(0);
  await expect(page.locator('#nb-possedes')).toHaveText('2');
  await expect(page.locator('.carte-picto[data-id="2"]')).toHaveClass(/possede/);

  await profileSelect.selectOption(baseProfileId);
  await expect(page.locator('#nb-possedes')).toHaveText('1');
  await expect(page.locator('.carte-picto[data-id="1"]')).toHaveClass(/possede/);
  await expect(page.locator('.carte-picto[data-id="2"]')).not.toHaveClass(/possede/);

  await profileSelect.selectOption(runBId);
  await expect(page.locator('#nb-possedes')).toHaveText('2');
  await expect(page.locator('.carte-picto[data-id="2"]')).toHaveClass(/possede/);
});

test('build planner computes lumina totals and dedicated filtering', async ({ page }) => {
  await openApp(page);

  // Switch to Lumina tab to access planner controls
  await switchTab(page, 'lumina');

  await page.locator('#lumina-budget').fill('10');
  await page.locator('.carte-picto[data-id="1"] .build-indicateur').click();
  await page.locator('.carte-picto[data-id="2"] .build-indicateur').click();
  await page.locator('.carte-picto[data-id="3"] .build-indicateur').click();

  await expect(page.locator('#lumina-selected-count')).toContainText('3');
  await expect(page.locator('#lumina-total-cost')).toContainText('13');
  await expect(page.locator('#lumina-remaining')).toContainText('-3');

  await page.locator('.btn-filtre-build[data-build-filtre="planifies"]').click();
  const visibleCards = page.locator('#grille .carte-picto:not(.cachee)');
  await expect(visibleCards).toHaveCount(3);

  await page.selectOption('#tri-select', 'build-first');
  const firstVisibleId = await visibleCards.first().getAttribute('data-id');
  expect(firstVisibleId).toBe('1');
});

test('applies advanced gameplay filters and updates farm route grouping', async ({ page }) => {
  await openApp(page);

  // Switch to Filtres tab to access gameplay filters
  await switchTab(page, 'filtres');

  await page.locator('#gameplay-tag-buttons .btn-filtre-gameplay[data-gameplay-tag="burn"]').click();
  await expect(page.locator('#gameplay-tag-buttons .btn-filtre-gameplay.actif')).toHaveCount(1);
  await expect(page.locator('.carte-picto[data-id="2"]')).not.toHaveClass(/cachee/);
  await expect(page.locator('.carte-picto[data-id="1"]')).toHaveClass(/cachee/);

  await page.locator('#gameplay-tag-buttons .btn-filtre-gameplay[data-gameplay-tag="crit"]').click();
  await page.selectOption('#filtre-gameplay-mode', 'all');

  const visibleCards = page.locator('#grille .carte-picto:not(.cachee)');
  const visibleCount = await visibleCards.count();
  expect(visibleCount).toBeGreaterThan(0);

  const sampleSize = Math.min(5, visibleCount);
  for (let i = 0; i < sampleSize; i++) {
    const tags = (await visibleCards.nth(i).getAttribute('data-gameplay-tags')) || '';
    expect(tags).toContain('burn');
    expect(tags).toContain('crit');
  }

  const routeZones = page.locator('#farm-route-groups .farm-route-zone');
  const routeFlags = page.locator('#farm-route-groups .farm-route-flag');
  expect(await routeZones.count()).toBeGreaterThan(0);
  expect(await routeFlags.count()).toBeGreaterThan(0);
  await expect(page.locator('#farm-route-groups .farm-route-item[data-id="2"]')).toBeVisible();

  await page.locator('#btn-gameplay-clear').click();
  await expect(page.locator('#gameplay-tag-buttons .btn-filtre-gameplay.actif')).toHaveCount(0);
});

test('shows dataset additions and updates from metadata changelog', async ({ page }) => {
  await openApp(page);

  // Switch to Infos tab to access dataset changes
  await switchTab(page, 'infos');

  await expect(page.locator('#dataset-changes-title')).not.toBeEmpty();
  await expect(page.locator('#dataset-changes-meta')).toContainText('2026.02.24');
  await expect(page.locator('#dataset-changes-added-list li')).toHaveCount(6);
  await expect(page.locator('#dataset-changes-updated-list li')).toHaveCount(3);
});

test('switches language and updates searchable placeholder', async ({ page }) => {
  await openApp(page);

  await page.locator('.btn-lang[data-lang="fr"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.locator('#recherche')).toHaveAttribute('placeholder', /Rechercher/);

  await page.locator('.btn-lang[data-lang="en"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#recherche')).toHaveAttribute('placeholder', /Search/);
});
