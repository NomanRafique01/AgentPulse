---
name: svg-icon-craftsman
description: >-
  Zero-slop SVG icon and vector graphic craftsman. Snaps vector geometry to a strict 24×24 grid with uniform 1.5px/2.0px strokes, clean integer coordinates, and semantic path structures, eliminating AI-generated bezier curve spaghetti. Use when creating or refining SVG icons and vector assets. Triggers: $icon, svg:, 'craft icon', 'svg craftsman', 'create icon'.
metadata:
  category: frontend
---
# SVG Icon Craftsman (Zero AI Slop Vector Protocol)

**ANNOUNCE:** "Reading `svg-icon-craftsman` — crafting clean, grid-snapped vector geometry."

---

## 1. Why AI-Generated SVGs Fail (The Tells)

AI models usually generate disastrous SVGs:
- ❌ Chaotic paths with 80 unneeded bezier nodes (`d="M12.344 18.231 C 14.21 ..."`).
- ❌ Inconsistent stroke widths (1.3px on one line, 2.7px on another).
- ❌ Un-snapped coordinates causing blurry sub-pixel antialiasing on standard displays.
- ❌ Mismatched stroke linecaps (`round` on one stroke, `butt` on another).
- ❌ Hardcoded colors (`#4F46E5`) instead of semantic `currentColor`.
- ❌ Giant viewBoxes (`0 0 1024 1024`) that cannot scale cleanly in component systems.

---

## 2. The Real Engineering Vector Specification

Every crafted icon must strictly comply with this standard:

```xml
<svg 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 24 24" 
  width="24" 
  height="24" 
  fill="none" 
  stroke="currentColor" 
  stroke-width="1.5" 
  stroke-linecap="round" 
  stroke-linejoin="round"
  aria-hidden="true"
>
  <!-- Clean, minimal, grid-snapped paths -->
</svg>
```

### The Iron Rules:
1. **Canonical Grid:** Standardize on `24×24` (or `20×20` for dense micro-UI).
2. **Consistent Stroke Weight:** Default to `1.5px` (refined) or `2.0px` (punchy). Never vary within a project.
3. **Integral Pixel Snapping:**
   - On a `24×24` grid with a `2px` stroke, centers must fall on integer pixels (`x="3"`, `y="3"`).
   - With a `1.5px` stroke, align to `0.5px` offsets to prevent boundary blur.
4. **Color Decoupling:** Always `stroke="currentColor"` and `fill="none"`. The parent CSS controls the color.
5. **Node Economy:** If a shape can be expressed with 4 coordinates, use 4. Never trace a rectangle with bezier curves.

---

## 3. Reference Glyph Recipes (Clean Vector Geometry)

### Terminal / Command Prompt Icon
```xml
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="4 17 10 11 4 5" />
  <line x1="12" y1="19" x2="20" y2="19" />
</svg>
```

### Database Storage Stack
```xml
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <ellipse cx="12" cy="5" rx="9" ry="3" />
  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
</svg>
```

### Git Branching Node
```xml
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="6" cy="6" r="3" />
  <circle cx="6" cy="18" r="3" />
  <path d="M6 9v6" />
  <circle cx="18" cy="9" r="3" />
  <path d="M6 9a9 9 0 0 1 9-9h3" />
</svg>
```

---

## 4. React / JSX Packaging Pattern

When generating icon components for a React/Next.js/Tailwind stack:

```tsx
import type { SVGProps } from 'react';

export function TerminalIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-5 ${className ?? ''}`}
      aria-hidden="true"
      {...props}
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}
```

---

## 5. Verification Checklist

- [ ] Does it use `viewBox="0 0 24 24"`?
- [ ] Is `stroke="currentColor"` without hardcoded hex colors?
- [ ] Are all path coordinates snapped without wandering decimals?
- [ ] Is `stroke-width` consistent with the rest of the icon set?
- [ ] Is `aria-hidden="true"` included for decorative icons?

