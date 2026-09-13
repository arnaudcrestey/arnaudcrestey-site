import nodemailer from 'nodemailer';
import {readFile,writeFile,rename} from 'node:fs/promises';
import {buildReceiptMail} from './receipt.mjs';

const privateDir=new URL('../../arnaudcrestey-local-private/',import.meta.url);
const ledgerFile=new URL('contact-usage.json',privateDir);
const mailbox='demande@arnaudcrestey.com';
const subjects=['Mon activité','Faire le point','Un point d’entrée','Un système complet','Faire vivre mon site'];
const completed=new Map();
let busy=false;
const recent=[];
export class ContactError extends Error{constructor(status,message){super(message);this.status=status;}}
export function validateContact(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new ContactError(400,'Les informations du formulaire ne sont pas lisibles.');
 const value={};
 for(const [key,max] of Object.entries({name:100,replyTo:150,subject:80,message:1800,website:200,requestId:36})){
  if(typeof raw[key]!=='string'||raw[key].length>max)throw new ContactError(400,'Une information est manquante ou trop longue.');
  value[key]=raw[key].trim();
 }
 const email=/^[^\s@<>;,]+@[^\s@<>;,]+\.[^\s@<>;,]+$/;
 const phone=/^[+\d\s().-]+$/;
 const digits=value.replyTo.replace(/\D/g,'').length;
 if(!value.name||!value.message||/[\r\n\x00-\x1f]/.test(value.name+value.replyTo)||!subjects.includes(value.subject)||!(/^[a-f0-9-]{36}$/i.test(value.requestId)))throw new ContactError(400,'Vérifiez votre nom, le sujet et votre message.');
 if(!email.test(value.replyTo)&&!(phone.test(value.replyTo)&&digits>=7&&digits<=15))throw new ContactError(400,'Indiquez une adresse e-mail ou un numéro de téléphone valide.');
 if(value.website)throw new ContactError(400,'Cette demande ne peut pas être envoyée.');
 return {...value,isEmail:email.test(value.replyTo)};
}
export function buildContactMail(value){
 return {from:{name:'Contact — Arnaud Crestey',address:mailbox},to:mailbox,
  ...(value.isEmail?{replyTo:{address:value.replyTo}}:{}),
  envelope:{from:mailbox,to:[mailbox]},
  messageId:`<${value.requestId}@arnaudcrestey.com>`,
  subject:`[Site AC] ${value.subject}`,
  text:`Nouvelle demande depuis le site Arnaud Crestey\n\nNom ou entreprise : ${value.name}\nCoordonnées : ${value.replyTo}\nSujet : ${value.subject}\n\nMessage :\n${value.message}\n`,
  disableFileAccess:true,disableUrlAccess:true};
}
async function transport(password){
 let pass=password;
 if(password===undefined)try{const text=await readFile(new URL('contact.env',privateDir),'utf8');pass=text.split(/\r?\n/).find(l=>l.startsWith('CONTACT_SMTP_PASSWORD='))?.slice('CONTACT_SMTP_PASSWORD='.length);}catch{}
 if(!pass?.trim())throw new ContactError(503,'L’envoi n’est pas encore disponible. Vous pouvez nous écrire directement par e-mail.');
 return nodemailer.createTransport({host:'smtp.hostinger.com',port:465,secure:true,
  auth:{user:mailbox,pass:pass.trim()},tls:{minVersion:'TLSv1.2',rejectUnauthorized:true},
  name:'arnaudcrestey.com',connectionTimeout:12000,greetingTimeout:10000,socketTimeout:20000,
  disableFileAccess:true,disableUrlAccess:true,maxRecipients:1,logger:false,debug:false});
}
async function reserveAttempt(){
 const day=new Date().toISOString().slice(0,10);let ledger={day,attempts:0};
 try{const stored=JSON.parse(await readFile(ledgerFile,'utf8'));if(!Number.isInteger(stored.attempts)||stored.attempts<0||typeof stored.day!=='string')throw Error();if(stored.day===day)ledger=stored;}catch(e){if(e.code!=='ENOENT')throw new ContactError(503,'L’envoi est momentanément indisponible.');}
 if(ledger.attempts>=20)throw new ContactError(429,'La limite d’envoi de cette préversion est atteinte. Écrivez-nous directement par e-mail.');
 ledger.attempts++;const temp=new URL('contact-usage.json.tmp',privateDir);
 await writeFile(temp,JSON.stringify(ledger),{mode:0o600});await rename(temp,ledgerFile);
}
export async function sendContact(raw,production=null){
 const value=validateContact(raw),now=Date.now();
 for(const [id,entry] of completed)if(entry.time<now-86400000)completed.delete(id);
 if(!production&&completed.has(value.requestId)){const previous=completed.get(value.requestId);if(previous.error)throw new ContactError(502,previous.error);return {sent:true,receiptSent:previous.receiptSent};}
 if(busy)throw new ContactError(429,'Un envoi est déjà en cours. Patientez un instant.');
 while(recent.length&&recent[0]<now-60000)recent.shift();
 if(recent.length>=3)throw new ContactError(429,'Patientez une minute avant une nouvelle demande.');
 busy=true;let mailer;
 try{
  mailer=await transport(production?.password);if(production)await production.reserve();else await reserveAttempt();recent.push(now);
  try{
   const result=await mailer.sendMail(buildContactMail(value));
   if(!result.accepted?.includes(mailbox))throw Error();
  }catch{
   const error='L’envoi n’a pas pu être confirmé. Évitez de renvoyer immédiatement ; vous pouvez nous joindre directement par e-mail.';
   completed.set(value.requestId,{time:now,error});throw new ContactError(502,error);
  }
  // The original is already accepted: a receipt failure must never trigger resending it.
  let receiptSent=false;
  completed.set(value.requestId,{time:now,receiptSent});
  if(production)await production.accepted();
  if(value.isEmail){
   try{
    const logo=await readFile(new URL('../dist/assets/signature-ac.png',import.meta.url));
    const receipt=buildReceiptMail(value,logo);
    const result=await mailer.sendMail(receipt);
    receiptSent=result.accepted?.some(address=>address.toLowerCase()===value.replyTo.toLowerCase())===true;
   }catch{ /* No content logging and no automatic retry of an uncertain delivery. */ }
  }
  completed.set(value.requestId,{time:now,receiptSent});return {sent:true,receiptSent};
 }finally{mailer?.close();busy=false;}
}
export async function handleContact(req,res){
 const json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
 try{
  if(req.method!=='POST')return json(405,{error:'Méthode non autorisée.'});
  // Local-only: do not loosen this before production anti-abuse and durable deduplication are ready.
  if(req.headers.host!=='127.0.0.1:4173'||req.headers.origin!=='http://127.0.0.1:4173')return json(403,{error:'Envoi réservé à la préversion locale.'});
  if(!(req.headers['content-type']||'').startsWith('application/json'))return json(415,{error:'Format non accepté.'});
  const chunks=[];let size=0;
  for await(const chunk of req){size+=chunk.length;if(size>12000)throw new ContactError(413,'Le message est trop long.');chunks.push(Buffer.from(chunk));}
  let raw;try{raw=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new ContactError(400,'Le formulaire n’est pas lisible.');}
  json(200,await sendContact(raw));
 }catch(e){json(e instanceof ContactError?e.status:503,{error:e instanceof ContactError?e.message:'L’envoi est indisponible. Vos réponses restent dans le formulaire.'});}
}
