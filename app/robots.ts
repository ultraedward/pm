import type { MetadataRoute } from "next";

/**
 * robots.ts — served as /robots.txt by Next.js
 *
 * Blocks authenticated-only routes from crawling so Googlebot doesn't waste
 * crawl budget on pages that redirect to /login. Also exposes the sitemap URL
 * so search engines can discover it without relying on manual submission.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/account",
          "/alerts",
          "/api/",
        ],
      },
    ],
    sitemap: "https://lode.rocks/sitemap.xml",
  };
}
