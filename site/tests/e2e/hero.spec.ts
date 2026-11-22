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

test('12 app icons, Made Me Laugh hidden from the phone', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero').getByTestId('app-icon')).toHaveCount(12);
  await expect(page.getByTestId('hero').locator('[data-sheet="made-me-laugh"]')).toHaveCount(0);
  await expect(page.locator('#work a[href="/work/made-me-laugh/"]')).toHaveCount(1);
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

test('no-JS: icon navigates to case study', async ({ browser, baseURL }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await ctx.newPage();
  await page.goto('/');
  await page.getByTestId('app-icon').filter({ hasText: 'Khosomat' }).click();
  await expect(page).toHaveURL(/\/work\/khosomat\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Khosomat');
  await ctx.close();
});

test('mobile: sheet is full-screen', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'mobile layout only');
  await page.goto('/');
  await page.getByTestId('app-icon').filter({ hasText: 'Khosomat' }).click();
  const box = await page.locator('#sheet-khosomat').boundingBox();
  expect(box?.width).toBe(page.viewportSize()?.width);
});

test('mobile: page behind the sheet does not scroll', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'mobile layout only');
  await page.goto('/');
  await page.getByTestId('app-icon').filter({ hasText: 'NASA' }).click();
  await expect(page.locator('#sheet-nasa-daily')).toBeVisible();
  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.move(200, 400);
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.scrollY)).toBe(before);
});

for (const width of [881, 700, 600]) {
  test(`phone frame is shown at tablet width ${width}px`, async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'viewport set explicitly');
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const box = await page.getByTestId('hero').locator('.phone').boundingBox();
    expect(box?.width).toBe(310);
    expect(box?.height).toBe(630);
  });
}

test('phone frame is hidden on a real phone (icons only)', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'viewport set explicitly');
  await page.setViewportSize({ width: 412, height: 900 });
  await page.goto('/');
  const box = await page.getByTestId('hero').locator('.phone').boundingBox();
  expect(box?.height).not.toBe(630);
  await expect(page.getByTestId('hero').getByTestId('app-icon')).toHaveCount(12);
});

test('app icons show real artwork', async ({ page }) => {
  await page.goto('/');
  const img = page.getByTestId('hero').getByTestId('app-icon').filter({ hasText: 'Shop&Ship' }).locator('img');
  await expect(img).toHaveAttribute('src', '/icons/shop-and-ship.png');
  expect(await img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
});

test('company logos render in the hero', async ({ page }) => {
  await page.goto('/');
  const logos = page.getByTestId('logos').locator('img');
  await expect(logos).toHaveCount(4);
  expect(await logos.evaluateAll((els) => els.map((e) => e.getAttribute('alt')))).toEqual(['Aramex', 'Bluworks', 'Tecfy', 'Khosomat']);
});
