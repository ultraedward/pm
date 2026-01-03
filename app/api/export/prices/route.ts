import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Schema-safe export: return all prices for now
  const prices = await prisma.$queryRaw<
    {
      metal: string;
      price: number;
      timestamp: Date;
    }[]
  >`
    SELECT metal, price, timestamp
    FROM "Price"
    ORDER BY timestamp DESC
  `;

  return NextResponse.json(prices);
}
