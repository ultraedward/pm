import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const alerts = await prisma.alert.findMany({
    where: { active: true },
  });

  let checked = 0;
  let triggered = 0;

  for (const alert of alerts) {
    checked++;

    const latest = await prisma.spotPrice.findFirst({
      where: { metal: alert.metal },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) continue;

    const hit =
      alert.direction === "above"
        ? latest.price >= alert.threshold
        : latest.price <= alert.threshold;

    if (hit) {
      triggered++;
      // future: email, log, deactivate
    }
  }

  return NextResponse.json({
    ok: true,
    checked,
    triggered,
    timestamp: new Date().toISOString(),
  });
}
