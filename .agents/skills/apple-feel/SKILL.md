---
name: apple-feel
description: >-
  Apple-grade fluid interaction and spring physics craftsman. Implements iOS/macOS tactile micro-interactions, momentum scrolling, rubber-banding, fluid gesture tracking, and refined haptic feel. Use when building mobile-first web apps, touch interactions, or Apple-style UX. Triggers: $apple-feel, apple-ui:, 'apple feel', 'ios interactions', 'fluid gestures'.
metadata:
  category: frontend
---
# Apple Feel

**ANNOUNCE:** "Reading `apple-feel` — applying Apple-style physics and design principles."

Apple's UI doesn't look designed. It feels inevitable. The goal is not to imitate Apple — it's to understand *why* their decisions work and apply the same reasoning.

---

## The Four Foundations

### 1. Feedback
Every interaction produces immediate feedback. The UI never ignores you.
- Tap: button dims (opacity to 0.6) within 1 frame, restores on release
- Swipe: content moves with your finger at 1:1 ratio — no lag
- Long press: haptic feedback + visual state change together

### 2. Spatial Consistency
Elements have a place in space. Navigation feels like moving through rooms, not loading pages.
- Push navigation: new view slides in from the right, old view slides partially left
- Back: reverses the spatial direction — right to left
- Modal sheet: rises from the bottom, can be dismissed by dragging down
- The user always knows where they are in the spatial hierarchy

### 3. Physical Plausibility
Motion behaves like objects with mass and momentum.
- Heavy things accelerate and decelerate slowly
- Light things snap quickly
- Released objects follow through (overshoot and settle, not hard stop)
- Interrupted gestures respond to velocity, not just position

### 4. Restraint
Decoration is absent. Every pixel earns its place.
- One typeface (SF Pro). One weight range. Optical sizing.
- Translucency communicates depth, not decoration
- Blur is for hierarchy, not aesthetics
- Colour is used for information (red = danger, blue = action)

---

## Spring Animation Values

Apple uses springs everywhere. CSS transitions feel wrong next to springs because they don't have momentum.

```js
// Framer Motion spring — use as a starting point, tune to the element's implied mass
const spring = {
  type: "spring",
  stiffness: 400,   // Higher = snappier
  damping: 40,      // Higher = less bouncy
  mass: 1           // Higher = heavier
}

// Light UI elements (tooltips, small popovers)
{ stiffness: 500, damping: 35, mass: 0.8 }

// Medium elements (cards, sheets, drawers)
{ stiffness: 300, damping: 30, mass: 1 }

// Heavy elements (full-screen modals, pages)
{ stiffness: 200, damping: 28, mass: 1.2 }
```

---

## Gesture Patterns

### Swipe-to-Dismiss
```
1. Follow finger at 1:1 ratio (no lag, no resistance until threshold)
2. At 40% of element width: show delete affordance
3. Release: if velocity > 200px/s → dismiss; if < 200px/s → spring back
4. Dismiss animation: continue in the direction of the swipe, fade opacity
5. Never use ease curves on gesture — follow finger with spring
```

### Drag
```
1. Item lifts: scale(1.05) + shadow increase, 150ms spring
2. Follows finger exactly — no easing during drag
3. Other items make room (layout animation with FLIP)
4. Drop: scale(1) + shadow decrease, spring settle
5. Invalid drop zone: spring back to origin
```

### Pull to Refresh
```
1. Resist pull with friction (move at 0.3× finger velocity)
2. At threshold: haptic feedback + indicator becomes active
3. Release: indicator stays, content loads
4. Done: indicator exits upward, content fades in
```

---

## Translucency and Depth

Apple's blur is not for aesthetics — it communicates that content is beneath. Rules:
- Only blur when something genuinely sits above content (navigation bar, modal backdrop)
- `backdrop-filter: blur(20px) saturate(1.8)` — saturation boost makes it feel real
- The blur surface has a semi-transparent background: `rgba(255,255,255,0.7)` (light) or `rgba(0,0,0,0.6)` (dark)
- Never apply blur to decorative elements

---

## Typography (SF Pro Equivalents for Web)

Apple's type system prioritizes readability at all sizes:
- Optical sizing: headline weight is lighter, body weight is slightly heavier
- Tight tracking at large sizes: -0.02 to -0.04em at display sizes
- Generous tracking at small sizes: +0.01em under 12px
- Line height: 1.2 for headlines, 1.45 for body
- Web equivalents: Inter (optical sizing support), Plus Jakarta Sans, or system-ui

---

## Reduced Motion

Apple has the most robust reduced-motion system:
```css
@media (prefers-reduced-motion: reduce) {
  /* Spatial transitions become crossfades */
  .page-transition { animation: fade 150ms ease; }
  /* Springs become instant */
  .spring { transition: none; }
  /* But state changes still happen — just instantly */
}
```

The key: content still changes. Only the travel is removed.

