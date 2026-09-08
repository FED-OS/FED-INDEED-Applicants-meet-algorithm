# Citations

If FED-Indeed helped your research, tooling, or job search, citations are
appreciated but never required (MIT License — see [LICENSE](LICENSE)).

## Preferred Citation (BibTeX)

```bibtex
@software{fed_indeed,
  author = {{FED-Indeed contributors}},
  title  = {FED-Indeed: An Open-Source Reverse ATS Scanner},
  year   = {2026},
  url    = {https://github.com/YOUR_USERNAME/FED-Indeed},
  note   = {Version 0.2.0, MIT License}
}
```

## Short Form

> FED-Indeed contributors. *FED-Indeed: An Open-Source Reverse ATS Scanner.*
> https://github.com/YOUR_USERNAME/FED-Indeed (v0.2.0), 2026. MIT License.

## Academic Lineage — Ideas This Project Builds On

The heuristics modelled in FED-Indeed stand on prior, openly published work.
We cite concepts rather than code — the implementations here are original
and minimal by design:

- **Jaccard, P. (1901).** *Étude comparative de la distribution florale dans
  une portion des Alpes et des Jura.* Bulletin de la Société Vaudoise des
  Sciences Naturelles 37:547–579 — the set-overlap measure behind the match
  index.
- **Porter, M. F. (1980).** *An algorithm for suffix stripping.* Program
  14(3):130–137 — the stemming approach planned for fuzzy matching
  ([ROADMAP.md](ROADMAP.md)).
- **Levenshtein, V. I. (1966).** *Binary codes capable of correcting
  deletions, insertions, and reversals.* Soviet Physics Doklady 10:707–710 —
  edit-distance matching considered for keyword fuzzing.
- **Manning, C., Raghavan, P., & Schütze, H. (2008).** *Introduction to
  Information Retrieval.* Cambridge University Press — the TF-IDF and
  retrieval background that contextualises keyword-overlap scoring.

## Software & Standards Referenced

- **Streamlit** — Apache-2.0 — https://github.com/streamlit/streamlit
- **pdfplumber** — MIT — https://github.com/jsvine/pdfplumber
- **pdfminer.six** — MIT — https://github.com/pdfminer/pdfminer.six
- **Keep a Changelog 1.1.0** — https://keepachangelog.com
- **SemVer 2.0.0** — https://semver.org
- **Contributor Covenant 2.1** — https://www.contributor-covenant.org
- **Common Community Standards (GitHub)** — the README/Code-of-Conduct/
  Contributing/Security/Support/License/PR-Issue-template set that this
  repository implements.

## Suggested Research Topics

If you study algorithmic hiring, FED-Indeed's transparent heuristics may be
useful as a baseline simulation of ATS parsing behaviour. We welcome
pointers to your work — open a Discussion so it can be linked here.
