export const siteOrigin='https://www.arnaudcrestey.com';
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const metadata={
 '/':{title:'Création de sites et stratégie digitale — Arnaud Crestey',description:'Arnaud Crestey accompagne les petites entreprises : clarifier votre activité, créer un site et un point d’entrée utiles, puis faire vivre votre communication.'},
 '/exemples/':{title:'Exemples de sites et points d’entrée — Arnaud Crestey',description:'Restaurant, boulangerie, sophrologie : découvrez des exemples interactifs pour faire participer vos clients et ouvrir une première conversation.'},
 '/tarifs/':{title:'Tarifs : conseil, point d’entrée et site — Arnaud Crestey',description:'Faire le point : 190 € HT. Point d’entrée : 490 € HT. Site et parcours complet à partir de 1 390 € HT. Découvrez les offres et le suivi mensuel.'},
 '/votre-idee/':{title:'Une idée de point d’entrée pour votre métier — Arnaud Crestey',description:'Décrivez votre activité et découvrez une idée de point d’entrée personnalisée : une question concrète et des choix adaptés à vos clients, sans compte.'},
 '/contact/':{title:'Contact : parlons de votre activité — Arnaud Crestey',description:'Un projet de site ou une question de communication ? Contactez Arnaud Crestey, à Vire en Normandie, pour faire avancer votre activité.'}
};
export function withSeo(html,path,{notFound=false}={}){
 const meta=metadata[path];
 if(meta)html=html.replace(/<title>.*?<\/title>/,`<title>${escape(meta.title)}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escape(meta.description)}">`);
 if(notFound)return html.replace('content="index,follow"','content="noindex,follow"');
 const title=meta?.title||html.match(/<title>(.*?)<\/title>/)?.[1];
 const description=meta?.description||html.match(/<meta name="description" content="([^"]*)"/)?.[1];
 const url=siteOrigin+path;
 const graph=[{'@type':'WebSite','@id':siteOrigin+'/#website',url:siteOrigin+'/',name:'Arnaud Crestey',inLanguage:'fr-FR',publisher:{'@id':siteOrigin+'/#person'}},{'@type':'Person','@id':siteOrigin+'/#person',name:'Arnaud Crestey',url:siteOrigin+'/',image:siteOrigin+'/assets/arnaud-crestey.jpg',jobTitle:'Conseil en communication et stratégie digitale'},{'@type':path==='/contact/'?'ContactPage':'WebPage','@id':url+'#webpage',url,name:title,description,inLanguage:'fr-FR',isPartOf:{'@id':siteOrigin+'/#website'}}];
 const tags=`<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:locale" content="fr_FR"><meta property="og:site_name" content="Arnaud Crestey">
<meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${url}">
<meta property="og:image" content="${siteOrigin}/assets/signature-ac.png"><meta property="og:image:alt" content="Signature AC — arnaudcrestey.com">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${siteOrigin}/assets/signature-ac.png">
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c')}</script>`;
 return html.replace('</head>',tags+'\n</head>');
}
export function sitemap(paths){return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+paths.map(path=>`  <url><loc>${siteOrigin}${path}</loc></url>`).join('\n')+'\n</urlset>\n';}
