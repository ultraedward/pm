import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Logic:
 * - Get latest price per metal
 * - Find active alerts for that metal
 * - If condition met, create AlertTrigger
 * - Deactivate alert (one-shot)
 */
export async function GET() {
  try {
    // Get latest price per metal
    const latestByMetal = await prisma.$queryRaw<
      { metal: string; price: number }[]
    >`
      SELECT DISTINCT ON (metal)
        metal,
        price::float
      FROM "PriceHistory"
      ORDER BY metal, timestamp DESC
    `;

    for (const { metal, price } of latestByMetal) {
      const alerts = await prisma.alert.findMany({
        where: { metal, active: true },
      });

      for (const alert of alerts) {
        const hit =
          (alert.direction === "above" && price >= Number(alert.target)) ||
          (alert.direction === "below" && price <= Number(alert.target));

        if (!hit) continue;

        // Record trigger
        await prisma.alertTrigger.create({
          data: {
            alertId: alert.id,
            price,
          },
        });

        // Disable alert (one-shot)
        await prisma.alert.update({
          where: { id: alert.id },
          data: { active: false },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("check-alerts failed", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}