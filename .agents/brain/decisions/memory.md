# Memory Skills — Decision Making Matrix

This document dictates how the Virtual Memory system is invoked, controlled, and cleaned.

---

## 1. The User Control Gate (Strict Policy)

**The agent does NOT write every casual turn or trivial task into memory.**
- Virtual memory is disk-backed and persistent (`.agents/memory/plans/` and `.agents/memory/phases/`).
- **Trigger Condition:** The agent activates `phase-planner` ONLY when:
  1. The user explicitly requests: *"add to memory"*, *"save this in memory"*, or *"make a plan for this"*.
  2. The user initiates a large multi-phase feature and explicitly approves creating a master plan and phase breakdown.
- If the user has NOT requested memory tracking, execute in-context without cluttering memory folders.

---

## 2. Specialized Skill Selection Matrix

| Memory Need | Selected Skills | Why This Combination |
|---|---|---|
| **User commands: "add to memory" / multi-phase plan** | `phase-planner` | Creates `.agents/memory/plans/main-plan.md`, breaks it into `.agents/memory/phases/phase-NN-[name].md`, pre-assigns skills, and prints chat dashboard. |
| **User resumes session: "where were we?"** | `session-continuity` | Inspects `.agents/memory/plans/` and `phases/`, reconstructs active phase status, and renders the dashboard. |
| **Context window near limit / session handoff** | `context-handoff` | Compacts session deltas, decisions, open blockers, and git diff states into `.agents/memory/handoff-[date].md`. |
| **Phase completed & verified** | `git-phase-committer` (`$phase-commit`) | Automatically stages and commits phase code, tests, and memory phase files in atomic sequence with verification evidence. |
| **Task completed & verified** | `phase-planner` (cleanup mode) | Moves `main-plan.md` and all phase files to `.agents/memory/archive/[Date]-[Task]/`, clearing active phase folder. |

---

## 3. The Live Chat Status Dashboard Protocol

When memory mode is active, the agent **must** prepend the live status widget at the top of every response:

```markdown
┌─────────────────────────────────────────────────────────────┐
│ 🚀 PHASE STATUS DASHBOARD                                   │
├─────────────────────────────────────────────────────────────┤
│ Task: [Feature Name]                                        │
│ Phase 1: [Scaffold]         -> [FINISHED ✓]                 │
│ Phase 2: [Core Logic]       -> [IN PROGRESS ⚙️]              │
│ Phase 3: [UI & Polish]      -> [PENDING ⏳]                 │
├─────────────────────────────────────────────────────────────┤
│ Active Phase: Phase 2                                       │
│ Active Skills: [skill-a] + [skill-b]                        │
│ Stage: [APPLY] -> [EXECUTE 👈] -> [VERIFY] -> [FINISH]      │
└─────────────────────────────────────────────────────────────┘
```

