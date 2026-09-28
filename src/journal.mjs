const publications = [
  {
    id: 'les-jours-leves',
    date: '2026-09-28',
    category: 'CRÉATION · EXEMPLE FICTIF',
    title: 'Et si le site donnait une raison de revenir ?',
    introduction: 'Pour Les Jours Levés, une boulangerie entièrement imaginée, j’ai créé une courte démonstration de ce que peut être un site vivant.',
    body: 'On découvre son univers et ses créations, puis une idée simple invite les visiteurs à participer : choisir la prochaine brioche. Le site ne se contente plus de présenter une adresse. Il ouvre une histoire qui peut continuer en boutique.',
    media: '/assets/pub-page-boulangerie.mp4',
    poster: '/assets/les-jours-leves-apercu.png',
    caption: 'Les Jours Levés · boulangerie fictive · démonstration AC',
  },
  {
    id: 'la-gomme',
    date: '2026-09-17',
    category: 'ANIMATION · ARCHIVE AC',
    title: 'Et si l’on commençait par enlever le superflu ?',
    introduction: 'Une idée peut devenir plus forte quand on retire ce qui la brouille.',
    body: 'Cette courte animation parle de ce que j’essaie de faire chez AC : rendre un message plus clair, sans le compliquer.',
    media: '/assets/archive-la-gomme.m4v',
    poster: '/assets/archive-la-gomme.jpg',
    caption: 'La gomme · animation AC',
  },
  {
    id: 'le-de-anime',
    date: '2026-09-16',
    category: 'ANIMATION · ARCHIVE AC',
    title: 'Six faces, plusieurs façons d’entrer dans une idée.',
    introduction: 'Un dé tourne, le regard s’arrête, la curiosité fait le reste.',
    body: 'Un petit essai pour montrer qu’une présentation peut aussi inviter à explorer.',
    media: '/assets/archive-le-de-anime.mp4',
    poster: '/assets/archive-le-de-anime.jpg',
    caption: 'Le dé animé · exploration AC',
    format: 'square',
  },
  {
    id: 'le-jardin-des-saisons',
    date: '2026-08-22',
    category: 'MAQUETTE · EXEMPLE IMAGINÉ',
    title: 'Et si les visiteurs avaient leur mot à dire ?',
    introduction: 'Cette maquette imagine un restaurant qui fait évoluer sa carte avec les saisons et invite ses visiteurs à participer au choix d’une prochaine idée.',
    body: 'Une manière de leur donner envie de revenir voir la suite.',
    media: '/assets/archive-le-jardin-des-saisons.m4v',
    poster: '/assets/archive-le-jardin-des-saisons.jpg',
    caption: 'Le Jardin des Saisons · concept de restaurant imaginé',
  },
  {
    id: 'reserve-a-tif',
    date: '2026-08-20',
    category: 'IDÉE · EXEMPLE FICTIF',
    title: 'L’IA comprend les mots. Pas toujours le clin d’œil.',
    introduction: 'Un jeu de mots suffit parfois à rappeler qu’un outil ne remplace pas le contexte ni le regard humain.',
    body: 'Ici, l’humour devient le point de départ d’une idée de communication.',
    media: '/assets/archive-reserve-a-tif.m4v',
    poster: '/assets/archive-reserve-a-tif.jpg',
    caption: 'Réserve à Tif · concept fictif AC',
  },
  {
    id: 'ancrage',
    date: '2026-08-19',
    category: 'MAQUETTE · EXEMPLE IMAGINÉ',
    title: 'Une première rencontre avant le premier rendez-vous.',
    introduction: 'Pour ce studio de tatouage imaginé, la vidéo explore une présence en ligne qui donne à sentir un univers avant même de prendre contact.',
    body: '',
    media: '/assets/archive-ancrage.m4v',
    poster: '/assets/archive-ancrage.jpg',
    caption: 'ANCRAGE · concept de studio de tatouage imaginé',
  },
  {
    id: 'la-maison-des-lisieres',
    date: '2026-08-18',
    category: 'MAQUETTE · EXEMPLE IMAGINÉ',
    title: 'Une visite qui commence par une envie.',
    introduction: 'Cette maquette d’hébergement propose une autre entrée : partir de ce que le visiteur cherche à vivre, puis l’accompagner dans sa découverte du lieu.',
    body: '',
    media: '/assets/archive-la-maison-des-lisieres.m4v',
    poster: '/assets/archive-la-maison-des-lisieres.jpg',
    caption: 'La Maison des Lisières · concept d’hébergement imaginé',
  },
  {
    id: 'cote-et-flamme',
    date: '2026-08-17',
    category: 'MAQUETTE · EXEMPLE IMAGINÉ',
    title: 'Trois ambiances, une même envie de découvrir.',
    introduction: 'Pour ce restaurant imaginé, la vidéo montre comment présenter plusieurs facettes d’une adresse sans dérouler simplement une carte.',
    body: 'Une invitation à choisir l’expérience qui nous attire.',
    media: '/assets/archive-cote-et-flamme.m4v',
    poster: '/assets/archive-cote-et-flamme.jpg',
    caption: 'Côte & Flamme · concept de restaurant imaginé',
  },
  {
    id: 'faire-le-tri-avec-ia',
    date: '2026-08-16',
    category: 'RÉFLEXION · ARCHIVE AC',
    title: 'Plus d’outils ne veut pas toujours dire plus de temps.',
    introduction: 'Avant d’ajouter une nouvelle application, mieux vaut comprendre ce qui prend vraiment du temps.',
    body: 'Cette vidéo pose cette question avec un peu d’ironie.',
    media: '/assets/archive-faire-le-tri-avec-ia.m4v',
    poster: '/assets/archive-faire-le-tri-avec-ia.jpg',
    caption: 'Faire le tri avec l’IA · réflexion AC',
  },
  {
    id: 'assistant-ia-a-votre-mesure',
    date: '2026-08-12',
    category: 'CONCEPT · ARCHIVE AC',
    title: 'Un outil utile commence par votre façon de travailler.',
    introduction: 'Cette vidéo présente l’idée d’un assistant adapté à une activité précise, plutôt qu’une solution identique pour tout le monde.',
    body: 'C’est une piste de travail, pas la présentation d’un service déjà installé chez un client.',
    media: '/assets/archive-assistant-ia-a-votre-mesure.m4v',
    poster: '/assets/archive-assistant-ia-a-votre-mesure.jpg',
    caption: 'Un assistant IA à votre mesure · concept AC',
  },
];

