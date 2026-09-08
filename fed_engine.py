# FED-Indeed — fed_engine.py
# The scoring engine, refactored out of app.py in v0.2.0 so it can be
# unit-tested (tests/test_engine.py) and parity-checked against the browser
# port (docs/assets/js/engine.js via docs/tests/engine_crosscheck.js).
#
# v0.2.0 upgrades over v0.1.0:
#   1. Skill aliases   — "k8s" matches "kubernetes", "ts" matches "typescript"
#   2. Suffix stemming — "pipelines" matches "pipeline", "managing" matches
#                        "managed" (deterministic rules, applied to BOTH sides
#                        so parity is provable)
#   3. TF-weighted score — a keyword mentioned 4x in the JD now carries more
#                        weight than one mentioned once (v0.1.0 was flat)
#   4. Sub-scores + grade — keyword / structure / timeline breakdown and an
#                        A–F composite grade
#
# Licensed under the MIT License. See LICENSE for details.

from __future__ import annotations

import re
from collections import Counter

__version__ = "0.2.0"

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

STOP_WORDS = {
    "the", "and", "a", "of", "to", "in", "is", "for", "with", "on",
    "an", "or", "at", "by", "from",
}

# Shorthand -> canonical skill name. Applied BEFORE the length filter and
# stemming, on both the resume and the JD side.
SKILL_ALIASES = {
    "k8s": "kubernetes",
    "postgres": "postgresql",
    "js": "javascript",
    "ts": "typescript",
    "nodejs": "node",
    "reactjs": "react",
    "vuejs": "vue",
    "nextjs": "next",
}

WORD_RE = re.compile(r"\b\w+\b")

DATE_RE = re.compile(
    r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\b"
    r"|\b\d{2}/\d{4}\b"
    r"|\bPresent\b",
    re.IGNORECASE,
)

TOP_N = 20


# ---------------------------------------------------------------------------
# Token pipeline: tokenize -> alias -> filter -> stem
# ---------------------------------------------------------------------------

def tokenize(text: str) -> list:
    """Split text into lowercase word tokens (same regex as v0.1.0)."""
    return WORD_RE.findall(str(text).lower())


def canonical(word: str) -> str:
    """Map shorthand forms to their canonical skill name."""
    return SKILL_ALIASES.get(word, word)


def stem(word: str) -> str:
    """Deterministic suffix stemmer.

    Rules are applied to BOTH the resume and the JD, so any two variants of
    the same word collapse onto the same stem and genuinely match:

        pipelines / pipeline        -> pipelin
        manages / managed / managing-> manag
        technologies / technology   -> technology
        services / service          -> servic

    Guard rails: acronyms of length <= 3 ("aws", "css", "k8s"-derived forms)
    and words ending in "ss"/"us"/"is" ("class", "status", "redis") are left
    untouched so brand/tech names never get mangled.
    """
    w = word
    if len(w) > 4 and w.endswith("ies"):
        w = w[:-3] + "y"                      # technologies -> technology
    elif len(w) > 4 and (w.endswith("sses") or w.endswith("ses")):
        w = w[:-2]                            # classes -> class
    elif len(w) > 3 and w.endswith("s") and not w.endswith(("ss", "us", "is")):
        w = w[:-1]                            # pipelines -> pipeline
    if len(w) > 5 and w.endswith("ing"):
        w = w[:-3]                            # managing -> manag(e)
    elif len(w) > 4 and w.endswith("ed"):
        w = w[:-2]                            # managed -> manag(e)
    if len(w) > 4 and w.endswith("e"):
        w = w[:-1]                            # manage -> manag
    return w


def resume_stem_set(text: str) -> set:
    """Set of stems for every token in the resume (aliases applied)."""
    return {stem(canonical(w)) for w in tokenize(text)}


def find_dates(text: str) -> list:
    """Chronological milestones an ATS timeline parser would latch onto."""
    return DATE_RE.findall(str(text))


# ---------------------------------------------------------------------------
# JD keyword extraction (v0.1.0 behaviour + canonical/stem upgrades)
# ---------------------------------------------------------------------------

