# Prompt — Semantic Cluster Expansion

> Use after the base system prompt (`system.md`). Purpose: stop users losing
> keyword-matcher points to phrasing mismatches ("data pipelines" vs "ETL
> architecture") when they describe experience they genuinely have.

---

## Task

Expand each key term from the job description into its practical synonym
cluster — the alternate phrasings a keyword filter might or might not catch
— so the user can check whether their resume already covers the concept
under a different name.

## Input

JOB_DESCRIPTION_TERMS_START
{paste the required/preferred term list, e.g. output of keyword_extraction.md}
JOB_DESCRIPTION_TERMS_END

RESUME_EXCERPTS_START
{paste the user's experience bullets — they may redact employer names}
RESUME_EXCERPTS_END

## Instructions

1. For each JD term, list common alternate phrasings: synonyms, acronyms,
   expansions ("k8s" ↔ "Kubernetes"), and near-neighbor tool names *only
   when genuinely the same concept* (not adjacent-but-different tools).
2. Check the resume excerpts for any cluster member; mark covered terms.
3. For covered-but-phrased-differently terms, suggest the minimal honest
   edit that surfaces the JD's canonical term (e.g., "deployment pipelines"
   → "CI/CD pipelines"), **only if it stays truthful to the described
   work**.
4. For genuinely absent terms, say "not covered" — do not stretch
   semantics to invent a match. Adjacent ≠ equivalent; flag adjacency
   honestly as "partial, different tool/level".
5. No personal data in outputs.

## Output Contract (JSON only)

```json
{
  "clusters": [
    {
      "jd_term": "CI/CD",
      "synonyms": ["continuous integration", "continuous deployment", "deployment pipelines"],
      "status": "covered_differently" | "covered" | "partial" | "not_covered",
      "resume_phrasing": "<what the resume said, or null>",
      "suggested_edit": "<minimal truthful rewrite, or null>",
      "note": "<one line, e.g. 'adjacent tool, not equivalent'>"
    }
  ]
}
```

## Example (abbreviated)

```json
{
  "clusters": [
    {
      "jd_term": "CI/CD",
      "synonyms": ["continuous integration", "GitHub Actions", "deployment pipelines"],
      "status": "covered_differently",
      "resume_phrasing": "built deployment pipelines for merges",
      "suggested_edit": "built CI/CD deployment pipelines for merges",
      "note": "same concept, surfacing canonical term"
    },
    {
      "jd_term": "Kafka",
      "synonyms": ["event streaming", "Kinesis (adjacent)"],
      "status": "partial",
      "resume_phrasing": "used Kinesis for event streaming",
      "suggested_edit": null,
      "note": "adjacent tool, not equivalent — do not claim Kafka"
    }
  ]
}
```
