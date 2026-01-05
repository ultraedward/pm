// app/api/alerts/by-metal/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { metal: string } }
) {
  const alerts = await prisma.alert.findMany({
    where: {
      metal: params.metal,
    },
    select: {
      id: true,
      metal: true,
      threshold: true,
      createdAt: true,
      active: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(alerts);
}
