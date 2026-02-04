import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  const alerts = await prisma.alert.findMany({
    where: { userId: session.user.id },
    include: {
      triggers: {
        orderBy: { triggeredAt: "desc" },
        take: 1,
      },
      emails: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const status = alerts.map((alert) => ({
    id: alert.id,
    metal: alert.metal,
    target: alert.target,
    direction: alert.direction,
    active: alert.active,
    lastTriggeredAt: alert.triggers[0]?.triggeredAt ?? null,
    lastEmailAt: alert.emails[0]?.createdAt ?? null,
    lastEmailStatus: alert.emails[0]?.status ?? null,
  }));

  return NextResponse.json({
    ok: true,
    alerts: status,
  });
}