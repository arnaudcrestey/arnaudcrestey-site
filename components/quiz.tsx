"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { OPTION_SCORES, QuizType, questionsByType } from "@/lib/quiz";
import { ProgressBar } from "@/components/ProgressBar";

type QuizProps = {
  type: QuizType;
};

export function Quiz({ type }: QuizProps) {
  const router = useRouter();
  const questions = useMemo(() => questionsByType[type], [type]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const currentQuestion = questions[index];

  function onChoose(optionIndex: number) {
    const value = OPTION_SCORES[optionIndex] ?? OPTION_SCORES[2];
    const nextAnswers = [...answers, value];

    if (index === questions.length - 1) {
      const serialized = encodeURIComponent(JSON.stringify(nextAnswers));
      router.push(`/result?type=${type}&answers=${serialized}`);
      return;
    }

    setAnswers(nextAnswers);
    setIndex((prev) => prev + 1);
  }

  function onTouchEnd(touchX: number) {
    if (touchStart === null) return;
    const delta = touchStart - touchX;
    if (delta > 70 && index < questions.length - 1 && answers.length > index) {
      setIndex((prev) => prev + 1);
    }
    if (delta < -70 && index > 0) {
      setIndex((prev) => prev - 1);
    }
    setTouchStart(null);
  }

  return (
    <section
      className="romantic-card w-full max-w-2xl space-y-6 p-6 md:p-8"
      onTouchStart={(event) => setTouchStart(event.changedTouches[0]?.clientX ?? null)}
      onTouchEnd={(event) => onTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
    >
      <ProgressBar current={index + 1} total={questions.length} />

      <div className="min-h-56 animate-fade-in space-y-6">
        <p className="text-sm uppercase tracking-[0.25em] text-white/60">Question {currentQuestion.id}</p>
        <h2 className="text-2xl font-semibold leading-snug md:text-3xl">{currentQuestion.question}</h2>
        <div className="space-y-3">
          {currentQuestion.options.map((option, optionIndex) => (
            <button
              key={option}
              onClick={() => onChoose(optionIndex)}
              className="group w-full rounded-2xl border border-white/25 bg-white/10 px-5 py-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[#FF8FA3] hover:bg-white/20"
            >
              <span className="font-medium text-white/95 group-hover:text-white">{option}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-white/55">Astuce mobile : glissez pour revisiter vos réponses.</p>
    </section>
  );
}
