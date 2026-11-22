import { describe, it, expect } from 'vitest';
import { formatMonth, yearSpan } from '../../src/lib/format';

describe('date formatting', () => {
  it('formats YYYY-MM as short month + year', () => {
    expect(formatMonth('2025-12', 'en')).toBe('Dec 2025');
    expect(formatMonth('2025-12', 'ar')).toMatch(/٢٠٢٥|2025/);
  });
  it('yearSpan collapses same-year spans and shortens the end year', () => {
    expect(yearSpan('2022-01', '2022-05', 'Now')).toBe('2022');
    expect(yearSpan('2021-08', '2022-01', 'Now')).toBe('2021–22');
    expect(yearSpan('2025-12', null, 'Now')).toBe('Now');
  });
});
