# Troubleshooting

Problems, causes, fixes. If your issue isn't here, check
[FAQ.md](../FAQ.md) first, then [SUPPORT.md](../SUPPORT.md) for where to ask.

## Installation & Startup

### `streamlit: command not found`

The virtualenv isn't activated, or Streamlit installed into a different
interpreter.

```bash
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m streamlit run app.py  # the bulletproof form
```

### `ModuleNotFoundError: No module named 'pdfplumber'` (or 'streamlit')

Dependencies not installed in the active environment. Re-run
`pip install -r requirements.txt` *with the venv active*. The
`python -m streamlit` form above guarantees the interpreter matches.

### `python -m venv venv` fails on Linux (ensurepip missing)

```bash
sudo apt install python3-venv   # or your distro's equivalent
```

### Windows: activation script won't run

PowerShell blocks scripts by default:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### App opens but shows only the hint banner

Not an error — the audit waits for **both** a PDF *and* a job description.
Paste the JD text and it starts.

## Runtime Issues

### `pdfplumber` raises on my PDF (traceback with `PdfReadError` / `EOF`)

The file is likely corrupted or a non-PDF renamed to `.pdf`. Re-download or
re-export the original. If it opens fine in a reader but still fails,
[file a bug](https://github.com/YOUR_USERNAME/FED-Indeed/issues/new?template=bug_report.md)
with the creating tool's name — hostile-PDF robustness is on the roadmap.

### The score seems absurdly low, but the JD paste looks right

Check the **Raw Text Stream** panel first, not the score:

- Merged/scrambled text → structural problem (columns or image export).
  Fix the structure, re-upload, re-read the score.
- Stream looks clean but keywords miss → phrasing mismatch ("manage" vs
  "management"). Exact-match limits are documented in
  [Scoring-Methodology](Scoring-Methodology.md); synonym handling is
  roadmap Stage 1.

### "Fatal Error (OCR Image)" — but my PDF *does* have text

Two common causes:

1. **Selected-in-reader ≠ embedded text.** Some viewers OCR on the fly.
   The mouse test (can you *select* text?) is more honest than the viewer.
2. **Text in images/charts carrying the content** while body text is thin —
   under 150 chars total trips the alert. If the alert fires on a genuine
   text PDF, that's a bug we want: file it with the creating tool's name.

### The multi-column alert fires on my single-column resume

The heuristic counts horizontal back-jumps in the first 40 words — centred
headers or justified text can occasionally trip it. It's a *heuristic*
false-positive candidate; if you can share a synthetic reproduction, the
threshold is tunable and we tune it on reports.

### Dates detected: 0 — but I have dates

The regex matches `Month YYYY` (`March 2022`, `Sep 2021`), `MM/YYYY`
(`03/2022`), and the literal word `Present`. It does **not** match
`2022–now`, `Q1 2022`, or `March 22`. Write full month+year. (Format
expansion is roadmap material.)

### The app feels slow on my 10-page resume

Every input change re-runs the full pipeline (no cache as of v0.2.0).
Parsing a large PDF per keystroke is the cost. Reduce re-pastes of the JD
(finalize it first), and expect caching (`@st.cache_data`) to land on the
roadmap's engineering-health track.

## Self-Hosting

### Streamlit Cloud deploy fails at "Install requirements"

Check the build logs — usually a Python-version mismatch (app requires
3.8+) or a typo introduced in `requirements.txt`. The repo's CI runs the
same install, so a green `build` badge + failing deploy usually means
fork-local edits.

### Health endpoint for uptime checks

`GET /_stcore/health` returns `ok` when the app is alive (CI uses this too).

## Still Stuck?

- [FAQ.md](../FAQ.md) — conceptual questions
- [SUPPORT.md](../SUPPORT.md) — routing (Q&A vs issues vs security)
- Always use **synthetic** documents when asking for help — community
  policy, no exceptions.
