---
name: domain-modeler
description: >-
  Domain-driven design modeler and architectural glossary builder. Models ubiquitous languages, entities, value objects, domain invariants, and ADRs (Architecture Decision Records) into formal schemas and GLOSSARY.md. Use when designing business domain models or core domain entities. Triggers: $domain-modeler, model-domain:, 'domain model', 'glossary builder'.
metadata:
  category: backend
---
# Domain Modeler

**ANNOUNCE:** "Reading `domain-modeler` — building the shared vocabulary for this project."

---

## Why This Matters

Code that uses inconsistent names is code that requires mental translation on every read. A good domain model means:
- The code reads like a conversation about the problem, not about the solution
- New team members can navigate without a guide
- Automated agents can reason about the codebase accurately

---

## The Glossary

Write `GLOSSARY.md` at the project root. Format:

```markdown
# Domain Glossary

## [Term]
**Definition:** [What this is in one clear sentence]
**Used in code as:** `[ClassName]`, `[function_name()]`, `[table_name]`
**Not to be confused with:** [similar term that means something different]
**Example:** [concrete example in context]

---

## [Term 2]
...
```

Rules:
- Every domain concept in the codebase has an entry
- Each entry has one definition — if you can't write one sentence, the concept is unclear
- Ambiguous synonyms are resolved: pick one term, note the others as deprecated
- The glossary is updated whenever new domain concepts appear

---

## Architectural Decision Records (ADRs)

When a significant architectural decision is made, record it:

```markdown
# ADR-[N]: [Decision Title]
**Date:** [YYYY-MM-DD]
**Status:** [Proposed / Accepted / Superseded by ADR-N]

## Context
[What situation required a decision]

## Decision
[What was decided, stated clearly]

## Consequences
**Positive:**
- [What this enables]

**Negative:**
- [What this forecloses or makes harder]

## Alternatives Considered
- [Alternative A]: [Why it was rejected]
- [Alternative B]: [Why it was rejected]
```

Store ADRs in `.agents/decisions/ADR-NNN.md`

---

## Domain Model Audit

When joining an existing codebase, run this audit:
1. List every noun used in the codebase (class names, types, table names)
2. Identify synonyms (same concept, different names) → pick one, migrate
3. Identify homonyms (same name, different concepts) → rename one
4. Identify missing terms (concepts described in code but not named) → name them
5. Write the glossary

