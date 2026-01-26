import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const rows = await prisma.priceHistory.findMany({
    distinct: ["metal"],
    orderBy: { timestamp: "desc" }
  });

  return NextResponse.json(rows);
}