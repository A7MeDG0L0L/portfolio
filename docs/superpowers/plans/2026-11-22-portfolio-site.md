# Ahmed Galal Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A fast, bilingual (EN/AR) static portfolio for Ahmed Galal: a phone hero whose app icons open project case studies, a scannable bento "Quick Look", and two CTAs ("Hire me full-time", "Build my app").

**Architecture:** Astro static site in `projects/portfolio/site/`. All copy lives in typed content collections and an i18n dictionary, and pages render from them. The only client JS is three small vanilla-TS islands (phone sheet, theme toggle, tile expand). Every interactive element is a real link first (progressive enhancement), so the site works with JS off.

**Tech Stack:** Astro 5, Tailwind CSS 4 (`@tailwindcss/vite`), TypeScript strict, `@astrojs/sitemap`, `@fontsource-variable/inter` + `@fontsource/ibm-plex-sans-arabic`, Vitest (unit), Playwright (e2e), `@lhci/cli` (Lighthouse). Node 26 / npm 11 are on the dev Mac.

**Spec:** `projects/portfolio/docs/superpowers/specs/2026-11-22-portfolio-design.md` (approved 2026-11-22). Visual reference: the "A+B Mix ★" tab in `projects/portfolio/mockups/directions.html`.

## Global Constraints

- Work on branch `feat/portfolio-site` in the AG-AI repo; never commit to `main`. Run a staged-diff secret scan before every commit.
- No claim, number or title that isn't in the CV or confirmed by Ahmed. Use "improved startup time" and "reduced critical bugs"; say "2 Flutter packages", not "published". Every `metrics[]` entry requires `confirmedBy: "ahmed"`.
- No intro animation or loading screen. All motion is disabled under `prefers-reduced-motion: reduce`.
- Default theme is dark, with a light toggle. Accents: cyan `#54C5F8` → violet `#7C5CFF`.
- English at `/`, Arabic at `/ar/` with `dir="rtl"` and a mirrored layout. Arabic copy is a draft: its dictionary carries `__draft: true` until Ahmed approves.
- CV is served at `/cv/Ahmed-Galal-CV.pdf`, copied from `~/Library/Mobile Documents/com~apple~CloudDocs/Downloads/AhmedGalalCV.pdf`, for both locales.
- "Shipped apps for" companies are plain-text wordmarks, with no logo files.
- Lighthouse mobile ≥ 95 in all four categories. Home page JS ≤ 100 KB (uncompressed, sum of `dist/_astro/*.js` loaded by `/`). Responsive from 360 px.
- Contact values (email, WhatsApp number) come only from `profile` content. Until Ahmed confirms, use the CV's values: `agalal819@gmail.com`, `+201119369127`.

## Review Focus

1. **JS disabled:** phone icons, tile ↗ and "Full case study" are plain `<a href="/work/<slug>/">` and still navigate. Tested in Task 4.
2. **Keyboard-only use of the phone sheet:** Enter opens it, focus moves into the sheet, Esc closes it, and focus returns to the icon that opened it. Tested in Task 4.
3. **Projects with missing content** (no screenshots or links yet): no broken `<img>`, no empty `href`, and a neutral placeholder cover is shown. Tested in Task 5.
4. **Language toggle on deep pages:** `/work/khosomat/` ↔ `/ar/work/khosomat/` keeps the same page and scroll anchor. Tested in Task 6.
5. **360 px width with long Arabic strings:** no horizontal scroll on any page in either locale. Tested in Task 6.

---

## File Structure

