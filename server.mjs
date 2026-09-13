import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {handleAtelier} from './server/atelier.mjs';
import {handleContact} from './server/contact.mjs';
const root=resolve('dist');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.json':'application/json','.txt':'text/plain'};
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1');
  if(url.pathname==='/api/idea')return await handleAtelier(req,res);
  if(url.pathname==='/api/contact')return await handleContact(req,res);
  let file=resolve(root,'.'+decodeURIComponent(url.pathname));
  if(!file.startsWith(root+sep)&&file!==root)throw new Error('path');
  if((await stat(file)).isDirectory())file=resolve(file,'index.html');
  const data=await readFile(file);
  res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});res.end(data);
 }catch{let page;try{page=await readFile(resolve(root,'404.html'));}catch{page='Page introuvable';}res.writeHead(404,{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex'});res.end(page);}
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
