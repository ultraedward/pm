import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 }
      );
    }

    const alerts = await prisma.alert.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const alertIds = alerts.map((a) => a.id);

    const triggers = await prisma.alertTrigger.findMany({
      where: { alertId: { in: alertIds } },
      orderBy: { triggeredAt: "desc" },
    });

    const emails = await prisma.emailLog.findMany({
      where: { alertId: { in: alertIds } },
      orderBy: { createdAt: "desc" },
    });

    const history = alerts.map((alert) => ({
      id: alert.id,
      metal: alert.metal,
      target: alert.target,
      direction: alert.direction,
      active: alert.active,
      createdAt: alert.createdAt,
      triggers: triggers.filter((t) => t.alertId === alert.id),
      emails: emails.filter((e) => e.alertId === alert.id),
    }));

    return NextResponse.json({
      ok: true,
      alerts: history,
    });
  } catch (err) {
    console.error("ALERT HISTORY ERROR", err);
    return NextResponse.json(
      { ok: false, error: "internal_error" },
      { status: 500 }
    );
  }
}