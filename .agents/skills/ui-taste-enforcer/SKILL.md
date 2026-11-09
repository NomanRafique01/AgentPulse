---
name: ui-taste-enforcer
description: >-
  Anti-slop frontend art direction enforcer. Replaces generic web design clichés with subject-specific art direction, bespoke palettes, asymmetric layouts, and purposeful editorial typography. Use when designing or polishing web applications, marketing pages, or components. Triggers: $ui-taste, taste-enforcer:, 'ui taste', 'enforce taste'.
metadata:
  category: frontend
---
# UI Taste Enforcer

**ANNOUNCE:** "Activating `ui-taste-enforcer` — running anti-slop design protocol."

A page built by a model usually looks like the average of every page the model has seen: a centred headline over three lines, a little label above it, a row of icon cards, a soft gradient, a few thin rules and a monospace caption. Nothing in it is wrong and nothing in it was decided.

This skill replaces defaults with decisions.

---

## Step 0 — Inventory the Subject

Before any design decision, list 8–12 things that belong to THIS client and no competitor:
- Its name and what it means
- Its address, street, neighbourhood, what that place looks like
- The numbers in the brief (seats, rooms, years, price)
- Its constraint (only one batch a month, closed in winter, by appointment)
- Its materials, colours, rituals, hours
- The printed things of its world (timetable, label, ticket, sign)

This list is where the idea comes from. Not the category. **The competitor test:** put the nearest real competitor in your idea sentence. If it still works, the idea belongs to the category — redesign it.

---

## Step 1 — Write the Argument

Before any design, list the page as claims with proof, one line per section:
```
Hero: [claim] — [proof]
Section 2: [claim] — [proof]
...
```

Delete any section that has no claim. This avoids: hero → logos → 3 features → testimonial → pricing → CTA.

---

## Step 2 — Find the Idea

Write this sentence before building anything. Both blanks must come from the subject itself:
> "On this page, **[something that belongs only to this subject]** becomes **[the design device]**."

If you can't fill it in, you don't have an idea yet. Do not start building.

---

## Step 3 — House Rules (Inspector Enforced)

These are banned. No exceptions:

| Banned | Replace With |
|---|---|
| Warm cream background + terracotta accent | The dealt palette for this project |
| ALL-CAPS eyebrow label above heading | Put the info in the heading or drop it |
| 'A · B · C' dot-separated meta strings | Remove or restructure |
| 'WORD — fragment' with spaced em dash | Plain sentence |
| Soft grey card shadows (rgba(0,0,0,.1)) | Tone step between surfaces, no shadow |
| Gradient backgrounds, blobs, washes | Flat colour or real photograph |
| Icon-topped feature card rows | The actual section blueprint for this project |
| Pill badge above headline | Remove entirely |
| Monospace font for small data labels | The text face, tabular figures |
| "→" appended to every button/link | Button with a label that says what it does |
| Hairline dividers, 1px outlined boxes | Space, or a step in background tone |
| Index numbering (01 / 02 / 03) | Order shown by position and words |
| Styled accent word in headline (italic/colour) | One face, one colour. Words carry emphasis |
| Two-line headline at narrow width | Cut words. Then widen measure. Size last. |
| Gradient or glow on buttons | Flat, one fill, square-cornered or full pill — decided once |

---

## Step 4 — Laws of the Craft

**Type**
- Two or three sizes do the visible work: one very large, one small, nothing in between
- Headline-to-body ratio: target 4.3x (best sites go to 8.4vw on display)
- Display: tracking -0.02 to -0.05em, leading 0.85–1.05
- Body: 16–20px, 45–75 chars/line, leading 1.45–1.6
- Five sizes on a page is the ceiling. One family is normal.
- Left-aligned by default. Centre at most one moment.

**Space**
- One grid, one pair of tight margins (16–32px), used everywhere
- Section gap clearly larger than intra-section gap: 120–240px on desktop
- Each section has a different composition from its neighbours
- No blank stretch taller than half a screen

**Colour**
- One ground, one ink, one accent
- Accent appears on the action and perhaps one other thing
- Running text in the full ink — grey reads unfinished
- Surfaces separated by tone step, never by a line or shadow

**Imagery**
- Minimum 4 real pictures (photographs, archival images, maps, engravings) — 6–12 preferred
- One dominant image beats six small ones
- No image is better than a placeholder. A drawn picture beats a placeholder.
- Every found image is downloaded, credited on page, listed in report

---

## Step 5 — Build Order

1. CSS tokens (colour + type roles as custom properties)
2. Hero — exactly as the blueprint says, at desktop and phone width
3. Each section from its blueprint with real project content
4. Imagery (project's own → generated → open archives → drawn in code → flat colour)
5. The one live interactive thing from the brief
6. Scroll scenes if the direction calls for them
7. Fullness check: every desktop screen as a poster — one dominant thing
8. Frame check: equal margins, no void without something closing it
9. States: real links, visible focus, alt text, phone layout as own composition
10. Motion layer (after static version is fully done)

---

## Step 6 — Gate Before Shipping

Run these checks:
```bash
node <skill>/scripts/lint.mjs <source>
node <skill>/scripts/inspect.mjs <url or path>
```

Fix every FAIL. Treat WARN as wrong unless you can defend it to a designer in one sentence.

The inspector measures: headline line counts, type sizes, colours, rules, shadows, gradients, contrast, overflow, margins, blank stretches, untitled sections.

Do not argue with the meter.

---

## Step 7 — Critique Loop

After gate passes:
- Open every screenshot at 1440, 768, 390px
- Score with the critique rubric (14 passes, Awwwards-weighted)
- Write the critique down
- Fix top 3 problems
- Run gate again
- Maximum 3 rounds

---

## Red Flags (Stop and Rethink)

- You cannot fill in the idea sentence with specifics — you have a category idea, not a project idea
- The hero could belong to any competitor in this sector
- You have fewer than 4 real images
- Any section is a card grid identical to its neighbours
- The palette came from somewhere other than the project's own materials

