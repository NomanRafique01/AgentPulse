const { app, BrowserWindow, Menu, Tray, clipboard, dialog, ipcMain, nativeImage, screen } = require("electron");
const { execFile } = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const connection = require("./connection");

const SIZES = ["small", "medium", "large"];
const BODY_COLOURS = new Set([
  "#1b1e20", "#e9e8e2", "#2f5573", "#5f4a72",
  "#a95a2c", "#3c5e4a", "#7e3b3c", "#6d7479"
]);
const WINDOW_SIZES = { small: [190, 50], medium: [214, 56], large: [244, 62] };
const CONNECT_SIZES = { small: [300, 330], medium: [344, 342], large: [396, 358] };
const TERMINAL_TIMEOUT = 10 * 60 * 1000; // Commands can run for minutes (builds, tests); keep yellow blinking!
const THINKING_TIMEOUT = 12 * 1000;      // 12s silence = agent stopped/cancelled → RED
const TEN_MINUTES = 10 * 60 * 1000;
const AGENT_STATES = new Set(["working", "thinking", "reading_file", "writing_file", "running_terminal", "asking", "error", "finished", "stopped"]);

let config = { lights: [] };
let lightWindows = new Map();
let setupWindow = null;
let server = null;
let serverPort = null;
let serverError = "";
let readError = "";
let portFileError = "";
let tray = null;
let isQuitting = false;
let cliLauncherReady = false;

function runtimeFor(light) {
  if (!light.runtime) {
    light.runtime = { agents: new Map(), hasSignal: false, lastSent: "", test: null, stopReason: "" };
  }
  return light.runtime;
}

function normaliseFolder(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  const folder = path.resolve(value);
  return folder.length <= 500 ? folder : "";
}

function addFolder(light, folder) {
  const resolved = normaliseFolder(folder);
  if (!resolved) return false;
  if (!Array.isArray(light.folders)) light.folders = [];
  if (light.folders.includes(resolved)) return false;
  if (light.folders.length >= 24) light.folders.shift();
  light.folders.push(resolved);
  saveConfig();
  return true;
}

function removeFolder(light, folder) {
  const resolved = normaliseFolder(folder);
  if (!resolved || !Array.isArray(light.folders)) return false;
  const before = light.folders.length;
  light.folders = light.folders.filter(item => item !== resolved);
  if (light.folders.length !== before) {
    saveConfig();
    return true;
  }
  return false;
}

function pruneAgents(light) {
  const runtime = runtimeFor(light);
  const now = Date.now();
  for (const [id, agent] of runtime.agents) {
    if (agent.state === "running_terminal") {
      // Terminal commands can run long — keep yellow blinking until done or timeout
      if (now - agent.updatedAt > TERMINAL_TIMEOUT) {
        agent.state = "stopped";
        agent.updatedAt = now;
        light.lastSignal = "red";
      }
    } else if (agent.state === "writing_file" || agent.state === "reading_file") {
      // After a file read or write completes, transition back to steady green thinking
      if (now - agent.updatedAt > 3000) {
        agent.state = "thinking";
        agent.updatedAt = now;
      }
    } else if (agent.state === "thinking" || agent.state === "working") {
      // Keep green while thinking; when agent stops manually or finishes, turn RED
      if (now - agent.updatedAt > THINKING_TIMEOUT) {
        agent.state = "stopped";
        agent.updatedAt = now;
        runtime.stopReason = "cancelled";
        light.lastSignal = "red";
      }
    } else if (now - agent.updatedAt > TEN_MINUTES) {
      runtime.agents.delete(id);
    }
  }
}

function agentDots(light) {
  return [...runtimeFor(light).agents.values()]
    .filter(agent => agent.state !== "stopped" && agent.state !== "finished")
    .sort((left, right) => left.updatedAt - right.updatedAt)
    .slice(-8)
    .map(agent => agent.state);
}

function buildLightState(light) {
  pruneAgents(light);
  const runtime = runtimeFor(light);
  const agents = [...runtime.agents.values()];
  const asking = agents
    .filter(agent => agent.state === "asking")
    .sort((left, right) => right.updatedAt - left.updatedAt)[0];

  let mode = "";
  let blink = false;
  let question = null;
  let agentMode = ""; // fine-grained mode for renderer animations & sounds

  if (asking) {
    mode = "yellow";
    blink = true;
    agentMode = "asking";
    question = asking.question || null;
  } else if (agents.some(agent => agent.state === "running_terminal")) {
    mode = "yellow";
    blink = true;
    agentMode = "terminal";
  } else if (agents.some(agent => agent.state === "writing_file")) {
    mode = "green";
    blink = true;
    agentMode = "writing";
  } else if (agents.some(agent => agent.state === "reading_file")) {
    mode = "green";
    blink = true;
    agentMode = "reading";
  } else if (agents.some(agent => agent.state === "thinking" || agent.state === "working")) {
    mode = "green";
    blink = true;
    agentMode = "thinking";
  } else if (agents.some(agent => agent.state === "error")) {
    mode = "red";
    blink = false;
    agentMode = "error";
  } else if (agents.some(agent => agent.state === "stopped" || agent.state === "finished")) {
    mode = "red";
    blink = false;
    agentMode = runtime.stopReason === "cancelled" ? "cancelled" : "done";
  } else if (agents.length) {
    mode = "red";
    blink = false;
    agentMode = "done";
  } else if (runtime.hasSignal && !light.closed) {
    // Connected but no active agent — idle breathing green
    mode = "green";
    blink = false;
    agentMode = "idle";
  }

  const test = runtime.test && runtime.test.until > Date.now() ? runtime.test : null;
  if (test) {
    mode = test.mode;
    blink = false;
    agentMode = "";
    question = null;
  }

  let status = "Not connected";
  if (light.closed) status = "Light closed";
  else if (runtime.hasSignal) status = "Connected";
  else if (Array.isArray(light.folders) && light.folders.length) status = "Waiting for agent";

  const fileAgent = agents.find(agent => (agent.state === "writing_file" || agent.state === "reading_file") && agent.file);
  const file = fileAgent ? fileAgent.file : "";
  const fileAction = fileAgent ? (fileAgent.state === "writing_file" ? "write" : "read") : "";

  return {
    mode: mode || light.lastSignal || "",
    blink: Boolean(blink),
    agentMode,
    asking: Boolean(asking),
    question,
    file,
    fileAction,
    agents: agentDots(light),
    status,
    connected: status === "Connected"
  };
}

