// app/api/prices/current/route.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE
// Returns latest price + 24h % change per metal
// FIX: Convert Prisma Decimal -> number before arithmetic

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const METALS = ["gold", "silver", "platinum", "palladium"] as const;

export async function GET() {
  try {
    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000;

    const prices = await Promise.all(
      METALS.map(async (metal) => {
        const latest = await prisma.spotPriceCache.findFirst({
          where: { metal },
          orderBy: { createdAt: "desc" },
        });

        if (!latest) return null;

        const past = await prisma.spotPriceCache.findFirst({
          where: {
            metal,
            createdAt: {
              lte: new Date(now - DAY_MS),
            },
          },
          orderBy: { createdAt: "desc" },
        });

        const latestPrice = Number(latest.price);
        const pastPrice = past ? Number(past.price) : null;

        const changePct =
          pastPrice !== null && pastPrice !== 0
            ? ((latestPrice - pastPrice) / pastPrice) * 100
            : null;

        return {
          metal,
          price: latestPrice,
          createdAt: latest.createdAt,
          changePct,
        };
      })
    );

    return NextResponse.json({
      ok: true,
      prices: prices.filter(Boolean),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Failed to load prices" },
      { status: 500 }
    );
  }
}