```
projects/portfolio/site/
  package.json, astro.config.mjs, tsconfig.json, vitest.config.ts, playwright.config.ts, lighthouserc.json
  public/cv/Ahmed-Galal-CV.pdf
  public/favicon.svg
  src/styles/global.css              tokens (CSS vars, dark + light), Tailwind import, reduced-motion rules
  src/content/schemas.ts             zod schemas (shared by content.config.ts and unit tests)
  src/content.config.ts              collections wired to schemas
  src/content/profile/en.json, ar.json
  src/content/projects/<slug>.md     8 files (en), <slug>.ar.md (ar)
  src/content/experience/en.json, ar.json
  src/content/skills/en.json, ar.json
  src/content/certifications/en.json, ar.json
  src/i18n/ui.ts                     UI strings dictionary {en, ar}
  src/i18n/utils.ts                  t(), localizePath(), getLocaleFromUrl(), altLocalePath()
  src/lib/links.ts                   waLink(), mailLink()
  src/lib/projects.ts                getProjects(locale), hasCaseStudyPage()
  src/layouts/Base.astro             <html lang dir>, head/SEO, no-flash theme script, Nav, Footer slot
  src/components/Nav.astro, ThemeToggle.astro, LangToggle.astro
  src/components/hero/Hero.astro, Phone.astro, AppIcon.astro, PhoneSheet.astro
  src/components/hero/phone.ts       island: open/close sheet, focus mgmt
  src/components/quicklook/QuickLook.astro, Tile.astro, tiles.ts
  src/components/sections/Work.astro, ProjectCard.astro, Experience.astro, Skills.astro, Contact.astro
  src/components/casestudy/CaseStudy.astro, Cover.astro
  src/components/seo/Seo.astro, PersonJsonLd.astro
  src/pages/index.astro, work/[slug].astro
  src/pages/ar/index.astro, ar/work/[slug].astro
  src/pages/og.png.ts                build-time OG image (satori + @resvg/resvg-js)
  tests/unit/*.test.ts               Vitest
  tests/e2e/*.spec.ts                Playwright
```

---

### Task 1: Scaffold, tokens, base layout, theme

**Files:**
- Create: `site/package.json`, `astro.config.mjs` (`site: "https://ahmedgalal.dev"` placeholder until Ahmed picks a domain, `trailingSlash: "always"`, `i18n: { defaultLocale: "en", locales: ["en","ar"], routing: { prefixDefaultLocale: false } }`, sitemap integration, tailwind vite plugin), `tsconfig.json` (extends `astro/tsconfigs/strict`), `vitest.config.ts`, `playwright.config.ts` (webServer: `npm run build && npm run preview`, port 4321; projects: chromium desktop 1280×800, mobile Pixel 7)
- Create: `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/ThemeToggle.astro`, `src/pages/index.astro` (placeholder `<h1>`)
- Create: `public/cv/Ahmed-Galal-CV.pdf` (copy), `public/favicon.svg` ("AG" monogram on the gradient)
- Test: `tests/e2e/base.spec.ts`

**Interfaces:**
- Produces: `Base.astro` props `{ title: string; description: string; locale: "en" | "ar"; altPath: string; ogImage?: string }`. CSS vars `--bg --panel --line --text --muted --accent --accent2 --ok` on `:root[data-theme="dark"]` and `:root[data-theme="light"]`. The theme is stored in `localStorage["theme"]` (wrapped in try/catch) and applied by an inline `<head>` script before paint.
- npm scripts: `dev`, `build`, `preview`, `test` (vitest run), `e2e` (playwright test), `lhci`.

- [ ] **Step 1:** Create the branch: `git -C /Users/ahmedgalal/AG-AI switch -c feat/portfolio-site`
- [ ] **Step 2:** Scaffold with `npm create astro@latest site -- --template minimal --typescript strict --no-git --install` inside `projects/portfolio/`, then add `tailwindcss @tailwindcss/vite @astrojs/sitemap @fontsource-variable/inter @fontsource/ibm-plex-sans-arabic` and dev deps `vitest @playwright/test @lhci/cli gray-matter`. Run `npx playwright install chromium`.
- [ ] **Step 3: Write the failing e2e test** `tests/e2e/base.spec.ts`:
  - `"home renders in dark theme by default"`: `html[data-theme="dark"]`, `html[lang="en"]`, `html[dir="ltr"]`.
  - `"theme toggle persists across reload"`: click `[data-testid=theme-toggle]` → `data-theme="light"`; reload → still `light`.
  - `"CV is served"`: `request.get("/cv/Ahmed-Galal-CV.pdf")` → status 200, `content-type` contains `pdf`.
