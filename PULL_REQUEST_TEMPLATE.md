<!--
  Root mirror of .github/PULL_REQUEST_TEMPLATE.md
  GitHub uses the .github/ copy when creating PRs. This root copy exists for
  contributors on tooling that reads templates from the repository root, and
  keeps the template list in the repo root complete.
  Please do not edit here without updating .github/PULL_REQUEST_TEMPLATE.md
  (or just edit that file and delete this one from your fork if unused).
-->

## Description

<!-- What does this PR change and why? Link the issue it closes. -->

Closes #

## Type of change

- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 💥 Breaking change (changelog "Changed" entry required)
- [ ] 📚 Documentation only
- [ ] 🔧 Refactor / internal quality
- [ ] ✅ Tests

## Project constraints (required)

- [ ] No persistence added (no DB, disk writes of uploads, telemetry) — ADR-0002
- [ ] No new non-optional network calls / API keys in core — ADR-0003
- [ ] Audit output stays honest — ADR-0005
- [ ] No real resumes or personal data included

## How was this verified?

- [ ] `python -m py_compile app.py` passes
- [ ] `python -c "import streamlit, pdfplumber"` passes
- [ ] Manual smoke test with a **synthetic** PDF

Details:

## Checklist

- [ ] `CHANGELOG.md` updated (Unreleased section)
- [ ] Related `todo.md` item ticked or noted
- [ ] Docs updated if user-facing

*(The canonical, detailed template lives at
[.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md).)*
