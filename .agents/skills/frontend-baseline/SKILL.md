---
name: frontend-baseline
description: >-
  Mandatory unified frontend baseline bundle condensing Taste Kill v2, Anti-AI SOP, and dynamic dual-viewport responsiveness into a single context. Always active on UI tasks alongside up to 3 task skills. Triggers: $frontend-baseline, frontend-baseline:, 'frontend baseline', 'ui baseline'.
metadata:
  category: frontend
---
# frontend-baseline — The Unified Frontend Standard

This bundle condenses the non-negotiable frontend engineering baselines into a single active unit. It satisfies the core aesthetic, anti-slop, and dual-viewport responsive requirements without exhausting the skill budget. Under Rule 7, you load this baseline bundle plus up to 3 task-specific skills.

---

## 1. Taste Kill & Art Direction (from design-taste & ui-taste)
- **Subject-Grounded Palette:** Derive hues directly from the subject's physical reality. Never use generic AI Tailwind color defaults (indigo-600, violet-500, gray-50).
- **Two-Line Headline Cap:** Main titles and section headings must wrap to 2 lines or fewer at all viewport widths.
- **Statements are Paragraphs:** Sentences or quotes set large (≤36px desktop, ≤24px mobile) must be `<p>` or `<blockquote>`, not headings.
- **Void Closures:** Balance asymmetrical layouts; never leave a stranded column with an empty opposite side.
- *Full skills on demand:* [design-taste-frontend](../design-taste-frontend/SKILL.md), [ui-taste-enforcer](../ui-taste-enforcer/SKILL.md).

## 2. Anti-AI SOP Quality Gate (from ui-tells & anti-slop)
- **Eliminate AI Clichés:** Ban pill-shaped badges, uppercase eyebrow labels above titles, floating blurred gradient blobs, and identical 3-card feature grids.
- **High-Density Substance:** Replace generic icon cards with concrete data tables, asymmetric technical spec panels, or real contextual photography.
- **Clean Vector Standards:** Icons snap to 24×24 grid with uniform 1.5px/2.0px stroke. No AI-generated floating-decimal SVG paths.
- *Full skills on demand:* [ui-tells-eliminator](../ui-tells-eliminator/SKILL.md), [anti-slop-enforcer](../anti-slop-enforcer/SKILL.md).

## 3. Dynamic Dual-Viewport Responsiveness (from phone & desktop masters)
- **Mobile Perfection (320px–480px):**
  - Use `100svh` (never `100vh`) to avoid mobile address bar jumps.
  - Strict minimum 44×44px touch targets with 8px thumb clearance.
  - Navigation via bottom thumb-zone sheets, never tiny header hamburger dropdowns.
- **Desktop Architecture (768px–2560px):**
  - Fluid typography via `clamp()` math; zero cumulative layout shift (CLS).
  - Explicit max-content constraints (1200px–1440px) to prevent ultra-wide distortion.
  - Container queries (`@container`) for modular responsive components.
- *Full skills on demand:* [phone-layout-master](../phone-layout-master/SKILL.md), [desktop-ui-architect](../desktop-ui-architect/SKILL.md), [dynamic-ui-engine](../dynamic-ui-engine/SKILL.md).

---

## Rule 7 Rule of Engagement
When initiating any UI task, activate `frontend-baseline`. You may then load up to **3 specialized task skills** (e.g. `svg-icon-craftsman`, `animation-builder`, `webapp-tester`).