function pushLightState(light) {
  const win = lightWindows.get(light.id);
  if (!win || win.isDestroyed()) return;
  const state = buildLightState(light);
  const signature = JSON.stringify(state);
  const runtime = runtimeFor(light);
  if (signature === runtime.lastSent) return;
  runtime.lastSent = signature;
  // If the window is still loading, defer the push until the page is ready
  if (win.webContents.isLoading()) {
    win.webContents.once("did-finish-load", () => {
      if (!win.isDestroyed()) win.webContents.send("light:signal", state);
    });
    return;
  }
  win.webContents.send("light:signal", state);
}

function connectInfo(light) {
  const launcher = connection.launcherPath();
  return {
    launcher,
    command: `${connection.shellQuote(launcher)} init`,
    folders: Array.isArray(light.folders) ? light.folders.slice() : [],
    status: buildLightState(light).status,
    closed: Boolean(light.closed)
  };
}

function configPath() {
  return path.join(app.getPath("userData"), "lights.json");
}

function portFilePath() {
  return path.join(os.homedir(), ".agentpulse", "port.json");
}

function legacyPortFilePath() {
  return path.join(os.homedir(), ".agentlight", "port.json");
}

function notice() {
  return serverError || readError;
}

function safeName(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 24);
}

function slugify(value) {
  const slug = String(value || "").normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32);
  return slug || "light";
}

function uniqueSlug(name) {
  const root = slugify(name);
  let candidate = root;
  let suffix = 2;
  while (config.lights.some(light => light.slug === candidate)) candidate = `${root}-${suffix++}`;
  return candidate;
}

function readConfig() {
  readError = "";
  try {
    const parsed = JSON.parse(fs.readFileSync(configPath(), "utf8"));
    const seen = new Set();
    config.lights = (Array.isArray(parsed.lights) ? parsed.lights : [])
      .map(item => {
        if (!item || typeof item !== "object") return null;
        const name = safeName(item.name);
        if (!name) return null;
        const id = typeof item.id === "string" && item.id ? item.id : crypto.randomUUID();
        const baseSlug = typeof item.slug === "string" && /^[a-z0-9-]+$/.test(item.slug)
          ? item.slug : slugify(name);
        let slug = baseSlug;
        let suffix = 2;
        while (seen.has(slug)) slug = `${baseSlug}-${suffix++}`;
        seen.add(slug);
        return {
          id,
          name,
          slug,
          secret: /^[a-f0-9]{8}$/.test(item.secret || "") ? item.secret : crypto.randomBytes(4).toString("hex"),
          size: SIZES.includes(item.size) ? item.size : "medium",
          bodyColour: BODY_COLOURS.has(item.bodyColour) ? item.bodyColour : "#1b1e20",
          folders: (Array.isArray(item.folders) ? item.folders : [])
            .map(normaliseFolder)
            .filter((folder, index, list) => folder && list.indexOf(folder) === index)
            .slice(0, 24),
          x: typeof item.x === "number" ? item.x : undefined,
          y: typeof item.y === "number" ? item.y : undefined,
          closed: false,
          lastSignal: ""
        };
      })
      .filter(Boolean);
  } catch (error) {
    if (error.code !== "ENOENT") {
      readError = "Saved lights could not be read. Check app permissions.";
    }
  }
}

function saveConfig() {
  try {
    fs.mkdirSync(path.dirname(configPath()), { recursive: true });
    const lights = config.lights.map(({ id, name, slug, secret, size, bodyColour, folders, x, y }) => ({
      id, name, slug, secret, size, bodyColour,
      folders: Array.isArray(folders) ? folders : [],
      ...(typeof x === "number" ? { x } : {}),
      ...(typeof y === "number" ? { y } : {})
    }));
    fs.writeFileSync(configPath(), JSON.stringify({ version: 1, lights }, null, 2), "utf8");
    readError = "";
    return true;
  } catch {
    return false;
  }
}

function writePortFile() {
  portFileError = "";
  try {
    const payload = JSON.stringify({ port: serverPort, pid: process.pid }, null, 2);
    fs.mkdirSync(path.dirname(portFilePath()), { recursive: true });
    fs.writeFileSync(portFilePath(), payload, "utf8");

    // Also write legacy port file for backward compatibility
    try {
      fs.mkdirSync(path.dirname(legacyPortFilePath()), { recursive: true });
      fs.writeFileSync(legacyPortFilePath(), payload, "utf8");
    } catch { /* Ignore legacy write errors */ }

    return true;
  } catch {
    portFileError = "The local server is running, but its port file could not be saved in ~/.agentpulse.";
    return false;
  }
}

