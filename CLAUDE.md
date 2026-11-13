# CLAUDE.md

Jason Grant's AI-assisted web development portfolio, published with GitHub Pages from `main`.

## Project
- `index.html` is a self-contained static page: CSS and JS are inline and there is no build step or package manager.
- Images live in `assets/images/` as WebP. Convert new PNG/JPG images to WebP before committing.
- Project cards are generated from the `PROJECTS` array in the inline script in `index.html`. Add or edit work there.
- `experiment-version.html` is Version B (the A/B experiment). It shares `assets/experiment/site.css` (styles) and `assets/experiment/core.js` (project data in `PROJECTS`/`TABS`, card rendering, detail dialog, menu, theme) with the project pages. Keep the two `url(#...)` gradient fill rules inline in each page; they break in an external stylesheet.
- Version B project landing pages live at `experiment-version/projects/<slug>.html` (served as `/experiment-version/projects/<slug>` on GitHub Pages). They are generated (cards are rendered into the HTML by running `core.js` in Node, which avoids layout shift): after changing the Version B header, footer, dialog, `PROJECTS` or `TABS`, run `python3 scripts/build-project-pages.py` (needs Python 3 and Node) and commit the output. Landing pages use a right-hand category sidebar; the tabbed FIG. 00 is homepage-only.
- Version B pages load the shared CSS/JS as `site.css?v=<hash>` / `core.js?v=<hash>` so browsers never run a new page against a stale cached file. After editing `assets/experiment/site.css` or `core.js`, re-run `python3 scripts/build-project-pages.py` to refresh the hashes in every Version B page (including `experiment-version.html`).
- `.reveal` sections are visible by default and only hidden for the fade-in once the scroll observer adds `html.reveal-on`; keep it that way so a script error can never blank the page.
- Version B grids load `<name>-card.webp` covers (max 720px wide, static first frame) and the detail dialog loads the full `<name>.webp`. When adding a Version B image, create its `-card.webp` too.
- Only state facts Jason has provided (old portfolio: https://jasong3012.github.io/portfolio/). Do not invent metrics, clients or testimonials.

## Before committing
- Open the changed page(s) in headless Chromium at 1440px and 390px widths. Check for no console errors and no horizontal scroll.

## Git workflow (owner's standing instruction)
For every change Jason requests:
1. Start a branch from the latest `origin/main`.
2. Commit with a clear message and push the branch.
3. Open a pull request into `main` with a short summary and how it was checked.
4. Merge the pull request immediately, without waiting for review.
5. Reply with the pull request link and a one-line summary.

If a merge is blocked (conflict, failing checks, branch protection), stop and report it. Do not force-push to `main` or bypass checks.
