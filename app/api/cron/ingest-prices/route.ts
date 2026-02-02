import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCronAuth } from "@/lib/cronAuth";

export const dynamic = "force-dynamic";

const METAL_MAP: Record<string, string> = {
  gold: "XAU",
  silver: "XAG",
  platinum: "XPT",
  palladium: "XPD",
};

export async function GET(req: Request) {
  if (!requireCronAuth(req)) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  const url = process.env.METALS_API_URL;
  if (!url) {
    return NextResponse.json(
      { ok: false, error: "METALS_API_URL missing" },
      { status: 500 }
    );
  }

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const body = await res.text();
    return NextResponse.json(
      {
        ok: false,
        error: "upstream_error",
        upstreamStatus: res.status,
        upstreamBody: body,
      },
      { status: 500 }
    );
  }

  const json = await res.json();
  if (!Array.isArray(json?.items)) {
    return NextResponse.json(
      { ok: false, error: "invalid_upstream_payload" },
      { status: 500 }
    );
  }

  let inserted = 0;
  let skipped = 0;

  for (const [metal, symbol] of Object.entries(METAL_MAP)) {
    const item = json.items.find(
      (i: any) => i.curr === "USD" && i.metal === symbol
    );

    if (!item) {
      console.warn("⚠️ Missing", metal);
      skipped++;
      continue;
    }

    const price = Number(item.price);

    // 🔒 HARD GUARD — DO NOT INSERT BAD DATA
    if (!Number.isFinite(price) || price < 10) {
      console.warn("❌ Invalid price for", metal, price);
      skipped++;
      continue;
    }

    await prisma.priceHistory.create({
      data: { metal, price },
    });

    inserted++;
  }

  return NextResponse.json({
    ok: true,
    inserted,
    skipped,
  });
}