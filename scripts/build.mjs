import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {pages} from '../src/content.mjs';
import {legalPages} from '../src/legal.mjs';
import {immersion} from '../src/immersion.mjs';
import {journalPages} from '../src/journal.mjs';
import {realisationPages} from '../src/realisations.mjs';
import {withSeo,sitemap,siteOrigin} from '../src/seo.mjs';
const base=await readFile('src/base.html','utf8');
await writeFile('dist/index.html',withSeo(base.replace(/<main id="main">[\s\S]*?<\/main>/,`<main id="main">${immersion}</main>`).replace('class="home"','class="home immersive-home on-entry"').replace('</head>','<noscript><style>.immersive-home.on-entry .site-header,.immersive-home.on-entry .mobile-nav{visibility:visible;pointer-events:auto}</style></noscript></head>'),'/'));
const publicPages={...pages,...journalPages,...realisationPages,...legalPages};
for(const [slug,page] of Object.entries(publicPages)){
 let html=base.replace(/<title>.*?<\/title>/,`<title>${page.title}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${page.description}">`).replace('class="home"','class="inner-page"').replace(/<main id="main">[\s\S]*?<\/main>/,`<main id="main">${page.content}</main>`);
 if(slug==='exemples')html=html.replace('class="header-back" hidden','class="header-back"');
 if(slug==='au-fil-d-ac')html=html.replace('</head>','<link rel="stylesheet" href="/journal.css"></head>');
 if(slug==='realisations')html=html.replace('class="inner-page"','class="inner-page realisations-page"').replace('</head>','<link rel="stylesheet" href="/realisations.css"></head>');
 await mkdir('dist/'+slug,{recursive:true});await writeFile('dist/'+slug+'/index.html',withSeo(html,'/'+slug+'/'));
}
const notFound=base.replace(/<title>.*?<\/title>/,'<title>Page introuvable — Arnaud Crestey</title>').replace('class="home"','class="inner-page"').replace(/<main id="main">[\s\S]*?<\/main>/,'<main id="main"><section class="page-intro section"><p class="eyebrow">404 / UN AUTRE CHEMIN</p><h1>Cette porte<br><em>n’existe pas.</em></h1><p>Retrouvez l’approche, les exemples et votre prochaine idée.</p><a href="/" class="button button-dark">Revenir à l’accueil ↗</a></section></main>');
await writeFile('dist/404.html',withSeo(notFound,'/404.html',{notFound:true}));
await writeFile('dist/sitemap.xml',sitemap(['/',...Object.keys(publicPages).map(slug=>'/'+slug+'/')]));
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`);
console.log('Built public site, metadata, sitemap and 404.');
