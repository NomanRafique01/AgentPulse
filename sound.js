// Sounds made by the app itself (no files, works offline)
(function () {
  let ctx = null, master = null;
  let volume = 0.6, muted = false;
  let last = "";
  let pulseTimer = null, askTimer = null, speakTimer = null;

  function audio() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.connect(ctx.destination);
      applyVolume();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function applyVolume() {
    if (master) master.gain.value = muted ? 0 : volume;
  }

  // One soft note that fades out smoothly
  function tone(freq, start, dur, peak, type) {
    const c = audio();
    const t = c.currentTime + start;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  // Green: soft two-note chime
  function chime() {
    tone(660, 0, 0.5, 0.25);
    tone(880, 0.12, 0.7, 0.22);
  }

  // Red: completion bell (several notes at once, like real metal)
  function bell() {
    const base = 523.25;
    [1, 2, 2.76, 5.4].forEach((ratio, i) => {
      tone(base * ratio, 0, [1.8, 1.2, 0.9, 0.5][i], [0.3, 0.15, 0.1, 0.05][i]);
    });
  }

  // Yellow: quiet low pulse
  function pulse() {
    tone(196, 0, 0.9, 0.12);
  }

  // Question: three-beep alert
  function alertBeep() {
    tone(880, 0, 0.18, 0.25, "triangle");
    tone(660, 0.22, 0.18, 0.25, "triangle");
    tone(880, 0.44, 0.22, 0.25, "triangle");
  }

  function speak(text) {
    if (muted || !window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.volume = volume;
    u.rate = 1;
    speechSynthesis.speak(u);
  }

  function ask() {
    alertBeep();
    clearTimeout(speakTimer);
    speakTimer = setTimeout(() => speak("Agent needs your answer"), 800);
  }

  function stopAll() {
    clearInterval(pulseTimer);
    clearInterval(askTimer);
    clearTimeout(speakTimer);
    if (window.speechSynthesis) speechSynthesis.cancel();
  }

  // Names: red, yellow, green, think, ask, off
  function play(name) {
    if (name === last) return;          // same state again: stay quiet
    last = name;
    stopAll();

    if (name === "green") {
      chime();
    } else if (name === "red") {
      bell();
    } else if (name === "yellow" || name === "think") {
      pulse();
      pulseTimer = setInterval(pulse, 2800);   // matches the slow breathing
    } else if (name === "ask") {
      ask();
      askTimer = setInterval(ask, 30000);      // repeats every 30 seconds
    }
  }

  // M = mute, Arrow Up / Arrow Down = volume
  document.addEventListener("keydown", e => {
    const k = e.key.toLowerCase();
    if (k === "m") {
      muted = !muted;
      applyVolume();
      if (muted && window.speechSynthesis) speechSynthesis.cancel();
      else tone(660, 0, 0.12, 0.2);
    } else if (k === "arrowup" || k === "arrowdown") {
      volume = Math.min(1, Math.max(0, volume + (k === "arrowup" ? 0.1 : -0.1)));
      applyVolume();
      tone(660, 0, 0.12, 0.2);                 // short beep at the new volume
    }
  });

  window.agentSound = { play };
})();