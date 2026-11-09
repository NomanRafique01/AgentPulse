---
name: ui-tells-eliminator
description: >-
  Code-level scanner and eliminator of AI visual design tells in CSS, HTML, and JSX. Intercepts and purges pill badges, uppercase eyebrow headers, floating purple/indigo blur blobs, uniform 3-card rows, and soft grey box-shadows. Use when building or reviewing frontend components. Triggers: $ui-tells, remove-tells:, 'eliminate ai tells', 'kill pill badges'.
metadata:
  category: anti-ai-sop
---
# UI Tells Eliminator

**ANNOUNCE:** "Activating `ui-tells-eliminator` — running code-level scan for synthetic UI patterns."

---

## The Code-Level Kill List

### 1. Pill Badges Above Headlines
```jsx
// ❌ BANNED: The quintessential AI landing page tell
<div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
  ✨ Introducing v2.0
</div>
<h1 className="text-4xl font-bold">...</h1>

// ✅ CLEAN REPLACEMENT: Integrate or eliminate
<h1 className="text-5xl font-semibold tracking-tight">
  Version 2.0: Instant multi-region deploys.
</h1>
```

### 2. Eyebrow Labels with Letter-Spacing
```jsx
// ❌ BANNED: Tracked-out uppercase micro-label
<span className="text-xs uppercase tracking-widest text-neutral-500">
  FEATURES & ARCHITECTURE
</span>

// ✅ CLEAN REPLACEMENT: Structural hierarchy
<h2 className="text-2xl font-medium text-neutral-900">
  System Architecture
</h2>
```

### 3. The Clichéd 3-Card Feature Row
```jsx
// ❌ BANNED: 3 identical cards with centered icon on top
<div className="grid grid-cols-3 gap-6">
  <div className="rounded-xl border p-6 text-center shadow-sm">
    <div className="mx-auto mb-4 h-10 w-10 text-indigo-500"><ZapIcon /></div>
    <h3>Lightning Fast</h3>
    <p>Blazing speeds across all global nodes.</p>
  </div>
  ...
</div>

// ✅ CLEAN REPLACEMENT: Asymmetric editorial composition or dense spec sheet
<div className="grid grid-cols-12 gap-8 items-baseline">
  <div className="col-span-4 border-t border-neutral-200 pt-4">
    <div className="text-3xl font-semibold">4ms</div>
    <div className="text-sm text-neutral-600">Cold start latency at the edge</div>
  </div>
  <div className="col-span-8 border-t border-neutral-200 pt-4">
    <p className="text-lg text-neutral-800">
      Zero V8 isolate spin-up overhead. Functions run directly against warm microVM pools.
    </p>
  </div>
</div>
```

### 4. Background Gradient Blobs
```css
/* ❌ BANNED: Synthetic glowing spheres */
.decoration-blob {
  position: absolute;
  filter: blur(80px);
  background: radial-gradient(circle, #6366f1, #ec4899);
  opacity: 0.15;
}

/* ✅ CLEAN REPLACEMENT: Flat grounding or high-quality photographic plates */
.hero-surface {
  background-color: var(--color-ground);
  /* Use architectural layout, tight margins, and typography instead of fake light */
}
```

### 5. Soft Grey Box-Shadows Under Resting Surfaces
```css
/* ❌ BANNED: The default soft cloud shadow */
box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);

/* ✅ CLEAN REPLACEMENT: 1-step tone differentiation or sharp 1px border */
background-color: var(--color-surface);
border: 1px solid var(--color-border);
/* Shadows belong only on elements that float in z-space (dialogs, dropdowns) */
```

### 6. The Appended Arrow Cliché
```jsx
// ❌ BANNED: Arrow on every single action
<a href="/docs">Read our documentation →</a>
<button>Get Started →</button>

// ✅ CLEAN REPLACEMENT: Confident, specific button labels
<a href="/docs" className="underline underline-offset-4">API Reference</a>
<button className="bg-neutral-900 text-white px-4 py-2">Create Workspace</button>
```

---

## The Inspector Checklist

Run before committing any UI code:
- [ ] No `rounded-full` badges acting as subtitle markers.
- [ ] No `tracking-widest uppercase` micro-tags above headers.
- [ ] No 3-card centered icon grids.
- [ ] No blurred radial-gradient blobs.
- [ ] No arbitrary `box-shadow` on resting cards.
- [ ] Colors are chosen for this specific product, not the default Indigo/Violet or Anthropic Terracotta.

