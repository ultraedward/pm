import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://lode.rocks";

  return [
    // Dynamic pages — prices change continuously
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${base}/gram`,
      lastModified: new Date("2026-04-13"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/coin-melt-calculator`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    // Semi-static feature pages
    {
      url: `${base}/gold-price-alerts`,
      lastModified: new Date("2026-04-11"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/portfolio-tracker`,
      lastModified: new Date("2026-04-11"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/pricing`,
      lastModified: new Date("2026-04-11"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Legal pages — rarely change
    {
      url: `${base}/terms`,
      lastModified: new Date("2026-03-12"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date("2026-04-11"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
