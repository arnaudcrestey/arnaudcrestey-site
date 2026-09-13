import {sendContact,validateContact} from '../server/contact.mjs';
import {readPublicRequest,updateControls,reserveInState,markContact,digest,jsonReply,publicFailure,PublicError} from '../server/production.mjs';
export default {async fetch(request){try{
 const {raw,ip}=await readPublicRequest(request,12000),value=validateContact(raw);
 const password=process.env.CONTACT_SMTP_PASSWORD?.trim();if(!password)throw new PublicError(503,'Le formulaire est momentanément indisponible.');
 const fingerprint=digest(JSON.stringify([value.name,value.replyTo,value.subject,value.message]));
 const previous=await updateControls(state=>reserveInState(state,{kind:'contact',ip,requestId:value.requestId,fingerprint,recipient:digest(value.replyTo.toLowerCase())}));
 if(previous)return jsonReply(200,previous);
 const result=await sendContact(raw,{password,reserve:async()=>{},accepted:()=>markContact(value.requestId,'accepted')});
 await markContact(value.requestId,'complete',result.receiptSent);
 return jsonReply(200,result);
}catch(error){return publicFailure(error);}}};
