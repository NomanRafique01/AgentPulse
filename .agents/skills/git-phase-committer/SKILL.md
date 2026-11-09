---
name: git-phase-committer
description: >-
  Virtual memory phase completion commit hook. Creates atomic, verified Git commits tied directly to memory phase completions, bundling code, tests, and phase documentation with raw verification proof. Triggers: $phase-commit, phase-commit:, 'commit phase', 'phase commit hook'.
metadata:
  category: git
---
# Git Phase Committer

**ANNOUNCE:** "Reading `git-phase-committer` — creating atomic phase completion commits."

**Core Principle: The Git log is the permanent engineering record of the project. Every finished Virtual Memory Phase must produce structured atomic commits that record the exact verification proof and deliverables achieved.**

---

## Step 1 — Verify Phase Completion Criteria

Before committing a phase:
1. Inspect the active phase file in `.agents/memory/phases/phase-NN-[name].md`.
2. Ensure all verification checkboxes are marked completed `[x]`.
3. Confirm that verification commands (`test-verifier`) were executed and produced raw passing output.

If verification has not run or failed: **STOP**. Do NOT commit the phase until tests pass.

---

## Step 2 — Phase Changeset Inspection

Inspect what changed during this phase:

```bash
git status --porcelain
```

Group the modified files into three phase buckets:
1. **Implementation Code:** Application logic, components, APIs developed in this phase.
2. **Verification & Tests:** Test files, fixtures, or verification scripts written for this phase.
3. **Phase Memory Files:** The updated `.agents/memory/phases/phase-NN-[name].md` and `.agents/memory/plans/main-plan.md`.

---

## Step 3 — The 3-Step Atomic Phase Commit Sequence

To maintain an impeccable Git history, do NOT commit everything in a single blob. Execute the 3-step sequence:

### Commit A: Implementation Code
Stage and commit only production application code:

```bash
git add src/[domain]/...
git commit -m "feat([domain]): implement Phase [N] [Phase Name]

- [Key capability 1 delivered]
- [Key capability 2 delivered]

Phase: Phase [N] - [Phase Name]
Status: Implemented"
```

### Commit B: Phase Test Suite & Fixtures (if applicable)
Stage and commit tests and verification assets:

```bash
git add tests/[domain]/...
git commit -m "test([domain]): add verification test suite for Phase [N]

- [Test cases added]
- [Edge cases verified]

Verified: [Command, e.g. pytest tests/test_*.py passed (X tests)]
Phase: Phase [N] - [Phase Name]"
```

### Commit C: Virtual Memory Phase Status Update
Stage and commit the phase file and master plan:

```bash
git add .agents/memory/phases/phase-NN-[name].md .agents/memory/plans/main-plan.md
git commit -m "phase([NN]): mark Phase [N] ([Phase Name]) as verified and completed

- Updated phase status to FINISHED
- All phase verification criteria satisfied

Verified-by: [test / build command evidence]
Refs: .agents/memory/plans/main-plan.md"
```

---

## Step 4 — Verification & Live Dashboard Advance

After the commits are created:
1. Verify the commit sequence:
   ```bash
   git log -n 3 --oneline
   ```
2. Report the commit hashes in the chat.
3. Advance the Live Status Dashboard to the next phase:
   ```markdown
   ┌─────────────────────────────────────────────────────────────┐
   │ 🚀 PHASE STATUS DASHBOARD                                   │
   ├─────────────────────────────────────────────────────────────┤
   │ Task: [Feature Name]                                        │
   │ Phase 1: [Scaffold]         -> [FINISHED ✓] (commit: abc12) │
   │ Phase 2: [Core Logic]       -> [IN PROGRESS ⚙️]              │
   │ Phase 3: [UI & Polish]      -> [PENDING ⏳]                 │
   ├─────────────────────────────────────────────────────────────┤
   │ Phase 1 Committed: `feat(api)`, `test(api)`, `phase(01)`   │
   │ Stage: Ready to begin Phase 2                               │
   └─────────────────────────────────────────────────────────────┘
   ```
4. Ask user confirmation before initiating the next phase.
