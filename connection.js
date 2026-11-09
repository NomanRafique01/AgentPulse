"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const HOOK_KEY = "agentpulse";
const CONNECTION_FILE = ".agentpulse";
const LEGACY_CONNECTION_FILE = ".agentlight";
const HOOKS_REL = path.join(".agents", "hooks.json");
const HOOK_EVENTS = ["SessionStart", "PreInvocation", "PreToolUse", "PostToolUse", "Stop"];
const EXCLUDE_FILES = [CONNECTION_FILE, LEGACY_CONNECTION_FILE, ".agents/hooks.json"];

function invalidHooksError(file) {
  const error = new Error(`The hooks file is not valid JSON:\n${file}\n\nNothing was changed. Fix the file, or move it aside and start a fresh one.`);
  error.code = "INVALID_HOOKS";
  error.file = file;
  return error;
}

function notesError(message) {
  const error = new Error(message);
  error.code = "UNWRITABLE";
  return error;
}

function readJson(file) {
  let text;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw notesError(`Could not read ${file}. Check folder permissions.`);
  }
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw invalidHooksError(file);
  }
}

function writeJson(file, data) {
  const temporary = `${file}.agentpulse-tmp`;
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(temporary, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    fs.renameSync(temporary, file);
  } catch {
    try { fs.rmSync(temporary, { force: true }); } catch { /* Nothing left to clean. */ }
    throw notesError(`Could not write ${file}. Check folder permissions.`);
  }
}

function connectionPath(folder) {
  return path.join(folder, CONNECTION_FILE);
}

function legacyConnectionPath(folder) {
  return path.join(folder, LEGACY_CONNECTION_FILE);
}

function hooksPath(folder) {
  return path.join(folder, HOOKS_REL);
}

function readConnection(folder) {
  let file = connectionPath(folder);
  if (!fs.existsSync(file)) {
    const legacy = legacyConnectionPath(folder);
    if (fs.existsSync(legacy)) file = legacy;
  }
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    return error.code === "ENOENT" ? null : { broken: true };
  }
  if (!parsed || typeof parsed !== "object") return { broken: true };
  const name = typeof parsed.name === "string" ? parsed.name.trim().slice(0, 80) : "";
  const route = typeof parsed.route === "string" ? parsed.route.trim() : "";
  const secret = typeof parsed.secret === "string" ? parsed.secret.trim() : "";
  if (!/^[a-z0-9-]+$/.test(route) || !/^[a-f0-9]{8}$/.test(secret)) return { broken: true };
  return { name, route, secret, folder };
}

