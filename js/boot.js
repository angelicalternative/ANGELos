// Boot sequence: "starting system up" screen → startup chime → fade → welcome notice.
(function () {
  const boot = document.getElementById('boot');
  if (!boot) return;
  // Seen it this week (checked in index.html before the page paints): go straight to the desktop.
  if (document.documentElement.classList.contains('skip-boot')) { boot.remove(); return; }
  const bar = boot.querySelector('.boot-bar');
  const prompt = boot.querySelector('.boot-start');
  const SEG = 20;
  bar.innerHTML = '<i></i>'.repeat(SEG);
  const segs = [...bar.children];

  // ── Startup chime (synthesised — a warm F♯-major swell like a classic Mac) ──
  let ctx = null;
  if (!matchMedia('(pointer: coarse)').matches) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  }
  function chime() {
    if (!ctx) return;
    const t = ctx.currentTime + 0.02;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, t);
    master.gain.exponentialRampToValueAtTime(0.32, t + 0.04);
    master.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2400;
    master.connect(lp).connect(ctx.destination);
    [92.5, 185, 277.18, 369.99, 466.16, 554.37].forEach((f, k) => {
      ['sine', 'triangle'].forEach((type, j) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type;
        o.frequency.value = f;
        o.detune.value = (j ? 4 : -3) + k;
        g.gain.value = (j ? 0.35 : 0.6) / (1 + k * 0.35);
        o.connect(g).connect(master);
        o.start(t);
        o.stop(t + 3.3);
      });
    });
  }
  const audioReady = () => !ctx || ctx.state === 'running';

  // ── Loading bar: random 1.2–2 s, filled in slightly uneven bursts ──
  const duration = 1200 + Math.random() * 800;
  const start = performance.now();
  function step() {
    const p = Math.min(1, (performance.now() - start) / duration);
    // Ease-in-out with a little jitter so it feels like a real machine thinking.
    const eased = p < 1 ? Math.min(1, p * p * (3 - 2 * p) + (Math.random() - 0.5) * 0.04) : 1;
    const shown = Math.max(+bar.dataset.shown || 0, Math.floor(eased * SEG));
    bar.dataset.shown = shown;
    segs.forEach((s, k) => s.classList.toggle('on', k < shown));
    if (p < 1) setTimeout(step, 40 + Math.random() * 50);
    else finishLoading();
  }
  step();

  // Phones and tablets skip the chime: no sound, no tap needed, straight to the desktop.
  const touch = matchMedia('(pointer: coarse)').matches;

  function finishLoading() {
    if (touch) return enter({ silent: true });
    if (ctx && ctx.state !== 'running') ctx.resume().catch(() => {});
    // Give the browser a beat to allow audio; if it won't, ask for a click.
    setTimeout(() => {
      if (audioReady()) return enter();
      boot.classList.add('needs-click');
      prompt.hidden = false;
      // iPhone Safari only unlocks sound on a finished tap (touchend / click), and its
      // resume() promise can hang when called too early, so go in straight away.
      const EVENTS = ['pointerup', 'touchend', 'click', 'keydown'];
      let gone = false;
      const go = () => {
        if (gone) return;
        gone = true;
        EVENTS.forEach(ev => window.removeEventListener(ev, go, true));
        if (ctx) { try { ctx.resume().catch(() => {}); } catch (e) {} }
        enter();
      };
      EVENTS.forEach(ev => window.addEventListener(ev, go, true));
    }, 120);
  }

  function enter({ silent = false } = {}) {
    try { localStorage.setItem('angelos-boot', String(Date.now())); } catch (e) {}
    if (!silent) chime();
    boot.classList.add('done');
    setTimeout(() => { boot.remove(); welcome(); }, 350);
  }

  // ── Welcome notice: closes itself after ~4.5 s, or with the X ──
  function welcome() {
    const w = document.getElementById('win-welcome');
    if (!w) return;
    w.hidden = false;
    w.style.zIndex = 9999;
    w.style.left = Math.max(8, (window.innerWidth - w.offsetWidth) / 2) + 'px';
    w.style.top = Math.max(8, (window.innerHeight - w.offsetHeight) / 2 - 40) + 'px';
    w.classList.add('counting');
    const timer = setTimeout(close, 4500);
    w.querySelector('[data-close]').addEventListener('click', () => clearTimeout(timer), { once: true });
    function close() {
      w.classList.add('leaving');
      setTimeout(() => { w.hidden = true; w.classList.remove('leaving', 'counting'); }, 250);
    }
  }
})();
