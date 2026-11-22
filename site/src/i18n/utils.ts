import { ui, type UiKey } from './ui';
import type { Locale } from './locales';

export function t(locale: Locale, key: UiKey): string {
  return ui[locale][key];
}

const AR_PREFIX = /^\/ar(?=\/|$)/;

export function getLocaleFromUrl(url: URL): Locale {
  return AR_PREFIX.test(url.pathname) ? 'ar' : 'en';
}

export function localizePath(path: string, locale: Locale): string {
  const base = path.replace(AR_PREFIX, '') || '/';
  if (locale === 'en') return base;
  return base === '/' ? '/ar/' : `/ar${base}`;
}

export function altLocalePath(url: URL): string {
  const other: Locale = getLocaleFromUrl(url) === 'en' ? 'ar' : 'en';
  return localizePath(url.pathname, other) + url.hash;
}
