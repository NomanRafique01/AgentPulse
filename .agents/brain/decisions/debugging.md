# Debugging Skills — Decision Making Matrix

This document dictates how the agent handles bugs, test failures, crashes, and regressions.

---

## 1. The Debugging Iron Law (Planning First)

**When the user says "debug", NEVER edit code immediately.**
1. Formulate a systematic diagnostic plan using debugging skills.
2. State the observed symptom, reproduction steps, and candidate hypotheses.
3. Ask the user for confirmation: *"Here is my diagnostic plan. Shall I proceed with isolating the root cause?"*
4. Only after finding the root cause with verifiable evidence may a fix be designed.

---

## 2. Specialized Skill Selection Matrix

| Problem Type | Selected Skills | Why This Combination |
|---|---|---|
| **Exception, crash, or clear error** | `root-cause-debugger` | Enforces the 5-step protocol: state symptom, gather evidence, form ONE falsifiable hypothesis, test hypothesis, isolate cause. |
| **Intermittent bug / "works on my machine"** | `bug-diagnoser` | Systematically bisects problem space, instruments minimal logging, and isolates minimal reproduction. |
| **Performance regression / slow API** | `bug-diagnoser` (perf mode) | Measures CPU/memory bottlenecks, queries profilers, identifies O(n²) or N+1 query patterns. |
| **Validating a fix or claiming "done"** | `test-verifier` | Evidence before claims: runs actual test/lint commands and pastes raw terminal output before declaring success. |
| **Reviewing branch / PR for flaws** | `code-reviewer` | Runs parallel reviews: Standards compliance (clean code) vs. Spec compliance (did we build what was asked?). |
| **Triaging bug reports from users** | `issue-triager` | Moves issues through triage state machine (RAW → VERIFYING → CATEGORIZED → READY) and produces agent-ready briefs. |

---

## 3. Diagnostic Plan Template

Before touching code, present this plan to the user:

```markdown
### 🔍 Diagnostic Plan
1. **Symptom:** [Exact error message or unexpected behavior observed]
2. **Reproduction:** [Exact command or steps to reproduce]
3. **Hypothesis:** [What mechanism is suspected of causing this]
4. **Investigation Steps:**
   - [ ] Inspect stack trace / logs at [file:line]
   - [ ] Run isolated regression test
   - [ ] Verify root cause before proposing edits
5. **Next Step:** Confirm to begin investigation.
```