function removePortFile() {
  for (const file of [portFilePath(), legacyPortFilePath()]) {
    try {
      const saved = JSON.parse(fs.readFileSync(file, "utf8"));
      if (saved.pid === process.pid) fs.rmSync(file, { force: true });
    } catch {
      /* Nothing owned by this process to remove. */
    }
  }
}

function windowBounds(width, height, cascadeIndex) {
  const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const { bounds, workArea } = display;
  const offset = cascadeIndex ? cascadeIndex * 18 : 0;
  const x = Math.round(bounds.x + (bounds.width - width) / 2) + offset;
  const y = bounds.y;
  return {
    x: Math.min(Math.max(x, workArea.x + 6), workArea.x + workArea.width - width - 6),
    y
  };
}

function createSetupWindow() {
  if (setupWindow && !setupWindow.isDestroyed()) {
    setupWindow.show();
    setupWindow.focus();
    return setupWindow;
  }
  const width = 420;
  const height = 420;
  setupWindow = new BrowserWindow({
    width,
    height,
    ...windowBounds(width, height, 0),
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    hasShadow: false,
    show: false,
    webPreferences: { nodeIntegration: true, contextIsolation: false, spellcheck: false, autoplayPolicy: "no-user-gesture-required" }
  });
  setupWindow.loadFile("index.html", { query: { mode: "setup" } });
  setupWindow.once("ready-to-show", () => {
    setupWindow.show();
    setupWindow.focus();
  });
  setupWindow.on("closed", () => {
    setupWindow = null;
    if (!config.lights.length && !isQuitting) app.quit();
  });
  return setupWindow;
}

function createLightWindow(light, options = {}) {
  light.closed = false;
  const existing = lightWindows.get(light.id);
  if (existing && !existing.isDestroyed()) {
    existing.show();
    existing.focus();
    pushLightState(light);
    return existing;
  }

  const sizes = options.connect ? CONNECT_SIZES : WINDOW_SIZES;
  const [width, height] = sizes[light.size] || sizes.medium;
  const win = new BrowserWindow({
    width,
    height,
    ...windowBounds(width, height, lightWindows.size),
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    acceptFirstMouse: true,
    show: false,
    webPreferences: { nodeIntegration: true, contextIsolation: false, spellcheck: false, autoplayPolicy: "no-user-gesture-required" }
  });

  light.closed = false;
  lightWindows.set(light.id, win);
  win.setAlwaysOnTop(true, "screen-saver");
  win.loadFile("index.html", {
    query: { mode: "light", id: light.id, ...(options.connect ? { connect: "1" } : {}) }
  });
  win.once("ready-to-show", () => {
    if (typeof light.x === "number" && typeof light.y === "number") {
      win.setPosition(light.x, light.y, false);
    } else {
      const { bounds } = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
      const [w] = win.getSize();
      const x = Math.round(bounds.x + (bounds.width - w) / 2);
      const y = bounds.y;
      light.x = x;
      light.y = y;
      win.setPosition(x, y, false);
      saveConfig();
    }
    win.show();
  });
  win.on("moved", () => {
    const [x, y] = win.getPosition();
    light.x = x;
    light.y = y;
    saveConfig();
    if (!win.isDestroyed()) {
      win.webContents.send("light:moved");
    }
  });
  win.on("closed", () => {
    lightWindows.delete(light.id);
    if (!isQuitting && config.lights.includes(light)) light.closed = true;
  });
  return win;
}

function openSavedLights() {
  config.lights.forEach(light => createLightWindow(light));
}

function showLight(id) {
  const light = config.lights.find(item => item.id === id);
  if (!light) return;
  light.closed = false;
  createLightWindow(light);
}

function respond(response, status, body, contentType = "text/plain; charset=utf-8") {
  response.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });
  response.end(body);
}

