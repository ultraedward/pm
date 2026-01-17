// app/api/alerts/triggers/route.ts
// FULL FILE — COPY / PASTE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");

  const rows = await prisma.alertTrigger.findMany({
    where: {
      ...(metal
        ? {
            Alert: {
              metal,
            },
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(rows);
}
