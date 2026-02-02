import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const METALS = ["gold", "silver", "platinum", "palladium"] as const;
const POINTS_PER_METAL = 50;

export async function GET() {
  try {
    const result: Record<string, { t: number; price: number }[]> = {};

    for (const metal of METALS) {
      const rows = await prisma.priceHistory.findMany({
        where: { metal },
        orderBy: { createdAt: "desc" },
        take: POINTS_PER_METAL,
      });

      // Oldest → newest for charts
      result[metal] = rows
        .reverse()
        .map((r) => ({
          t: r.createdAt.getTime(),
          price: r.price,
        }));
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("❌ PRICES READ ERROR", err);
    return NextResponse.json(
      { error: "failed_to_load_prices" },
      { status: 500 }
    );
  }
}