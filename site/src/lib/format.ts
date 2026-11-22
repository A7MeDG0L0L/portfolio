import type { Locale } from '../i18n/locales';

export function formatMonth(ym: string, locale: Locale): string {
  const [y, m] = ym.split('-').map(Number);
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  );
}

export function yearSpan(start: string, end: string | null, nowLabel: string): string {
  if (end === null) return nowLabel;
  const a = start.slice(0, 4);
  const b = end.slice(0, 4);
  return a === b ? a : `${a}–${b.slice(2)}`;
}
