# [Pinned] Welcome to FED-Indeed — start here

> Maintainer note: post in **📣 Announcements**, then pin. Delete this note
> before posting.

Hi, and welcome. 👋

If you're here, you've probably had the experience: qualified for a job,
heard nothing back, and no way to know why. The honest answer, a lot of
the time, is that a parser read your resume before any human did — and
parsers are much pickier about *format* than any recruiter.

**FED-Indeed exists to show you that side of the conversation.** It
extracts your PDF the way the machines do, shows you the raw text they
get, scores the keyword overlap, and flags the structural landmines —
image-only exports, scrambled columns, unreadable dates — that get
applications silently discarded. Free, open-source (MIT), and it runs on
your machine. Your resume never leaves your session.

## Three ways to jump in

1. **Just use it.** `pip install -r requirements.txt` → `streamlit run
   app.py`. Docs: [usage.md](../../usage.md), and the
   [wiki](../../wiki/) explains every check honestly, limits included.
2. **Tell us what broke.** The most valuable thing you can give this
   project is a *field report*: something a filter did to your (synthetic
   example of a) resume that surprised you. Those reports literally become
   new checks in the engine. → [starters/what-broke-your-resume.md](../starters/what-broke-your-resume.md)
3. **Build with us.** Good first issues are labelled
   [`good first issue`](https://github.com/YOUR_USERNAME/FED-Indeed/labels/good%20first%20issue);
   the [contributing guide](../../CONTRIBUTING.md) has the full workflow,
   and [wiki/Adding-New-Checks.md](../../wiki/Adding-New-Checks.md) walks
   you through your first parser heuristic end to end.

## The one rule that matters most

**No real resumes or personal data in threads — ever.** Redact, or make a
synthetic example. Everyone here is in this community *because* they don't
want their job-search data floating around; protecting that is
non-negotiable. (Full [Code of Conduct](../../CODE_OF_CONDUCT.md).)

Glad you found us. Now go make the machines read you fairly. 🔍
