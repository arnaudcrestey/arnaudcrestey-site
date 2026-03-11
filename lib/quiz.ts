export type QuizType = "celibataire" | "couple";

export type QuizQuestion = {
  id: number;
  question: string;
  options: [string, string, string];
};

const CELIBATAIRE_QUESTIONS: QuizQuestion[] = [
  { id: 1, question: "Lorsque vous rencontrez quelqu’un vous avez tendance à", options: ["vous attacher vite", "prendre votre temps", "garder vos distances"] },
  { id: 2, question: "Vos relations passées se terminent souvent par", options: ["manque de communication", "perte d’intérêt", "conflits"] },
  { id: 3, question: "Vous recherchez surtout", options: ["sécurité émotionnelle", "passion", "liberté"] },
  { id: 4, question: "Vous avez tendance à", options: ["idéaliser", "analyser", "vous protéger"] },
  { id: 5, question: "Votre difficulté principale est", options: ["faire confiance", "exprimer vos besoins", "vous engager"] },
  { id: 6, question: "Les débuts de relation sont", options: ["excitants", "stressants", "incertains"] },
  { id: 7, question: "Vous attendez d’un partenaire", options: ["soutien", "stimulation", "autonomie"] },
  { id: 8, question: "Quand un conflit apparaît vous", options: ["dialoguez", "évitez", "réagissez émotionnellement"] },
  { id: 9, question: "Vous vous sentez aujourd’hui", options: ["prêt à aimer", "hésitant", "méfiant"] },
  { id: 10, question: "Votre vision de l’amour est", options: ["construire", "explorer", "protéger votre indépendance"] }
];

const COUPLE_QUESTIONS: QuizQuestion[] = [
  { id: 1, question: "La communication dans votre couple est", options: ["fluide", "irrégulière", "difficile"] },
  { id: 2, question: "Vous vous sentez", options: ["soutenu", "parfois compris", "souvent seul"] },
  { id: 3, question: "Les conflits sont", options: ["constructifs", "répétitifs", "épuisants"] },
  { id: 4, question: "La confiance est", options: ["solide", "fragile", "abîmée"] },
  { id: 5, question: "Les projets communs sont", options: ["clairs", "flous", "absents"] },
  { id: 6, question: "L’intimité émotionnelle est", options: ["profonde", "moyenne", "distante"] },
  { id: 7, question: "Votre partenaire vous encourage", options: ["souvent", "parfois", "rarement"] },
  { id: 8, question: "L’énergie du couple est", options: ["nourrissante", "instable", "fatigante"] },
  { id: 9, question: "Vous vous sentez dans la relation", options: ["libre", "limité", "enfermé"] },
  { id: 10, question: "Si vous deviez résumer votre relation", options: ["équilibrée", "fragile", "en crise"] }
];

export const questionsByType: Record<QuizType, QuizQuestion[]> = {
  celibataire: CELIBATAIRE_QUESTIONS,
  couple: COUPLE_QUESTIONS
};

export const OPTION_SCORES = [10, 6, 2] as const;

export function computeScoreFromAnswers(answers: number[]) {
  const score = answers.reduce((sum, value) => sum + value, 0);
  const scoreMax = answers.length * OPTION_SCORES[0];

  return {
    score,
    scoreMax,
    percentage: Math.round((score / scoreMax) * 100)
  };
}

export function detectProfile(percentage: number, type: QuizType) {
  if (type === "celibataire") {
    if (percentage >= 80) return "Cœur disponible et aligné";
    if (percentage >= 55) return "Explorateur émotionnel";
    return "Protection affective élevée";
  }

  if (percentage >= 80) return "Couple solide et conscient";
  if (percentage >= 55) return "Équilibre relationnel fragile";
  return "Connexion en tension";
}
