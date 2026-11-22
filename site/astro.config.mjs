// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// `site` is a placeholder until Ahmed picks a domain.
export default defineConfig({
  site: 'https://ahmedgalal.dev',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', ar: 'ar' } } })],
  vite: { plugins: [tailwindcss()] },
});
