---
name: test-verifier
description: >-
  Evidence-before-claims test verifier and build auditor. Runs verification or tests ONLY when explicitly commanded by the user ($test, $verify). Never run unsolicited tests or test logic unless asked. Triggers: $test, $verify, test:, evidence:, 'run tests', 'test logic'.
metadata:
  category: debugging
---
# Test Verifier

> [!IMPORTANT]
> **Rule 9 — Test-On-Demand:** Unless the user explicitly commands `$test`, `$verify`, or asks you to test the logic, DO NOT run tests, write unit tests, or execute test suites. Only verify when asked.

**ANNOUNCE:** "Reading `test-verifier` — gathering verification evidence as requested."

**"It should work" is not evidence. Run it. Show the output. Then claim it works.**

---

## The Verification Protocol

Before saying any of these: "done", "fixed", "passing", "complete", "working" — run verification.

### Step 1 — Identify the Verification Commands

```
For tests: [npm test / pytest / cargo test / etc.]
For type checking: [tsc --noEmit / pyright / etc.]
For linting: [eslint / ruff / etc.]
For build: [npm run build / etc.]
For the specific feature: [the manual verification step]
```

### Step 2 — Run Them and Show the Output

Run each command. Paste the actual output — not a summary, not an interpretation. The actual output.

```
$ npm test
✓ UserService.create creates a user with valid data (23ms)
✓ UserService.create throws on duplicate email (12ms)
✓ UserService.delete marks user as deleted (8ms)

Tests: 3 passed, 3 total
```

### Step 3 — State What Passed and What Didn't

```
VERIFICATION RESULT:
- Tests: 3/3 passing ✓
- Type check: 0 errors ✓
- Lint: 0 errors ✓
- Build: succeeded ✓

CONCLUSION: [Feature/fix] is complete. Evidence above.
```

---

## What "Done" Means

Done means ALL of these are true — not most, not some:
- [ ] All tests pass (not just the new ones — run the whole suite)
- [ ] No type errors (TypeScript / Pyright clean)
- [ ] No lint errors
- [ ] The specific behavior described in the spec/ticket is working
- [ ] Edge cases and error states work (tested or explicitly noted as future work with a ticket)
- [ ] No `console.log`, `print()`, `debugger`, or `TODO` left in the committed code
- [ ] The code is committed (not just saved)

---

## Common Mistakes to Catch

Before delivering, check:
- Did you run tests after the LAST change, not just after an earlier change?
- Are you running the right test suite? (dev test suite vs. CI test suite may differ)
- Did a previously passing test break? (always run the full suite, not just new tests)
- Is the dev server cache stale? (try a hard refresh or restart the server)

---

## When You Can't Run Verification

If the environment doesn't allow running tests (sandboxed, no Node, etc.):
```
VERIFICATION BLOCKED: [reason]
WHAT I WOULD RUN: [commands]
EXPECTED OUTPUT: [what passing looks like]
MANUAL VERIFICATION STEPS: [what a human should do to verify]
```

Never claim completion without either running verification or explicitly stating that you couldn't and why.

