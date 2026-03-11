import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-12">
      <section className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/25 bg-white/10 p-8 text-center shadow-[0_25px_120px_rgba(179,136,235,0.45)] backdrop-blur-xl md:p-12">
        <div className="pointer-events-none absolute -top-16 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-[#FF8FA3]/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-8 bottom-8 h-28 w-28 animate-pulse rounded-full bg-[#6C63FF]/35 blur-2xl" />

        <p className="mb-4 animate-float text-3xl">💖</p>
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">LOVE SCAN</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85 md:text-xl">
          Découvrez en 3 minutes les dynamiques invisibles qui influencent votre vie amoureuse.
        </p>

        <div className="mx-auto mt-10 flex max-w-xl flex-col gap-4">
          <Link href="/celibataire" className="cta-btn">
            ❤️ Je suis célibataire
          </Link>
          <Link href="/couple" className="cta-btn">
            💑 Je suis en couple
          </Link>
        </div>
      </section>
    </main>
  );
}
