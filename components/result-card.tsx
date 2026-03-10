import { ProfileType } from "@/lib/quiz";

export function ResultCard({ profile }: { profile: ProfileType }) {
  return (
    <div className="glass rounded-2xl p-6">
      <p className="text-sm uppercase tracking-wide text-neon">Diagnostic principal</p>
      <h2 className="mt-2 text-3xl font-semibold">{profile.title}</h2>
      <p className="mt-3 text-white/85">{profile.summary}</p>

      <h3 className="mt-6 text-lg font-semibold">Points de vigilance</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
        {profile.vigilance.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h3 className="mt-6 text-lg font-semibold">Pistes d'évolution</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
        {profile.growthTracks.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
