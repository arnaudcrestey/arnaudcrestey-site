import {dailyNote} from './daily-note.js';
const menu=document.querySelector('.menu-toggle');const mobileNav=document.querySelector('#mobile-nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');mobileNav.hidden=!open;});
mobileNav?.addEventListener('click',e=>{if(e.target.closest('a')){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Ouvrir le menu');mobileNav.hidden=true;}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mobileNav&&!mobileNav.hidden){mobileNav.hidden=true;menu.setAttribute('aria-expanded','false');menu.focus();}});
const entrance=document.querySelector('.entrance');let ticking=false;
function updateEntrance(){ticking=false;if(!entrance)return;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const desktop=innerWidth>760;const progress=desktop&&!reduced?Math.min(1,Math.max(0,-entrance.getBoundingClientRect().top/(entrance.offsetHeight-innerHeight))):0;entrance.style.setProperty('--journey',progress.toFixed(3));}
window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateEntrance);}},{passive:true});window.addEventListener('resize',updateEntrance);updateEntrance();

const header=document.querySelector('.site-header');
window.addEventListener('scroll',()=>header?.classList.toggle('is-scrolled',scrollY>45),{passive:true});
header?.classList.toggle('is-scrolled',scrollY>45);

// Depth is driven by native scrolling. No wheel/touch interception.
const journey=document.querySelector('.depth-journey');
if(journey){
 const root=document.documentElement,scenes=[...document.querySelectorAll('[data-scene]')],stage=document.querySelector('.depth-stage'),toggle=document.querySelector('#motion-toggle'),nav=[...document.querySelectorAll('[data-depth-go]')],media=matchMedia('(prefers-reduced-motion: reduce)');
 const interlude=document.querySelector('.day-interlude'),pause=interlude ? .65 : 0;
 const position=i=>i===0?0:i+pause;
 const lastScene=scenes.length-1,journeyRange=position(lastScene)+.3;
 const nearest=t=>scenes.reduce((best,_,i)=>Math.abs(position(i)-t)<Math.abs(position(best)-t)?i:best,0);
 if(interlude){
  const date=interlude.querySelector('time');
  function refreshDate(){const note=dailyNote();if(date.dateTime===note.key)return;date.dateTime=note.key;date.querySelector('.day-weekday').textContent=note.weekday;date.querySelector('.day-number').textContent=note.day;date.querySelector('.day-month').textContent=note.month;const accent=document.createElement('em');accent.textContent=note.message[1];interlude.querySelector('.day-message').replaceChildren(document.createTextNode(note.message[0]),document.createElement('br'),accent);}
  refreshDate();setInterval(()=>{if(!document.hidden)refreshDate();},60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshDate();});
 }
 let reduced=media.matches,queued=false;
 const displayMenu=document.createElement('details');displayMenu.className='display-menu';const displaySummary=document.createElement('summary');displaySummary.setAttribute('aria-label','Confort de lecture');displaySummary.title='Confort de lecture';displaySummary.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" aria-hidden="true"><path d="M4 7h4m4 0h8M4 17h8m4 0h4"/><circle cx="10" cy="7" r="2"/><circle cx="14" cy="17" r="2"/></svg><span class="display-caption">Confort de lecture</span>';displayMenu.append(displaySummary,toggle);toggle.hidden=false;
 displayMenu.addEventListener('keydown',e=>{if(e.key==='Escape'&&displayMenu.open){e.stopPropagation();displayMenu.open=false;displaySummary.focus();}});
 const headerTools=document.createElement('div');headerTools.className='header-tools';const contactLink=header?.querySelector('.header-contact');if(contactLink){header.insertBefore(headerTools,contactLink);headerTools.append(contactLink);}
 function placeDisplayMenu(){const target=innerWidth<=950?mobileNav:headerTools;if(target&&displayMenu.parentElement!==target){displayMenu.open=false;target.append(displayMenu);}}
 placeDisplayMenu();window.addEventListener('resize',placeDisplayMenu);
 const canvas=document.querySelector('#depth-dust'),ctx=canvas?.getContext('2d');
 const points=Array.from({length:110},(_,i)=>({x:Math.sin(i*17.173)*1.35,y:Math.cos(i*7.723)*1.1,z:(i*.147)%1}));
 function dust(t){if(!ctx)return;const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);for(const p of points){const z=((p.z-t*.25)%1+1)%1,scale=.13+z*1.3,x=w/2+p.x*w*.6*scale,y=h/2+p.y*h*.65*scale;ctx.fillStyle=`rgba(221,199,145,${.04+z*.2})`;ctx.beginPath();ctx.arc(x,y,.5+z*1.15,0,Math.PI*2);ctx.fill();}}
 function go(i){if(reduced){scenes[i]?.scrollIntoView({behavior:'instant',block:'start'});return;}const start=scrollY+journey.getBoundingClientRect().top;window.scrollTo({top:start+(position(i)/journeyRange)*(journey.offsetHeight-innerHeight),behavior:'smooth'});}
 function update(){queued=false;if(reduced){document.body.classList.toggle('on-entry',scenes[1].getBoundingClientRect().top>innerHeight*.5);return;}const r=journey.getBoundingClientRect(),t=Math.max(0,Math.min(journeyRange,-r.top/(journey.offsetHeight-innerHeight)*journeyRange)),active=nearest(t);
  const inPause=!!interlude&&t>.43&&t<1.24;
  scenes.forEach((scene,i)=>{const d=t-position(i),incoming=Math.min(1,Math.max(0,(d+.56)/.4)),outgoing=1-Math.min(1,Math.max(0,(d-.12)/.3)),opacity=incoming*outgoing;scene.classList.toggle('is-active',opacity>.005);scene.style.opacity=opacity.toFixed(3);scene.style.transform=`translate3d(${d*(i%2?25:-25)}px,${d*-22}px,${d*610}px)`;scene.inert=i!==active||inPause;scene.setAttribute('aria-hidden',String(i!==active||inPause));});
  if(interlude){const clamp=x=>Math.min(1,Math.max(0,x)),reveal=clamp((t-.4)/.22),fade=1-clamp((t-1)/.24),line=clamp((t-.49)/.23),message=clamp((t-.57)/.2);const depth=t<.64?-420+385*clamp((t-.4)/.24):t<=1?-35+70*((t-.64)/.36):35+385*clamp((t-1)/.24);interlude.style.setProperty('--day-opacity',(reveal*fade).toFixed(3));interlude.style.setProperty('--day-reveal',line.toFixed(3));interlude.style.setProperty('--day-message-reveal',message.toFixed(3));interlude.style.setProperty('--day-message-offset',`${(1-message)*12}px`);interlude.style.setProperty('--day-offset',`${depth*-.036}px`);interlude.style.setProperty('--day-depth',`${depth}px`);interlude.setAttribute('aria-hidden',String(!inPause));}
  document.body.classList.toggle('on-entry',active===0&&!inPause);
  const light=Math.max(0,1-Math.abs(t-position(2))*1.8);stage.style.setProperty('--light',light.toFixed(3));document.body.classList.toggle('is-light',light>.6);document.body.classList.toggle('immersion-ended',r.bottom<innerHeight*.6);
  nav.forEach((b,i)=>{if(i===active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});dust(t);
 }
 function mode(){root.classList.add('depth-enabled');document.body.classList.toggle('reduced-depth',reduced);toggle.setAttribute('aria-pressed',String(reduced));toggle.textContent=reduced?'Activer les animations':'Réduire les animations';scenes.forEach(s=>{s.inert=false;s.removeAttribute('aria-hidden');s.style.transform='';s.style.opacity='';});interlude?.removeAttribute('aria-hidden');document.body.classList.remove('is-light');update();}
 toggle.addEventListener('click',()=>{const active=nearest(Math.max(0,-journey.getBoundingClientRect().top/(journey.offsetHeight-innerHeight)*journeyRange));reduced=!reduced;displayMenu.open=false;mode();if(reduced)scenes[active].scrollIntoView({behavior:'instant',block:'start'});else go(0);});
 media.addEventListener('change',()=>{reduced=media.matches;mode();});
 nav.forEach(b=>b.addEventListener('click',()=>go(Number(b.dataset.depthGo))));
 const sceneAnchors=new Map(scenes.filter(scene=>scene.id).map(scene=>['#'+scene.id,Number(scene.dataset.scene)]));
 document.querySelectorAll('a[href^="#"],a[href^="/#"]').forEach(a=>{if(sceneAnchors.has(a.hash))a.addEventListener('click',e=>{e.preventDefault();go(sceneAnchors.get(a.hash));});});
 window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});window.addEventListener('resize',()=>{if(!queued){queued=true;requestAnimationFrame(update);}});mode();if(sceneAnchors.has(location.hash))go(sceneAnchors.get(location.hash));
}

