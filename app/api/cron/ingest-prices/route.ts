// app/api/cron/ingest-prices/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const METALS_API_URL = process.env.METALS_API_URL;
const METALS_API_KEY = process.env.METALS_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET;

const METAL_MAP: Record<string, string> = {
  gold: "XAU",
  silver: "XAG",
  platinum: "XPT",
  palladium: "XPD",
};

export async function GET(req: Request) {
  // 🔐 AUTH
  const auth = req.headers.get("authorization");
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  // 🔴 HARD FAIL if env missing
  if (!METALS_API_URL) {
    return NextResponse.json(
      { ok: false, error: "missing_env", var: "METALS_API_URL" },
      { status: 500 }
    );
  }

  try {
    const url = new URL(METALS_API_URL);

    // If your provider expects an API key, uncomment ONE of these
    if (METALS_API_KEY) {
      // Option A: query param
      url.searchParams.set("api_key", METALS_API_KEY);

      // Option B: header (comment out Option A if this is required instead)
      // headers: { Authorization: `Bearer ${METALS_API_KEY}` }
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
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

    let inserted = 0;

    for (const [metal, symbol] of Object.entries(METAL_MAP)) {
      const item =
        json.items?.find(
          (i: any) => i.curr === "USD" && i.metal === symbol
        ) ??
        json.data?.[`${symbol}USD`] ??
        null;

      if (!item) {
        console.warn("⚠️ Missing metal:", metal);
        continue;
      }

      const price = Number(item.price ?? item.value ?? item.rate);

      if (!price || Number.isNaN(price)) {
        console.warn("⚠️ Invalid price for", metal, item);
        continue;
      }

      await prisma.priceHistory.create({
        data: {
          metal,
          price,
        },
      });

      inserted++;
    }

    return NextResponse.json({ ok: true, inserted });
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