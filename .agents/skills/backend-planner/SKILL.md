---
name: backend-planner
description: >-
  Pre-implementation backend architecture planner. Formulates domain models, API payloads, database schemas, tracer-bullet tickets, and TDD test suites before touching code, presenting the blueprint for user confirmation. Use before building APIs or backend services. Triggers: $plan-backend, plan-api:, 'plan backend', 'plan api'.
metadata:
  category: backend
---
# Backend Planner ($plan-backend)

**COMMAND:** `$plan-backend`
**ANNOUNCE:** "Activating `backend-planner` — formulating backend architecture and data contract plan."

**Core Rule:** Spec before code. Test before implementation. Responsive contracts by default.

---

## The 5-Step Backend Planning Protocol

### Step 1: Domain Glossary & Entity Modeling (`domain-modeler`)
Define the core business entities, relationships, and naming conventions in unambiguous terms:
- Entity names, types, primary keys, and foreign key constraints.
- Naming audit: eliminate synonyms and homonyms across the schema.

### Step 2: API Contract & Responsive Payload Design (`responsive-contract-enforcer`)
Define the exact request and response shapes:
- Endpoint URLs, HTTP methods, headers, and authentication requirements.
- Zero fixed pixel dimensions in UI payloads.
- Explicit image aspect ratios and multi-resolution srcset arrays to prevent layout shifts.
- Pagination schema: cursor-based for mobile feeds, indexed for desktop tables.

### Step 3: Module Seams & Encapsulation (`codebase-designer`)
- Ousterhout Deep Modules: simple, clean public interfaces hiding internal complexity.
- Define where seams go (database access, third-party network calls, clock/time).

### Step 4: Tracer-Bullet Ticket Graph (`ticket-breaker`)
Break the implementation into minimal dependency-ordered tickets:
- TICKET-1: Data schema & migrations.
- TICKET-2: Core domain logic & unit tests.
- TICKET-3: API endpoints & integration tests.
- TICKET-4: Error handling, edge cases, and rate limiting.

### Step 5: TDD Verification Plan (`tdd-implementer`)
List the exact failing tests to write first for each ticket before writing production logic.

---

## Output Template (Presented to User)

```markdown
# ⚙️ Backend Architecture Plan: [Feature Name]

### 1. Domain Entities & Database Schema
[Entity relationships, field types, constraints]

### 2. API Contract & Responsive Metadata
[Endpoint definitions with aspect ratio and responsive layout hints]

### 3. Tracer-Bullet Tickets
- [ ] TICKET-1: [Schema & Migrations] (Blocks: TICKET-2)
- [ ] TICKET-2: [Core Domain Service] (Blocks: TICKET-3)
- [ ] TICKET-3: [API Route & Middleware]

### 4. TDD Test Plan
- Unit tests: [test cases]
- Integration tests: [contract verification]

---
**Shall I proceed with implementing this backend architecture?**
```

