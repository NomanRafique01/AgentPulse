---
name: git-atomic-committer
description: >-
  Multi-domain atomic commit splitting engine. Analyzes staged diffs, segregates cross-domain changes into sequential atomic commits (Core Logic, Tests, UI, Memory), and crafts Conventional Commit messages with verification proof. Triggers: $commit, commit:, 'git commit', 'atomic commit', 'commit changes'.
metadata:
  category: git
---
# Git Atomic Committer

**ANNOUNCE:** "Reading `git-atomic-committer` — inspecting changes and crafting atomic commits."

**Core Principle: A commit is an atomic, self-contained unit of verified progress. Never dump unrelated domains into a single monolithic commit; split into 2 or more cohesive commits whenever changes span multiple boundaries.**

---

## Step 1 — Workspace Inspection

Before touching `git add`, inspect the exact status and diff:

```bash
# 1. Check all untracked and modified files
git status --porcelain

# 2. Check diff summary and volume of changes
git diff --stat
```

Identify the files modified across their functional domains:
- **Domain Core / API:** Business logic, schemas, algorithms, route handlers.
- **Tests & Verification:** Unit tests, integration tests, mock fixtures.
- **UI & Presentation:** Components, CSS styles, templates, icon assets.
- **Configuration & Infrastructure:** Build configs, dependency manifests, CI files.
- **Documentation & Memory:** Phase plans, architecture notes, README updates.

---

## Step 2 — The Atomic Splitting Algorithm

Evaluate whether the changes belong in a single commit or must be split:

### Single Commit Criteria
Apply a single atomic commit **ONLY** when:
- Total modified files <= 3.
- All files belong to the **same functional domain** (e.g. 1 API endpoint + its direct helper).
- The change represents a single logical thought.

### Multi-Commit Splitting Criteria (2 or More Commits)
If ANY of the following conditions are met, you **MUST split into 2 or more sequential atomic commits**:
1. **Domain Boundary Crossing:** The changeset contains both core logic and UI components, or both application code and configuration.
2. **Implementation vs. Tests:** Both production source code and test files were modified. Source logic and test suites should be split so each commit remains focused.
3. **Memory Phase Artifacts:** `.agents/memory/phases/` or `plans/` are modified alongside source code. Memory status updates are committed separately from feature implementation.
4. **Change Volume Threshold:** More than 4 files modified or > 150 lines changed across distinct modules.

### Splitting Sequence

When splitting into multiple commits, execute in this order:

```
Step 1: Commit Core Logic / API
        git add <core-files>
        git commit -m "feat(scope): ..."

Step 2: Commit Test Coverage & Fixtures
        git add <test-files>
        git commit -m "test(scope): ..."

Step 3: Commit UI / Presentation Changes
        git add <ui-files>
        git commit -m "feat(ui): ..."

Step 4: Commit Documentation / Memory Phase Updates
        git add <doc-files> <memory-files>
        git commit -m "docs(scope): ..." OR "phase(N): ..."
```

---

## Step 3 — Conventional Commit Message Specification

Every commit message must adhere strictly to the Conventional Commits format with engineering-grade precision:

```
<type>(<scope>): <short imperative summary>

[Optional Body: 1-3 bullet points explaining WHAT changed and WHY]
- Bullet 1: Exact mechanism added, fixed, or refactored
- Bullet 2: Rationale or architectural constraint addressed

[Footer: Verification & References]
Verified: <test command passed / evidence summary>
Refs: <phase or issue identifier>
```

### Type Taxonomy

| Type | When to Use | Example |
|---|---|---|
| `feat` | New capability, feature, or endpoint | `feat(auth): add JWT refresh token rotation` |
| `fix` | Bug fix, error resolution, crash patch | `fix(layout): resolve 320px viewport horizontal overflow` |
| `refactor`| Code change that neither fixes a bug nor adds a feature | `refactor(parser): extract token tokenizer into standalone module` |
| `perf` | Performance improvement or latency reduction | `perf(query): add compound index on tenant_id and created_at` |
| `test` | Adding missing tests or correcting existing tests | `test(auth): add unit test coverage for expired refresh tokens` |
| `style` | Formatting, whitespace, semicolon changes (no code logic) | `style(nav): align header icon spacing with 8px grid` |
| `docs` | Documentation only changes | `docs(api): document rate limiting header specifications` |
| `chore` | Build process, tooling, dependency updates | `chore(deps): update vite to 5.4.0` |
| `phase` | Virtual memory phase progress tracking | `phase(02): mark core logic phase as verified and completed` |

### Rules for the Summary Line
- Use the imperative mood: "add" not "added" or "adds"; "fix" not "fixed" or "fixes".
- Lowercase first letter after the colon.
- No trailing period (`.`).
- Maximum 72 characters.

---

## Step 4 — Execution Protocol

Execute each atomic commit with precise file staging:

```bash
# Explicit file staging — NEVER use a blind "git add ." when splitting
git add src/domain/auth.py src/domain/tokens.py

# Commit with structured message
git commit -m "feat(auth): add token refresh rotation logic

- Implement sliding window token renewal in AuthTokenService
- Reject expired refresh tokens with 401 Unauthorized

Verified: pytest tests/test_auth.py passed (8 passed)
Refs: Phase 2"

# Stage the next atomic group
git add tests/test_auth.py
git commit -m "test(auth): add unit tests for token refresh expiry

- Test valid refresh token renewal lifecycle
- Test tampered and expired refresh token rejection

Verified: pytest tests/test_auth.py (10 passed)
Refs: Phase 2"
```

---

## Step 5 — Post-Commit Verification

Always verify the commit history immediately after execution:

```bash
git log -n 3 --oneline
```

Verify that:
1. Every commit has a distinct, descriptive message.
2. `git status` shows only remaining intended files or a clean working tree.
3. No secrets (`.env`, credentials, private keys) were staged or committed.