function respondJson(response, status, data) {
  respond(response, status, JSON.stringify(data), "application/json; charset=utf-8");
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on("data", chunk => {
      size += chunk.length;
      if (size > 64 * 1024) {
        reject(new Error("request body too large"));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

function routeLight(route, secret, folder) {
  const cleanRoute = String(route || "");
  const cleanSecret = String(secret || "");
  if (cleanRoute && cleanSecret) {
    const match = config.lights.find(item => `${item.slug}-${item.secret}` === cleanRoute && item.secret === cleanSecret);
    if (match) return match;
  }
  if (folder) {
    const norm = normaliseFolder(folder);
    if (norm) {
      const matchFolder = config.lights.find(item => Array.isArray(item.folders) && item.folders.includes(norm));
      if (matchFolder) return matchFolder;
    }
  }
  if (config.lights.length === 1) {
    return config.lights[0];
  }
  return null;
}

function sanitiseQuestion(value) {
  if (!value || typeof value !== "object") return null;
  const questions = (Array.isArray(value.questions) ? value.questions : [])
    .slice(0, 3)
    .map(item => ({
      question: String((item && item.question) || "").slice(0, 600),
      detail: String((item && item.detail) || "").slice(0, 600),
      options: (Array.isArray(item && item.options) ? item.options : [])
        .slice(0, 8)
        .map(option => String(option).slice(0, 200)),
      multi: Boolean(item && item.multi)
    }))
    .filter(item => item.question || item.options.length);
  if (!questions.length) return null;
  return { permission: Boolean(value.permission), questions };
}

function applyAgentSignal(light, body) {
  const runtime = runtimeFor(light);
  runtime.hasSignal = true;
  if (body.folder) addFolder(light, body.folder);

  const folder = normaliseFolder(body.folder);
  const conversationId = typeof body.conversationId === "string" && body.conversationId
    ? body.conversationId.slice(0, 120)
    : (folder ? `folder:${folder}` : "agent");
  const state = AGENT_STATES.has(body.state) ? body.state : "thinking";
  const question = state === "asking" ? sanitiseQuestion(body.question) : null;

  const isTerminal = (
    body.event === "Stop" ||
    body.event === "Cancel" ||
    body.event === "Abort" ||
    state === "stopped" ||
    state === "finished" ||
    state === "error"
  );

  if (isTerminal) {
    // When stopping, manual cancellation, or termination, clear all active working states
    runtime.stopReason = body.reason || (state === "error" ? "error" : (body.event === "Cancel" || body.event === "Abort" ? "cancelled" : "clean"));
    runtime.agents.clear();
    runtime.agents.set(conversationId, {
      state: state === "error" ? "error" : "stopped",
      question: null,
      updatedAt: Date.now()
    });
    light.lastSignal = "red";
    runtime.lastSent = ""; // Guarantee push to renderer
    pushLightState(light);
    return;
  }

  // When a new turn or tool begins, clear any stopped state
  runtime.stopReason = "";
  for (const [id, agent] of runtime.agents) {
    if (agent.state === "stopped" || agent.state === "finished") {
      runtime.agents.delete(id);
    }
  }

  const file = typeof body.file === "string" ? body.file.trim().slice(0, 100) : "";
  runtime.agents.set(conversationId, { state, question, file, updatedAt: Date.now() });
  if (runtime.agents.size > 24) {
    const oldest = [...runtime.agents.entries()].sort((left, right) => left[1].updatedAt - right[1].updatedAt)[0];
    if (oldest) runtime.agents.delete(oldest[0]);
  }
  pushLightState(light);
}

async function handleAgentBody(request, response, action) {
  if (request.method !== "POST") return respond(response, 405, "method not allowed");
  let body;
  try {
    body = JSON.parse(await readBody(request));
  } catch {
    return respond(response, 400, "bad request");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return respond(response, 400, "bad request");

  const light = routeLight(body.route, body.secret, body.folder);
  if (!light) return respond(response, 410, "light closed");
  if (action === "signal") {
    if (light.closed) {
      light.closed = false;
      createLightWindow(light);
    }
    applyAgentSignal(light, body);
    return respond(response, 200, "ok");
  }
  if (action === "connect") {
    light.closed = false;
    createLightWindow(light);
    addFolder(light, body.folder);
    pushLightState(light);
    return respond(response, 200, "ok");
  }
  if (action === "disconnect" || action === "off") {
    removeFolder(light, body.folder);
    light.closed = true;
    const win = lightWindows.get(light.id);
    if (win && !win.isDestroyed()) {
      win.destroy();
      lightWindows.delete(light.id);
    }
    pushLightState(light);
    return respond(response, 200, "ok");
  }
  return respond(response, 404, "not found");
}

function handleLegacySignal(request, response, parts) {
  if (request.method !== "GET") return respond(response, 405, "method not allowed");
  const [route, colour] = parts;
  const light = config.lights.find(item => `${item.slug}-${item.secret}` === route);
  if (!light || !["red", "yellow", "green"].includes(colour)) {
    return respond(response, 404, "unknown light or colour");
  }
  const win = lightWindows.get(light.id);
  if (light.closed || !win || win.isDestroyed()) return respond(response, 410, "light closed");
  light.lastSignal = colour;
  pushLightState(light);
  respond(response, 200, `ok ${colour}`);
}

async function handleRequest(request, response) {
  let url;
  try {
    url = new URL(request.url, "http://127.0.0.1");
  } catch {
    return respond(response, 400, "bad request");
  }
  const parts = url.pathname.split("/").filter(Boolean);

  if (parts[0] === "_agentpulse" || parts[0] === "_agentlight") {
    if (parts.length === 2 && parts[1] === "lights" && request.method === "GET") {
      return respondJson(response, 200, {
        lights: config.lights.map(light => ({
          id: light.id,
          name: light.name,
          slug: light.slug,
          secret: light.secret,
          route: `${light.slug}-${light.secret}`,
          closed: Boolean(light.closed)
        }))
      });
    }
    if (parts.length === 2 && (parts[1] === "show" || parts[1] === "start")) {
      readConfig();
      ensureDefaultLight();
      openSavedLights();
      return respond(response, 200, "ok");
    }
    if (parts.length === 2 && parts[1] === "off") {
      for (const [id, win] of lightWindows) {
        if (win && !win.isDestroyed()) {
          win.destroy();
        }
      }
      lightWindows.clear();
      config.lights.forEach(light => { light.closed = true; });
      return respond(response, 200, "ok");
    }
    if (parts.length === 2 && parts[1] === "stop") {
      let body = {};
      try { body = JSON.parse(await readBody(request)); } catch {}
      const light = routeLight(body.route, body.secret, body.folder) || (config.lights.length ? config.lights[0] : null);
      if (light) {
        if (light.closed) {
          light.closed = false;
          const newWin = createLightWindow(light);
          // Window was closed — wait for it to load before pushing the red state
          const pushWhenReady = () => {
            applyAgentSignal(light, { ...body, event: "Stop", state: "stopped" });
          };
          if (newWin.webContents.isLoading()) {
            newWin.webContents.once("did-finish-load", pushWhenReady);
          } else {
            pushWhenReady();
          }
        } else {
          applyAgentSignal(light, { ...body, event: "Stop", state: "stopped" });
        }
        return respond(response, 200, "ok");
      }
      return respond(response, 404, "not found");
    }
    if (parts.length === 2 && ["signal", "connect", "disconnect", "off", "stop"].includes(parts[1])) {
      return handleAgentBody(request, response, parts[1]);
    }
    return respond(response, 404, "not found");
  }

  return handleLegacySignal(request, response, parts);
}

function listenOnce() {
  return new Promise((resolve, reject) => {
    const nextServer = http.createServer((request, response) => {
      handleRequest(request, response).catch(() => {
        if (!response.headersSent) respond(response, 500, "server error");
      });
    });
    const onError = error => {
      nextServer.removeListener("listening", onListening);
      reject(error);
    };
    const onListening = () => {
      nextServer.removeListener("error", onError);
      server = nextServer;
      serverPort = nextServer.address().port;
      resolve();
    };
    nextServer.once("error", onError);
    nextServer.once("listening", onListening);
    nextServer.listen(0, "127.0.0.1");
  });
}

async function startServer() {
  if (server && server.listening) return true;
  serverError = "";
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await listenOnce();
      server.on("error", () => {
        serverError = "The local server stopped unexpectedly.";
      });
      writePortFile();
      return true;
    } catch {
      if (server) {
        try { server.close(); } catch { /* Already closed. */ }
        server = null;
        serverPort = null;
      }
    }
  }
  serverError = "The local server could not start. Try again.";
  return false;
}

function trayIcon() {
  const size = 32;
  const buffer = Buffer.alloc(size * size * 4);
  const paint = (x, y, source) => {
    const index = (y * size + x) * 4;
    const dstAlpha = buffer[index + 3] / 255;
    const outAlpha = source.a + dstAlpha * (1 - source.a);
    if (outAlpha <= 0) return;
    const channel = key => Math.round(
      (source[key] * source.a + buffer[index + key] * dstAlpha * (1 - source.a)) / outAlpha
    );
    buffer[index] = channel("b");
    buffer[index + 1] = channel("g");
    buffer[index + 2] = channel("r");
    buffer[index + 3] = Math.round(outAlpha * 255);
  };
  const cover = (px, py, shape) => {
    let hits = 0;
    for (const dx of [-0.25, 0.25]) {
      for (const dy of [-0.25, 0.25]) {
        if (shape(px + dx, py + dy)) hits += 1;
      }
    }
    return hits / 4;
  };

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const alpha = cover(x + 0.5, y + 0.5, (px, py) => Math.hypot(px - 16, py - 16) <= 14);
      if (alpha) paint(x, y, { a: alpha, r: 26, g: 31, b: 33 });
    }
  }

  const dots = [
    [8, 16, 198, 72, 65],
    [16, 16, 205, 150, 49],
    [24, 16, 62, 133, 92]
  ];
  dots.forEach(([cx, cy, r, g, b]) => {
    for (let y = Math.floor(cy - 6); y <= Math.ceil(cy + 6); y += 1) {
      for (let x = Math.floor(cx - 6); x <= Math.ceil(cx + 6); x += 1) {
        if (x < 0 || y < 0 || x >= size || y >= size) continue;
        const alpha = cover(x + 0.5, y + 0.5, (px, py) => Math.hypot(px - cx, py - cy) <= 4.4);
        if (alpha) paint(x, y, { a: alpha, r, g, b });
      }
    }
  });

  return nativeImage.createFromBitmap(buffer, { width: size, height: size, scaleFactor: 2 });
}

function cliScriptPath() {
  return path.join(__dirname, "agentpulse.js");
}

function ensureCliLauncher() {
  const result = connection.ensureLauncher(process.execPath, cliScriptPath(), true);
  cliLauncherReady = result.ok;
  return result;
}

function pathHasDir(dir) {
  const wanted = path.resolve(dir).toLowerCase();
  return String(process.env.PATH || "").split(path.delimiter)
    .filter(Boolean)
    .some(entry => path.resolve(entry).toLowerCase() === wanted);
}

function installCliCommand(notify) {
  ensureCliLauncher();
  const launcher = connection.launcherPath();
  const binDir = path.dirname(launcher);

  const report = (added, error = "") => {
    if (!notify) return;
    const detail = added
      ? "The command is on your PATH. Open a new terminal and run:\n\nagentpulse init"
      : `The command is ready at:\n${launcher}\n\nTo run it by name from a terminal, add this folder to PATH:\n${binDir}`;
    dialog.showMessageBox({
      type: error ? "warning" : "info",
      title: "AgentPulse",
      message: added ? "agentpulse command installed" : "agentpulse command ready",
      detail: error ? `${detail}\n\n${error}` : detail
    });
  };

  if (pathHasDir(binDir)) return report(true);

  if (process.platform === "win32") {
    const escaped = binDir.replace(/'/g, "''");
    const script = `$d='${escaped}'; $p=[Environment]::GetEnvironmentVariable('Path','User'); if ($null -eq $p) { $p='' }; if (($p -split ';') -notcontains $d) { [Environment]::SetEnvironmentVariable('Path', (($p.TrimEnd(';') + ';' + $d).TrimStart(';')), 'User') }`;
    execFile("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], {
      timeout: 8000,
      windowsHide: true
    }, error => {
      report(!error, error ? "The user PATH could not be updated automatically." : "");
    });
    return;
  }

  const candidates = [path.join(os.homedir(), ".local", "bin"), "/usr/local/bin"];
  for (const dir of candidates) {
    if (!pathHasDir(dir)) continue;
    try {
      fs.mkdirSync(dir, { recursive: true });
      const target = path.join(dir, "agentpulse");
      try { fs.rmSync(target, { force: true }); } catch { /* Replace the old link. */ }
      fs.symlinkSync(launcher, target);
      return report(true);
    } catch { /* Try the next PATH folder. */ }
  }
  report(false);
}

function lightRoute(light) {
  return `${light.slug}-${light.secret}`;
}

function connectFolderToLight(light, folder, options = {}) {
  const launcher = ensureCliLauncher();
  if (!launcher.ok) {
    throw new Error(`The agentpulse command could not be created at ${launcher.path}. Check the permissions of your home folder.`);
  }
  const commandFor = eventName => connection.commandForEvent(launcher.path, eventName);
  return connection.connectFolder(folder, {
    name: light.name,
    route: lightRoute(light),
    secret: light.secret
  }, commandFor, options);
}

function openLightConnect(id) {
  const light = config.lights.find(item => item.id === id);
  if (!light) return;
  light.closed = false;
  const win = createLightWindow(light);
  const send = () => {
    if (!win.isDestroyed()) win.webContents.send("light:open-connect");
  };
  if (win.webContents.isLoading()) win.webContents.once("did-finish-load", send);
  else send();
}

function testLight(id) {
  const light = config.lights.find(item => item.id === id);
  if (!light || light.closed) return false;
  const runtime = runtimeFor(light);
  [["green", 0], ["yellow", 900], ["red", 1800]].forEach(([mode, delay]) => {
    setTimeout(() => {
      if (!config.lights.includes(light)) return;
      runtime.test = { mode, until: Date.now() + 900 };
      pushLightState(light);
    }, delay);
  });
  setTimeout(() => {
    if (!config.lights.includes(light)) return;
    runtime.test = null;
    pushLightState(light);
  }, 2750);
  return true;
}

function removeConnection(light, folder, parent) {
  const options = {
    type: "warning",
    buttons: ["Remove connection", "Cancel"],
    defaultId: 1,
    cancelId: 1,
    title: "Remove connection",
    message: `Remove the connection from “${path.basename(folder) || folder}”?`,
    detail: "The light and the folder stay. Only the agentpulse hook and connection file are removed from that folder."
  };
  const choice = parent && !parent.isDestroyed()
    ? dialog.showMessageBoxSync(parent, options)
    : dialog.showMessageBoxSync(options);
  if (choice !== 0) return { ok: false, canceled: true };

  try {
    connection.disconnectFolder(folder);
  } catch (error) {
    return {
      ok: false,
      error: error.code === "INVALID_HOOKS"
        ? "The hooks file is not valid JSON. Nothing was changed."
        : (error.message || "The connection could not be removed.")
    };
  }
  removeFolder(light, folder);
  pushLightState(light);
  refreshTrayMenu();
  return { ok: true };
}

function deleteLight(id, parent) {
  const light = config.lights.find(item => item.id === id);
  if (!light) return;
  const options = {
    type: "warning",
    buttons: ["Delete light", "Cancel"],
    defaultId: 1,
    cancelId: 1,
    title: "Delete light",
    message: `Delete “${light.name}”?`,
    detail: "Its links stop working and the light is removed from this computer."
  };
  const choice = parent && !parent.isDestroyed()
    ? dialog.showMessageBoxSync(parent, options)
    : dialog.showMessageBoxSync(options);
  if (choice !== 0) return;

  const win = lightWindows.get(id);
  if (win && !win.isDestroyed()) win.destroy();
  config.lights = config.lights.filter(item => item.id !== id);
  if (!saveConfig()) {
    dialog.showErrorBox("AgentPulse", "The light could not be removed from the config file. Check the app data folder permissions.");
  }
  refreshTrayMenu();
  if (!config.lights.length) createSetupWindow();
}

function refreshTrayMenu() {
  if (!tray) return;
  const template = [
    { label: "New light", click: () => createSetupWindow() },
    { type: "separator" }
  ];
  if (!config.lights.length) {
    template.push({ label: "No saved lights", enabled: false });
  } else {
    config.lights.forEach(light => {
      const submenu = [
        { label: "Show light", click: () => showLight(light.id) },
        { label: "Connect folder\u2026", click: () => openLightConnect(light.id) },
        { label: "Test light", click: () => testLight(light.id) }
      ];
      if (Array.isArray(light.folders) && light.folders.length) {
        submenu.push({
          label: "Remove connection",
          submenu: light.folders.map(folder => ({
            label: path.basename(folder) || folder,
            submenu: [{
              label: "Remove\u2026",
              click: () => removeConnection(light, folder, setupWindow || lightWindows.get(light.id))
            }]
          }))
        });
      }
      submenu.push({ type: "separator" });
      submenu.push({
        label: "Delete light",
        click: () => deleteLight(light.id, setupWindow || lightWindows.get(light.id))
      });
      template.push({ label: light.name, submenu });
    });
  }
  template.push({ type: "separator" });
  template.push({
    label: "Install agentpulse command\u2026",
    click: () => installCliCommand(true)
  });
  template.push({
    label: "Quit AgentPulse",
    click: () => {
      isQuitting = true;
      app.quit();
    }
  });
  tray.setContextMenu(Menu.buildFromTemplate(template));
}

function createTray() {
  tray = new Tray(trayIcon());
  tray.setToolTip("AgentPulse");
  refreshTrayMenu();
  tray.on("click", () => openSavedLights());
}

ipcMain.handle("app:bootstrap", event => {
  const query = new URL(event.sender.getURL()).searchParams;
  const mode = query.get("mode") === "light" ? "light" : "setup";
  const light = config.lights.find(item => item.id === query.get("id")) || null;
  return {
    mode,
    light: light ? {
      id: light.id,
      name: light.name,
      slug: light.slug,
      secret: light.secret,
      size: light.size,
      bodyColour: light.bodyColour,
      lastSignal: light.lastSignal || ""
    } : null,
    state: light ? buildLightState(light) : null,
    connect: light ? connectInfo(light) : null,
    openConnect: mode === "light" && query.get("connect") === "1",
    serverPort,
    serverReady: Boolean(server && server.listening),
    notice: notice(),
    savedSlugs: config.lights.map(item => item.slug)
  };
});

ipcMain.handle("setup:generate", async (_event, draft) => {
  const name = safeName(draft?.name);
  if (!name) return { ok: false, error: "Enter a name to enable Generate." };
  if (!BODY_COLOURS.has(draft?.bodyColour)) return { ok: false, error: "Choose one of the preset body colours." };
  const size = SIZES.includes(draft?.size) ? draft.size : "medium";

  if (!(server && server.listening)) {
    const started = await startServer();
    if (!started) return { ok: false, error: "The local server could not start. Try again." };
  }

  const light = {
    id: crypto.randomUUID(),
    name,
    slug: uniqueSlug(name),
    secret: crypto.randomBytes(4).toString("hex"),
    size,
    bodyColour: draft.bodyColour,
    folders: [],
    closed: false,
    lastSignal: ""
  };
  config.lights.push(light);
  if (!saveConfig()) {
    config.lights = config.lights.filter(item => item.id !== light.id);
    return { ok: false, error: "This light could not be saved. Check app permissions." };
  }

  refreshTrayMenu();
  createLightWindow(light, { connect: true });
  if (setupWindow && !setupWindow.isDestroyed()) setupWindow.close();
  return { ok: true, slug: light.slug, id: light.id };
});

ipcMain.handle("setup:close", () => {
  if (setupWindow && !setupWindow.isDestroyed()) setupWindow.close();
});

ipcMain.handle("light:new", () => {
  createSetupWindow();
});

ipcMain.handle("light:copy", (_event, text) => {
  clipboard.writeText(String(text || ""));
});

ipcMain.handle("light:close", (_event, id) => {
  const light = config.lights.find(item => item.id === id);
  const win = lightWindows.get(id);
  if (light) light.closed = true;
  if (win && !win.isDestroyed()) win.destroy();
});

ipcMain.handle("light:manual-stop", (_event, id) => {
  const light = config.lights.find(item => item.id === id) || (config.lights.length ? config.lights[0] : null);
  if (!light) return { ok: false };
  applyAgentSignal(light, { event: "Stop", state: "stopped", reason: "cancelled" });
  return { ok: true };
});

ipcMain.handle("light:state", (_event, id) => {
  const light = config.lights.find(item => item.id === id);
  return light ? buildLightState(light) : null;
});

ipcMain.handle("light:resize", (event, height) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win || win.isDestroyed()) return;
  const requested = Math.round(Number(height));
  if (!Number.isFinite(requested)) return;
  const target = Math.min(700, Math.max(45, requested));
  const [width, current] = win.getContentSize();
  if (Math.abs(current - target) < 2) return;
  win.setResizable(true);
  win.setContentSize(width, target);
  win.setResizable(false);
  const bounds = win.getBounds();
  const display = screen.getDisplayMatching(bounds);
  const maxBottom = display.workArea.y + display.workArea.height - 6;
  if (bounds.y + bounds.height > maxBottom) {
    const nextY = Math.max(display.workArea.y + 6, maxBottom - bounds.height);
    win.setBounds({ ...bounds, y: nextY });
    const id = [...lightWindows.entries()].find(([_, w]) => w === win)?.[0];
    if (id) {
      const light = config.lights.find(l => l.id === id);
      if (light) {
        light.y = nextY;
        saveConfig();
      }
    }
  }
});

