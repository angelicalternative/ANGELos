// My Work page: colour-band timeline → click a band to open its project.
(function () {
  const SITE = window.SITE;
  const projects = SITE.projects;
  const n = projects.length;
  const mw = document.getElementById('mw');
  const scan = mw.querySelector('.mw-scan');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compact = () => matchMedia('(max-width: 760px), (max-aspect-ratio: 4 / 5)').matches;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const MOVE = reduce ? 0 : 820; // how long the bands take to rearrange (ms)

  // Pixel arrows (7×7 grid) so they match the pixel type instead of a system font.
  const ARROWS = {
    left: [[0, 3, 7, 1], [1, 2, 1, 1], [2, 1, 1, 1], [3, 0, 1, 1], [1, 4, 1, 1], [2, 5, 1, 1], [3, 6, 1, 1]],
    right: [[0, 3, 7, 1], [5, 2, 1, 1], [4, 1, 1, 1], [3, 0, 1, 1], [5, 4, 1, 1], [4, 5, 1, 1], [3, 6, 1, 1]],
    down: [[3, 0, 1, 7], [0, 3, 1, 1], [1, 4, 1, 1], [2, 5, 1, 1], [6, 3, 1, 1], [5, 4, 1, 1], [4, 5, 1, 1]],
    ne: [[2, 0, 5, 1], [6, 0, 1, 5], [5, 1, 1, 1], [4, 2, 1, 1], [3, 3, 1, 1], [2, 4, 1, 1], [1, 5, 1, 1], [0, 6, 1, 1]],
  };
  const arrow = dir =>
    `<svg class="px-arrow px-arrow-${dir}" viewBox="0 0 7 7" aria-hidden="true" shape-rendering="crispEdges">` +
    ARROWS[dir].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="currentColor"/>`).join('') + '</svg>';
  document.querySelectorAll('[data-arrow]').forEach(el => { el.outerHTML = arrow(el.dataset.arrow); });

  // ── Build the bands (geometry from the Figma frame, 1512×982) ──
  const edges = projects.map((_, k) => (k === n - 1 ? 624 + (n - 2) * 109 + 140 : 624 + k * 109));
  const tops = [511, ...edges.slice(0, -1)];
  const titleX = [38, 50, 116, 286];
  const bands = projects.map((p, k) => {
    const left = k ? edges[k - 1] : 506;
    const el = document.createElement('section');
    el.className = 'band';
    el.dataset.id = p.id;
    el.style.order = k; // phones stack the bands oldest → newest, like the desktop reads
    if (k === n - 1) el.classList.add('is-outer'); // the only band touching the page bottom
    const vars = {
      '--c': p.color, '--ink': p.ink, '--z': 10 + (n - k),
      '--l': '0%', '--t': (84 / 982) * 100 + '%', '--w': (edges[k] / 1512) * 100 + '%', '--h': ((edges[k] - 84) / 982) * 100 + '%',
      '--title-x': ((titleX[k] ?? 40) / edges[k]) * 100 + '%',
      '--title-y': (((tops[k] + edges[k]) / 2 - 84) / (edges[k] - 84)) * 100 + '%',
      '--date-x': (((left + edges[k]) / 2) / edges[k]) * 100 + '%',
      '--date-y': ((178 - 84) / (edges[k] - 84)) * 100 + '%',
    };
    for (const [key, v] of Object.entries(vars)) el.style.setProperty(key, v);
    el.innerHTML = `
      <button class="band-hit" type="button" aria-expanded="false" aria-controls="pj-${p.id}">
        <span class="band-title">${esc(p.title)}</span><span class="band-date">${esc(p.date)}</span>
      </button>
      <div class="band-panel" id="pj-${p.id}" role="region" aria-label="${esc(p.title)}"></div>`;
    return el;
  });
  // Outermost first in the page so inner bands sit on top.
  [...bands].reverse().forEach(b => mw.insertBefore(b, scan));

  // ── Contact + resume on the maroon field ──
  const info = mw.querySelector('.mw-info');
  info.querySelector('.mw-info-role').innerHTML = `${esc(SITE.role)}<br>${esc(SITE.studio)}`;
  const handle = (SITE.instagramUrl.match(/instagram\.com\/([^/?#]+)/) || [])[1];
  const rows = [
    ['Email', `<a href="mailto:${esc(SITE.email)}" target="_blank" rel="noopener">${esc(SITE.email)}</a>`],
    handle && ['Instagram', `<a href="${esc(SITE.instagramUrl)}" target="_blank" rel="noopener">@${esc(handle)}</a>`],
    SITE.substackUrl && ['Substack', `<a href="${esc(SITE.substackUrl)}" target="_blank" rel="noopener">${esc(SITE.substackUrl.replace(/^https?:\/\/|\/$/g, ''))}</a>`],
    SITE.location && ['Based in', esc(SITE.location)],
  ].filter(Boolean);
  info.querySelector('.mw-info-list').innerHTML = rows.map(([t, v]) => `<div><dt>${t}</dt><dd>${v}</dd></div>`).join('');
  const cover = mw.querySelector('.mw-cover');
  setTimeout(() => mw.classList.remove('loading'), 1400);

  // ── Hover: layered parallax + the hovered title leans toward the cursor ──
  let raf = 0, pointer = null;
  mw.addEventListener('pointermove', e => {
    if (reduce || compact() || mw.classList.contains('is-open') || e.pointerType === 'touch') return;
    pointer = e;
    if (!raf) raf = requestAnimationFrame(applyParallax);
  });
  mw.addEventListener('pointerleave', resetParallax);
  function applyParallax() {
    raf = 0;
    if (!pointer) return;
    const r = mw.getBoundingClientRect();
    const fx = (pointer.clientX - r.left) / r.width - 0.5, fy = (pointer.clientY - r.top) / r.height - 0.5;
    const hovered = pointer.target.closest && pointer.target.closest('.band');
    // The photo pans inside its frame, opposite the bands, like looking through a window.
    cover.style.setProperty('--cx', (-fx * 22).toFixed(1) + 'px');
    cover.style.setProperty('--cy', (-fy * 22).toFixed(1) + 'px');
    bands.forEach((b, k) => {
      const depth = 6 + (n - 1 - k) * 5; // inner bands move more
      b.style.setProperty('--px', (fx * depth).toFixed(1) + 'px');
      b.style.setProperty('--py', (fy * depth).toFixed(1) + 'px');
      if (b === hovered) {
        const t = b.querySelector('.band-title').getBoundingClientRect();
        const mx = Math.max(-14, Math.min(14, (pointer.clientX - (t.left + t.width / 2)) * 0.05));
        const my = Math.max(-8, Math.min(8, (pointer.clientY - (t.top + t.height / 2)) * 0.12));
        b.style.setProperty('--mx', mx.toFixed(1) + 'px');
        b.style.setProperty('--my', my.toFixed(1) + 'px');
      } else {
        b.style.setProperty('--mx', '0px');
        b.style.setProperty('--my', '0px');
      }
    });
  }
  function resetParallax() {
    pointer = null;
    bands.forEach(b => ['--px', '--py', '--mx', '--my'].forEach(v => b.style.setProperty(v, '0px')));
    cover.style.setProperty('--cx', '0px');
    cover.style.setProperty('--cy', '0px');
  }

  // ── Project content ──
  function build(p, k) {
    const isEvent = p.kind === 'event';
    const facts = [['ROLE', p.role], ['DATE', p.date], ['FORMAT', p.format]]
      .filter(([, v]) => v);
    // Photo tiles for a gallery; empty lists show labelled placeholders.
    const tiles = (list, label, count, base) => (list || []).length
      ? list.map((im, i) => `<figure class="reveal" style="--d:${base + i * 0.1}s" tabindex="0" role="button" aria-label="View ${label.toLowerCase()} ${i + 1} larger"><img src="${esc(im.src)}" alt="${esc(im.caption || p.title)}" loading="lazy"${im.focus ? ` style="object-position:${esc(im.focus)}"` : ''} />${im.caption ? `<figcaption>${esc(im.caption)}</figcaption>` : ''}</figure>`).join('')
      : Array.from({ length: count }, (_, i) => `<div class="placeholder reveal" style="--d:${base + i * 0.1}s">${label} 0${i + 1}<small>assets/work/${esc(p.id)}/</small></div>`).join('');
    const imgs = tiles(p.images, 'IMAGE', 4, 0.55);
    const promo = tiles(p.promo, 'POST', 3, 0.6);
    const next = projects[(k + 1) % n];
    return `
      <article class="pj">
        <div class="pj-top reveal" style="--d:.05s"><button class="pj-btn" type="button" data-close>${arrow('left')}ALL WORK</button></div>
        <header class="pj-head reveal" style="--d:.1s">
          <p class="pj-tag">${esc(p.tag)}</p>
          <h2 class="pj-title">${esc(p.title)}</h2>
          <p class="pj-date">${esc(p.date)}</p>
        </header>
        <div class="pj-drop"><div>
          <div class="pj-intro">
            <p class="pj-summary reveal" style="--d:.25s">${esc(p.summary)}</p>
            <dl class="pj-facts reveal" style="--d:.35s">${facts.map(([t, v]) => `<div><dt>${esc(t)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
          </div>
          <section class="pj-section reveal" style="--d:.45s">
            <h3>${isEvent ? 'POSTER & RECAP' : 'THE ISSUE'}</h3>
            ${p.cover ? `
            <div class="pj-cover">
              <a class="pj-cover-art" href="${esc(p.edition || p.pdf || p.cover)}" target="_blank" rel="noopener" aria-label="${p.edition || p.pdf ? 'See the full edition of' : 'View the poster for'} ${esc(p.title)}">
                <img src="${esc(p.cover)}" alt="${isEvent ? 'Poster' : 'Cover'} of ${esc(p.title)}" loading="lazy" />
              </a>
              <div class="pj-cover-side">
                <p>${esc(p.format)}</p>
                ${p.edition || p.pdf ? `<a class="pj-btn pj-btn-big" href="${esc(p.edition || p.pdf)}" target="_blank" rel="noopener">SEE FULL EDITION${arrow('ne')}</a>` : isEvent ? '' : '<p class="pj-soon">FULL EDITION COMING SOON</p>'}
              </div>
            </div>` : `
            <div class="mag" data-pdf="${esc(p.pdf || '')}">
              ${p.pdf ? `<div class="mag-spread"></div>
                <div class="mag-bar"><button class="pj-btn" type="button" data-mag="prev">${arrow('left')}PREV</button><span class="mag-pages">LOADING…</span><button class="pj-btn" type="button" data-mag="next">NEXT${arrow('right')}</button></div>`
              : `<div class="placeholder">${isEvent ? 'EVENT POSTER / RECAP PDF' : 'MAGAZINE PDF'} GOES HERE<small>assets/work/${esc(p.id)}/</small></div>`}
            </div>`}
          </section>
          ${p.video ? `<section class="pj-section pj-video reveal" style="--d:.5s"><h3>${isEvent ? 'THE NIGHT' : 'MOTION'}</h3><video src="${esc(p.video)}" controls playsinline preload="metadata"></video></section>` : ''}
          <section class="pj-section">
            <h3 class="reveal" style="--d:.5s">${isEvent ? 'PHOTOS' : 'BEHIND THE SCENES'}</h3>
            <div class="pj-gallery">${imgs}</div>
          </section>
          <section class="pj-section">
            <h3 class="reveal" style="--d:.55s">INSTAGRAM &amp; PROMO</h3>
            <div class="pj-gallery pj-gallery-ig${p.promoRatio === 'auto' ? ' is-natural' : ''}" style="--cols:${p.promoCols || Math.min(3, (p.promo || []).length || 3)}${p.promoRatio && p.promoRatio !== 'auto' ? `;--ar:${esc(p.promoRatio)}` : ''}">${promo}</div>
          </section>
          ${(p.credits || []).length ? `<section class="pj-section reveal" style="--d:.6s"><h3>CREDITS</h3><dl class="pj-credits">${p.credits.map(([r, nme]) => `<div><dt>${esc(r)}</dt><dd>${esc(nme)}</dd></div>`).join('')}</dl></section>` : ''}
          ${(p.links || []).length ? `<section class="pj-section reveal" style="--d:.6s"><h3>LINKS</h3><div class="pj-links">${p.links.map(l => `<a class="pj-btn" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)}${arrow('ne')}</a>`).join('')}</div></section>` : ''}
          <footer class="pj-foot reveal" style="--d:.7s">
            <button class="pj-btn" type="button" data-close>${arrow('left')}ALL WORK</button>
            <button class="pj-btn" type="button" data-goto="${esc(next.id)}">NEXT: ${esc(next.title)}${arrow('right')}</button>
          </footer>
        </div></div>
      </article>`;
  }

  // ── Tab icon: each project can swap in its own favicon ──
  const iconLinks = [...document.querySelectorAll('link[rel="icon"]')].map(l => ({ l, href: l.getAttribute('href'), type: l.type }));
  function setFavicon(p) {
    iconLinks.forEach(({ l, href, type }) => {
      // The main link carries the project icon (SVG or PNG); the 32px fallback gets its matching -32.png version.
      const f = p && p.favicon, main = type === 'image/svg+xml';
      l.setAttribute('href', f ? (main ? f : f.replace(/\.(svg|png)$/, '-32.png')) : href);
      l.type = f && main ? (f.endsWith('.png') ? 'image/png' : 'image/svg+xml') : type;
    });
  }

  // ── Open / close ──
  let active = null, dropTimer = 0;
  function open(id, { push = true } = {}) {
    const k = projects.findIndex(p => p.id === id);
    if (k < 0) return close({ push });
    const band = bands[k];
    if (active === band) return;
    clearTimeout(dropTimer);
    const switching = !!active;
    if (active) { active.classList.remove('is-active', 'is-dropped'); active.querySelector('.band-hit').setAttribute('aria-expanded', 'false'); }
    active = band;
    const panel = band.querySelector('.band-panel');
    if (!panel.dataset.built) { panel.innerHTML = build(projects[k], k); panel.dataset.built = '1'; }
    panel.scrollTop = 0;
    // The other bands become tabs on the right, in date order.
    const others = bands.filter(b => b !== band);
    others.forEach((b, i) => b.style.setProperty('--tab', String(others.length - i)));
    mw.style.setProperty('--ntabs', String(others.length));
    resetParallax();
    mw.classList.add('is-open');
    band.classList.add('is-active');
    band.querySelector('.band-hit').setAttribute('aria-expanded', 'true');
    document.title = `${projects[k].title} — Angelo Gibbs`;
    setFavicon(projects[k]);
    if (push) history.pushState({ id }, '', '#' + id);
    // Once the bands have moved, the project drops down and fades in.
    dropTimer = setTimeout(() => {
      band.classList.add('is-dropped');
      band.querySelector('[data-close]').focus({ preventScroll: true });
      loadMag(band.querySelector('.mag'));
    }, switching ? MOVE * 0.75 : MOVE);
  }
  function close({ push = true } = {}) {
    if (!active) return;
    clearTimeout(dropTimer);
    const band = active;
    band.classList.remove('is-dropped');
    band.querySelectorAll('video').forEach(v => v.pause());
    setTimeout(() => {
      mw.classList.remove('is-open');
      band.classList.remove('is-active');
      band.querySelector('.band-hit').setAttribute('aria-expanded', 'false');
      band.querySelector('.band-hit').focus({ preventScroll: true });
    }, reduce ? 0 : 280);
    active = null;
    document.title = 'My Work — Angelo Gibbs';
    setFavicon(null);
    if (push) history.pushState({}, '', location.pathname + location.search);
  }

  mw.addEventListener('click', e => {
    const hit = e.target.closest('.band-hit');
    if (hit) return open(hit.closest('.band').dataset.id);
    if (e.target.closest('[data-close]')) return close();
    const go = e.target.closest('[data-goto]');
    if (go) return open(go.dataset.goto);
    const m = e.target.closest('[data-mag]');
    if (m) return flip(m.closest('.mag'), m.dataset.mag === 'next' ? 1 : -1);
    const fig = e.target.closest('.pj-gallery figure');
    if (fig) openLightbox([...fig.parentElement.querySelectorAll('figure')], fig);
  });

  // ── Lightbox: click a gallery photo to see it big, flip with ← / → ──
  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.hidden = true;
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Photo viewer');
  lb.innerHTML = `
    <button class="lb-btn lb-close" type="button" aria-label="Close">CLOSE</button>
    <button class="lb-btn lb-prev" type="button" aria-label="Previous photo">${arrow('left')}</button>
    <figure class="lb-stage"><img alt="" /><figcaption><span class="lb-cap"></span><span class="lb-count"></span></figcaption></figure>
    <button class="lb-btn lb-next" type="button" aria-label="Next photo">${arrow('right')}</button>`;
  document.body.appendChild(lb);
  let lbItems = [], lbAt = 0, lbReturn = null;
  function openLightbox(figs, fig) {
    lbItems = figs.map(f => ({ src: f.querySelector('img').src, alt: f.querySelector('img').alt, cap: f.querySelector('figcaption')?.textContent || '' }));
    lbReturn = fig;
    lb.style.setProperty('--lb-ink', active ? getComputedStyle(active).getPropertyValue('--c') : '#F2EEE3');
    showLightbox(figs.indexOf(fig));
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add('is-open'));
    lb.querySelector('.lb-close').focus({ preventScroll: true });
  }
  function showLightbox(i) {
    lbAt = (i + lbItems.length) % lbItems.length;
    const it = lbItems[lbAt], img = lb.querySelector('.lb-stage img');
    img.classList.remove('is-in');
    img.onload = () => img.classList.add('is-in');
    img.src = it.src;
    img.alt = it.alt;
    if (img.complete) img.classList.add('is-in');
    lb.querySelector('.lb-cap').textContent = it.cap;
    lb.querySelector('.lb-count').textContent = `${String(lbAt + 1).padStart(2, '0')} / ${String(lbItems.length).padStart(2, '0')}`;
  }
  function closeLightbox() {
    lb.classList.remove('is-open');
    setTimeout(() => { lb.hidden = true; }, reduce ? 0 : 250);
    if (lbReturn) lbReturn.focus({ preventScroll: true });
  }
  lb.addEventListener('click', e => {
    if (e.target.closest('.lb-prev')) return showLightbox(lbAt - 1);
    if (e.target.closest('.lb-next')) return showLightbox(lbAt + 1);
    if (e.target.closest('.lb-close') || !e.target.closest('.lb-stage img')) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lb.hidden) {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') showLightbox(lbAt + 1);
      else if (e.key === 'ArrowLeft') showLightbox(lbAt - 1);
      return;
    }
    if (!active) return;
    const f = document.activeElement && document.activeElement.closest && document.activeElement.closest('.pj-gallery figure');
    if (f && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); return openLightbox([...f.parentElement.querySelectorAll('figure')], f); }
    if (e.key === 'Escape') return close();
    const mag = active.classList.contains('is-dropped') && active.querySelector('.mag[data-pdf]:not([data-pdf=""])');
    if (mag && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) flip(mag, e.key === 'ArrowRight' ? 1 : -1);
  });
  window.addEventListener('popstate', () => {
    const id = location.hash.slice(1);
    id ? open(id, { push: false }) : close({ push: false });
  });
  if (location.hash.length > 1) setTimeout(() => open(location.hash.slice(1), { push: false }), 300);

  // ── Magazine viewer (PDF.js): cover alone, then two-page spreads ──
  let pdfjsReady = null;
  const loadPdfJs = () => pdfjsReady || (pdfjsReady = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = () => { pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; res(); };
    s.onerror = rej;
    document.head.appendChild(s);
  }));
  const spreads = pages => { const out = [[1]]; for (let p = 2; p <= pages; p += 2) out.push(p + 1 <= pages ? [p, p + 1] : [p]); return out; };
  async function loadMag(mag) {
    if (!mag || !mag.dataset.pdf || mag.doc || mag.loading) return;
    mag.loading = true;
    const label = mag.querySelector('.mag-pages');
    // Opened straight from disk (file://): browsers block PDF.js there, so use the built-in viewer.
    if (location.protocol === 'file:') return nativeViewer(mag);
    try {
      await loadPdfJs();
      const task = pdfjsLib.getDocument(mag.dataset.pdf);
      task.onProgress = ({ loaded, total }) => {
        // Ignore late progress once pages are showing (the rest streams in the background).
        if (total && label && !mag.doc) label.textContent = `LOADING ${Math.min(99, Math.round((loaded / total) * 100))}%`;
      };
      mag.doc = await task.promise;
      mag.spreads = compact() ? Array.from({ length: mag.doc.numPages }, (_, i) => [i + 1]) : spreads(mag.doc.numPages);
      mag.at = 0;
      await renderSpread(mag);
      mag.classList.add('loaded');
    } catch (e) {
      console.warn('Magazine viewer fell back to the browser PDF viewer:', e);
      nativeViewer(mag);
    }
  }
  // Fallback: the browser's own PDF viewer, plus a button to open it full-screen.
  function nativeViewer(mag) {
    const src = mag.dataset.pdf;
    mag.innerHTML = `<iframe class="mag-native" src="${esc(src)}#view=FitH" title="Magazine PDF"></iframe>
      <div class="mag-bar"><span></span><a class="pj-btn" href="${esc(src)}" target="_blank" rel="noopener">OPEN PDF${arrow('ne')}</a></div>`;
    mag.classList.add('loaded');
  }
  async function renderSpread(mag) {
    const wrap = mag.querySelector('.mag-spread');
    const pages = mag.spreads[mag.at];
    const canvases = await Promise.all(pages.map(async num => {
      const page = await mag.doc.getPage(num);
      const vp = page.getViewport({ scale: 2 });
      const c = document.createElement('canvas');
      c.width = vp.width; c.height = vp.height;
      // 'print' intent renders without requestAnimationFrame, so pages still
      // draw when the project was opened in a background tab.
      await page.render({ canvasContext: c.getContext('2d'), viewport: vp, intent: 'print' }).promise;
      return c;
    }));
    wrap.replaceChildren(...canvases);
    const total = mag.doc.numPages;
    mag.querySelector('.mag-pages').textContent =
      `${pages.length > 1 ? `PAGES ${pages[0]}–${pages[1]}` : `PAGE ${pages[0]}`} / ${total}`;
    mag.querySelector('[data-mag="prev"]').disabled = mag.at === 0;
    mag.querySelector('[data-mag="next"]').disabled = mag.at === mag.spreads.length - 1;
  }
  async function flip(mag, dir) {
    if (!mag.doc || mag.busy) return;
    const to = mag.at + dir;
    if (to < 0 || to >= mag.spreads.length) return;
    mag.busy = true;
    mag.classList.remove('loaded');
    await new Promise(r => setTimeout(r, reduce ? 0 : 220));
    mag.at = to;
    await renderSpread(mag);
    mag.classList.add('loaded');
    mag.busy = false;
  }
})();
