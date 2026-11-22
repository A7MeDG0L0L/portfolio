# Status — Ahmed Galal Portfolio

**Current state:** built, merged to AG-AI `main`, published to **github.com/A7MeDG0L0L/portfolio** (public). Not deployed yet.
**Gate 1 (plan approval):** ☑ 2026-11-22 · **Gate 2 (pre-ship):** ☐ (CEO test drive + Arabic copy review + deploy)

## Syncing to the public repo
The public repo is a `git subtree` export of `projects/portfolio/`. After committing here, with gh's active account set to A7MeDG0L0L:

```bash
gh auth switch -h github.com -u A7MeDG0L0L
git -c credential.helper= -c 'credential.helper=!gh auth git-credential' subtree push --prefix=projects/portfolio portfolio main
gh auth switch -h github.com -u AGalal-BW
```

## Log (newest first)

### 2026-11-22 (afternoon)
STATUS: on track
Done: real app icons + company logos; 17 projects (Bluworks ×2, Aramex ×5, Khosomat, Soura coming soon, Convertify, XO Clash, Daily Tips, NASA, Made Me Laugh, 2 packages, AI Dev); call/WhatsApp/LinkedIn/email dock; second phone; profile photo + AG monogram; 5+ years; 10M+ downloads (CEO-confirmed); Preview CV viewer + /cv/ page. Merged to main; published as A7MeDG0L0L/portfolio.
Gate: astro check 0 errors · unit 36/36 · e2e 148 passed (14 viewport-specific skips) · Lighthouse mobile ≥ 95 ×4.
Needs from CEO: test drive; Arabic copy review; update CV PDF to say 5+ years (then `npm run cv:pages`); Vercel account to deploy (root dir `site`); domain (update `site:` in astro.config.mjs).

### 2026-11-22 (morning)
Done: Tasks 1–8 + final-review fix pass (6 Important fixed, 4 Minor deferred).
