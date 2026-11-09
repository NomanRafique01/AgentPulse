---
name: context-handoff
description: >-
  Session continuity compactor and context handoff creator. Compiles session history, active architectural decisions, git state, and open tasks into a self-contained handoff document for cold-start continuation. Use when ending long sessions, approaching token limits, or transferring tasks. Triggers: $context-handoff, handoff:, 'session handoff', 'compact context'.
metadata:
  category: memory
---
# Context Handoff

**ANNOUNCE:** "Reading `context-handoff` — writing a compact handoff for session continuity."

---

## Handoff Document Format

Write to `.agents/memory/handoff-[YYYY-MM-DD].md`:

```markdown
# Handoff: [Task/Project Name]
**Date:** [YYYY-MM-DD HH:MM]
**From session:** [brief session description]
**For:** [next session or another agent]

## Current State
[One paragraph: where the project is RIGHT NOW. What exists, what works, what's broken.]

## What Was Accomplished This Session
- [Concrete deliverable 1]
- [Concrete deliverable 2]
- [Concrete deliverable 3]

## Next Steps (in order)
1. [First thing to do] — [why this comes first]
2. [Second thing]
3. [Third thing]

## Current Phase
**Phase:** [N of M] — [Phase Name]
**Status:** [What's done in this phase, what remains]
**Success criteria for this phase:** [How to know it's done]

## Key Decisions Made
| Decision | What was decided | Why |
|---|---|---|
| [Question] | [Choice] | [Reasoning] |

## Blockers and Open Questions
- [Blocker/question 1]: [What needs to happen to resolve it]
- [Blocker/question 2]: ...

## Files Modified This Session
- [path/to/file.ts] — [what changed and why]
- [path/to/file.css] — [what changed and why]

## Tests Status
- [Test suite name]: [X/Y passing]
- Known failing: [test name] — [why it's failing, is it expected?]

## Environment Notes
[Anything a new agent needs to know about the development environment,
running services, credentials needed, etc.]

## Context for Next Agent
[Anything that's NOT in the code or files but is in the previous agent's head —
design decisions, temporary workarounds, things to be careful about]
```

---

## Checklist Before Writing the Handoff

- [ ] All work-in-progress is committed (or explicitly noted as uncommitted and why)
- [ ] No failing tests that weren't already failing at session start
- [ ] The "Next Steps" are in the right order — a cold agent can follow them
- [ ] Every file changed is listed
- [ ] Open questions are stated, not buried in the "Next Steps"

