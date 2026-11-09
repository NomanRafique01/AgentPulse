---
name: tdd-implementer
description: >-
  Test-Driven Development (TDD) red-green-refactor practitioner. Enforces writing minimal failing tests before writing production code, verifying tests fail for the right reason, writing minimal passing code, and refactoring cleanly. Use for any new business logic, algorithm, or bug fix. Triggers: $tdd, tdd:, 'test driven development', 'tdd loop'.
metadata:
  category: backend
---
# TDD Implementer

> [!IMPORTANT]
> **Test-On-Demand:** Only activate when the user explicitly triggers `$tdd` or requests test-driven development. Do not test logic unless asked by the user.

**ANNOUNCE:** "Reading `tdd-implementer` — following red-green-refactor discipline as requested."

**If you didn't watch the test fail, you don't know if it tests the right thing.**

---

## The Loop (Never Skip a Step)

### Red — Write a Failing Test

Write the test before any implementation code:
```
1. Pick the smallest unit of behavior to implement
2. Write a test that describes the expected behavior
3. Run it — it MUST fail
4. If it passes immediately: the test is wrong or the feature already exists
5. State the failure message out loud before moving on
```

Test structure:
- **Arrange:** set up the conditions
- **Act:** perform the action
- **Assert:** verify the outcome
- Name the test: `"[unit] [does/returns/throws] [expected] when [condition]"`

### Green — Write Minimal Code to Pass

```
1. Write the MINIMUM code needed to make the test pass
2. Do not write code for cases not yet tested
3. Hardcoding is fine for the first pass — refactoring comes next
4. Run the test — it MUST pass
5. State "green" before moving on
```

### Refactor — Clean Without Changing Behavior

```
1. The tests are green — now clean the code
2. Remove duplication
3. Improve naming
4. Extract to functions or classes where it helps readability
5. Run the tests after each refactor step — they must stay green
6. Stop refactoring when the tests are still green and the code is clear
```

---

## What Makes a Good Test

A test is good if:
- It fails for exactly one reason (the feature doesn't work)
- It passes for exactly one reason (the feature works)
- It doesn't test implementation details — only observable behavior
- It runs fast (< 100ms for unit tests)
- It can run in isolation (no shared state)
- The name describes the expected behavior, not the implementation

---

## What to Test (And What Not To)

**Test:**
- Business logic, calculations, transformations
- API contract (inputs → outputs)
- Error handling — specific errors for specific conditions
- Edge cases that have bit you before

**Don't test:**
- Implementation details (private methods, internal state)
- Framework code (assume React, Express, etc. work)
- Simple getters/setters
- Third-party library behavior

---

## Integration Tests

After unit tests pass, write one integration test that covers the full flow:
```
1. Real inputs → real outputs
2. Uses the actual API or module boundary
3. Tests the seam between components
4. Slower is fine — run these separately
```

---

## Before Moving On

Before calling a feature "done":
1. All tests pass (run them, don't assume)
2. Coverage includes the happy path AND at least one error path
3. The test names describe the behavior clearly
4. No `// @ts-ignore` or `any` was used to make tests pass

