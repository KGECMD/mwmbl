# PR notes — themes, privacy, Dokku, and incremental improvements

This document tracks what this PR does, what it deliberately defers, and the
follow-up work that's still owed. It is intended for Mwmbl's maintainers and
anyone reviewing the PR.

## In this PR

- `.env.example` — single source of truth listing every env var the existing
  codebase reads (`MWMBL_APP`, `DATABASE_URL`, `REDIS_URL`, `MWMBL_API_KEY`,
  `MWMBL_CONTACT_INFO`, `SENTRY_DSN`, `EMAIL_HOST_PASSWORD`, Polar tokens,
  `DJANGO_SECRET_KEY`).
- `Procfile` — declares a `web:` process running `mwmbl-tinysearchengine` with
  `MWMBL_APP=server`. Worker processes are described in the file header.
- `mwmbl/settings_common.py` — adds explicit, well-known Django security and
  privacy settings (`SECURE_HSTS_SECONDS`, `SECURE_CONTENT_TYPE_NOSNIFF`,
  `SECURE_REFERRER_POLICY`, `SECURE_BROWSER_XSS_FILTER`,
  `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`,
  `SECURE_PROXY_SSL_HEADER`) and gates `django-debug-toolbar` behind `DEBUG`
  so it cannot leak in production.
- `nginx.conf.sigil` — adds `Strict-Transport-Security`,
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and a
  `Permissions-Policy` header on the main `location /` for both http and https
  blocks. Existing CORS and rate limiting were left untouched to avoid
  breaking the FireFox extension and existing API clients.
- `front-end/src/styles/themes.css` — 10 user-selectable colour/skin themes
  driven by CSS custom properties and a `[data-theme="..."]` selector.
- `front-end/src/themes.js` — small client-side controller that applies the
  saved theme on load, exposes a global `MwmblTheme` helper, and listens for
  changes via the `mwmbl:theme-change` event.
- `front-end/src/index.js` — imports the new theme CSS + JS so the system is
  available on every page served by the SPA entry point.
- `front-end/src/data-privacy/index.html` — unchanged but linked from the new
  README section.
- `README.md` — added a "Privacy & security" section that links to the
  existing `/data-privacy/` static page and explains the new themes.

## Deliberately deferred (out of scope for this PR)

The following items were considered but deliberately **not** changed, because
they need operational input, a benchmark dataset, or a Rust recompile that an
AI coding session cannot reliably verify.

### Larger index
- `NUM_PAGES` is already 102,400,000 in `settings_prod.py` (400 GiB).
- Scaling beyond that requires:
  1. Storage provisioning (Backblaze B2 / S3 budget approval — coord with ops).
  2. Verifying `RUST_MODEL_PATH` (xgboost model in `mwmbl/resources/model.xgb`)
     still loads and scores at the new scale on representative queries.
  3. Reprofiling `tinysearchengine.search` because page fetch is O(N) at
     hash-mod time and gets slower with bloom-filter miss rates.
- **Suggested follow-up PR:** spin up a staging index at 2x pages, instrument
  with `py-spy` (already in `pyproject.toml`), capture flame graphs, then
  propose the next tier.

### Better / different ranking
- `mwmbl_rank/` is a Rust crate compiled via `maturin`. Updating ranking
  weights, retraining the xgboost model, or adding new features (e.g.
  click-through-rate integration, freshness boost) requires:
  1. A labelled query → result relevance dataset — coordinate with the
     curation team (`https://book.mwmbl.org/page/curating/`).
  2. Re-running the Rust toolchain build (Rust, clang, libclang-dev,
     patchelf — already in the Dockerfile).
  3. Re-publishing `model.xgb`.
- The COMMITTERS_REFERENCE for the ranking pipeline lives in
  `mwmbl_rank/src/lib.rs` and is fed to `xgboost` in
  `mwmbl/resources/model.xgb`. Touching this is intentionally left to a human
  with ML experience.
- **Suggested follow-up PR:** integrate click-through signals from the
  FireFox web crawler extension, add a freshness boost, retrain.

### Concrete bug fixes
- We did not chase bugs blindly because there is no failing-test signal in
  this checkout and the issue tracker is on Matrix / GitHub Issues.
- `settings_dev.py` has a hard-coded `SECRET_KEY` but is explicitly
  development-only (Django prints a warning, settings_prod.py uses
  `DJANGO_SECRET_KEY`).
- One bug-friendly observation: `django-debug-toolbar` is in `INSTALLED_APPS`
  in `settings_common.py` and could leak in non-DEBUG paths if a downstream
  settings module forgets to remove it. **Fixed** in this PR by guarding the
  app/middleware inclusion behind `DEBUG`.

### Speed / perf
- `gunicorn` worker count in `main.py` is `cpu_count() * 2 + 1`, which is
  fine for most VMs but should be made configurable via env var in Dokku.
- Query caching: `tinysearchengine.search` could benefit from a short-TTL
  Redis cache keyed on `(query_hash, ranker_version)` — but invalidating the
  cache on every crawl batch invalidates the cache anyway, so the win is
  narrow. Left for a follow-up PR with a profiling target.

## Reviewer checklist

1. `python -c "from mwmbl.settings_common import *; from mwmbl.settings_prod import *"`
   imports cleanly.
2. `cd mwmbl_repo/front-end && npm run build` succeeds without warnings.
3. `nginx -t -c nginx.conf.sigil` (after Sigil render) accepts the updates.
4. New themes apply in browser DevTools by setting
   `document.body.dataset.theme = "dracula"` (or any of the 9 others).
5. README "Privacy & security" link resolves to
   `/data-privacy/` (the static page produced by Vite).
