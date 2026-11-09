---
name: phase-planner
description: >-
  Virtual memory phase generator and live chat dashboard manager. Creates master plans in .agents/memory/plans/main-plan.md, decomposes features into structured phase files (.agents/memory/phases/), and tracks progress via real-time chat status boards. Use when the user requests multi-phase disk planning. Triggers: $phase-planner, phase-plan:, 'phase planner', 'create memory phases'.
metadata:
  category: memory
---
# Phase Planner & Virtual Memory Engine

**ANNOUNCE:** "Reading `phase-planner` — initializing master plan, phase decomposition, and memory tracking."

---

## The Virtual Memory Philosophy

Context windows are volatile; files on disk are permanent. 
When building real software, the agent must never keep the plan solely in context.
1. The **Master Plan** lives in `.agents/memory/plans/main-plan.md`.
2. The **Execution Phases** live individually in `.agents/memory/phases/phase-01-[name].md`, `phase-02-[name].md`, etc.
3. Every phase explicitly pre-selects the **2 to 3 specialized skills** needed for that phase.
4. In the chat, the agent renders a **Live Status Dashboard** so the user immediately sees:
   `[APPLY] -> [EXECUTE] -> [VERIFY] -> [FINISH]`.
5. Once all phases complete and pass verification, the agent cleans/archives the active phase files so the memory stays lean and ready for the next task.

---

## Directory Architecture

```
.agents/memory/
├── plans/
│   └── main-plan.md          ← Active master plan
├── phases/
│   ├── phase-01-[name].md    ← Specific phase execution file
│   ├── phase-02-[name].md
│   └── phase-03-[name].md
├── archive/                  ← Cleaned/archived completed plans & phases
└── decisions/
    └── ADR-NNN.md            ← Permanent architectural decision records
```

---

## Step 1 — Master Plan Construction

Whenever adding a feature or starting complex work, write `.agents/memory/plans/main-plan.md`:

```markdown
# Master Plan: [Feature / Task Name]
**Date:** [YYYY-MM-DD]
**Status:** IN PROGRESS (Phase 1 of N)
**Total Phases:** N

## Goal & Architecture
[Clear, non-slop description of what we are building, the constraints, and the tech stack]

## Phase Breakdown
- [ ] Phase 1: [Name] — Skills: [skill-a, skill-b]
- [ ] Phase 2: [Name] — Skills: [skill-c, skill-d]
- [ ] Phase 3: [Name] — Skills: [skill-e, skill-f]

## Global Verification Standard
[Tests, linting, visual gates that must be satisfied before final archive]
```

---

## Step 2 — Phase File Decomposition

In `.agents/memory/phases/`, generate separate files for each phase (e.g. `phase-01-scaffold.md`, `phase-02-core-logic.md`).
Each phase file must contain:

```markdown
# Phase [N]: [Phase Name]
**Master Plan:** .agents/memory/plans/main-plan.md
**Status:** [PENDING | IN PROGRESS | VERIFIED | FINISHED]

## Selected Skills for This Phase
- `[category]/[skill-name-1]`: [Why this skill is selected]
- `[category]/[skill-name-2]`: [Why this skill is selected]

## Input Dependencies
- [What files, models, or previous phase outputs must exist]

## Step-by-Step Execution
1. [Actionable step]
2. [Actionable step]

## Success & Verification Criteria
- [ ] Evidence criterion 1 (test output / command)
- [ ] Evidence criterion 2 (visual check / no slop check)
```

---

## Step 3 — The Live Chat Status Dashboard

At the start of every reply during phased execution, you **MUST** render the visual dashboard at the top of your message:

```markdown
┌─────────────────────────────────────────────────────────────┐
│ 🚀 PHASE STATUS DASHBOARD                                   │
├─────────────────────────────────────────────────────────────┤
│ Task: [Feature Name]                                        │
│ Phase 1: [Name]  -> [FINISHED ✓]                            │
│ Phase 2: [Name]  -> [IN PROGRESS ⚙️]                         │
│ Phase 3: [Name]  -> [PENDING ⏳]                            │
├─────────────────────────────────────────────────────────────┤
│ Active Phase: Phase 2                                       │
│ Active Skills: `typography-master` + `design-eng`  │
│ State: [APPLY] -> [EXECUTE 👈] -> [VERIFY] -> [FINISH]      │
└─────────────────────────────────────────────────────────────┘
```

The user instantly sees the position of the project.

---

## Step 4 — The Phase Lifecycle

For each phase:
1. **[APPLY]:** Announce the active phase and load its pre-selected skills.
2. **[EXECUTE]:** Execute the steps in `phase-NN-[name].md`.
3. **[VERIFY]:** Run the verification criteria (`test-verifier` or visual inspection).
4. **[FINISH]:**
   - Update status in `phase-NN-[name].md` to `FINISHED`.
   - **Phase Git Commit:** Activate `git-phase-committer` (`$phase-commit`) to stage and commit the phase deliverables in structured sequence: code (`feat`), tests (`test`), and phase status (`phase`). Include verification proof in the commit message body.
   - Update the Live Chat Status Dashboard showing the phase marked `FINISHED ✓` alongside its commit hash.
   - Ask user confirmation before advancing to next phase.

---

## Step 5 — Memory Cleanup & Archival

When all phases in `.agents/memory/phases/` are `FINISHED` and the master verification succeeds:
1. Move `main-plan.md` and all `phase-*.md` files to `.agents/memory/archive/[YYYY-MM-DD]-[task-name]/`.
2. Clear `.agents/memory/phases/` so no stale phase files remain.
3. Keep `.agents/memory/plans/` ready for the next feature.
4. Append high-level summary to `.agents/memory/session-log.md`.
