# How It Works

The complete v0.2.x pipeline, from upload to rendered audit — five stages,
all in one Streamlit session, all in memory.

## Stage 1 — Upload & Input

- The resume arrives via `st.file_uploader` (PDF only) as an in-memory
  bytes buffer. It is never written to disk.
- The job description arrives via `st.text_area` as a plain string.

Nothing happens until **both** are present — the app shows a hint banner
otherwise, which is deliberate: scoring half the pipeline produces
misleading numbers.

## Stage 2 — Parsing (the ATS emulation)

```python
with pdfplumber.open(uploaded_file) as pdf:
    for page in pdf.pages:
        words = page.extract_words()      # positioned words (for layout checks)
        text = page.extract_text(layout=False)  # aggressive plain-text stream
```

Two extractions happen per page:

- **`extract_words()`** returns each word with its coordinates. FED-Indeed
  uses `x0` positions to detect multi-column layouts (see Stage 4).
- **`extract_text(layout=False)`** produces the flat, line-by-line string a
  deterministic ATS reader would ingest — this is the *Raw Text Stream*
  panel. `layout=False` matters: it mimics parsers that ignore visual
  positioning entirely.

The concatenated text across pages becomes `raw_extracted_text`.

## Stage 3 — Cleaning, Aliasing & Stemming (v0.2.0)

```python
def tokenize(text):
    return re.findall(r"\b\w+\b", text.lower())

# v0.2.0 pipeline, applied to BOTH sides:
jd_keywords = [canonical(w) for w in tokenize(job_description)
               if canonical(w) not in STOP_WORDS and len(canonical(w)) > 2]
jd_counts   = Counter(stem(w) for w in jd_keywords).most_common(20)
```

Both sides are lowercased and tokenized on word boundaries. JD tokens pass
a stop-word filter (the, and, of, for…) and a `len > 2` floor, then
**aliases** (`k8s` → `kubernetes`, `postgres` → `postgresql`) and the
**deterministic stemmer** (`pipelines` → `pipelin`) collapse variants onto
shared stems, and the top-20 by frequency become the scoring targets — the
**Keyword Matrix**. The resume side keeps *all* tokens (also
canonicalised + stemmed); only the JD side is filtered, because we're
measuring JD coverage, not resume noise.

## Stage 4 — Structural Checks

Three independent heuristics, run in priority order:

1. **Image-document check** — `len(raw_extracted_text.strip()) < 150` →
   the PDF is effectively a flat image. Whatever the viewer shows, the
   parser got ~nothing. Fatal: every downstream metric is meaningless.
2. **Multi-column check** — walk the first 40 positioned words per page;
   count "back-jumps" where a word's `x0` is more than 100 units *left* of
   the previous word's. More than 3 jumps → columns are interleaving the
   reading order. (Why first 40? Sidebars, skill panels, and two-column
   designs announce themselves in the opening block; scanning everything
   adds cost without changing the verdict.)
3. **Date check** — regex for `Month YYYY`, `MM/YYYY`, and `Present`.
   Fewer than 2 matches → the parser can't reconstruct a career timeline,
   which many engines treat as zero verifiable experience.

Structural alerts outrank the score in the UI deliberately: a broken parse
invalidates the keyword math, so the panel tells you to fix structure
first.

## Stage 5 — Scoring & Rendering

```python
tracked    = top_keywords(job_description)          # [(stem, surface, count)]
r_stems    = resume_stem_set(raw_extracted_text)    # {stem(canonical(w))}

match_w    = Σ count(k) for k in tracked if k.stem in r_stems
total_w    = Σ count(k) for k in tracked
match_index = match_w / total_w * 100               # TF-weighted (v0.2.0)

composite  = 0.6 × keyword + 0.25 × structure + 0.15 × timeline
grade      = A–F on the composite
```

The index is JD-keyword **coverage, weighted by JD frequency** (TF): a
keyword the JD repeats 5× weighs 5× when matched — and 5× when missing.
Bands at ≥75% (Safe), 50–74% (Borderline), <50% (High Risk) — see
[Scoring-Methodology](Scoring-Methodology.md) for why those lines and what
they honestly do and don't mean. The composite grade blends keyword,
structure, and timeline sub-scores into one A–F letter for quick gut
checks.

Finally, Streamlit renders the panels — score + grade, sub-score bars,
structural integrity, raw stream, keyword matrix, alias-hit callout, the
JSON report export — and re-runs the entire pipeline on every input
change. There is no caching layer yet (planned: `@st.cache_data` on
parsing, see roadmap).

## What Deliberately Does *Not* Happen

- No file writes, no database, no network calls (the static ko-fi image is
  the only external URL).
- No NLP models, embeddings, or API calls — stdlib + pdfplumber only.
- No "score boosting" post-processing. The number is the number.

Deep dive on the decisions behind all of this: [ADR.md](../ADR.md).
