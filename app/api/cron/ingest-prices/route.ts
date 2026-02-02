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

  // 🔎 ENV GUARDS
  if (!METALS_API_URL) {
    return NextResponse.json(
      { ok: false, error: "METALS_API_URL missing" },
      { status: 500 }
    );
  }

  if (!METALS_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "METALS_API_KEY missing" },
      { status: 500 }
    );
  }

  try {
    // 🌐 FETCH UPSTREAM
    const url =
      `${METALS_API_URL}` +
      `?access_key=${METALS_API_KEY}` +
      `&base=USD` +
      `&symbols=${Object.values(METAL_MAP).join(",")}`;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text();
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

    const json = await res.json();

    if (!json?.rates && !json?.items) {
      return NextResponse.json(
        { ok: false, error: "invalid_upstream_response" },
        { status: 500 }
      );
    }

    let inserted = 0;

    // 🔁 INSERT LOOP (SAFE)
    for (const [metal, symbol] of Object.entries(METAL_MAP)) {
      const item =
        json.items?.find(
          (i: any) => i.curr === "USD" && i.metal === symbol
        ) ??
        (json.rates
          ? { price: json.rates[symbol] }
          : null);

      if (!item) {
        console.warn("⚠️ Missing price for", metal);
        continue;
      }

      const price = Number(item.price ?? item.xauPrice);

      // ❌ INVALID NUMBER
      if (!Number.isFinite(price)) {
        console.warn("⚠️ Invalid price for", metal, price);
        continue;
      }

      // ❌ SANITY GUARD (prevents 0.000xx junk)
      if (price < 1 || price > 100_000) {
        console.warn("⚠️ Skipping suspicious price", { metal, price });
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

    return NextResponse.json({
      ok: true,
      inserted,
    });
  } catch (err: any) {
    console.error("INGEST ERROR", err);
    return NextResponse.json(
      {
        ok: false,
        error: "ingest_failed",
        message: err?.message ?? "unknown_error",
      },
      { status: 500 }
    );
  }
}