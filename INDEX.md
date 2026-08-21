# public/website/

Rendered HTML pages for the North Star Communications website. This folder mirrors verbatim to `2-human/nsc-public-website` via the workflow at `.github/workflows/sync-public.yml`. Pages serve at `https://nsc.agency/` (home) and `https://nsc.agency/<filename>.html` (the rest).

**Do not delete `CNAME`.** It carries the custom domain (`nsc.agency`) and must live in *this folder*, not just in the mirror. The sync runs `rsync --delete` and excludes only `.git`, `.DS_Store`, `Thumbs.db`, `.surface.yml` and `.no-sync`, so a `CNAME` created through the GitHub Pages UI exists only in the mirror and is deleted on the next sync, silently unsetting the custom domain and taking the site offline.

Canonical sources for each page live in `content/`. Edit `content/` first, regenerate the HTML, commit both. Do not edit these HTML files directly without an entry in the corresponding `content/` doc.

## Pages

- **`index.html`** — the home page, served at the root (`https://nsc.agency/`). Renders from [`content/web/pages/home/PAGE.md`](../../content/web/pages/home/PAGE.md).
- **`home.html`** — a redirect stub to `/`, kept so the previous published URL does not 404. Not the home page any more; edit `index.html`.
- **`quick-start.html`** — Quick Fix offer page. Renders from [`content/web/pages/quick-start/PAGE.md`](../../content/web/pages/quick-start/PAGE.md). The primary commercial entry point from the nav.
- **`way-of-work.html`** — Way of Work framework, single merged page (intro → interactive diagram → outcome). Renders from [`content/frameworks/way-of-work/FRAMEWORK.md`](../../content/frameworks/way-of-work/FRAMEWORK.md). Merged 2026-05-19 from the prior doc-only + interactive split.
- **`communications-compass.html`** — Compass framework, single merged page (intro → interactive diagram → outcome). Renders from [`content/frameworks/communications-compass/FRAMEWORK.md`](../../content/frameworks/communications-compass/FRAMEWORK.md). Merged 2026-05-19.

## Archived

- **`way-of-work-doc.archived.html`** — the pre-merge doc-only Way of Work page. Preserved for reference; not in nav and not linked.
- **`communications-compass-doc.archived.html`** — the pre-merge doc-only Compass page. Same status.

## Adding a new page

Mirror an existing page's structure rather than inventing a new pattern. Extend the main nav block across all files. Add the canonical source under `content/`. The folder-as-contract sync workflow picks up new files automatically — no manifest edit needed (legacy `.sync-public.yml` was retired during the 2026-05-09 migration).
