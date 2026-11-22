// The public address of the site, used for canonical URLs, hreflang, the sitemap and social previews.
// Order: explicit SITE_URL > Vercel's production URL (auto-switches to a custom domain once added) > local.
/** @param {Record<string, string | undefined>} env */
export function resolveSiteUrl(env) {
  if (env.SITE_URL) return env.SITE_URL.replace(/\/$/, '');
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return 'http://localhost:4321';
}
