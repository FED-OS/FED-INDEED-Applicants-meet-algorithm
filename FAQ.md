# FAQ — FED-Indeed

## What is FED-Indeed?

An open-source, local-first Streamlit app that simulates how corporate ATS
(Applicant Tracking System) parsers read your resume against a job
description, so you can fix the mechanical problems that get applications
auto-rejected before a human ever looks at them.

## Does it send my resume anywhere?

No. Parsing happens in your Streamlit session's memory. There is no database,
no logging, no outbound upload. Close the tab and it's gone.

## Why "FED-Indeed"?

It's a playful mash-up: "fed" as in *fed up* with opaque filters, plus an
affectionate wink at the job board everyone loves to complain about. FED-Indeed
is **not** affiliated with Indeed — see [NOTICE.md](NOTICE.md).

## My score is 40% but I'm perfect for the job. Is it broken?

Probably not broken — probably phrasing. The matcher is keyword-based, so
exact synonyms ("ETL architecture" vs "data pipelines") count as misses. See
[prompts/rewrite_suggestions.md](prompts/rewrite_suggestions.md) and the
fuzzy-matching item on the [roadmap](ROADMAP.md). Also check the Structural
panel first: a scrambled parse depresses every downstream metric.

## What's a "good" score?

Modelled on common industry thresholds: **≥ 75%** clears most keyword
filters, **50–74%** is borderline, **< 50%** gets auto-filtered. Treat these
as directional, not gospel — every vendor configures differently.

## The app says my PDF is an image. What do I do?

Your design tool exported flat graphics instead of real text. Re-export as a
standard, text-selectable PDF (in Canva: share → PDF → "searchable text" if
offered; or rebuild in a word processor). Quick test: open the PDF and try to
select text with your mouse — if you can't, neither can an ATS.

## Why does it warn about two-column layouts?

Text extractors read left-to-right, line by line. With two columns, the left
half of one row merges with the right half, producing sentences like
"Built backend APIs Managed 5 marketing reports". Single-column layouts keep
reading order intact.

## My dates aren't being detected. Why?

The engine looks for `Month YYYY` (e.g., `March 2022`), `MM/YYYY`, and the
word `Present`. Styles like `2022 – now`, `Q1 2022`, or `March 22` aren't
matched in v0.2.0. Write out the full month and year.

## Does it support DOCX?

Not in v0.2.0 — PDF only. DOCX support is on the roadmap. Meanwhile, convert
with Word/LibreOffice's *export to PDF* (not print-to-image).

## Can I use this to mass-apply?

That's exactly the wrong lesson. FED-Indeed exists to stop *mechanical*
rejection; the keyword matrix works best when you use it to tailor 3–5
high-quality applications. Fabricating keywords you can't back up in an
interview will cost you the offer anyway.

## Is it really free? What's the catch?

MIT-licensed, no paid tier, no ads, no data monetization. The optional
semantic prompts in [prompts/](prompts/) run on *your* LLM API key if you
choose to use them — the core scanner needs no key. Full transparency in
[PRICING.md](PRICING.md).

## Can I deploy my own public instance?

Yes — it's stateless, so it's safe to share. Instructions in
[DEPLOYMENT.md](DEPLOYMENT.md).

## How accurate is the simulation compared to a real ATS?

It models the common heuristics (text extraction, keyword overlap,
readability structure, date parsing) but no open-source tool can replicate any
specific vendor's proprietary scoring. Treat it as a *stress test* that finds
the mechanical failure modes — it will catch the things that silently kill
applications, which is most of the battle.

## Who maintains it?

Volunteers — see [MAINTAINERS.md](MAINTAINERS.md). Contributions welcome via
[CONTRIBUTING.md](CONTRIBUTING.md).

## I found a bug. Where do I report it?

[Issues](https://github.com/YOUR_USERNAME/FED-Indeed/issues) with the bug
template. Security issues go through [SECURITY.md](SECURITY.md) instead.
