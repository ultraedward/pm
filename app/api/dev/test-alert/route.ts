import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST() {
  const alert = await prisma.alert.findFirst({
    where: { active: true },
  });

  if (!alert) {
    return NextResponse.json({
      ok: false,
      error: "No active alerts found",
    });
  }

  const fakePrice =
    alert.direction === "above"
      ? alert.threshold + 1
      : alert.threshold - 1;

  await prisma.alertTrigger.create({
    data: {
      alertId: alert.id,
      userId: alert.userId,
      price: fakePrice,
    },
  });

  return NextResponse.json({
    ok: true,
    forced: true,
    alertId: alert.id,
    simulatedPrice: fakePrice,
  });
}
