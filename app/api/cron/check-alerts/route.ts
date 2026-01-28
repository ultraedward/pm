import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { acquireCronLock, releaseCronLock } from "@/lib/cronLock";

export const dynamic = "force-dynamic";

export async function GET() {
  const lockName = "check-alerts";

  const acquired = await acquireCronLock(lockName);
  if (!acquired) {
    return NextResponse.json({ skipped: true });
  }

  try {
    const alerts = await prisma.alert.findMany({
      where: { active: true },
    });

    for (const alert of alerts) {
      const latest = await prisma.priceHistory.findFirst({
        where: { metal: alert.metal },
        orderBy: { createdAt: "desc" },
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
          active: false,
        },
      });

      // hook email / push / webhook here
    }

    return NextResponse.json({ success: true });
  } finally {
    await releaseCronLock(lockName);
  }
}