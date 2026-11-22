# CLAUDE.md — Ahmed Galal Portfolio

## What this is
Bilingual (EN/AR) static portfolio site for Ahmed Galal (mobile developer): phone hero with app-icon case studies, bento "Quick Look", recruiter + freelance-client CTAs.

## Stack
Astro 7.4, Tailwind CSS 4, TypeScript strict, `@astrojs/sitemap`, Fontsource (Inter, IBM Plex Sans Arabic). Tests: Vitest 5, Playwright 1.65, Lighthouse CI 0.16. OG image via satori + resvg at build time. Node 26 / npm 11.

## Commands
```
# setup:   cd site && npm install && npx playwright install chromium
# run:     cd site && npm run dev -- --ignore-lock
# test:    cd site && npm run build && npm test && npm run e2e && npx lhci autorun
# lint:    cd site && npm run check   (astro check: 0 errors expected)
```

## Conventions
- All copy in `site/src/content/**` (typed by `src/content/schemas.ts`) and `site/src/i18n/ui.ts`. Never hard-code copy in components.
- EN at `/`, AR at `/ar/` (RTL). Pages are thin wrappers around `components/pages/Home.astro` and `components/casestudy/CaseStudy.astro`.
- Use logical CSS properties (`inset-inline-start`, `padding-inline-*`) so RTL works for free.
- Interactive pieces are links first (work without JS); JS islands are plain TS (`phone.ts`, `tiles.ts`, theme toggle).
- No unconfirmed numbers or claims in copy; tests enforce it.
- Astro 7 auto-backgrounds `dev`/`preview` under AI agents; always pass `--ignore-lock` when running them from an agent.
- If the dev server shows stale content after a schema or content change: STOP dev first, then delete `site/.astro/`, then start dev. Deleting while dev runs does nothing (it rewrites its old cache on exit). The build is unaffected.

## Do not touch
- `docs/superpowers/specs/*` (CEO-approved design) without a CR.
- `site/public/cv/Ahmed-Galal-CV.pdf` except to replace it with a newer CV from Ahmed.
