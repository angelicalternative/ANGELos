// English / Spanish switch, shared by the desktop and My Work.
//  • Static text: add data-i18n to an element. The key is the attribute value, or the
//    element's own English text when the attribute is empty. ES below holds the Spanish.
//  • Script text: I18N.t('ENGLISH TEXT') returns the Spanish when Spanish is on.
//  • Content in config.js: give an item an `es: { field: '…' }` block; I18N.pick(item, 'field').
//  • I18N.on(fn) runs fn whenever the language changes, so scripts can redraw.
(function () {
  const ES = {
    // Boot + welcome
    'STARTING SYSTEM UP': 'INICIANDO SISTEMA',
    'Click anywhere to start': 'Haz clic en cualquier lugar para empezar',
    'NOTICE': 'AVISO',
    welcome: 'Bienvenidos a <b>ANGELos</b>', thanks: '¡Gracias!',
    // Desktop icons
    'ABOUT ME': 'SOBRE MÍ', 'MY WORK': 'MI TRABAJO', 'MUSIC': 'MÚSICA', 'CONTACT ME': 'CONTÁCTAME',
    'PHOTOS': 'FOTOS', 'GLOBE TRACKER': 'MIS VIAJES', 'MINESWEEPER': 'BUSCAMINAS', 'JUNK': 'CACHIVACHES',
    // About
    'ABOUT ME!': '¡SOBRE MÍ!',
    role: 'Diseñador Gráfico y Director de Arte',
    'PLAYER STATS': 'ESTADÍSTICAS', 'CREATIVITY': 'CREATIVIDAD', 'SLEEP': 'SUEÑO', 'FONTS INSTALLED': 'FUENTES INSTALADAS',
    bio: '¡Hola, soy Angelo! Soy diseñador gráfico y director de arte autodidacta de El Retiro, Colombia. Fundé Angelo Studio, una agencia creativa en español donde hago la revista editorial Angelo by Angelo Studio, además de fotografía y contenido audiovisual.',
    'OPEN RESUME': 'ABRIR HOJA DE VIDA',
    // Contact
    'CONTACT ME!': '¡CONTÁCTAME!', lead: 'Hagamos algo juntos.', 'EMAIL ME': 'ESCRÍBEME', 'SOCIALS': 'REDES',
    // Globe
    'LOADING MAP…': 'CARGANDO MAPA…', 'DRAG TO SPIN': 'ARRASTRA PARA GIRAR', 'COUNTRIES VISITED': 'PAÍSES VISITADOS',
    'COUNTRIES': 'PAÍSES', 'TERRITORIES': 'TERRITORIOS', 'OF': 'DE', 'states': 'estados', 'places': 'lugares', 'territory': 'territorio',
    'Couldn’t load the map (offline?)': 'No se pudo cargar el mapa (¿sin internet?)',
    // Minesweeper
    'FLAG MODE:': 'MODO BANDERA:', 'ON': 'SÍ', 'OFF': 'NO',
    'Click to dig · Right-click to flag': 'Clic para excavar · Clic derecho para marcar',
    // Junk
    junkpath: 'C:\\ANGELO\\CACHIVACHES\\', back: '&lt; ATRÁS', 'just for fun': 'solo por diversión',
    'object': 'objeto', 'objects': 'objetos', 'OPEN FILE': 'ABRIR ARCHIVO', 'Empty… for now.': 'Vacío… por ahora.',
    'Couldn’t open this note.': 'No se pudo abrir esta nota.',
    // Resume
    'RESUME.PDF': 'HOJA_DE_VIDA.PDF', 'PAGE': 'PÁG.', 'DOWNLOAD': 'DESCARGAR',
    // Player
    'NOW PLAYING': 'SONANDO', 'TITLE': 'TÍTULO', 'ARTIST': 'ARTISTA', 'TIME': 'DURACIÓN',
    // My Work page
    'My Work': 'Mi Trabajo', 'Email': 'Correo', 'Based in': 'Ubicación',
    'View Resume': 'Ver hoja de vida', 'Download Resume': 'Descargar hoja de vida',
    siteRole: 'Director de Arte y Diseñador Gráfico', studio: 'Fundador, Angelo Studio',
    'ALL WORK': 'PROYECTOS', 'ROLE': 'ROL', 'DATE': 'FECHA', 'FORMAT': 'FORMATO',
    'THE ISSUE': 'LA EDICIÓN', 'POSTER & RECAP': 'PÓSTER Y RESUMEN',
    'SEE FULL EDITION': 'VER EDICIÓN COMPLETA', 'FULL EDITION COMING SOON': 'EDICIÓN COMPLETA MUY PRONTO', 'COMING SOON': 'MUY PRONTO', 'LOCKED': 'BLOQUEADO',
    'THE NIGHT': 'LA NOCHE', 'MOTION': 'VIDEO', 'BEHIND THE SCENES': 'DETRÁS DE CÁMARAS',
    'INSTAGRAM & PROMO': 'INSTAGRAM Y PROMO', 'CREDITS': 'CRÉDITOS', 'LINKS': 'ENLACES', 'NEXT:': 'SIGUIENTE:',
    'CLOSE': 'CERRAR', 'OPEN PDF': 'ABRIR PDF', 'PAGES': 'PÁGS.', 'LOADING': 'CARGANDO', 'PREV': 'ANT.', 'NEXT': 'SIG.',
    'IMAGE': 'IMAGEN', 'POST': 'POST', 'GOES HERE': 'VA AQUÍ',
    // Colour-blind setting
    'COLORBLIND MODE': 'MODO DALTONISMO', 'Accessibility': 'Accesibilidad',
  };
  // Country names for the Globe Tracker list.
  const COUNTRIES = {
    Argentina: 'Argentina', Bahamas: 'Bahamas', Barbados: 'Barbados', Brazil: 'Brasil', Chile: 'Chile', Colombia: 'Colombia',
    'Dominican Republic': 'República Dominicana', Ecuador: 'Ecuador', Jamaica: 'Jamaica', Mexico: 'México', Panama: 'Panamá',
    Paraguay: 'Paraguay', Peru: 'Perú', 'United States': 'Estados Unidos', Uruguay: 'Uruguay', Indonesia: 'Indonesia',
    Israel: 'Israel', Japan: 'Japón', Palestine: 'Palestina', Singapore: 'Singapur', Turkey: 'Turquía', Albania: 'Albania',
    Austria: 'Austria', 'Bosnia and Herzegovina': 'Bosnia y Herzegovina', Croatia: 'Croacia', Denmark: 'Dinamarca',
    Estonia: 'Estonia', Finland: 'Finlandia', France: 'Francia', Germany: 'Alemania', Hungary: 'Hungría', Iceland: 'Islandia',
    Italy: 'Italia', Monaco: 'Mónaco', Montenegro: 'Montenegro', Netherlands: 'Países Bajos', Norway: 'Noruega',
    Portugal: 'Portugal', Serbia: 'Serbia', Spain: 'España', Sweden: 'Suecia', 'United Kingdom': 'Reino Unido',
    Australia: 'Australia', 'New Zealand': 'Nueva Zelanda', Aruba: 'Aruba', 'Cayman Islands': 'Islas Caimán',
    'Turks and Caicos Islands': 'Islas Turcas y Caicos', 'Hong Kong': 'Hong Kong', England: 'Inglaterra',
    'New South Wales': 'Nueva Gales del Sur',
  };

  const KEY = 'angelos-lang';
  const fromUrl = (location.search.match(/[?&]lang=(en|es)\b/) || [])[1];
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  let lang = fromUrl || saved || ((navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en');
  const subs = [];

  const I18N = {
    get lang() { return lang; },
    get es() { return lang === 'es'; },
    t: s => (lang === 'es' && ES[s] != null ? ES[s] : s),
    country: s => (lang === 'es' && COUNTRIES[s]) || s,
    // Spanish version of a config field when there is one.
    pick: (o, f) => (lang === 'es' && o && o.es && o.es[f] != null ? o.es[f] : o && o[f]),
    on: fn => subs.push(fn),
    set(l) {
      if (l === lang) return;
      lang = l;
      try { localStorage.setItem(KEY, l); } catch (e) {}
      apply();
      subs.forEach(fn => fn(l));
    },
  };
  window.I18N = I18N;

  function apply(root = document) {
    document.documentElement.lang = lang;
    root.querySelectorAll('[data-i18n]').forEach(el => {
      if (el.i18nEn == null) el.i18nEn = el.innerHTML;
      const key = el.dataset.i18n || el.textContent.trim();
      el.innerHTML = lang === 'es' && ES[key] != null ? ES[key] : el.i18nEn;
    });
    document.querySelectorAll('.lang-toggle button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  }
  I18N.apply = apply;

  // ── Colourblind modes ──
  // Each mode runs the whole page through a colour-correction filter (daltonization):
  // the colour differences that type of colourblindness can't see get moved into ones
  // it can, so reds, greens and yellows (or blues) stop blending together. On top of
  // that, anything that relied on red (the picked country on the globe) uses black.
  const MODES = ['off', 'protan', 'deutan', 'tritan'];
  const MATRIX = {
    protan: '1 0 0 0 0  -0.255 1.255 0 0 0  0.303 -0.545 1.242 0 0  0 0 0 1 0',
    deutan: '1 0 0 0 0  -0.438 1.438 0 0 0  0.262 -0.562 1.300 0 0  0 0 0 1 0',
    tritan: '1.050 -0.382 0.332 0 0  0 1.234 -0.234 0 0  0 0 1 0 0  0 0 0 1 0',
  };
  const LABEL = {
    en: { off: 'Off', protan: 'Red-blind', deutan: 'Green-blind', tritan: 'Blue-blind' },
    es: { off: 'Apagado', protan: 'Rojo', deutan: 'Verde', tritan: 'Azul' },
  };
  const SCI = { protan: 'protanopia', deutan: 'deuteranopia', tritan: 'tritanopia' };
  const CVD_KEY = 'angelos-cvd';
  let cvd = 'off';
  try {
    const v = localStorage.getItem(CVD_KEY);
    cvd = MODES.includes(v) ? v : v === '1' ? 'deutan' : 'off';
  } catch (e) {}
  const cvdSubs = [];
  window.PREFS = {
    get cvd() { return cvd !== 'off'; },
    get cvdMode() { return cvd; },
    onCvd: fn => cvdSubs.push(fn),
    setCvd(mode) {
      cvd = MODES.includes(mode) ? mode : 'off';
      try { localStorage.setItem(CVD_KEY, cvd); } catch (e) {}
      paintCvd();
      cvdSubs.forEach(fn => fn(cvd));
    },
  };
  function paintCvd() {
    if (cvd === 'off') document.documentElement.removeAttribute('data-cvd');
    else document.documentElement.setAttribute('data-cvd', cvd);
    const b = document.querySelector('.cvd-toggle');
    if (!b) return;
    const L = LABEL[lang] || LABEL.en;
    // The icon turns blue while a colour mode is on, so it's clear something is active.
    b.classList.toggle('is-on', cvd !== 'off');
    b.setAttribute('aria-label', I18N.t('Accessibility'));
    b.title = I18N.t('Accessibility');
    document.querySelectorAll('.cvd-menu [data-mode]').forEach(o => {
      const m = o.dataset.mode;
      o.setAttribute('aria-checked', String(m === cvd));
      o.innerHTML = `<i aria-hidden="true"></i>${L[m]}${SCI[m] ? `<small>${lang === 'es' ? SCI[m].replace('ia', 'ía') : SCI[m]}</small>` : ''}`;
    });
    document.querySelector('.cvd-menu-head').textContent = I18N.t('COLORBLIND MODE');
  }
  paintCvd();
  subs.push(paintCvd);

  // The switches themselves: bottom-left corner (see .site-prefs in os.css).
  // Pixel accessibility figure (13×13): head, outstretched arms, body, legs.
  const A11Y = '<svg viewBox="0 0 13 13" aria-hidden="true" shape-rendering="crispEdges" fill="currentColor">' +
    '<rect x="5" y="0" width="3" height="3"/><rect x="0" y="4" width="13" height="2"/><rect x="5" y="6" width="3" height="3"/>' +
    '<rect x="4" y="9" width="2" height="2"/><rect x="3" y="11" width="2" height="2"/><rect x="7" y="9" width="2" height="2"/><rect x="8" y="11" width="2" height="2"/></svg>';
  function mount() {
    // The correction filters, referenced from CSS as url(#cvd-protan) etc.
    const defs = document.createElement('div');
    defs.className = 'cvd-defs';
    defs.setAttribute('aria-hidden', 'true');
    defs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    defs.innerHTML = '<svg width="0" height="0"><defs>' + Object.entries(MATRIX).map(([k, m]) =>
      `<filter id="cvd-${k}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${m}"/></filter>`).join('') + '</defs></svg>';
    document.body.appendChild(defs);

    const wrap = document.createElement('div');
    wrap.className = 'site-prefs';
    wrap.innerHTML =
      '<div class="lang-toggle" role="group" aria-label="Language / Idioma">' +
        '<button type="button" data-lang="en" lang="en">EN</button><button type="button" data-lang="es" lang="es">ES</button></div>' +
      '<div class="cvd-wrap">' +
        `<button type="button" class="cvd-toggle" aria-expanded="false" aria-controls="cvd-menu">${A11Y}</button>` +
        '<div class="cvd-menu" id="cvd-menu" role="menu"><p class="cvd-menu-head"></p>' +
          MODES.map(m => `<button type="button" role="menuitemradio" data-mode="${m}"></button>`).join('') + '</div>' +
      '</div>';
    const btn = wrap.querySelector('.cvd-toggle'), menu = wrap.querySelector('.cvd-menu');
    // The panel slides up from behind the icon; pressing the icon again slides it back down.
    const isOpen = () => wrap.classList.contains('a11y-open');
    const showMenu = on => {
      wrap.classList.toggle('a11y-open', on);
      btn.setAttribute('aria-expanded', String(on));
      menu.querySelectorAll('button').forEach(o => { o.tabIndex = on ? 0 : -1; });
    };
    wrap.addEventListener('click', e => {
      const b = e.target.closest('[data-lang]');
      if (b) return I18N.set(b.dataset.lang);
      const o = e.target.closest('[data-mode]'); // not [data-cvd]: <html> carries that one
      if (o) return window.PREFS.setCvd(o.dataset.mode); // stays open; the icon closes it
      if (e.target.closest('.cvd-toggle')) showMenu(!isOpen());
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) { showMenu(false); btn.focus(); } });
    document.body.appendChild(wrap);
    showMenu(false);
    apply();
    paintCvd();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
