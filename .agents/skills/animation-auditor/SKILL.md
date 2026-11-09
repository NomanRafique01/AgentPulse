---
name: animation-auditor
description: >-
  Whole-codebase animation auditor and motion health inspector. Scans CSS, Framer Motion, and web animations to identify jank, missing transitions, layout shifts, and accessibility flaws, generating an itemized motion remediation roadmap. Use when reviewing codebase motion, diagnosing animation debt, or assessing UI polish. Triggers: $animation-auditor, animation-audit:, 'audit animations', 'motion audit'.
metadata:
  category: frontend
---
# Animation Auditor

**ANNOUNCE:** "Reading `animation-auditor` — surveying full codebase for motion quality."

Read-only. Plan, don't implement. Other agents implement.

---

## Audit Process

### Phase 1 — Discovery

Search the codebase for all motion code:
```
grep -r "animation\|transition\|transform\|keyframes\|framer\|spring\|useAnimate\|motion\." --include="*.css" --include="*.tsx" --include="*.ts" --include="*.js"
```

Catalogue every animated element with its location, properties, and tool.

### Phase 2 — Classify Each Animation

For each discovered animation, assign:
- **Type:** entrance / exit / state-change / scroll / gesture / decorative
- **Tool:** CSS / Framer Motion / WAAPI / custom
- **Properties:** list what's being animated
- **Quality:** EXCELLENT / ACCEPTABLE / NEEDS-WORK / BROKEN

### Phase 3 — Find Missing Animations

Scan for these common missed opportunities:
- Form submit button (no loading state animation)
- Error states (appear with no transition)
- List item add/remove (no layout animation)
- Modal/drawer/sheet (no entrance/exit)
- Skeleton loading states (no shimmer)
- Empty state transitions (no fade)
- Page navigation (no transition between routes)

For each opportunity: state whether it should animate, and what kind.

### Phase 4 — Prioritized Improvement Plans

Rank all improvements by: **impact on perceived quality** × **implementation effort⁻¹**

Output a ranked list:
```
Priority 1: [Component/file] — [What to change] — [Expected impact]
Priority 2: ...
```

For each priority, write a self-contained implementation brief:
- Which file(s) to change
- Exact properties to animate
- Tool recommendation
- Timing and curve values
- Reduced-motion handling

---

## Output Format

```markdown
## Animation Audit Report

### Summary
- X animations found
- X EXCELLENT / X ACCEPTABLE / X NEEDS-WORK / X BROKEN
- X missed opportunities

### Critical Fixes (BROKEN)
[List with file:line, issue, fix]

### High-Impact Improvements (NEEDS-WORK)
[Ranked list]

### Missing Opportunities
[List of what should animate but doesn't]

### Implementation Plans
[Self-contained brief per priority item]
```

