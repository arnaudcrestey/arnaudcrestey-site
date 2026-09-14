// A continuous twenty-six-day cycle, based on the calendar date in France.
// These editorial messages are local: no API, cookies or personal data.
export const dailyMessages = [
 ['Aujourd’hui, qu’aimeriez-vous','faire avancer ?'],
 ['Votre prochaine idée commence','par un échange.'],
 ['Avant de choisir un outil,','clarifions le besoin.'],
 ['Votre savoir-faire mérite','d’être compris.'],
 ['Prenons le temps','de faire le point.'],
 ['Votre activité évolue.','Votre site aussi.'],
 ['Une offre de saison,','une histoire à partager.'],
 ['Et si vos clients avaient','leur mot à dire ?'],
 ['Votre site peut commencer','par l’essentiel.'],
 ['Quelle question vos clients','vous posent-ils souvent ?'],
 ['Pas besoin de tout refaire','pour avancer.'],
 ['Une nouveauté chez vous ?','Faites-la découvrir.'],
 ['Un site vivant laisse','la place à la suite.'],
 ['Parlons de vos besoins,','les outils viendront après.'],
 ['Quel premier pas proposer','à vos visiteurs ?'],
 ['Une priorité claire aide','à choisir la suite.'],
 ['Votre façon de travailler','mérite d’être racontée.'],
 ['Un événement se prépare ?','Donnons-lui sa place.'],
 ['Qu’aimeriez-vous que vos clients','retiennent de vous ?'],
 ['Une idée utile répond','à un besoin concret.'],
 ['Comprendre avant d’agir.','Simplifier pour faire avancer.'],
 ['Quoi de neuf','chez vous ?'],
 ['Quel projet','vous anime ?'],
 ['Que préparez-vous','en ce moment ?'],
 ['Une nouveauté','à partager ?'],
 ['Une idée vous trotte','en tête ?']
];

export function dailyNote(now = new Date()) {
 const options={timeZone:'Europe/Paris'};
 const parts=new Intl.DateTimeFormat('fr-FR',{...options,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const part=name=>parts.find(p=>p.type===name).value;
 const year=part('year'),month=part('month'),day=part('day');
 const elapsed=Math.round((Date.UTC(+year,+month-1,+day)-Date.UTC(2026,8,14))/86400000);
 const index=((elapsed%dailyMessages.length)+dailyMessages.length)%dailyMessages.length;
 return {key:`${year}-${month}-${day}`,day,index,message:dailyMessages[index],weekday:new Intl.DateTimeFormat('fr-FR',{...options,weekday:'long'}).format(now),month:new Intl.DateTimeFormat('fr-FR',{...options,month:'long',year:'numeric'}).format(now)};
}