- [ ] **Step 4:** Run `npm run e2e -- base.spec.ts` → expect FAIL.
- [ ] **Step 5:** Implement the tokens, `Base.astro` and `ThemeToggle.astro`. The dark values come from the mockup (`--bg:#0b0d12 --panel:#12151d --line:#252a37 --text:#e9ecf3 --muted:#8b93a7`). For light, use AA-contrast equivalents (`--bg:#f7f8fb --panel:#ffffff --line:#e3e6ee --text:#0b0d12 --muted:#4a5163`). Fonts: Inter for `en`, IBM Plex Sans Arabic for `ar`, via `:lang()`. Add a global `@media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}}`.
- [ ] **Step 6:** Run `npm run e2e -- base.spec.ts` → expect PASS.
- [ ] **Step 7:** Commit: `feat(portfolio): scaffold Astro site with tokens, base layout, theme toggle`

---

### Task 2: Content model + English content from the CV

**Files:**
- Create: `src/content/schemas.ts`, `src/content.config.ts`, every `src/content/**` file with `en` content, `src/lib/projects.ts`
- Test: `tests/unit/content.test.ts`

**Interfaces:**
- Produces collections (zod, exported from `schemas.ts`):
  - `profile` (json, id = locale): `{ name, title, location, headline, intro, available: boolean, availabilityText, email, whatsapp, linkedin, github, ctaHire, ctaBuild, waMessage, stats: {value,label}[] }`
  - `projects` (md): frontmatter `{ title, slug, type: "app"|"package"|"approach", company?: string, dates?: string, order: number, icon: { label: string, bg: string, fg?: string }, summary: string, stack: string[], links: { play?, appStore?, github?, pubdev?, web? }, metrics: { value, label, confirmedBy: z.literal("ahmed") }[], screenshots: { src, alt }[], locale: "en"|"ar" }`; body = case study.
  - `experience` (json): `{ roles: { company, title, start: "YYYY-MM", end: "YYYY-MM"|null, bullets: string[], inTimeline: boolean }[] }`
  - `skills` (json): `{ groups: { name, items: string[] }[] }`; `certifications` (json): `{ items: { title, issuer?, start, end, description }[] }`
- `getProjects(locale: "en"|"ar"): Promise<Project[]>` sorted by `order`; `hasCaseStudyPage(p: Project): boolean` → `p.type !== "approach"`.

- [ ] **Step 1: Write the failing test** `tests/unit/content.test.ts` (read the files with `fs` + `gray-matter` and validate them with the zod schemas from `schemas.ts`):
  - `"experience has the 6 CV roles, newest first"`: companies equal `["Bluworks","Aramex International LLC","Tecfy.co","The Sparks Foundation","Freelance","Khosomat.com"]`; `roles[0].end === null`; starts are `2025-12, 2023-06, 2022-04, 2022-05, 2022-01, 2021-08`.
  - `"timeline excludes only the internship"`: `roles.filter(r=>r.inTimeline).length === 5`, Sparks has `inTimeline:false`.
  - `"8 projects with the right types"`: slugs equal `shop-and-ship, bluworks-tablet, khosomat, nasa-daily, made-me-laugh, simple-file-manager, flutter-pdf-designer, ai-dev`; the two packages are `type:"package"`, `ai-dev` is `type:"approach"`, the rest are `"app"`.
  - `"no unconfirmed numbers in copy"`: for every EN content string outside `metrics[]`, `/\d+\s?%|\b\d+x\b/i` does not match.
  - `"profile contact matches CV"`: `email==="agalal819@gmail.com"`, `whatsapp==="+201119369127"`, github ends with `/A7MeDG0L0L`.
- [ ] **Step 2:** Run `npm test -- content` → expect FAIL.
- [ ] **Step 3:** Implement the schemas and write the EN content, transcribed from the CV (bullets close to verbatim). Icon colors come from the mockup (`#e1251b`, `#1f6bff`, `#ff8a00`, `#0b3d91`, `#ffd23f`, `#3ddc97`, `#d00000`, gradient for `ai-dev`). `profile.stats` = `5 yrs / Flutter + Android Native`, `AR / EN / Bilingual, RTL-ready UIs`, `Offline-first / Apps that work without signal`. Leave `metrics: []` and `screenshots: []` everywhere (pending Ahmed).
- [ ] **Step 4:** Run `npm test -- content` → expect PASS.
- [ ] **Step 5:** Commit: `feat(portfolio): content model and English content from CV`

---

### Task 3: i18n + link helpers

