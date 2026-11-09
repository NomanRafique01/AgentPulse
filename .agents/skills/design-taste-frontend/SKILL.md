---
name: design-taste-frontend
description: >-
  Anti-slop frontend art direction engine distilled from 247 curated award sites. Replaces generic AI templates with subject-derived palettes, fluid typography, asymmetric layouts, and screenshot critique loops. Use when designing or polishing web pages, landing screens, or apps. Triggers: $taste, kill-slop:, 'design taste', 'taste kill', 'award-level ui'.
metadata:
  category: frontend
---
# tasteskill v2 — Art Direction & Anti-Slop Decision Procedure

A page built by a model usually looks like the average of every page the model has seen: a centered headline over three lines, a little label above it, a row of icon cards, a soft gradient, and a monospace caption. This skill replaces those defaults with deliberate, subject-grounded design decisions.

---

## Decision Procedure (The 10-Step Run)

### 1. Read the Brief & the Subject
- Read the whole brief, existing codebase, styling method, and dependencies.
- Identify the subject's physical, cultural, or historical reality (materials, instruments, terrain, operations). Do not invent styling detached from the subject.

### 2. Write the Argument
- In three sentences, write: (1) what this thing really is, (2) who it is for, and (3) the one visual metaphor or premise that carries the page.

### 3. Draw the Direction
- Pick or deal an art direction tailored to the argument: palette derived from the subject, font pairing with high editorial character, and an asymmetric hero layout.
- For deep options and dealt direction catalogues, see [references/direction-draw.md](references/direction-draw.md) (Load only when choosing or customizing visual archetypes).

### 4. Find the Idea
- Every memorable site has one non-standard visual idea derived from what the product actually does. Never settle for generic 3-card feature rows.

### 5. Write the Words
- Headlines must be two lines or fewer at every viewport width.
- Statements are marked up as `<p>` or `<blockquote>` at statement size (≤ 36px desktop, ≤ 24px phone).
- Strip performative marketing rhetoric; write concrete nouns and verifiable numbers.

### 6. Build It, Still
- Establish CSS custom property tokens for color, typography scale, and fluid spacing.
- Build the page with motion disabled first; structure must look complete and balanced statically.
- For token foundations, hero composition rules, and section blueprints, see [references/building-and-composition.md](references/building-and-composition.md) (Load only when implementing layout tokens and section markup).

### 7. Gate
- Run browser inspection and linting. Zero tolerance for banned AI tells: no pill badges, no eyebrow labels, no purple/indigo blur blobs, no identical 3-column cards.
- Check contrast ratios and ensure responsive fluid scaling.

### 8. Look
- Render screenshots at 375px (mobile), 768px (tablet), and 1440px (desktop).
- Inspect hierarchy, margins, void closures, and headline wrapping. Fix any awkward wraps or unbalanced voids.

### 9. Move
- Add animation only after static composition passes inspection.
- Enforce a 16.6ms frame budget; use GPU-accelerated transforms and opacity only. Respect `prefers-reduced-motion`.

### 10. Report
- Deliver before/after verification, citing typography pairings, palette contrast scores, and screenshot validation.

---

## Reference Architecture

Load these reference documents on demand as required during the run:

| Reference Document | Load Trigger / When to Read |
|---|---|
| [references/house-rules.md](references/house-rules.md) | Load only when verifying layout constraints, headline wrapping, margin balance, or banned AI UI tells. |
| [references/laws-of-the-craft.md](references/laws-of-the-craft.md) | Load only when refining typographic hierarchy, spatial rhythm, density balance, or color proportions. |
| [references/special-cases.md](references/special-cases.md) | Load only when handling redesigns, isolated components, headless environments, or no-network setups. |
| [references/app-screens.md](references/app-screens.md) | Load only when designing dashboards, admin panels, analytics views, data tables, or app settings. |
| [references/direction-draw.md](references/direction-draw.md) | Load only when dealing archetypes, selecting palettes, or querying photographic directions. |
| [references/building-and-composition.md](references/building-and-composition.md) | Load only when scaffolding CSS tokens, fluid layouts, hero compositions, and section blueprints. |
