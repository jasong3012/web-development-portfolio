# CLAUDE.md

Jason Grant's AI-assisted web development portfolio, published with GitHub Pages from `main`.

## Project
- `index.html` is a self-contained static page: CSS and JS are inline and there is no build step or package manager.
- Images live in `assets/images/` as WebP. Convert new PNG/JPG images to WebP before committing.
- Project cards are generated from the `PROJECTS` array in the inline script in `index.html`. Add or edit work there.
- Only state facts Jason has provided (old portfolio: https://jasong3012.github.io/portfolio/). Do not invent metrics, clients or testimonials.

## Before committing
- Open `index.html` in headless Chromium at 1440px and 390px widths. Check for no console errors and no horizontal scroll.

## Git workflow (owner's standing instruction)
For every change Jason requests:
1. Start a branch from the latest `origin/main`.
2. Commit with a clear message and push the branch.
3. Open a pull request into `main` with a short summary and how it was checked.
4. Merge the pull request immediately, without waiting for review.
5. Reply with the pull request link and a one-line summary.

If a merge is blocked (conflict, failing checks, branch protection), stop and report it. Do not force-push to `main` or bypass checks.
