import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasProAccess } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

const PRO_RANGES = new Set(["90d", "all"]);

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

    // 90d/all are Pro-only (see app/pricing). The chart UI already hides/locks
    // these behind /pricing for non-Pro users, but that's client-side only —
    // without this check, anyone could call this route directly with
    // range=all and get the full history for free. Belt and suspenders.
    if (PRO_RANGES.has(range)) {
      const session = await getServerSession(authOptions);
      let isPro = false;

      if (session?.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { subscriptionStatus: true, proUntil: true },
        });
        isPro = hasProAccess({
          stripeStatus: dbUser?.subscriptionStatus,
          proUntil: dbUser?.proUntil,
        });
      }

      if (!isPro) {
        return NextResponse.json(
          { error: "Pro required for this range. Upgrade at /pricing." },
          { status: 403 }
        );
      }
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