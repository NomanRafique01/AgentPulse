# Phase 3: Signal Summoning, Clean Deactivation & Uninstaller
**Master Plan:** .agents/memory/plans/main-plan.md
**Status:** VERIFIED

## Selected Skills for This Phase
- `backend-master`: CLI process lifecycle, signal toggling, and clean filesystem purging.
- `karpathy-coder`: Clean, minimal-diff command implementations.

## Input Dependencies
- Phase 2 project initialization files.

## Step-by-Step Execution
1. [x] Implemented `agentpulse start`:
   - Reads the local project `.agentpulse` config.
   - Summons or switches the light window to this project's signal channel without modifying hooks.
2. [x] Implemented `agentpulse off` / `agentpulse deactivate`:
   - Disables or removes `agentpulse` hook entries from `.agents/hooks.json`.
   - Sends a deactivation signal to the light window.
3. [x] Implemented `agentpulse uninstall`:
   - Unlinks hooks cleanly and provides guided global removal command.

## Success & Verification Criteria
- [x] `agentpulse start` activates the signal for the local project.
- [x] `agentpulse off` cleanly strips hooks without breaking other hooks in `hooks.json`.
- [x] Tested live: `.agents/hooks.json` cleanly removed on `off` and recreated on `init`.

