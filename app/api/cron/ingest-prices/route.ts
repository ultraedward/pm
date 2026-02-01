import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const METALS = ["gold", "silver", "platinum", "palladium"] as const;

// 🔐 Simple cron auth
function assertAuthorized(req: Request) {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return false;
  }
  return true;
}

export async function GET(req: Request) {
  if (!assertAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    // 🔥 EXTERNAL PRICE SOURCE (replace if you want later)
    const res = await fetch("https://api.metals.dev/v1/latest?currency=USD", {
      headers: {
        Authorization: `Bearer ${process.env.METALS_API_KEY}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Price API failed: ${res.status}`);
    }

    const json = await res.json();

    if (!json?.rates) {
      throw new Error("Invalid price payload");
    }

    const inserts = [];

    for (const metal of METALS) {
      const price = json.rates[metal];

      if (typeof price !== "number") {
        console.warn(`Skipping ${metal}, invalid price`);
        continue;
      }

      inserts.push(
        prisma.priceHistory.create({
          data: {
            metal,
            price,
          },
        })
      );
    }

    const results = await Promise.all(inserts);

    return NextResponse.json({
      ok: true,
      inserted: results.length,
      metals: results.map(r => r.metal),
    });
  } catch (err) {
    console.error("INGEST PRICES ERROR", err);
    return NextResponse.json(
      { ok: false, error: "ingest_failed" },
      { status: 500 }
    );
  }
}