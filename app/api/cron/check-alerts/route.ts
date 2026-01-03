export const runtime = "nodejs";

export async function GET() {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "cron route alive (no prisma)",
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    }
  );
}
