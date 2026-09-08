// FED-Indeed — docs/tests/sample_check.js (v0.2.0)
// CI sanity check: extracts the sample resume/JD from main.js, runs the
// engine on them, and verifies the demo's marketing numbers are TRUE.
// Run from repo root: node docs/tests/sample_check.js

const fs = require("fs");
const path = require("path");

const engine = require("../assets/js/engine.js");

const MAIN = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "main.js"), "utf8");

function grab(name) {
  const m = MAIN.match(new RegExp("const " + name + " = `([\\s\\S]*?)`;"));
  if (!m) throw new Error(name + " not found in main.js");
  return m[1];
}

const resume = grab("SAMPLE_RESUME");
const jd = grab("SAMPLE_JD");

const r = engine.audit(resume, jd);

console.log(`score: ${r.score.toFixed(1)} | band: ${r.band} | grade: ${r.grade} | composite: ${r.composite}`);
console.log(`matched (${r.matched_count}/${r.tracked_count}):`, r.matched.join(" "));
console.log(`missing (${r.missing.length}):`, r.missing.join(" "));
console.log(`dates: ${r.date_count} | aliases: ${r.alias_hits.map((h) => h.alias + "->" + h.canonical).join(", ") || "none"}`);
console.log(`sub-scores: keyword ${r.keyword_score} · structure ${r.structure_score} · timeline ${r.timeline_score}`);

// ---- assertions: the demo story must hold, or CI fails ---------------------
const errs = [];

// borderline band (the hero shows a borderline resume being optimized)
if (r.band !== "border") errs.push(`expected band=border, got ${r.band}`);
if (r.grade !== "B") errs.push(`expected grade=B, got ${r.grade}`);
// hero chip reads "keywords: 15/20"
if (r.matched_count !== 15 || r.tracked_count !== 20) {
  errs.push(`hero chip says 15/20, engine says ${r.matched_count}/${r.tracked_count}`);
}
// the sample resume must contain an alias hit (k8s -> kubernetes)
if (!r.alias_hits.some((h) => h.alias === "k8s" && h.canonical === "kubernetes")) {
  errs.push("expected alias hit k8s->kubernetes (showcases v0.2.0 aliases)");
}
// six timeline milestones
if (r.date_count !== 6) errs.push(`expected 6 dates, got ${r.date_count}`);
// missing list should be real tech-stack gaps
const missingJoin = r.missing.join(",");
for (const tech of ["terraform", "kafka", "graphql"]) {
  if (!missingJoin.includes(tech)) errs.push(`expected ${tech} in missing list, got: ${missingJoin}`);
}

if (errs.length) {
  console.error("\n✗ SAMPLE CHECK FAILED:");
  errs.forEach((e) => console.error("  - " + e));
  process.exit(1);
}

console.log("\n✓ SAMPLE CHECK PASSED — demo numbers match the engine exactly.");
