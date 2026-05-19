# public/website/

Rendered HTML pages for the North Star Communications website. This folder mirrors verbatim to `tnosugar/nsc-public-website` via the workflow at `.github/workflows/sync-public.yml`. Pages serve at `https://tnosugar.github.io/nsc-public-website/<filename>.html` (or at the configured CNAME, when one is set).

Canonical sources for each page live in `content/`. Edit `content/` first, regenerate the HTML, commit both. Do not edit these HTML files directly without an entry in the corresponding `content/` doc.

## Pages

- **`home.html`** — marketing landing page. Renders from [`content/web/pages/home/PAGE.md`](../../content/web/pages/home/PAGE.md). Hero, services, frameworks, work, values, team, contact.
- **`quick-start.html`** — Quick Start offer page. Renders from [`content/web/pages/quick-start/PAGE.md`](../../content/web/pages/quick-start/PAGE.md). The primary commercial entry point from the nav.
- **`way-of-work.html`** — Way of Work framework, single merged page (intro → interactive diagram → outcome). Renders from [`content/frameworks/way-of-work/FRAMEWORK.md`](../../content/frameworks/way-of-work/FRAMEWORK.md). Merged 2026-05-19 from the prior doc-only + interactive split.
- **`communications-compass.html`** — Communications Compass framework, single merged page (intro → interactive diagram → outcome). Renders from [`content/frameworks/communications-compass/FRAMEWORK.md`](../../content/frameworks/communications-compass/FRAMEWORK.md). Merged 2026-05-19.

## Archived

- **`way-of-work-doc.archived.html`** — the pre-merge doc-only Way of Work page. Preserved for reference; not in nav and not linked.
- **`communications-compass-doc.archived.html`** — the pre-merge doc-only Compass page. Same status.

## Adding a new page

Mirror an existing page's structure rather than inventing a new pattern. Extend the main nav block across all files. Add the canonical source under `content/`. The folder-as-contract sync workflow picks up new files automatically — no manifest edit needed (legacy `.sync-public.yml` was retired during the 2026-05-09 migration).
