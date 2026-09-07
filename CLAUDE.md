# CLAUDE.md

Guidance for Claude Code and any Claude-powered coding agent working in this
repository.

## What This Repo Is

FED-Indeed is an open-source, local-first **reverse ATS scanner**: a
Streamlit app that shows job seekers exactly how corporate resume-filtering
parsers read their documents, scores keyword alignment, and flags structural
failure modes. Privacy and honesty are the brand — see `README.md` and
`SUMMARY.md` for the product framing.

## Non-Negotiables (from ADR.md — read before any change)

1. **No persistence.** No databases, no writing uploads to disk, no
   telemetry, no accounts. Session memory only (ADR-0002).
2. **No network calls by the app.** The only external URL in the UI is the
   static Ko-fi button image. LLM features must be optional, user-keyed,
   template-driven (ADR-0003).
3. **Show the machine's truth.** Never soften or gamify the audit output;
   honesty is the differentiator (ADR-0005).
4. **Dependencies stay minimal.** Streamlit + pdfplumber + stdlib. Anything
   new requires an ADR-level discussion (ADR-0001, ADR-0006 context).
5. **Privacy in code review.** Never commit real resumes, personal data, or
   user uploads — synthetic fixtures only.

## Layout

- `app.py` — the entire application (v0.1.x is deliberately single-file;
  extraction to modules is on the roadmap's refactor track)
- `styles.css` — auto-loaded theme layer; prefer edits here over inline
  styles in `app.py`
- `requirements.txt` — the full dependency set; keep in sync with imports
- `prompts/` — LLM prompt templates for optional semantic features
- `wiki/`, `discussion/` — plain-Markdown docs & community content
- `.github/` — templates, funding, CI (`.github/workflows/build.yml`)
- Meta docs: `ADR.md`, `ROADMAP.md`, `CHANGELOG.md`, `todo.md` (working
  backlog), plus the standards set (CONTRIBUTING, SUPPORT, SECURITY, …)

## Conventions

- Python 3.8+ compatible; PEP 8; comments explain *why* in parser heuristics.
- Commit style: `feat:` / `fix:` / `docs:` / `refactor:` / `test:`.
- Version bumps follow SemVer; changelog follows Keep a Changelog — update
  `CHANGELOG.md` and `__version__` together.
- The v0.1.0 matching logic (Jaccard bands, stop-word list, 150-char image
  threshold, layout-jump heuristic, date regex) is the agreed baseline —
  change it only with clear justification, since users compare scores across
  versions.
- Branches: `feat/…`, `fix/…`, `docs/…`, `refactor/…`, `test/…`.

## Verifying Changes

```bash
python -m py_compile app.py && python -c "import streamlit, pdfplumber" && echo OK
streamlit run app.py   # manual smoke test with a synthetic PDF
```

CI (`.github/workflows/build.yml`) repeats the compile/import checks on
Python 3.8–3.12 plus CodeQL.

## Useful Context for Agents

- The scoring bands are Safe ≥ 75% / Borderline 50–74% / High Risk < 50%.
- Structural checks: <150 parsed chars → image-document alert; >3 horizontal
  x0 back-jumps in the first 40 words → multi-column alert; <2 date matches
  → timeline alert.
- The working backlog lives in `todo.md`; staged priorities in `ROADMAP.md`.
- `YOUR_USERNAME` / `YOUR_EMAIL` / `YOUR_NAME` are placeholders to be
  replaced by the maintainer before launch — don't "fix" them into real
  guesses.
