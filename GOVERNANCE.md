# Project Governance

FED-Indeed is a lightweight, community-run open-source project. This document
describes how decisions are made and how you can be part of them.

## Roles

### Contributors

Anyone who opens an issue, joins a discussion, or submits a PR. Contributors
shape the project by reporting real-world ATS behaviour, proposing
heuristics, and improving docs. No special status is required — the
[CONTRIBUTING.md](CONTRIBUTING.md) workflow is the entry point.

### Maintainers

Contributors with commit access. Maintainers triage issues, review and merge
PRs, tag releases, and guard the project's core commitments (privacy,
local-first, honesty — see [ADR.md](ADR.md)). The current roster is in
[MAINTAINERS.md](MAINTAINERS.md).

### BDFL / Project Founder

The initial author acts as tie-breaker and final authority *only* for
violations of the project's constitutional decisions (the ADRs). Everything
else is decided by maintainers.

## Decision Ladder

Decisions escalate by scope — the smallest fitting tier applies:

1. **Editorial** (typos, docs, styling) — first maintainer to review merges.
2. **Routine** (bug fixes, check improvements, new UI elements within the
   existing architecture) — one maintainer review + green CI.
3. **Architectural** (new dependencies, scoring changes, anything touching
   an ADR) — a GitHub Discussion under *Ideas* first, then PR, then sign-off
   from a majority of maintainers, plus a new or amended ADR when a
   commitment changes.
4. **Constitutional** (adding persistence, telemetry, or anything that
   breaks local-first/privacy) — new ADR with explicit maintainer consensus,
   discussed publicly. The bar is deliberately very high; see
   [ADR-0002](ADR.md#adr-0002-in-memory-only-no-database-ever) and
   [ADR-0003](ADR.md#adr-0003-local-first-is-non-negotiable).

## Becoming a Maintainer

There's no checklist theater. Contributors who have repeatedly landed
high-quality PRs, triage helpfully, and understand the project's commitments
may be invited by existing maintainers. Self-nominations are welcome — ask
in Discussions.

## Consensus & Conflict

- We aim for consensus; when it can't be reached, a majority of maintainers
  decides, and the founder breaks ties only on constitutional questions.
- Technical disagreements live in the open (PR/Discussion threads), never
  DMs, so the reasoning stays archived.
- Code critiques target code. Personal remarks are a
  [Code of Conduct](CODE_OF_CONDUCT.md) matter.

## Releases

Maintainers tag releases following SemVer with [CHANGELOG.md](CHANGELOG.md)
entries; see the release checklist in [BUILD.md](BUILD.md#release-checklist).

## Changes to Governance

This document is versioned like code: propose changes via PR with a
maintainer majority approval.
