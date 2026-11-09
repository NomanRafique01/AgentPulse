---
name: git-master
description: >-
  Apex master orchestrator for Git version control, atomic commit splitting, branch lifecycle hygiene, and virtual memory phase commit synchronization. Coordinates git-atomic-committer, git-branch-manager, and git-phase-committer. Triggers: $git, git:, 'git master', 'git workflow'.
metadata:
  category: orchestrators
---
# Git Master — Category Orchestrator

**ANNOUNCE:** "Reading `git-master` — orchestrating Git version control, commits, and branch lifecycle."

**Master Mandate: Treat Git history as a first-class engineering artifact. Enforce atomic commit splitting across domains, strict branch naming hygiene, and automatic Virtual Memory phase commit synchronization with verified proof.**

---

## The 4 Git Iron Laws

### Law 1 — Never Commit Blindly
Before staging or committing, always inspect `git status --porcelain` and `git diff --stat`. Never run a blind `git add .` or commit unreviewed code.

### Law 2 — Atomic Commit Splitting
When changes span multiple domains (e.g. backend logic, UI, tests, memory phases), **split into 2 or more sequential atomic commits**. Never dump an entire multi-system feature into a single sloppy commit.

### Law 3 — Conventional Commits with Evidence
All commit messages must follow `<type>(<scope>): <imperative summary>`. Footers must cite verification evidence (`Verified: <test command passed>`) and memory phase references.

### Law 4 — Phase Memory Synchronization
When a Virtual Memory Phase transitions to `FINISHED` in `.agents/memory/phases/`, automatically trigger `git-phase-committer` to record the completed phase deliverables and verification evidence in Git history before moving to the next phase.

---

## Category Routing Matrix

| User Trigger | Sub-Skill Route | Operational Action |
|---|---|---|
| `$commit` / `commit:` / "commit this" | `git-atomic-committer` | Analyzes diff, splits into 2+ commits if multi-domain, writes Conventional Commit messages with test evidence. |
| `$branch` / `branch:` / "new branch" | `git-branch-manager` | Verifies clean tree, stashes if dirty, branches with strict taxonomy (`feat/`, `fix/`, `phase/`), rebases on main. |
| `$phase-commit` / Phase `FINISHED` | `git-phase-committer` | Commits phase code, test suite, and phase markdown files sequentially with verification proof. |
| "Isolate feature in worktree" | `git-branch-manager` + `git-isolator` | Creates an isolated physical worktree directory and branch. |
| "Prepare PR" / "Review commits" | `git-atomic-committer` + `pr-writer` | Validates clean commit log and synthesizes an executive PR description. |

---

## Execution Workflow

1. **Classify:** Determine whether the user wants to commit, manage branches, sync with remote, or commit a memory phase.
2. **Propose & Announce:** State the selected sub-skills from `.agents/brain/decisions/git.md`.
3. **Inspect:** Run read-only commands (`git status`, `git diff --stat`, `git branch`) to establish baseline state.
4. **Execute:** Apply atomic commits or branch transitions sequentially.
5. **Verify:** Confirm final status with `git log -n <count> --oneline` and `git status`.
