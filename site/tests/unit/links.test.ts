import { describe, it, expect } from 'vitest';
import { waLink, mailLink } from '../../src/lib/links';

describe('contact links', () => {
  it('builds a wa.me link with digits only and an encoded message', () => {
    expect(waLink('+20 111 936 9127', "Hi Ahmed, I'd like to build an app")).toBe(
      "https://wa.me/201119369127?text=Hi%20Ahmed%2C%20I'd%20like%20to%20build%20an%20app",
    );
  });
  it('encodes Arabic messages', () => {
    expect(waLink('+201119369127', 'مرحبا')).toBe('https://wa.me/201119369127?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7');
  });
  it('builds a mailto link with an encoded subject', () => {
    expect(mailLink('agalal819@gmail.com', 'App project')).toBe('mailto:agalal819@gmail.com?subject=App%20project');
  });
});
