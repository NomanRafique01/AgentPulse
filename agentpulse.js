#!/usr/bin/env node
"use strict";

const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const readline = require("readline");
const connection = require("./connection");

const STDIN_TIMEOUT = 180;
const HTTP_TIMEOUT = 250;

function portFilePath() {
  const primary = path.join(os.homedir(), ".agentpulse", "port.json");
  if (fs.existsSync(primary)) return primary;
  const legacy = path.join(os.homedir(), ".agentlight", "port.json");
  if (fs.existsSync(legacy)) return legacy;
  return primary;
}

function readPort() {
  try {
    const parsed = JSON.parse(fs.readFileSync(portFilePath(), "utf8"));
    const port = Number(parsed && parsed.port);
    return Number.isInteger(port) && port > 0 && port < 65536 ? port : 0;
  } catch {
    return 0;
  }
}

function request(port, method, requestPath, body) {
  return new Promise(resolve => {
    if (!port) return resolve({ status: 0, body: "" });
    const payload = body ? Buffer.from(JSON.stringify(body)) : null;
    let finished = false;
    const done = result => {
      if (finished) return;
      finished = true;
      resolve(result);
    };
    const req = http.request({
      host: "127.0.0.1",
      port,
      method,
      path: requestPath,
      timeout: HTTP_TIMEOUT,
      headers: payload ? {
        "Content-Type": "application/json",
        "Content-Length": payload.length
      } : {}
    }, response => {
      let text = "";
      response.setEncoding("utf8");
      response.on("data", chunk => { text += chunk; });
      response.on("end", () => done({ status: response.statusCode, body: text }));
    });
    req.on("timeout", () => {
      req.destroy();
      done({ status: 0, body: "" });
    });
    req.on("error", () => done({ status: 0, body: "" }));
    if (payload) req.write(payload);
    req.end();
  });
}

function configFileCandidates() {
  const names = ["agent-pulse", "agent-traffic-light"];
  const home = os.homedir();
  const candidates = [];
  for (const name of names) {
    if (process.platform === "win32") {
      candidates.push(path.join(process.env.APPDATA || path.join(home, "AppData", "Roaming"), name, "lights.json"));
    } else if (process.platform === "darwin") {
      candidates.push(path.join(home, "Library", "Application Support", name, "lights.json"));
    } else {
      candidates.push(path.join(process.env.XDG_CONFIG_HOME || path.join(home, ".config"), name, "lights.json"));
    }
  }
  return candidates;
}

function readConfigLights() {
  for (const file of configFileCandidates()) {
    try {
      const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
      const lights = (Array.isArray(parsed.lights) ? parsed.lights : [])
        .filter(item => item && typeof item.slug === "string" && /^[a-f0-9]{8}$/.test(item.secret || ""))
        .map(item => ({
          id: item.id,
          name: String(item.name || item.slug),
          slug: item.slug,
          secret: item.secret,
          route: `${item.slug}-${item.secret}`,
          closed: false
        }));
      if (lights.length) return lights;
    } catch { /* Try the next location. */ }
  }
  return [];
}

async function readLights() {
  const port = readPort();
  if (port) {
    for (const route of ["/_agentpulse/lights", "/_agentlight/lights"]) {
      const response = await request(port, "GET", route);
      if (response.status === 200) {
        try {
          const parsed = JSON.parse(response.body);
          const lights = (Array.isArray(parsed.lights) ? parsed.lights : []).map(item => ({
            ...item,
            route: item.route || `${item.slug}-${item.secret}`
          }));
          if (lights.length) return { lights, port };
        } catch { /* Fall back */ }
      }
    }
  }
  return { lights: readConfigLights(), port: 0 };
}

function readStdin() {
  return new Promise(resolve => {
    if (process.stdin.isTTY) return resolve("");
    let text = "";
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      resolve(text);
    };
    const timer = setTimeout(finish, STDIN_TIMEOUT);
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", chunk => {
      text += chunk;
      if (text.length > 500_000) finish();
    });
    process.stdin.on("end", finish);
    process.stdin.on("error", finish);
  });
}

