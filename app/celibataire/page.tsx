import Link from "next/link";
import { Quiz } from "@/components/quiz";

export default function CelibatairePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center gap-6 px-6 py-10">
      <Link href="/" className="text-sm text-white/75 hover:text-white">← Retour</Link>
      <h1 className="text-center text-4xl font-bold">Diagnostic LOVE SCAN — Célibataire</h1>
      <Quiz type="celibataire" />
    </main>
  );
}
