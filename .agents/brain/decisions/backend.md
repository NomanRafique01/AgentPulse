# Backend Skills — Decision Making Matrix

This document dictates how the agent selects, combines, and sequences backend skills.

---

## 1. Mandatory Baseline (Always Active in Backend)

Every backend implementation task **must** honor:
1. `karpathy-coder` (minimal blast radius, zero speculative code, no unrequested abstractions).
2. `tdd-implementer` (write test first, watch it fail, write minimal code to pass).
3. `responsive-contract-enforcer` (all endpoints serving UI must declare responsive aspect ratios, multi-res srcsets, and zero fixed pixel widths).

---

## 2. Specialized Skill Selection Matrix

| User Goal | Selected Skills | Why This Combination |
|---|---|---|
| **Plan backend architecture before coding** | `backend-planner` (`$plan-backend`) | Defines domain models, responsive API contracts, tracer-bullet ticket graph, and TDD plan. |
| **Surgical bugfix or minimal tweak** | `karpathy-coder` + `tdd-implementer` | Touches only failing lines, adds a targeted regression test, leaves surrounding code pristine. |
| **Build new feature from spec** | `spec-implementer` | Follows ticket dependency graph in strict order, committing after each ticket. |
| **Design deep module / API boundary** | `codebase-designer` + `domain-modeler` | Maximizes information hiding (Ousterhout deep modules) and aligns naming to GLOSSARY.md. |
| **Enforce responsive UI API contract** | `responsive-contract-enforcer` | Validates that payloads contain responsive layout hints, aspect ratios, and zero hardcoded pixel widths. |
| **Modern Swift 6 / Apple backend** | `swift-writer` | Strict concurrency (@MainActor, actors, Sendable), value-type modeling, Swift Testing. |
| **Build MCP tool server** | `mcp-builder` | FastMCP or TypeScript MCP SDK; clean tool schemas, error handling, deterministic outputs. |
| **Write pull request description** | `pr-writer` | Generates summary, testing steps, before/after evidence, and reviewer checklist. |
