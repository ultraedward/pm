import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const latest = await prisma.$queryRaw<
      { metal: string; price: number }[]
    >`
      SELECT DISTINCT ON (metal)
        metal,
        price::float
      FROM "PriceHistory"
      ORDER BY metal, timestamp DESC
    `;

    for (const { metal, price } of latest) {
      const alerts = await prisma.alert.findMany({
        where: { metal, active: true },
      });

      for (const alert of alerts) {
        const hit =
          (alert.direction === "above" && price >= Number(alert.target)) ||
          (alert.direction === "below" && price <= Number(alert.target));

        if (!hit) continue;

        await prisma.alertTrigger.create({
          data: {
            alertId: alert.id,
            price,
          },
        });

        await prisma.alert.update({
          where: { id: alert.id },
          data: { active: false },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}