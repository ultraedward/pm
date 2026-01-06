import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  console.log("[CRON] Running alert check");

  const alerts = await prisma.alert.findMany({
    where: { active: true },
    select: {
      id: true,
      metal: true,
      direction: true,
      threshold: true,
      userId: true,
    },
  });

  console.log(`[CRON] Found ${alerts.length} active alerts`);

  for (const alert of alerts) {
    const latest = await prisma.spotPriceCache.findFirst({
      where: { metal: alert.metal },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) {
      console.warn(`[CRON] No price for ${alert.metal}`);
      continue;
    }

    const hit =
      alert.direction === "above"
        ? latest.price >= alert.threshold
        : latest.price <= alert.threshold;

    if (!hit) continue;

    console.log(
      `[CRON] Triggered alert ${alert.id} (${alert.metal} ${alert.direction} ${alert.threshold})`
    );

    await prisma.alertTrigger.create({
      data: {
        alertId: alert.id,
        userId: alert.userId,
        price: latest.price,
      },
    });

    // Optional: auto-disable one-time alerts
    await prisma.alert.update({
      where: { id: alert.id },
      data: { active: false },
    });
  }

  return NextResponse.json({ ok: true });
}
