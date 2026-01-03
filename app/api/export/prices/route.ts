import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const user = await prisma.user.findFirst({
    select: { stripeStatus: true },
  });

  if (!user || user.stripeStatus !== "active") {
    return new Response("Pro subscription required\n", { status: 403 });
  }

  const prices = await prisma.price.findMany({
    orderBy: { timestamp: "asc" },
    include: { metal: { select: { name: true, symbol: true } } },
  });

  const header = "timestamp,metal,symbol,price";
  const rows = prices.map((p) =>
    [
      p.timestamp.toISOString(),
      p.metal.name,
      p.metal.symbol,
      p.value,
    ].join(",")
  );

  return new Response([header, ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="prices.csv"',
    },
  });
}
