# Architecture Decision Records

ADRs document *why* FED-Indeed is built the way it is. Once accepted, a
decision is only reversed by a new ADR — not by quiet drift.

Format: **ADR-NNNN — Title** · Status · Context · Decision · Consequences.

---

## ADR-0001 — Streamlit over a custom web framework

**Status:** Accepted (2026-09-07)

**Context:** The app needs a browser UI for non-technical job seekers, but
the team is small and the project must be trivially self-hostable by
contributors and forks.

**Decision:** Build the UI on Streamlit (`app.py`, single entry point) rather
than Flask/FastAPI + a JS frontend.

**Consequences:** Instant deployment (including Streamlit Community Cloud
free tier), minimal code, built-in widgets. Trade-offs: session-only state,
limited fine-grained control of DOM, and layout constraints. Accepted
because the product is a one-page tool, not a platform.

---

## ADR-0002 — In-memory only; no database, ever

**Status:** Accepted (2026-09-07)

**Context:** Early design considered Supabase for persistence (scores,
history, accounts). That adds ingress egress costs, an attack surface, and —
worst for this audience — a trust problem: job seekers uploading resumes to
an unknown third-party database.

**Decision:** FED-Indeed is stateless. Uploaded PDFs and JD text exist only
in Streamlit session memory. No database, no files written, no accounts, no
telemetry. Optional history features (see roadmap) must use session state
only, remaining local by definition.

**Consequences:** Zero ingress fees, zero privacy risk, public deployment
safe with no auth. Limitation: no cross-session history or multi-device sync.
That's the right trade for this product.

---

## ADR-0003 — Local-first is non-negotiable

**Status:** Accepted (2026-09-07)

**Context:** Semantic features (synonym suggestion, cluster analysis) are
genuinely useful but LLM calls require either a paid API or cloud hosting.

**Decision:** The core scanner (parse, score, structure checks) must remain
fully functional with **no API keys and no network calls**. LLM-powered
features are strictly optional, user-keyed, and template-driven via
[prompts/](prompts/).

**Consequences:** The tool works for everyone forever, and nobody's resume
text is ever sent to a model provider *by us*. Users who want semantic
features bring their own key and accept their provider's privacy terms.

---

## ADR-0004 — Jaccard-style overlap as the v0.x match index

**Status:** Accepted (2026-09-07)

**Context:** Corporate ATS vendors use proprietary, opaque scoring. We need
an interpretable, dependency-free baseline that models keyword filtering.

**Decision:** Score = |resume ∩ JD keywords| ÷ |JD keywords| × 100, with
threshold bands ≥75% / 50–74% / <50%. Display the raw text stream beside it
so users can always see *why* a score is what it is.

**Consequences:** Transparent, explainable, zero-dependency. Known limits:
exact-match only (no stemming), unweighted terms (no must-have vs
nice-to-have distinction) — both addressed on the roadmap as *upgrades to*
the index, not replacements.

---

## ADR-0005 — Simulate the parser, don't flatter the user

**Status:** Accepted (2026-09-07)

**Context:** Commercial "resume checkers" trend toward vanity scores that
optimise for upsell, not honesty.

**Decision:** FED-Indeed shows the raw, ugly, machine-side truth: scrambled
columns, ghost-image text, missed keywords. UI copy states plainly when a
resume will likely be auto-filtered.

**Consequences:** Users occasionally see bad news. That's the product.
Trust is the differentiator.

---

## ADR-0006 — MIT License

**Status:** Accepted (2026-09-07)

**Context:** Maximise reach and fork-ability (community-hosted instances,
inclusion in career-resource bundles) with minimal legal friction.

**Decision:** MIT, with attribution notices for Streamlit (Apache-2.0) and
pdfplumber (MIT) in [NOTICE.md](NOTICE.md).

**Consequences:** Anyone can self-host, modify, or embed FED-Indeed,
including commercially, as long as the license text travels with the code.