**Files:**
- Create: `src/i18n/ui.ts`, `src/i18n/utils.ts`, `src/lib/links.ts`
- Test: `tests/unit/i18n.test.ts`, `tests/unit/links.test.ts`

**Interfaces:**
- `type Locale = "en" | "ar"`; `ui: Record<Locale, Record<UiKey, string>>`. `UiKey` covers nav, section titles, buttons, "Full case study", "Back", "Quick look" and aria labels.
- `t(locale: Locale, key: UiKey): string`; `getLocaleFromUrl(url: URL): Locale`; `localizePath(path: string, locale: Locale): string`; `altLocalePath(url: URL): string` (keeps `hash`).
- `waLink(number: string, message: string): string` → `https://wa.me/<digits>?text=<encodeURIComponent(message)>`; `mailLink(email: string, subject: string): string`.

- [ ] **Step 1: Write the failing tests:**
  - `localizePath("/work/khosomat/","ar") === "/ar/work/khosomat/"`; `localizePath("/ar/work/khosomat/","en") === "/work/khosomat/"`; `localizePath("/","ar") === "/ar/"`.
  - `altLocalePath(new URL("https://x/work/khosomat/#stack")) === "/ar/work/khosomat/#stack"`.
  - `"ar and en dictionaries have identical keys"`, with no empty values.
  - `waLink("+20 111 936 9127","Hi Ahmed, I'd like to build an app") === "https://wa.me/201119369127?text=Hi%20Ahmed%2C%20I'd%20like%20to%20build%20an%20app"`.
- [ ] **Step 2:** Run `npm test -- i18n links` → FAIL.
- [ ] **Step 3:** Implement. Draft the Arabic UI strings now (`ui.ar`, flagged draft in a top comment).
- [ ] **Step 4:** Run `npm test -- i18n links` → PASS.
- [ ] **Step 5:** Commit: `feat(portfolio): i18n and contact link helpers`

---

### Task 4: Hero + phone island

**Files:**
- Create: `src/components/Nav.astro`, `LangToggle.astro`, `src/components/hero/{Hero,Phone,AppIcon,PhoneSheet}.astro`, `src/components/hero/phone.ts`
- Modify: `src/pages/index.astro` (render Nav + Hero)
- Test: `tests/e2e/hero.spec.ts`

**Interfaces:**
- Consumes: `getProjects`, `hasCaseStudyPage`, `t`, `localizePath`, `waLink`, `profile`.
- `Hero.astro` props `{ locale: Locale }`. Each `AppIcon` is `<a href={localizePath('/work/'+slug+'/', locale)} data-sheet={slug} data-testid="app-icon">`; for `type:"approach"` the href is `#quick-look`. `PhoneSheet` server-renders one `<div role="dialog" aria-modal="true" aria-labelledby id="sheet-<slug>" hidden>` per project (title, meta, stack chips, bullets, and "Full case study →" when `hasCaseStudyPage`).
- The dock has 4 links: About → `#quick-look`, Experience → `#experience`, WhatsApp → `waLink(profile.whatsapp, profile.waMessage)`, LinkedIn → `profile.linkedin`.
- `phone.ts`: intercepts icon clicks (`preventDefault`), un-hides the matching sheet, adds `.open`, focuses its heading; Esc or the Back button closes it and refocuses the opener.
- **≥ 900 px:** the sheet slides up inside `.screen`. **< 900 px:** the phone chrome is hidden, icons show as a 4-column grid, and the sheet is `position:fixed; inset:0`.

- [ ] **Step 1: Write the failing tests** `tests/e2e/hero.spec.ts`:
  - `"hero shows headline and both CTAs"`: link `/Hire me full-time/` has href `/cv/Ahmed-Galal-CV.pdf` and a `download` attribute; link `/Build my app/` href starts with `https://wa.me/201119369127`.
  - `"8 app icons"`: `[data-testid=app-icon]` count 8.
  - `"click opens sheet in phone, back closes"` (desktop): click Shop&Ship → `#sheet-shop-and-ship` visible and contains "Shop & Ship" and "HERE Maps"; click Back → hidden.
  - `"keyboard: Enter opens, Esc closes, focus returns"`: focus the Khosomat icon, press Enter → the sheet heading is focused; Escape → sheet hidden and the focused element is the Khosomat icon.
  - `"no-JS: icon navigates to case study"`: context `javaScriptEnabled:false`, click Khosomat → URL ends `/work/khosomat/`. Mark `test.fixme` until Task 6 creates the page.
  - `"mobile: sheet is full-screen"` (Pixel 7): open Khosomat → sheet bounding box width equals viewport width.
