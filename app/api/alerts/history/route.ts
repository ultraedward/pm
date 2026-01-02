import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ alerts: [] });
  }

  const alerts = await prisma.alert.findMany({
    where: { userId: user.id },
    include: {
      triggers: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    alerts: alerts.map((a) => ({
      id: a.id,
      metal: a.metal,
      direction: a.direction,
      threshold: a.threshold,
      active: a.active,
      cooldownUntil: a.cooldownUntil,
      lastTrigger: a.triggers[0] ?? null,
    })),
  });
}
