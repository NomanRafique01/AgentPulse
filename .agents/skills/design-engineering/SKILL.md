---
name: design-engineering
description: >-
  Micro-interaction and 9-state design-engineering polish specialist. Crafts robust interactive states (idle, hover, active, focus-visible, loading, disabled, empty, error, success) with tactile feedback and spring physics. Use when polishing buttons, inputs, dropdowns, and interactive widgets. Triggers: $design-engineering, polish-ui:, 'ui polish', 'design engineering', 'nine states'.
metadata:
  category: frontend
---
# Design Engineering

**ANNOUNCE:** "Reading `design-engineering` — applying the craft layer to this UI."

Great software feels inevitable. The craft is invisible when it works. It's conspicuously absent when it doesn't.

---

## The Philosophy

Software that feels great is engineered, not designed. The difference between a polished product and a functional one is hundreds of small decisions, each made correctly:
- The right easing curve on a transition
- The right opacity for a disabled state
- The right gap between a label and its input
- The right truncation strategy for a long name
- The right empty state for a list

None of these decisions are obvious. All of them are noticed when wrong.

---

## The Invisible Polish Checklist

Run through these for every component:

### States
Every interactive element must have all these states designed:
- **Default** — the resting state
- **Hover** — only when pointer device is present (`@media (hover: hover)`)
- **Active/pressed** — immediate tap feedback
- **Focus** — visible keyboard focus (not just `outline: none`)
- **Disabled** — reduced opacity (0.5–0.6), cursor: not-allowed, no pointer events
- **Loading** — skeleton or spinner that maintains the element's dimensions
- **Error** — clear indication of what failed and how to fix it
- **Success** — confirmation that the action worked
- **Empty** — a designed state, not a blank screen

### Typography Polish
- All text truncates gracefully (`text-overflow: ellipsis` with `overflow: hidden`)
- Long words don't break layout (`overflow-wrap: break-word` on user-generated content)
- Numbers that align use tabular figures (`font-variant-numeric: tabular-nums`)
- Heading hierarchy is visually clear without relying on semantic tags alone
- Letter spacing at large sizes: -0.02 to -0.04em
- Line-height matches the font's design (check x-height, not just cap-height)

### Spacing Consistency
- Use a spacing scale (4px base: 4, 8, 12, 16, 24, 32, 48, 64)
- Consistent padding within similar component types
- Icon-to-text gap is always the same (typically 8px or 12px)
- Section vertical rhythm uses the same scale

### Colour Usage
- Semantic colours: danger (red), warning (amber), success (green), info (blue)
- These colours don't appear without semantic meaning
- Disabled states use the same colour at lower opacity, not a different colour
- Focus rings match the interactive element's colour, not a generic blue

### Interactive Element Sizing
- Minimum touch target: 44×44px (even if the visual element is smaller, use padding)
- Related controls (radio buttons, checkboxes) are large enough to tap by label
- Slider thumbs are at least 20px diameter
- Close/dismiss buttons are at least 44px tap target

---

## Micro-Interaction Patterns

**Number change (counter, score, stat):**
```
When value changes: count up or down with a brief animation
Duration: 300–600ms depending on the magnitude of change
Easing: ease-out
Colour flash: brief pulse in the change direction colour (green for increase, red for decrease)
```

**Copy to clipboard:**
```
1. User clicks → immediate visual feedback (button dims)
2. Text copies
3. Button label changes: "Copy" → "Copied ✓"
4. After 2s: label returns to "Copy" (fade transition)
Never show: "Copied!" toast + changed button label simultaneously — pick one
```

**Form validation:**
```
Validate: on blur (not on keypress — too aggressive)
Error state: border colour change + error message below field
Recovery: error clears on next valid keystroke (not on next blur)
Success state: subtle — don't overdo it
```

**List item actions (delete, archive):**
```
1. User taps action
2. Item fades to 60% opacity immediately
3. Undo toast appears (3s timer)
4. If no undo: item collapses height, other items fill space (animated)
5. If undo tapped: item restores with a brief highlight
```

---

## The Audit Pass

When polishing a finished UI, do one focused pass per category:
1. **States pass** — find every interactive element, check all 9 states exist
2. **Spacing pass** — screenshot, overlay a grid, find inconsistencies
3. **Type pass** — find every text element, check truncation, hierarchy, sizing
4. **Motion pass** — list every state change, check if it animates correctly
5. **Colour pass** — check semantic colour usage, disabled states, focus rings

One pass per category. Do not try to do all five at once.

