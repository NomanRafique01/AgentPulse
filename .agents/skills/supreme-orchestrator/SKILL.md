---
name: supreme-orchestrator
description: >-
  The Supreme Master Router for the entire Skill Brain. Evaluates user intent across all domains, enforces the confirmation policy (always/multi-skill/never), guarantees the frontend-baseline bundle on UI tasks, gates debugging with diagnostic plans, and routes $plan to domain planners. Triggers: $orchestrate, brain:, 'supreme orchestrator', 'orchestrate'.
metadata:
  category: orchestrators
---
# Supreme Orchestrator — Apex Master Skill

**ANNOUNCE:** "Reading `supreme-orchestrator` — evaluating intent, category routing, and skill selection."

**Supreme Mandate:** You have an arsenal of precision skills across 6 categories. Never execute blindly. Always consult the category `DECISION.md`, present the proposed skill combination, and ask before executing.

---

## The 6 Core Iron Laws

### Law 1 — Ask Before Acting & Confirmation Policy
Skill Brain reads `.agents/brain/config.json` for the confirmation policy (`"confirm": "always" | "multi-skill" | "never"`, default `"always"`):
- `"always"`: Always present proposed skills and ask confirmation before executing:
  > *"I propose using `[skill-a]` + `[skill-b]` via `.agents/brain/decisions/[category].md`. Shall I proceed?"*
- `"multi-skill"`: Ask confirmation only when coordinating 2 or more skills; single-skill tasks proceed directly.
- `"never"`: Autonomous execution without interactive confirmation prompts.

### Law 2 — Categorical Dispatch
When the user explicitly names a category or command (e.g. `$frontend`, `$backend`, `$debug`, `$memory`):
1. Immediately read `.agents/brain/decisions/[category].md`.
2. Select the minimal, highest-impact sub-skills that match the request.
3. Announce the selection, confirm with the user, and execute with zero token waste.

### Law 3 — Mandatory Frontend Baseline Bundle
Whenever working on ANY frontend component, page, or visual artifact:
- You **MUST** load `frontend-baseline` (≤ 4 KB), which condenses Taste Kill v2 (`design-taste-frontend`), Anti-AI SOP (`ui-tells-eliminator`), and Dynamic Responsive Sizing (`phone-layout-master` & `desktop-ui-architect`).
- Under Rule 7, `frontend-baseline` counts as the 1 baseline bundle; you may load up to **3 specialized task skills** alongside it.

### Law 4 — The Debugging Planning Gate
When the user says *"debug"*, *"fix bug"*, or invokes `$debug`:
1. **DO NOT attempt code edits immediately.**
2. Activate `debug-planner` (`$plan-debug`).
3. Formulate a diagnostic plan (reproduction steps, hypothesis, evidence needed).
4. Present the plan to the user and ask: *"Here is the diagnostic plan. Proceed with investigation?"*

### Law 5 — Pre-Implementation Planning Commands
Use specialized planning skills to formulate blueprints before touching code:
- `$plan-frontend`: Formulate UI design & dual-viewport responsive blueprint (`frontend-planner`).
- `$plan-anti-slop`: Formulate anti-AI tell audit & surgical replacement plan (`anti-slop-planner`).
- `$plan-backend`: Formulate domain schema, responsive API contract, and TDD plan (`backend-planner`).
- `$plan-debug`: Formulate diagnostic problem statement and hypothesis tree (`debug-planner`).

### Law 6 — User-Controlled Virtual Memory & $plan Routing
Virtual memory (`.agents/memory/plans/` and `.agents/memory/phases/`) is **strictly user-controlled**.
- **`$plan` Ambiguity Resolved:** `$plan` produces an in-chat plan with **zero disk writes**, routing directly to the matching domain planner:
  - Frontend tasks → `frontend-planner` (`$plan-frontend`)
  - Backend/API tasks → `backend-planner` (`$plan-backend`)
  - Debugging tasks → `debug-planner` (`$plan-debug`)
  - General implementation → `implementation-planner` (`$plan-impl`)
- **Disk Memory Requires `$memory`:** Only explicit commands like `$memory` or *"add to memory"* invoke `memory-master` and write to `.agents/memory/`.
- Casual chats and single-turn tasks never touch disk memory.

### Law 7 — Mandatory Atomic Git Commits & Branch Hygiene
When committing code, managing branches, or finishing memory phases:
- **Inspect Before Staging:** Run `git status --porcelain` and `git diff --stat`. Never blind-stage with `git add .`.
- **Atomic Splitting:** Split multi-domain changes into 2 or more sequential commits (Core Logic, Tests, UI, Memory).
- **Phase Commit Hook:** Every memory phase that transitions to `FINISHED` must trigger an atomic phase commit via `git-phase-committer` before advancing.
- **Conventional Commits:** Enforce `<type>(<scope>): <summary>` with verification evidence in footer.

### Law 8 — Test-On-Demand Protocol (Never Test Unless Explicitly Asked)
Unless the user explicitly invokes `$test`, `$verify`, or directly asks you to test the logic, **DO NOT run tests, write unit tests, or test business logic**. Implement cleanly and surgically without unsolicited test overhead.

---

## Global Routing Decision Table

| User Command | Primary Route | Mandatory Baselines | Action Before Code |
|---|---|---|---|
| `$frontend` | `frontend-master` | Taste Kill + Anti-SOP + Dynamic UI Engine | Propose skills & layout direction → confirm |
| `$plan-frontend` | `frontend-planner` | Subject inventory + Phone + Desktop specs | Present complete UI design plan → confirm |
| `$backend` | `backend-master` | Karpathy Simplicity + Responsive Contract | Clarify spec & implement surgically |
| `$plan-backend` | `backend-planner` | Domain model + API contracts + Tracer tickets | Present backend architecture plan → confirm |
| `$debug` / `$plan-debug` | `debug-planner` | Root-cause-first discipline | Present diagnostic plan → confirm |
| `$plan-anti-slop` | `anti-slop-planner` | 6-dimension code scanner | Present itemized tells & fixes → confirm |
| `$architect` | `architecture-master` | Git Worktrees + Subagent Executor | Present isolation/decomposition plan → confirm |
| `$plan` | Domain Planner (`frontend-planner`, `backend-planner`, `debug-planner`, `implementation-planner`) | In-chat blueprint | Produce plan for task with zero disk writes |
| `$memory` | `memory-master` | Phase Planner + Live Chat Dashboard | Create `main-plan.md` & `phases/` upon explicit user consent |
| `$git` | `git-master` | Atomic Splitting + Conventional Commits + Branch Hygiene | Inspect status & branch → propose commits → confirm |
| `$commit` | `git-atomic-committer` | 2+ multi-commit splitting + Conventional format | Inspect diff → split by domain → stage & commit |
| `$branch` | `git-branch-manager` | Kebab taxonomy + clean tree check | Verify working tree → branch or rebase sync |
| `$phase-commit` | `git-phase-committer` | Verification evidence in commit body | Verify phase checkboxes → 3-step atomic commits |
| `$anti-slop` | `anti-ai-sop-agent` | Standalone Quality Gate Auditor | Run 6-category PASS / WARN / FAIL scorecard |
| `$test`, `$verify` | `test-verifier` | Test-on-demand evidence | Run tests ONLY when explicitly asked by user |
