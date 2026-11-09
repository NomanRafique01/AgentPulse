---
name: animation-opportunities
description: >-
  Motion opportunity scout and interaction enhancer. Analyzes static interfaces to identify high-value moments for purposeful motion: loading skeletons, state reveals, layout transitions, and feedback responses. Use when a UI feels static, lifeless, or needs engaging micro-interactions. Triggers: $animation-opportunities, motion-spots:, 'find animations', 'motion opportunities'.
metadata:
  category: frontend
---
# Animation Opportunity Finder

**ANNOUNCE:** "Reading `animation-opportunities` — finding what should move and what shouldn't."

Read-only. Propose with exact values. Do not implement.

---

## The Filter (Run First)

For every candidate, ask: **"Does motion here communicate something the static state doesn't?"**

If no → reject. If yes → continue.

Reject automatically:
- Hover effects that delay content reading
- Animations on elements the user is not interacting with
- Page-load animations on every element simultaneously
- Purely decorative motion (spinning logos, floating orbs)
- Anything that could hide content if JavaScript fails

---

## High-Value Opportunity Categories

### 1. State Transitions (Almost Always Should Animate)
- Form submit → loading state → success/error
- Toggle on/off (checkbox, switch, tab)
- Accordion open/close
- Dropdown open/close
- Modal/sheet appear/dismiss
- Toast notification appear/dismiss

### 2. List Mutations (Usually Should Animate)
- Item added to list (slide in + fade in)
- Item removed from list (fade out + height collapse)
- Item reordered (FLIP animation)
- Filter applied (items that leave and items that stay)

### 3. Navigation (Context-Dependent)
- Route change (only if there's a spatial relationship to communicate)
- Tab switch (slide direction based on which tab)
- Breadcrumb drill-down

### 4. Feedback (Should Almost Always Animate)
- Button press (scale down slightly — feels physical)
- Input focus (subtle border or glow change)
- Error shake (when form submit fails — communicates rejection)
- Success confirmation (checkmark reveal)

### 5. Data Loading (Almost Always Should Animate)
- Skeleton screens (shimmer pulse)
- Progressive content reveal (as data arrives)
- Number count-up for stats

---

## How to Propose Each Opportunity

For each found opportunity, provide:
```
ELEMENT: [component or selector]
FILE: [path:line]
OPPORTUNITY TYPE: [state-transition / list-mutation / feedback / loading / navigation]
SHOULD ANIMATE: YES / NO / MAYBE
REASONING: [one sentence — what does motion communicate here?]
PROPOSED IMPLEMENTATION:
  - Property: [transform: scale / opacity / translateY / etc.]
  - Tool: [CSS transition / Framer Motion layout / WAAPI]
  - Duration: [ms]
  - Curve: [ease-out / spring / ease-in-out]
  - Trigger: [user action / state change / IntersectionObserver]
  - Reduced-motion fallback: [instant / static]
PRIORITY: HIGH / MEDIUM / LOW
```

---

## Output Format

Group by priority:

```markdown
## High Priority Opportunities (Direct user impact)
[List]

## Medium Priority (Nice to have)
[List]

## Rejected Candidates (Should NOT animate)
[List with reason]
```

Total: X opportunities found, X accepted, X rejected

