// app/api/charts/alerts/route.ts
// FULL FILE — COPY / PASTE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");

  if (!metal) {
    return NextResponse.json([], { status: 200 });
  }

  const triggers = await prisma.alertTrigger.findMany({
    where: {
      Alert: {
        metal,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      createdAt: true,
      price: true,
    },
  });

  return NextResponse.json(triggers);
}
