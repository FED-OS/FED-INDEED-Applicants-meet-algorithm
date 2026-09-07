# Scoring Methodology

The honest math behind the ATS Compatibility Rating — including its limits,
which are the point.

## The Formula

```
match_index = |resume_tokens ∩ jd_keywords| ÷ |jd_keywords| × 100
```

- `resume_tokens` — every lowercased word token extracted from the PDF
  (unfiltered).
- `jd_keywords` — job-description tokens after stop-word removal and the
  `len > 2` floor, **top 20 by frequency**.

So the index answers exactly one question: *"Of the high-frequency terms a
keyword filter would index from this JD, what fraction appears verbatim in
the parsed resume text?"* It is a Jaccard-style coverage ratio — a
deliberate simplification of full Jaccard (which divides by the union),
chosen because users think in "how much of the job do I match", not
"how similar are two documents".

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

## Known Limitations (Feature, Not Bug)

1. **Exact-match only.** "Manage" ≠ "management"; "k8s" ≠ "Kubernetes".
   Fuzzy/stemmed matching is [roadmap Stage 1](../ROADMAP.md).
2. **Unweighted.** A must-have (AWS) and a nice-to-have (Kafka) cost the
   same when missing. Required-vs-preferred weighting is roadmap Stage 2.
3. **Top-20 by frequency.** Rare-but-critical terms (a certification
   mentioned once) can fall outside the set; frequency is a proxy for
   filter importance, not a guarantee.
4. **Parses, not understands.** The score operates on the *extracted*
   text. If the parse scrambled your columns, the score reflects the
   scramble — which is exactly what a real filter would see. Fix structure
   first, then interpret the score.
5. **Section-blind.** "Java" in a hobby line counts like "Java" in a work
   bullet. Section-aware parsing is roadmap Stage 2.

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

The v0.1.0 formula and constants (stop-word set, `len > 2`, top-20,
thresholds) are the baseline contract documented in
[CHANGELOG.md](../CHANGELOG.md) and [AGENTS.md](../AGENTS.md). Any change
that shifts scores ships with a changelog note so users aren't confused by
silent movement.
