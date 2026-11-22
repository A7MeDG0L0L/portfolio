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

const slugs = ['bluworks', 'bluworks-tablet', 'shop-and-ship', 'aramex-mobile', 'aramex-freight', 'aramex-global-shopper', 'myus', 'khosomat', 'soura', 'convertify', 'xo-clash', 'daily-tips', 'nasa-daily', 'made-me-laugh', 'simple-file-manager', 'flutter-pdf-designer'];
for (const p of ['/', '/ar/', ...slugs.flatMap((s) => [`/work/${s}/`, `/ar/work/${s}/`])]) {
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

test('toggle keeps anchor', async ({ page }) => {
  await page.goto('/#experience');
  await expect(page.getByTestId('lang-toggle')).toHaveAttribute('href', '/ar/#experience');
  await page.evaluate(() => { location.hash = 'work'; });
  await expect(page.getByTestId('lang-toggle')).toHaveAttribute('href', '/ar/#work');
});
