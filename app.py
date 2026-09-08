# FED-Indeed — app.py
# Reverse-engineer the AI gatekeepers. See what they see, fix what they break.
# Licensed under the MIT License. See LICENSE for details.
# Version 0.2.0 — engine extracted to fed_engine.py; new: sub-scores,
# letter grade, alias/stemming matching, TF-weighted score, report export,
# session history.

import io
import json
import re
import time
from datetime import datetime, timezone

import pdfplumber
import streamlit as st

from fed_engine import __version__, audit

st.set_page_config(
    page_title="FED-Indeed // Open-Source Reverse ATS Scanner",
    layout="wide",
    initial_sidebar_state="expanded",
)


# ----------------------------------------------------------------------------
# Optional external stylesheet (repo root: styles.css)
# ----------------------------------------------------------------------------
def load_local_css(path: str = "styles.css") -> None:
    try:
        with open(path, "r", encoding="utf-8") as f:
            st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)
    except FileNotFoundError:
        pass


load_local_css()

# ----------------------------------------------------------------------------
# Header
# ----------------------------------------------------------------------------
st.title("📂 FED-Indeed: Reverse AI Resume Filter")
st.subheader("See exactly what the corporate filtering algorithms extract from your resume.")

KOFI_BUTTON = (
    "<a href='https://ko-fi.com/YOUR_USERNAME' target='_blank'>"
    "<img height='36' style='border:0px;height:36px;' "
    "src='https://ko-fi.com/img/githubbutton_sm.svg' border='0' "
    "alt='Buy Me a Coffee at ko-fi.com' /></a>"
)

GRADE_COLORS = {
    "A": "#16a34a", "B": "#65a30d", "C": "#d97706",
    "D": "#ea580c", "F": "#dc2626",
}

# ----------------------------------------------------------------------------
# Sidebar
# ----------------------------------------------------------------------------
with st.sidebar:
    st.header("⚙️ Core Engine Status")
    st.markdown("**Project:** FED-Indeed")
    st.markdown(f"**Version:** v{__version__} · engine: `fed_engine.py`")
    st.markdown("---")
    st.markdown("### Privacy Shield Active")
    st.caption(
        "This tool runs entirely in your application session memory. "
        "No data is stored, and zero ingress fees are sent to external databases."
    )

    st.markdown("---")
    st.markdown("### 🕘 Session History")
    if "history" not in st.session_state:
        st.session_state.history = []
    if st.session_state.history:
        for i, h in enumerate(reversed(st.session_state.history[-5:]), 1):
            grade_col, info_col = st.columns([1, 4])
            grade = h.get("grade", "F")
            with grade_col:
                st.markdown(
                    f"<span style='font-size:1.4rem;font-weight:800;"
                    f"color:{GRADE_COLORS.get(grade, '#dc2626')};'>{grade}</span>",
                    unsafe_allow_html=True,
                )
            with info_col:
                st.caption(
                    f"{h['time']} · {h['band_label']}"
                )
                st.caption(f"match {h['score']}% · composite {h['composite']}%")
        if st.button("Clear history", use_container_width=True):
            st.session_state.history = []
            st.rerun()
    else:
        st.caption("No audits yet this session. Runs appear here after your first scan.")

    st.markdown("---")
    st.caption("Found this useful? Support development:")
    st.markdown(KOFI_BUTTON, unsafe_allow_html=True)

# ----------------------------------------------------------------------------
# Inputs
# ----------------------------------------------------------------------------
col1, col2 = st.columns(2)

with col1:
    st.header("1. Upload Candidate Data")
    uploaded_file = st.file_uploader("Upload your Resume (PDF format)", type=["pdf"])

with col2:
    st.header("2. Target Job Profile")
    job_description = st.text_area(
        "Paste the explicit Job Description text here", height=200
    )

