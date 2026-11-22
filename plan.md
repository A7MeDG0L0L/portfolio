# Plan — Ahmed Galal Portfolio

**Owner:** Product Manager · **Gate 1 approved:** ☑ 2026-11-22 (CEO: "Approved, Native")
**Spec:** `docs/superpowers/specs/2026-11-22-portfolio-design.md` (approved by CEO 2026-11-22)
**Detailed task plan:** `docs/superpowers/plans/2026-11-22-portfolio-site.md`

## Crew for this project
- **Engineer (Claude):** builds Tasks 1–8.
- **Reviewer (fresh subagent):** reviews each task, then the whole branch.
- **QA:** the Playwright + Lighthouse suites, plus the CEO's own test drive.
- Not crewed: Security (no auth, no payments, no backend), Documentation (README is covered in Task 8).

## Milestones

### M1 — Site built and verified locally
| # | Task | Owner | Acceptance criteria | Status |
|---|------|-------|--------------------|--------|
| 1 | Scaffold, tokens, base layout, theme toggle | Engineer | dark default, theme persists, CV served at `/cv/Ahmed-Galal-CV.pdf` | pending |
| 2 | Content model + EN content from CV | Engineer | 6 roles, 8 projects (types correct), no unconfirmed numbers | pending |
| 3 | i18n + WhatsApp/email link helpers | Engineer | EN/AR keys match, path localization correct | pending |
| 4 | Hero + interactive phone | Engineer | both CTAs, 8 icons, sheet opens/closes by mouse + keyboard, works without JS, full-screen on mobile | pending |
| 5 | Quick Look bento + sections | Engineer | section order, 7 work cards, no broken images or links | pending |
| 6 | Case study pages + Arabic RTL | Engineer | 7 pages × 2 locales, toggle keeps page, no horizontal scroll at 360 px | pending |
| 7 | SEO, OG image, Lighthouse gate | Engineer | Lighthouse mobile ≥ 95 ×4, home JS ≤ 100 KB | pending |
| 8 | README, CLAUDE.md, deploy config → Gate 2 | Engineer | full test gate green; report to CEO | pending |

> Web equivalent of the mandatory "app identity" task: favicon (Task 1) + OG share image (Task 7).

### M2 — Launch (after Gate 2, needs CEO)
Content drop (screenshots, links, numbers), Arabic copy review, domain choice, Vercel deploy from the CEO's account.

## Risks
- **Employer apps (Aramex, Bluworks) may not allow public screenshots.** → Case studies render fine with gradient covers; the CEO confirms what's allowed.
- **Pending content delays launch.** → M1 ships with placeholders that look intentional; M2 is just a data swap.
- **Arabic copy quality.** → Claude drafts, the CEO reviews before launch (flagged draft in code).
- **Node 26 is newer than Astro's tested range.** → If the build misbehaves, pin Node 22 LTS via `.nvmrc`.
