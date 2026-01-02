import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ triggers: [] });

  const { searchParams } = new URL(req.url);
  const hours = Number(searchParams.get("hours") ?? 48);

  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const triggers = await prisma.alertTrigger.findMany({
    where: {
      userId: user.id,
      triggered: true,
      createdAt: { gte: since },
    },
    select: {
      id: true,
      metal: true,
      price: true,
      createdAt: true,
      alert: {
        select: {
          direction: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    triggers: triggers.map((t) => ({
      id: t.id,
      metal: t.metal,
      price: t.price,
      direction: t.alert.direction,
      time: t.createdAt,
    })),
  });
}
