// Expanded playlist window: now playing, transport controls, volume, track list.
function PlaylistWindow(win, player) {
  const $ = sel => win.querySelector(sel);
  const DOTS = 42;

  win.querySelectorAll('[data-glyph]').forEach(el => { el.innerHTML = Pixel.glyph(el.dataset.glyph); });

  const dotsEl = $('.np-dots');
  dotsEl.innerHTML = '<i></i>'.repeat(DOTS * 2);
  const dots = [...dotsEl.children];

  const list = $('.tl-rows');
  list.innerHTML = player.tracks.map((t, i) => `
    <li><button type="button" class="tl-row" data-i="${i}">
      <span class="tl-no">${String(i + 1).padStart(2, '0')}</span>
      <span class="tl-title">${esc(t.title)}</span>
      <span class="tl-artist">${esc(t.artist || '')}</span>
      <span class="tl-time" data-dur="${i}">–:––</span>
    </button></li>`).join('');

  // Read each track's length up front so the list shows real durations.
  player.tracks.forEach((t, i) => {
    if (!t.src) return; // SoundCloud tracks get their length when they load
    const a = new Audio();
    a.preload = 'metadata';
    a.src = t.src;
    a.addEventListener('loadedmetadata', () => {
      const el = list.querySelector(`[data-dur="${i}"]`);
      if (el && isFinite(a.duration)) el.textContent = Player.fmt(a.duration);
    });
  });

  list.addEventListener('click', e => {
    const row = e.target.closest('.tl-row');
    if (!row) return;
    const i = +row.dataset.i;
    if (i === player.i) player.toggle(); else player.load(i, true);
  });

  win.addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    ({ prev: () => player.prev(), next: () => player.next(), toggle: () => player.toggle(),
       shuffle: () => player.toggleShuffle(), repeat: () => player.cycleRepeat() })[b.dataset.act]?.();
  });

  const vol = $('.vol input');
  vol.addEventListener('input', () => player.setVolume(+vol.value));

  dotsEl.addEventListener('pointerdown', e => {
    const r = dotsEl.getBoundingClientRect();
    player.seek((e.clientX - r.left) / r.width);
  });

  const cover = $('.np-cover img');
  let lastIndex = -1, lastPlaying = null;
  player.on(st => {
    const t = st.track;
    // The current row's marker always shows the same symbol as the big play/pause button.
    if (st.index !== lastIndex || st.playing !== lastPlaying) {
      list.querySelectorAll('.tl-row').forEach(r => {
        const i = +r.dataset.i, no = r.querySelector('.tl-no');
        no.innerHTML = i === st.index ? Pixel.glyph(st.playing ? 'pause' : 'play') : String(i + 1).padStart(2, '0');
      });
      lastPlaying = st.playing;
    }
    if (st.index !== lastIndex) {
      lastIndex = st.index;
      $('.np-title').textContent = t ? t.title : 'No tracks yet';
      $('.np-artist').textContent = t ? t.artist || '' : 'Add songs in js/config.js';
      if (t && t.cover) { cover.src = t.cover; cover.hidden = false; $('.np-cd').hidden = true; }
      else { cover.hidden = true; $('.np-cd').hidden = false; $('.np-cd').innerHTML = Pixel.disc(t && t.disc); }
      $('.np-cover').style.background = (t && t.disc && t.disc.bg) || '';
      const np = $('.np'), pal = Pixel.lcd(t);
      Object.assign(np.dataset, { fill: pal.fill, border: pal.dark, gloss: pal.gloss });
      if (np.pxRedraw) np.pxRedraw();
      for (const k of ['ink', 'dark', 'sub', 'track', 'off', 'on']) np.style.setProperty(`--lcd-${k}`, pal[k]);
      list.querySelectorAll('.tl-row').forEach(r => r.classList.toggle('is-current', +r.dataset.i === st.index));
      const cur = list.querySelector('.tl-row.is-current');
      if (cur) {
        const li = cur.parentElement, top = li.offsetTop, bottom = top + li.offsetHeight;
        if (top < list.scrollTop) list.scrollTop = top;
        else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
      }
    }
    $('.np-time').textContent = `${Player.fmt(st.time)} / ${Player.fmt(st.duration)}`;
    const played = st.duration ? Math.round((st.time / st.duration) * DOTS) : 0;
    dots.forEach((d, i) => d.classList.toggle('on', i % DOTS < played));
    const tog = $('[data-act="toggle"]');
    tog.innerHTML = Pixel.glyph(st.playing ? 'pause' : 'play');
    tog.setAttribute('aria-label', st.playing ? 'Pause' : 'Play');
    win.classList.toggle('is-playing', st.playing);
    $('[data-act="shuffle"]').setAttribute('aria-pressed', st.shuffle);
    const rep = $('[data-act="repeat"]');
    rep.setAttribute('aria-pressed', st.repeat !== 'off');
    rep.dataset.mode = st.repeat;
    rep.title = `Repeat: ${st.repeat}`;
    if (document.activeElement !== vol) vol.value = st.volume;
    vol.style.setProperty('--v', st.volume);
  });

  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
}
