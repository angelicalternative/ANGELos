// Desktop: window manager, icons, About, Resume (PDF) and the player. My Work lives in work.html.
(function () {
  const SITE = window.SITE;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

  document.querySelectorAll('[data-glyph]').forEach(el => { el.innerHTML = Pixel.glyph(el.dataset.glyph); });
  document.querySelectorAll('.px-box').forEach(Pixel.decorate);

  // ── Windows ───────────────────────────────────────────────
  let z = 10;
  const placed = new Set();
  const Win = {
    get: id => document.getElementById('win-' + id),
    open(id) {
      const w = this.get(id);
      if (!w) return;
      w.hidden = false;
      this.focus(w);
      if (!placed.has(id)) { place(w); placed.add(id); }
      w.dispatchEvent(new CustomEvent('win:open'));
    },
    close(id) { const w = this.get(id); if (w) { w.hidden = true; w.dispatchEvent(new CustomEvent('win:close')); } },
    focus(w) { w.style.zIndex = ++z; },
  };

  // Default spots match the Figma frames on a 1512×982 desktop; clamped on smaller screens.
  function place(w) {
    // Kept clear of the right-hand icon column where possible.
    const pos = { about: [493, 171], playlist: [780, 150], resume: [640, 40], contact: [560, 220],
                  photos: [330, 80], globe: [600, 130], mines: [470, 180], junk: [520, 110] }[w.id.slice(4)] || [200, 120];
    const sx = window.innerWidth / 1512, sy = window.innerHeight / 982;
    const W = w.offsetWidth, H = w.offsetHeight;
    const x = Math.max(8, Math.min(window.innerWidth - W - 8, pos[0] * sx));
    const y = Math.max(8, Math.min(window.innerHeight - H - 8, pos[1] * sy));
    w.style.left = x + 'px';
    w.style.top = y + 'px';
  }

  $$('[data-win]').forEach(w => {
    w.addEventListener('pointerdown', () => Win.focus(w));
    const bar = $('.titlebar', w);
    let d = null;
    bar.addEventListener('pointerdown', e => {
      if (e.target.closest('button')) return;
      const r = w.getBoundingClientRect();
      d = { dx: e.clientX - r.left, dy: e.clientY - r.top };
      bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener('pointermove', e => {
      if (!d) return;
      const x = Math.max(-w.offsetWidth + 80, Math.min(window.innerWidth - 80, e.clientX - d.dx));
      const y = Math.max(0, Math.min(window.innerHeight - 40, e.clientY - d.dy));
      w.style.left = x + 'px';
      w.style.top = y + 'px';
    });
    bar.addEventListener('pointerup', () => { d = null; });
    $$('[data-close]', w).forEach(b => b.addEventListener('click', () => Win.close(w.id.slice(4))));
  });

  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); open(o.dataset.open); }
  });

  // Every link that leaves the site (Substack, email, project links…) opens in a
  // new tab so the desktop stays open behind it.
  function newTabLinks(root = document) {
    $$('a[href]', root).forEach(a => {
      const href = a.getAttribute('href');
      const external = /^mailto:/i.test(href) || (/^https?:/i.test(href) && new URL(href).origin !== location.origin);
      if (external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    });
  }

  // ── Icons ─────────────────────────────────────────────────
  const comingSoon = (a, url, name) => {
    if (url) a.href = url;
    else a.addEventListener('click', e => { e.preventDefault(); alert(`${name} link coming soon.`); });
  };
  comingSoon($('#substack-link'), SITE.substackUrl, 'Substack');

  // ── Contact ───────────────────────────────────────────────
  $('#contact-email').href = 'mailto:' + SITE.email;
  $('#contact-addr').textContent = SITE.email;
  comingSoon($('#contact-ig'), SITE.instagramUrl, 'Instagram');

  // ── Player ────────────────────────────────────────────────
  const player = new Player(SITE.tracks);
  window.ANGELOS_PLAYER = player; // lets other apps (Junk) pause the music
  const mini = $('#mini');
  const showMini = on => { mini.hidden = !on; };
  mini.addEventListener('pointerdown', () => Win.focus(mini));
  MiniPlayer(mini, player, { onExpand: () => open('playlist') });
  const pl = Win.get('playlist');
  PlaylistWindow(pl, player);
  $('[data-minimize]', pl).addEventListener('click', () => Win.close('playlist'));
  pl.addEventListener('win:open', () => showMini(false));
  pl.addEventListener('win:close', () => showMini(true));

  document.addEventListener('keydown', e => {
    if (e.code !== 'Space' || e.target.closest('input, textarea, button, a')) return;
    e.preventDefault();
    player.toggle();
  });

  // ── Fun apps ──────────────────────────────────────────────
  PhotoGallery(Win.get('photos'), SITE.photos || []);
  GlobeTracker(Win.get('globe'), SITE.countries || [], SITE.territories || []);
  Minesweeper(Win.get('mines'));
  JunkFolder(Win.get('junk'), SITE.junk || []);

  // ── Resume (PDF.js) ───────────────────────────────────────
  const ZOOMS = [0.5, 0.75, 1, 1.25, 1.5, 2];
  let zi = 2, pdf = null, rendering = false;
  const viewer = $('#pdf-viewer'), pagesWrap = $('#pdf-pages-wrap');
  async function loadPdf() {
    if (pdf || !window.pdfjsLib) { if (!window.pdfjsLib) fallbackPdf(); return; }
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    try {
      pdf = await pdfjsLib.getDocument('assets/resume/resume.pdf').promise;
      $('#pdf-pages').textContent = pdf.numPages;
      renderPdf();
    } catch (e) { fallbackPdf(); }
  }
  async function renderPdf() {
    if (!pdf || rendering) return;
    rendering = true;
    pagesWrap.innerHTML = '';
    const base = Math.min(560, viewer.clientWidth - 48);
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const v1 = page.getViewport({ scale: 1 });
      const scale = (base * ZOOMS[zi]) / v1.width;
      const vp = page.getViewport({ scale: scale * (window.devicePixelRatio || 1) });
      const c = document.createElement('canvas');
      c.width = vp.width; c.height = vp.height;
      c.style.width = v1.width * scale + 'px';
      c.dataset.page = p;
      pagesWrap.appendChild(c);
      await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
    }
    $('#pdf-zoom').textContent = Math.round(ZOOMS[zi] * 100) + '%';
    rendering = false;
  }
  function fallbackPdf() {
    pagesWrap.innerHTML = '<iframe class="pdf-fallback" src="assets/resume/resume.pdf" title="Resume"></iframe>';
  }
  $$('[data-zoom]').forEach(b => b.addEventListener('click', () => {
    zi = Math.max(0, Math.min(ZOOMS.length - 1, zi + (b.dataset.zoom === '+' ? 1 : -1)));
    renderPdf();
  }));
  viewer.addEventListener('scroll', () => {
    const mid = viewer.scrollTop + viewer.clientHeight / 2;
    const c = $$('canvas', pagesWrap).find(c => c.offsetTop + c.offsetHeight > mid);
    if (c) $('#pdf-page').textContent = c.dataset.page;
  });
  Win.get('resume').addEventListener('win:open', loadPdf);

  newTabLinks();

  function open(id) { Win.open(id); }
})();
