---
name: pr-writer
description: >-
  Pull request documentation craftsman. Analyzes git commits and diffs to generate comprehensive, review-ready pull request descriptions complete with rationale, architecture diagrams, risk assessments, and test verification evidence. Use when preparing PRs for review. Triggers: $pr-writer, write-pr:, 'write pr', 'generate pr description'.
metadata:
  category: backend
---
# PR Writer

**ANNOUNCE:** "Reading `pr-writer` — writing the pull request description."

A PR description is a letter to your reviewers. Write it for someone who hasn't been in your head for the past 3 hours.

---

## PR Template

```markdown
## What Changed

[2–4 sentences: what this PR adds, changes, or removes. Not how — what.]

## Why

[1–3 sentences: the problem this solves or the decision that led to this change.
Link to the relevant ticket or spec if one exists.]

## How to Test

1. [Step the reviewer must take]
2. [Step the reviewer must take]
3. [Expected outcome]

For automated tests: "All tests pass: `npm test`"

## Screenshots (if UI change)

| Before | After |
|---|---|
| [screenshot] | [screenshot] |

## Checklist

- [ ] Tests added for new behavior
- [ ] No `console.log` left in
- [ ] No `TODO` added without a ticket reference
- [ ] Accessibility checked (if UI change)
- [ ] Breaking changes documented in CHANGELOG.md (if any)

## Breaking Changes

[None — or describe what breaks and the migration path]

## Notes for Reviewers

[Anything that deserves special attention, tricky decisions made, known limitations]
```

---

## Rules for Writing the PR Description

- **Present tense, active voice.** "Adds user authentication" not "User authentication was added."
- **What, not how.** The diff shows how. The description explains what and why.
- **Specific, not vague.** "Fixes the logout button not redirecting on mobile Safari" not "Fixes a bug."
- **Short sentences.** If you need a subordinate clause, split the sentence.
- **Link everything.** Ticket number, spec, design file, related PRs — link them.
- **Screenshots for every UI change.** Before and after. No exceptions.

