# Phase 3: Sidebar Indicator, Startup Notification & Navigation

**Master Plan:** .agents/memory/plans/main-plan.md  
**Status:** PENDING  

## Selected Skills for This Phase
- `frontend/frontend-baseline`: Preserves dark glassmorphism design tokens and pixel-perfect icon geometry.
- `frontend/design-engineering`: Polished interaction states (idle, hover, active, badge pulse, restart state).

## Input Dependencies
- `frontend/index.html`
- `frontend/styles/sidebar.css`
- `frontend/scripts/navigation.js`
- `frontend/scripts/notificationStore.js`
- Events from `window.electronAPI.updater` (Phase 2)

## Step-by-Step Execution
1. Add dynamic Update Available sidebar element in `frontend/index.html` (under `System` navigation section):
   ```html
   <li class="nav-item nav-item--update" id="nav-item-update" data-label="Update" style="display: none;">
     <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="#00E5C0" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
       <polyline points="7 10 12 15 17 10"/>
       <line x1="12" y1="15" x2="12" y2="3"/>
     </svg>
     <span id="nav-update-text">Update</span>
     <span class="nav-update-badge" id="nav-update-badge">v…</span>
   </li>
   ```
2. Style `.nav-item--update` and `.nav-update-badge` in `frontend/styles/sidebar.css` with subtle glow and accent color:
   - State A: `available` → cyan badge `"New vX.Y"`
   - State B: `downloading` → pulsing badge `"XX%"`
   - State C: `ready_to_install` → green badge `"Restart"`
3. Startup Notification Banner:
   - When `updater:update-available` fires on start, display `pushNotification()` with *"New version available (v...)"* and action *"Download Update"*.
4. Sidebar Navigation Hook:
   - When clicked while state is `available` → open update prompt / download panel.
   - When clicked while state is `ready_to_install` (after user previously dismissed the prompt) → re-open the mid-screen restart modal immediately!

## Success & Verification Criteria
- [ ] Sidebar update item remains hidden until an update is found.
- [ ] On update detection, badge renders correctly with responsive spacing.
- [ ] Clicking sidebar item in `ready_to_install` state reliably re-displays the mid-screen restart prompt.
