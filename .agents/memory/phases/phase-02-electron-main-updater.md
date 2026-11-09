# Phase 2: Electron Main Process & IPC Auto-Updater Engine

**Master Plan:** .agents/memory/plans/main-plan.md  
**Status:** PENDING  

## Selected Skills for This Phase
- `backend/backend-master`: Manages IPC event dispatching and safe process isolation.
- `backend/codebase-designer`: Clean modular extraction of auto-updater logic to `electron/autoUpdater.js`.

## Input Dependencies
- `electron/main.js`
- `electron/preload.js`
- `electron-updater` dependency from Phase 1

## Step-by-Step Execution
1. Create `electron/autoUpdater.js`:
   - Initialize `autoUpdater` from `electron-updater`.
   - Set `autoUpdater.autoDownload = false` (explicit user-controlled download).
   - Set `autoUpdater.autoInstallOnAppQuit = true`.
   - Implement event bridges forward to renderer:
     - `update-available`: forwards `{ version, releaseDate, releaseNotes }`
     - `download-progress`: forwards `{ percent, bytesPerSecond, transferred, total }`
     - `update-downloaded`: forwards `{ version }`
     - `error`: forwards `{ message }`
   - Provide safe dev-mode fallbacks / mock flags so testing in development does not throw errors.
2. Integrate into `electron/main.js`:
   - Initialize auto-updater after `createMainWindow()` is ready.
   - Run automatic check 6 seconds after cold start.
   - Register IPC handlers:
     - `updater:check-for-updates`
     - `updater:start-download`
     - `updater:quit-and-install`
     - `updater:get-status`
3. Expose IPC in `electron/preload.js` under `window.electronAPI.updater`.

## Success & Verification Criteria
- [ ] `electron/autoUpdater.js` cleanly exports initialization and IPC registration.
- [ ] `electron/preload.js` exposes type-safe invoke/listen APIs without leaking private IPC channels.
- [ ] App starts without syntax errors or unhandled promise rejections.

