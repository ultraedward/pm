import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const alerts = await prisma.alert.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    include: {
      triggers: {
        orderBy: {
          triggeredAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const result = alerts.map((alert) => ({
    id: alert.id,
    metal: alert.metal,
    price: alert.price,
    direction: alert.direction,
    active: alert.active,
    lastTriggeredAt: alert.triggers[0]?.triggeredAt ?? null,
  }));

  return NextResponse.json(result);
}