import { describe, it, expect } from 'vitest';
import { ui } from '../../src/i18n/ui';
import { t, localizePath, altLocalePath, getLocaleFromUrl } from '../../src/i18n/utils';

describe('localizePath', () => {
  it('adds the /ar prefix for Arabic', () => {
    expect(localizePath('/work/khosomat/', 'ar')).toBe('/ar/work/khosomat/');
    expect(localizePath('/', 'ar')).toBe('/ar/');
  });
  it('strips the /ar prefix for English', () => {
    expect(localizePath('/ar/work/khosomat/', 'en')).toBe('/work/khosomat/');
    expect(localizePath('/ar/', 'en')).toBe('/');
  });
  it('is idempotent for the same locale', () => {
    expect(localizePath('/ar/work/khosomat/', 'ar')).toBe('/ar/work/khosomat/');
  });
});

describe('locale detection and switching', () => {
  it('detects locale from the URL', () => {
    expect(getLocaleFromUrl(new URL('https://x/ar/work/khosomat/'))).toBe('ar');
    expect(getLocaleFromUrl(new URL('https://x/work/khosomat/'))).toBe('en');
    expect(getLocaleFromUrl(new URL('https://x/arabic-post/'))).toBe('en');
  });
  it('altLocalePath keeps the page and hash', () => {
    expect(altLocalePath(new URL('https://x/work/khosomat/#stack'))).toBe('/ar/work/khosomat/#stack');
    expect(altLocalePath(new URL('https://x/ar/'))).toBe('/');
  });
});

describe('dictionary', () => {
  it('ar and en dictionaries have identical keys and no empty values', () => {
    expect(Object.keys(ui.ar).sort()).toEqual(Object.keys(ui.en).sort());
    for (const loc of ['en', 'ar'] as const) {
      for (const [k, v] of Object.entries(ui[loc])) expect(v.trim(), `${loc}.${k}`).not.toBe('');
    }
  });
  it('t returns the localized string', () => {
    expect(t('en', 'navWork')).toBe('Work');
    expect(t('ar', 'navWork')).not.toBe('Work');
  });
});
