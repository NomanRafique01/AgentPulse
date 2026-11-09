---
name: skill-creator
description: >-
  Skill Brain authoring and benchmarking engine. Scans, validates, scaffolds, and evaluates new skill packages against the open standard (Agent Skills), testing trigger sensitivity and token efficiency. Use when creating, modifying, or testing skills. Triggers: $skill-creator, create-skill:, 'create skill', 'author skill'.
metadata:
  category: architecture
---
# Skill Creator

**ANNOUNCE:** "Reading `skill-creator` — creating or improving a skill."

A skill is a reusable protocol. Good skills are: specific in their trigger, concrete in their steps, and testable in their outcomes.

---

## What Makes a Good Skill

**Trigger description (the YAML `description` field):**
- Specific: states exactly when to use the skill
- Contains trigger phrases the user might say
- Mentions what NOT to use it for (if confusion is likely)
- Under 150 words

**Body:**
- Starts with an ANNOUNCE line (so the user knows which skill is active)
- Has a single, clear core principle in bold
- Steps are numbered and concrete — not "consider X" but "do X"
- Decision tables for routing (when multiple paths exist)
- Does not over-specify — leaves implementation judgment to the agent
- Under 800 lines

---

## Skill Creation Process

### Step 1 — Define the Trigger
Write a test case: what would the user say to trigger this skill?
```
TRIGGER: "When user says [X], this skill should activate."
DOES NOT TRIGGER: "This skill should NOT activate when user says [Y]."
```

### Step 2 — Write the Protocol
For each step in the skill:
- State what to do (imperative)
- State why (brief, only if non-obvious)
- State what done looks like (observable)

### Step 3 — Evaluate the Skill

Test the skill by giving a fresh agent:
1. The skill document
2. A trigger message
3. Evaluate: did it follow the protocol correctly?

Run 3 trigger tests and 3 non-trigger tests. A good skill correctly activates 3/3 and correctly doesn't activate 3/3.

### Step 4 — Improve Based on Results

For each failure:
- Trigger fired when it shouldn't → make the description more specific
- Trigger didn't fire when it should → add more trigger phrases to the description
- Protocol wasn't followed → make the step clearer or more explicit

### Step 5 — Finalize

Write the final SKILL.md with:
```yaml
---
name: [kebab-case-name]
description: >-
  [Precise trigger condition — when to use, when not to use, trigger phrases]
---
```

Store in the appropriate folder under `.agents/skills/[category]/[skill-name]/SKILL.md`

