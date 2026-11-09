---
name: spec-writer
description: >-
  Formal technical specification synthesizer. Converts conversation context, user requirements, and system constraints into precise technical specifications with interface definitions, sequence diagrams, and test acceptance criteria. Use before developing non-trivial features. Triggers: $spec-writer, write-spec:, 'write spec', 'technical specification'.
metadata:
  category: backend
---
# Spec Writer

**ANNOUNCE:** "Reading `spec-writer` — synthesizing the conversation into a formal spec."

A spec is a contract. It says what the system does, not how it does it.

---

## What a Spec Contains

```markdown
# Spec: [Feature Name]

## Problem
[One paragraph: what problem does this solve, for whom, and why now?]

## Scope
**In scope:**
- [Exact thing 1]
- [Exact thing 2]

**Out of scope (explicitly):**
- [Thing we are NOT building]
- [Thing that will be a follow-up]

## Users and Actors
[Who interacts with this feature and what role they play]

## Requirements

### Functional Requirements
1. The system SHALL [observable behavior]
2. The system SHALL [observable behavior]
3. When [condition], the system SHALL [behavior]

### Non-Functional Requirements
- Performance: [specific threshold — "response under 200ms at p95"]
- Security: [specific requirement]
- Accessibility: [WCAG level, specific components]

## UI Behavior (if applicable)
[State machine: what states exist, what transitions between them, what triggers each]

## API Contract (if applicable)
[Input → output, error cases, authentication requirements]

## Data Model (if applicable)
[Types, fields, constraints, relationships]

## Edge Cases and Error States
[List every known edge case and what should happen]

## Open Questions
[Things that need a decision before implementation can start]

## Success Criteria
[How we know the feature is done — specific, testable]
```

---

## Rules for Writing the Spec

- **Behavioral, not implementational.** Say what the system does, not how it's built.
- **One requirement per line.** Use "SHALL" for hard requirements, "SHOULD" for soft.
- **Specific numbers.** Not "fast" — "under 200ms at p95". Not "many" — "up to 1000 items".
- **Explicit out-of-scope.** If it's not in the spec, it will be assumed to be included. State what's excluded.
- **Name every error state.** What happens when the API fails? When data is missing? When permissions are insufficient?

---

## After Writing

1. Show the spec to the user for confirmation
2. Ask: "Are there any requirements I missed or misread?"
3. After confirmation, the spec is ready for `ticket-breaker`

