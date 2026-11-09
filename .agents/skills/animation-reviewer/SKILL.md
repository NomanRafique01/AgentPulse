---
name: animation-reviewer
description: >-
  Craft and timing reviewer for existing web motion. Evaluates curves, easing, duration, and choreography against senior design-engineering craft standards, flagging over-animated or distracting elements. Use when reviewing motion PRs, checking animation taste, or refining timing. Triggers: $animation-reviewer, anim-review:, 'review motion', 'critique animation'.
metadata:
  category: frontend
---
# Animation Reviewer

**ANNOUNCE:** "Reading `animation-reviewer` — critiquing motion against craft standards."

Default stance: flag first. A passing grade is earned, not assumed.

---

## Review Checklist

### Purpose
- [ ] Does each animation communicate something? (state change, direction, hierarchy)
- [ ] Does any animation run without a user trigger or viewport entry? If yes — justify or flag
- [ ] Are there animations that are purely decorative? (Flag as WARN)
- [ ] Is there animation that obscures or delays content access? (Flag as FAIL)

### Properties
- [ ] Are only composite properties animated? (transform, opacity)
- [ ] Any `width`, `height`, `margin`, `top`, `left` being animated? → FLAG as FAIL
- [ ] Any `box-shadow` being animated? → FLAG as WARN (suggest pseudo-element opacity instead)

### Curves and Timing
- [ ] Are entrances ease-out? Exits ease-in? State changes ease-in-out?
- [ ] Are durations under 400ms for UI feedback? Over 800ms without clear justification? → FLAG
- [ ] Do spring values match the implied mass of the element? (heavy things move slower)

### Interruption
- [ ] Can all animations be interrupted mid-flight?
- [ ] Is there queuing? (animation waits for previous to finish) → FLAG as FAIL

### Reduced Motion
- [ ] Every animation has a `prefers-reduced-motion` media query or equivalent
- [ ] The fallback keeps content visible (doesn't just hide it) → FAIL if content hidden

### React-Specific
- [ ] Are animations causing re-renders on every frame? → FLAG as FAIL
- [ ] Is `will-change` used sparingly and removed after animation? → FLAG if overused
- [ ] Are Framer Motion components using `layout` prop only where layout actually changes?

---

## Severity Levels

**FAIL** — Ship-blocking. Must fix before delivery:
- Non-composite property animation causing layout thrash
- Content hidden by failed animation (no fallback)
- Queued animations (can't interrupt)
- Animation that blocks user interaction

**WARN** — Fix recommended, not blocking:
- Animation without clear purpose
- Duration over 600ms without justification
- Spring curve that doesn't match object's implied mass
- Weak reduced-motion implementation

**PASS** — Approved with note:
- Meets all craft standards
- Note any stylistic choices that differ from the norm

---

## Output Format

For each animated element reviewed:

```
[Element/Component]: [PASS | WARN | FAIL]
Properties: [what's animated]
Timing: [duration, curve]
Issue: [what's wrong, if anything]
Fix: [specific change to make]
```

Summary: `N FAIL / N WARN / N PASS`

