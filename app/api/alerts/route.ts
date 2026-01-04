import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { metal, direction, threshold } = body;

  const pro = user.stripeStatus === "active";
  const MAX_FREE_ALERTS = 1;

  if (!pro) {
    const count = await prisma.alert.count({
      where: { userId: user.id },
    });

    if (count >= MAX_FREE_ALERTS) {
      return NextResponse.json(
        { error: "Upgrade required" },
        { status: 403 }
      );
    }
  }

  const alert = await prisma.alert.create({
    data: {
      userId: user.id,
      metal,
      direction,
      threshold,
      active: true,
    },
  });

  return NextResponse.json({ alert });
}
