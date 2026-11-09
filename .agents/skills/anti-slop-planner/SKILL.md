---
name: anti-slop-planner
description: >-
  Pre-remediation anti-AI SOP audit planner. Scans code, UI markup, SVG icons, and copy to catalog detected AI tells across 6 dimensions with exact file:line citations and presents a structured remediation plan for user confirmation. Use before refactoring AI-generated code. Triggers: $plan-anti-slop, audit-plan:, 'plan anti-slop', 'audit plan'.
metadata:
  category: anti-ai-sop
---
# Anti-Slop Planner ($plan-anti-slop)

**COMMAND:** `$plan-anti-slop`
**ANNOUNCE:** "Activating `anti-slop-planner` — scanning repository and formulating anti-AI remediation plan."

**Core Rule:** Never alter code or rewrite copy blindly. Identify all tells first, map replacements, present the remediation plan, and get user sign-off.

---

## The 6-Dimension Audit Scope

The scan systematically inspects files across six distinct vectors:

1. **Text Tone & Prose:** Conversational throat-clearing, generic praise, passive chains, AI transition filler.
2. **UI Widgets & Badges:** Pill badges, tracked uppercase eyebrow tags, middle-dot strings (`A · B · C`).
3. **Typography & Scale:** Single colored words in headlines, unjustified monospace tags, poor hierarchy.
4. **Palette & Surfaces:** Anthropic cream/terracotta cliches, dark-mode neon green, gradient blur blobs, floating card shadows.
5. **Layout & Composition:** Monotonous 3-card icon rows, centered text blocks, excessive empty voids.
6. **Vector Geometry:** SVG bezier curve bloat, un-snapped coordinates, mismatched stroke widths.

---

## Remediation Plan Output Template

When `$plan-anti-slop` completes its preliminary audit, output this plan:

```markdown
# 🛡️ Anti-AI Remediation Plan: [Target File / Module]

### 1. Summary of Findings
- Total AI Tells Detected: [N]
- Critical Violations (FAIL): [N]
- Stylistic Warnings (WARN): [N]

### 2. Itemized Citations & Proposed Fixes

#### A. UI & Layout Tells
- **Location:** `src/components/Hero.tsx:24`
  - **Tell:** Pill badge `<div className="rounded-full bg-blue-50 px-3 py-1">✨ New Release</div>`
  - **Proposed Fix:** Remove pill capsule; integrate release info directly into the `h1` headline.
- **Location:** `src/components/Features.tsx:58`
  - **Tell:** 3 identical rounded cards with centered Zap/Shield/Rocket icons.
  - **Proposed Fix:** Rebuild as an asymmetric 2-column technical spec table with real metrics.

#### B. Vector & Icon Tells
- **Location:** `src/components/icons/Server.tsx:4`
  - **Tell:** 64-node bezier path with floating decimals `d="M12.435 88.234..."`
  - **Proposed Fix:** Re-craft on strict 24×24 grid with 1.5px uniform stroke using `svg-icon-craftsman`.

#### C. Prose & Text Tells
- **Location:** `README.md:12`
  - **Tell:** "Furthermore, it is important to remember that this pivotal framework harnesses..."
  - **Proposed Fix:** "This framework handles multi-tenant transaction routing."

---
### 3. Execution Plan
- [ ] Phase 1: Clean UI badges and layout structure (`ui-tells-eliminator`).
- [ ] Phase 2: Snap SVG icon geometry to 24×24 (`svg-icon-craftsman`).
- [ ] Phase 3: Purge verbal padding and calibrate prose (`text-tone-enforcer`).

**Shall I proceed with applying these surgical fixes?**
```

