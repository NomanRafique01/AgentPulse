# AgentPulse ⚡

> Real-time desktop status light & signals for AI coding agents.

AgentPulse gives your coding agent an ambient desktop presence. It silently floats at the top of your workspace, reflecting agent thought, tool execution, terminal activity, and user questions in real-time.

---

## ⚡ 1-Command Installation

No installer wizards. No desktop icons. No Start Menu clutter. AgentPulse installs silently into your system PATH.

### Windows (PowerShell)
```powershell
irm https://raw.githubusercontent.com/NomanRafique01/AgentPulse/main/install.ps1 | iex
```

### macOS & Linux (Terminal)
```bash
curl -fsSL https://raw.githubusercontent.com/NomanRafique01/AgentPulse/main/install.sh | bash
```

---

## 🚀 Quick Start

### 1. Connect Any Project
Navigate into your repository and run:
```bash
agentpulse init
```
This automatically assigns a unique signal identifier to the project and activates `.agents/hooks.json`.

### 2. Summon the Signal
Start the light anytime with:
```bash
agentpulse start
```

### 3. Deactivate Hooks
To turn off the signal and cleanly detach hooks:
```bash
agentpulse off
```

### 4. Uninstall
To completely remove AgentPulse and clean your PATH:
```bash
agentpulse uninstall
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

## 📦 Releases

Pre-built standalone binaries are available on the [GitHub Releases](https://github.com/NomanRafique01/AgentPulse/releases) page.
