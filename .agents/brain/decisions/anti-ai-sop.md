# Anti-AI SOP Skills — Decision Making Matrix

This document dictates how the agent monitors, purges, and audits AI tells across prose, visual design, vectors, and code.

---

## 1. Zero Tolerance Mandate

Before ANY response, code snippet, SVG, or UI is returned to the user, run the anti-slop check.
If an output contains synthetic tells, rewrite it before sending.

---

## 2. Specialized Skill Selection Matrix

| Content Being Produced | Selected Skills | Enforced Restrictions |
|---|---|---|
| **Plan an Anti-AI audit before fixing** | `anti-slop-planner` (`$plan-anti-slop`) | Catalogs all AI tells across 6 dimensions with file:line citations; drafts surgical remediation plan. |
| **Formal quality gate audit of repo/PR** | `agents/anti-ai-sop-agent` (`$anti-slop`) | Produces formal 6-category scorecard (PASS / WARN / FAIL) with concrete citations and optional `--fix` mode. |
| **Text, explanations, answers, PRs** | `text-tone-enforcer` + `anti-slop-enforcer` | No sycophantic openers, no filler transitions ("Furthermore"), no bullet-point abuse; direct senior engineer cadence. |
| **Frontend UI (CSS, Tailwind, JSX, HTML)** | `ui-tells-eliminator` + `anti-slop-enforcer` | No cream/terracotta Anthropic clone, no pill badges above headlines, no tracked uppercase eyebrows, no 3-card centered icon grids. |
| **SVG Icons and Vector Graphics** | `svg-icon-craftsman` (`$icon`) | No wandering bezier curves, standard 24×24 viewBox, uniform 1.5px/2.0px stroke, integral pixel snapping. |