def top_keywords(jd_text: str, limit: int = TOP_N) -> list:
    """Rank the JD's tracked keywords.

    Returns a list of dicts (ranked, stable ties like v0.1.0):
        {"stem": ..., "surface": ..., "count": ...}

    ``surface`` is the first-seen original spelling — used for display —
    while matching happens on ``stem``.
    """
    words = tokenize(jd_text)
    counts = Counter()
    surface = {}

    for w in words:
        c = canonical(w)
        if c in STOP_WORDS or len(c) <= 2:
            continue
        s = stem(c)
        counts[s] += 1
        if s not in surface:
            surface[s] = w

    # Counter.most_common keeps insertion order on ties (Python 3.7+),
    # exactly like v0.1.0.
    ranked = counts.most_common(limit)
    return [
        {"stem": s, "surface": surface[s], "count": n} for s, n in ranked
    ]


# ---------------------------------------------------------------------------
# Scoring
# ---------------------------------------------------------------------------

def band_of(score: float) -> str:
    """Same thresholds as v0.1.0."""
    if score >= 75:
        return "safe"
    if score >= 50:
        return "border"
    return "risk"


def grade_of(composite: float) -> str:
    """A–F letter grade for the composite (weighted sub-score) result."""
    if composite >= 85:
        return "A"
    if composite >= 70:
        return "B"
    if composite >= 55:
        return "C"
    if composite >= 40:
        return "D"
    return "F"


def audit(resume_text: str, jd_text: str, layout_anomaly: bool = False) -> dict:
    """Run the full v0.2.0 audit on plain-text inputs.

    ``layout_anomaly`` is supplied by the caller (app.py detects it while
    parsing the PDF with pdfplumber) — the engine itself only scores text.
    """
    resume_text = str(resume_text)
    jd_text = str(jd_text)

    tracked = top_keywords(jd_text)
    r_stems = resume_stem_set(resume_text)

    total_w = sum(k["count"] for k in tracked)
    matched_w = sum(k["count"] for k in tracked if k["stem"] in r_stems)

    # --- keyword score: TF-weighted coverage of the tracked keywords -----
    keyword_score = (matched_w / total_w) * 100 if total_w else 0.0

    matched = [k["surface"] for k in tracked if k["stem"] in r_stems]
    missing = [k["surface"] for k in tracked if k["stem"] not in r_stems]

    # --- alias assist: shorthand in the resume that still matched ---------
    alias_hits = []
    seen_aliases = set()
    for w in tokenize(resume_text):
        if w in SKILL_ALIASES:
            s = stem(SKILL_ALIASES[w])
            if any(k["stem"] == s for k in tracked) and s in r_stems:
                key = (w, SKILL_ALIASES[w])
                if key not in seen_aliases:
                    seen_aliases.add(key)
                    alias_hits.append({"alias": w, "canonical": SKILL_ALIASES[w]})

    # --- structural + timeline sub-scores ----------------------------------
    resume_len = len(resume_text.strip())
    dates = find_dates(resume_text)

    is_ghost = resume_len < 150

    if is_ghost:
        structure_score = 0.0
    elif layout_anomaly:
        structure_score = 45.0
    else:
        structure_score = 100.0

    if not is_ghost and len(dates) < 2 and structure_score > 0:
        structure_score -= 25.0

    timeline_score = min(len(dates) / 6.0, 1.0) * 100.0

    composite = round(
        0.6 * keyword_score + 0.25 * structure_score + 0.15 * timeline_score,
        1,
    )

    return {
        "version": __version__,
        "score": keyword_score,          # headline Match Index (TF-weighted)
        "band": band_of(keyword_score),
        "grade": grade_of(composite),
        "composite": composite,
        "keyword_score": round(keyword_score, 1),
        "structure_score": round(structure_score, 1),
        "timeline_score": round(timeline_score, 1),
        "matched": matched,
        "missing": missing,
        "matched_count": len(matched),
        "tracked_count": len(tracked),
        "alias_hits": alias_hits,
        "dates": dates,
        "date_count": len(dates),
        "resume_len": resume_len,
        "top": [{"surface": k["surface"], "count": k["count"]} for k in tracked],
    }
