# Ahmed Galal — Portfolio Site · Design

**Date:** 2026-11-22 · **Status:** draft, awaiting approval
**Source of truth for content:** `~/Library/Mobile Documents/com~apple~CloudDocs/Downloads/AhmedGalalCV.pdf` (3 pages, English) and Ahmed's answers. The builder copies it into the site as `public/cv/Ahmed-Galal-CV.pdf`. That file is what "Hire me" downloads, and both `/` and `/ar` serve the same English PDF unless Ahmed supplies an Arabic CV.
**Approved look:** the "A+B Mix ★" tab in [`mockups/directions.html`](../../../mockups/directions.html)

---

## 1. Intent: why this exists

Ahmed is a mobile developer (5 years, Flutter + Android Native) who wants **one site that works for two audiences at once**:

1. **Recruiters / hiring managers** looking for a Flutter or mobile developer → they should leave with the **CV** or go to **LinkedIn**.
2. **Freelance clients** who want an app built → they should **message on WhatsApp or email**.

It must look **creative and modern**, be **easy to understand**, and be **easy to explore quickly**. A visitor should understand who Ahmed is and what to do next in about 10 seconds.

## 2. Goals · non-goals · anti-goals

**Goals**
- Memorable at first glance: the page itself should say "this person builds mobile apps".
- Scannable: the main facts are visible without reading paragraphs.
- Two clear paths: "Hire me full-time" and "Build my app" are visible in the hero and repeated at the end.
- Proof: every project shows what was built, with which stack, and, when available, screenshots, store links and numbers.
- Easy for Ahmed to update: all content in data files, not scattered through markup.

**Non-goals (v1)**
- Blog, CMS or admin panel.
- Contact form with a backend (WhatsApp, email and LinkedIn links are enough).
- Rebuilding the CV as a full page-by-page copy (the PDF stays the long version).

**Anti-goals (failure even if it "works")**
- Any claim, number or title that isn't in the CV or confirmed by Ahmed. No invented metrics.
- Intro animations, loading screens or gimmicks that delay or hide content.
- Anything a non-technical freelance client wouldn't understand (this is why the "code editor" direction was dropped).
- Slow on a mid-range Android phone over 4G, a common setup for the MEA audience.

## 3. Approaches considered

| Direction | What it is | Trade-off | Outcome |
|---|---|---|---|
| **A: The App** | Phone in the hero, project icons open case studies inside it | Most memorable, shows mobile identity; needs screenshots to shine | **Picked: hero** |
| **B: Bento** | Grid of scannable tiles | Fastest to read; common pattern, less distinctive | **Picked: section below hero** |
| C: Code Editor | VS Code-style UI | Fun for developers, confusing for freelance clients | Rejected |

**Decision (Ahmed):** mix A + B. The phone hero sets identity, and the bento grid delivers the 10-second summary.

