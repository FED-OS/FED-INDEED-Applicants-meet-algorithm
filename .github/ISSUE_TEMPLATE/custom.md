---
name: 📝 Custom report
description: Anything that isn't a bug or a feature request
labels: ["triage"]
---
body:
  - type: markdown
    attributes:
      value: |
        Free-form report. If your topic is a **question**, consider
        [Discussions → Q&A](https://github.com/YOUR_USERNAME/FED-Indeed/discussions/categories/q-a)
        instead — answers there stay searchable for everyone.

        **Privacy reminder:** no real resumes or personal data, ever.
  - type: input
    id: summary
    attributes:
      label: One-line summary
      description: What is this about?
      placeholder: "Proposal: rename the 'Borderline' band to 'Needs Work'"
    validations:
      required: true
  - type: textarea
    id: details
    attributes:
      label: Details
      description: The full story — what, why, and (if applicable) what you'd like to happen.
    validations:
      required: true
  - type: textarea
    id: context
    attributes:
      label: Additional context
      description: Links, screenshots (synthetic data only), or anything else useful.
    validations:
      required: false
