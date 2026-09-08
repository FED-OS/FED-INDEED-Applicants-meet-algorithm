# TODO — FED-Indeed Working List

The public, single-file backlog. Items are pulled into issues when someone
commits to them. Community priorities tracked at
[ROADMAP.md](ROADMAP.md) — this file is the working scratchpad.
Check items off; don't delete them (history is useful).

## 🔧 Before Public Launch

- [x] Eye-catching GitHub Pages website (`docs/` — hero, live JS demo of the
  engine, terminal, quickstart; cross-checked against Python)
- [ ] Enable GitHub Pages (Settings → Pages → main `/docs`) after push
- [ ] Global find-and-replace `YOUR_USERNAME` → actual GitHub handle
  (README, app.py ko-fi links, docs)
- [ ] Update `MAINTAINERS.md` and `SECURITY.md` with real contact email
- [ ] Add your entry in `AUTHORS.md`
- [ ] Push repo & enable Discussions + Issues
- [ ] Enable GitHub Security Advisories ("Report a vulnerability" button)
- [ ] Register the Ko-fi page and verify the button links
- [ ] First release: tag `v0.1.0`, publish GitHub Release with changelog

## ⚡ Quick Wins (Stage 1 — from ROADMAP)

- [ ] Contact-info validation (email / phone / LinkedIn regex + alert)
- [x] Fuzzy & stemmed keyword matching (Porter-style stemmer + alias map)
  → **shipped in v0.2.0** (`fed_engine.py`: stemmer + SKILL_ALIASES)
- [ ] User-adjustable pass threshold slider (60–85%)
- [ ] JD sectioning: ignore "Benefits" boilerplate in scoring

## 🧠 Next Up (Stage 2)

- [ ] Required vs. preferred keyword weighting
- [ ] Skill tenure extraction (skills ↔ nearest date ranges)
- [ ] Section-aware resume parsing (Work / Education / Skills buckets)

## 🛠️ Engineering Health (parallel track)

- [ ] Extract parsing/scoring logic out of `app.py` into modules
- [ ] Synthetic PDF fixtures + first pytest suite
- [ ] PyPI packaging (`fed-indeed` entry point)

## 📖 Docs & Community

- [ ] Add a 60-second demo GIF/Screencast to the README
- [ ] Draft CodeQL or bandit step if desired beyond current CI
- [ ] First Discussions welcome post (see `discussion/pinned/`)
- [ ] Cross-link from r/resume / r/cscareerquestions threads (read the
      self-promo rules first!)

## 💡 Parking Lot (needs an owner or a design discussion)

- [ ] Multi-JD batch comparison UX design
- [ ] DOCX input support
- [ ] Localization strategy (which language first?)
- [ ] Local-model synonym suggestion (fully offline semantic mode)

## ✅ Done (recent)

- [x] Project naming + branding (social-image.png)
- [x] Core audit engine: Jaccard index, layout/image/date checks
- [x] Community scaffolding (templates, CI, docs set)
