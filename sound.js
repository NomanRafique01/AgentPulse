// Sound engine — Web Audio API only, no files, works fully offline.
// All sounds are synthesised from scratch using oscillators and gain envelopes.
(function () {
  let ctx = null, lightMaster = null;
  let volume = 0.55, muted = false;
  let lastPlayed = "";
  let lastEditedFile = "";
  let inputTimer  = null;     // 4s yellow/ask alert timer
  let repeatTimer = null;     // yellow/ask repeat interval
  let thinkTimer  = null;     // 12s initial "Agent is fixing" timer
  let thinkRepeat = null;     // 12s "Still fixing" interval
  let cachedVoices = [];
  const listeners = new Set();

  // Load persistent sound preferences if available
  try {
    const savedMuted = localStorage.getItem("agentpulse_muted");
    if (savedMuted !== null) muted = savedMuted === "true";
    const savedVol = localStorage.getItem("agentpulse_volume");
    if (savedVol !== null) {
      const parsed = parseFloat(savedVol);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) volume = parsed;
    }
  } catch {}

  function notify() {
    listeners.forEach(fn => {
      try { fn({ muted, volume }); } catch {}
    });
  }

  // ─── Voice caching for modern speech synthesis ────────────────────────────
  function refreshVoices() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length) cachedVoices = v;
      } catch {}
    }
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }

  function pickBestVoice() {
    refreshVoices();
    if (!cachedVoices.length) return null;

    // Prioritize natural / neural modern English voices (Windows 11 / Edge / modern OS)
    const preferredPatterns = [
      /natural/i,
      /neural/i,
      /aria/i,
      /jenny/i,
      /guy/i,
      /samantha/i,
      /google.*en/i,
      /zira/i,
      /david/i,
      /mark/i
    ];
    for (const pattern of preferredPatterns) {
      const match = cachedVoices.find(v => pattern.test(v.name) && (v.lang.startsWith("en") || !v.lang));
      if (match) return match;
    }
    const anyEn = cachedVoices.find(v => v.lang && v.lang.startsWith("en"));
    return anyEn || cachedVoices[0];
  }

  // ─── Audio context (lazy init, auto-resumed — no gesture required in Electron) ──
  // Light sounds connect directly to lightMaster at unity gain (synced with PC system volume)
  function audio() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      lightMaster = ctx.createGain();
      lightMaster.gain.value = 1.0; // 100% synced with PC master system volume
      lightMaster.connect(ctx.destination);
    }
    // Electron is configured with autoplayPolicy "no-user-gesture-required"
    // Resume synchronously if suspended (happens on first use before any interaction)
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // Eagerly boot the audio context so the first sound never has a cold-start delay
  function primeAudio() {
    try {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        lightMaster = ctx.createGain();
        lightMaster.gain.value = 1.0;
        lightMaster.connect(ctx.destination);
      }
      if (ctx.state === "suspended") ctx.resume();
    } catch {}
  }
  // Prime as soon as the page is interactive
  if (document.readyState === "complete") {
    primeAudio();
  } else {
    window.addEventListener("load", primeAudio, { once: true });
  }

  // ─── Primitive: single oscillator note with attack/decay envelope ──────────
  // Always plays to lightMaster (synced directly with PC system volume)
  function tone(freq, startOffset, duration, peak, type, detune) {
    const c = audio();
    const t = c.currentTime + startOffset;
    const osc = c.createOscillator();
    const g   = c.createGain();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    if (detune) osc.detune.value = detune;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.018);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(g);
    g.connect(lightMaster);
    osc.start(t);
    osc.stop(t + duration + 0.06);
  }

  // Filtered noise burst (for subtle texture)
  function noise(startOffset, duration, peak, cutoff) {
    const c = audio();
    const t = c.currentTime + startOffset;
    const buf = c.createBuffer(1, c.sampleRate * duration, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src    = c.createBufferSource();
    const filter = c.createBiquadFilter();
    const g      = c.createGain();
    src.buffer = buf;
    filter.type = "bandpass";
    filter.frequency.value = cutoff || 800;
    filter.Q.value = 0.7;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    src.connect(filter);
    filter.connect(g);
    g.connect(lightMaster);
    src.start(t);
    src.stop(t + duration + 0.05);
  }

  // ─── Sound definitions ─────────────────────────────────────────────────────

  // THINKING / SOLID GREEN — bright, crisp, uplifting ascending chime
  function soundGreenChime() {
    tone(659.25, 0,    0.26, 0.35, "sine");
    tone(880.00, 0.07, 0.32, 0.32, "sine");
    tone(1108.7, 0.14, 0.55, 0.28, "sine");
    tone(1760.0, 0.15, 0.35, 0.12, "triangle"); // bright bell harmonic
    noise(0.14,  0.06, 0.02, 4500);             // crisp presence
  }

  function soundThinking() {
    soundGreenChime();
  }

  function soundGreen() {
    soundGreenChime();
  }

  // GREEN BLINK (writing file) — soft double tap, like a keyboard click pair
  function soundWriting() {
    tone(880, 0,    0.14, 0.18, "triangle");
    tone(1046, 0.1, 0.14, 0.14, "triangle");
  }

  // YELLOW BLINK (running terminal) — quick repeating tick like a clock/spinner
  function soundTerminal() {
    tone(660, 0,    0.1, 0.22, "square");
    tone(660, 0.14, 0.1, 0.16, "square");
  }

  // ASKING ARRIVAL (0s) — soft, polite modern dual-tone UI cue
  function soundAskArrival() {
    tone(587.33, 0,    0.16, 0.22, "sine");  // D5
    tone(880.00, 0.08, 0.26, 0.18, "sine");  // A5
  }

  // NEED INPUT ALERT (4s elapsed without input) — crisp, high-tech modern attention chime
  function soundNeedInputChime() {
    tone(659.25, 0,    0.14, 0.28, "sine");
    tone(830.61, 0.07, 0.15, 0.26, "sine");
    tone(987.77, 0.14, 0.28, 0.24, "sine");
    tone(1318.5, 0.15, 0.22, 0.09, "triangle"); // sparkling harmonic
  }

  // Speech queue ensures full line is spoken completely without being cut off or overridden
  const speechQueue = [];
  let isSpeaking = false;

  function processSpeechQueue() {
    if (isSpeaking || speechQueue.length === 0) return;
    if (muted || volume <= 0 || typeof window === "undefined" || !window.speechSynthesis) {
      speechQueue.length = 0;
      isSpeaking = false;
      return;
    }
    const text = speechQueue.shift();
    try {
      const u = new SpeechSynthesisUtterance(text);
      const voice = pickBestVoice();
      if (voice) u.voice = voice;
      u.volume = Math.min(1.0, Math.max(0, volume));
      u.rate   = 1.05; // modern, fluent pacing
      u.pitch  = 1.0;
      isSpeaking = true;
      u.onend = () => {
        isSpeaking = false;
        setTimeout(processSpeechQueue, 120);
      };
      u.onerror = () => {
        isSpeaking = false;
        setTimeout(processSpeechQueue, 120);
      };
      window.speechSynthesis.speak(u);
    } catch {
      isSpeaking = false;
    }
  }

  // Speech helper: speaks cleanly with modern natural voice (volume & mute controlled)
  function speak(text) {
    if (!text || muted || volume <= 0) return;
    speechQueue.push(text);
    processSpeechQueue();
  }

  // Trigger the 4s voice alert: only agent speaks, no LED sound
  function triggerNeedInputAlert() {
    speak("Agent needs your input.");
  }

  // RED (error / stopped / finished) — rich bell chord, clean finish
  function soundDone() {
    const base = 523.25; // C5
    tone(base,        0,    1.9, 0.30, "sine");
    tone(base * 2,    0,    1.4, 0.14, "sine");
    tone(base * 2.76, 0.01, 1.0, 0.09, "sine");
    tone(base * 5.4,  0.01, 0.6, 0.04, "sine");
    noise(0, 0.08, 0.04, 2400);
  }

  // ERROR — harsh descending two-tone buzz
  function soundError() {
    tone(300, 0,    0.28, 0.35, "sawtooth");
    tone(220, 0.2,  0.35, 0.30, "sawtooth");
    noise(0, 0.3, 0.07, 400);
  }

  // OFF — faint low click, confirms the light went dark
  function soundOff() {
    tone(180, 0, 0.18, 0.08, "sine");
  }

  function stopAll() {
    clearTimeout(inputTimer);
    inputTimer = null;
    clearInterval(repeatTimer);
    clearTimeout(repeatTimer);
    repeatTimer = null;
    clearTimeout(thinkTimer);
    thinkTimer = null;
    clearInterval(thinkRepeat);
    thinkRepeat = null;
  }

  // ─── State → sound mapping ─────────────────────────────────────────────────
  //
  // Signals from renderer deriveSoundName():
  //   "think"        → thinking / planning (green steady)
  //   "read-file"    → reading/analyzing file ("Agent Read <filename>")
  //   "write-file"   → writing/editing file ("Agent Wrote <filename>")
  //   "blink-green"  → writing/editing file (green blinking)
  //   "ask"          → ANY yellow state (ask, permission, choices, terminal blocked) → 4s voice timer
  //   "red"          → stopped / finished / error
  //   "off"          → all dark
  //
  // Light shift and blinking sounds ALWAYS play (synced directly with PC system volume).
  // The in-app mute and volume controls only affect the agent speech synthesis voice.

  function play(name, file) {
    const isFileAction = (name === "read-file" || name === "write-file" || name === "blink-green") && Boolean(file);
    if (name === lastPlayed && !isFileAction) return;   // same state: stay quiet
    if (isFileAction && file === lastEditedFile && name === lastPlayed) return; // same file already announced
    lastPlayed = name;
    lastEditedFile = isFileAction ? file : "";
    stopAll();

    switch (name) {
      case "think":
        soundThinking();
        break;

      case "think-blink":
        soundThinking();
        break;

      case "green":
        soundGreen();
        break;

      case "read-file":
        soundGreen();
        if (file) {
          const cleanName = String(file).split(/[\\/]/).pop();
          speak(`Agent Read ${cleanName}`);
        } else {
          speak("Agent Read file");
        }
        break;

      case "write-file":
      case "blink-green":
        soundWriting();
        if (file) {
          const cleanName = String(file).split(/[\\/]/).pop();
          speak(`Agent Wrote ${cleanName}`);
        } else {
          speak("Agent Wrote file");
        }
        break;

      case "blink-yellow":
        soundTerminal();
        break;

      case "ask":
      case "yellow":
        // Immediate light cue + immediate voice (no delay)
        soundAskArrival();
        triggerNeedInputAlert();
        // Keep repeating every 4s until state changes
        repeatTimer = setInterval(() => {
          triggerNeedInputAlert();
        }, 4000);
        break;

      case "red":
        soundDone();
        break;

      case "blink-red":
        soundError();
        break;

      case "off":
        soundOff();
        break;

      default:
        break;
    }
  }

  // ─── Sound state controls & persistence ─────────────────────────────────────
  // Mute & Volume only control Agent Voice; Light hardware sounds follow PC system volume.
  function _setMutedInternal(val, broadcast = true) {
    const next = Boolean(val);
    if (muted === next) return muted;
    muted = next;
    if (muted) {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); } catch {}
      }
    } else {
      tone(660, 0, 0.12, 0.2); // pleasant confirmation chime on unmuting voice
    }
    try { localStorage.setItem("agentpulse_muted", String(muted)); } catch {}
    notify();
    if (broadcast && typeof require !== "undefined") {
      try {
        const { ipcRenderer } = require("electron");
        ipcRenderer.send("sound:mute-sync", muted);
      } catch {}
    }
    return muted;
  }

  function setMuted(val) {
    return _setMutedInternal(val, true);
  }

  function toggleMute() {
    return setMuted(!muted);
  }

  function setVolume(val) {
    const next = Math.min(1, Math.max(0, Number(val) || 0));
    volume = next;
    try { localStorage.setItem("agentpulse_volume", String(volume)); } catch {}
    notify();
    return volume;
  }

  // Cross-window mute synchronization via Electron IPC
  if (typeof require !== "undefined") {
    try {
      const { ipcRenderer } = require("electron");
      ipcRenderer.on("sound:mute-sync", (_event, val) => {
        _setMutedInternal(val, false);
      });
    } catch {}
  }

  // ─── Keyboard controls ─────────────────────────────────────────────────────
  // M = mute/unmute   ↑/↓ = volume
  document.addEventListener("keydown", e => {
    const k = e.key.toLowerCase();
    if (k === "m") {
      toggleMute();
    } else if (k === "arrowup" || k === "arrowdown") {
      const step = k === "arrowup" ? 0.05 : -0.05;
      const next = Math.min(1, Math.max(0, volume + step));
      setVolume(next);
      if (!muted) tone(660, 0, 0.1, volume);
    }
  });

  // ─── Public API ────────────────────────────────────────────────────────────
  window.agentSound = {
    play,
    stop: stopAll,
    testInputAlert: () => {
      if (muted) return;
      stopAll();
      triggerNeedInputAlert();
    },
    testChime: () => {
      if (muted) return;
      soundGreenChime();
    },
    isMuted: () => muted,
    setMuted,
    toggleMute,
    getVolume: () => volume,
    setVolume,
    subscribe: (fn) => {
      listeners.add(fn);
      try { fn({ muted, volume }); } catch {}
      return () => listeners.delete(fn);
    }
  };
})();
