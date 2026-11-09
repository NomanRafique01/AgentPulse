---
name: frontend-planner
description: >-
  Pre-build UI design and dual-viewport responsive blueprint engine. Generates subject inventories, fluid design token matrices, mobile layouts (320px–480px), and desktop layouts (768px–2560px) before coding, presenting the plan for confirmation. Triggers: $plan-frontend, plan-ui:, 'plan frontend', 'plan ui'.
metadata:
  category: frontend
---
# Frontend Planner ($plan-frontend)

**COMMAND:** `$plan-frontend`
**ANNOUNCE:** "Activating `frontend-planner` — formulating complete UI architecture blueprint before building."

**Core Rule:** Never write a line of CSS or JSX without a verified UI plan. A plan takes 3 minutes; refactoring broken layouts takes hours.

---

## The 6-Step Frontend Planning Protocol

When `$plan-frontend` is invoked, execute these 6 planning steps:

### Step 1: Subject-Matter Inventory
List 8 to 12 concrete, specific facts that belong ONLY to this client/subject (not generic SaaS tropes):
- Physical materials, tools, architecture, street, neighbourhood.
- Real numerical constraints (hours, inventory batch sizes, seats, years).
- Output artifacts (tickets, invoices, physical instruments, log feeds).
- Run the **Competitor Test**: If the concept works for a direct competitor, reject it and refine.

### Step 2: Palette & Surface Architecture
- Grounding: One ground tone derived from the subject's physical world.
- Ink: Full ink contrast (no washed-out grey body copy).
- Accent: Single decisive action accent.
- Surfaces: Tone steps (e.g. 3% background delta), zero soft grey drop shadows.

### Step 3: Typography & Metric System (`typography-master`)
- Archetype selection: Technical Swiss, Editorial Broadside, Industrial Mono, or Warm Humanist.
- Modular Scale: Choose ratio (1.250 Major Third or 1.333 Perfect Fourth).
- Define fluid clamp tokens for headlines, body, and micro labels.

### Step 4: Phone Responsive Blueprint (`phone-layout-master`)
- Viewport target: 320px – 480px.
- Height: `100svh` / `min-height: 100dvh`.
- Navigation: Bottom tab rail or thumb-zone action bar.
- Touch targets: All buttons and interactive glyphs >= 44×44px.
- Dialogs: Transformed into bottom swipe sheets.
- Zero horizontal overflow check.

### Step 5: Desktop Workstation Blueprint (`desktop-ui-architect`)
- Viewport target: 768px, 1024px, 1440px, and ultra-wide bounds (`max-w-7xl`).
- Composition: Multi-pane split view or asymmetric editorial grid.
- Container queries: Components tagged with `@container` for modular embedding.
- Keyboard navigation: Command palette shortcuts (`⌘K`) and visible focus states.

### Step 6: Anti-Slop Sanity Gate
Verify the blueprint has:
- Zero pill badges above headlines.
- Zero tracked-out uppercase eyebrow labels.
- Zero 3-card centered icon grids.
- Zero gradient decoration blobs.

---

## Output Template (Presented to User)

```markdown
# 🎨 UI Architecture Plan: [Component / Feature Name]

### 1. Subject Concept & Grounding
- **Idea:** On this page, [subject attribute] becomes [visual device].
- **Palette:** Ground `#...`, Ink `#...`, Accent `#...` (derived from [subject trait]).
- **Typography:** [Font Archetype] with Major Third fluid clamp scale.

### 2. Dual-Viewport Architecture
- **Mobile Phone (320px–480px):** Single column stack, 100svh hero, 44px touch targets, bottom sheet modals.
- **Desktop (1024px–1440px+):** [Multi-pane split / Asymmetric grid], max-width 1440px bounds, container queries.

### 3. Sub-Skills Selected for Build
- `design-taste-frontend`
- `phone-layout-master`
- `desktop-ui-architect`
- `ui-tells-eliminator`

---
**Shall I proceed with building this interface according to this plan?**
```

