// Fun apps: Photos, Globe Tracker, Minesweeper.

// ── Photos ──────────────────────────────────────────────────
function PhotoGallery(win, photos) {
  const $ = sel => win.querySelector(sel);
  const img = $('.gal-img'), cap = $('.gal-caption'), count = $('.gal-count'), strip = $('.gal-strip');
  let i = 0;

  if (!photos.length) {
    $('.gal-view').innerHTML = '<p class="gal-empty">No photos yet — add some in js/config.js</p>';
    return;
  }
  strip.innerHTML = photos.map((p, k) =>
    `<button type="button" class="gal-thumb" data-i="${k}" aria-label="Photo ${k + 1}"><img src="${p.src}" alt="" loading="lazy" /></button>`).join('');

  function show(k) {
    i = (k + photos.length) % photos.length;
    const p = photos[i];
    img.src = p.src;
    img.alt = p.caption || `Photo ${i + 1}`;
    cap.textContent = p.caption || '';
    count.textContent = `${String(i + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
    strip.querySelectorAll('.gal-thumb').forEach(t => t.classList.toggle('is-current', +t.dataset.i === i));
    strip.querySelector(`[data-i="${i}"]`).scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  strip.addEventListener('click', e => { const t = e.target.closest('.gal-thumb'); if (t) show(+t.dataset.i); });
  $('[data-gal="prev"]').addEventListener('click', () => show(i - 1));
  $('[data-gal="next"]').addEventListener('click', () => show(i + 1));
  document.addEventListener('keydown', e => {
    if (win.hidden || +win.style.zIndex < topZ()) return;
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
  show(0);

  function topZ() { return Math.max(...[...document.querySelectorAll('[data-win]:not([hidden])')].map(w => +w.style.zIndex || 0)); }
}

// ── Junk folder ─────────────────────────────────────────────
function JunkFolder(win, items) {
  const $ = sel => win.querySelector(sel);
  const grid = $('.junk-grid'), view = $('.junk-view'), stage = $('.junk-stage');
  const ext = s => (s.split('?')[0].split('.').pop() || '').toLowerCase();
  const kind = src => {
    const e = ext(src);
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(e)) return 'image';
    if (['mp4', 'webm', 'mov', 'm4v'].includes(e)) return 'video';
    if (['mp3', 'm4a', 'wav', 'aac', 'ogg'].includes(e)) return 'audio';
    if (['txt', 'md'].includes(e)) return 'text';
    return 'file';
  };
  // Junk audio/video pauses Angelo's Mix so two things never play at once.
  const hush = () => { if (window.ANGELOS_PLAYER) window.ANGELOS_PLAYER.pause(); };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // A little mess: each item gets its own fixed tilt.
  const tilt = i => (((i * 37) % 9) - 4) * 0.9;

  const countText = () => { $('.junk-count').textContent = `${items.length} ${I18N.t(items.length === 1 ? 'object' : 'objects')}`; };
  countText();
  I18N.on(countText);
  if (!items.length) { grid.innerHTML = `<p class="junk-empty">${I18N.t('Empty… for now.')}</p>`; return; }
  grid.innerHTML = items.map((it, i) => {
    const k = kind(it.src), name = esc(it.name || it.src.split('/').pop());
    const thumb = k === 'image' ? `<img src="${it.src}" alt="" loading="lazy" />`
      : k === 'video' ? `<video src="${it.src}#t=0.5" muted preload="metadata"></video><b class="junk-badge">▶</b>`
      : k === 'audio' ? `<span class="junk-doc junk-audio">♪<small>${esc(ext(it.name || it.src).toUpperCase())}</small></span>`
      : `<span class="junk-doc">${k === 'text' ? 'TXT' : 'FILE'}</span>`;
    return `<button type="button" class="junk-item" data-i="${i}" style="--tilt:${tilt(i)}deg"><span class="junk-thumb">${thumb}</span><span class="junk-name">${name}</span></button>`;
  }).join('');

  async function open(i) {
    const it = items[i], k = kind(it.src), name = it.name || it.src.split('/').pop();
    $('.junk-title').textContent = name;
    if (k === 'image') stage.innerHTML = `<img src="${it.src}" alt="${esc(name)}" />`;
    else if (k === 'video') stage.innerHTML = `<video src="${it.src}" controls autoplay playsinline></video>`;
    else if (k === 'audio') stage.innerHTML =
      `<div class="junk-player">${Pixel.disc({ rim: '#3B2F00', face: '#F7D417', ring: '#FFE766', hub: '#3B2F00' })}` +
      `<p>${esc(name)}</p>${it.note ? `<small>${esc(I18N.pick(it, 'note'))}</small>` : ''}<audio src="${it.src}" controls autoplay></audio></div>`;
    else if (k === 'text') {
      stage.innerHTML = '<pre class="junk-note">Loading…</pre>';
      try { stage.querySelector('pre').textContent = await (await fetch(it.src)).text(); }
      catch (e) { stage.querySelector('pre').textContent = I18N.t('Couldn’t open this note.'); }
    } else stage.innerHTML = `<a class="px-btn" href="${it.src}" target="_blank" rel="noopener">${I18N.t('OPEN FILE')}</a>`;
    stage.querySelectorAll('audio, video').forEach(m => m.addEventListener('play', hush));
    grid.hidden = true; view.hidden = false;
  }
  function back() {
    stage.querySelectorAll('audio, video').forEach(m => m.pause());
    stage.innerHTML = ''; view.hidden = true; grid.hidden = false;
  }
  grid.addEventListener('click', e => { const b = e.target.closest('.junk-item'); if (b) open(+b.dataset.i); });
  $('.junk-back').addEventListener('click', back);
  win.addEventListener('win:close', back);
}

// ── Globe tracker ───────────────────────────────────────────
function GlobeTracker(win, countryList, territoryList = []) {
  const $ = sel => win.querySelector(sel);
  const TOTAL = 195;
  const items = countryList.map(c => (typeof c === 'string' ? { name: c } : c));
  const n = items.length;

  // Counter, progress bar and list don't need the map, so draw them right away.
  $('.globe-count').textContent = String(n).padStart(2, '0');
  const SEG = 24;
  $('.globe-bar').innerHTML = Array.from({ length: SEG }, (_, k) => `<i class="${k < Math.round((n / TOTAL) * SEG) ? 'on' : ''}"></i>`).join('');
  const t = I18N.t, C = I18N.country;
  const places = c => (c.places && c.places.length
    ? `<small>${c.places.length > 3 ? `${c.places.length} ${t(c.name === 'United States' ? 'states' : 'places')}: ` : ''}${c.places.map(C).join(', ')}</small>`
    : c.territory ? `<small>(${t('territory')})</small>` : '');
  // data-place keeps the English name (it matches the map); the label follows the language.
  function drawText() {
    $('.globe-of').textContent = `${t('OF')} ${TOTAL} ${t('COUNTRIES')} · ${Math.round((n / TOTAL) * 100)}%` +
      (territoryList.length ? ` · +${territoryList.length} ${t('TERRITORIES')}` : '');
    const picked = $('.globe-list .is-picked');
    const pickedName = picked && picked.dataset.place;
    const byName = (a, b) => C(a).localeCompare(C(b), I18N.lang);
    $('.globe-list').innerHTML =
      [...items].sort((a, b) => byName(a.name, b.name)).map(c => `<li data-place="${c.name}" tabindex="0" role="button" aria-pressed="false"><span>${C(c.name)}</span>${places(c)}</li>`).join('') +
      (territoryList.length ? `<li class="globe-list-head">${t('TERRITORIES')}</li>` +
        [...territoryList].sort(byName).map(x => `<li class="is-territory" data-place="${x}" tabindex="0" role="button" aria-pressed="false"><span>${C(x)}</span></li>`).join('') : '');
    const again = pickedName && [...$('.globe-list').querySelectorAll('[data-place]')].find(li => li.dataset.place === pickedName);
    if (again) { again.classList.add('is-picked'); again.setAttribute('aria-pressed', 'true'); }
  }
  drawText();
  I18N.on(drawText);
  if (window.PREFS) PREFS.onCvd(() => { if (world) draw(); });
  const countries = [...items.map(c => c.name), ...territoryList];

  // Names in the map data that differ from everyday names.
  const ALIAS = {
    'united states': 'United States of America', usa: 'United States of America', us: 'United States of America', america: 'United States of America',
    uk: 'United Kingdom', england: 'United Kingdom', scotland: 'United Kingdom', wales: 'United Kingdom', 'great britain': 'United Kingdom',
    'dominican republic': 'Dominican Rep.', 'bosnia and herzegovina': 'Bosnia and Herz.', 'czech republic': 'Czechia',
    'central african republic': 'Central African Rep.', 'democratic republic of the congo': 'Dem. Rep. Congo', drc: 'Dem. Rep. Congo',
    'equatorial guinea': 'Eq. Guinea', 'south sudan': 'S. Sudan', 'solomon islands': 'Solomon Is.', 'north macedonia': 'Macedonia',
    'ivory coast': "Côte d'Ivoire", 'cote divoire': "Côte d'Ivoire", 'east timor': 'Timor-Leste', eswatini: 'eSwatini', swaziland: 'eSwatini',
    holland: 'Netherlands', 'the netherlands': 'Netherlands', 'the bahamas': 'Bahamas', 'western sahara': 'W. Sahara', 'falkland islands': 'Falkland Is.',
  };
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/gi, '').toLowerCase().trim();
  const wanted = new Set(countries.map(c => norm(ALIAS[norm(c)] || c)));

  const canvas = $('.globe-canvas'), ctx = canvas.getContext('2d', { willReadFrequently: true });
  const S = canvas.width; // drawn small, shown big = chunky pixels
  const PALETTE = [[0x18, 0x03, 0xBB], [0xD9, 0xD9, 0xD9], [0xF7, 0xD4, 0x17], [0, 0, 0], [0x5A, 0x4C, 0xE0], [0xE5, 0x22, 0x22], [0xFF, 0xFF, 0xFF]];
  // Picked place: red, or black in colourblind mode (black never gets confused with yellow).
  const PICK = () => (window.PREFS && PREFS.cvd ? '#000000' : '#E52222');
  // [longitude, latitude] for places too small to show at this map size.
  const SMALL = {
    barbados: [-59.55, 13.1], singapore: [103.82, 1.35], monaco: [7.42, 43.74], aruba: [-69.97, 12.52],
    'cayman islands': [-81.25, 19.31], 'turks and caicos islands': [-71.8, 21.75], 'hong kong': [114.17, 22.32],
    andorra: [1.52, 42.51], 'san marino': [12.46, 43.94], 'vatican city': [12.45, 41.9], malta: [14.4, 35.9], bahrain: [50.55, 26.07],
    maldives: [73.5, 4.2], 'saint lucia': [-60.98, 13.9], grenada: [-61.68, 12.12], 'antigua and barbuda': [-61.8, 17.07],
    'puerto rico': [-66.5, 18.22], curacao: [-68.99, 12.17], bermuda: [-64.75, 32.3], macau: [113.54, 22.2], liechtenstein: [9.55, 47.16],
  };
  let world = null, visited = [], dots = [], rot = [70, -12], started = false, drag = null, timer = null;
  // The place picked from the list: shown red, with a blinking marker, and the globe spins to it.
  let pick = null, spin = null, blink = 0;

  const load = src => new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
  });

  async function start() {
    if (started) return;
    started = true;
    try {
      await load('https://cdn.jsdelivr.net/npm/d3-array@3.2.4/dist/d3-array.min.js');
      await load('https://cdn.jsdelivr.net/npm/d3-geo@3.1.0/dist/d3-geo.min.js');
      await load('https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js');
      const topo = await (await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json')).json();
      world = topojson.feature(topo, topo.objects.countries).features;
      visited = world.filter(f => wanted.has(norm(f.properties.name)));
      const found = new Set(visited.map(f => norm(f.properties.name)));
      const missing = countries.filter(c => !found.has(norm(ALIAS[norm(c)] || c)));
      dots = missing.map(c => SMALL[norm(c)]).filter(Boolean);
      const unknown = missing.filter(c => !SMALL[norm(c)]);
      if (unknown.length) console.info('Globe: name not recognised:', unknown);
      $('.globe-loading').hidden = true;
      draw();
      timer = setInterval(() => {
        if (win.hidden || drag || spin) return;
        if (pick) { blink++; draw(); } else { rot[0] += 2; draw(); }
      }, 90);
      if (pick) select(pick.name);
    } catch (e) {
      $('.globe-loading').textContent = I18N.t('Couldn’t load the map (offline?)');
    }
  }

  function draw() {
    const proj = d3.geoOrthographic().scale(S / 2 - 3).translate([S / 2, S / 2]).rotate(rot).clipAngle(90);
    const path = d3.geoPath(proj, ctx);
    ctx.clearRect(0, 0, S, S);
    ctx.beginPath(); path({ type: 'Sphere' }); ctx.fillStyle = '#1803BB'; ctx.fill();
    ctx.beginPath(); world.forEach(f => path(f)); ctx.fillStyle = '#D9D9D9'; ctx.fill();
    ctx.beginPath(); visited.forEach(f => path(f)); ctx.fillStyle = '#F7D417'; ctx.fill();
    if (pick && pick.feature) { ctx.beginPath(); path(pick.feature); ctx.fillStyle = PICK(); ctx.fill(); }
    // Places too small for the map get a yellow dot instead.
    const center = [-rot[0], -rot[1]];
    dots.forEach(ll => {
      if (d3.geoDistance(ll, center) > Math.PI / 2 - 0.05) return;
      const [x, y] = proj(ll);
      ctx.fillStyle = '#000'; ctx.fillRect(Math.round(x) - 2, Math.round(y) - 2, 4, 4);
      ctx.fillStyle = pick && pick.ll === ll ? PICK() : '#F7D417'; ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
    });
    // Blinking pixel marker over the picked place.
    if (pick && pick.ll && d3.geoDistance(pick.ll, center) < Math.PI / 2 - 0.05) {
      const [x, y] = proj(pick.ll).map(Math.round), r = blink % 8 < 4 ? 7 : 9;
      ctx.fillStyle = '#000';
      ctx.fillRect(x - 3, y - 3, 6, 6);
      ctx.fillStyle = window.PREFS && PREFS.cvd ? '#FFFFFF' : '#E52222'; ctx.fillRect(x - 2, y - 2, 4, 4);
      ctx.fillStyle = window.PREFS && PREFS.cvd ? '#FFFFFF' : '#000'; // white corners stand out on the blue sea
      [[-r, -r], [r - 2, -r], [-r, r - 2], [r - 2, r - 2]].forEach(([a, b]) => {
        ctx.fillRect(x + a, y + b, 2, 2);
        ctx.fillRect(x + a + (a < 0 ? 2 : -2), y + b, 2, 2);
        ctx.fillRect(x + a, y + b + (b < 0 ? 2 : -2), 2, 2);
      });
    }
    ctx.beginPath(); path({ type: 'Sphere' }); ctx.lineWidth = 2; ctx.strokeStyle = '#000'; ctx.stroke();
    // Snap every pixel to the palette so edges stay crisp instead of blurry.
    const im = ctx.getImageData(0, 0, S, S), d = im.data;
    for (let p = 0; p < d.length; p += 4) {
      if (d[p + 3] < 110) { d[p + 3] = 0; continue; }
      let best = 0, bd = 1e9;
      for (let k = 0; k < PALETTE.length; k++) {
        const c = PALETTE[k], dd = (d[p] - c[0]) ** 2 + (d[p + 1] - c[1]) ** 2 + (d[p + 2] - c[2]) ** 2;
        if (dd < bd) { bd = dd; best = k; }
      }
      [d[p], d[p + 1], d[p + 2], d[p + 3]] = [...PALETTE[best], 255];
    }
    ctx.putImageData(im, 0, 0);
  }

  canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, r: [...rot] }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => {
    if (!drag || !world) return;
    const k = 180 / canvas.clientWidth;
    rot = [drag.r[0] + (e.clientX - drag.x) * k, Math.max(-60, Math.min(60, drag.r[1] - (e.clientY - drag.y) * k))];
    draw();
  });
  canvas.addEventListener('pointerup', () => { drag = null; });

  // Clicking a country in the list turns it red and spins the globe to face it.
  function centre(f) {
    // Use the biggest piece, so places with far-off islands (France, USA) point at the mainland.
    const g = f.geometry;
    if (g.type !== 'MultiPolygon') return d3.geoCentroid(f);
    const parts = g.coordinates.map(c => ({ type: 'Polygon', coordinates: c }));
    return d3.geoCentroid(parts.reduce((a, b) => (d3.geoArea(b) > d3.geoArea(a) ? b : a)));
  }
  function select(name) {
    const key = norm(ALIAS[norm(name)] || name);
    const feature = world.find(f => norm(f.properties.name) === key) || null;
    const ll = feature ? centre(feature) : SMALL[norm(name)] || null;
    pick = { name, feature, ll: feature ? ll : dots.find(d => d === ll) || ll };
    if (!pick.ll) return draw();
    const from = [...rot], to = [-pick.ll[0], Math.max(-60, Math.min(60, -pick.ll[1]))];
    to[0] = from[0] + ((((to[0] - from[0]) % 360) + 540) % 360 - 180); // shortest way round
    const t0 = performance.now(), dur = 900;
    cancelAnimationFrame(spin);
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      rot = [from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e];
      draw();
      spin = k < 1 ? requestAnimationFrame(step) : null;
    };
    spin = requestAnimationFrame(step);
  }
  const list = $('.globe-list');
  const choose = li => {
    const same = li.classList.contains('is-picked');
    list.querySelectorAll('.is-picked').forEach(el => { el.classList.remove('is-picked'); el.setAttribute('aria-pressed', 'false'); });
    if (same) { pick = null; if (world) draw(); return; }
    li.classList.add('is-picked'); li.setAttribute('aria-pressed', 'true');
    pick = { name: li.dataset.place };
    if (world) select(li.dataset.place); else start();
  };
  list.addEventListener('click', e => { const li = e.target.closest('[data-place]'); if (li) choose(li); });
  list.addEventListener('keydown', e => {
    const li = e.target.closest('[data-place]');
    if (li && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); choose(li); }
  });

  win.addEventListener('win:open', start);
}

// ── Minesweeper ─────────────────────────────────────────────
function Minesweeper(win) {
  const $ = sel => win.querySelector(sel);
  const W = 9, H = 9, MINES = 10;
  const board = $('.ms-board'), faceBtn = $('.ms-face'), minesEl = $('.ms-mines'), timeEl = $('.ms-time'), flagBtn = $('.ms-flagmode');
  const NUM = ['', '#0000FF', '#008000', '#FF0000', '#000080', '#800000', '#008080', '#000000', '#808080'];
  let cells, state, flags, opened, seconds, tick, flagMode = false;

  const { sr, rect, svg } = Pixel;
  const faceBase = sr(1, 1, 22, 22, 11, '#000', 2) + sr(3, 3, 18, 18, 9, '#FFE000', 2);
  const FACES = {
    smile: faceBase + rect(8, 8, 2, 3, '#000') + rect(14, 8, 2, 3, '#000') + rect(7, 14, 2, 2, '#000') + rect(9, 16, 6, 2, '#000') + rect(15, 14, 2, 2, '#000'),
    wow: faceBase + rect(8, 8, 2, 3, '#000') + rect(14, 8, 2, 3, '#000') + rect(10, 14, 4, 4, '#000'),
    cool: faceBase + rect(6, 8, 12, 2, '#000') + rect(6, 8, 5, 4, '#000') + rect(13, 8, 5, 4, '#000') + rect(9, 16, 6, 2, '#000') + rect(7, 14, 2, 2, '#000') + rect(15, 14, 2, 2, '#000'),
    dead: faceBase + rect(7, 7, 2, 2, '#000') + rect(9, 9, 2, 2, '#000') + rect(9, 7, 2, 2, '#000') + rect(7, 9, 2, 2, '#000') +
          rect(13, 7, 2, 2, '#000') + rect(15, 9, 2, 2, '#000') + rect(15, 7, 2, 2, '#000') + rect(13, 9, 2, 2, '#000') + rect(9, 15, 6, 2, '#000'),
  };
  const FLAG = svg(16, 16, rect(7, 2, 2, 10, '#000') + rect(3, 2, 4, 2, '#E52222') + rect(1, 4, 6, 2, '#E52222') + rect(3, 6, 4, 2, '#E52222') + rect(4, 12, 8, 2, '#000'));
  const MINE = '<img src="assets/icons/minesweeper.svg" alt="" />';
  const face = f => { faceBtn.innerHTML = svg(24, 24, FACES[f]); };

  function reset() {
    cells = Array.from({ length: W * H }, () => ({ mine: false, open: false, flag: false, n: 0 }));
    state = 'ready'; flags = 0; opened = 0; seconds = 0;
    clearInterval(tick);
    board.innerHTML = cells.map((_, k) => `<button type="button" class="ms-cell" data-k="${k}" aria-label="Hidden square"></button>`).join('');
    face('smile'); led();
  }
  const led = () => {
    minesEl.textContent = String(Math.max(-99, MINES - flags)).padStart(3, '0');
    timeEl.textContent = String(Math.min(999, seconds)).padStart(3, '0');
  };
  const around = k => {
    const x = k % W, y = Math.floor(k / W), out = [];
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx, ny = y + dy;
      if ((dx || dy) && nx >= 0 && ny >= 0 && nx < W && ny < H) out.push(ny * W + nx);
    }
    return out;
  };
  // Mines are placed after the first click, never on or next to it.
  function plant(safe) {
    const banned = new Set([safe, ...around(safe)]);
    let placed = 0;
    while (placed < MINES) {
      const k = Math.floor(Math.random() * W * H);
      if (banned.has(k) || cells[k].mine) continue;
      cells[k].mine = true; placed++;
    }
    cells.forEach((c, k) => { c.n = around(k).filter(j => cells[j].mine).length; });
    state = 'playing';
    tick = setInterval(() => { seconds++; led(); }, 1000);
  }
  const el = k => board.children[k];
  function open(k) {
    const stack = [k];
    while (stack.length) {
      const j = stack.pop(), c = cells[j];
      if (c.open || c.flag) continue;
      c.open = true; opened++;
      const b = el(j);
      b.classList.add('open');
      b.setAttribute('aria-label', c.n ? `${c.n} mines nearby` : 'Empty');
      if (c.n) { b.textContent = c.n; b.style.color = NUM[c.n]; }
      else stack.push(...around(j));
    }
  }
  function lose(k) {
    state = 'over'; clearInterval(tick); face('dead');
    cells.forEach((c, j) => {
      if (c.mine && !c.flag) { el(j).classList.add('open'); el(j).innerHTML = MINE; }
      if (!c.mine && c.flag) el(j).classList.add('wrong');
    });
    el(k).classList.add('boom');
  }
  function checkWin() {
    if (opened !== W * H - MINES) return;
    state = 'over'; clearInterval(tick); face('cool');
    cells.forEach((c, j) => { if (c.mine && !c.flag) { c.flag = true; el(j).innerHTML = FLAG; } });
    flags = MINES; led();
  }
  function toggleFlag(k) {
    const c = cells[k];
    if (c.open || state === 'over') return;
    c.flag = !c.flag; flags += c.flag ? 1 : -1;
    el(k).innerHTML = c.flag ? FLAG : '';
    led();
  }

  board.addEventListener('click', e => {
    const b = e.target.closest('.ms-cell');
    if (!b || state === 'over') return;
    const k = +b.dataset.k;
    if (flagMode) { toggleFlag(k); return; }
    if (cells[k].flag || cells[k].open) return;
    if (state === 'ready') plant(k);
    if (cells[k].mine) return lose(k);
    open(k); face('smile'); checkWin();
  });
  board.addEventListener('contextmenu', e => {
    const b = e.target.closest('.ms-cell');
    if (!b) return;
    e.preventDefault();
    toggleFlag(+b.dataset.k);
  });
  board.addEventListener('pointerdown', e => { if (state !== 'over' && e.button === 0 && e.target.closest('.ms-cell')) face('wow'); });
  document.addEventListener('pointerup', () => { if (state !== 'over') face('smile'); });
  faceBtn.addEventListener('click', reset);
  flagBtn.addEventListener('click', () => {
    flagMode = !flagMode;
    flagBtn.setAttribute('aria-pressed', flagMode);
    flagBtn.querySelector('b').textContent = I18N.t(flagMode ? 'ON' : 'OFF');
  });
  flagBtn.querySelector('.ms-flag-ico').innerHTML = FLAG;
  I18N.on(() => { flagBtn.querySelector('b').textContent = I18N.t(flagMode ? 'ON' : 'OFF'); });
  reset();
}
