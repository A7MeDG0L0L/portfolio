import { test, expect } from '@playwright/test';

function contrast(a: number[], b: number[]) {
  const lum = (c: number[]) => {
    const [r, g, bl] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test('light theme: accent links meet WCAG AA on the page background', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'light'));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  const [fg, bg] = await page.evaluate(() => {
    const rgb = (s: string) => (s.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
    const link = document.querySelector('#experience h3 a')!;
    return [rgb(getComputedStyle(link).color), rgb(getComputedStyle(document.documentElement).backgroundColor)];
  });
  expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
});
