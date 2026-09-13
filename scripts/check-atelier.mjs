import assert from 'node:assert/strict';
import {validateInput,validateIdea,AtelierError,handleAtelier} from '../server/atelier.mjs';
const input={sector:'Commerce & artisanat',other:'Coiffeur',description:'Je propose des coupes et colorations pour adultes.',goal:'Faire participer mes clients',presence:'Je suis surtout sur les réseaux',variation:0};
assert.equal(validateInput(input).other,'Coiffeur');
for(const bad of [{...input,description:'court'},{...input,sector:'unknown'},{...input,goal:''},{...input,description:'x'.repeat(601)},{...input,description:'Contact : personne@example.com'}])assert.throws(()=>validateInput(bad),AtelierError);
const idea={needsClarification:false,clarification:'',title:'Un conseil à choisir',why:'Choisir le prochain conseil à donner en boutique.',question:'Quel sujet vous intéresse ?',choices:['Couleur','Coupe','Coiffage'],replies:['Conseil couleur','Conseil coupe','Conseil coiffage'],channel:'Un lien sur vos réseaux.',next:'Préparer le conseil choisi.'};
assert.equal(validateIdea(idea).choices.length,3);
assert.throws(()=>validateIdea({...idea,choices:['A']}),AtelierError);
assert.throws(()=>validateIdea({...idea,needsClarification:true,clarification:'Quel métier exercez-vous ?'}),AtelierError);
async function endpoint(request){let status,result;await handleAtelier(request,{writeHead(s){status=s;},end(s){result=JSON.parse(s);}});return {status,result};}
assert.equal((await endpoint({method:'GET',headers:{}})).status,405);
assert.equal((await endpoint({method:'POST',headers:{origin:'https://example.com',host:'127.0.0.1:4173'}})).status,403);
assert.equal((await endpoint({method:'POST',headers:{origin:'http://127.0.0.1:4173',host:'127.0.0.1:4173','content-type':'text/plain'}})).status,415);
console.log('Validation des réponses, structure des idées et blocage des appels non autorisés : OK. Aucun appel API.');
