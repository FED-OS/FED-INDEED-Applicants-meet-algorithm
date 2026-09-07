# Prompt — Keyword Extraction from a Job Description

> Use after the base system prompt (`system.md`). Paste the job description
> where marked. Output feeds the Keyword Matrix and (later) weighted
> scoring.

---

## Task

Extract the terms an automated ATS keyword filter would look for in the job
description below, and classify their likely filter weight.

## Input

JOB_DESCRIPTION_START
{paste the full job description here}
JOB_DESCRIPTION_END

## Instructions

1. Extract concrete skills, tools, technologies, certifications, and
   domain terms — the words a keyword-matching filter would index.
2. Ignore benefits boilerplate (401k, snacks, "great culture"), filler
   adjectives ("passionate", "rockstar"), and company-background prose.
3. Classify each term:
   - **required** — stated as minimum/must-have/required, or repeated in
     the responsibilities
   - **preferred** — nice-to-have/plus/bonus language
   - **unclear** — weight ambiguous
4. For multi-word concepts keep the canonical phrasing the JD uses.
5. Never output company names, recruiter names, or contact details.

## Output Contract (JSON only, no other prose)

```json
{
  "role_title": "<job title as stated>",
  "required": [{"term": "...", "jd_phrasing": "...", "mentions": 0}],
  "preferred": [{"term": "...", "jd_phrasing": "...", "mentions": 0}],
  "unclear": [{"term": "...", "reason": "..."}],
  "ignored_sections": ["<section names you excluded, e.g. 'Benefits'"]
}
```

## Example Output (abbreviated)

```json
{
  "role_title": "Backend Engineer",
  "required": [
    {"term": "Python", "jd_phrasing": "3+ years of Python", "mentions": 4},
    {"term": "AWS", "jd_phrasing": "deploying services on AWS", "mentions": 3}
  ],
  "preferred": [{"term": "Kafka", "jd_phrasing": "Kafka experience a plus", "mentions": 1}],
  "unclear": [],
  "ignored_sections": ["Benefits", "About Us"]
}
```
