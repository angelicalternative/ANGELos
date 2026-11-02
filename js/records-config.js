// Angel Records (records.html): everything the game shows, in one place.
// This page is separate from the desktop: it has its own photos, its own songs list and
// its own saved progress. Nothing here touches the desktop, Photos or Angelo's Mix.
//
// Art and photos go in assets/angel-records/ (sizes in assets/angel-records/README.md).
// Anything missing shows as a labelled placeholder box, so content can come before art.
// Photos of the places are pixelated automatically on the page, so any normal photo works.

window.ANGEL_RECORDS = {
  // The shopkeeper. A shop can have its own: owner: { name, sprite } on that shop.
  // sprite: '' draws the pixel sun mascot.
  owner: { name: 'Angelo', sprite: '' },

  // Shops, in the order you visit them. `photo` is a picture of the place itself; it's what
  // you see through the shop window. Each crate gets a label.
  shops: [
    { id: 'singapore', name: 'Slow Boat', city: 'Singapore', country: 'Singapore',
      photo: 'assets/angel-records/places/singapore.jpg', bg: 'assets/angel-records/shop-singapore.png',
      crates: ['CITY POP', 'SOUL', 'NEW IN'],
      greeting: 'Welcome to Slow Boat. The aircon is the best thing in here. Then the records.',
      es: { city: 'Singapur', country: 'Singapur', crates: ['CITY POP', 'SOUL', 'NUEVOS'],
            greeting: 'Bienvenido a Slow Boat. El aire acondicionado es lo mejor de aquí. Después, los discos.' } },
    { id: 'bangkok', city: 'Bangkok', country: 'Thailand',
      photo: 'assets/angel-records/places/bangkok.jpg', bg: 'assets/angel-records/shop-bangkok.png',
      crates: ['LUK THUNG', 'FUNK', '50 BAHT'],
      greeting: 'Mind the cat. She is the manager.',
      es: { country: 'Tailandia', crates: ['LUK THUNG', 'FUNK', '50 BAHT'], greeting: 'Cuidado con la gata. Ella es la gerente.' } },
    { id: 'ubud', city: 'Ubud, Bali', country: 'Indonesia',
      photo: 'assets/angel-records/places/ubud.jpg', bg: 'assets/angel-records/shop-ubud.png',
      crates: ['GAMELAN', 'DREAM POP', 'DUSTY'],
      greeting: 'The monkeys took the jazz section. We are negotiating.',
      es: { crates: ['GAMELAN', 'DREAM POP', 'POLVOSOS'], greeting: 'Los monos se llevaron la sección de jazz. Estamos negociando.' } },
    { id: 'sydney', city: 'Sydney', country: 'Australia',
      photo: 'assets/angel-records/places/sydney.jpg', bg: 'assets/angel-records/shop-sydney.png',
      crates: ['INDIE', 'SURF', 'BARGAIN'],
      greeting: 'G’day. Everything in the bargain bin is a bargain. Legally.',
      es: { city: 'Sídney', crates: ['INDIE', 'SURF', 'OFERTAS'], greeting: 'Buenas. Todo lo de ofertas es una oferta. Legalmente.' } },
    { id: 'paris', city: 'Paris', country: 'France',
      photo: 'assets/angel-records/places/paris.jpg', bg: 'assets/angel-records/shop-paris.png',
      crates: ['CHANSON', 'ÉLECTRO', 'B-SIDES'],
      greeting: 'Bonjour. Please do not ask for Daft Punk. Look for it.',
      es: { city: 'París', country: 'Francia', crates: ['CHANSON', 'ÉLECTRO', 'CARAS B'], greeting: 'Bonjour. Por favor no pidas Daft Punk. Búscalo.' } },
    { id: 'el-retiro', city: 'El Retiro', country: 'Colombia', home: true,
      photo: 'assets/angel-records/places/el-retiro.jpg', bg: 'assets/angel-records/shop-el-retiro.png',
      crates: ['SALSA', 'BOLERO', 'DE LA CASA'],
      greeting: 'Home. The coffee is on, the rain is coming, and nobody is in a hurry.',
      es: { crates: ['SALSA', 'BOLERO', 'DE LA CASA'], greeting: 'En casa. El café está listo, ya viene la lluvia y nadie tiene afán.' } },
  ],

  // Special records hidden in the crates. Finding one plays it on the shop's turntable
  // (this page's own player). src = the song file; shop = only turns up in that shop.
  // sleeve = your own sleeve art, 64×64 (never the real album cover).
  records: [
    { id: 'pain', title: 'Pain', artist: 'PinkPantheress', src: 'assets/music/pinkpantheress-pain.mp3',
      shop: 'singapore', sleeve: 'assets/angel-records/sleeve-pain.png',
      blurb: 'Found under a sticker that said DO NOT.', es: { blurb: 'Estaba debajo de una etiqueta que decía NO.' } },
    { id: 'no-more-hiding', title: 'No More Hiding', artist: 'SZA', src: 'assets/music/sza-no-more-hiding.mp3',
      shop: 'singapore', sleeve: 'assets/angel-records/sleeve-no-more-hiding.png',
      blurb: 'Slightly warm. Probably from the sun.', es: { blurb: 'Un poco tibio. Seguro por el sol.' } },
    { id: 'maybe', title: 'Maybe', artist: 'KAROL G', src: 'assets/music/karol-g-maybe.mp3',
      shop: 'bangkok', sleeve: 'assets/angel-records/sleeve-maybe.png',
      blurb: 'The cat was sitting on it. She allowed it.', es: { blurb: 'La gata estaba sentada encima. Lo permitió.' } },
    { id: 'lovefield', title: 'Lovefield', artist: 'underscores', src: 'assets/music/underscores-lovefield.mp3',
      shop: 'ubud', sleeve: 'assets/angel-records/sleeve-lovefield.png',
      blurb: 'The monkeys missed this one.', es: { blurb: 'A los monos se les pasó este.' } },
    { id: 'id-rather-be-alone', title: 'I’d Rather Be Alone', artist: 'Tinashe', src: 'assets/music/tinashe-id-rather-be-alone.mp3',
      shop: 'sydney', sleeve: 'assets/angel-records/sleeve-id-rather-be-alone.png',
      blurb: 'Filed under “do not disturb.”', es: { blurb: 'Archivado en “no molestar”.' } },
    { id: 'fishtail', title: 'Fishtail', artist: 'Lana Del Rey', src: 'assets/music/lana-del-rey-fishtail.mp3',
      shop: 'paris', sleeve: 'assets/angel-records/sleeve-fishtail.png',
      blurb: 'Smells faintly of perfume and rain.', es: { blurb: 'Huele un poquito a perfume y a lluvia.' } },
    { id: 'did-i-tell-u', title: 'did i tell u that i miss u', artist: 'adore', src: 'assets/music/adore-did-i-tell-u-that-i-miss-u.mp3',
      shop: 'el-retiro', sleeve: 'assets/angel-records/sleeve-did-i-tell-u.png',
      blurb: 'Someone left a note inside. It just says “hi.”', es: { blurb: 'Alguien dejó una nota adentro. Solo dice “hola”.' } },
    { id: 'sun-bleached-flies', title: 'Sun Bleached Flies', artist: 'Ethel Cain', src: 'assets/music/ethel-cain-sun-bleached-flies.mp3',
      shop: 'el-retiro', sleeve: 'assets/angel-records/sleeve-sun-bleached-flies.png',
      blurb: 'Sun-faded. On purpose, probably.', es: { blurb: 'Desteñido por el sol. A propósito, creo.' } },
  ],

  // Sleeves per crate and special records per round (a round is about 1–3 minutes).
  perCrate: 9,
  perRound: 2,

  // What the shopkeeper says. Each line is picked at random.
  lines: {
    enter: ['Take your time. The records aren’t going anywhere.', 'Three crates. One of them is lying to you.'],
    warm: ['Something good is in this crate. I can feel it in my petals.', 'Ooh. This crate has a vibe.'],
    cold: ['Mostly polka in this one. Brave of you.', 'This crate is… a crate.'],
    filler: ['A classic. Of something.', 'Nah, that one’s been here since 1987.', 'Two for one, if you’re feeling generous.', 'Cover’s nice. The record is a coaster.', 'Someone wrote “mine” on it. In pen.'],
    again: ['You already have this one. Good taste is consistent.'],
    done: ['That’s everything worth finding today. Come back tomorrow, the crates refill.'],
    es: {
      enter: ['Con calma. Los discos no se van a ir.', 'Tres cajas. Una te está mintiendo.'],
      warm: ['Hay algo bueno en esta caja. Lo siento en los pétalos.', 'Uy. Esta caja tiene algo.'],
      cold: ['Casi todo polka en esta. Qué valiente.', 'Esta caja es… una caja.'],
      filler: ['Un clásico. De algo.', 'Nah, ese está aquí desde 1987.', 'Dos por uno, si estás generoso.', 'La portada es linda. El disco es un portavasos.', 'Alguien le escribió “mío”. Con esfero.'],
      again: ['Ya tienes este. El buen gusto es constante.'],
      done: ['Eso es todo lo que vale la pena hoy. Vuelve mañana, las cajas se llenan.'],
    },
  },

  // The CD-ROM loading screen: encyclopedia-style photos of the PLACES, each with an overly
  // literal caption. `photo` = a picture of that place (put the file in
  // assets/angel-records/places/). `shows` says what the photo should be of, so it's easy
  // to find the right one; it also labels the placeholder until the file is there.
  // Words in [brackets] show as blue encyclopedia links.
  intro: {
    captions: [
      { photo: 'assets/angel-records/places/singapore-merlion.jpg', shows: 'The Merlion, Singapore',
        text: 'The [Merlion], producing water for reasons that remain unclear.',
        es: { text: 'El [Merlión], echando agua por razones que siguen sin estar claras.' } },
      { photo: 'assets/angel-records/places/singapore-hawker.jpg', shows: 'A hawker centre, Singapore',
        text: 'A [hawker centre]. Several people are eating at the same time.',
        es: { text: 'Un [hawker centre]. Varias personas están comiendo al mismo tiempo.' } },
      { photo: 'assets/angel-records/places/bangkok-tuktuk.jpg', shows: 'A tuk-tuk in Bangkok',
        text: 'A [tuk-tuk] waiting patiently in [traffic].',
        es: { text: 'Un [tuk-tuk] esperando con paciencia en el [tráfico].' } },
      { photo: 'assets/angel-records/places/bangkok-temple.jpg', shows: 'A temple roof in Bangkok',
        text: 'A [temple] roof. It is pointier than most roofs.',
        es: { text: 'El techo de un [templo]. Es más puntiagudo que la mayoría de los techos.' } },
      { photo: 'assets/angel-records/places/ubud-rice.jpg', shows: 'Rice terraces near Ubud, Bali',
        text: '[Rice terraces], arranged in an orderly fashion.',
        es: { text: '[Terrazas de arroz], organizadas de manera ordenada.' } },
      { photo: 'assets/angel-records/places/ubud-monkey.jpg', shows: 'A monkey in the Ubud Monkey Forest',
        text: 'A [monkey] considering your belongings.',
        es: { text: 'Un [mono] considerando tus pertenencias.' } },
      { photo: 'assets/angel-records/places/sydney-opera.jpg', shows: 'The Sydney Opera House',
        text: 'The [Sydney Opera House], shaped like several [sails] or plates.',
        es: { text: 'La [Ópera de Sídney], con forma de varias [velas] o platos.' } },
      { photo: 'assets/angel-records/places/sydney-harbour.jpg', shows: 'Sydney Harbour Bridge',
        text: 'A [bridge] connecting one side to the other side.',
        es: { text: 'Un [puente] que conecta un lado con el otro lado.' } },
      { photo: 'assets/angel-records/places/paris-eiffel.jpg', shows: 'The Eiffel Tower, Paris',
        text: 'The [Eiffel Tower], a tower.',
        es: { text: 'La [Torre Eiffel], una torre.' } },
      { photo: 'assets/angel-records/places/paris-cafe.jpg', shows: 'A café terrace in Paris',
        text: 'Two [chairs] facing the street instead of each other.',
        es: { text: 'Dos [sillas] mirando hacia la calle en vez de mirarse entre sí.' } },
      { photo: 'assets/angel-records/places/el-retiro-plaza.jpg', shows: 'The main square of El Retiro, Colombia',
        text: 'A [town square] with a [church] in it, as is customary.',
        es: { text: 'Una [plaza] con una [iglesia], como es costumbre.' } },
      { photo: 'assets/angel-records/places/el-retiro-mountains.jpg', shows: 'Green mountains around El Retiro',
        text: '[Mountains], green, in more or less the usual place.',
        es: { text: '[Montañas], verdes, más o menos en el lugar de siempre.' } },
    ],
  },
};
