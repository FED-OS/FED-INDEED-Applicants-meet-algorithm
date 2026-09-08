/* ============================================================================
   FED-Indeed · docs/assets/js/main.js
   ----------------------------------------------------------------------------
   Landing-page interactivity + DOM wiring for the #demo section.
   The scoring engine itself lives in engine.js (zero-DOM, portable port of
   the fed_engine.py v0.2.0 logic) — cross-checked against Python in
   docs/tests/engine_crosscheck.js. This file only handles presentation.
   No network calls. No storage. 100% client-side — same promise as the app.
   ========================================================================== */
"use strict";

/* ---------------------------------------------------------------------------
   0. The engine (browser global from engine.js) + tiny helpers
--------------------------------------------------------------------------- */
/* engine.js already exposes window.FEDEngine and defines the engine functions
   (audit, cleanText, ...) at top level. Alias the namespace only — redeclaring
   `audit` here would collide with engine.js's global. */
const FEDEngine = (typeof window !== "undefined" && window.FEDEngine)
  ? window.FEDEngine
  : (typeof require !== "undefined" ? require("./engine.js") : null);

const $  = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

const REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ---------------------------------------------------------------------------
   1. SAMPLE DATA — synthetic, realistic, no real names
--------------------------------------------------------------------------- */
const SAMPLE_RESUME = `Jordan Reyes
San Francisco, CA · jordan.reyes@fastmail.com · (415) 555-0134

SUMMARY
Backend-leaning full-stack engineer with 6 years of software
engineering experience. I design and ship Python services, tune
Postgres schemas, and build React interfaces for data products
used at scale. Comfortable running k8s clusters and managing
production deploys.

EXPERIENCE
Senior Software Engineer — Northwind Labs          Mar 2021 – Present
Platform team, B2B analytics product. Own Python services processing
millions of events per day on AWS.
- Managed data pipelines feeding the analytics warehouse; cut
  pipeline freshness lag 40%
- Redesigned the Postgres schema; indexing and query tuning cut
  p95 latency 38%
- Built CI around Docker builds and zero-downtime deploys
- Ran incident response; debugging production issues with Grafana

Software Engineer — Brightpath Systems           Jun 2018 – Feb 2021
- Shipped REST APIs consumed by three partner teams
- Built internal analytics dashboards used by thousands of users

Junior Developer — Cedar Solutions               Aug 2016 – May 2018
- Maintained Django apps and wrote unit tests

SKILLS
Python · Django · FastAPI · React · TypeScript · JavaScript
Postgres · Docker · AWS · k8s · REST APIs · SQL · Git
Grafana · Prometheus · pandas · Airflow

EDUCATION
B.S. Computer Science — San Jose State University      2012 – 2016

LEADERSHIP
Mentored two interns to full-time offers. Volunteer teacher, CodePath SF.`;

const SAMPLE_JD = `Senior Full-Stack Engineer (Remote)

THE ROLE
Platform team, high-scale data product. The scope: design, ship, and
run Python services processing millions of events per day.

THE WORK
- Python services and event pipelines on AWS
- React and TypeScript interfaces for thousands of users
- PostgreSQL schema design, indexing, and query tuning
- Kafka streams feeding the analytics platform; Kafka reliability
  is core to the product
- GraphQL and REST APIs for partner teams
- Docker builds, Kubernetes deploys, observability, and CI pipelines
- Terraform modules for infrastructure provisioning; Terraform
  experience is required

REQUIREMENTS
- 5+ years software engineering experience
- Strong Python and TypeScript fundamentals
- Kafka fluency: own streaming reliability end to end
- GraphQL fluency: schema design for partner APIs
- Terraform fluency: all provisioning is Terraform-only
- Production Docker and Kubernetes experience
- Terraform for infrastructure provisioning
- Observability tooling and systems debugging skills
- Kafka and GraphQL experience in production

THE STACK
Python · TypeScript · React · PostgreSQL · Kafka · GraphQL ·
Docker · Kubernetes · Terraform · AWS`;

