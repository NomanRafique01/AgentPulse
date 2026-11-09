---
name: root-cause-debugger
description: >-
  Evidence-first root cause debugger. Enforces rigorous diagnostic isolation before any code edits, generating minimal reproductions, logging traces, and identifying precise failure points. Use for debugging crashes, logic bugs, and data corruptions. Triggers: $root-cause, root-cause:, 'find root cause', 'root cause debugging'.
metadata:
  category: debugging
---
# Root Cause Debugger

**ANNOUNCE:** "Reading `root-cause-debugger` — finding root cause before proposing any fix."

**The Iron Law: ALWAYS find root cause before attempting fixes. Symptom fixes are failure.**

---

## The Debugging Protocol

### Step 1 — State the Symptom Precisely

Before investigating anything, write:
```
SYMPTOM: [Exact error message, or exact unexpected behavior]
OBSERVED: [What actually happens]
EXPECTED: [What should happen]
REPRODUCTION: [Steps to reproduce — can another person follow these?]
FREQUENCY: [Always / Sometimes / Rarely / Once]
ENVIRONMENT: [OS, runtime version, browser, context where it occurs]
```

### Step 2 — Gather Evidence

Do NOT form a hypothesis yet. Gather data first:

```
1. Read the full error message and stack trace — do not skim
2. Identify the exact line where the error originates (not just where it's reported)
3. Find the last successful state before the failure
4. Check recent changes: what changed recently that could have caused this?
5. Check the logs: what happened immediately before the error?
```

### Step 3 — Form ONE Hypothesis

After evidence is gathered, form exactly ONE hypothesis:
```
HYPOTHESIS: "The error occurs because [specific mechanism] when [specific condition]."
```

It must be:
- Specific enough to be falsifiable
- Consistent with all the evidence gathered
- Pointing to a root cause, not a symptom

If multiple things could cause it — pick the most likely ONE and test it.

### Step 4 — Test the Hypothesis

Design a test that will PROVE or DISPROVE the hypothesis:
```
TEST: [What you will do to test the hypothesis]
IF TRUE: [What you expect to see]
IF FALSE: [What you expect to see]
```

Run the test. Do not fix anything yet.

### Step 5 — State the Root Cause

After the hypothesis is confirmed:
```
ROOT CAUSE: [What is actually wrong — specific, precise]
EVIDENCE: [What proves this is the root cause]
```

**If you cannot state the root cause with evidence, you have not found it yet.**

### Step 6 — Propose the Fix

Only now propose a fix. The fix must address the root cause, not the symptom.

```
FIX: [What to change and why this addresses the root cause]
VERIFICATION: [How to confirm the fix worked — specific test or command]
RISK: [Could this fix break anything else?]
```

---

## Common Root Cause Categories

When investigating, look for these:

- **Race condition:** Two things happening in a non-deterministic order
- **State mutation:** Something modifying shared state unexpectedly
- **Off-by-one:** Boundary conditions at edges of collections or ranges
- **Type mismatch:** A value being the wrong type at the point of use
- **Missing null check:** A value being null or undefined where it's assumed to exist
- **Stale closure:** A function capturing an old value of a variable
- **Environment difference:** Works in development, breaks in production (env vars, timing, OS)
- **Assumption violation:** Code assumes something that is not guaranteed (e.g., async order)

---

## When to Escalate

If after 3 hypothesis-test cycles the root cause is still unclear:
1. Stop and report what has been ruled out
2. Ask for more context from the user
3. Consider activating `bug-diagnoser` for a more systematic approach

