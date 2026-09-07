# Usage Guide

## Running the App

```bash
streamlit run app.py
```

Then open `http://localhost:8501` (usually opens automatically).

## Step-by-Step Audit

### 1. Upload your resume

Use the **Upload Candidate Data** panel. PDF format only — `.docx` and image
exports are not parsed by the engine.

### 2. Paste the job description

Copy the *full* text of the posting into the **Target Job Profile** panel.
Include the requirements section verbatim — that's where the highest-value
keywords live.

### 3. Read the audit

Four panels appear the moment both inputs are present:

**📊 ATS Compatibility Rating** — your Overall Match Index as a percentage.

| Score | Status | Meaning |
|---|---|---|
| ≥ 75% | ✅ Safe Match | Strong programmatic alignment; likely clears keyword filters |
| 50–74% | ⚠️ Borderline | Risks automatic filtering; add the missing keywords from the matrix |
| < 50% | ❌ High Rejection Risk | Keyword alignment too weak; rework the resume before applying |

**🛠️ Structural Readability Integrity** — machine-readability checks:

- *Fatal Error (OCR Image)* — under 150 characters parsed. Your PDF is
  effectively a flat image; scanners read it as blank. Re-export as a
  text-based PDF.
- *Structural Alert (Columns)* — multi-column layout detected. Line-by-line
  parsers read straight across columns, scrambling your sentences. Prefer a
  single column.
- *Timeline Parsing Alert* — fewer than two date patterns found. Write dates
  as `March 2022` or `03/2022`, and use `Present` for current roles.

**🤖 What the Machine Sees** — the exact extracted text stream. Read it
carefully: merged words, missing sections, and scrambled sentences are
visible here for the first time.

**🎯 Keyword Matrix** — the JD's top-20 high-value terms, split into matched
and missing. Work the missing terms into *true* statements about your
experience (never fabricate — interviews verify).

## A Realistic Workflow

1. Run the audit → note score + missing keywords.
2. Fix structural alerts first (layout, image export, dates) — a perfect
   keyword list is useless if the parser can't read it.
3. Rewrite 2–3 bullets so the missing keywords appear naturally.
4. Re-upload → compare scores. Aim to clear 75% before you submit.
5. Repeat per job posting — the matrix is JD-specific by design.

## Interpreting the Score Honestly

- The index is a **Jaccard-style overlap** against the JD's keywords. It
  models *typical* keyword filters, not any single vendor's secret sauce.
- A high score does **not** guarantee an interview; it means you won't be
  filtered out for the boring, mechanical reasons.
- A low score with strong experience usually means phrasing mismatch — see
  the synonym ideas in [prompts/rewrite_suggestions.md](prompts/rewrite_suggestions.md).

## Privacy

Uploads live in session memory only. Closing the tab or restarting the app
erases everything. Nothing is logged, stored, or transmitted.

## Keyboard & Accessibility Notes

- All inputs are standard Streamlit widgets — tab navigation works.
- Score panels use both colour *and* emoji/text status, so colour-blind
  users get the same information.
