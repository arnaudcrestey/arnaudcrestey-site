import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve('dist'); let count=0;const failures=[];
async function walk(dir){for(const item of await readdir(dir,{withFileTypes:true})){const path=join(dir,item.name);if(item.isDirectory())await walk(path);else if(item.name.endsWith('.html'))await check(path);}}
async function check(path){count++;const html=await readFile(path,'utf8');
 for(const requirement of ['lang="fr"','name="viewport"','name="robots" content="index,follow"','<main','/responsive.css'])if(!html.includes(requirement))failures.push(path+': missing '+requirement);
 if(/\bnoindex\b|\bnofollow\b/.test(html))failures.push(path+': preview indexing restriction');
 for(const m of html.matchAll(/(?:src|href)="(\/[^"]*)"/g)){const [url,hash]=m[1].split('#');if(!url&&!hash)continue;const clean=decodeURIComponent(url.split('?')[0]||'/');let dest=join(root,clean);try{if((await stat(dest)).isDirectory())dest=join(dest,'index.html');await stat(dest);if(hash&&dest.endsWith('.html')){const target=await readFile(dest,'utf8');if(!target.includes('id="'+hash+'"'))failures.push(m[1]+': missing anchor');}}catch{failures.push(path+': missing '+m[1]);}}
 for(const form of html.matchAll(/<form\b[\s\S]*?<\/form>/g))if(/type="submit"(?! disabled)/.test(form[0]))failures.push(path+': submit not disabled before JS');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);if(ids.length!==new Set(ids).size)failures.push(path+': duplicate id');
}
await walk(root);execFileSync(process.execPath,['--check','dist/app.js']);
const robots=await readFile(join(root,'robots.txt'),'utf8');
if(!/^Allow:\s*\/\s*$/m.test(robots)||/^Disallow:\s*\/\s*$/m.test(robots))failures.push('robots.txt blocks public indexing');
const css=await readFile('dist/styles.css','utf8');for(const m of css.matchAll(/url\('([^']+)'\)/g)){try{await stat(join(root,m[1]));}catch{failures.push('font missing '+m[1]);}}
const js=await readFile('dist/app.js','utf8');if(/\b(XMLHttpRequest|localStorage|sessionStorage)\b/.test(js))failures.push('Unexpected network or storage API');
const fetches=[...js.matchAll(/\bfetch\s*\(\s*([^,\n]+)/g)].map(m=>m[1]);if(fetches.length!==2||!fetches.includes("'/api/idea'")||!fetches.includes("'/api/contact'"))failures.push('Only the same-origin idea and contact endpoints are allowed');
if(/sk-[a-zA-Z0-9_-]{15,}|OPENAI_API_KEY|api\.openai\.com/.test(js))failures.push('Server-only API material found in browser script');
execFileSync(process.execPath,['--check','server/atelier.mjs']);
execFileSync(process.execPath,['--check','server/contact.mjs']);
if(/CONTACT_SMTP_PASSWORD|smtp\.hostinger\.com/.test(js))failures.push('Mail server material found in browser script');
const hosting=JSON.parse(await readFile('.openai/hosting.json','utf8'));if(hosting.project_id)failures.push('Unexpected registered hosting project');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}console.log(`${count} HTML routes checked; links, assets, JS, same-origin AI endpoint and no browser secrets/storage: OK.`);
