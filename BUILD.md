# Build & Test Guide

FED-Indeed is a pure-Python Streamlit app — there is no compile step. "Building"
means validating that the code is import-clean and that the dependency set
resolves.

## Local Validation Steps

Run these from the repository root before pushing:

```bash
# 1. Byte-compile check (catches syntax errors in app.py)
python -m py_compile app.py && echo OK

# 2. Import check (catches missing/broken dependencies)
python -c "import streamlit, pdfplumber; print('deps OK')"

# 3. Dry-run resolve of the dependency set
pip install --dry-run -r requirements.txt
```

All three passing locally means CI (see below) will pass too, 99% of the
time.

## Smoke Test (Manual)

1. `streamlit run app.py`
2. Upload a **synthetic** PDF (create one with any word processor — do not
   use real resumes).
3. Paste the sample job description from `usage.md`.
4. Confirm all four panels render:
   - ATS Compatibility Rating (score + status)
   - Structural Readability Integrity (layout / image / date checks)
   - Raw Text Stream
   - Keyword Matrix

## CI Pipeline

GitHub Actions workflow: [`.github/workflows/build.yml`](.github/workflows/build.yml)

| Job | Trigger | What it does |
|---|---|---|
| `build` | push to `main`, PRs to `main` | Ubuntu + Python matrix (3.8–3.12) · install deps · byte-compile `app.py` · import smoke test · artifact upload |
| `codeql` | push to `main`, PRs to `main`, weekly | GitHub CodeQL security scanning |
| `label` | PR opened/labeled | validates PR uses a conventional title |

The badge at the top of [README.md](README.md) reflects the `build` job.

## Release Checklist

1. Update `__version__` in `app.py`.
2. Add a `CHANGELOG.md` entry under the new version (Keep a Changelog format).
3. Ensure CI is green on `main`.
4. Tag: `git tag -a vX.Y.Z -m "vX.Y.Z"` → `git push origin vX.Y.Z`.
5. GitHub release with changelog excerpt + `social-image.png` as the release
   image.

## Packaging (Future)

PyPI packaging (console entry point `fed-indeed`) is planned but blocked on
decoupling parsing logic from UI code — see
[ROADMAP.md](ROADMAP.md#refactoring-track). Until then, install is
git-clone-only.
