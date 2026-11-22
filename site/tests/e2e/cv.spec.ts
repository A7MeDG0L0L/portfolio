import { test, expect } from '@playwright/test';

test('Preview CV opens a viewer with all 3 pages and a download button', async ({ page }) => {
  await page.goto('/');
  const open = page.getByTestId('hero').getByRole('link', { name: /Preview CV/ });
  await expect(open).toHaveAttribute('href', '/cv/');
  await open.click();
  const viewer = page.getByTestId('cv-viewer');
  await expect(viewer).toBeVisible();
  const pages = viewer.locator('img');
  await expect(pages).toHaveCount(3);
  await expect
    .poll(() => pages.evaluateAll((imgs) => (imgs as HTMLImageElement[]).filter((i) => i.complete && i.naturalWidth > 0).length), { timeout: 10_000 })
    .toBeGreaterThanOrEqual(1);
  const dl = viewer.getByRole('link', { name: /Download PDF/ });
  await expect(dl).toHaveAttribute('href', '/cv/Ahmed-Galal-CV.pdf');
  await expect(dl).toHaveAttribute('download', /.*/);
  await page.keyboard.press('Escape');
  await expect(viewer).toBeHidden();
});

test('close button closes the viewer and returns focus', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop only');
  await page.goto('/');
  const open = page.getByTestId('hero').getByRole('link', { name: /Preview CV/ });
  await open.click();
  await page.getByTestId('cv-viewer').getByRole('button', { name: /Close/ }).click();
  await expect(page.getByTestId('cv-viewer')).toBeHidden();
  await expect(open).toBeFocused();
});

test('no-JS: Preview CV goes to the /cv/ page with the pages and a download', async ({ browser, baseURL }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await ctx.newPage();
  await page.goto('/');
  await page.getByTestId('hero').getByRole('link', { name: /Preview CV/ }).click();
  await expect(page).toHaveURL(/\/cv\/$/);
  await expect(page.locator('main img')).toHaveCount(3);
  await expect(page.locator('main').getByRole('link', { name: /Download PDF/ })).toHaveAttribute('href', '/cv/Ahmed-Galal-CV.pdf');
  await ctx.close();
});

test('Arabic: Preview CV points to /ar/cv/', async ({ page }) => {
  await page.goto('/ar/');
  await expect(page.getByTestId('hero').locator('a[data-cv-open]')).toHaveAttribute('href', '/ar/cv/');
});

test('desktop: CV viewer is horizontally centred', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop only');
  await page.goto('/');
  await page.getByTestId('hero').getByRole('link', { name: /Preview CV/ }).click();
  const box = (await page.getByTestId('cv-viewer').boundingBox())!;
  const vw = page.viewportSize()!.width;
  expect(Math.abs(box.x - (vw - box.x - box.width))).toBeLessThanOrEqual(2);
});
