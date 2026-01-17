import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");

  if (!metal) {
    return NextResponse.json({ error: "metal required" }, { status: 400 });
  }

  const triggers = await prisma.alertTrigger.findMany({
    where: {
      alert: {
        metal,
      },
      triggeredAt: {
        not: null,
      },
    },
    orderBy: {
      triggeredAt: "asc",
    },
    select: {
      triggeredAt: true,
      price: true,
      alert: {
        select: {
          metal: true,
        },
      },
    },
  });

  const series = triggers.map((t) => ({
    t: t.triggeredAt!.getTime(),
    price: t.price,
  }));

  return NextResponse.json(series);
}
