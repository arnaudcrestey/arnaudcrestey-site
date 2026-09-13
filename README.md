# Arnaud Crestey — site et atelier

Site indépendant : pages statiques et deux fonctions Node pour l’atelier personnalisé et le formulaire de contact. La configuration Vercel est dans `vercel.json` ; la bascule du domaine est une opération distincte du déploiement.

## Ouvrir et modifier

Depuis ce dossier : `node scripts/build.mjs`, puis `node server.mjs`. Aperçu : http://127.0.0.1:4173/ (accessible uniquement sur ce Mac).

`node scripts/check.mjs` contrôle les routes, liens, ancres, assets, formulaires et la syntaxe.

- `src/immersion.mjs` : accueil en cinq scènes.
- `src/content.mjs` : exemples, tarifs, atelier d’idées, contact et confidentialité.
- `src/base.html` : structure commune.
- `dist/styles.css`, `dist/depth.css`, `dist/responsive.css` : présentation.
- `dist/app.js` : défilement, démos et formulaires.
- `scripts/build.mjs` : régénération des pages HTML ; les styles et scripts dans dist sont des sources, pas des fichiers temporaires.

## Ce qui fonctionne

Navigation en profondeur, préférence de mouvement réduit, démonstrations métier sans enregistrement de vote, atelier personnalisé via OpenAI et envoi direct via Hostinger Email avec accusé de réception si une adresse e-mail est renseignée.

## Limites explicites

Les démonstrations ne déclenchent pas de vote, de commande ni de réservation réels. Aucun stockage persistant dans le navigateur. Les secrets `OPENAI_API_KEY`, `CONTACT_SMTP_PASSWORD` et `CONTROL_HASH_SECRET` doivent être renseignés uniquement côté serveur. Le stockage privé Vercel Blob conserve les compteurs et des empreintes techniques, jamais les messages ni les descriptions métier. Les garde-fous refusent les appels si le stockage est indisponible.

Le serveur de développement écoute uniquement 127.0.0.1. La version en préparation reste marquée noindex. L’atelier est limité à 200 tentatives pour le lancement (pas de remise à zéro automatique), le contact à 20 demandes/jour avec plafonds par origine technique et coordonnées. Les secrets et les fichiers `.env*` ne doivent jamais être versionnés. Le code source public n’accorde aucune licence sur les images, la marque et les contenus appartenant à leurs titulaires.

## Ressources reprises

- Logo `ac-original.png` : image AC fournie par Arnaud.
- Portrait `arnaud-crestey.jpg` : photo personnelle fournie par Arnaud, non générée.
- Maison Jeannette : `https://www.pub8.arnaudcrestey.com/vote-praline-noisette.png`.
- Camille Valette : `https://www.pub6.arnaudcrestey.com/hero-camille-valette-user.png`.
- ANCRAGE : `https://www.pub10.arnaudcrestey.com/images/ancrage-hero.png`.
- Maison des Lisières : `https://www.pub7.arnaudcrestey.com/images/heures-calmes-exterieur.png`.
- Clara Morel : `https://www.pub15.arnaudcrestey.com/clara-path.webp`.

Ces exemples sont des démonstrations fictives, pas des témoignages de clients. Les images ont été redimensionnées localement pour réduire leur poids. Les polices Instrument Serif et DM Sans sont hébergées localement ; conserver leurs licences lors d’une distribution.

## Validation du déploiement

Exécuter `node scripts/check.mjs`, `node scripts/check-contact.mjs`, `node scripts/check-atelier.mjs` et `node scripts/check-production.mjs`. Ces contrôles n’envoient ni mail ni requête OpenAI. Vérifier séparément un envoi et une génération réels sur l’hébergement cible avant de rattacher le domaine. Seul le hub principal est concerné ; les autres projets et les enregistrements de messagerie ne doivent pas être modifiés.
