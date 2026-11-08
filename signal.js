// Animation engine: GSAP. Visuals: CSS (see styles.css).
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const lenses = [...document.querySelectorAll(".lens")];
const yellow = document.querySelector(".lens.yellow");
const jobs = new WeakMap();   // the running animation of each lens

function layers(lens) {
  return { lit: lens.querySelector(".lit"), halo: lens.querySelector(".halo") };
}

// Stops anything running on this lens, so animations never overlap
function stop(lens) {
  const { lit, halo } = layers(lens);
  const job = jobs.get(lens);
  if (job) job.kill();
  gsap.killTweensOf([lit, halo]);
}

function setInstant(lens, on) {
  const { lit, halo } = layers(lens);
  stop(lens);
  gsap.set(lit,  { opacity: on ? 1 : 0, "--spread": on ? "118%" : "0%" });
  gsap.set(halo, { opacity: on ? 0.8 : 0 });
}

// "think" = slow breathing, "ask" = fast blinking, "blink" = regular blinking
function pulse(lens, mode) {
  if (reduce) return;                      // reduced motion: stay steady
  const { lit, halo } = layers(lens);
  let tl;
  if (mode === "think") {
    tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(lit,  { opacity: 0.45, duration: 1.4, ease: "sine.inOut" }, 0)
      .to(halo, { opacity: 0.25, duration: 1.4, ease: "sine.inOut" }, 0);
  } else if (mode === "ask") {
    tl = gsap.timeline({ repeat: -1 });
    tl.to(lit,  { opacity: 0.08, duration: 0.12, ease: "power1.in" }, 0)
      .to(halo, { opacity: 0.05, duration: 0.12, ease: "power1.in" }, 0)
      .to(lit,  { opacity: 1,    duration: 0.12, ease: "power1.out" }, 0.28)
      .to(halo, { opacity: 0.9,  duration: 0.12, ease: "power1.out" }, 0.28)
      .to({}, { duration: 0.3 });
  } else if (mode === "blink") {
    tl = gsap.timeline({ repeat: -1, repeatDelay: 0.15 });
    tl.to(lit,  { opacity: 0.06, duration: 0.38, ease: "sine.inOut" }, 0)
      .to(halo, { opacity: 0,    duration: 0.38, ease: "sine.inOut" }, 0)
      .to(lit,  { opacity: 1,    duration: 0.38, ease: "sine.inOut" }, 0.38)
      .to(halo, { opacity: 0.8,  duration: 0.38, ease: "sine.inOut" }, 0.38);
  }
  if (tl) jobs.set(lens, tl);
}

function turnOn(lens, delay, mode) {
  stop(lens);
  if (reduce) return setInstant(lens, true);
  const { lit, halo } = layers(lens);
  const tl = gsap.timeline({ delay, onComplete: () => mode && pulse(lens, mode) });
  tl.to(lit,  { opacity: 1, duration: 0.35, ease: "power2.in" }, 0)
    .to(lit,  { "--spread": "118%", duration: 0.55, ease: "power2.out" }, 0)
    .to(halo, { opacity: 1, duration: 0.4, ease: "power2.in" }, 0.08)
    .to(halo, { opacity: 0.8, duration: 0.5, ease: "sine.out" });
  jobs.set(lens, tl);
}

function turnOff(lens) {
  stop(lens);
  if (reduce) return setInstant(lens, false);
  const { lit, halo } = layers(lens);
  const tl = gsap.timeline();
  tl.to(lit,  { opacity: 0, duration: 0.45, ease: "power2.out" }, 0)
    .to(lit,  { "--spread": "0%", duration: 0.45, ease: "power2.in" }, 0)
    .to(halo, { opacity: 0, duration: 0.6, ease: "sine.out" }, 0);
  jobs.set(lens, tl);
}

// Same light, new mode (for example yellow steady -> yellow breathing)
function retarget(lens, mode) {
  stop(lens);
  if (reduce) return setInstant(lens, true);
  const { lit, halo } = layers(lens);
  const tl = gsap.timeline({ onComplete: () => mode && pulse(lens, mode) });
  tl.to(lit,  { opacity: 1,   duration: 0.3, ease: "power2.out" }, 0)
    .to(halo, { opacity: 0.8, duration: 0.3, ease: "power2.out" }, 0);
  jobs.set(lens, tl);
}

// Start in the right state, no animation
lenses.forEach(l => {
  const on = l.classList.contains("on");
  l.dataset.lit = on ? "1" : "0";
  l.dataset.mode = "";
  setInstant(l, on);
});

// The one function that changes the light.
// Names: red, yellow, green, blink-red, blink-yellow, blink-green, think, ask, off
function setActive(name) {
  const blink = /^blink-(red|yellow|green)$/.exec(name);
  const mode  = blink ? "blink" : (name === "think" || name === "ask") ? name : "";
  const color = blink ? blink[1] : mode ? "yellow" : name;

  lenses.forEach(l => {
    const on      = l.classList.contains(color);
    const wasOn   = l.dataset.lit === "1";
    const newMode = (on && (mode === "blink" || l === yellow)) ? mode : "";

    l.classList.toggle("on", on);
    l.dataset.lit = on ? "1" : "0";

    if (on && !wasOn) {                       // light turns on
      l.dataset.mode = newMode;
      turnOn(l, 0.15, newMode);               // old light fades first, new one follows
    } else if (!on && wasOn) {                // light turns off
      l.dataset.mode = "";
      turnOff(l);
    } else if (on && wasOn && (l.dataset.mode || "") !== newMode) {
      l.dataset.mode = newMode;               // same light, different mode
      retarget(l, newMode);
    }
  });
  document.querySelectorAll(".controls button").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.light === name));
  });
  if (window.agentSound) window.agentSound.play(name);
}
window.setTrafficLight = setActive;   // your own code can call this

// Manual controls
document.querySelectorAll(".controls button").forEach(b => {
  b.addEventListener("click", () => setActive(b.dataset.light));
});

// Keyboard: 1 red, 2 yellow, 3 green, 4 thinking, 5 question, 6/7/8 blink red/yellow/green, 0 off
document.addEventListener("keydown", e => {
  const map = {
    "1": "red", "2": "yellow", "3": "green", "4": "think", "5": "ask",
    "6": "blink-red", "7": "blink-yellow", "8": "blink-green", "0": "off"
  };
  if (map[e.key]) setActive(map[e.key]);
});
