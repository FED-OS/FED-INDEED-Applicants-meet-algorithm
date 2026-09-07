# Contributing to FED-Indeed

Thank you for helping job seekers see what the machines see. Every
contribution — code, docs, bug reports, or ideas — moves the mission forward.

## 🧭 Ground Rules

- Be kind and constructive. The [Code of Conduct](CODE_OF_CONDUCT.md) applies
  to every interaction in this repository.
- Keep contributions privacy-first: **never commit real resumes or personal
  data**, including in tests, screenshots, or issue reports.
- Remember the project philosophy: deterministic, dependency-light,
  local-first. Proposals that add heavy cloud dependencies will need strong
  justification.

## 🪜 Getting Started

1. **Fork & clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/FED-Indeed.git
   cd FED-Indeed
   ```

2. **Set up an environment** — see [INSTALL.md](INSTALL.md) for full details.

   ```bash
   python -m venv venv && source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Run the app locally**

   ```bash
   streamlit run app.py
   ```

4. **Pick an issue** — [`good first issue`](https://github.com/YOUR_USERNAME/FED-Indeed/labels/good%20first%20issue)
   and [`help wanted`](https://github.com/YOUR_USERNAME/FED-Indeed/labels/help%20wanted)
   labels mark tasks ready for contributors.

## 🛠️ Development Workflow

We follow the standard GitHub flow:

1. Create a feature branch from `main`:
   `git checkout -b feat/my-check-name`
2. Make your changes, keeping commits focused and messages descriptive
   (`feat: add contact-info validation check`).
3. Test manually: upload a **synthetic** PDF resume and paste a sample job
   description; verify your change renders correctly and doesn't regress the
   score, keyword matrix, or structural checks.
4. Push and open a Pull Request using the
   [PR template](.github/PULL_REQUEST_TEMPLATE.md).

### Branch naming

- `feat/...` — new functionality
- `fix/...` — bug fixes
- `docs/...` — documentation
- `refactor/...` — internal improvements
- `test/...` — test additions

### Code style

- Python 3.8+ compatible, PEP 8 layout, descriptive names.
- Comments explain *why*, especially in the parser heuristics — the ATS
  simulation logic is the heart of this project.
- UI strings should stay plain and readable; the app targets non-technical
  job seekers.
- If your change touches visuals, prefer editing `styles.css` over inlining
  styles in `app.py`.

## 🧩 What to Contribute

**Parser heuristics** — new structural checks (contact-info detection,
graphics-to-text ratio, section detection). See [ROADMAP.md](ROADMAP.md).

**Scoring improvements** — weighted required-vs-preferred matching, fuzzy /
stemmed keyword matching, skill-tenure extraction.

**UI/UX** — clearer dashboards, accessibility, translations.

**Tests** — synthetic PDF fixtures (generated, never real people's data).

**Docs & wiki** — the `wiki/` folder is plain Markdown; improvements there
are as valuable as code.

## 🐛 Reporting Bugs

Open a [bug report](https://github.com/YOUR_USERNAME/FED-Indeed/issues/new?template=bug_report.md)
and include the environment details the template asks for. If your bug
involves a specific resume, **redact all personal information first** or use
a synthetic sample.

## ✅ Review Process

Maintainers review PRs within a few days. Reviews focus on correctness of
the ATS simulation, privacy guarantees, and clarity for end users. Small,
focused PRs get merged fastest.

Thanks for building a fairer job market with us. 🎉
