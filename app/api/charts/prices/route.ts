import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const metal = searchParams.get("metal");
    const range = searchParams.get("range") ?? "24h";

    const hours =
      range === "7d" ? 168 :
      range === "30d" ? 720 :
      24;

    const rows = await prisma.$queryRaw<
      {
        metal: string;
        price: number;
        timestamp: Date;
      }[]
    >`
      SELECT metal, price, timestamp
      FROM price_history
      WHERE (${metal} IS NULL OR metal = ${metal})
        AND timestamp >= NOW() - INTERVAL '${hours} hours'
      ORDER BY timestamp ASC
    `;

    return NextResponse.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error("[api/charts/prices] failed", err);

    // 🚨 ABSOLUTE RULE: charts endpoints ALWAYS return arrays
    return NextResponse.json([]);
  }
}