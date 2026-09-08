# The FED-Indeed Website (GitHub Pages)

This folder powers the project website at `https://YOUR_USERNAME.github.io/FED-Indeed/`.

## Enable it in 30 seconds

1. Push this repo to GitHub (branch `main`, with `docs/` included).
2. Open **Settings → Pages** on the repo.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Branch: **main** · Folder: **/docs** · Save.
5. Wait ~1 minute, then visit `https://YOUR_USERNAME.github.io/FED-Indeed/`.

GitHub will re-publish automatically every time `main` updates.

## What's inside

| Path | Purpose |
|---|---|
| `index.html` | The single-page landing site (hero, live demo, docs links) |
| `assets/css/styles.css` | The dark "machine scan" design system |
| `assets/js/engine.js` | JS port of the v0.2.0 scoring engine (zero DOM deps, also loadable in Node) |
| `assets/js/main.js` | Landing-page interactivity + demo UI wiring |
| `assets/img/social-image.png` | Open Graph / social preview image |
| `assets/img/favicon.svg` | Browser-tab icon (⌖ glyph) |
| `tests/engine_crosscheck.js` | Proves the JS port matches Python (run `node docs/tests/engine_crosscheck.js`) |
| `.nojekyll` | Tells GitHub Pages to skip Jekyll processing |

## Honesty note

The browser demo runs the **same scoring logic** as the app — but on pasted
text, not PDFs. The real app parses PDFs with pdfplumber. The engine port is
verified against the Python original by `tests/engine_crosscheck.js`, which
compares score, matched keywords, missing keywords, and date extraction on
identical inputs.

## Local preview

```bash
cd docs
python3 -m http.server 8080
# → http://localhost:8080
```

## LICENSE

Site content is MIT-licensed, same as the project (`../LICENSE`).
