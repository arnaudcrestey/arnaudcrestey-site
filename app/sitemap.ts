import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://procoach.vercel.app";

  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/diagnostic`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/test-orientation-professionnelle`, changeFrequency: "weekly", priority: 0.95 }
  ];
}
