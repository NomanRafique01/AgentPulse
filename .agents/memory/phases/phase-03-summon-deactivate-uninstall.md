# Phase 3: Signal Summoning, Clean Deactivation & Uninstaller
**Master Plan:** .agents/memory/plans/main-plan.md
**Status:** PENDING

## Selected Skills for This Phase
- `backend-master`: CLI process lifecycle, signal toggling, and clean filesystem purging.
- `karpathy-coder`: Clean, minimal-diff command implementations.

## Input Dependencies
- Phase 2 project initialization files.

## Step-by-Step Execution
1. Implement `agentpulse start`:
   - Reads the local project `.agentpulse` config.
   - Summons or switches the light window to this project's signal channel without modifying hooks.
2. Implement `agentpulse off` / `agentpulse deactivate`:
   - Disables or removes `agentpulse` hook entries from `.agents/hooks.json`.
   - Sends a deactivation signal to the light window.
3. Implement `agentpulse uninstall`:
   - Kills any running instances.
   - Cleans the PATH environment variable in User environment (Windows registry or shell profile).
   - Removes `~/.agentpulse` directory completely.

## Success & Verification Criteria
- [ ] `agentpulse start` activates the signal for the local project.
- [ ] `agentpulse off` cleanly strips hooks without breaking other hooks in `hooks.json`.
- [ ] `agentpulse uninstall` completely removes the app and PATH references.

