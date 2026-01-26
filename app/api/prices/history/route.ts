import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const rows = await prisma.priceHistory.findMany({
    orderBy: { timestamp: "asc" },
    take: 500
  });

  return NextResponse.json(rows);
}