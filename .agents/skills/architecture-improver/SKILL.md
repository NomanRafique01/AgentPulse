---
name: architecture-improver
description: >-
  System architecture debt scanner and refactoring planner. Scans backends for circular dependencies, high coupling, leaky abstractions, and interface debt, producing a visual improvement roadmap without applying unapproved edits. Use when refactoring messy backends or modularizing codebases. Triggers: $architecture-improver, improve-arch:, 'improve architecture', 'clean up architecture'.
metadata:
  category: backend
---
# Architecture Improver

**ANNOUNCE:** "Reading `architecture-improver` — scanning codebase for structural debt."

Read-only. Survey and plan. Another skill or session applies the changes.

---

## Scan Protocol

### Phase 1 — Map the Codebase

```bash
# Get the high-level structure
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.py" | head -100
# Count lines per module
find . -type f | xargs wc -l | sort -rn | head -30
# Find the biggest files (complexity indicator)
find . -type f -name "*.ts" | xargs wc -l | sort -rn | head -20
```

### Phase 2 — Identify Architectural Smells

Look for:
- **God modules:** files over 500 lines, or modules that import from > 10 places
- **Circular dependencies:** A imports B, B imports A
- **Shotgun surgery:** a single change requires touching 5+ files
- **Feature envy:** module A constantly accesses module B's internals
- **Leaking abstractions:** internal data structures exposed in module interfaces
- **Missing abstraction:** duplicated logic across 3+ modules

### Phase 3 — Assess Coupling

```
For each module pair (A, B):
- Does A import from B? (dependency)
- Does B import from A? (reverse dependency)
- If both → circular dependency → CRITICAL
- If A deeply accesses B's internals → tight coupling → HIGH
```

### Phase 4 — Prioritize Improvements

Rank by: **reduction in complexity** × **implementation risk⁻¹**

```
PRIORITY 1 — Circular dependencies (CRITICAL, confusing, hard to test)
PRIORITY 2 — God modules (HIGH, slow to navigate, hard to understand)
PRIORITY 3 — Shallow interfaces (MEDIUM, makes testing hard)
PRIORITY 4 — Missing abstractions (MEDIUM, causes duplication)
PRIORITY 5 — Leaking abstractions (LOW, creates tight coupling)
```

---

## Output Report

```markdown
## Architecture Audit Report: [Project Name]

### Summary
- Modules scanned: N
- Critical issues: N (circular deps, god modules)
- High issues: N
- Medium issues: N

### Critical Issues
| Module | Issue | Impact | Proposed Fix |
|---|---|---|---|

### Improvement Roadmap (Prioritized)

#### Priority 1: [Issue Name]
**Affected files:** [list]
**Problem:** [description]
**Proposed solution:** [specific refactor]
**Risk:** [what could go wrong]
**Effort:** [S / M / L]
**Implementation brief:** [what to do, step by step]

...
```