// Demonstrations are entirely local. No vote, booking or personal data is sent.
const garage=document.querySelector('.garage-site');
if(garage){
 const tabs=[...garage.querySelectorAll('[data-garage-tab]')];
 const selectGarage=(name,focus=false)=>{const selected=tabs.find(tab=>tab.dataset.garageTab===name);if(!selected)return;tabs.forEach(tab=>{const active=tab===selected;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;const panel=document.getElementById(tab.getAttribute('aria-controls'));panel.hidden=!active;if(active)panel.scrollTop=0;});if(focus)selected.focus({preventScroll:true});};
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectGarage(tab.dataset.garageTab));tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;selectGarage(tabs[next].dataset.garageTab,true);});});
 garage.querySelectorAll('[data-garage-open]').forEach(button=>button.addEventListener('click',()=>selectGarage(button.dataset.garageOpen,true)));
 garage.classList.add('is-interactive');garage.querySelector('.garage-tabs').hidden=false;
}
const storyTrack=document.querySelector('.story-track');
if(storyTrack){
 const cards=[...storyTrack.children],previous=document.querySelector('[data-story-prev]'),next=document.querySelector('[data-story-next]'),count=document.querySelector('.story-count');
 let current=0,pending=false;
 const cardTop=i=>cards[i].offsetTop-(storyTrack.clientHeight-cards[i].offsetHeight)/2;
 function updateStory(){pending=false;let nearest=0;cards.forEach((card,i)=>{if(Math.abs(cardTop(i)-storyTrack.scrollTop)<Math.abs(cardTop(nearest)-storyTrack.scrollTop))nearest=i;});current=nearest;cards.forEach((card,i)=>{card.classList.toggle('is-story-current',i===current);card.classList.toggle('is-story-before',i<current);});previous.disabled=current===0;next.disabled=current===cards.length-1;count.textContent=String(current+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');}
 function moveStory(i){current=Math.max(0,Math.min(cards.length-1,i));storyTrack.scrollTo({top:cardTop(current),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 previous.addEventListener('click',()=>moveStory(current-1));next.addEventListener('click',()=>moveStory(current+1));
 storyTrack.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();moveStory(e.key==='Home'?0:e.key==='End'?cards.length-1:current+(e.key==='ArrowDown'?1:-1));});
 storyTrack.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(updateStory);}},{passive:true});
 window.addEventListener('resize',()=>{storyTrack.scrollTo({top:cardTop(current),behavior:'instant'});updateStory();});updateStory();
}
const demoTabs=[...document.querySelectorAll('[data-demo-tab]')];
function selectDemo(name){demoTabs.forEach(b=>{const selected=b.dataset.demoTab===name;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;document.getElementById(b.getAttribute('aria-controls')).hidden=!selected;});}
demoTabs.forEach((b,i)=>{b.addEventListener('click',()=>selectDemo(b.dataset.demoTab));b.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?demoTabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+demoTabs.length)%demoTabs.length;selectDemo(demoTabs[n].dataset.demoTab);demoTabs[n].focus();}});});
if(location.hash==='#tab-clara')selectDemo('clara');
const bakeryForm=document.querySelector('#bakery-vote');
const flammeAnswers={aveugle:['Votre préférence : À l’aveugle.','Un menu surprise dont les plats se dévoilent au fil du dîner. Les allergies et restrictions alimentaires seraient précisées à la réservation.'], 'quatre-mains':['Votre préférence : À quatre mains.','Deux chefs, deux regards et un menu imaginé ensemble pour une soirée spéciale.'],jazz:['Votre préférence : Au rythme du jazz.','Un duo de jazz joue sur place pendant le dîner, pour accompagner la soirée sans prendre le pas sur les conversations.']};
document.querySelectorAll('[data-flamme-choice]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-flamme-choice]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));const [title,body]=flammeAnswers[button.dataset.flammeChoice];const result=document.querySelector('#flamme-result');const heading=document.createElement('h4');heading.append(document.createTextNode('Votre préférence :'),document.createElement('br'),document.createTextNode(title.replace(/^Votre préférence : /,'')));const text=document.createElement('p');text.textContent=body;result.replaceChildren(heading,text);result.hidden=false;}));
bakeryForm?.addEventListener('submit',e=>{e.preventDefault();const flavour=new FormData(bakeryForm).get('flavour');if(!flavour)return;const output=document.querySelector('#vote-result');output.replaceChildren();const h=document.createElement('h4');h.textContent='Vous avez choisi : '+flavour+'.';const p=document.createElement('p');p.textContent='Dans un vrai parcours, la boulangerie pourrait annoncer le parfum retenu et donner rendez-vous en boutique.';const note=document.createElement('p');note.className='micro-note';note.textContent='Essai uniquement : aucun vote n’a été enregistré.';output.append(h,p,note);output.hidden=false;bakeryForm.hidden=true;});
const claraAnswers={seance:['Découvrir le déroulement.','Le site pourrait présenter les étapes de la première séance, ce qu’il faut prévoir et les questions à poser à la praticienne.'],approche:['Comprendre la démarche.','Une présentation simple du cadre et de l’approche aide le visiteur à savoir s’il souhaite en discuter.'],contact:['Préparer le premier échange.','Le visiteur pourrait choisir un sujet de discussion et les modalités de contact, sans raconter sa vie dans un formulaire.']};
document.querySelectorAll('[data-clara-choice]').forEach(b=>b.addEventListener('click',()=>{const [title,body]=claraAnswers[b.dataset.claraChoice];document.querySelectorAll('[data-clara-choice]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const result=document.querySelector('#clara-result');result.innerHTML='<h4></h4><p></p><a class="under-link" href="/votre-idee/">Imaginer une entrée pour mon métier ↗</a>';result.querySelector('h4').textContent=title;result.querySelector('p').textContent=body;result.hidden=false;}));

// Escaping prevents user text from ever being interpreted as HTML.
const escapeText=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const emailUrl=(subject,body)=>'mailto:demande@arnaudcrestey.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
const ideaForm=document.querySelector('#idea-form');
if(ideaForm){
 const state={step:0,sector:'',other:'',description:'',goal:'',presence:'',variation:0};
 const sectors=['Commerce & artisanat','Bien-être & accompagnement','Services & conseil','Création & décoration','Accueil & tourisme','Autre activité'];
 const goals=['Faire découvrir une offre','Susciter un premier contact','Faire participer mes clients','Donner envie de revenir'];
 const presence=['J’ai déjà un site','Je suis surtout sur les réseaux','Je démarre','Je préfère en parler ensemble'];
 const stage=document.querySelector('#wizard-stage'),error=document.querySelector('#wizard-error'),back=document.querySelector('#wizard-back'),next=document.querySelector('#wizard-next'),result=document.querySelector('#idea-result');
 const radios=(items,name,selected)=>`<div class="wizard-options">${items.map(x=>`<label><input type="radio" name="${name}" value="${escapeText(x)}" ${selected===x?'checked':''}><span>${x}</span></label>`).join('')}</div>`;
 function renderStep(focus=false){error.hidden=true;back.hidden=state.step===0;document.querySelector('#step-count').textContent=`0${state.step+1} / 04`;document.querySelector('#step-progress').style.width=(state.step+1)*25+'%';next.textContent=state.step===3?'Découvrir mon idée':'Continuer';
 const steps=[`<h2 class="wizard-title" tabindex="-1">Dans quel univers<br>travaillez-vous ?</h2><p class="wizard-description">Choisissez le plus proche de votre activité.</p>${radios(sectors,'sector',state.sector)}<label class="field-label">Votre métier, en quelques mots <span>(facultatif)</span><input type="text" name="other" maxlength="80" value="${escapeText(state.other)}" placeholder="Boulangerie, sophrologie, fleuriste…"></label>`,`<h2 class="wizard-title" tabindex="-1">Que proposez-vous,<br>et à qui ?</h2><p class="wizard-description">Une ou deux phrases suffisent pour poser le contexte.</p><label class="field-label">Votre activité<textarea name="description" rows="5" maxlength="600" placeholder="Exemple : une boulangerie de quartier, avec des recettes de saison pour les familles…">${escapeText(state.description)}</textarea></label>`,`<h2 class="wizard-title" tabindex="-1">Que souhaitez-vous<br>faciliter ?</h2><p class="wizard-description">Partons d’un seul objectif pour garder une idée claire.</p>${radios(goals,'goal',state.goal)}`,`<h2 class="wizard-title" tabindex="-1">Et aujourd’hui,<br>où en êtes-vous ?</h2><p class="wizard-description">Pour imaginer une suite qui s’appuie sur ce qui existe.</p>${radios(presence,'presence',state.presence)}`];stage.innerHTML=steps[state.step];if(focus)stage.querySelector('h2').focus();}
 function save(){const data=new FormData(ideaForm);if(state.step===0){state.sector=String(data.get('sector')||'');state.other=String(data.get('other')||'').trim();}if(state.step===1)state.description=String(data.get('description')||'').trim();if(state.step===2)state.goal=String(data.get('goal')||'');if(state.step===3)state.presence=String(data.get('presence')||'');}
 function validate(){if(state.step===0&&!state.sector)return 'Choisissez un univers pour continuer.';if(state.step===1&&state.description.length<10)return 'Décrivez votre activité en au moins quelques mots (10 caractères minimum).';if(state.step===2&&!state.goal)return 'Choisissez l’objectif qui vous intéresse le plus.';if(state.step===3&&!state.presence)return 'Choisissez une situation, même si vous préférez en parler ensemble.';return '';}
 let currentIdea=null,generating=false;
 async function requestIdea(){
  if(generating)return null;
  generating=true;error.hidden=true;const previousLabel=next.textContent;
  next.disabled=true;back.disabled=true;next.textContent='Votre idée se prépare…';
  ideaForm.setAttribute('aria-busy','true');
  const variant=result.querySelector('#idea-variant');if(variant){variant.disabled=true;variant.textContent='Une autre idée se prépare…';}
  try{
   const response=await fetch('/api/idea',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sector:state.sector,other:state.other,description:state.description,goal:state.goal,presence:state.presence,variation:state.variation,previousQuestion:currentIdea?.question||''}),signal:AbortSignal.timeout(45000)});
   const data=await response.json();
   if(!response.ok)throw new Error(data.error||'La génération est indisponible.');
   if(!data.idea||!Array.isArray(data.idea.choices)||data.idea.choices.length!==3||!Array.isArray(data.idea.replies)||data.idea.replies.length!==3)throw new Error('La proposition n’est pas exploitable. Réessayez.');
   return data.idea;
  }catch(e){
   const message=e.name==='TimeoutError'?'La génération prend trop de temps. Réessayez dans un instant.':e.message||'La connexion a échoué. Réessayez.';
   if(result.hidden){error.textContent=message;error.hidden=false;}else{let note=result.querySelector('.generation-error');if(!note){note=document.createElement('p');note.className='error-message generation-error';note.setAttribute('role','alert');result.prepend(note);}note.textContent=message;}
   return null;
  }finally{generating=false;next.disabled=false;back.disabled=false;next.textContent=previousLabel;ideaForm.removeAttribute('aria-busy');if(variant){variant.disabled=state.variation>=2;variant.textContent=state.variation>=2?'Deux variantes explorées':'Une autre piste';}}
 }
 async function showIdea(focus=true){const idea=await requestIdea();if(!idea)return false;currentIdea=idea;ideaForm.hidden=true;result.hidden=false;document.querySelector('#step-count').textContent='VOTRE PISTE';document.querySelector('#step-progress').style.width='100%';result.innerHTML=`<span class="result-kicker">PISTE ${state.variation+1} · PERSONNALISÉE PAR IA</span><h2 class="result-title" tabindex="-1">${escapeText(idea.title)}</h2><p class="idea-benefit">${escapeText(idea.why)}</p><p class="result-context">Votre objectif : <strong>${escapeText(state.goal.toLowerCase())}</strong>.<br>Votre contexte : ${escapeText(state.description)}</p><div class="idea-preview"><span class="eyebrow">CE QUE VOTRE CLIENT POURRAIT VOIR</span><h3>${escapeText(idea.question)}</h3><div class="preview-options">${idea.choices.map((x,i)=>`<button type="button" data-preview-choice="${i}" aria-pressed="false">${escapeText(x)}</button>`).join('')}</div><p class="preview-reply" hidden role="status"></p></div><p class="result-detail"><strong>COMMENT VOS CLIENTS Y ACCÈDENT</strong>${escapeText(idea.channel)}</p><p class="result-detail"><strong>CE QUE VOUS EN FAITES ENSUITE</strong>${escapeText(idea.next)}</p><p class="micro-note">Une proposition générée par IA, à valider ensemble. Les choix ci-dessus sont une simulation : aucun vote, rendez-vous ou achat n’est enregistré.</p><div class="result-actions"><button type="button" id="idea-contact" class="button button-dark">En parler avec Arnaud</button><button type="button" id="idea-variant" class="button button-outline" ${state.variation>=2?'disabled':''}>${state.variation>=2?'Deux variantes explorées':'Une autre piste'}</button></div><button type="button" class="back-button" id="idea-edit">← Modifier mes réponses</button><div class="idea-handoff" hidden></div>`;
 result.querySelectorAll('[data-preview-choice]').forEach(b=>b.addEventListener('click',()=>{result.querySelectorAll('[data-preview-choice]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const reply=result.querySelector('.preview-reply');const index=Number(b.dataset.previewChoice);reply.textContent=idea.replies[index];reply.hidden=false;}));
 result.querySelector('#idea-variant').addEventListener('click',async()=>{if(!generating&&state.variation<2){state.variation++;if(await showIdea()===false)state.variation--;}});
 result.querySelector('#idea-edit').addEventListener('click',()=>{if(generating)return;currentIdea=null;state.step=0;state.variation=0;result.hidden=true;ideaForm.hidden=false;renderStep(true);});
 result.querySelector('#idea-contact').addEventListener('click',()=>{const panel=result.querySelector('.idea-handoff');const summary=`Bonjour Arnaud,\n\nJ’aimerais échanger sur mon activité.\n${state.other?state.other+'\n':''}${state.description}\n\nMon objectif : ${state.goal}.\nMa situation : ${state.presence}.\n\nLa piste qui m’intéresse : ${idea.title}\n${idea.question}\n\nÀ bientôt.`;panel.innerHTML=`<p><strong>Voici le résumé proposé.</strong> Rien ne part automatiquement.</p><pre></pre><label><input type="checkbox" id="share-summary">Je souhaite inclure ce résumé dans mon message.</label><a class="button button-outline" id="summary-email">Ouvrir ma messagerie ↗</a><p class="micro-note">Vous vérifierez et enverrez le message depuis votre messagerie.</p>`;panel.querySelector('pre').textContent=summary;const link=panel.querySelector('#summary-email');link.href=emailUrl('Une idée pour mon activité','Bonjour Arnaud,\n\nJ’aimerais échanger sur une idée pour mon activité.');panel.querySelector('#share-summary').addEventListener('change',e=>{link.href=emailUrl('Une idée pour mon activité',e.target.checked?summary:'Bonjour Arnaud,\n\nJ’aimerais échanger sur une idée pour mon activité.');});panel.hidden=false;});
 if(focus)result.querySelector('h2').focus();
 }
 ideaForm.addEventListener('submit',e=>{e.preventDefault();if(generating)return;save();const message=validate();if(message){error.textContent=message;error.hidden=false;return;}if(state.step<3){state.step++;renderStep(true);}else showIdea();});back.addEventListener('click',()=>{save();state.step=Math.max(0,state.step-1);renderStep(true);});renderStep();
}

const contactForm=document.querySelector('#contact-form');
if(contactForm){
 const selected={'faire-le-point':'Faire le point','point-entree':'Un point d’entrée','site-vitrine':'Un site vitrine','systeme-complet':'Un système complet'}[new URLSearchParams(location.search).get('sujet')];
 if(selected)contactForm.elements.subject.value=selected;
 const submit=contactForm.querySelector('button[type="submit"]'),error=document.querySelector('#contact-error');
 let sending=false,lastPayload='',requestId='';
 contactForm.addEventListener('input',e=>{e.target.setCustomValidity?.('');error.hidden=true;});
 contactForm.addEventListener('submit',async e=>{
  e.preventDefault();if(sending)return;
  const d=new FormData(contactForm),name=String(d.get('name')).trim(),replyTo=String(d.get('replyTo')).trim(),message=String(d.get('message')).trim();
  const validReply=/^[^\s@<>;,]+@[^\s@<>;,]+\.[^\s@<>;,]+$/.test(replyTo)||(/^[+\d\s().-]+$/.test(replyTo)&&replyTo.replace(/\D/g,'').length>=7&&replyTo.replace(/\D/g,'').length<=15);
  contactForm.elements.name.setCustomValidity(name?'':'Indiquez votre prénom ou votre entreprise.');
  contactForm.elements.replyTo.setCustomValidity(validReply?'':'Indiquez une adresse e-mail ou un numéro de téléphone valide.');
  contactForm.elements.message.setCustomValidity(message?'':'Écrivez quelques mots sur votre situation.');
  if(!contactForm.reportValidity())return;
  const payload={name,replyTo,message,subject:String(d.get('subject')),website:String(d.get('website')||'')};
  const serialized=JSON.stringify(payload);if(serialized!==lastPayload){requestId=crypto.randomUUID();lastPayload=serialized;}
  sending=true;submit.disabled=true;submit.textContent='Envoi en cours…';contactForm.setAttribute('aria-busy','true');error.hidden=true;
  const fields=[...contactForm.querySelectorAll('input,select,textarea')];fields.forEach(field=>field.disabled=true);
  try{
   const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,requestId}),signal:AbortSignal.timeout(45000)});
   const result=await response.json();if(!response.ok||result.sent!==true)throw new Error(result.error||'L’envoi n’a pas été confirmé.');
   contactForm.hidden=true;const success=document.querySelector('#contact-success');success.hidden=false;success.focus();
  }catch(e){error.textContent=e.name==='TimeoutError'||e.name==='TypeError'?'L’envoi n’a pas pu être confirmé. Évitez de renvoyer immédiatement ; contactez-nous directement par e-mail.':e.message;error.hidden=false;}
  finally{sending=false;submit.disabled=false;submit.textContent='Envoyer ma demande';contactForm.removeAttribute('aria-busy');fields.forEach(field=>field.disabled=false);}
 });
}

// Enable native submit controls only after all local handlers have been installed.
document.querySelectorAll('[data-js-submit]').forEach(button=>button.disabled=false);

// Optional agent interface: read displayed state only, never triggers contact.
if(document.modelContext?.registerTool){const lifecycle=new AbortController();try{Promise.resolve(document.modelContext.registerTool({name:'read_visible_ac_experience',title:'Lire l’expérience AC affichée',description:'Lire le titre et les textes visibles de la démonstration en cours, sans envoyer ni modifier de données.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute(input){if(!input||typeof input!=='object'||Object.keys(input).length)throw new Error('Aucun paramètre attendu');return {title:document.title,text:document.querySelector('main')?.innerText?.slice(0,6500)||''};}},{signal:lifecycle.signal})).catch(()=>{});}catch{}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
