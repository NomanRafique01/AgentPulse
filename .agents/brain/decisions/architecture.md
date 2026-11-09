# Architecture Skills — Decision Making Matrix

This document dictates how the agent handles system design, workspace isolation, sub-agent dispatch, and large project planning.

---

## 1. Mandatory Baseline

Before structural or multi-module changes:
- Evaluate workspace isolation: if a feature branch or worktree is appropriate, activate `git-isolator`.
- Keep the main branch clean and unpolluted with in-progress experiments.

---

## 2. Specialized Skill Selection Matrix

| Architectural Goal | Selected Skills | Why This Combination |
|---|---|---|
| **Isolate workspace for feature work** | `git-isolator` | Creates native worktree (`git worktree add -b feature/...`), verifies isolation, keeps main tree clean. |
| **Dispatch parallel task execution** | `subagent-executor` | Dispatches fresh sub-agents with isolated prompts per task; reviews each task output before merging. |
| **Map huge project spanning sessions** | `large-task-mapper` | Deconstructs big goals into decision tickets (blocking forks in the road) before implementation tickets. |
| **Research API / library from sources** | `research-agent` | Restricts investigation strictly to primary sources (official docs, repo source); cites URLs and file lines. |
| **Human credential / dashboard setup** | `setup-wizard` | Generates idempotent, color-coded interactive bash wizard for human-only secrets, dashboards, or DNS steps. |
| **Author or optimize an agent skill** | `skill-creator` | Benchmarks trigger descriptions, runs eval matrices, refines procedural instructions. |

---

## 3. Sub-Agent vs. Single Pass Decision

- **Use `subagent-executor` when:**
  - Tasks are embarrassingly parallel (e.g. 5 independent UI components or 4 separate API endpoints).
  - Context window would be overwhelmed by reviewing all implementations at once.
- **Use single pass when:**
  - Tasks are tightly coupled sequentially (e.g. database schema change followed immediately by dependent query update).

