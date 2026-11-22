import { test, expect } from '@playwright/test';

test('/ar/ is rtl', async ({ page }) => {
  await page.goto('/ar/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
});

test('toggle keeps page', async ({ page }) => {
  await page.goto('/work/khosomat/');
  await page.getByTestId('lang-toggle').click();
  await expect(page).toHaveURL(/\/ar\/work\/khosomat\/$/);
  await page.getByTestId('lang-toggle').click();
  await expect(page).toHaveURL(/\/work\/khosomat\/$/);
  expect(new URL(page.url()).pathname).toBe('/work/khosomat/');
});

for (const p of ['/', '/ar/', '/work/shop-and-ship/', '/ar/work/shop-and-ship/']) {
  test(`no horizontal scroll at 360px: ${p}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    const res = await page.goto(p);
    expect(res?.ok()).toBe(true);
    const w = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(w).toBeLessThanOrEqual(360);
  });
}

test('case study omits empty result section', async ({ page }) => {
  await page.goto('/work/khosomat/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Khosomat');
  await expect(page.getByTestId('results')).toHaveCount(0);
});

test('case study shows only defined links', async ({ page }) => {
  await page.goto('/work/khosomat/');
  const links = page.getByTestId('project-links').getByRole('link');
  await expect(links).toHaveCount(1);
  await expect(links.first()).toHaveAttribute('href', 'https://github.com/A7MeDG0L0L/khsomat');
});
