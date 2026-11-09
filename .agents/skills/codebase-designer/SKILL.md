---
name: codebase-designer
description: >-
  Deep module designer and interface architect. Designs deep software interfaces, defines clean module seams, eliminates shallow wrapper classes, and optimizes information hiding across backend layers. Use when designing new modules, restructuring libraries, or reducing API surface area. Triggers: $codebase-designer, design-module:, 'design codebase', 'deep module'.
metadata:
  category: backend
---
# Codebase Designer

**ANNOUNCE:** "Reading `codebase-designer` — applying deep module principles to this design."

**Deep modules:** simple interface, powerful implementation. The interface is the tip of the iceberg.

---

## Deep Module Principles

**John Ousterhout's A Philosophy of Software Design, distilled:**

1. **Modules should be deep.** A module's value = (implementation complexity it hides) ÷ (interface complexity it exposes). Maximize that ratio.

2. **Simple interfaces over simple implementations.** If a module has a complex interface that simplifies its implementation, that's a bad trade. If a module has a complex implementation that enables a simple interface, that's a good trade.

3. **General-purpose interfaces over special-purpose.** A function that does one specific thing for one caller is worse than a function that does one general thing for many callers.

4. **Information hiding.** Every piece of information that a caller doesn't need to know is hidden. Data structures, algorithms, timeouts, retry logic, caching — these are implementation details, not interface details.

---

## Finding Deepening Opportunities

Read the codebase and look for:

**Shallow modules (bad):**
- Functions with more parameters than lines of code
- Classes that are just property bags with no behavior
- Modules that expose their internal data structures
- Functions where the interface complexity matches the implementation complexity

**Deepening opportunities:**
- A caller that always passes the same three parameters → make those defaults
- A pattern repeated across 3+ callers → extract to a shared module
- A complex operation exposed as multiple steps → compose into one higher-level function
- A data structure exposed in the interface → wrap it in a well-named type

---

## Testability Audit

For each module, ask:
- Can I test this without setting up the whole system? (No → too many dependencies)
- Can I predict its output from its input alone? (No → it has hidden state or side effects)
- Can I test one behavior at a time? (No → it does too many things)
- Can I give it a bad input and get a clear error? (No → error handling is missing)

For each "No" — that's a design problem. Propose a specific fix.

---

## The Seam Decision

A seam is where you cut the code to create a testable boundary.

Put seams at:
- I/O boundaries (database, network, file system, time)
- External service calls
- Complex business logic that changes independently

Do NOT put seams at:
- Internal implementation details
- Trivial functions
- Places where the seam adds more complexity than it removes

---

## Output Format

For each module reviewed:
```
MODULE: [path/to/file.ts]
DEPTH SCORE: [Deep / Acceptable / Shallow]
ISSUE: [What makes it shallow, if anything]
SEAMS NEEDED: [Where to cut for testability]
DEEPENING OPPORTUNITY: [Specific refactor proposal]
INTERFACE CHANGE: [before → after]
```

