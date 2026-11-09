---
name: debug-master
description: >-
  Apex master orchestrator for debugging, error investigation, and diagnostic verification. Enforces a strict hypothesis-driven diagnostic gate via debug-planner before permitting code modifications, demanding raw CLI verification evidence before claiming fixes. Triggers: $debug, fix:, 'debug master', 'fix bug', 'investigate issue'.
metadata:
  category: orchestrators
---
# Debug Master — Orchestrator

**ANNOUNCE:** "Reading `debug-master` — activating diagnostic planning gate."

**The Iron Law:** Find root cause first. Symptom fixes are failure. Always plan before patching.

---

## 1. The Planning Gate ($plan-debug)

When debugging is requested (or `$debug` / `$plan-debug` is invoked):
1. Activate `debug-planner`.
2. Formulate the Diagnostic Plan:
   - Observed symptom with exact file:line references.
   - Deterministic reproduction command.
   - 1 to 3 candidate hypotheses.
   - Investigation and evidence roadmap.
3. Present the plan to the user:
   > *"I have drafted the diagnostic plan for this issue. Shall I proceed with the root-cause investigation?"*
4. **DO NOT edit code until the user approves.**

---

## 2. Investigation & Evidence-Based Fix

Once approved:
1. Isolate the root cause using `root-cause-debugger` or `bug-diagnoser`.
2. State the confirmed root cause with proof.
3. Write a failing regression test first (`tdd-implementer`).
4. Apply minimal surgical fix (`karpathy-coder`).
5. Verify with raw CLI output (`test-verifier`).
