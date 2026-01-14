// app/api/alerts/by-metal/route.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Returns trigger history grouped by metal.
 *
 * Query params:
 * - take: number per metal (default 50, max 200)
 */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { Gold: [], Silver: [], Platinum: [], Palladium: [] },
      { status: 200 }
    );
  }

  const { searchParams } = new URL(req.url);
  const take = Math.min(Math.max(Number(searchParams.get("take") ?? 50), 1), 200);

  const metals = ["Gold", "Silver", "Platinum", "Palladium"] as const;

  const results = await Promise.all(
    metals.map(async (metal) => {
      const rows = await prisma.alertTrigger.findMany({
        where: {
          alert: { userId: session.user.id, metal },
        },
        orderBy: { triggeredAt: "desc" },
        take,
        select: {
          id: true,
          triggeredAt: true,
          price: true,
          alert: {
            select: {
              id: true,
              direction: true,
              targetPrice: true,
            },
          },
        },
      });

      return [
        metal,
        rows.map((r) => ({
          id: r.id,
          triggeredAt: r.triggeredAt.toISOString(),
          currentPrice: r.price,
          alertId: r.alert.id,
          metal,
          direction: r.alert.direction,
          targetPrice: r.alert.targetPrice,
        })),
      ] as const;
    })
  );

  return NextResponse.json(Object.fromEntries(results));
}
