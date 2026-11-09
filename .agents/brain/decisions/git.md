# Git Skills — Decision Making Matrix

This document dictates how the agent handles version control operations, atomic commits, branch lifecycle management, and virtual memory phase commit synchronization.

---

## 1. Mandatory Baseline

Before executing any git operations:
- Never commit broken code, syntax errors, or unverified changes.
- Never dump massive, unrelated multi-domain changes into a single generic commit.
- Inspect `git status --porcelain` and `git diff --stat` before staging files.
- Enforce Conventional Commits standard: `<type>(<scope>): <imperative summary>` (<= 72 chars), followed by a concise body and verification evidence footer.
- When working within Virtual Memory (`.agents/memory/phases/`), every phase transition to `FINISHED` must trigger an atomic phase commit.

---

## 2. Specialized Skill Selection Matrix

| Git Operational Goal | Selected Skills | Why This Combination |
|---|---|---|
| **User commands: `$commit`, `commit:`, or code ready to commit** | `git-atomic-committer` | Analyzes staged/unstaged changes, evaluates domain blast radius, splits into 2 or more atomic commits if changes span multiple domains, crafts Conventional Commit message with verification evidence. |
| **User commands: `$branch`, `branch:`, or creating/syncing branches** | `git-branch-manager` | Enforces strict naming conventions (`feat/`, `fix/`, `phase/`, `refactor/`, `chore/`), checks working tree hygiene, performs rebase sync (`git pull --rebase origin main`), and handles branch cleanup. |
| **A Virtual Memory Phase completes (`[VERIFY]` → `[FINISH]`)** | `git-phase-committer` | Hooks into Step 4 of `phase-planner`. Stages and splits phase code, test fixtures, and memory updates into atomic phase commits, recording verification proof in the commit body. |
| **Feature isolation in separate workspace** | `git-branch-manager` + `git-isolator` | Creates an isolated worktree branch (`git worktree add ../feature-work -b feature/...`), keeping main branch unpolluted. |
| **Preparing Pull Request / Merge readiness** | `git-atomic-committer` + `pr-writer` | Validates clean atomic commit history and synthesizes high-fidelity PR description from the commit log. |

---

## 3. Commit Splitting Decision Rule

When analyzing workspace diffs:

```
Total Changed Files & Domains?
│
├── 1 domain, <= 3 tightly coupled files ──► SINGLE ATOMIC COMMIT
│   └── Example: feat(auth): implement token refresh rotation
│
└── Multiple domains OR > 3 loosely coupled files ──► SPLIT INTO 2+ ATOMIC COMMITS
    ├── Commit 1 (Core Domain / Backend): feat(...) or fix(...)
    ├── Commit 2 (Tests & Verification Fixtures): test(...)
    ├── Commit 3 (UI / Styling / Components): feat(ui) or style(...)
    └── Commit 4 (Memory Phases / Config / Docs): chore(phase-N) or docs(...)
```

---

## 4. Anti-AI SOP Commit Standard

- **FORBIDDEN:**
  - ❌ "Update files"
  - ❌ "WIP" / "misc fixes" / "make code better"
  - ❌ "Refactor code for improved readability and maintainability" (AI fluff)
  - ❌ Monolithic 500-line commits combining UI, backend, tests, and config together.
- **MANDATORY:**
  - ✅ Imperative present tense in header ("add", "fix", "refactor", not "added" or "adds").
  - ✅ Explicit scope in header: `feat(api): ...`, `fix(layout): ...`, `test(auth): ...`.
  - ✅ Verification evidence in footer: `Verified: pytest passed (14 tests)`.
