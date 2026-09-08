// FED-Indeed — docs/tests/engine_crosscheck.js (v0.2.0)
// THE HONESTY PROOF: runs the browser engine (docs/assets/js/engine.js)
// against the Python engine (fed_engine.py) on identical inputs and fails
// if they disagree on ANY field. Run from repo root: node docs/tests/engine_crosscheck.js
// CI runs this on every push.

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const engine = require("../assets/js/engine.js");

const ROOT = path.resolve(__dirname, "..", "..");
const PY_ENGINE = path.join(ROOT, "fed_engine.py");

if (!fs.existsSync(PY_ENGINE)) {
  console.error(`✗ fed_engine.py not found at ${PY_ENGINE} (run from repo root)`);
  process.exit(1);
}

// ---- test corpus -------------------------------------------------------------
// v0.2.0 stresses aliases, stemming, TF-weighting, sub-scores, grade.

const RESUME = `Jordan Reyes - Senior Platform Engineer
Summary: Senior engineer with deep python, typescript and docker experience.
Built streaming data pipelines on AWS and deployed kubernetes (k8s) clusters.
Skills: python, typescript, javascript, docker, postgres, redis, react.
Experience:
Senior Platform Engineer, Northwind Systems - Jan 2020 to Present
  - Managed observability tooling; designed resilient data pipelines.
Full Stack Developer, Copperline Labs - 03/2017 to 12/2019
  - Shipped react frontends and node services backed by postgresql.
`;

const JD = `Senior Platform Engineer - THE STACK
python typescript docker kubernetes postgresql redis react node aws
Design resilient data pipelines. Own observability tooling. Manage platform
services and streaming data pipelines. deep python experience. python again.
python matters.
`;

// extra edge cases
const EDGE = [
  ["", "python python typescript"],
  ["k8s everywhere and k8s again", "kubernetes kubernetes kubernetes kubernetes"],
  ["I managed multiple data pipelines and designing services", "manages managed managing pipelines pipeline"],
  ["a " + "x".repeat(200), "ghost detector only"],
];

// ---- reference run via Python ----------------------------------------------

const PY_REF = String.raw`
import json, sys
sys.path.insert(0, r"""${ROOT}""")
from fed_engine import audit

raw = sys.stdin.buffer.read().decode("utf-8")
cases = raw.split("\x00")

out = []
for i in range(0, len(cases), 2):
    r, j = cases[i], cases[i + 1] if i + 1 < len(cases) else ""
    out.append(audit(r, j))

print(json.dumps(out))
`;

function pyAudit(resume, jd) {
  const stdout = execSync(`python3 -c "$PY_REF"`, {
    input: RESUME + "\x00" + JD + "\x00" + EDGE.map((c) => c.join("\x00")).join("\x00") + "\n",
    env: { ...process.env, PY_REF },
    encoding: "utf-8",
  });
  return JSON.parse(stdout);
}

// The Python reference receives ALL cases at once, in this exact order.
const ALL_CASES = [[RESUME, JD], ...EDGE];
const PY_RESULTS = pyAudit();

// ---- compare ---------------------------------------------------------------

let failures = 0;

function cmp(field, js, py, ctx) {
  const a = JSON.stringify(js);
  const b = JSON.stringify(py);
  if (a !== b) {
    failures++;
    console.error(`✗ MISMATCH [${ctx}] ${field}\n   js: ${a}\n   py: ${b}`);
  }
}

const FIELDS = [
  "version", "score", "band", "grade", "composite",
  "keyword_score", "structure_score", "timeline_score",
  "matched", "missing", "matched_count", "tracked_count",
  "alias_hits", "dates", "date_count", "resume_len", "top",
];

ALL_CASES.forEach(([r, j], idx) => {
  const ctx = idx === 0 ? "main" : `edge${idx}`;
  const js = engine.audit(r, j);
  const py = PY_RESULTS[idx];

  for (const f of FIELDS) {
    cmp(f, js[f], py[f], ctx);
  }

  if (idx === 0) {
    console.log(`JS   score=${js.score.toFixed(1)} grade=${js.grade} matched=${js.matched_count}/${js.tracked_count} alias=${js.alias_hits.length} dates=${js.date_count}`);
    console.log(`PY   score=${py.score.toFixed(1)} grade=${py.grade} matched=${py.matched_count}/${py.tracked_count} alias=${py.alias_hits.length} dates=${py.date_count}`);
  }
});

// ---- unit-level parity of primitives ----------------------------------------

(function primitives() {
  const pycases = [["pipelines"], ["managed"], ["technologies"], ["kubernetes"], ["aws"], ["class"], ["k8s"], ["js"], ["nodejs"]];
  const PY_PRIM = String.raw`
import json, sys
sys.path.insert(0, r"""${ROOT}""")
import fed_engine as fe
words = json.loads(sys.stdin.read())
print(json.dumps([[fe.stem(w), fe.canonical(w)] for w in words]))
`;
  const pyPairs = JSON.parse(
    execSync(`python3 -c "$PY_PRIM"`, {
      input: JSON.stringify(pycases.flat()),
      env: { ...process.env, PY_PRIM },
      encoding: "utf-8",
    })
  );
  pycases.forEach(([w], i) => {
    const jsStem = engine.stem(w);
    const jsCanon = engine.canonical(w);
    if (jsStem !== pyPairs[i][0] || jsCanon !== pyPairs[i][1]) {
      failures++;
      console.error(`✗ PRIMITIVE MISMATCH ${w}: js(${jsStem}, ${jsCanon}) py(${pyPairs[i][0]}, ${pyPairs[i][1]})`);
    }
  });
})();

if (failures > 0) {
  console.error(`\n✗ ENGINE CROSS-CHECK FAILED: ${failures} field mismatch(es).`);
  process.exit(1);
}

console.log("\n✓ ENGINE CROSS-CHECK PASSED — JS port matches Python v0.2.0 exactly.");
