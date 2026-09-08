# Changelog

All notable changes to FED-Indeed are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Hero chip on the website now reads the v0.2.0 demo numbers (15/20).

## [0.2.0] — 2026-09-07

### Added
- **Project website** (`docs/`) — dark "machine scan" landing page for
  GitHub Pages with hero, live stats, typing terminal, quickstart, roadmap
  and community sections.
- **In-browser demo** of the audit engine (`docs/assets/js/engine.js`),
  running 100% client-side — paste resume + JD text, get the score, band,
  grade, sub-scores, structural alerts, and matched/missing keyword matrix
  instantly. Includes a "Simulate bad parse" mode that shows what column
  fusing does to a resume.
- **Engine extracted to `fed_engine.py`** — the scoring logic is now an
  importable, unit-testable module (`tests/test_engine.py`, 35 unit tests).
  `app.py` consumes it; behavior is identical.
- **Skill aliases** — shorthand skill names now match their canonical forms
  (`k8s` → `kubernetes`, `postgres` → `postgresql`, `js` → `javascript`,
  `ts` → `typescript`, `nodejs` → `node`, `reactjs` → `react`, `vuejs` →
  `vue`, `nextjs` → `next`). Applied on both resume and JD sides, reported
  as "alias hits" in the results.
- **Suffix stemming** — deterministic suffix stemmer collapses word variants
  onto one stem (`pipelines` ↔ `pipeline`, `managing` ↔ `managed`,
  `technologies` ↔ `technology`). Guarded so acronyms (`aws`, `css`, `sql`)
  and `ss`/`us`/`is` words (`class`, `status`, `redis`, `kinesis`) are never
  mangled.
- **TF-weighted keyword scoring** — a keyword mentioned 5× in the JD now
  carries more weight than one mentioned once (v0.1.0 was flat-count).
- **Sub-scores + letter grade** — keyword / structure / timeline breakdown,
  blended into a composite (60/25/15) with an A–F grade.
- **Exportable scan report** — one-click JSON download of the full audit
  (score, band, grade, sub-scores, matched/missing keywords, alias hits).
- **Session history** — the sidebar remembers the last 5 audits this
  session (time, band, score, grade); clearable, never persisted to disk.
- **v0.2.0 engine cross-check** — `docs/tests/engine_crosscheck.js` compares
  *all* result fields (score, grade, composite, sub-scores, matched/missing
  lists, alias hits, dates) between the JS port and `fed_engine.py` across
  5 test cases, plus stem/canonical primitive parity.
- Python unit tests in CI (`python3 -m unittest discover -s tests`).

### Changed
- **`app.py` UI** — grade badge, sub-score breakdown bars, alias-assist
  callout, progress bar on keyword matrix, JSON report download button,
  session history in the sidebar.
- **Website demo** — new sample data showcasing the upgrades (baseline
  64.4% BORDERLINE, grade B; `k8s` alias hit; `pipelines` stem match), new
  sub-score bars, grade badge, "What's new in v0.2.0" strip, garble run
  drops the score further (fused stream, columns alert).
- `docs/assets/js/engine.js` — JS port upgraded to v0.2.0 parity; result
  field names now mirror Python exactly (snake_case).

### Fixed
- v0.1.0 missed real matches like `pipelines` vs `pipelines` under the
  hood (flat token matching) — v0.2.0 stemming and aliases fix this class
  of false negatives.

## [0.1.0] — 2026-09-07

### Added
- Aggressive PDF text extraction via pdfplumber, emulating deterministic
  ATS readers (`layout=False`).
- **ATS Compatibility Rating** — Jaccard-style match index with three
  status bands (Safe ≥ 75%, Borderline 50–74%, High Risk < 50%).
- **Structural Readability Integrity** checks:
  - Flat-image / ghost document detection (< 150 characters parsed).
  - Multi-column layout detection via horizontal word-position jumps.
  - Timeline validation for `Month YYYY`, `MM/YYYY`, and `Present` formats.
- **Raw Text Stream** panel — the exact internal string capture.
- **Keyword Matrix** — top-20 JD terms, matched vs. missing.
- Privacy shield: fully in-memory processing, zero persistence.
- Sidebar engine-status panel and project credits.

[Unreleased]: https://github.com/YOUR_USERNAME/FED-Indeed/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/YOUR_USERNAME/FED-Indeed/releases/tag/v0.1.0
