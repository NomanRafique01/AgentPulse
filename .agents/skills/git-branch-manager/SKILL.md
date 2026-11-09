---
name: git-branch-manager
description: >-
  Branch lifecycle and working tree hygiene orchestrator. Enforces kebab-case taxonomy (feat/, fix/, phase/), verifies clean git trees, executes rebase synchronizations against main, and safely prunes merged branches. Triggers: $branch, branch:, 'create branch', 'switch branch', 'sync branch', 'git rebase'.
metadata:
  category: git
---
# Git Branch Manager

**ANNOUNCE:** "Reading `git-branch-manager` — managing branch lifecycle and synchronization."

**Core Principle: Feature work never pollutes the main branch. Every branch must follow a standard naming taxonomy, originate from an up-to-date main, and rebase cleanly before merge.**

---

## Step 1 — Branch Naming Taxonomy

All branches must adhere strictly to the kebab-case naming standard:

| Branch Type | Format | Example | Purpose |
|---|---|---|---|
| Feature | `feat/<name>` | `feat/jwt-authentication` | User-facing feature or capability |
| Bug Fix | `fix/<issue>` | `fix/mobile-nav-overflow` | Bug fix or regression patch |
| Memory Phase | `phase/<N>-<name>` | `phase/02-token-engine` | Branch tied directly to a memory phase |
| Refactoring | `refactor/<target>` | `refactor/query-pipeline` | Code simplification without behavior change |
| Maintenance | `chore/<target>` | `chore/upgrade-tailwind` | Dependency updates, tooling, config |

**FORBIDDEN:**
- ❌ `noman/test`
- ❌ `wip-fix`
- ❌ `patch1`
- ❌ `new-feature-branch`

---

## Step 2 — Working Tree Hygiene Check

Before switching or creating a branch, inspect working tree state:

```bash
git status --porcelain
```

### If Dirty (Uncommitted Changes Exist):
Never discard uncommitted work. Ask the user or safely stash:
```bash
# Stash current work with a clear descriptive label
git stash push -m "WIP before switching to [branch-name]"

# Verify tree is now clean
git status
```

---

## Step 3 — Branch Creation Protocol

Always branch from the freshest state of the base branch (`main` or `master`):

```bash
# 1. Fetch latest changes from remote
git fetch origin

# 2. Switch to base branch and pull latest
git checkout main
git pull --ff-only origin main

# 3. Create and switch to the new feature branch
git checkout -b feat/[feature-name]

# 4. Verify branch tracking
git branch --show-current
```

*(Note: For complex multi-session features requiring separate directory trees, activate `git-isolator` to create a dedicated git worktree).*

---

## Step 4 — Branch Synchronization (Rebase Workflow)

Keep branches up to date with `main` using **rebase** (not merge commits) to ensure a linear, legible history:

```bash
# 1. Fetch latest commits from remote
git fetch origin

# 2. Rebase feature branch onto origin/main
git rebase origin/main
```

### Conflict Resolution Protocol
If a conflict occurs during rebase:
1. Identify conflicted files: `git status`.
2. Inspect the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
3. Resolve conflicts preserving both feature intent and upstream updates.
4. Stage resolved files: `git add <resolved-files>`.
5. Continue rebase: `git rebase --continue`.
6. **NEVER** run `git rebase --skip` unless explicitly intended to discard a commit.
7. If resolution goes wrong, safely abort: `git rebase --abort`.

---

## Step 5 — PR & Merge Readiness Gate

Before merging or opening a Pull Request:
1. Verify branch is rebased cleanly on latest `origin/main`.
2. Ensure test suite passes: run verification command (`test-verifier`).
3. Inspect commits on branch:
   ```bash
   git log --oneline origin/main..HEAD
   ```
4. Verify all commit messages follow the Conventional Commits format (`git-atomic-committer`).

---

## Step 6 — Post-Merge Cleanup

After a branch is merged into `main`:

```bash
# 1. Switch back to main and pull
git checkout main
git pull origin main

# 2. Safely delete the local merged branch (flag -d prevents deleting unmerged work)
git branch -d feat/[feature-name]

# 3. Prune stale remote tracking references
git fetch --prune origin
```
