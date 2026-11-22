# Ahmed Galal — Portfolio

Bilingual (EN/AR) static portfolio. Astro 7 + Tailwind 4, no backend.

## Run

```bash
npm install
npm run dev        # http://localhost:4321 (add --ignore-lock when run by an AI agent)
npm run build      # static output in dist/
npm run preview
```

## Test

```bash
npm test           # unit: content rules, i18n, links, dates, build output (run build first)
npm run e2e        # Playwright: desktop + mobile (builds and serves automatically)
npx lhci autorun   # Lighthouse: mobile, every category must be ≥ 95 (run build first)
```

## How to update content

All copy lives in `src/content/` and `src/i18n/ui.ts`. Edit the file, rebuild, done.

| What you want to change | File |
|---|---|
| Name, headline, intro, availability pill, CTA text, WhatsApp message, email/phone, Quick Look tiles | `src/content/profile/en.json` + `ar.json` |
| A project (text, stack, links, screenshots, metrics) | `src/content/projects/<slug>.md` + `<slug>.ar.md` |
| Jobs / experience | `src/content/experience/en.json` + `ar.json` |
| Skills | `src/content/skills/en.json` + `ar.json` |
| Certifications | `src/content/certifications/en.json` + `ar.json` |
| Buttons, section titles, small UI labels | `src/i18n/ui.ts` |
| The downloadable CV | replace `public/cv/Ahmed-Galal-CV.pdf` (keep the name), then run `npm run cv:pages` to refresh the preview images (macOS) |

Rules the tests enforce:
- **No numbers like "40%" or "3x" in copy** unless they are in a project's `metrics:` list with `confirmedBy: ahmed`.
- Arabic files must keep the same projects, links, stack, contact details and dates as English.
- Hide the green "Open to work" pill by setting `"available": false` in both profile files.

### Dev server shows old content?

Stop `npm run dev` first, then delete the `.astro/` folder, then start dev again. (Deleting it while dev is running does nothing: dev writes its old cache back when it exits.) The production build is not affected.

### Adding screenshots

Put images in `public/work/<slug>/` and list them in the project's frontmatter:

```yaml
screenshots:
  - { src: "/work/shop-and-ship/home.webp", alt: "Shop & Ship home screen" }
```

The first screenshot becomes the cover. Extra ones show on the case study page.

## Deploy (Vercel)

1. Import the GitHub repo in Vercel and set **Root Directory** to `projects/portfolio/site`.
2. The framework preset is detected as Astro. Build command `npm run build`, output `dist`.
3. The site address (canonical URLs, hreflang, sitemap, social previews) comes from `site-url.mjs`: Vercel's production URL is picked up automatically and switches to your custom domain once you add it in Vercel. Set `SITE_URL` to override.
