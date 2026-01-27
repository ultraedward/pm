export const dynamic = "force-dynamic";
export const revalidate = 0;

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const rows = await prisma.priceHistory.findMany({
    orderBy: { timestamp: "desc" },
    take: 4,
  });

  return NextResponse.json(rows);
}