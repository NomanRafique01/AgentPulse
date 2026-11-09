# AgentPulse ⚡

> Real-time desktop status light & signals for AI coding agents.

AgentPulse gives your coding agent an ambient desktop presence. It silently floats at the top of your workspace, reflecting agent thought, tool execution, terminal activity, and user questions in real-time.

---

## ⚡ Quick Install (npm)

You can run AgentPulse directly or install it globally via npm (only **34 kB**!):

```bash
npm install -g agentpulse
```

Or run directly without installing:
```bash
npx agentpulse init
```

---

## 🚀 Commands

### 1. Connect Any Project
In any project or repository folder, run:
```bash
agentpulse init
```
- Assigns a unique, isolated signal to this project.
- Activates `.agents/hooks.json` automatically.
- Summons the floating signal widget immediately.

### 2. Summon Signal Anytime
```bash
agentpulse start
```
Summons the desktop signal widget without modifying hooks.

### 3. Deactivate Signal & Clean Hooks
```bash
agentpulse off
```
Deactivates the project signal and cleanly removes `.agents/hooks.json`.

### 4. Uninstall
```bash
agentpulse uninstall
npm uninstall -g agentpulse
```

---

## 🚦 Signals & Lamp States

| State | Color | Behavior | Description |
|---|---|---|---|
| **Thinking / Working** | 🟢 Green | Steady glow | Agent is generating or planning |
| **Writing / File Edits** | 🟢 Green | Fast pulse | Agent is writing or modifying code |
| **Running Terminal** | 🟡 Yellow | Steady glow | Shell / command execution |
| **Waiting on User** | 🟡 Yellow | Blinking | Question or permission requested |
| **Error** | 🔴 Red | Alert blink | Command or tool failed |
| **Finished / Idle** | ⚪ Off | Gentle fade | Task complete |

---

## 📦 How to Publish to npm

To publish this package so anyone worldwide can install it:

1. In terminal, login to npm (if not already logged in):
   ```bash
   npm login
   ```
2. Publish:
   ```bash
   npm publish --access public
   ```
