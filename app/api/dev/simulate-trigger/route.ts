import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDevAuth } from "@/lib/devAuth";
import { sendAlertEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

/**
 * DEV ONLY
 * Simulates an alert trigger and sends a real email
 */
export async function GET(req: Request) {
  if (!requireDevAuth(req)) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  const alert = await prisma.alert.findFirst({
    where: { active: true },
    include: { user: true },
  });

  if (!alert) {
    return NextResponse.json({
      ok: false,
      error: "no_alerts_found",
    });
  }

  const fakePrice =
    alert.direction === "above"
      ? alert.target + 1
      : alert.target - 1;

  // ✅ Correct call signature
  await sendAlertEmail({
    alertId: alert.id,
    metal: alert.metal,
    price: fakePrice,
    target: alert.target,
    direction: alert.direction as "above" | "below",
  });

  return NextResponse.json({
    ok: true,
    simulated: true,
    alertId: alert.id,
    sentTo: alert.user.email,
  });
}