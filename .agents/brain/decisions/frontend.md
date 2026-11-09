# Frontend Skills — Decision Making Matrix

This document dictates how the agent selects, combines, and sequences frontend skills.

---

## 1. Mandatory Baseline Bundle (`frontend-baseline`)

Every frontend task **must** load `frontend-baseline` (≤ 4 KB), which condenses:
1. **Art Direction:** `design-taste-frontend` + `ui-taste-enforcer` (Taste Kill v2, 247-site study, subject palette).
2. **Anti-AI SOP:** `ui-tells-eliminator` + `anti-slop-enforcer` (kills pill badges, eyebrows, 3-card grids).
3. **Dynamic Responsive Sizing:** `phone-layout-master` + `desktop-ui-architect` + `dynamic-ui-engine` (flawless adaptation from 320px phone to 2560px desktop).

Full skills can be loaded on demand from references when deeper guidance is required.

---

## 2. Specialized Skill Selection Matrix

| User Goal | Selected Skills | Why This Combination |
|---|---|---|
| **Plan UI architecture before building** | `frontend-planner` (`$plan-frontend`) | Creates complete blueprint: subject inventory, fluid tokens, phone layout, desktop layout, anti-slop check. |
| **Build new component or page** | `design-taste-frontend` + `dynamic-ui-engine` + `typography-master` | Directs composition, token ratios, fluid clamp scales, and tailored typography. |
| **Phone / Mobile layout perfection** | `phone-layout-master` + `mobile-native-feel` | 320px–480px optimization: 100svh, 44px touch targets, bottom sheets, safe-area insets. |
| **Desktop / Wide-screen UI workstation** | `desktop-ui-architect` + `design-engineering` | 768px–2560px optimization: multi-pane hierarchy, container queries (`@container`), max-width bounds. |
| **Typography & font archetype selection**| `typography-master` (`$typography`) | Selects Swiss, Editorial, Mono, or Humanist font stacks; establishes mathematical clamp scales. |
| **Craft SVG icons or glyphs** | `svg-icon-craftsman` (`$icon`) | Snaps vector paths to 24×24 grid, 1.5px/2.0px stroke, eliminates AI curve spaghetti. |
| **Add micro-interactions & polish** | `design-engineering` + `animation-builder` | Emil Kowalski polish standard: 9 interactive states, physical spring curves. |
| **Fix dropped frames or janky UI** | `animation-performance` | Keeps animations on composite-only GPU properties (transform, opacity); 16.6ms frame budget. |
| **Stress-test layout breaks** | `ui-stress-tester` | Feeds extreme strings, non-Latin text, negative numbers, empty arrays behind a demo toggle. |
| **Compare multiple UI directions** | `ui-prototyper` | Generates 3 genuinely different compositions behind a live switcher. |

---

## 3. The Baseline Bundle + 3 Task Skills Rule

- Rule 7 standard: Load `frontend-baseline` plus up to **3 specialized task skills** at the same time (e.g. `svg-icon-craftsman`, `animation-builder`, `webapp-tester`).
- Respect `.agents/brain/config.json` confirmation settings before executing.
