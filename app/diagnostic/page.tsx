"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LeadCapture } from "@/components/lead-capture";
import { Quiz } from "@/components/quiz";
import { quizQuestions } from "@/lib/quiz";

export default function DiagnosticPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [leadStep, setLeadStep] = useState(false);

  const question = quizQuestions[step];

  const chooseAnswer = (value: number) => {
    const next = [...answers];
    next[step] = value;
    setAnswers(next);

    if (step + 1 === quizQuestions.length) {
      setLeadStep(true);
      return;
    }

    setStep(step + 1);
  };

  const goResult = (lead: { firstName: string; email: string; birthDate?: string }) => {
    localStorage.setItem("procoach_answers", JSON.stringify(answers));
    localStorage.setItem("procoach_lead", JSON.stringify(lead));
    router.push("/resultat");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-10">
      <h1 className="text-center text-3xl font-bold">Diagnostic IA ProCoach</h1>
      <p className="mt-3 text-center text-white/75">10 questions · moins de 2 minutes</p>

      {!leadStep && question && (
        <Quiz
          current={step + 1}
          total={quizQuestions.length}
          question={question}
          onSelect={chooseAnswer}
        />
      )}

      {leadStep && <div className="mt-10"><LeadCapture onSubmit={goResult} /></div>}
    </main>
  );
}
