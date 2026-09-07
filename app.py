# FED-Indeed — app.py
# Reverse-engineer the AI gatekeepers. See what they see, fix what they break.
# Licensed under the MIT License. See LICENSE for details.
# Version 0.1.0

import re
from collections import Counter

import pdfplumber
import streamlit as st

__version__ = "0.1.0"

# ----------------------------------------------------------------------------
# Page configuration (must be the first Streamlit call in the script)
# ----------------------------------------------------------------------------
st.set_page_config(
    page_title="FED-Indeed // Open-Source Reverse ATS Scanner",
    layout="wide",
    initial_sidebar_state="expanded",
)


# ----------------------------------------------------------------------------
# Optional external stylesheet (repo root: styles.css)
# ----------------------------------------------------------------------------
def load_local_css(path: str = "styles.css") -> None:
    """Load styles.css from the repository root if present.

    Keeps visual polish out of app logic so contributors can restyle the app
    without touching the parsing engine.
    """
    try:
        with open(path, "r", encoding="utf-8") as f:
            css = f.read()
        st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)
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

# ----------------------------------------------------------------------------
# Sidebar
# ----------------------------------------------------------------------------
with st.sidebar:
    st.header("⚙️ Core Engine Status")
    st.markdown("**Project:** FED-Indeed")
    st.markdown(f"**Version:** v{__version__}")
    st.markdown("---")
    st.markdown("### Privacy Shield Active")
    st.caption(
        "This tool runs entirely in your application session memory. "
        "No data is stored, and zero ingress fees are sent to external databases."
    )
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
            # Layout analyzer: flag erratic horizontal back-jumps that indicate
            # multi-column layouts scrambled by line-by-line readers.
            words = page.extract_words()
            if words:
                prev_x = 0
                jumps = 0
                for w in words[:40]:  # scan initial text layout blocks
                    if w["x0"] < prev_x - 100:
                        jumps += 1
                    prev_x = w["x0"]
                if jumps > 3:
                    has_layout_anomaly = True

            text = page.extract_text(layout=False)  # aggressive machine parsing
            if text:
                raw_extracted_text += text + "\n"

    # --- 2. Text processing & cleanup engine ---------------------------------
    STOP_WORDS = {
        "the", "and", "a", "of", "to", "in", "is", "for", "with", "on",
        "an", "or", "at", "by", "from",
    }

    def clean_text(text: str) -> list:
        return re.findall(r"\b\w+\b", text.lower())

    resume_words = clean_text(raw_extracted_text)
    jd_words = clean_text(job_description)
    jd_keywords = [w for w in jd_words if w not in STOP_WORDS and len(w) > 2]
    jd_counts = Counter(jd_keywords).most_common(20)

    # --- 3. Calculation layer -------------------------------------------------
    set_resume = set(resume_words)
    set_jd = set(jd_keywords)
    intersection = set_resume.intersection(set_jd)
    jaccard_score = (len(intersection) / len(set_jd)) * 100 if set_jd else 0

    # Chronological date extraction validation
    date_pattern = (
        r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\b"
        r"|\b\d{2}/\d{4}\b"
        r"|\bPresent\b"
    )
    found_dates = re.findall(date_pattern, raw_extracted_text, re.IGNORECASE)

    # --- 4. Metrics grid --------------------------------------------------------
    metric_col1, metric_col2 = st.columns(2)

    with metric_col1:
        st.subheader("📊 ATS Compatibility Rating")
        if jaccard_score >= 75:
            st.metric(
                label="Overall Match Index",
                value=f"{jaccard_score:.1f}%",
                delta="Safe Match",
            )
            st.success(
                "✅ **Passed Threshold:** Your resume shares deep programmatic "
                "alignment with the target description."
            )
        elif jaccard_score >= 50:
            st.metric(
                label="Overall Match Index",
                value=f"{jaccard_score:.1f}%",
                delta="Borderline",
                delta_color="off",
            )
            st.warning(
                "⚠️ **Optimization Required:** This file risks automatic filtering. "
                "Inject missing keywords listed on the right."
            )
        else:
            st.metric(
                label="Overall Match Index",
                value=f"{jaccard_score:.1f}%",
                delta="High Rejection Risk",
                delta_color="inverse",
            )
            st.error(
                "❌ **Critical Optimization Gap:** Keyword alignment is too weak. "
                "The AI screening rules will likely discard this profile."
            )

    with metric_col2:
        st.subheader("🛠️ Structural Readability Integrity")

        # Check 1: invisible vector image text limits
        if len(raw_extracted_text.strip()) < 150:
            st.error(
                "❌ **Fatal Error (OCR Image):** Parsed under 150 total characters. "
                "Your document behaves like a flat image. Corporate scanners will "
                "read this as completely blank."
            )
        # Check 2: multi-column parsing risks
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

        # Check 3: date extraction loops
        if len(found_dates) < 2:
            st.warning(
                "⚠️ **Timeline Parsing Alert:** The algorithm found zero or minimal "
                "chronological date patterns. Ensure your experience blocks use "
                "clear text patterns like 'MM/YYYY' or 'Month YYYY'."
            )
        else:
            st.info(
                f"✅ **Timeline Formats Extracted:** Found {len(found_dates)} "
                "standard timeline milestones inside the data stream."
            )

    st.divider()

    # --- 5. Lower dashboard layer ----------------------------------------------
    analysis_left, analysis_right = st.columns(2)

    with analysis_left:
        st.subheader("🤖 What the Machine Sees (Raw Text Stream)")
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

    with analysis_right:
        st.subheader("🎯 Keyword Matrix Verification")

        matches = []
        missing = []
        for word, count in jd_counts:
            if word in set_resume:
                matches.append(word)
            else:
                missing.append(word)

        st.markdown(f"**Identified Matches ({len(matches)}):**")
        st.success(", ".join(matches) if matches else "No primary keywords matched.")

        st.markdown(f"**Missing Core Target Keywords ({len(missing)}):**")
        st.error(
            ", ".join(missing) if missing else "Perfect alignment. You hit all "
            "targeted technical keywords."
        )

    # --- 6. Footer ------------------------------------------------------------
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
