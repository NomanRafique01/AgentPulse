---
name: ui-prototyper
description: >-
  Multi-variant UI prototyper and composition explorer. Builds 3 genuinely distinct UI variants (structural layout, density, typography hierarchy) behind a live visual switcher to allow visual comparison before settling on a design. Use when exploring UI directions or comparing layouts. Triggers: $ui-prototyper, prototype-ui:, 'prototype variants', 'ui prototyper'.
metadata:
  category: frontend
---
# UI Prototyper

**ANNOUNCE:** "Reading `ui-prototyper` — building multiple genuinely different directions."

The goal is *genuinely different* — not the same layout with different colours. Different compositions, different information hierarchies, different interactions.

---

## Process

### Step 1 — Identify the Design Space

For the component or screen:
- What are the 3 most different ways to arrange this information?
- What are the 2 most different interaction models?
- Which direction feels safest? (That's Variant A — it's the baseline)
- Which direction feels riskiest? (That's Variant C — it might be the best)

### Step 2 — Build 3 Genuinely Different Variants

**Variant A:** The expected approach. What a senior engineer would build first.
**Variant B:** A different layout or interaction model. Different information hierarchy.
**Variant C:** The surprising choice. Something that requires justification.

Rules:
- Each variant must look different in a screenshot
- Different composition, not just different colours
- Different interaction model is better than different visual skin

### Step 3 — Wrap in a Picker

```jsx
// Simple picker component
function VariantPicker({ children }) {
  const [active, setActive] = useState('A');
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['A', 'B', 'C'].map(v => (
          <button
            key={v}
            onClick={() => setActive(v)}
            style={{ fontWeight: active === v ? 'bold' : 'normal' }}
          >
            Variant {v}
          </button>
        ))}
      </div>
      {children(active)}
    </div>
  );
}
```

### Step 4 — One-Line Brief Per Variant

Under each variant, state in one line: what makes this direction different and what problem it solves best.

### Step 5 — User Picks, Then Polish

After the user picks a direction, discard the others and polish the winner with `design-engineering` and `ui-taste-enforcer`.

