# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | ✅ Yes |
| < 0.1   | ❌ No |

## Reporting a Vulnerability

**Do not open a public issue for security vulnerabilities.**

Please report privately via GitHub's
[Report a Vulnerability](https://github.com/YOUR_USERNAME/FED-Indeed/security/advisories/new)
feature (Security → Report a vulnerability on the repository page).

Include as much of the following as possible:

- Description of the issue and its impact
- Step-by-step reproduction instructions
- Affected file(s) and code path(s)
- Any suggested remediation

We aim to acknowledge reports within **72 hours** and will keep you informed
as we work toward a fix. Coordinated disclosure timelines are honoured; we
ask for up to 90 days before public disclosure.

## Security Model

FED-Indeed is designed to be privacy-preserving by construction:

- Uploaded PDFs are processed **in memory only** during the Streamlit
  session and are never written to disk by the application.
- Job description text lives only in session state.
- There is no database, no analytics, and no outbound network call other
  than the (optional, static) ko-fi image in the UI.

Known attack surfaces we monitor:

- **Malformed/hostile PDFs** — pdfplumber parses untrusted files; crashes or
  excessive resource use (zip bombs, huge fonts) are treated as bugs worth
  reporting.
- **Streamlit deployment misconfiguration** — when self-hosting, keep
  `--server.enableCORS` and authentication settings appropriate for your
  environment. See [DEPLOYMENT.md](DEPLOYMENT.md).

## Scope Notes

- Reports about the *simulated* ATS heuristics being inaccurate are not
  security issues — those belong in regular bug reports.
- Vulnerabilities in Streamlit or pdfplumber themselves should be reported
  to those upstream projects, though we appreciate a heads-up if the issue
  is being actively exploited against FED-Indeed deployments.
