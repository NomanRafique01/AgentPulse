---
name: large-task-mapper
description: >-
  Multi-session project mapper and decision ticket breaker. Maps complex multi-week projects into a dependency-ordered graph of decision tickets across multiple agent sessions, tracking unknowns and architectural choices. Use when starting large complex initiatives. Triggers: $large-task-mapper, map-project:, 'large task map', 'project roadmap'.
metadata:
  category: architecture
---
# Large Task Mapper

**ANNOUNCE:** "Reading `large-task-mapper` — mapping multi-session work as decision tickets."

---

## When to Use This

A task needs this skill if:
- It cannot be completed in a single context window
- It requires architectural decisions before implementation can start
- It spans multiple features or components
- The full scope is uncertain

---

## Step 1 — Define the Destination

Write in one sentence what done looks like:
> "The system does [X] for [Y] users in [Z] context."

If you can't write this sentence, the destination is unclear. Clarify with the user before mapping.

---

## Step 2 — Identify Decision Tickets

A decision ticket is an open question that must be resolved before work can start on something else. They are NOT implementation tickets — they are forks in the road.

Format:
```markdown
## DECISION-N: [Question]
**Status:** OPEN / RESOLVED / SUPERSEDED
**Blocks:** [What cannot proceed until this is decided]
**Options:**
  A: [Option] — [tradeoffs]
  B: [Option] — [tradeoffs]
**Recommendation:** [If you have one]
**Decided:** [What was chosen and why — filled in when resolved]
```

---

## Step 3 — Produce the Map

```markdown
# Project Map: [Goal]

## Destination
[One sentence]

## Decision Tickets (resolve in order)

### DECISION-1: [Most foundational question]
...

### DECISION-2: [Second question, may depend on DECISION-1]
...

## Known Implementation Work (after decisions are made)
- Phase 1: [What can be built once DECISION-1 is resolved]
- Phase 2: [What follows]

## Unknowns (things we don't know yet)
- [Unknown 1]
- [Unknown 2]
```

---

## Step 4 — Work One Decision at a Time

1. Present DECISION-1 to the user
2. Discuss, research if needed (activate `research-agent`)
3. Resolve — mark as DECIDED with the chosen option and reasoning
4. Move to DECISION-2
5. Once all decisions are resolved → hand off to `ticket-breaker` for implementation tickets

