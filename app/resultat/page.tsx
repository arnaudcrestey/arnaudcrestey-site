"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProfileRadar } from "@/components/radar-chart";
import { ResultCard } from "@/components/result-card";
import { ShareButtons } from "@/components/share-buttons";
import { computeResults } from "@/lib/quiz";

export default function ResultPage() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [firstName, setFirstName] = useState("Utilisateur");

  useEffect(() => {
    const rawAnswers = localStorage.getItem("procoach_answers");
    const rawLead = localStorage.getItem("procoach_lead");
    if (rawAnswers) setAnswers(JSON.parse(rawAnswers));
    if (rawLead) {
      const lead = JSON.parse(rawLead);
      if (lead.firstName) setFirstName(lead.firstName);
    }
  }, []);

  const result = useMemo(() => computeResults(answers), [answers]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10">
      <h1 className="text-4xl font-bold">{firstName}, voici votre diagnostic professionnel</h1>
      <p className="mt-2 text-white/75">Analyse générée automatiquement par IA.</p>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <ResultCard profile={result.profile} />

        <ProfileRadar data={result.radar} />
      </section>

      <section className="glass mt-8 rounded-2xl p-6 text-center">
        <p className="text-lg">Pour aller plus loin :</p>
        <p className="mt-2 text-white/80">
          Découvrez votre analyse personnelle complète basée sur votre personnalité et votre thème astral.
        </p>
        <Link
          href="#"
          className="mt-5 inline-block rounded-xl bg-gradient-to-r from-neon to-softViolet px-6 py-3 font-semibold text-deepBlue"
        >
          Découvrir mon analyse complète
        </Link>
      </section>

      <section className="mt-8">
        <h3 className="mb-3 text-xl font-semibold">Partager mon résultat</h3>
        <ShareButtons />
      </section>
    </main>
  );
}