# ----------------------------------------------------------------------------
# Analysis pipeline
# ----------------------------------------------------------------------------
if uploaded_file and job_description:
    st.divider()
    st.header("🔍 Real-Time Extraction & Filter Analysis")

    # --- 1. Parsing phase (simulates deterministic ATS readers) -------------
    raw_extracted_text = ""
    has_layout_anomaly = False

    with pdfplumber.open(uploaded_file) as pdf:
        for page in pdf.pages:
            words = page.extract_words()
            if words:
                prev_x = 0
                jumps = 0
                for w in words[:40]:
                    if w["x0"] < prev_x - 100:
                        jumps += 1
                    prev_x = w["x0"]
                if jumps > 3:
                    has_layout_anomaly = True

            text = page.extract_text(layout=False)
            if text:
                raw_extracted_text += text + "\n"

    # --- 2. Engine call (all scoring now lives in fed_engine.py) ------------
    result = audit(raw_extracted_text, job_description, layout_anomaly=has_layout_anomaly)

    score = result["score"]
    band = result["band"]
    grade = result["grade"]
    band_label = {"safe": "Safe Match", "border": "Borderline", "risk": "High Rejection Risk"}[band]

    # --- 3. Session history --------------------------------------------------
    st.session_state.history.append(
        {
            "time": datetime.now(timezone.utc).strftime("%H:%M:%S"),
            "score": f"{score:.1f}",
            "composite": result["composite"],
            "grade": grade,
            "band_label": band_label,
        }
    )

    # --- 4. Metrics grid -----------------------------------------------------
    metric_col1, metric_col2 = st.columns(2)

    with metric_col1:
        st.subheader("📊 ATS Compatibility Rating")
        grade_col, score_col = st.columns([1, 3])
        with grade_col:
            st.markdown(
                f"<div title='Composite grade' style='text-align:center;"
                f"padding:0.5rem 0.75rem;border-radius:0.75rem;"
                f"background:{GRADE_COLORS[grade]}22;"
                f"border:2px solid {GRADE_COLORS[grade]};'>"
                f"<div style='font-size:2rem;font-weight:800;"
                f"line-height:1;color:{GRADE_COLORS[grade]};'>{grade}</div>"
                f"<div style='font-size:0.7rem;color:#888;'>GRADE</div></div>",
                unsafe_allow_html=True,
            )
        with score_col:
            if band == "safe":
                st.metric("Overall Match Index", f"{score:.1f}%", delta="Safe Match")
                st.success(
                    "✅ **Passed Threshold:** Your resume shares deep programmatic "
                    "alignment with the target description."
                )
            elif band == "border":
                st.metric("Overall Match Index", f"{score:.1f}%", delta="Borderline", delta_color="off")
                st.warning(
                    "⚠️ **Optimization Required:** This file risks automatic filtering. "
                    "Inject missing keywords listed below."
                )
            else:
                st.metric("Overall Match Index", f"{score:.1f}%", delta="High Rejection Risk", delta_color="inverse")
                st.error(
                    "❌ **Critical Optimization Gap:** Keyword alignment is too weak. "
                    "The AI screening rules will likely discard this profile."
                )
            st.caption(
                f"Composite: **{result['composite']}%** — weighted blend of keyword "
                f"({result['keyword_score']}%), structure ({result['structure_score']}%), "
                f"timeline ({result['timeline_score']}%)."
            )

        # --- 4b. Sub-score breakdown bars -----------------------------------
        st.subheader("🧭 Sub-Score Breakdown")
        bar_css = (
            "<style>.fedbar{{margin:0.3rem 0;}}.fedbar .track{{background:#1a2233;"
            "border-radius:0.5rem;height:0.65rem;overflow:hidden;}}"
            ".fedbar .fill{{height:100%;border-radius:0.5rem;background:{c};"
            "width:{w}%;transition:width .4s;}}.fedbar .lbl{{font-size:0.8rem;"
            "color:#9aa5b5;margin-bottom:0.15rem;}}</style>"
        )
        st.markdown(bar_css, unsafe_allow_html=True)

        def fed_bar(label, val, color):
            st.markdown(
                f"<div class='fedbar'><div class='lbl'>{label} — {val:.0f}%</div>"
                f"<div class='track'><div class='fill' style='background:{color};width:{val:.1f}%;'></div></div></div>",
                unsafe_allow_html=True,
            )

        fed_bar(f"🔑 Keywords ({result['matched_count']}/{result['tracked_count']} tracked, TF-weighted)",
                result["keyword_score"], "#22d3ee")
        fed_bar("🏗️ Structure (layout + dates integrity)", result["structure_score"], "#a78bfa")
        fed_bar(f"⏱️ Timeline ({result['date_count']} milestones)", result["timeline_score"], "#34d399")

    with metric_col2:
        st.subheader("🛠️ Structural Readability Integrity")

        if result["resume_len"] < 150:
            st.error(
                "❌ **Fatal Error (OCR Image):** Parsed under 150 total characters. "
                "Your document behaves like a flat image. Corporate scanners will "
                "read this as completely blank."
            )
        elif has_layout_anomaly:
            st.error(
                "❌ **Structural Alert (Columns):** Complex multi-column spacing "
                "patterns detected. The ATS will likely read straight across "
                "columns, creating unreadable nonsense strings."
            )
        else:
            st.success(
                "✅ **Layout Format Safe:** The text stream sequence tracks "
                "reliably from top to bottom."
            )

        if result["date_count"] < 2:
            st.warning(
                "⚠️ **Timeline Parsing Alert:** The algorithm found zero or minimal "
                "chronological date patterns. Ensure your experience blocks use "
                "clear text patterns like 'MM/YYYY' or 'Month YYYY'."
            )
        else:
            st.info(
                f"✅ **Timeline Formats Extracted:** Found {result['date_count']} "
                "standard timeline milestones inside the data stream."
            )

        # --- 4c. v0.2.0 upgrades callout -------------------------------------
        if result["alias_hits"]:
            hits = ", ".join(
                f"`{h['alias']}` → `{h['canonical']}`" for h in result["alias_hits"]
            )
            st.markdown("#### 🧠 v0.2.0 Engine Upgrades Active")
            st.info(
                f"**Skill aliases matched:** {hits}. "
                "Shorthand skill names now count as matches."
            )
        st.caption(
            "**v0.2.0:** suffix stemming (`pipelines`↔`pipeline`, `managing`↔`managed`) "
            "and TF-weighted scoring (a keyword repeated 4× in the JD weighs more) "
            "are active in this scan."
        )

    st.divider()

    # --- 5. Lower dashboard layer ---------------------------------------------
    analysis_left, analysis_right = st.columns(2)

    with analysis_left:
        st.subheader("🏷️ What the Machine Sees (Raw Text Stream)")
        st.caption(
            "This is exactly what the background algorithms see. Read this box "
            "to find merged words or formatting mistakes."
        )
        st.text_area(
            "ATS Internal String Capture",
            value=raw_extracted_text,
            height=300,
            disabled=True,
        )

        st.download_button(
            "⬇️ Export scan report (JSON)",
            data=json.dumps(
                {
                    "tool": "FED-Indeed",
                    "engine_version": __version__,
                    "generated": datetime.now(timezone.utc).isoformat(),
                    "match_score": round(score, 2),
                    "band": band,
                    "band_label": band_label,
                    "grade": grade,
                    "composite": result["composite"],
                    "sub_scores": {
                        "keywords": result["keyword_score"],
                        "structure": result["structure_score"],
                        "timeline": result["timeline_score"],
                    },
                    "matched_keywords": result["matched"],
                    "missing_keywords": result["missing"],
                    "alias_hits": result["alias_hits"],
                    "dates_detected": result["date_count"],
                    "resume_chars": result["resume_len"],
                },
                indent=2,
            ),
            file_name=f"fed-indeed-report-{int(time.time())}.json",
            mime="application/json",
            use_container_width=True,
        )

    with analysis_right:
        st.subheader("🎯 Keyword Matrix Verification")

        st.markdown(f"**Identified Matches ({len(result['matched'])}):**")
        st.success(", ".join(result["matched"]) if result["matched"] else "No primary keywords matched.")

        st.markdown(f"**Missing Core Target Keywords ({len(result['missing'])}):**")
        st.error(
            ", ".join(result["missing"]) if result["missing"]
            else "Perfect alignment. You hit all targeted technical keywords."
        )

        if result["matched"] and result["tracked_count"]:
            st.progress(min(len(result["matched"]) / result["tracked_count"], 1.0))

    st.divider()
    st.markdown(KOFI_BUTTON, unsafe_allow_html=True)
    st.caption(
        "FED-Indeed is a transparency tool, not a recruiter. Results model "
        "common ATS heuristics and do not guarantee interview outcomes."
    )
else:
    st.info(
        "Upload a PDF resume **and** paste a job description to begin the audit."
    )
