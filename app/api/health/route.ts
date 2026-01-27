import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return new Response(
      JSON.stringify({
        status: "ok",
        db: "connected",
        timestamp: new Date().toISOString(),
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: "error",
        db: "disconnected",
      }),
      { status: 500 }
    );
  }
}