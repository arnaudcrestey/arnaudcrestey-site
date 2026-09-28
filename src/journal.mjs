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
  },
];

const publicationsParDate = [...publications].sort((a,b) => b.date.localeCompare(a.date));
const publication = item => `<article class="journal-entry" id="${item.id}" aria-labelledby="journal-title-${item.id}">
  <div class="journal-entry-date"><time datetime="${item.date}"><strong>${new Date(item.date+'T12:00:00Z').getUTCDate()}</strong><span>${new Intl.DateTimeFormat('fr-FR',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(item.date+'T12:00:00Z')).toLocaleUpperCase('fr-FR')}</span></time></div>
  <div class="journal-entry-body">
    <div class="journal-entry-top"><span>${item.category}</span></div>
    <h2 id="journal-title-${item.id}">${item.title}</h2>
    <p class="journal-lead">${item.introduction}</p>
    <figure class="journal-film"><video controls playsinline preload="metadata" poster="${item.poster}" aria-label="Vidéo de présentation du site vivant imaginé pour la boulangerie fictive Les Jours Levés"><source src="${item.media}" type="video/mp4">Votre navigateur ne peut pas lire cette vidéo.</video><figcaption>Les Jours Levés · boulangerie fictive · démonstration AC</figcaption></figure>
    <p class="journal-story">${item.body}</p>
    <div class="journal-entry-end"><span>Une idée parmi d’autres. La suite dépend toujours du métier, des personnes et du moment.</span><a href="/votre-idee/">Et pour votre activité ? <span aria-hidden="true">↗</span></a></div>
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
      <div class="journal-next"><span class="journal-next-mark" aria-hidden="true">✳</span><div><p>LA SUITE S’ÉCRIT ICI</p><h2>Le fil ne fait<br><em>que commencer.</em></h2><span>Il grandira avec les projets et les découvertes d’AC.</span></div></div>
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
