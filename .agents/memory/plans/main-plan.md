# Master Plan: Universal Zero-Friction AgentPulse Signal Engine
**Date:** 2026-11-09
**Status:** FINISHED (4 of 4 Phases Completed)
**Total Phases:** 4

## Goal & Architecture
Build a streamlined, user-friendly, cross-platform distribution and runtime architecture for AgentPulse:
1. **npm & GitHub Distribution**: Ultra-lightweight (34 kB) package on npm (`agentpulse`), plus standalone GitHub release scripts.
2. **Direct Signal Display**: Suppress configuration/setup panels entirely on launch; start directly with the sleek floating physical status light.
3. **Project Signal Lifecycle**:
   - `agentpulse init`: assigns a unique persistent signal to the current project and wires `.agents/hooks.json`.
   - `agentpulse start`: summons the project signal instantly with zero re-hooking.
   - `agentpulse off`: cleanly deactivates the signal and unhooks `.agents/hooks.json`.
   - `agentpulse uninstall`: completely uninstalls the binary and cleans PATH.
4. **Multi-Project Isolation**: Separate projects maintain distinct signal identities without port or hook collisions.

## Phase Breakdown
- [x] **Phase 1: Zero-Friction Distribution, Packaging & Silent Startup** — Skills: `backend-master`, `karpathy-coder`
- [x] **Phase 2: Project Signal Assignment & Hook Auto-Wiring (`agentpulse init`)** — Skills: `backend-master`, `tdd-implementer`
- [x] **Phase 3: Signal Summoning, Clean Deactivation & Uninstaller (`start`, `off`, `uninstall`)** — Skills: `backend-master`, `karpathy-coder`
- [x] **Phase 4: Multi-Project Conflict Isolation & Cross-Platform Verification** — Skills: `backend-master`, `test-verifier`

## Global Verification Standard
- All CLI commands (`init`, `start`, `off`, `uninstall`) return exit code 0 and never fail silently or break agent tools.
- Silent launch opens only the physical status light, never the setup window.
- Release packages and installation scripts (`install.ps1`, `install.sh`) can unpack and run cleanly without manual dependencies or administrator privileges.
