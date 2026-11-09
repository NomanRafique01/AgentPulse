# Phase 1: Dependencies, Build Configuration & GitHub CI/CD

**Master Plan:** .agents/memory/plans/main-plan.md  
**Status:** PENDING  

## Selected Skills for This Phase
- `backend/backend-master`: Establishes reliable publish target and dependency tree.
- `backend/karpathy-coder`: Surgical addition to `package.json` without modifying unrelated build properties.

## Input Dependencies
- `package.json` (currently v2.0.1)
- Git repository remote: `https://github.com/NomanRafique01/ToolCEO.git`

## Step-by-Step Execution
1. Install `electron-updater` as a production dependency in `package.json`.
2. Configure `build.publish` in `package.json`:
   ```json
   "publish": [
     {
       "provider": "github",
       "owner": "NomanRafique01",
       "repo": "ToolCEO",
       "releaseType": "release"
     }
   ]
   ```
3. Create `.github/workflows/release.yml` with:
   - Trigger on push of tags `v*.*.*`
   - Setup Node.js 20 & Python dependencies
   - Electron-builder build command with `--publish always`
   - Injection of `GITHUB_TOKEN` secret to push installer `.exe` and `latest.yml` directly to the GitHub Release.

## Success & Verification Criteria
- [ ] `electron-updater` is listed under `dependencies` in `package.json`.
- [ ] `package.json` JSON schema is valid and retains existing scripts and NSIS config.
- [ ] `.github/workflows/release.yml` exists and defines the complete build & publish pipeline.

