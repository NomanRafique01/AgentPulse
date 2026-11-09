---
name: web-artifact-builder
description: >-
  Self-contained multi-component web application and artifact builder. Builds production-ready React/Tailwind/TypeScript web artifacts, interactive tools, dashboards, and simulators in a single cohesive architecture. Use when building standalone web applications, prototypes, or complex artifacts. Triggers: $web-artifact, build-artifact:, 'build web artifact', 'interactive app'.
metadata:
  category: frontend
---
# Web Artifact Builder

**ANNOUNCE:** "Reading `web-artifact-builder` — building a multi-component web artifact."

---

## When to Use This (vs. Simple HTML)

Use this skill when the artifact needs:
- React state (`useState`, `useReducer`, `useContext`)
- Multiple routes or views
- Data fetching and loading states
- shadcn/ui components (Dialog, Popover, Command, etc.)
- Complex component interactions

For a simple static page — use plain HTML/CSS instead. Don't add React complexity for no reason.

---

## Stack Decisions

**Styling:** Tailwind CSS v4 — utility classes, no custom CSS unless tokens need it
**Components:** shadcn/ui — copy components into `src/components/ui/`
**State:** useState/useReducer for local, Zustand for shared
**Forms:** react-hook-form + zod
**Icons:** Lucide React — one consistent icon set, never mix sets

---

## File Structure

```
src/
├── components/
│   ├── ui/           ← shadcn/ui components (copied in, not imported from npm)
│   └── [feature]/    ← feature-specific components
├── hooks/            ← custom hooks
├── lib/
│   ├── utils.ts      ← cn() utility, shared helpers
│   └── schemas.ts    ← zod schemas
└── app/              ← Next.js app router, or pages/
```

---

## Component Rules

- One component per file
- Component file name matches component name: `UserCard.tsx` exports `UserCard`
- No prop drilling more than 2 levels — use context or state manager
- Every component handles its own loading and error states
- Every interactive element has all required ARIA attributes

---

## Build Order

1. Define the data shapes (TypeScript types + zod schemas)
2. Build the UI components bottom-up (atoms → molecules → organisms)
3. Wire up state management
4. Connect data fetching
5. Add loading and error states
6. Add empty states
7. Test with worst-case data (`ui-stress-tester` patterns)

---

## Anti-Patterns to Avoid

- Do not use `any` in TypeScript — if you don't know the type, investigate
- Do not add `// @ts-ignore` — fix the type error
- Do not use inline `style={{ }}` for more than 1-2 properties — use Tailwind
- Do not create wrapper components that add no value
- Do not import components from shadcn/ui directly — copy them in

