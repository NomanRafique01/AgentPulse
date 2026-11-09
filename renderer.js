const React = require("react");
const { createRoot } = require("react-dom/client");
const { ipcRenderer } = require("electron");

const h = React.createElement;

const SIZE_OPTIONS = [
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" }
];

const COLOUR_OPTIONS = [
  { value: "#1b1e20", label: "Black" },
  { value: "#e9e8e2", label: "White" },
  { value: "#2f5573", label: "Blue" },
  { value: "#5f4a72", label: "Purple" },
  { value: "#a95a2c", label: "Orange" },
  { value: "#3c5e4a", label: "Green" },
  { value: "#7e3b3c", label: "Red" },
  { value: "#6d7479", label: "Grey" }
];

const LAMPS = [
  { id: "red", label: "Red" },
  { id: "yellow", label: "Yellow" },
  { id: "green", label: "Green" }
];

function slugify(value) {
  const slug = String(value || "").normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32);
  return slug || "light";
}

function contrastInk(hex) {
  const value = parseInt(hex.slice(1), 16);
  const channel = raw => {
    const next = raw / 255;
    return next <= 0.04045 ? next / 12.92 : Math.pow((next + 0.055) / 1.055, 2.4);
  };
  const luminance = 0.2126 * channel((value >> 16) & 255)
    + 0.7152 * channel((value >> 8) & 255)
    + 0.0722 * channel(value & 255);
  return luminance > 0.36
    ? { ink: "#151918", edge: "rgba(12, 16, 16, .28)", light: true }
    : { ink: "#eef0ea", edge: "rgba(255, 255, 255, .2)", light: false };
}

function baseName(folder) {
  const parts = String(folder || "").split(/[\\/]/).filter(Boolean);
  return parts[parts.length - 1] || String(folder || "");
}

