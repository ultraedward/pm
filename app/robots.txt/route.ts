export async function GET() {
  return new Response(
    `User-agent: *
Allow: /
Allow: /pricing

Disallow: /dashboard
Disallow: /account
Disallow: /alerts
Disallow: /api/

Sitemap: https://pm-iota-wheat.vercel.app/sitemap.xml
`,
    { headers: { "Content-Type": "text/plain" } }
  );
}