/* ---------------------------------------------------------------------------
   3. DEMO UI — tabs, run, render
--------------------------------------------------------------------------- */
const els = {
  resume: $("#demo-resume"),
  jd:     $("#demo-jd"),
  out:    $("#demo-out"),
  run:    $("#btn-run"),
  tabs: {
    load:  $("#tab-load"),
    clear: $("#tab-clear"),
    garble: $("#tab-garble"),
  },
  gauge:      $("#gauge"),
  gaugeVal:   $("#gauge-val"),
  band:       $("#score-band"),
  desc:       $("#score-desc"),
  grade:      $("#score-grade"),
  subs:       $("#subscores"),
  alerts:     $("#alerts"),
  kwMatch:    $("#kw-match"),
  kwMiss:     $("#kw-miss"),
  alias:      $("#alias-note"),
};

function setTab(activeBtn) {
  Object.values(els.tabs).forEach((b) => b && b.classList.remove("active"));
  activeBtn.classList.add("active");
}

if (els.resume && els.jd && els.run) {
els.tabs.load.addEventListener("click", () => {
  setTab(els.tabs.load);
  els.resume.value = SAMPLE_RESUME;
  els.jd.value = SAMPLE_JD;
  els.out.hidden = true;
  flashPanes();
});

els.tabs.clear.addEventListener("click", () => {
  setTab(els.tabs.clear);
  els.resume.value = "";
  els.jd.value = "";
  els.out.hidden = true;
});

/* --- Simulate a bad machine parse ------------------------------------------
   Mimics what pdfplumber's extract_text(layout=False) does to a two-column
   resume: the reader walks straight across, fusing the end of one line into
   the start of the next (sidebar + main text merged), and compound skill
   names lose their word boundaries ("TypeScript" -> "Type Script",
   "PostgreSQL" -> "Postgre SQL") the way ligature-heavy fonts parse. */
function garbleResume(src) {
  return src
    .replace(/\n{2,}/g, "\n")              // collapse section gaps
    .replace(/\n/g, "")                    // read straight across — words fuse
    .replace(/([a-z])([A-Z])/g, "$1 $2")   // compound/ligature mangling
    .replace(/ {2,}/g, " ")
    .trim();
}

els.tabs.garble.addEventListener("click", () => {
  setTab(els.tabs.garble);
  const src = els.resume.value.trim() || SAMPLE_RESUME;
  els.resume.value = garbleResume(src);
  els.out.hidden = true;
  flashPanes();
});

function flashPanes() {
  [els.resume, els.jd].forEach((t) => {
    t.parentElement.classList.remove("pop");
    void t.offsetWidth; // restart animation
    t.parentElement.classList.add("pop");
  });
}

/* --- Run the audit ------------------------------------------------------- */
els.run.addEventListener("click", () => {
  const resumeText = els.resume.value;
  const jdText = els.jd.value;

  if (!resumeText.trim() && !jdText.trim()) {
    renderAlerts([
      { level: "warn", html:
        "⚠️ <b>No input:</b> Both panes are empty. Paste a resume and a job " +
        "description, or hit <b>Load sample</b> to try the engine instantly." },
    ]);
    els.out.hidden = false;
    els.gauge.style.setProperty("--sc", 0);
    els.gaugeVal.textContent = "0%";
    els.band.className = "band risk";
    els.band.textContent = "⚠ NO INPUT";
    els.desc.textContent = "The engine needs text on both sides to score you.";
    if (els.grade) els.grade.hidden = true;
    if (els.subs) els.subs.innerHTML = "";
    if (els.alias) els.alias.hidden = true;
    els.kwMatch.innerHTML = "";
    els.kwMiss.innerHTML = "";
    return;
  }

  const r = FEDEngine.audit(resumeText, jdText);
  renderScore(r);
  renderSubscores(r);
  renderAliasNote(r);
  renderAlerts(structuralAlerts(r));
  renderKeywords(r);
  els.out.hidden = false;
  els.out.scrollIntoView({ behavior: REDUCED_MOTION ? "auto" : "smooth", block: "nearest" });
  });
} /* end run handler + demo wiring guard */