function Signal({ name, size, bodyColour, mode, blink, agentMode, agents, onClick, active, muted, volume, draggable, onToggleDrag, onToggleMute, onVolumeChange, onManualStop }) {
  const tone = contrastInk(bodyColour);
  const activeLabel = mode ? (LAMPS.find(lamp => lamp.id === mode) || {}).label || "" : "";
  const label = mode
    ? `${name || "AgentPulse"}, ${activeLabel}${blink ? " blinking" : " lit"}`
    : `${name || "AgentPulse"}, all bulbs off`;
  const volumePct = Math.round((Number(volume) || 0) * 100);

  const getAnimationClass = (lampId) => {
    if (mode !== lampId) return "";
    if (agentMode === "idle" && lampId === "green") return " is-breathe";
    if (agentMode === "writing" && lampId === "green") return " is-blink-write";
    if (agentMode === "reading" && lampId === "green") return " is-blink-read";
    if (agentMode === "cancelled" && lampId === "red") return " is-arrive-cancel";
    if (agentMode === "done" && lampId === "red") return " is-arrive";
    if (agentMode === "error" && lampId === "red") return " is-blink is-error";
    if (blink) return " is-blink";
    return "";
  };

  return h("div", {
    className: `signal signal-${size}${active ? " is-active" : ""}${onClick ? " is-interactive" : ""}${draggable ? " is-draggable" : ""}`,
    style: { "--body": bodyColour, "--ink": tone.ink, "--edge": tone.edge },
    role: onClick ? "button" : "img",
    tabIndex: onClick ? 0 : undefined,
    "aria-label": onClick ? `${label}. Click to toggle controls.` : label,
    "aria-expanded": onClick ? active : undefined,
    title: draggable
      ? "Dragging enabled — drag light anywhere on screen"
      : onClick
        ? (active ? "Click lenses to close controls panel" : "Click to open controls panel")
        : undefined,
    onClick,
    onKeyDown: onClick ? (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    } : undefined
  },
    h("div", { className: "lens-row" },
      LAMPS.map(lamp => h("div", {
        key: lamp.id,
        className: `lens lens-${lamp.id}${mode === lamp.id ? " is-on" : ""}${getAnimationClass(lamp.id)}`,
        onClick: lamp.id === "red" && (mode === "green" || mode === "yellow" || (mode === "red" && blink))
          ? (e) => {
              e.stopPropagation();
              if (onManualStop) onManualStop();
            }
          : undefined,
        title: lamp.id === "red" && (mode === "green" || mode === "yellow" || (mode === "red" && blink))
          ? "Stop agent execution (turn RED)"
          : undefined,
        style: lamp.id === "red" && (mode === "green" || mode === "yellow" || (mode === "red" && blink))
          ? { cursor: "pointer" }
          : undefined
      },
        h("span", { className: "lens-bloom", "aria-hidden": "true" }),
        h("span", { className: "leds" },
          h("span", { className: "lit" }),
          h("span", { className: "sheen" })
        )
      ))
    ),
    h("div", { className: "plate-row" },
      h("span", { className: "signal-plate", title: name || undefined }, name || "\u00a0"),
      agents && agents.length
        ? h("span", {
          className: "agent-dots",
          title: `${agents.length} active agent${agents.length === 1 ? "" : "s"}`,
          "aria-hidden": "true"
        }, agents.map((state, index) => h("i", { key: `${index}-${state}`, className: `agent-dot is-${state}` })))
        : null
    ),
    active ? h("div", { className: "signal-divider", "aria-hidden": "true" }) : null,
    active ? h("div", {
      className: "signal-sound-bay",
      onClick: (e) => e.stopPropagation()
    },
      h("button", {
        className: `signal-drag-btn${draggable ? " is-active" : ""}`,
        type: "button",
        onClick: onToggleDrag,
        onPointerDown: (e) => e.stopPropagation(),
        onMouseDown: (e) => e.stopPropagation(),
        title: draggable ? "Click to lock position" : "Click to drag light anywhere on screen",
        "aria-label": draggable ? "Lock light position" : "Drag light anywhere"
      },
        h("span", { className: "signal-drag-icon", "aria-hidden": "true" },
          h("svg", {
            width: "14",
            height: "14",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2.2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          },
            h("path", { d: "M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v14" }),
            h("path", { d: "M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v16" }),
            h("path", { d: "M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" }),
            h("path", { d: "M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" })
          )
        ),
        h("span", { className: "signal-drag-text" }, draggable ? "Lock Position" : "Drag Light")
      ),
      h("button", {
        className: `signal-mute-btn${muted ? " is-muted" : ""}`,
        type: "button",
        onClick: onToggleMute,
        title: muted ? "Click to unmute agent sound" : "Click to mute agent sound",
        "aria-label": muted ? "Unmute agent sound" : "Agent sound"
      },
        h("span", { className: "signal-mute-icon", "aria-hidden": "true" },
          muted
            ? h("svg", {
              width: "14",
              height: "14",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2.2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            },
              h("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
              h("line", { x1: "23", y1: "9", x2: "17", y2: "15" }),
              h("line", { x1: "17", y1: "9", x2: "23", y2: "15" })
            )
            : h("svg", {
              width: "14",
              height: "14",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2.2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            },
              h("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
              h("path", { d: "M15.54 8.46a5 5 0 0 1 0 7.07" }),
              h("path", { d: "M19.07 4.93a10 10 0 0 1 0 14.14" })
            )
        ),
        h("span", { className: "signal-mute-text" }, muted ? "Unmute Audio" : "Agent Sound")
      ),
      h("div", { className: "signal-vol-row" },
        h("input", {
          className: "signal-slider",
          type: "range",
          min: 0,
          max: 1,
          step: 0.05,
          value: volume,
          disabled: muted,
          style: { "--fill": `${volumePct}%` },
          "aria-label": "Agent sound volume",
          "aria-valuetext": `${volumePct}%`,
          onChange: onVolumeChange
        }),
        h("span", { className: "signal-vol-val", title: `Agent sound: ${volumePct}%` }, `${volumePct}%`)
      )
    ) : null
  );
}

function SetupScreen({ boot }) {
  const [name, setName] = React.useState("");
  const [sizeIndex, setSizeIndex] = React.useState(1);
  const [bodyColour, setBodyColour] = React.useState(COLOUR_OPTIONS[0].value);
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    const onKey = event => {
      if (event.key === "Escape") ipcRenderer.invoke("setup:close");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const trimmed = name.trim();
  const size = SIZE_OPTIONS[sizeIndex].id;
  const colour = COLOUR_OPTIONS.find(option => option.value === bodyColour) || COLOUR_OPTIONS[0];
  const savedSlugs = React.useMemo(() => new Set(boot.savedSlugs || []), [boot.savedSlugs]);
  const duplicate = Boolean(trimmed) && savedSlugs.has(slugify(trimmed));

  let status = "";
  let tone = "muted";
  if (error) {
    status = error;
    tone = "error";
  } else if (boot.notice) {
    status = boot.notice;
    tone = "notice";
  } else if (!trimmed) {
    status = "Give this light a name to continue.";
  } else if (duplicate) {
    status = "Name in use. Its link will add a number.";
    tone = "notice";
  }

  async function submit(event) {
    event.preventDefault();
    if (!trimmed || saving) return;
    setSaving(true);
    setError("");
    const result = await ipcRenderer.invoke("setup:generate", { name: trimmed, size, bodyColour });
    if (!result.ok) {
      setError(result.error || "The light could not be created.");
      setSaving(false);
    }
  }

  function updateName(event) {
    setName(event.target.value);
    if (error) setError("");
  }

  return h("div", { className: "setup-root" },
    h("div", { className: "setup-card" },
      h("header", { className: "setup-bar" },
        h("span", { className: "brand" },
          h("span", { className: "brand-mark", "aria-hidden": "true" }, h("i"), h("i"), h("i")),
          "AgentPulse"
        ),
        h("button", {
          className: "window-close",
          type: "button",
          "aria-label": "Close setup",
          title: "Close",
          onClick: () => ipcRenderer.invoke("setup:close")
        }, "\u00d7")
      ),
      h("form", { className: "setup-body", onSubmit: submit },
        h("div", { className: "preview-stage" },
          h(Signal, { name: trimmed, size, bodyColour, mode: "", blink: false, agents: [] })
        ),
        h("div", { className: "field" },
          h("div", { className: "field-label" },
            h("label", { htmlFor: "light-name" }, "Name"),
            h("em", null, `${name.length}/24`)
          ),
          h("input", {
            id: "light-name",
            className: "name-input",
            type: "text",
            value: name,
            maxLength: 24,
            autoFocus: true,
            autoComplete: "off",
            spellCheck: false,
            placeholder: "Project ABC",
            onChange: updateName
          })
        ),
        h("div", { className: "field" },
          h("div", { className: "field-label" },
            h("span", null, "Size"),
            h("em", null, SIZE_OPTIONS[sizeIndex].label)
          ),
          h("input", {
            className: "size-slider",
            type: "range",
            min: 0,
            max: 2,
            step: 1,
            value: sizeIndex,
            style: { "--fill": `${sizeIndex * 50}%` },
            "aria-label": "Light size",
            "aria-valuetext": SIZE_OPTIONS[sizeIndex].label,
            onChange: event => setSizeIndex(Number(event.target.value))
          }),
          h("div", { className: "size-scale", "aria-hidden": "true" },
            SIZE_OPTIONS.map((option, index) => h("span", {
              key: option.id,
              className: index === sizeIndex ? "is-current" : ""
            }, option.label))
          )
        ),
        h("div", { className: "field" },
          h("div", { className: "field-label" },
            h("span", { id: "body-colour" }, "Body colour"),
            h("em", null, colour.label)
          ),
          h("div", { className: "swatch-row", role: "group", "aria-labelledby": "body-colour" },
            COLOUR_OPTIONS.map(option => h("button", {
              key: option.value,
              className: `swatch${bodyColour === option.value ? " is-selected" : ""}`,
              type: "button",
              style: { "--swatch": option.value },
              "aria-label": option.label,
              "aria-pressed": bodyColour === option.value,
              title: option.label,
              onClick: () => setBodyColour(option.value)
            }))
          )
        ),
        h("p", { className: `status-line is-${tone}`, role: error ? "alert" : undefined, title: status },
          status || "\u00a0"
        ),
        h("button", {
          className: "generate-button",
          type: "submit",
          disabled: !trimmed || saving
        }, saving ? "Generating\u2026" : "Generate light")
      )
    )
  );
}

function AskCard({ question, onDismiss }) {
  return h("section", { className: "ask-card", role: "status", "aria-live": "polite" },
    h("div", { className: "ask-head" },
      h("span", { className: "ask-label" }, "Agent question"),
      h("button", {
        className: "ask-dismiss",
        type: "button",
        title: "Dismiss",
        "aria-label": "Dismiss question",
        onClick: onDismiss
      }, "\u00d7")
    ),
    question.questions.map((item, index) => h("div", { className: "ask-item", key: index },
      h("p", { className: "ask-question" }, item.question || "Waiting for your answer."),
      item.detail ? h("p", { className: "ask-detail" }, item.detail) : null,
      item.options.length
        ? h("ul", { className: `ask-options${item.multi ? " is-multi" : ""}` },
          item.options.map((option, optionIndex) => h("li", { key: optionIndex },
            h("span", { className: "ask-mark", "aria-hidden": "true" }),
            h("span", { className: "ask-option", title: option }, option)
          ))
        )
        : null
    )),
    h("p", { className: "ask-hint" }, "This card is read-only. Answer in Antigravity; it closes when the agent continues."),
    h("div", { className: "ask-foot" },
      h("button", { className: "ask-primary", type: "button", onClick: onDismiss }, "Answer this in Antigravity"),
      h("button", { className: "ask-secondary", type: "button", onClick: onDismiss }, "Dismiss")
    )
  );
}

function ConnectPanel({ connect, busy, notice, copied, onChoose, onRemove, onTest, onClose, onCopy }) {
  const status = (connect && connect.status) || "Not connected";
  const statusClass = status === "Connected"
    ? "connected"
    : status === "Waiting for agent"
      ? "waiting"
      : status === "Light closed"
        ? "closed"
        : "idle";
  const folders = (connect && connect.folders) || [];

  return h("aside", { className: "link-panel connect-panel" },
    h("div", { className: "panel-head" },
      h("span", { className: "panel-title" }, "Connect folder"),
      h("button", { className: "panel-back", type: "button", onClick: onClose }, "Links")
    ),
    h("div", { className: `connect-status is-${statusClass}` },
      h("span", { className: "status-dot", "aria-hidden": "true" }),
      h("span", { className: "status-text" }, status),
      h("span", { className: "status-meta" },
        folders.length ? `${folders.length} folder${folders.length === 1 ? "" : "s"}` : "No folders")
    ),
    folders.length
      ? h("ul", { className: "folder-list" },
        folders.map(folder => h("li", { className: "folder-row", key: folder },
          h("span", { className: "folder-name", title: folder }, baseName(folder)),
          h("button", {
            className: "folder-remove",
            type: "button",
            title: `Remove connection from ${folder}`,
            "aria-label": `Remove connection from ${folder}`,
            onClick: () => onRemove(folder)
          }, "\u00d7")
        ))
      )
      : h("p", { className: "connect-empty" }, "No folders yet."),
    h("button", {
      className: "connect-primary",
      type: "button",
      disabled: busy,
      onClick: onChoose
    }, busy ? "Choosing\u2026" : "Choose folder\u2026"),
    h("div", { className: "command-block" },
      h("div", { className: "command-head" },
        h("span", { className: "command-label" }, "Or run the command"),
        h("button", {
          className: `row-copy${copied === "init" ? " is-copied" : ""}`,
          type: "button",
          onClick: onCopy
        }, copied === "init" ? "Copied" : "Copy")
      ),
      h("code", { className: "command-line", title: (connect && connect.command) || "" }, (connect && connect.command) || "")
    ),
    h("p", { className: "connect-hint" },
      "Start a new Antigravity session in the folder, then open /hooks. Green means the agent is working."
    ),
    h("div", { className: "connect-actions" },
      h("button", { className: "connect-test", type: "button", onClick: onTest }, "Test light"),
      h("span", { className: "connect-note" }, "Green \u2192 yellow \u2192 red")
    ),
    notice ? h("p", { className: "connect-notice", role: "status" }, notice) : null
  );
}

function LinkPanel({ light, boot, copied, onCopyLamp, onConnect, status }) {
  const base = boot.serverPort
    ? `http://127.0.0.1:${boot.serverPort}/${light.slug}-${light.secret}`
    : "";
  const statusClass = status === "Connected" ? "connected" : status === "Waiting for agent" ? "waiting" : "idle";

  return h("aside", { className: "link-panel" },
    h("div", { className: "panel-head" },
      h("span", { className: "panel-title" }, "Send a signal"),
      h("span", { className: `panel-meta${boot.serverReady ? "" : " is-offline"}` },
        boot.serverReady ? "local only" : "server offline"
      )
    ),
    LAMPS.map(lamp => {
      const command = base ? `curl -s "${base}/${lamp.id}"` : "Local server offline";
      return h("div", { className: `signal-row row-${lamp.id}`, key: lamp.id },
        h("div", { className: "row-head" },
          h("span", { className: "row-dot", "aria-hidden": "true" }),
          h("span", { className: "row-name" }, lamp.label),
          h("button", {
            className: `row-copy${copied === lamp.id ? " is-copied" : ""}`,
            type: "button",
            disabled: !base,
            title: base ? `Copy the ${lamp.label.toLowerCase()} curl command` : "Local server offline",
            onClick: () => onCopyLamp(lamp.id)
          }, copied === lamp.id ? "Copied" : "Copy")
        ),
        h("code", { className: "row-cmd", title: command }, command)
      );
    }),
    h("span", { className: "sr-only", "aria-live": "polite" },
      copied === "init" ? "Copied the connect command" : copied ? `Copied ${copied} command` : ""
    ),
    h("div", { className: "panel-foot" },
      h("button", {
        className: `text-button connect-shortcut is-${statusClass}`,
        type: "button",
        title: status,
        onClick: onConnect
      },
        h("span", { className: "foot-dot", "aria-hidden": "true" }),
        status === "Connected" ? "Connected" : status === "Waiting for agent" ? "Waiting" : "Connect"
      ),
      h("button", {
        className: "text-button",
        type: "button",
        onClick: () => ipcRenderer.invoke("light:new")
      }, "New light"),
      h("button", {
        className: "text-button is-danger",
        type: "button",
        onClick: () => ipcRenderer.invoke("light:delete", light.id)
      }, "Delete")
    )
  );
}

function LightWindow({ boot }) {
  const light = boot.light;
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [draggable, setDraggable] = React.useState(false);
  const [muted, setMuted] = React.useState(() => {
    return window.agentSound && window.agentSound.isMuted ? window.agentSound.isMuted() : false;
  });
  const [volume, setVolume] = React.useState(() => {
    return window.agentSound && window.agentSound.getVolume ? window.agentSound.getVolume() : 0.55;
  });
  const [signal, setSignal] = React.useState(boot.state || {
    mode: (light && light.lastSignal) || "",
    blink: false,
    question: null,
    agents: [],
    status: (boot.connect && boot.connect.status) || "Not connected"
  });
  const [connect, setConnect] = React.useState(boot.connect || null);
  const [connectOpen, setConnectOpen] = React.useState(Boolean(boot.openConnect));
  const [connectBusy, setConnectBusy] = React.useState(false);
  const [connectNotice, setConnectNotice] = React.useState("");
  const [copied, setCopied] = React.useState("");
  const [dismissed, setDismissed] = React.useState("");
  const rootRef = React.useRef(null);
  const copyTimer = React.useRef(null);

  React.useEffect(() => {
    if (!window.agentSound || !window.agentSound.subscribe) return;
    const unsubscribe = window.agentSound.subscribe(state => {
      setMuted(state.muted);
      setVolume(state.volume);
    });
    return unsubscribe;
  }, []);

  const handleToggleDrag = (e) => {
    if (e) {
      if (typeof e.stopPropagation === "function") e.stopPropagation();
      if (typeof e.preventDefault === "function") e.preventDefault();
    }
    setDraggable(true);
    setPanelOpen(false);
  };

  const handleTogglePanel = () => {
    if (draggable) {
      setDraggable(false);
      setPanelOpen(true);
      return;
    }
    setPanelOpen(prev => !prev);
  };

  const handleToggleMute = (e) => {
    if (e) e.stopPropagation();
    if (window.agentSound && window.agentSound.toggleMute) {
      const next = window.agentSound.toggleMute();
      setMuted(next);
    }
    setPanelOpen(false);
  };

  const handleVolumeChange = (e) => {
    const next = parseFloat(e.target.value);
    setVolume(next);
    if (window.agentSound && window.agentSound.setVolume) {
      window.agentSound.setVolume(next);
    }
  };

  React.useEffect(() => {
    const onMoved = () => {
      setDraggable(false);
    };
    ipcRenderer.on("light:moved", onMoved);
    return () => ipcRenderer.removeListener("light:moved", onMoved);
  }, []);

  React.useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && draggable) {
        setDraggable(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [draggable]);

  React.useEffect(() => {
    if (!draggable) return;
    let dragging = false;
    let startScreenX = 0;
    let startScreenY = 0;

    const onMouseDown = (e) => {
      if (e.target.closest("button") || e.target.closest("input") || e.target.closest(".signal-sound-bay")) return;
      dragging = true;
      startScreenX = e.screenX;
      startScreenY = e.screenY;
    };

    const onMouseMove = (e) => {
      if (!dragging) return;
      const deltaX = e.screenX - startScreenX;
      const deltaY = e.screenY - startScreenY;
      if (deltaX !== 0 || deltaY !== 0) {
        startScreenX = e.screenX;
        startScreenY = e.screenY;
        ipcRenderer.invoke("light:move-by", { deltaX, deltaY });
      }
    };

    const onMouseUp = () => {
      if (dragging) {
        dragging = false;
        ipcRenderer.invoke("light:save-position");
        setDraggable(false);
      }
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [draggable]);

  React.useEffect(() => {
    const deriveSoundName = (next) => {
      // Direct fine-grained agent modes
      if (next.agentMode === "cancelled") return "cancelled";
      if (next.agentMode === "error")     return "error";
      if (next.agentMode === "idle")      return "idle";

      // All yellow states wait for user response — always use "ask" path (immediate prompt)
      if (next.asking || next.question || next.agentMode === "asking") return "ask";
      if (next.agentMode === "terminal")  return "terminal";
      if (next.mode === "yellow")         return "ask";   // includes yellow states waiting on input
      if (next.fileAction === "read" || next.agentMode === "reading") return "read-file";
      if (next.fileAction === "write" || next.agentMode === "writing") return "write-file";
      // green+blink with no fileAction = thinking/working
      if (next.mode === "green" && next.blink && !next.fileAction) return "think-blink";
      if (next.mode === "green")          return "think"; // solid green
      if (next.mode === "red")            return "red";   // clean done / finished
      return "off";
    };

    const onSignal = (_event, next) => {
      if (!next || typeof next !== "object") return;
      setSignal(next);
      setConnect(previous => previous ? { ...previous, status: next.status } : previous);
      if (window.agentSound) window.agentSound.play(deriveSoundName(next), next.file);
    };
    const onOpenConnect = () => setConnectOpen(true);
    ipcRenderer.on("light:signal", onSignal);
    ipcRenderer.on("light:open-connect", onOpenConnect);
    if (light && light.id) {
      ipcRenderer.invoke("light:state", light.id).then(next => {
        if (!next) return;
        setSignal(next);
        // Also boot sound from initial state (e.g. window reopened while ask is active)
        if (window.agentSound) window.agentSound.play(deriveSoundName(next), next.file);
      });
    }
    return () => {
      ipcRenderer.removeListener("light:signal", onSignal);
      ipcRenderer.removeListener("light:open-connect", onOpenConnect);
      clearTimeout(copyTimer.current);
    };
  }, [light && light.id]);

  React.useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const height = Math.ceil(node.getBoundingClientRect().height);
        if (height > 0) ipcRenderer.invoke("light:resize", height);
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    measure();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [light && light.id]);

  if (!light) {
    return h("div", { className: "light-missing" },
      h("p", null, "This light is no longer saved."),
      h("button", {
        className: "missing-button",
        type: "button",
        onClick: () => ipcRenderer.invoke("light:new")
      }, "New light")
    );
  }

  const questionKey = signal.question ? JSON.stringify(signal.question) : "";
  const showQuestion = Boolean(questionKey) && questionKey !== dismissed;

  async function copyLamp(lampId) {
    if (!boot.serverPort) return;
    const command = `curl -s "http://127.0.0.1:${boot.serverPort}/${light.slug}-${light.secret}/${lampId}"`;
    await ipcRenderer.invoke("light:copy", command);
    setCopied(lampId);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(""), 1400);
  }

  async function copyInit() {
    if (!connect || !connect.command) return;
    await ipcRenderer.invoke("light:copy", connect.command);
    setCopied("init");
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(""), 1400);
  }

  async function refreshConnect() {
    const next = await ipcRenderer.invoke("connect:info", light.id);
    if (next) setConnect(next);
  }

  async function chooseFolder() {
    setConnectBusy(true);
    setConnectNotice("");
    const result = await ipcRenderer.invoke("connect:choose", light.id);
    setConnectBusy(false);
    if (!result || result.canceled) return;
    if (!result.ok) {
      setConnectNotice(result.error || "The folder could not be connected.");
      return;
    }
    await refreshConnect();
    setConnectNotice(result.backup
      ? "Folder connected. The old hooks file was backed up next to it."
      : "Folder connected. Start a new Antigravity session there.");
  }

  async function removeFolder(folder) {
    setConnectNotice("");
    const result = await ipcRenderer.invoke("connect:remove", light.id, folder);
    if (!result || result.canceled) return;
    if (!result.ok) {
      setConnectNotice(result.error || "The connection could not be removed.");
      return;
    }
    await refreshConnect();
    setConnectNotice("Connection removed. The light was not deleted.");
  }

  async function testLight() {
    setConnectNotice("");
    const result = await ipcRenderer.invoke("connect:test", light.id);
    if (!result || !result.ok) setConnectNotice("Open the light before testing it.");
  }

  return h("div", { className: `light-window light-${light.size}${draggable ? " is-draggable" : ""}`, ref: rootRef },
    h("button", {
      className: "light-close",
      type: "button",
      title: "Close light",
      "aria-label": "Close light",
      onClick: () => ipcRenderer.invoke("light:close", light.id)
    }, "\u00d7"),
    h("div", { className: "light-stage" },
      h(Signal, {
        name: light.name,
        size: light.size,
        bodyColour: light.bodyColour,
        mode: signal.mode,
        blink: signal.blink,
        agentMode: signal.agentMode,
        agents: signal.agents,
        active: panelOpen,
        muted,
        volume,
        draggable,
        onToggleDrag: handleToggleDrag,
        onToggleMute: handleToggleMute,
        onVolumeChange: handleVolumeChange,
        onManualStop: () => {
          // Optimistically turn red immediately — don't wait for the IPC round-trip
          setSignal(prev => ({ ...prev, mode: "red", blink: false, agentMode: "cancelled", question: null, asking: false }));
          ipcRenderer.invoke("light:manual-stop", light.id);
        },
        onClick: handleTogglePanel
      })
    )
  );
}

function App() {
  const [boot, setBoot] = React.useState(null);

  React.useEffect(() => {
    ipcRenderer.invoke("app:bootstrap").then(setBoot);
  }, []);

  if (!boot) return null;
  return boot.mode === "light" ? h(LightWindow, { boot }) : h(SetupScreen, { boot });
}

createRoot(document.getElementById("root")).render(h(App));
