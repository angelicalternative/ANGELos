// Angel Records (records.html): a cozy pixel record-digging game on its own page.
// Content lives in js/records-config.js; art lives in assets/angel-records/.
// It has its own saved progress and its own turntable, and doesn't touch the desktop,
// Photos or Angelo's Mix. Missing art shows as labelled placeholder boxes.
(function () {
  const cfg = window.ANGEL_RECORDS;
  const root = document.getElementById('arp');
  if (!cfg || !root) return;

  // ── Words (this page's own Spanish; the EN/ES switch is the site's shared one) ──
  const ES = {
    'ANGEL RECORDS': 'ANGEL RECORDS', 'Double-click to start': 'Doble clic para empezar', 'Tap to start': 'Toca para empezar',
    'Previous shop': 'Tienda anterior', 'Next shop': 'Tienda siguiente', 'HOME': 'CASA',
    'START DIGGING': 'A BUSCAR', 'COLLECTION': 'COLECCIÓN',
    'Pick a crate to dig through': 'Escoge una caja para buscar', 'LEAVE SHOP': 'SALIR', 'Crate': 'Caja',
    'Previous record': 'Disco anterior', 'Next record': 'Disco siguiente', 'PULL IT OUT': 'SACARLO', 'BACK': 'ATRÁS',
    'SLEEVE': 'CARÁTULA', 'FOUND IT!': '¡LO ENCONTRÉ!', 'FOUND IT… AGAIN': 'LO ENCONTRÉ… OTRA VEZ',
    'Now playing on the shop turntable': 'Sonando en el tocadiscos de la tienda', 'KEEP DIGGING': 'SEGUIR BUSCANDO',
    'SEE RESULTS': 'VER RESULTADOS', 'ROUND COMPLETE': 'RONDA COMPLETA', 'Time': 'Tiempo', 'NEXT SHOP': 'SIGUIENTE TIENDA',
    'TITLE': 'INICIO', 'Skip': 'Saltar', 'Tap to play': 'Toca para jugar', 'loading...': 'cargando...',
    'Replay intro': 'Ver la intro otra vez', 'Stop': 'Parar', 'Now playing': 'Sonando', 'Back to ANGELos': 'Volver a ANGELos',
    'photo': 'foto', 'No shops yet. Add one in js/records-config.js.': 'Todavía no hay tiendas. Agrega una en js/records-config.js.',
  };
  const T = s => (I18N.es && ES[s] != null ? ES[s] : s);
  const pick = (o, f) => I18N.pick(o, f);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rnd = a => a[Math.floor(Math.random() * a.length)];
  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = () => matchMedia('(pointer: coarse)').matches;
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  // ── Saved progress (this page only) ──
  const KEY = 'angel-records-v1';
  const store = (() => {
    let mem = null;
    const blank = () => ({ found: [], next: 0, rounds: 0, introSeen: false });
    const load = () => {
      if (mem) return mem;
      try { mem = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { mem = blank(); }
      if (!Array.isArray(mem.found)) mem.found = [];
      return mem;
    };
    return {
      get state() { return load(); },
      save() { try { localStorage.setItem(KEY, JSON.stringify(load())); } catch (e) {} },
      isFound: id => load().found.includes(id),
      markFound(id) { const s = load(); if (s.found.includes(id)) return false; s.found.push(id); this.save(); return true; },
    };
  })();

  const shops = cfg.shops || [];
  const records = (cfg.records || []).filter(r => !r.shop || shops.some(s => s.id === r.shop));
  const PER_CRATE = cfg.perCrate || 9, PER_ROUND = cfg.perRound || 2;
  const line = key => {
    const L = cfg.lines || {};
    return rnd((I18N.es && L.es && L.es[key]) || L[key] || ['']);
  };

  // ── Page skeleton: the fake desktop (intro) and the game monitor ──
  root.innerHTML = `
    <section class="ar-desk" hidden>
      <button type="button" class="ar-desk-icon" data-ar="launch">
        <span class="ar-desk-art"><img src="assets/icons/angel-records.svg" alt="">${shortcutArrow()}</span>
        <span class="ar-desk-label">${esc(T('ANGEL RECORDS'))}</span>
      </button>
      <p class="ar-desk-hint"></p>
    </section>
    <section class="ar-monitor" hidden>
      <div class="ar" tabindex="-1">
        <div class="ar-view"><div class="ar-stage" aria-hidden="true"></div></div>
        <div class="ar-talk">
          <div class="ar-face"></div>
          <div class="ar-say"><b class="ar-name"></b><p class="ar-text"></p></div>
        </div>
        <div class="ar-controls"></div>
        <div class="ar-nowplaying" hidden><span class="ar-np-text"></span><button type="button" class="ar-np-stop" data-ar="stop"></button></div>
        <div class="ar-screen" hidden></div>
      </div>
    </section>`;
  const $ = s => root.querySelector(s);
  const desk = $('.ar-desk'), monitor = $('.ar-monitor'), body = $('.ar');
  const view = $('.ar-view'), stage = $('.ar-stage'), face = $('.ar-face'), say = $('.ar-text'),
        nameEl = $('.ar-name'), controls = $('.ar-controls'), screen = $('.ar-screen');

  function shortcutArrow() {
    return '<i class="ar-desk-arrow" aria-hidden="true"><svg viewBox="0 0 11 11" shape-rendering="crispEdges"><rect width="11" height="11" fill="#000"/><rect x="1" y="1" width="9" height="9" fill="#fff"/><rect x="4" y="3" width="4" height="1" fill="#000"/><rect x="6" y="2" width="1" height="3" fill="#000"/><rect x="7" y="3" width="1" height="2" fill="#000"/><rect x="3" y="4" width="2" height="1" fill="#000"/><rect x="3" y="5" width="1" height="4" fill="#000"/><rect x="2" y="7" width="1" height="1" fill="#000"/></svg></i>';
  }

  // ── The turntable: this page's own little player ──
  const audio = new Audio();
  audio.preload = 'none';
  const np = $('.ar-nowplaying');
  let playing = null;
  function playRecord(rec) {
    if (!rec || !rec.src) return;
    playing = rec;
    audio.src = rec.src;
    audio.play().catch(() => {});
    paintNowPlaying();
  }
  function stopRecord() { audio.pause(); playing = null; paintNowPlaying(); }
  audio.addEventListener('ended', () => { playing = null; paintNowPlaying(); });
  function paintNowPlaying() {
    np.hidden = !playing;
    if (!playing) return;
    np.querySelector('.ar-np-text').innerHTML = `${vinyl()}<span>${esc(T('Now playing'))}: <b>${esc(playing.title)}</b> · ${esc(playing.artist || '')}</span>`;
    np.querySelector('.ar-np-stop').textContent = '■ ' + T('Stop');
  }

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
  const owner = shop => Object.assign({}, cfg.owner || {}, (shop && shop.owner) || {});
  const ownerArt = shop => {
    const o = owner(shop);
    return o.sprite ? `<img class="ar-owner-art" src="${esc(o.sprite)}" alt="">` : ownerSVG();
  };

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

  // ── Art: a labelled placeholder until the real file loads ──
  const ph = (label, size) => `<span class="ar-ph"><span>${esc(label)}</span>${size ? `<small>${esc(size)}</small>` : ''}</span>`;
  const art = (src, label, size, cls = '') => `<span class="ar-art ${cls}" data-src="${esc(src || '')}">${ph(label, size)}</span>`;
  // Photos of places: any normal photo, pixelated on the page so it matches the pixel world.
  const photo = (src, label, cls = '') => `<span class="ar-art ar-photo ${cls}" data-src="${esc(src || '')}" data-photo>${ph(label, T('photo'))}</span>`;
  function pixelate(img, el) {
    const W = el.dataset.px ? +el.dataset.px : 96, H = Math.round(W * 3 / 4);
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    // Cover-crop the photo into 4:3, then let the browser scale the tiny canvas up crisply.
    const r = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const w = img.naturalWidth * r, h = img.naturalHeight * r;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
    return c;
  }
  function hydrate(rootEl) {
    rootEl.querySelectorAll('.ar-art[data-src]').forEach(el => {
      const src = el.dataset.src;
      el.removeAttribute('data-src');
      if (!src) return;
      const img = new Image();
      img.onload = () => {
        el.innerHTML = '';
        if (el.hasAttribute('data-photo')) el.appendChild(pixelate(img, el));
        else { img.alt = ''; el.appendChild(img); }
        el.classList.add('is-loaded');
      };
      img.src = src;
    });
  }
  const file = p => (p || '').split('/').pop();

  // Ordinary sleeves: placeholder art from a seed (colour pair + pattern).
  const PAL = [['#E04A4A', '#F2B33D'], ['#4FA3D9', '#FFF3C4'], ['#7BC96F', '#2E5A2E'], ['#F2B33D', '#8A3030'], ['#9B6BC9', '#F2D16B'],
               ['#F27A3D', '#3B2A5C'], ['#2E2E2E', '#E04A4A'], ['#E8D9A8', '#4FA3D9'], ['#C2534F', '#FFF0C2'], ['#3D5A99', '#F27A3D']];
  function fillerSleeve(seed) {
    const [a, b] = PAL[seed % PAL.length], kind = Math.floor(seed / PAL.length) % 4;
    let s = `<rect width="16" height="16" fill="${a}"/>`;
    if (kind === 0) s += `<rect x="5" y="5" width="6" height="6" fill="${b}"/><rect x="6" y="4" width="4" height="8" fill="${b}"/><rect x="4" y="6" width="8" height="4" fill="${b}"/>`;
    if (kind === 1) for (let i = 1; i < 16; i += 4) s += `<rect y="${i}" width="16" height="2" fill="${b}"/>`;
    if (kind === 2) for (let i = 0; i < 16; i++) s += `<rect x="${i}" y="${15 - i}" width="3" height="1" fill="${b}"/>`;
    if (kind === 3) s += `<rect x="3" y="3" width="10" height="10" fill="${b}"/><rect x="5" y="5" width="6" height="6" fill="${a}"/>`;
    return `<span class="ar-sleeve-art"><svg viewBox="0 0 16 16" shape-rendering="crispEdges">${s}</svg></span>`;
  }

  // ── Stage scaling: whole pixels on wide screens, fit-to-width on phones ──
  function fit() {
    const w = view.clientWidth;
    if (!w) return;
    const byH = Math.max(1, Math.floor((window.innerHeight - 260) / 240));
    const k = w >= 640 ? Math.min(3, Math.floor(w / 320), byH) : w / 320;
    stage.style.transform = `scale(${k})`;
    stage.style.left = Math.max(0, (w - 320 * k) / 2) + 'px';
    view.style.height = 240 * k + 'px';
  }
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(view);
  window.addEventListener('resize', fit);

  // ── Talk + controls ──
  let curShop = null;
  function talk(text) {
    nameEl.textContent = text ? pick(owner(curShop), 'name') || '' : '';
    say.textContent = text;
  }
  const btn = (act, label, extra = '') => `<button type="button" class="px-btn ar-btn" data-ar="${act}" ${extra}><span>${label}</span></button>`;
  const glyphBtn = (act, glyph, label) => `<button type="button" class="pbtn ar-nav" data-ar="${act}" aria-label="${esc(label)}">${Pixel.glyph(glyph)}</button>`;

  // ── Full-window screens ──
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearLater = () => { timers.forEach(clearTimeout); timers = []; };
  function showScreen(html, cls) {
    screen.className = 'ar-screen ' + (cls || '');
    screen.innerHTML = html;
    screen.hidden = false;
    hydrate(screen);
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

  // ── 1–2. The desktop: a shortcut icon; clicking it selects it, then the busy hourglass ──
  function showDesk() {
    mode = 'desk';
    desk.hidden = false; monitor.hidden = true;
    $('.ar-desk-hint').textContent = touch() ? T('Tap to start') : T('Double-click to start');
    $('.ar-desk-label').textContent = T('ANGEL RECORDS');
    requestAnimationFrame(() => $('.ar-desk-icon').focus({ preventScroll: true }));
  }
  let launching = false;
  function launch() {
    if (launching) return;
    launching = true;
    const icon = $('.ar-desk-icon');
    icon.classList.add('is-selected');
    $('.ar-desk-hint').textContent = '';
    const hg = document.createElement('div');
    setTimeout(() => {
      document.documentElement.classList.add('ar-busy');
      // Phones have no cursor, so a little hourglass appears by the icon instead.
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
  function openMonitor() {
    monitor.hidden = false;
    fit();
    face.innerHTML = ownerArt(curShop);
  }

  // ── 3–6. The CD-ROM intro: blank → publisher → title → loading cards → black ──
  function intro() {
    clearLater();
    mode = 'intro';
    controls.innerHTML = ''; talk(''); paintStage(null);
    showScreen(skipBtn(), 'is-blank ar-crt');
    later(publisher, 1000);
  }
  function publisher() {
    showScreen(`
      <div class="ar-pub">
        <p class="ar-pub-name" data-text="Angelo Studio">Angelo Studio</p>
        <p class="ar-pub-sub">interactive</p>
        ${sparkle()}
      </div>${skipBtn()}`, 'is-pub ar-crt');
    later(pressTitle, 3600);
  }
  function pressTitle() {
    mode = 'press';
    const press = touch() ? esc(T('Tap to play'))
      : I18N.es ? 'Presiona <kbd>espacio</kbd> para jugar' : 'Press <kbd>space</kbd> to play';
    showScreen(`
      <div class="ar-press">
        <h1 class="ar-logo">${vinyl()}<span class="ar-chrome">ANGEL</span><span class="ar-chrome ar-chrome-2">RECORDS</span></h1>
        <p class="ar-press-go">${press}</p>
      </div>${skipBtn()}`, 'is-press ar-crt');
    focusFirst(body);
  }
  // The encyclopedia loading screen: one framed photo of a place + a deadpan caption at a time.
  function loadingCards(count, each, then, shopId) {
    clearLater();
    mode = 'loading';
    const caps = (cfg.intro && cfg.intro.captions) || [];
    // Before a round, prefer cards from the shop's own city.
    const near = shopId ? caps.filter(c => c.photo.includes('/' + shopId)) : [];
    const deck = (near.length ? near : caps).slice().sort(() => Math.random() - 0.5).slice(0, count);
    const link = s => esc(s).replace(/\[([^\]]+)\]/g, '<a class="ar-wiki-link">$1</a>');
    const expand = '<svg class="ar-wiki-expand" viewBox="0 0 11 9" shape-rendering="crispEdges" aria-hidden="true"><rect x="0" y="2" width="7" height="7" fill="#999"/><rect x="1" y="3" width="5" height="5" fill="#fff"/><rect x="4" y="0" width="7" height="6" fill="#999"/><rect x="5" y="1" width="5" height="4" fill="#fff"/></svg>';
    showScreen(`
      <figure class="ar-wiki"><span class="ar-wiki-img"></span><figcaption><span></span>${expand}</figcaption></figure>
      <p class="ar-wiki-loading">${vinyl()}<span>${esc(T('loading...'))}</span></p>
      ${count > 1 ? skipBtn() : ''}`, 'is-wiki ar-crt');
    const fig = screen.querySelector('.ar-wiki'), imgBox = fig.querySelector('.ar-wiki-img'), cap = fig.querySelector('figcaption span');
    let i = 0;
    const show = () => {
      const x = deck[i];
      if (x) {
        imgBox.innerHTML = photo(x.photo, `${file(x.photo)} · ${x.shows || ''}`);
        imgBox.firstElementChild.dataset.px = 120;
        hydrate(imgBox);
        cap.innerHTML = link(pick(x, 'text'));
      }
      fig.classList.remove('is-out');
      i++;
      if (i < deck.length) later(() => { fig.classList.add('is-out'); later(show, still() ? 150 : 450); }, each);
      else later(then, each);
    };
    if (!deck.length) { fig.hidden = true; later(then, each); } else show();
  }
  let pickShop = 0;
  function fadeToShop() {
    clearLater();
    mode = 'black';
    showScreen('', 'is-black');
    later(() => startRound(shops[pickShop]), still() ? 250 : 1000);
  }
  function finishIntro() { markIntroSeen(); pickShop = Math.min(store.state.next || 0, shops.length - 1); fadeToShop(); }

  // ── The game menu ──
  function title() {
    clearLater();
    mode = 'title';
    if (!shops.length) { showScreen(`<p class="ar-empty">${esc(T('No shops yet. Add one in js/records-config.js.'))}</p>`, 'is-title'); return; }
    pickShop = Math.min(store.state.next || 0, shops.length - 1);
    const s = shops[pickShop];
    const n = records.filter(r => store.isFound(r.id)).length;
    showScreen(`
      <div class="ar-title">
        <h1 class="ar-logo ar-logo-sm">${vinyl()}<span class="ar-chrome">ANGEL</span><span class="ar-chrome ar-chrome-2">RECORDS</span></h1>
        <div class="ar-shop-pick">
          ${glyphBtn('shop-prev', 'prev', T('Previous shop'))}
          <div class="ar-shop-card">
            ${photo(s.photo, file(s.photo), 'ar-shop-photo')}
            <p><b>${esc(s.name || 'Angel Records')}</b><span>${esc(pick(s, 'city'))}${s.city !== s.country ? `, ${esc(pick(s, 'country'))}` : ''}${s.home ? ` · ${esc(T('HOME'))}` : ''}</span></p>
          </div>
          ${glyphBtn('shop-next', 'next', T('Next shop'))}
        </div>
        ${btn('start', esc(T('START DIGGING')), 'data-autofocus')}
        ${btn('collection', `${esc(T('COLLECTION'))} ${n}/${records.length}`)}
        <button type="button" class="ar-replay" data-ar="intro">${esc(T('Replay intro'))}</button>
      </div>`, 'is-title');
    talk('');
    controls.innerHTML = '';
    paintStage(null);
    focusFirst();
  }
  // Starting a round from the menu: one quick encyclopedia card from that city, then the shop.
  function loading() { loadingCards(1, still() ? 1200 : 2400, fadeToShop, shops[pickShop].id); }

  // ── A round ──
  let round = null;
  function startRound(shop) {
    hideScreen();
    curShop = shop;
    face.innerHTML = ownerArt(shop);
    const here = records.filter(r => !r.shop || r.shop === shop.id);
    const fresh = here.filter(r => !store.isFound(r.id)).sort(() => Math.random() - 0.5);
    const old = here.filter(r => store.isFound(r.id)).sort(() => Math.random() - 0.5);
    const specials = fresh.concat(old).slice(0, PER_ROUND);
    const crates = [0, 1, 2].map(() => Array.from({ length: PER_CRATE }, () => ({ seed: Math.floor(Math.random() * 40) })));
    specials.forEach(rec => {
      let c, k;
      do { c = Math.floor(Math.random() * 3); k = 1 + Math.floor(Math.random() * (PER_CRATE - 1)); } while (crates[c][k].rec);
      crates[c][k] = { rec };
    });
    round = { shop, crates, specials, got: [], t0: Date.now(), crate: -1, at: 0 };
    showShop(true);
  }
  function showShop(first) {
    round.crate = -1;
    mode = 'shop';
    paintStage('shop');
    talk(first ? pick(round.shop, 'greeting') || line('enter') : line('enter'));
    controls.innerHTML = `<p class="ar-hint">${esc(T('Pick a crate to dig through'))}</p>` +
      btn('collection', esc(T('COLLECTION'))) + btn('leave', esc(T('LEAVE SHOP')));
    focusFirst(stage.querySelector('.ar-crate'));
  }
  function openCrate(c) {
    round.crate = c;
    round.at = 0;
    mode = 'crate';
    const hot = round.crates[c].some(s => s.rec && !round.got.includes(s.rec.id));
    talk(line(hot ? 'warm' : 'cold'));
    paintStage('crate');
    controls.innerHTML = glyphBtn('prev', 'prev', T('Previous record')) +
      btn('pull', esc(T('PULL IT OUT'))) + glyphBtn('next', 'next', T('Next record')) +
      `<output class="ar-count"></output>` + btn('back', esc(T('BACK')));
    updateCount();
    focusFirst(controls.querySelector('[data-ar="pull"]'));
  }
  function flip(d) {
    if (mode !== 'crate') return;
    const n = round.crates[round.crate].length;
    round.at = (round.at + d + n) % n;
    paintSleeve(d);
    updateCount();
  }
  function updateCount() {
    const o = controls.querySelector('.ar-count');
    if (o) o.textContent = `${round.at + 1} / ${round.crates[round.crate].length}`;
  }
  function pull() {
    if (mode !== 'crate') return;
    const s = round.crates[round.crate][round.at];
    const el = stage.querySelector('.ar-sleeve.is-front');
    if (!s.rec) {
      if (el && !still()) { el.classList.remove('pulled'); void el.offsetWidth; el.classList.add('pulled'); }
      talk(line('filler'));
      return;
    }
    found(s.rec);
  }
  function found(rec) {
    const fresh = store.markFound(rec.id);
    if (!round.got.includes(rec.id)) round.got.push(rec.id);
    round.crates[round.crate][round.at] = { seed: Math.floor(Math.random() * 40) }; // can't find it twice this round
    playRecord(rec);
    mode = 'found';
    wiggle();
    burst();
    talk(fresh ? pick(rec, 'blurb') || '' : line('again'));
    const left = round.specials.length - round.got.length;
    showScreen(`
      <div class="ar-found" role="dialog" aria-label="${esc(T('FOUND IT!'))}">
        <p class="ar-found-head">${esc(fresh ? T('FOUND IT!') : T('FOUND IT… AGAIN'))}</p>
        ${art(rec.sleeve, file(rec.sleeve) || 'sleeve', '64×64', 'ar-found-sleeve')}
        <p class="ar-found-title">${esc(pick(rec, 'title'))}</p>
        <p class="ar-found-artist">${esc(rec.artist || '')}</p>
        <p class="ar-found-note">${rec.src ? esc(T('Now playing on the shop turntable')) : ''}</p>
        ${btn(left > 0 ? 'resume' : 'results', esc(left > 0 ? T('KEEP DIGGING') : T('SEE RESULTS')), 'data-autofocus')}
      </div>`, 'is-found');
    focusFirst();
  }
  function results(again) {
    mode = 'results';
    const sec = Math.round((Date.now() - round.t0) / 1000);
    if (!again) {
      const st = store.state;
      st.rounds = (st.rounds || 0) + 1;
      st.next = (shops.indexOf(round.shop) + 1) % shops.length;
      store.save();
      talk(line('done'));
      wiggle();
    }
    const recs = round.specials.map(r => `<li>${art(r.sleeve, file(r.sleeve), '', 'ar-mini-sleeve')}<span><b>${esc(pick(r, 'title'))}</b><span>${esc(r.artist || '')}</span></span></li>`).join('');
    showScreen(`
      <div class="ar-results">
        <p class="ar-found-head">${esc(T('ROUND COMPLETE'))}</p>
        <p class="ar-results-shop">${esc(round.shop.name || 'Angel Records')} · ${esc(pick(round.shop, 'city'))}</p>
        <ul class="ar-results-list">${recs}</ul>
        <p class="ar-results-time">${esc(T('Time'))}: ${fmt(sec)}</p>
        ${btn('next-shop', esc(T('NEXT SHOP')), 'data-autofocus')}${btn('collection', esc(T('COLLECTION')))}${btn('title', esc(T('TITLE')))}
      </div>`, 'is-results');
    controls.innerHTML = '';
    focusFirst();
  }
  let backTo = 'title';
  function collection() {
    backTo = mode === 'title' ? 'title' : mode === 'results' ? 'results' : 'game';
    mode = 'collection';
    const n = records.filter(r => store.isFound(r.id)).length;
    const cells = records.map(r => store.isFound(r.id)
      ? `<li><button type="button" class="ar-col-item" data-ar="play" data-id="${esc(r.id)}">${art(r.sleeve, file(r.sleeve), '64×64', 'ar-col-sleeve')}<b>${esc(pick(r, 'title'))}</b><span>${esc(r.artist || '')}</span></button></li>`
      : `<li><span class="ar-col-item is-locked">${art('assets/angel-records/sleeve-locked.png', '?', '', 'ar-col-sleeve')}<b>???</b><span>${esc(pick(shops.find(s => s.id === r.shop) || {}, 'city') || '')}</span></span></li>`).join('');
    showScreen(`
      <div class="ar-collection">
        <p class="ar-col-head">${esc(T('COLLECTION'))} <b>${n} / ${records.length}</b></p>
        <ul class="ar-col-grid">${cells}</ul>
        ${btn('col-back', esc(T('BACK')), 'data-autofocus')}
      </div>`, 'is-collection');
    focusFirst();
  }
  function closeCollection() {
    if (backTo === 'title') return title();
    if (backTo === 'results') return results(true);
    hideScreen();
    mode = round && round.crate >= 0 ? 'crate' : 'shop';
    focusFirst();
  }

  // ── Stage painting ──
  function paintStage(kind) {
    if (!kind) { stage.innerHTML = `<div class="ar-scene ar-scene-title"></div>`; return; }
    const s = round.shop;
    const dust = Array.from({ length: 9 }, (_, i) => `<i style="--x:${12 + (i * 37) % 70};--y:${20 + (i * 53) % 110};--d:${(i * 0.7) % 5}s"></i>`).join('');
    if (kind === 'shop') {
      const labels = pick(s, 'crates') || ['A', 'B', 'C'];
      stage.innerHTML = `
        <div class="ar-scene ar-scene-shop">
          ${art(s.bg, file(s.bg), '320×240', 'ar-bg')}
          <span class="ar-sign">${esc(s.name || 'Angel Records')}</span>
          <span class="ar-window">${photo(s.photo, file(s.photo), 'ar-window-photo')}<span class="ar-window-city">${esc(pick(s, 'city'))}</span></span>
          <span class="ar-light"></span><span class="ar-dust">${dust}</span>
          <span class="ar-owner">${ownerArt(s)}</span>
          <span class="ar-counter"></span>
          ${[0, 1, 2].map(c => `<button type="button" class="ar-crate" data-ar="crate" data-c="${c}" aria-label="${esc(T('Crate'))}: ${esc(labels[c] || '')}">
             ${art('assets/angel-records/crate.png', 'crate.png', '96×56', 'ar-crate-art')}<span class="ar-crate-label">${esc(labels[c] || '')}</span>
          </button>`).join('')}
        </div>`;
      stage.removeAttribute('aria-hidden');
    } else {
      stage.innerHTML = `
        <div class="ar-scene ar-scene-crate">
          ${art('assets/angel-records/crate-open.png', 'crate-open.png', '320×240', 'ar-bg')}
          <span class="ar-light"></span><span class="ar-dust">${dust}</span>
          <span class="ar-pile"></span>
          <span class="ar-crate-front"><span>${esc((pick(s, 'crates') || [])[round.crate] || '')}</span></span>
        </div>`;
      stage.setAttribute('aria-hidden', 'true');
      paintSleeve(0);
    }
    hydrate(stage);
  }
  function sleeveHTML(sl, front) {
    const inner = sl.rec ? (sl.rec.sleeve ? art(sl.rec.sleeve, T('SLEEVE') + ' 64×64', '', 'ar-sleeve-img') : fillerSleeve(7)) : fillerSleeve(sl.seed);
    return `<span class="ar-sleeve${front ? ' is-front' : ''}${sl.rec ? ' is-special' : ''}">${inner}${sl.rec ? '<i class="ar-glint"></i><i class="ar-star" aria-hidden="true">★</i>' : ''}</span>`;
  }
  function paintSleeve(d) {
    const pile = stage.querySelector('.ar-pile');
    if (!pile) return;
    const list = round.crates[round.crate], n = list.length;
    const back2 = list[(round.at + 2) % n], back1 = list[(round.at + 1) % n], cur = list[round.at];
    pile.innerHTML = `<span class="ar-back b2">${sleeveHTML(back2)}</span><span class="ar-back b1">${sleeveHTML(back1)}</span>` +
      `<span class="ar-front${d && !still() ? (d > 0 ? ' in-next' : ' in-prev') : ''}">${sleeveHTML(cur, true)}</span>`;
    hydrate(pile);
  }
  function burst() {
    if (still()) return;
    const b = document.createElement('div');
    b.className = 'ar-burst';
    b.innerHTML = Array.from({ length: 18 }, (_, i) => `<i style="--a:${i * 20}deg;--c:${['#F7D417', '#F2A74B', '#E77FA0', '#FFF3C4'][i % 4]}"></i>`).join('');
    body.appendChild(b);
    setTimeout(() => b.remove(), 1100);
  }

  // ── Input: buttons, keys, swipe ──
  const startLoadingIntro = () => loadingCards(5, still() ? 2500 : 4500, finishIntro);
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-ar]');
    if (!b) { if (mode === 'press') startLoadingIntro(); return; }
    const a = b.dataset.ar;
    // The desktop icon: double-click with a mouse (like Windows), a single tap on phones.
    if (a === 'launch') { if (touch() || e.detail >= 2) launch(); else b.classList.add('is-selected'); return; }
    ({
      start: () => loading(),
      skip: () => finishIntro(),
      intro: () => intro(),
      'shop-prev': () => { store.state.next = (pickShop - 1 + shops.length) % shops.length; title(); },
      'shop-next': () => { store.state.next = (pickShop + 1) % shops.length; title(); },
      collection: () => collection(),
      'col-back': () => closeCollection(),
      play: () => playRecord(records.find(x => x.id === b.dataset.id)),
      stop: () => stopRecord(),
      crate: () => openCrate(+b.dataset.c),
      prev: () => flip(-1), next: () => flip(1), pull: () => pull(),
      back: () => showShop(false),
      leave: () => title(),
      resume: () => { hideScreen(); mode = 'crate'; paintSleeve(0); focusFirst(controls.querySelector('[data-ar="pull"]')); },
      results: () => results(),
      'next-shop': () => { pickShop = store.state.next; loading(); },
      title: () => title(),
    })[a]?.();
  });
  // Clicking the empty desktop deselects the icon, like Windows.
  desk.addEventListener('click', e => { if (!e.target.closest('.ar-desk-icon') && !launching) $('.ar-desk-icon').classList.remove('is-selected'); });

  document.addEventListener('keydown', e => {
    if (e.target.closest('input, textarea')) return;
    if (mode === 'desk' && e.key === 'Enter' && e.target.closest('.ar-desk-icon')) { e.preventDefault(); launch(); return; }
    if (mode === 'press' && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); startLoadingIntro(); return; }
    if (/^(intro|loading|black)$/.test(mode)) { if (e.key === ' ') e.preventDefault(); return; }
    if (mode === 'crate') {
      if (e.key === 'ArrowLeft') { e.preventDefault(); flip(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); flip(1); }
      else if (e.key === 'ArrowUp' || ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('button'))) { e.preventDefault(); pull(); }
      else if (e.key === 'Escape' || e.key === 'ArrowDown') { e.preventDefault(); showShop(false); }
    } else if (mode === 'shop' && /^[123]$/.test(e.key)) openCrate(+e.key - 1);
    else if (mode === 'title' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      store.state.next = (pickShop + (e.key === 'ArrowLeft' ? -1 : 1) + shops.length) % shops.length; title();
    }
  });

  let sx = null, sy = null;
  view.addEventListener('pointerdown', e => { if (mode === 'crate') { sx = e.clientX; sy = e.clientY; } });
  view.addEventListener('pointerup', e => {
    if (sx == null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    sx = null;
    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) flip(dx < 0 ? 1 : -1);
    else if (dy < -30) pull();
    else if (Math.abs(dx) < 8 && Math.abs(dy) < 8 && e.target.closest('.ar-sleeve.is-front')) pull();
  });

  function focusFirst(el) {
    requestAnimationFrame(() => {
      const t = el || screen.querySelector('[data-autofocus]') || body;
      if (t && !monitor.hidden) t.focus({ preventScroll: true });
    });
  }

  // ── Language switch ──
  function pageWords() {
    document.title = `${T('ANGEL RECORDS')} — Angelo Gibbs`;
    const back = document.querySelector('.ar-back-link span');
    if (back) back.textContent = T('Back to ANGELos');
  }
  pageWords();
  I18N.on(() => {
    pageWords();
    paintNowPlaying();
    if (mode === 'desk') showDesk();
    else if (mode === 'title') title();
    else if (mode === 'shop') showShop(false);
    else if (mode === 'crate') { const at = round.at; openCrate(round.crate); round.at = at; paintSleeve(0); updateCount(); }
    else if (mode === 'collection') collection();
    else if (mode === 'press') pressTitle();
  });

  // ── Start: the desktop the first time, straight to the menu after that ──
  face.innerHTML = ownerArt(null);
  if (introSeen() || !shops.length) { openMonitor(); title(); } else showDesk();
})();
