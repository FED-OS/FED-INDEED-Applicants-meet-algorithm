# ATS Field Guide

How automated resume filters actually reject people — the field notes
behind every FED-Indeed check. Written for job seekers; sourced from
vendor documentation, practitioner reports, and parsing behaviour we can
reproduce locally.

> Labels: **[D]** = vendor-documented behaviour · **[O]** = field
> observation from practitioner reports and reproducible parsing ·
> **[R]** = FED-Indeed reproduces this locally.

## The Four Mechanical Killers

### 1. The image-resume (ghost document)

Design tools can export "PDFs" that are really flat images — the text you
see is pixels, not characters. **[D]** Major ATS vendors extract near-zero
text from image-only documents; the profile registers as blank or
near-blank and is discarded before ranking.

- The mouse test: open your PDF, try to select the text. If nothing
  selects, neither can a parser. **[R]**
- FED-Indeed's check: under 150 parsed characters → fatal image alert.
- Fix: re-export with real, embedded text (word processors, LaTeX, or
  your design tool's text-PDF export), and run the mouse test.

### 2. The multi-column scramble

Parsers read left-to-right across the full page width. In a two-column
layout, the left half of row 1 merges with the right half of row 1:
"Built backend APIs" + "Managed 5 reports" →
"Built backend APIs Managed 5 reports". **[O]** **[R]**

- FED-Indeed's check: horizontal back-jumps in word positions →
  multi-column alert.
- Fix: single-column layouts. If you must keep columns, ensure each visual
  column is also a *separate text object stream* — but honestly, just go
  single-column. Recruiters' eyes like it too.

### 3. The unreadable timeline

Engines reconstruct your career from date patterns next to role blocks.
Novel formats — `2022 – now`, `Q1 '22`, `March 22` — frequently fail to
parse, and unparseable experience reads as *no verifiable experience*.
**[O]**

- FED-Indeed's check: regex for `Month YYYY`, `MM/YYYY`, `Present`; < 2
  matches → timeline alert.
- Fix: write out `March 2022 – Present`. Boring beats clever.

### 4. The keyword gap (and the synonym trap)

Filters index the JD's terms and check the resume for them — often
literally. "Data pipelines" doesn't match "ETL architecture". **[D]**
Keyword matching remains the backbone of mainstream screening. **[O]**
Acronym expansion (CRM ↔ Customer Relationship Management) is inconsistent
across vendors.

- FED-Indeed's check: the Keyword Matrix — matched vs. missing top terms.
- Fix: use the JD's canonical phrasing *for experience you actually have*
  (see the [rewrite prompt](../prompts/rewrite_suggestions.md)). Never
  paste keywords you can't defend in an interview — that trades a filter
  for a rejected background check of honesty at the interview stage.

## Things That Surprise People

- **Tables and text boxes** often collapse or drop entirely in parsing.
  **[O]** Prefer plain headed sections.
- **Headers/footers** — some parsers read them once; some read them per
  page; some ignore them. Contact info in a *header* can vanish entirely.
  **[O]** Put contact details in the body, top of page 1.
- **Fancy section titles** — "Where I've Made Magic" may not map to the
  parser's expected "Experience" section. Standard headings are safer. **[O]**
- **Fonts & ligatures** — exotic fonts or auto-ligatures can produce
  mangled tokens ("fi" ligature → "ﬁ"). Standard system fonts parse
  cleanest. **[O]**
- **Dates in graphics** (timeline visuals) are invisible. **[R]**

## The Honest Caveat

No open-source tool replicates any specific vendor's proprietary scoring —
anyone claiming otherwise is selling something. FED-Indeed reproduces the
*mechanical failure modes*, which are the ones you can actually fix. After
that, humans make the call, and no parser optimization substitutes for
being qualified and articulating it.

## Field Contribution

Observed a new mechanical failure mode? That's a bug report *and* a field
note — open an issue (or a Discussion under Ideas) with the behaviour and,
if possible, a synthetic reproduction. The best checks in this app came
from job seekers describing exactly how they got filtered.