function parsePayload(text) {
  try {
    const parsed = JSON.parse(text.replace(/^\uFEFF/, ""));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function parseFlags(args) {
  const flags = { folder: "", light: "", backup: false, replace: false };
  const rest = [];
  for (let i = 0; i < args.length; i++) {
    const current = args[i];
    if (current === "--backup") flags.backup = true;
    else if (current === "--replace") flags.replace = true;
    else if (current === "--light" && i + 1 < args.length) flags.light = args[++i];
    else if (current.startsWith("--light=")) flags.light = current.slice(8);
    else rest.push(current);
  }
  if (rest.length) flags.folder = rest[0];
  return flags;
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function ensureCliLauncher() {
  const target = connection.launcherPath();
  const result = connection.ensureLauncher(
    process.execPath,
    __filename,
    !process.execPath.endsWith("node") && !process.execPath.endsWith("node.exe")
  );
  return result.path;
}

function ensureProjectLight(folderName) {
  const crypto = require("crypto");
  const secret = crypto.randomBytes(4).toString("hex");
  const baseSlug = folderName.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 24) || "pulse";
  const light = {
    id: crypto.randomUUID(),
    name: folderName,
    slug: baseSlug,
    secret,
    route: `${baseSlug}-${secret}`,
    size: "medium",
    bodyColour: "#1b1e20",
    folders: [],
    closed: false
  };

  const candidates = configFileCandidates();
  if (candidates.length) {
    const file = candidates[0];
    try {
      let current = { version: 1, lights: [] };
      try {
        current = JSON.parse(fs.readFileSync(file, "utf8")) || current;
      } catch {}
      if (!Array.isArray(current.lights)) current.lights = [];
      current.lights.push(light);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, JSON.stringify(current, null, 2), "utf8");
    } catch {}
  }
  return light;
}

function launchApp() {
  const { spawn } = require("child_process");
  const mainPath = path.join(__dirname, "main.js");
  try {
    const electron = require("electron");
    const child = spawn(electron, [mainPath], {
      detached: true,
      stdio: "ignore"
    });
    child.unref();
    return true;
  } catch {
    try {
      const isWin = process.platform === "win32";
      const child = spawn(isWin ? "npx.cmd" : "npx", ["electron", mainPath], {
        detached: true,
        stdio: "ignore"
      });
      child.unref();
      return true;
    } catch {
      return false;
    }
  }
}

async function pickLight(lights, explicitName) {
  if (!lights.length) return null;
  if (explicitName) {
    const query = explicitName.toLowerCase();
    const match = lights.find(item => item.name.toLowerCase() === query || item.slug === query);
    if (!match) {
      const names = lights.map(item => `  - ${item.name}`).join("\n");
      throw new Error(`No light named "${explicitName}". Available lights:\n${names}`);
    }
    return match;
  }
  if (lights.length === 1) return lights[0];
  if (!process.stdin.isTTY) return lights[0];

  process.stdout.write("\nSelect a light for this folder:\n");
  lights.forEach((item, index) => {
    process.stdout.write(`  [${index + 1}] ${item.name}\n`);
  });
  while (true) {
    const answer = await ask(`Choose 1-${lights.length} [1]: `);
    if (!answer) return lights[0];
    const index = Number(answer) - 1;
    if (index >= 0 && index < lights.length) return lights[index];
    process.stdout.write("Invalid choice. Try again.\n");
  }
}

async function cmdInit(args) {
  const flags = parseFlags(args);
  const target = path.resolve(flags.folder || process.cwd());
  const folderName = path.basename(target) || "Project";
  const launcher = ensureCliLauncher();
  let { lights, port } = await readLights();

  let chosen;
  if (!lights || !lights.length) {
    chosen = ensureProjectLight(folderName);
  } else {
    const openLights = lights.filter(item => !item.closed);
    const pool = openLights.length ? openLights : lights;
    chosen = flags.light ? await pickLight(pool, flags.light) : pool[0];
  }

  const existing = connection.readHooks(target);
  if (existing.exists && Object.prototype.hasOwnProperty.call(existing.data, connection.HOOK_KEY) && !flags.replace) {
    throw new Error(
      `This folder already has an AgentPulse connection:\n  ${existing.file}\n\nRun with --replace to overwrite it.`
    );
  }

  const result = connection.connectFolder(
    target,
    chosen,
    eventName => connection.commandForEvent(launcher, eventName),
    { backup: flags.backup }
  );

  if (port) {
    for (const route of ["/_agentpulse/connect", "/_agentlight/connect"]) {
      await request(port, "POST", route, {
        route: chosen.route,
        secret: chosen.secret,
        folder: target
      }).catch(() => {});
    }
    await request(port, "POST", "/_agentpulse/start", {}).catch(() => {});
  } else {
    launchApp();
  }

  process.stdout.write([
    `Signal initialized for "${chosen.name}":`,
    `  Folder: ${target}`,
    `  Hooks:  ${result.hooks.file}${result.hooks.backup ? ` (backup at ${result.hooks.backup})` : ""}`,
    result.exclude.ok ? `  Git exclude: ${result.exclude.file}` : "",
    "",
    "Signal is live! Your coding agent will now pulse this light on actions.",
    "",
    "Commands:",
    "  agentpulse start  - summon the signal light",
    "  agentpulse off    - cleanly deactivate signal & remove hook",
    ""
  ].filter(line => line !== "").join("\n"));
}

function toolName(payload) {
  if (!payload) return "";
  if (payload.toolCall && typeof payload.toolCall.name === "string") return payload.toolCall.name;
  if (typeof payload.toolName === "string") return payload.toolName;
  if (typeof payload.tool_name === "string") return payload.tool_name;
  if (payload.tool && typeof payload.tool.name === "string") return payload.tool.name;
  if (typeof payload.tool === "string") return payload.tool;
  if (typeof payload.name === "string") return payload.name;
  return "";
}

function cleanToolName(name) {
  const s = String(name || "").toLowerCase().trim();
  return s.includes(":") ? s.split(":").pop() : s;
}

function isAsking(name) {
  const n = cleanToolName(name);
  if (!n) return false;
  return (
    n === "ask_question" ||
    n === "ask_permission" ||
    n === "ask_user" ||
    n === "ask" ||
    n.startsWith("ask_") ||
    n.includes("question") ||
    n.includes("permission")
  );
}

function isWritingOrEditing(name) {
  const n = cleanToolName(name);
  if (!n) return false;
  return (
    n === "write_file" ||
    n === "edit_file" ||
    n === "create_file" ||
    n === "append_file" ||
    n === "patch_file" ||
    n === "modify_file" ||
    n === "save_file" ||
    n === "str_replace_editor" ||
    n === "file_editor" ||
    n === "write" ||
    n === "edit" ||
    n.includes("write_file") ||
    n.includes("edit_file") ||
    n.includes("patch_file") ||
    n.includes("create_file")
  );
}

function isRunningTerminal(name) {
  const n = cleanToolName(name);
  if (!n) return false;
  return (
    n === "run_command" ||
    n === "bash" ||
    n === "terminal" ||
    n === "execute_command" ||
    n === "exec_command" ||
    n === "run_terminal_cmd" ||
    n === "shell" ||
    n === "exec" ||
    n.includes("command") ||
    n.includes("terminal") ||
    n.includes("bash") ||
    n.includes("shell")
  );
}

function normaliseQuestions(payload) {
  const name = cleanToolName(toolName(payload));
  const args = (payload && payload.toolCall && payload.toolCall.args)
    || (payload && payload.toolArgs)
    || {};

  if (name === "ask_permission" || name.includes("permission")) {
    const action = args.Action ? String(args.Action) : "access";
    const target = args.Target ? String(args.Target) : "";
    const reason = args.Reason ? String(args.Reason) : "";
    return {
      questions: [{
        question: `Allow ${action}${target ? ` on ${target}` : ""}?`,
        detail: reason,
        options: ["Allow", "Deny"],
        multi: false
      }]
    };
  }

  const raw = Array.isArray(args.questions) ? args.questions : [];
  const questions = raw.map(item => {
    const source = item && typeof item === "object" ? item : {};
    const options = (Array.isArray(source.options) ? source.options : [])
      .map(entry => {
        if (typeof entry === "string") return entry.trim();
        if (entry && typeof entry.label === "string") return entry.label.trim();
        return "";
      })
      .filter(Boolean);
    return {
      question: String(source.question || source.text || "").trim(),
      detail: String(source.detail || source.explanation || "").trim(),
      options,
      multi: Boolean(source.is_multi_select || source.isMultiSelect)
    };
  }).filter(item => item.question || item.options.length);

  return {
    questions: questions.length ? questions : [{
      question: "The agent is waiting for your answer.",
      detail: "",
      options: [],
      multi: false
    }]
  };
}

function inferEvent(payload) {
  if (!payload) return "";
  if (Object.prototype.hasOwnProperty.call(payload, "fullyIdle")
    || Object.prototype.hasOwnProperty.call(payload, "terminationReason")) return "Stop";
  if (typeof payload.hookEventName === "string") return payload.hookEventName;
  if (typeof payload.eventName === "string") return payload.eventName;
  if (payload.toolCall) {
    return payload.toolResult || payload.toolResponse ? "PostToolUse" : "PreToolUse";
  }
  return "";
}

function resolveConnection(payload) {
  const candidates = [];
  if (payload && Array.isArray(payload.workspacePaths)) candidates.push(...payload.workspacePaths);
  if (payload && typeof payload.cwd === "string") candidates.push(payload.cwd);
  candidates.push(process.cwd());
  for (const candidate of candidates) {
    if (typeof candidate !== "string" || !candidate) continue;
    const found = connection.findConnection(candidate);
    if (found) return found;
  }
  return null;
}

async function cmdSignal(args) {
  const eventName = args[0] || "";
  let isPreTool = eventName === "PreToolUse";
  let outputEmitted = false;

  const emitHookResponse = () => {
    if (outputEmitted) return;
    outputEmitted = true;
    if (isPreTool) {
      process.stdout.write('{"decision":"allow"}\n');
    } else {
      process.stdout.write("{}\n");
    }
  };

  try {
    const rawInput = await readStdin();
    const payload = parsePayload(rawInput) || {};
    const event = connection.HOOK_EVENTS.includes(eventName) ? eventName : inferEvent(payload);
    if (event === "PreToolUse" || (payload && payload.toolCall)) {
      isPreTool = true;
    }

    const found = resolveConnection(payload);
    if (!found || !found.connection || found.connection.broken) {
      emitHookResponse();
      return;
    }

    const name = toolName(payload);
    const asking = isPreTool && isAsking(name);
    let state = "thinking";
    if (asking) {
      state = "asking";
    } else if (isPreTool) {
      if (isWritingOrEditing(name)) {
        state = "writing_file";
      } else if (isRunningTerminal(name)) {
        state = "running_terminal";
      } else {
        state = "thinking";
      }
    } else if (event === "Stop") {
      state = "stopped";
    } else if (event === "PreInvocation" || event === "SessionStart" || event === "PostToolUse") {
      state = "thinking";
    }

    const body = {
      route: found.connection.route,
      secret: found.connection.secret,
      event: event || eventName,
      state,
      toolName: name,
      conversationId: typeof payload.conversationId === "string" ? payload.conversationId : "",
      folder: found.folder,
      workspacePaths: Array.isArray(payload.workspacePaths) ? payload.workspacePaths.slice(0, 4) : [],
      lastUserInput: typeof payload.lastUserInput === "string" ? payload.lastUserInput.slice(0, 200) : "",
      question: asking ? normaliseQuestions(payload) : null
    };

    const port = readPort();
    if (port) {
      await Promise.race([
        request(port, "POST", "/_agentpulse/signal", body),
        new Promise(res => setTimeout(res, 200))
      ]).catch(() => {});
    }
  } catch {
    // Fail silently
  } finally {
    // ALWAYS emit valid hook JSON so Antigravity NEVER blocks tool calls
    emitHookResponse();
  }
}

async function cmdStart(args) {
  const port = readPort();
  if (port) {
    const res = await request(port, "POST", "/_agentpulse/start", {}).catch(() => null);
    if (res && (res.status === 200 || res.status === 204)) {
      process.stdout.write("AgentPulse signal active (summoned).\n");
      return;
    }
  }
  process.stdout.write("Summoning AgentPulse desktop signal...\n");
  const launched = launchApp();
  if (launched) {
    process.stdout.write("AgentPulse signal summoned.\n");
  } else {
    process.stdout.write("Could not automatically launch GUI. Run 'agentpulse' or check Electron.\n");
  }
}

async function cmdUninstall() {
  process.stdout.write("Unlinking AgentPulse signals from this project...\n");
  const target = process.cwd();
  try {
    const found = connection.findConnection(target);
    if (found) {
      connection.disconnectFolder(found.folder);
      process.stdout.write(`Unlinked hooks from: ${found.folder}\n`);
    }
  } catch {}

  process.stdout.write([
    "",
    "Hooks unlinked. To uninstall the global npm package completely, run:",
    "  npm uninstall -g agentpulse",
    ""
  ].join("\n"));
}

async function cmdOff(args) {
  const flags = parseFlags(args);
  const start = path.resolve(flags.folder || process.cwd());
  const found = connection.findConnection(start);
  if (!found) {
    process.stdout.write(`Notice: No active connection found in ${start}\n`);
    return;
  }
  connection.disconnectFolder(found.folder);
  const port = readPort();
  if (found.connection && !found.connection.broken) {
    for (const route of ["/_agentpulse/disconnect", "/_agentlight/disconnect"]) {
      await request(port, "POST", route, {
        route: found.connection.route,
        secret: found.connection.secret,
        folder: found.folder
      }).catch(() => {});
    }
  }
  process.stdout.write(`Signal deactivated and hooks removed from:\n  ${found.folder}\n`);
}

function showHelp() {
  process.stdout.write([
    "AgentPulse ⚡ Real-Time Coding Agent Signals",
    "",
    "Usage:",
    "  agentpulse init [folder]     Assign a signal to this project & activate hooks",
    "  agentpulse start             Summon the floating signal widget",
    "  agentpulse off               Deactivate signal & remove hooks cleanly",
    "  agentpulse uninstall         Unlink signals and clean workspace",
    "  agentpulse signal <Event>    Relay agent hook event",
    "",
    "Options:",
    "  --replace                    Overwrite existing hook without warning",
    "  --backup                     Create a backup of hooks.json before modifying",
    ""
  ].join("\n"));
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command) {
    const found = connection.findConnection(process.cwd());
    if (found) return cmdStart(args);
    return showHelp();
  }
  if (command === "help" || command === "--help" || command === "-h") return showHelp();
  if (command === "version" || command === "--version" || command === "-v") {
    process.stdout.write(`AgentPulse v${require("./package.json").version}\n`);
    return;
  }
  if (command === "init" || command === "connect") return cmdInit(args);
  if (command === "start" || command === "summon" || command === "on") return cmdStart(args);
  if (command === "signal") return cmdSignal(args);
  if (command === "off" || command === "deactivate" || command === "disconnect") return cmdOff(args);
  if (command === "uninstall") return cmdUninstall(args);
  throw new Error(`Unknown command "${command}". Run "agentpulse help".`);
}

process.on("uncaughtException", () => {
  if (process.argv[2] === "signal") {
    if (process.argv[3] === "PreToolUse") process.stdout.write('{"decision":"allow"}\n');
    else process.stdout.write("{}\n");
  }
  process.exit(0);
});

process.on("unhandledRejection", () => {
  if (process.argv[2] === "signal") {
    if (process.argv[3] === "PreToolUse") process.stdout.write('{"decision":"allow"}\n');
    else process.stdout.write("{}\n");
  }
  process.exit(0);
});

if (process.argv[2] === "signal") {
  const isPre = process.argv[3] === "PreToolUse";
  cmdSignal(process.argv.slice(3))
    .then(() => process.exit(0))
    .catch(() => {
      if (isPre) process.stdout.write('{"decision":"allow"}\n');
      else process.stdout.write("{}\n");
      process.exit(0);
    });
} else {
  main().then(() => process.exit(0), error => {
    process.stderr.write(`AgentPulse: ${error && error.message ? error.message : String(error)}\n`);
    process.exit(1);
  });
}

