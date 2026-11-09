---
name: debug-planner
description: >-
  Pre-debugging diagnostic planner and hypothesis formulation engine. Formulates symptom statements, reproduction steps, falsifiable hypotheses, and evidence collection roadmaps before allowing code modifications. Use whenever a bug or error is reported. Triggers: $plan-debug, plan-fix:, 'plan debug', 'diagnostic plan'.
metadata:
  category: debugging
---
# Debug Planner ($plan-debug)

**COMMAND:** `$plan-debug` (also triggered automatically by `$debug`)
**ANNOUNCE:** "Activating `debug-planner` — formulating diagnostic plan before investigation."

**The Iron Law:** Never touch code or propose a patch before root cause is isolated. Symptom fixes are failure.

---

## The 4-Step Diagnostic Planning Protocol

### Step 1: Precise Symptom Formulation
State the exact failure observed:
- Exact error message, exception name, or UI layout glitch.
- Expected behavior vs. actual observed behavior.
- Environment context (OS, browser, runtime version, screen resolution).

### Step 2: Isolated Reproduction Step
Define the single, deterministic command or test that proves the failure:
- `npm test tests/feature.spec.ts`
- Minimal reproduction curl command or script.

### Step 3: Candidate Hypotheses
Formulate at least one and at most three falsifiable hypotheses explaining the failure:
- **Hypothesis 1:** [Specific mechanism causing failure under specific condition]
- **Hypothesis 2:** [Alternative mechanism]

### Step 4: Evidence & Investigation Roadmap
List the exact verification steps required to prove or disprove each hypothesis:
- Which files and lines to inspect for stack trace correlation.
- What runtime state or variables must be logged.
- Which regression test must be written.

---

## Output Template (Presented to User)

```markdown
# 🔍 Diagnostic Investigation Plan: [Issue Name]

### 1. Problem Statement
- **Observed:** [Exact error or unexpected behavior]
- **Expected:** [Expected behavior]
- **Reproduction:** `[Exact command to trigger the bug]`

### 2. Candidate Hypotheses
- **H1 (Primary):** [Suspected root cause mechanism]
- **H2 (Secondary):** [Alternative explanation]

### 3. Investigation Steps
- [ ] Step 1: Inspect logs and call stack at `[file:line]`.
- [ ] Step 2: Write failing regression test in `[tests/...]`.
- [ ] Step 3: Prove or disprove H1 before touching production logic.

---
**Shall I proceed with this diagnostic investigation?**
```

