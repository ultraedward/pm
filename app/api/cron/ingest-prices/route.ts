import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const METAL_MAP: Record<string, string> = {
  gold: "XAU",
  silver: "XAG",
  platinum: "XPT",
  palladium: "XPD",
};

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

export async function GET(req: Request) {
  // 🔐 CRON AUTH
  const auth = req.headers.get("authorization");
  const token = auth?.replace("Bearer ", "");

  if (!token || token !== process.env.CRON_SECRET) {
    return unauthorized();
  }

  try {
    // 🌐 FETCH UPSTREAM PRICES
    const res = await fetch(process.env.METALS_API_URL!, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Upstream failed: ${res.status}`);
    }

    const json = await res.json();

    // 🚨 HARD LOG — DO NOT REMOVE
    console.log("🔎 RAW METALS RESPONSE", JSON.stringify(json, null, 2));

    if (!json?.items || !Array.isArray(json.items)) {
      throw new Error("Invalid upstream payload: missing items[]");
    }

    let inserted = 0;

    for (const [metal, symbol] of Object.entries(METAL_MAP)) {
      const item = json.items.find(
        (i: any) =>
          i.curr === "USD" &&
          (i.metal === symbol || i.symbol === symbol)
      );

      if (!item) {
        console.warn(`⚠️ Missing price for ${metal}`);
        continue;
      }

      const price =
        Number(item.price) ||
        Number(item.usd) ||
        Number(item.value);

      if (!price || Number.isNaN(price)) {
        console.warn(`⚠️ Invalid price for ${metal}`, item);
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
    console.error("❌ INGEST FAILED", err);
    return NextResponse.json(
      { ok: false, error: "ingest_failed", message: err.message },
      { status: 500 }
    );
  }
}