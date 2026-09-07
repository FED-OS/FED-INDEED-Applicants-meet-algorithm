# AGENTS.md

Operating guide for *any* AI coding agent (GitHub Copilot coding agent,
Claude, Cursor, Aider, etc.) working in this repository. Read this file
first; it is the machine-facing contract that keeps automated contributions
consistent with the project's commitments.

## Project in One Line

A privacy-first, stateless Streamlit app that reverse-engineers ATS resume
filters for job seekers.

## Hard Rules — Do Not Violate

1. **Never add persistence, telemetry, accounts, or non-optional network
   calls.** The app must function fully offline. See `ADR.md` (ADR-0002,
   ADR-0003) — these are constitutional decisions, not preferences.
2. **Never commit, generate links to, or embed real resumes or personal
   data** — including in tests, fixtures, examples, and screenshots.
   Synthetic content only.
3. **Do not add dependencies** beyond Streamlit, pdfplumber, and the
   standard library without flagging the change as architectural (requires
   maintainer discussion per `GOVERNANCE.md`).
4. **Do not soften audit output.** If a resume parses badly, the app says
   so. "Improving scores" by weakening checks is a regression, not a fix
   (ADR-0005).
5. **Keep `app.py` runnable on Python 3.8+.** No walrus-in-comprehensions
   gymnastics that break 3.8, no 3.10+ syntax.

## Where Things Live

| Path | Role |
|---|---|
| `app.py` | The whole app (single-file by design in 0.1.x) |
| `styles.css` | Theme layer auto-loaded by `app.py` |
| `requirements.txt` | Dependencies — must stay in sync with imports |
| `prompts/` | LLM templates (optional features only) |
| `todo.md` | Working backlog — pick tasks here or from GitHub issues |
| `ROADMAP.md` | Staged priorities & non-goals |
| `ADR.md` | Architecture decisions & rationale |
| `wiki/`, `discussion/` | Markdown docs & community content |
| `.github/` | Templates, funding, CI workflow |

## Agent Workflow

1. **Pick a task** from `todo.md` or an issue labelled `good first issue`.
2. **Branch** using the project prefixes: `feat/…`, `fix/…`, `docs/…`,
   `refactor/…`, `test/…`.
3. **Implement** with PEP 8, comments explaining *why* in parser heuristics.
4. **Verify** before opening a PR:

   ```bash
   python -m py_compile app.py
   python -c "import streamlit, pdfplumber"
   ```

   UI changes need a manual `streamlit run app.py` check with a synthetic
   PDF — agents that can't run a browser session should state that
   explicitly in the PR description.
5. **Update `CHANGELOG.md`** (Unreleased section) and, if a task was
   completed, tick it in `todo.md`.
6. **Open the PR** following `.github/PULL_REQUEST_TEMPLATE.md` — include
   verification steps performed.

## Scoring Baseline (Do Not Casually Change)

Users compare scores across versions; the v0.1.0 baseline is the contract:

- Match index: `|resume ∩ JD keywords| ÷ |JD keywords| × 100`
- Bands: ≥ 75% Safe · 50–74% Borderline · < 50% High Risk
- Stop-word set and the `len > 2` keyword filter as defined in `app.py`
- Image-document threshold: 150 parsed characters
- Multi-column heuristic: >3 x0 back-jumps within the first 40 words
- Date regex: `Month YYYY`, `MM/YYYY`, `Present`

Changes here require justification and changelog documentation.

## Communication

- PR descriptions must state *what was verified* and *how*.
- If a task is ambiguous or touches an ADR, stop and open a Discussion
  instead of guessing.
- Don't edit `MAINTAINERS.md`, `SECURITY.md`, or `LICENSE` unless the task
  explicitly asks.

## Placeholders You'll See

`YOUR_USERNAME`, `YOUR_EMAIL`, `YOUR_NAME` are intentional placeholders for
the maintainer to replace — leave them as-is rather than inventing values.