**Tech approach (Claude's call, Ahmed may override):** static site built with **Astro + Tailwind CSS**, with small interactive "islands" for the phone. Rejected **Flutter Web** (heavy first load, weak SEO, works against "explore quickly") and **Next.js** (more runtime than a static portfolio needs).

## 4. Page structure (single page + case study pages)

```
┌─────────────────────────────────────────────┐
│ Nav: logo AG · Work · Experience · Contact · │
│      EN/ع toggle · theme toggle              │
├─────────────────────────────────────────────┤
│ HERO (A)                                     │
│  left: availability pill · headline ·        │
│        1-line intro · [Hire me full-time]    │
│        [Build my app] · "Shipped apps for"   │
│  right: phone with app-icon home screen;     │
│        tap icon → case study opens in phone  │
├─────────────────────────────────────────────┤
│ QUICK LOOK (B) bento grid                    │
│  5 yrs · AR/EN · Offline-first               │
│  Now @ Bluworks   │ Stack chips              │
│  Career path timeline     │ AI-native edge   │
│  For companies (CV/LinkedIn) │ For clients → │
├─────────────────────────────────────────────┤
│ WORK: all projects as cards (screenshot,     │
│  title, 1 line, stack chips) → case study    │
├─────────────────────────────────────────────┤
│ EXPERIENCE: compact timeline, expandable     │
│  bullets per role (6 roles from CV)          │
├─────────────────────────────────────────────┤
│ SKILLS + CERTIFICATIONS: compact, grouped    │
├─────────────────────────────────────────────┤
│ CONTACT footer: both CTAs again + email,     │
│  WhatsApp, LinkedIn, GitHub                  │
└─────────────────────────────────────────────┘
```

**Case studies**
- **Desktop:** tapping a phone icon opens a short version inside the phone (as in the mockup), with a "Full case study →" link.
- **Mobile (Claude's call):** a phone frame inside a real phone is too small, so on small screens the hero shows the icon grid without the frame, and tapping opens a full-screen sheet.
- Each project also has its own page (`/work/shop-and-ship`) so it can be shared directly and indexed by Google.
- Case study template: cover/screenshots · role and dates · problem · what I did (bullets) · stack chips · result (only confirmed numbers) · links (Play Store / App Store / GitHub / pub.dev).

**Projects in the phone (from CV):** Shop & Ship (Aramex), Bluworks tablet app, Khosomat, Daily Images by NASA, Made Me Laugh, Simple File Manager (package), Flutter PDF Designer (package), "AI Dev" (how Ahmed works: MCP, spec-driven development, AI tooling). Dock: About, Experience, WhatsApp, LinkedIn.

## 5. Look & feel

- **Default dark theme** with a light theme toggle. Background is near-black with soft violet/cyan glows. Accent gradient is cyan `#54C5F8` (a nod to Flutter) → violet `#7C5CFF`.
- Big, tight headline typography. Rounded cards (20–24 px radius) with 1 px borders.
- Motion: subtle only. The phone sheet slides in, tiles lift on hover, sections fade in on scroll. Everything respects `prefers-reduced-motion`.
- Real app icons and screenshots replace the letter placeholders once Ahmed provides them.

## 6. Bilingual (EN / AR)

- **Proposal (Claude's call, Ahmed to confirm):** English is the default at `/` and Arabic lives at `/ar`, with full RTL layout (mirrored grid, phone and timeline). A toggle in the nav switches between them.
- Arabic font: IBM Plex Sans Arabic or Cairo. English font: Inter or similar, self-hosted for speed.
- Claude drafts the Arabic copy and Ahmed reviews it before launch.

## 7. Calls to action

| CTA | Action |
|---|---|
| Hire me full-time | Downloads the latest CV PDF (served from the site) + secondary LinkedIn link |
| Build my app | Opens WhatsApp `wa.me/<number>` with a pre-filled message ("Hi Ahmed, I'd like to build an app…"), plus a secondary email link |
| GitHub | github.com/A7MeDG0L0L |

## 8. Content model (so updates are one-file edits)

- `src/content/profile.(json|ts)`: name, title, intro, availability flag, links, CTA texts (EN + AR).
- `src/content/projects/*.md`: one file per project (frontmatter: title, slug, company, dates, icon, color, stack[], links{}, metrics[], screenshots[]; body = case study, EN + AR).
- `src/content/experience.(json|ts)`: roles, dates, bullets.
- `src/content/skills.(json|ts)`, `certifications.(json|ts)`.
- Toggling `available: false` hides the green "Open to…" pill.

## 9. Constraints & quality bar

- Static output, free hosting (**Vercel or GitHub Pages; builder's call**). Custom domain optional, Ahmed to decide.
- Performance: Lighthouse ≥ 95 on mobile for Performance, Accessibility, Best Practices and SEO. Under about 100 KB JS on the home page. Images in AVIF/WebP and responsive.
- Accessibility: keyboard-navigable phone icons and sheets, visible focus, AA contrast in both themes, alt text on every screenshot.
- SEO: per-page title/description, Open Graph image (a share card with name, title and phone visual), `Person` JSON-LD, sitemap.
- Works on the latest Chrome, Safari, Firefox and Samsung Internet. Responsive from 360 px up.

## 10. Resolved details (Claude's calls after builder review; Ahmed may override)

- **Dock icons:** About → scrolls to Quick Look. Experience → scrolls to the Experience section. WhatsApp and LinkedIn → same links as the CTAs.
- **Roles (6, from the CV):** Bluworks (12/2025–now), Aramex (06/2023–12/2025), Tecfy.co (04/2022–06/2023), The Sparks Foundation, intern (05/2022–06/2022), Freelance (01/2022–05/2022), Khosomat.com (08/2021–01/2022). The **Experience section lists all 6** as a dated list, newest first, so overlaps are fine. The **Quick Look timeline shows 5 milestones** and skips the internship, using CV years (Khosomat 2021–22).
- **Project types:**
  - *Full case study page* (`/work/<slug>`): Shop & Ship, Bluworks tablet app, Khosomat, Daily Images by NASA, Made Me Laugh.
  - *Package card* (phone entry + Work card, short page with a description, code snippet and pub.dev/GitHub link, no screenshots required): Simple File Manager, Flutter PDF Designer.
  - *AI Dev:* phone entry + Quick Look tile only, with **no `/work` page**. The phone sheet describes how Ahmed works (from the CV's AI Skills section).
  - The content model gets a `type: app | package | approach` field so templates can branch.
- **Copy:** mockup text is a **draft**, not approved wording. Every factual line must trace to the CV, e.g. "improved startup time" (not "cut by X%"), "reduced critical bugs", and "2 Flutter packages" (not "published", unless confirmed). Ahmed reviews all copy, including the headline and the Arabic, before launch.
- **"Shipped apps for":** plain text wordmarks in v1, no brand logo files. Real logos only if Ahmed confirms it's fine with each company.

## 11. Left to the builder

- Exact component breakdown, island framework (vanilla JS or Preact), animation library (CSS-first preferred).
- Hosting choice between Vercel and GitHub Pages.
- Analytics: optional, must be lightweight and cookie-free if added.
- Exact type scale, spacing and icon set, within the look described above.

## 12. Inputs needed from Ahmed (content, not design blockers)

1. Screenshots (or screen recordings) per project, especially Shop & Ship, Bluworks and Khosomat. Note: check what can be shown publicly for employer apps.
2. Store / GitHub / pub.dev links for each project.
3. Any real numbers you can stand behind (e.g. startup time before/after, crash-free rate, downloads, rating).
4. A profile photo (optional; the hero works without one).
5. Which email and WhatsApp number to show publicly.
6. Domain name, if you want one.
7. Confirm the EN + AR plan (section 6).
8. An Arabic CV PDF, if you have one (optional).
