---
name: issue-triager
description: >-
  Issue tracker triager and reproduction verifier. Evaluates bug reports, verifies reproduction steps, identifies missing diagnostic info, and crafts actionable agent briefs with test fixtures. Use when triaging GitHub issues, customer bug reports, or error logs. Triggers: $issue-triager, triage-issue:, 'triage issue', 'verify bug report'.
metadata:
  category: debugging
---
# Issue Triager

**ANNOUNCE:** "Reading `issue-triager` — triaging issues into agent-ready briefs."

---

## Triage State Machine

Each issue moves through these states:

```
RAW → VERIFYING → CATEGORIZED → BRIEF_WRITTEN → READY
```

### RAW → VERIFYING

Read the raw issue. Determine:
1. Is this a bug, feature request, question, or duplicate?
2. Can you reproduce it? (If a bug — try to reproduce)
3. Is there enough information to reproduce? (If not → needs more info)

### VERIFYING → CATEGORIZED

Assign:
```
TYPE: BUG | FEATURE | QUESTION | DUPLICATE | INVALID
SEVERITY: CRITICAL | HIGH | MEDIUM | LOW
  - CRITICAL: Data loss, security, site down
  - HIGH: Core feature broken, no workaround
  - MEDIUM: Feature degraded, workaround exists
  - LOW: Minor, cosmetic
SCOPE: [Which module/area of the codebase]
EFFORT: [S / M / L / XL]
REPRODUCIBLE: YES | NO | SOMETIMES
```

### CATEGORIZED → BRIEF_WRITTEN

Write an agent-ready brief:
```markdown
## Brief: [Issue Title]

**Type:** BUG / FEATURE
**Severity:** HIGH
**Scope:** [Module/component]

### Problem
[What is broken or missing — precise, behavioral description]

### Reproduction Steps
1. [Step]
2. [Step]
3. Expected: [what should happen]
4. Actual: [what does happen]

### Acceptance Criteria
- [ ] [Observable criterion]
- [ ] [Edge case handled]

### Context
[Any technical context useful for implementation — error messages, stack traces, environment]

### Out of Scope
[Related problems to NOT fix in this issue]
```

### BRIEF_WRITTEN → READY

Confirm:
- [ ] Reproduction steps are complete
- [ ] Acceptance criteria are testable
- [ ] Scope is bounded — no ambiguous "also fix X while you're there"
- [ ] The brief could be handed to an agent cold and worked on without follow-up questions

---

## Batch Triage

When triaging a backlog:
1. Do a first pass — sort into BUG / FEATURE / QUESTION / DUPLICATE / INVALID
2. Close or redirect QUESTION and INVALID immediately
3. Mark DUPLICATE with the original issue link
4. Prioritize remaining: CRITICAL first, then HIGH, then MEDIUM, then LOW
5. Write briefs for the top 5 by priority — stop there unless asked for more

