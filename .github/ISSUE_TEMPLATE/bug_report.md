---
name: 🐛 Bug report
description: Something parsed, scored, or rendered incorrectly
title: "[bug] "
labels: ["bug", "triage"]
---
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to report a bug.

        **Privacy reminder:** never attach real resumes or personal data.
        Use a synthetic sample or redact everything identifying.

        https://github.com/YOUR_USERNAME/FED-Indeed/blob/main/CODE_OF_CONDUCT.md
  - type: textarea
    id: what-happened
    attributes:
      label: What happened?
      description: A clear description of the incorrect behaviour. Include what you expected instead.
      placeholder: |
        The app flagged my PDF as an image, but I can select text in a PDF reader.
        I expected the "Layout Format Safe" message.
    validations:
      required: true
  - type: textarea
    id: reproduce
    attributes:
      label: Steps to reproduce
      description: Numbered steps, so a maintainer can recreate it.
      placeholder: |
        1. Run `streamlit run app.py`
        2. Upload a synthetic PDF (created via ...)
        3. Paste a sample job description
        4. See error in the Structural Readability panel
    validations:
      required: true
  - type: textarea
    id: resume-details
    attributes:
      label: About the PDF you used (no attachments please)
      description: Describe the document instead of uploading it. Which tool created it? How many pages, columns, images/charts?
      placeholder: "2 pages, made in Google Docs, single column, includes a skills table"
    validations:
      required: false
  - type: textarea
    id: logs
    attributes:
      label: Terminal output / error text
      description: Paste any traceback. It will be rendered as code automatically.
      render: shell
  - type: input
    id: version
    attributes:
      label: App version
      description: Shown in the sidebar ("Version: v0.1.0") or the latest tag.
      placeholder: v0.1.0
    validations:
      required: true
  - type: dropdown
    id: os
    attributes:
      label: Operating system
      options:
        - Linux
        - macOS (Intel)
        - macOS (Apple Silicon)
        - Windows
        - Other / not sure
    validations:
      required: true
  - type: input
    id: python
    attributes:
      label: Python version
      description: Output of `python --version`
      placeholder: "3.11.5"
    validations:
      required: false
  - type: textarea
    id: context
    attributes:
      label: Additional context
      description: Screenshots of the *app UI* are fine (synthetic data only). Anything else that might help.
    validations:
      required: false
