import { NextResponse } from "next/server";

type RequestBody = {
  score: number;
  type: "celibataire" | "couple";
  answers: number[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as RequestBody;
  const { score, type, answers } = body;

  const prompt = `Tu es un expert en dynamique relationnelle.

Le score exact de dynamique amoureuse est : ${score}%.
Situation : ${type}.

Réponses au questionnaire :
${answers.join(", ")}

Rédige une analyse claire et concise (80 mots maximum) comprenant :

1 une synthèse de la dynamique relationnelle
2 les tensions possibles
3 trois recommandations concrètes

Adresse-toi directement à la personne avec "vous".

Structure :

Analyse

Recommandations
1
2
3

Conclusion

Explique que certaines dynamiques relationnelles peuvent être liées à la personnalité, l’histoire de vie ou la compatibilité entre deux personnes.

Mentionne qu’une analyse approfondie peut être réalisée via l’étude astrologique proposée par le Cabinet Astrae.`;

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        analysis:
          "Analyse\nVotre dynamique montre des signaux utiles pour progresser.\n\nRecommandations\n1. Clarifiez vos besoins émotionnels réels.\n2. Observez vos réactions en période de tension.\n3. Posez une action concrète cette semaine.\n\nConclusion\nCertaines dynamiques viennent de votre personnalité, de votre histoire ou de la compatibilité. Le Cabinet Astrae peut approfondir cela."
      },
      { status: 200 }
    );
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 220
      })
    });

    if (!response.ok) {
      throw new Error("OpenAI request failed");
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const analysis = data.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({ analysis: analysis ?? "Analyse indisponible." });
  } catch {
    return NextResponse.json({ analysis: "Analyse indisponible pour le moment." }, { status: 200 });
  }
}
