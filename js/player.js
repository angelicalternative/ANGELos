// One shared player for the mini player and the playlist window.
// Each track plays through an "engine": SoundCloud (hidden widget) for tracks with
// a `soundcloud` link, or the browser's own audio for files in assets/music.

class HtmlEngine {
  constructor(p) {
    this.p = p;
    const a = (this.a = new Audio());
    a.preload = 'metadata';
    const sync = () => p._update({ time: a.currentTime || 0, duration: isFinite(a.duration) ? a.duration : 0, playing: !a.paused && !a.ended });
    ['timeupdate', 'play', 'pause', 'loadedmetadata', 'durationchange', 'emptied'].forEach(ev => a.addEventListener(ev, sync));
    a.addEventListener('ended', () => p.onEnded());
  }
  load(t, autoplay) { this.a.src = t.src; if (autoplay) this.play(); }
  play() { this.a.play().catch(() => {}); }
  pause() { this.a.pause(); }
  seek(sec) { this.a.currentTime = sec; }
  setVolume(v) { this.a.volume = v; }
}

class SoundCloudEngine {
  constructor(p) {
    this.p = p;
    this.ready = false;
    this.queue = [];
    this.duration = 0;
  }
  // Loads SoundCloud's widget script and a hidden widget the first time it's needed.
  boot(firstUrl) {
    if (this.booting) return this.booting;
    this.booting = new Promise(resolve => {
      const start = () => {
        const f = (this.iframe = document.createElement('iframe'));
        f.title = 'SoundCloud player';
        f.allow = 'autoplay; encrypted-media';
        f.className = 'sc-frame';
        f.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(firstUrl) +
                '&auto_play=false&visual=false&show_artwork=false&buying=false&sharing=false&download=false';
        document.body.appendChild(f);
        const w = (this.w = SC.Widget(f));
        const E = SC.Widget.Events;
        w.bind(E.READY, () => { this.ready = true; resolve(); this.queue.splice(0).forEach(fn => fn()); });
        w.bind(E.PLAY, () => this.p._update({ playing: true }));
        w.bind(E.PAUSE, () => this.p._update({ playing: false }));
        w.bind(E.FINISH, () => { this.p._update({ playing: false }); this.p.onEnded(); });
        w.bind(E.PLAY_PROGRESS, e => this.p._update({ time: e.currentPosition / 1000, duration: this.duration }));
        w.bind(E.ERROR, () => this.p._update({ playing: false, error: 'Couldn’t load this SoundCloud track' }));
      };
      if (window.SC && SC.Widget) return start();
      const s = document.createElement('script');
      s.src = 'https://w.soundcloud.com/player/api.js';
      s.onload = start;
      document.head.appendChild(s);
    });
    return this.booting;
  }
  run(fn) { this.ready ? fn() : this.queue.push(fn); }
  load(t, autoplay) {
    const first = !this.booting;
    this.boot(t.soundcloud);
    this.duration = 0;
    const afterLoad = () => {
      this.w.setVolume(Math.round(this.p.vol * 100));
      this.w.getDuration(ms => { this.duration = ms / 1000; t.duration = this.duration; this.p._update({ duration: this.duration }); });
      this.w.getCurrentSound(s => this.p._fillMeta(t, s));
      if (autoplay) this.w.play();
    };
    this.run(() => {
      if (first) afterLoad();
      else this.w.load(t.soundcloud, { auto_play: false, visual: false, show_artwork: false, callback: afterLoad });
    });
  }
  play() { this.run(() => this.w.play()); }
  pause() { this.run(() => this.w.pause()); }
  seek(sec) { this.run(() => this.w.seekTo(sec * 1000)); }
  setVolume(v) { this.run(() => this.w.setVolume(Math.round(v * 100))); }
}

class Player {
  constructor(tracks) {
    this.tracks = tracks || [];
    this.i = 0;
    this.shuffle = false;
    this.repeat = 'off'; // off → all → one
    this.listeners = new Set();
    this.st = { time: 0, duration: 0, playing: false, error: '' };
    this.vol = 0.8;
    try { const v = parseFloat(localStorage.getItem('player-volume')); if (!isNaN(v)) this.vol = v; } catch (e) {}
    this.html = new HtmlEngine(this);
    this.sc = new SoundCloudEngine(this);
    this.engine = null;
    this.setupMediaSession();
    this.prefetchMeta();
    if (this.tracks.length) this.load(0, false);
  }

  get volume() { return this.vol; }

  on(fn) { this.listeners.add(fn); fn(this.state()); }
  emit() { const s = this.state(); this.listeners.forEach(fn => fn(s)); }
  _update(patch) {
    if (!this._isCurrent) return;
    Object.assign(this.st, patch);
    this.emit();
  }

