import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const hours = Number(searchParams.get("hours") ?? 24);

  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const rows = await prisma.price.findMany({
    where: {
      timestamp: { gte: since },
    },
    orderBy: { timestamp: "asc" },
  });

  return NextResponse.json(rows);
}
