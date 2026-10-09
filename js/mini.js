// Floating yellow pixel mini player (based on the Apple "Music Widget").
function MiniPlayer(root, player, { onExpand }) {
  const { sr, rect, triL, triR, svg } = Pixel;
  const B = '#1803BB', G = '#D9D9D9', GL = '#EEEEEE', GD = '#9C9C9C', K = '#000', Y = '#F7D417', YL = '#FFE766',
        YD = '#EBC80C', YM = '#D6B000', YB = '#7A5F00';
  const COLS = 30;

  let s = '<g transform="translate(0,28)">';
  // note tab (expand)
  s += rect(376, -24, 44, 32, K) + rect(372, -28, 44, 32, B) + rect(376, -24, 36, 28, G);
  s += `<g class="m-note">${rect(384, -12, 8, 8, B) + rect(392, -24, 4, 16, B) + rect(396, -24, 4, 4, B) + rect(400, -20, 4, 4, B)}</g>`;
  // body
  s += sr(8, 8, 432, 128, 64, K) + sr(0, 0, 432, 128, 64, B) + sr(4, 4, 424, 120, 60, G) + sr(16, 8, 400, 36, 18, GL);
  // click wheel
  s += sr(14, 10, 108, 108, 54, B) + sr(18, 14, 100, 100, 50, GL);
  s += `<g class="m-center">${sr(38, 34, 60, 60, 30, B) + sr(42, 38, 52, 52, 26, G)}</g>`;
  s += `<g class="m-pause">${rect(58, 52, 8, 24, B) + rect(70, 52, 8, 24, B)}</g>`;
  s += `<g class="m-play" style="display:none">${triR(62, 64, 7, B)}</g>`;
  s += `<g class="m-glyph">${rect(62, 22, 12, 4, GD) + rect(66, 18, 4, 12, GD) + rect(62, 102, 12, 4, GD)}` +
       `${triL(22, 64, 3, GD) + triL(30, 64, 3, GD) + triR(100, 64, 3, GD) + triR(108, 64, 3, GD)}</g>`;
  // LCD
  s += `<g class="lcd-dark">${sr(132, 14, 288, 100, 28, YB)}</g><g class="lcd-fill">${sr(136, 18, 280, 92, 24, Y)}</g>` +
       `<g class="lcd-gloss">${sr(148, 22, 256, 28, 14, YL)}</g><g class="lcd-track">${sr(152, 70, 248, 30, 10, YD)}</g>`;
  for (let r = 0; r < 2; r++) for (let i = 0; i < COLS; i++)
    s += `<rect class="m-dot" data-c="${i}" x="${158 + i * 8}" y="${76 + r * 10}" width="6" height="6" fill="${YM}"/>`;
  // invisible hit areas
  const hit = (act, x, y, w, h, label) =>
    `<rect class="hit" data-act="${act}" x="${x}" y="${y}" width="${w}" height="${h}" fill="transparent"><title>${label}</title></rect>`;
  s += hit('volup', 42, 14, 52, 22, 'Volume up') + hit('voldown', 42, 94, 52, 22, 'Volume down') +
       hit('prev', 18, 36, 22, 56, 'Previous') + hit('next', 96, 36, 22, 56, 'Next') +
       hit('toggle', 40, 36, 56, 56, 'Play / pause') + hit('seek', 152, 70, 248, 30, 'Seek') +
       hit('expand', 372, -28, 44, 28, 'Open playlist');
  s += '</g>';

  root.innerHTML = svg(440, 168, s, 'class="mini-art"') +
    '<div class="mini-lcd"><div class="mini-title"><span></span></div><div class="mini-time">0:00</div></div>';
  const $ = sel => root.querySelector(sel);
  const dots = [...root.querySelectorAll('.m-dot')];
  const titleBox = $('.mini-title'), titleEl = $('.mini-title span'), timeEl = $('.mini-time');
  let flashTimer = null, lastTitle = '';

  function setTitle(text) {
    if (text === lastTitle) return;
    lastTitle = text;
    titleEl.textContent = text;
    titleBox.classList.remove('scroll');
    requestAnimationFrame(() => {
      const over = titleEl.scrollWidth - titleBox.clientWidth;
      if (over > 0) { titleBox.style.setProperty('--over', `-${over + 16}px`); titleBox.classList.add('scroll'); }
    });
  }

  // Recolour the screen to match the current song's CD.
  let pal = Pixel.lcd(null), palFor;
  function theme(t) {
    if (t === palFor) return;
    palFor = t;
    pal = Pixel.lcd(t);
    for (const k of ['dark', 'fill', 'gloss', 'track']) root.querySelector(`.lcd-${k} path`).setAttribute('fill', pal[k]);
    $('.mini-lcd').style.color = pal.ink;
  }

  function render(st) {
    theme(st.track);
    $('.m-pause').style.display = st.playing ? '' : 'none';
    $('.m-play').style.display = st.playing ? 'none' : '';
    const played = st.duration ? Math.round((st.time / st.duration) * COLS) : 0;
    dots.forEach(d => d.setAttribute('fill', +d.dataset.c < played ? pal.on : pal.off));
    timeEl.textContent = Player.fmt(st.time);
    if (!flashTimer) setTitle(st.track ? `${st.track.title} — ${st.track.artist}` : 'No tracks');
  }

  function flashVolume() {
    const v = Math.round(player.volume * 10);
    clearTimeout(flashTimer);
    lastTitle = '';
    titleBox.classList.remove('scroll');
    titleEl.textContent = 'VOL ' + '▮'.repeat(v) + '▯'.repeat(10 - v);
    flashTimer = setTimeout(() => { flashTimer = null; render(player.state()); }, 1200);
  }

  const actions = {
    toggle: () => player.toggle(),
    prev: () => player.prev(),
    next: () => player.next(),
    volup: () => { player.setVolume(player.volume + 0.1); flashVolume(); },
    voldown: () => { player.setVolume(player.volume - 0.1); flashVolume(); },
    expand: () => onExpand(),
  };

  // Drag anywhere that isn't a control; click controls.
  let drag = null;
  root.addEventListener('pointerdown', e => {
    const act = e.target.closest('[data-act]');
    if (act && act.dataset.act === 'seek') {
      const r = act.getBoundingClientRect();
      player.seek((e.clientX - r.left) / r.width);
      return;
    }
    if (act) return;
    const box = root.getBoundingClientRect();
    drag = { dx: e.clientX - box.left, dy: e.clientY - box.top, moved: false, id: e.pointerId };
    root.setPointerCapture(e.pointerId);
  });
  root.addEventListener('pointermove', e => {
    if (!drag) return;
    drag.moved = true;
    const w = root.offsetWidth, h = root.offsetHeight;
    const x = Math.max(0, Math.min(window.innerWidth - w * 0.5, e.clientX - drag.dx));
    const y = Math.max(0, Math.min(window.innerHeight - h * 0.5, e.clientY - drag.dy));
    Object.assign(root.style, { left: x + 'px', top: y + 'px', right: 'auto', bottom: 'auto' });
  });
  root.addEventListener('pointerup', () => { drag = null; });
  root.addEventListener('click', e => {
    const act = e.target.closest('[data-act]');
    if (act && actions[act.dataset.act]) actions[act.dataset.act]();
  });
  $('.mini-lcd').addEventListener('dblclick', () => onExpand());

  player.on(render);
}
