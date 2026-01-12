import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type Metal = "gold" | "silver" | "platinum" | "palladium";
const METALS: Metal[] = ["gold", "silver", "platinum", "palladium"];

function mockPrices(): Record<Metal, number> {
  return {
    gold: 2050,
    silver: 25.4,
    platinum: 920,
    palladium: 980,
  };
}

export async function GET() {
  const prices = mockPrices();

  // check if we already have history
  const count = await prisma.price.count();

  const now = Date.now();

  // SEED 24 HOURS (hourly) IF EMPTY
  if (count === 0) {
    for (let h = 24; h >= 0; h--) {
      const t = new Date(now - h * 60 * 60 * 1000);

      for (const metal of METALS) {
        await prisma.price.create({
          data: {
            metal,
            price:
              prices[metal] *
              (1 + (Math.random() - 0.5) * 0.02),
            timestamp: t,
          },
        });
      }
    }
  } else {
    // normal ingest
    const t = new Date();
    for (const metal of METALS) {
      await prisma.price.create({
        data: {
          metal,
          price: prices[metal],
          timestamp: t,
        },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
