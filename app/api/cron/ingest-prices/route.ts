import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const METALS = ["gold", "silver", "platinum", "palladium"];

export async function GET() {
  const now = new Date();

  for (const metal of METALS) {
    await prisma.priceHistory.create({
      data: {
        metal,
        price: Math.random() * 3000 + 500,
        timestamp: now
      }
    });
  }

  return NextResponse.json({ ok: true });
}