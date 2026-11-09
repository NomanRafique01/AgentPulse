"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const STAGING = path.join(DIST, "agentpulse");

console.log("==> Building AgentPulse Portable Release Package...");

// Clean existing dist
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(STAGING, { recursive: true });

// Copy essential application files
const filesToCopy = [
  "main.js",
  "agentpulse.js",
  "agentlight.js",
  "connection.js",
  "signal.js",
  "sound.js",
  "renderer.js",
  "index.html",
  "styles.css",
  "package.json"
];

for (const file of filesToCopy) {
  const src = path.join(ROOT, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(STAGING, file));
  }
}

// Copy node_modules (production dependencies)
const nodeModulesSrc = path.join(ROOT, "node_modules");
const nodeModulesDst = path.join(STAGING, "node_modules");
if (fs.existsSync(nodeModulesSrc)) {
  console.log("==> Copying production node_modules...");
  // Copy gsap, react, react-dom
  const corePkgs = ["gsap", "react", "react-dom", "scheduler", "js-tokens"];
  fs.mkdirSync(nodeModulesDst, { recursive: true });
  for (const pkg of corePkgs) {
    const pkgSrc = path.join(nodeModulesSrc, pkg);
    if (fs.existsSync(pkgSrc)) {
      copyDirRecursive(pkgSrc, path.join(nodeModulesDst, pkg));
    }
  }
}

// Copy prebuilt electron runtime if available
const electronSrc = path.join(ROOT, "node_modules", "electron", "dist");
const electronDst = path.join(STAGING, "electron");
if (fs.existsSync(electronSrc)) {
  console.log("==> Copying Electron runtime...");
  copyDirRecursive(electronSrc, electronDst);
  // Rename electron.exe to AgentPulse.exe on Windows
  const origExe = path.join(electronDst, process.platform === "win32" ? "electron.exe" : "electron");
  const brandedExe = path.join(electronDst, process.platform === "win32" ? "AgentPulse.exe" : "AgentPulse");
  if (fs.existsSync(origExe)) {
    fs.renameSync(origExe, brandedExe);
  }
}

// Create bin folder with smart launchers
const binDir = path.join(STAGING, "bin");
fs.mkdirSync(binDir, { recursive: true });

// 1. Windows launcher: bin/agentpulse.cmd
const winCmd = `@echo off
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
  node "%~dp0..\\agentpulse.js" %*
  if "%1"=="signal" exit /b 0
  exit /b %ERRORLEVEL%
)
if exist "%~dp0..\\electron\\AgentPulse.exe" (
  set "ELECTRON_RUN_AS_NODE=1"
  "%~dp0..\\electron\\AgentPulse.exe" "%~dp0..\\agentpulse.js" %*
  if "%1"=="signal" exit /b 0
  exit /b %ERRORLEVEL%
)
echo AgentPulse requires Node.js or the bundled runtime.
exit /b 1
`;
fs.writeFileSync(path.join(binDir, "agentpulse.cmd"), winCmd, "utf8");

// Also agentlight.cmd for backwards compatibility
fs.writeFileSync(path.join(binDir, "agentlight.cmd"), winCmd, "utf8");

// 2. Unix launcher: bin/agentpulse
const unixSh = `#!/bin/sh
SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
if command -v node >/dev/null 2>&1; then
  node "$SCRIPT_DIR/agentpulse.js" "$@"
  RET=$?
  if [ "$1" = "signal" ]; then exit 0; fi
  exit $RET
fi
if [ -f "$SCRIPT_DIR/electron/AgentPulse" ]; then
  ELECTRON_RUN_AS_NODE=1 exec "$SCRIPT_DIR/electron/AgentPulse" "$SCRIPT_DIR/agentpulse.js" "$@"
fi
echo "AgentPulse requires Node.js or the bundled runtime." >&2
exit 1
`;
fs.writeFileSync(path.join(binDir, "agentpulse"), unixSh, { encoding: "utf8", mode: 0o755 });
fs.writeFileSync(path.join(binDir, "agentlight"), unixSh, { encoding: "utf8", mode: 0o755 });

console.log("==> Packaging zip archive...");
// Package into zip using PowerShell on Windows
const zipFile = path.join(DIST, "agentpulse-windows-x64.zip");
try {
  execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${STAGING}\\*' -DestinationPath '${zipFile}' -Force"`, {
    stdio: "inherit"
  });
  console.log(`==> Success! Release package created at: ${zipFile}`);
} catch (e) {
  console.error("Packaging zip failed:", e.message);
}

function copyDirRecursive(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

