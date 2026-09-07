# FED-Indeed — Prompt Templates

This folder holds the prompt templates for FED-Indeed's **optional** semantic
features. Per [ADR-0003](../ADR.md), these are strictly opt-in, user-keyed,
and never required for the core scanner to run.

## Ground Rules for Every Prompt

1. **Privacy by instruction.** Prompts must instruct the model to treat the
   pasted content as confidential and to never output personal data it
   contains.
2. **No fabrication.** Outputs suggest rephrasings of what the user *already
   did* — never invent experience, skills, or titles. The assistant's job is
   translation, not inflation. Interviews verify everything.
3. **Deterministic shape.** Templates use explicit output contracts (JSON
   schemas or fixed headings) so the app can parse responses without
   surprises.
4. **Model-agnostic.** Written for any competent chat/completion model; no
   vendor-specific function-call syntax in the core prompts.
5. **Never auto-executed.** The app never calls an LLM silently; the user
   pastes into their own provider, or a future opt-in integration uses their
   own key.

## Contents

| File | Purpose |
|---|---|
| [system.md](system.md) | Base system prompt shared by all templates |
| [keyword_extraction.md](keyword_extraction.md) | Distill a JD into weighted required/preferred terms (feeds the Keyword Matrix) |
| [semantic_clusters.md](semantic_clusters.md) | Expand JD terms into synonym clusters ("CI/CD" ↔ "deployment pipelines") |
| [rewrite_suggestions.md](rewrite_suggestions.md) | Turn missing-keyword gaps into honest bullet-point rewrites |

## How to Use (Manual Flow, v0.1.x)

1. Run the normal audit in the app and note the **Missing Core Target
   Keywords** list.
2. Copy the relevant template (start with `rewrite_suggestions.md`) into
   your LLM of choice.
3. Paste your resume text and the job description where indicated.
4. Review the suggestions — accept only the ones that are **true** for you.
5. Re-run the audit in the app to see the score move.

## Contributing New Templates

Follow the ground rules above, keep them under ~400 words, and include an
example output shape. Open a PR with `docs:` or `feat:` prefix as
appropriate; template changes are reviewed like code.
