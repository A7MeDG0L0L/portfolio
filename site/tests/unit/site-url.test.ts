import { describe, it, expect } from 'vitest';
import { resolveSiteUrl } from '../../site-url.mjs';

describe('resolveSiteUrl', () => {
  it('uses an explicit SITE_URL first', () => {
    expect(resolveSiteUrl({ SITE_URL: 'https://ahmedgalal.dev', VERCEL_PROJECT_PRODUCTION_URL: 'x.vercel.app' })).toBe('https://ahmedgalal.dev');
  });
  it("uses Vercel's production URL on Vercel", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'ahmedgalal.vercel.app' })).toBe('https://ahmedgalal.vercel.app');
  });
  it('falls back to localhost for local builds', () => {
    expect(resolveSiteUrl({})).toBe('http://localhost:4321');
  });
});
