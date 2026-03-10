import Link from "next/link";

const highlights = ["Mal-être professionnel", "Perte de sens", "Reconversion", "Orientation", "Stagnation professionnelle"];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
      <header className="flex items-center justify-between pb-10">
        <div className="text-2xl font-bold text-gradient">ProCoach</div>
        <Link href="/test-orientation-professionnelle" className="text-sm text-white/80 hover:text-white">
          Landing SEO
        </Link>
      </header>

      <section className="glass relative overflow-hidden rounded-3xl p-8 md:p-14">
        <div className="absolute inset-0 -z-10 bg-grid bg-[size:18px_18px] opacity-40" />
        <p className="mb-4 inline-block rounded-full border border-neon/40 px-4 py-1 text-xs uppercase tracking-[0.2em] text-neon">
          Diagnostic professionnel gratuit par IA
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          Pourquoi votre vie professionnelle bloque ?
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/80">
          En 3 minutes, identifiez ce qui freine réellement votre évolution grâce à un diagnostic IA ultra-rapide et actionnable.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {highlights.map((item) => (
            <span key={item} className="rounded-full border border-white/25 px-3 py-1 text-sm text-white/85">
              {item}
            </span>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/diagnostic"
            className="rounded-xl bg-gradient-to-r from-neon to-softViolet px-7 py-4 text-lg font-semibold text-deepBlue transition hover:scale-[1.02]"
          >
            Faire le diagnostic
          </Link>
        </div>
      </section>
    </main>
  );
}
