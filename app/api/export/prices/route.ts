// app/api/export/prices/route.ts
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const prices = await prisma.price.findMany({
    include: { metal: true },
    orderBy: { createdAt: "asc" },
  });

  const header = "metal,price,timestamp\n";
  const rows = prices
    .map(
      (p) =>
        `${p.metal.name},${p.price},${p.createdAt.toISOString()}`
    )
    .join("\n");

  return new Response(header + rows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=prices.csv",
    },
  });
}
