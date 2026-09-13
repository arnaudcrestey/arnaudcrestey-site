import {get,put,BlobPreconditionFailedError} from '@vercel/blob';
import {createHmac} from 'node:crypto';

export class PublicError extends Error{constructor(status,message){super(message);this.status=status;}}
const path='ac-controls/launch-v1.json';
const limits={idea:200,contact:20};
// Private metadata only. No message, business description, email or raw IP is stored.
const empty=()=>({version:1,ideaTotal:0,day:'',contactCount:0,visitors:{},recipients:{},requests:{}});
export function digest(value){
 const secret=process.env.CONTROL_HASH_SECRET;
 if(!secret||secret.length<32)throw new PublicError(503,'Le service est temporairement indisponible.');
 return createHmac('sha256',secret).update(value).digest('hex');
}
export async function updateControls(change){
 if(!process.env.BLOB_READ_WRITE_TOKEN&&!process.env.BLOB_STORE_ID)throw new PublicError(503,'Le service est temporairement indisponible.');
 for(let attempt=0;attempt<4;attempt++){
  const result=await get(path,{access:'private',useCache:false,abortSignal:AbortSignal.timeout(8000)});
  const state=result?JSON.parse(await new Response(result.stream).text()):empty();
  if(state.version!==1||!Number.isInteger(state.ideaTotal)||state.ideaTotal<0||!Number.isInteger(state.contactCount)||!state.visitors||!state.recipients||!state.requests)throw new PublicError(503,'Le service est temporairement indisponible.');
  const output=change(state);
  try{await put(path,JSON.stringify(state),{access:'private',addRandomSuffix:false,contentType:'application/json',...(result?{allowOverwrite:true,ifMatch:result.blob.etag}:{allowOverwrite:false}),abortSignal:AbortSignal.timeout(8000)});return output;}
  catch(error){if(error instanceof BlobPreconditionFailedError)continue;throw error;}
 }
 throw new PublicError(429,'Plusieurs demandes arrivent ensemble. Réessayez dans un instant.');
}
export function reserveInState(state,{kind,ip,requestId,fingerprint,recipient},now=Date.now()){
 const day=new Date(now).toISOString().slice(0,10);
 if(state.day!==day){state.day=day;state.contactCount=0;state.recipients={};}
 for(const [key,value] of Object.entries(state.visitors))if(value.time<now-86400000)delete state.visitors[key];
 for(const [key,value] of Object.entries(state.requests))if(value.time<now-86400000)delete state.requests[key];
 if(kind==='contact'&&state.requests[requestId]){
  const previous=state.requests[requestId];
  if(previous.fingerprint!==fingerprint)throw new PublicError(409,'Cette demande a changé. Rechargez la page avant de réessayer.');
  if(previous.status==='accepted'||previous.status==='complete')return {sent:true,receiptSent:previous.receiptSent===true};
  throw new PublicError(409,'Cette demande est déjà en cours ou son envoi reste à confirmer. Évitez de la renvoyer immédiatement.');
 }
 if(kind==='idea'&&state.ideaTotal>=limits.idea)throw new PublicError(429,'L’atelier a atteint sa limite de lancement. Contactez-nous pour poursuivre votre idée.');
 if(kind==='contact'&&state.contactCount>=limits.contact)throw new PublicError(429,'Le formulaire a atteint sa limite du jour. Vous pouvez nous écrire directement par e-mail.');
 const key=kind+':'+ip,previous=state.visitors[key]||{time:now,recent:[],count:0,day};
 previous.recent=previous.recent.filter(time=>time>now-60000);
 if(previous.day!==day){previous.day=day;previous.count=0;}
 if(previous.recent.length>=(kind==='idea'?3:2)||previous.count>=(kind==='idea'?10:5))throw new PublicError(429,'Patientez avant une nouvelle demande, ou contactez-nous directement.');
 if(kind==='contact'&&recipient&&(state.recipients[recipient]||0)>=3)throw new PublicError(429,'Plusieurs demandes ont déjà été reçues pour ces coordonnées. Merci de patienter.');
 if(Object.keys(state.visitors).length>=1000&&!state.visitors[key])throw new PublicError(429,'Le service est très sollicité. Réessayez plus tard.');
 previous.time=now;previous.count++;previous.recent.push(now);state.visitors[key]=previous;
 if(kind==='idea')state.ideaTotal++;
 else{state.contactCount++;if(recipient)state.recipients[recipient]=(state.recipients[recipient]||0)+1;state.requests[requestId]={time:now,fingerprint,status:'pending',receiptSent:false};}
 return null;
}
export function markContact(requestId,status,receiptSent=false){return updateControls(state=>{const entry=state.requests[requestId];if(!entry)throw new PublicError(503,'La demande ne peut pas être confirmée.');entry.status=status;entry.receiptSent=receiptSent;});}
export async function readPublicRequest(request,maxBytes){
 if(request.method!=='POST')throw new PublicError(405,'Méthode non autorisée.');
 const url=new URL(request.url),origin=request.headers.get('origin');
 const allowed=new Set(['https://arnaudcrestey.com','https://www.arnaudcrestey.com']);
 for(const host of [process.env.VERCEL_URL,process.env.VERCEL_PROJECT_PRODUCTION_URL])if(host&&/^[a-z0-9.-]+\.vercel\.app$/.test(host))allowed.add('https://'+host);
 if(!origin||!allowed.has(origin)||url.origin!==origin)throw new PublicError(403,'Cette demande doit provenir du site.');
 if(!request.headers.get('content-type')?.startsWith('application/json'))throw new PublicError(415,'Format non accepté.');
 const ip=request.headers.get('x-vercel-forwarded-for');
 if(!process.env.VERCEL||!ip)throw new PublicError(503,'Le service est temporairement indisponible.');
 const reader=request.body?.getReader();if(!reader)throw new PublicError(400,'Le formulaire est vide.');
 const chunks=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBytes){await reader.cancel();throw new PublicError(413,'Le formulaire est trop long.');}chunks.push(Buffer.from(value));}
 let raw;try{raw=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new PublicError(400,'Le formulaire n’est pas lisible.');}
 return {raw,ip:digest(ip)};
}
export function jsonReply(status,data){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
export function publicFailure(error){return jsonReply(Number.isInteger(error.status)?error.status:503,{error:Number.isInteger(error.status)?error.message:'Le service est temporairement indisponible. Vos réponses restent dans le formulaire.'});}
