export type QuizQuestion = {
  id: number;
  label: string;
  dimension: "motivation" | "sens" | "energie" | "autonomie" | "progression";
  answers: { label: string; value: number; text: string }[];
};

export const quizQuestions: QuizQuestion[] = [
  { id: 1, label: "Comment évaluez-vous votre satisfaction au travail ?", dimension: "motivation", answers: [
    { label: "A", value: 1, text: "Faible" },
    { label: "B", value: 2, text: "Moyenne" },
    { label: "C", value: 3, text: "Élevée" }
  ]},
  { id: 2, label: "Avez-vous le sentiment d’être utile dans vos missions ?", dimension: "sens", answers: [
    { label: "A", value: 1, text: "Rarement" },
    { label: "B", value: 2, text: "Parfois" },
    { label: "C", value: 3, text: "Souvent" }
  ]},
  { id: 3, label: "À quel point souhaitez-vous changer de situation pro ?", dimension: "progression", answers: [
    { label: "A", value: 3, text: "Très fort" },
    { label: "B", value: 2, text: "Modéré" },
    { label: "C", value: 1, text: "Faible" }
  ]},
  { id: 4, label: "Quel est votre niveau d’énergie en début de journée ?", dimension: "energie", answers: [
    { label: "A", value: 1, text: "Très bas" },
    { label: "B", value: 2, text: "Variable" },
    { label: "C", value: 3, text: "Stable" }
  ]},
  { id: 5, label: "Vous sentez-vous reconnu(e) pour votre contribution ?", dimension: "motivation", answers: [
    { label: "A", value: 1, text: "Non" },
    { label: "B", value: 2, text: "Partiellement" },
    { label: "C", value: 3, text: "Oui" }
  ]},
  { id: 6, label: "Votre poste est-il aligné avec vos valeurs ?", dimension: "sens", answers: [
    { label: "A", value: 1, text: "Pas du tout" },
    { label: "B", value: 2, text: "En partie" },
    { label: "C", value: 3, text: "Oui" }
  ]},
  { id: 7, label: "La peur du changement freine-t-elle vos décisions ?", dimension: "autonomie", answers: [
    { label: "A", value: 1, text: "Oui, fortement" },
    { label: "B", value: 2, text: "Parfois" },
    { label: "C", value: 3, text: "Non" }
  ]},
  { id: 8, label: "Avez-vous de l’autonomie dans vos choix quotidiens ?", dimension: "autonomie", answers: [
    { label: "A", value: 1, text: "Très peu" },
    { label: "B", value: 2, text: "Correcte" },
    { label: "C", value: 3, text: "Forte" }
  ]},
  { id: 9, label: "Votre motivation est-elle stable sur la semaine ?", dimension: "motivation", answers: [
    { label: "A", value: 1, text: "Non" },
    { label: "B", value: 2, text: "Moyennement" },
    { label: "C", value: 3, text: "Oui" }
  ]},
  { id: 10, label: "Votre vision d’avenir est-elle claire ?", dimension: "progression", answers: [
    { label: "A", value: 1, text: "Pas du tout" },
    { label: "B", value: 2, text: "Partiellement" },
    { label: "C", value: 3, text: "Très claire" }
  ]}
];

export type ProfileType = {
  id: 1 | 2 | 3 | 4 | 5;
  title: string;
  summary: string;
  vigilance: string[];
  growthTracks: string[];
};

export const profiles: Record<number, ProfileType> = {
  1: {
    id: 1,
    title: "Profession bloquée",
    summary:
      "Vous êtes resté trop longtemps dans un environnement qui ne correspond plus à votre évolution.",
    vigilance: ["Risque d'épuisement émotionnel", "Perte de confiance progressive", "Baisse d'impact professionnel"],
    growthTracks: ["Identifier vos irritants clés", "Établir une stratégie de sortie réaliste", "Activer un réseau ciblé"]
  },
  2: {
    id: 2,
    title: "Potentiel sous-exploité",
    summary:
      "Vos capacités sont supérieures aux opportunités offertes par votre poste actuel.",
    vigilance: ["Frustration chronique", "Sous-performance subie", "Dévalorisation des talents"],
    growthTracks: ["Mapper vos compétences fortes", "Négocier des missions à plus fort levier", "Préparer un repositionnement métier"]
  },
  3: {
    id: 3,
    title: "Phase de transition",
    summary:
      "Vous êtes dans une période charnière où des décisions importantes doivent être prises.",
    vigilance: ["Procrastination décisionnelle", "Surcharge mentale", "Risque de choix défensif"],
    growthTracks: ["Clarifier 2 scénarios réalistes", "Définir un plan de test sur 30 jours", "Être accompagné sur la prise de décision"]
  },
  4: {
    id: 4,
    title: "Désalignement personnel",
    summary:
      "Votre travail ne correspond plus à vos valeurs profondes.",
    vigilance: ["Perte de sens persistante", "Conflit interne", "Démotivation diffuse"],
    growthTracks: ["Reformuler vos valeurs non négociables", "Repenser votre environnement de travail", "Explorer une reconversion alignée"]
  },
  5: {
    id: 5,
    title: "Trajectoire cohérente",
    summary:
      "Votre trajectoire semble globalement alignée avec votre personnalité.",
    vigilance: ["Rester en mouvement", "Éviter la stagnation confortable", "Maintenir un cap long terme"],
    growthTracks: ["Structurer votre prochaine étape", "Renforcer votre marque professionnelle", "Développer une vision à 3 ans"]
  }
};

export function computeResults(answers: number[]) {
  const defaults = { motivation: 0, sens: 0, energie: 0, autonomie: 0, progression: 0 };
  const totals = quizQuestions.reduce((acc, question, idx) => {
    const value = answers[idx] ?? 2;
    acc[question.dimension] += value;
    return acc;
  }, defaults);

  const averages = {
    motivation: Number((totals.motivation / 3).toFixed(1)),
    sens: Number((totals.sens / 2).toFixed(1)),
    energie: Number((totals.energie / 1).toFixed(1)),
    autonomie: Number((totals.autonomie / 2).toFixed(1)),
    progression: Number((totals.progression / 2).toFixed(1))
  };

  const globalScore =
    (averages.motivation + averages.sens + averages.energie + averages.autonomie + averages.progression) / 5;

  let profileId: 1 | 2 | 3 | 4 | 5 = 3;

  if (globalScore <= 1.6) profileId = 1;
  else if (averages.motivation <= 1.8 && averages.progression <= 2) profileId = 2;
  else if (averages.sens <= 1.8) profileId = 4;
  else if (globalScore >= 2.6) profileId = 5;

  return {
    profile: profiles[profileId],
    radar: [
      { subject: "Motivation", score: averages.motivation },
      { subject: "Sens", score: averages.sens },
      { subject: "Énergie", score: averages.energie },
      { subject: "Autonomie", score: averages.autonomie },
      { subject: "Progression", score: averages.progression }
    ]
  };
}