- [ ] **Step 2:** Run `npm run e2e -- hero.spec.ts` → FAIL.
- [ ] **Step 3:** Implement, matching the mockup's "M" section. The headline "I build mobile apps that feel fast, smooth & native." is draft copy. The availability pill shows only when `profile.available`. Wordmarks: aramex · bluworks · Tecfy · Khosomat. The phone widget reads "5 yrs" / "Flutter · Kotlin · Compose".
- [ ] **Step 4:** Run `npm run e2e -- hero.spec.ts` → PASS (except the fixme).
- [ ] **Step 5:** Commit: `feat(portfolio): hero with interactive phone and case-study sheets`

---

### Task 5: Quick Look, Work, Experience, Skills, Contact

**Files:**
- Create: `src/components/quicklook/{QuickLook,Tile}.astro`, `tiles.ts`, `src/components/sections/{Work,ProjectCard,Experience,Skills,Contact}.astro`, `src/components/casestudy/Cover.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/e2e/sections.spec.ts`

**Interfaces:**
- `Cover.astro` props `{ project: Project; size: "card" | "hero" }`: first screenshot if present, else a gradient from `icon.bg` with `icon.label`. It never renders an `<img>` without a `src`.
- Section ids: `#quick-look`, `#work`, `#experience`, `#skills`, `#contact`.
- Quick Look tiles (order as in the mockup "M"): 3 stats · Now@Bluworks (↗ expands via `tiles.ts` toggling `.big`; without JS it is `<a href="#experience">`) · Stack chips · Path timeline (`inTimeline` roles, years only) · AI-native edge · "For companies" (Download CV + LinkedIn) · "For clients" (WhatsApp + email).
- Work: cards for every `hasCaseStudyPage` project → `/work/<slug>/`. Experience: all 6 roles, one `<details>` per role. Skills: groups + certifications. Contact: both CTAs again plus email, WhatsApp, LinkedIn and GitHub.

- [ ] **Step 1: Write the failing tests** `tests/e2e/sections.spec.ts`:
  - `"sections exist in order"`: ids appear in DOM order `quick-look, work, experience, skills, contact`.
  - `"work shows 7 cards, no ai-dev"`: `[data-testid=project-card]` count 7; none links to `/work/ai-dev/`.
  - `"experience lists 6 roles, timeline 5"`.
  - `"CTAs repeated in contact"`: `#contact` contains both CTA links with the same hrefs as the hero.
  - `"no broken images or empty links"`: every `img` has a non-empty `src` and `naturalWidth>0`; every `a` has a non-empty `href` that isn't `"#"`.
  - `"tile expands"`: click the Now tile → class `big`; click again → not.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement. Scroll fade-in uses CSS only (`animation-timeline: view()` inside `@supports`), with no JS.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit: `feat(portfolio): quick look bento and page sections`

---

### Task 6: Case study pages + Arabic locale

**Files:**
- Create: `src/components/casestudy/CaseStudy.astro`, `src/pages/work/[slug].astro`, `src/pages/ar/index.astro`, `src/pages/ar/work/[slug].astro`, `src/content/**/ar.json`, `src/content/projects/*.ar.md`
- Modify: `tests/e2e/hero.spec.ts` (remove the `fixme`)
- Test: `tests/e2e/i18n.spec.ts`, `tests/unit/build.test.ts`

**Interfaces:**
- `getStaticPaths` returns only `hasCaseStudyPage` projects → 7 slugs per locale.
- Case study layout per spec §4: Cover · role & dates · problem · what I did · stack chips · result (`metrics[]` only; section `[data-testid=results]` omitted when empty) · links (defined ones only) · prev/next project · back to `/#work`. Package pages show the md body's code snippet in place of screenshots.
- `LangToggle` href = `altLocalePath(Astro.url)`.

