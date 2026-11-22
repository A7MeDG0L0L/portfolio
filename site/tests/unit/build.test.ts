import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Run after `npm run build`.
const dist = path.resolve(__dirname, '../../dist');
const slugs = ['bluworks', 'bluworks-tablet', 'shop-and-ship', 'aramex-mobile', 'aramex-freight', 'aramex-global-shopper', 'myus', 'khosomat', 'soura', 'convertify', 'xo-clash', 'daily-tips', 'nasa-daily', 'made-me-laugh', 'simple-file-manager', 'flutter-pdf-designer'];

describe('build output', () => {
  it('has a case study page per project in both locales', () => {
    for (const s of slugs) {
      expect(fs.existsSync(path.join(dist, 'work', s, 'index.html')), `en ${s}`).toBe(true);
      expect(fs.existsSync(path.join(dist, 'ar', 'work', s, 'index.html')), `ar ${s}`).toBe(true);
    }
  });
  it('has no page for the AI approach entry', () => {
    expect(fs.existsSync(path.join(dist, 'work', 'ai-dev'))).toBe(false);
    expect(fs.existsSync(path.join(dist, 'ar', 'work', 'ai-dev'))).toBe(false);
  });
  it('has an Arabic home page', () => {
    expect(fs.existsSync(path.join(dist, 'ar', 'index.html'))).toBe(true);
  });
});

describe('performance budget', () => {
  it('home JS budget: script files loaded by / total ≤ 100 KB', () => {
    const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
    const srcs = [...html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
    const total = srcs.reduce((sum, s) => sum + fs.statSync(path.join(dist, s)).size, 0);
    const inline = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)]
      .filter((m) => !/application\/ld\+json/.test(m[0]))
      .reduce((sum, m) => sum + Buffer.byteLength(m[1]), 0);
    expect(total + inline).toBeLessThanOrEqual(102400);
  });
});

describe('CV preview pages', () => {
  it('builds /cv/ and /ar/cv/ plus the three page images', () => {
    expect(fs.existsSync(path.join(dist, 'cv', 'index.html'))).toBe(true);
    expect(fs.existsSync(path.join(dist, 'ar', 'cv', 'index.html'))).toBe(true);
    for (const n of [1, 2, 3]) expect(fs.existsSync(path.join(dist, 'cv', `page-${n}.webp`))).toBe(true);
  });
});
