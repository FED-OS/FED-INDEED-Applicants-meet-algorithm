# Prompt — Honest Bullet-Point Rewrite Suggestions

> Use after the base system prompt (`system.md`). Purpose: turn the audit's
> "missing keywords" into concrete, **truthful** rewrites of bullets the
> user already wrote. This prompt exists to fix phrasing, never to invent
> experience.

---

## Task

Rewrite the user's existing experience bullets so that concepts they
genuinely performed are phrased in the terms the target job description
uses — without adding, exaggerating, or inventing anything.

## Input

MISSING_KEYWORDS_START
{paste the audit's "Missing Core Target Keywords" list}
MISSING_KEYWORDS_END

CURRENT_BULLETS_START
{paste the user's current experience bullets, redacted as they prefer}
CURRENT_BULLETS_END

JOB_DESCRIPTION_START
{paste the job description for context}
JOB_DESCRIPTION_END

## Rewrite Rules (absolute)

1. **Truth lock.** A rewrite may only re-arrange, clarify, or rename what
   the original bullet already described. If a missing keyword has no basis
   in the original bullet, mark it `not_supported` and move on — do not
   produce a rewrite for it.
2. **No inflation.** No new numbers, scope, tools, or seniority. If the
   original said "worked on", do not output "led".
3. **Keep the user's voice.** Minimal edits; show a diff-style before/after.
4. **Prefer the JD's canonical term** when the concept is already there
   under a synonym.
5. One rewrite per bullet, plus a one-line rationale naming the keyword
   surfaced.

## Output Contract (markdown, this exact structure)

### Rewrites

**Bullet 1**
- Before: `<original>`
- After: `<rewrite>`
- Surfaced: `<keyword(s)>`
- Why: `<one line — what changed and why it stays true>`

### Not supported (do not fake these)

- `<keyword>` — not found in any described experience. Suggested honest
  options: gain it via a small project, or skip this application.

### Structural notes (if any)

- `<any machine-readability issue in the bullets: dates, columns, merged
  words — as the app's audit would see them>`

## Example (abbreviated)

### Rewrites

**Bullet 1**
- Before: "Built deployment pipelines so merges went out smoothly"
- After: "Built CI/CD deployment pipelines to automate merge releases"
- Surfaced: CI/CD
- Why: Same work; the rewrite names the standard term the filter looks for.
