export async function GET() {
  return new Response(
    `User-agent: *
Allow: /

Disallow: /dashboard
Disallow: /account
Disallow: /alerts
Disallow: /login
Disallow: /maintenance
Disallow: /api/

Sitemap: https://lode.rocks/sitemap.xml
`,
    { headers: { "Content-Type": "text/plain" } }
  );
}
