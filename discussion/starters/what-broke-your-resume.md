# What did a filter break on your resume? (Field reports)

> Maintainer note: post in **💬 General** (or Ideas) as a seed thread.
> Delete this note before posting.

Every check in FED-Indeed started as somebody's bad day: a qualified
person, a silent rejection, and eventually a clue about what the machine
did wrong. The image-export check, the multi-column alert, the timeline
validation — all field reports first.

This thread collects the next ones. **What failure mode have you seen?**

## The format that helps most

You don't need to be sure — "I think" is fine, hunches have been right
before. But the more of this you can include, the more likely it becomes a
shipped check:

1. **What the machine did** — rejected instantly, never even "viewed",
   garbled in an employer's portal, scored weirdly on a checker, etc.
2. **What the document was** — creating tool, columns, images/charts,
   tables, text boxes, header/footer content. *(Describe it — no real
   files.)*
3. **What you changed and what happened** — the before/after that isolated
   the culprit.
4. **Vendor-visible breadcrumbs, if any** — e.g. an application portal's
   auto-filled profile (garbled import = parse failure, on their side).

## Example (synthetic, but representative)

> Made a two-column resume in a design tool. Auto-fills on company portals
> came back with sentences like "Led migration Managed 4 interns" — left
> and right column text fused. Rebuilt single-column in a word processor:
> imports came back clean. Same content, different machine experience.

That report is why the multi-column check exists.

## Ground rules (the pinned-thread ones apply)

Synthetic examples only — no real resumes, no real names, yours or anyone
else's. Redacted anonymized descriptions of *behaviour* are gold; personal
data is an instant remove.

Maintenance note: reports that reproduce become
[issues](https://github.com/YOUR_USERNAME/FED-Indeed/issues) → checks in
the engine → entries in the
[ATS Field Guide](../../wiki/ATS-Field-Guide.md). Your bad day becomes the
next person's saved application. 🔍
