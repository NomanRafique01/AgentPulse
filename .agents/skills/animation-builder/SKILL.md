---
name: animation-builder
description: >-
  Purposeful web motion designer and animator. Builds physics-based web animations, staggered transitions, micro-interactions, and state changes with custom easing and strict 16.6ms GPU frame budgets. Use when animating components, page transitions, menus, or interactive states. Triggers: $animation-builder, animate:, 'build animation', 'add motion'.
metadata:
  category: frontend
---
# Animation Builder

**ANNOUNCE:** "Reading `animation-builder` to make the right animation decisions first."

---

## Decision Order (Do Not Skip Steps)

### 1. Should It Animate At All?

Answer before writing a single line:
- Does motion communicate something the static state doesn't? (state change, direction, relationship)
- Does it answer a user action? (expanding, confirming, dismissing)
- Is it drawing attention to something important?

If no to all three — do not animate it. Motion that has no purpose is noise.

### 2. Which Properties?

**Composite-only (GPU, no layout thrash):**
- `transform: translate / scale / rotate`
- `opacity`

**Avoid animating:**
- `width`, `height`, `top`, `left`, `margin`, `padding` — causes layout recalculation
- `background-color` in complex components — consider opacity crossfade instead
- `box-shadow` — use opacity on a pseudo-element instead

### 3. Which Tool?

| Scenario | Tool |
|---|---|
| Simple enter/exit, state change | CSS transition or @keyframes |
| Spring physics, gesture-driven | Framer Motion / React Spring |
| Scroll-linked, timeline control | WAAPI (Web Animations API) |
| React Native | Reanimated (via `animate-expo` skill) |
| Complex orchestration | Framer Motion `animate`, `useAnimate` |

### 4. Which Curve and Duration?

**Entrances:** ease-out (starts fast, decelerates into place) — 200–400ms
**Exits:** ease-in (starts slow, accelerates out) — 150–250ms
**State changes:** ease-in-out — 150–300ms
**Spring:** stiffness 300, damping 30 as a starting point — tune for the object's implied mass

**Too slow is worse than too fast.** When in doubt, make it faster.

### 5. Interruption Behaviour

Every animation must be interruptible mid-flight:
- CSS transitions handle this natively
- Framer Motion handles this natively
- With WAAPI: cancel previous animation before starting new one
- Never queue animations — let the new one take over immediately

### 6. Reduced Motion

Every animation must have a `prefers-reduced-motion` fallback:
```css
@media (prefers-reduced-motion: reduce) {
  /* Either remove the transition, or make it instant */
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

For meaningful transitions (not just decoration), keep the state change but remove the travel.

---

## Common Recipes

**Section entrance (staggered):**
- Heading enters first
- Body text enters 60ms later
- Image/figure enters 120ms later
- Rise 16–32px with opacity from 0 to 1
- Triggered once as section enters viewport (IntersectionObserver)
- Never content that stays hidden if the script fails

**Button feedback:**
- Press: scale(0.97), 80ms ease-in
- Hover: background-color shift, 150ms ease
- Focus: visible outline, immediate (no animation on focus)
- Loading: replace label with spinner, disable, restore on complete

**Modal/sheet entrance:**
- Backdrop: opacity 0→1, 200ms ease
- Panel: translateY(16px)→0 + opacity 0→1, 200ms ease-out
- Exit: reverse, 150ms ease-in

---

## Output Format

After implementing, state:
1. What was animated and why
2. Which properties and tool were used
3. Duration and curve choices with reasoning
4. How reduced-motion is handled
5. How interruption is handled