const publicationsParDate = [...publications].sort((a,b) => b.date.localeCompare(a.date));
const publication = item => `<article class="journal-entry" id="${item.id}" aria-labelledby="journal-title-${item.id}">
  <div class="journal-entry-date"><time datetime="${item.date}"><strong>${new Date(item.date+'T12:00:00Z').getUTCDate()}</strong><span>${new Intl.DateTimeFormat('fr-FR',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(item.date+'T12:00:00Z')).toLocaleUpperCase('fr-FR')}</span></time></div>
  <div class="journal-entry-body">
    <div class="journal-entry-top"><span>${item.category}</span></div>
    <h2 id="journal-title-${item.id}">${item.title}</h2>
    <p class="journal-lead">${item.introduction}</p>
    <figure class="journal-film${item.format === 'square' ? ' journal-film--square' : ''}"><video controls playsinline preload="${item.id === 'les-jours-leves' ? 'metadata' : 'none'}" poster="${item.poster}" aria-label="${item.caption}"><source src="${item.media}" type="video/mp4">Votre navigateur ne peut pas lire cette vidéo.</video><figcaption>${item.caption}</figcaption></figure>
${item.body ? `<p class="journal-story">${item.body}</p>` : ''}
${item.id === 'les-jours-leves' ? '<div class="journal-entry-end"><span>Une idée parmi d’autres. La suite dépend toujours du métier, des personnes et du moment.</span><a href="/votre-idee/">Et pour votre activité ? <span aria-hidden="true">↗</span></a></div>' : ''}
  </div>
</article>`;

const journal = `<section class="journal-page" aria-labelledby="journal-title">
  <header class="journal-hero">
    <h1 class="journal-hero-a11y" id="journal-title">Le fil d’ACtus</h1>
    <video class="journal-hero-film" autoplay muted playsinline preload="metadata" poster="/assets/le-fil-d-actus-affiche.png" aria-hidden="true" tabindex="-1"><source src="/assets/le-fil-d-actus.mp4" type="video/mp4"></video>
    <a class="journal-hero-skip" href="#le-fil">Aller aux publications</a>
  </header>
  <div class="journal-feed" id="le-fil">
    <div class="journal-feed-heading"><span>LES PUBLICATIONS</span><span>${String(publications.length).padStart(2,'0')} PUBLICATION${publications.length>1?'S':''}</span></div>
    <div class="journal-timeline">${publicationsParDate.map(publication).join('')}
      <div class="journal-next"><span class="journal-next-mark" aria-hidden="true">✳</span><div><h2>Le fil ne fait<br><em>que commencer.</em></h2></div></div>
    </div>
  </div>
</section>`;

export const journalPages = {
  'au-fil-d-ac': {
    title: 'Le fil d’ACtus — Arnaud Crestey',
    description: 'Les créations et les idées d’Arnaud Crestey, au fil du temps. Découvrez la dernière démonstration de site vivant.',
    content: journal,
  },
};
