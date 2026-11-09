// Sound engine — Web Audio API only, no files, works fully offline.
// All sounds are synthesised from scratch using oscillators and gain envelopes.
(function () {
  let ctx = null, master = null;
  let volume = 0.55, muted = false;
  let lastPlayed = "";
  let repeatTimer = null;

  // ─── Audio context (lazy init, resumed on first interaction) ──────────────
  function audio() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.connect(ctx.destination);
      _applyVolume();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
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

  // THINKING / SOLID GREEN — bright, crisp, uplifting ascending chime (not dim/muffled)
  function soundGreenChime() {
    // Bright ascending notes: E5 (659Hz) -> A5 (880Hz) -> C#6 (1108Hz) with sparkling harmonics
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

  // YELLOW (steady) — single warm mid-tone ping: heads up, waiting
  function soundYellow() {
    tone(440, 0, 0.35, 0.32, "triangle");  // A4
  }

  // YELLOW BLINK (running terminal) — quick repeating tick like a clock/spinner
  function soundTerminal() {
    tone(660, 0,    0.1, 0.22, "square");
    tone(660, 0.14, 0.1, 0.16, "square");
  }

  // ASKING — attention-grabbing three-note descend + slight noise, then speech
  function soundAsk() {
    tone(880, 0,    0.18, 0.28, "triangle");   // high
    tone(698, 0.2,  0.18, 0.26, "triangle");   // mid
    tone(587, 0.4,  0.22, 0.26, "triangle");   // low
    noise(0.42, 0.25, 0.06, 1200);
  }

  // RED (error / stopped / finished) — rich bell chord, clean finish
  function soundDone() {
    // Metallic bell: fundamental + inharmonic partials
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

  // Speech helper for ask state
  function speak(text) {
    if (muted || !window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.volume = Math.min(volume * 1.4, 1);
    u.rate   = 1.0;
    u.pitch  = 1.0;
    speechSynthesis.speak(u);
  }

  function stopAll() {
    clearInterval(repeatTimer);
    clearTimeout(repeatTimer);
    repeatTimer = null;
    if (window.speechSynthesis) speechSynthesis.cancel();
  }

  // ─── State → sound mapping ─────────────────────────────────────────────────
  //
  // Signals from signal.js / setActive():
  //   "green"        → agent active / working
  //   "blink-green"  → writing file
  //   "yellow"       → waiting / paused
  //   "blink-yellow" → running terminal command
  //   "think"        → thinking / processing (green lens, breathing)
  //   "ask"          → asking user a question (yellow lens, flashing)
  //   "red"          → finished / done / stopped
  //   "blink-red"    → error
  //   "off"          → all dark

  function play(name) {
    if (name === lastPlayed) return;   // same state: stay quiet
    lastPlayed = name;
    stopAll();

    switch (name) {
      case "think":
        soundThinking();
        break;

      case "green":
        soundGreen();
        break;

      case "blink-green":
        soundWriting();
        break;

      case "yellow":
        soundYellow();
        break;

      case "blink-yellow":
        soundTerminal();
        break;

      case "ask":
        soundAsk();
        // Repeat the alert every 28 s so the user doesn't miss it
        repeatTimer = setInterval(() => {
          soundAsk();
          setTimeout(() => speak("Agent needs your attention"), 700);
        }, 28000);
        // First speech after the initial tones settle
        setTimeout(() => speak("Agent needs your attention"), 700);
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
      else if (window.speechSynthesis) speechSynthesis.cancel();
    } else if (k === "arrowup" || k === "arrowdown") {
      volume = Math.min(1, Math.max(0, volume + (k === "arrowup" ? 0.1 : -0.1)));
      _applyVolume();
      tone(660, 0, 0.12, volume);
    }
  });

  // ─── Public API ────────────────────────────────────────────────────────────
  window.agentSound = { play };
})();