/* --- Structural alerts (ported from app.py) ------------------------------- */
function structuralAlerts(r) {
  const out = [];

  // Check 1: ghost / flat-image document
  if (r.resume_len < 150) {
    out.push({ level: "bad", html:
      "❌ <b>Fatal Error (OCR Image):</b> Parsed under 150 total characters. " +
      "Your document behaves like a flat image. Corporate scanners will read " +
      "this as completely blank." });
  }

  // Check 2: multi-column warning — demo proxy: fused stream detection.
  // In the app this is measured with pdfplumber word x-positions; here we
  // warn when the resume reads as one long fused line (the *result* of
  // column-scrambling) — honest framing, clearly labeled.
  const lines = els.resume.value.trim().split(/\n+/).filter(Boolean);
  const avgLen = lines.length
    ? lines.reduce((a, l) => a + l.length, 0) / lines.length
    : 0;
  if (lines.length <= 3 || (lines.length <= 6 && avgLen > 220)) {
    out.push({ level: "bad", html:
      "❌ <b>Structural Alert (Columns):</b> The text stream reads as fused " +
      "single-line runs — the classic fingerprint of a multi-column layout " +
      "read straight across. Scanners produce nonsense strings like this." });
  }

  // Check 3: dates
  if (r.date_count < 2) {
    out.push({ level: "warn", html:
      "⚠️ <b>Timeline Parsing Alert:</b> The algorithm found zero or minimal " +
      "chronological date patterns. Ensure your experience blocks use clear " +
      "text patterns like 'MM/YYYY' or 'Month YYYY'." });
  } else {
    out.push({ level: "ok", html:
      `✅ <b>Timeline Formats Extracted:</b> Found ${r.date_count} ` +
      "standard timeline milestones inside the data stream." });
  }

  // Layout-safe pass message mirrors app.py's success branch
  if (r.resume_len >= 150 && !out.some((a) => a.level === "bad")) {
    out.unshift({ level: "ok", html:
      "✅ <b>Layout Format Safe:</b> The text stream sequence tracks reliably " +
      "from top to bottom." });
  }

  return out;
}

/* --- Render helpers ------------------------------------------------------- */
function renderScore(r) {
  els.gauge.style.setProperty("--sc", Math.round(r.score));
  els.gauge.style.setProperty(
    "--sc-color",
    r.band === "safe" ? "var(--green)" :
    r.band === "border" ? "var(--amber)" : "var(--red)"
  );

  // count-up animation for the number
  const target = Math.round(r.score);
  animateValue(els.gaugeVal, 0, target, 700, (v) => v + "%");

  els.band.className = "band " + r.band;
  els.band.textContent =
    r.band === "safe"   ? "✅ SAFE MATCH" :
    r.band === "border" ? "⚠️ BORDERLINE"  : "❌ HIGH RISK";

  // v0.2.0: grade badge + composite caption
  if (els.grade) {
    const GC = { A: "var(--green)", B: "#65a30d", C: "var(--amber)", D: "#ea580c", F: "var(--red)" };
    els.grade.textContent = r.grade;
    els.grade.style.borderColor = GC[r.grade] || "var(--red)";
    els.grade.style.color = GC[r.grade] || "var(--red)";
    els.grade.hidden = false;
    els.grade.title = `Composite ${r.composite}% — weighted blend of keyword, structure, and timeline sub-scores`;
  }

  els.desc.textContent =
    r.band === "safe"
      ? `Passed threshold. ${r.matched_count}/${r.tracked_count} tracked keywords found — deep programmatic alignment. Composite grade ${r.grade} (${r.composite}%).`
      : r.band === "border"
      ? `Optimization required. ${r.matched_count}/${r.tracked_count} tracked keywords found — this file risks automatic filtering. Composite grade ${r.grade} (${r.composite}%).`
      : `Critical gap. Only ${r.matched_count}/${r.tracked_count} tracked keywords found — AI screening rules will likely discard this profile. Composite grade ${r.grade} (${r.composite}%).`;
}