- [ ] **Step 1: Write the failing tests:**
  - `build.test.ts` (reads `dist/` after `npm run build`): `dist/work/<slug>/index.html` and `dist/ar/work/<slug>/index.html` exist for the 7 slugs; `dist/work/ai-dev/` does not exist.
  - `i18n.spec.ts`: `"/ar/ is rtl"` (`html[dir=rtl][lang=ar]`); `"toggle keeps page"` (on `/work/khosomat/`, click the lang toggle → `/ar/work/khosomat/`, toggle back → `/work/khosomat/`); `"no horizontal scroll at 360px"` (for `/`, `/ar/`, `/work/shop-and-ship/` and `/ar/work/shop-and-ship/` at 360×780: `document.documentElement.scrollWidth <= 360`); `"case study omits empty result section"` (`/work/khosomat/` has no `[data-testid=results]`).
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement and draft the Arabic content (same facts as EN, nothing added). Mirror the layout with logical properties (`ms-*`, `me-*`, `start`, `end`). Flip only directional icons (arrows, back chevron).
- [ ] **Step 4:** Run `npm run build && npm test -- build && npm run e2e` → all PASS, including the no-JS test.
- [ ] **Step 5:** Commit: `feat(portfolio): case study pages and Arabic RTL locale`

---

### Task 7: SEO, OG image, performance gate

**Files:**
- Create: `src/components/seo/{Seo,PersonJsonLd}.astro`, `src/pages/og.png.ts`, `lighthouserc.json`
- Modify: `src/layouts/Base.astro`, `tests/unit/build.test.ts`
- Test: `tests/e2e/seo.spec.ts`

**Interfaces:**
- `Seo.astro` props `{ title, description, locale, canonical, altPath, ogImage }`: emits `<title>`, meta description, `og:*`, `twitter:card=summary_large_image`, canonical, and `hreflang` alternates `en | ar | x-default`.
- `og.png.ts`: 1200×630, dark gradient, "Ahmed Galal", "Mobile Application Developer · Flutter & Android", and a phone outline.
- `PersonJsonLd`: `@type: Person`, name, jobTitle, address (Cairo, EG), `sameAs` [LinkedIn, GitHub].

- [ ] **Step 1: Write the failing tests:**
  - `seo.spec.ts`: on `/` and `/work/shop-and-ship/`, a unique non-empty `<title>` and description; `og:image` returns 200 `image/png`; the `hreflang="ar"` link points to the `/ar/` equivalent; the JSON-LD parses with `@type:"Person"`; `/sitemap-index.xml` returns 200.
  - `lighthouserc.json`: collect `/`, `/ar/`, `/work/shop-and-ship/` (mobile preset); assert `performance`, `accessibility`, `best-practices`, `seo` `minScore: 0.95`.
  - `build.test.ts` `"home JS budget"`: the sum of `<script src>` file sizes referenced by `dist/index.html` is ≤ 102400 bytes.
- [ ] **Step 2:** Run `npm run e2e -- seo.spec.ts && npm run lhci` → FAIL.
- [ ] **Step 3:** Implement. Fix Lighthouse findings (`font-display: swap`, preload Inter, explicit image dimensions).
- [ ] **Step 4:** Run `npm run build && npm test && npm run e2e && npm run lhci` → all PASS.
- [ ] **Step 5:** Commit: `feat(portfolio): SEO, OG image, Lighthouse gate`

---

### Task 8: Deploy config + handoff (no deploy before Gate 2)

**Files:**
- Create: `site/vercel.json` (`{"trailingSlash":true}`), `site/README.md`
- Modify: `projects/portfolio/CLAUDE.md` (fill the template: what / stack / commands / conventions), `projects/portfolio/status.md`

- [ ] **Step 1:** Write `README.md` with run/test/deploy commands and a "How to update content" table mapping each piece of copy to its file.
- [ ] **Step 2:** Run the full gate `npm run build && npm test && npm run e2e && npm run lhci` → all PASS; record the summary in `status.md`.
- [ ] **Step 3:** Commit: `docs(portfolio): README, CLAUDE.md, deploy config`
- [ ] **Step 4:** Stop and report to Ahmed for Gate 2: test/Lighthouse results, pending content (spec §12), Arabic copy review. Deploying needs his Vercel/GitHub account action.
