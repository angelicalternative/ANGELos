// ─────────────────────────────────────────────────────────────
//  SITE SETTINGS — edit this file to change content.
//  Files referenced here live in /assets (see assets/README.md).
// ─────────────────────────────────────────────────────────────
window.SITE = {
  email: 'angelicalternative@gmail.com',

  substackUrl: 'https://angelicalternative.substack.com/',
  location: 'Miami Beach, FL',
  role: 'Art Director & Graphic Designer',
  studio: 'Founder, Angelo Studio',

  instagramUrl: 'https://www.instagram.com/angelic_alternative/',

  // Music player, in play order. Each song is either:
  //   a file:       { title, artist, src: 'assets/music/song.mp3', cover: 'assets/covers/song.jpg' }
  //   SoundCloud:   { soundcloud: 'https://soundcloud.com/artist/song' }  (title/artist/cover fill in automatically)
  //
  // `disc` is the little pixel CD shown while the song plays — colours taken from
  // each song's album cover. `bg` tints the box behind it.
  tracks: [
    // Bright and quick → peak energy → slow down → the long goodbye.
    { title: 'Pain', artist: 'PinkPantheress', src: 'assets/music/pinkpantheress-pain.mp3',
      lcd: { fill: '#B9A2EE', gloss: '#D6C8F7', dark: '#3A2470', track: '#A890E6', off: '#9479DA', on: '#3A2470', ink: '#1E0F3A' },
      disc: { rim: '#1E0F3A', face: '#6B3FA8', ring: '#4E2C85', hub: '#E8E2C8', shine: '#C9B6F2', bg: '#E6DCF7' } },   // purple haunted-house night
    { title: 'Lovefield', artist: 'underscores', src: 'assets/music/underscores-lovefield.mp3',
      lcd: { fill: '#EDEDE8', gloss: '#FFFFFF', dark: '#1E1E1E', track: '#DCDCD4', off: '#C4C4BB', on: '#1E1E1E', ink: '#1E1E1E' },
      disc: { rim: '#1E1E1E', face: '#F2F2EE', ring: '#CFCFC8', hub: '#4E78B8', shine: '#FFFFFF', bg: '#F4F4EE' } },   // ink sketch, blue hat
    { title: 'Maybe', artist: 'KAROL G', src: 'assets/music/karol-g-maybe.mp3',
      lcd: { fill: '#C9D2F0', gloss: '#E4E9FA', dark: '#1A1F3D', track: '#B7C2EA', off: '#A2AFE0', on: '#1A1F3D', ink: '#1A1F3D' },
      disc: { rim: '#1A1F3D', face: '#C9D2F0', ring: '#A9C6E8', hub: '#307090', shine: '#FFFFFF', bg: '#E4E9FA' } },   // powder blue
    { title: 'I’d Rather Be Alone', artist: 'Tinashe', src: 'assets/music/tinashe-id-rather-be-alone.mp3',
      lcd: { fill: '#2A2226', gloss: '#3A2F34', dark: '#0F0B0D', sub: '#C9A090', track: '#352B30', off: '#4C3E44', on: '#F0B090', ink: '#F6DCCB' },
      disc: { rim: '#0F0B0D', face: '#2A2226', ring: '#3D3236', hub: '#F0B090', shine: '#E7C9D6', bg: '#E9DDE2' } },   // Popstar: night-black, peach, blush
    { title: 'did i tell u that i miss u', artist: 'adore', src: 'assets/music/adore-did-i-tell-u-that-i-miss-u.mp3',
      lcd: { fill: '#F7C4D2', gloss: '#FDE6EE', dark: '#8E4A5E', track: '#F0B0C2', off: '#E69CB1', on: '#8E4A5E', ink: '#5A2233' },
      disc: { rim: '#C77F95', face: '#F7C4D2', ring: '#F2A9BE', hub: '#90B0D0', shine: '#FFFFFF', stickers: '#E8506E', bg: '#FDE6EE' } }, // stickered pink CD
    { title: 'No More Hiding', artist: 'SZA', src: 'assets/music/sza-no-more-hiding.mp3',
      lcd: { fill: '#A8CB93', gloss: '#C8E0B9', dark: '#10302A', track: '#96BD80', off: '#83AD6D', on: '#10302A', ink: '#10302A' },
      disc: { rim: '#10302A', face: '#2F5A34', ring: '#46703A', hub: '#E0A030', shine: '#9FC48A', bg: '#D6E6CC' } },   // night grass, gold
    { title: 'Fishtail', artist: 'Lana Del Rey', src: 'assets/music/lana-del-rey-fishtail.mp3',
      lcd: { fill: '#C4C4CA', gloss: '#DEDEE2', dark: '#3E3E48', track: '#B3B3BA', off: '#A0A0A9', on: '#3E3E48', ink: '#2A2A33' },
      disc: { rim: '#3E3E48', face: '#8A8A93', ring: '#A9A9B0', hub: '#D9D2C3', shine: '#E8E8E8', bg: '#E6E3DC' } },   // vintage grey photo
    { title: 'Sun Bleached Flies', artist: 'Ethel Cain', src: 'assets/music/ethel-cain-sun-bleached-flies.mp3',
      lcd: { fill: '#FFD21F', gloss: '#FFE97A', dark: '#5A3210', track: '#F2C200', off: '#DEAF00', on: '#5A3210', ink: '#3B1F08' },
      disc: { type: 'sunflower', bg: '#FFF1B3' } },
  ],

  // Photo gallery, in order. Put images in assets/photos.
  photos: [
    { src: 'assets/photos/australia.png', caption: 'Australia' },
    { src: 'assets/photos/face-a.png', caption: 'FACE A' },
    { src: 'assets/photos/sunset.png', caption: 'Sunset', es: { caption: 'Atardecer' } },
  ],

  // Junk folder: creative odds and ends, just for fun. Put files in assets/junk.
  // Images/GIFs open full size, .mp4/.webm/.mov play, .txt/.md open as notes.
  junk: [
    { src: 'assets/junk/skatepark.png', name: 'skatepark.png' },
    { src: 'assets/junk/vision-demo.mp3', name: 'VISION.als', note: 'Ableton project · playing the demo bounce', es: { note: 'Proyecto de Ableton · sonando el demo' } },
    { src: 'assets/junk/emi.m4a', name: 'EMI.aif' },
    { src: 'assets/junk/monkey.png', name: 'monkey.png' },
    { src: 'assets/junk/taronga-zoo.png', name: 'taronga_zoo.png' },
    { src: 'assets/junk/vinyl.png', name: 'vinyl.png' },
  ],

  // Globe tracker: every country you've been to (these count toward the 195).
  // Use a plain name, or { name, places: [...] } to list cities/states under it.
  // territory: true adds a small “(territory)” note under the name.
  countries: [
    // Americas
    'Argentina', { name: 'Aruba', territory: true }, 'Bahamas', 'Barbados',
    { name: 'Brazil', places: ['Rio de Janeiro', 'São Paulo'] },
    { name: 'Cayman Islands', territory: true }, 'Chile', 'Colombia', 'Dominican Republic', 'Ecuador', 'Jamaica', 'Mexico', 'Panama', 'Paraguay', 'Peru', { name: 'Turks and Caicos Islands', territory: true },
    { name: 'United States', places: ['Alaska', 'Arizona', 'California', 'Colorado', 'Florida', 'Georgia', 'Hawaii', 'Maine',
      'Massachusetts', 'Nevada', 'New Jersey', 'New York', 'North Carolina', 'Pennsylvania', 'South Carolina', 'Tennessee',
      'Texas', 'Virginia', 'Washington', 'West Virginia', 'Wyoming'] },
    'Uruguay',
    // Asia
    { name: 'Hong Kong', territory: true }, 'Indonesia', 'Israel', 'Japan', 'Palestine', 'Turkey',
    // Europe
    'Albania', 'Austria', 'Bosnia and Herzegovina', 'Croatia', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Hungary',
    'Iceland', 'Italy', 'Monaco', 'Montenegro', 'Netherlands', 'Norway', 'Portugal', 'Serbia', 'Spain', 'Sweden',
    { name: 'United Kingdom', places: ['England'] },
    // Oceania
    { name: 'Australia', places: ['New South Wales'] },
    'New Zealand',
  ],

  // Places that belong to another country — listed, but not counted toward the 195.
  // (Aruba, Cayman Islands, Turks and Caicos and Hong Kong are counted as countries above.)
  territories: [],

  // My Work (work.html), oldest first (oldest = innermost band).
  // Put each project's files in assets/work/<id>/ and list them here:
  //   favicon — optional tab icon (.svg) shown while the project is open
  //   cover + edition — show the cover with a “See full edition” button that opens the PDF
  //   pdf     — or: a PDF shown in the in-page flip viewer ('' = placeholder)
  //   images  — [{ src, caption }] behind-the-scenes gallery ([] = placeholders)
  //   promo   — [{ src, caption, focus }] Instagram & promo posts, shown as a 4:5 grid ([] = placeholders);
  //             `focus` picks which part shows in the grid tile, e.g. '88% 50%' = right side
  //   video   — optional .mp4 for a recap
  //   credits — [[role, name], ...]     links — [{ label, url }]
  projects: [
    { id: 'pedro', title: 'Pedro Contra Pedro', date: 'MAR 2026', color: '#0c07a7', ink: '#ffffff',
      tag: 'EDICIÓN INAUGURAL · ANGELO BY ANGELO STUDIO', role: 'Founder · Creative director · Designer', format: 'Free print magazine · 20 pages',
      summary: 'The inaugural edition of Angelo by Angelo Studio, the independent Spanish-language magazine I founded. Cover star Pedro Restrepo Botero, the face of the Libertad Guarceña party, sits down with Guadalupe Campuzano and me in a neon-lit back room as organisers prepare the CMJ youth council election, and we try to find the person behind the campaign.',
      favicon: 'assets/icons/folder.svg',
      cover: 'assets/work/pedro/cover.jpg', edition: 'assets/work/pedro/pedro-contra-pedro-full-edition.pdf',
      es: {
        role: 'Fundador · Director creativo · Diseñador', format: 'Revista impresa gratuita · 20 páginas',
        summary: 'La edición inaugural de Angelo by Angelo Studio, la revista independiente en español que fundé. El protagonista de portada, Pedro Restrepo Botero, la cara del partido Libertad Guarceña, se sienta con Guadalupe Campuzano y conmigo en un cuarto con luz de neón mientras los organizadores preparan la elección del CMJ, y tratamos de encontrar a la persona detrás de la campaña.',
        credits: ['Dirección creativa, arte y diseño', 'Producción literaria', 'Modelo de portada', 'Producción editorial', 'Fotografía', 'Iluminación', 'Ilustración y maquillaje', 'Asistencia visual'],
      },
      credits: [
        ['Creative direction, art & design', 'Angelo Gibbs'],
        ['Literary production', 'Angelo Gibbs & Guadalupe Campuzano'],
        ['Cover star', 'Pedro Restrepo Botero'],
        ['Editorial production', 'Guadalupe Campuzano'],
        ['Photography', 'Libni Ospina'],
        ['Lighting', 'Jhohan González'],
        ['Illustration & makeup', 'Sara Zuluaga Posada'],
        ['Visual assistance', 'Gaia Gibbs'],
      ],
      pdf: '', images: [
        { src: 'assets/work/pedro/pedro-01.jpg' },
        { src: 'assets/work/pedro/pedro-02.jpg' },
        { src: 'assets/work/pedro/pedro-03.jpg' },
        { src: 'assets/work/pedro/pedro-04.jpg' },
        { src: 'assets/work/pedro/pedro-05.jpg' },
        { src: 'assets/work/pedro/pedro-06.jpg' },
        { src: 'assets/work/pedro/pedro-07.jpg' },
        { src: 'assets/work/pedro/pedro-08.jpg' },
      ], promoRatio: 'auto', promoCols: 4, promo: [
        { src: 'assets/work/pedro/promo-01.jpg', caption: 'Story teaser' },
        { src: 'assets/work/pedro/promo-02.jpg', caption: 'Story teaser' },
        { src: 'assets/work/pedro/promo-03.jpg', caption: 'Edición inaugural' },
        { src: 'assets/work/pedro/promo-04.jpg', caption: 'Copias físicas: Casa del Ángel, 18 Almas, Jark' },
      ], video: '', links: [] },
    { id: 'dama', title: 'Dama De La Primavera', date: 'MAY 2026', color: '#ecbf65', ink: '#2a1e0c', // masthead gold, a touch more saturated (still pastel)
      tag: '2ND EDITION · ANGELO BY ANGELO STUDIO', role: 'Editor-in-chief · Art director', format: 'Free print magazine · 24 pages',
      summary: 'The second edition of Angelo by Angelo Studio, and the debut of our “Damas de las Temporadas” series. Spring has always been at the heart of Antioquia, “the land of eternal spring,” and this issue follows it through cover star Guadalupe Campuzano Toro, alongside stories on the region’s new subcultures and the lie of looksmaxxing.',
      es: {
        tag: 'SEGUNDA EDICIÓN · ANGELO BY ANGELO STUDIO', role: 'Editor en jefe · Director de arte', format: 'Revista impresa gratuita · 24 páginas',
        summary: 'La segunda edición de Angelo by Angelo Studio y el debut de nuestra serie “Damas de las Temporadas”. La primavera siempre ha estado en el corazón de Antioquia, “la tierra de la eterna primavera”, y esta edición la sigue a través de la protagonista de portada, Guadalupe Campuzano Toro, junto a historias sobre las nuevas subculturas de la región y la mentira del looksmaxxing.',
        credits: ['Editor en jefe y dirección artística', 'Portada', 'Producción editorial y contenido literario', 'Director audiovisual', 'Fotografía', 'Maquillaje y utilería', 'Ilustración', 'Director de audio', 'Composición'],
      },
      credits: [
        ['Editor-in-chief & art direction', 'Angelo Gibbs'],
        ['Cover', 'Guadalupe Campuzano Toro'],
        ['Editorial production & literary content', 'Guadalupe Campuzano Toro'],
        ['Audiovisual director', 'Jhohan González'],
        ['Photography', 'Libni Ospina'],
        ['Makeup & props', 'Gaia Gibbs Villegas'],
        ['Illustration', 'Jerónimo Montoya Arango'],
        ['Audio director', 'Martin Botero Alvarez'],
        ['Composition', 'Juan Sebastian Bravo Ramirez'],
      ],
      favicon: 'assets/icons/umbrella.svg',                              // tab icon while this project is open
      cover: 'assets/work/dama/cover.jpg',                               // shown on the page
      edition: 'assets/work/dama/dama-de-la-primavera-full-edition.pdf', // opens from “See full edition”
      pdf: '',
      images: [
        { src: 'assets/work/dama/dama-01.jpg', caption: '' },
        { src: 'assets/work/dama/dama-02.jpg', caption: '' },
        { src: 'assets/work/dama/dama-03.jpg', caption: 'Guadalupe Campuzano with her Doberman, Athos', es: { caption: 'Guadalupe Campuzano con su dóberman, Athos' } },
        { src: 'assets/work/dama/dama-04.jpg', caption: '' },
        { src: 'assets/work/dama/dama-05.jpg', caption: '' },
        { src: 'assets/work/dama/dama-06.jpg', caption: '' },
        { src: 'assets/work/dama/dama-07.jpg', caption: '' },
        { src: 'assets/work/dama/dama-08.jpg', caption: '' },
        { src: 'assets/work/dama/dama-09.jpg', caption: '' },
        { src: 'assets/work/dama/dama-10.jpg', caption: '' },
        { src: 'assets/work/dama/dama-11.jpg', caption: '' },
      ],
      promo: [
        { src: 'assets/work/dama/promo-01.jpg', caption: '', focus: '100% 50%' }, // right edge, so the whole logo shows in the grid
        { src: 'assets/work/dama/promo-02.jpg', caption: '' },
      ], video: '', links: [] },
    { id: 'face-a', title: 'FACE A: Record Night', date: 'JUL 2026', color: '#ff8de2', ink: '#000000',
      tag: 'LIVE EVENT · NOCHE DE VINILO', role: 'Creator · Co-chair · Co-director', format: 'Vinyl-culture live event', kind: 'event',
      favicon: 'assets/icons/face-a-mascot.png',
      cover: 'assets/work/face-a/poster.jpg',
      summary: 'A vinyl-culture live event I conceived and co-chaired with Samantha Zuluaga Cuartas for Angelo by Angelo Studio, overseeing production, sponsorships and on-site direction, with Casa del Ángel as main sponsor. The marketing ran on a code game: whoever cracked the code won a free ticket.',
      es: {
        tag: 'EVENTO EN VIVO · NOCHE DE VINILO', role: 'Creador · Codirector general', format: 'Evento en vivo de cultura vinilo',
        summary: 'Un evento en vivo de cultura vinilo que ideé y codirigí con Samantha Zuluaga Cuartas para Angelo by Angelo Studio, a cargo de la producción, los patrocinios y la dirección en el lugar, con Casa del Ángel como patrocinador principal. El marketing fue un juego de códigos: quien descifrara el código ganaba una entrada gratis.',
        credits: ['Creador y codirector general', 'Codirectora general y jefa de logística', 'Vendedor principal', 'Promo / audiovisual', 'Equipo de sonido', 'Coordinadora de producción', 'Seguridad / control de entrada', 'Asistentes de operaciones', 'Patrocinio principal'],
      },
      credits: [
        ['Creator, co-chair & co-director', 'Angelo Gibbs'],
        ['Co-chair, co-director & head of logistics', 'Samantha Zuluaga Cuartas'],
        ['Lead sales', 'Simón Pulgarín'],
        ['Promo & audiovisual', 'Jhohan González & Libni Ospina'],
        ['Sound', 'Juan Sebastián Bravo & Martín Botero'],
        ['Production coordinator', 'Luciana Raigosa'],
        ['Security & door', 'Jose Orozco'],
        ['Operations assistants', 'Sara Zuluaga Posada & Guadalupe Campuzano Toro'],
        ['Main sponsor', 'Casa del Ángel'],
      ],
      pdf: '', images: [
        { src: 'assets/work/face-a/face-a-01.jpg' },
        { src: 'assets/work/face-a/face-a-02.jpg' },
        { src: 'assets/work/face-a/face-a-03.jpg' },
        { src: 'assets/work/face-a/face-a-04.jpg' },
        { src: 'assets/work/face-a/face-a-05.jpg' },
        { src: 'assets/work/face-a/face-a-06.jpg' },
        { src: 'assets/work/face-a/face-a-07.jpg' },
        { src: 'assets/work/face-a/face-a-08.jpg' },
        { src: 'assets/work/face-a/face-a-09.jpg' },
        { src: 'assets/work/face-a/face-a-10.jpg' },
        { src: 'assets/work/face-a/face-a-11.jpg' },
        { src: 'assets/work/face-a/face-a-12.jpg' },
      ], promoRatio: '1 / 1', promo: [
        { src: 'assets/work/face-a/promo-01.jpg', caption: 'Los discos favoritos del equipo Angelo Studio' },
        { src: 'assets/work/face-a/promo-03.jpg', caption: 'Angelo: Titanic Rising, Weyes Blood' },
        { src: 'assets/work/face-a/promo-02.jpg', caption: 'Jhohan: Sweet Boy, Malcom Todd' },
        { src: 'assets/work/face-a/promo-04.jpg', caption: 'Más discos favoritos del equipo Angelo Studio' },
        { src: 'assets/work/face-a/promo-05.jpg', caption: 'Guadalupe: Elephunk, Black Eyed Peas' },
        { src: 'assets/work/face-a/promo-06.jpg', caption: 'Sara: This Is What ___ Feels Like, JVKE' },
        { src: 'assets/work/face-a/promo-07.jpg', caption: 'Juan: Debí Tirar Más Fotos, Bad Bunny' },
        { src: 'assets/work/face-a/promo-08.jpg', caption: 'Gaia: Closer to Closure, Lexi Jayde' },
        { src: 'assets/work/face-a/promo-09.jpg', caption: 'Libni: 111xpantia, Fuerza Regida' },
      ], video: '', links: [] },
    { id: 'unbound', title: 'UNBOUND', date: 'OCT 2026', color: '#44d95f', ink: '#000000',
      // Locked until the issue is out: shows COMING SOON, hides the text and credits, and uses blurred
      // copies of the photos (locked/). To launch: set locked to false and point the paths back at the full-size images.
      locked: true,
      tag: 'EDITION 03 · ANGELO BY ANGELO STUDIO', role: 'Editor-in-chief · Art director', format: 'Print magazine',
      summary: 'The third edition of Angelo by Angelo Studio asks what it means to be unbound. Cover star Eider Enamorado, a skater who never touches the brakes, spends an afternoon at the skatepark falling and getting back up until the trick finally lands on the sixteenth try, and explains why, for him, freedom means choosing your own rules.',
      favicon: 'assets/icons/tv.svg',
      cover: 'assets/work/unbound/locked/cover.jpg', edition: '',
      es: {
        tag: 'TERCERA EDICIÓN · ANGELO BY ANGELO STUDIO', role: 'Editor en jefe · Director de arte', format: 'Revista impresa',
        summary: 'La tercera edición de Angelo by Angelo Studio se pregunta qué significa ser unbound. El protagonista de portada, Eider Enamorado, un skater que no conoce el freno, pasa una tarde en el skatepark cayéndose y levantándose hasta que el truco por fin sale en el intento dieciséis, y explica por qué, para él, la libertad es elegir tus propias reglas.',
        credits: ['Editor en jefe y dirección artística', 'Directora de contenido literario', 'Producción editorial', 'Director audiovisual y utilería', 'Fotografía', 'Maquillaje', 'Director de audio y composición', 'Modelo de portada'],
      },
      credits: [
        ['Editor-in-chief & art direction', 'Angelo Gibbs'],
        ['Literary content director', 'Guadalupe Campuzano Toro'],
        ['Editorial production', 'Samantha Zuluaga Cuartas'],
        ['Audiovisual director & props', 'Jhohan González'],
        ['Photography', 'Libni Ospina'],
        ['Makeup', 'Salomé Velásquez Sánchez & Sara Zuluaga Posada'],
        ['Audio director & composition', 'Martín Botero Álvarez'],
        ['Cover star', 'Eider Enamorado'],
      ],
      pdf: '', images: [
        { src: 'assets/work/unbound/locked/unbound-01.jpg' },
        { src: 'assets/work/unbound/locked/unbound-02.jpg' },
        { src: 'assets/work/unbound/locked/unbound-03.jpg' },
        { src: 'assets/work/unbound/locked/unbound-04.jpg' },
        { src: 'assets/work/unbound/locked/unbound-05.jpg' },
        { src: 'assets/work/unbound/locked/unbound-06.jpg' },
        { src: 'assets/work/unbound/locked/unbound-07.jpg' },
        { src: 'assets/work/unbound/locked/unbound-08.jpg' },
        { src: 'assets/work/unbound/locked/unbound-09.jpg' },
        { src: 'assets/work/unbound/locked/unbound-10.jpg' },
      ], promo: [], video: '', links: [] },
  ],
};
