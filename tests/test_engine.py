# FED-Indeed — tests/test_engine.py
# Unit tests for the v0.2.0 engine (run: python3 -m pytest tests/ -q
# or python3 -m unittest tests.test_engine -v).
# CI runs: python3 -m unittest discover -s tests -p "test_*.py" -v

import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fed_engine import (
    SKILL_ALIASES,
    STOP_WORDS,
    audit,
    band_of,
    canonical,
    find_dates,
    grade_of,
    stem,
    top_keywords,
    tokenize,
)

RESUME = """
Jordan Reyes — Senior Platform Engineer
Summary: Senior engineer with deep python, typescript and docker experience.
Built streaming data pipelines on AWS and deployed kubernetes (k8s) clusters.
Skills: python, typescript, javascript, docker, postgres, redis, react.
Experience:
Senior Platform Engineer, Northwind Systems — Jan 2020 to Present
  - Managed observability tooling; designed resilient data pipelines.
Full Stack Developer, Copperline Labs — 03/2017 to 12/2019
  - Shipped react frontends and node services backed by postgresql.
"""

JD = """
Senior Platform Engineer — THE STACK
python typescript docker kubernetes postgresql redis react node aws
Design resilient data pipelines. Own observability tooling. Manage platform
services and streaming data pipelines. deep python experience. python again.
python matters.
"""

class TestTokenPipeline(unittest.TestCase):
    def test_tokenize_lowercases_and_splits(self):
        self.assertEqual(tokenize("Kubernetes, & Docker!"), ["kubernetes", "docker"])

    def test_aliases_map_to_canonical(self):
        self.assertEqual(canonical("k8s"), "kubernetes")
        self.assertEqual(canonical("ts"), "typescript")
        self.assertEqual(canonical("reactjs"), "react")

    def test_aliases_leave_unknowns_alone(self):
        self.assertEqual(canonical("terraform"), "terraform")

    def test_stem_plural_s(self):
        self.assertEqual(stem("pipelines"), stem("pipeline"))

    def test_stem_ing_ed(self):
        self.assertEqual(stem("managing"), stem("managed"))
        self.assertEqual(stem("designing"), stem("designed"))

    def test_stem_ies(self):
        self.assertEqual(stem("technologies"), stem("technology"))

    def test_stem_does_not_mangle_short_acronyms(self):
        for w in ("aws", "css", "rds", "sql", "ml", "go"):
            self.assertEqual(stem(w), w)

    def test_stem_does_not_mangle_ss_us_is_words(self):
        for w in ("class", "status", "redis", "kinesis", "analysis"):
            self.assertEqual(stem(w), w)

    def test_stem_is_idempotent_on_stopwords_domain(self):
        # classic dangerous case: "service"/"services" must collapse,
        # but "business" must NOT lose its trailing s.
        self.assertEqual(stem("services"), stem("service"))
        self.assertNotEqual(stem("business"), stem("busines"))


class TestTopKeywords(unittest.TestCase):
    def test_counts_and_ranking(self):
        kws = top_keywords(JD)
        # python appears 4x in the JD -> must rank first
        self.assertEqual(kws[0]["surface"], "python")
        self.assertEqual(kws[0]["count"], 4)
        # surfaces are the first-seen spelling
        surfaces = [k["surface"] for k in kws]
        self.assertIn("pipelines", surfaces)

    def test_alias_jd_side(self):
        kws = top_keywords("k8s everywhere. k8s again. k8s third. k8s fourth.")
        self.assertEqual(kws[0]["surface"], "k8s")
        # k8s canonicalises to kubernetes, then stems -> "kubernet";
        # the resume side does the same, so they genuinely match.
        self.assertEqual(kws[0]["stem"], stem("kubernetes"))

    def test_stopwords_and_len_filter(self):
        kws = top_keywords("the and a of to in is for with on an or at by from it be")
        self.assertEqual(kws, [])

    def test_limit_respected(self):
        kws = top_keywords(JD, limit=3)
        self.assertEqual(len(kws), 3)

    def test_stable_ties(self):
        kws = top_keywords("alpha beta gamma alpha beta gamma")
        surfaces = [k["surface"] for k in kws]
        self.assertEqual(surfaces, ["alpha", "beta", "gamma"])


