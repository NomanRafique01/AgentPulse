---
name: spec-implementer
description: >-
  Tracer-bullet specification implementer. Implements features sequentially from formal specifications and ticket dependency graphs, committing atomic verified increments at each milestone. Use when executing implementation plans or ticket backlogs. Triggers: $spec-implementer, implement-spec:, 'implement spec', 'build tickets'.
metadata:
  category: backend
---
# Spec Implementer

**ANNOUNCE:** "Reading `spec-implementer` — executing the existing spec and tickets."

---

## Before Starting

1. Read the spec completely (in `.agents/memory/current-task.md` or as provided)
2. Read all tickets and the dependency graph
3. Confirm with user: "I'll start with TICKET-1 ([name]). Ready?"
4. Do not start without confirmation

---

## Execution Protocol (Per Ticket)

```
For each ticket, in dependency order:

1. Announce: "Starting TICKET-N: [name]"
2. Write the tests FIRST (from the ticket's acceptance criteria)
3. Watch the tests fail — state the failure message
4. Implement the minimal code to pass
5. Refactor if needed
6. Run all tests — not just the new ones
7. Commit: "feat(TICKET-N): [ticket title]"
8. Report: "TICKET-N complete. [brief summary]. Starting TICKET-N+1."
9. Wait for user confirmation before next ticket
```

---

## Blockers

If you hit a blocker (unclear spec, missing dependency, architectural decision needed):
```
BLOCKER: [what's blocking]
TICKET: TICKET-N
OPTIONS:
  A: [option with trade-off]
  B: [option with trade-off]
RECOMMENDATION: [which one and why]
```

Stop. Wait for the user to choose. Do not guess.

---

## Deviation from Spec

If the spec is wrong or missing something:
1. Stop immediately
2. State what the spec says and what reality requires
3. Propose an amendment to the spec
4. Get confirmation before continuing

Do not silently deviate from the spec. The spec is the contract.

---

## Done When

A ticket is done when:
- All acceptance criteria are met (checked in the ticket)
- All tests pass (run them, paste the output)
- The code is committed
- No `TODO`, `FIXME`, or `any` was introduced

