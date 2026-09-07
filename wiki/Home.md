# FED-Indeed Wiki — Home

Welcome to the offline wiki. It mirrors the key knowledge of the project in
plain Markdown — no GitHub wiki lock-in, just files in the repo.

**New here?** Read [SUMMARY.md](../SUMMARY.md) for the 2-minute project
pitch, then [usage.md](../usage.md) to run your first audit.

## Pages

| Page | What it covers |
|---|---|
| [How-It-Works](How-It-Works.md) | The pipeline: upload → parse → clean → score → render |
| [Scoring-Methodology](Scoring-Methodology.md) | The match index, thresholds, and their honest limits |
| [ATS-Field-Guide](ATS-Field-Guide.md) | How corporate parsers actually fail resumes — the field notes behind every check |
| [Troubleshooting](Troubleshooting.md) | Install/runtime problems and their fixes |
| [Adding-New-Checks](Adding-New-Checks.md) | Contributor guide: writing a new heuristic, end to end |

## The Short Version of Everything

FED-Indeed extracts your PDF the way a line-by-line ATS parser does, scores
the overlap between your resume's terms and the job description's
high-value keywords, and flags the structural landmines (image-only
exports, multi-column layouts, machine-unreadable dates) that get
applications silently discarded. Everything runs in your browser session's
memory; nothing is stored or sent anywhere.

## Conventions

- Pages are plain Markdown, links are relative.
- Factual claims about ATS behaviour are labelled *field observation* vs
  *vendor-documented* where the evidence differs.
- The wiki documents **shipped behaviour**; future work belongs in
  [ROADMAP.md](../ROADMAP.md).

## Contributing to the Wiki

Wiki improvements are PRs like any other (`docs/…` branch). Typos and
clarifications are always welcome; new pages should be linked from this
Home and referenced in the relevant docs.
