import { NextResponse } from "next/server";
import { getPriceHistory } from "@/lib/priceEngine";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const range =
      (searchParams.get("range") as "24h" | "7d" | "30d" | "1y") || "24h";

    const history = await getPriceHistory(range);

    return NextResponse.json({
      ok: true,
      range,
      gold: history.gold,
      silver: history.silver
    });
  } catch (error) {
    console.error("History API failure:", error);

    return NextResponse.json({
      ok: false,
      gold: [],
      silver: []
    });
  }
}