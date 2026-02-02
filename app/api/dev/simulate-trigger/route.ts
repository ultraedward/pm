import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAlertEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.DEV_SECRET}`) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  try {
    const alert = await prisma.alert.findFirst({
      where: { active: true },
    });

    if (!alert) {
      return NextResponse.json(
        { ok: false, error: "no_alerts" },
        { status: 400 }
      );
    }

    const latest = await prisma.priceHistory.findFirst({
      where: { metal: alert.metal },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) {
      return NextResponse.json(
        { ok: false, error: "no_price" },
        { status: 400 }
      );
    }

    await sendAlertEmail({
      alertId: alert.id,
      metal: alert.metal,
      price: latest.price,
      target: alert.target,
      direction: alert.direction as "above" | "below",
    });

    return NextResponse.json({
      ok: true,
      alertId: alert.id,
      price: latest.price,
    });
  } catch (err: any) {
    console.error("SIMULATE ERROR", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}