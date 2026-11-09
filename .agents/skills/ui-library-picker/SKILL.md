---
name: ui-library-picker
description: >-
  Opinionated UI component library selector. Recommends lean, accessible, headless component primitives (Radix, Sonner, cmdk, TanStack Table) based on functional requirements, avoiding bloated kitchen-sink UI kits. Use when selecting UI component libraries or frontend dependencies. Triggers: $ui-library, pick-ui-lib:, 'pick ui library', 'select component library'.
metadata:
  category: frontend
---
# UI Library Picker

**ANNOUNCE:** "Reading `ui-library-picker` — selecting the right library for this task."

Opinionated. Pick one, justify it, stop. Do not list 5 options and say "it depends."

---

## Curated Picks by Task

| Task | Pick | Why |
|---|---|---|
| Component primitives (unstyled) | Radix UI | Accessible, headless, composable |
| Full component kit | shadcn/ui | Copies into your code, fully customizable |
| Styling | Tailwind CSS v4 | Utility-first, fastest iteration |
| Animations | Framer Motion | Spring physics, layout, gestures |
| React Native animations | Reanimated 3 | Runs on UI thread, truly native feel |
| Charts | Recharts (simple) / Nivo (complex) | Recharts for standard, Nivo for custom |
| Command menu / search | cmdk | The standard, used by Vercel, Linear, etc. |
| Toast notifications | Sonner | Best defaults, beautiful, Radix-compatible |
| Forms | react-hook-form + zod | Minimal re-renders, schema validation |
| Tables (large datasets) | TanStack Table v8 | Headless, virtualization-ready |
| Virtualization | TanStack Virtual | Pairs naturally with TanStack Table |
| Drag and drop | dnd-kit | Accessible, no jQuery, sensor abstraction |
| Date picker | react-day-picker | Lightweight, accessible, composable |
| Rich text editor | Tiptap | ProseMirror-based, extensible |
| State management | Zustand (small) / Jotai (atomic) | Both are minimal; avoid Redux for new code |
| Data fetching | TanStack Query | The standard for server state |
| OTP input | input-otp | Auto-focus, paste, accessible |
| Carousel/slider | Embla Carousel | Native scroll-based, performant |
| Select / combobox | Radix Select or cmdk | Depends on complexity |
| Modal / dialog | Radix Dialog | Accessible, focus trap, scroll lock |
| Image zoom | medium-zoom | Dead simple, widely used |
| PDF viewer | react-pdf | Uses pdf.js under the hood |
| Maps | Mapbox GL JS / Leaflet | Mapbox for visual quality, Leaflet for simplicity |

---

## Decision Protocol

When picking:
1. State the task requirement in one sentence
2. Pick one library from the list above (or research if not listed)
3. State why it wins over the alternatives for THIS use case
4. State any known gotchas for this project's stack
5. Done — do not list alternatives unless the user asks

## Anti-patterns to Avoid
- Do not reach for jQuery
- Do not build a custom date picker when react-day-picker exists
- Do not add Redux to a new project — use Zustand or Jotai
- Do not use moment.js — use date-fns or dayjs
- Do not add a full UI kit when you need 2 components — use Radix primitives

