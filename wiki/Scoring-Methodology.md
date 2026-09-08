# Scoring Methodology

The honest math behind the ATS Compatibility Rating — including its limits,
which are the point.

> **v0.2.0 update:** the index is now **TF-weighted** and both sides run
> through **canonical aliases + suffix stemming** before matching. The
> flat, exact-match formula below describes v0.1.0 and is kept for history.

## The Formula

```
tokens   = words(resume ∪ jd), lowercased
stem(t)  = deterministic suffix stem (v0.2.0)
canon(t) = alias map: k8s→kubernetes, postgres→postgresql, … (v0.2.0)

jd_keywords  = top 20 of [canon(stem(t)) for t in jd_tokens
                if t ∉ stopwords and len(t) > 2]  by frequency

match_index = Σ weight(k) for matched k  ÷  Σ weight(k) for all k  × 100
              (weight = keyword frequency in the JD — TF-weighted, v0.2.0)
```

- `resume_tokens` — every lowercased word token extracted from the PDF
  (unfiltered, stemmed + canonicalised in v0.2.0).
- `jd_keywords` — job-description tokens after stop-word removal and the
  `len > 2` floor, **top 20 by frequency**, collapsed onto stems.

So the index answers exactly one question: *"Of the high-frequency terms a
keyword filter would index from this JD — weighted by how often the JD
repeats them — what fraction does your resume cover?"*

## The Threshold Bands

| Band | Range | Meaning | Field basis |
|---|---|---|---|
| ✅ Safe Match | ≥ 75% | Clears typical keyword-filter cutoffs | Vendor-documented ranges commonly sit at 70–80% |
| ⚠️ Borderline | 50–74% | Passes lenient filters, fails strict ones | Filter strictness varies wildly by employer |
| ❌ High Risk | < 50% | Auto-rejection likely on keyword grounds | — |

**Important:** no public tool can know any specific vendor's cutoff. The
75% line models the *conventional wisdom* range, and the roadmap's
threshold-slider feature exists precisely so users can stress-test other
cutoffs.

## The v0.2.0 Composite & Grade

Alongside the headline match index, v0.2.0 computes:

```
composite = 0.60 × keyword_score
         + 0.25 × structure_score
         + 0.15 × timeline_score
```

- **structure_score** — 100 (clean layout) / 45 (column anomaly) / 0
  (ghost document), minus 25 if fewer than two dates parse.
- **timeline_score** — `min(dates ÷ 6, 1) × 100`.
- **grade** — A ≥ 85 · B ≥ 70 · C ≥ 55 · D ≥ 40 · F below.

The composite is a *conversation starter*, not a verdict — the headline
match index remains the number a keyword filter would actually gate on.

## Known Limitations (Feature, Not Bug)

1. ~~**Exact-match only.**~~ **Fixed in v0.2.0** — suffix stemming
   (`pipelines` ↔ `pipeline`) and the alias map (`k8s` → `kubernetes`)
   collapse the common false negatives. Truly fuzzy matching (typos,
   "PostgresDB") remains roadmap Stage 1.
2. ~~**Unweighted.**~~ **Fixed in v0.2.0** — TF-weighting: a keyword the JD
   repeats 5× weighs 5×. Required-vs-preferred section weighting remains
   roadmap Stage 2.
3. **Top-20 by frequency.** Rare-but-critical terms (a certification
   mentioned once) can fall outside the set; frequency is a proxy for
   filter importance, not a guarantee.
4. **Parses, not understands.** The score operates on the *extracted*
   text. If the parse scrambled your columns, the score reflects the
   scramble — which is exactly what a real filter would see. Fix structure
   first, then interpret the score.
5. **Section-blind.** "Java" in a hobby line counts like "Java" in a work
   bullet. Section-aware parsing is roadmap Stage 2.
6. **The stemmer is deterministic, not linguistic.** It collapses safe,
   predictable suffixes (s / ed / ing / ies) with guard rails for acronyms
   and `ss`/`us`/`is` words. It will not conflate unrelated words, but it
   also won't catch irregulars ("built" ↔ "build" still miss).

We publish the limitations openly because a checker that hides them is
selling comfort, not insight — see [ADR-0005](../ADR.md#adr-0005-simulate-the-parser-dont-flatter-the-user).

## Why Not TF-IDF / Embeddings?

Interpretability and zero dependencies. A job seeker must be able to look
at the Keyword Matrix and understand *exactly* why the score moved.
TF-IDF weighting and semantic similarity are on the roadmap as **opt-in
layers**, never replacements for the visible baseline — the explainable
number stays the product.

## Reading the Score Correctly

- **High score** = you won't be filtered out *for mechanical reasons*. It
  is not a hiring prediction.
- **Low score with strong experience** = almost always a phrasing or
  parse problem. Check the raw stream, then the
  [semantic cluster prompt](../prompts/semantic_clusters.md).
- **Score moved after an edit** = re-run the full audit; every change
  re-parses and re-scores from scratch.

## Comparing Across Versions

The v0.2.0 formula and constants (alias table, stemmer rules, TF weights,
60/25/15 composite, thresholds) are the baseline contract documented in
[CHANGELOG.md](../CHANGELOG.md) and [AGENTS.md](../AGENTS.md); the v0.1.0
flat formula above is retained for history. Any change
that shifts scores ships with a changelog note so users aren't confused by
silent movement.
