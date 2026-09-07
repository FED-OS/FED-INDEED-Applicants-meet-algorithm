# Changelog

All notable changes to FED-Indeed are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Optional `styles.css` theme hook loaded by `app.py`.
- Community scaffolding: issue templates, PR template, discussions guide,
  funding links, CI workflow, offline wiki, LLM prompt templates.
- Meta-documentation: INSTALL, BUILD, DEPLOYMENT, usage, FAQ, SUPPORT,
  SECURITY, PRICING, GOVERNANCE, ROADMAP, ADR, CITATIONS, AUTHORS,
  MAINTAINERS, CLAUDE.md, AGENTS.md, SUMMARY.

### Changed
- Project renamed to **FED-Indeed** (previously the working title
  "OpenATS").

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
