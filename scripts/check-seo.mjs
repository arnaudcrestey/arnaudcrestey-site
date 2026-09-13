import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pages} from '../src/content.mjs';
import {legalPages} from '../src/legal.mjs';
import {siteOrigin} from '../src/seo.mjs';
const paths=['/',...Object.keys({...pages,...legalPages}).map(slug=>'/'+slug+'/')];
const titles=new Set(),descriptions=new Set();
const sitemap=await readFile('dist/sitemap.xml','utf8');
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.deepEqual(urls,paths.map(path=>siteOrigin+path));
for(const path of paths){
 const html=await readFile('dist'+path+'index.html','utf8');
 const title=html.match(/<title>(.*?)<\/title>/)?.[1],description=html.match(/<meta name="description" content="([^"]*)"/)?.[1];
 assert.ok(title&&description);assert.ok(!titles.has(title));assert.ok(!descriptions.has(description));titles.add(title);descriptions.add(description);
 assert.equal([...html.matchAll(/rel="canonical"/g)].length,1);
 assert.ok(html.includes(`rel="canonical" href="${siteOrigin}${path}"`));
 assert.ok(html.includes(`property="og:url" content="${siteOrigin}${path}"`));
 const data=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert.equal(data['@context'],'https://schema.org');assert.ok(data['@graph'].some(item=>item.url===siteOrigin+path));
 assert.ok(!html.includes('noindex'));assert.equal((html.match(/<h1\b/g)||[]).length,1);
 if(path in Object.fromEntries(Object.keys(legalPages).map(key=>['/'+key+'/',true])))assert.ok(!/préversion|prévisualisation locale|avant publication|future mise en ligne|serveur local/.test(html));
}
const robots=await readFile('dist/robots.txt','utf8');assert.ok(robots.includes('Sitemap: '+siteOrigin+'/sitemap.xml'));
const notFound=await readFile('dist/404.html','utf8');assert.ok(notFound.includes('noindex,follow'));assert.ok(!notFound.includes('rel="canonical"'));
const config=JSON.parse(await readFile('vercel.json','utf8'));
assert.deepEqual(config.redirects,[{source:'/:path*',has:[{type:'host',value:'arnaudcrestey.com'}],destination:siteOrigin+'/:path*',permanent:true}]);
console.log('SEO : huit pages, titres uniques, canonical, métadonnées de partage, données structurées, sitemap et redirection cohérents. Pages légales sans texte de préversion.');
