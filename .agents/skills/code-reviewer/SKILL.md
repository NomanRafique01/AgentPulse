---
name: code-reviewer
description: >-
  Dual-pass code reviewer for repo standards, architectural integrity, and security vulnerabilities. Evaluates diffs against specification requirements, edge cases, error handling, and performance regressions. Use when reviewing PRs, staging commits, or auditing code quality. Triggers: $code-reviewer, review-code:, 'review diff', 'code review'.
metadata:
  category: debugging
---
# Code Reviewer

**ANNOUNCE:** "Reading `code-reviewer` — reviewing against standards and spec in parallel."

Two reviews, side by side. Standards and Spec. Both must pass.

---

## Review 1 — Standards

Read the project's coding standards (AGENTS.md, GEMINI.md, README, or ask the user where they live). Then check:

### Code Quality
- [ ] Functions are small (under 50 lines is a sign; over 100 is a smell; over 200 is a problem)
- [ ] Names describe what things are (variables, functions, types) — no single letters outside loops
- [ ] No magic numbers — constants are named
- [ ] No dead code — nothing commented out, no unused imports
- [ ] No `any` in TypeScript, no `# type: ignore` in Python
- [ ] Error handling is explicit — no silent swallowing of exceptions
- [ ] No `console.log`, `print()`, `debugger` left in
- [ ] No `TODO` without a ticket reference

### Tests
- [ ] New behavior has tests
- [ ] Tests test behavior (inputs → outputs), not implementation
- [ ] Edge cases and error paths are tested
- [ ] No tests that can only pass (no assertions, or trivially true assertions)

### Architecture
- [ ] The change is in the right module — no responsibilities leaked to wrong layers
- [ ] No new dependencies added without justification
- [ ] No circular dependencies introduced
- [ ] Public interfaces are minimal — no unnecessary exposure of internals

---

## Review 2 — Spec

Find the originating spec, ticket, or issue. Then check:

- [ ] Everything the spec requires is implemented
- [ ] Nothing outside the spec is implemented (YAGNI)
- [ ] Edge cases stated in the spec are handled
- [ ] Error states stated in the spec are handled
- [ ] The acceptance criteria in the ticket are met (if any)
- [ ] No "I'll do this later" — everything in scope is done or explicitly ticketed

---

## Output Format

```markdown
## Code Review: [Branch/PR name]

### Standards Review

**PASS / FAIL / WARN** — [Summary]

Issues found:
| Severity | File | Line | Issue | Suggested Fix |
|---|---|---|---|---|
| FAIL | src/auth.ts | 47 | Unhandled promise rejection | Wrap in try/catch |
| WARN | src/user.ts | 12 | Magic number 86400 | Const SECONDS_PER_DAY |

### Spec Review

**PASS / FAIL / WARN** — [Summary]

Spec: [link or description]
Issues found:
- FAIL: [requirement] is not implemented
- WARN: [edge case] from spec is not handled

### Verdict

MERGE READY / NEEDS CHANGES / BLOCKED

[If NEEDS CHANGES: list the 3 most important changes needed before this can merge]
```

