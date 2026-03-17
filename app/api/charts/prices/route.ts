import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RangeKey = "24h" | "7d" | "30d" | "90d" | "all";
type MetalKey = "gold" | "silver" | "platinum" | "palladium";

type PriceRow = {
  price: number;
  timestamp: Date;
};

function getRangeStart(range: RangeKey): Date | null {
  const now = Date.now();

  switch (range) {
    case "24h":
      return new Date(now - 24 * 60 * 60 * 1000);
    case "7d":
      return new Date(now - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now - 30 * 24 * 60 * 60 * 1000);
    case "90d":
      return new Date(now - 90 * 24 * 60 * 60 * 1000);
    case "all":
      return null;
    default:
      return new Date(now - 24 * 60 * 60 * 1000);
  }
}

function getBucketSizeMs(range: RangeKey): number {
  switch (range) {
    case "24h":
      return 5 * 60 * 1000;
    case "7d":
      return 60 * 60 * 1000;
    case "30d":
      return 6 * 60 * 60 * 1000;
    case "90d":
      return 24 * 60 * 60 * 1000;
    case "all":
      return 24 * 60 * 60 * 1000;
    default:
      return 5 * 60 * 1000;
  }
}

function bucketPrices(rows: PriceRow[], bucketSizeMs: number) {
  const buckets = new Map<number, PriceRow[]>();

  for (const row of rows) {
    const ts = new Date(row.timestamp).getTime();
    const bucketStart = Math.floor(ts / bucketSizeMs) * bucketSizeMs;

    if (!buckets.has(bucketStart)) {
      buckets.set(bucketStart, []);
    }

    buckets.get(bucketStart)!.push(row);
  }

  return Array.from(buckets.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([bucketStart, items]) => {
      const first = items[0];
      const last = items[items.length - 1];

      const high = Math.max(...items.map((item) => item.price));
      const low = Math.min(...items.map((item) => item.price));

      return {
        timestamp: new Date(bucketStart).toISOString(),
        open: first.price,
        close: last.price,
        high,
        low,
        price: last.price,
      };
    });
}

const ALL_METALS: MetalKey[] = ["gold", "silver", "platinum", "palladium"];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = (searchParams.get("range") || "7d") as RangeKey;

    if (!["24h", "7d", "30d", "90d", "all"].includes(range)) {
      return NextResponse.json(
        { error: "Invalid range. Use 24h, 7d, 30d, 90d, or all." },
        { status: 400 }
      );
    }

    const since = getRangeStart(range);
    const bucketSizeMs = getBucketSizeMs(range);

    // Fetch all 4 metals in parallel
    const results = await Promise.all(
      ALL_METALS.map((metal) =>
        prisma.price.findMany({
          where: {
            metal,
            ...(since ? { timestamp: { gte: since } } : {}),
          },
          orderBy: { timestamp: "asc" },
          select: { price: true, timestamp: true },
          ...(range === "all" ? { take: 10000 } : {}),
        })
      )
    );

    // Shape into { gold: [{t, price}], silver: [...], ... }
    const response: Record<MetalKey, { t: number; price: number }[]> = {
      gold: [], silver: [], platinum: [], palladium: [],
    };

    for (let i = 0; i < ALL_METALS.length; i++) {
      const metal = ALL_METALS[i];
      const bucketed = bucketPrices(results[i], bucketSizeMs);
      response[metal] = bucketed.map((b) => ({
        t: new Date(b.timestamp).getTime(),
        price: b.price,
      }));
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chart prices route failed:", error);
    return NextResponse.json(
      { error: "Failed to load chart prices" },
      { status: 500 }
    );
  }
}