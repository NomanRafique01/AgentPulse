# Master Plan: ToolCEO Auto-Update System via electron-updater & GitHub Releases

**Date:** 2026-11-03  
**Status:** IN PROGRESS (Phase 1 of 4)  
**Total Phases:** 4  
**Target Branch:** `update`  

## Goal & Architecture
Implement an enterprise-grade auto-update mechanism for ToolCEO using `electron-updater` backed by GitHub Releases (`NomanRafique01/ToolCEO`).
On application launch, the app polls GitHub Releases for newer semantic versions. When a newer release is published:
1. Users receive an application notification banner (`notificationBanner.js`).
2. An **Update Available** item with a pulsing badge dynamically appears in the sidebar (`System` section).
3. Clicking "Download" opens the existing draggable, docked progress window (reusing the `#mod-dl-panel` architecture from `moduleDownload.js`).
4. **Mid-Screen Restart Modal & Persistent Install State:**
   - Once downloaded, a prominent mid-screen dialog banner appears prompting: *"Update Ready to Install — Restart ToolCEO now to apply vX.Y.Z"*.
   - **Dismissal Handling:** If the user clicks close (`×`) or *"Later"*, the downloaded update remains intact on disk.
   - The state is locked to `'ready_to_install'`. The sidebar item reflects *"Restart to Update"*.
   - Whenever the user returns to the sidebar Update item, the mid-screen restart modal re-opens immediately.
   - On natural app exit, `autoInstallOnAppQuit` guarantees silent installation.
5. A turnkey GitHub Actions release workflow is established so pushing git tags (e.g. `v2.1.0`) automatically builds `ToolCEO Setup <version>.exe` and publishes `latest.yml` to GitHub Releases.

## Phase Breakdown
- [ ] **Phase 1: Dependencies, Build Configuration & GitHub CI/CD**
  - Skills: `backend-master`, `karpathy-coder`
  - Targets: `package.json`, `.github/workflows/release.yml`
- [ ] **Phase 2: Electron Main Process & IPC Auto-Updater Engine**
  - Skills: `backend-master`, `codebase-designer`
  - Targets: `electron/autoUpdater.js`, `electron/main.js`, `electron/preload.js`
- [ ] **Phase 3: Sidebar Indicator, Startup Notification & Navigation**
  - Skills: `frontend-baseline`, `design-engineering`
  - Targets: `frontend/index.html`, `frontend/scripts/navigation.js`, `frontend/styles/sidebar.css`, `frontend/scripts/notificationStore.js`
- [ ] **Phase 4: Download Window, Mid-Screen Restart Modal & Persistent Install Lifecycle**
  - Skills: `frontend-baseline`, `design-engineering`
  - Targets: `frontend/scripts/appUpdateDownload.js`, `frontend/styles/module-download.css`, integration with `electronAPI`

## Global Verification Standard
1. `npm list electron-updater` validates clean package installation.
2. `package.json` contains valid `build.publish` with `github` provider, `NomanRafique01` owner, and `ToolCEO` repo.
3. IPC endpoints (`updater:check-for-updates`, `updater:start-download`, `updater:quit-and-install`, `updater:get-state`) and renderer listeners function cleanly.
4. `.github/workflows/release.yml` passes YAML linting and builds NSIS target with `latest.yml` publishing.
5. In development/staging, update simulation mock triggers the sidebar entry, notification banner, draggable download panel with progress bars, mid-screen modal, dismissal persistence, and install buttons seamlessly.
