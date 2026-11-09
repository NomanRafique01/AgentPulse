# Phase 1: Zero-Friction Distribution, Packaging & Silent Startup
**Master Plan:** .agents/memory/plans/main-plan.md
**Status:** VERIFIED

## Selected Skills for This Phase
- `backend-master`: Packaging configuration, CI release workflows, silent installer script architecture.
- `karpathy-coder`: Surgical code changes in `main.js` to silence setup panels and default straight to physical signal lights.

## Input Dependencies
- `package.json`, `main.js`, `agentpulse.js`, `connection.js`.

## Step-by-Step Execution
1. [x] Modified `main.js` so that if no lights are configured, it automatically registers and renders a default signal light window instead of popping up the setup configuration panel.
2. [x] Ensured CLI signal dispatching in `connection.js` and launcher scripts never exits with a non-zero exit code on missing/unreachable server, preventing hook execution failures from blocking agent tools.
3. [x] Created cross-platform one-line installer scripts:
   - `install.ps1` (Windows PowerShell: downloads release asset from GitHub, unpacks to `~/.agentpulse/bin`, updates User PATH silently, zero desktop/menu shortcuts).
   - `install.sh` (macOS / Linux: downloads release asset from GitHub, unpacks to `~/.agentpulse/bin`, updates `.bashrc`/`.zshrc` PATH silently).
4. [x] Created GitHub Actions release workflow `.github/workflows/release.yml` that builds portable standalone binaries on release tag creation.
5. [x] Created local packaging script `scripts/build-dist.js` and tested release package generation (`dist/agentpulse-windows-x64.zip`, 161MB).

## Success & Verification Criteria
- [x] Starting the app launches the floating signal light directly without the setup panel.
- [x] Hook calls (`agentpulse signal PreToolUse`) return exit code 0 even when no GUI is running.
- [x] `install.ps1` and `install.sh` correctly unpack, configure paths, and run `agentpulse help`.
- [x] Release artifact `dist/agentpulse-windows-x64.zip` verified and installed into `~/.agentpulse`.

