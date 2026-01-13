import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");

  if (!metal) {
    return NextResponse.json(
      { error: "Missing metal" },
      { status: 400 }
    );
  }

  const alerts = await prisma.alertTrigger.findMany({
    where: { metal },
    orderBy: { triggeredAt: "asc" },
    select: {
      id: true,
      price: true,
      direction: true,
      triggeredAt: true,
    },
  });

  return NextResponse.json(alerts);
}
