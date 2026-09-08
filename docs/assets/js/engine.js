/* FED-Indeed — engine.js (v0.2.0 browser port)
 * The scoring engine used by the in-browser demo. A faithful port of
 * fed_engine.py (Python v0.2.0) — kept in lockstep by
 * docs/tests/engine_crosscheck.js, which runs BOTH engines on identical
 * inputs and fails CI if they ever disagree.
 *
 * v0.2.0 upgrades: skill aliases, suffix stemming, TF-weighted scoring,
 * sub-scores + letter grade. UMD wrapper: leaks only window.FEDEngine.
 */
(function (root, factory) {
  "use strict";
  var FEDEngine = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = FEDEngine; }
  else if (root) { root.FEDEngine = FEDEngine; }
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var VERSION = "0.2.0";

  var STOP_WORDS = new Set([
    "the", "and", "a", "of", "to", "in", "is", "for", "with", "on",
    "an", "or", "at", "by", "from"
  ]);

  // Shorthand -> canonical skill name (applied to BOTH sides before stemming)
  var SKILL_ALIASES = {
    k8s: "kubernetes",
    postgres: "postgresql",
    js: "javascript",
    ts: "typescript",
    nodejs: "node",
    reactjs: "react",
    vuejs: "vue",
    nextjs: "next"
  };

  var WORD_RE = /\b\w+\b/g;

  var DATE_RE = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\b|\b\d{2}\/\d{4}\b|\bPresent\b/gi;

  var TOP_N = 20;

  // ---- token pipeline: tokenize -> alias -> filter -> stem ----------------

  function tokenize(text) {
    return String(text).toLowerCase().match(WORD_RE) || [];
  }

  function canonical(word) {
    return Object.prototype.hasOwnProperty.call(SKILL_ALIASES, word)
      ? SKILL_ALIASES[word]
      : word;
  }

  function stem(w) {
    /* Deterministic suffix stemmer — rules mirror fed_engine.stem() exactly.
     * Acronyms (<=3) and ss/us/is words are guarded so tech names never
     * get mangled. */
    if (w.length > 4 && /ies$/.test(w)) {
      w = w.slice(0, -3) + "y";                    // technologies -> technology
    } else if (w.length > 4 && /(sses|ses)$/.test(w)) {
      w = w.slice(0, -2);                          // classes -> class
    } else if (w.length > 3 && /s$/.test(w) && !/(ss|us|is)$/.test(w)) {
      w = w.slice(0, -1);                          // pipelines -> pipeline
    }
    if (w.length > 5 && /ing$/.test(w)) {
      w = w.slice(0, -3);                          // managing -> manag
    } else if (w.length > 4 && /ed$/.test(w)) {
      w = w.slice(0, -2);                          // managed -> manag
    }
    if (w.length > 4 && /e$/.test(w)) {
      w = w.slice(0, -1);                          // manage -> manag
    }
    return w;
  }

  function resumeStemSet(text) {
    var out = new Set();
    var words = tokenize(text);
    for (var i = 0; i < words.length; i++) {
      out.add(stem(canonical(words[i])));
    }
    return out;
  }

  function findDates(text) {
    return String(text).match(DATE_RE) || [];
  }

  // ---- JD keyword extraction ----------------------------------------------

  function topKeywords(jdText, limit) {
    var words = tokenize(jdText);
    var counts = new Map();   // stem -> count (insertion order = first seen)
    var surface = new Map();  // stem -> first-seen original spelling

    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      var c = canonical(w);
      if (STOP_WORDS.has(c) || c.length <= 2) continue;
      var s = stem(c);
      counts.set(s, (counts.get(s) || 0) + 1);
      if (!surface.has(s)) surface.set(s, w);
    }

    var entries = Array.from(counts.entries());
    // Count-descending; Array.prototype.sort is stable (ES2019), so ties keep
    // first-seen order — same as Python Counter.most_common().
    entries.sort(function (a, b) { return b[1] - a[1]; });
    if (typeof limit !== "number") limit = TOP_N;

    return entries.slice(0, limit).map(function (e) {
      return { stem: e[0], surface: surface.get(e[0]), count: e[1] };
    });
  }

  // ---- scoring --------------------------------------------------------------

  function bandOf(score) {
    if (score >= 75) return "safe";
    if (score >= 50) return "border";
    return "risk";
  }

  function gradeOf(composite) {
    if (composite >= 85) return "A";
    if (composite >= 70) return "B";
    if (composite >= 55) return "C";
    if (composite >= 40) return "D";
    return "F";
  }

  function r1(x) { return Math.round(x * 10) / 10; }

  function audit(resumeText, jdText, layoutAnomaly) {
    resumeText = String(resumeText == null ? "" : resumeText);
    jdText = String(jdText == null ? "" : jdText);

    var tracked = topKeywords(jdText);
    var rStems = resumeStemSet(resumeText);

    var totalW = 0, matchedW = 0;
    var matched = [], missing = [];
    var i, k;

    for (i = 0; i < tracked.length; i++) {
      k = tracked[i];
      totalW += k.count;
      if (rStems.has(k.stem)) {
        matchedW += k.count;
        matched.push(k.surface);
      } else {
        missing.push(k.surface);
      }
    }

    var keywordScore = totalW > 0 ? (matchedW / totalW) * 100 : 0.0;

    // alias assist: shorthand in the resume that matched a tracked canonical
    var aliasHits = [];
    var seenAliases = new Set();
    var rWords = tokenize(resumeText);
    for (i = 0; i < rWords.length; i++) {
      var w = rWords[i];
      if (Object.prototype.hasOwnProperty.call(SKILL_ALIASES, w)) {
        var s2 = stem(SKILL_ALIASES[w]);
        var trackedHit = false;
        for (var j = 0; j < tracked.length; j++) {
          if (tracked[j].stem === s2) { trackedHit = true; break; }
        }
        if (trackedHit && rStems.has(s2)) {
          var key = w + "|" + SKILL_ALIASES[w];
          if (!seenAliases.has(key)) {
            seenAliases.add(key);
            aliasHits.push({ alias: w, canonical: SKILL_ALIASES[w] });
          }
        }
      }
    }

    // structural + timeline sub-scores
    var resumeLen = resumeText.trim().length;
    var dates = findDates(resumeText);
    var isGhost = resumeLen < 150;

    var structureScore;
    if (isGhost) structureScore = 0.0;
    else if (layoutAnomaly) structureScore = 45.0;
    else structureScore = 100.0;

    if (!isGhost && dates.length < 2 && structureScore > 0) {
      structureScore -= 25.0;
    }

    var timelineScore = Math.min(dates.length / 6, 1) * 100;

    var composite = r1(0.6 * keywordScore + 0.25 * structureScore + 0.15 * timelineScore);

    return {
      version: VERSION,
      score: keywordScore,
      band: bandOf(keywordScore),
      grade: gradeOf(composite),
      composite: composite,
      keyword_score: r1(keywordScore),
      structure_score: r1(structureScore),
      timeline_score: r1(timelineScore),
      matched: matched,
      missing: missing,
      matched_count: matched.length,
      tracked_count: tracked.length,
      alias_hits: aliasHits,
      dates: dates,
      date_count: dates.length,
      resume_len: resumeLen,
      top: tracked.map(function (t) { return { surface: t.surface, count: t.count }; })
    };
  }

  return {
    VERSION: VERSION,
    STOP_WORDS: STOP_WORDS,
    SKILL_ALIASES: SKILL_ALIASES,
    tokenize: tokenize,
    canonical: canonical,
    stem: stem,
    resumeStemSet: resumeStemSet,
    findDates: findDates,
    topKeywords: topKeywords,
    bandOf: bandOf,
    gradeOf: gradeOf,
    audit: audit
  };
});
