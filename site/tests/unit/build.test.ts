import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Run after `npm run build`.
const dist = path.resolve(__dirname, '../../dist');
const slugs = ['shop-and-ship', 'bluworks-tablet', 'khosomat', 'nasa-daily', 'made-me-laugh', 'simple-file-manager', 'flutter-pdf-designer'];

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
