// DEADLINE (deadline.html): the editorial game. You're the new intern at Angelo Studio and the
// issue goes to print in 60 seconds. Everything the game shows is in this file.
// Each issue uses photos from that edition's real shoot; at the end your cover is shown next
// to the real one. Never put an unreleased issue here (UNBOUND stays out until it's out).

window.DEADLINE = {
  seconds: 60,

  // The editor-in-chief (the sun mascot).
  editor: { name: 'Angelo', title: 'Editor-in-chief', es: { title: 'Editor en jefe' } },

  issues: [
    {
      id: 'pedro', number: '01', edition: 'EDICIÓN INAUGURAL', date: 'MAR 2026',
      real: 'assets/work/pedro/cover.jpg',
      brief: 'Issue 01. Pedro Contra Pedro. A boxer who fights himself. I want it tense, close, a little bruised. The printer leaves in 60 seconds.',
      es: { brief: 'Edición 01. Pedro Contra Pedro. Un boxeador que pelea contra sí mismo. Lo quiero tenso, cerca, un poco golpeado. La imprenta sale en 60 segundos.' },
      // score: 3 = what Angelo picked, 2 = good call, 1 = fine, 0 = why
      photos: [
        { src: 'assets/work/pedro/pedro-07.jpg', score: 3, note: 'The glove, the green light, the profile. That’s the cover.', es: { note: 'El guante, la luz verde, el perfil. Esa es la portada.' } },
        { src: 'assets/work/pedro/pedro-01.jpg', score: 2, note: 'Strong. A little too happy to be fighting himself.', es: { note: 'Fuerte. Un poco demasiado feliz para estar peleando consigo mismo.' } },
        { src: 'assets/work/pedro/pedro-02.jpg', score: 1, note: 'He’s just… standing there. Menacingly?', es: { note: 'Solo está… ahí parado. ¿Amenazante?' } },
        { src: 'assets/work/pedro/pedro-06.jpg', score: 0, note: 'That’s a behind-the-scenes photo. Of makeup. And a cigarette.', es: { note: 'Esa es una foto del detrás de cámaras. Del maquillaje. Y un cigarrillo.' } },
      ],
      colors: [
        { hex: '#D7261E', score: 3, note: 'Boxing-glove red. Correct.', es: { note: 'Rojo guante de boxeo. Correcto.' } },
        { hex: '#F2F2F2', score: 2, note: 'White is clean. Maybe too clean for a fight.', es: { note: 'El blanco es limpio. Quizá demasiado para una pelea.' } },
        { hex: '#2E6BFF', score: 1, note: 'Blue on a blue photo. Bold. Wrong.', es: { note: 'Azul sobre una foto azul. Atrevido. Equivocado.' } },
        { hex: '#FF8DE2', score: 0, note: 'Pink is for the record night, not the boxing ring.', es: { note: 'El rosado es para la noche de vinilos, no para el ring.' } },
      ],
      lines: [
        { text: 'PEDRO CONTRA PEDRO', sub: 'PEDRO RESTREPO BOTERO', score: 3, note: 'The real title. You read the brief.', es: { note: 'El título real. Leíste el brief.' } },
        { text: 'PEDRO VS. PEDRO', sub: 'ROUND ONE', score: 2, note: 'Same idea, in English, for some reason.', es: { note: 'La misma idea, en inglés, por alguna razón.' } },
        { text: 'A BOXER, BRIEFLY', sub: 'AND OTHER STORIES', score: 1, note: 'Poetic. Not the issue.', es: { note: 'Poético. No es la edición.' } },
        { text: 'HE LOST', sub: 'TO HIMSELF', score: 0, note: 'You spoiled the ending on the cover.', es: { note: 'Contaste el final en la portada.' } },
      ],
    },
    {
      id: 'dama', number: '02', edition: '2ª ED · 2026', date: 'MAY 2026',
      real: 'assets/work/dama/cover.jpg',
      brief: 'Issue 02. Dama de la Primavera. Spring in Antioquia: sky, flowers, a girl who seems to float. Soft, but not boring. You have 60 seconds.',
      es: { brief: 'Edición 02. Dama de la Primavera. La primavera en Antioquia: cielo, flores, una chica que parece flotar. Suave, pero no aburrido. Tienes 60 segundos.' },
      photos: [
        { src: 'assets/work/dama/dama-08.jpg', score: 3, note: 'She’s floating in the sky. That’s literally the brief.', es: { note: 'Está flotando en el cielo. Eso es literalmente el brief.' } },
        { src: 'assets/work/dama/dama-02.jpg', score: 2, note: 'The balcony is lovely. Very “waiting for spring.”', es: { note: 'El balcón es precioso. Muy “esperando la primavera”.' } },
        { src: 'assets/work/dama/dama-03.jpg', score: 2, note: 'The dog is a star. The dog is not the cover star.', es: { note: 'El perro es una estrella. El perro no es la portada.' } },
        { src: 'assets/work/dama/dama-06.jpg', score: 0, note: 'A cover of socks. Bold. Socks.', es: { note: 'Una portada de medias. Atrevido. Medias.' } },
      ],
      colors: [
        { hex: '#E6B95E', score: 3, note: 'Soft gold, like spring sun. Perfect.', es: { note: 'Dorado suave, como el sol de primavera. Perfecto.' } },
        { hex: '#F6D9E4', score: 2, note: 'Blossom pink. Pretty, a bit sleepy.', es: { note: 'Rosado flor. Lindo, un poco dormido.' } },
        { hex: '#1803BB', score: 1, note: 'Very ANGELos. Very not spring.', es: { note: 'Muy ANGELos. Muy poco primavera.' } },
        { hex: '#111111', score: 0, note: 'Black? For spring? Who hurt you?', es: { note: '¿Negro? ¿Para la primavera? ¿Quién te hizo daño?' } },
      ],
      lines: [
        { text: 'DAMA DE LA PRIMAVERA', sub: 'GUADALUPE CAMPUZANO', score: 3, note: 'Exactly what we printed.', es: { note: 'Exactamente lo que imprimimos.' } },
        { text: 'LADY OF SPRING', sub: 'GUADALUPE CAMPUZANO', score: 2, note: 'Right idea, wrong language.', es: { note: 'La idea correcta, el idioma equivocado.' } },
        { text: 'IT’S SPRING', sub: 'AGAIN', score: 1, note: 'Technically true. It’s always spring here.', es: { note: 'Técnicamente cierto. Aquí siempre es primavera.' } },
        { text: 'GIRL, OUTSIDE', sub: 'NEAR A LADDER', score: 0, note: 'That’s a caption, not a cover line.', es: { note: 'Eso es un pie de foto, no un titular.' } },
      ],
    },
  ],

  // Grades by total score (0–100).
  grades: [
    { min: 90, title: 'YOU’RE THE ART DIRECTOR NOW', line: 'I’m taking the afternoon off. You’ve got it from here.',
      es: { title: 'AHORA TÚ ERES EL DIRECTOR DE ARTE', line: 'Me tomo la tarde libre. Desde aquí te encargas tú.' } },
    { min: 70, title: 'HIRED', line: 'Good instincts. Coffee’s on me. Not literally, we’re a free magazine.',
      es: { title: 'CONTRATADO', line: 'Buen instinto. El café lo invito yo. No literalmente, somos una revista gratis.' } },
    { min: 45, title: 'STILL AN INTERN', line: 'It went to print. That’s something. That’s… something.',
      es: { title: 'SIGUES DE PRACTICANTE', line: 'Salió a imprenta. Eso es algo. Eso es… algo.' } },
    { min: 0, title: 'PLEASE RETURN THE STAPLER', line: 'We’ll recycle these. All of them.',
      es: { title: 'POR FAVOR DEVUELVE LA GRAPADORA', line: 'Vamos a reciclar estas. Todas.' } },
  ],

  // Loading screen: encyclopedia-style photos from the shoots, with overly literal captions.
  intro: {
    captions: [
      { photo: 'assets/work/pedro/pedro-07.jpg', text: 'A [boxing glove], worn for editorial purposes.', es: { text: 'Un [guante de boxeo], usado con fines editoriales.' } },
      { photo: 'assets/work/pedro/pedro-03.jpg', text: 'A [gym], with at least one person lying down in it.', es: { text: 'Un [gimnasio], con al menos una persona acostada.' } },
      { photo: 'assets/work/dama/dama-01.jpg', text: 'A game of [croquet], played with no clear rules.', es: { text: 'Un partido de [croquet], jugado sin reglas claras.' } },
      { photo: 'assets/work/dama/dama-03.jpg', text: 'A [Doberman] guarding a [tower] that did not ask to be guarded.', es: { text: 'Un [dóberman] cuidando una [torre] que no pidió que la cuidaran.' } },
      { photo: 'assets/work/dama/dama-06.jpg', text: 'Two [socks], polka-dotted, outdoors.', es: { text: 'Dos [medias], de puntos, al aire libre.' } },
      { photo: 'assets/work/pedro/pedro-05.jpg', text: 'A [makeup artist] applying a bruise on purpose.', es: { text: 'Una [maquilladora] aplicando un moretón a propósito.' } },
      { photo: 'assets/work/dama/dama-04.jpg', text: 'A [piggyback ride], documented on [instant film].', es: { text: 'Un [caballito], documentado en [película instantánea].' } },
    ],
  },
};