/* --- v0.2.0 sub-score bars ------------------------------------------------ */
function renderSubscores(r) {
  if (!els.subs) return;
  const rows = [
    { label: "Keywords", detail: `${r.matched_count}/${r.tracked_count} tracked · TF-weighted`, val: r.keyword_score, color: "var(--cyan)" },
    { label: "Structure", detail: r.resume_len < 150 ? "ghost document" : "layout integrity", val: r.structure_score, color: "#a78bfa" },
    { label: "Timeline", detail: `${r.date_count} milestones`, val: r.timeline_score, color: "var(--green)" },
  ];
  els.subs.innerHTML = rows.map((row) => `
    <div class="subrow">
      <div class="sublbl">${esc(row.label)} <span>${esc(row.detail)}</span></div>
      <div class="subtrack"><div class="subfill" style="width:${Math.min(row.val, 100)}%;background:${row.color};"></div></div>
    </div>`).join("");
}

/* --- v0.2.0 alias-assist callout ------------------------------------------ */
function renderAliasNote(r) {
  if (!els.alias) return;
  if (r.alias_hits && r.alias_hits.length) {
    const chips = r.alias_hits
      .map((h) => `<span class="kw match">${esc(h.alias)} → ${esc(h.canonical)}</span>`)
      .join("");
    els.alias.innerHTML =
      `<b>v0.2.0 upgrade active:</b> skill aliases matched ${chips} — ` +
      "shorthand names now count as real matches.";
    els.alias.hidden = false;
  } else {
    els.alias.hidden = true;
  }
}

function renderAlerts(alerts) {
  els.alerts.innerHTML = alerts
    .map((a) => {
      const text = a.html || esc(a.text);
      return `<div class="alert ${a.level}">${text}</div>`;
    })
    .join("");
}

function renderKeywords(r) {
  const chip = (w, cls) => `<span class="kw ${cls}">${esc(w)}</span>`;

  els.kwMatch.innerHTML = r.matched.length
    ? r.matched.map((w) => chip(w, "match")).join("")
    : '<span class="kw miss">No primary keywords matched</span>';

  els.kwMiss.innerHTML = r.missing.length
    ? r.missing.map((w) => chip(w, "miss")).join("")
    : '<span class="kw match">Perfect alignment — you hit every tracked keyword</span>';
}

/* ---------------------------------------------------------------------------
   4. Typing terminal (hero section)
--------------------------------------------------------------------------- */
const TERM_LINES = [
  { t: "cmd", text: "git clone https://github.com/YOUR_USERNAME/FED-Indeed.git" },
  { t: "cmd", text: "cd FED-Indeed" },
  { t: "cmd", text: "pip install -r requirements.txt" },
  { t: "cmd", text: "streamlit run app.py" },
  { t: "blank" },
  { t: "out",  text: "  You can now view your Streamlit app in your browser.", cls: "ok" },
  { t: "out",  text: "  Local URL: http://localhost:8501", cls: "p" },
  { t: "blank" },
  { t: "out",  text: "  [privacy] resume → parsed in session memory → never stored", cls: "dim" },
  { t: "out",  text: "  [privacy] no network calls · no telemetry · no accounts", cls: "dim" },
  { t: "blank" },
  { t: "out",  text: "  ⌖ scanning resumes like a machine since 2026", cls: "warn" },
];

