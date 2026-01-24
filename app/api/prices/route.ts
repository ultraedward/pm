import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.$queryRaw<
      {
        metal: string;
        price: number;
        timestamp: Date;
      }[]
    >`
      SELECT metal, price, timestamp
      FROM price_history
      ORDER BY timestamp ASC
      LIMIT 500
    `;

    // ALWAYS return an array
    return NextResponse.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error("[api/prices] failed", err);

    // NEVER return an object — UI expects array
    return NextResponse.json([]);
  }
}