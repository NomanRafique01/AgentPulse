# Phase 2: Project Signal Assignment & Hook Auto-Wiring (`agentpulse init`)
**Master Plan:** .agents/memory/plans/main-plan.md
**Status:** PENDING

## Selected Skills for This Phase
- `backend-master`: CLI commands and hooks generator architecture.
- `tdd-implementer`: Test suite for config initialization and hook injection.

## Input Dependencies
- Phase 1 installer and resilient CLI execution.

## Step-by-Step Execution
1. Implement `agentpulse init` in `agentpulse.js`:
   - Inspect current working directory.
   - Generate project-specific `.agentpulse` config containing unique `projectId`, `slug`, `secret`, and `name`.
   - Update `.agents/hooks.json` automatically with `agentpulse signal <Event> --project <projectId>` hooks.
2. If the AgentPulse background daemon or window is not running, optionally spawn/summon it in the background.

## Success & Verification Criteria
- [ ] Running `agentpulse init` in any directory generates valid `.agentpulse` and `.agents/hooks.json`.
- [ ] Hooks point to the persistent signal route for that specific project.

