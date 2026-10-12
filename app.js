(() => {
  const STORAGE_KEY = "writer:text";
  const DEFAULT_MINUTES = 5;

  // Optional override: yoursite.vercel.app/?t=10  -> 10 minute dump
  const param = parseFloat(new URLSearchParams(location.search).get("t"));
  const MINUTES = param > 0 ? param : DEFAULT_MINUTES;
  const DURATION_MS = MINUTES * 60 * 1000;

  const editor = document.getElementById("editor");
  const count = document.getElementById("count");
  const timerBtn = document.getElementById("timer");

  /* ---------- Autosave ---------- */

  try {
    editor.value = localStorage.getItem(STORAGE_KEY) || "";
  } catch (_) {}

  let typingTimeout;
  const updateCount = () => {
    const words = editor.value.trim().split(/\s+/).filter(Boolean).length;
    count.textContent = `${words} word${words === 1 ? "" : "s"}`;
  };

  editor.addEventListener("input", () => {
    try {
      localStorage.setItem(STORAGE_KEY, editor.value);
    } catch (_) {}
    updateCount();

    document.body.classList.add("typing");
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(
      () => document.body.classList.remove("typing"),
      1500
    );
  });

  updateCount();

  /* ---------- 5-Minute Brain Dump timer ---------- */

  const idleLabel = `Brain dump · ${formatTime(DURATION_MS)}`;
  let endTime = null;
  let tick = null;

  function formatTime(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(total / 60);
    const s = String(total % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function reset() {
    clearInterval(tick);
    tick = null;
    endTime = null;
    timerBtn.classList.remove("running", "done");
    timerBtn.textContent = idleLabel;
  }

  function start() {
    reset();
    endTime = Date.now() + DURATION_MS;
    timerBtn.classList.add("running");
    render();
    tick = setInterval(render, 250);
    editor.focus();
  }

  function render() {
    const remaining = endTime - Date.now();
    if (remaining <= 0) return finish();
    timerBtn.textContent = `Stop · ${formatTime(remaining)}`;
  }

  function finish() {
    clearInterval(tick);
    tick = null;
    endTime = null;
    timerBtn.classList.remove("running");
    timerBtn.classList.add("done");
    timerBtn.textContent = "Time's up — click to restart";
    beep();
    // Keep the text; the writer can keep going or copy it out.
  }

  function beep() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 660;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (_) {}
  }

  timerBtn.addEventListener("click", () => {
    if (endTime) reset(); // running -> stop
    else start();         // idle or done -> start
  });

  // Keep timer accurate when the tab was in the background
  document.addEventListener("visibilitychange", () => {
    if (endTime && !document.hidden) render();
  });

  timerBtn.textContent = idleLabel;
})();
