import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // 🔐 AUTH
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET) {
    console.error("❌ CRON_SECRET is not set in environment");
    return NextResponse.json(
      { ok: false, error: "server_misconfigured" },
      { status: 500 }
    );
  }

  if (!authHeader || authHeader !== expected) {
    console.warn("❌ Unauthorized cron call", {
      authHeader,
      expected,
    });

    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(
      "https://data-asg.goldprice.org/dbXRates/USD",
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("price_fetch_failed");
    }

    const json = await res.json();

    const METAL_MAP: Record<string, string> = {
      gold: "XAU",
      silver: "XAG",
      platinum: "XPT",
      palladium: "XPD",
    };

    let inserted = 0;

    for (const [metal, symbol] of Object.entries(METAL_MAP)) {
      const item = json.items?.find(
        (i: any) => i.curr === "USD" && i.metal === symbol
      );

      if (!item) continue;

      const price = Number(item.price);
      if (!price || Number.isNaN(price)) continue;

      await prisma.priceHistory.create({
        data: { metal, price },
      });

      inserted++;
    }

    return NextResponse.json({ ok: true, inserted });
  } catch (err) {
    console.error("INGEST ERROR", err);
    return NextResponse.json(
      { ok: false, error: "ingest_failed" },
      { status: 500 }
    );
  }
}