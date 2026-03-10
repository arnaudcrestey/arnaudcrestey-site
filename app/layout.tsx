import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProCoach | Diagnostic professionnel gratuit IA",
  description:
    "Pourquoi votre vie professionnelle bloque ? Répondez à notre test orientation professionnelle IA en 3 minutes et obtenez un diagnostic personnalisé.",
  keywords: [
    "test orientation professionnelle",
    "test reconversion professionnelle",
    "pourquoi je ne suis pas heureux au travail",
    "quel métier est fait pour moi",
    "bilan professionnel gratuit"
  ],
  openGraph: {
    title: "ProCoach - Diagnostic professionnel gratuit IA",
    description:
      "Découvrez en 3 minutes ce qui freine votre évolution professionnelle.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
