import { test, expect } from '@playwright/test';

test('sections exist in order', async ({ page }) => {
  await page.goto('/');
  const ids = await page.locator('main section[id]').evaluateAll((els) => els.map((e) => e.id));
  expect(ids.filter((id) => id !== 'hero')).toEqual(['quick-look', 'work', 'experience', 'skills', 'contact']);
});

test('work shows 16 cards, no ai-dev', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('#work [data-testid=project-card]');
  await expect(cards).toHaveCount(16);
  const hrefs = await cards.evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(hrefs).not.toContain('/work/ai-dev/');
  expect(hrefs).toContain('/work/shop-and-ship/');
});

test('experience lists 6 roles, timeline 5', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#experience [data-testid=role]')).toHaveCount(6);
  await expect(page.locator('#quick-look [data-testid=timeline-item]')).toHaveCount(5);
});

test('CTAs repeated in contact', async ({ page }) => {
  await page.goto('/');
  for (const name of [/Hire me full-time/, /Build my app/]) {
    const heroHref = await page.getByTestId('hero').getByRole('link', { name }).getAttribute('href');
    await expect(page.locator('#contact').getByRole('link', { name })).toHaveAttribute('href', heroHref!);
  }
});

test('no broken images or empty links', async ({ page }) => {
  await page.goto('/');
  const badImgs = await page.locator('img').evaluateAll((imgs) =>
    (imgs as HTMLImageElement[]).filter((i) => !i.getAttribute('src') || (i.complete && i.naturalWidth === 0)).map((i) => i.outerHTML),
  );
  expect(badImgs).toEqual([]);
  const badLinks = await page.locator('a').evaluateAll((as) =>
    as.filter((a) => { const h = a.getAttribute('href'); return !h || h.trim() === '' || h === '#'; }).map((a) => a.outerHTML.slice(0, 120)),
  );
  expect(badLinks).toEqual([]);
});

test('tile expands', async ({ page }) => {
  await page.goto('/');
  const tile = page.getByTestId('tile-now');
  await tile.click();
  await expect(tile).toHaveClass(/big/);
  await tile.click();
  await expect(tile).not.toHaveClass(/big/);
});

test('contact lists both phone numbers as call links', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#contact a[href="tel:+201119369127"]')).toHaveCount(1);
  await expect(page.locator('#contact a[href="tel:+201111199742"]')).toHaveCount(1);
});

test('mobile: quick look stats sit in a tidy 2 x 2 grid', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'mobile layout only');
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/');
  const grid = await page.locator('#quick-look .stats').boundingBox();
  const boxes = await page.locator('#quick-look .stat').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().width));
  expect(boxes).toHaveLength(4);
  for (const w of boxes) expect(w).toBeLessThan(grid!.width / 2 + 1);
});

test('10M+ downloads appears in the hero and as the first Quick Look stat', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero').getByTestId('reach')).toContainText('10M+');
  await expect(page.locator('#quick-look .stat').first()).toContainText('10M+');
  await expect(page.locator('#quick-look .stat')).toHaveCount(4);
});
