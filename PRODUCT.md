# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted **equally** (confirmed 2026-11-22). Neither path may be buried under the other.

1. **Recruiters and hiring managers** filling a full-time Flutter / mobile role. Situation: scanning many candidates quickly, often on a phone, often from a LinkedIn link. Job: decide in seconds whether Ahmed is worth an interview, then grab the CV or open LinkedIn.
2. **Freelance clients** (founders, SMEs, agencies) who need an app built. Situation: judging whether one developer can deliver a real product end to end. Job: see proof of shipped apps, then start a conversation, usually on WhatsApp.

Markets: **Egypt, the Gulf (KSA / UAE), and remote international** roles and clients. Many visitors read Arabic; many read English; Gulf and Egyptian visitors may prefer Arabic.

## Product Purpose

A personal portfolio for **Ahmed Galal, Mobile Application Developer (Flutter + Android Native), Cairo**. It turns a CV into proof: real apps, real stores, real scale. Success means a qualified visitor understands who Ahmed is within about 10 seconds and takes one of two actions: **"Hire me full-time"** (CV / LinkedIn) or **"Build my app"** (WhatsApp / email / call).

## Positioning

*Delegated to Claude on 2026-11-22 ("pick the one that sounds more interesting and high demand"); Ahmed may revise.*

**Ships production Flutter and native Android apps at real scale (10M+ downloads across Android & iOS), built bilingual (Arabic/English) and offline-first for MEA users.** Supporting edge: AI-native delivery (spec-driven development, MCP, AI-assisted coding) that shortens time to ship. Neighbouring portfolios can claim Flutter skills; few can point to apps of this scale in this region with public store evidence.

## Operating Context

- Visitors arrive from LinkedIn, the CV, WhatsApp shares and direct links; link previews (Open Graph) matter.
- Mobile-first reality: many visitors open the site on a phone, often over mobile data.
- Recruiters compare candidates side by side; clients compare against agencies.
- The downloadable CV (`site/public/cv/Ahmed-Galal-CV.pdf`) remains the long-form record; the site is the fast, visual layer on top.

## Capabilities and Constraints

- Static site, Astro 7 + Tailwind 4, deployed on Vercel at https://ahmedgalal.vercel.app (custom domain `ahmedgalal.dev` planned). Public repo: github.com/A7MeDG0L0L/portfolio.
- Bilingual: English at `/`, Arabic at `/ar/` with full RTL. Arabic copy is a draft pending native review.
- Must work without JavaScript (every interactive element is a link first), on 360 px screens, and with reduced motion.
- Quality bar: Lighthouse mobile ≥ 95 in all four categories; WCAG AA contrast in both themes.
- All copy lives in `site/src/content/**` and `site/src/i18n/ui.ts`; tests enforce content rules.
- Contact: email agalal819@gmail.com; main phone +201119369127 (calls + WhatsApp); second phone +201111199742.
- Undecided: final domain purchase; whether to show per-app download counts (currently total only).

## Brand Commitments

- Name and title: **Ahmed Galal — Mobile Application Developer**. Personal mark: the **AG monogram** (`site/public/brand/ag-monogram.png`, from his GitHub avatar).
- Profile photo: `site/public/photo/ahmed.webp` (cropped, metadata stripped).
- Voice: direct, confident, factual; no hype words, no claims beyond the CV or what Ahmed confirmed.
- Company names/logos (Aramex, Bluworks, Tecfy, Khosomat) are shown only to illustrate work he contributed to; Aramex Mobile and similar are team products ("apps I worked on", never "built alone").

## Evidence on Hand

- CV PDF + page renders: `site/public/cv/`.
- Store-verified apps with icons in `site/public/icons/`: Bluworks App, Bluworks Tablet, Shop & Ship, Aramex Mobile, Aramex Freight, Aramex Global Shopper, MyUS (Aramex group), Convertify, XO Clash, Daily Tips, Daily Images by NASA, Made Me Laugh; Khosomat (GitHub); Soura (coming soon to Google Play); 2 Flutter packages (Simple File Manager on pub.dev, Flutter PDF Designer).
- Reach: **10M+ downloads across Android & iOS** (confirmed by Ahmed; Google Play alone ≥ 5.67M as of 2026-11-22).
- Experience: **5+ years**; roles at Bluworks (now), Aramex (2023–25), Tecfy (2022–23), The Sparks Foundation (intern), freelance, Khosomat.
- Absent, must not be fabricated: testimonials, client quotes, per-project metrics (startup time, crash rates), app screenshots, salary/rates, awards.

## Product Principles

1. **Proof over adjectives.** Every claim points at a store listing, a company, a number Ahmed confirmed, or the CV.
2. **Two doors, equal weight.** Hiring and building paths are always one tap away and never compete for the same slot.
3. **Fast for the first 10 seconds.** Who he is, what he ships, and how to act must land without scrolling far or waiting on load.
4. **Bilingual by default.** Arabic is a first-class experience, not a translation afterthought.
5. **Honest scale.** Team products are credited as team work; numbers are floors, never inflated.

## Accessibility & Inclusion

- WCAG 2.2 AA in both light and dark themes; keyboard-operable dialogs and sheets; visible focus.
- Full RTL support for Arabic readers; `prefers-reduced-motion` respected.
- Works on low-end Android phones on mobile data (performance budget: home JS ≤ 100 KB).
