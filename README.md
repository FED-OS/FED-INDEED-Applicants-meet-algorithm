<div align="center">

<img src="social-image.png" alt="FED-Indeed banner — See what the AI sees" width="820"/>

# 📂 FED-Indeed

**Reverse-engineer the AI gatekeepers. See what they see, fix what they break.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.8+](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org)
[![Streamlit](https://img.shields.io/badge/UI-Streamlit-FF4B4B.svg)](https://streamlit.io)
[![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF.svg)](.github/workflows/build.yml)
[![Version](https://img.shields.io/badge/version-0.2.0-orange.svg)](CHANGELOG.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Website](https://img.shields.io/badge/website-GitHub_Pages-22d3ee.svg)](https://YOUR_USERNAME.github.io/FED-Indeed/)

**[🌐 Try the live in-browser demo →](https://YOUR_USERNAME.github.io/FED-Indeed/#demo)**

</div>

---

Most resumes are rejected by an algorithm before a human ever sees them.
Applicant Tracking Systems (ATS) stumble on layouts, miss keywords, scramble
multi-column designs, and misread dates — silently discarding qualified
candidates who never learn why.

**FED-Indeed gives you the same visibility the gatekeepers have.**

It is an open-source, local-first Streamlit app that simulates how corporate
ATS parsers read your resume against a job description. No cloud fees, no
data harvesting, no sign-up — just pure transparency for job seekers.

## ✨ What It Does

- **📄 Aggressive PDF Parsing** — extracts text exactly the way a
  deterministic ATS reader does, using [pdfplumber](https://github.com/jsvine/pdfplumber).
- **📊 ATS Compatibility Score** — Jaccard match index against the job
  description, colour-coded as *Safe Match*, *Borderline*, or *High Rejection
  Risk*.
- **🛠️ Structural Health Checks**
  - *Image-document detection* — flags PDFs that are flat images
    (under 150 characters parsed → invisible to scanners).
  - *Multi-column alert* — detects side-by-side layouts that scramble
    reading order into nonsense strings.
  - *Timeline validation* — verifies machine-readable date patterns
    (`Month YYYY`, `MM/YYYY`, `Present`).
- **🎯 Keyword Matrix** — shows exactly which high-value JD terms you matched
  and which ones you're missing.
- **🔒 Privacy-first** — everything runs in session memory. Nothing is saved,
  logged, or transmitted anywhere.

## 🚀 Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/FED-Indeed.git
cd FED-Indeed
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
streamlit run app.py
```

Your browser opens at `http://localhost:8501`. Upload a PDF resume, paste a
job description, and watch the audit run live.

No install at all? **[Run the audit in your browser instead →](https://YOUR_USERNAME.github.io/FED-Indeed/#demo)** (same scoring engine, zero download).

Full setup details (including pipenv/conda variants): **[INSTALL.md](INSTALL.md)**
· Everyday usage: **[usage.md](usage.md)** · FAQ: **[FAQ.md](FAQ.md)**

## 📁 Repository Map

| Path | Purpose |
|---|---|
| `app.py` | The main Streamlit application |
| `styles.css` | Optional custom theme layer loaded by `app.py` |
| `requirements.txt` | Python dependencies |
| `prompts/` | Curated LLM prompt templates for optional semantic features |
| `wiki/` | Offline documentation wiki (methodology, ATS field guide) |
| `discussion/` | Community discussion threads and starter topics |
| `.github/` | Issue/PR templates, discussion guide, funding, CI workflow |

Meta-docs live at the root: [ROADMAP.md](ROADMAP.md) · [CHANGELOG.md](CHANGELOG.md) ·
[ADR.md](ADR.md) · [GOVERNANCE.md](GOVERNANCE.md) · [SUPPORT.md](SUPPORT.md) ·
[SECURITY.md](SECURITY.md) · [PRICING.md](PRICING.md) · [CITATIONS.md](CITATIONS.md)

## 🧪 Example Session

1. **Score gauge + grade badge** — your match percentage, colour-coded band,
   and an A–F composite grade with sub-score bars (keyword / structure /
   timeline).
2. **Raw text stream** — exactly what the ATS extracts. You'll often spot
   merged words and scrambled columns here for the first time.
3. **Keyword matrix** — matched vs. missing high-value terms, TF-weighted,
   with `k8s` → `kubernetes` style alias hits flagged.
4. **Structural alerts** — e.g. *"❌ Multi-column spacing detected"* or
   *"⚠️ Timeline parsing alert"* with fix instructions.
5. **Exportable report** — one-click JSON download of the full audit.

## 🛠️ How to Contribute

We welcome contributions of every size — bug reports, new parser heuristics,
UI polish, tests, and docs. Read **[CONTRIBUTING.md](CONTRIBUTING.md)** to get
started, and our **[Code of Conduct](CODE_OF_CONDUCT.md)** applies to all
interaction in this project.

Quick wins for first-time contributors are labelled
[`good first issue`](https://github.com/YOUR_USERNAME/FED-Indeed/labels/good%20first%20issue).

## 📦 Deploy Your Own (Free)

Because FED-Indeed stores nothing, it's safe to host publicly on
[Streamlit Community Cloud](https://streamlit.io/cloud) — connect your fork,
deploy with default settings, and share the link. See
[DEPLOYMENT.md](DEPLOYMENT.md).

## 🗺️ Roadmap Highlights

~~Fuzzy / stemmed matching~~ · ~~skill aliases~~ ✅ **shipped in v0.2.0** —
next up: weighted required-vs-preferred scoring · skill-tenure extraction ·
contact-info validation · action-verb analysis · batch multi-JD comparison.
Full plan: [ROADMAP.md](ROADMAP.md).

## 📜 License

[MIT](LICENSE) — free to use, modify, and distribute. See [NOTICE.md](NOTICE.md)
for third-party attribution.

FED-Indeed is not affiliated with Indeed or any ATS vendor; all names are
used for nominative, descriptive purposes only.

## ❤️ Support the Project

<a href='https://ko-fi.com/YOUR_USERNAME' target='_blank'>
    <img height='36' style='border:0px;height:36px;' src='https://ko-fi.com/img/githubbutton_sm.svg' border='0' alt='Buy Me a Coffee at ko-fi.com' />
</a>

If FED-Indeed helped you land an interview, a small coffee keeps the scans
free for everyone. 🙏

---

*Inspired by the countless job seekers ghosted by algorithms. Built to level
the playing field.* 🎉
