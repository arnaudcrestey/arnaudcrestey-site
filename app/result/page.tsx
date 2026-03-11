import { Suspense } from "react";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { ResultClient } from "./ResultClient";

export default function ResultPage() {
  return (
    <Suspense fallback={<main className="min-h-screen"><LoadingAnimation /></main>}>
      <ResultClient />
    </Suspense>
  );
}
