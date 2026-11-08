#!/usr/bin/env node
"use strict";

const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const readline = require("readline");
const connection = require("./connection");

const STDIN_TIMEOUT = 350;
const HTTP_TIMEOUT = 450;

function portFilePath() {
  return path.join(os.homedir(), ".agentlight", "port.json");
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
  const name = "agent-traffic-light";
  const home = os.homedir();
  if (process.platform === "win32") {
    return [path.join(process.env.APPDATA || path.join(home, "AppData", "Roaming"), name, "lights.json")];
  }
  if (process.platform === "darwin") {
    return [path.join(home, "Library", "Application Support", name, "lights.json")];
  }
  return [path.join(process.env.XDG_CONFIG_HOME || path.join(home, ".config"), name, "lights.json")];
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
    const response = await request(port, "GET", "/_agentlight/lights");
    if (response.status === 200) {
      try {
        const parsed = JSON.parse(response.body);
        const lights = (Array.isArray(parsed.lights) ? parsed.lights : []).map(item => ({
          ...item,
          route: item.route || `${item.slug}-${item.secret}`
        }));
        if (lights.length) return { lights, port };
      } catch { /* Fall back to the saved configuration. */ }
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
      if (text.length > 1_000_000) finish();
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

function ask(question) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

function ensureCliLauncher() {
  const target = connection.launcherPath();
  if (fs.existsSync(target)) return target;
  const result = connection.ensureLauncher(
    process.execPath,
    __filename,
    process.env.ELECTRON_RUN_AS_NODE === "1"
  );
  return result.ok ? result.path : target;
}

function lightChoices(lights) {
  return lights.filter(light => !light.closed);
}

async function chooseLight(lights, flags) {
  const open = lightChoices(lights);
  if (!open.length) {
    throw new Error("All saved lights are closed. Open a light in Agent Traffic Light, then run this again.");
  }
  if (flags.light) {
    const wanted = flags.light.trim().toLowerCase();
    const match = open.find(light =>
      String(light.name).toLowerCase() === wanted
      || String(light.slug).toLowerCase() === wanted
      || String(light.route).toLowerCase() === wanted
      || String(light.id) === flags.light
    );
    if (!match) {
      throw new Error(`No open light is named "${flags.light}". Open lights: ${open.map(light => `"${light.name}"`).join(", ")}.`);
    }
    return match;
  }
  if (open.length === 1) return open[0];
  if (!process.stdin.isTTY) {
    throw new Error(`Several lights are open. Choose one with --light "Name". Open lights: ${open.map(light => `"${light.name}"`).join(", ")}.`);
  }
  process.stdout.write("Which light should this folder use?\n");
  open.forEach((light, index) => process.stdout.write(`  ${index + 1}) ${light.name}\n`));
  const answer = await ask(`Choose 1-${open.length}: `);
  const index = Number.parseInt(answer.trim(), 10) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= open.length) {
    throw new Error("No light was chosen. Nothing was changed.");
  }
  return open[index];
}

function parseFlags(args) {
  const flags = { folder: "", light: "", backup: false, replace: false, help: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--light" || arg === "-l") flags.light = args[++index] || "";
    else if (arg.startsWith("--light=")) flags.light = arg.slice(8);
    else if (arg === "--backup") flags.backup = true;
    else if (arg === "--replace") flags.replace = true;
    else if (arg === "--help" || arg === "-h") flags.help = true;
    else if (!arg.startsWith("-") && !flags.folder) flags.folder = arg;
  }
  return flags;
}

async function cmdInit(args) {
  const flags = parseFlags(args);
  if (flags.help) return showHelp();

  const folder = path.resolve(flags.folder || process.cwd());
  const existing = connection.readConnection(folder);
  const { lights, port } = await readLights();
  if (!lights.length) {
    throw new Error("No saved lights were found. Open Agent Traffic Light, create a light, then run this command again.");
  }
  const chosen = await chooseLight(lights, flags);

  if (existing && !existing.broken && existing.route !== chosen.route) {
    const message = `This folder is already connected to "${existing.name}".`;
    if (!flags.replace) {
      if (!process.stdin.isTTY) {
        throw new Error(`${message} Run again with --replace to connect it to "${chosen.name}" instead.`);
      }
      const answer = await ask(`${message} Replace it with "${chosen.name}"? [y/N] `);
      if (!/^y(es)?$/i.test(answer.trim())) {
        process.stdout.write("Nothing changed.\n");
        return;
      }
    }
  }

  const launcher = ensureCliLauncher();
  const commandFor = event => connection.commandForEvent(launcher, event);
  const result = connection.connectFolder(
    folder,
    { name: chosen.name, route: chosen.route, secret: chosen.secret },
    commandFor,
    { backup: flags.backup }
  );

  await request(port, "POST", "/_agentlight/connect", {
    route: chosen.route,
    secret: chosen.secret,
    folder,
    name: chosen.name
  });

  process.stdout.write([
    `Connected "${chosen.name}" to:`,
    `  ${folder}`,
    "",
    `Hooks: ${result.hooks.file}`,
    result.hooks.backup ? `Backup of the old hooks file: ${result.hooks.backup}` : "",
    result.exclude.applicable && result.exclude.ok
      ? "Added the connection and hooks file to .git/info/exclude."
      : "",
    result.exclude.applicable && !result.exclude.ok ? `Git exclude was not updated: ${result.exclude.error}` : "",
    "",
    "Start a new Antigravity session in this folder, then open /hooks."
  ].filter(Boolean).join("\n") + "\n");

  if (existing && existing.broken) {
    process.stdout.write("The previous .agentlight file could not be read and was replaced.\n");
  }
}

function normaliseQuestions(payload) {
  const name = payload && payload.toolCall && payload.toolCall.name
    ? String(payload.toolCall.name)
    : String(payload && payload.toolName || "");
  const args = (payload && payload.toolCall && payload.toolCall.args)
    || (payload && payload.toolArgs)
    || {};

  if (name === "ask_permission") {
    const action = args.Action ? String(args.Action) : "access";
    const target = args.Target ? String(args.Target) : "";
    const reason = args.Reason ? String(args.Reason) : "";
    return {
      permission: true,
      questions: [{
        question: `Allow the agent to request ${action}?`,
        detail: [target, reason].filter(Boolean).join(" — "),
        options: [],
        multi: false
      }]
    };
  }

  const list = Array.isArray(args.questions) ? args.questions : [];
  const questions = list.slice(0, 3).map(item => {
    const source = item && typeof item === "object" ? item : {};
    const options = Array.isArray(source.options)
      ? source.options.map(option => {
        if (typeof option === "string") return option;
        if (!option || typeof option !== "object") return "";
        return String(option.label || option.text || option.value || option.title || "");
      }).filter(Boolean).slice(0, 8)
      : [];
    return {
      question: String(source.question || source.text || "").slice(0, 600),
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

function toolName(payload) {
  if (!payload) return "";
  if (payload.toolCall && typeof payload.toolCall.name === "string") return payload.toolCall.name;
  if (typeof payload.toolName === "string") return payload.toolName;
  return "";
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
  let allowed = false;
  try {
    const port = readPort();
    const payload = parsePayload(await readStdin());
    const event = connection.HOOK_EVENTS.includes(args[0]) ? args[0] : inferEvent(payload);

    if (!payload || !event) {
      process.stdout.write("{}\n");
      return;
    }

    const found = resolveConnection(payload);
    if (!found || !found.connection || found.connection.broken) {
      process.stdout.write("{}\n");
      return;
    }

    const name = toolName(payload);
    const asking = event === "PreToolUse" && (name === "ask_question" || name === "ask_permission");
    let state = "working";
    if (asking) state = "asking";
    if (event === "Stop") {
      if (payload.terminationReason === "error" || payload.error) state = "error";
      else if (payload.fullyIdle) state = "finished";
      else state = "working";
    }
    if (event === "PostToolUse" || event === "PreInvocation" || event === "SessionStart") state = "working";

    const body = {
      route: found.connection.route,
      secret: found.connection.secret,
      event,
      state,
      conversationId: typeof payload.conversationId === "string" ? payload.conversationId : "",
      folder: found.folder,
      workspacePaths: Array.isArray(payload.workspacePaths) ? payload.workspacePaths.slice(0, 4) : [],
      lastUserInput: typeof payload.lastUserInput === "string" ? payload.lastUserInput.slice(0, 200) : "",
      question: asking ? normaliseQuestions(payload) : null
    };

    const response = await request(port, "POST", "/_agentlight/signal", body);
    if (response.status === 410) process.stderr.write("light closed\n");
    if (asking) allowed = true;
  } catch {
    allowed = false;
  }
  process.stdout.write(allowed ? "{\"decision\":\"allow\"}\n" : "{}\n");
}

async function cmdOff(args) {
  const flags = parseFlags(args);
  const start = path.resolve(flags.folder || process.cwd());
  const found = connection.findConnection(start);
  if (!found) {
    throw new Error(`This folder is not connected:\n${start}`);
  }
  connection.disconnectFolder(found.folder);
  const port = readPort();
  if (found.connection && !found.connection.broken) {
    await request(port, "POST", "/_agentlight/disconnect", {
      route: found.connection.route,
      secret: found.connection.secret,
      folder: found.folder
    });
  }
  process.stdout.write(`Disconnected:\n  ${found.folder}\n\nThe light itself was not deleted.\n`);
}

function showHelp() {
  const launcher = connection.launcherPath();
  process.stdout.write([
    "Agent Traffic Light",
    "",
    "Usage:",
    `  "${launcher}" init [folder] [--light "Name"] [--backup] [--replace]`,
    `  "${launcher}" signal <Event> < hook-payload.json`,
    `  "${launcher}" off [folder]`,
    "",
    "init    Connect a project folder to a saved light.",
    "signal  Send one Antigravity hook event to the app.",
    "off     Remove the connection and its hook entry.",
    "",
    "Events: SessionStart, PreInvocation, PreToolUse, PostToolUse, Stop",
    ""
  ].join("\n"));
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === "help" || command === "--help" || command === "-h") return showHelp();
  if (command === "init" || command === "connect") return cmdInit(args);
  if (command === "signal") return cmdSignal(args);
  if (command === "off" || command === "disconnect") return cmdOff(args);
  throw new Error(`Unknown command "${command}". Run "${connection.launcherPath()}" help.`);
}

if (process.argv[2] === "signal") {
  cmdSignal(process.argv.slice(3)).then(() => process.exit(0), () => {
    process.stdout.write("{}\n");
    process.exit(0);
  });
} else {
  main().then(() => process.exit(0), error => {
    process.stderr.write(`Agent Traffic Light: ${error && error.message ? error.message : String(error)}\n`);
    process.exit(1);
  });
}
