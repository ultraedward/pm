// app/api/dashboard/route.ts
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const metals = await prisma.metal.findMany({
    include: {
      prices: {
        orderBy: { createdAt: "desc" },
        take: 61,
      },
    },
  });

  const payload = metals.map((m) => {
    const sorted = [...m.prices].reverse();
    const latest = m.prices[0]?.price ?? 0;
    const prev = m.prices[1]?.price ?? latest;
    const deltaPct = prev ? ((latest - prev) / prev) * 100 : 0;

    return {
      id: m.id,
      name: m.name,
      latestPrice: latest,
      deltaPct,
      data: sorted.map((p) => ({
        time: new Date(p.createdAt).toLocaleTimeString(),
        price: p.price,
      })),
    };
  });

  return Response.json(payload);
}
