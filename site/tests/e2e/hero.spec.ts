import { test, expect } from '@playwright/test';

const desktopOnly = (name: string) => test.skip(name !== 'desktop', 'desktop layout only');

test('hero shows headline and both CTAs', async ({ page }) => {
  await page.goto('/');
  const hero = page.getByTestId('hero');
  await expect(hero.getByRole('heading', { level: 1 })).toContainText('I build mobile apps');
  const hire = hero.getByRole('link', { name: /Hire me full-time/ });
  await expect(hire).toHaveAttribute('href', '/cv/Ahmed-Galal-CV.pdf');
  await expect(hire).toHaveAttribute('download', /.*/);
  const build = hero.getByRole('link', { name: /Build my app/ });
  expect(await build.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/201119369127/);
});

test('8 app icons', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero').getByTestId('app-icon')).toHaveCount(8);
});

test('click opens sheet in phone, back closes', async ({ page }, info) => {
  desktopOnly(info.project.name);
  await page.goto('/');
  await page.getByTestId('app-icon').filter({ hasText: 'Shop&Ship' }).click();
  const sheet = page.locator('#sheet-shop-and-ship');
  await expect(sheet).toBeVisible();
  await expect(sheet).toContainText('Shop & Ship');
  await expect(sheet).toContainText('HERE Maps');
  await sheet.getByRole('button', { name: /Home/ }).click();
  await expect(sheet).toBeHidden();
});

test('keyboard: Enter opens, Esc closes, focus returns', async ({ page }, info) => {
  desktopOnly(info.project.name);
  await page.goto('/');
  const icon = page.getByTestId('app-icon').filter({ hasText: 'Khosomat' });
  await icon.focus();
  await page.keyboard.press('Enter');
  const sheet = page.locator('#sheet-khosomat');
  await expect(sheet.getByRole('heading', { name: 'Khosomat' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(icon).toBeFocused();
});

test.fixme('no-JS: icon navigates to case study', async ({ browser, baseURL }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await ctx.newPage();
  await page.goto('/');
  await page.getByTestId('app-icon').filter({ hasText: 'Khosomat' }).click();
  await expect(page).toHaveURL(/\/work\/khosomat\/$/);
  await ctx.close();
});

test('mobile: sheet is full-screen', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'mobile layout only');
  await page.goto('/');
  await page.getByTestId('app-icon').filter({ hasText: 'Khosomat' }).click();
  const box = await page.locator('#sheet-khosomat').boundingBox();
  expect(box?.width).toBe(page.viewportSize()?.width);
});
