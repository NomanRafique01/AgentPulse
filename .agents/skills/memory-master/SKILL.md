---
name: memory-master
description: >-
  User-controlled Virtual Memory orchestrator. Manages persistent disk-backed plans (.agents/memory/plans/) and execution phases (.agents/memory/phases/), renders the Live Chat Dashboard, and archives completed phases upon explicit user consent. Triggers: $memory, memory:, 'save to memory', 'add to memory', 'memory master'.
metadata:
  category: orchestrators
---
# Memory Master — Virtual Memory Orchestrator

**ANNOUNCE:** "Reading `memory-master` — checking user memory directives and phase state."

**Strict Policy: User retains 100% control over memory. Never write to disk memory unprompted.**

---

## When to Activate Virtual Memory

Activate disk memory (`.agents/memory/plans/` and `phases/`) ONLY if:
1. **User Explicit Command:** User says *"$memory"*, *"add to memory"*, or *"save this in memory"*. Note: `$plan` produces an in-chat plan without writing to disk.
2. **User-Approved Multi-Phase Scope:** A major feature requires multiple steps and the user explicitly confirms saving the master plan.

For casual requests, one-off fixes, or single-turn questions: **DO NOT touch disk memory**. Work in-context cleanly.

---

## The Virtual Memory Protocol (When User Approves)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER CONSENT → Explicit request to add to memory         │
│ 2. MASTER PLAN  → Write .agents/memory/plans/main-plan.md   │
│ 3. DECOMPOSE    → Generate .agents/memory/phases/phase-NN.md│
│ 4. PRE-SELECT   → Assign 2-3 skills per phase               │
│ 5. DASHBOARD    → Prepend [APPLY]->[EXECUTE]->[FINISH] board│
│ 6. STEP EXECUTE → Complete phase, verify, run git commit    │
│                   via git/git-phase-committer ($phase-commit│
│ 7. CLEAN/ARCHIVE→ Move finished tasks to archive/           │
└─────────────────────────────────────────────────────────────┘
```

---

## Mandatory Chat Status Dashboard

When memory tracking is active, prepend this board at the top of every response:

```markdown
┌─────────────────────────────────────────────────────────────┐
│ 🚀 PHASE STATUS DASHBOARD                                   │
├─────────────────────────────────────────────────────────────┤
│ Task: [Task Name]                                           │
│ Phase 1: [Scaffolding]      -> [FINISHED ✓]                 │
│ Phase 2: [Core Logic]       -> [IN PROGRESS ⚙️]              │
│ Phase 3: [UI & Polish]      -> [PENDING ⏳]                 │
├─────────────────────────────────────────────────────────────┤
│ Active Phase: Phase 2                                       │
│ Active Skills: [skill-1] + [skill-2]                        │
│ Stage: [APPLY] -> [EXECUTE 👈] -> [VERIFY] -> [FINISH]      │
└─────────────────────────────────────────────────────────────┘
```

---

## Archival & Cleanup

When the last phase finishes and passes verification:
1. Move `main-plan.md` and all phase files to `.agents/memory/archive/[Date]-[Task]/`.
2. Clear `.agents/memory/phases/` so no stale files clutter the workspace.
3. Announce that memory has been cleaned and archived.
