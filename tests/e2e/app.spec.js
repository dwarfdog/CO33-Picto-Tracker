const { test, expect } = require('@playwright/test');

async function openApp(page) {
  await page.goto('/CO33-Pictos.html');
  await expect(page.locator('#grille .carte-picto').first()).toBeVisible();
}

function parseId(text) {
  return Number(String(text || '').replace('#', '').trim());
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

  await page.locator('#tooltip-fermer').click();
  await expect(page.locator('#tooltip-overlay.visible')).toHaveCount(0);
});

test('imports progress from code and updates owned counters', async ({ page }) => {
  await openApp(page);

  const importCode = Buffer.from(JSON.stringify([1, 2, 3])).toString('base64');
  await page.locator('#btn-import').click();
  await expect(page.locator('#import-overlay.visible')).toBeVisible();
  await page.locator('#import-textarea').fill(importCode);
  await page.locator('#btn-import-valider').click();

  await expect(page.locator('#import-overlay.visible')).toHaveCount(0);
  await expect(page.locator('#nb-possedes')).toHaveText('3');
  await expect(page.locator('.carte-picto[data-id="1"]')).toHaveClass(/possede/);
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
