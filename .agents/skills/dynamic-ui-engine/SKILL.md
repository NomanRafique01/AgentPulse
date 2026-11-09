---
name: dynamic-ui-engine
description: >-
  Master responsive sizing engine and fluid mathematical layout calculator. Computes CSS clamp() formulas, fluid typography scales, aspect ratios, and zero-CLS containers across 320px to 2560px viewports. Use for fluid typography, responsive scaling, and layout dimension calculations. Triggers: $dynamic-ui, dynamic-sizing:, 'fluid sizing', 'responsive clamp'.
metadata:
  category: frontend
---
# Dynamic UI Engine (Universal Responsive Standard)

**ANNOUNCE:** "Reading `dynamic-ui-engine` — enforcing universal fluid responsiveness and zero-breakage layout."

**The Golden Law:** A component must never assume its width. It must render perfectly inside a 320px mobile drawer, a 500px split pane, a 1440px desktop container, or a 4K display.

---

## 1. The Fluid Mathematics Equation

Replace fixed pixel sizes with fluid clamp formulas that scale smoothly across viewports:

```
clamp(MIN, PREFERRED, MAX)
PREFERRED = MIN_REM + ((MAX_PX - MIN_PX) / (MAX_VIEWPORT - MIN_VIEWPORT)) * 100vw
```

### Production Dynamic Token Set
```css
:root {
  /* Fluid Spacing Scale: 320px -> 1440px */
  --space-3xs: clamp(0.25rem, 0.2rem + 0.25vw, 0.375rem);
  --space-2xs: clamp(0.5rem, 0.45rem + 0.25vw, 0.625rem);
  --space-xs:  clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --space-sm:  clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
  --space-md:  clamp(1.5rem, 1.3rem + 1vw, 2rem);
  --space-lg:  clamp(2rem, 1.7rem + 1.5vw, 3rem);
  --space-xl:  clamp(3rem, 2.5rem + 2.5vw, 4.5rem);

  /* Fluid Typography Scale */
  --font-size-sm:   clamp(0.8125rem, 0.78rem + 0.16vw, 0.875rem);
  --font-size-base: clamp(0.9375rem, 0.9rem + 0.19vw, 1.0625rem);
  --font-size-lg:   clamp(1.125rem, 1.05rem + 0.38vw, 1.375rem);
  --font-size-xl:   clamp(1.375rem, 1.25rem + 0.63vw, 1.75rem);
  --font-size-2xl:  clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem);
  --font-size-hero: clamp(2.25rem, 1.8rem + 2.25vw, 4rem);
}
```

---

## 2. Dynamic Component Patterns

### Auto-Adapting Card Deck (Phone Single Stack ↔ Desktop Multi-Column)
```tsx
// Adapts automatically from 1 col on mobile to 2 col on tablet to 3-4 col on desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[var(--space-md)]">
  {items.map(item => (
    <div key={item.id} className="min-w-0 rounded-lg border border-neutral-200 p-[var(--space-sm)]">
      <h3 className="truncate text-[var(--font-size-lg)] font-semibold">{item.title}</h3>
      <p className="line-clamp-3 text-[var(--font-size-base)] text-neutral-600">{item.desc}</p>
    </div>
  ))}
</div>
```

### Aspect-Ratio Image Stability (Zero Cumulative Layout Shift)
Never load images without explicit aspect ratios:
```html
<div class="relative w-full aspect-video sm:aspect-[4/3] lg:aspect-[16/9] overflow-hidden rounded-lg bg-neutral-100">
  <img src="/photo.jpg" alt="Preview" class="h-full w-full object-cover" loading="lazy" />
</div>
```

---

## 3. The 5 Breakpoint Testing Matrix

Every completed UI component must be verified against all 5 standard breakpoints:

| Breakpoint | Target Device | Layout Requirement |
|---|---|---|
| `320px - 390px` | Small to Standard Phone | Single column, 100svh, 44px touch targets, bottom sheets. |
| `640px - 768px` | Large Phone / Tablet Portrait | 2-column grids, collapsed navigation rail, safe margins. |
| `1024px` | Tablet Landscape / Small Laptop | Multi-pane begins, sticky headers, visible secondary rail. |
| `1440px` | Standard Desktop Display | Full 3-column workstation, max density, keyboard shortcuts. |
| `1920px+` | Ultra-Wide Monitor | Content constrained to `max-w-7xl` or `max-w-screen-2xl`, centered. |

