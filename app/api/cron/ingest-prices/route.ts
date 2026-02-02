// app/api/cron/ingest-prices/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const METALS_API_URL = process.env.METALS_API_URL!;
const METALS_API_KEY = process.env.METALS_API_KEY!;
const CRON_SECRET = process.env.CRON_SECRET!;

// We store metals internally as simple names
// Upstream API wants a *comma-separated string*
const METAL_SYMBOLS = "XAUUSD,XAGUSD,XPTUSD,XPDUSD";

const SYMBOL_TO_METAL: Record<string, string> = {
  XAUUSD: "gold",
  XAGUSD: "silver",
  XPTUSD: "platinum",
  XPDUSD: "palladium",
};

export async function GET(req: Request) {
  // 🔐 AUTH
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  try {
    // ✅ Build URL exactly as API expects
    const url = new URL(METALS_API_URL);

    url.searchParams.set("access_key", METALS_API_KEY);
    url.searchParams.set("symbols", METAL_SYMBOLS);
    url.searchParams.set("currencies", "USD");

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("❌ METALS API ERROR", {
        status: res.status,
        body: text,
        url: url.toString(),
      });

      return NextResponse.json(
        {
          ok: false,
          error: "ingest_failed",
          upstreamStatus: res.status,
          upstreamBody: text,
        },
        { status: 500 }
      );
    }

    const json = JSON.parse(text);

    if (!json.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "upstream_error",
          details: json.error,
        },
        { status: 500 }
      );
    }

    let inserted = 0;

    // Expected shape:
    // json.rates = { XAUUSD: 2050.12, ... }
    for (const [symbol, price] of Object.entries(json.rates ?? {})) {
      const metal = SYMBOL_TO_METAL[symbol];
      if (!metal) continue;

      const numericPrice = Number(price);
      if (!numericPrice || Number.isNaN(numericPrice)) continue;

      await prisma.priceHistory.create({
        data: {
          metal,
          price: numericPrice,
        },
      });

      inserted++;
    }

    return NextResponse.json({
      ok: true,
      inserted,
    });
  } catch (err: any) {
    console.error("💥 INGEST CRASH", err);
    return NextResponse.json(
      {
        ok: false,
        error: "ingest_failed",
        message: err?.message ?? "unknown",
      },
      { status: 500 }
    );
  }
}