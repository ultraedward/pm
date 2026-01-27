import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withCronLock } from "@/lib/cronLock";

export const dynamic = "force-dynamic";

const LOCK_ID = 900002;

export async function GET() {
  const { ran } = await withCronLock(LOCK_ID, async () => {
    const alerts = await prisma.alert.findMany({
      where: {
        active: true,
      },
    });

    for (const alert of alerts) {
      const latest = await prisma.priceHistory.findFirst({
        where: {
          metal: alert.metal, // string match (correct)
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!latest) continue;

      const shouldTrigger =
        alert.direction === "above"
          ? latest.price >= alert.target
          : latest.price <= alert.target;

      if (!shouldTrigger) continue;

      await prisma.alert.update({
        where: { id: alert.id },
        data: {
          triggeredAt: new Date(),
        },
      });
    }
  });

  return NextResponse.json({
    ok: true,
    ran,
    message: ran ? "Alerts checked" : "Skipped (lock held)",
  });
}