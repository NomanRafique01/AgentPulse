---
name: session-continuity
description: >-
  Cross-session state recovery and continuous execution manager. Scans virtual memory plans and phases to reconstruct active progress across cold starts, preventing duplicate work and logging session deltas to session-log.md. Use at the beginning of sessions or when resuming tasks. Triggers: $session-continuity, resume-session:, 'where were we', 'resume session'.
metadata:
  category: memory
---
# Session Continuity

**ANNOUNCE:** "Reading `session-continuity` — recovering active plan and phase state from memory."

---

## Session Initialization Protocol

When an agent wakes up or begins a new conversation:

### 1. Memory Health Scan
Check the `.agents/memory/` hierarchy:
```bash
# Check for active plan
Test-Path ".agents/memory/plans/main-plan.md"
# Check for active phase files
Get-ChildItem ".agents/memory/phases/"
```

### 2. State Reconstruction
- If `main-plan.md` exists:
  - Read the active phase from the plan.
  - Read the corresponding `phase-NN-[name].md`.
  - Announce: "Resuming task: [Name]. Active phase: [Phase N]. Ready to execute [Step X]."
  - Render the Phase Status Dashboard immediately.
- If no active plan exists:
  - Review `.agents/memory/session-log.md` for the last completed milestone.
  - Ask user for the new task or feature direction.

---

## Mid-Session State Tracking

During execution:
1. **Decision Capture:** Every non-obvious choice (data schema choice, library pick, breaking change) is appended to `.agents/memory/decisions.md` or saved as an ADR in `.agents/memory/decisions/ADR-NNN.md`.
2. **Phase Status Sync:** As tasks inside the active phase complete, check them off in `phase-NN-[name].md`.
3. **No Drift:** Never wander into work belonging to Phase N+1 while Phase N is still in progress.

---

## Session Teardown Protocol

Before the session closes or context becomes exhausted:
1. Write a session delta to `.agents/memory/session-log.md`:
   ```markdown
   ## [YYYY-MM-DD HH:MM] Session Update
   - **Active Task:** [Name]
   - **Active Phase:** [Phase N: Name] (Status: [In Progress / Verified])
   - **Completed Today:** [List of concrete achievements]
   - **Immediate Next Action:** [Exact command or file edit needed next]
   - **Pending Decisions:** [Any open user questions]
   ```
2. If context limit is nearing, invoke `context-handoff`.

