// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const METALS = ["gold", "silver", "platinum", "palladium"];

export async function GET() {
  try {
    const now = new Date();

    // Fake prices for now (replace later with real feed)
    for (const metal of METALS) {
      await prisma.$executeRaw`
        INSERT INTO "PriceHistory" ("metal", "price", "timestamp")
        VALUES (${metal}, ${Math.random() * 3000 + 500}, ${now})
      `;
    }

    return NextResponse.json({ status: "ok", inserted: METALS.length });
  } catch (error) {
    console.error("Price ingest failed:", error);
    return NextResponse.json({ status: "failed" });
  }
}