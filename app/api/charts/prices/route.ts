import { NextRequest, NextResponse } from "next/server";

function generateMockPrices(range: "24h" | "7d" | "30d") {
  const now = Date.now();

  const points =
    range === "7d" ? 7 * 24 :
    range === "30d" ? 30 * 24 :
    24;

  let price = 2000;

  return Array.from({ length: points }).map((_, i) => {
    price += (Math.random() - 0.5) * 10;

    return {
      t: now - (points - i) * 60 * 60 * 1000,
      price: Number(price.toFixed(2)),
    };
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const range = (searchParams.get("range") as "24h" | "7d" | "30d") ?? "24h";

  return NextResponse.json(generateMockPrices(range));
}
