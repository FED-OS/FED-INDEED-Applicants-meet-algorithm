# Project Summary

**FED-Indeed — Reverse-engineer the AI gatekeepers. See what they see, fix
what they break.**

## The Problem

Most resumes are rejected by an algorithm before a human ever sees them.
Applicant Tracking Systems stumble on two-column layouts, can't read
image-exported PDFs, miss keyword synonyms, and misparse dates — silently
discarding qualified candidates who never learn why they were filtered.
Existing "resume checkers" are paywalled, cloud-hungry, and optimised to
upsell rather than tell the truth.

## The Solution

FED-Indeed is an open-source, local-first Streamlit app that simulates the
machine's side of hiring. A job seeker uploads a PDF resume and pastes a job
description; the app shows exactly what a deterministic ATS parser extracts,
scores keyword alignment, and flags structural failure modes — with concrete
fixes for each.

## Core Capabilities (v0.2.0)

- **Aggressive PDF extraction** via pdfplumber, emulating line-by-line ATS
  readers.
- **ATS Compatibility Rating** — TF-weighted keyword coverage with
  Safe / Borderline / High-Risk bands against common ~75% filter thresholds.
- **Skill aliases** (`k8s → kubernetes`, `postgres → postgresql`) and
  **suffix stemming** (`pipelines ↔ pipeline`) so surface-form differences
  stop costing matches.
- **Composite grade** — `0.6 × keyword + 0.25 × structure + 0.15 × timeline`
  sub-scores rolled into an A–F grade.
- **Structural checks** — flat-image detection, multi-column scrambling
  alerts, timeline date validation.
- **Raw Text Stream** — the literal internal string capture, shown verbatim.
- **Keyword Matrix** — the JD's top-20 terms, matched vs. missing, with a
  one-click JSON report export.
- **Zero persistence** — everything in session memory; nothing leaves the
  user's machine.

## What Makes It Different

| Typical commercial checker | FED-Indeed |
|---|---|
| Vanity score behind a paywall | Honest, explainable score; free (MIT) |
| Uploads your resume to their cloud | Runs locally; nothing stored, ever |
| Hides what the machine read | Shows the raw extraction stream |
| Sells resume rewrites | Points at the exact failure + fix |

## How It's Built

Single-file Streamlit app (`app.py`) + pdfplumber. No database, no accounts,
no telemetry — see [ADR.md](ADR.md) for the reasoning. Optional LLM semantic
features are user-keyed templates in [prompts/](prompts/).

## Status & Direction

v0.2.0 shipped the core audit plus the upgraded engine. [ROADMAP.md](ROADMAP.md) sequences the rest:
fuzzy matching and contact validation next, then weighted
required-vs-preferred scoring, skill-tenure extraction, and section-aware
parsing.

## Who It's For

Job seekers who are qualified but invisible to filters; career coaches who
want a demonstrable teaching tool; and developers who want to contribute to
a genuinely privacy-respecting utility.

## Quick Facts

- **License:** MIT ([LICENSE](LICENSE), [COPYING.md](COPYING.md))
- **Stack:** Python 3.8+ · Streamlit · pdfplumber
- **Run it:** `streamlit run app.py` after `pip install -r requirements.txt`
- **Contribute:** [CONTRIBUTING.md](CONTRIBUTING.md) ·
  **Support:** [SUPPORT.md](SUPPORT.md)
