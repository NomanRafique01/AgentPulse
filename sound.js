// Sound engine — Web Audio API only, no files, works fully offline.
// All sounds are synthesised from scratch using oscillators and gain envelopes.
(function () {
  let ctx = null, master = null;
  let volume = 0.55, muted = false;
  let lastPlayed = "";
  let inputTimer  = null;     // 4s yellow/ask alert timer
  let repeatTimer = null;     // yellow/ask repeat interval
  let thinkTimer  = null;     // 12s initial "Agent is fixing" timer
  let thinkRepeat = null;     // 12s "Still fixing" interval
  let cachedVoices = [];

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
  function audio() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.connect(ctx.destination);
      _applyVolume();
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
        master = ctx.createGain();
        master.connect(ctx.destination);
        _applyVolume();
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

  function _applyVolume() {
    if (master) master.gain.value = muted ? 0 : volume;
  }

  // ─── Primitive: single oscillator note with attack/decay envelope ──────────
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
    g.connect(master);
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
    g.connect(master);
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

  // Speech helper: speaks cleanly with modern natural voice
  function speak(text) {
    if (muted || typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const voice = pickBestVoice();
      if (voice) u.voice = voice;
      u.volume = Math.min(volume * 1.35, 1.0);
      u.rate   = 1.03; // modern, fluent pacing
      u.pitch  = 1.0;
      window.speechSynthesis.speak(u);
    } catch {}
  }

  // Trigger the 4s voice alert: chime + voice
  function triggerNeedInputAlert() {
    soundNeedInputChime();
    setTimeout(() => {
      speak("Agent needs your input.");
    }, 380);
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
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch {}
    }
  }

  // ─── State → sound mapping ─────────────────────────────────────────────────
  //
  // Signals from renderer deriveSoundName():
  //   "think"        → thinking / planning (green steady)
  //   "blink-green"  → writing/editing file (green blinking)
  //   "ask"          → ANY yellow state (ask, permission, choices, terminal blocked) → 4s voice timer
  //   "red"          → stopped / finished / error
  //   "off"          → all dark
  //
  // Note: ALL yellow states (ask_question, ask_permission, run_command blocked on input,
  //       multi-choice, sudo prompts, etc.) map to "ask" to trigger the voice alert.

  function play(name) {
    if (name === lastPlayed) return;   // same state: stay quiet
    lastPlayed = name;
    stopAll();

    switch (name) {
      case "think":
        soundThinking();
        // After 6s of continuous green thinking, announce "Agent is fixing"
        thinkTimer = setTimeout(() => {
          soundGreenChime();
          setTimeout(() => speak("Agent is fixing."), 300);
          // Then every 12s after that, say "Still fixing" until interrupted
          thinkRepeat = setInterval(() => {
            soundGreenChime();
            setTimeout(() => speak("Still fixing."), 300);
          }, 12000);
        }, 6000);
        break;

      case "green":
        soundGreen();
        break;

      case "blink-green":
        soundWriting();
        break;

      case "blink-yellow":
        soundTerminal();
        break;

      case "ask":
      case "yellow":
        // Immediate polite cue
        soundAskArrival();
        // If user won't give input for 4s, trigger the professional voice alert
        inputTimer = setTimeout(() => {
          triggerNeedInputAlert();
          repeatTimer = setInterval(() => {
            triggerNeedInputAlert();
          }, 20000);
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

  // ─── Keyboard controls ─────────────────────────────────────────────────────
  // M = mute/unmute   ↑/↓ = volume
  document.addEventListener("keydown", e => {
    const k = e.key.toLowerCase();
    if (k === "m") {
      muted = !muted;
      _applyVolume();
      if (!muted) tone(660, 0, 0.12, 0.2);
      else stopAll();
    } else if (k === "arrowup" || k === "arrowdown") {
      volume = Math.min(1, Math.max(0, volume + (k === "arrowup" ? 0.1 : -0.1)));
      _applyVolume();
      tone(660, 0, 0.12, volume);
    }
  });

  // ─── Public API ────────────────────────────────────────────────────────────
  window.agentSound = {
    play,
    stop: stopAll,
    testInputAlert: () => {
      stopAll();
      triggerNeedInputAlert();
    }
  };
})();
