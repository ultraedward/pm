import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function rangeToSince(range: string) {
  const now = Date.now();
  switch (range) {
    case "24h":
      return new Date(now - 24 * 60 * 60 * 1000);
    case "7d":
      return new Date(now - 7 * 24 * 60 * 60 * 1000);
    case "30d":
    default:
      return new Date(now - 30 * 24 * 60 * 60 * 1000);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") ?? "30d";
    const since = rangeToSince(range);

    const metals = await prisma.metal.findMany({
      include: {
        prices: {
          where: { timestamp: { gte: since } },
          orderBy: { timestamp: "asc" },
        },
      },
    });

    const series = metals.map((m) => ({
      metal: m.name,
      symbol: m.symbol,
      data: m.prices.map((p) => ({
        timestamp: p.timestamp.toISOString(),
        value: p.value,
      })),
    }));

    return Response.json({ series });
  } catch {
    return Response.json({ series: [] });
  }
}