ipcMain.handle("light:move-by", (event, { deltaX, deltaY }) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win || win.isDestroyed()) return;
  const [x, y] = win.getPosition();
  const nextX = Math.round(x + deltaX);
  const nextY = Math.round(y + deltaY);
  win.setPosition(nextX, nextY, false);
  const id = [...lightWindows.entries()].find(([_, w]) => w === win)?.[0];
  if (id) {
    const light = config.lights.find(l => l.id === id);
    if (light) {
      light.x = nextX;
      light.y = nextY;
    }
  }
});

ipcMain.handle("light:save-position", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win || win.isDestroyed()) return;
  const [x, y] = win.getPosition();
  const id = [...lightWindows.entries()].find(([_, w]) => w === win)?.[0];
  if (id) {
    const light = config.lights.find(l => l.id === id);
    if (light) {
      light.x = x;
      light.y = y;
      saveConfig();
    }
  }
});

ipcMain.on("sound:mute-sync", (event, isMuted) => {
  for (const win of lightWindows.values()) {
    if (win && !win.isDestroyed() && win.webContents !== event.sender) {
      win.webContents.send("sound:mute-sync", isMuted);
    }
  }
});

ipcMain.handle("connect:info", (_event, id) => {
  const light = config.lights.find(item => item.id === id);
  return light ? connectInfo(light) : null;
});

