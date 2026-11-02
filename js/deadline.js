// DEADLINE (deadline.html): the editorial game. You're the new intern at Angelo Studio and the
// issue goes to print in 60 seconds: pick the cover photo, the masthead colour and the cover
// line, then see your cover next to the real one. Content lives in js/deadline-config.js.
// Everything on screen is pixel art: covers and photos are drawn small and scaled up crisply.
// The CD-ROM intro, sounds and sun mascot match Angel Records (records.html).
(function () {
  const cfg = window.DEADLINE;
  const root = document.getElementById('arp');
  if (!cfg || !root) return;

  const ES = {
    'DEADLINE': 'DEADLINE', 'ANGEL RECORDS': 'DEADLINE', 'Double-click to start': 'Doble clic para empezar', 'Tap to start': 'Toca para empezar',
    'Skip': 'Saltar', 'Tap to play': 'Toca para jugar', 'loading...': 'cargando...', 'Replay intro': 'Ver la intro otra vez',
    'Back to ANGELos': 'Volver a ANGELos', 'ISSUE': 'EDICIÓN', 'START': 'EMPEZAR', 'Best': 'Mejor', 'Previous issue': 'Edición anterior', 'Next issue': 'Edición siguiente',
    'an editorial game': 'un juego editorial', 'GO!': '¡VAMOS!', 'PHOTO': 'FOTO', 'COLOR': 'COLOR', 'COVER LINE': 'TITULAR',
    'SEND TO PRINT': 'ENVIAR A IMPRENTA', 'Pick a cover photo': 'Escoge la foto de portada', 'Pick the masthead colour': 'Escoge el color del logo',
    'Pick the cover line': 'Escoge el titular', 'PRINTING…': 'IMPRIMIENDO…', 'YOUR COVER': 'TU PORTADA', 'THE REAL ONE': 'LA REAL',
    'Score': 'Puntaje', 'Time bonus': 'Bonus de tiempo', 'DOWNLOAD MY COVER': 'DESCARGAR MI PORTADA', 'TRY AGAIN': 'OTRA VEZ',
    'NEXT ISSUE': 'SIGUIENTE EDICIÓN', 'MENU': 'MENÚ', 'Pick all three first!': '¡Primero escoge las tres cosas!',
    'Time’s up!': '¡Se acabó el tiempo!', 'nothing picked': 'nada escogido', 'GRATUITA': 'GRATUITA', 'BY': 'BY', 'STUDIO': 'STUDIO',
    'Sound': 'Sonido',
  };
  const T = s => (I18N.es && ES[s] != null ? ES[s] : s);
  const pick = (o, f) => I18N.pick(o, f);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rnd = a => a[Math.floor(Math.random() * a.length)];
  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = () => matchMedia('(pointer: coarse)').matches;

  // ── Saved progress (this page only) ──
  const KEY = 'deadline-v1';
  const store = (() => {
    let mem = null;
    const load = () => {
      if (mem) return mem;
      try { mem = Object.assign({ best: {}, next: 0, introSeen: false }, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { mem = { best: {}, next: 0, introSeen: false }; }
      return mem;
    };
    return { get state() { return load(); }, save() { try { localStorage.setItem(KEY, JSON.stringify(load())); } catch (e) {} } };
  })();
  const issues = cfg.issues || [];

  // ── Page skeleton: the fake desktop (intro) and the game ──
  root.innerHTML = `
    <section class="ar-desk" hidden>
      <button type="button" class="ar-desk-icon" data-ar="launch">
        <span class="ar-desk-art"><img src="assets/icons/deadline.svg" alt="">${shortcutArrow()}</span>
        <span class="ar-desk-label">DEADLINE</span>
      </button>
      <p class="ar-desk-hint"></p>
    </section>
    <section class="ar-monitor" hidden>
      <div class="ar dl" tabindex="-1">
        <div class="dl-game" hidden>
          <header class="dl-bar">
            <span class="dl-issue"></span>
            <output class="dl-clock" aria-live="off"></output>
            <button type="button" class="px-btn dl-print" data-ar="print"><span></span></button>
          </header>
          <div class="dl-work">
            <figure class="dl-cover"><canvas class="dl-cover-canvas" width="150" height="194"></canvas></figure>
            <div class="dl-panel">
              <nav class="dl-steps"></nav>
              <p class="dl-ask"></p>
              <div class="dl-options"></div>
            </div>
          </div>
        </div>
        <div class="ar-talk">
          <div class="ar-face"></div>
          <div class="ar-say"><b class="ar-name"></b><p class="ar-text"></p></div>
        </div>
        <div class="ar-screen" hidden></div>
      </div>
    </section>`;
  const $ = s => root.querySelector(s);
  const desk = $('.ar-desk'), monitor = $('.ar-monitor'), body = $('.ar');
  const game = $('.dl-game'), face = $('.ar-face'), say = $('.ar-text'), nameEl = $('.ar-name'), screen = $('.ar-screen');
  const coverCanvas = $('.dl-cover-canvas');

  function shortcutArrow() {
    return '<i class="ar-desk-arrow" aria-hidden="true"><svg viewBox="0 0 11 11" shape-rendering="crispEdges"><rect width="11" height="11" fill="#000"/><rect x="1" y="1" width="9" height="9" fill="#fff"/><rect x="4" y="3" width="4" height="1" fill="#000"/><rect x="6" y="2" width="1" height="3" fill="#000"/><rect x="7" y="3" width="1" height="2" fill="#000"/><rect x="3" y="4" width="2" height="1" fill="#000"/><rect x="3" y="5" width="1" height="4" fill="#000"/><rect x="2" y="7" width="1" height="1" fill="#000"/></svg></i>';
  }

  // ── Cute sound effects, made in the browser (no files). Off until the first tap/click. ──
  const SFX = (() => {
    const KEY_S = 'angel-records-sound';
    let on = true;
    try { on = localStorage.getItem(KEY_S) !== 'off'; } catch (e) {}
    let ctx = null, out = null, pad = null;
    const ready = () => {
      if (!on) return null;
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        out = ctx.createGain(); out.gain.value = 0.9;
        // A little room: a soft feedback echo makes everything feel dreamy.
        const echo = ctx.createDelay(); echo.delayTime.value = 0.23;
        const fb = ctx.createGain(); fb.gain.value = 0.28;
        const wet = ctx.createGain(); wet.gain.value = 0.35;
        out.connect(ctx.destination); out.connect(echo); echo.connect(fb); fb.connect(echo); echo.connect(wet); wet.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    };
    const hz = n => 440 * Math.pow(2, (n - 69) / 12); // MIDI note → frequency
    // One soft "bell" note: sine + a quiet octave sparkle, quick attack, gentle fade.
    function note(n, at = 0, len = 0.35, vol = 0.16, type = 'sine') {
      const c = ready(); if (!c) return;
      const t = c.currentTime + at;
      [[1, vol], [2, vol * 0.18]].forEach(([mul, v]) => {
        const o = c.createOscillator(), g = c.createGain();
        o.type = type; o.frequency.value = hz(n) * mul;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0008, t + len);
        o.connect(g); g.connect(out); o.start(t); o.stop(t + len + 0.05);
      });
    }
    // A warm pad: detuned soft voices through a low-pass filter, swelling in slowly.
    const CHORDS = [[60, 64, 67, 71], [57, 60, 64, 67], [65, 69, 72, 76], [62, 65, 69, 72]]; // Cmaj7, Am7, Fmaj7, Dm7
    function padStart() {
      const c = ready(); if (!c || pad) return;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 0.4;
      const g = c.createGain(); g.gain.setValueAtTime(0, c.currentTime); g.gain.linearRampToValueAtTime(0.11, c.currentTime + 1.6);
      lp.connect(g); g.connect(out);
      const voices = CHORDS[0].flatMap(n => [-6, 6].map(d => {
        const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = hz(n - 12); o.detune.value = d;
        const vg = c.createGain(); vg.gain.value = 0.12; o.connect(vg); vg.connect(lp); o.start(); return o;
      }));
      // A slow wobble on the filter so the pad breathes.
      const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 0.18; lg.gain.value = 260; lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
      pad = { g, voices, lfo, step: 0 };
    }
    function padNext() {
      if (!pad || !ctx) return;
      pad.step = (pad.step + 1) % CHORDS.length;
      const ch = CHORDS[pad.step], t = ctx.currentTime;
      pad.voices.forEach((o, i) => o.frequency.setTargetAtTime(hz(ch[i >> 1] - 12), t, 0.35));
    }
    function padStop() {
      if (!pad || !ctx) return;
      const p = pad, t = ctx.currentTime; pad = null;
      p.g.gain.cancelScheduledValues(t); p.g.gain.setValueAtTime(p.g.gain.value, t); p.g.gain.linearRampToValueAtTime(0, t + 1.2);
      setTimeout(() => { p.voices.forEach(o => o.stop()); p.lfo.stop(); }, 1400);
    }
    return {
      get on() { return on; },
      toggle() {
        on = !on;
        try { localStorage.setItem(KEY_S, on ? 'on' : 'off'); } catch (e) {}
        if (!on) { padStop(); if (ctx) ctx.suspend(); } else { ready(); note(76, 0, 0.25, 0.12); }
        return on;
      },
      wake: () => ready(),
      tap: () => note(84, 0, 0.12, 0.08),                                  // tiny tick for buttons
      blip: () => { note(88, 0, 0.18, 0.07); note(95, 0.06, 0.22, 0.05); }, // a new loading card
      bloop: () => { note(72, 0, 0.16, 0.12, 'triangle'); note(79, 0.07, 0.2, 0.1, 'triangle'); }, // press / select
      chime: () => [72, 76, 79, 84, 88].forEach((n, i) => note(n, i * 0.09, 0.9, 0.11)),          // logo sparkle
      flip: () => note(67 + Math.floor(Math.random() * 3) * 2, 0, 0.09, 0.07, 'triangle'),          // flipping a sleeve
      nope: () => { note(64, 0, 0.14, 0.08, 'triangle'); note(60, 0.08, 0.2, 0.07, 'triangle'); }, // just a filler record
      found: () => [72, 76, 79, 84, 79, 84, 88, 91].forEach((n, i) => note(n, i * 0.075, 0.5, 0.12)), // yay!
      padStart, padNext, padStop,
    };
  })();
  const soundBtn = document.createElement('button');
  soundBtn.type = 'button';
  soundBtn.className = 'ar-sound';
  const paintSound = () => {
    soundBtn.textContent = SFX.on ? '♪ ON' : '♪ OFF';
    soundBtn.setAttribute('aria-pressed', String(SFX.on));
    soundBtn.setAttribute('aria-label', I18N.es ? 'Sonido' : 'Sound');
  };
  soundBtn.addEventListener('click', () => { SFX.toggle(); paintSound(); });
  document.body.appendChild(soundBtn);
  paintSound();
  // Extra sounds for the editorial game.
  const tick = hi => { try { SFX.wake(); } catch (e) {} if (!SFX.on) return; (hi ? SFX.tap : SFX.flip)(); };

  // ── Pixel shopkeeper: the sun mascot (28×35 cells), drawn as SVG ──
  function ownerSVG() {
    const OR = '#F5A623', OL = '#141010', CR = '#F2EAD3', MR = '#8C1F2B', GD = '#E3A72F', HI = '#FFC75A';
    const out = [], ox = 14, oy = 14;
    const q = (x, y, w, h, c, cls) => out.push(`<rect x="${x + ox}" y="${y + oy}" width="${w}" height="${h}" fill="${c}"${cls ? ` class="${cls}"` : ''}/>`);
    const disc = (x, y, r, c) => { for (let dy = -r; dy <= r; dy++) { const hw = Math.round(Math.sqrt(r * r - dy * dy + 0.3)); q(x - hw, y + dy, 2 * hw + 1, 1, c); } };
    q(-12, 9, 24, 6, OL); q(-10, 8, 20, 13, OL); q(-11, 10, 22, 4, CR); q(-9, 9, 18, 12, CR); q(4, 10, 4, 10, '#E2D6B8');
    q(-11, 13, 3, 1, MR); q(8, 13, 3, 1, MR); q(-3, 8, 6, 1, MR); q(-2, 9, 4, 1, MR);
    q(-3, 11, 6, 1, GD); q(-5, 12, 10, 1, MR); q(-5, 14, 10, 1, MR); q(-3, 15, 6, 1, GD);
    const arm = [[-11, 14], [-10, 14], [-11, 15], [-10, 15], [-11, 16], [-10, 16], [-10, 17], [-9, 17], [-9, 18], [-8, 18], [-7, 18], [-8, 19], [-7, 19], [-6, 19]];
    [arm, arm.map(([x, y]) => [-1 - x, y])].forEach(a => {
      const has = new Set(a.map(p => p.join()));
      a.forEach(([x, y]) => [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => { if (!has.has([x + dx, y + dy].join()) && y + dy >= 14) q(x + dx, y + dy, 1, 1, OL); }));
      a.forEach(([x, y]) => q(x, y, 1, 1, OR));
    });
    q(-2, 6, 4, 3, OL); q(-1, 6, 2, 3, OR);
    // Eight even petals, like the logo.
    for (let a = 0; a < 360; a += 45) {
      const r = a * Math.PI / 180, x = Math.round(11 * Math.sin(r)), y = Math.round(-11 * Math.cos(r));
      if (y > 6) continue; // the bottom petals sit behind the shirt
      disc(x, y, 3, OL); disc(x, y, 2, OR); q(x - 1, y - 1, 1, 1, HI);
    }
    disc(0, 0, 7, OL); disc(0, 0, 6, OR); q(-4, -5, 3, 1, HI);
    q(-3, -1, 1, 2, OL, 'eye-open'); q(1, -1, 1, 2, OL, 'eye-open');
    q(-4, 0, 2, 1, OL, 'eye-shut'); q(1, 0, 2, 1, OL, 'eye-shut');
    return `<svg class="ar-owner-art" viewBox="0 0 28 35" shape-rendering="crispEdges" aria-hidden="true">${out.join('')}</svg>`;
  }
  const editorArt = () => ownerSVG();

  // Blink every few seconds; a happy wiggle on good news.
  setInterval(() => {
    if (monitor.hidden || still()) return;
    body.classList.add('blink');
    setTimeout(() => body.classList.remove('blink'), 150);
  }, 3600);
  const wiggle = () => {
    if (still()) return;
    body.classList.remove('happy'); void body.offsetWidth; body.classList.add('happy');
    setTimeout(() => body.classList.remove('happy'), 1200);
  };

  function talk(text) {
    nameEl.textContent = text ? `${pick(cfg.editor, 'name') || 'Angelo'} · ${pick(cfg.editor, 'title') || ''}` : '';
    say.textContent = text;
  }
  const btn = (act, label, extra = '') => `<button type="button" class="px-btn ar-btn" data-ar="${act}" ${extra}><span>${label}</span></button>`;
  const glyphBtn = (act, glyph, label) => `<button type="button" class="pbtn ar-nav" data-ar="${act}" aria-label="${esc(label)}">${Pixel.glyph(glyph)}</button>`;

  // ── Pixel images: every photo and cover is drawn small, then scaled up crisply ──
  const imgCache = new Map();
  function loadImg(src) {
    if (!imgCache.has(src)) imgCache.set(src, new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; }));
    return imgCache.get(src);
  }
  function drawCover(ctx, img, W, H, focusY = 0.35) {
    const r = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const w = img.naturalWidth * r, h = img.naturalHeight * r;
    ctx.drawImage(img, (W - w) / 2, (H - h) * focusY, w, h);
  }
  // A small pixel thumbnail of a photo (for the options and loading cards).
  function pixelThumb(src, W, H, cls = '') {
    const c = document.createElement('canvas');
    c.width = W; c.height = H; c.className = 'dl-px ' + cls;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#C8C0B0'; ctx.fillRect(0, 0, W, H);
    loadImg(src).then(img => { if (img) drawCover(ctx, img, W, H); });
    return c;
  }

  // ── The cover, drawn at 150×194 like a real Angelo cover, in the pixel Times font ──
  const FONT = '"Pixel Times", "Times New Roman", serif';
  async function renderCover(canvas, issue, ch) {
    const W = canvas.width, H = canvas.height, ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.fillStyle = '#B9B2A4'; ctx.fillRect(0, 0, W, H);
    const photo = ch.photo != null ? issue.photos[ch.photo] : null;
    if (photo) { const img = await loadImg(photo.src); if (img) drawCover(ctx, img, W, H); }
    else {
      ctx.fillStyle = '#8D8577';
      ctx.font = `${Math.round(H * 0.2)}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('?', W / 2, H * 0.58);
    }
    const color = ch.color != null ? issue.colors[ch.color].hex : 'rgba(255,255,255,.55)';
    // Masthead: ANGELO across the top, as wide as the cover.
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    let size = Math.round(H * 0.2);
    ctx.font = `${size}px ${FONT}`;
    const mw = ctx.measureText('ANGELO').width;
    size = Math.floor(size * (W * 0.94) / mw);
    ctx.font = `${size}px ${FONT}`;
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillText('ANGELO', W / 2 + 1, 2 + 1);
    ctx.fillStyle = color; ctx.fillText('ANGELO', W / 2, 2);
    // BY ... STUDIO under it, and the little corner words.
    const mastBottom = 2 + (ctx.measureText('ANGELO').actualBoundingBoxDescent || size * 0.8);
    ctx.font = `${Math.max(6, Math.round(H * 0.04))}px ${FONT}`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left'; ctx.fillText(T('BY'), 4, mastBottom + 1);
    ctx.textAlign = 'right'; ctx.fillText(T('STUDIO'), W - 4, mastBottom + 1);
    ctx.textBaseline = 'bottom'; ctx.font = `${Math.max(5, Math.round(H * 0.032))}px ${FONT}`;
    ctx.textAlign = 'left'; ctx.fillText(T('GRATUITA'), 4, H - 3);
    ctx.textAlign = 'right'; ctx.fillText(issue.edition || '', W - 4, H - 3);
    // Cover line, bottom right.
    const line = ch.line != null ? issue.lines[ch.line] : null;
    if (line) {
      const words = line.text.split(' ');
      const rows = []; let cur = '';
      ctx.font = `${Math.round(H * 0.085)}px ${FONT}`;
      words.forEach(w => { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > W * 0.62 && cur) { rows.push(cur); cur = w; } else cur = t; });
      rows.push(cur);
      const lh = Math.round(H * 0.08), subH = Math.round(H * 0.042);
      let y = H - 12 - subH;
      ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
      ctx.font = `${subH}px ${FONT}`;
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillText(line.sub || '', W - 4 + 1, y + subH + 1);
      ctx.fillStyle = color === 'rgba(255,255,255,.55)' ? '#fff' : color; ctx.fillText(line.sub || '', W - 4, y + subH);
      ctx.font = `${Math.round(H * 0.085)}px ${FONT}`;
      rows.slice().reverse().forEach((r, i) => {
        const yy = y - i * lh;
        ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillText(r, W - 4 + 1, yy + 1);
        ctx.fillStyle = ch.color != null ? issue.colors[ch.color].hex : '#fff'; ctx.fillText(r, W - 4, yy);
      });
    }
  }
  // The real cover, pixelated the same way so they can be compared.
  async function renderReal(canvas, issue) {
    const ctx = canvas.getContext('2d');
    const img = await loadImg(issue.real);
    ctx.fillStyle = '#B9B2A4'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (img) drawCover(ctx, img, canvas.width, canvas.height, 0);
  }

  // ── Screens ──
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearLater = () => { timers.forEach(clearTimeout); timers = []; };
  function showScreen(html, cls) {
    screen.className = 'ar-screen ' + (cls || '');
    screen.innerHTML = html;
    screen.hidden = false;
  }
  const hideScreen = () => { screen.hidden = true; screen.innerHTML = ''; };
  let mode = 'idle';
  const introSeen = () => !!store.state.introSeen && !/[?&]intro\b/.test(location.search);
  const markIntroSeen = () => { store.state.introSeen = true; store.save(); };

  // Pixel vinyl (16×16); the grey glint makes the spin visible.
  function vinyl() {
    const out = [];
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const d = Math.hypot(x + 0.5 - 8, y + 0.5 - 8);
      let c = null;
      if (d <= 8) c = d > 7.2 ? '#000' : d > 3 ? ((Math.round(d * 2) % 2) ? '#1A1A1A' : '#2E2E2E') : d > 1 ? '#E04A4A' : '#000';
      if (c && d > 3.5 && d < 6.5 && x > 8 && y < 7 && x - 8 > 7 - y - 2) c = '#9A9A9A';
      if (d <= 3 && d > 1 && x < 8 && y < 8) c = '#F7D417';
      if (c) out.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>`);
    }
    return `<svg class="ar-vinyl" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">${out.join('')}</svg>`;
  }
  const sparkle = () => `<svg class="ar-sparkle" viewBox="0 0 9 9" shape-rendering="crispEdges" aria-hidden="true">
    <rect x="4" y="0" width="1" height="9" fill="#fff"/><rect x="0" y="4" width="9" height="1" fill="#fff"/>
    <rect x="3" y="3" width="3" height="3" fill="#fff"/><rect x="4" y="2" width="1" height="5" fill="#fff"/><rect x="2" y="4" width="5" height="1" fill="#fff"/></svg>`;
  const skipBtn = () => `<button type="button" class="ar-skip" data-ar="skip">${esc(T('Skip'))} ›</button>`;

  // ── The desktop: a shortcut icon; clicking it selects it, then the busy hourglass ──
  function showDesk() {
    mode = 'desk';
    desk.hidden = false; monitor.hidden = true;
    $('.ar-desk-hint').textContent = touch() ? T('Tap to start') : T('Double-click to start');
    requestAnimationFrame(() => $('.ar-desk-icon').focus({ preventScroll: true }));
  }
  let launching = false;
  function launch() {
    if (launching) return;
    launching = true;
    SFX.wake(); SFX.bloop();
    const icon = $('.ar-desk-icon');
    icon.classList.add('is-selected');
    $('.ar-desk-hint').textContent = '';
    const hg = document.createElement('div');
    setTimeout(() => {
      document.documentElement.classList.add('ar-busy');
      if (touch()) {
        const r = icon.getBoundingClientRect();
        hg.className = 'ar-touch-busy';
        hg.innerHTML = `<img src="assets/icons/cursor-busy.svg" alt="">`;
        hg.style.left = r.left + r.width / 2 + 'px'; hg.style.top = r.top + r.height / 2 + 'px';
        document.body.appendChild(hg);
      }
    }, 450);
    setTimeout(() => {
      document.documentElement.classList.remove('ar-busy');
      hg.remove();
      icon.classList.remove('is-selected');
      launching = false;
      desk.hidden = true;
      openMonitor();
      intro();
    }, still() ? 900 : 3100);
  }
  function openMonitor() { monitor.hidden = false; face.innerHTML = editorArt(); }

  // ── The CD-ROM intro: blank → publisher → title → loading cards → menu ──
  function intro() {
    clearLater();
    mode = 'intro';
    game.hidden = true; talk('');
    showScreen(skipBtn(), 'is-blank ar-crt');
    later(publisher, 1000);
  }
  function publisher() {
    showScreen(`
      <div class="ar-pub">
        <img class="ar-pub-logo" src="assets/angel-records/angelos-original-games.png" alt="ANGELOS Original Games">
        ${sparkle()}
      </div>${skipBtn()}`, 'is-pub ar-crt');
    later(() => SFX.chime(), 700);
    later(pressTitle, 3600);
  }
  const logo = small => `<h1 class="ar-logo dl-logo${small ? ' ar-logo-sm' : ''}">${clock()}<span class="ar-chrome">DEAD</span><span class="ar-chrome ar-chrome-2">LINE</span></h1>`;
  function pressTitle() {
    mode = 'press';
    const press = touch() ? esc(T('Tap to play')) : I18N.es ? 'Presiona <kbd>espacio</kbd> para jugar' : 'Press <kbd>space</kbd> to play';
    showScreen(`<div class="ar-press">${logo()}<p class="ar-press-go">${press}</p></div>${skipBtn()}`, 'is-press ar-crt');
    focusFirst(body);
  }
  function loadingCards(count, each, then) {
    clearLater();
    mode = 'loading';
    SFX.padStart();
    const deck = ((cfg.intro && cfg.intro.captions) || []).slice().sort(() => Math.random() - 0.5).slice(0, count);
    const link = s => esc(s).replace(/\[([^\]]+)\]/g, '<a class="ar-wiki-link">$1</a>');
    const expand = '<svg class="ar-wiki-expand" viewBox="0 0 11 9" shape-rendering="crispEdges" aria-hidden="true"><rect x="0" y="2" width="7" height="7" fill="#999"/><rect x="1" y="3" width="5" height="5" fill="#fff"/><rect x="4" y="0" width="7" height="6" fill="#999"/><rect x="5" y="1" width="5" height="4" fill="#fff"/></svg>';
    showScreen(`
      <figure class="ar-wiki"><span class="ar-wiki-img"></span><figcaption><span></span>${expand}</figcaption></figure>
      <p class="ar-wiki-loading">${vinyl()}<span>${esc(T('loading...'))}</span></p>
      ${skipBtn()}`, 'is-wiki ar-crt');
    const fig = screen.querySelector('.ar-wiki'), imgBox = fig.querySelector('.ar-wiki-img'), cap = fig.querySelector('figcaption span');
    let i = 0;
    const show = () => {
      const x = deck[i];
      if (x) {
        SFX.blip(); if (i > 0) SFX.padNext();
        imgBox.replaceChildren(pixelThumb(x.photo, 120, 90));
        cap.innerHTML = link(pick(x, 'text'));
      }
      fig.classList.remove('is-out');
      i++;
      if (i < deck.length) later(() => { fig.classList.add('is-out'); later(show, still() ? 150 : 450); }, each);
      else later(then, each);
    };
    if (!deck.length) { fig.hidden = true; later(then, each); } else show();
  }
  function finishIntro() { markIntroSeen(); SFX.padStop(); menu(); }

  // A pixel alarm clock for the logo (16×16).
  function clock() {
    const out = [];
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const d = Math.hypot(x + 0.5 - 8, y + 0.5 - 9);
      let c = null;
      if (d <= 6.8) c = d > 5.6 ? '#141010' : '#FFF3C4';
      if ((x === 3 || x === 12) && y <= 3 && y >= 1) c = '#141010';
      if ((y === 1 && (x >= 2 && x <= 4 || x >= 11 && x <= 13))) c = '#E04A4A';
      if (x === 8 && y >= 5 && y <= 9) c = '#141010';
      if (y === 9 && x >= 8 && x <= 10) c = '#E04A4A';
      if (c) out.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>`);
    }
    return `<svg class="ar-vinyl dl-clockicon" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">${out.join('')}</svg>`;
  }

  // ── Menu: pick an issue ──
  let at = 0;
  function menu() {
    clearLater();
    mode = 'menu';
    game.hidden = true;
    at = Math.min(store.state.next || 0, issues.length - 1);
    const iss = issues[at];
    const best = store.state.best[iss.id];
    showScreen(`
      <div class="ar-title">
        ${logo(true)}
        <p class="ar-title-tag">${esc(T('an editorial game'))}</p>
        <div class="ar-shop-pick">
          ${glyphBtn('iss-prev', 'prev', T('Previous issue'))}
          <div class="ar-shop-card dl-issue-card">
            <span class="dl-blank"><b>${esc(T('ISSUE'))} ${esc(iss.number)}</b><small>?</small></span>
            <p><b>${esc(T('ISSUE'))} ${esc(iss.number)}</b><span>${esc(iss.date)}${best != null ? ` · ${esc(T('Best'))}: ${best}` : ''}</span></p>
          </div>
          ${glyphBtn('iss-next', 'next', T('Next issue'))}
        </div>
        ${btn('brief', esc(T('START')), 'data-autofocus')}
        <button type="button" class="ar-replay" data-ar="intro">${esc(T('Replay intro'))}</button>
      </div>`, 'is-title');
    talk('');
    focusFirst();
  }

  // ── A round ──
  let round = null, timer = null;
  function brief() {
    const iss = issues[at];
    round = { iss, ch: { photo: null, color: null, line: null }, step: 'photo', left: cfg.seconds || 60, t0: 0 };
    hideScreen();
    game.hidden = false;
    paintGame();
    talk(pick(iss, 'brief'));
    showScreen(`
      <div class="ar-found dl-brief">
        <p class="ar-found-head">${esc(T('ISSUE'))} ${esc(iss.number)}</p>
        <p class="dl-brief-text">${esc(pick(iss, 'brief'))}</p>
        ${btn('go', esc(T('GO!')), 'data-autofocus')}
      </div>`, 'is-found');
    focusFirst();
  }
  function go() {
    hideScreen();
    mode = 'play';
    round.t0 = Date.now();
    talk(pick(round.iss, 'brief'));
    clearInterval(timer);
    let lastSec = round.left;
    timer = setInterval(() => {
      const left = Math.max(0, (cfg.seconds || 60) - (Date.now() - round.t0) / 1000);
      round.left = left;
      paintClock();
      const s = Math.ceil(left);
      if (s !== lastSec) { lastSec = s; if (s <= 10 && s > 0) tick(true); }
      if (left <= 0) { clearInterval(timer); talk(T('Time’s up!')); printIssue(); }
    }, 100);
    focusFirst(game.querySelector('.dl-opt'));
  }
  const STEPS = [['photo', 'PHOTO', 'Pick a cover photo'], ['color', 'COLOR', 'Pick the masthead colour'], ['line', 'COVER LINE', 'Pick the cover line']];
  function paintClock() {
    const s = Math.ceil(round.left);
    const o = $('.dl-clock');
    o.textContent = `0:${String(s).padStart(2, '0')}`;
    o.classList.toggle('is-late', s <= 10);
  }
  function paintGame() {
    const { iss, ch, step } = round;
    $('.dl-issue').textContent = `${T('ISSUE')} ${iss.number}`;
    $('.dl-print span').textContent = T('SEND TO PRINT');
    paintClock();
    $('.dl-steps').innerHTML = STEPS.map(([k, label], i) =>
      `<button type="button" class="dl-step${k === step ? ' is-on' : ''}${ch[k] != null ? ' is-done' : ''}" data-ar="step" data-step="${k}"><b>${i + 1}</b>${esc(T(label))}</button>`).join('');
    $('.dl-ask').textContent = T(STEPS.find(s => s[0] === step)[2]);
    const opts = $('.dl-options');
    opts.className = 'dl-options is-' + step;
    if (step === 'photo') {
      opts.innerHTML = iss.photos.map((p, i) => `<button type="button" class="dl-opt${ch.photo === i ? ' is-picked' : ''}" data-ar="pick" data-i="${i}" aria-label="${esc(T('PHOTO'))} ${i + 1}"></button>`).join('');
      opts.querySelectorAll('.dl-opt').forEach((b, i) => b.appendChild(pixelThumb(iss.photos[i].src, 45, 58)));
    } else if (step === 'color') {
      opts.innerHTML = iss.colors.map((c, i) => `<button type="button" class="dl-opt dl-swatch${ch.color === i ? ' is-picked' : ''}" data-ar="pick" data-i="${i}" style="--sw:${c.hex}" aria-label="${esc(c.hex)}"><i></i></button>`).join('');
    } else {
      opts.innerHTML = iss.lines.map((l, i) => `<button type="button" class="dl-opt dl-line${ch.line === i ? ' is-picked' : ''}" data-ar="pick" data-i="${i}"><b>${esc(l.text)}</b><small>${esc(l.sub || '')}</small></button>`).join('');
    }
    renderCover(coverCanvas, iss, ch);
  }
  // The editor reacts to each pick (without giving the answer away completely).
  const REACT = {
    3: ['Ooh.', 'Yes. Yes yes yes.', 'Now we’re talking.'], 2: ['Okay, okay.', 'I can work with that.'], 1: ['Hmm.', 'Bold.'], 0: ['…are you sure?', 'Interesting choice. Not a compliment.'],
    es: { 3: ['Uy.', 'Sí. Sí sí sí.', 'Ahora sí.'], 2: ['Bueno, bueno.', 'Con eso puedo trabajar.'], 1: ['Mmm.', 'Atrevido.'], 0: ['…¿seguro?', 'Interesante elección. No es un cumplido.'] },
  };
  function choose(i) {
    const { iss, ch, step } = round;
    ch[step] = i;
    const list = step === 'photo' ? iss.photos : step === 'color' ? iss.colors : iss.lines;
    const sc = list[i].score;
    talk(rnd((I18N.es ? REACT.es : REACT)[sc]));
    if (sc === 3) wiggle();
    SFX.bloop();
    // Move on to the next step that still needs a pick.
    const next = STEPS.map(s => s[0]).find(k => ch[k] == null);
    if (next) round.step = next;
    paintGame();
    if (!next) focusFirst($('.dl-print'));
  }
  async function printIssue() {
    if (mode !== 'play') return;
    const { ch } = round;
    if (round.left > 0 && (ch.photo == null || ch.color == null || ch.line == null)) { talk(T('Pick all three first!')); SFX.nope(); return; }
    clearInterval(timer);
    mode = 'printing';
    const secsLeft = Math.ceil(round.left);
    showScreen(`<div class="dl-press"><div class="dl-press-slot"></div><canvas class="dl-px dl-press-sheet" width="150" height="194"></canvas><p class="dl-press-text">${esc(T('PRINTING…'))}</p></div>`, 'is-press dl-printing');
    const sheet = screen.querySelector('.dl-press-sheet');
    await renderCover(sheet, round.iss, ch);
    if (!still()) [0, 150, 300, 450, 600, 750, 900, 1050].forEach(t => later(() => tick(false), t));
    later(() => { SFX.found(); results(secsLeft); }, still() ? 400 : 1900);
  }
  function results(secsLeft) {
    mode = 'results';
    const { iss, ch } = round;
    const parts = [['PHOTO', iss.photos, ch.photo], ['COLOR', iss.colors, ch.color], ['COVER LINE', iss.lines, ch.line]];
    const pts = parts.reduce((a, [, list, i]) => a + (i != null ? list[i].score : 0), 0);
    const bonus = Math.round((secsLeft / (cfg.seconds || 60)) * 10);
    const total = Math.min(100, Math.round(pts / 9 * 90) + (pts ? bonus : 0));
    const grade = (cfg.grades || []).find(g => total >= g.min) || { title: '', line: '' };
    const st = store.state;
    st.best[iss.id] = Math.max(st.best[iss.id] || 0, total);
    st.next = (at + 1) % issues.length;
    store.save();
    talk(pick(grade, 'line'));
    if (total >= 70) wiggle();
    const rows = parts.map(([label, list, i]) => `<li><b>${esc(T(label))}</b><span>${i != null ? esc(pick(list[i], 'note')) : esc(T('nothing picked'))}</span></li>`).join('');
    showScreen(`
      <div class="ar-results dl-results">
        <p class="ar-found-head">${esc(pick(grade, 'title'))}</p>
        <div class="dl-compare">
          <figure><canvas class="dl-px dl-mine" width="150" height="194"></canvas><figcaption>${esc(T('YOUR COVER'))}</figcaption></figure>
          <figure><canvas class="dl-px dl-real" width="150" height="194"></canvas><figcaption>${esc(T('THE REAL ONE'))}</figcaption></figure>
        </div>
        <p class="dl-score">${esc(T('Score'))}: <b>${total}</b>/100 <small>(${esc(T('Time bonus'))} +${pts ? bonus : 0})</small></p>
        <ul class="dl-notes">${rows}</ul>
        <div class="dl-actions">
          ${btn('download', esc(T('DOWNLOAD MY COVER')))}${btn('again', esc(T('TRY AGAIN')))}${btn('next', esc(T('NEXT ISSUE')), 'data-autofocus')}${btn('menu', esc(T('MENU')))}
        </div>
      </div>`, 'is-results');
    renderCover(screen.querySelector('.dl-mine'), iss, ch);
    renderReal(screen.querySelector('.dl-real'), iss);
    focusFirst();
  }
  // Save your cover as a PNG: the 150×194 cover scaled up ×6 with crisp pixels.
  async function download() {
    const small = document.createElement('canvas'); small.width = 150; small.height = 194;
    await renderCover(small, round.iss, round.ch);
    const big = document.createElement('canvas'); big.width = 900; big.height = 1164;
    const bx = big.getContext('2d'); bx.imageSmoothingEnabled = false; bx.drawImage(small, 0, 0, 900, 1164);
    const a = document.createElement('a');
    a.download = `angelo-${round.iss.id}-my-cover.png`;
    a.href = big.toDataURL('image/png');
    a.click();
  }

  // ── Input ──
  const startLoadingIntro = () => loadingCards(5, still() ? 2500 : 4000, finishIntro);
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-ar]');
    if (!b) { if (mode === 'press') { SFX.bloop(); startLoadingIntro(); } return; }
    const a = b.dataset.ar;
    if (a === 'launch') { if (touch() || e.detail >= 2) launch(); else b.classList.add('is-selected'); return; }
    if (a !== 'pick') SFX.tap();
    ({
      skip: () => finishIntro(),
      intro: () => intro(),
      'iss-prev': () => { store.state.next = (at - 1 + issues.length) % issues.length; menu(); },
      'iss-next': () => { store.state.next = (at + 1) % issues.length; menu(); },
      brief: () => brief(),
      go: () => go(),
      step: () => { if (mode !== 'play') return; round.step = b.dataset.step; paintGame(); },
      pick: () => { if (mode === 'play') choose(+b.dataset.i); },
      print: () => printIssue(),
      download: () => download(),
      again: () => brief(),
      next: () => { at = store.state.next; brief(); },
      menu: () => menu(),
    })[a]?.();
  });
  desk.addEventListener('click', e => { if (!e.target.closest('.ar-desk-icon') && !launching) $('.ar-desk-icon').classList.remove('is-selected'); });
  document.addEventListener('keydown', e => {
    if (e.target.closest('input, textarea')) return;
    if (mode === 'desk' && e.key === 'Enter' && e.target.closest('.ar-desk-icon')) { e.preventDefault(); launch(); return; }
    if (mode === 'press' && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); SFX.bloop(); startLoadingIntro(); return; }
    if (/^(intro|loading|printing)$/.test(mode)) { if (e.key === ' ') e.preventDefault(); return; }
    if (mode === 'play' && /^[1-4]$/.test(e.key)) choose(+e.key - 1);
    else if (mode === 'menu' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      store.state.next = (at + (e.key === 'ArrowLeft' ? -1 : 1) + issues.length) % issues.length; menu();
    }
  });
  function focusFirst(el) {
    requestAnimationFrame(() => {
      const t = el || screen.querySelector('[data-autofocus]') || body;
      if (t && !monitor.hidden) t.focus({ preventScroll: true });
    });
  }

  // ── Language switch ──
  function pageWords() {
    document.title = 'DEADLINE — Angelo Gibbs';
    const back = document.querySelector('.ar-back-link span');
    if (back) back.textContent = T('Back to ANGELos');
  }
  pageWords();
  I18N.on(() => {
    pageWords();
    paintSound();
    if (mode === 'desk') showDesk();
    else if (mode === 'menu') menu();
    else if (mode === 'press') pressTitle();
    else if (mode === 'play') paintGame();
  });

  // Draw covers once the pixel font is in, so the masthead uses it.
  if (document.fonts && document.fonts.load) document.fonts.load('20px "Pixel Times"').then(() => { if (round && !game.hidden) renderCover(coverCanvas, round.iss, round.ch); });

  face.innerHTML = editorArt();
  if (introSeen() || !issues.length) { openMonitor(); menu(); } else showDesk();
})();
