// Pixel-art drawing helpers: stepped ("pixelated") rounded shapes as SVG.
(function () {
  // Rounded rectangle whose corners are drawn as a staircase of u-sized pixels.
  function sr(x, y, w, h, r, fill, u = 4) {
    r = Math.min(r, w / 2, h / 2);
    const n = Math.floor(r / u);
    const dx = [];
    for (let k = 0; k < n; k++) {
      const yy = r - (k + 0.5) * u;
      dx.push(Math.round((r - Math.sqrt(Math.max(0, r * r - yy * yy))) / u) * u);
    }
    dx.push(0);
    const P = [];
    for (let k = n - 1; k >= 0; k--) { P.push([x + dx[k + 1], y + (k + 1) * u]); P.push([x + dx[k], y + (k + 1) * u]); }
    P.push([x + dx[0], y]);
    for (let k = 0; k < n; k++) { P.push([x + w - dx[k], y + k * u]); P.push([x + w - dx[k], y + (k + 1) * u]); }
    P.push([x + w, y + n * u]);
    for (let k = n - 1; k >= 0; k--) { P.push([x + w - dx[k + 1], y + h - (k + 1) * u]); P.push([x + w - dx[k], y + h - (k + 1) * u]); }
    P.push([x + w - dx[0], y + h]);
    for (let k = 0; k < n; k++) { P.push([x + dx[k], y + h - k * u]); P.push([x + dx[k], y + h - (k + 1) * u]); }
    P.push([x, y + h - n * u]);
    return `<path d="M${P.map(p => p.join(' ')).join(' L')} Z" fill="${fill}"/>`;
  }
  const rect = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
  // Left/right pointing triangles built from 2px columns.
  function triL(x0, cy, n, fill) { let s = ''; for (let i = 0; i < n; i++) { const h = 2 + 4 * i; s += rect(x0 + 2 * i, cy - h / 2, 2, h, fill); } return s; }
  function triR(x0, cy, n, fill) { let s = ''; for (let i = 0; i < n; i++) { const h = 2 + 4 * (n - 1 - i); s += rect(x0 + 2 * i, cy - h / 2, 2, h, fill); } return s; }
  const svg = (w, h, inner, attrs = '') =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" ${attrs}>${inner}</svg>`;

  const C = 'currentColor';
  const glyphs = {
    prev: rect(2, 2, 4, 20, C) + triL(6, 12, 5, C) + triL(16, 12, 5, C),
    next: triR(0, 12, 5, C) + triR(10, 12, 5, C) + rect(22, 2, 4, 20, C),
    play: triR(8, 12, 6, C),
    pause: rect(5, 1, 7, 22, C) + rect(16, 1, 7, 22, C),
    shuffle: rect(0, 4, 20, 4, C) + rect(20, 0, 4, 12, C) + rect(24, 4, 4, 4, C) +
             rect(8, 16, 20, 4, C) + rect(4, 12, 4, 12, C) + rect(0, 16, 4, 4, C),
    repeat: rect(2, 4, 24, 4, C) + rect(2, 16, 24, 4, C) + rect(2, 4, 4, 16, C) + rect(22, 4, 4, 16, C) + rect(16, 0, 4, 12, C),
    mail: rect(0, 2, 28, 2, C) + rect(0, 20, 28, 2, C) + rect(0, 2, 2, 20, C) + rect(26, 2, 2, 20, C) +
          [0, 1, 2, 3, 4, 5].map(i => rect(2 + i * 2, 4 + i * 2, 2, 2, C) + rect(24 - i * 2, 4 + i * 2, 2, 2, C)).join(''),
    instagram: rect(6, 0, 16, 3, C) + rect(6, 21, 16, 3, C) + rect(2, 4, 3, 16, C) + rect(23, 4, 3, 16, C) +
               rect(4, 2, 3, 3, C) + rect(21, 2, 3, 3, C) + rect(4, 19, 3, 3, C) + rect(21, 19, 3, 3, C) +
               rect(11, 6, 6, 2, C) + rect(11, 16, 6, 2, C) + rect(8, 9, 2, 6, C) + rect(18, 9, 2, 6, C) +
               rect(9, 7, 2, 2, C) + rect(17, 7, 2, 2, C) + rect(9, 15, 2, 2, C) + rect(17, 15, 2, 2, C) + rect(19, 4, 3, 3, C),
    download:rect(10, 0, 8, 12, C) + triR(0, 0, 0, C) + rect(4, 12, 20, 2, C) + rect(6, 14, 16, 2, C) + rect(8, 16, 12, 2, C) + rect(10, 18, 8, 2, C) + rect(12, 20, 4, 2, C) + rect(2, 22, 24, 2, C),
  };
  const glyph = name => svg(28, 24, glyphs[name] || '', 'class="glyph" aria-hidden="true"');

  // Pixel red close button (matches the Figma window chrome).
  let x = '';
  for (let i = 0; i < 7; i++) x += rect(9 + i * 2, 9 + i * 2, 2, 2, '#fff') + rect(21 - i * 2, 9 + i * 2, 2, 2, '#fff');
  const closeIcon = svg(32, 32, sr(0, 0, 32, 32, 16, '#5A0000', 2) + sr(2, 2, 28, 28, 14, '#E52222', 2) + x, 'aria-hidden="true"');

  // Pixel CD tinted with a song's colours: { rim, face, ring, hub, shine, stickers }.
  const heart = (x, y, c) => rect(x, y, 4, 4, c) + rect(x + 8, y, 4, 4, c) + rect(x - 2, y + 2, 16, 6, c) +
                             rect(x, y + 8, 12, 2, c) + rect(x + 2, y + 10, 8, 2, c) + rect(x + 4, y + 12, 4, 2, c);
  function disc(p = {}) {
    if (p.type === 'sunflower') return sunflower();
    let s = sr(10, 10, 88, 88, 44, p.rim || '#9C9C9C') + sr(14, 14, 80, 80, 40, p.face || '#E6E6E6') +
            sr(30, 30, 48, 48, 24, p.ring || '#CFCFCF') + sr(46, 46, 16, 16, 8, p.hub || '#7A5F00') +
            rect(26, 24, 8, 8, p.shine || '#fff') + rect(34, 20, 8, 4, p.shine || '#fff');
    if (p.stickers) s += heart(66, 22, p.stickers) + heart(24, 70, p.stickers);
    return svg(108, 108, s, 'aria-hidden="true"');
  }

  const cd = disc();

  // Pixel sunflower, drawn cell by cell from a 12-petal polar shape.
  function sunflower() {
    const U = 4, N = 27, C = 54;
    const petalR = t => 30 + 18 * Math.pow(Math.abs(Math.cos(6 * t)), 0.7);
    const kind = (i, j) => {
      const dx = i * U + U / 2 - C, dy = j * U + U / 2 - C, r = Math.hypot(dx, dy), t = Math.atan2(dy, dx);
      if (r < 18) return 'center';
      if (r < petalR(t)) return 'petal';
      return null;
    };
    let s = '';
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const k = kind(i, j);
      if (!k) continue;
      const dx = i * U + U / 2 - C, dy = j * U + U / 2 - C, r = Math.hypot(dx, dy), t = Math.atan2(dy, dx);
      let c;
      if (k === 'center') {
        c = r > 14 ? '#7A4A16' : (i + j) % 2 ? '#3B1F08' : '#5A3210';
      } else {
        const edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => !kind(i + a, j + b));
        const inner = r < petalR(t) - 9;
        c = edge ? '#9C5B00' : inner ? '#FFD21F' : '#F2A900';
        if (!edge && inner && dx < 0 && dy < 0 && (i + j) % 3 === 0) c = '#FFF09A';
      }
      s += rect(i * U, j * U, U, U, c);
    }
    return svg(108, 108, s, 'aria-hidden="true"');
  }

  // Draws a stepped-corner background behind any element with class="px-box".
  // data-r: corner radius, data-fill, data-border, data-gloss (optional highlight colour).
  function decorate(el) {
    const draw = () => {
      const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
      if (!w || !h) return;
      const r = +(el.dataset.r || 16), b = el.dataset.border, f = el.dataset.fill || '#fff', g = el.dataset.gloss;
      let inner = b ? sr(0, 0, w, h, r + 4, b) + sr(4, 4, w - 8, h - 8, r, f) : sr(0, 0, w, h, r, f);
      if (g) inner += sr(12, 8, w - 24, Math.min(24, h / 4), 12, g);
      let bg = el.querySelector(':scope > .px-bg');
      if (!bg) { bg = document.createElement('div'); bg.className = 'px-bg'; el.prepend(bg); }
      bg.innerHTML = svg(w, h, inner);
    };
    el.pxRedraw = draw; // call after changing data-fill / data-border / data-gloss
    draw();
    if ('ResizeObserver' in window) new ResizeObserver(draw).observe(el);
  }

  // Player screen colours for a track (falls back to the classic yellow).
  const LCD = { fill: '#F7D417', gloss: '#FFE766', dark: '#7A5F00', track: '#EBC80C', off: '#D6B000', on: '#7A5F00', ink: '#3B2F00' };
  // `sub` (small labels) defaults to the dark edge colour; dark screens set their own.
  const lcd = t => { const p = Object.assign({}, LCD, (t && t.lcd) || {}); p.sub = p.sub || p.dark; return p; };

  window.Pixel = { lcd, sr, rect, triL, triR, svg, glyph, closeIcon, cd, disc, sunflower, decorate };
})();