ipcMain.handle("connect:choose", async (event, id) => {
  const light = config.lights.find(item => item.id === id);
  if (!light) return { ok: false, error: "This light is no longer saved." };
  if (light.closed) return { ok: false, error: "Open the light before connecting a folder." };

  const parent = BrowserWindow.fromWebContents(event.sender);
  const picked = await dialog.showOpenDialog(parent, {
    title: "Connect a folder",
    buttonLabel: "Connect",
    properties: ["openDirectory", "createDirectory"]
  });
  if (picked.canceled || !picked.filePaths.length) return { ok: false, canceled: true };

  const folder = path.resolve(picked.filePaths[0]);
  const existing = connection.readConnection(folder);
  if (existing && !existing.broken && existing.route !== lightRoute(light)) {
    const choice = dialog.showMessageBoxSync(parent, {
      type: "warning",
      buttons: ["Replace connection", "Cancel"],
      defaultId: 1,
      cancelId: 1,
      title: "Folder already connected",
      message: `This folder is connected to “${existing.name || "another light"}”.`,
      detail: `Connect it to “${light.name}” instead? The previous connection is replaced.`
    });
    if (choice !== 0) return { ok: false, canceled: true };
  } else if (existing && existing.broken) {
    const choice = dialog.showMessageBoxSync(parent, {
      type: "warning",
      buttons: ["Replace connection", "Cancel"],
      defaultId: 1,
      cancelId: 1,
      title: "Connection file unreadable",
      message: "This folder has an unreadable .agentpulse file.",
      detail: `Replace it with a connection to “${light.name}”?`
    });
    if (choice !== 0) return { ok: false, canceled: true };
  }

  const attach = backup => {
    const result = connectFolderToLight(light, folder, backup ? { backup: true } : {});
    addFolder(light, folder);
    pushLightState(light);
    refreshTrayMenu();
    return {
      ok: true,
      folder,
      hooksFile: result.hooks.file,
      backup: result.hooks.backup || "",
      exclude: result.exclude
    };
  };

  try {
    return attach(false);
  } catch (error) {
    if (error.code !== "INVALID_HOOKS") {
      return { ok: false, error: error.message || "The folder could not be connected." };
    }
    const choice = dialog.showMessageBoxSync(parent, {
      type: "warning",
      buttons: ["Back up and start fresh", "Cancel"],
      defaultId: 1,
      cancelId: 1,
      title: "Hooks file is not valid JSON",
      message: ".agents/hooks.json could not be read.",
      detail: `${error.file}\n\nNothing was changed. Move the file aside and start a fresh hooks file? A backup is kept next to it.`
    });
    if (choice !== 0) {
      return { ok: false, error: "The folder was not connected. Fix .agents/hooks.json and try again." };
    }
    try {
      return attach(true);
    } catch (secondError) {
      return { ok: false, error: secondError.message || "The folder could not be connected." };
    }
  }
});

