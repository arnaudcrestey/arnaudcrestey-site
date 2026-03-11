export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute h-16 w-16 animate-ping rounded-full bg-[#FF8FA3]/40" />
        <span className="absolute h-12 w-12 rounded-full bg-[#B388EB]/50 blur-sm" />
        <span className="text-2xl">💗</span>
      </div>
      <p className="text-white/80">Analyse émotionnelle en cours...</p>
    </div>
  );
}
