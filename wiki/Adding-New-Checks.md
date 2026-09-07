# Adding New Checks — Contributor Guide

A parser heuristic ("check") is the atomic unit of FED-Indeed's value. This
guide walks a new check from idea to merged PR. Estimated reading: 10
minutes; a first check typically takes an hour including testing.

## What Counts as a Check

A deterministic, dependency-free function over the *parsed artifacts* —
`raw_extracted_text`, the positioned `words`, or both — producing:

- a **verdict** (pass / warn / fail),
- a **message** explaining the machine's perspective, and
- a **fix** the user can act on.

Existing examples: image-document (< 150 chars), multi-column (back-jumps
> 3), timeline (< 2 date matches). See
[How-It-Works](How-It-Works.md#stage-4--structural-checks).

## The Rules

1. **Stdlib + pdfplumber only.** New dependencies require an ADR-level
   discussion ([GOVERNANCE.md](../GOVERNANCE.md#decision-ladder)).
2. **Honest output.** Checks report what a parser would do, not what a user
   hopes to hear ([ADR-0005](../ADR.md#adr-0005-simulate-the-parser-dont-flatter-the-user)).
3. **No persistence, no network.** A check touches session memory only.
4. **Explain the why.** Every warning message names the failure mode in
   plain language and tells the user how to fix it.
5. **Tunable constants.** Thresholds (like `150`, `3`, `2`) go in clearly
   named constants with a comment on their field basis — they *will* be
   tuned as reports come in.

## The Recipe

### 1. Ground the problem in field reality

Why would a real filter care? Cite vendor docs, practitioner reports, or a
reproducible parse you can demo. If you can't articulate the *machine's*
reason, it's a style opinion, not a check — and style opinions belong in
the wiki's guidance, not the engine.

### 2. Write the pure function

```python
def check_contact_info(raw_text: str) -> dict:
    """Verdict on email/phone/LinkedIn presence.

    Field basis: ATS ingest maps structured contact fields early;
    profiles without extractable contact info are commonly discarded
    before ranking.
    """
    CONTACT_CHECKS = {
        "email": EMAIL_RE,
        "phone": PHONE_RE,
        "linkedin or portfolio": SOCIAL_RE,
    }
    found = [name for name, pat in CONTACT_CHECKS.items() if pat.search(raw_text)]
    if len(found) == len(CONTACT_CHECKS):
        return {"verdict": "pass", "message": "✅ Contact info fully parseable.", "found": found}
    missing = [n for n in CONTACT_CHECKS if n not in found]
    return {
        "verdict": "fail",
        "message": f"❌ Contact extraction risk: no machine-readable {'/'.join(missing)}. "
                   "Filters may discard profiles without parseable contact fields.",
        "found": found,
    }
```

Pure function: string/words in, dict out. No Streamlit calls inside the
check — that keeps it testable and (per the refactor track) portable when
logic moves out of `app.py`.

### 3. Wire it into the UI

In the Structural Readability panel, call the check and route the verdict
through `st.success` / `st.warning` / `st.error`, respecting priority order
(fatal image check first, then columns, then the rest). One check, one UI
block — don't mix verdicts into a single paragraph.

### 4. Test with synthetic fixtures

Create a synthetic PDF per outcome (pass / warn / fail) — generate them
with a word processor or a tiny script; **never use real people's
resumes**, including your own redacted one (policy, and you'll thank us
when the repo gets popular). Verify the verdict for each fixture, plus one
edge case (e.g., email in a header line).

### 5. Update the three docs

- `wiki/ATS-Field-Guide.md` — the field note behind your check
- `wiki/How-It-Works.md` — one line in the Stage 4 list
- `usage.md` / `FAQ.md` — the user-facing meaning, if non-obvious
- `CHANGELOG.md` — Unreleased → Added

### 6. Open the PR

Follow the template's constraints section honestly (a check that adds
persistence or network calls will be declined on sight) and describe your
synthetic verification in the details field.

## Good First Checks (from the roadmap)

- Contact-info validation (regex trio — the example above is 80% of it)
- Graphics-to-text ratio (count image objects vs. text objects per page
  via pdfplumber's `page.images` / `page.chars`)
- Action-verb density (verb lexicon count per bullet)

## Review Criteria Maintainers Apply

Field grounding · verdict honesty · message clarity · tunable constants ·
synthetic-tested · no new deps. That's the whole rubric — meet it and the
PR is fast.
