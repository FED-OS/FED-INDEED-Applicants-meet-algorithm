# Are 75 / 50 the right score bands? (Design debate)

> Maintainer note: post in **💡 Ideas** as a seed thread. Delete this note
> before posting.

FED-Indeed's compatibility rating uses three bands:

| Band | Range |
|---|---|
| ✅ Safe Match | ≥ 75% |
| ⚠️ Borderline | 50–74% |
| ❌ High Rejection Risk | < 50% |

The 75% line models the conventional-wisdom range for auto-pass cutoffs;
below 50% is where keyword filters get brutal. But it's a *model* —
vendors configure differently, industries differ, and we deliberately
refuse to pretend we know any one vendor's secret sauce. The
[threshold slider](../../ROADMAP.md) is roadmap Stage 1 precisely because
any fixed number is a compromise.

**So: debate time.** Three questions worth arguing:

1. **Are the bands where they should be?** Does 74% *feel* like a
   rejection risk in your experience, or is the real world harsher
   (auto-filter closer to 80+) / kinder (60% passes plenty of places)?
2. **Should "Borderline" exist?** Some tools use only pass/fail. Is the
   middle band actionable information, or false precision?
3. **What would make the bands more trustworthy?** E.g., per-JD-length
   normalization (a 40-term JD punishes misses harder than a 12-term one),
   required-vs-preferred weighting first (Stage 2), or something we
   haven't thought of.

## Constraints on the debate

- The core index stays **explainable** — whatever we conclude, a job
  seeker must still be able to see exactly why their score moved
  ([ADR-0004](../../ADR.md), [ADR-0005](../../ADR.md)). "Trust the black
  box" is not an acceptable outcome.
- Vendor claims ("Company X filters at 78%") are useful *as reports*, but
  cite the source or label it as word-of-mouth; we don't launder rumor
  into pseudo-precision.

Strong consensus here becomes roadmap priorities — this project genuinely
lets votes and arguments reorder its stages.
