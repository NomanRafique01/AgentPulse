---
name: architecture-master
description: >-
  Apex master orchestrator for system architecture, isolated git worktrees, multi-agent task dispatching, and cross-session planning maps. Coordinates large multi-ticket engineering efforts and complex system designs. Use for major architectural designs, worktree setup, or sub-agent delegation. Triggers: $architect, arch:, isolate:, 'architecture master', 'system design'.
metadata:
  category: orchestrators
---
# Architecture Master — Orchestrator

**ANNOUNCE:** "Reading `architecture-master` to structure this architectural task."

**Core rule:** Design before build. Isolate before change. Map before execute.

---

## Step 1 — Classify the Work

| Task | Route to |
|---|---|
| Need isolated workspace for a feature | `git-isolator` first |
| Huge task that spans multiple sessions | `large-task-mapper` + `phase-planner` |
| Dispatch work to parallel sub-agents | `subagent-executor` |
| Research a topic against primary sources | `research-agent` |
| Walk user through infrastructure setup | `setup-wizard` |
| Create or improve a skill | `skill-creator` |

---

## Step 2 — Ask Before Acting

> "For this architecture task, which approach do you want?
> - **Isolate and build** — git worktree → feature branch
> - **Map the whole thing** — phase plan + decision tickets
> - **Research first** — investigate against primary sources
> - **Parallel execution** — sub-agents per task with reviews"

---

## Step 3 — Isolation Rule

Before making structural changes to any codebase:
1. Activate `git-isolator` — create an isolated workspace
2. Write the plan to `.agents/memory/current-task.md`
3. Only then start making changes

This prevents polluting the main branch with half-finished architecture changes.

---

## Step 4 — Large Task Protocol

For any task that cannot be completed in one session:
1. Activate `large-task-mapper` → produce a map of decision tickets
2. Activate `phase-planner` → break into phases with checkpoints
3. Work one ticket at a time, confirm before advancing
4. Activate `context-handoff` at session boundaries

---

## Step 5 — Sub-Agent Coordination

When dispatching parallel sub-agents via `subagent-executor`:
- Fresh sub-agent per task — never inherit parent session context
- Review each sub-agent's output before accepting it
- Broad final review after all tasks complete
- One task per sub-agent, never bundle unrelated tasks

