---
name: phone-layout-master
description: >-
  Mobile phone layout perfectionist (320px–480px). Enforces 100svh dynamic sizing, 44×44px minimum touch targets, thumb-zone bottom navigation sheets, and zero horizontal overflow. Use for mobile screens, phone views, and small-screen layouts. Triggers: $phone-layout, phone-ui:, 'phone layout', 'mobile screen layout'.
metadata:
  category: frontend
---
# Phone Layout Master (Mobile Dynamic Sizing Standard)

**ANNOUNCE:** "Reading `phone-layout-master` — enforcing mobile-first dynamic sizing and touch ergonomics."

**Core Axiom:** A mobile UI is not a shrunken desktop site. It is an independent ergonomic composition calibrated to human thumbs, device boundaries, and dynamic viewport heights.

---

## 1. The Mobile Viewport Laws (Zero Exceptions)

### Law 1: Dynamic Height Units (`100svh` / `100dvh`)
Never use `100vh` on mobile. The mobile address bar shrinks and expands, breaking `100vh` layouts.
```css
/* ❌ BANNED: Breaks on mobile Safari & Chrome */
height: 100vh;

/* ✅ MANDATORY: Dynamic & small viewport height */
height: 100svh;
/* Or for elements tracking toolbar movement */
min-height: 100dvh;
```

### Law 2: Zero Horizontal Scroll Guarantee
Every container, image, and text block must strictly respect the screen width:
```css
/* Global phone constraint */
html, body {
  max-width: 100vw;
  overflow-x: hidden;
}

/* Fluid media */
img, video, canvas, svg {
  max-width: 100%;
  height: auto;
}

/* Text unwrappable string protection */
p, h1, h2, h3, h4, span, div {
  overflow-wrap: break-word;
  word-break: break-word;
}
```

### Law 3: Safe Area Insets (Notch & Home Bar Protection)
Always pad fixed and full-bleed headers and footers with hardware insets:
```css
.mobile-header {
  padding-top: max(16px, env(safe-area-inset-top));
}

.mobile-bottom-nav, .mobile-sheet {
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}

.mobile-container {
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(16px, env(safe-area-inset-right));
}
```

---

## 2. Thumb-Zone Ergonomics & Touch Geometry

1. **44×44px Touch Floor:** Every clickable element, button, tab, and icon link must have a minimum hit target of `44×44px`. If the visual glyph is 20px, pad the wrapper to 44px.
2. **The Natural Thumb Zone (Bottom 40%):**
   - Primary action buttons, tab bars, search triggers, and confirmation sheets belong in the bottom 40% of the screen.
   - Secondary information, headings, and branding belong in the top 60%.
3. **No Tap Delay & No Selection Flash:**
   ```css
   * {
     touch-action: manipulation;
     -webkit-tap-highlight-color: transparent;
   }
   ```
4. **Input Zoom Prevention:**
   All form inputs must have a computed `font-size: 16px` or greater on mobile to prevent iOS Safari from automatically zooming the page.

---

## 3. Dynamic Fluid Scale for Mobile Screens

Use fluid math between the minimum phone width (320px) and maximum phone width (480px):

```css
:root {
  /* Fluid mobile padding and font scale */
  --space-mobile-gutter: clamp(16px, 4vw, 24px);
  --text-mobile-h1: clamp(1.75rem, 1.4rem + 2vw, 2.25rem);
  --text-mobile-body: clamp(0.9375rem, 0.9rem + 0.25vw, 1rem);
}
```

---

## 4. Mobile Component Blueprints

### The Bottom Sheet Pattern (Replaces Desktop Modals)
Desktop modals centered on screen fail on phones because the user cannot reach the top close button with one hand. Always convert dialogs to bottom sheets on mobile:
```tsx
<div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white p-6 shadow-2xl pb-[max(24px,env(safe-area-inset-bottom))]">
  <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-neutral-300" />
  {/* Sheet content */}
</div>
```

---

## 5. Verification Gate (Mobile Inspector)

Before completing any UI component:
- [ ] Tested at `320px` (iPhone SE) with zero horizontal overflow.
- [ ] Tested at `390px` (iPhone 14/15/16).
- [ ] All touch targets verified >= 44×44px.
- [ ] Safe area insets applied to top and bottom bars.
- [ ] Form inputs set to `16px` to prevent zoom.
- [ ] Modals converted to ergonomic bottom sheets.

