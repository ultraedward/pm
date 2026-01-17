import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const triggers = await prisma.alertTrigger.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      alert: {
        select: {
          id: true,
          metal: true,
        },
      },
    },
  });

  return NextResponse.json(
    triggers.map((t) => ({
      id: t.id,
      metal: t.alert.metal,
      triggeredAt: t.triggeredAt,
      price: t.price,
      createdAt: t.createdAt,
    }))
  );
}
