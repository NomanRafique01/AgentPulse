---
name: ui-design-principles
description: >-
  Two-pass UI design reviewer and visual hierarchy auditor. Reviews UI layouts against the product brief, visual balance, typography rhythm, whitespace allocation, and contrast before building or shipping. Use when reviewing UI designs, checking visual composition, or planning pages. Triggers: $ui-principles, ui-design:, 'ui design principles', 'review design'.
metadata:
  category: frontend
---
# UI Design Principles

**ANNOUNCE:** "Reading `ui-design-principles` — running two-pass design process."

The design lead approach: every client gets a distinct visual identity that is not mistaken for anyone else's. Deliberate, opinionated choices. Aesthetic risk when justified.

---

## The 5 AI Design Clusters to Avoid

For calibration — these patterns appear in AI-generated design regardless of the brief:

1. **Warm cream** (~#F4F1EA) + high-contrast serif display + terracotta accent (~#D97757)
2. **Near-black background** + single bright acid-green or vermilion accent
3. **Broadsheet layout** with hairline rules, zero border-radius, dense newspaper columns
4. **SaaS card kit** — identical rounded cards, same `rgba(0,0,0,.1)` shadow, gradient decoration
5. **Template chrome** — tracked-out ALL-CAPS eyebrows, '·' meta strings, '→' on links, monospace labels, tinted near-black (#0B0B0B standing in for black)

All are legitimate for *some* briefs. They are defaults, not choices. Where the brief pins a direction, follow it exactly. Where it leaves an axis free, do not spend that freedom on one of these.

---

## Pass 1 — Design Plan

Before writing any code, create a compact token system:

```
COLOUR: [4–6 named hex values with roles — ground, ink, accent, field]
TYPE: [typefaces and their roles — display, body, mono (if needed)]
LAYOUT: [one-sentence layout concept + ASCII wireframe alternatives]
PRINCIPLES: [3–5 high-level rules that make THIS page unique]
```

**Ground your choices in the subject matter:**
- The subject's industry, materials, and vernacular are where distinctive visual choices come from
- A dashboard for financial analysts will be visually different from a toy for 8-year-olds
- Build with real content and subject matter throughout

---

## Pass 2 — Uniqueness Review (Mandatory Before Building)

Check every part of the plan:
> "If I ran a similar prompt for a different project in the same category, would I arrive at this same solution?"

If yes to any element — revise that element. State what you changed and why. Only after confirming relative uniqueness should you write the code.

This is how you avoid being the average of everything you've seen.

---

## Hero Rule

The hero is the first thing viewers see. Open with the most characteristic thing in the subject's world. Options:
- A headline (if the words are strong enough)
- An image (if the project has a strong one)
- An animation or live demo
- An interactive moment

**A big number with a small label, supporting stats, and a gradient accent is the default treatment.** Only use it if it's genuinely the best option for THIS brief.

---

## Typography Rules

- Choose typefaces deliberately — not the defaults you'd reach for on any project
- Set a clear type scale following The Elements of Typographic Style
- Line lengths under 80 characters (serif can go slightly longer)
- Serif body text gets slightly more line-height than sans-serif

**These are the commonest typographic AI tells — avoid them:**
- Single word or phrase accented differently in a headline (italic, bold, or different colour)
- All caps for labels
- Unnecessary typographic labels above content

---

## Motion Rule

Use non-user-triggered motion **sparingly and deliberately, only to draw attention.**

One orchestrated moment — one page-load sequence or one reveal — lands better than scattered effects. Fade-and-slide-up entrances on each section and hover transitions on every card are the generic default and read as AI-generated.

Motion that answers a person's action (opening, expanding, confirming) is welcome when it shows what changed.

---

## Copy Rules

Words appear in a design for one reason: to make it easier to understand and use.

- Write from the end user's perspective
- Name things by what users understand, not how the system is built
- Active voice as default
- CTA says exactly what happens: "Save changes", not "Submit"
- An action keeps the same name through the whole flow
- Failure messages explain what went wrong and how to fix it — they never apologize
- Tone: conversational, plain verbs, sentence case, no filler

---

## Restraint Rule

Spend your boldness in one place. Let one element be the memorable thing. Keep everything around it quiet and disciplined. Cut any decoration that does not serve the brief.

**Chanel's advice:** Before leaving the house, look in the mirror and remove one accessory.

