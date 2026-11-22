import { test, expect } from '@playwright/test';

const pages = ['/', '/work/shop-and-ship/'];

test('titles and descriptions are unique and non-empty', async ({ page }) => {
  const seen = new Set<string>();
  for (const p of pages) {
    await page.goto(p);
    const title = await page.title();
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(title.trim()).not.toBe('');
    expect(desc?.trim()).toBeTruthy();
    expect(seen.has(title)).toBe(false);
    seen.add(title);
  }
});

for (const p of pages) {
  test(`social + hreflang tags: ${p}`, async ({ page, request }) => {
    await page.goto(p);
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(og).toMatch(/^https?:\/\//);
    const res = await request.get(new URL(og!).pathname);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('image/png');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    const ar = await page.locator('link[rel="alternate"][hreflang="ar"]').getAttribute('href');
    expect(new URL(ar!).pathname).toBe(`/ar${p}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${p.replace(/\//g, '\\/')}$`));
  });
}

test('Person JSON-LD on home', async ({ page }) => {
  await page.goto('/');
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const data = JSON.parse(raw!);
  expect(data['@type']).toBe('Person');
  expect(data.name).toBe('Ahmed Galal');
  expect(data.sameAs).toContain('https://github.com/A7MeDG0L0L');
});

test('sitemap exists', async ({ request }) => {
  const res = await request.get('/sitemap-index.xml');
  expect(res.status()).toBe(200);
});