  state() {
    return {
      track: this.tracks[this.i] || null,
      index: this.i,
      ...this.st,
      volume: this.vol,
      shuffle: this.shuffle,
      repeat: this.repeat,
    };
  }

  load(i, autoplay) {
    const n = this.tracks.length;
    if (!n) return;
    if (this.engine) this.engine.pause();
    this.i = ((i % n) + n) % n;
    const t = this.tracks[this.i];
    this.engine = t.soundcloud ? this.sc : this.html;
    this._isCurrent = true;
    this.st = { time: 0, duration: t.duration || 0, playing: false, error: '' };
    this.engine.setVolume(this.vol);
    this.engine.load(t, autoplay);
    this._mediaMeta(t);
    this.emit();
  }

  play() { if (this.engine) this.engine.play(); }
  pause() { if (this.engine) this.engine.pause(); }
  toggle() { this.st.playing ? this.pause() : this.play(); }

  next(auto = false) {
    const n = this.tracks.length;
    if (!n) return;
    let idx;
    if (this.shuffle && n > 1) {
      do { idx = Math.floor(Math.random() * n); } while (idx === this.i);
    } else {
      idx = this.i + 1;
      if (idx >= n) {
        if (auto && this.repeat === 'off') { this.load(0, false); return; }
        idx = 0;
      }
    }
    this.load(idx, true);
  }

  // Like a real player: first press restarts the song, a quick second press goes back.
  prev() {
    if (this.st.time > 3) { this.engine.seek(0); this._update({ time: 0 }); return; }
    this.load(this.i - 1, true);
  }

  seek(fraction) {
    const d = this.st.duration;
    if (d > 0) {
      const sec = Math.max(0, Math.min(1, fraction)) * d;
      this.engine.seek(sec);
      this._update({ time: sec });
    }
  }

  setVolume(v) {
    this.vol = Math.max(0, Math.min(1, v));
    if (this.engine) this.engine.setVolume(this.vol);
    try { localStorage.setItem('player-volume', String(this.vol)); } catch (e) {}
    this.emit();
  }

  toggleShuffle() { this.shuffle = !this.shuffle; this.emit(); }
  cycleRepeat() { this.repeat = { off: 'all', all: 'one', one: 'off' }[this.repeat]; this.emit(); }

  onEnded() {
    if (this.repeat === 'one') { this.engine.seek(0); this.play(); }
    else this.next(true);
  }

  // Fill in any title / artist / artwork left blank in config.js from SoundCloud.
  _fillMeta(t, s) {
    if (!s) return;
    let changed = false;
    if (!t.title && s.title) { t.title = s.title; changed = true; }
    if (!t.artist && s.user) { t.artist = s.user.username; changed = true; }
    if (!t.cover && s.artwork_url) { t.cover = s.artwork_url.replace('-large', '-t500x500'); changed = true; }
    if (s.permalink_url) t.link = s.permalink_url;
    if (changed) { this._mediaMeta(t); this.emit(); this.listeners.forEach(fn => fn.meta && fn.meta()); }
    document.dispatchEvent(new CustomEvent('player:meta'));
  }

  prefetchMeta() {
    this.tracks.forEach(t => {
      if (!t.soundcloud || (t.title && t.artist && t.cover)) return;
      fetch('https://soundcloud.com/oembed?format=json&url=' + encodeURIComponent(t.soundcloud))
        .then(r => (r.ok ? r.json() : null))
        .then(o => {
          if (!o) return;
          // oEmbed titles look like "Song by Artist".
          const by = o.author_name ? ` by ${o.author_name}` : '';
          const title = by && o.title.endsWith(by) ? o.title.slice(0, -by.length) : o.title;
          this._fillMeta(t, { title, user: { username: o.author_name }, artwork_url: o.thumbnail_url });
        })
        .catch(() => {});
    });
  }

  _mediaMeta(t) {
    if (!('mediaSession' in navigator) || !window.MediaMetadata) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: t.title || '', artist: t.artist || '', artwork: t.cover ? [{ src: t.cover }] : [],
    });
  }

  setupMediaSession() {
    if (!('mediaSession' in navigator)) return;
    const ms = navigator.mediaSession;
    const set = (a, fn) => { try { ms.setActionHandler(a, fn); } catch (e) {} };
    set('play', () => this.play());
    set('pause', () => this.pause());
    set('previoustrack', () => this.prev());
    set('nexttrack', () => this.next());
    set('seekto', d => { if (d.seekTime != null) { this.engine.seek(d.seekTime); this._update({ time: d.seekTime }); } });
  }
}

Player.fmt = s => {
  s = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
