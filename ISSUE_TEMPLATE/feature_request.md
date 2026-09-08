---
name: ✨ Feature request
description: Propose a new check, scoring improvement, or feature
title: "[feat] "
labels: ["enhancement"]
---
body:
  - type: markdown
    attributes:
      value: |
        Great ideas drive the roadmap — check
        [ROADMAP.md](https://github.com/YOUR_USERNAME/FED-Indeed/blob/main/ROADMAP.md)
        first in case it's already staged, then tell us about it.

        Bigger concepts may fit better as a Discussion under *Ideas*:
        https://github.com/YOUR_USERNAME/FED-Indeed/discussions/categories/ideas
  - type: textarea
    id: problem
    attributes:
      label: The problem you want solved
      description: Which ATS behaviour or job-seeker pain should this address? "Always start with the problem, not the solution."
      placeholder: "ATS engines calculate years-of-experience per skill; my 8 years of Python look identical to someone's 1 year in the current score."
    validations:
      required: true
  - type: textarea
    id: solution
    attributes:
      label: Your proposed solution
      description: What should the app do? How would it appear in the audit panels?
      placeholder: "Co-locate each skill mention with its nearest date range and show estimated years per matched keyword."
    validations:
      required: true
  - type: dropdown
    id: category
    attributes:
      label: Area
      options:
        - Parser heuristics (new structural check)
        - Scoring / matching logic
        - UI / dashboard
        - Performance
        - Documentation / wiki
        - Community / repo tooling
        - Other
    validations:
      required: true
  - type: dropdown
    id: effort
    attributes:
      label: Rough effort guess
      description: Rough is fine — it helps us stage the roadmap.
      options:
        - Small (< 50 lines, no new deps)
        - Medium (module refactor or new heuristics)
        - Large (architecture change / new dependency)
        - No idea
    validations:
      required: false
  - type: checkboxes
    id: constraints
    attributes:
      label: Project constraints check
      description: FED-Indeed's constitution — see ADR.md
      options:
        - label: My idea keeps the app local-first (no cloud persistence, no telemetry)
          required: true
        - label: My idea keeps the core scanner free of API keys / network calls
          required: true
  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives you considered
      description: Including "I tried hacking this in myself and…"
    validations:
      required: false
  - type: textarea
    id: context
    attributes:
      label: Additional context
      description: Links, mockups, or the real-world ATS behaviour you're modelling.
    validations:
      required: false
