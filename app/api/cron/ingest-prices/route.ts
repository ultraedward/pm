import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET!;
const METALS_API_URL = process.env.METALS_API_URL!;
const METALS_API_KEY = process.env.METALS_API_KEY!;

// Metals API uses plain symbols (USD is implicit)
const METAL_MAP: Record<string, string> = {
  XAU: "gold",
  XAG: "silver",
  XPT: "platinum",
  XPD: "palladium",
};

export async function GET(req: Request) {
  // 🔐 Auth
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  try {
    const url = new URL(METALS_API_URL);
    url.searchParams.set("access_key", METALS_API_KEY);
    url.searchParams.set("symbols", Object.keys(METAL_MAP).join(","));
    url.searchParams.set("base", "USD");

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const json = await res.json();

    // 🚨 EXPOSE REAL UPSTREAM ERROR
    if (!json.success) {
      console.error("❌ METALS API ERROR", json);
      return NextResponse.json(
        {
          ok: false,
          error: "upstream_error",
          details: json.error,
        },
        { status: 500 }
      );
    }

    if (!json.rates) {
      return NextResponse.json(
        { ok: false, error: "missing_rates" },
        { status: 500 }
      );
    }

    let inserted = 0;

    for (const [symbol, price] of Object.entries(json.rates)) {
      const metal = METAL_MAP[symbol];
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