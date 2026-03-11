"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { QuizType, computeScoreFromAnswers, detectProfile } from "@/lib/quiz";

export function ResultClient() {
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const type = (searchParams.get("type") as QuizType) || "celibataire";
  const answers = useMemo(() => {
    const raw = searchParams.get("answers");
    if (!raw) return [];

    try {
      return JSON.parse(decodeURIComponent(raw)) as number[];
    } catch {
      return [];
    }
  }, [searchParams]);

  const { percentage } = computeScoreFromAnswers(answers);
  const profile = detectProfile(percentage, type);

  useEffect(() => {
    async function generateAnalysis() {
      try {
        const response = await fetch("/api/analyse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: percentage, type, answers })
        });

        const data = (await response.json()) as { analysis?: string };
        setAnalysis(data.analysis ?? "Analyse indisponible pour le moment.");
      } catch {
        setAnalysis("Analyse indisponible pour le moment.");
      } finally {
        setLoading(false);
      }
    }

    generateAnalysis();
  }, [answers, percentage, type]);

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-10">
      <Link href="/" className="text-sm text-white/75 hover:text-white">← Recommencer</Link>

      <section className="romantic-card relative space-y-6 p-8">
        <div className="absolute left-1/2 top-16 -z-10 h-24 w-24 -translate-x-1/2 rounded-full bg-[#FF8FA3]/45 blur-3xl" />
        <h1 className="text-center text-3xl font-bold">Votre résultat LOVE SCAN</h1>

        <div className="mx-auto w-fit rounded-2xl border border-white/30 bg-white/10 px-6 py-4 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Score relationnel</p>
          <p className="text-5xl font-bold text-white">{percentage}%</p>
        </div>

        <p className="text-center text-lg text-white/90">Profil détecté : <strong>{profile}</strong></p>

        {loading ? (
          <LoadingAnimation />
        ) : (
          <article className="whitespace-pre-line rounded-2xl border border-white/20 bg-black/10 p-5 text-white/90">
            {analysis}
          </article>
        )}

        <div className="rounded-2xl border border-white/20 bg-white/5 p-5 text-sm text-white/85">
          <p className="font-semibold">Analyse générée automatiquement.</p>
          <p className="mt-3">Pour aller plus loin :</p>
          <p className="mt-2">
            Cabinet Astrae<br />
            Analyse approfondie des dynamiques relationnelles<br />
            et compatibilité astrologique.
          </p>
          <p className="mt-2">arnaudcrestey.com</p>
        </div>
      </section>
    </main>
  );
}
