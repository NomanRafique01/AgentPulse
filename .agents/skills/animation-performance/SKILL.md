---
name: animation-performance
description: >-
  GPU composite layer optimizer and animation performance tuner. Fixes janky animations and dropped frames by eliminating layout thrashing and forcing transform/opacity GPU compositing within a 60fps budget. Use when animations lag, stutter, drop frames, or spike CPU usage. Triggers: $animation-performance, anim-perf:, 'fix animation lag', 'tune motion performance'.
metadata:
  category: frontend
---
# Animation Performance

**ANNOUNCE:** "Reading `animation-performance` — diagnosing and fixing frame drops."

**The budget:** 16.67ms per frame at 60fps. Every animation must stay inside it.

---

## The Pipeline (Know This First)

Every frame costs: **JavaScript → Style → Layout → Paint → Composite**

Triggering Layout is expensive. Triggering Paint is expensive. Composite is cheap.

**Cheap properties (composite only):**
- `transform: translate / scale / rotate / skew`
- `opacity`

**Expensive properties (trigger layout or paint):**
- `width`, `height`, `top`, `left`, `margin`, `padding` → triggers layout
- `background-color`, `color`, `border-color` → triggers paint
- `box-shadow`, `filter` → triggers paint
- `clip-path` → triggers paint (sometimes layout)

**Rule:** If it's not `transform` or `opacity`, question whether it needs to animate.

---

## Diagnosing a Jank Problem

Before fixing anything, identify the cause:

1. **Open Chrome DevTools → Performance tab**
2. Record 3 seconds of the jank
3. Look for frames over 16ms
4. Identify what caused them: Long tasks? Layout recalculations? Paint?

Common causes:
- `width`/`height` animation forcing layout recalculation every frame
- React state updates inside `requestAnimationFrame` causing re-renders per frame
- CSS variables inherited by too many elements being updated on scroll
- `backdrop-filter: blur()` on large areas — extremely expensive on most hardware
- Too many elements with `will-change: transform` (overcrowds GPU memory)

---

## Fixes by Cause

**Animating layout-triggering properties:**
```css
/* WRONG */
transition: height 300ms ease;

/* RIGHT — animate a transform instead */
transform: scaleY(0);
transform-origin: top;
transition: transform 300ms ease;
```

**React re-renders per frame:**
- Move animation state out of React (use refs, not useState)
- Use Framer Motion's `useMotionValue` + `useTransform` — bypasses React render cycle
- Use WAAPI directly for scroll-linked animations

**CSS variables on scroll:**
- Scope the variable update to the element that needs it, not `:root`
- Prefer `transform` + `offsetTop` calculations over variable updates

**Blur on large areas:**
- Reduce blur radius (every 1px matters)
- Apply to a smaller element
- Consider a frosted-glass alternative without `backdrop-filter`

**`will-change` overuse:**
- Only add `will-change: transform` to elements actively animating
- Remove it after animation completes
- Do not add it pre-emptively "just in case"

---

## Framer Motion Hardware-Accelerated Path

Framer Motion bypasses React's render cycle when you use:
- `motion.div` with `animate` prop — uses WAAPI under the hood
- `useMotionValue` + `useTransform` — reads/writes directly to style, no re-render
- `layout` prop — uses FLIP technique (cheap layout animations)

Avoid: updating Framer Motion values via React `useState` — this forces a re-render.

---

## Quick Wins Checklist

- [ ] Replace `width`/`height` animation with `transform: scaleX/scaleY`
- [ ] Replace `top`/`left` animation with `transform: translate`
- [ ] Replace `background-color` crossfade with opacity on layered elements
- [ ] Add `will-change: transform` to actively animating elements only
- [ ] Remove `backdrop-filter` or reduce its area
- [ ] Move scroll handlers to `requestAnimationFrame` or `useMotionValue`
- [ ] Use `IntersectionObserver` instead of scroll event listeners for entrance animations