ipcMain.handle("connect:remove", (event, id, folder) => {
  const light = config.lights.find(item => item.id === id);
  if (!light) return { ok: false, error: "This light is no longer saved." };
  return removeConnection(light, folder, BrowserWindow.fromWebContents(event.sender));
});

ipcMain.handle("connect:test", (_event, id) => {
  return { ok: testLight(id) };
});

ipcMain.handle("light:delete", (event, id) => {
  deleteLight(id, BrowserWindow.fromWebContents(event.sender) || undefined);
});

function ensureDefaultLight() {
  if (!Array.isArray(config.lights) || config.lights.length === 0) {
    const defaultLight = {
      id: crypto.randomUUID(),
      name: "Pulse",
      slug: "agent-pulse",
      secret: crypto.randomBytes(4).toString("hex"),
      size: "medium",
      bodyColour: "#1b1e20",
      folders: [],
      closed: false,
      lastSignal: ""
    };
    config.lights = [defaultLight];
    saveConfig();
  }
}

app.whenReady().then(async () => {
  readConfig();
  ensureDefaultLight();
  ensureCliLauncher();
  await startServer();
  createTray();
  openSavedLights();

  setInterval(() => {
    config.lights.forEach(light => pushLightState(light));
  }, 60 * 1000);

  // Watchdog: check every 500ms if any green/active agent has gone silent.
  // When an agent stops or is manually cancelled by the user, hooks stop firing.
  // After ACTIVE_TIMEOUT without active events, this flips the light to solid RED immediately!
  setInterval(() => {
    config.lights.forEach(light => {
      const runtime = runtimeFor(light);
      if (!runtime.hasSignal && !runtime.agents.size) return;
      pushLightState(light);
    });
  }, 500);

  setTimeout(() => installCliCommand(false), 1200);

  const problems = [serverError, readError, portFileError].filter(Boolean);
  if (problems.length) dialog.showErrorBox("AgentPulse", problems.join("\n\n"));
});

app.on("activate", () => {
  ensureDefaultLight();
  openSavedLights();
});

app.on("before-quit", () => {
  isQuitting = true;
  if (server) {
    if (typeof server.closeAllConnections === "function") server.closeAllConnections();
    server.close();
  }
  removePortFile();
});

app.on("window-all-closed", () => {
  if (!config.lights.length) app.quit();
});
