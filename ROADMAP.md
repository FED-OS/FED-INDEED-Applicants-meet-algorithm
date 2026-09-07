# FED-Indeed Roadmap

The mission: model ever more of what corporate ATS engines actually do, so
job seekers can pre-empt every mechanical rejection. Items are grouped into
stages by impact and effort; stages are not calendar promises — this is a
volunteer project, and priorities can shift with community demand.

## Legend

✅ shipped · 🚧 in progress · 📋 planned

## Stage 1 — Validation Hardening (0.2.x)

- 📋 **Contact-info validation** — regex checks for email, phone, and
  LinkedIn/GitHub URLs; flag as auto-reject risk when missing. *(quick win)*
- 📋 **Fuzzy & stemmed matching** — stem both sides before overlap so
  "manage" matches "management"; add a small acronym dictionary
  (`CRM` ↔ `Customer Relationship Management`, `k8s` ↔ `Kubernetes`).
  *(quick win, biggest per-line-of-code payoff)*
- 📋 **Custom threshold slider** — let users move the pass line (some
  companies filter at 60%, some at 85%) and see status flip live.
- 📋 **JD sectioning** — heuristics that score only against the
  Responsibilities/Qualifications sections, ignoring Benefits boilerplate.

## Stage 2 — Weighted & Temporal Scoring (0.3.x)

- 📋 **Required vs. preferred weighting** — parse "must have / minimum /
  required" phrasing and penalise missing must-haves far more than
  nice-to-haves.
- 📋 **Skill tenure extraction** — co-locate skills with their nearest date
  ranges to estimate years of experience per skill; surface junior-vs-senior
  signals the way real filters do.
- 📋 **Section-aware resume parsing** — split the resume into Work /
  Education / Skills / Certifications buckets and score each against the
  relevant JD section.

## Stage 3 — Depth & Insight (0.4.x)

- 📋 **Action-verb & impact analysis** — secondary "narrative strength"
  gauge counting strong verbs and quantified outcomes per bullet.
- 📋 **Graphics-to-text ratio check** — flag pages where charts and skill
  bars carry content as pixels instead of text.
- 📋 **Semantic synonym mapping** — suggest rewrites ("deployment
  pipelines" → "CI/CD pipelines") via the local prompt templates in
  [prompts/](prompts/) so users stop losing points to phrasing.
- 📋 **Education parsing** — degree level, field, and institution checks.

## Stage 4 — Power Users (0.5.x)

- 📋 **Batch multi-JD comparison** — rank several resumes (or several JDs)
  against each other in one session.
- 📋 **Session-local history** — score trendline across edits within one
  run (session state only; persistence remains opt-in and local).
- 📋 **DOCX support** — parsed natively instead of PDF-converted.

## Refactoring Track (parallel)

- 📋 Split parsing/scoring logic out of `app.py` into importable modules.
- 📋 Test suite with synthetic PDF fixtures.
- 📋 PyPI packaging with a `fed-indeed` console entry point.

## Dreaming Big (1.0 and beyond)

- 📋 Community-contributed check packs (industry-specific keyword sets).
- 📋 Fully offline semantic matching with a small local model.
- 📋 Localization — the job market is not English-only.

## Explicit Non-Goals

- ❌ Storing or transmitting candidate data — ever.
- ❌ Auto-applying to jobs on users' behalf.
- 📄 See [ADR-0003](ADR.md#adr-0003-local-first-is-non-negotiable) for the
  architectural commitments behind these lines.

## Feedback Shapes the Order

Open a [feature request](https://github.com/YOUR_USERNAME/FED-Indeed/issues/new?template=feature_request.md)
or vote in [Discussions](https://github.com/YOUR_USERNAME/FED-Indeed/discussions/categories/ideas)
— demand genuinely reorders stages.
