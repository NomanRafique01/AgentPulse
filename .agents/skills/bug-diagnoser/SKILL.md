---
name: bug-diagnoser
description: >-
  Systematic regression investigator and root-cause isolator. Executes git bisect loops, log tracing, state inspection, and performance bottleneck profiling to diagnose elusive bugs without guesswork. Use for hard-to-reproduce bugs, intermittent race conditions, and performance drops. Triggers: $bug-diagnoser, diagnose:, 'diagnose bug', 'investigate regression'.
metadata:
  category: debugging
---
# Bug Diagnoser

**ANNOUNCE:** "Reading `bug-diagnoser` — running systematic diagnosis for a hard bug."

---

## The Diagnosis Loop

### 1. Establish Certainties

Before investigating, list what you KNOW for certain:
```
KNOWN TRUE:
- [Fact 1 with evidence]
- [Fact 2 with evidence]

KNOWN FALSE:
- [Thing ruled out] — ruled out because [evidence]

UNKNOWN:
- [What we don't know yet]
```

Only things confirmed with evidence go in "known true." Not assumptions, not guesses.

### 2. Bisect the Problem Space

If the bug was introduced recently, use git bisect:
```bash
git bisect start
git bisect bad                    # current commit is bad
git bisect good [last-good-hash]  # last known good state
# Git checks out commits, you test each one:
git bisect good   # or
git bisect bad
# Continue until git finds the introducing commit
git bisect reset  # when done
```

If it's not a regression, bisect the code:
- Does it happen with this input but not that input? → Data-dependent
- Does it happen in this environment but not that one? → Environment-dependent
- Does it happen with this code path but not that one? → Logic-dependent

### 3. Add Temporary Observability

Instrument the code to see what's actually happening:
```
1. Add logging at the entry point: what inputs are arriving
2. Add logging at the failure point: what state exists there
3. Add logging at the transitions: what path did execution take
```

Do not instrument everything at once. Start at the boundary between "working" and "not working."

### 4. Isolate a Minimal Reproduction

Can you reproduce the bug with less code?
1. Remove unrelated features — does the bug persist?
2. Remove unrelated data — what's the minimal input that triggers it?
3. Remove unrelated environment — can you reproduce in a standalone script?

A minimal reproduction is powerful: it points directly at the cause.

### 5. Rule Out Suspects Systematically

For each suspect:
```
SUSPECT: [What might be causing this]
TEST: [How to confirm or rule it out]
RESULT: [RULED OUT / CONFIRMED]
EVIDENCE: [What you observed]
```

Do not keep multiple suspects alive — rule them out one by one.

---

## Performance Regression Diagnosis

When code is unexpectedly slow:

```
1. Measure first — do not guess where the bottleneck is
   - Use a profiler (Chrome DevTools, py-spy, node --prof, etc.)
   - Identify the top 3 slowest operations with actual numbers

2. Find the O(n²) — look for nested loops over large collections

3. Check the database queries — N+1 query problem?
   - Are you querying inside a loop?
   - Are indices missing for the common query patterns?

4. Check the network — are you making sequential requests that could be parallel?

5. Check the rendering — are you causing unnecessary re-renders? (React DevTools Profiler)
```

---

## When to Stop and Report

If after a complete diagnosis loop the cause is still unknown:
```
DIAGNOSIS REPORT:
- Confirmed NOT caused by: [list with evidence]
- Narrowed to: [remaining candidates]
- Minimal reproduction: [steps or "not found yet"]
- Information needed: [what would let us narrow this further]
- Recommendation: [next steps — pair session, escalate, add monitoring]
```

