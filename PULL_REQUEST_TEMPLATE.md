## Description

<!-- What does this PR change and why? Link the issue it closes (e.g., "Closes #12"). -->

Closes #

## Type of change

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (new parser check, scoring logic, or UI element)
- [ ] 💥 Breaking change (alters scores/output users rely on — changelog "Changed" entry required)
- [ ] 📚 Documentation only
- [ ] 🔧 Refactor / internal quality
- [ ] ✅ Tests

## Project constraints (check all — required)

- [ ] No persistence added (no DB, disk writes of uploads, accounts, or telemetry) — ADR-0002
- [ ] No new non-optional network calls or API keys in the core scanner — ADR-0003
- [ ] Audit output stays honest (no softened or gamified results) — ADR-0005
- [ ] No new dependencies (or an ADR-level justification is included)
- [ ] No real resumes or personal data included in code, tests, or screenshots

## How was this verified?

<!-- Describe exactly what you ran and saw. -->

- [ ] `python -m py_compile app.py` passes
- [ ] `python -c "import streamlit, pdfplumber"` passes
- [ ] Manual smoke test (`streamlit run app.py`) with a **synthetic** PDF
- [ ] Scoring behaviour unchanged / change is intentional and changelog-documented

Details:

<!-- e.g., "Uploaded a 2-page synthetic PDF with a 2-column layout; the multi-column alert now fires, raw stream unchanged." -->

## Screenshots (if UI changed)

<!-- Synthetic data only. -->

## Checklist

- [ ] `CHANGELOG.md` updated (Unreleased section)
- [ ] Related `todo.md` item ticked or noted
- [ ] Documentation (`usage.md` / `wiki/` / `FAQ.md`) updated if user-facing
- [ ] Commit messages follow `feat:`/`fix:`/`docs:`/`refactor:`/`test:` style
