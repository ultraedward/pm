import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");

  if (!metal) {
    return NextResponse.json([]);
  }

  const triggers = await prisma.alertTrigger.findMany({
    where: {
      alert: { metal },
    },
    orderBy: { triggeredAt: "asc" },
    select: {
      triggeredAt: true,
      price: true,
    },
  });

  return NextResponse.json(
    triggers.map((t) => ({
      t: t.triggeredAt.getTime(),
      price: t.price,
    }))
  );
}
