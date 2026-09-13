import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {pages} from '../src/content.mjs';
import {legalPages} from '../src/legal.mjs';
import {immersion} from '../src/immersion.mjs';
const base=await readFile('src/base.html','utf8');
await writeFile('dist/index.html',base.replace(/<main id="main">[\s\S]*?<\/main>/,`<main id="main">${immersion}</main>`).replace('class="home"','class="home immersive-home"'));
for(const [slug,page] of Object.entries({...pages,...legalPages})){
 let html=base.replace(/<title>.*?<\/title>/,`<title>${page.title}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${page.description}">`).replace('class="home"','class="inner-page"').replace(/<main id="main">[\s\S]*?<\/main>/,`<main id="main">${page.content}</main>`);
 await mkdir('dist/'+slug,{recursive:true});await writeFile('dist/'+slug+'/index.html',html);
}
const notFound=base.replace(/<title>.*?<\/title>/,'<title>Page introuvable — Arnaud Crestey</title>').replace('class="home"','class="inner-page"').replace(/<main id="main">[\s\S]*?<\/main>/,'<main id="main"><section class="page-intro section"><p class="eyebrow">404 / UN AUTRE CHEMIN</p><h1>Cette porte<br><em>n’existe pas.</em></h1><p>Retrouvez l’approche, les exemples et votre prochaine idée.</p><a href="/" class="button button-dark">Revenir à l’accueil ↗</a></section></main>');
await writeFile('dist/404.html',notFound);
console.log('Built home + '+Object.keys(pages).length+' routes + 404. Local preview only.');