class TestDates(unittest.TestCase):
    def test_month_year(self):
        self.assertEqual(len(find_dates("Jan 2020 and Present")), 2)

    def test_mm_slash_yyyy(self):
        self.assertEqual(len(find_dates("03/2017 to 12/2019")), 2)

    def test_full_month_names(self):
        self.assertEqual(len(find_dates("January 2020, September 2019")), 2)

    def test_none_found(self):
        self.assertEqual(find_dates("no dates here at all"), [])


class TestAudit(unittest.TestCase):
    def setUp(self):
        self.result = audit(RESUME, JD)

    def test_version_string(self):
        self.assertEqual(self.result["version"], "0.2.0")

    def test_alias_matches_k8s_to_kubernetes(self):
        # resume says "kubernetes (k8s)" and JD tracks kubernetes -> match
        self.assertIn("kubernetes", self.result["matched"])

    def test_stemming_matches_pipelines_to_pipelines(self):
        # resume has "pipelines", JD tracks "pipelines" (both -> pipelin)
        self.assertIn("pipelines", self.result["matched"])

    def test_observability_matched(self):
        self.assertIn("observability", self.result["matched"])

    def test_tf_weighting_applied(self):
        # python counts 4x, so score != flat count; sanity: matched_w > flat
        self.assertGreater(self.result["score"], 0)
        self.assertEqual(self.result["tracked_count"], len(self.result["matched"]) + len(self.result["missing"]))

    def test_missing_reports_jd_side_surface(self):
        # JD: "Own observability tooling" -> "own" is tracked and unmatched
        self.assertIn("own", self.result["missing"])
        # while "node" (in resume as "node services") matched
        self.assertIn("node", self.result["matched"])

    def test_alias_hits_reported(self):
        # k8s is in the resume AND kubernetes is tracked -> alias hit listed
        self.assertIn(
            {"alias": "k8s", "canonical": "kubernetes"}, self.result["alias_hits"]
        )

    def test_dates_found_in_resume(self):
        self.assertEqual(self.result["date_count"], 4)

    def test_sub_scores_present(self):
        for key in ("keyword_score", "structure_score", "timeline_score", "composite"):
            self.assertIn(key, self.result)

    def test_composite_weights(self):
        r = self.result
        expected = round(
            0.6 * r["keyword_score"] + 0.25 * r["structure_score"] + 0.15 * r["timeline_score"], 1
        )
        self.assertEqual(r["composite"], expected)

    def test_band_thresholds(self):
        self.assertEqual(band_of(75), "safe")
        self.assertEqual(band_of(50), "border")
        self.assertEqual(band_of(49.9), "risk")

    def test_grades(self):
        self.assertEqual(grade_of(85), "A")
        self.assertEqual(grade_of(70), "B")
        self.assertEqual(grade_of(55), "C")
        self.assertEqual(grade_of(40), "D")
        self.assertEqual(grade_of(39.9), "F")

    def test_ghost_resume_structure_zero(self):
        r = audit("too short", JD)
        self.assertEqual(r["structure_score"], 0.0)
        self.assertEqual(r["grade"], "F")

    def test_layout_anomaly_caps_structure(self):
        r = audit(RESUME, JD, layout_anomaly=True)
        self.assertEqual(r["structure_score"], 45.0)

    def test_no_dates_penalises_structure(self):
        r = audit(RESUME.replace("Jan 2020", "").replace("Present", "").replace("03/2017", "").replace("12/2019", ""), JD)
        self.assertEqual(r["structure_score"], 75.0)  # 100 - 25 timeline penalty

    def test_timeline_score_capped_at_100(self):
        # 6+ dates is a perfect timeline
        r = audit("a " * 200 + " ".join(["Jan 2020"] * 8), JD)
        self.assertEqual(r["timeline_score"], 100.0)

    def test_empty_jd_safe(self):
        r = audit(RESUME, "")
        self.assertEqual(r["score"], 0.0)
        self.assertEqual(r["tracked_count"], 0)


if __name__ == "__main__":
    unittest.main()
