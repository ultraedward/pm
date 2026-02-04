import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function parseRange(range: string | null): Date {
  const now = new Date();

  if (!range) {
    now.setDate(now.getDate() - 1);
    return now;
  }

  // Accept formats: 24h, 7d, 30d
  const match = range.match(/^(\d+)(h|d)$/);

  if (!match) {
    // fallback: last 24h
    now.setDate(now.getDate() - 1);
    return now;
  }

  const value = Number(match[1]);
  const unit = match[2];

  if (unit === "h") {
    now.setHours(now.getHours() - value);
  } else {
    now.setDate(now.getDate() - value);
  }

  return now;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range");

    const since = parseRange(range);

    const prices = await prisma.priceHistory.findMany({
      where: {
        createdAt: {
          gte: since,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group by metal for charts
    const grouped = {
      gold: [] as { t: number; price: number }[],
      silver: [] as { t: number; price: number }[],
      platinum: [] as { t: number; price: number }[],
      palladium: [] as { t: number; price: number }[],
    };

    for (const p of prices) {
      if (grouped[p.metal as keyof typeof grouped]) {
        grouped[p.metal as keyof typeof grouped].push({
          t: p.createdAt.getTime(),
          price: p.price,
        });
      }
    }

    return NextResponse.json(grouped);
  } catch (err) {
    console.error("charts/prices error:", err);
    return NextResponse.json(
      { error: "failed_to_load_prices" },
      { status: 500 }
    );
  }
}