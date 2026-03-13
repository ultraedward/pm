const BASE = "https://pm-iota-wheat.vercel.app";

const PUBLIC_ROUTES = [
  { url: "/",        priority: "1.0", changefreq: "daily"   },
  { url: "/pricing", priority: "0.8", changefreq: "weekly"  },
  { url: "/login",   priority: "0.5", changefreq: "monthly" },
];

export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const urls = PUBLIC_ROUTES.map(
    ({ url, priority, changefreq }) => `
  <url>
    <loc>${BASE}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
