# Phase 4: Download Window, Mid-Screen Restart Modal & Persistent Install Lifecycle

**Master Plan:** .agents/memory/plans/main-plan.md  
**Status:** PENDING  

## Selected Skills for This Phase
- `frontend/frontend-baseline`: Reuses the module download floating panel design system (`#mod-dl-panel`) and modal glassmorphism.
- `frontend/design-engineering`: Smooth progress transitions, speed/size metrics, and tactile "Restart & Install" mid-screen modal.

## Input Dependencies
- `frontend/scripts/moduleDownload.js` & `frontend/styles/module-download.css`
- `window.electronAPI.updater` IPC handlers (Phase 2)

## Step-by-Step Execution
1. Create `frontend/scripts/appUpdateDownload.js`:
   - Reuses floating draggable dock window (`#app-update-dl-panel` styled with `.mod-dl-*` classes from `module-download.css`).
   - Displays: "Downloading ToolCEO vX.Y.Z", progress bar, percentage, received MB / total MB, and download speed.
2. Mid-Screen Restart Dialog (`#app-update-restart-modal`):
   - When download completes (`updater:update-downloaded`), hide dock panel and display a focused, dark-glassmorphism mid-screen modal:
     - Header: Accent checkmark icon + "Update Ready to Install"
     - Subtitle: "ToolCEO vX.Y.Z has been downloaded. Restart the app now to finish updating."
     - Actions:
       - Primary: `<button class="btn-update-restart">Restart ToolCEO Now</button>`
       - Secondary / Close: `<button class="btn-update-later">Later</button>` or top-right `×` close button.
3. Dismissal & Re-entry Logic:
   - If user clicks `×` or "Later", modal closes, but `updateState` is set to `'ready_to_install'`.
   - The installer file is preserved on disk in Electron updater's cache.
   - The sidebar "Update" tab displays a persistent green badge: `Restart`.
   - Clicking "Update" in the sidebar at any subsequent point immediately summons the mid-screen modal back.
4. Restart Execution:
   - Clicking "Restart ToolCEO Now" triggers `window.electronAPI.updater.quitAndInstall()`.

## Success & Verification Criteria
- [ ] Floating download panel matches the look, feel, animations, and draggable behavior of the module download window.
- [ ] Mid-screen modal displays clearly in the center of the viewport with dark glass backdrop.
- [ ] Dismissing the modal retains the update in `ready_to_install` state without losing progress.
- [ ] Clicking sidebar "Update" brings back the mid-screen restart modal.
- [ ] "Restart ToolCEO Now" properly calls `quitAndInstall()`.
