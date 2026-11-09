---
name: implementation-planner
description: >-
  Pre-implementation technical planner and step sequencer. Deconstructs complex user stories and technical requirements into concrete, sequential implementation steps with test assertions without writing to disk memory. Triggers: $plan, $plan-impl, plan-impl:, 'implementation plan', 'plan implementation'.
metadata:
  category: backend
---
# Implementation Planner

**ANNOUNCE:** "Reading `implementation-planner` — writing the plan before touching code."

**Plans are written for an engineer who has not seen this codebase.**

---

## What a Good Plan Includes

For each task in the plan:
```
### Task N: [Name]
**File(s):** [exact path(s) to create or modify]
**What to build:** [the exact interface — function signature, type, API endpoint]
**Tests to write first:**
  - [test 1: what it tests]
  - [test 2: edge case]
**Implementation steps:**
  1. [concrete step]
  2. [concrete step]
**Commit message:** "feat: [what this task delivers]"
**Done when:** [observable, testable success criterion]
```

---

## Plan Writing Rules

**DRY:** If two tasks do similar things, extract to a shared utility. Note it explicitly.
**YAGNI:** Do not plan for features not in the spec. If something "might be useful later", don't plan it.
**TDD:** Every task starts with "Tests to write first." No exceptions.
**Small tasks:** Each task should be completable in a single focused session. If a task takes more than a day, break it down further.
**Commit frequently:** Each task gets its own commit. The plan drives the commit history.

---

## Before Writing the Plan

Read the codebase enough to know:
1. The existing file structure
2. The naming conventions (camelCase? snake_case? PascalCase for types?)
3. The testing setup (Jest? Vitest? PyTest?)
4. The import style (absolute? relative? barrel files?)
5. Any existing utilities that can be reused

State these explicitly at the top of the plan:
```
## Context
- Language/runtime: [TypeScript / Python / etc.]
- Test runner: [Vitest / Jest / PyTest]
- Naming convention: [camelCase functions, PascalCase types]
- Existing utilities to reuse: [list them]
```

---

## Output Format

```markdown
# Implementation Plan: [Feature Name]

## Context
[Stack, naming conventions, existing utilities]

## Spec Summary
[One paragraph — what this feature does and why]

## Tasks (in order)

### Task 1: [Name]
...

### Task 2: [Name]
...

## What's Out of Scope
[What we explicitly are NOT building in this plan]
```

Write the plan to `.agents/memory/current-task.md` when the task is complex.