function findConnection(startPath) {
  let current;
  try {
    current = fs.statSync(startPath).isFile() ? path.dirname(startPath) : path.resolve(startPath);
  } catch {
    current = path.resolve(startPath);
  }
  while (true) {
    const connection = readConnection(current);
    if (connection) return { folder: current, connection };
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function writeConnection(folder, light) {
  writeJson(connectionPath(folder), {
    name: String(light.name || "").slice(0, 80),
    route: light.route,
    secret: light.secret,
    connectedAt: new Date().toISOString()
  });
}

function removeConnectionFile(folder) {
  try {
    fs.rmSync(connectionPath(folder), { force: true });
    return true;
  } catch {
    return false;
  }
}

function readHooks(folder) {
  const file = hooksPath(folder);
  const data = readJson(file);
  if (data === null) return { file, data: {}, exists: false };
  if (!data || typeof data !== "object" || Array.isArray(data)) throw invalidHooksError(file);
  return { file, data, exists: true };
}

function hookHandler(command) {
  return { type: "command", command, timeout: 15 };
}

function hookConfig(commandFor) {
  return {
    SessionStart: [hookHandler(commandFor("SessionStart"))],
    PreInvocation: [hookHandler(commandFor("PreInvocation"))],
    PreToolUse: [{ matcher: "", hooks: [hookHandler(commandFor("PreToolUse"))] }],
    PostToolUse: [{ matcher: "", hooks: [hookHandler(commandFor("PostToolUse"))] }],
    Stop: [hookHandler(commandFor("Stop"))]
  };
}

function mergeHooks(existing, commandFor) {
  const previous = existing[HOOK_KEY];
  const entry = {};
  if (previous && typeof previous === "object" && typeof previous.enabled === "boolean") {
    entry.enabled = previous.enabled;
  }
  return { ...existing, [HOOK_KEY]: { ...entry, ...hookConfig(commandFor) } };
}

function backupHooks(file) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backup = `${file}.backup-${stamp}`;
  fs.copyFileSync(file, backup);
  return backup;
}

function installHooks(folder, commandFor, options = {}) {
  let folderStat = null;
  try { folderStat = fs.statSync(folder); } catch { folderStat = null; }
  if (!folderStat || !folderStat.isDirectory()) {
    throw notesError(`The folder does not exist:\n${folder}`);
  }
  const agentsDir = path.join(folder, ".agents");
  let agentsStat = null;
  try { agentsStat = fs.statSync(agentsDir); } catch { agentsStat = null; }
  if (!agentsStat) {
    try {
      fs.mkdirSync(agentsDir, { recursive: true });
    } catch {
      throw notesError(`Could not create ${agentsDir}. Check folder permissions.`);
    }
  } else if (!agentsStat.isDirectory()) {
    throw notesError(`${agentsDir} exists but is not a folder.`);
  }

  const file = hooksPath(folder);
  let current;
  let backup = "";
  try {
    current = readHooks(folder);
  } catch (error) {
    if (error.code !== "INVALID_HOOKS" || !options.backup) throw error;
    try {
      backup = backupHooks(error.file);
    } catch {
      throw notesError(`Could not back up ${error.file}. Nothing was changed.`);
    }
    current = { file, data: {}, exists: true };
  }

  writeJson(file, mergeHooks(current.data, commandFor));
  return { file, backup };
}

function removeHooks(folder) {
  const file = hooksPath(folder);
  let current;
  try {
    current = readHooks(folder);
  } catch (error) {
    if (error.code === "INVALID_HOOKS") throw error;
    throw error;
  }
  if (!current.exists) return { removed: false, file };
  if (!Object.prototype.hasOwnProperty.call(current.data, HOOK_KEY)) {
    return { removed: false, file };
  }
  delete current.data[HOOK_KEY];
  if (!Object.keys(current.data).length) {
    try {
      fs.rmSync(file, { force: true });
    } catch {
      throw notesError(`Could not remove ${file}. Check folder permissions.`);
    }
    const agentsDir = path.dirname(file);
    try {
      if (!fs.readdirSync(agentsDir).length) fs.rmdirSync(agentsDir);
    } catch { /* Leave any folder we cannot inspect. */ }
  } else {
    writeJson(file, current.data);
  }
  return { removed: true, file };
}

function findGitRepo(folder) {
  let current = path.resolve(folder);
  while (true) {
    const candidate = path.join(current, ".git");
    let stat;
    try { stat = fs.statSync(candidate); } catch { stat = null; }
    if (stat && stat.isDirectory()) return { root: current, gitDir: candidate };
    if (stat && stat.isFile()) {
      try {
        const match = /^gitdir:\s*(.+)$/m.exec(fs.readFileSync(candidate, "utf8"));
        if (match) return { root: current, gitDir: path.resolve(current, match[1].trim()) };
      } catch { /* Fall through to the parent folder. */ }
    }
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function excludePatterns(folder, root) {
  return EXCLUDE_FILES.map(relativePath => {
    const absolute = path.join(folder, relativePath);
    const relative = path.relative(root, absolute).replace(/\\/g, "/");
    return `/${relative}`;
  });
}

function updateGitExclude(folder, action) {
  const repo = findGitRepo(folder);
  if (!repo) return { applicable: false };
  const infoDir = path.join(repo.gitDir, "info");
  const file = path.join(infoDir, "exclude");
  let text = "";
  try {
    text = fs.readFileSync(file, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") return { applicable: true, ok: false, error: `Could not read ${file}.` };
  }
  const patterns = excludePatterns(folder, repo.root);
  const lines = text.split(/\r?\n/);
  const kept = lines.filter(line => !patterns.includes(line.trim()));
  const nextLines = action === "add"
    ? [...kept.filter(line => line !== ""), ...patterns]
    : kept;

  const trimTrailing = list => {
    while (list.length && list[list.length - 1] === "") list.pop();
    return list;
  };
  const next = `${trimTrailing(nextLines).join("\n")}${trimTrailing(nextLines).length ? "\n" : ""}`;
  if (next === text) return { applicable: true, ok: true, file, changed: false };
  try {
    fs.mkdirSync(infoDir, { recursive: true });
    fs.writeFileSync(file, next, "utf8");
    return { applicable: true, ok: true, file, changed: true };
  } catch {
    return { applicable: true, ok: false, error: `Could not update ${file}.` };
  }
}

function shellQuote(value) {
  if (process.platform === "win32") {
    const str = String(value);
    if (!/\s/.test(str)) return str;
    try {
      const cp = require("child_process");
      const short = cp.execSync(`cmd.exe /c "for %I in ("${str}") do @echo %~sI"`, {
        stdio: ["ignore", "pipe", "ignore"],
        encoding: "utf8"
      }).trim();
      if (short && !/\s/.test(short)) return short;
    } catch { /* Fall back to unquoted or quoted. */ }
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function commandForEvent(launcher, eventName) {
  return `${shellQuote(launcher)} signal ${eventName}`;
}

function launcherPath() {
  return path.join(os.homedir(), ".agentpulse", "bin", process.platform === "win32" ? "agentpulse.cmd" : "agentpulse");
}

function legacyLauncherPath() {
  return path.join(os.homedir(), ".agentlight", "bin", process.platform === "win32" ? "agentlight.cmd" : "agentlight");
}

function launcherContent(exePath, scriptPath, asNode) {
  if (process.platform === "win32") {
    return [
      "@echo off",
      "where node >nul 2>nul",
      "if %ERRORLEVEL% equ 0 (",
      `  node "${scriptPath}" %*`,
      "  exit /b %ERRORLEVEL%",
      ")",
      asNode ? "set \"ELECTRON_RUN_AS_NODE=1\"" : "",
      `"${exePath}" "${scriptPath}" %*`,
      ""
    ].filter(line => line !== "").join("\r\n");
  }
  return [
    "#!/bin/sh",
    asNode
      ? `ELECTRON_RUN_AS_NODE=1 exec "${exePath}" "${scriptPath}" "$@"`
      : `exec "${exePath}" "${scriptPath}" "$@"`,
    ""
  ].join("\n");
}

function ensureLauncher(exePath, scriptPath, asNode) {
  const target = launcherPath();
  const legacyTarget = legacyLauncherPath();
  const content = launcherContent(exePath, scriptPath, asNode);
  try {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, "utf8");
    if (process.platform !== "win32") fs.chmodSync(target, 0o755);

    // Also write legacy launcher for backwards compatibility with any existing hooks
    try {
      fs.mkdirSync(path.dirname(legacyTarget), { recursive: true });
      fs.writeFileSync(legacyTarget, content, "utf8");
      if (process.platform !== "win32") fs.chmodSync(legacyTarget, 0o755);
    } catch { /* Ignore legacy write errors */ }

    return { ok: true, path: target };
  } catch {
    return { ok: false, path: target };
  }
}

function connectFolder(folder, light, commandFor, options = {}) {
  const previous = (() => {
    try { return fs.readFileSync(connectionPath(folder), "utf8"); } catch { return null; }
  })();
  writeConnection(folder, light);
  try {
    const hooks = installHooks(folder, commandFor, options);
    const exclude = updateGitExclude(folder, "add");
    return { hooks, exclude, connection: readConnection(folder) };
  } catch (error) {
    try {
      if (previous === null) fs.rmSync(connectionPath(folder), { force: true });
      else fs.writeFileSync(connectionPath(folder), previous, "utf8");
    } catch { /* Keep the original error. */ }
    throw error;
  }
}

function disconnectFolder(folder) {
  const removedHooks = removeHooks(folder);
  const exclude = updateGitExclude(folder, "remove");
  removeConnectionFile(folder);
  return { removedHooks, exclude };
}

module.exports = {
  CONNECTION_FILE,
  HOOK_EVENTS,
  HOOK_KEY,
  HOOKS_REL,
  commandForEvent,
  connectFolder,
  connectionPath,
  disconnectFolder,
  ensureLauncher,
  findConnection,
  findGitRepo,
  hooksPath,
  installHooks,
  launcherPath,
  readConnection,
  readHooks,
  removeHooks,
  shellQuote,
  updateGitExclude,
  writeConnection
};
