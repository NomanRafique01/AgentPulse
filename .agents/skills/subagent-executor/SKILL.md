---
name: subagent-executor
description: >-
  Isolated sub-agent dispatcher and task coordinator. Dispatches fresh, isolated sub-agents with dedicated prompts for independent tasks, performing rigorous post-task reviews without passing bloated session context. Use when executing independent multi-task plans. Triggers: $subagent-executor, dispatch-subagents:, 'subagent executor', 'dispatch subagents'.
metadata:
  category: architecture
---
# Subagent Executor

**ANNOUNCE:** "Reading `subagent-executor` — dispatching sub-agents for parallel task execution."

**Fresh sub-agent per task. Task review after each. Broad final review at end.**

---

## Why Sub-Agents

You delegate tasks to agents with isolated context. By precisely crafting their instructions, you ensure they stay focused. They never inherit your session's context — you construct exactly what they need. This preserves your own context for coordination.

---

## The Execution Protocol

### Step 1 — Break Tasks into Independent Units

Identify which tasks from the plan are independent (can run in parallel) vs. sequential (one depends on another).

Draw the dependency graph before dispatching anything.

### Step 2 — Craft Each Sub-Agent Brief

For each task, write a complete brief that a cold agent can execute:
```
TASK: [specific deliverable]
CONTEXT: [everything the agent needs to know — do not assume they read the conversation]
FILES: [exact paths to read and modify]
SPEC: [the acceptance criteria — what done looks like]
CONSTRAINTS: [what not to do, what to avoid]
COMMIT MESSAGE: [exactly how to commit when done]
REPORT FORMAT: [how to report back — what to include in the reply]
```

Do not say "see the conversation above" — sub-agents do not have it.

### Step 3 — Dispatch and Track

For parallel tasks, dispatch them simultaneously. Track:
```
TASK-1: [dispatched / complete / failed]
TASK-2: [dispatched / complete / failed]
TASK-3: [dispatched / complete / failed]
```

### Step 4 — Review Each Task on Return

When a sub-agent returns, review against its spec:
- Did it meet all acceptance criteria?
- Did it introduce any new issues?
- Does its output integrate correctly with other tasks?

If it fails review → redispatch with specific feedback on what to fix.

### Step 5 — Broad Final Review

After all tasks complete:
1. Run `code-reviewer` on the full branch
2. Run `test-verifier` — all tests must pass
3. Check for integration issues between tasks
4. Write a summary of what was built

---

## Narration Rule

Between tool calls, narrate at most one short line. The ledger and tool results carry the record. Do not write paragraphs of narration.

