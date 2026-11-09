---
name: desktop-ui-architect
description: >-
  Desktop workstation UI and wide-screen layout architect (768px–2560px). Implements multi-pane density, container queries (@container), fluid clamp scales, and max-width layout bounds (1200px–1440px) to prevent wide-screen distortion. Use when building desktop web applications and admin consoles. Triggers: $desktop-ui, desktop-ui:, 'desktop layout', 'widescreen ui'.
metadata:
  category: frontend
---
# Desktop UI Architect (Wide-Screen Dynamic Sizing Standard)

**ANNOUNCE:** "Reading `desktop-ui-architect` — enforcing multi-pane spatial hierarchy and container-responsive desktop layouts."

**Core Axiom:** A desktop interface is an interactive workstation. It leverages screen real estate for information density, spatial hierarchy, and keyboard efficiency without sprawling uncontrolled on ultra-wide displays.

---

## 1. The Desktop Viewport Laws

### Law 1: Maximum Content Bounds (No Ultra-Wide Sprawl)
Never let running text or content grids stretch infinitely across 4K / 34-inch displays:
```css
/* Container boundary */
.app-workspace {
  width: 100%;
  max-width: 1440px; /* Or 1600px for data-heavy consoles */
  margin-left: auto;
  margin-right: auto;
  padding-left: clamp(24px, 3vw, 48px);
  padding-right: clamp(24px, 3vw, 48px);
}

/* Reading line length protection */
.prose-measure {
  max-width: 75ch; /* 65-75 characters per line for optimal readability */
}
```

### Law 2: Container Queries Over Viewport Queries (`@container`)
Desktop components must respond to the width of their *parent container* (e.g. inside a sidebar, modal, or split pane), NOT just the global screen:
```css
/* Define container on parent */
.panel-wrapper {
  container-type: inline-size;
  container-name: panel;
}

/* Adapt component based on panel width */
@container panel (min-width: 500px) {
  .metric-card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 16px;
  }
}
```

### Law 3: Dynamic Grid Auto-Fit (No Fixed Column Counts)
Never hardcode `grid-cols-4` without minmax protection. Always allow cards to wrap naturally:
```css
.dynamic-dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
  gap: clamp(16px, 1.5vw, 24px);
}
```

---

## 2. Multi-Pane & Rail Architecture

### The 3-Column Workstation Layout
```
┌──────────┬───────────────────┬────────────────────────────────┐
│ Nav Rail │ Master / List     │ Detail / Canvas                │
│ (64px)   │ (320px - 380px)   │ (1fr, min-width: 500px)        │
├──────────┼───────────────────┼────────────────────────────────┤
│ Icons &  │ Search, filters,  │ Full record, tabs, inspector,  │
│ shortcuts│ dense feed cards  │ actions, primary workstation   │
└──────────┴───────────────────┴────────────────────────────────┘
```

1. **Collapsible Rails:** Navigation rail collapses to icons on screens `< 1200px`.
2. **Independent Scroll Containers:** The navigation, list pane, and detail pane must scroll independently with `overflow-y: auto`, preventing the whole window from scrolling away.
3. **Keyboard Shortcuts:** Critical actions must expose shortcuts (e.g. `⌘K` command palette, `Esc` dismiss, `J/K` list navigation).

---

## 3. High-Density Data Tables

For data-dense desktop applications:
- Enable `font-variant-numeric: tabular-nums` on all figures.
- Sticky table headers with `position: sticky; top: 0; z-index: 10`.
- Explicit column widths with truncation tooltips on overflow.
- Action menus anchored to row hover or sticky right edge.

---

## 4. Verification Gate (Desktop Inspector)

Before completing any desktop UI component:
- [ ] Tested at `768px` (tablet portrait) — collapses gracefully.
- [ ] Tested at `1024px` (tablet landscape / small laptop).
- [ ] Tested at `1440px` (standard desktop).
- [ ] Tested at `2560px` (ultra-wide) — content does not sprawl infinitely.
- [ ] Components utilize container queries (`@container`) where appropriate.
- [ ] Keyboard focus states are visually crisp and accessible.

