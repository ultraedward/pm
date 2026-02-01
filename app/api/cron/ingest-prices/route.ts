import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    const token = auth.replace("Bearer ", "");
    if (token !== process.env.CRON_SECRET) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    console.log("✅ CRON AUTH OK");

    const res = await fetch("https://data-asg.goldprice.org/dbXRates/USD", {
      cache: "no-store",
    });

    console.log("🌐 FETCH STATUS:", res.status);

    const json = await res.json();
    console.log("🌐 RAW RESPONSE:", JSON.stringify(json));

    if (!json?.items?.length) {
      throw new Error("No price items returned");
    }

    const metals = ["gold", "silver", "platinum", "palladium"] as const;
    let inserted = 0;

    for (const metal of metals) {
      const item = json.items.find((i: any) =>
        i.curr === "USD" && i.metal?.toLowerCase() === metal
      );

      if (!item) {
        console.warn("⚠️ Missing metal:", metal);
        continue;
      }

      console.log("💰 INSERTING", metal, item.xauPrice ?? item.price);

      await prisma.priceHistory.create({
        data: {
          metal,
          price: Number(item.xauPrice ?? item.price),
        },
      });

      inserted++;
    }

    return NextResponse.json({
      ok: true,
      inserted,
    });
  } catch (err: any) {
    console.error("❌ INGEST ERROR:", err?.message || err);
    return NextResponse.json(
      { ok: false, error: "ingest_failed", detail: err?.message },
      { status: 500 }
    );
  }
}