# Phase 2: Project Signal Assignment & Hook Auto-Wiring (`agentpulse init`)
**Master Plan:** .agents/memory/plans/main-plan.md
**Status:** VERIFIED

## Selected Skills for This Phase
- `backend-master`: CLI commands and hooks generator architecture.
- `tdd-implementer`: Test suite for config initialization and hook injection.

## Input Dependencies
- Phase 1 installer and resilient CLI execution.

## Step-by-Step Execution
1. [x] Implemented `agentpulse init` in `agentpulse.js`:
   - Inspects current working directory.
   - Generates project-specific `.agentpulse` config containing unique `projectId`, `slug`, `secret`, and `name`.
   - Updates `.agents/hooks.json` automatically with `agentpulse signal <Event>` hooks.
2. [x] Automatically summons the signal light in the background on `init`.

## Success & Verification Criteria
- [x] Running `agentpulse init` in any directory generates valid `.agentpulse` and `.agents/hooks.json`.
- [x] Tested live and verified hooks wire up cleanly with zero friction.

