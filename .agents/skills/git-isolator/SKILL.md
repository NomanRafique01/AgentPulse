---
name: git-isolator
description: >-
  Git worktree isolation and physical branch workspace manager. Creates isolated git worktrees for new features or sub-agent tasks, preventing dirty working trees and cross-feature contamination. Use before starting experimental or multi-branch work. Triggers: $git-isolator, isolate-workspace:, 'isolate git', 'create worktree'.
metadata:
  category: architecture
---
# Git Isolator

**ANNOUNCE:** "Reading `git-isolator` — creating an isolated workspace before starting."

Feature work that touches the main branch directly is work that can't be safely abandoned or reviewed. Isolate first.

---

## Step 1 — Check for Native Platform Tools

If a native workspace/branch tool exists (e.g., the IDE's built-in branch feature), prefer it.

Otherwise, proceed to git worktrees.

---

## Step 2 — Create a Git Worktree

```bash
# From the repository root

# Create a new branch and worktree simultaneously
git worktree add ../[feature-name]-work -b feature/[feature-name]

# Navigate to the worktree
cd ../[feature-name]-work

# Confirm isolation
git status
# Should show: On branch feature/[feature-name]
# Clean working tree
```

The worktree is a separate directory with its own working tree but shares the same git history. Changes there don't affect your main workspace.

---

## Step 3 — Verify Isolation

```bash
# In the worktree
git branch   # Should show feature/[feature-name] as current
git log --oneline -5  # Should match main branch history

# In the main workspace (in another terminal)
git branch   # Should still show main/master as current
git status   # Should be clean
```

---

## Step 4 — Work in the Worktree

All implementation happens in the worktree directory. The main workspace stays clean.

```bash
# In the worktree
# Do all your work here
# Commit frequently
git commit -m "feat: [what this commit delivers]"
```

---

## Step 5 — Cleanup After Merge

```bash
# After the PR is merged
cd [back to main workspace]
git worktree remove ../[feature-name]-work
git branch -d feature/[feature-name]
git fetch --prune  # Clean up remote tracking branches
```

---

## When Not to Use Worktrees

- Hotfixes on main (too small to warrant isolation)
- Documentation-only changes
- Configuration changes with no code impact

For everything else — isolate first.

