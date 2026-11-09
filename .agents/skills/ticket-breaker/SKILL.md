---
name: ticket-breaker
description: >-
  Tracer-bullet ticket decomposition engine. Deconstructs technical specifications into self-contained, dependency-ordered tracer-bullet tickets with explicit acceptance tests and blast-radius bounds. Use when breaking specs or epics into actionable implementation tickets. Triggers: $ticket-breaker, break-tickets:, 'break tickets', 'tracer bullet tickets'.
metadata:
  category: backend
---
# Ticket Breaker

**ANNOUNCE:** "Reading `ticket-breaker` — breaking spec into ordered, dependency-aware tickets."

**Tracer-bullet tickets:** each one fires all the way through the stack — from data model to UI — so you can see if the approach works before building everything.

---

## What a Good Ticket Contains

```markdown
## TICKET-[N]: [Action verb] [specific deliverable]

**Blocks:** TICKET-[depends on this]
**Blocked by:** TICKET-[must be done first]

**Context:** [One sentence: why this ticket exists in the relation to the overall feature]

**Scope:**
- Build [specific thing]
- Do NOT build [what's explicitly out of scope for this ticket]

**Acceptance Criteria:**
- [ ] [Observable, testable outcome]
- [ ] [Another observable outcome]
- [ ] Tests pass for [specific behaviors]

**Notes for implementation:**
[Any specific decisions already made, files to look at, utilities to reuse]

**Estimated size:** [S / M / L — Small = < 2h, Medium = half day, Large = full day]
```

---

## Ticket Ordering Rules

1. **Data model first** — you can't build the API without the schema
2. **API before UI** — you can't build the frontend without the contract
3. **Happy path before edge cases** — get it working before hardening it
4. **Core feature before polish** — ship the thing, then refine it

Identify the critical path: the sequence of tickets that must complete before any other work can start. These are the ones to do first.

---

## Dependency Graph

Before finalizing the ticket list, draw the dependency graph:
```
TICKET-1 (data model)
  └── TICKET-2 (API endpoint)
        ├── TICKET-3 (UI component)
        └── TICKET-4 (UI state management)
              └── TICKET-5 (integration test)
```

Any ticket that blocks others gets done first.

---

## Anti-Patterns to Avoid

- **Tickets that are too big:** If a ticket is described in 3+ paragraphs, break it down further
- **Ambiguous acceptance criteria:** "works correctly" is not a criterion — specify what "correctly" means
- **Undeclared dependencies:** Every dependency must be stated or the ticket order is wrong
- **Tickets that mix concerns:** UI work and data model work in the same ticket — separate them

