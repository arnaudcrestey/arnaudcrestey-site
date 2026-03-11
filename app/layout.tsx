import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LOVE SCAN | Diagnostic de vie amoureuse",
  description:
    "LOVE SCAN vous aide à comprendre vos dynamiques relationnelles en 3 minutes avec un quiz émotionnel et une analyse générée par IA.",
  openGraph: {
    title: "LOVE SCAN",
    description: "Diagnostic émotionnel relationnel avec score, profil détecté et recommandations personnalisées.",
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