function initTerminal() {
  const body = $("#term-body");
  if (!body || REDUCED_MOTION) return;

  let li = 0, ci = 0, started = false;
  const lineEls = [];

  function renderChar() {
    const line = TERM_LINES[li];
    if (!line) { finish(); return; }

    if (line.t === "blank") {
      const b = document.createElement("div");
      b.innerHTML = "&nbsp;";
      body.appendChild(b);
      lineEls.push(b);
      li++; ci = 0;
      setTimeout(renderChar, 120);
      return;
    }

    if (ci === 0) {
      const row = document.createElement("div");
      if (line.t === "cmd") {
        row.innerHTML =
          '<span class="p">$ </span><span class="txt"></span><span class="cur"></span>';
      } else {
        row.innerHTML =
          `<span class="${line.cls || "dim"}"></span><span class="cur"></span>`;
      }
      body.appendChild(row);
      lineEls.push(row);
    }

    const row = lineEls[lineEls.length - 1];
    const target =
      line.t === "cmd"
        ? row.querySelector(".txt")
        : row.firstElementChild;

    target.textContent += line.text[ci];
    ci++;

    if (ci >= line.text.length) {
      row.querySelector(".cur") && row.querySelector(".cur").remove();
      li++; ci = 0;
      setTimeout(renderChar, line.t === "cmd" ? 420 : 160);
    } else {
      setTimeout(renderChar, 18 + Math.random() * 30);
    }
  }

  function finish() {
    const last = lineEls[lineEls.length - 1];
    if (last) {
      const cur = document.createElement("span");
      cur.className = "cur";
      last.appendChild(cur);
    }
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !started) {
        started = true;
        renderChar();
        io.disconnect();
      }
    });
  }, { threshold: 0.3 });
  io.observe(body);

  // Fallback: if IO never fires (old browser), dump lines statically.
  setTimeout(() => {
    if (!started) {
      started = true;
      body.innerHTML = TERM_LINES.map((l) =>
        l.t === "blank" ? '<div>&nbsp;</div>' :
        l.t === "cmd" ? `<div><span class="p">$ </span>${esc(l.text)}</div>` :
        `<div><span class="${l.cls || "dim"}">${esc(l.text)}</span></div>`
      ).join("");
    }
  }, 4000);
}

/* ---------------------------------------------------------------------------
   5. Stat counters (data-count)
--------------------------------------------------------------------------- */
function initCounters() {
  const nums = $$("[data-count]");
  if (!nums.length) return;

  if (REDUCED_MOTION) {
    nums.forEach((n) => { n.textContent = n.dataset.count; });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      animateValue(el, 0, target, 1100, (v) => String(v));
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  nums.forEach((n) => io.observe(n));
}

function animateValue(el, from, to, dur, fmt) {
  const t0 = performance.now();
  function frame(t) {
    const k = Math.min(1, (t - t0) / dur);
    const eased = 1 - Math.pow(1 - k, 3);
    el.textContent = fmt(Math.round(from + (to - from) * eased));
    if (k < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ---------------------------------------------------------------------------
   6. Reveal-on-scroll
--------------------------------------------------------------------------- */
function initReveal() {
  const reveals = $$(".reveal");
  if (!reveals.length) return;

  if (REDUCED_MOTION || !("IntersectionObserver" in window)) {
    reveals.forEach((r) => r.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach((r) => io.observe(r));
}

/* ---------------------------------------------------------------------------
   7. Copy buttons (quickstart code blocks)
--------------------------------------------------------------------------- */
function initCopy() {
  $$(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const src = document.getElementById(btn.dataset.copy);
      if (!src) return;
      const text = src.textContent;
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        // fallback for non-secure contexts (file:// etc.)
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) { /* noop */ }
        ta.remove();
      }
      btn.classList.add("done");
      btn.textContent = "copied ✓";
      setTimeout(() => {
        btn.classList.remove("done");
        btn.textContent = "copy";
      }, 1600);
    });
  });
}

/* ---------------------------------------------------------------------------
   8. Nav scroll state + smooth anchor offset
--------------------------------------------------------------------------- */
function initNav() {
  const nav = $("#nav");
  if (!nav) return;

  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------------------------------------------------------------------------
   9. Boot
--------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveal();
  initCounters();
  initTerminal();
  initCopy();

  // Pre-load the sample so the demo invites interaction immediately.
  if (els.resume && els.jd) {
    els.resume.value = SAMPLE_RESUME;
    els.jd.value = SAMPLE_JD;
  }
});
