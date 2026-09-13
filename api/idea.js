import {generateIdea,validateInput} from '../server/atelier.mjs';
import {readPublicRequest,updateControls,reserveInState,jsonReply,publicFailure,PublicError} from '../server/production.mjs';
export default {async fetch(request){try{
 const {raw,ip}=await readPublicRequest(request,4096);validateInput(raw);
 const key=process.env.OPENAI_API_KEY?.trim();if(!key?.startsWith('sk-'))throw new PublicError(503,'L’atelier est momentanément indisponible.');
 const idea=await generateIdea(raw,{key,reserve:()=>updateControls(state=>reserveInState(state,{kind:'idea',ip}))});
 return jsonReply(200,{idea});
}catch(error){return publicFailure(error);}}};
