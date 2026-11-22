import { test, expect } from '@playwright/test';

test('home renders in dark theme by default', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(html).toHaveAttribute('lang', 'en');
  await expect(html).toHaveAttribute('dir', 'ltr');
});

test('theme toggle persists across reload', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('CV is served', async ({ request }) => {
  const res = await request.get('/cv/Ahmed-Galal-CV.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('pdf');
});

test('monogram logo and tab icons', async ({ page, request }) => {
  await page.goto('/');
  const logo = page.locator('header .logo img');
  await expect(logo).toHaveAttribute('src', '/brand/ag-monogram.png');
  expect(await logo.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
  await expect(page.locator('link[rel="icon"][sizes="32x32"]')).toHaveAttribute('href', '/favicon-32.png');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
  expect((await request.get('/favicon-32.png')).status()).toBe(200);
});
