import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Basic DB connectivity + last price timestamp
    const lastPrice = await prisma.price.findFirst({
      orderBy: { timestamp: "desc" },
      select: { timestamp: true },
    });

    return Response.json({
      status: "ok",
      cron: {
        prices: {
          enabled: true,
          lastRun: lastPrice?.timestamp ?? null,
        },
        alerts: {
          enabled: true,
        },
      },
    });
  } catch {
    return Response.json(
      {
        status: "error",
        cron: {
          prices: { enabled: false },
          alerts: { enabled: false },
        },
      },
      { status: 500 }
    );
  }
}
